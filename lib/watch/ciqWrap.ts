/*
 * Zawijanie tekstu na ekranie zegarka — wykonywalna specyfikacja garmin/source/Wrap.mc (0.20). Szerokość mierzy funkcja `width` (na zegarku:
 * dc.getTextWidthInPixels). Zawija po spacjach; słowo szersze niż linia jest łamane w dowolnym miejscu (chiński i japoński nie mają spacji);
 * "\n" wymusza łamanie; spacje na początku linii są pomijane. Pliki „złote” z przypadkami: tests/ciq-gen.test.ts -> garmin/source/tests/Fixtures.mc.
 */
export function ciqWrapLines(text: string, maxW: number, width: (s: string) => number): string[] {
  const out: string[] = []; let cur = '';
  const lastSpace = (s: string) => { const a = [...s]; for (let i = a.length - 1; i >= 0; i--) if (a[i] === ' ') return i; return -1; };
  for (const ch of [...text]) {
    if (ch === '\n') { out.push(cur); cur = ''; continue; }
    if (cur.length === 0 && ch === ' ') continue;
    const cand = cur + ch;
    if (cur.length > 0 && width(cand) > maxW) {
      if (ch === ' ') { out.push(cur); cur = ''; }
      else {
        const sp = lastSpace(cur); const a = [...cur];
        if (sp > 0) { out.push(a.slice(0, sp).join('')); cur = a.slice(sp + 1).join('') + ch; } else { out.push(cur); cur = ch; }
      }
    } else cur = cand;
  }
  if (cur.length > 0) out.push(cur);
  return out;
}
