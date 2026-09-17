import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { config } from '../config/config';
import { CustomWorld } from '../support/world';

Given('I open the ZincBank login page', async function (this: CustomWorld): Promise<void> {
  await this.pages.zincSignInPage.open();
  await this.pages.zincSignInPage.waitForReady();
});

Given('I am on the ZincBank login page', async function (this: CustomWorld): Promise<void> {
  await expect(this.pages.zincSignInPage.emailInput).toBeVisible();
});

When('I sign in with the configured valid credentials', async function (this: CustomWorld): Promise<void> {
  // Add delay to reduce auth rate-limiting impact
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await this.pages.zincSignInPage.signIn(config.username, config.password);
  // Wait for the dashboard to load after successful auth
  await this.page.waitForLoadState('networkidle');
});

When('I sign in with an invalid email and password', async function (this: CustomWorld): Promise<void> {
  // Add delay to reduce auth rate-limiting impact
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await this.pages.zincSignInPage.signIn('invalid@example.com', 'wrong-password');
  // Wait for the error message to appear (API response takes a moment)
  await this.page.waitForLoadState('networkidle');
});

When('I submit the form with empty email and password', async function (this: CustomWorld): Promise<void> {
  await this.pages.zincSignInPage.submit();
});

When('I enter a malformed email and a password, then submit', async function (this: CustomWorld): Promise<void> {
  await this.pages.zincSignInPage.signIn('not-an-email', 'some-password');
});

When('I click the "Open an account" link', async function (this: CustomWorld): Promise<void> {
  await this.pages.zincSignInPage.openAccountPage();
});

Then('I am redirected to the ZincBank dashboard', async function (this: CustomWorld): Promise<void> {
  // Allow extra time for auth response + page load (auth may be rate-limited)
  await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 15000 });
});

Then('I see the login message {string}', async function (this: CustomWorld, expectedMessage: string): Promise<void> {
  // Wait up to 10s for the error message to appear (API response + rendering)
  await expect(this.pages.zincSignInPage.message).toHaveText(expectedMessage, { timeout: 10000 });
});

Then('I remain on the ZincBank login page', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/login/);
});

Then(
  'no navigation occurs and I see the hint {string}',
  async function (this: CustomWorld, expectedHint: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.pages.zincSignInPage.message).toHaveText(expectedHint);
  },
);

Then('no navigation occurs and the hint remains visible', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/login/);
  await expect(this.pages.zincSignInPage.message).toBeVisible();
});

Then('I am on the ZincBank account-opening page', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/apply/);
});

Then(
  'the heading {string}, the Email field, the Password field, and the {string} button are visible',
  async function (this: CustomWorld, headingText: string, buttonName: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
    await expect(this.pages.zincSignInPage.emailInput).toBeVisible();
    await expect(this.pages.zincSignInPage.passwordInput).toBeVisible();
    await expect(this.page.getByRole('button', { name: buttonName })).toBeVisible();
  },
);

Then('the {string} link is visible', async function (this: CustomWorld, linkName: string): Promise<void> {
  await expect(this.page.getByRole('link', { name: linkName })).toBeVisible();
});
