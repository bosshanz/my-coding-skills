# Independent QA Handoff

Use this reference only after `dev` has completed its implementer self-check. It defines a bounded handoff to an independent `$qa` pass; it does not turn QA into another developer test phase or grant permission for product edits, merge, deploy, or acceptance.

## Resolve The Policy

Read an explicit task or durable project `qa_policy` when one exists. Otherwise use `risk`.

- `off`: never start QA automatically. Report whether an independent pass is recommended.
- `risk`: start QA only when the completed change encodes money, permission, lifecycle, quota, or a multi-step user job whose business meaning is clear.
- `always`: start QA after every non-trivial product-behavior change. Tiny mechanical edits, docs-only changes, test-only changes, and pure refactors already protected by unchanged behavior evidence remain ineligible.

Never override an explicit `off`. An automatic pass is limited to read-only `Diagnosis` unless the user separately authorized QA `Contract` or `Coverage` work.

## Eligibility Gate

Start the handoff only when all are true:

- Implementer self-check is `passed`; `completed`, compilation success, or a partially run suite is not enough.
- The handoff names the real `user_job`, the `business_invariant` that must stay true, and a bounded `qa_scope`.
- The checked change has a stable `revision`: prefer a commit SHA; otherwise record an explicit worktree snapshot or diff fingerprint. For a non-Git artifact, use its stable version or content identity.
- Evidence, skipped checks, verifier limits, and residual risks are recorded. No material unknown makes an independent business pass misleading.
- The selected policy admits the change and an independent sub-agent or task-handoff mechanism is available.

If any condition fails, do not launch a ceremonial QA pass. Report `qa_handoff: skipped` and use this deterministic fallback:

- Self-check not passed, missing revision, or non-empty `critical_unverified` -> remain in `dev`; record the missing prerequisite and do not emit a completion claim.
- Unclear user job or business invariant -> `$clarify`.
- Eligible and ready, but no independent task mechanism -> recommend an explicit `$qa` pass.
- `qa_policy: off`, an ineligible change, or a duplicate handoff with a recorded result -> `stop`.

## Handoff Contract

Emit the semantic equivalent of this record. The transport may be tool arguments, structured text, or an internal event; preserve the fields and meaning rather than the serialization:

```yaml
event: dev.self_check.completed
handoff_version: qa-handoff-v1
task_id: <stable task identity>
revision: <commit, snapshot, or content identity>
qa_policy: off | risk | always
qa_policy_version: qa-policy-v1
trigger_reason: <why this change is eligible>
risk_tags:
  - money | permission | lifecycle | quota | multi_step_user_job
user_job: <what the user is trying to accomplish>
business_invariant: <what must remain true>
qa_scope: <one bounded journey or business slice>
changed_scope:
  - <affected file, module, API, or behavior>
self_check:
  status: passed
  evidence:
    - <command or functional check and result>
  skipped:
    - <check and reason>
  critical_unverified: []
  verifier_limits:
    - <what the evidence cannot prove>
  residual_risks:
    - <known remaining risk>
idempotency_key: <task_id + revision + qa_policy_version>
qa_attempt: 1
```

Do not call the event `passed`; the event says the self-check was recorded, while `self_check.status` carries its result.

## Launch Independently

- Start a new independent sub-agent or task for `$qa`; do not continue as QA in the implementer's context.
- Give QA the handoff record and repository access, but not a desired verdict. QA must inspect the closest business and user evidence itself.
- The automatic pass is `Diagnosis`: read-only, scoped to the named user job, and unable to change product code, tests, verifier rules, schema, merge state, or deployment state.
- Wait for the independent result when the environment supports it, then report DEV evidence and QA evidence separately. If the host can queue an independent task but cannot wait synchronously, report `qa_handoff: queued` with its task reference and do not invent a QA result.
- If no independent mechanism exists, recommend `$qa` and stop at the DEV result. Do not relabel a self-review as QA.

## Outcomes And Stop Rules

The automatic QA pass returns exactly one handoff outcome:

- `no_material_issue_found`: no material issue was found in the named scope. This is not an acceptance verdict.
- `needs_dev`: observed product behavior conflicts with the named user job or invariant.
- `human_gate`: the business rule, revision, environment, or evidence is insufficient for a responsible result.

Return the result to the caller. QA must not automatically invoke DEV, fix the product, start another QA pass, merge, deploy, or issue `accepted` / `rejected`. Pin `qa_policy_version` when the handoff is emitted; do not recompute eligibility while QA runs. One automatic QA attempt is allowed per `idempotency_key`; duplicate handoffs reuse the recorded result. A repair creates a new revision, but starting another pass still requires the caller's policy decision. This prevents `DEV -> QA -> DEV -> QA` loops from becoming implicit.
