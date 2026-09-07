#!/usr/bin/env node
// Static catalog, reference, and fixture validation. Wording and routing
// behavior belong to evals; these checks do not claim model compliance.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

export function validateRepository(root) {
  const failures = [];
  let checks = 0;
  const check = (condition, message) => {
    checks += 1;
    if (!condition) failures.push(message);
    return condition;
  };
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const parse = (text, label) => {
    try { return YAML.parse(text); }
    catch (error) { check(false, `${label}: ${error.message}`); return null; }
  };
  const nonempty = value => typeof value === 'string' && value.trim().length > 0;
  const skills = fs.readdirSync(root).filter(name => fs.existsSync(path.join(root, name, 'SKILL.md')));

  check(skills.length > 0, 'catalog must contain skills');
  for (const skill of skills) {
    const text = read(`${skill}/SKILL.md`);
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (check(Boolean(fm), `${skill}: missing frontmatter`)) {
      const data = parse(fm[1], skill);
      check(data?.name === skill, `${skill}: frontmatter name must match directory`);
      check(nonempty(data?.description), `${skill}: description must be nonempty`);
      if (data?.when_to_use !== undefined) check(nonempty(data.when_to_use), `${skill}: invalid when_to_use`);
    }
    // Validate referenced paths without tying prose to particular sentences.
    for (const match of text.matchAll(/references\/([\w./-]+\.md)/g)) {
      const target = path.resolve(root, skill, 'references', match[1]);
      check(target.startsWith(path.resolve(root, skill) + path.sep) && fs.existsSync(target),
        `${skill}: missing or out-of-scope reference ${match[0]}`);
    }
    const agentFile = `${skill}/agents/openai.yaml`;
    if (fs.existsSync(path.join(root, agentFile))) {
      const agent = parse(read(agentFile), agentFile);
      for (const key of ['display_name', 'short_description', 'default_prompt']) {
        check(nonempty(agent?.interface?.[key]), `${agentFile}: missing interface.${key}`);
      }
    }
  }

  const treePaths = (text, heading) => {
    const start = text.indexOf(heading);
    const tree = start < 0 ? null : text.slice(start).match(/\x60\x60\x60text\n([\s\S]*?)\x60\x60\x60/);
    if (!check(Boolean(tree), `missing README tree: ${heading}`)) return new Set();
    const parents = [''];
    const paths = new Set();
    for (const line of tree[1].split('\n')) {
      if (!line.trim()) continue;
      const [, indent, name] = line.match(/^(\s*)(\S.*)$/);
      const depth = indent.length / 2;
      if (!check(Number.isInteger(depth) && parents[depth] !== undefined, `invalid README indentation: ${line}`)) continue;
      const entry = parents[depth] + name;
      parents.length = depth + 1;
      if (name.endsWith('/')) parents[depth + 1] = entry;
      else paths.add(entry);
      const target = path.resolve(root, entry);
      check(target.startsWith(path.resolve(root) + path.sep) && fs.existsSync(target), `README lists a missing or out-of-scope path: ${entry}`);
    }
    return paths;
  };
  const trees = [
    ['README.md', '## 目录结构'],
    ['README.en.md', '## Repository Structure'],
  ].map(([file, heading]) => {
    if (!check(fs.existsSync(path.join(root, file)), `missing ${file}`)) return new Set();
    return treePaths(read(file), heading);
  });

  for (const skill of skills) {
    const dir = path.join(root, skill, 'references');
    if (!fs.existsSync(dir)) continue;
    for (const ref of fs.readdirSync(dir).filter(name => name.endsWith('.md'))) {
      const entry = `${skill}/references/${ref}`;
      check(read(`${skill}/SKILL.md`).includes(`references/${ref}`), `${entry}: unreachable from Skill entry`);
      check(trees.every(tree => tree.has(entry)), `${entry}: missing from a README tree`);
    }
  }

  for (const kind of ['routing', 'behavior']) {
    const file = `evals/${kind}/fixtures.yaml`;
    if (!check(fs.existsSync(path.join(root, file)), `missing ${file}`)) continue;
    const fixtures = parse(read(file), file);
    if (!check(Array.isArray(fixtures) && fixtures.length > 0, `${file}: fixtures must be a nonempty list`)) continue;
    const ids = new Set();
    for (const fixture of fixtures) {
      if (!check(fixture && typeof fixture === 'object' && !Array.isArray(fixture), `${file}: fixture must be an object`)) continue;
      const id = `${kind}/${fixture.id}`;
      check(nonempty(fixture.id) && !ids.has(fixture.id), `${id}: missing or duplicate fixture id`);
      ids.add(fixture.id);
      if (kind === 'routing') {
        check(nonempty(fixture.prompt), `${id}: missing prompt`);
        check(typeof fixture.strict === 'boolean', `${id}: strict must be boolean`);
        if (check(Array.isArray(fixture.expect) && fixture.expect.length > 0, `${id}: expect must be a nonempty list`)) {
          check(new Set(fixture.expect).size === fixture.expect.length, `${id}: duplicate expected skill`);
          check(fixture.expect.every(name => name === 'none' || skills.includes(name)), `${id}: unknown expected skill`);
          check(!fixture.expect.includes('none') || fixture.expect.length === 1, `${id}: none cannot be combined with skills`);
        }
      } else {
        check(skills.includes(fixture.skill), `${id}: unknown skill`);
        check(nonempty(fixture.scenario) && nonempty(fixture.user), `${id}: missing scenario or user request`);
        let assertions = 0;
        for (const key of ['must_contain', 'must_not_contain', 'must_match']) {
          const values = fixture[key] ?? [];
          if (!check(Array.isArray(values) && values.every(nonempty), `${id}: invalid ${key}`)) continue;
          assertions += values.length;
          if (key === 'must_match') for (const value of values) {
            try { new RegExp(value, 'i'); }
            catch { check(false, `${id}: invalid regex ${value}`); }
          }
        }
        check(assertions > 0, `${id}: fixture has no assertions`);
      }
    }
  }
  return { checks, failures };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { checks, failures } = validateRepository(root);
  for (const failure of failures) console.error(`fail: ${failure}`);
  console.log(`${checks - failures.length}/${checks} static catalog/reference/fixture checks passed`);
  if (failures.length) process.exitCode = 1;
}
