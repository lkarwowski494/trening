/*
 * 0.16.0, odczyt z Apple Health (docs/29 rozdz. 12 pkt 1, 5, 6): ZAPYTANIA i DOPASOWANIE na makiecie o kontrakcie biblioteki 16.x (tests/health-world.ts) —
 * kroki dnia i średnia z 7 dni, inne aktywności (bez własnych wpisów i bez dopasowanych), tętno i kcal z treningu z zegarka (jednostki jawne, zwolnienie uchwytów),
 * brak dubla w Zdrowiu (pominięcie zapisu przy dopasowaniu, usunięcie WŁASNEJ kopii tylko filtrem id + własne źródło), ponowienia, błędy i brak danych.
 * Rodzaje (docs/20): logika, dane, niezmienniki (filtr usuwania zawsze z dwoma warunkami; dane ze Zdrowia nigdy w stanie, kopii ani CSV).
 */
import * as store from '@/lib/store';
import * as health from '@/lib/health';
import * as Q from '@/lib/healthQuery';
import { HEALTH_READ_TYPES } from '@/lib/healthRead';
import { buildBackup, buildCsv } from '@/lib/backup';
import { fresh, addWorkout, saved } from './helpers';
import { hkWorld, watchStrength, watchOther, at, OWN_BUNDLE, WATCH_BUNDLE, type World } from './health-world';

const S = () => store.getState();
let W: World;
beforeEach(async () => { await fresh(); W = hkWorld(); S().settings.healthRead = true; S().settings.healthSync = true; });
afterEach(() => { jest.restoreAllMocks(); });
const DAY = '2026-10-10';
const session = (start: number, minutes = 60, name = 'T') => { const w = addWorkout(start, [['Back Squat', [{ weight: 100, reps: 5 }]]], name); w.finishedAt = start + minutes * 60e3; return w; };

describe('kroki', () => {
  test('queryStepsByDay: właściwy typ, suma, kotwica = początek pierwszego dnia, interwał 1 dzień, zakres dat, jednostka count; dni bez danych nie ma w wyniku', async () => {
    W.steps['2026-10-09'] = 8432; W.steps['2026-10-11'] = 100;
    const m = await Q.queryStepsByDay('2026-10-09', '2026-10-11'); expect([...m!.entries()]).toEqual([['2026-10-09', 8432], ['2026-10-11', 100]]);
    const [type, stats, anchor, interval, opt] = W.calls.statistics[0]; expect([type, stats, interval, opt.unit]).toEqual(['HKQuantityTypeIdentifierStepCount', ['cumulativeSum'], { day: 1 }, 'count']);
    expect(anchor).toEqual(new Date(2026, 9, 9)); expect(opt.filter.date).toEqual({ startDate: new Date(2026, 9, 9), endDate: new Date(2026, 9, 12) });
  });
  test('błąd zapytania, zły zakres albo brak funkcji → null (bez wyjątku)', async () => {
    W.fail.steps = true; expect(await Q.queryStepsByDay('2026-10-09', '2026-10-10')).toBeNull(); W.fail.steps = false;
    expect(await Q.queryStepsByDay('2026-10-10', '2026-10-09')).toBeNull(); expect(await Q.queryStepsByDay('zły', 'zły')).toBeNull();
    const h = require('@kingstinct/react-native-healthkit').default; const fn = h.queryStatisticsCollectionForQuantity; h.queryStatisticsCollectionForQuantity = undefined; /* biblioteka bez tej funkcji */
    try { expect(await Q.queryStepsByDay('2026-10-09', '2026-10-10')).toBeNull(); } finally { h.queryStatisticsCollectionForQuantity = fn; }
  });
});

describe('panel dnia: loadDay', () => {
  test('kroki dnia i inne aktywności (bieg z dystansem, spacer); posortowane po starcie; uchwyty zwolnione', async () => {
    W.steps[DAY] = 8432; W.workouts.push(watchOther(at(DAY, 17), 45, { type: 52, distanceM: null }), watchOther(at(DAY, 7), 32));
    const d = await Q.loadDay(DAY); expect(d.steps).toBe(8432); expect(d.activities.map(a => [Math.round(a.durationSec / 60), a.distanceM])).toEqual([[32, 5200], [45, null]]);
    expect(W.proxies.length).toBeGreaterThan(0); W.proxies.forEach(p => expect(p.dispose).toHaveBeenCalled());
  });
  test('filtr zapytania o treningi: przedział dnia i wykluczenie źródła tej aplikacji (NOT sources)', async () => {
    await Q.loadDay(DAY); const f = W.calls.workouts[0].filter; expect(f.date).toEqual({ startDate: new Date(2026, 9, 10), endDate: new Date(2026, 9, 11) });
    expect(f.NOT).toEqual([{ sources: [{ name: 'Trening', bundleIdentifier: OWN_BUNDLE }] }]); expect(f.OR).toBeUndefined(); expect(W.calls.workouts[0].limit).toBe(0);
  });
  test('własne wpisy aplikacji nie są „innymi aktywnościami” (źródło ani znacznik synchronizacji), dopasowany trening siłowy z zegarka też nie', async () => {
    const s = session(at(DAY, 18)); W.workouts.push({ uuid: 'own', start: s.startedAt, end: s.finishedAt!, type: 50, bundle: OWN_BUNDLE, syncId: s.id },
      { uuid: 'own-bez-zrodla', start: at(DAY, 8), end: at(DAY, 9), type: 50, bundle: WATCH_BUNDLE, syncId: s.id }, watchStrength(at(DAY, 18, 5), 50), watchOther(at(DAY, 12), 20));
    const d = await Q.loadDay(DAY); expect(d.activities).toHaveLength(1); expect(Math.round(d.activities[0].durationSec / 60)).toBe(20);
  });
  test('siłowy trening z zegarka bez sesji w aplikacji jest „inną aktywnością”; sesja bez godziny (import) nie dopasowuje', async () => {
    W.workouts.push(watchStrength(at(DAY, 9), 40)); expect((await Q.loadDay(DAY)).activities).toHaveLength(1);
    const nc = addWorkout(at(DAY, 12), [['Back Squat', [{ weight: 100, reps: 5 }]]]); nc.finishedAt = nc.startedAt; /* noClock: 12:00, zerowy czas */ W.workouts.push(watchStrength(at(DAY, 11, 30), 60));
    expect((await Q.loadDay(DAY)).activities).toHaveLength(2);
  });
  test('aktywność przechodząca przez północ liczy się do dnia startu; z poprzedniego dnia kończąca się po północy nie wchodzi do następnego', async () => {
    W.workouts.push(watchOther(at(DAY, 23, 40), 60)); expect((await Q.loadDay(DAY)).activities).toHaveLength(1); expect((await Q.loadDay('2026-10-11')).activities).toHaveLength(0);
  });
  test('błąd treningów → kroki zostają, aktywności puste; błąd kroków → aktywności zostają; oba → pusty dzień; zero kroków to dane (0), brak to null', async () => {
    W.steps[DAY] = 0; W.workouts.push(watchOther(at(DAY, 12), 20)); expect((await Q.loadDay(DAY)).steps).toBe(0);
    W.fail.workouts = true; expect(await Q.loadDay(DAY)).toEqual({ steps: 0, activities: [] }); W.fail.workouts = false;
    W.fail.steps = true; const d = await Q.loadDay(DAY); expect([d.steps, d.activities.length]).toEqual([null, 1]); W.fail.workouts = true; expect(await Q.loadDay(DAY)).toEqual({ steps: null, activities: [] });
    W.fail.steps = false; W.fail.workouts = false; expect((await Q.loadDay('2026-10-01')).steps).toBeNull();
  });
});

describe('linia tygodnia: loadWeek', () => {
  const NOW = new Date(2026, 9, 14, 12).getTime(); /* środa; poniedziałek 12.10 */
  test('średnia z 7 ostatnich PEŁNYCH dni (bez dzisiejszego), liczba innych aktywności od poniedziałku', async () => {
    for (let d = 7; d <= 13; d++) W.steps[`2026-10-${String(d).padStart(2, '0')}`] = d * 1000; W.steps['2026-10-14'] = 99999; /* dziś — nie wchodzi */
    W.workouts.push(watchOther(at('2026-10-11', 8), 30) /* niedziela — poprzedni tydzień */, watchOther(at('2026-10-12', 8), 30), watchOther(at('2026-10-14', 7), 30), watchStrength(at('2026-10-13', 7), 40));
    const w = await Q.loadWeek(NOW); expect(w).toEqual({ avgSteps: 10000, others: 3 });
    expect(W.calls.statistics[0][4].filter.date).toEqual({ startDate: new Date(2026, 9, 7), endDate: new Date(2026, 9, 14) });
  });
  test('dni bez danych nie zaniżają średniej; brak danych → null; błędy → pusty wynik', async () => {
    W.steps['2026-10-09'] = 6000; W.steps['2026-10-10'] = 8000; expect((await Q.loadWeek(NOW)).avgSteps).toBe(7000);
    W.steps = {}; expect(await Q.loadWeek(NOW)).toEqual({ avgSteps: null, others: 0 }); W.fail.steps = true; W.fail.workouts = true; expect(await Q.loadWeek(NOW)).toEqual({ avgSteps: null, others: 0 });
  });
  test('dopasowany trening siłowy z zegarka nie liczy się jako inna aktywność', async () => {
    const s = session(at('2026-10-13', 18)); W.workouts.push(watchStrength(at('2026-10-13', 18, 10), 45)); expect(s.finishedAt).toBeGreaterThan(0); expect((await Q.loadWeek(NOW)).others).toBe(0);
  });
});

describe('szczegóły sesji: loadWatchStats', () => {
  test('tętno śr./maks. w uderzeniach na minutę (jednostka jawna) i aktywne kcal z dopasowanego treningu; uchwyty zwolnione', async () => {
    const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 18, 2), 55, { hr: { avg: 127.6, max: 161 }, kcal: 311.7 }));
    expect(await Q.loadWatchStats(s)).toEqual({ avgBpm: 128, maxBpm: 161, kcal: 312 });
    const p = W.proxies.find(x => x.getStatistic.mock.calls.length)!; expect(p.getStatistic.mock.calls.map(c => c.slice(0, 2))).toEqual([['HKQuantityTypeIdentifierHeartRate', 'count/min'], ['HKQuantityTypeIdentifierActiveEnergyBurned', 'kcal']]);
    W.proxies.forEach(x => expect(x.dispose).toHaveBeenCalled());
    const f = W.calls.workouts[0].filter; expect(f.OR).toEqual([{ workoutActivityType: 50 }, { workoutActivityType: 20 }]); expect(f.NOT[0].sources[0].bundleIdentifier).toBe(OWN_BUNDLE);
  });
  test('brak dopasowania (inna godzina, bieg zamiast siłowego, stykanie końcami) → null', async () => {
    const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 10), 40), watchOther(at(DAY, 18, 5), 40), watchStrength(at(DAY, 19), 30)); expect(await Q.loadWatchStats(s)).toBeNull();
  });
  test('wiele treningów: ten z największą częścią wspólną; jeden trening z zegarka nie trafia do dwóch sesji', async () => {
    const a = session(at(DAY, 10), 60, 'A'), b = session(at(DAY, 10, 50), 60, 'B'); W.workouts.push(watchStrength(at(DAY, 10, 40), 80, { hr: { avg: 111, max: 150 }, kcal: 200 }));
    expect(await Q.loadWatchStats(a)).toBeNull(); expect((await Q.loadWatchStats(b))?.avgBpm).toBe(111); /* b: 70 min wspólnych, a: 20 min */
  });
  test('tylko tętno / tylko kcal / bez statystyk; błąd statystyk → puste wartości, nie wyjątek; fallback totalEnergyBurned', async () => {
    const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 18), 60, { kcal: undefined, totalKcal: 250 })); expect(await Q.loadWatchStats(s)).toEqual({ avgBpm: 128, maxBpm: 161, kcal: 250 });
    W.workouts = [watchStrength(at(DAY, 18), 60, { hr: undefined, kcal: 99 })]; expect(await Q.loadWatchStats(s)).toEqual({ kcal: 99 });
    W.workouts = [watchStrength(at(DAY, 18), 60, { hr: undefined, kcal: undefined })]; expect(await Q.loadWatchStats(s)).toEqual({});
    W.workouts = [watchStrength(at(DAY, 18), 60)]; W.fail.stats = true; expect(await Q.loadWatchStats(s)).toEqual({});
  });
  test('sesja w toku, bez godziny, bez zakończenia → null; błąd zapytania → null', async () => {
    const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 18), 60)); const open = { ...s, finishedAt: null }; expect(await Q.loadWatchStats(open as any)).toBeNull();
    W.fail.workouts = true; expect(await Q.loadWatchStats(s)).toBeNull();
  });
});

describe('brak dubla: pominięcie zapisu po „Zakończ”', () => {
  test('odczyt włączony i trening z zegarka jest → bez saveWorkoutSample, healthUUID „watch”, bez znacznika oczekiwania', async () => {
    const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 18, 3), 50)); await health.syncAfterFinish(s);
    expect(W.spies.saveWorkoutSample).not.toHaveBeenCalled(); const cur = S().workouts.find(x => x.id === s.id)!; expect([cur.healthUUID, cur.healthPending]).toEqual(['watch', undefined]); expect(health.healthPending()).toHaveLength(0);
  });
  test('brak treningu z zegarka (zwykle: zegarek kończy później) → zapis jak dotąd z id sesji w metadanych', async () => {
    const s = session(at(DAY, 18)); await health.syncAfterFinish(s); expect(W.saved).toHaveLength(1); expect(W.saved[0].syncId).toBe(s.id); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe(W.saved[0].uuid);
  });
  test('odczyt wyłączony → zapis jak dotąd i ŻADNE zapytanie do Zdrowia o treningi (kryterium 1 docs/29 rozdz. 15)', async () => {
    delete S().settings.healthRead; const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 18, 3), 50)); await health.syncAfterFinish(s);
    expect(W.saved).toHaveLength(1); expect(W.spies.queryWorkoutSamples).not.toHaveBeenCalled(); expect(W.spies.queryStatisticsCollectionForQuantity).not.toHaveBeenCalled();
  });
  test('błąd zapytania przy „Zakończ” → zapis jak dotąd (nie wiadomo = nie pomijamy)', async () => {
    const s = session(at(DAY, 18)); W.fail.workouts = true; await health.syncAfterFinish(s); expect(W.saved).toHaveLength(1);
  });
  test('zapis wyłączony → nic (jak dotąd), nawet gdy odczyt włączony', async () => {
    S().settings.healthSync = false; const s = session(at(DAY, 18)); await health.syncAfterFinish(s); expect(W.saved).toHaveLength(0); expect(W.spies.queryWorkoutSamples).not.toHaveBeenCalled();
  });
  test('ponowienie zaległego zapisu (retryHealth): jeśli w międzyczasie pojawił się trening z zegarka — „watch” zamiast kopii', async () => {
    const s = session(at(DAY, 18)); s.healthPending = true; W.workouts.push(watchStrength(at(DAY, 18, 1), 55)); expect(await health.retryHealth()).toBe(0);
    expect(W.saved).toHaveLength(0); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch');
  });
});

describe('brak dubla: usuwanie WŁASNEJ kopii po późniejszej synchronizacji zegarka', () => {
  const withCopy = async (start = at(DAY, 18)) => { const s = session(start); await health.saveWorkout(s); return s; };
  test('kopia zapisana, potem pojawia się trening z zegarka → deleteObjects z filtrem id + własne źródło, wpis znika, healthUUID „watch”', async () => {
    const s = await withCopy(); expect(W.saved).toHaveLength(1); expect(await health.retryHealth()).toBe(0); expect(W.calls.delete).toHaveLength(0); /* jeszcze brak treningu z zegarka */
    W.workouts.push(watchStrength(at(DAY, 18, 4), 50)); await health.retryHealth();
    expect(W.calls.delete).toHaveLength(1); const [type, f] = W.calls.delete[0]; expect(type).toBe('HKWorkoutTypeIdentifier');
    expect(f).toEqual({ metadata: { withMetadataKey: 'HKMetadataKeySyncIdentifier', operatorType: 4, value: s.id }, sources: [{ name: 'Trening', bundleIdentifier: OWN_BUNDLE }] });
    expect(W.workouts.map(x => x.bundle)).toEqual([WATCH_BUNDLE]); expect(W.deleted[0].count).toBe(1); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch');
    W.calls.delete.length = 0; await health.retryHealth(); expect(W.calls.delete).toHaveLength(0); /* drugi raz: nic do roboty */
  });
  test('trening z zegarka NIGDY nie jest usuwany (nawet z tym samym znacznikiem synchronizacji, bo filtr wymaga własnego źródła)', async () => {
    const s = await withCopy(); const watch = watchStrength(at(DAY, 18, 4), 50, { syncId: s.id }); W.workouts.push(watch); await health.retryHealth();
    expect(W.workouts.some(x => x.uuid === watch.uuid)).toBe(true); expect(W.deleted.every(d => d.count === 1)).toBe(true);
  });
  test('bez dopasowania nic nie jest usuwane; B8: kopia, której już nie ma (deleteObjects → 0) → „watch” bez błędu', async () => {
    const s = await withCopy(); W.workouts = W.workouts.filter(x => x.bundle !== OWN_BUNDLE); W.workouts.push(watchStrength(at(DAY, 18, 4), 50));
    await health.retryHealth(); expect(W.deleted[0].count).toBe(0); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch');
  });
  test('błąd usuwania → healthUUID bez zmian, kolejna próba przy następnym uruchomieniu', async () => {
    const s = await withCopy(); const uuid = s.healthUUID; W.workouts.push(watchStrength(at(DAY, 18, 4), 50)); W.fail.delete = true; await health.retryHealth();
    expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe(uuid); W.fail.delete = false; await health.retryHealth(); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch');
  });
  test('B10/B11: bez odczytu albo bez zapisu usuwanie się nie odbywa', async () => {
    const s = await withCopy(); W.workouts.push(watchStrength(at(DAY, 18, 4), 50));
    delete S().settings.healthRead; await health.reconcileWatchCopies(); expect(W.calls.delete).toHaveLength(0); S().settings.healthRead = true; S().settings.healthSync = false; expect(await health.reconcileWatchCopies()).toBe(0); expect(W.calls.delete).toHaveLength(0);
    S().settings.healthSync = true; expect(await health.reconcileWatchCopies()).toBe(1); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch');
  });
  test('brak źródła aplikacji (currentAppSource) albo funkcji usuwania → nic nie jest usuwane (nigdy bez drugiego warunku)', async () => {
    const s = await withCopy(); W.workouts.push(watchStrength(at(DAY, 18, 4), 50));
    W.spies.currentAppSource.mockImplementation((() => undefined) as any); expect(await health.deleteOwnCopy(s)).toBe(false); expect(W.calls.delete).toHaveLength(0);
    W.spies.currentAppSource.mockImplementation((() => { throw new Error('x'); }) as any); expect(await health.deleteOwnCopy(s)).toBe(false);
    W.spies.currentAppSource.mockImplementation((() => ({ name: 'Trening', bundleIdentifier: OWN_BUNDLE })) as any); const h = require('@kingstinct/react-native-healthkit').default; const del = h.deleteObjects; h.deleteObjects = undefined; try { expect(await health.deleteOwnCopy(s)).toBe(false); } finally { h.deleteObjects = del; }
  });
  test('dwie sesje, jeden trening z zegarka: kopię traci tylko sesja z dopasowaniem', async () => {
    const a = await withCopy(at(DAY, 10)), b = await withCopy(at(DAY, 10, 50)); W.workouts.push(watchStrength(at(DAY, 10, 40), 80)); await health.retryHealth();
    expect([S().workouts.find(x => x.id === a.id)!.healthUUID === 'watch', S().workouts.find(x => x.id === b.id)!.healthUUID === 'watch']).toEqual([false, true]); expect(W.calls.delete).toHaveLength(1); expect(W.calls.delete[0][1].metadata.value).toBe(b.id);
  });
});

describe('niezmienniki', () => {
  test('(b) każde wywołanie deleteObjects ma znacznik synchronizacji ORAZ własne źródło — po losowych sekwencjach działań', async () => {
    let seed = 7; const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
    for (let run = 0; run < 25; run++) {
      await fresh(); W = hkWorld(); S().settings.healthRead = true; S().settings.healthSync = true; const made: ReturnType<typeof session>[] = [];
      for (let step = 0; step < 12; step++) {
        const r = rnd();
        if (r < 0.3) { const s = session(at(DAY, 6 + Math.floor(rnd() * 14)), 30 + Math.floor(rnd() * 60)); made.push(s); await health.syncAfterFinish(s); }
        else if (r < 0.55) W.workouts.push(watchStrength(at(DAY, 6 + Math.floor(rnd() * 14), Math.floor(rnd() * 60)), 20 + Math.floor(rnd() * 80), rnd() < 0.2 ? { syncId: made[0]?.id } : {}));
        else if (r < 0.65) W.workouts.push(watchOther(at(DAY, 6 + Math.floor(rnd() * 14)), 30));
        else if (r < 0.75) W.fail.delete = !W.fail.delete; else if (r < 0.8) W.fail.workouts = !W.fail.workouts; else if (r < 0.85) { S().settings.healthRead = S().settings.healthRead ? undefined : true; if (!S().settings.healthRead) delete S().settings.healthRead; }
        else await health.retryHealth();
      }
      for (const [type, f] of W.calls.delete) { expect(type).toBe('HKWorkoutTypeIdentifier'); expect(f.metadata?.withMetadataKey).toBe('HKMetadataKeySyncIdentifier'); expect(typeof f.metadata?.value).toBe('string'); expect(f.metadata.value.length).toBeGreaterThan(0);
        expect(f.sources).toHaveLength(1); expect(f.sources[0].bundleIdentifier).toBe(OWN_BUNDLE); }
      expect(W.workouts.filter(x => x.bundle === WATCH_BUNDLE || x.bundle === undefined).length).toBe(W.workouts.filter(x => x.bundle !== OWN_BUNDLE).length); /* żaden wpis zegarka nie zniknął przez usuwanie: usuwane były tylko własne */
      const watchIds = new Set(W.deleted.map(d => d.count)); expect([...watchIds].every(c => c <= 1)).toBe(true);
    }
  });
  test('(c) sesja nigdy nie ma dwóch dopasowań, a trening z zegarka nigdy dwóch sesji — po losowych układach (przez loadWatchStats / matchesFor)', async () => {
    let seed = 11; const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
    for (let run = 0; run < 25; run++) {
      await fresh(); W = hkWorld(); const ses = Array.from({ length: 1 + Math.floor(rnd() * 4) }, (_, i) => session(at(DAY, 6 + i * 3, Math.floor(rnd() * 30)), 40 + Math.floor(rnd() * 90), `S${i}`));
      for (let i = 0; i < Math.floor(rnd() * 5); i++) W.workouts.push(watchStrength(at(DAY, 6 + Math.floor(rnd() * 12), Math.floor(rnd() * 60)), 20 + Math.floor(rnd() * 100)));
      const m = (await Q.matchesFor(ses))!; const vals = [...m.values()]; expect(new Set(vals).size).toBe(vals.length); expect([...m.keys()].every(id => ses.some(s => s.id === id))).toBe(true);
    }
  });
  test('(a) wartości ze Zdrowia (kroki, tętno, kcal, rodzaje, czasy) nie trafiają do stanu, kopii JSON ani CSV — po wszystkich odczytach', async () => {
    const s = session(at(DAY, 18)); W.steps[DAY] = 8432.5; W.workouts.push(watchStrength(at(DAY, 18, 2), 55, { hr: { avg: 128, max: 161 }, kcal: 312 }), watchOther(at(DAY, 7), 32));
    await Q.loadDay(DAY); await Q.loadWeek(at(DAY, 20)); await Q.loadWatchStats(s); await health.syncAfterFinish(s); await health.retryHealth(); await store.flush();
    const blobs = [JSON.stringify(S()), JSON.stringify(buildBackup()), buildCsv(), global.__kv.get('state') ?? '', global.__kv.get('cfg') ?? '', global.__kv.get('live') ?? ''];
    for (const b of blobs) { for (const needle of ['8432', '"avgBpm"', '"maxBpm"', '"kcal"', '"steps"', '5200', WATCH_BUNDLE, 'bundleIdentifier', 'sourceRevision']) expect(b).not.toContain(needle); }
    expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch'); /* jedyny ślad: znacznik, nie dane zdrowotne */
  });
  test('zapis → restart: znacznik „watch” i ustawienie odczytu przeżywają, a po restarcie nie ma w stanie żadnych wartości ze Zdrowia', async () => {
    const s = session(at(DAY, 18)); W.workouts.push(watchStrength(at(DAY, 18, 2), 55)); await health.syncAfterFinish(s); await store.flush(); await fresh(saved());
    expect(S().settings.healthRead).toBe(true); expect(S().workouts.find(x => x.id === s.id)!.healthUUID).toBe('watch');
  });
});

describe('zgoda na odczyt: ensureReadAuthorization', () => {
  test('prosi o dokładnie typy z HEALTH_READ_TYPES do odczytu i NIC do zapisu; po zamknięciu arkusza „ok”', async () => {
    expect(await health.ensureReadAuthorization()).toBe('ok'); expect(W.spies.requestAuthorization).toHaveBeenCalledWith({ toRead: HEALTH_READ_TYPES, toShare: [] }); expect(W.spies.requestAuthorization).toHaveBeenCalledTimes(1);
  });
  test('HealthKit niedostępny → „unavailable” bez prośby; prośba nieobsłużona albo wyjątek → „failed”', async () => {
    W.available = false; expect(await health.ensureReadAuthorization()).toBe('unavailable'); expect(W.spies.requestAuthorization).not.toHaveBeenCalled(); W.available = true;
    W.spies.requestAuthorization.mockImplementation((async () => false) as any); expect(await health.ensureReadAuthorization()).toBe('failed');
    W.spies.requestAuthorization.mockImplementation((async () => { throw new Error('ObjC'); }) as any); expect(await health.ensureReadAuthorization()).toBe('failed');
  });
  test('zgoda na zapis nadal prosi tylko o zapis (toRead puste) — odczyt nie wpływa na dotychczasowe zachowanie', async () => {
    expect(await health.ensureAuthorization()).toBe(true); expect(W.spies.requestAuthorization).toHaveBeenCalledWith({ toRead: [], toShare: ['HKWorkoutTypeIdentifier'] });
  });
});
