---
name: page-object-model
description: Follow the Page Object Model conventions of this framework - one page/component per class, encapsulated locators and actions, no assertions or test logic.
---

# Page Object Model Skill

## Conventions

- `src/pages/BasePage.ts` provides shared helpers (`goto`, `waitForPage`, title, path).
- Each page class extends `BasePage` and accepts `page` + optional component collaborators.
- Components live in `src/pages/components/` (e.g. `Header.ts`) and are composed into pages.
- Locators are public readonly fields; actions are methods; `waitForReady()` confirms the page is ready.
- Use `override` when overriding a base member (e.g. `waitForReady`).

## Rules

- One page/component per file. No 1,000-line Page Objects.
- Encapsulate locators and page-specific actions. No test logic, no assertions.
- Prefer composition over inheritance beyond `BasePage`.
- Never hardcode URLs — use `config.baseUrl` and page paths.
