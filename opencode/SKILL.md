---
name: opencode
description: "Dispatch OpenCode CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested OpenCode setup and troubleshooting."
when_to_use: "After explicit selection, use OpenCode to investigate a repository, compare approaches, inspect failures, review a diff, or implement a scoped change. For explicitly requested installation, authentication, opencode run, sessions, agents, skills, or server attachment help, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# OpenCode

<!-- adapter-shared:head -->
Use OpenCode only when the current request or an earlier explicit user standing instruction selects it for this scope (for example “use OpenCode”, “ask OpenCode”, “opencode”). A discovered project policy counts only if the user explicitly adopted it. Loading this Skill or mentioning the CLI is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

## Execution Contract

- Actually invoke the selected CLI. Never impersonate its output or silently substitute another agent. If OpenCode is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Task size alone does not cancel explicit selection.
- Give OpenCode the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout: preserve others' edits and avoid duplicate work. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence before seeing other verdicts. Disclose shared-context limits; require checkable triggers, impact, and evidence, and resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data. If the user forbids all writes, respect that and report the resulting evidence gap.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Use structured output only when a consumer needs it; preserve raw output if parsing fails. Findings are evidence for the caller to review, not authority to expand scope. The caller inspects changes, verifies missing/stale evidence or integration effects, and owns final delivery.

## Target Context

Respect the target's host rules, project instructions, and the user's Skill selection or prohibition. Ordinary implementation, clarification, and tests run directly; no extra workflow is required. Optional Skills or references may be used only when relevant and permitted. Preserve the user's chosen scope throughout the handoff.
<!-- /adapter-shared:head -->

## First Steps

1. Run the bundled `scripts/opencode-status.sh` from this Skill directory in a new environment.
2. If `opencode` is missing, explain the official installation options instead of installing without user approval.
3. If authentication is missing, ask the user to complete OpenCode provider login with `opencode auth login`. Never ask for or print credentials.
4. Run from the intended repository directory so `AGENTS.md`, project rules, and project Skills are discovered.

## Dispatch Decision

After admission, dispatch OpenCode for an independent research, coding, or review pass:

- Research an unfamiliar codebase, dependency path, architecture, or failure.
- Compare implementation approaches or investigate a root cause.
- Review a diff for correctness, security, regressions, and missing tests.
- Implement a small or medium task with explicit file and test boundaries.
- Use OpenCode TUI directly when the user wants an interactive handoff.

Follow the task-size and access boundaries in the execution contract; an explicit agent selection remains binding.

## Invocation

Use `opencode run` for bounded, non-interactive tasks:

```sh
opencode run \
  --dir "$(pwd)" \
  "Mode: research-only. Inspect this repository and summarize the architecture, entry points, and likely test commands. Follow the user's scope and the target's host and project instructions. Do not edit files. Return evidence, assumptions, and unresolved risks."
```

Use JSON event output when a script needs structured logs:

```sh
opencode run \
  --dir "$(pwd)" \
  --format json \
  "Mode: review-only. Review the current diff for correctness risks and missing tests. Follow the user's scope and the target's host and project instructions. Do not edit files. Return only actionable findings with file paths and reasoning."
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
3. Pass the user's context, authorization, and any Skill selection or prohibition to the target.
4. Request a concise result: changed files, commands run, evidence, assumptions, and unresolved risks.
5. Prefer read-only prompts for static research and review; scope authorized review checks within the authorized scope. Allow implementation only when the user asked for OpenCode to edit.
6. Keep prompts bounded; avoid broad “fix everything” tasks.
7. Review the changes and evidence within the authorized scope; run additional checks only when needed.
8. Treat OpenCode output as advisory until the relevant repository evidence supports it.

## Safety And Sessions

- Do not expose OpenCode execution to untrusted prompts, repositories, or public input without isolation.
- Do not print tokens, API keys, `auth.json`, environment files, or other credential material.
- Avoid `--share` unless the user explicitly wants a shareable session transcript and understands what may be exposed.

<!-- adapter-shared:recursion -->
## Delegation Limits

Keep dispatch to one hop unless the user explicitly requests further orchestration. Prevent recursive or duplicate dispatch on the same active scope; a requested independent child does not authorize that child to delegate again.
<!-- /adapter-shared:recursion -->

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
