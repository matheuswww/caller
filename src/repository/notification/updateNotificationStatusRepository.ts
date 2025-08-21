import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import { NotificationNotFound } from "../../error/notification/notificationError.js"

export default async function updateNotificationStatusRepository(user_id: string, id: string) {
  let query = "SELECT 1 FROM notification WHERE user_id = ? AND id = ?"
  const [rows] = await db.query<RowDataPacket[]>(query, [user_id, id])
  if(rows.length === 0) {
    throw new NotificationNotFound()
  }

  query = "UPDATE notification SET is_read = TRUE WHERE user_id = ? AND id = ?"
  await db.execute(query, [user_id, id])
}