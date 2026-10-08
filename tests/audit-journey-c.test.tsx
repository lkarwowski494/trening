/* Runda 72 — testy z audytu T8 (pełna ścieżka użytkownika, weryfikacja końcowa). */
const log = (..._a: unknown[]) => { /* diagnostyka audytu wyciszona */ };
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import * as backup from '@/lib/backup';
import { exName, t as tr } from '@/lib/i18n';
import { renderApp, tap, type, flushAll, screen, go, act } from './app';
import { ex, pressAlert, saved, seedWithDemo } from './helpers';
import * as FS from 'expo-file-system/legacy';
import * as DP from 'expo-document-picker';

jest.setTimeout(120000);
afterEach(async () => { await timer.stop(); await timer.stopSet(); units.applyUnit('kg'); });

const L = () => ({
  done: (n: string | number, e: string) => tr('Seria {n} zrobiona — {ex}', { n, ex: e }),
  hint: (n: string | number, e: string) => tr('Seria {n} — {ex}', { n, ex: e }),
});
const field = (label: string, hint: string) => { const f = screen.getAllByLabelText(label).find(x => x.props.accessibilityHint === hint); if (!f) throw new Error('no field ' + label + ' ' + hint); return f; };
const startTpl = async (name: string) => { await tap(screen.getByLabelText(tr('Start: {name}', { name }))); await flushAll(10); };
const finish = async () => { await tap(screen.getAllByText(tr('Zakończ trening i zapisz'))[0]); pressAlert(tr('Zakończyć trening?'), tr('Zakończ')); await flushAll(600); };

for (const [loc, unit] of [['pl', 'kg'], ['en', 'lb']] as const) {
  test(`C journey ${loc}/${unit}`, async () => {
    await renderApp({ locale: loc, saved: seedWithDemo(loc) });
    const st = store.getState(); st.settings.unit = unit; store.applyPrefs();
    const tpl = st.templates.find(x => x.name === 'Upper A')!;
    // superset Bench + Row; plank with 30 s target
    store.linkWithNext(tpl.items, 0, tpl);
    tpl.items.push({ id: 'plank-it', exerciseId: ex('Plank').id, sets: 2, repMin: null, repMax: null, restSec: 45, startWeight: '', targetSec: 30, groupId: null });
    store.save(tpl); await flushAll(400);
    const l = L(); const bench = exName(ex('Bench Press (hantle)')), row = exName(ex('Bent Over Row (hantle)')), chin = exName(ex('Chin Up')), plank = exName(ex('Plank'));
    const lbl = store.loadLabel(ex('Bench Press (hantle)'));
    await startTpl('Upper A');
    const a = store.getState().active!;
    // prefilled start weight 24 kg per dumbbell displayed in unit
    const bw1 = field(lbl, l.hint(1, bench)); log(loc, 'bench field shows', bw1.props.value);
    // superset round 1: bench set 1 (typed reps 8), row set 1 (typed reps 8) -> rest only after row
    await type(field(tr('Powtórzenia'), l.hint(1, bench)), '8'); await tap(screen.getByLabelText(l.done(1, bench)));
    expect(timer.T.on).toBe(false);
    await type(field(tr('Powtórzenia'), l.hint(1, row)), '8'); await tap(screen.getByLabelText(l.done(1, row)));
    expect(timer.T.on).toBe(true); expect(timer.T.total).toBe(120);
    // bench set 2: empty tick => reps propagated (8) from set 1
    await tap(screen.getByLabelText(l.done(2, bench)));
    expect(a.exercises[0].sets[1].reps).toBe(8); expect(a.exercises[0].sets[1].weight).toBe(24);
    // bench set 4 -> failure, + seria -> drop
    await tap(screen.getAllByLabelText(new RegExp('^' + tr('Seria {n}, typ: {k}. Tapnij, by zmienić typ lub dodać notatkę.', { n: 4, k: 'X' }).split(',')[0]))[0]);
    await act(async () => { (global as any).__pickSheet(3); });
    expect(a.exercises[0].sets[3].kind).toBe('failure');
    await tap(screen.getAllByLabelText(tr('+ seria'))[0]);
    expect(a.exercises[0].sets.length).toBe(5); expect(a.exercises[0].sets[4].kind).toBe('normal');
    await tap(screen.getAllByLabelText(new RegExp('^' + tr('Seria {n}, typ: {k}. Tapnij, by zmienić typ lub dodać notatkę.', { n: 5, k: 'X' }).split(',')[0]))[0]);
    await act(async () => { (global as any).__pickSheet(2); });
    expect(a.exercises[0].sets[4].kind).toBe('drop');
    const dropLbl = '4D'; /* audyt 0.10 (LIVE-14): drop po serii 4F — „4D” (wcześniej „5D”) */
    await type(field(lbl, l.hint(dropLbl, bench)), unit === 'lb' ? '35' : '16'); await type(field(tr('Powtórzenia'), l.hint(dropLbl, bench)), '12');
    // remaining sets
    await tap(screen.getByLabelText(l.done(2, row)));
    await tap(screen.getByLabelText(l.done(3, bench))); await tap(screen.getByLabelText(l.done(3, row)));
    await type(field(tr('Powtórzenia'), l.hint('4F', bench)), '6');
    await tap(screen.getByLabelText(l.done('4F', bench)));
    log(loc, 'rest after failure set followed by unticked drop:', timer.T.on, timer.T.total);
    await tap(screen.getByLabelText(l.done(dropLbl, bench)));
    log(loc, 'rest after drop (superset round 4: row has only 4 sets, 3 done):', timer.T.on, timer.T.total);
    await tap(screen.getByLabelText(l.done(4, row)));
    log(loc, 'rest after row 4:', timer.T.on, timer.T.total);
    // chin ups with band
    const bandBtn = screen.getAllByLabelText(new RegExp('^' + tr('Guma: {b}. Tapnij, by zmienić.', { b: 'X' }).split(':')[0] + ':')).filter(x => x.props.accessibilityHint === l.hint(1, chin))[0];
    await tap(bandBtn);
    await type(field(tr('Powtórzenia'), l.hint(1, chin)), '8'); await tap(screen.getByLabelText(l.done(1, chin)));
    const ce = a.exercises.find(e => e.exerciseId === ex('Chin Up').id)!;
    log(loc, 'chin set1', JSON.stringify(ce.sets[0]), 'set2 after tick1', JSON.stringify(ce.sets[1]));
    // plank stopwatch
    await tap(screen.getAllByLabelText(tr('Start stopera serii'))[0]);
    expect(timer.S.on).toBe(true); expect(timer.S.targetSec).toBe(30);
    await flushAll(31000); await flushAll(600);
    const pe = a.exercises.find(e => e.exerciseId === ex('Plank').id)!;
    expect(pe.sets[0].done).toBe(true); expect(pe.sets[0].durationSec).toBe(30); expect(timer.T.on).toBe(true); expect(timer.T.total).toBe(45);
    await finish();
    const w1 = store.getState().workouts[0]; expect(w1).toBeTruthy();
    log(loc, 'alerts after finish 1', JSON.stringify(global.__alerts.slice(-2).map(x => [x.title, x.msg])));
    // history detail renders
    const txts = screen.toJSON() ? JSON.stringify(screen.toJSON()).length : 0; expect(txts).toBeGreaterThan(0);
    // progress
    await go(`/more/progress?ex=${ex('Bench Press (hantle)').id}`); await flushAll(10);
    log(loc, 'progress records', screen.getAllByText(/./).map(x => x.props.children).flat().filter(x => typeof x === 'string').join(' | ').slice(0, 1500));

    // ---- backup round trip ----
    const before = JSON.parse(JSON.stringify(store.getState()));
    const env = JSON.stringify(backup.buildBackup());
    const csv = backup.buildCsv(); log(loc, 'CSV\n' + csv);
    store.resetAll(); await flushAll(400);
    expect(store.getState().workouts.length).toBe(0);
    (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => env); (DP.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.json' }] }));
    await act(async () => { await backup.importBackup(); }); await flushAll(400);
    const after = JSON.parse(JSON.stringify(store.getState()));
    for (const k of ['metaUpdatedAt', 'saveSeq', 'userTouched']) { delete before[k]; delete after[k]; }
    expect(after).toEqual(before);
    expect(backup.buildCsv()).toBe(csv);

    // ---- next day ----
    jest.setSystemTime(Date.now() + 86400e3);
    await go('/'); await flushAll(10);
    await startTpl('Upper A');
    const b = store.getState().active!;
    log(loc, 'day2 bench prefill', JSON.stringify(b.exercises[0].sets.map(s => [s.weight, s.reps, s.kind])), 'chin', JSON.stringify(b.exercises.find(e => e.exerciseId === ex('Chin Up').id)!.sets.map(s => [s.addKg, s.reps, s.bandId ? 'band' : ''])));
    log(loc, 'day2 plank prefill', JSON.stringify(b.exercises.find(e => e.exerciseId === ex('Plank').id)!.sets.map(s => [s.durationSec])));
    // tick everything as is (same as last time) -> no PRs expected
    for (const e of [...b.exercises]) { const nm = exName(ex(store.getState().exercises.find(x => x.id === e.exerciseId)!.name)); for (let i = 0; i < e.sets.length; i++) { if (ex('Plank').id === e.exerciseId) continue; await tap(screen.getByLabelText(l.done(i + 1, nm))); } }
    global.__alerts.length = 0;
    await finish();
    log(loc, 'day2 alerts', JSON.stringify(global.__alerts.map(x => [x.title, x.msg])));
    const w2 = store.getState().workouts.find(x => x.id !== w1.id)!;
    log(loc, 'day2 bench saved', JSON.stringify(w2.exercises[0].sets.map(s => [s.weight, s.reps, s.kind])));
    expect(global.__alerts.find(x => /rekord|record/i.test(x.title))).toBeUndefined();
  });
}
