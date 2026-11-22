import { FileText } from 'lucide-react';
import type { Quote } from '../model';
import { BillingToggle, Field, NumberField } from '../components';

export function ConditionsView({ quote, patch, onNext }: { quote: Quote; patch: (value: Partial<Quote>) => void; onNext: () => void }) {
  const text = (key: 'payment' | 'conditions' | 'notes', label: string, rows: number, maxLength: number, placeholder?: string) =>
    <div className="full"><Field label={label}><textarea maxLength={maxLength} rows={rows} placeholder={placeholder} value={quote[key]} onChange={e => patch({ [key]: e.target.value })} /></Field></div>;
  return <>
    <div className="section-heading"><div><h2>Une proposition claire, sans surprise.</h2><p>Personnalisez la facturation et le périmètre de votre abonnement.</p></div></div>
    <section className="panel"><h2>Tarifs & facturation</h2>
      <BillingToggle quote={quote} onChange={billing => patch({ billing })} />
      <div className="form-grid">
        <NumberField label="Remise commerciale" suffix="%" value={quote.discount} max={100} onChange={discount => patch({ discount })} />
        <NumberField label="Remise pour paiement annuel" suffix="%" value={quote.annualDiscount} max={100} onChange={annualDiscount => patch({ annualDiscount })} />
        <NumberField label="Taux de TVA" suffix="%" value={quote.vat} max={100} onChange={vat => patch({ vat })} />
        <NumberField label="Mise en service (une fois)" suffix="€ HT" value={quote.setup} onChange={setup => patch({ setup })} />
      </div>
      <p className="field-note">La remise annuelle s’applique après la remise commerciale, uniquement en facturation annuelle. Les frais de mise en service ne sont pas remisés.</p>
    </section>
    <section className="panel"><h2>Modalités de l’abonnement</h2><div className="form-grid">
      <NumberField label="Engagement" suffix="mois" max={120} integer value={quote.commitment} onChange={commitment => patch({ commitment })} />
      <NumberField label="Validité du devis" suffix="jours" max={365} integer value={quote.validDays} onChange={validDays => patch({ validDays })} />
      <Field label="Début des prestations"><input type="date" value={quote.startDate} onChange={e => patch({ startDate: e.target.value })} /></Field>
      {text('payment', 'Modalités de paiement', 3, 3000)}
      {text('conditions', 'Conditions & périmètre', 7, 12000)}
      {text('notes', 'Précisions complémentaires', 4, 12000, 'Exclusions, licences incluses, modalités de résiliation…')}
    </div></section>
    <button className="button primary next-button" onClick={onNext}>Vérifier mon devis <FileText size={18} /></button>
  </>;
}
