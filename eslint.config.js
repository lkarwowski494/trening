// M1-audytor-generalny-051: lint jako część `npm run verify` (L-008). Konfiguracja Expo (flat config).
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'audit/**', /* katalogi przebiegów ról (poza gitem, .git/info/exclude) — M5, 21.10.2026 */
      'node_modules/**', '.claude/**', '.expo/**', 'dist/**', 'ios/**', 'android/**', 'coverage/**', '.stryker-tmp/**',
      'site/**', 'store/**', 'scripts/**', 'tests/**', 'watch-fixtures/**', 'targets/**', 'modules/**',
    ],
  },
  {
    // Pliki konfiguracyjne CommonJS uruchamiane w Node.
    files: ['*.config.js'],
    languageOptions: { globals: { __dirname: 'readonly', module: 'writable', require: 'readonly' } },
  },
  {
    // 28.10.2026 (telefon, build 1032): Text z React Native bez limitu Dynamic Type rośnie do 357% i jest ucinany — Text tylko z components/AppText (domyślny limit 200%).
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
    ignores: ['components/AppText.tsx'],
    rules: { 'no-restricted-imports': ['error', { paths: [{ name: 'react-native', importNames: ['Text'], message: "Importuj Text z '@/components/AppText' (domyślny limit powiększenia tekstu)." }] }] },
  },
  {
    // Reguły „React Compiler” z react-hooks 7 (stan na 20.10.2026: 109 trafień w istniejącym kodzie). Dotyczą wzorców,
    // które działają poprawnie (testy, E2E), a ich naprawa to przepisanie logiki ekranów — poza zakresem zadania 051.
    // Powód wyłączenia i lista: docs/40-lekcje.md (L-008). Zdjąć po przeglądzie ekranów (osobne zadanie, backlog).
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
];
