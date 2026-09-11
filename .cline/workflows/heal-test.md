---
name: heal-test
description: Repair failing tests using the Healer Agent - analyze evidence, apply at most 3 fixes, and escalate to the user if still failing.
mode: act
agents:
  - healer-agent
---

# Heal Test Workflow

Follow this workflow when a scenario is failing.

## Step 1 - Reproduce

Run the failing scenario and capture the error:

```bash
npx cucumber-js --tags "@<tag>" 2>&1 | tail -40
```

## Step 2 - Analyze

- Read the error message and failure artifacts in `reports/artifacts/`.
- Inspect the feature file, step definitions, and Page Object.
- State the probable root cause before editing.

## Step 3 - Apply fix (max 3 attempts)

Invoke the **Healer Agent**. For each attempt:

1. Apply a targeted fix.
2. Re-run the affected scenario.
3. Stop the moment it passes.

If the scenario still fails after 3 attempts: **STOP and ask the user for help.** Do not keep changing code.

## Step 4 - Validate

```bash
npm run verify
npm run report:cucumber
```

Report the final status honestly — never claim a fix that did not pass.
