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
- If the work is not ready, return a clear rejection or risk-qualified acceptance and name the concrete evidence gap. Recommend `$dev` when product behavior is wrong and `$clarify` when the target is still unclear. Name `$qa` only when the user explicitly requests a separate business or real-usage protection pass.
- Prefer repository evidence over claims: diff, tests, logs, screenshots, commands, CI, docs, and migration or rollout notes.

## Independence Level

Use the smallest sufficient review level, and report both the requested and achieved level:

- L0: same-agent self-check.
- L1: fresh-context review.
- L2: independent Agent or model review.
- L3: deterministic external verification.
- L4: human or domain-owner approval.

Do not call a review independent unless the separation mechanism is real and stated.

## Repository Context

Inspect the closest available evidence before asking the user:

- The clarified requirement, issue, PR description, task note, or conversation summary.
- Current diff, touched files, tests, docs, migrations, configuration, and generated artifacts.
- Existing acceptance criteria, `CONTEXT.md`, `CONTEXT-MAP.md`, or ADRs when relevant.
- Test output, CI status, manual verification notes, screenshots, logs, or reproduction evidence.
- QA notes, when they already exist; they are evidence, not a prerequisite for acceptance.

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
   - Treat only-mechanical tests on a material user journey as residual risk or a reason to reject. Judge the missing evidence directly; do not require a prior or follow-up `$qa` stage based on provenance alone.
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
- Test quality: there is a check that would fail if the accepted behavior or user-visible business meaning regressed.
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

For rejected work, put blocking findings first and recommend the smallest follow-up. Use `$dev` for product defects, `$clarify` for an unclear target, and `$qa` only for an explicitly requested independent business or real-usage pass. For accepted work, keep the summary short and name the strongest evidence.
