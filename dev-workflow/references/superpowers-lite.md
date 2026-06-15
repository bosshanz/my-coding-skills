# Superpowers Lite

## Purpose

Use this reference when `dev-workflow` needs stronger engineering discipline without installing or reenacting the full Superpowers methodology. It extracts the useful core: clarify before coding, lightweight design, executable plans, test-first behavior changes, systematic debugging, review gates, and verification before completion.

This is not a full Superpowers fork. Keep it lightweight and proportional to the task.

## When To Load

Load this reference when any of these are true:

- The task changes product behavior, architecture, data model, API contract, or deployment risk.
- The task is ambiguous, multi-step, or likely to require tradeoffs.
- The user asks for high confidence, TDD, root-cause debugging, review, or careful verification.
- A bug has unclear cause or has already resisted one obvious fix.
- The agent is about to claim completion for work that was not directly verified.

Do not load it for tiny copy edits, one-line config changes, or simple mechanical formatting unless the user asks for stricter process.

## Keep From Superpowers

- Clarify intent before implementation.
- Design enough before coding.
- Prefer YAGNI and the simplest viable approach.
- Make plans executable and reviewable.
- Prefer RED-GREEN-REFACTOR for behavior changes and regressions.
- Debug systematically instead of guessing.
- Review the diff before claiming success.
- Verify with evidence, not confidence language.

## Do Not Import By Default

- Mandatory git worktrees for every task.
- Long spec files for small or medium changes.
- Subagent-per-task workflows.
- Multi-hour autonomous execution without checkpoints.
- Heavy branch finishing rituals.
- Strict TDD punishment loops such as deleting all code written before a test.
- Automatic external-agent dispatch; use `agent-delegation` only when the user or project policy authorizes it.

## Lightweight Workflow

Use this scaled workflow for non-trivial work:

1. Clarify.
   - Restate the target outcome.
   - Ask one high-signal question if multiple implementations would be plausible.
   - Identify constraints, non-goals, and success criteria.
2. Tiny design.
   - Compare 2-3 realistic options, including the simplest viable option.
   - Recommend one option with tradeoffs and risks.
   - For architecture or workflow design, include a small Mermaid diagram when it improves clarity.
3. Executable plan.
   - Break work into small steps that are easy to review.
   - Name files or modules when known.
   - Include the verification plan before editing.
4. Test-first when practical.
   - For bug fixes, reproduce or identify a failing test before changing behavior.
   - For new behavior, add the smallest useful test first when the project supports it.
   - If test-first is impractical, explain why and use the strongest available verification.
5. Implement in small steps.
   - Keep behavior changes separate from mechanical refactors when possible.
   - Prefer existing project patterns over novel abstractions.
   - Stop before broad rewrites unless the task explicitly requires them.
6. Debug systematically.
   - Read the full error, reproduce, compare to known-good paths, form one hypothesis, test it, and fix the root cause.
   - After two failed guesses, pause and re-investigate assumptions instead of continuing random edits.
7. Review gate.
   - Compare the diff to the goal.
   - Check edge cases, compatibility, project conventions, docs impact, and security/reliability risk.
   - Treat warnings, skipped checks, and flaky output as residual risk.
8. Verification gate.
   - Run targeted tests first; broaden only when justified.
   - Verify behavior, not only syntax or type health.
   - Never claim completion without naming what was verified or explicitly stating what remains unverified.
9. Delivery.
   - Separate what changed, why it is correct, what was tested, and what remains risky.
   - Keep delivery notes in Chinese by default while preserving code, commands, and config keys in their original language.

## Tiny Design Template

Use this when the task is more than a trivial edit:

```text
Goal:
Constraints / non-goals:
Options:
  1. ...
  2. ...
  3. ...
Recommended option:
Risks:
Verification plan:
```

## Debugging Loop

```text
Symptom → Reproduction → Evidence → Hypothesis → Experiment → Root cause → Fix → Regression coverage → Verification
```

Rules:

- Do not patch symptoms before proving the cause.
- Prefer one controlled experiment at a time.
- Preserve diagnostic evidence in the final explanation when it matters.
- Add regression coverage when practical; if not, document the manual or functional check used.

## Review Gate Checklist

Before final delivery, answer:

- Does the diff match the user's actual goal?
- Did the implementation avoid unnecessary abstractions?
- Are edge cases, errors, empty states, and permissions handled where relevant?
- Did the change follow local project conventions?
- Is there a test or check that would fail if the behavior regressed?
- Did docs, examples, migrations, or operational notes need updates?
- What was not verified?

## Completion Rule

Do not say “done”, “fixed”, or “complete” unless at least one of these is true:

- A relevant automated test or check passed.
- A meaningful manual verification was performed and described.
- The final answer explicitly states that verification could not be run and explains the remaining risk.

## Source Inspiration

This reference is a localized, lightweight extraction inspired by Superpowers' published methodology: brainstorming/design before coding, explicit plans, TDD discipline, systematic debugging, code review, and verification before completion. Source: https://github.com/obra/superpowers
