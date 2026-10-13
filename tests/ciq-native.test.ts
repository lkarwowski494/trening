/* Konfiguracja natywna zegarka z Connect IQ (0.20), sprawdzana bez Maca: wtyczka (Info.plist, Podfile), moduł modules/ciq-link (stałe zgodne z TypeScript, podspec,
 * brak SDK producenta w repozytorium), app.json i opisy zgody Bluetooth w 35 językach. Kompilacja Swift i `pod install` dzieją się w ios-unsigned.yml (macOS) — tu łapiemy rozjazdy
 * stałych i konfiguracji przed buildem. verify:native (prebuild) sprawdza wynik na wygenerowanym projekcie. */
import * as fs from 'fs';
import * as path from 'path';
import { CIQ_APP_UUID, CIQ_URL_SCHEME, CIQ_RESTORE_ID } from '@/lib/watch/ciqWire';
import { LANGS, APP_NAME } from '@/lib/i18n';

const root = path.join(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const plugin = require('../plugins/withConnectIq.js') as { applyInfoPlist: (p: Record<string, unknown>) => Record<string, unknown>; applyPodfile: (t: string) => string; URL_SCHEME: string };

describe('wtyczka withConnectIq: Info.plist', () => {
  test('dopisuje schemat powrotu, gcm-ciq i tryb bluetooth-central; zachowuje istniejące wpisy', () => {
    const p = plugin.applyInfoPlist({ CFBundleURLTypes: [{ CFBundleURLSchemes: ['trening'] }], LSApplicationQueriesSchemes: ['foo'], UIBackgroundModes: ['audio'] }) as Record<string, string[] & { CFBundleURLSchemes?: string[] }[]>;
    expect(p.LSApplicationQueriesSchemes).toEqual(['foo', 'gcm-ciq']); expect(p.UIBackgroundModes).toEqual(['audio', 'bluetooth-central']);
    expect((p.CFBundleURLTypes as unknown as { CFBundleURLSchemes: string[] }[]).map(t => t.CFBundleURLSchemes[0])).toEqual(['trening', CIQ_URL_SCHEME]);
  });
  test('na pustym Info.plist tworzy wpisy; wywołanie dwa razy nic nie dubluje (idempotencja)', () => {
    const a = plugin.applyInfoPlist({}); const b = plugin.applyInfoPlist(JSON.parse(JSON.stringify(a))); expect(b).toEqual(a);
    expect(a).toEqual({ LSApplicationQueriesSchemes: ['gcm-ciq'], UIBackgroundModes: ['bluetooth-central'], CFBundleURLTypes: [{ CFBundleURLName: 'ciq-return', CFBundleURLSchemes: [CIQ_URL_SCHEME] }] });
  });
  test('schemat URL wtyczki = CIQ_URL_SCHEME z TypeScript', () => { expect(plugin.URL_SCHEME).toBe(CIQ_URL_SCHEME); });
});

describe('wtyczka withConnectIq: Podfile', () => {
  const PODFILE = "platform :ios, '16.4'\ntarget 'Trening' do\n  use_expo_modules!\n  config = use_native_modules!\nend\n";
  test('dopisuje pod ConnectIQ z lokalnego podspec zaraz po use_expo_modules!, wewnątrz celu', () => {
    const out = plugin.applyPodfile(PODFILE); expect(out).toContain("  use_expo_modules!\n  pod 'ConnectIQ', :podspec => '../modules/ciq-link/ConnectIQ.podspec'\n  config =");
  });
  test('idempotencja; brak use_expo_modules! = czytelny błąd zamiast cichego pominięcia', () => {
    const once = plugin.applyPodfile(PODFILE); expect(plugin.applyPodfile(once)).toBe(once); expect(() => plugin.applyPodfile('target "x" do\nend\n')).toThrow(/use_expo_modules/);
  });
  test('ścieżka z Podfile wskazuje istniejący podspec', () => { expect(fs.existsSync(path.join(root, 'modules/ciq-link/ConnectIQ.podspec'))).toBe(true); });
});

describe('moduł natywny modules/ciq-link', () => {
  const bridge = read('modules/ciq-link/ios/CiqBridge.swift');
  test('stałe w Swift = stałe w TypeScript (UUID aplikacji, schemat URL, identyfikator odtwarzania)', () => {
    expect(bridge).toContain(`UUID(uuidString: "${CIQ_APP_UUID}")`); expect(bridge).toContain(`static let urlScheme = "${CIQ_URL_SCHEME}"`); expect(bridge).toContain(`static let restoreId = "${CIQ_RESTORE_ID}"`);
  });
  test('SDK startuje tylko dla sparowanego zegarka (żeby sam start aplikacji nie pytał o Bluetooth) i przy parowaniu', () => {
    expect(bridge).toMatch(/func startIfPaired\(\) \{\s*guard !loadStored\(\)\.isEmpty else \{ return \}/);
    expect(read('modules/ciq-link/ios/CiqLinkAppDelegateSubscriber.swift')).toContain('CiqBridge.shared.startIfPaired()'); expect(bridge).toMatch(/func showDeviceSelection\(\) \{\s*start\(\)/);
  });
  test('wiadomości z zegarka czekają w kolejce, gdy JS jeszcze nie słucha (obudzenie w tle); kolejka ma limit', () => {
    expect(bridge).toContain('pending.append'); expect(bridge).toContain('maxPending = 50'); expect(read('modules/ciq-link/ios/CiqLinkModule.swift')).toContain('OnStartObserving');
  });
  test('moduł eksponuje wszystkie funkcje używane przez index.ts i wszystkie zdarzenia', () => {
    const mod = read('modules/ciq-link/ios/CiqLinkModule.swift'); const idx = read('modules/ciq-link/index.ts');
    for (const f of ['isSupported', 'pair', 'showCompanionStore', 'forget', 'devices', 'showStore', 'send', 'openApp', 'appStatus']) { expect(mod).toMatch(new RegExp(`(Function|AsyncFunction)\\("${f}"\\)`)); expect(idx).toContain(`${f}(`); }
    expect(mod).toContain('Events("onMessage", "onDeviceStatus", "onDevices")'); expect(mod).toContain('Name("CiqLink")');
  });
  test('konfiguracja modułu: platforma apple, moduł i subskrybent AppDelegate, podspec', () => {
    expect(JSON.parse(read('modules/ciq-link/expo-module.config.json'))).toEqual({ platforms: ['apple'], apple: { modules: ['CiqLinkModule'], appDelegateSubscribers: ['CiqLinkAppDelegateSubscriber'], podspecPath: 'CiqLink.podspec' } });
    const spec = read('modules/ciq-link/CiqLink.podspec'); expect(spec).toContain("s.dependency 'ConnectIQ'"); expect(spec).toContain("s.dependency 'ExpoModulesCore'");
  });
  test('SDK producenta NIE leży w repozytorium (licencja zabrania hostowania); podspec pobiera go z repozytorium producenta w ustalonym tagu', () => {
    const all: string[] = []; const walk = (d: string) => { for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (!['node_modules', '.git', 'ios'].includes(e.name)) walk(p); } else all.push(p); } };
    walk('modules'); walk('garmin');
    expect(all.filter(f => /\.(xcframework|framework|a|dylib|prg|iq)$|xcframework\//.test(f))).toEqual([]);
    const cp = read('modules/ciq-link/ConnectIQ.podspec'); expect(cp).toMatch(/:tag => '\d+\.\d+\.\d+'/); expect(cp).toContain("s.vendored_frameworks = 'ConnectIQ.xcframework'"); expect(cp).toMatch(/s\.version\s+= '(\d+\.\d+\.\d+)'/);
    expect(cp.match(/s\.version\s+= '([\d.]+)'/)![1]).toBe(cp.match(/:tag => '([\d.]+)'/)![1]);
  });
  test('Swift nie używa nic spoza zakresu: żadnego dostępu do sieci ani śledzenia', () => {
    for (const f of ['CiqBridge', 'CiqLinkModule', 'CiqLinkAppDelegateSubscriber']) expect(read(`modules/ciq-link/ios/${f}.swift`)).not.toMatch(/URLSession|NSURLConnection|ASIdentifierManager|AppTrackingTransparency|WKWebView/);
  });
});

describe('app.json i opisy zgody', () => {
  const app = JSON.parse(read('app.json')).expo;
  test('wtyczka zarejestrowana; zgoda Bluetooth w Info.plist = polski opis z locales/pl.json; NSBluetoothPeripheral… niepotrzebne (iOS ≥ 13)', () => {
    expect(app.plugins).toContain('./plugins/withConnectIq'); expect(app.ios.infoPlist.NSBluetoothAlwaysUsageDescription).toBe(JSON.parse(read('locales/pl.json')).NSBluetoothAlwaysUsageDescription);
    expect(app.ios.infoPlist.NSBluetoothPeripheralUsageDescription).toBeUndefined();
  });
  test.each(LANGS)('%s: opis zgody Bluetooth ma nazwę aplikacji, ≥ 40 znaków, wspomina zegarek w języku (nie kopia angielskiego poza en)', l => {
    const t = JSON.parse(read(`locales/${l}.json`)).NSBluetoothAlwaysUsageDescription as string;
    expect(t.includes(APP_NAME[l])).toBe(true); expect([...t].length).toBeGreaterThanOrEqual(40); expect(t).not.toMatch(/[\u0000-\u001f]/);
    if (l !== 'en') expect(t).not.toBe(JSON.parse(read('locales/en.json')).NSBluetoothAlwaysUsageDescription);
    expect(t).not.toMatch(/\{A\}|\{app\}/);
  });
  test('opis nie obiecuje więcej, niż aplikacja robi: nie wspomina internetu, konta ani śledzenia', () => {
    for (const l of ['pl', 'en']) expect(JSON.parse(read(`locales/${l}.json`)).NSBluetoothAlwaysUsageDescription).not.toMatch(/internet|konto|account|śledz|track/i);
  });
});

test('verify-native sprawdza konfigurację zegarka (tryb tła, schematy, Podfile, język zgody, linkowanie)', () => {
  const v = read('scripts/verify-native.mjs');
  for (const s of ['bluetooth-central', 'gcm-ciq', 'trening-ciq', "pod 'ConnectIQ'", 'NSBluetoothAlwaysUsageDescription', '"podName":"CiqLink"']) expect([s, v.includes(s) || v.includes(s.replace(/"/g, '\\"')) || v.includes(s.replace("'", "\\'"))]).toEqual([s, true]);
});
