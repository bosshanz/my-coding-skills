# Coding Agent Skills

按需使用的设计、业务验证、偏好记录和外部 CLI 适配器，以及可以直接查阅的工程资料。

普通开发、修复、需求分析和补测试由当前 Agent 直接完成。本库不再提供默认的开发调度器，也不把澄清、QA 和验收串成固定阶段。是否使用 Skill 取决于它能否补充当前任务需要的信息；用户要求不使用时，直接遵从。

[English](README.en.md)

## 可选能力

当前有 9 个 Skill，全部按需选择：

| Skill | 用途 |
| --- | --- |
| `design` | 需要具体设计决策时查阅交互、视觉、前端质量和动效资料；已定设计的普通实现无需再走设计流程。 |
| `verify` | 用户明确要求的业务规则检查、用户旅程诊断或最终验收。请求保护规则时可以补测试；仅评审时保持只读。 |
| `eng` | 后端边界、质量、存储、架构决策、调试方法或消融比较；普通功能、修复和补测试不必加载。 |
| `reflect` | 仅显式 `$reflect` / `/reflect` 记录用户说过的偏好；普通纠正立即遵循，不自动触发记录流程。 |
| `kimi-code` | 用户选定 Kimi Code 时的调用、权限、会话与排障。 |
| `claude-code` | 用户选定 Claude Code CLI 时的调用与结果复核。 |
| `codex-cli` | 跨宿主调用 Codex 或明确的 CLI 自动化、隔离 CLI 任务。当前 Codex 的普通工作直接完成。 |
| `opencode` | 用户选定 OpenCode CLI 时的调用、会话与排障。 |
| `grok-build-cli` | 用户选定 Grok Build CLI 时的调用、权限和输出处理。 |

`verify` 合并了原 `qa` 和 `acceptance` 的用途。它区分检查行为、按请求增加测试保护和给出最终结论；技术验收不授权发布。真正的独立审查需要实际的审查者分离和相应授权。

`reflect` 遵从宿主的记忆与文件写入规则。已明确授权内容和落点时直接记录；只在范围或落点有实质歧义时询问。Codex 元数据关闭其隐式调用，其他宿主以明确的入口描述约束。参见 [Codex 调用策略](https://learn.chatgpt.com/docs/build-skills#optional-metadata)。

## 工程参考

后端、存储、架构、调试和消融资料由可选的 `eng` 加载，文件在 `eng/references/`。只读当前决策需要的那一份。`skills references` 列出打包路径。安装 `eng` 或 `all` 时会复制这些文件。

## 安装与查看

无参数仅显示帮助，不安装到任何位置。`all` 也需要显式选择，默认目标为 `agents`。安装 Skill 不会更新项目规则或全局记忆。

```bash
./install.sh --list
./install.sh design --target agents --dry-run
./install.sh design --target agents
./install.sh verify --target agents
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
| `adapters` / `delegation` | 5 个外部 CLI 适配器 |
| `all` | 全部 9 个 Skill，显式选择才安装 |

目标支持 `agents`（默认的 `~/.agents/skills`）、`codex`（`${CODEX_HOME:-$HOME/.codex}/skills`）、`claude`、`gemini`、`opencode` 和 `all`。`all` 写入 agents、claude、gemini、opencode 四处。`--dest DIR` 指定一个自定义目录，不能与显式 `--target all` 同用；`--force` 替换已存在的同名 Skill。

通用规则模板保留为独立选项，不随 Skill 安装：

```bash
./install.sh --global-rules --target codex --dry-run
./install.sh --global-rules --target codex
```

此选项需要 Node.js 18+，只替换模板托管区块，保留其他内容；修改前备份，内容相同则不重复写入，存在非空 `AGENTS.override.md` 时拒绝，以免结果被遮蔽。`--dest` 在此模式下指定规则目录。只采用适合自己的约定，项目命令和特定约束仍放在项目已有说明中。

## 从旧目录迁移

`dev`、`clarify`、`qa`、`acceptance` 及安装分组 `workflow`、`planning` 已退役，安装器会给出迁移提示，不静默替换名字或删除旧安装。已有安装需要显式清理，否则旧入口仍可能被宿主发现。

在原先的安装目标预览并清理本库的旧目录，再按需安装新能力：

```bash
./uninstall.sh dev clarify qa acceptance --target agents --dry-run
./uninstall.sh dev clarify qa acceptance --target agents
./install.sh verify --target agents
```

若原来安装到 `codex`、`claude` 等目标，应指定对应目标；有本地修改时先保留。卸载器仍接受旧名称、`workflow`、`planning`，便于移除历史安装。卸载 `quality` 会包含 `verify` 及旧 `qa`、`acceptance`；卸载 `all` 会包含当前和退役目录。无参数卸载也只显示帮助。

原 `dev` 的参考资料现由可选的 `eng` 加载；原 `superpowers-lite.md` 改名 `debugging.md`，`design-and-research.md` 的模块与架构内容保留在 `architecture-decisions.md`。重复的开发流程、资料路由和通用文档写作入口已移除，旧内容可从 Git 历史恢复。

## 调用边界

- 普通功能、修复、分析、开发测试和常规 code review 直接交给当前 Agent。
- 需要设计决策时按需使用 `design`；业务规则检查、真实用法诊断或最终验收明确请求 `verify`；后端、存储、架构或调试方法使用 `eng`；记录偏好显式调用 `reflect`。
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

`npm test` 检查适配器同步、目录与引用、fixture 加载、校验器回归、安装和卸载安全。`doctor` 检查资源完整性；外部 CLI 不存在只产生提示。

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
    quality.md
verify/
  SKILL.md
  agents/
    openai.yaml
eng/
  SKILL.md
  agents/
    openai.yaml
  references/
    ablation.md
    architecture-decisions.md
    backend-architecture.md
    backend-quality.md
    database-engineering.md
    debugging.md
reflect/
  SKILL.md
  agents/
    openai.yaml
kimi-code/
  SKILL.md
  agents/
    openai.yaml
  references/
    kimi-code-reference.md
  scripts/
    kimi-code-status.sh
claude-code/
  SKILL.md
  agents/
    openai.yaml
  references/
    claude-code-reference.md
  scripts/
    claude-code-status.sh
codex-cli/
  SKILL.md
  agents/
    openai.yaml
  references/
    codex-cli-reference.md
  scripts/
    codex-cli-status.sh
opencode/
  SKILL.md
  agents/
    openai.yaml
  references/
    opencode-reference.md
  scripts/
    opencode-status.sh
grok-build-cli/
  SKILL.md
  agents/
    openai.yaml
  references/
    grok-build-cli-reference.md
  scripts/
    grok-build-cli-status.sh
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
