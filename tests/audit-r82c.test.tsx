/* Runda 82c — poprawki z niezależnej weryfikacji commitu 82a8a16 (docs/09, docs/10):
 *  - LOW 1: dopisek „ciężaru X nie ma tutaj” na ekranie treningu porównywał serię i tylko z i-tą serią „Poprzednio” (hintFor), a start z szablonu
 *    wstawia w serie za końcem źródła wartość jego OSTATNIEJ serii → po wpisaniu ciężaru w serie 1–2 dopisek znikał, choć serie 3–4 miały 32 kg.
 *    Jedno mapowanie serii źródła (store.srcSetAt) dla wstawiania i dopisku, na obu ekranach;
 *  - LOW 2: zmiana sprzętu miejsca treningu w toku (albo usunięcie miejsca) zostawiała blokom przyrząd, do którego miejsce już się nie rozstrzyga
 *    (listLocFor wyłączał wtedy listę) → przyrządy bloków bez odhaczonych serii od nowa (reguła L5, jak setActiveLocation);
 *  - LOW 3: tests/invariants.test.ts — licznik tylko szablonów z supersetem, start z szablonu z supersetem w każdym przebiegu (tam);
 *  - perf: pomiar wpisu w pole serii szukał etykiety „kg” i był po cichu pomijany (scripts/perf/app.perf.tsx). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import * as locs from '@/lib/locations';
import { equipEntry } from '@/lib/equipment';
import type { Impl, WSet } from '@/lib/seed';
import { fresh, ex, addWorkout } from './helpers';
import { userHome, loc, presetSpec } from './locations-fixtures';
import { renderApp, flushAll, screen, go, type, tap, act, fireEvent, expandEquip } from './app';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const day = (n: number, h = 18) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h, 0).getTime(); };
const HOME = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const DB = 'Bench Press (hantle)', RDL = 'RDL (hantle/linki)';
const NOTE = (w: string) => `ciężaru ${w} nie ma tutaj — wpisz ciężar`;
const DB_ITEM = 'Hantle (stała waga albo z szybką regulacją)';
/** Dom (hantle z listą `home` + ViShape Pro) — główne; garaż (tylko ViShape Pro). */
function places(home: number[] = HOME) {
  const s = store.getState().settings; const vs = equipEntry('electric'); vs.load = presetSpec('vishape_pro');
  s.locations.push(userHome(home), loc('Garaż', [vs], 'garage')); s.mainLocationId = 'home'; store.save();
}
const tplAt = (exName: string, locationId?: string, sets = 1) => { const t = store.newTemplate(); t.name = 'T ' + exName + (locationId ?? '-'); if (locationId) t.locationId = locationId;
  t.items.push({ id: 'i-' + exName + (locationId ?? ''), exerciseId: ex(exName).id, sets, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };
const hist = (at: number, exName: string, sets: Partial<WSet>[], locationId?: string, impl?: Impl) => { const w = addWorkout(at, [[exName, sets]]); if (locationId) w.locationId = locationId; if (impl) w.exercises[0].impl = impl; store.save(); return w; };
const vals = (sets: { weight: unknown; reps: unknown }[]) => sets.map(s => [s.weight, s.reps]);
const snapshot = () => JSON.parse(JSON.stringify(store.getState()));
const prevOf = (ei: number) => { const a = store.getState().active!; const e = a.exercises[ei];
  return store.previousBlockFor(e.exerciseId, store.occurrence(a.exercises, ei), store.occurrences(a.exercises, e.exerciseId), e.tplItemId, a.templateId, e.impl); };
/** Dopisek dla bloku treningu w toku — dokładnie jak ekran (ActiveWorkout: offListNote z „Poprzednio” i srcSetAt). */
const noteOf = (ei: number) => { const a = store.getState().active!; const p = prevOf(ei); return store.offListNote(a.exercises[ei], p, a.locationId, si => store.srcSetAt(p?.sets, si)); };
const show = async () => { await store.flush(); await renderApp({ saved: snapshot() }); await flushAll(10); };

describe('LOW 1 — dopisek i wstawianie wartości: to samo mapowanie serii źródła (srcSetAt)', () => {
  test('srcSetAt: i-ta seria bez drop setów, za końcem — ostatnia; perSet=false — zawsze ostatnia; bez źródła — null', () => {
    const s = (weight: number, kind: WSet['kind'] = 'normal') => ({ weight, kind }) as WSet;
    const src = [s(32), s(13, 'drop'), s(30)];
    expect([0, 1, 2, 3].map(i => store.srcSetAt(src, i)!.weight)).toEqual([32, 30, 30, 30]);
    expect([0, 3].map(i => store.srcSetAt(src, i, false)!.weight)).toEqual([30, 30]);
    expect([store.srcSetAt([], 0), store.srcSetAt(null, 0), store.srcSetAt([s(13, 'drop')], 0)]).toEqual([null, null, null]);
  });
  test('legacy 2×32 (sesja bez miejsca), szablon 4 serie, dom max 24: pola [32×4]; 24 w seriach 1–2 — dopisek zostaje (serie 3–4 wciąż 32); 24 wszędzie — znika', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 32, reps: 8 }, { weight: 32, reps: 8 }]); store.startFromTemplate(tplAt(DB, 'home', 4));
    const e = store.getState().active!.exercises[0]; expect(vals(e.sets)).toEqual([[32, 8], [32, 8], [32, 8], [32, 8]]); expect(noteOf(0)).toBe(32);
    e.sets[0].weight = 24; e.sets[1].weight = 24; store.save(store.getState().active);
    expect(noteOf(0)).toBe(32);
    /* kontrola: stare mapowanie (hintFor) — za końcem „Poprzednio” brak serii źródła, więc dopisek znikał */
    const p = prevOf(0); expect(store.offListNote(e, p, 'home', si => store.hintFor(p?.sets, e.sets, si, ex(DB)))).toBeNull();
    e.sets[2].weight = 24; expect(noteOf(0)).toBe(32); e.sets[3].weight = 22; expect(noteOf(0)).toBeNull();
  });
  test('ekran: wpis 24 w serie 1–2 — dopisek widoczny; w serie 3–4 — znika', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 32, reps: 8 }, { weight: 32, reps: 8 }]); store.startFromTemplate(tplAt(DB, 'home', 4)); await show();
    expect(screen.getByText(NOTE('32 kg'))).toBeTruthy();
    const f = () => screen.getAllByLabelText('kg/hantel'); expect(f()).toHaveLength(4);
    await type(f()[0], '24'); await type(f()[1], '24'); await flushAll(5); expect(screen.getByText(NOTE('32 kg'))).toBeTruthy();
    await type(f()[2], '24'); await flushAll(5); expect(screen.getByText(NOTE('32 kg'))).toBeTruthy();
    await type(f()[3], '24'); await flushAll(5); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
  test('edytor historii (trening wstecz z tego szablonu) — ta sama odpowiedź co trening na tych samych polach', async () => {
    await fresh(); places(); hist(day(5), DB, [{ weight: 32, reps: 8 }, { weight: 32, reps: 8 }]); const tpl = tplAt(DB, 'home', 4);
    const d = edit.beginPast(tpl.id, day(1), day(1) + 3600e3); const e = d.w.exercises[0];
    expect(vals(e.sets)).toEqual([[32, 8], [32, 8], [32, 8], [32, 8]]); expect(edit.prefilledOffList(d, e)).toBe(32);
    e.sets[0].weight = 24; e.sets[1].weight = 24; expect(edit.prefilledOffList(d, e)).toBe(32);
    store.startFromTemplate(tpl); const a = store.getState().active!.exercises[0]; a.sets[0].weight = 24; a.sets[1].weight = 24; expect(noteOf(0)).toBe(32);
    e.sets[2].weight = 24; e.sets[3].weight = 24; a.sets[2].weight = 24; a.sets[3].weight = 24; expect([edit.prefilledOffList(d, e), noteOf(0)]).toEqual([null, null]);
  });
  test('zwykłe serie po źródle z drop setem: drop set źródła nie przesuwa mapowania (jak start z szablonu)', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 20, reps: 8 }, { weight: 13, reps: 8, kind: 'drop' }, { weight: 32, reps: 8 }]); store.startFromTemplate(tplAt(DB, 'home', 3));
    const e = store.getState().active!.exercises[0]; expect(vals(e.sets)).toEqual([[20, 8], [32, 8], [32, 8]]); expect(noteOf(0)).toBe(32);
    e.sets[1].weight = 24; expect(noteOf(0)).toBe(32); e.sets[2].weight = 24; expect(noteOf(0)).toBeNull();
  });
  test('bez miejsc — bez dopisku (jak main)', async () => {
    await fresh(); hist(day(3), DB, [{ weight: 32, reps: 8 }, { weight: 32, reps: 8 }]); store.startFromTemplate(tplAt(DB, undefined, 4));
    const a = store.getState().active!; expect(a.locationId).toBeUndefined(); expect(a.exercises[0].impl).toBeUndefined();
    expect(vals(a.exercises[0].sets)).toEqual([[32, 8], [32, 8], [32, 8], [32, 8]]); expect(noteOf(0)).toBeNull();
  });
});

describe('LOW 2 — zmiana sprzętu miejsca w trakcie treningu: przyrząd bloków bez odhaczonych serii od nowa', () => {
  test('dom: hantle bez ciężarów + ViShape → RDL na stacji; wpis hantli 2–24 w trakcie → blok hantlami, „↑ spróbuj 22 kg” z listy, „kg/hant.”', async () => {
    await fresh(); places([]); hist(day(3), RDL, [{ weight: 20, reps: 8 }]); store.startFromTemplate(tplAt(RDL, 'home'));
    const a = store.getState().active!; const e = a.exercises[0]; expect(e.impl).toBe('electric'); expect(vals(e.sets)).toEqual([[20, 8]]);
    expect(store.loadLabelShort(ex(RDL), store.liveBlockImpl(e, a.locationId))).toBe('kg/str.');
    const home = store.locationById('home')!; locs.setLoad(home, 'db_fixed', { kind: 'list', unit: 'kg', items: HOME.map(w => ({ w, on: true })) });
    expect(e.impl).toBe('dumbbell'); expect(store.listLocFor(e, 'home')).toBe('home');
    expect(store.progressionFor(ex(RDL), e.repMax, prevOf(0)?.sets, store.listLocFor(e, 'home'))).toEqual({ kind: 'load', kg: 22 });
    expect(vals(e.sets)).toEqual([[20, 8]]); /* wpisane wartości zostają (A-002) */
    await show(); expect(screen.getByText(/↑ spróbuj 22 kg/)).toBeTruthy(); expect(screen.queryByText(/↑ spróbuj 21 kg/)).toBeNull();
    expect(screen.getByText('kg/hant.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeTruthy(); expect(screen.queryByText('kg/str.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeNull(); expect(screen.getAllByLabelText('kg/hantel')).toHaveLength(1);
  });
  test('kontrola przed poprawką: bez przeliczenia przyrządu blok na stacji wyłączał listę (21 kg, „kg/str.”)', async () => {
    await fresh(); places([]); hist(day(3), RDL, [{ weight: 20, reps: 8 }]); store.startFromTemplate(tplAt(RDL, 'home')); const e = store.getState().active!.exercises[0];
    const db = store.locationById('home')!.equipment.find(x => x.item === 'db_fixed')!; db.load = { kind: 'list', unit: 'kg', items: HOME.map(w => ({ w, on: true })) }; /* zmiana z pominięciem lib/locations */
    expect([e.impl, store.listLocFor(e, 'home')]).toEqual(['electric', undefined]);
    expect(store.progressionFor(ex(RDL), e.repMax, prevOf(0)?.sets, store.listLocFor(e, 'home'))).toEqual({ kind: 'load', kg: 21 });
  });
  test('blok z odhaczoną serią zachowuje przyrząd; nieruszony blok tego samego ćwiczenia — hantle', async () => {
    await fresh(); places([]); hist(day(3), RDL, [{ weight: 20, reps: 8 }]); store.startFromTemplate(tplAt(RDL, 'home')); store.addExerciseToActive(ex(RDL));
    const a = store.getState().active!; expect(a.exercises.map(e => e.impl)).toEqual(['electric', 'electric']); store.toggleDone(0, 0);
    locs.setLoad(store.locationById('home')!, 'db_fixed', { kind: 'list', unit: 'kg', items: HOME.map(w => ({ w, on: true })) });
    expect(a.exercises.map(e => e.impl)).toEqual(['electric', 'dumbbell']);
  });
  test('edytor ciężarów (ekran miejsca, „Wypełnij zakresem” 2–24 co 2) w trakcie treningu — ten sam efekt', async () => {
    await fresh(); places([]); store.startFromTemplate(tplAt(RDL, 'home')); expect(store.getState().active!.exercises[0].impl).toBe('electric');
    await store.flush(); await renderApp({ saved: snapshot() }); await go('/more/location/home'); await flushAll(10); await expandEquip();
    await type(screen.getAllByLabelText('od')[0], '2'); await type(screen.getAllByLabelText('do')[0], '24'); await type(screen.getAllByLabelText('co')[0], '2');
    await tap(screen.getByLabelText('Wypełnij zakresem — ' + DB_ITEM)); await flushAll(5);
    expect(store.getState().active!.exercises[0].impl).toBe('dumbbell');
    /* odznaczenie hantli — z powrotem stacja (blok wciąż bez odhaczonych serii) */
    await act(async () => { fireEvent(screen.getAllByLabelText(DB_ITEM)[0], 'valueChange', false); }); await flushAll(5); expect(store.getState().active!.exercises[0].impl).toBe('electric');
  });
  test('zmiana sprzętu INNEGO miejsca niż miejsce treningu — bez zmian; trening bez miejsca — bez zmian', async () => {
    await fresh(); places([]); store.startFromTemplate(tplAt(RDL, 'home')); const a = store.getState().active!;
    locs.setEquip(store.locationById('garage')!, 'db_fixed', true); locs.setLoad(store.locationById('garage')!, 'db_fixed', { kind: 'list', unit: 'kg', items: [{ w: 10, on: true }] });
    expect(a.exercises[0].impl).toBe('electric');
    delete a.locationId; delete a.exercises[0].impl; store.save(a);
    locs.setLoad(store.locationById('home')!, 'db_fixed', { kind: 'list', unit: 'kg', items: [{ w: 10, on: true }] }); expect(a.exercises[0].impl).toBeUndefined();
  });
  test('usunięcie miejsca treningu (garaż) w trakcie: nieruszony blok bez przyrządu, blok z odhaczoną serią — zostaje przy stacji', async () => {
    await fresh(); places(); store.startFromTemplate(tplAt(RDL, 'garage')); store.addExerciseToActive(ex(RDL)); const a = store.getState().active!;
    expect(a.exercises.map(e => e.impl)).toEqual(['electric', 'electric']); Object.assign(a.exercises[0].sets[0], { weight: 30, reps: 8 }); store.toggleDone(0, 0);
    expect(locs.deleteLocation('garage')).toBe(true);
    expect(a.exercises.map(e => e.impl)).toEqual(['electric', undefined]); expect(a.locationId).toBe('garage'); /* „(usunięte miejsce)” — jak dotąd */
    const w = store.finishWorkout()!; expect(w.exercises.map(e => e.impl)).toEqual(['electric']);
  });
  test('usunięcie ostatniego miejsca w trakcie: bloki bez odhaczonych serii bez przyrządu — dane jak w main', async () => {
    await fresh(); const vs = equipEntry('electric'); vs.load = presetSpec('vishape_pro'); const s = store.getState().settings; s.locations.push(loc('Garaż', [vs], 'garage')); s.mainLocationId = 'garage'; store.save();
    store.startFromTemplate(tplAt(RDL, 'garage')); const a = store.getState().active!; expect(a.exercises[0].impl).toBe('electric');
    expect(locs.deleteLocation('garage')).toBe(true); expect(store.getState().settings.locations).toHaveLength(0);
    expect(a.exercises[0].impl).toBeUndefined(); expect('impl' in a.exercises[0]).toBe(false);
  });
});
