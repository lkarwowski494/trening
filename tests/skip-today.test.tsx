/*
 * „Pomiń ćwiczenie dziś” (docs/21 pkt 4a; kolejność zatwierdzona przez właściciela 07.10.2026 wieczór): blok zwija się do linii
 * „pominięte dziś · Przywróć”; szablon bez zmian; karta „teraz”, pasek postępu i ostrzeżenia przy „Zakończ” pomijają resztę bloku;
 * odhaczone wcześniej serie zapisują się jak zawsze. Rodzaje (docs/20): logika (store), dane (pole tylko w treningu w toku — sanityzacja,
 * zapis, import; historia bez pola), ekran, dostępność, języki (en), niezmienniki (szablon nietknięty).
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex, saved, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
beforeEach(async () => { await fresh(); });
afterEach(async () => { await timer.stop(); await timer.stopSet(); });
const tpl2 = () => { const t = store.newTemplate(); t.name = 'T'; t.items.push({ id: 'a', exerciseId: ex('Back Squat').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }, { id: 'b', exerciseId: ex('Plank').id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };

describe('logika i dane', () => {
  test('skipExercise / unskipExercise: pole tylko na bloku; szablon nietknięty; focusSet omija pominięty blok', () => {
    const t = tpl2(); const tplBefore = JSON.stringify(t); store.startFromTemplate(t); const w = S().active!; const [a, b] = w.exercises;
    expect(store.focusSet(w)).toEqual({ ei: 0, si: 0 });
    store.skipExercise(a.id); expect(a.skipped).toBe(true); expect(store.focusSet(w)).toEqual({ ei: 1, si: 0 }); expect(JSON.stringify(S().templates[0])).toBe(tplBefore);
    store.skipExercise(b.id); expect(store.focusSet(w)).toBeNull();
    store.unskipExercise(a.id); expect(a.skipped).toBeUndefined(); expect(store.focusSet(w)).toEqual({ ei: 0, si: 0 });
    store.skipExercise('nie-ma'); store.unskipExercise('nie-ma'); expect(w.exercises.map(e => e.skipped)).toEqual([undefined, true]);
  });
  test('zakończenie: odhaczone serie pominiętego bloku zostają, reszta odpada; w historii bez pola skipped', () => {
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addExerciseToActive(ex('Plank'));
    const w = S().active!; Object.assign(w.exercises[0].sets[0], { weight: 100, reps: 5, done: true }); store.skipExercise(w.exercises[0].id); store.skipExercise(w.exercises[1].id);
    const f = store.finishWorkout()!; expect(f.exercises).toHaveLength(1); expect(f.exercises[0].sets).toHaveLength(1); expect('skipped' in f.exercises[0]).toBe(false);
  });
  test('sanityzacja: skipped tylko true i tylko w treningu w toku (zapis, import kopii z polem w historii)', async () => {
    const st: any = JSON.parse(JSON.stringify(saved()));
    st.active = { id: 'w', startedAt: Date.now(), finishedAt: null, templateId: null, templateName: '', exercises: [{ id: 'e1', exerciseId: ex('Back Squat').id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [store.emptySet()], skipped: true }, { id: 'e2', exerciseId: ex('Plank').id, restSec: 60, repMin: null, repMax: null, groupId: null, sets: [store.emptySet()], skipped: 'tak' }] };
    st.workouts = [{ id: 'h', startedAt: Date.now() - 86400e3, finishedAt: Date.now() - 86000e3, templateId: null, templateName: '', exercises: [{ id: 'e3', exerciseId: ex('Back Squat').id, restSec: 90, repMin: null, repMax: null, groupId: null, sets: [{ ...store.emptySet(), weight: 100, reps: 5, done: true }], skipped: true }] }];
    await renderApp({ saved: st }); await flushAll(10);
    expect(S().active!.exercises.map(e => e.skipped)).toEqual([true, undefined]); expect('skipped' in S().workouts[0].exercises[0]).toBe(false);
  });
});

describe('ekran', () => {
  const boot = async () => { tpl2(); store.startFromTemplate(S().templates[0]); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); };
  test('„Pomiń dziś” zwija blok do „pominięte dziś · Przywróć”; karta „teraz” przechodzi do następnego ćwiczenia; pasek postępu liczy bez pominiętych', async () => {
    await boot(); expect(screen.getByLabelText('Postęp treningu: 0 z 3 serii')).toBeTruthy();
    await tap(screen.getByLabelText('Pomiń dziś: Back Squat')); await flushAll(5);
    expect(screen.getByText('pominięte dziś')).toBeTruthy(); expect(screen.getByLabelText('Przywróć ćwiczenie: Back Squat')).toBeTruthy();
    expect(screen.queryByLabelText('Seria 1 zrobiona — Back Squat')).toBeNull(); expect(screen.getByLabelText('Postęp treningu: 0 z 1 serii')).toBeTruthy();
    expect(screen.getAllByText('Plank').length).toBeGreaterThan(1); expect(screen.getByText('seria 1 z 1')).toBeTruthy(); /* karta „teraz” na Planku */
    await tap(screen.getByLabelText('Przywróć ćwiczenie: Back Squat')); await flushAll(5);
    expect(screen.getByLabelText('Seria 1 zrobiona — Back Squat')).toBeTruthy(); expect(screen.queryByText('pominięte dziś')).toBeNull();
  });
  test('wszystkie serie odhaczone albo pominięte → „Wszystkie serie odhaczone”; „Pomiń dziś” znika, gdy blok skończony', async () => {
    await boot(); const w = S().active!; await act(async () => { w.exercises[0].sets.forEach(s => Object.assign(s, { weight: 100, reps: 5, done: true })); store.save(w); }); await flushAll(5);
    expect(screen.queryByLabelText('Pomiń dziś: Back Squat')).toBeNull();
    await tap(screen.getByLabelText('Pomiń dziś: Plank')); await flushAll(5); expect(screen.getByText('Wszystkie serie odhaczone')).toBeTruthy();
  });
  test('„Zakończ”: wpisane, nieodhaczone serie pominiętego bloku nie straszą ostrzeżeniem', async () => {
    await boot(); const w = S().active!; await act(async () => { Object.assign(w.exercises[1].sets[0], { durationSec: 60, done: true }); Object.assign(w.exercises[0].sets[0], { weight: 100, reps: 5 }); w.exercises[0].sets[0].edited = true; store.save(w); }); await flushAll(5);
    await tap(screen.getByLabelText('Pomiń dziś: Back Squat')); await flushAll(5);
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]); const a = global.__alerts.at(-1)!; expect(a.title).toBe('Zakończyć trening?'); expect(a.msg).not.toMatch(/Nieodhaczone/);
    await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
    expect(S().workouts.at(-1)!.exercises.map(e => store.exById(e.exerciseId)!.name)).toEqual(['Plank']); expect(JSON.stringify(S().templates[0].items.map(i => i.exerciseId))).toBe(JSON.stringify([ex('Back Squat').id, ex('Plank').id]));
  });
  test('„Pomiń dziś” zatrzymuje stoper serii tego bloku (jak usunięcie ćwiczenia)', async () => {
    store.startEmpty(); store.addExerciseToActive(ex('Plank')); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10);
    await tap(screen.getByLabelText('Start stopera serii')); expect(timer.S.on).toBe(true);
    await tap(screen.getByLabelText('Pomiń dziś: Plank')); await flushAll(5); expect(timer.S.on).toBe(false);
  });
  test('English', async () => {
    await fresh(undefined, 'en'); tpl2(); store.startFromTemplate(S().templates[0]); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale: 'en' }); await flushAll(10);
    await tap(screen.getByLabelText('Skip today: Back Squat')); await flushAll(5);
    expect(screen.getByText('skipped today')).toBeTruthy(); expect(screen.getByLabelText('Restore exercise: Back Squat')).toBeTruthy();
  });
});
