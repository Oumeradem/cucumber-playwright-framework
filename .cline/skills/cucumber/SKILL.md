---
name: cucumber
description: Write correct Gherkin and Cucumber configuration for this framework - feature files, tags, step definitions, and the custom World.
---

# Cucumber Skill

## Feature files

- Location: `features/<area>/<name>.feature`.
- Gherkin describes business behavior, NOT DOM implementation details.
- Tags drive suites: `@smoke`, `@sanity`, `@critical`, `@regression`, `@wip`.
- Scenarios must be independent; never depend on order or shared state.

## Step definitions

- Location: `src/steps/`.
- One step definition per semantic action; keep them thin — delegate to Page Objects.
- Use the shared `CustomWorld` (`this.page`, `this.context`, `this.scenarioContext`) instead of globals.
- All step files must register with `setDefaultTimeout` and use the world in `this`.

## Running

```bash
npx cucumber-js                    # full suite
npm run test:smoke                 # --tags "@smoke"
npm run test:dry-run               # validate definitions only
```

## Reports

- Cucumber HTML/JSON + summary produced by `npm run report:cucumber` (script: `scripts/summarize-cucumber-report.js`).
- Allure results are produced per-scenario by the reporter.
