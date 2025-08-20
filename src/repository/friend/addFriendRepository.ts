import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import { UserNotFound } from "../../error/user/userError.js"
import { AlreadyFriends, AlreadySent, SelfFriendError } from "../../error/friend/friendError.js"

interface UserRow extends RowDataPacket {
  id: string
}

interface FriendRow extends RowDataPacket {
  accepted: boolean
}

export default async function addFriendRepository(user_id: string, friend: string) {
  console.log("Init addFriendRepository")
  
  let query = "SELECT id FROM user WHERE user = ?"
  const [rows_1] = await db.query<UserRow[]>(query, [friend])

  if(rows_1.length == 0) {
    throw new UserNotFound()
  }
  const row_1 = rows_1[0]
  const friend_id = row_1?.id
  if(!friend_id) {
    throw new Error()
  }
  if (user_id == friend_id) {
    throw new SelfFriendError()
  }

  query = "SELECT accepted FROM friend WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)"
  const [rows_2] = await db.query<FriendRow[]>(query, [user_id, friend_id, friend_id, user_id])
  
  if (rows_2.length > 0) {
    const row = rows_2[0]
    if(row?.accepted === undefined) {
      throw Error()
    }
    if(row.accepted) {
      throw new AlreadyFriends()
    }
    throw new AlreadySent()
  }

  query = "INSERT INTO friend (user_id, friend_id) VALUES (?, ?)"
  await db.execute(query, [ user_id, friend_id ])
}