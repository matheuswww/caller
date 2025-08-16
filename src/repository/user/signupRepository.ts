import { v4 as uuidv4 } from 'uuid';
import { db } from "../../configuration/mysql/conn.js"
import type { signupRequest } from "../../validator/user/signup.js"

export default async function signupRepository(user: signupRequest): Promise<string> {
  console.log("Init signupRepository")
  const query = "INSERT INTO user (id, email, password, name) VALUES (?, ?, ?, ?)"

  const id = uuidv4()
  await db.execute(query, [id, user.email, user.password, user.name])

  return id
}