import express from 'express';
import pool from '../utils/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const authRouter = express.Router();

const JWT_SECRET = process.env.API_JWT_SECRET || 'change_me_secret';

authRouter.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query('INSERT INTO users(email, password_hash, full_name) VALUES($1,$2,$3) RETURNING id,email,full_name', [email, hash, full_name || null]);
    const user = result.rows[0];
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'failed' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const found = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  if (found.rowCount === 0) return res.status(401).json({ error: 'invalid' });
  const user = found.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
});
