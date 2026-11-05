/*
 * Ekran nowej osoby 1.1 (decyzje właściciela 05.11.2026, docs/18: kierunek C′ „spójny”, bez „Inny trening” u nowej osoby, kafelki W1). Makieta: docs/design/kierunki/start-1-1-r4.html.
 * Rodzaje (docs/20): logika (lib/dashboard: kolumny kafelków, pola tablicy), ekran (pasek tygodnia, tablica, przycisk, kafelki), scenariusz (start pustego treningu, przejścia kafelków),
 * macierz (stany: nowa / szablon bez planu / plan / po treningu; szerokości × duży tekst × język), niezmienniki (znika po 1. treningu), regresja (pusty arkusz „Inny trening”, 05.11.2026).
 */
import * as store from '@/lib/store';
import * as draft from '@/lib/draft';
import { applyLang } from '@/lib/i18n';
import { setupTileColumns, firstBoardParts, SETUP_TILE_MIN_PT, SETUP_TILE_MIN_LONG_PT } from '@/lib/dashboard';
import { fresh, saved, withDemoTemplates, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';
import { within } from '@testing-library/react-native';
import * as RN from 'react-native';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import * as plan from '@/lib/plan';
import { MOTION } from '@/lib/theme';

jest.setTimeout(60000);
const NOW = new Date(2026, 10, 5, 9, 0); /* czwartek 5 listopada 2026 — dzień decyzji */
afterEach(() => { applyLang('pl'); draft.__resetObjDrafts(); jest.restoreAllMocks(); (RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock }).isReduceMotionEnabled.mockImplementation(() => Promise.resolve(false)); });
const boot = async (fn: () => void = () => {}, opts: { demo?: boolean; locale?: 'pl' | 'en' } = {}) => {
  jest.useFakeTimers({ now: NOW }); await fresh(); if (opts.demo) withDemoTemplates(); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/', locale: opts.locale }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const TILES = ['first-tile-plan', 'first-tile-places', 'first-steps-import', 'first-tile-guide'];

describe('lib/dashboard — kolumny kafelków (próg z makiety: kafelek < 144 pt → 1 kolumna)', () => {
  test.each([
    [320, 1, 'pl', 1], [360, 1, 'pl', 2], [390, 1, 'pl', 2], [430, 1, 'pl', 2], [390, 1.1, 'pl', 2], [390, 1.3, 'pl', 1], [390, 2, 'pl', 1], [430, 2, 'pl', 1],
    [320, 1, 'de', 1], [390, 1, 'de', 2], [350, 1, 'de', 1], [350, 1, 'el', 1], [352, 1, 'de', 2], [390, 1, 'el', 2], [390, 1, 'en', 2],
  ] as const)('szerokość %i pt, skala %f, język %s → %i kol.', (w, scale, lng, cols) => { expect(setupTileColumns(w - 32, scale, lng)).toBe(cols); });
  test('próg: dokładnie na granicy 2 kolumny, tuż poniżej 1; progi z jednego miejsca', () => {
    expect(SETUP_TILE_MIN_PT).toBe(144); expect(SETUP_TILE_MIN_LONG_PT).toBe(156);
    expect(setupTileColumns(2 * SETUP_TILE_MIN_PT + 8, 1, 'pl')).toBe(2); expect(setupTileColumns(2 * SETUP_TILE_MIN_PT + 7, 1, 'pl')).toBe(1);
  });
  test('pola tablicy: skrót dnia bez kropki, dzień z zerem, miesiąc skrótem — wersaliki w języku aplikacji', () => {
    expect(firstBoardParts(NOW)).toEqual({ weekday: 'CZW', day: '05', month: 'LIS' });
    applyLang('en'); expect(firstBoardParts(NOW)).toEqual({ weekday: 'THU', day: '05', month: 'NOV' });
  });
});

describe('ekran nowej osoby (bez treningów, szablonów i planu)', () => {
  test('układ: pasek tygodnia „Bez planu tygodnia” z dziś w ramce, tablica „Pierwszy trening”, przycisk, 4 kafelki; bez „Inny trening” i dawnej karty', async () => {
    await boot();
    expect(screen.getByText('Bez planu tygodnia')).toBeTruthy(); expect(screen.getByTestId('week-strip')).toBeTruthy(); expect(screen.getByTestId('strip-2026-11-05')).toBeTruthy();
    const board = screen.getByTestId('first-board'); expect(board.props.accessibilityLabel).toBe('Pierwszy trening, dziś, czwartek, 5 listopada');
    expect(within(screen.getByTestId('first-board')).queryAllByText(/./, { includeHiddenElements: false })).toHaveLength(0); /* dekoracja ukryta, jeden opis tekstowy */
    expect(screen.getByText('Zacznij pierwszy trening')).toBeTruthy(); expect(screen.getByText('ćwiczenia dodasz w trakcie')).toBeTruthy();
    expect(screen.queryByText('Inny trening')).toBeNull(); expect(screen.queryByText('Pusty trening')).toBeNull();
    expect(screen.queryByText('Pierwsze kroki')).toBeNull(); expect(screen.getByText('Zacznij od ustawień')).toBeTruthy();
    for (const id of TILES) { const el = screen.getByTestId(id); expect(el.props.accessibilityRole).toBe('button'); expect(el.props.accessibilityLabel).toMatch(/^[^.]+\. .+/); }
  });
  test('kafelki: teksty z makiety; całe kafelki są przyciskami z „›”', async () => {
    await boot();
    for (const x of ['Szablony i plan', 'Miejsca i sprzęt', 'Historia z CSV', 'Przewodnik', 'Utwórz pierwszy szablon albo wygeneruj szablony i plan.', 'Dom albo siłownia — ustaw swój sprzęt.', 'Masz historię w innej aplikacji? Możesz ją dopisać z pliku CSV.', 'Co gdzie jest i jak działa.']) expect(screen.getByText(x)).toBeTruthy();
    expect(screen.getAllByText('›', { includeHiddenElements: true }).length).toBeGreaterThanOrEqual(TILES.length);
  });
  test('scenariusz: „Zacznij pierwszy trening” uruchamia pusty trening', async () => {
    await boot(); await tap(screen.getByTestId('start-main')); await flushAll(10);
    expect(store.getState().active).toBeTruthy(); expect(store.getState().active!.exercises).toHaveLength(0);
  });
  test.each([['first-tile-plan', 'Plan'], ['first-tile-places', 'Miejsca'], ['first-steps-import', 'Import'], ['first-tile-guide', 'Przewodnik']] as const)('scenariusz: kafelek %s prowadzi do ekranu', async (id, _ekran) => {
    await boot(); await tap(screen.getByTestId(id)); await flushAll(10);
    expect(screen.queryByTestId('first-board')).toBeNull(); /* opuszczono ekran Trening */
  });
  test('regresja 05.11.2026: nowa osoba nie dostaje przycisku „Inny trening” z pustym arkuszem (dawniej tap → arkusz bez pozycji)', async () => {
    await boot(); expect(screen.queryByLabelText('Inny trening')).toBeNull(); expect(screen.queryByTestId('other-sheet')).toBeNull();
  });
  test('angielski: ten sam układ i opis tablicy', async () => {
    await boot(() => {}, { locale: 'en' });
    expect(screen.getByTestId('first-board').props.accessibilityLabel).toBe('First workout, today, Thursday 5 November'); expect(screen.getByText('Start your first workout')).toBeTruthy(); expect(screen.getByText('Start with the settings')).toBeTruthy();
  });
});

describe('„Inny trening” — reguła ogólna: tylko gdy są inne sposoby startu', () => {
  test('są szablony (bez planu): „Start: …”, tablica i kafelki zostają, „Inny trening” jest', async () => {
    await boot(() => {}, { demo: true });
    expect(screen.getByTestId('first-board')).toBeTruthy(); expect(screen.getByText(/^Start: /)).toBeTruthy(); expect(screen.getByText('Inny trening')).toBeTruthy(); for (const id of TILES) expect(screen.getByTestId(id)).toBeTruthy();
    expect(screen.queryByText('Zacznij pierwszy trening')).toBeNull();
  });
  test('stary trening bez szablonów (nie nowa osoba): przycisk „Pusty trening” jak dotąd, „Inny trening” z „Powtórz ostatni”; bez tablicy i kafelków', async () => {
    await boot(() => { addWorkout(NOW.getTime() - 86400000, [['Plank', [{ done: true, durationSec: 30 }]]]); });
    expect(screen.getByText('Pusty trening')).toBeTruthy(); expect(screen.getByText('Inny trening')).toBeTruthy(); expect(screen.queryByTestId('first-board')).toBeNull(); expect(screen.queryByTestId('first-steps')).toBeNull(); expect(screen.queryByText('Zacznij od ustawień')).toBeNull();
  });
});

describe('niezmiennik: po pierwszym zakończonym treningu tablica i kafelki znikają (pasek tygodnia zostaje)', () => {
  test('nowa osoba → trening zakończony → zwykły ekran główny', async () => {
    await boot(); expect(screen.getByTestId('first-board')).toBeTruthy();
    await act(async () => { addWorkout(NOW.getTime() - 3600000, [['Plank', [{ done: true, durationSec: 30 }]]]); }); await flushAll(10);
    expect(screen.queryByTestId('first-board')).toBeNull(); expect(screen.queryByTestId('first-steps')).toBeNull(); expect(screen.getByTestId('week-strip')).toBeTruthy(); expect(screen.getByText('Pusty trening')).toBeTruthy();
  });
});

const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten((typeof el.props.style === 'function' ? (el.props.style as (x: { pressed: boolean }) => unknown)({ pressed: false }) : el.props.style) as never) as Record<string, unknown>;
const win = (width: number, fontScale = 1) => { const w = Dimensions.get('window'); jest.spyOn(Dimensions, 'get').mockImplementation(((k: string) => (k === 'window' ? { ...w, width, fontScale } : Dimensions.get.call(Dimensions, k as never))) as never); };

describe('plan ustawiony, ale jeszcze bez treningu (stan „plan przed pierwszym treningiem”)', () => {
  const withPlan = () => { const t = withDemoTemplates(); plan.setWeekDay(3 /* czwartek = dziś */, t[0].id); return t; };
  test('rządzi tablica „Dziś: …” ze startem zaplanowanego treningu, a kafelki „Zacznij od ustawień” zostają; nie ma tablicy „Pierwszy trening” ani „Zacznij pierwszy trening”', async () => {
    let tpl = ''; await boot(() => { tpl = withPlan()[0].name; });
    expect(screen.getByTestId('today-board')).toBeTruthy(); expect(screen.getByText(`Dziś: ${tpl}`)).toBeTruthy(); expect(within(screen.getByTestId('plan-header')).getByText(/^Plan: /)).toBeTruthy();
    expect(screen.queryByTestId('first-board')).toBeNull(); expect(screen.queryByText('Zacznij pierwszy trening')).toBeNull(); expect(screen.getByLabelText(`Start zaplanowanego treningu: ${tpl}`)).toBeTruthy();
    expect(screen.getByText('Zacznij od ustawień')).toBeTruthy(); for (const id of TILES) expect(screen.getByTestId(id)).toBeTruthy();
    expect(screen.getByText('Inny trening')).toBeTruthy(); /* są inne starty (szablony) — przycisk jest */
  });
  test('plan na inny dzień (dziś wolne): „Dziś wolne” zamiast tablicy „Pierwszy trening”, kafelki zostają', async () => {
    await boot(() => { const t = withDemoTemplates(); plan.setWeekDay(4, t[0].id); });
    expect(screen.getByText('Dziś wolne')).toBeTruthy(); expect(screen.queryByTestId('first-board')).toBeNull(); for (const id of TILES) expect(screen.getByTestId(id)).toBeTruthy();
  });
  test('po pierwszym zakończonym treningu z planu kafelki znikają', async () => {
    await boot(() => { withPlan(); }); for (const id of TILES) expect(screen.getByTestId(id)).toBeTruthy();
    await act(async () => { addWorkout(NOW.getTime() - 3600000, [['Plank', [{ done: true, durationSec: 30 }]]]); }); await flushAll(10);
    expect(screen.queryByTestId('first-steps')).toBeNull(); expect(screen.queryByText('Zacznij od ustawień')).toBeNull(); expect(screen.getByTestId('week-strip')).toBeTruthy();
  });
});

describe('ruch tablicy „Pierwszy trening”: kaskada klapek, a przy „Ogranicz ruch” samo przenikanie', () => {
  const timings = () => (jest.spyOn(Animated, 'timing') as jest.SpyInstance<unknown, [unknown, { delay?: number; duration: number }]>);
  const fields = () => ['first-board-big', 'first-board-weekday', 'first-board-day', 'first-board-month'].map(id => screen.getByTestId(id, { includeHiddenElements: true })); /* dekoracja ukryta dla VoiceOver */
  const cascade = (sp: ReturnType<typeof timings>) => sp.mock.calls.map(c => c[1]).filter(c => c.delay !== undefined); /* tylko animacje tablicy (mają jawne opóźnienie) */
  test('ruch dozwolony: cztery klapki z odstępem 0,6 czasu klapki, każda MOTION.boardFlipMs; pola mają obrót (rotateX), nie samo przenikanie', async () => {
    const sp = timings(); await boot();
    const cfg = cascade(sp); expect(cfg.map(c => c.duration)).toEqual([1, 1, 1, 1].map(() => MOTION.boardFlipMs));
    [0, 0.6, 1.2, 1.8].forEach((k, i) => expect(cfg[i].delay).toBeCloseTo(k * MOTION.boardFlipMs, 5)); /* odstęp 0,6 czasu klapki */
    for (const el of fields()) expect(JSON.stringify(flat(el).transform)).toContain('rotateX');
  });
  test('„Ogranicz ruch”: bez klapek — wszystkie cztery pola przenikają jednocześnie przez MOTION.reducedCrossfadeMs, bez obrotu', async () => {
    (RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock }).isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    const sp = timings(); await boot();
    const cfg = cascade(sp);
    expect(cfg.map(c => c.duration)).toEqual([1, 1, 1, 1].map(() => MOTION.reducedCrossfadeMs)); expect(cfg.map(c => c.delay)).toEqual([0, 0, 0, 0]);
    for (const el of fields()) expect(flat(el).transform).toBeUndefined();
  });
  test('obie ścieżki kończą na wartości 1 (pełna widoczność) i startują raz — ponowny render nie powtarza ruchu', async () => {
    const sp = timings(); await boot(); const first = cascade(sp);
    expect(first.map(c => (c as { toValue?: number }).toValue)).toEqual([1, 1, 1, 1]);
    await flushAll(10); expect(cascade(sp)).toHaveLength(4); /* bez powtórki po kolejnych renderach */
    (RN.AccessibilityInfo as unknown as { isReduceMotionEnabled: jest.Mock }).isReduceMotionEnabled.mockImplementation(() => Promise.resolve(true));
    const sp2 = timings(); sp2.mockClear(); await boot(); expect(cascade(sp2).map(c => (c as { toValue?: number }).toValue)).toEqual([1, 1, 1, 1]);
  });
});

describe('kafelki „Zacznij od ustawień”: kolumny na ekranie (próg z lib/dashboard)', () => {
  const wide = (id: string) => flat(screen.getByTestId(id)).width;
  test('390 pt, tekst 100 %: 2 kolumny — każdy kafelek ok. połowy szerokości', async () => {
    win(390); await boot(); for (const id of TILES) expect(wide(id)).toBe((390 - 32 - 8) / 2);
  });
  test('320 pt: jedna kolumna — kafelki na całą szerokość', async () => {
    win(320); await boot(); for (const id of TILES) expect(wide(id)).toBe('100%');
  });
  test('duży tekst (skala 1,5) na 390 pt: jedna kolumna', async () => {
    win(390, 1.5); await boot(); for (const id of TILES) expect(wide(id)).toBe('100%');
  });
  test('320 pt i największy tekst (skala 2,0): jedna kolumna, każdy kafelek zachowuje cel dotyku (minHeight ≥ 44 pt) i etykietę', async () => {
    win(320, 2); await boot();
    for (const id of TILES) { const el = screen.getByTestId(id); expect(flat(el).width).toBe('100%'); expect(flat(el).minHeight as number).toBeGreaterThanOrEqual(44); expect(el.props.accessibilityLabel).toMatch(/^[^.]+\. .+/); }
  });
  test('niemiecki: 350 pt jedna kolumna (dłuższe napisy, próg 156 pt), 390 pt dwie', async () => {
    win(350); await boot(() => { store.getState().settings.language = 'de'; store.save(); }); for (const id of TILES) expect(wide(id)).toBe('100%');
    win(390); await boot(() => { store.getState().settings.language = 'de'; store.save(); }); for (const id of TILES) expect(wide(id)).toBe((390 - 32 - 8) / 2);
  });
});

describe('osoba z historią: kafelki i tablica nie wracają', () => {
  test('po usunięciu jedynego treningu osoba znów jest nowa (stan wynika z historii, nie z flagi)', async () => {
    await boot(() => { addWorkout(NOW.getTime() - 86400000, [['Plank', [{ done: true, durationSec: 30 }]]]); });
    expect(screen.queryByTestId('first-steps')).toBeNull(); expect(screen.queryByTestId('first-board')).toBeNull();
    await act(async () => { const st = store.getState(); st.workouts = []; store.save(); }); await flushAll(10);
    expect(screen.getByTestId('first-board')).toBeTruthy(); expect(screen.getByTestId('first-steps')).toBeTruthy();
  });
  test('trwający trening bez zakończonych: „Wróć do treningu”, bez „Zacznij pierwszy trening”', async () => {
    await boot(); await tap(screen.getByTestId('start-main')); await flushAll(10); await act(async () => { await store.flush(); });
    expect(screen.queryByText('Zacznij pierwszy trening')).toBeNull();
  });
});
