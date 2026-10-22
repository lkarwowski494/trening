/*
 * M3 p2 — logika tablicy „teraz” (lib/board.ts): ZM-01 (wzorzec 29, docs/32), decyzje 21.10.2026 (docs/18).
 *  - pola wpisu na tablicy z metryki ćwiczenia (maks. 2);
 *  - wartości „co zapisze ✓” = wartości serii albo podpowiedź (lustro `fillFromHints` w lib/state/live.ts) — tablica pokazuje je zamiast „—”, a „Seria zrobiona”
 *    bez wyniku nie odhacza serii. Test równoległy: dla każdego scenariusza `effectiveValues` zgadza się z tym, co naprawdę zapisze `toggleDone`;
 *  - krok ± o krok sprzętu (reguła: ta sama co podpowiedź progresji `progressionFor`, bo reguła kroku ± czeka na badacza — [DO USTALENIA]);
 *  - układ pól serii: do 4 z wynikiem, 5–12 w 1–3 rzędach, > 12 przewijanie (SET_FIELDS, design-spec §1).
 */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { applyUnit, wOut } from '@/lib/units';
import { SET_FIELDS, SIZE } from '@/lib/theme';
import { boardKeys, effectiveValues, missingKey, stepOf, fieldLayout, compactResult, BOARD_STEPS, type BoardKey } from '@/lib/board';
import { fresh, ex, addWorkout, set } from './helpers';
import { userHome } from './locations-fixtures';

jest.setTimeout(60000);
afterEach(async () => { applyUnit('kg'); try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const S = () => store.getState();
const byMetric = (m: string) => S().exercises.find(x => x.metric === m && !x.archived)!;
const KEYS: BoardKey[] = ['weight', 'addKg', 'reps', 'durationSec', 'distanceM'];

describe('boardKeys: pola wpisu z metryki ćwiczenia (maks. 2, kolejność: ciężar/dystans, potem powtórzenia/czas)', () => {
  test.each([
    ['weight_reps', ['weight', 'reps']], ['reps', ['reps']], ['time', ['durationSec']], ['distance_time', ['distanceM', 'durationSec']],
    ['weight_time', ['weight', 'durationSec']], ['weight_distance', ['weight', 'distanceM']],
  ])('metryka %s → %j', async (m, keys) => {
    await fresh(); const e = m === 'reps' ? ex('Pull Up') : byMetric(m);
    if (m === 'reps') expect(boardKeys(e)).toEqual(['addKg', 'reps']); /* masa ciała: dociążenie/asysta (addKg) i powtórzenia */
    else expect(boardKeys(e)).toEqual(keys);
  });
  test('ćwiczenie ciężarowe z masą ciała: pole ciężaru to addKg, nie weight; brak ćwiczenia → brak pól', async () => {
    await fresh(); expect(boardKeys(ex('Pull Up'))[0]).toBe('addKg'); expect(boardKeys(ex('Bench Press (sztanga)'))[0]).toBe('weight'); expect(boardKeys(undefined)).toEqual([]);
  });
});

describe('effectiveValues / missingKey — lustro tego, co zapisze „Seria zrobiona” (toggleDone)', () => {
  const start = (name: string, n = 2, opts: { repMin?: number | null } = {}) => { store.startEmpty(); store.addExerciseToActive(ex(name)); for (let i = 1; i < n; i++) store.addSet(0); const a = S().active!; if (opts.repMin !== undefined) a.exercises[0].repMin = opts.repMin; return a; };
  /** to samo co ekran: wartości efektywne PRZED odhaczeniem, a po `toggleDone` — wartości realnie zapisane w serii. */
  const parity = (a: ReturnType<typeof start>, si: number) => {
    const e = a.exercises[0]; const before = effectiveValues(a, e, si); store.toggleDone(0, si); const s = e.sets[si];
    for (const k of KEYS) if (before[k] !== undefined) expect([k, before[k]]).toEqual([k, s[k]]);
    return before;
  };
  test('pierwsze użycie, bez podpowiedzi: wszystko puste → brakuje ciężaru (potem powtórzeń); ✓ nic nie wstawia', async () => {
    await fresh(); const a = start('Bench Press (sztanga)'); const e = a.exercises[0];
    expect(effectiveValues(a, e, 0)).toEqual({ weight: '', reps: '' }); expect(missingKey(a, e, 0)).toBe('weight');
    e.sets[0].weight = 60; expect(missingKey(a, e, 0)).toBe('reps'); e.sets[0].reps = 5; expect(missingKey(a, e, 0)).toBeNull();
    store.toggleDone(0, 1); /* kontrola: toggleDone na pustej serii bez podpowiedzi rzeczywiście zostawia puste pola — to właśnie blokuje tablica */
    expect([e.sets[1].weight, e.sets[1].reps]).toEqual(['', '']);
  });
  test('podpowiedź „Poprzednio” (ta sama seria robocza) — tablica pokazuje ją jako wartość, ✓ zapisuje dokładnie ją', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (sztanga)', [set({ weight: 80, reps: 6 }), set({ weight: 82.5, reps: 5 })]]]);
    const a = start('Bench Press (sztanga)'); const e = a.exercises[0];
    expect(effectiveValues(a, e, 0)).toEqual({ weight: 80, reps: 6 }); expect(effectiveValues(a, e, 1)).toEqual({ weight: 82.5, reps: 5 }); expect(missingKey(a, e, 0)).toBeNull();
    parity(a, 0); parity(a, 1);
  });
  test('wartość wpisana ręcznie wygrywa z podpowiedzią (pole po polu)', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (sztanga)', [set({ weight: 80, reps: 6 })]]]);
    const a = start('Bench Press (sztanga)', 1); const e = a.exercises[0]; e.sets[0].weight = 90;
    expect(effectiveValues(a, e, 0)).toEqual({ weight: 90, reps: 6 }); parity(a, 0);
  });
  test('bez podpowiedzi, szablon z dolną granicą zakresu: powtórzenia z repMin, ciężar nadal brakuje', async () => {
    await fresh(); const a = start('Bench Press (sztanga)', 1, { repMin: 8 }); const e = a.exercises[0];
    expect(effectiveValues(a, e, 0)).toEqual({ weight: '', reps: 8 }); expect(missingKey(a, e, 0)).toBe('weight');
  });
  test('rozgrzewka: bez podpowiedzi i bez dolnej granicy (jak fillFromHints) — tylko wartości z serii', async () => {
    await fresh(); addWorkout(Date.now() - 86400e3, [['Bench Press (sztanga)', [set({ weight: 80, reps: 6 })]]]);
    store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); store.addSet(0, 'warmup'); const a = S().active!; const e = a.exercises[0]; e.repMin = 8;
    const wi = e.sets.findIndex(s => s.kind === 'warmup'); expect(effectiveValues(a, e, wi)).toEqual({ weight: '', reps: '' }); expect(missingKey(a, e, wi)).toBe('weight'); parity(a, wi);
  });
  test('masa ciała: dociążenie (addKg) nie jest wymagane — brakuje tylko powtórzeń', async () => {
    await fresh(); const a = start('Pull Up', 1); const e = a.exercises[0];
    expect(missingKey(a, e, 0)).toBe('reps'); e.sets[0].reps = 8; expect(missingKey(a, e, 0)).toBeNull(); expect(effectiveValues(a, e, 0).addKg).toBe('');
  });
  test('seria na czas: brakuje czasu; dystans + czas: najpierw dystans', async () => {
    await fresh(); const t = byMetric('time'); const a = start(t.name, 1); const e = a.exercises[0]; expect(missingKey(a, e, 0)).toBe('durationSec'); e.sets[0].durationSec = 45; expect(missingKey(a, e, 0)).toBeNull();
    const d = byMetric('distance_time'); store.cancelWorkout(); const b = start(d.name, 1); expect(missingKey(b, b.exercises[0], 0)).toBe('distanceM');
  });
  test('ciężar z innego miejsca spoza listy (bezpiecznik M3): podpowiedź wstrzymana — tablica pokazuje „—”, nie ciężar z podpowiedzi, i nie wstawia powtórzeń', async () => {
    await fresh(); const home = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]); const st = S().settings; st.locations = [home]; st.mainLocationId = home.id; store.save();
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [set({ weight: 32, reps: 8 })]]]).locationId = 'gym'; store.save();
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i0', exerciseId: ex('Bench Press (hantle)').id, sets: 1, repMin: 6, repMax: 10, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); const a = S().active!; const e = a.exercises[0];
    expect(effectiveValues(a, e, 0)).toEqual({ weight: '', reps: '' }); expect(missingKey(a, e, 0)).toBe('weight'); parity(a, 0);
  });
  test('ciężar z innego miejsca, ale na liście tego miejsca: podpowiedź obowiązuje', async () => {
    await fresh(); const home = userHome([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 32]); const st = S().settings; st.locations = [home]; st.mainLocationId = home.id; store.save();
    addWorkout(Date.now() - 86400e3, [['Bench Press (hantle)', [set({ weight: 32, reps: 8 })]]]).locationId = 'gym'; store.save();
    const tpl = store.newTemplate(); tpl.items.push({ id: 'i0', exerciseId: ex('Bench Press (hantle)').id, sets: 1, repMin: 6, repMax: 10, restSec: null, startWeight: '', targetSec: '', groupId: null });
    store.startFromTemplate(tpl); const a = S().active!; const e = a.exercises[0]; e.sets[0].weight = ''; e.sets[0].reps = ''; delete e.sets[0].pre;
    expect(effectiveValues(a, e, 0)).toEqual({ weight: 32, reps: 8 }); parity(a, 0);
  });
});

describe('stepOf: krok ± o krok sprzętu (ta sama reguła co podpowiedź progresji — [DO USTALENIA: badacz])', () => {
  const act = (name: string) => { if (S().active) store.cancelWorkout(); store.startEmpty(); store.addExerciseToActive(ex(name)); const a = S().active!; return { a, e: a.exercises[0] }; };
  test('sztanga: +2,5 / −2,5 kg; od pustej wartości „+” daje pierwszy krok, „−” nic nie robi', async () => {
    await fresh(); const { a, e } = act('Bench Press (sztanga)');
    expect(stepOf(a, e, 'weight', 1, 60).to).toBe(62.5); expect(stepOf(a, e, 'weight', -1, 60).to).toBe(57.5);
    expect(stepOf(a, e, 'weight', 1, '').to).toBe(2.5); expect(stepOf(a, e, 'weight', -1, '').to).toBeNull(); expect(stepOf(a, e, 'weight', -1, 1).to).toBe(0);
  });
  test('hantle bez miejsca: ±1 kg; w funtach sztanga ±5 lb, hantle ±2,5 lb (jednostka wyświetlania)', async () => {
    await fresh(); const { a, e } = act('Bench Press (hantle)');
    expect(stepOf(a, e, 'weight', 1, 20).to).toBe(21); expect(stepOf(a, e, 'weight', -1, 20).to).toBe(19);
    applyUnit('lb'); const kg = (lb: number) => Number((lb * 0.45359237).toFixed(3));
    expect(wOut(stepOf(a, e, 'weight', 1, kg(40)).to!)).toBe(42.5); const b = act('Bench Press (sztanga)'); expect(wOut(stepOf(b.a, b.e, 'weight', 1, kg(135)).to!)).toBe(140); /* zapis w kg, wyświetlanie w lb: krok liczony w jednostce wyświetlania */
  });
  test('masa ciała: ±2,5 kg dociążenia/asysty, wartość ujemna dozwolona (asysta)', async () => {
    await fresh(); const { a, e } = act('Pull Up'); expect(stepOf(a, e, 'addKg', 1, 0).to).toBe(2.5); expect(stepOf(a, e, 'addKg', -1, 0).to).toBe(-2.5); expect(stepOf(a, e, 'addKg', 1, '').to).toBe(2.5);
  });
  test('zgodność z progressionFor: ten sam krok co podpowiedź „↑ spróbuj” (sztanga, hantle, masa ciała; kg i lb)', async () => {
    await fresh(); const prev = (w: number, r: number) => [set({ weight: w, reps: r })];
    for (const [name, w] of [['Bench Press (sztanga)', 60], ['Bench Press (hantle)', 20]] as const) {
      const { a, e } = act(name); const p = store.progressionFor(ex(name), 8, prev(w, 8)); expect(p).toEqual({ kind: 'load', kg: stepOf(a, e, 'weight', 1, w).to });
    }
    applyUnit('lb'); const w = 61.234; const { a, e } = act('Bench Press (sztanga)'); const p = store.progressionFor(ex('Bench Press (sztanga)'), 8, prev(w, 8)); expect(p).toEqual({ kind: 'load', kg: stepOf(a, e, 'weight', 1, w).to });
  });
  test('miejsce z listą ciężarów (hantle 3–24 co 3): ± to sąsiedni ciężar z listy, na krańcach — brak ruchu', async () => {
    await fresh(); const home = userHome([3, 6, 9, 12, 15, 18, 21, 24]); const st = S().settings; st.locations = [home]; st.mainLocationId = home.id; store.save();
    store.startEmpty(); store.addExerciseToActive(ex('Bench Press (hantle)')); const a = S().active!; a.locationId = home.id; const e = a.exercises[0];
    expect(stepOf(a, e, 'weight', 1, 12).to).toBe(15); expect(stepOf(a, e, 'weight', -1, 12).to).toBe(9); expect(stepOf(a, e, 'weight', 1, 24).to).toBeNull(); expect(stepOf(a, e, 'weight', -1, 3).to).toBe(0);
    expect(stepOf(a, e, 'weight', 1, 13).to).toBe(15); expect(stepOf(a, e, 'weight', -1, 13).to).toBe(12); /* wartość spoza listy → najbliższa sąsiednia */
  });
  test('powtórzenia ±1 (od 0 do REPS_MAX), czas i dystans — kroki z jednego miejsca (BOARD_STEPS)', async () => {
    await fresh(); const { a, e } = act('Bench Press (sztanga)');
    expect(stepOf(a, e, 'reps', 1, 8).to).toBe(9); expect(stepOf(a, e, 'reps', -1, 8).to).toBe(7); expect(stepOf(a, e, 'reps', -1, 0).to).toBeNull(); expect(stepOf(a, e, 'reps', 1, '').to).toBe(1);
    expect(stepOf(a, e, 'reps', 1, store.REPS_MAX).to).toBeNull();
    expect(stepOf(a, e, 'durationSec', 1, 30).to).toBe(30 + BOARD_STEPS.timeSec); expect(stepOf(a, e, 'durationSec', -1, 3).to).toBe(0);
    expect(stepOf(a, e, 'distanceM', 1, 100).to).toBe(100 + BOARD_STEPS.distDisplay); applyUnit('lb'); expect(Math.round(stepOf(a, e, 'distanceM', 1, 91.44).to! / 0.9144)).toBe(100 + BOARD_STEPS.distDisplay);
  });
  test('opis kroku do etykiety VoiceOver zawiera jednostkę (kg / lb / s / m / yd)', async () => {
    await fresh(); const { a, e } = act('Bench Press (sztanga)'); expect(stepOf(a, e, 'weight', 1, 60).amount).toBe('2,5 kg'); expect(stepOf(a, e, 'reps', 1, 8).amount).toBe('1');
    expect(stepOf(a, e, 'durationSec', 1, 30).amount).toMatch(/s/); expect(stepOf(a, e, 'distanceM', 1, 100).amount).toMatch(/m$/); applyUnit('lb'); expect(stepOf(a, e, 'distanceM', 1, 91.44).amount).toMatch(/yd$/);
  });
});

describe('fieldLayout: do 4 pól z wynikiem, 5–12 w 1–3 rzędach, > 12 przewijanie (SET_FIELDS)', () => {
  const W = 326; /* wnętrze tablicy przy 390 pt */
  test('stałe z tokenów: 4 / 3 / 12', () => { expect(SET_FIELDS).toMatchObject({ resultUpTo: 4, maxRows: 3, designedUpTo: 12, scrollAbove: 12 }); expect(SIZE.boardFieldMinWidth).toBe(36); });
  test('1–4 serii: jeden rząd, z wynikiem', () => { for (const n of [1, 2, 3, 4]) expect(fieldLayout(n, W, 1)).toMatchObject({ rows: 1, scroll: false, showResult: true }); });
  test('5–12 serii (390 pt, tekst domyślny): bez wyniku, 1–3 rzędy, nigdy przewijania', () => {
    for (let n = 5; n <= 12; n++) { const l = fieldLayout(n, W, 1); expect(l.showResult).toBe(false); expect(l.scroll).toBe(false); expect(l.rows).toBeGreaterThanOrEqual(1); expect(l.rows).toBeLessThanOrEqual(SET_FIELDS.maxRows); expect(l.rows * l.perRow).toBeGreaterThanOrEqual(n); }
    expect(fieldLayout(5, W, 1).rows).toBe(1); expect(fieldLayout(12, W, 1).rows).toBe(2);
  });
  test('320 pt i duży tekst (130%): 12 serii w 3 rzędach', () => { expect(fieldLayout(12, 280, 1.3)).toMatchObject({ rows: 3, scroll: false }); expect(fieldLayout(12, 280, 1)).toMatchObject({ rows: 2 }); });
  test('> 12 serii: jeden przewijany rząd (tryb zapasowy, bez limitu w danych)', () => { for (const n of [13, 15, 40]) expect(fieldLayout(n, W, 1)).toMatchObject({ rows: 1, scroll: true, showResult: false }); });
  test('skala powyżej 130% nie powiększa pól ponad limit liczb (DEC-10)', () => { expect(fieldLayout(8, W, 3)).toEqual(fieldLayout(8, W, 1.3)); });
});

describe('compactResult: wynik w polu serii (do 4 pól)', () => {
  test('80×6, masa ciała „+10×8” / „8”, czas, dystans', async () => {
    await fresh(); expect(compactResult(ex('Bench Press (sztanga)'), set({ weight: 80, reps: 6 }))).toBe('80×6'); expect(compactResult(ex('Bench Press (sztanga)'), set({ weight: 62.5, reps: 5 }))).toBe('62,5×5');
    expect(compactResult(ex('Pull Up'), set({ addKg: 10, reps: 8 }))).toBe('+10×8'); expect(compactResult(ex('Pull Up'), set({ reps: 8 }))).toBe('8');
    expect(compactResult(byMetric('time'), set({ durationSec: 90 }))).toBe('1:30'); expect(compactResult(ex('Bench Press (sztanga)'), set({}))).toBe('—');
  });
});
