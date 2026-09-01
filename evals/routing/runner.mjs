#!/usr/bin/env node
// L1 routing eval: does the skill catalog route user messages to the right
// skill, judged only from name + description + when_to_use (what a harness sees pre-load)?
//
// This is a proxy, not a harness test: it measures the discriminative power of
// the descriptions, which is the variable this repository controls. The
// remaining gap (real harness trigger chains) is covered by evals/e2e.
//
// Two-level scoring: every fixture runs on the cheap model first; mismatches
// are re-run on the strong model, whose verdict is authoritative for strict
// fixtures. Cheap-only mismatches are reported as soft (real harnesses run
// strong models) and do not fail the run.
//
// Usage:
//   node evals/routing/runner.mjs [--dry-run] [--filter substr] [--record]
//   [--cheap-only]
//
// Credentials: the SDK resolves ANTHROPIC_API_KEY / ANTHROPIC_AUTH_TOKEN /
// `ant auth login` profiles automatically. No key is read or printed here.

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
const CHEAP_ONLY = flag('cheap-only');
const FILTER = value('filter');
// Backend "api" calls the Anthropic API (needs credentials). Backend "claude"
// shells out to an authenticated `claude -p`, so a machine with only a Claude
// Code login can still run the eval.
const BACKEND = value('backend') ?? 'api';

const CHEAP_MODEL = 'claude-haiku-4-5';
const STRONG_MODEL = 'claude-opus-5';

// --- catalog -------------------------------------------------------------

function loadCatalog() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        !e.name.startsWith('.') &&
        e.name !== 'node_modules' &&
        fs.existsSync(path.join(root, e.name, 'SKILL.md')),
    )
    .map((e) => {
      const text = fs.readFileSync(path.join(root, e.name, 'SKILL.md'), 'utf8');
      const m = text.match(/^description:\s*"([\s\S]*?)"\s*$/m);
      const w = text.match(/^when_to_use:\s*"([\s\S]*?)"\s*$/m);
return { name: e.name, description: m ? m[1] : '', whenToUse: w ? w[1] : '' };
    });
}

const catalog = loadCatalog();
const catalogNames = new Set(catalog.map((s) => s.name));

function renderCatalog() {
  return catalog
    .map((s) => `- ${s.name}: ${`${s.description} ${s.whenToUse}`.trim().slice(0, 1536)}`)
    .join('\n');
}

// --- fixtures ------------------------------------------------------------

const fixtures = YAML.parse(
  fs.readFileSync(path.join(here, 'fixtures.yaml'), 'utf8'),
);

if (!Array.isArray(fixtures) || fixtures.length < 30) {
  console.error(`fail: expected at least 30 fixtures, found ${fixtures?.length}`);
  process.exit(1);
}

const seen = new Set();
for (const f of fixtures) {
  if (!f.id || seen.has(f.id)) {
    console.error(`fail: duplicate or missing fixture id near "${f.id}"`);
    process.exit(1);
  }
  seen.add(f.id);
  const bad = (f.expect ?? []).filter(
    (s) => s !== 'none' && !catalogNames.has(s),
  );
  if (bad.length > 0) {
    console.error(`fail: fixture ${f.id} expects unknown skills: ${bad.join(', ')}`);
    process.exit(1);
  }
}

const selected = FILTER
  ? fixtures.filter((f) => f.id.includes(FILTER))
  : fixtures;

// --- prompt --------------------------------------------------------------

const template = fs.readFileSync(path.join(here, 'prompt.md'), 'utf8');
const renderPrompt = (userMessage) =>
  template
    .replaceAll('{{catalog}}', renderCatalog())
    .replaceAll('{{prompt}}', userMessage);

function parseVerdict(text) {
  const stripped = text.replace(/```(?:json)?/g, '');
  const start = stripped.indexOf('{');
  const end = stripped.lastIndexOf('}');
  if (start === -1 || end === -1) return { triggers: [], none: true, raw: text };
  try {
    const parsed = JSON.parse(stripped.slice(start, end + 1));
    const triggers = Array.isArray(parsed.triggers)
      ? parsed.triggers.map((t) => String(t).trim().replace(/^[$/]/, ''))
      : [];
    const none = parsed.none === true || triggers.length === 0;
    return { triggers, none, raw: text };
  } catch {
    return { triggers: [], none: true, raw: text, parseError: true };
  }
}

const normalize = (result) =>
  result.none || result.triggers.length === 0
    ? 'none'
    : [...new Set(result.triggers)].sort().join('+');

const expectedKey = (f) => [...new Set(f.expect)].sort().join('+');

// --- api -----------------------------------------------------------------

let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

async function classifyViaApi(userMessage, model) {
  const params = {
    model,
    max_tokens: 256,
    system:
      'You are a routing classifier. Follow the output contract exactly: one line of JSON, nothing else.',
    messages: [{ role: 'user', content: renderPrompt(userMessage) }],
  };
  if (model === STRONG_MODEL) {
    // Opus 5 runs adaptive thinking by default; low effort is enough here and
    // keeps the re-check pass cheap. Haiku 4.5 rejects output_config.effort.
    params.output_config = { effort: 'low' };
  }
  const response = await getClient().messages.create(params);
  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');
  return parseVerdict(text);
}

async function classifyViaClaude(userMessage, model) {
  const alias = model === CHEAP_MODEL ? 'haiku' : 'opus';
  const prompt = renderPrompt(userMessage);
  // A prompt that starts with "-" (for example a SKILL.md frontmatter
  // delimiter) would be parsed as an option; prefix it to stay a positional.
  const argvPrompt = prompt.startsWith('-') ? `PROMPT:\n${prompt}` : prompt;
  const { stdout } = await execFileAsync(
    'claude',
    ['-p', argvPrompt, '--model', alias, '--output-format', 'text'],
    { timeout: 120_000 },
  );
  return parseVerdict(stdout);
}

const classify = (userMessage, model) =>
  BACKEND === 'claude'
    ? classifyViaClaude(userMessage, model)
    : classifyViaApi(userMessage, model);

// --- dry run -------------------------------------------------------------

if (DRY_RUN) {
  console.log(`catalog: ${catalog.length} skills`);
  console.log(`fixtures: ${fixtures.length} (${selected.length} selected)`);
  const sample = renderPrompt(selected[0].prompt);
  console.log(`rendered prompt: ${sample.length} chars`);
  console.log('--- sample head ---');
  console.log(sample.slice(0, 600));
  process.exit(0);
}

// --- run -----------------------------------------------------------------

console.log(
  `routing eval: ${selected.length} fixtures, backend=${BACKEND}, cheap=${CHEAP_MODEL}${CHEAP_ONLY ? '' : `, strong=${STRONG_MODEL} (re-check only)`}`,
);

const rows = [];
for (const f of selected) {
  let cheap;
  try {
    cheap = await classify(f.prompt, CHEAP_MODEL);
  } catch (error) {
    console.error(`fail: ${f.id}: cheap call failed: ${error.message}`);
    if (error instanceof Anthropic.AuthenticationError) {
      console.error(
        'No usable credentials. Set ANTHROPIC_API_KEY or run `ant auth login`.',
      );
      process.exit(2);
    }
    throw error;
  }
  const cheapKey = normalize(cheap);
  if (cheapKey === expectedKey(f)) {
    rows.push({ ...f, cheap: cheapKey, strong: '-', verdict: 'PASS' });
    console.log(`  pass ${f.id}`);
    continue;
  }

  if (CHEAP_ONLY) {
    rows.push({ ...f, cheap: cheapKey, strong: '-', verdict: 'MISMATCH' });
    console.log(`  mismatch ${f.id}: cheap=${cheapKey} expected=${expectedKey(f)}`);
    continue;
  }

  const strong = await classify(f.prompt, STRONG_MODEL);
  const strongKey = normalize(strong);
  const ok = strongKey === expectedKey(f);
  const verdict = ok
    ? 'SOFT'
    : f.strict === false
      ? 'WARN'
      : 'FAIL';
  rows.push({ ...f, cheap: cheapKey, strong: strongKey, verdict });
  console.log(`  ${verdict.toLowerCase()} ${f.id}: cheap=${cheapKey} strong=${strongKey} expected=${expectedKey(f)}`);
}

// --- report --------------------------------------------------------------

const counts = rows.reduce((acc, r) => {
  acc[r.verdict] = (acc[r.verdict] ?? 0) + 1;
  return acc;
}, {});

console.log('\nsummary:');
for (const verdict of ['PASS', 'SOFT', 'WARN', 'FAIL', 'MISMATCH']) {
  if (counts[verdict]) console.log(`  ${verdict}: ${counts[verdict]}`);
}

if (RECORD) {
  const resultsDir = path.join(root, 'evals', 'results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '');
  const file = path.join(resultsDir, `routing-${stamp}.md`);
  const lines = [
    `# Routing eval ${stamp}`,
    '',
    `fixtures: ${rows.length} | cheap: ${CHEAP_MODEL} | strong: ${STRONG_MODEL}`,
    '',
    '| id | expect | cheap | strong | verdict |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(
      (r) => `| ${r.id} | ${expectedKey(r)} | ${r.cheap} | ${r.strong} | ${r.verdict} |`,
    ),
    '',
  ];
  fs.writeFileSync(file, lines.join('\n'));
  console.log(`recorded: ${path.relative(root, file)}`);
}

const hardFailures = rows.filter((r) => r.verdict === 'FAIL' || r.verdict === 'MISMATCH');
if (hardFailures.length > 0) {
  console.error(
    `\n${hardFailures.length} hard failure(s): ${hardFailures.map((r) => r.id).join(', ')}`,
  );
  process.exit(1);
}
console.log('\nrouting eval passed');
