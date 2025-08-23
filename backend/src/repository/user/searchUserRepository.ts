import type { RowDataPacket } from "mysql2";
import { db } from "../../configuration/mysql/conn.js";
import type { searchUserResponse } from "../../response/user/searchUser.js";

interface user extends RowDataPacket {
  id: string
  name: string
  user: string
}

export default async function SearchUserRepository(user: string): Promise<searchUserResponse[]> {
  console.log("Init SearchUserRepository")
  
  const query = "SELECT id, name, user FROM user WHERE user LIKE CONCAT('%', ?, '%')";

  const [rows] = await db.query<user[]>(query, user)
  const users: searchUserResponse[] = []
  for (let row of rows) {
    users.push({
      user_id: row.id,
      name: row.name,
      user: row.user
    })
  }
  
  return users
}