# Kimi Code

官方文档： [入门](https://www.kimi.com/code/docs/en/kimi-code-cli/getting-started.html), [kimi 命令](https://www.kimi.com/code/docs/en/kimi-code-cli/reference/kimi-command.html)。通过 `kimi --help` 确认参数。

## 安装与认证

- macOS/Linux: `curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash`
- Windows PowerShell: `irm https://code.kimi.com/kimi-code/install.ps1 | iex`
- npm: `npm install -g @moonshot-ai/kimi-code` （遵循当前官方 Node 版本要求）
- 用 `kimi --version` 确认版本。
- 登录：`kimi login`（设备码）或交互式 `/login`。支持 Kimi Code OAuth 和 Kimi 平台 API 密钥。`/logout` 或文档指定的退出命令会清除凭据。
- 不索取或输出 API 密钥。

## 无头模式（默认）

```sh
kimi -p "模式：research-only。检查本仓库，不修改文件。返回证据、假设和未解决风险。"
```

```sh
kimi -p "列出修改文件及每项改动的目的。" --output-format stream-json
```

- `--prompt` / `-p` 执行一次提示词，将助手输出流式写入标准输出，不打开终端交互界面。非交互 `-p` 使用 auto 权限，静态拒绝规则仍生效。
- `--output-format` 可选 `text` 或 `stream-json`，仅与 `-p` 配合使用。
- `--continue` / `-c` 恢复当前目录最新会话。`--session` / `-S` 恢复选定或指定会话。不要组合 `--continue` 与 `--session`。
- `--yolo` / `-y` 表示按需询问（Ask When Needed）：普通工具可不经询问运行，风险操作、问题和计划仍可询问。`--auto` 表示从不询问（Never Ask）。不要组合 `--yolo` 与 `--auto`。
- `--plan` 启动计划模式（先只读探索）。
- `-p` 不能与 `--yolo`、`--auto` 或 `--plan` 组合。
- 恢复会话时可使用 `--auto`、`--yolo` 或 `--plan` 覆盖已保存模式。
- `--model` / `-m` 选择模型别名。`--add-dir` 添加工作区目录。`--agent` / `--agent-file` 为新会话选择配置，不能与 `--session` / `--continue` 组合。
- `--skills-dir` 替换本次启动自动发现的 Kimi Skill 目录，可重复指定。

只有用户需要终端交互界面时才使用交互式 `kimi`。

## ACP

`kimi acp` 通过标准输入输出将 Kimi 作为 ACP 服务端运行。仅在确有 ACP 客户端驱动会话时使用。该命令的 `--login` 为 ACP 终端认证执行设备码登录。

## 本地数据

默认根目录为 `~/.kimi-code/`，可用 `KIMI_CODE_HOME` 覆盖。用户 Skills：`~/.kimi-code/skills/`、`~/.agents/skills/`。项目 Skills：`.kimi-code/skills/`、`.agents/skills/`。
