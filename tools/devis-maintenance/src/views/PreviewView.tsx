import { Download, FileText, Globe2 } from 'lucide-react';
import { NO_VAT_MENTION, displayDate, expiryDate, linePrice, noVat, partyLines, selectedServices, summaryRows, termsLine } from '../model';
import type { Quote } from '../model';

export function PreviewView({ quote, exporting, onExport }: { quote: Quote; exporting: boolean; onExport: () => void }) {
  const chosen = selectedServices(quote);
  const rows = summaryRows(quote);
  return <>
    <div className="section-heading"><div><h2>Prêt à faire bonne impression.</h2><p>Vérifiez votre proposition avant de la télécharger.</p></div></div>
    <article className="quote-preview">
      <div className="document-header"><div><span className="overline">PROPOSITION COMMERCIALE</span><h2>Devis de maintenance</h2><p>{quote.title}</p></div><FileText size={38} /></div>
      <div className="document-body">
        <div className="document-meta">
          <strong>{quote.reference || 'Référence à compléter'}</strong>
          <span>Émis le {displayDate(quote.date)} · Valable jusqu’au {quote.date ? displayDate(expiryDate(quote)) : 'À préciser'}</span>
        </div>
        <div className="parties">{([['PRESTATAIRE', quote.provider], ['CLIENT', quote.client]] as const).map(([label, party]) =>
          <div key={label}><span className="overline">{label}</span><h3>{party.name || 'Nom à compléter'}</h3>{partyLines(party).map((line, i) => <p key={i}>{line}</p>)}</div>)}
        </div>
        {quote.website && <p className="site-line"><Globe2 size={16} />{quote.website}</p>}
        <table className="document-table">
          <thead><tr><th>Prestations incluses</th><th>{noVat(quote) ? 'Prix / mois' : 'HT / mois'}</th></tr></thead>
          <tbody>{chosen.map(s => <tr key={s.id}><td><strong>{s.name}</strong><small>{s.description}</small></td><td>{linePrice(quote.prices[s.id])}</td></tr>)}</tbody>
        </table>
        {!chosen.length && <p>Aucune prestation sélectionnée.</p>}
        <div className="document-totals">{rows.map(r => <div key={r.label} className={r.highlight ? 'grand-total' : undefined}><span>{r.label}</span><b>{r.value}</b></div>)}</div>
        {noVat(quote) && <p className="vat-mention">{NO_VAT_MENTION}</p>}
        <div className="document-terms">
          <h3>Modalités & conditions</h3>
          <p>{termsLine(quote)}<br />Début des prestations : {displayDate(quote.startDate)}</p>
          <p>{quote.payment}</p>
          <p>{quote.conditions}</p>
          {quote.notes && <><h3>Précisions</h3><p>{quote.notes}</p></>}
          <div className="signature">Bon pour accord — date et signature du client</div>
        </div>
      </div>
    </article>
    <button className="button primary next-button" disabled={exporting} onClick={onExport}><Download size={18} />{exporting ? 'Génération…' : 'Télécharger le PDF'}</button>
  </>;
}
