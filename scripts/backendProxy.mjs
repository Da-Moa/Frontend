import httpProxy from 'http-proxy';

export function backendUrl(value = 'http://127.0.0.1:3001') {
  const raw = value.trim();
  const url = new URL(raw.includes('://') ? raw : `http://${raw}`);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash)
    throw new Error('BACKEND_URL must be an HTTP(S) server address without a path or credentials');
  return url.origin;
}

export function backendPath(value) {
  const path = new URL(value || '/', 'http://localhost').pathname;
  return path === '/api' || path.startsWith('/api/') || path === '/auth/v1/kakao' || path === '/docs' || path.startsWith('/docs/') || path === '/realtime';
}

export function createBackendProxy(target) {
  // Preserve the browser's Host and Origin for CSRF, OAuth callbacks and WebSockets.
  const proxy = httpProxy.createProxyServer({ target: backendUrl(target), changeOrigin: false, ws: true });
  proxy.on('error', (_error, _request, response) => {
    if ('writeHead' in response && !response.headersSent) {
      response.writeHead(502, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      response.end(JSON.stringify({ error: 'backend_unavailable', message: '서버에 연결할 수 없습니다' }));
    } else response.destroy();
  });
  return proxy;
}
