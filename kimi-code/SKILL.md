---
name: kimi-code
description: "Dispatch Kimi Code CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Kimi Code setup and troubleshooting."
when_to_use: "After explicit selection, ask Kimi to investigate repositories, propose fixes, implement scoped changes, compare approaches, inspect failures, or run terminal automation. For explicitly requested setup, login, sessions, or custom Kimi Skill directories, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# Kimi Code

<!-- adapter-shared:head -->
Use Kimi Code only when the current request or an earlier explicit user standing instruction selects it for this scope (for example “use Kimi Code”, “ask Kimi Code”). A discovered project policy counts only if the user explicitly adopted it. Loading this Skill or mentioning the CLI is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

## Execution Contract

- Actually invoke the selected CLI. Never impersonate its output or silently substitute another agent. If Kimi Code is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Task size alone does not cancel explicit selection.
- Give Kimi the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout: preserve others' edits and avoid duplicate work. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence before seeing other verdicts. Disclose shared-context limits; require checkable triggers, impact, and evidence, and resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data. If the user forbids all writes, respect that and report the resulting evidence gap.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Use structured output only when a consumer needs it; preserve raw output if parsing fails. Findings are evidence for the caller to review, not authority to expand scope. The caller inspects changes, verifies missing/stale evidence or integration effects, and owns final delivery.

## Target Context

Respect the target's host rules, project instructions, and the user's Skill selection or prohibition. Ordinary implementation, clarification, and tests run directly; no extra workflow is required. Optional Skills or references may be used only when relevant and permitted. Preserve the user's chosen scope throughout the handoff.
<!-- /adapter-shared:head -->

## First Steps

1. Run the bundled `scripts/kimi-code-status.sh` from this Skill directory before using Kimi Code in a new environment.
2. If `kimi` is missing, explain the install options instead of installing without user approval:
   - macOS/Linux script install: `curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash`
   - npm install: `npm install -g @moonshot-ai/kimi-code` with Node.js 24.15.0 or newer
3. If credentials are missing or unknown, tell the user to run `kimi`, then `/login`. Do not ask for or print API keys.
4. Work from the intended repository directory. Kimi's context, resume behavior, and project skills depend on the current working directory.

## Dispatch Decision

After admission, dispatch Kimi for a scoped external pass:

- Research: unfamiliar codebase exploration, architecture mapping, dependency tracing, failure root-cause analysis, or approach comparison.
- Coding: small to medium scoped implementation, refactor, bug fix, test addition, or automation task.
- Review: ask for an independent read of a diff, suspected bug, missing test, or risky migration.
- Terminal work: batch file inspection or command-driven investigation where Kimi can produce a concise report.

Follow the task-size and access boundaries in the execution contract; an explicit agent selection remains binding.

## Invocation

Use non-interactive mode for research, review, and bounded coding tasks where the calling agent needs Kimi's answer back in the current turn:

```sh
kimi -p "Research this repository. Summarize the architecture, important entry points, and likely test commands. Do not edit files."
```

Use `--output-format stream-json` when a script needs structured events:

```sh
kimi -p "List the changed files and the purpose of each change." --output-format stream-json
```

Use interactive mode when the user wants to work directly inside Kimi or when a longer hands-on coding session is explicitly requested:

```sh
kimi
```

Resume the most recent session for the current directory with:

```sh
kimi --continue
```

Start with planning when the user wants Kimi to inspect first and avoid immediate edits:

```sh
kimi --plan
```

Use `--yolo` or `--auto` only for trusted workspaces after the user explicitly accepts the approval tradeoff. `--yolo` skips ordinary tool confirmations, including file writes and shell commands. `--prompt` already uses auto approval behavior and cannot be combined with `--yolo`, `--auto`, or `--plan`.

## Delegation Pattern

When delegating to Kimi:

1. State the exact working directory and objective in the prompt.
2. Specify mode: `research-only`, `propose-only`, or `implement`.
3. State boundaries: files or directories in scope, whether edits are allowed, and whether tests may be run.
4. Pass the user's context, authorization, and any Skill selection or prohibition to the target.
5. Ask for a concise result: changed files, commands run, evidence, assumptions, and unresolved risks.
6. Keep prompts bounded. Prefer one concrete task over broad "fix everything" prompts.
7. Review the changes and evidence within the authorized scope; run additional checks only when needed.
8. Treat Kimi output as advisory until the relevant repository evidence supports it.

Research example:

```sh
kimi -p "In this repository, inspect the failing auth tests, identify the root cause, and propose the smallest fix. Follow the user's scope and the target's host and project instructions. Do not edit files. Return files inspected, likely fix, and commands to verify."
```

Coding example:

```sh
kimi -p "Mode: implement. Working directory: $(pwd). Task: add focused tests for the auth token expiry bug and implement the smallest fix. Follow the user's scope and the target's host and project instructions. Stay within src/auth and tests/auth unless evidence requires otherwise. Run the relevant test command if discoverable. Return changed files, commands run, and any remaining risks."
```

Review example:

```sh
kimi -p "Mode: research-only. Review the current git diff for correctness risks and missing tests. Follow the user's scope and the target's host and project instructions. Do not edit files. Return only actionable findings with file paths and reasoning."
```

<!-- adapter-shared:recursion -->
## Delegation Limits

Keep dispatch to one hop unless the user explicitly requests further orchestration. Prevent recursive or duplicate dispatch on the same active scope; a requested independent child does not authorize that child to delegate again.
<!-- /adapter-shared:recursion -->

## Kimi Skills

Kimi Code has its own Skill mechanism. Use this only for Kimi, not Codex skills.

- User skills: `~/.kimi-code/skills/` and `~/.agents/skills/`
- Project skills: `.kimi-code/skills/` and `.agents/skills/`
- Extra directories: `extra_skill_dirs = ["~/team-skills"]` in Kimi `config.toml`
- Temporary replacement directories: `kimi --skills-dir /path/to/skills`

Kimi Skill files require YAML frontmatter with `name` and `description`; directory skills use `<skill-name>/SKILL.md`.

## Troubleshooting

- Run `kimi --version` to confirm the executable is on `PATH`.
- Kimi local data defaults to `~/.kimi-code/`; `KIMI_CODE_HOME` can point to another root.
- Use `kimi --help` and `kimi <subcommand> --help` for current flags.
- Read `references/kimi-code-reference.md` for command options, install notes, and Kimi Skill locations.
