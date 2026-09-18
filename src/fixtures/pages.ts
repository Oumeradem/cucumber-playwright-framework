import { Page } from '@playwright/test';
import { ZincHomePage } from '../pages/ZincHomePage';
import { ZincSignInPage } from '../pages/ZincSignInPage';

/** All page objects available to a scenario, wired together once per test. */
export interface PageObjects {
  readonly zincHomePage: ZincHomePage;
  readonly zincSignInPage: ZincSignInPage;
}

/** Composes the page objects for a fresh page (dependency injection / fixture). */
export function createPageObjects(page: Page): PageObjects {
  return {
    zincHomePage: new ZincHomePage(page),
    zincSignInPage: new ZincSignInPage(page),
  };
}
