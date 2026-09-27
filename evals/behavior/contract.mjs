import fs from 'node:fs';
import path from 'node:path';

export const VERDICTS = ['accepted', 'accepted with risk', 'rejected'];
const VERDICT_LINES = new Set(VERDICTS);
const FIELDS = new Set([
  'id', 'skill', 'scenario', 'user', 'review_notes', 'references',
  'expected_verdict', 'must_contain', 'must_not_contain', 'must_match',
]);
const ASSERTIONS = ['must_contain', 'must_not_contain', 'must_match'];
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const inside = (parent, child) => child.startsWith(`${parent}${path.sep}`);

export function resolveReference(skillDir, reference) {
  if (!nonempty(reference) || path.isAbsolute(reference) || path.win32.isAbsolute(reference)
    || reference.includes('\\') || reference.split('/').some(part => part === '..' || part === '.')) {
    throw new Error(`invalid reference path: ${reference}`);
  }
  const base = fs.realpathSync(skillDir);
  const candidate = path.resolve(base, reference);
  if (!inside(base, candidate)) throw new Error(`reference escapes skill: ${reference}`);
  let real;
  try { real = fs.realpathSync(candidate); }
  catch { throw new Error(`reference missing: ${reference}`); }
  if (!inside(base, real)) throw new Error(`reference escapes skill: ${reference}`);
  if (!fs.statSync(real).isFile()) throw new Error(`reference is not a file: ${reference}`);
  return real;
}

export function validateBehaviorFixture(fixture, root, knownSkills) {
  const errors = [];
  if (!fixture || typeof fixture !== 'object' || Array.isArray(fixture)) return ['fixture must be an object'];
  for (const key of Object.keys(fixture)) if (!FIELDS.has(key)) errors.push(`unknown field: ${key}`);
  for (const key of ['id', 'skill', 'scenario', 'user']) {
    if (!nonempty(fixture[key])) errors.push(`missing or invalid ${key}`);
  }
  if (fixture.review_notes !== undefined && !nonempty(fixture.review_notes)) errors.push('invalid review_notes');
  if (fixture.expected_verdict !== undefined && !VERDICT_LINES.has(fixture.expected_verdict)) {
    errors.push('invalid expected_verdict');
  }
  let assertions = fixture.expected_verdict === undefined ? 0 : 1;
  for (const key of ASSERTIONS) {
    const values = fixture[key] ?? [];
    if (!Array.isArray(values) || !values.every(nonempty)) {
      errors.push(`invalid ${key}`);
      continue;
    }
    assertions += values.length;
    if (key === 'must_match') for (const value of values) {
      try { new RegExp(value, 'i'); }
      catch { errors.push(`invalid regex ${value}`); }
    }
  }
  if (!assertions) errors.push('fixture has no assertions');

  const skill = fixture.skill;
  const skillValid = nonempty(skill) && /^[\w-]+$/.test(skill)
    && (!knownSkills || knownSkills.includes(skill))
    && fs.existsSync(path.join(root, skill, 'SKILL.md'));
  if (!skillValid) errors.push('unknown skill');
  if (fixture.references !== undefined) {
    if (!Array.isArray(fixture.references) || fixture.references.length === 0
      || !fixture.references.every(nonempty)) {
      errors.push('invalid references');
    } else {
      if (new Set(fixture.references).size !== fixture.references.length) errors.push('duplicate references');
      if (skillValid) for (const reference of fixture.references) {
        try { resolveReference(path.join(root, skill), reference); }
        catch (error) { errors.push(error.message); }
      }
    }
  }
  return errors;
}

export function loadBehaviorContext(fixture, root) {
  const errors = validateBehaviorFixture(fixture, root);
  if (errors.length) throw new Error(`${fixture.id ?? 'fixture'}: ${errors.join('; ')}`);
  const skillDir = path.join(root, fixture.skill);
  const sections = [fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8')];
  for (const reference of fixture.references ?? []) {
    sections.push(`Selected reference: ${reference}\n${fs.readFileSync(resolveReference(skillDir, reference), 'utf8')}`);
  }
  return sections.join('\n\n---\n\n');
}

export function renderBehaviorUser(fixture) {
  const lines = [
    'You are executing inside a behavior eval harness. There are no real',
    'files and no tools; answer in text as the loaded Skill contract',
    'dictates. Scenario and request follow.',
    '',
    '```',
    `Scenario: ${fixture.scenario.trim()}`,
    '```',
    '',
    `User: ${fixture.user}`,
  ];
  if (fixture.expected_verdict !== undefined) {
    lines.push('', 'For this evaluation, put exactly one of these verdicts alone on the first nonempty line:',
      'accepted | accepted with risk | rejected',
      'Then explain the decision. Do not repeat a verdict as a standalone line.');
  }
  return lines.join('\n');
}

export function checkBehaviorOutput(fixture, output) {
  const failures = [];
  if (fixture.expected_verdict !== undefined) {
    const lines = output.split(/\r?\n/).map(line => line.trim());
    const first = lines.find(line => line.length > 0);
    if (!VERDICT_LINES.has(first)) failures.push('missing or invalid first-line verdict');
    else if (first !== fixture.expected_verdict) failures.push(`wrong verdict: ${first}`);
    if (lines.filter(line => VERDICT_LINES.has(line)).length > 1) failures.push('repeated standalone verdict');
  }
  for (const value of fixture.must_contain ?? []) {
    if (!output.includes(value)) failures.push(`missing substring: ${value}`);
  }
  for (const value of fixture.must_not_contain ?? []) {
    if (output.includes(value)) failures.push(`forbidden substring present: ${value}`);
  }
  for (const value of fixture.must_match ?? []) {
    if (!new RegExp(value, 'i').test(output)) failures.push(`regex not matched: ${value}`);
  }
  return failures;
}
