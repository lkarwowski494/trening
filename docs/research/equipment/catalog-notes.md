# Equipment catalog — notes (draft)

Source: lista LIB z lib/seed.ts (125 ćwiczeń). Plik: docs/research/equipment/catalog.json (szkic wygenerowany przez agenta researchu 02.10.2026 i poprawiony po niezależnym przeglądzie tego samego dnia: Wall Sit, Bieg, Łydki na stopniu bez wymagań; Rower: bike|outdoor; siedzisko także bench.incline; kółka gimnastyczne jako alternatywa drążka/poręczy; spacer farmera z kettlami; face pull z cable.mid). Słownik możliwości: na razie tylko w tym dokumencie — do przeniesienia do lib/equipment.ts przy wdrożeniu.

> Uwaga: liczby w sekcji „Counts” i lista „Floor” pochodzą sprzed przeglądu 02.10. Po poprawkach bez wymagań jest 20 ćwiczeń (doszły Wall Sit, Łydki na stopniu, Bieg). Aktualne liczby zawsze z pliku JSON, nie z tej notatki.

## implements (dodane przy wdrożeniu E1, 02.10.2026)
Wpisy z `loadSource` dumbbell/kettlebell mają pole `implements`: 1 = jeden hantel/kettle (One Arm Row, Concentration Curl, Triceps Kickback, Goblet Squat, Overhead Triceps Extension (hantel), Hip Thrust (hantel), Kettlebell Swing, Russian Twist, Suitcase Carry), 2 = para (pozostałe 29). Mówi, z której listy brać ciężary hantli na talerze (para: talerze dzielone na 4, jeden: na 2). Łydki na stopniu = 2 (niepewne — przy hantlach z listą nie ma to znaczenia). Plik `lib/catalog.generated.ts` generuje `node scripts/equipment/gen.mjs` — po każdej zmianie tego JSON-a trzeba go uruchomić (test pilnuje aktualności).

## Vocabulary additions
None. Every capability used is from the given vocabulary. Candidate splits, **not** added, listed so the decision stays open:
- `leg_curl` → seated vs lying (affects Leg Curl / Lying Leg Curl)
- `calf_machine` → standing vs seated (affects Standing / Seated Calf Raise)
- `cardio.air_bike` (Assault Bike currently accepts any `cardio.bike`)
- `bicycle` (personal bike for outdoor cycling; "Rower" currently needs `cardio.bike`)
- `pullup.bar.neutral` (Neutral Grip Pull Up currently accepts any `pullup.bar`)
- foot anchor for Nordic Curl (sofa / partner / strap); `belt_squat` machine; sissy-squat bench; preacher substitute on an incline backrest

Location-side hint: a `lat_pulldown` station also gives a usable `cable.high`, and a `cable.row_seat` gives a `cable.low`. Mapping that on the location side would widen availability without changing exercise requirements.

## Conventions used
- **R1, implement named** ("(hantle)", "(sztanga)", "EZ", "Trap Bar", "Kettlebell") → that implement is required.
- **R2, generic name, needs external load** (Front Raise, Upright Row, Preacher Curl, Decline / Close Grip Bench, Sumo DL…) → the app's coarse class decides the implement (it also drives `loadMode` volume math). Other implements go in `alternativesNote`. Exceptions where the classic implement differs from the coarse class are OR'ed in: Goblet Squat `[db|kb]`, Kettlebell Swing `[kb|db]`.
- **R3, generic name, commonly done unloaded** (Walking Lunges, Reverse Lunge, Step Up, Russian Twist, Łydki na stopniu) → requires only the structural need (floor / box). `db` is recommended and `loadSource` stays `dumbbell` to match the app. Confidence is medium. Switch to `[["db"]]` if these should always count as loaded.
- Seat / step / elevated surface → `["bench.flat","box"]`, same shape everywhere (bench dips, incline push-up, BSS, hip thrust, step-up, concentration curl, seated DB press, box squat). Box Jump and Łydki na stopniu are box-only.
- Barbell over a bench → `[["barbell"],[bench.X],["rack","bench.uprights"]]` + `rack.safeties` recommended.
- Barbell on the back (Back/Front/Box Squat, Good Morning) → `rack` is required. For OHP, Push Press, RDL (sztanga) and Shrugs (sztanga) the bar can be cleaned or deadlifted up, so `rack` is only recommended.
- Hanging / pull-up / dip work → `pullup.bar` or `dip.bars` only. Rings and power towers are mentioned in the note. Band assistance and dip belts are never required (except Przysiad z pasem, where the belt is the exercise).
- Bilateral cable presses with two handles → `[["cable.dual"],["cable.<height>"]]`. Single-pulley cable moves → one height group.
- "X AND Y, or Z" needs written in CNF: T-Bar Row `[[t_bar|landmine],[t_bar|barbell]]`, Inverted Row `[[rack|smith|rings|suspension],[barbell|smith|rings|suspension]]`.
- `floor_mat` is recommended for floor core work, Glute Bridge, Ab Wheel, Cable Crunch and Nordic Curl. It is never required.

## Counts
loadSource (125): dumbbell 37, bodyweight 28, barbell 19, cable 16, machine_stack 10, none 7, plate_loaded_machine 4, ez_bar 2, trap_bar 1, kettlebell 1 (smith 0, band 0).

pattern (125): isolation 40, hinge 12, h_push 11, h_pull 10, v_push 9, squat 8, cardio 8, lunge_single_leg 6, core_flexion 5, v_pull 4, core_anti_ext 4, core_anti_rot 2, core_other 2, carry 2, other 2.

confidence: high 103, medium 20, low 2.

Floor (`requires: []`, 17): Push Up, Diamond Push Up, Walking Lunges, Reverse Lunge, Pistol Squat, Sissy Squat, Glute Bridge, Plank, Side Plank, Dead Bug, Bird Dog, Crunch, Reverse Crunch, Russian Twist, Hollow Hold, Mountain Climbers, Burpees.

## Low confidence
- **Nordic Curl**: needs an ankle anchor. Encoded as `ghd | glute_ham_raise | lat_pulldown | barbell`. A home anchor (sofa, partner, strap) can't be expressed, so availability is under-reported at home.
- **Rower**: in Polish this means bicycle, not rowing. A stationary bike is assumed (`cardio.bike`). Outdoor cycling would need a bicycle capability.

## Medium confidence (interpretation or vocab granularity)
Wyciskanie na linkach (stojąc), Wyciskanie nad głowę (linki) (assumed dual pulleys); RDL (hantle/linki) (db OR low cable); Chest Supported Row (DB on incline bench, could be a machine); T-Bar Row; Neutral Grip Pull Up; Inverted Row; Preacher Curl; Przysiad z pasem (linki) (belt squat = dip belt on a low pulley); Walking Lunges, Reverse Lunge, Step Up, Russian Twist, Łydki na stopniu (R3); Leg Curl, Lying Leg Curl, Standing / Seated Calf Raise (machine-type granularity); Kettlebell Swing (db accepted); Assault Bike.

## Duplicates / overlaps noticed in the library
- Seated Cable Row ≡ Wiosłowanie na linkach (siedząc)
- Rear Delt Raise (hantle) ≈ Reverse Fly (hantle)

## Polish names interpreted
Wyciskanie na linkach (stojąc) = standing cable chest press; Wiosłowanie na linkach (siedząc) = seated cable row; Wyciskanie nad głowę (linki) = cable overhead press; Triceps Dips (ławka) = bench dips; Przysiad z pasem (linki) = cable belt squat; Łydki na stopniu = calf raise on a step; Incline Walk (bieżnia) = treadmill incline walk; Bieg = running; Rower = cycling (bike); Skakanka = jump rope.

## Katalog 04.10.2026 — rozbudowa (125 → 248) i obciążenie partii

Decyzja właściciela 04.10.2026: rozbudowa **własnego** katalogu (źródła zewnętrzne tylko pomocniczo), każde ćwiczenie z oznaczeniem, które partie i w jakim stopniu obciąża (pod przyszłą informację o regeneracji); wdrożenie tego samego dnia z metodami weryfikacji.

- **Dane (jedno źródło):** `catalog.json` — dla każdego ćwiczenia `muscleLoad` (18 regionów: chest, front/side/rear_delt, lats, upper_back, lower_back, biceps, triceps, forearms, abs, obliques, glutes, quads, hamstrings, adductors, abductors, calves; wagi 1 / 0,5 / 0,25), `cables` (1/2 — ćwiczenia na wyciągu; do decyzji Q-024 o objętości na stacji, dziś nieużywane w obliczeniach); nowe ćwiczenia (123) mają też `group`, `equipment`, `metric`, `loadMode`, `muscles`, `secondaryMuscles`, `bandAssistable`. `scripts/equipment/gen.mjs` generuje `MUSCLE_LOAD`, `CABLES`, `CATALOG_LIB_EXTRA`, `MUSCLE_REGIONS`.
- **Jak powstało:** szkic nowych ćwiczeń (agent) z listą kontrolną z free-exercise-db (domena publiczna; tylko jako lista kontrolna — bez opisów i zdjęć), osobny agent — obciążenie dla 125 istniejących, **niezależny recenzent** (`catalog-review-2026-10-04.json`: 5 błędów, 17 ostrzeżeń — błędy i jednoznaczne ostrzeżenia naniesione; „Pallof Hold” usunięty jako duplikat Pallof Press; nazwy „Double Kettlebell …”), potem **testy spójności** `tests/catalog-v2.test.ts` (wpis i obciążenie dla każdego ćwiczenia; partia główna ↔ region z wagą 1, pomocnicza ↔ ≥ 0,5; źródło obciążenia ↔ zgrubny sprzęt; implements tylko hantle/kettle; linki ↔ `cables`; pełna siłownia — 248/248; „tylko masa ciała” — tylko bez obciążenia albo z przyrządem zalecanym (R3); stacja elektryczna w domu właściciela; unikalne nazwy PL i EN; migracja).
- **Korekty zgrubnych partii** (tylko nowe instalacje, zapisane ćwiczenia bez zmian): Upright Row — pomocnicze + plecy; Farmer's Walk — główne przedramiona + plecy, pomocniczy core; Back Extension — pomocnicze pośladki, dwugłowe.
- **Migracja na telefonie:** dane bez znacznika `State.libExtra` (`LIB_EXTRA_REV`) dostają nowe ćwiczenia RAZ — audyt kodu 04.10 (HIGH): pierwotnie granica „schemat < 16”, ale schemat 16 miał już build 01f2bee bez katalogu, więc po jego instalacji ćwiczenia nigdy by się nie pojawiły; ćwiczenie o tej samej nazwie (także własne) nie jest dublowane; usunięte później nie wraca.
- **Otwarte (do właściciela):** ~~liczba linek przy „Wiosłowanie na linkach (siedząc)” i „RDL (hantle/linki)”~~ i ~~Hip Adduction bez zgrubnej partii~~ — rozstrzygnięte w kroku b (niżej); Sumo Squat (hantel) vs Sumo Deadlift (kettlebell) — oba zostają; grupy Single Leg RDL → plecy (jak RDL).
- **Braki słownika sprzętu** (stan przed krokiem b; uzupełnione niżej poza asystowanym podciąganiem): maszyny z płytami/stosem do wiosłowania siedząc, asystowanego podciągania, brzucha, wznosów bokiem, bicepsa/tricepsa, kickbacku, hip thrustu; belt squat, pendulum, reverse hyper; sanki, liny, schody, orbitrek, ski erg; piłka fitness, slidery.

## Krok b (04.10.2026, wieczór) — 248 → 270

Decyzje właściciela (odpowiedzi na 3 pytania): „Przecież istnieje RDL i wiosłowanie jedną ręką jak i dwoma. To dwa inne ćwiczenia.”; partia „przywodziciele” — tak; dopisać brakujący sprzęt i ćwiczenia — tak.

- **Jednorącz ≠ oburącz:** „RDL (hantle/linki)” i „Wiosłowanie na linkach (siedząc)” to wersje oburącz — `cables: 2` (na stacji / bramie: dwie linki; na jednym wyciągu z drążkiem liczba linek nie ma znaczenia — Q-024 dotyczy stacji). Nowe „Single Arm RDL (hantel/linka)” (`cables: 1`, implements 1, tryb „na stronę”); wiosłowanie jednorącz na linkach już było — „Single Arm Cable Row”. Wymagania sprzętowe obu wersji oburącz bez zmian (dostępność w Twoich miejscach taka sama).
- **Przywodziciele:** nowa zgrubna partia `przywodziciele` (lib/seed.ts MUSCLES; EN „adductors”); region `adductors` → `przywodziciele` (gen.mjs). Partię główną mają: Hip Adduction, Copenhagen Plank (adductors 1, obliques 0,5 — wcześniej odwrotnie), nowe Cable Hip Adduction. **Nie** dodano jej jako pomocniczej do przysiadów i wykroków (tam adductors 0,5 w obciążeniu partii) — inaczej każdy przysiad dokładałby 0,5 serii przywodzicieli w statystyce tygodniowej; do decyzji przy module regeneracji. Wyjątek w teście spójności usunięty.
- **Sprzęt (lib/equipment.ts, 18 pozycji):** maszyny z ciężarami — wiosłowanie siedząc, pullover, brzuch, biceps, triceps, wznosy bokiem, wykopy (pośladki), hip thrust, belt squat, pendulum squat, reverse hyper; akcesoria — piłka gimnastyczna, ślizgacze, sanki, liny bojowe; cardio — stepper schodowy, orbitrek, ski erg. Pełna siłownia z presetu ma je wszystkie; **zapisane miejsca bez zmian** (nowe pozycje trzeba zaznaczyć).
- **Ćwiczenia (22, pole `added: "katalog-2026-10-04b"`):** Single Arm RDL (hantel/linka), Cable Hip Adduction, Machine Row, Machine Pullover, Machine Crunch, Machine Biceps Curl, Machine Triceps Extension, Machine Lateral Raise, Machine Glute Kickback, Machine Hip Thrust, Belt Squat Machine, Pendulum Squat, Reverse Hyperextension, Sled Push, Battle Ropes, Stair Climber, Orbitrek, Ski Erg, Stability Ball Crunch, Stability Ball Hamstring Curl, Slider Hamstring Curl, Slider Reverse Lunge.
- **Migracja (State.libExtra jako krok):** kroki `LIB_EXTRA_REVS` po kolei od zapisanego znacznika — dane z buildu 01f2bee (bez znacznika) dostają oba kroki, dane z kroku 1 — tylko 22 nowe (ćwiczenia z kroku 1 usunięte przez użytkownika nie wracają); nieznany nowszy znacznik — bez zmian. `LIB_MUSCLE_FIXES`: Hip Adduction (pośladki → przywodziciele) i Copenhagen Plank (core → przywodziciele + core) — tylko gdy zapisane partie są dokładnie dawnymi domyślnymi.
- **Pominięte (otwarte):** maszyna do podciągania / dipów ze wspomaganiem — ciężar to odciążenie (im mniej, tym trudniej); aplikacja nie ma takiej miary (rekordy i objętość liczyłyby odwrotnie). Wymaga decyzji o mierze przed dodaniem. Donkey calf raise — wariant maszyny do łydek, nie dodany.
