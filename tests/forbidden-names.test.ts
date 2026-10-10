/*
 * TST2-08 / SEC2-05 (audyt kontrolny 1, 09.10.2026): strażnik zasady właściciela z 09.10.2026 — nazwy innych aplikacji i marek nie w kodzie, nie
 * w komentarzach, nie w testach, nie w tekstach aplikacji ani w metadanych App Store (CLAUDE.md „Treści cudze i nazwy innych firm”; decyzja
 * 09.10 (2) B — opisy neutralne). Lista nazw i wyjątki z powodem: tests/forbidden-names.json (jedno miejsce), dopasowanie: tests/forbidden-names.ts.
 * Ten plik nazw nie zawiera (przykłady biorą je z listy). docs/ poza testem (dokumenty; research konkurencji w docs/research → Dysk, SEC2-03).
 */
import { CFG, ALL_NAMES, namesIn, exceptionFor, inScope, scan } from './forbidden-names';

/** Nazwa z listy po uproszczonej postaci (małe litery, bez spacji i łączników) — żeby przykłady nie wpisywały nazw. */
const pick = (lc: string) => { const n = ALL_NAMES.find(x => x.toLowerCase().replace(/[\s-]/g, '') === lc); if (!n) throw new Error(`brak na liście: ${lc}`); return n; };

describe('TST2-08: nazwy innych aplikacji i marek poza kodem, komentarzami, testami i tekstami aplikacji', () => {
  const hits = scan();
  test('lista nazw i wyjątków: niepusta, bez powtórzeń; każdy wyjątek ma powód (≥ 20 znaków), nazwę z listy i ścieżkę w zakresie', () => {
    expect(ALL_NAMES.length).toBeGreaterThan(20); expect(new Set(ALL_NAMES).size).toBe(ALL_NAMES.length);
    for (const x of CFG.exceptions) expect({ x, reason: x.reason.trim().length >= 20, listed: x.name === '*' || ALL_NAMES.includes(x.name), inScope: inScope(x.path) }).toEqual({ x, reason: true, listed: true, inScope: true });
  });
  test('brak nazw poza wyjątkami (plik:linia: nazwa)', () => {
    expect(hits.filter(h => !exceptionFor(h.f, h.n)).map(h => `${h.f}:${h.line}: ${h.n}`)).toEqual([]);
  });
  test('każdy wyjątek jest jeszcze potrzebny (nieużywany — do usunięcia z listy)', () => {
    expect(CFG.exceptions.filter(x => !hits.some(h => exceptionFor(h.f, h.n) === x)).map(x => `${x.path}: ${x.name}`)).toEqual([]);
  });
  test('dopasowanie: całe słowo z polską końcówką; nie wewnątrz innego słowa; id sprzętu i presetów małymi literami z „_” dozwolone', () => {
    const app = pick('strong'), ball = pick('bosu'), ski = pick('ski' + 'erg'), st = pick('vi' + 'shape') /* sklejane — wielkość liter bez znaczenia, inaczej przykład sam byłby trafieniem */;
    expect(namesIn(`format CSV ${app}a`)).toEqual([app]);
    expect(namesIn(`${app}er by Science`)).toEqual([]);
    expect(namesIn(`'${ball.toLowerCase()}', 'ski_erg', 'cardio.ski', '${st.toLowerCase()}_pro'`)).toEqual([]);
    expect(namesIn(`${ball} / platforma`)).toEqual([ball]);
    expect(namesIn(ski.toLowerCase())).toEqual([ski]);
    expect(namesIn('docs/research')).toEqual([]);
  });
  test('docs/ poza zakresem (dokumenty; research → Dysk, SEC2-03), kod i teksty aplikacji w zakresie', () => {
    expect(inScope('docs/research/x.md')).toBe(false); expect(inScope('docs/18-przekazanie.md')).toBe(false);
    for (const p of ['app/x.tsx', 'components/x.tsx', 'lib/x.ts', 'lib/locales/de.json', 'locales/de.json', 'store/x.json', 'tests/x.ts', 'scripts/x.mjs', 'modules/x.swift', 'targets/x.swift', 'plugins/x.js']) expect({ p, in: inScope(p) }).toEqual({ p, in: true });
  });
});
