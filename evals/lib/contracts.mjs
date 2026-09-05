import YAML from 'yaml';
export function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) throw new Error('missing skill frontmatter');
  const data = YAML.parse(m[1]);
  if (typeof data.name !== 'string' || typeof data.description !== 'string') throw new Error('invalid skill identity');
  return data;
}
export function renderCatalog(skills, surface) {
  if (!['description', 'extended'].includes(surface)) throw new Error('unknown catalog surface');
  return skills.map(s => `- ${s.name}: ${surface === 'extended' ? `${s.description} ${s.when_to_use ?? ''}`.trim() : s.description}`).join('\n');
}
export function parseVerdict(text, names) {
  try {
    const cleaned = text.trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    const value = JSON.parse(cleaned);
    if (!Array.isArray(value.triggers) || typeof value.none !== 'boolean') throw new Error('invalid shape');
    if (value.triggers.some(t => typeof t !== 'string' || !names.has(t))) throw new Error('unknown skill');
    if (value.none !== (value.triggers.length === 0)) throw new Error('inconsistent none');
    return { ...value, raw: text };
  } catch { return { triggers: [], none: false, parseError: true, raw: text }; }
}
export const normalize = r => r.parseError ? 'INVALID' : r.none ? 'none' : [...new Set(r.triggers)].sort().join('+');
export const firstPass = attempts => attempts[0]?.failures.length === 0;
