import { chromium, FullConfig } from '@playwright/test';
import { DataProvider } from '../utils/dataProvider';

async function globalSetup(config: FullConfig) {
  console.log('Global Setup: Starting authentication...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Login once and save authentication state
    const user = DataProvider.getUser('admin');
    await page.goto(process.env.BASE_URL + '/login');
    
    await page.fill('#mat-input-0', user.username);
    await page.fill('#mat-input-1', user.password);
    await page.click('#login__submit');
    
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
      // Login failed - create empty auth state file so fixtures know to handle it
      await context.storageState({ path: 'auth-state.json' });
      console.log('Global Setup: Login failed, fixtures will handle authentication');
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
