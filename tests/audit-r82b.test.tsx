/* Runda 82b — poprawki z niezależnej weryfikacji commitu 6ea37a3 (docs/09, docs/10):
 *  - MEDIUM 1: dopisek „ciężaru X nie ma tutaj — wpisz ciężar” odpalał się z każdej sesji „Poprzednio” i z każdej wartości → tylko gdy (i) są miejsca,
 *    (ii) źródło jest „gdzie indziej” (inne, znane miejsce albo znany, inny przyrząd — prevFromOther) albo bez miejsca, (iii) wartość serii roboczej
 *    (bez drop setów, > 0) jest spoza listy z porównaniem wg jednostki (hasLoadShown); jedna reguła store.offListNote;
 *  - LOW 3: dopisek liczony z bieżących pól (znika po wpisaniu ciężaru), ten sam helper w treningu i w edytorze historii;
 *  - LOW 4: bez miejsc (usunięte w trakcie) etykieta w treningu bez przyrządu — jak main; zakończona historia zostaje przy zapisanym przyrządzie;
 *  - LOW 5: blok, który po zmianie miejsca zachował inny przyrząd, nie używa listy nowego miejsca (dopisek, „↑”, wstrzymanie przy odhaczeniu);
 *  - LOW 8: migracja — szablony bez zmian ciężarów/treści, zostaje tylko normalizacja jak w main (pozycje z brakującym/usuniętym ćwiczeniem). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import { equipEntry, loadsFor } from '@/lib/equipment';
import { hasLoad, hasLoadShown } from '@/lib/loads';
import type { Impl, WSet } from '@/lib/seed';
import { fresh, ex, addWorkout, withDemoTemplates } from './helpers';
import { userHome, loc, presetSpec } from './locations-fixtures';
import { renderApp, flushAll, screen, go, type } from './app';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } store.getState().settings.unit = 'kg'; store.applyPrefs(); await timer.stop(); await timer.stopSet(); });

const day = (n: number, h = 18) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h, 0).getTime(); };
const HOME = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const DB = 'Bench Press (hantle)', RDL = 'RDL (hantle/linki)';
const NOTE = (w: string) => `ciężaru ${w} nie ma tutaj — wpisz ciężar`;
/** Dom (hantle 2–24 parzyste + ViShape Pro) — główne; garaż (tylko ViShape Pro: 1,5–65 kg na stronę co 0,5). */
function places() {
  const s = store.getState().settings; const home = userHome(HOME); const vs = equipEntry('electric'); vs.load = presetSpec('vishape_pro');
  s.locations.push(home, loc('Garaż', [vs], 'garage')); s.mainLocationId = home.id; store.save();
}
const tplAt = (exName: string, locationId?: string, sets = 1) => { const t = store.newTemplate(); t.name = 'T ' + exName + (locationId ?? '-'); if (locationId) t.locationId = locationId;
  t.items.push({ id: 'i-' + exName + (locationId ?? ''), exerciseId: ex(exName).id, sets, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };
const hist = (at: number, exName: string, sets: Partial<WSet>[], locationId?: string, impl?: Impl) => { const w = addWorkout(at, [[exName, sets]]); if (locationId) w.locationId = locationId; if (impl) w.exercises[0].impl = impl; store.save(); return w; };
const vals = (sets: { weight: unknown; reps: unknown }[]) => sets.map(s => [s.weight, s.reps]);
const snapshot = () => JSON.parse(JSON.stringify(store.getState()));
/** Dopisek dla bloku treningu w toku — jak ekran (ActiveWorkout: offListNote z „Poprzednio” i — od rundy 82c — srcSetAt, jak wstawianie wartości). */
const noteOf = (ei: number) => { const a = store.getState().active!; const e = a.exercises[ei];
  const k = store.occurrence(a.exercises, ei); const p = store.previousBlockFor(e.exerciseId, k, store.occurrences(a.exercises, e.exerciseId), e.tplItemId, a.templateId, e.impl);
  return store.offListNote(e, p, a.locationId, si => store.srcSetAt(p?.sets, si)); };
const show = async () => { await store.flush(); await renderApp({ saved: snapshot() }); await flushAll(10); };

describe('MEDIUM 1 — dopisek tylko dla źródła „gdzie indziej” / bez miejsca i wartości roboczej spoza listy', () => {
  test('(a) to samo miejsce, ten sam przyrząd: 23 kg (lista tylko parzyste) — bez dopisku; ten sam ciężar z sesji bez miejsca — z dopiskiem', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 23, reps: 8 }], 'home', 'dumbbell');
    expect(store.offListAt(ex(DB), 'home', 23)).toBe(true); /* 23 naprawdę nie ma na liście */
    store.startFromTemplate(tplAt(DB, 'home')); expect(vals(store.getState().active!.exercises[0].sets)).toEqual([[23, 8]]); /* to samo miejsce — wstawione */
    expect(noteOf(0)).toBeNull(); await show(); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
    /* to samo miejsce, przyrząd nieznany (sesja z miejscem, bez impl) — też „tutaj” */
    await fresh(); places(); hist(day(3), DB, [{ weight: 23, reps: 8 }], 'home'); store.startFromTemplate(tplAt(DB, 'home')); expect(noteOf(0)).toBeNull();
    /* kontrola: sesja bez miejsca (0.8.5 / web 0.3) — dopisek */
    await fresh(); places(); hist(day(3), DB, [{ weight: 23, reps: 8 }]); store.startFromTemplate(tplAt(DB, 'home')); expect(noteOf(0)).toBe(23);
    await show(); expect(screen.getByText(NOTE('23 kg'))).toBeTruthy();
  });
  test('(b) drop set źródła (13 kg, spoza listy) nie odpala dopisku; seria robocza z listy (20 kg)', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 20, reps: 8 }, { weight: 13, reps: 8, kind: 'drop' }]);
    store.startEmpty(); store.addExerciseToActive(ex(DB)); store.addSet(0); const e = store.getState().active!.exercises[0]; e.sets[1].kind = 'drop'; store.save();
    expect(store.offListAt(ex(DB), 'home', 13)).toBe(true); expect(store.hintFor(store.previousFor(ex(DB).id)!.sets, e.sets, 1, ex(DB))!.weight).toBe(13); /* drop ↔ drop */
    expect(noteOf(0)).toBeNull(); await show(); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
  test('(c) ciężar 0 w ćwiczeniu z ciężarem — bez dopisku', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 0, reps: 8 }]); expect(store.offListAt(ex(DB), 'home', 0)).toBe(true);
    store.startEmpty(); store.addExerciseToActive(ex(DB)); expect(noteOf(0)).toBeNull(); await show(); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
  test('(d) lb: ciężar, który na ekranie jest pozycją listy (44 lb), jest na liście — także zapisany z innym zaokrągleniem kg; 52 lb — dopisek w lb', async () => {
    await fresh(); places(); const home = store.getState().settings.locations[0]; const db = home.equipment.find(x => x.item === 'db_fixed')!;
    db.load = { kind: 'list', unit: 'lb', items: [10, 20, 30, 40, 44].map(w => ({ w, on: true })) }; store.getState().settings.unit = 'lb'; store.applyPrefs(); store.save();
    const L = loadsFor(ex(DB), home); expect(L.kind === 'loads' && L.loads.includes(19.95)).toBe(true); /* 44 lb → 19,95 kg */
    hist(day(3), DB, [{ weight: 19.97, reps: 8 }]); /* wpis w kg (19,97) — w lb to 44,0 */
    expect(L.kind === 'loads' && [hasLoad(L.loads, 19.97), hasLoadShown(L.loads, 19.97)]).toEqual([false, true]); /* sama tolerancja 0,01 kg — „spoza listy” */
    expect(store.offListAt(ex(DB), 'home', 19.97)).toBe(false);
    store.startEmpty(); store.addExerciseToActive(ex(DB)); expect(noteOf(0)).toBeNull(); await show(); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
    store.cancelWorkout(); hist(day(2), DB, [{ weight: 23.6, reps: 8 }]); store.startEmpty(); store.addExerciseToActive(ex(DB)); expect(noteOf(0)).toBe(23.6);
    await show(); expect(screen.getByText(NOTE('52 lb'))).toBeTruthy();
    /* w kg porównanie bez zmian (siatka ekranu 0,01 = tolerancja) */
    store.getState().settings.unit = 'kg'; store.applyPrefs(); expect(hasLoadShown([20], 19.98)).toBe(false); expect(hasLoadShown([20], 19.99)).toBe(true);
  });
});

describe('LOW 3 — dopisek z bieżących pól; jeden helper w treningu i edytorze', () => {
  test('trening: 32 kg z sesji bez miejsca — dopisek; wpisanie 24 (albo świadomie 25) chowa dopisek, powrót do 32 — wraca', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 32, reps: 8 }]); store.startFromTemplate(tplAt(DB, 'home')); await show();
    expect(screen.getByText(NOTE('32 kg'))).toBeTruthy();
    await type(screen.getAllByLabelText('kg/hantel')[0], '24'); await flushAll(5); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
    await type(screen.getAllByLabelText('kg/hantel')[0], '25'); await flushAll(5); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
    await type(screen.getAllByLabelText('kg/hantel')[0], '32'); await flushAll(5); expect(screen.getByText(NOTE('32 kg'))).toBeTruthy();
  });
  test('trening: źródło z innego, znanego miejsca (wartość wstrzymana, pole puste) — dopisek z prefiksem; wpisany ciężar chowa tylko dopisek', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 32, reps: 8 }], 'garage'); store.startFromTemplate(tplAt(DB, 'home'));
    expect(vals(store.getState().active!.exercises[0].sets)).toEqual([['', '']]); await show();
    expect(screen.getByText('Poprzednio: Garaż · ' + NOTE('32 kg'))).toBeTruthy();
    await type(screen.getAllByLabelText('kg/hantel')[0], '24'); await flushAll(5); expect(screen.getByText('Poprzednio: Garaż')).toBeTruthy(); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
  test('kilka serii: dopisek, dopóki którakolwiek seria robocza ma pustą albo wstawioną wartość spoza listy', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 32, reps: 8 }, { weight: 30, reps: 8 }]); store.startFromTemplate(tplAt(DB, 'home', 2));
    const s = store.getState().active!.exercises[0].sets; expect(vals(s)).toEqual([[32, 8], [30, 8]]); expect(noteOf(0)).toBe(32);
    s[0].weight = 24; expect(noteOf(0)).toBe(30); s[1].weight = 22; expect(noteOf(0)).toBeNull();
  });
  test('edytor historii — ta sama reguła: wartość wstrzymana (inne miejsce) też z dopiskiem; to samo miejsce tym samym przyrządem — bez', async () => {
    await fresh(); places(); hist(day(3), DB, [{ weight: 32, reps: 8 }], 'garage');
    let d = edit.beginPast(null, day(1), day(1) + 3600e3); edit.draftAddExercise(d.key, ex(DB)); let e = d.w.exercises[0];
    expect(vals(e.sets)).toEqual([['', '']]); expect(edit.prefilledOffList(d, e)).toBe(32); /* wcześniej: null (dopisek tylko przy wartości wstawionej) */
    e.sets[0].weight = 24; expect(edit.prefilledOffList(d, e)).toBeNull(); edit.__resetDrafts();
    await fresh(); places(); hist(day(3), DB, [{ weight: 23, reps: 8 }], 'home', 'dumbbell');
    d = edit.beginPast(null, day(1), day(1) + 3600e3); edit.draftAddExercise(d.key, ex(DB)); e = d.w.exercises[0];
    expect(vals(e.sets)).toEqual([[23, 8]]); expect(edit.prefilledOffList(d, e)).toBeNull();
  });
});

describe('LOW 4 — bez miejsc w trakcie treningu etykieta bez przyrządu (jak main); historia z zapisanym przyrządem', () => {
  test('RDL na stacji w garażu, potem usunięte wszystkie miejsca: trening „kg/hant.”; zakończona sesja — „kg/str.” (zapisany impl)', async () => {
    await fresh(); places(); store.startFromTemplate(tplAt(RDL, 'garage')); const a = store.getState().active!; expect(a.exercises[0].impl).toBe('electric');
    const s = store.getState().settings; s.locations = []; s.mainLocationId = null; store.save();
    expect([store.blockImpl(a.exercises[0], a.locationId), store.liveBlockImpl(a.exercises[0], a.locationId)]).toEqual(['electric', undefined]);
    await show(); expect(screen.getByText('kg/hant.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeTruthy(); expect(screen.queryByText('kg/str.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeNull(); expect(screen.getAllByLabelText('kg/hantel').length).toBe(1);
    a.exercises[0].sets[0].weight = 30; a.exercises[0].sets[0].reps = 8; store.toggleDone(0, 0); const w = store.finishWorkout()!; expect(w.exercises[0].impl).toBe('electric');
    await store.flush(); await renderApp({ saved: snapshot() }); await go('/history/' + w.id); await flushAll(10);
    expect(screen.getByText('kg/str.', { includeHiddenElements: true })).toBeTruthy(); /* docs/10: historia prawdziwie zapisuje wpis na stronę */
  });
});

describe('LOW 5 — blok z zachowanym innym przyrządem nie używa listy nowego miejsca', () => {
  test('„↑”: RDL zrobiony na stacji (20×8), przejście do domu — „↑ spróbuj 21 kg” (krok bez listy), nie 22 kg z listy hantli; blok hantlami — 22 kg', async () => {
    await fresh(); places(); hist(day(3), RDL, [{ weight: 20, reps: 8 }]); store.startFromTemplate(tplAt(RDL, 'garage')); const a = store.getState().active!;
    expect(vals(a.exercises[0].sets)).toEqual([[20, 8]]); store.toggleDone(0, 0); store.setActiveLocation('home'); store.addExerciseToActive(ex(RDL));
    expect(a.exercises.map(e => e.impl)).toEqual(['electric', 'dumbbell']);
    expect([store.listLocFor(a.exercises[0], 'home'), store.listLocFor(a.exercises[1], 'home')]).toEqual([undefined, 'home']);
    const prev = store.previousFor(ex(RDL).id)!.sets;
    expect(store.progressionFor(ex(RDL), 8, prev, store.listLocFor(a.exercises[0], 'home'))).toEqual({ kind: 'load', kg: 21 });
    expect(store.progressionFor(ex(RDL), 8, prev, 'home')).toEqual({ kind: 'load', kg: 22 }); /* lista domu — dla bloku hantlami */
    await show(); expect(screen.getByText(/↑ spróbuj 21 kg/)).toBeTruthy(); expect(screen.queryByText(/↑ spróbuj 22 kg/)).toBeNull(); /* drugi blok bez zakresu powtórzeń — bez „↑” */
  });
  test('dopisek: 41 kg (z listy stacji) po przejściu do domu — bez dopisku w bloku na stacji; nowy blok hantlami — z dopiskiem', async () => {
    await fresh(); places(); hist(day(3), RDL, [{ weight: 41, reps: 8 }]); store.startFromTemplate(tplAt(RDL, 'garage')); expect(noteOf(0)).toBeNull();
    store.toggleDone(0, 0); store.setActiveLocation('home'); expect(store.offListAt(ex(RDL), 'home', 41)).toBe(true);
    expect(noteOf(0)).toBeNull(); store.addExerciseToActive(ex(RDL)); expect(noteOf(1)).toBe(41);
    await show(); expect(screen.getAllByText(NOTE('41 kg'))).toHaveLength(1);
  });
  test('odhaczenie pustej serii: blok na stacji po przejściu do domu bierze 41 z garażu (bez wstrzymania); blok hantlami — wstrzymane', async () => {
    await fresh(); places(); hist(day(3), RDL, [{ weight: 41, reps: 8 }, { weight: 41, reps: 8 }], 'garage', 'electric'); store.startFromTemplate(tplAt(RDL, 'garage', 2)); const a = store.getState().active!;
    expect(vals(a.exercises[0].sets)).toEqual([[41, 8], [41, 8]]); store.toggleDone(0, 0); Object.assign(a.exercises[0].sets[1], { weight: '', reps: '' }); delete a.exercises[0].sets[1].pre;
    store.setActiveLocation('home'); store.toggleDone(0, 1); expect(vals(a.exercises[0].sets)).toEqual([[41, 8], [41, 8]]);
    store.addExerciseToActive(ex(RDL)); expect(a.exercises[1].impl).toBe('dumbbell'); store.toggleDone(1, 0); expect(vals(a.exercises[1].sets)).toEqual([['', '']]); /* M3 bez zmian */
  });
});

describe('LOW 8 — migracja: bez zmian ciężarów i treści szablonów; normalizacja jak w main', () => {
  test('pozycja z usuniętym (zarchiwizowanym) albo brakującym ćwiczeniem wypada, reszta 1:1 (48 zostaje 48)', async () => {
    await fresh(); withDemoTemplates(); const raw = JSON.parse(JSON.stringify(store.getState())); raw.schemaVersion = 14;
    const legs = raw.templates.find((t: any) => t.name === 'Legs — dom'); legs.items[1].startWeight = 48; /* RDL */
    const arch = raw.exercises.find((e: any) => e.name === 'Łydki na stopniu'); arch.archived = true; legs.items.push({ ...legs.items[0], id: 'ghost', exerciseId: 'nie-ma-takiego' });
    const m = store.migrate(JSON.parse(JSON.stringify(raw))); const lm = m.templates.find(t => t.name === 'Legs — dom')!;
    expect(lm.items.map(i => i.exerciseId)).toEqual(legs.items.filter((i: any) => i.exerciseId !== arch.id && i.id !== 'ghost').map((i: any) => i.exerciseId));
    expect(lm.items.map(i => i.startWeight)).toEqual([45, 48, 7, 24]);
  });
});
