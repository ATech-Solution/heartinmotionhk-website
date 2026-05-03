import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'e2e-report', open: 'never' }], ['line']],
  timeout: 45_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 12'] },
      testMatch: '**/navigation.spec.ts',
    },
  ],
  globalSetup: './e2e/global-setup.ts',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      NODE_ENV: 'test',
      AWS_SES_SMTP_HOST: 'localhost',
      AWS_SES_SMTP_PORT: '1025',
      AWS_SES_SMTP_USER: '',
      AWS_SES_SMTP_PASSWORD: '',
    },
  },
})
