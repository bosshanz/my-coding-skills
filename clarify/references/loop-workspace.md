# Loop Workspace

Use this reference only after the user agrees to create a loop workspace or directly asks for one.

## Location

For one active task, create the workspace at `loop/` under the repository root or nearest affected project root:

```text
loop/
  LOOP.md
  STATE.md
  ROADMAP.md
  CONTEXT.md
  CHECKPOINT.md
  loop-run-log.md
```

For multiple concurrent or durable loops, prefer named directories:

```text
loops/
  <loop-id>/
    LOOP.md
    STATE.md
    ROADMAP.md
    CONTEXT.md
    CHECKPOINT.md
    loop-run-log.md
```

Do not overwrite an unrelated active workspace. Inspect `LOOP.md` and `STATE.md` first. Reuse it only when it matches the current work; otherwise ask whether to reuse it, archive it, or create a separate named loop directory.

## File Roles

File roles, durability tiers, and promotion rules are defined canonically in `../../loop-engineering/references/context-model.md`. The templates below provide concrete scaffolds.

## Creation Rules

Create all six files together. Keep placeholders short and useful; do not fill with invented facts. Use `Unknown` or `To clarify` when evidence is missing.

Immediately append one entry to `loop-run-log.md` after creation. Include timestamp if available from the environment, otherwise use the current conversation date.

## Templates

### LOOP.md

```markdown
# Loop

## Identity

- Loop ID:
- Version: 1
- Status: active
- Owner:
- Verifier owner:

## Type

discovery | delivery | debugging | evaluation | governance | learning | maintenance | methodology

## Target

What behavior, uncertainty, risk, or decision this loop controls.

## Scope

- In:
- Out:

## Trigger And Cadence

- Trigger:
- Cadence:

## Actors

- User / constitutional authority:
- Clarify:
- Dev:
- Acceptance:
- External agents:

## Permissions

- Allowed actions:
- Forbidden actions:
- Budget:
- Rollback boundary:

## Feedback Loops

| Loop | Trigger | Signal | Verifier | Gate | Escalation |
| --- | --- | --- | --- | --- | --- |
| Discovery / Clarification | Open uncertainty or design decision | User answer, repo evidence, prototype result | Human or agreed rubric | Enough evidence for the next decision | Ask next focused question or pivot |
| Implementation / Experiment | Accepted plan or hypothesis | Diff, tests, logs, benchmark | Tests, CI, evaluator, reviewer | Targeted gate passes | Re-plan, rollback, or debug |
| Acceptance | Claimed completion or checkpoint | Diff review, tests, manual evidence | Selected independence level | accepted / accepted with risk / rejected | Return to Dev or escalate |
| Verifier review | Scheduled review or suspicious result | Calibration set, false-pass examples, drift evidence | Verifier owner / domain owner | Verifier still represents the real target | Recalibrate or replace verifier |

## Human Authority

- Human-only decisions:
- Irreversible decisions:
- Non-negotiable constraints:
- Metrics that must not be optimized in isolation:
- Override policy:

## Long-Running Operation

- Trend signal:
- Continue criteria:
- Stop criteria:
- Pivot criteria:
- Checkpoint artifact: CHECKPOINT.md
- Verifier review cadence:

## Handoff Rules

- Clarify updates `STATE.md`, `ROADMAP.md`, `CONTEXT.md`, `CHECKPOINT.md`, and `loop-run-log.md` before handing off.
- Dev reads the loop files before implementation and updates state, evidence, and checkpoint after material changes.
- Acceptance reads the loop files before judging completion and records the selected independence level.
```

### STATE.md

```markdown
# State

## Status

clarifying

## Current Understanding

- Goal:
- Key constraints:
- Non-goals:
- Current hypothesis:
- Latest signal:
- Current verifier:
- Verifier version:

## Decisions

- None yet.

## Open Questions

- To clarify.

## Blockers

- None known.

## Next Action

- Continue `$clarify`.
```

### ROADMAP.md

```markdown
# Roadmap

## Phase

discovery | delivery | evaluation | governance

## Milestones

- [ ] Reduce material uncertainty or confirm target behavior.
- [ ] Agree on implementation or experiment approach.
- [ ] Implement the smallest complete slice.
- [ ] Verify with the agreed evidence.
- [ ] Run the selected acceptance level.
- [ ] Preserve a checkpoint and promote durable knowledge.

## Discovery Exit Criteria

- Facts, assumptions, constraints, and unknowns are separated.
- The next hypothesis or behavior is specific enough to act on.
- A meaningful verifier or human gate is defined.

## Acceptance Criteria

- To clarify.

## Verification Ladder

- Hard verification:
- Soft verification:
- Safety verification:
- Cost verification:
- Stop / end rules:
- Acceptance independence level:

## Verifier Governance

- Real target represented:
- Verifier owner:
- Isolation rule:
- Known blind spots:
- Calibration evidence:
- Review cadence:

## Long-Running Checkpoints

- Cadence:
- Continue / stop / pivot:
```

### CONTEXT.md

```markdown
# Context

## Repository Facts

- To inspect.

## Domain Terms

- To clarify.

## Relevant Files

- To inspect.

## Commands And Checks

- To discover.

## Constraints

- To clarify.

## Evaluation Context

- Metric or rubric:
- Dataset / fixtures / scenarios:
- Verifier version:
- Known gaps:
```

### CHECKPOINT.md

```markdown
# Checkpoint

## Current Target

## What Changed

## Why It Changed

## Evidence

## Rejected Alternatives

## Not Verified

## Current Risks

## Verifier Version

## Decision

continue | stop | pivot | ready for delivery | accepted | rejected

## Next Experiment Or Action

## Rollback Path
```

### loop-run-log.md

```markdown
# Loop Run Log

Append entries in chronological order. Keep this file factual and concise.

## Entries

### <timestamp> - Loop created

- Actor: Clarify
- Event: Created loop workspace.
- Evidence: User opted into loop tracking.
- Verifier: Not yet defined.
- Next: Continue discovery or clarification.
```

## Update Rules

During `clarify`:

- Update `STATE.md` after each material user answer or repository discovery.
- Update `ROADMAP.md` when phase, acceptance criteria, milestones, or verification strategy become clearer.
- Update `CONTEXT.md` with task-local repository and evaluation facts; promote durable domain terms per `../../loop-engineering/references/context-model.md`.
- Update `CHECKPOINT.md` when the target, evidence, rejected alternatives, verifier, or continue / stop / pivot decision materially changes.
- Append `loop-run-log.md` entries for creation, user decisions, important repo evidence, verifier changes, handoffs, overrides, and unresolved risks.

Before handing off to `$dev`, make sure:

- `STATE.md` names the next action.
- `ROADMAP.md` shows whether the work is still discovery or ready for delivery.
- The verification strategy can meaningfully fail.
- Human-only decisions and forbidden actions are explicit where relevant.
