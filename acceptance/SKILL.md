---
name: acceptance
description: "Independent acceptance and adversarial verification review after implementation. Use when the user explicitly invokes $acceptance, asks for final acceptance, wants a separate verification pass after $dev, needs go/no-go judgment, or wants implementation evidence checked against clarified requirements, tests, risks, rollout, rollback, docs, and unresolved gaps."
---

# Acceptance

Use this Skill to independently verify whether completed implementation work is acceptable. The output is an evidence-based acceptance decision, not more implementation.

## Boundaries

- Stay in review and verification mode by default.
- Do not modify code, docs, migrations, or tests unless the user explicitly asks for fixes.
- Do not replace `dev`'s internal lightweight acceptance gate; use this as a separate top-level pass when stronger separation is useful.
- If the work is not ready, return a clear rejection or risk-qualified acceptance and recommend the next `$dev` step.
- Prefer repository evidence over claims: diff, tests, logs, screenshots, commands, CI, docs, and migration or rollout notes.

## Independence Level

Read `references/independence.md` when the task requires a stronger separation between implementation and acceptance. Report the requested and achieved level; do not call a review independent unless the separation mechanism is real.

## Repository Context

Inspect the closest available evidence before asking the user:

- The clarified requirement, issue, PR description, task note, or conversation summary.
- Current diff, touched files, tests, docs, migrations, configuration, and generated artifacts.
- Existing acceptance criteria, `CONTEXT.md`, `CONTEXT-MAP.md`, or ADRs when relevant.
- Test output, CI status, manual verification notes, screenshots, logs, or reproduction evidence.

If the acceptance target or expected behavior is unclear and cannot be inferred from local evidence, ask one concise question before judging.

## Acceptance Workflow

1. State the acceptance target in 2-4 bullets:
   - Intended behavior or fix.
   - Claimed implementation scope.
   - Acceptance criteria or inferred criteria.
   - Important risks or unknowns.
2. State the requested and achieved independence level.
3. Compare implementation to the target:
   - Review the diff against the requirement or root cause.
   - Check that behavior, edge cases, errors, permissions, data, API, UI, docs, migrations, and rollout notes are covered where relevant.
   - Confirm unrelated changes are not mixed into the acceptance surface.
4. Run an adversarial review:
   - Try to disprove acceptance with realistic failure cases: edge inputs, missing permissions, stale state, concurrency, data volume, migration order, rollback, dependency failure, and user-visible recovery paths when applicable.
   - Identify the weakest assumption and whether current evidence actually covers it.
5. Verify evidence:
   - Prefer commands that were already run, then run targeted checks when needed and safe.
   - Confirm tests prove behavior, not only syntax or compilation.
   - Treat skipped, flaky, missing, or stale checks as residual risk.
6. Review verifier quality when the conclusion depends on a metric, benchmark, rubric, or judge: name its version, owner, and important blind spots.
7. Decide:
   - `accepted`: criteria are met and verification evidence is adequate.
   - `accepted with risk`: criteria appear met but named residual risks remain.
   - `rejected`: criteria are not met, evidence is insufficient for a critical area, or a blocking regression exists.
8. Report the result with file, test, and risk references.

## Review Focus

Check the smallest applicable set:

- Requirement fit: implemented behavior matches the clarified goal and non-goals.
- Regression risk: important adjacent flows, compatibility, permissions, and error paths still hold.
- Test quality: there is a check that would fail if the accepted behavior regressed.
- Verifier quality: the verifier represents the intended target and its limitations are explicit.
- Data and migration safety: schema, backfill, rollback, idempotency, and observability are accounted for when relevant.
- UI acceptance: loading, empty, error, success, focus, responsive, and visual states are covered for meaningful UI changes.
- Documentation: user-facing docs, examples, changelog, ADR, checkpoint, or runbook notes are updated when the change makes them stale.

## Output Format

Use this compact structure:

```text
Acceptance target:
Independence requested:
Independence achieved:
Evidence reviewed:
Verifier assessment:
Decision: accepted | accepted with risk | rejected
Findings:
Verification:
Understanding preserved:
Residual risk:
Next step:
```

For rejected work, put blocking findings first and recommend the smallest `$dev` follow-up. For accepted work, keep the summary short and name the strongest evidence.
