// Shared "Mes devis", stored by the site (api/outils-quotes.js) so Antony and
// Julien see the same list on every device. The draft being edited stays local.
import { isQuote } from './model';
import type { Quote, SavedQuote } from './model';

const API = '/api/outils-quotes/';

/** Thrown when the shared list can't be reached (offline, signed out, local dev). */
export class RemoteUnavailable extends Error {}

async function call(init?: RequestInit, query = ''): Promise<unknown> {
  let res: Response;
  try { res = await fetch(API + query, { cache: 'no-store', ...init }); }
  catch { throw new RemoteUnavailable('network'); }
  if (res.status === 401 || res.status === 404 || res.status === 503) throw new RemoteUnavailable(String(res.status));
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !(body as { ok?: boolean }).ok) throw new Error((body as { error?: string }).error || String(res.status));
  return body;
}

const validItem = (x: unknown): x is SavedQuote =>
  !!x && typeof x === 'object' && isQuote((x as SavedQuote).quote) && typeof (x as SavedQuote).savedAt === 'string';

export async function listRemote(): Promise<SavedQuote[]> {
  const body = await call() as { quotes?: unknown[] };
  return (body.quotes ?? []).filter(validItem); // skip anything that no longer matches the quote format
}

export async function saveRemote(quote: Quote): Promise<SavedQuote> {
  const body = await call({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quote }) }) as { item: SavedQuote };
  return body.item;
}

export async function deleteRemote(id: string): Promise<void> {
  await call({ method: 'DELETE' }, `?id=${encodeURIComponent(id)}`);
}

/** Merges saved items into a list (replacing by quote id), newest first. */
export const mergeSaved = (list: SavedQuote[], items: SavedQuote[]) => {
  const byId = new Map(list.map(s => [s.quote.id, s]));
  for (const item of items) byId.set(item.quote.id, item);
  return [...byId.values()].sort((a, b) => b.savedAt.localeCompare(a.savedAt));
};

const MIGRATED_KEY = 'devis-web:shared-migrated:v1';
/** Quotes saved in this browser before sharing existed are uploaded once, then never again
 *  (otherwise a quote deleted on another device would come back from this one's cache). */
export function needsMigration() { try { return localStorage.getItem(MIGRATED_KEY) !== '1'; } catch { return false; } }
export function markMigrated() { try { localStorage.setItem(MIGRATED_KEY, '1'); } catch { /* private mode */ } }
