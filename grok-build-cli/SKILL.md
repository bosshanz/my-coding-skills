---
name: grok-build-cli
description: "Dispatch Grok Build CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Grok Build setup and troubleshooting."
when_to_use: "After explicit selection, use Grok Build CLI, Grok CLI, or grok to investigate a repository, compare approaches, inspect failures, review a diff, or implement a scoped change. For explicitly requested installation, authentication, grok -p, sessions, permissions, or structured output help, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# Grok Build CLI

<!-- adapter-shared:head -->
Use Grok Build CLI only when the current request or an earlier explicit user standing instruction selects it for this scope (for example “use Grok”, “ask Grok”, “Grok Build”, “Grok CLI”, `grok`). A discovered project policy counts only if the user explicitly adopted it. Loading this Skill or mentioning the CLI is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

## Execution Contract

- Actually invoke the selected CLI. Never impersonate its output or silently substitute another agent. If Grok Build CLI is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Task size alone does not cancel explicit selection.
- Give Grok the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout: preserve others' edits and avoid duplicate work. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence before seeing other verdicts. Disclose shared-context limits; require checkable triggers, impact, and evidence, and resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data. If the user forbids all writes, respect that and report the resulting evidence gap.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Use structured output only when a consumer needs it; preserve raw output if parsing fails. Findings are evidence for the caller to review, not authority to expand scope. The caller inspects changes, verifies missing/stale evidence or integration effects, and owns final delivery.

## Target Context

Respect the target's host rules, project instructions, and the user's Skill selection or prohibition. Ordinary implementation, clarification, and tests run directly; no extra workflow is required. Optional Skills or references may be used only when relevant and permitted. Preserve the user's chosen scope throughout the handoff.
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

Follow the task-size and access boundaries in the execution contract; an explicit agent selection remains binding.

## Invocation

Use print mode for bounded, non-interactive tasks:

```sh
grok -p "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Follow the user's scope and the target's host and project instructions. Do not edit files. Return evidence, assumptions, and unresolved risks." \
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

Follow the user's scope and the target's host and project instructions. Do not edit files. Return only actionable findings with file paths and reasoning." \
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
3. Pass the user's context, authorization, and any Skill selection or prohibition to the target.
4. Request a concise result: changed files, commands run, evidence, assumptions, and unresolved risks.
5. Prefer `--tools "read_file,grep,list_dir"` for static research and review. For authorized review checks, add only the necessary shell tools and isolate temporary outputs within the authorized scope; source-edit tools remain excluded. Allow source-edit tools only when implementation requires them.
6. Set `--max-turns` and `--no-subagents` on non-interactive runs. Keep prompts bounded; avoid broad “fix everything” tasks.
7. When using `--json-schema`, parse `structuredOutput` from the JSON envelope.
8. Review the changes and evidence within the authorized scope; run additional checks only when needed.
9. Treat Grok output as advisory until the relevant repository evidence supports it.

## Permission Safety

- Do not use `--always-approve`, `--yolo`, or `--permission-mode bypassPermissions` by default.
- Use `--tools` or `--disallowed-tools` to narrow automated tool access when appropriate.
- Do not expose Grok execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, `mcp_credentials.json`, or other credential material.

<!-- adapter-shared:recursion -->
## Delegation Limits

Keep dispatch to one hop unless the user explicitly requests further orchestration. Prevent recursive or duplicate dispatch on the same active scope; a requested independent child does not authorize that child to delegate again.
<!-- /adapter-shared:recursion -->

## Troubleshooting

- Run `grok --version` to confirm the executable is on `PATH`.
- Inspect authentication without printing secrets: a present `~/.grok/auth.json` or a set `XAI_API_KEY` is enough to proceed. Ask the user to run `grok login` when both are missing.
- Use `grok --help` for current flags because the CLI evolves over time.
- Read `references/grok-build-cli-reference.md` for install, authentication, headless mode, permissions, sessions, and structured output notes.
