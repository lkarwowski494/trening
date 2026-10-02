/* Konfiguracja Jest tylko dla testów mutacyjnych (Stryker) na lib/units.ts, lib/stats.ts i logice lib/store.ts: pliki logiki obliczeń bez renderowania
 * ekranów i z mniejszą liczbą losowań właściwości — pełny zestaw trwał ~40 s na mutanta. Zwykłe `npm test` używa package.json. */
process.env.INV_RUNS = process.env.INV_RUNS || '20';
const base = require('./package.json').jest;
module.exports = { ...base, rootDir: __dirname, testMatch: ['<rootDir>/tests/(units|stats|logic|invariants|audit-training|audit-final-stats|audit-r72-d|audit-close-a|audit-close-d|audit-final2-auto|audit-persist|audit-perf-equiv|migrate-idem|roundtrip|audit-r72-b|audit-r72-a|audit-r72-c|audit-records-logic|audit-final-ss|store-stale|store-rest|store-toggle|store-hint).test.ts'] };
