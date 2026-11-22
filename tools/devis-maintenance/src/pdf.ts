import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { categories } from './catalogue';
import { NO_VAT_MENTION, displayDate, expiryDate, exportErrors, linePrice, noVat, partyLines, selectedServices, summaryRows } from './model';
import type { Party, Quote } from './model';

type RGB = [number, number, number];
// The Vitrine palette
const NAVY: RGB = [8, 18, 39];      // night  #081227
const ACCENT: RGB = [168, 67, 31];  // rust   #a8431f
const LAMP: RGB = [255, 194, 125];  // lamp   #ffc27d
const PAPER: RGB = [250, 247, 242]; // paper  tint of #f6f3ee
const MUTED: RGB = [93, 87, 79];    // ink-soft #5d574f
/** Logo is 250 × 64 in its SVG viewBox. */
const LOGO_W = 54, LOGO_H = LOGO_W * 64 / 250;
const PAGE_BOTTOM = 276;

/** jsPDF's built-in Helvetica only covers Latin-1: swap the characters it cannot draw. */
const pdfText = (s: string) => s
  .replaceAll(' ', ' ').replaceAll(' ', ' ')
  .replaceAll('œ', 'oe').replaceAll('Œ', 'OE')
  .replaceAll('’', "'").replaceAll('–', '-').replaceAll('−', '-').replaceAll('…', '...');

const lastTableY = (doc: jsPDF) => (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;

export function buildPdf(q: Quote, opts: { logo?: string } = {}) {
  const errors = exportErrors(q);
  if (errors.length) throw new Error(errors.join(' '));
  const doc = new jsPDF();
  doc.setProperties({ title: `${q.reference} - ${q.title}`, subject: 'Devis de maintenance web', author: q.provider.name });

  // Header band
  doc.setFillColor(...NAVY); doc.rect(0, 0, 210, 48, 'F');
  doc.setFillColor(...LAMP); doc.rect(0, 48, 210, 2, 'F');
  if (opts.logo) doc.addImage(opts.logo, 'PNG', 16, 10, LOGO_W, LOGO_H);
  doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(25); doc.text('DEVIS', 194, 22, { align: 'right' });
  doc.setFontSize(11); doc.setFont('helvetica', 'normal'); doc.setTextColor(246, 242, 234);
  doc.text(doc.splitTextToSize(pdfText(q.title), 170).slice(0, 2).join('\n'), 16, 36);

  let y = 61;
  const room = (height: number) => { if (y + height > PAGE_BOTTOM) { doc.addPage(); y = 20; } };
  const section = (title: string, body: string, small = false) => {
    room(20);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...ACCENT);
    doc.text(pdfText(title), 16, y); y += 7;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...NAVY); doc.setFontSize(small ? 9 : 10);
    const lines: string[] = doc.splitTextToSize(pdfText(body || 'Non renseigné'), 176);
    for (const line of lines) { room(6); doc.text(line, 16, y); y += 5; }
    y += 5;
  };
  const partyText = (party: Party) => [party.name, ...partyLines(party)].join('\n');

  section(`Référence : ${q.reference}`, [
    `Émis le ${displayDate(q.date)} • Valable jusqu’au ${displayDate(expiryDate(q))}`,
    `Site : ${q.website || 'À préciser'}`,
    `Facturation ${q.billing === 'annual' ? 'annuelle' : 'mensuelle'} • Engagement : ${q.commitment ? `${q.commitment} mois` : 'sans engagement'} • Début : ${displayDate(q.startDate)}`,
  ].join('\n'));
  section('PRESTATAIRE', partyText(q.provider));
  section('CLIENT', partyText(q.client));

  // Services table, grouped in catalogue order
  room(28);
  const chosen = selectedServices(q);
  const rows = categories.flatMap(category => chosen
    .filter(s => s.category === category.id)
    .map(s => [pdfText(`${s.name}\n${s.description}`), pdfText(category.name), pdfText(linePrice(q.prices[s.id]))]));
  autoTable(doc, {
    startY: y, margin: { left: 16, right: 16, bottom: 22, top: 20 },
    head: [['Prestations incluses', 'Catégorie', noVat(q) ? 'Prix / mois' : 'Prix HT / mois']], body: rows,
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 3.5, overflow: 'linebreak', textColor: NAVY },
    headStyles: { fillColor: NAVY, textColor: 255 }, alternateRowStyles: { fillColor: PAPER },
    columnStyles: { 0: { cellWidth: 102 }, 1: { cellWidth: 42 }, 2: { cellWidth: 34, halign: 'right' } },
    rowPageBreak: 'avoid',
  });
  y = lastTableY(doc) + 12;

  // Totals
  const summary = summaryRows(q);
  room(90);
  autoTable(doc, {
    startY: y, margin: { left: 65, right: 16, bottom: 22 },
    body: summary.map(r => [pdfText(r.label), pdfText(r.value)]), theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2.7, textColor: NAVY },
    columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
    didParseCell(data) {
      if (summary[data.row.index]?.highlight) { data.cell.styles.fillColor = NAVY; data.cell.styles.textColor = 255; }
    },
  });
  y = lastTableY(doc) + 6;
  if (noVat(q)) {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...NAVY);
    doc.text(pdfText(NO_VAT_MENTION), 194, y, { align: 'right' });
    y += 6;
  }
  y += 6;

  section('MODALITÉS DE PAIEMENT', q.payment, true);
  section('CONDITIONS DE L’ABONNEMENT', q.conditions, true);
  if (q.notes.trim()) section('PRÉCISIONS', q.notes, true);

  room(38); doc.setDrawColor(210, 214, 225); doc.line(16, y, 194, y); y += 8;
  doc.setFontSize(10); doc.text(pdfText('Bon pour accord – date et signature du client :'), 16, y);

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i); doc.setFontSize(8); doc.setTextColor(...MUTED);
    doc.text(doc.splitTextToSize(pdfText(`${q.provider.name} • ${q.reference}`), 150)[0], 16, 287);
    doc.text(`${i} / ${pages}`, 194, 287, { align: 'right' });
  }
  return doc;
}

/** Loads the light PNG logo (1500 × 384) as a data URL. Resolves to undefined if it cannot load. */
async function loadLogo(): Promise<string | undefined> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}brand/logo-light.png`);
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch { return undefined; }
}

export async function downloadPdf(q: Quote) {
  const safeName = q.reference.replace(/[^\p{L}\p{N}_-]/gu, '-').slice(0, 80) || 'devis';
  buildPdf(q, { logo: await loadLogo() }).save(`${safeName}.pdf`);
}
