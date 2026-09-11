import { Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I add the product {string} to the cart', async function (this: CustomWorld, productName: string): Promise<void> {
  await this.pages.inventoryPage.addProductToCart(productName);
});

When(
  'I remove the product {string} from the cart',
  async function (this: CustomWorld, productName: string): Promise<void> {
    await this.pages.inventoryPage.removeProductFromCart(productName);
  },
);

Then('the cart badge shows {int} items', async function (this: CustomWorld, expectedCount: number): Promise<void> {
  const actualCount = await this.pages.inventoryPage.getCartItemCount();
  expect(actualCount).toBe(expectedCount);
});

When('I sort products by name Z to A', async function (this: CustomWorld): Promise<void> {
  await this.pages.inventoryPage.sortByNameDescending();
});

Then('the first product shown is {string}', async function (this: CustomWorld, productName: string): Promise<void> {
  const firstProduct = await this.pages.inventoryPage.getFirstProductName();
  expect(firstProduct).toBe(productName);
});
