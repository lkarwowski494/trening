# Recenzja niezależna rodziny v2 cable_row — partia 2, runda r2 (audytor, 09.11.2026)

Poprawki 4fbf144e (po 441075fa), autor poprawek ≠ autor rodziny ≠ recenzent. Worktree odłączony na 4fbf144e.
Skrót `zrodla-runtime --skroty` policzony przez audytora: v2 cable_row **4376c0e6b911** (zgodny z autorem). `assignAll()` = 10.
Arkusze ze śladem (`arkusz-slad.mjs`) dla 9 ćwiczeń × 2 widoki: 5 niezmienionych (Face Pull, Rear-Delt, Machine Row, Leverage, Kneeling) — HTML bajtowo równe r1 (`cmp`); 4 zmienione obejrzane w pełnej rozdzielczości.
Testy: poprawki-r1, zgodnosc-wsteczna, tor, nakladka-cable-row (860/860), figury-backlog-r2 (34/34) — zielone.

## Werdykt rodziny: WYŚWIETLANA (0 KRYTYCZNE/WYSOKIE)

| ID | Klasa | Pewność | Wynik |
|---|---|---|---|
| W1 | zamknięte | 95% | Seated Cable Row / Wiosłowanie (siedząc): bloczek 60 cm, linka 2,2° → 1,0° (≤ 5°, decyzja 27.10.2026 pkt 7a); tor uchwytu poziomy (Δy −1,0 cm na 34 cm); zgięcie łokcia 20° → 93°, łokieć 13,8 cm za barkiem. |
| W2 | zamknięte | 95% | Standing / Single Arm: bloczek 122 cm (klatka ≈ 127), linka 0,5° → 0,3°, uchwyt na stałej wysokości 122,5 cm; odstęp ≥ 6,3 cm. |
| R2-1 | ŚREDNIE | 85% | Nowe po poprawce W1: Seated / Wiosłowanie kończą z uchwytem na wysokości podbrzusza (y 61,8; miednica 52,8, bark 102,8), **0,2 / 0,4 cm nad udami** i 6,3 cm przed tułowiem — z przodu drążek leży na udach. Karta „do brzucha” spełniona na granicy (dolna część brzucha). Bez przenikania. Propozycja do backlogu: bloczek ok. 66–70 cm przy linii nadal ≤ 5°. Kroki: karta Seated Cable Row → rysunek → widok z przodu, koniec ruchu. Realny. |
| R2-2 | NISKIE | 95% | `tests/figures-v2-cable-row-poprawki-r1.test.ts`: test „dłonie nad kolanami nie wchodzą w nogi (odstęp ≥ 3 cm)” mierzy odległość 2D chwytu od **punktu stawu kolanowego**, nie od powierzchni uda — rzeczywisty najmniejszy odstęp 0,2 cm. Nie poluzowanie, ale nazwa testu obiecuje więcej, niż mierzy; miara właściwa: `odstepCiezaru` (scripts/figures/odstep-ciezaru.mjs). |
| S2 | ŚREDNIE (backlog akceptowalny) | 85% | Leverage High Row: oś u góry przenika głowę (0,67–1,37 cm przy dopuszczalnych 0,3) — poprawka wymaga silnika; ruch ćwiczącego poprawny, dźwignia z przodu ukryta (DZWIGNIA_BEZ_GLOWY). Test stanu znanego z powodem — w porządku jako ŚREDNIE w docs/21. |
| Rear-Delt | ŚREDNIE (nie WYSOKIE) | 80% | Cable Rope Rear-Delt Rows: linka 41,5° → 23,4°. Katalog wymaga stacji do wiosłowania siedząc z niskim bloczkiem (`requires: cable.row_seat + cable.low`), więc skośna linka wynika z wybranego sprzętu, nie z błędu pozy; zestaw `faceRow` nie mówi o wysokości linki. Wersja z bloczkiem na wysokości barków to wariant stojący (inne ćwiczenie). Zostaje w backlogu. |

Pozostałe z r1 w docs/21 (S1, S3, N1, N2) — wpisy zgodne z raportem r1.
(d) `figury-ograniczenia-silnika.json`: Seated Cable Row „przejrzane”, `przejrzane_przy` przechodzi `figury-backlog-r2.test.ts`; brzmienie PRZYBLIZENIA w `scripts/figures/agent-pozy/cable_row.mjs:54` zgodne z wpisem („kontrakt nie ma siedziska maszyny z oparciem”).
K14 (`git diff 441075fa 4fbf144e -- tests/`): zmiana odcisków złotych tylko 4 poprawionych ćwiczeń; nowy test z przypadkiem negatywnym opisanym w nagłówku; brak poluzowań (poza R2-2).

## v1 → „zastapiona”
Seated Cable Row, Wiosłowanie na linkach (siedząc), Face Pull.
