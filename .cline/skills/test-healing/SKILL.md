---
name: test-healing
description: Diagnose and repair failing tests using evidence (screenshots, traces, errors). Maximum of 3 healing attempts, then escalate to the user.
---

# Test Healing Skill

## Evidence-first workflow

1. Reproduce: run the failing scenario (`npx cucumber-js --tags "<tag>"`).
2. Read the error message and the failure artifacts in `reports/artifacts/`.
3. Inspect the feature file, step definitions, and Page Object involved.
4. Form a root-cause hypothesis before editing anything.

## Common root causes

- Locator drift (UI text/attribute changed).
- Timing/race (resolve with auto-waiting/assertions, never `waitForTimeout`).
- Environment/data mismatch (config env, credentials, test data).
- Assertion mismatch (expected value vs. actual UI copy).

## Rules

- Max 3 healing attempts — after that, STOP and ask the user for help.
- Never disable assertions, skip/delete tests, hide failures, or change requirements.
- Re-run the affected test to validate, then `npm run verify`.
