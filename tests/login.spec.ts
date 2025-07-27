import { test, expect } from '../fixtures/baseTest';

test('Login test', async ({ authenticatedPage }) => {
  // Global auth (already logged in)
  await authenticatedPage.goto('/');
  
  // Verify we're successfully authenticated
  await expect(authenticatedPage).not.toHaveURL('/login');
  await expect(authenticatedPage.locator('h1').first()).toContainText('Testifi Training Environment');
});