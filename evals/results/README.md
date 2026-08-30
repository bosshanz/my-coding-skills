# Eval Results

Runners write timestamped reports here with `--record`:

```bash
npm run eval:routing -- --record
npm run eval:behavior -- --record
```

The nightly GitHub workflow (`.github/workflows/evals.yml`) uploads this
directory as an artifact instead of committing. Commit a report only when it
documents a decision (for example, the run that justified a description
change); otherwise leave reports untracked noise-free by deleting them.

When a real session mis-triggers a skill, add a fixture to
`evals/routing/fixtures.yaml` in the same session - the fixture file is the
telemetry.
