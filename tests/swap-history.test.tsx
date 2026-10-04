/* E2 D6 (docs/14 pkt 5; testy 18–22 z pkt 7) — zamiana w edytorze historii: przepięcie całego bloku (P3 a), masa ciała ↔ ciężar
 * do pola B (P4 a), poprawka samego przyrządu (P5b a). Szkic (lib/edit.ts), zapis jednym ruchem, „Anuluj” nic nie zmienia. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import * as health from '@/lib/health';
import { prMap, recordsFor, weeklyTotals } from '@/lib/stats';
import { fresh, ex, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, tap, act } from './app';
import { userHome, loc } from './locations-fixtures';
import { presetEquipment } from '@/lib/equipment';
import type { Workout } from '@/lib/seed';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const day = (n: number, h = 18) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h).getTime(); };
const byId = (id: string) => store.getState().workouts.find(w => w.id === id)!;
const committed = (r: { w: Workout } | { error: string }) => { if ('error' in r) throw new Error(r.error); return r.w; };
const BP = 'Bench Press (sztanga)', DB = 'Bench Press (hantle)';
const TREXO = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24];

describe('D6 — logika', () => {
  test('przepięcie bloku A → B: serie i wartości bez zmian, impl wg miejsca szkicu, swappedFrom wg H6; Anuluj nic nie zmienia', async () => {
    await fresh(); const s = store.getState().settings; s.locations = [userHome(TREXO), loc('Siłownia', presetEquipment('gym'), 'gym')]; s.mainLocationId = 'home';
    const w = addWorkout(day(3), [[BP, [{ weight: 60, reps: 8 }, { weight: 60, reps: 7 }]]]); w.locationId = 'home'; w.exercises[0].tplItemId = 'it'; w.exercises[0].groupId = null; store.save();
    const before = JSON.stringify(byId(w.id));
    const d = edit.beginEdit(w.id)!; const b = d.w.exercises[0];
    expect(edit.draftSwapExercise(d.key, b.id, ex(DB).id)).toBe(true);
    expect(b.exerciseId).toBe(ex(DB).id); expect(b.sets.map(x => [x.weight, x.reps])).toEqual([[60, 8], [60, 7]]); expect(b.impl).toBe('dumbbell'); expect(b.implPinned).toBeUndefined();
    expect(b.swappedFrom).toBe(ex(BP).id); /* H6: blok z pozycji szablonu */
    expect(edit.canRestoreExercise(d, b)).toBe(true);
    edit.draftSwapExercise(d.key, b.id, ex('Machine Chest Press').id); expect(b.swappedFrom).toBe(ex(BP).id);
    edit.draftRestoreExercise(d.key, b.id); expect(b.exerciseId).toBe(ex(BP).id); expect(b.swappedFrom).toBeUndefined(); expect(edit.canRestoreExercise(d, b)).toBe(false);
    edit.draftSwapExercise(d.key, b.id, ex(DB).id); edit.discardDraft(d.key); expect(JSON.stringify(byId(w.id))).toBe(before); /* Anuluj */
    /* blok bez pozycji szablonu: bez swappedFrom; powrót do swappedFrom go usuwa */
    const w2 = addWorkout(day(2), [[BP, [{ weight: 50, reps: 5 }]]]); const d2 = edit.beginEdit(w2.id)!; const b2 = d2.w.exercises[0];
    edit.draftSwapExercise(d2.key, b2.id, ex(DB).id); expect(b2.swappedFrom).toBeUndefined();
    /* inna miara — odmowa (H3) */
    expect(edit.draftSwapExercise(d2.key, b2.id, ex('Plank').id)).toBe(false);
  });

  test('po zapisie: rekordy A i B (także PR późniejszej sesji), Poprzednio następnego treningu, objętość tygodnia przeliczone', async () => {
    await fresh();
    addWorkout(day(7), [[BP, [{ weight: 80, reps: 5 }]]]); const w1 = addWorkout(day(5), [[BP, [{ weight: 100, reps: 5 }]]]); /* pomyłka: to były hantle */
    const w2 = addWorkout(day(2), [[DB, [{ weight: 30, reps: 8 }]]]); const w3 = addWorkout(day(1), [[BP, [{ weight: 90, reps: 5 }]]]);
    expect(prMap(byId(w3.id)).get(w3.exercises[0].sets[0].id)).toBeUndefined(); /* 90 < 100 — bez PR */
    const volBefore = weeklyTotals().reduce((a: number, x: any) => a + (x.volume ?? 0), 0);
    const d = edit.beginEdit(w1.id)!; edit.draftSwapExercise(d.key, d.w.exercises[0].id, ex(DB).id); committed(edit.commitDraft(d.key));
    expect(byId(w1.id).exercises[0].exerciseId).toBe(ex(DB).id);
    expect(recordsFor(ex(BP)).maxLoad).toBe(90); expect(recordsFor(ex(DB)).maxLoad).toBe(100);
    expect(prMap(byId(w3.id)).get(w3.exercises[0].sets[0].id)).toEqual(expect.arrayContaining(['e1RM'])); /* PR późniejszej sesji A */
    expect(prMap(byId(w2.id)).get(w2.exercises[0].sets[0].id)).toBeUndefined(); /* 30×8 po 100×5 hantlami — już nie rekord */
    expect(store.previousFor(ex(DB).id)!.sets[0].weight).toBe(30);
    expect(weeklyTotals().reduce((a: number, x: any) => a + (x.volume ?? 0), 0)).not.toBe(volBefore); /* hantle ×2 */
  });

  test('trening wstecz: wartości wstawione przez aplikację liczą się od nowa z historii B, wpisane ręcznie zostają', async () => {
    await fresh(); addWorkout(day(6), [[DB, [{ weight: 24, reps: 10 }]]]); addWorkout(day(5), [[BP, [{ weight: 80, reps: 5 }]]]);
    const d = edit.beginPast(null, day(1), day(1) + 3600e3); edit.draftAddExercise(d.key, ex(BP)); edit.draftAddSet(d.key, 0);
    const b = d.w.exercises[0]; expect(b.sets.map(x => x.weight)).toEqual([80, 80]);
    b.sets[1].reps = 3; /* wpisane ręcznie */
    edit.draftSwapExercise(d.key, b.id, ex(DB).id);
    expect(b.sets.map(x => [x.weight, x.reps])).toEqual([[24, 10], [24, 3]]);
    /* edycja zapisanego treningu: prefilled puste — nic się nie przelicza */
    const w = addWorkout(day(3), [[BP, [{ weight: 70, reps: 6 }]]]); const d2 = edit.beginEdit(w.id)!; edit.draftSwapExercise(d2.key, d2.w.exercises[0].id, ex(DB).id);
    expect(d2.w.exercises[0].sets[0].weight).toBe(70);
  });

  test('Apple Health nie jest wołane przy zapisie przepięcia; uwaga w edytorze jak dziś', async () => {
    await fresh(); store.getState().settings.healthSync = true; const spy = jest.spyOn(health, 'saveWorkout'); const spy2 = jest.spyOn(health, 'syncAfterFinish');
    const w = addWorkout(day(2), [[BP, [{ weight: 60, reps: 5 }]]]); const d = edit.beginEdit(w.id)!; edit.draftSwapExercise(d.key, d.w.exercises[0].id, ex(DB).id); committed(edit.commitDraft(d.key));
    expect(spy).not.toHaveBeenCalled(); expect(spy2).not.toHaveBeenCalled(); spy.mockRestore(); spy2.mockRestore();
  });

  test('tylko ta sama metryka; blok usuniętego ćwiczenia — cała biblioteka; P4: masa ciała ↔ ciężar do pola B, ujemna asysta → puste', async () => {
    await fresh(); const w = addWorkout(day(2), [['Pull Up', [{ addKg: 10, reps: 8 }, { addKg: -20, reps: 6 }]], ['Lat Pulldown', [{ weight: 50, reps: 10 }]]]);
    const d = edit.beginEdit(w.id)!; const [pu, lp] = d.w.exercises;
    edit.draftSwapExercise(d.key, pu.id, ex('Lat Pulldown').id); expect(pu.sets.map(x => [x.weight, x.addKg])).toEqual([[10, ''], ['', '']]);
    edit.draftSwapExercise(d.key, lp.id, ex('Chin Up').id); expect(lp.sets.map(x => [x.weight, x.addKg])).toEqual([['', 50]]);
    expect(edit.swapTargetOk(d, lp, ex('Plank'))).toBe(false); expect(edit.swapTargetOk(d, lp, ex('Pull Up'))).toBe(true);
    lp.exerciseId = 'gone'; expect(edit.swapTargetOk(d, lp, ex('Plank'))).toBe(true); /* H3: usunięte ćwiczenie — bez filtra miary */
    const c = edit.checkDraft(d.key); expect('error' in c ? 0 : c.noWeight).toBe(1); /* ostrzeżenie „Serie bez ciężaru” przy zapisie */
  });

  test('P5b: poprawka samego przyrządu w historii — RDL zapisany jako hantle → stacja', async () => {
    await fresh(); const s = store.getState().settings; s.locations = [userHome(TREXO)]; s.mainLocationId = 'home';
    const w = addWorkout(day(2), [['RDL (hantle/linki)', [{ weight: 40, reps: 10 }]]]); w.locationId = 'home'; w.exercises[0].impl = 'dumbbell'; store.save();
    const d = edit.beginEdit(w.id)!; const b = d.w.exercises[0];
    expect(edit.draftImplChoices(d, b)).toEqual(['electric']);
    edit.draftSetImpl(d.key, b.id, 'electric'); expect(b).toMatchObject({ impl: 'electric', implPinned: true, exerciseId: ex('RDL (hantle/linki)').id }); expect(b.sets[0].weight).toBe(40);
    committed(edit.commitDraft(d.key)); expect(byId(w.id).exercises[0]).toMatchObject({ impl: 'electric', implPinned: true });
    /* bez miejsca: przyrządy z rodzaju ciężaru ćwiczenia */
    const w2 = addWorkout(day(1), [['RDL (hantle/linki)', [{ weight: 20, reps: 10 }]]]); const d2 = edit.beginEdit(w2.id)!;
    expect(edit.draftImplChoices(d2, d2.w.exercises[0]).sort()).toEqual(['cable', 'dumbbell', 'electric'].sort());
  });
});

describe('D6 — ekrany', () => {
  test('edytor: „⇄ zamień” → arkusz (ranking przed datą) → przepięcie; „↺ przywróć”; Zapisz', async () => {
    await fresh(); const w = addWorkout(day(2), [[BP, [{ weight: 60, reps: 8 }]]]); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/history/edit/${w.id}`); await flushAll(20);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (sztanga)')); await flushAll(20);
    expect(screen.getByText('Propozycje')).toBeTruthy(); expect(screen.getByText(/Poprawka zapisu/)).toBeTruthy();
    await tap(screen.getByLabelText(/^Propozycja 1: Bench Press \(hantle\)/)); await flushAll(20);
    const d = edit.draftOf(w.id)!; expect(d.w.exercises[0].exerciseId).toBe(ex(DB).id);
    expect(screen.getByText('Bench Press (hantle)')).toBeTruthy();
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bench Press (hantle)')); await flushAll(20);
    expect(screen.getByText('↺ przywróć: Bench Press (sztanga)')).toBeTruthy();
    await tap(screen.getByText('Cała biblioteka')); await flushAll(20);
    expect(screen.queryByText('Plank')).toBeNull(); await tap(screen.getByText('Push Up')); await flushAll(20);
    expect(d.w.exercises[0].exerciseId).toBe(ex('Push Up').id); expect(d.w.exercises[0].sets[0].addKg).toBe(60); /* P4 */
    expect(store.getState().workouts.find(x => x.id === w.id)!.exercises[0].exerciseId).toBe(ex(BP).id); /* szkic */
    void pressAlert;
  });
});
