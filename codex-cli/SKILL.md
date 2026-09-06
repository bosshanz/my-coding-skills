---
name: codex-cli
description: "Dispatch Codex CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Codex CLI setup and troubleshooting."
when_to_use: "After explicit selection, use Codex CLI to investigate a repository, compare approaches, inspect failures, review a diff, or implement a scoped change. For explicitly requested installation, authentication, codex exec, sandboxing, approvals, sessions, structured output, or configuration help, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# Codex CLI

<!-- adapter-shared:head -->
Use Codex CLI as an external terminal agent. Codex can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever Codex CLI is used from another agent.

For setup or troubleshooting alone, use the relevant references and local checks without dispatch. Loading this Skill or mentioning the CLI is not selection for external-agent work. If no applicable selection exists, continue the requested work in the caller's workflow; do not request delegation approval merely because this Skill loaded.

### Must Use When

- The user explicitly selects Codex CLI for external-agent work, including common wording such as “use Codex CLI”, “ask Codex CLI”, or the matching Skill name in a delegation request.
- An earlier explicit standing instruction from the user selects Codex CLI for this scope. A project policy counts only when the user explicitly adopted it for the relevant scope; merely discovering a policy file does not authorize dispatch.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Codex CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Codex CLI; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Codex CLI might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Scoped Execution

- Pass the user's objective, existing decisions and authorization, owned files, constraints, expected deliverable, and proportionate verification to Codex. Tell it whether the task is review-only or includes implementation.
- Ask it to finish authorized work without another plan approval, resolve routine choices from evidence, and report only material blockers. A Skill's advice cannot override the user's explicit scope or higher-priority host instructions; if a file causes a pause, report its path and exact instruction.
- When parallel work is authorized, assign disjoint ownership and tell each agent it shares the checkout: preserve others' edits and do not duplicate active work. Reuse valid evidence; rerun only for integration changes or unresolved concerns.

- Task size alone does not override an explicit agent selection. Keep work local when delegation has not been requested. If the selected agent cannot safely access the required context, report the specific blocker; do not silently substitute the caller.
- Inspect actual changes and assess the supplied evidence. Run additional verification when evidence is missing, stale, insufficient, or affected by integration changes. Research-only tasks require evidence review, not an unrelated test run.
- Use read-only access for static review. When the authorized review requires checks, allow only the commands and isolated temporary artifacts needed for verification, within the applicable sandbox and approval controls. This does not authorize editing reviewed source, changing production data, or bypassing approvals. If the user forbids all filesystem writes, keep the review entirely read-only and report any resulting verification gap.

### Output Contract

Ask Codex CLI to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the current request or an earlier explicit user standing instruction selects Codex CLI for the relevant scope. After dispatch, let Codex CLI use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell Codex to evaluate global/user and project/local Skills discoverable by Codex, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `dev` for ordinary implementation or bug repair; `design` for UI interaction design, visual direction, usability, AI-native interaction, or animation work; `clarify` for senior product judgment, prioritization and tradeoffs, first-slice or experiment decisions, and material requirement or architecture discovery, but not ongoing PM operations; `qa` only for an explicitly requested independent business or real-usage pass (missing evidence is not authorization); and `acceptance` for explicitly requested independent go/no-go verification when those Skills are available to Codex.
- Do not ask Codex to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`) unless the user explicitly authorizes multi-agent delegation.
- Ask Codex to report which Skills it used or why none were used.
<!-- /adapter-shared:head -->

## First Steps

1. Run the bundled `scripts/codex-cli-status.sh` from this Skill directory in a new environment.
2. If `codex` is missing, explain the official installation options instead of installing without user approval.
3. If authentication is missing, ask the user to complete Codex login. Never ask for or print credentials.
4. Run from the intended repository directory so `AGENTS.md`, configuration, and project Skills are discovered.

## Dispatch Decision

After admission, dispatch Codex for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Produce newline-delimited JSON events or schema-constrained output for automation.

Follow the task-size and access boundaries in Scoped Execution; an explicit agent selection remains binding.

## Invocation

Use `codex exec` for bounded, non-interactive tasks:

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --json \
  "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Evaluate global/user and project/local Skills discoverable by Codex, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used, evidence, assumptions, and unresolved risks."
```

Use workspace write access for implementation. Authorized review checks that need temporary writes may use it in an isolated disposable copy under Scoped Execution; this does not authorize source edits. Implementation example:

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox workspace-write \
  --json \
  "Mode: implement. Fix the auth token expiry bug. Evaluate global/user and project/local Skills discoverable by Codex, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Stay within src/auth and tests/auth unless evidence requires otherwise. Run the relevant tests. Return Skills used, changed files, commands run, evidence, and remaining risks."
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
3. Include the internal Skill routing instruction from this Skill.
4. Request a concise result: changed files, commands run, evidence, Skills used, assumptions, and unresolved risks.
5. Use `--sandbox read-only` for static research and review. Use `workspace-write` for implementation, or in an isolated disposable copy for authorized review checks that need temporary writes under Scoped Execution.
6. Keep prompts bounded; avoid broad “fix everything” tasks.
7. Review the changes and evidence under Scoped Execution; run additional checks only when needed.
8. Treat Codex output as advisory until the relevant repository evidence supports it.

## Approval And Sandbox Safety

- Prefer sandboxed execution and the narrowest permissions that fit the task.
- Use `--ask-for-approval never` only for non-interactive automation where prompts cannot be answered and the sandbox is sufficient.
- Do not use `--dangerously-bypass-approvals-and-sandbox` or `--yolo` by default.
- Do not expose Codex execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, or other credential material.

<!-- adapter-shared:recursion -->
## Recursion And Delegation Limits

- Do not recursively dispatch Codex CLI without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.
<!-- /adapter-shared:recursion -->

## Troubleshooting

- Run `codex --version` to confirm the executable is on `PATH`.
- Run `codex login status` to inspect authentication status without printing credentials.
- Use `codex --help` and `codex exec --help` for current flags because the CLI evolves over time.
- Read `references/codex-cli-reference.md` for install, authentication, exec mode, sandbox, output, and session notes.
