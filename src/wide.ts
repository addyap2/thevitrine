// Which cards in a section run double-width, so every row of the grid is full.
// Three columns: a section of n cards needs (3 - n % 3) % 3 extra slots, so the
// first card goes wide, and when two slots are missing the last one does too.
// Two columns: an odd count makes the first card span the row.
// Used at build time and again after every filter change.
export function spans(n: number): { w3: Set<number>; w2: Set<number> } {
  const w3 = new Set<number>();
  const w2 = new Set<number>();
  if (n === 0) return { w3, w2 };
  const extra = (3 - (n % 3)) % 3;
  if (extra >= 1) w3.add(0);
  if (extra === 2 && n > 1) w3.add(n - 1);
  if (n % 2 === 1) w2.add(0);
  return { w3, w2 };
}
