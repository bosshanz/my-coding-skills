import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const begin = '<!-- my-coding-skills:global-rules:start -->';
const end = '<!-- my-coding-skills:global-rules:end -->';

function install(directory, dryRun) {
  if (!directory || !['0', '1'].includes(dryRun)) throw new Error('expected destination directory and dry-run flag');
  const destination = path.resolve(directory);
  // Resolve the existing ancestor, including symlinks, before creating anything.
  let ancestor = destination;
  const missing = [];
  while (!fs.existsSync(ancestor)) {
    if (fs.lstatSync(ancestor, { throwIfNoEntry: false })) throw new Error('dangling destination symlink');
    missing.unshift(path.basename(ancestor));
    ancestor = path.dirname(ancestor);
  }
  const physical = path.join(fs.realpathSync(ancestor), ...missing);
  if (!fs.statSync(ancestor).isDirectory() || physical === path.parse(physical).root || path.dirname(physical) === path.parse(physical).root) {
    throw new Error('refusing a filesystem root, system path, or non-directory destination');
  }
  const target = path.join(physical, 'AGENTS.md');
  const override = path.join(physical, 'AGENTS.override.md');
  const overrideStat = fs.lstatSync(override, { throwIfNoEntry: false });
  if (overrideStat && (!overrideStat.isFile() || fs.readFileSync(override, 'utf8').trim())) {
    throw new Error(`active or non-regular ${override} would shadow AGENTS.md; reconcile it first`);
  }
  const stat = fs.lstatSync(target, { throwIfNoEntry: false });
  if (stat && !stat.isFile()) throw new Error('refusing a symlink or non-regular AGENTS.md');
  const previous = stat ? fs.readFileSync(target, 'utf8') : '';
  const template = fs.readFileSync(path.join(root, 'templates/AGENTS.md'), 'utf8').trimEnd();
  const block = `${begin}\n${template}\n${end}`;
  const starts = previous.split(begin).length - 1;
  const ends = previous.split(end).length - 1;
  if (starts !== ends || starts > 1 || (starts && previous.indexOf(end) < previous.indexOf(begin))) {
    throw new Error('malformed or duplicate managed block; refusing to alter existing rules');
  }
  const next = starts
    ? previous.slice(0, previous.indexOf(begin)) + block + previous.slice(previous.indexOf(end) + end.length)
    : previous + (previous ? (previous.endsWith('\n') ? '\n' : '\n\n') : '') + block + '\n';
  if (next === previous) { console.log(`unchanged ${target}`); return; }
  if (dryRun === '1') {
    console.log(`would ${stat ? 'back up and update' : 'create'} ${target}\n${block}`);
    return;
  }
  fs.mkdirSync(physical, { recursive: true });
  const temporary = path.join(physical, `.AGENTS.md.${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, next, { flag: 'wx', mode: stat ? stat.mode & 0o777 : 0o600 });
    if (stat) fs.chmodSync(temporary, stat.mode & 0o777);
    // Do not overwrite a file changed since the read above.
    const current = fs.lstatSync(target, { throwIfNoEntry: false });
    if (Boolean(current) !== Boolean(stat) || (current && (!current.isFile() || current.ino !== stat.ino || fs.readFileSync(target, 'utf8') !== previous))) {
      throw new Error('AGENTS.md changed during installation; retry after inspecting it');
    }
    if (stat) {
      const backup = `${target}.bak.${randomUUID()}`;
      fs.copyFileSync(target, backup, fs.constants.COPYFILE_EXCL);
      console.log(`backup ${backup}`);
    }
    fs.renameSync(temporary, target);
    console.log(`installed global rules -> ${target}`);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

try { install(process.argv[2], process.argv[3]); }
catch (error) { console.error(`install: ${error.message}`); process.exitCode = 1; }
