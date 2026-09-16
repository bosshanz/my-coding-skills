# Claude Code

官方文档： [CLI 参考](https://docs.claude.com/en/docs/claude-code/cli-reference), [无头模式](https://code.claude.com/docs/en/headless), [权限](https://code.claude.com/docs/en/permissions)。通过 `claude --help` 确认参数。

## 安装与认证

- 根据用户操作系统，遵循当前官方安装说明。
- 用 `claude --version` 确认版本，用 `claude auth status` 检查登录。
- 不索取、输出或复制令牌或 API 密钥。

## 无头模式（默认）

```sh
claude -p "模式：research-only。检查本仓库，不修改文件。返回证据、假设和未解决风险。" \
  --permission-mode plan \
  --output-format json
```

```sh
git diff --no-ext-diff | claude -p "模式：review-only。审查此差异，不修改文件。返回附有路径的可操作发现。" \
  --output-format json
```

```sh
claude -p "列出修改文件及每项改动的目的。" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"files":{"type":"array","items":{"type":"string"}}},"required":["files"]}'
```

- `-p` / `--print` 执行一次提示词后退出。标准输入可传入差异或日志。
- `--output-format` 可选 `text`、`json` 或 `stream-json`。`--json-schema` 应与 `json` 搭配。
- 静态研究和审查使用 `--permission-mode plan`。范围明确的实现可考虑 `acceptEdits`。`dontAsk` 自动拒绝未预先允许的操作，仅与明确允许列表配合使用。除非用户接受隔离环境中的风险，否则不使用 `bypassPermissions` 或 `--dangerously-skip-permissions`。
- `--max-turns` 和 `--max-budget-usd` 限制自动执行范围。`--no-session-persistence` 不保存打印模式会话。
- `--bare` 跳过自动发现的钩子、插件、MCP、自动记忆和 `CLAUDE.md`；须显式传入必要上下文。
- `--continue` 恢复当前目录最新会话。`--resume` 接受会话 ID 或名称。`--fork-session` 在恢复时创建新 ID。

只有用户需要终端交互界面时才使用交互式 `claude`。

## ACP

Claude Code 没有 `claude acp` 命令。ACP 客户端可启动 `npx -y @agentclientprotocol/claude-agent-acp`。ACP 仅用于客户端驱动的会话或编辑器集成，不用于一次性派发。
