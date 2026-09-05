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

Current reports preserve first-pass failures. Routing `--recheck` is diagnostic;
response `--attempts` records every attempt without replacing the first result.
`--record` writes a Markdown summary and raw JSON. Old reports retain their old
scoring and are not a baseline for the new scoring contract.

Execution evaluations use `npm run eval:execution -- --prepare`, authorized
agent dispatch, then `--verify <run-dir>`. Keep raw responses and append-only
`attempts.jsonl` with the run. A curated execution summary should identify the
host/model knowledge, skill hash, artifact outcomes, manual conversation
observations, and limitations. See `docs/workflow.md`.
