import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import { FriendshipNotFoundError } from "../../error/friend/friendError.js"
import updateData from "../../websocket/notification/updateData.js"

interface UserRow extends RowDataPacket {
  name: string
}

export default async function friendshipActionRepository(user_id_from_cookie: string, friend_id: string, action: "accept" | "reject" | "delete") {
  switch (action) {
    case "accept":
      await updateAccepted(user_id_from_cookie, friend_id, true)
      break
    case "reject":
      await deleteFriendship(user_id_from_cookie, friend_id)
      break
    case "delete":
      await deleteFriendship(user_id_from_cookie, friend_id)
      break
    default:
      throw new Error()
  }
}

async function updateAccepted(user_id_from_cookie: string, friend_id: string, accept: boolean) {
  let query = "SELECT 1 FROM friend WHERE user_id = ? AND friend_id = ? AND accepted IS NULL"
  const [rows_1] = await db.query<RowDataPacket[]>(query, [friend_id, user_id_from_cookie])
  if (rows_1.length == 0) {
    throw new FriendshipNotFoundError()
  }
  query = "UPDATE friend SET accepted = ? WHERE user_id = ? AND friend_id = ?"
  await db.execute(query, [accept, friend_id, user_id_from_cookie])

  query = "SELECT name FROM user WHERE id = ?"
  const [rows_2] = await db.query<UserRow[]>(query, [ user_id_from_cookie ])
  const row_2 = rows_2[0]
  if(!row_2) {
    throw new Error()
  }
  const [rows_3] = await db.query<UserRow[]>(query, [ friend_id ])
  const row_3 = rows_3[0]
  if(!row_3) {
    throw new Error()
  }

  updateData(user_id_from_cookie)
  updateData(friend_id)
}

interface friendRows extends RowDataPacket {
  user_id: string
  friend_id: string
  accepted: boolean | null
}

async function deleteFriendship(user_id_from_cookie: string, friend_id: string) {
  let query = "SELECT user_id, friend_id, accepted FROM friend WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)"
  const [rows] = await db.query<friendRows[]>(query, [user_id_from_cookie, friend_id, friend_id, user_id_from_cookie])
  if (rows.length == 0) {
    throw new FriendshipNotFoundError()
  }

  const row = rows[0]
  if (!row?.user_id || !row.friend_id || row.accepted === undefined) {
    throw new Error()
  }

  query = "DELETE FROM friend WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)"
  await db.execute(query, [user_id_from_cookie, friend_id, friend_id, user_id_from_cookie])
  updateData(user_id_from_cookie)
  updateData(friend_id)
}