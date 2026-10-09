/* Audyt przed pierwszym testem na telefonie (02.10.2026, runda 77): klawiatura po ✓, zamknięcie wyboru ćwiczenia,
 * przenoszenie zmienionej wartości wstępnej na dalsze serie (decyzja 02.10), import kopii z wersji web 0.3 (T-004). */
import { Keyboard } from 'react-native';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { parseBackup } from '@/lib/backup';
import { fresh, ex, addWorkout, set } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, startEdit } from './app';

jest.setTimeout(30000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const at = (d: number, h = 18) => new Date(2026, 8, d, h).getTime();

describe('klawiatura i nawigacja', () => {
  test('✓ i start serii czasowej chowają klawiaturę (numeryczna nie ma „Gotowe”, zasłaniała pasek przerwy)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Plank')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    const spy = jest.spyOn(Keyboard, 'dismiss');
    await tap(screen.getAllByRole('checkbox')[0]); expect(spy).toHaveBeenCalledTimes(1);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); expect(spy).toHaveBeenCalledTimes(2);
    spy.mockRestore();
  });
  test('wybór ćwiczenia: „Anuluj” w nagłówku zamyka okno bez dodawania', async () => {
    await fresh(); store.startEmpty(); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/picker?target=active'); await flushAll(20);
    await tap(screen.getByText('Anuluj')); await flushAll(20);
    expect(store.getState().active!.exercises).toHaveLength(0); expect(screen.queryByPlaceholderText('Szukaj ćwiczenia…')).toBeNull();
  });
});

describe('zmieniona wartość wstępna przechodzi na nieruszone serie (decyzja 02.10)', () => {
  const tplWith = (sets: number) => { const tpl = store.newTemplate(); tpl.items.push({ id: 'b', exerciseId: ex('Bench Press (sztanga)').id, sets, repMin: 6, repMax: 8, restSec: null, startWeight: 60, targetSec: '', groupId: null }); store.save(tpl); return tpl; };
  test('24 → 25 kg na serii 1: serie 2–4 dostają 25; piramida, seria ruszona ręcznie i rozgrzewka zostają', async () => {
    await fresh(); const tpl = tplWith(5); const b = ex('Bench Press (sztanga)');
    addWorkout(at(1), [['Bench Press (sztanga)', [{ weight: 24, reps: 8 }, { weight: 24, reps: 8 }, { weight: 24, reps: 8 }, { weight: 22, reps: 8 }, { weight: 24, reps: 8 }]]]);
    store.getState().workouts[0].templateId = tpl.id; store.getState().workouts[0].exercises[0].tplItemId = 'b'; store.save();
    store.startFromTemplate(tpl); const e = store.getState().active!.exercises[0]; expect(e.exerciseId).toBe(b.id);
    expect(e.sets.map(s => s.weight)).toEqual([24, 24, 24, 22, 24]);
    e.sets[4].reps = 6; e.sets[4].edited = true; // ruszona ręcznie (inne pole) — nie zmieniamy jej za plecami
    e.sets[0].weight = 25; e.sets[0].edited = true; store.toggleDone(0, 0);
    expect(e.sets.map(s => s.weight)).toEqual([25, 25, 25, 22, 24]); expect(e.sets.map(s => s.reps)).toEqual([8, 8, 8, 8, 6]);
    e.sets[1].reps = 10; e.sets[1].edited = true; store.toggleDone(0, 1); expect(e.sets[2].reps).toBe(10); expect(e.sets[3].reps).toBe(10);
  });
  test('pierwszy trening: ciężar startowy z szablonu też jest wartością wstępną; bez zmiany nic się nie dzieje', async () => {
    await fresh(); const tpl = tplWith(3); store.startFromTemplate(tpl); const e = store.getState().active!.exercises[0];
    expect(e.sets.map(s => s.weight)).toEqual([60, 60, 60]);
    store.toggleDone(0, 0); expect(e.sets.map(s => s.weight)).toEqual([60, 60, 60]); store.toggleDone(0, 0);
    e.sets[0].weight = 62.5; store.toggleDone(0, 0); expect(e.sets.map(s => s.weight)).toEqual([62.5, 62.5, 62.5]);
  });
  test('rozgrzewka nie przenosi na robocze; wartość wstępna przeżywa restart, śmieci z importu znikają, historia jej nie trzyma', async () => {
    await fresh(); const tpl = tplWith(3); store.startFromTemplate(tpl); const a = store.getState().active!; const e = a.exercises[0];
    e.sets[0].kind = 'warmup'; e.sets[0].warmup = true; e.sets[0].weight = 40; store.toggleDone(0, 0); expect(e.sets.map(s => s.weight)).toEqual([40, 60, 60]);
    (e.sets[2] as any).pre = 'xx'; store.save(a); await store.flush(); store.__resetForTests(); await store.init();
    const e2 = store.getState().active!.exercises[0]; expect(e2.sets[1].pre).toEqual({ weight: 60 }); expect(e2.sets[2].pre).toBeUndefined();
    e2.sets[1].weight = 65; store.toggleDone(0, 1); expect(e2.sets[2].weight).toBe(60); // bez wartości wstępnej (śmieci) — nie ruszamy
    const w = store.finishWorkout()!; expect(w.exercises[0].sets.every(s => s.pre === undefined)).toBe(true);
  });
  test('na ekranie: wpisanie 25 i ✓ zmienia dalsze serie', async () => {
    await fresh(); const tpl = tplWith(3); store.startFromTemplate(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(20);
    const kg = screen.getAllByDisplayValue('60')[0]; await type(kg, '65'); await flushAll(400);
    await tap(screen.getAllByRole('checkbox')[0]); await flushAll(20);
    expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([65, 65, 65]);
  });
  test('weryfikacja M1: literówka (625) poprawiona po odhaczeniu i ponownym ✓ przechodzi dalej; M2: seria dodana „+ seria” idzie za zmianą', async () => {
    await fresh(); const tpl = tplWith(3); store.startFromTemplate(tpl); const e = store.getState().active!.exercises[0];
    store.addSet(0); expect(e.sets.map(s => s.weight)).toEqual([60, 60, 60, 60]);
    e.sets[0].weight = 625; store.toggleDone(0, 0); expect(e.sets.map(s => s.weight)).toEqual([625, 625, 625, 625]);
    store.toggleDone(0, 0); e.sets[0].weight = 62.5; store.toggleDone(0, 0); expect(e.sets.map(s => s.weight)).toEqual([62.5, 62.5, 62.5, 62.5]);
    store.toggleDone(0, 0); e.sets[0].weight = 60; store.toggleDone(0, 0); expect(e.sets.map(s => s.weight)).toEqual([60, 60, 60, 60]); // cofnięcie zmiany też
  });
  test('weryfikacja M3: podwójne „Anuluj” w wyborze ćwiczenia nie zamyka edytora szablonu', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.name = 'X'; store.save(tpl); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/template/${tpl.id}`); await flushAll(20); await startEdit();
    await go(`/picker?target=template:${tpl.id}`); await flushAll(20);
    const b = screen.getByText('Anuluj'); await tap(b); await tap(b); await flushAll(50);
    expect(screen.getByText('+ Dodaj ćwiczenie')).toBeTruthy(); expect(store.getState().templates.some(x => x.id === tpl.id)).toBe(true);
  });
  void set;
});

describe('import kopii z wersji web 0.3 (T-004)', () => {
  const RAW = require('fs').readFileSync(require('path').join(__dirname, 'fixtures/web03-backup.json'), 'utf8');
  test('wszystkie treningi i serie przechodzą; plank i marsz z kg × powt. zostają widoczne (nie przechodzą na czas/dystans)', async () => {
    await fresh(); const src = JSON.parse(RAW); store.replaceState(parseBackup(RAW)); await store.flush(); const st = store.getState();
    const n = (ws: any[]) => ws.reduce((a, w) => a + (w.exercises ?? w.items ?? []).reduce((b: number, x: any) => b + (x.sets ?? []).filter((s: any) => s.done !== false).length, 0), 0);
    expect(st.workouts).toHaveLength(src.workouts.length); expect(n(st.workouts)).toBe(n(src.workouts));
    const plank = st.exercises.find(e => e.name === 'Plank')!; const walk = st.exercises.find(e => /Incline Walk/.test(e.name))!;
    expect(plank.metric).toBe('reps'); expect(walk.metric).toBe('weight_reps');
    expect(store.previousFor(plank.id)?.sets.map(s => s.reps)).toEqual([60]);
    const lib = st.exercises.find(e => e.name === 'Leg Press')!; expect(lib.metric).toBe('weight_reps');
    const migrated = JSON.parse(JSON.stringify(st)); expect(store.migrate(JSON.parse(JSON.stringify(migrated)))).toEqual(store.migrate(migrated)); // idempotentne
  });
  test('weryfikacja: stare dane — liczą się tylko odhaczone serie historii; dociążenie ±kg to też ciężar; „pre” znika z historii', async () => {
    await fresh(); const raw = JSON.parse(RAW); const plank = raw.exercises.find((e: any) => e.name === 'Plank'); const dead = raw.exercises.find((e: any) => e.name === 'Dead Bug') ?? { id: 'db1', name: 'Dead Bug', equipment: 'masa ciała', group: 'brzuch' };
    if (!raw.exercises.includes(dead)) raw.exercises.push(dead);
    for (const w of raw.workouts) for (const x of (w.exercises ?? [])) if (x.exerciseId === plank.id) x.sets.forEach((s: any) => { s.done = false; });
    raw.workouts[0].exercises.push({ id: 'xx', exerciseId: dead.id, sets: [{ id: 'q', weight: '', reps: '', addKg: 5, done: true, pre: { weight: 1 } }] });
    store.replaceState(parseBackup(JSON.stringify(raw))); const st = store.getState();
    expect(st.exercises.find(e => e.name === 'Plank')!.metric).toBe('time'); expect(st.exercises.find(e => e.name === 'Dead Bug')!.metric).toBe('weight_reps');
    expect(st.workouts.every(w => w.exercises.every(x => x.sets.every(s => s.pre === undefined)))).toBe(true);
  });
  test('świeża instalacja: plank bez historii dalej z czasem (zabezpieczenie dotyczy tylko starych danych z wpisami)', async () => {
    const st = await fresh(); expect(st.exercises.find(e => e.name === 'Plank')!.metric).toBe('time');
    const raw = JSON.parse(RAW); raw.workouts = []; raw.active = null; store.replaceState(parseBackup(JSON.stringify(raw)));
    expect(store.getState().exercises.find(e => e.name === 'Plank')!.metric).toBe('time');
  });
});
