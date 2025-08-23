import WebSocket from "ws";
import getFriendsRepository from "../../repository/friend/getFriendsRepository.js";
import getNotificationsRepository from "../../repository/notification/getNotifications.js";
import type getFriendsResponse from "../../response/friends/getFriends/getFriends.js";
import type getNotifications from "../../response/notification/getNotifications.js";
import { clients } from "./WSconnection.js";

interface data {
  notifications: getNotifications[]
  friends: getFriendsResponse
}

export default async function updateData(userId: string) {
  console.log("Init update data")
  try {
    const ws = clients.get(userId)
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const notifications = await getNotificationsRepository(userId)
    const friends = await getFriendsRepository(userId)
    const res: data =  {
      friends: friends,
      notifications: notifications
    }
    ws.send(JSON.stringify(res))
  } catch (error) {
    console.log(error)
  }
}