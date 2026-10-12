/*
 * 0.16.0, odczyt z Apple Health (docs/29 rozdz. 12 pkt 1, 4): LOGIKA bez HealthKit — reguła dopasowania treningu z zegarka do sesji, filtr „innych aktywności”, agregacje kroków
 * (dzień, średnia z 7 dni), parsowanie kształtów biblioteki 16.x, stałe (typy odczytu, rodzaje do łączenia, jednostki), filtr usuwania własnej kopii i formatowanie
 * (pl i en). Rodzaje (docs/20): logika, macierz (stałe z lib/ iterowane), niezmienniki (determinizm dopasowania, jeden-do-jednego, filtr zawsze z dwoma warunkami).
 */
import * as fs from 'fs';
import * as path from 'path';
import { applyLang } from '@/lib/i18n';
import { HK_ACTIVITY } from '@/lib/health';
import * as R from '@/lib/healthRead';
import { HEALTH_READ_TYPES, WATCH_MATCH_TYPES, STEPS_AVG_DAYS, WATCH_RECONCILE_WINDOW_DAYS, HK_UNITS, HK_OP_EQUAL_TO, HK_SYNC_ID_KEY, HEALTH_UUID_WATCH, HK_STEP_TYPE, HK_WORKOUT_TYPE,
  HK_HEART_RATE_TYPE, HK_ACTIVE_ENERGY_TYPE, validSpan, overlapMs, parseWorkout, isOwnWorkout, isWatchCandidate, matchWatchWorkouts, otherActivities, startingIn, dayBounds,
  avgDailySteps, stepsByDay, watchStatsFrom, hasWatchStats, ownCopyFilter, fmtMinutes, stepsText, activityText, dayBlockSpoken, weekLineText, watchLineText, watchSpoken,
  type HkWorkout, type SessionSpan } from '@/lib/healthRead';
import { localISODate } from '@/lib/store';

afterEach(() => { applyLang('pl'); });
const MIN = 60e3, T0 = new Date(2026, 9, 10, 18, 0).getTime();
const hw = (uuid: string, startMin: number, endMin: number, over: Partial<HkWorkout> = {}): HkWorkout => ({ uuid, start: T0 + startMin * MIN, end: T0 + endMin * MIN, type: 50, durationSec: (endMin - startMin) * 60, distanceM: null, syncId: null, bundle: 'watch', ...over });
const ss = (id: string, startMin: number, endMin: number): SessionSpan => ({ id, start: T0 + startMin * MIN, end: T0 + endMin * MIN });
const NONE: ReadonlySet<string> = new Set();

describe('stałe (jedno miejsce)', () => {
  test('typy odczytu: kroki, treningi, tętno, aktywna energia — dokładnie te, bez powtórzeń; stałe nazw zgodne z biblioteką', () => {
    expect([...HEALTH_READ_TYPES]).toEqual(['HKQuantityTypeIdentifierStepCount', 'HKWorkoutTypeIdentifier', 'HKQuantityTypeIdentifierHeartRate', 'HKQuantityTypeIdentifierActiveEnergyBurned']);
    expect(new Set(HEALTH_READ_TYPES).size).toBe(HEALTH_READ_TYPES.length);
    expect([HK_STEP_TYPE, HK_WORKOUT_TYPE, HK_HEART_RATE_TYPE, HK_ACTIVE_ENERGY_TYPE]).toEqual([...HEALTH_READ_TYPES]);
    const gen = fs.readFileSync(path.join(__dirname, '..', 'node_modules/@kingstinct/react-native-healthkit/src/generated/healthkit.generated.ts'), 'utf8');
    for (const id of HEALTH_READ_TYPES.filter(x => x !== HK_WORKOUT_TYPE)) expect(gen).toContain(`'${id}'`); /* identyfikatory istnieją w typach biblioteki */
  });
  test.each([...WATCH_MATCH_TYPES])('rodzaj do łączenia %i jest siłowym rodzajem zapisu aplikacji (HK_ACTIVITY)', t => {
    expect([HK_ACTIVITY.traditionalStrength, HK_ACTIVITY.functionalStrength]).toContain(t);
  });
  test('P4 A: tylko dwa rodzaje siłowe; cardio (bieg, spacer…) nie jest łączone', () => {
    expect([...WATCH_MATCH_TYPES].sort()).toEqual([20, 50]); for (const k of ['running', 'walking', 'cycling', 'rowing', 'elliptical', 'mixedCardio'] as const) expect((WATCH_MATCH_TYPES as readonly number[]).includes(HK_ACTIVITY[k])).toBe(false);
  });
  test('operator equalTo = wartość ComparisonPredicateOperator z @react-native-healthkit/core; jednostki jawne (tętno na minutę, nie count/s)', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'node_modules/@react-native-healthkit/core/src/types/QueryOptions.ts'), 'utf8');
    expect(src).toMatch(new RegExp(`equalTo = ${HK_OP_EQUAL_TO},`)); expect(HK_UNITS).toEqual({ steps: 'count', heartRate: 'count/min', energy: 'kcal' }); expect(HK_SYNC_ID_KEY).toBe('HKMetadataKeySyncIdentifier');
  });
  test('średnia kroków z 7 dni; okno usuwania kopii nieustalone (null — decyzja po pomiarze, docs/29 5.7 pkt 3); znacznik „watch”', () => {
    expect(STEPS_AVG_DAYS).toBe(7); expect(WATCH_RECONCILE_WINDOW_DAYS).toBeNull(); expect(HEALTH_UUID_WATCH).toBe('watch');
  });
});

describe('przedziały: validSpan, overlapMs', () => {
  test('zwykły, stykanie końcami = 0, rozłączne = 0, zawieranie, częściowe, odwrócone / NaN / Infinity = 0', () => {
    expect(validSpan(1, 2)).toBe(true); expect(validSpan(2, 2)).toBe(false); expect(validSpan(3, 2)).toBe(false); expect(validSpan(NaN, 2)).toBe(false); expect(validSpan(1, Infinity)).toBe(false);
    expect(overlapMs(0, 10, 5, 20)).toBe(5); expect(overlapMs(0, 10, 10, 20)).toBe(0); expect(overlapMs(0, 10, 11, 20)).toBe(0); expect(overlapMs(0, 100, 10, 20)).toBe(10); expect(overlapMs(10, 20, 0, 100)).toBe(10);
    expect(overlapMs(10, 0, 0, 100)).toBe(0); expect(overlapMs(NaN, 10, 0, 100)).toBe(0); expect(overlapMs(0, 10, 0, Infinity)).toBe(0);
  });
});

describe('dopasowanie treningu z zegarka do sesji (matchWatchWorkouts)', () => {
  test('część wspólna 0 / stykanie / częściowa / pełna', () => {
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('a', 60, 90)]).size).toBe(0); /* stykanie */
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('a', 61, 90)]).size).toBe(0); /* rozłączne */
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('a', 59, 90)]).get('s')).toBe('a'); /* minuta wspólna */
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('a', 10, 50)]).get('s')).toBe('a'); /* zawarty */
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('a', 0, 60)]).get('s')).toBe('a'); /* pełne */
    expect(matchWatchWorkouts([ss('s', 10, 50)], [hw('a', 0, 100)]).get('s')).toBe('a'); /* trening z zegarka obejmuje sesję */
  });
  test('brak sesji / kandydatów / złe dane nie rzucają i dają pusty wynik', () => {
    expect(matchWatchWorkouts([], [hw('a', 0, 60)]).size).toBe(0); expect(matchWatchWorkouts([ss('s', 0, 60)], []).size).toBe(0);
    expect(matchWatchWorkouts([ss('s', 60, 0), { id: 'n', start: NaN, end: NaN }], [hw('a', 0, 60), { ...hw('b', 0, 60), start: NaN }]).size).toBe(0);
  });
  test('wielu kandydatów: najdłuższa część wspólna wygrywa; remis → wcześniejszy start treningu z zegarka', () => {
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('krótki', 50, 70), hw('długi', 5, 55), hw('średni', 40, 90)]).get('s')).toBe('długi');
    expect(matchWatchWorkouts([ss('s', 0, 60)], [hw('późny', 30, 90), hw('wczesny', -30, 30)]).get('s')).toBe('wczesny'); /* obaj po 30 min wspólnych */
  });
  test('jeden trening z zegarka najwyżej do jednej sesji (B3): trafia do sesji z większą częścią wspólną, druga bez danych', () => {
    const m = matchWatchWorkouts([ss('a', 0, 40), ss('b', 40, 100)], [hw('w', 20, 100)]); expect([...m.entries()]).toEqual([['b', 'w']]); /* 60 min z b, 20 min z a */
  });
  test('dwie sesje, dwa treningi: każda z własnym; przydział zachłanny nie zabiera pary lepszej', () => {
    const m = matchWatchWorkouts([ss('a', 0, 60), ss('b', 120, 180)], [hw('x', 5, 55), hw('y', 125, 175)]); expect(Object.fromEntries(m)).toEqual({ a: 'x', b: 'y' });
    const m2 = matchWatchWorkouts([ss('a', 0, 60), ss('b', 50, 110)], [hw('x', 0, 60), hw('y', 55, 110)]); expect(Object.fromEntries(m2)).toEqual({ a: 'x', b: 'y' });
  });
  test('niezmiennik: wynik nie zależy od kolejności wejścia (deterministyczny), jedna sesja ma najwyżej jeden trening i odwrotnie — 300 losowych układów', () => {
    let seed = 20261012; const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    for (let k = 0; k < 300; k++) {
      const sessions = Array.from({ length: 1 + Math.floor(rnd() * 5) }, (_, i) => { const s = Math.floor(rnd() * 600); return ss(`s${i}`, s, s + 20 + Math.floor(rnd() * 90)); });
      const cands = Array.from({ length: Math.floor(rnd() * 6) }, (_, i) => { const s = Math.floor(rnd() * 600); return hw(`w${i}`, s, s + 20 + Math.floor(rnd() * 90)); });
      const a = matchWatchWorkouts(sessions, cands); const b = matchWatchWorkouts(shuffle(sessions), shuffle(cands));
      expect([...a.entries()].sort()).toEqual([...b.entries()].sort());
      const vals = [...a.values()]; expect(new Set(vals).size).toBe(vals.length); expect(a.size).toBeLessThanOrEqual(Math.min(sessions.length, cands.length));
      for (const [sid, uuid] of a) { const s = sessions.find(x => x.id === sid)!, h = cands.find(x => x.uuid === uuid)!; expect(overlapMs(s.start, s.end, h.start, h.end)).toBeGreaterThan(0); }
    }
  });
});

describe('kandydaci i „inne aktywności”', () => {
  const OWN = new Set(['moja-sesja']);
  test('isWatchCandidate: rodzaj siłowy tak; cardio nie; własny znacznik synchronizacji nie; własne źródło nie; zły przedział nie', () => {
    expect(isWatchCandidate(hw('a', 0, 60), OWN, 'app')).toBe(true); expect(isWatchCandidate(hw('a', 0, 60, { type: 20 }), OWN, 'app')).toBe(true);
    expect(isWatchCandidate(hw('a', 0, 60, { type: 37 }), OWN, 'app')).toBe(false); expect(isWatchCandidate(hw('a', 0, 60, { syncId: 'moja-sesja' }), OWN, 'app')).toBe(false);
    expect(isWatchCandidate(hw('a', 0, 60, { bundle: 'app' }), OWN, 'app')).toBe(false); expect(isWatchCandidate(hw('a', 60, 0), OWN, 'app')).toBe(false);
    expect(isWatchCandidate(hw('a', 0, 60, { syncId: 'cudzy-id' }), OWN, 'app')).toBe(true); /* cudzy znacznik nie jest naszym wpisem */
    expect(isWatchCandidate(hw('a', 0, 60, { bundle: null }), OWN, null)).toBe(true); /* brak źródła aplikacji i brak źródła treningu */
  });
  test('isOwnWorkout: znacznik z naszych id albo źródło tej aplikacji', () => {
    expect(isOwnWorkout(hw('a', 0, 1, { syncId: 'moja-sesja' }), OWN)).toBe(true); expect(isOwnWorkout(hw('a', 0, 1, { bundle: 'app' }), OWN, 'app')).toBe(true); expect(isOwnWorkout(hw('a', 0, 1), OWN, 'app')).toBe(false);
  });
  test('otherActivities: bez własnych wpisów, bez dopasowanych, bez złych przedziałów; rosnąco po starcie; bieg i spacer wchodzą (P8: bez kategorii)', () => {
    const list = [hw('bieg', 300, 332, { type: 37, distanceM: 5200 }), hw('spacer', 100, 145, { type: 52 }), hw('dopasowany', 0, 60), hw('moj', 10, 70, { syncId: 'moja-sesja' }), hw('ze-zrodla', 20, 80, { bundle: 'app' }), hw('zly', 90, 90), hw('nie-dopasowany-silowy', 400, 460)];
    expect(otherActivities(list, OWN, 'app', new Set(['dopasowany'])).map(h => h.uuid)).toEqual(['spacer', 'bieg', 'nie-dopasowany-silowy']);
    expect(otherActivities([], OWN, 'app', NONE)).toEqual([]);
  });
  test('startingIn: aktywność przechodząca przez północ liczy się do dnia startu; granice [od, do)', () => {
    const d = dayBounds('2026-10-10'); const night = { ...hw('n', 0, 1), start: d.to - 30 * MIN, end: d.to + 30 * MIN }; const next = { ...hw('m', 0, 1), start: d.to, end: d.to + 30 * MIN };
    expect(startingIn([night, next], d.from, d.to).map(h => h.uuid)).toEqual(['n']); expect(startingIn([night, next], d.to, d.to + 864e5).map(h => h.uuid)).toEqual(['m']);
  });
});

describe('parseWorkout: kształt WorkoutProxy 16.x → prosty obiekt', () => {
  const p = (over: any = {}) => ({ uuid: 'u1', startDate: new Date(T0), endDate: new Date(T0 + 45 * MIN), workoutActivityType: 50, duration: { unit: 's', quantity: 2400 }, totalDistance: { unit: 'meters', quantity: 5200 },
    metadata: { HKMetadataKeySyncIdentifier: 'moja-sesja', Workout: 'x' }, sourceRevision: { source: { name: 'n', bundleIdentifier: 'com.x' } }, ...over });
  test('pełny: czasy w ms, czas trwania z pola duration (aktywny, bez pauz), dystans w metrach, znacznik synchronizacji i źródło', () => {
    expect(parseWorkout(p() as any)).toEqual({ uuid: 'u1', start: T0, end: T0 + 45 * MIN, type: 50, durationSec: 2400, distanceM: 5200, syncId: 'moja-sesja', bundle: 'com.x' });
  });
  test('brak pól opcjonalnych: czas trwania = koniec − start, dystans null, znacznik null, źródło null; dystans 0 = null', () => {
    const x = parseWorkout(p({ duration: undefined, totalDistance: { unit: 'meters', quantity: 0 }, metadata: {}, sourceRevision: undefined }) as any)!;
    expect([x.durationSec, x.distanceM, x.syncId, x.bundle]).toEqual([2700, null, null, null]);
    expect(parseWorkout(p({ duration: { quantity: -5 }, metadata: undefined }) as any)!.durationSec).toBe(2700);
  });
  test('złe dane: brak uuid, brak dat, odwrócony przedział, NaN, brak rodzaju, null/undefined → null (bez wyjątku)', () => {
    for (const bad of [null, undefined, {}, p({ uuid: '' }), p({ uuid: 5 }), p({ startDate: undefined }), p({ endDate: new Date(T0 - MIN) }), p({ endDate: new Date(NaN) }), p({ workoutActivityType: undefined }), p({ workoutActivityType: NaN })]) expect(parseWorkout(bad as any)).toBeNull();
  });
});

describe('kroki: dzień, średnia z 7 dni', () => {
  const key = (ts: number) => localISODate(new Date(ts));
  test('stepsByDay: klucz dnia z startDate, wartość z sumy; dni bez sumy i ujemne pomijane; zaokrąglenie; null/undefined → pusta mapa', () => {
    const d = (k: string) => dayBounds(k).from;
    const m = stepsByDay([{ startDate: new Date(d('2026-10-09')), sumQuantity: { unit: 'count', quantity: 8432.4 } }, { startDate: new Date(d('2026-10-10')) }, { startDate: new Date(d('2026-10-11')), sumQuantity: { quantity: -1 } },
      { startDate: new Date(d('2026-10-12')), sumQuantity: { quantity: 0 } }, { startDate: undefined, sumQuantity: { quantity: 5 } } as any], key);
    expect([...m.entries()]).toEqual([['2026-10-09', 8432], ['2026-10-12', 0]]); expect(stepsByDay(null, key).size).toBe(0); expect(stepsByDay(undefined, key).size).toBe(0);
  });
  test('avgDailySteps: średnia z dni z danymi (dzień bez pomiaru nie zaniża), zaokrąglenie, zero kroków to dane, brak danych = null, NaN i ujemne ignorowane', () => {
    const days = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    expect(avgDailySteps(new Map(days.map((k, i) => [k, 1000 * (i + 1)] as [string, number])), days)).toBe(4000);
    expect(avgDailySteps(new Map([['a', 5000], ['b', 7001]]), days)).toBe(6001); /* tylko 2 dni z danymi: (5000 + 7001) / 2 = 6000,5 → 6001 */
    expect(avgDailySteps(new Map([['a', 0], ['b', 0]]), days)).toBe(0); expect(avgDailySteps(new Map(), days)).toBeNull(); expect(avgDailySteps(new Map([['a', NaN], ['b', -3]]), days)).toBeNull();
    expect(avgDailySteps(new Map([['inny', 9]]), days)).toBeNull(); expect(avgDailySteps(new Map([['a', 1]]), [])).toBeNull();
  });
  test('dayBounds: początek dnia lokalnego i następnego; dzień ma 23–25 h (zmiana czasu); klucze zgodne z dayKeyOf', () => {
    for (const k of ['2026-10-10', '2026-03-29', '2026-10-25', '2026-01-01', '2026-12-31']) { const b = dayBounds(k); const h = (b.to - b.from) / 3600e3; expect(h >= 23 && h <= 25).toBe(true); expect(key(b.from)).toBe(k); expect(key(b.to - 1)).toBe(k); }
    expect(Number.isNaN(dayBounds('zły').from)).toBe(true);
  });
});

describe('statystyki treningu z zegarka: watchStatsFrom', () => {
  test('tętno średnie i maksymalne zaokrąglone; kcal z sumy; brakujące pola pomijane', () => {
    expect(watchStatsFrom({ averageQuantity: { quantity: 127.6 }, maximumQuantity: { quantity: 161.2 } }, { sumQuantity: { quantity: 311.7 } })).toEqual({ avgBpm: 128, maxBpm: 161, kcal: 312 });
    expect(watchStatsFrom({ averageQuantity: { quantity: 120 } }, undefined)).toEqual({ avgBpm: 120 }); expect(watchStatsFrom(undefined, { sumQuantity: { quantity: 99.4 } })).toEqual({ kcal: 99 });
  });
  test('zapasowo totalEnergyBurned, gdy brak sumy aktywnej energii; suma ma pierwszeństwo', () => {
    expect(watchStatsFrom(undefined, undefined, 250.2)).toEqual({ kcal: 250 }); expect(watchStatsFrom(undefined, { sumQuantity: { quantity: 100 } }, 250)).toEqual({ kcal: 100 });
  });
  test('zero, ujemne, NaN, undefined → bez wartości; hasWatchStats', () => {
    const e = watchStatsFrom({ averageQuantity: { quantity: 0 }, maximumQuantity: { quantity: NaN } }, { sumQuantity: { quantity: -4 } }, null); expect(e).toEqual({}); expect(hasWatchStats(e)).toBe(false);
    expect(hasWatchStats({ kcal: 1 })).toBe(true); expect(hasWatchStats({ avgBpm: 1 })).toBe(true); expect(hasWatchStats(null)).toBe(false); expect(hasWatchStats(undefined)).toBe(false);
  });
});

describe('filtr usuwania własnej kopii: ownCopyFilter (niezmiennik: zawsze id ORAZ własne źródło)', () => {
  const SRC = { name: 'Trening', bundleIdentifier: 'com.test.trening' };
  test('poprawny: znacznik synchronizacji = id sesji i źródło = ta aplikacja', () => {
    expect(ownCopyFilter('sesja-1', SRC)).toEqual({ metadata: { withMetadataKey: 'HKMetadataKeySyncIdentifier', operatorType: HK_OP_EQUAL_TO, value: 'sesja-1' }, sources: [SRC] });
  });
  test.each([['pusty id', '', SRC], ['brak id', undefined as any, SRC], ['id nie-tekst', 5 as any, SRC], ['brak źródła', 'sesja-1', undefined], ['źródło null', 'sesja-1', null], ['źródło nie-obiekt', 'sesja-1', 'app' as any]])('%s → null (usuwanie się nie odbywa)', (_n, id, src) => {
    expect(ownCopyFilter(id, src as any)).toBeNull();
  });
});

describe('formatowanie (pl i en)', () => {
  const g = (n: number, loc = 'pl-PL') => n.toLocaleString(loc);
  test('stepsText i activityText: kroki z separatorem wg języka; aktywność „Inna aktywność · 32 min · 5,2 km”, bez dystansu bez trzeciego członu', () => {
    expect(stepsText(8432)).toBe(`Kroki: ${g(8432)}`); expect(activityText({ durationSec: 32 * 60, distanceM: 5200 })).toBe('Inna aktywność · 32 min · 5,2 km');
    expect(activityText({ durationSec: 45 * 60, distanceM: null })).toBe('Inna aktywność · 45 min'); expect(activityText({ durationSec: 600, distanceM: 800 })).toBe('Inna aktywność · 10 min · 800 m');
    applyLang('en'); expect(stepsText(8432)).toMatch(/^Steps: 8[,\s]?432$/); expect(activityText({ durationSec: 32 * 60, distanceM: 5200 })).toBe('Other activity · 32 min · 5.2 km');
  });
  test('fmtMinutes: poniżej minuty = 1 min, od godziny „1 h 5 min”, pełna godzina bez minut', () => {
    expect([fmtMinutes(10), fmtMinutes(60), fmtMinutes(3540), fmtMinutes(3600), fmtMinutes(3900), fmtMinutes(7200)]).toEqual(['1 min', '1 min', '59 min', '1 h', '1 h 5 min', '2 h']);
  });
  test('weekLineText: średnia + liczba aktywności (liczebniki pl), same kroki, same aktywności, nic = pusty tekst', () => {
    expect(weekLineText(7842, 2)).toBe(`Apple Health: Kroki dziennie (średnia z 7 dni): ${g(7842)} · 2 inne aktywności w tym tygodniu`);
    expect(weekLineText(7842, 0)).toBe(`Apple Health: Kroki dziennie (średnia z 7 dni): ${g(7842)}`); expect(weekLineText(null, 1)).toBe('Apple Health: 1 inna aktywność w tym tygodniu');
    expect(weekLineText(null, 5)).toBe('Apple Health: 5 innych aktywności w tym tygodniu'); expect(weekLineText(null, 0)).toBe(''); expect(weekLineText(0, 0)).toBe(`Apple Health: Kroki dziennie (średnia z 7 dni): 0`);
    applyLang('en'); expect(weekLineText(7842, 2)).toMatch(/^Apple Health: Steps per day \(average of 7 days\): 7[,\s]?842 · 2 other activities this week$/); expect(weekLineText(null, 1)).toBe('Apple Health: 1 other activity this week');
  });
  test('watchLineText: pełna linia, same tętno, tylko maks., same kcal, nic', () => {
    expect(watchLineText({ avgBpm: 128, maxBpm: 161, kcal: 312 })).toBe('Apple Health (zegarek): tętno śr. 128 /min, maks. 161 /min · 312 kcal aktywne');
    expect(watchLineText({ avgBpm: 128 })).toBe('Apple Health (zegarek): tętno śr. 128 /min'); expect(watchLineText({ maxBpm: 161 })).toBe('Apple Health (zegarek): tętno maks. 161 /min');
    expect(watchLineText({ kcal: 312 })).toBe('Apple Health (zegarek): 312 kcal aktywne'); expect(watchLineText({})).toBe('');
    applyLang('en'); expect(watchLineText({ avgBpm: 128, maxBpm: 161, kcal: 312 })).toBe('Apple Health (watch): avg. heart rate 128 /min, max 161 /min · 312 active kcal');
  });
  test('VoiceOver: jednostki słownie (minuty, kilokalorie, na minutę), bez interpretacji', () => {
    expect(watchSpoken({ avgBpm: 128, maxBpm: 161, kcal: 312 })).toBe('Z zegarka: tętno średnie 128 na minutę, maksymalne 161; 312 kilokalorii aktywnych');
    expect(watchSpoken({ maxBpm: 161 })).toBe('Z zegarka: tętno maksymalne 161 na minutę'); expect(watchSpoken({ avgBpm: 90 })).toBe('Z zegarka: tętno średnie 90 na minutę'); expect(watchSpoken({})).toBe('');
    expect(dayBlockSpoken(8432, [{ durationSec: 32 * 60, distanceM: 5200 }, { durationSec: 60, distanceM: null }])).toBe(`Apple Health: kroki ${g(8432)}; inna aktywność, 32 minuty, 5,2 km; inna aktywność, 1 minuta`);
    expect(dayBlockSpoken(null, [{ durationSec: 150, distanceM: null }])).toBe('Apple Health: inna aktywność, 3 minuty'); expect(dayBlockSpoken(10, [])).toBe(`Apple Health: kroki 10`);
    applyLang('en'); expect(dayBlockSpoken(10, [{ durationSec: 120, distanceM: null }])).toBe('Apple Health: steps 10; other activity, 2 minutes');
  });
  test('żaden tekst nie zawiera polskich napisów w angielskim ani nawiasów klamrowych', () => {
    applyLang('en'); const all = [stepsText(1), activityText({ durationSec: 60, distanceM: 10 }), weekLineText(10, 1), watchLineText({ avgBpm: 1, maxBpm: 2, kcal: 3 }), watchSpoken({ avgBpm: 1, maxBpm: 2, kcal: 3 }), dayBlockSpoken(1, [{ durationSec: 60, distanceM: 10 }])].join(' ');
    expect(all).not.toMatch(/[ąęłńśźżĄĘŁŃŚŹŻ{}]/); expect(all).not.toMatch(/Kroki|aktywn|zegarka|tętno/);
  });
});

test('eksporty modułu to funkcje i stałe (kontrola kształtu: nic nie zostało usunięte przypadkiem)', () => {
  for (const k of ['validSpan', 'overlapMs', 'parseWorkout', 'isOwnWorkout', 'isWatchCandidate', 'matchWatchWorkouts', 'otherActivities', 'startingIn', 'dayBounds', 'avgDailySteps', 'stepsByDay', 'watchStatsFrom', 'hasWatchStats', 'ownCopyFilter', 'fmtMinutes', 'stepsText', 'activityText', 'dayBlockSpoken', 'weekLineText', 'watchLineText', 'watchSpoken']) expect(typeof (R as any)[k]).toBe('function');
});
