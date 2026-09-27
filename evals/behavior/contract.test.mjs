import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  checkBehaviorOutput, loadBehaviorContext, renderBehaviorUser,
  validateBehaviorFixture,
} from './contract.mjs';

const verdictFixture = { expected_verdict: 'rejected' };

test('verdict checks require one exact first nonempty line', () => {
  assert.deepEqual(checkBehaviorOutput(verdictFixture, '\n rejected \n缺少必需数据库证据。'), []);
  for (const output of [
    'accepted。不应 rejected；必需数据库检查未运行，仍可验收。',
    'accepted\n不应 rejected；必需数据库检查未运行，仍可验收。',
    '不应 rejected；必需数据库检查未运行。',
    'rejected。\n缺少证据。',
    'rejected\n缺少证据。\naccepted',
    'rejected\n缺少证据。\nrejected',
  ]) assert.notDeepEqual(checkBehaviorOutput(verdictFixture, output), [], output);
  assert.match(checkBehaviorOutput(verdictFixture, 'accepted\n必需检查未运行。').join(' '), /wrong verdict/);
  assert.match(checkBehaviorOutput(verdictFixture, 'rejected\n理由。\nrejected').join(' '), /repeated/);
});

test('legacy fixture retains existing input and substring checking', () => {
  const fixture = { scenario: '  Context.  ', user: 'Review.', must_contain: ['证据'] };
  assert.equal(renderBehaviorUser(fixture), [
    'You are executing inside a behavior eval harness. There are no real',
    'files and no tools; answer in text as the loaded Skill contract',
    'dictates. Scenario and request follow.', '', '```', 'Scenario: Context.', '```', '',
    'User: Review.',
  ].join('\n'));
  assert.deepEqual(checkBehaviorOutput(fixture, '已核对证据。'), []);
  assert.match(checkBehaviorOutput(fixture, '没有资料。').join(' '), /missing substring/);
  const prompted = renderBehaviorUser({ ...fixture, expected_verdict: 'rejected' });
  assert.match(prompted, /first nonempty line/);
  assert.doesNotMatch(prompted, /expected_verdict/);
});

function sampleRepo(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'behavior-contract-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const skillDir = path.join(root, 'sample');
  fs.mkdirSync(path.join(skillDir, 'references'), { recursive: true });
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), 'ENTRY_ONLY');
  fs.writeFileSync(path.join(skillDir, 'references', 'scenarios.md'), 'EXPLICIT_REFERENCE');
  fs.writeFileSync(path.join(root, 'outside.md'), 'OUTSIDE_REFERENCE');
  const fixture = {
    id: 'sample', skill: 'sample', scenario: 'Scenario', user: 'Request',
    must_contain: ['signal'],
  };
  return { root, skillDir, fixture };
}

test('only explicit references enter the loaded contract', t => {
  const { root, fixture } = sampleRepo(t);
  assert.equal(loadBehaviorContext(fixture, root), 'ENTRY_ONLY');
  const withReference = { ...fixture, references: ['references/scenarios.md'] };
  assert.match(loadBehaviorContext(withReference, root), /ENTRY_ONLY[\s\S]*EXPLICIT_REFERENCE/);
  assert.deepEqual(validateBehaviorFixture(withReference, root, ['sample']), []);
});

test('fixture validation rejects malformed fields, verdicts, and reference paths', t => {
  const { root, skillDir, fixture } = sampleRepo(t);
  fs.symlinkSync(path.join(root, 'outside.md'), path.join(skillDir, 'references', 'outside.md'));
  const invalid = [
    [{ ...fixture, expected_verdict: 'pass' }, /invalid expected_verdict/],
    [{ ...fixture, unexpected: true }, /unknown field/],
    [{ ...fixture, references: 'references/scenarios.md' }, /invalid references/],
    [{ ...fixture, references: ['/etc/passwd'] }, /invalid reference path/],
    [{ ...fixture, references: ['../outside.md'] }, /invalid reference path/],
    [{ ...fixture, references: ['references/missing.md'] }, /reference missing/],
    [{ ...fixture, references: ['references'] }, /not a file/],
    [{ ...fixture, references: ['references/outside.md'] }, /reference escapes skill/],
    [{ ...fixture, references: ['references/scenarios.md', 'references/scenarios.md'] }, /duplicate references/],
  ];
  for (const [candidate, pattern] of invalid) {
    assert.match(validateBehaviorFixture(candidate, root, ['sample']).join(' '), pattern);
    assert.throws(() => loadBehaviorContext(candidate, root), pattern);
  }
});
