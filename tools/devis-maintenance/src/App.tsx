import { useEffect, useRef, useState } from 'react';
import { Check, Download, ChevronRight, CircleHelp, FileText, FolderOpen, LayoutGrid, LogOut, Plus, ShieldCheck, X } from 'lucide-react';
import { services, starterIds } from './catalogue';
import { createQuote, exportErrors, money, noVat, totals, upsertSaved } from './model';
import { issuerParty } from './issuers';
import type { IssuerId } from './issuers';
import type { Quote, SavedQuote } from './model';
import { parseBackup, readDraft, readSaved, writeDraft, writeSaved } from './storage';
import { RemoteUnavailable, deleteRemote, listRemote, markMigrated, mergeSaved, needsMigration, saveRemote } from './remote';
import { Modal } from './components';
import { ServicesView } from './views/ServicesView';
import { DetailsView } from './views/DetailsView';
import { ConditionsView } from './views/ConditionsView';
import { PreviewView } from './views/PreviewView';
import { SummaryPanel } from './views/SummaryPanel';
import { SavedView } from './views/SavedView';

type View = 'services' | 'details' | 'conditions' | 'preview' | 'saved';
const STEPS = ['services', 'details', 'conditions', 'preview'] as const;
const viewNames: Record<View, string> = { services: 'Prestations', details: 'Client & prestataire', conditions: 'Tarifs & conditions', preview: 'Aperçu du devis', saved: 'Mes devis' };
const DRAFT_SAVED = 'Brouillon enregistré sur cet appareil';

export default function App() {
  const [initial] = useState(() => ({ draft: readDraft(), saved: readSaved() }));
  const [quote, setQuote] = useState<Quote>(() => initial.draft.data ?? createQuote());
  const [saved, setSaved] = useState<SavedQuote[]>(initial.saved.data);
  const [draftEnabled, setDraftEnabled] = useState(!initial.draft.error);
  const [savedError, setSavedError] = useState(initial.saved.error);
  // 'shared': Mes devis comes from the site, the same for Antony and Julien. 'local': this device only (offline).
  const [library, setLibrary] = useState<'loading' | 'shared' | 'local'>('loading');
  const [storageStatus, setStorageStatus] = useState(initial.draft.error || DRAFT_SAVED);
  const [view, setView] = useState<View>('services');
  const [notice, setNotice] = useState('');
  const [exportError, setExportError] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [modal, setModal] = useState<'new' | 'help' | 'reset' | null>(null);
  const [deleting, setDeleting] = useState<SavedQuote | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const t = totals(quote);

  const patch = (value: Partial<Quote>) => { setQuote(q => ({ ...q, ...value })); setExportError([]); };
  const go = (next: View) => { setView(next); setExportError([]); requestAnimationFrame(() => heading.current?.focus()); window.scrollTo({ top: 0 }); };

  // Autosave the draft shortly after the last edit.
  useEffect(() => {
    if (!draftEnabled) return;
    const timeout = setTimeout(() => {
      try { writeDraft(quote); setStorageStatus(DRAFT_SAVED); }
      catch { setStorageStatus('Enregistrement local impossible. Exportez une sauvegarde JSON.'); }
    }, 400);
    return () => clearTimeout(timeout);
  }, [quote, draftEnabled]);

  // Pre-fill the issuer from whoever is signed in, when the quote has none yet.
  useEffect(() => {
    if (quote.provider.name.trim()) return;
    let cancelled = false;
    fetch('/api/outils-me/', { cache: 'no-store' })
      .then(res => (res.ok ? res.json() : null))
      .then((me: { user?: string } | null) => {
        if (cancelled || (me?.user !== 'antony' && me?.user !== 'julien')) return;
        setQuote(q => (q.provider.name.trim() ? q : { ...q, provider: issuerParty(me.user as IssuerId) }));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [quote.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(timeout);
  }, [notice]);

  // Load the shared list; fall back to this device's copy if the site can't be reached.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let remote = await listRemote();
        if (needsMigration()) {
          const known = new Set(remote.map(s => s.quote.id));
          const localOnly = initial.saved.data.filter(s => !known.has(s.quote.id));
          if (localOnly.length) remote = mergeSaved(remote, await Promise.all(localOnly.map(s => saveRemote(s.quote))));
          markMigrated();
          if (!cancelled && localOnly.length) setNotice(`${localOnly.length} devis de cet appareil ajouté(s) à Mes devis partagés.`);
        }
        if (cancelled) return;
        setSaved(remote); setSavedError(''); setLibrary('shared');
        try { writeSaved(remote); } catch { /* the local copy is only a fallback */ }
      } catch (error) {
        if (cancelled) return;
        setLibrary('local');
        if (error instanceof RemoteUnavailable && error.message === '401') setNotice('Session expirée : reconnectez-vous pour retrouver Mes devis partagés.');
        else if (!(error instanceof RemoteUnavailable && error.message === '404')) setNotice('Mes devis partagés sont indisponibles : affichage des devis de cet appareil.');
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function cacheLocally(items: SavedQuote[]) { try { writeSaved(items); } catch { /* fallback copy only */ } }

  /** Saves quotes to Mes devis (shared when possible). Resolves false and explains why on failure. */
  async function storeQuotes(quotes: Quote[], replaceUnreadable = false): Promise<boolean> {
    if (library === 'shared') {
      try {
        const items = await Promise.all(quotes.map(q => saveRemote(structuredClone(q))));
        setSaved(prev => { const next = mergeSaved(prev, items); cacheLocally(next); return next; });
        return true;
      } catch {
        setNotice('Enregistrement impossible : Mes devis partagés ne répondent pas. Réessayez ou exportez une sauvegarde JSON.');
        return false;
      }
    }
    if (savedError && !replaceUnreadable) { setNotice(savedError); return false; }
    const now = new Date().toISOString();
    const next = mergeSaved(saved, quotes.map(q => ({ quote: structuredClone(q), savedAt: now })));
    try { writeSaved(next); setSaved(next); return true; }
    catch { setNotice('Impossible d’enregistrer : stockage plein ou indisponible. Exportez une sauvegarde JSON.'); return false; }
  }

  async function removeQuote(id: string): Promise<boolean> {
    if (library === 'shared') {
      try { await deleteRemote(id); }
      catch { setNotice('Suppression impossible : Mes devis partagés ne répondent pas. Réessayez.'); return false; }
    } else if (savedError) { setNotice(savedError); return false; }
    const next = saved.filter(s => s.quote.id !== id);
    setSaved(next); cacheLocally(next);
    return true;
  }

  const saveCurrent = () => storeQuotes([quote]);

  async function save() { if (await saveCurrent()) setNotice(`Devis ${quote.reference} enregistré${library === 'shared' ? ' dans Mes devis partagés' : ''}.`); }

  async function exportPdf() {
    const errors = exportErrors(quote);
    if (errors.length) { go('details'); setExportError(errors); return; }
    setExporting(true);
    try {
      const { downloadPdf } = await import('./pdf'); // jsPDF is large: load it only when needed
      await downloadPdf(quote);
      setNotice('PDF généré. Retrouvez-le dans vos téléchargements.');
    } catch { setExportError(['Le PDF n’a pas pu être généré. Réessayez ou exportez une sauvegarde JSON.']); }
    finally { setExporting(false); }
  }

  function backup() {
    const blob = new Blob([JSON.stringify({ version: 1, quotes: upsertSaved(saved, quote) }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `the-vitrine-devis-sauvegarde-${quote.date}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 10_000_000) throw new Error('Le fichier dépasse 10 Mo.');
      const imported = parseBackup(await file.text());
      if (!imported.length) throw new Error('La sauvegarde est vide.');
      if (!(await storeQuotes(imported.map(s => s.quote), true))) return; // a valid import may replace an unreadable local list
      setSavedError('');
      setNotice(`${imported.length} devis importé(s).`); go('saved');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Import impossible. Aucun devis modifié.'); }
    if (fileInput.current) fileInput.current.value = '';
  }

  function newQuote() {
    const next = createQuote();
    next.provider = { ...quote.provider };
    setQuote(next); setModal(null); go('services');
    setNotice('Nouveau devis créé. Les coordonnées du prestataire sont conservées.');
  }

  async function openSaved(s: SavedQuote) {
    // Keep the current draft in "Mes devis" before replacing it, unless it is unchanged.
    if (JSON.stringify(quote) !== JSON.stringify(s.quote) && !(await saveCurrent())) return;
    setQuote(structuredClone(s.quote)); go('preview');
    setNotice('Devis ouvert. Le brouillon précédent a été conservé dans Mes devis.');
  }

  async function duplicateSaved(s: SavedQuote) {
    const fresh = createQuote();
    const copy = { ...structuredClone(s.quote), id: fresh.id, reference: fresh.reference, date: fresh.date };
    if (await storeQuotes([copy])) setNotice('Copie créée dans Mes devis.');
  }

  const inLibrary = view === 'saved';
  return <div className="app-shell">
    <a className="skip-link" href="#main">Aller au contenu</a>
    <aside className="sidebar">
      <a href="#" className="brand" onClick={e => { e.preventDefault(); go('services'); }}><img className="brand-logo" src={`${import.meta.env.BASE_URL}brand/logo-light.svg`} alt="The Vitrine" width={250} height={64} /><small>DEVIS · MAINTENANCE WEB</small></a>
      <nav aria-label="Navigation principale">
        <button className={!inLibrary ? 'nav-item active' : 'nav-item'} onClick={() => go('services')}><LayoutGrid size={19} />Composer un devis</button>
        <button className={inLibrary ? 'nav-item active' : 'nav-item'} onClick={() => go('saved')}><FolderOpen size={19} />Mes devis<span className="count">{saved.length}</span></button>
      </nav>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setModal('help')}><CircleHelp size={19} />Mode d’emploi</button><a className="nav-item" href="/api/outils-logout/"><LogOut size={19} />Se déconnecter</a><div className="local-note"><ShieldCheck size={17} /><span>{library === 'local' ? <>Hors ligne : devis<br />de cet appareil.</> : <>Devis partagés entre<br />Antony et Julien.</>}</span></div></div>
    </aside>

    <div className="main-shell">
      <header className="topbar">
        <div className="breadcrumb">Mon espace <ChevronRight size={14} /><span>{inLibrary ? 'Mes devis' : 'Nouveau devis'}</span></div>
        <div className="topbar-actions"><button className="button subtle" onClick={() => setModal('new')}><Plus size={17} />Nouveau devis</button><button className="icon-button mobile-only" aria-label="Mode d’emploi" onClick={() => setModal('help')}><CircleHelp size={20} /></button><a className="icon-button mobile-only" aria-label="Se déconnecter" href="/api/outils-logout/"><LogOut size={20} /></a></div>
      </header>

      <main id="main" className="main-content">
        <div className="page-heading">
          <div>
            <div className="eyebrow">{inLibrary ? 'VOTRE BIBLIOTHÈQUE' : 'UNE OFFRE À VOTRE IMAGE'}</div>
            <h1 ref={heading} tabIndex={-1}>{inLibrary ? 'Mes devis' : 'Créons votre prochain devis.'}</h1>
            <p>{inLibrary ? 'Retrouvez, dupliquez et réutilisez vos propositions.' : 'Les bonnes prestations, le juste prix. Un devis prêt à partager.'}</p>
          </div>
          {!inLibrary && <span className="draft-badge"><FileText size={15} />Brouillon</span>}
        </div>

        {notice && <div role="status" className="notice"><Check size={18} /><span>{notice}</span><button aria-label="Masquer la notification" className="icon-button" onClick={() => setNotice('')}><X size={16} /></button></div>}
        {exportError.length > 0 && <div role="alert" className="error-box"><strong>Complétez votre devis avant l’export.</strong><ul>{exportError.map(e => <li key={e}>{e}</li>)}</ul></div>}

        {!inLibrary && <>
          <div className="steps" role="navigation" aria-label="Étapes du devis">
            {STEPS.map((v, i) => <button key={v} className={`step ${view === v ? 'current' : ''}`} aria-current={view === v ? 'step' : undefined} onClick={() => go(v)}>
              <span>{i + 1}</span>{viewNames[v]}{i < STEPS.length - 1 && <ChevronRight size={16} className="step-chevron" />}
            </button>)}
          </div>
          <div className="editor-grid">
            <div className="editor-main">
              {view === 'services' && <ServicesView quote={quote} patch={patch} onReset={() => setModal('reset')} onNext={() => go('details')} />}
              {view === 'details' && <DetailsView quote={quote} patch={patch} onNext={() => go('conditions')} />}
              {view === 'conditions' && <ConditionsView quote={quote} patch={patch} onNext={() => go('preview')} />}
              {view === 'preview' && <PreviewView quote={quote} exporting={exporting} onExport={exportPdf} />}
            </div>
            <SummaryPanel quote={quote} t={t} patch={patch} exporting={exporting} onExport={exportPdf} onSave={save} onBackup={backup}
              storageStatus={storageStatus} draftEnabled={draftEnabled}
              onEnableDraft={() => { setDraftEnabled(true); setNotice('Enregistrement du brouillon réactivé.'); }} />
          </div>
        </>}

        {inLibrary && <SavedView saved={saved} savedError={library === 'shared' ? '' : savedError} library={library} onImport={() => fileInput.current?.click()} onBackup={backup}
          onCompose={() => go('services')} onOpen={openSaved} onDuplicate={duplicateSaved} onDelete={setDeleting} />}

        <input ref={fileInput} type="file" className="sr-only" aria-label="Importer des devis JSON" accept="application/json,.json" onChange={e => { void importFile(e.target.files?.[0]); }} />
        {!inLibrary && <div className="mobile-total">
          <button type="button" onClick={() => document.querySelector('.summary-column')?.scrollIntoView({ behavior: 'smooth' })}>
            <small>{quote.selected.length} prestation{quote.selected.length > 1 ? 's' : ''} · {noVat(quote) ? '' : 'HT '}/ {quote.billing === 'annual' ? 'an' : 'mois'}</small>
            <strong>{money(t.periodNet)}</strong>
          </button>
          <button type="button" className="button primary" onClick={exportPdf} disabled={exporting}><Download size={17} />PDF</button>
        </div>}
        <footer className="footer"><span>The Vitrine <b>·</b> Pensé pour votre activité.</span><span>Maintenance web, l’esprit tranquille.</span></footer>
      </main>
    </div>

    {modal === 'help' && <Modal title="Un devis en quelques étapes" onClose={() => setModal(null)}>
      <ol className="help-list">
        <li><strong>Composez votre offre.</strong> Choisissez parmi {services.length} prestations et ajustez chaque tarif mensuel HT.</li>
        <li><strong>Renseignez les parties.</strong> Ajoutez les coordonnées de votre client et de votre entreprise.</li>
        <li><strong>Fixez les conditions.</strong> Sélectionnez la facturation, les remises, la TVA et les modalités.</li>
        <li><strong>Partagez votre devis.</strong> Vérifiez l’aperçu puis téléchargez le PDF.</li>
      </ol>
      <p>Le brouillon est enregistré automatiquement. « Enregistrer le devis » conserve une version dans Mes devis. Les modifications d’un devis ouvert remplacent sa version enregistrée uniquement lorsque vous cliquez sur ce bouton.</p>
      <p>Les prix sont indicatifs. Adaptez les conditions et les mentions à votre activité. Mes devis est partagé entre Antony et Julien sur tous vos appareils ; le brouillon en cours reste sur l’appareil où vous l’éditez. La sauvegarde JSON garde une copie hors du site, et l’import met à jour les devis ayant le même identifiant.</p>
      <button className="button primary wide" onClick={() => setModal(null)}>C’est parti</button>
    </Modal>}

    {modal === 'new' && <Modal title="Créer un nouveau devis ?" onClose={() => setModal(null)}>
      <p>Votre brouillon sera remplacé. Vous pouvez d’abord l’enregistrer dans Mes devis. Les coordonnées du prestataire seront conservées.</p>
      <div className="modal-actions">
        <button className="button secondary" onClick={() => setModal(null)}>Annuler</button>
        <button className="button secondary" onClick={async () => { if (await saveCurrent()) newQuote(); }}>Enregistrer puis créer</button>
        <button className="button primary" onClick={newQuote}>Créer sans enregistrer</button>
      </div>
    </Modal>}

    {modal === 'reset' && <Modal title="Réinitialiser le catalogue ?" onClose={() => setModal(null)}>
      <p>Les {services.length} prix retrouveront leurs valeurs de départ et les {starterIds.length} prestations essentielles seront sélectionnées. Les coordonnées et conditions seront conservées.</p>
      <div className="modal-actions">
        <button className="button secondary" onClick={() => setModal(null)}>Annuler</button>
        <button className="button primary" onClick={() => { patch({ prices: Object.fromEntries(services.map(s => [s.id, s.price])), selected: [...starterIds] }); setModal(null); }}>Réinitialiser</button>
      </div>
    </Modal>}

    {deleting && <Modal title="Supprimer ce devis ?" onClose={() => setDeleting(null)}>
      <p>{deleting.quote.reference} — {deleting.quote.client.name || 'Client à compléter'} sera retiré de Mes devis. Le brouillon ouvert reste disponible.</p>
      <div className="modal-actions">
        <button className="button secondary" onClick={() => setDeleting(null)}>Annuler</button>
        <button className="button danger" onClick={async () => { if (await removeQuote(deleting.quote.id)) { setDeleting(null); setNotice('Devis supprimé.'); } }}>Supprimer le devis</button>
      </div>
    </Modal>}
  </div>;
}
