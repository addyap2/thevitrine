// Business context never changes this HTML-only indicator.
export const CONTEXT_CHECKS = new Set(['phone', 'structured']);
const STATUS_WEIGHT = { good: 1, warn: 0.5, bad: 0 };
const CHECK_IDS = new Set(['https', 'mobile', 'speed', 'weight', 'title', 'description', 'h1', 'phone', 'structured', 'share', 'lang', 'alt']);

export function auditScore(input) {
  if (!Array.isArray(input)) throw new Error('Invalid audit checks');
  const seen = new Set();
  const checks = input.filter((c) => {
    if (!c || !CHECK_IDS.has(c.id) || !Object.hasOwn(STATUS_WEIGHT, c.status) || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  }).sort((a, b) => STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status]);
  const scored = checks.filter((c) => !CONTEXT_CHECKS.has(c.id));
  if (!scored.length) throw new Error('No supported audit checks');
  const score = Math.round(100 * scored.reduce((sum, c) => sum + STATUS_WEIGHT[c.status], 0) / scored.length);
  return { checks, score, count: scored.length, issues: scored.filter((c) => c.status !== 'good'), band: score >= 85 ? 'high' : score >= 55 ? 'mid' : 'low' };
}
