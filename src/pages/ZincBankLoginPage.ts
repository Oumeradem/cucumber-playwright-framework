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
    await this.emailInput.fill(email);
  }

  public async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  public async submit(): Promise<void> {
    // Click the submit button. May trigger navigation (successful sign-in) or validation
    // error message (failed sign-in, validation errors). Wait for the form to be stable.
    // Use a network idle or load state to handle both navigation and client-side validation.
    await Promise.all([
      this.page.waitForLoadState('networkidle'), // Handles both navigation and form validation
      this.signInButton.click(),
    ]);
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
