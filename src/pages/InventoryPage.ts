import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Header } from './components/Header';

export interface InventoryItemSummary {
  readonly name: string;
  readonly price: number;
  readonly description: string;
}

/**
 * The Swag Labs inventory ("Products") page, reached after a successful login.
 * Product cards are `.inventory_item` containers, scoped by product name.
 */
export class InventoryPage extends BasePage {
  public readonly title: Locator = this.page.getByTestId('title');
  public readonly sortContainer: Locator = this.page.getByTestId('product-sort-container');
  public readonly productCards: Locator = this.page.locator('.inventory_item');

  public constructor(
    page: InventoryPage['page'],
    private readonly header: Header,
  ) {
    super(page);
  }

  public override async waitForReady(): Promise<void> {
    await this.title.waitFor({ state: 'visible' });
  }

  private productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName }).first();
  }

  public async getProductCardCount(): Promise<number> {
    return this.productCards.count();
  }

  public async isProductVisible(productName: string): Promise<boolean> {
    return this.productCard(productName)
      .isVisible()
      .catch(() => false);
  }

  public async addProductToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  public async removeProductFromCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  public async getProductPrice(productName: string): Promise<number> {
    const text = await this.productCard(productName).locator('.inventory_item_price').textContent();
    return Number(text?.replace(/[^0-9.]/g, '') ?? 0);
  }

  public async getFirstProductName(): Promise<string> {
    const name = await this.productCards.first().locator('.inventory_item_name').textContent();
    return name?.trim() ?? '';
  }

  public async getProductNames(): Promise<string[]> {
    return (await this.productCards.locator('.inventory_item_name').allTextContents()).map((name) => name.trim());
  }

  public async getCartItemCount(): Promise<number> {
    return this.header.getCartItemCount();
  }

  public async sortByNameAscending(): Promise<void> {
    await this.sortContainer.selectOption('az');
  }

  public async sortByNameDescending(): Promise<void> {
    await this.sortContainer.selectOption('za');
  }

  public async sortByPriceLowToHigh(): Promise<void> {
    await this.sortContainer.selectOption('lohi');
  }

  public async sortByPriceHighToLow(): Promise<void> {
    await this.sortContainer.selectOption('hilo');
  }
}
