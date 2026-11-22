# STAN-AO — wydanie 1.1.1 (sesja AO, 22.11.2026 ~15:15 UTC)

Gałąź kandydata `wyd/1-1-1` zamrożona na SHA d9382dbe5dde91e8b746d14193ed332ab889df62 (nie wypychać nic więcej). Ten plik jest na gałęzi `stan/ao`, żeby nie zmieniać SHA kandydata.

## Zrobione (z dowodem)
- Plan `docs/49b-wydanie-1-1-1.md` (kolumna „Stan”, strony Apple przeczytane 22.11.2026); decyzje KO-119…KO-124 w docs/18.
- Wersja 1.1.1 (app.json, package.json, lockfile); „Co nowego” 2026-11-22 (1 punkt, 33 języki, whatsNew sklepu); test `tests/release-1.1.1.test.tsx`.
- Audyt `docs/wydanie/audyt-1-1-1.md`: 0 KRYTYCZNYCH/WYSOKICH; N-1 naprawione, N-2 do backlogu.
- Pełne `npm run verify` na d9382dbe: kod 0 (Jest 814/814, znacznik `pelne`). `tests.yml` 45032744290 zielony (sprawdził koordynator).

## Zostało (po stronie koordynatora i właściciela; kolejność z docs/49b)
X-06 ios-unsigned (wyzwolone 15:11) → X-07 e2e-ios (podstawowy wyzwolony 15:11; pełny po północy PL, KO-125) → X-08 `npm run check:release` na SHA (agent) → X-08b eksport `site/` + check-urls (koordynator, prośba do właściciela) → X-09 zatwierdzenie `release` dla testflight.yml → X-10 telefon (docs/49b pkt 3) → X-11 wersja 1.1.1 w ASC → X-12 asc-metadane (podgląd, potem zapis; najpierw jeden element) → X-14 notatki EN → X-15 asc-kontrola → X-17 build do wersji (tag `v1.1.1-bNNNN`) → X-18 opcja „Automatically release this version” → X-19 bez wydania stopniowego → X-20 Add for Review / Submit for Review → X-21/X-22 recenzja i wpisy po wydaniu.

## Pułapki
- Bramka TestFlight: E2E i testflight.yml na tym samym pełnym SHA (`scripts/ci/bramka-e2e.sh:10`).
- Trzy pliki `tests/audit-k1-bl-mer-podpisy{1,3,6}` bywają zabijane przez pamięć (SIGKILL) przy równoległym Jest; osobno zielone.
- Pełne verify tylko pod `flock`, jedno naraz; log przy równoległych przebiegach może się nadpisać (sprawdzaj proces, nie tylko plik).
- Wątpliwości językowe (lt, lv, et, sr, ms, vi, tr; rodzaj przy {app}) → backlog 1.2.
