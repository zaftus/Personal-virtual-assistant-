import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { authRouter } from './routes/auth';
import { chatRouter } from './routes/chat';
import { initDb } from './utils/db';
import { createWebsocketServer } from './ws';

const app = express();
const PORT = process.env.API_PORT ? parseInt(process.env.API_PORT) : 8000;

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/chat', chatRouter);

app.get('/', (req: Request, res: Response) => res.json({ ok: true, name: 'Ava API' }));

initDb().then(() => {
  const server = app.listen(PORT, () => console.log(`API listening ${PORT}`));
  createWebsocketServer(server);
}).catch(err => {
  console.error('DB init failed', err);
  process.exit(1);
});
