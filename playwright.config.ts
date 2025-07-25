import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL || 'https://training.testifi.io',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
  ],
});