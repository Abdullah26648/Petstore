import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  globalSetup: './setup/globalSetup.ts', // Global setup integration
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://training.testifi.io',
    trace: 'on', // Always record traces
    video: 'on', // Always record video
    screenshot: 'only-on-failure', // Always take screenshots on failure
    storageState: 'auth-state.json', // Use saved authentication state
  },
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});