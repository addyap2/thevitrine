import { Download, FileText, FolderOpen, ShieldCheck, Trash2 } from 'lucide-react';
import { money, periodLabel, totals } from '../model';
import type { SavedQuote } from '../model';

export function SavedView({ saved, savedError, library, onImport, onBackup, onCompose, onOpen, onDuplicate, onDelete }: {
  saved: SavedQuote[]; savedError: string; library: 'loading' | 'shared' | 'local'; onImport: () => void; onBackup: () => void; onCompose: () => void;
  onOpen: (s: SavedQuote) => void; onDuplicate: (s: SavedQuote) => void; onDelete: (s: SavedQuote) => void;
}) {
  return <>
    <div className="library-toolbar">
      <span>{library === 'loading' ? 'Chargement de Mes devis…' : library === 'shared' ? `${saved.length} devis partagés avec l’équipe` : `${saved.length} devis sur cet appareil (hors ligne)`}</span>
      <div>
        <button className="button secondary" onClick={onImport}><FolderOpen size={17} />Importer une sauvegarde</button>
        <button className="button secondary" onClick={onBackup}><Download size={17} />Exporter une sauvegarde</button>
      </div>
    </div>
    {savedError && <div className="error-box" role="alert">{savedError}</div>}
    {saved.length === 0
      ? <div className="empty panel"><FolderOpen size={42} /><h2>Votre prochain devis commence ici.</h2><p>Enregistrez une proposition pour la retrouver et la réutiliser.</p><button className="button primary" onClick={onCompose}>Composer un devis</button></div>
      : <div className="saved-grid">{saved.map(s => <article className="saved-card panel" key={s.quote.id}>
        <div className="saved-card-top"><span className="summary-icon"><FileText size={21} /></span><button className="icon-button delete" aria-label={`Supprimer ${s.quote.reference}`} onClick={() => onDelete(s)}><Trash2 size={18} /></button></div>
        <small>{s.quote.reference}</small>
        <h2>{s.quote.client.name || 'Client à compléter'}</h2>
        <p>{s.quote.title}</p>
        <div className="saved-amount">{money(totals(s.quote).periodNet)}<small>HT / {periodLabel(s.quote)}</small></div>
        <span className="saved-date">Enregistré le {new Date(s.savedAt).toLocaleDateString('fr-FR')}{s.savedBy ? ` par ${s.savedBy === 'antony' ? 'Antony' : s.savedBy === 'julien' ? 'Julien' : s.savedBy}` : ''}</span>
        <div className="saved-actions"><button className="button secondary" onClick={() => onOpen(s)}>Ouvrir</button><button className="text-button" onClick={() => onDuplicate(s)}>Dupliquer</button></div>
      </article>)}</div>}
    <p className="library-note"><ShieldCheck size={16} />{library === 'shared' ? 'Mes devis est partagé entre Antony et Julien, sur tous vos appareils. Le brouillon en cours reste sur cet appareil jusqu’à « Enregistrer ».' : 'Hors ligne : ces devis sont ceux de cet appareil. Ils seront de nouveau partagés à la prochaine connexion.'}</p>
  </>;
}
