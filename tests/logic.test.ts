/* Warstwa A planu testów (09): logika i dane. Każdy test ma identyfikator z planu. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import * as units from '@/lib/units';
import * as i18n from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { buildCsv, parseBackup, buildBackup } from '@/lib/backup';
import { decodeB64, parseExpiry } from '@/lib/signing';
import { SCHEMA_VERSION, GROUPS, MUSCLES, METRIC_LABEL, LOAD_MODE_LABEL, MODULE_LABEL, SET_KIND_LABEL, LIB, seedState } from '@/lib/seed';
import { setBodyMass, fresh, saved, ex, addWorkout, set } from './helpers';

const DAY = 86400e3;
const at = (y: number, m: number, d: number, h = 18) => new Date(y, m - 1, d, h).getTime();

describe('A1 migracje', () => {
  test('goły stan web 0.3 (bez id, bez nowych pól) → schemat bieżący', () => {
    const raw = { exercises: [{ id: 'x', name: 'Bench Press (hantle)', group: 'klatka', equipment: 'hantle', bandAssistable: false, tempo: '', notes: '' }], templates: [{ name: 'A', items: [{ exerciseId: 'x', sets: 3, repMin: 8, repMax: 10, restSec: 90, startWeight: 20 }] }], bands: [{ color: 'czerwona', level: 2 }], workouts: [{ templateId: null, templateName: 'A', startedAt: 1, finishedAt: 2, note: '', exercises: [{ exerciseId: 'x', restSec: 90, repMin: 8, repMax: 10, sets: [{ weight: 20, reps: 8, bandId: '', warmup: false, done: true }] }] }], mornings: [{ date: '2026-09-01', bb: 50, sleepScore: 80, sleepH: 7 }], settings: { defaultRest: 120 } };
    const s = store.migrate(JSON.parse(JSON.stringify(raw)));
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    const w = s.workouts[0]; const st = w.exercises[0].sets[0];
    expect(typeof st.id).toBe('string'); expect(st.addKg).toBe(''); expect(st.note).toBe(''); expect(st.kind).toBe('normal');
    expect(typeof w.exercises[0].id).toBe('string'); expect(typeof s.templates[0].items[0].id).toBe('string');
    expect(s.exercises[0].lib).toBe(true); expect(s.mornings[0].weight).toBe('');
    expect(s.settings).toMatchObject({ defaultRest: 120, sound: true, wakeLock: true, showRpe: false, language: 'auto', unit: 'kg' });
  });
  test('idempotencja', () => {
    const a = store.migrate(JSON.parse(JSON.stringify(seedState())));
    const b = store.migrate(JSON.parse(JSON.stringify(a)));
    expect(b).toEqual(a);
  });
  test('uszkodzone wpisy nie wywracają migracji', () => {
    const raw: any = seedState(); raw.workouts = [null, 5, { startedAt: 1, exercises: [null, { exerciseId: 'x', sets: [null, { done: true }] }] }]; raw.mornings = [null]; raw.bands = [{ color: '', level: 0 }]; raw.settings = 'zepsute'; raw.timer = null; raw.active = 'x';
    const s = store.migrate(raw);
    expect(s.workouts).toHaveLength(1); expect(s.workouts[0].exercises).toHaveLength(1); expect(s.workouts[0].exercises[0].sets).toHaveLength(1);
    expect(s.mornings).toHaveLength(0); expect(s.bands[0].color).toBe('?'); expect(s.bands[0].level).toBe(1); expect(s.settings.defaultRest).toBe(90); expect(s.active).toBeNull();
  });
  test('schemat 9 → 10: jeden hantel liczony ×1, stoper po id', () => {
    const raw: any = seedState(); raw.schemaVersion = 9; raw.exercises.find((e: any) => e.name === 'Goblet Squat').loadMode = 'per_dumbbell'; raw.timer = { restEndAt: null, restTotal: 0, setStartAt: null, setTarget: 0, setEi: 2, setSi: 1 };
    const s = store.migrate(raw);
    expect(s.exercises.find(e => e.name === 'Goblet Squat')!.loadMode).toBe('total');
    expect(s.timer).toEqual({ restEndAt: null, restTotal: 0, restSetId: null, setStartAt: null, setTarget: 0, setId: null });
  });
});

describe('A2 start', () => {
  test('pusty telefon → dane startowe w języku systemu (EN)', async () => {
    const s = await fresh(undefined, 'en');
    expect(s.templates).toEqual([]); /* decyzja 03.10.2026 (08:11): bez szablonów właściciela — ustawia je sam */ expect(s.bands[0].color).toBe('red');
    expect(i18n.lang()).toBe('en'); expect(saved().schemaVersion).toBe(SCHEMA_VERSION);
  });
  test('nieczytelny zapis nie jest nadpisany — kopia i baner odzysku', async () => {
    const bad = '{"exercises": [ zepsute';
    await fresh(bad);
    const keys = [...global.__kv.keys()]; const copy = keys.find(k => k.startsWith('state_corrupt_'))!;
    expect(copy).toBeTruthy(); expect(global.__kv.get(copy)).toBe(bad);
    expect(store.getRecovery()).not.toBeNull(); expect(await store.readRecovery()).toBe(bad);
    expect(store.getState().templates).toEqual([]); expect(store.getState().exercises.length).toBe(seedState().exercises.length); /* czysty stan startowy (od 03.10.2026 bez szablonów) */
  });
  test('stary schemat zapisany od razu po migracji', async () => {
    const old: any = seedState(); old.schemaVersion = 5; delete old.settings.language;
    await fresh(old);
    expect(saved().schemaVersion).toBe(SCHEMA_VERSION); expect(saved().settings.language).toBe('auto');
  });
});

describe('A3 zapis', () => {
  test('debounce, flush i błąd zapisu z odzyskaniem', async () => {
    await fresh();
    store.getState().settings.defaultRest = 150; store.save();
    expect(saved().settings.defaultRest).toBe(90);
    await store.flush(); expect(saved().settings.defaultRest).toBe(150);
    global.__dbFail = true; store.getState().settings.defaultRest = 60; store.save(); await store.flush();
    expect(store.getPersistError()).toBe('disk full');
    global.__dbFail = false; await store.flush();
    expect(store.getPersistError()).toBeNull(); expect(saved().settings.defaultRest).toBe(60);
  });
  test('useTick: każda zmiana podbija licznik (ekrany nie są spóźnione o jedną zmianę)', async () => {
    await fresh();
    const r0 = store.getHistRev(); store.save(); store.save();
    expect(store.getHistRev()).toBe(r0 + 2);
  });
  test('zmiana treningu w toku nie unieważnia cache historii', async () => {
    await fresh(); store.startEmpty(); const r0 = store.getHistRev();
    store.save(store.getState().active); expect(store.getHistRev()).toBe(r0);
  });
});

describe('A4 obliczenia', () => {
  beforeEach(async () => { await fresh(); });
  test('objętość: jedna definicja w historii, tygodniu i sesji', () => {
    const now = new Date(); const t0 = stats.thisMonday(0, now) + 10 * 3600e3;
    const w = addWorkout(t0, [
      ['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5, kind: 'warmup', warmup: true }]],
      ['Bench Press (hantle)', [{ weight: 20, reps: 10 }]],
      ['Goblet Squat', [{ weight: 30, reps: 10 }]],
      ['Pull Up', [{ addKg: -20, reps: 10 }, { addKg: 10, reps: 5 }]],
    ]);
    const expected = 100 * 5 + 2 * 20 * 10 + 30 * 10 + 10 * 5; /* runda 75 (Q-001): masa ciała poza obliczeniami — asysta to 0, liczy się tylko dociążenie */
    expect(store.volume(w)).toBe(expected);
    expect(stats.weeklyTotals(8, now)[7].volume).toBe(expected);
    const sum = ['Back Squat', 'Bench Press (hantle)', 'Goblet Squat', 'Pull Up'].reduce((a, n) => a + stats.sessionsFor(ex(n)).reduce((b, s) => b + s.volume, 0), 0);
    expect(sum).toBe(expected);
  });
  test('masa ciała: własne ćwiczenie przełączone na masę ciała liczy ×1', () => {
    const e = store.newExercise('Ring Dip'); store.setEquipment(e, 'masa ciała');
    expect(store.exMult(e)).toBe(1); expect(e.loadMode).toBe('total'); expect('bodyweightPct' in e).toBe(false);
  });
  test('e1RM Epley i reps 1', () => { expect(stats.e1rm(100, 1)).toBe(100); expect(stats.e1rm(100, 5)).toBeCloseTo(116.667, 2); expect(stats.e1rm(100, 0)).toBe(0); });
  test('PR: identyczne serie → jeden PR, kolejne słabsze bez fałszywego e1RM', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 3 }]]]);
    const w = addWorkout(at(2026, 9, 8), [['Back Squat', [{ weight: 102, reps: 10 }, { weight: 100, reps: 8 }, { weight: 102, reps: 10 }]]]);
    const map = stats.prMap(w); const sets = w.exercises[0].sets;
    expect(map.get(sets[0].id)).toEqual(['e1RM', 'objętość treningu']); /* runda 73: rekord = e1RM + suma na treningu */
    expect(map.get(sets[1].id)).toBeUndefined(); expect(map.get(sets[2].id)).toBeUndefined();
    expect(stats.workoutPRs(w)).toHaveLength(1);
  });
  test('PR: masa ciała z dnia treningu, nie z dziś', () => {
    const s = store.getState();
    s.mornings.push({ id: 'm1', ownerId: 'local', createdAt: 0, updatedAt: 0, date: '2026-01-05', bb: '', sleepScore: '', sleepH: '', weight: 80 });
    addWorkout(at(2026, 1, 10), [['Pull Up', [{ reps: 10 }]]]);
    const w2 = addWorkout(at(2026, 1, 12), [['Pull Up', [{ reps: 10 }]]]);
    s.mornings.push({ id: 'm2', ownerId: 'local', createdAt: 0, updatedAt: 0, date: '2026-09-01', bb: '', sleepScore: '', sleepH: '', weight: 90 }); store.save();
    expect(stats.prMap(w2).size).toBe(0);
  });
  test('to samo ćwiczenie dwa razy w treningu liczone w całości', () => {
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 60, reps: 5 }]], ['Back Squat', [{ weight: 100, reps: 5 }]]]);
    expect(stats.recordsFor(ex('Back Squat')).maxLoad).toBe(100);
    expect(store.previousFor(ex('Back Squat').id)!.sets.map(s => s.weight)).toEqual([60, 100]);
    expect(stats.sessionsFor(ex('Back Squat'))[0].volume).toBe(store.volume(w));
  });
  test('tydzień od poniedziałku odporny na zmianę czasu (październik)', () => {
    const now = new Date(2026, 10, 4, 12); // 4 XI 2026, po zmianie czasu 25 X
    const weeks = stats.weeklyTotals(8, now);
    weeks.forEach(w => { const d = new Date(w.weekStart); expect(d.getDay()).toBe(1); expect(d.getHours()).toBe(0); });
    addWorkout(new Date(2026, 9, 19, 0, 30).getTime(), [['Back Squat', [{ weight: 100, reps: 1 }]]]);
    const wk = stats.weeklyTotals(8, now).find(w => new Date(w.weekStart).getDate() === 19)!;
    expect(wk.workouts).toBe(1);
  });
  test('partie: główna 1, pomocnicza 0,5', () => {
    const t0 = stats.thisMonday() + 3600e3;
    addWorkout(t0, [['Bench Press (sztanga)', [{ weight: 60, reps: 8 }, { weight: 60, reps: 8 }]]]);
    const m = stats.weeklySetsByMuscle(stats.thisMonday());
    expect(m.klatka).toBe(2); expect(m.triceps).toBe(1); expect(m.barki).toBe(1);
  });
  test('najlepsza seria dystansu: przy równym dystansie szybsza', () => {
    const e = ex('Bieg'); expect(store.setScore(e, set({ distanceM: 5000, durationSec: 1500 }))).toBeGreaterThan(store.setScore(e, set({ distanceM: 5000, durationSec: 1800 })));
  });
  test('ujemne i ułamkowe powtórzenia nie psują objętości', () => {
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: -5 }, { weight: 100, reps: 2.7 }]]]);
    expect(store.volume(w)).toBe(200);
  });
});

describe('A5 przerwy i supersety', () => {
  beforeEach(async () => { await fresh(); });
  test('superset: przerwa po ostatnim, nierówne serie, 0 s', () => {
    store.startEmpty(); const a = store.getState().active!;
    store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Pull Up')); store.addSet(0);
    store.linkWithNext(a.exercises, 0, a);
    expect(store.toggleDone(0, 0)).toBeNull();
    expect(store.toggleDone(1, 0)).toBe(90);
    expect(store.toggleDone(0, 1)).toBe(90); // późniejsze ćwiczenie grupy nie ma już serii → przerwa
    a.exercises[1].restSec = 0; store.addSet(1); expect(store.toggleDone(1, 1)).toBe(0);
  });
  test('rozgrzewka z własną przerwą; autouzupełnianie nie przenosi rozgrzewki na serię roboczą', () => {
    store.startEmpty(); const a = store.getState().active!; const e = ex('Back Squat'); e.restWarmupSec = 45;
    store.addExerciseToActive(e); store.addSet(0);
    const s0 = a.exercises[0].sets[0]; s0.kind = 'warmup'; s0.warmup = true; s0.weight = 40; s0.reps = 10;
    expect(store.toggleDone(0, 0)).toBe(45); expect(a.exercises[0].sets[1].weight).toBe('');
  });
  test('rzeczywista przerwa po cofnięciu odhaczenia i ponownym', () => {
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0);
    const a = store.getState().active!; const now = Date.now();
    store.toggleDone(0, 0); a.exercises[0].sets[0].completedAt = now - 120e3;
    store.toggleDone(0, 1); expect(a.exercises[0].sets[1].actualRest).toBeGreaterThanOrEqual(119);
    store.toggleDone(0, 1); store.toggleDone(0, 1); expect(a.exercises[0].sets[1].actualRest).toBeGreaterThanOrEqual(119);
  });
  test('grupy: rozerwanie w środku, scalanie i przesunięcie zostawiają poprawne grupy', () => {
    const g = (xs: (string | null)[]) => xs.map(groupId => ({ groupId }));
    const l1 = g(['g', 'g', 'g', null]); store.unlink(l1, 1); expect(l1.map(x => x.groupId)).toEqual([null, null, null, null]);
    const l2 = g(['a', 'a', 'b', 'b']); store.linkWithNext(l2, 1); expect(new Set(l2.map(x => x.groupId)).size).toBe(1);
    const l3 = g(['a', 'a', null]); store.moveItem(l3, 1, 1); expect(l3.map(x => x.groupId)).toEqual([null, null, null]);
    const l4 = g(['a', 'a', 'a', null]); store.moveItem(l4, 2, 1); expect(l4.map(x => x.groupId)).toEqual(['a', 'a', null, null]);
    const l5 = g(['a', 'a', null, 'a', 'a']); store.normalizeGroups(l5); expect(l5[0].groupId).toBe('a'); expect(l5[3].groupId).not.toBe('a'); expect(l5[3].groupId).toBe(l5[4].groupId);
  });
});

describe('A6 jednostki', () => {
  test('lb ↔ kg bez dryfu i formaty liczb', () => {
    units.applyUnit('lb');
    for (const lb of [135, 12.5, 45, 225, 2.5]) expect(units.wOut(units.wIn(lb) as number)).toBe(lb);
    i18n.applyLang('pl'); expect(units.fmtW(100)).toBe('220,5 lb');
    units.applyUnit('kg'); expect(units.fmtW(61.25)).toBe('61,25 kg'); expect(units.wField(61.23496995)).toBe(61.23);
    i18n.applyLang('en'); expect(units.fmtW(62.5)).toBe('62.5 kg'); i18n.applyLang('pl');
  });
});

describe('A7 backup i CSV', () => {
  beforeEach(async () => { await fresh(); });
  test('koperta i goły stan; nowszy schemat odrzucony także bez koperty', () => {
    const env = JSON.stringify(buildBackup()); expect(parseBackup(env).schemaVersion).toBe(SCHEMA_VERSION);
    const bare: any = seedState(); bare.schemaVersion = 99;
    expect(() => parseBackup(JSON.stringify(bare))).toThrow(/99/);
  });
  test('CSV: cudzysłowy, \\r, numeracja serii roboczych, nazwy ćwiczeń', () => {
    addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 40, reps: 10, kind: 'warmup', warmup: true }, { weight: 100, reps: 5, note: 'a,"b"\rc' }, { weight: 100, reps: 5 }]]]);
    const rows = buildCsv().trim().split('\n');
    expect(rows[1]).toContain(',W,'); expect(rows[2]).toContain(',1,'); expect(rows[3]).toContain(',2,');
    expect(rows[2]).toContain('"a,""b""\rc"');
  });
  test('usunięte ćwiczenie z historią zostaje w CSV i objętości', () => {
    const w = addWorkout(at(2026, 9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    store.deleteExercise(ex('Back Squat').id);
    expect(store.visibleExercises().some(e => e.name === 'Back Squat')).toBe(false);
    expect(store.volume(w)).toBe(500); expect(buildCsv()).toContain('Back Squat');
  });
});

describe('A8 tłumaczenia', () => {
  test('wartości domenowe mają EN', () => {
    const dyn = [...GROUPS, ...MUSCLES, 'hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne', ...Object.values(METRIC_LABEL), ...Object.values(LOAD_MODE_LABEL), ...Object.values(MODULE_LABEL), ...Object.values(SET_KIND_LABEL), 'ciężar', 'powtórzenia', 'czas', 'dystans', 'czerwona', 'czarna', 'fioletowa', 'nowa', 'Jak w telefonie'];
    expect(dyn.filter(k => !(k in EN) && k !== 'e1RM')).toEqual([]);
  });
  test('liczebniki PL i EN', () => {
    i18n.applyLang('pl'); const f = 'seria|serie|serii';
    expect([1, 2, 4, 5, 12, 14, 22, 25, 2.5].map(n => i18n.tp(n, f))).toEqual(['seria', 'serie', 'serie', 'serii', 'serii', 'serii', 'serie', 'serii', 'serii']);
    i18n.applyLang('en'); expect([1, 2, 2.5].map(n => i18n.tp(n, f))).toEqual(['set', 'sets', 'sets']); i18n.applyLang('pl');
  });
  test('nazwy biblioteki w EN bez polskich słów', () => {
    i18n.applyLang('en');
    const bad = LIB.map(l => i18n.exName({ name: l[0], lib: true })).filter(n => /[ąćęłńóśźż]|\((sztanga|hantle|hantel|linki|ławka|bieżnia)\)/i.test(n));
    i18n.applyLang('pl'); expect(bad).toEqual([]);
  });
  test('wymuszony English na brytyjskim telefonie → daty en-GB', () => {
    global.__locales = [{ languageCode: 'en', languageTag: 'en-GB' }]; i18n.applyLang('en'); expect(i18n.locale()).toBe('en-GB'); i18n.applyLang('pl');
  });
});

describe('A9 podpis', () => {
  test('data z profilu zakodowanego base64', () => {
    const xml = '0\u0082garbage<plist><dict><key>ExpirationDate</key><date>2026-10-07T12:00:00Z</date></dict></plist>';
    const b64 = Buffer.from(xml, 'latin1').toString('base64');
    expect(parseExpiry(decodeB64(b64))!.toISOString()).toBe('2026-10-07T12:00:00.000Z');
    expect(parseExpiry('brak')).toBeNull();
  });
});

test('A2b localDateTs to lokalna północ', () => { const t = store.localDateTs('2026-09-30'); const d = new Date(t); expect([d.getHours(), d.getDate()]).toEqual([0, 30]); });
/* audyt 0.10 (E1): e1RM ćwiczeń z masą ciała tylko z masą ciała z Ustawień (Epley na masie + ±kg); poranna waga nadal nic nie zmienia */
test('A4b poranna waga nie zmienia objętości ani e1RM; objętość z dociążenia; e1RM tylko z masą ciała z Ustawień (E1)', async () => {
  await fresh(); const s = store.getState(); const pull = ex('Pull Up');
  const w = addWorkout(at(2026, 9, 10), [['Pull Up', [{ addKg: 10, reps: 5 }, { addKg: 0, reps: 8 }, { addKg: -15, reps: 10 }]]]);
  const before = [store.volume(w), stats.recordsFor(pull).bestE1rm];
  s.mornings.push({ id: 'a', ownerId: 'local', createdAt: 0, updatedAt: 0, date: '2026-09-01', bb: '', sleepScore: '', sleepH: '', weight: 80 }); store.save();
  expect([store.volume(w), stats.recordsFor(pull).bestE1rm]).toEqual(before);
  expect(before[0]).toBe(50); expect(before[1]).toBe(0);
  setBodyMass(80); expect(store.volume(w)).toBe(50); expect(stats.recordsFor(pull).bestE1rm).toBeCloseTo(Math.max(stats.e1rm(90, 5), stats.e1rm(80, 8), stats.e1rm(65, 10)), 6);
  void DAY;
});
