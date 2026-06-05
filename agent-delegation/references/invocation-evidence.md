# Invocation Evidence

## Purpose

Invocation evidence proves that the caller actually invoked the requested target agent instead of simulating or silently substituting it.

Use this reference whenever the user explicitly names an external agent, when the result will be used for review or implementation decisions, or when the caller needs to resume a delegated task later.

## Minimum Evidence

Capture the smallest useful evidence record:

```json
{
  "delegation_id": "2026-06-04T120000Z-kimi-review-auth",
  "target_agent": "kimi-code",
  "adapter": "$kimi-code",
  "mode": "review-only",
  "working_directory": "/path/to/repo",
  "invoked": true,
  "command_available": true,
  "auth_available": true,
  "exit_code": 0,
  "raw_output_path": ".agent-delegation/results/2026-06-04T120000Z-kimi-review-auth/output.txt",
  "started_at": "2026-06-04T12:00:00Z",
  "finished_at": "2026-06-04T12:03:00Z",
  "caller_review_required": true
}
```

Do not include credentials, tokens, API keys, full secret-bearing environment variables, or unredacted private command arguments.

## Status Values

Use these status values consistently:

| Status | Meaning |
| --- | --- |
| `success` | Target agent was invoked and returned usable output. |
| `target_unavailable` | Adapter, CLI, tool, or API was not available. |
| `auth_required` | Target exists but authentication is missing or invalid. |
| `permission_blocked` | Policy, sandbox, filesystem, or approval constraints blocked invocation. |
| `execution_failed` | Target process returned non-zero or failed during execution. |
| `timeout` | Invocation exceeded the caller's allowed time. |
| `invalid_output` | Target returned output that cannot satisfy the requested contract. |
| `cancelled` | User or caller cancelled the delegation. |

## Evidence Workflow

1. Generate a stable delegation ID before invoking the target.
2. Record the target agent, adapter, mode, working directory, and allowed scope.
3. Check whether the target command or tool is available.
4. Invoke the target or record the exact reason invocation was impossible.
5. Save the raw target output before interpreting it.
6. Parse structured fields only after raw output is preserved.
7. Deliver target findings separately from caller review.

## Suggested Local Layout

For tasks that need persistence, use this lightweight layout inside the working repository:

```text
.agent-delegation/
  results/
    <delegation-id>/
      task.md
      evidence.json
      output.txt
      caller-review.md
```

Do not require this layout for tiny one-shot questions unless the user or project policy requires an auditable record.
