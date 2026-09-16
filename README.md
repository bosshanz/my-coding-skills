# Coding Agent Skills

按需使用的设计、业务验证、决策追问、仓库内经验积累和外部 CLI 调用合同，以及覆盖所有开发任务的工程行为准则。

开发、修复、重构、开发测试和代码审查以 `eng` 为统一工程入口，由当前 Agent 完成；纯需求分析按问题直接处理。本库不再提供默认的开发调度器，也不把澄清、QA 和验收串成固定阶段。是否使用 Skill 取决于它能否补充当前任务需要的信息；用户要求不使用时，直接遵从。

[English](README.en.md)

## 可选能力

当前有 6 个 Skill，全部按需选择：

| Skill | 用途 |
| --- | --- |
| `design` | 需要具体设计决策时查阅交互、视觉和动效资料；已定设计的普通实现无需再走设计流程。 |
| `verify` | 用户明确要求的业务规则检查、用户旅程诊断或最终验收。请求保护规则时可以补测试；仅评审时保持只读。 |
| `eng` | 所有开发任务的统一工程入口：约束工程行为与品味，遵循如无必要勿增实体、可维护表达、清晰契约、真实失败、状态归属、兼容性和证据原则；不规定固定流程。 |
| `grill-me` | 用户要求深度追问或挑战方案时，先查事实，一次追问一个关键问题，收敛决策与待验证项。 |
| `reflect` | 日常从纠正、失败和有证据的改进中自动复盘，经验默认跟随仓库；全局记忆需用户明确要求。 |
| `external-cli` | 用户点名 Claude Code、Codex CLI、Kimi Code、OpenCode 或 Grok Build 时，按合同调用对应无头 CLI；ACP 只用于有客户端的会话或编辑器嵌入。 |

`verify` 合并了原 `qa` 和 `acceptance` 的用途。它区分检查行为、按请求增加测试保护和给出最终结论；技术验收不授权发布。真正的独立审查需要实际的审查者分离和相应授权。

`reflect` 遵从宿主的记忆与文件写入规则。优先复用仓库已有经验日志，否则在首次有可记录经验时使用仓库根目录 `.agent-learning.md`；宿主禁止自动持久化时只在对话中复盘。区分确认偏好、已获证据的经验与待验证假设，不自动改写项目规则。Codex 元数据允许隐式调用；其他宿主按入口描述触发。`$reflect` / `/reflect` 仍可主动复盘或维护经验。

## 怎样使用这六个能力

从任务需要补充的信息选择入口，不必按顺序调用：

| 你要完成的事 | 示例请求 | 重点 |
| --- | --- | --- |
| 改善已有产品的交互 | `$design 重新设计批量发布的部分失败和重试，沿用现有视觉系统。` | 先处理状态、反馈和恢复；不强制换字体、加动效或追求新奇。 |
| 判断工程方案 | `$eng 检查库存预留在并发请求和超时重试下的幂等方案。` | 对照适用条件、错误做法、改法与验证方法，只读相关参考。 |
| 检查实际行为 | `$verify 只诊断草稿在保存后刷新是否丢失，不修改代码。` | 将界面声称的结果与真实持久化状态对应；缺少证据就说明边界。 |
| 挑战方案 | `$grill-me 帮我逐步推敲离线编辑方案，一次问一个问题。` | 先查现有事实，再沿关键分支追问，收敛为决策、边界和最小验证。 |
| 复盘并积累经验 | `$reflect 复盘这次修复，将有证据的经验留在仓库。` | 区分事实、经验和假设，复用仓库日志并遵从宿主写入规则。 |
| 记录明确偏好 | `$reflect 将本项目的包管理器偏好从 pnpm 改为 npm，更新项目 AGENTS.md 的偏好段。` | 在宿主允许的机制内更新同作用域旧条目，不重复记录、不扩展成全局偏好。 |

设计参考提供营销概念、管理工具和原生桌面三类[选择示例](design/references/design-direction.md#calibration-examples)。工程例证覆盖[幂等与租户隔离](eng/references/software-quality.md#worked-examples-idempotency-and-tenant-scope)、[兼容迁移](eng/references/database-engineering.md#worked-example-renaming-a-populated-column)和[发布状态归属](eng/references/architecture-decisions.md#worked-example-one-owner-for-publish-state)。数据库专属语法标注适用引擎，不作为跨数据库通则。

`verify` 的[场景参考](verify/references/scenarios.md)覆盖支付响应丢失、草稿恢复、账号权限切换和批量部分完成，说明证据足以证明什么。它复用宿主已有工具，不要求额外浏览器或测试框架。`reflect` 支持同范围替换、局部例外和明确撤销；记录始终受宿主规则约束；不会默认写入全局。

这些例子是指导资料，不是已执行的测试报告。上游来源用于说明借鉴的方法，不代表已经证明本库的模型增益。具体证据层级见[工作流程与评估](docs/workflow.md)，规则与偏好的落点见[职责说明](docs/three-layers.md)。

## 工程原则与参考

`eng/SKILL.md` 提供各类开发任务共同的工程准则。已有架构、存储、调试和消融资料保留在 `eng/references/`，仅在具体问题需要时读取；不按前端、后端或客户端加载整套规范。`skills references` 列出打包路径。安装 `eng` 或 `all` 时会复制这些文件。

## 安装与查看

无参数仅显示帮助，不安装到任何位置。`all` 也需要显式选择，默认目标为 `agents`。安装 Skill 不会更新项目规则或全局记忆。

```bash
./install.sh --list
./install.sh design --target agents --dry-run
./install.sh design --target agents
./install.sh verify --target agents
./install.sh grill-me --target agents
./install.sh external-cli --target agents
./install.sh claude-code --target agents
```

npm CLI 使用相同目录和分组：

```bash
npx --package my-coding-skills skills list
npx --package my-coding-skills skills add design --target agents
npx --package my-coding-skills skills references
```

这些是当前源码提供的接口；在包含本次变更的版本发布前，npm registry 中的旧包仍保持原来的接口与行为。本地可以使用 `node bin/skills.mjs`。

| 分组 | 内容 |
| --- | --- |
| `ui` | `design` |
| `quality` | `verify` |
| `engineering` | `eng` |
| `meta` | `reflect` |
| `adapters` / `delegation` | `external-cli` |
| `all` | 全部 6 个 Skill，显式选择才安装 |

目标支持 `agents`（默认的 `~/.agents/skills`）、`codex`（`${CODEX_HOME:-$HOME/.codex}/skills`）、`claude`、`gemini`、`opencode` 和 `all`。`all` 写入 agents、claude、gemini、opencode 四处。`--dest DIR` 指定一个自定义目录，不能与显式 `--target all` 同用；`--force` 替换已存在的同名 Skill。

通用规则模板保留为独立选项，不随 Skill 安装：

```bash
./install.sh --global-rules --target codex --dry-run
./install.sh --global-rules --target codex
```

此选项需要 Node.js 18+，只替换模板托管区块，保留其他内容；修改前备份，内容相同则不重复写入，存在非空 `AGENTS.override.md` 时拒绝，以免结果被遮蔽。`--dest` 在此模式下指定规则目录。只采用适合自己的约定，项目命令和特定约束仍放在项目已有说明中。

## 从旧目录迁移

`dev`、`clarify`、`qa`、`acceptance` 及安装分组 `workflow`、`planning` 已退役。`kimi-code`、`claude-code`、`codex-cli`、`opencode`、`grok-build-cli` 现为 `external-cli` 的安装别名，安装器写入 `external-cli`，不静默删除旧目录。已有安装需要显式清理，否则旧入口仍可能被宿主发现。

在原先的安装目标预览并清理本库的旧目录，再按需安装新能力：

```bash
./uninstall.sh dev clarify qa acceptance --target agents --dry-run
./uninstall.sh dev clarify qa acceptance --target agents
./uninstall.sh kimi-code claude-code codex-cli opencode grok-build-cli --target agents
./install.sh verify --target agents
./install.sh external-cli --target agents
```

若原来安装到 `codex`、`claude` 等目标，应指定对应目标；有本地修改时先保留。卸载器仍接受旧名称、`workflow`、`planning`，便于移除历史安装。卸载 `quality` 会包含 `verify` 及旧 `qa`、`acceptance`；卸载 `adapters` 会包含 `external-cli` 及旧适配器目录；卸载 `all` 会包含当前和退役目录。无参数卸载也只显示帮助。

原 `dev` 的参考资料现由可选的 `eng` 加载；原 `superpowers-lite.md` 改名 `debugging.md`，`design-and-research.md` 的模块与架构内容保留在 `architecture-decisions.md`。重复的开发流程、资料路由和通用文档写作入口已移除，旧内容可从 Git 历史恢复。

## 调用边界

- 功能、修复、重构、调试、开发测试和代码审查使用 `eng` 的共同准则，由当前 Agent 直接完成；用户禁用 Skill 时遵从。
- 需要设计决策时按需使用 `design`；业务规则检查、真实用法诊断或最终验收明确请求 `verify`；工程原则和按需参考由 `eng` 提供；挑战方案可请求 `grill-me`；纠正、失败和有证据的改进可触发 `reflect` 的仓库内学习。
- 外部 CLI 只有在当前请求或适用的用户持续指令已选定时才调用。发现项目策略文件本身不构成授权。
- 调用方必须实际调用指定 CLI，准确报告不可用情况，保留真实结果并复核证据。把用户选择或禁止使用 Skill 的要求传给目标，不强制目标加载本库流程。
- Skill 不授权增加任务、发布、生产操作或递归委派。结束一个检查不结束其他已授权工作。

## 验证与限制

```bash
npm test
npm run doctor
npm run check:cli
git diff --check
```

`npm test` 检查目录与引用、fixture 加载、校验器回归、安装和卸载安全。`doctor` 检查资源完整性；外部 CLI 不存在只产生提示。

路由代理、文本回答、宿主自报和真实执行是不同证据，详见 [工作流程与评估](docs/workflow.md)。当前真实执行夹具不再强制注入 `dev`；历史报告仍代表原版本。静态检查通过不证明删减后质量相当或更好，也不证明真实宿主的触发行为。需要证明增益时，使用相同模型、任务和环境的有无对照，单独记录结果；外部模型调用仍需相应授权。

## 目录结构

```text
design/
  SKILL.md
  agents/
    openai.yaml
  references/
    animation.md
    anthropic-frontend-design-LICENSE.txt
    design-direction.md
    interaction.md
verify/
  SKILL.md
  agents/
    openai.yaml
  references/
    scenarios.md
eng/
  SKILL.md
  agents/
    openai.yaml
  references/
    ablation.md
    architecture-decisions.md
    software-architecture.md
    software-quality.md
    database-engineering.md
    debugging.md
grill-me/
  SKILL.md
  agents/
    openai.yaml
reflect/
  SKILL.md
  agents/
    openai.yaml
external-cli/
  SKILL.md
  agents/
    openai.yaml
  references/
    claude-code.md
    codex-cli.md
    grok-build.md
    kimi-code.md
    opencode.md
  scripts/
    claude-code-status.sh
    codex-cli-status.sh
    grok-build-cli-status.sh
    kimi-code-status.sh
    opencode-status.sh
templates/
  AGENTS.md
install.sh
uninstall.sh
bin/
  skills.mjs
docs/
  workflow.md
  three-layers.md
```

## 维护与市场同步

本仓库是 My Coding Skills 的唯一编辑来源；[Andy’s Agent Marketplace](https://github.com/bosshanz/andy-agent-marketplace) 负责分发固定版本。市场里的 `plugins/my-coding-skills/skills/` 是生成副本，不直接修改。当前采用明确的发布动作，不自动跟随本仓库的每次提交。

仓库所有者要求“发布 My Coding Skills”时，默认包含两个仓库的发布：源仓库测试、提交和推送，以及市场同步、验证、提交和推送；明确要求只处理源仓库时遵从该范围。普通修改或仅提交/推送源仓库，不隐含发布到市场。

1. 在本仓库修改 Skill，正式发布时更新 `package.json` 和相应 lockfile 的版本。运行 `npm test`、`npm run doctor` 和 `git diff --check`；catalog/CLI 变更还需 `npm run check:cli`。检查差异后提交并推送，记录 `git rev-parse HEAD` 返回的完整 SHA。
2. 找到 remote 为 `https://github.com/bosshanz/andy-agent-marketplace.git`（或对应 SSH URL）的市场工作副本；没有时克隆该仓库。检查两个仓库的工作区并保留无关修改。进入市场根目录，用已发布的完整 SHA 同步：

   ```sh
   python3 scripts/sync_coding_skills.py /path/to/my-coding-skills FULL_COMMIT_SHA
   python3 scripts/verify.py
   git diff --check
   ```

3. 同步脚本读取指定提交中的 Skill 和资源，更新插件版本、`sources.lock.json` 中的 SHA 与文件摘要。未提交的内容不会同步；检测到市场生成文件被手动修改时会拒绝覆盖。出现冲突先处理来源，不能强行覆盖。
4. 更新市场 README 和 `catalog/my-coding-skills.md` 的版本说明，复核同步差异并对变更能力做相称验证。仅暂存本次发布文件，提交、推送市场并检查 CI。交付时分别报告源仓库 SHA、市场 SHA 和验证范围；静态检查不等于模型行为验证。
5. 使用端按安装方式更新：Git 来源先刷新市场，再安装更新后的插件；本地来源使用同步后的本地市场重新安装。安装后新建任务。独立 Skill 安装仍使用本仓库原有安装流程，市场同步不会更新它；同一套 Skill 尽量只保留一种安装方式。

可以直接向维护 Agent 提出：“把 my-coding-skills 最新已提交版本同步到市场，验证后提交并推送。”仅修改文档或 Skill 时，不需要为了这条维护约定立即发布。

## 许可证

本仓库自有内容使用 [MIT License](LICENSE)。`design/references/design-direction.md` 改编自固定版本的第三方 Apache-2.0 内容，完整许可证位于 [对应许可证文件](design/references/anthropic-frontend-design-LICENSE.txt)；动效资料保留 [Emil Kowalski](https://github.com/emilkowalski/skills) 的 MIT 来源说明。
