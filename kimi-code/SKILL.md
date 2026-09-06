---
name: kimi-code
description: "Dispatch Kimi Code CLI for scoped coding, research, review, or terminal automation only when the current request or an applicable earlier explicit user standing instruction selects this external CLI. Also handle explicitly requested Kimi Code setup and troubleshooting."
when_to_use: "After explicit selection, ask Kimi to investigate repositories, propose fixes, implement scoped changes, compare approaches, inspect failures, or run terminal automation. For explicitly requested setup, login, sessions, or custom Kimi Skill directories, use references and local checks without dispatch. When dispatch is requested, invoke the actual target and report unavailability without silently substituting another agent."
argument-hint: "[任务 | task]"
---

# Kimi Code

<!-- adapter-shared:head -->
Use Kimi Code as an external terminal agent. Kimi can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever Kimi Code is used from another agent.

For setup or troubleshooting alone, use the relevant references and local checks without dispatch. Loading this Skill or mentioning the CLI is not selection for external-agent work. If no applicable selection exists, continue the requested work in the caller's workflow; do not request delegation approval merely because this Skill loaded.

### Must Use When

- The user explicitly selects Kimi Code for external-agent work, including common wording such as “use Kimi Code”, “ask Kimi Code”, or the matching Skill name in a delegation request.
- An earlier explicit standing instruction from the user selects Kimi Code for this scope. A project policy counts only when the user explicitly adopted it for the relevant scope; merely discovering a policy file does not authorize dispatch.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- Kimi Code is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke Kimi Code; do not simulate, impersonate, or fabricate its response.
- Do not summarize what Kimi Code might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Scoped Execution

- Pass the user's objective, existing decisions and authorization, owned files, constraints, expected deliverable, and proportionate verification to Kimi. Tell it whether the task is review-only or includes implementation.
- Ask it to finish authorized work without another plan approval, resolve routine choices from evidence, and report only material blockers. A Skill's advice cannot override the user's explicit scope or higher-priority host instructions; if a file causes a pause, report its path and exact instruction.
- When parallel work is authorized, assign disjoint ownership and tell each agent it shares the checkout: preserve others' edits and do not duplicate active work. Reuse valid evidence; rerun only for integration changes or unresolved concerns.

- Task size alone does not override an explicit agent selection. Keep work local when delegation has not been requested. If the selected agent cannot safely access the required context, report the specific blocker; do not silently substitute the caller.
- Inspect actual changes and assess the supplied evidence. Run additional verification when evidence is missing, stale, insufficient, or affected by integration changes. Research-only tasks require evidence review, not an unrelated test run.
- Use read-only access for static review. When the authorized review requires checks, allow only the commands and isolated temporary artifacts needed for verification, within the applicable sandbox and approval controls. This does not authorize editing reviewed source, changing production data, or bypassing approvals. If the user forbids all filesystem writes, keep the review entirely read-only and report any resulting verification gap.

### Output Contract

Ask Kimi Code to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the current request or an earlier explicit user standing instruction selects Kimi Code for the relevant scope. After dispatch, let Kimi Code use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell Kimi to evaluate global/user and project/local Skills discoverable by Kimi, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `dev` for ordinary implementation or bug repair; `design` for UI interaction design, visual direction, usability, AI-native interaction, or animation work; `clarify` for senior product judgment, prioritization and tradeoffs, first-slice or experiment decisions, and material requirement or architecture discovery, but not ongoing PM operations; `qa` only for an explicitly requested independent business or real-usage pass (missing evidence is not authorization); and `acceptance` for explicitly requested independent go/no-go verification when those Skills are available to Kimi.
- Do not ask Kimi to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`) unless the user explicitly authorizes multi-agent delegation.
- Ask Kimi to report which Skills it used or why none were used.
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

Follow the task-size and access boundaries in Scoped Execution; an explicit agent selection remains binding.

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
4. Include the internal Skill routing instruction from this Skill.
5. Ask for a concise result: changed files, commands run, evidence, Skills used, assumptions, and unresolved risks.
6. Keep prompts bounded. Prefer one concrete task over broad "fix everything" prompts.
7. Review the changes and evidence under Scoped Execution; run additional checks only when needed.
8. Treat Kimi output as advisory until the relevant repository evidence supports it.

Research example:

```sh
kimi -p "In this repository, inspect the failing auth tests, identify the root cause, and propose the smallest fix. Evaluate global/user and project/local Skills discoverable by Kimi, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used, files inspected, likely fix, and commands to verify."
```

Coding example:

```sh
kimi -p "Mode: implement. Working directory: $(pwd). Task: add focused tests for the auth token expiry bug and implement the smallest fix. Evaluate global/user and project/local Skills discoverable by Kimi, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Stay within src/auth and tests/auth unless evidence requires otherwise. Run the relevant test command if discoverable. Return Skills used, changed files, commands run, and any remaining risks."
```

Review example:

```sh
kimi -p "Mode: research-only. Review the current git diff for correctness risks and missing tests. Evaluate global/user and project/local Skills discoverable by Kimi, prefer project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies. Do not edit files. Return Skills used and only actionable findings with file paths and reasoning."
```

<!-- adapter-shared:recursion -->
## Recursion And Delegation Limits

- Do not recursively dispatch Kimi Code without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.
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
