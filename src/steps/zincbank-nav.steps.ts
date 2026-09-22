import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { Header, NavItem } from '../pages/components/Header';

Then('the header navigation shows all required items', async function (this: CustomWorld): Promise<void> {
  // Wait for the header banner to become visible. This ensures the authenticated app
  // shell has fully loaded (we're past login and the nav is rendered).
  await expect(this.pages.zincBankHomePage.header.root).toBeVisible();

  for (const item of Header.requiredItems) {
    await expect(this.pages.zincBankHomePage.header.navItem(item)).toBeVisible();
  }
});

Then('the header navigation shows the item {string}', async function (this: CustomWorld, item: string): Promise<void> {
  // Wait for the header banner to become visible. This ensures the authenticated app
  // shell has fully loaded (we're past login and the nav is rendered).
  await expect(this.pages.zincBankHomePage.header.root).toBeVisible();

  await expect(this.pages.zincBankHomePage.header.navItem(item as NavItem)).toBeVisible();
});

When('I wait for {int} second(s)', async function (this: CustomWorld, seconds: number): Promise<void> {
  // Sleep for the specified number of seconds. Used to prevent rate limiting or
  // allow session state to settle between rapid test executions.
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
});
