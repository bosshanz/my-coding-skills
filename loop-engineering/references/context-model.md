# Context Model

## Purpose

Single canonical source for how context artifacts are organized across `clarify`, `dev`, `acceptance`, and `loop-engineering`. Defines durability tiers, artifact roles, writers and readers, and promotion rules. Other skills and references point here instead of restating this.

## Two Tiers

Context is layered by durability. Do not collapse the tiers into one file; the layering is what makes a loop resumable, auditable, and understandable.

- **Tier 1 — Durable repo context**: outlives any single task or loop.
  - `CONTEXT.md` (nearest relevant root): durable domain glossary.
  - `docs/adr/*.md`: costly-to-reverse architectural decisions.
  - `docs/...`: durable delivery, architecture, evaluation, and reference docs.
- **Tier 2 — Task-local loop context**: lives and dies with `loop/` or `loops/<loop-id>/`, or gets promoted to Tier 1.
  - `LOOP.md`: stable loop contract and constitutional boundaries.
  - `STATE.md`: current mutable execution state.
  - `ROADMAP.md`: planned path, phase, and gates.
  - `CONTEXT.md`: task-local repository and evaluation facts.
  - `CHECKPOINT.md`: current understanding snapshot.
  - `loop-run-log.md`: append-only chronological evidence log.

## Artifact Roles

- `LOOP.md` (Tier 2, stable): identity, target, scope, actors, permissions, verifier ownership, feedback loops, gates, human authority, and escalation. Written by `clarify` or `loop-engineering`; read by `dev`, `acceptance`, and authorized external agents.
- `STATE.md` (Tier 2, mutable): status, current hypothesis, latest signal, verifier version, decisions, blockers, open questions, and next action. Written by `clarify` and `dev`; read by all.
- `ROADMAP.md` (Tier 2, plan): phase, milestones, discovery exit criteria, acceptance criteria, verification ladder, verifier governance, and checkpoints. Written by `clarify` and `dev`; read by `dev` and `acceptance`.
- `CONTEXT.md` (Tier 2, task-local facts): repository facts, task-local terms, constraints, relevant files, commands, datasets, fixtures, rubrics, and known evaluation gaps. Written by `clarify` and `dev`; read by all.
- `CHECKPOINT.md` (Tier 2, cognitive snapshot): current target, what changed, why, evidence, rejected alternatives, unverified areas, risks, verifier version, decision, next experiment, and rollback path. Written by `clarify`, `dev`, and `acceptance`; read by all.
- `loop-run-log.md` (Tier 2, append-only): actions, user answers, commands, evidence, verifier changes, decisions, overrides, and handoffs. Appended by `clarify`, `dev`, and `acceptance`.
- `CONTEXT.md` (Tier 1, durable glossary): durable domain terms that should outlive the current loop. Written by `clarify`; read by all.
- `docs/adr/*.md` (Tier 1, durable decisions): costly-to-reverse decisions with context, alternatives, and consequences. Written by `clarify`; read by all.
- `docs/...` (Tier 1, durable docs): delivery, architecture, evaluation, verifier, runbook, and reference material. Written by `dev` or the methodology owner; read by all.

## Understanding And Evidence

Evidence and understanding are related but not interchangeable.

- `loop-run-log.md` answers: what happened, in what order?
- `STATE.md` answers: where are we now?
- `CHECKPOINT.md` answers: why are we here, what do we believe, and what remains uncertain?

Do not force future readers to reconstruct the current rationale from a long chronological log.

## Promotion And Demotion Rules

Information flows from Tier 2 to Tier 1 when it outlives the current loop. Promote; do not duplicate across tiers. When information conceptually belongs in both, choose one canonical home based on durability and link from the other.

- **Domain term**: if it outlives the loop, promote to repo `CONTEXT.md`; if task-local, keep in loop `CONTEXT.md`.
- **Decision**: if costly to reverse and future readers would wonder why it was chosen, promote from `STATE.md` or `CHECKPOINT.md` to `docs/adr/`.
- **Completion evidence**: if it describes durable behavior or architecture, promote a concise result from `loop-run-log.md` to the nearest durable doc. Do not copy the entire log.
- **Understanding snapshot**: if the rationale, rejected alternatives, or verifier limitations will matter after the loop, promote a concise checkpoint summary to a delivery, architecture, evaluation, or runbook document.
- **Verifier definition**: if a metric, rubric, benchmark, dataset, threshold, or judge prompt will be reused, promote it to a durable evaluation document or executable test/evaluator. Record owner, version, known blind spots, and review cadence.
- **Repository fact**: if it matters outside this loop, promote it to the relevant repo doc or durable `CONTEXT.md`.

When a loop closes, perform durable promotions first, then archive or delete the Tier 2 workspace. Tier 2 is disposable; Tier 1 is not.

## Multi-Loop Rules

Use `loop/` for one active local task. Prefer `loops/<loop-id>/` when loops are concurrent, independently scheduled, or expected to persist.

Each named loop should have a stable ID, owner, status, and version. Do not share one mutable `STATE.md` across unrelated loops.

## Delivery Templates

Two delivery surfaces share the same fields; choose by medium.

- **In-chat delivery** used by `dev`: 需求确认 / 方案与关键取舍 / 实现内容 / 测试与验收 / 风险与未验证项.
- **Durable doc** used per `dev/references/documentation.md`: Goal / Solution / Implementation / Verification / Risk / Documentation Update.

The durable doc should include verifier version or evaluation context when the conclusion depends on a reusable evaluator.

## Authority

This file is the canonical source for tiers, roles, and promotion rules. `clarify/references/loop-workspace.md` owns workspace templates and creation mechanics; `loop-engineering` owns loop contracts and methodology. When another file disagrees with this one, this file wins; fix the other file.
