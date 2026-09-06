# Adapter Contract Template

Single source of truth for the sections shared by all five external-agent
adapter SKILL.md files. `scripts/sync-adapters.mjs` renders this template with
the per-CLI variables in `adapters.yaml` and writes the result between the
matching markers in each `<skill>/SKILL.md`. Run `npm run adapters:sync` after
editing here, or `node scripts/sync-adapters.mjs --check` to verify sync
(it runs as part of `npm test`).

Per-CLI sections (frontmatter description, First Steps, Dispatch Decision,
Invocation, Delegation Pattern, permission notes, CLI-specific skill
directories, Troubleshooting) stay hand-written in each SKILL.md, outside the
markers.

Tokens: `{{display}}` full CLI name, `{{short}}` prose name, `{{aliases}}`
quoted alias list for the Must Use When bullet.

<!-- adapter-shared:head -->
Use {{display}} as an external terminal agent. {{short}} can inspect repositories, run commands, edit files, and report findings; the calling agent remains responsible for scope, review, verification, and final delivery.

## Adapter Contract

Follow this external-agent contract whenever {{display}} is used from another agent.

For setup or troubleshooting alone, use the relevant references and local checks without dispatch. Loading this Skill or mentioning the CLI is not selection for external-agent work. If no applicable selection exists, continue the requested work in the caller's workflow; do not request delegation approval merely because this Skill loaded.

### Must Use When

- The user explicitly selects {{display}} for external-agent work, including common wording such as {{aliases}}, or the matching Skill name in a delegation request.
- An earlier explicit standing instruction from the user selects {{display}} for this scope. A project policy counts only when the user explicitly adopted it for the relevant scope; merely discovering a policy file does not authorize dispatch.

### Must Not Use When

- The user explicitly asks the caller agent to solve the task directly without external delegation.
- {{display}} is unavailable, cannot authenticate, or cannot access the required context.
- Invoking the target would violate security, privacy, permission, or project policy.

### Invocation Integrity

- Actually invoke {{display}}; do not simulate, impersonate, or fabricate its response.
- Do not summarize what {{display}} might say without invoking it when invocation is required.
- If invocation fails, report the failure and do not fabricate findings.
- Do not silently substitute another agent.

### Scoped Execution

- Pass the user's objective, existing decisions and authorization, owned files, constraints, expected deliverable, and proportionate verification to {{short}}. Tell it whether the task is review-only or includes implementation.
- Ask it to finish authorized work without another plan approval, resolve routine choices from evidence, and report only material blockers. A Skill's advice cannot override the user's explicit scope or higher-priority host instructions; if a file causes a pause, report its path and exact instruction.
- When parallel work is authorized, assign disjoint ownership and tell each agent it shares the checkout: preserve others' edits and do not duplicate active work. Reuse valid evidence; rerun only for integration changes or unresolved concerns.

- Task size alone does not override an explicit agent selection. Keep work local when delegation has not been requested. If the selected agent cannot safely access the required context, report the specific blocker; do not silently substitute the caller.
- Inspect actual changes and assess the supplied evidence. Run additional verification when evidence is missing, stale, insufficient, or affected by integration changes. Research-only tasks require evidence review, not an unrelated test run.
- Use read-only access for static review. When the authorized review requires checks, allow only the commands and isolated temporary artifacts needed for verification, within the applicable sandbox and approval controls. This does not authorize editing reviewed source, changing production data, or bypassing approvals. If the user forbids all filesystem writes, keep the review entirely read-only and report any resulting verification gap.

### Output Contract

Ask {{display}} to return, when supported: `task_summary`, `skills_used`, `findings`, `suggested_changes`, `risks`, `confidence`, `files_referenced`, `commands_run`, and `verification_needed`. Preserve raw output when structured parsing is unavailable or invalid.

## Internal Skill Routing

External CLI selection is explicit: use this adapter only after the current request or an earlier explicit user standing instruction selects {{display}} for the relevant scope. After dispatch, let {{display}} use its own discoverable global/user and project/local Skills automatically.

- In the prompt, tell {{short}} to evaluate global/user and project/local Skills discoverable by {{short}}, prefer explicitly named Skills first and project-local Skills over global Skills when both apply, and use the matching non-adapter Skill when its trigger applies.
- Reuse this prompt snippet when practical: `Evaluate global/user and project/local Skills discoverable by this CLI. Prefer explicitly named Skills first and project-local Skills over global Skills when both apply. Use the matching non-adapter Skill when its trigger applies. Do not invoke external-agent adapters unless explicitly authorized. Report Skills used or why none were used.`
- Respect any Skill explicitly named by the user.
- Prefer `dev` for ordinary implementation or bug repair; `design` for UI interaction design, visual direction, usability, AI-native interaction, or animation work; `clarify` for senior product judgment, prioritization and tradeoffs, first-slice or experiment decisions, and material requirement or architecture discovery, but not ongoing PM operations; `qa` only for an explicitly requested independent business or real-usage pass (missing evidence is not authorization); and `acceptance` for explicitly requested independent go/no-go verification when those Skills are available to {{short}}.
- Do not ask {{short}} to invoke any external-agent adapter (`kimi-code`, `claude-code`, `codex-cli`, `opencode`, or `grok-build-cli`) unless the user explicitly authorizes multi-agent delegation.
- Ask {{short}} to report which Skills it used or why none were used.
<!-- /adapter-shared:head -->

<!-- adapter-shared:recursion -->
## Recursion And Delegation Limits

- Do not recursively dispatch {{display}} without an explicit user request. If the user requests an independent child process, prevent further delegation in the child.
- Do not ask a dispatched agent to dispatch another coding agent unless the user explicitly requests multi-agent orchestration.
- Keep delegation depth to one hop by default.
- Do not start a duplicate external agent on the same scope when one is already active.
<!-- /adapter-shared:recursion -->
