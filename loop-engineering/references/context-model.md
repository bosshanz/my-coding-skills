# Context Model

## Purpose

Single canonical source for how context artifacts are organized across `clarify`, `dev`, `acceptance`, and `loop-engineering`. Defines the durability tiers, each artifact's role, who writes and reads it, and the promotion rules that move information between tiers. Other skills and references point here instead of restating this.

## Two Tiers

Context is layered by durability. Do not collapse the tiers into one file; the layering is what makes a loop resumable and auditable.

- **Tier 1 — Durable repo context**: outlives any single task or loop. Survives after the loop closes.
  - `CONTEXT.md` (nearest relevant root): durable domain glossary.
  - `docs/adr/*.md`: costly-to-reverse architectural decisions.
  - `docs/...`: durable delivery, architecture, and reference docs.
- **Tier 2 — Task-local loop context**: lives and dies with a `loop/` workspace, or gets promoted to Tier 1.
  - `loop/LOOP.md`: stable loop contract.
  - `loop/STATE.md`: current mutable state.
  - `loop/ROADMAP.md`: planned path.
  - `loop/CONTEXT.md`: task-local repository facts, terms, constraints, files, commands.
  - `loop/loop-run-log.md`: append-only chronological evidence log.

## Artifact Roles

- `loop/LOOP.md` (Tier 2, stable): target, scope, actors, feedback loops, gates, escalation. Written by `clarify`; read by `dev`, `acceptance`.
- `loop/STATE.md` (Tier 2, mutable): status, latest decisions, blockers, open questions, next action. Written by `clarify` and `dev`; read by all.
- `loop/ROADMAP.md` (Tier 2, plan): milestones, tasks, acceptance criteria, verification ladder. Written by `clarify` and `dev`; read by `dev`, `acceptance`.
- `loop/CONTEXT.md` (Tier 2, task-local facts): repository facts, task-local domain terms, constraints, relevant files, commands. Written by `clarify` and `dev`; read by all.
- `loop/loop-run-log.md` (Tier 2, append-only): actions, user answers, commands, evidence, decisions, handoffs. Appended by `clarify`, `dev`, `acceptance`.
- `CONTEXT.md` (Tier 1, durable glossary): durable domain terms that should outlive the current loop. Written by `clarify`; read by all.
- `docs/adr/*.md` (Tier 1, durable decisions): costly-to-reverse decisions with context, alternatives, and consequences. Written by `clarify`; read by all.
- `docs/...` (Tier 1, durable docs): delivery, architecture, and reference material. Written by `dev`; read by all.

## Promotion And Demotion Rules

Information flows from Tier 2 (task-local) to Tier 1 (durable) when it outlives the current loop. Promote; do not duplicate across tiers. When a fact belongs in both conceptually, pick one home based on durability and link from the other.

- **Domain term** discovered during a loop: if it outlives the loop, promote to repo `CONTEXT.md`; if it is task-local, keep in `loop/CONTEXT.md`. One home, not both. Do not fill `loop/CONTEXT.md`'s Domain Terms section with terms that belong in the repo glossary.
- **Decision** recorded in `loop/STATE.md`: if it is costly to reverse AND future readers would wonder why this path was chosen, promote to `docs/adr/`. Otherwise keep it in STATE. STATE is mutable working memory; an ADR is durable.
- **Completion evidence** in `loop/loop-run-log.md`: if the change is a durable behavior or architecture change, promote a concise summary to the nearest `docs/` delivery note. The log keeps the chronological evidence trail; the docs note keeps the durable reference. Do not copy the whole log into docs.
- **Repository fact** (file, command, constraint) in `loop/CONTEXT.md`: if it will matter outside this loop, promote to the relevant repo doc or `CONTEXT.md`; otherwise keep it task-local.

When a loop closes, do the durable promotions first, then archive or delete `loop/`. Tier 2 is disposable; Tier 1 is not.

## Delivery Templates

Two delivery surfaces share the same fields; pick by medium, not by preference.

- **In-chat delivery** (conversational, used by `dev`): 需求确认 / 方案与关键取舍 / 实现内容 / 测试与验收 / 风险与未验证项. For a bug fix, `dev` uses its bug-fix structure instead.
- **Durable doc** (file, used per `dev/references/documentation.md`): Goal / Solution / Implementation / Verification / Risk / Documentation Update.

Field mapping: 需求确认↔Goal, 方案与关键取舍↔Solution, 实现内容↔Implementation, 测试与验收↔Verification, 风险与未验证项↔Risk. The durable-doc template adds Documentation Update because a file must record what docs changed. Use the in-chat format for the response; use the durable-doc template only when writing a file that must outlive the conversation.

## Authority

This file is the single source for tiers, roles, and promotion rules. `clarify/references/loop-workspace.md` owns the workspace templates and creation mechanics; `loop-engineering` owns the loop contracts and methodology. Both defer here for artifact roles, tiers, and promotion rules. When another file disagrees with this one, this file wins; fix the other file.
