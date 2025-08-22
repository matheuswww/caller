import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"

export default async function friendShipExists(user_id: string, friend_id: string): Promise<boolean> {
  const query = "SELECT 1 FROM friend WHERE (user_id = ? AND friend_id = ?) OR (friend_id = ? AND user_id = ?)"
  const [rows] = await db.query<RowDataPacket[]>(query, [user_id, friend_id, friend_id, user_id])
  if (rows.length == 0) {
    return false
  }

  return true
}