# My Coding Skills

个人 Skills 仓库，用于发布、复用和持续迭代。
English version: [README.en.md](./README.en.md)

## 仓库内容

当前包含 4 个主 Skill：

### `dev-workflow`

这是一个面向全栈研发工作流的轻量 Skill，重点包括：

- 先澄清、先出轻量方案，再执行
- 非简单任务先做方案对比并给出推荐
- 前端设计、UI 设计、交互设计、可访问性和性能质量门禁
- 后端技术调研、架构设计、容量估算、失败模式和中间件选型
- 基于 Python、Node、Go 的实现落地
- 行为变更优先按 RED-GREEN-REFACTOR 做测试先行
- Bug 修复先复现、定位根因，再最小化修复
- 交付前做 diff review、验证测试、中文交付、精简文档补充
- 架构和流程设计配套图示，优先 Mermaid

### `kimi-code`

这是一个让其他 Agent 调度 Kimi Code CLI 做编码或研究的 Skill，重点包括：

- 把 Kimi Code 作为外部编码 Agent 调度
- 支持仓库研究、故障定位、方案对比、独立 review
- 支持有边界的实现任务、重构、测试补充和终端自动化
- 要求调用方 Agent 在 Kimi 完成后复核 diff、运行验证、再交付结论
- 包含 Kimi Code 安装、登录、会话、Skill 目录和命令参考

### `claude-code`

这是一个让其他 Agent 调度 Claude Code CLI 的 Skill，重点包括：

- 支持仓库研究、独立 review、有边界的实现任务和终端自动化
- 支持非交互 print mode、结构化输出、会话和权限控制
- 默认限制危险权限，并要求调用方 Agent 复核结果
- 包含 Claude Code 安装、认证、权限和命令参考

### `codex-cli`

这是一个让其他 Agent 调度 Codex CLI 的 Skill，重点包括：

- 支持仓库研究、独立 review、有边界的实现任务和终端自动化
- 支持 `codex exec`、sandbox、approval、结构化输出和会话恢复
- 默认使用最小 sandbox 权限，并要求调用方 Agent 复核结果
- 包含 Codex CLI 安装、认证、配置和命令参考

## 兼容性

这个仓库同时兼容以下运行时：

- `Codex`
- `Claude Code`
- `OpenCode`

兼容方式如下：

- `Codex` 使用 `dev-workflow/SKILL.md`
- `Codex` 使用 `kimi-code/SKILL.md`
- `Codex` 使用 `claude-code/SKILL.md`
- `Codex` 使用 `codex-cli/SKILL.md`
- `Claude Code` 使用 `dev-workflow/SKILL.md`
- `Claude Code` 使用 `kimi-code/SKILL.md`
- `Claude Code` 使用 `claude-code/SKILL.md`
- `Claude Code` 使用 `codex-cli/SKILL.md`
- `OpenCode` 使用 `dev-workflow/SKILL.md`
- `OpenCode` 使用 `kimi-code/SKILL.md`
- `OpenCode` 使用 `claude-code/SKILL.md`
- `OpenCode` 使用 `codex-cli/SKILL.md`

说明：

- `agents/openai.yaml` 主要给 Codex 提供更好的 UI 展示元数据。
- `SKILL.md` 和 `references/` 是三种运行时共享的主体内容。
- `Claude Code` 和 `OpenCode` 都支持 `SKILL.md` 目录式 Skills。

## 目录结构

```text
dev-workflow/
  SKILL.md
  agents/openai.yaml
  references/
    stack.md
    design-and-research.md
    documentation.md
    frontend-quality.md
    backend-architecture.md
kimi-code/
  SKILL.md
  agents/openai.yaml
  references/
    kimi-code-reference.md
  scripts/
    kimi-code-status.sh
claude-code/
  SKILL.md
  agents/openai.yaml
  references/
    claude-code-reference.md
  scripts/
    claude-code-status.sh
codex-cli/
  SKILL.md
  agents/openai.yaml
  references/
    codex-cli-reference.md
  scripts/
    codex-cli-status.sh
LICENSE
README.md
README.en.md
```

## 安装方式

### 1. 安装到 Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R dev-workflow "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R kimi-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R claude-code "${CODEX_HOME:-$HOME/.codex}/skills/"
cp -R codex-cli "${CODEX_HOME:-$HOME/.codex}/skills/"
```

### 2. 安装到 Claude Code

```bash
mkdir -p "$HOME/.claude/skills"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
```

### 3. 安装到 OpenCode

推荐两种方式，任选其一：

方式 A，使用 OpenCode 原生目录：

```bash
mkdir -p "$HOME/.config/opencode/skills"
cp -R dev-workflow "$HOME/.config/opencode/skills/"
cp -R kimi-code "$HOME/.config/opencode/skills/"
cp -R claude-code "$HOME/.config/opencode/skills/"
cp -R codex-cli "$HOME/.config/opencode/skills/"
```

方式 B，复用 Claude Code 目录：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R dev-workflow "$HOME/.claude/skills/"
cp -R kimi-code "$HOME/.claude/skills/"
cp -R claude-code "$HOME/.claude/skills/"
cp -R codex-cli "$HOME/.claude/skills/"
```

## 推荐安装策略

如果你希望同时兼容 `Codex`、`Claude Code`、`OpenCode`，建议把仓库保留在任意开发目录，然后按各自运行时建立副本或软链接。

最省维护成本的方式是：

1. `Codex` 安装到 `${CODEX_HOME:-$HOME/.codex}/skills/<skill-name>`
2. `Claude Code` 安装到 `~/.claude/skills/<skill-name>`
3. `OpenCode` 安装到 `~/.config/opencode/skills/<skill-name>`
4. 如果你想让 `OpenCode` 走 Claude 兼容路径，也可以安装到 `~/.claude/skills/<skill-name>`

## 使用方式

### Codex

可以直接显式调用：

```text
Use $dev-workflow to implement a new feature with a brief plan first, then verify it and update docs.
```

```text
Use $kimi-code to dispatch Kimi Code for a scoped repository research task.
```

```text
Use $claude-code to dispatch Claude Code for an independent diff review.
```

```text
Use $codex-cli to dispatch Codex CLI for a read-only repository research task.
```

### Claude Code

Claude Code 会按需发现并加载 Skill。安装后可以自动触发，也可以直接显式调用。

显式调用示例：

```text
/dev-workflow
```

```text
/kimi-code
```

```text
/claude-code
```

```text
/codex-cli
```

### OpenCode

OpenCode 会按需发现并加载 Skill。只要目录安装正确，就可以通过正常任务描述触发。

## 默认行为

这个 Skill 默认要求：

- 方案、设计说明、交付文档以中文呈现
- 代码、命令、协议名、配置键名保留原文
- 架构设计和流程设计补充轻量图示
- 行为变更优先测试先行，Bug 修复优先根因定位
- 交付前明确验证方式、review 结论和验收结论
- 保持轻量，不默认引入强制 worktree、长篇 spec 或多 Agent 编排
- 需要时按 reference 加载前端质量和后端架构检查清单，而不是把外部 Skill 原样变成默认长流程

## 许可证

本仓库使用 [MIT License](./LICENSE)。
