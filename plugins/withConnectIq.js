// Zegarek z aplikacją Connect IQ (0.20): ustawienia iOS wymagane przez Connect IQ Mobile SDK i moduł modules/ciq-link.
//  - Info.plist: schemat URL powrotu z aplikacji pomocniczej zegarka, LSApplicationQueriesSchemes (sprawdzenie, czy aplikacja pomocnicza jest zainstalowana),
//    UIBackgroundModes = bluetooth-central (iOS budzi aplikację w tle, gdy zegarek wysyła zdarzenie), NSBluetoothAlwaysUsageDescription (zgoda; opisy w 35 językach: locales/*.json),
//  - Podfile: pod ConnectIQ z lokalnego podspec (binarny SDK producenta pobierany przy `pod install`, nie leży w repozytorium — licencja).
// Stałe muszą zgadzać się z lib/watch/ciqWire.ts (CIQ_URL_SCHEME) — pilnuje tests/ciq-native.test.ts.
const { withInfoPlist, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const URL_SCHEME = 'trening-ciq';
const COMPANION_SCHEME = 'gcm-ciq';
const POD_LINE = "  pod 'ConnectIQ', :podspec => '../modules/ciq-link/ConnectIQ.podspec'";

const union = (a, b) => [...new Set([...(a || []), ...b])];

/** Czysta funkcja: dopisuje wpisy do Info.plist (idempotentnie). */
function applyInfoPlist(plist) {
  plist.LSApplicationQueriesSchemes = union(plist.LSApplicationQueriesSchemes, [COMPANION_SCHEME]);
  plist.UIBackgroundModes = union(plist.UIBackgroundModes, ['bluetooth-central']);
  const types = plist.CFBundleURLTypes || [];
  if (!types.some(t => (t.CFBundleURLSchemes || []).includes(URL_SCHEME))) types.push({ CFBundleURLName: 'ciq-return', CFBundleURLSchemes: [URL_SCHEME] });
  plist.CFBundleURLTypes = types;
  return plist;
}

/** Czysta funkcja: dopisuje pod ConnectIQ do Podfile po `use_expo_modules!` (idempotentnie). */
function applyPodfile(text) {
  if (text.includes("pod 'ConnectIQ'")) return text;
  if (!/use_expo_modules!/.test(text)) throw new Error('withConnectIq: w Podfile nie ma use_expo_modules! — nie wiem, gdzie dopisać pod ConnectIQ');
  return text.replace(/^(\s*use_expo_modules!.*)$/m, `$1\n${POD_LINE}`);
}

module.exports = function withConnectIq(config) {
  config = withInfoPlist(config, cfg => { applyInfoPlist(cfg.modResults); return cfg; });
  return withDangerousMod(config, ['ios', async cfg => {
    const file = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
    fs.writeFileSync(file, applyPodfile(fs.readFileSync(file, 'utf8')));
    return cfg;
  }]);
};
module.exports.applyInfoPlist = applyInfoPlist;
module.exports.applyPodfile = applyPodfile;
module.exports.URL_SCHEME = URL_SCHEME;
