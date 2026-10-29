#!/usr/bin/env node
// Install Codex custom agent roles and the global orchestration section.
// Usage: node codex/subagents/install.mjs [--dry-run] [--codex-home <dir>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const HEADING = '## 全局子智能体编排';
export const ROLES = ['worker'];
const REQUIRED = ['name', 'description', 'developer_instructions', 'model', 'model_reasoning_effort'];

async function parseToml(text, file) {
  try {
    const { parse } = await import('smol-toml');
    return parse(text);
  } catch (error) {
    if (error?.code !== 'ERR_MODULE_NOT_FOUND') throw new Error(`${file}: ${error.message}`);
  }
  // Fallback when node_modules is absent: Python 3.11+ tomllib.
  const py = spawnSync('python3', ['-c', 'import sys,json,tomllib;print(json.dumps(tomllib.loads(sys.stdin.read())))'], { input: text, encoding: 'utf8' });
  if (py.status !== 0) throw new Error(`${file}: cannot validate TOML (${(py.stderr || py.error?.message || '').trim()})`);
  return JSON.parse(py.stdout);
}

export async function validateRole(file) {
  const data = await parseToml(fs.readFileSync(file, 'utf8'), file);
  for (const key of REQUIRED) {
    if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${file}: missing ${key}`);
  }
  if (data.name !== path.basename(file, '.toml')) throw new Error(`${file}: name must match file name`);
  return data;
}

// Replace only the managed section (heading through the next level-1/2 heading), else append.
export function upsertSection(previous, snippet) {
  const block = snippet.trimEnd();
  const lines = previous.split('\n');
  const starts = lines.flatMap((line, i) => (line.trimEnd() === HEADING ? [i] : []));
  if (starts.length > 1) throw new Error(`duplicate "${HEADING}" sections; reconcile AGENTS.md first`);
  if (!starts.length) {
    if (!previous.trim()) return `${block}\n`;
    return `${previous.replace(/\n*$/, '')}\n\n${block}\n`;
  }
  const start = starts[0];
  let end = lines.findIndex((line, i) => i > start && /^#{1,2} /.test(line));
  if (end === -1) end = lines.length;
  const before = lines.slice(0, start).join('\n');
  const after = lines.slice(end).join('\n');
  return `${before}${before ? '\n' : ''}${block}\n${after ? `\n${after}` : ''}`.replace(/\n*$/, '\n');
}

export async function install({ codexHome, dryRun = false, log = console.log }) {
  const home = path.resolve(codexHome || process.env.CODEX_HOME || path.join(os.homedir(), '.codex'));
  const plan = [];
  for (const role of ROLES) {
    const src = path.join(here, 'agents', `${role}.toml`);
    await validateRole(src);
    const dest = path.join(home, 'agents', `${role}.toml`);
    const next = fs.readFileSync(src, 'utf8');
    const prev = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null;
    if (prev !== next) plan.push({ dest, prev, next });
  }
  // Retire previous roles and the legacy Luna filename after backing them up.
  for (const filename of ['sol_worker.toml', 'sol-worker.toml', 'sol_deep_worker.toml', 'sol-deep-worker.toml', 'luna-worker.toml', 'luna_worker.toml']) {
    const retired = path.join(home, 'agents', filename);
    if (fs.existsSync(retired)) plan.push({ dest: retired, prev: fs.readFileSync(retired, 'utf8'), next: null });
  }
  const agentsMd = path.join(home, 'AGENTS.md');
  const prevMd = fs.existsSync(agentsMd) ? fs.readFileSync(agentsMd, 'utf8') : null;
  const nextMd = upsertSection(prevMd ?? '', fs.readFileSync(path.join(here, 'AGENTS.snippet.md'), 'utf8'));
  if (prevMd !== nextMd) plan.push({ dest: agentsMd, prev: prevMd, next: nextMd });

  if (!plan.length) { log(`unchanged ${home}`); return { home, changed: [] }; }
  for (const item of plan) log(`${dryRun ? 'would ' : ''}${item.next === null ? 'remove' : item.prev === null ? 'create' : 'update'} ${item.dest}`);
  if (dryRun) return { home, changed: plan.map(p => p.dest) };

  // Back up every existing file we touch, plus config.toml (never modified) for easy rollback.
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(home, 'backups', `subagents-${stamp}`);
  const toBackup = [...plan.filter(p => p.prev !== null).map(p => p.dest), path.join(home, 'config.toml')].filter(f => fs.existsSync(f));
  for (const file of toBackup) {
    const target = path.join(backupDir, path.relative(home, file));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL);
  }
  if (toBackup.length) log(`backup ${backupDir}`);
  for (const item of plan) {
    if (item.next === null) { fs.unlinkSync(item.dest); continue; }
    fs.mkdirSync(path.dirname(item.dest), { recursive: true });
    const tmp = `${item.dest}.tmp-${process.pid}`;
    fs.writeFileSync(tmp, item.next);
    fs.renameSync(tmp, item.dest);
  }
  for (const role of ROLES) await validateRole(path.join(home, 'agents', `${role}.toml`));
  log(`installed Codex subagents -> ${home}`);
  return { home, changed: plan.map(p => p.dest), backupDir };
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--codex-home');
  const unknown = args.filter((a, j) => a !== '--dry-run' && a !== '--codex-home' && !(i !== -1 && j === i + 1));
  if (unknown.length || (i !== -1 && !args[i + 1])) {
    console.error('usage: node codex/subagents/install.mjs [--dry-run] [--codex-home <dir>]');
    process.exit(2);
  }
  install({ dryRun: args.includes('--dry-run'), codexHome: i === -1 ? undefined : args[i + 1] })
    .catch(error => { console.error(`install: ${error.message}`); process.exitCode = 1; });
}
