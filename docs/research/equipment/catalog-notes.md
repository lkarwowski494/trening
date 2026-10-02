# Equipment catalog — notes (draft)

Source: lista LIB z lib/seed.ts (125 ćwiczeń). Plik: docs/research/equipment/catalog.json (szkic wygenerowany przez agenta researchu 02.10.2026 i poprawiony po niezależnym przeglądzie tego samego dnia: Wall Sit, Bieg, Łydki na stopniu bez wymagań; Rower: bike|outdoor; siedzisko także bench.incline; kółka gimnastyczne jako alternatywa drążka/poręczy; spacer farmera z kettlami; face pull z cable.mid). Słownik możliwości: na razie tylko w tym dokumencie — do przeniesienia do lib/equipment.ts przy wdrożeniu.

> Uwaga: liczby w sekcji „Counts” i lista „Floor” pochodzą sprzed przeglądu 02.10. Po poprawkach bez wymagań jest 20 ćwiczeń (doszły Wall Sit, Łydki na stopniu, Bieg). Aktualne liczby zawsze z pliku JSON, nie z tej notatki.

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
