---
name: reporting
description: Generate and inspect the framework's reports - Cucumber HTML/JSON summary and Allure report - and read failure artifacts.
---

# Reporting Skill

## Commands

```bash
npm run report:clean         # wipe reports/ (allure + cucumber)
npm run report:cucumber      # Cucumber HTML/JSON + console summary
npm run report:allure        # generate Allure report (allure-report/)
npm run report:allure:open   # open the Allure report in a browser
```

## What each report shows

- **Cucumber** (`reports/cucumber-report/`): feature → scenario → step status, duration, error; plus a console summary from `scripts/summarize-cucumber-report.js`.
- **Allure** (`reports/allure-report/`): per-scenario steps, status, duration, environment info, and attached failure artifacts (screenshot, trace, error, console).

## Failure artifacts

- Written to `reports/artifacts/` on failure: `<scenario>.png`, `<scenario>.zip` (trace), `error-message.txt`, `console-errors.txt`.
- Attached automatically to the Allure report via `World#attach`.

## Validate a report

Always confirm the JSON report exists and parse cleanly before sharing results:

```bash
node -e "JSON.parse(require('fs').readFileSync('reports/cucumber-report/cucumber-report.json','utf8')); console.log('valid')"
```
