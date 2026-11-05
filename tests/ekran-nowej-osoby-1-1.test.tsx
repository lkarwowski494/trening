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

jest.setTimeout(60000);
const NOW = new Date(2026, 10, 5, 9, 0); /* czwartek 5 listopada 2026 — dzień decyzji */
afterEach(() => { applyLang('pl'); draft.__resetObjDrafts(); });
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
