---
name: external-cli
description: "Dispatch Claude Code, Codex CLI, Kimi Code, OpenCode, or Grok Build only when the current request or an earlier explicit user standing instruction selects that CLI. Also handle requested setup and troubleshooting for those CLIs."
when_to_use: "After explicit selection (use Claude Code, ask Codex CLI, use Kimi Code, ask OpenCode, use Grok, grok, $external-cli, $claude-code, $codex-cli, $kimi-code, $opencode, $grok-build-cli). Investigate, review, or implement with the named CLI. For install, login, sessions, or flags, use the matching reference and local checks without dispatch. Invoke the actual target; report unavailability; do not silently substitute another agent. If the caller already is the selected CLI, answer directly unless the user requested an isolated independent pass."
argument-hint: "[CLI 与任务 | named CLI and task]"
---

# External CLI

Use an external coding CLI only when the current request or an earlier explicit user standing instruction selects it for this scope. A discovered project policy counts only if the user explicitly adopted it. Loading this Skill is not delegation authorization. Setup and troubleshooting can use local checks without dispatch.

If the caller already is the selected CLI, complete ordinary work directly. Start a subprocess only for explicitly requested CLI automation or an isolated independent pass.

## Execution contract

- Invoke the selected CLI. Never impersonate its output or silently substitute another agent. If it is unavailable, cannot authenticate, lacks the context, or would violate permissions, report the specific blocker. Do not claim it completed work that was not invoked. Task size alone does not cancel explicit selection.
- Give the objective, resolved decisions, existing authorization, owned files, constraints, expected outcome, and proportionate verification. Distinguish review-only from implementation. Ask it to finish authorized work and resolve routine choices from evidence; Skill advice cannot override host instructions or the user's scope.
- For authorized parallel work, assign disjoint ownership and tell agents they share the checkout. Independent review uses a non-implementer who first judges the original target, criteria, revision, and raw evidence. Disclose shared-context limits; resolve disagreement by checks rather than consensus.
- Static review stays read-only. Authorized verification may use necessary commands and isolated temporary artifacts under existing sandbox and approval controls; it does not authorize editing reviewed source or production data.
- Request the outcome, relevant changes or findings, actual commands/results, and material gaps. Preserve raw output if parsing fails. Findings are evidence for the caller, not authority to expand scope. The caller inspects changes and owns final delivery.
- Keep dispatch to one hop unless the user explicitly requests further orchestration. A requested independent child does not authorize that child to delegate again.
- Do not print tokens, API keys, `auth.json`, or other credential material. Do not enable approval-bypass or yolo flags by default.

## Target context

Respect the target's host rules, project instructions, and the user's Skill selection or prohibition. Ordinary implementation, clarification, and tests run directly in the target. Optional Skills or references may be used only when relevant and permitted.

## Select the CLI

Read only the matching reference. Do not load the others.

| User named | Binary | Status | Headless (default) | ACP (session or editor only) | Reference |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `claude` | `scripts/claude-code-status.sh` | `claude -p` | `npx -y @agentclientprotocol/claude-agent-acp` | `references/claude-code.md` |
| Codex CLI | `codex` | `scripts/codex-cli-status.sh` | `codex exec` | `npx -y @agentclientprotocol/codex-acp` | `references/codex-cli.md` |
| Kimi Code | `kimi` | `scripts/kimi-code-status.sh` | `kimi -p` | `kimi acp` | `references/kimi-code.md` |
| OpenCode | `opencode` | `scripts/opencode-status.sh` | `opencode run` | `opencode acp` | `references/opencode.md` |
| Grok, Grok Build, Grok CLI, `grok` | `grok` | `scripts/grok-build-cli-status.sh` | `grok -p` | `grok agent stdio` | `references/grok-build.md` |

## First steps

1. Identify the selected CLI from the table.
2. Run its status script from this Skill directory in a new environment.
3. If the binary is missing, explain official installation options; do not install without approval.
4. If authentication is missing, ask the user to complete that CLI's login. Never ask for or print credentials.
5. Run from the intended repository directory so project instructions and Skills are discovered.

## Dispatch

Default: the headless command in the table, for a bounded research, review, or implementation pass.

Pass a short prompt that states mode (`research-only`, `review-only`, `propose-only`, or `implement`), working directory, file boundaries, whether edits and tests are allowed, and the user's Skill selection or prohibition. Keep the prompt bounded.

ACP is not the default. Use the ACP column only when the user wants a client-driven session or editor embedding, and a real ACP client will drive the server. Do not speak ACP JSON-RPC by hand from a one-shot shell. A helper such as `acpx` is an ACP client; spawning `kimi acp` or `grok agent stdio` without one will block on reverse permission and filesystem requests.

Ask the CLI to return: mode handled; files inspected or changed; commands run; evidence; assumptions and unresolved risks. Treat its output as advisory until repository evidence supports it.

Use `--help` on the selected CLI when a flag is uncertain; capabilities change.
