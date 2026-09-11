# Architecture Rules

- This is a **Playwright + TypeScript + Cucumber BDD** framework driven by Cucumber's library API (`@cucumber/cucumber`), not the `@playwright/test` runner.
- Layered flow: **Feature file → Step definitions → Page Objects (POM) → Playwright → Assertions → Reports**.
- `src/config/config.ts` is the single source of truth for environment/browser/runtime settings; never scatter `process.env` reads through the codebase.
- Pages live in `src/pages/`, one class per page/component. Components (e.g. `Header`) are composed into pages.
- Step definitions live in `src/steps/` and must be thin — delegate behavior to Page Objects.
- Hooks (`src/hooks/hooks.ts`) own the browser lifecycle: launch browser → fresh context/page per scenario → capture failure artifacts → close.
- `src/support/world.ts` defines the shared `CustomWorld` (page, context, scenario context).
- Utilities that don't fit elsewhere go in `src/utils/`; shared types in `src/types/`; data builders in `src/data/`.
- Feature files live in `features/<area>/<name>.feature`. Do not duplicate feature files for suites — use tags.
- Do not create unnecessary folders; keep the structure aligned with the layout in `README.md`.
