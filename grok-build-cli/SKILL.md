---
name: grok-build-cli
description: "Dispatch Grok Build CLI as an external coding, research, review, or terminal automation agent from another coding agent. Use when asking Grok Build CLI, Grok CLI, or grok to investigate a repository, compare approaches, inspect failures, review a diff, implement a scoped change, or when handling Grok installation, authentication, non-interactive grok -p mode, sessions, permissions, structured output, or troubleshooting. Use especially when the user explicitly names Grok Build CLI; the caller must invoke the target, must not simulate its output, and must report unavailability instead of silently falling back."
---

# Grok Build CLI

Use Grok Build CLI as an external terminal agent. Grok can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever Grok Build CLI is used from another agent.

### Must Use When

- The user explicitly asks to use Grok Build CLI, including common wording such as “use Grok”, “ask Grok”, “Grok Build”, “Grok CLI”, `grok`, or the matching Skill name.
- An authorized project delegation policy selects Grok Build CLI.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Grok Build CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Grok Build CLI; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Grok might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Output Contract

Ask Grok to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the user or project policy selects Grok Build CLI. After dispatch, let Grok use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell Grok to evaluate global/user and project/local Skills discoverable by Grok, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `dev` for ordinary implementation or bug repair; `design` for UI design direction, visual quality, or animation work; `clarify` for senior product judgment, prioritization and tradeoffs, first-slice or experiment decisions, and material requirement or architecture discovery, but not ongoing PM operations; `qa` for business, user-journey, and QA thinking that protects real usage; and `acceptance` for independent go/no-go verification when those Skills are available to Grok.
- Do not ask Grok to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`) unless the user explicitly authorizes multi-agent delegation.
- Ask Grok to report which Skills it used or why none were used.

## First Steps

1. Run the bundled `scripts/grok-build-cli-status.sh` from this Skill directory in a new environment.
2. If `grok` is missing, explain the official installation options instead of installing without user approval:
   - macOS/Linux: `curl -fsSL https://x.ai/cli/install.sh | bash`
   - Windows PowerShell: `irm https://x.ai/cli/install.ps1 | iex`
3. If authentication is missing, ask the user to run `grok login`, or `grok login --device-auth` on a headless host. For CI, they may set `XAI_API_KEY` instead. Never ask for or print credentials.
4. Run from the intended repository directory so `AGENTS.md`, project rules, and project Skills are discovered.

## Dispatch Decision

Dispatch Grok for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Produce JSON or schema-constrained output for downstream automation.

Keep work in the calling agent when the task is tiny, requires sensitive credentials, depends on UI-only state, or needs direct control over approvals.

## Invocation

Use print mode for bounded, non-interactive tasks:

```sh
grok -p "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Evaluate global/user and project/local Skills discoverable by Grok, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used, evidence, assumptions, and unresolved risks." \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --output-format json \
  --max-turns 16 \
  --no-subagents
```

Pass a diff through the prompt. Headless mode does not read piped stdin as the prompt; use `--prompt-file` when the prompt is large:

```sh
grok -p "Mode: review-only. Review this diff for correctness risks and missing tests.

$(git diff --no-ext-diff)

Evaluate global/user and project/local Skills discoverable by Grok, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used and only actionable findings with file paths and reasoning." \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --output-format json \
  --max-turns 16 \
  --no-subagents
```

Use `--json-schema` when a script needs a stable result shape. Parse the envelope's `structuredOutput` field, not `text`. `text` can concatenate intermediate objects across turns.

```sh
grok -p "List the changed files and the purpose of each change." \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --json-schema '{"type":"object","properties":{"files":{"type":"array","items":{"type":"string"}}},"required":["files"]}' \
  --max-turns 8 \
  --no-subagents
```

Use interactive mode only when the user wants to work directly in Grok:

```sh
grok --cwd "$(pwd)"
```

Resume or continue only when the user explicitly wants session continuity:

```sh
grok -c
grok -p "Continue the previous investigation and summarize the next fix." --continue
grok -p "Continue this specific session." --resume <session-id>
```

Use `--always-approve` / `--yolo` only for trusted workspaces after the user explicitly accepts the approval tradeoff. Non-interactive implementation that needs writes or shell will otherwise wait for permission.

## Delegation Pattern

1. State the working directory, objective, and mode: `research-only`, `propose-only`, `review-only`, or `implement`.
2. State boundaries: files or directories in scope, whether edits are allowed, and whether tests may run.
3. Include the internal Skill routing instruction from this Skill.
4. Request a concise result: changed files, commands run, evidence, Skills used, assumptions, and unresolved risks.
5. Prefer `--tools "read_file,grep,list_dir"` for research and review. Allow write or shell tools only when implementation requires them.
6. Set `--max-turns` and `--no-subagents` on non-interactive runs. Keep prompts bounded; avoid broad “fix everything” tasks.
7. When using `--json-schema`, parse `structuredOutput` from the JSON envelope.
8. Inspect the diff and run verification after Grok completes.
9. Treat Grok output as advisory until local files and tests confirm it.

## Permission Safety

- Do not use `--always-approve`, `--yolo`, or `--permission-mode bypassPermissions` by default.
- Use `--tools` or `--disallowed-tools` to narrow automated tool access when appropriate.
- Do not expose Grok execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, `mcp_credentials.json`, or other credential material.

## Recursion And Delegation Limits

- Do not recursively dispatch Grok Build CLI without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.

## Troubleshooting

- Run `grok --version` to confirm the executable is on `PATH`.
- Inspect authentication without printing secrets: a present `~/.grok/auth.json` or a set `XAI_API_KEY` is enough to proceed. Ask the user to run `grok login` when both are missing.
- Use `grok --help` for current flags because the CLI evolves over time.
- Read `references/grok-build-cli-reference.md` for install, authentication, headless mode, permissions, sessions, and structured output notes.
