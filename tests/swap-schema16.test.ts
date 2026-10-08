import { GYM_FILL, OPT_FILL, EQUIP_FILL2 } from '@/lib/equipment';
/* E2 (docs/14 pkt 2, testy 23 i 25 z pkt 7) — schemat 16: sanityzacja pól zamiany (M1–M4), kopia i restart w trakcie treningu po podziale.
 * Test 24 (idempotencja) — generatory w tests/migrate-idem.test.ts; test 26 (niezmienniki) — tests/invariants.test.ts. */
import * as store from '@/lib/store';
import { buildBackup, parseBackup } from '@/lib/backup';
import { SCHEMA_VERSION, seedState, LIB_EXTRA_NAMES, LIB_MERGED, LIB_REMOVED, LIB_RENAMED, LIB_FIELD_FIXES } from '@/lib/seed';
import { fresh, ex, addWorkout, saved } from './helpers';

const H = Date.UTC(2026, 8, 10, 10);
const blockOf = (o: Record<string, unknown>) => ({ id: 'b1', exerciseId: 'E', restSec: 90, repMin: null, repMax: null, groupId: null, sets: [{ id: 's1', weight: 10, reps: 5, done: true, kind: 'normal' }], ...o });

describe('schemat 16 — migracja pól zamiany', () => {
  test('M1–M7: śmieci z importu w swappedFrom/implPinned/splitFrom/altSkip/alternates — poprawione albo usunięte; historia bez splitFrom i altSkip', async () => {
    await fresh(); const raw: any = seedState('pl'); const E = raw.exercises[0].id; raw.schemaVersion = 15;
    raw.workouts = [{ id: 'w1', startedAt: H, finishedAt: H + 1, exercises: [
      blockOf({ id: 'h1', exerciseId: E, swappedFrom: 42, implPinned: true, impl: 'dumbbell', splitFrom: 'x', altSkip: true }),
      blockOf({ id: 'h2', exerciseId: E, swappedFrom: E, implPinned: true /* bez impl */ }),
      blockOf({ id: 'h3', exerciseId: E, swappedFrom: {}, implPinned: 'true', impl: 'dumbbell' }),
    ] }];
    raw.active = { id: 'a1', startedAt: H, exercises: [
      blockOf({ id: 'a1', exerciseId: E, swappedFrom: 'S', splitFrom: 7, altSkip: true, implPinned: true, impl: 'zz' }),
      blockOf({ id: 'a2', exerciseId: E, splitFrom: '', altSkip: 'yes' }),
    ] };
    const m = store.migrate(JSON.parse(JSON.stringify(raw)));
    const [h1, h2, h3] = m.workouts[0].exercises; const [a1, a2] = m.active!.exercises;
    expect(h1).toMatchObject({ swappedFrom: '42', implPinned: true, impl: 'dumbbell' }); expect(h1.splitFrom).toBeUndefined(); expect(h1.altSkip).toBeUndefined();
    expect('swappedFrom' in h2).toBe(false); expect('implPinned' in h2).toBe(false); /* równe exerciseId; przypięcie bez znanego przyrządu */
    expect('swappedFrom' in h3).toBe(false); expect('implPinned' in h3).toBe(false);
    expect(a1).toMatchObject({ swappedFrom: 'S', splitFrom: '7', altSkip: true }); expect('implPinned' in a1).toBe(false); expect('impl' in a1).toBe(false);
    expect('splitFrom' in a2).toBe(false); expect('altSkip' in a2).toBe(false);
    expect(m.schemaVersion).toBe(18); /* audyt 0.10 A1: schemat 18 — historia planu tygodnia */
    /* blok bez zamiany wygląda bit w bit jak w schemacie 15 */
    expect(Object.keys(m.workouts[0].exercises[0]).filter(k => !['swappedFrom', 'implPinned', 'impl'].includes(k)).sort()).toEqual(['exerciseId', 'groupId', 'id', 'repMax', 'repMin', 'restSec', 'sets']);
  });

  test('eksport → import 1:1 z nowymi polami; restart w trakcie treningu po podziale (klucz „live”) zachowuje splitFrom; kopia 16 odrzucona przez wersję 15 (symulacja SCHEMA_VERSION)', async () => {
    await fresh(); store.startEmpty(); store.addExerciseToActive(ex('Bench Press (sztanga)')); const a = store.getState().active!;
    a.exercises[0].sets = [{ ...store.emptySet(), weight: 100, reps: 5 }, store.emptySet()]; store.toggleDone(0, 0);
    store.swapBlock(a.exercises[0].id, ex('Bench Press (hantle)').id); await store.flush();
    const live = saved().active!; expect(live.exercises[1].splitFrom).toBe(a.exercises[0].id); expect(live.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    /* restart: trening w toku z klucza „live” */
    const st2 = await fresh(saved()); expect(st2.active!.exercises[1].splitFrom).toBe(st2.active!.exercises[0].id); expect(st2.active!.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    /* eksport → import */
    const env = JSON.parse(JSON.stringify(buildBackup())); expect(env.schemaVersion).toBe(18); /* audyt 0.10 A1: schemat 18 — historia planu tygodnia */
    const back = parseBackup(JSON.stringify(env)); expect(back.active!.exercises).toEqual(st2.active!.exercises);
    /* historia po „Zakończ”: bez splitFrom, z swappedFrom */
    store.toggleDone(1, 0); const w = store.finishWorkout()!; expect(w.exercises[1].splitFrom).toBeUndefined(); expect(w.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    const env2 = JSON.stringify(buildBackup()); expect(parseBackup(env2).workouts.at(-1)!.exercises[1].swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    /* wersja 15 odrzuca kopię 16 (pkt 2.4) */
    let err = '';
    jest.isolateModules(() => { jest.doMock('@/lib/seed', () => ({ ...jest.requireActual('@/lib/seed'), SCHEMA_VERSION: 15 }));
      const old = require('@/lib/backup'); try { old.parseBackup(env2); } catch (e) { err = (e as Error).message; } });
    expect(err).toMatch(/18.*15/); expect(SCHEMA_VERSION).toBe(18); /* audyt 0.10 A1: schemat 18 — historia planu tygodnia */
  });

  test('putHistoryWorkout (edytor historii) usuwa splitFrom i altSkip — historia = to samo, co zwraca migracja', async () => {
    await fresh(); const w = addWorkout(H, [['Bench Press (hantle)', [{ weight: 20, reps: 10 }]]]);
    const c = JSON.parse(JSON.stringify(w)); c.exercises[0].splitFrom = 'x'; c.exercises[0].altSkip = true; c.exercises[0].swappedFrom = ex('Bench Press (sztanga)').id;
    store.putHistoryWorkout(c, w.id); const got = store.getState().workouts.find(x => x.id === w.id)!.exercises[0];
    expect(got.splitFrom).toBeUndefined(); expect(got.altSkip).toBeUndefined(); expect(got.swappedFrom).toBe(ex('Bench Press (sztanga)').id);
    expect(store.migrate(JSON.parse(JSON.stringify(store.getState()))).workouts.find(x => x.id === w.id)!.exercises[0]).toEqual(JSON.parse(JSON.stringify(got)));
  });
});

describe('schemat 15 → 16 na danych z prawdziwej wersji 0.9.0', () => {
  /* tests/fixtures/state-090-schema15.json — zapis bazy („state” + „live”) wygenerowany kodem integration/0.9.0 (schemat 15, commit 2a66a6a):
   * szablony demonstracyjne, dwa miejsca, 6 treningów (zmiana miejsca, superset), trening w toku z odhaczoną serią i trwającą przerwą. */
  const fx = require('./fixtures/state-090-schema15.json');
  test('instalacja wersji ze schematem 16 na telefonie z danymi 15: migracja bez utraty danych (wszystko 1:1 poza numerem schematu), trening w toku i przerwa zostają', async () => {
    await fresh(); global.__kv.clear(); global.__kv.set('state', JSON.stringify(fx.state)); global.__kv.set('live', JSON.stringify(fx.live)); /* jak baza na telefonie */
    store.__resetForTests(); await store.init(); const st = store.getState();
    expect(fx.state.schemaVersion).toBe(15); expect(fx.live.seq).toBeGreaterThanOrEqual(fx.state.saveSeq); /* „live” nowszy niż „state” — ścieżka startu z treningiem w toku */
    /* katalog 04.10.2026: migracja z 15 dopisuje nowe ćwiczenia biblioteki (osobny test w tests/catalog-v2.test.ts) — poza nimi dane 1:1 */
    const strip = (s: any) => { const c = JSON.parse(JSON.stringify(s)); delete c.schemaVersion; delete c.metaUpdatedAt; delete c.saveSeq; delete c.libExtra; delete c.libExtraStep; delete c.equipFill; if (c.settings) { delete c.settings.theme; delete c.settings.workoutView; /* 07.10.2026: widok treningu — nowe pole z wartością domyślną, sprawdzane niżej */ } delete c.optFill; for (const l of c.settings?.locations ?? []) for (const e of l.equipment) e.opts = e.opts.filter((o: string) => !(OPT_FILL.opts[e.item] ?? []).includes(o)); /* 05.10: nachylenie bieżni — tests/owner-0510c */ /* decyzja 05.10: wygląd — nowe pole z wartością domyślną, sprawdzane niżej */ /* decyzja 05.10 (1.a): nowy sprzęt w siłowni z presetu — sprawdzane osobno */ for (const l of c.settings?.locations ?? []) { l.equipment = l.equipment.filter((e: any) => !GYM_FILL.items.includes(e.item)); for (const e of l.equipment) e.opts = e.opts.filter((o: string) => !(GYM_FILL.opts[e.item] ?? []).includes(o)); } /* research biblioteki (09.10.2026, krok katalog-2026-10-09 — tests/catalog-library25): scalone → docelowe (id w treningach i szablonach), przemianowane,
     * poprawki pól i odświeżone wymagania; ściana i maszyna do dipów w miejscach — sprawdzane tam */
    delete c.equipFill2; for (const l of c.settings?.locations ?? []) l.equipment = l.equipment.filter((e: any) => !EQUIP_FILL2.all.includes(e.item) && !EQUIP_FILL2.gym.includes(e.item));
    { const idMap = new Map<string, string>(); for (const e of c.exercises) { const k = LIB_MERGED[e.name]; const t = k && c.exercises.find((x: any) => x.name === k); if (t) idMap.set(e.id, t.id); }
      const mv = (id: string) => idMap.get(id) ?? id;
      for (const w of [...(c.workouts ?? []), ...(c.active ? [c.active] : [])]) for (const b of w.exercises) { b.exerciseId = mv(b.exerciseId); if (b.swappedFrom) b.swappedFrom = mv(b.swappedFrom); }
      for (const tp of c.templates ?? []) for (const it of tp.items) { it.exerciseId = mv(it.exerciseId); for (const x of it.alternates ?? []) x.exerciseId = mv(x.exerciseId); }
      c.exercises = c.exercises.filter((e: any) => !LIB_MERGED[e.name] && !LIB_REMOVED.has(e.name)); }
    const fixed = new Set(LIB_FIELD_FIXES.map(f => f.name));
    c.exercises.forEach((e: any) => { e.name = LIB_RENAMED[e.name] ?? e.name; for (const k of ['requires', 'recommended', 'pattern', 'loadSource', 'implements']) delete e[k]; if (fixed.has(e.name)) for (const f of LIB_FIELD_FIXES.filter(x => x.name === e.name)) delete e[f.field]; });
    c.exercises = c.exercises.filter((e: any) => !LIB_EXTRA_NAMES.includes(e.name)); c.exercises.forEach((e: any) => { delete e.catalogRev; delete e.libKey; /* audyt 0.10 (E2): nowe pole klucza katalogu — sprawdzane niżej */ if (e.name === 'Hip Adduction') delete e.muscles; if (e.name === 'Incline Walk (bieżnia)') delete e.requires; /* 05.10: wymaga nachylenia */ }); /* nowa wersja katalogu — wymagania odświeżone, te same; Hip Adduction: partia „przywodziciele” (krok b, sprawdzone niżej) */ return c; };
    const want = strip({ ...fx.state, active: fx.live.active, timer: fx.live.timer });
    expect(st.schemaVersion).toBe(18); /* audyt 0.10 A1 */ expect(strip(st)).toEqual(want); expect(st.settings.theme).toBe('light'); expect(st.settings.workoutView).toBe('focus'); expect(st.exercises.find(e => e.name === 'Hip Adduction')!.muscles).toEqual(['przywodziciele']); expect(st.settings.locations.find(l => l.id === 'gym')!.equipment.some(e => e.item === 'row_machine')).toBe(true); expect(st.settings.locations.find(l => l.id === 'home')!.equipment.some(e => e.item === 'row_machine')).toBe(false); expect(st.exercises.length).toBe(fx.state.exercises.length + LIB_EXTRA_NAMES.length - 1); /* research 09.10.2026: Rear Delt Raise (hantle) scalone */ expect(st.exercises.every(e => e.lib !== true || e.libKey === e.name)).toBe(true); /* E2: klucz z nazwy kanonicznej */
    expect(st.workouts).toHaveLength(6); expect(st.active!.exercises[0].sets[0].done).toBe(true); expect(st.timer.restSetId).toBe(fx.live.timer.restSetId);
    /* zapis po migracji ma już schemat 16, a ponowne wczytanie niczego nie zmienia */
    await store.flush(); const again = await fresh(saved()); expect(strip(again)).toEqual(want);
  });
});
