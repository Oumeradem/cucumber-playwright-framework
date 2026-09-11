---
name: jira-status-update
description: Update Jira issue statuses/execution results from the latest automation report via the Jira Status Update Agent.
mode: act
agents:
  - jira-status-agent
---

# Jira Status Update Workflow

Follow this workflow to sync Jira issue statuses with the latest test results.

## Prerequisites

Environment configured: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`.

## Step 1 - Ensure a fresh report

```bash
npx cucumber-js
npm run report:cucumber
```

Only the latest report may be used as the source of truth.

## Step 2 - Map and update

Invoke the **Jira Status Update Agent**. It must:

- Read `reports/cucumber-report/cucumber-report.json`.
- Identify passed/failed/skipped scenarios.
- Map scenarios to Jira issues (by summary/title).
- Transition statuses via `scripts/jira/update-status.mjs <KEY> <STATUS>`.
- Add execution info and failure details where applicable.

## Rules

- NEVER mark a test PASS when the latest result is FAIL.
- Base every update on the latest report.
- Report which issues were updated and which were left unchanged.
