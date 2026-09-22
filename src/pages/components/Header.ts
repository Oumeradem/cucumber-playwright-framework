import { Locator, Page } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * The required items shown in the ZincBank authenticated header navigation.
 * "ZincBank" is the brand link (accessible name "ZincBank dashboard"); all others
 * except "Sign out" are links, and "Sign out" is a button.
 */
export type NavItem =
  'ZincBank' | 'Dashboard' | 'Accounts' | 'Move money' | 'Transactions' | 'Cards' | 'Profile' | 'Sign out';

/**
 * The primary navigation header of the authenticated ZincBank app shell.
 *
 * All locators are scoped to the `navigation "Primary"` region so that page-content
 * links with the same label (e.g. a "Move money" link in the dashboard body) do not
 * conflict with the header items. ZincBank uses `data-testid`, so role-based
 * locators are used (consistent with ZincBankLoginPage).
 */
export class Header extends BaseComponent {
  /** All required nav items, in display order. */
  public static readonly requiredItems: readonly NavItem[] = [
    'ZincBank',
    'Dashboard',
    'Accounts',
    'Move money',
    'Transactions',
    'Cards',
    'Profile',
    'Sign out',
  ];

  public constructor(page: Page) {
    // The root is the primary navigation region itself, since the banner might not always
    // be present or might not have the role properly applied in all app states.
    super(page, page.getByRole('navigation', { name: 'Primary' }));
  }

  private readonly navigation: Locator = this.page.getByRole('navigation', { name: 'Primary' });

  /** Returns the locator for a required navigation item, scoped to the primary nav. */
  public navItem(name: NavItem): Locator {
    if (name === 'ZincBank') {
      return this.navigation.getByRole('link', { name: 'ZincBank dashboard' });
    }
    if (name === 'Sign out') {
      return this.navigation.getByRole('button', { name: 'Sign out' });
    }
    return this.navigation.getByRole('link', { name, exact: true });
  }
}
