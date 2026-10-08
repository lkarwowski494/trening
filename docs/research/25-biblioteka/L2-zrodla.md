# 25 / L2. Biblioteka ćwiczeń — część L2: izolacja (barki, plecy, nogi, pośladki, łydki) i bazowe ćwiczenia izolowane — źródła (08.10.2026)

Zlecenie właściciela (08.10.2026): „mamy trochę za szeroką bibliotekę ćwiczeń, a przynajmniej nie jestem przekonany, czy są poprawnie
pomapowane — zrób głęboki research i potwierdź każde z nich”. Ta część obejmuje **138 ćwiczeń** (lista wejściowa z katalogu
`docs/research/equipment/catalog.json`): 40 ćwiczeń izolowanych z `LIB_BASE` i 98 ćwiczeń izolowanych z katalogu 04–05.10 (barki, plecy,
nogi, pośladki, łydki, przedramiona).

**Dokument niczego nie zmienia w kodzie ani w katalogu.** Dane: `L2.json` (jeden rekord na ćwiczenie: `verdict`, `scope`, `mergeInto`,
`fixes` — tylko pola do zmiany, `sources`, `confidence`, `note`). Podsumowanie niżej generuje `node docs/research/25-biblioteka/podsumowanie-L2.mjs --write`
(sprawdzenie aktualności: `--check`).

## Metoda

- Dla każdego ćwiczenia: (1) czy to uznane ćwiczenie i ustalona nazwa angielska, (2) sprzęt (`requires`, `recommended`, `loadSource`,
  `implements`, `cables`), (3) wzorzec i grupa, (4) miara i tryb ciężaru, (5) partie i `muscleLoad`, (6) zakres w bibliotece.
- **Partie i obciążenie:** dla ćwiczeń bazowych obowiązuje `docs/research/24-przypisanie-partii.md` (źródła S1–S38 cytowane tu jako „24-Sx”);
  nie zmieniano ich bez mocniejszego dowodu. Dla izolacji akcesoryjnych przyjęto listy ExRx (Target / Synergists / Stabilizers, szczebel 4)
  z regułą: **Target → waga 1 (partia główna), Synergist → 0,5 lub 0,25, Stabilizer → co najwyżej 0,25**; gdzie istnieją badania EMG/wzrostu
  (szczebel 3), mają pierwszeństwo.
- **Mięśnie bez regionu w aplikacji** (stożek rotatorów, zębaty przedni, zginacze biodra, piszczelowy przedni): nie przypisywano ich „na siłę”
  do partii głównej sąsiedniego mięśnia, bo zawyża to serie tygodniowe (definicja partii głównej z 24-S6: „the primary force generator”).
  Propozycja: bez partii głównej (jak ćwiczenia szyi), sąsiednia partia najwyżej pomocnicza. Decyzja — pytania Q1, Q2, Q5.
- **Zakres (ocena produktowa, bez źródeł):** ZOSTAJE — popularne i przydatne; NISZOWE — zostaje, ale ukryte w domyślnych listach
  (rzadkie warianty, nietypowy sprzęt, strongman, ćwiczenia korekcyjne/szyi); SCALIĆ — duplikat albo wariant różniący się tylko pozycją
  lub końcówką; USUNĄĆ — nieidentyfikowalne, niemierzalne albo ryzykowne. Ćwiczenia z historii użytkownika nie są kasowane — aplikacja je
  archiwizuje.
- **Odczyt źródeł:** ExRx.net blokuje pobieranie automatyczne (Cloudflare), strony czytano w całości z archiwum Wayback Machine
  (zrzuty 2019–2026, adres oryginalny w wykazie). Badania — streszczenia z Europe PMC (**A**); fedb — pełny rekord JSON (**PT**).
- **Pewność** (`confidence`): mocne — ≥ 2 niezależne źródła, w tym badanie (szczebel 2–3); umiarkowane — dwa niezależne źródła (np. ExRx +
  fedb albo ExRx + badanie EMG) lub ćwiczenie bazowe ocenione w docs/24; jedno źródło; brak źródła — uproszczenie.
  ExRx i fedb to różne organizacje (ExRx.net; fedb — zbiór domeny publicznej oparty na innym serwisie), ale oba to szczebel 4.

## Źródła

Szczebel wg CLAUDE.md (1 wzory, 2 przeglądy/stanowiska, 3 badania i książki, 4 serwisy i dokumentacja, 5 praktyka). PT — pełny tekst, A — streszczenie.

### ExRx.net (szczebel 4, PT — strony ćwiczeń, sekcje „Classification” i „Muscles”; odczyt przez web.archive.org)

- **L2-S1** ExRx — uginania ramion. https://exrx.net/WeightExercises/Biceps/BBCurl, …/Biceps/DBCurl, …/Biceps/CBCurl, …/Biceps/DBInclineCurl,
  …/Brachialis/DBConcentrationCurl, …/Brachialis/DBPreacherCurl, …/Brachialis/BBProneInclineCurl, …/Brachioradialis/DBHammerCurl.
  BBCurl: „Target Biceps Brachii; Synergists Brachialis, Brachioradialis”; DBConcentrationCurl i DBPreacherCurl: „Target Brachialis; Synergists
  Biceps Brachii, Brachioradialis”; DBHammerCurl: „Target Brachioradialis; Synergists Brachialis, Biceps Brachii”.
- **L2-S2** ExRx — triceps. …/Triceps/CBPushdown, …/Triceps/CBTriExt, …/Triceps/CBStandingTricepsExtensionRope, …/Triceps/DBTriExt,
  …/Triceps/BBLyingTriExt, …/Triceps/DBLyingTriExt, …/Triceps/DBKickback. Wszystkie: „Target Triceps Brachii; Synergists None”; DBKickback —
  stabilizatory m.in. „Deltoid, Posterior”.
- **L2-S3** ExRx — rozpiętki. …/PectoralSternal/DBFly („Target Pectoralis Major, Sternal; Synergists Pectoralis Major, Clavicular; Deltoid,
  Anterior; Biceps Brachii, Short Head; Coracobrachialis”), …/PectoralSternal/CBStandingFly, …/PectoralSternal/LVPecDeckFly.
- **L2-S4** ExRx — akton boczny. …/DeltoidLateral/DBLateralRaise („Target Deltoid, Lateral; Synergists Deltoid, Anterior; Supraspinatus;
  Trapezius, Middle; Trapezius, Lower; Serratus Anterior, Inferior Digitations”), …/CBOneArmLateralRaise, …/CBSeatedLateralRaise,
  …/DBSeatedLateralRaise, …/DBOneArmLateralRaise, …/DBInclineLateralRaise (synergista „Deltoid, Posterior”), …/LVLateralRaise.
- **L2-S5** ExRx — przedni akton. …/DeltoidAnterior/DBFrontRaise („Target Deltoid, Anterior; Synergists Pectoralis Major, Clavicular; Deltoid,
  Lateral; …”), …/CBFrontRaise, …/BBFrontRaise, …/DBAlternInclineFrontRaise.
- **L2-S6** ExRx — akton tylny. …/DeltoidPosterior/DBRearLateralRaise („Target Deltoid, Posterior; Synergists Infraspinatus, Teres Minor,
  Deltoid, Lateral, Trapezius, Middle, Trapezius, Lower, Rhomboids”), …/DBSeatedRearLateralRaise, …/DBOneArmRearLateralRaise,
  …/CBOneArmRearLateralRaise, …/CBStandingReverseFly, …/CBSeatedRearLateralRaise, …/LVSeatedRearDeltFly, …/LVRearDeltFlyGriplessPecDeck.
- **L2-S7** ExRx — wiosłowanie pionowe. …/DeltoidLateral/DBUprightRow („Mechanics: Compound; Target Deltoid, Lateral; Synergists Deltoid,
  Anterior; Supraspinatus; Brachialis; Brachioradialis; Biceps Brachii; Trapezius, Middle; Trapezius, Lower; …; Stabilizers Trapezius, Upper”),
  …/DBOneArmUprightRow, …/BBUprightRow, …/CBUprightRow, …/SMUprightRow.
- **L2-S8** ExRx — Y raise. …/DeltoidLateral/CBYRaise, …/DeltoidLateral/STYShoulderRaise: „Target Deltoid, Lateral; Synergists Supraspinatus,
  Teres Minor, Infraspinatus, Trapezius, Lower, Trapezius, Middle, …, Deltoid, Anterior, Deltoid, Posterior”.
- **L2-S9** ExRx — nadgrzebieniowy. …/Supraspinatus/DBFullCanLateralRaise, …/Supraspinatus/DBFrontLateralRaise: „Target Supraspinatus;
  Synergists Deltoid, Lateral; Deltoid, Anterior; …”.
- **L2-S10** ExRx — rotacja zewnętrzna. …/Infraspinatus/DBLyingExternalRotation, …/Infraspinatus/CBStandingExternalRotation: „Target
  Infraspinatus; Synergists Teres Minor; Deltoid, Posterior”.
- **L2-S11** ExRx — rotacja wewnętrzna. …/Subscapularis/CBInternalRotation, …/Subscapularis/CBStandingInternalRotation: „Target Subscapularis;
  Synergists Pectoralis Major, Sternal; Pectoralis Major, Clavicular; Latissimus Dorsi; Teres Major; Deltoid, Anterior”.
- **L2-S12** ExRx — „Incline Shoulder Raise”. …/SerratusAnterior/BBInclineShoulderRaise, …/DBInclineShoulderRaise, …/SMInclineShoulderRaise:
  „Target Serratus Anterior; Synergists Pectoralis Major, Clavicular; Stabilizers Deltoid, Anterior; Triceps Brachii”.
- **L2-S13** ExRx — szyja. …/Splenius/WtLyingNeckExtension, …/Splenius/WtNeckHarnessExt („Target Splenius; Synergists Trapezius, Upper; Levator
  Scapulae; Erector Spinae, Cervicis & Capitis Fibers; Sternocleidomastoid, Posterior Fibers”), …/Sternocleidomastoid/WtLyingNeckFlexion
  („Target Sternocleidomastoid”).
- **L2-S14** ExRx — wzruszanie barków. …/TrapeziusUpper/BBShrug, …/DBShrug, …/CBShrug, …/CBShrugDualPulley, …/LVShrug, …/SMShrug: „Target
  Trapezius, Upper; Synergists Trapezius, Middle; Levator Scapulae; Stabilizers Erector Spinae”.
- **L2-S15** ExRx — pullover / ruch prostymi rękami. …/LatissimusDorsi/CBPullover (stojąc z wyciągu górnego: „Target Latissimus Dorsi;
  Synergists Pectoralis Major, Sternal; Triceps Long Head; Teres Major; Deltoid, Posterior; …”), …/LatissimusDorsi/BBBentArmPullover (te same
  „Target”/„Synergists”), …/LatissimusDorsi/LVPullover; dla porównania …/Triceps/CBInclinePushdown („Target Triceps Brachii”).
- **L2-S16** ExRx — nadgarstek. …/WristFlexors/DBWristCurl („Target Wrist Flexors; Synergists None”), …/WristExtensors/DBReverseWristCurl
  („Target Wrist Extensors”).
- **L2-S17** ExRx — dwugłowe. …/Hamstrings/LVSeatedLegCurl, …/LVLyingLegCurl, …/LVStandingLegCurl, …/CBStandingLegCurl („Target Hamstrings;
  Synergists Gastrocnemius, Gracilis, Sartorius, Popliteus”), …/BWHamstringRaise (nordic; „Stabilizers Gluteus Maximus, Adductor Magnus,
  Erector Spinae”), …/WTGluteHamRaise i …/BWGluteHamRaiseHead („Synergists Gluteus Maximus, Adductor Magnus, Gastrocnemius, …”),
  …/BWBallLegCurl („Stabilizers Gluteus Maximus, Erector Spinae”).
- **L2-S18** ExRx — czworogłowe izolowane. …/Quadriceps/LVLegExtension, …/LVAlternatingLegExtension („Target Quadriceps; Synergists None”),
  …/BWSissySquat, …/WTSissySquat („Mechanics: Isolated; Target Quadriceps; Synergists None; Stabilizers Gluteus Maximus, Soleus, Gastrocnemius,
  Rectus Abdominis, Obliques”).
- **L2-S19** ExRx — odwodziciele i przywodziciele. …/HipAbductor/LVSeatedHipAbduction („Synergists Gluteus Medius, Gluteus Minimus, Gluteus
  Maximus, …”), …/HipAbductor/CBHipAbduction („Synergists Gluteus Medius, Gluteus Minimus, Tensor Fasciae Latae”), …/HipAdductors/LVSeatedHipAdduction
  („Target Adductors, Hip; Synergists Pectineus, Gracilis”), …/HipAdductors/CBHipAdduction („Synergists Pectineus, Gracilis, Gluteus Maximus,
  Lower Fibers”).
- **L2-S20** ExRx — pośladek wielki izolowany. …/GluteusMaximus/CBGluteKickback („Target Gluteus Maximus; Synergists Adductor Magnus; Dynamic
  Stabilizers Hamstrings”), …/GluteusMaximus/CBStandingHipExtension („Synergists Hamstrings”), …/GluteusMaximus/LVBentOverRearKick.
- **L2-S21** ExRx — łydki i goleń. …/Gastrocnemius/LVStandingCalfRaise, …/BBStandingCalfRaise, …/CBStandingCalfRaise, …/SMStandingCalfRaise,
  …/DBStandingCalfRaise, …/DBSingleLegCalfRaise, …/BWStandingCalfRaise, …/SL45CalfPress, …/LVDonkeyCalfRaise, …/WTDonkeyCalfRaise („Target
  Gastrocnemius; Synergists Soleus”); …/Soleus/LVSeatedCalfRaise, …/Soleus/SBSeatedCalfRaise („Target Soleus; Synergists Gastrocnemius”);
  …/TibialisAnterior/BBReverseCalfRaise („Target Tibialis Anterior; Synergists None”).
- **L2-S22** ExRx — zgięcie biodra. …/HipFlexors/CBStandingLegRaise: „Target Iliopsoas; Synergists Tensor Fasciae Latae, Pectineus, Sartorius,
  Adductor Longus, Adductor Brevis; … Dynamic Stabilizers Rectus Femoris”.

### Zbiór danych (szczebel 4, PT)

- **L2-S23** free-exercise-db (yuhonas/free-exercise-db, Unlicense), plik `dist/exercises.json`,
  https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json (pobrany 08.10.2026). Pola `primaryMuscles`,
  `secondaryMuscles`, `equipment`, `instructions` dla wpisów o nazwie z pola `fedb`. Przykłady cytatów: „Band Hip Adductions” — „Keeping the knee
  straight, raise your right legs out to the side as far as you can”; „Cable Incline Pushdown” — „primaryMuscles: lats”, „Keeping the upper arms
  stationary, lift your arms back in a semi circle”; „Calf Raise On A Dumbbell” — „stand on a dumbbell handle, preferably one with round plates so
  that it rolls”; „Smith Machine Reverse Calf Raises” — „Raise the balls of your feet … by extending your toes”; „Leg Lift” — „lift one leg behind
  you as if performing a leg curl”; „Prone Manual Hamstring” — „You will need a partner for this exercise”.

### Badania (szczebel 2–3, Europe PMC)

- **L2-S24** Reinold MM i in. Electromyographic analysis of the rotator cuff and deltoid musculature during common shoulder external rotation
  exercises. J Orthop Sports Phys Ther 2004;34(7):385–94. https://pubmed.ncbi.nlm.nih.gov/15296366/ (doi 10.2519/jospt.2004.34.7.385). **A**,
  szczebel 3 (EMG, elektrody śródmięśniowe). „Sidelying ER produced the greatest amount of EMG activity for the infraspinatus (62% MVIC) and teres
  minor (67% MVIC). The greatest amount of activity of the supraspinatus (82% MVIC), middle deltoid (87% MVIC), and posterior deltoid (88% MVIC) was
  observed during prone horizontal abduction at 100 degrees with full ER.”
- **L2-S25** Distefano LJ i in. Gluteal muscle activation during common therapeutic exercises. J Orthop Sports Phys Ther 2009;39(7):532–40.
  https://pubmed.ncbi.nlm.nih.gov/19574661/. **A**, szczebel 3 (EMG). „Gluteus medius activity was significantly greater during side-lying hip
  abduction (81% … MVIC) compared to the 2 types of hip clam (40% … MVIC, 38% … MVIC)”; „lateral band walk (27% … MVIC), hip clam (34% … MVIC)”
  [pośladek wielki].
- **L2-S26** Selkowitz DM, Beneck GJ, Powers CM. Which exercises target the gluteal muscles while minimizing activation of the tensor fascia lata?
  J Orthop Sports Phys Ther 2013;43(2):54–64. https://pubmed.ncbi.nlm.nih.gov/23160432/. **A**, szczebel 3 (EMG, elektrody śródmięśniowe).
  „Both gluteal muscles were significantly (P<.05) more active than the TFL in unilateral and bilateral bridging, quadruped hip extension (knee
  flexed and extending), the clam, sidestepping, and squatting … highest for the clam (115), sidestep (64)”.
- **L2-S27** Coratella G i in. An Electromyographic Analysis of Lateral Raise Variations and Frontal Raise in Competitive Bodybuilders. Int J Environ
  Res Public Health 2020;17(17):6015. https://pmc.ncbi.nlm.nih.gov/articles/PMC7503819/. **A**, szczebel 3 (EMG). „Frontal raise mainly activates
  anterior deltoid and pectoralis major”; „Medial deltoid showed greater sEMG RMS in LR-neutral than … frontal raise”.
- **L2-S28** Ekstrom RA, Donatelli RA, Soderberg GL. Surface electromyographic analysis of exercises for the trapezius and serratus anterior muscles.
  J Orthop Sports Phys Ther 2003;33(5):247–58. https://pubmed.ncbi.nlm.nih.gov/12774999/. **A**, szczebel 3 (EMG). „The unilateral shoulder shrug
  exercise was found to produce the greatest EMG activity in the upper trapezius. For the middle trapezius, the greatest EMG amplitudes were generated
  with … shoulder horizontal extension with external rotation and the overhead arm raise … in the prone position.”
- **L2-S29** Conley MS, Stone MH, Nimmons M, Dudley GA. Specificity of resistance training responses in neck muscle size and strength. Eur J Appl
  Physiol 1997;75(5):443–8. https://pubmed.ncbi.nlm.nih.gov/9189733/. **A**, szczebel 3 (MRI, trening 12 tyg.). „This hypertrophy for RESX was due
  mainly to increases in CSA of 23.9 …, 24.0 …, and 24.9 …% for the splenius capitis, and semispinalis capitis and cervicis muscles”; „short-term
  resistance training does not provide a sufficient stimulus to evoke neck muscle hypertrophy unless specific neck exercises are performed”.
- **L2-S30** Conley MS i in. Noninvasive analysis of human neck muscle function. Spine 1995;20(23):2505–12. https://pubmed.ncbi.nlm.nih.gov/8610245/.
  **A**, szczebel 3 (MRI T2). „extension--semispinalis capitis and cervicis and splenius capitis; flexion--sternocleidomastoid and longus capitis
  and colli; … lateral flexion--sternocleidomastoid”. (S29 i S30 — jeden zespół.)
- **L2-S31** Pereira NDS i in. Reverse Nordic Curl Does Not Generate Superior Eccentric Activation of the Quadriceps Muscle Than Bodyweight Squat-Based
  Exercises. J Sport Rehabil 2024. https://pubmed.ncbi.nlm.nih.gov/39214520/ (doi 10.1123/jsr.2023-0431). **A**, szczebel 3 (EMG). „RNC generated a
  similar rectus femoris and vastus medialis eccentric activation compared with the squat-based exercises”.
- **L2-S32** Alonso-Fernandez D, Fernandez-Rodriguez R, Abalo-Núñez R. Changes in rectus femoris architecture induced by the reverse nordic hamstring
  exercises. J Sports Med Phys Fitness 2019. https://pubmed.ncbi.nlm.nih.gov/30293403/. **A**, szczebel 3 (USG, 8 tyg.). „At the end of the training
  period, a significant increase in the muscle fascicle length …, muscle thickness …, pennation angle … and cross-sectional area … was observed.”
- **L2-S33** González-de-la-Flor Á. Optimizing Hip Abductor Strengthening for Lower Extremity Rehabilitation: A Narrative Review on the Role of
  Monster Walk and Lateral Band Walk. J Funct Morphol Kinesiol 2025;10(3):294. https://pmc.ncbi.nlm.nih.gov/articles/PMC12372021/. **A**,
  przegląd narracyjny (traktowany jak szczebel 3). „Lateral and monster walks elicit moderate to high activation of the gluteus medius and maximus,
  especially when performed with the band at the ankles or forefeet and in a semi-squat posture.”
- **L2-S34** Kim S i in. Superficial and Deep Gluteal Muscle Activation During Common Therapeutic Exercises: A Muscle Functional Magnetic Resonance
  Imaging Analysis. Sports Health 2026. https://pmc.ncbi.nlm.nih.gov/articles/PMC12454362/. **A**, szczebel 3 (mfMRI, n = 10). „BRIDGE (11.6%) and
  ABD-ER (13.2%) activated the gluteus medius more than CLAM (4.5%)”; „CLAM (24.2%) and ABD-ER (19.5%) activated the obturator internus more …”.
  (Ten sam zespół co S25 — DiStefano jest współautorem; liczone jako jedno źródło z S25.)

### Ze wcześniejszego przeglądu (docs/research/24-przypisanie-partii.md — pełne opisy tam)

24-S3 (Kinoshita 2026, prostowanie nóg/suwnica, MRI), 24-S4 (przegląd pośladka wielkiego), 24-S6 (Pelland — definicje partii głównej
i pomocniczej), 24-S12, 24-S13 (uginanie — wzrost zginaczy łokcia), 24-S22 (wyprost biodra — dwugłowe), 24-S27, 24-S28 (uginanie nóg, nordic — MRI),
24-S29 (triceps nad głową — MRI), 24-S30 (łydki stojąc vs siedząc — MRI), 24-S31 (wznosy bokiem — USG), 24-S35 (OpenStax, anatomia),
24-S37 (najszerszy — przegląd EMG).

Przejrzane, nieużyte: Nagao & Ishii 2021 (czworoboczny w zarzucie — nie dotyczy wzruszania jako ćwiczenia), badania EMG wznosów bokiem
z modulacją magnetyczną (Cao 2017, Qiu 2018 — inny temat). Nie znaleziono: badania EMG „fire hydrant” (odwodzenie w podporze), badań dla
Cuban Press, Kettlebell Halo, Car Drivers, Crucifix, Sled Reverse Flye — te wpisy opierają się na jednym źródle (fedb).

<!-- PODSUMOWANIE:START (generowane: node docs/research/25-biblioteka/podsumowanie-L2.mjs --write) -->
## Podsumowanie (z L2.json)

- Ćwiczeń: **138**.
- Werdykt: OK 94 · POPRAWIĆ 32 · SCALIĆ 8 · USUNĄĆ 4.
- Zakres: ZOSTAJE 72 · NISZOWE 54 · SCALIĆ 8 · USUNĄĆ 4.
- Pewność: mocne 14 · umiarkowane 87 · jedno źródło 36 · brak źródła — uproszczenie 1.
- Poprawiane pola (liczba ćwiczeń): muscleLoad 15 · name 15 · secondaryMuscles 12 · muscles 11 · loadMode 2 · requires 1 · cables 1.
- Użyte źródła: 47 (L2-S23 ×68, 24-S35 ×17, L2-S21 ×15, L2-S17 ×10, L2-S1 ×9, 24-S6 ×9 …).

### Poprawki (POPRAWIĆ)
- Concentration Curl (hantle) — loadMode: unilateral
- Straight Arm Pulldown — muscleLoad: {"lats":1,"chest":0.25,"triceps":0.25,"rear_delt":0.25,"abs":0.25}
- Triceps Kickback — loadMode: unilateral
- Upright Row — name: Upright Row (hantle)
- Barbell Incline Shoulder Raise — muscles: []; secondaryMuscles: ["klatka"]; muscleLoad: {"chest":0.5,"front_delt":0.25,"triceps":0.25}
- Bent Over Low-Pulley Side Lateral — name: One-Arm Cable Rear Lateral Raise
- Cable Internal Rotation — muscles: []; secondaryMuscles: ["barki"]; muscleLoad: {"front_delt":0.5,"chest":0.25}
- Dumbbell Incline Shoulder Raise — muscles: []; secondaryMuscles: ["klatka"]; muscleLoad: {"chest":0.5,"front_delt":0.25,"triceps":0.25}
- External Rotation (hantel) — muscles: []; secondaryMuscles: ["barki"]; muscleLoad: {"rear_delt":0.5,"upper_back":0.25}
- External Rotation (linki) — muscles: []; secondaryMuscles: ["barki"]; muscleLoad: {"rear_delt":0.5,"upper_back":0.25}
- External Rotation with Band — muscles: []; secondaryMuscles: ["barki"]; muscleLoad: {"rear_delt":0.5,"upper_back":0.25}
- Internal Rotation with Band — muscles: []; secondaryMuscles: ["barki"]; muscleLoad: {"front_delt":0.5,"chest":0.25}
- Lateral Raise - With Bands — name: Band Lateral Raise
- Lying Face Down Plate Neck Resistance — name: Lying Neck Extension (talerz)
- Lying Face Up Plate Neck Resistance — name: Lying Neck Flexion (talerz)
- One-Arm Side Laterals — name: One-Arm Lateral Raise (hantel)
- Seated Head Harness Neck Resistance — name: Neck Harness Extension
- Single Dumbbell Raise — name: Single Dumbbell Front Raise
- Smith Incline Shoulder Raise — muscles: []; secondaryMuscles: ["klatka"]; muscleLoad: {"chest":0.5,"front_delt":0.25,"triceps":0.25}
- Standing Dumbbell Straight-Arm Front Delt Raise Above Head — name: Dumbbell Front Raise to Overhead
- Standing Front Barbell Raise Over Head — name: Barbell Front Raise to Overhead
- Upright Row With Bands — name: Band Upright Row
- Hip Flexion with Band — muscles: []; secondaryMuscles: ["czworogłowe"]; muscleLoad: {"quads":0.5,"abs":0.25}
- Slider Hamstring Curl — secondaryMuscles: []; muscleLoad: {"hamstrings":1,"glutes":0.25,"lower_back":0.25}
- Stability Ball Hamstring Curl — secondaryMuscles: []; muscleLoad: {"hamstrings":1,"glutes":0.25,"lower_back":0.25}
- Bent-Arm Barbell Pullover — muscles: ["plecy"]; secondaryMuscles: ["klatka"]; muscleLoad: {"lats":1,"chest":0.5,"triceps":0.25,"abs":0.25}
- Shrugs (linki) — requires: [["cable.low"]]; cables: 1
- Band Hip Adductions — name: Band Hip Adduction
- Cable Hip Adduction — muscleLoad: {"adductors":1,"glutes":0.25}
- Calf Raises with Bands — name: Band Calf Raise
- Donkey Calf Raises — name: Donkey Calf Raise
- Smith Machine Reverse Calf Raises — name: Smith Machine Reverse Calf Raise; muscles: []; muscleLoad: {}

### Scalenia (SCALIĆ → zostaje)
- Rear Delt Raise (hantle) → **Reverse Fly (hantle)**
- Back Flyes - With Bands → **Band Pull Apart**
- Seated Bent-Over Rear Delt Raise → **Reverse Fly (hantle)**
- Seated Side Lateral Raise → **Lateral Raise (hantle)**
- Side Laterals to Front Raise → **Alternating Deltoid Raise**
- Weighted Sissy Squat → **Sissy Squat**
- Rope Straight-Arm Pulldown → **Straight Arm Pulldown**
- Rocking Standing Calf Raise → **Calf Raise (sztanga)**

### Do usunięcia (USUNĄĆ; w danych użytkownika — archiwizacja)
- Prone Manual Hamstring — fedb: opór daje partner ręką. Oporu nie da się zmierzyć ani powtórzyć (logger nie śledzi progresu), partner niewyrażalny w sprzęcie — ocena produktowa.
- Cable Incline Pushdown — Źródła sprzeczne: ExRx CBInclinePushdown to prostowanie łokci (target triceps), fedb pod tą nazwą opisuje ruch prostymi rękami na najszerszy z niejasnym „keeping the upper arms stationary”. Nieidentyfikowalne; ruch na najszerszy jest w Straight Arm Pulldown.
- Standing Leg Lift — fedb „Leg Lift”: noga w tył „as if performing a leg curl” — niejasne, czy wyprost biodra czy uginanie; bez obciążenia (obciążnik na kostkę poza słownikiem). Wyprost biodra pokrywają Hip Extension with Bands i Cable Kickback.
- Calf Raise On A Dumbbell — fedb: stanie na toczącym się gryfie hantla (celowo niestabilne). Ryzyko upadku/skręcenia bez korzyści nad wspięciem na stopniu (Łydki na stopniu) — ocena produktowa/bezpieczeństwa.

### Zmiany nazw (15)
- Upright Row → Upright Row (hantle)
- Bent Over Low-Pulley Side Lateral → One-Arm Cable Rear Lateral Raise
- Lateral Raise - With Bands → Band Lateral Raise
- Lying Face Down Plate Neck Resistance → Lying Neck Extension (talerz)
- Lying Face Up Plate Neck Resistance → Lying Neck Flexion (talerz)
- One-Arm Side Laterals → One-Arm Lateral Raise (hantel)
- Seated Head Harness Neck Resistance → Neck Harness Extension
- Single Dumbbell Raise → Single Dumbbell Front Raise
- Standing Dumbbell Straight-Arm Front Delt Raise Above Head → Dumbbell Front Raise to Overhead
- Standing Front Barbell Raise Over Head → Barbell Front Raise to Overhead
- Upright Row With Bands → Band Upright Row
- Band Hip Adductions → Band Hip Adduction
- Calf Raises with Bands → Band Calf Raise
- Donkey Calf Raises → Donkey Calf Raise
- Smith Machine Reverse Calf Raises → Smith Machine Reverse Calf Raise

### Niszowe (ukryć w domyślnych listach)
Alternating Deltoid Raise · Barbell Incline Shoulder Raise · Bent Over Low-Pulley Side Lateral · Cable Internal Rotation · Cable Seated Lateral Raise · Car Drivers · Crucifix · Cuban Press · Dumbbell Incline Shoulder Raise · Dumbbell Lying One-Arm Rear Lateral Raise · Dumbbell One-Arm Upright Row · Dumbbell Scaption · Front Incline Dumbbell Raise · Internal Rotation with Band · Isometric Neck Exercise - Front And Back · Isometric Neck Exercise - Sides · Kettlebell Halo · Kettlebell Halo with Overhead Extension · Lying Face Down Plate Neck Resistance · Lying Face Up Plate Neck Resistance · One-Arm Incline Lateral Raise · One-Arm Side Laterals · Reverse Flyes With External Rotation · Seated Head Harness Neck Resistance · Single Dumbbell Raise · Sled Reverse Flye · Smith Incline Shoulder Raise · Smith Machine One-Arm Upright Row · Smith Machine Upright Row · Standing Dumbbell Straight-Arm Front Delt Raise Above Head · Standing Front Barbell Raise Over Head · Straight Raises on Incline Bench · Upright Row With Bands · Hip Flexion with Band · Seated Band Hamstring Curl · Single-Leg Leg Extension · Standing Cable Leg Curl · Standing Leg Curl · Barbell Shrug Behind The Back · Bent-Arm Barbell Pullover · Calf-Machine Shoulder Shrug · Leverage Shrug · Middle Back Shrug · Shrugs (linki) · Smith Machine Behind the Back Shrug · Band Hip Adductions · Monster Walk · Prone Flutter Kicks · Barbell Seated Calf Raise · Calf Raise (linki) · Calf Raises with Bands · Donkey Calf Raises · Dumbbell Seated One-Leg Calf Raise · Smith Machine Reverse Calf Raises
<!-- PODSUMOWANIE:END -->

## Pytania otwarte (do właściciela; decyzje produktowe z opcjami)

- **Q1. Stożek rotatorów** (6 ćwiczeń: rotacje zewnętrzne ×3, wewnętrzne ×2; pośrednio Cuban Press). Dziś „barki” główne (rear/front_delt 1), choć
  ExRx i Reinold 2004 (S24) wskazują podgrzebieniowy/podłopatkowy jako główne, a naramienny tylko jako synergistę.
  A) bez partii głównej, „barki” pomocnicze, delt 0,5 (*rekomendacja* — nie zawyża serii barków); B) nowy region „stożek rotatorów” na mapie
  (więcej pracy w kodzie i teście); C) bez zmian (prościej, ale 3 serie rotacji liczą się jak 3 serie wznosów).
- **Q2. Zębaty przedni** (Incline Shoulder Raise ×3). A) bez partii głównej, klatka pomocnicza (*rekomendacja*); B) region „zębaty”;
  C) bez zmian. Te same kompromisy co Q1.
- **Q3. Fire Hydrant** — brak przeczytanego źródła; przypisanie z anatomii odwodzenia. A) zostawić z oznaczeniem „uproszczenie” (*rekomendacja*);
  B) oznaczyć jako niszowe do czasu znalezienia źródła.
- **Q4. Ćwiczenia nadgarstka w różnych grupach** (Wrist Curl (hantle) i Reverse Wrist Curl (hantle) w „inne”, ok. 9 wpisów nadgarstka z fedb
  w „biceps”). A) wszystkie w „inne” z partią „przedramiona” (*rekomendacja* — biceps nie pracuje); B) wszystkie w „biceps” (łatwiej znaleźć
  obok uginań). Duplikaty z innej części: „Seated One-Arm Dumbbell Palms-Up/Palms-Down Wrist Curl” → scalić z tymi dwoma.
- **Q5. Piszczelowy przedni** (Smith Machine Reverse Calf Raise; dodatek w Rocking Standing Calf Raise). A) bez partii i obciążenia
  (*rekomendacja*, wymaga wyjątku w teście catalog-v2, jeśli ten żąda niepustego `muscleLoad`); B) nowy region „goleń — przód”; C) usunąć ćwiczenie.
- **Q6. Scalanie wariantów pozycji** (siedząc/stojąc: Seated Side Lateral Raise, Seated Bent-Over Rear Delt Raise) i końcówek (lina: Rope
  Straight-Arm Pulldown). A) scalić — biblioteka węższa, historia przenoszona migracją (*rekomendacja*, zgodnie z prośbą „za szeroka”);
  B) zostawić jako NISZOWE — zachowuje rozróżnienie w rekordach (ciężary siedząc i stojąc mogą się różnić). Uwaga: jednorącz/oburącz zostają
  osobno (decyzja właściciela 04.10).
- **Q7. Zmiany nazw** (lista w podsumowaniu, np. „Upright Row” → „Upright Row (hantle)”, nazwy z fedb z myślnikami → ustalone). Zmiana nazwy ćwiczenia
  zapisanego w danych wymaga migracji (wzór `LIB_MUSCLE_FIXES`) — do decyzji, czy robić to w tym samym wydaniu.
- **Q8. Rejestr decyzji (Google Drive)** — po akceptacji wpisać werdykty SCALIĆ/USUNĄĆ i zmiany partii z odrzuconymi alternatywami.
