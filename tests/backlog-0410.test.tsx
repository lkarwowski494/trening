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
