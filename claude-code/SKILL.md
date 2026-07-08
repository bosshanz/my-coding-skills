---
name: claude-code
description: "Dispatch Claude Code CLI as an external coding, research, review, or terminal automation agent from another coding agent. Use when asking Claude Code to investigate a repository, compare approaches, inspect failures, review a diff, implement a scoped change, or when handling Claude Code installation, authentication, non-interactive print mode, sessions, permissions, structured output, or troubleshooting. Use especially when the user explicitly names Claude Code; the caller must invoke the target, must not simulate its output, and must report unavailability instead of silently falling back."
---

# Claude Code

Use Claude Code CLI as an external terminal agent. Claude Code can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever Claude Code is used from another agent.

### Must Use When

- The user explicitly asks to use Claude Code, including common wording such as “use Claude Code”, “ask Claude Code”, or the matching Skill name.
- An authorized project delegation policy selects Claude Code.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Claude Code CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Claude Code; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Claude Code might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Output Contract

Ask Claude Code to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the user or project policy selects Claude Code. After dispatch, let Claude Code use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell Claude Code to evaluate global/user and project/local Skills discoverable by Claude Code, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `loop-engineering` for agent methodology, feedback-loop, evaluation-loop, or multi-agent workflow design; `dev` for ordinary implementation or bug repair; `clarify` for requirement or architecture interviews; and `acceptance` for independent go/no-go verification when those Skills are available to Claude Code.
- Do not ask Claude Code to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, or `opencode`) unless the user explicitly authorizes multi-agent delegation.
- Ask Claude Code to report which Skills it used or why none were used.

## First Steps

1. Run the bundled `scripts/claude-code-status.sh` from this Skill directory in a new environment.
2. If `claude` is missing, explain the official installation options instead of installing without user approval.
3. If authentication is missing, ask the user to complete Claude Code login. Never ask for or print credentials.
4. Run from the intended repository directory so project instructions and local configuration are discovered.

## Dispatch Decision

Dispatch Claude Code for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Produce structured output for downstream automation.

Keep work in the calling agent when the task is tiny, requires sensitive credentials, depends on UI-only state, or needs direct control over approvals.

## Invocation

Use print mode for bounded tasks:

```sh
claude -p "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Evaluate global/user and project/local Skills discoverable by Claude Code, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used, evidence, assumptions, and unresolved risks." \
  --permission-mode plan \
  --output-format json
```

Pipe a diff for review:

```sh
git diff --no-ext-diff | claude -p "Mode: review-only. Review this diff for correctness risks and missing tests. Evaluate global/user and project/local Skills discoverable by Claude Code, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used and only actionable findings with file paths and reasoning." \
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
3. Include the internal Skill routing instruction from this Skill.
4. Request a concise result: changed files, commands run, evidence, Skills used, assumptions, and unresolved risks.
5. Prefer `--permission-mode plan` for research and review. Use broader permissions only when implementation requires them.
6. Keep prompts bounded; avoid broad “fix everything” tasks.
7. Inspect the diff and run verification after Claude Code completes.
8. Treat Claude Code output as advisory until local files and tests confirm it.

## Permission Safety

- Do not use `--permission-mode bypassPermissions` or `--dangerously-skip-permissions` by default.
- Use `--allowedTools` or project permission settings to narrow automated tool access when appropriate.
- Do not expose Claude Code execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, credential files, or authentication output containing secrets.

## Recursion And Delegation Limits

- Do not recursively dispatch Claude Code without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.

## Troubleshooting

- Run `claude --version` to confirm the executable is on `PATH`.
- Run `claude auth status` to inspect authentication status without printing credentials.
- Use `claude --help` for current flags because the CLI evolves over time.
- Read `references/claude-code-reference.md` for install, print mode, permissions, sessions, and structured output notes.
