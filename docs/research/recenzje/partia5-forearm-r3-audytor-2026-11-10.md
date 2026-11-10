# Recenzja niezależna rodziny forearm — partia 5, runda r3 (audytor, 10.11.2026)

Stan zamrożony: `figury/partia-5` @ `b78acbe6` (poprawka W2 `5e0755b2`, inny programista; baza r2 `4fa83a0c`). Recenzent: audytor (subagent), autor ≠ recenzent.

**Werdykt rodziny: wyświetlana** — brak KRYTYCZNYCH i WYSOKICH.

## Sprawdzenie
- **Arkusze** (`arkusz-slad.mjs`, 11 × side, z b78acbe6, `scratchpad/rec-forearm-r3`): cmp z r2 — 10 bajtowo równych, zmienił się tylko Behind-the-Back; obejrzany w pełnej rozdzielczości, u 0 i 1 powiększone.
- **W2 — naprawione.** Behind-the-Back (frameAt co 0,05): kąt łokcia 22,3° → 21,0°, łokieć przesuwa się ≤ 0,33 cm, błąd chwytu ≤ 0,033 cm; ramię i przedramię nieruchome, rusza się tylko dłoń.
- **W1 zachowane.** palm x = −0,97 (dłoń do tyłu); sztanga 8,5 cm w tył i 2,4 cm w górę; odstęp od ciała 4,0 → 12,2 cm (bez przenikania); zakres nadgarstka −30° → +50°. Łokieć stale zgięty ok. 21–22° — mieści się w części wspólnej źródeł („elbows slightly bent” / „arms straight”).
- **Skróty** (`--skroty`, sam): v2.forearm `72e5f9d98b29` → `4f6519625eed`; pozostałe linie bez zmian względem 4fa83a0c. Zestawy: `8b1a50266007` ×7, `8f9b3d083294`, `88e974d922c7` — bez zmian. `liczba` = 13.
- **K14** (`git diff 4fa83a0c..b78acbe6 -- tests/`): `figury-forearm-ruch` dostał 4 testy W2 (zmiana kąta łokcia ≤ 5° liczona z wektora łokieć → nadgarstek, przesunięcie łokcia ≤ 2 cm, błąd chwytu ≤ 0,1 cm, zakres ≥ 50°) — zaostrzenie, progi z r2. W `figury-v2-zlote.json` zmienił się jeden wpis (`forearm/Behind-the-Back Barbell Wrist Curl`). Testy figury-forearm-ruch, nakladka-forearm, zgodnosc-wsteczna, generator-odtwarza: 674/674 przechodzą.
- **Zestawy (K12):** 9 × „wyswietlana”; Behind-the-Back — wr.range pasuje (nadgarstek unosi sztangę w górę i do tyłu, ramię nieruchome).

## Backlog (bez zmian od r2; wersję nadaje koordynator)
- FA-S1 ŚREDNIE — Reverse Plate Curls: talerz zawsze pionowy (`draw.ts:476`), przedramię obraca się o 104°.
- FA-S3 ŚREDNIE — Dumbbell Lying Pronation / Supination rysowane na siedząco; obie są tą samą pętlą.
- FA-N1 NISKIE — 7 uginań: łokieć w 3D obok uda (z 30,8 vs 8,5–13,8).
- FA-N2 NISKIE — poza błędu wr.mis.lift: łokieć opada 3,5 cm.
- FA-N3 NISKIE — Behind-the-Back: 2,4 cm w górę vs 8,5 cm w tył (źródło: „up and slightly back”).
