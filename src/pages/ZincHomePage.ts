import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The ZincBank homepage (https://zincbank.cydeo.io/).
 *
 * Exposes the primary-navigation tabs (Personal, Business, Cards, Company) as
 * role/label-based locators scoped to the primary navigation, per the
 * framework's locator-priority rules. Note: the footer also contains a
 * "Cards" link, so all tab locators are scoped to the `Primary` navigation.
 */
export class ZincHomePage extends BasePage {
  public readonly primaryNav: Locator = this.page.getByRole('navigation', { name: 'Primary' });

  public readonly personalTab: Locator = this.tab('Personal');
  public readonly businessTab: Locator = this.tab('Business');
  public readonly cardsTab: Locator = this.tab('Cards');
  public readonly companyTab: Locator = this.tab('Company');

  public constructor(page: ZincHomePage['page']) {
    super(page);
  }

  public override async waitForReady(): Promise<void> {
    await this.primaryNav.waitFor({ state: 'visible' });
  }

  /** Opens the ZincBank homepage. */
  public async open(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Returns the primary-navigation tab link for the given label
   * (case-insensitive whole-string match, so e.g. "PERSONAL" and "Personal").
   */
  public tab(label: string): Locator {
    return this.primaryNav.getByRole('link', { name: new RegExp(`^${label}$`, 'i') });
  }
}
