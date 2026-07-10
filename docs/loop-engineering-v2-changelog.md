# Loop Engineering v2 Change Summary

## Methodology Change

The Loop Engineering layer now treats verifier governance and human cognitive control as first-class concerns.

## Added

- Discovery Loop before Delivery Loop.
- Verifier ownership, calibration, isolation, versioning, and drift review.
- Acceptance independence levels L0-L4.
- `CHECKPOINT.md` as an understanding artifact.
- Multi-loop workspace guidance using `loops/<loop-id>/`.
- Human constitutional authority over goals, constraints, verifier definitions, and irreversible decisions.

## Integrated

- `clarify` now separates discovery from delivery and drafts the verifier.
- `dev` executes bounded increments and updates state, evidence, and checkpoint.
- `acceptance` reports requested and achieved independence and reviews verifier quality.
- `skills-doctor.sh` validates the new references.

## Validation

- Branch is based on `main` and contains only methodology and documentation changes.
- Frontmatter names remain unchanged.
- New reference files are included in doctor checks.
- No installer changes are required because no new top-level Skill was added.

## Residual Work

- The top-level README translations can be refreshed after the conceptual model is accepted, avoiding premature duplication of a still-evolving methodology.
