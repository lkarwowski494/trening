# Recenzja niezależna różnicy rysunku v2 — squat i hinge po scaleniu P1 do scal/pociag-2 (10.11.2026)

Recenzent: audytor (nie autor P1 ani scalenia; L-047). Porównanie: integracja c9346795 (wpisy recenzji squat b4626b78e4ad, hinge db4345521e62) vs scal/pociag-2 @ a78c6cef (squat 0b9389b86aa1, hinge 9853b1835b51), worktree tymczasowe (usunięte po pracy). Dodatkowo stan bazowy poprzedniej recenzji P1 f1472e08.

## Które ćwiczenia zmieniły rysunek (skróty per ćwiczenie, scripts/skrot-v2-wynik.mjs --cwiczenia)
- squat (25 ćw.): 6 zmienionych — Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat, Squat with Bands, Squat with Chains; 19 bajtowo równych.
- hinge (32 ćw.): 3 zmienione — Clean Deadlift, Single Leg RDL (hantel), Single Leg RDL (linki); 29 bajtowo równych (w tym RDL (sztanga) i RDL (hantle/linki) — zmiana głębokości RDL jest już w c9346795 i w jej skrócie).
- Pliki zmienione przez scalenie, które wpływają na rysunek: tylko dane wskazówek (data/zrodla/cues.json — 9 kart własnych P1, lib/figures/v2/cue-sets.json — usunięte zestawy ogólne tych 9 ćwiczeń, data/zrodla/figury-sens.json — cue_wariant). Kod rysunku (rigi, figure.ts, overlay*, render) bez zmian.

## Składniki (md5 po zaokrągleniu 1e-4; u co 1/16, oba rzuty, stan poprawny i 10 póz błędów)
- figureSpec: równy we wszystkich 9.
- Ruch (shapesAt z mięśniami), styki (contactShapes), ślad toru (trailFor): równe w c9346795 i a78c6cef dla wszystkich 9 ćwiczeń i każdej pozy; równe też z f1472e08 (baza poprzedniej recenzji P1, w której oglądano arkusze tych ćwiczeń).
- Różni się tylko dobór po karcie:
  - Barbell Hack Squat: linie thighParallel,kneeToe,backLine → backLine; błędy roundBack+heels → heels; znaczki ✓ → hinge.back.
  - Bodyweight / Dumbbell Squat: linie → kneeToe; nakładka squatKneeLimb bez zmian; błędy → kneesIn; znaczki → gob.stance, sq.kneesToes.
  - Overhead Squat: linie → brak; nakładka squatKneeLimb → brak; błędy → heels; znaczki → brak.
  - Squat with Bands / Chains: linie → kneeToe,backLine; błędy bez zmian (kneesIn, heels); znaczki → sq.kneesToes, sq.back.
  - Clean Deadlift: linie plumbMidfoot,backLine → backLine; nakładka hingeUprightRef → brak; błąd roundBack → barAway (nowa poza na ekranie); znaczki → dl.close, hinge.back.
  - Single Leg RDL (hantel/linki): dobór (linie, nakładka, błędy) bez zmian; znika tylko znaczek ✓ rdl.depth (karta slrdl.* zamiast rdl.dbMove/rdl.depth).
- Ta sama różnica, co w recenzji p1-squat-hinge-roznica-audytor-2026-11-09.md (f1472e08 → 8353c08e); scalenie z integracją nie wniosło innej zmiany rysunku tych rodzin.

## Arkusze ze śladem toru (L-050)
Oglądane: scripts/figures/arkusz-nakladka.mjs (sylwetka + ślad + linie + nakładka, kadry co 0,05, każda poza błędu) dla 9 ćwiczeń, motyw jasny i ciemny (po 40 arkuszy), stan c9346795 dla porównania (48 arkuszy), oraz scripts/figures/arkusz-slad.mjs (odstęp ciężaru od nóg) — 18 arkuszy. Katalogi w scratchpadzie (ark-a78-light, ark-a78-dark, ark-c93-light, slad-a78).
- Clean Deadlift, bok, stan poprawny: sztanga przy goleniach i udach (odstęp 0,2–3,0 cm, max przy u=0,70 przy przejściu przez kolana), ślad pionowy nad śródstopiem, pełny wyprost przy u=1 (biodro 10°). Poprawne.
- Clean Deadlift, bok, poza barAway: sztanga wyraźnie przed nogami przez cały ruch, znacznik błędu na sztandze, ślad poprawnego toru (przerywany) przy nogach jako odniesienie; linia pleców prosta — błąd pokazuje tylko to, co mówi mis.barAway („sztanga odjeżdża od ciała”). Poprawne.
- Single Leg RDL (hantel), bok: noga zakroczna unosi się w linii z tułowiem, noga podporowa lekko ugięta, hantel opada pionowo przy nodze podporowej do wysokości tuż poniżej kolana, plecy proste (backLine). Poprawne; bez zmian względem c9346795.
- Overhead Squat, bok (ciemny): sztanga nad śródstopiem przez cały ruch (ślad pionowy), ręce w pionie, przysiad do kolana 128°, pięty na podłodze. Bez linii i nakładki — zgodnie z kartą (ohs.*). Poprawne.
- Barbell Hack Squat, bok: sztanga za nogami w rękach, opada wzdłuż tyłu ud, tułów prawie pionowy, linia pleców. Poprawne.
- Bodyweight/Dumbbell Squat, Squat with Bands/Chains: ruch identyczny z c9346795; linie kolano–palce i plecy, nakładka kolana — zgodne z kartami.

## Spójność z kartami P1
- 9 kart: skróty bieżące równe wpisom w figury-recenzja.json (werdykt „wyswietlana”) — bez zmian.
- Każdy pokazywany błąd ma swoje zdanie na karcie (heels → sq.mis.heels, kneesIn → sq.mis.kneesIn, barAway → mis.barAway, roundBack → mis.roundBack); żaden błąd spoza karty.
- Kopia a78c6cef z wpisanymi nowymi skrótami (squat, hinge odkryte w lib/figures/data.json): tests/spojnosc-karta-rysunek.test.ts, figures-v2-nakladka-squat-hinge, figures-v2-cues — 43/43 zielone; figures-v2-tor, recenzja-wyjatki-1-1, figury-recenzja*, figury-styk*, figures-v2-styk* — 1238 zielonych, 1 pominięty. Luki z poprzedniej recenzji P1 (znalezisko 1) są zamknięte.
- Na samej gałęzi (skróty nieaktualne, squat i hinge ukryte) spojnosc-karta-rysunek ma 4 czerwone testy — skutek ukrycia (fail-closed), znika po wpisaniu skrótów i przegenerowaniu data.json.

## Znaleziska
Brak KRYTYCZNYCH, WYSOKICH i ŚREDNICH.
- NISKIE (informacja dla koordynatora, pewność 99%, realny): przed scaleniem trzeba wpisać sha z tej recenzji do figury-recenzja.json i przegenerować lib/figures/data.json (`node scripts/zrodla-runtime.mjs --write`); bez tego squat i hinge pozostają ukryte w aplikacji, a 4 testy spojnosc-karta-rysunek są czerwone (stan a78c6cef: lista v2 bez squat i hinge).

## Werdykt
- squat: wyswietlana — sha 0b9389b86aa1, 25 ćwiczeń.
- hinge: wyswietlana — sha 9853b1835b51, 32 ćwiczenia.
