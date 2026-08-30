#!/usr/bin/env node
// L2 behavior eval: load one SKILL.md as the governing contract and assert on
// the generated output. Assertions are mechanical (substring / regex) over the
// delivery templates - the parts of a skill that are designed to be checkable.
//
// Usage:
//   node evals/behavior/runner.mjs [--dry-run] [--filter substr] [--record]
//   [--backend api|claude]
//
// Backend "api" needs Anthropic credentials; "claude" shells out to an
// authenticated `claude -p` (model haiku by default, opus via --model).

import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Anthropic from '@anthropic-ai/sdk';

const execFileAsync = promisify(execFile);

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const DRY_RUN = flag('dry-run');
const RECORD = flag('record');
const FILTER = value('filter');
const BACKEND = value('backend') ?? 'api';
const MODEL_ALIAS = value('model') ?? 'haiku';

const fixtures = YAML.parse(
  fs.readFileSync(path.join(here, 'fixtures.yaml'), 'utf8'),
);

function loadSkill(name) {
  const file = path.join(root, name, 'SKILL.md');
  if (!fs.existsSync(file)) {
    throw new Error(`unknown skill in fixture: ${name}`);
  }
  return fs.readFileSync(file, 'utf8');
}

function renderUser(f) {
  return [
    'You are executing inside a behavior eval harness. There are no real',
    'files and no tools; answer in text as the loaded Skill contract',
    'dictates. Scenario and request follow.',
    '',
    '```',
    `Scenario: ${f.scenario.trim()}`,
    '```',
    '',
    `User: ${f.user}`,
  ].join('\n');
}

function check(f, output) {
  const failures = [];
  for (const s of f.must_contain ?? []) {
    if (!output.includes(s)) failures.push(`missing substring: ${s}`);
  }
  for (const s of f.must_not_contain ?? []) {
    if (output.includes(s)) failures.push(`forbidden substring present: ${s}`);
  }
  for (const re of f.must_match ?? []) {
    if (!new RegExp(re, 'i').test(output)) {
      failures.push(`regex not matched: ${re}`);
    }
  }
  return failures;
}

async function generate(f) {
  const skillText = loadSkill(f.skill);
  const user = renderUser(f);
  if (BACKEND === 'claude') {
    const text = `${skillText}\n\n---\n\n${user}`;
    // The text starts with the SKILL.md frontmatter "---", which argv
    // parsing would reject as an option; prefix it to stay a positional.
    const argvPrompt = text.startsWith('-') ? `PROMPT:\n${text}` : text;
    const { stdout } = await execFileAsync(
      'claude',
      ['-p', argvPrompt, '--model', MODEL_ALIAS, '--output-format', 'text'],
      { timeout: 180_000, maxBuffer: 10 * 1024 * 1024 },
    );
    return stdout;
  }
  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL_ALIAS === 'opus' ? 'claude-opus-5' : 'claude-haiku-4-5',
    max_tokens: 2048,
    system: skillText,
    messages: [{ role: 'user', content: user }],
  });
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
}

const selected = FILTER ? fixtures.filter((f) => f.id.includes(FILTER)) : fixtures;

if (DRY_RUN) {
  console.log(`fixtures: ${fixtures.length} (${selected.length} selected)`);
  for (const f of selected) console.log(`  ${f.id} -> ${f.skill}`);
  process.exit(0);
}

console.log(
  `behavior eval: ${selected.length} fixtures, backend=${BACKEND}, model=${MODEL_ALIAS}`,
);

const rows = [];
for (const f of selected) {
  let output;
  let failures = [];
  // One retry: template conformance at the cheap tier is occasionally flaky,
  // and a single regeneration absorbs it (mirrors the routing eval's
  // strong-model re-check).
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      output = await generate(f);
    } catch (error) {
      console.error(`fail: ${f.id}: generation failed: ${error.message}`);
      if (error instanceof Anthropic.AuthenticationError) {
        console.error('No usable credentials. Set ANTHROPIC_API_KEY or use --backend claude.');
        process.exit(2);
      }
      throw error;
    }
    failures = check(f, output);
    if (failures.length === 0) break;
    if (attempt === 1) console.log(`  retry ${f.id}`);
  }
  rows.push({ ...f, verdict: failures.length === 0 ? 'PASS' : 'FAIL', failures });
  console.log(
    `  ${failures.length === 0 ? 'pass' : 'FAIL'} ${f.id}${failures.length ? `: ${failures.join('; ')}` : ''}`,
  );
  if (failures.length > 0) {
    console.log(`    output head: ${output.slice(0, 500).replace(/\n/g, ' | ')}`);
  }
}

const failed = rows.filter((r) => r.verdict === 'FAIL');
console.log(`\nsummary: ${rows.length - failed.length}/${rows.length} passed`);

if (RECORD) {
  const resultsDir = path.join(root, 'evals', 'results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
  const file = path.join(resultsDir, `behavior-${stamp}.md`);
  fs.writeFileSync(
    file,
    [
      `# Behavior eval ${stamp}`,
      '',
      `fixtures: ${rows.length} | backend: ${BACKEND} | model: ${MODEL_ALIAS}`,
      '',
      ...rows.map((r) => `- ${r.verdict} ${r.id}${r.failures?.length ? `: ${r.failures.join('; ')}` : ''}`),
      '',
    ].join('\n'),
  );
  console.log(`recorded: ${path.relative(root, file)}`);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} fixture(s) failed: ${failed.map((r) => r.id).join(', ')}`);
  process.exit(1);
}
console.log('\nbehavior eval passed');
