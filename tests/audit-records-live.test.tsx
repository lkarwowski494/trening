/* Runda 73 — testy z audytu T13 (nowa definicja rekordu: suma na treningu + e1RM). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as timer from '@/lib/timer';
import { ex, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, act, tap, go } from './app';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const day = 86400e3;
const badges = () => screen.UNSAFE_root.findAll((n: any) => n.type === 'Text' && n.props.children === 'PR').length;

async function setup(locale: 'pl' | 'en') {
  await renderApp({ locale });
  addWorkout(Date.now() - 2 * day, [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
  await act(async () => {
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Leg Press')); store.addExerciseToActive(ex('Back Squat'));
    const a = store.getState().active!;
    a.exercises[0].sets = [mk(100, 5), mk(100, 5)]; a.exercises[1].sets = [mk(100, 10)]; a.exercises[2].sets = [mk(100, 5)]; store.save(a);
  });
  await flushAll(10);
}
const mk = (w: number, r: number) => ({ id: Math.random().toString(36).slice(2), weight: w, reps: r, durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind: 'normal', warmup: false, note: '', done: false, completedAt: null, actualRest: null } as any);
const tick = async (ei: number, si: number) => { await act(async () => { store.toggleDone(ei, si); }); await flushAll(1500); };

test('LIVE-1 blocks + untick/retick: one badge, same set in history and summary', async () => {
  await setup('pl');
  await tick(0, 0); await tick(0, 1); await tick(1, 0); await tick(2, 0);
  const a = store.getState().active!;
  expect(badges()).toBe(1); expect(stats.prMap(a).get(a.exercises[2].sets[0].id)).toEqual(['objętość treningu']);
  await tick(0, 0); expect(badges()).toBe(0);
  await tick(0, 0); expect(badges()).toBe(1);
  const live = [...stats.prMap(a).entries()];
  // eslint-disable-next-line no-console
  log('live', JSON.stringify(live), a.exercises.map(e => e.sets.map(s => s.id)));
  await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(600);
  const w = store.getState().workouts[store.getState().workouts.length - 1];
  expect([...stats.prMap(w).entries()]).toEqual(live);
  const al = (global.__alerts as any[]).filter(x => /rekord/.test(x.title));
  // eslint-disable-next-line no-console
  log('alert', JSON.stringify(al.map(x => [x.title, x.msg])));
  expect(al.length).toBe(1); expect(al[0].msg).toMatch(/Back Squat: objętość treningu: 1500 kg/);
  const hist = screen.UNSAFE_root.findAll((n: any) => n.type === 'Text').map((n: any) => [].concat(n.props.children).filter((x: any) => typeof x === 'string').join('')).filter((x: string) => /^PR/.test(x));
  // eslint-disable-next-line no-console
  log('history', JSON.stringify(hist));
  expect(hist).toEqual(['PR: objętość treningu']);
});

test('LIVE-2 EN summary with e1RM and total', async () => {
  await setup('en');
  await act(async () => { const a = store.getState().active!; a.exercises[2].sets[0].weight = 110; store.save(a); });
  await tick(0, 0); await tick(0, 1); await tick(1, 0); await tick(2, 0);
  await tap(screen.getAllByText('Finish')[0]); pressAlert('Finish workout?', 'Finish'); await flushAll(600);
  const al = (global.__alerts as any[]).filter(x => /record/i.test(x.title));
  // eslint-disable-next-line no-console
  log('alert EN', JSON.stringify(al.map(x => [x.title, x.msg])));
  expect(al[0].msg).toMatch(/session volume: 1550 kg/); expect(al[0].msg).toMatch(/e1RM 128\.33 kg \(set 110×5\)/);
  void go;
});
