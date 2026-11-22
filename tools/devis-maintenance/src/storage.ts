import { isQuote, isSavedList } from './model';
import type { Quote, SavedQuote } from './model';
export const DRAFT_KEY = 'devis-web:draft:v1';
export const SAVED_KEY = 'devis-web:saved:v1';
export function readDraft(): { data: Quote | null; error: string } {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { data: null, error: '' };
    const parsed: unknown = JSON.parse(raw);
    if (!isQuote(parsed)) throw new Error();
    return { data: parsed, error: '' };
  } catch { return { data: null, error: 'Le brouillon local est illisible ou inaccessible. Il n’a pas été remplacé. Exportez une sauvegarde avant de réactiver l’enregistrement.' }; }
}
export function readSaved(): { data: SavedQuote[]; error: string } {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return { data: [], error: '' };
    const parsed: unknown = JSON.parse(raw);
    if (!isSavedList(parsed)) throw new Error();
    return { data: parsed, error: '' };
  } catch { return { data: [], error: 'Les devis enregistrés sont illisibles ou inaccessibles. Leur contenu local a été conservé. Importez une sauvegarde valide pour le remplacer.' }; }
}
export function writeDraft(q: Quote) { localStorage.setItem(DRAFT_KEY, JSON.stringify(q)); }
export function writeSaved(items: SavedQuote[]) { localStorage.setItem(SAVED_KEY, JSON.stringify(items)); }
export function parseBackup(text: string): SavedQuote[] {
  const data: unknown = JSON.parse(text);
  if (isQuote(data)) return [{ quote: data, savedAt: new Date().toISOString() }];
  if (typeof data === 'object' && data && 'version' in data && data.version === 1 && 'quotes' in data && isSavedList(data.quotes)) return data.quotes;
  throw new Error('Ce fichier ne contient pas une sauvegarde de devis valide (version 1).');
}
