// Warstwa D planu testów (09): kontrola konfiguracji natywnej po `expo prebuild` (bez Maca).
// Sprawdza: entitlements (tylko HealthKit), lokalizacje InfoPlist.strings, linkowanie modułu RestActivity,
// cel widżetu i kolor akcentu, brak UIBackgroundModes, NSSupportsLiveActivities = true, UIFileSharingEnabled i LSSupportsOpeningDocumentsInPlace (kopie w Plikach, runda 75), identyczny RestTimerAttributes.swift
// w module i widżecie (rundy 63–64). Kod wyjścia 1 = błąd.
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
  const auto = execSync('npx expo-modules-autolinking resolve -p apple --json', { cwd: root }).toString();
  ok(/"podName":"RestActivity"/.test(auto.replace(/\s/g, '')), 'autolinking: moduł RestActivity nie jest linkowany (Live Activity byłoby martwe)');
} finally { rmSync(root + 'ios', { recursive: true, force: true }); }
console.log(errs.length ? 'BŁĘDY natywne:\n' + errs.map(e => '  ' + e).join('\n') : 'natywne: OK');
process.exit(errs.length ? 1 : 0);
