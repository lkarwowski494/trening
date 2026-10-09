/* Runda 82 — poprawki z niezależnego audytu commitów f132330 / 025ee6a (decyzje właściciela 03.10.2026; docs/09, docs/10):
 *  - MEDIUM 1: historia bez miejsca (0.8.5 / web 0.3) wstawia ciężar spoza listy po cichu → wartość ZOSTAJE (bez powrotu do wstrzymywania — HIGH
 *    z weryfikacji 2), ale ekran treningu i edytor historii pokazują dopisek „ciężaru … nie ma tutaj — wpisz ciężar”;
 *  - MEDIUM 2: „ViShape na stronę” zmieniało tylko listy ciężarów → etykieta kolumny ciężaru bloku na stacji „kg/stronę” („kg/str.”), EN „kg/side”;
 *    objętość bez zmian (otwarte pytanie właściciela);
 *  - LOW 3: „Poprzednio” z fallbacku 8c zrobione INNYM, ZNANYM przyrządem w tym samym miejscu omijało bezpiecznik M3 → jak inne, znane miejsce;
 *  - LOW 4: sesja z dwoma blokami tego samego ćwiczenia różnymi przyrządami mieszała wartości → tylko bloki tym samym / nieznanym przyrządem
 *    (test w decisions-0310 wzmocniony o wartości);
 *  - LOW 5: zmiana miejsca w trakcie przemianowywała przyrząd bloków z odhaczonymi seriami → tylko bloki bez odhaczonych serii. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import { equipEntry } from '@/lib/equipment';
import type { Impl } from '@/lib/seed';
import { fresh, ex, addWorkout } from './helpers';
import { userHome, loc, presetSpec } from './locations-fixtures';
import { renderApp, flushAll, screen, go, tap, type, openCard, startEdit } from './app';

jest.setTimeout(60000);
afterEach(async () => { edit.__resetDrafts(); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const day = (n: number, h = 18) => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate() - n, h, 0).getTime(); };
const HOME = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
const DB = 'Bench Press (hantle)', RDL = 'RDL (hantle/linki)', BELT = 'Przysiad z pasem (linki)';
const NOTE = (kg: number) => `ciężaru ${kg} kg nie ma tutaj — wpisz ciężar`;
/** Dom (hantle 2–24 + ViShape Pro) — główne; garaż (tylko ViShape Pro). */
function places() {
  const s = store.getState().settings; const home = userHome(HOME); const vs = equipEntry('electric'); vs.load = presetSpec('vishape_pro');
  s.locations.push(home, loc('Garaż', [vs], 'garage')); s.mainLocationId = home.id; store.save();
}
const tplAt = (exName: string, locationId?: string, sets = 2) => { const t = store.newTemplate(); t.name = 'T ' + (locationId ?? '-'); if (locationId) t.locationId = locationId;
  t.items.push({ id: 'i-' + exName, exerciseId: ex(exName).id, sets, repMin: 6, repMax: 8, restSec: null, startWeight: '', targetSec: '', groupId: null }); store.save(t); return t; };
const hist = (at: number, exName: string, weight: number, locationId?: string, impl?: Impl) => { const w = addWorkout(at, [[exName, [{ weight, reps: 8 }]]]); if (locationId) w.locationId = locationId; if (impl) w.exercises[0].impl = impl; store.save(); return w; };
const vals = (sets: { weight: unknown; reps: unknown }[]) => sets.map(s => [s.weight, s.reps]);
const snapshot = () => JSON.parse(JSON.stringify(store.getState()));

describe('MEDIUM 1 — historia bez miejsca: wartość zostaje, dopisek „nie ma tutaj”', () => {
  test('start z szablonu w domu: 32 kg z sesji bez miejsca wstawione (nie wstrzymane); ekran — dopisek bez prefiksu „Poprzednio:”', async () => {
    await fresh(); places(); hist(day(3), DB, 32); /* 0.8.5 / web 0.3: bez locationId i bez impl */
    store.startFromTemplate(tplAt(DB, 'home')); const a = store.getState().active!;
    expect(a.locationId).toBe('home'); expect(vals(a.exercises[0].sets)).toEqual([[32, 8], [32, 8]]); /* HIGH z weryfikacji 2: nigdy serie bez ciężaru */
    await store.flush(); await renderApp({ saved: snapshot() }); await flushAll(10);
    expect(screen.getByText(NOTE(32))).toBeTruthy(); expect(screen.queryByText(/^Poprzednio: /)).toBeNull(); /* M8: bez „Poprzednio: bez miejsca” */
    expect(screen.getAllByLabelText(/^kg/)[0].props.value).toBe('32');
  });
  test('ciężar z listy (24 kg) z sesji bez miejsca — bez dopisku', async () => {
    await fresh(); places(); hist(day(3), DB, 24); store.startFromTemplate(tplAt(DB, 'home')); await store.flush();
    await renderApp({ saved: snapshot() }); await flushAll(10); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
  test('bez miejsc w ogóle — 32 kg wstawione, bez dopisku (jak przed P-003)', async () => {
    await fresh(); hist(day(3), DB, 32); store.startFromTemplate(tplAt(DB)); expect(vals(store.getState().active!.exercises[0].sets)).toEqual([[32, 8], [32, 8]]); await store.flush();
    await renderApp({ saved: snapshot() }); await flushAll(10); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
  test('odhaczenie pustej serii: 32 kg z sesji bez miejsca wstawione razem z powtórzeniami', async () => {
    await fresh(); places(); hist(day(3), DB, 32); store.startEmpty(); store.addExerciseToActive(ex(DB)); store.toggleDone(0, 0);
    expect(vals(store.getState().active!.exercises[0].sets)).toEqual([[32, 8]]);
  });
  test('edytor historii (trening wstecz w domu): 32 kg wstawione, dopisek w bloku; ręczna zmiana ciężaru — dopisek znika', async () => {
    await fresh(); places(); hist(day(3), DB, 32);
    const d = edit.beginPast(null, day(1), day(1) + 3600e3); expect(d.w.locationId).toBe('home'); edit.draftAddExercise(d.key, ex(DB));
    const e = d.w.exercises[0]; expect(vals(e.sets)).toEqual([[32, 8]]); expect(edit.prefilledOffList(d, e)).toBe(32);
    e.sets[0].weight = 24; expect(edit.prefilledOffList(d, e)).toBeNull(); /* wpisane ręcznie — bez dopisku */
    edit.__resetDrafts(); await store.flush();
    await renderApp({ saved: snapshot() }); await go('/history/add'); await flushAll(20); await tap(screen.getByText('Pusty trening')); await flushAll(50);
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(20); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), DB); await tap(screen.getByText(DB)); await flushAll(50);
    expect(screen.getByText(NOTE(32))).toBeTruthy(); expect(screen.getAllByLabelText('kg/hantel')[0].props.value).toBe('32');
    await type(screen.getAllByLabelText('kg/hantel')[0], '24'); await flushAll(10); expect(screen.queryByText(/nie ma tutaj/)).toBeNull();
  });
});

describe('MEDIUM 2 — etykieta ciężaru bloku na stacji: na stronę', () => {
  test('loadLabel / loadLabelShort z przyrządem „electric” — kg/stronę, kg/str. (PL) i kg/side (EN), dla każdego ćwiczenia na stacji; inne przyrządy bez zmian', async () => {
    await fresh();
    for (const n of [BELT, 'Cable Fly', RDL, 'Triceps Pushdown']) { expect(store.loadLabel(ex(n), 'electric')).toBe('kg/stronę'); expect(store.loadLabelShort(ex(n), 'electric')).toBe('kg/str.'); }
    expect([store.loadLabel(ex(RDL)), store.loadLabel(ex(RDL), 'dumbbell'), store.loadLabel(ex(BELT), 'cable'), store.loadLabel(ex(BELT))]).toEqual(['kg/hantel', 'kg/hantel', 'kg', 'kg']);
    expect(store.loadLabel(ex('Pull Up'), 'electric')).toBe('±kg'); /* masa ciała — bez zmian */
    await fresh(undefined, 'en');
    for (const n of [BELT, 'Cable Fly', RDL]) { expect(store.loadLabel(ex(n), 'electric')).toBe('kg/side'); expect(store.loadLabelShort(ex(n), 'electric')).toBe('kg/side'); }
    expect(store.loadLabel(ex(RDL), 'dumbbell')).toBe('kg/dumbbell');
  });
  test('trening w garażu (ViShape): kolumna „kg/str.”, pole „kg/stronę”; objętość bez zmian (×1 przy „łącznie”)', async () => {
    await fresh(); places(); store.startFromTemplate(tplAt(RDL, 'garage')); store.addExerciseToActive(ex(BELT)); const a = store.getState().active!;
    expect(a.exercises.map(e => e.impl)).toEqual(['electric', 'electric']); await store.flush();
    await renderApp({ saved: snapshot() }); await flushAll(10);
    expect(screen.getAllByText('kg/str.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toHaveLength(2); expect(screen.getAllByLabelText('kg/stronę').length).toBe(3); expect(screen.queryByText('kg/hant.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeNull();
    /* objętość: przysiad z pasem („łącznie”) 45 kg/str. × 8 = 360 (×1 — bez zmian do decyzji właściciela) */
    expect(store.setVolume(ex(BELT), { ...a.exercises[1].sets[0], weight: 45, reps: 8, done: true })).toBe(360);
  });
  test('w domu RDL na hantlach — „kg/hant.” (bez „kg/str.”)', async () => {
    await fresh(); places(); store.startFromTemplate(tplAt(RDL, 'home')); expect(store.getState().active!.exercises[0].impl).toBe('dumbbell'); await store.flush();
    await renderApp({ saved: snapshot() }); await flushAll(10); expect(screen.getByText('kg/hant.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeTruthy(); expect(screen.queryByText('kg/str.', { includeHiddenElements: true } /* nagłówek kolumny ukryty przed VoiceOver — A11-18 */)).toBeNull();
  });
  test('historia (blok zapisany na stacji — przyrząd z bloku, nie z miejsca dziś) i edytor szablonu z miejscem garaż', async () => {
    await fresh(); places(); tplAt(RDL, 'garage'); const w = addWorkout(day(1), [[RDL, [{ weight: 30, reps: 8 }]]]); w.locationId = 'home'; w.exercises[0].impl = 'electric'; store.save(); await store.flush();
    await renderApp({ saved: snapshot() }); await go('/history/' + w.id); await flushAll(10); expect(screen.getByText('kg/str.', { includeHiddenElements: true })).toBeTruthy(); /* nagłówek ukryty przed VoiceOver — wiersz czyta pełną etykietę */
    expect(screen.getByLabelText(/^#: 1, kg\/stronę: 30, /)).toBeTruthy();
    /* edytor szablonu z miejscem garaż — „start kg/str.” */
    const t = store.getState().templates.find(x => x.locationId === 'garage')!;
    await go('/template/' + t.id); await flushAll(10); await startEdit(); await openCard(0); expect(screen.getAllByPlaceholderText('kg/str.').length).toBeGreaterThan(0); /* 05.10.2026: wiersze serii */
  });
});

describe('LOW 3 — fallback 8c z innym, znanym przyrządem w tym samym miejscu = jak inne miejsce (bezpiecznik M3)', () => {
  test('dom: jedyna sesja RDL na stacji (41 kg, impl electric, też w domu); dziś hantle (max 24) — ciężar nie wstawiony, puste powtórzenia, dopisek', async () => {
    await fresh(); places(); const src = hist(day(3), RDL, 41, 'home', 'electric');
    expect(store.previousBlockFor(ex(RDL).id, 0, 1, undefined, null, 'dumbbell')!.workout.id).toBe(src.id); /* fallback: brak sesji hantlami */
    store.startEmpty(); store.addExerciseToActive(ex(RDL)); store.toggleDone(0, 0); let a = store.getState().active!;
    expect(vals(a.exercises[0].sets)).toEqual([['', '']]); /* odhaczenie: nic nie wstawione (siatka bezpieczeństwa M3) */ store.cancelWorkout();
    const d = edit.beginPast(null, day(1), day(1) + 3600e3); edit.draftAddExercise(d.key, ex(RDL)); expect(vals(d.w.exercises[0].sets)).toEqual([['', '']]); edit.__resetDrafts();
    store.repeatLast(); a = store.getState().active!; expect(a.exercises[0].impl).toBe('dumbbell'); expect(vals(a.exercises[0].sets)).toEqual([['', '']]); store.cancelWorkout();
    store.startFromTemplate(tplAt(RDL, 'home')); a = store.getState().active!; expect(a.exercises[0].impl).toBe('dumbbell');
    expect(vals(a.exercises[0].sets)).toEqual([['', ''], ['', '']]); await store.flush();
    await renderApp({ saved: snapshot() }); await flushAll(10); expect(screen.getByText(NOTE(41))).toBeTruthy(); expect(screen.queryByText(/^Poprzednio: /)).toBeNull();
  });
  test('ten sam przypadek, ale ciężar z listy (20 kg) — wstawiony; ten sam przyrząd w tym samym miejscu — jak dotąd', async () => {
    await fresh(); places(); hist(day(3), RDL, 20, 'home', 'electric');
    store.startFromTemplate(tplAt(RDL, 'home')); expect(vals(store.getState().active!.exercises[0].sets)).toEqual([[20, 8], [20, 8]]); store.cancelWorkout();
    hist(day(2), RDL, 22, 'home', 'dumbbell'); store.startFromTemplate(tplAt(RDL, 'home')); expect(vals(store.getState().active!.exercises[0].sets)).toEqual([[22, 8], [22, 8]]);
  });
  test('prevFromOther: znane inne miejsce albo znany inny przyrząd; sesja bez miejsca i bez przyrządu — nie; bez miejsca treningu — nigdy', async () => {
    await fresh(); places(); const rdl = ex(RDL).id;
    const mk = (locationId?: string, impl?: Impl) => { const w = hist(day(5), RDL, 20, locationId, impl); return { workout: w, sets: w.exercises[0].sets }; };
    expect([mk('garage'), mk('home', 'electric'), mk('home', 'dumbbell'), mk(undefined, undefined), mk(undefined, 'electric')].map(p => store.prevFromOther(p, rdl, 'home', 'dumbbell'))).toEqual([true, true, false, false, true]);
    expect(store.prevFromOther(mk('garage', 'electric'), rdl, undefined, 'dumbbell')).toBe(false); expect(store.prevFromOther(mk('home', 'electric'), rdl, 'home', undefined)).toBe(false);
  });
});

describe('LOW 5 — zmiana miejsca w trakcie: przyrząd tylko bloków bez odhaczonych serii', () => {
  test('RDL z odhaczoną serią zostaje „dumbbell”; RDL bez odhaczonych — „electric” w garażu; powrót do domu — znów „dumbbell”', async () => {
    await fresh(); places(); store.startEmpty(); store.addExerciseToActive(ex(RDL)); store.addExerciseToActive(ex(RDL)); const a = store.getState().active!;
    expect(a.exercises.map(e => e.impl)).toEqual(['dumbbell', 'dumbbell']);
    a.exercises[0].sets[0].weight = 20; a.exercises[0].sets[0].reps = 8; store.toggleDone(0, 0);
    store.setActiveLocation('garage'); expect(a.exercises.map(e => e.impl)).toEqual(['dumbbell', 'electric']);
    store.setActiveLocation('home'); expect(a.exercises.map(e => e.impl)).toEqual(['dumbbell', 'dumbbell']);
    store.toggleDone(0, 0); store.setActiveLocation('garage'); expect(a.exercises.map(e => e.impl)).toEqual(['electric', 'electric']); /* cofnięte odhaczenie — blok znów bez zrobionych serii */
  });
});
