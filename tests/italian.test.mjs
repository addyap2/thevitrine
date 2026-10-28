import test from 'node:test';
import assert from 'node:assert/strict';
import * as contact from '../api/contact.js';
import * as devis from '../api/devis.js';

test('contact form keeps Italian and confirms in Italian', () => {
  const d = contact.clean({ lang: 'it', name: 'Marco Rossi', email: 'marco@example.it', message: 'Ciao', consent: true });
  assert.equal(d.lang, 'it');
  const mail = contact.clientEmail(d);
  assert.match(mail.subject, /Abbiamo ricevuto/);
  assert.match(mail.html, /\/it\/preventivo\//);
  assert.match(mail.html, /Note legali/);
  assert.match(contact.ownerEmail(d).html, /en italien/);
});

test('questionnaire keeps Italian and confirms in Italian', () => {
  const d = devis.clean({ lang: 'it', name: 'Marco Rossi', email: 'marco@example.it', consent: true,
    sections: [{ title: 'Budget et délais', items: [{ id: 'budget', label: 'Budget envisagé', value: 'Je ne sais pas encore', local: 'Non lo so ancora', status: 'answered' }] }] });
  assert.equal(d.lang, 'it');
  const mail = devis.clientEmail(d);
  assert.match(mail.subject, /Abbiamo ricevuto il tuo progetto/);
  assert.match(mail.html, /Non lo so ancora/);
  assert.match(mail.text, /A presto,/);
});

test('unknown languages fall back to French', () => {
  assert.equal(contact.clean({ lang: 'de' }).lang, 'fr');
});
