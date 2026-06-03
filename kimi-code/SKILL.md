---
name: kimi-code
description: "Dispatch Kimi Code CLI as an external coding or research agent from another coding agent: ask Kimi to investigate repositories, propose fixes, implement scoped changes, compare approaches, inspect failures, or run terminal automation, then have the calling agent review diffs and verify results. Also use for Kimi Code setup, login, sessions, custom Kimi Skill directories, and troubleshooting. Use especially when the user explicitly names Kimi Code; the caller must invoke the target, must not simulate its output, and must report unavailability instead of silently falling back."
---

# Kimi Code

Use Kimi Code CLI as an external terminal agent that another coding agent can dispatch for coding and research work. Kimi can inspect the repo, run commands, edit files, and report findings; the calling agent remains responsible for scoping the delegation, reviewing the result, and verifying before presenting work as complete.

## Adapter Contract

Follow the shared `$agent-delegation` contract whenever this Skill is used for external-agent delegation.

### Must Use When

- The user explicitly asks to use Kimi Code, including common wording such as “use Kimi Code”, “ask Kimi Code”, or the matching Skill name.
- An authorized project delegation policy selects Kimi Code.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Kimi Code CLI is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Kimi Code; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Kimi Code might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Output Contract

Ask Kimi Code to return, when supported: `task_summary`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## First Steps

1. Run `${KIMI_SKILL_DIR}/scripts/kimi-code-status.sh` before using Kimi Code in a new environment.
2. If `kimi` is missing, explain the install options instead of installing without user approval:
   - macOS/Linux script install: `curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash`
   - npm install: `npm install -g @moonshot-ai/kimi-code` with Node.js 24.15.0 or newer
3. If credentials are missing or unknown, tell the user to run `kimi`, then `/login`. Do not ask for or print API keys.
4. Work from the intended repository directory. Kimi's context, resume behavior, and project skills depend on the current working directory.

## Dispatch Decision

Dispatch Kimi when parallel or second-pass agent work is useful:

- Research: unfamiliar codebase exploration, architecture mapping, dependency tracing, failure root-cause analysis, or approach comparison.
- Coding: small to medium scoped implementation, refactor, bug fix, test addition, or automation task.
- Review: ask for an independent read of a diff, suspected bug, missing test, or risky migration.
- Terminal work: batch file inspection or command-driven investigation where Kimi can produce a concise report.

Keep work in the calling agent when the task is tiny, requires sensitive credentials, depends on UI-only state, or needs direct control over user approvals.

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
4. Ask for a concise result: changed files, commands run, evidence, assumptions, and unresolved risks.
5. Keep prompts bounded. Prefer one concrete task over broad "fix everything" prompts.
6. After Kimi completes, inspect the diff and run verification yourself before claiming completion.
7. Treat Kimi output as advisory until local files and tests confirm it.

Research example:

```sh
kimi -p "In this repository, inspect the failing auth tests, identify the root cause, and propose the smallest fix. Do not edit files. Return files inspected, likely fix, and commands to verify."
```

Coding example:

```sh
kimi -p "Mode: implement. Working directory: $(pwd). Task: add focused tests for the auth token expiry bug and implement the smallest fix. Stay within src/auth and tests/auth unless evidence requires otherwise. Run the relevant test command if discoverable. Return changed files, commands run, and any remaining risks."
```

Review example:

```sh
kimi -p "Mode: research-only. Review the current git diff for correctness risks and missing tests. Do not edit files. Return only actionable findings with file paths and reasoning."
```

## Recursion And Delegation Limits

- Do not recursively dispatch Kimi Code without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.

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
