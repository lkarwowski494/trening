/* Runda 72 — testy z audytu T8 (pełna ścieżka użytkownika, weryfikacja końcowa). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as stats from '@/lib/stats';
import { exName } from '@/lib/i18n';
import { renderApp, tap, type, flushAll, screen, go, act } from './app';
import { ex, pressAlert, saved, seedWithDemo } from './helpers';

jest.setTimeout(60000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); });

const startTemplate = async (name: string) => { await tap(screen.getByLabelText(`Start: ${name}`)); await flushAll(10); };
const finishConfirmed = async (title = 'Zakończyć trening?', btn = 'Zakończ', open = 'Zakończ trening i zapisz') => { await tap(screen.getAllByText(open)[0]); pressAlert(title, btn); await flushAll(500); };
const repsOf = (exN: string, n: number) => screen.getAllByLabelText('Powtórzenia').find(x => x.props.accessibilityHint === `Seria ${n} — ${exN}`)!;
const tick = async (exN: string, n: number) => tap(screen.getByLabelText(`Seria ${n} zrobiona — ${exN}`));

test('A1 band-assisted (no kg) chin-ups: e1RM/volume PR over unassisted reps', async () => {
  await renderApp({ saved: seedWithDemo() });
  store.save(); await flushAll(400);
  const chin = exName(ex('Chin Up'));
  // Day 1: 6 unassisted reps
  await startTemplate('Upper A');
  await type(repsOf(chin, 1), '6'); await tick(chin, 1);
  await finishConfirmed(); await flushAll(500);
  expect(store.getState().workouts.length).toBe(1);
  // Day 2: band (no kg known) 12 reps
  jest.setSystemTime(Date.now() + 86400e3);
  await go('/'); await flushAll(10);
  await startTemplate('Upper A');
  const bandBtns = screen.getAllByLabelText(/^Guma: /).filter(x => x.props.accessibilityHint === `Seria 1 — ${chin}`);
  await tap(bandBtns[0]);
  const a = store.getState().active!; const ce = a.exercises.find(e => e.exerciseId === ex('Chin Up').id)!;
  expect(ce.sets[0].bandId).toBeTruthy();
  await type(repsOf(chin, 1), '12'); await tick(chin, 1);
  global.__alerts.length = 0;
  await finishConfirmed(); await flushAll(500);
  const al = global.__alerts.find(x => /rekord/i.test(x.title));
  // A set with a band of unknown assistance is not comparable to unassisted reps (same reasoning as the reps PR fix D3)
  expect(al?.msg ?? '').not.toMatch(new RegExp(chin));
});

test('A1b same root cause at store level: progress record e1RM comes from the band set', async () => {
  const { fresh, addWorkout } = require('./helpers');
  await fresh();
  const band = store.getState().bands[0]; expect(band.nominalKg).toBe('');
  const d = new Date(2026, 8, 1).getTime();
  addWorkout(d, [['Chin Up', [{ addKg: 0, reps: 6 }]]]);
  const w = addWorkout(d + 2 * 86400e3, [['Chin Up', [{ addKg: 0, bandId: band.id, reps: 12 }]]]);
  expect(stats.prMap(w).get(w.exercises[0].sets[0].id) ?? []).toEqual([]); // FAILS: ['e1RM', 'objętość serii']
  expect(stats.recordsFor(ex('Chin Up')).bestE1rm).toBe(0); /* runda 75 (Q-001): bez dociążenia nie ma e1RM — masa ciała poza obliczeniami */
});

test('A2 (Q-001, runda 75): identical pull-ups after +1 kg morning weigh-in — no PR (body weight not counted)', async () => {
  const { fresh, addWorkout } = require('./helpers');
  await fresh(); const st = store.getState();
  const d = new Date(2026, 8, 1).getTime();
  st.mornings.push({ id: 'm1', ownerId: 'local', createdAt: d, updatedAt: d, date: '2026-09-01', bb: '', sleepScore: '', sleepH: '', weight: 80 });
  st.mornings.push({ id: 'm2', ownerId: 'local', createdAt: d, updatedAt: d, date: '2026-09-03', bb: '', sleepScore: '', sleepH: '', weight: 81 });
  addWorkout(d + 8 * 3600e3, [['Chin Up', [{ addKg: 0, reps: 8 }]]]);
  const w = addWorkout(d + 2 * 86400e3 + 8 * 3600e3, [['Chin Up', [{ addKg: 0, reps: 8 }]]]);
  expect(stats.prMap(w).get(w.exercises[0].sets[0].id) ?? []).toEqual([]);
});
