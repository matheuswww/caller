import updateData from "./updateData.js";
import { clients, userFriends } from "./WSconnection.js";

export function getClientState(user_id: string):boolean {
  const conn = clients.get(user_id) 
  return conn ? true : false
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