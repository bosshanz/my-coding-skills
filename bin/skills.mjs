#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const availableSkills = [
  'design',
  'clarify',
  'dev',
  'acceptance',
  'kimi-code',
  'claude-code',
  'codex-cli',
  'opencode',
];
const groups = new Map([
  ['all', availableSkills],
  ['ui', ['design']],
  ['workflow', ['dev']],
  ['planning', ['clarify']],
  ['delegation', ['kimi-code', 'claude-code', 'codex-cli', 'opencode']],
  ['adapters', ['kimi-code', 'claude-code', 'codex-cli', 'opencode']],
]);

function usage() {
  return `skills - install this repository's portable coding-agent skills

Usage:
  skills list
  skills add <skill|group...> [--target agents|codex|claude|gemini|opencode|all] [--dest <dir>] [--force] [--dry-run]
  skills doctor

Skills:
  ${availableSkills.join('\n  ')}

Groups:
  all          Install every skill
  ui           Install design only
  workflow     Install dev only
  planning     Install clarify only
  delegation   Install all external-agent adapters
  adapters     Install kimi-code, claude-code, codex-cli, and opencode

Targets:
  agents       ${join(homedir(), '.agents', 'skills')}
  codex        ${join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills')}
  claude       ${join(homedir(), '.claude', 'skills')}
  gemini       ${join(homedir(), '.gemini', 'skills')}
  opencode     ${join(homedir(), '.config', 'opencode', 'skills')}
  all          Install to agents, claude, gemini, and opencode target directories

Examples:
  skills add ui --target agents
  skills add dev --target agents
  skills add planning --target agents
  skills add acceptance --target agents
  skills add all --target claude --force
  skills add delegation --target all --force
  skills add dev --dest ./skills --dry-run
`;
}

function parseArgs(argv) {
  const opts = { target: 'codex', dest: null, force: false, dryRun: false };
  const positionals = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--target' || arg === '--runtime') {
      opts.target = argv[++i];
    } else if (arg === '--dest' || arg === '--dir') {
      opts.dest = argv[++i];
    } else if (arg === '--force' || arg === '-f') {
      opts.force = true;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      opts.help = true;
    } else {
      positionals.push(arg);
    }
  }
  return { opts, positionals };
}

function targetDirs(target, dest) {
  if (dest) {
    if (target === 'all') {
      throw new Error('--dest cannot be combined with --target all');
    }
    return [resolve(dest)];
  }
  const codexHome = process.env.CODEX_HOME || join(homedir(), '.codex');
  const targets = {
    agents: join(homedir(), '.agents', 'skills'),
    standard: join(homedir(), '.agents', 'skills'),
    codex: join(codexHome, 'skills'),
    claude: join(homedir(), '.claude', 'skills'),
    gemini: join(homedir(), '.gemini', 'skills'),
    opencode: join(homedir(), '.config', 'opencode', 'skills'),
  };
  if (target === 'all') {
    return [targets.agents, targets.claude, targets.gemini, targets.opencode];
  }
  if (!targets[target]) {
    throw new Error(`unknown target: ${target}`);
  }
  return [targets[target]];
}

function resolveSkills(names) {
  const input = names.length ? names : ['all'];
  const result = [];
  for (const name of input) {
    const expanded = groups.get(name) || [name];
    for (const skill of expanded) {
      if (!availableSkills.includes(skill)) {
        throw new Error(`unknown skill or group: ${name}`);
      }
      if (!result.includes(skill)) {
        result.push(skill);
      }
    }
  }
  return result;
}

function assertPackagedSkill(skill) {
  const src = join(root, skill);
  if (!existsSync(join(src, 'SKILL.md'))) {
    throw new Error(`packaged skill is missing SKILL.md: ${skill}`);
  }
  if (!statSync(src).isDirectory()) {
    throw new Error(`packaged skill path is not a directory: ${skill}`);
  }
  return src;
}

function add(names, opts) {
  const skills = resolveSkills(names);
  const dirs = targetDirs(opts.target, opts.dest);
  for (const dir of dirs) {
    if (!opts.dryRun) {
      mkdirSync(dir, { recursive: true });
    }
    for (const skill of skills) {
      const src = assertPackagedSkill(skill);
      const dest = join(dir, skill);
      if (existsSync(dest)) {
        if (!opts.force) {
          throw new Error(`destination already exists: ${dest}\nUse --force to replace it.`);
        }
        if (!opts.dryRun) {
          rmSync(dest, { recursive: true, force: true });
        }
      }
      if (!opts.dryRun) {
        cpSync(src, dest, { recursive: true, errorOnExist: false });
      }
      console.log(`${opts.dryRun ? 'would install' : 'installed'} ${skill} -> ${dest}`);
    }
  }
}

function list() {
  console.log('Available skills:');
  for (const skill of availableSkills) {
    console.log(`- ${skill}`);
  }
  console.log('\nGroups:');
  for (const [name, skills] of groups) {
    console.log(`- ${name}: ${skills.join(', ')}`);
  }
}

function doctor() {
  let failures = 0;
  for (const skill of availableSkills) {
    const src = join(root, skill);
    if (existsSync(join(src, 'SKILL.md'))) {
      console.log(`pass: ${skill}/SKILL.md`);
    } else {
      console.error(`fail: missing ${skill}/SKILL.md`);
      failures += 1;
    }
  }
  if (failures) {
    process.exitCode = 1;
  }
}

const { opts, positionals } = parseArgs(process.argv.slice(2));
const command = positionals.shift();
try {
  if (!command || opts.help) {
    console.log(usage());
  } else if (command === 'list') {
    list();
  } else if (command === 'add' || command === 'install') {
    add(positionals, opts);
  } else if (command === 'doctor') {
    doctor();
  } else {
    throw new Error(`unknown command: ${command}`);
  }
} catch (error) {
  console.error(`skills: ${error.message}`);
  console.error('\n' + usage());
  process.exit(1);
}
