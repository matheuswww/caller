import type { IncomingMessage } from "http"
import WebSocket, { type Server } from "ws"
import { validateWSCookie } from "../../cookie/cookie.js"
import { CookieError } from "../../cookie/cookie-customError.js"
import type { messages } from "../../response/response.js"
import responseWs from "./responseWs.js"
import getUserByFriend from "../../repository/friend/getUserByFriendRepository.js"
import { updateUserFriendsState } from "./userState.js"

export const clients = new Map<string, WebSocket>()
export const userFriends = new Map<string, string[]>()

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
              ws.send(JSON.stringify(responseWs("friendship not found")))
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
            }
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
            }      clients.delete(userId)

            break
          }
          case "cancel": {
            const targetWS = clients.get(data.friend_id)
            if (targetWS && targetWS.readyState === WebSocket.OPEN) {
              targetWS.send(JSON.stringify({
                type: "cancel",
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