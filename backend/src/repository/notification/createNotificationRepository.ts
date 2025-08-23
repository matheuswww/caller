import { v4 as uuidv4 } from "uuid"
import { db } from "../../configuration/mysql/conn.js"

export default async function createNotificationRepository(user_id: string, subject: string) {
  console.log("Init createNotificationRepository")
  const id = uuidv4()
  const query = "INSERT INTO notification (id, user_id, subject, is_read) VALUES(?, ?, ?, ?)"
  await db.execute(query, [id, user_id, subject, false])
}