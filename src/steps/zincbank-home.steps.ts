import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I open the ZincBank homepage', async function (this: CustomWorld): Promise<void> {
  await this.pages.zincHomePage.open();
  await this.pages.zincHomePage.waitForReady();
});

Then(
  'the primary navigation shows the tabs {string}, {string}, {string}, and {string}',
  async function (
    this: CustomWorld,
    firstTab: string,
    secondTab: string,
    thirdTab: string,
    fourthTab: string,
  ): Promise<void> {
    for (const label of [firstTab, secondTab, thirdTab, fourthTab]) {
      await expect(this.pages.zincHomePage.tab(label)).toBeVisible();
    }
  },
);

When('I click the {string} tab', async function (this: CustomWorld, tabLabel: string): Promise<void> {
  await this.pages.zincHomePage.tab(tabLabel).click();
});

Then('the page scrolls to the {string} section', async function (this: CustomWorld, target: string): Promise<void> {
  await expect(this.page).toHaveURL(new RegExp(`${target}$`));
});
