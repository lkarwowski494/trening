/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'watch',
  name: 'TreningWatch',
  displayName: 'Trening', // język bazowy; <kod>.lproj/InfoPlist.strings generowane w tests/watch-i18n.test.ts (UPDATE_WATCH=1)
  bundleIdentifier: '.watchkitapp', // pl.lukasz.trening.watchkitapp
  deploymentTarget: '10.0', // minimum watchOS 10 (decyzja 14.10.2026); podwójne stuknięcie (handGestureShortcut, watchOS 11) tylko w #available — docs/35-zegarek-apple
  icon: '../../assets/icon.png', // 1024 px, to samo co ikona aplikacji (plik generowany: Assets.xcassets/AppIcon.appiconset)
  frameworks: ['SwiftUI', 'WatchConnectivity', 'HealthKit', 'WatchKit'],
  entitlements: { 'com.apple.developer.healthkit': true },
  colors: { $accent: { light: '#1F5FD1', dark: '#6F9BF2' } }, // jak widżet: BRAND.signal / dark.accent z lib/theme.ts
};
