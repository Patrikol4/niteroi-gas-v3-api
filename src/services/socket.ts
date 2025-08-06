import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import websocketPlugin from '@fastify/websocket';
import { RawData, WebSocket } from 'ws';

interface WebSocketMessage {
  event: string;
  data: any;
}

interface Connection {
  id: string;
  socket: WebSocket;
}

const connections: Connection[] = [];

async function websocketHandler(fastify: FastifyInstance, options: FastifyPluginOptions) {
  await fastify.register(websocketPlugin);

  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const { socket } = connection;
    const id = generateId();

    console.log(`Client connected: ${id}`);
    connections.push({ id, socket });

    socket.on('message', (message: RawData) => {
      try {
        const parsed: WebSocketMessage = JSON.parse(message.toString());
        console.log('Mensagem recebida:', parsed);

        if (parsed.event === 'ping') {
          socket.send(JSON.stringify({ event: 'pong' }));
        }
      } catch (err) {
        console.error('Mensagem inválida:', message.toString());
      }
    });

    socket.on('close', () => {
      const index = connections.findIndex(conn => conn.id === id);
      if (index !== -1) connections.splice(index, 1);
      console.log(`Client disconnected: ${id}`);
    });
  });
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Exporta como plugin
export default fp(websocketHandler);

// Exporta funções auxiliares
export function sendSolicitationDashboard(message: string, data: any) {
  broadcast({ event: message, data });
}

export function sendSolicitationDeliveryman(message: string, data: any) {
  broadcast({ event: message, data });
}

function broadcast(payload: WebSocketMessage) {
  const json = JSON.stringify(payload);
  connections.forEach(({ socket }) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(json);
    }
  });
}
