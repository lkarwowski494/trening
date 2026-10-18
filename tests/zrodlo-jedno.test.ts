/* Zmiana zasady „jedno źródło” (decyzja właściciela 18.10.2026; raport badacza, CLAUDE.md, docs/18).
 * Jedno źródło szczebla 1–2, które zawiera twierdzenie wprost, czyni regułę ustaloną (bez oznaczenia); szczebel 3–5 — oznaczenie zostaje;
 * „uproszczenie” (także analogia) i „konwencja” — niezależnie od liczby źródeł.
 * Rodzaje (docs/20): dane (pewność 12 ćwiczeń, 213 + 2 bez zmian), logika (dopisek na ekranie ćwiczenia), języki (teksty U1–U3 w 35 językach),
 * wygląd/kod (komentarze), dokumenty (zasada w CLAUDE.md i agencie). */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG_RESEARCH } from '@/lib/catalog.generated';
import { MUSCLE_SOURCES, muscleConfidence } from '@/lib/seed';
import { EN } from '@/lib/i18n.en';
import { LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, go, openInfo } from './app';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';

const root = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const R = CATALOG_RESEARCH as Record<string, readonly [string, string, readonly string[]]>;

/* Wariant B (owner 18.10.2026, zmiana po A): 3 ćwiczenia, których twierdzenie zawiera przegląd szczebla 2 wprost — „ustalone (przegląd)” z własnym dopiskiem */
const USTALONE = ['Lying Leg Raise', 'Stomach Vacuum', "Farmer's Walk (Farmers Handles)"];
/* 9 analogii do ćwiczeń z przeglądu szczebla 2 — „uproszczenie (analogia)”: pokazuje się istniejący dopisek „uproszczenie, nie wynik badań” */
const ANALOGIE = ['Cocoons', 'Scissor Kick', 'Cable Seated Crunch', 'Cable Deadlift', 'Leverage Deadlift', 'Barbell Guillotine Bench Press', 'Close-Grip Dumbbell Press',
  'Decline Close-Grip Bench To Skull Crusher', "Farmer's Walk (trap bar)"];
/* [OTWARTE] badacz 18.10.2026: czytane tylko streszczenie NSCA 2023 / brak zdania o momentach odwodzenia w przeglądzie — oznaczenie zostaje */
const NIEJASNE = ['Block Power Snatch', 'Yoke Walk'];
const ONE = (k: string) => R[k][1].startsWith('jedno źródło');

describe('dane: pewność przypisania partii po zmianie zasady „jedno źródło” (CATALOG_RESEARCH)', () => {
  test('12 ćwiczeń zmienia poziom pewności: 3 → „ustalone (przegląd)”, 9 → „uproszczenie (analogia)”; wiersz zachowuje część i źródła', () => {
    for (const k of USTALONE) { expect([k, R[k][1]]).toEqual([k, 'ustalone (przegląd)']); expect(R[k][2].length).toBeGreaterThan(0); }
    for (const k of ANALOGIE) { expect([k, R[k][1]]).toEqual([k, 'uproszczenie (analogia)']); expect(R[k][2].length).toBeGreaterThan(0); }
    expect(new Set([...USTALONE, ...ANALOGIE]).size).toBe(12);
  });
  test('213 ćwiczeń zostaje „jedno źródło” (w tym 11 − 2 analogii) i 2 niejasne z oznaczeniem; razem 215 (było 227)', () => {
    const wszystkie = Object.keys(R).filter(ONE);
    expect(wszystkie.length).toBe(215);
    for (const k of NIEJASNE) expect([k, R[k][1]]).toEqual([k, 'jedno źródło']);
    const zostaje = wszystkie.filter(k => !NIEJASNE.includes(k));
    expect(zostaje.length).toBe(213);
    expect(zostaje.filter(k => [...USTALONE, ...ANALOGIE].includes(k))).toEqual([]);
    expect(wszystkie.filter(k => R[k][1] === 'jedno źródło (analogia)').length).toBe(9); /* było 11: Cable Deadlift i Leverage Deadlift przeszły na „uproszczenie (analogia)” */
  });
  test('dopisek na ekranie ćwiczenia: „ustalone (przegląd)” → własny dopisek (poza MUSCLE_SOURCES), analogie → bez wpisu (dopisek „uproszczenie”), niejasne → „jedno źródło”', () => {
    for (const k of USTALONE) { expect([k, k in MUSCLE_SOURCES]).toEqual([k, false]); expect(muscleConfidence({ lib: true, libKey: k })).toBe('ustalone (przegląd)'); }
    for (const k of ANALOGIE) { expect([k, k in MUSCLE_SOURCES]).toEqual([k, false]); expect(muscleConfidence({ lib: true, libKey: k })!.startsWith('jedno źródło')).toBe(false); }
    for (const k of NIEJASNE) { expect([k, k in MUSCLE_SOURCES]).toEqual([k, false]); expect(muscleConfidence({ lib: true, libKey: k })!.startsWith('jedno źródło')).toBe(true); }
  });
  test('katalog docs/research/equipment/catalog.json i pliki L3–L6.json mają te same wartości (źródło danych dla gen.mjs)', () => {
    const cat = JSON.parse(read('docs/research/equipment/catalog.json')) as { name: string; research?: { confidence: string } }[];
    for (const k of [...USTALONE, ...ANALOGIE, ...NIEJASNE]) expect([k, cat.find(x => x.name === k)!.research!.confidence]).toEqual([k, R[k][1]]);
    for (const part of ['L3', 'L4', 'L5', 'L6']) {
      const rows = JSON.parse(read(`docs/research/25-biblioteka/${part}.json`)) as { name?: string; key?: string; confidence?: string }[];
      for (const k of [...USTALONE, ...ANALOGIE, ...NIEJASNE].filter(x => R[x][0] === part)) {
        const row = rows.find(r => (r.name ?? r.key) === k);
        if (row) expect([k, row.confidence]).toEqual([k, R[k][1]]);
      }
    }
  });
});

describe('języki: teksty U1–U3 bez „jedno źródło” (35 języków)', () => {
  const U1_PL = 'Każda główna partia co najmniej {n} dni w tygodniu (WHO 2020 — zalecenie dla zdrowia; ACSM 2026: siła rośnie przy co najmniej {n} sesjach tygodniowo). Dzień, w którym partia pracuje tylko pomocniczo, liczy się jako {h} — uproszczenie (metoda z metaanalizy Pelland i in. 2026). Podział na sesje (FBW, góra/dół) to konwencja — przy tej samej liczbie serii daje podobne efekty.';
  const U2_PL = 'Serie na partię w tygodniu (pomocnicza = {h} serii — uproszczenie): {list}';
  const U3_PL = 'Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii (główna 1, pomocnicza 0,5; metaanaliza Pelland i in. 2026).';
  const EKRANY = ['app/generator.tsx', 'components/OwnPlan.tsx', 'app/(tabs)/progress.tsx', 'components/GuardSection.tsx'];
  const NOWE = [U1_PL, U2_PL, U3_PL];
  const NOWE_DOPISEK = ['Przypisanie partii: przegląd badań.', 'Przypisanie partii mięśniowych — ustalone na podstawie przeglądu badań dla tego ćwiczenia. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu.'];
  const PREFIKSY = ['Każda główna partia co najmniej {n} dni', 'Serie na partię w tygodniu (pomocnicza', 'Uproszczenie: partia pomocnicza ćwiczenia liczy się za pół serii'];
  const params = (x: string) => (x.match(/\{\w+\}/g) ?? []).sort().join(',');

  test('polski klucz: oznaczenie „uproszczenie” (i „konwencja” w U1) zostaje, „jedno źródło” znika — w kodzie ekranów i w słowniku EN', () => {
    for (const k of NOWE) { expect(k).not.toMatch(/jedno źródło/i); expect(typeof EN[k]).toBe('string'); expect(EN[k]).not.toMatch(/single source|one source/i); }
    expect(EN[U1_PL]).toMatch(/simplification/); expect(EN[U1_PL]).toMatch(/convention/); expect(EN[U2_PL]).toMatch(/simplification/); expect(EN[U3_PL]).toMatch(/^Simplification/);
    for (const f of EKRANY) for (const m of read(f).matchAll(/\bt\('((?:[^'\\]|\\.)*)'/g)) if (PREFIKSY.some(p => m[1].startsWith(p))) expect([f, m[1]]).toEqual([f, expect.not.stringMatching(/jedno źródło/)]);
    for (const k of NOWE) { const used = EKRANY.some(f => read(f).includes(k.replace(/'/g, "\\'"))); expect([k, used]).toEqual([k, true]); }
  });
  test('słownik EN i _source.json: nie ma starych kluczy z „jedno źródło” dla U1–U3', () => {
    for (const p of PREFIKSY) {
      const keys = Object.keys(EN).filter(k => k.startsWith(p)); expect([p, keys.length]).toEqual([p, 1]); expect(keys[0]).not.toMatch(/jedno źródło/);
      const src = JSON.parse(read('lib/locales/_source.json')) as { pl: string; en: string }[];
      const rows = src.filter(r => r.pl.startsWith(p)); expect([p, rows.length]).toEqual([p, 1]); expect(rows[0].pl).not.toMatch(/jedno źródło/); expect(rows[0].en).not.toMatch(/single source|one source/i);
    }
  });
  describe.each(LANGS.filter(l => l !== 'pl' && l !== 'en'))('%s', l => {
    test('trzy nowe teksty przetłumaczone (inne niż polski), z tymi samymi parametrami; bez starych kluczy z „jedno źródło”', () => {
      const d = LOCALES[l]!;
      for (const k of NOWE) { expect([l, k, typeof d[k]]).toEqual([l, k, 'string']); expect([l, k, d[k] !== k]).toEqual([l, k, true]); expect(params(d[k])).toBe(params(k)); }
      for (const p of PREFIKSY) expect([l, p, Object.keys(d).filter(k => k.startsWith(p) && !NOWE.includes(k))]).toEqual([l, p, []]);
    });
    test('dopisek „przegląd badań” (krótki i ⓘ): przetłumaczony, inny niż polski, z kontrastem do „jedno źródło” i „uproszczenie”', () => {
      const d = LOCALES[l]!; const inne = ['Przypisanie partii: jedno źródło.', 'Przypisanie partii: uproszczenie.'].map(k => d[k]);
      for (const k of NOWE_DOPISEK) { expect([l, k, typeof d[k]]).toEqual([l, k, 'string']); expect(d[k]).not.toBe(k); expect(params(d[k])).toBe(params(k)); }
      expect(inne.includes(d[NOWE_DOPISEK[0]])).toBe(false);
    });
    test('U1 i U3 wskazują metaanalizę Pelland 2026', () => {
      const d = LOCALES[l]!; expect(d[U1_PL]).toMatch(/Pelland/); expect(d[U3_PL]).toMatch(/Pelland/);
    });
  });
});

describe('zasada: brzmienie w CLAUDE.md, agencie badacza i komentarzach lib/', () => {
  test('CLAUDE.md i agent badacza: jedno źródło szczebla 1–2 z twierdzeniem wprost = ustalone; 3–5 = oznaczenie; zmiana 18.10.2026', () => {
    for (const f of ['CLAUDE.md', '.claude/agents/badacz-merytoryczny.md']) {
      const s = read(f);
      expect([f, /18\.10\.2026/.test(s), /szczebla 1–2/.test(s), /wprost/.test(s), /szczebla 3–5/.test(s)]).toEqual([f, true, true, true, true]);
      expect([f, /oparte na jednym źródle — oznaczone „jedno źródło”, nie jako ustalone/.test(s)]).toEqual([f, false]);
    }
  });
  test('komentarze lib/setSplit, generator, stats: Pelland 2026 nie jest „jedno źródło”; Iversen 2021 (przegląd narracyjny) zostaje', () => {
    expect(read('lib/setSplit.ts')).not.toMatch(/Pelland[^\n]*jedno źródło|jedno źródło[^\n]*Pelland/);
    expect(read('lib/generator.ts')).not.toMatch(/Pelland[^\n]*jedno źródło/);
    expect(read('lib/stats.ts')).not.toMatch(/JEDNO źródło, waga to założenie/); /* "JEDNO źródło liczenia" (SSOT w kodzie) to nie oznaczenie merytoryczne */
    expect(read('lib/generator.ts')).toMatch(/Iversen 2021 — jedno źródło, konwencja/);
  });
  test('Grgic 2021 (L6-zrodla.md): szczebel 3 — przegląd narracyjny', () => {
    const s = read('docs/research/25-biblioteka/L6-zrodla.md');
    expect(s).toMatch(/Grgic[^\n]*[Ss]zczebel 3[^\n]*narracyjn/);
    expect(s).not.toMatch(/Grgic[^\n]*Szczebel 2 \(przegląd\)/);
  });
});

describe('ekran ćwiczenia: dopisek „ustalone (przegląd)” (PL, EN, 320 pt) — inny niż „jedno źródło” i „uproszczenie”', () => {
  jest.setTimeout(30000);
  const boot = async (locale: 'pl' | 'en' = 'pl', width?: number) => { jest.useFakeTimers({ now: new Date(2026, 9, 18, 12).getTime() }); await fresh(undefined, locale); store.save(); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, width }); await flushAll(10); await go(`/exercise/${ex('Lying Leg Raise').id}`); await flushAll(10); };
  afterEach(() => { applyLang('pl'); });
  const REV = 'Przypisanie partii mięśniowych — ustalone na podstawie przeglądu badań dla tego ćwiczenia. Od niego zależą serie na partię, mapa mięśni, generator i propozycje w kalendarzu.';
  test('PL: Lying Leg Raise — krótki „Przypisanie partii: przegląd badań.”, po ⓘ pełny tekst; bez „jedno źródło” i „uproszczenie”', async () => {
    await boot();
    expect(screen.getAllByText('Przypisanie partii: przegląd badań.').length).toBeGreaterThan(0); expect(screen.queryByText('Przypisanie partii: jedno źródło.')).toBeNull(); expect(screen.queryByText('Przypisanie partii: uproszczenie.')).toBeNull();
    await openInfo('muscle-note'); expect(screen.getAllByText(REV).length).toBeGreaterThan(0); expect(screen.queryByText(/jedno źródło, nie ustalone/)).toBeNull();
  });
  test('EN: Muscle group assignment: research review. + pełny tekst po ⓘ', async () => {
    await boot('en');
    expect(screen.getAllByText('Muscle group assignment: research review.').length).toBeGreaterThan(0); await openInfo('muscle-note');
    expect(screen.getAllByText('Muscle group assignment is established from a research review for this exercise. It drives sets per muscle, the muscle map, the generator and the calendar suggestions.').length).toBeGreaterThan(0);
  });
  test('320 pt (PL i EN): dopisek bez przycinania (numberOfLines) i bez błędów Reacta', async () => {
    const errs: string[] = []; jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    for (const locale of ['pl', 'en'] as const) {
      await boot(locale, 320);
      const short = locale === 'pl' ? 'Przypisanie partii: przegląd badań.' : 'Muscle group assignment: research review.';
      const nodes = screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => n.props.children === short); expect(nodes.length).toBeGreaterThan(0);
      expect(nodes.filter((n: { props: Record<string, unknown> }) => n.props.numberOfLines !== undefined)).toEqual([]);
    }
    expect(errs).toEqual([]);
  });
});
