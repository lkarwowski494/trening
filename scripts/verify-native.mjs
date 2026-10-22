// Warstwa D planu testów (09): kontrola konfiguracji natywnej po `expo prebuild` (bez Maca).
// Sprawdza: entitlements (dokładnie lista scripts/ci/required-entitlements-app.txt: HealthKit + time-sensitive), lokalizacje InfoPlist.strings, linkowanie modułu RestActivity,
// cel widżetu i kolor akcentu, brak UIBackgroundModes, NSSupportsLiveActivities = true, UIFileSharingEnabled i LSSupportsOpeningDocumentsInPlace (kopie w Plikach, runda 75), identyczny RestTimerAttributes.swift
// w module i widżecie (rundy 63–64); audyt NAT-05 (08.10.2026): MARKETING_VERSION = app.json, iPhone, cele ≤ aplikacja, tylko opisy HealthKit,
// ikona 1024, InfoPlist.strings we wszystkich językach; NAT-07: bez ExtensionStorage, ekran startowy z wariantem ciemnym.
// 0.20 (Apple Watch, docs/35-zegarek-apple): cel TreningWatch (minimum watchOS 10, towarzysz pl.lukasz.trening, HealthKit, tryb tła treningu, manifest prywatności,
// opisy zgód w 35 językach), moduł WatchLink w autolinkingu, cel testów interfejsu dokładany skryptem scripts/ci/add-watch-ui-tests.mjs. Kod wyjścia 1 = błąd.
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync, rmSync } from 'node:fs';
const root = fileURLToPath(new URL('..', import.meta.url)); /* runda 59: ścieżki ze spacją/ł i Windows */ const errs = [];
const ok = (c, m) => { if (!c) errs.push(m); };
try { execSync('npx expo prebuild --platform ios --no-install --clean', { cwd: root, stdio: 'pipe', env: { ...process.env, CI: '1' } }); } catch (e) { console.error(String(e.stderr || e.stdout || e)); process.exit(1); } // runda 59: błąd prebuild widoczny w logu
try {
  const ent = readFileSync(root + 'ios/Trening/Trening.entitlements', 'utf8');
  ok(ent.includes('com.apple.developer.healthkit'), 'entitlements: brak HealthKit');
  ok(!ent.includes('aps-environment'), 'entitlements: aps-environment (Push) — darmowe Apple ID tego nie podpisze');
  { const want = readFileSync(root + 'scripts/ci/required-entitlements-app.txt', 'utf8').split('\n').map(l => l.replace(/#.*/, '').trim()).filter(Boolean).sort();
    const keys = [...ent.matchAll(/<key>([^<]+)<\/key>/g)].map(m => m[1]).sort(); ok(JSON.stringify(keys) === JSON.stringify(want), `entitlements: dokładnie ${want.join(', ')}, są: ` + keys.join(', ')); } /* runda 63: dokładny zbiór kluczy; 19.10.2026: + time-sensitive, lista w jednym miejscu (strażnik testflight.yml) */
  for (const l of ['pl', 'en']) { const p = root + `ios/Trening/Supporting/${l}.lproj/InfoPlist.strings`; ok(existsSync(p) && /NSHealthUpdateUsageDescription = "[^"]{10,}"/.test(readFileSync(p, 'utf8')) && /NSHealthShareUsageDescription = "[^"]{10,}"/.test(readFileSync(p, 'utf8')), `InfoPlist.strings ${l}: brak lub zły format`); }
  const plist = readFileSync(root + 'ios/Trening/Info.plist', 'utf8');
  ok(!plist.includes('UIBackgroundModes'), 'Info.plist: UIBackgroundModes (nieużywany tryb w tle)');
  ok(/<key>NSSupportsLiveActivities<\/key>\s*<true\/>/.test(plist), 'Info.plist: NSSupportsLiveActivities ≠ true'); /* runda 64: wartość, nie sam klucz */
  for (const k of ['UIFileSharingEnabled', 'LSSupportsOpeningDocumentsInPlace']) ok(new RegExp(`<key>${k}</key>\\s*<true/>`).test(plist), `Info.plist: ${k} ≠ true (automatyczne kopie w Plikach, runda 75)`);
  ok(readFileSync(root + 'modules/rest-activity/ios/RestTimerAttributes.swift', 'utf8') === readFileSync(root + 'targets/rest-widget/RestTimerAttributes.swift', 'utf8'), 'RestTimerAttributes.swift: moduł i widżet różnią się (Live Activity bez danych)');
  const pbx = readFileSync(root + 'ios/Trening.xcodeproj/project.pbxproj', 'utf8');
  ok(pbx.includes('RestWidget'), 'projekt: brak celu widżetu RestWidget');
  const color = JSON.parse(readFileSync(root + 'targets/rest-widget/Assets.xcassets/$accent.colorset/Contents.json', 'utf8'));
  ok(color.colors.length > 0, 'widżet: pusty kolor akcentu');
  /* audyt 08.10.2026 (NAT-05): wersje i cele, ikona, dokładny zbiór opisów uprawnień, InfoPlist.strings we wszystkich językach */
  const app = JSON.parse(readFileSync(root + 'app.json', 'utf8')).expo;
  const mv = [...new Set([...pbx.matchAll(/MARKETING_VERSION = "?([^";]+)"?;/g)].map(m => m[1]))];
  ok(mv.length === 1 && mv[0] === app.version, `projekt: MARKETING_VERSION ${mv.join(', ')} ≠ app.json ${app.version} (aplikacja i widżet jedna wersja)`);
  { const pkg = JSON.parse(readFileSync(root + 'package.json', 'utf8')).version; ok(pkg === app.version, `wersja: package.json ${pkg} ≠ app.json ${app.version}`); }
  const fam = [...new Set([...pbx.matchAll(/TARGETED_DEVICE_FAMILY = "?([^";]+)"?;/g)].map(m => m[1]))];
  ok(fam.includes('1'), 'projekt: brak TARGETED_DEVICE_FAMILY = 1 (iPhone)'); ok(app.ios.supportsTablet !== true, 'app.json: supportsTablet — aplikacja tylko na iPhone');
  const dt = [...pbx.matchAll(/IPHONEOS_DEPLOYMENT_TARGET = ([0-9.]+);/g)].map(m => m[1]).map(v => v.split('.').map(Number));
  const cmp = (x, y) => (x[0] - y[0]) || ((x[1] || 0) - (y[1] || 0)); const appDt = (app.ios.deploymentTarget || '16.4').split('.').map(Number);
  ok(dt.length > 0 && dt.every(v => cmp(v, appDt) <= 0), 'projekt: cel z IPHONEOS_DEPLOYMENT_TARGET wyższym niż aplikacja');
  const usage = [...plist.matchAll(/<key>(NS[A-Za-z]+UsageDescription)<\/key>/g)].map(m => m[1]).sort();
  ok(JSON.stringify(usage) === JSON.stringify(['NSHealthShareUsageDescription', 'NSHealthUpdateUsageDescription']), 'Info.plist: opisy uprawnień inne niż HealthKit: ' + usage.join(', '));
  const iconDir = root + 'ios/Trening/Images.xcassets/AppIcon.appiconset/';
  ok(existsSync(iconDir + 'Contents.json') && /1024x1024|"size"\s*:\s*"1024/.test(readFileSync(iconDir + 'Contents.json', 'utf8')), 'ikona: brak AppIcon 1024×1024');
  const { readdirSync } = await import('node:fs');
  const lproj = readdirSync(root + 'ios/Trening/Supporting').filter(d => d.endsWith('.lproj'));
  const langs = readdirSync(root + 'lib/locales').filter(f => /^[a-z]{2}\.json$/.test(f)).length + 2; /* + pl, en */
  ok(lproj.length >= langs, `InfoPlist.strings: ${lproj.length} języków, oczekiwano ${langs}`);
  for (const d of lproj) { const t = readFileSync(root + `ios/Trening/Supporting/${d}/InfoPlist.strings`, 'utf8'); ok(/NSHealthUpdateUsageDescription = "[^"]{10,}"/.test(t) && /NSHealthShareUsageDescription = "[^"]{10,}"/.test(t), `InfoPlist.strings ${d}: brak lub zły format`); }
  /* 0.16.0 (odczyt z Apple Health, docs/29 rozdz. 8 i 15 pkt 9): aplikacja czyta Zdrowie, więc żaden język nie może zostać przy opisie sprzed 0.16 („nie odczytuje danych zdrowotnych”,
   * zapis bez wzmianki o usuwaniu kopii) — teksty sprzed zmiany: tests/fixtures/health-usage-pre016.json; polski i angielski dodatkowo bez zdania „nie odczytuje” / „does not read” */
  { const stale = JSON.parse(readFileSync(root + 'tests/fixtures/health-usage-pre016.json', 'utf8')); const val = (t, k) => (t.match(new RegExp(`${k} = "((?:[^"\\\\]|\\\\.)*)"`)) || [])[1]?.replace(/\\(.)/g, '$1');
    for (const d of lproj) { const code = d.replace(/\.lproj$/, ''); const t = readFileSync(root + `ios/Trening/Supporting/${d}/InfoPlist.strings`, 'utf8'); const sh = val(t, 'NSHealthShareUsageDescription'), up = val(t, 'NSHealthUpdateUsageDescription');
      ok(!stale[code] || (sh !== stale[code].share && up !== stale[code].update), `InfoPlist.strings ${d}: opis uprawnienia HealthKit sprzed 0.16 (aplikacja czyta Zdrowie — zaktualizuj tłumaczenie w locales/${code}.json)`);
      if (code === 'pl' || code === 'en') ok(!/nie odczytuje|does not read|doesn't read/i.test(sh ?? '') && /kroki|steps/i.test(sh ?? ''), `InfoPlist.strings ${d}: opis odczytu Zdrowia nieaktualny`); } }
  const auto = execSync('npx expo-modules-autolinking resolve -p apple --json', { cwd: root }).toString();
  ok(/"podName":"RestActivity"/.test(auto.replace(/\s/g, '')), 'autolinking: moduł RestActivity nie jest linkowany (Live Activity byłoby martwe)');
  /* 0.20 (docs/36): moduł głosu VoiceCue linkowany do aplikacji; etap 1 bez trybu audio w tle (UIBackgroundModes sprawdzone wyżej) */
  ok(/"podName":"VoiceCue"/.test(auto.replace(/\s/g, '')), 'autolinking: moduł VoiceCue nie jest linkowany (zapowiedzi głosowe byłyby martwe)');
  /* audyt 0.10 NAT-07: martwy moduł ExtensionStorage (@bacons/apple-targets, App Group widżetu wycofanego 07.10) poza aplikacją; ekran startowy z wariantem ciemnym */
  ok(!/"podName":"ExtensionStorage"/.test(auto.replace(/\s/g, '')), 'autolinking: ExtensionStorage linkowany do aplikacji (package.json expo.autolinking.exclude)');
  const splashDir = root + 'ios/Trening/Images.xcassets/'; const splash = readdirSync(splashDir).filter(d => /^Splash.*\.colorset$/.test(d)).map(d => readFileSync(splashDir + d + '/Contents.json', 'utf8')).join('\n');
  ok(/"value"\s*:\s*"dark"/.test(splash), 'ekran startowy: brak koloru tła dla trybu ciemnego (expo-splash-screen „dark”)');
  /* 0.20 (Apple Watch): cel watchOS i jego konfiguracja */
  { const bs = (name) => { const m = pbx.match(new RegExp(`/\\* ${name} \\*/ = \\{\\s*isa = PBXNativeTarget;[\\s\\S]*?buildConfigurationList = (\\w+)`)); return m ? m[1] : null; };
    ok(bs('TreningWatch') !== null, 'projekt: brak celu TreningWatch (targets/watch-app)');
    const wsettings = [...pbx.matchAll(/buildSettings = \{([^}]*?SDKROOT = watchos;[^}]*?)\};/gs)].map(m => m[1]); ok(wsettings.length >= 2, 'projekt: cel zegarka bez konfiguracji Debug i Release (SDKROOT = watchos)');
    for (const w of wsettings) { ok(/PRODUCT_BUNDLE_IDENTIFIER = pl\.lukasz\.trening\.watchkitapp;/.test(w), 'zegarek: identyfikator pakietu ≠ pl.lukasz.trening.watchkitapp'); ok(/INFOPLIST_KEY_WKCompanionAppBundleIdentifier = pl\.lukasz\.trening;/.test(w), 'zegarek: aplikacja towarzysząca ≠ pl.lukasz.trening'); ok(/WATCHOS_DEPLOYMENT_TARGET = 10\.0;/.test(w), 'zegarek: minimum watchOS ≠ 10.0 (decyzja 14.10.2026; podwójne stuknięcie, watchOS 11, tylko w #available — tests/watch-availability.test.ts)'); ok(/TARGETED_DEVICE_FAMILY = 4;/.test(w), 'zegarek: TARGETED_DEVICE_FAMILY ≠ 4'); ok(/CODE_SIGN_ENTITLEMENTS = \.targets\/TreningWatch\/generated\.entitlements;/.test(w), 'zegarek: brak pliku uprawnień (HealthKit)'); ok(new RegExp(`MARKETING_VERSION = ${app.version.replace(/\./g, '\\.')};`).test(w), 'zegarek: MARKETING_VERSION ≠ wersja aplikacji'); }
    ok(/Embed Watch Content/.test(pbx), 'projekt: aplikacja nie osadza zegarka (Embed Watch Content)');
    const went = readFileSync(root + 'ios/.targets/TreningWatch/generated.entitlements', 'utf8'); const wkeys = [...went.matchAll(/<key>([^<]+)<\/key>/g)].map(m => m[1]); ok(wkeys.length === 1 && wkeys[0] === 'com.apple.developer.healthkit', 'zegarek: uprawnienia inne niż HealthKit: ' + wkeys.join(', '));
    const wdir = root + 'targets/watch-app/'; const wplist = readFileSync(wdir + 'Info.plist', 'utf8');
    ok(/<key>WKApplication<\/key>\s*<true\/>/.test(wplist), 'zegarek Info.plist: WKApplication ≠ true'); ok(/<key>WKRunsIndependentlyOfCompanionApp<\/key>\s*<false\/>/.test(wplist), 'zegarek Info.plist: aplikacja ma być zależna od telefonu');
    ok(/<key>WKBackgroundModes<\/key>\s*<array>\s*<string>workout-processing<\/string>\s*<\/array>/.test(wplist), 'zegarek Info.plist: dokładnie jeden tryb tła — workout-processing (wibracja po opuszczeniu ręki)');
    ok(!/UIBackgroundModes/.test(wplist), 'zegarek Info.plist: UIBackgroundModes zamiast WKBackgroundModes');
    /* manifest prywatności zegarka dokłada jedyny producent: krok CocoaPods „Privacy Manifest Aggregation” (react-native/scripts/cocoapods/privacy_manifest_utils.rb) wpisuje PrivacyInfo.xcprivacy do KAŻDEGO celu typu aplikacja, także zegarka.
       Drugi egzemplarz w folderze celu (grupa zsynchronizowana kopiuje go jako zasób) = „Multiple commands produce TreningWatch.app/PrivacyInfo.xcprivacy” (0.20, przebieg 38486942752). */
    { const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(d + e.name + '/') : [d + e.name]);
      const wfiles = walk(wdir); ok(!wfiles.some(f => /\.xcprivacy$/.test(f)), 'zegarek: własny PrivacyInfo.xcprivacy w targets/watch-app dubluje manifest dokładany przez CocoaPods (Multiple commands produce)');
      /* R-007: jedyne źródło przed pod install to wtyczka Expo (ios.privacyManifests w app.json): jeden plik ios/Trening/PrivacyInfo.xcprivacy, jedno odwołanie, tylko w celu aplikacji
         (CocoaPods dołoży to samo odwołanie celowi zegarka — ten sam plik, nie drugi egzemplarz) */
      ok((pbx.match(/isa = PBXFileReference;[^\n]*PrivacyInfo\.xcprivacy/g) || []).length === 1, 'projekt: oczekiwano jednego odwołania do PrivacyInfo.xcprivacy (z app.json ios.privacyManifests)');
      const pi = root + 'ios/Trening/PrivacyInfo.xcprivacy'; ok(existsSync(pi), 'prebuild nie wygenerował ios/Trening/PrivacyInfo.xcprivacy (app.json ios.privacyManifests)');
      if (existsSync(pi)) { const x = readFileSync(pi, 'utf8'); for (const t of app.ios.privacyManifests.NSPrivacyAccessedAPITypes) { ok(x.includes(`<string>${t.NSPrivacyAccessedAPIType}</string>`), 'PrivacyInfo.xcprivacy: brak kategorii ' + t.NSPrivacyAccessedAPIType); for (const r of t.NSPrivacyAccessedAPITypeReasons) ok(x.includes(`<string>${r}</string>`), `PrivacyInfo.xcprivacy: brak powodu ${r} (${t.NSPrivacyAccessedAPIType})`); } ok(/<key>NSPrivacyTracking<\/key>\s*<false\/>/.test(x), 'PrivacyInfo.xcprivacy: NSPrivacyTracking ≠ false'); }
      const flat = wfiles.filter(f => !/\.(swift)$/.test(f) && !/\.lproj\//.test(f) && !/\.xcassets\//.test(f) && !/\/(Info\.plist|expo-target\.config\.js)$/.test(f)).map(f => f.split('/').pop()); ok(new Set(flat).size === flat.length, 'zegarek: zasoby o tej samej nazwie w folderze celu (Multiple commands produce): ' + flat.join(', ')); }
    const wl = readdirSync(wdir).filter(d => d.endsWith('.lproj')); const allLangs = app.ios.infoPlist.CFBundleLocalizations.length; ok(wl.length === allLangs, `zegarek: ${wl.length} języków InfoPlist.strings, oczekiwano ${allLangs}`);
    for (const d of wl) { const t = readFileSync(wdir + `${d}/InfoPlist.strings`, 'utf8'); ok(/"NSHealthShareUsageDescription" = "[^"]{20,}"/.test(t) && /"NSHealthUpdateUsageDescription" = "[^"]{20,}"/.test(t) && /"CFBundleDisplayName" = "[^"]+"/.test(t), `zegarek ${d}: brak nazwy albo opisów zgód HealthKit`); }
    ok(existsSync(wdir + 'Assets.xcassets/AppIcon.appiconset/App-Icon-1024x1024@1x.png'), 'zegarek: brak ikony 1024'); ok(JSON.parse(readFileSync(wdir + 'Assets.xcassets/$accent.colorset/Contents.json', 'utf8')).colors.length > 0, 'zegarek: pusty kolor akcentu');
    ok(/"podName":"WatchLink"/.test(auto.replace(/\s/g, '')), 'autolinking: moduł WatchLink nie jest linkowany (iPhone nie rozmawiałby z zegarkiem)');
    ok(!/UIBackgroundModes/.test(plist), 'Info.plist iPhone: UIBackgroundModes (WatchConnectivity nie wymaga trybu tła)');
    /* cel testów interfejsu (XCUITest) dokładany po prebuildzie — musi się zastosować do świeżego projektu i być idempotentny */
    try { const run = () => execSync('node scripts/ci/add-watch-ui-tests.mjs', { cwd: root, stdio: 'pipe' }).toString(); run(); run(); } catch (e) { errs.push('add-watch-ui-tests.mjs: ' + String(e.stderr || e.message).slice(0, 300)); }
    const pbx2 = readFileSync(root + 'ios/Trening.xcodeproj/project.pbxproj', 'utf8');
    ok((pbx2.match(/isa = PBXNativeTarget;[^}]*?productType = "com\.apple\.product-type\.bundle\.ui-testing";/gs) || []).length === 1, 'projekt po add-watch-ui-tests: oczekiwano dokładnie jednego celu testów interfejsu');
    ok(/TEST_TARGET_NAME = TreningWatch;/.test(pbx2) && /TestTargetID = /.test(pbx2), 'cel testów interfejsu nie wskazuje aplikacji zegarka');
    ok(existsSync(root + 'ios/Trening.xcodeproj/xcshareddata/xcschemes/TreningWatchUITests.xcscheme'), 'brak schematu TreningWatchUITests');
  }
} finally { rmSync(root + 'ios', { recursive: true, force: true }); }
console.log(errs.length ? 'BŁĘDY natywne:\n' + errs.map(e => '  ' + e).join('\n') : 'natywne: OK');
process.exit(errs.length ? 1 : 0);
