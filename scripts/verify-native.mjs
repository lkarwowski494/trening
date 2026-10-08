// Warstwa D planu testów (09): kontrola konfiguracji natywnej po `expo prebuild` (bez Maca).
// Sprawdza: entitlements (tylko HealthKit), lokalizacje InfoPlist.strings, linkowanie modułu RestActivity,
// cel widżetu i kolor akcentu, brak UIBackgroundModes, NSSupportsLiveActivities = true, UIFileSharingEnabled i LSSupportsOpeningDocumentsInPlace (kopie w Plikach, runda 75), identyczny RestTimerAttributes.swift
// w module i widżecie (rundy 63–64); audyt NAT-05 (08.10.2026): MARKETING_VERSION = app.json, iPhone, cele ≤ aplikacja, tylko opisy HealthKit,
// ikona 1024, InfoPlist.strings we wszystkich językach; NAT-07: bez ExtensionStorage, ekran startowy z wariantem ciemnym. Kod wyjścia 1 = błąd.
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
  { const keys = [...ent.matchAll(/<key>([^<]+)<\/key>/g)].map(m => m[1]); ok(keys.length === 1 && keys[0] === 'com.apple.developer.healthkit', 'entitlements: tylko HealthKit, są: ' + keys.join(', ')); } /* runda 63: dokładny zbiór kluczy */
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
  const auto = execSync('npx expo-modules-autolinking resolve -p apple --json', { cwd: root }).toString();
  ok(/"podName":"RestActivity"/.test(auto.replace(/\s/g, '')), 'autolinking: moduł RestActivity nie jest linkowany (Live Activity byłoby martwe)');
  /* audyt 0.10 NAT-07: martwy moduł ExtensionStorage (@bacons/apple-targets, App Group widżetu wycofanego 07.10) poza aplikacją; ekran startowy z wariantem ciemnym */
  ok(!/"podName":"ExtensionStorage"/.test(auto.replace(/\s/g, '')), 'autolinking: ExtensionStorage linkowany do aplikacji (package.json expo.autolinking.exclude)');
  const splashDir = root + 'ios/Trening/Images.xcassets/'; const splash = readdirSync(splashDir).filter(d => /^Splash.*\.colorset$/.test(d)).map(d => readFileSync(splashDir + d + '/Contents.json', 'utf8')).join('\n');
  ok(/"value"\s*:\s*"dark"/.test(splash), 'ekran startowy: brak koloru tła dla trybu ciemnego (expo-splash-screen „dark”)');
} finally { rmSync(root + 'ios', { recursive: true, force: true }); }
console.log(errs.length ? 'BŁĘDY natywne:\n' + errs.map(e => '  ' + e).join('\n') : 'natywne: OK');
process.exit(errs.length ? 1 : 0);
