import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config';
import fs from 'fs';
import path from 'path';

// Lightweight .env loader to avoid adding external dependencies
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, { encoding: 'utf8' });
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2] ?? '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Multi-reporters: HTML (never auto-open) + concise list in terminal. */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL provided by selected environment config */
    baseURL: envConfig.baseUrl,

    /* Tells getByTestId() to look for data-test="..." attributes (Saucedemo convention) */
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  /* Global setup: write Allure environment properties before the test run. */
  globalSetup: './global-setup',

  /* Global teardown: removes saved auth state on CI to prevent session leakage between jobs. */
  globalTeardown: './global-teardown',

  /* Configure projects for major browsers */
  projects: [
    /* Runs once before all browser projects: logs in and saves auth state. */
    {
      name: 'setup',
      testMatch: '**/auth.setup.ts',
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
