---
name: dev-workflow
description: "Default end-to-end workflow for the two primary software-development scenarios: delivering a new requirement and fixing a bug. Use automatically when the user asks to discuss, design, implement, test, accept, debug, investigate, or repair software. For new requirements, clarify through conversation, agree on a solution, implement, test, and complete acceptance. For bugs, reproduce and inspect the problem, identify the root cause, propose a fix, implement the smallest safe repair, add regression coverage, and verify acceptance. Includes Superpowers Lite, Frontend Design, and full-stack architecture guidance; no explicit skill name is required."
---

# Dev Workflow

## Purpose

Use one default Skill for the user's real development loop:

1. **New requirement**: discuss and confirm the requirement, agree on a solution, implement it, test it, and complete acceptance.
2. **Bug fix**: inspect and reproduce the problem, identify the root cause, agree on the repair, implement it, add regression coverage, and complete acceptance.

Keep the process conversational and proportional. The plan supports delivery; it is not a separate product unless the user asks for a durable design or plan document.

This Skill integrates:

- **Superpowers Lite** for clarification, lightweight design, test-first changes, systematic debugging, review gates, and evidence-based completion.
- **Frontend Design** for intentional UI direction, complete states, accessibility, responsiveness, and performance.
- **Full-stack guidance** for APIs, data, storage, cache, queues, migrations, observability, and reliability.

Do not require worktrees, long specs, repository-wide audits, or subagent-per-task workflows by default.

## Automatic Trigger

Use this Skill automatically for ordinary software work, especially requests equivalent to:

- “我有一个新需求，先聊清楚方案再实现。”
- “实现这个功能并补测试、验收。”
- “这个页面/接口有问题，帮我定位并修复。”
- “先分析这个 Bug 的根因，不要直接猜着改。”

Do not make the user explicitly invoke `$dev-workflow`.

Use `agent-delegation` and a matching adapter only when the user explicitly asks another external agent to participate.

## Select A Track

At the start, classify the task:

- Choose **New Requirement Track** when the desired behavior does not exist yet or the user asks to extend/change product behavior.
- Choose **Bug Fix Track** when actual behavior differs from expected behavior, a test fails, an error occurs, or an existing flow regressed.
- If unclear, ask one high-signal question: “这是新增行为，还是已有行为没有按预期工作？”

Do not run both tracks mechanically. Share only the common review, verification, and delivery gates.

## Track A: New Requirement

### 1. Discuss And Confirm

- Understand the user goal, main user flow, constraints, non-goals, and acceptance criteria.
- Inspect the relevant repository structure and existing conventions before proposing architecture.
- Ask the minimum questions needed to remove material ambiguity, preferably one at a time.
- Restate the confirmed requirement in plain language before implementation.

### 2. Propose And Agree On A Solution

- For non-trivial work, compare 2-3 realistic approaches, including the simplest viable option.
- Recommend one approach with tradeoffs, risks, affected modules, data/API impact, and verification strategy.
- For frontend work, define purpose, visual direction, interaction flow, responsive behavior, and loading/empty/error/success states.
- For backend work, define boundaries, data flow, schema/API/event contracts, failure behavior, migration, and observability as applicable.
- Use a small Mermaid diagram when it materially clarifies architecture or flow.
- Do not start implementation while a material product or architecture decision is still unresolved.

### 3. Plan The Change

- Break implementation into small, reviewable steps.
- Name relevant files/modules when known.
- Define tests and acceptance checks before editing.
- Prefer RED-GREEN-REFACTOR for behavior changes when the project supports it.

### 4. Implement

- Follow existing project patterns before introducing new abstractions or dependencies.
- Implement the smallest complete slice that satisfies the agreed acceptance criteria.
- Keep behavioral changes separate from unrelated cleanup.
- Cover user-visible states and error paths, not only the happy path.

### 5. Test And Accept

- Run targeted tests first, then broader checks justified by the changed boundary.
- Perform functional acceptance against each agreed criterion.
- For UI changes, check interaction, responsive behavior, keyboard/focus behavior, and important visual states.
- State what passed, what was not verified, and whether the requirement is accepted.

## Track B: Bug Fix

### 1. Inspect And Reproduce

- Capture expected behavior, actual behavior, environment, inputs, frequency, and impact.
- Read the full error, stack trace, logs, failing test, or user evidence before editing.
- Reproduce the issue with the smallest reliable case when possible.
- If reproduction is unavailable, state the evidence gap and avoid presenting a hypothesis as fact.

### 2. Locate The Root Cause

- Trace the failing path through callers, data, state, configuration, dependencies, and recent changes.
- Compare with nearby working paths and established project patterns.
- Form one testable hypothesis at a time and gather evidence for or against it.
- Distinguish root cause, trigger, and visible symptom.
- After two failed guesses, stop editing and re-investigate assumptions or design.

### 3. Propose The Repair

- Explain the root cause and affected scope in plain language.
- Compare alternatives when the repair has meaningful compatibility, data, security, or architecture tradeoffs.
- Recommend the smallest safe fix that addresses the cause rather than hiding the symptom.
- Define regression coverage and explicit acceptance checks before implementation.

### 4. Implement The Fix

- Add or identify a failing regression test first when practical.
- Make the minimum behavior change needed to fix the root cause.
- Avoid broad refactors unless they are necessary for correctness and explicitly included in the agreed solution.
- Preserve backward compatibility, data integrity, and operational safety where relevant.

### 5. Verify The Fix

- Confirm the original reproduction no longer fails.
- Run the regression test and relevant nearby tests.
- Check likely side effects and adjacent flows.
- Run broader build, type, lint, integration, migration, or performance checks only when justified.
- State whether the Bug is accepted as fixed and identify any residual risk.

## Common Review Gate

Before claiming success on either track:

- Compare the diff to the agreed requirement or root-cause repair.
- Check edge cases, error paths, permissions, compatibility, and project conventions.
- Confirm tests prove the behavior, not merely syntax or compilation.
- Review docs, migration, rollout, rollback, monitoring, and support impact when applicable.
- Treat warnings, skipped checks, flaky output, and partial verification as residual risk.
- Never say “done” or “fixed” without naming the verification performed or explaining why it could not run.

## Delivery Format

Deliver in Chinese by default using the applicable structure.

For a new requirement:

- 需求确认
- 方案与关键取舍
- 实现内容
- 测试与验收
- 风险与未验证项

For a Bug fix:

- 问题现象与复现
- 根因
- 修复方案
- 修改内容
- 回归测试与验收
- 风险与未验证项

Keep code, commands, protocol names, and configuration keys in their original language.

## Reference Guide

- Read `references/superpowers-lite.md` for stricter design, TDD, debugging, review, and verification discipline.
- Read `references/frontend-quality.md` for UI design, interaction states, accessibility, responsiveness, and frontend performance.
- Read `references/backend-architecture.md` for APIs, storage, cache, queue, consistency, migration, observability, and reliability.
- Read `references/design-and-research.md` for solution comparison, research, diagrams, and lightweight planning.
- Read `references/stack.md` for language, framework, database, cache, queue, and integration choices.
- Read `references/documentation.md` for documentation, review depth, verification, and acceptance reporting.
