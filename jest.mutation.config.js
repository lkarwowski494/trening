/* Konfiguracja Jest tylko dla testów mutacyjnych (Stryker, stryker.config.json — moduły logiki lib/: units, stats, plan, generator, deload,
 * deload-sets, planReminder, period, dashboard, timer, whatsnew, backup). Audyt 0.10 (M2, TST-02/13): wszystkie pliki testów LOGIKI (tests/*.test.ts,
 * bez renderowania ekranów) poza wolnymi zestawami losowymi i porównawczymi (każdy > 30 s — przy każdym mutancie zabiłyby czas przebiegu;
 * ich logikę sprawdzają zwykłe `npm test` i nocne losowe sekwencje) i plikami bez związku z lib/ (repozytorium, słowniki, selektory Maestro).
 * Mniej losowań właściwości (INV_RUNS, MATRIX_RUNS). Zwykłe `npm test` używa package.json. */
process.env.INV_RUNS = process.env.INV_RUNS || '20';
process.env.MATRIX_RUNS = process.env.MATRIX_RUNS || '10';
const base = require('./package.json').jest;
const SLOW_OR_UNRELATED = ['audit-r72-c', 'migrate-idem', 'invariants', 'matrix-data-fuzz', 'audit-r72-a', 'maestro-failures', 'maestro-selectors', 'public-repo', 'i18n-locales', 'widget-i18n'];
/* M1-audytor-generalny-055: testy uruchamiające procesy potomne (skrypty `--check` generatorów, node z child_process) nie działają w kopii projektu
 * Strykera — suche przejście padało i nocne mutacje nie wykonywały się wcale. Wykrywane automatycznie po treści (strażnik: tests/mutation-config.test.ts). */
const fs = require('fs'); const path = require('path');
const SPAWNING = fs.readdirSync(path.join(__dirname, 'tests')).filter(f => f.endsWith('.test.ts')
  && /child_process|execFileSync|execSync|spawnSync|--check/.test(fs.readFileSync(path.join(__dirname, 'tests', f), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''))).map(f => f.replace(/\.test\.ts$/, ''));
/* MUT_TESTS=plan-calendar,generator — przebieg lokalny tylko na wskazanych plikach (szybciej, gdy mutujemy jeden moduł) */
const only = process.env.MUT_TESTS ? process.env.MUT_TESTS.split(',').map(n => `<rootDir>/tests/${n.trim()}.test.ts`) : null;
module.exports = { ...base, testTimeout: 30000 /* nocne 25.10.2026: zimny render ekranu w kopii Strykera przekraczał domyślne 5 s (tests/catalog-v2) */, workerIdleMemoryLimit: undefined /* inaczej Jest uruchamia testy w procesach potomnych także przy runInBand — pokrycie per test nie wraca do Strykera */, rootDir: __dirname, testMatch: only ?? ['<rootDir>/tests/*.test.ts'], testPathIgnorePatterns: ['/node_modules/', ...[...SLOW_OR_UNRELATED, ...SPAWNING].map(n => `/tests/${n}\\.test\\.ts$`)] };
