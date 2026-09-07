---
name: codex-cli
description: "Dispatch Codex CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Codex CLI setup and troubleshooting."
when_to_use: "After explicit selection, use Codex CLI to investigate a repository, compare approaches, inspect failures, review a diff, or implement a scoped change. For explicitly requested installation, authentication, codex exec, sandboxing, approvals, sessions, structured output, or configuration help, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# Codex CLI

<!-- adapter-shared:head -->
Use Codex CLI only when the current request or an earlier explicit user standing instruction selects it for this scope (for example “use Codex CLI”, “ask Codex CLI”). A discovered project policy counts only if the user explicitly adopted it. Loading this Skill or mentioning the CLI is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

## Execution Contract

- Actually invoke the selected CLI. Never impersonate its output or silently substitute another agent. If Codex CLI is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Task size alone does not cancel explicit selection.
- Give Codex the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout: preserve others' edits and avoid duplicate work. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence before seeing other verdicts. Disclose shared-context limits; require checkable triggers, impact, and evidence, and resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data. If the user forbids all writes, respect that and report the resulting evidence gap.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Use structured output only when a consumer needs it; preserve raw output if parsing fails. Findings are evidence for the caller to review, not authority to expand scope. The caller inspects changes, verifies missing/stale evidence or integration effects, and owns final delivery.

## Skills In The Target CLI

Tell Codex to evaluate its discoverable user and project Skills, honor explicit selection, and prefer project-specific guidance when applicable. Load only the matching non-adapter workflow and useful references; ordinary implementation needs no separate QA or acceptance pass without the user's request. Report which Skills materially contributed, or why none applied. Do not ask the child to use another external adapter without explicit authorization.
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
## Delegation Limits

Keep dispatch to one hop unless the user explicitly requests further orchestration. Prevent recursive or duplicate dispatch on the same active scope; a requested independent child does not authorize that child to delegate again.
<!-- /adapter-shared:recursion -->

## Troubleshooting

- Run `codex --version` to confirm the executable is on `PATH`.
- Run `codex login status` to inspect authentication status without printing credentials.
- Use `codex --help` and `codex exec --help` for current flags because the CLI evolves over time.
- Read `references/codex-cli-reference.md` for install, authentication, exec mode, sandbox, output, and session notes.
