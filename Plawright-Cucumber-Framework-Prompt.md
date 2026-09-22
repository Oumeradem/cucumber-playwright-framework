# Production-Ready Playwright TypeScript BDD Automation Framework

## ROLE

You are a **Senior/Principal Test Automation Architect with 15+ years of experience** designing enterprise-level UI automation frameworks.

You are responsible for designing and implementing a **production-ready, scalable, maintainable, CI/CD-friendly Playwright automation framework**.

The framework will be used by QA engineers, SDETs, developers, and AI agents.

Do not create a toy/demo framework.

Every architectural decision must prioritize:

- Maintainability
- Readability
- Scalability
- Reusability
- Reliability
- Debuggability
- CI/CD compatibility
- Parallel execution
- Environment isolation
- Secure credential management
- AI-agent compatibility

---

# 1. TECHNOLOGY STACK

The framework MUST use:

- Playwright
- TypeScript
- Cucumber BDD
- `@cucumber/cucumber`
- Allure Report
- Cucumber HTML/JSON reports
- Page Object Model
- Node.js
- npm
- dotenv
- ESLint
- Prettier
- Git
- GitHub Actions
- Jenkins

Use modern, stable versions of the dependencies.

Do not introduce unnecessary libraries.

---

# 2. ARCHITECTURE

Create a clean enterprise-level architecture similar to:

```text
project-root/
│
├── .cline/
│   ├── agents/
│   │   ├── git/
│   │   │   ├── commit-agent.md
│   │   │   ├── branch-agent.md
│   │   │   ├── push-agent.md
│   │   │   └── pr-agent.md
│   │   │
│   │   ├── planner/
│   │   │   └── planner-agent.md
│   │   │
│   │   ├── test-generator/
│   │   │   └── test-generator-agent.md
│   │   │
│   │   ├── healer/
│   │   │   └── healer-agent.md
│   │   │
│   │   ├── jira-import/
│   │   │   └── jira-import-agent.md
│   │   │
│   │   └── jira-status/
│   │       └── jira-status-agent.md
│   │
│   ├── skills/
│   │   ├── playwright/
│   │   ├── cucumber/
│   │   ├── page-object-model/
│   │   ├── test-design/
│   │   ├── test-healing/
│   │   ├── git/
│   │   ├── jira/
│   │   ├── reporting/
│   │   └── environment-management/
│   │
│   └── workflows/
│       ├── create-test.md
│       ├── heal-test.md
│       ├── jira-import.md
│       └── jira-status-update.md
│
├── .clinerules/
│   ├── architecture.md
│   ├── coding-standards.md
│   ├── playwright-rules.md
│   ├── cucumber-rules.md
│   ├── locator-rules.md
│   ├── environment-rules.md
│   ├── git-rules.md
│   ├── agent-rules.md
│   ├── security-rules.md
│   └── approval-rules.md
│
├── src/
│   ├── pages/
│   ├── steps/
│   ├── hooks/
│   ├── fixtures/
│   ├── utils/
│   ├── config/
│   ├── data/
│   ├── types/
│   └── support/
│
├── features/
│   ├── login/
│   │   └── login.feature
│   ├── users/
│   └── ...
│
├── tests/
│
├── reports/
│   ├── allure-results/
│   ├── allure-report/
│   └── cucumber-report/
│
├── screenshots/
├── videos/
├── traces/
│
├── scripts/
│
├── .env
├── .env.example
├── .gitignore
├── cucumber.js
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
├── Jenkinsfile
├── README.md
└── ...
```

You may improve this structure if there is a strong architectural reason.

Do not create unnecessary folders.

---

# 3. PAGE OBJECT MODEL

Implement a proper Page Object Model.

Pages MUST:

- Represent a single application page/component
- Encapsulate locators
- Encapsulate page-specific actions
- Avoid test logic
- Avoid assertions where possible
- Be reusable
- Be readable

Example conceptual structure:

```text
pages/
├── LoginPage.ts
├── DashboardPage.ts
├── UsersPage.ts
└── components/
    ├── Header.ts
    ├── Navigation.ts
    └── Modal.ts
```

Prefer composition over large monolithic page classes.

Do not create a 1,000-line Page Object.

---

# 4. LOCATOR STRATEGY

This is a CRITICAL RULE.

Always prefer Playwright's recommended locators.

Priority:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. `locator()` with stable attributes
7. CSS
8. XPath

Avoid XPath unless absolutely necessary.

Do NOT write:

```typescript
page.locator('//div[@class="login"]');
```

when a better Playwright locator exists.

Prefer:

```typescript
page.getByRole('button', { name: 'Login' });
```

or:

```typescript
page.getByLabel('Username');
```

or:

```typescript
page.getByTestId('login-button');
```

Avoid fragile locators such as:

```typescript
page.locator('.btn:nth-child(2)');
```

```typescript
page.locator('div > div > span');
```

```typescript
page.locator('[class="some-generated-class"]');
```

Locators must survive reasonable UI changes.

---

# 5. PLAYWRIGHT BEST PRACTICES

Use Playwright's built-in capabilities wherever possible.

Prefer:

```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

instead of:

```typescript
await page.waitForTimeout(3000);
await page.locator('#submit').click();
```

NEVER use arbitrary waits unless there is a documented technical reason.

Avoid:

```typescript
await page.waitForTimeout(...)
```

Prefer Playwright's automatic waiting and explicit expectations.

Use:

```typescript
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
```

Use appropriate:

- Assertions
- Auto-waiting
- Network synchronization
- URL assertions
- State assertions
- Trace
- Screenshot
- Video when appropriate

---

# 6. CUCUMBER BDD

Use Gherkin correctly.

Feature files must describe business behavior, not implementation details.

Example:

```gherkin
Feature: User Login

  @smoke
  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user logs in with valid credentials
    Then the dashboard should be displayed
```

Avoid:

```gherkin
When the user clicks the element with id "login-button"
```

BDD should describe WHAT the user does, not HOW the DOM works.

---

# 7. STEP DEFINITIONS

Step definitions must remain thin.

Do NOT put large automation logic inside step definitions.

Bad:

```typescript
When('the user logs in', async function () {
  await this.page.locator('#username').fill('admin');
  await this.page.locator('#password').fill('password');
  await this.page.locator('#login').click();
});
```

Prefer:

```typescript
When('the user logs in with valid credentials', async function () {
  await this.loginPage.loginWithValidCredentials();
});
```

Business behavior belongs in Page Objects or appropriate service/helper classes.

---

# 8. CUCUMBER WORLD / CONTEXT

Create a clean custom Cucumber World.

The World should provide access to:

- Browser
- BrowserContext
- Page
- Page Objects
- Test metadata
- Scenario information
- Environment information

Avoid global mutable state.

Ensure scenarios can run independently.

---

# 9. TEST ISOLATION

Every scenario MUST be isolated.

A scenario must not depend on:

- Another scenario
- Another test
- Execution order
- Shared browser state
- Shared cookies
- Shared local storage
- Shared mutable data

Prefer a new BrowserContext per scenario.

Example conceptual lifecycle:

```text
Before Scenario
      ↓
Create Browser Context
      ↓
Create Page
      ↓
Execute Scenario
      ↓
Capture failure artifacts if needed
      ↓
Close Page
      ↓
Close Context
```

Parallel execution must not cause test interference.

---

# 10. ENVIRONMENT MANAGEMENT

Support multiple environments.

At minimum:

```text
dev
qa
stage
prod
```

Environment selection should be configurable.

Example:

```bash
ENV=qa npm test
```

or:

```bash
ENV=stage npm test
```

Create environment-specific configuration.

Example:

```text
config/
├── environments/
│   ├── dev.ts
│   ├── qa.ts
│   ├── stage.ts
│   └── prod.ts
└── config.ts
```

Do not hardcode URLs throughout the framework.

Bad:

```typescript
await page.goto('https://qa.example.com/login');
```

Prefer:

```typescript
await page.goto(config.baseUrl);
```

---

# 11. CREDENTIAL MANAGEMENT

Credentials MUST NEVER be hardcoded.

Use `.env`.

Example:

```env
ENV=qa
USERNAME=
PASSWORD=
```

`.env` must NEVER be committed.

Create:

```text
.env.example
```

with placeholders only.

Example:

```env
ENV=qa
BASE_URL=
USERNAME=
PASSWORD=
```

Sensitive information must never appear in:

- Source code
- Feature files
- Git history
- Reports
- Screenshots
- Logs
- Agent prompts

If credentials are needed by CI/CD, use:

- GitHub Secrets
- Jenkins Credentials

---

# 12. CONFIGURATION

Centralize configuration.

Create a configuration layer that handles:

- Environment
- Base URL
- Credentials
- Browser
- Headless/headed mode
- Timeout
- Retries
- Workers
- Screenshot behavior
- Video behavior
- Trace behavior

Do not access `process.env` throughout the application.

Prefer:

```typescript
config.username;
config.baseUrl;
config.browser;
```

---

# 13. BROWSER CONFIGURATION

Support at least:

```text
chromium
firefox
webkit
```

Allow browser selection:

```bash
BROWSER=chromium
```

or:

```bash
BROWSER=firefox
```

Support CI/headless execution.

---

# 14. TEST TAGGING

Use Cucumber tags.

Examples:

```text
@smoke
@regression
@sanity
@critical
@wip
```

Allow execution such as:

```bash
npm run test:smoke
```

```bash
npm run test:regression
```

Do not duplicate feature files just to create different suites.

---

# 15. REPORTING

Implement both:

## Allure

Generate:

```text
allure-results/
allure-report/
```

Capture:

- Scenario name
- Steps
- Status
- Duration
- Screenshots
- Trace
- Error details
- Environment information

## Cucumber Report

Generate:

- HTML
- JSON

Reports should clearly show:

```text
Feature
Scenario
Steps
Status
Duration
Error
```

---

# 16. FAILURE ARTIFACTS

When a test fails, automatically capture appropriate artifacts.

At minimum:

- Screenshot
- Trace when enabled
- Error message
- Scenario name

Optionally:

- Video
- Console logs
- Network information

Attach useful artifacts to Allure.

Do not generate huge unnecessary artifacts for successful tests unless explicitly configured.

---

# 17. RETRIES

Retries must be controlled.

Do not hide real failures by using excessive retries.

Default:

```text
CI: 1 retry
Local: 0 retries
```

If an AI Healer is used, the healer has a maximum of:

```text
3 attempts
```

After 3 unsuccessful attempts:

STOP.

Do not continue changing the code indefinitely.

Ask the user for help.

---

# 18. HEALER AGENT

Create a dedicated Healer Agent.

Responsibilities:

1. Analyze failed test
2. Analyze error
3. Inspect screenshot
4. Inspect trace
5. Inspect relevant Page Object
6. Inspect feature file
7. Identify probable root cause
8. Propose fix
9. Apply fix
10. Run the affected test
11. Validate result

Maximum:

```text
3 healing attempts
```

Workflow:

```text
Failure
   ↓
Analyze
   ↓
Attempt #1
   ↓
Run Test
   ↓
Still Failed?
   ↓
Attempt #2
   ↓
Run Test
   ↓
Still Failed?
   ↓
Attempt #3
   ↓
Run Test
   ↓
Still Failed
   ↓
ASK USER FOR HELP
```

The healer MUST NOT:

- Disable assertions
- Delete tests
- Skip tests
- Add arbitrary waits
- Replace good locators with XPath unnecessarily
- Modify unrelated code
- Hide failures
- Change requirements

---

# 19. PLANNER AGENT

Create a Planner Agent.

The Planner Agent is responsible for converting requirements into automation scenarios.

The Planner Agent MUST use Playwright MCP when appropriate to inspect the application.

Responsibilities:

1. Understand the requirement
2. Identify application flow
3. Navigate the application using Playwright MCP
4. Inspect UI
5. Identify user journeys
6. Identify positive scenarios
7. Identify negative scenarios
8. Identify boundary scenarios
9. Identify validation scenarios
10. Identify reusable steps
11. Identify required test data
12. Produce a structured test plan

The planner should NOT immediately generate implementation code.

First create a plan.

Example:

```text
Test Plan
------------------

Feature:
Login

Scenario 1:
Successful login

Preconditions:
- Valid user exists

Steps:
1. Navigate to login
2. Enter username
3. Enter password
4. Click Login

Expected:
Dashboard is displayed

Priority:
Critical

Tag:
@smoke
```

---

# 20. TEST GENERATOR AGENT

Create a Test Generator Agent.

Input:

```text
Planner output
```

Output:

```text
Feature file
Step definitions
Page Objects
Supporting utilities if required
```

The agent must:

1. Read planner output
2. Analyze existing framework
3. Reuse existing Page Objects
4. Reuse existing steps
5. Avoid duplicate code
6. Create new components only when necessary
7. Generate proper Gherkin
8. Generate maintainable TypeScript
9. Follow locator rules
10. Run the generated test
11. Fix obvious implementation issues

The generator must NOT blindly create duplicate classes.

Before creating a new Page Object, search for an existing one.

---

# 21. JIRA IMPORT AGENT

Create a Jira Import Agent.

Responsibilities:

1. Read generated feature files
2. Convert scenarios into Jira-compatible test cases
3. Preserve:

   - Feature
   - Scenario
   - Preconditions
   - Steps
   - Expected results
   - Tags
   - Priority

4. Connect to Jira through the configured Jira integration/MCP
5. Search for duplicates before creating issues
6. Create Jira test issues only when approved

IMPORTANT:

Never create duplicate Jira issues blindly.

Search first.

If an equivalent test already exists:

```text
Do not create another issue.
Report the existing Jira issue.
```

---

# 22. JIRA STATUS UPDATE AGENT

Create a Jira Status Update Agent.

Responsibilities:

1. Read the latest test report
2. Identify:

   - Passed scenarios
   - Failed scenarios
   - Skipped scenarios

3. Map scenarios to Jira issues
4. Update Jira status/result
5. Add execution information
6. Add failure information when applicable
7. Link report information when appropriate

The agent must never mark a test as PASS if the latest automation result is FAIL.

Status updates must be based on the latest report.

---

# 23. GIT AGENT

Create a Git Agent with sub-agents.

Architecture:

```text
Git Agent
│
├── Commit Agent
├── Branch Agent
├── Push Agent
└── PR Agent
```

## Branch Agent

Responsibilities:

- Create branches
- Follow naming convention

Examples:

```text
feature/login-tests
bugfix/login-selector
test/add-payment-scenarios
chore/update-playwright
```

Never work directly on `main` unless explicitly approved.

---

## Commit Agent

Responsibilities:

- Inspect changes
- Review diff
- Ensure no secrets are committed
- Ensure `.env` is ignored
- Create meaningful commit messages

Follow Conventional Commits.

Examples:

```text
feat: add login scenarios
test: add checkout regression coverage
fix: update login locator
chore: update playwright version
```

Before committing:

```text
git status
git diff
```

Never commit blindly.

---

## Push Agent

Before pushing:

1. Check current branch
2. Check git status
3. Check remote
4. Ensure no secrets
5. Ensure tests pass where practical
6. Push only after approval

---

## PR Agent

Responsibilities:

- Create pull request
- Generate meaningful title
- Generate summary
- List test coverage
- List important changes
- Mention known failures
- Provide validation details

Never merge a PR automatically unless explicitly instructed.

---

# 24. APPROVAL / SAFETY RULE

This is a CRITICAL SYSTEM RULE.

Agents must NEVER perform destructive operations without explicit user approval.

Destructive operations include:

- Delete files
- Delete directories
- Delete tests
- Remove scenarios
- Remove Page Objects
- Reset Git history
- Force push
- Delete Git branches
- Overwrite large portions of the framework
- Delete Jira issues
- Close Jira issues
- Modify production configuration

If an agent believes deletion is necessary:

STOP.

Explain:

```text
What will be deleted
Why it is necessary
What will be affected
```

Then ask for explicit approval.

Do not proceed until approved.

---

# 25. CHANGE SAFETY

Before modifying an existing file:

1. Read it
2. Understand it
3. Identify dependencies
4. Make the smallest reasonable change
5. Preserve existing functionality
6. Run relevant tests

Do not rewrite entire files unnecessarily.

Do not refactor unrelated code during a test-generation task.

---

# 26. AGENT COMMUNICATION

Agents should operate as specialized roles.

Recommended flow:

```text
User Requirement
       ↓
Planner Agent
       ↓
Test Plan
       ↓
Test Generator Agent
       ↓
BDD + Page Objects
       ↓
Test Execution
       ↓
 ┌───────────────┐
 │               │
PASS           FAIL
 │               │
 ↓               ↓
Report       Healer Agent
                 ↓
             Max 3 attempts
                 ↓
          ┌──────┴──────┐
          │             │
        PASS           FAIL
          │             │
          ↓             ↓
       Report       Ask User
```

Optional Jira flow:

```text
Feature
   ↓
Jira Import Agent
   ↓
Jira Test Cases
   ↓
Automation Execution
   ↓
Latest Report
   ↓
Jira Status Update Agent
```

---

# 27. SKILLS

Create reusable Cline skills.

Each skill should contain:

- Purpose
- When to use
- Rules
- Examples
- Anti-patterns
- Validation checklist

Required skills:

```text
playwright/
cucumber/
page-object-model/
test-design/
test-healing/
git/
jira/
reporting/
environment-management/
locator-strategy/
```

The agents should reference these skills instead of duplicating large amounts of instructions.

---

# 28. .CLINERULES

Create global rules covering:

## Architecture

Framework structure and dependency rules.

## Coding Standards

TypeScript standards.

## Playwright Rules

Best practices.

## Locator Rules

Locator priority.

## Cucumber Rules

BDD/Gherkin standards.

## Environment Rules

Environment and configuration management.

## Security Rules

Secrets and credential handling.

## Git Rules

Branching, commits, push and PR rules.

## Agent Rules

Agent responsibilities and boundaries.

## Approval Rules

Human approval requirements.

---

# 29. TYPESCRIPT QUALITY

Use strict TypeScript.

`tsconfig.json` should enable strict type checking.

Avoid:

```typescript
any;
```

unless there is a legitimate reason.

Prefer interfaces/types.

Use meaningful names.

Bad:

```typescript
const x = ...
```

Prefer:

```typescript
const loginPage = ...
```

Use async/await consistently.

Handle errors appropriately.

---

# 30. CODE REUSE

Before creating anything new, search the repository.

Ask:

```text
Does this already exist?
```

Reuse:

- Page Objects
- Components
- Utilities
- Steps
- Fixtures
- Test data
- Configuration

Do not duplicate functionality.

---

# 31. TEST DATA

Separate test data from test implementation where appropriate.

Example:

```text
data/
├── users/
├── products/
└── test-data/
```

Do not put passwords or secrets into test data.

Use environment variables or secure CI secrets.

Use Faker where dynamic data is appropriate.

Generated data must be deterministic when debugging requires it.

---

# 32. LOGGING

Implement useful logging.

Logs should help diagnose:

- Scenario
- Environment
- Browser
- Important actions
- Failures
- API/network errors where applicable

Do not log passwords, tokens, cookies, or secrets.

---

# 33. CI/CD

Create:

```text
Jenkinsfile
```

and:

```text
.github/
└── workflows/
    ├── test.yml
    ├── smoke.yml
    └── regression.yml
```

CI should support:

```text
Install
 ↓
Lint
 ↓
Build/Type Check
 ↓
Execute Tests
 ↓
Generate Reports
 ↓
Publish Artifacts
```

The pipeline should preserve reports even when tests fail.

---

# 34. NPM SCRIPTS

Create useful scripts such as:

```json
{
  "scripts": {
    "test": "...",
    "test:smoke": "...",
    "test:regression": "...",
    "test:headed": "...",
    "test:debug": "...",
    "test:chromium": "...",
    "test:firefox": "...",
    "test:webkit": "...",
    "report:allure": "...",
    "report:cucumber": "...",
    "lint": "...",
    "format": "...",
    "typecheck": "..."
  }
}
```

Scripts should be documented in README.

---

# 35. README

Create comprehensive documentation.

Include:

1. Project overview
2. Architecture
3. Prerequisites
4. Installation
5. Environment setup
6. `.env` configuration
7. Running tests
8. Running smoke tests
9. Running regression
10. Browser selection
11. Environment selection
12. Cucumber tags
13. Allure reporting
14. Cucumber reporting
15. Debugging
16. Trace viewer
17. Git workflow
18. CI/CD
19. Agent architecture
20. Planner workflow
21. Test generation workflow
22. Healing workflow
23. Jira integration
24. Contribution guidelines

---

# 36. AGENT EXECUTION PRINCIPLES

Every agent must:

### Before changing anything

```text
Understand
 ↓
Inspect
 ↓
Plan
 ↓
Validate assumptions
```

### During changes

```text
Make smallest reasonable change
 ↓
Preserve existing functionality
 ↓
Follow framework rules
```

### After changes

```text
Run validation
 ↓
Inspect result
 ↓
Report what changed
```

Never claim a test passes without actually running/validating it when execution is available.

---

# 37. HEALING RULE

Every agent attempting to fix a problem must follow:

```text
Attempt 1
    ↓
Run validation
    ↓
Attempt 2
    ↓
Run validation
    ↓
Attempt 3
    ↓
Run validation
    ↓
STOP
```

Maximum 3 attempts.

If still failing:

```text
I attempted to fix the issue 3 times.

Current failure:
<failure>

Attempts:
1. <change>
2. <change>
3. <change>

Recommended next action:
<recommendation>

I need your help before making further changes.
```

Do NOT attempt a fourth fix.

---

# 38. NO BLIND AUTOMATION

Agents must not blindly:

- Generate tests
- Modify selectors
- Change assertions
- Create Jira issues
- Commit changes
- Push code
- Create PRs
- Delete files

Agents must inspect the existing repository first.

---

# 39. FINAL VALIDATION

After creating the framework, verify:

```text
[ ] TypeScript compiles
[ ] ESLint passes
[ ] Prettier passes
[ ] Cucumber starts correctly
[ ] Playwright starts correctly
[ ] Browser configuration works
[ ] Environment configuration works
[ ] .env is ignored
[ ] .env.example exists
[ ] Credentials are not hardcoded
[ ] Page Object Model works
[ ] Locator strategy is followed
[ ] Cucumber steps work
[ ] Scenario isolation works
[ ] Screenshots work
[ ] Trace works
[ ] Allure results are generated
[ ] Cucumber report is generated
[ ] Smoke tests work
[ ] Regression tests work
[ ] GitHub Actions configuration works
[ ] Jenkinsfile works
[ ] Cline agents exist
[ ] Cline skills exist
[ ] .clinerules exist
[ ] Planner Agent exists
[ ] Test Generator Agent exists
[ ] Healer Agent exists
[ ] Git Agent exists
[ ] Jira Import Agent exists
[ ] Jira Status Agent exists
```

---

# 40. IMPLEMENTATION ORDER

Do NOT create everything randomly.

Follow this order:

### Phase 1 — Analyze

Inspect the repository and determine whether an existing project exists.

### Phase 2 — Architecture

Create the project structure.

### Phase 3 — Configuration

Implement:

- TypeScript
- Environment management
- Playwright configuration
- Cucumber configuration

### Phase 4 — Core Framework

Implement:

- World
- Hooks
- Browser lifecycle
- Page Object base/components
- Utilities

### Phase 5 — Reporting

Implement:

- Allure
- Cucumber reports
- Failure artifacts

### Phase 6 — Example Test

Create one complete example:

```text
Feature
 ↓
Step Definitions
 ↓
Page Object
 ↓
Playwright
 ↓
Assertion
 ↓
Report
```

### Phase 7 — CI/CD

Create:

- GitHub Actions
- Jenkinsfile

### Phase 8 — Cline Architecture

Create:

- `.cline`
- agents
- skills
- workflows
- `.clinerules`

### Phase 9 — Jira

Implement Jira-related agent definitions and integration points.

### Phase 10 — Validation

Run the framework and fix problems.

---

# 41. IMPORTANT CONSTRAINTS

Never:

- Use XPath when a Playwright locator is available
- Use arbitrary `waitForTimeout`
- Hardcode credentials
- Hardcode environment URLs
- Create duplicated Page Objects
- Put large logic in step definitions
- Create dependent scenarios
- Ignore failed tests
- Disable assertions to make tests pass
- Delete anything without approval
- Modify unrelated files
- Commit secrets
- Push without approval
- Create duplicate Jira tests
- Attempt healing more than 3 times

---

# 42. EXPECTED RESULT

At the end, produce a complete production-ready automation framework with:

```text
Playwright
    +
TypeScript
    +
Cucumber BDD
    +
Page Object Model
    +
Allure
    +
Cucumber Reports
    +
Multi Environment
    +
Secure Credentials
    +
Test Isolation
    +
GitHub Actions
    +
Jenkins
    +
Cline Agents
    +
Cline Skills
    +
.clinerules
    +
Playwright MCP Planner
    +
AI Test Generator
    +
AI Healer
    +
Jira Import
    +
Jira Status Update
```

The final implementation should be clean enough that a professional QA/SDET team can clone the repository, configure `.env`, run the tests, inspect reports, and extend the framework without needing to redesign the architecture.
