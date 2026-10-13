/*
 * Ekran treningu: serie odhaczone na zegarku jako „zrobione inaczej niż w planie” (decyzja właściciela 13.10.2026) — oznaczenie „do uzupełnienia” w wierszu serii, przycisk „Gotowe”,
 * prośba przed „Zakończ” ([Anuluj, Zakończ mimo to], wzorzec potwierdzeń docs/32), rekord liczony dopiero po uzupełnieniu. Rodzaje (docs/20): ekran, scenariusz (z restartem), języki (EN),
 * dane (znacznik nie trafia do historii), regresja zwykłego „Zakończ”.
 */
import * as store from '@/lib/store';
import { prMap } from '@/lib/stats';
import { applyWatchEvent } from '@/lib/watch/apply';
import { fresh, saved, ex, pressAlert, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const T0 = Date.UTC(2026, 9, 13, 10);
const boot = async (locale: 'pl' | 'en' = 'pl', fn: () => void = () => {}) => {
  await fresh(undefined, locale); S().settings.workoutView = 'list'; store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0); store.addSet(0); const a = S().active!;
  a.exercises[0].sets.forEach(s => { s.weight = 80; s.reps = 8; }); fn(); store.save(a);
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10);
};
const fromWatch = async (type: 'done' | 'differ', si: number, at = Date.now()) => { await act(async () => { const a = S().active!; await applyWatchEvent({ v: 1, kind: 'event', eventId: `e-${type}-${si}-${at}`, workoutId: a.id, baseRev: 1, at, client: 'apple', type, setId: a.exercises[0].sets[si].id } as never, 1); }); await flushAll(10); };

test('seria odhaczona jako „zrobione inaczej”: w wierszu „do uzupełnienia” i „Gotowe” (etykiety VoiceOver z numerem serii i ćwiczeniem); seria „zrobione według planu” bez oznaczenia', async () => {
  await boot(); await fromWatch('differ', 0); await fromWatch('done', 1);
  expect(screen.getAllByText('do uzupełnienia')).toHaveLength(1); expect(screen.getByLabelText('Seria 1 do uzupełnienia — Bench Press (sztanga)')).toBeTruthy();
  expect(screen.getByLabelText('Seria 1 uzupełniona — Bench Press (sztanga)')).toBeTruthy(); expect(screen.queryByLabelText(/^Seria 2 do uzupełnienia/)).toBeNull(); expect(screen.getByTestId('tofill-0-0')).toBeTruthy();
});
test('„Gotowe” zdejmuje znacznik (dane i ekran); po „Gotowe” zwykłe „Zakończ” bez prośby', async () => {
  await boot(); await fromWatch('differ', 0); await tap(screen.getByText('Gotowe'));
  expect(S().active!.exercises[0].sets[0].toFill).toBeUndefined(); expect(screen.queryByText('do uzupełnienia')).toBeNull();
  await tap(screen.getByText('Zakończ')); expect(global.__alerts.at(-1)!.title).toBe('Zakończyć trening?');
});
test('„Zakończ” z seriami do uzupełnienia: najpierw prośba z liczbą serii; „Anuluj” wraca do treningu (nic się nie zmienia); „Zakończ mimo to” przechodzi do zwykłego potwierdzenia', async () => {
  await boot(); await fromWatch('differ', 0); await fromWatch('differ', 1);
  await tap(screen.getByText('Zakończ')); const a = global.__alerts.at(-1)!;
  expect(a.title).toBe('Serie do uzupełnienia'); expect(a.msg).toBe('Z zegarka oznaczono serie jako zrobione inaczej niż w planie: 2. Uzupełnij powtórzenia i ciężar — rekord liczy się dopiero po uzupełnieniu.'); expect(a.buttons!.map(b => b.text)).toEqual(['Anuluj', 'Zakończ mimo to']);
  await act(async () => { pressAlert('Serie do uzupełnienia', 'Anuluj'); }); expect(S().active).not.toBeNull(); expect(S().active!.exercises[0].sets.filter(s => s.toFill)).toHaveLength(2);
  await tap(screen.getByText('Zakończ')); await act(async () => { pressAlert('Serie do uzupełnienia', 'Zakończ mimo to'); }); await flushAll(10);
  expect(global.__alerts.at(-1)!.title).toBe('Zakończyć trening?'); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
  expect(S().active).toBeNull(); const w = store.finishedWorkouts()[0]; expect(w.exercises[0].sets.map(s => [s.done, s.weight, s.reps, s.toFill])).toEqual([[true, 80, 8, undefined], [true, 80, 8, undefined]]);
});
test('podwójne tapnięcie „Zakończ” z seriami do uzupełnienia → jedna prośba', async () => {
  await boot(); await fromWatch('differ', 0); const b = screen.getByText('Zakończ'); await tap(b); await tap(b); expect(global.__alerts.filter(x => x.title === 'Serie do uzupełnienia')).toHaveLength(1);
});
test('uzupełnienie po restarcie aplikacji: znacznik przeżywa restart, a wartość poprawiona w wierszu zostaje w historii po „Zakończ mimo to”', async () => {
  await boot(); await fromWatch('differ', 0); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); expect(S().active!.exercises[0].sets[0].toFill).toBe(true); expect(screen.getAllByText('do uzupełnienia')).toHaveLength(1);
  await act(async () => { S().active!.exercises[0].sets[0].reps = 6; store.save(S().active!); }); await tap(screen.getByText('Gotowe')); await tap(screen.getByText('Zakończ')); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
  expect(store.finishedWorkouts()[0].exercises[0].sets[0]).toMatchObject({ reps: 6, done: true }); expect('toFill' in store.finishedWorkouts()[0].exercises[0].sets[0]).toBe(false);
});
test('rekord: seria „do uzupełnienia” nie ma plakietki rekordu; po „Gotowe” ma (ta sama wartość z planu)', async () => {
  await boot('pl', () => {}); await act(async () => { addWorkout(T0 - 7 * 86400e3, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }]]]); });
  await fromWatch('differ', 0); const a = S().active!; expect(prMap(a).get(a.exercises[0].sets[0].id)).toBeUndefined();
  await tap(screen.getByText('Gotowe')); expect(prMap(a).get(a.exercises[0].sets[0].id)?.length).toBeGreaterThan(0);
});
test('EN: „to fill in”, „Done”, „Sets to fill in” + [Cancel, Finish anyway]', async () => {
  await boot('en'); await fromWatch('differ', 0); expect(screen.getByText('to fill in')).toBeTruthy(); expect(screen.getByLabelText('Set 1 to fill in — Bench Press (Barbell)')).toBeTruthy();
  await tap(screen.getByText('Finish')); const a = global.__alerts.at(-1)!; expect([a.title, a.buttons!.map(b => b.text)]).toEqual(['Sets to fill in', ['Cancel', 'Finish anyway']]);
});
