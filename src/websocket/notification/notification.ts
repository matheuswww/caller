import type { IncomingMessage } from "http";
import WebSocket, { type Server } from "ws";
import { validateWSCookie } from "../../cookie/cookie.js";
import { CookieError } from "../../cookie/cookie-customError.js";
import type { messages } from "../../response/response.js";

export const clients = new Map<string, WebSocket>();

export default function notification(wss: Server<typeof WebSocket, typeof IncomingMessage>) {
  wss.on("connection", (ws, req) => {
    try {
      const userId = validateWSCookie(req)
      clients.set(userId, ws)
      console.log("Connected: ", userId)

      

      ws.on("close", () => {
        clients.delete(userId)
        console.log("Closed:", userId)
      })
    } catch (error) {
      if (error instanceof CookieError) {
        const msg: messages = "invalid cookie"
        console.log(msg)
      } else {
        console.log(error)
      }
      ws.close()
    }
  })
}