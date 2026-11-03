import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { backendPath, backendUrl, createBackendProxy } from '../../../../scripts/backendProxy.mjs';

test('IP·포트·도메인을 해석하고 서버 주소 외 경로·인증 정보를 거부한다', () => {
  for (const [input, expected] of [
    [undefined, 'http://127.0.0.1:3001'], ['192.168.0.10:8080', 'http://192.168.0.10:8080'],
    [' https://api.example.com/ ', 'https://api.example.com'], ['http://[::1]:3001', 'http://[::1]:3001'],
  ]) assert.equal(backendUrl(input), expected);
  for (const input of ['', 'ftp://example.com', 'https://u:p@example.com', 'http://example.com/api', 'http://example.com?x=1', 'http://example.com#fragment']) assert.throws(() => backendUrl(input));
  for (const path of ['/api', '/api/me?x=1', '/api/receipts', '/auth/v1/kakao?code=a', '/docs', '/docs/swagger-ui.css', '/realtime']) assert.equal(backendPath(path), true);
  for (const path of ['/', '/home', '/api-other', '/auth/complete', '/_next/static/a.js']) assert.equal(backendPath(path), false);
});

test('중계가 Origin·쿠키·Bearer·본문·쿼리와 복수 Set-Cookie·리다이렉트를 보존한다', async t => {
  let captured;
  const upstream = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    captured = { headers: req.headers, url: req.url, bytes: Buffer.concat(chunks) };
    res.writeHead(307, { location: '/auth/complete?returnTo=%2Fhome', 'set-cookie': ['access=a; Path=/', 'refresh=b; HttpOnly; Path=/api/auth'] });
    res.end('redirect');
  });
  upstream.listen(0, '127.0.0.1'); await once(upstream, 'listening');
  const proxy = createBackendProxy(`http://127.0.0.1:${upstream.address().port}`);
  const frontend = createServer((req, res) => proxy.web(req, res));
  frontend.listen(0, '127.0.0.1'); await once(frontend, 'listening');
  t.after(() => { proxy.close(); frontend.closeAllConnections(); frontend.close(); upstream.closeAllConnections(); upstream.close(); });
  const origin = `http://127.0.0.1:${frontend.address().port}`;
  const body = Buffer.alloc(1024 * 1024 + 17, 0x61);
  const response = await fetch(`${origin}/api/receipts?keep=a%2Bb`, { method: 'POST', redirect: 'manual', headers: { origin, cookie: 'refresh=b', authorization: 'Bearer test', 'content-type': 'multipart/form-data; boundary=test', 'idempotency-key': 'fixture' }, body });
  assert.equal(response.status, 307);
  assert.equal(captured.headers.host, new URL(origin).host);
  assert.equal(captured.headers.origin, origin);
  assert.equal(captured.headers.cookie, 'refresh=b');
  assert.equal(captured.headers.authorization, 'Bearer test');
  assert.equal(captured.headers['idempotency-key'], 'fixture');
  assert.equal(captured.headers['content-type'], 'multipart/form-data; boundary=test');
  assert.equal(captured.url, '/api/receipts?keep=a%2Bb');
  assert.deepEqual(captured.bytes, body);
  assert.equal(response.headers.get('location'), '/auth/complete?returnTo=%2Fhome');
  assert.deepEqual(response.headers.getSetCookie(), ['access=a; Path=/', 'refresh=b; HttpOnly; Path=/api/auth']);
});

test('연결할 수 없는 백엔드는 비밀 주소를 노출하지 않고 502를 반환한다', async t => {
  const reserved = createServer(); reserved.listen(0, '127.0.0.1'); await once(reserved, 'listening');
  const port = reserved.address().port; await new Promise(resolve => reserved.close(resolve));
  const proxy = createBackendProxy(`http://127.0.0.1:${port}`);
  const server = createServer((req, res) => proxy.web(req, res));
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => { proxy.close(); server.closeAllConnections(); server.close(); });
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/me`);
  assert.equal(response.status, 502);
  assert.equal((await response.json()).error, 'backend_unavailable');
});
