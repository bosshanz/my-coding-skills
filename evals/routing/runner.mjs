#!/usr/bin/env node
// Catalog routing proxy; not host discovery. Default: description-only,
// first-pass scoring. --surface extended adds when_to_use explicitly.
// --recheck adds a diagnostic strong-model attempt without replacing failures.

import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import Anthropic from '@anthropic-ai/sdk';
import { frontmatter, renderCatalog, parseVerdict, normalize } from '../lib/contracts.mjs';

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
const RECHECK = flag('recheck') && !flag('cheap-only');
const SURFACE = value('surface') ?? 'description';
const FILTER = value('filter');
// Backend "api" calls the Anthropic API (needs credentials). Backend "claude"
// shells out to an authenticated `claude -p`, so a machine with only a Claude
// Code login can still run the eval.
const BACKEND = value('backend') ?? 'api';
if (!['api', 'claude'].includes(BACKEND)) throw new Error('unknown backend');

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
      return frontmatter(text);
    });
}

const catalog = loadCatalog();
const catalogNames = new Set(catalog.map((s) => s.name));
const catalogText = renderCatalog(catalog, SURFACE);

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

const selected = FILTER ? fixtures.filter((f) => f.id.includes(FILTER)) : fixtures;
if (!selected.length) throw new Error('no fixtures selected');
for (const f of selected) if (f.phase && !['intake', 'delivery'].includes(f.phase)) throw new Error('invalid fixture phase');

// --- prompt --------------------------------------------------------------

const template = fs.readFileSync(path.join(here, 'prompt.md'), 'utf8');
const renderPrompt = (f) => template
  .replaceAll('{{catalog}}', catalogText)
  .replaceAll('{{surface}}', SURFACE)
  .replaceAll('{{phase}}', f.phase ?? 'intake')
  .replaceAll('{{context}}', f.context ?? 'New user request; no active delivery.')
  .replaceAll('{{prompt}}', f.prompt);
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
  return parseVerdict(text, catalogNames);
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
  return parseVerdict(stdout, catalogNames);
}

const classify = (userMessage, model) =>
  BACKEND === 'claude'
    ? classifyViaClaude(userMessage, model)
    : classifyViaApi(userMessage, model);

// --- dry run -------------------------------------------------------------

if (DRY_RUN) {
  console.log(`catalog: ${catalog.length} skills`);
  console.log(`fixtures: ${fixtures.length} (${selected.length} selected)`);
  const sample = renderPrompt(selected[0]);
  console.log(`rendered prompt: ${sample.length} chars`);
  console.log('--- sample head ---');
  console.log(sample.slice(0, 600));
  process.exit(0);
}

// --- run -----------------------------------------------------------------

console.log(
  `routing eval: ${selected.length} fixtures, backend=${BACKEND}, cheap=${CHEAP_MODEL}${RECHECK ? `, diagnostic=${STRONG_MODEL}` : ''}, surface=${SURFACE}`,
);

const rows = [];
for (const f of selected) {
  let cheap;
  try {
    cheap = await classify(f, CHEAP_MODEL);
  } catch (error) {
    rows.push({ ...f, cheap: 'ERROR', strong: '-', verdict: 'ERROR', error: error.message });
    console.error(`error ${f.id}: ${error.message}`);
    continue;
  }
  const cheapKey = normalize(cheap);
  if (cheapKey === expectedKey(f)) {
    rows.push({ ...f, cheap: cheapKey, strong: '-', verdict: 'PASS', raw: cheap.raw });
    console.log(`  pass ${f.id}`);
    continue;
  }

  let strong = null;
  if (RECHECK) {
    try { strong = await classify(f, STRONG_MODEL); }
    catch (error) { strong = { parseError: true, raw: `diagnostic error: ${error.message}` }; }
  }
  const strongKey = strong ? normalize(strong) : '-';
  const verdict = f.strict === false ? 'WARN' : 'FAIL';
  rows.push({ ...f, cheap: cheapKey, strong: strongKey, verdict, raw: cheap.raw, diagnosticRaw: strong?.raw });
  console.log(`  ${verdict.toLowerCase()} ${f.id}: first=${cheapKey} diagnostic=${strongKey} expected=${expectedKey(f)}`);
}

// --- report --------------------------------------------------------------

const counts = rows.reduce((acc, r) => {
  acc[r.verdict] = (acc[r.verdict] ?? 0) + 1;
  return acc;
}, {});

console.log('\nsummary:');
for (const verdict of ['PASS', 'WARN', 'FAIL', 'ERROR']) {
  if (counts[verdict]) console.log(`  ${verdict}: ${counts[verdict]}`);
}

if (RECORD) {
  const resultsDir = path.join(root, 'evals', 'results');
  fs.mkdirSync(resultsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(resultsDir, `routing-${stamp}.md`);
  const lines = [
    `# Routing eval ${stamp}`,
    '',
    `fixtures: ${rows.length} | backend: ${BACKEND} | surface: ${SURFACE} | first: ${CHEAP_MODEL} | diagnostic: ${RECHECK ? STRONG_MODEL : "disabled"}`,
    '',
    '| id | expect | cheap | strong | verdict |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map(
      (r) => `| ${r.id} | ${expectedKey(r)} | ${r.cheap} | ${r.strong} | ${r.verdict} |`,
    ),
    '',
  ];
  fs.writeFileSync(file, lines.join('\n'));
  fs.writeFileSync(file.replace(/\.md$/, '.json'), JSON.stringify({ surface: SURFACE, backend: BACKEND, rows }, null, 2));
  console.log(`recorded: ${path.relative(root, file)}`);
}

const hardFailures = rows.filter((r) => r.verdict === 'FAIL' || r.verdict === 'ERROR');
if (hardFailures.length > 0) {
  console.error(
    `\n${hardFailures.length} hard failure(s): ${hardFailures.map((r) => r.id).join(', ')}`,
  );
  process.exit(1);
}
console.log('\nrouting eval passed');
