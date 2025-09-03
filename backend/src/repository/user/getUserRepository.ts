import type { RowDataPacket } from "mysql2"
import { db } from "../../configuration/mysql/conn.js"
import type { getUserResponse } from "../../response/user/getUserResponse.js"

export interface user extends RowDataPacket {
  name: string
  user: string
}

export default async function getUserRepository(user_id: string): Promise<getUserResponse> {
  const query = "SELECT name, user FROM user WHERE id = ?"
  const [rows] = await db.query<user[]>(query, [user_id])
  const row = rows[0]
  if (rows.length == 0 || !row) {
    throw new Error()
  }
  return {
    user_id: user_id,
    name: row.name,
    user: row.user
  }
}