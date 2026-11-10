# STAN — pociąg-4 (sesja A, gałąź scal/pociag-4)

Polecenie: `docs/koordynacja/polecenia/A.md` (gałąź koordynacja). Decyzja KO-020 (10.11.2026) rozszerza pkt 3.1: konflikty rozwiązuje sesja z kontrolami (a)–(f).

## Zrobione
- Krok 1a: `figury/partia-4-thruster-wl` @ 06d90e84 scalona do scal/pociag-4 (commit e8b7251). Rozwiązanie: pliki lib/*.ts i testy figur ręcznie jako suma obu stron; JSON-y rejestrów trójstronnie (3-way po kluczach); `zrodla-runtime --write`, `v2-gen --write`, `pokrycie-katalogu --write`, macierz, README przeliczone; cele z `pokrycie-symulacja.mjs`.
- Testy po scaleniu (jest --runInBand): gemini-polecenia, cel-1-1, recenzja-wyjatki-1-1, skrot-v2-wynik, store-review-notes, strona-eksport-recenzja, figures-v2-{mapping,wstrzymane,nakladka-*,petla,delt-raise-p4} — zielone (445). Nieuruchomione: figures-v2-data, strona-eksport, figury-generator-odtwarza, tor-wyjatki.
- Krok 2: wpisy KO-012 i KO-020 w docs/18 (uwaga: wpis KO-020 mówi o partii 4 i 2).

## Zostało
- Scalić `figury/partia-2` @ 7a09818f (mobility_floor, mobility_stand, pushup_plank; baza 1d6352ba, więc konflikty podobne). Pliki dodatkowe względem partii 4: tests/fixtures/figury-v2-zlote.json, tests/fixtures/pokrycie-katalogu-min.json, tests/interaction-guards.test.ts, tests/figury-*, scripts/figures/agent-pozy/*.
- Niezależny przegląd scalenia (subagent `audytor`) → `docs/research/recenzje/pociag-4-scalenie.md` (autor ≠ recenzent): czy żaden wpis żadnej strony nie zginął (porównanie z oboma rodzicami, w tym figury-recenzja.json, pokrycie-cele.json, tor-wyjatki.json).
- Kontrola (d): `node scripts/zrodla-runtime.mjs --skroty` — skróty rysunków rodzin vs wpisy recenzji (partie 1–3 na integracji, partia 4 na gałęzi źródłowej).
- `npm run verify:szybkie` (wynik do pliku), push, zielony tests.yml na SHA.

## Pułapki
- Skrypt 3-way JSON: scratchpad m3.mjs (nie w repo): sumuje klucze, tablice jako zbiór; po nim `zrodla-runtime --write` ustala kolejność.
- Liczby w testach figur (ready, POSE_FAMILIES, KEYS count, JED, petla) liczone sumą obu stron — po partii 2 przeliczyć ponownie.
