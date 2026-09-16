#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const availableSkills = [
  'design',
  'verify',
  'eng',
  'reflect',
  'grill-me',
  'external-cli',
];
const retiredSkills = new Set(['dev', 'clarify', 'qa', 'acceptance']);
const adapterAliases = new Map([
  ['kimi-code', 'external-cli'],
  ['claude-code', 'external-cli'],
  ['codex-cli', 'external-cli'],
  ['opencode', 'external-cli'],
  ['grok-build-cli', 'external-cli'],
]);
const groups = new Map([
  ['all', availableSkills],
  ['ui', ['design']],
  ['quality', ['verify']],
  ['engineering', ['eng']],
  ['delegation', ['external-cli']],
  ['adapters', ['external-cli']],
  ['meta', ['reflect']],
]);

function usage() {
  return `skills - install this repository's portable coding-agent skills

Usage:
  skills list
  skills add <skill|group...> [--target agents|codex|claude|gemini|opencode|all] [--dest <dir>] [--force] [--dry-run]
  skills references
  skills doctor

Skills:
  ${availableSkills.join('\n  ')}

Groups:
  all          Install every skill
  ui           Install design only
  quality      Install verify only
  engineering  Install eng only
  delegation   Install external-cli
  adapters     Install external-cli (aliases: kimi-code, claude-code, codex-cli, opencode, grok-build-cli)
  meta         Install reflect (repository-local learning)

Targets:
  agents       ${join(homedir(), '.agents', 'skills')} (default)
  codex        ${join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills')}
  claude       ${join(homedir(), '.claude', 'skills')}
  gemini       ${join(homedir(), '.gemini', 'skills')}
  opencode     ${join(homedir(), '.config', 'opencode', 'skills')}
  all          Install to agents, claude, gemini, and opencode target directories

Examples:
  skills add ui --target agents
  skills add verify --target agents
  skills add reflect --target agents
  skills add all --target claude --force
  skills add delegation --target all --force
  skills add design --dest ./skills --dry-run
`;
}

function parseArgs(argv) {
  const opts = { target: 'agents', dest: null, force: false, dryRun: false };
  const positionals = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (['--target', '--runtime', '--dest', '--dir'].includes(arg) &&
        (!argv[i + 1] || argv[i + 1].startsWith('-'))) {
      throw new Error(`${arg} requires a value`);
    }
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
  if (!names.length) throw new Error('choose a skill or group explicitly; use list to see the catalog');
  const input = names;
  const result = [];
  const aliasNotes = [];
  for (const name of input) {
    if (retiredSkills.has(name) || ['workflow', 'planning'].includes(name)) {
      throw new Error(`retired skill or group: ${name}; ordinary work needs no workflow skill. Use verify for requested business checks or acceptance; see README migration notes.`);
    }
    if (adapterAliases.has(name)) {
      aliasNotes.push(name);
      const skill = adapterAliases.get(name);
      if (!result.includes(skill)) result.push(skill);
      continue;
    }
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
  return { skills: result, aliasNotes };
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

function assertSafeTarget(target) {
  let existing = resolve(target);
  const suffix = [];
  while (!existsSync(existing)) {
    const parent = dirname(existing);
    if (parent === existing) break;
    suffix.unshift(existing.slice(parent.length).replace(/^\//, ''));
    existing = parent;
  }
  const physical = resolve(realpathSync(existing), ...suffix);
  if (physical === '/' || dirname(physical) === '/') {
    throw new Error(`refusing to operate on filesystem root or system path: ${target}`);
  }
}

function references() {
  const dir = join(root, 'eng', 'references');
  console.log('Engineering references are loaded by the optional eng skill:');
  for (const name of readdirSync(dir).filter(name => name.endsWith('.md')).sort()) {
    console.log(join(dir, name));
  }
}

function add(names, opts) {
  const { skills, aliasNotes } = resolveSkills(names);
  const dirs = targetDirs(opts.target, opts.dest);
  // Validate every destination before creating or replacing any installed files.
  for (const dir of dirs) {
    assertSafeTarget(dir);
    for (const skill of skills) assertSafeTarget(join(dir, skill));
  }
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
  if (aliasNotes.length) {
    console.log(`note: ${aliasNotes.join(' ')} now install external-cli. Remove leftover old adapter directories with uninstall.sh ${aliasNotes.join(' ')}`);
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

try {
  const { opts, positionals } = parseArgs(process.argv.slice(2));
  const command = positionals.shift();
  if (!command || opts.help) {
    console.log(usage());
  } else if (command === 'list') {
    list();
  } else if (command === 'add' || command === 'install') {
    add(positionals, opts);
  } else if (command === 'references') {
    references();
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
