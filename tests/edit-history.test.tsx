/* Docs/12 (02.10.2026): edycja zakończonych treningów i trening wstecz — szkic, spójność historii (rekordy, „Poprzednio”,
 * statystyki, CSV, kopia), nietknięty trening w toku, jednostka lb, eksport/import i ekrany (PL i EN). */
import * as FileSystem from 'expo-file-system/legacy';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import { prMap, recordsFor, sessionsFor, weeklyTotals } from '@/lib/stats';
import { buildBackup, buildCsv, parseBackup } from '@/lib/backup';
import * as health from '@/lib/health';
import { wIn } from '@/lib/units';
import type { Workout } from '@/lib/seed';
import { fresh, ex, addWorkout, pressAlert, saved, withDemoTemplates } from './helpers';
import { router } from 'expo-router';
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
    expect(s).toHaveLength(2); expect(s[1]).toMatchObject({ weight: 80, reps: 5, rpe: '' /* przegląd 06.10 (#9): RPE się nie kopiuje, jak w treningu */, kind: 'normal', done: true, completedAt: null }); expect(s[1].id).not.toBe(s[0].id);
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
    // ćwiczenie dodane z wyboru dostaje OSTATNIĄ serię roboczą sesji przed datą — teraz to zapisany właśnie trening wstecz (5 dni temu), nie ten sprzed 1 dnia
    const e2 = edit.beginPast(null, day(3), day(3) + 3600e3); edit.draftAddExercise(e2.key, ex(BP)); expect(e2.w.exercises[0].sets[0]).toMatchObject({ weight: 72.5, reps: 7, done: true });
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
    const tpl = withDemoTemplates()[0]; store.startFromTemplate(tpl); const a = store.getState().active!;
    a.exercises[0].sets[0].weight = 25; a.exercises[0].sets[0].edited = true; const rest = store.toggleDone(0, 0); await timer.start(rest ?? 90, a.exercises[0].sets[0].id);
    const snapA = JSON.stringify(store.getState().active), snapT = JSON.stringify(store.getState().timer), nN = global.__notifications.length, T = JSON.stringify(timer.T);
    const d = edit.beginEdit(w.id)!; d.w.exercises[0].sets[0].weight = 95; committed(edit.commitDraft(d.key));
    const p = edit.beginPast(tpl.id, day(6), day(6) + 3600e3); edit.draftAddExercise(p.key, ex(BP)); committed(edit.commitDraft(p.key));
    expect(JSON.stringify(store.getState().active)).toBe(snapA); expect(JSON.stringify(store.getState().timer)).toBe(snapT);
    expect(global.__notifications.length).toBe(nN); expect(JSON.stringify(timer.T)).toBe(T); expect(timer.T.on).toBe(true);
    expect(store.getState().active).toBe(a);
  });

  test('eksport → import po edycji i treningu wstecz: te same dane (migracja nic nie zmienia)', async () => {
    await fresh(); withDemoTemplates(); const w = addWorkout(day(4), [[BP, [{ weight: 80, reps: 5 }]], ['Chest Dip', [{ addKg: 10, reps: 8 }]]]);
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

/* Audyt niezależny (03.10.2026): H1, M2–M6 i wybrane LOW — testy regresji. */
describe('audyt: logika', () => {
  test('H1: nieruszone serie zostają, choć nie mają wyniku w dzisiejszej metryce (zmieniona metryka, odhaczone puste powtórzenia, rozgrzewka bez powtórzeń)', async () => {
    await fresh(); const bp = ex(BP);
    const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }, { weight: 80, reps: 5 }]]]);
    bp.metric = 'weight_time'; store.save(bp); // metryka zmieniona po treningu
    const d = edit.beginEdit(w.id)!; d.w.note = 'tylko notatka';
    expect(edit.checkDraft(d.key)).toMatchObject({ dropped: 0, empty: false });
    committed(edit.commitDraft(d.key)); expect(sets(w.id)).toEqual([['80x5', '80x5']]); expect(byId(w.id).note).toBe('tylko notatka');
    bp.metric = 'weight_reps'; store.save(bp);
    const w2 = addWorkout(day(5), [[BP, [{ weight: 40, reps: '', kind: 'warmup' }, { weight: 80, reps: '' }, { weight: 80, reps: 5 }]]]);
    const d2 = edit.beginEdit(w2.id)!; d2.w.exercises[0].sets[2].reps = 6;
    expect(edit.checkDraft(d2.key)).toMatchObject({ dropped: 0 }); committed(edit.commitDraft(d2.key)); expect(sets(w2.id)).toEqual([['40x', '80x', '80x6']]);
    const d3 = edit.beginEdit(w2.id)!; d3.w.exercises[0].sets[1].weight = 82.5; // ruszona seria bez powtórzeń — reguła działa
    expect(edit.checkDraft(d3.key)).toMatchObject({ dropped: 1 }); committed(edit.commitDraft(d3.key)); expect(sets(w2.id)).toEqual([['40x', '80x6']]);
    const d4 = edit.beginEdit(w2.id)!; d4.w.exercises[0].sets[0].kind = 'normal'; d4.w.exercises[0].sets[0].note = 'x'; // typ i notatka to nie wynik
    expect(edit.checkDraft(d4.key)).toMatchObject({ dropped: 0, empty: false });
  });

  test('M2: zmiana daty po wstawieniu wartości — nieruszone liczą się od nowa z sesji sprzed NOWEJ daty, wpisane ręcznie zostają; zapis też to robi', async () => {
    await fresh(); const tpl = pushTpl();
    addWorkout(day(10), [[BP, [{ weight: 70, reps: 8 }]]]); addWorkout(day(3), [[BP, [{ weight: 80, reps: 6 }]]]); addWorkout(day(1), [[BP, [{ weight: 90, reps: 5 }]]]);
    const d = edit.beginPast(tpl.id, day(5), day(5) + 3600e3); const bpSets = () => d.w.exercises[0].sets.map(s => `${s.weight}x${s.reps}`);
    expect(bpSets()).toEqual(['70x8', '70x8', '70x8']);
    d.w.exercises[0].sets[2].weight = 75; // ręcznie
    edit.draftSetWhen(d.key, { date: edit.dateText(day(12)) }); expect(bpSets()).toEqual(['60x6', '60x6', '75x6']); // przed całą historią: start z szablonu; wpisany ciężar zostaje, powtórzenia (nieruszone) liczą się od nowa
    edit.draftSetWhen(d.key, { date: edit.dateText(day(2)) }); expect(bpSets()).toEqual(['80x6', '80x6', '75x6']); // sesja sprzed 3 dni, nie ta sprzed 1
    edit.draftSetWhen(d.key, { date: '2026-' }); expect(bpSets()).toEqual(['80x6', '80x6', '75x6']); // niedokończona data — bez zmian
    Object.assign(d, { date: edit.dateText(day(12)) }); // pole zmienione bez draftSetWhen — zapis i tak liczy od nowa
    const w = committed(edit.commitDraft(d.key)); expect(w.exercises[0].sets.map(s => `${s.weight}x${s.reps}`)).toEqual(['60x6', '60x6', '75x6']);
    // edycja istniejącej sesji: ćwiczenie dodane w edytorze bierze sesję sprzed BIEŻĄCEJ daty i nie samą siebie
    const last = store.finishedWorkouts()[0]; const e = edit.beginEdit(last.id)!; edit.draftAddExercise(e.key, ex(BP));
    expect(e.w.exercises[1].sets[0]).toMatchObject({ weight: 80, reps: 6 });
    edit.draftSetWhen(e.key, { date: edit.dateText(day(4)) }); expect(e.w.exercises[1].sets[0]).toMatchObject({ weight: 70, reps: 8 });
  });

  test('M3: trening wstecz dobiera blok jak „Poprzednio” (to samo ćwiczenie dwa razy, ostatnia sesja z innego treningu); previousBlockBefore(∞) = previousBlockFor', async () => {
    await fresh(); const bp = ex(BP); const tpl = store.newTemplate(); tpl.name = 'Dwa';
    tpl.items.push({ id: 'h', exerciseId: bp.id, sets: 2, repMin: 5, repMax: 5, restSec: null, startWeight: '', targetSec: '', groupId: null }, { id: 'l', exerciseId: bp.id, sets: 1, repMin: 10, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(tpl);
    const old = addWorkout(day(20), [[BP, [{ weight: 95, reps: 5 }]], [BP, [{ weight: 65, reps: 10 }]]]); old.templateId = tpl.id; old.exercises[0].tplItemId = 'h'; old.exercises[1].tplItemId = 'l'; store.save(old);
    addWorkout(day(10), [[BP, [{ weight: 100, reps: 3 }, { weight: 50, reps: 20, kind: 'drop' }]]]); // inny trening, jeden blok
    const d = edit.beginPast(tpl.id, day(5), day(5) + 3600e3);
    expect(d.w.exercises.map(e => e.sets.map(s => `${s.weight}x${s.reps}`))).toEqual([['95x5', '95x5'], ['65x10']]); // nie 100 kg w bloku „lżej”
    expect(store.previousBlockFor(bp.id, 1, 2, 'l', tpl.id)!.sets.map(s => s.weight)).toEqual([65]);
    addWorkout(day(30), [['Back Squat', [{ weight: 50, reps: 5 }]]]); addWorkout(day(2), [[BP, [{ weight: 40, reps: 20, kind: 'drop' }]], ['Back Squat', [{ weight: 100, reps: 5 }]]]);
    for (const [exId, k, n, it, tp] of [[bp.id, 0, 2, 'h', tpl.id], [bp.id, 1, 2, 'l', tpl.id], [bp.id, 0, 1, undefined, null], [bp.id, 1, 2, undefined, null], [ex('Back Squat').id, 0, 1, 'x', tpl.id], [ex('Leg Press').id, 0, 1, undefined, null]] as [string, number, number, string | undefined, string | null][])
      expect(store.previousBlockBefore(exId, Infinity, k, n, it, tp)).toEqual(store.previousBlockFor(exId, k, n, it, tp));
    expect(store.previousBlockBefore(bp.id, day(2), 0, 1)!.sets.map(s => s.weight)).toEqual([100, 50]); // sesja z samymi dropami pominięta (jak „Poprzednio”)
  });

  test('M4: ten sam start co inna sesja — start przesunięty o 1 s; PR tylko w późniejszej, „Poprzednio” jednoznaczne', async () => {
    await fresh(); const bp = ex(BP); const first = addWorkout(day(4), [[BP, [{ weight: 80, reps: 5 }]]]);
    const p = edit.beginPast(null, day(4), day(4) + 3600e3); edit.draftAddExercise(p.key, bp); Object.assign(p.w.exercises[0].sets[0], { weight: 85, reps: 5 });
    const w = committed(edit.commitDraft(p.key)); expect(w.startedAt).toBe(day(4) + 1000); expect(w.finishedAt).toBe(day(4) + 3601e3);
    expect(prMap(byId(first.id)).size).toBe(0); expect(prMap(byId(w.id)).size).toBe(1); expect(store.previousFor(bp.id)!.workout.id).toBe(w.id);
    const third = addWorkout(day(8), [[BP, [{ weight: 60, reps: 5 }]]]); const e = edit.beginEdit(third.id)!; e.date = edit.dateText(day(4)); // przeniesiona na ten sam start
    committed(edit.commitDraft(e.key)); expect(byId(third.id).startedAt).toBe(day(4) + 2000); expect(byId(third.id).exercises[0].sets[0].completedAt).toBe(day(4) + 2000);
    expect(new Set(store.getState().workouts.map(x => x.startedAt)).size).toBe(3);
  });

  test('M5: termin nachodzący na trening w toku — błąd; na inną sesję z historii — ostrzeżenie (overlap); nieruszony termin — bez sprawdzania', async () => {
    await fresh(); const other = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]);
    store.startEmpty(); const a = store.getState().active!; a.startedAt = Date.now() - 2 * 3600e3; store.save(a);
    const p = edit.beginPast(null, a.startedAt - 1800e3, a.startedAt + 1800e3); edit.draftAddExercise(p.key, ex(BP)); Object.assign(p.w.exercises[0].sets[0], { weight: 50, reps: 5 });
    const r = edit.commitDraft(p.key); expect('error' in r && r.error).toMatch(/nachodzi na trening w toku/); expect(store.getState().workouts).toHaveLength(1);
    expect(edit.activeOverlapError(a.startedAt - 3600e3, a.startedAt)).toBeNull(); expect(edit.activeOverlapError(a.startedAt - 3600e3, a.startedAt + 1)).toMatch(/w toku/);
    edit.draftSetWhen(p.key, { date: edit.dateText(day(3)), time: '18:30' }); const c = edit.checkDraft(p.key);
    expect('overlap' in c && c.overlap?.id).toBe(other.id); committed(edit.commitDraft(p.key)); // ostrzeżenie, nie blokada
    const e = edit.beginEdit(other.id)!; e.w.note = 'x'; expect(edit.checkDraft(e.key)).toMatchObject({ overlap: null }); // termin nieruszony
    expect(store.getState().active).toBe(a);
  });

  test('LOW: sama zmiana czasu trwania nie rusza startu (sekundy), skrócenie przycina godziny serii; dawny czas > 24 h zostaje przy zmianie samej daty; ścisły czas trwania', async () => {
    await fresh(); const w = addWorkout(day(3) + 37e3, [[BP, [{ weight: 80, reps: 5 }, { weight: 80, reps: 5, completedAt: day(3) + 50 * 60e3 }]]]);
    const d = edit.beginEdit(w.id)!; edit.draftSetWhen(d.key, { min: '30' }); committed(edit.commitDraft(d.key));
    expect(byId(w.id).startedAt).toBe(day(3) + 37e3); expect(byId(w.id).finishedAt).toBe(day(3) + 37e3 + 30 * 60e3);
    expect(byId(w.id).exercises[0].sets.map(s => s.completedAt)).toEqual([day(3) + 37e3, day(3) + 37e3 + 30 * 60e3]);
    const long = addWorkout(day(6), [[BP, [{ weight: 70, reps: 5 }]]]); long.finishedAt = day(6) + 30 * 3600e3; store.save(long);
    const l = edit.beginEdit(long.id)!; expect(l.min).toBe('1800'); edit.draftSetWhen(l.key, { date: edit.dateText(day(7)) }); committed(edit.commitDraft(l.key));
    expect(byId(long.id).finishedAt! - byId(long.id).startedAt).toBe(30 * 3600e3);
    const l2 = edit.beginEdit(long.id)!; edit.draftSetWhen(l2.key, { min: '1800' }); expect(edit.checkDraft(l2.key)).toMatchObject({ dropped: 0, empty: false }); // ten sam tekst co przy otwarciu = bez zmian
    edit.draftSetWhen(l2.key, { min: '1801' }); expect(edit.checkDraft(l2.key)).toEqual({ error: expect.stringMatching(/1440/) }); // nowa wartość — limit 24 h
    const now = new Date(2026, 9, 2, 12).getTime();
    for (const m of ['1e3', '+60', '60.0', ' 6 0', '12345', '-5']) expect('error' in edit.parseWhen('2026-10-01', '08:00', m, now)).toBe(true);
    expect('error' in edit.parseWhen('2026-10-01', '08:00', ' 60 ', now)).toBe(false);
  });

  /* Tylko w strefie Europe/Warsaw (zmiana process.env.TZ w trakcie nie działa w procesach Jesta); każdą strefę obejmuje tests/matrix-time.test.ts (tests-tz.yml). */
  (new Date(2026, 2, 29, 2, 30).getHours() === 3 && new Date(2026, 0, 1).getTimezoneOffset() === -60 ? test : test.skip)('LOW: godzina nieistniejąca przez zmianę czasu (Europe/Warsaw, 29.03.2026 02:30) — błąd z komunikatem', () => {
    const tz = process.env.TZ; process.env.TZ = 'Europe/Warsaw';
    try {
      const now = new Date(2026, 9, 2, 12).getTime(); const r = edit.parseWhen('2026-03-29', '02:30', '60', now);
      expect(r).toEqual({ error: 'Godzina 02:30 nie istnieje tego dnia (zmiana czasu). Wpisz inną.' });
      expect(edit.parseWhen('2026-03-29', '03:30', '60', now)).toEqual({ start: new Date(2026, 2, 29, 3, 30).getTime(), end: new Date(2026, 2, 29, 4, 30).getTime() });
      expect('error' in edit.parseWhen('2025-10-26', '02:30', '60', now)).toBe(false); // godzina podwójna (jesień 2025) istnieje
    } finally { process.env.TZ = tz; if (tz === undefined) delete process.env.TZ; }
  });
});

describe('audyt: ekrany', () => {
  test('H1 na ekranie: metryka zmieniona po treningu, edycja samej notatki — zapis bez „Pusty trening” i bez utraty serii', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }, { weight: 80, reps: 5 }]]]); const bp = ex(BP); bp.metric = 'weight_time'; store.save(bp);
    await renderApp({ saved: snapshot() }); await go(`/history/${w.id}`); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20);
    await type(screen.getByLabelText('Notatka do treningu'), 'lekko'); const n = global.__alerts.length; await tap(screen.getByText('Zapisz')); await flushAll(50);
    expect(global.__alerts.length).toBe(n); expect(byId(w.id).note).toBe('lekko'); expect(sets(w.id)).toEqual([['80x5', '80x5']]);
  });

  test('„Usuń sesję” z edytora: powrót na listę Historii (nie na „Brak sesji”), kopia automatyczna po usunięciu', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]); addWorkout(day(5), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); const write = FileSystem.writeAsStringAsync as jest.Mock;
    await go('/history'); await flushAll(20); await tap(screen.getAllByText('T')[0]); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20);
    await tap(screen.getByLabelText(`Usuń serię 1 — ${BP}`)); await tap(screen.getByText('Zapisz')); write.mockClear(); await alertNow('Pusty trening', 'Usuń sesję'); await settle();
    expect(store.getState().workouts.some(x => x.id === w.id)).toBe(false);
    expect(screen.getByText('+ Dodaj trening wstecz')).toBeTruthy(); expect(screen.getAllByText('Historia').length).toBeGreaterThan(0); expect(screen.queryByText('Brak sesji.')).toBeNull(); expect(screen.queryByText('Edytuj')).toBeNull();
    expect(write.mock.calls.some(c => /\/Backup\//.test(c[0]))).toBe(true);
  });

  test('trening wstecz nachodzący na trening w toku — odrzucony już na pierwszym ekranie; nachodzący na sesję z historii — potwierdzenie', async () => {
    await fresh(); addWorkout(day(2, 17), [[BP, [{ weight: 80, reps: 5 }]]]); store.startEmpty(); const a = store.getState().active!; a.startedAt = Date.now() - 3600e3; store.save(a);
    await renderApp({ saved: snapshot() }); await go('/history/add'); await flushAll(20);
    const st = Date.now() - 5400e3; await type(screen.getByLabelText('Data (RRRR-MM-DD)'), edit.dateText(st)); await type(screen.getByLabelText('Godzina startu'), edit.timeText(st));
    await tap(screen.getByText('Pusty trening')); expect(lastAlert()).toMatchObject({ title: 'Sprawdź datę i godzinę', msg: expect.stringMatching(/nachodzi na trening w toku/) });
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), edit.dateText(day(2))); await type(screen.getByLabelText('Godzina startu'), '17:30'); // w trakcie sesji 17:00–18:00
    await flushAll(800); await tap(screen.getByText('Pusty trening')); await flushAll(50);
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(20);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Back Squat'); await tap(screen.getByText('Back Squat')); await flushAll(50);
    await type(screen.getAllByLabelText('kg')[0], '100'); await type(screen.getAllByLabelText('Powtórzenia')[0], '5');
    await tap(screen.getByText('Zapisz')); expect(lastAlert()).toMatchObject({ title: 'Zapisać zmiany?', msg: expect.stringMatching(/nachodzi na sesję „T”/) });
    await alertNow('Zapisać zmiany?', 'Zapisz'); expect(store.getState().workouts).toHaveLength(2); expect(store.getState().active!.exercises).toHaveLength(0);
  });

  test('id z nietypowymi znakami (import): edytor, wybór ćwiczenia i zapis działają (encodeURIComponent); zamknięcie ekranu wyrzuca szkic; „Edytuj” dwa razy szybko = jeden szkic', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]); w.id = 'x/y z?#1'; store.save(w);
    await renderApp({ saved: snapshot() }); await go(`/history/${encodeURIComponent(w.id)}`); await flushAll(20);
    const spy = jest.spyOn(edit, 'beginEdit'); const btn = screen.getByText('Edytuj'); await tap(btn); await tap(btn); await flushAll(20);
    expect(spy).toHaveBeenCalledTimes(1); spy.mockRestore();
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(20); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Leg Press'); await tap(screen.getByText('Leg Press')); await flushAll(50);
    expect(edit.draftOf(w.id)!.w.exercises).toHaveLength(2);
    await act(async () => { router.back(); }); await flushAll(50); // wyjście bez „Anuluj” (np. systemowe)
    expect(edit.draftOf(w.id)).toBeUndefined(); expect(byId(w.id).exercises).toHaveLength(1);
    await flushAll(1100); await tap(screen.getByText('Edytuj')); await flushAll(20); await type(screen.getAllByLabelText('Powtórzenia')[0], '7'); await tap(screen.getByText('Zapisz')); await flushAll(50);
    expect(sets(w.id)).toEqual([['80x7']]);
  });

  test('trening wstecz bez szablonów z ćwiczeniami: podpowiedź, gdzie je utworzyć', async () => {
    await fresh(); store.getState().templates = []; store.save(); await renderApp({ saved: snapshot() }); await go('/history/add'); await flushAll(20);
    expect(screen.getByText('Brak szablonów z ćwiczeniami — utworzysz je w zakładce Szablony. Możesz też zacząć od pustego treningu.')).toBeTruthy();
  });
});

/* Weryfikacja 2 (03.10.2026): L1–L5. */
describe('weryfikacja 2', () => {
  test('L1: „+ seria” z serii wypełnionej przez aplikację też liczy się od nowa po zmianie daty; L2: per pole — wpisane powtórzenia zostają, ciężar się przelicza', async () => {
    await fresh(); const tpl = pushTpl();
    addWorkout(day(10), [[BP, [{ weight: 70, reps: 8 }]]]); addWorkout(day(3), [[BP, [{ weight: 80, reps: 6 }]]]);
    const d = edit.beginPast(tpl.id, day(5), day(5) + 3600e3); const bpSets = () => d.w.exercises[0].sets.map(s => `${s.weight}x${s.reps}`);
    edit.draftAddSet(d.key, 0); expect(bpSets()).toEqual(['70x8', '70x8', '70x8', '70x8']);
    d.w.exercises[0].sets[0].reps = 10; // ręcznie tylko powtórzenia
    edit.draftAddSet(d.key, 0); d.w.exercises[0].sets[4].weight = 72.5; // kopia, potem ręcznie ciężar
    edit.draftSetWhen(d.key, { date: edit.dateText(day(2)) });
    expect(bpSets()).toEqual(['80x10', '80x6', '80x6', '80x6', '72.5x6']);
    edit.draftSetWhen(d.key, { date: edit.dateText(day(12)) }); expect(bpSets()).toEqual(['60x10', '60x6', '60x6', '60x6', '72.5x6']);
    const w = committed(edit.commitDraft(d.key)); expect(w.exercises[0].sets.map(s => `${s.weight}x${s.reps}`)).toEqual(['60x10', '60x6', '60x6', '60x6', '72.5x6']);
  });

  test('L3: znacznik Apple Health i createdAt z treningu zapisanego teraz — zapis do Zdrowia skończony w trakcie edycji albo po niej nie ginie', async () => {
    await fresh(); store.getState().settings.healthSync = true; const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]);
    const d = edit.beginEdit(w.id)!; d.w.note = 'x'; d.w.createdAt = 1; byId(w.id).healthUUID = 'hk-1'; store.save(byId(w.id)); // Zdrowie skończyło w trakcie edycji
    committed(edit.commitDraft(d.key)); expect(byId(w.id)).toMatchObject({ healthUUID: 'hk-1', createdAt: w.createdAt, note: 'x' });
    const w2 = addWorkout(day(5), [[BP, [{ weight: 70, reps: 5 }]]]);
    const hk = jest.requireMock('@kingstinct/react-native-healthkit').default; let done: (v: string) => void = () => {};
    const spy = jest.spyOn(hk, 'saveWorkoutSample').mockImplementation(() => new Promise<string>(res => { done = res; }));
    const pending = health.saveWorkout(byId(w2.id)); // zapis do Zdrowia trwa…
    const d2 = edit.beginEdit(w2.id)!; d2.w.exercises[0].sets[0].reps = 6; committed(edit.commitDraft(d2.key)); // …a w tym czasie zapis edycji
    done('uuid-2'); expect(await pending).toBe('saved'); spy.mockRestore();
    expect(byId(w2.id)).toMatchObject({ healthUUID: 'uuid-2' }); expect(sets(w2.id)).toEqual([['70x6']]);
  });

  test('L4: nieruszona seria ze starych danych bez godziny zostaje bez godziny i z dawną przerwą (kopia 1:1); seria zmieniona dostaje godzinę', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5, completedAt: null, actualRest: 75 }, { weight: 80, reps: 5, completedAt: null, actualRest: 80 }]]]);
    w.exercises[0].sets.forEach(x => { x.completedAt = null; }); store.save(w); const before = JSON.parse(JSON.stringify(byId(w.id).exercises));
    const d = edit.beginEdit(w.id)!; d.w.note = 'n'; committed(edit.commitDraft(d.key));
    expect(byId(w.id).exercises).toEqual(before); expect(parseBackup(JSON.stringify(buildBackup())).workouts.find(x => x.id === w.id)!.exercises).toEqual(before);
    const d2 = edit.beginEdit(w.id)!; d2.w.exercises[0].sets[1].reps = 6; committed(edit.commitDraft(d2.key));
    expect(byId(w.id).exercises[0].sets.map(x => [x.completedAt, x.actualRest])).toEqual([[null, 75], [day(3) + 1000, null]]);
  });

  test('L5: „Usuń sesję” ze szczegółów otwartych z zakładki Trening — ląduje na liście Historii', async () => {
    await fresh(); const w = addWorkout(day(3), [[BP, [{ weight: 80, reps: 5 }]]]); addWorkout(day(5), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    await renderApp({ saved: snapshot() }); expect(screen.getByText('Zacznij z szablonu')).toBeTruthy(); // zakładka Trening
    await go(`/history/${w.id}`); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20);
    await tap(screen.getByLabelText(`Usuń serię 1 — ${BP}`)); await tap(screen.getByText('Zapisz')); await alertNow('Pusty trening', 'Usuń sesję'); await settle();
    expect(store.getState().workouts.some(x => x.id === w.id)).toBe(false);
    expect(screen.getByText('+ Dodaj trening wstecz')).toBeTruthy(); expect(screen.queryByText('Zacznij z szablonu')).toBeNull(); expect(screen.queryByText('Edytuj')).toBeNull();
  });
});
