# 25 / L4. Biblioteka ćwiczeń — zawiasy, przysiady, wykroki (168 ćwiczeń) — źródła i podsumowanie (08.10.2026)

Zlecenie właściciela (08.10.2026): „mamy trochę za szeroką bibliotekę ćwiczeń, a przynajmniej nie jestem przekonany, czy są poprawnie
pomapowane — zrób głęboki research i potwierdź każde z nich”. Ta część (L4) obejmuje 168 ćwiczeń o wzorcu `hinge`, `squat`
i `lunge_single_leg`. **Dokument niczego nie zmienia w `lib/` ani w katalogu** — dane do wdrożenia: `L4.json` (rekord na ćwiczenie:
werdykt, zakres, scalenie, poprawki pól, źródła, pewność, uzasadnienie). Podsumowanie w sekcji 4 jest generowane z JSON-a.

## 1. Metoda

- Lista ćwiczeń i ich obecne pola — z katalogu (`docs/research/equipment/catalog.json`, `lib/catalog.generated.ts`, `lib/seed.ts`);
  opis wykonania ćwiczeń z pełnej bazy — z pola `fedb` (free-exercise-db, L4-S29 — tylko do identyfikacji, nie jako podstawa partii).
- **26 ćwiczeń bazowych** (`LIB_BASE`): partie wg `docs/research/24-przypisanie-partii.md` (źródła S1–S38 z tamtego dokumentu, w JSON
  cytowane jako „S1”…„S38”). Tu tylko przeniesione propozycje docs/24 i wynikające z nich wagi `muscleLoad` (test catalog-v2: partia
  główna ↔ region z wagą 1), plus kontrola sprzętu.
- **Reguła spójności:** warianty ćwiczenia bazowego dostają jego mapowanie, chyba że źródło mówi inaczej (martwe ciągi z gumami/łańcuchami,
  z deficytu, grubym gryfem → jak Deadlift (sztanga) wg docs/24; uchwyty po bokach (wyciągi, maszyna dźwigniowa) → jak Trap Bar;
  przysiady → bez dwugłowych w pomocniczych; mostki / hip thrusty → bez dwugłowych (docs/24 Q3); przywodziciele nie są partią pomocniczą
  przysiadów i wykroków — decyzja 04.10 i docs/24 Q1).
- **Zakres** (decyzja produktowa, nie merytoryczna): ZOSTAJE — popularne, ogólnie programowane; NISZOWE — rzadkie warianty, sprzęt
  strongman/olimpijski, techniki oporu zmiennego (ukryć z domyślnych list, zostaje w wyszukiwaniu); SCALIĆ — ten sam ruch, różnica tylko
  w technice/ustawieniu/wysokości startu; USUNĄĆ — brak w uznanych źródłach i nieuznana nazwa/wariant. Ćwiczeń z historii użytkownika
  się nie usuwa (aplikacja archiwizuje).
- **Ważne rozróżnienie przy scalaniu:** warianty, w których zapisany ciężar znaczy co innego (gumy/łańcuchy — ciężar to sam gryf;
  rack pull — 1RM z częściowego zakresu o ok. 18% wyższy, L4-S26), **zostają osobno** (NISZOWE), bo scalenie zafałszowałoby rekordy i e1RM.
- Oznaczenia: **PT** — przeczytany pełny tekst (lub wskazane strony), **A** — przeczytane streszczenie (PubMed / E-utilities NCBI).
  Pewność: jak w docs/24 (mocne / umiarkowane / jedno źródło / brak źródła — uproszczenie; „(analogia)” — wariant niebadany osobno).
- Nie udało się otworzyć ExRx.net (HTTP 403) — nie jest cytowany. Nie cytowano niczego, czego nie przeczytano.

## 2. Źródła (nowe w L4)

Szczebel wg CLAUDE.md. Ponadto używane: S1–S38 z docs/research/24 (tam pełne opisy); z S16 (PT) dodatkowo przeczytano: warianty w przeglądzie
obejmują „deadlift with chains”, „deadlift with elastic bands”, „stiff-leg deadlift”, „Romanian deadlift”, „hexagonal bar”, „good morning”;
cytat z dyskusji: „Good Morning provokes a similar muscular pattern activation as Romanian Deadlift”.

- **L4-S1** Hindle BR, Lorimer A, Winwood P, Keogh JWL. The Biomechanics and Applications of Strongman Exercises: a Systematic Review.
  Sports Med Open 2019;5:49. https://pmc.ncbi.nlm.nih.gov/articles/PMC6901656/ — **PT**, szczebel 2. „the atlas stone lift, farmer's walk,
  heavy sled/vehicle pull, log lift, keg walk”; kamień: „a lifting technique similar to a Romanian deadlift”, „may be the most similar to that
  of the beginning of the concentric phase of the box squat”; opona: „biomechanically similar to aspects of the initial lifting phase of the
  conventional and sumo deadlift”; „the atlas stone may be seen as one of the most mechanically demanding and potentially injurious strongman exercises”.
- **L4-S2** Comfort P, Haff GG, Suchomel TJ i in. National Strength and Conditioning Association Position Statement on Weightlifting for Sports
  Performance. J Strength Cond Res 2023;37(6):1163–1190. https://pubmed.ncbi.nlm.nih.gov/36952649/ — **A**, szczebel 2 (stanowisko NSCA).
  „biomechanical similarities (e.g., rapid forceful extension of the hips, knees, and ankles) associated with the second pull phase of the clean
  and snatch, the drive/thrust phase of the jerk”; „strength and conditioning coaches emphasize appropriate technique and skill development”.
- **L4-S3** Suchomel TJ, Comfort P, Stone MH. Weightlifting pulling derivatives: rationale for implementation and application. Sports Med
  2015;45(6):823–39. https://pubmed.ncbi.nlm.nih.gov/25689955/ — **A**, szczebel 3 (przegląd narracyjny). „The clean pull, snatch pull, hang
  high pull, jump shrug, and mid-thigh pull are weightlifting pulling derivatives”; „emphasize the completion of the triple extension movement
  during the second pull phase … hip, knee, and ankle extension”.
- **L4-S4** Kipp K, Harris C, Sabick MB. Lower extremity biomechanics during weightlifting exercise vary across joint and load. J Strength Cond
  Res 2011;25(5):1229–34. https://pubmed.ncbi.nlm.nih.gov/21240030/ — **A**, szczebel 3. „the hip and knee extended significantly faster than the
  ankle independent of load, whereas the hip and ankle generally produced significantly higher torques than the knee did”.
- **L4-S5** Andersen V i in. Comparing the effects of variable and traditional resistance training on maximal strength and muscle power in healthy
  adults: A systematic review and meta-analysis. J Sci Med Sport 2022;25(12):1023–1032. https://pubmed.ncbi.nlm.nih.gov/36130847/ — **A**,
  szczebel 2. „variable resistance training and traditional resistance training are equally effective in improving maximal muscle strength and
  muscle power”. (Metaanaliza Soria-Gila 2015 — **wycofana**, nie użyta.)
- **L4-S6** Clark DR, Lambert MI, Hunter AM. Muscle activation in the loaded free barbell squat: a brief review. J Strength Cond Res
  2012;26(4):1169–78. https://pubmed.ncbi.nlm.nih.gov/22373894/ — **A**, szczebel 2 (przegląd, 18 badań). „common variations such as stance width,
  hip rotation, and front squat do not significantly affect muscle activation”.
- **L4-S7** Paoli A, Marcolin G, Petrone N. The effect of stance width on the electromyographical activity of eight superficial thigh muscles during
  back squat with different bar loads. J Strength Cond Res 2009;23(1):246–50. https://pubmed.ncbi.nlm.nih.gov/19130646/ — **A**, szczebel 3 (EMG).
  „a significant difference in EMG activity only for the gluteus maximus … higher … at the maximum stance widths”.
- **L4-S8** McCaw ST, Melrose DR. Stance width and bar load effects on leg muscle activity during the parallel squat. Med Sci Sports Exerc
  1999;31(3):428–36. https://pubmed.ncbi.nlm.nih.gov/10188748/ — **A**, szczebel 3 (EMG). „stance width does not cause isolation within the
  quadriceps but does influence muscle activity on the medial thigh and buttocks”.
- **L4-S9** Escamilla RF i in. Effects of technique variations on knee biomechanics during the squat and leg press. Med Sci Sports Exerc
  2001;33(9):1552–66. https://pubmed.ncbi.nlm.nih.gov/11528346/ — **A**, szczebel 3. „No differences were found in muscle activity or knee forces
  between foot angle variations”; „the WS-LPH generated greater hamstrings activity than the NS-LPH”.
- **L4-S10** Schwanbeck S, Chilibeck PD, Binsted G. A comparison of free weight squat to Smith machine squat using electromyography. J Strength Cond
  Res 2009;23(9):2588–91. https://pubmed.ncbi.nlm.nih.gov/19855308/ — **A**, szczebel 3. „EMG activity was significantly higher by 34, 26, and 49
  in the gastrocnemius, biceps femoris, and vastus medialis … during the free weight squat”.
- **L4-S11** Gullett JC i in. A biomechanical comparison of back and front squats in healthy trained individuals. J Strength Cond Res
  2009;23(1):284–92. https://pubmed.ncbi.nlm.nih.gov/19002072/ — **A**, szczebel 3. „The front squat was as effective as the back squat in terms of
  overall muscle recruitment”.
- **L4-S12** Yavuz HU i in. Kinematic and EMG activities during front and back squat variations in maximum loads. J Sports Sci
  2015;33(10):1058–66. https://pubmed.ncbi.nlm.nih.gov/25630691/ — **A**, szczebel 3. „vastus medialis was found to be greater in the front squat”.
- **L4-S13** Aspe RR, Swinton PA. Electromyographic and kinetic comparison of the back squat and overhead squat. J Strength Cond Res
  2014;28(10):2827–36. https://pubmed.ncbi.nlm.nih.gov/24662228/ — **A**, szczebel 3. „the back squat displayed significantly greater … activity
  in the posterior aspect of the trunk ES and all lower-body muscles”; „do not support the hypothesis that the overhead squat provides a
  substantially greater stimulus for developing the trunk musculature”.
- **L4-S14** Evans TW i in. Comparison of Muscle Activation Between Back Squats and Belt Squats. J Strength Cond Res 2019;33 Suppl 1:S52–S59.
  https://pubmed.ncbi.nlm.nih.gov/28595237/ — **A**, szczebel 3. „belt squats may significantly differ in GM activation from back squats”.
- **L4-S15** Joseph L i in. Activity of Trunk and Lower Extremity Musculature: Comparison Between Parallel Back Squats and Belt Squats. J Hum Kinet
  2020;72:223–228. https://pubmed.ncbi.nlm.nih.gov/32269663/ — **A**, szczebel 3. „belt squatting provides similar muscular demands for the
  quadriceps, hamstrings, and plantar flexors, but is less demanding of trunk stabilizers, and gluteual muscles”.
- **L4-S16** Distefano LJ i in. Gluteal muscle activation during common therapeutic exercises. J Orthop Sports Phys Ther 2009;39(7):532–40.
  https://pubmed.ncbi.nlm.nih.gov/19574661/ — **A**, szczebel 3. „single-limb squat and single-limb deadlift activated the gluteus medius
  (single-limb squat, 64% … single-limb deadlift, 59% …) and maximus (… 59% … 59% …) similarly”.
- **L4-S17** Boren K i in. Electromyographic analysis of gluteus medius and gluteus maximus during rehabilitation exercises. Int J Sports Phys Ther
  2011;6(3):206–23. https://pubmed.ncbi.nlm.nih.gov/22034614/ — **A**, szczebel 3. Pośladek wielki > 70% MVIC m.in. „single limb squat (71%MVIC)”.
- **L4-S18** Simenz CJ i in. Electromyographical analysis of lower extremity muscle activation during variations of the loaded step-up exercise.
  J Strength Cond Res 2012;26(12):3398–405. https://pubmed.ncbi.nlm.nih.gov/22237139/ — **A**, szczebel 3. „the step-up elicited … greatest
  activation for the GMx, BF, and ST in both concentric and eccentric phases”.
- **L4-S19** McCurdy K, Walker J, Yuen D. Gluteus Maximus and Hamstring Activation During Selected Weight-Bearing Resistance Exercises. J Strength
  Cond Res 2018;32(3):594–601. https://pubmed.ncbi.nlm.nih.gov/29076958/ — **A**, szczebel 3. „the MSLS seems to produce greater GM and HG activation”.
- **L4-S20** Mausehund L, Skard AE, Krosshaug T. Muscle Activation in Unilateral Barbell Exercises. J Strength Cond Res 2019;33 Suppl 1:S85–S94.
  https://pubmed.ncbi.nlm.nih.gov/29870422/ — **A**, szczebel 3. „similar training stimuli of the gluteus maximus and quadriceps femoris can be
  expected for all exercises”; „The RFESS elicited higher … biceps femoris activity (76.1% MVIC) than the SS (62.3% MVIC)”.
- **L4-S21** Vigotsky AD i in. Effects of load on good morning kinematics and EMG activity. PeerJ 2015;3:e708.
  https://pubmed.ncbi.nlm.nih.gov/25653899/ — **A**, szczebel 3. „utilize the good morning (GM) to strengthen the hamstrings and spinal erectors”;
  „IEMG activity of hamstrings and spinal erectors tended to increase with load”.
- **L4-S22** Dicus JR i in. A Comparison of Muscle Recruitment Across Three Straight-Legged, Hinge-Pattern Resistance Training Exercises. Int J Exerc Sci
  2023;16(4):12–22. https://pubmed.ncbi.nlm.nih.gov/37113509/ — **A**, szczebel 3. „Shifting from a gravity-(RDL) to a redirected-resistance (CP) SLH
  significantly decreased activation in the longissimus (-11.0%), multifidus (-14.1%), biceps femoris (-13.1%), and semitendinosus (-6.8%)”;
  „changing from a closed-(RDL) to an open-chain (RH) SLH significantly increased activation in the gluteus maximus (+19.5%), biceps femoris (+27.9%)”.
- **L4-S23** Cuthbert M i in. Electromyographical Differences Between the Hyperextension and Reverse-Hyperextension. J Strength Cond Res
  2021;35(6):1477–1483. https://pubmed.ncbi.nlm.nih.gov/34027916/ — **A**, szczebel 3. „the RHE exhibited significantly greater … peak EMG compared
  with the HE in all muscles tested”.
- **L4-S24** Lawrence MA, Chin A, Swanson BT. Biomechanical Comparison of the Reverse Hyperextension Machine and the Hyperextension Exercise.
  J Strength Cond Res 2019;33(8):2053–2056. https://pubmed.ncbi.nlm.nih.gov/30946266/ — **A**, szczebel 3. „significantly greater integrated activity
  of the biceps femoris and gluteus maximus during the HE exercise”; RHE „equivalent erector spinae activity”. (Sprzeczne z L4-S23 co do kierunku —
  część wspólna: w obu ćwiczeniach pracują pośladki, dwugłowe i prostowniki.)
- **L4-S25** Lyons BC i in. Electromyographical Comparison of Muscle Activation Patterns Across Three Commonly Performed Kettlebell Exercises.
  J Strength Cond Res 2017;31(9):2363–2370. https://pubmed.ncbi.nlm.nih.gov/28394829/ — **A**, szczebel 3. Różnice tylko „ES (Swing > Snatch),
  EO (Snatch, Clean > Swing), and VL (Swing > Clean)”; „the Swing, Snatch, and Clean are not redundant exercises”.
- **L4-S26** Gillingham B i in. The Relationship Between Partial and Full Range of Motion Deadlift 1-Repetition Maximum. J Strength Cond Res
  2023;37(4):909–914. https://pubmed.ncbi.nlm.nih.gov/36730557/ — **A**, szczebel 3. „The PROM 1RM DL scores (226.0 ± 40.6 kg) were significantly
  greater than the FROM 1RM DL scores (191.7 ± 37.2 kg)”.
- **L4-S27** Catalyst Athletics (G. Everett), Exercise Library — https://www.catalystathletics.com/exercises/ (sekcje Snatch, Clean, Jerk, General)
  oraz strony: Snatch Shrug (/exercise/92/), Hang Clean (/exercise/68/), Heaving Snatch Balance (/exercise/82/), Stiff-Legged Deadlift (/exercise/86/),
  Romanian Deadlift (/exercise/101/). **PT**, szczebel 4. Nazwy: „Block Clean”, „Block Power Clean”, „Block Snatch”, „Block Power Snatch”, „Clean Pull”,
  „Clean Deadlift”, „Clean Shrug”, „Split Clean”, „Hang Snatch”, „Muscle Snatch”, „Snatch Balance”, „Jerk Dip Squat”, „Seated Good Morning”;
  brak: Split Snatch, Frankenstein Squat, ćwiczeń w suwnicy Smitha. Snatch Shrug: „performed primarily with movement at the knees, with the trunk
  remaining essentially vertical”, „useful for training the final aggressive extension of the legs”. Hang Clean — pozycje m.in. „Below the knee: … bar
  2-3 inches below the bottom of the knee cap”. Heaving Snatch Balance: „a variation of the snatch balance in which the feet remain planted”. SLDL:
  „usually synonymous with the Romanian deadlift”, „the differences are extremely minor”; RDL: „strengthens isometric back extension along with the
  glutes and hamstrings”.
- **L4-S28** ACE Exercise Library (American Council on Exercise): Lateral Lunge https://www.acefitness.org/resources/everyone/exercise-library/364/lateral-lunge/
  („Target Body Part: Butt/Hips, Legs - Thighs”, „Equipment: Dumbbells”); Single-leg Romanian Deadlift
  https://www.acefitness.org/resources/everyone/exercise-library/329/single-leg-romanian-deadlift/ („Push the hips backwards and start to lift the left
  foot off the ground”); artykuł „8 Butt-toning Moves” (M. Martin) https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/
  (curtsy lunge — skrzyżowanie nogi za nogą; „frog-like” ustawienie pięt przy wyproście bioder). **PT**, szczebel 4.
- **L4-S29** free-exercise-db (yuhonas, Unlicense) — https://github.com/yuhonas/free-exercise-db (dist/exercises.json), pola `instructions`.
  **PT**, **lista kontrolna** (pochodzenie katalogu); używana tylko do ustalenia, jak ćwiczenie jest wykonywane — nie jako podstawa partii.
- **L4-S30** Collazo García CL i in. Differences in the Electromyographic Activity of Lower-Body Muscles in Hip Thrust Variations. J Strength Cond Res
  2020;34(9):2449–2455. https://pubmed.ncbi.nlm.nih.gov/30335717/ — **A**, szczebel 3. „hip thrust variations have different motor patterns” (zmiana
  ustawienia stóp zmienia EMG wszystkich mięśni poza pośladkiem średnim) — warianty techniki, nie osobne ćwiczenia.

Przejrzane, nieużyte: Soria-Gila 2015 (wycofana), Ross 2017 (kinetyka rwania kettla — bez partii), Ekstrom 2007 (mostki — EMG < 45% MVIC, bez
podziału na dwugłowe), Kim 2026 (mfMRI pośladków średnich przy mostku jednonóż — partii nie zmienia), Contreras 2016 (warianty hip thrustu — tylko tytuł).

## 3. Najważniejsze ustalenia

1. **Martwe ciągi (warianty)** — 8 wariantów miało stare mapowanie „plecy + dwugłowe” → jak Deadlift (sztanga) wg docs/24 (dwugłowe + pośladki /
   plecy + czworogłowe, glutes 1); uchwyty po bokach (Cable, Leverage Deadlift) → jak Trap Bar.
2. **Przysiady z gumami/łańcuchami** — usunąć dwugłowe z pomocniczych (S1, S2, jak Back Squat). Zostają osobno (ciężar = gryf; L4-S5).
3. **Rozstaw, „do ławki”, wysokość startu** to technika, nie ćwiczenie (L4-S6, L4-S8, L4-S27) → scalenia: Narrow/Wide Stance Squats → Back Squat,
   Narrow Stance Hack Squat / Leg Press, Squat to a Bench, Hang Clean Below the Knees, Heaving Snatch Balance, RDL z deficytu, SLDL hantlami.
4. **Kettle balistyczne** (rwanie kettla/hantla) — barki z głównych do pomocniczych (napęd z bioder; L4-S25, S24), spójnie z Kettlebell Swing.
5. **Reverse Hyperextension** — dwugłowe do głównych (EMG trzech zespołów, L4-S22–S24), spójnie z Back Extension (docs/24).
6. **Mostki i hip thrusty** — bez dwugłowych w pomocniczych (spójnie z docs/24 Q3, jedno źródło S2).
7. **Przywodziciele** w pomocniczych 7 przysiadów/wykroków przeczyli decyzji 04.10 i docs/24 Q1 → usunięte (do ponownego rozważenia przy Q1).
8. **Grupy**: Bottoms-Up Clean nie należy do „biceps” (→ inne); Sumo Deadlift (kettlebell) → plecy (jak Sumo Deadlift); Power Stairs → plecy.
9. **Nazwy ustalone**: Block Clean / Block Power Clean / Block Snatch / Block Power Snatch (L4-S27), Bulgarian Split Squat (sztanga) i Smith Machine
   Bulgarian Split Squat (S6, L4-S20), Double Kettlebell Clean (konwencja katalogu).

## 4. Podsumowanie (generowane z L4.json)

<!-- GEN:START -->
Wygenerowane skryptem z `L4.json` (168 ćwiczeń). Nie edytować ręcznie.

| Werdykt | Liczba |
|---|---|
| OK | 83 |
| POPRAWIĆ | 58 |
| SCALIĆ | 25 |
| USUNĄĆ | 2 |

| Zakres | Liczba |
|---|---|
| ZOSTAJE | 62 |
| NISZOWE | 79 |
| SCALIĆ | 25 |
| USUNĄĆ | 2 |

| Pewność | Liczba |
|---|---|
| umiarkowane | 70 |
| brak źródła — uproszczenie | 56 |
| jedno źródło | 38 |
| mocne | 4 |

| Poprawiane pole | Liczba ćwiczeń |
|---|---|
| `secondaryMuscles` | 48 |
| `muscleLoad` | 24 |
| `muscles` | 21 |
| `name` | 8 |
| `group` | 3 |
| `requires` | 2 |

**Scalenia** (ćwiczenie → zostaje):

- Double Kettlebell Alternating Hang Clean → Double Kettlebell Clean
- Hang Clean Below the Knees → Hang Clean
- One-Arm Kettlebell Split Snatch → Kettlebell Snatch
- One-Arm Open Palm Kettlebell Clean → Kettlebell Clean
- Open Palm Kettlebell Clean → Kettlebell Clean
- Atlas Stone Trainer → Atlas Stones
- Band Good Morning (Pull Through) → Band Good Morning
- Car Deadlift → Rickshaw Deadlift
- Hyperextensions With No Hyperextension Bench → Back Extension
- Kettlebell One-Legged Deadlift → Single Leg RDL (hantel)
- Romanian Deadlift from Deficit → RDL (sztanga)
- Stiff-Legged Dumbbell Deadlift → RDL (hantle/linki)
- Wide Stance Stiff-Legged Deadlift → Stiff-Legged Barbell Deadlift
- Hip Lift with Band → Glute Bridge
- Vertical Swing → Kettlebell Swing
- Heaving Snatch Balance → Snatch Balance
- Dumbbell Squat to a Bench → Dumbbell Squat
- Frankenstein Squat → Front Squat
- Front Barbell Squat to a Bench → Front Squat
- Narrow Stance Hack Squat → Hack Squat
- Narrow Stance Leg Press → Leg Press
- Narrow Stance Squats → Back Squat
- Wide Stance Barbell Squat → Back Squat
- Kettlebell Pistol Squat → Pistol Squat
- Step-up with Knee Raise → Step Up

**Usunięcia:**

- Smith Machine Hang Power Clean — Nie jest uznaną pochodną: przeglądy i stanowisko NSCA (L4-S2, L4-S3) oraz 90 ćwiczeń zarzutu w L4-S27 dotyczą wolnej sztangi; prowadnica Smitha wymusza pionowy tor gryfu. Decyzja produktowa: usunąć (w historii użytkownika zostaje jako archiwalne).
- Lunge Sprint — Nazwa nieuznana (obciążone wyskoki w wykroku w suwnicy Smitha); brak w przeczytanych źródłach; decyzja produktowa — usunąć (istnieje Split Jump).

**Zmiany nazw:**

- Clean from Blocks → Block Clean
- Power Clean from Blocks → Block Power Clean
- Power Snatch from Blocks → Block Power Snatch
- Snatch from Blocks → Block Snatch
- Two-Arm Kettlebell Clean → Double Kettlebell Clean
- Physioball Hip Bridge → Stability Ball Hip Bridge
- One Leg Barbell Squat → Bulgarian Split Squat (sztanga)
- Smith Machine Single-Leg Split Squat → Smith Machine Bulgarian Split Squat

**Poprawki partii / sprzętu / grupy** (pola z `fixes`, bez muscleLoad — pełne wartości w JSON):

- **Back Extension** — muscles: ["plecy", "dwugłowe"]; secondaryMuscles: ["pośladki"]; muscleLoad: lower_back 1, hamstrings 1, glutes 0.5
- **Deadlift (hantle)** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, forearms 0.5, quads 0.25, upper_back 0.25, lats 0.25
- **Deadlift (sztanga)** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, quads 0.5, upper_back 0.5, forearms 0.5, lats 0.25, adductors 0.25, abs 0.25
- **Glute Bridge** — secondaryMuscles: []
- **Hip Thrust (hantel)** — secondaryMuscles: []
- **Hip Thrust (sztanga)** — secondaryMuscles: []
- **Trap Bar Deadlift** — muscles: ["czworogłowe", "pośladki"]; secondaryMuscles: ["dwugłowe", "plecy"]; muscleLoad: quads 1, lower_back 1, glutes 1, hamstrings 0.5, upper_back 0.5, forearms 0.5
- **Bottoms-Up Clean From The Hang Position** — group: "inne"; muscles: ["pośladki", "dwugłowe"]; secondaryMuscles: ["przedramiona", "plecy"]; muscleLoad: glutes 1, hamstrings 1, forearms 0.5, upper_back 0.5, front_delt 0.25
- **Clean Pull** — muscles: ["pośladki", "dwugłowe"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: glutes 1, hamstrings 1, quads 0.5, upper_back 0.5, lower_back 0.5, forearms 0.5, calves 0.25
- **Double Kettlebell Snatch** — muscles: ["pośladki", "dwugłowe"]; secondaryMuscles: ["plecy", "barki"]; muscleLoad: glutes 1, hamstrings 1, front_delt 0.5, upper_back 0.5, lower_back 0.5
- **Dumbbell Clean** — muscles: ["pośladki", "czworogłowe"]; secondaryMuscles: ["dwugłowe", "plecy"]; muscleLoad: glutes 1, quads 1, hamstrings 0.5, upper_back 0.5, lower_back 0.25, forearms 0.25, calves 0.25
- **Kettlebell Snatch** — muscles: ["pośladki", "dwugłowe"]; secondaryMuscles: ["plecy", "barki"]; muscleLoad: glutes 1, hamstrings 1, front_delt 0.5, upper_back 0.5, lower_back 0.5
- **Power Snatch** — muscles: ["pośladki", "czworogłowe"]; secondaryMuscles: ["plecy", "barki"]; muscleLoad: glutes 1, quads 1, hamstrings 0.5, upper_back 0.5, front_delt 0.5, triceps 0.25, lower_back 0.25
- **Power Snatch from Blocks** — muscles: ["pośladki", "czworogłowe"]; secondaryMuscles: ["plecy", "barki"]; muscleLoad: glutes 1, quads 1, hamstrings 0.5, upper_back 0.5, front_delt 0.5, triceps 0.25
- **Snatch (hantel)** — muscles: ["pośladki", "dwugłowe"]; secondaryMuscles: ["plecy", "barki"]; muscleLoad: glutes 1, hamstrings 1, front_delt 0.5, upper_back 0.5, quads 0.25
- **Power Stairs** — group: "plecy"
- **Axle Deadlift** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, forearms 1, quads 0.5, upper_back 0.5, lats 0.25, adductors 0.25, abs 0.25
- **Cable Deadlift** — muscles: ["czworogłowe", "pośladki"]; secondaryMuscles: ["dwugłowe", "plecy"]; muscleLoad: quads 1, lower_back 1, glutes 1, hamstrings 0.5, forearms 0.5
- **Clean Deadlift** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: glutes 1, hamstrings 1, quads 0.5, lower_back 0.5, upper_back 0.5, forearms 0.25
- **Clean Shrug** — secondaryMuscles: ["czworogłowe"]; muscleLoad: upper_back 1, forearms 0.5, quads 0.5, glutes 0.25, hamstrings 0.25, calves 0.25, lower_back 0.25
- **Deadlift with Bands** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, quads 0.5, upper_back 0.5, forearms 0.5, lats 0.25, adductors 0.25, abs 0.25
- **Deadlift with Chains** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, quads 0.5, upper_back 0.5, forearms 0.5, lats 0.25, adductors 0.25, abs 0.25
- **Deficit Deadlift** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, quads 0.5, upper_back 0.5, forearms 0.5, lats 0.25, adductors 0.25, abs 0.25
- **Leverage Deadlift** — muscles: ["czworogłowe", "pośladki"]; secondaryMuscles: ["dwugłowe", "plecy"]; muscleLoad: quads 1, lower_back 1, glutes 1, hamstrings 0.5, forearms 0.5
- **Reverse Band Deadlift** — muscles: ["dwugłowe", "pośladki"]; secondaryMuscles: ["plecy", "czworogłowe"]; muscleLoad: lower_back 1, hamstrings 1, glutes 1, quads 0.5, upper_back 0.5, forearms 0.5, lats 0.25, adductors 0.25, abs 0.25
- **Single Leg RDL (hantel)** — requires: [["db", "kb"]]
- **Snatch Shrug** — secondaryMuscles: ["czworogłowe"]; muscleLoad: upper_back 1, forearms 0.5, quads 0.5, glutes 0.25, hamstrings 0.25, calves 0.25, lower_back 0.25
- **Glute Bridge (sztanga)** — secondaryMuscles: []
- **Kneeling Squat** — secondaryMuscles: []; muscleLoad: glutes 1, hamstrings 0.25, adductors 0.25, lower_back 0.25, abs 0.25
- **Physioball Hip Bridge** — secondaryMuscles: []
- **Reverse Hyperextension** — muscles: ["pośladki", "dwugłowe"]; secondaryMuscles: ["plecy"]; muscleLoad: glutes 1, hamstrings 1, lower_back 0.5
- **Single Leg Glute Bridge** — secondaryMuscles: []
- **Single Leg Hip Thrust** — secondaryMuscles: []
- **Smith Machine Hip Thrust** — secondaryMuscles: []
- **Sumo Deadlift (kettlebell)** — group: "plecy"
- **Back Squat** — secondaryMuscles: ["pośladki"]
- **Snatch Balance** — secondaryMuscles: ["pośladki", "barki"]
- **Barbell Hack Squat** — secondaryMuscles: ["pośladki"]
- **Box Squat with Bands** — secondaryMuscles: ["pośladki"]
- **Box Squat with Chains** — secondaryMuscles: ["pośladki"]
- **Reverse Band Box Squat** — secondaryMuscles: ["pośladki"]
- **Reverse Band Power Squat** — secondaryMuscles: ["pośladki"]
- **Squat with Bands** — secondaryMuscles: ["pośladki"]
- **Squat with Chains** — secondaryMuscles: ["pośladki"]
- **Cable Squat** — requires: [["cable.low"]]
- **Dip Belt Squat** — secondaryMuscles: ["pośladki"]
- **Dumbbell Squat** — secondaryMuscles: ["pośladki"]
- **Jefferson Squat** — secondaryMuscles: ["pośladki"]
- **Bulgarian Split Squat (hantle)** — secondaryMuscles: []
- **Barbell Side Split Squat** — secondaryMuscles: []
- **Barbell Walking Lunge** — secondaryMuscles: []
- **Elevated Back Lunge** — secondaryMuscles: []
<!-- GEN:END -->

## 5. Pytania otwarte

- **Q-L4-1. Gumy/łańcuchy/reverse band (13 ćwiczeń)** — opcje: A) zostawić osobno jako NISZOWE (rek.: zapisany ciężar = gryf; reverse band
  zawyżyłby rekord bazowego boju); B) scalić z bojem bazowym + adnotacja „gumy/łańcuchy” przy serii (wymaga nowego pola w serii — praca w kodzie).
- **Q-L4-2. SLDL (sztanga) vs RDL (sztanga)** — L4-S27: różnice „extremely minor”. Opcje: A) NISZOWE osobno (rek.: poza podnoszeniem ciężarów SLDL
  startuje z podłogi, badanie wzrostu S20 użyło SLDL); B) scalić z RDL (mniej pozycji).
- **Q-L4-3. Dwugłowe w przysiadzie bułgarskim** — EMG sprzeczne: S26 (wykrok 20–30% MVIC) vs L4-S20 (RFESS 76% MVIC). Partia pomocnicza wg docs/24
  usunięta; `muscleLoad` hamstrings w rodzinie wykroków nie ruszany (0,25–0,5 niespójnie) — do rozstrzygnięcia razem z docs/24 Q4.
- **Q-L4-4. Tryb obciążenia ćwiczeń jednonóż** — Single Leg Press / Single Leg RDL mają `unilateral` (×2 — obie strony), a wykroki i przysiady
  jednonóż ze sztangą/Smithem `total`, przysiady bułgarskie z hantlami `per_dumbbell` (×2 = para, nie nogi). Konwencja liczenia powtórzeń „na nogę”
  dotyczy całego katalogu — decyzja produktowa poza L4 (opcje: A) ×2 dla każdego ćwiczenia jednonóż; B) zostawić — objętość = ciężar zewnętrzny × powt.).
- **Q-L4-5. Przywodziciele (docs/24 Q1)** — po decyzji B lub A trzeba wrócić do: Cossack Squat, Lateral Lunge, Barbell Side Split Squat, Sumo Squat,
  Wide Stance (scalony), Dumbbell Squat, Dip Belt Squat, Jefferson Squat.
- **Q-L4-6. Ćwiczenia olimpijskie i kettlebell** — partie to uproszczenie (potrójny wyprost: L4-S2, L4-S3, L4-S4; brak badań wzrostu). Pewność co najwyżej
  „umiarkowane”.
- **Q-L4-7. Strongman (9)** — wszystko NISZOWE poza scaleniami; sprzęt i tak poza presetem „Pełna siłownia”. Opcja: usunąć całą grupę strongman
  z biblioteki (decyzja produktowa).
- Docelowa liczba w L4 po wdrożeniu: zob. tabela zakresu (ZOSTAJE + NISZOWE). Rejestr decyzji (Google Drive „03 Rejestr decyzji”) — wpisać po akceptacji.
