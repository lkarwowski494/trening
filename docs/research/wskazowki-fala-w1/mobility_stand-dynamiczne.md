# Wskazówki techniki — `mobility_stand`, część: ruchy dynamiczne (metryka: powtórzenia)

Data: 02.11.2026. Autor: badacz-merytoryczny (agent). Fala W1, grupa G2 (mobilność).

**Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/cues.json`.** Wpis do danych robi koordynator/programista.

**Metoda.** Dla każdego ćwiczenia czytałem strony i PDF-y (WebFetch / odczyt pobranego PDF) organizacji szkolących trenerów, szpitali, uczelni
i agend sportowych; zdanie trafia do bloku JSON tylko wtedy, gdy potwierdzają je ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji
(wyjątek dla wskazówek techniki, CLAUDE.md, 25.10.2026). Wariant tego samego ćwiczenia (siedząc / stojąc, z podparciem / bez) liczy się z opisem
„(wariant: …)”; inne ćwiczenie to analogia i się nie liczy. Zdania z zestawu ogólnego (`dyn.control`, `st.breathe`, `dyn.mis.jerk`) wpisuję tylko tam,
gdzie przeczytane źródła potwierdzają je dla tego ćwiczenia (uzupełnienie briefu koordynatora). Do ustalenia, CZYM jest dane ćwiczenie w katalogu,
użyłem opisu z otwartej bazy, z której pochodzi katalog (pole `fedb` w `docs/research/equipment/catalog.json`) — tylko jako definicja, nie jako źródło wskazówek.

## Ćwiczenia

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| World's Greatest Stretch | częściowe | setup + część ruchu (wyprost przedniej nogi) z 2 źródłami; skręt tułowia z ręką do sufitu — jedno źródło (CFMWS), w „Otwarte” |
| Inchworm | gotowe | ACE #254 + CFMWS (start w podporze vs na stojąco — różnica, wpisana tylko część wspólna) |
| Leg Swings (Front-to-Back) | gotowe | Inclusive Sport + KU Health System |
| Leg Swings (Side-to-Side) | gotowe | jw.; `dyn.mis.jerk` tylko jedno źródło dla tej wersji — pominięte |
| Arm Circles | gotowe | AF + UC Berkeley + Inclusive Sport + Cleveland Clinic (wariant: siedząc) |
| Torso Rotation | gotowe | KU + Inclusive Sport (+ NHS wariant: siedząc). Rozbieżność: wersja katalogowa jest z piłką trzymaną przed sobą — patrz „Otwarte” |
| Standing Hip Circles | gotowe | AF + UC Berkeley (+ Inclusive Sport). Rozbieżność kolana (prosta noga vs kolano uniesione do 90°) — patrz „Otwarte” |
| Shoulder Circles | częściowe | ruch z 2 źródeł; brak potwierdzonego ustawienia |
| Ankle Circles | gotowe | UC Berkeley (stojąc, z podparciem) + WebMD Ignite (wariant: siedząc) |
| Wrist Circles | otwarte | jedno źródło (UC Berkeley) |
| Knee Circles | otwarte | brak przeczytanego źródła |
| Groiners | otwarte | w katalogu to wskok stopami do dłoni z podporu; ACE #140 to inne ćwiczenie (wykrok z łokciem do stopy) |
| Dynamic Chest Stretch | częściowe | ruch z 2 źródeł; ustawienie z jednego |
| Dynamic Back Stretch | otwarte | jedno źródło wariantu (KU, wymachy naprzemienne) |
| Round The World Shoulder Stretch | otwarte | w katalogu: przenoszenie drążka/kija nad głową — źródeł nie znaleziono |
| Standing Pelvic Tilt | otwarte | brak źródła (zgodne z wyjątkiem figury z 27.10.2026) |
| Iron Crosses (Stretch) | otwarte | w katalogu: LEŻENIE PRZODEM — źródeł nie znaleziono |
| Hip Circles (Prone) | otwarte | w katalogu: KLĘK PODPARTY (na czworakach) — źródeł nie znaleziono |
| Lying Leg Crossover Swings | otwarte | w katalogu: LEŻENIE TYŁEM — ACE #231 to inne ćwiczenie (statyczne) |

### Rozbieżność rodziny „stand” z pozycją ćwiczenia

Według opisu z bazy źródłowej katalogu (pliki `Iron_Crosses_stretch.json`, `Hip_Circles_prone.json`, `Windmills.json` w otwartej bazie ćwiczeń, z której
pochodzi katalog; przeczytane 02.11.2026): Iron Crosses (Stretch) — leżenie przodem, ręce w bok, zgięta noga przerzucana nad plecami do przeciwnej ręki;
Hip Circles (Prone) — na czworakach, zgięte kolano zatacza koło; Lying Leg Crossover Swings (dawniej „Windmills”) — leżenie tyłem, ręce w bok, prosta
noga przerzucana do przeciwnej ręki. Żadne nie jest stojące. Trafiają do `mobility_stand` przez dopasowanie słów w nazwie (`lib/figures/v2/families.ts:140`:
'circles', 'swing', 'iron crosses'). W `lib/figures/v2/poses/mobility_stand.json` nie ma póz dla żadnego z ćwiczeń tej części, a `lib/figures/v2/variants.ts`
ich nie wymienia — rysunek nie istnieje, więc nie ma jeszcze sprzeczności z rysunkiem; jest sprzeczność przypisania rodziny. Reguły sensu
w `data/zrodla/figury-sens.json` (`Iron Crosses (Stretch)`: „nogi_wymach”, „skret_noga_przez_cialo”; `Lying Leg Crossover Swings`: „nogi_wymach”)
nie mówią o pozycji. Sugestia do rozstrzygnięcia przez właściwą rolę: przenieść te trzy ćwiczenia do `mobility_floor`.

## Dane (do `exercises` w `data/zrodla/cues.json`)

```json
{
  "World's Greatest Stretch": {
    "setup": [
      {"c": "mobility_stand.d.wgsLunge", "s": [["cfmws-irs-dynamic-warmup", "s. 1, „A – Lunge + Twist + Floss”, akapity 1–2"], ["ace-140", "Step 2–3 (wariant: bez skrętu tułowia)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.wgsHamstring", "s": [["cfmws-irs-dynamic-warmup", "s. 1, ostatni akapit przed „Repeat 3 times”"], ["ace-140", "Step 6 (Variation)"]]}
    ],
    "tips": [
      {"c": "mobility_stand.d.flatBack", "s": [["cfmws-irs-dynamic-warmup", "s. 1, akapit 2 i ostatni (back flat)"], ["ace-140", "Step 2 i Step 4 (spine straight)"]]}
    ],
    "mistakes": []
  },
  "Inchworm": {
    "setup": [
      {"c": "mobility_stand.d.inchPlank", "s": [["ace-254", "Step 3"], ["cfmws-irs-dynamic-warmup", "s. 2, „B – Inchworm Plank”, akapit 1"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.inchWalk", "s": [["ace-254", "Step 3 i Step 5"], ["cfmws-irs-dynamic-warmup", "s. 2, akapity 2–4"]]}
    ],
    "tips": [
      {"c": "mobility_stand.d.inchSmallSteps", "s": [["ace-254", "Step 3, Step 5 i wskazówka „Take smaller steps”"], ["cfmws-irs-dynamic-warmup", "s. 2, akapity 2 i 4 (very small steps)"]]}
    ],
    "mistakes": [
      {"c": "mobility_stand.d.inchMisHips", "s": [["cfmws-irs-dynamic-warmup", "s. 2, ostatni akapit (resist dropping your hips)"], ["ace-254", "Step 3–5 (parafraza: tułów sztywny, kręgosłup, biodra i głowa w jednej linii)"]]}
    ]
  },
  "Leg Swings (Front-to-Back)": {
    "setup": [
      {"c": "mobility_stand.d.oneLeg", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings”"], ["sportsg-inclusive-warmup", "Warm-up, „Leg Swing Forward & Backward”"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.swingFrontBack", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings”"], ["sportsg-inclusive-warmup", "Warm-up, „Leg Swing Forward & Backward”"]]}
    ],
    "tips": [
      {"c": "dyn.control", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings” (starting small and increasing the range) i zasady na końcu (with control)"], ["sportsg-inclusive-warmup", "„Leg Swing Forward & Backward” (controlled motion; Easy ok. 45° → Standard ok. 90°)"]]}
    ],
    "mistakes": [
      {"c": "dyn.mis.jerk", "s": [["kuhs-dynamic-stretching", "zasady na końcu (with control; nie za daleko)"], ["sportsg-inclusive-warmup", "„Leg Swing Forward & Backward” (controlled motion)"]]}
    ]
  },
  "Leg Swings (Side-to-Side)": {
    "setup": [
      {"c": "mobility_stand.d.oneLeg", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings”"], ["sportsg-inclusive-warmup", "Warm-up, „Leg Swing Side to Side”"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.swingSide", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings” (switch to side-to-side swings)"], ["sportsg-inclusive-warmup", "Warm-up, „Leg Swing Side to Side”"]]}
    ],
    "tips": [
      {"c": "dyn.control", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings” i zasady na końcu"], ["sportsg-inclusive-warmup", "„Leg Swing Side to Side” (Easy → Standard: as high as comfortable)"]]}
    ],
    "mistakes": []
  },
  "Arm Circles": {
    "setup": [
      {"c": "mobility_stand.d.armsT", "s": [["af-dynamic-warmups", "„2. Arm Circles”"], ["ucb-uhs-work-warmup", "„5 Arm Circles”, punkt 1"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.armCircles", "s": [["af-dynamic-warmups", "„2. Arm Circles”"], ["ucb-uhs-work-warmup", "„5 Arm Circles”, punkty 2–3"], ["cc-seated-warmup", "s. 2, „Arm Circles” (wariant: siedząc)"]]}
    ],
    "tips": [
      {"c": "dyn.control", "s": [["ucb-uhs-work-warmup", "„5 Arm Circles”, punkt 2 (beginning small and increasing size)"], ["af-dynamic-warmups", "„2. Arm Circles” (gradually increasing their size)"], ["cc-seated-warmup", "s. 1, „Exercise Tips” (smooth and slow; wariant: siedząc)"], ["sportsg-inclusive-warmup", "„Arm Rotation” (Easy mniejsze → Standard szersze koła)"]]}
    ],
    "mistakes": []
  },
  "Torso Rotation": {
    "setup": [
      {"c": "mobility_stand.d.feetShoulder", "s": [["kuhs-dynamic-stretching", "„4. Trunk Rotations and Side Bends”"], ["sportsg-inclusive-warmup", "Cool-down, „Torso Rotation” (Standard)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.torsoTwist", "s": [["kuhs-dynamic-stretching", "„4. Trunk Rotations and Side Bends”"], ["sportsg-inclusive-warmup", "Cool-down, „Torso Rotation” (Standard)"], ["nhs-sitting", "„Upper-body twist” (wariant: siedząc)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Standing Hip Circles": {
    "setup": [
      {"c": "mobility_stand.d.hipStance", "s": [["af-dynamic-warmups", "„1. Hip Circles”"], ["ucb-uhs-work-warmup", "„11 Whole Leg Circles”, punkt 1"], ["sportsg-inclusive-warmup", "„Standing Hip Rotation, Abduction” (Easy: wall support)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.hipCircles", "s": [["af-dynamic-warmups", "„1. Hip Circles”"], ["ucb-uhs-work-warmup", "„11 Whole Leg Circles”, punkty 3–4"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Shoulder Circles": {
    "setup": [],
    "move": [
      {"c": "mobility_stand.d.shoulderRoll", "s": [["sportsg-inclusive-warmup", "Warm-up, „Shoulder Mobility”"], ["cc-seated-warmup", "s. 2, „Shoulder Shrugs” (wariant: siedząc) i s. 1 „Exercise Tips”"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Ankle Circles": {
    "setup": [
      {"c": "mobility_stand.d.footUp", "s": [["ucb-uhs-work-warmup", "„12 Ankle Circles”, punkty 1–2"], ["webmd-ignite-ankle-circles", "kroki 2 (wariant: siedząc)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.ankleCircles", "s": [["ucb-uhs-work-warmup", "„12 Ankle Circles”, punkty 3–4"], ["webmd-ignite-ankle-circles", "krok 3 (wariant: siedząc)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Dynamic Chest Stretch": {
    "setup": [],
    "move": [
      {"c": "mobility_stand.d.chestSwing", "s": [["kuhs-dynamic-stretching", "„3. Arm Swings”, punkt 2 (out to the sides and across the body)"], ["sportsg-inclusive-warmup", "Warm-up, „Chest Stretch” (Standard)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Ćwiczenia „otwarte” (Wrist Circles, Knee Circles, Groiners, Dynamic Back Stretch, Round The World Shoulder Stretch, Standing Pelvic Tilt,
Iron Crosses (Stretch), Hip Circles (Prone), Lying Leg Crossover Swings) nie mają wpisu — zostają przy zestawie ogólnym albo (lepiej, wg uzupełnienia
briefu) bez wskazówek do czasu źródeł; zestaw ogólny jest dla nich niepotwierdzony — patrz „Otwarte”.

## Nowe zdania

| Id | PL | EN (propozycja) | Uwaga |
|---|---|---|---|
| mobility_stand.d.wgsLunge | Zrób głęboki wykrok i oprzyj obie dłonie o podłogę po wewnętrznej stronie przedniej stopy; tylna noga wyciągnięta w tył. | Step into a deep lunge and put both hands on the floor inside your front foot, back leg stretched out behind you. | |
| mobility_stand.d.wgsHamstring | Potem cofnij biodra i wyprostuj przednią nogę. | Then shift your hips back and straighten your front leg. | |
| mobility_stand.d.flatBack | Plecy trzymaj proste. | Keep your back flat. | ogólne — może posłużyć innym ćwiczeniom rodziny po sprawdzeniu źródeł |
| mobility_stand.d.inchPlank | W podporze trzymaj ciało w jednej linii od głowy do pięt. | In the plank, keep your body in one line from head to heels. | |
| mobility_stand.d.inchWalk | Przejdź dłońmi do podporu, a potem dojdź stopami do dłoni. | Walk your hands out to a plank, then walk your feet up to your hands. | |
| mobility_stand.d.inchSmallSteps | Rób małe kroki — i dłońmi, i stopami. | Take small steps with both your hands and your feet. | |
| mobility_stand.d.inchMisHips | Biodra opadają w podporze. | Hips sagging in the plank. | |
| mobility_stand.d.oneLeg | Stań na jednej nodze. | Stand on one leg. | podparcie przy wymachach — jedno źródło, w „Otwarte” |
| mobility_stand.d.swingFrontBack | Wymachuj drugą nogą w przód i w tył. | Swing the other leg forward and back. | |
| mobility_stand.d.swingSide | Wymachuj drugą nogą na boki, z jednej strony na drugą. | Swing the other leg from side to side. | |
| mobility_stand.d.armsT | Rozłóż proste ręce w bok na wysokości barków. | Hold your arms straight out to the sides at shoulder height. | |
| mobility_stand.d.armCircles | Zataczaj rękami koła — w przód, potem w tył. | Circle your arms forward, then backward. | |
| mobility_stand.d.feetShoulder | Stań w rozkroku na szerokość barków. | Stand with your feet shoulder-width apart. | |
| mobility_stand.d.torsoTwist | Obracaj tułów raz w jedną, raz w drugą stronę. | Turn your torso to one side, then the other. | |
| mobility_stand.d.hipStance | Stań na jednej nodze — w razie potrzeby przytrzymaj się czegoś stabilnego. | Stand on one leg and hold on to something steady if you need to. | |
| mobility_stand.d.hipCircles | Zataczaj drugą nogą koła z biodra, w obie strony. | Circle the other leg from the hip, both ways. | bez określenia kolana (źródła: noga prosta; katalog: kolano 90°) |
| mobility_stand.d.shoulderRoll | Zataczaj barkami powolne koła. | Roll your shoulders in slow circles. | |
| mobility_stand.d.footUp | Unieś jedną stopę lekko nad podłogę. | Lift one foot just off the floor. | |
| mobility_stand.d.ankleCircles | Zataczaj stopą koła w kostce — w jedną, potem w drugą stronę. | Circle your foot at the ankle one way, then the other. | |
| mobility_stand.d.chestSwing | Rozkładaj proste ręce szeroko w bok i wracaj nimi przed siebie. | Swing your arms wide out to the sides and back in front of you. | „proste” — Inclusive Sport (opis); KU nie mówi o łokciach — jeśli recenzent uzna za nadmiar, skrócić do „Rozkładaj ręce…” |

## Nowe źródła

```json
{
  "ace-254": {"org": "ACE", "title": "Inchworms (#254)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/254/inchworms/", "level": 4},
  "ace-140": {"org": "ACE", "title": "Lunge with Elbow Instep (#140)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/140/", "level": 4},
  "cfmws-irs-dynamic-warmup": {"org": "CFMWS — PSP Health Promotion Kingston (Strengthening the Forces)", "title": "Injury Reduction Strategies (IRS): The Dynamic Warm-Up (2 s., 2025)", "url": "https://www.cfmws.ca/CFMWS/media/Kingston/The-Dynamic-Warm-Up.pdf", "level": 4},
  "af-dynamic-warmups": {"org": "Arthritis Foundation", "title": "Dynamic Warm-Ups (Arthritis at Work)", "url": "https://www.arthritis.org/partnership/atwork/at-work-physical-activity/dynamic-warm-ups-for-arthritis-workplace", "level": 4},
  "ucb-uhs-work-warmup": {"org": "UC Berkeley University Health Services (Be Well at Work)", "title": "Work Warm-Up", "url": "https://uhs.berkeley.edu/sites/default/files/wellness-generic_warmupexerciseprogram.pdf", "level": 4},
  "sportsg-inclusive-warmup": {"org": "Inclusive Sport (Sport Singapore)", "title": "Warm-Up and Cool-Down Exercises (akt. 24.06.2026)", "url": "https://www.inclusivesport.gov.sg/learning-opportunities/resources/warm-up-cool-down-exercises/", "level": 4},
  "kuhs-dynamic-stretching": {"org": "The University of Kansas Health System", "title": "Dynamic stretching exercises", "url": "https://www.kansashealthsystem.com/news-room/blog/0001/01/dynamic-stretching-exercises", "level": 4},
  "cc-seated-warmup": {"org": "Cleveland Clinic", "title": "Seated Warm-Up/Cool-Down Exercises (Rev. 7/19)", "url": "https://my.clevelandclinic.org/-/scassets/files/org/heart/patient-education/hvti-files/seated-warm-up-exercises.pdf", "level": 4},
  "webmd-ignite-ankle-circles": {"org": "WebMD Ignite (biblioteka ColumbiaDoctors)", "title": "Ankle Circles (akt. 01.05.2026)", "url": "https://www.columbiadoctors.org/health-library/multimedia/ankle-circles/", "level": 4},
  "nhs-sitting": {"org": "NHS", "title": "Sitting exercises (przegląd 18.01.2024)", "url": "https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/sitting-exercises/", "level": 4}
}
```

| Id | Organizacja | Szczebel | Co potwierdza |
|---|---|---|---|
| ace-254 | ACE | 4 | Inchworm: podpór w linii, przejście dłońmi i stopami, małe kroki, sztywny tułów |
| ace-140 | ACE | 4 | World's Greatest Stretch (wariant bez skrętu): wykrok, dłonie na podłodze, proste plecy, wyprost przedniej nogi |
| cfmws-irs-dynamic-warmup | CFMWS / PSP (Siły Zbrojne Kanady, promocja zdrowia) | 4 (PROPOZYCJA — organizacja spoza fitnessu, do decyzji audytora) | WGS: wykrok, dłonie przy przedniej stopie, skręt, wyprost; Inchworm: podpór, małe kroki, biodra nie opadają |
| af-dynamic-warmups | Arthritis Foundation | 4 | Arm Circles: ręce w bok na wys. barków, koła w obie strony, stopniowo większe; Standing Hip Circles: jedna noga, podparcie, koła |
| ucb-uhs-work-warmup | UC Berkeley UHS | 4 (PROPOZYCJA, materiał uczelniany bez autora) | Arm Circles, Whole Leg Circles, Ankle Circles, Wrist Circles |
| sportsg-inclusive-warmup | Inclusive Sport (agenda rządowa Singapuru) | 4 (PROPOZYCJA) | wymachy nóg (przód-tył, na boki), Arm Rotation, Shoulder Mobility, Chest Stretch, Torso Rotation, Standing Hip Rotation |
| kuhs-dynamic-stretching | University of Kansas Health System | 4 | wymachy nóg (mały zakres → większy, kontrola), Arm Swings, Trunk Rotations |
| cc-seated-warmup | Cleveland Clinic | 4 | (wariant: siedząc) Arm Circles, krążenie barków; zasady: płynnie i wolno, bez szarpania, nie wstrzymuj oddechu |
| webmd-ignite-ankle-circles | WebMD Ignite | 4 (PROPOZYCJA, jak w docs/research/33) | Ankle Circles (wariant: siedząc) |
| nhs-sitting | NHS | 4 | Torso Rotation (wariant: siedząc, „Upper-body twist”) |

Cytaty kontrolne (po 1 zdaniu): CFMWS s. 2 — „Resist dropping your hips toward the ground as you return to the push-up plank.”;
UC Berkeley „5 Arm Circles” — „Make circles with arms, beginning small and increasing size”; KU „Safety” — „Perform your dynamic stretches with control to prevent injury.”;
Cleveland Clinic s. 1 — „Keep movement smooth and slow. Don’t jerk or move fast”.

## Otwarte

- **World's Greatest Stretch — skręt** (`mobility_stand.d.wgsTwist`, propozycja: „Obróć tułów w stronę przedniej nogi i sięgnij ręką do sufitu; wzrok idzie za dłonią.”)
  → jedno źródło (CFMWS s. 1). ACE #140 nie ma skrętu. Bez skrętu karta nie opisuje istoty ćwiczenia — dlatego stan „częściowe”. Szukać: NSCA, NASM, szpital/uczelnia.
  Łokieć do podbicia stopy — tylko ACE #140 („elbow to the inside of your right knee”), CFMWS nie ma → otwarte.
- **Inchworm — start na stojąco i skłon** → tylko ACE (CFMWS zaczyna z podporu). Pompka w podporze — tylko ACE. Kolana: ACE „soft, not locked”, CFMWS „legs straight” — sprzeczność, nie wpisano.
- **Wymachy nóg — podparcie (ściana, krzesło)** → tylko Inclusive Sport (KU nie wspomina). `dyn.mis.jerk` dla wersji na boki — tylko KU (zasada ogólna strony).
- **Arm Circles — `dyn.mis.jerk`** → tylko Cleveland Clinic (wariant: siedząc). **`st.breathe`** → tylko Cleveland Clinic („Do not hold your breath”).
- **Torso Rotation — wersja katalogowa z piłką** (baza źródłowa katalogu: piłka trzymana w wyprostowanych rękach) — przeczytane źródła opisują skręt bez sprzętu
  (KU: kolana lekko ugięte; Inclusive Sport: kolana proste, dłonie na biodrach — sprzeczność co do kolan, nie wpisano). ACE #106 (piłka lekarska przy klatce) — inny chwyt, nie liczony.
  Do decyzji: czy „Torso Rotation” w aplikacji to skręt bez sprzętu (wtedy karta jak wyżej), czy z piłką (wtedy źródła do szukania).
- **Standing Hip Circles — kolano**: AF i UC Berkeley — noga prosta, koło całą nogą; baza źródłowa katalogu — kolano uniesione do 90°, koło kolanem
  (Inclusive Sport „Standing Hip Rotation” — kolano uniesione, ale wymach w bok, nie koło). Zdanie ruchu nie rozstrzyga kolana; rysunek musi wybrać wersję —
  zgodną ze źródłami jest noga prosta (2 źródła).
- **Shoulder Circles — ustawienie i oba kierunki** → oba kierunki tylko Inclusive Sport; Cleveland Clinic (siedząc) — jeden kierunek. `dyn.mis.jerk` — tylko Cleveland Clinic.
- **Ankle Circles — podparcie przy staniu** → tylko UC Berkeley.
- **Wrist Circles** → jedno źródło (UC Berkeley: łokcie zgięte, dłonie luźno zaciśnięte przed sobą). Baza katalogu: ręce w bok w literę T — inna pozycja.
  Biblioteka WebMD Ignite „wrist rotations” to obroty przedramienia (supinacja), nie krążenia — nie liczona.
- **Knee Circles** → brak przeczytanego źródła (szukane razem z innymi krążeniami — nic szczebla 4).
- **Groiners** → w bazie katalogu to wskok obunóż z podporu do dłoni; nie znaleziono źródła szczebla 4. ACE #140 to inne ćwiczenie (wykrok z łokciem) — analogia.
- **Dynamic Chest Stretch — ustawienie** → tylko Inclusive Sport („stand tall”, ręce w bok dłońmi do przodu).
- **Dynamic Back Stretch** (baza katalogu: proste ręce wymachem w górę nad głowę) → tylko KU „Arm Swings” (wymach naprzemienny, wysokość stopniowo) — wariant, jedno źródło.
- **Round The World Shoulder Stretch** (baza katalogu: kij za biodrami, unoszenie rąk za głową) → brak przeczytanego źródła.
- **Standing Pelvic Tilt** → brak źródła (ACE #7 „Supine Pelvic Tilts” to wersja leżąca — nie czytana, możliwa analogia).
- **Iron Crosses (Stretch), Hip Circles (Prone), Lying Leg Crossover Swings** → brak źródeł; do tego niezgodna rodzina (patrz wyżej). ACE #231 „Leg Crossover Stretch”
  to leżenie tyłem z kostką na kolanie i przytrzymaniem 15–30 s — inne ćwiczenie, nie liczone.
- **Zestaw ogólny — błędy zestawu**: `st.breathe` nie ma potwierdzenia dla żadnego ćwiczenia tej części z 2 źródeł (CFMWS: „deep breathing throughout” dla WGS
  i Inchworm; Cleveland Clinic: „do not hold your breath” tylko dla wersji siedzącej). `dyn.control` potwierdzone tylko dla wymachów nóg i Arm Circles;
  `dyn.mis.jerk` — tylko dla Leg Swings (Front-to-Back). Dla pozostałych ćwiczeń obecny zestaw ogólny `dyn.control`/`st.breathe`/`dyn.mis.jerk` jest
  niepotwierdzony przeczytanymi źródłami — rekomendacja: przy wdrożeniu zastąpić kartami wyżej, a ćwiczeniom „otwartym” nie dawać zdań z zestawu ogólnego
  do czasu źródeł (decyzja koordynatora/właściciela).
- **Szczeble PROPOZYCJA** (CFMWS, UC Berkeley UHS, Inclusive Sport, WebMD Ignite) — do potwierdzenia przez audytora; jeśli któreś spadnie do szczebla 5,
  to: WGS i Inchworm tracą drugie źródło przy CFMWS (zostaje ACE) → „otwarte”; Arm Circles, Hip Circles, Ankle Circles, wymachy nóg — sprawdzić liczbę pozostałych.

## Stan

- **Zrobione (02.11.2026):** wszystkie 19 ćwiczeń przejrzane; 7 gotowych (Inchworm, oba Leg Swings, Arm Circles, Torso Rotation, Standing Hip Circles, Ankle Circles),
  3 częściowe (World's Greatest Stretch, Shoulder Circles, Dynamic Chest Stretch), 9 otwartych.
- **Zostało:** drugie źródło skrętu w WGS; Wrist Circles, Knee Circles, Groiners, Dynamic Back Stretch, Round The World, Standing Pelvic Tilt; trzy ćwiczenia leżące
  (najpierw decyzja o rodzinie).
- **Następny krok:** przeszukać biblioteki NSCA (Kinetic Select / NSCA Coach), uczelniane centra sportu (np. karty HKU CSE, Western SRS z docs/research/33) i materiały
  szpitali (HSS „Move Better”) pod nazwami „thoracic rotation lunge”, „scorpion”, „quadruped hip circles”, „supine leg crossover”, „shoulder pass-through/dislocates”.
- **Pułapki:** ExRx 403, web.archive.org zablokowane; acefitness.org/sitemap.xml ma ok. 1,1 mln znaków (czytać z `offset`); strony NASM exercise library ładują listę
  skryptem (nie da się jej przeczytać), adresy ćwiczeń zgadywane zwracają 404; hrs.byu.edu — 403; PDF Special Olympics za duży (> 10 MB); PDF-y z obrazem
  (CFMWS, Cleveland Clinic, UC Berkeley) czytelne dopiero przez odczyt pobranego pliku; Arthritis Movement (Australia) to przedruk Arthritis Foundation — nie jest niezależny.
