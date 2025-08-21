import express from 'express'
import { createServer } from 'http'
import initUserRoutes from './router/user/initUserRouter.js'
import { createMysqlConn } from './configuration/mysql/conn.js'
import initFriendRoutes from './router/friend/initFriendRouter.js'
import { WebSocketServer, WebSocket } from "ws";
import notification from './websocket/notification/notification.js'
import initNotificationRouter from './router/notification/initNotificationRouter.js'


const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server });

app.use(express.json())

createMysqlConn()
notification(wss)
initUserRoutes(app)
initFriendRoutes(app)
initNotificationRouter(app)
server.listen(3000, () => {
  console.log("running in 3000")  
})