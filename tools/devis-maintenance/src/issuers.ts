// Who issues the quote: Antony or Julien, each as an entrepreneur individuel.
// Details come straight from the site's legal notice (src/data/legal.ts), so
// there is one place to update them. French law (since 2022) requires "EI"
// after an entrepreneur individuel's name on business documents.
import { publishers } from '../../../src/data/legal';
import type { Party } from './model';

export type IssuerId = 'antony' | 'julien';

const decodePhone = (encoded: string) => {
  const digits = atob(encoded).split('').reverse().join('');
  return digits.startsWith('33') && digits.length === 11 ? `+33 ${digits[2]} ${digits.slice(3).match(/../g)!.join(' ')}` : `+${digits}`;
};

export function issuerParty(id: IssuerId): Party {
  const p = publishers.find(x => x.name.toLowerCase().startsWith(id));
  if (!p) return { name: '', contact: '', email: '', phone: '', address: '', registration: '', vatNumber: '' };
  const phone = typeof p.phone === 'string' ? p.phone : p.phone ? decodePhone(p.phone.protected) : '';
  return {
    name: `${p.name} EI · The Vitrine`,
    contact: p.name,
    email: p.email ?? '',
    phone,
    address: p.address ?? '',
    registration: typeof p.siret === 'string' ? p.siret : '',
    vatNumber: '',
  };
}

export const issuerIds: IssuerId[] = ['antony', 'julien'];
export const issuerName = (id: IssuerId) => (id === 'antony' ? 'Antony Addy' : 'Julien Bourgois');
