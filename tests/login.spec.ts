import { test, expect } from '../fixtures/baseTest';
import { DataProvider } from '../utils/dataProvider';

test('login test', async ({ page, loginPage }) => {
  const user = DataProvider.getUser('admin');
  await page.goto('/login');
  await loginPage.login(user.username, user.password);
  
  // Wait for navigation after login and check for successful login indicators
  await page.waitForLoadState('networkidle');
  
  // Check if we're redirected away from login page (successful login)
  await expect(page).not.toHaveURL('/login');
  
  // Alternative: Check for elements that appear after successful login
  // await expect(page.locator('#navigation__logout')).toBeVisible();
});