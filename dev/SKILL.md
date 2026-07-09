---
name: dev
description: "Thin default dispatcher for delivering new requirements and fixing bugs. Use automatically for ordinary software work. For new requirements, clarify through conversation, agree on a solution, implement, test, and complete acceptance. For bugs, reproduce, identify the root cause, implement the smallest safe repair, add regression coverage, and verify acceptance. When an active loop workspace exists, execute only the current bounded increment and update state, evidence, and cognitive checkpoint."
---

# Dev

## Purpose

Use one default Skill as a thin dispatcher for real development work:

1. **New requirement**: confirm the behavior, agree on a solution, implement, test, and accept.
2. **Bug fix**: reproduce, identify the root cause, agree on the repair, implement the smallest safe change, add regression coverage, and accept.

Keep the process conversational and proportional. A plan supports delivery; it is not a separate product unless the user asks for a durable document.

When an active long-running loop exists, use `dev` only for the current bounded increment: one fix, experiment, implementation slice, verification pass, or documentation update. Do not silently take ownership of the whole loop. Update the shared state, evidence, checkpoint, and next action.

This Skill integrates lightweight design, TDD, systematic debugging, frontend quality, full-stack architecture, database engineering, adversarial review, and evidence-based completion. Load focused references only when the task needs them.

## Automatic Trigger

Use this Skill automatically for ordinary software work in a repository. Do not require the user to invoke `$dev`.

Do not use `dev` for non-software questions, tiny text rewrites outside a codebase, methodology design, or work that is still too ambiguous for delivery. Use `clarify` or a Discovery Loop when the target or verifier is not ready.

Use external-agent adapters only when the user explicitly asks another Agent to participate.

## Select A Track

At the start, classify the task:

- **New Requirement Track**: desired behavior does not exist yet or product behavior must change.
- **Bug Fix Track**: actual behavior differs from expected behavior, a test fails, or an existing flow regressed.
- **Bounded Loop Increment**: an active loop defines the current experiment, signal, verifier, and gate.

If unclear, ask one high-signal question. Do not run both tracks mechanically.

For tiny mechanical edits, perform the smallest direct change plus an appropriate verification check.

## Active Loop Integration

When `loop/` or `loops/<loop-id>/` is active, read before planning:

- `LOOP.md`
- `STATE.md`
- `ROADMAP.md`
- `CONTEXT.md`
- `CHECKPOINT.md`
- `loop-run-log.md`

Confirm:

- the current phase is ready for implementation rather than discovery;
- the bounded increment and gate are explicit;
- allowed and forbidden actions are respected;
- the verifier cannot be silently weakened by the implementation;
- the human-authority boundary is clear.

After material work:

- update `STATE.md` with the latest signal, verifier version, blocker, and next action;
- update `ROADMAP.md` when milestones or verification strategy change;
- update `CHECKPOINT.md` with what changed, why, evidence, rejected alternatives, unverified areas, risks, and rollback path;
- append factual commands, results, decisions, and handoffs to `loop-run-log.md`.

## Track A: New Requirement

### 1. Discuss And Confirm

- Understand the user goal, main flow, constraints, non-goals, and acceptance criteria.
- Inspect relevant repository structure and conventions before proposing architecture.
- Ask the minimum questions needed to remove material ambiguity.
- If the real problem or verifier remains unclear, return to `clarify` or Discovery Loop instead of guessing.
- Restate the confirmed requirement before implementation.

### 2. Propose And Agree On A Solution

- For non-trivial work, compare realistic approaches including the simplest viable option.
- Recommend one approach with tradeoffs, risks, affected modules, interface/data impact, and verification strategy.
- Adversarially test the recommendation: name the weakest assumption and evidence that would disprove it.
- For frontend work, define purpose, visual direction, interaction flow, responsiveness, and important states.
- For backend work, define boundaries, data flow, contracts, failures, migration, and observability as applicable.
- Do not implement while a material product or architecture decision remains unresolved.

### 3. Plan The Change

- Break work into small, reviewable steps.
- Name relevant files or modules when known.
- Define tests, verifier, and acceptance checks before editing.
- Prefer RED-GREEN-REFACTOR for behavior changes when supported.

### 4. Implement

- Follow existing project patterns before adding abstractions or dependencies.
- Implement the smallest complete slice that satisfies agreed criteria.
- Keep behavioral changes separate from unrelated cleanup.
- Cover user-visible states and failure paths, not only the happy path.
- Do not weaken tests, benchmarks, thresholds, or evaluator rules to make the work pass unless the verifier itself is explicitly under review.

### 5. Test And Accept

- Run targeted checks first, then broader checks justified by the changed boundary.
- Perform functional acceptance against each criterion.
- For UI changes, check interaction, responsive behavior, keyboard/focus behavior, and important visual states.
- Record what passed, what was not verified, verifier limitations, and whether the requirement is accepted.

## Track B: Bug Fix

### 1. Inspect And Reproduce

- Capture expected behavior, actual behavior, environment, inputs, frequency, and impact.
- Read the full error, stack trace, logs, failing test, or user evidence before editing.
- Reproduce the issue with the smallest reliable case when possible.
- If reproduction is unavailable, state the evidence gap and do not present a hypothesis as fact.

### 2. Locate The Root Cause

- Trace the failing path through callers, data, state, configuration, dependencies, and recent changes.
- Compare with nearby working paths and project patterns.
- Form one testable hypothesis at a time.
- Distinguish root cause, trigger, and visible symptom.
- After two failed guesses, stop editing and re-investigate assumptions or design.

### 3. Propose The Repair

- Explain the root cause and affected scope in plain language.
- Compare alternatives when compatibility, data, architecture, or rollout tradeoffs matter.
- Recommend the smallest safe fix that addresses the cause rather than hiding the symptom.
- Identify how the bug could still reproduce and which check would expose that failure.
- Define regression coverage before implementation.

### 4. Implement The Fix

- Add or identify a failing regression test first when practical.
- Make the minimum behavior change needed to fix the root cause.
- Avoid broad refactors unless necessary and agreed.
- Preserve compatibility, data integrity, and operational safety where relevant.

### 5. Verify The Fix

- Confirm the original reproduction no longer fails.
- Run the regression test and relevant nearby tests.
- Check likely side effects and adjacent flows.
- Run broader checks only when justified.
- State whether the bug is accepted as fixed and name residual risk.

## Common Review Gate

Before claiming success:

- Compare the diff to the agreed requirement, experiment, or root-cause repair.
- Try to disprove the solution with relevant edge inputs, stale state, concurrency, rollout order, rollback needs, and user-visible failures.
- Check compatibility, permissions, project conventions, and important failure paths.
- Confirm tests prove behavior, not merely syntax or compilation.
- Confirm the verifier still represents the real target and was not weakened to fit the implementation.
- Update docs, examples, contracts, and comments made stale by this change.
- Treat warnings, skipped checks, flaky output, stale evaluator data, and partial verification as residual risk.
- Never say “done” or “fixed” without naming the evidence or explaining why it could not run.

## Delivery Format

Deliver in Chinese by default.

For a new requirement:

- 需求确认
- 方案与关键取舍
- 实现内容
- 测试与验收
- 风险与未验证项

For a bug fix:

- 问题现象与复现
- 根因
- 修复方案
- 修改内容
- 回归测试与验收
- 风险与未验证项

When a loop workspace is active, also state the latest signal, verifier, gate result, checkpoint update, and next loop direction.

Keep code, commands, protocol names, and configuration keys in their original language.

## Reference Loading Policy

Load the smallest reference set that can materially improve the work.

| Reference | Load when |
| --- | --- |
| `references/superpowers-lite.md` | Behavior, architecture, ambiguity, TDD, root-cause debugging, careful review, or unverified completion. |
| `references/design-and-research.md` | Solution comparison, workflow design, diagrams, research, or a multi-step plan. |
| `references/frontend-quality.md` | Meaningful UI, interaction states, accessibility, responsiveness, visual quality, or frontend performance. |
| `references/backend-architecture.md` | Service boundaries, interfaces, storage, cache, queue, consistency, migrations, observability, reliability, or rollout risk. |
| `references/database-engineering.md` | Schema, constraints, indexes, transactions, query plans, migrations, backfills, replication, or capacity. |
| `references/stack.md` | Choosing language, framework, database, queue, cache, or integration technology. |
| `references/documentation.md` | Durable behavior, architecture, delivery notes, or reusable documentation. |
| `../loop-engineering/references/context-model.md` | A loop workspace is active or context placement is unclear. |
| `../loop-engineering/references/verifier-governance.md` | A reusable metric, benchmark, rubric, evaluator, or judge determines acceptance. |
| `../loop-engineering/references/checkpoint-artifact.md` | A long-running loop or complex change needs an understandable checkpoint. |
