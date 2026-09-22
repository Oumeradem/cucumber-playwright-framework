import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The ZincBank login page.
 *
 * Locators confirmed against the live app (https://zincbank.cydeo.io/login):
 * fields are exposed via real labels ("Email"/"Password"), the submit control is
 * a <button type="submit"> named "Sign in", and messages render in an element
 * with the `note` role. ZincBank uses `data-testid` attributes, so role/label
 * locators are used instead of `getByTestId` (the framework registers `data-test`
 * globally, which ZincBank does not use).
 */
export class ZincBankLoginPage extends BasePage {
  public readonly emailInput: Locator = this.page.getByLabel('Email');
  public readonly passwordInput: Locator = this.page.getByLabel('Password');
  public readonly signInButton: Locator = this.page.getByRole('button', { name: 'Sign in' });
  public readonly openAccountLink: Locator = this.page.getByRole('link', { name: 'Open an account' });
  public readonly note: Locator = this.page.getByRole('note');

  private static readonly BASE_PATH = '/login';

  public async open(): Promise<void> {
    await this.goto(ZincBankLoginPage.BASE_PATH);
    await this.waitForReady();
  }

  public override async waitForReady(): Promise<void> {
    await this.signInButton.waitFor({ state: 'visible' });
  }

  public async fillEmail(email: string): Promise<void> {
    // Ensure the email input is ready and visible before filling
    await this.emailInput.waitFor({ state: 'visible' });
    await this.emailInput.fill(email);
  }

  public async fillPassword(password: string): Promise<void> {
    // Ensure the password input is ready and visible before filling
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  public async submit(): Promise<void> {
    // Click the submit button. This may trigger:
    // 1. Navigation to /dashboard (successful sign-in)
    // 2. A client-side validation error message (failed sign-in, empty fields, etc.)
    // We must click FIRST, then wait for the network to settle (or navigation to occur).
    // If client-side validation shows an error, the page stays on /login with no network activity.
    // If submission succeeds, the page navigates to /dashboard.
    // Ensure the button is enabled and visible before clicking
    await this.signInButton.waitFor({ state: 'visible' });
    await this.signInButton.click();
    // Wait for network to settle after the click. This handles both:
    // - Navigation to /dashboard (successful sign-in)
    // - Client-side validation errors that appear without navigation
    try {
      // Use a short timeout for navigation; if no nav occurs, we'll wait for load state instead
      await this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 3000 });
    } catch {
      // Navigation may not happen (client-side validation), so wait for load state to settle
      await this.page.waitForLoadState('networkidle');
    }
    // After sign-in attempt, if we're on the dashboard, wait for the page to fully load
    // (including the authenticated app shell with header/nav). This prevents race conditions
    // where nav elements haven't rendered yet.
    const currentUrl = this.page.url();
    if (currentUrl.includes('/dashboard')) {
      await this.page.waitForLoadState('load');
    }
  }

  /** Fills both fields and submits the form. */
  public async signIn(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  public async getNoteMessage(): Promise<string> {
    const text = await this.note.textContent();
    return text?.trim() ?? '';
  }
}
