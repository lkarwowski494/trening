/* R-007 (docs/40, WYD-09): manifest prywatności deklarowany w app.json (`ios.privacyManifests`), nie łatany w CI.
   Powody według Apple, „Describing use of required reason API” (przeczytane 21.10.2026):
   - FileTimestamp C617.1 — metadane plików w kontenerze aplikacji (kopie, baza, kopie wybrane z pliku skopiowane do Caches);
     3B52.1 (pliki udostępnione przez użytkownika) nie dotyczy kodu aplikacji: wybrany plik jest najpierw kopiowany do Caches (copyToCacheDirectory).
   - UserDefaults CA92.1 — dane tylko tej aplikacji; SystemBootTime 35F9.1 — pomiar czasu między zdarzeniami (liczniki, przerwy);
   - DiskSpace E174.1 + 85F4.1 — jak w manifeście ExpoFileSystem, który jest prekompilowany i nie trafia do agregacji CocoaPods. */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { spawnSync } from 'child_process';

const root = join(__dirname, '..');
const app = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8')).expo;
const pm = app.ios.privacyManifests;

const OCZEKIWANE: Record<string, string[]> = {
  NSPrivacyAccessedAPICategoryFileTimestamp: ['C617.1'],
  NSPrivacyAccessedAPICategoryUserDefaults: ['CA92.1'],
  NSPrivacyAccessedAPICategorySystemBootTime: ['35F9.1'],
  NSPrivacyAccessedAPICategoryDiskSpace: ['E174.1', '85F4.1'],
};
/* kody z dokumentacji Apple (lista zamknięta, zgodna z kategorią) */
const KODY_APPLE: Record<string, string[]> = {
  NSPrivacyAccessedAPICategoryFileTimestamp: ['DDA9.1', 'C617.1', '3B52.1', '0A2A.1'],
  NSPrivacyAccessedAPICategoryUserDefaults: ['CA92.1', '1C8F.1', 'C56D.1', 'AC6B.1'],
  NSPrivacyAccessedAPICategorySystemBootTime: ['35F9.1', '8FFB.1', '3D61.1'],
  NSPrivacyAccessedAPICategoryDiskSpace: ['85F4.1', 'E174.1', '7D9E.1', 'B728.1'],
};

describe('app.json → ios.privacyManifests (R-007)', () => {
  test('istnieje i nie śledzi użytkownika', () => {
    expect(pm).toBeDefined();
    expect(pm.NSPrivacyTracking).toBe(false);
    expect(pm.NSPrivacyTrackingDomains ?? []).toEqual([]);
  });
  test('NSPrivacyCollectedDataTypes jest pusty (etykieta „Data Not Collected”)', () => {
    expect(pm.NSPrivacyCollectedDataTypes).toEqual([]);
  });
  test('komplet czterech kategorii z oczekiwanymi powodami, bez duplikatów i dodatków', () => {
    const typy: { NSPrivacyAccessedAPIType: string; NSPrivacyAccessedAPITypeReasons: string[] }[] = pm.NSPrivacyAccessedAPITypes;
    expect(typy.map(t => t.NSPrivacyAccessedAPIType).sort()).toEqual(Object.keys(OCZEKIWANE).sort());
    for (const t of typy) expect([...t.NSPrivacyAccessedAPITypeReasons].sort()).toEqual([...OCZEKIWANE[t.NSPrivacyAccessedAPIType]].sort());
  });
  test.each(Object.keys(KODY_APPLE))('%s: każdy powód jest kodem z listy Apple dla tej kategorii', kat => {
    const t = pm.NSPrivacyAccessedAPITypes.find((x: any) => x.NSPrivacyAccessedAPIType === kat);
    for (const r of t.NSPrivacyAccessedAPITypeReasons) expect(KODY_APPLE[kat]).toContain(r);
  });
  test('powód 3B52.1 nie jest deklarowany przez aplikację (pliki z selektora są kopiowane do Caches)', () => {
    expect(JSON.stringify(pm)).not.toContain('3B52.1');
    expect(readFileSync(join(root, 'lib/csvimport.ts'), 'utf8')).toContain('copyToCacheDirectory: true');
    expect(readFileSync(join(root, 'lib/backup.ts'), 'utf8')).toContain('copyToCacheDirectory: true');
  });
});

describe('strażnik CI czyta kategorie z app.json (jedno miejsce)', () => {
  test('--check przepuszcza plik z kompletem z app.json i odrzuca bez DiskSpace', () => {
    const wpis = (k: string, r: string[]) => `<dict><key>NSPrivacyAccessedAPIType</key><string>${k}</string><key>NSPrivacyAccessedAPITypeReasons</key><array>${r.map(x => `<string>${x}</string>`).join('')}</array></dict>`;
    const plist = (ks: string[]) => `<?xml version="1.0"?><plist version="1.0"><dict><key>NSPrivacyAccessedAPITypes</key><array>${ks.map(k => wpis(k, OCZEKIWANE[k])).join('')}</array></dict></plist>`;
    const d = mkdtempSync(join(tmpdir(), 'pm-'));
    try {
      const pelny = join(d, 'a.xcprivacy'); writeFileSync(pelny, plist(Object.keys(OCZEKIWANE)));
      const brak = join(d, 'b.xcprivacy'); writeFileSync(brak, plist(Object.keys(OCZEKIWANE).slice(0, 3)));
      const run = (f: string) => spawnSync('node', [join(root, 'scripts/ci/ensure-privacy-manifest.mjs'), '--check', f], { encoding: 'utf8' });
      expect(run(pelny).status).toBe(0);
      expect(run(brak).status).toBe(1);
    } finally { rmSync(d, { recursive: true, force: true }); }
  });
});

describe('workflowy dowodzą manifest w zbudowanym pakiecie (L-001)', () => {
  const unsigned = readFileSync(join(root, '.github/workflows/ios-unsigned.yml'), 'utf8');
  const tf = readFileSync(join(root, '.github/workflows/testflight.yml'), 'utf8');
  test('ios-unsigned: sprawdza manifest w katalogu projektu po pod install i w gotowym Trening.app', () => {
    const krok = unsigned.slice(unsigned.indexOf('- name: Manifest prywatności w projekcie'), unsigned.indexOf('- name: Platforma iOS zgodna'));
    expect(krok).toContain('ios/*/PrivacyInfo.xcprivacy');
    expect(krok).toContain('ensure-privacy-manifest.mjs --check');
    expect(unsigned).toMatch(/ensure-privacy-manifest\.mjs --check[^\n]*\$APP\/PrivacyInfo\.xcprivacy/);
    expect(unsigned.indexOf('ensure-privacy-manifest.mjs --check')).toBeGreaterThan(unsigned.indexOf('pod install'));
  });
  test('testflight: po pod install tylko sprawdza (łatka --fix nie maskuje braku deklaracji w app.json)', () => {
    const krok = tf.slice(tf.indexOf('- name: Manifest prywatności'), tf.indexOf('- name: Platforma iOS zgodna'));
    expect(krok).toContain('ensure-privacy-manifest.mjs --check');
    expect(krok).not.toContain('--fix');
  });
});
