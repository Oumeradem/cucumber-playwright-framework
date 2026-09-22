import { BasePage } from './BasePage';
import { Header } from './components/Header';

/**
 * The authenticated ZincBank home/dashboard page. The primary navigation header
 * is composed here as a reusable component (present on every authenticated page).
 */
export class ZincBankHomePage extends BasePage {
  public readonly header: Header = new Header(this.page);
}
