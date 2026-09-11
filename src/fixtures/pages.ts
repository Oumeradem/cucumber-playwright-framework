import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { Header } from '../pages/components/Header';

/** All page objects available to a scenario, wired together once per test. */
export interface PageObjects {
  readonly header: Header;
  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
}

/** Composes the page objects for a fresh page (dependency injection / fixture). */
export function createPageObjects(page: Page): PageObjects {
  const header = new Header(page);
  return {
    header,
    loginPage: new LoginPage(page),
    inventoryPage: new InventoryPage(page, header),
  };
}
