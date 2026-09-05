#!/usr/bin/env node
// L3 e2e routing smoke: ask real headless CLIs which of their discoverable
// skills they would invoke for a set of discriminative user messages.
//
// Unlike evals/routing (which tests the descriptions through one neutral
// classifier), this exercises a real harness with its own discovery and
// system prompt. Output is advisory by default; pass --strict to fail on
// mismatch. Requires the target CLIs to be installed and authenticated.
//
// Usage:
//   node evals/e2e/smoke.mjs [--quick] [--cli claude,codex,kimi] [--strict]

import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const execFileAsync = promisify(execFile);

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const QUICK = flag('quick');
const STRICT = flag('strict');
const CLI_ARG = args.find((a, i) => args[i - 1] === '--cli');
const CLIS = (CLI_ARG ?? 'claude').split(',');

// The most routing-sensitive fixtures: the historical qa mis-trigger shape,
// the dev/qa boundary, and one explicit opt-in per workflow skill.
const FIXTURE_IDS = QUICK
  ? ['none-look-at-skill', 'dev-bare-e2e']
  : [
      'none-look-at-skill',
      'dev-bare-e2e',
      'qa-explicit-dollar',
      'acc-gonogo',
      'clarify-whether-build',
      'design-interaction-redesign',
      'adapter-kimi',
    ];

const fixtures = YAML.parse(
  fs.readFileSync(path.join(root, 'evals', 'routing', 'fixtures.yaml'), 'utf8'),
).filter((f) => FIXTURE_IDS.includes(f.id));

const INVOKERS = {
  claude: {
    probe: () => execFileAsync('claude', ['--version']),
    run: (prompt) => {
      const argvPrompt = prompt.startsWith('-') ? `PROMPT:\n${prompt}` : prompt;
      return execFileAsync(
        'claude',
        ['-p', argvPrompt, '--model', 'haiku', '--output-format', 'text'],
        { timeout: 120_000 },
      );
    },
  },
  codex: {
    probe: () => execFileAsync('codex', ['--version']),
    run: (prompt) =>
      execFileAsync(
        'codex',
        ['exec', '--sandbox', 'read-only', prompt],
        { timeout: 180_000 },
      ),
  },
  kimi: {
    probe: () => execFileAsync('kimi', ['--version']),
    run: (prompt) =>
      execFileAsync('kimi', ['-p', prompt], { timeout: 180_000 }),
  },
};

const PROMPT = (userMessage) =>
  `Routing self-report. Consider the skills you can actually discover in this environment (your user-level and project skill directories). If this user message arrived, which skill would you invoke? Answer with only the skill name, or "none". One line, nothing else.

User message: ${userMessage}`;

function normalize(output) {
  const firstLine = output.trim().split('\n')[0] ?? '';
  return firstLine
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, ' ')
    .trim()
    .replace(/^skill\s+/, '');
}

const rows = [];
let mismatches = 0;
let errors = 0;

for (const cli of CLIS) {
  const invoker = INVOKERS[cli];
  if (!invoker) {
    errors += 1;
    console.error(`skip: unknown cli "${cli}"`);
    continue;
  }
  try {
    await invoker.probe();
  } catch {
    errors += 1;
    console.error(`skip: ${cli} not available on PATH`);
    continue;
  }
  for (const f of fixtures) {
    const expected = f.expect.join(',');
    try {
      const { stdout } = await invoker.run(PROMPT(f.prompt));
      const got = normalize(stdout) || 'none';
      const ok = got === expected;
      if (!ok) mismatches += 1;
      rows.push({ cli, id: f.id, expected, got, ok });
      console.log(`  ${ok ? 'ok  ' : 'MISS'} ${cli} ${f.id}: got="${got}" expected="${expected}"`);
    } catch (error) {
      errors += 1;
      rows.push({ cli, id: f.id, expected, got: `error: ${error.message}`, ok: false });
      console.error(`  ERR  ${cli} ${f.id}: ${error.message}`);
    }
  }
}

console.log(`\ne2e smoke: ${rows.filter((r) => r.ok).length}/${rows.length} ok (${mismatches} mismatch, ${errors} errors)`);
console.log(STRICT ? 'strict: mismatches, invocation errors, and empty runs fail' : 'advisory: use --strict to fail on mismatches, errors, or empty runs');

if (STRICT && (mismatches > 0 || errors > 0 || rows.length === 0)) process.exit(1);
