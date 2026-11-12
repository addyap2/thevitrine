// These checks inspect received HTML/headers, never fetch canonical targets.
const values = (value) => Array.isArray(value) ? value : value == null ? [] : [value];
const tokens = (value) => String(value).toLowerCase().split(/[\s,;]+/).filter(Boolean);

function indexingRules(robots, headers) {
  const rules = [];
  for (const tag of robots) {
    if (['robots', 'googlebot'].includes(tag.name.trim().toLowerCase())) rules.push(...tokens(tag.content));
  }
  for (const header of values(headers['x-robots-tag'])) {
    let agent = '';
    for (let part of String(header).split(',')) {
      const scoped = part.trim().match(/^([\w-]+)\s*:\s*(.*)$/);
      if (scoped && !['unavailable_after', 'max-snippet', 'max-image-preview', 'max-video-preview'].includes(scoped[1].toLowerCase())) {
        agent = scoped[1].toLowerCase(); part = scoped[2];
      }
      if (!agent || agent === 'googlebot') rules.push(...tokens(part));
    }
  }
  const blocked = rules.includes('noindex') || rules.includes('none');
  const allowed = rules.includes('index') || rules.includes('all');
  return { id: 'indexability', status: blocked ? 'bad' : 'good', reason: blocked ? (allowed ? 'conflict' : 'blocked') : 'clear' };
}

// Split HTTP Link fields without splitting commas inside URLs/quoted strings.
function splitFields(header, separator) {
  const fields = []; let start = 0, angle = false, quoted = false, escaped = false;
  for (let i = 0; i < header.length; i++) {
    const ch = header[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && quoted) { escaped = true; continue; }
    if (ch === '"' && !angle) quoted = !quoted;
    if (!quoted) {
      if (ch === '<') angle = true;
      if (ch === '>') angle = false;
      if (ch === separator && !angle) { fields.push(header.slice(start, i)); start = i + 1; }
    }
  }
  fields.push(header.slice(start));
  return fields;
}

function canonicalCheck(canonicals, baseUrl, headers) {
  const candidates = [...canonicals];
  for (const header of values(headers.link)) {
    for (const field of splitFields(String(header), ',')) {
      const target = field.match(/^\s*<([^>]*)>/)?.[1];
      const rel = splitFields(field.slice(field.indexOf('>') + 1), ';').map((param) => param.trim().match(/^rel\s*=\s*(?:"([^"]*)"|([^\s;]+))$/i)).find(Boolean);
      if (rel && tokens(rel[1] ?? rel[2]).includes('canonical')) candidates.push({ href: target, base: baseUrl });
    }
  }
  const result = (status, reason) => ({id:'canonical', status, reason});
  if (!candidates.length) return result('warn', 'missing');
  const targets = []; let invalid = false;
  for (const candidate of candidates) {
    try {
      if (!candidate.href?.trim() || candidate.unsupported) throw new Error('Invalid canonical');
      const target = new URL(candidate.href, candidate.base || baseUrl);
      if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password || target.hash) throw new Error('Invalid canonical');
      targets.push(target.href);
    } catch { invalid = true; }
  }
  if (new Set(targets).size > 1) return result('bad', 'conflict');
  if (invalid) return result('warn', 'invalid');
  // Pointing to another page may be intentional: ask for a review, not a fix.
  if (baseUrl && targets[0] !== new URL(baseUrl).href) return result('warn', 'other');
  return result('good', 'declared');
}

export function searchChecks({robots = [], canonicals = [], baseUrl, headers = {}} = {}) {
  return [indexingRules(robots, headers), canonicalCheck(canonicals, baseUrl, headers)];
}
