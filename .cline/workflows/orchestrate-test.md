---
name: orchestrate-test
description: Full end-to-end test-automation pipeline coordinated by the Orchestrator Agent - plan with the Planner Agent, generate with the Test Generator Agent, heal failures with the Healer Agent (max 3 attempts), then branch, commit, and push with the Git agents. Pauses for explicit user approval between every major stage.
mode: plan
agents:
  - orchestrator-agent
  - planner-agent
  - test-generator-agent
  - healer-agent
  - branch-agent
  - commit-agent
  - push-agent
  - pr-agent
---

# Orchestrate Test Workflow

Follow this workflow when the user wants a complete, end-to-end delivery: plan a requirement, generate the automated tests, heal any failures, and — only after explicit approval at each gate — branch, commit, and push the work.

This workflow is driven by the **Orchestrator Agent**. You coordinate; you do NOT perform the specialized steps yourself.

## Step 1 - Invoke the Orchestrator

Invoke the **Orchestrator Agent** (`.cline/agents/orchestrator/orchestrator-agent.md`) with the requirement.

It runs this pipeline:

```text
Planner Agent
   |
   v
[USER APPROVAL]
   |
   v
Test Generator Agent
   |
   +---- SUCCESS ----> [USER APPROVAL] ----+
   |                                        |
   +---- FAILED                             |
            |                              v
            v                     Branch Agent -> Commit Agent -> Push Agent
      Healer Agent (max 3)                    |               |            |
            |                                 v               v            v
            +---- SUCCESS ------> [USER APPROVAL]        [USER APPROVAL] [USER APPROVAL]
            +---- FAILED -> STOP + ask the user              END
```

## Step 2 - Orchestrator responsibilities

- Never skip the Planner or Test Generator stages.
- Always pause for explicit user approval between major stages.
- Route test failures to the Healer Agent (max 3 attempts) — never silently fix them yourself.
- Route Git operations to the Git agents — never branch, commit, or push directly.
- Validate every result against the latest run (honest PASS/FAIL only).
- Report the workflow state JSON after each stage and whenever the workflow is paused.

## Step 3 - Run & verify gates

Each agent uses the framework commands to validate its work:

```bash
npx cucumber-js --tags "<tag>"   # run the generated coverage
npm run verify                    # lint + format + typecheck
npm run report:cucumber           # fresh report for the summary
```

## Step 4 - Optional extensions

After the pipeline completes, and only if the user explicitly asks:

- `pr-agent` — draft/open a pull request for the pushed branch.
- `jira-import-agent` / `jira-status-agent` — reflect coverage or results in Jira.

## Rules

- Never advance to the next agent without the user's approval.
- Never perform a specialized agent's work yourself.
- Never commit, branch, or push without the appropriate Git agent.
- If the Healer fails after 3 attempts: STOP and ask the user.
