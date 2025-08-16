import express from 'express'
import { createServer } from 'http'
import initUserRoutes from './router/user/initUserRouter.js'
import { createMysqlConn } from './configuration/mysql/conn.js'
import initFriendRoutes from './router/friend/initFriendRouter.js'

const app = express()
const server = createServer(app)

app.use(express.json())

createMysqlConn()
initUserRoutes(app)
initFriendRoutes(app)
server.listen(3000, () => {
  console.log("running in 3000")  
})