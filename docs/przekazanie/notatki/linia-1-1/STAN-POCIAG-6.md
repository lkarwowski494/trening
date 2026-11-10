# STAN — pociąg-6 (gałąź scal/pociag-6; sesja H)

Polecenie: `docs/koordynacja/polecenia/H.md` (gałąź koordynacja @ 97703d5). Decyzja: docs/18 (wpis sesji H, 10.11.2026, do weta koordynatora).

## Zrobione
- Partia 7 (`figury/partia-7` @ 9e3db956; core_floor, glute_floor) scalona z integracją @ 584bca92 (partia 6, plyo) w 33eef50b: 23 pliki w konflikcie; rejestry i listy — suma obu stron; pliki runtime i generowane z generatorów; cele 1.1 z `pokrycie-symulacja` (roleMiesni 564, pelnaKarta 498, (c) 51, ciężkich 210); minimum zapadki `--podnies-minimum` osobno (f1b6d8e9).
- Liczby zmierzone: eksport strony 470, polecenia Gemini rodzin 8 / plików 26, 34 rodziny nakładek; kolejność gotowych rodzin w `tests/figures-v2-mapping.test.ts` = `families.ts` (plyo przed glute_floor).
- Skróty (`zrodla-runtime --skroty`): core_floor 8cf398255940, glute_floor cfdc21dbffc8, plyo 10df52ff492a, reszta = 584bca92 (0 różnic).
- Przegląd niezależny: `docs/research/recenzje/pociag-6-scalenie.md` (audytor) — 0 znalezisk.
- Testy figur lokalnie: 16 plików po jednym `--runInBand`, wszystkie zielone (mapping po poprawce kolejności).

- Partia 9 (`figury/partia-9` @ 1bb3b55c; lunge, leg_isolation) scalona w 9fcf21f2 (+ 95d5d726 `--podnies-minimum`): cele 1.1 bez zmian (ciężkich 210), eksport 502, Gemini rodzin 6 / plików 18, 36 rodzin nakładek; L-080 w `skrot-v2-wynik` na core_standing; skróty lunge f2ff1a209120, leg_isolation 19fc316f3a19; przegląd audytora (sekcja partii 9 w raporcie) — 0 znalezisk; testy figur 22 pliki zielone.

## Zostało
- `verify:szybkie`, push, zielony `tests.yml`; scalenie do integracji (koordynator, `scal-galaz`). Partia 8 — następny pociąg.
