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
- **Audyt kroku b (04.10.2026, niezależny recenzent): 0 wysokich / 1 średni / 6 niskich.** Średni (naprawiony): powrót do buildu 643cba7 po nowej wersji — stara reguła `libExtra !== 'katalog-2026-10-04'` dopisałaby ponownie usunięte ćwiczenia i cofnęła znacznik → `State.libExtra` zostaje wartością pierwszego kroku, kolejne kroki w `State.libExtraStep` (test w catalog-v2). Niskie (bez zmian, opisane): `CABLES` nie jest jeszcze czytane przez aplikację (Q-024); przywodziciele nie liczone w ćwiczeniach złożonych (najmocniejsi kandydaci do decyzji: Cossack Squat, Lateral Lunge); poprawka partii nadpisze świadomie ustawione dokładnie domyślne partie (nie do odróżnienia); zapisane miejsca nie dostają nowego sprzętu (możliwa później akcja „uzupełnij z presetu”); sanki i liny w „Akcesoriach”; Copenhagen Plank zostaje w grupie core (brak grupy przywodzicieli). W starszym buildzie partia „przywodziciele” nie jest widoczna (brak na liście) — tylko wygląd.

## Pełna baza (krok „katalog-2026-10-05”, 04.10.2026 wieczorem) — 270 → 854

Decyzja właściciela: „Dlaczego mamy 270 ćwiczeń, skoro te online mają po 860?” → „czas jest od jutra 15.30 CET. Dodawaj resztę.”

- **Źródło:** free-exercise-db (876 pozycji; domena publiczna — Unlicense). Wzięte tylko nazwy i fakty, bez opisów i zdjęć. Pole `fedb` w catalog.json to nazwa źródłowa.
- **Jak powstało:**
  - 8 paczek według partii (klatka, plecy, barki, ramiona, czworogłowe, tył uda i pośladki, brzuch, rozciąganie i roller), każda opracowana przez osobnego agenta według zasad (kopia zasad i skryptu sprawdzającego: poza repo, w notatkach sesji);
  - automatyczny sprawdzacz: te same reguły co `tests/catalog-v2.test.ts`, do tego pokrycie każdej pozycji źródła (dodana albo pominięta jako duplikat) i kolizje nazw między paczkami;
  - 592 dodane, 284 pominięte jako duplikaty istniejących albo innych pozycji.
- **Niezależna recenzja:** 4 recenzentów po 148 ćwiczeń dało 13 poprawek i 10 usunięć (2 pary usuwały się nawzajem — zostaje jedno z pary). Wynik: 584 nowe, razem 854.
  - Poprawki: wymagania (Car Deadlift i Conan's Wheel nie są dostępne w zwykłej siłowni, Skating wymaga „na zewnątrz”, wyciskanie leżąc sztangą wymaga stojaków), partie (Cable/Leverage Deadlift, Supine Chest Throw, Sandbag Load), miara i tryb (Push Up to Side Plank, One Arm Chin-Up), nazwy („Weighted Squat” → „Dip Belt Squat”, „Wind Sprints” → „Hanging Alternating Knee Raise”).
- **Konwencje nowe w tym kroku:**
  - rozciąganie i roller: wzorzec `mobility`, grupa „inne”, miara czas, bez partii — nie liczą się do serii tygodniowych; obciążenie partii tylko 0,25;
  - region `neck` (szyja) bez zgrubnej partii;
  - sprzęt strongman w osobnej grupie, poza presetem „Pełna siłownia” — 11 ćwiczeń strongman jest tam niedostępnych (test);
  - opaski na kostki jako opcja wyciągów (brama, pojedynczy).
- **Słownik sprzętu rozszerzony:** talerz, worek z piaskiem, łańcuchy, lina do wspinania, maszyny dźwigniowe (zbiorczo), roller, bosu, roller na nadgarstki, uprząż na szyję; strongman: opona, młot, kamienie, jarzmo, kłoda, beczka, gruby gryf, uchwyty farmerskie, riksza.
- **Nazwy:** angielskie, jak w źródle (wyczyszczone). Po polsku pokazują się tak samo — tak jak większość dotychczasowej biblioteki.
- **Ranking zamiany:** przy remisie punktów najpierw biblioteka przejrzana przez właściciela (125 + kroki 04.10), dopiero potem pełna baza. Bez tego rzadkie warianty wypychały znane ćwiczenia, np. „Bench Press with Chains” przed „Bench Press (hantle)”. W obrębie każdej części obowiązuje D7: ten sam sprzęt, sesje, nazwa. **Do potwierdzenia przez właściciela.** Alternatywa: tylko D7, bez podziału — więcej rzadkich wariantów w propozycjach.
- **Wydajność:**
  - wybór ćwiczenia to lista wirtualizowana (FlatList): 854 ćwiczenia renderują się w 227 ms (`npm run perf`, Node), wcześniej 433 ms przy 270 w ScrollView;
  - lista „Inne” w arkuszu zamiany pokazuje porcje po 50 (`SWAP_PAGE`) z przyciskiem „Pokaż więcej”;
  - stan po migracji jest o ok. 300 KB większy.
- **Braki słownika zgłoszone przez agentów** (dodane z najbliższą możliwością i niską pewnością): partner (rozciąganie PNF, rzuty), worek bokserski, bloczki do zarzutów, płotki i pachołki, ręcznik, wózek ze sztangą (car deadlift), kij do rozciągania, specjalne maszyny (dip machine → maszyna do tricepsa). Do rozbudowy po teście, jeśli potrzebne.
- **Audyt kodu (62d418e..398da2f, niezależny): 0 wysokich / 2 średnie / 5 niskich.**
  - **MEDIUM 1 (naprawiony):** wzorzec `mobility` dawał „ten sam ruch” każdemu rozciąganiu (np. Ankle Circles → Arm Circles). Jest teraz w `WEAK_PATTERNS`: liczy się tylko przy wspólnej partii, a rozciąganie partii nie ma, więc bez propozycji. Zostaje „Inne”.
  - **MEDIUM 2 (opisany, decyzja właściciela):** zapisane miejsca (np. siłownia z presetu sprzed pełnej bazy) nie dostają nowych pozycji sprzętu (talerz, łańcuchy, maszyny dźwigniowe, opaski na kostki…). Ćwiczenia, które ich wymagają, są tam niedostępne, dopóki pozycji nie zaznaczysz. Opcje: (a) jednorazowo dopisać nowe pozycje do miejsc zawierających prawie cały preset siłowni, (b) podpowiedź „uzupełnij z presetu” w edytorze miejsca, (c) zostawić.
  - **LOW 4 (naprawiony):** w „Inne” dokładne trafienie nazwy jest na początku (`sortOthers`). Wcześniej mogło utknąć za „Pokaż więcej”.
  - **LOW 5 (naprawiony):** zwinięcie i rozwinięcie „Inne” wraca do pierwszej porcji.
  - **LOW 3 (opisany):** objętość ×2 tylko przy zapisanym przyrządzie bloku. Stary blok bez przyrządu w miejscu ze stacją ma podpis „kg/str.” (przyrząd z miejsca), a liczy się ×1.
  - **LOW 6 (opisany):** ranking i filtr „Inne” przechodzą po wszystkich 854 ćwiczeniach przy każdym renderze. Pomiar wydajności tego nie pokazuje jako problemu.
  - **LOW 7 (sprawdzony):** „Full Range-Of-Motion Lat Pulldown” to dwie linki — uchwyty z dwóch górnych wyciągów, `cables 2` poprawne.
- **Decyzje właściciela 05.10.2026:** „1.a” — nowy sprzęt dopisany **jednorazowo** do zapisanych miejsc opartych na presecie siłowni (`GYM_FILL` w lib/equipment.ts: ≥ 75 % pozycji dawnego presetu; dom i hotel bez zmian; znacznik `State.equipFill` — usunięte później pozycje nie wracają; ciężary i opcje istniejących pozycji bez zmian, przy wyciągach dochodzi opcja „opaski na kostki”; strongman nie). „2. ok” — ranking zamiany przy remisie: najpierw biblioteka przejrzana, potem pełna baza (zostaje). Testy: `tests/catalog-full.test.tsx`.
- **Audyt kodu 1.a (1956243..3c7cd3e): 0 wysokich / 1 średni / 2 niskie.**
  - **MEDIUM (naprawiony):** odznaczone pozycje (`off`) liczyły się do kwalifikacji. Dom utworzony z presetu siłowni z prawie wszystkim odznaczonym dostałby 27 pozycji. Teraz liczą się tylko zaznaczone.
  - **LOW (naprawiony):** opaski dopisywane tylko przy zaznaczonych wyciągach.
  - **LOW (sprawdzony testem):** start aplikacji zapisuje wynik jednorazowych kroków.
  - Bez zmian w doborze ciężarów (porównanie wszystkich ćwiczeń w kg i lb).
