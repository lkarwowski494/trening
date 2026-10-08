/*
 * Podsumowanie tygodnia i miesiąca na ekranie Postępy (decyzja właściciela 08.10.2026, docs/21 4b): lib/period.ts + components/PeriodSummary.tsx.
 * Rodzaje (docs/20): logika (granice tygodnia od poniedziałku i miesiąca kalendarzowego, serie robocze bez rozgrzewki, objętość = store.volume,
 * czas, poprzedni okres, rekordy = workoutPRs), ekran (przełącznik, strzałki, puste stany, VoiceOver), języki (EN), niezmiennik (suma
 * tygodni = Postępy weeklyTotals). E2E: .maestro/05 (Postępy).
 */
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { weeklyTotals, workoutPRs } from '@/lib/stats';
import { periodRange, periodSummary, periodTitle } from '@/lib/period';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';

const NOW = new Date(2026, 9, 8, 18, 0); /* czwartek */
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
beforeEach(async () => { jest.setSystemTime(NOW.getTime()); await fresh(); });
afterEach(() => { applyLang('pl'); });

describe('logika (lib/period.ts)', () => {
  test('tydzień od poniedziałku 00:00 do następnego; miesiąc kalendarzowy; przesunięcia wstecz (także przez rok)', () => {
    expect(periodRange('week', 0, NOW)).toEqual({ start: at(9, 5, 0), end: at(9, 12, 0) });
    expect(periodRange('week', -1, NOW)).toEqual({ start: at(8, 28, 0), end: at(9, 5, 0) });
    expect(periodRange('month', 0, NOW)).toEqual({ start: at(9, 1, 0), end: at(10, 1, 0) });
    expect(periodRange('month', -10, NOW)).toEqual({ start: new Date(2025, 11, 1).getTime(), end: new Date(2026, 0, 1).getTime() });
  });
  test('liczby okresu: treningi, serie robocze (bez rozgrzewki), objętość jak w historii, czas; poprzedni okres obok', () => {
    const a = addWorkout(at(9, 5, 7), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 60, reps: 5, kind: 'warmup' }]]]);
    const b = addWorkout(at(9, 7), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    addWorkout(at(9, 4, 23), [['Back Squat', [{ weight: 80, reps: 5 }]]]); /* niedziela 23:00 — poprzedni tydzień */
    const s = periodSummary('week', 0, NOW);
    expect([s.workouts, s.sets, s.durationSec]).toEqual([2, 3, 7200]);
    expect(s.volume).toBe(store.volume(a) + store.volume(b));
    expect(s.prev).toEqual({ workouts: 1, sets: 1, volume: 400, durationSec: 3600 });
  });
  test('trening w toku się nie liczy; okres bez treningów — zera', () => {
    store.startEmpty(); const s = periodSummary('month', 0, NOW);
    expect([s.workouts, s.sets, s.volume, s.durationSec, s.prs.length]).toEqual([0, 0, 0, 0, 0]);
  });
  test('rekordy okresu = rekordy z podsumowania treningu (ten sam silnik), w kolejności treningów', () => {
    addWorkout(at(8, 20), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const w1 = addWorkout(at(9, 6), [['Back Squat', [{ weight: 105, reps: 5 }]]]);
    const w2 = addWorkout(at(9, 8, 8), [['Back Squat', [{ weight: 110, reps: 5 }]]]);
    const s = periodSummary('week', 0, NOW);
    expect(s.prs.map(p => p.workoutId)).toEqual([...workoutPRs(w1).map(() => w1.id), ...workoutPRs(w2).map(() => w2.id)]);
    expect(s.prs.length).toBeGreaterThan(0); expect(s.prs[0].pr.details).toEqual(workoutPRs(w1)[0].details);
  });
  test('niezmiennik: suma tygodni okresu = wykres „Serie robocze tygodniowo” (weeklyTotals)', () => {
    for (let d = 1; d <= 30; d += 3) addWorkout(at(8, d), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 90, reps: 8 }]]]);
    const wk = weeklyTotals(8, NOW);
    for (let i = 0; i < 8; i++) { const s = periodSummary('week', i - 7, NOW); expect([s.workouts, s.sets, s.volume]).toEqual([wk[i].workouts, wk[i].sets, wk[i].volume]); }
  });
  test('tytuł okresu w języku aplikacji', () => {
    expect(periodTitle('month', at(9, 1, 0))).toBe('październik 2026');
    expect(periodTitle('week', at(9, 5, 0))).toMatch(/^5 paź – 11 paź 2026$/);
    applyLang('en'); expect(periodTitle('month', at(9, 1, 0))).toBe('October 2026');
  });
});

describe('ekran Postępy — sekcja „Podsumowanie”', () => {
  const boot = async (fn: () => void, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); jest.setSystemTime(NOW.getTime()); await go('/more/progress'); await flushAll(10); };
  test('tydzień: wiersze z poprzednim okresem (VoiceOver), rekordy; „Następny okres” nieaktywny w bieżącym; strzałka wstecz i miesiąc', async () => {
    await boot(() => { addWorkout(at(8, 30), [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(at(9, 6), [['Back Squat', [{ weight: 110, reps: 5 }, { weight: 110, reps: 5 }]]]); });
    expect(screen.getByTestId('period-summary')).toBeTruthy();
    expect(screen.getByLabelText('Treningi: 1, poprzednio 1')).toBeTruthy();
    expect(screen.getByLabelText('Serie robocze: 2, poprzednio 1')).toBeTruthy();
    expect(screen.getByLabelText(/^Czas treningów: 1:00:00, poprzednio 1:00:00$/)).toBeTruthy();
    expect(screen.getByText('Rekordy w tym okresie')).toBeTruthy(); expect(screen.getAllByText(/^Back Squat/).length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Następny okres').props.accessibilityState).toMatchObject({ disabled: true });
    await tap(screen.getByLabelText('Poprzedni okres')); await flushAll(5);
    expect(screen.getByLabelText('Treningi: 1, poprzednio 0')).toBeTruthy(); expect(screen.getByText(/^28 wrz – 4 paź 2026$/)).toBeTruthy();
    expect(screen.getByLabelText('Następny okres').props.accessibilityState).toMatchObject({ disabled: false });
    await tap(screen.getByText('Miesiąc')); await flushAll(5);
    expect(screen.getByText('październik 2026')).toBeTruthy(); expect(screen.getByLabelText('Treningi: 1, poprzednio 1')).toBeTruthy();
  });
  test('puste stany: tydzień bez treningów i tydzień bez nowych rekordów; opis pod sekcją', async () => {
    await boot(() => { addWorkout(at(8, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    expect(screen.getByText('Brak treningów w tym okresie.')).toBeTruthy();
    expect(screen.getByText('Obok w nawiasie — cały poprzedni okres. Serie robocze bez rozgrzewki; rekordy jak w podsumowaniu treningu.')).toBeTruthy();
    await boot(() => { addWorkout(at(8, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(at(9, 6), [['Back Squat', [{ weight: 90, reps: 5 }]]]); });
    expect(screen.getByText('Bez nowych rekordów w tym okresie.')).toBeTruthy();
  });
  test('English', async () => {
    await boot(() => { addWorkout(at(9, 6), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }, 'en');
    for (const s of ['Summary', 'Week', 'Month', 'Records in this period', 'In brackets — the whole previous period. Working sets exclude warm-ups; records as in the workout summary.']) expect(screen.getByText(s)).toBeTruthy();
    expect(screen.getByLabelText('Workouts: 1, previously 0')).toBeTruthy(); expect(screen.getByLabelText('Previous period')).toBeTruthy();
  });
});
