import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const template = fs.readFileSync(path.join(root, 'templates/AGENTS.md'), 'utf8').trimEnd();
const begin = '<!-- my-coding-skills:global-rules:start -->';
const end = '<!-- my-coding-skills:global-rules:end -->';
function workspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'global-rules-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function run(dir, ...args) {
  return spawnSync('bash', [path.join(root, 'install.sh'), '--global-rules', '--dest', dir, ...args], { encoding: 'utf8' });
}

test('dry run creates no directory; install uses template and repeat is a no-op', t => {
  const dir = path.join(workspace(t), 'new profile');
  assert.equal(run(dir, '--dry-run').status, 0);
  assert.equal(fs.existsSync(dir), false);
  assert.equal(run(dir).status, 0);
  const file = path.join(dir, 'AGENTS.md');
  assert.equal(fs.readFileSync(file, 'utf8'), `${begin}\n${template}\n${end}\n`);
  const before = fs.statSync(file);
  assert.match(run(dir).stdout, /unchanged/);
  assert.equal(fs.statSync(file).mtimeMs, before.mtimeMs);
  assert.deepEqual(fs.readdirSync(dir), ['AGENTS.md']);
});

test('existing text and permissions survive; backup contains exact prior bytes', t => {
  const dir = workspace(t);
  const file = path.join(dir, 'AGENTS.md');
  const prior = '# Personal rules\r\n保留已有约定';
  fs.writeFileSync(file, prior, { mode: 0o640 });
  assert.equal(run(dir).status, 0);
  assert.ok(fs.readFileSync(file, 'utf8').startsWith(prior + '\n\n'));
  const backups = fs.readdirSync(dir).filter(name => name.startsWith('AGENTS.md.bak.'));
  assert.equal(backups.length, 1);
  assert.equal(fs.readFileSync(path.join(dir, backups[0]), 'utf8'), prior);
  assert.equal(fs.statSync(file).mode & 0o777, 0o640);
});

test('update replaces only the managed block, keeping prefix and suffix', t => {
  const dir = workspace(t);
  const file = path.join(dir, 'AGENTS.md');
  fs.writeFileSync(file, `before\n${begin}\nold rules\n${end}\nafter\n`);
  assert.equal(run(dir).status, 0);
  assert.equal(fs.readFileSync(file, 'utf8'), `before\n${begin}\n${template}\n${end}\nafter\n`);
});

test('malformed blocks and overrides fail without changing rules or creating backups', t => {
  const dir = workspace(t);
  const file = path.join(dir, 'AGENTS.md');
  for (const prior of [begin, end, `${end}\n${begin}`, `${begin}\n${end}\n${begin}\n${end}`]) {
    fs.writeFileSync(file, prior);
    assert.notEqual(run(dir).status, 0);
    assert.equal(fs.readFileSync(file, 'utf8'), prior);
    assert.deepEqual(fs.readdirSync(dir), ['AGENTS.md']);
  }
  fs.writeFileSync(file, 'personal');
  fs.writeFileSync(path.join(dir, 'AGENTS.override.md'), 'active override');
  assert.notEqual(run(dir).status, 0);
  assert.equal(fs.readFileSync(file, 'utf8'), 'personal');
  assert.equal(fs.readdirSync(dir).length, 2);
});

test('symlink destinations, protected roots and mixed modes cannot overwrite content', t => {
  const dir = workspace(t);
  const external = path.join(dir, 'outside.md');
  fs.writeFileSync(external, 'untouched');
  fs.symlinkSync(external, path.join(dir, 'AGENTS.md'));
  assert.notEqual(run(dir).status, 0);
  assert.equal(fs.readFileSync(external, 'utf8'), 'untouched');
  const link = path.join(dir, 'root-link');
  fs.symlinkSync('/', link);
  for (const target of ['/', '/usr', link, path.join(link, 'usr')]) {
    assert.notEqual(run(target, '--dry-run').status, 0);
  }
  for (const args of [['dev'], ['--force'], ['--target', 'all'], ['--target', 'claude']]) {
    assert.notEqual(run(dir, ...args).status, 0);
  }
});
