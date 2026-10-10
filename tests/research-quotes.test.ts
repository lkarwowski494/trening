/*
 * SEC2-04 (audyt kontrolny 1, 09.10.2026): CLAUDE.md („Treści cudze i nazwy innych firm”) — „w repo cytat ze źródła najwyżej 1–2 zdania z adresem
 * i miejscem (prawo cytatu) — test pilnuje długości cytatów w docs/research”. Ten test to robi: każdy fragment cytowany w docs/research
 * (w .md/.html/.txt/.csv: „…”, “…”, "…" od 40 znaków i bloki „>”; w .json: pola quote/cytat/excerpt/snippet/evidence/fragment) ma najwyżej
 * QUOTE_MAX_SENTENCES zdań i QUOTE_MAX_CHARS znaków. Wielokropek (…) to opuszczenie, nie koniec zdania.
 * Pliki, które dziś nie przechodzą — znane wyjątki z liczbą długich fragmentów i powodem „przenosi się na Dysk (SEC2-03)” (tests/research-quotes.json):
 * liczba nie może rosnąć, nowy plik bez wyjątku nie przejdzie, wyjątek bez długich fragmentów trzeba usunąć. Samo przeniesienie — operacja koordynatora.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const DIR = 'docs/research';
type Known = { path: string; long: number; reason: string };
const CFG: { QUOTE_MAX_SENTENCES: number; QUOTE_MAX_CHARS: number; known: Known[] } = JSON.parse(fs.readFileSync(path.join(__dirname, 'research-quotes.json'), 'utf8'));
const { QUOTE_MAX_SENTENCES, QUOTE_MAX_CHARS } = CFG;

const walk = (d: string): string[] => fs.existsSync(path.join(ROOT, d)) ? fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
/** Liczba zdań: koniec zdania = . ! ? i spacja przed wielką literą, cyfrą albo cudzysłowem. */
export const sentences = (q: string) => q.trim().split(/(?<=[.!?])\s+(?=[\p{Lu}\d„"(“])/u).filter(x => x.trim()).length;
export const tooLong = (q: string) => q.length > QUOTE_MAX_CHARS || sentences(q) > QUOTE_MAX_SENTENCES;
/** Fragmenty cytowane w pliku. */
export function quotes(file: string, s: string): string[] {
  const qs: string[] = [];
  if (file.endsWith('.json')) {
    const wj = (o: unknown, k?: string) => { if (typeof o === 'string') { if (/quote|cytat|excerpt|snippet|evidence|fragment/i.test(k ?? '')) qs.push(o); } else if (o && typeof o === 'object') for (const [kk, v] of Object.entries(o)) wj(v, Array.isArray(o) ? k : kk); };
    try { wj(JSON.parse(s)); } catch { /* nie-JSON — bez cytatów */ }
  } else if (/\.(md|html|txt|csv)$/.test(file)) {
    for (const m of s.matchAll(/„([^”]{20,})”/g)) qs.push(m[1]);
    for (const m of s.matchAll(/“([^”]{20,})”/g)) qs.push(m[1]);
    for (const m of s.matchAll(/(?:^|[\s(:])"([^"\n]{40,})"/g)) qs.push(m[1]);
    for (const m of s.matchAll(/(?:^>.*\n?)+/gm)) qs.push(m[0].replace(/^>\s?/gm, ''));
  }
  return qs;
}
const longIn = (f: string) => quotes(f, fs.readFileSync(path.join(ROOT, f), 'utf8')).filter(tooLong).length;

describe('SEC2-04: cytaty w docs/research — najwyżej 1–2 zdania', () => {
  const files = walk(DIR);
  const counts = new Map(files.map(f => [f, longIn(f)] as const));
  test('reguła: limity w jednym miejscu; 2 zdania przechodzą, 3 nie; wielokropek to opuszczenie; za długie jedno zdanie nie przechodzi', () => {
    expect([QUOTE_MAX_SENTENCES, QUOTE_MAX_CHARS]).toEqual([2, 300]);
    expect(tooLong('Stand upright. Lower the bar slowly.')).toBe(false);
    expect(tooLong('Stand upright. Lower the bar. Repeat.')).toBe(true);
    expect(tooLong('2-3 d for novice … 3-4 … intermediate')).toBe(false);
    expect(tooLong('a'.repeat(QUOTE_MAX_CHARS + 1))).toBe(true);
    expect(quotes('x.md', 'Źródło: „Stand upright. Lower the bar. Repeat.” (s. 3)\n> One. Two. Three.\n')).toHaveLength(2);
    expect(quotes('x.json', JSON.stringify({ src: { quote: 'A. B. C.', note: 'X. Y. Z.' } }))).toEqual(['A. B. C.']);
  });
  test('każdy plik bez znanego wyjątku przechodzi; plik z wyjątkiem nie ma więcej długich cytatów niż zapisano', () => {
    const bad: string[] = [];
    for (const [f, n] of counts) { const k = CFG.known.find(x => x.path === f); if (n > (k?.long ?? 0)) bad.push(`${f}: ${n} długich cytatów${k ? ` (zapisano ${k.long})` : ''}`); }
    expect(bad).toEqual([]);
  });
  test('znane wyjątki: istniejący plik w docs/research, powód SEC2-03, wciąż potrzebny (inaczej usuń z listy)', () => {
    for (const k of CFG.known) expect({ p: k.path, exists: counts.has(k.path), reason: /SEC2-03/.test(k.reason), needed: (counts.get(k.path) ?? 0) > 0 }).toEqual({ p: k.path, exists: true, reason: true, needed: true });
  });
});
