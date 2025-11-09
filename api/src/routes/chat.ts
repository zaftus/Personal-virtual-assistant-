import express from 'express';
import fetch from 'node-fetch';

export const chatRouter = express.Router();

// simple proxy to NLP service
chatRouter.post('/message', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  const NLP_URL = process.env.NLP_URL || 'http://nlp:9000';
  try {
    const r = await fetch(`${NLP_URL}/predict`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: message })
    });
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: 'nlp error', detail: String(err) });
  }
});
