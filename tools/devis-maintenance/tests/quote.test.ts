import { describe, expect, it, vi, beforeEach } from 'vitest';
import { services, categories } from '../src/catalogue';
import { createQuote, expiryDate, exportErrors, isQuote, totals } from '../src/model';
import { parseBackup, readDraft, readSaved, writeDraft, writeSaved, DRAFT_KEY, SAVED_KEY } from '../src/storage';
import { buildPdf } from '../src/pdf';
import { writeFileSync, mkdirSync } from 'node:fs';

describe('Financial calculations', () => {
  it('contains 37 distinct services across all seven categories', () => {
    expect(services).toHaveLength(37); expect(new Set(services.map(s => s.id)).size).toBe(37);
    expect(new Set(services.map(s => s.category)).size).toBe(7); expect(categories).toHaveLength(7);
  });
  it('calculates monthly billing, VAT, setup and first year without an annual discount', () => {
    const q = createQuote(); q.vat = 20; q.selected = ['cms', 'plugins']; q.prices.cms = 79.9; q.prices.plugins = 20.1;
    q.discount = 10; q.annualDiscount = 25; q.setup = 150;
    const t = totals(q);
    expect(t.monthlyBase).toBe(100); expect(t.periodNet).toBe(90); expect(t.tax).toBe(18);
    expect(t.firstPaymentGross).toBe(288); expect(t.firstYearNet).toBe(1230); expect(t.annualSaving).toBe(0);
  });
  it('applies commercial and annual discounts successively, excluding setup fees', () => {
    const q = createQuote(); q.vat = 20; q.selected = ['cms']; q.prices.cms = 100; q.discount = 10; q.annualDiscount = 20; q.billing = 'annual'; q.setup = 150;
    const t = totals(q);
    expect(t.periodNet).toBe(864); expect(t.tax).toBe(172.8); expect(t.annualSaving).toBe(216);
    expect(t.firstPaymentGross).toBe(1216.8); expect(t.firstYearNet).toBe(1014); expect(t.effectiveMonthly).toBe(72);
  });
  it('rounds money, allows zero VAT and handles empty or fully discounted selections', () => {
    const q = createQuote(); q.vat = 20; q.selected = ['cms']; q.prices.cms = 19.99; q.discount = 12.5;
    expect(totals(q).periodNet).toBe(17.49); expect(totals(q).tax).toBe(3.5);
    q.vat = 0; expect(totals(q).periodGross).toBe(17.49);
    q.discount = 100; expect(totals(q).periodNet).toBe(0);
    q.selected = []; expect(totals(q).monthlyBase).toBe(0); expect(exportErrors(q).join(' ')).toContain('Sélectionnez');
  });
  it('calculates validity across month and year boundaries', () => {
    const q = createQuote(); q.date = '2026-12-20'; q.validDays = 30; expect(expiryDate(q)).toBe('2027-01-19');
  });
});

describe('Local persistence and portable backups', () => {
  let data: Map<string, string>;
  beforeEach(() => {
    data = new Map(); vi.stubGlobal('localStorage', { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v) });
  });
  it('preserves all editable quote details through save and reload', () => {
    const q = createQuote(); q.client.name = 'Café Déjà Vu'; q.provider.name = 'Atelier Web'; q.prices.cms = 45.25; q.billing = 'annual';
    writeDraft(q); writeSaved([{ quote: q, savedAt: new Date().toISOString() }]);
    expect(readDraft().data).toEqual(q); expect(readSaved().data[0].quote).toEqual(q);
    expect(parseBackup(JSON.stringify({ version: 1, quotes: readSaved().data }))[0].quote).toEqual(q);
  });
  it('leaves corrupted data intact and reports inaccessible storage', () => {
    data.set(DRAFT_KEY, '{broken'); data.set(SAVED_KEY, '{broken');
    expect(readDraft().error).not.toBe(''); expect(readSaved().error).not.toBe(''); expect(data.get(SAVED_KEY)).toBe('{broken');
    vi.stubGlobal('localStorage', { getItem() { throw new Error('Unavailable'); } }); expect(readDraft().error).not.toBe('');
  });
  it('rejects malformed, unknown-version and invalid financial data', () => {
    const q = createQuote(); expect(isQuote(q)).toBe(true);
    q.prices.cms = -1; expect(isQuote(q)).toBe(false); q.prices.cms = Infinity; expect(isQuote(q)).toBe(false);
    expect(() => parseBackup('{broken')).toThrow(); expect(() => parseBackup('{"version":2,"quotes":[]}')).toThrow();
    expect(() => parseBackup(JSON.stringify(q))).toThrow();
  });
});

describe('French PDF export', () => {
  it('requires client, provider, reference and selected services', () => {
    expect(() => buildPdf(createQuote())).toThrow('prestataire');
  });
  it('exports every service, multi-page conditions, accents, totals and numbered pages', () => {
    const q = createQuote(); q.reference = 'DEV-EXEMPLE-2026'; q.client.name = 'Café Déjà Vu'; q.client.address = '12 rue de la République\n75011 Paris'; q.provider.name = 'Atelier Web';
    q.selected = services.map(s => s.id); q.billing = 'annual'; q.discount = 5; q.setup = 150;
    q.notes = 'Périmètre spécifique : création, sécurité, disponibilité et accompagnement.\n'.repeat(60);
    const doc = buildPdf(q); expect(doc.getNumberOfPages()).toBeGreaterThan(2);
    const raw = doc.output(); expect(raw).toContain('DEV-EXEMPLE-2026'); expect(raw).toContain('Atelier Web');
    expect(raw).toContain('Paiements & livraison');
    if (process.env.PDF_QA_DIR) { mkdirSync(process.env.PDF_QA_DIR, { recursive: true }); writeFileSync(`${process.env.PDF_QA_DIR}/devis-complet.pdf`, new Uint8Array(doc.output('arraybuffer'))); }
  });
});

describe('Shared preview / PDF helpers', () => {
  it('shows a zero price as included and keeps the starter plan at 100 € HT', async () => {
    const { linePrice, totals: tot, createQuote: create } = await import('../src/model');
    expect(linePrice(0)).toBe('Inclus'); expect(linePrice(55)).toContain('55');
    expect(tot(create()).monthlyBase).toBe(100);
  });
  it('builds summary rows that match the totals and highlight only the first payment', async () => {
    const { summaryRows, createQuote: create, totals: tot, money } = await import('../src/model');
    const q = create(); q.vat = 20; q.billing = 'annual'; q.discount = 10; q.setup = 150;
    const rows = summaryRows(q); const t = tot(q);
    expect(rows.find(r => r.label.startsWith('Abonnement HT'))?.value).toBe(money(t.periodNet));
    expect(rows.filter(r => r.highlight).map(r => r.label)).toEqual(['Premier règlement TTC']);
    q.billing = 'monthly'; expect(summaryRows(q).some(r => r.label.startsWith('Remise annuelle'))).toBe(false);
  });
  it('upserts a saved quote at the top without duplicating it', async () => {
    const { upsertSaved, createQuote: create } = await import('../src/model');
    const a = create(), b = create();
    const list = upsertSaved(upsertSaved([], a), b);
    const again = upsertSaved(list, a);
    expect(again.map(s => s.quote.id)).toEqual([a.id, b.id]);
  });
});

describe('Franchise en base de TVA (no VAT charged)', () => {
  it('defaults to no VAT, prints the 293 B mention and drops every VAT line', async () => {
    const { createQuote: create, summaryRows, totals: tot, money, noVat, NO_VAT_MENTION } = await import('../src/model');
    const q = create(); q.client.name = 'Client'; q.provider.name = 'Antony Addy EI · The Vitrine'; q.setup = 150;
    expect(q.vat).toBe(0); expect(noVat(q)).toBe(true);
    const rows = summaryRows(q);
    expect(rows.some(r => /TVA|TTC/.test(r.label))).toBe(false);
    expect(rows.find(r => r.highlight)).toEqual({ label: 'Premier règlement', value: money(tot(q).firstPaymentNet), highlight: true });
    const raw = buildPdf(q).output();
    expect(raw).toContain('TVA non applicable, art. 293 B du CGI');
    expect(NO_VAT_MENTION).toBe('TVA non applicable, art. 293 B du CGI');
  });
  it('states late-payment penalties and the 40 € recovery fee in the default terms', () => {
    expect(createQuote().payment).toContain('40 €');
    expect(createQuote().payment).toContain('L441-10');
  });
  it('budgets over the commitment when it is shorter than a year', async () => {
    const { budgetLabel } = await import('../src/model');
    const q = createQuote(); q.selected = ['cms']; q.prices.cms = 100; q.setup = 50; q.commitment = 6;
    const t = totals(q); expect(t.budgetMonths).toBe(6); expect(t.budgetNet).toBe(650); expect(budgetLabel(t)).toBe('Budget sur 6 mois HT');
    q.commitment = 0; expect(totals(q).budgetNet).toBe(1250);
    q.commitment = 6; q.billing = 'annual'; expect(totals(q).budgetMonths).toBe(12);
  });
});

describe('Issuer details', () => {
  it('fills Antony as an EI from the site legal notice, with SIRET and a readable phone', async () => {
    const { issuerParty } = await import('../src/issuers');
    const a = issuerParty('antony');
    expect(a.name).toBe('Antony Addy EI · The Vitrine');
    expect(a.registration).toMatch(/^\d{3} \d{3} \d{3} \d{5}$/);
    expect(a.phone).toMatch(/^\+33 \d( \d\d){4}$/);
    expect(issuerParty('julien').contact).toBe('Julien Bourgois');
  });
});

describe('Shared Mes devis', () => {
  it('merges saved items by id and keeps the newest first', async () => {
    const { mergeSaved } = await import('../src/remote');
    const a = createQuote(), b = createQuote();
    const list = mergeSaved([{ quote: a, savedAt: '2026-01-01T00:00:00Z' }], [{ quote: b, savedAt: '2026-02-01T00:00:00Z' }]);
    expect(list.map(s => s.quote.id)).toEqual([b.id, a.id]);
    const again = mergeSaved(list, [{ quote: { ...a, title: 'Modifié' }, savedAt: '2026-03-01T00:00:00Z', savedBy: 'julien' }]);
    expect(again.map(s => s.quote.id)).toEqual([a.id, b.id]);
    expect(again[0].quote.title).toBe('Modifié');
    expect(again).toHaveLength(2);
  });
});
