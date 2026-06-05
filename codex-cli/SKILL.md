---
name: codex-cli
description: "Dispatch Codex CLI as an external coding, research, review, or terminal automation agent from another coding agent. Use when asking Codex CLI to investigate a repository, compare approaches, inspect failures, review a diff, implement a scoped change, or when handling Codex CLI installation, authentication, non-interactive codex exec mode, sandboxing, approvals, sessions, structured output, configuration, or troubleshooting. Use especially when the user explicitly names Codex CLI; the caller must invoke the target, must not simulate its output, and must report unavailability instead of silently falling back."
---

# Codex CLI

Use Codex CLI as an external terminal agent. Codex can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow the shared `$agent-delegation` contract whenever this Skill is used for external-agent delegation.

### Must Use When

- The user explicitly asks to use Codex CLI, including common wording such as “use Codex CLI”, “ask Codex CLI”, or the matching Skill name.
- An authorized project delegation policy selects Codex CLI.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Codex CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Codex CLI; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Codex CLI might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Output Contract

Ask Codex CLI to return, when supported: `task_summary`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## First Steps

1. Run the bundled `scripts/codex-cli-status.sh` from this Skill directory in a new environment.
2. If `codex` is missing, explain the official installation options instead of installing without user approval.
3. If authentication is missing, ask the user to complete Codex login. Never ask for or print credentials.
4. Run from the intended repository directory so `AGENTS.md`, configuration, and project Skills are discovered.

## Dispatch Decision

Dispatch Codex for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Produce newline-delimited JSON events or schema-constrained output for automation.

Keep work in the calling agent when the task is tiny, requires sensitive credentials, depends on UI-only state, or needs direct control over approvals.

## Invocation

Use `codex exec` for bounded, non-interactive tasks:

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --json \
  "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Do not edit files. Return evidence, assumptions, and unresolved risks."
```

Use workspace write access only for implementation:

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox workspace-write \
  --json \
  "Mode: implement. Fix the auth token expiry bug. Stay within src/auth and tests/auth unless evidence requires otherwise. Run the relevant tests. Return changed files, commands run, evidence, and remaining risks."
```

Use schema-constrained final output for downstream automation:

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --output-schema ./review-schema.json \
  --output-last-message ./codex-review.json \
  "Review the current diff and return findings that match the provided schema."
```

## Delegation Pattern

1. State the working directory, objective, and mode: `research-only`, `propose-only`, `review-only`, or `implement`.
2. State boundaries: files or directories in scope, whether edits are allowed, and whether tests may run.
3. Request a concise result: changed files, commands run, evidence, assumptions, and unresolved risks.
4. Use `--sandbox read-only` for research and review; use `workspace-write` only when implementation requires edits.
5. Keep prompts bounded; avoid broad “fix everything” tasks.
6. Inspect the diff and run verification after Codex completes.
7. Treat Codex output as advisory until local files and tests confirm it.

## Approval And Sandbox Safety

- Prefer sandboxed execution and the narrowest permissions that fit the task.
- Use `--ask-for-approval never` only for non-interactive automation where prompts cannot be answered and the sandbox is sufficient.
- Do not use `--dangerously-bypass-approvals-and-sandbox` or `--yolo` by default.
- Do not expose Codex execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, or other credential material.

## Recursion And Delegation Limits

- Do not recursively dispatch Codex CLI without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.

## Troubleshooting

- Run `codex --version` to confirm the executable is on `PATH`.
- Run `codex login status` to inspect authentication status without printing credentials.
- Use `codex --help` and `codex exec --help` for current flags because the CLI evolves over time.
- Read `references/codex-cli-reference.md` for install, authentication, exec mode, sandbox, output, and session notes.
