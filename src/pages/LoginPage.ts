import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * The Swag Labs login page.
 *
 * Locators confirmed against saucedemo.com: the username/password fields are
 * exposed via aria-label ("Username"/"Password") and data-test attributes; the
 * submit control is a real <button type="submit"> named "Login"; validation
 * failures render in an element with the `alert` role.
 */
export class LoginPage extends BasePage {
  public readonly usernameInput: Locator = this.page.getByLabel('Username');
  public readonly passwordInput: Locator = this.page.getByLabel('Password');
  public readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });
  public readonly errorAlert: Locator = this.page.getByRole('alert');

  private static readonly BASE_PATH = '/';

  public async open(): Promise<void> {
    await this.goto(LoginPage.BASE_PATH);
    await this.waitForReady();
  }

  public async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  public async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  public async submit(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Fills both credentials and submits the form.
   * The only programmatic flow allowed on this page - do not bypass the UI.
   */
  public async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
  }

  public async isLoginErrorVisible(): Promise<boolean> {
    return this.errorAlert.isVisible().catch(() => false);
  }

  public async getLoginErrorMessage(): Promise<string> {
    const text = await this.errorAlert.textContent();
    return text?.trim() ?? '';
  }

  public async dismissError(): Promise<void> {
    const dismissButton = this.errorAlert.getByRole('button', { name: 'Dismiss error' });
    if (await dismissButton.isVisible().catch(() => false)) {
      await dismissButton.click();
    }
  }
}
