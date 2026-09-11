# Cucumber Rules

- Gherkin describes **business behavior**, not DOM implementation details.
- Feature files: `features/<area>/<name>.feature`; one `Feature:` per file with clear purpose.
- Use `Background:` only for genuine shared preconditions.
- Scenarios must be independent — no ordering, shared state, or cross-scenario dependencies.
- Tags: `@smoke`, `@sanity`, `@critical`, `@regression`, `@wip`. Do not duplicate feature files to create suites.
- Step definitions live in `src/steps/` and use the shared `CustomWorld` (`this.page`, `this.context`, `this.scenarioContext`).
- Keep step definitions thin and reusable; avoid regexes that overlap other definitions (Cucumber fails on ambiguity).
- Use parameterized steps and example tables for data-driven scenarios.
- Run `npx cucumber-js --dry-run` to validate that all steps resolve before running the full suite.
- Never disable steps or skip scenarios to make the suite green.
