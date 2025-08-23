import 'dotenv/config';
import fs from 'fs';
import { createMysqlConn } from '../mysql/conn.js';
import path from 'path';

export default async function runMigrations() {
  try {
    const connection = await createMysqlConn()

    const absolutePath = path.resolve('src');
    const migrationsPath = `${absolutePath}/configuration/migration`
    const files = fs.readdirSync(migrationsPath)
    .filter(file => {
      return file.endsWith('.sql')
    })
    for (const file of files) {
      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, 'utf-8')
      await connection.query(sql);
      console.log(`Migration executed: ${file}`)
    }

    console.log('All migrations executed successfully.') 
    await connection.end();
  } catch (error) {
    console.error(error);
  }
}