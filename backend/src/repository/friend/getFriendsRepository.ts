import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import type getFriendsResponse from "../../response/friends/getFriends/getFriends.js"
import type { friendsResponse } from "../../response/friends/getFriends/getFriends.js"
import { getClientState, setUserFriends } from "../../websocket/notification/userState.js"

interface friendsRows extends RowDataPacket {
  user_id: string
  friend_id: string
  name: string
  user: string
  accepted: boolean | null
}

export default async function getFriendsRepository(user_id: string, last_user_cursor?: string): Promise<getFriendsResponse> {
  console.log("Init getFriendsRepository")
  const args = [user_id, user_id, user_id, user_id]
  const from = "friend AS f JOIN user AS u ON u.id = CASE WHEN f.user_id = ? THEN f.friend_id WHEN f.friend_id = ? THEN f.user_id END"
  let where = "? IN (f.user_id, f.friend_id) AND (f.accepted IS NOT FALSE AND NOT (f.accepted IS NULL AND f.user_id = ?))"
  if (last_user_cursor) {
    where += " AND u.user > ? "
    args.push(last_user_cursor)
  }
  let query = "SELECT f.user_id, f.friend_id, u.name, u.user, f.accepted FROM "+ from +" WHERE "+ where + " ORDER BY u.user ASC LIMIT 1 "
  const [rows_1] = await db.query<friendsRows[]>(query, args)
  
  let lastUser: string = ""
  const friends: friendsResponse[] = []
  const requests: friendsResponse[] = []
  for (let row of rows_1) {
    lastUser = row.user
    let friend_id = row.friend_id
    if (row.user_id != user_id) {
      friend_id = row.user_id
    }

    const on = getClientState(friend_id)

    if (row.accepted) {
      friends.push({
        user_id: friend_id,
        name: row.name,
        user: row.user,
        on: on
      })
      continue  
    }
    
    requests.push({
      user_id: friend_id,
      name: row.name,
      user: row.user,
      on: on
    })
  }

  const ids = friends.map((friend) => {
    return friend.user_id
  })
  const ids_ = requests.map((friend) => {
    return friend.user_id
  })
  const join = [...ids, ...ids_]

  setUserFriends(user_id, join)

  let next: boolean = false
  query = "SELECT 1 FROM "+ from +" WHERE "+ where + " AND u.user > ? " + "ORDER BY u.user ASC LIMIT 1"
  const [rows_2] = await db.query<RowDataPacket[]>(query, [...args, lastUser])
  if(rows_2.length > 0) {
    next = true
  }

  return {
    friends: friends,
    requests: requests,
    last_user: lastUser,
    next: next
  }
}