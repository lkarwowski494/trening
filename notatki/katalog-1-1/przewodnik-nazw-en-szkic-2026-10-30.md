# Przewodnik stylu kanonicznych nazw EN ćwiczeń — SZKIC

Stan: **szkic do decyzji** (30.10.2026, linia 1.1, decyzja właściciela z 30.10.2026, wariant A). W kodzie, danych i commitach nic się nie zmieniło.
Dane: `docs/research/equipment/catalog.json` z `origin/main` (748bf972), 709 ćwiczeń. Analiza wyjściowa: `notatki/katalog-1-1/analiza-2026-10-28/A-katalog-dane.md` (K-02, K-03, K-16, 6.2–6.3) na gałęzi `przekazanie-konta`.
„Nazwa dziś” = nazwa, którą dziś widzi użytkownik angielski (`exName`: klucz + `EX_PAREN`, `EX_FULL`, `LIB_DISPLAY_NAME`); gdy klucz katalogu jest inny, podaję go w [nawiasie kwadratowym].

## 1. Przewodnik stylu (reguły)

Nadrzędna zasada: nazwa ma brzmieć tak, jak ćwiczenie nazywa trener na siłowni anglojęzycznej, i być jednoznaczna w katalogu. Gdy nie ma jednej „poprawnej” formy, wybór jest **konwencją**: chodzi o spójność (te same słowa, te same adresy, łatwiejszy przekład), nie o rację językową.

**W — wielkie litery**
- **W1 Title case.** Każde słowo wielką literą z wyjątkiem słów funkcyjnych w środku nazwy: *a, an, the, and, or, to, on, in, at, of, for, by, with, from, off, into, onto, per, vs* (konwencja, bliska stylowi Chicago). Partykuły czasowników frazowych piszemy wielką literą (*Up, Over, Through, Off, In*: „Single-Leg Push-Off”, „Leg Pull-In”). W złożeniu z łącznikiem małą literą tylko *a, an, the, to, of, and* („Toes-to-Bar”, „Full-Range-of-Motion”). Przykład: „Chin To Chest Stretch” → „Chin to Chest Stretch”. *Dlaczego:* dziś 34 nazwy mają takie słowa małą literą, a 23 wielką (styl importu „From The Hang Position”).
- **W2 Bez przedimka na początku i bez ukośnika.** „The Straddle” → „Straddle Stretch”, „Gorilla Chin/Crunch” → „Gorilla Chin-Up Crunch”. *Dlaczego:* przedimek psuje sortowanie i adres, a ukośnik to dwa ćwiczenia w jednej nazwie.
- **W0 Nazwa angielska dla dzisiejszych nazw polskich** (dotyczy kluczy po polsku z mapy `EX_FULL`): pełna nazwa ruchu zamiast skrótu z notatki, np. „Seated Cable Row (home)” → „Seated Dual-Cable Row”.

**H — łączniki**
- **H1 Rzeczowniki od czasowników frazowych piszemy z łącznikiem:** Push-Up, Pull-Up, Chin-Up, Sit-Up, Step-Up, Get-Up, Muscle-Up, Pull-Through, Pull-Apart, Push-Off. *Dlaczego:* tak zapisują je słowniki ogólne angielskie (*push-up, pull-up, sit-up, chin-up*; wskazanie miejsca w słowniku — do potwierdzenia przez badacza); dziś „Push Up” ×7 obok „Push-Up” ×11. Wyjątki ustalone w pisowni łącznej: Pulldown, Pushdown, Pullover, Kickback, Rollout (konwencja: najczęstsza forma w języku siłowni).
- **H2 Określenie złożone przed rzeczownikiem z łącznikiem:** Close-Grip, Wide-Grip, Reverse-Grip, Neutral-Grip, Mixed-Grip, Bent-Over, Straight-Arm, Chest-Supported, Stiff-Legged, Toes-to-Bar, Side-to-Side, Low-to-High. Po rzeczowniku bez łączników: „… Behind the Neck”. *Dlaczego:* reguła ortografii angielskiej dla przymiotników złożonych (*compound modifier*).
- **H3 Jednostronność: „Single-Arm” i „Single-Leg”** (zamiast One Arm / One-Arm / Single Arm / One-Leg). *Konwencja:* obie formy są naturalne; jedna forma daje jeden wzór w wyszukiwarce i w przekładach. Dziś 4 zapisy obok siebie (7/2/4/24). Patrz pytanie P1.

**L — pisownia i liczba**
- **L1 Jeden wariant pisowni:** „Fly” (nie Flye/Flyes), „Skull Crusher” (nie Skullcrusher). *Konwencja:* częstsza forma w języku siłowni.
- **L2 Liczba pojedyncza dla ćwiczeń liczonych w powtórzeniach:** „Lunges” → „Lunge”, „Shrugs” → „Shrug”, „Burpees” → „Burpee”. Słowo po „with”/„on”/„to” zostaje w naturalnej liczbie („… with Alternating Oblique Twists”). **Wyjątek (konwencja):** ćwiczenia ciągłe z wzorca mobilność/kondycja, których nazwa żyje w liczbie mnogiej: *Circles, Swings, Jumping Jacks, Mountain Climbers, High Knees* (13 nazw, zamknięta lista). Nazwy własne konkurencji też zostają („Power Stairs”). Patrz pytanie P2.
- **L3 Nazwa zwyczajowa ruchu, gdy jest powszechna:** „Triceps Dips (Bench)” → „Bench Dip”, „Chest Fly (Dumbbell)” → „Dumbbell Fly”, „Biceps Curl (Dumbbell)” → „Dumbbell Curl” (jak Barbell Curl, Cable Curl).

**S — przyrząd i dopiski**
- **S1 Przyrząd jako przedrostek, nie w nawiasie:** „Bench Press (Dumbbell)” → „Dumbbell Bench Press”, „Preacher Curl (EZ)” → „EZ-Bar Preacher Curl”. *Dlaczego:* tak się mówi („dumbbell bench press”), adres nie zawiera nawiasu, a nazwa nie miesza języków (dziś 75 kluczy z polskim nawiasem). Lista przedrostków: Barbell, Dumbbell, Kettlebell, Double Kettlebell, Cable, Dual-Cable, Band, EZ-Bar, Trap Bar, Smith Machine, Machine, Landmine, Medicine Ball, Stability Ball, Plate, Sled, Treadmill, Balance Dome.
- **S2 Sztanga domyślna w klasycznych bojach** (konwencja, jak w języku siłowni): bez „Barbell” w Bench Press, Incline/Decline/Close-Grip/Wide-Grip Bench Press, Floor Press, Deadlift, Romanian Deadlift, Stiff-Legged Deadlift, Overhead Press, Bent-Over Row, Hip Thrust (i w nazwach, które już dziś nie mają przyrządu: Back/Front Squat, Good Morning, boje olimpijskie). Gdzie indziej sztanga jawnie: „Barbell Shrug”, „Barbell Lunge”, „Barbell Glute Bridge”. Patrz pytanie P3.
- **S3 Nawias opisowy znika:** staje się członem nazwy („Hip Circles (Prone)” → „Prone Hip Circles”, „Leg Swings (Front-to-Back)” → „Front-to-Back Leg Swings”), dopiskiem „with …” dla akcesoriów spoza listy S1 („Sled Drag with Harness”, „Farmer's Walk with Handles”) albo jest usuwany, gdy powtarza nazwę („See-Saw Press (Alternating Side Press)” → „See-Saw Press”).
- **S4 Bez separatora „ - ”:** „Push Press - Behind the Neck” → „Push Press Behind the Neck”, „Crunch - Hands Overhead” → „Crunch with Hands Overhead”.

**K — kolejność członów**
- **K1 Pozycja/ławka → jednostronność → chwyt → przyrząd → ruch.** Przykłady: „Seated Dumbbell Shoulder Press”, „Lying Single-Arm Dumbbell Triceps Extension”, „Incline Close-Grip Push-Up”, „Close-Grip Smith Machine Bench Press”. Przyrząd zawsze tuż przed ruchem: „Dumbbell Seated Box Jump” → „Seated Dumbbell Box Jump”. Przymiotnik należący do nazwy ruchu zostaje przy nim (Romanian, Sumo, Bulgarian, Stiff-Legged, Concentration). *Konwencja* zgodna z najczęstszym szykiem angielskim; dziś 16 nazw ma przyrząd przed pozycją, a 28 odwrotnie.
- **K3 Dopowiedzenie miejsca lub toru po nazwie ruchu:** „… Behind the Neck”, „… Behind the Back”, „… to Overhead”, „… with Rotation”.
- **K4 Bez dopowiedzeń domyślnych:** „Flat Bench” przy hantlowej rozpiętce, „On the Floor” przy skłonach bocznych, „Lying Supine” (podwójne). Zostają, gdy odróżniają warianty („Flat Bench Cable Fly”).

**E — zapis przyrządów**
- **E1 Jeden zapis:** EZ-Bar (nie EZ Bar / (EZ)), Smith Machine (nie Smith), Stability Ball (nie Exercise Ball).
- **E3 „Dual-Cable”** dla dwóch niezależnych linek (dziś „(Two Cables)”, „(home)”).
- **E4 „Cable” zamiast „Pulley”:** „High Cable”, „Low Cable” (jedno słowo na wyciąg; tak mówi się na siłowni).
- **E5 „Machine” zamiast „Leverage”** (styl importu z bazy publicznej; na siłowni „machine shrug”, „machine high row”).

**A, F, N — skróty, rolowanie, eponimy**
- **A1 Bez skrótów w nazwie kanonicznej:** RDL → Romanian Deadlift. Skrót zostaje aliasem w wyszukiwarce. Wyjątki: GHD, JM Press, IT Band (nie ma potocznej pełnej formy).
- **F1 Rolowanie: „<obszar> Foam Roll”** w liczbie pojedynczej i potocznie: „Quad Foam Roll”, „Lat Foam Roll”, „IT Band Foam Roll” (dziś dwa schematy: „-SMR” ×8 i „Foam Roll:” ×2). „Foot Roll” bez wałka (ćwiczenie nie wymaga wałka).
- **N1 Eponimy:** forma oryginalna, wielką literą, bez dopisków („Arnold Press”, „Zottman Curl”, „Pendlay Row”, „Pallof Press”, „JM Press”). Dopełniacz z apostrofem tylko tam, gdzie jest ustalony („Farmer's Walk”, „World's Greatest Stretch”). Eponimy i nazwy z markami sprawdza badacz (sekcja 3); przewodnik ich nie rozstrzyga.

**Strażnik (propozycja do wdrożenia razem z krokiem):** test regex na nazwach kanonicznych: brak „(”, „ - ”, „/”, „Flye”, „Skullcrusher”, „Push Up”, „One-Arm”, „SMR”, „Leverage”, „Pulley”; słowa funkcyjne zgodnie z W1; liczba mnoga tylko z listy wyjątków L2; brak duplikatów po złożeniu (fold) nazw.

## 2. Tabela proponowanych zmian

**Zmienia się 267 z 709 nazw** widocznych po angielsku (442 bez zmian). Liczba wystąpień reguł (jedna nazwa może mieć kilka): A1 5, E1 4, E3 2, E4 4, E5 8, F1 10, H1 22, H2 27, H3 44, K1 33, K3 5, K4 4, L1 5, L2 42, L3 4, P4 2, S1 83, S2 10, S3 7, S4 7, W0 3, W1 27, W2 2.
Z tego 77 to dzisiejsze klucze z polskim nawiasem lub polską nazwą (wszystkich takich kluczy jest 85); dodatkowo **8 kluczy** ma już dobrą nazwę EN, ale klucz po polsku albo z marką — w ścieżce A (zmiana kluczy, sekcja 4) też wymagają kroku: Wyciskanie nad głowę (linki) → Cable Overhead Press (fd65aaf3), Łydki na stopniu → Calf Raise on Step (def8bdc4), Bieg → Running (549e67ad), Rower → Cycling (1292a0f7), Assault Bike → Air Bike (3014b76c), Skakanka → Jump Rope (603e45e5), Orbitrek → Elliptical (4f579a33), Ski Erg → Ski Ergometer (4efc71a1).
Wariant z „One-Arm” zamiast „Single-Arm” (P1) daje ok. 14 zmian mniej; wariant P2 „zawsze liczba pojedyncza (poza High Knees)” — ok. 9 więcej; wariant „liczba bez zmian” — ok. 40 mniej.
Duplikatów po zmianie: 0 (porównanie bez wielkości liter); żadna nowa nazwa nie pokrywa się z dawnym kluczem z `catalog-step-2026-10-09.json` (renamed/merged/removed).
Tabela powstała skryptem z ręczną listą wyjątków (90 wpisów); przed wdrożeniem do przejrzenia przez badacza (nazwy ogólne) i recenzenta lokalizacji (naturalność EN).

| rid | nazwa dziś | nazwa wg przewodnika | reguła |
|---|---|---|---|
| 96e58da0 | Bench Press (Barbell) [Bench Press (sztanga)] | Bench Press | S1, S2 |
| 5b7bf8c4 | Bench Press (Dumbbell) [Bench Press (hantle)] | Dumbbell Bench Press | S1 |
| 1ca50c53 | Incline Bench Press (Barbell) [Incline Bench Press (sztanga)] | Incline Bench Press | S1, S2 |
| 705d017f | Incline Bench Press (Dumbbell) [Incline Bench Press (hantle)] | Incline Dumbbell Bench Press | S1 |
| 0c3fae30 | Chest Fly (Dumbbell) [Chest Fly (hantle)] | Dumbbell Fly | S1, L3 |
| 7ad8aef8 | Standing Cable Press [Wyciskanie na linkach (stojąc)] | Standing Cable Chest Press | W0 |
| de556ca6 | Push Up | Push-Up | H1 |
| 6494e666 | Incline Push Up | Incline Push-Up | H1 |
| e4b2b8ff | Diamond Push Up | Diamond Push-Up | H1 |
| 8d99cc4f | Deadlift (Barbell) [Deadlift (sztanga)] | Deadlift | S1, S2 |
| 02956c6a | Deadlift (Dumbbell) [Deadlift (hantle)] | Dumbbell Deadlift | S1 |
| e89a5985 | RDL (Barbell) [RDL (sztanga)] | Romanian Deadlift | S1, A1, S2 |
| 2368ad5c | RDL (Dumbbell/Cable) [RDL (hantle/linki)] | Dumbbell or Cable Romanian Deadlift | A1, S1, P4 |
| 67c3d038 | Bent Over Row (Barbell) [Bent Over Row (sztanga)] | Bent-Over Row | H2, S1, S2 |
| 523c030b | Bent Over Row (Dumbbell) [Bent Over Row (hantle)] | Dumbbell Bent-Over Row | H2, S1 |
| 204baa77 | One Arm Row (Dumbbell) [One Arm Row (hantle)] | Single-Arm Dumbbell Row | H3, S1 |
| 16c65d57 | Chest Supported Row | Chest-Supported Row | H2 |
| 662edea9 | Seated Cable Row (home) [Wiosłowanie na linkach (siedząc)] | Seated Dual-Cable Row | W0, E3 |
| 20273872 | Straight Arm Pulldown | Straight-Arm Pulldown | H2 |
| 7d083969 | Chin Up | Chin-Up | H1 |
| 944dc0f9 | Pull Up | Pull-Up | H1 |
| 7e46f9ec | Neutral Grip Pull Up | Neutral-Grip Pull-Up | H1, H2 |
| e7477f1c | Shrugs (Dumbbell) [Shrugs (hantle)] | Dumbbell Shrug | L2, S1 |
| 8bdff5bd | Shrugs (Barbell) [Shrugs (sztanga)] | Barbell Shrug | L2, S1 |
| 611efa54 | Overhead Press (Barbell) [Overhead Press (sztanga)] | Overhead Press | S1, S2 |
| 31139c78 | Overhead Press (Dumbbell) [Overhead Press (hantle)] | Dumbbell Overhead Press | S1 |
| 733d3384 | Seated Shoulder Press (Dumbbell) [Seated Shoulder Press (hantle)] | Seated Dumbbell Shoulder Press | S1 |
| ad78370b | Lateral Raise (Dumbbell) [Lateral Raise (hantle)] | Dumbbell Lateral Raise | S1 |
| f6ff5284 | Reverse Fly (Dumbbell) [Reverse Fly (hantle)] | Dumbbell Reverse Fly | S1 |
| d2d5e5f6 | Upright Row (Dumbbell) [Upright Row (hantle)] | Dumbbell Upright Row | S1 |
| 1698f6ee | Biceps Curl (Dumbbell) [Biceps Curl (hantle)] | Dumbbell Curl | S1, L3 |
| 825f0947 | EZ Bar Curl | EZ-Bar Curl | E1 |
| 5d2b92ad | Incline Curl (Dumbbell) [Incline Curl (hantle)] | Incline Dumbbell Curl | S1 |
| a74fe6bd | Concentration Curl (Dumbbell) [Concentration Curl (hantle)] | Dumbbell Concentration Curl | S1 |
| f57b6875 | Skullcrusher (Dumbbell) [Skullcrusher (hantle)] | Dumbbell Skull Crusher | L1, S1 |
| b26dbcbc | Skullcrusher (EZ) | EZ-Bar Skull Crusher | L1, S1 |
| 44ea544b | Triceps Dips (Bench) [Triceps Dips (ławka)] | Bench Dip | L2, S1, L3 |
| 27880c0a | Overhead Triceps Extension (Dumbbell) [Overhead Triceps Extension (hantel)] | Dumbbell Overhead Triceps Extension | S1 |
| 542cb2e7 | Close Grip Bench Press | Close-Grip Bench Press | H2 |
| 775db8cc | Belt Squat (cable) [Przysiad z pasem (linki)] | Cable Belt Squat | W0, S1 |
| a1f69eac | Bulgarian Split Squat (Dumbbell) [Bulgarian Split Squat (hantle)] | Dumbbell Bulgarian Split Squat | S1 |
| a1b79aac | Lunges (Dumbbell) [Lunges (hantle)] | Dumbbell Lunge | L2, S1 |
| cf6131e9 | Walking Lunges | Walking Lunge | L2 |
| ee5538cf | Step Up | Step-Up | H1 |
| 2d9caf62 | Hip Thrust (Barbell) [Hip Thrust (sztanga)] | Hip Thrust | S1, S2 |
| d4dbe8d2 | Hip Thrust (Dumbbell) [Hip Thrust (hantel)] | Dumbbell Hip Thrust | S1 |
| 5569dd47 | Calf Press (leg press) | Leg Press Calf Raise | W1, S1 |
| 64f44c5f | Incline Walk (Treadmill) [Incline Walk (bieżnia)] | Incline Treadmill Walk | S1 |
| 3a3a28c0 | Burpees | Burpee | L2 |
| 9bf70689 | Incline Chest Fly (Dumbbell) [Incline Chest Fly (hantle)] | Incline Dumbbell Fly | S1, L3 |
| 1b06b218 | Decline Bench Press (Dumbbell) [Decline Bench Press (hantle)] | Decline Dumbbell Bench Press | S1 |
| 3524eadb | Floor Press (Dumbbell) [Floor Press (hantle)] | Dumbbell Floor Press | S1 |
| 43c9cf95 | Floor Press (Barbell) [Floor Press (sztanga)] | Floor Press | S1, S2 |
| 0dfe2f27 | Squeeze Press (Dumbbell) [Squeeze Press (hantle)] | Dumbbell Squeeze Press | S1 |
| 9e7eaa9e | Cable Fly (low to high) | Low-to-High Cable Fly | W1, S1, H2 |
| 47eded34 | Cable Fly (high to low) | High-to-Low Cable Fly | W1, S1, H2 |
| 552c95f9 | Single Arm Cable Fly | Single-Arm Cable Fly | H3 |
| dbabc099 | Single Arm Cable Chest Press | Single-Arm Cable Chest Press | H3 |
| f9c3ccee | Decline Push Up | Decline Push-Up | H1 |
| 5873d31d | Smith Machine Incline Press | Incline Smith Machine Press | K1 |
| 7c578e94 | Pullover (Dumbbell) [Pullover (hantel)] | Dumbbell Pullover | S1 |
| dc60e59a | Single Arm Cable Row | Single-Arm Cable Row | H3 |
| 97cbb261 | Bent Over Row (Cable) [Bent Over Row (linki)] | Cable Bent-Over Row | H2, S1 |
| 34d54cf9 | Seal Row (Barbell) [Seal Row (sztanga)] | Barbell Seal Row | S1 |
| 7a961cb3 | Single Arm Lat Pulldown | Single-Arm Lat Pulldown | H3 |
| bd1491cd | Shrugs (Cable) [Shrugs (linki)] | Cable Shrug | L2, S1 |
| 84fadd0f | Single Arm Overhead Press (Dumbbell) [Single Arm Overhead Press (hantel)] | Single-Arm Dumbbell Overhead Press | H3, S1 |
| 632ebf20 | Y Raise (Dumbbell) [Y Raise (hantle)] | Dumbbell Y Raise | S1 |
| 9ba18829 | Upright Row (Cable) [Upright Row (linki)] | Cable Upright Row | S1 |
| 59434aa7 | Upright Row (Barbell) [Upright Row (sztanga)] | Barbell Upright Row | S1 |
| 0f0531b4 | Pike Push Up | Pike Push-Up | H1 |
| ddc7d946 | Handstand Push Up | Handstand Push-Up | H1 |
| a6ad10ed | External Rotation (Cable) [External Rotation (linki)] | Cable External Rotation | S1 |
| c076465a | External Rotation (Dumbbell) [External Rotation (hantel)] | Dumbbell External Rotation | S1 |
| 2fd11628 | Band Pull Apart | Band Pull-Apart | H1 |
| a935f695 | Hammer Curl (Cable) [Hammer Curl (linki)] | Cable Hammer Curl | S1 |
| 1f02eafa | Cable Curl (Two Cables) [Cable Curl (dwie linki)] | Dual-Cable Curl | E3, S1 |
| 1b1b8a70 | Preacher Curl (EZ) | EZ-Bar Preacher Curl | S1 |
| ec5de4bd | Wrist Curl (Dumbbell) [Wrist Curl (hantle)] | Dumbbell Wrist Curl | S1 |
| bb6ad54a | Reverse Wrist Curl (Dumbbell) [Reverse Wrist Curl (hantle)] | Dumbbell Reverse Wrist Curl | S1 |
| 1fe425fa | Single Arm Triceps Pushdown | Single-Arm Triceps Pushdown | H3 |
| 3880d7d2 | Triceps Kickback (Cable) [Triceps Kickback (linki)] | Cable Triceps Kickback | S1 |
| 1e0c1fd4 | Overhead Triceps Extension (EZ) | EZ-Bar Overhead Triceps Extension | S1 |
| b47610c2 | Skullcrusher (Barbell) [Skullcrusher (sztanga)] | Barbell Skull Crusher | L1, S1 |
| f93d6ef4 | Single Leg RDL (Dumbbell) [Single Leg RDL (hantel)] | Single-Leg Dumbbell Romanian Deadlift | H3, S1, A1 |
| 1b164036 | Single Leg RDL (Cable) [Single Leg RDL (linki)] | Single-Leg Cable Romanian Deadlift | H3, S1, A1 |
| 378641ff | Single Leg Press | Single-Leg Press | H3 |
| c5422426 | Split Squat (Cable) [Split Squat (linki)] | Cable Split Squat | S1 |
| d9ffd006 | Sumo Squat (Dumbbell) [Sumo Squat (hantel)] | Dumbbell Sumo Squat | S1 |
| 83ddab84 | Lunges (Barbell) [Lunges (sztanga)] | Barbell Lunge | L2, S1 |
| 78af3c3e | Leg Curl (Dumbbell) [Leg Curl (hantel)] | Dumbbell Leg Curl | S1 |
| 67d23079 | Cable Pull Through | Cable Pull-Through | H1 |
| 56d1492e | Single Leg Glute Bridge | Single-Leg Glute Bridge | H3 |
| 9864f4c8 | Single Leg Hip Thrust | Single-Leg Hip Thrust | H3 |
| dabed9ab | Glute Bridge (Barbell) [Glute Bridge (sztanga)] | Barbell Glute Bridge | S1 |
| 6197a61b | Sumo Deadlift (kettlebell) | Kettlebell Sumo Deadlift | S1 |
| 24086d58 | Single Leg Calf Raise | Single-Leg Calf Raise | H3 |
| 72078974 | Seated Calf Raise (Dumbbell) [Seated Calf Raise (hantle)] | Seated Dumbbell Calf Raise | S1 |
| ca4359a7 | Calf Raise (Barbell) [Calf Raise (sztanga)] | Barbell Calf Raise | S1 |
| c0a99694 | Calf Raise (Cable) [Calf Raise (linki)] | Cable Calf Raise | S1 |
| 745ed79a | Toes to Bar | Toes-to-Bar | H2 |
| fb2bf6d1 | Plank Shoulder Taps | Plank Shoulder Tap | L2 |
| 97859f3e | GHD Sit Up | GHD Sit-Up | H1 |
| 25b112df | Sit Up | Sit-Up | H1 |
| 312cd4e3 | Rollout (Barbell) [Rollout (sztanga)] | Barbell Rollout | S1 |
| 6423ce3d | Side Bend (Dumbbell) [Side Bend (hantel)] | Dumbbell Side Bend | S1 |
| 40af8b81 | Turkish Get Up | Turkish Get-Up | H1 |
| d1e40214 | Overhead Carry (Dumbbell) [Overhead Carry (hantle)] | Dumbbell Overhead Carry | S1 |
| 4bb003a0 | Farmer's Walk (trap bar) | Trap Bar Farmer's Walk | W1, S1 |
| 3fe0adbb | Snatch (Dumbbell) [Snatch (hantel)] | Dumbbell Snatch | S1 |
| d47706a4 | Thruster (Dumbbell) [Thruster (hantle)] | Dumbbell Thruster | S1 |
| 6f635cdd | Single Arm RDL (Dumbbell/Cable) [Single Arm RDL (hantel/linka)] | Single-Arm Dumbbell or Cable Romanian Deadlift | H3, A1, S1, P4 |
| 95bf2bee | Belt Squat Machine | Machine Belt Squat | E5 |
| 63d95e34 | Around The Worlds | Around the World | L2, W1 |
| a984f904 | One-Arm Flat Bench Dumbbell Fly | Single-Arm Dumbbell Fly | H3, K1, K4 |
| cb32257c | One-Arm Kettlebell Floor Press | Single-Arm Kettlebell Floor Press | H3 |
| 885d95e9 | One Arm Dumbbell Bench Press | Single-Arm Dumbbell Bench Press | H3 |
| b37aae3e | Wide-Grip Barbell Bench Press | Wide-Grip Bench Press | S2 |
| ce60e956 | Front Raise And Pullover | Front Raise and Pullover | W1 |
| 9c596b89 | Wide-Grip Decline Barbell Pullover | Decline Wide-Grip Barbell Pullover | K1 |
| ddda27bc | Smith Machine Decline Press | Decline Smith Machine Press | K1 |
| 1c9abcb6 | Leverage Decline Chest Press | Decline Machine Chest Press | E5, K1 |
| aa94afd5 | Leverage Incline Chest Press | Incline Machine Chest Press | E5, K1 |
| bf2d1c87 | Push-Up Wide | Wide-Grip Push-Up | H2, K1 |
| 93c0dbeb | Push Up to Side Plank | Push-Up to Side Plank | H1 |
| 7aae4083 | Isometric Wipers | Isometric Wiper | L2 |
| 0d11e220 | Push-Ups With Feet On A Stability Ball | Push-Up with Feet on a Stability Ball | L2, W1 |
| ed1d368f | Incline Push-Up Reverse Grip | Incline Reverse-Grip Push-Up | H2, K1 |
| 35a6d7e7 | Plyo Kettlebell Push-Ups | Plyo Kettlebell Push-Up | L2 |
| af2c053b | Barbell Shrug Behind The Back | Barbell Shrug Behind the Back | W1, K3 |
| cf4d620c | Calf-Machine Shoulder Shrug | Calf Raise Machine Shrug | E5 |
| 8b7add2d | Full Range-Of-Motion Lat Pulldown | Full-Range-of-Motion Lat Pulldown | W1, H2 |
| afe3a485 | Gironda Sternum Chins | Gironda Sternum Chin-Up | L2, H1 |
| 69a9b809 | Muscle Up | Muscle-Up | H1 |
| 4691a85c | Kneeling High Pulley Row | Kneeling High Cable Row | E4 |
| 04c94607 | Leverage High Row | Machine High Row | E5 |
| 9bfac6b8 | Leverage Shrug | Machine Shrug | E5 |
| 20008e9f | London Bridges | London Bridge | L2 |
| 9c5c8269 | Mixed Grip Chin | Mixed-Grip Chin-Up | H2, H1 |
| d8d3e457 | One Arm Chin-Up | Single-Arm Chin-Up | H3 |
| 7fa8f6ab | Reverse Grip Bent Over Row | Reverse-Grip Bent-Over Row | H2 |
| a1d8a3f4 | Seated Good Mornings | Seated Good Morning | L2 |
| 76c15d28 | Side To Side Chins | Side-to-Side Chin-Up | H2, L2, H1 |
| 77e6e36b | Smith Machine Behind the Back Shrug | Smith Machine Shrug Behind the Back | K3 |
| e7a45505 | Smith Machine Bent Over Row | Smith Machine Bent-Over Row | H2 |
| 642b731d | Wide-Grip Pulldown Behind The Neck | Wide-Grip Pulldown Behind the Neck | W1 |
| 801042da | Standing Barbell Press Behind Neck | Standing Barbell Press Behind the Neck | K3 |
| dd0f5355 | Push Press - Behind the Neck | Push Press Behind the Neck | S4, K3 |
| 51003b6d | See-Saw Press (Alternating Side Press) | See-Saw Press | S3 |
| 3a1c6fa3 | Kettlebell Seated Press | Seated Kettlebell Press | K1 |
| 981bcd94 | One-Arm Kettlebell Push Press | Single-Arm Kettlebell Push Press | H3 |
| 6a629f47 | One-Arm Kettlebell Jerk | Single-Arm Kettlebell Jerk | H3 |
| 35dbdf07 | One-Arm Kettlebell Split Jerk | Single-Arm Kettlebell Split Jerk | H3 |
| 335afd0d | One-Arm Lateral Raise (Dumbbell) [One-Arm Lateral Raise (hantel)] | Single-Arm Dumbbell Lateral Raise | H3, S1 |
| d233159f | One-Arm Incline Lateral Raise | Incline Single-Arm Lateral Raise | H3, K1 |
| c5cb8d5f | Cable Seated Lateral Raise | Seated Cable Lateral Raise | K1 |
| 3b3e81a0 | Front Incline Dumbbell Raise | Incline Dumbbell Front Raise | K1 |
| 5ce9183e | Straight Raises on Incline Bench | Straight-Arm Raise on Incline Bench | H2, L2 |
| 31591a9d | Car Drivers | Car Driver | L2 |
| 50bc3b67 | Kettlebell Pirate Ships | Kettlebell Pirate Ship | L2 |
| 4106a799 | Dumbbell Incline Shoulder Raise | Incline Dumbbell Shoulder Raise | K1 |
| ffb52b77 | Barbell Incline Shoulder Raise | Incline Barbell Shoulder Raise | K1 |
| 9809553d | Smith Incline Shoulder Raise | Incline Smith Machine Shoulder Raise | E1, K1 |
| 694dda48 | Dumbbell One-Arm Upright Row | Single-Arm Dumbbell Upright Row | H3, K1 |
| 958466f1 | Smith Machine One-Arm Upright Row | Single-Arm Smith Machine Upright Row | H3, K1 |
| e49d2ee2 | Dumbbell Lying One-Arm Rear Lateral Raise | Lying Single-Arm Dumbbell Rear Lateral Raise | H3, K1 |
| da21f0e6 | Reverse Flyes With External Rotation | Reverse Fly with External Rotation | L1, W1 |
| 507c30f5 | One-Arm Cable Rear Lateral Raise | Single-Arm Cable Rear Lateral Raise | H3 |
| a222cb10 | Cable Rope Rear-Delt Rows | Cable Rope Rear Delt Row | L2, H2 |
| b019145e | Sled Reverse Flye | Sled Reverse Fly | L1 |
| 8a23bdef | Isometric Neck Exercise - Front And Back | Front and Back Isometric Neck Hold | W1, S4 |
| d4ce5863 | Isometric Neck Exercise - Sides | Side Isometric Neck Hold | S4 |
| 6adf17da | Lying Neck Extension (Plate) [Lying Neck Extension (talerz)] | Lying Plate Neck Extension | S1 |
| 4c462d13 | Lying Neck Flexion (Plate) [Lying Neck Flexion (talerz)] | Lying Plate Neck Flexion | S1 |
| e232b4a2 | One-Arm Kettlebell Clean and Jerk | Single-Arm Kettlebell Clean and Jerk | H3 |
| d7562db2 | Spider Curl (Barbell) [Spider Curl (sztanga)] | Barbell Spider Curl | S1 |
| d4b0e33c | Seated Close-Grip Concentration Barbell Curl | Seated Close-Grip Barbell Concentration Curl | K1 |
| 5eef847c | Lying Supine Dumbbell Curl | Lying Dumbbell Curl | K4 |
| 07e2f1b5 | One Arm Dumbbell Preacher Curl | Single-Arm Dumbbell Preacher Curl | H3 |
| 41c7a764 | Standing One-Arm Cable Curl | Standing Single-Arm Cable Curl | H3 |
| 75d5b41f | Lying Close-Grip Bar Curl On High Pulley | Lying Close-Grip High Cable Curl | W1, E4, K1 |
| cc90844e | Dumbbell Lying Pronation | Lying Dumbbell Pronation | K1 |
| 76807381 | Dumbbell Lying Supination | Lying Dumbbell Supination | K1 |
| 936fa312 | One-Arm Dumbbell Wrist Curl | Single-Arm Dumbbell Wrist Curl | H3 |
| 4ce2b3bb | One-Arm Dumbbell Reverse Wrist Curl | Single-Arm Dumbbell Reverse Wrist Curl | H3 |
| cd8ff968 | Behind-the-Back Barbell Wrist Curl | Barbell Wrist Curl Behind the Back | K3 |
| 90efde25 | Reverse Plate Curls | Reverse Plate Curl | L2 |
| d17ab165 | Bottoms-Up Clean From The Hang Position | Bottoms-Up Clean from the Hang Position | W1 |
| 1cc1afe1 | Farmer's Walk (Farmers Handles) | Farmer's Walk with Handles | S3 |
| 7869708c | Smith Machine Close-Grip Bench Press | Close-Grip Smith Machine Bench Press | K1 |
| 5d75f0eb | Reverse Grip Bench Press | Reverse-Grip Bench Press | H2 |
| 3ff5abd3 | Decline Close-Grip Bench To Skull Crusher | Decline Close-Grip Bench to Skull Crusher | W1 |
| 6aa2a1b2 | Decline EZ Bar Triceps Extension | Decline EZ-Bar Triceps Extension | E1 |
| 3cf07a53 | Lying Close-Grip Barbell Triceps Extension Behind The Head | Lying Close-Grip Barbell Triceps Extension Behind the Head | W1 |
| 8affff26 | One-Arm Lying Dumbbell Triceps Extension | Lying Single-Arm Dumbbell Triceps Extension | H3, K1 |
| 93597271 | Dumbbell One-Arm Triceps Extension | Single-Arm Dumbbell Triceps Extension | H3, K1 |
| 4834c347 | Cable Incline Triceps Extension | Incline Cable Triceps Extension | K1 |
| 2ab572ee | Cable Lying Triceps Extension | Lying Cable Triceps Extension | K1 |
| 677ec4e5 | Reverse Grip Triceps Pushdown | Reverse-Grip Triceps Pushdown | H2 |
| 8dc5d40d | Standing Low-Pulley One-Arm Triceps Extension | Standing Single-Arm Low Cable Triceps Extension | H3, E4, K1 |
| 7fb124e0 | Dip Machine | Machine Dip | E5 |
| 9f094399 | Ring Dips | Ring Dip | L2 |
| 8cd4a246 | Incline Push-Up Close-Grip | Incline Close-Grip Push-Up | H2, K1 |
| 492cc23c | Barbell Step Up | Barbell Step-Up | H1 |
| 46a62c92 | Bulgarian Split Squat (Barbell) [Bulgarian Split Squat (sztanga)] | Barbell Bulgarian Split Squat | S1 |
| 30a1285c | One-Arm Overhead Kettlebell Squat | Single-Arm Overhead Kettlebell Squat | H3 |
| 6df50c2d | Leverage Deadlift | Machine Deadlift | E5 |
| 7b4e7fd3 | One-Arm Side Deadlift | Single-Arm Side Deadlift | H3 |
| dd6cdae1 | Sled Drag (Harness) | Sled Drag with Harness | S3 |
| 19d77038 | Alternate Leg Diagonal Bound | Alternate-Leg Diagonal Bound | H2 |
| d248db72 | Alternate Leg Push-Off | Alternate-Leg Push-Off | H2 |
| 30c617b6 | Single Leg Push-Off | Single-Leg Push-Off | H3 |
| 932e4ff6 | Side to Side Box Shuffle | Side-to-Side Box Shuffle | H2 |
| 31398221 | Dumbbell Seated Box Jump | Seated Dumbbell Box Jump | K1 |
| fe035e03 | Double Leg Butt Kick | Double-Leg Butt Kick | H2 |
| de2b172e | Single Leg Butt Kick | Single-Leg Butt Kick | H3 |
| 7f1675a4 | Front Cone Hops | Front Cone Hop | L2 |
| 5b8f4c58 | Barbell Seated Calf Raise | Seated Barbell Calf Raise | K1 |
| 039fb885 | Downward Facing Balance | Downward-Facing Balance | H2 |
| e564de06 | Dumbbell Seated One-Leg Calf Raise | Seated Single-Leg Dumbbell Calf Raise | H3, K1 |
| 9b1284f1 | Prone Flutter Kicks | Prone Flutter Kick | L2 |
| 2eb9fd0d | Lateral Cone Hops | Lateral Cone Hop | L2 |
| 749eac95 | One-Arm Kettlebell Swings | Single-Arm Kettlebell Swing | H3, L2 |
| 14b913df | Stiff-Legged Barbell Deadlift | Stiff-Legged Deadlift | S2 |
| 0a1674dd | Alternate Heel Touchers | Alternate Heel Toucher | L2 |
| 2cfc60fd | Cable Crunch With Side Bends (Balance Dome) [Bosu Ball Cable Crunch With Side Bends] | Balance Dome Cable Crunch with Side Bend | W1, S1, L2 |
| 1a93b54c | Butt-Ups | Butt-Up | L2 |
| 5009c6d1 | Cable Russian Twists | Cable Russian Twist | L2 |
| 16adfc49 | Cable Seated Crunch | Seated Cable Crunch | K1 |
| 40c9ad54 | Cocoons | Cocoon | L2 |
| eca0e693 | Crunch - Hands Overhead | Crunch with Hands Overhead | S4 |
| 2222b356 | Crunch - Legs On Exercise Ball | Crunch with Legs on Stability Ball | W1, E1, S4 |
| 6db844b2 | Frog Sit-Ups | Frog Sit-Up | L2 |
| 92fe6eee | Gorilla Chin/Crunch | Gorilla Chin-Up Crunch | H1, W2 |
| 9abbde89 | Kneeling Cable Crunch With Alternating Oblique Twists | Kneeling Cable Crunch with Alternating Oblique Twists | W1 |
| 03686829 | Oblique Crunches - On The Floor | Oblique Crunch | L2, W1, S4, K4 |
| 8eaa2b4d | One-Arm High-Pulley Cable Side Bends | Single-Arm High Cable Side Bend | H3, L2, E4 |
| 9fd1e9dd | One-Arm Medicine Ball Slam | Single-Arm Medicine Ball Slam | H3 |
| 2da9e334 | Pallof Press With Rotation | Pallof Press with Rotation | W1 |
| bd10f542 | Seated Flat Bench Leg Pull-In | Seated Leg Pull-In | K4 |
| 4ba92053 | Sledgehammer Swings | Sledgehammer Swing | L2 |
| b717035f | Supine One-Arm Overhead Throw | Supine Single-Arm Overhead Throw | H3 |
| 66d0cd90 | Weighted Sit-Ups - With Bands | Weighted Sit-Up with Bands | L2, W1, S4 |
| ad768106 | Chest And Front Of Shoulder Stretch | Chest and Front of Shoulder Stretch | W1 |
| 3785f29d | Chin To Chest Stretch | Chin to Chest Stretch | W1 |
| ccdd5ed5 | Leg Swings (Front-to-Back) | Front-to-Back Leg Swings | S3 |
| 532e55f3 | Groiners | Groiner | L2 |
| 0c03a774 | Hip Circles (Prone) | Prone Hip Circles | S3 |
| 2e7bea95 | Iron Crosses (Stretch) | Iron Cross Stretch | L2, S3 |
| e2b8c7c1 | One Knee To Chest | One Knee to Chest | W1 |
| f0cd6c32 | Round The World Shoulder Stretch | Round the World Shoulder Stretch | W1 |
| abcb0603 | Leg Swings (Side-to-Side) | Side-to-Side Leg Swings | S3 |
| 26d6e32c | Standing Soleus And Achilles Stretch | Standing Soleus and Achilles Stretch | W1 |
| cfeccd0f | Standing Toe Touches | Standing Toe Touch | L2 |
| 22910680 | The Straddle | Straddle Stretch | W2 |
| 3c85132c | Adductor-SMR | Adductor Foam Roll | F1 |
| 2b5a4aa5 | Calves-SMR | Calf Foam Roll | F1 |
| f38daa87 | Foam Roll: Hamstrings | Hamstring Foam Roll | F1 |
| 7099e219 | Iliotibial Tract-SMR | IT Band Foam Roll | F1 |
| 564a122f | Latissimus Dorsi-SMR | Lat Foam Roll | F1 |
| 90486bc9 | Peroneals-SMR | Peroneal Foam Roll | F1 |
| ac9e7cd6 | Piriformis-SMR | Piriformis Foam Roll | F1 |
| 577cc0a0 | Foam Roll: Quadriceps | Quad Foam Roll | F1 |
| 7deb94b3 | Rhomboids-SMR | Upper Back Foam Roll | F1 |
| f9dd2033 | Foot-SMR | Foot Roll | F1 |
| 7dc2a266 | Frog Hops | Frog Hop | L2 |
| 310772dc | Toe Touchers | Toe Toucher | L2 |

## 3. Nazwy z możliwym znakiem towarowym lub marką — do sprawdzenia przez badacza

Nie rozstrzygam prawnie. Zasada repo: nazwy innych marek nie w tekstach aplikacji ani w opisie sklepu (CLAUDE.md, „Treści cudze i nazwy innych firm”; wytyczne Apple 2.3.7 i 5.2.1). Dziś `LIB_DISPLAY_NAME` zastępuje tylko 3 nazwy, a klucz z marką trafia do pola `id` eksportu strony (K-16). Propozycja nazwy opisowej jest wstępna; każdą pozycję oznaczam „do sprawdzenia przez badacza”.

| rid | nazwa dziś (klucz) | co budzi wątpliwość | propozycja opisowa | stan |
|---|---|---|---|---|
| 3014b76c | Assault Bike (EN dziś: Air Bike) | nazwa producenta i produktu | Air Bike (już w `EX_FULL`); klucz do zmiany w ścieżce A | do sprawdzenia przez badacza |
| 4efc71a1 | Ski Erg (EN dziś: Ski Ergometer) | nazwa produktu producenta ergometrów | Ski Ergometer (już); klucz do zmiany | do sprawdzenia przez badacza |
| 2cfc60fd | Bosu Ball Cable Crunch With Side Bends | znak towarowy półkuli | Balance Dome Cable Crunch with Side Bend (tabela) | do sprawdzenia przez badacza |
| 4f579a33 | Orbitrek (EN dziś: Elliptical) | w Polsce nazwa zwyczajowa, pierwotnie marka | EN: Elliptical; PL: „Orbitrek” — sprawdzić, czy forma potoczna jest bezpieczna, alternatywa „Trenażer eliptyczny” | do sprawdzenia przez badacza |
| e00cfccd | Pec Deck | pierwotnie nazwa maszyny producenta, dziś powszechna | Machine Fly | do sprawdzenia przez badacza |
| 0558deba | Reverse Pec Deck | jw. | Machine Reverse Fly | do sprawdzenia przez badacza |
| 3282a5bd | Battle Ropes | nazwa metody/sprzętu bywa zastrzegana | Rope Waves albo Battle Rope Waves | do sprawdzenia przez badacza |
| a7078fe5 | Conan's Wheel | imię postaci z utworu chronionego | Strongman Wheel Carry | do sprawdzenia przez badacza |
| 1de768bc, 128a749b | Landmine Linear Jammer, Single-Arm Linear Jammer | „Jammer” jako nazwa sprzętu producenta | Landmine Jammer Press, Single-Arm Landmine Jammer Press (albo bez zmian, jeśli nazwa ogólna) | do sprawdzenia przez badacza |
| 1993b006 | Superman | imię postaci, znak towarowy wydawcy | Prone Back Extension Hold albo „Superman” (powszechne w siłowni) | do sprawdzenia przez badacza |
| 8a61bcd6 | Stair Climber | nazwa ogólna (nie nazwa produktu) — tylko potwierdzić | bez zmian | do sprawdzenia przez badacza |
| 4bb29ac2, 7fbc8ebe | Arnold Press, Kettlebell Arnold Press | imię osoby publicznej | bez zmian albo Rotating Dumbbell Press | do sprawdzenia przez badacza |
| 16a15188 | Pendlay Row | nazwisko trenera, też nazwa marki sprzętu | bez zmian albo Dead-Stop Barbell Row | do sprawdzenia przez badacza |
| 3df27a14 | Bayesian Curl | nazwa nadana przez konkretnego autora | bez zmian albo Behind-the-Body Cable Curl | do sprawdzenia przez badacza |
| różne | eponimy: Zottman, Meadows, JM, Tate, Svend, Gironda, Bradford, Janda, Otis, Pallof, Jefferson, Zercher, Cuban, Copenhagen | nazwiska / nazwy miejsc w nazwie ćwiczenia | bez zmian (eponim ogólnie używany), chyba że badacz znajdzie zastrzeżenie | do sprawdzenia przez badacza |

## 4. Skutki zmiany nazw (opis, bez wdrożenia)

Klucz katalogu = nazwa (K-02). `rid` jest stały (709/709), ale nie jest kluczem danych użytkownika, eksportu ani adresów strony.

**Ścieżka A — zmiana kluczy (krok katalogu).** Nowy plik kroku (wzór `docs/research/equipment/catalog-step-2026-10-09.json`, pole `renamed`: dawny klucz → nowy), wczytywany przez `lib/seed.ts` (`CATALOG_STEP.renamed` → `LIB_RENAMED`, linia ~226) i stosowany przez migrację (`lib/state/migrate-catalog.ts`) do ćwiczeń, treningów, szablonów i historii użytkownika. Dawne nazwy same trafiają do wyszukiwarki (`formerNamesOf`/`formerMatch`). Zakres: 267 + 8 = **275 kluczy**. Trzeba też przenieść każdy plik kluczowany nazwą: `lib/cues/data.json`, `cue-sets.json`, `lib/figures/data.json`, `poses/*.json`, rejestr twierdzeń (hash brzmienia), `EX_PAREN`/`EX_FULL`/`LIB_DISPLAY_NAME`, scenariusze Maestro i testy (np. „Bench Press (sztanga)” występuje dziś w 190 plikach repo). Do tego: polski wygląd nazw (dziś PL pokazuje klucz z polskim nawiasem — po zmianie potrzebna osobna mapa PL), import CSV po starej nazwie (alias), kopie zapasowe z poprzedniej wersji (test migracji na kopii 1.0), BRD i macierz. Ryzyko: migracja danych — zasada zero utraty danych i test na kopii bazy poprzedniej wersji.

**Ścieżka B — warstwa nazw wyświetlanych (bez zmiany kluczy).** Pole `nameEn` w katalogu (albo mapa `rid` → nazwa EN), `exName` dla języków innych niż PL zwraca `nameEn`; eksport strony używa `rid` jako `id`, slug z `nameEn`, potem zamrożenie w `slugs.lock.json`. Bez migracji danych użytkownika; stare nazwy EN jako aliasy wyszukiwania. Koszt: rozjazd klucz ≠ nazwa EN zostaje w kodzie (jak dziś `LIB_DISPLAY_NAME`, tylko kompletny). To wariant 6.3 B z analizy.

W obu ścieżkach: strona — dopóki `slugs.lock.json` jest pusty, zmiana nic nie kosztuje; po pierwszej publikacji każda zmiana nazwy wymaga przekierowania. Zmiana wyświetlanej nazwy dotyka też VoiceOver (`exNameLang`), zrzutów ekranu i scenariuszy E2E szukających po tekście.

## 5. Otwarte pytania (do decyzji)

- **P1 Jednostronność.** (a) „Single-Arm”/„Single-Leg” wszędzie — jeden wzór, 267 zmian; (b) „One-Arm” + „Single-Leg” (najczęstsze dziś w każdej grupie) — ok. 14 zmian mniej, ale dwa wzory. **Rekomendacja: (a)** — konwencja, ale jeden wzór ułatwia przekład i strażnika.
- **P2 Liczba.** (a) pojedyncza, wyjątek: ćwiczenia ciągłe mobilność/kondycja (13 nazw, lista zamknięta); (b) zawsze pojedyncza poza „High Knees” — ok. 9 zmian więcej, „Arm Circle” brzmi sztucznie; (c) bez zmian liczby — ok. 40 zmian mniej, zostaje mieszanina. **Rekomendacja: (a)** — najbliżej mowy trenera i nadal sprawdzalne testem.
- **P3 Sztanga domyślna.** (a) bez „Barbell” w klasycznych bojach (lista S2) — naturalnie („bench press”); (b) zawsze „Barbell …” — pełna symetria z „Dumbbell …”, dłuższe nazwy i adresy. **Rekomendacja: (a).**
- **P4 Ćwiczenia z dwoma przyrządami do wyboru** (2368ad5c, 6f635cdd: hantle albo linka). (a) „Dumbbell or Cable Romanian Deadlift” (w tabeli); (b) rozdzielić na dwa ćwiczenia — czyste nazwy, ale zmiana danych i historia użytkownika (scalenie/podział przez krok katalogu); (c) „Dumbbell Romanian Deadlift” z aliasem „cable” — krótko, ale nazwa nie mówi o wariancie z linką. **Rekomendacja: (a) teraz, (b) do backlogu 1.2.**
- **P5 Ścieżka wdrożenia.** (A) zmiana kluczy z migracją — czyste dane, 275 kluczy, ryzyko migracji; (B) warstwa `nameEn` po `rid` — bez migracji, szybciej przed zamrożeniem adresów. **Rekomendacja: (B) w 1.1**, (A) ewentualnie razem z porządkami katalogu w osobnym wydaniu (nie łączyć z aktualizacją SDK).
- Do sprawdzenia przez badacza: wszystkie pozycje sekcji 3; potwierdzenie słownikowe H1; nazwy nowe w W0/L3/F1/E5 („Seated Dual-Cable Row”, „Machine Deadlift”, „Upper Back Foam Roll” dla „Rhomboids-SMR”, „Calf Raise Machine Shrug”).
- Do przeglądu przez recenzenta lokalizacji (naturalność EN, native speaker): kolejność K1 w nazwach z trzema określeniami (np. „Incline Single-Arm Lateral Raise”, „Lying Single-Arm Dumbbell Rear Lateral Raise”), „Front and Back Isometric Neck Hold”, „Farmer's Walk with Handles”.

**Nowe terminy dziedzinowe do słownika** (`docs/lokalizacja/slownik-terminow.json`, przy wdrożeniu razem z testem): Single-Arm/Single-Leg, Dual-Cable, Foam Roll, EZ-Bar, Smith Machine — jako terminy kanoniczne nazw EN (dziś słownik nie ma nazw ćwiczeń).
