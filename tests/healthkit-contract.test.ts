/*
 * 0.15.0 — aktualizacja @kingstinct/react-native-healthkit 8.7 → 16.1 (docs/28). Zapis treningu do Zdrowia ma te same dane, metadane i zgody co w 8.x;
 * zmienił się tylko kształt wywołań (kontrakt 16.x). Rodzaje (docs/20): logika (argumenty, wynik, zgody), regresja (te same dane co przed zmianą),
 * zależności (package.json / lockfile). Bez UI i bez E2E — zachowanie widoczne dla użytkownika bez zmian (docs/09, wiersz 0.15.0).
 */
import * as store from '@/lib/store';
import * as health from '@/lib/health';
import { fresh, addWorkout } from './helpers';

const hk = () => require('@kingstinct/react-native-healthkit').default;
const proxy = (uuid: string) => (global as any).__hkProxy(uuid) as { uuid: string; dispose: jest.Mock };
beforeEach(async () => { await fresh(); });
afterEach(() => { jest.restoreAllMocks(); });

describe('kontrakt biblioteki 16.x: zapis treningu', () => {
  test('saveWorkoutSample dostaje rodzaj, puste próbki, start, koniec, brak sum i metadane (pozycyjnie); UUID z proxy, proxy zwolnione', async () => {
    const p = proxy('HK-UUID-1'); const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => p);
    const w = addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 40, reps: 5, kind: 'warmup', warmup: true }]]]); w.templateName = 'Push';
    expect(await health.saveWorkout(w)).toBe('saved');
    expect(sv).toHaveBeenCalledTimes(1); const a = sv.mock.calls[0] as any[]; expect(a).toHaveLength(6);
    expect(a[0]).toBe(health.workoutActivityType(w)); expect(a[1]).toEqual([]); expect(a[2]).toEqual(new Date(health.healthStart(w))); expect(a[3]).toEqual(new Date(w.finishedAt!)); expect(a[4]).toBeUndefined();
    expect(a[5]).toEqual({ HKMetadataKeySyncIdentifier: w.id, HKMetadataKeySyncVersion: 1, Workout: 'Push', VolumeKg: 500, Sets: 1 });
    expect(store.getState().workouts.find(x => x.id === w.id)!.healthUUID).toBe('HK-UUID-1'); expect(p.dispose).toHaveBeenCalledTimes(1);
  });
  test('odrzucona obietnica (odmowa / błąd zapisu) = failed, bez znacznika zapisu', async () => {
    jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => { throw new Error('HealthKit'); });
    const w = addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    expect(await health.saveWorkout(w)).toBe('failed'); expect(w.healthUUID).toBeNull();
  });
  test('proxy bez UUID: zapisany znacznik „saved” (jak w 8.x przy braku identyfikatora)', async () => {
    jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => ({ uuid: '', dispose: () => {} }));
    const w = addWorkout(new Date(2026, 9, 1, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]);
    expect(await health.saveWorkout(w)).toBe('saved'); expect(w.healthUUID).toBe('saved');
  });
  test('rodzaje treningu: wartości liczbowe jak w enum WorkoutActivityType 16.x (potwierdzone w kodzie paczki)', () => {
    expect(health.HK_ACTIVITY).toEqual({ traditionalStrength: 50, functionalStrength: 20, running: 37, walking: 52, cycling: 13, rowing: 35, elliptical: 16, stairClimbing: 44, jumpRope: 64, mixedCardio: 73 });
  });
});

describe('kontrakt biblioteki 16.x: zgody', () => {
  test('requestAuthorization({ toRead: [], toShare: [trening] }) — tylko zapis, bez odczytu; zgoda = status 2 (synchroniczny)', async () => {
    const h = hk(); h.isHealthDataAvailableAsync = async () => true; const req = jest.spyOn(h, 'requestAuthorization').mockImplementation(async () => true);
    const st = jest.spyOn(h, 'authorizationStatusFor').mockImplementation(() => 2);
    expect(await health.ensureAuthorization()).toBe(true);
    expect(req).toHaveBeenCalledWith({ toRead: [], toShare: ['HKWorkoutTypeIdentifier'] }); expect(st).toHaveBeenCalledWith('HKWorkoutTypeIdentifier');
    st.mockImplementation(() => 1); expect(await health.ensureAuthorization()).toBe(false); st.mockImplementation(() => 0); expect(await health.ensureAuthorization()).toBe(false);
  });
  test('HealthKit niedostępny (iPad / symulator) albo prośba nieobsłużona — brak zgody, bez wyjątku', async () => {
    const h = hk(); h.isHealthDataAvailableAsync = async () => false; expect(await health.ensureAuthorization()).toBe(false);
    h.isHealthDataAvailableAsync = async () => true; jest.spyOn(h, 'requestAuthorization').mockImplementation(async () => false); expect(await health.ensureAuthorization()).toBe(false);
    jest.spyOn(h, 'requestAuthorization').mockImplementation(async () => { throw new Error('ObjC'); }); expect(await health.ensureAuthorization()).toBe(false);
  });
});

describe('zależności 0.15.0', () => {
  test('package.json: biblioteka 16.x i jawne react-native-nitro-modules zgodne z peerDependencies (>=0.35); bez zmiany Expo/RN', () => {
    const pkg = require('../package.json'); const major = (v: string) => Number(v.replace(/^[^\d]*/, '').split('.')[0]);
    expect(major(pkg.dependencies['@kingstinct/react-native-healthkit'])).toBe(16);
    const [, minor] = pkg.dependencies['react-native-nitro-modules'].replace(/^[^\d]*/, '').split('.').map(Number); expect(minor).toBeGreaterThanOrEqual(35);
    const lock = require('../package-lock.json').packages; expect(lock['node_modules/@kingstinct/react-native-healthkit'].version).toMatch(/^16\./); expect(lock['node_modules/react-native-nitro-modules'].version).toBeTruthy();
  });
});
