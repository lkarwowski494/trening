# Recenzja niezależna rodziny v2 `dip` — runda 3 (audytor, 10.11.2026)

Różnica po poprawce W4 (programista poprawki ≠ autor ≠ recenzent). Stan: `figury/partia-4-dip` @ 83f4ba0 (r2 na e3c79af), czysta kopia recenzji.

## Werdykt

| Wpis | Werdykt |
|---|---|
| v2 `dip` (5 ćwiczeń; sha eec289f04568) | **do poprawy** (W5) |
| karty Chest Dip, Triceps Dips (ławka) | wyswietlana (dane bez zmian) |
| zestawy Triceps Dip, Ring Dips | wyswietlana |
| zestaw Dip Machine | do poprawy (W3, dane bez zmian) |
| v1 Triceps Dips (ławka) | zastapiona — razem z v2 „wyswietlana” |

## W4 (r2) — rzut z przodu naprawiony, ale ruch z boku zepsuty

Z przodu łokieć leży teraz między dłonią a barkiem (z = 14,2 → 10,9 cm, odwiedzenie 9–15°) i test `bladLokci` przechodzi. Biegun łokcia [+0,5; −0,3; ∓0,15] kieruje jednak łokieć **do przodu** (+x to przód postaci: stopy x = 73).

| ID | Klasa | Pewność | Opis i miara | Realność |
|---|---|---|---|---|
| W5 | WYSOKIE | 95% | Triceps Dips (ławka), rzut z boku, u ≥ 0,2. Łokieć wychodzi przed tułów, a przedramię wraca przez brzuch i biodro do dłoni za plecami. Przy u = 1: łokieć x = 22,5 cm, bark x = 6,0, miednica x = 13,0, dłoń x = −3,0. Łokieć jest 16,5 cm przed barkiem, ramię w zgięciu (shSag +25°; w r2 −53°, czyli wyprost, jak w dipach na ławce). Przedramię przy z ≈ 11 cm przechodzi przez obrys tułowia (na wysokości y ≈ 60 cm oś tułowia ma x ≈ 10,6, przedramię ok. 2 cm przed nią, przy połowie szerokości tułowia 16,5): **przenikanie**. `checkFrame` tego nie łapie, bo nie sprawdza styku przedramię–tułów. Ten sam źródłowy opis co w W4 (łokcie „pointing straight back”). Test odtwarzający: w każdym u `elbow.x ≤ shoulder.x` (łokieć za barkiem, przy pochyleniu tułowia ok. 8° w tył) i `shSag ≤ 0` przy u = 1; do tego odstęp odcinka łokieć–nadgarstek od tułowia ≥ 0 (elipsa: pół-szerokość GIRTH.trunkWidth, pół-głębokość trunkDepth); negatyw na danych 83f4ba0. Poprawka: biegun łokcia do tyłu (x ujemne, np. [−1; −0,3; ±0,1]); z ma zostać w korytarzu bark–dłoń (test `bladLokci` bez zmian). | realny (każde otwarcie rzutu z boku) |
| N2 | NISKIE | 90% | Komentarz testu `bladLokci` powołuje się na „karta: łokcie prosto do tyłu”, a karta Triceps Dips (ławka) tego zdania nie ma. Źródłem jest reguła rodziny (NASM). Do poprawy przy W5. | — |

## Bez zmian (cmp z r2)

Arkusze `arkusz-slad.mjs` (PNG i HTML) bajtowo równe r2: Chest Dip, Triceps Dip, Ring Dips, Dip Machine (side, front). Różne: Triceps Dips (ławka) side i front — obejrzane od nowa. Zakres łokcia ławki 16,0°/84,0° (reguła zakres spełniona). `checkFrame` i `holdChecks` w 21 kadrach: 0 problemów, ale bez styku ramię–tułów, stąd W5. Dłonie na blacie (W1) bez zmian.

Skróty (`zrodla-runtime.mjs --skroty`, kopia @ 83f4ba0): v2 dip eec289f04568; karty Chest Dip 58bc2ad0a6ce, Triceps Dips (ławka) 457bb9d115cb; zestawy Triceps Dip / Ring Dips / Dip Machine 90516c549650; v1 Triceps Dips (ławka) 0e72ab5e0fbf.
