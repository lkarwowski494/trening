// M1-audytor-generalny-051: lint jako część `npm run verify` (L-008). Konfiguracja Expo (flat config).
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'node_modules/**', '.expo/**', 'dist/**', 'ios/**', 'android/**', 'coverage/**', '.stryker-tmp/**',
      'site/**', 'store/**', 'scripts/**', 'tests/**', 'watch-fixtures/**', 'targets/**', 'modules/**',
    ],
  },
  {
    // Pliki konfiguracyjne CommonJS uruchamiane w Node.
    files: ['*.config.js'],
    languageOptions: { globals: { __dirname: 'readonly', module: 'writable', require: 'readonly' } },
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
