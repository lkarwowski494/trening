# Stan agenta — fala1/zb025-pelna-karta-nazwy-en (01.11.2026)

Zrobione: dc97e0c3 (ZB-025 a, Z3); drugi commit (ZB-025 b: nazwy EN po rid, warstwa, aliasy wyszukiwania i importu CSV, strażnik regex, Maestro, BRD-BIB-010).
Zostało: (1) szersze testy: 133 pliki (lista w scratchpadzie `w/entests.list`) nie dobiegły przy obciążeniu maszyny (load ~28; scenario-full dał timeout 180 s, nie błąd logiki). Uruchomić po kolei i poprawić oczekiwane nazwy EN w testach asertujących stare wyświetlane nazwy (swap-ui, voice, csv-import-ui, watch-fill-ui, audit-0.10-ui, e2e-paths, catalog-library25, cues-014, figures-v2-*, strona-eksport*, sec2-01-names, maestro-selectors, tests/watch-fixtures + watch-fixtures/snapshots, regress, matrix-*).
(2) po commicie: check:matrix, typecheck, check:claims, check:i18n; docs/19 regeneruje koordynator.
(3) Recenzje nazw: badacz + recenzent lokalizacji (pola `recenzja` w docs/research/equipment/nazwy-en.json).
(4) Niezrobione: sekcja 3 przewodnika (marki — bez zmian), terminy do slownik-terminow.json (35 języków), zrzuty EN sklepu (niesprawdzone).
Pułapki: rid nie może być w lib (provenance-guard) — generator daje mapę po kluczu; .mjs nie importuje się w jest (spawn node -e); nie używaj pkill -f jest (zabija własną powłokę).
