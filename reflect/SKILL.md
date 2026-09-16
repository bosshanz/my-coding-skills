---
name: reflect
description: "Record a durable user preference only when explicitly invoked as $reflect or /reflect. A correction during ordinary work does not activate this Skill."
argument-hint: "[要记录的偏好与范围 | preference and scope]"
---

# Reflect

Record only a preference the user actually stated. Apply current corrections immediately; persistence is a separate, explicitly requested action.

- Identify the preference, its scope, and its source. Do not infer a general rule from a situational edit or a product requirement.
- Follow the host's memory and instruction-file rules. Use the requested destination or an existing project preference section when clearly authorized. Do not copy private host memories into a repository.
- If the request already authorizes the entry and destination, write it without another confirmation. Ask one focused question only when persistence scope or destination is materially ambiguous.
- Keep the entry short, dated, and sourced. Update an existing equivalent entry instead of appending a duplicate; preserve unrelated instructions.
- Report what was recorded and where. Continue other authorized work. Recording a preference does not authorize changes to this skill library.

## Scope, Conflicts, And Retraction

Distinguish personal preferences from team/project conventions. Use a shared repository file only when that destination is authorized; a personal preference does not become team policy merely because a repository is open.

Before writing, check the relevant existing entries. An explicit replacement supersedes the old preference at the same scope; update it instead of leaving contradictory instructions. A narrower exception does not erase a broader preference. If the intended precedence is materially ambiguous, ask about that conflict only. On an explicit retraction, remove or mark superseded only the matching entry through the host's permitted mechanism; some hosts require an update note rather than direct edits.

| User statement | Handling |
| --- | --- |
| `$reflect` records “Use pnpm in this project” in the named project file | Record the project scope and source once; no repeated confirmation. |
| “Make this heading red” during an ordinary edit | Apply the edit; do not infer or persist a preference for red headings. |
| `$reflect` replaces this project's pnpm preference with npm | Replace the equivalent project entry; preserve unrelated and other-project entries. |
| `$reflect` records “This legacy package uses npm; other packages keep pnpm” | Add the explicit package exception without broadening it. |
| `$reflect` retracts the earlier preference | Retract that entry without treating its opposite as a new preference. |

Keep one concept per entry. Session-specific fixes, obvious advice, and inferred lessons are not user-stated preferences. This remains a preference-recording capability, not automatic session learning. The shared/personal distinction and concise-entry approach are informed by Anthropic's [CLAUDE.md management](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management); its broader session-learning scope and mandatory reconfirmation are not adopted here.
