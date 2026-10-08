# 25 / L6. Biblioteka ćwiczeń — część L6: core i wzorzec „other” (143 ćwiczenia) — źródła i podsumowanie (08.10.2026)

Zlecenie właściciela 08.10.2026 („za szeroka biblioteka … potwierdź każde z nich”). Dane: `L6.json` (jeden rekord na ćwiczenie). Ten dokument niczego nie zmienia w kodzie ani w katalogu — poprawki wdroży osobny wykonawca z testami. Sekcje 2–4 są generowane skryptem z `L6.json` (skrypt poza repo, w notatkach sesji).

## 1. Metoda

- Wejście: 143 rekordy z `catalog.json` (wzorce core_flexion 47, core_other 23, core_anti_ext 9, core_anti_rot 4, other 60); 15 z nich to ćwiczenia bazowe (LIB_BASE) — dla nich partie z docs/research/24 są punktem wyjścia.
- Identyfikacja ruchu: opis w free-exercise-db (L6-S17) i strona ACE Exercise Library (szczebel 4). Partie: EMG (S1–S3, S32), przegląd o plyometrii (S4), przegląd o Copenhagen (S6), anatomia (S8–S10). EMG = aktywacja, nie wzrost (S2 w docs 24).
- ExRx.net zwraca 403 dla pobierania — nie użyto (nie cytuję nieprzeczytanego). PubMed blokuje pobieranie — streszczenia przez Europe PMC.
- Zakres (ZOSTAJE / NISZOWE / SCALIĆ / USUNĄĆ) to **ocena produktowa**, nie merytoryczna — do decyzji właściciela.
- Pole `fixes` używa nazw pól catalog.json; `muscleLoad` podany w całości (nowa wartość).

## 2. Źródła

- **L6-S1** Escamilla RF i in. Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training. Phys Ther 2006;86(5):656–671. doi:10.1093/ptj/86.5.656 (PMID 16649890, streszczenie przez Europe PMC). Cytat/miejsce: „Upper and lower rectus abdominis, internal oblique, and latissimus dorsi muscle EMG activity were highest for the Power Wheel (pike, knee-up, and roll-out), hanging knee-up with straps, and reverse crunch inclined 30 degrees.” „Rectus femoris muscle EMG activity was highest for the Power Wheel (pike and knee-up), reverse crunch inclined 30 degrees, and bent-knee sit-up.” Szczebel 3 (EMG). A.
- **L6-S2** Escamilla RF i in. Core muscle activation during Swiss ball and traditional abdominal exercises. J Orthop Sports Phys Ther 2010;40(5):265–276. doi:10.2519/jospt.2010.3073 (PMID 20436242). Cytat/miejsce: „The roll-out and pike were the most effective exercises in activating upper and lower rectus abdominis, external and internal obliques, and latissimus dorsi muscles”; „Latissimus dorsi EMG signals were greatest in the pike, knee-up, skier…”. Szczebel 3 (EMG; ten sam zespół co S1 — liczony razem). A.
- **L6-S3** Escamilla RF i in. Muscle Activation Among Supine, Prone, and Side Position Exercises With and Without a Swiss Ball. Sports Health 2016;8(4):372–379. https://pmc.ncbi.nlm.nih.gov/articles/PMC4922527/ Cytat/miejsce: „Lumbar paraspinal activity was significantly greater in the 3 side position exercises compared with all remaining exercises”; „Side position exercises are better for oblique and lumbar paraspinal recruitment.” Tab.: side crunch on ball EO 50 (26)% MVIC. Szczebel 3 (EMG; zespół S1). PT (wyniki, tabela).
- **L6-S4** Grgic J, Schoenfeld BJ, Mikulic P. Effects of plyometric vs. resistance training on skeletal muscle hypertrophy: A review. J Sport Health Sci 2021;10(5):530–536. https://pmc.ncbi.nlm.nih.gov/articles/PMC8500805/ Cytat/miejsce: „plyometric and resistance training may produce similar effects on whole muscle hypertrophy for the muscle groups of the lower extremities”. Tab. 1: Earp 2015 jump squats → QF; Kubo 2007/2017 hopping i drop jump → MG, LG, SOL; Vissing 2008 CMJ/hurdle/drop jumps → „increase in quadriceps, hamstrings, and adductor CSA”. Ograniczenia: tylko kończyny dolne, ≤12 tyg., nietrenujący. Szczebel 2 (przegląd). PT (streszczenie, tab. 1, dyskusja).
- **L6-S5** Davies G, Riemann BL, Manske R. Current concepts of plyometric exercise. Int J Sports Phys Ther 2015;10(6):760–786. https://pmc.ncbi.nlm.nih.gov/articles/PMC4637913/ Cytat/miejsce: „In the LE, plyometric exercises are often performed through jumping, bounding, and hopping.” Tab. 6 (progresja): squat jumps, split squat jumps, jump and reach, lateral bounding, tuck jumps, box jumps, depth jumps, drop jump to second box, single leg hops, side to side push off jumps, single leg push off box. „A major consideration when training with plyometric exercise is the need to closely monitor technique.” UE: „few studies address plyometric training and the UE”. Szczebel 3 (przegląd narracyjny). PT (rozdziały LE/UE, tab. 6).
- **L6-S6** Schaber M i in. The Neuromuscular Effects of the Copenhagen Adductor Exercise: A Systematic Review. Int J Sports Phys Ther 2021;16(5):1210–1221. https://pmc.ncbi.nlm.nih.gov/articles/PMC8486394/ Cytat/miejsce: „The CAE significantly increased EHAD in four of the four studies … and increased the EMG activity of the adductors in the dominant leg 108%.” Definicja: „side plank position, with superior lower extremity held by a partner”. Szczebel 2 (przegląd systematyczny). PT.
- **L6-S7** ACE (American Council on Exercise). ACE-sponsored Study Reveals Best and Worst Abdominal Exercises (San Diego State University, P. Francis), 14.05.2001. https://www.acefitness.org/about-ace/press-room/in-the-news/246/american-council-on-exercise-ace-sponsored-study-reveals-best-and-worst-abdominal-exercises/ Cytat/miejsce: Ranking RA: „1. Bicycle maneuver 2. Captain's chair 3. Crunches on exercise ball 4. Vertical leg crunch … 6. Long arm crunch 7. Reverse crunch … 11. Traditional crunch”; skośne: „1. Captain's chair 2. Bicycle maneuver 3. Reverse crunch …”. Szczebel 4 (badanie EMG organizacji, raport prasowy, bez recenzji). PT (komunikat).
- **L6-S8** Betts JG i in. Anatomy and Physiology 2e, OpenStax, rozdz. 11.4, tab. 11.6. https://openstax.org/books/anatomy-and-physiology-2e/pages/11-4-axial-muscles-of-the-abdominal-wall-and-thorax (ta sama książka co S35) Cytat/miejsce: „Twisting at waist; also bending to the side … External obliques; internal obliques”; „Sitting up … Flexion … Rectus abdominis”; „Bending to the side … Lateral flexion … Quadratus lumborum”. Szczebel 3 (podręcznik). PT (podrozdział).
- **L6-S9** OpenStax Anatomy and Physiology 2e, rozdz. 11.3. https://openstax.org/books/anatomy-and-physiology-2e/pages/11-3-axial-muscles-of-the-head-neck-and-back Cytat/miejsce: „The erector spinae group forms the majority of the muscle mass of the back and it is the primary extensor of the vertebral column.” Szczebel 3. PT (fragment).
- **L6-S10** OpenStax Anatomy and Physiology 2e, rozdz. 11.5 (mięśnie przedramienia). https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs Cytat/miejsce: „The deep anterior compartment produces flexion and bends fingers to make a fist. These are the flexor pollicis longus and the flexor digitorum profundus.” Szczebel 3. PT (fragment).
- **L6-S11** St-Onge E, Robb A, Beach TAC, Howarth SJ. A descriptive analysis of shoulder muscle activities during individual stages of the Turkish Get-Up exercise. J Bodyw Mov Ther 2019;23(1):23–31. doi:10.1016/j.jbmt.2018.01.013 (PMID 30691756). Cytat/miejsce: „Overall, the greatest muscular demand occurred during the second (press to elbow support) and fifth (leg sweep) stages.” Szczebel 3 (EMG). A.
- **L6-S12** Sepehri Rahnama H i in. Comparative Effects of Core Versus Forearm Training on Pull-Up Repetition Performance in Physically Inactive Males. Sports 2025;13(12):433. doi:10.3390/sports13120433 Cytat/miejsce: „Pull-ups … requiring coordinated activation of the latissimus dorsi, biceps brachii, forearm flexors”; testy: „grip strength (both hands), and dead-hanging time”; trening przedramion: „55.3% increase in hanging time”. Szczebel 3. A.
- **L6-S13** Cahill MJ i in. Influence of resisted sled-push training on the sprint force-velocity profile of male high school athletes. Scand J Med Sci Sports 2020;30(3):442–449. doi:10.1111/sms.13600 Cytat/miejsce: „Sled pushing is a commonly used form of resisted sprint training”; „resisted sled pushing with any load was superior to unresisted sprint training”. Szczebel 3 (RCT). A.
- **L6-S14** West DJ i in. The metabolic, hormonal, biochemical, and neuromuscular function responses to a backward sled drag training session. J Strength Cond Res 2014;28(1):265–272. doi:10.1519/jsc.0b013e3182948110 Cytat/miejsce: „5 sets of 2 × 20-m … maximal backward sled drags (loaded with 75% body mass)”; „sled dragging provides an effective metabolic stimulus”. Szczebel 3. A.
- **L6-S15** Stephens J i in. Anti-rotational and rotational abdominal exercises and the concurrent muscle activation: a methodology study. Int J Exerc Sci: Conf Proc 2021;8(9):12. https://digitalcommons.wku.edu/ijesab/vol8/iss9/12 Cytat/miejsce: „Twelve trials of an AR and RO variation of the Pallof press … There were significant differences in muscle activation based on movement type for the participants' right internal and external oblique, left internal oblique and right erector spinae.” Pilotaż n=4 — słaby dowód. Szczebel 3 (abstrakt konferencyjny). A.
- **L6-S16** Fitness Volt. Side Jackknife. https://fitnessvolt.com/side-jackknife/ Cytat/miejsce: „Lie on your side with your body straight … Contract your obliques, brace your abs, and lift your shoulders off the floor. Simultaneously lift your top leg. Hinge at the waist like a folding jackknife.” Szczebel 4/5 (serwis komercyjny — tylko identyfikacja ruchu). PT.
- **L6-S17** free-exercise-db (yuhonas), dist/exercises.json — wpis o nazwie z pola `fedb`. https://github.com/yuhonas/free-exercise-db Cytat/miejsce: Opisy ruchu (pole instructions) — np. Iron Cross i Side Jackknife: pusta lista instrukcji; Linear Acceleration Wall Drill: „sprint technique”/„Lean at around 45 degrees against a wall”. Źródło listy kontrolnej katalogu — użyte tylko do identyfikacji ruchu, NIE jako niezależne źródło partii. Szczebel 4 (zbiór danych). PT (wpisy).
- **L6-S18** ACE Exercise Library: Crunch. https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/ Cytat/miejsce: Target Body Part: Abs; „curling your torso towards your thighs”. Szczebel 4. PT.
- **L6-S19** ACE: Reverse Ab Crunch. https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/ Cytat/miejsce: Abs; „slowly raise your hips off the mat, rolling your spine up”. Szczebel 4. PT.
- **L6-S20** ACE: Supermans. https://www.acefitness.org/resources/everyone/exercise-library/9/supermans/ Cytat/miejsce: Body Part: Back, Butt/Hips, Shoulders. Szczebel 4. PT.
- **L6-S21** ACE: Bird-dog. https://www.acefitness.org/resources/everyone/exercise-library/14/bird-dog/ Cytat/miejsce: Abs, Back, Butt/Hips. Szczebel 4. PT.
- **L6-S22** ACE: Front Plank. https://www.acefitness.org/resources/everyone/exercise-library/32/front-plank/ Cytat/miejsce: Abs, Back. Szczebel 4. PT.
- **L6-S23** ACE: Supine Dead Bug. https://www.acefitness.org/resources/everyone/exercise-library/147/supine-dead-bug/ Cytat/miejsce: Abs. Szczebel 4. PT.
- **L6-S24** ACE: Side Plank (Modified). https://www.acefitness.org/resources/everyone/exercise-library/99/side-plank-modified/ Cytat/miejsce: Abs, Butt/Hips. Szczebel 4. PT.
- **L6-S25** ACE: Stability Ball Knee Tucks. https://www.acefitness.org/resources/everyone/exercise-library/60/stability-ball-knee-tucks/ Cytat/miejsce: Abs; „slowly pull your knees towards your chest, rolling the ball forward”. Szczebel 4. PT.
- **L6-S26** ACE: Stability Ball Sit-ups / Crunches. https://www.acefitness.org/resources/everyone/exercise-library/68/stability-ball-sit-ups-crunches/ Cytat/miejsce: Abs. Szczebel 4. PT.
- **L6-S27** ACE: TRX Front Rollout. https://www.acefitness.org/resources/everyone/exercise-library/79/trx-reg-front-rollout/ Cytat/miejsce: Abs. Szczebel 4. PT.
- **L6-S28** ACE: TRX Suspended Knee Tucks. https://www.acefitness.org/resources/everyone/exercise-library/87/trx-reg-suspended-knee-tucks/ Cytat/miejsce: Abs, Chest. Szczebel 4. PT.
- **L6-S29** ACE: Roll Out. https://www.acefitness.org/resources/everyone/exercise-library/309/roll-out/ Cytat/miejsce: Abs; Equipment: Barbell; „kneel down facing the bar … allowing the barbell to roll away from the body”. Szczebel 4. PT.
- **L6-S30** ACE: V-ups. https://www.acefitness.org/resources/everyone/exercise-library/242/v-ups/ Cytat/miejsce: Abs. Szczebel 4. PT.
- **L6-S31** ACE: Vertical Toe Touches. https://www.acefitness.org/resources/everyone/exercise-library/243/vertical-toe-touches/ Cytat/miejsce: Abs. Szczebel 4. PT.
- **L6-S32** ACE: Seated Crunch (maszyna). https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/ Cytat/miejsce: Abs; Equipment: Weight Machines / Selectorized. Szczebel 4. PT.
- **L6-S33** ACE: Russian Twist (na piłce). https://www.acefitness.org/resources/everyone/exercise-library/65/russian-twist/ Cytat/miejsce: Abs, Butt/Hips, Legs - Thighs; Equipment: Stability Ball. Szczebel 4. PT.
- **L6-S34** ACE: V-twist. https://www.acefitness.org/resources/everyone/exercise-library/305/v-twist/ Cytat/miejsce: Abs; „lean back at about a 45 degree angle … rotate the shoulders from side to side”. Szczebel 4. PT.
- **L6-S35** ACE: Kneeling Wood Chop https://www.acefitness.org/resources/everyone/exercise-library/340/kneeling-wood-chop/ ; Standing Rotational Chop https://www.acefitness.org/resources/everyone/exercise-library/349/standing-rotational-chop/ Cytat/miejsce: Full Body/Integrated; Resistance Bands/Cables. Szczebel 4. PT.
- **L6-S36** ACE: Turkish Get-up. https://www.acefitness.org/resources/everyone/exercise-library/388/turkish-get-up/ Cytat/miejsce: Full Body/Integrated; Kettlebells. Szczebel 4. PT.
- **L6-S37** ACE: Figure Eight. https://www.acefitness.org/resources/everyone/exercise-library/382/figure-eight/ Cytat/miejsce: Full Body/Integrated; „passing the kettlebell from one hand to the other”. Szczebel 4. PT.
- **L6-S38** ACE: High Windmill. https://www.acefitness.org/resources/everyone/exercise-library/386/high-windmill/ Cytat/miejsce: Full Body/Integrated; Kettlebells. Szczebel 4. PT.
- **L6-S39** ACE: Box Jumps. https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ Cytat/miejsce: Butt/Hips, Legs - Calves and Shins, Legs - Thighs. Szczebel 4. PT.
- **L6-S40** ACE: Squat Jumps https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/ ; Squat Jump https://www.acefitness.org/resources/everyone/exercise-library/222/squat-jump/ Cytat/miejsce: Butt/Hips, Legs - Thighs. Szczebel 4. PT.
- **L6-S41** ACE: Tuck Jump. https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/ Cytat/miejsce: Butt/Hips; „pull your knees up towards your chest”. Szczebel 4. PT.
- **L6-S42** ACE: Forward Cone Jumps. https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/ Cytat/miejsce: Butt/Hips, Legs - Thighs; Cones. Szczebel 4. PT.
- **L6-S43** ACE: Lateral Cone Jumps. https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ Cytat/miejsce: Butt/Hips, Legs - Calves and Shins, Legs - Thighs; Cones. Szczebel 4. PT.
- **L6-S44** ACE: Cycled Split-Squat Jump. https://www.acefitness.org/resources/everyone/exercise-library/234/cycled-split-squat-jump/ Cytat/miejsce: Butt/Hips, Legs - Calves and Shins, Legs - Thighs. Szczebel 4. PT.
- **L6-S45** ACE: Alternate Leg Push-off. https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/ Cytat/miejsce: Butt/Hips, Calves, Thighs; Raised Platform/Box. Szczebel 4. PT.
- **L6-S46** ACE: Single Leg Push-off. https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/ Cytat/miejsce: Butt/Hips, Calves, Thighs; Raised Platform/Box. Szczebel 4. PT.
- **L6-S47** ACE: Forward Linear Jumps. https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/ Cytat/miejsce: Butt/Hips, Full Body, Calves, Thighs. Szczebel 4. PT.
- **L6-S48** ACE: Overhead Slams. https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/ Cytat/miejsce: Back, Butt/Hips, Full Body, Legs - Thighs, Shoulders; Medicine Ball. Szczebel 4. PT.
- **L6-S49** ACE: Overhead Medicine Ball Throws. https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/ Cytat/miejsce: Butt/Hips, Full Body, Shoulders; „working with a partner who can catch the ball”. Szczebel 4. PT.
- **L6-S50** ACE: Spider Walks. https://www.acefitness.org/resources/everyone/exercise-library/247/spider-walks/ Cytat/miejsce: Arms, Full Body/Integrated. Szczebel 4. PT.
- **L6-S51** ACE: Single Arm Plank. https://www.acefitness.org/resources/everyone/exercise-library/321/single-arm-plank/ Cytat/miejsce: Abs; „lifting one hand off the mat bringing it to the hip”. Szczebel 4. PT.
- **L6-S52** ACE: Sprinter Pulls. https://www.acefitness.org/resources/everyone/exercise-library/250/sprinter-pulls/ Cytat/miejsce: Full Body/Integrated — dril biegowy w półklęku (pokrewny Kneeling Arm Drill). Szczebel 4. PT.

Źródła z docs/research/24 użyte ponownie:

- **S32** Oliva-Lozano JM, Muyor JM 2020 (docs/research/24, S32), https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/ — tu nowe cytaty z tab. 3 (kolumny RA IO EO ES): Maeo 2013 „Hollowing ~5 ~64 ~20 ~15”, „V-sits ~80 ~52 ~66 ~7”, „Sit-up ~43 ~38 ~47 ~8”, „Back extension on the floor ~3 ~3 ~3 ~63”; Park & Park 2019 „Bilateral leg raise 63.79”; Cugliari & Boccia 2017: suspended roll-out, pike, knee-tuck — „Suspended roll-out plank elicited the greatest activation in RA, IO, EO, and ES”. PT.
- **S35** OpenStax Anatomy and Physiology 2e (docs/research/24, S35) — por. L6-S8–S10.

Przejrzane, nieużyte: Cinarli & Kafkas 2025 (trening anty-ruchowy — bez Pallof wprost), Ellestad 2024 (noszenie — nie ta część), Baumann 2024 (pchanie sanek — tylko fizjologia).

## 3. Podsumowanie (generowane z L6.json)

- Rekordów: **143**. Wzorce wejściowe: other 60, core_flexion 47, core_other 23, core_anti_ext 9, core_anti_rot 4.
- Werdykt: OK **107**, POPRAWIĆ **24**, SCALIĆ **6**, USUNĄĆ **6**.
- Zakres: NISZOWE **89**, ZOSTAJE **42**, SCALIĆ **6**, USUNĄĆ **6**.
- Pewność: jedno źródło 55, umiarkowane 46, brak źródła — uproszczenie 38, mocne 4.
- Wzorzec „other”: 60 ćwiczeń, zmiana wzorca proponowana dla 1 (Plate Pinch → isolation); pozostałe „other” poprawne — skoki, sanki, rzuty, drile techniczne, TGU, Superman nie pasują do żadnego wzorca siłowego, a „other” jest w WEAK_PATTERNS (zamiana tylko przy wspólnej partii) i poza slotami generatora. Zmiana skoków na squat albo Superman na hinge wstawiłaby je do slotów generatora jako bój główny — odrzucone.

### 3.1 Poprawki (POPRAWIĆ)

| Ćwiczenie | Pola | Zakres | Pewność | Powód |
|---|---|---|---|---|
| Cable Crunch | recommended: ["floor_mat", "cable.rope"] | ZOSTAJE | umiarkowane | Klękając, lina na górnym wyciągu. Partie bez zmian (brzuch, EMG jak w crunchu). Do zalecanych dopisać linę — spójnie ze Standing Rope Crunch i wersją ze skrętami. |
| Reverse Crunch | muscleLoad: {"abs": 1, "obliques": 0.5} | ZOSTAJE | umiarkowane | Escamilla 2006 (reverse crunch 30°: wysokie RA, IO); ACE/SDSU: 3. miejsce dla skośnych (zwykły crunch 11.). Skośne 0,25 → 0,5, spójnie z Hanging Knee Raise. |
| Exercise Ball Pull-In | name: "Stability Ball Knee Tuck" | ZOSTAJE | umiarkowane | Ustalona nazwa w ACE: „Stability Ball Knee Tucks”; w katalogu inne ćwiczenia z piłką mają prefiks „Stability Ball”. Escamilla 2010: knee-up na piłce — umiarkowane RA, najszerszy 17–25% MVIC. |
| Sit Up | muscleLoad: {"abs": 1, "obliques": 0.25, "quads": 0.25} | ZOSTAJE | umiarkowane | RA ~43% MVIC (Maeo w S32). Prosty uda: „Rectus femoris muscle EMG activity was highest for … bent-knee sit-up” (S1), podobnie S3 — dopisać quads 0,25 (spójnie z 3/4 Sit-Up i GHD Sit Up). |
| V-Up | muscleLoad: {"abs": 1, "obliques": 0.5} | ZOSTAJE | umiarkowane | Maeo 2013 (w S32): V-sits RA ~80%, EO ~66% MVIC — skośne 0,25 → 0,5. |
| Barbell Ab Rollout | name: "Standing Barbell Rollout" | NISZOWE | jedno źródło | Wg opisu źródła to roll-out z pozycji pompki (ze stóp); obok jest „Rollout (sztanga)” z klęku — nazwa myląca. Propozycja nazwy opisowej. |
| Pallof Press | loadMode: "unilateral" | ZOSTAJE | jedno źródło | Pilotaż EMG (n=4, abstrakt): skośne aktywne w wersji anty-rotacyjnej i rotacyjnej. Wykonywane na stronę — tryb „unilateral” spójnie z Pallof Press With Rotation, Cable Woodchop (dziś „total” z reguły sprzętu linki). |
| Side Plank | muscleLoad: {"obliques": 1, "abs": 0.5, "abductors": 0.5, "side_delt": 0.25, "lower_back": 0.25} | ZOSTAJE | umiarkowane | Escamilla 2016: „Lumbar paraspinal activity was significantly greater in the 3 side position exercises” — dopisać lower_back 0,25. |
| Stomach Vacuum | muscleLoad: {"obliques": 1, "abs": 0.25} | NISZOWE | jedno źródło | „Hollowing” (Maeo 2013 w S32): RA ~5%, IO ~64% MVIC — obciążenie przesunąć na skośne (IO); poprzeczny brzucha nie ma regionu. Ćwiczenie oddechowo-izometryczne, nie siłowe. |
| Weighted Ball Side Bend | muscleLoad: {"obliques": 1, "abs": 0.25, "lower_back": 0.25} | NISZOWE | jedno źródło | Escamilla 2016: side crunch na piłce — EO 50% MVIC, prostowniki wyżej niż w pozycjach na plecach/brzuchu — dopisać lower_back 0,25. |
| Box Jump | group: "nogi"; muscles: ["czworogłowe"]; secondaryMuscles: ["pośladki", "łydki"]; muscleLoad: {"quads": 1, "glutes": 0.5, "calves": 0.5, "hamstrings": 0.25} | ZOSTAJE | umiarkowane | Spójność ze skokami: Grgic 2021 (przegląd) — plyometria daje przerost mięśni nóg podobny do treningu oporowego (czworogłowe). Dziś partia z grupy cardio = brak partii. Propozycja (decyzja właściciela, ćw. bazowe): grupa nogi, główna czworogłowe, pomocnicze pośladki + łydki. Wzorzec other poprawny (brak wzorca „skok”). |
| Plate Pinch | pattern: "isolation" | NISZOWE | jedno źródło | Chwyt szczypcowy talerzy — zginacze palców i kciuka (OpenStax). Wzorzec other → isolation, spójnie z „Standing Olympic Plate Hand Squeeze”, Finger Curls (ćwiczenia chwytu). |
| Box Skip | group: "nogi" | NISZOWE | umiarkowane | Skipy na skrzynie. Grupa cardio → nogi (22 inne skoki są w nogi; spójność). |
| Broad Jump | group: "nogi" | ZOSTAJE | umiarkowane | Skok w dal z miejsca (ACE Forward Linear Jumps). Grupa cardio → nogi. |
| Knee Tuck Jump | name: "Tuck Jump"; group: "nogi" | ZOSTAJE | umiarkowane | Ustalona nazwa: „Tuck Jump” (ACE, Davies). Grupa cardio → nogi. |
| Lateral Bound | group: "nogi" | ZOSTAJE | umiarkowane | „Lateral bounding” (Davies, tab. 6). Grupa cardio → nogi. |
| Lateral Box Jump | group: "nogi" | NISZOWE | umiarkowane | Skoki bokiem na skrzynię. Grupa cardio → nogi. |
| Lateral Cone Hops | group: "nogi"; muscles: ["czworogłowe"]; secondaryMuscles: ["łydki", "pośladki"]; muscleLoad: {"quads": 1, "calves": 0.5, "glutes": 0.5, "adductors": 0.25, "abductors": 0.25} | NISZOWE | umiarkowane | Ten sam dril co Front Cone Hops (czworogłowe główne), inny kierunek; ACE Lateral Cone Jumps: Butt/Hips, Calves, Thighs. Główna łydki → czworogłowe, pomocnicze łydki + pośladki; grupa cardio → nogi. |
| Backward Medicine Ball Throw | muscles: []; secondaryMuscles: [] | NISZOWE | jedno źródło | Rzut piłką lekarską (moc). Spójność z Medicine Ball Slam (bazowe, bez partii) i z brakiem dowodu przerostu z rzutów kończyn górnych (Davies: mało badań UE): bez partii głównych/pomocniczych, obciążenie mapy zostaje. |
| Medicine Ball Scoop Throw | muscles: []; secondaryMuscles: [] | NISZOWE | jedno źródło | Rzut piłką lekarską (moc). Spójność z Medicine Ball Slam (bazowe, bez partii) i z brakiem dowodu przerostu z rzutów kończyn górnych (Davies: mało badań UE): bez partii głównych/pomocniczych, obciążenie mapy zostaje. |
| Standing Two-Arm Overhead Throw | muscles: []; secondaryMuscles: [] | NISZOWE | jedno źródło | Rzut piłką lekarską (moc). Spójność z Medicine Ball Slam (bazowe, bez partii) i z brakiem dowodu przerostu z rzutów kończyn górnych (Davies: mało badań UE): bez partii głównych/pomocniczych, obciążenie mapy zostaje. |
| Supine Chest Throw | group: "inne"; muscles: []; secondaryMuscles: [] | NISZOWE | jedno źródło | Rzut piłką lekarską (moc). Spójność z Medicine Ball Slam (bazowe, bez partii) i z brakiem dowodu przerostu z rzutów kończyn górnych (Davies: mało badań UE): bez partii głównych/pomocniczych, obciążenie mapy zostaje. Grupa klatka → inne (jak pozostałe rzuty). |
| Bench Sprint | name: "Alternate Leg Push-Off" | NISZOWE | umiarkowane | Naprzemienne wybicia ze stopą na skrzyni — ustalona nazwa ACE „Alternate Leg Push-off”. |
| Linear Depth Jump | name: "Depth Jump" | NISZOWE | umiarkowane | Po scaleniu z Depth Jump Leap — ustalona nazwa „Depth Jump” (Davies). Wymaga nadzoru techniki (Davies). |

### 3.2 Scalenia (duplikaty)

| Ćwiczenie | Scalić z | Powód |
|---|---|---|
| 3/4 Sit-Up | Sit Up | Sit-up z niepełnym zakresem w dół — ten sam ruch co Sit Up; wariant zakresu, nie osobne ćwiczenie. |
| Bottoms Up | Reverse Crunch | Opis: przyciągnięcie kolan, wyprost nóg pionowo i uniesienie miednicy — odwrotny brzuszek z wyprostem nóg. Duplikat funkcjonalny. |
| Hanging Alternating Knee Raise | Hanging Knee Raise | W źródle „Wind Sprints” — naprzemienne unoszenie kolan w zwisie; ten sam ruch co Hanging Knee Raise. |
| Oblique Crunches | Cross-Body Crunch | Opis źródła: łokieć do przeciwnego kolana, stopy na podwyższeniu — ten sam skręt co Cross-Body Crunch; nazwa „Oblique Crunches” myli się z „Oblique Crunches - On The Floor” (bokiem). |
| Plate Twist | Russian Twist | Opis źródła = Russian Twist z talerzem; Russian Twist już ma notę „med ball or plate equally common”. |
| Depth Jump Leap | Linear Depth Jump | Zeskok ze skrzyni i wyskok na drugą skrzynię — to samo co Linear Depth Jump (Davies: „drop jump to second box”). |

### 3.3 Do usunięcia

| Ćwiczenie | Powód |
|---|---|
| Iron Cross | Niemożliwe do zidentyfikowania: wpis źródła bez instrukcji, nazwa koliduje z „Iron Crosses (Stretch)” i elementem na kółkach; katalog zgadywał ruch. |
| Linear 3-Part Start Technique | Dril techniki biegu sprinterskiego (opis źródła listy: start / akcent ramion / krok), nie ćwiczenie oporowe — nie da się go sensownie zapisać w dzienniku siłowym (ocena produktowa). |
| Linear Acceleration Wall Drill | Dril techniki biegu sprinterskiego (opis źródła listy: start / akcent ramion / krok), nie ćwiczenie oporowe — nie da się go sensownie zapisać w dzienniku siłowym (ocena produktowa). |
| Moving Claw Series | Dril techniki biegu sprinterskiego (opis źródła listy: start / akcent ramion / krok), nie ćwiczenie oporowe — nie da się go sensownie zapisać w dzienniku siłowym (ocena produktowa). |
| Kneeling Arm Drill | Dril techniki biegu sprinterskiego (opis źródła listy: start / akcent ramion / krok), nie ćwiczenie oporowe — nie da się go sensownie zapisać w dzienniku siłowym (ocena produktowa). |
| Balance Board | Ćwiczenie równowagi (stanie na desce), nie oporowe; deski nie ma w słowniku (bosu to inny przyrząd), łydki jako główna bez podstaw. |

### 3.4 Wszystkie ćwiczenia

| Ćwiczenie | Wzorzec | Werdykt | Zakres | Źródła | Pewność |
|---|---|---|---|---|---|
| Cable Crunch | core_flexion | POPRAWIĆ | ZOSTAJE | S32, L6-S1, L6-S18 | umiarkowane |
| Crunch | core_flexion | OK | ZOSTAJE | S32, L6-S1, L6-S2, L6-S18 | mocne |
| Hanging Knee Raise | core_flexion | OK | ZOSTAJE | L6-S1, L6-S7 | umiarkowane |
| Hanging Leg Raise | core_flexion | OK | ZOSTAJE | L6-S1, L6-S7 | umiarkowane |
| Reverse Crunch | core_flexion | POPRAWIĆ | ZOSTAJE | L6-S1, L6-S7, L6-S19 | umiarkowane |
| 3/4 Sit-Up | core_flexion | SCALIĆ | SCALIĆ | L6-S17 | jedno źródło |
| Bicycle Crunch | core_flexion | OK | ZOSTAJE | L6-S7 | jedno źródło |
| Bosu Ball Cable Crunch With Side Bends | core_flexion | OK | NISZOWE | L6-S17, S32 | brak źródła — uproszczenie |
| Bottoms Up | core_flexion | SCALIĆ | SCALIĆ | L6-S17, L6-S19 | jedno źródło |
| Butt-Ups | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Cable Reverse Crunch | core_flexion | OK | NISZOWE | L6-S17, L6-S1 | jedno źródło |
| Cable Seated Crunch | core_flexion | OK | NISZOWE | L6-S17, S32 | jedno źródło |
| Cocoons | core_flexion | OK | NISZOWE | L6-S17, S32 | jedno źródło |
| Cross-Body Crunch | core_flexion | OK | ZOSTAJE | L6-S8, L6-S7 | jedno źródło |
| Crunch - Hands Overhead | core_flexion | OK | NISZOWE | L6-S7 | jedno źródło |
| Crunch - Legs On Exercise Ball | core_flexion | OK | NISZOWE | L6-S17, L6-S18 | jedno źródło |
| Decline Crunch | core_flexion | OK | ZOSTAJE | S32, L6-S1 | umiarkowane |
| Decline Oblique Crunch | core_flexion | OK | NISZOWE | L6-S17, L6-S8 | jedno źródło |
| Decline Reverse Crunch | core_flexion | OK | NISZOWE | L6-S1 | jedno źródło |
| Exercise Ball Pull-In | core_flexion | POPRAWIĆ | ZOSTAJE | L6-S2, L6-S25 | umiarkowane |
| Frog Sit-Ups | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| GHD Sit Up | core_flexion | OK | NISZOWE | L6-S17, L6-S1 | jedno źródło |
| Gorilla Chin/Crunch | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Hanging Alternating Knee Raise | core_flexion | SCALIĆ | SCALIĆ | L6-S17, L6-S1 | jedno źródło |
| Janda Sit-Up | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Kneeling Cable Crunch With Alternating Oblique Twists | core_flexion | OK | NISZOWE | L6-S17, L6-S8 | jedno źródło |
| L-Sit | core_flexion | OK | ZOSTAJE | — | brak źródła — uproszczenie |
| Leg Pull-In | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Lying Leg Raise | core_flexion | OK | ZOSTAJE | S32 | jedno źródło |
| Machine Crunch | core_flexion | OK | ZOSTAJE | L6-S32 | jedno źródło |
| Oblique Crunches | core_flexion | SCALIĆ | SCALIĆ | L6-S17 | jedno źródło |
| Otis-Up | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Press Sit-Up | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Scissor Kick | core_flexion | OK | NISZOWE | L6-S17, S32 | jedno źródło |
| Seated Flat Bench Leg Pull-In | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Sit Up | core_flexion | POPRAWIĆ | ZOSTAJE | S32, L6-S1, L6-S2, L6-S3 | umiarkowane |
| Smith Machine Hip Raise | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Stability Ball Crunch | core_flexion | OK | ZOSTAJE | L6-S7, L6-S26 | umiarkowane |
| Standing Rope Crunch | core_flexion | OK | NISZOWE | L6-S17 | jedno źródło |
| Supine One-Arm Overhead Throw | core_flexion | OK | NISZOWE | L6-S17, L6-S5 | brak źródła — uproszczenie |
| Supine Two-Arm Overhead Throw | core_flexion | OK | NISZOWE | L6-S17, L6-S5 | brak źródła — uproszczenie |
| Suspended Reverse Crunch | core_flexion | OK | NISZOWE | L6-S28, S32 | umiarkowane |
| Toe Touchers | core_flexion | OK | NISZOWE | L6-S31 | jedno źródło |
| Toes to Bar | core_flexion | OK | ZOSTAJE | L6-S1 | jedno źródło |
| Tuck Crunch | core_flexion | OK | NISZOWE | L6-S7, L6-S17 | jedno źródło |
| V-Up | core_flexion | POPRAWIĆ | ZOSTAJE | S32, L6-S30 | umiarkowane |
| Weighted Sit-Ups - With Bands | core_flexion | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Ab Wheel | core_anti_ext | OK | ZOSTAJE | S32, L6-S1, L6-S2 | mocne |
| Dead Bug | core_anti_ext | OK | ZOSTAJE | L6-S23 | jedno źródło |
| Hollow Hold | core_anti_ext | OK | ZOSTAJE | — | brak źródła — uproszczenie |
| Plank | core_anti_ext | OK | ZOSTAJE | S32, L6-S22 | mocne |
| Barbell Ab Rollout | core_anti_ext | POPRAWIĆ | NISZOWE | L6-S17, L6-S2 | jedno źródło |
| Barbell Rollout from Bench | core_anti_ext | OK | NISZOWE | L6-S17 | jedno źródło |
| Dragon Flag | core_anti_ext | OK | NISZOWE | — | brak źródła — uproszczenie |
| Rollout (sztanga) | core_anti_ext | OK | ZOSTAJE | L6-S29, L6-S1 | umiarkowane |
| Suspended Fallout | core_anti_ext | OK | NISZOWE | L6-S27, S32 | umiarkowane |
| Bird Dog | core_anti_rot | OK | ZOSTAJE | S32, L6-S21 | umiarkowane |
| Pallof Press | core_anti_rot | POPRAWIĆ | ZOSTAJE | L6-S15, L6-S8 | jedno źródło |
| Pallof Press With Rotation | core_anti_rot | OK | NISZOWE | L6-S15 | jedno źródło |
| Plank Shoulder Taps | core_anti_rot | OK | ZOSTAJE | L6-S51 | jedno źródło |
| Russian Twist | core_other | OK | ZOSTAJE | L6-S8, L6-S34 | jedno źródło |
| Side Plank | core_other | POPRAWIĆ | ZOSTAJE | S32, L6-S3, L6-S24 | umiarkowane |
| Alternate Heel Touchers | core_other | OK | NISZOWE | L6-S17, L6-S8 | jedno źródło |
| Barbell Side Bend | core_other | OK | NISZOWE | L6-S8 | jedno źródło |
| Bent Press | core_other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Cable Judo Flip | core_other | OK | NISZOWE | L6-S17, L6-S8 | jedno źródło |
| Cable Russian Twists | core_other | OK | NISZOWE | L6-S17, L6-S33 | jedno źródło |
| Cable Woodchop | core_other | OK | ZOSTAJE | L6-S35, L6-S8 | umiarkowane |
| Copenhagen Plank | core_other | OK | ZOSTAJE | L6-S6 | umiarkowane |
| Double Kettlebell Windmill | core_other | OK | NISZOWE | L6-S17, L6-S38 | brak źródła — uproszczenie |
| Kettlebell Figure 8 | core_other | OK | NISZOWE | L6-S37 | jedno źródło |
| Kettlebell Windmill | core_other | OK | NISZOWE | L6-S38 | jedno źródło |
| Landmine Rotation | core_other | OK | NISZOWE | L6-S8 | brak źródła — uproszczenie |
| Medicine Ball Full Twist | core_other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Oblique Crunches - On The Floor | core_other | OK | NISZOWE | L6-S17, L6-S3 | jedno źródło |
| One-Arm High-Pulley Cable Side Bends | core_other | OK | NISZOWE | L6-S17, L6-S8 | jedno źródło |
| Plate Twist | core_other | SCALIĆ | SCALIĆ | L6-S17 | jedno źródło |
| Seated Barbell Twist | core_other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Side Bend (hantel) | core_other | OK | ZOSTAJE | L6-S8 | jedno źródło |
| Side Jackknife | core_other | OK | NISZOWE | L6-S16 | jedno źródło |
| Spell Caster | core_other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Stomach Vacuum | core_other | POPRAWIĆ | NISZOWE | S32 | jedno źródło |
| Weighted Ball Side Bend | core_other | POPRAWIĆ | NISZOWE | L6-S3 | jedno źródło |
| Box Jump | other | POPRAWIĆ | ZOSTAJE | L6-S4, L6-S5, L6-S39 | umiarkowane |
| Medicine Ball Slam | other | OK | ZOSTAJE | L6-S48, L6-S5 | jedno źródło |
| Iron Cross | other | USUNĄĆ | USUNĄĆ | L6-S17 | brak źródła — uproszczenie |
| Kettlebell Pirate Ships | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Sled Overhead Backward Walk | other | OK | NISZOWE | L6-S17, L6-S14 | brak źródła — uproszczenie |
| Plate Pinch | other | POPRAWIĆ | NISZOWE | L6-S10 | jedno źródło |
| Box Skip | other | POPRAWIĆ | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Broad Jump | other | POPRAWIĆ | ZOSTAJE | L6-S4, L6-S5, L6-S47 | umiarkowane |
| Knee Tuck Jump | other | POPRAWIĆ | ZOSTAJE | L6-S4, L6-S5, L6-S41 | umiarkowane |
| Lateral Bound | other | POPRAWIĆ | ZOSTAJE | L6-S4, L6-S5 | umiarkowane |
| Lateral Box Jump | other | POPRAWIĆ | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Lateral Cone Hops | other | POPRAWIĆ | NISZOWE | L6-S4, L6-S5, L6-S43, L6-S42 | umiarkowane |
| Linear 3-Part Start Technique | other | USUNĄĆ | USUNĄĆ | L6-S17, L6-S52 | jedno źródło |
| Linear Acceleration Wall Drill | other | USUNĄĆ | USUNĄĆ | L6-S17, L6-S52 | jedno źródło |
| Moving Claw Series | other | USUNĄĆ | USUNĄĆ | L6-S17, L6-S52 | jedno źródło |
| One-Arm Medicine Ball Slam | other | OK | NISZOWE | L6-S48 | jedno źródło |
| Sledgehammer Swings | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Wall Ball | other | OK | ZOSTAJE | L6-S5 | brak źródła — uproszczenie |
| Spider Crawl | other | OK | NISZOWE | L6-S50 | jedno źródło |
| Turkish Get Up | other | OK | ZOSTAJE | L6-S36, L6-S11 | umiarkowane |
| Backward Medicine Ball Throw | other | POPRAWIĆ | NISZOWE | L6-S5, L6-S49 | jedno źródło |
| Jerk Balance | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Kneeling Arm Drill | other | USUNĄĆ | USUNĄĆ | L6-S17, L6-S52 | jedno źródło |
| Medicine Ball Scoop Throw | other | POPRAWIĆ | NISZOWE | L6-S5 | jedno źródło |
| Rack Delivery | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Standing Two-Arm Overhead Throw | other | POPRAWIĆ | NISZOWE | L6-S5, L6-S49 | jedno źródło |
| Sled Forward Drag with Press | other | OK | NISZOWE | L6-S17, L6-S14 | brak źródła — uproszczenie |
| Supine Chest Throw | other | POPRAWIĆ | NISZOWE | L6-S5 | jedno źródło |
| Alternate Leg Diagonal Bound | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Backward Drag | other | OK | NISZOWE | L6-S14 | brak źródła — uproszczenie |
| Bear Crawl Sled Drag | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Bench Jump | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Bench Sprint | other | POPRAWIĆ | NISZOWE | L6-S4, L6-S5, L6-S45 | umiarkowane |
| Depth Jump Leap | other | SCALIĆ | SCALIĆ | L6-S4, L6-S5 | umiarkowane |
| Double Leg Butt Kick | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Dumbbell Seated Box Jump | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Frog Hops | other | OK | NISZOWE | L6-S4, L6-S5, L6-S47 | umiarkowane |
| Front Cone Hops | other | OK | NISZOWE | L6-S4, L6-S5, L6-S42 | umiarkowane |
| Jump Squat | other | OK | ZOSTAJE | L6-S4, L6-S5, L6-S40 | mocne |
| Linear Depth Jump | other | POPRAWIĆ | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Side Hop-Sprint | other | OK | NISZOWE | L6-S4, L6-S5 | jedno źródło |
| Side Standing Long Jump | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Side to Side Box Shuffle | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Single Leg Butt Kick | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Single Leg Push-Off | other | OK | NISZOWE | L6-S4, L6-S5, L6-S46 | umiarkowane |
| Single-Leg Hop Progression | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Single-Leg Lateral Hop | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Single-Leg Stride Jump | other | OK | NISZOWE | L6-S4, L6-S5 | umiarkowane |
| Sled Drag (Harness) | other | OK | NISZOWE | L6-S14 | brak źródła — uproszczenie |
| Sled Push | other | OK | ZOSTAJE | L6-S13 | brak źródła — uproszczenie |
| Split Jump | other | OK | ZOSTAJE | L6-S4, L6-S5, L6-S44 | umiarkowane |
| Star Jump | other | OK | ZOSTAJE | L6-S4, L6-S5 | umiarkowane |
| Weighted Jump Squat | other | OK | NISZOWE | L6-S4 | umiarkowane |
| Dead Hang | other | OK | ZOSTAJE | L6-S10, L6-S12 | umiarkowane |
| London Bridges | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Lower Back Curl | other | OK | NISZOWE | L6-S9, S32 | umiarkowane |
| Superman | other | OK | ZOSTAJE | L6-S20, L6-S9, S32 | umiarkowane |
| Downward Facing Balance | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Kneeling Jump Squat | other | OK | NISZOWE | L6-S17 | brak źródła — uproszczenie |
| Balance Board | other | USUNĄĆ | USUNĄĆ | L6-S17 | brak źródła — uproszczenie |

## 4. Pytania otwarte (do właściciela)

- **Q-L6-1. Skoki plyometryczne: grupa i partie.** Dziś 7 skoków w grupie „cardio” (w tym bazowy Box Jump bez partii), 22 w „nogi” z czworogłowymi. Przegląd S4 (szczebel 2): plyometria daje przerost mięśni nóg podobny do treningu oporowego.
  A) wszystkie skoki w „nogi” z czworogłowymi głównymi (także Box Jump) — statystyka serii uczciwsza, spójne; zmienia ćwiczenie bazowe. B) wszystkie w „cardio” bez partii — zgodne z dawnym Box Jump, ale zaniża nogi wbrew S4. C) bez zmian — niespójne. **Rekomendacja: A.**
- **Q-L6-2. Rzuty piłką lekarską bez partii** (Backward/Scoop/Standing Overhead/Supine Chest Throw) — spójnie z bazowym Medicine Ball Slam; brak dowodu przerostu z rzutów kończyn górnych (S5). Alternatywa: nadać partie wszystkim rzutom i slamom (bez źródła). **Rekomendacja: bez partii.**
  Ta sama niespójność poza L6: Medicine Ball Chest Pass, Kneeling Chest Push, Incline Push-Up Depth Jump, Return Push from Stance mają wzorzec h_push (zamiana podsunie je jako „ten sam ruch” dla wyciskania) — do części L1/L2.
- **Q-L6-3. Miara dla sanek** (Sled Push, drag): zadaje się dystans z ciężarem; aplikacja ma tylko ciężar+czas. A) zostawić ciężar+czas (uproszczenie), B) nowa miara ciężar+dystans (zmiana schematu). **Rekomendacja: A** do czasu potrzeby.
- **Q-L6-4. Zginacze bioder** — unoszenia nóg, L-sit, sit-upy mocno angażują biodrowo-lędźwiowy (S1: prosty uda), a aplikacja nie ma takiej partii ani regionu. Przypisanie „core” to nazwane uproszczenie.
- **Q-L6-5. Pallof Press — tryb „na stronę”** zmienia objętość (×2) w ćwiczeniu bazowym; zapisane treningi nie powinny być przeliczane wstecz. Opcje: A) zmienić dla nowych instalacji, B) zostawić „łącznie” i zmienić wariant z rotacją na „łącznie”. **Rekomendacja: A.**
- **Q-L6-6. Kandydaci do scalenia (decyzja produktowa, nie duplikaty ścisłe):** Lower Back Curl → Superman, Leg Pull-In → Reverse Crunch, One-Arm Medicine Ball Slam → Medicine Ball Slam, Crunch - Hands Overhead → Crunch.
- **Q-L6-7. Brak źródeł partii** dla: L-Sit, Dragon Flag, Hollow Hold, Landmine Rotation, sanki, Bent Press, Pirate Ships, Spell Caster — zostają jako uproszczenia (pole confidence).
- **Q-L6-8. Rejestr decyzji (Google Drive)** — po akceptacji wpisać zmiany z 3.1–3.3 z odrzuconymi alternatywami (Q-L6-1, Q-L6-2).

