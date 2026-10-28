# Raport przeglądu tłumaczeń przez API — 28.10.2026 (dowód R-010)

Kopia artefaktu CI `raport-tlumaczen` z przebiegu [40642059904](https://github.com/lkarwowski494/trening/actions/runs/40642059904) (`przeglad-tlumaczen.yml`, batch `msgbatch_01CVC1PzCUxnhgZPrJQnHzJZ`, gałąź `naprawy/M2-scalenie-1-0`, baza `98aa4a2`). Artefakt CI wygasa 04.11.2026 — ta kopia jest trwałym dowodem (M1-audytor-generalny-006, pętla 2 napraw, 28.10.2026).

- Model `claude-opus-5-5`, effort `medium`; 34 języki × 480 zdań: treść krytyczna (zdanie medyczne i 5 kluczy asekuracji), wszystkie zdania wskazówek techniki i klucze dodane lub zmienione od poprzedniego przeglądu — lista zdań wynika z kodu na `98aa4a2` (`scripts/i18n/przeglad-api.mjs`, `zbierzZdania`, `KRYTYCZNE_KLUCZE`).
- `podsumowanie.md` — tabela wyników (1 uwaga krytyczna: sl „drop set”, poprawiona); `<język>.json` — uwagi modelu dla języka; `szacunek.json` — szacunek kosztu.
- Raport jest opinią modelu; decyzje o poprawkach (165 naniesionych, odrzucone z powodem): `docs/16-jezyki-i-marka.md`, sekcja przeglądu z 28.10.2026.
- Zmiany treści krytycznej i wskazówek po bazie batcha do `2385e75` (16 wartości krytycznych, 34 wskazówki) mają każda uwagę modelu w tym raporcie — to poprawki do uwag, nie nowa treść (sprawdzenie 28.10.2026: 50 zmian, 0 bez uwagi).
- Zamknięcie R-010 według decyzji właściciela z 21.10.2026 (docs/18): przegląd wykonany przez Claude zamyka ryzyko; przegląd przez native speakerów odrzucono (K-P4-2, 20.10.2026).
