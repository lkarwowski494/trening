/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'widget',
  name: 'RestWidget',
  displayName: 'Trening — Przerwa', // język bazowy; 16 języków: <kod>.lproj/InfoPlist.strings generowane w tests/widget-i18n.test.ts (06.10.2026)
  bundleIdentifier: '.restwidget',
  deploymentTarget: '16.2',
  frameworks: ['SwiftUI', 'WidgetKit', 'ActivityKit'],
  // Kształt: string albo { light, dark } (apple-targets 4.x) — wcześniejsze { color, darkColor } dawało pusty colorset.
  entitlements: { 'com.apple.security.application-groups': ['group.pl.lukasz.trening'] }, // widżet „Tydzień treningów” czyta podsumowanie zapisane przez aplikację (lib/widget.ts WIDGET.group)
  colors: { $accent: { light: '#1F5FD1', dark: '#6F9BF2' } }, // Tuleja (07.10.2026): BRAND.signal / dark.accent z lib/theme.ts — test: tests/brand-tuleja.test.tsx
};
