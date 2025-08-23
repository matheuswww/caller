import type { RowDataPacket } from "mysql2";
import { db } from "../../configuration/mysql/conn.js";
import type getNotifications from "../../response/notification/getNotifications.js";

interface getNotificationsRow extends RowDataPacket {
  id: string
  subject: string
  is_read: boolean
}

export default async function getNotificationsRepository(user_id: string): Promise<getNotifications[]> {
  console.log("Init getNotifications Repository")
  let notifications: getNotifications[] = []

  const query = "SELECT id, subject, is_read FROM notification WHERE user_id = ?"
  const [rows] = await db.query<getNotificationsRow[]>(query, [user_id])

  for (let row of rows) {
    notifications.push({
      id: row.id,
      subject: row.subject,
      read: row.is_read ? true : false
    })
  }

  return notifications
}