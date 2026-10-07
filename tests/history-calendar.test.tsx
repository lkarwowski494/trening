/*
 * Kalendarz w Historii (docs/21 pkt 4a; kolejność zatwierdzona przez właściciela 07.10.2026 wieczór). Rodzaje (docs/20): logika
 * (lib/calendar.ts), ekran (oznaczone dni, strzałki, filtr dnia, „Pokaż wszystkie”), dostępność (dni z treningiem to przyciski z datą
 * i liczbą sesji, inne ukryte), języki (macierz LANGS: 7 różnych skrótów dni i nazwa miesiąca), dane (nic nie jest zapisywane).
 */
import * as store from '@/lib/store';
import { LANGS, applyLang as setLang } from '@/lib/i18n';
import { monthGrid, workoutsByDay, dayKey, shiftMonth, weekdayLabels, monthTitle, dayTitle } from '@/lib/calendar';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

jest.setTimeout(60000);
afterAll(() => { setLang('pl'); });
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m, d, h).getTime();

describe('logika (lib/calendar.ts)', () => {
  test('monthGrid: tygodnie od poniedziałku, pełne wiersze, dni sąsiednich miesięcy oznaczone', () => {
    const oct = monthGrid(2026, 9); /* 1.10.2026 — czwartek */
    expect(oct).toHaveLength(5); expect(oct.every(w => w.length === 7)).toBe(true);
    expect(oct[0].map(c => c.d)).toEqual([28, 29, 30, 1, 2, 3, 4]); expect(oct[0].map(c => c.inMonth)).toEqual([false, false, false, true, true, true, true]);
    expect(oct[4].map(c => c.d)).toEqual([26, 27, 28, 29, 30, 31, 1]); expect(oct.flat().filter(c => c.inMonth)).toHaveLength(31);
    const feb26 = monthGrid(2026, 1); expect(feb26).toHaveLength(5); expect(feb26[0][6]).toMatchObject({ d: 1, inMonth: true }); /* 1.02.2026 — niedziela: ostatnia kolumna */
  });
  test('monthGrid: luty przestępny (2028), miesiąc zaczynający się w poniedziałek, 6 tygodni', () => {
    expect(monthGrid(2028, 1).flat().filter(c => c.inMonth)).toHaveLength(29);
    const jun26 = monthGrid(2026, 5); expect(jun26[0][0]).toMatchObject({ d: 1, inMonth: true }); /* 1.06.2026 — poniedziałek */
    expect(monthGrid(2026, 7)).toHaveLength(6); /* sierpień 2026: sobota 1. → 6 tygodni */
  });
  test('dayKey i workoutsByDay: dzień lokalny startu; trening w toku pomijany; kilka w jednym dniu', () => {
    expect(dayKey(at(2026, 9, 7, 0))).toBe('2026-10-07'); expect(dayKey(at(2026, 9, 7, 23))).toBe('2026-10-07');
    const a = { id: 'a', startedAt: at(2026, 9, 7, 8), finishedAt: at(2026, 9, 7, 9) } as never; const b = { id: 'b', startedAt: at(2026, 9, 7, 18), finishedAt: at(2026, 9, 7, 19) } as never;
    const c = { id: 'c', startedAt: at(2026, 9, 8), finishedAt: null } as never;
    const m = workoutsByDay([a, b, c]); expect([...m.keys()]).toEqual(['2026-10-07']); expect(m.get('2026-10-07')!.map(x => (x as { id: string }).id)).toEqual(['a', 'b']);
  });
  test('shiftMonth: przejście przez koniec i początek roku', () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ y: 2027, m: 0 }); expect(shiftMonth(2026, 0, -1)).toEqual({ y: 2025, m: 11 }); expect(shiftMonth(2026, 9, 0)).toEqual({ y: 2026, m: 9 });
  });
});

describe('języki: skróty dni tygodnia i nazwa miesiąca', () => {
  /* @matrix LANGS */
  test.each([...LANGS])('%s: 7 różnych, niepustych skrótów dni (od poniedziałku); tytuł miesiąca z rokiem; data dnia z rokiem', async l => {
    await fresh(); setLang(l);
    const h = weekdayLabels(); expect(h).toHaveLength(7); expect(new Set(h).size).toBe(7); expect(h.every(x => x.trim().length > 0)).toBe(true);
    expect(monthTitle(2026, 9)).toMatch(/2026/); expect(dayTitle({ y: 2026, m: 9, d: 7 })).toMatch(/2026/);
  });
  test('po polsku: poniedziałek pierwszy, październik', async () => {
    await fresh(); setLang('pl'); expect(weekdayLabels()[0]).toMatch(/^pon/i); expect(monthTitle(2026, 9)).toMatch(/październik/i);
  });
});

describe('ekran Historia', () => {
  const boot = async (fn: () => void) => { await fresh(); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await go('/history'); await flushAll(10); };
  test('dni z treningiem w bieżącym miesiącu to przyciski „data, N sesji”; inne dni i nagłówki dni — ukryte dla VoiceOver', async () => {
    const now = new Date(); const d1 = at(now.getFullYear(), now.getMonth(), 1, 9); const d2 = at(now.getFullYear(), now.getMonth(), 2, 9);
    await boot(() => { addWorkout(d1, [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(d1 + 3600e3 * 5, [['Plank', [{ durationSec: 60 }]]]); addWorkout(d2, [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    expect(screen.getByLabelText(`${dayTitle({ y: now.getFullYear(), m: now.getMonth(), d: 1 })}, 2 sesje`)).toBeTruthy();
    expect(screen.getByLabelText(`${dayTitle({ y: now.getFullYear(), m: now.getMonth(), d: 2 })}, 1 sesja`)).toBeTruthy();
    expect(screen.getAllByRole('button').filter(b => /, \d+ sesj/.test(b.props.accessibilityLabel ?? ''))).toHaveLength(2);
    expect(screen.getByText(monthTitle(now.getFullYear(), now.getMonth()))).toBeTruthy();
  });
  test('tapnięcie dnia filtruje listę do tego dnia; „Pokaż wszystkie” i drugie tapnięcie wracają do całości', async () => {
    const now = new Date(); const d1 = at(now.getFullYear(), now.getMonth(), 1, 9); const d2 = at(now.getFullYear(), now.getMonth(), 2, 9);
    await boot(() => { const a = addWorkout(d1, [['Back Squat', [{ weight: 100, reps: 5 }]]]); a.templateName = 'Dzień A'; const b = addWorkout(d2, [['Plank', [{ durationSec: 60 }]]]); b.templateName = 'Dzień B'; });
    expect(screen.getByText('Dzień A')).toBeTruthy(); expect(screen.getByText('Dzień B')).toBeTruthy();
    await tap(screen.getByTestId(`cal-${dayKey(d1)}`)); expect(screen.getByText('Dzień A')).toBeTruthy(); expect(screen.queryByText('Dzień B')).toBeNull();
    expect(screen.getByTestId(`cal-${dayKey(d1)}`).props.accessibilityState.selected).toBe(true);
    await tap(screen.getByText('Pokaż wszystkie')); expect(screen.getByText('Dzień B')).toBeTruthy();
    await tap(screen.getByTestId(`cal-${dayKey(d2)}`)); expect(screen.queryByText('Dzień A')).toBeNull(); await tap(screen.getByTestId(`cal-${dayKey(d2)}`)); expect(screen.getByText('Dzień A')).toBeTruthy();
  });
  test('strzałki: poprzedni i następny miesiąc (także przez koniec roku); trening sprzed miesiąca widać po przejściu wstecz', async () => {
    const now = new Date(); const prev = shiftMonth(now.getFullYear(), now.getMonth(), -1); const old = at(prev.y, prev.m, 15, 9);
    await boot(() => { addWorkout(old, [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    expect(screen.queryByTestId(`cal-${dayKey(old)}`)).toBeNull();
    await tap(screen.getByLabelText('Poprzedni miesiąc')); expect(screen.getByText(monthTitle(prev.y, prev.m))).toBeTruthy(); expect(screen.getByTestId(`cal-${dayKey(old)}`)).toBeTruthy();
    await tap(screen.getByLabelText('Następny miesiąc')); await tap(screen.getByLabelText('Następny miesiąc')); const nx = shiftMonth(now.getFullYear(), now.getMonth(), 1); expect(screen.getByText(monthTitle(nx.y, nx.m))).toBeTruthy();
  });
  test('bez przewijania kalendarz pokazuje bieżący miesiąc także po zmianie daty (powrót z tła); po przewinięciu zostaje wybrany miesiąc', async () => {
    await boot(() => { addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); jest.setSystemTime(new Date(2026, 11, 31, 20).getTime()); /* kalendarz jest nad listą — potrzebna choć jedna sesja */ await act(async () => { store.refreshViews(); }); await flushAll(10);
    expect(screen.getByText(monthTitle(2026, 11))).toBeTruthy();
    jest.setSystemTime(new Date(2027, 0, 2, 9).getTime()); await act(async () => { store.refreshViews(); }); await flushAll(10); expect(screen.getByText(monthTitle(2027, 0))).toBeTruthy();
    await tap(screen.getByLabelText('Poprzedni miesiąc')); jest.setSystemTime(new Date(2027, 1, 2, 9).getTime()); await act(async () => { store.refreshViews(); }); await flushAll(10);
    expect(screen.getByText(monthTitle(2026, 11))).toBeTruthy();
  });
  test('English: strzałki i liczba sesji po angielsku', async () => {
    const now = new Date(); const d1 = at(now.getFullYear(), now.getMonth(), 1, 9);
    await fresh(undefined, 'en'); addWorkout(d1, [['Back Squat', [{ weight: 100, reps: 5 }]]]); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); await go('/history'); await flushAll(10);
    expect(screen.getByLabelText('Previous month')).toBeTruthy(); expect(screen.getByLabelText('Next month')).toBeTruthy(); expect(screen.getByLabelText(/, 1 session$/)).toBeTruthy();
  });
  test('dane: kalendarz nic nie zapisuje (przeglądanie i filtr bez zmian w stanie)', async () => {
    const now = new Date(); const d1 = at(now.getFullYear(), now.getMonth(), 1, 9);
    await boot(() => { addWorkout(d1, [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); const before = JSON.stringify(store.getState());
    await tap(screen.getByTestId(`cal-${dayKey(d1)}`)); await tap(screen.getByLabelText('Poprzedni miesiąc')); expect(JSON.stringify(store.getState())).toBe(before);
  });
});
