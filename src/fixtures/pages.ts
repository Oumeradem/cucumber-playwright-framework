import { Page } from '@playwright/test';
import { ZincBankHomePage } from '../pages/ZincBankHomePage';
import { ZincBankLoginPage } from '../pages/ZincBankLoginPage';

/** All page objects available to a scenario, wired together once per test. */
export interface PageObjects {
  readonly zincBankLoginPage: ZincBankLoginPage;
  readonly zincBankHomePage: ZincBankHomePage;
}

/** Composes the page objects for a fresh page (dependency injection / fixture). */
export function createPageObjects(page: Page): PageObjects {
  return {
    zincBankLoginPage: new ZincBankLoginPage(page),
    zincBankHomePage: new ZincBankHomePage(page),
  };
}
