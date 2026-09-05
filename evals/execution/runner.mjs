#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { prepare, verify } from './harness.mjs';
const [mode, run] = process.argv.slice(2);
if (mode === '--prepare') {
  console.log(prepare());
} else if (mode === '--verify' && run) {
  const rows = verify(path.resolve(run));
  // Append each verification attempt; never overwrite a previous failure.
  fs.appendFileSync(path.join(run, 'attempts.jsonl'), JSON.stringify({ at: new Date().toISOString(), rows }) + '\n');
  console.log(JSON.stringify(rows, null, 2));
  if (rows.some(r => r.verdict !== 'PASS')) process.exitCode = 1;
} else {
  console.error('Usage: node evals/execution/runner.mjs --prepare | --verify <run-dir>');
  process.exitCode = 2;
}
