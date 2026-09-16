# Codex CLI

Official docs: [CLI](https://developers.openai.com/codex/cli), [command reference](https://developers.openai.com/codex/cli/reference), [non-interactive](https://developers.openai.com/codex/noninteractive). Confirm flags with `codex exec --help`.

## Install and authentication

- Follow the current official CLI install.
- Verify with `codex --version`. Inspect login with `codex login status`.
- For CI, follow official API-key guidance. Do not ask for, print, or copy tokens, API keys, or `auth.json`.

## Headless (default)

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --json \
  "Mode: research-only. Inspect this repository. Do not edit files. Return evidence, assumptions, and unresolved risks."
```

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox workspace-write \
  --json \
  "Mode: implement. Stay within the stated files. Run the relevant tests. Return changed files, commands, evidence, and remaining risks."
```

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --output-schema ./review-schema.json \
  --output-last-message ./codex-review.json \
  "Review the current diff and return findings that match the schema."
```

- `codex exec` (alias `codex e`) is the non-interactive entry. Prompt may also come from stdin.
- `--sandbox read-only` for research and review. `workspace-write` for implementation or authorized temporary checks. Avoid `danger-full-access` and `--dangerously-bypass-approvals-and-sandbox` / `--yolo` unless the user accepts the risk in an isolated environment.
- `--json` emits JSONL events. `-o` / `--output-last-message` writes the final message. `--output-schema` constrains that final shape.
- `codex review` runs a repository review. `codex exec resume --last` continues the latest exec session. `codex exec fork` copies a session.
- `--worktree` runs in a managed Git worktree. `--ephemeral` skips persisting the session. `--skip-git-repo-check` allows a non-git directory. `-i` attaches images.
- `--ask-for-approval never` only when the sandbox is sufficient and no human can answer prompts.

Interactive `codex` only when the user wants the TUI.

## ACP

Codex has no `codex acp` command. An ACP client can spawn `npx -y @agentclientprotocol/codex-acp`. Use ACP only for a client-driven session or editor embedding, not for one-shot dispatch.
