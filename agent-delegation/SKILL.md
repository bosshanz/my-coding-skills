---
name: agent-delegation
description: "Use when a user asks one coding agent to delegate work to another external agent such as Kimi Code, Claude Code CLI, or Codex CLI, or when a task needs explicit agent routing, auditable delegation, structured external-agent results, no-silent-fallback behavior, or caller-side review and verification."
---

# Agent Delegation

Use external coding agents through explicit, auditable delegation. The caller coordinates the task; the target agent performs the delegated work; the caller then reviews, integrates, verifies, and delivers the result.

## Non-Negotiable Rules

- If the user explicitly names a target agent, invoke that target agent.
- Do not replace the requested target agent with the caller's own analysis.
- Never simulate, impersonate, or fabricate a target agent's output.
- If the target agent cannot be invoked, report the failure clearly.
- Do not silently fall back to another agent.
- Keep delegation depth to one hop unless the user explicitly requests multi-agent orchestration.
- The caller remains responsible for scope, review, integration, verification, and final delivery.

## Delegation Workflow

1. Resolve the target agent from the user's request or an authorized project policy.
2. Confirm that the matching adapter and target CLI, tool, or API are available.
3. Build a bounded delegation task with objective, mode, working directory, scope, permissions, and expected output.
4. Invoke the target through its adapter; do not merely describe what the target might say.
5. Capture invocation status, target output, evidence, and unresolved risks.
6. Review the target result against local files, requirements, and project conventions.
7. Run appropriate verification before accepting implementation or review findings.
8. Deliver the target result, caller review, and final recommendation as distinct sections.

## Adapter Selection

Use the matching adapter:

- `$kimi-code` for Kimi Code CLI.
- `$claude-code` for Claude Code CLI.
- `$codex-cli` for Codex CLI.

Do not autonomously delegate only because another agent may be helpful. Task-based routing requires user authorization or a project delegation policy.

## Same-Agent Delegation

- Do not recursively dispatch the same target agent without an explicit user request.
- If the user explicitly requests a separate instance of the current host agent, invoke it only when the environment can distinguish the child process and prevent recursive delegation.
- Include a delegation identifier or explicit no-further-delegation instruction when same-agent delegation is allowed.

## Failure Behavior

Treat these as explicit delegation failures, not invitations to fabricate a result:

- Target adapter, CLI, tool, or API is unavailable.
- Authentication is missing or invalid.
- The target cannot access the required repository, files, or context.
- The invocation exits unsuccessfully, times out, or returns unusable output.
- Security, privacy, permission, or project policy prevents the call.

Report the failure, explain what was and was not executed, and ask before choosing another target.

## References

- Read `references/routing-policy.md` to resolve target selection and fallback behavior.
- Read `references/output-contract.md` to structure target output, caller review, and final delivery.
- Read `references/safety-policy.md` for permissions, recursion, credentials, and failure handling.
