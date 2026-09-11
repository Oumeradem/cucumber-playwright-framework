---
name: jira-import
description: Import failed scenarios (or BDD scenarios) into Jira as issues after de-duplication, using the Jira Import Agent and the scripts/jira helper.
mode: act
agents:
  - jira-import-agent
---

# Jira Import Workflow

Follow this workflow to reflect automation results or new BDD coverage in Jira.

## Prerequisites

Environment configured: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT`.

## Step 1 - Generate the source data

Run the suite and generate the Cucumber report so failures are available:

```bash
npx cucumber-js
npm run report:cucumber
```

## Step 2 - Preview (mandatory)

```bash
npm run jira:import:dry-run
```

Confirm which scenarios would be imported and that none already exist in Jira.

## Step 3 - Import

Invoke the **Jira Import Agent** to create/update issues. It must:

- Search for duplicates before creating (same summary) and skip existing ones.
- Preserve feature, scenario, preconditions, steps, expected results, tags, priority.

## Step 4 - Report

- List created issue keys and skipped existing issues.
- Never create duplicates and never fabricate Jira keys.
