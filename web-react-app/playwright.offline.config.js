import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
  testDir: './e2e',
  testMatch: 'offline.spec.js',
  timeout: 90_000,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report-offline', open: 'never' }],
    ['json', { outputFile: 'test-results/offline-report.json' }],
  ],
  outputDir: 'test-results/offline',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    serviceWorkers: 'allow',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `npm run preview -- --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
