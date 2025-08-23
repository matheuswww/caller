import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { createMysqlConn } from "./configuration/mysql/conn.js";
import WSConnection from "./websocket/notification/WSconnection.js";
import initUserRoutes from "./router/user/initUserRouter.js";
import initFriendRoutes from "./router/friend/initFriendRouter.js";
import initNotificationRouter from "./router/notification/initNotificationRouter.js";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

createMysqlConn();
WSConnection(wss);
initUserRoutes(app);
initFriendRoutes(app);
initNotificationRouter(app);

server.listen(5000, () => {
  console.log("running in 5000");  
});
