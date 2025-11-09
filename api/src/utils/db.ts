import { Pool } from 'pg';
const pool = new Pool({
  host: process.env.API_DB_HOST || 'db',
  port: +(process.env.API_DB_PORT || 5432),
  user: process.env.API_DB_USER || 'ava',
  password: process.env.API_DB_PASS || 'ava_pass',
  database: process.env.API_DB_NAME || 'ava_db',
});

export async function initDb() {
  const client = await pool.connect();
  try {
    // Run basic migration (for demo read file from infra)
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    )`);
  } finally {
    client.release();
  }
}

export default pool;
