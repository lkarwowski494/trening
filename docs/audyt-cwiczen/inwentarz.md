# Inwentarz ćwiczeń i figur — stan `integracja-1-1` @ 46a8f1cc (audyt 31.10.2026)

Źródło liczb: skrypt audytora na module aplikacji (ładowanie TS jak `scripts/strona/ts-loader.mjs`): `lib/seed.ts` (LIB), `lib/figures/v2/families.ts` (familyOf, status), `lib/figures/v2/figure.ts` (figureSpec/shownFigureSpec), `lib/figures/v2/cueSets.ts` (cueSelection), `lib/cues/data.json`, `lib/figures/data.json`, skróty `node scripts/zrodla-runtime.mjs --skroty` wobec `docs/research/figury-recenzja.json`. Teksty: `lib/cues/text/<język>.json` (es-419 i pt-BR jako nakładki na es/pt — jak `lib/cues/index.ts:47`).

## Liczby

- Ćwiczenia w katalogu biblioteki: **709**; rodziny figur v2: **43** (4 `ready`: squat, bench_press, hinge, pull_up; 39 `planned`).
- Ćwiczenia w 4 rodzinach `ready`: **100**, z figurą v2 w silniku: **98** (squat 25, bench_press 30, hinge 32, pull_up 11; Muscle Up i Rope Climb z rodziny pull_up bez wpisu w `poses/pull_up.json` → bez figury).
- Figury v2 pokazywane dziś w 1.1: **0** — `lib/figures/data.json` ma `v2: []`: skróty rodzin (rig/plik póz + pliki wspólne `V2_WSPOLNE`) nie pasują do wpisów recenzji (squat d2d946b53cf5 → 2995928b0ddf, bench_press 0bb8fc229bf7 → cd6e3751e4d5, hinge e9af1b06ec31 → 3fb8aebb32e3); pull_up nie ma wpisu v2 w ogóle. Wpisy recenzji pasują dokładnie do stanu `wersja-1-0-1-r2` e796c7ed (pomiar audytora: skróty przeliczone z tego commitu).
- Pliki póz z danymi dla rodzin `planned`: 36 plików, 449 wpisów (w tym pull_up 11); aplikacja ładuje tylko `pull_up` (`lib/figures/v2/poseData.ts:14`), więc rodziny `planned` nie mają figury w 1.1.
- Figury v1 wyświetlane (1.1): **67** (`lib/figures/data.json` exercises), w tym 15 „zastąpionych” przez v2 (`replaced`) — przy ukrytej rodzinie v2 te karty są bez rysunku (`figureWithheld`).
- Wskazówki: tryb karty własnej (own) **102**, zestaw ogólny (general) **538**, brak (none) **69**. Karty własne pokazywane: **97** (5 ukrytych: Bent Over Row ×2, T-Bar Row, Skullcrusher (EZ) — wpis v1 nieaktualny; Hack Squat — werdykt „do poprawy”). Zestawy ogólne z aktualną recenzją treści: **71** z 538 (70 w squat/bench_press/hinge + 1 w mobility_stand); pozostałe **467** bez recenzji. Zestaw ogólny pokazuje się tylko przy pokazywanej figurze v2, więc dziś w 1.1: **0**.
- Komplet tekstów wskazówek w 35 językach: **425** ćwiczeń; **214** ćwiczeń (wszystkie w trybie general, rodziny `planned` + 1 pull_up) ma teksty tylko PL/EN (52 id zdań bez przekładu na 33 języki — aplikacja pokaże angielski, `lib/cues/index.ts:55`); 70 bez wskazówek (none/open).
- Eksport strony (`node scripts/strona/eksport.mjs --langs pl,en`, uruchomiony przez audytora): 709 ćwiczeń, **0 figur**, karty: own 97, general 0, none 612.
- 1.0 (`main`): squat, bench_press, hinge pokazywane jako v2 (rig, wpisy recenzji z 27–28.10), pull_up `planned`; kart własnych 101, zestawów ogólnych 70, figur v1 68.

## Rodziny

| Rodzina | Status | Ćwiczeń | Z danymi/figurą v2 | Karta własna | Zestaw ogólny | Zestaw z recenzją | Brak wskazówek | Tylko PL/EN |
|---|---|---|---|---|---|---|---|---|
| hinge | ready | 32 | 32 | 7 | 25 | 25 | 0 | 0 |
| bench_press | ready | 30 | 30 | 5 | 25 | 25 | 0 | 0 |
| squat | ready | 25 | 25 | 5 | 20 | 20 | 0 | 0 |
| pull_up | ready | 13 | 11 | 3 | 8 | 0 | 2 | 1 |
| core_floor | planned | 44 | 21 | 4 | 32 | 0 | 8 | 7 |
| delt_raise | planned | 38 | 30 | 5 | 29 | 0 | 4 | 9 |
| curl | planned | 36 | 36 | 6 | 30 | 0 | 0 | 0 |
| mobility_stand | planned | 36 | 8 | 0 | 36 | 1 | 0 | 35 |
| triceps | planned | 32 | 29 | 4 | 25 | 0 | 3 | 3 |
| pushup_plank | planned | 30 | 17 | 7 | 23 | 0 | 0 | 5 |
| plyo | planned | 28 | 27 | 1 | 26 | 0 | 1 | 26 |
| olympic | planned | 25 | 23 | 0 | 23 | 0 | 2 | 18 |
| lunge | planned | 24 | 24 | 6 | 18 | 0 | 0 | 1 |
| overhead_press | planned | 23 | 21 | 5 | 16 | 0 | 2 | 12 |
| mobility_floor | planned | 22 | 9 | 0 | 21 | 0 | 1 | 21 |
| chest_fly | planned | 20 | 17 | 2 | 15 | 0 | 3 | 4 |
| core_standing | planned | 19 | 16 | 2 | 13 | 0 | 4 | 7 |
| sled_throw | planned | 19 | 8 | 1 | 9 | 0 | 9 | 7 |
| kb_ballistic | planned | 17 | 16 | 1 | 15 | 0 | 1 | 11 |
| cardio | planned | 16 | 0 | 5 | 8 | 0 | 3 | 4 |
| leg_isolation | planned | 14 | 8 | 4 | 8 | 0 | 2 | 0 |
| row | planned | 13 | 12 | 6 | 7 | 0 | 0 | 0 |
| calf_raise | planned | 13 | 12 | 3 | 9 | 0 | 1 | 0 |
| forearm | planned | 13 | 11 | 0 | 9 | 0 | 4 | 8 |
| hip_bridge | planned | 11 | 10 | 3 | 7 | 0 | 1 | 0 |
| cable_row | planned | 10 | 9 | 3 | 6 | 0 | 1 | 0 |
| strongman | planned | 10 | 1 | 0 | 2 | 0 | 8 | 0 |
| foam_roll | planned | 10 | 0 | 0 | 10 | 0 | 0 | 10 |
| pulldown | planned | 8 | 8 | 2 | 6 | 0 | 0 | 0 |
| shrug | planned | 8 | 8 | 2 | 6 | 0 | 0 | 0 |
| leg_machine | planned | 8 | 6 | 3 | 5 | 0 | 0 | 0 |
| hip_abd_add | planned | 8 | 6 | 0 | 7 | 0 | 1 | 7 |
| rotator_cuff | planned | 8 | 7 | 0 | 7 | 0 | 1 | 5 |
| glute_floor | planned | 7 | 7 | 0 | 7 | 0 | 0 | 7 |
| carry | planned | 7 | 7 | 2 | 5 | 0 | 0 | 0 |
| chest_press_machine | planned | 5 | 5 | 2 | 3 | 0 | 0 | 1 |
| dip | planned | 5 | 5 | 1 | 4 | 0 | 0 | 0 |
| neck | planned | 5 | 0 | 0 | 0 | 0 | 5 | 0 |
| cable_press | planned | 4 | 4 | 1 | 3 | 0 | 0 | 0 |
| back_extension | planned | 4 | 3 | 1 | 3 | 0 | 0 | 1 |
| core_hang | planned | 4 | 3 | 0 | 3 | 0 | 1 | 3 |
| thruster | planned | 3 | 3 | 0 | 3 | 0 | 0 | 1 |
| kneeling_hinge | planned | 2 | 1 | 0 | 1 | 0 | 1 | 0 |

## Ćwiczenia (709)

Kolumny: rodzina; status; figura (v2 = figura z rigu/danych w silniku, dane = wpis w pliku póz rodziny `planned`, v1 = figura v1 wyświetlana, — = brak); wskazówki (own/general/none; „pokaz.” = trafia do aplikacji dziś); recenzja treści (karta: wpis „karty” albo v1, zestaw: wpis „zestawy”; „aktualny” = skrót zgodny); języki z kompletem tekstów (35 = pełny); strona (figura eksportowana: dziś nigdzie).

| Ćwiczenie | Rodzina | Status | Figura | Wskazówki | Recenzja treści | Języki |
|---|---|---|---|---|---|---|
| Back Extension | back_extension | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Lower Back Curl | back_extension | planned | dane | general (cobra) | — | 2 (PL/EN) |
| Reverse Hyperextension | back_extension | planned | dane | general (hipExt) | — | 35 |
| Weighted Ball Hyperextension | back_extension | planned | — | general (backExt) | — | 35 |
| Band Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Barbell Guillotine Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Bench Press (hantle) | bench_press | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Bench Press (sztanga) | bench_press | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Bench Press with Chains | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Board Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Chain Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Close Grip Bench Press | bench_press | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Close-Grip Dumbbell Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Close-Grip EZ-Bar Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Decline Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Decline Bench Press (hantle) | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Decline Close-Grip Bench To Skull Crusher | bench_press | ready | v2 | general (triLying) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Floor Press (hantle) | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Floor Press (sztanga) | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Floor Press with Chains | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Incline Bench Press (hantle) | bench_press | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Incline Bench Press (sztanga) | bench_press | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| JM Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| One Arm Dumbbell Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| One-Arm Kettlebell Floor Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Pin Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Band Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Grip Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Close-Grip Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Decline Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Incline Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Squeeze Press (hantle) | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Wide-Grip Barbell Bench Press | bench_press | ready | v2 | general (bench) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Incline Cable Chest Press | cable_press | planned | dane | general (bench) | — | 35 |
| Seated Cable Chest Press | cable_press | planned | dane | general (machinePress) | — | 35 |
| Single Arm Cable Chest Press | cable_press | planned | dane | general (cablePress) | — | 35 |
| Wyciskanie na linkach (stojąc) | cable_press | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Cable Rope Rear-Delt Rows | cable_row | planned | dane | general (faceRow) | — | 35 |
| Face Pull | cable_row | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Kneeling High Pulley Row | cable_row | planned | dane | general (row) | — | 35 |
| Leverage High Row | cable_row | planned | dane | general (row) | — | 35 |
| Machine Row | cable_row | planned | dane | general (row) | — | 35 |
| Seated Cable Row | cable_row | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Single Arm Cable Row | cable_row | planned | dane | general (row) | — | 35 |
| Sled Row | cable_row | planned | — | none | — | — |
| Standing Cable Row | cable_row | planned | dane | general (row) | — | 35 |
| Wiosłowanie na linkach (siedząc) | cable_row | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Band Calf Raise | calf_raise | planned | dane | general (calf) | — | 35 |
| Barbell Seated Calf Raise | calf_raise | planned | dane | general (calf) | — | 35 |
| Calf Raise (linki) | calf_raise | planned | dane | general (calf) | — | 35 |
| Calf Raise (sztanga) | calf_raise | planned | dane | general (calf) | — | 35 |
| Donkey Calf Raise | calf_raise | planned | dane | general (calf) | — | 35 |
| Dumbbell Seated One-Leg Calf Raise | calf_raise | planned | dane | general (calf) | — | 35 |
| Łydki na stopniu | calf_raise | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Seated Calf Raise | calf_raise | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Seated Calf Raise (hantle) | calf_raise | planned | dane | general (calf) | — | 35 |
| Single Leg Calf Raise | calf_raise | planned | dane | general (calf) | — | 35 |
| Smith Machine Calf Raise | calf_raise | planned | dane | general (calf) | — | 35 |
| Smith Machine Reverse Calf Raise | calf_raise | planned | — | none | — | — |
| Standing Calf Raise | calf_raise | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-29 aktualny | 35 |
| Assault Bike | cardio | planned | — | general (bike) | — | 35 |
| Battle Ropes | cardio | planned | — | none | — | — |
| Bieg | cardio | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Burpees | cardio | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Carioca Quick Step | cardio | planned | — | none | — | — |
| Fast Skipping | cardio | planned | — | general (jump) | — | 2 (PL/EN) |
| High Knees | cardio | planned | — | general (jump) | — | 2 (PL/EN) |
| Incline Walk (bieżnia) | cardio | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Jumping Jacks | cardio | planned | — | general (jump) | — | 2 (PL/EN) |
| Orbitrek | cardio | planned | — | general (cardioMachine) | — | 35 |
| Rower | cardio | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Rowing Machine | cardio | planned | v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Skakanka | cardio | planned | — | general (jump) | — | 2 (PL/EN) |
| Ski Erg | cardio | planned | — | none | — | — |
| Stair Climber | cardio | planned | — | general (cardioMachine) | — | 35 |
| Treadmill Walking | cardio | planned | — | general (cardioMachine) | — | 35 |
| Double Kettlebell Front Rack Carry | carry | planned | dane | general (carry) | — | 35 |
| Farmer's Walk | carry | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Farmer's Walk (Farmers Handles) | carry | planned | dane | general (carry) | — | 35 |
| Farmer's Walk (trap bar) | carry | planned | dane | general (carry) | — | 35 |
| Overhead Carry (hantle) | carry | planned | dane | general (carry) | — | 35 |
| Rickshaw Carry | carry | planned | dane | general (carry) | — | 35 |
| Suitcase Carry | carry | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Around The Worlds | chest_fly | planned | — | none | — | — |
| Band Chest Fly | chest_fly | planned | dane | general (fly) | — | 35 |
| Bent-Arm Barbell Pullover | chest_fly | planned | dane | general (pullover) | — | 2 (PL/EN) |
| Cable Fly | chest_fly | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Cable Fly (high to low) | chest_fly | planned | dane | general (fly) | — | 35 |
| Cable Fly (low to high) | chest_fly | planned | dane | general (fly) | — | 35 |
| Chest Fly (hantle) | chest_fly | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Crucifix | chest_fly | planned | dane | general (raiseSide) | — | 35 |
| Decline Dumbbell Fly | chest_fly | planned | dane | general (fly) | — | 35 |
| Flat Bench Cable Fly | chest_fly | planned | dane | general (fly) | — | 35 |
| Front Raise And Pullover | chest_fly | planned | dane | general (pullover) | — | 2 (PL/EN) |
| Incline Cable Fly | chest_fly | planned | dane | general (fly) | — | 35 |
| Incline Chest Fly (hantle) | chest_fly | planned | dane | general (fly) | — | 35 |
| Machine Pullover | chest_fly | planned | — | none | — | — |
| One-Arm Flat Bench Dumbbell Fly | chest_fly | planned | dane | general (fly) | — | 35 |
| Pec Deck | chest_fly | planned | dane | general (fly) | — | 35 |
| Pullover (hantel) | chest_fly | planned | dane | general (pullover) | — | 2 (PL/EN) |
| Single Arm Cable Fly | chest_fly | planned | dane | general (fly) | — | 35 |
| Svend Press | chest_fly | planned | — | none | — | — |
| Wide-Grip Decline Barbell Pullover | chest_fly | planned | dane | general (pullover) | — | 2 (PL/EN) |
| Leverage Decline Chest Press | chest_press_machine | planned | dane | general (machinePress) | — | 35 |
| Leverage Incline Chest Press | chest_press_machine | planned | dane | general (machinePress) | — | 35 |
| Machine Chest Press | chest_press_machine | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Machine Shoulder Press | chest_press_machine | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Shoulder Press | chest_press_machine | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Alternate Heel Touchers | core_floor | planned | dane | general (crunch) | — | 35 |
| Bicycle Crunch | core_floor | planned | dane | general (crunch) | — | 35 |
| Bird Dog | core_floor | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Butt-Ups | core_floor | planned | — | none | — | — |
| Cable Crunch | core_floor | planned | — | general (cableCrunch) | — | 2 (PL/EN) |
| Cable Reverse Crunch | core_floor | planned | — | general (legRaiseFloor) | — | 35 |
| Cable Seated Crunch | core_floor | planned | — | general (cableCrunch) | — | 2 (PL/EN) |
| Cocoons | core_floor | planned | dane | none | — | — |
| Cross-Body Crunch | core_floor | planned | dane | general (crunch) | — | 35 |
| Crunch | core_floor | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Crunch - Hands Overhead | core_floor | planned | dane | general (crunch) | — | 35 |
| Crunch - Legs On Exercise Ball | core_floor | planned | — | general (crunch) | — | 35 |
| Dead Bug | core_floor | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Decline Crunch | core_floor | planned | — | general (crunch) | — | 35 |
| Decline Oblique Crunch | core_floor | planned | — | general (crunch) | — | 35 |
| Decline Reverse Crunch | core_floor | planned | — | general (legRaiseFloor) | — | 35 |
| Dragon Flag | core_floor | planned | — | none | — | — |
| Frog Sit-Ups | core_floor | planned | dane | general (crunch) | — | 35 |
| GHD Sit Up | core_floor | planned | — | none | — | — |
| Hollow Hold | core_floor | planned | dane | general (plank) | — | 35 |
| Janda Sit-Up | core_floor | planned | dane | general (crunch) | — | 35 |
| Kneeling Cable Crunch With Alternating Oblique Twists | core_floor | planned | — | general (cableCrunch) | — | 2 (PL/EN) |
| Leg Pull-In | core_floor | planned | dane | general (legRaiseFloor) | — | 35 |
| Lying Leg Raise | core_floor | planned | dane | general (legRaiseFloor) | — | 35 |
| Machine Crunch | core_floor | planned | — | general (cableCrunch) | — | 2 (PL/EN) |
| Oblique Crunches - On The Floor | core_floor | planned | dane | general (crunch) | — | 35 |
| Otis-Up | core_floor | planned | — | general (crunch) | — | 35 |
| Press Sit-Up | core_floor | planned | — | none | — | — |
| Reverse Crunch | core_floor | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Scissor Kick | core_floor | planned | dane | general (legRaiseFloor) | — | 35 |
| Seated Flat Bench Leg Pull-In | core_floor | planned | — | general (legRaiseFloor) | — | 35 |
| Side Jackknife | core_floor | planned | — | none | — | — |
| Sit Up | core_floor | planned | dane | general (crunch) | — | 35 |
| Smith Machine Hip Raise | core_floor | planned | — | none | — | — |
| Stability Ball Crunch | core_floor | planned | — | general (crunch) | — | 35 |
| Stability Ball Knee Tuck | core_floor | planned | — | general (plank) | — | 35 |
| Standing Rope Crunch | core_floor | planned | — | general (cableCrunch) | — | 2 (PL/EN) |
| Stomach Vacuum | core_floor | planned | — | none | — | — |
| Superman | core_floor | planned | dane | general (cobra) | — | 2 (PL/EN) |
| Suspended Reverse Crunch | core_floor | planned | — | general (plank) | — | 35 |
| Toe Touchers | core_floor | planned | dane | general (crunch) | — | 35 |
| Tuck Crunch | core_floor | planned | dane | general (crunch) | — | 35 |
| V-Up | core_floor | planned | dane | general (vup) | — | 2 (PL/EN) |
| Weighted Sit-Ups - With Bands | core_floor | planned | — | general (crunch) | — | 35 |
| Hanging Knee Raise | core_hang | planned | dane | general (hanging) | — | 2 (PL/EN) |
| Hanging Leg Raise | core_hang | planned | dane | general (hanging) | — | 2 (PL/EN) |
| L-Sit | core_hang | planned | — | none | — | — |
| Toes to Bar | core_hang | planned | dane | general (hanging) | — | 2 (PL/EN) |
| Barbell Side Bend | core_standing | planned | dane | general (sideBend) | — | 2 (PL/EN) |
| Bent Press | core_standing | planned | dane | general (windmill) | — | 2 (PL/EN) |
| Bosu Ball Cable Crunch With Side Bends | core_standing | planned | dane | none | — | — |
| Cable Judo Flip | core_standing | planned | dane | general (rotation) | — | 35 |
| Cable Russian Twists | core_standing | planned | dane | general (rotation) | — | 35 |
| Cable Woodchop | core_standing | planned | dane | general (rotation) | — | 2 (PL/EN) |
| Double Kettlebell Windmill | core_standing | planned | dane | general (windmill) | — | 2 (PL/EN) |
| Kettlebell Figure 8 | core_standing | planned | — | none | — | — |
| Kettlebell Windmill | core_standing | planned | dane | general (windmill) | — | 2 (PL/EN) |
| Landmine Rotation | core_standing | planned | dane | general (rotation) | — | 35 |
| Medicine Ball Full Twist | core_standing | planned | dane | general (rotation) | — | 35 |
| One-Arm High-Pulley Cable Side Bends | core_standing | planned | dane | general (sideBend) | — | 2 (PL/EN) |
| Pallof Press | core_standing | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Pallof Press With Rotation | core_standing | planned | dane | general (rotation) | — | 35 |
| Russian Twist | core_standing | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Seated Barbell Twist | core_standing | planned | — | general (rotation) | — | 35 |
| Side Bend (hantel) | core_standing | planned | dane | none | — | — |
| Spell Caster | core_standing | planned | — | none | — | — |
| Weighted Ball Side Bend | core_standing | planned | dane | general (sideBend) | — | 2 (PL/EN) |
| Barbell Curl | curl | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Barbell Preacher Curl | curl | planned | dane | general (curl) | — | 35 |
| Bayesian Curl | curl | planned | dane | general (curl) | — | 35 |
| Biceps Curl (hantle) | curl | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Cable Curl | curl | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Cable Curl (dwie linki) | curl | planned | dane | general (curl) | — | 35 |
| Cable Preacher Curl | curl | planned | dane | general (curl) | — | 35 |
| Concentration Curl (hantle) | curl | planned | dane | general (curl) | — | 35 |
| Cross Body Hammer Curl | curl | planned | dane | general (curl) | — | 35 |
| Drag Curl | curl | planned | dane | general (curl) | — | 35 |
| EZ Bar Curl | curl | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Hammer Curl | curl | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Hammer Curl (linki) | curl | planned | dane | general (curl) | — | 35 |
| High Cable Curl | curl | planned | dane | general (curl) | — | 35 |
| Incline Curl (hantle) | curl | planned | dane | general (curl) | — | 35 |
| Incline Hammer Curl | curl | planned | dane | general (curl) | — | 35 |
| Lying Cable Curl | curl | planned | dane | general (curl) | — | 35 |
| Lying Close-Grip Bar Curl On High Pulley | curl | planned | dane | general (curl) | — | 35 |
| Lying Supine Dumbbell Curl | curl | planned | dane | general (curl) | — | 35 |
| Machine Biceps Curl | curl | planned | dane | general (curl) | — | 35 |
| One Arm Dumbbell Preacher Curl | curl | planned | dane | general (curl) | — | 35 |
| Preacher Curl | curl | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Preacher Curl (EZ) | curl | planned | dane | general (curl) | — | 35 |
| Preacher Hammer Dumbbell Curl | curl | planned | dane | general (curl) | — | 35 |
| Reverse Cable Curl | curl | planned | dane | general (curl) | — | 35 |
| Reverse Curl | curl | planned | dane | general (curl) | — | 35 |
| Reverse EZ-Bar Preacher Curl | curl | planned | dane | general (curl) | — | 35 |
| Seated Close-Grip Concentration Barbell Curl | curl | planned | dane | general (curl) | — | 35 |
| Spider Curl | curl | planned | dane | general (curl) | — | 35 |
| Spider Curl (sztanga) | curl | planned | dane | general (curl) | — | 35 |
| Standing Concentration Curl | curl | planned | dane | general (curl) | — | 35 |
| Standing Dumbbell Reverse Curl | curl | planned | dane | general (curl) | — | 35 |
| Standing Inner-Biceps Curl | curl | planned | dane | general (curl) | — | 35 |
| Standing One-Arm Cable Curl | curl | planned | dane | general (curl) | — | 35 |
| Zottman Curl | curl | planned | dane | general (curl) | — | 35 |
| Zottman Preacher Curl | curl | planned | dane | general (curl) | — | 35 |
| Alternating Deltoid Raise | delt_raise | planned | dane | general (raiseSide) | — | 35 |
| Band Lateral Raise | delt_raise | planned | dane | general (raiseSide) | — | 35 |
| Band Upright Row | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Barbell Front Raise to Overhead | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Barbell Incline Shoulder Raise | delt_raise | planned | — | none | — | — |
| Cable Front Raise | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Cable Lateral Raise | delt_raise | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Cable Reverse Fly | delt_raise | planned | dane | general (raiseRear) | — | 35 |
| Cable Seated Lateral Raise | delt_raise | planned | dane | general (raiseSide) | — | 35 |
| Cable Y Raise | delt_raise | planned | dane | general (raise) | — | 35 |
| Car Drivers | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Dumbbell Front Raise to Overhead | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Dumbbell Incline Shoulder Raise | delt_raise | planned | — | none | — | — |
| Dumbbell Lying One-Arm Rear Lateral Raise | delt_raise | planned | — | general (raiseRear) | — | 35 |
| Dumbbell One-Arm Upright Row | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Dumbbell Scaption | delt_raise | planned | dane | general (raiseSide) | — | 35 |
| Front Incline Dumbbell Raise | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Front Plate Raise | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Front Raise | delt_raise | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Kettlebell Halo | delt_raise | planned | — | general (halo) | — | 2 (PL/EN) |
| Kettlebell Halo with Overhead Extension | delt_raise | planned | — | general (halo) | — | 2 (PL/EN) |
| Lateral Raise (hantle) | delt_raise | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Machine Lateral Raise | delt_raise | planned | dane | general (raiseSide) | — | 35 |
| One-Arm Cable Rear Lateral Raise | delt_raise | planned | dane | general (raiseRear) | — | 35 |
| One-Arm Incline Lateral Raise | delt_raise | planned | — | general (raiseSide) | — | 35 |
| One-Arm Lateral Raise (hantel) | delt_raise | planned | dane | general (raiseSide) | — | 35 |
| Reverse Fly (hantle) | delt_raise | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Pec Deck | delt_raise | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Single Dumbbell Front Raise | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Sled Reverse Flye | delt_raise | planned | — | none | — | — |
| Smith Incline Shoulder Raise | delt_raise | planned | — | none | — | — |
| Smith Machine One-Arm Upright Row | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Smith Machine Upright Row | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Straight Raises on Incline Bench | delt_raise | planned | dane | general (raiseFront) | — | 35 |
| Upright Row (hantle) | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Upright Row (linki) | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Upright Row (sztanga) | delt_raise | planned | dane | general (uprightRow) | — | 2 (PL/EN) |
| Y Raise (hantle) | delt_raise | planned | dane | general (raise) | — | 35 |
| Chest Dip | dip | planned | dane | general (dip) | — | 35 |
| Dip Machine | dip | planned | dane | general (dip) | — | 35 |
| Ring Dips | dip | planned | dane | general (dip) | — | 35 |
| Triceps Dip | dip | planned | dane | general (dip) | — | 35 |
| Triceps Dips (ławka) | dip | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Adductor-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Calves-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Foam Roll: Hamstrings | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Foam Roll: Quadriceps | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Foot-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Iliotibial Tract-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Latissimus Dorsi-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Peroneals-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Piriformis-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Rhomboids-SMR | foam_roll | planned | — | general (smr) | — | 2 (PL/EN) |
| Barbell Reverse Wrist Curl | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Barbell Wrist Curl | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Behind-the-Back Barbell Wrist Curl | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Cable Wrist Curl | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Dumbbell Lying Pronation | forearm | planned | dane | none | — | — |
| Dumbbell Lying Supination | forearm | planned | dane | none | — | — |
| One-Arm Dumbbell Reverse Wrist Curl | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| One-Arm Dumbbell Wrist Curl | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Plate Pinch | forearm | planned | — | none | — | — |
| Reverse Plate Curls | forearm | planned | dane | general (curl) | — | 35 |
| Reverse Wrist Curl (hantle) | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Wrist Curl (hantle) | forearm | planned | dane | general (wrist) | — | 2 (PL/EN) |
| Wrist Roller | forearm | planned | — | none | — | — |
| Cable Kickback | glute_floor | planned | dane | general (hipExt) | — | 2 (PL/EN) |
| Clamshell | glute_floor | planned | dane | general (hipAbd) | — | 2 (PL/EN) |
| Donkey Kick | glute_floor | planned | dane | general (hipExt) | — | 2 (PL/EN) |
| Fire Hydrant | glute_floor | planned | dane | general (hipAbd) | — | 2 (PL/EN) |
| Hip Extension with Bands | glute_floor | planned | dane | general (hipExt) | — | 2 (PL/EN) |
| Machine Glute Kickback | glute_floor | planned | dane | general (hipExt) | — | 2 (PL/EN) |
| Prone Flutter Kicks | glute_floor | planned | dane | general (hipExt) | — | 2 (PL/EN) |
| Axle Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Band Good Morning | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Cable Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Cable Pull Through | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Clean Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Deadlift (hantle) | hinge | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Deadlift (sztanga) | hinge | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Deadlift with Bands | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Deadlift with Chains | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Deficit Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Good Morning | hinge | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Good Morning off Pins | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Leverage Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| One-Arm Side Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Rack Pull | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Rack Pull with Bands | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| RDL (hantle/linki) | hinge | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| RDL (sztanga) | hinge | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Band Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Band Sumo Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Rickshaw Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Single Arm RDL (hantel/linka) | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Single Leg RDL (hantel) | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Single Leg RDL (linki) | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Stiff-Legged Deadlift | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Snatch Deadlift | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Stiff-Legged Barbell Deadlift | hinge | ready | v2 | general (rdl) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Sumo Deadlift | hinge | ready | v2 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Sumo Deadlift (kettlebell) | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Sumo Deadlift with Bands | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Sumo Deadlift with Chains | hinge | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Trap Bar Deadlift | hinge | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Band Hip Adduction | hip_abd_add | planned | — | general (hipAbd) | — | 2 (PL/EN) |
| Cable Hip Abduction | hip_abd_add | planned | dane | general (hipAbd) | — | 2 (PL/EN) |
| Cable Hip Adduction | hip_abd_add | planned | dane | general (hipAbd) | — | 2 (PL/EN) |
| Hip Abduction | hip_abd_add | planned | dane | general (hipAbd) | — | 2 (PL/EN) |
| Hip Adduction | hip_abd_add | planned | dane | general (hipAbd) | — | 2 (PL/EN) |
| Hip Flexion with Band | hip_abd_add | planned | — | none | — | — |
| Lateral Band Walk | hip_abd_add | planned | dane | general (bandWalk) | — | 2 (PL/EN) |
| Monster Walk | hip_abd_add | planned | dane | general (bandWalk) | — | 2 (PL/EN) |
| Frog Pump | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Glute Bridge | hip_bridge | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Glute Bridge (sztanga) | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Hip Thrust (hantel) | hip_bridge | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Hip Thrust (sztanga) | hip_bridge | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| London Bridges | hip_bridge | planned | — | none | — | — |
| Machine Hip Thrust | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Single Leg Glute Bridge | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Single Leg Hip Thrust | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Smith Machine Hip Thrust | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Stability Ball Hip Bridge | hip_bridge | planned | dane | general (bridge) | — | 35 |
| Bottoms-Up Clean From The Hang Position | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Double Kettlebell Clean | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Double Kettlebell Jerk | kb_ballistic | planned | dane | general (pushPress) | — | 35 |
| Double Kettlebell Push Press | kb_ballistic | planned | dane | general (pushPress) | — | 2 (PL/EN) |
| Double Kettlebell Snatch | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Dumbbell Clean | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Kettlebell Clean | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Kettlebell Pirate Ships | kb_ballistic | planned | — | none | — | — |
| Kettlebell Snatch | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Kettlebell Sumo High Pull | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Kettlebell Swing | kb_ballistic | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| One-Arm Kettlebell Clean and Jerk | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| One-Arm Kettlebell Jerk | kb_ballistic | planned | dane | general (pushPress) | — | 35 |
| One-Arm Kettlebell Push Press | kb_ballistic | planned | dane | general (pushPress) | — | 2 (PL/EN) |
| One-Arm Kettlebell Split Jerk | kb_ballistic | planned | dane | general (pushPress) | — | 35 |
| One-Arm Kettlebell Swings | kb_ballistic | planned | dane | general (kbSwing) | — | 35 |
| Snatch (hantel) | kb_ballistic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Kneeling Squat | kneeling_hinge | planned | — | none | — | — |
| Seated Good Mornings | kneeling_hinge | planned | dane | general (rdl) | — | 35 |
| Glute Ham Raise | leg_isolation | planned | — | general (legCurl) | — | 35 |
| Leg Curl | leg_isolation | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Leg Curl (hantel) | leg_isolation | planned | — | general (legCurl) | — | 35 |
| Leg Extension | leg_isolation | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Lying Leg Curl | leg_isolation | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Nordic Curl | leg_isolation | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Nordic | leg_isolation | planned | — | none | — | — |
| Seated Band Hamstring Curl | leg_isolation | planned | dane | general (legCurl) | — | 35 |
| Single-Leg Leg Extension | leg_isolation | planned | dane | general (legExt) | — | 35 |
| Sissy Squat | leg_isolation | planned | — | none | — | — |
| Slider Hamstring Curl | leg_isolation | planned | dane | general (bridge) | — | 35 |
| Stability Ball Hamstring Curl | leg_isolation | planned | — | general (bridge) | — | 35 |
| Standing Cable Leg Curl | leg_isolation | planned | dane | general (legCurl) | — | 35 |
| Standing Leg Curl | leg_isolation | planned | dane | general (legCurl) | — | 35 |
| Belt Squat Machine | leg_machine | planned | dane | general (squat) | — | 35 |
| Calf Press (leg press) | leg_machine | planned | v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Hack Squat | leg_machine | planned | dane | own ukryta | karta: do poprawy 2026-10-28 aktualny | 35 |
| Leg Press | leg_machine | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Lying Machine Squat | leg_machine | planned | dane | general (squatMachine) | — | 35 |
| Pendulum Squat | leg_machine | planned | dane | general (squatMachine) | — | 35 |
| Single Leg Press | leg_machine | planned | dane | general (legPress) | — | 35 |
| Smith Machine Leg Press | leg_machine | planned | — | general (legPress) | — | 35 |
| Barbell Side Split Squat | lunge | planned | dane | general (lunge) | — | 35 |
| Barbell Step Up | lunge | planned | dane | general (lunge) | — | 35 |
| Barbell Walking Lunge | lunge | planned | dane | general (lunge) | — | 35 |
| Bulgarian Split Squat (hantle) | lunge | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Bulgarian Split Squat (sztanga) | lunge | planned | dane | general (lunge) | — | 35 |
| Cossack Squat | lunge | planned | dane | general (lunge) | — | 35 |
| Crossover Reverse Lunge | lunge | planned | dane | general (mobility) | — | 2 (PL/EN) |
| Curtsy Lunge | lunge | planned | dane | general (lunge) | — | 35 |
| Elevated Back Lunge | lunge | planned | dane | general (lunge) | — | 35 |
| Lateral Lunge | lunge | planned | dane | general (lunge) | — | 35 |
| Lunge Pass Through | lunge | planned | dane | general (lunge) | — | 35 |
| Lunges (hantle) | lunge | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Lunges (sztanga) | lunge | planned | dane | general (lunge) | — | 35 |
| Pistol Squat | lunge | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Lunge | lunge | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Single-Leg High Box Squat | lunge | planned | dane | general (pistol) | — | 35 |
| Slider Reverse Lunge | lunge | planned | dane | general (lunge) | — | 35 |
| Smith Machine Bulgarian Split Squat | lunge | planned | dane | general (lunge) | — | 35 |
| Smith Machine Pistol Squat | lunge | planned | dane | general (pistol) | — | 35 |
| Split Squat | lunge | planned | dane | general (lunge) | — | 35 |
| Split Squat (linki) | lunge | planned | dane | general (lunge) | — | 35 |
| Step Up | lunge | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Suspended Split Squat | lunge | planned | dane | general (lunge) | — | 35 |
| Walking Lunges | lunge | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Butterfly Stretch | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Cat-Cow | mobility_floor | planned | dane | general (mobility) | — | 2 (PL/EN) |
| Child's Pose | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Downward Facing Balance | mobility_floor | planned | — | none | — | — |
| Intermediate Groin Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| IT Band and Glute Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Kneeling Forearm Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Kneeling Hip Flexor Stretch | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Middle Back Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Peroneals Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Posterior Tibialis Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Runner's Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Seated Calf Stretch | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Seated Floor Hamstring Stretch | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Seated Rotation Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Side Lying Groin Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Side-Lying Quad Stretch | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Supine Figure-Four Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Supine Hamstring Stretch | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Supine Spinal Twist | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| The Straddle | mobility_floor | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Upper Back Stretch | mobility_floor | planned | — | general (stretch) | — | 2 (PL/EN) |
| Ankle Circles | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Arm Circles | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Chest And Front Of Shoulder Stretch | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Chest Stretch on Stability Ball | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Chin To Chest Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Cross-Body Shoulder Stretch | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Dynamic Back Stretch | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Dynamic Chest Stretch | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Groiners | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Hip Circles (Prone) | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Inchworm | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Iron Crosses (Stretch) | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Knee Circles | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Leg Swings (Front-to-Back) | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Leg Swings (Side-to-Side) | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Lying Leg Crossover Swings | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| One Knee To Chest | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Overhead Stretch | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Overhead Triceps Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Round The World Shoulder Stretch | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Shoulder Circles | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Side Neck Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Standing Biceps Stretch | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Standing Chest Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Standing Elevated Quad Stretch | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Standing Gastrocnemius Calf Stretch | mobility_stand | planned | dane | general (stretch) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Standing Hip Circles | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Standing Lateral Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Standing Pelvic Tilt | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Standing Soleus And Achilles Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Standing Toe Touches | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| Torso Rotation | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Wall Calf Stretch | mobility_stand | planned | dane | general (stretch) | — | 2 (PL/EN) |
| Wall Lat Stretch | mobility_stand | planned | — | general (stretch) | — | 2 (PL/EN) |
| World's Greatest Stretch | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Wrist Circles | mobility_stand | planned | — | general (mobility) | — | 2 (PL/EN) |
| Isometric Neck Exercise - Front And Back | neck | planned | — | none | — | — |
| Isometric Neck Exercise - Sides | neck | planned | — | none | — | — |
| Lying Neck Extension (talerz) | neck | planned | — | none | — | — |
| Lying Neck Flexion (talerz) | neck | planned | — | none | — | — |
| Neck Harness Extension | neck | planned | — | none | — | — |
| Barbell Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Block Clean | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Block Power Clean | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Block Power Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Block Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Clean | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Clean and Jerk | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Clean Pull | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Clean Shrug | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Hang Clean | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Hang Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Jerk Balance | olympic | planned | — | none | — | — |
| Jerk Dip Squat | olympic | planned | dane | general (pushPress) | — | 35 |
| Muscle Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Power Clean | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Power Jerk | olympic | planned | dane | general (pushPress) | — | 35 |
| Power Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Rack Delivery | olympic | planned | — | none | — | — |
| Snatch Balance | olympic | planned | dane | general (squat) | — | 35 |
| Snatch Pull | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Snatch Shrug | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Split Clean | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Split Jerk | olympic | planned | dane | general (pushPress) | — | 35 |
| Split Snatch | olympic | planned | dane | general (oly) | — | 2 (PL/EN) |
| Squat Jerk | olympic | planned | dane | general (pushPress) | — | 35 |
| Arnold Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Band Shoulder Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Bradford Press | overhead_press | planned | — | none | — | — |
| Double Kettlebell Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Handstand Push Up | overhead_press | planned | — | none | — | — |
| Kettlebell Arnold Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Kettlebell Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Kettlebell Seated Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Landmine Linear Jammer | overhead_press | planned | dane | general (press) | — | 35 |
| Landmine Press | overhead_press | planned | dane | general (press) | — | 35 |
| Overhead Press (hantle) | overhead_press | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Overhead Press (sztanga) | overhead_press | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Pike Push Up | overhead_press | planned | dane | general (pushup) | — | 35 |
| Push Press | overhead_press | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Push Press - Behind the Neck | overhead_press | planned | dane | general (pushPress) | — | 2 (PL/EN) |
| Seated Barbell Military Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Seated Cable Shoulder Press | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Seated Shoulder Press (hantle) | overhead_press | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| See-Saw Press (Alternating Side Press) | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Single Arm Overhead Press (hantel) | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Single-Arm Linear Jammer | overhead_press | planned | dane | general (press) | — | 35 |
| Standing Barbell Press Behind Neck | overhead_press | planned | dane | general (ohp) | — | 2 (PL/EN) |
| Wyciskanie nad głowę (linki) | overhead_press | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Alternate Leg Diagonal Bound | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Alternate Leg Push-Off | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Bench Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Box Jump | plyo | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Box Skip | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Broad Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Depth Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Double Leg Butt Kick | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Dumbbell Seated Box Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Frog Hops | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Front Cone Hops | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Jump Squat | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Kneeling Jump Squat | plyo | planned | — | none | — | — |
| Lateral Bound | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Lateral Box Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Lateral Cone Hops | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Side Hop-Sprint | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Side Standing Long Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Side to Side Box Shuffle | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Single Leg Butt Kick | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Single Leg Push-Off | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Single-Leg Hop Progression | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Single-Leg Lateral Hop | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Single-Leg Stride Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Split Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Star Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Tuck Jump | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Weighted Jump Squat | plyo | planned | dane | general (jump) | — | 2 (PL/EN) |
| Chin Up | pull_up | ready | v2+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Dead Hang | pull_up | ready | v2 | general (vpull) | — | 35 |
| Gironda Sternum Chins | pull_up | ready | v2 | general (vpull) | — | 35 |
| Gorilla Chin/Crunch | pull_up | ready | v2 | general (hanging) | — | 2 (PL/EN) |
| Mixed Grip Chin | pull_up | ready | v2 | general (vpull) | — | 35 |
| Muscle Up | pull_up | ready | — | none | — | — |
| Neutral Grip Pull Up | pull_up | ready | v2+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| One Arm Chin-Up | pull_up | ready | v2 | general (vpull) | — | 35 |
| Pull Up | pull_up | ready | v2+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Rope Climb | pull_up | ready | — | none | — | — |
| Scapular Pull-Up | pull_up | ready | v2 | general (vpull) | — | 35 |
| Side To Side Chins | pull_up | ready | v2 | general (vpull) | — | 35 |
| Wide-Grip Rear Pull-Up | pull_up | ready | v2 | general (vpull) | — | 35 |
| Close-Grip Front Lat Pulldown | pulldown | planned | dane | general (vpull) | — | 35 |
| Full Range-Of-Motion Lat Pulldown | pulldown | planned | dane | general (vpull) | — | 35 |
| Lat Pulldown | pulldown | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Single Arm Lat Pulldown | pulldown | planned | dane | general (vpull) | — | 35 |
| Straight Arm Pulldown | pulldown | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Underhand Lat Pulldown | pulldown | planned | dane | general (vpull) | — | 35 |
| V-Bar Pulldown | pulldown | planned | dane | general (vpull) | — | 35 |
| Wide-Grip Pulldown Behind The Neck | pulldown | planned | dane | general (vpull) | — | 35 |
| Ab Wheel | pushup_plank | planned | — | general (rollout) | — | 2 (PL/EN) |
| Barbell Rollout from Bench | pushup_plank | planned | dane | general (rollout) | — | 2 (PL/EN) |
| Clock Push-Up | pushup_plank | planned | — | general (pushup) | — | 35 |
| Close-Grip Push-Up | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Copenhagen Plank | pushup_plank | planned | — | general (plank) | — | 35 |
| Decline Push Up | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Diamond Push Up | pushup_plank | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Drop Push | pushup_plank | planned | — | general (pushup) | — | 35 |
| Incline Push Up | pushup_plank | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Incline Push-Up Close-Grip | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Incline Push-Up Depth Jump | pushup_plank | planned | — | general (pushup) | — | 35 |
| Incline Push-Up Reverse Grip | pushup_plank | planned | — | general (pushup) | — | 35 |
| Inverted Row | pushup_plank | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Isometric Wipers | pushup_plank | planned | — | general (pushup) | — | 35 |
| Mountain Climbers | pushup_plank | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Plank | pushup_plank | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Plank Shoulder Taps | pushup_plank | planned | dane | general (plank) | — | 35 |
| Plyo Kettlebell Push-Ups | pushup_plank | planned | — | general (pushup) | — | 35 |
| Plyo Push-Up | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Push Up | pushup_plank | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Push Up to Side Plank | pushup_plank | planned | — | general (pushup) | — | 35 |
| Push-Up Wide | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Push-Ups With Feet On A Stability Ball | pushup_plank | planned | — | general (pushup) | — | 35 |
| Renegade Row | pushup_plank | planned | — | general (pushup) | — | 35 |
| Rollout (sztanga) | pushup_plank | planned | dane | general (rollout) | — | 2 (PL/EN) |
| Side Plank | pushup_plank | planned | — | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Single-Arm Push-Up | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Standing Barbell Rollout | pushup_plank | planned | dane | general (rollout) | — | 2 (PL/EN) |
| Suspended Fallout | pushup_plank | planned | dane | general (rollout) | — | 2 (PL/EN) |
| Suspended Push-Up | pushup_plank | planned | dane | general (pushup) | — | 35 |
| Band Pull Apart | rotator_cuff | planned | dane | general (raiseRear) | — | 35 |
| Cable Internal Rotation | rotator_cuff | planned | dane | general (rotCuff) | — | 2 (PL/EN) |
| Cuban Press | rotator_cuff | planned | — | none | — | — |
| External Rotation (hantel) | rotator_cuff | planned | dane | general (rotCuff) | — | 2 (PL/EN) |
| External Rotation (linki) | rotator_cuff | planned | dane | general (rotCuff) | — | 2 (PL/EN) |
| External Rotation with Band | rotator_cuff | planned | dane | general (rotCuff) | — | 2 (PL/EN) |
| Internal Rotation with Band | rotator_cuff | planned | dane | general (rotCuff) | — | 2 (PL/EN) |
| Reverse Flyes With External Rotation | rotator_cuff | planned | dane | general (raiseRear) | — | 35 |
| Barbell Rear Delt Row | row | planned | dane | general (rowBent) | — | 35 |
| Bent Over Row (hantle) | row | planned | dane | own ukryta | karta: v1 2026-10-27 NIEAKTUALNY | 35 |
| Bent Over Row (linki) | row | planned | dane | general (rowBent) | — | 35 |
| Bent Over Row (sztanga) | row | planned | dane | own ukryta | karta: v1 2026-10-27 NIEAKTUALNY | 35 |
| Chest Supported Row | row | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Lying T-Bar Row | row | planned | dane | general (row) | — | 35 |
| Meadows Row | row | planned | — | general (rowBent) | — | 35 |
| One Arm Row (hantle) | row | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Pendlay Row | row | planned | dane+v1 | own pokaz. | karta: wyswietlana 2026-10-29 aktualny | 35 |
| Reverse Grip Bent Over Row | row | planned | dane | general (rowBent) | — | 35 |
| Seal Row (sztanga) | row | planned | dane | general (row) | — | 35 |
| Smith Machine Bent Over Row | row | planned | dane | general (rowBent) | — | 35 |
| T-Bar Row | row | planned | dane | own ukryta | karta: v1 2026-10-27 NIEAKTUALNY | 35 |
| Barbell Shrug Behind The Back | shrug | planned | dane | general (shrug) | — | 35 |
| Calf-Machine Shoulder Shrug | shrug | planned | dane | general (shrug) | — | 35 |
| Leverage Shrug | shrug | planned | dane | general (shrug) | — | 35 |
| Middle Back Shrug | shrug | planned | dane | general (row) | — | 35 |
| Shrugs (hantle) | shrug | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Shrugs (linki) | shrug | planned | dane | general (shrug) | — | 35 |
| Shrugs (sztanga) | shrug | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Smith Machine Behind the Back Shrug | shrug | planned | dane | general (shrug) | — | 35 |
| Backward Drag | sled_throw | planned | — | general (sled) | — | 2 (PL/EN) |
| Backward Medicine Ball Throw | sled_throw | planned | dane | general (mbThrow) | — | 2 (PL/EN) |
| Bear Crawl Sled Drag | sled_throw | planned | — | none | — | — |
| Medicine Ball Chest Pass | sled_throw | planned | — | none | — | — |
| Medicine Ball Scoop Throw | sled_throw | planned | dane | general (mbThrow) | — | 2 (PL/EN) |
| Medicine Ball Slam | sled_throw | planned | dane | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| One-Arm Medicine Ball Slam | sled_throw | planned | dane | general (mbThrow) | — | 35 |
| Sled Drag (Harness) | sled_throw | planned | dane | general (sled) | — | 2 (PL/EN) |
| Sled Forward Drag with Press | sled_throw | planned | — | none | — | — |
| Sled Overhead Backward Walk | sled_throw | planned | — | none | — | — |
| Sled Push | sled_throw | planned | dane | general (sled) | — | 2 (PL/EN) |
| Sledgehammer Swings | sled_throw | planned | — | none | — | — |
| Spider Crawl | sled_throw | planned | — | none | — | — |
| Standing Two-Arm Overhead Throw | sled_throw | planned | dane | general (mbThrow) | — | 2 (PL/EN) |
| Supine Chest Throw | sled_throw | planned | — | none | — | — |
| Supine One-Arm Overhead Throw | sled_throw | planned | — | none | — | — |
| Supine Two-Arm Overhead Throw | sled_throw | planned | — | none | — | — |
| Turkish Get Up | sled_throw | planned | — | general (tgu) | — | 2 (PL/EN) |
| Wall Ball | sled_throw | planned | dane | general (squat) | — | 35 |
| Back Squat | squat | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Band Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Barbell Hack Squat | squat | ready | v2 | general (hingeFloor) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Bodyweight Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Box Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Box Squat with Bands | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Box Squat with Chains | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Cable Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Dip Belt Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Double Kettlebell Front Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Dumbbell Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Front Squat | squat | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Goblet Squat | squat | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Landmine Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| One-Arm Overhead Kettlebell Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Overhead Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Przysiad z pasem (linki) | squat | ready | v2+v1 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Band Box Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Reverse Band Power Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Smith Machine Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Squat with Bands | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Squat with Chains | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Sumo Squat (hantel) | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Wall Sit | squat | ready | v2 | own pokaz. | karta: wyswietlana 2026-10-28 aktualny | 35 |
| Zercher Squat | squat | ready | v2 | general (squat) | zestaw: wyswietlana 2026-10-28 aktualny | 35 |
| Atlas Stones | strongman | planned | — | none | — | — |
| Circus Bell | strongman | planned | — | none | — | — |
| Conan's Wheel | strongman | planned | — | none | — | — |
| Jefferson Squat | strongman | planned | — | general (squat) | — | 35 |
| Keg Load | strongman | planned | — | none | — | — |
| Log Lift | strongman | planned | — | none | — | — |
| Power Stairs | strongman | planned | — | none | — | — |
| Sandbag Load | strongman | planned | — | none | — | — |
| Tire Flip | strongman | planned | — | none | — | — |
| Yoke Walk | strongman | planned | dane | general (carry) | — | 35 |
| Clean and Press | thruster | planned | dane | general (oly) | — | 2 (PL/EN) |
| Kettlebell Thruster | thruster | planned | dane | general (squat) | — | 35 |
| Thruster (hantle) | thruster | planned | dane | general (squat) | — | 35 |
| Band Overhead Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Band Skull Crusher | triceps | planned | dane | general (triLying) | — | 2 (PL/EN) |
| Body-Up | triceps | planned | — | none | — | — |
| Bodyweight Triceps Extension | triceps | planned | — | none | — | — |
| Cable Incline Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Cable Lying Triceps Extension | triceps | planned | dane | general (triLying) | — | 35 |
| Cable Overhead Extension | triceps | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Chain Handle Extension | triceps | planned | dane | general (triLying) | — | 35 |
| Decline Dumbbell Triceps Extension | triceps | planned | dane | general (triLying) | — | 2 (PL/EN) |
| Decline EZ Bar Triceps Extension | triceps | planned | dane | general (triLying) | — | 35 |
| Dumbbell One-Arm Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Incline Barbell Triceps Extension | triceps | planned | dane | general (triLying) | — | 35 |
| Kettlebell Overhead Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Kneeling Cable Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Lying Close-Grip Barbell Triceps Extension Behind The Head | triceps | planned | dane | general (triLying) | — | 35 |
| Machine Triceps Extension | triceps | planned | dane | general (triPush) | — | 35 |
| One-Arm Lying Dumbbell Triceps Extension | triceps | planned | dane | general (triLying) | — | 35 |
| Overhead Triceps Extension (EZ) | triceps | planned | dane | general (triOver) | — | 35 |
| Overhead Triceps Extension (hantel) | triceps | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Reverse Grip Triceps Pushdown | triceps | planned | dane | general (triPush) | — | 35 |
| Single Arm Triceps Pushdown | triceps | planned | dane | general (triPush) | — | 35 |
| Skullcrusher (EZ) | triceps | planned | dane | own ukryta | karta: v1 2026-10-27 NIEAKTUALNY | 35 |
| Skullcrusher (hantle) | triceps | planned | dane | general (triLying) | — | 2 (PL/EN) |
| Skullcrusher (sztanga) | triceps | planned | dane | general (triLying) | — | 35 |
| Sled Overhead Triceps Extension | triceps | planned | — | none | — | — |
| Standing Low-Pulley One-Arm Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Standing Overhead Barbell Triceps Extension | triceps | planned | dane | general (triOver) | — | 35 |
| Tate Press | triceps | planned | dane | general (bench) | — | 35 |
| Triceps Kickback | triceps | planned | dane | general (triPush) | — | 35 |
| Triceps Kickback (linki) | triceps | planned | dane | general (triPush) | — | 35 |
| Triceps Pushdown | triceps | planned | dane+v1 | own pokaz. | karta: v1 2026-10-27 aktualny | 35 |
| Two-Arm Dumbbell Kickback | triceps | planned | dane | general (triPush) | — | 35 |
