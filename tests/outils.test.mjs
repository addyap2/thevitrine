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
