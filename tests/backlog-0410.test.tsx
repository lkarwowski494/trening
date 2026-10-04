/* Backlog bez decyzji właściciela (04.10.2026, przed testem na telefonie 05.10):
 *  1. picker z celem swap:edit (D6) — „Przywróć …” zarchiwizowanego ćwiczenia jak w swap:active (docs/14 pkt 10, drobiazg z audytu E2);
 *  2. tests/app.tsx: renderApp({ navTimers: false }) — bez automatycznego runOnlyPendingTimers przy nawigacji (docs/13 B11, NISKIE):
 *     test może sprawdzić, że zamknięcie ekranu nie zostawia zaległych timerów. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import { fresh, ex, addWorkout } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const day = (n: number) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, 18).getTime(); };

test('picker swap:edit: „Przywróć …” zarchiwizowanego ćwiczenia z tą samą miarą — przywraca i przepina blok', async () => {
  await fresh(); addWorkout(day(5), [['Bench Press (hantle)', [{ weight: 20, reps: 10 }]]]); store.deleteExercise(ex('Bench Press (hantle)').id);
  const w = addWorkout(day(2), [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/history/edit/${w.id}`); await flushAll(20);
  const d = edit.draftOf(w.id)!; await go(`/picker?target=swap:edit:${w.id}:${d.w.exercises[0].id}`); await flushAll(20);
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Bench Press (hantle)'); await flushAll(5);
  await tap(screen.getByText('Przywróć „Bench Press (hantle)”')); await flushAll(20);
  expect(ex('Bench Press (hantle)').archived).toBeFalsy(); expect(d.w.exercises[0].exerciseId).toBe(ex('Bench Press (hantle)').id);
  /* inna miara — bez „Przywróć” */
  addWorkout(day(4), [['Plank', [{ durationSec: 60 }]]]); await act(async () => { store.deleteExercise(ex('Plank').id); });
  await go(`/picker?target=swap:edit:${w.id}:${d.w.exercises[0].id}`); await flushAll(20);
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await flushAll(5);
  expect(screen.queryByText('Przywróć „Plank”')).toBeNull();
});

test('renderApp({ navTimers: false }): arkusz zamiany zamknięty „Anuluj” nie zostawia zaległych timerów', async () => {
  await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())), navTimers: false }); await flushAll(2000);
  const before = jest.getTimerCount();
  await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(50);
  await tap(screen.getByText('Anuluj')); await flushAll(2000);
  expect(jest.getTimerCount()).toBe(before);
});

import { sessionsFor, recordsFor } from '@/lib/stats';
test('Q-026 (decyzja a, 04.10.2026): serie zapisane pod innym sprzętem nie liczą się do rekordów i wykresu masy ciała; lista nadal je pokazuje', async () => {
  await fresh(); const e = store.newExercise('Moje podciąganie'); store.setEquipment(e, 'inne');
  addWorkout(day(5), [['Moje podciąganie', [{ weight: 42.5, reps: 12 }]]]);
  store.setEquipment(e, 'masa ciała');
  addWorkout(day(2), [['Moje podciąganie', [{ addKg: 0, reps: 8 }]]]);
  const ss = sessionsFor(e); const older = ss.find(x => x.sets[0].weight === 42.5)!, newer = ss.find(x => x !== older)!;
  expect(older.hasLoad).toBe(false); expect(older.maxRepsFree).toBe(0); /* bez punktu „max ±” = 0 i bez rekordu bez asysty */
  expect(newer.hasLoad).toBe(true); expect(newer.maxRepsFree).toBe(8);
  expect(recordsFor(e).maxRepsFree).toBe(8);
  expect(store.setSummary(e, older.sets[0])).toBe('12@+42,5'); /* widok historii bez zmian (shownLoad, runda 83b) */
});

import { prMap } from '@/lib/stats';
test('Q-026 (audyt 04.10): po zmianie sprzętu na masę ciała pierwszy trening nie dostaje fałszywego rekordu „suma powtórzeń” (brak porównywalnej sumy)', async () => {
  await fresh(); const e = store.newExercise('Moje dipy'); store.setEquipment(e, 'inne');
  addWorkout(day(5), [['Moje dipy', [{ weight: 42.5, reps: 12 }, { weight: 42.5, reps: 12 }]]]);
  store.setEquipment(e, 'masa ciała');
  const w = addWorkout(day(1), [['Moje dipy', [{ reps: 3 }]]]);
  expect([...prMap(w).values()].flat()).not.toContain('suma powtórzeń');
  const w2 = addWorkout(day(0), [['Moje dipy', [{ reps: 5 }]]]); /* po pierwszej porównywalnej sesji rekord sumy działa */
  expect([...prMap(w2).values()].flat()).toContain('suma powtórzeń');
});

test('arkusz „Inne” (audyt 04.10): przewijanie nie gubi tapnięcia przy klawiaturze; „Przywróć …” zarchiwizowanego i „Utwórz …” z miarą A', async () => {
  await fresh(); addWorkout(day(5), [['Bench Press (hantle)', [{ weight: 20, reps: 10 }]]]); store.deleteExercise(ex('Bench Press (hantle)').id);
  store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); await store.flush();
  await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
  await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
  await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
  const sv = screen.UNSAFE_getAllByType(require('react-native').ScrollView).find((x: any) => x.props.keyboardShouldPersistTaps === 'handled'); expect(sv).toBeTruthy();
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Bench Press (hantle)'); await flushAll(5);
  await tap(screen.getByText('Przywróć „Bench Press (hantle)”')); await flushAll(20);
  expect(store.getState().active!.exercises[0].exerciseId).toBe(ex('Bench Press (hantle)').id); expect(ex('Bench Press (hantle)').archived).toBeFalsy();
  await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (hantle)')); await flushAll(20);
  await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
  await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Moje wyciskanie'); await flushAll(5);
  await tap(screen.getByText('Utwórz „Moje wyciskanie”')); await flushAll(20);
  const mine = store.getState().exercises.find(e => e.name === 'Moje wyciskanie')!; expect(mine.metric).toBe('weight_reps'); expect(store.getState().active!.exercises[0].exerciseId).toBe(mine.id);
});
