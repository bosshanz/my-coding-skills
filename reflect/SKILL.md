---
name: reflect
description: "Explicit taste loop: capture durable user corrections and preferences into the always-on layer. Use only on explicit invocation ($reflect) or when the user states a durable, generalizable correction about how the agent works; every write is confirmed line-by-line."
when_to_use: "Use when the user explicitly invokes $reflect or /reflect, or states a durable correction or preference about how the agent works - for example 以后都用 pnpm,别再自动跑格式化,commit messages in Chinese,always show the diff before applying. Do not use for one-off task feedback about the current code (just do the task), product or business rules ($clarify / $qa territory), ordinary requirements, or anything the user did not state as a preference."
argument-hint: "[偏好或纠正 | preference or correction]"
---

# Reflect

## Purpose

Capture what the user teaches into the always-on layer so the next session
starts already knowing it. This is the explicit version of a taste loop:
observe the correction in conversation, extract one falsifiable line, get
confirmation, persist. Never invent, never generalize beyond what was said,
never write silently.

## Admission

Admitted only when at least one holds:

- The user explicitly invokes `$reflect` / `/reflect`.
- The user states a durable correction or preference about how the agent
  works ("from now on", "always", "stop doing X", 以后… / 别再…).

Not admission:

- One-off task feedback about the current code ("rename this variable") -
  just do the task; capture nothing.
- Product or business rules - that is `$clarify` / `$qa` territory.
- Speculation about what the user "probably prefers", including inferring a
  preference from a single edit that may have been situational.

## Select A Track

### Track A: Capture (default)

1. Extract the preference as one line: what to do, scope, and source.
2. Propose the exact entry text and destination. Write only after the user
   confirms. If the user already approved that exact text and destination, write it without asking again. Otherwise keep the entry pending, and identify this Skill and its confirmation rule when asking.
3. Destinations, in order of what exists:
   - This repository (`my-coding-skills`): `AGENTS.md` under `## Taste`,
     one line, newest last:
     `- [YYYY-MM-DD] <preference> (source: <correction>)`
   - A consumer project: its existing always-on instruction file
     (`CLAUDE.md` / `AGENTS.md`), appended inside a short `## Taste`
     section. If none exists or editing it is not clearly acceptable,
     ask where to record. Never create new config files unilaterally.
4. Report the exact line and file written. Default next step: `stop`.

### Track B: Skill defect

If the correction reveals the skill library itself teaches the wrong thing
(a `SKILL.md` contradicts the confirmed preference): name the file and the
contradiction, propose the doc fix, and treat it as a separate ask. Do not
edit skill files inside this pass unless the user explicitly asked.

## Boundaries

- One entry per signal. No bulk rewrites, no reorganizing the target file.
- Every entry is dated and sourced; without a source it does not go in.
- A duplicate of an existing line updates that line in place, never appends
  a second copy.
- Reflect never triggers other skills on its own; `下一步` is `stop` unless
  the user asked for more.

## Delivery Format

```
观察: <what the user said, one line>
提炼: <the entry proposed or written, one line>
落点: <file + section, or 待确认>
状态: written | pending-confirm | defect-proposed | already-recorded
下一步: stop | $dev (only for a confirmed, user-asked skill defect)
```

Keep it short. When nothing durable was said, say so in one line and `stop`.
