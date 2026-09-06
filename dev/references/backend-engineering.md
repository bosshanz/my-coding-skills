# Backend Change Routing

Use for a server-side behavior change when the affected boundary is not yet clear. Identify the caller, changed effect or contract, and the invariant at risk from the closest existing implementation. This is an intake aid, not a separate design or verification stage.

Load only the reference that owns the changed behavior; if that owner is already clear from `dev`, go directly there:

| Changed responsibility | Reference |
| --- | --- |
| Behavior inside existing handlers, services, jobs, or integrations: authority, validation, errors, retries, bounds, compatibility, or lifecycle | `backend-quality.md` |
| Component or service boundaries, cache/queue topology, cross-component consistency, reliability targets, observability strategy, or rollout | `backend-architecture.md` |
| Schema, queries, constraints, transactions, migrations, retention, or live database operations | `database-engineering.md` |

A handler calling an unchanged repository does not by itself require database guidance. A query fix does not by itself require architecture guidance. Load a second reference only when the change crosses into its responsibility; do not traverse the table as a checklist.

Verification and final delivery follow `dev/SKILL.md`. These references add domain-specific evidence requirements, not extra reports or approval stages. Existing project security rules and authorization still apply to sensitive operations.
