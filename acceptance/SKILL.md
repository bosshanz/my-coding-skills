---
name: acceptance
description: "Review completed implementation when the user asks for final acceptance or a go/no-go verdict. Report reviewer separation, verification evidence, and approval authority separately."
when_to_use: "Use when the user explicitly invokes $acceptance, asks for final acceptance, wants a separate verification pass after $dev, needs go/no-go judgment, or wants implementation evidence checked against clarified requirements, tests, risks, rollout, rollback, docs, and unresolved gaps."
argument-hint: "[验收范围 | scope]"
---

# Acceptance

Use this Skill to independently verify whether completed implementation work is acceptable. The output is an evidence-based acceptance decision, not more implementation.

## Boundaries

- Stay in review and verification mode by default.
- Do not modify code, docs, migrations, or tests unless the user explicitly asks for fixes.
- Do not replace `dev`'s internal lightweight acceptance gate; use this as a separate top-level pass when stronger separation is useful.
- If the work is not ready, return a clear rejection or risk-qualified acceptance and name the concrete evidence gap. Recommend `$dev` when product behavior is wrong and `$clarify` when the target is still unclear. Name `$qa` only when the user explicitly requests a separate business or real-usage protection pass.
- Prefer repository evidence over claims: diff, tests, logs, screenshots, commands, CI, docs, and migration or rollout notes.

Use the current, relevant evidence already available. Complete required checks, but rerun or broaden only when evidence is stale, incomplete, contradicted, or the user requests it. Verification thoroughness does not authorize new scope or a separate agent. If a workflow rule blocks the requested review, link its exact file and quote the instruction before asking for missing input.

## Review Basis

Report three separate facts, without ranking them on one scale:

- **Reviewer separation:** same implementer, fresh context, separate agent/model, or human reviewer. Name the actual separation and any requested separation that was not achieved. Do not claim independence from the Skill name alone.
- **Verification evidence:** commands, tests, manual observations, and their coverage/freshness/limits. Determinism does not imply independence; independent review does not imply sufficient coverage.
- **Approval authority:** who can authorize the relevant release, merge, or business decision, and whether that approval exists, is pending, or is not required for this review. A technical acceptance verdict is not permission to publish or a substitute for owner approval. Do not invent an approval gate for a review-only task.

Use existing evidence and authorized reviewers; these dimensions do not require spawning another agent or requesting human approval.

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
2. State reviewer separation, evidence quality, and applicable approval authority separately.
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
Reviewer separation:
Verification evidence:
Approval authority:
Verifier assessment:
Decision: accepted | accepted with risk | rejected
Findings:
Verification:
Understanding preserved:
Residual risk:
Next step:
```

For rejected work, put blocking findings first and recommend the smallest follow-up. Use `$dev` for product defects, `$clarify` for an unclear target, and `$qa` only for an explicitly requested independent business or real-usage pass. For accepted work, keep the summary short and name the strongest evidence.
