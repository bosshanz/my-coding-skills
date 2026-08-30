import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const files = {
  qa: read('qa/SKILL.md'),
  qaAgent: read('qa/agents/openai.yaml'),
  dev: read('dev/SKILL.md'),
  clarify: read('clarify/SKILL.md'),
  acceptance: read('acceptance/SKILL.md'),
  readme: read('README.md'),
  readmeEn: read('README.en.md'),
};

const failures = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) failures.push(message);
}

function contains(text, expected, message) {
  check(text.includes(expected), message);
}

function excludes(text, unexpected, message) {
  check(!text.includes(unexpected), message);
}

const qaDescription =
  files.qa.split('\n').find((line) => line.startsWith('description: ')) ?? '';

contains(
  qaDescription,
  'Use only when the user explicitly',
  'qa frontmatter must make admission explicitly opt-in',
);
check(
  !/(看一下|看下这个|look at this skill|look at this usage|a look at how)/i.test(
    qaDescription,
  ),
  'qa frontmatter must not contain broad look/review trigger phrases',
);
contains(
  files.qa,
  'context, not authorization',
  'cross-Skill recommendations must not authorize qa',
);
contains(
  files.qaAgent,
  'Generic look or review requests do not authorize QA',
  'qa agent prompt must reject generic review admission',
);

contains(
  files.dev,
  'Do not auto-invoke or routinely recommend `$qa`',
  'dev must not auto-invoke or routinely recommend qa',
);
contains(
  files.dev,
  'a risk category alone is not enough',
  'dev must not route to qa from a risk category alone',
);
excludes(
  files.dev,
  'If the change encodes a user job or business rule, name `$qa` as the next step',
  'dev acceptance must not mechanically name qa',
);
excludes(
  files.dev,
  'If the bug sat on a user job or business rule, recommend `$qa`',
  'dev bug verification must not mechanically recommend qa',
);

contains(
  files.clarify,
  'Do not route to `$qa` merely because of the evidence type',
  'clarify must describe evidence directly instead of routing by type',
);
contains(
  files.acceptance,
  'Judge the missing evidence directly',
  'acceptance must judge evidence gaps directly',
);
excludes(
  files.acceptance,
  'the next step is `$qa`',
  'acceptance must not make qa the automatic next step',
);

contains(
  files.readme,
  '其他 Skill 的建议也不等于用户授权',
  'Chinese README must document opt-in authorization',
);
contains(
  files.readmeEn,
  "another Skill's recommendation is not user authorization",
  'English README must document opt-in authorization',
);
excludes(
  files.readme,
  '澄清 → 开发 → QA → 验收',
  'Chinese README must not present qa as a standard pipeline stage',
);
excludes(
  files.readmeEn,
  'clarify -> develop -> QA -> accept',
  'English README must not present qa as a standard pipeline stage',
);
excludes(
  files.readmeEn,
  'Send unprotected usage to `$qa`',
  'English README must not mechanically route evidence gaps to qa',
);

const treeBlock = (text, heading) => {
  const start = text.indexOf(heading);
  if (start === -1) return '';
  const fenced = text.slice(start).match(/```text\n([\s\S]*?)```/);
  return fenced ? fenced[1] : '';
};

const treeZh = treeBlock(files.readme, '## 目录结构');
const treeEn = treeBlock(files.readmeEn, '## Repository Structure');
check(treeZh.length > 0, 'Chinese README must contain a directory-structure tree');
check(treeEn.length > 0, 'English README must contain a directory-structure tree');

const treePaths = (tree) => {
  const parents = [''];
  const paths = [];
  for (const line of tree.split('\n')) {
    const match = line.match(/^(\s*)(\S.*)$/);
    if (!match) continue;
    const depth = match[1].length / 2;
    const name = match[2];
    if (name.endsWith('/')) {
      parents[depth + 1] = parents[depth] + name;
    } else {
      paths.push(parents[depth] + name);
    }
  }
  return paths;
};

for (const tree of [treeZh, treeEn]) {
  for (const entry of treePaths(tree)) {
    check(
      fs.existsSync(path.join(root, entry)),
      `README tree lists a missing file: ${entry}`,
    );
  }
}

for (const skill of fs.readdirSync(root)) {
  const skillFile = path.join(root, skill, 'SKILL.md');
  const refDir = path.join(root, skill, 'references');
  if (!fs.existsSync(skillFile) || !fs.existsSync(refDir)) continue;
  for (const ref of fs.readdirSync(refDir)) {
    if (!ref.endsWith('.md')) continue;
    const refPath = `${skill}/references/${ref}`;
    check(
      fs.readFileSync(skillFile, 'utf8').includes(ref),
      `${refPath} must be referenced in ${skill}/SKILL.md`,
    );
    const listed = (tree) =>
      tree.split('\n').some((line) => line.trim() === ref);
    check(
      listed(treeZh) && listed(treeEn),
      `${refPath} must be listed in both README directory trees`,
    );
  }
}

// --- eval fixture sanity (L0, dependency-free) ---

const catalogSkillNames = fs
  .readdirSync(root)
  .filter((n) => fs.existsSync(path.join(root, n, 'SKILL.md')));

const routingFixtures = fs.readFileSync(
  path.join(root, 'evals/routing/fixtures.yaml'),
  'utf8',
);
const behaviorFixtures = fs.readFileSync(
  path.join(root, 'evals/behavior/fixtures.yaml'),
  'utf8',
);
const fixtureIds = (text) =>
  [...text.matchAll(/^- id: (\S+)$/gm)].map((m) => m[1]);

const routingIds = fixtureIds(routingFixtures);
check(routingIds.length >= 30, 'routing fixtures must number at least 30');
check(
  new Set(routingIds).size === routingIds.length,
  'routing fixture ids must be unique',
);
for (const match of routingFixtures.matchAll(/expect: \[([^\]]+)\]/g)) {
  for (const name of match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)) {
    check(
      name === 'none' || catalogSkillNames.includes(name),
      `routing fixture expects unknown skill: ${name}`,
    );
  }
}

const behaviorIds = fixtureIds(behaviorFixtures);
check(
  new Set(behaviorIds).size === behaviorIds.length,
  'behavior fixture ids must be unique',
);
for (const match of behaviorFixtures.matchAll(/^  skill: (\S+)$/gm)) {
  check(
    catalogSkillNames.includes(match[1]),
    `behavior fixture loads unknown skill: ${match[1]}`,
  );
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`fail: ${failure}`);
  console.error(`${failures.length} failed, ${checks - failures.length} passed`);
  process.exit(1);
}

console.log(`${checks} routing policy checks passed`);
