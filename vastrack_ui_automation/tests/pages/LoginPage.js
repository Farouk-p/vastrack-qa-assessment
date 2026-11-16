// Import Playwright's assertion library
const { expect } = require('@playwright/test');

// Page object for the login section of the dashboard
class LoginPage {
  // Receive the Playwright page and define all locators once
  constructor(page) {
    // Keep a reference to the page for navigation
    this.page = page;
    // Email input
    this.email = page.getByTestId('login-email');
    // Password input
    this.password = page.getByTestId('login-password');
    // "Log in" button
    this.submitButton = page.getByTestId('login-submit');
    // User's name shown in the header once logged in
    this.userName = page.getByTestId('user-name');
    // Wallet balance text shown after login
    this.walletBalance = page.getByTestId('wallet-balance');
  }

  // Open the dashboard home page (uses baseURL from the config)
  async goto() { await this.page.goto('/'); }

  // Log in with the given email and password
  async login({ email, password }) {
    // Go to the dashboard
    await this.goto();
    // Type the email
    await this.email.fill(email);
    // Type the password
    await this.password.fill(password);
    // Click the log in button
    await this.submitButton.click();
    // Wait until the user's name appears, proving login succeeded
    await expect(this.userName).toBeVisible();
    // Wait until the wallet has loaded (it shows "-" until the API responds)
    await expect(this.walletBalance).not.toHaveText('-');
  }
}

// Export the class so specs can import it
module.exports = { LoginPage };
