# Loop Engineering v2 Architecture

```text
User Request
    ↓
Progressive Admission
    ├─ Clear bounded task ─────────────> dev
    ├─ Material ambiguity ─────────────> explicit clarify
    ├─ Stronger go/no-go separation ───> acceptance
    └─ Persistent / repeated feedback ─> governed Loop
                                              ↓
                                  Human Constitutional Authority
                                              ↓
                                      Loop Contract + Policy
                                              ↓
                           Discovery / Delivery / Evaluation Loop
                                              ↓
                              Agent Execution + Verifier Governance
                                              ↓
                         Acceptance Independence + External Evidence
                                              ↓
                              STATE + CHECKPOINT + Run Log
                                              ↓
                      Continue / Stop / Pivot / Promote Durable Knowledge
```

The architecture separates ordinary delivery from persistent feedback governance:

- `dev` remains the default route for normal requirements and bugs.
- `clarify` is an optional escalation for explicit interviews or material ambiguity.
- `acceptance` can strengthen a bounded task without turning it into a Loop.
- A governed Loop is admitted only when feedback, state, evaluation, or decisions must persist across independent iterations.

Inside an admitted Loop:

- Execution changes the system.
- Verification evaluates evidence.
- The cognitive cycle reviews goals, proxy metrics, and verifier drift.
- Human authority changes the constitution when rules no longer represent reality.
