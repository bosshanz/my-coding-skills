import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = fs.readdirSync(root).filter(name => fs.existsSync(path.join(root, name, 'SKILL.md'))).sort();
const retired = ['dev', 'clarify', 'qa', 'acceptance'];
function workspace(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-catalog-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function run(kind, args) {
  const command = kind === 'npm' ? process.execPath : 'bash';
  const prefix = kind === 'npm' ? ['bin/skills.mjs', 'add'] : [kind === 'remove' ? 'uninstall.sh' : 'install.sh'];
  const result = spawnSync(command, [...prefix, ...args], { cwd: root, encoding: 'utf8' });
  assert.ifError(result.error);
  return { status: result.status, output: result.stdout + result.stderr };
}
function succeeds(kind, args) {
  const result = run(kind, args);
  assert.equal(result.status, 0, result.output);
  return result.output;
}

test('no selection cannot install or remove anything in a supplied destination', t => {
  const dest = workspace(t);
  fs.writeFileSync(path.join(dest, 'keep.txt'), 'keep');
  for (const kind of ['npm', 'shell', 'remove']) {
    const result = run(kind, ['--dest', dest]);
    assert.notEqual(result.status, 0);
    assert.match(result.output, /choose a skill or group explicitly/i);
    assert.deepEqual(fs.readdirSync(dest), ['keep.txt']);
  }
});

test('both installers copy exactly the optional catalog with bundled resources', t => {
  const base = workspace(t);
  assert.deepEqual(catalog, ['design', 'eng', 'grill-me', 'reflect', 'verify']);
  for (const kind of ['npm', 'shell']) {
    const dest = path.join(base, kind);
    succeeds(kind, ['all', '--dest', dest]);
    assert.deepEqual(fs.readdirSync(dest).sort(), catalog);
    for (const skill of catalog) {
      assert.equal(fs.readFileSync(path.join(dest, skill, 'SKILL.md'), 'utf8'), fs.readFileSync(path.join(root, skill, 'SKILL.md'), 'utf8'));
    }
    assert.ok(fs.existsSync(path.join(dest, 'design/references/animation.md')));
    assert.ok(fs.existsSync(path.join(dest, 'eng/references/software-quality.md')));
    assert.equal(fs.readFileSync(path.join(dest, 'verify/references/scenarios.md'), 'utf8'), fs.readFileSync(path.join(root, 'verify/references/scenarios.md'), 'utf8'));
    const expectedImplicit = { design: true, eng: true, grill: false, reflect: true, verify: false };
    for (const skill of catalog) {
      const fm = YAML.parse(fs.readFileSync(path.join(dest, skill, 'SKILL.md'), 'utf8').match(/^---\n([\s\S]*?)\n---/)[1]);
      assert.ok(typeof fm.when_to_use === 'string' && fm.when_to_use.trim().length > 0, `${skill} missing when_to_use`);
      const agent = YAML.parse(fs.readFileSync(path.join(dest, skill, 'agents/openai.yaml'), 'utf8'));
      const key = skill === 'grill-me' ? 'grill' : skill;
      assert.equal(agent.policy?.allow_implicit_invocation, expectedImplicit[key], `${skill} unexpected implicit policy`);
    }
    assert.ok(!fs.existsSync(path.join(dest, 'references')));
  }
});

test('groups are consistent and optional capabilities require selection', t => {
  const base = workspace(t);
  const groups = { ui: ['design'], quality: ['verify'], engineering: ['eng'], meta: ['reflect'] };
  for (const kind of ['npm', 'shell']) {
    for (const [group, names] of Object.entries(groups)) {
      const dest = path.join(base, kind, group);
      succeeds(kind, [group, '--dest', dest]);
      assert.deepEqual(fs.readdirSync(dest).sort(), [...names].sort());
    }
  }
});

test('grill-me is independently installable and removable without touching reflect', t => {
  const base = workspace(t);
  for (const kind of ['npm', 'shell']) {
    const dest = path.join(base, kind);
    succeeds(kind, ['grill-me', 'reflect', '--dest', dest]);
    assert.deepEqual(fs.readdirSync(dest).sort(), ['grill-me', 'reflect']);
    succeeds('remove', ['grill-me', '--dest', dest]);
    assert.deepEqual(fs.readdirSync(dest), ['reflect']);
    assert.ok(fs.existsSync(path.join(dest, 'reflect/SKILL.md')));
  }
});

test('install rejects retired names without deleting legacy copies; migration is explicit', t => {
  const base = workspace(t);
  for (const skill of [...retired, 'unrelated']) {
    fs.mkdirSync(path.join(base, skill));
    fs.writeFileSync(path.join(base, skill, 'keep.txt'), skill);
  }
  for (const kind of ['npm', 'shell']) {
    for (const name of [...retired, 'workflow', 'planning']) {
      const result = run(kind, [name, '--dest', base, '--force']);
      assert.notEqual(result.status, 0);
      assert.match(result.output, /retired skill or group/i);
    }
  }
  succeeds('shell', ['verify', '--dest', base]);
  for (const skill of retired) assert.equal(fs.readFileSync(path.join(base, skill, 'keep.txt'), 'utf8'), skill);
  succeeds('remove', ['all', '--dest', base, '--dry-run']);
  assert.ok(fs.existsSync(path.join(base, 'verify/SKILL.md')));
  succeeds('remove', ['quality', '--dest', base]);
  for (const skill of ['verify', 'qa', 'acceptance']) assert.ok(!fs.existsSync(path.join(base, skill)));
  assert.ok(fs.existsSync(path.join(base, 'dev/keep.txt')));
  succeeds('remove', ['workflow', 'planning', '--dest', base]);
  assert.deepEqual(fs.readdirSync(base), ['unrelated']);
  assert.equal(fs.readFileSync(path.join(base, 'unrelated/keep.txt'), 'utf8'), 'unrelated');
});

test('npm installer refuses protected and symlinked roots before writes', t => {
  const base = workspace(t);
  const link = path.join(base, 'root-link');
  fs.symlinkSync('/', link);
  for (const dest of ['/', '/usr', link]) {
    const result = run('npm', ['design', '--dest', dest, '--force', '--dry-run']);
    assert.notEqual(result.status, 0);
    assert.match(result.output, /refusing to operate/);
  }
  for (const args of [['design', '--dry-run', '--dest'], ['design', '--dest', '--dry-run', '--dry-run']]) {
    const result = run('npm', args);
    assert.notEqual(result.status, 0);
    assert.match(result.output, /requires a value/);
  }
  const result = run('npm', ['design', '--dest', base, '--target', 'all']);
  assert.notEqual(result.status, 0);
  assert.deepEqual(fs.readdirSync(base), ['root-link']);
});

test('removed external-cli names are rejected on install and remain uninstallable leftovers', t => {
  const dest = workspace(t);
  for (const kind of ['npm', 'shell']) {
    for (const name of ['external-cli', 'adapters', 'claude-code']) {
      const result = run(kind, [name, '--dest', dest]);
      assert.notEqual(result.status, 0);
      assert.match(result.output, /removed skill or group/i);
    }
  }
  for (const [cmd, args] of [[process.execPath, ['bin/skills.mjs', '--help']], ['bash', ['install.sh', '--help']]]) {
    const help = spawnSync(cmd, args, { cwd: root, encoding: 'utf8' });
    assert.equal(help.status, 0);
    for (const removedName of ['external-cli', 'delegation', 'adapters', ...retired]) {
      assert.doesNotMatch(help.stdout, new RegExp(`(?:skills add|install\\.sh)\\s+${removedName}\\b`));
    }
  }
  assert.deepEqual(fs.readdirSync(dest), []);
  for (const name of ['external-cli', 'claude-code']) {
    fs.mkdirSync(path.join(dest, name));
    fs.writeFileSync(path.join(dest, name, 'keep.txt'), 'legacy');
  }
  succeeds('remove', ['adapters', '--dest', dest]);
  assert.ok(!fs.existsSync(path.join(dest, 'external-cli')));
  assert.ok(!fs.existsSync(path.join(dest, 'claude-code')));
});

test('references are packaged and readable without a development Skill', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  for (const skill of catalog) assert.ok(pkg.files.includes(skill));
  assert.ok(!pkg.files.includes('references'));
  assert.ok(pkg.files.includes('uninstall.sh'));
  for (const skill of retired) assert.ok(!pkg.files.includes(skill));
  const result = spawnSync(process.execPath, ['bin/skills.mjs', 'references'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  for (const file of fs.readdirSync(path.join(root, 'eng/references'))) {
    assert.ok(result.stdout.includes(path.join(root, 'eng/references', file)));
  }
});
