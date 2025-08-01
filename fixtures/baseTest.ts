import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { PetsPage } from '../pages/petsPage';
import { HomePage } from '../pages/homePage';

// Extended fixtures that provide reusable test components
export const test = base.extend<{ 
  loginPage: LoginPage;
  petsPage: PetsPage;
  homePage: HomePage;
  authenticatedPage: Page; // Regular Page but with authentication loaded
}>({
  // Regular fixture for login page operations
  loginPage: async ({ page }, use) => {
    // Create LoginPage instance with the provided page
    await use(new LoginPage(page));
    // Automatic cleanup after test completes
  },

  // Fixture for pets page operations using authenticated page
  petsPage: async ({ authenticatedPage }, use) => {
    await authenticatedPage.goto('/pets');
    await use(new PetsPage(authenticatedPage));
  },

  // Fixture for home page operations using authenticated page
  homePage: async ({ authenticatedPage }, use) => {
    await authenticatedPage.goto('/home');
    await use(new HomePage(authenticatedPage));
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