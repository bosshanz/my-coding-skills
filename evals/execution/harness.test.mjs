import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { prepare, verify } from './harness.mjs';
import { frontmatter, renderCatalog, parseVerdict, normalize, firstPass } from '../lib/contracts.mjs';

test('catalog surfaces expose only selected metadata and preserve multiline YAML', () => {
  const skill = frontmatter('---\nname: example\ndescription: >-\n  Perform scoped\n  work.\nwhen_to_use: "EXTRA"\n---\n');
  assert.equal(renderCatalog([skill], 'description'), '- example: Perform scoped work.');
  assert.match(renderCatalog([skill], 'extended'), /EXTRA/);
  assert.throws(() => renderCatalog([skill], 'imagined-host'));
});
test('invalid routing responses cannot pass a none fixture', () => {
  const names = new Set(['verify']);
  for (const text of ['garbage', '{}', '{"triggers":[],"none":false}', '{"triggers":["unknown"],"none":false}', '{"triggers":["verify"],"none":true}']) {
    assert.equal(normalize(parseVerdict(text, names)), 'INVALID');
  }
  assert.equal(normalize(parseVerdict('{"triggers":[],"none":true}', names)), 'none');
});
test('diagnostic recovery never replaces first-pass failure', () => {
  assert.equal(firstPass([{ failures: ['paused'] }, { failures: [] }]), false);
  assert.equal(firstPass([{ failures: [] }]), true);
});
test('execution checks reject missing work, test weakening, and read-only edits', () => {
  const run = prepare();
  try {
    assert.ok(verify(run).every(r => r.verdict === 'FAIL')); // Missing responses are never success.
    for (const id of ['implement', 'review-only', 'continue']) fs.writeFileSync(path.join(run, `${id}.response.txt`), 'evaluation response');
    assert.equal(verify(run)[0].verdict, 'FAIL'); // Saying done does not implement.
    fs.writeFileSync(path.join(run, 'implement/test.cjs'), 'console.log("pass");');
    assert.equal(verify(run)[0].verdict, 'FAIL'); // Weak tests cannot hide the bug.
    const fixed = 'exports.listUsers = (users, role) => role === undefined ? users : users.filter(u => u.role === role);\n';
    for (const id of ['implement', 'continue']) fs.writeFileSync(path.join(run, `${id}/src/users.cjs`), fixed);
    assert.ok(verify(run).every(r => r.verdict === 'PASS'));
    fs.appendFileSync(path.join(run, 'review-only/README.md'), 'out of scope');
    assert.match(verify(run)[1].failures.join(' '), /out-of-scope/);
    fs.writeFileSync(path.join(run, 'implement/extra.txt'), 'unexpected');
    assert.match(verify(run)[0].failures.join(' '), /out-of-scope/);
  } finally { fs.rmSync(run, { recursive: true, force: true }); }
});

test('execution baseline does not inject a library Skill', () => {
  const run = prepare();
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(run, 'manifest.json'), 'utf8'));
    assert.equal(manifest.variant, 'host-no-injected-skill');
    for (const item of manifest.cases) {
      assert.ok(!fs.existsSync(path.join(run, item.id, '.skills')));
      assert.ok(!fs.existsSync(path.join(run, item.id, '.agents/skills')));
      assert.doesNotMatch(fs.readFileSync(path.join(run, `${item.id}.task.txt`), 'utf8'), /SKILL\.md/);
    }
  } finally { fs.rmSync(run, { recursive: true, force: true }); }
});
