import type { RowDataPacket } from "mysql2";
import { db } from "../../configuration/mysql/conn.js";
import type { signinRequest } from "../../validator/user/signin.js";
import { UserInvalidPassword, UserNotFound } from "../../error/user/userError.js";
import bcrypt from "bcrypt";

interface UserRow extends RowDataPacket {
  id: string;
  password: string;
}

export default async function signinRepository(user: signinRequest): Promise<string> {
  const query = "SELECT id, password FROM user WHERE email = ?"
  const [rows] = await db.query<UserRow[]>(query, [user.email])
  
  if(rows.length == 0) {
    throw new UserNotFound()
  }

  const row = rows[0]
  const hashed = row?.password
  const id = row?.id

  if (!id || !hashed) {
    throw new Error()
  }


  if (!(await bcrypt.compare(user.password, hashed))) {
    throw new UserInvalidPassword()
  }

  return id
}