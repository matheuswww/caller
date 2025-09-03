import updateData from "./updateData.js";
import { busy, clients, userFriends } from "./WSconnection.js";

export function getClientState(user_id: string): "on" | "off" | "busy" {
  const busy_ = busy.get(user_id)
  const conn = clients.get(user_id)
  return busy_ ? "busy" : conn ? "on" : "off"
}

export function setUserFriends(user_id: string, friends: string[]) {
  userFriends.set(user_id, friends)
}

export function updateUserFriendsState(user_id: string) {
  const friends = userFriends.get(user_id)
  friends?.forEach((friend_id) => {
    const on = getClientState(friend_id)
    if (on) {
      updateData(friend_id)
    }
  })
}