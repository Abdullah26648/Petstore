import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export const test = base.extend<{ 
  loginPage: LoginPage;
  authenticatedPage: any;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'auth-state.json'
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';