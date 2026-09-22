# Test Plan — ZincBank User Login

> Prepared by the Planner Agent after inspecting the **live** application at `https://zincbank.cydeo.io/login` (Playwright MCP). Plan only — no implementation code.

---

## Confirmed real UI (evidence from live inspection)

**Login page — `https://zincbank.cydeo.io/login`** (title: "Log in · ZincBank")

| Element              | Observed                                                     | Recommended locator (framework priority)                |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| Heading              | **"Sign in to ZincBank"** (h1), subtitle "Welcome back"      | `getByRole('heading', { name: 'Sign in to ZincBank' })` |
| Email field          | label **Email**, placeholder `you@example.com`, `type=email` | `getByLabel('Email')`                                   |
| Password field       | label **Password**, `type=password`                          | `getByLabel('Password')`                                |
| Sign in button       | button **Sign in**, `type=submit`                            | `getByRole('button', { name: 'Sign in' })`              |
| Open an account link | **Open an account** → `/apply`                               | `getByRole('link', { name: 'Open an account' })`        |
| Message region       | `note` role (app-level, hidden when empty)                   | `getByRole('note')` (or `getByText`)                    |

**Confirmed behaviors (all verified live):**

- **Empty / partial form** (both empty, email-only, or password-only) → message **"Enter your email and password."** — a single "both fields required" client-side check, no per-field validation.
- **Invalid credentials** (`invalid@example.com` / `wrong-password`) → HTTP 400 to Supabase `/auth/v1/token?grant_type=password`, app shows **"Invalid email or password."** and stays on `/login`.
- **Valid credentials** (from `.env`) → redirects to **`https://zincbank.cydeo.io/dashboard`**, title **"Dashboard · ZincBank"**.

**⚠️ Critical locator finding:** ZincBank uses **`data-testid`** (`login-page`, `login-email-input`, `login-password-input`, `login-submit`, `login-apply-link`), but this framework registers **`data-test`** globally (`selectors.setTestIdAttribute('data-test')` in `src/hooks/hooks.ts`). So **`getByTestId()` will NOT work on ZincBank.** The plan relies on `getByLabel` / `getByRole` (higher-priority locators). `data-testid` values remain available as a fallback via `locator('[data-testid="..."]')` if ever needed.

---

## Reuse & test data

- **Reuse:** `BasePage` (`goto`, `waitForReady`) and the `CustomWorld` pages registry. The existing `src/pages/LoginPage.ts` and `src/steps/login.steps.ts` are **Saucedemo-specific** (Username/Password labels, "Login" button, `/inventory.html`) and are **not** reusable for ZincBank — the generator should add a new `ZincBankLoginPage` + ZincBank login steps and register them in `src/fixtures/pages.ts`.
- **Valid credentials:** from `.env` keys **`USERNAME`** and **`PASSWORD`**, consumed via `config.username` / `config.password` (never hardcoded, never logged).
- **Invalid data:** any non-matching values, e.g. `invalid@example.com` / `wrong-password`.

---

## Scenarios

```
Test Plan
---------
Feature: ZincBank User Login
Proposed file: features/login/zincbank-login.feature
Entry: https://zincbank.cydeo.io/login (BASE_URL + /login)
Valid creds: from .env (config.username / config.password)

Scenario 1: Successful sign-in with valid credentials
Preconditions: Valid ZincBank credentials present in .env (USERNAME/PASSWORD)
Steps:
  Given I open the ZincBank application
  And I am on the ZincBank login page
  When I sign in with my ZincBank credentials
  Then I am signed in and land on the ZincBank dashboard
      (URL contains /dashboard, title "Dashboard · ZincBank")
Priority: Critical
Tag: @smoke @critical

Scenario 2: Sign-in with invalid credentials shows an error
Preconditions: Valid email from .env; wrong password
Steps:
  Given I open the ZincBank application
  And I am on the ZincBank login page
  When I sign in with email "invalid@example.com" and password "wrong-password"
  Then a login error "Invalid email or password." is displayed
  And I remain on the login page
Priority: High
Tag: @regression

Scenario 3: Submitting the empty form shows a validation message
Steps:
  Given I open the ZincBank application
  And I am on the ZincBank login page
  When I submit the login form without entering credentials
  Then a validation message "Enter your email and password." is displayed
  And I remain on the login page
Priority: Medium
Tag: @regression

Scenario 4: Missing password shows a validation message
Steps:
  Given I open the ZincBank application
  And I am on the ZincBank login page
  When I enter my email but leave the password empty and submit
  Then a validation message "Enter your email and password." is displayed
Priority: Medium
Tag: @regression

Scenario 5: Missing email shows a validation message
Steps:
  Given I open the ZincBank application
  And I am on the ZincBank login page
  When I enter a password but leave the email empty and submit
  Then a validation message "Enter your email and password." is displayed
Priority: Medium
Tag: @regression
```

> Scenarios 3–5 can be collapsed into one data-driven scenario using a table of the three empty-field combos, since all three produce the identical message.

---

## Notes for the Test Generator Agent

1. **Do not use `getByTestId()`** for ZincBank — use `getByLabel`/`getByRole` (data-testid mismatch with the registered `data-test`).
2. **Read valid credentials from config** (`config.username`/`config.password`), never hardcode.
3. Create `ZincBankLoginPage` extending `BasePage` and thin ZincBank login steps; register the page in `src/fixtures/pages.ts`.
4. Assertions: success = URL `/dashboard` + title; failure = `getByRole('note')` containing the exact message + staying on `/login`.
5. Suggested shared steps: `I open the ZincBank application`, `I am on the ZincBank login page`, `I sign in with email {string} and password {string}`, `a login error {string} is displayed`, `a validation message {string} is displayed`.
6. Run `npx cucumber-js --dry-run` then the new feature, then `npm run verify`.
