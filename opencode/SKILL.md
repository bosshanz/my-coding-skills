---
name: opencode
description: "Dispatch OpenCode CLI as an external coding, research, review, or terminal automation agent from another coding agent. Use when asking OpenCode to investigate a repository, compare approaches, inspect failures, review a diff, implement a scoped change, or when handling OpenCode installation, authentication, non-interactive opencode run mode, sessions, agents, skills, server attachment, or troubleshooting. Use especially when the user explicitly names OpenCode; the caller must invoke the target, must not simulate its output, and must report unavailability instead of silently falling back."
---

# OpenCode

Use OpenCode CLI as an external terminal agent. OpenCode can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever OpenCode is used from another agent.

### Must Use When

- The user explicitly asks to use OpenCode, including common wording such as “use OpenCode”, “ask OpenCode”, “opencode”, or the matching Skill name.
- An authorized project delegation policy selects OpenCode.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- OpenCode CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke OpenCode; do not simulate, impersonate, or fabricate its response.
- Do not summarize what OpenCode might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Output Contract

Ask OpenCode to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the user or project policy selects OpenCode. After dispatch, let OpenCode use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell OpenCode to evaluate global/user and project/local Skills discoverable by OpenCode, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `dev` for ordinary implementation or bug repair, `clarify` for requirement or architecture interviews, and `acceptance` for independent go/no-go verification when those Skills are available to OpenCode.
- Do not ask OpenCode to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, or `opencode`) unless the user explicitly authorizes multi-agent delegation.
- Ask OpenCode to report which Skills it used or why none were used.

## First Steps

1. Run the bundled `scripts/opencode-status.sh` from this Skill directory in a new environment.
2. If `opencode` is missing, explain the official installation options instead of installing without user approval.
3. If authentication is missing, ask the user to complete OpenCode provider login with `opencode auth login`. Never ask for or print credentials.
4. Run from the intended repository directory so `AGENTS.md`, project rules, and project Skills are discovered.

## Dispatch Decision

Dispatch OpenCode for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Use OpenCode TUI directly when the user wants an interactive handoff.

Keep work in the calling agent when the task is tiny, requires sensitive credentials, depends on UI-only state, or needs direct control over approvals.

## Invocation

Use `opencode run` for bounded, non-interactive tasks:

```sh
opencode run \
  --dir "$(pwd)" \
  "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Evaluate global/user and project/local Skills discoverable by OpenCode, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used, evidence, assumptions, and unresolved risks."
```

Use JSON event output when a script needs structured logs:

```sh
opencode run \
  --dir "$(pwd)" \
  --format json \
  "Mode: review-only. Review the current diff for correctness risks and missing tests. Evaluate global/user and project/local Skills discoverable by OpenCode, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used and only actionable findings with file paths and reasoning."
```

Use a specific OpenCode agent when available:

```sh
opencode run \
  --dir "$(pwd)" \
  --agent plan \
  "Mode: propose-only. Compare implementation options for this feature. Do not edit files."
```

Attach files when they are the task input:

```sh
opencode run \
  --dir "$(pwd)" \
  --file ./screenshot.png \
  "Review this UI screenshot against the current implementation and list concrete issues."
```

Use interactive mode only when the user wants to work directly in OpenCode:

```sh
opencode
```

Resume or continue only when the user explicitly wants session continuity:

```sh
opencode --continue
opencode run --continue "Continue the previous investigation and summarize the next fix."
opencode run --session <session-id> "Continue this specific session."
```

Use `--auto` only for trusted workspaces after the user explicitly accepts the approval tradeoff. It auto-approves permissions that are not explicitly denied.

## Delegation Pattern

1. State the working directory, objective, and mode: `research-only`, `propose-only`, `review-only`, or `implement`.
2. State boundaries: files or directories in scope, whether edits are allowed, and whether tests may run.
3. Include the internal Skill routing instruction from this Skill.
4. Request a concise result: changed files, commands run, evidence, Skills used, assumptions, and unresolved risks.
5. Prefer read-only prompts for research and review. Allow implementation only when the user asked for OpenCode to edit.
6. Keep prompts bounded; avoid broad “fix everything” tasks.
7. Inspect the diff and run verification after OpenCode completes.
8. Treat OpenCode output as advisory until local files and tests confirm it.

## Safety And Sessions

- Do not expose OpenCode execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, environment files, or other credential material.
- Avoid `--share` unless the user explicitly wants a shareable session transcript and understands what may be exposed.
- Do not recursively dispatch OpenCode without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.

## OpenCode Skills And Rules

OpenCode has first-party support for Agent Skills. Use this only for OpenCode, not Codex skill loading.

- User skills: `~/.config/opencode/skills/`, `~/.agents/skills/`, and Claude-compatible `~/.claude/skills/`.
- Project skills: `.opencode/skills/`, `.agents/skills/`, and Claude-compatible `.claude/skills/`.
- Project rules: `AGENTS.md` in the repository; `CLAUDE.md` is a compatibility fallback.
- Global rules: `~/.config/opencode/AGENTS.md`; `~/.claude/CLAUDE.md` is a compatibility fallback.

## Troubleshooting

- Run `opencode --version` to confirm the executable is on `PATH`.
- Run `opencode auth list` to inspect configured providers without printing credentials.
- Use `opencode --help`, `opencode run --help`, and `opencode auth --help` for current flags because the CLI evolves over time.
- Read `references/opencode-reference.md` for official command links, skill paths, rule paths, and local caveats.
