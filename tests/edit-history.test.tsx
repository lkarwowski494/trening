/* Docs/12 (02.10.2026): edycja zakończonych treningów i trening wstecz — szkic, spójność historii (rekordy, „Poprzednio”,
 * statystyki, CSV, kopia), nietknięty trening w toku, jednostka lb, eksport/import i ekrany (PL i EN). */
import * as FileSystem from 'expo-file-system';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import { prMap, recordsFor, sessionsFor, weeklyTotals } from '@/lib/stats';
import { buildBackup, buildCsv, parseBackup } from '@/lib/backup';
import { wIn } from '@/lib/units';
import type { Workout } from '@/lib/seed';
import { fresh, ex, addWorkout, pressAlert, saved } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(30000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/** n dni temu o godzinie h (czas lokalny). */
const day = (n: number, h = 18, m = 0) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h, m).getTime(); };
const BP = 'Bench Press (sztanga)';
const byId = (id: string) => store.getState().workouts.find(w => w.id === id)!;
const sets = (id: string) => byId(id).exercises.map(e => e.sets.map(s => `${s.weight}x${s.reps}`));
const snapshot = () => JSON.parse(JSON.stringify(store.getState()));
const committed = (r: { w: Workout } | { error: string }) => { if ('error' in r) throw new Error(r.error); return r.w; };
const settle = async () => { await act(async () => { await store.flush(); for (let i = 0; i < 20; i++) await Promise.resolve(); }); };
const alertNow = async (title: string, button: string) => { await act(async () => { pressAlert(title, button); }); await flushAll(50); };
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const pushTpl = (name = 'Push') => { const tpl = store.newTemplate(); tpl.name = name;
  tpl.items.push({ id: 'a', exerciseId: ex(BP).id, sets: 3, repMin: 6, repMax: 8, restSec: null, startWeight: 60, targetSec: '', groupId: null },
    { id: 'p', exerciseId: ex('Plank').id, sets: 2, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: 45, groupId: null },
    { id: 's', exerciseId: ex('Back Squat').id, sets: 2, repMin: 5, repMax: 5, restSec: null, startWeight: 100, targetSec: '', groupId: null });
  store.save(tpl); return tpl; };

describe('szkic i zapis (logika)', () => {
  test('zmiana ciężaru: szkic nie rusza historii; po zapisie rekordy (PR) i „Poprzednio” następnego treningu liczą się od nowa', async () => {
    await fresh(); const bp = ex(BP);
    const w1 = addWorkout(day(4), [[BP, [{ weight: 80, reps: 5 }]]]); const w2 = addWorkout(day(2), [[BP, [{ weight: 85, reps: 5 }]]]);
    expect(prMap(byId(w2.id)).get(w2.exercises[0].sets[0].id)).toEqual(expect.arrayContaining(['e1RM', 'objętość treningu']));
    const d = edit.beginEdit(w1.id)!; d.w.exercises[0].sets[0].weight = 90; edit.touchDraft();
    expect(sets(w1.id)).toEqual([['80x5']]); expect(prMap(byId(w2.id)).size).toBe(1); // szkic poza historią
    const saved1 = committed(edit.commitDraft(d.key));
    expect(saved1.id).toBe(w1.id); expect(sets(w1.id)).toEqual([['90x5']]); expect(edit.draftOf(d.key)).toBeUndefined();
    expect(prMap(byId(w2.id)).size).toBe(0); // 85×5 nie jest już rekordem nad 90×5
    expect(recordsFor(bp).maxLoad).toBe(90); expect(store.previousFor(bp.id)!.sets[0].weight).toBe(85);
    const d2 = edit.beginEdit(w2.id)!; d2.w.exercises[0].sets[0].weight = 92.5; committed(edit.commitDraft(d2.key));
    expect(store.previousFor(bp.id)!.sets[0].weight).toBe(92.5); expect(prMap(byId(w2.id)).size).toBe(1);
    const tpl = store.newTemplate(); tpl.items.push({ id: 'b', exerciseId: bp.id, sets: 2, repMin: 5, repMax: 5, restSec: null, startWeight: 50, targetSec: '', groupId: null }); store.save(tpl);
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([92.5, 92.5]); // następny trening startuje z poprawionej wartości
  });

  test('zmiana daty przestawia historię (kolejność, źródło „Poprzednio”, PR) i przesuwa godziny serii; bez zmiany pól znaczniki zostają co do sekundy', async () => {
    await fresh(); const bp = ex(BP);
    const w1 = addWorkout(day(5), [[BP, [{ weight: 80, reps: 5 }]]]); const w2 = addWorkout(day(2, 18, 0) + 37e3, [[BP, [{ weight: 85, reps: 5 }]]]);
    expect(store.finishedWorkouts()[0].id).toBe(w2.id); expect(store.previousFor(bp.id)!.sets[0].weight).toBe(85);
    const d0 = edit.beginEdit(w2.id)!; d0.w.note = 'x'; committed(edit.commitDraft(d0.key)); expect(byId(w2.id).startedAt).toBe(day(2) + 37e3); // sekundy zostają
    const off = byId(w2.id).exercises[0].sets[0].completedAt! - byId(w2.id).startedAt;
    const d = edit.beginEdit(w2.id)!; d.date = edit.shiftDate(d.date, -5); expect(d.date).toBe(edit.dateText(day(7)));
    committed(edit.commitDraft(d.key));
    expect(byId(w2.id).startedAt).toBe(day(7)); expect(byId(w2.id).finishedAt).toBe(day(7) + 3600e3);
    expect(byId(w2.id).exercises[0].sets[0].completedAt! - byId(w2.id).startedAt).toBe(off); // godzina serii jedzie razem ze startem
    expect(store.finishedWorkouts().map(w => w.id)).toEqual([w1.id, w2.id]); expect(store.getState().workouts.map(w => w.id)).toEqual([w2.id, w1.id]);
    expect(store.previousFor(bp.id)!.sets[0].weight).toBe(80); expect(prMap(byId(w1.id)).size).toBe(0); expect(prMap(byId(w2.id)).size).toBe(0);
    const d2 = edit.beginEdit(w2.id)!; Object.assign(d2, { time: '7:05', min: '95' }); committed(edit.commitDraft(d2.key));
    expect(byId(w2.id).startedAt).toBe(day(7, 7, 5)); expect(byId(w2.id).finishedAt).toBe(day(7, 7, 5) + 95 * 60e3);
  });

  test('serie i ćwiczenia: + seria kopiuje ostatnią, usuwanie po id, to samo ćwiczenie dwa razy, usunięte ćwiczenie znika z historii', async () => {
    await fresh(); const bp = ex(BP), sq = ex('Back Squat');
    const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5, kind: 'failure', rpe: 9 }]], ['Back Squat', [{ weight: 100, reps: 5 }]]]);
    const d = edit.beginEdit(w.id)!;
    edit.draftAddSet(d.key, 0); const s = d.w.exercises[0].sets;
    expect(s).toHaveLength(2); expect(s[1]).toMatchObject({ weight: 80, reps: 5, rpe: 9, kind: 'normal', done: true, completedAt: null }); expect(s[1].id).not.toBe(s[0].id);
    edit.draftRemoveSet(d.key, 0, s[0].id); expect(d.w.exercises[0].sets.map(x => x.kind)).toEqual(['normal']);
    edit.draftAddExercise(d.key, bp); expect(d.w.exercises.map(e => e.exerciseId)).toEqual([bp.id, sq.id, bp.id]);
    expect(d.w.exercises[2].sets[0]).toMatchObject({ weight: '', reps: '', done: true }); // ten trening nie jest „wcześniejszy” od siebie
    Object.assign(d.w.exercises[2].sets[0], { weight: 60, reps: 10 });
    edit.draftRemoveExercise(d.key, d.w.exercises[1].id);
    committed(edit.commitDraft(d.key));
    expect(byId(w.id).exercises.map(e => e.exerciseId)).toEqual([bp.id, bp.id]); expect(sets(w.id)).toEqual([['80x5'], ['60x10']]);
    expect(store.workoutsWith(sq.id)).toHaveLength(0); expect(store.volume(byId(w.id))).toBe(1000);
    expect(store.previousBlockFor(bp.id, 1, 2)!.sets.map(x => x.weight)).toEqual([60]); // drugi blok osobno
    const blocks = byId(w.id).exercises[0].sets.concat(byId(w.id).exercises[1].sets); expect(blocks.every(x => x.done && typeof x.completedAt === 'number')).toBe(true);
    expect(blocks[1].completedAt!).toBeGreaterThan(blocks[0].completedAt!); // nowe serie po kolei (kolejność PR)
  });

  test('serie bez wyniku odpadają (z liczbą do ostrzeżenia); trening bez serii nie zapisze się', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]], ['Plank', [{ durationSec: 60 }]], ['Bieg', [{ distanceM: 5000, durationSec: 1500 }]]]);
    const d = edit.beginEdit(w.id)!;
    edit.draftAddSet(d.key, 0); d.w.exercises[0].sets[1].reps = '';             // 80 kg × — : bez wyniku
    edit.draftAddSet(d.key, 1); d.w.exercises[1].sets[1].durationSec = '';      // plank bez czasu
    edit.draftAddSet(d.key, 2); d.w.exercises[2].sets[1].durationSec = '';      // bieg z samym dystansem — zostaje
    expect(edit.checkDraft(d.key)).toMatchObject({ dropped: 2, empty: false });
    committed(edit.commitDraft(d.key)); expect(byId(w.id).exercises.map(e => e.sets.length)).toEqual([1, 1, 2]);
    const d2 = edit.beginEdit(w.id)!; d2.w.exercises.forEach(e => e.sets.forEach(s => { s.reps = ''; s.durationSec = ''; s.distanceM = 0; }));
    expect(edit.checkDraft(d2.key)).toMatchObject({ empty: true }); expect(edit.commitDraft(d2.key)).toEqual({ error: expect.any(String) });
    expect(byId(w.id).exercises.map(e => e.sets.length)).toEqual([1, 1, 2]);
    const d4 = edit.beginEdit(w.id)!; store.deleteWorkout(w.id); expect(edit.commitDraft(d4.key)).toEqual({ error: 'Tej sesji nie ma już w historii.' }); // usunięty w międzyczasie
    expect(store.getState().workouts).toHaveLength(0);
    const d3 = edit.beginPast(null, day(2), day(2) + 3600e3); d3.w.note = 'x'; // pusty trening wstecz
    expect(edit.commitDraft(d3.key)).toEqual({ error: expect.any(String) }); expect(store.getState().workouts).toHaveLength(0);
  });

  test('termin: walidacja daty, godziny, czasu trwania i końca w przyszłości; przesuwanie dnia; domyślnie wczoraj 18:00, 60 min', () => {
    const now = new Date(2026, 9, 2, 12).getTime(); const err = (...a: [string, string, string]) => 'error' in edit.parseWhen(...a, now);
    expect(edit.parseWhen('2026-10-01', '18:00', '60', now)).toEqual({ start: new Date(2026, 9, 1, 18).getTime(), end: new Date(2026, 9, 1, 19).getTime() });
    expect(edit.parseWhen(' 2026-9-30 ', '7.05', '1', now)).toEqual({ start: new Date(2026, 8, 30, 7, 5).getTime(), end: new Date(2026, 8, 30, 7, 6).getTime() });
    for (const a of [['2026-02-30', '18:00', '60'], ['30.09.2026', '18:00', '60'], ['2026-10-01', '24:00', '60'], ['2026-10-01', '18:60', '60'], ['2026-10-01', '18', '60'], ['2026-10-01', '18:00', '0'], ['2026-10-01', '18:00', '1441'], ['2026-10-01', '18:00', '1,5'], ['2026-10-01', '18:00', ''], ['2026-10-02', '11:30', '60']] as [string, string, string][]) expect(err(...a)).toBe(true);
    expect(err('2026-10-02', '11:00', '60')).toBe(false); // koniec = teraz
    expect(edit.shiftDate('2026-03-01', -1)).toBe('2026-02-28'); expect(edit.shiftDate('2026-12-31', 1)).toBe('2027-01-01'); expect(edit.shiftDate('xx', 1)).toBe('xx');
    expect(edit.defaultPastWhen(new Date(2026, 9, 1, 8))).toEqual({ date: '2026-09-30', time: '18:00', min: '60' });
  });

  test('trening wstecz z szablonu: wartości z ostatniej sesji PRZED datą (nie z późniejszej), bez historii — ciężar startowy, cel czasu i dolna granica powtórzeń', async () => {
    await fresh(); const tpl = pushTpl();
    addWorkout(day(10), [[BP, [{ weight: 70, reps: 8 }, { weight: 72.5, reps: 7 }, { weight: 50, reps: 12, kind: 'drop' }]], ['Plank', [{ durationSec: 50 }]]]);
    addWorkout(day(1), [[BP, [{ weight: 90, reps: 5 }]]]);
    const d = edit.beginPast(tpl.id, day(5), day(5) + 3600e3);
    expect(d.w).toMatchObject({ templateId: tpl.id, templateName: 'Push', startedAt: day(5), finishedAt: day(5) + 3600e3, healthUUID: null });
    expect(d.w.exercises.map(e => e.tplItemId)).toEqual(['a', 'p', 's']);
    expect(d.w.exercises[0].sets.map(s => [s.weight, s.reps, s.kind])).toEqual([[70, 8, 'normal'], [72.5, 7, 'normal'], [72.5, 7, 'normal']]); // bez drop setu, nie 90 z późniejszej sesji
    expect(d.w.exercises[1].sets.map(s => s.durationSec)).toEqual([45, 45]); // cel z szablonu wygrywa (jak przy starcie)
    expect(d.w.exercises[2].sets.map(s => [s.weight, s.reps])).toEqual([[100, 5], [100, 5]]);
    expect(d.w.exercises.flatMap(e => e.sets).every(s => s.done && s.pre === undefined && s.hinted === undefined)).toBe(true);
    const early = edit.beginPast(tpl.id, day(12), day(12) + 3600e3); expect(early.w.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[60, 6], [60, 6], [60, 6]]);
    edit.discardDraft(early.key); expect(edit.draftOf(early.key)).toBeUndefined();
    const w = committed(edit.commitDraft(d.key));
    expect(store.finishedWorkouts().map(x => x.startedAt)).toEqual([day(1), day(5), day(10)]);
    expect(store.getState().workouts.map(x => x.startedAt)).toEqual([day(10), day(5), day(1)]);
    expect(store.previousFor(ex(BP).id)!.workout.startedAt).toBe(day(1)); // najnowsza sesja wciąż źródłem „Poprzednio”
    const cs = w.exercises.flatMap(e => e.sets.map(s => s.completedAt!)); expect(cs.every((c, i) => c > w.startedAt && (i === 0 || c > cs[i - 1]))).toBe(true);
    // ćwiczenie dodane z wyboru dostaje wartości ostatniej sesji przed datą — teraz to zapisany właśnie trening wstecz (5 dni temu), nie ten sprzed 1 dnia
    const e2 = edit.beginPast(null, day(3), day(3) + 3600e3); edit.draftAddExercise(e2.key, ex(BP)); expect(e2.w.exercises[0].sets[0]).toMatchObject({ weight: 70, reps: 8, done: true });
  });

  test('trening wstecz: w historii, rekordach, tygodniowej objętości i CSV; szablon z tym samym ćwiczeniem dwa razy', async () => {
    await fresh(); const bp = ex(BP); const tpl = store.newTemplate(); tpl.name = 'Dwa';
    tpl.items.push({ id: 'h', exerciseId: bp.id, sets: 2, repMin: 5, repMax: 5, restSec: null, startWeight: 100, targetSec: '', groupId: null }, { id: 'l', exerciseId: bp.id, sets: 1, repMin: 10, repMax: 12, restSec: null, startWeight: 70, targetSec: '', groupId: null }); store.save(tpl);
    const old = addWorkout(day(20), [[BP, [{ weight: 95, reps: 5 }]], [BP, [{ weight: 65, reps: 10 }]]]); old.templateId = tpl.id; old.exercises[0].tplItemId = 'h'; old.exercises[1].tplItemId = 'l'; store.save(old);
    const wk0 = weeklyTotals(8); const n0 = wk0.reduce((a, x) => a + x.workouts, 0), v0 = wk0.reduce((a, x) => a + x.volume, 0);
    const d = edit.beginPast(tpl.id, day(3), day(3) + 3600e3);
    expect(d.w.exercises.map(e => e.sets.map(s => `${s.weight}x${s.reps}`))).toEqual([['95x5', '95x5'], ['65x10']]); // blok ↔ pozycja szablonu
    d.w.exercises[0].sets[1].weight = 100;
    const w = committed(edit.commitDraft(d.key));
    expect(store.finishedWorkouts()[0].id).toBe(w.id); expect(sessionsFor(bp).map(s => s.date)).toEqual([day(20), day(3)]);
    expect(recordsFor(bp).maxLoad).toBe(100); expect([...prMap(byId(w.id)).values()].flat()).toContain('e1RM');
    const wk = weeklyTotals(8); expect(wk.reduce((a, x) => a + x.workouts, 0)).toBe(n0 + 1); expect(wk.reduce((a, x) => a + x.volume, 0)).toBeCloseTo(v0 + store.volume(w));
    const pad = (n: number) => String(n).padStart(2, '0'); const dt = new Date(day(3)); const stamp = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} 18:00:00`;
    expect(buildCsv().split('\n').filter(l => l.startsWith(stamp + ',Dwa,60m,'))).toHaveLength(3);
    expect(store.previousBlockFor(bp.id, 1, 2, 'l', tpl.id)!.sets.map(s => s.weight)).toEqual([65]); // najnowsza sesja szablonu: blok „lżej”
  });

  test('trening w toku (z przerwą i powiadomieniami) jest nietknięty przy edycji i treningu wstecz', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]);
    const tpl = store.getState().templates[0]; store.startFromTemplate(tpl); const a = store.getState().active!;
    a.exercises[0].sets[0].weight = 25; a.exercises[0].sets[0].edited = true; const rest = store.toggleDone(0, 0); await timer.start(rest ?? 90, a.exercises[0].sets[0].id);
    const snapA = JSON.stringify(store.getState().active), snapT = JSON.stringify(store.getState().timer), nN = global.__notifications.length, T = JSON.stringify(timer.T);
    const d = edit.beginEdit(w.id)!; d.w.exercises[0].sets[0].weight = 95; committed(edit.commitDraft(d.key));
    const p = edit.beginPast(tpl.id, day(6), day(6) + 3600e3); edit.draftAddExercise(p.key, ex(BP)); committed(edit.commitDraft(p.key));
    expect(JSON.stringify(store.getState().active)).toBe(snapA); expect(JSON.stringify(store.getState().timer)).toBe(snapT);
    expect(global.__notifications.length).toBe(nN); expect(JSON.stringify(timer.T)).toBe(T); expect(timer.T.on).toBe(true);
    expect(store.getState().active).toBe(a);
  });

  test('eksport → import po edycji i treningu wstecz: te same dane (migracja nic nie zmienia)', async () => {
    await fresh(); const w = addWorkout(day(4), [[BP, [{ weight: 80, reps: 5 }]], ['Chest Dip', [{ addKg: 10, reps: 8 }]]]);
    const d = edit.beginEdit(w.id)!; d.date = edit.shiftDate(d.date, -1); edit.draftAddSet(d.key, 1); d.w.exercises[1].sets[1].bandId = store.getState().bands[0].id; d.w.exercises[1].sets[1].kind = 'drop'; d.w.templateName = '  Nowa   nazwa '; committed(edit.commitDraft(d.key));
    expect(byId(w.id).templateName).toBe('Nowa nazwa');
    const p = edit.beginPast(store.getState().templates[1].id, day(2), day(2) + 3600e3); committed(edit.commitDraft(p.key));
    const before = snapshot(); const back = parseBackup(JSON.stringify(buildBackup()));
    expect(back.workouts).toEqual(before.workouts); expect(store.migrate(JSON.parse(JSON.stringify(back))).workouts).toEqual(before.workouts);
    store.replaceState(back); await store.flush(); expect(saved().workouts).toEqual(before.workouts);
    expect(buildCsv()).toContain('Nowa nazwa');
  });
});

describe('ekrany', () => {
  const open = async (w: Workout) => { await go(`/history/${w.id}`); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20); };

  test('„Edytuj” → zmiana ciężaru i powtórzeń → „Zapisz”: szczegóły sesji, zapis na dysk i kopia automatyczna (bez Apple Health)', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }, { weight: 80, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); const write = FileSystem.writeAsStringAsync as jest.Mock; write.mockClear();
    const errs: string[] = []; const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!/not wrapped in act/.test(String(a[0]))) errs.push(String(a[0]).slice(0, 160)); });
    await open(w); expect(screen.queryByText('Zmiany nie trafiają do Apple Health.')).toBeNull();
    await type(screen.getAllByLabelText('kg')[0], '82,5'); await type(screen.getAllByLabelText('Powtórzenia')[1], '6');
    expect(sets(w.id)).toEqual([['80x5', '80x5']]); // dopiero „Zapisz”
    await tap(screen.getByText('Zapisz')); await flushAll(50); await settle();
    expect(sets(w.id)).toEqual([['82.5x5', '80x6']]); expect(byId(w.id).healthUUID).toBeNull();
    expect(screen.getAllByText('82,5').length).toBeGreaterThan(0); expect(screen.queryByText('Zapisz zmiany')).toBeNull();
    expect(saved().workouts.find(x => x.id === w.id)!.exercises[0].sets[0].weight).toBe(82.5);
    expect(write.mock.calls.some(c => /\/Backup\/trening-[\d-]+\.json$/.test(c[0]))).toBe(true);
    spy.mockRestore(); expect(errs).toEqual([]); // bez ostrzeżeń Reacta (szkic zakładany w trakcie renderu edytora)
  });

  test('„Anuluj”: bez zmian zamyka od razu; po zmianie pyta — „Wróć” zostaje, „Odrzuć zmiany” nic nie zapisuje', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]); w.healthUUID = 'hk-1'; store.save(w); await renderApp({ saved: snapshot() });
    await open(w); expect(screen.getByText('Zmiany nie trafiają do Apple Health.')).toBeTruthy(); /* trening był w Zdrowiu — zmiany tam nie pójdą */ const n = global.__alerts.length; await tap(screen.getByText('Anuluj')); await flushAll(50);
    expect(global.__alerts.length).toBe(n); expect(screen.getByText('Edytuj')).toBeTruthy(); expect(edit.draftOf(w.id)).toBeUndefined();
    await tap(screen.getByText('Edytuj')); await flushAll(20); await type(screen.getAllByLabelText('kg')[0], '100'); await type(screen.getByLabelText('Godzina startu'), '06:00');
    await tap(screen.getByText('Anuluj')); expect(lastAlert().title).toBe('Odrzucić zmiany?');
    await alertNow('Odrzucić zmiany?', 'Wróć'); expect(screen.getByText('Zapisz zmiany')).toBeTruthy();
    await tap(screen.getByText('Anuluj')); await alertNow('Odrzucić zmiany?', 'Odrzuć zmiany');
    expect(sets(w.id)).toEqual([['80x5']]); expect(byId(w.id).startedAt).toBe(day(3)); expect(edit.draftOf(w.id)).toBeUndefined(); expect(screen.getByText('Edytuj')).toBeTruthy();
  });

  test('usunięcie ćwiczenia (z potwierdzeniem), dodanie z wyboru, usunięcie i dodanie serii, typ serii; serie bez wyniku → ostrzeżenie przy zapisie', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }, { weight: 82.5, reps: 5 }]], ['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); await open(w);
    await tap(screen.getByLabelText('Usuń ćwiczenie: Back Squat')); expect(lastAlert()).toMatchObject({ title: 'Usunąć z treningu?', msg: 'Back Squat' });
    await alertNow('Usunąć z treningu?', 'Usuń'); expect(screen.queryByLabelText('Usuń ćwiczenie: Back Squat')).toBeNull();
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(20);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Plank'); await tap(screen.getByText('Plank')); await flushAll(50);
    expect(screen.getByLabelText('Usuń ćwiczenie: Plank')).toBeTruthy(); expect(screen.getAllByLabelText('czas')[0].props.value).toBe('');
    await tap(screen.getByLabelText(`Usuń serię 1 — ${BP}`)); await tap(screen.getAllByText('+ seria')[0]);
    await tap(screen.getAllByLabelText(/^Seria 2, typ: normalna/)[0]); await act(async () => { (global as any).__pickSheet(3); }); // do upadku
    await tap(screen.getByText('Zapisz')); expect(lastAlert()).toMatchObject({ title: 'Zapisać zmiany?', msg: 'Serie bez wyniku zostaną pominięte: 1.' });
    await alertNow('Zapisać zmiany?', 'Zapisz');
    expect(byId(w.id).exercises.map(e => [store.exById(e.exerciseId)!.name, e.sets.map(s => `${s.weight}x${s.reps}${s.kind === 'failure' ? 'F' : ''}`)])).toEqual([[BP, ['82.5x5', '82.5x5F']]]);
  });

  test('trening bez serii: propozycja usunięcia sesji z historii', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]); const keep = addWorkout(day(5), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); await open(w);
    await tap(screen.getByLabelText(`Usuń serię 1 — ${BP}`)); expect(screen.getByText('Bez serii — ćwiczenie nie zostanie zapisane.')).toBeTruthy();
    await tap(screen.getByText('Zapisz zmiany')); expect(lastAlert().title).toBe('Pusty trening');
    await alertNow('Pusty trening', 'Wróć'); expect(store.getState().workouts).toHaveLength(2);
    await tap(screen.getByText('Zapisz')); await alertNow('Pusty trening', 'Usuń sesję');
    expect(store.getState().workouts.map(x => x.id)).toEqual([keep.id]); expect(screen.queryByText('Zapisz zmiany')).toBeNull(); expect(screen.queryByText('Brak sesji.')).toBeNull();
  });

  test('trening wstecz z Historii: termin, szablon, edytor z wartościami sprzed tej daty, zapis → szczegóły; Apple Health nie dostaje treningu', async () => {
    await fresh(); pushTpl(); store.getState().settings.healthSync = true; store.save();
    addWorkout(day(10), [[BP, [{ weight: 70, reps: 8 }]]]); addWorkout(day(1), [[BP, [{ weight: 90, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); const write = FileSystem.writeAsStringAsync as jest.Mock;
    const hk = jest.requireMock('@kingstinct/react-native-healthkit').default; const hkSave = jest.spyOn(hk, 'saveWorkoutSample');
    await go('/history'); await flushAll(20); await tap(screen.getByText('+ Dodaj trening wstecz')); await flushAll(20);
    expect(screen.getByLabelText('Data (RRRR-MM-DD)').props.value).toBe(edit.dateText(day(1))); expect(screen.getByLabelText('Godzina startu').props.value).toBe('18:00');
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), '2026-13-01'); await tap(screen.getByText('Push')); expect(lastAlert().title).toBe('Sprawdź datę i godzinę');
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), edit.dateText(day(4))); await tap(screen.getByLabelText('Dzień wcześniej')); // = 5 dni temu
    await type(screen.getByLabelText('Godzina startu'), '07:30'); await type(screen.getByLabelText('Czas trwania (min)'), '45');
    await flushAll(800); /* blokada podwójnego tapnięcia wiersza (useOnce) */ await tap(screen.getByText('Push')); await flushAll(50);
    expect(screen.getByText('Zmiany nie trafiają do Apple Health.')).toBeTruthy(); expect(screen.getAllByLabelText('kg')[0].props.value).toBe('70');
    write.mockClear(); const nA = global.__alerts.length; await tap(screen.getByText('Zapisz')); await flushAll(50); await settle();
    expect(global.__alerts.length).toBe(nA); // wszystkie serie mają wynik (70 × 8, plank 45 s z celu, przysiad 100 × 5) — zapis bez pytań
    const w = store.getState().workouts.find(x => x.templateName === 'Push')!;
    expect(w).toMatchObject({ startedAt: day(5, 7, 30), finishedAt: day(5, 7, 30) + 45 * 60e3, healthUUID: null });
    expect(store.finishedWorkouts().map(x => x.startedAt)).toEqual([day(1), day(5, 7, 30), day(10)]);
    expect(screen.getByText('Push')).toBeTruthy(); expect(screen.getByText('Edytuj')).toBeTruthy(); // szczegóły nowej sesji
    expect(write.mock.calls.some(c => /\/Backup\//.test(c[0]))).toBe(true); expect(hkSave).not.toHaveBeenCalled(); hkSave.mockRestore();
  });

  test('pusty trening wstecz bez serii: „Odrzuć trening” nic nie zapisuje', async () => {
    await renderApp(); await go('/history/add'); await flushAll(20); await tap(screen.getByText('Pusty trening')); await flushAll(50);
    expect(screen.getByText('Brak ćwiczeń — dodaj pierwsze.')).toBeTruthy(); expect(screen.queryByText('Zmiany nie trafiają do Apple Health.')).toBeNull();
    await tap(screen.getByText('Zapisz')); expect(lastAlert()).toMatchObject({ title: 'Pusty trening', msg: 'Nie ma żadnej serii z wynikiem — nic do zapisania.' });
    await alertNow('Pusty trening', 'Odrzuć trening'); expect(store.getState().workouts).toHaveLength(0); expect(screen.queryByText('Zapisz zmiany')).toBeNull();
  });

  test('jednostka lb: pola w funtach, zapis w kg (nieruszone serie co do cyfry)', async () => {
    await fresh(); store.getState().settings.unit = 'lb'; store.save(); const w = addWorkout(day(3), [[BP, [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); await open(w);
    const f = screen.getAllByLabelText('lb'); expect(f[0].props.value).toBe('220,5'); await type(f[0], '225');
    await tap(screen.getByText('Zapisz')); await flushAll(50);
    expect(byId(w.id).exercises[0].sets.map(s => s.weight)).toEqual([wIn(225), 100]); expect(screen.getAllByText('225').length).toBeGreaterThan(0);
  });

  test('English: edytor, trening wstecz i komunikaty bez polskich tekstów', async () => {
    await renderApp({ locale: 'en' }); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]], ['Chest Dip', [{ addKg: 0, reps: 8 }]], ['Plank', [{ durationSec: 30 }]]]);
    const pl = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]|\b(serii?|przerwa|Trening|Zakończ|Usuń|Ćwiczeni|pow\.|guma|sen|Zapisz|Anuluj|Edytuj|Data|Godzina)\b/;
    const texts = () => { const out: string[] = []; const walk = (n: any) => { if (!n) return; if (typeof n === 'string') { out.push(n); return; } if (Array.isArray(n)) { n.forEach(walk); return; } if (n.props) { if (typeof n.props.placeholder === 'string') out.push(n.props.placeholder); if (typeof n.props.accessibilityLabel === 'string') out.push(n.props.accessibilityLabel); } (n.children ?? []).forEach(walk); }; walk(screen.toJSON()); return out; };
    const leaks: string[] = []; const check = (where: string) => texts().filter(x => pl.test(x)).forEach(x => leaks.push(`${where}: ${x}`));
    await go(`/history/${w.id}`); await flushAll(20); await tap(screen.getByText('Edit')); await flushAll(20); check('edit');
    expect(screen.getByText('Save changes')).toBeTruthy(); expect(screen.getByLabelText('Delete set 1 — Bench Press (Barbell)')).toBeTruthy();
    for (const n of ['Bench Press (Barbell)', 'Chest Dip', 'Plank']) await tap(screen.getByLabelText(`Delete set 1 — ${n}`));
    await tap(screen.getByText('Save')); expect(lastAlert().title).toBe('Empty workout');
    leaks.push(...[lastAlert().title, lastAlert().msg ?? ''].filter(x => pl.test(x))); await alertNow(lastAlert().title, 'Back');
    await tap(screen.getByText('Cancel')); await alertNow('Discard changes?', 'Discard changes');
    await go('/history'); await flushAll(20); check('history'); await tap(screen.getByText('+ Log a past workout')); await flushAll(20); check('add');
    await type(screen.getByLabelText('Start time'), '25:00'); await tap(screen.getByText('Empty workout')); leaks.push(...[lastAlert().title, lastAlert().msg ?? ''].filter(x => pl.test(x)));
    await type(screen.getByLabelText('Start time'), '18:00'); await flushAll(800); await tap(screen.getByText('Empty workout')); await flushAll(50); check('past');
    expect(screen.getByText('No exercises — add the first one.')).toBeTruthy();
    expect(leaks).toEqual([]);
  });
});
