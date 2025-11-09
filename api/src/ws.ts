import { Server } from 'ws';
import http from 'http';
export function createWebsocketServer(httpServer: http.Server) {
  const wss = new Server({ server: httpServer, path: '/ws' });
  wss.on('connection', (ws) => {
    ws.on('message', async (msg) => {
      // echo + simulated streaming
      ws.send(JSON.stringify({ type: 'partial', text: 'processing...' }));
      setTimeout(() => ws.send(JSON.stringify({ type: 'final', text: `Echo: ${msg.toString()}` })), 400);
    });
  });
}
