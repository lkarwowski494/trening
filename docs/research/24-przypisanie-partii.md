# 24. Przypisanie partii w katalogu bazowym — przegląd źródeł (08.10.2026)

Zlecenie: audyt 0.10, ustalenie **E4 / MER-10** (docs/25-audyt-0.10.md, docs/audyt-0.10/MER.md): partie główne i pomocnicze
125 ćwiczeń bazowych (`LIB_BASE` w lib/seed.ts) nie mają źródeł, a co najmniej jeden przykład przeczy badaniom (Back Squat → dwugłowe
jako pomocnicza). Te dane napędzają kreskę 10 serii, mapę mięśni, serie tygodniowe i ostrzeżenia „dzień po dniu” w generatorze
(lib/generator.ts), propozycje z regeneracją (lib/plan.ts) i ranking zamian (lib/swap.ts — pierwsza partia główna). Są więc twierdzeniami
treningowymi i podlegają zasadzie „Merytoryczne podstawy” (CLAUDE.md).

**Ten dokument niczego nie zmienia w kodzie ani w katalogu.** Dane do wdrożenia: `docs/research/24-przypisanie-partii.json`
(wszystkie 125 ćwiczeń, także bez zmian). Tabela w sekcji 4 jest generowana z tego pliku (nie przepisywana ręcznie).

## 1. Metoda

- **Lista ćwiczeń z kodu, nie ręcznie.** Skrypt (node, poza repo) wyciągnął z lib/seed.ts tablice `LIB_BASE`, `MUSCLES_BY_NAME`
  i `GROUP_TO_MUSCLE` i odtworzył `musclesFor`: 69 ćwiczeń ma jawny wpis, 56 bierze partię z pola grupy (9 z nich to cardio bez partii).
  Wzorzec ruchu (`pattern`) i obciążenie partii (`muscleLoad`) — z docs/research/equipment/catalog.json.
- **Reguła liczenia:** główna = 1 seria, pomocnicza = 0,5 serii (S6 — „fractional” najlepiej dopasowany). Definicje z S6 przyjęte jako
  kryterium: partia **główna** = „the primary force generator in the exercise”; **pomocnicza** = „likely to be meaningfully trained but not the
  primary force generator (i.e., synergist)”.
- **Kolejność siły dowodu** (zgodna z hierarchią z CLAUDE.md): pomiar wzrostu mięśnia po treningu danym ćwiczeniem (MRI/USG, RCT; szczebel 3,
  zebrane w przeglądach — 2) → klasyfikacja ćwiczeń w metaanalizie (S6, szczebel 2, z zastrzeżeniem autorów „not wholly objective”) → EMG
  (aktywacja; przeglądy systematyczne — 2, pojedyncze badania — 3) → anatomia czynnościowa z podręcznika (S35, szczebel 3).
  Przy sprzeczności EMG z pomiarem wzrostu wygrywa pomiar wzrostu: S2 wprost: „sEMG amplitudes could not reliably predict hypertrophic
  outcomes across several analytical approaches”.
- **Oznaczenia:** **PT** — przeczytany pełny tekst (lub wskazane fragmenty pełnego tekstu), **A** — przeczytane streszczenie (PubMed / Europe PMC).
  „EMG — aktywacja, nie wzrost” przy przypisaniach opartych tylko na EMG. **Analogia** — wariant niebadany osobno, przypisanie jak ćwiczenia
  bazowego (nazwane uproszczenie).
- **Pewność** (pole `confidence` w JSON):
  - **mocne** — wzrost zmierzony w ≥ 2 badaniach różnych zespołów albo przegląd systematyczny + badanie wzrostu;
  - **umiarkowane** — jedno badanie wzrostu + EMG/klasyfikacja, albo EMG z przeglądu / ≥ 2 zespołów, albo analogia do ćwiczenia z mocnym dowodem;
  - **jedno źródło** — jedno przeczytane źródło (np. sama klasyfikacja S6, sama anatomia S35, jedno badanie EMG);
  - **brak źródła — uproszczenie** — brak przeczytanego źródła dla tego ćwiczenia;
  - **nie dotyczy** — cardio (bez partii, nie liczy się do serii).
- **Niezależność źródeł:** zespół Isaka/Maeo/Kinoshita (Ritsumeikan) to S3, S27, S29, S30 (S28 — Maeo z Loughborough); zespół Gentila to S11,
  S12, S14 i współautor S5; Bourne/Lazarczuk (S22) to jeden zespół. W ocenie „mocne” liczone jako jedno źródło na zespół.
- **Zastrzeżenia ogólne:** badania wzrostu trwają zwykle 6–12 tygodni i dotyczą głównie osób nietrenujących; wiele przypisań (zwłaszcza
  barków, tricepsa przy wyciskaniu nad głowę, core) opiera się tylko na EMG lub klasyfikacji. S6 przeczytano w wersji preprintu
  (SportRχiv, wrzesień 2024, tabela 1A); wersja opublikowana (Sports Med 2026) — tylko streszczenie.

## 2. Odpowiedzi na pytania szczegółowe

### 2.1 Przysiad (Back Squat i warianty) — dwugłowe jako pomocnicza? **Nie.**
- Dwa niezależne badania z MRI: Kubo 2019 (S1, Japonia): „that of rectus femoris and hamstring muscles did not change in either group”;
  Plotkin 2023 (S2, USA, PT): „Thigh hypertrophy outcomes favored SQ in the adductors and quadriceps, with no meaningful growth in either group
  in the hamstrings.” Spójne: suwnica (S3) daje dwugłowym tylko „slight” przyrost (+1,5–5,3%), tyle samo co prostowanie nóg (koaktywacja).
- Rosną: czworogłowe (S1, S2, S38, S3 dla suwnicy), pośladki (S1, S2, S5; przegląd S4: „back squats performed in parallel or full range of motion
  significantly enhance GMax hypertrophy”) i przywodziciele (S1, S2).
- **Propozycja:** Back Squat → główna czworogłowe, pomocnicza pośladki (bez dwugłowych). Pewność: **mocne**. Pozostałe przysiady i tak nie mają
  dwugłowych. Bulgarian Split Squat — usunięcie dwugłowych z tego samego powodu (EMG wykroku: dwugłowe 20–30% MVIC, „less effective for
  hypertrophy and strengthening of the hamstrings”, S26) — **umiarkowane** (EMG).

### 2.2 Przywodziciele — **pytanie otwarte Q1** (decyzja produktowa przy mocnym dowodzie)
- Uwaga do zlecenia: aplikacja **ma** partię „przywodziciele” od 04.10.2026 (lib/seed.ts, `MUSCLES`; catalog-notes.md „Krok b”). Właściciel
  świadomie **nie** dodał jej jako pomocniczej do przysiadów i wykroków („inaczej każdy przysiad dokładałby 0,5 serii przywodzicieli
  w statystyce tygodniowej; do decyzji przy module regeneracji”). W obciążeniu partii (`muscleLoad`) przysiady mają już adductors 0,5.
- Dowód: przywodziciele rosną po przysiadzie (S1: FST +6,2%, HST +2,7%; S2: przewaga przysiadu nad hip thrustem 2,5 cm²) i po suwnicy
  (S3: przywodziciel wielki +6,2%). Anatomia: „the adductor magnus extends it [the thigh]” (S35) — pracuje jako prostownik biodra.
  Wzrost zależy od głębokości (S1), której aplikacja nie zna.
- Opcje (szczegóły w sekcji 6, Q1). **Rekomendacja: B** — dodać „przywodziciele” jako pomocniczą tylko tam, gdzie wzrost zmierzono
  (Back Squat, Leg Press); warianty przysiadu dopiero po decyzji o analogii.

### 2.3 Martwy ciąg / RDL — która partia główna?
- **RDL:** dwugłowe rosną po RDL (S19: ACSA +10%, jak po nordic) i po martwym ciągu na prostych nogach (S20: +7,0%) — dwa niezależne zespoły,
  **mocne**. EMG (przegląd S16): „the Romanian Deadlift is associated with lower activation for erector spinae than for biceps femoris and
  semitendinosus”. Obecne przypisanie (dwugłowe / pośladki + plecy) — **bez zmian**; „plecy” pomocnicze to uproszczenie (S21: „the Romanian
  deadlift does not enhance lumbar extension torque”).
- **Martwy ciąg klasyczny:** nie znaleziono badania wzrostu dla samego martwego ciągu (Q2). EMG (S16): „Erector spinae and quadriceps muscles
  reported greater activation than gluteus maximus and biceps femoris muscles”, ale autorzy przyznają „significant controversy when determining
  which muscles are involved”; przy 1RM dwugłowa najwyżej w martwym ciągu sztangą (S17), pośladek wielki > 60% MVIC (S18). Prostowniki
  pracują izometrycznie; trening RDL nie poprawia siły prostowników lędźwiowych (S21), a przegląd S14: „For the lumbar extensors, the studies
  reviewed tend to support the view that this muscle group may benefit from SJ exercise.” Partia „plecy” w aplikacji to w praktyce najszersze
  i góra pleców (wiosłowania, ściągania) — martwy ciąg jako „plecy” główna zawyża serie pleców i daje ostrzeżenia „dzień po dniu” w planie
  góra/dół (audyt: 1–2 pary przy 4–6 sesjach; potwierdzone symulacją w sekcji 5.3).
- **Propozycja:** Deadlift (sztanga) → główne **dwugłowe + pośladki**, pomocnicze **plecy + czworogłowe**; Deadlift (hantle) analogicznie
  (pomocnicze: plecy). Trap Bar → główne **czworogłowe + pośladki**, pomocnicze **dwugłowe + plecy** (gryf heksagonalny: więcej czworogłowych,
  mniej dwugłowych i prostowników — Camara 2016 w S16, S17). Sumo — bez zmian (S16: więcej czworogłowych niż w klasycznym). Pewność:
  **umiarkowane** (EMG z przeglądu + wzrost w pokrewnych RDL/SLDL; brak badań wzrostu dla wersji klasycznej — nazwane uproszczenie).
- Alternatywa odrzucona: zostawić „plecy” główną i tylko wyłączyć ostrzeżenie dla martwego ciągu — to obejście w kodzie, nie odpowiedź merytoryczna.

### 2.4 Wyciskanie leżąc — triceps i przedni akton jako pomocnicze? **Tak.**
- Wzrost tricepsa przy treningu samym wyciskaniem: S8 (MRI), S9 (USG; także pompki), S7 (MRI) — trzy zespoły (dwa w Japonii, jeden w Brazylii):
  **mocne**. S7: „pectoralis major demonstrated larger increases in CSA than pectoralis minor and triceps brachii” — klatka główna, triceps
  pomocniczy.
- Przedni akton: S7 (wzrost w MRI), EMG S10 („the horizontal bench press produces similar electromyographic activities for the pectoralis
  major and the anterior deltoid”; przy nachyleniu ≥ 45° akton jeszcze wyżej), S6 (wyciskanie = seria pośrednia przedniego aktonu) —
  **umiarkowane**. Bez zmian.

### 2.5 Podciąganie / ściąganie drążka — biceps pomocniczy? **Tak.**
- Samo ściąganie drążka zwiększyło grubość zginaczy łokcia o 6,1–6,5% (S11, S12); wiosłowanie hantlem 5,2% vs 11,1% przy uginaniu (S13 —
  inny zespół) — przyrost mniej więcej o połowę, zgodny z liczeniem 0,5. S6 liczy ściągania i wiosłowania jako serie pośrednie bicepsa.
  **Mocne** dla ćwiczeń badanych wprost (Lat Pulldown, One Arm Row), **umiarkowane** dla pozostałych (wiosłowania — klasyfikacja S6
  lub analogia; podciągania — analogia do ściągania). Bez zmian.

### 2.6 Wyciskanie nad głowę — triceps pomocniczy? **Tak, ale tylko EMG + klasyfikacja.**
- S6: „Shoulder Press”, „Dumbbell Shoulder Press” = serie pośrednie tricepsa; EMG S15 bada triceps jako jeden z „prime movers” OHP.
  Nie znaleziono badania wzrostu tricepsa po samym OHP. **Umiarkowane**, bez zmian.

### 2.7 Hip thrust — dwugłowe pomocnicze? **Proponowane usunięcie (jedno źródło).**
- Pośladki rosną po hip thruście (S2, S5, przegląd S4) — **mocne**. Dwugłowe: S2 (MRI) — brak przyrostu w obu grupach. EMG pokazuje
  umiarkowaną aktywność dwugłowej (S25: średnio 40,8% MVIC; S17). Rozbieżność EMG ↔ wzrost rozstrzyga pomiar wzrostu, ale jest jeden —
  usunięcie oznaczone **„jedno źródło”** (Q3). Glute Bridge — analogia.

### 2.8 Wykroki — bez zmian
- Czworogłowe + pośladki główne: S6 (wykroki i przysiady bułgarskie = serie bezpośrednie czworogłowych), EMG: pośladek wielki > 60% MVIC
  (S18), „high to very high muscle activity occurs in the quadriceps, gluteus maximus, and gluteus medius … while moderate muscle activity
  occurs in the hamstrings” (S26). **Umiarkowane** (EMG + klasyfikacja). Brak badań wzrostu dla samych wykroków.

### 2.9 Suwnica (Leg Press) — bez zmian
- S3 (PT, MRI): wszystkie głowy szerokie czworogłowego rosną jak przy prostowaniu nóg, prosty uda nie (+1,1%); pośladek wielki +15,4%,
  przywodziciel wielki +6,2%. Przegląd S4 („leg press machines … can also facilitate increased GMax hypertrophy”). **Mocne.**
  Pośladki jako główna (większy przyrost względny niż czworogłowe) — jedno źródło, pytanie Q6.

### 2.10 Wiosłowania — bez zmian
- Plecy główne (najszerszy: anatomia S35, EMG S37), biceps pomocniczy (S13, S6). One Arm Row badany wprost (S13) — **mocne**; pozostałe
  wiosłowania — analogia lub klasyfikacja S6 — **umiarkowane**.

### 2.11 Wyprost tułowia (Back Extension) — dwugłowe do głównych
- Wyprost bioder na ławce 45° (to samo urządzenie) zwiększał objętość dwugłowej głowy długiej i półścięgnistego (S22, MRI: „HE training may be
  more effective for promoting hypertrophy in the BF LH”); EMG innego zespołu: dwugłowa 75–87% MVC (S23). **Propozycja:** główne plecy +
  dwugłowe, pomocnicze pośladki. **Umiarkowane** (wzrost — jeden zespół).

## 3. Źródła

Szczebel wg CLAUDE.md (1 wzory, 2 przeglądy/metaanalizy/stanowiska, 3 pojedyncze badania i książki, 4 serwisy, 5 praktyka).

- **S1** Kubo K, Ikebukuro T, Yata H. Effects of squat training with different depths on lower limb muscle volumes. Eur J Appl Physiol 2019.
  https://pubmed.ncbi.nlm.nih.gov/31230110/ (doi 10.1007/s00421-019-04181-y). **A**, szczebel 3 (RCT, MRI). „The volumes of knee extensor muscles
  significantly increased … whereas that of rectus femoris and hamstring muscles did not change in either group. The volumes of adductor and
  gluteus maximus muscles significantly increased in FST (6.2 ± 2.6% and 6.7 ± 3.5%) and HST (2.7 ± 3.1% and 2.2 ± 2.6%).”
- **S2** Plotkin DL i in. Hip thrust and back squat training elicit similar gluteus muscle hypertrophy and transfer similarly to the deadlift.
  Front Physiol 2023;14:1279170. https://pmc.ncbi.nlm.nih.gov/articles/PMC10593473/. **PT**, szczebel 3 (RCT, MRI). „Gluteus medius + minimus …
  and hamstrings [0.1 ± 0.6 cm2; CI95% (−0.9, 1.4)] mCSA demonstrated little to no growth”; „Thigh hypertrophy outcomes favored SQ in the adductors
  and quadriceps, with no meaningful growth in either group in the hamstrings”; „sEMG amplitudes could not reliably predict hypertrophic outcomes”.
- **S3** Kinoshita M, Maeo S i in. Hypertrophic Effects of Single- versus Multi-Joint Exercise: A Direct Comparison between Knee Extension and
  Leg Press. Med Sci Sports Exerc 2026. https://pmc.ncbi.nlm.nih.gov/articles/PMC13215645/. **PT**, szczebel 3 (MRI, 17 mięśni). „LP, but not KE,
  increased volumes of the gluteus maximus (+15.4%) and the adductor magnus (+6.2%)”; „Rectus femoris volume gains were greater for KE than LP
  (+13.2% vs +1.1%)”; „The biceps femoris long head, and consequently the HAM, exhibited slight but significant hypertrophy in both conditions
  (+1.5%–+5.3%)”; „the gluteus maximus is a primary hip extensor, not a knee extensor”.
- **S4** Krause Neto W, Krause TLV, Gama EF. The impact of resistance training on gluteus maximus hypertrophy: a systematic review and
  meta-analysis. Front Physiol 2025;16:1542334. https://pmc.ncbi.nlm.nih.gov/articles/PMC12018462/. **PT** (streszczenie, tab. 2, wyniki),
  szczebel 2. „4) back squats performed in parallel or full range of motion significantly enhance GMax hypertrophy; 5) leg press machines and
  kneeling hip extensions can also facilitate increased GMax hypertrophy”; „In two studies, the barbell hip thrust exercise trained alone
  significantly increased GMax”.
- **S5** Barbalho M, …, Gentil P. Back Squat vs. Hip Thrust Resistance-training Programs in Well-trained Women. Int J Sports Med 2020.
  https://pubmed.ncbi.nlm.nih.gov/31975359/. **A**, szczebel 3. „Both groups significantly increased hip extensors MT … quadriceps femoris
  (12.2% for BS and 2% for HT …) and gluteus maximus MT (9.4% for BS and 3.7% for HT …)”.
- **S6** Pelland JC, Remmert JF, Robinson ZP, Hinson S, Zourdos MC. The Resistance Training Dose-Response: Meta-Regressions… SportRχiv 2024
  (preprint), https://doi.org/10.51224/SRXIV.460 — **PT**, rozdz. 2.4 i tabela 1A; wersja opublikowana: Sports Med 2026;56(2):481–505,
  https://pubmed.ncbi.nlm.nih.gov/41343037/ — **A**. Szczebel 2 (klasyfikacja „not wholly objective”). „For hypertrophy, direct sets were those in
  which the measured muscle(s) was likely to be the primary force generator in the exercise. Indirect sets were those in which the measured
  muscle(s) was likely to be meaningfully trained but not the primary force generator of the exercise (i.e., synergist).” Tabela 1A: triceps —
  pośrednie: „Flat Bench Press, Incline Bench Press, Decline Bench Press, Shoulder Press, Dumbbell Shoulder Press, Incline Dumbbell Press,
  Incline Machine Press, Machine Press”, bezpośrednie m.in. „Close Grip Bench”; biceps — pośrednie: „Lat Pulldown, … Supine Grip Pulldown,
  … Seated Row, …, Bent-Over Barbell Row”; przedni akton — bezpośrednie „Barbell Shoulder Press, Barbell Shoulder Front Raise”, pośrednie „Bench
  Press, Chest Press, Barbell Close Grip Press On Bench”; czworogłowe — bezpośrednie „Back Squat, Leg Press, Dumbbell Lunge, Leg Extension, Hack
  Squat, … Bulgarian Split Squat”; dwugłowe — „Leg Curl”; klatka — „Bench Press, Flat Dumbbell Fly”.
- **S7** Lanza MB i in. Muscle hypertrophy response across four muscles involved in the bench press exercise. J Bodyw Mov Ther 2024;40:1417–1422.
  https://pubmed.ncbi.nlm.nih.gov/39593465/. **A**, szczebel 3 (RCT, MRI). „higher changes in CSA of the pectoralis major, pectoralis minor, anterior
  deltoid, and triceps brachii … than in the Control group … pectoralis major demonstrated larger increases in CSA than pectoralis minor and
  triceps brachii”.
- **S8** Ogasawara R, Yasuda T, Ishii N, Abe T. Comparison of muscle hypertrophy following 6-month of continuous and periodic strength training.
  Eur J Appl Physiol 2013;113(4):975–85. https://pubmed.ncbi.nlm.nih.gov/23053130/. **A**, szczebel 3 (MRI). Trening: „bench press exercise
  training”; „increases in cross-sectional area (CSA) of the triceps brachii and pectoralis major muscles … were similar between the two groups”.
- **S9** Kikuchi N, Nakazato K. Low-load bench press and push-up induce similar muscle hypertrophy and strength gain. J Exerc Sci Fit
  2017;15(1):37–42. https://pmc.ncbi.nlm.nih.gov/articles/PMC5812864/. **A**, szczebel 3 (RCT, USG). „Significant increases in 1RM and muscle
  thickness (triceps and pectoralis major) were observed in bench-press group … and in the push-up group”.
- **S10** Rodríguez-Ridao D i in. Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid,
  and Triceps Brachii during the Bench Press Exercise. Int J Environ Res Public Health 2020;17(19). https://pmc.ncbi.nlm.nih.gov/articles/PMC7579505/.
  **A**, szczebel 3 (EMG). „AD had the highest EMG activity at 60°. TB showed similar EMG activities at all bench inclinations … the horizontal
  bench press produces similar electromyographic activities for the pectoralis major and the anterior deltoid.”
- **S11** Gentil P i in. Effect of adding single-joint exercises to a multi-joint exercise resistance-training program… Appl Physiol Nutr Metab
  2013;38(3):341–4. https://pubmed.ncbi.nlm.nih.gov/23537028/. **A**, szczebel 3 (RCT, USG). Grupa MJ: „only MJ exercises (lat pulldown and bench
  press)”; „There was a significant (p < 0.05) increase in MT (6.5% for MJ and 7.04% for MJ+SJ)” [zginacze łokcia].
- **S12** Gentil P, Soares S, Bottaro M. Single vs. Multi-Joint Resistance Exercises: Effects on Muscle Strength and Hypertrophy. Asian J Sports
  Med 2015;6(2):e24057. https://pmc.ncbi.nlm.nih.gov/articles/PMC4592763/. **A**, szczebel 3 (RCT, USG). „only MJ exercises involving the elbow
  flexors (lat. pull downs) … There were significant increases in MT of 6.10% and 5.83% for MJ and SJ, respectively”.
- **S13** Mannarino P i in. Single-Joint Exercise Results in Higher Hypertrophy of Elbow Flexors Than Multijoint Exercise. J Strength Cond Res
  2021;35(10):2677–2681. https://pubmed.ncbi.nlm.nih.gov/31268995/. **A**, szczebel 3 (USG, w obrębie osoby). „Single-joint BC exercise resulted in
  higher hypertrophy of elbow flexors (11.06%) than the DR (5.16%) multijoint exercise” (DR = wiosłowanie hantlem jednorącz).
- **S14** Gentil P, Fisher J, Steele J. A Review of the Acute Effects and Long-Term Adaptations of Single- and Multi-Joint Exercises during
  Resistance Training. Sports Med 2017;47(5):843–855. https://pubmed.ncbi.nlm.nih.gov/27677913/. **A**, szczebel 2 (przegląd, 23 badania).
  „Long-term studies comparing increases in muscle size and strength in the upper limbs reported no difference between SJ and MJ exercises”;
  „For the lumbar extensors, the studies reviewed tend to support the view that this muscle group may benefit from SJ exercise.”
- **S15** Padovan R i in. High-Density Surface Electromyography Excitation in Front vs. Back Overhead Press Prime Movers. J Hum Kinet 2026.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC13551356/. **A**, szczebel 3 (EMG). „compared the spatial excitation of the prime movers when performing
  the overhead press … anterior deltoid, lateral deltoid, posterior deltoid, upper trapezius, pectoralis major and triceps brachii”.
- **S16** Martín-Fuentes I, Oliva-Lozano JM, Muyor JM. Electromyographic activity in deadlift exercise and its variants. A systematic review.
  PLoS One 2020;15(2):e0229507. https://pmc.ncbi.nlm.nih.gov/articles/PMC7046193/. **PT** (streszczenie, wstęp, tabele 1–2), szczebel 2 (EMG).
  Cytaty w 2.3; tab. 1: Camara 2016 — „Greater vastus lateralis activation; and lower biceps femoris and erector spinae activation during hexagonal
  bar deadlift”; Escamilla 2002 — „Greater vastus medialis, vastus lateralis and tibialis anterior activation during sumo deadlift”; McAllister 2014
  (RDL, good morning, leg curl) — „Greater semitendinosus activation than biceps femoris and erector spinae activation for all exercises”.
- **S17** Andersen V i in. Electromyographic Comparison of Barbell Deadlift, Hex Bar Deadlift, and Hip Thrust Exercises. J Strength Cond Res
  2018;32(3):587–593. https://pubmed.ncbi.nlm.nih.gov/28151780/. **A**, szczebel 3 (EMG, 1RM). „the barbell deadlift was clearly superior in
  activating the biceps femoris compared with the hex bar deadlift and hip thrust, whereas the hip thrust provided the highest gluteus maximus
  activation”; „No differences were displayed for the erector spinae activation”.
- **S18** Neto WK i in. Gluteus Maximus Activation during Common Strength and Hypertrophy Exercises: A Systematic Review. J Sports Sci Med
  2020;19(1):195–203. https://pmc.ncbi.nlm.nih.gov/articles/PMC7039033/. **A**, szczebel 2 (EMG). „very high level of GMax activation (>60% MVIC)
  were step-up, …, hex bar deadlift, …, traditional barbell hip thrust, …, belt squat, split squat, in-line lunge, traditional lunge, …,
  modified single-leg squat, conventional deadlift, and band hip thrust”.
- **S19** Crawford SK i in. Hamstrings Muscle Architecture and Morphology Following 6 wk of an Eccentrically Biased Romanian Deadlift or Nordic
  Hamstring Exercise Intervention. Med Sci Sports Exerc 2025;57(8):1799–1809. https://pubmed.ncbi.nlm.nih.gov/40085810/. **A**, szczebel 3 (RCT, USG).
  „Hamstrings ACSA increased after the intervention (0.78 cm 2 … (10%), P < 0.001) … There were no significant differences in ACSA between groups”.
- **S20** Morin T i in. Minimal Role of Hamstring Hypertrophy in Strength Transfer Between Nordic Hamstring and Stiff-Leg Deadlift. J Strength
  Cond Res 2025;39(9):924–932. https://pubmed.ncbi.nlm.nih.gov/40644669/ (oraz J Appl Physiol 2025, https://pubmed.ncbi.nlm.nih.gov/40586278/).
  **A**, szczebel 3 (RCT, USG 3D). „similar and significant whole hamstring hypertrophy was observed in both training groups (NHE: 11.4 ± 6.5%,
  and SDL: 7.0 ± 8.1%)”.
- **S21** Fisher J, Bruce-Low S, Smith D. A randomized trial to consider the effect of Romanian deadlift exercise on the development of lumbar
  extension strength. Phys Ther Sport 2013;14(3):139–45. https://pubmed.ncbi.nlm.nih.gov/23867152/. **A**, szczebel 3 (RCT, siła). „These data
  suggest that the Romanian deadlift does not enhance lumbar extension torque.”
- **S22** Bourne MN i in. Impact of the Nordic hamstring and hip extension exercises on hamstring architecture and morphology. Br J Sports Med
  2017;51(5):469–477. https://pubmed.ncbi.nlm.nih.gov/27660368/; Lazarczuk SL, …, Bourne MN. Scand J Med Sci Sports 2024,
  https://pubmed.ncbi.nlm.nih.gov/39297348/. **A**, szczebel 3 (RCT, MRI; jeden zespół). „HE training may be more effective for promoting hypertrophy
  in the BF LH”; „Change in muscle CSA following training was greatest in the mid-portion of semitendinosus for both intervention groups, and the
  mid-portion of BFlh for the hip extension group.”
- **S23** Zebis MK i in. Kettlebell swing targets semitendinosus and supine leg curl targets biceps femoris. Br J Sports Med 2013;47(18):1192–8.
  https://pubmed.ncbi.nlm.nih.gov/22736206/. **A**, szczebel 3 (EMG). „Kettlebell swing and Romanian deadlift targeted specifically ST over BF …
  at very high levels of normalised EMG (73-115% of MVC). In contrast, the supine leg curl and hip extension specifically targeted the BF over the
  ST … (75-87% of MVC).”
- **S24** McGill SM, Marshall LW. Kettlebell swing, snatch, and bottoms-up carry: back and hip muscle activation, motion, and low back loads.
  J Strength Cond Res 2012;26(1):16–27. https://pubmed.ncbi.nlm.nih.gov/21997449/. **A**, szczebel 3 (EMG). „(∼50% of a maximal voluntary
  contraction [MVC] for the low back extensors and 80% MVC for the gluteal muscles with a 16-kg kettlebell)”.
- **S25** Contreras B i in. A Comparison of Gluteus Maximus, Biceps Femoris, and Vastus Lateralis Electromyographic Activity in the Back Squat
  and Barbell Hip Thrust Exercises. J Appl Biomech 2015;31(6):452–8. https://pubmed.ncbi.nlm.nih.gov/26214739/. **A**, szczebel 3 (EMG). „mean
  (40.8% vs 14.9%) … biceps femoris EMG activity than the back squat”; „Longitudinal training studies are needed to determine if this enhanced
  activation correlates with increased strength, hypertrophy”.
- **S26** Escamilla RF i in. Effects of Step Length and Stride Variation During Forward Lunges on Lower-Extremity Muscle Activity. J Funct Morphol
  Kinesiol 2025;10(1):42. https://pmc.ncbi.nlm.nih.gov/articles/PMC11843896/. **PT**, szczebel 3 (EMG). „less effective for hypertrophy and
  strengthening of the hamstrings (approximately 20–30% MVIC)”; „high to very high muscle activity occurs in the quadriceps, gluteus maximus, and
  gluteus medius … while moderate muscle activity occurs in the hamstrings, gastrocnemius, and adductor longus”.
- **S27** Maeo S i in. Greater Hamstrings Muscle Hypertrophy but Similar Damage Protection after Training at Long versus Short Muscle Lengths.
  Med Sci Sports Exerc 2021;53(4):825–837. https://pmc.ncbi.nlm.nih.gov/articles/PMC7969179/. **A**, szczebel 3 (MRI). „Training-induced increases
  in muscle volume were greater in Seated-Leg versus Prone-Leg for the whole hamstrings (+14% vs +9%)”.
- **S28** Maeo S, …, Folland JP. Hamstrings Hypertrophy Is Specific to the Training Exercise: Nordic Hamstring versus Lengthened State Eccentric
  Training. Med Sci Sports Exerc 2024;56(10):1893–1905. https://pmc.ncbi.nlm.nih.gov/articles/PMC11419281/. **A**, szczebel 3 (MRI). „LSET induced
  greater increases in hamstrings (+18% vs +11%)” (LSET = uginanie na maszynie w zgięciu biodra; NHT = nordic).
- **S29** Maeo S i in. Triceps brachii hypertrophy is substantially greater after elbow extension training performed in the overhead versus
  neutral arm position. Eur J Sport Sci 2023;23(7):1240–1250. https://pubmed.ncbi.nlm.nih.gov/35819335/. **A**, szczebel 3 (MRI). „Whole-TB
  (+19.9% vs. +13.9%)” — prostowanie łokcia na wyciągu nad głową i przy tułowiu.
- **S30** Kinoshita M, Maeo S i in. Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training. Front Physiol
  2023;14:1272106. https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/. **A**, szczebel 3 (MRI). „Muscle volume significantly increased in all three
  muscles and the whole triceps surae for both legs …, except for the gastrocnemius muscles of the seated condition leg”.
- **S31** Larsen S i in. Dumbbell versus cable lateral raises for lateral deltoid hypertrophy. Front Physiol 2025.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC12277279/. **A**, szczebel 3 (USG). „lateral deltoid muscle thickness increased by 3.3%-4.6%”.
- **S32** Oliva-Lozano JM, Muyor JM. Core Muscle Activity During Physical Fitness Exercises: A Systematic Review. Int J Environ Res Public Health
  2020;17(12):4306. https://pmc.ncbi.nlm.nih.gov/articles/PMC7345922/. **PT** (wyniki), szczebel 2 (EMG). Mięsień prosty brzucha: „Front plank:
  ~78%; Side plank: ~75%”; wielodzielny: „the highest % MVIC were found during the bridge exercise and bird dog”; roll-out (≈ Ab Wheel) i brzuszki
  opisane w wynikach.
- **S33** Martuscello JM i in. Systematic review of core muscle activity during physical fitness exercises. J Strength Cond Res
  2013;27(6):1684–98. https://pubmed.ncbi.nlm.nih.gov/23542879/. **A**, szczebel 2 (EMG). „strength and conditioning specialists should focus on
  implementing multijoint free weight exercises, rather than core-specific exercises, to adequately train the core muscles”.
- **S34** McGill SM i in. Comparison of different strongman events: trunk muscle activation and lumbar spine motion, load, and stiffness.
  J Strength Cond Res 2009;23(4):1148–61. https://pubmed.ncbi.nlm.nih.gov/19528856/. **A**, szczebel 3 (EMG/biomechanika). Zadania: „the farmer's
  walk, super yoke, Atlas stone lift, suitcase carry …”; „The carrying events challenged different abilities than the lifting events”.
- **S35** Betts JG i in. Anatomy and Physiology 2e. OpenStax (Rice University), rozdz. 11.5 i 11.6.
  https://openstax.org/books/anatomy-and-physiology-2e/pages/11-5-muscles-of-the-pectoral-girdle-and-upper-limbs,
  https://openstax.org/books/anatomy-and-physiology-2e/pages/11-6-appendicular-muscles-of-the-pelvic-girdle-and-lower-limbs. **PT** (te podrozdziały),
  szczebel 3 (podręcznik). „The deltoid … is the major abductor of the arm, but it also facilitates flexing and medial rotation, as well as extension
  and lateral rotation”; „The biceps brachii, brachialis, and brachioradialis flex the forearm”; „The extensors are the triceps brachii and
  anconeus”; „The muscles that move the humerus inferiorly generally originate from middle or lower back (e.g., latissiumus dorsi)”; tab. 11.8,
  czworoboczny: „Elevates shoulders (shrugging); pulls shoulder blades together”; „The posterior muscles of the femur flex the lower leg but also aid
  in extending the thigh”; „The muscles of the anterior compartment of the thigh flex the thigh and extend the leg”; „the adductor magnus extends
  it”; „The muscles in the medial compartment of the thigh are responsible for adducting the femur at the hip”; tensor powięzi szerokiej „acts as
  a synergist of the gluteus medius … in flexing and abducting the thigh”; „the muscles of the posterior compartment of the lower leg are generally
  responsible for plantar flexion”.
- **S36** Intziegianni K i in. Electromyographic Activation of the Pectoralis Major and Triceps Brachii Muscles During Standard, Diamond, and Wide
  Hand Position Push-Ups. Muscles 2026;5(1):18. https://pmc.ncbi.nlm.nih.gov/articles/PMC13029269/. **A**, szczebel 3 (EMG). „Diamond push-ups
  elicited the highest relative activation for both the PM and TB.”
- **S37** Di Fonza D i in. Electromyographic Analysis of Latissimus Dorsi Activation During Common Resistance Training Exercises: A Narrative
  Review. J Funct Morphol Kinesiol 2026;11(3):315. https://pmc.ncbi.nlm.nih.gov/articles/PMC13510307/. **A**, przegląd narracyjny (EMG; traktowany
  jak szczebel 3). „The latissimus dorsi (LD) is a primary muscle involved in pulling exercises … for the lat pull-down, pullover, seated row, barbell
  row, bent-over row and pull-up”; „the inverted row produced the highest LD amplitude in a single, small preliminary study”.
- **S38** Bloomquist K i in. Effect of range of motion in heavy load squatting on muscle and tendon adaptations. Eur J Appl Physiol 2013.
  https://pubmed.ncbi.nlm.nih.gov/23604798/. **A**, szczebel 3 (RCT, MRI). „DS training resulted in superior increases in front thigh muscle CSA
  (4-7 %) compared to SS training”.

Przejrzane, ale niecytowane jako podstawa: Wei 2023 (Sci Rep, przysiad — mierzono pośladki i prosty uda, nie dwugłowe), Nigro & Bartolomei 2020
(przysiad vs martwy ciąg — tylko siła), Kotarsky 2018 (pompki — brak zmian grubości w 4 tyg.), Chigira 2025 (J Phys Ther Sci — **wycofany**, nie
użyty), Arin-Bal 2026 (przegląd dwugłowych — streszczenie ogólne). Nieprzeczytane: NSCA „Essentials” / „Exercise Technique Manual” (brak dostępu
do stron — nie cytowane), Gullett 2009 i Yavuz 2015 (przysiad przedni), Youdas 2010 (podciąganie), Escamilla 2002 (sumo — tylko przez S16).

## 4. Tabela: wszystkie ćwiczenia bazowe

Generowana z `24-przypisanie-partii.json` (125 pozycji, kolejność jak w `LIB_BASE`). Format: „główne / pomocnicze”. Notatki i rodzaj dowodu
dla każdego ćwiczenia — pola `note` i `evidence` w JSON. Pola JSON: `exercise` (nazwa w katalogu), `group`, `current` / `proposed`
(`primary`, `secondary`), `change` (zalecana / opcjonalna / brak), `sources` (id z sekcji 3), `confidence`, `analogy`, `evidence`, `note`.

| Ćwiczenie | Obecnie (główne / pomocnicze) | Propozycja | Zmiana | Źródła | Pewność |
|---|---|---|---|---|---|
| Bench Press (sztanga) | klatka / triceps + barki | bez zmian | brak | S7, S8, S9, S6, S10 | mocne |
| Bench Press (hantle) | klatka / triceps + barki | bez zmian | brak | S7, S8, S9, S6, S10 | umiarkowane (analogia) |
| Incline Bench Press (sztanga) | klatka / barki + triceps | bez zmian | brak | S10, S6, S7 | umiarkowane |
| Incline Bench Press (hantle) | klatka / barki + triceps | bez zmian | brak | S10, S6, S7 | umiarkowane |
| Decline Bench Press | klatka / triceps | bez zmian | brak | S6 | jedno źródło |
| Chest Fly (hantle) | klatka / — | bez zmian | brak | S6, S35 | umiarkowane |
| Cable Fly | klatka / — | bez zmian | brak | S6, S35 | umiarkowane (analogia) |
| Pec Deck | klatka / — | bez zmian | brak | S6, S35 | umiarkowane (analogia) |
| Machine Chest Press | klatka / triceps | klatka / triceps + barki | opcjonalna | S6, S7 | jedno źródło |
| Wyciskanie na linkach (stojąc) | klatka / triceps | bez zmian | brak | S6, S7 | brak źródła — uproszczenie (analogia) |
| Chest Dip | klatka / triceps | bez zmian | brak | S35 | brak źródła — uproszczenie |
| Push Up | klatka / triceps + barki | bez zmian | brak | S9, S36, S7 | umiarkowane |
| Incline Push Up | klatka / triceps | bez zmian | brak | S9 | jedno źródło (analogia) |
| Diamond Push Up | triceps / klatka | bez zmian | brak | S36 | jedno źródło |
| Deadlift (sztanga) | plecy + dwugłowe / pośladki + czworogłowe | dwugłowe + pośladki / plecy + czworogłowe | zalecana | S16, S17, S18, S19, S20, S21, S14 | umiarkowane |
| Deadlift (hantle) | plecy + dwugłowe / pośladki | dwugłowe + pośladki / plecy | zalecana | S16, S17, S18, S19, S20, S21 | umiarkowane (analogia) |
| Sumo Deadlift | pośladki + czworogłowe / plecy + dwugłowe | bez zmian | brak | S16, S18 | umiarkowane |
| Trap Bar Deadlift | czworogłowe + plecy / pośladki + dwugłowe | czworogłowe + pośladki / dwugłowe + plecy | zalecana | S16, S17, S18 | umiarkowane |
| RDL (sztanga) | dwugłowe / pośladki + plecy | bez zmian | brak | S19, S20, S16, S23, S21 | mocne |
| RDL (hantle/linki) | dwugłowe / pośladki + plecy | bez zmian | brak | S19, S20, S16 | umiarkowane (analogia) |
| Bent Over Row (sztanga) | plecy / biceps | bez zmian | brak | S6, S13, S37, S35 | umiarkowane |
| Bent Over Row (hantle) | plecy / biceps | bez zmian | brak | S13, S6, S37 | umiarkowane (analogia) |
| Pendlay Row | plecy / biceps | bez zmian | brak | S13, S6, S37 | umiarkowane (analogia) |
| One Arm Row (hantle) | plecy / biceps | bez zmian | brak | S13, S6, S37 | mocne |
| Chest Supported Row | plecy / biceps | bez zmian | brak | S13, S6, S37 | umiarkowane (analogia) |
| T-Bar Row | plecy / biceps | bez zmian | brak | S13, S6, S37 | umiarkowane (analogia) |
| Seated Cable Row | plecy / biceps | bez zmian | brak | S6, S13, S37 | umiarkowane |
| Wiosłowanie na linkach (siedząc) | plecy / biceps | bez zmian | brak | S6, S13, S37 | umiarkowane |
| Lat Pulldown | plecy / biceps | bez zmian | brak | S11, S12, S6, S37 | mocne |
| Straight Arm Pulldown | plecy / — | bez zmian | brak | S35, S37 | jedno źródło |
| Chin Up | plecy / biceps | bez zmian | brak | S11, S12, S6, S37 | umiarkowane (analogia) |
| Pull Up | plecy / biceps | bez zmian | brak | S11, S12, S6, S37 | umiarkowane (analogia) |
| Neutral Grip Pull Up | plecy / biceps | bez zmian | brak | S11, S12, S6, S37 | umiarkowane (analogia) |
| Inverted Row | plecy / biceps | bez zmian | brak | S13, S6, S37 | umiarkowane (analogia) |
| Face Pull | barki / plecy | bez zmian | brak | S35 | jedno źródło |
| Back Extension | plecy / pośladki + dwugłowe | plecy + dwugłowe / pośladki | zalecana | S22, S23, S14 | umiarkowane |
| Shrugs (hantle) | plecy / — | bez zmian | brak | S35 | jedno źródło |
| Shrugs (sztanga) | plecy / — | bez zmian | brak | S35 | jedno źródło |
| Good Morning | dwugłowe / plecy | bez zmian | brak | S16 | jedno źródło |
| Overhead Press (sztanga) | barki / triceps | bez zmian | brak | S6, S15 | umiarkowane |
| Overhead Press (hantle) | barki / triceps | bez zmian | brak | S6, S15 | umiarkowane |
| Seated Shoulder Press (hantle) | barki / triceps | bez zmian | brak | S6, S15 | umiarkowane |
| Arnold Press | barki / triceps | bez zmian | brak | S6, S15 | umiarkowane (analogia) |
| Push Press | barki / triceps + czworogłowe | bez zmian | brak | S6, S15 | brak źródła — uproszczenie |
| Machine Shoulder Press | barki / triceps | bez zmian | brak | S6, S15 | umiarkowane (analogia) |
| Wyciskanie nad głowę (linki) | barki / triceps | bez zmian | brak | S6, S15 | umiarkowane (analogia) |
| Lateral Raise (hantle) | barki / — | bez zmian | brak | S31, S35 | umiarkowane |
| Cable Lateral Raise | barki / — | bez zmian | brak | S31, S35 | umiarkowane |
| Front Raise | barki / — | bez zmian | brak | S6, S35 | umiarkowane |
| Rear Delt Raise (hantle) | barki / — | bez zmian | brak | S35 | jedno źródło |
| Reverse Fly (hantle) | barki / — | bez zmian | brak | S35 | jedno źródło |
| Reverse Pec Deck | barki / — | bez zmian | brak | S35 | jedno źródło |
| Upright Row | barki / plecy + biceps | bez zmian | brak | S35 | jedno źródło |
| Biceps Curl (hantle) | biceps / — | bez zmian | brak | S12, S13, S6, S35 | mocne |
| Barbell Curl | biceps / — | bez zmian | brak | S12, S13, S6, S35 | mocne |
| EZ Bar Curl | biceps / — | bez zmian | brak | S12, S13, S6, S35 | mocne |
| Hammer Curl | biceps / — | bez zmian | brak | S12, S13, S6, S35 | mocne |
| Incline Curl (hantle) | biceps / — | bez zmian | brak | S12, S13, S6, S35 | mocne |
| Concentration Curl (hantle) | biceps / — | bez zmian | brak | S12, S13, S6 | umiarkowane (analogia) |
| Preacher Curl | biceps / — | bez zmian | brak | S12, S13, S6, S35 | mocne |
| Spider Curl | biceps / — | bez zmian | brak | S12, S13, S6 | umiarkowane (analogia) |
| Cable Curl | biceps / — | bez zmian | brak | S12, S13, S6 | umiarkowane (analogia) |
| Skullcrusher (hantle) | triceps / — | bez zmian | brak | S6, S29, S35 | umiarkowane |
| Skullcrusher (EZ) | triceps / — | bez zmian | brak | S6, S29, S35 | umiarkowane |
| Triceps Dips (ławka) | triceps / klatka | bez zmian | brak | S35 | brak źródła — uproszczenie |
| Triceps Pushdown | triceps / — | bez zmian | brak | S29, S6, S35 | mocne |
| Overhead Triceps Extension (hantel) | triceps / — | bez zmian | brak | S29, S6, S35 | mocne |
| Cable Overhead Extension | triceps / — | bez zmian | brak | S29, S6, S35 | mocne |
| Close Grip Bench Press | triceps / klatka | bez zmian | brak | S6 | jedno źródło |
| Triceps Kickback | triceps / — | bez zmian | brak | S6, S29, S35 | umiarkowane |
| Back Squat | czworogłowe / pośladki + dwugłowe | czworogłowe / pośladki | zalecana | S1, S2, S38, S4, S5, S6 | mocne |
| Front Squat | czworogłowe / pośladki + core | bez zmian | brak | S1, S2, S33 | umiarkowane (analogia) |
| Goblet Squat | czworogłowe / pośladki | bez zmian | brak | S1, S2, S6 | umiarkowane (analogia) |
| Przysiad z pasem (linki) | czworogłowe / pośladki | bez zmian | brak | S1, S2, S18 | umiarkowane (analogia) |
| Box Squat | czworogłowe / pośladki | bez zmian | brak | S1, S2, S6 | umiarkowane (analogia) |
| Hack Squat | czworogłowe / pośladki | bez zmian | brak | S1, S2, S6 | umiarkowane (analogia) |
| Leg Press | czworogłowe / pośladki | bez zmian | brak | S3, S4, S6 | mocne |
| Bulgarian Split Squat (hantle) | czworogłowe + pośladki / dwugłowe | czworogłowe + pośladki / — | zalecana | S26, S18, S6 | umiarkowane |
| Lunges (hantle) | czworogłowe + pośladki / — | bez zmian | brak | S6, S18, S26 | umiarkowane |
| Walking Lunges | czworogłowe + pośladki / — | bez zmian | brak | S6, S18, S26 | umiarkowane |
| Reverse Lunge | czworogłowe + pośladki / — | bez zmian | brak | S6, S18, S26 | umiarkowane |
| Step Up | czworogłowe + pośladki / — | bez zmian | brak | S18, S35 | umiarkowane |
| Leg Extension | czworogłowe / — | bez zmian | brak | S3, S6 | mocne |
| Leg Curl | dwugłowe / — | bez zmian | brak | S27, S28, S6 | mocne |
| Lying Leg Curl | dwugłowe / — | bez zmian | brak | S27, S28, S6 | mocne |
| Nordic Curl | dwugłowe / — | bez zmian | brak | S28, S22, S20 | mocne |
| Pistol Squat | czworogłowe / pośladki | bez zmian | brak | S18 | jedno źródło (analogia) |
| Sissy Squat | czworogłowe / — | bez zmian | brak | S35 | jedno źródło |
| Wall Sit | czworogłowe / — | bez zmian | brak | S35 | jedno źródło |
| Hip Thrust (sztanga) | pośladki / dwugłowe | pośladki / — | zalecana | S2, S4, S5, S25 | jedno źródło |
| Hip Thrust (hantel) | pośladki / dwugłowe | pośladki / — | zalecana | S2, S4 | jedno źródło (analogia) |
| Glute Bridge | pośladki / dwugłowe | pośladki / — | zalecana | S2, S4 | jedno źródło (analogia) |
| Cable Kickback | pośladki / — | bez zmian | brak | S4, S35 | jedno źródło (analogia) |
| Hip Abduction | pośladki / — | bez zmian | brak | S35 | jedno źródło |
| Hip Adduction | przywodziciele / — | bez zmian | brak | S35 | jedno źródło |
| Kettlebell Swing | pośladki + dwugłowe / plecy | bez zmian | brak | S23, S24 | umiarkowane |
| Standing Calf Raise | łydki / — | bez zmian | brak | S30, S35 | umiarkowane |
| Seated Calf Raise | łydki / — | bez zmian | brak | S30, S35 | umiarkowane |
| Łydki na stopniu | łydki / — | bez zmian | brak | S30, S35 | umiarkowane (analogia) |
| Calf Press (leg press) | łydki / — | bez zmian | brak | S30, S35 | umiarkowane (analogia) |
| Plank | core / — | bez zmian | brak | S32, S33 | umiarkowane |
| Side Plank | core / — | bez zmian | brak | S32, S33 | umiarkowane |
| Dead Bug | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Bird Dog | core / — | bez zmian | brak | S32, S33 | umiarkowane |
| Ab Wheel | core / — | bez zmian | brak | S32, S33 | umiarkowane |
| Pallof Press | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Hanging Leg Raise | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Hanging Knee Raise | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Cable Crunch | core / — | bez zmian | brak | S32 | jedno źródło (analogia) |
| Crunch | core / — | bez zmian | brak | S32, S33 | umiarkowane |
| Reverse Crunch | core / — | bez zmian | brak | S32 | jedno źródło (analogia) |
| Russian Twist | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Hollow Hold | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Farmer's Walk | przedramiona + plecy / core | bez zmian | brak | S34 | brak źródła — uproszczenie |
| Suitcase Carry | core / przedramiona | bez zmian | brak | S34 | jedno źródło |
| Mountain Climbers | core / — | bez zmian | brak | — | brak źródła — uproszczenie |
| Incline Walk (bieżnia) | — / — | bez zmian | brak | — | nie dotyczy |
| Bieg | — / — | bez zmian | brak | — | nie dotyczy |
| Rower | — / — | bez zmian | brak | — | nie dotyczy |
| Rowing Machine | — / — | bez zmian | brak | — | nie dotyczy |
| Assault Bike | — / — | bez zmian | brak | — | nie dotyczy |
| Skakanka | — / — | bez zmian | brak | — | nie dotyczy |
| Burpees | — / — | bez zmian | brak | — | nie dotyczy |
| Box Jump | — / — | bez zmian | brak | — | nie dotyczy |
| Medicine Ball Slam | — / — | bez zmian | brak | — | nie dotyczy |

## 5. Podsumowanie

### 5.1 Liczby
- Ćwiczeń bazowych: **125** (z tego 9 cardio bez partii).
- Przypisanie oparte na przeczytanym źródle (pewność „mocne”, „umiarkowane” lub „jedno źródło”): **104** — w tym 71 bezpośrednio, 33 przez analogię do badanego wariantu.
- Pewność: mocne 19, umiarkowane 59, jedno źródło 26, brak źródła — uproszczenie 12, nie dotyczy 9.
- Zmiany: zalecane **9**, opcjonalne 1, bez zmian 115.
- Użyte źródła: 38 (S1–S38).

### 5.2 Zmiany zalecane (9) i opcjonalna (1)
| Ćwiczenie | Obecnie | Propozycja | Podstawa | Pewność |
|---|---|---|---|---|
| Back Squat | czworogłowe / pośladki + dwugłowe | czworogłowe / pośladki | S1, S2 (MRI, 2 zespoły) | mocne |
| Bulgarian Split Squat (hantle) | czworogłowe + pośladki / dwugłowe | czworogłowe + pośladki / — | S26 (EMG), spójność z wykrokami | umiarkowane |
| Hip Thrust (sztanga), Hip Thrust (hantel), Glute Bridge | pośladki / dwugłowe | pośladki / — | S2 (MRI); EMG S25 — rozbieżność | jedno źródło |
| Deadlift (sztanga) | plecy + dwugłowe / pośladki + czworogłowe | dwugłowe + pośladki / plecy + czworogłowe | S16–S21, S14 | umiarkowane |
| Deadlift (hantle) | plecy + dwugłowe / pośladki | dwugłowe + pośladki / plecy | jak wyżej (analogia) | umiarkowane |
| Trap Bar Deadlift | czworogłowe + plecy / pośladki + dwugłowe | czworogłowe + pośladki / dwugłowe + plecy | S16, S17, S18 (EMG) | umiarkowane |
| Back Extension | plecy / pośladki + dwugłowe | plecy + dwugłowe / pośladki | S22 (MRI), S23 (EMG) | umiarkowane |
| Machine Chest Press (opcjonalna) | klatka / triceps | klatka / triceps + barki | S6 (spójność z wyciskaniem) | jedno źródło |

### 5.3 Skutki dla kodu (dla wdrażającego — wymagają testów)
- **catalog-v2** (`tests/catalog-v2.test.ts`: główna ↔ region z wagą 1, pomocnicza ↔ ≥ 0,5): po zmianie partii `muscleLoad` w catalog.json musi
  mieć glutes = 1 dla Deadlift (sztanga), Deadlift (hantle) i Trap Bar (dziś 0,5) oraz hamstrings = 1 dla Back Extension (dziś 0,5). Usunięcia pomocniczych
  testu nie łamią, ale `muscleLoad` hamstrings 0,5 przy Back Squat, Box Squat, Bulgarian Split Squat, Hip Thrust ×2, Glute Bridge przeczy tym samym
  źródłom (mapa, regeneracja) — kandydat do 0,25 (Q4).
- **Migracja zapisanych danych:** wzorem `LIB_MUSCLE_FIXES` (lib/seed.ts) — tylko gdy zapisane partie są dokładnie dawnymi domyślnymi.
- **Generator (lib/generator.ts):** sloty wybierają ćwiczenie po pierwszej partii głównej (`P('hinge','plecy')`, `P('hinge','dwugłowe')`). Po samej
  zmianie partii slot „hingeBack” wybiera **Back Extension** jako pierwszy bój FBW B / Dół B (jedyny zawias z „plecy” na pierwszym miejscu), a slot
  „hingeHam” — martwy ciąg zamiast RDL. Trzeba zmienić definicję slotów (np. martwy ciąg = zawias z dwugłowymi i pośladkami głównymi, RDL = zawias
  z dwugłowymi bez pośladków). Symulacja (przepisana logika generatora w Pythonie, bez miejsca, 60 min; to przybliżenie, nie wynik aplikacji):
  - masa 4×/tydz.: obecnie ostrzeżenie „dzień po dniu” 1 para (plecy, Góra B → Dół B); po zmianie partii **bez** poprawki slotów — nadal 1 para
    (Back Extension); po zmianie partii **z** poprawką — 0 par, ćwiczenia jak dziś;
  - masa 6×/tydz.: obecnie 2 pary (plecy) → z poprawką 0;
  - siła 4×/tydz.: 1 para → z poprawką 0;
  - masa 3×/tydz. (FBW): dwugłowe tygodniowo 7,5 → 3 serie (zostają poniżej 10, jak dziś) — wcześniejsze 7,5 pochodziło z 0,5 serii z przysiadu
    i przysiadu bułgarskiego; generator pokazuje teraz brak uczciwiej.
- **swap.ts** (punkt za tę samą pierwszą partię) — kolejność w JSON jest celowa: martwy ciąg zaczyna się od „dwugłowe” (jak RDL).
- **lib/plan.ts** (regeneracja) czyta partie główne szablonów — mniej fałszywych par „plecy” po zmianie martwego ciągu.

## 6. Pytania otwarte

- **Q1. Przywodziciele w ćwiczeniach złożonych** (decyzja właściciela z 04.10 do ponownego rozważenia; dowód mocny):
  - A) „przywodziciele” pomocnicze dla wszystkich przysiadów i suwnicy — pełniejsza statystyka; analogia dla wariantów niebadanych;
  - B) tylko Back Squat i Leg Press (wzrost zmierzony: S1, S2, S3) — zgodne ze źródłami, mniej ćwiczeń;
  - C) bez zmian (przywodziciele tylko w `muscleLoad`, poza seriami) — statystyka zaniża przywodzicieli.
  - **Rekomendacja: B.** Partia nie jest na liście `MAJOR` generatora, więc nie wywoła ostrzeżeń „poniżej 10”.
- **Q2. Martwy ciąg klasyczny** — brak badań wzrostu (prostowniki, pośladki, dwugłowe, czworogłowe). Propozycja z sekcji 2.3 jest uproszczeniem
  opartym na EMG i ćwiczeniach pokrewnych; do weryfikacji, gdy pojawi się badanie z MRI.
- **Q3. Hip thrust / mostek a dwugłowe** — jedno badanie wzrostu (S2) przeciw umiarkowanemu EMG (S25). Opcje: A) usunąć (rek., pomiar wzrostu >
  EMG), B) zostawić z dopiskiem „jedno źródło”.
- **Q4. `muscleLoad` (mapa, regeneracja)** — hamstrings 0,5 przy przysiadach, przysiadzie bułgarskim i hip thruście przeczy S1, S2 (S26 — EMG);
  kandydat 0,25. Osobny zestaw danych (catalog.json) — poza zakresem tego dokumentu.
- **Q5. Kandydaci na spójność, bez zmian teraz:** „barki” pomocnicze przy Machine Chest Press (opcjonalna, S6), Wyciskanie na linkach, Close Grip
  Bench (S6: pośrednia przedniego aktonu); „przedramiona” przy Hammer Curl (brak źródła wzrostu).
- **Q6. Suwnica:** pośladki +15,4% wobec czworogłowych +4,9% (S3) — czy pośladki powinny być główną? Jedno źródło — bez zmiany.
- **Q7. Pewność „brak źródła — uproszczenie” (12):** Wyciskanie na linkach (stojąc) (tylko analogia), Chest Dip i Triceps Dips (ławka) (tylko
  anatomia, bez źródła podziału główna/pomocnicza), Push Press (czworogłowe), Farmer's Walk (przedramiona + plecy) oraz Dead Bug, Pallof Press,
  Hanging Leg Raise, Hanging Knee Raise, Russian Twist, Hollow Hold, Mountain Climbers (żadnego przeczytanego źródła) — zostają jako nazwane
  uproszczenia.
- **Q8. Głębokość i technika** — wzrost pośladków i przywodzicieli zależy od głębokości przysiadu (S1, S38), a podział pracy w martwym ciągu od
  techniki; aplikacja tego nie wie. Przypisanie jest uproszczeniem dla typowej techniki (przysiad co najmniej do równoległej).
- **Q9. Rejestr decyzji (Google Drive, „03 Rejestr decyzji”)** — po akceptacji wpisać zmiany z sekcji 5.2 z odrzuconymi alternatywami
  (2.3, Q1, Q3). Zgodnie z decyzją E4 B: dopisek na ekranie ćwiczenia „przypisanie partii — uproszczenie” zostaje, a pole `confidence`
  pozwala pokazać, które przypisania mają źródła.

## 7. Czego nie da się potwierdzić (nie wchodzi do aplikacji jako fakt)
- Wzrostu prostowników grzbietu po martwym ciągu i wiosłowaniu w opadzie; wzrostu tricepsa po samym wyciskaniu nad głowę; wzrostu przedniego
  aktonu przy wyciskaniu poza jednym badaniem (S7); wzrostu mięśni brzucha po ćwiczeniach core (tylko EMG).
- Że EMG przekłada się na wzrost (S2: nie przewiduje).
- Dokładnej „wagi” serii pomocniczej dla konkretnego ćwiczenia — 0,5 to reguła z metaanalizy dla wszystkich serii pośrednich (S6), nie pomiar
  dla każdego ćwiczenia.
