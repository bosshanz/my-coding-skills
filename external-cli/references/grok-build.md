# Grok Build

官方文档： [CLI 参考](https://x.ai/docs/build/cli/reference), [概览](https://docs.x.ai/build/overview)。通过 `grok --help` 确认参数。

## 安装与认证

- macOS/Linux: `curl -fsSL https://x.ai/cli/install.sh | bash`
- Windows PowerShell: `irm https://x.ai/cli/install.ps1 | iex`
- npm: `npm i -g @xai-official/grok`
- 用 `grok --version` 确认版本，用 `grok update` 更新。
- 交互登录：`grok login`。无头或设备码登录：`grok login --device-auth`。退出登录：`grok logout`。
- CI 可设置 `XAI_API_KEY`。已保存的 `~/.grok/auth.json` 会话优先于 API 密钥。
- 不索取、输出或复制 `XAI_API_KEY`、`~/.grok/auth.json` 或 `~/.grok/mcp_credentials.json`。

## 无头模式（默认）

```sh
grok -p "模式：research-only。检查本仓库，不修改文件。返回证据、假设和未解决风险。" \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --output-format json \
  --max-turns 16 \
  --no-subagents
```

```sh
grok -p "模式：review-only。审查此差异。

$(git diff --no-ext-diff)

不修改文件。返回附有路径的可操作发现。" \
  --cwd "$(pwd)" \
  --tools "read_file,grep,list_dir" \
  --output-format json \
  --max-turns 16 \
  --no-subagents
```

- `-p` / `--single` 输出一次结果后退出。长提示词使用 `--prompt-file`。无头模式不会把管道标准输入当作提示词。
- `--output-format` 可选 `plain`、`json`、`streaming-json` 或 `streaming-messages-json`。`--json-schema` 隐含使用 `json`，并将验证后的对象放在 `structuredOutput` 中；不要把 `text` 当作该对象解析。
- `--tools` 指定内置工具允许列表（`read_file`、`grep`、`list_dir`、`search_replace`、`run_terminal_cmd`）。`--disallowed-tools` 排除工具。`--allow` / `--deny` 是权限规则别名。
- `--max-turns` 限制执行轮次。`--no-subagents` 禁用子 Agent。`--no-plan` 禁用计划模式。
- `--continue` / `-c` 恢复当前目录最新会话。`--resume` 接受 ID 或标题。`--fork-session` 在恢复时创建新 ID。`--worktree` 在新 Git 工作树中启动。
- 研究或审查可按需使用 `--permission-mode plan`；优先用 `--tools` 保持只读。只有用户接受信任边界后，才使用 `--always-approve` / `--yolo` / `bypassPermissions`。`dontAsk` 自动拒绝所有原本会弹出询问的操作。
- `grok inspect` 显示当前目录发现的规则、Skills、插件、钩子和 MCP。

只有用户需要终端交互界面时才使用交互式 `grok`。

## ACP

`grok agent stdio` 通过 JSON-RPC 将 Grok 作为 ACP 服务端运行。仅在确有 ACP 客户端驱动会话时使用。一次性工作使用 `grok -p`。
