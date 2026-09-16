# OpenCode

官方文档： [CLI 命令](https://opencode.ai/v2/docs/cli/commands/), [Skills](https://opencode.ai/docs/skills/), [规则](https://opencode.ai/docs/rules/)。通过 `opencode run --help` 确认参数。

## 安装与认证

- 根据用户操作系统，遵循当前官方安装说明。
- 用 `opencode --version` 确认版本。
- 用 `opencode auth login` 配置提供商（`opencode providers` 是同一命令组）。用 `opencode auth list` 或 `opencode auth ls` 检查。
- 不索取、输出或复制令牌、API 密钥、`.env` 值或 `~/.local/share/opencode/auth.json`。

## 无头模式（默认）

```sh
opencode run \
  --dir "$(pwd)" \
  "模式：research-only。检查本仓库，不修改文件。返回证据、假设和未解决风险。"
```

```sh
opencode run \
  --dir "$(pwd)" \
  --format json \
  "模式：review-only。审查当前差异。 不修改文件。返回附有路径的可操作发现。"
```

```sh
opencode run \
  --dir "$(pwd)" \
  --agent plan \
  "模式：propose-only。比较实现选项，不修改文件。"
```

- `opencode run [message..]` 是非交互入口。`--dir` 设置工作目录。
- `--format json` 输出原始 JSON 事件。`--file` 附加文件。`--agent` 选择 OpenCode Agent，例如已配置的 `plan`。
- `--continue` / `-c` 和 `--session` / `-s` 继续先前会话。`--fork` 会先复制该会话。
- 模型支持时，`--variant` 设置提供商特定的推理强度。
- `--auto` 自动批准未被明确拒绝的权限；仅在用户接受信任边界时使用。拒绝规则仍会阻止操作。
- `--attach` 连接已有的 `opencode serve` 实例。

只有用户需要终端交互界面时才使用交互式 `opencode`。可用时，`opencode --mini` 启动精简界面。

## ACP

`opencode acp` 将 OpenCode 作为 ACP 服务端运行。仅在确有 ACP 客户端驱动会话时使用。

## Skills 与规则

Skills：`.opencode/skills/`、`~/.config/opencode/skills/`、`.agents/skills/`、`~/.agents/skills/`，以及兼容 Claude 的 `.claude/skills/` / `~/.claude/skills/`。规则：仓库 `AGENTS.md`、`~/.config/opencode/AGENTS.md`，以及作为兼容回退的 `CLAUDE.md`。
