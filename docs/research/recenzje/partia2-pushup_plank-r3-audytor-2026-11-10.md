# Recenzja niezależna r3 — rodzina v2 `pushup_plank` (partia 2, linia 1.1), 10.11.2026

Recenzent: audytor (sesja r3; bramka 4, L-047, L-050; nie pisał rodziny, kart, zestawów ani poprawek r1/r3). Stan: `figury/partia-2` @ 816a480c (poprawka wierszy błędu `plank.mis.sag`), baza 6d6660a1; oba worktree odłączone.
Skrót v2 (`zrodla-runtime.mjs --skroty`, worktree 816a480c): `ec660bfe52fa` (r2: `def6b97fe124`). K9: `assignAll()` → pushup_plank = 30.

**Werdykt rodziny: wyswietlana** (0 × KRYTYCZNE/WYSOKIE; brak nowych znalezisk).

## (1) Zakres zmiany
- Porównanie strukturalne `poses/pushup_plank.json`: zmienione tylko `bledy[plank.mis.sag]` (pola `klatki`, w 6 ćwiczeniach też `dotyczy` bez `knee`) w Push-Up Wide, Single-Arm Push-Up, Plank, Plank Shoulder Taps, Plyo Push-Up, Suspended Fallout, Standing Barbell Rollout. Pozy poprawne 18/18 identyczne; inne wiersze błędu bez zmian.
- Arkusze `arkusz-slad.mjs` 7 ćwiczeń × side/front (14) w 816a480c i 6d6660a1 — identyczne bajtowo (`cmp`).
- `lib/figures/data.json`: pushup_plank wypadł z listy `v2` (skrót ≠ wpis r2) — rodzina wraca po przepisaniu wpisu r3; pokrycie katalogu 292 → 274 z tego samego powodu.

## (2) Pomiar wiersza błędu (keyframeFrame co 0,01; przed → po)
| Ćwiczenie | Miednica pod linią bark–kostka (cm) | Kąt opadnięcia biodra (°) | Kostka max (cm) | Kolano w błędzie (°) |
|---|---|---|---|---|
| Push-Up Wide | 7,6–7,8 → 7,1–7,6 | 14,1–14,4 → 13,1–13,9 | 1,40 → 0,95 | 11,6 → 3,9 (= poprawna) |
| Single-Arm Push-Up | 7,6–7,8 → 7,2–7,4 | 14,1–14,3 → 13,3–13,7 | 1,28 → 0,94 | 9,3 → 1,7 |
| Plank | 9,5 → 7,6 | 17,5 → 14,0 | 1,64 → 0,86 | 7,6 → 0 |
| Plank Shoulder Taps | 9,3 → 7,1 | 17,1 → 13,1 | 1,73 → 0,92 | 8,1 → 0 |
| Plyo Push-Up | 9,2–9,6 → 7,1–7,5 | 17,0–17,7 → 13,0–13,8 | 1,90 → 0,92 | 13,3 → 7,3 (poprawna 4,1; niewidoczne) |
| Suspended Fallout | 8,1–8,5 → 6,5–7,4 | 15,0–15,7 → 11,9–13,6 | 2,01 → 0,96 | 8,8 → 0 |
| Standing Barbell Rollout | u = 1: 8,6 → 7,3 | u = 1: 15,8 → 13,5 | 1,36 → 0,95 | 12,9 → 5,5 (= poprawna) |

Pozy poprawne: miednica na linii (|odchylenie| ≤ 0,04 cm). Błąd nadal czytelny: arkusze błędu (`arkusz-nakladka.mjs`, 30 PNG) — Push-Up Wide side data-1, Suspended Fallout side data-0, Standing Barbell Rollout side data-0 obejrzane w pełnej rozdzielczości: miednica wyraźnie pod linią `pushupBodyLine`, stopy w miejscu. Zgodny z tekstem „Opadające biodra i wygięte w łuk lędźwie” (zestaw/karta). Progi `v2-jakosc` (≥ 4 cm, ≥ 8°) spełnione. Standing Barbell Rollout: lędźwie −20° do u = 0,4, potem −20·√(1−w); w u = 0,75 miednica 3,7 cm poniżej pozy poprawnej plus łuk lędźwi — błąd widoczny w całym ruchu (arkusz: łuk od u = 0).

## (3) K14 — testy (6d6660a1 wobec rodzica i 816a480c)
Bez nieuzasadnionych poluzowań. Odciski złote: zmienione dokładnie 7 póz z listy (opis w `figures-v2-zgodnosc-wsteczna`). `nakladka-fix4`: +Standing Barbell Rollout, Suspended Fallout bez elementu (reguła „analogia”, nie ustalona — zgodne z zasadą nakładki). `nakladka-pushup-plank` WANT: elementy po wpisie recenzji zestawów r2 — zaostrzenie oczekiwań. `figury-podparcie`: dopuszcza werdykt v1 „zastapiona”, warunek recenzent ≠ autor zostaje. `gemini-polecenia`: 25 rodzin — licznik. Uruchomione (`--runInBand`): figury-p2-r3, pushup-plank-poprawki-r1, zgodnosc-wsteczna, nakladka-pushup-plank, figury-jakosc — 1389/1389.

## (4) Zestawy, karty, nakładka
Bez zmian w 816a480c (pusty diff `cue-sets.json`, `lib/cues`, `overlay`) — werdykty r2 obowiązują, w JSON r3 tylko wpis v2. R2-N1 (NISKIE) i Ś1/Ś2 (PP-S1, PP-S2) — bez zmian, backlog.
