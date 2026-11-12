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

const meta = { https: true, total: 400, size: 2000 };
const statusOf = (html, id) => analyse(html, meta).checks.find((c) => c.id === id)?.status;

test('comments, script strings, templates and data attributes cannot fake checks', () => {
  const html = `<html data-lang="fr"><head>
    <!-- <title>A fake title</title><meta name="viewport" content="width=device-width"> -->
    <script>const fake = '<h1>Fake</h1><a href="tel:123">Call</a><img alt="fake">';</script>
    <meta data-name="description" content="A fake description">
    </head><body><template><h1>Template</h1><img src="x"></template>
    <img data-alt="not an alt attribute" src="x"></body></html>`;
  for (const id of ['title', 'mobile', 'description', 'h1']) assert.equal(statusOf(html, id), 'bad', id);
  assert.equal(statusOf(html, 'phone'), 'warn');
  assert.equal(statusOf(html, 'lang'), 'warn');
  assert.equal(statusOf(html, 'alt'), 'bad');
});

test('parses quoted attributes, entities and decorative images accurately', () => {
  const html = `<html lang="fr"><head><title>Tea &#38; Coffee &#x2014; Home</title>
    <meta name="description" content="Short."></head>
    <body><h1 title="a > b">Home</h1><img src="x" alt=""><img alt="a > b" src="y"></body></html>`;
  const checks = analyse(html, meta).checks;
  assert.equal(checks.find((c) => c.id === 'title').value, 'Tea & Coffee — Home'.length);
  assert.equal(statusOf(html, 'h1'), 'good');
  assert.equal(statusOf(html, 'alt'), 'good');
  assert.equal(statusOf(html, 'description'), 'good');
  assert.equal(statusOf(`<meta name="description" content="${'useful '.repeat(60)}">`, 'description'), 'good');
});

test('handles large flat documents without a traversal stack overflow', () => {
  assert.equal(statusOf('<div></div>'.repeat(140000), 'h1'), 'bad');
});

test('score excludes contextual checks and does not accept unknown or duplicate results', async () => {
  const { auditScore } = await import('../src/audit-model.mjs');
  const checks = [{id:'https',status:'good'}, {id:'mobile',status:'bad'}, {id:'title',status:'warn'}];
  const score = auditScore(checks);
  assert.equal(score.score, 50);
  assert.equal(score.count, 3);
  assert.equal(score.band, 'low');
  const contextual = auditScore([...checks, {id:'phone',status:'good'}, {id:'structured',status:'bad'}, {id:'business-answer',status:'bad'}, {id:'https',status:'bad'}, {id:'lang',status:'unknown'}]);
  assert.equal(contextual.score, score.score);
  assert.equal(contextual.count, 3);
  assert.throws(() => auditScore(null));
  assert.throws(() => auditScore([{id:'unknown',status:'good'}]));
});

test('the full request has a hard deadline even without a socket timeout', async (t) => {
  const { default: https } = await import('node:https');
  const { EventEmitter } = await import('node:events');
  const { fetchPage } = await import('../api/audit.js');
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  let destroyed = false;
  t.mock.method(https, 'get', (_url, opts) => {
    assert.equal(opts.timeout, 8000);
    const req = new EventEmitter();
    req.destroy = (error) => { destroyed = true; req.emit('error', error); };
    return req;
  });
  const pending = assert.rejects(fetchPage(new URL('https://example.com')), { code: 'ETIMEOUT' });
  t.mock.timers.tick(8000);
  await pending;
  assert.equal(destroyed, true);
});

test('redirects share one time budget and contribute to the measured fetch time', async (t) => {
  const { default: https } = await import('node:https');
  const { EventEmitter } = await import('node:events');
  const { fetchPage } = await import('../api/audit.js');
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const budgets = [];
  t.mock.method(https, 'get', (_url, opts, callback) => {
    budgets.push(opts.timeout);
    const req = new EventEmitter();
    req.destroy = (error) => req.emit('error', error);
    const first = budgets.length === 1;
    setTimeout(() => {
      const res = new EventEmitter();
      res.statusCode = first ? 301 : 200;
      res.headers = first ? {location:'/home/'} : {'content-type':'text/html'};
      res.destroy = () => {};
      callback(res);
      if (!first) { res.emit('data',Buffer.from('<h1>Home</h1>')); res.emit('end'); }
    }, first ? 3000 : 1000);
    return req;
  });
  const pending = fetchPage(new URL('https://example.com'));
  t.mock.timers.tick(3000);
  await Promise.resolve(); await Promise.resolve();
  assert.deepEqual(budgets, [8000, 5000]);
  t.mock.timers.tick(1000);
  const page = await pending;
  assert.equal(page.total, 4000);
  assert.equal(page.finalUrl.href, 'https://example.com/home/');
});
