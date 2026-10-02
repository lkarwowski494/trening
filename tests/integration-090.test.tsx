/* Integracja 0.9.0: edycja treningów z historii i trening wstecz (docs/12) RAZEM z miejscami treningu (P-003 E1, docs/10).
 * Interakcje funkcji: edycja treningu z miejscem, trening wstecz przy istniejących miejscach, wybór ćwiczenia w edytorze
 * (target 'edit:<klucz>'), migracja i eksport/import z danymi obu funkcji. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import * as L from '@/lib/locations';
import { prMap, recordsFor } from '@/lib/stats';
import { buildBackup, parseBackup } from '@/lib/backup';
import type { Workout } from '@/lib/seed';
import { fresh, ex, addWorkout } from './helpers';
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
const prevW = (exId: string, loc?: string) => store.previousBlockFor(exId, 0, 1, undefined, null, loc)?.sets.map(s => s.weight);

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
  test('miejsce zostaje po zapisie; „Poprzednio” i wstępne wartości tego miejsca oraz rekordy liczą się od nowa', async () => {
    await fresh(); const { home, gym, h2, g } = placesAndHistory(); const db = ex(DB);
    expect(prevW(db.id, home)).toEqual([24]); expect(prevW(db.id, gym)).toEqual([32]); expect(recordsFor(db).maxLoad).toBe(32);
    const d = edit.beginEdit(h2.id)!; expect(d.w.locationId).toBe(home); d.w.exercises[0].sets[0].weight = 22; d.w.note = 'poprawka'; edit.touchDraft();
    expect(prevW(db.id, home)).toEqual([24]); // szkic poza historią (cache miejsca nietknięty)
    committed(edit.commitDraft(d.key));
    expect(byId(h2.id).locationId).toBe(home); expect(byId(h2.id).note).toBe('poprawka');
    expect(prevW(db.id, home)).toEqual([22]); expect(prevW(db.id, gym)).toEqual([32]); expect(prevW(db.id)).toEqual([22]);
    const tpl = homeTpl(home); store.startFromTemplate(tpl); expect(store.getState().active!.locationId).toBe(home);
    expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([22, 22]); store.cancelWorkout();
    /* rekord: siłownia 32 → 40 po edycji, potem domowy 22 → 42 jest nowym rekordem (PR w treningu domowym, nie w siłowni) */
    const d2 = edit.beginEdit(g.id)!; d2.w.exercises[0].sets[0].weight = 40; committed(edit.commitDraft(d2.key));
    expect(byId(g.id).locationId).toBe(gym); expect(recordsFor(db).maxLoad).toBe(40); expect(prevW(db.id, gym)).toEqual([40]);
    const d3 = edit.beginEdit(h2.id)!; d3.w.exercises[0].sets[0].weight = 42; committed(edit.commitDraft(d3.key));
    expect(recordsFor(db).maxLoad).toBe(42); expect(prMap(byId(h2.id)).size).toBe(1); expect(prMap(byId(g.id)).size).toBe(1);
  });

  test('przesunięcie daty treningu z miejscem zmienia kolejność w historii tego miejsca', async () => {
    await fresh(); const { home, h1 } = placesAndHistory(); const db = ex(DB);
    const d = edit.beginEdit(h1.id)!; d.date = edit.dateText(day(1)); committed(edit.commitDraft(d.key));
    expect(byId(h1.id).locationId).toBe(home); expect(byId(h1.id).startedAt).toBe(day(1)); expect(prevW(db.id, home)).toEqual([20]);
  });

  test('znane ograniczenie: ćwiczenie dodane w edytorze bierze wartości sprzed daty BEZ preferencji miejsca (previousBlockBefore)', async () => {
    await fresh(); const { home, h2 } = placesAndHistory(); const db = ex(DB);
    const d = edit.beginEdit(h2.id)!; edit.draftAddExercise(d.key, db);
    /* przed 2 dniami: siłownia (6 dni temu, 32 kg) jest nowsza niż ostatni dom (10 dni temu, 20 kg); z preferencją miejsca byłoby 20 */
    expect(d.w.exercises[1].sets[0].weight).toBe(32); expect(d.w.locationId).toBe(home);
    committed(edit.commitDraft(d.key)); expect(byId(h2.id).locationId).toBe(home);
  });

  test('ekran edycji: zapis treningu z miejscem zostawia miejsce (UI)', async () => {
    await fresh(); const { home, h2 } = placesAndHistory(); await renderApp({ saved: snapshot() });
    await go(`/history/${h2.id}`); await flushAll(20); await tap(screen.getByText('Edytuj')); await flushAll(20);
    await type(screen.getAllByLabelText(/^kg/)[0], '22'); await tap(screen.getByText('Zapisz')); await flushAll(50);
    expect(byId(h2.id).locationId).toBe(home); expect(byId(h2.id).exercises[0].sets[0].weight).toBe(22); expect(prevW(ex(DB).id, home)).toEqual([22]);
  });
});

describe('(2) trening wstecz przy istniejących miejscach', () => {
  test('bez awarii; wartości z ostatniej sesji PRZED datą (z dowolnego miejsca); zapisany bez miejsca, więc nie zmienia „Poprzednio” miejsc', async () => {
    await fresh(); const { home, gym } = placesAndHistory(); const db = ex(DB); const tpl = homeTpl(home);
    const d = edit.beginPast(tpl.id, day(4), day(4) + 3600e3);
    expect(d.w.locationId).toBeUndefined(); expect(d.w.exercises[0].sets.map(s => s.weight)).toEqual([32, 32]); // siłownia 6 dni temu, nie dom 10 dni temu
    edit.draftSetWhen(d.key, { date: edit.dateText(day(8)) }); expect(d.w.exercises[0].sets.map(s => s.weight)).toEqual([20, 20]); // przed 8 dniami: tylko dom 10 dni temu
    const w = committed(edit.commitDraft(d.key)); expect('locationId' in byId(w.id)).toBe(false);
    expect(prevW(db.id, home)).toEqual([24]); expect(prevW(db.id, gym)).toEqual([32]);
    store.startFromTemplate(tpl); expect(store.getState().active!.exercises[0].sets.map(s => s.weight)).toEqual([24, 24]); store.cancelWorkout();
  });

  test('miejsce bez historii ćwiczenia: fallback „gdziekolwiek” widzi też trening wstecz bez miejsca', async () => {
    await fresh(); const s = store.getState().settings; s.locations.push(userHome([10, 20])); s.mainLocationId = 'home'; store.save();
    const tpl = homeTpl('home'); const d = edit.beginPast(tpl.id, day(3), day(3) + 3600e3); d.w.exercises[0].sets.forEach(x => { x.weight = 18; x.reps = 8; });
    committed(edit.commitDraft(d.key)); expect(prevW(ex(DB).id, 'home')).toEqual([18, 18]);
  });

  test('ekran: + Dodaj trening wstecz z szablonem z miejscem — edytor z wartościami sprzed daty, zapis bez miejsca (UI)', async () => {
    await fresh(); const { home } = placesAndHistory(); homeTpl(home); await renderApp({ saved: snapshot() });
    await go('/history'); await flushAll(20); await tap(screen.getByText('+ Dodaj trening wstecz')); await flushAll(20);
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), edit.dateText(day(4))); await flushAll(800); await tap(screen.getByText('Dom')); await flushAll(50);
    expect(screen.getAllByLabelText(/^kg/)[0].props.value).toBe('32');
    await tap(screen.getByText('Zapisz')); await flushAll(50);
    const w = store.getState().workouts.find(x => x.templateName === 'Dom')!; expect(w.startedAt).toBe(day(4)); expect('locationId' in w).toBe(false);
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

  test('trening wstecz (bez miejsca) i trening z usuniętym miejscem: pełna lista bez przełącznika', async () => {
    await fresh(); const { h1 } = placesAndHistory(); h1.locationId = 'usuniete'; store.save();
    const d = edit.beginPast(null, day(3), day(3) + 3600e3); await renderApp({ saved: snapshot() });
    await go(`/picker?target=${encodeURIComponent('edit:' + d.key)}`); await flushAll(20);
    expect(screen.queryByLabelText('Pokaż wszystkie')).toBeNull(); expect(screen.getByText('Leg Press')).toBeTruthy(); expect(screen.queryAllByText(/brak:/)).toHaveLength(0);
    await tap(screen.getByText('Leg Press')); await flushAll(20); expect(edit.draftOf(d.key)!.w.exercises).toHaveLength(1);
    const d2 = edit.beginEdit(h1.id)!; await go(`/picker?target=${encodeURIComponent('edit:' + d2.key)}`); await flushAll(20);
    expect(screen.queryByLabelText('Pokaż wszystkie')).toBeNull(); expect(screen.getByText('Leg Press')).toBeTruthy();
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
    const p = edit.beginPast(tpl.id, day(5), day(5) + 1800e3); const past = committed(edit.commitDraft(p.key));
    store.startFromTemplate(tpl); store.toggleDone(0, 0); await store.flush(); return { ...r, past };
  }

  test('migrate jest idempotentne (także przez JSON) i nie gubi miejsc treningów edytowanych ani braku miejsca w treningu wstecz', async () => {
    const { home, h2, past } = await bothFeatures();
    const a = strip(store.migrate(snapshot())); const b = strip(store.migrate(JSON.parse(JSON.stringify(a))));
    expect(b).toEqual(a); expect(a).toEqual(strip(store.getState()));
    expect(a.workouts.find((w: Workout) => w.id === h2.id).locationId).toBe(home); expect('locationId' in a.workouts.find((w: Workout) => w.id === past.id)).toBe(false);
    expect(a.active.locationId).toBe(home); expect(a.settings.locations).toHaveLength(2);
  });

  test('eksport → import i restart odtwarzają stan 1:1 (miejsca, sprzęt, edycje, trening wstecz, trening w toku); „Poprzednio” bez zmian', async () => {
    const { home, gym, h2, past } = await bothFeatures(); const db = ex(DB).id;
    const before = strip(store.getState()); const prev = [prevW(db, home), prevW(db, gym), prevW(db)];
    store.replaceState(parseBackup(JSON.stringify(buildBackup())));
    expect(strip(store.getState())).toEqual(before); expect([prevW(db, home), prevW(db, gym), prevW(db)]).toEqual(prev);
    await store.flush(); const st = await fresh(global.__kv.get('state')!);
    expect(strip(st)).toEqual(before); expect(st.workouts.find(w => w.id === h2.id)!.locationId).toBe(home); expect('locationId' in st.workouts.find(w => w.id === past.id)!).toBe(false);
    expect([prevW(db, home), prevW(db, gym), prevW(db)]).toEqual(prev);
  });
});
