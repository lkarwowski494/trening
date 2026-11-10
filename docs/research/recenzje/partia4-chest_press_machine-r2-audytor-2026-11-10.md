# Recenzja niezależna r2 — rodzina v2 `chest_press_machine` (partia 4, linia 1.1), 10.11.2026

Recenzent: audytor (bramka 4, L-047 A, L-050; nie pisał rodziny ani poprawek). Stan: `figury/partia-4-chest_press_machine` @ e039882 (poprawki r1 innego programisty; r1 w 6f8731d8).
Różnica (702fcabd..e039882): generator `agent-pozy/chest_press_machine.mjs` i `poses/chest_press_machine.json` (Decline siedzący, biegun łokcia Machine Shoulder Press, zasięg końca ruchu), odciski złote — tylko 4 pozy tej rodziny, nowy test `tests/figures-v2-chest-press-machine-r1.test.ts`.

**Werdykt rodziny: wyswietlana.** Wpisy: `partia4-chest_press_machine-r2.json` (komplet do przepisania 1:1; v1 „Machine Chest Press” → `zastapiona`).

## Sprawdzenie poprawek (arkusze własne 5 ćwiczeń, kadry co 0,05; liczby z `frameAt`)
- **r1-W1 — naprawione.** Leverage Decline Chest Press: siedzi (oparcie 85°, barki ok. 50 cm nad miednicą, kostki na podłodze), start uchwyty przy dolnej części klatki (10,7 cm pod barkiem), wypchnięcie w przód i lekko w dół; zgodne z opisem i zdjęciem źródła ćwiczenia.
- **r1-W2 — naprawione.** Machine Shoulder Press: łokieć przed linią boczną 17–30° (u = 0,5: 8,5 cm w przód, 28,3 cm w bok), przedramię ≤ 13,5° od pionu w rzucie z boku.
- **r1-Ś1 — naprawione.** Koniec ruchu łokieć 17,6 / 18,6 / 16,7 / 16,3° (≤ 20°); Smith 15,0° bez zmian.
- **Bez regresji:** walidator OK ×5; dłoń–punkt styku 0,0 cm; |chwyt−oś| 69,9–70,0 cm; prześwit głowa–dźwignia/gryf ≥ 20,6 cm; Smith bajtowo równy r1 (cmp). Testy `--runInBand` (r1, tor, nakładka, zgodność wsteczna, generator odtwarza plik): 5 zestawów, 853 testy zielone.

## Znaleziska r2
| # | Poziom | Pewność | Co | Realność |
|---|---|---|---|---|
| T1 | ŚREDNIE | 95% | Negatywy w `tests/figures-v2-chest-press-machine-r1.test.ts` porównują stałe (np. `67 <= 50`, `21.8 <= 20`, `zla = { barkiNad: 52.5 − 69.6 … }`) zamiast uruchomić miary (`siedzi`, `katLokcia`, `przedramieOdPionu`, `jointAngles`) na pozie sprzed poprawki (K5: „dane sprzed poprawki oblewają test”). Poprawka: fixture pozy r1 (z 702fcabd) albo mutacja bieguna/zasięgu w kopii danych | test (backlog, bez blokady rysunku) |

Zostają z r1: zestaw Smith (`ohp.seat` „hantle przy barkach”) — do poprawy, backlog; `do_przegladu` Machine Shoulder Press w `figury-ograniczenia-silnika.json` — ograniczenie nadal aktualne.

**Skróty** (`node scripts/zrodla-runtime.mjs --skroty`, kopia recenzji @ e039882): v2 `a254d112c317`; karty MCP `876d5d48af0e`, MSP `524d02513230`; zestawy Incline/Decline `587789bfe0c2`, Smith `7b8d9f13f928`.
