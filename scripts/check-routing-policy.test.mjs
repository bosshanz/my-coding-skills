import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateRepository } from './check-routing-policy.mjs';

function repository(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (name, content) => {
    const file = path.join(root, name);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, typeof content === 'string' ? content : JSON.stringify(content));
  };
  const skill = body => `---\nname: sample\ndescription: >-\n  An independently worded\n  capability description.\n---\n${body}\n`;
  write('sample/SKILL.md', skill('Consult `references/method.md` when useful.'));
  write('sample/references/method.md', '# Method\n');
  for (const [file, heading] of [['README.md', '目录结构'], ['README.en.md', 'Repository Structure']]) {
    write(file, `## ${heading}\n\n\`\`\`text\nsample/\n  SKILL.md\n  references/\n    method.md\n\`\`\`\n`);
  }
  const routing = { id: 'route', prompt: 'Do the scoped work.', expect: ['sample'], strict: true };
  const behavior = { id: 'reply', skill: 'sample', scenario: 'No edits occurred.', user: 'Review only.', must_not_contain: ['已修改'] };
  write('evals/routing/fixtures.yaml', [routing]);
  write('evals/behavior/fixtures.yaml', [behavior]);
  return { write, skill, routing, behavior, validate: () => validateRepository(root).failures };
}

test('static validation accepts paraphrased workflow prose and multiline metadata', t => {
  const repo = repository(t);
  assert.deepEqual(repo.validate(), []);
  repo.write('sample/SKILL.md', repo.skill('Different prose with `references/method.md`; no delivery headings.'));
  assert.deepEqual(repo.validate(), []);
});

test('static validation detects missing and unreachable references', t => {
  const repo = repository(t);
  repo.write('sample/SKILL.md', repo.skill('Read `references/missing.md`.'));
  const failures = repo.validate().join('\n');
  assert.match(failures, /missing or out-of-scope reference references\/missing.md/);
  assert.match(failures, /method.md: unreachable/);
});

test('static validation rejects identity mismatch and invalid fixture targets', t => {
  const repo = repository(t);
  repo.write('sample/SKILL.md', repo.skill('`references/method.md`').replace('name: sample', 'name: wrong'));
  repo.write('evals/routing/fixtures.yaml', [repo.routing, { ...repo.routing, expect: ['none', 'unknown'] }]);
  repo.write('evals/behavior/fixtures.yaml', [{ ...repo.behavior, skill: 'unknown', must_match: ['['] }]);
  const failures = repo.validate().join('\n');
  for (const expected of [/name must match/, /duplicate fixture id/, /unknown expected skill/, /none cannot be combined/, /unknown skill/, /invalid regex/]) {
    assert.match(failures, expected);
  }
});

test('malformed YAML and empty or malformed assertions cannot pass', t => {
  const repo = repository(t);
  repo.write('evals/routing/fixtures.yaml', '[broken');
  repo.write('evals/behavior/fixtures.yaml', [{ ...repo.behavior, must_not_contain: [], must_match: 'not-an-array' }]);
  const failures = repo.validate().join('\n');
  assert.match(failures, /fixtures must be a nonempty list/);
  assert.match(failures, /invalid must_match/);
  assert.match(failures, /fixture has no assertions/);
});
