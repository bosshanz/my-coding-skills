# Rules / Skills / Taste 三层模型

借鉴 Command Code 的《Taste vs Skills vs Rules》(2026-04, Ahmad Awais),用三层框架审计本仓库,并补齐缺位的那一层。

核心洞察(Command Code 原文):Rules 告诉 agent 什么不要做,Skills 告诉 agent 要做什么,Taste 告诉 agent "你"是怎么做的。Skills 提升 capability,Taste 提升 alignment;没有 taste 的 skill 是"别人更快的代码"。

## 一、审计:本仓库 10 个 skill 的层归属

| Skill | 层 | 说明 |
| --- | --- | --- |
| dev | Skills | 默认 dispatcher;内含 Rules 碎片(evidence gate:"Never say done without evidence") |
| design | Skills | 按需介入的 UI 工作流 |
| clarify / qa / acceptance | Skills | opt-in 工作流;"仅显式触发"是路由纪律,属于 Rules |
| kimi-code / claude-code / codex-cli / opencode / grok-build-cli | Skills | 外部 agent 调度;"不得替换、不得模拟、失败即明说"是 Rules |

### 审计发现

1. **Rules 层曾无家可归**:仓库没有 CLAUDE.md,六条核心原则只活在 README(给人看)和各 skill 正文(按需加载)里,没有任何 always-on 的 agent 可见面。→ 已建根级 `CLAUDE.md` 承接(本仓库开发场景);消费方项目是否注入,留给 `reflect` 后续决策。
2. **路由纪律散落三处**:evals/routing/prompt.md 的规则、各 skill 的 Admission 段、README 原则,内容重叠但无单一源。→ CLAUDE.md 收口为 Rules 单一源;evals prompt 保持独立(它是被测行为的规约,不是规则本体)。
3. **Taste 层缺通用回路**(路由除外:fixtures 纪律——"真实误触发当场进 fixtures 并注明 source"——已是路由专属的 Observe→fixture 回路):偏好只存在于作者脑中,skill 文档靠人肉回忆维护,此之外的通用偏好层没有反哺:偏好只存在于作者脑中,skill 文档靠人肉回忆维护。

## 二、Taste 回路(显式版)

Command Code 的 taste-1 是隐式自动学习(accept/reject/edit → 自动生成 taste.md)。我们不偷它的机制,偷它的回路,但保持本仓库价值观:**显式、可审计、跨 harness**。

```
Observe  真实会话中出现修正信号:拒绝、改写、重述、显式纠正
Extract  提炼成一条候选偏好(一句话,可证伪)
Learn    征询确认后落盘:个人偏好 → CLAUDE.md `## Taste`;通用流程缺陷 → 对应 SKILL.md 修订
Apply    下次会话 CLAUDE.md 自动加载;skill 变更走正常 PR + 测试
Verify   npm test + eval:routing 防回归
```

落点:第 11 个 skill `reflect` 已落地——触发显式(点名,或用户说出持久性纠正),每条信号提炼一行、确认后入库;与 taste-1 的差异是刻意的,写入由人逐条把关,库本身是版本化的文本。

## 三、Frontmatter 扩展:偷什么、不偷什么

Claude Code 在 agentskills.io 标准之上支持扩展字段,其他 harness 会安全忽略:

| 字段 | 决定 | 理由 |
| --- | --- | --- |
| `when_to_use` | **偷** | 触发短语与 description 分离,正好对齐 L1 routing eval 测的"描述区分度";listing 拼接上限 1536 字符 |
| `argument-hint` | **偷** | 零风险的 autocomplete 提示 |
| `disable-model-invocation` | **不偷** | 本库 10 个 skill 都依赖模型按描述路由,包括 adapter 的"点名才触发" |
| `allowed-tools` | **不偷** | 预授权会削弱调用方的权限控制,与"可审计"原则冲突 |
| `` !`cmd` `` 动态注入 / `$ARGUMENTS` | **暂不偷** | 非 Claude harness 会收到字面量,与"可移植"的核心身份冲突;等有 Claude-only 变体再议 |
