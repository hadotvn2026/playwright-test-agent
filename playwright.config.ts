import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load variables from .env file at the project root
dotenv.config({ path: path.resolve(__dirname, '.dev.env') });

const isProofRun = process.env.PROOF === '1';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://playwright.dev',
    // PROOF=1 records video + trace for every test and slows actions down so the
    // recording is reviewable (used by the agent-proof workflow). Playwright CLI has
    // no --video flag, so this env switch is the supported way to turn it on.
    trace: isProofRun ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: {
      mode: isProofRun ? 'on' : 'retain-on-failure',
      size: { width: 1280, height: 720 },
    },
    launchOptions: isProofRun ? { slowMo: 800 } : {},
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});