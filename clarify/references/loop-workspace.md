# Loop Workspace

Use this reference only after the user agrees to create a loop workspace or directly asks for one.

## Location

Create the workspace at `loop/` under the repository root or nearest affected project root:

```text
loop/
  LOOP.md
  STATE.md
  ROADMAP.md
  CONTEXT.md
  loop-run-log.md
```

Do not overwrite an unrelated active `loop/`. If `loop/` exists, inspect `loop/LOOP.md` and `loop/STATE.md` first. Reuse it only when it matches the current work; otherwise ask whether to reuse it, archive it, or create a separate loop directory.

## File Roles

File roles, the durable-vs-task-local tiers, and the promotion rules between them are defined canonically in `../../loop-engineering/references/context-model.md`. Read it when deciding what belongs in `loop/` versus the repo level. The templates below hold the concrete scaffolds for creating each file.

## Creation Rules

Create all five files together. Keep placeholders short and useful; do not fill with invented facts. Use `Unknown` or `To clarify` when evidence is missing.

Immediately append one entry to `loop-run-log.md` after creation. Include timestamp if available from the environment, otherwise use the current conversation date.

## Templates

### LOOP.md

```markdown
# Loop

## Target

What this loop is trying to deliver or decide.

## Scope

- In:
- Out:

## Actors

- User:
- Clarify:
- Dev:
- Acceptance:
- External agents:

## Feedback Loops

| Loop | Trigger | Signal | Gate | Escalation |
| --- | --- | --- | --- | --- |
| Clarification | Open requirement or design decision | User answer, repo evidence | Behavior and constraints are clear | Ask next focused question |
| Implementation | Accepted plan | Diff, tests, logs | Targeted verification passes | Re-plan or debug |
| Acceptance | Claimed completion | Diff review, tests, manual evidence | accepted / accepted with risk / rejected | Return to Dev |

## Handoff Rules

- Clarify updates `STATE.md`, `ROADMAP.md`, `CONTEXT.md`, and `loop-run-log.md` before handing off.
- Dev reads the loop files before implementation and updates state/log after material changes.
- Acceptance reads the loop files before judging completion and appends the final decision.
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

## Milestones

- [ ] Clarify target behavior, constraints, and acceptance criteria.
- [ ] Agree on implementation approach.
- [ ] Implement the smallest complete slice.
- [ ] Verify with the agreed evidence.
- [ ] Run acceptance review.

## Acceptance Criteria

- To clarify.

## Verification Ladder

- Static:
- Unit or fixture:
- Integration:
- UI or runtime:
- Acceptance:
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
- Next: Continue clarification.
```

## Update Rules

During `clarify`:

- Update `STATE.md` after each material user answer or repository discovery.
- Update `ROADMAP.md` when acceptance criteria, milestones, or verification strategy become clearer.
- Update `loop/CONTEXT.md` with task-local repository facts, constraints, relevant files, and commands; promote durable domain terms to the repo-level `CONTEXT.md` per `../../loop-engineering/references/context-model.md`.
- Append `loop-run-log.md` entries for file creation, user decisions, important repo evidence, handoffs, and unresolved risks.

Before handing off to `$dev`, make sure `STATE.md` names the next action and `ROADMAP.md` contains enough acceptance criteria and verification strategy for implementation.
