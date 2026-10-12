/*
 * Audyt 0.10 — fala 2, obszar DANE / ZDROWIE (08.10.2026, docs/25: J2, J3, N3–N5, MER-18; decyzje docs/18 z 08.10, zasada z 20:20).
 * Każdy test odtwarza błąd z raportu (docs/audyt-0.10: DAT-04, DAT-07, LIVE-16, MER-18) i sprawdza poprawne zachowanie.
 * Rodzaje (docs/20): logika, dane (migrate idempotentne, kopia eksport → import, restart), regresja. Ekrany: tests/audit-0.10-data-ui.test.tsx.
 * Testy dnia i tygodnia (J3) przechodzą w każdej strefie procesu (tests-tz.yml) — oczekiwane wartości liczone z Date.UTC, nie z lokalnych getterów.
 */
import * as store from '@/lib/store';
import * as health from '@/lib/health';
import * as edit from '@/lib/edit';
import { dayStatus, doneOn } from '@/lib/plan';
import { weeklyTotals, thisMonday } from '@/lib/stats';
import { buildBackup, parseBackup, buildCsv, onWorkoutSaved } from '@/lib/backup';
import { fresh, saved, addWorkout, ex } from './helpers';
import { LANGS } from '@/lib/i18n';

const NOW = new Date(2026, 9, 8, 18).getTime();
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const S = () => store.getState();
const hk = () => require('@kingstinct/react-native-healthkit').default;
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { jest.restoreAllMocks(); });
/** Trening zakończony przez aplikację (start → seria → Zakończ). */
const finishOne = () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const s = S().active!.exercises[0].sets[0]; s.weight = 100; s.reps = 5; store.toggleDone(0, 0); return store.finishWorkout()!; };

describe('J2 (DAT-04, LIVE-16): nieudany zapis do Apple Health — znacznik, ponowienie, licznik', () => {
  test('pierwszy zapis rzuca błąd → trening czeka (healthPending, zapisany na dysk); ponowienie zapisuje go raz i zdejmuje znacznik; drugie ponowienie nic nie robi', async () => {
    S().settings.healthSync = true; let n = 0;
    const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => { n++; if (n === 1) throw new Error('HealthKit'); return 'uuid-' + n; });
    const w = finishOne(); await health.syncAfterFinish(w);
    expect(sv).toHaveBeenCalledTimes(1); expect(w.healthUUID).toBeNull(); expect(w.healthPending).toBe(true);
    expect(health.healthPending().map(x => x.id)).toEqual([w.id]);
    await store.flush(); expect(saved().workouts.find(x => x.id === w.id)!.healthPending).toBe(true); /* przeżywa restart */
    expect(await health.retryHealth()).toBe(1); expect(sv).toHaveBeenCalledTimes(2);
    const cur = S().workouts.find(x => x.id === w.id)!; expect(cur.healthUUID).toBe('uuid-2'); expect('healthPending' in cur).toBe(false); expect(health.healthPending()).toEqual([]);
    expect(await health.retryHealth()).toBe(0); expect(sv).toHaveBeenCalledTimes(2);
    for (const c of sv.mock.calls as any[]) expect(c[3].metadata.HKMetadataKeySyncIdentifier).toBe(w.id); /* HealthKit odrzuca duplikat */
  });
  test('zabicie aplikacji między „Zakończ” a zapisem do Zdrowia: znacznik jest już w bazie, a po restarcie ponowienie zapisuje trening', async () => {
    S().settings.healthSync = true; let release!: (v: string) => void;
    jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(() => new Promise<string>(r => { release = r; }));
    const w = finishOne(); const p = health.syncAfterFinish(w); await Promise.resolve(); await store.flush();
    const disk = saved(); expect(disk.workouts.find(x => x.id === w.id)!.healthPending).toBe(true); /* „zabicie” teraz */
    release('late'); await p;
    await fresh(disk); const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => 'uuid-after'); sv.mockClear();
    expect(health.healthPending().map(x => x.id)).toEqual([w.id]); expect(await health.retryHealth()).toBe(1); expect(sv).toHaveBeenCalledTimes(1);
    expect(S().workouts.find(x => x.id === w.id)!.healthUUID).toBe('uuid-after');
  });
  test('odmowa zapisu (false) zostawia znacznik; synchronizacja wyłączona — ponowienie nic nie robi; włączona znowu — dosyła', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => false);
    const w = finishOne(); await health.syncAfterFinish(w); expect(health.healthPending()).toHaveLength(1);
    S().settings.healthSync = false; expect(await health.retryHealth()).toBe(0); expect(sv).toHaveBeenCalledTimes(1);
    S().settings.healthSync = true; sv.mockImplementation(async () => 'ok'); expect(await health.retryHealth()).toBe(1); expect(health.healthPending()).toEqual([]);
  });
  test('bez synchronizacji: trening nie dostaje znacznika; trening wstecz i edycja nie trafiają do Zdrowia (jak dotąd) — ponowienie ich nie dosyła', async () => {
    const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => 'x');
    const w = finishOne(); await onWorkoutSaved(w); expect(w.healthPending).toBeUndefined(); expect(sv).not.toHaveBeenCalled();
    S().settings.healthSync = true; addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); /* jak trening wstecz */
    expect(await health.retryHealth()).toBe(0); expect(sv).not.toHaveBeenCalled();
  });
  test('ponowienie po kolei i raz naraz (start i powrót z tła tuż po sobie): dwa treningi — dwa zapisy, nie cztery', async () => {
    S().settings.healthSync = true; const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => { throw new Error('x'); });
    const a = finishOne(); await health.syncAfterFinish(a); jest.setSystemTime(NOW + 7200e3); const b = finishOne(); await health.syncAfterFinish(b);
    sv.mockReset(); sv.mockImplementation(async () => 'u');
    const [x, y] = await Promise.all([health.retryHealth(), health.retryHealth()]); expect(x).toBe(2); expect(y).toBe(2); expect(sv).toHaveBeenCalledTimes(2);
  });
  test('dane: migrate zostawia healthPending tylko jako true na zakończonym treningu bez healthUUID; idempotentne; kopia eksport → import zachowuje znacznik', () => {
    const w = addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); (w as any).healthPending = true;
    const v = addWorkout(at(9, 2), [['Back Squat', [{ weight: 100, reps: 5 }]]]); (v as any).healthPending = 'tak';
    const u = addWorkout(at(9, 3), [['Back Squat', [{ weight: 100, reps: 5 }]]]); (u as any).healthPending = true; u.healthUUID = 'abc';
    const m = store.migrate(JSON.parse(JSON.stringify(S())));
    const by = (id: string) => m.workouts.find(x => x.id === id)!;
    expect(by(w.id).healthPending).toBe(true); expect('healthPending' in by(v.id)).toBe(false); expect('healthPending' in by(u.id)).toBe(false);
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
    store.replaceState(m); const back = parseBackup(JSON.stringify(buildBackup())); expect(back.workouts.find(x => x.id === w.id)!.healthPending).toBe(true);
  });
});

describe('MER-18 / zaległe: rodzaj aktywności w Zdrowiu po kluczu katalogu (libKey), nie po nazwie', () => {
  test('przemianowany „Bieg” → „Jogging” dalej jest biegiem; ćwiczenie własne o nazwie „Bieg” (bez klucza) — mixedCardio', () => {
    const run = ex('Bieg'); run.name = 'Jogging'; store.save(run);
    expect(health.workoutActivityType(addWorkout(at(9, 1), [['Jogging', [{ durationSec: 1800 }]]]))).toBe(health.HK_ACTIVITY.running);
    const own = { ...run, id: 'own-run', name: 'Bieg', lib: undefined, libKey: undefined }; S().exercises.push(own as any); store.save();
    const w = addWorkout(at(9, 2), [['Jogging', [{ durationSec: 600 }]]]); w.exercises[0].exerciseId = 'own-run';
    expect(health.workoutActivityType(w)).toBe(health.HK_ACTIVITY.mixedCardio);
  });
  test('każdy klucz mapy cardio jest ćwiczeniem katalogu (kluczem biblioteki) z grupą cardio', () => {
    for (const k of Object.keys(health.CARDIO_KIND)) { const e = S().exercises.find(x => x.libKey === k); expect([k, !!e, e?.group]).toEqual([k, true, 'cardio']); }
  });
});

describe('J3 (DAT-07, wariant B): dzień i tydzień treningu w strefie czasowej startu', () => {
  /* niedziela 11.10.2026 23:30 czasu polskiego (CEST, +120) — przykład z raportu DAT-07 */
  const WAW = 120; const sun2330 = Date.UTC(2026, 9, 11, 23, 30) - WAW * 60e3;
  const travel = (tz: number | undefined) => { const w = addWorkout(sun2330, [['Back Squat', [{ weight: 100, reps: 5 }]]]); if (tz === undefined) delete w.tzOffsetMin; else w.tzOffsetMin = tz; store.save(w); return w; };
  test('trening zapisany w Warszawie: dzień 2026-10-11 i tydzień od 2026-10-05 w każdej strefie telefonu; godzina na liście 23:30', () => {
    const w = travel(WAW);
    expect(store.workoutDay(w)).toBe('2026-10-11'); expect(store.mondayKey(store.wallTs(w))).toBe('2026-10-05');
    expect(doneOn('2026-10-11').map(x => x.id)).toEqual([w.id]); expect(doneOn('2026-10-12')).toEqual([]);
    expect(store.fmtTime(store.wallTs(w))).toMatch(/^23:30$/);
    expect(buildCsv().split('\n')[1].startsWith('2026-10-11 23:30:00,')).toBe(true);
  });
  test('Auckland (+780) i Honolulu (−600): ta sama chwila to inny dzień, zależny od strefy startu, nie od telefonu', () => {
    const a = travel(780); expect(store.workoutDay(a)).toBe('2026-10-12'); /* 23:30 w Polsce = poniedziałek 10:30 w Auckland */
    const h = travel(-600); expect(store.workoutDay(h)).toBe('2026-10-11'); expect(store.fmtTime(store.wallTs(h))).toBe('11:30');
  });
  test('brak pola (dane sprzed zmiany) = strefa bieżąca, dokładnie jak dotąd', () => {
    const w = travel(undefined); expect(store.wallTs(w)).toBe(w.startedAt); expect(store.workoutDay(w)).toBe(store.localISODate(new Date(w.startedAt)));
  });
  test('nowy trening zapisuje strefę telefonu z chwili startu; jego dzień = dzisiejsza data (wallTs = startedAt)', () => {
    const w = finishOne(); expect(w.tzOffsetMin).toBe(-new Date(w.startedAt).getTimezoneOffset() || 0);
    expect(store.wallTs(w)).toBe(w.startedAt); expect(store.workoutDay(w)).toBe(store.localISODate(new Date(w.startedAt)));
  });
  test('tydzień deload i tygodnie w Postępach: trening z niedzieli w Warszawie należy do tygodnia od 5.10 (także w Auckland)', () => {
    const w = travel(WAW); const wk = weeklyTotals(2, new Date(2026, 9, 13, 12));
    expect(wk.map(x => x.workouts)).toEqual([1, 0]); expect(store.localISODate(new Date(wk[0].weekStart))).toBe('2026-10-05');
    expect(thisMonday(0, new Date(store.wallTs(w)))).toBe(wk[0].weekStart);
  });
  test('Kalendarz: dzień z planem w niedzielę jest „zrobiony” (nie „opuszczony”), poniedziałek bez treningu', () => {
    const tpl = { ...require('@/lib/seed').base(), name: 'A', items: [] }; S().templates.push(tpl); S().weekPlan = { days: [null, null, null, null, null, null, tpl.id] }; S().planHistory = [{ from: '2026-10-01', days: [null, null, null, null, null, null, tpl.id] }]; store.save();
    const w = travel(WAW); w.templateId = tpl.id; store.save(w); jest.setSystemTime(new Date(2026, 9, 14, 12).getTime());
    expect(dayStatus('2026-10-11').status).toBe('done'); expect(dayStatus('2026-10-12').status).toBe('rest');
  });
  test('edycja: pola daty i godziny w strefie startu (23:30); bez zmiany terminu — ta sama chwila; zmiana godziny na 22:00 — 22:00 w strefie startu', () => {
    const w = travel(WAW); const d = edit.beginEdit(w.id)!; expect([d.date, d.time]).toEqual(['2026-10-11', '23:30']);
    let r = edit.commitDraft(w.id, NOW + 30 * 86400e3); expect('w' in r && r.w.startedAt).toBe(sun2330);
    const d2 = edit.beginEdit(w.id)!; edit.draftSetWhen(d2.key, { time: '22:00' }); r = edit.commitDraft(w.id, NOW + 30 * 86400e3);
    expect('w' in r && r.w.startedAt).toBe(Date.UTC(2026, 9, 11, 22, 0) - WAW * 60e3); expect('w' in r && r.w.tzOffsetMin).toBe(WAW);
  });
  test('trening wstecz dostaje strefę telefonu w chwili startu', () => {
    const start = at(9, 5, 18); const d = edit.beginPast(null, start, start + 3600e3); edit.draftAddExercise(d.key, ex('Back Squat')); const s0 = edit.draftOf(d.key)!.w.exercises[0].sets[0]; s0.weight = 100; s0.reps = 5;
    const c = edit.checkDraft(d.key, NOW); expect('w' in c).toBe(true); if ('w' in c) expect(c.w.tzOffsetMin).toBe(-new Date(start).getTimezoneOffset() || 0);
  });
  test('dane: migrate — liczba w zakresie ±14 h (zaokrąglona, także z tekstu) zostaje, reszta odpada; idempotentne; kopia i restart bez zmian', async () => {
    const vals: [unknown, number | undefined][] = [[120, 120], [-600, -600], ['330', 330], [345.4, 345], [840, 840], [-841, undefined], [900, undefined], ['x', undefined], [null, undefined], [NaN, undefined]];
    for (const [v, out] of vals) { const st = JSON.parse(JSON.stringify(S())); const w = addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const raw = JSON.parse(JSON.stringify(S())); raw.workouts.find((x: any) => x.id === w.id).tzOffsetMin = v; const m = store.migrate(raw); expect([v, m.workouts.find(x => x.id === w.id)!.tzOffsetMin]).toEqual([v, out]); expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m); void st; }
    const w = travel(WAW); const back = parseBackup(JSON.stringify(buildBackup())); expect(back.workouts.find(x => x.id === w.id)!.tzOffsetMin).toBe(WAW);
    await store.flush(); await fresh(saved()); expect(store.workoutDay(S().workouts.find(x => x.id === w.id)!)).toBe('2026-10-11');
  });
});

describe('Masa ciała z datą (fala 2, decyzja: wdrożyć): e1RM dawnych sesji z masą ciała z tamtego dnia', () => {
  const { recordsFor, sessionsFor, prMap, workoutPRs, e1rm, fmtE1, chartKeysFor } = require('@/lib/stats') as typeof import('@/lib/stats');
  test('bodyMassOn: ostatni pomiar nie późniejszy niż dzień; przed pierwszym — brak; ten sam dzień zastępuje; usunięcie', () => {
    expect(store.bodyMassOn('2026-10-01')).toBeUndefined();
    expect(store.addBodyMass(80, '2026-09-01')).toBeNull(); expect(store.addBodyMass(82.456, '2026-10-01')).toBeNull();
    expect(store.bodyMassOn('2026-08-31')).toBeUndefined(); expect(store.bodyMassOn('2026-09-01')).toBe(80); expect(store.bodyMassOn('2026-09-30')).toBe(80);
    expect(store.bodyMassOn('2026-10-01')).toBe(82.46); expect(store.bodyMassOn('2030-01-01')).toBe(82.46); expect(store.latestBodyMass()).toEqual({ date: '2026-10-01', kg: 82.46 });
    expect(store.addBodyMass(81, '2026-09-01')).toBeNull(); expect(S().bodyMassLog).toEqual([{ date: '2026-09-01', kg: 81 }, { date: '2026-10-01', kg: 82.46 }]);
    store.removeBodyMass('2026-10-01'); expect(store.latestBodyMass()!.kg).toBe(81); store.removeBodyMass('2026-09-01'); expect('bodyMassLog' in S()).toBe(false);
  });
  test('addBodyMass: zła data, data w przyszłości, 0, ujemna i > maks. — błąd i brak zmian', () => {
    for (const [kg, d] of [[80, '2026-02-30'], [80, '8.10.2026'], [80, '2026-10-09'], [0, '2026-10-01'], [-5, '2026-10-01'], [501, '2026-10-01']] as [number, string][]) { expect([kg, d, typeof store.addBodyMass(kg, d)]).toEqual([kg, d, 'string']); }
    expect(S().bodyMassLog).toBeUndefined(); expect(store.addBodyMass(500, '2026-10-08')).toBeNull();
  });
  test('e1RM podciągania: sesja z września liczona z 80 kg, z października z 90 kg; sesja sprzed pierwszego pomiaru — bez e1RM', () => {
    const pu = ex('Pull Up');
    const w0 = addWorkout(at(7, 20), [['Pull Up', [{ addKg: 10, reps: 5 }]]]);
    const w1 = addWorkout(at(8, 15), [['Pull Up', [{ addKg: 10, reps: 5 }]]]);
    const w2 = addWorkout(at(9, 5), [['Pull Up', [{ addKg: 10, reps: 5 }]]]);
    store.addBodyMass(80, '2026-09-01'); store.addBodyMass(90, '2026-10-01');
    const ss = sessionsFor(pu); expect(ss.map(s => s.workout.id)).toEqual([w0.id, w1.id, w2.id]);
    expect(ss.map(s => s.bestE1rm)).toEqual([0, e1rm(90, 5), e1rm(100, 5)]); expect(ss.map(s => s.bodyMass)).toEqual([undefined, 80, 90]);
    const rec = recordsFor(pu); expect(rec.bestE1rm).toBeCloseTo(e1rm(100, 5), 6); expect(rec.bestE1rmBm).toBe(90);
    expect(fmtE1(pu, rec.bestE1rm, rec.bestE1rmBm)).toBe('116,67 kg (masa ciała + 26,67)'); /* masa ciała z dnia rekordu, nie z ostatniego pomiaru */
    store.addBodyMass(70, '2026-10-08'); expect(fmtE1(pu, recordsFor(pu).bestE1rm, recordsFor(pu).bestE1rmBm)).toBe('116,67 kg (masa ciała + 26,67)');
    expect(chartKeysFor(pu).map(k => k.key)).toContain('bestE1rm');
  });
  test('rekord w treningu (prMap, podsumowanie) z masą ciała z dnia treningu; zmiana pomiaru przelicza (cache historii)', () => {
    store.addBodyMass(80, '2026-09-01');
    addWorkout(at(8, 10), [['Pull Up', [{ addKg: 10, reps: 5 }]]]); const w2 = addWorkout(at(9, 5), [['Pull Up', [{ addKg: 10, reps: 5 }]]]);
    expect([...prMap(w2).values()].flat()).not.toContain('e1RM'); /* ta sama masa — remis */
    store.addBodyMass(85, '2026-10-01'); expect([...prMap(w2).values()].flat()).toContain('e1RM'); /* cięższy o 5 kg — więcej podniesione */
    expect(workoutPRs(w2).flatMap(p => p.details)).toContain('e1RM 110,83 kg (masa ciała + 25,83; seria 10 kg × 5)');
  });
  test('trening z podróży: dzień pomiaru liczony w strefie startu treningu (J3)', () => {
    const w = addWorkout(Date.UTC(2026, 9, 11, 23, 30) - 120 * 60e3, [['Pull Up', [{ addKg: 0, reps: 5 }]]]); w.tzOffsetMin = 120; store.save(w);
    jest.setSystemTime(new Date(2026, 9, 20, 12).getTime()); store.addBodyMass(80, '2026-10-01'); store.addBodyMass(90, '2026-10-12');
    expect(store.bodyMassFor(w)).toBe(80); /* niedziela 11.10 w Warszawie; w Auckland to już poniedziałek 12.10 (90 kg) */ w.tzOffsetMin = 780; expect(store.bodyMassFor(w)).toBe(90);
  });
  test('dane: migrate — pomiary (zła data, zły kg, powtórzony dzień — późniejszy wygrywa, kolejność), limit; idempotentne; kopia i restart; CSV bez masy ciała', async () => {
    const raw = JSON.parse(JSON.stringify(S()));
    raw.bodyMassLog = [{ date: '2026-10-02', kg: '81,5' }, { date: '2026-09-01', kg: 80 }, { date: '2026-10-02', kg: 82 }, { date: '2026-02-30', kg: 80 }, { date: '2026-09-05', kg: 0 }, { date: '2026-09-06', kg: 900 }, { date: 5, kg: 80 }, null, 'x'];
    const m = store.migrate(raw); expect(m.bodyMassLog).toEqual([{ date: '2026-09-01', kg: 80 }, { date: '2026-10-02', kg: 82 }]);
    expect(store.migrate(JSON.parse(JSON.stringify(m)))).toEqual(m);
    const many = JSON.parse(JSON.stringify(S())); many.bodyMassLog = Array.from({ length: 4000 }, (_, i) => ({ date: store.localISODate(new Date(2010, 0, 1 + i)), kg: 80 }));
    const mm = store.migrate(many); expect(mm.bodyMassLog!.length).toBe(require('@/lib/seed').BODY_MASS_LOG_MAX); expect(mm.bodyMassLog![mm.bodyMassLog!.length - 1].date).toBe(store.localISODate(new Date(2010, 0, 4000)));
    store.addBodyMass(80, '2026-09-01'); const back = parseBackup(JSON.stringify(buildBackup())); expect(back.bodyMassLog).toEqual([{ date: '2026-09-01', kg: 80 }]);
    addWorkout(at(9, 2), [['Pull Up', [{ addKg: 0, reps: 5 }]]]); expect(buildCsv().split('\n')[0]).toBe('Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE'); /* CSV (układ popularnych dzienników) — tylko serie, bez kolumny masy ciała */
    await store.flush(); await fresh(saved()); expect(store.bodyMassOn('2026-10-01')).toBe(80);
  });
  test('dawne Settings.bodyMass (bez daty) → pierwszy pomiar z dniem najstarszego treningu (e1RM dawnych sesji bez zmian); bez historii — dziś; pomiary już są — bez zmian', () => {
    addWorkout(at(7, 3), [['Pull Up', [{ addKg: 0, reps: 5 }]]]); addWorkout(at(9, 1), [['Pull Up', [{ addKg: 0, reps: 5 }]]]);
    const raw = JSON.parse(JSON.stringify(S())); raw.settings.bodyMass = 78; const m = store.migrate(raw);
    expect(m.bodyMassLog).toEqual([{ date: '2026-08-03', kg: 78 }]); expect('bodyMass' in m.settings).toBe(false);
    const empty = JSON.parse(JSON.stringify(S())); empty.workouts = []; empty.settings.bodyMass = 78; expect(store.migrate(empty).bodyMassLog).toEqual([{ date: '2026-10-08', kg: 78 }]);
    const both = JSON.parse(JSON.stringify(S())); both.settings.bodyMass = 78; both.bodyMassLog = [{ date: '2026-01-01', kg: 70 }]; expect(store.migrate(both).bodyMassLog).toEqual([{ date: '2026-01-01', kg: 70 }]);
  });
});

describe('Uprawnienie Zdrowia (app.json, InfoPlist.strings w 26 językach): zapis treningów siłowych I cardio', () => {
  const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path'); const root = path.join(__dirname, '..');
  test('opis NSHealthUpdateUsageDescription mówi o cardio we wszystkich językach; app.json = locales/pl.json', () => {
    const files = fs.readdirSync(path.join(root, 'locales')).filter(f => f.endsWith('.json')); expect(files.map(f => f.replace(/\.json$/, '')).sort()).toEqual([...LANGS].sort()); /* fala 1 (09.10.2026): liczba z LANGS, nie wpisana ręcznie */
    for (const f of files) { const d = JSON.parse(fs.readFileSync(path.join(root, 'locales', f), 'utf8')); expect([f, /cardio|kardi|кардио|кардіо|καρδιο|kondi|有酸素|유산소|有氧/i /* fala 4: ja, ko, zh-Hant */.test(d.NSHealthUpdateUsageDescription)]).toEqual([f, true]); }
    const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8')); const hk = app.expo.plugins.find((p: unknown) => Array.isArray(p) && p[0] === '@kingstinct/react-native-healthkit')[1];
    expect(hk.NSHealthUpdateUsageDescription).toBe(JSON.parse(fs.readFileSync(path.join(root, 'locales/pl.json'), 'utf8')).NSHealthUpdateUsageDescription);
  });
});

describe('Funkcje pomocnicze fali 2 (strefa, liczniki, sortowanie, indeksy)', () => {
  test('cleanTz: minuty w zakresie ±14 h (zaokrąglone, także tekst), reszta undefined; fromWallTs odwraca wallTs w każdej strefie startu', () => {
    expect([store.cleanTz(120), store.cleanTz('-330'), store.cleanTz(345.6), store.cleanTz(840), store.cleanTz(-840), store.cleanTz(841), store.cleanTz(''), store.cleanTz(null), store.cleanTz(NaN), store.cleanTz({})]).toEqual([120, -330, 346, 840, -840, undefined, undefined, undefined, undefined, undefined]);
    for (const tz of [-600, -330, 0, 120, 345, 780, 840]) { const w = { startedAt: Date.UTC(2026, 9, 11, 23, 30), tzOffsetMin: tz }; expect(store.fromWallTs(store.wallTs(w), tz)).toBe(w.startedAt); }
    expect(store.fromWallTs(12345, undefined)).toBe(12345);
  });
  test('getRev rośnie przy każdej zmianie (także szablonu), getHistRev — tylko przy zmianie historii (PERF-02); saveCfg — bez historii', () => {
    const r0 = store.getRev(), h0 = store.getHistRev(); const tpl = store.newTemplate(); expect(store.getRev()).toBeGreaterThan(r0); const h1 = store.getHistRev(); expect(h1).toBeGreaterThan(h0);
    const r1 = store.getRev(); tpl.name = 'A'; store.save(tpl); expect(store.getRev()).toBe(r1 + 1); expect(store.getHistRev()).toBe(h1);
    store.saveCfg(); expect(store.getRev()).toBe(r1 + 2); expect(store.getHistRev()).toBe(h1);
    addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); expect(store.getHistRev()).toBeGreaterThan(h1);
  });
  test('collator: jeden Intl.Collator na język (ten sam obiekt), porządek jak localeCompare (ą po a, ł po l); po zmianie języka — nowy', () => {
    const { collator, applyLang } = require('@/lib/i18n') as typeof import('@/lib/i18n');
    applyLang('pl'); const c = collator(); expect(collator()).toBe(c); expect(['łyda', 'ławka', 'lina', 'ąb', 'ab'].sort(c.compare)).toEqual(['ab', 'ąb', 'lina', 'ławka', 'łyda']);
    applyLang('de'); expect(collator()).not.toBe(c); applyLang('pl');
  });
  test('PERF-05: exById — indeks zamiast liniowego szukania; poprawny po dopisaniu, zmianie nazwy i dla brakującego id', () => {
    const sq = ex('Back Squat'); expect(store.exById(sq.id)).toBe(sq); expect(store.exById('nie-ma')).toBeUndefined();
    const own = store.newExercise('Moje'); expect(store.exById(own.id)).toBe(own); own.name = 'Moje 2'; expect(store.exById(own.id)!.name).toBe('Moje 2');
    store.exById(sq.id); const find = jest.spyOn(Array.prototype, 'find'); for (let i = 0; i < 100; i++) store.exById(sq.id); expect(find).not.toHaveBeenCalled(); find.mockRestore();
    const arr = S().exercises; const i = arr.indexOf(own); const repl = { ...own, id: 'nowe-id' }; arr.splice(i, 1, repl); expect(store.exById('nowe-id')).toBe(repl); expect(store.exById(own.id)).toBeUndefined(); /* zmiana w miejscu (ta sama długość) */
  });
  test('PERF-05: słowniki języków ładowane przy pierwszym użyciu (fr nieładowany, dopóki nikt go nie czyta)', () => {
    jest.isolateModules(() => {
      let loaded = false; jest.doMock('@/lib/locales/fr.json', () => { loaded = true; return { 'Ustawienia': 'Réglages' }; });
      const i18n = require('@/lib/i18n'); i18n.applyLang('de'); i18n.t('Ustawienia'); expect(loaded).toBe(false);
      i18n.applyLang('fr'); expect(i18n.t('Ustawienia')).toBe('Réglages'); expect(loaded).toBe(true); i18n.applyLang('pl');
    });
  });
  test('PERF-04: doneOn / busyDays z mapy dni — poprawne po dopisaniu i usunięciu treningu (cache historii)', () => {
    const { busyDays } = require('@/lib/plan'); const w = addWorkout(at(9, 3, 10), [['Back Squat', [{ weight: 100, reps: 5 }]]]); const w2 = addWorkout(at(9, 3, 8), [['Back Squat', [{ weight: 90, reps: 5 }]]]);
    expect(doneOn('2026-10-03').map(x => x.id)).toEqual([w2.id, w.id]); expect(busyDays().has('2026-10-03')).toBe(true);
    store.deleteWorkout(w2.id); expect(doneOn('2026-10-03').map(x => x.id)).toEqual([w.id]); store.deleteWorkout(w.id); expect(doneOn('2026-10-03')).toEqual([]); expect(busyDays().has('2026-10-03')).toBe(false);
  });
});
