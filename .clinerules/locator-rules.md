# Locator Rules

Use Playwright's recommended locators in the following priority order:

1. `getByRole()` — semantic roles (`button`, `heading`, `link`, `textbox`, ...)
2. `getByLabel()` — form fields
3. `getByPlaceholder()` — placeholder text
4. `getByText()` — visible text
5. `getByTestId()` — `data-test`/`data-testid` attributes
6. `locator()` with stable attributes
7. CSS selectors
8. XPath — **last resort only**

Rules:

- NEVER write XPath when a Playwright locator exists.
- Avoid fragile selectors: `.btn:nth-child(2)`, `div > div > span`, generated classes.
- Prefer user-visible text over classes when appropriate (e.g. `getByRole('button', { name: 'Add to cart' })`).
- `getByTestId` requires the attribute `data-test` (registered globally for this framework).
- Scope locators to the smallest stable container (e.g. a product card) before targeting descendants.
- Encapsulate locators inside Page Objects — never sprinkle raw selectors through step definitions.
