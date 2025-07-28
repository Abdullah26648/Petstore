import { test, expect } from '../fixtures/baseTest';

test(' [@smoke] Login test', async ({ authenticatedPage, homePage }) => {
  // Global auth (already logged in)
  await authenticatedPage.goto('/');
  
  // Verify we're successfully authenticated
  // Assert user is redirected to /home after login
  await expect(authenticatedPage).toHaveURL('/home');
  // Assert logout button is visible (user is authenticated)
  await expect(homePage.logoutButton).toBeVisible();
  
});