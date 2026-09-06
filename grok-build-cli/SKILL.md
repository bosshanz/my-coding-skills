---
name: grok-build-cli
description: "Dispatch Grok Build CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Grok Build setup and troubleshooting."
when_to_use: "After explicit selection, use Grok Build CLI, Grok CLI, or grok to investigate a repository, compare approaches, inspect failures, review a diff, or implement a scoped change. For explicitly requested installation, authentication, grok -p, sessions, permissions, or structured output help, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# Grok Build CLI

<!-- adapter-shared:head -->
Use Grok Build CLI as an external terminal agent. Grok can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever Grok Build CLI is used from another agent.

For setup or troubleshooting alone, use the relevant references and local checks without dispatch. Loading this Skill or mentioning the CLI is not selection for external-agent work. If no applicable selection exists, continue the requested work in the caller's workflow; do not request delegation approval merely because this Skill loaded.

### Must Use When

- The user explicitly selects Grok Build CLI for external-agent work, including common wording such as “use Grok”, “ask Grok”, “Grok Build”, “Grok CLI”, `grok`, or the matching Skill name in a delegation request.
- An earlier explicit standing instruction from the user selects Grok Build CLI for this scope. A project policy counts only when the user explicitly adopted it for the relevant scope; merely discovering a policy file does not authorize dispatch.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Grok Build CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Grok Build CLI; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Grok Build CLI might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Scoped Execution

- Pass the user's objective, existing decisions and authorization, owned files, constraints, expected deliverable, and proportionate verification to Grok. Tell it whether the task is review-only or includes implementation.
- Ask it to finish authorized work without another plan approval, resolve routine choices from evidence, and report only material blockers. A Skill's advice cannot override the user's explicit scope or higher-priority host instructions; if a file causes a pause, report its path and exact instruction.
- When parallel work is authorized, assign disjoint ownership and tell each agent it shares the checkout: preserve others' edits and do not duplicate active work. Reuse valid evidence; rerun only for integration changes or unresolved concerns.

- Task size alone does not override an explicit agent selection. Keep work local when delegation has not been requested. If the selected agent cannot safely access the required context, report the specific blocker; do not silently substitute the caller.
- Inspect actual changes and assess the supplied evidence. Run additional verification when evidence is missing, stale, insufficient, or affected by integration changes. Research-only tasks require evidence review, not an unrelated test run.
- Use read-only access for static review. When the authorized review requires checks, allow only the commands and isolated temporary artifacts needed for verification, within the applicable sandbox and approval controls. This does not authorize editing reviewed source, changing production data, or bypassing approvals. If the user forbids all filesystem writes, keep the review entirely read-only and report any resulting verification gap.

### Output Contract

Ask Grok Build CLI to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the current request or an earlier explicit user standing instruction selects Grok Build CLI for the relevant scope. After dispatch, let Grok Build CLI use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell Grok to evaluate global/user and project/local Skills discoverable by Grok, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `dev` for ordinary implementation or bug repair; `design` for UI interaction design, visual direction, usability, AI-native interaction, or animation work; `clarify` for senior product judgment, prioritization and tradeoffs, first-slice or experiment decisions, and material requirement or architecture discovery, but not ongoing PM operations; `qa` only for an explicitly requested independent business or real-usage pass (missing evidence is not authorization); and `acceptance` for explicitly requested independent go/no-go verification when those Skills are available to Grok.
- Do not ask Grok to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`) unless the user explicitly authorizes multi-agent delegation.
- Ask Grok to report which Skills it used or why none were used.
<!-- /adapter-shared:head -->

## First Steps

1. Run the bundled `scripts/grok-build-cli-status.sh` from this Skill directory in a new environment.
2. If `grok` is missing, explain the official installation options instead of installing without user approval:
   - macOS/Linux: `curl -fsSL https://x.ai/cli/install.sh | bash`
   - Windows PowerShell: `irm https://x.ai/cli/install.ps1 | iex`
3. If authentication is missing, ask the user to run `grok login`, or `grok login --device-auth` on a headless host. For CI, they may set `XAI_API_KEY` instead. Never ask for or print credentials.
4. Run from the intended repository directory so `AGENTS.md`, project rules, and project Skills are discovered.

## Dispatch Decision

After admission, dispatch Grok for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Produce JSON or schema-constrained output for downstream automation.

Follow the task-size and access boundaries in Scoped Execution; an explicit agent selection remains binding.

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

Use `--always-approve` / `--yolo` only for trusted workspaces after the user explicitly accepts the approval tradeoff. Non-interactive runs that need writes or shell will otherwise wait for permission.

## Delegation Pattern

1. State the working directory, objective, and mode: `research-only`, `propose-only`, `review-only`, or `implement`.
2. State boundaries: files or directories in scope, whether edits are allowed, and whether tests may run.
3. Include the internal Skill routing instruction from this Skill.
4. Request a concise result: changed files, commands run, evidence, Skills used, assumptions, and unresolved risks.
5. Prefer `--tools "read_file,grep,list_dir"` for static research and review. For authorized review checks, add only the necessary shell tools and isolate temporary outputs under Scoped Execution; source-edit tools remain excluded. Allow source-edit tools only when implementation requires them.
6. Set `--max-turns` and `--no-subagents` on non-interactive runs. Keep prompts bounded; avoid broad “fix everything” tasks.
7. When using `--json-schema`, parse `structuredOutput` from the JSON envelope.
8. Review the changes and evidence under Scoped Execution; run additional checks only when needed.
9. Treat Grok output as advisory until the relevant repository evidence supports it.

## Permission Safety

- Do not use `--always-approve`, `--yolo`, or `--permission-mode bypassPermissions` by default.
- Use `--tools` or `--disallowed-tools` to narrow automated tool access when appropriate.
- Do not expose Grok execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, `mcp_credentials.json`, or other credential material.

<!-- adapter-shared:recursion -->
## Recursion And Delegation Limits

- Do not recursively dispatch Grok Build CLI without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.
<!-- /adapter-shared:recursion -->

## Troubleshooting

- Run `grok --version` to confirm the executable is on `PATH`.
- Inspect authentication without printing secrets: a present `~/.grok/auth.json` or a set `XAI_API_KEY` is enough to proceed. Ask the user to run `grok login` when both are missing.
- Use `grok --help` for current flags because the CLI evolves over time.
- Read `references/grok-build-cli-reference.md` for install, authentication, headless mode, permissions, sessions, and structured output notes.
