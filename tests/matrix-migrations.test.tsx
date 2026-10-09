/*
 * Drabina migracji (polecenie właściciela 06.10.2026: pełne, darmowe testy automatyczne; docs/20 rodzaj 6 „Dane”).
 * Dla KAŻDEJ wcześniejszej wersji schematu 1..16 (i bieżącej 17 jako kontroli) budujemy zapis w kształcie tej wersji, z tymi samymi danymi
 * użytkownika, i sprawdzamy: migracja do 17 bez utraty danych (treningi, wartości serii, szablony, ćwiczenia, ustawienia, gumy, poranki,
 * trening w toku), niezmienniki poprawnego stanu (tests/matrix-data-shared.ts), idempotencja migrate, import tej samej kopii w kopercie,
 * zapis → restart → ten sam stan i START APLIKACJI na tym zapisie (renderApp — prawdziwe ekrany) bez błędu.
 *
 * Skąd kształty wersji: historia gita zaczyna się na schemacie 13 (09a4c9a, 02.10.2026) — wcześniejszych wersji nie ma w repozytorium.
 * Kształty 1..12 wynikają więc z gałęzi kodu migrate() (lib/store.ts) i komentarza przy SCHEMA_VERSION (lib/seed.ts), a nie z zapisów:
 *  - < 10:  brak flagi `lib` (ustalana po nazwie), jedno‑hantlowe ćwiczenia biblioteki z loadMode per_dumbbell → total;
 *           kształt web 0.3 (tests/fixtures/web03-backup.json): bez metryki, typu serii, id bloków i pozycji, czasów utworzenia;
 *           od 5 do 9 (UMOWNIE — dokładna wersja nieznana) dochodzi pole loadMode z natywnej 0.1.x,
 *  - < 11:  wartości kg zapisane z funtów (np. 45 lb = 20,41165665 kg) są przyciągane do „okrągłych” kg (snapLegacyLb),
 *  - 10:    flaga lib, metryka, typ serii, id bloków/pozycji, Base (ownerId, createdAt, updatedAt) — granica UMOWNA dla pól bez gałęzi w kodzie,
 *  - 12:    masa ciała zamrożona w treningu (Workout.bodyWeightKg), Settings.bodyWeightKg, Exercise.bodyweightPct (usuwane od 13),
 *  - 13:    progressHint, autoBackup, weighReminder,
 *  - 14:    miejsca (Settings.locations, mainLocationId, pickerShowAll), Workout/Template.locationId, wymagania sprzętowe ćwiczeń,
 *  - 15:    WExercise.impl,  16: swappedFrom/implPinned/splitFrom/altSkip, TemplateItem.alternates, motyw (05.10.2026),
 *  - 17:    TemplateItem.rows (kontrola — bieżący schemat).
 * Usunięcia ZAMIERZONE (opisane w migrate): nieodhaczone serie w historii (runda 59), pusty trening w historii (runda 60), usunięte ćwiczenie
 * bez treningu (runda 41), pozycja szablonu z usuniętym ćwiczeniem (runda 43), bodyWeightKg/bodyweightPct (Q-001), nominalKg gumy (T-055).
 * Poza nimi każdy zapisany fakt ma przetrwać 1:1.
 */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { parseBackup, buildBackup, buildCsv } from '@/lib/backup';
import { snapLegacyLb, KG_PER_LB } from '@/lib/units';
import { SCHEMA_VERSION, seedState, LIB_BASE_NAMES, LIB_MERGED, LIB_RENAMED, LIB_DISPLAY_NAME, type State } from '@/lib/seed';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, go, screen } from './app';
import { stateProblems, strip as strip0, clone, J, canonCatalog, parseCsvRfc } from './matrix-data-shared';

const USER_EX = new Set(['ex-squat', 'ex-goblet', 'ex-pull', 'ex-plank', 'ex-custom', 'ex-old', 'ex-gone']);
/** Porównanie bez pól zapisu i z ćwiczeniami katalogu dopisanymi przez migrację (losowe id) zastąpionymi nazwą. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const START = Date.now() - 1000;
/** Pola nadawane przez migrację danym bez nich (kształty sprzed 10: id bloków/pozycji/serii, czasy utworzenia) — losowe/bieżące, więc w porównaniu
 * dwóch NIEZALEŻNYCH migracji zastępujemy je znacznikiem (treść sprawdza expectPreserved). */
const gen = (x: any): any => Array.isArray(x) ? x.map(gen) : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, (k === 'createdAt' || k === 'updatedAt') && typeof v === 'number' && v >= START ? 'TERAZ' : typeof v === 'string' && UUID.test(v) ? 'UID' : gen(v)])) : x;
const strip = (s: unknown) => canonCatalog(strip0(s), USER_EX);
const stripGen = (s: unknown) => gen(strip(s));

jest.setTimeout(120000);

const LEGACY_45LB = 45 * KG_PER_LB; /* 20,41165665 kg — wpis „45 lb” w wersjach sprzed rundy 26 (surowe lb × 0,45359237) */
const NOTE = 'ciężko, "bardzo"\nnowa linia 😀 ‮odwrócone‬ zero​width';
const VERSIONS = Array.from({ length: SCHEMA_VERSION }, (_, i) => i + 1); /* 1..17 */
const T0 = Date.UTC(2025, 2, 1, 9); const H = 3600e3;
const LIB = seedState('pl').exercises; const libEx = (n: string) => { const e = LIB.find(x => x.name === n); if (!e) throw new Error('brak w katalogu: ' + n); return e; };

/** Zapis w kształcie schematu `v` (opis w nagłówku). `now` — trening w toku świeży (bez pytania o porzucony trening / cichego zapisu po 6 h). */
function shape(v: number, now: number): any {
  const pre10 = v < 10, base = (id: string, at = T0) => v >= 10 ? { id, ownerId: 'local', createdAt: at, updatedAt: at } : { id };
  const lib = (id: string, name: string, extra: Record<string, unknown> = {}) => { const e = libEx(name);
    return { ...base(id), name, equipment: e.equipment, bandAssistable: e.bandAssistable, tempo: '', notes: '', group: e.group,
      ...(v >= 5 && v < 10 ? { loadMode: e.loadMode } : {}),
      ...(v >= 10 ? { lib: true, metric: e.metric, loadMode: e.loadMode, restSec: null, restWarmupSec: null, muscles: e.muscles, secondaryMuscles: e.secondaryMuscles } : {}),
      ...(v >= 14 ? { requires: e.requires, recommended: e.recommended, loadSource: e.loadSource, ...(e.pattern ? { pattern: e.pattern } : {}), ...(e.implements ? { implements: e.implements } : {}) } : {}), ...extra }; };
  const own = (id: string, name: string, extra: Record<string, unknown> = {}) => ({ ...base(id), name, equipment: 'hantle', bandAssistable: false, tempo: '3-1-1', notes: 'moje „notatki”, z przecinkiem', group: 'klatka',
    ...(v >= 10 ? { metric: 'weight_reps', loadMode: 'per_dumbbell', restSec: 75, restWarmupSec: 30, muscles: ['klatka'], secondaryMuscles: ['triceps'] } : {}), ...(v >= 14 ? { requires: [], recommended: [], loadSource: 'dumbbell' } : {}), ...extra });
  const set = (id: string, p: Record<string, unknown>) => { const kind = (p.kind as string) ?? 'normal'; const q = { ...p }; delete q.kind;
    return pre10 ? { id, weight: '', reps: '', bandId: '', addKg: '', warmup: kind === 'warmup', note: '', done: true, completedAt: T0 + 60e3, actualRest: null, ...q }
      : { id, weight: '', reps: '', durationSec: '', distanceM: '', rpe: '', bandId: '', addKg: '', kind, warmup: kind === 'warmup', note: '', done: true, completedAt: T0 + 60e3, actualRest: 90, ...q }; };
  const block = (id: string, exerciseId: string, sets: unknown[], extra: Record<string, unknown> = {}) => ({ ...(pre10 ? {} : { id, groupId: null }), exerciseId, restSec: 120, repMin: 5, repMax: 8, sets, ...extra });
  const item = (id: string, exerciseId: string, p: Record<string, unknown>) => ({ ...(pre10 ? {} : { id, groupId: null, targetSec: '' }), exerciseId, ...p });
  const wk = (id: string, at: number, exercises: unknown[], extra: Record<string, unknown> = {}) => ({ ...base(id, at), ...(v >= 10 ? { loggedBy: 'local', sessionMode: 'solo', healthUUID: null } : {}), templateId: 'tpl-a', templateName: 'Góra A', startedAt: at, finishedAt: at + H, note: NOTE, exercises, ...(v === 12 ? { bodyWeightKg: 81.5 } : {}), ...(v >= 14 ? { locationId: 'L1' } : {}), ...extra });

  const s: any = {
    v: 2, ...(v >= 2 ? { schemaVersion: v } : {}) /* schemat 1 = goły stan bez numeru (web 0.3) */, ...(v >= 10 ? { ownerId: 'local' } : {}),
    settings: { defaultRest: 120, sound: false, wakeLock: false, ...(v >= 10 ? { showRpe: true, healthSync: false, modules: { training: true, diet: true }, language: v % 3 === 0 ? 'en' : 'pl', unit: v % 2 ? 'lb' : 'kg' } : {}),
      ...(v === 12 ? { bodyWeightKg: 81.5 } : {}), ...(v >= 13 ? { progressHint: false, autoBackup: false, weighReminder: true } : {}),
      ...(v >= 14 ? { locations: [{ ...base('L1'), ownerId: 'local', createdAt: T0, updatedAt: T0, name: 'Dom', equipment: [{ item: 'db_fixed', opts: [] }] }], mainLocationId: 'L1', pickerShowAll: true } : {}),
      ...(v >= 16 ? { theme: 'dark' } : {}) },
    exercises: [
      lib('ex-squat', 'Back Squat'), lib('ex-goblet', 'Goblet Squat', v >= 10 ? { loadMode: 'per_dumbbell' } /* od 10: świadomy wybór użytkownika — zostaje */ : v >= 5 ? { loadMode: 'per_dumbbell' } /* błąd ×2 sprzed 10 */ : {}),
      lib('ex-pull', 'Pull Up', v === 12 ? { bodyweightPct: 100 } : {}), lib('ex-plank', 'Plank'),
      own('ex-custom', 'Wyciskanie, "moje" 💪'), own('ex-old', 'Stare ćwiczenie', { archived: true }), own('ex-gone', 'Nieużywane', { archived: true }),
    ],
    bands: [{ ...base('band-r'), color: 'czerwona', level: 3, ...(v < 14 ? { nominalKg: 15 } : {}) }],
    templates: [{ ...base('tpl-a'), name: '  Góra   A ', ...(v >= 14 ? { locationId: 'L1' } : {}), items: [
      item('i1', 'ex-squat', { sets: 3, repMin: 5, repMax: 8, restSec: 180, startWeight: 100 }),
      item('i2', 'ex-goblet', { sets: 2, repMin: 10, repMax: 12, restSec: 60, startWeight: 48, ...(pre10 ? {} : { groupId: 'g1' }), ...(v >= 16 ? { alternates: [{ locationId: 'L1', exerciseId: 'ex-custom', restSec: 45 }] } : {}) }),
      item('i3', 'ex-custom', { sets: 2, repMin: null, repMax: null, restSec: null, startWeight: 30, ...(pre10 ? {} : { groupId: 'g1' }) }),
      item('i4', 'ex-gone', { sets: 1, repMin: 1, repMax: 1, restSec: 60, startWeight: '' }),
      ...(v >= 17 ? [item('i5', 'ex-squat', { sets: 2, repMin: 5, repMax: 5, restSec: 90, startWeight: 60, rows: [{ id: 'r1', kind: 'warmup', reps: 8, weight: 40, durationSec: '', distanceM: '' }, { id: 'r2', kind: 'normal', reps: 5, weight: 60, durationSec: '', distanceM: '' }] })] : []),
    ] }],
    workouts: [
      wk('w1', T0, [
        block('b1', 'ex-squat', [set('s1', { weight: 60, reps: 8, kind: 'warmup' }), set('s2', { weight: 100, reps: 5 }), set('s3', { weight: 102.5, reps: 5, ...(pre10 ? {} : { rpe: 8, kind: 'failure' }) }), set('s3x', { weight: 110, reps: 1, done: false })]),
        block('b2', 'ex-goblet', [set('s4', { weight: LEGACY_45LB, reps: 10 })], { ...(v >= 15 ? { impl: 'dumbbell' } : {}), ...(v >= 16 ? { swappedFrom: 'ex-squat', implPinned: true } : {}) }),
        block('b3', 'ex-custom', [set('s5', { weight: 30, reps: 8, note: NOTE })]),
      ]),
      wk('w2', T0 + 2 * 86400e3, [
        block('b4', 'ex-pull', [set('s6', { weight: '', addKg: 10, reps: 6, bandId: 'band-r' })]),
        block('b5', 'ex-plank', [set('s7', pre10 ? { reps: 1 } /* web 0.3: tylko kg × powt. */ : { durationSec: 60 })]),
        block('b6', 'ex-old', [set('s8', { weight: 40, reps: 10 })]),
      ], { templateId: null, templateName: '', note: '' }),
      wk('w3', T0 + 4 * 86400e3, [block('b7', 'ex-squat', [set('s9', { weight: 50, reps: 5, done: false })])]), /* sama nieodhaczona seria — trening znika (runda 60) */
    ],
    active: { ...wk('act', now - 10 * 60e3, [block('b8', 'ex-squat', [set('s10', { weight: 100, reps: 5, completedAt: now - 5 * 60e3 }), set('s11', { weight: 105, reps: '', done: false, completedAt: null })], v >= 16 ? { altSkip: true } : {})]), finishedAt: null },
    mornings: [{ ...base('m1'), date: '2025-3-1', bb: 70, sleepScore: 85, sleepH: 7.5, weight: 80.5 }],
    metaUpdatedAt: now - 60e3,
  };
  return s;
}

/** Dane, które MAJĄ przetrwać migrację z wersji v (z uwzględnieniem gałęzi wersji). */
function expectPreserved(st: State, v: number, label: string) {
  const ctx = (x: unknown) => ({ v, label, x });
  const E = (id: string) => { const e = st.exercises.find(x => x.id === id); if (!e) throw new Error(`v${v} ${label}: zgubione ćwiczenie ${id}`); return e; };
  /* ćwiczenia */
  expect(ctx(['ex-squat', 'ex-goblet', 'ex-pull', 'ex-plank', 'ex-custom', 'ex-old'].map(id => [id, E(id).name]))).toEqual(ctx([['ex-squat', 'Back Squat'], ['ex-goblet', 'Goblet Squat'], ['ex-pull', 'Pull Up'], ['ex-plank', 'Plank'], ['ex-custom', 'Wyciskanie, "moje" 💪'], ['ex-old', 'Stare ćwiczenie']]));
  expect(ctx(st.exercises.some(e => e.id === 'ex-gone'))).toEqual(ctx(false)); /* zamierzone: usunięte ćwiczenie bez treningu (runda 41) */
  expect(ctx([E('ex-squat').lib, E('ex-goblet').lib, E('ex-custom').lib, E('ex-old').archived])).toEqual(ctx([true, true, undefined, true]));
  expect(ctx(E('ex-goblet').loadMode)).toEqual(ctx(v < 10 ? 'total' : 'per_dumbbell')); /* schemat 10: jedno‑hantlowe ×1 tylko dla danych sprzed 10 */
  expect(ctx(E('ex-plank').metric)).toEqual(ctx(v < 10 ? 'reps' : 'time')); /* A1: stare dane z powtórzeniami nie tracą ich przez metrykę z katalogu */
  expect(ctx([E('ex-custom').tempo, E('ex-custom').notes, E('ex-custom').group, E('ex-custom').equipment])).toEqual(ctx(['3-1-1', 'moje „notatki”, z przecinkiem', 'klatka', 'hantle']));
  if (v >= 10) expect(ctx([E('ex-custom').restSec, E('ex-custom').restWarmupSec, E('ex-custom').muscles])).toEqual(ctx([75, 30, ['klatka']]));
  /* nowe ćwiczenia katalogu dopisane bez kolizji nazw (katalog 04.10.2026) — własne zostają */
  const names = st.exercises.map(e => e.name.toLocaleLowerCase('pl')); expect(ctx(new Set(names).size)).toEqual(ctx(names.length));
  /* gumy */
  expect(ctx(st.bands.map(b => [b.id, b.color, b.level]))).toEqual(ctx([['band-r', 'czerwona', 3]]));
  /* szablony */
  const tp = st.templates.find(t => t.id === 'tpl-a')!; expect(ctx(tp && tp.name)).toEqual(ctx('Góra A'));
  const items = tp.items.map(it => ({ ex: it.exerciseId, sets: it.sets, repMin: it.repMin, repMax: it.repMax, restSec: it.restSec, startWeight: it.startWeight, rows: it.rows?.length ?? 0, alt: it.alternates?.map(a => [a.locationId, a.exerciseId, a.restSec]) ?? null }));
  expect(ctx(items)).toEqual(ctx([
    { ex: 'ex-squat', sets: 3, repMin: 5, repMax: 8, restSec: 180, startWeight: 100, rows: 0, alt: null },
    { ex: 'ex-goblet', sets: 2, repMin: 10, repMax: 12, restSec: 60, startWeight: 48 /* decyzja 03.10 (08:11): 48 zostaje 48 */, rows: 0, alt: v >= 16 ? [['L1', 'ex-custom', 45]] : null },
    { ex: 'ex-custom', sets: 2, repMin: null, repMax: null, restSec: null, startWeight: 30, rows: 0, alt: null },
    ...(v >= 17 ? [{ ex: 'ex-squat', sets: 2, repMin: 5, repMax: 5, restSec: 90, startWeight: 60, rows: 2, alt: null }] : []),
  ]));
  if (!(v < 10)) expect(ctx([tp.items[1].groupId, tp.items[2].groupId])).toEqual(ctx(['g1', 'g1']));
  expect(ctx(tp.locationId)).toEqual(ctx(v >= 14 ? 'L1' : undefined));
  /* treningi: wszystkie odhaczone serie z wartościami */
  const W = (id: string) => st.workouts.find(w => w.id === id);
  expect(ctx(st.workouts.map(w => w.id).sort())).toEqual(ctx(['w1', 'w2'])); /* w3 — zamierzone (sama nieodhaczona seria) */
  const w1 = W('w1')!, w2 = W('w2')!;
  expect(ctx([w1.startedAt, w1.finishedAt, w1.templateName, w1.note, w1.templateId, w2.startedAt, w2.note])).toEqual(ctx([T0, T0 + H, 'Góra A', NOTE, 'tpl-a', T0 + 2 * 86400e3, '']));
  const vals = (w: typeof w1) => w.exercises.map(e => [e.exerciseId, e.sets.map(x => [x.id, x.weight, x.reps, x.addKg, x.durationSec, x.rpe, x.kind, x.bandId, x.note, x.done])]);
  const legacy = v < 11 ? snapLegacyLb(LEGACY_45LB) : 20.41;
  expect(ctx(vals(w1))).toEqual(ctx([
    ['ex-squat', [['s1', 60, 8, '', '', '', 'warmup', '', '', true], ['s2', 100, 5, '', '', '', 'normal', '', '', true], ['s3', 102.5, 5, '', '', v < 10 ? '' : 8, v < 10 ? 'normal' : 'failure', '', '', true]]],
    ['ex-goblet', [['s4', legacy, 10, '', '', '', 'normal', '', '', true]]],
    ['ex-custom', [['s5', 30, 8, '', '', '', 'normal', '', NOTE, true]]],
  ]));
  if (v < 11) expect(ctx(Math.round((legacy as number) / KG_PER_LB * 10) / 10)).toEqual(ctx(45)); /* stary wpis w funtach nadal pokazuje 45 lb */
  expect(ctx(vals(w2))).toEqual(ctx([
    ['ex-pull', [['s6', '', 6, 10, '', '', 'normal', 'band-r', '', true]]],
    ['ex-plank', [['s7', '', v < 10 ? 1 : '', '', v < 10 ? '' : 60, '', 'normal', '', '', true]]],
    ['ex-old', [['s8', 40, 10, '', '', '', 'normal', '', '', true]]],
  ]));
  const b2 = w1.exercises[1];
  expect(ctx([w1.locationId, b2.impl, b2.swappedFrom, b2.implPinned])).toEqual(ctx([v >= 14 ? 'L1' : undefined, v >= 15 ? 'dumbbell' : undefined, v >= 16 ? 'ex-squat' : undefined, v >= 16 ? true : undefined]));
  /* trening w toku: także nieodhaczona seria z wpisanym ciężarem */
  const a = st.active!; expect(ctx(a && a.id)).toEqual(ctx('act'));
  expect(ctx(a.exercises[0].sets.map(x => [x.id, x.weight, x.reps, x.done]))).toEqual(ctx([['s10', 100, 5, true], ['s11', 105, '', false]]));
  expect(ctx(a.exercises[0].altSkip)).toEqual(ctx(v >= 16 ? true : undefined));
  /* poranki */
  expect(ctx(st.mornings.map(m => [m.date, m.bb, m.sleepScore, m.sleepH, m.weight]))).toEqual(ctx([['2025-03-01', 70, 85, 7.5, 80.5]]));
  /* ustawienia: zapisane zostają, brakujące — domyślne */
  const S = st.settings; const d = seedState('pl').settings;
  expect(ctx([S.defaultRest, S.sound, S.wakeLock])).toEqual(ctx([120, false, false]));
  expect(ctx([S.showRpe, S.unit, S.language, S.modules.diet])).toEqual(ctx(v >= 10 ? [true, v % 2 ? 'lb' : 'kg', v % 3 === 0 ? 'en' : 'pl', true] : [d.showRpe, 'kg', 'auto', d.modules.diet]));
  expect(ctx([S.progressHint, S.autoBackup, S.weighReminder])).toEqual(ctx(v >= 13 ? [false, false, true] : [d.progressHint, d.autoBackup, d.weighReminder]));
  expect(ctx([S.locations.map(l => [l.id, l.name, l.equipment.map(e => e.item)]), S.mainLocationId, S.pickerShowAll])).toEqual(ctx(v >= 14 ? [[['L1', 'Dom', ['db_fixed', 'wall'] /* EQUIP_FILL2 (09.10.2026): ściana dopisana raz */]], 'L1', true] : [[], null, false]));
  expect(ctx(S.theme)).toEqual(ctx(v >= 16 ? 'dark' : 'light'));
}

describe('drabina migracji 1..17 → 17', () => {
  test.each(VERSIONS)('schemat %i: bez utraty danych, niezmienniki, idempotencja, koperta, zapis → restart', async v => {
    const now = Date.now(); await fresh();
    const raw = shape(v, now);
    const m = store.migrate(clone(raw));
    expect({ v, problems: stateProblems(m) }).toEqual({ v, problems: [] });
    expectPreserved(m, v, 'migrate');
    /* idempotencja (także przez JSON) */
    expect(strip(store.migrate(clone(m)))).toEqual(strip(m));
    /* import tej samej kopii — koperta z numerem wersji i goły stan */
    const env = parseBackup(J({ format: 'trening-backup', schemaVersion: v, exportedAt: new Date(now).toISOString(), state: raw }));
    expect(stripGen(env)).toEqual(stripGen(m)); expect(stripGen(parseBackup(J(raw)))).toEqual(stripGen(m)); expectPreserved(env, v, 'import');
    /* zapis aplikacji ze schematem v → start (init) → migracja → zapis 17 → restart: ten sam stan */
    const st = await fresh(raw); expect(store.getRecovery()).toBeNull(); expectPreserved(st, v, 'init');
    await store.flush(); expect(JSON.parse(global.__kv.get('state')!).schemaVersion).toBe(SCHEMA_VERSION);
    const before = strip(store.getState()); const again = await fresh(saved()); expect(strip(again)).toEqual(before);
    /* eksport → import po migracji: punkt stały */
    expect(strip(parseBackup(J(buildBackup())))).toEqual(strip(store.getState()));
    /* statystyki i CSV na zmigrowanych danych liczą się bez wyjątków; objętość odhaczonych serii zgadza się z wartościami */
    for (const e of store.getState().exercises.filter(x => ['ex-squat', 'ex-goblet', 'ex-pull', 'ex-plank', 'ex-custom', 'ex-old'].includes(x.id))) { stats.sessionsFor(e); stats.recordsFor(e); }
    expect(stats.recordsFor(store.exById('ex-squat')!).maxLoad).toBe(102.5);
    const csv = parseCsvRfc(buildCsv()); expect(csv.length).toBe(1 + 8); /* 8 odhaczonych serii w historii (bez nieodhaczonej i bez treningu w toku); notatka z \n w cudzysłowie */
    expect(csv.every(r => r.length === 12)).toBe(true); expect(csv.filter(r => r[3] === 'Wyciskanie, "moje" 💪').map(r => r[9])).toEqual([NOTE]);
  });
});

describe('prawdziwe zapisy (fixtures) — bez utraty danych i niezmienniki', () => {
  const web03 = require('./fixtures/web03-backup.json'); const fx15 = require('./fixtures/state-090-schema15.json');
  const doneSets = (s: any, active = false) => (s.workouts as any[]).flatMap(w => (w.exercises ?? []).flatMap((e: any) => (e.sets ?? []).filter((x: any) => active || x.done).map((x: any) => [w.id, e.exerciseId, x.id ?? null, x.weight, x.reps])));
  test.each([['web 0.3 (bez numeru schematu)', web03, null], ['0.9.0 (schemat 15, „state” + „live”)', fx15.state, fx15.live]] as const)('%s', async (_n, raw, live) => {
    await fresh(); global.__kv.clear(); global.__kv.set('state', J(raw)); if (live) global.__kv.set('live', J(live));
    store.__resetForTests(); await store.init(); const st = store.getState(); expect(store.getRecovery()).toBeNull();
    expect(stateProblems(st)).toEqual([]);
    /* każda odhaczona seria historii z tym samym ćwiczeniem i wartościami (kg na siatce 0,01 — w fixtures wszystkie już na niej są) */
    /* research biblioteki (09.10.2026): ćwiczenie scalone przechodzi na docelowe (id docelowego), przemianowane — nowa nazwa kanoniczna */
    const moved = (id: string) => { if (st.exercises.some(x => x.id === id)) return id; const e = raw.exercises.find((x: any) => x.id === id); const k = e && LIB_MERGED[e.libKey ?? e.name]; return k ? st.exercises.find(x => x.libKey === k)!.id : id; };
    const want = doneSets(raw).map(r => [r[0], moved(r[1]), r[3], r[4]]); const got = st.workouts.flatMap(w => w.exercises.flatMap(e => e.sets.map(x => [w.id, e.exerciseId, x.weight, x.reps])));
    expect(got.sort()).toEqual(want.sort());
    /* każde ćwiczenie i szablon (z każdą pozycją) zostaje; nazwy bez zmian (poza spacjami na brzegach) */
    for (const e of raw.exercises) { const n = e.name.replace(/\s+/g, ' ').trim(); if (LIB_MERGED[n] && moved(e.id) !== e.id) continue; const k = LIB_RENAMED[n] ?? n; const got = st.exercises.find(x => x.id === e.id); expect(got?.name).toBe(got?.lib && got.libKey === k ? LIB_DISPLAY_NAME[k] ?? k : k); } /* SEC2-01: nieprzemianowane ćwiczenie biblioteki ze znakiem towarowym → nazwa ogólna */
    for (const t of raw.templates) { const g = st.templates.find(x => x.id === t.id || (t.id == null && x.name === t.name)); expect(g?.items.map(i => [i.exerciseId, i.sets, i.startWeight])).toEqual(t.items.map((i: any) => [moved(i.exerciseId), i.sets, i.startWeight === undefined ? '' : i.startWeight])); }
    const act = live ? live.active : raw.active; expect(st.active?.id).toBe(act.id); expect(st.active!.exercises.flatMap(e => e.sets.map(x => [x.weight, x.reps, x.done]))).toEqual(act.exercises.flatMap((e: any) => e.sets.map((x: any) => [x.weight, x.reps, x.done])));
    expect(st.bands.map(b => [b.id, b.level])).toEqual(raw.bands.map((b: any) => [b.id, b.level]));
    expect(strip(store.migrate(clone(st)))).toEqual(strip(st));
  });
});

describe('start aplikacji na zapisie z każdej wersji schematu (prawdziwe ekrany)', () => {
  let errs: unknown[][] = []; let spy: jest.SpyInstance;
  beforeEach(() => { errs = []; spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => { if (!/not wrapped in act/.test(String(a[0]))) errs.push(a); }); });
  afterEach(() => spy.mockRestore());
  test.each(VERSIONS)('schemat %i: ekran główny, historia, szczegóły treningu, postępy, szablon i backup — bez błędu', async v => {
    const raw = shape(v, Date.now());
    await renderApp({ saved: raw }); await flushAll(50);
    expect(store.getRecovery()).toBeNull(); /* zapis nie trafił do „nieczytelnych danych” */
    const st = store.getState(); expect(st.workouts.map(w => w.id).sort()).toEqual(['w1', 'w2']); expect(st.active?.id).toBe('act');
    expect(screen.toJSON()).toBeTruthy();
    for (const href of ['/history', '/history/w1', '/history/w2', '/more/progress?ex=ex-squat', '/more/progress?ex=ex-plank', '/template/tpl-a', '/exercise/ex-custom', '/more/backup', '/more/settings', '/more/locations', '/more/bands', '/exercises']) {
      await go(href); await flushAll(50); expect({ v, href, ok: !!screen.toJSON() }).toEqual({ v, href, ok: true });
    }
    await go('/history/w1'); await flushAll(50);
    expect(screen.queryAllByText(/Wyciskanie, "moje" 💪/).length).toBeGreaterThan(0); /* własna nazwa z przecinkiem, cudzysłowem i emoji */
    expect({ v, errors: errs.map(a => String(a[0]).slice(0, 200)) }).toEqual({ v, errors: [] });
  });
});

/* Kontrola: ćwiczenia z nazwą z pierwszych 125 biblioteki w danych sprzed 10 dostają lib; własne o nazwie spoza listy — nie (audyt 04.10, LOW). */
test('kontrola drabiny: każda nazwa ćwiczenia z kształtów wersji jest w katalogu bazowym (inaczej gałąź < 10 nie byłaby sprawdzona)', () => {
  for (const n of ['Back Squat', 'Goblet Squat', 'Pull Up', 'Plank']) expect(LIB_BASE_NAMES.has(n)).toBe(true);
  expect(LIB_BASE_NAMES.has('Wyciskanie, "moje" 💪')).toBe(false);
});
