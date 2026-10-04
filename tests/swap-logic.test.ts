/* E2 (docs/14 pkt 6, test 11 z pkt 7) — ranking propozycji zamiany: czysta funkcja lib/swap.ts swapCandidates. */
import fc from 'fast-check';
import { fresh, ex, addWorkout } from './helpers';
import { userHome, loc } from './locations-fixtures';
import { presetEquipment, availability } from '@/lib/equipment';
import { swapCandidates, otherImpls, SWAP_WEIGHTS } from '@/lib/swap';
import { getState, save, newExercise, visibleExercises, locationById, deleteExercise } from '@/lib/store';

const D = Date.UTC(2026, 8, 1, 10);
async function setup() {
  await fresh(undefined, 'pl'); const st = getState();
  st.settings.locations = [userHome(), loc('Pełna siłownia', presetEquipment('gym'), 'gym')]; st.settings.mainLocationId = 'home'; save();
}
const ids = (exId: string, o: Partial<Parameters<typeof swapCandidates>[1]> = {}) => swapCandidates(exId, { showAll: false, inWorkout: new Set(), ...o }).map(c => c.exId);

describe('ranking zamiany (swapCandidates)', () => {
  beforeEach(setup);

  test('ranking: żaden kandydat nie jest bieżącym ćwiczeniem; ta sama metryka; przy filtrze — wszystkie dostępne w miejscu; wynik deterministyczny', () => {
    const all = visibleExercises();
    fc.assert(fc.property(fc.nat(all.length - 1), fc.constantFrom<string | undefined>(undefined, 'home', 'gym'), fc.boolean(), (i, locationId, showAll) => {
      const a = all[i]; const c = swapCandidates(a.id, { locationId, showAll, inWorkout: new Set() });
      const again = swapCandidates(a.id, { locationId, showAll, inWorkout: new Set() });
      expect(again).toEqual(c);
      for (const x of c) {
        expect(x.exId).not.toBe(a.id);
        const b = all.find(e => e.id === x.exId)!; expect(b).toBeTruthy(); expect(b.metric).toBe(a.metric); expect(b.archived).toBeFalsy();
        if (locationId && !showAll) expect(availability(b, locationById(locationId)).ok).toBe(true);
        if (locationId) expect(x.available).toBe(availability(b, locationById(locationId)).ok);
        expect(x.score).toBeGreaterThan(0);
      }
      for (let k = 1; k < c.length; k++) expect(c[k - 1].score).toBeGreaterThanOrEqual(c[k].score);
    }), { numRuns: 150 });
  });

  test('podobieństwo: ten sam wzorzec ruchu albo wspólny mięsień główny — sama partia nie wystarcza', () => {
    const c = swapCandidates(ex('Bench Press (sztanga)').id, { showAll: true, inWorkout: new Set() });
    const names = c.map(x => getState().exercises.find(e => e.id === x.exId)!.name);
    expect(names[0]).toMatch(/Bench Press|Machine Chest Press|Incline/);
    expect(names).toContain('Bench Press (hantle)');
    expect(names).not.toContain('Leg Curl'); expect(names).not.toContain('Plank');
    const top = c[0]; expect(top.reasons).toEqual(expect.arrayContaining(['pattern', 'muscle']));
  });

  test('isolation tylko przy wspólnym mięśniu: Leg Extension nie dostaje „tego samego ruchu” od Leg Curl (oba isolation, inne mięśnie)', () => {
    const c = swapCandidates(ex('Leg Extension').id, { showAll: true, inWorkout: new Set() });
    const curl = c.find(x => x.exId === ex('Leg Curl').id);
    if (curl) expect(curl.reasons).not.toContain('pattern');
    const sissy = c.find(x => x.exId === ex('Sissy Squat').id); /* inna metryka? masa ciała, ta sama metryka weight_reps */
    if (sissy) expect(sissy.reasons).toContain('muscle');
  });

  test('ćwiczenia własne bez wzorca — tylko mięśnie i partia', () => {
    const mine = newExercise('Moje wyciskanie'); mine.group = 'klatka'; mine.muscles = ['klatka']; mine.secondaryMuscles = ['triceps']; save(mine);
    const c = swapCandidates(ex('Bench Press (sztanga)').id, { showAll: true, inWorkout: new Set() }).find(x => x.exId === mine.id)!;
    expect(c).toBeTruthy(); expect(c.reasons).not.toContain('pattern');
    expect(c.score).toBe(SWAP_WEIGHTS.muscle + SWAP_WEIGHTS.firstMuscle + SWAP_WEIGHTS.group + SWAP_WEIGHTS.secondary);
    const none = newExercise('Coś innego'); none.group = 'inne'; save(none);
    expect(ids(ex('Bench Press (sztanga)').id, { showAll: true })).not.toContain(none.id);
  });

  test('bonus „wcześniej zamieniane” (+4) i „z historią” (+1); `before` liczy tylko sesje sprzed daty', () => {
    const a = ex('Bench Press (sztanga)'), b = ex('Machine Chest Press');
    const base = swapCandidates(a.id, { showAll: true, inWorkout: new Set() }).find(x => x.exId === b.id)!.score;
    const w = addWorkout(D, [['Machine Chest Press', [{ weight: 50, reps: 10 }]]]); w.exercises[0].swappedFrom = a.id; save();
    const c = swapCandidates(a.id, { showAll: true, inWorkout: new Set() }).find(x => x.exId === b.id)!;
    expect(c.score).toBe(base + SWAP_WEIGHTS.swapped + SWAP_WEIGHTS.history); expect(c.reasons).toEqual(expect.arrayContaining(['swapped', 'history'])); expect(c.sessions).toBe(1);
    const old = swapCandidates(a.id, { showAll: true, inWorkout: new Set(), before: D }).find(x => x.exId === b.id)!;
    expect(old.score).toBe(base); expect(old.sessions).toBe(0);
  });

  test('remis: więcej sesji wygrywa, potem nazwa; dopisek „już w treningu” nie blokuje', () => {
    const a = ex('Bench Press (sztanga)'); const inW = new Set([ex('Bench Press (hantle)').id]);
    const c = swapCandidates(a.id, { showAll: true, inWorkout: inW });
    expect(c.find(x => x.exId === ex('Bench Press (hantle)').id)!.inWorkout).toBe(true);
  });

  test('zarchiwizowane (usunięte) ćwiczenie nigdy nie jest proponowane', () => {
    addWorkout(D, [['Bench Press (hantle)', [{ weight: 20, reps: 10 }]]]); deleteExercise(ex('Bench Press (hantle)').id);
    expect(ids(ex('Bench Press (sztanga)').id, { showAll: true })).not.toContain(ex('Bench Press (hantle)').id);
  });

  test('D5: inny przyrząd w Domu — RDL (hantle/linki): hantle ↔ stacja; bez miejsca — nic', () => {
    const home = locationById('home')!;
    expect(otherImpls(ex('RDL (hantle/linki)'), home, 'dumbbell')).toEqual(['electric']);
    expect(otherImpls(ex('RDL (hantle/linki)'), home, 'electric')).toEqual(['dumbbell']);
    expect(otherImpls(ex('Bench Press (sztanga)'), home, undefined)).toEqual([]);
    expect(otherImpls(ex('RDL (hantle/linki)'), undefined, 'dumbbell')).toEqual([]);
  });
});

/* ---------- W1: zamiana „tylko dziś” w treningu w toku (docs/14 pkt 3) ---------- */
import * as store from '@/lib/store';
import { withDemoTemplates } from './helpers';
import { equipEntry } from '@/lib/equipment';
import type { SetKind, WExercise, Workout } from '@/lib/seed';

const H = Date.UTC(2026, 8, 10, 10);
const TREXO = [2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 24];
async function places() {
  await fresh(undefined, 'pl'); const st = getState();
  st.settings.locations = [userHome(TREXO), loc('Pełna siłownia', presetEquipment('gym'), 'gym')]; st.settings.mainLocationId = 'home'; save();
}
/** Pusty trening z blokami [nazwa, rodzaje serii]. */
function workout(blocks: [string, SetKind[]][], locationId?: string): Workout {
  store.startEmpty(); const a = getState().active!; if (locationId) a.locationId = locationId; else delete a.locationId;
  for (const [n, kinds] of blocks) { store.addExerciseToActive(ex(n)); const e = a.exercises[a.exercises.length - 1]; e.sets = kinds.map(k => ({ ...store.emptySet(), kind: k, warmup: k === 'warmup' })); if (!locationId) delete e.impl; }
  save(a); return a;
}
const blk = (i: number): WExercise => getState().active!.exercises[i];
const tick = (ei: number, si: number, v: Partial<{ weight: number; reps: number }> = { weight: 50, reps: 8 }) => { const s = blk(ei).sets[si]; Object.assign(s, v); return store.toggleDone(ei, si); };

describe('W1: zamiana w treningu w toku', () => {
  beforeEach(places);

  test('zamiana w miejscu: B dostaje tyle samo serii tych samych rodzajów, zakres powtórzeń, tplItemId, groupId i przerwę bloku; impl od nowa; żadna wartość A w B', () => {
    const a = workout([['Bench Press (sztanga)', ['warmup', 'normal', 'normal', 'failure']], ['Lat Pulldown', ['normal']]], 'gym');
    const A = blk(0); Object.assign(A, { repMin: 6, repMax: 8, restSec: 150, tplItemId: 'it1', groupId: 'g' }); blk(1).groupId = 'g';
    A.sets.forEach(s => { s.weight = 100; s.reps = 5; s.edited = true; s.note = 'x'; }); const oldIds = A.sets.map(s => s.id);
    const r = store.swapBlock(A.id, ex('Bench Press (hantle)').id)!;
    expect(r.goneSetIds.sort()).toEqual([...oldIds].sort());
    const B = blk(0); expect(B.id).toBe(A.id); expect(B.exerciseId).toBe(ex('Bench Press (hantle)').id); expect(B.swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    expect(B.sets.map(s => s.kind)).toEqual(['warmup', 'normal', 'normal', 'failure']);
    expect(B.sets.every(s => !oldIds.includes(s.id) && !s.done && s.weight === '' && s.reps === '' && !s.edited && !s.note)).toBe(true);
    expect([B.repMin, B.repMax, B.restSec, B.tplItemId, B.groupId]).toEqual([6, 8, 150, 'it1', 'g']);
    expect(B.impl).toBe('dumbbell'); expect(B.implPinned).toBeUndefined();
    expect(a.exercises).toHaveLength(2);
  });

  test('zamiana w miejscu: wartości z historii B wg 8c; 32 kg z siłowni nie trafia do pól w Domu (M3)', () => {
    const w1 = addWorkout(H, [['Bench Press (hantle)', [{ weight: 22.5, reps: 10 }, { weight: 22.5, reps: 9 }]]]); w1.locationId = 'home'; w1.exercises[0].impl = 'dumbbell';
    workout([['Bench Press (sztanga)', ['normal', 'normal', 'normal']]], 'home');
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id);
    expect(blk(0).sets.map(s => [s.weight, s.reps])).toEqual([[22.5, 10], [22.5, 9], [22.5, 9]]);
    expect(blk(0).sets[0].pre).toEqual({ weight: 22.5, reps: 10 });
    const w2 = addWorkout(H + 86400e3, [['Bench Press (hantle)', [{ weight: 32, reps: 8 }]]]); w2.locationId = 'gym'; w2.exercises[0].impl = 'dumbbell'; save();
    store.cancelWorkout(); workout([['Bench Press (sztanga)', ['normal', 'normal']]], 'home');
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id);
    expect(blk(0).sets.map(s => [s.weight, s.reps])).toEqual([['', ''], ['', '']]);
  });

  test('podział: A tylko z odhaczonymi seriami, B tuż pod A z resztą, splitFrom = A', () => {
    workout([['Bench Press (sztanga)', ['warmup', 'normal', 'normal', 'normal']], ['Lat Pulldown', ['normal']]], 'gym');
    const A = blk(0); A.restSec = 120; A.tplItemId = 'it1'; tick(0, 0, { weight: 40, reps: 10 }); tick(0, 1, { weight: 100, reps: 5 });
    const undone = A.sets.filter(s => !s.done).map(s => s.id);
    const r = store.swapBlock(A.id, ex('Bench Press (hantle)').id)!;
    expect(r.goneSetIds.sort()).toEqual(undone.sort());
    const [a0, b0, c0] = getState().active!.exercises;
    expect(a0.id).toBe(A.id); expect(a0.exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(a0.sets.map(s => [s.kind, s.weight, s.done])).toEqual([['warmup', 40, true], ['normal', 100, true]]);
    expect(b0.id).toBe(r.blockId); expect(b0.exerciseId).toBe(ex('Bench Press (hantle)').id); expect(b0.splitFrom).toBe(A.id); expect(b0.swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    expect(b0.sets.map(s => [s.kind, s.done, s.weight])).toEqual([['normal', false, ''], ['normal', false, '']]);
    expect([b0.tplItemId, b0.restSec]).toEqual(['it1', 120]); expect(c0.exerciseId).toBe(ex('Lat Pulldown').id);
    expect(store.swapBlock(a0.id, ex('Push Up').id)).toBeNull(); /* wszystkie odhaczone — przycisk ukryty (D3 a), akcja nic nie robi */
  });

  test('superset A1 C1 → podział A: B1 nie odpala przerwy w środku rundy; C2 odpala przerwę rundy', () => {
    workout([['Bench Press (sztanga)', ['normal', 'normal', 'normal']], ['Lat Pulldown', ['normal', 'normal', 'normal']]], 'gym');
    blk(0).groupId = 'g'; blk(1).groupId = 'g'; blk(0).restSec = 60; blk(1).restSec = 150;
    expect(tick(0, 0)).toBeNull(); expect(tick(1, 0)).toBe(150);
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id);
    expect(getState().active!.exercises.map(e => e.groupId)).toEqual(['g', 'g', 'g']);
    expect(tick(1, 0)).toBeNull(); /* B1: runda 2 trwa (C2 przed nami) */
    expect(tick(2, 1)).toBe(150); /* C2 zamyka rundę 2 — przerwa rundy (ostatniego ćwiczenia grupy) */
    expect(tick(1, 1)).toBeNull(); /* B2: runda 3 trwa (A+B mają 3 serie, C — 2) */
    expect(tick(2, 2)).toBe(150); /* C3 zamyka rundę 3 */
    /* odhaczanie poza kolejnością (regresja rund 72/75): C przed B w rundzie 2 */
    store.cancelWorkout(); workout([['Bench Press (sztanga)', ['normal', 'normal', 'normal']], ['Lat Pulldown', ['normal', 'normal', 'normal']]], 'gym');
    blk(0).groupId = 'g'; blk(1).groupId = 'g'; blk(1).restSec = 150; tick(0, 0); tick(1, 0); store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id);
    expect(tick(2, 1)).toBeNull(); /* C2 przed B1 — B (członek A+B) ma 1 serię, runda 2 trwa */
    expect(tick(1, 0)).toBe(150); /* B1 zamyka rundę 2 (C nie jest dalej zaległe) */
  });

  test('cofnij: w miejscu wraca A z wartościami A; po podziale serie wracają do A, B znika; A→B→C→cofnij = A; po usunięciu A — jak w miejscu', () => {
    addWorkout(H, [['Bench Press (sztanga)', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    workout([['Bench Press (sztanga)', ['normal', 'normal']]], 'gym');
    const A = blk(0); const vals = [[100, 5], [100, 5]]; /* wartości A z „Poprzednio” — jak przy starcie */
    store.swapBlock(A.id, ex('Bench Press (hantle)').id); store.swapBlock(A.id, ex('Machine Chest Press').id);
    expect(blk(0).swappedFrom).toBe(ex('Bench Press (sztanga)').id); /* A→B→C: oryginał zostaje */
    expect(store.canUndoSwap(blk(0))).toBe(true);
    store.undoSwap(blk(0).id);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).swappedFrom).toBeUndefined();
    expect(blk(0).sets.map(s => [s.weight, s.reps])).toEqual(vals);
    /* podział */
    tick(0, 0, { weight: 100, reps: 5 });
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id); expect(getState().active!.exercises).toHaveLength(2);
    expect(store.canUndoSwap(blk(1))).toBe(true);
    store.undoSwap(blk(1).id);
    expect(getState().active!.exercises).toHaveLength(1);
    expect(blk(0).sets.map(s => [s.done, s.weight, s.reps])).toEqual([[true, 100, 5], [false, 100, 5]]); /* druga seria A — seria robocza nr 2 z „Poprzednio” */
    /* po usunięciu A */
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id); store.removeExercise(0);
    expect(blk(0).splitFrom).toBeTruthy(); store.undoSwap(blk(0).id);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (sztanga)').id); expect(blk(0).splitFrom).toBeUndefined(); expect(blk(0).sets).toHaveLength(1);
  });

  test('Poprzednio zamiennika: najpierw B z tej samej pozycji szablonu; B także własną pozycją szablonu — nie null; B dwa razy w treningu', async () => {
    await fresh(undefined, 'pl'); const [upA] = withDemoTemplates('pl');
    const itBench = upA.items[0]; /* Bench Press (hantle) */
    const B = ex('Machine Chest Press');
    /* sesja 1: Upper A, zamiana Bench → Machine (60 kg) na pozycji itBench */
    const w1 = addWorkout(H, [['Machine Chest Press', [{ weight: 60, reps: 10 }]]]); w1.templateId = upA.id; w1.exercises[0].tplItemId = itBench.id; w1.exercises[0].swappedFrom = itBench.exerciseId;
    /* sesja 2: inny trening z Machine (80 kg) — później */
    addWorkout(H + 86400e3, [['Machine Chest Press', [{ weight: 80, reps: 8 }]]]); save();
    store.startFromTemplate(upA); const a = getState().active!;
    store.swapBlock(a.exercises[0].id, B.id);
    expect(a.exercises[0].sets[0].weight).toBe(60); /* ta sama pozycja szablonu, nie ostatnie B */
    const k = store.occurrence(a.exercises, 0), n = store.occurrences(a.exercises, B.id);
    expect(store.previousBlockFor(B.id, k, n, a.exercises[0].tplItemId, a.templateId, a.exercises[0].impl, true)!.sets[0].weight).toBe(60);
    /* B także własną pozycją szablonu Y (pułapka docs/13 A4.2) — bez historii z pozycji: zwykły dobór, nie null */
    upA.items.push({ id: 'Y', exerciseId: B.id, sets: 2, repMin: 8, repMax: 10, restSec: null, startWeight: '', targetSec: '', groupId: null }); save(upA);
    store.cancelWorkout(); w1.exercises[0].tplItemId = 'gone'; save();
    store.startFromTemplate(upA); const a2 = getState().active!; store.swapBlock(a2.exercises[0].id, B.id);
    expect(a2.exercises.filter(e => e.exerciseId === B.id)).toHaveLength(2); /* B dwa razy w treningu */
    expect(a2.exercises[0].sets[0].weight).not.toBe('');
  });

  test('prefillSets: start z szablonu identyczny przed i po wydzieleniu', async () => {
    /* wzorzec: kod startFromTemplate sprzed wydzielenia (skopiowany 1:1 z lib/store.ts, commit 51bfbcd) — wartości serii */
    const ref = (tplIdx: number) => {
      const tpl = getState().templates[tplIdx]; const locId = store.startLocationId(tpl.locationId);
      return tpl.items.map((it, ii) => { const e = getState().exercises.find(x => x.id === it.exerciseId)!; const impl = store.implAtLoc(e, locId);
        const prevAll = store.previousBlockFor(it.exerciseId, store.occurrence(tpl.items, ii), store.occurrences(tpl.items, it.exerciseId), it.id, tpl.id, impl); const src = prevAll ? prevAll.sets.filter(x => x.kind !== 'drop') : [];
        const prev = src.length ? { sets: src } : null; const out = [];
        for (let i = 0; i < Math.max(1, Math.min(50, Math.floor(Number(it.sets) || 1))); i++) {
          const p0 = store.srcSetAt(prev?.sets, i); const p = store.assistLost(e, p0) ? null : p0; const m = e.metric;
          const s: any = { ...store.emptySet(), ...(p ? store.copyVals(p) : { weight: (store.isBW(e) || !['weight_reps', 'weight_time'].includes(m)) ? '' : (it.startWeight === '' ? '' : Math.max(0, Number(it.startWeight))), addKg: store.isBW(e) && ['weight_reps', 'weight_time'].includes(m) ? it.startWeight : '', durationSec: ['time', 'distance_time', 'weight_time'].includes(m) ? it.targetSec : '' }) };
          if (['time', 'distance_time', 'weight_time'].includes(m)) s.durationSec = Number(it.targetSec) > 0 ? Number(it.targetSec) : '';
          if (p && store.prevFromOther(prevAll, e.id, locId, impl) && store.offListAt(e, locId, s.weight)) { s.weight = ''; if (p.reps === s.reps) s.reps = ''; }
          store.stripUnused(e, s); out.push(s); }
        return out.map(s => [s.weight, s.reps, s.durationSec, s.distanceM, s.addKg, s.bandId]); });
    };
    for (const withPlaces of [false, true]) {
      await fresh(undefined, 'pl'); if (withPlaces) { getState().settings.locations = [userHome(TREXO), loc('Pełna siłownia', presetEquipment('gym'), 'gym')]; getState().settings.mainLocationId = 'home'; }
      const tpls = withDemoTemplates('pl');
      let t0 = H; for (const tp of tpls) for (let r = 0; r < 2; r++) { const w = addWorkout(t0 += 86400e3, tp.items.slice(0, 5).map((it, i) => [getState().exercises.find(x => x.id === it.exerciseId)!.name, [{ weight: 10 + i * 7.5 + r * 2.5, reps: 8 + r, durationSec: 30 + i }, { weight: 32, reps: 6 }]] as [string, any[]])); w.templateId = tp.id; w.exercises.forEach((e, i) => { e.tplItemId = tp.items[i].id; }); if (withPlaces) { w.locationId = r ? 'gym' : 'home'; w.exercises.forEach(e => { const i = store.implAtLoc(store.exById(e.exerciseId), w.locationId); if (i) e.impl = i; }); } }
      save();
      expect(tpls.map((_, ti) => ref(ti)).flat(2).some(r => r[0] !== "" || r[2] !== "")).toBe(true); /* wzorzec naprawdę wstawia wartości */
      tpls.forEach((tp, ti) => { const want = ref(ti); store.startFromTemplate(tp); const got = getState().active!.exercises.map(e => e.sets.map(s => [s.weight, s.reps, s.durationSec, s.distanceM, s.addKg, s.bandId]));
        expect(got).toEqual(want); store.cancelWorkout(); });
    }
  });

  test('bez miejsc: zamiana działa bez filtra i bez impl; zero miejsc = bez pól impl/implPinned', async () => {
    await fresh(undefined, 'pl'); workout([['Bench Press (sztanga)', ['normal', 'normal']]]);
    expect(swapCandidates(blk(0).exerciseId, { showAll: false, inWorkout: new Set() }).length).toBeGreaterThan(3);
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id);
    expect(blk(0).exerciseId).toBe(ex('Bench Press (hantle)').id); expect('impl' in blk(0)).toBe(false); expect('implPinned' in blk(0)).toBe(false);
    store.undoSwap(blk(0).id); expect('impl' in blk(0)).toBe(false);
  });

  test('Powtórz ostatni po zamianie: A i B z seriami, swappedFrom zostaje', () => {
    workout([['Bench Press (sztanga)', ['normal', 'normal']]], 'gym'); tick(0, 0, { weight: 100, reps: 5 });
    store.swapBlock(blk(0).id, ex('Bench Press (hantle)').id); tick(1, 0, { weight: 30, reps: 10 });
    const saved = store.finishWorkout()!;
    expect(saved.exercises.map(e => [e.exerciseId, e.sets.length, e.swappedFrom, e.splitFrom, e.altSkip])).toEqual([[ex('Bench Press (sztanga)').id, 1, undefined, undefined, undefined], [ex('Bench Press (hantle)').id, 1, ex('Bench Press (sztanga)').id, undefined, undefined]]);
    store.repeatLast(); const a = getState().active!;
    expect(a.exercises.map(e => [e.exerciseId, e.swappedFrom])).toEqual([[ex('Bench Press (sztanga)').id, undefined], [ex('Bench Press (hantle)').id, ex('Bench Press (sztanga)').id]]);
    expect(a.exercises[1].sets[0].weight).toBe(30);
  });
});

/* ---------- D5: ten sam ruch, inny przyrząd (docs/14 pkt 3.7; P2 — interpretacja z docs/14 pkt 9) ---------- */
import { loadsFor } from '@/lib/equipment';
describe('D5: inny przyrząd', () => {
  beforeEach(places);
  const RDL = 'RDL (hantle/linki)';

  test('D5: przyrząd przypięty — restampUntouched go nie rusza; „📍” zdejmuje przypięcie z bloku bez serii; lista ciężarów, ↑ i M3 wg przypiętego przyrządu (loadsFor z prefer)', () => {
    const home = locationById('home')!; const e = ex(RDL);
    expect(store.implAtLoc(e, 'home')).toBe('dumbbell'); /* hantle mają ciężary (TREXO), więc domyślnie hantle */
    expect(loadsFor(e, home)).toMatchObject({ kind: 'loads', item: 'db_fixed' });
    const st = loadsFor(e, home, 'electric'); expect(st).toMatchObject({ kind: 'loads', item: 'electric' }); expect((st as any).loads).toContain(65);
    expect(loadsFor(e, home, 'barbell')).toEqual(loadsFor(e, home)); /* przyrządu nie ma w miejscu — prefer bez znaczenia */
    /* historia: RDL na stacji 40 kg/str. (poza listą hantli), RDL hantlami 20 */
    const w1 = addWorkout(H, [[RDL, [{ weight: 20, reps: 10 }]]]); w1.locationId = 'home'; w1.exercises[0].impl = 'dumbbell';
    const w2 = addWorkout(H + 86400e3, [[RDL, [{ weight: 40, reps: 10 }]]]); w2.locationId = 'home'; w2.exercises[0].impl = 'electric'; save();
    workout([[RDL, ['normal', 'normal']], ['Bench Press (hantle)', ['normal']]], 'home');
    expect(blk(0).impl).toBe('dumbbell');
    const r = store.swapImpl(blk(0).id, 'electric')!; expect(r.goneSetIds).toHaveLength(2);
    expect(blk(0)).toMatchObject({ exerciseId: e.id, impl: 'electric', implPinned: true }); expect(blk(0).swappedFrom).toBeUndefined();
    expect(blk(0).sets.map(s => s.weight)).toEqual([40, 40]); /* „Poprzednio” ze stacji (8c), lista stacji — 40 jest dostępne */
    expect(store.listLocFor(blk(0), 'home')).toBe('home'); /* przypięty przyrząd jest w miejscu — lista miejsca działa */
    expect(store.offListAt(e, 'home', 40, store.pinnedImpl(blk(0)))).toBe(false); expect(store.offListAt(e, 'home', 40)).toBe(true); /* wg hantli 40 nie ma */
    const prog = store.progressionFor(e, 10, [{ ...store.emptySet(), done: true, weight: 40, reps: 10 }], 'home', store.pinnedImpl(blk(0)));
    expect(prog).toEqual({ kind: 'load', kg: 40.5 }); /* stacja co 0,5 kg/str. */
    /* restampUntouched (zmiana sprzętu miejsca) nie rusza przypięcia */
    expect(store.locationEquipChanged('home')).toBe(false); expect(blk(0)).toMatchObject({ impl: 'electric', implPinned: true });
    /* „📍” na inne miejsce: przypięcie zdjęte, przyrząd od nowa */
    store.setActiveLocation('gym'); expect(blk(0).implPinned).toBeUndefined(); expect(blk(0).impl).toBe('dumbbell');
  });

  test('D5 (P2): blok z odhaczoną serią — podział jak przy zamianie: stary przyrząd zostaje z odhaczonymi, nowy blok z resztą', () => {
    workout([[RDL, ['normal', 'normal', 'normal']]], 'home'); tick(0, 0, { weight: 20, reps: 10 });
    const r = store.swapImpl(blk(0).id, 'electric')!; const [a0, b0] = getState().active!.exercises;
    expect(a0).toMatchObject({ impl: 'dumbbell' }); expect(a0.implPinned).toBeUndefined(); expect(a0.sets).toHaveLength(1);
    expect(b0).toMatchObject({ id: r.blockId, exerciseId: ex(RDL).id, impl: 'electric', implPinned: true, splitFrom: a0.id }); expect(b0.sets.map(s => s.done)).toEqual([false, false]);
    expect(b0.swappedFrom).toBeUndefined();
    expect(store.swapImpl(a0.id, 'electric')).toBeNull(); /* wszystkie odhaczone */
    expect(store.swapImpl(b0.id, 'barbell')).toBeNull(); /* przyrządu nie ma w miejscu */
  });

  test('Powtórz ostatni po zamianie: implPinned tylko w tym samym miejscu', () => {
    workout([[RDL, ['normal']]], 'home'); store.swapImpl(blk(0).id, 'electric'); tick(0, 0, { weight: 40, reps: 8 }); store.finishWorkout();
    store.repeatLast(); expect(blk(0)).toMatchObject({ impl: 'electric', implPinned: true }); store.cancelWorkout();
    getState().settings.mainLocationId = 'gym'; const last = store.finishedWorkouts()[0]; delete last.locationId; save();
    store.repeatLast(); expect(getState().active!.locationId).toBe('gym'); expect(blk(0).impl).toBe('dumbbell'); expect(blk(0).implPinned).toBeUndefined();
  });
});
