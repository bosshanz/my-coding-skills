# Delegation Safety Policy

## Invocation Integrity

- Actually invoke the selected target agent through an available CLI, tool, script, or API.
- Never simulate, impersonate, or fabricate target-agent output.
- Do not claim that a target agent reviewed, implemented, or verified something unless the invocation occurred.
- Preserve target output separately from caller interpretation.

## Permissions

- Use the narrowest permissions that fit the delegated task.
- Prefer read-only modes for research and review.
- Allow writes only for explicitly scoped implementation tasks.
- Do not enable dangerous bypass, yolo, or unrestricted modes by default.
- Do not expose external-agent execution to untrusted prompts, repositories, or public input without isolation.

## Credentials And Sensitive Data

- Never ask for or print tokens, API keys, credential files, or authentication secrets.
- Do not copy secrets into delegation prompts or output records.
- If the target requires missing authentication, report the requirement and stop.

## Recursion And Duplication

- Keep delegation depth to one hop by default.
- Do not ask a delegated agent to delegate another coding agent unless the user explicitly requests orchestration.
- Do not start duplicate agents on the same scope when one is already active.
- For explicitly requested same-agent child processes, include a no-further-delegation instruction.

## Failure And Fallback

- Report unavailable targets, authentication failures, permission failures, timeouts, non-zero exits, and unusable output explicitly.
- Do not silently fall back to another agent.
- Do not fill gaps in failed output by pretending the target provided findings.
- Ask the user before substituting a different target or completing the task directly when the original request required delegation.
