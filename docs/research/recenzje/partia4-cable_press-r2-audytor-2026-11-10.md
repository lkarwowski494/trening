# Recenzja niezależna r2 — rodzina v2 `cable_press` (partia 4, linia 1.1), 10.11.2026

Recenzent: audytor (bramka 4, L-047 A, L-050; nie pisał rodziny ani poprawek). Stan: `figury/partia-4-cable_press` @ fbe2a83 (poprawki r1 innego programisty; r1 w 12fe9ed2).
Różnica względem r1 (cbcff71..fbe2a83): `poses/cable_press.json` — tylko `wyciag.y` stojąc 160 → 135 i Seated 130 → 100; generator `agent-pozy/cable_press.mjs` (te same liczby); `cue-sets.json` — z zestawu Incline usunięte tylko `bp.control`; nowy test `tests/figures-v2-cable_press-wysokosc-bloczka.test.ts` (zakres [−25, +5] cm względem barku, negatyw 160 cm, Incline bez `bp.control`, inne zestawy bench z `bp.control`).

**Werdykt rodziny: wyswietlana.** Wpisy: `partia4-cable_press-r2.json` (komplet do przepisania 1:1).

## Sprawdzenie poprawek
- **r1-W1 (WYSOKIE) — naprawione.** Bloczek stojąc 135 cm = 4,5 cm pod barkiem (139,5), Seated 100 cm = 5 cm pod barkiem (105): „na wysokości klatki lub barków” (`cpress.setup`). Arkusze z boku (nowe, kadry co 0,05): linka prawie pozioma od barku/klatki do dłoni. Walidator OK ×4; dłoń–koniec linki 0,0 cm; prześwit osi linki od ramienia ≥ 13 cm, od tułowia ≥ 30 cm.
- **r1-Ś1 (ŚREDNIE) — naprawione.** Zestaw Incline: `bp.contact`, `bp.blades`, błąd `bp.mis.arch` — każde zdanie pasuje do rysunku.
- **Bez zmian (cmp z r1, bajtowo równe):** arkusze z góry wszystkich 4 ćwiczeń, Single Arm i Incline z boku.
- **Testy (K14):** nowy test zaostrza (próg z tekstu karty, negatyw); bez innych zmian w `tests/`. Uruchomione `--runInBand`: wysokość bloczka, podpora, nakładka, generator odtwarza plik — zielone.
- **Skróty** (`node scripts/zrodla-runtime.mjs --skroty`, kopia recenzji @ fbe2a83): v2 `c79df483b2da`; karty stojąc `08c8964e60ab`, Seated `8a64c572d245`; zestawy Single Arm `571f01a5d4df`, Incline `60b4ee8e613d`. `v1_zastapiona: []` (brak wpisów i figur v1).

NISKIE z r1 zostają w backlogu (wpis `otwarte_czesciowo` Single Arm, `press.mis.lock` w `bledy_bez_animacji`, głowa na końcu oparcia Incline).
