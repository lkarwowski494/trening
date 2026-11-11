# Dowód: check-slowniki (commit 79117f33, 11.11.2026)

```
$ npm run check:slowniki

> trening@1.0.1 check:slowniki
> node scripts/slowniki.mjs

i18n: 1462 tekstów w kodzie, 1639 w słowniku EN

testy własności (fast-check): PROP_SEED=20261006 (stałe; odtworzenie: PROP_SEED=20261006 npx jest <plik>)

Test Suites: 10 passed, 10 total
Tests:       1331 passed, 1331 total
Snapshots:   0 total
Time:        14.351 s, estimated 61 s

testy własności (fast-check): PROP_SEED=20261006 (stałe; odtworzenie: PROP_SEED=20261006 npx jest <plik>)

Test Suites: 1 passed, 1 total
Tests:       21 skipped, 3 passed, 24 total
Snapshots:   0 total
Time:        3.537 s, estimated 27 s
check:slowniki: zielone (24 s)
kod wyjścia: 0
```
