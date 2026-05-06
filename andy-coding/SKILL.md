---
name: andy-coding
description: Use when handling Andy's software work across Python, Node, Go, and web systems, especially for feature delivery, bug fixes, refactors, frontend UI or interaction design, backend technical research, architecture decisions, or middleware integration involving MySQL, PostgreSQL, Redis, or RocketMQ. Trigger when the task should start with planning and solution design, continue through implementation and verification, and end with concise documentation updates.
---

# Andy Coding

## Overview

Drive a personal full-stack delivery workflow that begins with planning, continues with implementation, and ends with verification and concise documentation. Favor clear technical judgment, practical execution, and short but complete delivery notes.

## Workflow

Follow this order unless the user explicitly asks for something narrower:

1. Clarify the task.
   - Restate the goal, constraints, and expected output.
   - Surface missing assumptions early.
2. Plan before coding.
   - Give a compact plan.
   - For non-trivial work, compare 2-3 approaches and recommend one.
   - Call out risks, dependencies, and validation strategy.
   - For trivial edits such as copy updates, single-line config fixes, or narrowly scoped mechanical changes, use a lightweight plan instead of a full design.
3. Design or research as needed.
   - For frontend work, cover layout, visual hierarchy, states, and interaction flow.
   - For backend work, cover boundaries, data flow, storage, middleware, and failure modes.
   - When producing architecture or process design, include diagrams instead of text-only descriptions.
4. Execute with the user's stack in mind.
   - Prefer maintainable, idiomatic changes over novelty.
   - Follow existing project conventions before introducing new patterns.
5. Verify before claiming success.
   - Run targeted tests first, then broader checks when justified, then state a plain-language acceptance conclusion.
   - Confirm behavior, not only syntax or type health.
6. Deliver clearly.
   - Use a stable delivery structure: goal, solution, implementation, verification, risk, documentation update.
   - Summarize what changed, how it was verified, and any residual risk.
7. Update documentation.
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
- Do not skip planning, verification, or documentation unless the user explicitly narrows the task.
- Prefer updating an existing canonical document before creating a new one.

## Trigger Examples

Typical requests that should trigger this skill:

- "先出方案，再实现这个后台功能。"
- "设计一个用户中心模块，包含接口、数据表和交互流程。"
- "调研 Redis 和 RocketMQ 的组合方案，并给出推荐。"
- "实现一个 Python / Node / Go 的 Web 功能，并补齐验证和文档。"
- "为一个现有系统做架构梳理，要求给中文方案和图。"

## Anti-Patterns

Do not do the following unless the user explicitly asks for a reduced process:

- Write code first and explain the plan later.
- Give a final recommendation without alternatives or tradeoffs for non-trivial tasks.
- Deliver architecture or process design as pure text when a diagram is warranted.
- Claim something is verified without naming the checks or tests that were run.
- Scatter documentation into ad hoc new files when an existing canonical document can be updated.
- Produce English-heavy plans or design notes when Chinese was expected by default.

## Reference Guide

- Read `references/stack.md` when choosing language, framework, database, cache, queue, or integration approach.
- Read `references/design-and-research.md` when the task needs frontend design, UI, interaction design, backend research, or architecture framing.
- Read `references/documentation.md` when deciding what to record before delivery or immediately after completion.
