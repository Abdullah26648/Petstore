import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

// Extended fixtures that provide reusable test components
export const test = base.extend<{ 
  loginPage: LoginPage;
  authenticatedPage: Page; // Regular Page but with authentication loaded
}>({
  // Regular fixture for login page operations
  loginPage: async ({ page }, use) => {
    // Create LoginPage instance with the provided page
    await use(new LoginPage(page));
    // Automatic cleanup after test completes
  },

  // Fixture that uses saved authentication state from global setup
  authenticatedPage: async ({ browser }, use) => {
    // Create new browser context with saved authentication data
    const context = await browser.newContext({
      storageState: 'auth-state.json' // Load cookies and storage from global setup
    });
    
    // Create new page within authenticated context
    const page = await context.newPage();
    
    // Provide authenticated page to test (already logged in)
    await use(page);
    
    // Clean up context after test completes
    await context.close();
  },
});

export { expect } from '@playwright/test';