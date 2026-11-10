# STAN — pociąg-4 (gałąź scal/pociag-4; sesje A i A2)

Polecenia: `docs/koordynacja/polecenia/A.md`, `A2.md` (gałąź koordynacja). Decyzje KO-020, KO-022 (docs/18, docs/21).

## Zrobione
- Partia 4 (`figury/partia-4-thruster-wl` @ 06d90e84) scalona w e8b72515 (sesja A); wyjątek rozmiaru poseData.ts 760afa88.
- Partia 2 (`figury/partia-2` @ 7a09818f) scalona w 4d2e19e (sesja A2): rejestry suma obu stron (JSON trójstronnie po kluczach, bez konfliktu wpisu), generatory przeliczone, cele z `pokrycie-symulacja` (figura.v2 527, pelnaKarta 458).
- Skróty (`zrodla-runtime --skroty`): 27 rodzin v2 równe gałęziom źródłowym (int dfaeeefe, p4 06d90e84, p2 7a09818f); v1/karty/zestawy zgodne.
- Przegląd niezależny (audytor): `docs/research/recenzje/pociag-4-scalenie.md` — brak WYSOKICH; 2 ŚREDNIE i NISKIE poprawione w commicie po 4d2e19e.
- Testy figur i rejestrów (180 plików, w tym figures-v2-data, strona-eksport, figury-generator-odtwarza, figures-v2-tor): 175 zielonych + 5 poprawionych i zielonych po ponownym przebiegu.
- KO-022 w docs/21; wyjątek poseData.ts bez zapasu (24 736 B); figure.ts pod limitem bez wyjątku.

## Zostało
- `npm run verify:szybkie` (kod 0), push, zielony `tests.yml` na SHA głowy; scalenie do integracji robi koordynator (`scal-galaz`).

## Pułapki
- Maszyna 4 rdzenie: 180 plików Jest ok. 35 min; gemini-polecenia ~7 min.
- Opis w pokrycie-cele.json: po zmianie uruchomić `node scripts/pokrycie-katalogu.mjs --write` (docs/55 zależy od opisu).
