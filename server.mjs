import nextEnvironment from '@next/env';
import next from 'next';
import { createServer } from 'node:http';
import { backendPath, backendUrl, createBackendProxy } from './scripts/backendProxy.mjs';

const dev = process.env.NODE_ENV !== 'production';
nextEnvironment.loadEnvConfig(process.cwd(), dev);
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const host = process.env.HOST || '0.0.0.0';
const target = backendUrl(process.env.BACKEND_URL);
const proxy = createBackendProxy(target);
const sockets = new Set();
const server = createServer();
const app = next({ dev, hostname: host, port, httpServer: server });
await app.prepare();
const handlePage = app.getRequestHandler();
let nextUpgrade;
server.on('connection', socket => {
  sockets.add(socket);
  socket.on('close', () => sockets.delete(socket));
});
server.on('request', (request, response) => {
  if (backendPath(request.url)) {
    proxy.web(request, response);
    return;
  }
  // Next attaches HMR lazily. Route that listener only to Next-owned upgrades.
  const existing = new Set(server.listeners('upgrade'));
  const handling = handlePage(request, response);
  for (const listener of server.listeners('upgrade')) {
    if (!existing.has(listener)) {
      server.off('upgrade', listener);
      nextUpgrade = listener;
    }
  }
  void handling.catch(() => {
    if (!response.headersSent) response.writeHead(500);
    response.end();
  });
});
server.on('upgrade', (request, socket, head) => {
  if (backendPath(request.url)) proxy.ws(request, socket, head);
  else if (nextUpgrade) nextUpgrade(request, socket, head);
  else socket.destroy();
});
server.listen(port, host, () => console.log(`Frontend ready on http://localhost:${port}`));
let closing;
const close = () => closing ??= (async () => {
  const stopped = new Promise(resolve => server.close(resolve));
  for (const socket of sockets) socket.destroy();
  proxy.close();
  await Promise.all([stopped, app.close()]);
})();
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  void close().then(() => process.exit(0), () => process.exit(1));
});
