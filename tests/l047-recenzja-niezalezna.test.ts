/*
 * L-047 A (decyzja właściciela 28.10.2026, przekazana do M2 pętli 2 — audit/…/naprawy/przekazanie-M2-petla-2.md): recenzja niezależna obowiązkowa dla figur,
 * kart ćwiczeń i tekstów merytorycznych — wykonawca poprawki nie recenzuje własnej pracy. Strażnik zapisu recenzji (docs/research/figury-recenzja.json):
 * każdy wpis z werdyktem „wyswietlana” i datą od 28.10.2026 ma stan „zrecenzowana niezależnie…” oraz jawne pola `autor` i `recenzent`, różne od siebie;
 * „do recenzji niezależnej” przy „wyswietlana” to błąd. CLAUDE.md (sekcja „Animacje i karty ćwiczeń”) zapisuje regułę i wskazuje ten test.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const OD = '2026-10-28';
type Wpis = { werdykt?: string; data?: string; stan?: string; autor?: string; recenzent?: string };

/** Problemy zapisu recenzji: [sekcja/klucz: opis]. */
export function problemyRecenzji(d: Record<string, unknown>): string[] {
  const out: string[] = [];
  for (const [sek, v] of Object.entries(d)) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) continue;
    for (const [k, e] of Object.entries(v as Record<string, Wpis>)) {
      if (!e || typeof e !== 'object' || e.werdykt !== 'wyswietlana' || String(e.data ?? '') < OD) continue;
      const id = `${sek}/${k}`;
      if (!/^zrecenzowana niezależnie/.test(e.stan ?? '')) out.push(`${id}: stan bez „zrecenzowana niezależnie”`);
      if (/do recenzji niezależnej/.test(e.stan ?? '')) out.push(`${id}: „do recenzji niezależnej” przy „wyswietlana”`);
      if (!e.autor?.trim() || !e.recenzent?.trim()) out.push(`${id}: brak pola autor albo recenzent`);
      else if (e.autor.trim().toLowerCase() === e.recenzent.trim().toLowerCase()) out.push(`${id}: autor = recenzent`);
    }
  }
  return out;
}

describe('L-047 A: recenzja niezależna w zapisie recenzji', () => {
  test('docs/research/figury-recenzja.json: wpisy „wyswietlana” od 28.10.2026 mają recenzję niezależną (autor ≠ recenzent)', () => {
    expect(problemyRecenzji(JSON.parse(read('docs/research/figury-recenzja.json')))).toEqual([]);
  });
  test('strażnik potrafi paść: brak recenzenta, autor = recenzent, „do recenzji niezależnej”, stary wpis bez pól pomijany', () => {
    const d = { karty: {
      A: { werdykt: 'wyswietlana', data: '2026-10-28', stan: 'zrecenzowana niezależnie', autor: 'x' },
      B: { werdykt: 'wyswietlana', data: '2026-10-29', stan: 'zrecenzowana niezależnie', autor: 'rola 06', recenzent: 'Rola 06' },
      C: { werdykt: 'wyswietlana', data: '2026-10-28', stan: 'do recenzji niezależnej', autor: 'a', recenzent: 'b' },
      D: { werdykt: 'wyswietlana', data: '2026-10-27' },
      E: { werdykt: 'do poprawy', data: '2026-10-28' },
    } };
    expect(problemyRecenzji(d)).toEqual(['karty/A: brak pola autor albo recenzent', 'karty/B: autor = recenzent', 'karty/C: stan bez „zrecenzowana niezależnie”', 'karty/C: „do recenzji niezależnej” przy „wyswietlana”']);
  });
  test('CLAUDE.md: reguła „wykonawca nie recenzuje własnej pracy” wskazuje ten strażnik', () => {
    const c = read('CLAUDE.md');
    expect(c).toMatch(/nie recenzuje własnej pracy/); expect(c).toContain('tests/l047-recenzja-niezalezna.test.ts');
  });
});
