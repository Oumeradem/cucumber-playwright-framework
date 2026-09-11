---
name: jira
description: Import BDD scenarios and update issue statuses in Jira via the provided scripts. Always dedupe and dry-run first.
---

# Jira Skill

## Configuration

Environment variables: `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT`, `JIRA_ISSUE_TYPE` (default `Bug`).

## Import failures → Jira bugs

```bash
npm run jira:import:dry-run      # preview what would be imported
npm run jira:import              # create/update bug issues for failed scenarios
```

- Reads `reports/cucumber-report/cucumber-report.json`.
- Searches for existing issues by summary before creating — never create duplicates.
- The Jira Import Agent is the intended caller.

## Update issue status

```bash
npm run jira:status -- <ISSUE_KEY> <TARGET_STATUS>
# e.g. npm run jira:status -- QA-123 "In Progress"
```

- Uses the issue's available transitions.
- Never mark a test PASS when the latest automation result is FAIL.
