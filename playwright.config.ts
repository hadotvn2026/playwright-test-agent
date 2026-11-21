import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL || 'https://playwright.dev',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Cấu hình video mặc định (agent có thể ghi đè bằng cờ --video=on khi cần quay bằng chứng)
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 },
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});