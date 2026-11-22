import { Settings2 } from 'lucide-react';
import type { Quote } from '../model';
import { Field, PartyForm } from '../components';

export function DetailsView({ quote, patch, onNext }: { quote: Quote; patch: (value: Partial<Quote>) => void; onNext: () => void }) {
  return <>
    <div className="section-heading"><div><h2>Les détails font la différence.</h2><p>Ces informations apparaîtront sur votre devis PDF. * Champs requis pour l’export.</p></div></div>
    <section className="panel"><h2>Votre projet</h2><div className="form-grid">
      <Field label="Référence du devis *"><input maxLength={80} value={quote.reference} onChange={e => patch({ reference: e.target.value })} /></Field>
      <Field label="Date d’émission *"><input type="date" value={quote.date} onChange={e => patch({ date: e.target.value })} /></Field>
      <div className="full"><Field label="Objet du devis"><input maxLength={200} value={quote.title} onChange={e => patch({ title: e.target.value })} /></Field></div>
      <div className="full"><Field label="Site internet du client"><input type="text" placeholder="https://www.exemple.fr" maxLength={300} value={quote.website} onChange={e => patch({ website: e.target.value })} /></Field></div>
    </div></section>
    <PartyForm title="Votre client" value={quote.client} onChange={client => patch({ client })} />
    <PartyForm title="Vous, le prestataire" value={quote.provider} onChange={provider => patch({ provider })} />
    <button className="button primary next-button" onClick={onNext}>Définir les conditions <Settings2 size={18} /></button>
  </>;
}
