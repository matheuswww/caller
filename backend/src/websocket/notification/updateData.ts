import WebSocket from "ws";
import getFriendsRepository from "../../repository/friend/getFriendsRepository.js";
import type getFriendsResponse from "../../response/friends/getFriends/getFriends.js";
import { clients } from "./WSconnection.js";

interface data {
  friends: getFriendsResponse
}

export default async function updateData(userId: string) {
  console.log("Init update data")
  try {
    const ws = clients.get(userId)
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const friends = await getFriendsRepository(userId)
    const res: data =  {
      friends: friends,
    }
    ws.send(JSON.stringify(res))
  } catch (error) {
    console.log(error)
  }
}