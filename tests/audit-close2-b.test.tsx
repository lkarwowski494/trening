/* Runda 72 — testy z audytu T12 (runda zamykająca, bez błędów wysokich/średnich). */
/* T12 audit — temporary: EN/lb + PL/kg repeat-last journey */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as units from '@/lib/units';
import * as stats from '@/lib/stats';
import { exName, t as tr } from '@/lib/i18n';
import { renderApp, tap, type, flushAll, screen, go, act } from './app';
import { ex, pressAlert } from './helpers';

jest.setTimeout(120000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); units.applyUnit('kg'); });
const field = (label: string, hint: string) => { const f = screen.getAllByLabelText(label).find(x => x.props.accessibilityHint === hint); if (!f) throw new Error('no field ' + label + ' ' + hint); return f; };
const finish = async () => { await tap(screen.getAllByText(tr('Zakończ trening i zapisz'))[0]); pressAlert(tr('Zakończyć trening?'), tr('Zakończ')); await flushAll(600); };
const kindBtn = (n: string | number, nm: string) => screen.getAllByLabelText(new RegExp('^' + tr('Seria {n}, typ: {k}. Tapnij, by zmienić typ lub dodać notatkę.', { n, k: 'X' }).split(',')[0] + ',')).find(x => x.props.accessibilityHint === tr('Seria {n} — {ex}', { n, ex: nm }))!;

for (const [loc, unit, w1, w2] of [['pl', 'kg', '100', '80'], ['en', 'lb', '225', '185']] as const) {
  test(`R ${loc}/${unit}: empty workout with failure + drop + plank, finish, repeat last, tick as-is → no PR, same numbers`, async () => {
    await renderApp({ locale: loc });
    const st = store.getState(); st.settings.unit = unit; store.applyPrefs(); store.save(); await flushAll(400);
    const benchEx = ex('Bench Press (sztanga)'); const bench = exName(benchEx); const lbl = store.loadLabel(benchEx);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(benchEx); store.addExerciseToActive(ex('Plank')); });
    await flushAll(50);
    const h = (n: string | number) => tr('Seria {n} — {ex}', { n, ex: bench });
    await type(field(lbl, h(1)), w1); await type(field(tr('Powtórzenia'), h(1)), '5');
    await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: 1, ex: bench })));
    expect(timer.T.on).toBe(true);
    await tap(screen.getAllByLabelText(tr('+ seria'))[0]); await tap(screen.getAllByLabelText(tr('+ seria'))[0]);
    await tap(kindBtn(2, bench)); await act(async () => { (global as any).__pickSheet(3); }); // failure
    await tap(kindBtn('2F', bench)); // still opens
    await act(async () => { (global as any).__sheets.pop(); });
    await tap(kindBtn(3, bench)); await act(async () => { (global as any).__pickSheet(2); }); // drop
    await type(field(tr('Powtórzenia'), h('2F')), '4');
    await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: '2F', ex: bench })));
    expect(timer.T.on).toBe(false); // next is drop → no rest
    await type(field(lbl, h('3D')), w2); await type(field(tr('Powtórzenia'), h('3D')), '8');
    await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: '3D', ex: bench })));
    expect(timer.T.on).toBe(true);
    const a = store.getState().active!;
    expect(a.exercises[0].sets.map(s => [units.wField(s.weight), s.reps, s.kind])).toEqual([[Number(w1), 5, 'normal'], [Number(w1), 4, 'failure'], [Number(w2), 8, 'drop']]);
    // plank, count-up (no target), 40 s
    const plank = exName(ex('Plank'));
    await tap(screen.getByLabelText(tr('Start stopera serii'))); await flushAll(40e3);
    await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: 1, ex: plank })));
    expect(a.exercises[1].sets[0].durationSec).toBe(40);
    await finish();
    const day1 = store.getState().workouts[store.getState().workouts.length - 1];
    expect(day1.exercises[0].sets.length).toBe(3);

    jest.setSystemTime(Date.now() + 86400e3); await go('/'); await flushAll(10);
    await tap(screen.getByText(tr('Powtórz ostatni ({name})', { name: tr('bez szablonu') }))); await flushAll(10);
    const b = store.getState().active!;
    expect(b.exercises[0].sets.map(s => [units.wField(s.weight), s.reps, s.kind])).toEqual([[Number(w1), 5, 'normal'], [Number(w1), 4, 'normal'], [Number(w2), 8, 'drop']]);
    expect(b.exercises[1].sets[0].durationSec).toBe('');
    // displayed field values equal what was typed
    expect(String(field(lbl, h(1)).props.value)).toBe(w1);
    for (let i = 0; i < 3; i++) await tap(screen.getByLabelText(tr('Seria {n} zrobiona — {ex}', { n: ['1', '2', '3D'][i], ex: bench })));
    expect(stats.workoutPRs(b).length).toBe(0);
    global.__alerts.length = 0; await finish();
    expect(global.__alerts.find(x => /rekord|record/i.test(x.title))).toBeUndefined();
    const day2 = store.getState().workouts[store.getState().workouts.length - 1];
    expect(day2.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual(day1.exercises[0].sets.map(s => [s.weight, s.reps]));
  });
}
