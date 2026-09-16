# Codex CLI

官方文档： [CLI](https://developers.openai.com/codex/cli), [命令参考](https://developers.openai.com/codex/cli/reference), [非交互模式](https://developers.openai.com/codex/noninteractive)。通过 `codex exec --help` 确认参数。

## 安装与认证

- 遵循当前官方 CLI 安装说明。
- 用 `codex --version` 确认版本，用 `codex login status` 检查登录。
- CI 环境遵循官方 API 密钥说明。不索取、输出或复制令牌、API 密钥或 `auth.json`。

## 无头模式（默认）

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --json \
  "模式：research-only。检查本仓库，不修改文件。返回证据、假设和未解决风险。"
```

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox workspace-write \
  --json \
  "模式：implement。限定在指定文件范围内，运行相关测试。返回修改文件、命令、证据和剩余风险。"
```

```sh
codex exec \
  -C "$(pwd)" \
  --sandbox read-only \
  --output-schema ./review-schema.json \
  --output-last-message ./codex-review.json \
  "审查当前差异，按指定 schema 返回发现。"
```

- `codex exec`（别名 `codex e`）是非交互入口，也可从标准输入接收提示词。
- 研究和审查使用 `--sandbox read-only`；实现或已授权临时检查使用 `workspace-write`。除非用户接受隔离环境中的风险，否则不使用 `danger-full-access` 和 `--dangerously-bypass-approvals-and-sandbox` / `--yolo`。
- `--json` 输出 JSONL 事件。`-o` / `--output-last-message` 写入最终消息。`--output-schema` 约束最终消息结构。
- `codex review` 执行仓库审查。`codex exec resume --last` 继续最新 exec 会话。`codex exec fork` 复制会话。
- `--worktree` 在托管 Git 工作树运行。`--ephemeral` 不持久化会话。`--skip-git-repo-check` 允许非 Git 目录。`-i` 附加图片。
- 仅在沙箱已足够约束操作且无人能响应审批时，使用 `--ask-for-approval never`。

只有用户需要终端交互界面时才使用交互式 `codex`。

## ACP

Codex 没有 `codex acp` 命令。ACP 客户端可启动 `npx -y @agentclientprotocol/codex-acp`。ACP 仅用于客户端驱动的会话或编辑器集成，不用于一次性派发。
