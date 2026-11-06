/*
 * M1-audytor-generalny-025 (04-studio-projektowe-007, audyt M1 27.10.2026; przejście poznawcze P1, kroki 2 i 3 „porażka”):
 * „Pierwsze kroki” dla nowej osoby — od 05.11.2026 (docs/18, ekran nowej osoby 1.1) karta ma postać czterech kafelków „Przygotuj się do pierwszej serii”; cele audytu zostają, zmienia się postać:
 *  - jeden kafelek „Szablony i plan” (bez drugiego „Planowanie”), nazwany celem, prowadzi na ekran planu;
 *  - duży przycisk na ekranie to „Zacznij pierwszy trening” (bez szablonu) albo „Start: …”; zdanie kroku 3 o przycisku „Start”/„Pusty trening” zniknęło razem z krokami;
 *  - wszystkie kafelki jednego rodzaju; „›” po tekście (docs/32 wzorzec 17), ukryty dla VoiceOver.
 * Stan sprzed zmiany:
 *  - krok 1 („Utwórz pierwszy szablon albo wygeneruj szablony i plan.”) miał przycisk „Planowanie”, ten sam co krok 2 → przycisk nazwany celem: „Szablony i plan”
 *    (prowadzi do tego samego miejsca: ekran planu z „+ Nowy szablon” i „Wygeneruj szablony i plan”; P4 A z 11.10.2026 bez zmian);
 *  - krok 3 wskazywał duży przycisk „Start”, którego osoba bez szablonu nie ma (duży przycisk to „Pusty trening”, lib/home mainStart) → tekst zależny od stanu;
 *  - „Przewodnik” miał inny rodzaj przycisku (ghost) niż pozostałe kroki → jeden rodzaj;
 *  - zdanie o „Miejscach i sprzęcie” przechodzi na inny ekran → „›” po tekście (docs/32 wzorzec 17), znak ukryty dla VoiceOver.
 */
import { StyleSheet } from 'react-native';
import { within } from '@testing-library/react-native';
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 9, 0); /* czwartek */
afterEach(() => { applyLang('pl'); });
const boot = async (fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
};
const box = () => within(screen.getByTestId('first-steps'));
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten((typeof el.props.style === 'function' ? (el.props.style as (s: { pressed: boolean }) => unknown)({ pressed: false }) : el.props.style) as never) as Record<string, unknown>;
const TILE_IDS = ['first-tile-plan', 'first-tile-places', 'first-steps-import', 'first-tile-guide'];
const PLACES = 'Miejsca i sprzęt. Dom albo siłownia — ustaw swój sprzęt.';

describe('M1-audytor-generalny-025: ekran nowej osoby (dawniej „Pierwsze kroki”) — kafelki i teksty zgodne z ekranem', () => {
  test('nowa osoba bez szablonu: jeden kafelek „Szablony i plan” (bez „Planowanie”), prowadzi do ekranu planu', async () => {
    await boot();
    expect(box().getAllByText('Szablony i plan')).toHaveLength(1); expect(box().queryAllByText('Planowanie')).toHaveLength(0);
    await tap(screen.getByTestId('first-tile-plan')); await flushAll(10);
    expect(screen.getByText('Wygeneruj szablony i plan')).toBeTruthy(); /* ekran planu (+ Nowy szablon — w wyborze szablonu dnia, tests/flows.test.tsx) */
  });
  test('bez szablonu: duży przycisk to „Zacznij pierwszy trening”; nie ma zdania kroku 3 o „Start” ani „Pusty trening”', async () => {
    await boot();
    expect(within(screen.getByTestId('start-main')).getAllByText('Zacznij pierwszy trening').length).toBeGreaterThan(0);
    expect(screen.queryByText(/duży przycisk/)).toBeNull(); expect(box().queryByText(/„Start”/)).toBeNull(); expect(screen.queryByText('Pusty trening')).toBeNull();
  });
  test('z szablonem: duży przycisk to „Start: …”, kafelki zostają (bez zdania o „Start”)', async () => {
    await boot(() => { withDemoTemplates(); });
    expect(within(screen.getByTestId('start-main')).getByText(/^Start: /)).toBeTruthy();
    for (const id of TILE_IDS) expect(screen.getByTestId(id)).toBeTruthy(); expect(screen.queryByText(/duży przycisk/)).toBeNull();
  });
  test('wszystkie cztery kafelki jednego rodzaju (to samo obramowanie i rodzaj przycisku)', async () => {
    await boot();
    const btns = TILE_IDS.map(id => screen.getByTestId(id)); const ref = flat(btns[0]);
    for (const b of btns) { const s = flat(b); expect([b.props.accessibilityLabel, b.props.accessibilityRole, s.borderColor, s.borderRadius, s.borderWidth]).toEqual([b.props.accessibilityLabel, 'button', ref.borderColor, ref.borderRadius, ref.borderWidth]); }
  });
  test('kafelek „Miejsca i sprzęt” ma „›” (przejście na inny ekran, wzorzec 17); znak ukryty dla VoiceOver, etykieta „tytuł. opis”', async () => {
    await boot();
    const row = screen.getByLabelText(PLACES); expect(row.props.accessibilityRole).toBe('button');
    const chev = within(row).getByText('›', { includeHiddenElements: true }); expect(chev).toBeTruthy();
    expect(within(row).queryByText('›')).toBeNull(); /* ukryty dla VoiceOver */
  });
  test('EN: „Templates and plan”, „Start your first workout”; bez zdania o dużym przycisku', async () => {
    await boot(() => {}, 'en');
    expect(box().getByText('Templates and plan')).toBeTruthy(); expect(box().queryByText('Planning')).toBeNull();
    expect(within(screen.getByTestId('start-main')).getByText('Start your first workout')).toBeTruthy(); expect(screen.queryByText(/big “/)).toBeNull();
  });
  test('po utworzeniu szablonu i planu kafelki zostają (nie są „zrobione”, brak ✓), a do pierwszego treningu rządzi tablica „Dziś”', async () => {
    await boot(() => { const t = withDemoTemplates(); plan.setWeekDay(3 /* czwartek = dziś */, t[0].id); });
    for (const id of TILE_IDS) expect(screen.getByTestId(id)).toBeTruthy(); expect(box().queryByText('Planowanie')).toBeNull(); expect(screen.queryByLabelText(/zrobione$/)).toBeNull();
    expect(screen.queryByTestId('first-board')).toBeNull(); expect(screen.getByText(/^Dziś: /)).toBeTruthy();
  });
});
