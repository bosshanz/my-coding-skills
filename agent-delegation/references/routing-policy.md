# Delegation Routing Policy

## Priority

Apply this priority order:

1. **Explicit user instruction**: if the user names a target agent, use that target.
2. **Project delegation policy**: if the project defines an agent for a task type, follow that policy unless it conflicts with the user.
3. **Authorized task-based routing**: select an agent by task type only when the user or project policy permits autonomous delegation.
4. **No implicit delegation**: without authorization, keep the task in the caller instead of invoking an external agent merely because it may help.
5. **No silent fallback**: if the selected target is unavailable, report the failure and ask before substituting another target.

## Target Name Mapping

Recognize common target names:

| User wording | Adapter |
| --- | --- |
| Kimi, Kimi Code, `kimi-code` | `$kimi-code` |
| Claude, Claude Code, `claude-code` | `$claude-code` |
| Codex, Codex CLI, `codex-cli` | `$codex-cli` |

When wording is ambiguous, ask one concise question instead of guessing.

## Explicit Delegation Examples

These requests require an actual invocation when the target is available:

- “让 Kimi review 这个模块。”
- “Ask Claude Code to compare these two approaches.”
- “Use Codex CLI to investigate the failing tests.”

The caller may review the same material afterward, but must not present its own analysis as the target agent's result.

## Same-Agent Requests

If the user asks the current host agent to launch a separate instance of itself:

- Confirm the request is for an independent child process, not merely continued analysis.
- Prevent the child from delegating another copy of itself.
- Keep the child task bounded and capture its output separately.
- If the environment cannot safely distinguish or invoke the child process, report that limitation.
