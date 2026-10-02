/* Runda 73 — testy z audytu T13 (nowa definicja rekordu: suma na treningu + e1RM). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { ex } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';
import { addWorkout } from './helpers';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const texts = () => screen.UNSAFE_root.findAll((n: any) => n.type === 'Text').map((n: any) => { const c = n.props.children; return Array.isArray(c) ? c.filter((x: any) => typeof x === 'string' || typeof x === 'number').join('') : (typeof c === 'string' || typeof c === 'number' ? String(c) : ''); }).filter(Boolean);
const PL = /[ąćęłńśźżĄĆĘŁŃŚŹŻ]|\bpow\.|\bseria\b|objęto|łączny|suma |Najlep|Najwię|Najdłu|dociąż|rekord|REKORDY|Sesje|najlepsza/;

const day = 86400e3;
const data: [string, any[], any[]][] = [
  ['Back Squat', [{ weight: 100, reps: 5 }], [{ weight: 100, reps: 5 }, { weight: 105, reps: 5 }]],
  ['Bench Press (hantle)', [{ weight: 30, reps: 8 }], [{ weight: 32, reps: 8 }, { weight: 32, reps: 8 }]],
  ['Pull Up', [{ reps: 5 }], [{ reps: 6 }, { reps: 5 }]],
  ['Plank', [{ durationSec: 60 }], [{ durationSec: 50 }, { durationSec: 50 }]],
  ["Farmer's Walk", [{ weight: 30, durationSec: 40 }], [{ weight: 32, durationSec: 30 }, { weight: 32, durationSec: 30 }]],
  ['Bieg', [{ distanceM: 3000, durationSec: 900 }], [{ distanceM: 2000, durationSec: 600 }, { distanceM: 2000, durationSec: 600 }]],
  ['Burpees', [{ reps: 10 }], [{ reps: 8 }, { reps: 8 }]],
];

describe.each(['pl', 'en'] as const)('t13 progress %s', (locale) => {
  test.each(data.map(d => d[0]))('progress screen %s', async (name) => {
    await renderApp({ locale });
    const d = data.find(x => x[0] === name)!;
    addWorkout(Date.now() - 3 * day, [[name, d[1]]]); addWorkout(Date.now() - day, [[name, d[2]]]);
    await go('/more/progress?ex=' + ex(name).id); await flushAll(20);
    const tx = texts();
    // eslint-disable-next-line no-console
    log(locale, name, JSON.stringify(tx));
    if (locale === 'en') expect(tx.filter((x: any) => PL.test(x))).toEqual([]);
  });
});

test('t13 history EN PR labels + PL', async () => {
  for (const locale of ['pl', 'en'] as const) {
    await renderApp({ locale });
    for (const d of data) addWorkout(Date.now() - 3 * day, [[d[0], d[1]]]);
    const w = addWorkout(Date.now() - day, data.map(d => [d[0], d[2]] as [string, any[]]));
    await go('/history/' + w.id); await flushAll(20);
    const tx = texts().filter((x: any) => /PR/.test(x));
    // eslint-disable-next-line no-console
    log(locale, 'history PR', JSON.stringify(tx));
    if (locale === 'en') expect(tx.filter((x: any) => PL.test(x))).toEqual([]);
  }
});

test('t13 chart default for assisted-only pull ups (no bodyweight)', async () => {
  await renderApp(); const b = store.getState().bands[0];
  addWorkout(Date.now() - 3 * day, [['Pull Up', [{ reps: 8, bandId: b.id }, { reps: 7, bandId: b.id }]]]);
  addWorkout(Date.now() - day, [['Pull Up', [{ reps: 9, bandId: b.id }]]]);
  await go('/more/progress?ex=' + ex('Pull Up').id); await flushAll(20);
  const tx = texts();
  // eslint-disable-next-line no-console
  log('assisted', JSON.stringify(tx));
  expect(screen.queryAllByLabelText(/^Wykres, 2 sesje/).length).toBeGreaterThan(0);
  void act;
});
