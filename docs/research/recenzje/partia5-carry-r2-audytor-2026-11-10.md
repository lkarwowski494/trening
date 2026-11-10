# Recenzja niezależna rodziny v2 carry — partia 5, runda r2 (audytor, 10.11.2026)

Gałąź `figury/partia-5-carry` @ ba830c8 (poprawki bca55f7; baza r1 8cfa96c), worktree odłączony, czysty. Autor rodziny: programista (subagent, sesja session_01T66VByZrLpWxNF8yF3gpgu); poprawki r1: inny programista; recenzent: audytor (subagent) — nie pisał rodziny ani poprawek.
Arkusze wygenerowane samodzielnie: `scripts/figures/arkusz-slad.mjs` — 7 ćwiczeń × widok side (21 kadrów co 0,05), obejrzane w pełnej rozdzielczości, kadry u 0 / 0,05 / 0,1 powiększone 2×. `cmp` z arkuszami r1: Suitcase Carry bajtowo równy, pozostałe 6 zmienione (zgodnie z zakresem poprawek).
Liczby z `frameAt` (u co 0,01). Testy: `figures-v2-carry-r1`, `figures-v2-tor`, `figures-v2-nakladka-carry`, `figures-v2-data`, `figury-generator-odtwarza` — 242/242 zielone.
Skróty `zrodla-runtime --skroty` policzone samodzielnie na ba830c8 i na 8cfa96c, porównane plikami (`diff`): różni się **tylko** v2 carry `1840bd9a3028 → bc03d01d72f6`; reszta (wszystkie v1, v2 innych rodzin, karty, zestawy) bez zmian, więc wspólna zmiana `contract.ts` nie rusza innych rodzin (`gryf_szesciokatny` jest tylko w `poses/carry.json`). Zestaw carry `b26682582402`, karty Farmer's Walk `db13ea14b2b8`, Suitcase Carry `cdf5c579c5c0` — bez zmian. `assignAll()` = 7.

## Werdykt rodziny: WYŚWIETLANA (WYSOKIE z r1 naprawione; S1 ŚREDNIE → backlog)

| ID r1 | Stan | Miara r2 |
|---|---|---|
| W1 WYSOKIE (rack) | naprawione | Chwyt 17,0 cm przed barkiem (r1: 34,0), zgięcie łokcia 148° (r1: 115°), przedramię prawie pionowo przy klatce; wzorzec Double Kettlebell Front Squat 15,1 cm / 149°. Dzwon `tyl → dol`: dzwon pod uchwytem przed klatką, odstęp od tułowia 3,0 cm (r1: 6,7), od ramienia 7,3 cm, od głowy 31,9 cm; z przedramieniem nachodzi tak jak w zrecenzowanym wzorcu (środek dzwonu 6,5 cm od osi przedramienia; wzorzec 8,2 cm; kolizje silnika: tolerancja kettlebella w dłoni 14 cm, `colliders.ts:148`). Na arkuszu czytelny rack. |
| W2 WYSOKIE (ślad trap bar, Rickshaw) | naprawione | Ślad = środek chwytów, 0,0 cm w każdej klatce (r1: 12,7–12,8). `contract.ts` dopisuje `gryf_szesciokatny` do gałęzi „ciężar w dłoniach”; strażnik C1 obejmuje teraz gryf (`tests/figures-v2-tor.test.ts:126,136`, lista dokładnie 2 ćwiczeń carry). |
| S2 ŚREDNIE (oś hantla) | naprawione | `obrotPrzedramienia: 0` we wszystkich klatkach: Farmer's Walk i Farmers Handles — oś hantla [−1, 0, 0] (przód–tył), Overhead Carry — [1, −0,2, 0]. Przenikanie uda: brak, min. odstęp 0,6 cm (Farmer's, Handles), główki w tej samej odległości z jak chwyt. |
| S1 ŚREDNIE (Overhead, 16 cm przed barkiem) | **nie poprawione — zostaje ŚREDNIE, backlog** | Chwyt nadal 16,0 cm przed barkiem, zgięcie barku względem tułowia 162,2°, tułów 0°. Zrecenzowane pozycje nad głową trzymają ciężar nad barkiem przy zgięciu 146–167°, ale z tułowiem pochylonym 4–22° (Split Jerk 167,2°/4°, Overhead Squat 156,8°/8°, Power Snatch 146,1°/22°); w noszeniu reguła `tulow_pion` wymaga tułowia w pionie, więc tamta droga odpada. Twierdzenie programisty (≤ 5 cm wymaga 172–173° > zakres 170°) zgadza się kierunkowo z rachunkiem — nie liczyłem go niezależnie. W zakresie 170° da się jednak zbliżyć chwyt do ok. 7 cm (rachunek: ramię 8° bliżej pionu). Bez awansu: ręka prawie prosta, ciężar nad głową, żadne zdanie zestawu nie mówi „nad barkiem”, reguły „ustalone” spełnione. |
| N1 NISKIE (Farmers Handles = hantel r 10) | bez zmian, uproszczenie nazwane | Teraz rysowane jako hantel z dużymi główkami przód–tył — bliżej sprzętu niż koło z r1. |

## Nowe
| ID | Klasa | Pewność | Znalezisko | Realność |
|---|---|---|---|---|
| N2 | NISKIE | 95% | `tests/figures-v2-carry-r1.test.ts:23-25` — „pomiar potrafi paść” porównuje same stałe (`34 <= 18`, `115 >= 140`), nie liczy miary na danych sprzed poprawki (K5: przypadek negatywny ma odtwarzać wadę na danych). Główny test progu (wiersze 19-22) jest poprawny i oblałby dane r1 (34 > 18). | teoretyczny (jakość testu) |

## Sprawdzone bez znalezisk
- Ciężar w dłoni w każdej klatce: ślad 0,0 cm od chwytu we wszystkich 7. Tułów 0°, bez przechyłu. Kostki ≥ 7 cm (stopy na podłodze jak w r1).
- Suitcase Carry: arkusz bajtowo równy r1.
- Karty własne (Farmer's Walk, Suitcase Carry) i zestaw ogólny przy 5 ćwiczeniach — skróty bez zmian, ocena z r1 aktualna (rysunek po poprawkach nadal zgodny ze zdaniami).
- Testy (K14, `git diff 8cfa96c..ba830c8 -- tests/`): tylko dopisania (nowy plik r1, C1 rozszerzony o gryf z listą) — bez poluzowań.
- v1: brak wpisów v1 dla 7 ćwiczeń → `v1_zastapiona` pusta.
