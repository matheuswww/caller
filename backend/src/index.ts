import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import { createMysqlConn } from "./configuration/mysql/conn.js";
import initUserRoutes from "./router/user/initUserRouter.js";
import initFriendRoutes from "./router/friend/initFriendRouter.js";
import WSConnection from "./websocket/WSconnection.js";
import path from "path";
import runMigrations from "./configuration/migration/run.js";

const IMG_FOLDER = path.join(process.cwd(), "img");
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: "https://192.168.0.106:3443",
  credentials: true
}));

app.use(express.json());

createMysqlConn();
WSConnection(wss);
initUserRoutes(app);
initFriendRoutes(app);
app.use("/images", express.static(IMG_FOLDER));

server.listen(5000, () => {
  console.log("running in 5000");  
});
