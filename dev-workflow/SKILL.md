---
name: dev-workflow
description: "Default development workflow for ordinary software engineering tasks. Use automatically when the user asks to implement, fix, debug, refactor, test, review, document, design UI, research backend options, make architecture decisions, or work with Python, Node, Go, web systems, MySQL, PostgreSQL, Redis, or RocketMQ. Prefer this skill for normal coding requests even when the user does not explicitly name dev-workflow; use agent-delegation instead only when the user requests an external agent or auditable delegation."
---

# Dev Workflow

## Overview

Drive a lightweight full-stack development workflow that turns rough intent into shipped, verified work. Keep the process practical: clarify enough, design enough, implement with tests, review the result, and document only the durable decisions.

This skill intentionally keeps only the useful core of heavier agentic methodologies: collaborative design, explicit implementation plans, test-first behavior changes, systematic debugging, review gates, and evidence-based completion. Do not introduce mandatory worktrees, mandatory long spec files, or subagent-per-task workflows unless the user asks for them.

## Automatic Trigger Guidance

This is the default Skill for normal development work. Use it even when the user does not explicitly say `$dev-workflow` if the request is about implementation, bug fixing, debugging, refactoring, testing, code review, documentation, UI design, backend research, architecture, or middleware integration.

Do not require the user to name this Skill. Reserve `$agent-delegation`, `$kimi-code`, `$claude-code`, and `$codex-cli` for explicit external-agent delegation or auditable cross-agent review.

## Workflow

Follow this order unless the user explicitly asks for something narrower:

1. Clarify the task.
   - Restate the goal, constraints, and expected output.
   - Ask only the minimum necessary questions; prefer one high-signal question at a time.
   - If the request is too broad, decompose it into smaller deliverable slices before designing details.
2. Plan before coding.
   - Give a compact plan.
   - For non-trivial work, compare 2-3 approaches and recommend one.
   - Call out risks, dependencies, and validation strategy.
   - For trivial edits such as copy updates, single-line config fixes, or narrowly scoped mechanical changes, use a lightweight plan instead of a full design.
3. Design or research as needed.
   - For frontend work, cover layout, visual hierarchy, states, and interaction flow.
   - For backend work, cover boundaries, data flow, storage, middleware, and failure modes.
   - When producing architecture or process design, include diagrams instead of text-only descriptions.
4. Execute in small, reviewable steps.
   - Prefer maintainable, idiomatic changes over novelty.
   - Follow existing project conventions before introducing new patterns.
   - For behavior changes and bug fixes, prefer a RED-GREEN-REFACTOR loop: write or identify a failing test, implement the smallest fix, then clean up.
   - For tasks without a practical automated test path, state the reason and use the strongest available functional check.
5. Debug systematically when something fails.
   - Read errors and stack traces fully before changing code.
   - Reproduce the issue, inspect recent changes, compare with nearby working examples, and form a testable hypothesis before fixing.
   - Fix causes, not symptoms; after 2 failed guesses, stop and re-investigate the design or assumptions.
6. Review before claiming success.
   - Check the diff against the goal, edge cases, project conventions, test coverage, and documentation impact.
   - Treat warnings, flaky output, or partial verification as residual risk instead of success.
7. Verify before delivery.
   - Run targeted tests first, then broader checks when justified, then state a plain-language acceptance conclusion.
   - Confirm behavior, not only syntax or type health.
8. Deliver clearly and update documentation.
   - Use a stable delivery structure: goal, solution, implementation, verification, risk, documentation update.
   - Add or update a concise note before or after completion, depending on the task shape.
   - Present documents, plans, and solution writeups in Chinese unless the user explicitly requests another language.
   - Include simple diagrams in architecture and process design work, preferably using Mermaid for flows, boundaries, and dependencies.

## Operating Rules

- Prefer Python, Node, or Go according to the surrounding codebase and task fit.
- Default to web-oriented solutions and production-practical tradeoffs.
- Use design judgment, not only implementation judgment.
- Use research when requirements, libraries, APIs, architecture, or middleware behavior are uncertain.
- Keep documentation short, concrete, and easy to scan.
- Present plans, design notes, and delivery documents in Chinese by default.
- Keep code, commands, protocol names, and configuration keys in their original language; keep explanations, decisions, document text, and diagram titles in Chinese.
- Add lightweight diagrams to architecture and workflow descriptions instead of delivering text-only design notes.
- Prefer updating an existing canonical document before creating a new one.
- Prefer evidence over claims: name the checks run, summarize what they prove, and call out anything not verified.
- Keep the process lightweight: do not require worktrees, long specs, or separate agent orchestration unless the task complexity justifies it or the user asks.

## Trigger Examples

Typical requests that should trigger this skill:

- "先出方案，再实现这个后台功能。"
- "设计一个用户中心模块，包含接口、数据表和交互流程。"
- "调研 Redis 和 RocketMQ 的组合方案，并给出推荐。"
- "实现一个 Python / Node / Go 的 Web 功能，并补齐验证和文档。"
- "为一个现有系统做架构梳理，要求给中文方案和图。"
- "修这个 bug，先定位根因，不要盲改。"
- "按 TDD 做一个小功能。"

## Anti-Patterns

Do not do the following unless the user explicitly asks for a reduced process:

- Write code first and explain the plan later.
- Give a final recommendation without alternatives or tradeoffs for non-trivial tasks.
- Deliver architecture or process design as pure text when a diagram is warranted.
- Claim something is verified without naming the checks or tests that were run.
- Scatter documentation into ad hoc new files when an existing canonical document can be updated.
- Produce English-heavy plans or design notes when Chinese was expected by default.
- Patch symptoms before reproducing and understanding the root cause.
- Add heavyweight process artifacts that are larger than the actual task.

## Reference Guide

- Read `references/stack.md` when choosing language, framework, database, cache, queue, or integration approach.
- Read `references/design-and-research.md` when the task needs frontend design, UI, interaction design, backend research, architecture framing, or a lightweight implementation plan.
- Read `references/frontend-quality.md` when the task involves UI implementation, frontend architecture, accessibility, frontend performance, visual polish, dashboards, or interaction-heavy components.
- Read `references/backend-architecture.md` when the task involves service boundaries, storage, cache, queue, consistency, capacity, production migration, security boundaries, observability, or reliability risk.
- Read `references/documentation.md` when deciding what to record before delivery or immediately after completion, or when choosing verification and review depth.
