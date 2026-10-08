# 25. Biblioteka ćwiczeń — część L3: rozciąganie i mobilność, cardio, noszenie (08.10.2026)

Zlecenie właściciela (08.10.2026): „mamy trochę za szeroką bibliotekę ćwiczeń … zrób głęboki research i potwierdź każde z nich”. Część L3: **140 ćwiczeń** (111 rozciągań / rollera / ćwiczeń mobilności, 20 cardio, 9 noszenia). Dane: `L3.json` (jeden rekord na ćwiczenie). **Ten plik i podsumowanie są generowane skryptem z danych** — nie zmieniają lib/ ani katalogu.

## 1. Metoda

- Opis każdego wpisu przeczytany w źródle katalogu (free-exercise-db, L3-S17) — to pozwoliło ustalić, czym ćwiczenie naprawdę jest (np. 13 rozciągań PNF wymagających partnera, „Skating” = wrotki).
- Rozciąganie: zestawienie z niezależnymi opisami ACE (szczebel 4), NHS (4), AAOS OrthoInfo (4) oraz zasad z ACSM 2011 i przeglądów (szczebel 2–3) — miara „czas” dla trzymanych rozciągań, „powtórzenia” dla dynamicznych.
- Cardio i noszenie: badania EMG/biomechaniki (szczebel 3), przeglądy (2), dokumentacja producenta (4).
- ExRx.net niedostępne (blokada Cloudflare, także w archiwum) — nie cytowane. Strony Mayo Clinic — 403, nie cytowane.
- Pewność: „mocne” ≥ 2 niezależne organizacje/zespoły zgodne; „umiarkowane” — S17 + jedno niezależne źródło albo analogia; „jedno źródło”; „brak źródła — uproszczenie”.
- Dla rozciągań `muscleLoad` (0,25) oznacza mięśnie rozciągane; obecna etykieta w UI to „stabilizacja” (pytanie otwarte Q3).

## 2. Czy rozciąganie należy do tej aplikacji? (ocena produktowa, nie merytoryczna)

Fakty: rozciąganie jest częścią zalecanego programu ćwiczeń (ACSM: ćwiczenia gibkości ≥ 2 dni/tydz., ~60 s na ćwiczenie — L3-S1), a dynamiczne ćwiczenia są zalecaną częścią rozgrzewki (L3-S2, L3-S3, L3-S4). Roller daje małe, krótkotrwałe efekty (L3-S5, L3-S6). Rozciąganie nie ma ciężaru ani progresji, nie liczy się do serii tygodniowych (konwencja katalogu), a 111 pozycji to 13 % biblioteki; wiele to warianty tej samej pozycji albo PNF z partnerem.

- **Opcja A — usunąć całą mobilność (111):** najprostsza biblioteka; kto loguje rozgrzewkę, tworzy własne ćwiczenia. Minus: traci się popularne pozycje (World's Greatest Stretch, roller), a dane w historii i tak zostają (archiwum).
- **Opcja B (rekomendacja) — krótka lista mobilności widoczna domyślnie (20 pozycji „ZOSTAJE”), reszta ukryta (NISZOWE) lub scalona/usunięta:** zostaje to, co ma niezależny opis (ACE/NHS/AAOS) i realnie trafia do rozgrzewki lub schłodzenia; lista domyślna kurczy się o 91 pozycji. Minus: trzeba wdrożyć scalenia (mapowanie nazw w historii).
- **Opcja C — zostawić wszystkie, tylko ukryć w wyszukiwarce:** zero ryzyka migracji, ale duplikaty i PNF z partnerem nadal w danych.
Rekomendacja: **B** — werdykty w `L3.json` są ułożone pod tę opcję (przy A wszystkie wpisy mobilności przechodzą na USUNĄĆ, przy C — SCALIĆ/USUNĄĆ na NISZOWE).

## 3. Podsumowanie (generowane z L3.json)

- Werdykt: OK 69, POPRAWIĆ 25, SCALIĆ 36, USUNĄĆ 10
- Zakres: NISZOWE 57, SCALIĆ 36, USUNĄĆ 10, ZOSTAJE 37
- Pewność: brak źródła — uproszczenie 9, jedno źródło 64, mocne 9, umiarkowane 58

### 3.1 Najważniejsze poprawki

- **Anterior Tibialis-SMR** (USUNĄĆ) — Narzędzie to wałek ręczny / wałek do ciasta (S17: „Using a Muscle Roller or a rolling pin”), nie roller — requires foam_roller błędne; rzadkie.
- **Brachialis-SMR** (USUNĄĆ) — Bardzo rzadkie; opis (S17) to oparcie ramienia na rollerze bez toczenia — brak odpowiednika w innych źródłach.
- **Cat Stretch** (POPRAWIĆ: name → "Cat-Cow"; metric → "reps") — W ACE „Cat-Cow” (Erector Spinae, Latissimus Dorsi, Trapezius) — zwykle wykonywany na powtórzenia (koci grzbiet ↔ krowa); S17 opisuje sam koci grzbiet 15 s. Proponowana ustalona nazwa i miara reps.
- **Chair Leg Extended Stretch** (USUNĄĆ) — Nieustalona nazwa; w źródle ruch nogą w bok na krześle bez czasu ani powtórzeń — nie da się jednoznacznie zalogować; brak odpowiednika w ACE/AAOS/NHS.
- **Chest And Front Of Shoulder Stretch** (POPRAWIĆ: recommended → []) — Wykonywane z kijem/drążkiem (S17: „holding a bodybar or a broomstick”), nie z gumą — recommended „bands” błędne.
- **Foot-SMR** (POPRAWIĆ: requires → []) — Narzędzie: wałek do stóp / rura (S17) albo piłka golfowa (AAOS Golf Ball Roll, 2 min) — nie roller; requires foam_roller błędne, brak pozycji w słowniku.
- **Hug A Ball** (USUNĄĆ) — Nieustalona nazwa (głęboki przysiad z piłką); brak odpowiednika w ACE/AAOS/NHS.
- **Looking At Ceiling** (USUNĄĆ) — Nazwa nieustalona; opis (klęk, chwyt pięt, wygięcie kręgosłupa) to pozycja jogi „wielbłąd” — głęboki przeprost, poza zakresem dziennika siłowego.
- **Lower Back-SMR** (USUNĄĆ) — NASM odradza roller na odcinek lędźwiowy (S8 — jedno źródło, szczebel 5). Zamiast tego: pośladki/piriformis, odcinek piersiowy.
- **Neck-SMR** (USUNĄĆ) — Narzędzie to wałek ręczny (S17), nie roller (requires błędne); NASM odradza roller na szyję (S8 — szczebel 5, jedno źródło). Aplikacja nie powinna podsuwać rolowania szyi.
- **Pyramid** (USUNĄĆ) — Nazwa myląca (w jodze „piramida” to inna pozycja — skłon w wykroku); opis (S17) to leżenie przodem na piłce. Brak odpowiednika w ACE/AAOS/NHS.
- **Round The World Shoulder Stretch** (POPRAWIĆ: recommended → []) — Kij/drążek za biodrami unoszony za głowę (S17) — „bands” w recommended błędne; ruch powtarzany (reps poprawne).
- **Single-Cone Sprint Drill** (USUNĄĆ) — Nieustalona nazwa ćwiczenia zwinnościowego (bieg wokół pachołka) — poza zakresem dziennika siłowego.
- **Skating** (USUNĄĆ) — Jazda na wrotkach (S17) — rekreacja, nie trening siłowy. Dodatkowo błąd mapowania: requires „outdoor” oznacza w słowniku „Rower (jazda na zewnątrz)” (lib/equipment.ts), więc ćwiczenie wymagało roweru.
- **Farmer's Walk** (POPRAWIĆ: muscleLoad → {"forearms": 1, "upper_back": 1, "obliques": 0.5, "abs": 0.5, "quads": 0.25, "glutes": 0.25, "calves": 0.25, "abductors": 0.25}) — Chwyt ogranicza wynik (S30) — przedramiona główne zgodne; EMG: pośladkowy średni 26–47 %MVIC, czworogłowe ~15 %MVIC (S32) — brak odwodzicieli w muscleLoad; core 8–16 %MVIC (S33). Partie bez zmian (docs/24).
- **Farmer's Walk (Farmers Handles)** (POPRAWIĆ: muscleLoad → {"forearms": 1, "upper_back": 1, "obliques": 0.5, "abs": 0.5, "quads": 0.25, "glutes": 0.25, "calves": 0.25, "abductors": 0.25}) — Sprzęt strongman; spójność muscleLoad z Farmer's Walk.
- **Farmer's Walk (trap bar)** (POPRAWIĆ: muscleLoad → {"forearms": 1, "upper_back": 1, "abs": 0.5, "obliques": 0.5, "quads": 0.25, "glutes": 0.25, "calves": 0.25, "abductors": 0.25}) — Ten sam ruch co Farmer's Walk innym przyrządem — spójność muscleLoad (odwodziciele).
- **Yoke Walk** (POPRAWIĆ: muscleLoad → {"quads": 1, "abs": 1, "glutes": 0.5, "upper_back": 0.5, "lower_back": 0.5, "abductors": 0.5, "calves": 0.25}) — McGill 2009: bardzo duże momenty odwodzenia w biodrze i największe obciążenie kręgosłupa (S28) — muscleLoad bez odwodzicieli; dodać 0,5.

### 3.2 Zmiany nazw na ustalone (POPRAWIĆ: name)

- Ankle On The Knee → Supine Figure-Four Stretch
- Calf Stretch Hands Against Wall → Wall Calf Stretch
- Cat Stretch → Cat-Cow
- Dancer's Stretch → Seated Rotation Stretch
- Elbows Back → Standing Chest Stretch
- Front Leg Raises → Leg Swings (Front-to-Back)
- Groin and Back Stretch → Butterfly Stretch
- Hamstring Stretch → Supine Hamstring Stretch
- Hamstring-SMR → Foam Roll: Hamstrings
- Knee Across The Body → Supine Spinal Twist
- Kneeling Hip Flexor → Kneeling Hip Flexor Stretch
- On Your Side Quad Stretch → Side-Lying Quad Stretch
- One Arm Against Wall → Wall Lat Stretch
- Quadriceps-SMR → Foam Roll: Quadriceps
- Shoulder Stretch → Cross-Body Shoulder Stretch
- Side Leg Raises → Leg Swings (Side-to-Side)
- Triceps Stretch → Overhead Triceps Stretch
- Windmills → Lying Leg Crossover Swings

### 3.3 Duplikaty (SCALIĆ)

- **Ankle On The Knee** ← Lying Glute, Seated Glute
- **Arm Circles** ← Elbow Circles
- **Calf Stretch Hands Against Wall** ← Calf Stretch Elbows Against Wall
- **Dead Hang** ← One Handed Hang
- **Elbows Back** ← Behind Head Chest Stretch, Chair Upper Body Stretch, Seated Front Deltoid
- **Glute Bridge** ← Pelvic Tilt Into Bridge
- **Groin and Back Stretch** ← Lying Bent Leg Groin
- **Hamstring Stretch** ← 90/90 Hamstring, Lying Hamstring
- **Knee Across The Body** ← Lying Crossover
- **Kneeling Hip Flexor** ← Standing Hip Flexors
- **Middle Back Stretch** ← Spinal Stretch
- **On Your Side Quad Stretch** ← All Fours Quad Stretch, Intermediate Hip Flexor and Quad Stretch, Lying Prone Quadriceps, On-Your-Back Quad Stretch, One Half Locust
- **One Arm Against Wall** ← Overhead Lat
- **One Knee To Chest** ← Hug Knees To Chest
- **Rower** ← Recumbent Bike
- **Seated Floor Hamstring Stretch** ← Seated Hamstring, Seated Hamstring and Calf Stretch, Upper Back-Leg Grab
- **Shoulder Circles** ← Shoulder Raise
- **Shoulder Stretch** ← Side Wrist Pull, Tricep Side Stretch
- **Standing Biceps Stretch** ← Seated Biceps
- **Standing Gastrocnemius Calf Stretch** ← Standing Hamstring and Calf Stretch
- **Standing Lateral Stretch** ← Chair Lower Back Stretch, Seated Overhead Stretch, Side-Lying Floor Stretch
- **The Straddle** ← Adductor/Groin
- **Triceps Stretch** ← Overhead Triceps

### 3.4 Lista domyślna (ZOSTAJE)

Ankle On The Knee, Arm Circles, Calf Stretch Hands Against Wall, Cat Stretch, Child's Pose, Elbows Back, Front Leg Raises, Groin and Back Stretch, Hamstring Stretch, Hamstring-SMR, Inchworm, Knee Across The Body, Kneeling Hip Flexor, On Your Side Quad Stretch, One Arm Against Wall, One Knee To Chest, Quadriceps-SMR, Shoulder Stretch, Triceps Stretch, World's Greatest Stretch, Assault Bike, Bieg, Burpees, Incline Walk (bieżnia), Mountain Climbers, Rower, Rowing Machine, Skakanka, Battle Ropes, High Knees, Jumping Jacks, Orbitrek, Ski Erg, Stair Climber, Treadmill Walking, Farmer's Walk, Suitcase Carry

## 4. Pytania otwarte

- **Q1 (produkt):** zakres mobilności — opcja A/B/C (sekcja 2). Rekomendacja B.
- **Q2 (model danych):** noszenie jest zwykle mierzone dystansem (ACE Farmer's Carry: „walk a specified, pre-determined distance”; L3-S31: „over a set distance as quickly as possible”), a aplikacja ma tylko `weight_time`. Opcje: (a) dodać miarę ciężar + dystans (+ czas) — zmiana schematu, osobne wydanie; (b) zostawić czas. Rekomendacja: (a) przy najbliższej zmianie schematu.
- **Q3 (UI):** dla wzorca `mobility` waga 0,25 jest pokazywana jako „stabilizacja”; poprawniej „rozciągane”. Do decyzji wyglądu.
- **Q4:** Conan's Wheel — `requires` landmine + sztanga udostępnia je w zwykłej siłowni, a notatka z recenzji 04.10 mówi, że ma być niedostępne. Które jest zamierzone?
- **Q5:** scalenie „Pelvic Tilt Into Bridge” → Glute Bridge i „One Handed Hang” → Dead Hang łączy wpis mobilności z ćwiczeniem siłowym (historia dostanie partie). Alternatywa: USUNĄĆ.
- **Q6:** brak źródeł dla mięśni: High Knees, Jumping Jacks, Stair Climber, Overhead Carry, Double Kettlebell Front Rack Carry, Conan's Wheel, Rickshaw Carry, Assault Bike (ramiona) — zostają jako nazwane uproszczenia.
- **Q7:** Farmer's Walk — core (RA 8–11 %MVIC, L3-S33) wypada nisko wobec wagi 0,5; nie zmieniam (partie z docs/24), kandydat do przeglądu muscleLoad.
- **Q8:** rejestr decyzji (Google Drive) — wpisać po akceptacji.

## 5. Źródła

- **L3-S1** Garber CE i in. (ACSM). Quantity and quality of exercise for developing and maintaining cardiorespiratory, musculoskeletal, and neuromotor fitness in apparently healthy adults. Med Sci Sports Exerc 2011;43(7):1334–59. https://pubmed.ncbi.nlm.nih.gov/21694556/ (Europe PMC). **A**, szczebel 2. „completing a series of flexibility exercises for each the major muscle-tendon groups (a total of 60 s per exercise) on ≥2 d·wk is recommended”; program obejmuje „cardiorespiratory, resistance, flexibility, and neuromotor exercise”. (użyte w 56 rekordach)
- **L3-S2** Behm DG, Blazevich AJ, Kay AD, McHugh M. Acute effects of muscle stretching on physical performance, range of motion, and injury incidence… a systematic review. Appl Physiol Nutr Metab 2016;41(1):1–11. https://doi.org/10.1139/apnm-2015-0235. **A**, szczebel 2. „greater performance deficits with ≥60 s (-4.6%) than with <60 s (-1.1%) SS per muscle group”; „stretching within a warm-up that includes additional poststretching dynamic activity is recommended”. (użyte w 0 rekordach)
- **L3-S3** Page P. Current concepts in muscle stretching for exercise and rehabilitation. Int J Sports Phys Ther 2012;7(1):109–19. https://pmc.ncbi.nlm.nih.gov/articles/PMC3273886/. **PT**, szczebel 3. statyczne: „a specific position is held with the muscle on tension”; dynamiczne: „moving a limb through its full range of motion to the end ranges and repeating several times”; PNF — opór „can be provided by a partner or with an elastic band or strap”; „10 to 30 seconds is sufficient”; „dynamic stretching is recommended for warm-up”. (użyte w 91 rekordach)
- **L3-S4** Opplert J, Babault N. Acute Effects of Dynamic Stretching on Muscle Flexibility and Performance. Sports Med 2018;48(2):299–325. https://doi.org/10.1007/s40279-017-0797-9. **A**, szczebel 3. „if the goal of a warm-up is to increase joint ROM and to enhance muscle force and/or power, dynamic stretching seems to be a suitable alternative to static stretching”. (użyte w 22 rekordach)
- **L3-S5** Wiewelhove T i in. A Meta-Analysis of the Effects of Foam Rolling on Performance and Recovery. Front Physiol 2019;10:376. https://pmc.ncbi.nlm.nih.gov/articles/PMC6465761/. **A**, szczebel 2. „Pre-rolling resulted in a small improvement in sprint performance (+0.7%…) and flexibility (+4.0%…)”; „effects of foam rolling on performance and recovery are rather minor and partly negligible”. (użyte w 9 rekordach)
- **L3-S6** Konrad A, Nakamura M, Tilp M, Donti O, Behm DG. Foam Rolling Training Effects on Range of Motion: A Systematic Review and Meta-Analysis. Sports Med 2022;52(10):2523–35. https://pmc.ncbi.nlm.nih.gov/articles/PMC9474417/. **A**, szczebel 2. „Foam rolling increased joint ROM when applied to hamstrings and quadriceps, while no improvement in ankle dorsiflexion was observed when foam rolling was applied to triceps surae.” (użyte w 3 rekordach)
- **L3-S7** Behm DG i in. Foam Rolling Prescription: A Clinical Commentary. J Strength Cond Res 2020;34(11):3301–8. https://doi.org/10.1519/jsc.0000000000003765. **A**, szczebel 3. „1-3 sets of 2-4-second repetition duration … with a total rolling duration of 30-120-second per set”. (użyte w 9 rekordach)
- **L3-S8** NASM (Brian Sutton) i Sharecare Fitness — odpowiedź „Areas to avoid when foam rolling”. https://www.sharecare.com/health/common-cardiovascular-exercise-machines/areas-avoid-when-foam-rolling. **PT**, szczebel 5. „Areas to avoid with the foam roller include the abdomen, low-back, chest (for women) and the neck.”; „avoid placing it in the cervical or lumbar spine”. (użyte w 3 rekordach)
- **L3-S9** American Council on Exercise (ACE). Exercise Library — kanał RSS (330 pozycji: nazwa, „Primary Muscles”, sprzęt) i strony ćwiczeń (Leg Crossover Stretch, Supine IT Band Stretch, Supine 90-90 Hip Rotator Stretch, Seated Side-Straddle Stretch, 90 Lat Stretch, Standing Chest Stretch, Farmer's Carry, Waiter's Carry). https://www.acefitness.org/rss/exerciselibrary.aspx ; https://www.acefitness.org/resources/everyone/exercise-library/. **PT**, szczebel 4. np. „Cat-Cow — Primary Muscles: Erector Spinae, Latissimus Dorsi…”; „Standing Dorsi-Flexion (Calf Stretch) — Gastrocnemius, Soleus”; „Mountain Climbers — Gluteus Maximus, … Hamstrings, Quadriceps, Rectus Abdominus”; Farmer's Carry: „walk a specified, pre-determined distance”; Standing Chest Stretch: „Hold for 15-30 seconds”. (użyte w 34 rekordach)
- **L3-S10** NHS. How to stretch after exercising. https://www.nhs.uk/live-well/exercise/how-to-stretch-after-exercising/. **PT**, szczebel 4. Buttock stretch: „Cross your right leg over your left thigh … Pull your left leg towards your chest”; Inner thigh: „Put the soles of your feet together … lower your knees towards the floor”; Thigh stretch: „Lie on your side … pull your heel towards your left buttock”; każde „hold for 15 to 20 seconds”. (użyte w 5 rekordach)
- **L3-S11** NHS. Flexibility exercises. https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/flexibility-exercises/. **PT**, szczebel 4. Neck stretch: „Slowly tilt your head to the right while holding your shoulder down”; Sideways bend: „Slide your left arm down your side”; Calf stretch: „keeping the left leg as straight as possible and the left heel on the floor”. (użyte w 3 rekordach)
- **L3-S12** AAOS OrthoInfo. Hip Conditioning Program (PDF, 2025). https://orthoinfo.aaos.org/globalassets/pdfs/hip-conditioning-rehab-program-2025.pdf. **PT**, szczebel 4. Standing Iliotibial Band Stretch (Tensor fascia), Seated Rotation Stretch (Piriformis): „Cross one leg over the other. Slowly twist toward your bent leg”, Knee to Chest (Gluteus maximus, gluteus medius), Supine Hamstring Stretch: „Straighten your leg and then pull it gently toward your head … Hold for 30 to 60 seconds”. (użyte w 5 rekordach)
- **L3-S13** AAOS OrthoInfo. Spine Conditioning Program (PDF). https://orthoinfo.aaos.org/globalassets/pdfs/spine-conditioning-program.pdf. **PT**, szczebel 4. Head Rolls; Kneeling Back Extension (rock forward/back na czworakach); Sitting Rotation Stretch: „Main muscles worked: Piriformis, external oblique rotators, internal oblique rotators”; Knee to Chest: „then pull both legs in together”. (użyte w 3 rekordach)
- **L3-S14** AAOS OrthoInfo. Knee Conditioning Program. https://www.orthoinfo.org/en/recovery/knee-conditioning-program/. **PT**, szczebel 4. Heel cord stretch („Gastrocnemius-soleus complex”), Standing quadriceps stretch („bring your heel up toward your buttock”, 30–60 s), Supine hamstring stretch. (użyte w 3 rekordach)
- **L3-S15** AAOS OrthoInfo. Foot and Ankle Conditioning Program. https://www.orthoinfo.org/en/recovery/foot-and-ankle-conditioning-program/. **PT**, szczebel 4. Heel Cord Stretch; Heel Cord Stretch with Bent Knee („Soleus”); Golf Ball Roll („Roll a golf ball under the arch … for 2 minutes”); Towel Stretch; Ankle Range of Motion („write each letter of the alphabet in the air”). (użyte w 5 rekordach)
- **L3-S16** AAOS OrthoInfo. Rotator Cuff and Shoulder Conditioning Program. https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/. **PT**, szczebel 4. Crossover Arm Stretch — „posterior deltoid”: „gently pull one arm across your chest as far as possible, holding at your upper arm”, 30 s. (użyte w 2 rekordach)
- **L3-S17** free-exercise-db (yuhonas, Unlicense) — źródło katalogu; opisy wykonania, kategoria i mięśnie. https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json. **PT**, szczebel 4. Opis każdego wpisu przeczytany (pole instructions); m.in. 13 rozciągań to PNF z partnerem („Have your partner hold…”), 90/90 Hamstring i Groin and Back Stretch to ruch na powtórzenia („Repeat for 10-20 repetitions”), Anterior Tibialis-SMR / Neck-SMR: „Using a Muscle Roller or a rolling pin”, Skating: „Roller skating is a fun activity…”. (użyte w 119 rekordach)
- **L3-S18** Concept2. Muscles Used While Rowing. https://www.concept2.com/training/articles/rowing-muscles-used. **PT**, szczebel 4. „You initiate the drive with the powerful muscles of your legs”; „your glutes and hamstrings contract to extend the hip”; „your biceps engage to pull the handle”; „nearly all the muscles of your upper body engage”. (użyte w 1 rekordach)
- **L3-S19** Dorn TW, Schache AG, Pandy MG. Muscular strategy shift in human running. J Exp Biol 2012;215:1944–56. https://doi.org/10.1242/jeb.064527. **A**, szczebel 3. „the ankle plantarflexors, soleus and gastrocnemius, contributed most significantly to vertical support forces”; przy sprincie „The hip muscles, primarily the iliopsoas, gluteus maximus and hamstrings”. (użyte w 1 rekordach)
- **L3-S20** Franz JR, Kram R. The effects of grade and speed on leg muscle activations during walking. Gait Posture 2012;35(1):143–7. https://pmc.ncbi.nlm.nih.gov/articles/PMC3262943/. **A**, szczebel 3. „hip (BF: 635%, GMAX: 345%), knee (RF: 165%, VM: 366%), and ankle (MG: 175%, SOL: 136%) extensor muscle activities increased to walk up 9°”. (użyte w 3 rekordach)
- **L3-S21** Burnfield JM i in. Similarity of joint kinematics and muscle demands between elliptical training and walking. Phys Ther 2010;90(2):289–305. https://doi.org/10.2522/ptj.20090033. **A**, szczebel 3. „During elliptical training, gluteus maximus and vastus lateralis muscle activation were increased; medial hamstring, gastrocnemius, soleus … decreased”; „the contributions of the upper extremities … have not been quantified”. (użyte w 1 rekordach)
- **L3-S22** Bing F i in. The effects of saddle height and power output on lower-limb muscles and joints during cycling. BMC Sports Sci Med Rehabil 2026;18:357. https://doi.org/10.1186/s13102-026-01779-6. **A**, szczebel 3. „Greater power outputs increased hip/knee extensor forces”; mięśnie: „rectus femoris, vastus lateralis and medialis, gastrocnemius, and gluteus maximus”. (użyte w 2 rekordach)
- **L3-S23** Hug F, Dorel S. Electromyographic analysis of pedaling: a review. J Electromyogr Kinesiol 2009;19(2):182–98. https://doi.org/10.1016/j.jelekin.2007.10.010. **A**, szczebel 3. przegląd EMG mięśni kończyny dolnej w pedałowaniu („the patterns of the lower limb muscles activity”) — tylko potwierdzenie, że pedałowanie to praca kończyn dolnych. (użyte w 2 rekordach)
- **L3-S24** Holmberg HC i in. Biomechanical analysis of double poling in elite cross-country skiers. Med Sci Sports Exerc 2005;37(5):807–18. https://doi.org/10.1249/01.mss.0000162615.47763.c8. **A**, szczebel 3. „DP was found to be a complex movement involving both the upper and lower body” (EMG mięśni górnej i dolnej części ciała). Ski erg naśladuje double poling — analogia. (użyte w 1 rekordach)
- **L3-S25** Saller M i in. A Review of Biomechanical and Physiological Effects of Using Poles in Sports. Bioengineering 2023;10:497. https://pmc.ncbi.nlm.nih.gov/articles/PMC10135831/. **A**, szczebel 3. „The upper body and trunk muscles were more active. The lower body muscles were either less active or no different”. (użyte w 1 rekordach)
- **L3-S26** Cao Y i in. Effects of battle rope training on sporting performance: a systematic review and meta-analysis. BMC Sports Sci Med Rehabil 2026;18:431. https://doi.org/10.1186/s13102-026-01970-9. **A**, szczebel 2. „BRT significantly improved upper-limb explosive power …, grip strength …, upper-limb muscular endurance …, and core endurance”; „effect on lower-limb explosive power remains uncertain”. (użyte w 1 rekordach)
- **L3-S27** Kaewjaratwilai T i in. Lower-limb biomechanics and muscle activation during rope jumping in Muay Thai athletes. Sports 2025;13:410. https://pmc.ncbi.nlm.nih.gov/articles/PMC12656257/. **A**, szczebel 3. EMG „vastus lateralis, biceps femoris, tibialis anterior, and medial gastrocnemius” podczas skakania na skakance (sztywność kończyny, kontakt 0,28 s). (użyte w 1 rekordach)
- **L3-S28** McGill SM, McDermott A, Fenwick CM. Comparison of different strongman events: trunk muscle activation and lumbar spine motion, load, and stiffness. J Strength Cond Res 2009;23(4):1148–61. (= docs/research/24 S34) https://pubmed.ncbi.nlm.nih.gov/19528856/. **A**, szczebel 3. „Events included the farmer's walk, super yoke, Atlas stone lift, suitcase carry …”; „the very large moments required at the hip for abduction when performing a yoke walk exceed the strength capability of the hip. Here, muscles such as quadratus lumborum made up…”; „the super yoke carry resulted in the highest loads on the spine”. (użyte w 4 rekordach)
- **L3-S29** McGill SM, Marshall L, Andersen J. Low back loads while walking and carrying: comparing the load carried in one hand or in both hands. Ergonomics 2013;56(2):293–302. https://doi.org/10.1080/00140139.2012.752528. **A**, szczebel 3. „Carrying loads in one hand resulted in more load on the low back than when the load was split between both hands.” (użyte w 1 rekordach)
- **L3-S30** Hindle BR, Lorimer A, Winwood P, Keogh JWL. The Biomechanics and Applications of Strongman Exercises: a Systematic Review. Sports Med Open 2019;5:49. https://pmc.ncbi.nlm.nih.gov/articles/PMC6901656/. **PT**, szczebel 2. „A limiting factor … in the farmer's walk may be the grip strength of the athlete”; „exercises such as the farmer's walk are typically included in programs to develop grip strength and total body strength”; „A lack of basic quantitative biomechanical data of the yoke walk, unilateral load carriage…”. (użyte w 6 rekordach)
- **L3-S31** Hindle BR i in. The Biomechanical Characteristics of the Strongman Yoke Walk. Front Sports Act Living 2021;3:670297. https://pmc.ncbi.nlm.nih.gov/articles/PMC8107362/. **A**, szczebel 3. „athletes carry a heavily loaded frame balanced across the back of their shoulders over a set distance as quickly as possible”. (użyte w 1 rekordach)
- **L3-S32** Stastny P i in. The Gluteus Medius Vs. Thigh Muscles Strength Ratio and Their Relation to Electromyography Amplitude During a Farmer's Walk Exercise. J Hum Kinet 2015;45:157–65. https://pmc.ncbi.nlm.nih.gov/articles/PMC4415828/. **PT**, szczebel 3. Tab. 2: VM 15–17 %MVIC, VL 14–19 %MVIC, BF 8–15 %MVIC, Gmed 26–47 %MVIC; „The Farmer's walk is recommended as an exercise which can strengthen the gluteus medius”. (użyte w 3 rekordach)
- **L3-S33** Ellestad SH i in. The Quantification of Muscle Activation During the Loaded Carry Movement Pattern. Int J Exerc Sci 2024;17(3):480–90. https://pmc.ncbi.nlm.nih.gov/articles/PMC11042841/. **PT**, szczebel 3. Tab. 2 (%MVIC): farmer's carry — longissimus 14–16, multifidus 15–16, RA 8–11, EO ~14; suitcase carry — longissimus 7/29, multifidus 9/21, RA 8/19; plank RA 49–54. „The FC and SC were characterized by increased core muscle activation bilaterally, with the SC exhibiting unique additions to ipsilateral muscle activation.” (użyte w 2 rekordach)
- **L3-S34** Lipscomb T i in. Agreement of Air Bike and Treadmill Protocols to Assess Maximal Oxygen Uptake. Int J Exerc Sci 2024;17(1):633–47. https://pmc.ncbi.nlm.nih.gov/articles/PMC11166135/. **A**, szczebel 3. air bike jako urządzenie cardio („airbikes (ABs) are increasingly popular exercise machines”); bez danych o mięśniach. (użyte w 1 rekordach)
- **L3-S35** McGill SM, Marshall LW. Kettlebell swing, snatch, and bottoms-up carry. J Strength Cond Res 2012;26(1):16–27. https://doi.org/10.1519/jsc.0b013e31823a4063. **A**, szczebel 3. „Abdominal muscular pulses together with the muscle bracing associated with carries create kettlebell-specific training opportunities.” (użyte w 1 rekordach)

## 6. Tabela (generowana z L3.json)

| Ćwiczenie | Werdykt | Zakres | Scalić do | Poprawki | Źródła | Pewność |
|---|---|---|---|---|---|---|
| 90/90 Hamstring | SCALIĆ | SCALIĆ | Hamstring Stretch |  | S17, S1, S3, S12 | umiarkowane |
| Adductor-SMR | OK | NISZOWE |  |  | S17, S5, S7 | umiarkowane |
| Adductor/Groin | SCALIĆ | SCALIĆ | The Straddle |  | S17, S3 | umiarkowane |
| All Fours Quad Stretch | SCALIĆ | SCALIĆ | On Your Side Quad Stretch |  | S17, S1, S3 | jedno źródło |
| Ankle Circles | OK | NISZOWE |  |  | S17, S3, S4, S15 | umiarkowane |
| Ankle On The Knee | POPRAWIĆ | ZOSTAJE |  | name: "Supine Figure-Four Stretch" | S17, S1, S3, S10, S9 | mocne |
| Anterior Tibialis-SMR | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Arm Circles | OK | ZOSTAJE |  |  | S17, S3, S4 | jedno źródło |
| Behind Head Chest Stretch | SCALIĆ | SCALIĆ | Elbows Back |  | S17, S3 | umiarkowane |
| Brachialis-SMR | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Calf Stretch Elbows Against Wall | SCALIĆ | SCALIĆ | Calf Stretch Hands Against Wall |  | S17, S1, S3 | umiarkowane |
| Calf Stretch Hands Against Wall | POPRAWIĆ | ZOSTAJE |  | name: "Wall Calf Stretch" | S17, S1, S3, S11, S10, S14, S15, S9 | mocne |
| Calves-SMR | OK | NISZOWE |  |  | S17, S5, S7, S6 | umiarkowane |
| Cat Stretch | POPRAWIĆ | ZOSTAJE |  | name: "Cat-Cow"; metric: "reps" | S17, S1, S3, S9 | umiarkowane |
| Chair Leg Extended Stretch | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Chair Lower Back Stretch | SCALIĆ | SCALIĆ | Standing Lateral Stretch |  | S17, S1, S3 | jedno źródło |
| Chair Upper Body Stretch | SCALIĆ | SCALIĆ | Elbows Back |  | S17, S1, S3 | jedno źródło |
| Chest And Front Of Shoulder Stretch | POPRAWIĆ | NISZOWE |  | recommended: [] | S17, S1, S3 | jedno źródło |
| Chest Stretch on Stability Ball | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Child's Pose | OK | ZOSTAJE |  |  | S17, S1, S3, S9, S13 | umiarkowane |
| Chin To Chest Stretch | OK | NISZOWE |  |  | S17, S1, S3, S9 | umiarkowane |
| Crossover Reverse Lunge | OK | NISZOWE |  |  | S17, S3, S4, S9 | umiarkowane |
| Dancer's Stretch | POPRAWIĆ | NISZOWE |  | name: "Seated Rotation Stretch" | S17, S1, S3, S12, S13 | mocne |
| Dynamic Back Stretch | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Dynamic Chest Stretch | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Elbow Circles | SCALIĆ | SCALIĆ | Arm Circles |  | S17, S3, S4 | jedno źródło |
| Elbows Back | POPRAWIĆ | ZOSTAJE |  | name: "Standing Chest Stretch" | S17, S1, S3, S9 | umiarkowane |
| Foot-SMR | POPRAWIĆ | NISZOWE |  | requires: [] | S17, S15 | umiarkowane |
| Front Leg Raises | POPRAWIĆ | ZOSTAJE |  | name: "Leg Swings (Front-to-Back)" | S17, S3, S4 | jedno źródło |
| Groin and Back Stretch | POPRAWIĆ | ZOSTAJE |  | name: "Butterfly Stretch" | S17, S1, S3, S10, S9 | umiarkowane |
| Groiners | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Hamstring Stretch | POPRAWIĆ | ZOSTAJE |  | name: "Supine Hamstring Stretch" | S17, S1, S3, S12, S14, S10 | mocne |
| Hamstring-SMR | POPRAWIĆ | ZOSTAJE |  | name: "Foam Roll: Hamstrings" | S17, S5, S7, S6 | mocne |
| Hip Circles (Prone) | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Hug A Ball | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Hug Knees To Chest | SCALIĆ | SCALIĆ | One Knee To Chest |  | S17, S1, S3, S12 | umiarkowane |
| IT Band and Glute Stretch | OK | NISZOWE |  |  | S17, S1, S3, S9 | umiarkowane |
| Iliotibial Tract-SMR | OK | NISZOWE |  |  | S17, S5, S7 | umiarkowane |
| Inchworm | OK | ZOSTAJE |  |  | S17, S3, S4, S9 | umiarkowane |
| Intermediate Groin Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Intermediate Hip Flexor and Quad Stretch | SCALIĆ | SCALIĆ | On Your Side Quad Stretch |  | S17, S1, S3 | jedno źródło |
| Iron Crosses (Stretch) | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Knee Across The Body | POPRAWIĆ | ZOSTAJE |  | name: "Supine Spinal Twist" | S17, S1, S3, S9 | umiarkowane |
| Knee Circles | OK | NISZOWE |  |  | S17, S3, S4 | brak źródła — uproszczenie |
| Kneeling Forearm Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Kneeling Hip Flexor | POPRAWIĆ | ZOSTAJE |  | name: "Kneeling Hip Flexor Stretch" | S17, S1, S3, S9 | umiarkowane |
| Latissimus Dorsi-SMR | OK | NISZOWE |  |  | S17, S5, S7 | umiarkowane |
| Looking At Ceiling | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Lower Back-SMR | USUNĄĆ | USUNĄĆ |  |  | S17, S8 | jedno źródło |
| Lying Bent Leg Groin | SCALIĆ | SCALIĆ | Groin and Back Stretch |  | S17, S3 | umiarkowane |
| Lying Crossover | SCALIĆ | SCALIĆ | Knee Across The Body |  | S17, S3 | umiarkowane |
| Lying Glute | SCALIĆ | SCALIĆ | Ankle On The Knee |  | S17, S3 | umiarkowane |
| Lying Hamstring | SCALIĆ | SCALIĆ | Hamstring Stretch |  | S17, S3 | umiarkowane |
| Lying Prone Quadriceps | SCALIĆ | SCALIĆ | On Your Side Quad Stretch |  | S17, S3 | umiarkowane |
| Middle Back Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Neck-SMR | USUNĄĆ | USUNĄĆ |  |  | S17, S8 | jedno źródło |
| On Your Side Quad Stretch | POPRAWIĆ | ZOSTAJE |  | name: "Side-Lying Quad Stretch" | S17, S1, S3, S10, S9 | mocne |
| On-Your-Back Quad Stretch | SCALIĆ | SCALIĆ | On Your Side Quad Stretch |  | S17, S1, S3 | jedno źródło |
| One Arm Against Wall | POPRAWIĆ | ZOSTAJE |  | name: "Wall Lat Stretch" | S17, S1, S3, S9 | jedno źródło |
| One Half Locust | SCALIĆ | SCALIĆ | On Your Side Quad Stretch |  | S17, S1, S3 | jedno źródło |
| One Handed Hang | SCALIĆ | SCALIĆ | Dead Hang |  | S17 | jedno źródło |
| One Knee To Chest | OK | ZOSTAJE |  |  | S17, S1, S3, S12, S13 | mocne |
| Overhead Lat | SCALIĆ | SCALIĆ | One Arm Against Wall |  | S17, S3 | umiarkowane |
| Overhead Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Overhead Triceps | SCALIĆ | SCALIĆ | Triceps Stretch |  | S17, S3 | umiarkowane |
| Pelvic Tilt Into Bridge | SCALIĆ | SCALIĆ | Glute Bridge |  | S17, S9 | umiarkowane |
| Peroneals Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Peroneals-SMR | OK | NISZOWE |  |  | S17, S5, S7 | jedno źródło |
| Piriformis-SMR | OK | NISZOWE |  |  | S17, S5, S7 | umiarkowane |
| Posterior Tibialis Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Pyramid | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Quadriceps-SMR | POPRAWIĆ | ZOSTAJE |  | name: "Foam Roll: Quadriceps" | S17, S5, S7, S6 | mocne |
| Rhomboids-SMR | OK | NISZOWE |  |  | S17, S5, S7, S8 | umiarkowane |
| Round The World Shoulder Stretch | POPRAWIĆ | NISZOWE |  | recommended: [] | S17, S3, S4 | jedno źródło |
| Runner's Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Seated Biceps | SCALIĆ | SCALIĆ | Standing Biceps Stretch |  | S17, S3 | umiarkowane |
| Seated Calf Stretch | OK | NISZOWE |  |  | S17, S1, S3, S15, S9 | umiarkowane |
| Seated Floor Hamstring Stretch | OK | NISZOWE |  |  | S17, S1, S3, S9 | umiarkowane |
| Seated Front Deltoid | SCALIĆ | SCALIĆ | Elbows Back |  | S17, S3, S9 | umiarkowane |
| Seated Glute | SCALIĆ | SCALIĆ | Ankle On The Knee |  | S17, S3 | umiarkowane |
| Seated Hamstring | SCALIĆ | SCALIĆ | Seated Floor Hamstring Stretch |  | S17, S3 | umiarkowane |
| Seated Hamstring and Calf Stretch | SCALIĆ | SCALIĆ | Seated Floor Hamstring Stretch |  | S17, S1, S3, S9 | umiarkowane |
| Seated Overhead Stretch | SCALIĆ | SCALIĆ | Standing Lateral Stretch |  | S17, S1, S3, S9 | umiarkowane |
| Shoulder Circles | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Shoulder Raise | SCALIĆ | SCALIĆ | Shoulder Circles |  | S17, S3, S4 | jedno źródło |
| Shoulder Stretch | POPRAWIĆ | ZOSTAJE |  | name: "Cross-Body Shoulder Stretch" | S17, S1, S3, S16 | mocne |
| Side Leg Raises | POPRAWIĆ | NISZOWE |  | name: "Leg Swings (Side-to-Side)" | S17, S3, S4 | jedno źródło |
| Side Lying Groin Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Side Neck Stretch | OK | NISZOWE |  |  | S17, S1, S3, S11, S9 | umiarkowane |
| Side Wrist Pull | SCALIĆ | SCALIĆ | Shoulder Stretch |  | S17, S1, S3 | jedno źródło |
| Side-Lying Floor Stretch | SCALIĆ | SCALIĆ | Standing Lateral Stretch |  | S17, S1, S3 | jedno źródło |
| Spinal Stretch | SCALIĆ | SCALIĆ | Middle Back Stretch |  | S17, S1, S3 | jedno źródło |
| Standing Biceps Stretch | OK | NISZOWE |  |  | S17, S1, S3, S9 | umiarkowane |
| Standing Elevated Quad Stretch | OK | NISZOWE |  |  | S17, S1, S3, S14 | umiarkowane |
| Standing Gastrocnemius Calf Stretch | OK | NISZOWE |  |  | S17, S1, S3, S9 | jedno źródło |
| Standing Hamstring and Calf Stretch | SCALIĆ | SCALIĆ | Standing Gastrocnemius Calf Stretch |  | S17, S1, S3 | jedno źródło |
| Standing Hip Circles | OK | NISZOWE |  |  | S17, S3, S4, S9 | umiarkowane |
| Standing Hip Flexors | SCALIĆ | SCALIĆ | Kneeling Hip Flexor |  | S17, S1, S3, S9 | umiarkowane |
| Standing Lateral Stretch | OK | NISZOWE |  |  | S17, S1, S3, S11 | umiarkowane |
| Standing Pelvic Tilt | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Standing Soleus And Achilles Stretch | OK | NISZOWE |  |  | S17, S1, S3, S15 | umiarkowane |
| Standing Toe Touches | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| The Straddle | OK | NISZOWE |  |  | S17, S1, S3, S9 | umiarkowane |
| Torso Rotation | OK | NISZOWE |  |  | S17, S3, S4, S9 | umiarkowane |
| Tricep Side Stretch | SCALIĆ | SCALIĆ | Shoulder Stretch |  | S17, S1, S3, S16 | umiarkowane |
| Triceps Stretch | POPRAWIĆ | ZOSTAJE |  | name: "Overhead Triceps Stretch" | S17, S1, S3, S9 | umiarkowane |
| Upper Back Stretch | OK | NISZOWE |  |  | S17, S1, S3 | jedno źródło |
| Upper Back-Leg Grab | SCALIĆ | SCALIĆ | Seated Floor Hamstring Stretch |  | S17, S1, S3 | jedno źródło |
| Windmills | POPRAWIĆ | NISZOWE |  | name: "Lying Leg Crossover Swings" | S17, S3, S4 | jedno źródło |
| World's Greatest Stretch | OK | ZOSTAJE |  |  | S17, S3, S4, S9 | umiarkowane |
| Wrist Circles | OK | NISZOWE |  |  | S17, S3, S4 | jedno źródło |
| Assault Bike | OK | ZOSTAJE |  |  | S34, S23 | brak źródła — uproszczenie |
| Bieg | OK | ZOSTAJE |  |  | S19 | jedno źródło |
| Burpees | OK | ZOSTAJE |  |  | S9 | jedno źródło |
| Incline Walk (bieżnia) | OK | ZOSTAJE |  |  | S20 | jedno źródło |
| Mountain Climbers | OK | ZOSTAJE |  |  | S9, S17 | umiarkowane |
| Rower | OK | ZOSTAJE |  |  | S22, S23 | umiarkowane |
| Rowing Machine | OK | ZOSTAJE |  |  | S18 | jedno źródło |
| Skakanka | OK | ZOSTAJE |  |  | S27 | jedno źródło |
| Battle Ropes | OK | ZOSTAJE |  |  | S26, S9 | umiarkowane |
| Carioca Quick Step | OK | NISZOWE |  |  | S17 | jedno źródło |
| Fast Skipping | OK | NISZOWE |  |  | S17 | jedno źródło |
| High Knees | OK | ZOSTAJE |  |  |  | brak źródła — uproszczenie |
| Jumping Jacks | OK | ZOSTAJE |  |  |  | brak źródła — uproszczenie |
| Orbitrek | OK | ZOSTAJE |  |  | S21 | jedno źródło |
| Recumbent Bike | SCALIĆ | SCALIĆ | Rower |  | S17, S22 | umiarkowane |
| Single-Cone Sprint Drill | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Skating | USUNĄĆ | USUNĄĆ |  |  | S17 | jedno źródło |
| Ski Erg | OK | ZOSTAJE |  |  | S24, S25 | umiarkowane |
| Stair Climber | OK | ZOSTAJE |  |  | S20 | brak źródła — uproszczenie |
| Treadmill Walking | OK | ZOSTAJE |  |  | S20 | jedno źródło |
| Farmer's Walk | POPRAWIĆ | ZOSTAJE |  | muscleLoad: {"forearms": 1, "upper_back": 1, "obliques": 0.5, "abs": 0.5, "quads": 0.25, "glutes": 0.25, "calves": 0.25, "abductors": 0.25} | S30, S32, S33, S28, S9 | umiarkowane |
| Suitcase Carry | OK | ZOSTAJE |  |  | S28, S29, S33, S9 | umiarkowane |
| Conan's Wheel | OK | NISZOWE |  |  | S17, S30 | brak źródła — uproszczenie |
| Double Kettlebell Front Rack Carry | OK | NISZOWE |  |  | S35 | brak źródła — uproszczenie |
| Farmer's Walk (Farmers Handles) | POPRAWIĆ | NISZOWE |  | muscleLoad: {"forearms": 1, "upper_back": 1, "obliques": 0.5, "abs": 0.5, "quads": 0.25, "glutes": 0.25, "calves": 0.25, "abductors": 0.25} | S30, S32, S28 | jedno źródło |
| Farmer's Walk (trap bar) | POPRAWIĆ | NISZOWE |  | muscleLoad: {"forearms": 1, "upper_back": 1, "abs": 0.5, "obliques": 0.5, "quads": 0.25, "glutes": 0.25, "calves": 0.25, "abductors": 0.25} | S30, S32 | jedno źródło |
| Overhead Carry (hantle) | OK | NISZOWE |  |  |  | brak źródła — uproszczenie |
| Rickshaw Carry | OK | NISZOWE |  |  | S17, S30 | brak źródła — uproszczenie |
| Yoke Walk | POPRAWIĆ | NISZOWE |  | muscleLoad: {"quads": 1, "abs": 1, "glutes": 0.5, "upper_back": 0.5, "lower_back": 0.5, "abductors": 0.5, "calves": 0.25} | S28, S31, S30 | jedno źródło |
