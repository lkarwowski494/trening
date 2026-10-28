/* M1-audytor-generalny-034 (audyt 1.0, 27.10.2026; 07-jakosc-007): zapadka stuknięć „po tekście” w scenariuszach Maestro (decyzja właściciela 18.10.2026,
 * docs/18: stałe identyfikatory i test blokujący nowe kliknięcia po tekście). Zmiana etykiety kładzie takie scenariusze (L-010, L-011). Stan zastany jest
 * na liście bazowej `tests/maestro-tap-tekst-baza.json` (plik → tekst, liczba), która może tylko maleć: nowe stuknięcie po tekście = błąd (użyj `id`),
 * usunięte — wymagane usunięcie z listy (UPDATE_TAP_BASE=1 przepisuje listę, gdy liczby tylko maleją). */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dir = join(__dirname, '../.maestro'); const BASE = join(__dirname, 'maestro-tap-tekst-baza.json');
const files = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : e.name.endsWith('.yaml') ? [join(d, e.name)] : []);
/** Liczba stuknięć po tekście w treści scenariusza: `tapOn: "…"` i `tapOn: { text: "…" … }` (bez `id:`). */
export function tapsByText(src: string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const line of src.split('\n')) {
    const l = line.replace(/#.*$/, ''); let m = /^\s*-?\s*tapOn:\s*"((?:[^"\\]|\\.)*)"/.exec(l) ?? /^\s*-?\s*tapOn:\s*\{[^}]*\btext:\s*"((?:[^"\\]|\\.)*)"/.exec(l);
    if (m && !/\bid:/.test(l)) out[m[1]] = (out[m[1]] ?? 0) + 1;
  }
  return out;
}
const current = () => Object.fromEntries(files(dir).map(f => [f.slice(dir.length + 1), tapsByText(readFileSync(f, 'utf8'))] as const).filter(([, v]) => Object.keys(v).length).sort());

describe('M1-034: zapadka stuknięć po tekście (Maestro)', () => {
  test('parser: tekst w cudzysłowie i { text: … } liczone, { id: … } nie', () => {
    expect(tapsByText('- tapOn: "Back"\n- tapOn: { text: "Finish", below: "x" }\n- tapOn: { id: "save" }\n  # - tapOn: "x"')).toEqual({ Back: 1, Finish: 1 });
  });
  test('nowe stuknięcie po tekście ponad listę bazową = błąd; usunięte musi zniknąć z listy (lista tylko maleje)', () => {
    const base = JSON.parse(readFileSync(BASE, 'utf8')) as Record<string, Record<string, number>>; const cur = current();
    const more: string[] = []; const less: string[] = [];
    for (const [f, m] of Object.entries(cur)) for (const [t, n] of Object.entries(m)) { const b = base[f]?.[t] ?? 0; if (n > b) more.push(`${f}: "${t}" ${b}→${n}`); }
    for (const [f, m] of Object.entries(base)) for (const [t, n] of Object.entries(m)) { const c = cur[f]?.[t] ?? 0; if (c < n) less.push(`${f}: "${t}" ${n}→${c}`); }
    if (process.env.UPDATE_TAP_BASE === '1' && !more.length) writeFileSync(BASE, JSON.stringify(cur, null, 1) + '\n');
    expect(more).toEqual([]); if (process.env.UPDATE_TAP_BASE !== '1') expect(less).toEqual([]);
  });
});
