/*
 * Audyt 0.10 (08.10.2026, docs/25 grupa E i D3) — naprawy obszaru „statystyki”: rekordy, e1RM, liczenie serii, tożsamość ćwiczeń katalogu.
 * Każdy test odtwarza błąd z raportu (docs/audyt-0.10: MER, LOG, X, UI) i sprawdza poprawne zachowanie (testy robocze audytorów utrwalały błąd).
 * Rodzaje (docs/20): logika, dane (migrate, kopia), niezmienniki (te same liczby w każdym miejscu), regresja. Ekrany: tests/audit-0.10-stats-ui.test.tsx.
 */
import * as store from '@/lib/store';
import { e1rm, setPRs, recordsFor, prMap, workoutPRs, prCount, prCountOf, weeklyTotals, setsByMuscle, thisMonday, chartKeysFor, sessionsFor, bwShare, BW_SHARE, liftedLoad, bwE1Diff, fmtE1 } from '@/lib/stats';
import { periodSummary } from '@/lib/period';
import { lastWorkout, weekTiles } from '@/lib/dashboard';
import { deloadCounts } from '@/lib/start';
import { buildCsv, buildBackup, parseBackup, strongDur } from '@/lib/backup';
import { generate } from '@/lib/generator';
import { swapCandidates, FULL_BASE_REV } from '@/lib/swap';
import { muscleLoadOf, catalogKey, isLibBase, libExtraRevOf, libKeyFromFields, musclesSourced, MUSCLE_SOURCES, base, uid, LIB, type Template } from '@/lib/seed';
import { applyUnit } from '@/lib/units';
import { setBodyMass, fresh, saved, addWorkout, ex, set } from './helpers';

const NOW = new Date(2026, 9, 8, 18).getTime();
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const S = () => store.getState();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyUnit('kg'); });

describe('E3 / X-08 / LOG-06: liczba rekordów treningu — jedna funkcja (rekordy, nie serie — T13)', () => {
  test('110 × 5 po 100 × 5: okno po treningu i karta „Ostatni trening” podają tę samą liczbę (2: suma treningu i e1RM)', () => {
    addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]]);
    const w2 = addWorkout(at(9, 3), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 110, reps: 5 }]]]);
    const dialog = workoutPRs(w2).reduce((a, p) => a + p.details.length, 0); /* jak okno po „Zakończ” */
    expect(dialog).toBe(2); expect(prCount(w2)).toBe(2); expect(prCountOf(workoutPRs(w2))).toBe(2); expect(prCountOf([])).toBe(0); expect(lastWorkout()!.prs).toBe(2);
  });
  test('trening bez rekordu: 0; pierwszy trening ćwiczenia: 0 (T5)', () => {
    const w1 = addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(prCount(w1)).toBe(0);
    const w2 = addWorkout(at(9, 2), [['Back Squat', [{ weight: 90, reps: 5 }]]]); expect(prCount(w2)).toBe(0); expect(lastWorkout()!.prs).toBe(0);
  });
});

describe('D3 / LOG-07 / X-13 / UI-13: jedna definicja serii roboczych — drop set liczy się razem z serią, po której jest (uproszczenie)', () => {
  const kinds = (...k: ('normal' | 'drop' | 'warmup' | 'failure')[]) => k;
  test('workCount: rozgrzewki poza, drop razem z poprzednią serią, „do upadku” to zwykła seria; drop bez serii przed nim liczy się sam', () => {
    expect(store.workCount(kinds('warmup', 'normal', 'normal', 'normal', 'drop'))).toBe(3);
    expect(store.workCount(kinds('normal', 'drop', 'drop', 'failure'))).toBe(2);
    expect(store.workCount(kinds('warmup', 'drop'))).toBe(1);
    expect(store.workCount([])).toBe(0); expect(store.workCount(kinds('warmup', 'warmup'))).toBe(0);
  });
  test('workSetCount: tylko odhaczone serie robocze bloku, drop razem z poprzednią', () => {
    const sets = [set({ kind: 'warmup', warmup: true }), set({ kind: 'normal' }), set({ kind: 'drop' }), set({ kind: 'normal', done: false }), set({ kind: 'failure' })];
    expect(store.workSetCount(sets)).toBe(2); expect(store.workSetCount([])).toBe(0); expect(store.workSetCount([set({ kind: 'drop' })])).toBe(1);
  });
  test('szablon: rozgrzewka + 3 serie + drop — karta szablonu, pytanie deload i trening liczą 3 (LOG-07: było 4 / 3 / 4)', () => {
    const it = { id: uid(), exerciseId: ex('Back Squat').id, sets: 5, repMin: 5, repMax: 8, restSec: 120, startWeight: 100 as const, targetSec: '' as const, groupId: null,
      rows: (['warmup', 'normal', 'normal', 'normal', 'drop'] as const).map((k, i) => ({ id: 'r' + i, kind: k, reps: 5 as const, weight: 100 as const, durationSec: '' as const, distanceM: '' as const })) };
    const t: Template = { ...base(), name: 'D', items: [it] }; S().templates.push(t); store.save();
    expect(store.tplWorkSets(t)).toBe(3); expect(deloadCounts(t).full).toBe(3);
    addWorkout(at(9, 6), [['Back Squat', [{ kind: 'warmup', warmup: true, weight: 60, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { kind: 'drop', weight: 70, reps: 8 }]]]);
    const mon = thisMonday(0, new Date(at(9, 6)));
    expect(periodSummary('week', 0, new Date(at(9, 6))).sets).toBe(3); expect(weekTiles(at(9, 6)).sets).toBe(3); expect(lastWorkout()!.sets).toBe(3);
    expect(weeklyTotals(8, new Date(at(9, 6))).pop()!.sets).toBe(3);
    expect(setsByMuscle(mon, thisMonday(1, new Date(at(9, 6))))['czworogłowe']).toBe(3); /* kreska 10 serii: 3, nie 4 */
  });
  test('X-15: ćwiczenie spoza biblioteki (z importu) — lista Historii i Zdrowie liczą jak kafelek (pomijają blok bez ćwiczenia)', async () => {
    addWorkout(at(9, 6), [['Back Squat', [{ kind: 'warmup', warmup: true, weight: 60, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { kind: 'drop', weight: 80, reps: 8 }]], ['Bench Press (sztanga)', [{ weight: 80, reps: 5 }]]]);
    const st = JSON.parse(JSON.stringify(S())); const w = st.workouts[0]; w.exercises.push({ ...w.exercises[1], id: 'zz', exerciseId: 'missing-ex', sets: w.exercises[1].sets.map((s: { id: string }) => ({ ...s, id: s.id + 'm' })) });
    await fresh(st);
    const hw = store.finishedWorkouts()[0];
    expect(store.workingSets(hw)).toBe(3); expect(weekTiles(NOW).sets).toBe(3); expect(lastWorkout()!.sets).toBe(3);
    const hk = require('@kingstinct/react-native-healthkit').default; const sv = jest.spyOn(hk, 'saveWorkoutSample').mockImplementation(async () => 'uuid-1');
    const health = require('@/lib/health'); expect(await health.saveWorkout(hw)).toBe('saved');
    expect((sv.mock.calls[0] as any[])[3].metadata.Sets).toBe(3); sv.mockRestore();
  });
});

describe('E2 / X-03: trwały klucz katalogu (libKey) — zmiana nazwy ćwiczenia z biblioteki nie zmienia obliczeń', () => {
  test('nowe ćwiczenia biblioteki mają libKey = nazwa kanoniczna; własne — bez klucza', () => {
    for (const e of S().exercises) { expect(e.lib).toBe(true); expect(e.libKey).toBe(e.name); }
    const own = store.newExercise('Moje'); expect(own.libKey).toBeUndefined(); expect(catalogKey(own)).toBeUndefined();
  });
  test('Cable Fly na stacji (×2, Q-024): po zmianie nazwy objętość, rekord sumy i podsumowanie okresu bez zmian (było 400 → 200)', () => {
    const cf = ex('Cable Fly'); const w = addWorkout(at(9, 6), [['Cable Fly', [{ weight: 20, reps: 10 }]]]); w.exercises[0].impl = 'electric'; store.save();
    const v1 = store.volume(w), r1 = recordsFor(cf).bestTotal, p1 = periodSummary('week', 0, new Date(NOW)).volume; expect(v1).toBe(400);
    cf.name = 'Rozpiętki na linkach'; store.save(cf);
    expect([store.volume(w), recordsFor(cf).bestTotal, periodSummary('week', 0, new Date(NOW)).volume]).toEqual([v1, r1, p1]);
  });
  test('generator: po zmianie nazwy „Back Squat” → „Przysiad” pierwsze ćwiczenie to nadal to samo (było: Front Squat)', () => {
    const inp = { goal: 'hypertrophy' as const, locationId: null, sessions: 3, minutes: 60 };
    const first = () => generate(inp).templates[0].items[0].exerciseId;
    const before = first(); const sq = ex('Back Squat'); expect(before).toBe(sq.id); expect(isLibBase(sq)).toBe(true);
    sq.name = 'Przysiad'; store.save(sq); expect(first()).toBe(before);
  });
  test('obciążenie partii z katalogu i krok katalogu w zamianach idą po kluczu, nie po nazwie', () => {
    const sq = ex('Back Squat'); const load = muscleLoadOf(sq); expect(load.length).toBeGreaterThan(0);
    sq.name = 'Przysiad'; expect(muscleLoadOf(sq)).toEqual(load);
    const own = store.newExercise('Back Squat'); expect(muscleLoadOf(own)).toEqual([]); /* własne o nazwie z katalogu nie udaje biblioteki */
  });
  test('zamiany: ćwiczenie z pełnej bazy po zmianie nazwy zostaje za biblioteką przejrzaną przez właściciela (remis punktów — libExtraRevOf po kluczu)', () => {
    const ctx = { showAll: true, inWorkout: new Set<string>() };
    const bp = ex('Bench Press (sztanga)'); const c = swapCandidates(bp.id, ctx);
    const step = (id: string) => libExtraRevOf(catalogKey(store.exById(id)!) ?? '');
    const full = (id: string) => step(id) === FULL_BASE_REV;
    const pair = c.flatMap((x, i) => c.slice(0, i).filter(y => y.score === x.score && !full(y.exId) && full(x.exId)).map(y => [y, x] as const))[0];
    expect(pair).toBeTruthy(); const [y, x] = pair!;
    store.exById(x.exId)!.name = 'AAA przemianowane'; store.save();
    const c2 = swapCandidates(bp.id, ctx); expect(c2.findIndex(z => z.exId === y.exId)).toBeLessThan(c2.findIndex(z => z.exId === x.exId));
  });
  test('migrate: libKey z nazwy kanonicznej (dane sprzed klucza), zostaje po zmianie nazwy; nieznany klucz odpada; własne bez klucza; idempotentne', async () => {
    const st = JSON.parse(JSON.stringify(S())); for (const e of st.exercises) delete e.libKey;
    const sq = st.exercises.find((e: { name: string }) => e.name === 'Back Squat'); const cf = st.exercises.find((e: { name: string }) => e.name === 'Cable Fly');
    cf.libKey = 'Nie ma takiego'; st.exercises.push({ ...sq, id: 'own1', name: 'Moje ćwiczenie', lib: undefined, libKey: 'Back Squat' });
    await fresh(st);
    expect(ex('Back Squat').libKey).toBe('Back Squat'); expect(ex('Cable Fly').libKey).toBe('Cable Fly'); expect(ex('Moje ćwiczenie').libKey).toBeUndefined();
    ex('Back Squat').name = 'Przysiad'; store.save(); await store.flush();
    const once = saved(); await fresh(once); expect(ex('Przysiad').libKey).toBe('Back Squat');
    const a = JSON.stringify(store.migrate(JSON.parse(JSON.stringify(S())))); expect(store.migrate(JSON.parse(a))).toEqual(JSON.parse(a));
  });
  test('migrate: przemianowane ćwiczenie biblioteki bez klucza (dane sprzed poprawki) — klucz odzyskany z pól katalogu, gdy jednoznaczne; inaczej brak', async () => {
    const st = JSON.parse(JSON.stringify(S())); for (const e of st.exercises) delete e.libKey;
    const cf = st.exercises.find((e: { name: string }) => e.name === 'Cable Fly'); cf.name = 'Rozpiętki';
    const pu = st.exercises.find((e: { name: string }) => e.name === 'Pull Up'); pu.name = 'Podciąganie'; pu.muscles = ['biceps']; /* zmienione pola — bez pewności */
    await fresh(st);
    const keyed = (n: string) => S().exercises.find(e => e.name === n)!.libKey;
    /* „Cable Fly” ma w katalogu jednoznaczny zestaw pól (partia, sprzęt, metryka, wzorzec, wymagania…) — klucz wraca; „Pull Up” z innymi partiami — nie */
    expect(keyed('Rozpiętki')).toBe('Cable Fly'); expect(keyed('Podciąganie')).toBeUndefined();
    expect(LIB.filter(r => r[0] === 'Cable Fly').length).toBe(1);
  });
  test('libKeyFromFields: jednoznaczny zestaw pól katalogu → klucz; zmienione pola albo zestaw wspólny kilku ćwiczeń → undefined', () => {
    const cf = ex('Cable Fly'); expect(libKeyFromFields(cf)).toBe('Cable Fly'); expect(libKeyFromFields({ ...cf, muscles: ['biceps'] })).toBeUndefined();
    const amb = LIB.map(r => r[0]).filter(n => { const e = S().exercises.find(x => x.name === n); return e && libKeyFromFields(e) === undefined; });
    expect(amb.length).toBeGreaterThan(0); /* niektóre ćwiczenia mają te same pola co inne — tych nie odzyskujemy (bez zgadywania) */
  });
  test('E4: musclesSourced — dopisek „uproszczenie” znika tylko dla ćwiczenia ze źródłami i nietkniętymi partiami', () => {
    const sq = ex('Back Squat'); expect(musclesSourced(sq)).toBe(false); expect(Object.keys(MUSCLE_SOURCES)).toEqual([]);
    const reg = MUSCLE_SOURCES as Record<string, string>; reg['Back Squat'] = 'test';
    try { expect(musclesSourced(sq)).toBe(true); expect(musclesSourced({ ...sq, secondaryMuscles: [] })).toBe(false); expect(musclesSourced({ ...sq, lib: undefined })).toBe(false); }
    finally { delete reg['Back Squat']; }
  });
  test('kopia zapasowa: libKey przechodzi eksport → import bez zmian', () => {
    const sq = ex('Back Squat'); sq.name = 'Przysiad'; store.save(sq);
    const back = parseBackup(JSON.stringify(buildBackup())); expect(back.exercises.find(e => e.id === sq.id)!.libKey).toBe('Back Squat');
  });
});

describe('E1 / MER-03 / LOG-02: e1RM w ćwiczeniach z masą ciała — Epley na podnoszonym ciężarze (masa ciała z Ustawień), bez masy ciała — brak e1RM', () => {
  const bm = (kg?: number) => setBodyMass(kg); /* fala 2: pomiar z dniem przed historią testu */
  test('bez masy ciała: brak e1RM i odznaki e1RM dla Pull Up (było: e1RM z samego dociążenia, +30 × 3 „biło” +20 × 8)', () => {
    const pu = ex('Pull Up'); addWorkout(at(9, 1), [['Pull Up', [{ addKg: 20, reps: 8 }]]]);
    const rec = recordsFor(pu); expect(rec.bestE1rm).toBe(0); expect(rec.e1rmAny).toBe(false);
    expect(setPRs(pu, set({ addKg: 30, reps: 3 }), rec)).toEqual([]);
    expect(chartKeysFor(pu).map(k => k.key)).not.toContain('bestE1rm');
    /* max dociążenie i suma powtórzeń zostają */
    expect(rec.maxLoad).toBe(20); expect(rec.bestTotal).toBe(8);
  });
  test('z masą ciała 80 kg: e1RM = Epley(80 + 20, 8) = 126,7; +30 × 3 (Epley 121) nie jest rekordem — kolejność jak w rachunku', () => {
    bm(80); const pu = ex('Pull Up'); addWorkout(at(9, 1), [['Pull Up', [{ addKg: 20, reps: 8 }]]]);
    const rec = recordsFor(pu); expect(rec.bestE1rm).toBeCloseTo(e1rm(100, 8), 6); expect(rec.bestE1rm).toBeCloseTo(126.667, 2);
    expect(setPRs(pu, set({ addKg: 30, reps: 3 }), rec, 80)).toEqual([]); expect(e1rm(110, 3)).toBeCloseTo(121, 6);
    expect(setPRs(pu, set({ addKg: 30, reps: 6 }), rec, 80)).toEqual(['e1RM']); /* Epley(110, 6) = 132 > 126,7 */
    expect(chartKeysFor(pu).find(k => k.key === 'bestE1rm')!.label).toBe('e1RM');
  });
  test('LOG-02: historia +15 × 8, nowy trening +20 × 3 — przy masie ciała to nie jest rekord e1RM (95 × 8 = 120,3 > 100 × 3 = 110)', () => {
    bm(80); addWorkout(at(9, 1), [['Pull Up', [{ addKg: 15, reps: 8 }]]]); const w2 = addWorkout(at(9, 4), [['Pull Up', [{ addKg: 20, reps: 3 }]]]);
    expect([...prMap(w2).values()].flat()).not.toContain('e1RM');
    bm(undefined); expect([...prMap(w2).values()].flat()).not.toContain('e1RM');
  });
  test('asysta (−kg) odejmuje się od masy ciała; guma bez kg — brak e1RM (obciążenie nieznane)', () => {
    bm(80); const pu = ex('Pull Up'); addWorkout(at(9, 1), [['Pull Up', [{ addKg: -20, reps: 5 }]]]);
    expect(recordsFor(pu).bestE1rm).toBeCloseTo(e1rm(60, 5), 6);
    const b = S().bands[0]; addWorkout(at(9, 2), [['Pull Up', [{ bandId: b.id, reps: 10 }]]]); expect(sessionsFor(pu)[1].bestE1rm).toBe(0);
  });
  test('pompki: część masy ciała ze źródeł (BW_SHARE), opis w podsumowaniu „masa ciała + X”; ćwiczenie bez źródła (dipy, własne) — brak e1RM także z masą ciała', () => {
    bm(80); expect(bwShare(ex('Push Up'))).toBe(BW_SHARE['Push Up']); expect(BW_SHARE['Push Up']).toBeGreaterThan(0.6); expect(BW_SHARE['Push Up']).toBeLessThan(0.7);
    const pu = ex('Push Up'); addWorkout(at(9, 1), [['Push Up', [{ addKg: 10, reps: 8 }]]]);
    expect(recordsFor(pu).bestE1rm).toBeCloseTo(e1rm(BW_SHARE['Push Up'] * 80 + 10, 8), 6);
    expect(bwShare(ex('Chest Dip'))).toBeUndefined(); addWorkout(at(9, 1), [['Chest Dip', [{ addKg: 10, reps: 5 }]]]); expect(recordsFor(ex('Chest Dip')).bestE1rm).toBe(0);
    const own = store.newExercise('Moje podciąganie'); own.equipment = 'masa ciała'; expect(bwShare(own)).toBeUndefined();
    /* po zmianie nazwy udział zostaje (klucz katalogu) */
    ex('Pull Up').name = 'Podciąganie'; expect(bwShare(ex('Podciąganie'))).toBe(1);
  });
  test('liftedLoad / bwE1Diff / fmtE1: podnoszony ciężar i opis „masa ciała ± X”', () => {
    const pu = ex('Pull Up'), push = ex('Push Up'), sq = ex('Back Squat');
    expect(liftedLoad(pu, set({ addKg: 20, reps: 5 }), undefined)).toBe(0); expect(bwE1Diff(pu, 100, undefined)).toBeNull(); expect(fmtE1(pu, 100, undefined)).toBe('100 kg'); /* bez masy ciała */
    expect(liftedLoad(pu, set({ addKg: 20, reps: 5 }), 80)).toBe(100); expect(liftedLoad(pu, set({ addKg: -20, reps: 5 }), 80)).toBe(60); expect(liftedLoad(pu, set({ addKg: -90, reps: 5 }), 80)).toBe(0);
    expect(liftedLoad(push, set({ addKg: 10, reps: 5 }), 80)).toBeCloseTo(BW_SHARE['Push Up'] * 80 + 10, 9); expect(liftedLoad(sq, set({ weight: 100, reps: 5 }), undefined)).toBe(100);
    expect(bwE1Diff(pu, 126.67, 80)).toBeCloseTo(46.67, 6); expect(bwE1Diff(sq, 120, 80)).toBeNull();
    expect(fmtE1(pu, 126.67, 80)).toBe('126,67 kg (masa ciała + 46,67)'); expect(fmtE1(pu, 70, 80)).toBe('70 kg (masa ciała − 10)'); expect(fmtE1(sq, 120, 80)).toBe('120 kg');
    applyUnit('lb'); expect(fmtE1(pu, 100, 80)).toBe('220,5 lb (masa ciała + 44,1)'); applyUnit('kg');
  });
  test('podsumowanie po treningu: „e1RM 126,7 kg (masa ciała + 46,7; seria +20 kg × 8)”', () => {
    bm(80); addWorkout(at(9, 1), [['Pull Up', [{ addKg: 10, reps: 8 }]]]); const w2 = addWorkout(at(9, 3), [['Pull Up', [{ addKg: 20, reps: 8 }]]]);
    const d = workoutPRs(w2).flatMap(p => p.details); expect(d).toContain('e1RM 126,67 kg (masa ciała + 46,67; seria 20 kg × 8)');
  });
  test('masa ciała: dawne ustawienie bez daty (Settings.bodyMass) — migrate przenosi poprawną wartość do pierwszego pomiaru, złe odrzuca; kopia zapasowa przenosi pomiary; zmiana przelicza rekordy', async () => {
    bm(82.5); const back = parseBackup(JSON.stringify(buildBackup())); expect(back.bodyMassLog).toEqual([{ date: '2000-01-01', kg: 82.5 }]);
    for (const [v, out] of [[0, undefined], [-5, undefined], ['abc', undefined], [1e9, undefined], ['80,4', 80.4], [80.456, 80.46], [null, undefined]] as [unknown, number | undefined][]) {
      const st = JSON.parse(JSON.stringify(S())); delete st.bodyMassLog; st.settings.bodyMass = v; const m = store.migrate(st); expect([v, m.bodyMassLog?.[0]?.kg]).toEqual([v, out]); expect('bodyMass' in m.settings).toBe(false);
      expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
    }
    addWorkout(at(9, 1), [['Pull Up', [{ addKg: 0, reps: 5 }]]]); const r1 = recordsFor(ex('Pull Up')).bestE1rm; bm(90); expect(recordsFor(ex('Pull Up')).bestE1rm).toBeGreaterThan(r1);
  });
});

describe('E5: RIR w skali RPE-RIR, CSV w układzie Stronga', () => {
  const scale = (v: 'rpe' | 'rir') => { S().settings.showRpe = true; S().settings.effortScale = v; store.save(); };
  test('MER-14 / LOG-15: RIR 0–9 → RPE 10–1; RIR > 9 nie zapisuje RPE 0 ani ujemnego (Helms 2016: skala 1–10)', () => {
    scale('rir'); expect([store.effortIn(9), store.effortIn(10), store.effortIn(12), store.effortIn(0), store.effortIn(-3)]).toEqual([1, 1, 1, 10, 10]);
    scale('rpe'); expect([store.effortIn(0), store.effortIn(0.5), store.effortIn(11), store.effortIn(7.5)]).toEqual([1, 1, 10, 7.5]);
  });
  test('LOG-14: Set Order — D dla drop setu, F dla serii do upadku, numer tylko dla zwykłych; Duration „1h 5m”, „1h”, „52m”', () => {
    const t0 = at(9, 1);
    const w = addWorkout(t0, [['Back Squat', [{ kind: 'warmup', warmup: true, weight: 60, reps: 5 }, { weight: 100, reps: 5 }, { kind: 'drop', weight: 70, reps: 8 }, { kind: 'failure', weight: 100, reps: 3 }, { weight: 100, reps: 5 }]]]);
    w.finishedAt = t0 + 65 * 60e3; store.save();
    const rows = buildCsv().trim().split('\n').slice(1).map(r => r.split(','));
    expect(rows.map(r => r[4])).toEqual(['W', '1', 'D', 'F', '2']); expect(rows[0][2]).toBe('1h 5m');
    expect(rows.map(r => r[9])).toEqual(['', '', '', '', '']); /* typ serii nie trafia już do Notes */
    w.finishedAt = t0 + 60 * 60e3; store.save(); expect(buildCsv().split('\n')[1].split(',')[2]).toBe('1h');
    w.finishedAt = t0 + 52 * 60e3; store.save(); expect(buildCsv().split('\n')[1].split(',')[2]).toBe('52m');
    expect([0, 1, 52, 60, 65, 125, 59.6].map(strongDur)).toEqual(['0m', '1m', '52m', '1h', '1h 5m', '2h 5m', '1h']);
  });
});
