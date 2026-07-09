---
name: dev
description: "Thin default dispatcher for the two primary software-development scenarios: delivering a new requirement and fixing a bug. Use automatically when the user asks to discuss, design, implement, test, accept, debug, investigate, or repair software. For new requirements, clarify through conversation, agree on a solution, implement, test, and complete acceptance. For bugs, reproduce and inspect the problem, identify the root cause, propose a fix, implement the smallest safe repair, add regression coverage, and verify acceptance. Load focused references only when their trigger conditions apply."
---

# Dev

## Purpose

Use one default Skill as a thin dispatcher for the user's real development loop:

1. **New requirement**: discuss and confirm the requirement, agree on a solution, implement it, test it, and complete acceptance.
2. **Bug fix**: inspect and reproduce the problem, identify the root cause, agree on the repair, implement it, add regression coverage, and complete acceptance.

Keep the process conversational and proportional. The plan supports delivery; it is not a separate product unless the user asks for a durable design or plan document.

When an active long-running loop exists, use `dev` for the current bounded increment: one fix, experiment, implementation slice, verification pass, or documentation update. Do not take ownership of the whole long-running loop inside `dev`; update the loop state and leave the next action clear.

This Skill integrates:

- **Superpowers Lite** for clarification, lightweight design, test-first changes, systematic debugging, review gates, and evidence-based completion.
- **Frontend Design** for intentional UI direction, complete states, accessibility, responsiveness, and performance.
- **Full-stack guidance** for APIs, data, storage, cache, queues, migrations, observability, and reliability.
- **Database engineering** for schema design, constraints, transactions, indexes, query plans, migrations, capacity, and production database safety.
- **Adversarial review** for stress-testing assumptions, designs, fixes, and completion claims before delivery.

Do not require worktrees, long specs, repository-wide audits, or subagent-per-task workflows by default. Do not treat every integrated reference as always-on context; load only the focused references that match the task.

## Automatic Trigger

Use this Skill automatically for ordinary software work in a repository, especially requests equivalent to:

- “我有一个新需求，先聊清楚方案再实现。”
- “实现这个功能并补测试、验收。”
- “这个页面/接口有问题，帮我定位并修复。”
- “先分析这个 Bug 的根因，不要直接猜着改。”

Do not make the user explicitly invoke `$dev`.

Do not use `dev` for non-software questions, tiny text rewrites outside a codebase, or one-off terminal facts that do not need a development workflow.

Use the matching adapter (`kimi-code`, `claude-code`, `codex-cli`, or `opencode`) only when the user explicitly asks another external agent to participate.

## Select A Track

At the start, classify the task:

- Choose **New Requirement Track** when the desired behavior does not exist yet or the user asks to extend/change product behavior.
- Choose **Bug Fix Track** when actual behavior differs from expected behavior, a test fails, an error occurs, or an existing flow regressed.
- If the work is part of a long-running non-requirement loop, identify the current bounded increment, its signal, and its gate from `loop/` before choosing the closest track.
- If unclear, ask one high-signal question: “这是新增行为，还是已有行为没有按预期工作？”

Do not run both tracks mechanically. Share only the common review, verification, and delivery gates.

For tiny mechanical edits, skip formal track ceremony and perform the smallest direct change plus an appropriate verification check.

## Track A: New Requirement

### 1. Discuss And Confirm

- Understand the user goal, main user flow, constraints, non-goals, and acceptance criteria.
- Inspect the relevant repository structure and existing conventions before proposing architecture.
- If an active `loop/` workspace exists, read `loop/LOOP.md`, `loop/STATE.md`, `loop/ROADMAP.md`, `loop/CONTEXT.md`, and `loop/loop-run-log.md` before planning.
- Ask the minimum questions needed to remove material ambiguity, preferably one at a time.
- Restate the confirmed requirement in plain language before implementation.

### 2. Propose And Agree On A Solution

- For non-trivial work, compare 2-3 realistic approaches, including the simplest viable option.
- Recommend one approach with tradeoffs, risks, affected modules, data/API impact, and verification strategy.
- Adversarially test the recommended approach: name what would make it fail, what assumption is weakest, and which evidence or test will catch that failure.
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
- If using `loop/`, update `STATE.md`, `ROADMAP.md`, and `loop-run-log.md` with material implementation progress, verification evidence, and next action. For long-running non-requirement loops, record the latest signal, whether the gate passed, and whether the loop should continue, stop, or pivot.
- State what passed, what was not verified, and whether the requirement is accepted.

## Track B: Bug Fix

### 1. Inspect And Reproduce

- Capture expected behavior, actual behavior, environment, inputs, frequency, and impact.
- If an active `loop/` workspace exists, read `loop/LOOP.md`, `loop/STATE.md`, `loop/ROADMAP.md`, `loop/CONTEXT.md`, and `loop/loop-run-log.md` before debugging.
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
- Adversarially test the repair: identify how the bug could still reproduce, which adjacent path could regress, and which check would expose that failure.
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
- If using `loop/`, update `STATE.md`, `ROADMAP.md`, and `loop-run-log.md` with root cause, fix evidence, remaining risk, and next action. For long-running non-requirement loops, record the latest signal, whether the gate passed, and whether the loop should continue, stop, or pivot.
- State whether the Bug is accepted as fixed and identify any residual risk.

## Common Review Gate

Before claiming success on either track:

- Compare the diff to the agreed requirement or root-cause repair.
- Perform an adversarial pass: try to disprove the solution with edge inputs, missing permissions, stale state, concurrency, rollout order, rollback needs, and user-visible failure paths that apply.
- Check edge cases, error paths, permissions, compatibility, and project conventions.
- Keep the project maintainable as a consequence of the change: remove code this change made redundant, and update the docs, examples, contracts, and comments it invalidated. Scope this to what the change caused; do not widen into unrelated cleanup or refactors.
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

When the delivery must be a durable doc file rather than an in-chat response, use the template in `references/documentation.md`; its fields map to the sections above plus a Documentation Update field. The canonical field mapping and durable-vs-task-local context rules live in `../loop-engineering/references/context-model.md`.

## Reference Loading Policy

Start with this `SKILL.md`, classify the task, and load the smallest reference set that can materially improve the work. Do not read every reference just because `dev` triggered.

If a task touches multiple boundaries, load the references for the boundaries that actually change. If a reference has its own `When To Use` or `When To Load` section, follow that stricter condition too.

| Reference | Load when | Do not load when |
| --- | --- | --- |
| `references/superpowers-lite.md` | Behavior, architecture, API, data, deployment risk, ambiguity, TDD, root-cause debugging, careful review, or unverified completion. | Tiny copy edits, simple formatting, one-line config edits, or direct factual answers. |
| `references/design-and-research.md` | The task needs solution comparison, module or workflow design, diagrams, technical research, or a multi-step implementation plan. | The implementation path is obvious and local. |
| `references/frontend-quality.md` | Meaningful UI, frontend architecture, interaction states, visual polish, accessibility, responsiveness, or frontend performance changes. | Backend-only, CLI-only, docs-only, or non-visual changes. |
| `references/backend-architecture.md` | Service boundaries, APIs, storage choice, cache, queue, consistency, migrations, observability, reliability, security boundary, or production rollout risk. | Pure UI styling, small local helper changes, or database-only work that does not affect service architecture. |
| `references/database-engineering.md` | Schema design, relational modeling, constraints, indexes, query plans, transactions, locks, isolation, migrations, backfills, replication, partitioning, database capacity, or database incidents. | Non-persistent state, simple CRUD wiring without schema/query risk, or storage-agnostic business logic. |
| `references/stack.md` | Choosing language, framework, database, cache, queue, or integration technology. | The repository already has a clear standard and the task does not change it. |
| `references/documentation.md` | The user asks for docs, the task changes durable behavior or architecture, or delivery needs a reusable note. | Routine small edits where final response is enough. |
| `../loop-engineering/references/context-model.md` | A `loop/` workspace is active or being created, or you are deciding whether a fact, term, or decision belongs in `loop/` or at the repo level. | No loop workspace and no question about context placement. |

## Reference Guide

- Read `references/superpowers-lite.md` for stricter design, TDD, debugging, review, and verification discipline.
- Read `references/frontend-quality.md` for UI design, interaction states, accessibility, responsiveness, and frontend performance.
- Read `references/backend-architecture.md` for APIs, storage, cache, queue, consistency, migration, observability, and reliability.
- Read `references/database-engineering.md` for schema design, constraints, transactions, indexes, query plans, migrations, and production database safety.
- Read `references/design-and-research.md` for solution comparison, research, diagrams, and lightweight planning.
- Read `references/stack.md` for language, framework, database, cache, queue, and integration choices.
- Read `references/documentation.md` for documentation, review depth, verification, and acceptance reporting.
- Read `../loop-engineering/references/context-model.md` for the canonical context tiers, artifact roles, and promotion rules when a `loop/` workspace is active or context placement is unclear.
