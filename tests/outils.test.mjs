import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createSession, verifySession, readCookie, safeNext, COOKIE } from '../api/_outils-session.js';
import { parseUsers, hashPassword, checkPassword } from '../api/outils-login.js';
import middleware from '../middleware.js';

const SECRET = 'test-secret-' + crypto.randomBytes(8).toString('hex');

test('a signed session verifies, and tampering, expiry or a missing secret all fail', async () => {
  const token = await createSession('julien', SECRET);
  assert.equal(await verifySession(token, SECRET), 'julien');
  assert.equal(await verifySession(token.replace('julien', 'antony'), SECRET), null);
  assert.equal(await verifySession(token, 'other-secret'), null);
  assert.equal(await verifySession(token, ''), null);
  assert.equal(await verifySession(token.slice(0, -2) + 'xx', SECRET), null);
  const old = await createSession('julien', SECRET, Date.now() - 31 * 86400e3);
  assert.equal(await verifySession(old, SECRET), null);
  assert.equal(await verifySession('garbage', SECRET), null);
});

test('reads the session cookie among others', () => {
  assert.equal(readCookie(`a=1; ${COOKIE}=abc.123.sig; b=2`), 'abc.123.sig');
  assert.equal(readCookie('a=1'), null);
});

test('only paths inside /outils/ are accepted after login', () => {
  assert.equal(safeNext('/outils/devis-maintenance/'), '/outils/devis-maintenance/');
  for (const bad of ['https://evil.example/', '//evil.example/', '/outils/../admin', '/autre/', '/outils/connexion/', null]) {
    assert.equal(safeNext(bad), '/outils/devis-maintenance/');
  }
});

test('passwords are checked against salted scrypt hashes', async () => {
  const salt = crypto.randomBytes(16).toString('base64url');
  const users = parseUsers(`antony:${salt}:${await hashPassword('correct horse battery', salt)}; julien:x:y`);
  assert.equal(users.size, 2);
  assert.equal(await checkPassword(users, 'antony', 'correct horse battery'), true);
  assert.equal(await checkPassword(users, 'antony', 'wrong password!'), false);
  assert.equal(await checkPassword(users, 'nobody', 'correct horse battery'), false);
});

test('middleware lets the login page through, blocks pages and files without a session, and admits a valid one', async () => {
  process.env.OUTILS_SECRET = SECRET;
  const req = (path, cookie) => new Request(`https://thevitrine.fr${path}`, { headers: cookie ? { cookie } : {} });

  assert.equal(await middleware(req('/outils/connexion/')), undefined);

  const page = await middleware(req('/outils/devis-maintenance/'));
  assert.equal(page.status, 302);
  assert.equal(page.headers.get('location'), 'https://thevitrine.fr/outils/connexion/?next=%2Foutils%2Fdevis-maintenance%2F');

  const asset = await middleware(req('/outils/devis-maintenance/assets/index-abc.js'));
  assert.equal(asset.status, 401);

  const cookie = `${COOKIE}=${encodeURIComponent(await createSession('antony', SECRET))}`;
  assert.equal(await middleware(req('/outils/devis-maintenance/assets/index-abc.js', cookie)), undefined);
  const root = await middleware(req('/outils/', cookie));
  assert.equal(root.headers.get('location'), 'https://thevitrine.fr/outils/devis-maintenance/');

  delete process.env.OUTILS_SECRET; // no secret configured: fail closed
  assert.equal((await middleware(req('/outils/devis-maintenance/', cookie))).status, 302);
});

test('outils-me names the signed-in person and refuses everyone else', async () => {
  const { default: me } = await import('../api/outils-me.js');
  process.env.OUTILS_SECRET = SECRET;
  const run = async cookie => {
    const out = {}; const res = { setHeader() {}, status(c) { out.status = c; return res; }, json(b) { out.body = b; return res; } };
    await me({ headers: cookie ? { cookie } : {} }, res); return out;
  };
  assert.equal((await run()).status, 401);
  const ok = await run(`${COOKIE}=${encodeURIComponent(await createSession('julien', SECRET))}`);
  assert.deepEqual([ok.status, ok.body.user], [200, 'julien']);
  delete process.env.OUTILS_SECRET;
});

test('shared quotes: signed-in only, saved with who saved them, listed, deleted, and kept per environment', async () => {
  const { default: quotes, quotesKey } = await import('../api/outils-quotes.js');
  // In-memory stand-in for the Upstash REST API that api/_guard.js talks to.
  const store = new Map();
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (_url, init) => {
    const [cmd, key, ...args] = JSON.parse(init.body);
    const h = store.get(key) || new Map(); store.set(key, h);
    const result = { HGETALL: () => [...h].flat(), HSET: () => (h.set(args[0], args[1]), 1), HDEL: () => (h.delete(args[0]) ? 1 : 0),
      HEXISTS: () => (h.has(args[0]) ? 1 : 0), HLEN: () => h.size }[cmd]();
    return new Response(JSON.stringify({ result }), { status: 200 });
  };
  Object.assign(process.env, { OUTILS_SECRET: SECRET, KV_REST_API_URL: 'https://kv.test', KV_REST_API_TOKEN: 't', VERCEL_ENV: 'preview' });
  const cookie = `${COOKIE}=${encodeURIComponent(await createSession('julien', SECRET))}`;
  const call = async (method, { body, query = '', auth = true } = {}) => {
    const out = {}; const res = { setHeader() {}, status(c) { out.status = c; return res; }, json(b) { out.body = b; return res; } };
    const headers = { 'content-type': 'application/json', origin: 'https://thevitrine.fr', ...(auth ? { cookie } : {}) };
    await quotes({ method, url: `/api/outils-quotes/${query}`, headers, body }, res); return out;
  };
  const quote = { id: '11111111-2222-4333-8444-555555555555', reference: 'DEV-1', selected: ['cms'], client: {}, provider: {} };
  try {
    assert.equal((await call('GET', { auth: false })).status, 401);
    const saved = await call('POST', { body: { quote } });
    assert.deepEqual([saved.status, saved.body.item.savedBy], [200, 'julien']);
    const list = await call('GET');
    assert.deepEqual(list.body.quotes.map(q => q.quote.reference), ['DEV-1']);
    assert.equal((await call('POST', { body: { quote: { ...quote, id: 'not-a-uuid' } } })).status, 400);
    assert.equal(quotesKey(), 'vitrine:outils:quotes:preview');
    process.env.VERCEL_ENV = 'production';
    assert.equal((await call('GET')).body.quotes.length, 0, 'production must not see preview quotes');
    process.env.VERCEL_ENV = 'preview';
    assert.equal((await call('DELETE', { query: `?id=${quote.id}` })).status, 200);
    assert.equal((await call('GET')).body.quotes.length, 0);
  } finally {
    globalThis.fetch = realFetch;
    for (const k of ['OUTILS_SECRET', 'KV_REST_API_URL', 'KV_REST_API_TOKEN', 'VERCEL_ENV']) delete process.env[k];
  }
});
