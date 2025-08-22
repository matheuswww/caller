import express from 'express'
import { createServer } from 'http'
import initUserRoutes from './router/user/initUserRouter.js'
import { createMysqlConn } from './configuration/mysql/conn.js'
import initFriendRoutes from './router/friend/initFriendRouter.js'
import { WebSocketServer, WebSocket } from "ws";
import initNotificationRouter from './router/notification/initNotificationRouter.js'
import WSConnection from './websocket/notification/WSconnection.js'


const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server });

app.use(express.json())

createMysqlConn()
WSConnection(wss)
initUserRoutes(app)
initFriendRoutes(app)
initNotificationRouter(app)
server.listen(3000, () => {
  console.log("running in 3000")  
})