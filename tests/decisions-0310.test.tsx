/* Decyzje właściciela produktu z 03.10.2026, 07:35 (docs/10, runda 81):
 *  - 7b → 7a: podpowiedź „↑” bez bramki 10% — zawsze najbliższy większy DOSTĘPNY ciężar;
 *  - 8a → 8c: „Poprzednio” = ostatni raz TYM SAMYM PRZYRZĄDEM, gdziekolwiek (WExercise.impl, schemat 15) — miejsce samo w sobie bez znaczenia;
 *  - P-004 (b): hantle wpisuje się na hantel — dane wpisuje użytkownik; decyzja z 08:11 („Nie przenoś do aplikacji żadnych moich szablonów”):
 *    świeża instalacja bez szablonów, a migracja NIE zmienia szablonów (dawne 48 → 24 usunięte), historia bez zmian;
 *  - ViShape na stronę: ciężar stacji elektrycznej zawsze na stronę. */
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import * as L from '@/lib/locations';
import { implAt, loadsFor, equipEntry } from '@/lib/equipment';
import { nextHeavier, achievable } from '@/lib/loads';
import { buildBackup, parseBackup } from '@/lib/backup';
import { EN } from '@/lib/i18n.en';
import { SCHEMA_VERSION, LIB, seedState, type Impl, type Workout } from '@/lib/seed';
import { fresh, ex, addWorkout, set, saved, withDemoTemplates } from './helpers';
import { userHome, loc, presetSpec } from './locations-fixtures';
import { renderApp, flushAll, screen, go } from './app';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const day = (n: number, h = 18) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h, 0).getTime(); };
const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.metaUpdatedAt; delete c.saveSeq; delete c.userTouched; return c; };
const HOME = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const RDL = 'RDL (hantle/linki)', TP = 'Triceps Pushdown', DB = 'Bench Press (hantle)';
/** Dom użytkownika (hantle 2–24, ViShape z ramionami — wysoki wyciąg) — główne; garaż (tylko ViShape); siłownia (preset „Pełna siłownia”). */
function places() {
  const s = store.getState().settings; const home = userHome(HOME); home.equipment.find(e => e.item === 'electric')!.opts.push('arms');
  const vs = equipEntry('electric'); vs.load = presetSpec('vishape_pro'); const garage = loc('Garaż', [vs], 'garage');
  s.locations.push(home, garage); s.mainLocationId = home.id; const gym = L.addLocation('gym', 'Siłownia'); store.save();
  return { home: store.locationById('home')!, garage: store.locationById('garage')!, gym };
}
const tplAt = (exName: string, locationId: string | undefined, sets = 2, startWeight: number | '' = '') => { const t = store.newTemplate(); t.name = 'T ' + (locationId ?? '-'); if (locationId) t.locationId = locationId;
  t.items.push({ id: 'i-' + exName, exerciseId: ex(exName).id, sets, repMin: 6, repMax: 8, restSec: null, startWeight, targetSec: '', groupId: null }); store.save(t); return t; };
const hist = (at: number, exName: string, weight: number, locationId?: string, impl?: Impl) => { const w = addWorkout(at, [[exName, [{ weight, reps: 8 }]]]); if (locationId) w.locationId = locationId; if (impl) w.exercises[0].impl = impl; store.save(); return w; };
const weights = (w: Workout | null | undefined) => w!.exercises[0].sets.map(s => s.weight);

describe('7a — „↑” zawsze najbliższy większy dostępny ciężar (bez bramki 10%)', () => {
  test('właściwość: lista ciężarów, wszystkie serie na górnej granicy, ciężar > 0 → dokładnie następny dostępny albo nic (gdy to największy)', async () => {
    await fresh();
    fc.assert(fc.property(fc.uniqueArray(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 15 }), fc.integer({ min: 1, max: 110 }), fc.integer({ min: 5, max: 15 }), fc.integer({ min: 0, max: 3 }), (raw, prev, repMax, extra) => {
      const db = equipEntry('db_fixed'); db.load = { kind: 'list', unit: 'kg', items: raw.map(w => ({ w, on: true })) };
      const l = loc('X', [db, equipEntry('bench_flat')]); const s = store.getState().settings; s.locations = [l]; s.mainLocationId = l.id;
      const e = ex(DB); const Lx = loadsFor(e, l); if (Lx.kind !== 'loads') throw new Error('loads');
      const p = store.progressionFor(e, repMax, [set({ weight: prev, reps: repMax }), set({ weight: prev, reps: repMax + extra })], l.id);
      const nx = nextHeavier(Lx.loads, prev);
      expect(p).toEqual(nx == null ? null : { kind: 'load', kg: nx });
    }), { numRuns: 200 });
  });
  test('skok +20% (10 → 12 kg) i +100% (2 → 4 kg) — od razu następny dostępny; brak kroku „ten sam ciężar” w słowniku', async () => {
    await fresh(); const { home } = places();
    expect(store.progressionFor(ex('Biceps Curl (hantle)'), 12, [10, 10, 10].map(w => set({ weight: w, reps: 12 })), home.id)).toEqual({ kind: 'load', kg: 12 });
    expect(store.progressionFor(ex('Lateral Raise (hantle)'), 15, [2, 2].map(w => set({ weight: w, reps: 15 })), home.id)).toEqual({ kind: 'load', kg: 4 });
    expect(Object.keys(EN).some(k => k.includes('ten sam ciężar'))).toBe(false); expect('PROGRESSION_GATE' in store).toBe(false);
  });
  test('zachowane poprawki audytu: ciężar 0 → powtórzenia; przyrząd bez ciężarów → stara podpowiedź; brak przyrządu i ciężar z innego miejsca → nic', async () => {
    await fresh(); const s = store.getState().settings; const h = userHome(HOME); s.locations = [h]; s.mainLocationId = h.id; store.save();
    expect(store.progressionFor(ex('Walking Lunges'), 12, [set({ weight: 0, reps: 12 })], h.id)).toEqual({ kind: 'reps', reps: 13 });
    s.locations = [userHome([])]; expect(store.progressionFor(ex(DB), 8, [set({ weight: 24, reps: 8 })], 'home')).toEqual({ kind: 'load', kg: 25 });
    s.locations = [loc('Park', [], 'park')]; expect(store.progressionFor(ex('Walking Lunges'), 12, [set({ weight: 10, reps: 12 })], 'park')).toBeNull();
  });
});

describe('8c — przyrząd bloku (WExercise.impl)', () => {
  test('implAt: ten sam dobór co loadsFor — RDL: hantle w domu i w siłowni, stacja w garażu; wyciąg w siłowni ≠ stacja elektryczna; masa ciała — brak', async () => {
    await fresh(); const { home, garage, gym } = places(); const g = store.locationById(gym.id)!;
    expect([implAt(ex(RDL), home), implAt(ex(RDL), garage), implAt(ex(RDL), g)]).toEqual(['dumbbell', 'electric', 'dumbbell']);
    expect([implAt(ex(TP), home), implAt(ex(TP), g)]).toEqual(['electric', 'cable']); /* stos wyciągu siłowni bez wpisanych ciężarów — i tak „cable” */
    expect([implAt(ex('Pull Up'), home), implAt(ex(RDL), undefined), implAt(ex('Goblet Squat'), loc('KB', [{ ...equipEntry('kettlebell'), load: { kind: 'list', unit: 'kg', items: [{ w: 16, on: true }] } }]))]).toEqual([undefined, undefined, 'kettlebell']);
    const noDbVals = userHome([]); expect(implAt(ex(RDL), noDbVals)).toBe('electric'); /* hantle bez wpisanych ciężarów, stacja z ciężarami — jak loadsFor */
    const r = loadsFor(ex(RDL), noDbVals); expect(r.kind === 'loads' && r.item).toBe('electric');
  });

  test('reguła: ostatnia sesja z tym samym ALBO nieznanym przyrządem, gdziekolwiek; brak takiej — ostatnia w ogóle', async () => {
    await fresh(); places(); const rdl = ex(RDL).id;
    const p = (impl?: Impl) => store.previousBlockFor(rdl, 0, 1, undefined, null, impl)?.sets[0].weight;
    hist(day(10), RDL, 20, 'home', 'dumbbell'); hist(day(5), RDL, 40, 'garage', 'electric');
    expect([p('dumbbell'), p('electric'), p()]).toEqual([20, 40, 40]);
    expect(p('kettlebell')).toBe(40); /* żadna sesja nie pasuje — ostatnia w ogóle (bezpiecznik M3 przy wstawianiu dalej działa) */
    hist(day(3), RDL, 22); /* sesja sprzed miejsc: przyrząd nieznany — pasuje do każdego */
    expect([p('dumbbell'), p('electric')]).toEqual([22, 22]);
    hist(day(1), RDL, 41, 'garage', 'electric'); /* nowsza sesja innym przyrządem nie zasłania pasującej */
    expect([p('dumbbell'), p('electric'), p()]).toEqual([22, 41, 41]);
    hist(day(0, 6), RDL, 24, 'gym', 'dumbbell'); expect(p('dumbbell')).toBe(24); /* inne miejsce, ten sam przyrząd — bierzemy */
  });

  test('start z szablonu: przyrząd zapisany w bloku, wartości z ostatniego razu tym przyrządem (dom ↔ garaż); dwa bloki w jednej sesji', async () => {
    await fresh(); places(); hist(day(10), RDL, 20, 'home', 'dumbbell'); hist(day(5), RDL, 40, 'garage', 'electric');
    store.startFromTemplate(tplAt(RDL, 'home')); let a = store.getState().active!; expect(a.exercises[0].impl).toBe('dumbbell'); expect(weights(a)).toEqual([20, 20]); store.cancelWorkout();
    store.startFromTemplate(tplAt(RDL, 'garage')); a = store.getState().active!; expect(a.exercises[0].impl).toBe('electric'); expect(weights(a)).toEqual([40, 40]); store.cancelWorkout();
    /* jedna sesja z RDL hantlami i na linkach: sesja pasuje do obu przyrządów (któryś blok ma ten przyrząd), ale — audyt runda 82 (LOW 4) — wartości
     * tylko z bloków tym samym (albo nieznanym) przyrządem: wcześniej obie wartości mieszały się w jedną listę serii (18 i 35) */
    const w = addWorkout(day(2), [[RDL, [{ weight: 18, reps: 8 }]], [RDL, [{ weight: 35, reps: 8 }]]]); w.exercises[0].impl = 'dumbbell'; w.exercises[1].impl = 'electric'; store.save();
    const pe = store.previousBlockFor(ex(RDL).id, 0, 1, undefined, null, 'electric')!, pd = store.previousBlockFor(ex(RDL).id, 0, 1, undefined, null, 'dumbbell')!;
    expect([pe.workout.id, pd.workout.id]).toEqual([w.id, w.id]); expect(pe.sets.map(s => s.weight)).toEqual([35]); expect(pd.sets.map(s => s.weight)).toEqual([18]);
    expect(store.previousBlockBefore(ex(RDL).id, Infinity, 0, 1, undefined, null, null, 'electric')!.sets.map(s => s.weight)).toEqual([35]); /* edytor historii — ta sama reguła */
    store.startFromTemplate(tplAt(RDL, 'garage')); expect(weights(store.getState().active)).toEqual([35, 35]); store.cancelWorkout();
    store.startFromTemplate(tplAt(RDL, 'home')); expect(weights(store.getState().active)).toEqual([18, 18]); store.cancelWorkout();
    /* blok bez przyrządu (sprzed schematu 15) w tej samej sesji też pasuje — razem z blokiem tym samym przyrządem */
    const w2 = addWorkout(day(1), [[RDL, [{ weight: 16, reps: 8 }]], [RDL, [{ weight: 36, reps: 8 }]], [RDL, [{ weight: 19, reps: 8 }]]]); w2.exercises[1].impl = 'electric'; w2.exercises[2].impl = 'dumbbell'; store.save();
    expect(store.previousBlockFor(ex(RDL).id, 0, 1, undefined, null, 'dumbbell')!.sets.map(s => s.weight)).toEqual([16, 19]);
  });

  test('wyciąg w siłowni i stacja w domu to różne przyrządy: „Poprzednio” nie miesza ciężarów (Triceps Pushdown)', async () => {
    await fresh(); const { gym } = places(); hist(day(6), TP, 30, gym.id, 'cable'); hist(day(3), TP, 15, 'home', 'electric');
    store.startFromTemplate(tplAt(TP, gym.id)); expect(weights(store.getState().active)).toEqual([30, 30]); store.cancelWorkout();
    store.startFromTemplate(tplAt(TP, 'home')); expect(weights(store.getState().active)).toEqual([15, 15]); store.cancelWorkout();
    hist(day(1), TP, 32, gym.id, 'cable'); store.startFromTemplate(tplAt(TP, 'home')); expect(weights(store.getState().active)).toEqual([15, 15]); /* nowsza siłownia nie zasłania domu */
  });

  test('ekran: „Poprzednio” ze stacji w domu mimo nowszej siłowni (wyciąg) — wartości ze stacji, bez dopisku „Poprzednio: Siłownia”', async () => {
    await fresh(); const { gym } = places(); hist(day(6), TP, 15, 'home', 'electric'); hist(day(1), TP, 30, gym.id, 'cable');
    store.startFromTemplate(tplAt(TP, 'home')); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(screen.getAllByLabelText(/^kg/)[0].props.value).toBe('15'); expect(screen.queryByText(/^Poprzednio: /)).toBeNull();
  });
  test('ekran: ostatni raz tym samym przyrządem w innym, znanym miejscu — dopisek „Poprzednio: Siłownia”, ciężar z listy domu wstawiony', async () => {
    await fresh(); const p2 = places(); hist(day(2), RDL, 18, p2.gym.id, 'dumbbell');
    store.startFromTemplate(tplAt(RDL, 'home')); await store.flush(); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(screen.getByText('Poprzednio: Siłownia')).toBeTruthy(); expect(screen.getAllByLabelText(/^kg/)[0].props.value).toBe('18'); /* 18 jest na liście domu */
  });

  test('ćwiczenie dodane w trakcie, zmiana miejsca treningu (przyrząd od nowa), „Powtórz ostatni” (przyrząd wg nowego miejsca, nie kopiowany)', async () => {
    await fresh(); places(); hist(day(10), RDL, 20, 'home', 'dumbbell'); hist(day(5), RDL, 40, 'garage', 'electric');
    store.startEmpty(); store.addExerciseToActive(ex(RDL)); store.addExerciseToActive(ex('Pull Up')); const a = store.getState().active!;
    expect(a.locationId).toBe('home'); expect(a.exercises[0].impl).toBe('dumbbell'); expect('impl' in a.exercises[1]).toBe(false);
    store.setActiveLocation('garage'); expect(a.locationId).toBe('garage'); expect(a.exercises[0].impl).toBe('electric');
    store.toggleDone(0, 0); expect([a.exercises[0].sets[0].weight, a.exercises[0].sets[0].reps]).toEqual([40, 8]); /* odhaczenie pustej serii — z ostatniego razu na stacji */
    store.setActiveLocation('nope'); expect(a.locationId).toBe('garage'); store.cancelWorkout();
    const last = hist(day(0, 6), RDL, 41, 'home', 'electric'); /* np. dane z importu: blok na stacji, choć w domu dziś wychodzą hantle */
    store.repeatLast(); const r = store.getState().active!; expect(r.locationId).toBe('home'); expect(r.exercises[0].impl).toBe('dumbbell'); expect(last.exercises[0].impl).toBe('electric');
  });

  test('edycja historii i trening wstecz: przyrząd bloku wg miejsca szkicu, wartości sprzed daty tym przyrządem; edycja zachowuje przyrząd', async () => {
    await fresh(); places(); hist(day(10), RDL, 20, 'home', 'dumbbell'); const w2 = hist(day(5), RDL, 40, 'garage', 'electric');
    const g = edit.beginPast(tplAt(RDL, 'garage', 1).id, day(4), day(4) + 3600e3); expect(g.w.exercises[0].impl).toBe('electric'); expect(weights(g.w)).toEqual([40]);
    const h = edit.beginPast(null, day(4), day(4) + 3600e3); edit.draftAddExercise(h.key, ex(RDL)); expect(h.w.exercises[0].impl).toBe('dumbbell'); expect(weights(h.w)).toEqual([20]); /* garaż (5 dni temu) pominięty */
    expect(store.previousBlockBefore(ex(RDL).id, day(4), 0, 1, undefined, null, null, 'dumbbell')!.sets[0].weight).toBe(20);
    expect(store.previousBlockBefore(ex(RDL).id, day(4), 0, 1, undefined, null, null)!.sets[0].weight).toBe(40);
    const d = edit.beginEdit(w2.id)!; expect(d.w.exercises[0].impl).toBe('electric'); d.w.exercises[0].sets[0].weight = 42; const r = edit.commitDraft(d.key);
    if ('error' in r) throw new Error(r.error); expect(store.getState().workouts.find(x => x.id === w2.id)!.exercises[0].impl).toBe('electric');
  });

  test('ZERO miejsc: żaden nowy blok nie dostaje pola impl; przyrząd w danych niczego nie zmienia (te same wyniki i ten sam cache)', async () => {
    await fresh(); hist(day(10), RDL, 20, 'home', 'dumbbell'); hist(day(5), RDL, 40, 'garage', 'electric'); const rdl = ex(RDL).id;
    expect(store.getState().settings.locations).toHaveLength(0);
    for (const [k, n] of [[0, 1], [0, 2], [1, 2]]) for (const impl of ['dumbbell', 'electric', 'cable', null] as const) {
      expect(store.previousBlockFor(rdl, k, n, undefined, null, impl)).toBe(store.previousBlockFor(rdl, k, n));
      for (const before of [day(1), day(7), Infinity]) expect(store.previousBlockBefore(rdl, before, k, n, undefined, null, null, impl)).toEqual(store.previousBlockBefore(rdl, before, k, n));
    }
    store.startFromTemplate(tplAt(RDL, undefined)); store.addExerciseToActive(ex(RDL)); let a = store.getState().active!;
    expect(weights(a)).toEqual([40, 40]); expect(JSON.stringify(a)).not.toContain('"impl"'); store.cancelWorkout();
    store.repeatLast(); a = store.getState().active!; expect(JSON.stringify(a)).not.toContain('"impl"'); /* ostatni trening miał impl — nowy nie */ store.cancelWorkout();
    const p = edit.beginPast(null, day(4), day(4) + 3600e3); edit.draftAddExercise(p.key, ex(RDL)); expect(JSON.stringify(p.w)).not.toContain('"impl"'); expect(weights(p.w)).toEqual([40]);
    expect(store.implAtLoc(ex(RDL), 'home')).toBeUndefined();
  });
});

describe('schemat 15 — migracja, eksport/import, restart', () => {
  test('impl: tylko znane wartości zostają (historia i trening w toku); migracja idempotentna; eksport → import i restart 1:1', async () => {
    await fresh(); places(); hist(day(5), RDL, 40, 'garage', 'electric'); store.startFromTemplate(tplAt(RDL, 'home')); await store.flush();
    const raw = JSON.parse(JSON.stringify(store.getState()));
    raw.workouts.push(...['zz', 5, null, 'electric'].map((impl, i) => ({ ...JSON.parse(JSON.stringify(raw.workouts[0])), id: 'w' + i, startedAt: day(20 + i), exercises: [{ ...raw.workouts[0].exercises[0], id: 'b' + i, impl }] })));
    const m = store.migrate(raw); const imp = (id: string) => m.workouts.find(w => w.id === id)!.exercises[0];
    expect(['w0', 'w1', 'w2'].map(id => 'impl' in imp(id))).toEqual([false, false, false]); expect(imp('w3').impl).toBe('electric');
    expect(m.active!.exercises[0].impl).toBe('dumbbell'); expect(m.schemaVersion).toBe(SCHEMA_VERSION);
    expect(strip(store.migrate(JSON.parse(JSON.stringify(m))))).toEqual(strip(m));
    const before = strip(store.getState()); store.replaceState(parseBackup(JSON.stringify(buildBackup()))); expect(strip(store.getState())).toEqual(before);
    await store.flush(); const st = await fresh(global.__kv.get('state')!); expect(strip(st)).toEqual(before);
    expect(st.active!.exercises[0].impl).toBe('dumbbell'); expect(st.workouts.find(w => w.locationId === 'garage')!.exercises[0].impl).toBe('electric');
  });
});

describe('decyzja 03.10.2026 (08:11) — aplikacja nie przenosi ani nie zmienia szablonów właściciela (zastępuje seed i migrację P-004)', () => {
  const item = (st: { templates: { name: string; items: { exerciseId: string; startWeight: number | '' }[] }[]; exercises: { id: string; name: string; lib?: boolean }[] }, tpl: string, exName: string) =>
    st.templates.find(t => t.name === tpl)!.items.find(i => st.exercises.find(e => e.id === i.exerciseId)?.name === exName)!;
  /** Stan ze schematem 14 (sprzed 0.9.0) z szablonami użytkownika: Deadlift (hantle) i RDL (hantle/linki) 48 kg — dawniej ruszane przez migrację P-004. */
  const schema14 = async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 14;
    item(raw, 'Legs — siłownia', 'Deadlift (hantle)').startWeight = 48; item(raw, 'Legs — dom', RDL).startWeight = 48;
    const dl = raw.exercises.find((e: any) => e.name === 'Deadlift (hantle)' && e.lib).id;
    raw.workouts = [{ id: 'h', ownerId: 'local', createdAt: day(3), updatedAt: day(3), loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'Legs', startedAt: day(3), finishedAt: day(3) + 3600e3, note: '', exercises: [{ id: 'b', exerciseId: dl, restSec: 90, repMin: 8, repMax: 8, groupId: null, sets: [set({ weight: 48, reps: 8 })] }] }];
    return raw;
  };
  const tplShape = (st: { templates: { id: string; name: string; items: { exerciseId: string; startWeight: number | ''; sets: number }[] }[] }) => st.templates.map(t => [t.id, t.name, t.items.map(i => [i.exerciseId, i.sets, i.startWeight])]);
  test('nowa instalacja: ZERO szablonów (PL i EN); biblioteka ćwiczeń i gumy jak dotąd', async () => {
    let st = await fresh(); expect(st.templates).toEqual([]); expect(st.exercises.map(e => e.name)).toEqual(LIB.map(l => l[0])); expect(st.bands.map(b => [b.color, b.level])).toEqual([['czerwona', 2], ['czarna', 4], ['fioletowa', 6]]);
    st = await fresh(undefined, 'en'); expect(st.templates).toEqual([]); expect(st.bands.map(b => b.color)).toEqual(['red', 'black', 'purple']);
    expect(seedState('pl').templates).toEqual([]); expect(seedState('en').templates).toEqual([]);
  });
  test('przejście ze schematu 14: szablon z Deadlift (hantle) 48 kg zostaje 48 (migracja i start aplikacji); szablony ani zmieniane, ani usuwane; historia bez zmian', async () => {
    const raw = await schema14();
    const m = store.migrate(JSON.parse(JSON.stringify(raw)));
    expect([item(m, 'Legs — siłownia', 'Deadlift (hantle)').startWeight, item(m, 'Legs — dom', RDL).startWeight]).toEqual([48, 48]);
    expect(tplShape(m)).toEqual(tplShape(raw)); expect(m.schemaVersion).toBe(15);
    expect(m.workouts[0].exercises[0].sets[0].weight).toBe(48); /* A-002: zapisane serie zostają */
    expect(strip(store.migrate(JSON.parse(JSON.stringify(m))))).toEqual(strip(m)); /* idempotentnie */
    /* przez start aplikacji (dane z SQLite, schemat 14) */
    const st = await fresh(JSON.parse(JSON.stringify(raw))); expect(item(st, 'Legs — siłownia', 'Deadlift (hantle)').startWeight).toBe(48); expect(st.schemaVersion).toBe(15); expect(tplShape(st)).toEqual(tplShape(raw));
    expect(saved().templates.find(t => t.name === 'Legs — siłownia')!.items.find(i => i.startWeight === 48)).toBeTruthy(); /* zapisane z powrotem bez zmian */
  });
  test('import kopii: kopia ze schematem 14 i stary backup web 0.3 (prawdziwy format) — szablony 1:1, 48 kg zostaje', async () => {
    const raw = await schema14(); await fresh();
    store.replaceState(parseBackup(JSON.stringify(raw))); let st = store.getState();
    expect(item(st, 'Legs — siłownia', 'Deadlift (hantle)').startWeight).toBe(48); expect(item(st, 'Legs — dom', RDL).startWeight).toBe(48); expect(tplShape(st)).toEqual(tplShape(raw));
    store.replaceState(parseBackup(readFileSync(join(__dirname, 'fixtures/web03-backup.json'), 'utf8'))); st = store.getState();
    expect(st.schemaVersion).toBe(15); expect([item(st, 'Legs — siłownia', 'Deadlift (hantle)').startWeight, item(st, 'Legs — dom / Vishape', RDL).startWeight]).toEqual([48, 48]);
    expect(st.templates.map(t => t.name)).toEqual(['Upper A', 'Upper B', 'Legs — siłownia', 'Legs — dom / Vishape']);
  });
});

describe('ViShape na stronę', () => {
  test('ciężary stacji zawsze na stronę (presety ViShape Pro/Lite: 1,5–65 / 1,5–35 kg na stronę); edytor stacji mówi, że wpisuje się na stronę', async () => {
    const pro = achievable(presetSpec('vishape_pro')), lite = achievable(presetSpec('vishape_lite'));
    expect([pro[0], pro[pro.length - 1], lite[lite.length - 1]]).toEqual([1.5, 65, 35]);
    const g = loc('G', [{ ...equipEntry('electric'), opts: ['dual', 'belt', 'ankle', 'arms'], load: presetSpec('vishape_lite') }]);
    await fresh(); for (const n of ['Przysiad z pasem (linki)', 'Cable Fly', TP, RDL, 'Cable Lateral Raise']) { const r = loadsFor(ex(n), g); expect(r).toEqual({ kind: 'loads', loads: lite, item: 'electric' }); }
    const s = store.getState().settings; s.locations = [userHome(HOME)]; s.mainLocationId = 'home'; await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/location/home'); await flushAll(10);
    expect(screen.getByText('Ciężar serii na stacji wpisuj na stronę — tak, jak pokazuje urządzenie.')).toBeTruthy();
  });
});
