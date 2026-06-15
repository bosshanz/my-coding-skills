# Delegation Output Contract

## Purpose

Keep delegated work auditable by separating target-agent output from caller-agent review and final delivery.

## Requested Target-Agent Result

Ask the target agent to return these fields when its output mode supports them:

```json
{
  "task_summary": "What the target agent handled",
  "findings": [],
  "suggested_changes": [],
  "risks": [],
  "confidence": "low | medium | high",
  "files_referenced": [],
  "commands_run": [],
  "verification_needed": []
}
```

Do not fabricate missing fields. If the target returns text or invalid structured output, preserve the raw result and state that parsing was incomplete.

## Delegation Record

Record enough information to prove what happened:

- Target agent and adapter.
- Delegation mode: `research-only`, `propose-only`, `review-only`, or `implement`.
- Working directory and scope.
- Whether edits and tests were allowed.
- Invocation status and exit status when available.
- Raw target output or a path to it.
- Files changed or referenced.
- Commands run and verification requested.
- Failure reason, if any.

Never include credentials, tokens, API keys, or sensitive command arguments in the record.

## Caller Delivery Format

Use distinct sections in the final response:

```md
## Delegated Agent Result

- Target agent: ...
- Invocation status: ...
- Target findings: ...

## Caller Review

- Confirmed findings: ...
- Disagreements or corrections: ...
- Additional risks: ...
- Verification performed: ...

## Final Recommendation

- ...
```

The caller must clearly label any conclusion that was not produced by the target agent.

## Delegation Evidence Envelope

When a task needs an auditable record, wrap the target output in an evidence envelope:

```json
{
  "delegation_id": "2026-06-04T120000Z-kimi-review-auth",
  "target_agent": "kimi-code",
  "adapter": "$kimi-code",
  "status": "success",
  "mode": "review-only",
  "working_directory": "/path/to/repo",
  "scope": ["src/auth", "tests/auth"],
  "edits_allowed": false,
  "tests_allowed": false,
  "exit_code": 0,
  "raw_output_path": ".agent-delegation/results/2026-06-04T120000Z-kimi-review-auth/output.txt",
  "parsed_output": null,
  "caller_review_required": true,
  "error": null
}
```

The envelope records invocation facts; it must not invent target-agent findings. If parsing fails, keep `parsed_output` null and preserve `raw_output_path`.
