import { Locator, Page } from '@playwright/test';

/**
 * Base class for all page objects.
 *
 * Page objects wrap a single `Page` instance, expose meaningful business
 * operations (not raw selectors), and stay free of assertions. Steps call page
 * objects and perform assertions; page objects perform actions.
 */
export abstract class BasePage {
  public constructor(public readonly page: Page) {}

  public async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Waits until the page is in a ready state. Override in concrete pages to
   * wait for that page's key content instead of a blanket network condition.
   */
  public async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  protected getByText(text: string): Locator {
    return this.page.getByText(text);
  }
}
