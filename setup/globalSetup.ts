import { chromium, FullConfig } from '@playwright/test';
import testData from '../data/testData.json';
import { LoginPage } from '../pages/loginPage';

async function globalSetup(config: FullConfig) {
  console.log('Global Setup: Starting authentication...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  
  try {
    // Login once and save authentication state
    const user = testData.users.admin;
    await page.goto(process.env.BASE_URL + '/login');
    
    await loginPage.login(user.username, user.password);
    
    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Extra wait for redirects
    
    // Check if login was successful
    const currentUrl = page.url();
    if (!currentUrl.includes('/login')) {
      // Login successful - save auth state
      await context.storageState({ path: 'auth-state.json' });
      console.log('Global Setup: Authentication successful and saved');
    } else {
      // Login failed - get error message for debugging
      try {
        const errorMessage = await loginPage.getErrorMessage();
        console.log('Global Setup: Login failed with error:', errorMessage);
        console.log('Global Setup: Credentials used - Username:', user.username, 'Password:', user.password);
      } catch (e) {
        console.log('Global Setup: Login failed, no error message found');
      }
      
      // Create empty auth state file so fixtures know to handle it
      await context.storageState({ path: 'auth-state.json' });
      console.log('Global Setup: Fixtures will handle authentication');
    }
    
  } catch (error) {
    console.log('Global Setup: Error during login, fixtures will handle authentication');
    // Still create auth state file (even if empty) so fixtures can detect and handle
    await context.storageState({ path: 'auth-state.json' });
  } finally {
    await browser.close();
  }
}

export default globalSetup;
