# Pomiar: generatory póz dolnej części ciała (gałąź pozy-dol, 26.10.2026)

Zakres: 14 rodzin; 121 ćwiczeń do zrobienia (katalog), wygenerowano 112, wyjątków z powodem 9 (poniżej). Poza pozami: katalog wstrzymanych („open”) nie badany.

| rodzina | zakres | wygenerowano | wyjątki | uwagi (przebiegi pętli do zielonego) |
|---|---|---|---|---|
| lunge | 24 | 17 | 7 | wiele rund: zakres biodra/kostki (Bulgarian, Suspended, boczne) |
| calf_raise | 12 | 12 | 0 | 2-3 |
| hip_bridge | 10 | 10 | 0 | 3 (zakres biodra, żaba) |
| leg_isolation | 12 | 8 | 4 | 3 |
| leg_machine | 8 | 7 | 1 | 3-4 (sfera dźwigni) |
| back_extension | 4 | 3 | 1 | 4 (padding rzymskiej, limity biodra) |
| glute_floor | 7 | 7 | 0 | 3 (pozy z gotowym FK 3D; błędy bez opisu w pl.json pominięte) |
| hip_abd_add | 7 | 6 | 1 | 3 |
| kneeling_hinge | 1 | 1 | 0 | 3 (kolizja ud ze skrzynią) |
| carry | 7 | 7 | 0 | 5 (kontakt stopy, pół cyklu zamiast pełnego, ciągłość) |
| core_hang | 3 | 3 | 0 | 5 (prędkość kostek, limit barku) |
| core_standing | 17 | 16 | 1 | 6 (kolizje linek, limity, sfera landmine) |
| dip | 5 | 5 | 0 | 2 |
| thruster | 3 | 3 | 0 | 8 (ciągłość ruchu: ręka + wstawanie; Clean and Press najdłużej) |

Zaliczenie za pierwszym przebiegiem generatora (pierwsza wersja pliku): glute_floor 0/7 → po 2 poprawkach 7/7; hip_abd_add 2/6; kneeling_hinge 0/1; carry 0/7; core_hang 0/3; core_standing 7/17 (po rozbudowie z 3 do 17: 7 z 17); dip 3/5; thruster 0/2. Średnio ok. 35% za pierwszym razem, wszystko zielone po 2-8 iteracjach.
Czas: ok. 10-40 min pracy agenta na rodzinę (najdłużej: lunge, back_extension, thruster).

## Wyjątki (powód)
- lunge (7), leg_isolation: Leg Curl (hantel), Stability Ball Hamstring Curl, Glute Ham Raise, Nordic Curl; leg_machine: Smith Machine Leg Press; back_extension: Weighted Ball Hyperextension; hip_abd_add: Band Hip Adduction; core_standing: Seated Barbell Twist — powody w WYJATKI w generatorach i w manifestach.

## Wnioski do silnika
- Zakres biodra/kostki blokuje warianty (Bulgarian, boczne, zwisy): rodzinne `allow` w TEMPLATES.
- Miednica z nie przesuwa bioder/barków: blokuje kroki boczne (Lateral Band Walk — pokazany jeden krok).
- Sztanga nie ma obrotu w poziomie (skręt ze sztangą na plecach), guma nie ma zaczepu na kostce, talerz tylko w płaszczyźnie y–z.
- Teksty błędów (pl.json) dla hext.mis.arch, hab.mis.high, hang.noSwing, oly.mis nie istnieją: błędy dopiero po wdrożeniu tekstu (generatory gotowe, zweryfikowane z tymczasowym tekstem).
- Ciągłość 6 cm/(1/48 u) + max 12 klatek: ruchy o dużym zasięgu (clean and press) wymagają rozłożenia ruchu; helper `kluczeRownoDroznie` w dol.mjs.
