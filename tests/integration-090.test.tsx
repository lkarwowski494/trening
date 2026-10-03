/* Integracja 0.9.0: edycja treningów z historii i trening wstecz (docs/12) RAZEM z miejscami treningu (P-003 E1, docs/10).
 * Interakcje funkcji: edycja treningu z miejscem, trening wstecz przy istniejących miejscach, wybór ćwiczenia w edytorze
 * (target 'edit:<klucz>'), migracja i eksport/import z danymi obu funkcji. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import * as L from '@/lib/locations';
import { prMap, recordsFor } from '@/lib/stats';
import { buildBackup, parseBackup } from '@/lib/backup';
import type { Workout, Impl } from '@/lib/seed';
import { fresh, ex, addWorkout, pressAlert } from './helpers';
import { userHome } from './locations-fixtures';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/** n dni temu o godzinie h (czas lokalny). */
const day = (n: number, h = 18, m = 0) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h, m).getTime(); };
const DB = 'Bench Press (hantle)';
const byId = (id: string) => store.getState().workouts.find(w => w.id === id)!;
const committed = (r: { w: Workout } | { error: string }) => { if ('error' in r) throw new Error(r.error); return r.w; };
const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };
const snapshot = () => JSON.parse(JSON.stringify(store.getState()));
/** „Poprzednio” wg przyrządu bloku (decyzja 8c, 03.10.2026 — zastąpiła 8a „najpierw to samo miejsce”). */
const prevW = (exId: string, impl?: Impl) => store.previousBlockFor(exId, 0, 1, undefined, null, impl)?.sets.map(s => s.weight);

/** Dom użytkownika (hantle 2–24 kg co 2, ławka, drążek) jako miejsce główne + siłownia. Historia hantli: dom 20 kg (10 dni temu),
 * siłownia 32 kg (6 dni temu), dom 24 kg (2 dni temu). */
function placesAndHistory() {
  const s = store.getState().settings; const home = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); s.locations.push(home); s.mainLocationId = home.id;
  const gym = L.addLocation('gym', 'Siłownia');
  const h1 = addWorkout(day(10), [[DB, [{ weight: 20, reps: 8 }]]], 'Dom A'); h1.locationId = home.id;
  const g = addWorkout(day(6), [[DB, [{ weight: 32, reps: 8 }]], ['Leg Press', [{ weight: 140, reps: 10 }]]], 'Siłownia'); g.locationId = gym.id;
  const h2 = addWorkout(day(2), [[DB, [{ weight: 24, reps: 8 }]]], 'Dom B'); h2.locationId = home.id;
  store.save(); return { home: home.id, gym: gym.id, h1, g, h2 };
}
const homeTpl = (home: string) => { const tpl = store.newTemplate(); tpl.name = 'Dom'; tpl.locationId = home;
  tpl.items.push({ id: 'i1', exerciseId: ex(DB).id, sets: 2, repMin: 6, repMax: 8, restSec: null, startWeight: 10, targetSec: '', groupId: null }); store.save(tpl); return tpl; };

describe('(1) edycja treningu z miejscem', () => {
  test('miejsce zostaje po zapisie; „Poprzednio” (8c), wstępne wartości i rekordy liczą się od nowa', async () => {
    await fresh(); const { home, gym, h2, g } = placesAndHistory(); const db = ex(DB);
    expect(prevW(db.id, 'dumbbell')).toEqual([24]); expect(prevW(db.id)).toEqual([24]); expect(recordsFor(db).maxLoad).toBe(32);
    const d = edit.beginEdit(h2.id)!; expect(d.w.locationId).toBe(home); d.w.exercises[0].sets[0].weight = 22; d.w.note = 'poprawka'; edit.touchDraft();
    expect(prevW(db.id, 'dumbbell')).toEqual([24]); // szkic poza historią (cache nietknięty)
    committed(edit.commitDraft(d.key));
    expect(byId(h2.id).locationId).toBe(home); expect(byId(h2.id).note).toBe('poprawka');
    expect(prevW(db.id, 'dumbbell')).toEqual([22]); expect(prevW(db.id, 'electric')).toEqual([22]) /* stare bloki bez przyrządu pasują do każdego */; expect(prevW(db.id)).toEqual([22]);
    const tpl = homeTpl(home); store.startFromTemplate(tpl); expect(store.getState().active!.locationId).toBe(home);
    expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([22, 22]); store.cancelWorkout();
    /* rekord: siłownia 32 → 40 po edycji, potem domowy 22 → 42 jest nowym rekordem (PR w treningu domowym, nie w siłowni) */
    const d2 = edit.beginEdit(g.id)!; d2.w.exercises[0].sets[0].weight = 40; committed(edit.commitDraft(d2.key));
    expect(byId(g.id).locationId).toBe(gym); expect(recordsFor(db).maxLoad).toBe(40); expect(prevW(db.id, 'dumbbell')).toEqual([22]); // najnowsza sesja to wciąż dom (2 dni temu)
    const d3 = edit.beginEdit(h2.id)!; d3.w.exercises[0].sets[0].weight = 42; committed(edit.commitDraft(d3.key));
    expect(recordsFor(db).maxLoad).toBe(42); expect(prMap(byId(h2.id)).size).toBe(1); expect(prMap(byId(g.id)).size).toBe(1);
  });

  test('przesunięcie daty treningu z miejscem zmienia kolejność w historii tego miejsca', async () => {
    await fresh(); const { home, h1 } = placesAndHistory(); const db = ex(DB);
    const d = edit.beginEdit(h1.id)!; d.date = edit.dateText(day(1)); committed(edit.commitDraft(d.key));
    expect(byId(h1.id).locationId).toBe(home); expect(byId(h1.id).startedAt).toBe(day(1)); expect(prevW(db.id, 'dumbbell')).toEqual([20]);
  });

  test('ćwiczenie dodane w edytorze: sesja sprzed daty TYM SAMYM PRZYRZĄDEM, gdziekolwiek (decyzja 8c); ciężar spoza listy domu — pusto (M3)', async () => {
    await fresh(); const { home, gym, h2 } = placesAndHistory(); const db = ex(DB);
    const d = edit.beginEdit(h2.id)!; edit.draftAddExercise(d.key, db); expect(d.w.exercises[1].impl).toBe('dumbbell');
    /* przed 2 dniami: najnowsza jest siłownia (6 dni temu, 32 kg) — miejsce nie ma znaczenia; w domu 32 kg nie ma → ciężar i powtórzenia puste */
    expect(d.w.exercises[1].sets.map(s => [s.weight, s.reps])).toEqual([['', '']]); expect(d.w.locationId).toBe(home);
    expect(store.previousBlockBefore(db.id, day(2), 0, 1, undefined, null, h2.id, 'dumbbell')!.workout.locationId).toBe(gym);
    expect(store.previousBlockBefore(db.id, day(2), 0, 1, undefined, null, h2.id)!.sets[0].weight).toBe(32); // bez przyrządu — jak dotąd
    d.w.exercises[1].sets[0].weight = 20; d.w.exercises[1].sets[0].reps = 8;
    committed(edit.commitDraft(d.key)); expect(byId(h2.id).locationId).toBe(home);
  });

  test('najnowsza sesja sprzed daty z innego miejsca (8c): ciężar z listy domu — wstawiany; spoza listy — pusty razem z powtórzeniami', async () => {
    await fresh(); const { home, gym } = placesAndHistory(); const db = ex(DB);
    const g0 = addWorkout(day(14), [[DB, [{ weight: 32, reps: 6 }, { weight: 20, reps: 10 }]]], 'Siłownia 0'); g0.locationId = gym;
    const w0 = addWorkout(day(12), [['Pull Up', [{ reps: 8 }]]], 'Dom 0'); w0.locationId = home; store.save();
    const d = edit.beginEdit(w0.id)!; edit.draftAddExercise(d.key, db);
    expect(d.w.exercises[1].sets.map(s => [s.weight, s.reps])).toEqual([[20, 10]]); // ostatnia seria robocza (20 kg) jest w domu — przepisana
    g0.exercises[0].sets.reverse(); store.save(); edit.draftAddExercise(d.key, db); // teraz ostatnia seria to 32 kg (poza listą w domu)
    expect(d.w.exercises[2].sets.map(s => [s.weight, s.reps])).toEqual([['', '']]); // nigdy „ciężar pusty + powtórzenia”
    /* szablon (pozycja z dolną granicą powtórzeń) — też bez samych powtórzeń */
    const tpl = homeTpl(home); const p = edit.beginPast(tpl.id, day(13), day(13) + 3600e3); expect(p.w.locationId).toBe(home);
    expect(p.w.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[20, 10], ['', '']]); // seria 1: 20×10 (jest na liście), seria 2: 32 → puste (bez dolnej granicy powtórzeń)
    edit.draftSetWhen(p.key, { date: edit.dateText(day(1)) }); expect(p.w.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[24, 8], [24, 8]]); // przed 1 dniem: dom 24
    edit.draftSetWhen(p.key, { date: edit.dateText(day(15)) }); expect(p.w.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[10, 6], [10, 6]]); // nic wcześniej: ciężar startowy szablonu
  });

  test('trening bez miejsca (sprzed miejsc) przy istniejących miejscach: cała historia, bez wstrzymywania ciężarów', async () => {
    await fresh(); placesAndHistory(); const db = ex(DB);
    const old = addWorkout(day(4), [['Pull Up', [{ reps: 8 }]]], 'Stary'); store.save();
    const d = edit.beginEdit(old.id)!; expect(d.w.locationId).toBeUndefined(); edit.draftAddExercise(d.key, db);
    expect(d.w.exercises[1].sets.map(s => [s.weight, s.reps])).toEqual([[32, 8]]);
  });

  test('ekran edycji: zapis treningu z miejscem zostawia miejsce (UI)', async () => {
    await fresh(); const { home, h2 } = placesAndHistory(); await renderApp({ saved: snapshot() });
    await go(`/history/${h2.id}`); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20);
    expect(screen.getByText('📍 Dom')).toBeTruthy(); // miejsce tylko do odczytu
    await type(screen.getAllByLabelText(/^kg/)[0], '22'); await tap(screen.getByText('Zapisz')); await flushAll(50);
    expect(byId(h2.id).locationId).toBe(home); expect(byId(h2.id).exercises[0].sets[0].weight).toBe(22); expect(prevW(ex(DB).id, 'dumbbell')).toEqual([22]);
  });
});

describe('(2) trening wstecz przy istniejących miejscach', () => {
  test('trening wstecz dostaje miejsce szablonu (inaczej główne) i przyrząd bloku; wartości z ostatniej sesji PRZED datą tym przyrządem, gdziekolwiek (8c)', async () => {
    await fresh(); const { home, gym } = placesAndHistory(); const db = ex(DB); const tpl = homeTpl(home);
    const d = edit.beginPast(tpl.id, day(4), day(4) + 3600e3); expect(d.w.exercises[0].impl).toBe('dumbbell');
    expect(d.w.locationId).toBe(home); expect(d.w.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([['', ''], ['', '']]); // siłownia 6 dni temu (32 kg — w domu poza listą), nie starszy dom
    edit.draftSetWhen(d.key, { date: edit.dateText(day(1)) }); expect(d.w.exercises[0].sets.map(s => s.weight)).toEqual([24, 24]); // przed 1 dniem: dom 2 dni temu
    edit.draftSetWhen(d.key, { date: edit.dateText(day(8)) }); expect(d.w.exercises[0].sets.map(s => s.weight)).toEqual([20, 20]); // przed 8 dniem: dom 10 dni temu
    const w = committed(edit.commitDraft(d.key)); expect(byId(w.id).locationId).toBe(home); expect(byId(w.id).exercises[0].impl).toBe('dumbbell');
    expect(prevW(db.id, 'dumbbell')).toEqual([24]); // najnowszy: dom 2 dni temu
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([24, 24]); store.cancelWorkout();
    expect(edit.beginPast(null, day(3), day(3) + 3600e3).w.locationId).toBe(home); // pusty trening — miejsce główne
    const gt = store.newTemplate(); gt.name = 'G'; gt.locationId = gym; gt.items.push({ id: 'g1', exerciseId: db.id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(gt);
    const dg = edit.beginPast(gt.id, day(3), day(3) + 3600e3); expect(dg.w.locationId).toBe(gym); expect(dg.w.exercises[0].sets.map(s => s.weight)).toEqual([32]);
    L.deleteLocation(gym); expect(edit.beginPast(gt.id, day(3), day(3) + 3600e3).w.locationId).toBe(home); // miejsce szablonu usunięte — główne
  });

  test('miejsce bez historii ćwiczenia: trening wstecz z szablonu dostaje to miejsce i od razu jest jego „Poprzednio”', async () => {
    await fresh(); const s = store.getState().settings; s.locations.push(userHome([10, 20])); s.mainLocationId = 'home'; store.save();
    const tpl = homeTpl('home'); const d = edit.beginPast(tpl.id, day(3), day(3) + 3600e3); d.w.exercises[0].sets.forEach(x => { x.weight = 18; x.reps = 8; });
    const w = committed(edit.commitDraft(d.key)); expect(w.locationId).toBe('home'); expect(prevW(ex(DB).id, 'dumbbell')).toEqual([18, 18]);
  });

  test('ekran: + Dodaj trening wstecz z szablonem z miejscem — „📍 Dom”, wartości sprzed daty (8c), zapis z miejscem (UI)', async () => {
    await fresh(); const { home } = placesAndHistory(); homeTpl(home); await renderApp({ saved: snapshot() });
    await go('/history'); await flushAll(20); await tap(screen.getByText('+ Dodaj trening wstecz')); await flushAll(20);
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), edit.dateText(day(8))); await flushAll(800); await tap(screen.getByText('Dom')); await flushAll(50);
    expect(screen.getByText('📍 Dom')).toBeTruthy(); expect(screen.getAllByLabelText(/^kg/)[0].props.value).toBe('20');
    await tap(screen.getByText('Zapisz')); await flushAll(50);
    const w = store.getState().workouts.find(x => x.templateName === 'Dom')!; expect(w.startedAt).toBe(day(8)); expect(w.locationId).toBe(home);
  });
});

describe('(3) wybór ćwiczenia w edytorze (target edit:<klucz>)', () => {
  test('edycja treningu z miejscem: filtr po miejscu tego treningu (jak trening w toku), wybór trafia do szkicu', async () => {
    await fresh(); const { h2 } = placesAndHistory(); await renderApp({ saved: snapshot() });
    await go(`/history/${h2.id}`); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20);
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(20);
    expect(screen.getByText(/tylko dostępne w: Dom/)).toBeTruthy(); expect(screen.queryByText('Leg Press')).toBeNull();
    await tap(screen.getByText('Pull Up')); await flushAll(20);
    expect(edit.draftOf(h2.id)!.w.exercises.map(e => e.exerciseId)).toEqual([ex(DB).id, ex('Pull Up').id]);
    expect(store.getState().settings.pickerShowAll).toBe(false); // sam wybór nie zmienia ustawienia filtra
  });

  test('trening wstecz (miejsce główne) — filtr jak w edycji; trening z usuniętym miejscem — pełna lista bez przełącznika', async () => {
    await fresh(); const { h1 } = placesAndHistory(); h1.locationId = 'usuniete'; store.save();
    const d = edit.beginPast(null, day(3), day(3) + 3600e3); await renderApp({ saved: snapshot() });
    await go(`/picker?target=${encodeURIComponent('edit:' + d.key)}`); await flushAll(20);
    expect(screen.getByText(/tylko dostępne w: Dom/)).toBeTruthy(); expect(screen.queryByText('Leg Press')).toBeNull();
    await tap(screen.getByText('Pull Up')); await flushAll(20); expect(edit.draftOf(d.key)!.w.exercises).toHaveLength(1);
    const d2 = edit.beginEdit(h1.id)!; await go(`/picker?target=${encodeURIComponent('edit:' + d2.key)}`); await flushAll(20);
    expect(screen.queryByLabelText('Pokaż wszystkie')).toBeNull(); expect(screen.getByText('Leg Press')).toBeTruthy();
  });

  test('ekran edycji treningu z usuniętym miejscem: „📍 (usunięte miejsce)”; trening bez miejsca — bez wiersza miejsca (UI)', async () => {
    await fresh(); const { h1, h2 } = placesAndHistory(); h1.locationId = 'usuniete'; delete h2.locationId; store.save(); await renderApp({ saved: snapshot() });
    await go(`/history/edit/${h1.id}`); await flushAll(20); expect(screen.getByText('📍 (usunięte miejsce)')).toBeTruthy();
    await go(`/history/edit/${h2.id}`); await flushAll(20); expect(screen.queryByText(/^📍/)).toBeNull();
  });

  test('nieistniejący szkic: pełna lista, wybór nic nie psuje', async () => {
    await fresh(); placesAndHistory(); await renderApp({ saved: snapshot() }); const n = store.getState().workouts.length;
    await go(`/picker?target=${encodeURIComponent('edit:brak')}`); await flushAll(20); expect(screen.getByText('Leg Press')).toBeTruthy();
    await tap(screen.getByText('Leg Press')); await flushAll(20); expect(store.getState().workouts).toHaveLength(n);
  });
});

describe('(4) migracja i eksport/import z danymi obu funkcji', () => {
  async function bothFeatures() {
    await fresh(); const r = placesAndHistory(); const tpl = homeTpl(r.home);
    const d = edit.beginEdit(r.h2.id)!; d.w.exercises[0].sets[0].weight = 22; d.date = edit.dateText(day(3)); committed(edit.commitDraft(d.key));
    const p = edit.beginPast(tpl.id, day(8), day(8) + 1800e3); const past = committed(edit.commitDraft(p.key)); /* przed 8 dniem: dom 10 dni temu (20 kg) */
    store.startFromTemplate(tpl); store.toggleDone(0, 0); await store.flush(); return { ...r, past };
  }

  test('migrate jest idempotentne (także przez JSON) i nie gubi miejsc treningów edytowanych ani treningu wstecz', async () => {
    const { home, h2, past } = await bothFeatures();
    const a = strip(store.migrate(snapshot())); const b = strip(store.migrate(JSON.parse(JSON.stringify(a))));
    expect(b).toEqual(a); expect(a).toEqual(strip(store.getState()));
    expect(a.workouts.find((w: Workout) => w.id === h2.id).locationId).toBe(home); expect(a.workouts.find((w: Workout) => w.id === past.id).locationId).toBe(home);
    expect(a.active.locationId).toBe(home); expect(a.settings.locations).toHaveLength(2);
    expect(a.active.exercises[0].impl).toBe('dumbbell'); expect(a.workouts.find((w: Workout) => w.id === past.id).exercises[0].impl).toBe('dumbbell'); // schemat 15: przyrząd bloku zostaje
  });

  test('eksport → import i restart odtwarzają stan 1:1 (miejsca, sprzęt, edycje, trening wstecz, trening w toku); „Poprzednio” bez zmian', async () => {
    const { home, gym, h2, past } = await bothFeatures(); const db = ex(DB).id;
    const before = strip(store.getState()); const prev = [prevW(db, 'dumbbell'), prevW(db, 'electric'), prevW(db)]; void home; void gym;
    store.replaceState(parseBackup(JSON.stringify(buildBackup())));
    expect(strip(store.getState())).toEqual(before); expect([prevW(db, 'dumbbell'), prevW(db, 'electric'), prevW(db)]).toEqual(prev);
    await store.flush(); const st = await fresh(global.__kv.get('state')!);
    expect(strip(st)).toEqual(before); expect(st.workouts.find(w => w.id === h2.id)!.locationId).toBe(home); expect(st.workouts.find(w => w.id === past.id)!.locationId).toBe(home);
    expect([prevW(db, 'dumbbell'), prevW(db, 'electric'), prevW(db)]).toEqual(prev);
  });
});

describe('(5) bez miejsc — jak przed integracją; repeatLast z treningiem bez miejsca', () => {
  test('ZERO miejsc: previousBlockBefore/For z przyrządem = bez niego (zachowanie sprzed zmiany), bloki bez przyrządu, trening wstecz bez miejsca', async () => {
    await fresh(); const db = ex(DB);
    /* treningi z locationId i przyrządem (np. miejsca usunięte) — przy zerze miejsc przyrząd niczego nie zmienia */
    const a = addWorkout(day(10), [[DB, [{ weight: 20, reps: 8 }]], [DB, [{ weight: 12, reps: 12 }]]], 'A'); a.locationId = 'home'; a.exercises[0].impl = 'dumbbell';
    const b = addWorkout(day(6), [[DB, [{ weight: 32, reps: 8 }]]], 'B'); b.locationId = 'gym'; b.exercises[0].impl = 'electric';
    const c = addWorkout(day(2), [[DB, [{ weight: 24, reps: 8 }]]], 'C'); c.locationId = 'home'; store.save();
    expect(store.getState().settings.locations).toHaveLength(0);
    for (const before of [day(1), day(2), day(4), day(8), day(11), Infinity]) for (const [k, n] of [[0, 1], [0, 2], [1, 2]]) for (const ex0 of [null, c.id]) for (const impl of ['dumbbell', 'electric', 'cable'] as const) {
      expect(store.previousBlockBefore(db.id, before, k, n, undefined, null, ex0, impl)).toEqual(store.previousBlockBefore(db.id, before, k, n, undefined, null, ex0));
      if (before === Infinity && !ex0) expect(store.previousBlockFor(db.id, k, n, undefined, null, impl)).toBe(store.previousBlockFor(db.id, k, n)); /* ten sam obiekt z tego samego cache */ }
    expect(store.previousBlockBefore(db.id, day(2), 0, 1, undefined, null, null, 'dumbbell')!.sets.map(s => s.weight)).toEqual([32]); // bez preferencji przyrządu
    const d = edit.beginPast(null, day(4), day(4) + 3600e3); expect('locationId' in d.w).toBe(false);
    edit.draftAddExercise(d.key, db); expect(d.w.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[32, 8]]);
    const e = edit.beginEdit(c.id)!; edit.draftAddExercise(e.key, db); expect(e.w.exercises[1].sets.map(s => [s.weight, s.reps])).toEqual([[32, 8]]); // bez miejsc: bez 8c i bez wstrzymywania
    expect([d.w.exercises[0], e.w.exercises[1]].some(x => 'impl' in x)).toBe(false); // nowe bloki bez pola impl (dane jak przed schematem 15)
  });

  test('repeatLast: najnowszy trening bez miejsca przy istniejących miejscach — „nieznane miejsce”: miejsce główne, wartości bez wstrzymywania', async () => {
    await fresh(); const { home, gym } = placesAndHistory();
    addWorkout(day(1), [[DB, [{ weight: 32, reps: 8 }]]], 'Bez miejsca'); store.save();
    store.repeatLast(); const a = store.getState().active!; expect(a.locationId).toBe(home);
    expect(a.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[32, 8]]); store.cancelWorkout();
    const g = addWorkout(day(0, 0, 5), [[DB, [{ weight: 32, reps: 8 }]]], 'Siłownia 2'); g.locationId = gym; store.save(); // dla porównania: najnowszy z miejscem — powtórzenie w tym samym miejscu, wartości 1:1
    store.repeatLast(); const a2 = store.getState().active!; expect(a2.locationId).toBe(gym); expect(a2.exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([[32, 8]]); store.cancelWorkout();
  });
});

describe('(6) wstrzymywanie ciężaru spoza listy w edytorze (weryfikacja integracji: LOW1, LOW2)', () => {
  const pair = (s: { weight: unknown; reps: unknown }) => [s.weight, s.reps];

  test('LOW1: wstrzymanie dotyczy tylko pól wypełnianych przez aplikację — wpisane ręcznie zostają; seria bez ciężaru zapisuje się z ostrzeżeniem', async () => {
    await fresh(); const { gym } = placesAndHistory(); const db = ex(DB);
    const g0 = addWorkout(day(14), [[DB, [{ weight: 32, reps: 6 }]]], 'Siłownia 0'); g0.locationId = gym; store.save();
    /* przed 8 dniem: dom 10 dni temu (20 × 8); przed 12 dniem: najnowsza siłownia 14 dni temu (32 kg, w domu poza listą) — 8c: miejsce bez znaczenia */
    const a = edit.beginPast(null, day(8), day(8) + 3600e3); edit.draftAddExercise(a.key, db); const sa = a.w.exercises[0].sets[0];
    expect(pair(sa)).toEqual([20, 8]);
    sa.reps = 12; edit.draftSetWhen(a.key, { date: edit.dateText(day(12)) });
    expect(pair(sa)).toEqual(['', 12]); // A: ciężar (wstawiany) wstrzymany, powtórzenia użytkownika zostają
    expect(edit.checkDraft(a.key)).toMatchObject({ dropped: 0, noWeight: 1, empty: false }); // seria zostaje — z ostrzeżeniem „Serie bez ciężaru”
    edit.draftSetWhen(a.key, { date: edit.dateText(day(8)) }); expect(pair(sa)).toEqual([20, 12]); // pole ciężaru wciąż „z aplikacji” — wraca
    edit.draftSetWhen(a.key, { date: edit.dateText(day(12)) }); expect(pair(sa)).toEqual(['', 12]);
    const b = edit.beginPast(null, day(8), day(8) + 3600e3); edit.draftAddExercise(b.key, db); const sb = b.w.exercises[0].sets[0];
    sb.weight = 18; edit.draftSetWhen(b.key, { date: edit.dateText(day(12)) });
    expect(pair(sb)).toEqual([18, 6]); // B: ciężar użytkownika (jest na liście) — nic nie wstrzymujemy, powtórzenia ze źródła
    expect(edit.checkDraft(b.key)).toMatchObject({ dropped: 0, noWeight: 0 });
    const c = edit.beginPast(null, day(8), day(8) + 3600e3); edit.draftAddExercise(c.key, db); edit.draftSetWhen(c.key, { date: edit.dateText(day(12)) });
    expect(pair(c.w.exercises[0].sets[0])).toEqual(['', '']); // nic nie wpisano — jak dotąd: puste oba (nigdy „ciężar pusty + powtórzenia”)
    expect(edit.checkDraft(c.key)).toMatchObject({ dropped: 1, noWeight: 0, empty: true });
    const w = committed(edit.commitDraft(a.key)); expect(pair(w.exercises[0].sets[0])).toEqual(['', 12]); // zapis nie gubi serii
  });

  test('LOW1 (UI): edytor ostrzega „Serie bez ciężaru: n.” przed zapisem i zapisuje serię po potwierdzeniu', async () => {
    await fresh(); const { h2 } = placesAndHistory(); await renderApp({ saved: snapshot() });
    await go(`/history/edit/${h2.id}`); await flushAll(20); await type(screen.getAllByLabelText(/^kg/)[0], ''); await tap(screen.getByText('Zapisz')); await flushAll(20);
    const al = global.__alerts[global.__alerts.length - 1]; expect(al).toMatchObject({ title: 'Zapisać zmiany?', msg: 'Serie bez ciężaru: 1.' });
    expect(byId(h2.id).exercises[0].sets[0].weight).toBe(24); // przed potwierdzeniem nic nie zapisano
    await act(async () => { pressAlert('Zapisać zmiany?', 'Zapisz'); }); await flushAll(50);
    expect(byId(h2.id).exercises[0].sets.map(s => [s.weight, s.reps])).toEqual([['', 8]]);
  });

  test('LOW2: sesja w innym miejscu z samymi drop setami nie wstrzymuje ciężaru startowego szablonu — jak startFromTemplate', async () => {
    await fresh(); const s = store.getState().settings; const home = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); s.locations.push(home); s.mainLocationId = home.id;
    const gym = L.addLocation('gym', 'Siłownia'); const g = addWorkout(day(6), [[DB, [{ weight: 40, reps: 8, kind: 'drop' }]]], 'Siłownia'); g.locationId = gym.id; store.save();
    const tpl = store.newTemplate(); tpl.name = 'Dom'; tpl.locationId = home.id; /* 25 kg — poza listą domu (co 2 kg) */
    tpl.items.push({ id: 'i1', exerciseId: ex(DB).id, sets: 1, repMin: null, repMax: null, restSec: null, startWeight: 25, targetSec: '', groupId: null }); store.save(tpl);
    store.startFromTemplate(tpl); const fromTpl = store.getState().active!.exercises[0].sets.map(pair); store.cancelWorkout();
    expect(fromTpl).toEqual([[25, '']]);
    const p = edit.beginPast(tpl.id, day(3), day(3) + 3600e3); expect(p.w.exercises[0].sets.map(pair)).toEqual(fromTpl);
    tpl.items[0].repMin = 6; store.save(tpl); /* trening wstecz wstawia dolną granicę powtórzeń (docs/12) — ciężar startowy nadal nie jest wstrzymany */
    expect(edit.beginPast(tpl.id, day(3), day(3) + 3600e3).w.exercises[0].sets.map(pair)).toEqual([[25, 6]]);
    const p2 = edit.beginPast(tpl.id, day(8), day(8) + 3600e3); edit.draftSetWhen(p2.key, { date: edit.dateText(day(3)) }); expect(p2.w.exercises[0].sets.map(pair)).toEqual([[25, 6]]); // po zmianie daty też
  });
});
