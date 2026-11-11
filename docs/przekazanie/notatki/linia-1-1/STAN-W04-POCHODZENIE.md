# Stan W-04 / ZB-023 — znaczniki pochodzenia (sesja S, programista)
Gałąź `zb/w04-pochodzenie` od `integracja-1-1` @ d11a948d. Aktualizacja: 11.11.2026.

## Zrobione
- Zadanie 1 (raport do koordynatora): ZB-021 „w toku”, linia 1.1 trwa → warunek ZB-023 uznany za spełniony (do weta). Mechanizm katalogu: `rid` + wpisy techniczne (`catalog-aliases.json`) → `CATALOG_RID`.
- Wskazówki i figury v1: mapa `rid` + `ridAliasy` w `data/zrodla/{cues,figures}.json`, przeniesienie do `lib/{cues,figures}/data.json` (`scripts/zrodla-runtime.mjs`: `ridMap`, `uzupelnijRid`, `--rid`). Strażnik `tests/provenance-guard.test.ts` (najpierw czerwony: 4 failed / 6 passed). Decyzja: docs/18-przekazanie.md, 11.11.2026 (sesja S).

## Zostało
- Figury v2 (pliki póz): PYTANIE do koordynatora (A mapa / B kontrakt / C odłożenie).
- verify:szybkie, push, zielony tests.yml, recenzja niezależna (audytor), ZB-023 w docs/zobowiazania.md, W-04 w docs/49.

## Pułapki
- Nowe ćwiczenie w `data/zrodla/cues.json` / `figures.json` (także z innych gałęzi po scaleniu) bez znacznika → `check:zrodla-runtime` czerwony; naprawa: `node scripts/zrodla-runtime.mjs --rid && node scripts/zrodla-runtime.mjs --write`.
- Testy z importem modułu ES generatora — przez `node --input-type=module -e` (Jest nie importuje .mjs).
