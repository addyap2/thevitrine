import { useMemo, useState } from 'react';
import { CheckCheck, FileText, Globe2, LifeBuoy, Search, Settings2, ShieldCheck, Sparkles, Users, Wallet, Wrench } from 'lucide-react';
import { categories, services } from '../catalogue';
import type { CategoryId } from '../catalogue';
import type { Quote } from '../model';
import { NumberInput } from '../components';

const categoryIcons = { maintenance: Wrench, securite: ShieldCheck, hebergement: Globe2, contenu: FileText, seo: Sparkles, support: LifeBuoy, ecommerce: Wallet };
const fold = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
// The catalogue never changes at runtime, so fold each service's text once.
const searchText = new Map(services.map(s => [s.id, fold(`${s.name} ${s.description}`)]));
const categoryTotals = new Map(categories.map(c => [c.id, services.filter(s => s.category === c.id).length]));

export function ServicesView({ quote, patch, onReset, onNext }:
  { quote: Quote; patch: (value: Partial<Quote>) => void; onReset: () => void; onNext: () => void }) {
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [onlySelected, setOnlySelected] = useState(false);
  const selected = useMemo(() => new Set(quote.selected), [quote.selected]);
  const filtered = useMemo(() => {
    const needle = fold(search);
    return services.filter(s => (category === 'all' || s.category === category)
      && (!onlySelected || selected.has(s.id))
      && searchText.get(s.id)!.includes(needle));
  }, [category, search, onlySelected, selected]);

  const toggle = (id: string) => patch({ selected: selected.has(id) ? quote.selected.filter(x => x !== id) : [...quote.selected, id] });
  const setPrice = (id: string, price: number) => patch({ prices: { ...quote.prices, [id]: price } });

  return <>
    <section className="intro-banner">
      <div><span className="overline">UN ABONNEMENT SUR MESURE</span><h2>Un site entre de bonnes mains.</h2><p>Sélectionnez vos services. Ajustez vos tarifs.<br />Le devis se construit en temps réel.</p></div>
      <div className="banner-art" aria-hidden="true"><div className="art-window"><div className="art-dots"><i /><i /><i /></div><div className="art-lines"><b /><b /><b /></div></div><span className="art-shield"><ShieldCheck size={42} /></span><span className="art-spark"><Sparkles size={22} /></span></div>
    </section>

    <div className="section-heading">
      <div><h2>Votre catalogue de prestations <span className="pill">{services.length}</span></h2><p>Tarifs mensuels HT indicatifs. Chaque prix est modifiable.</p></div>
      <button className="text-button" onClick={onReset}><Settings2 size={16} />Réinitialiser</button>
    </div>

    <div className="catalogue-tools">
      <div className="search-field"><Search size={18} /><input type="search" aria-label="Rechercher une prestation" placeholder="Rechercher une prestation…" value={search} onChange={e => setSearch(e.target.value)} /></div>
      <label className="selected-filter"><input type="checkbox" checked={onlySelected} onChange={e => setOnlySelected(e.target.checked)} />Ma sélection ({quote.selected.length})</label>
    </div>

    <div className="category-tabs" aria-label="Catégories">
      <button className={category === 'all' ? 'selected' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Toutes <span>{services.length}</span></button>
      {categories.map(c => <button key={c.id} className={category === c.id ? 'selected' : ''} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}>{c.name}</button>)}
    </div>

    <div className="selection-tools">
      <span>{filtered.length} prestation{filtered.length > 1 ? 's' : ''}</span>
      <div>
        <button className="text-button" onClick={() => patch({ selected: [...new Set([...quote.selected, ...filtered.map(s => s.id)])] })}><CheckCheck size={15} />Tout sélectionner</button>
        <button className="text-button muted" onClick={() => { const shown = new Set(filtered.map(s => s.id)); patch({ selected: quote.selected.filter(id => !shown.has(id)) }); }}>Tout retirer</button>
      </div>
    </div>

    {filtered.length === 0 && <div className="empty panel">
      <Search size={30} /><h3>Aucune prestation trouvée</h3><p>Essayez un autre terme ou affichez toutes les catégories.</p>
      <button className="button secondary" onClick={() => { setSearch(''); setCategory('all'); setOnlySelected(false); }}>Afficher le catalogue</button>
    </div>}

    {categories.map(c => {
      const items = filtered.filter(s => s.category === c.id);
      if (!items.length) return null;
      const Icon = categoryIcons[c.id];
      const chosenInCategory = services.filter(s => s.category === c.id && selected.has(s.id)).length;
      return <section className={`service-group ${c.color}`} key={c.id}>
        <div className="group-heading">
          <span className="category-icon"><Icon size={20} /></span>
          <div><h3>{c.name}</h3><p>{c.subtitle}</p></div>
          <span className="group-count">{chosenInCategory} / {categoryTotals.get(c.id)}</span>
        </div>
        <div className="service-list">{items.map(s => <div className={`service-card ${selected.has(s.id) ? 'checked' : ''}`} key={s.id}>
          <label className="service-choice">
            <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} />
            <span><strong>{s.name}</strong><small>{s.description}</small></span>
          </label>
          <div className="service-price">
            <label><NumberInput aria-label={`Prix mensuel HT — ${s.name}`} value={quote.prices[s.id]} onChange={price => setPrice(s.id, price)} /><span>€</span></label>
            <small>HT / mois</small>
          </div>
        </div>)}</div>
      </section>;
    })}

    <button className="button primary next-button" onClick={onNext}>Renseigner le client <Users size={18} /></button>
  </>;
}
