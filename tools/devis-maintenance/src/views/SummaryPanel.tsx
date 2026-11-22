import { Download, FolderOpen, ListChecks, ShieldCheck } from 'lucide-react';
import { NO_VAT_MENTION, budgetLabel, money, noVat, periodLabel } from '../model';
import type { Quote, totals } from '../model';
import { BillingToggle } from '../components';

export function SummaryPanel({ quote, t, patch, exporting, onExport, onSave, onBackup, storageStatus, draftEnabled, onEnableDraft }: {
  quote: Quote; t: ReturnType<typeof totals>; patch: (value: Partial<Quote>) => void; exporting: boolean;
  onExport: () => void; onSave: () => void; onBackup: () => void; storageStatus: string; draftEnabled: boolean; onEnableDraft: () => void;
}) {
  const n = quote.selected.length;
  const period = periodLabel(quote);
  const franchise = noVat(quote); // no VAT: net is what the client pays
  return <aside className="summary-column">
    <section className="summary">
      <div className="summary-top"><span className="summary-icon"><ListChecks size={20} /></span><h2>Votre devis en direct</h2></div>
      <div className="summary-project">
        <small>{quote.reference}</small>
        <strong>{quote.client.name || 'Votre prochain client'}</strong>
        <span>{n} prestation{n > 1 ? 's' : ''} sélectionnée{n > 1 ? 's' : ''}</span>
      </div>
      <BillingToggle compact quote={quote} onChange={billing => patch({ billing })} />
      <div className="summary-price" aria-live="polite"><span>{franchise ? 'Abonnement' : 'Abonnement HT'}</span><strong>{money(t.periodNet)}</strong><small>par {period} · hors mise en service</small></div>
      <dl className="summary-lines">
        <div><dt>Base mensuelle</dt><dd>{money(t.monthlyBase)}</dd></div>
        {quote.discount > 0 && <div className="discount"><dt>Remise commerciale</dt><dd>−{quote.discount} %</dd></div>}
        {quote.billing === 'annual' && <div className="discount"><dt>Économie annuelle</dt><dd>{money(t.annualSaving)}</dd></div>}
        {franchise
          ? <div className="subtotal"><dt>{NO_VAT_MENTION}</dt><dd /></div>
          : <><div><dt>TVA ({quote.vat} %)</dt><dd>{money(t.tax)}</dd></div>
            <div className="subtotal"><dt>Abonnement TTC / {period}</dt><dd>{money(t.periodGross)}</dd></div></>}
      </dl>
      <div className="first-payment"><span>{franchise ? 'Premier règlement' : 'Premier règlement TTC'}<small>Avec {money(t.setup)}{franchise ? '' : ' HT'} de mise en service</small></span><b>{money(franchise ? t.firstPaymentNet : t.firstPaymentGross)}</b></div>
      <div className="year-budget"><span>{franchise ? budgetLabel(t, '').trim() : budgetLabel(t)}</span><strong>{money(t.budgetNet)}</strong></div>
      <button className="button primary wide" onClick={onExport} disabled={exporting}><Download size={17} />{exporting ? 'Génération du PDF…' : 'Exporter le devis PDF'}</button>
      <button className="button secondary wide" onClick={onSave}><FolderOpen size={17} />Enregistrer le devis</button>
      <div className="storage-status"><ShieldCheck size={14} /><span>{storageStatus}</span></div>
      {!draftEnabled && <button className="text-button" onClick={onEnableDraft}>Remplacer le brouillon illisible</button>}
    </section>
    <button className="text-button backup-link" onClick={onBackup}><Download size={15} />Sauvegarder au format JSON</button>
  </aside>;
}
