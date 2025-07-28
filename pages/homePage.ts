import { Page, Locator } from '@playwright/test';

export class HomePage {
  // Locators for the home page
  private readonly homeButton: Locator;
  public readonly logoutButton: Locator;

  constructor(private page: Page) {
    this.homeButton = this.page.locator('#navigation__home');
    this.logoutButton = this.page.locator('#navigation__logout');
  }

  async goToHome() {
    await this.homeButton.click();
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Confirm navigation succeeded by checking URL
    await this.page.waitForURL('**/home');
  }

  async logout() {
    await this.logoutButton.click();
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    
    // Confirm logout succeeded by checking we're redirected to login page
    await this.page.waitForURL('**/login');
  }

}