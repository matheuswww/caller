import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import type { friendsResponse } from "../../response/friends/getFriends/getFriends.js"
import { getClientState } from "../../websocket/notification/userState.js"

interface userRow extends RowDataPacket {
  id: string
  name: string
  user: string
}

export default async function getUserByFriend(user_id: string, friend_id: string): Promise<friendsResponse | null> {
  console.log("Init getUserByFriend")
  
  const query = "SELECT u.id, u.name, u.user, f.accepted FROM friend AS f JOIN user AS u ON u.id = CASE WHEN f.user_id = ? THEN f.user_id ELSE f.friend_id END WHERE ((f.user_id = ? AND f.friend_id = ?) OR (f.user_id = ? AND f.friend_id = ?)) AND f.accepted IS TRUE LIMIT 1"
  
  const [rows] = await db.query<userRow[]>(query, [user_id, user_id, friend_id, friend_id, user_id])

  if (rows.length === 0) {
    return null
  }

  const row = rows[0]
  if (!row) {
    return null
  }

  const state = getClientState(friend_id)
  return {
    user_id: row.id,
    name: row.name,
    user: row.user,
    state: state
  }
}
