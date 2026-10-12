/*
 * docs/22 P3 A (decyzja właściciela 11.10.2026): dolny przycisk „Zakończ trening i zapisz” usunięty z ekranu treningu — zostaje „Zakończ” w nagłówku
 * i „Zakończ trening” w karcie po ostatniej serii (w widoku „Lista” tylko nagłówek). Rodzaje (docs/20): ekran (liczba przycisków zakończenia w widoku
 * skupionym i listy), scenariusz (zakończenie z nagłówka w obu widokach, okno potwierdzenia), niezmiennik (dół listy: notatka, „Odrzuć trening”,
 * bez drugiego zakończenia), języki (EN).
 */
import * as store from '@/lib/store';
import { fresh, saved, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const boot = async (view: 'focus' | 'list', fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  await fresh(undefined, locale); S().settings.workoutView = view; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Bench Press (sztanga)')); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10);
};
const tick = async (ei: number, si: number) => { await act(async () => { const s = S().active!.exercises[ei].sets[si]; s.weight = 60; s.reps = 5; store.toggleDone(ei, si); }); await flushAll(10); };

test('widok skupiony: jeden „Zakończ” (nagłówek); w trakcie serii nie ma „Zakończ trening” ani dolnego „Zakończ trening i zapisz”', async () => {
  await boot('focus');
  expect(screen.getAllByText('Zakończ')).toHaveLength(1); expect(screen.queryByText('Zakończ trening')).toBeNull(); expect(screen.queryByText('Zakończ trening i zapisz')).toBeNull();
  expect(screen.getByText('Odrzuć trening')).toBeTruthy(); /* dół ekranu: notatka i „Odrzuć trening” */ expect(screen.getByLabelText('Notatka do treningu')).toBeTruthy();
});
test('widok skupiony: po ostatniej serii karta ma „Zakończ trening” (drugi przycisk to ten sam cel w innym miejscu), nadal bez przycisku na dole', async () => {
  await boot('focus', () => { S().active!.exercises.forEach(e => { e.sets = e.sets.slice(0, 1); }); });
  await tick(0, 0); await tick(1, 0);
  expect(screen.getAllByText('Zakończ')).toHaveLength(1); expect(screen.getAllByText('Zakończ trening')).toHaveLength(1); expect(screen.queryByText('Zakończ trening i zapisz')).toBeNull();
  await tap(screen.getByText('Zakończ trening')); expect(global.__alerts.at(-1)!.title).toBe('Zakończyć trening?'); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
  expect(S().active).toBeNull(); expect(store.finishedWorkouts()).toHaveLength(1);
});
test('widok „Lista” (świadomie bez przycisku na dole): tylko nagłówek „Zakończ”; kończy trening z potwierdzeniem', async () => {
  await boot('list'); await tick(0, 0);
  expect(screen.getAllByText('Zakończ')).toHaveLength(1); expect(screen.queryByText('Zakończ trening')).toBeNull(); expect(screen.queryByText('Zakończ trening i zapisz')).toBeNull();
  await tap(screen.getByText('Zakończ')); expect(global.__alerts.at(-1)!.title).toBe('Zakończyć trening?'); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
  expect(S().active).toBeNull(); expect(store.finishedWorkouts()).toHaveLength(1);
});
test('podwójne tapnięcie „Zakończ” w nagłówku → jedno okno potwierdzenia', async () => {
  await boot('list'); await tick(0, 0); const b = screen.getByText('Zakończ'); await tap(b); await tap(b);
  expect(global.__alerts.filter(x => x.title === 'Zakończyć trening?')).toHaveLength(1);
});
test('EN: „Finish” w nagłówku, bez „Finish and save workout”', async () => {
  await boot('list', () => {}, 'en'); expect(screen.getAllByText('Finish')).toHaveLength(1); expect(screen.queryByText('Finish and save workout')).toBeNull();
});
