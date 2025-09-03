import type { IncomingMessage } from "http"
import WebSocket, { type Server } from "ws"
import { validateWSCookie } from "../cookie/cookie.js"
import { updateUserFriendsState } from "./userState.js"
import getUserByFriend from "../repository/friend/getUserByFriendRepository.js"
import { CookieError } from "../cookie/cookie-customError.js"
import type { messages } from "../response/response.js"
import responseWs from "./responseWs.js"


export const clients = new Map<string, WebSocket>()
export const userFriends = new Map<string, string[]>()
export const busy = new Map<string, string>()

export default function WSConnection(wss: Server<typeof WebSocket, typeof IncomingMessage>) {
  wss.on("connection", (ws, req) => {
  try {
    const userId = validateWSCookie(req)
    clients.set(userId, ws)
    updateUserFriendsState(userId)
    ws.on("message", async (msg) => {
      try {
        const data = JSON.parse(msg.toString())
        switch (data.type) {
          case "offer": {
            const user = await getUserByFriend(userId, data.friend_id)
            if (!user) {
              console.log("friendship not found")
              return
            }
            const busy_ = busy.get(data.friend_id)
            if (busy_) {
              return
            }
            const targetWS = clients.get(data.friend_id)
            if (targetWS && targetWS.readyState === WebSocket.OPEN) {
              targetWS.send(JSON.stringify({
                type: "offer",
                sdp: data.sdp,
                from: userId,
                user: user,
              }))
              busy.set(data.friend_id, userId)
              updateUserFriendsState(data.friend_id)
            }
            busy.set(userId, data.friend_id)
            updateUserFriendsState(userId)
            break
          }
          case "answer": {
            const offererWS = clients.get(data.friend_id)
            if (offererWS && offererWS.readyState === WebSocket.OPEN) {
              offererWS.send(JSON.stringify({
                type: "answer",
                sdp: data.sdp,
                from: userId
              }))
            }
            break
          }
          case "ice": {
            const peerWS = clients.get(data.friend_id)
            if (peerWS && peerWS.readyState === WebSocket.OPEN) {
              peerWS.send(JSON.stringify({
                type: "ice",
                candidate: data.candidate,
                from: userId
              }))
            }
            break
          }

          case "unbusy":
            busy.delete(userId)
            updateUserFriendsState(userId)
            break

          case "desconect": {
            const targetWS = clients.get(data.friend_id)
            if (targetWS && targetWS.readyState === WebSocket.OPEN) {
              targetWS.send(JSON.stringify({
                type: "desconect",
              }))
            }
            break
          }
            
        }
      } catch (error) {
        console.log(error)
      }
    })
    ws.on("close", () => {
      clients.delete(userId)
      updateUserFriendsState(userId)
      userFriends.delete(userId)
      const friend_id = busy.get(userId)
      if (friend_id) { 
        busy.delete(friend_id)
        const targetWS = clients.get(friend_id)
        if (targetWS && targetWS.readyState === WebSocket.OPEN) {
          targetWS.send(JSON.stringify({
            type: "desconect",
          }))
        }
      }
      busy.delete(userId)
    })
  } catch (error) {
    if (error instanceof CookieError) {
      const msg: messages = "invalid cookie"
      console.log(msg)
      ws.send(JSON.stringify(responseWs(msg)))
      ws.close()
      return
    }
    console.log(error)
    ws.send(JSON.stringify(responseWs("server error")))
    ws.close()
  }
  })
}