# Interaction Design

Interaction design defines how a person understands a system, acts on it, receives feedback, stays in control, and recovers. First prove that users are willing to complete the behavior, then optimize the experience of completing it. First prove the product creates value, then discuss how that value should be packaged. Motion can clarify an interaction, but it cannot repair a broken task flow, misleading state, or missing recovery path.

## When To Use

Load this reference for product UI and stateful experiences: workflows, forms, editors, dashboards, admin tools, onboarding, search and filtering, multi-step tasks, async operations, permissions, destructive actions, interruption and resume, or AI-assisted work.

Do not load it for a purely decorative visual change with settled behavior. Resolve material uncertainty about the user or job before inventing an interaction. A requested business diagnosis is a check of existing behavior; it does not by itself authorize redesign.

## Start From The Real Interaction

Inspect the existing UI, code, routes, state ownership, persistence, and backend effects before redesigning an established flow. A page list or screenshot shows surfaces, not behavior. Trace what happens from the user's trigger through pending work, persistence, completion, failure, and return.

Separate four facts:

- **User intent**: the outcome the person is trying to achieve.
- **User action**: what the interface lets the person do.
- **System effect**: what actually changes in local state, server state, external systems, or other users' views.
- **Visible state**: what the interface claims happened.

These must agree. A success toast without a completed effect, a disabled button without an explanation, or a retry that duplicates work is an interaction defect even when the UI looks polished.

## Interaction Direction

Before drawing screens, make a short interaction commitment:

- **User and context**: role, expertise, device, frequency, time pressure, and collaboration context when relevant.
- **Job and proof of completion**: what the user came to accomplish and what observable state proves success.
- **Risk and constraints**: latency, permissions, irreversibility, money, privacy, shared state, offline behavior, or expensive computation.
- **Interaction thesis**: one sentence describing the intended experience and its key tradeoff.

Example shape:

> A frequent expert operator can inspect, act, and recover without leaving the keyboard; high-impact changes stay previewable and explicit.

Do not make personas or journey maps by default. Create only the artifact that changes the design decision.

## Objects, Actions, And Information Architecture

Model the interface in the user's language:

- Identify the primary objects, their meaningful statuses, and the actions users believe they can take.
- Give each important status one authoritative meaning. Do not let a badge, button, backend job, and detail page disagree about whether work is pending, complete, failed, or stale.
- Separate navigation from actions, selection from activation, and draft changes from committed effects.
- Make the primary action obvious without making every secondary action permanently prominent. Use progressive disclosure when it reduces decision load without hiding needed capability.
- Preserve stable object identity across list, detail, modal, history, and notification surfaces so users can tell what changed.
- Match information hierarchy to decision order: show what is needed to choose before what is useful only after choosing.

For dense or expert tools, optimize repeated work, comparison, scanning, and keyboard continuity. For infrequent or high-consequence work, favor explanation, preview, and safe reversal over raw speed.

## Task Flow

Design the flow from entry to a verifiable outcome:

1. Name the entry conditions and what context the user already has.
2. Draw the shortest coherent happy path.
3. Add only branches caused by real decisions, permissions, missing data, or system outcomes.
4. Define where the user can go back, cancel, save a draft, leave, or resume.
5. Define the completion state and the next sensible action.

For branching or multi-step work, use a compact wireflow or flowchart. Do not confuse screens with steps: one screen can contain several meaningful states, and a single task can cross routes, background jobs, notifications, and restored sessions.

Challenge every step:

- Does this collect information the system already knows?
- Is confirmation preventing a real costly mistake, or compensating for an unclear action?
- Can a strong default remove a decision without removing control?
- Does moving to another screen preserve enough context to return confidently?
- Can frequent users act directly while new users still discover the capability?

## State And Transition Contract

For each critical interaction, define behavior rather than only component appearance. Use a state table when transitions matter:

| Current state | User or system event | Immediate feedback | Actual effect | Next visible state | Escape or recovery |
| --- | --- | --- | --- | --- | --- |
| Ready | User starts action | Control acknowledges input | Request begins once | Pending with context preserved | Cancel when safe |
| Pending | Request succeeds | Result is associated with the action | Effect is committed | Complete with next action | Undo if supported |
| Pending | Request fails | Specific failure and safe action | No duplicate effect | Recoverable error | Retry, edit, or leave safely |

Use only applicable states, but consider initial, loading, empty, ready, edited, validating, pending, partially complete, complete, failed, stale, conflicted, offline, cancelled, and permission-limited behavior.

Key rules:

- Acknowledge input immediately and keep enough context visible to explain what is pending.
- Use optimistic UI only when the effect is likely, reversible, and cheap to reconcile. Make rollback visible when optimism fails.
- Prevent accidental duplicate submission. A retry must either reuse a safe operation identity or clearly start a new operation.
- Distinguish validation failure, permission denial, network failure, system failure, conflict, and partial success when they require different recovery.
- Make cancellation semantics explicit: whether it stops future work, preserves completed work, rolls back, or merely detaches the view.
- Treat partial success truthfully. Do not collapse it into either generic success or generic failure.
- Make completion durable enough that refresh, back navigation, or another surface does not immediately contradict it.

## Feedback, Control, And Recovery

Every important action needs an understandable loop:

- **Feedforward** before action: label, consequence, requirements, scope, and cost when material.
- **Acknowledgement** at the trigger: visible pressed, selected, accepted, queued, or validation state.
- **Progress** during work: real stage or bounded status when available, not theatrical activity that implies knowledge the system does not have.
- **Outcome** after work: what changed, what did not, and the next available action.
- **Recovery** when the outcome is not complete: a safe, specific action that matches the failure.

Prefer prevention plus recovery over repeated confirmation dialogs. Confirm uncommon, destructive, externally visible, expensive, or hard-to-reverse effects with concrete object and consequence language. Prefer undo for frequent reversible actions.

Preserve user work across validation errors, failed submissions, authentication detours, route changes, interruption, and restart when the product can do so safely. Preserve relevant text, attachments, selections, filters, sort, scroll or cursor position, expanded context, and partial artifacts. Never turn recovery into “start over” merely because it is simpler to implement.

Disabled controls must not become unexplained dead ends. When the missing prerequisite matters, explain it near the control and provide the safe next action.

## Input Model And Ergonomics

Choose input behavior from context rather than desktop or mobile habit:

- Support the primary device and the actual frequency of use.
- Keep keyboard order, focus movement, focus restoration, shortcuts, pointer targets, touch gestures, and screen-reader semantics coherent.
- Let shortcuts accelerate visible actions; do not make them the only way to discover essential capability.
- Keep high-frequency navigation and commands immediate. Avoid animation that delays expert operation.
- Provide non-drag alternatives for ordering or movement when precision, accessibility, or device constraints make drag unreliable.
- On responsive layouts, preserve task state and action meaning; do not merely stack the desktop layout or hide essential controls.
- Keep selection visible across actions, and distinguish single selection, multi-selection, and active item behavior.

Use `quality.md` for the detailed accessibility and frontend implementation gates. Use `animation.md` only after the interaction behavior is correct.

## AI-Native Interaction

When AI participates in understanding, generating, deciding, or acting, design the control loop rather than attaching a chat box:

- Show what the system understood when ambiguity could materially change the outcome, and ask for clarification only when it changes the action.
- Distinguish user intent, system proposal, approved action, execution progress, and result. Do not visually collapse them into one “AI is working” state.
- Preview and scope high-impact actions before execution. Approval should name the concrete effect, target, and boundary.
- Expose real Runtime or tool state when available. Never fabricate progress, certainty, completion, or recoverability.
- Let users steer, pause, cancel, take over, edit, retry, or resume where the underlying system can honor those controls.
- Preserve prompts, drafts, attachments, generated artifacts, checkpoints, and completed sub-results through interruption and failure.
- Make partial artifacts inspectable and editable instead of coupling all value to one terminal success state.
- Explain failures in terms of what was preserved, what may have changed, and which retry is safe. Avoid duplicate external effects.
- Keep provenance and boundaries visible when users must review, trust, or attribute generated output.

Not every AI interaction needs confirmation or a visible plan. Scale control to consequence, ambiguity, reversibility, and user expertise.

## Interaction Critique

Before coding and again against the working UI, try to disprove the interaction:

- **Comprehension**: Can the user tell where they are, what is selected, what is happening, and what will happen next?
- **Efficiency**: Is the common path direct? Are repeated decisions or context switches avoidable?
- **Control**: Can the user safely go back, cancel, undo, edit, or take over?
- **Continuity**: What survives refresh, navigation, interruption, failure, session rotation, or device-size changes?
- **Truthfulness**: Does visible state match the authoritative Runtime, persistence, permission, and external effect?
- **Recovery**: Does each meaningful failure offer a safe next action without losing unrelated work?
- **Ergonomics**: Are focus, target size, reach, keyboard flow, and high-frequency behavior appropriate for the real context?

Rank findings by task impact: blocked or misleading outcomes first, lost work and unsafe effects next, avoidable effort and ambiguity after that, polish last.

## Verification

Use the smallest representative scenario set that can falsify the design. Depending on the interaction, include the happy path plus the most consequential variants: first use, returning use, empty data, permission-limited use, slow response, failure, partial success, cancellation, retry, interruption and resume, stale or conflicting state, and keyboard-only operation.

Verify observable behavior through the strongest available evidence:

- Walk the real UI when available; inspect screenshots only for visual evidence.
- Check DOM semantics, focus, URL and history behavior, persisted state, Runtime state, network effects, and logs when those boundaries matter.
- Use component tests for local behavior, integration tests for cross-state transitions, and end-to-end checks for critical journeys.
- Confirm that retries, cancellation, undo, and recovery produce the intended real effect, not merely the expected copy or animation.
- State what was not exercised. A clean build or a beautiful screenshot is not interaction acceptance.

## Proportional Deliverables

Do not produce every artifact for every task. Use the smallest set that removes ambiguity:

- Interaction thesis for any meaningful interaction decision.
- Wireflow for multi-step or branching tasks.
- State-transition table for async, interruptible, permissioned, or high-consequence behavior.
- Behavior contract for critical controls and system effects.
- Representative acceptance scenarios for implementation and verification.
- Known evidence gaps when behavior could not be exercised.
