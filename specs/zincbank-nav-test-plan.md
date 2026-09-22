# ZincBank Primary Navigation — Test Plan

**Feature:** The ZincBank authenticated application shell must display the required
items in its primary navigation (header) after a successful sign-in.

**Scope:** Presence only. This plan verifies that each required item is visible in
the header navigation. It does not assert link destinations or navigation behavior.

---

## Live-app verification (Planner Agent)

Inspected `https://zincbank.cydeo.io` in the live browser (signed in as a QA user).

- The `/login` page does **not** contain the tabs — it only shows a "ZincBank home"
  brand link to `/`.
- The required items appear in the **primary navigation banner** (`navigation
"Primary"`) of the **authenticated app shell**, persistent across all
  authenticated pages (confirmed on `/dashboard` and `/accounts`).
- Required items and their element types (verified):

  | Item         | Element                                    | Target URL (not asserted in this scope) |
  | ------------ | ------------------------------------------ | --------------------------------------- |
  | ZincBank     | link, accessible name "ZincBank dashboard" | `/dashboard`                            |
  | Dashboard    | link                                       | `/dashboard`                            |
  | Accounts     | link                                       | `/accounts`                             |
  | Move money   | link                                       | `/move-money`                           |
  | Transactions | link                                       | `/transactions`                         |
  | Cards        | link                                       | `/cards`                                |
  | Profile      | link                                       | `/profile`                              |
  | Sign out     | button                                     | —                                       |

- Also present (not in scope): "Toggle light or dark theme" button.
- Locator note: ZincBank uses `data-testid` attributes (`nav-accounts`, etc.),
  while the framework globally registers `data-test`. Prefer role-based locators
  scoped to the `navigation "Primary"` region (consistent with `ZincBankLoginPage`),
  or `getByTestId('nav-*')` where the test-id attribute is registered.

---

## Scenarios

### Scenario 1: Primary navigation shows all required items after sign-in

- Priority: Critical
- Tag: `@smoke @critical`
- Preconditions: Signed in (authenticated app shell displayed)
- Steps:
  - Given I open the ZincBank application
  - When I sign in with my ZincBank credentials
  - Then the header navigation shows all required items:
    ZincBank, Dashboard, Accounts, Move money, Transactions, Cards, Profile, Sign out

### Scenario Outline: Each required navigation item is visible

- Priority: Medium
- Tag: `@regression`
- Preconditions: Signed in (authenticated app shell displayed)
- Steps:
  - Given I open the ZincBank application
  - When I sign in with my ZincBank credentials
  - Then the header navigation shows the item "<item>"
- Examples:
  | item |
  | ZincBank |
  | Dashboard |
  | Accounts |
  | Move money |
  | Transactions |
  | Cards |
  | Profile |
  | Sign out |

---

## Reuse & new code

- Reuse existing steps: `I open the ZincBank application`, `I sign in with my
ZincBank credentials`.
- New Page Object: a `Header` (or navigation) component exposing the nav items via
  role-based locators scoped to the `navigation "Primary"` banner.
- New step definitions:
  - `the header navigation shows all required items` (asserts the full set)
  - `the header navigation shows the item {string}` (per-item assertion)
