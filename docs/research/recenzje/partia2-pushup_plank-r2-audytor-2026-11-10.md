# Recenzja niezależna r2 — rodzina v2 `pushup_plank` (partia 2, linia 1.1), 10.11.2026

Recenzent: audytor (sesja r2; bramka 4, L-047, L-050; nie pisał rodziny ani poprawek W1–W3). Stan: `figury/partia-2-pushup_plank` @ 355e8d2c (poprawki d9f1bc22 względem r1 8e3be484), worktree odłączony.
Arkusze śladu wygenerowane samodzielnie (`arkusz-slad.mjs`, 36 arkuszy = 18 ćwiczeń × side/front, kadry co 0,05) w stanie r2 i — do porównania `cmp` — w stanie r1 (8e3be484). Liczby z `frameAt` / `jointAngles` co 0,01 (niektóre co 0,025).
Skrót v2 (`zrodla-runtime.mjs --skroty`, ten worktree): `def6b97fe124`. K9: `assignAll()` = 30 (18 z rysunkiem, 12 bez — jak w r1). Walidator: 18 × OK.

**Werdykt rodziny: wyswietlana** (0 × KRYTYCZNE/WYSOKIE).

## (1) Poprawki W1–W3 — pomiar

| ID r1 | Stan | Miara (po / przed) |
|---|---|---|
| W1 | usunięte | Kolano nogi prostej, max w ruchu (u co 0,01, obie nogi): Push Up 0 / 19,2°, Wide 3,8 / 19,9°, Close-Grip 0 / 19,3°, Diamond 3,7 / 19,8°, Decline 0 / 19,0°, Incline 4,4 / 20,0°, Incline Close-Grip 3,4 / 20,2°, Single-Arm 0 / 17,9°, Plank 0 / 17,3°, Taps 0 / 17,7°, Plyo 4,1 / 30,8°, Suspended Push-Up 4,6 / 20,5°, Fallout 0 / 18,0°, Inverted Row 0 / 18,2°, Standing Barbell Rollout 5,5 / 21,3° (R2-N1). Mountain Climbers: noga prosta 0° w u = 0 (L) i u = 1 (R), druga 138°. Rollouty z klęku bez zmian (103°, celowo). |
| W2 | usunięte | Plyo Push-Up: dłonie 0,0 cm nad podłogą do u = 0,70 (zgięcie łokcia 141,8° → 20,6°), lot u 0,71–0,99 przy łokciu 12–19° (szczyt 12 cm w u = 0,85), u = 1 = poza startowa (miednica 48,6 cm, łokieć 12,5°) — lądowanie, koniec pętli na podłodze. |
| W3 | usunięte | Plank Shoulder Taps: min(wysokość prawej, lewej dłoni) = 0,0 cm w każdym u co 0,025; dotyk prawą w u = 0, obie na podłodze w u = 0,5, dotyk lewą w u = 1 (wahadło). |

Znane ryzyka z briefu: **Plyo krótki lot** — nie: lot zajmuje 30% pętli 1,5 s (dłonie > 3 cm w u 0,76–0,94), przyjęte. **Single-Arm stopy 28 cm** (z = 16 / −12; w r1 38 cm) — równo na progu konwencji `podstawaMinCm` 28, szerzej niż biodra (17 cm), środek ciężkości nad osią dłoni (z = 2), karta i zestaw nie podają szerokości — przyjęte. **Sag zsuwa stopy** — wiersze błędu `plank.mis.sag` przesuwają kostki o 1,1–2,0 cm ku dłoniom, palce zostają na podłodze (0,3 cm), miednica opada 7,7–9,6 cm — przyjęte (widoczny błąd, bez oderwania stóp).

## Znaleziska

| ID | Klasa | Pewność | Znalezisko i miara | Kroki / realność | Poprawka (test odtwarzający) |
|---|---|---|---|---|---|
| R2-N1 | NISKIE | 95% | Standing Barbell Rollout: kolano 5,5° w u = 0,07 (między punktami testu W1 co 0,05; w u 0,05 i 0,10 ≤ 5°). Przekroczenie 0,5° — niewidoczne. | Karta → bok, początek ruchu. Realny, bez skutku wizualnego. | Backlog: test W1 co 0,01 albo gęstsze klatki w u 0–0,14. |

Ś1 (Inverted Row: głowa 0,4 cm nad podłogą, miednica 9,5 cm w u = 0; r1: −0,2 / 9,2) i Ś2 (Barbell Rollout from Bench) — bez zmian, w backlogu docs/21 (PP-S1, PP-S2).

## (2) Arkusze i regresja
`cmp` arkuszy r2 z arkuszami stanu r1: 32 różne (oczekiwane — DL 83,2, Plyo, Taps, Single-Arm, Standing Rollout, Decline `pod`), 4 identyczne bajtowo: Rollout (sztanga) side/front, Barbell Rollout from Bench side/front (poprawki nie miały ich dotyczyć — brak regresji). Obejrzane w pełnej rozdzielczości: Push Up, Mountain Climbers, Plyo Push-Up, Plank Shoulder Taps (side, front), Single-Arm (front), Standing Barbell Rollout, Inverted Row — ślad miednicy/gryfu ciągły, bez skoków; Plyo zamyka pętlę w punkcie startu; MC kolano nogi zgiętej ≥ 11,6 cm nad podłogą (jak r1). Wpis `tests/tor-wyjatki.json` Plyo Push-Up|side zgodny z pomiarem (x miednicy 78,2 / 83,2 / 78,4 / 75,2 / 78,2 cm wobec opisu 78,2 / 83 / 78 / 75,6 / 78,2).

## (3) K14 — `git diff 8e3be484..355e8d2c -- tests/`
Bez nieuzasadnionych poluzowań. Nowy `figures-v2-pushup-plank-poprawki-r1.test.ts` — progi z karty i fizyki (≤ 5°, ≤ 1 cm, 20°); uruchomiony na danych sprzed poprawki: 20 z 22 przypadków oblewa (przypadek negatywny działa), na r2: zielony. Odciski złote: zmienione tylko 16 póz pushup_plank (bez rolloutów z klęku) — zgodnie z opisem w `figures-v2-zgodnosc-wsteczna`. `figury-jakosc`: trzy próbki negatywne przestrojone (axOverride 94 → 96, kostki 25 cm ku dłoniom, osłabienie całego wiersza sag) — nadal są błędem, testy zielone (780/780 razem z kierunek-u, mobilność, zgodność wsteczna). `figury-mobilnosc-reguly` ISOMETRIC 17 → 18 (Plank) — zgodne z danymi. `tor-wyjatki` — ponowny pomiar zgodnie z r1 (sprawdzony wyżej). `figures-v2-tor` i `figury-generator-odtwarza` zielone (224/224).

## (4)–(5) Skróty, nakładka, zestawy, karty
Skrót rodziny `def6b97fe124` (r1: `c8c7d12c606c`). Nakładka (`lib/figures/v2/overlay`), `cue-sets.json`, karty (`lib/cues`, `data/`) — bez zmian od r1 (pusty diff, skróty zestawów i kart identyczne z r1) — **werdykty przeniesione z r1** (oznaczone w JSON). Karty Push Up, Plank, Mountain Climbers: sprzeczność „nogi wyprostowane / ciało proste” z rysunkiem usunięta (W1). K10: v1 → `zastapiona`: Push Up, Incline Push Up, Plank, Mountain Climbers. Pozostałe 6 kart własnych ma już wpisy z aktualnym skrótem w `figury-recenzja.json` (bez zmian).
