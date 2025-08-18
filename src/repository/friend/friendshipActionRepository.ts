import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import { CannotDeleteError, FriendshipNotFoundError } from "../../error/friend/friendError.js"

export default async function friendshipActionRepository(user_id_from_cookie: string, friend_id: string, action: "accept" | "reject" | "delete") {
  switch (action) {
    case "accept":
      await updateAccepted(user_id_from_cookie, friend_id, true)
      break
    case "reject":
      await updateAccepted(user_id_from_cookie, friend_id, false)
      break
    case "delete":
      await deleteFriendship(user_id_from_cookie, friend_id)
      break
    default:
      throw new Error()
  }
}

async function updateAccepted(user_id_from_cookie: string, friend_id: string, accept: boolean) {
  let query = `SELECT 1 FROM friend WHERE user_id = ? AND friend_id = ? AND accepted IS ${accept ? "FALSE" : "TRUE"}`
  const [rows] = await db.query<RowDataPacket[]>(query, [friend_id, user_id_from_cookie, user_id_from_cookie, friend_id])
  if (rows.length == 0) {
    throw new FriendshipNotFoundError()
  }
  query = "UPDATE friend SET accepted = ? WHERE user_id = ? AND friend_id = ?"
  await db.execute(query, [accept, friend_id, user_id_from_cookie])
}

interface friendRows extends RowDataPacket {
  user_id: string
  friend_id: string
  accepted: boolean
}

async function deleteFriendship(user_id_from_cookie: string, friend_id: string) {
  let query = "SELECT user_id, friend_id, accepted FROM friend WHERE (user_id = ? AND friend_id = ?) || (user_id = ? AND friend_id = ?)"
  const [rows] = await db.query<friendRows[]>(query, [user_id_from_cookie, friend_id, friend_id, user_id_from_cookie])
  if (rows.length == 0) {
    throw new FriendshipNotFoundError()
  }

  const row = rows[0]
  if (!row?.user_id || !row.friend_id || row.accepted == undefined) {
    throw new Error()
  }

  if(!row.accepted && row.user_id != user_id_from_cookie) {
    throw new CannotDeleteError()
  }

  query = "DELETE FROM friend WHERE (user_id = ? AND friend_id = ?) || (user_id = ? AND friend_id = ?)"
  await db.execute(query, [user_id_from_cookie, friend_id, friend_id, user_id_from_cookie])
}