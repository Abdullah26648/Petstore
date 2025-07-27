import { test, expect } from '../fixtures/baseTest';

test('authenticated page test', async ({ authenticatedPage }) => {
  // This test uses the auth state created by global setup
  await authenticatedPage.goto('/');
  
  // Should not be on login page since we're already authenticated
  await expect(authenticatedPage).not.toHaveURL('/login');
  
  // More specific selector for the main heading
  await expect(authenticatedPage.locator('h1').first()).toContainText('Testifi Training Environment');
});

test('fast dashboard test', async ({ authenticatedPage }) => {
  // Using fastest approach - global auth
  await authenticatedPage.goto('/');
  
  // Test multiple elements quickly
  await expect(authenticatedPage).not.toHaveURL('/login');
  await expect(authenticatedPage.locator('h1').first()).toContainText('Testifi Training Environment');
  await expect(authenticatedPage.locator('h1').nth(1)).toContainText('Pets');
});

test('fast navigation test', async ({ authenticatedPage }) => {
  // Another fast test using global auth
  await authenticatedPage.goto('/');
  
  // Test that we can see multiple sections
  await expect(authenticatedPage.locator('h1').nth(2)).toContainText('Window Preview');
  await expect(authenticatedPage.locator('h1').nth(3)).toContainText('Store');
});
