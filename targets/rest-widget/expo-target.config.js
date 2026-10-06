/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'widget',
  name: 'RestWidget',
  displayName: 'Trening — Przerwa', // język bazowy; 16 języków: <kod>.lproj/InfoPlist.strings generowane w tests/widget-i18n.test.ts (06.10.2026)
  bundleIdentifier: '.restwidget',
  deploymentTarget: '16.2',
  frameworks: ['SwiftUI', 'WidgetKit', 'ActivityKit'],
  // Kształt: string albo { light, dark } (apple-targets 4.x) — wcześniejsze { color, darkColor } dawało pusty colorset.
  colors: { $accent: '#FF8A3D' }, // Kreda (docs/16)
};
