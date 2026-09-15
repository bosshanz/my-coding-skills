---
name: claude-code
description: "Dispatch Claude Code CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Claude Code setup and troubleshooting."
when_to_use: "After explicit selection, use Claude Code to investigate a repository, compare approaches, inspect failures, review a diff, or implement a scoped change. For explicitly requested installation, authentication, print mode, sessions, permissions, or structured output help, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent. When the caller is itself Claude Code, answer directly unless the user explicitly requests an isolated independent pass."
argument-hint: "[任务 | task]"
---

# Claude Code

<!-- adapter-shared:head -->
Use Claude Code only when the current request or an earlier explicit user standing instruction selects it for this scope (for example “use Claude Code”, “ask Claude Code”). A discovered project policy counts only if the user explicitly adopted it. Loading this Skill or mentioning the CLI is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

## Execution Contract

- Actually invoke the selected CLI. Never impersonate its output or silently substitute another agent. If Claude Code is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Task size alone does not cancel explicit selection.
- Give Claude Code the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout: preserve others' edits and avoid duplicate work. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence before seeing other verdicts. Disclose shared-context limits; require checkable triggers, impact, and evidence, and resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data. If the user forbids all writes, respect that and report the resulting evidence gap.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Use structured output only when a consumer needs it; preserve raw output if parsing fails. Findings are evidence for the caller to review, not authority to expand scope. The caller inspects changes, verifies missing/stale evidence or integration effects, and owns final delivery.

## Target Context

Respect the target's host rules, project instructions, and the user's Skill selection or prohibition. Ordinary implementation, clarification, and tests run directly; no extra workflow is required. Optional Skills or references may be used only when relevant and permitted. Preserve the user's chosen scope throughout the handoff.
<!-- /adapter-shared:head -->

## First Steps

1. Run the bundled `scripts/claude-code-status.sh` from this Skill directory in a new environment.
2. If `claude` is missing, explain the official installation options instead of installing without user approval.
3. If authentication is missing, ask the user to complete Claude Code login. Never ask for or print credentials.
4. Run from the intended repository directory so project instructions and local configuration are discovered.

## Dispatch Decision

After admission, dispatch Claude Code for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Produce structured output for downstream automation.

Follow the task-size and access boundaries in the execution contract; an explicit agent selection remains binding. When the caller is already Claude Code, answer directly unless the user requested an isolated second opinion; do not spawn a redundant subprocess.

If the calling agent is itself Claude Code, treat “use Claude Code” as a request to the current agent and do the work directly. Spawn a subprocess only for an explicitly requested isolated pass (fresh context, no shared session state).

## Invocation

Use print mode for bounded tasks:

```sh
claude -p "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Follow the user's scope and the target's host and project instructions. Do not edit files. Return evidence, assumptions, and unresolved risks." \
  --permission-mode plan \
  --output-format json
```

Pipe a diff for review:

```sh
git diff --no-ext-diff | claude -p "Mode: review-only. Review this diff for correctness risks and missing tests. Follow the user's scope and the target's host and project instructions. Do not edit files. Return only actionable findings with file paths and reasoning." \
  --output-format json
```

Use structured output when a script needs a stable result shape:

```sh
claude -p "List the changed files and the purpose of each change." \
  --output-format json \
  --json-schema '{"type":"object","properties":{"files":{"type":"array","items":{"type":"string"}}},"required":["files"]}'
```

Use interactive mode only when the user wants to work directly in Claude Code:

```sh
claude
```

## Delegation Pattern

1. State the working directory, objective, and mode: `research-only`, `propose-only`, `review-only`, or `implement`.
2. State boundaries: files or directories in scope, whether edits are allowed, and whether tests may run.
3. Pass the user's context, authorization, and any Skill selection or prohibition to the target.
4. Request a concise result: changed files, commands run, evidence, assumptions, and unresolved risks.
5. Prefer `--permission-mode plan` for static research and review. Permit only the tools needed for implementation or authorized review checks within the authorized scope; verification does not authorize source edits or approval bypasses.
6. Keep prompts bounded; avoid broad “fix everything” tasks.
7. Review the changes and evidence within the authorized scope; run additional checks only when needed.
8. Treat Claude Code output as advisory until the relevant repository evidence supports it.

## Permission Safety

- Do not use `--permission-mode bypassPermissions` or `--dangerously-skip-permissions` by default.
- Use `--allowedTools` or project permission settings to narrow automated tool access when appropriate.
- Do not expose Claude Code execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, credential files, or authentication output containing secrets.

<!-- adapter-shared:recursion -->
## Delegation Limits

Keep dispatch to one hop unless the user explicitly requests further orchestration. Prevent recursive or duplicate dispatch on the same active scope; a requested independent child does not authorize that child to delegate again.
<!-- /adapter-shared:recursion -->

## Troubleshooting

- Run `claude --version` to confirm the executable is on `PATH`.
- Run `claude auth status` to inspect authentication status without printing credentials.
- Use `claude --help` for current flags because the CLI evolves over time.
- Read `references/claude-code-reference.md` for install, print mode, permissions, sessions, and structured output notes.
