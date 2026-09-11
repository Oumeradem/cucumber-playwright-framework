import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { createPageObjects, PageObjects } from '../fixtures/pages';
import { ScenarioMetadata } from '../types';

/**
 * Custom Cucumber World.
 *
 * Owns the Playwright primitives (browser, context, page), the page objects,
 * and per-scenario metadata. One instance is created per scenario, so there is
 * no global mutable state and scenarios stay isolated.
 */
export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  /** Composed page objects (see src/fixtures/pages.ts). */
  public pages!: PageObjects;

  public scenario: ScenarioMetadata = { name: '', tags: [] };
  public consoleErrors: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  /** Initializes page objects against the current page. Called in the Before hook. */
  public initPageObjects(): void {
    this.pages = createPageObjects(this.page);
  }
}

setWorldConstructor(CustomWorld);
