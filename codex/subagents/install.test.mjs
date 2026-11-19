import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parse } from 'smol-toml';
import { HEADING, ROLES } from './install.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const snippet = fs.readFileSync(path.join(here, 'AGENTS.snippet.md'), 'utf8');
const histories = JSON.parse(fs.readFileSync(path.join(here, 'AGENTS.legacy.json'), 'utf8'));
const legacy = histories[0].content;
const expected = {
  worker: ['gpt-6.1-terra', 'xhigh'],
};
function home(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-home-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function run(codexHome, ...args) {
  const r = spawnSync(process.execPath, [path.join(here, 'install.mjs'), ...args], { encoding: 'utf8', env: { ...process.env, CODEX_HOME: codexHome } });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  return r.stdout;
}

test('role TOML files parse with required fields and confirmed models', () => {
  assert.deepEqual(fs.readdirSync(path.join(here, 'agents')).sort(), ROLES.map(r => `${r}.toml`).sort());
  for (const role of ROLES) {
    const data = parse(fs.readFileSync(path.join(here, 'agents', `${role}.toml`), 'utf8'));
    for (const key of ['name', 'description', 'developer_instructions']) assert.ok(data[key]?.trim(), `${role}.${key}`);
    assert.equal(data.name, role);
    assert.deepEqual([data.model, data.model_reasoning_effort], expected[role]);
    assert.match(data.developer_instructions, /不扩大任务范围/);
    assert.match(data.developer_instructions, /不再委派/);
    assert.match(data.developer_instructions, /独占/);
  }
});

test('snippet defers model choice to TOML and README matches TOML', () => {
  const readme = fs.readFileSync(path.join(here, 'README.md'), 'utf8');
  const [model, effort] = expected.worker;
  const data = parse(fs.readFileSync(path.join(here, 'agents', 'worker.toml'), 'utf8'));
  assert.deepEqual([data.model, data.model_reasoning_effort], [model, effort]);
  assert.doesNotMatch(snippet, /gpt-[\w.-]+/i);
  assert.doesNotMatch(snippet, /\b(?:minimal|low|medium|high|xhigh)\b/);
  for (const m of readme.match(/gpt-[\w.-]*\w/gi) ?? []) assert.equal(m, model);
  assert.match(snippet, /worker\.toml/);
});

test('snippet keeps its heading without HTML markers', () => {
  assert.ok(snippet.startsWith(`${HEADING}\n`));
  assert.doesNotMatch(snippet, /<!--/);
});

test('dry run writes nothing; install is idempotent and leaves config.toml alone', t => {
  const dir = home(t);
  fs.writeFileSync(path.join(dir, 'config.toml'), 'model = "keep"\nmodel_reasoning_effort = "low"\n');
  assert.match(run(dir, '--dry-run'), /would create/);
  assert.deepEqual(fs.readdirSync(dir), ['config.toml']);
  run(dir);
  for (const role of ROLES) assert.equal(fs.readFileSync(path.join(dir, 'agents', `${role}.toml`), 'utf8'), fs.readFileSync(path.join(here, 'agents', `${role}.toml`), 'utf8'));
  assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), snippet.trimEnd() + '\n');
  assert.equal(fs.readFileSync(path.join(dir, 'config.toml'), 'utf8'), 'model = "keep"\nmodel_reasoning_effort = "low"\n');
  const snapshot = fs.readdirSync(dir).sort();
  assert.match(run(dir), /unchanged/);
  assert.deepEqual(fs.readdirSync(dir).sort(), snapshot);
});

test('replaces only the managed section, preserves other content, and backs up', t => {
  const dir = home(t);
  fs.mkdirSync(path.join(dir, 'agents'));
  fs.writeFileSync(path.join(dir, 'agents', 'worker.toml'), 'name = "worker"\n');
  fs.writeFileSync(path.join(dir, 'agents', 'other.toml'), 'name = "other"\n');
  const original = `# 我的规则\n\n前言\n\n${legacy}\n\n## 其他\n\n- 保留\n`;
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), original);
  run(dir);
  const md = fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8');
  assert.equal(md, `# 我的规则\n\n前言\n\n${snippet.trimEnd()}\n\n## 其他\n\n- 保留\n`);
  assert.equal(md.split(HEADING).length, 2);
  assert.equal(fs.readFileSync(path.join(dir, 'agents', 'other.toml'), 'utf8'), 'name = "other"\n');
  const [backup] = fs.readdirSync(path.join(dir, 'backups'));
  assert.equal(fs.readFileSync(path.join(dir, 'backups', backup, 'AGENTS.md'), 'utf8'), original);
  assert.equal(fs.readFileSync(path.join(dir, 'backups', backup, 'agents', 'worker.toml'), 'utf8'), 'name = "worker"\n');
  assert.match(run(dir), /unchanged/);
  assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), md);
});

test('appends the section after existing content', t => {
  const dir = home(t);
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), '# 规则\n\n- 已有\n');
  run(dir);
  assert.equal(fs.readFileSync(path.join(dir, 'AGENTS.md'), 'utf8'), `# 规则\n\n- 已有\n\n${snippet.trimEnd()}\n`);
});

test('upgrades legacy headings and preserves managed block boundaries', t => {
  const dir = home(t);
  const file = path.join(dir, 'AGENTS.md');
  fs.writeFileSync(file, `<!-- my-coding-skills:global-rules:start -->\n# 规则\n\n${legacy}\n<!-- my-coding-skills:global-rules:end -->\n`);
  run(dir);
  assert.equal(fs.readFileSync(file, 'utf8'), `<!-- my-coding-skills:global-rules:start -->\n# 规则\n\n${snippet.trimEnd()}\n\n<!-- my-coding-skills:global-rules:end -->\n`);
  assert.match(run(dir), /unchanged/);
});

test('preserves appended custom text and refuses altered sections', t => {
  const dir = home(t);
  const file = path.join(dir, 'AGENTS.md');
  const custom = '\n\n### 我的补充\n\n- 自定义内容\n';
  fs.writeFileSync(file, snippet.trimEnd() + custom);
  run(dir);
  assert.equal(fs.readFileSync(file, 'utf8'), snippet.trimEnd() + custom);
  const altered = `${HEADING}\n\n- 自定义规则\n`;
  fs.writeFileSync(file, altered);
  const result = spawnSync(process.execPath, [path.join(here, 'install.mjs'), '--codex-home', dir], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unrecognized content/);
  assert.equal(fs.readFileSync(file, 'utf8'), altered);
});

test('refuses a shadowing AGENTS.override.md without changing files', t => {
  const dir = home(t);
  fs.writeFileSync(path.join(dir, 'AGENTS.override.md'), 'custom override');
  const result = spawnSync(process.execPath, [path.join(here, 'install.mjs'), '--codex-home', dir], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /would shadow AGENTS.md/);
  assert.deepEqual(fs.readdirSync(dir), ['AGENTS.override.md']);
});

test('migrates each published legacy section while preserving appended custom text', t => {
  for (const { source, content } of histories) {
    const dir = path.join(home(t), source);
    fs.mkdirSync(dir);
    const file = path.join(dir, 'AGENTS.md');
    const extra = '\n\n### 自定义\n保留\n';
    fs.writeFileSync(file, content + extra);
    run(dir);
    assert.equal(fs.readFileSync(file, 'utf8'), snippet.trimEnd() + extra, source);
    assert.match(run(dir), /unchanged/);
  }
});

test('preserves permissions when updating rules and role files', t => {
  const dir = home(t);
  fs.mkdirSync(path.join(dir, 'agents'));
  const rules = path.join(dir, 'AGENTS.md');
  const role = path.join(dir, 'agents', 'worker.toml');
  fs.writeFileSync(rules, legacy + '\n', { mode: 0o600 });
  fs.writeFileSync(role, 'name = "worker"\n', { mode: 0o640 });
  run(dir);
  assert.equal(fs.statSync(rules).mode & 0o777, 0o600);
  assert.equal(fs.statSync(role).mode & 0o777, 0o640);
});

test('refuses symlinked rules and role files without modifying their targets', t => {
  for (const relative of ['AGENTS.md', 'agents/worker.toml']) {
    const dir = home(t);
    const target = path.join(dir, 'external');
    fs.writeFileSync(target, 'original');
    fs.mkdirSync(path.dirname(path.join(dir, relative)), { recursive: true });
    fs.symlinkSync(target, path.join(dir, relative));
    const result = spawnSync(process.execPath, [path.join(here, 'install.mjs'), '--codex-home', dir], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.equal(fs.readFileSync(target, 'utf8'), 'original');
    assert.equal(fs.lstatSync(path.join(dir, relative)).isSymbolicLink(), true);
  }
});

for (const filename of ['sol_worker.toml', 'sol-worker.toml', 'sol_deep_worker.toml', 'sol-deep-worker.toml', 'luna-worker.toml', 'luna_worker.toml']) test(`upgrade backs up and removes ${filename}; dry-run preserves it`, t => {
  const dir = home(t);
  fs.mkdirSync(path.join(dir, 'agents'));
  const retired = path.join(dir, 'agents', filename);
  const original = 'name = "sol_deep_worker"\n# local customization\n';
  fs.writeFileSync(retired, original);
  assert.match(run(dir, '--dry-run'), /would remove/);
  assert.equal(fs.readFileSync(retired, 'utf8'), original);
  assert.equal(fs.existsSync(path.join(dir, 'backups')), false);
  run(dir);
  assert.equal(fs.existsSync(retired), false);
  const [backup] = fs.readdirSync(path.join(dir, 'backups'));
  assert.equal(fs.readFileSync(path.join(dir, 'backups', backup, 'agents', filename), 'utf8'), original);
  assert.match(run(dir), /unchanged/);
});
