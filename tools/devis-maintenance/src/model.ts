import { services, starterIds } from './catalogue';

export interface Party { name: string; contact: string; email: string; phone: string; address: string; registration: string; vatNumber: string }
export interface Quote {
  id: string; reference: string; title: string; date: string; validDays: number;
  client: Party; provider: Party; website: string;
  selected: string[]; prices: Record<string, number>; billing: 'monthly' | 'annual';
  discount: number; annualDiscount: number; vat: number; setup: number;
  commitment: number; startDate: string; payment: string; conditions: string; notes: string;
}
export interface SavedQuote { quote: Quote; savedAt: string }
export const blankParty = (): Party => ({ name: '', contact: '', email: '', phone: '', address: '', registration: '', vatNumber: '' });
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function createQuote(): Quote {
  const date = localDate();
  return {
    id: crypto.randomUUID(), reference: `DEV-${date.slice(0, 4)}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    title: 'Maintenance de site web', date, validDays: 30, client: blankParty(), provider: blankParty(), website: '',
    selected: [...starterIds], prices: Object.fromEntries(services.map(s => [s.id, s.price])), billing: 'monthly',
    discount: 0, annualDiscount: 10, vat: 20, setup: 0, commitment: 12, startDate: '',
    payment: 'Paiement à réception de facture par virement bancaire.',
    conditions: 'Les prestations sont réalisées les jours ouvrés. Les volumes inclus sont précisés pour chaque service et ne sont pas reportables. Toute demande hors périmètre fait l’objet d’un devis complémentaire. Les licences et achats tiers sont exclus sauf mention explicite. Renouvellement et résiliation selon accord écrit entre les parties.', notes: '',
  };
}
export const money = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
export const numeric = (n: number, max = 1_000_000) => Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0;
export const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export function totals(q: Quote) {
  const monthlyBase = round(services.filter(s => q.selected.includes(s.id)).reduce((sum, s) => sum + numeric(q.prices[s.id] ?? s.price), 0));
  const commercialDiscount = round(monthlyBase * numeric(q.discount, 100) / 100);
  const monthlyAfterDiscount = round(monthlyBase - commercialDiscount);
  const yearlyBeforeDiscount = round(monthlyAfterDiscount * 12);
  const annualSaving = q.billing === 'annual' ? round(yearlyBeforeDiscount * numeric(q.annualDiscount, 100) / 100) : 0;
  const yearlyNet = round(yearlyBeforeDiscount - annualSaving);
  const periodNet = q.billing === 'annual' ? yearlyNet : monthlyAfterDiscount;
  const tax = round(periodNet * numeric(q.vat, 100) / 100);
  const periodGross = round(periodNet + tax);
  const setup = round(numeric(q.setup));
  const setupTax = round(setup * numeric(q.vat, 100) / 100);
  const firstPaymentNet = round(periodNet + setup);
  const firstPaymentGross = round(periodGross + setup + setupTax);
  return { monthlyBase, commercialDiscount, monthlyAfterDiscount, yearlyBeforeDiscount, annualSaving, yearlyNet, periodNet, tax, periodGross, setup, setupTax, firstPaymentNet, firstPaymentGross, firstYearNet: round(yearlyNet + setup), effectiveMonthly: round(yearlyNet / 12) };
}
export function expiryDate(q: Quote) {
  const d = new Date(`${q.date}T12:00:00`); d.setDate(d.getDate() + q.validDays); return localDate(d);
}
export const displayDate = (s: string) => s ? new Date(`${s}T12:00:00`).toLocaleDateString('fr-FR') : 'À convenir';

const isRecord = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const validDate = (x: unknown) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x));
const partyKeys = ['name', 'contact', 'email', 'phone', 'address', 'registration', 'vatNumber'];
export function isQuote(x: unknown): x is Quote {
  if (!isRecord(x)) return false;
  if (!['id','reference','title','website','startDate','payment','conditions','notes'].every(k => typeof x[k] === 'string')) return false;
  if (!validDate(x.date) || (x.startDate !== '' && !validDate(x.startDate))) return false;
  if (!['monthly','annual'].includes(x.billing as string)) return false;
  if (!['discount','annualDiscount','vat','setup','validDays','commitment'].every(k => typeof x[k] === 'number' && Number.isFinite(x[k]) && Number(x[k]) >= 0)) return false;
  if (Number(x.discount) > 100 || Number(x.annualDiscount) > 100 || Number(x.vat) > 100 || Number(x.validDays) > 365 || Number(x.commitment) > 120 || Number(x.setup) > 1_000_000) return false;
  if (!Array.isArray(x.selected) || new Set(x.selected).size !== x.selected.length || !x.selected.every(id => services.some(s => s.id === id))) return false;
  if (!isRecord(x.prices) || !services.every(s => typeof (x.prices as Record<string, unknown>)[s.id] === 'number' && Number.isFinite((x.prices as Record<string, number>)[s.id]) && (x.prices as Record<string, number>)[s.id] >= 0 && (x.prices as Record<string, number>)[s.id] <= 1_000_000)) return false;
  return ['client','provider'].every(k => isRecord(x[k]) && partyKeys.every(p => typeof (x[k] as Record<string, unknown>)[p] === 'string'));
}
export function isSavedList(x: unknown): x is SavedQuote[] {
  return Array.isArray(x) && x.every(s => isRecord(s) && isQuote(s.quote) && typeof s.savedAt === 'string' && !Number.isNaN(Date.parse(s.savedAt)));
}
export function exportErrors(q: Quote) {
  const errors: string[] = [];
  if (!q.provider.name.trim()) errors.push('Renseignez le nom du prestataire.');
  if (!q.client.name.trim()) errors.push('Renseignez le nom du client.');
  if (!q.reference.trim()) errors.push('Renseignez la référence du devis.');
  if (!q.date || !validDate(q.date)) errors.push('Renseignez une date valide.');
  if (!q.selected.length) errors.push('Sélectionnez au moins une prestation.');
  return errors;
}

// ── Shared helpers used by the on-screen preview and the PDF ──────────────
export const periodLabel = (q: Quote) => (q.billing === 'annual' ? 'an' : 'mois');
/** A price of 0 is shown as included rather than as "0,00 €". */
export const linePrice = (n: number) => (n === 0 ? 'Inclus' : money(n));
export const selectedServices = (q: Quote) => {
  const chosen = new Set(q.selected);
  return services.filter(s => chosen.has(s.id));
};
export const partyLines = (party: Party) =>
  [party.contact, party.address, party.email, party.phone,
    party.registration && `SIRET / identifiant : ${party.registration}`,
    party.vatNumber && `N° TVA : ${party.vatNumber}`].filter((l): l is string => !!l);
export interface SummaryRow { label: string; value: string; highlight?: boolean }
export function summaryRows(q: Quote, t = totals(q)): SummaryRow[] {
  const period = periodLabel(q);
  return [
    { label: 'Base mensuelle HT', value: money(t.monthlyBase) },
    { label: `Remise commerciale (${q.discount} %) / mois`, value: `− ${money(t.commercialDiscount)}` },
    ...(q.billing === 'annual' ? [{ label: `Remise annuelle (${q.annualDiscount} %) / an`, value: `− ${money(t.annualSaving)}` }] : []),
    { label: `Abonnement HT / ${period}`, value: money(t.periodNet) },
    { label: `TVA (${q.vat} %) / ${period}`, value: money(t.tax) },
    { label: `Abonnement TTC / ${period}`, value: money(t.periodGross) },
    { label: 'Mise en service HT (une fois)', value: money(t.setup) },
    { label: 'TVA sur la mise en service', value: money(t.setupTax) },
    { label: 'Premier règlement TTC', value: money(t.firstPaymentGross), highlight: true },
    { label: 'Budget de la première année HT', value: money(t.firstYearNet) },
  ];
}
/** Puts a quote at the top of the saved list, replacing any older version of it. */
export const upsertSaved = (list: SavedQuote[], quote: Quote): SavedQuote[] =>
  [{ quote: structuredClone(quote), savedAt: new Date().toISOString() }, ...list.filter(s => s.quote.id !== quote.id)];
export const termsLine = (q: Quote) =>
  `Facturation ${q.billing === 'annual' ? 'annuelle' : 'mensuelle'} · ${q.commitment ? `Engagement de ${q.commitment} mois` : 'Sans engagement'}`;
