#!/usr/bin/env node
// Render adapters/contract.md with adapters/adapters.yaml and keep the marked
// sections of the five adapter SKILL.md files in sync.
//
//   node scripts/sync-adapters.mjs --check   verify committed files are in sync (CI)
//   node scripts/sync-adapters.mjs --write   rewrite the marked sections
//
// Sections outside the markers (frontmatter, First Steps, Invocation, ...) are
// hand-written per CLI and never touched.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const MODE = process.argv.includes('--check') ? 'check' : 'write';

const contract = fs.readFileSync(path.join(root, 'adapters', 'contract.md'), 'utf8');
const config = YAML.parse(
  fs.readFileSync(path.join(root, 'adapters', 'adapters.yaml'), 'utf8'),
);

const BLOCKS = ['head', 'recursion'];

function template(block) {
  const open = `<!-- adapter-shared:${block} -->`;
  const close = `<!-- /adapter-shared:${block} -->`;
  const i = contract.indexOf(open);
  const j = contract.indexOf(close);
  if (i === -1 || j === -1) {
    throw new Error(`contract.md is missing markers for block "${block}"`);
  }
  return contract.slice(i + open.length, j).trim();
}

function render(text, vars) {
  const rendered = text
    .replaceAll('{{display}}', vars.display)
    .replaceAll('{{short}}', vars.short)
    .replaceAll('{{aliases}}', vars.aliases);
  if (rendered.includes('{{')) {
    throw new Error(`unknown template token left after render: ${rendered.match(/\{\{\w+\}\}/)?.[0]}`);
  }
  return rendered;
}

function replaceBlock(text, block, body) {
  const open = `<!-- adapter-shared:${block} -->`;
  const close = `<!-- /adapter-shared:${block} -->`;
  const i = text.indexOf(open);
  const j = text.indexOf(close);
  if (i === -1 || j === -1 || j < i) {
    throw new Error(`SKILL.md is missing markers for block "${block}"`);
  }
  return `${text.slice(0, i + open.length)}\n${body}\n${text.slice(j)}`;
}

const outOfSync = [];

for (const [skill, vars] of Object.entries(config)) {
  const file = path.join(root, skill, 'SKILL.md');
  let text = fs.readFileSync(file, 'utf8');
  for (const block of BLOCKS) {
    const rendered = render(template(block), vars);
    const updated = replaceBlock(text, block, rendered);
    if (updated !== text) {
      outOfSync.push(`${skill}/SKILL.md (${block})`);
      text = updated;
    }
  }
  if (MODE === 'write') {
    fs.writeFileSync(file, text);
  }
}

if (outOfSync.length > 0) {
  console.error(`out of sync: ${outOfSync.join(', ')}`);
  if (MODE === 'check') {
    console.error('run `npm run adapters:sync` and commit the result');
    process.exit(1);
  }
  console.log('rewrote marked sections');
} else {
  console.log(`adapter contract in sync across ${Object.keys(config).length} skills`);
}
