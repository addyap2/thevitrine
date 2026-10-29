import test from 'node:test';
import assert from 'node:assert/strict';
import handler, { normaliseUrl, analyse } from '../api/audit.js';

const call = async (url) => {
  const res = { code: 0, body: null, setHeader() {}, status(c) { this.code = c; return this; }, json(b) { this.body = b; return this; } };
  await handler({ method: 'POST', headers: { origin: 'https://thevitrine.fr', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.' + Math.floor(Math.random() * 200) }, body: { url } }, res);
  return res;
};

test('rejects local, private and odd addresses before any request', () => {
  for (const bad of ['localhost', 'http://127.0.0.1', 'http://[::1]/', 'http://10.0.0.1', 'https://example.com:8080', 'ftp://example.com', 'http://user:pw@example.com', 'intranet', 'printer.local', '']) {
    assert.equal(normaliseUrl(bad), null, bad);
  }
  assert.equal(normaliseUrl('example.com').href, 'https://example.com/');
});

test('refuses a public name that resolves to a private address', async () => {
  const res = await call('localtest.me');
  assert.equal(res.body.ok, false);
  assert.ok(['url', 'unreachable'].includes(res.body.error));
});

test('analyses a page', () => {
  const html = '<html lang="fr"><head><title>Pizzeria Da Mario à Fréjus</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Pizzas au feu de bois, à emporter ou sur place, au cœur de Fréjus. Réservez en un clic."><meta property="og:image" content="/x.jpg"><script type="application/ld+json">{}</script></head><body><h1>Da Mario</h1><a href="tel:+33600000000">Appeler</a><img src="a.jpg" alt=""></body></html>';
  const { checks } = analyse(html, { https: true, total: 800, size: 20000 });
  assert.ok(checks.every((c) => c.status === 'good'), JSON.stringify(checks.filter((c) => c.status !== 'good')));
  const bare = analyse('<html><body><p>Hello</p></body></html>', { https: false, total: 5000, size: 900000 }).checks;
  for (const id of ['https', 'mobile', 'speed', 'weight', 'title', 'description', 'h1']) assert.equal(bare.find((c) => c.id === id).status, 'bad', id);
});
