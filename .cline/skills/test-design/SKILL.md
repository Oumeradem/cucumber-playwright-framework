---
name: test-design
description: Design robust, isolated BDD test scenarios - positive/negative/boundary coverage, meaningful tags, independent scenarios, and reusable steps.
---

# Test Design Skill

## Scenario design

- Cover happy-path, negative, boundary, and validation cases explicitly.
- One scenario tests one behavior; keep scenarios short and readable.
- Never create dependent scenarios — each must run in isolation and in any order.
- State preconditions in `Given`, actions in `When`, observable outcomes in `Then`.

## Tagging

| Tag           | Purpose                            |
| ------------- | ---------------------------------- |
| `@smoke`      | Critical happy paths, fast         |
| `@sanity`     | Broad sanity coverage after deploy |
| `@critical`   | High-priority flows                |
| `@regression` | Deep, slower coverage              |
| `@wip`        | In-progress, expected to change    |

## Reuse

- Prefer existing steps and Page Objects; search before adding new ones.
- Business-readable Gherkin over implementation detail.
