import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I open the application', async function (this: CustomWorld): Promise<void> {
  await this.pages.loginPage.open();
});

Given('I am on the Login page', async function (this: CustomWorld): Promise<void> {
  await expect(this.pages.loginPage.loginButton).toBeVisible();
});

When(
  'I login with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string): Promise<void> {
    await this.pages.loginPage.login(username, password);
  },
);

Then('the inventory page is displayed', async function (this: CustomWorld): Promise<void> {
  await expect(this.page).toHaveURL(/\/inventory\.html$/);
  await expect(this.pages.inventoryPage.title).toBeVisible();
});

Then(
  'a login error message {string} should be displayed',
  async function (this: CustomWorld, expectedMessage: string): Promise<void> {
    await expect(this.pages.loginPage.errorAlert).toBeVisible();
    await expect(this.pages.loginPage.errorAlert).toContainText(expectedMessage);
  },
);
