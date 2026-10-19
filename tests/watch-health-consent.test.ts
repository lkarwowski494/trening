/* Apple Watch: zgoda na Zdrowie przy pierwszym otwarciu aplikacji na zegarku, nie dopiero przy pierwszym treningu (decyzja właściciela 14.10.2026, docs/35-zegarek-apple).
 * Zachowanie sprawdza XCTest (WatchStoreTests: testStartAsksForHealthAuthorizationOnFirstLaunchWithoutStartingSession i dwa pokrewne; uruchamia je CI na macOS).
 * Na Linuksie bez kompilatora Swift ten test pilnuje, że kod i XCTest istnieją i są połączone: protokół → store.start() → kontroler HealthKit → start aplikacji. */
import * as fs from 'fs';
import * as path from 'path';

const W = path.join(__dirname, '..', 'targets');
const read = (...p: string[]) => fs.readFileSync(path.join(W, ...p), 'utf8');
const body = (src: string, header: RegExp) => { const m = header.exec(src); if (!m) return ''; let i = src.indexOf('{', m.index), d = 0, j = i; for (; j < src.length; j++) { if (src[j] === '{') d++; else if (src[j] === '}' && --d === 0) break; } return src.slice(i, j + 1); };

describe('zgoda na Zdrowie przy otwarciu aplikacji (zegarek)', () => {
  const store = read('watch-app', 'Core', 'WatchStore.swift'), ctl = read('watch-app', 'WorkoutController.swift'), app = read('watch-app', 'TreningWatchApp.swift');
  test('protokół WorkoutDriver ma requestAuthorization, a fałszywa sesja ją liczy', () => {
    expect(body(store, /protocol WorkoutDriver/)).toContain('func requestAuthorization()');
    expect(read('watch-app', 'Core', 'WatchFakes.swift')).toMatch(/authorizationRequests[\s\S]*func requestAuthorization\(\) \{ authorizationRequests \+= 1 \}/);
  });
  test('WatchStore.start() prosi o zgodę przed aktywacją transportu; powrót na ekran (didBecomeActive) i polecenie sesji — nie', () => {
    const start = body(store, /\n  func start\(\) \{/); expect(start).toContain('workout.requestAuthorization()');
    expect(start.indexOf('workout.requestAuthorization()')).toBeLessThan(start.indexOf('transport.activate()'));
    expect(body(store, /func didBecomeActive\(\)/)).not.toContain('requestAuthorization');
    expect(body(store, /private func handleSession/)).not.toContain('requestAuthorization');
  });
  test('kontroler HealthKit: prośba o zapis i odczyt tych samych typów co sesja, tylko gdy dane Zdrowia są dostępne', () => {
    const f = body(ctl, /func requestAuthorization\(\)/);
    expect(f).toContain('HKHealthStore.isHealthDataAvailable()'); expect(f).toContain('store.requestAuthorization(toShare: shareTypes, read: readTypes)');
  });
  test('aplikacja woła store.start() przy pokazaniu pierwszego ekranu', () => {
    expect(app).toMatch(/RootView\(store: AppEnvironment\.shared\.store\)[\s\S]*\.onAppear \{ AppEnvironment\.shared\.store\.start\(\) \}/);
  });
  test('XCTest istnieją: prośba przy starcie bez sesji, jedna na uruchomienie (nie przy powrocie), polecenie sesji działa', () => {
    const t = read('watch-tests', 'WatchCoreTests', 'WatchStoreTests.swift');
    for (const n of ['testStartAsksForHealthAuthorizationOnFirstLaunchWithoutStartingSession', 'testAuthorizationIsAskedOncePerLaunchNotOnResume', 'testSessionStartFromPhoneWorksWithoutPriorAuthorizationRequest'])
      expect([n, t.includes(`func ${n}()`)]).toEqual([n, true]);
  });
});
