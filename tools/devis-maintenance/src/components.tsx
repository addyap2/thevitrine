import { useEffect, useRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Party, Quote } from './model';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

/**
 * A number input that keeps what the user is typing (an empty field, "12,") instead of
 * snapping to 0 on every keystroke. The clamped value is committed as soon as it is valid,
 * and the field is tidied up when it loses focus.
 */
export function NumberInput({ value, onChange, max = 1_000_000, integer = false, ...rest }:
  { value: number; onChange: (n: number) => void; max?: number; integer?: boolean } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'max'>) {
  const show = (n: number) => String(n).replace('.', ','); // French decimal comma
  const [text, setText] = useState(show(value));
  // Follow outside changes (reset, opening another quote) without fighting the user's typing.
  useEffect(() => { setText(t => (Number(t.replace(',', '.')) === value ? t : show(value))); }, [value]);
  const clamp = (n: number) => Math.min(max, Math.max(0, integer ? Math.floor(n) : Math.round(n * 100) / 100));
  return <input {...rest} type="text" inputMode={integer ? 'numeric' : 'decimal'} value={text}
    onChange={e => {
      setText(e.target.value);
      const n = Number(e.target.value.replace(',', '.'));
      if (e.target.value.trim() !== '' && Number.isFinite(n)) onChange(clamp(n));
    }}
    onBlur={() => {
      const n = Number(text.replace(',', '.'));
      const next = text.trim() !== '' && Number.isFinite(n) ? clamp(n) : 0;
      onChange(next); setText(show(next));
    }} />;
}

export function NumberField({ label, value, onChange, max = 1_000_000, suffix = '', integer = false }:
  { label: string; value: number; onChange: (n: number) => void; max?: number; suffix?: string; integer?: boolean }) {
  return <Field label={label}><div className="number-wrap">
    <NumberInput value={value} onChange={onChange} max={max} integer={integer} />
    {suffix && <span>{suffix}</span>}
  </div></Field>;
}

export function BillingToggle({ quote, onChange, compact = false }: { quote: Quote; onChange: (billing: Quote['billing']) => void; compact?: boolean }) {
  const option = (billing: Quote['billing'], label: ReactNode) =>
    <button aria-pressed={quote.billing === billing} className={quote.billing === billing ? 'selected' : ''} onClick={() => onChange(billing)}>{label}</button>;
  return <div className={compact ? 'billing-toggle compact' : 'billing-toggle'}>
    {option('monthly', compact ? 'Mensuel' : 'Mensuelle')}
    {option('annual', <>{compact ? 'Annuel' : 'Annuelle'} <span>−{quote.annualDiscount} %</span></>)}
  </div>;
}

export function PartyForm({ title, value, onChange }: { title: string; value: Party; onChange: (value: Party) => void }) {
  const input = (key: keyof Party, label: string, type = 'text') =>
    <Field label={label}><input type={type} value={value[key]} maxLength={200} onChange={e => onChange({ ...value, [key]: e.target.value })} /></Field>;
  return <section className="panel party-panel"><h2>{title}</h2><div className="form-grid">
    <div className="full">{input('name', 'Entreprise / nom *')}</div>
    {input('contact', 'Contact')}
    {input('email', 'E-mail', 'email')}
    {input('phone', 'Téléphone', 'tel')}
    {input('registration', 'SIRET / identifiant')}
    <div className="full"><Field label="Adresse"><textarea rows={3} value={value.address} maxLength={1000} onChange={e => onChange({ ...value, address: e.target.value })} /></Field></div>
    <div className="full">{input('vatNumber', 'N° de TVA intracommunautaire')}</div>
  </div></section>;
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="modal" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="modal-header"><h2>{title}</h2><button className="icon-button" aria-label="Fermer" onClick={onClose}><X size={20} /></button></div>
    {children}
  </dialog>;
}
