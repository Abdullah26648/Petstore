import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    // Using the actual selectors from Testifi training app
    await this.page.fill('#mat-input-0', username);  // Username field
    await this.page.fill('#mat-input-1', password);  // Password field
    await this.page.click('#login__submit');         // Login button
  }
}