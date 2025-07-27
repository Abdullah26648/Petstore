import { Page, Locator } from '@playwright/test';

export class LoginPage {
  // Locators for the login page
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private page: Page) {
    // Initialize locators in constructor
    this.usernameField = this.page.locator('#mat-input-0');
    this.passwordField = this.page.locator('#mat-input-1');
    this.loginButton = this.page.locator('#login__submit');
    this.errorMessage = this.page.locator('snack-bar-container simple-snack-bar span');
  }

  // Actions - what users can do on this page
  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  // Getters - for accessing locators in tests if needed
  getUsernameField(): Locator {
    return this.usernameField;
  }

  getPasswordField(): Locator {
    return this.passwordField;
  }

  getLoginButton(): Locator {
    return this.loginButton;
  }

  getErrorMessage(): Locator {
    return this.errorMessage;
  }
}