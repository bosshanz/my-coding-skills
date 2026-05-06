# My Coding Skills

Andy 的个人 Skills 仓库，用于发布、复用和持续迭代。  
English version: [README.en.md](./README.en.md)

## 仓库内容

当前包含 1 个主 Skill：

### `andy-coding`

这是一个面向个人全栈研发工作流的 Skill，重点包括：

- 先规划、先出方案，再执行
- 非简单任务先做方案对比并给出推荐
- 前端设计、UI 设计、交互设计
- 后端技术调研、架构设计、中间件选型
- 基于 Python、Node、Go 的实现落地
- 验证测试、中文交付、精简文档补充
- 架构和流程设计配套图示，优先 Mermaid

## 兼容性

这个仓库同时兼容以下运行时：

- `Codex`
- `Claude Code`
- `OpenCode`

兼容方式如下：

- `Codex` 使用 `andy-coding/SKILL.md`
- `Claude Code` 使用 `andy-coding/SKILL.md`
- `OpenCode` 使用 `andy-coding/SKILL.md`

说明：

- `agents/openai.yaml` 主要给 Codex 提供更好的 UI 展示元数据。
- `SKILL.md` 和 `references/` 是三种运行时共享的主体内容。
- `Claude Code` 和 `OpenCode` 都支持 `SKILL.md` 目录式 Skills。

## 目录结构

```text
andy-coding/
  SKILL.md
  agents/openai.yaml
  references/
    stack.md
    design-and-research.md
    documentation.md
LICENSE
README.md
README.en.md
```

## 安装方式

### 1. 安装到 Codex

```bash
mkdir -p "${CODEX_HOME:-$HOME/.codex}/skills"
cp -R andy-coding "${CODEX_HOME:-$HOME/.codex}/skills/"
```

### 2. 安装到 Claude Code

```bash
mkdir -p "$HOME/.claude/skills"
cp -R andy-coding "$HOME/.claude/skills/"
```

### 3. 安装到 OpenCode

推荐两种方式，任选其一：

方式 A，使用 OpenCode 原生目录：

```bash
mkdir -p "$HOME/.config/opencode/skills"
cp -R andy-coding "$HOME/.config/opencode/skills/"
```

方式 B，复用 Claude Code 目录：

```bash
mkdir -p "$HOME/.claude/skills"
cp -R andy-coding "$HOME/.claude/skills/"
```

## 推荐安装策略

如果你希望同时兼容 `Codex`、`Claude Code`、`OpenCode`，建议把仓库保留在任意开发目录，然后按各自运行时建立副本或软链接。

最省维护成本的方式是：

1. `Codex` 安装到 `${CODEX_HOME:-$HOME/.codex}/skills/andy-coding`
2. `Claude Code` 安装到 `~/.claude/skills/andy-coding`
3. `OpenCode` 安装到 `~/.config/opencode/skills/andy-coding`
4. 如果你想让 `OpenCode` 走 Claude 兼容路径，也可以安装到 `~/.claude/skills/andy-coding`

## 使用方式

### Codex

可以直接显式调用：

```text
Use $andy-coding to implement a new feature with a brief plan first, then verify it and update docs.
```

### Claude Code

Claude Code 会按需发现并加载 Skill。安装后可以自动触发，也可以直接显式调用。

显式调用示例：

```text
/andy-coding
```

### OpenCode

OpenCode 会按需发现并加载 Skill。只要目录安装正确，就可以通过正常任务描述触发。

## 默认行为

这个 Skill 默认要求：

- 方案、设计说明、交付文档以中文呈现
- 代码、命令、协议名、配置键名保留原文
- 架构设计和流程设计补充轻量图示
- 交付前明确验证方式和验收结论

## 许可证

本仓库使用 [MIT License](./LICENSE)。
