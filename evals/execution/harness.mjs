import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const cases = [
  { id: 'implement', mode: 'write', request: '给用户列表增加可选的 role 单选筛选；不传 role 返回全部，未知 role 返回空数组。请完成实现和相关验证。' },
  { id: 'review-only', mode: 'read', request: '只审查用户列表的 role 筛选是否正确，给出发现和证据，不要改文件。预期：不传 role 返回全部，传入 role 只返回匹配的用户。' },
  { id: 'continue', mode: 'write', request: '继续刚才已确定的实现。上下文：我已要求实现 role 筛选；唯一未定项是单选还是多选，现在确定为单选。不传返回全部，未知 role 返回空数组。其他约定不变，请实现并验证。' },
];
const source = 'exports.listUsers = (users, role) => users;\n';
const test = `const assert = require('node:assert/strict');
const { listUsers } = require('./src/users.cjs');
assert.deepEqual(listUsers([{ id: 1, role: 'admin' }]), [{ id: 1, role: 'admin' }]);
console.log('existing tests passed');
`;
function write(file, data) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, data); }
export function snapshot(dir) {
  const out = {};
  function walk(base) {
    for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
      const file = path.join(base, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`symlink not allowed: ${file}`);
      if (entry.isDirectory()) walk(file);
      else out[path.relative(dir, file)] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  }
  walk(dir); return out;
}
export function prepare() {
  const run = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-execution-'));
  const manifest = { version: 1, createdAt: new Date().toISOString(), cases: [] };
  for (const c of cases) {
    const dir = path.join(run, c.id);
    write(path.join(dir, 'src/users.cjs'), source);
    write(path.join(dir, 'test.cjs'), test);
    write(path.join(dir, 'README.md'), 'Small user-list library. Run node test.cjs. Preserve this file.\n');
    fs.cpSync(path.join(root, 'dev'), path.join(dir, '.skills/dev'), { recursive: true });
    write(path.join(dir, 'AGENTS.md'), 'Use .skills/dev/SKILL.md for the requested task. Work only in this directory. Do not invoke other agents, install packages, or access the network. Preserve README.md and the skill files.\n');
    write(path.join(run, `${c.id}.task.txt`), `Work in ${dir}. Read AGENTS.md and .skills/dev/SKILL.md.\n${c.request}\nReturn your result and verification evidence in the final response.\n`);
    manifest.cases.push({ ...c, before: snapshot(dir) });
  }
  write(path.join(run, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return run;
}
export function verify(run) {
  const manifest = JSON.parse(fs.readFileSync(path.join(run, 'manifest.json'), 'utf8'));
  if (manifest.version !== 1 || manifest.cases.length !== cases.length) throw new Error('invalid manifest');
  return manifest.cases.map(c => {
    if (!cases.some(x => x.id === c.id && x.mode === c.mode)) throw new Error('unknown case');
    const failures = [];
    const dir = path.join(run, c.id);
    const after = snapshot(dir);
    const changed = [...new Set([...Object.keys(c.before), ...Object.keys(after)])].filter(k => c.before[k] !== after[k]);
    const allowed = c.mode === 'write' ? ['src/users.cjs', 'test.cjs'] : [];
    for (const file of changed) if (!allowed.includes(file)) failures.push(`out-of-scope edit: ${file}`);
    let verification = 'read-only snapshot';
    if (c.mode === 'write') {
      if (!changed.includes('src/users.cjs')) failures.push('implementation was not changed');
      // Verifier is outside the agent workspace and tests observable behavior,
      // independently of any tests the agent may have changed.
      const check = `const assert = require('node:assert/strict');
const { listUsers } = require(${JSON.stringify(path.join(dir, 'src/users.cjs'))});
const users = [{id:1,role:'admin'},{id:2,role:'member'},{id:3,role:'admin'}];
const before = JSON.stringify(users);
assert.deepEqual(listUsers(users), users);
assert.deepEqual(listUsers(users, 'admin'), [users[0], users[2]]);
assert.deepEqual(listUsers(users, 'member'), [users[1]]);
assert.deepEqual(listUsers(users, 'missing'), []);
assert.deepEqual(listUsers([], 'admin'), []);
assert.equal(JSON.stringify(users), before);
console.log('role filtering and input preservation passed');`;
      try {
        verification = execFileSync(process.execPath, ['-e', check], { cwd: dir, timeout: 10000, encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
      } catch (e) { failures.push('independent behavior verifier failed'); verification = String(e.stderr ?? e.message).slice(0, 2000); }
    }
    const responsePath = path.join(run, `${c.id}.response.txt`);
    const response = fs.existsSync(responsePath) ? fs.readFileSync(responsePath, 'utf8').trim() : '';
    if (!response) failures.push('missing agent response; task not evaluated');
    return { id: c.id, verdict: failures.length ? 'FAIL' : 'PASS', changed, failures, verification,
      conversationReview: 'Manual: inspect the actual response/agent trace for redundant approval requests and accuracy. File checks do not prove conversation behavior.' };
  });
}
