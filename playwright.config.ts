import { defineConfig, devices } from '@playwright/test';
const backend = new URL(process.env.BROWSER_BACKEND_URL || 'http://127.0.0.1:3309');
if (!['localhost', '127.0.0.1', '[::1]'].includes(backend.hostname)) throw new Error('Browser tests require a local isolated backend');
const port = Number(process.env.BROWSER_TEST_PORT || 3307);
if (!Number.isInteger(port) || port < 1025 || port > 65535 || port === 3000 || port === Number(backend.port)) throw new Error('Invalid isolated browser port');
if (!process.env.AUTH_JWT_SECRET) throw new Error('Set the isolated backend test JWT secret');
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: './src/frontend/test/browser', fullyParallel: false, workers: 1, retries: 0,
  timeout: 45_000, expect: { timeout: 10_000 }, outputDir: 'test-results/browser/artifacts',
  reporter: [['list'], ['json', { outputFile: 'test-results/browser/results.json' }]],
  use: { ...devices['Desktop Chrome'], baseURL, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm start', url: `${baseURL}/api/health/live`, reuseExistingServer: false,
    timeout: 60_000, gracefulShutdown: { signal: 'SIGTERM', timeout: 15_000 },
    env: { NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port), BACKEND_URL: backend.origin },
  },
});
