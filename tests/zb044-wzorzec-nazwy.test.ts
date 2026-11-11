/**
 * S21 — strażnik wzorca 34 w docs/32 „Nazwa ćwiczenia z biblioteki” (ZB-044; decyzje właściciela 07.11.2026 i 08.11.2026, wariant A „Podpis”):
 * (a) nazwa lokalna (`exLocal`) widoczna tylko na karcie ćwiczenia — inne pliki używają jej wyłącznie do wyszukiwania;
 * (b) każde wyszukiwanie ćwiczeń po nazwie wyświetlanej (`fold(exName(` / `normName(exName(`) szuka też po nazwie lokalnej;
 * (c) karta: tytuł = nazwa angielska z głosem `exNameLang`, nazwa lokalna osobnym elementem `exercise-local-name`.
 * Zakres skanu: wszystkie pliki .ts/.tsx w `app/`, `components/`, `lib/` (lista z `pliki()` niżej). Dlaczego: wyszukiwanie dodane bez nazwy lokalnej
 * nie znajdzie ćwiczenia po polsku, gdy lista nazw po recenzji powstanie — błąd niewidoczny przy dzisiejszej pustej mapie.
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = join(__dirname, '..');
const pliki = (dir: string): string[] => readdirSync(join(ROOT, dir)).flatMap(f => {
  const p = join(dir, f);
  return statSync(join(ROOT, p)).isDirectory() ? pliki(p) : /\.tsx?$/.test(f) ? [p] : [];
});
const ZAKRES = ['app', 'components', 'lib'].flatMap(pliki).map(p => relative(ROOT, join(ROOT, p)).split('\\').join('/'));

/** Pliki, w których `exLocal(` wolno wywołać — z powodem. */
const EXLOCAL_DOZWOLONE: Record<string, string> = {
  'lib/i18n.ts': 'definicja exLocal i exLocalFold',
  'app/exercise/[id].tsx': 'karta ćwiczenia — jedyne miejsce, gdzie nazwa lokalna jest widoczna (wariant A „Podpis”)',
  'app/more/import.tsx': 'tylko wyszukiwanie w wyborze ćwiczenia przy imporcie (normName, nie wyświetlanie)',
};
/** Pliki z wyszukiwaniem po exName bez nazwy lokalnej — z powodem. */
const WYSZUKIWANIE_WYJATKI: Record<string, string> = {
  'lib/seed.ts': 'formerMatch/formerExact — dopasowanie po DAWNYCH nazwach katalogu, nie po bieżącej nazwie ćwiczenia',
};

export function naruszeniaExLocal(plik: string, tresc: string): string[] {
  return /\bexLocal\(/.test(tresc) && !(plik in EXLOCAL_DOZWOLONE) ? [`${plik}: exLocal( poza kartą — wyświetlanie nazwy lokalnej tylko na karcie (docs/32 wzorzec 34)`] : [];
}
export function naruszeniaWyszukiwania(plik: string, tresc: string): string[] {
  return /\b(fold|normName)\(exName\(/.test(tresc) && !/\bexLocal(Fold)?\(/.test(tresc) && !(plik in WYSZUKIWANIE_WYJATKI)
    ? [`${plik}: wyszukiwanie po exName bez nazwy lokalnej (exLocalFold) — docs/32 wzorzec 34`] : [];
}

describe('S21 (ZB-044, 07.11.2026 i 08.11.2026): nazwa ćwiczenia z biblioteki — docs/32 wzorzec 34', () => {
  test('zakres skanu obejmuje ekrany wyszukiwania ćwiczeń', () => {
    for (const f of ['app/picker.tsx', 'app/swap.tsx', 'app/exercises.tsx', 'app/(tabs)/progress.tsx', 'app/more/import.tsx', 'lib/swap.ts']) expect(ZAKRES).toContain(f);
  });
  test('(a) exLocal( tylko w plikach z listy dozwolonych', () => {
    expect(ZAKRES.flatMap(f => naruszeniaExLocal(f, readFileSync(join(ROOT, f), 'utf8')))).toEqual([]);
  });
  test('(b) każde wyszukiwanie po exName szuka też po nazwie lokalnej', () => {
    expect(ZAKRES.flatMap(f => naruszeniaWyszukiwania(f, readFileSync(join(ROOT, f), 'utf8')))).toEqual([]);
  });
  test('wyjątki są aktualne (plik istnieje i nadal ma dany wzorzec)', () => {
    for (const f of Object.keys(EXLOCAL_DOZWOLONE)) expect([f, /\bexLocal\(/.test(readFileSync(join(ROOT, f), 'utf8'))]).toEqual([f, true]);
    for (const f of Object.keys(WYSZUKIWANIE_WYJATKI)) expect([f, /\b(fold|normName)\(exName\(/.test(readFileSync(join(ROOT, f), 'utf8'))]).toEqual([f, true]);
  });
  test('(c) karta: tytuł exName z głosem exNameLang, nazwa lokalna osobnym elementem exercise-local-name', () => {
    const k = readFileSync(join(ROOT, 'app/exercise/[id].tsx'), 'utf8');
    expect(k).toMatch(/<H1 a11yLang=\{exNameLang\(e\)\}>\{exName\(e\)\}<\/H1>/);
    expect(k).toMatch(/testID="exercise-local-name"/);
  });
  test('strażnik łapie naruszenia (przykłady negatywne i pozytywne)', () => {
    expect(naruszeniaExLocal('app/workout.tsx', 'const n = exLocal(e);')).toHaveLength(1);
    expect(naruszeniaExLocal('app/workout.tsx', 'const n = exLocalFold(e);')).toEqual([]);
    expect(naruszeniaWyszukiwania('app/nowy.tsx', 'xs.filter(e => fold(exName(e)).includes(q))')).toHaveLength(1);
    expect(naruszeniaWyszukiwania('app/nowy.tsx', 'xs.filter(e => fold(exName(e)).includes(q) || exLocalFold(e).includes(q))')).toEqual([]);
    expect(naruszeniaWyszukiwania('lib/seed.ts', 'fold(exName({ name: n }))')).toEqual([]);
  });
});
