/*
 * M1-audytor-generalny-025 (04-studio-projektowe-007, audyt M1 27.10.2026; przejście poznawcze P1, kroki 2 i 3 „porażka”):
 * „Pierwsze kroki” dla nowej osoby —
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
const flat = (el: { props: { style?: unknown } }) => StyleSheet.flatten(typeof el.props.style === 'function' ? (el.props.style as (s: { pressed: boolean }) => unknown)({ pressed: false }) : el.props.style as never) as Record<string, unknown>;
const STEP3_START = 'Pierwszy trening: duży przycisk „Start” u góry albo „Pusty trening”.';
const STEP3_EMPTY = 'Pierwszy trening: duży przycisk „Pusty trening” u góry.';

describe('M1-audytor-generalny-025: „Pierwsze kroki” — przyciski i teksty zgodne z ekranem', () => {
  test('nowa osoba bez szablonu: kroki 1 i 2 mają różne przyciski („Szablony i plan”, „Planowanie”), oba prowadzą do ekranu planu', async () => {
    await boot();
    expect(box().getAllByText('Szablony i plan')).toHaveLength(1); expect(box().getAllByText('Planowanie')).toHaveLength(1);
    await tap(box().getByText('Szablony i plan')); await flushAll(10);
    expect(screen.getByText('Wygeneruj szablony i plan')).toBeTruthy(); /* ekran planu (+ Nowy szablon — w wyborze szablonu dnia, tests/flows.test.tsx) */
  });
  test('bez szablonu: krok 3 wskazuje przycisk, który jest na ekranie („Pusty trening”), bez „Start”', async () => {
    await boot();
    expect(within(screen.getByTestId('start-main')).getAllByText('Pusty trening').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(`3. ${STEP3_EMPTY} do zrobienia`)).toBeTruthy();
    expect(box().queryByText(/„Start”/)).toBeNull();
  });
  test('z szablonem: duży przycisk to „Start: …”, krok 3 mówi o „Start”', async () => {
    await boot(() => { withDemoTemplates(); });
    expect(within(screen.getByTestId('start-main')).getByText(/^Start: /)).toBeTruthy();
    expect(screen.getByLabelText(`3. ${STEP3_START} do zrobienia`)).toBeTruthy();
  });
  test('wszystkie przyciski kroków jednego rodzaju (to samo tło i obramowanie co „Planowanie”)', async () => {
    await boot();
    const places = 'Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.';
    const btns = box().getAllByRole('button').filter(b => b.props.accessibilityLabel !== places); expect(btns.length).toBe(4); /* 1.0.1 (DEC-04 a): + „Importuj historię z pliku CSV” */
    const ref = flat(box().getAllByRole('button', { name: 'Planowanie' }).at(-1)!);
    for (const b of btns) { const s = flat(b); expect([b.props.accessibilityLabel, s.backgroundColor, s.borderColor]).toEqual([b.props.accessibilityLabel, ref.backgroundColor, ref.borderColor]); }
  });
  test('zdanie o „Miejscach i sprzęcie” ma „›” (przejście na inny ekran, wzorzec 17); znak ukryty dla VoiceOver, etykieta bez zmian', async () => {
    await boot();
    const places = 'Ćwiczysz w domu albo na siłowni? Ustaw sprzęt w „Miejsca i sprzęt”.';
    const row = screen.getByLabelText(places); expect(row.props.accessibilityRole).toBe('button');
    const chev = within(row).getByText('›', { includeHiddenElements: true }); expect(chev).toBeTruthy();
    expect(within(row).queryByText('›')).toBeNull(); /* ukryty dla VoiceOver */
  });
  test('EN: „Templates and plan”; krok 3 bez szablonu — „Empty workout”', async () => {
    await boot(() => {}, 'en');
    expect(box().getByText('Templates and plan')).toBeTruthy(); expect(box().getByText('Planning')).toBeTruthy();
    expect(box().getByText('First workout: the big “Empty workout” button at the top.')).toBeTruthy();
  });
  test('po utworzeniu szablonu i planu kroki 1 i 2 odhaczone, bez przycisków „Szablony i plan” i „Planowanie”', async () => {
    await boot(() => { const t = withDemoTemplates(); plan.setWeekDay(0, t[0].id); });
    expect(box().queryByText('Szablony i plan')).toBeNull(); expect(box().queryByText('Planowanie')).toBeNull();
  });
});
