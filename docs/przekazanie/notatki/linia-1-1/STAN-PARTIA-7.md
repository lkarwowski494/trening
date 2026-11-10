# Stan partii 7 (tura 3, linia 1.1) — core_floor, glute_floor

Aktualizacja: 10.11.2026 ~13:05 UTC (sesja D, session_01T66VBvJUHVXtAWBVygMpkF — przekazanie przy kontekście ~31%). Koordynator: session_01T66VBvauzmGEDCSRshqWXa (od 12:04; wcześniej session_01T66VBzARTWMJ7smU82sfJs).
Gałąź `figury/partia-7` od `origin/integracja-1-1` @ b66ecfa2. Briefy: `briefy/partia-7-autor.md`, `briefy/partia-7-recenzent.md`.
Model pracy: autor (subagent programista, gałąź `figury/partia-7-<rodzina>`) → audytor (worktree odłączony) → poprawki WYSOKICH przez innego programistę z testem → r2 tym samym audytorem → lead przepisuje r2.json 1:1 do figury-recenzja.json → scalenie gałęzi rodziny do partia-7.

| Rodzina | Stan | Recenzja | Uwagi |
|---|---|---|---|
| core_floor | włączona, scalona (e869e93a) | r2 wyswietlana 8cf398255940 (`docs/research/recenzje/partia7-core_floor-r1/r2*`) | r1: W1 Sit Up dłonie, W2 Bicycle stopa → bf7d4f14; backlog CF-* (docs/21) |
| glute_floor | włączona, scalona (619b58af) | r2 wyswietlana cfdc21dbffc8 (`partia7-glute_floor-r1/r2*`) | r1: W1 Cable Kickback chwyt, W2 Prone Flutter błąd w ławce → 79a59d21; nakładka z nowej reguły `plecy_wprost` (Donkey Kick, ACE #270 + ISSA, curl 10.11); `miednica_bez_przechylu` → analogia; backlog GF-* |
Pełne karty (pokrycie-katalogu): 371 → 392 (+14 core_floor, +7 glute_floor). Nowe teksty UI: brak (fazy z istniejących nazw) — przekład 0 zł [sprawdzić `node scripts/check-i18n.mjs` po zmianach].

## Następny krok (następca)
1. Czerwone po scaleniu glute→partia-7 (przebieg 31 plików, 13:00 UTC) — DO NAPRAWY przed verify:szybkie:
   - `tests/figury-recenzja-p2.test.ts` „7. pozostałe pozy sześciu rodzin bez zmian”: odciski glute_floor Donkey Kick, Cable Kickback, Hip Extension with Bands (i ewent. Machine/Prone) — pozy błędu dopisane i W1/W2 po recenzji r2 → przelicz odciski tego testu ze wpisem „zmiana celowa 10.11.2026 (partia 7, glute_floor r2 cfdc21dbffc8)”.
   - `tests/figures-v2-data.test.tsx` macierz błędów: Frog Sit-Ups / jerk — poza błędu nie różni się od poprawnej (oczekiwane true, jest false) — core_floor; sprawdź, czy błąd jest wstrzymywany (bledy-wstrzymane.json) czy poza do poprawy (zmiana pozy = recenzja różnicy audytorem).
   - `tests/cel-1-1-bez-ciezkich.test.ts` + `docs/research/pokrycie-cele.json`: cel = symulacja (`node scripts/pokrycie-symulacja.mjs --json`, pole cel; pełna karta +6, „ciężkie” 250 → 244) — przepisz cele, w docs/21 (Backlog 1.2 „ciężkie”) liczba 244 z dopiskiem partii 7; docs/55 po zmianie celów.
   - `tests/pokrycie-katalogu.test.ts` „zapadka … jezyk.de.kompletne” — sprawdzić (może skutek celów).
   - `tests/strona-eksport-recenzja.test.ts` — czerwony w tym samym przebiegu (nieprzeanalizowany; zapewne skróty/wpisy po scaleniu).
   - `tests/architecture-limits.test.ts` — poseData.ts nad limitem: znika po KO-024.
2. KO-024: zrobione lokalnie przez sesję D (scalenie origin/scal/posedata-podzial, pliki rodziny core_floor/glute_floor w lib/figures/v2/rodziny/) — po wejściu podziału do integracji zwykłe scalenie origin/integracja-1-1.
3. `npm run verify:szybkie` (kod 0) → push → zielony tests.yml → PRZEKAZANIE do koordynatora.

## Pułapki
- Stopki WIP 25f296c7 i 843bbe38 mają inną sesję/model (skopiowane z programista-wspolny.md) — bez przepisywania historii.
- Skrypt przepisania r2.json (v2 nadpisz, zestawy/karty nadpisz/dopisz, v1_zastapiona → werdykt zastapiona): był w scratchpadzie — prosty, wzór w STAN-PARTIA-2.
- Maszyna 4 rdzenie: 2 programistów + Jest → load 12; testy pojedynczo.
- Badacz glute_floor: `docs/research/glute-floor-pewnosc-regul-2026-11-10.md`; podniesienia pewności poza `plecy_wprost` — backlog GF-B1.
