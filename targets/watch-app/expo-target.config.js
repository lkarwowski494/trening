/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'watch',
  name: 'TreningWatch',
  displayName: 'Trening', // język bazowy; <kod>.lproj/InfoPlist.strings generowane w tests/watch-i18n.test.ts (UPDATE_WATCH=1)
  bundleIdentifier: '.watchkitapp', // pl.lukasz.trening.watchkitapp
  deploymentTarget: '10.0', // minimum watchOS 10 (decyzja 14.10.2026); podwójne stuknięcie (handGestureShortcut, watchOS 11) tylko w #available — docs/35-zegarek-apple
  icon: '../../assets/icon.png', // 1024 px, wtyczka generuje Assets.xcassets/AppIcon.appiconset i ustawia ASSETCATALOG_COMPILER_APPICON_NAME (→ CFBundleIconName); bez pola App Store Connect odrzuca wysyłkę (build 1026, 22.10.2026; 1088 — opcja b ze STOP E3, docs/40 R-013)
  frameworks: ['SwiftUI', 'WatchConnectivity', 'HealthKit', 'WatchKit'],
  entitlements: { 'com.apple.developer.healthkit': true },
  colors: { $accent: { light: '#13294B', dark: '#F5F1E6' } }, // jak widżet: light.accent / dark.accent z lib/theme.ts (M3, STOP E3)
};
