/* Pomiar wydajności (npm run perf): duża historia, czasy kluczowych operacji i renderów. Nie wchodzi do `npm test`. */
const base = require('./package.json').jest;
module.exports = { ...base, rootDir: __dirname, testMatch: ['<rootDir>/scripts/perf/*.perf.tsx'], testTimeout: 600000 };
