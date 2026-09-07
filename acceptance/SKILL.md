---
name: acceptance
description: "Review completed implementation when the user asks for final acceptance or a go/no-go verdict. Report reviewer separation, verification evidence, and approval authority separately."
when_to_use: "Use when the user explicitly invokes $acceptance, asks for final acceptance, wants a separate verification pass after $dev, needs go/no-go judgment, or wants implementation evidence checked against clarified requirements, tests, risks, rollout, rollback, docs, and unresolved gaps."
argument-hint: "[验收范围 | scope]"
---

# Acceptance

Judge completed implementation against the agreed criteria. Follow host instructions and the user's scope: review and verification do not authorize editing code, tests, or docs, spawning another agent, or publishing. Continue fixes only when already authorized. This is an explicitly requested pass, not a required stage after ordinary `dev` verification.

## Basis

Keep three facts distinct without requiring three report sections:

- **Reviewer separation:** same implementer, fresh context, separate agent/model, or human. State the actual separation and any requested separation not achieved; the Skill name does not establish independence.
- **Verification evidence:** what was checked, on which revision or conditions, and the coverage, freshness, and limits. Independent review and sufficient evidence do not imply one another.
- **Approval authority:** identify it when a release, merge, or business decision is in scope. Technical acceptance does not authorize that action; do not invent an approval gate for a review-only task.

If an independent reviewer is requested and delegation is authorized, use someone who did not implement the change. Provide the original goal, criteria, constraints, revision, and raw evidence; obtain an initial judgment before sharing other verdicts. Preserve needed context and disclose prior exposure. Resolve disagreements with a discriminating check, not a vote.

## Review

1. Establish the target from the request, current diff, relevant code/docs, existing criteria, and available test or runtime evidence. Ask one focused question only if a material criterion cannot be inferred. Separate unrelated changes from the acceptance scope.
2. Compare the implementation with the intended behavior. Challenge the weakest assumption using realistic counterexamples: edge inputs, permissions, stale state, concurrency, migration order, dependency failure, or recovery, as relevant. Meaningful UI work needs interaction and state evidence; a screenshot alone cannot prove it.
3. Reuse current, relevant evidence and complete required checks. Add targeted verification when evidence is stale, incomplete, contradicted, or affected by changes. Tests should be able to expose the wrong behavior. For repairs, compare the original symptom under corresponding before/after conditions; passing compilation does not establish a root cause.
4. For material findings, state the trigger, expected versus observed result, impact, and checkable evidence. Separate suspected from confirmed defects and identify what could overturn a disputed judgment. A review may find no defects; do not manufacture defects to sound adversarial.
5. Judge evidence gaps by their impact. Skipped, flaky, or missing checks are not passes. If a metric, benchmark, or judge drives the verdict, check its relevant version and blind spots. Existing QA notes can help but are not a prerequisite; missing business evidence does not authorize a new QA pass.

## Verdict

- `accepted`: criteria are met with adequate evidence.
- `accepted with risk`: no blocking criterion or required check is outstanding, but named nonblocking risks remain.
- `rejected`: a criterion fails, critical evidence or a required check is missing, or a blocking regression exists.

Lead with the verdict in concise Chinese by default, then the strongest evidence and material findings or gaps. State reviewer separation honestly and approval status only where applicable; no fixed report template is required. Put blocking findings first and identify the smallest remedy or missing prerequisite. If a workflow instruction truly blocks review, cite its exact file and rule. Do not turn the conclusion into an unrequested workflow or permission request.
