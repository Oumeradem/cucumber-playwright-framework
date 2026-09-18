# AI Agents User Guide

A practical guide to the **Cline AI-agent toolchain** shipped with this Playwright + TypeScript + Cucumber BDD framework. Use this guide to plan, generate, heal, run, and report on BDD tests with the built-in agents, skills, and workflows.

All examples reference the **ZincBank** demo banking application at `https://zincbank.cydeo.io` (login: `https://zincbank.cydeo.io/login`).

---

## Table of Contents

- [1. Overview](#1-overview)
- [2. The toolchain at a glance](#2-the-toolchain-at-a-glance)
- [3. Point the framework at ZincBank](#3-point-the-framework-at-zincbank)
- [4. ZincBank at a glance (real UI)](#4-zincbank-at-a-glance-real-ui)
- [5. Agents](#5-agents)
  - [5.1 Planner Agent](#51-planner-agent)
  - [5.2 Test Generator Agent](#52-test-generator-agent)
  - [5.3 Healer Agent](#53-healer-agent)
  - [5.4 Git Agents (branch, commit, push, PR)](#54-git-agents-branch-commit-push-pr)
  - [5.5 Jira Agents (import, status)](#55-jira-agents-import-status)
- [6. Skills](#6-skills)
- [7. Workflows (end-to-end recipes)](#7-workflows-end-to-end-recipes)
- [8. Rules & guardrails](#8-rules--guardrails)
- [9. Troubleshooting & FAQ](#9-troubleshooting--faq)

---

## 1. Overview

The `.cline/` folder ships a complete agent toolchain so you can delegate planning, test authoring, maintenance, version control, and Jira reporting to AI — safely, with human approval gates.

```text
project-root/
├── .cline/
│   ├── agents/      # 9 specialized agents
│   ├── skills/      # 9 reusable knowledge playbooks
│   └── workflows/   # 4 end-to-end recipes (plan → generate → heal → report)
├── .clinerules/     # 10 rule sets every agent must follow
├── features/        # Gherkin feature files
└── src/             # steps/, pages/, hooks/, config/, support/, ...
```

**Who is this for?**

- QA / SDET engineers who want AI-assisted BDD test authoring.
- Developers adding automated coverage for new features.
- Anyone maintaining a growing Playwright/Cucumber suite.

**The three building blocks:**

1. **Agents** — specialized assistants you invoke with a prompt (e.g. _"Plan BDD tests for the ZincBank login page"_).
2. **Skills** — playbooks the agents consult to follow framework conventions (locator rules, POM patterns, reporting, etc.). You can also ask for a skill directly.
3. **Workflows** — canned multi-step recipes that chain agents together for common jobs (create a test, heal a test, import to Jira, sync Jira status).

---

## 2. The toolchain at a glance

### Agents (`.cline/agents/`)

| Agent                  | What it does                                                                               | When you invoke it                     |
| ---------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- |
| `planner-agent`        | Turns a requirement into a structured BDD test plan after **inspecting the live app**      | Before writing any code                |
| `test-generator-agent` | Implements the plan: feature files, step definitions, Page Objects — and **runs the test** | When a plan is approved                |
| `healer-agent`         | Diagnoses and fixes failing tests (**max 3 attempts**, then escalates)                     | A scenario is failing                  |
| `git/branch-agent`     | Creates a correctly named branch (`feature/`, `bugfix/`, `test/`, `chore/`)                | Starting new work                      |
| `git/commit-agent`     | Reviews the diff, blocks secrets, writes a Conventional Commit                             | Work is ready to commit                |
| `git/push-agent`       | Pushes the branch (**only with your approval**)                                            | Branch is committed                    |
| `git/pr-agent`         | Drafts a pull request with real test results and report links                              | Branch is pushed                       |
| `jira-import-agent`    | Imports BDD scenarios into Jira **after de-duplication**                                   | New coverage should be tracked in Jira |
| `jira-status-agent`    | Syncs Jira statuses from the **latest** automation report                                  | You want results reflected in Jira     |

### Skills (`.cline/skills/`)

`playwright` · `cucumber` · `page-object-model` · `test-design` · `test-healing` · `git` · `jira` · `reporting` · `environment-management`

### Workflows (`.cline/workflows/`)

| Workflow             | Chains                                         | Use for                                             |
| -------------------- | ---------------------------------------------- | --------------------------------------------------- |
| `create-test`        | planner → test-generator → run/verify → report | Adding coverage for a new feature                   |
| `heal-test`          | reproduce → analyze → fix (≤3) → validate      | Repairing a failing scenario                        |
| `jira-import`        | report → dry-run → jira-import-agent           | Importing failed scenarios / new coverage into Jira |
| `jira-status-update` | report → jira-status-agent                     | Syncing Jira issue statuses with results            |

---

## 3. Point the framework at ZincBank

The framework's default reference app is Swag Labs (saucedemo.com). To run examples against ZincBank:

```bash
# 1. Install dependencies and browser (once)
npm ci
npx playwright install chromium

# 2. Create your local environment file (git-ignored)
cp .env.example .env
```

Edit `.env` (never commit it):

```dotenv
ENV=qa
BASE_URL=https://zincbank.cydeo.io
USERNAME=your-zincbank-email      # e.g. you@example.com
PASSWORD=your-zincbank-password
BROWSER=chromium
HEADLESS=true
WORKERS=1
TRACE=on-first-retry
SCREENSHOT=only-on-failure
```

> **Security:** real credentials live **only** in `.env` / CI secret stores. Never put them in feature files, code, prompts, or this guide. Run `npm run verify:secrets` before committing.

### Useful commands

```bash
npm run test:dry-run              # validate all step definitions resolve
npx cucumber-js --tags "@smoke"   # run a tagged subset
npm run verify                    # lint + format + typecheck
npm run report:cucumber           # Cucumber HTML/JSON + console summary
npm run report:allure             # Allure report
```

---

## 4. ZincBank at a glance (real UI)

These are the real, observed elements you'll base your examples on. The planner agent discovers them by inspecting the live page; you can use this section to sanity-check the locators it proposes.

### Login page — `https://zincbank.cydeo.io/login`

| Element             | How users see it                               | Recommended Playwright locator                        |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Email field         | label **Email**, placeholder `you@example.com` | `page.getByLabel('Email')`                            |
| Password field      | label **Password**                             | `page.getByLabel('Password')`                         |
| Sign in button      | button **Sign in**                             | `page.getByRole('button', { name: 'Sign in' })`       |
| Create account link | link **Open an account** → `/apply`            | `page.getByRole('link', { name: 'Open an account' })` |
| Error region        | `alert` role, empty when no error              | `page.getByRole('alert')`                             |

### Account opening — `https://zincbank.cydeo.io/apply`

A 6-step wizard, step indicator "Step N of 6":

- **Step 1 · Choose your accounts**
  - Checking — _"Always included · $0.00 to start"_ (checked checkbox)
  - Savings — _"Optional · open one alongside checking"_
  - Joint account — _"Coming soon"_ (disabled checkbox)
  - Button **Continue**
- **Step 2 · About you**
  - First name (required), Last name (required), Email (required)
  - Phone (optional), Date of birth (optional)
  - Buttons **Back** / **Continue**

---

## 5. Agents

### 5.1 Planner Agent

**Role:** converts a requirement into a structured BDD test plan. It **inspects the live application with the browser first** — it never guesses UI behavior. It produces a _plan_, never code.

**When to use:** at the very start of any "add coverage" request.

**Example prompts:**

> Plan BDD test coverage for the ZincBank login page at https://zincbank.cydeo.io/login.
>
> I need tests for opening a ZincBank account at https://zincbank.cydeo.io/apply. Plan the scenarios, preconditions, tags, and priorities.
>
> Create a test plan for the ZincBank sign-in flow covering positive, negative, and validation cases.

**What the planner does:**

1. Opens the live page(s) with the browser and records the real labels, buttons, and behaviors.
2. Identifies the user journey and its entry points (e.g. `/login`, then the post-login dashboard).
3. Enumerates scenario categories: happy-path, negative, boundary, validation, empty-state.
4. Searches `src/pages/` and `src/steps/` for existing Page Objects/step definitions to reuse.
5. Identifies required test data and preconditions.
6. Assigns tags (`@smoke`, `@sanity`, `@critical`, `@regression`, `@wip`) and priorities.

**Example output (what to expect):**

```text
Test Plan
---------
Feature: ZincBank User Login

Scenario 1: Successful sign-in with valid credentials
Preconditions: A registered ZincBank account (from .env)
Steps:
  Given I am on the ZincBank login page
  When I sign in with email "<USERNAME>" and password "<PASSWORD>"
  Then I am signed in to my account
Priority: Critical
Tag: @smoke @critical

Scenario 2: Sign-in with an invalid password shows an error
Preconditions: A registered ZincBank account
Steps:
  Given I am on the ZincBank login page
  When I sign in with email "<USERNAME>" and password "wrong-password"
  Then a sign-in error is displayed
Priority: High
Tag: @regression
```

**Rules it follows:**

- Never generates feature files or step definitions — it hands off to the Test Generator Agent.
- Never guesses UI behavior — inspects it first.
- Reuses existing steps and Page Objects wherever possible.

### 5.2 Test Generator Agent

**Role:** turns an approved planner test plan into working, runnable code: feature file → thin step definitions → Page Objects. It **reuses existing framework code** and **runs the generated test** before finishing.

**When to use:** immediately after the planner returns a plan you approve.

**Example prompts:**

> Generate the ZincBank login tests from this plan: <paste the planner output>
>
> Implement the plan for the ZincBank account-application feature. Reuse existing steps and Page Objects where possible.
>
> Add the ZincBank sign-in scenarios from the test plan as a new feature file under features/login/.

**What the generator does:**

1. Reads the planner output and analyzes `features/`, `src/steps/`, `src/pages/`, `src/support/world.ts`, `src/hooks/`.
2. Reuses existing step definitions and Page Objects — only creates new ones when necessary.
3. Writes Gherkin describing **business behavior**, not DOM details.
4. Writes thin step definitions that delegate to Page Objects.
5. Follows the locator rules (role > label > placeholder > text > `data-test` > CSS > XPath).
6. Runs the new test and fixes obvious issues.
7. Runs `npm run verify` (lint + format + typecheck).

**Example generated feature file** (`features/login/zincbank-login.feature`):

```gherkin
@regression
Feature: ZincBank User Login
  As a ZincBank customer
  I want to sign in to my account
  So that I can access my banking services

  Background:
    Given I open the ZincBank application
    And I am on the login page

  @smoke @critical
  Scenario: Successful sign-in with valid credentials
    When I sign in with email "<email>" and password "<password>"
    Then I am signed in to my account

  @sanity
  Scenario: Sign-in with an invalid password shows an error
    When I sign in with email "<email>" and password "wrong-password"
    Then a sign-in error is displayed
```

**Example Page Object** (`src/pages/LoginPage.ts` for ZincBank):

```ts
import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  public readonly emailInput: Locator = this.page.getByLabel('Email');
  public readonly passwordInput: Locator = this.page.getByLabel('Password');
  public readonly signInButton: Locator = this.page.getByRole('button', { name: 'Sign in' });
  public readonly errorAlert: Locator = this.page.getByRole('alert');

  public async open(): Promise<void> {
    await this.goto('/login');
    await this.waitForReady();
  }

  public async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
```

> The generator typically replaces the demo LoginPage (Saucedemo) with a ZincBank version, or adds ZincBank page objects under a new area — it decides based on what's already in `src/pages/`.

**Rules it follows:**

- Never blindly duplicates Page Objects or step definitions — it searches first.
- Keeps step definitions thin; logic lives in Page Objects.
- Never uses XPath when a Playwright locator exists; never uses arbitrary `waitForTimeout`.
- Never hardcodes credentials or URLs (uses `config` and `scenarioContext`).
- Each scenario must be independent and isolated.

### 5.3 Healer Agent

**Role:** diagnoses and fixes a failing Cucumber scenario using evidence (error message, screenshot, trace). Strictly limited to **3 healing attempts** — after that it stops and asks you for help.

**When to use:** any time a scenario fails — locator drift, changed UI copy, timing, or data issues.

**Example prompts:**

> The ZincBank sign-in scenario is failing. Heal it.
>
> Fix the failing test "Sign-in with an invalid password shows an error". Here is the error: <paste error>
>
> The ZincBank login Page Object locators no longer match the app. Repair the test.

**Healing sequence (per attempt):**

1. Runs the failing scenario and captures the error.
2. Reads the failure artifacts in `reports/artifacts/` (screenshot, trace, `error-message.txt`, `console-errors.txt`).
3. Inspects the feature file and its step definitions.
4. Inspects the relevant Page Object locators/actions.
5. Forms a root-cause hypothesis **before** editing anything.

```text
Failure → Analyze → Attempt #1 → Run test → still failing?
  → Attempt #2 → Run test → still failing?
  → Attempt #3 → Run test → still failing? → ASK USER FOR HELP
```

**Common root causes it looks for:**

- Locator drift (ZincBank changed a label, e.g. "Sign in" → "Log in").
- Timing/race (resolved with auto-waiting/assertions, **never** `waitForTimeout`).
- Environment/data mismatch (wrong `BASE_URL`, expired `.env` credentials).
- Assertion mismatch (expected copy vs. actual UI text).

**Rules it follows:**

- NEVER disables assertions, deletes tests, skips tests, adds arbitrary waits, or hides failures.
- After 3 unsuccessful attempts: **STOP and ask the user for help.**
- Validates a fix by re-running the affected test, then `npm run verify`.

### 5.4 Git Agents (branch, commit, push, PR)

The four git agents keep `main` clean and make every commit safe and reviewable.

#### 5.4.1 Branch Agent

**Role:** creates a correctly named branch. Never works directly on `main` without your approval.

**Naming convention:**

| Type    | Prefix     | ZincBank example                    |
| ------- | ---------- | ----------------------------------- |
| Feature | `feature/` | `feature/zincbank-login-tests`      |
| Bug fix | `bugfix/`  | `bugfix/zincbank-login-locator`     |
| Test    | `test/`    | `test/zincbank-account-application` |
| Chore   | `chore/`   | `chore/update-playwright`           |

**Example prompts:**

> Create a branch for the new ZincBank login tests.
> Start a bugfix branch to repair the ZincBank sign-in locator.

**Process:** confirms current branch → fetches/pulls `main` if needed → `git checkout -b <type>/<kebab-case>` → confirms the new branch is active.

#### 5.4.2 Commit Agent

**Role:** reviews working changes, blocks secrets and junk, and creates a Conventional Commit.

**Example prompts:**

> Commit the ZincBank login feature file, steps, and page objects.
> Review my changes and commit them with a proper message.

**Process:**

1. Runs `git status` and `git diff` to inspect exactly what changed.
2. Blocks anything unsafe: real credentials, `.env`, `reports/`, `allure-results/`, `screenshots/`, `videos/`, `traces/`, `dist/`, debug leftovers.
3. If anything unsafe is present, it **stops and asks you**.
4. Writes a Conventional Commit, e.g.:

```text
test: add ZincBank login scenarios

- feature file for successful and invalid sign-in
- thin step definitions delegating to LoginPage
- ZincBank LoginPage page object with role/label locators
```

5. Stages only the intended files (`git add <files>`), never `git add -A` blindly.
6. Commits and confirms the result.

> Run `npm run verify` and `npm run verify:secrets` **before** asking it to commit — it checks the diff too, but a clean working tree helps.

#### 5.4.3 Push Agent

**Role:** pushes committed changes to the remote — **only with your explicit approval.**

**Example prompt:**

> Push the current branch to origin.

**Process:** verifies committed changes exist (`git log origin/<branch>..HEAD`) → confirms the remote → `git push -u origin <branch>` → reports the result. Never force-pushes unless you explicitly ask.

#### 5.4.4 PR Agent

**Role:** drafts a pull request with a real change summary, real test results, and report links — **only opened with your explicit approval.**

**Example prompt:**

> Create a PR for the ZincBank login test branch.

**What the PR body includes:**

- **Summary** — what changed and why.
- **Test results** — exact scenario/step pass/fail counts (from `npm run report:cucumber` or the run).
- **Reports** — paths to the Cucumber HTML/JSON and Allure report.
- **Checklist** — `npm run verify`, `npm run verify:secrets`, CI status.

**Rules:** never opens a PR without approval, never opens from an unpushed branch, never claims tests pass unless they actually ran.

### 5.5 Jira Agents (import, status)

The two Jira agents keep your automation results and BDD coverage in sync with Jira. They need these environment variables configured (in `.env` or CI secrets):

```dotenv
JIRA_BASE_URL=https://your-instance.atlassian.net
JIRA_EMAIL=you@example.com
JIRA_API_TOKEN=your-token
JIRA_PROJECT=QA
# optional: JIRA_ISSUE_TYPE=Bug
```

#### 5.5.1 Jira Import Agent

**Role:** imports BDD scenarios into Jira as issues. **Always searches for duplicates first** and never creates duplicates blindly.

**Example prompts:**

> Import the ZincBank login scenarios into Jira.
> Import the failed scenarios from the latest run into Jira as bugs.

**Process:**

1. Reads the feature files under `features/`.
2. Converts each scenario into a Jira-compatible test case, preserving feature, scenario name, preconditions, steps, expected results, tags, and priority.
3. **Searches for existing issues by summary before creating anything.**
4. If an equivalent issue already exists, it reports the existing key instead of creating a duplicate.
5. Requires your approval to create issues.

**Commands it uses:**

```bash
npm run jira:import:dry-run   # preview what would be imported (mandatory first step)
npm run jira:import           # create/update issues
```

#### 5.5.2 Jira Status Agent

**Role:** reflects the **latest** automation results back into Jira issue statuses/executions. It never marks a test PASS when the latest automation result is FAIL.

**Example prompts:**

> Update Jira statuses from the latest test run.
> Sync the ZincBank login test results to their Jira issues.

**Process:**

1. Reads the latest report (`reports/cucumber-report/cucumber-report.json`).
2. Identifies passed, failed, and skipped scenarios.
3. Maps scenarios to Jira issues by summary/title.
4. Updates each issue's status/execution result via `scripts/jira/update-status.mjs`.
5. Adds execution info and, for failures, the failure detail.

**Commands it uses:**

```bash
npm run jira:status -- <ISSUE_KEY> <TARGET_STATUS>
# e.g. npm run jira:status -- QA-123 "In Progress"
```

**Rules:** base every update on the latest report; never PASS on FAIL; never expose credentials in output or logs.

---

## 6. Skills

Skills are reusable playbooks the agents consult to follow this framework's conventions. You can also invoke them directly by asking, e.g. _"Use the page-object-model skill..."_ or via slash-command when available.

| Skill                    | What it covers                                                                                                                        | Example request                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `playwright`             | Auto-waiting, recommended locators, no arbitrary waits, framework-specific setup (`data-test` registered, fresh context per scenario) | "Check the ZincBank sign-in steps against the playwright skill rules."                        |
| `cucumber`               | Gherkin conventions, tags, thin step definitions, the custom `World`, dry-run validation                                              | "Review my new ZincBank feature file following the cucumber skill."                           |
| `page-object-model`      | One page/component per class, encapsulated locators/actions, no assertions in pages, composition over inheritance                     | "Refactor the ZincBank page objects using the page-object-model skill."                       |
| `test-design`            | Scenario categories, independence, tagging (`@smoke`/`@sanity`/`@critical`/`@regression`/`@wip`), reusability                         | "Design boundary scenarios for the ZincBank account application using the test-design skill." |
| `test-healing`           | Evidence-first repair workflow, common root causes, the 3-attempt limit                                                               | "Heal the failing ZincBank scenario using the test-healing skill."                            |
| `git`                    | Branch naming, Conventional Commits, secret blocking, push/PR approval gates                                                          | "Prepare a commit for the ZincBank login tests following the git skill."                      |
| `jira`                   | Import flow (dry-run first, dedupe) and status updates (latest report only)                                                           | "Import the ZincBank scenarios using the jira skill."                                         |
| `reporting`              | Generating/inspecting Cucumber + Allure reports, reading failure artifacts                                                            | "Summarize the latest run using the reporting skill."                                         |
| `environment-management` | `ENV=dev                                                                                                                              | qa                                                                                            | stage | prod`, `.env` credentials, browser/runtime overrides, secrets check | "Set up the framework to run against ZincBank using the environment-management skill." |

**Key commands the skills reference:**

```bash
ENV=qa npm test                      # run against the qa environment (BASE_URL from config/.env)
BROWSER=firefox npx cucumber-js      # switch browser
HEADLESS=false npm run test:headed   # headed run
WORKERS=4 npx cucumber-js            # parallel workers
npx cucumber-js --dry-run            # validate all steps resolve
npm run verify                       # lint + format + typecheck
npm run verify:secrets               # scan tracked files for secrets
npm run report:cucumber              # Cucumber HTML/JSON + console summary
npm run report:allure                # Allure report
npm run report:clean                 # wipe reports/
```

---

## 7. Workflows (end-to-end recipes)

Workflows chain agents for common jobs. Pick the one that matches what you want to do.

### 7.1 `create-test` — add coverage for a new feature

Use when you have a new requirement to cover (e.g. _"I want ZincBank login tested"_).

**Example kick-off:**

> Add automated coverage for signing in to ZincBank at https://zincbank.cydeo.io/login.

**Steps the workflow runs:**

1. **Plan** — the Planner Agent inspects the live ZincBank login page, confirms real labels ("Email", "Password", "Sign in"), and produces the test plan (positive, negative, validation scenarios, tags, priorities). No code.
2. **Generate** — you approve the plan; the Test Generator Agent reuses existing steps/Page Objects, creates `features/login/zincbank-login.feature`, thin step definitions, and a ZincBank `LoginPage`.
3. **Run & verify:**
   ```bash
   npx cucumber-js --tags "@zincbank-login"   # or @smoke
   npm run verify                              # lint + format + typecheck
   npm run report:cucumber
   ```
4. **Report** — the agent summarizes pass/fail counts and any issues. Nothing is committed unless you explicitly ask.

### 7.2 `heal-test` — repair a failing scenario

Use when a scenario fails (e.g. ZincBank changed a label).

**Example kick-off:**

> The "Successful sign-in with valid credentials" scenario is failing. Heal it.

**Steps the workflow runs:**

1. **Reproduce** — `npx cucumber-js --tags "@smoke"` and capture the error.
2. **Analyze** — reads `reports/artifacts/` (screenshot, trace, error), inspects the feature/step/Page Object, states the root cause.
3. **Apply fix (max 3 attempts)** — the Healer Agent applies a targeted fix and re-runs the scenario each time; it stops the moment the test passes.
4. **Validate** — `npm run verify` + `npm run report:cucumber`, then an honest summary. If still failing after 3 attempts, it asks you for help.

### 7.3 `jira-import` — reflect coverage/results in Jira

**Example kick-off:**

> Import the ZincBank login scenarios into Jira.

**Steps:**

1. Ensure the source data exists: `npx cucumber-js` + `npm run report:cucumber`.
2. **Mandatory dry-run:** `npm run jira:import:dry-run` — confirm what would be imported and that no duplicates exist.
3. **Import:** the Jira Import Agent creates/updates issues, de-duplicating by summary and preserving feature, steps, expected results, tags, priority.
4. **Report:** list created issue keys and skipped existing issues. No fabricated keys, no duplicates.

### 7.4 `jira-status-update` — sync Jira statuses from the latest run

**Example kick-off:**

> Update Jira statuses from the latest ZincBank test run.

**Steps:**

1. Ensure a fresh report: `npx cucumber-js` + `npm run report:cucumber` (only the latest report is trusted).
2. **Map & update:** the Jira Status Agent reads the JSON report, identifies passed/failed/skipped scenarios, maps them to issues by summary, and transitions statuses via `npm run jira:status -- <KEY> <STATUS>`.
3. Reports which issues were updated and which were left unchanged. **Never marks a test PASS when the latest result is FAIL.**

---

## 8. Rules & guardrails

The `.clinerules/` folder defines what every agent must (and must not) do. Highlights:

**Agent rules**

- Be truthful — never claim a test passed unless it actually ran and passed.
- Healer Agent: max **3** healing attempts, then ask the user.
- Jira Import Agent: search for duplicates before creating; never create duplicates.
- Jira Status Agent: never mark a test PASS when the latest result is FAIL.
- Planner Agent: inspect the live app before proposing scenarios; produce a plan, not code.
- Git agents: never commit secrets, never push without approval, never commit blindly.

**Approval rules — the agent will ask before:**

- Creating, modifying, or deleting files outside the task scope; deleting files/directories.
- Committing, pushing, or opening a PR.
- Creating Jira issues or changing Jira statuses (dry-run first).
- Disabling/skipping/deleting tests, or running destructive git commands.

**Security rules**

- Credentials only in git-ignored `.env` or CI secrets — never in code, features, logs, or prompts.
- Run `npm run verify:secrets` before committing; never commit `.env`.

**Engineering rules**

- Locator order: role → label → placeholder → text → `data-test` → stable CSS → XPath (last resort).
- No arbitrary `waitForTimeout`; use Playwright auto-waiting and assertions.
- Step definitions are thin; logic lives in Page Objects.
- No hardcoded URLs/credentials — always via `config`.
- Run `npm run verify` before finishing any task.

---

## 9. Troubleshooting & FAQ

### "The planner says it can't find elements on ZincBank"

Make sure you gave the planner the correct URL and that the site is reachable. It inspects the **live** page — if the app requires a session or a specific entry point, mention it in the prompt (e.g. _"you must be signed out first"_).

### "The generated test fails immediately / the app never loads"

Check the environment:

```bash
grep -E "ENV|BASE_URL|USERNAME|PASSWORD" .env
npx cucumber-js --dry-run   # do all steps resolve?
```

The most common cause is a wrong `BASE_URL` or empty credentials.

### "The healer used all 3 attempts and the test still fails"

That is by design — it escalates to you. Provide new information the agent didn't have: updated UI copy, a fresh screenshot from `reports/artifacts/`, or a changed requirement. Do **not** ask it to disable or skip the test.

### "Two step definitions match the same Gherkin line"

Cucumber fails on ambiguity. Ask the agent (or fix yourself) to consolidate overlapping steps into one parameterized step — e.g. a single `When I sign in with email "<email>" and password "<password>"` instead of several near-duplicate variants.

### "`getByTestId` can't find an element"

This framework registers `data-test` as the test-id attribute (because apps like Saucedemo/ZincBank use `data-test`, not `data-testid`). Use `data-test` attributes or switch to role/label locators.

### "The agent wants to commit but there are generated reports in the diff"

Reports (`reports/`, `allure-results/`, `screenshots/`, `videos/`, `traces/`) are git-ignored. If they appear in `git status`, the ignore rule isn't applied — run `npm run verify:secrets` and review the diff before staging anything.

### "I don't have Jira credentials configured"

The Jira agents will refuse to proceed. Add `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT` to `.env` (or CI secrets) and always start with `npm run jira:import:dry-run`.

### "Can the agents run against production?"

The environment rules allow `ENV=prod`, but switching environments with real credentials or pointing tests at `prod` requires your explicit approval. For ZincBank, prefer `ENV=qa` with `BASE_URL=https://zincbank.cydeo.io`.

### "How do I get a trace/screenshot for a failing ZincBank scenario?"

The framework captures them automatically on failure into `reports/artifacts/` (`<scenario>.png`, `<scenario>.zip` trace, `error-message.txt`, `console-errors.txt`) and attaches them to the Allure report. Run `npm run report:allure` to browse them.

---

_This guide is generated from the toolchain shipped in `.cline/`. When in doubt, ask an agent to follow its own skill: e.g. "Use the reporting skill to summarize the latest run."_
