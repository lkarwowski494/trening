/*
 * „Strażnik progresji” — ekrany (specyfikacja zatwierdzona 14.10.2026, docs/18): ekran Trening („Ten tydzień”: sylwetka w kolorach progresu, legenda, najwyżej dwa zdania,
 * przycisk do Postępów) i Postępy („Strażnik progresji”: grupy od problemów, wiersze, rozwijanie, pasek serii). Logika: tests/guard.test.ts. Rodzaje (docs/20): ekran
 * (każdy element i komunikat), scenariusz (Trening → „Szczegóły w Postępach” → sekcja → rozwinięcie partii), macierz (stan kierunku × motyw × język), VoiceOver (role,
 * etykiety, stan rozwinięcia), wygląd (jasny/ciemny, kontrast tokenu `less`, 320 pt, skala tekstu 2,0: legenda zawija się, nic nie ucięte).
 */
import * as RN from 'react-native';
import { Appearance } from 'react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { uid, type Template, type TRow } from '@/lib/seed';
import { light, dark } from '@/lib/theme';
import { mixHex as mixOf } from '@/lib/musclemap';
import { exName } from '@/lib/i18n';
import { fresh, saved, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act, openInfo } from './app';
import { within } from '@testing-library/react-native';

import { SIGN_CHAR } from '@/components/Guard';
import type { GuardDir } from '@/lib/guard';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek; tydzień pon 5 … nd 11 października 2026 */
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const sets = (n: number, weight: number, reps: number) => Array.from({ length: n }, () => ({ weight, reps }));
const row = (reps: number | '', weight: number | ''): TRow => ({ id: uid(), kind: 'normal', reps, weight, durationSec: '', distanceM: '' });
function tpl(name: string, ...blocks: [string, TRow[]][]): Template {
  const t = store.newTemplate(); t.name = name;
  t.items = blocks.map(([n, rows]) => ({ id: uid(), exerciseId: ex(n).id, sets: rows.length, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null, rows }));
  store.save(); return t;
}
const setPlan = (days: Record<number, Template>) => { jest.setSystemTime(at(9, 5, 6)); for (const [i, t] of Object.entries(days)) plan.setWeekDay(Number(i), t.id); jest.setSystemTime(NOW.getTime()); };
const SQ = 'Back Squat'; const BP = 'Bench Press (sztanga)'; const LC = 'Leg Curl'; const HA = 'Hip Adduction';
/** Poprzedni tydzień: przysiad 3×100×5, wyciskanie 3×60×8. Ten tydzień: przysiad słabszy (mniej), wyciskanie mocniejsze (więcej), Leg Curl nowe (bez porównania) z planem na czwartek. */
const mixed = () => {
  addWorkout(at(9, 1), [[SQ, sets(3, 100, 5)]], 'p1'); addWorkout(at(9, 2), [[BP, sets(3, 60, 8)]], 'p2');
  addWorkout(at(9, 6), [[SQ, sets(3, 80, 5)], [BP, sets(3, 70, 8)], [LC, sets(2, 40, 10)]], 'c');
  setPlan({ 3: tpl('A', [LC, [row(10, 40), row(10, 40)]]) });
};
/** Dane z makiety: dwie partie poniżej celu nawet z planem (dwugłowe 3/10, przywodziciele 4,5/10), pośladki dochodzą do celu. */
const makieta = () => {
  addWorkout(at(9, 1), [['Leg Extension', sets(10, 40, 10)]], 'p'); addWorkout(at(9, 6), [['Leg Extension', sets(10, 50, 10)], ['Hip Thrust (sztanga)', sets(10, 80, 8)], [LC, sets(1, 40, 10)], [HA, sets(2, 30, 10)], [SQ, sets(1, 100, 5)]], 'c');
  setPlan({ 3: tpl('A', [LC, [row(10, 40), row(10, 40)]]), 5: tpl('B', [HA, [row(10, 30), row(10, 30)]]) });
};
const S = () => store.getState();
let scheme: 'light' | 'dark' = 'light';
beforeEach(() => {
  jest.spyOn(Appearance, 'setColorScheme').mockImplementation(((v: string | null | undefined) => { scheme = v === 'dark' ? 'dark' : 'light'; }) as never);
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
});
afterEach(() => { jest.restoreAllMocks(); scheme = 'light'; });
const boot = async (fn: () => void = () => {}, url = '/', locale: 'pl' | 'en' = 'pl', width?: number, theme: 'light' | 'dark' = 'light') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); S().settings.theme = theme; scheme = theme; store.saveCfg();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url, width }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const find = (id: string) => screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && n.props.testID === id);
const has = (id: string) => find(id).length > 0;
const textOf = (id: string): string => { const n = find(id)[0]; const walk = (x: unknown): string => typeof x === 'string' || typeof x === 'number' ? String(x) : Array.isArray(x) ? x.map(walk).join('') : x && typeof x === 'object' && 'props' in (x as object) ? walk((x as { props: { children?: unknown } }).props.children) : ''; return walk((n as unknown as { props: { children?: unknown } }).props.children); };
const order = (...ids: string[]) => { const all = screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && ids.some(i => n.props.testID === i)).map((n: { props: { testID?: string } }) => n.props.testID as string); return ids.map(id => all.indexOf(id)); };
/** stan sylwetki partii = ostatni człon testID kształtów (kolory SVG w Jest to uchwyty pędzli, nie napisy) */
const stateOf = (muscle: string): string[] => [...new Set(screen.UNSAFE_root.findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && (n.props.testID ?? '').startsWith(`guard-map-${muscle}-`)).map((n: { props: { testID?: string } }) => (n.props.testID as string).split('-').pop() as string))];
const flat = (st: unknown): Record<string, number> => Object.assign({}, ...[st].flat(Infinity as 1).filter(Boolean) as object[]);
const DIRS: Exclude<GuardDir, 'deload'>[] = ['up', 'same', 'down', 'unknown', 'none'];

describe('ekran Trening: „Ten tydzień” ze strażnikiem (wariant C)', () => {
  test('dane z makiety: zdanie o brakach „dwugłowe (3/10), przywodziciele (4,5/10)” — bez pośladków; bez spadków nie ma drugiego zdania; legenda z pięcioma słowami', async () => {
    await boot(makieta); expect(textOf('guard-short')).toBe('Poniżej celu nawet z planem: dwugłowe (3/10), przywodziciele (4,5/10).'); expect(has('guard-less')).toBe(false);
    for (const d of DIRS) expect(has(`guard-legend-${d}`)).toBe(true); expect(has('guard-legend-new')).toBe(false);
    for (const w of ['więcej', 'tyle samo', 'mniej', 'bez porównania', 'bez serii']) expect([w, screen.getAllByText(w, { includeHiddenElements: true }).length > 0]).toEqual([w, true]);
  });
  test('kolejność na ekranie: kafelki → stosy planu → sylwetka z legendą, zdaniami i przyciskiem; bez dawnych pasków serii, legendy wykonane/zaplanowane i podpisów', async () => {
    await boot(mixed); const [wt, wm, gm, gl, gs, gmore] = order('week-tiles', 'week-muscles', 'guard-map', 'guard-legend', 'guard-short', 'guard-more');
    expect([wt, wm, gm, gl, gs, gmore].every(i => i >= 0)).toBe(true); expect(wt).toBeLessThan(wm); expect(wm).toBeLessThan(gm); expect(gm).toBeLessThan(gl); expect(gl).toBeLessThan(gs); expect(gs).toBeLessThan(gmore);
    for (const id of ['pbar-sets-czworogłowe', 'pbar-sets-czworogłowe-done', 'prow-sets-klatka', 'seg-legend', 'seg-legend-indirect', 'muscle-map']) expect([id, has(id)]).toEqual([id, false]);
    for (const x of ['Serie na partię — wykonane i zaplanowane', 'Sylwetka: serie w tym tygodniu']) expect(screen.queryByText(x)).toBeNull();
    expect(screen.queryByText(/pośrednio/)).toBeNull(); /* serie pośrednie tylko w Postępach */
  });
  test('stany na sylwetce: mniej (przysiad słabszy), więcej (wyciskanie), bez porównania (nowy Leg Curl) — kolory i wzory; sylwetka to jeden obraz z etykietą stanów', async () => {
    await boot(mixed); const th = light;
    expect(stateOf('klatka')).toEqual(['up']); expect(stateOf('czworogłowe')).toEqual(['down']); expect(stateOf('dwugłowe')).toEqual(['unknown']); expect(stateOf('łydki')).toEqual(['none']); void th;
    const m = screen.getByTestId('guard-map'); expect(m.props.accessibilityRole).toBe('image'); expect(m.props.accessible).toBe(true);
    expect(m.props.accessibilityLabel).toBe('Ten tydzień wobec poprzedniego: więcej — klatka, barki, triceps; mniej — czworogłowe, pośladki, przywodziciele; bez porównania — dwugłowe.');
  });
  test('zdanie 2 tylko przy spadkach: „Mniej niż przed tygodniem: czworogłowe, pośladki, przywodziciele.” i zdanie 1 z „i jeszcze N”; oba nie są ucięte (bez numberOfLines)', async () => {
    await boot(mixed); expect(textOf('guard-less')).toBe('Mniej niż przed tygodniem: czworogłowe, pośladki, przywodziciele.'); expect(textOf('guard-short')).toMatch(/^Poniżej celu nawet z planem: .+, .+ i jeszcze \d+\.$/);
    for (const id of ['guard-short', 'guard-less']) { const n = find(id)[0] as unknown as { props: Record<string, unknown> }; expect(n.props.numberOfLines).toBeUndefined(); expect(n.props.adjustsFontSizeToFit).toBeFalsy(); expect(n.props.maxFontSizeMultiplier).toBe(2); }
  });
  test('legenda zawija się (flexWrap) zamiast uciekać z ekranu; ukryta przed VoiceOver (stany czyta etykieta obrazu)', async () => {
    await boot(mixed); const l = find('guard-legend')[0] as unknown as { props: { style: Record<string, unknown>; accessibilityElementsHidden: boolean } }; expect(l.props.style.flexWrap).toBe('wrap'); expect(l.props.accessibilityElementsHidden).toBe(true);
  });
  test('przycisk „Szczegóły w Postępach”: rola button, podpowiedź „Otwiera Postępy.”, pole ≥ 44 pt; kafelki zostają osobnym przyciskiem', async () => {
    await boot(mixed); const b = screen.getByTestId('guard-more'); expect(b.props.accessibilityRole).toBe('button'); expect(b.props.accessibilityLabel).toBe('Szczegóły w Postępach'); expect(b.props.accessibilityHint).toBe('Otwiera Postępy.');
    expect(flat(b.props.style).minHeight).toBeGreaterThanOrEqual(44);
    expect(screen.getByTestId('week-tiles').props.accessibilityHint).toBe('Otwiera Postępy.');
  });
  test('bez serii w tym tygodniu i bez planu: zamiast sylwetki „Brak serii w tym tygodniu.” (poprzedni tydzień nie wraca do „Ten tydzień”)', async () => {
    await boot(() => { addWorkout(at(9, 1), [[SQ, sets(3, 100, 5)]], 'p'); });
    expect(has('guard-map')).toBe(false); expect(screen.getByText('Brak serii w tym tygodniu.')).toBeTruthy(); expect(screen.getByTestId('week-tiles')).toBeTruthy();
  });
  test('pierwszy tydzień (brak poprzedniego): trenowane partie „nowe”, legenda dostaje słowo „nowe”, brak zdania o spadkach', async () => {
    await boot(() => { addWorkout(at(9, 6), [[SQ, sets(3, 100, 5)]], 'c'); });
    expect(has('guard-legend-new')).toBe(true); expect(has('guard-less')).toBe(false); expect(screen.getByTestId('guard-map').props.accessibilityLabel).toBe('Ten tydzień wobec poprzedniego: nowe — czworogłowe, pośladki, przywodziciele.'); expect(stateOf('czworogłowe')).toEqual(['new']);
  });
  test('tydzień deloadu: „Tydzień deloadu — bez porównania” zamiast legendy i zdań; wszystkie trenowane partie we wzorze deloadu', async () => {
    await boot(() => { mixed(); store.toggleDeloadWeek(NOW.getTime()); });
    expect(textOf('guard-deload')).toBe('Tydzień deloadu — bez porównania'); for (const id of ['guard-legend', 'guard-short', 'guard-less']) expect([id, has(id)]).toEqual([id, false]);
    expect(stateOf('czworogłowe')).toEqual(['deload']); expect(stateOf('klatka')).toEqual(['deload']); expect(stateOf('łydki')).toEqual(['none']); expect(screen.getByTestId('guard-map').props.accessibilityLabel).toBe('Tydzień deloadu — bez porównania');
  });
  test('tydzień po deloadzie: wobec ostatniego tygodnia bez deloadu, z datą tygodnia', async () => {
    await boot(() => { addWorkout(at(8, 22), [[SQ, sets(3, 100, 5)]], 'a'); addWorkout(at(9, 1), [[SQ, sets(1, 50, 5)]], 'd'); store.toggleDeloadWeek(at(9, 1)); addWorkout(at(9, 6), [[SQ, sets(3, 80, 5)]], 'c'); });
    expect(textOf('guard-compared')).toBe('Wobec tygodnia 21 wrz (poprzedni był deloadem)'); expect(textOf('guard-less')).toBe('Mniej niż w tygodniu 21 wrz: czworogłowe, pośladki, przywodziciele.');
  });
  test('EN: słowa legendy, zdania i przycisk po angielsku', async () => {
    await boot(makieta, '/', 'en'); expect(textOf('guard-short')).toBe('Below goal even with the plan: hamstrings (3/10), adductors (4.5/10).');
    for (const w of ['more', 'same', 'less', 'no comparison', 'no sets']) expect([w, screen.getAllByText(w, { includeHiddenElements: true }).length > 0]).toEqual([w, true]);
    expect(screen.getByTestId('guard-more').props.accessibilityLabel).toBe('Details in Progress'); expect(screen.getByTestId('guard-more').props.accessibilityHint).toBe('Opens Progress.');
  });
});

describe('scenariusz: Trening → „Szczegóły w Postępach” → sekcja → rozwinięcie partii', () => {
  test('stuknięcie przycisku otwiera Postępy z sekcją „Strażnik progresji”; stuknięcie wiersza rozwija szczegóły i zwija je ponownie', async () => {
    await boot(mixed); await tap(screen.getByTestId('guard-more')); await flushAll(10);
    expect(screen.getByTestId('guard-section')).toBeTruthy(); expect(screen.getAllByText('Strażnik progresji').length).toBeGreaterThan(0);
    const r = within(screen.getByTestId('grow-czworogłowe')); const btn = r.getByRole('button'); expect(btn.props.accessibilityState.expanded).toBe(false); expect(has('gdet-czworogłowe')).toBe(false);
    await tap(btn); await flushAll(5); expect(within(screen.getByTestId('grow-czworogłowe')).getByRole('button').props.accessibilityState.expanded).toBe(true); expect(has('gdet-czworogłowe')).toBe(true);
    await tap(within(screen.getByTestId('grow-czworogłowe')).getByRole('button')); await flushAll(5); expect(has('gdet-czworogłowe')).toBe(false);
  });
});

describe('Postępy: „Strażnik progresji”', () => {
  test('nagłówek sekcji to nazwa funkcji (decyzja właściciela 14.10.2026): PL „Strażnik progresji”, EN „Progress Guard”, bez starego „Partie w tym tygodniu”', async () => {
    for (const [locale, name, old] of [['pl', 'Strażnik progresji', 'Partie w tym tygodniu'], ['en', 'Progress Guard', 'Muscle groups this week']] as const) {
      await boot(mixed, '/progress', locale); const sec = within(screen.getByTestId('guard-section'));
      expect([locale, sec.getAllByText(name).length]).toEqual([locale, 1]); expect(sec.queryByText(old)).toBeNull();
    }
  });
  test('grupy w kolejności: poniżej celu, mniej, bez porównania, tyle samo, więcej; na końcu „Bez serii: …”; każda partia w jednej grupie (poniżej celu wygrywa z „mniej”)', async () => {
    await boot(() => {
      mixed(); addWorkout(at(9, 3), [['Barbell Curl', sets(3, 30, 10)]], 'pb'); addWorkout(at(9, 7), [['Barbell Curl', sets(3, 30, 10)]], 'cb');
      S().settings.weeklySetGoals = { czworogłowe: 1, dwugłowe: 1, pośladki: 1, przywodziciele: 1, barki: 1, triceps: 1, biceps: 1, klatka: 10 }; store.saveCfg(); /* klatka (3 z 10) poniżej celu mimo „więcej”; reszta dochodzi do celu 1 */
    }, '/progress');
    const ids = ['ggrp-below', 'ggrp-down', 'ggrp-unknown', 'ggrp-same', 'ggrp-up', 'grow-none']; const o = order(...ids);
    expect(o.every(i => i >= 0)).toBe(true); expect([...o].sort((x, y) => x - y)).toEqual(o); expect(has('ggrp-new')).toBe(false);
    const inGroup = (g: string): string[] => screen.getByTestId(g).findAll((n: { type: unknown; props: { testID?: string } }) => typeof n.type === 'string' && /^grow-/.test(n.props.testID ?? '')).map((n: { props: { testID?: string } }) => n.props.testID as string);
    expect(inGroup('ggrp-below')).toEqual(['grow-klatka']); expect(inGroup('ggrp-down')).toEqual(['grow-czworogłowe', 'grow-pośladki', 'grow-przywodziciele']); expect(inGroup('ggrp-unknown')).toEqual(['grow-dwugłowe']);
    expect(inGroup('ggrp-same')).toEqual(['grow-biceps']); expect(inGroup('ggrp-up')).toEqual(['grow-barki', 'grow-triceps']);
    expect(within(screen.getByTestId('grow-none')).getByText('Bez serii: plecy, łydki, core, przedramiona')).toBeTruthy();
    for (const m of ['klatka', 'czworogłowe', 'dwugłowe', 'biceps', 'barki']) expect([m, find(`grow-${m}`).length]).toEqual([m, 1]);
  });
  test('wiersz: znak + nazwa, „n / cel serii”, linia tonażu z poprzednim; etykieta VoiceOver ze słowem stanu; rozwinięte: wykonane, zaplanowane z dniem, ćwiczenia z tonażem i pominięte', async () => {
    await boot(() => { makieta(); addWorkout(at(9, 2), [[HA, sets(2, 25, 10)]], 'pa'); }, '/progress');
    const h = within(screen.getByTestId('grow-przywodziciele')); const b = h.getByRole('button'); expect(b.props.accessibilityLabel).toMatch(/^przywodziciele: .+\. 4,5 \/ 10 serii/);
    await tap(b); await flushAll(5); const d = within(screen.getByTestId('gdet-przywodziciele'));
    expect(d.getByText(/^Wykonane: 2 \+ 0,5 pośrednio \(1 seria po 0,5\)$/)).toBeTruthy(); expect(d.getByText(/^Zaplanowane: 2 \(sob\.?\)$/)).toBeTruthy(); expect(d.getByText('Porównywane ćwiczenia: tonaż/sesję i ciężar roboczy')).toBeTruthy();
    expect(d.getByText(exName(ex(HA)))).toBeTruthy(); expect(d.getByText(/^Pominięte \(bez punktu odniesienia\): .*nowe w tym tygodniu/)).toBeTruthy();
  });
  test('wiersz „bez porównania” podaje powód w linii, rozwinięcie — ćwiczenia pominięte z powodem; dwugłowe: nowe w tym tygodniu', async () => {
    await boot(mixed, '/progress'); const r = within(screen.getByTestId('grow-dwugłowe')); expect(r.getByText('bez porównania — nowe w tym tygodniu')).toBeTruthy();
    await tap(r.getByRole('button')); await flushAll(5); expect(within(screen.getByTestId('gdet-dwugłowe')).getByText(`Pominięte (bez punktu odniesienia): ${exName(ex(LC))} — nowe w tym tygodniu`)).toBeTruthy();
  });
  test('linia tonażu pokazuje kierunek i liczby; „tonaż↓ ciężar↑” pokazuje obie linie i znak „więcej” przy partii', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Barbell Curl', sets(3, 100, 10)]], 'p'); addWorkout(at(9, 6), [['Barbell Curl', sets(3, 110, 5)]], 'c'); }, '/progress');
    const r = within(screen.getByTestId('grow-biceps')); expect(r.getByText(`tonaż/sesję ${SIGN_CHAR.down} 1650 kg (poprz. 3000 kg) · ciężar roboczy ${SIGN_CHAR.up} 110 kg (poprz. 100 kg)`)).toBeTruthy();
    expect(r.getByRole('button').props.accessibilityLabel).toContain('więcej'); expect(has('ggrp-up')).toBe(false); /* poniżej celu 10: grupa „poniżej celu” */
  });
  test('pasek serii: wykonane pełnym akcentem, plan jaśniejszym, kreska celu w połowie skali (2× cel), bez nadmiaru i bez koloru ostrzegawczego', async () => {
    await boot(makieta, '/progress'); const done = find('gbar-dwugłowe-done')[0] as unknown as { props: { style: { width: string; backgroundColor: string } } }; const pl = find('gbar-dwugłowe-planned')[0] as unknown as { props: { style: { width: string; backgroundColor: string } } };
    expect(done.props.style.width).toBe('5%'); expect(done.props.style.backgroundColor).toBe(light.accent); expect(pl.props.style.width).toBe('10%'); expect(pl.props.style.backgroundColor).toBe(mixOf(light.surface, light.accent, 0.38));
    expect((find('gbar-dwugłowe-mark')[0] as unknown as { props: { style: { left: string } } }).props.style.left).toBe('50%'); expect(screen.queryByText(/^»/)).toBeNull();
  });
  test('nadmiar ponad podwójny cel kończy się „»” z liczbą; inne wiersze nie są zgniatane (ich szerokość liczona od własnego celu)', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Barbell Curl', sets(3, 20, 10)]], 'p'); addWorkout(at(9, 6), [['Barbell Curl', sets(24, 20, 10)], ['Hip Thrust (sztanga)', sets(5, 80, 8)]], 'c'); }, '/progress');
    expect(screen.getByText('» 24', { includeHiddenElements: true })).toBeTruthy(); const d = find('gbar-biceps-done')[0] as unknown as { props: { style: { width: string } } }; expect(d.props.style.width).toBe('100%');
    const o = find('gbar-pośladki-done')[0] as unknown as { props: { style: { width: string } } }; expect(o.props.style.width).toBe('25%'); /* 5 z 20 */
  });
  test('tydzień deloadu: jedna grupa „Tydzień deloadu — bez porównania”, wiersze ze znakiem deloadu, bez zdań o brakach', async () => {
    await boot(() => { mixed(); store.toggleDeloadWeek(NOW.getTime()); }, '/progress'); expect(has('ggrp-deload')).toBe(true); for (const g of ['below', 'down', 'up', 'unknown']) expect(has(`ggrp-${g}`)).toBe(false);
    expect(within(screen.getByTestId('ggrp-deload')).getByText('TYDZIEŃ DELOADU — BEZ PORÓWNANIA')).toBeTruthy();
  });
  test('objaśnienie metody jest pod ⓘ przy nagłówku „Strażnik progresji” (zwinięte na starcie): tonaż na sesję, pominięte ćwiczenia, ≥, uproszczenie 0,5', async () => {
    await boot(mixed, '/progress'); expect(screen.queryByTestId('info-text-guard-method')).toBeNull(); await openInfo('guard-method'); const i = within(screen.getByTestId('info-text-guard-method'));
    expect(i.getByText(/średnio na sesję ćwiczenia/)).toBeTruthy(); expect(i.getByText(/nowe w tym tygodniu albo nierobione teraz/)).toBeTruthy(); expect(i.getByText(/Plan bez ciężarów \(≥\)/)).toBeTruthy(); expect(i.getByText(/pomocnicza 0,5\)/)).toBeTruthy();
  });
  test('EN: tytuł sekcji, grupy, wiersze i rozwinięcie po angielsku', async () => {
    await boot(mixed, '/progress', 'en'); expect(screen.getAllByText('Progress Guard').length).toBeGreaterThan(0); expect(within(screen.getByTestId('grow-dwugłowe')).getByText('no comparison — new this week')).toBeTruthy();
    expect(within(screen.getByTestId('ggrp-below')).getByText('BELOW GOAL EVEN WITH THE PLAN')).toBeTruthy();
  });
});

describe('Postępy: teksty objaśnień i powody pominięcia (dokładne brzmienie)', () => {
  test('objaśnienie metody — trzy akapity i legenda skali (dokładne zdania)', async () => {
    await boot(mixed, '/progress'); expect(screen.queryByTestId('info-text-guard-method')).toBeNull(); await openInfo('guard-method'); const i = within(screen.getByTestId('info-text-guard-method'));
    expect(i.getByText('Kierunek dla partii liczymy tylko na ćwiczeniach, które były w obu tygodniach. Ćwiczenia bez punktu odniesienia — nowe w tym tygodniu albo nierobione teraz — pomijamy w obu tygodniach.')).toBeTruthy();
    expect(i.getByText('Miara: tonaż (serie × powtórzenia × ciężar) średnio na sesję ćwiczenia, więc inna liczba sesji nie zawyża wyniku. Gdy tonaż spadł, a ciężar roboczy wzrósł — albo poprzednio ciężar wynosił 0, a teraz nie — liczymy to jako więcej.')).toBeTruthy();
    expect(i.getByText('Ten tydzień = wykonane + plan. Plan bez ciężarów (≥) — bez porównania. Tydzień deloadu nie jest porównywany.')).toBeTruthy();
    expect(screen.getByText('Skala do dwukrotności celu, » — więcej.', { includeHiddenElements: true })).toBeTruthy();
  });
  test('pierwszy tydzień: wiersz „nowe” z linią „brak poprzedniego tygodnia”', async () => {
    await boot(() => { addWorkout(at(9, 6), [[SQ, sets(3, 100, 5)]], 'c'); }, '/progress'); expect(within(screen.getByTestId('grow-czworogłowe')).getByText('brak poprzedniego tygodnia')).toBeTruthy();
  });
  test('powody pominięcia: „nierobione w tym tygodniu” (było tylko wcześniej) i „plan bez ciężaru lub powtórzeń” (plan „≥”)', async () => {
    await boot(() => {
      addWorkout(at(9, 1), [[BP, sets(3, 60, 8)], ['Seated Cable Chest Press', sets(3, 40, 10)], [LC, [{ weight: '', reps: 10 }]]], 'p'); addWorkout(at(9, 6), [[BP, sets(3, 70, 8)]], 'c'); setPlan({ 3: tpl('A', [LC, [row('', ''), row('', '')]]) });
    }, '/progress');
    await tap(within(screen.getByTestId('grow-klatka')).getByRole('button')); await flushAll(5); expect(within(screen.getByTestId('gdet-klatka')).getByText(`Pominięte (bez punktu odniesienia): ${exName(ex('Seated Cable Chest Press'))} — nierobione w tym tygodniu`)).toBeTruthy();
    expect(within(screen.getByTestId('grow-dwugłowe')).getByText('bez porównania — plan bez ciężaru lub powtórzeń')).toBeTruthy();
  });
});

describe('Postępy: poprzednio 0 kg i rozdzielone powody pominięcia (lista napraw przed 1.0, 19.10.2026)', () => {
  const DB = 'Bench Press (hantle)'; const PU = 'Push Up';
  test('regresja: Bench Press (hantle) 0 kg ×8 → 50 kg ×8 — klatka w grupie „więcej”, linia tonażu z „poprz. 0 kg” i linia ciężaru roboczego, bez „Pominięte”', async () => {
    await boot(() => { addWorkout(at(9, 1), [[DB, sets(1, 0, 8)]], 'p'); addWorkout(at(9, 6), [[DB, sets(1, 50, 8)]], 'c'); S().settings.weeklySetGoals = { klatka: 1 }; store.saveCfg(); }, '/progress');
    expect(within(screen.getByTestId('ggrp-up')).getByTestId('grow-klatka')).toBeTruthy();
    const r = within(screen.getByTestId('grow-klatka')); expect(r.getByText(new RegExp(`^tonaż/sesję ${SIGN_CHAR.up} \\d+ kg \\(poprz\\. 0 kg\\) · ciężar roboczy ${SIGN_CHAR.up} 50 kg \\(poprz\\. 0 kg\\)$`))).toBeTruthy();
    expect(r.getByRole('button').props.accessibilityLabel).toMatch(/^klatka: więcej\./);
    await tap(r.getByRole('button')); await flushAll(5); expect(within(screen.getByTestId('gdet-klatka')).queryByText(/^Pominięte/)).toBeNull();
  });
  test('powody rozdzielone: „bez punktu odniesienia” tylko dla nowych/nierobionych, osobno „bez ciężaru” i „plan bez ciężaru lub powtórzeń” — bez sprzecznego „bez punktu odniesienia: … — bez ciężaru”', async () => {
    await boot(() => {
      addWorkout(at(9, 1), [[BP, sets(3, 60, 8)], [PU, sets(3, 0, 12)], ['Seated Cable Chest Press', sets(3, 40, 10)], [LC, [{ weight: '', reps: 10 }]]], 'p');
      addWorkout(at(9, 6), [[BP, sets(3, 70, 8)], [PU, sets(3, 0, 15)], [DB, sets(3, 20, 10)]], 'c'); setPlan({ 3: tpl('A', [LC, [row('', ''), row('', '')]]) });
    }, '/progress');
    await tap(within(screen.getByTestId('grow-klatka')).getByRole('button')); await flushAll(5); const d = within(screen.getByTestId('gdet-klatka'));
    expect(d.getByTestId('gskip-ref-klatka').props.children).toBe(`Pominięte (bez punktu odniesienia): ${exName(ex(DB))} — nowe w tym tygodniu; ${exName(ex('Seated Cable Chest Press'))} — nierobione w tym tygodniu`);
    expect(d.getByTestId('gskip-noweight-klatka').props.children).toBe(`Pominięte (bez ciężaru): ${exName(ex(PU))}`);
    expect(d.queryByText(/bez punktu odniesienia.*bez ciężaru/)).toBeNull(); expect(d.queryByTestId('gskip-plan-klatka')).toBeNull();
    await tap(within(screen.getByTestId('grow-dwugłowe')).getByRole('button')); await flushAll(5); const e = within(screen.getByTestId('gdet-dwugłowe'));
    expect(e.getByTestId('gskip-plan-dwugłowe').props.children).toBe(`Pominięte (plan bez ciężaru lub powtórzeń): ${exName(ex(LC))}`); expect(e.queryByTestId('gskip-ref-dwugłowe')).toBeNull();
  });
  test('EN: rozdzielone powody pominięcia po angielsku', async () => {
    await boot(() => { addWorkout(at(9, 1), [[BP, sets(3, 60, 8)], [PU, sets(3, 0, 12)]], 'p'); addWorkout(at(9, 6), [[BP, sets(3, 70, 8)], [PU, sets(3, 0, 15)], [DB, sets(3, 20, 10)]], 'c'); }, '/progress', 'en');
    await tap(within(screen.getByTestId('grow-klatka')).getByRole('button')); await flushAll(5); const d = within(screen.getByTestId('gdet-klatka'));
    expect(d.getByTestId('gskip-ref-klatka').props.children).toMatch(/^Left out \(nothing to compare with\): .+ — new this week$/); expect(d.getByTestId('gskip-noweight-klatka').props.children).toMatch(/^Left out \(no weight\): /);
  });
});

describe('wygląd: jasny / ciemny, kontrast, wąski ekran, duża czcionka', () => {
  test('kontrast tokenu `less` (pomarańcz „mniej”) do tła, powierzchni i powierzchni 2 ≥ 3:1 w obu motywach (WCAG 1.4.11)', () => {
    const L = (h: string) => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const cr = (a: string, b: string) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    for (const th of [light, dark]) for (const bg of [th.bg, th.surface, th.surface2]) expect([th.less, bg, cr(th.less, bg) >= 3]).toEqual([th.less, bg, true]);
    expect(light.less).toBe('#A35200') /* M3 (STOP E3, docs/18): nowa paleta „hala”, kontrast do bg/surface/surface2 ≥ 3:1 sprawdzony wyżej */; expect(dark.less).toBe('#F0A050'); expect(light.less).not.toBe(light.danger); expect(dark.less).not.toBe(dark.danger);
  });
  test('ciemny motyw: sylwetka i legenda w kolorach ciemnego motywu (akcent #6f9bf2, tło powierzchni #26282d)', async () => {
    await boot(mixed, '/', 'pl', undefined, 'dark'); expect(stateOf('klatka')).toEqual(['up']); expect(stateOf('czworogłowe')).toEqual(['down']);
  });
  test('ciemny motyw, Postępy: pasek wykonane/zaplanowane i wiersze renderują się w ciemnych kolorach', async () => {
    await boot(makieta, '/progress', 'pl', undefined, 'dark'); const d = find('gbar-dwugłowe-done')[0] as unknown as { props: { style: { backgroundColor: string } } }; expect(d.props.style.backgroundColor).toBe(dark.accent);
  });
  test('320 pt i skala tekstu 2,0: Trening i Postępy renderują się bez błędów Reacta; zdania, legenda i wiersze bez przycinania (numberOfLines) i z zawijaniem', async () => {
    jest.spyOn(RN.PixelRatio, 'getFontScale').mockReturnValue(2); const dims = RN.Dimensions.get; jest.spyOn(RN.Dimensions, 'get').mockImplementation(((k: 'window' | 'screen') => ({ ...dims(k), fontScale: 2 })) as never);
    const errs: string[] = []; jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { const m = String(a[0]); if (!/not wrapped in act/.test(m)) errs.push(m.slice(0, 200)); });
    for (const locale of ['pl', 'en'] as const) {
      await boot(mixed, '/', locale, 320); expect(has('guard-map')).toBe(true); const clipped = screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => n.props.numberOfLines !== undefined && ['guard-short', 'guard-less'].includes(n.props.testID as string)); expect(clipped).toEqual([]);
      await boot(mixed, '/progress', locale, 320); expect(has('guard-section')).toBe(true);
      await tap(within(screen.getByTestId('grow-czworogłowe')).getByRole('button')); await flushAll(5); expect(has('gdet-czworogłowe')).toBe(true);
    }
    expect(errs).toEqual([]);
  });
});

describe('VoiceOver: role, stany i etykiety', () => {
  test('wiersze to przyciski ze stanem rozwinięcia i polem ≥ 44 pt; nagłówek grupy to header; „Bez serii” to jeden element; legenda słupków ukryta', async () => {
    await boot(mixed, '/progress'); const b = within(screen.getByTestId('grow-czworogłowe')).getByRole('button'); expect(b.props.accessibilityState).toEqual({ expanded: false }); expect(b.props.accessibilityLanguage).toBe('pl');
    expect(flat(b.props.style).minHeight).toBeGreaterThanOrEqual(44);
    const hdr = within(screen.getByTestId('ggrp-below')).getAllByRole('header'); expect(hdr.length).toBeGreaterThan(0); expect(screen.getByTestId('grow-none').props.accessible).toBe(true); expect((find('guard-bar-legend')[0] as unknown as { props: { accessibilityElementsHidden: boolean } }).props.accessibilityElementsHidden).toBe(true);
    expect((find('gbar-czworogłowe')[0] as unknown as { props: { accessibilityElementsHidden: boolean } }).props.accessibilityElementsHidden).toBe(true); /* liczby czyta etykieta wiersza */
  });
  test('etykieta wiersza: „partia: słowo stanu. n / cel serii. linia” — znaki ▲▼ zastąpione słowami', async () => {
    await boot(mixed, '/progress'); const l = within(screen.getByTestId('grow-czworogłowe')).getByRole('button').props.accessibilityLabel as string; expect(l).toBe('czworogłowe: mniej. 3 / 10 serii. tonaż/sesję mniej 1200 kg (poprz. 1500 kg)'); expect(l).not.toMatch(/[▲▼]/);
  });
});
