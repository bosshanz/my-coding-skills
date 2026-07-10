# Checkpoint Artifact

## Purpose

Run logs preserve history. Checkpoints preserve understanding.

A checkpoint is a compact snapshot that allows future agents and humans to understand the current loop without reading the entire execution history.

## Template

```markdown
# Checkpoint

## Current Target

## What Changed

## Why It Changed

## Evidence

## Rejected Alternatives

## Not Verified

## Current Risks

## Verifier Version

## Decision
continue | stop | pivot

## Next Experiment

## Rollback Path
```

## Relationship With Other Artifacts

- loop-run-log.md: chronological evidence.
- STATE.md: mutable execution state.
- CHECKPOINT.md: current understanding snapshot.
- Durable docs: knowledge that survives beyond the loop.
