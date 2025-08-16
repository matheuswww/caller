import 'dotenv/config';
import mysql from 'mysql2/promise';

export let db: mysql.Connection

export async function createMysqlConn(): Promise<mysql.Connection> {
  const host = process.env.MYSQL_HOST || ""
  const user = process.env.MYSQL_USER || ""
  const password = process.env.MYSQL_PASSWORD || ""
  const database = process.env.MYSQL_NAME || ""
  const port = process.env.MYSQL_PORT || 0

  try {
    db = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
      port: Number(port)
    })
    return db
  } catch (error) {
    console.error(error);
    throw error
  }
}