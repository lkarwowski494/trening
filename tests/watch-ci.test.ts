/* Skrypty CI zegarka (docs/35-zegarek-apple): wybór symulatora watchOS i zrzuty — logika sprawdzana na Linuksie bez Xcode (wynik `simctl list` podany z pliku). */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const root = path.join(__dirname, '..');
const script = (n: string) => path.join(root, 'scripts', 'ci', n);
const list = (devices: Record<string, Array<{ name: string; udid: string }>>) => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'simctl-')), 'list.json');
  fs.writeFileSync(f, JSON.stringify({ devices })); return f;
};
const pick = (devices: Record<string, Array<{ name: string; udid: string }>>, pattern?: string) =>
  execFileSync('bash', [script('watch-simulator.sh'), ...(pattern ? [pattern] : [])], { env: { ...process.env, DRY_RUN: '1', SIMCTL_LIST_JSON: list(devices) }, encoding: 'utf8' }).trim();

describe('scripts/ci/watch-simulator.sh', () => {
  const D = {
    'com.apple.CoreSimulator.SimRuntime.iOS-26-5': [{ name: 'iPhone 17', udid: 'IOS-1' }],
    'com.apple.CoreSimulator.SimRuntime.watchOS-26-2': [{ name: 'Apple Watch SE 3 (44mm)', udid: 'SE-262' }, { name: 'Apple Watch Series 11 (46mm)', udid: 'S11-262' }, { name: 'Apple Watch Ultra 3 (49mm)', udid: 'U3-262' }],
    'com.apple.CoreSimulator.SimRuntime.watchOS-26-4': [{ name: 'Apple Watch Series 11 (46mm)', udid: 'S11-264' }, { name: 'Apple Watch Ultra 3 (49mm)', udid: 'U3-264' }],
    'com.apple.CoreSimulator.SimRuntime.watchOS-11-5': [{ name: 'Apple Watch Series 10 (46mm)', udid: 'S10-115' }],
  };
  test('domyślnie: Series 10/11 z najnowszego watchOS (nie iPhone, nie starszy system)', () => { expect(pick(D)).toBe('S11-264'); });
  test('wzorzec nazwy: Ultra, SE; najnowszy system, na którym jest taki zegarek', () => {
    expect(pick(D, 'Apple Watch Ultra')).toBe('U3-264'); expect(pick(D, 'Apple Watch SE')).toBe('SE-262'); expect(pick(D, 'Series 10')).toBe('S10-115');
  });
  test('wzorzec bez dopasowania: dowolny dostępny zegarek (najnowszy system), nigdy iPhone', () => { expect(pick(D, 'Nie ma takiego')).toMatch(/^(S11|U3)-264$/); });
  test('brak symulatorów watchOS: błąd z komunikatem', () => {
    expect(() => pick({ 'com.apple.CoreSimulator.SimRuntime.iOS-26-5': [{ name: 'iPhone 17', udid: 'x' }] })).toThrow();
  });
  test('wypisuje wyłącznie identyfikator (log CI jest publiczny)', () => { expect(pick(D)).not.toMatch(/\s|Apple Watch/); });
});

describe('scripts/ci/watch-screenshots.sh', () => {
  const sh = fs.readFileSync(script('watch-screenshots.sh'), 'utf8');
  test('identyfikator pakietu = celu zegarka; stany zrzutów istnieją jako pliki złote; Debug przez SIMCTL_CHILD_', () => {
    const cfg = fs.readFileSync(path.join(root, 'targets/watch-app/expo-target.config.js'), 'utf8');
    expect(cfg).toContain("bundleIdentifier: '.watchkitapp'"); expect(sh).toContain('BUNDLE="pl.lukasz.trening.watchkitapp"');
    for (const s of sh.match(/STATES="([^"]+)"/)![1].split(' ')) expect(fs.existsSync(path.join(root, 'watch-fixtures/snapshots', `${s}.json`))).toBe(true);
    expect(sh).toContain('SIMCTL_CHILD_WATCH_FAKE_SNAPSHOT_JSON');
    const app = fs.readFileSync(path.join(root, 'targets/watch-app/TreningWatchApp.swift'), 'utf8');
    expect(app).toMatch(/#if DEBUG[\s\S]*WATCH_FAKE_SNAPSHOT_JSON[\s\S]*#endif/); /* wydanie ignoruje zmienną: sztuczny transport tylko w Debug */
  });
  test('okno „Cofnij” dłuższe w testach UI: zmienna tylko w Debug, każdy start w XCUITest ją ustawia, domyślnie 5 s w aplikacji (przebieg 39365741191)', () => {
    const app = fs.readFileSync(path.join(root, 'targets/watch-app/TreningWatchApp.swift'), 'utf8');
    const i = app.indexOf('WATCH_FAKE_UNDO_SEC'); expect(i).toBeGreaterThan(-1);
    const before = app.slice(0, i); expect((before.match(/^\s*#if DEBUG/gm) || []).length).toBeGreaterThan((before.match(/^\s*#endif/gm) || []).length);
    const client = fs.readFileSync(path.join(root, 'targets/watch-app/Core/WatchClient.swift'), 'utf8');
    expect(client).toMatch(/var undoSec: Int\? = nil/); expect(client).toContain('s.cfg.undoSec ?? WatchLimits.undoSec');
    expect(app).not.toMatch(/static let config = ClientConfig\([^)]*undoSec/); /* wydanie: nigdy nie ustawia okna */
    const ui = fs.readFileSync(path.join(root, 'targets/watch-ui-tests/WatchUITests.swift'), 'utf8');
    expect(ui.match(/launchEnvironment\["WATCH_FAKE_UNDO_SEC"\]/g)).toHaveLength(1); /* jedno miejsce uruchamiania: wszystkie testy dostają okno */
    expect(ui).toMatch(/undoSec: Int = 120/);
  });
  test('przed zrzutami zegarek jest sparowany z iPhone\'em (bez tego czerwona ikona braku telefonu na wszystkich zrzutach; 29.10.2026)', () => {
    const iPair = sh.indexOf('watch-pair.sh'); expect(iPair).toBeGreaterThan(-1);
    expect(iPair).toBeLessThan(sh.indexOf('for lang in')); /* para przed pierwszym zrzutem */
    const pair = fs.readFileSync(script('watch-pair.sh'), 'utf8');
    for (const c of ['simctl pair "$WATCH"', 'pair_activate', 'simctl boot "$PHONE"', 'simctl boot "$WATCH"']) expect(pair).toContain(c);
  });
  test('"all" bierze języki z labels.json (35)', () => {
    const labels = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/watch-app/labels.json'), 'utf8')); expect(Object.keys(labels)).toHaveLength(35);
    expect(sh).toContain('labels.json');
  });
});

describe('zabezpieczenie wydania: sztuczny transport zegarka nie trafia do Release', () => {
  test('wszystkie odwołania do FakeTransport poza Core i testami są w #if DEBUG', () => {
    const dir = path.join(root, 'targets/watch-app');
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.swift'))) {
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      for (const m of src.matchAll(/FakeTransport|FakeWorkout|FakeHaptics|MemoryPersistence/g)) {
        const before = src.slice(0, m.index); const opens = (before.match(/^\s*#if DEBUG/gm) || []).length; const closes = (before.match(/^\s*#endif/gm) || []).length;
        expect([f, opens > closes]).toEqual([f, true]);
      }
    }
  });
});

describe('scripts/ci/watch-pair.sh', () => {
  const D = {
    'com.apple.CoreSimulator.SimRuntime.iOS-18-5': [{ name: 'iPhone 16', udid: 'P-185' }],
    'com.apple.CoreSimulator.SimRuntime.iOS-26-2': [{ name: 'iPhone 17', udid: 'P-262' }, { name: 'iPad Pro', udid: 'IPAD' }],
    'com.apple.CoreSimulator.SimRuntime.iOS-26-4': [{ name: 'iPhone 17 Pro', udid: 'P-264' }],
    'com.apple.CoreSimulator.SimRuntime.watchOS-26-4': [{ name: 'Apple Watch Series 11 (46mm)', udid: 'W' }],
  };
  const run = (devices: any) => execFileSync('bash', [script('watch-pair.sh'), 'W'], { env: { ...process.env, DRY_RUN: '1', SIMCTL_LIST_JSON: list(devices) }, encoding: 'utf8' }).trim().split('\n');
  test('kandydaci: tylko iPhone\'y, od najnowszego iOS (nie iPad, nie zegarek)', () => { expect(run(D)).toEqual(['P-264', 'P-262', 'P-185']); });
  test('brak iPhone\'a: błąd', () => { expect(() => run({ 'com.apple.CoreSimulator.SimRuntime.watchOS-26-4': D['com.apple.CoreSimulator.SimRuntime.watchOS-26-4'] })).toThrow(); });
  test('workflow dalej uruchamia zrzuty tym samym skryptem (para jest w nim, nie w osobnym kroku)', () => {
    expect(fs.readFileSync(path.join(root, '.github/workflows/watch-sim.yml'), 'utf8')).toContain('watch-screenshots.sh');
  });
});
