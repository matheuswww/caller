import { v4 as uuidv4 } from 'uuid';
import { db } from "../../configuration/mysql/conn.js"
import type { signupRequest } from "../../validator/user/signup.js"
import { ConflictEmailError, ConflictUserError } from '../../error/user/userError.js';
import type { RowDataPacket } from 'mysql2';
import bcrypt from "bcrypt";

export const bcryptRounds = 10

export default async function signupRepository(user: signupRequest, saveImg: (id: string, img: Express.Multer.File) => void): Promise<string> {
  let query = "SELECT 1 FROM user WHERE email = ? LIMIT 1 "
  const [emailRows] = await db.query<RowDataPacket[]>(query, [user.email])
  
  if (emailRows.length > 0) {
    throw new ConflictEmailError();
  }

  query = "SELECT 1 FROM user WHERE user = ? LIMIT 1 "
  const [userRows] = await db.query<RowDataPacket[]>(query, [user.user])
  
  if (userRows.length > 0) {
    throw new ConflictUserError();
  }
  
  const hashed = await bcrypt.hash(user.password, bcryptRounds)

  query = "INSERT INTO user (id, email, password, name, user) VALUES (?, ?, ?, ?, ?)"

  const id = uuidv4()
  
  saveImg(id, user.img)

  await db.execute(query, [id, user.email, hashed, user.name, user.user])

  return id
}