import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '../config/config';
import { CustomWorld } from '../support/world';

Given('I open the ZincBank application', async function (this: CustomWorld): Promise<void> {
  await this.pages.zincBankLoginPage.open();
});

Given('I am on the ZincBank login page', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/login$/);
  await expect(this.pages.zincBankLoginPage.signInButton).toBeVisible();
});

When('I sign in with my ZincBank credentials', async function (this: CustomWorld): Promise<void> {
  // Submit sign-in form with valid credentials. The page object waits for network to settle,
  // which handles both successful navigation and error messages.
  await this.pages.zincBankLoginPage.signIn(config.username, config.password);
});

When(
  'I sign in with email {string} and password {string}',
  async function (this: CustomWorld, email: string, password: string): Promise<void> {
    // Don't wait for navigation — validation errors and errors appear on-page.
    // Steps will assert for the error message or remain-on-page separately.
    await this.pages.zincBankLoginPage.signIn(email, password);
  },
);

Then('I am signed in and land on the ZincBank dashboard', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/dashboard$/);
  await expect(this.page).toHaveTitle('Dashboard · ZincBank');
});

Then('a login error {string} is displayed', async function (this: CustomWorld, expectedMessage: string): Promise<void> {
  // First wait for the note element to be in the DOM, then check visibility.
  // This handles timing issues where the element exists but isn't visible yet.
  await this.pages.zincBankLoginPage.note.waitFor({ state: 'attached', timeout: 5000 });
  await this.pages.zincBankLoginPage.note.waitFor({ state: 'visible', timeout: 5000 });
  await expect(this.pages.zincBankLoginPage.note).toContainText(expectedMessage);
});

Then(
  'a validation message {string} is displayed',
  async function (this: CustomWorld, expectedMessage: string): Promise<void> {
    // First wait for the note element to be in the DOM, then check visibility.
    // This handles timing issues where the element exists but isn't visible yet.
    await this.pages.zincBankLoginPage.note.waitFor({ state: 'attached', timeout: 5000 });
    await this.pages.zincBankLoginPage.note.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.pages.zincBankLoginPage.note).toContainText(expectedMessage);
  },
);

Then('I remain on the login page', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/login$/);
});
