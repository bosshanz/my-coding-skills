# Codex 子智能体配置

为 Codex 安装一个自定义子智能体角色和一段全局编排规则。与本库的 Skill 相互独立，需要单独安装。

## 安装内容

| 文件 | 安装位置 | 作用 |
| --- | --- | --- |
| `agents/luna_worker.toml` | `$CODEX_HOME/agents/` | `gpt-6-luna`，effort `max`：边界明确的代码探索、实现、测试、常规调试和证据核对；关键设计及复杂疑难问题由主智能体负责 |
| `AGENTS.snippet.md` | `$CODEX_HOME/AGENTS.md` | 创建或只替换 `## 全局子智能体编排` 一节，保留其他内容 |

`CODEX_HOME` 未设置时使用 `~/.codex`。

```sh
node codex/subagents/install.mjs --dry-run   # 只显示将要修改的文件
node codex/subagents/install.mjs             # 安装
node codex/subagents/install.mjs --codex-home /path/to/codex-home
```

安装器的行为：

- 先校验角色 TOML 能解析，且包含 `name`、`description`、`developer_instructions`、`model`、`model_reasoning_effort`。用仓库依赖 `smol-toml` 解析，没有 `node_modules` 时退回 Python 3.11+ 的 `tomllib`。
- 修改前把要覆盖的角色文件、`AGENTS.md` 以及现有 `config.toml` 备份到 `$CODEX_HOME/backups/subagents-<时间戳>/`。
- 不修改 `config.toml`。Codex 会自动发现 `$CODEX_HOME/agents/` 下的角色文件，不需要额外注册，也不会改动主会话的模型或 effort。
- 可重复执行：内容一致时输出 `unchanged`，不写文件也不产生备份。升级时备份并移除旧版 Sol 角色（`sol_worker.toml`、`sol_deep_worker.toml` 及其连字符文件名）和 `luna-worker.toml`（包括该文件的本地修改，可从备份恢复），统一使用 `luna_worker.toml`；不删除其他角色。

## 生效条件

- 使用支持自定义子智能体的 Codex 版本，安装后新开会话。
- 账号能使用 `gpt-6-luna`，并且这些模型支持所配置的 effort。`max` 是 Codex 源码中的合法取值，但官方配置参考表只列到 `xhigh`，并注明可用值取决于模型。
- 主智能体仍要在任务中选择委派，并按名称调用角色；全局规则只授权委派，不保证每个任务都会委派。
- 项目里的 `AGENTS.md` 或同名项目级角色（`.codex/agents/`）可能会覆盖或补充这里的全局设置。

## 验证范围

仓库测试（`npm test`）只验证：TOML 能解析、必填字段和模型取值正确；安装器在临时 `CODEX_HOME` 上的 dry-run、幂等、备份、章节替换，以及不改动 `config.toml`。

测试不会启动 Codex。角色能否被 Codex 实际加载、模型和 effort 是否被接受，要在本机安装后新开会话，调用角色确认。

角色加载成功不证明速度、成本或质量有提升；这些需要在真实任务上对比后再下结论。
