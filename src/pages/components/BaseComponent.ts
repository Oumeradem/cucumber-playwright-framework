import { Locator, Page } from '@playwright/test';

/**
 * Base class for reusable UI components (headers, nav bars, dialogs, ...).
 * A component is scoped to a root locator within a page.
 */
export abstract class BaseComponent {
  public constructor(
    public readonly page: Page,
    public readonly root: Locator,
  ) {}

  public async isVisible(): Promise<boolean> {
    return this.root.isVisible();
  }

  public async waitForVisible(timeout?: number): Promise<void> {
    await this.root.waitFor({ state: 'visible', timeout });
  }
}
