import { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * The Swag Labs application header, present on every page after login.
 * Contains the primary navigation (menu, cart, page title).
 */
export class Header extends BaseComponent {
  public readonly cartButton: Locator = this.page.getByRole('button', { name: /^Cart/ });
  public readonly menuButton: Locator = this.page.getByRole('button', { name: 'Open Menu' });
  public readonly title: Locator = this.page.getByTestId('title');

  public constructor(page: Header['page']) {
    super(page, page.locator('#header_container'));
  }

  /**
   * Reads the number of items in the cart.
   *
   * The cart link's aria-label is "Cart, empty" (0 items) or "Cart, N items"
   * (N items). Falls back to the shopping-cart-badge text when the accessible
   * name is not derived from the badge.
   */
  public async getCartItemCount(): Promise<number> {
    const ariaLabel = await this.cartButton.getAttribute('aria-label');
    const match = ariaLabel?.match(/^Cart,\s*(\d+)\s*items?$/i);
    if (match) return Number(match[1]);

    const badge = this.page.getByTestId('shopping-cart-badge');
    if (await badge.isVisible().catch(() => false)) {
      const text = (await badge.textContent())?.trim();
      const parsed = Number(text);
      if (text && Number.isFinite(parsed)) return parsed;
    }
    return 0;
  }

  public async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  public async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  public async isTitleVisible(title: string): Promise<boolean> {
    return this.page.getByText(title, { exact: true }).first().isVisible();
  }
}
