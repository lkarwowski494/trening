# 33 — Wskazówki techniki, partia 2 (32 ćwiczenia z „BRAK” w docs/31): źródła i propozycje

Data: 12.10.2026. Autor: badacz merytoryczny (agent). Decyzja właściciela 11–12.10.2026: badacz, bez Gemini.
Zakres: 32 ćwiczenia z tabeli „BRAK — do następnej partii” w `docs/research/31-wskazowki-partia1.md`.

**Status: PROPOZYCJA — nic nie jest jeszcze w `lib/`.** Wdrożenie (dane w `lib/cues/data.json`, teksty w `lib/cues/text/pl.json`,
`scripts/cues/gen.mjs`) robi programista po akceptacji. Teksty angielskie — tłumacz.

## Metoda

Jak w `docs/research/27-wskazowki-zrodla.md` („Zasady”, „Organizacje i szczeble”) i w docs/31:

- każda wskazówka ma co najmniej 2 przeczytane źródła z RÓŻNYCH organizacji; miejsce w źródle podane;
- źródło o innym ćwiczeniu = „analogia”, nie liczy się; wariant tego samego ćwiczenia (inny sprzęt, siedząc/stojąc, jednonóż/obunóż)
  liczy się, z opisem „(wariant: …)”;
- sformułowania własne, tylko część wspólna źródeł, bez twierdzeń medycznych (uzasadnienia typu „chroni kolana” ze źródeł pomijamy);
- cytat dla weryfikacji najwyżej 1 zdanie; gdzie narzędzie zwróciło tylko parafrazę — „(parafraza)” i dokładne miejsce;
- ćwiczenie bez co najmniej 2 wskazówek z dwoma źródłami każda → „BRAK”.

### Dostęp do źródeł w tej sesji (ważne)

- **ExRx.net nadal niedostępny**: exrx.net → 403, `web.archive.org` zablokowany przez narzędzie (sprawdzone ponownie 12.10.2026).
- Niedostępne (403/503/404): Royal Navy „Get fit to join”, Catalyst Athletics (503), Life Fitness support, strony bloga Assault Fitness (404),
  armypubs.army.mil (ATP 7-22.02, 503), Hammer Strength HD Air Bike (instrukcja — 403). Nie są źródłami w tej partii.
- Biblioteka ACE czytana przez adresy `…/exercise-library/<nr>/` (lista numerów z mapy strony `acefitness.org/sitemap.xml`);
  część stron ACE nie ma opisu (tylko wideo): 155 Standing Hip Abduction, 183 Seated Leg Extension.
- Strony aplikacji i sklepów treningowych z wyników wyszukiwania pominięto (szczebel poniżej 4, treści konkurencji) — nie zapisano ich nigdzie.

## Nowe organizacje (propozycja do tabeli „Organizacje i szczeble”)

| Skrót | Organizacja | Szczebel | Rodzaj (podpis w aplikacji) | Uwagi |
|---|---|---|---|---|
| NSCA ETM | NSCA — „Exercise Technique Manual for Resistance Training”, 3. wyd. (Human Kinetics); fragment przedrukowany przez Coaches Association of Ontario | 3 | książka organizacji szkoleniowo-naukowej | czytany przedruk, nie oryginał (strona Human Kinetics z tym fragmentem już nie działa) — [OTWARTE] czy przedruk wystarcza |
| HKU CSE | Centre for Sports and Exercise, The University of Hong Kong — karty ćwiczeń (PDF) | 4 (PROPOZYCJA) | materiały uczelnianego centrum sportu | bez autora i daty; jeśli audytor uzna za szczebel 5 — patrz „Ryzyka” |
| Western SRS | Western University (Kanada), Sport and Recreation Services — „Equipment Guides” | 4 (PROPOZYCJA) | materiały uczelnianego centrum sportu | bez autora i daty; jak wyżej |
| Sussexsport | University of Sussex, Sussexsport — karta „Ab Wheel Roll Out” (2012) | 4 (PROPOZYCJA) | materiały uczelnianego centrum sportu | jak wyżej |
| HSS | Hospital for Special Surgery — „Move Better Feel Better” (A. Karp, MS, ATC, 2020) | 4 | materiał edukacyjny szpitala specjalistycznego | |
| WebMD Ignite | treści dla pacjentów (wyd. WebMD Ignite), publikowane przez UMass Memorial Health | 4 (PROPOZYCJA) | materiał edukacyjny dla pacjentów | wydawca medyczny, bez recenzenta na stronie |
| Life Fitness | Life Fitness — Education Hub (blog producenta, 2024) | 4 | producent sprzętu | |
| NordicTrack | NordicTrack (iFIT) — blog producenta bieżni (2025) | 4 | producent sprzętu | |
| DAN | Divers Alert Network — „Alert Diver” (J. B. Adams, PhD, 2025) | 4 (PROPOZYCJA) | artykuł edukacyjny organizacji non-profit | organizacja spoza fitnessu — do decyzji audytora |
| Tsartsapakis i in. (Aristotle University of Thessaloniki) | protokół treningowy, Methods Protoc 2025 | 3 | badanie (czasopismo recenzowane) | |
| Plotkin i in. (CUNY Lehman College; zespół Schoenfelda) | badanie, PeerJ 2022 | 3 | badanie (czasopismo recenzowane) | Hermann i in. 2026 — ten sam zespół, NIE niezależny |
| Ghigiarelli i in. (Hofstra University) | badanie, Sensors 2026 | 3 | badanie (czasopismo recenzowane) | |
| Kinoshita i in. (Ritsumeikan University) | RCT, Front Physiol 2023 | 3 | badanie (czasopismo recenzowane) | |
| Hasani i in. (Monash University) | badanie pilotażowe, BMC Sports Sci Med Rehabil 2021 | 3 | badanie (czasopismo recenzowane) | dotyczy rehabilitacji — użyty tylko opis wykonania |
| Bini, Hume, Croft (Auckland University of Technology) | przegląd, Sports Med 2011 (abstrakt) | 2 | przegląd (czasopismo recenzowane) | |
| Moore (Cardiff Metropolitan University) | przegląd, Sports Med 2016 | 2 | przegląd (czasopismo recenzowane) | |
| Folland i in. (Loughborough University) | badanie, Med Sci Sports Exerc 2017 | 3 | badanie (czasopismo recenzowane) | |
| Berling i in. (University of Wisconsin–La Crosse) | badanie, J Cardiopulm Rehabil 2006 (abstrakt) | 3 | badanie (czasopismo recenzowane) | |
| de Oliveira i in. (Federal University of Paraná) | badanie, Sci Rep 2020 | 3 | badanie (czasopismo recenzowane) | |
| Hofmann i in. (Cybex Research Institute) | badanie, Int J Exerc Sci 2014 (abstrakt) | 3 | badanie (czasopismo recenzowane) | instytut producenta (Cybex → Life Fitness) — nie liczę go razem z Life Fitness jako dwóch niezależnych |
| Stien, Saeterbakken, Andersen (Western Norway Univ. of Applied Sciences) | badanie EMG, J Sports Sci Med 2021 | 3 | badanie (czasopismo recenzowane) | ta sama uczelnia co Andersen 2021 z docs/31 |
| Krobot Cutura i in. (University of Zagreb, Faculty of Kinesiology) | badanie, IJERPH 2024 | 3 | badanie (czasopismo recenzowane) | użyte tylko do Wall Sit (uzupełnienie partii 1) |

## Nowe źródła (propozycja wpisów `sources`)

| Id (propozycja) | Org | Tytuł / miejsce | URL |
|---|---|---|---|
| ace-182 | ACE | Overhead Slams (#182) | https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/ |
| ace-104 | ACE | Standing Hip Adduction (#104) | https://www.acefitness.org/resources/everyone/exercise-library/104/standing-hip-adduction/ |
| ace-309 | ACE | Roll Out (#309, ze sztangą) | https://www.acefitness.org/resources/everyone/exercise-library/309/roll-out/ |
| ace-331 | ACE | Standing Crunch (#331, wyciąg) | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ |
| ace-fitfacts-rope | ACE | Fit Facts: „Jumping Rope: Not Just for Kids Anymore” (2009) | https://contentcdn.eacefitness.com/assets/education-resources/lifestyle/fitfacts/pdfs/fitfacts/itemid_2688.pdf |
| nasm-calf-blog | NASM | H. Cherry, Calf Training… (blog, akt. 25.07.2026) | https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients |
| nasm-running-gait | NASM | B. Sutton, Running Gait Basics… (blog, akt. 29.06.2026) | https://www.nasm.org/resource-center/blog/training/running-gait-basics-what-personal-trainers-should-screen-for |
| nasm-best-abs | NASM | już w docs/31 (Hanging Knee Raise, Ab Wheel Rollout — sekcje sprawdzone ponownie 12.10.2026) | https://www.nasm.org/resource-center/blog/training/best-abs-exercises |
| nsca-etm-urow | NSCA ETM | Upright Row (przedruk: Coaches Association of Ontario, 04.12.2020) | https://www.coachesontario.ca/articles/breaking-down-the-upright-row/ |
| hku-fhsc-chest | HKU CSE | exercises-FHSC-Chest.pdf, s. 2 Pectoral Flye | https://www.cse.hku.hk/document/exercises-FHSC-Chest.pdf |
| hku-fhsc-abs | HKU CSE | exercises-FHSC-Abs.pdf, s. 3 Leg Raises (krzesło z podparciem przedramion) | https://www.cse.hku.hk/document/exercises-FHSC-Abs.pdf |
| hku-active-abs | HKU CSE | exercises-Active-Abs.pdf, s. 1 Abdominal (maszyna) | https://cse.hku.hk/document/exercises-Active-Abs.pdf |
| hku-shsc-legs | HKU CSE | exercises-SHSC-GlutesQuadsHipHamstrings.pdf, s. 2 Leg Extension, s. 4 Cable Hip „Flexion” (wykopy w tył), s. 6 Cable Hip „Abduction” (przywodzenie) | https://www.cse.hku.hk/document/exercises-SHSC-GlutesQuadsHipHamstrings.pdf |
| hku-active-legs | HKU CSE | exercises-Active-GlutesQuadsHip.pdf, s. 1 Leg Extension, s. 4 Standing Hip Extension | https://cse.hku.hk/document/exercises-Active-GlutesQuadsHip.pdf |
| hku-shsc-calf | HKU CSE | exercises-SHSC-Calf.pdf, s. 1 Calf Raise (siedząc) | https://cse.hku.hk/document/exercises-SHSC-Calf.pdf |
| western-legs | Western SRS | Equipment Guides — Legs (Leg Extensions; Seated Calf Raise) | https://uwo.ca/campusrec/orientation/equipment_guides/legs.html |
| western-chest | Western SRS | Equipment Guides — Chest (Pec-Delt Fly) | https://uwo.ca/campusrec/orientation/equipment_guides/chest.html |
| western-abs | Western SRS | Equipment Guides — Abs (Captain's Chair) | https://uwo.ca/campusrec/orientation/equipment_guides/abs.html |
| western-fm | Western SRS | Equipment Guides — Free-Motion Transmissions (FM Hamstring — wersja na pośladki; FM Abs) | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html |
| western-hips | Western SRS | Equipment Guides — Hips and Glutes (Hip Abductions/Adductions; LF Hip and Glute) | https://uwo.ca/campusrec/orientation/equipment_guides/hips_and_glutes.html |
| western-cardio | Western SRS | Equipment Guides — Cardio (Stationary Bike) | https://uwo.ca/campusrec/orientation/equipment_guides/cardio.html |
| sussex-abwheel | Sussexsport | Level Nine: Ab Wheel Roll Out (PDF, 2012) | https://www.sussex.ac.uk/sport/documents/ab-wheel-roll-out.pdf |
| hss-bike | HSS | A. Karp, How to Set Up an Exercise (or Spin) Bike Properly (21.12.2020) | https://www.hss.edu/health-library/move-better/set-up-exercise-bike |
| c2-bikeerg-setup | Concept2 | Setting Up the BikeErg | https://www.concept2.nl/en/node/8909 |
| webmd-ignite-urow | WebMD Ignite | Upper Body Exercises: Upright Row (UMass Memorial Health) | https://www.ummhealth.org/health-library/upper-body-exercises-upright-row |
| lifefitness-rails | Life Fitness | Is Treadmill Calorie Burn Affected by Holding the Handrails? (29.07.2024) | https://lifefitness.com/en-us/customer-support/education-hub/blog/treadmill-calorie-burn-affected-holding-handrails |
| nordictrack-incline | NordicTrack | Incline treadmill benefits… (15.07.2025) | https://www.nordictrack.com/learn/incline-treadmill-benefits-why-it-works-better-than-flat-walking |
| dan-rope | DAN | J. B. Adams, L. Adams, Jump Rope Training, Alert Diver Q3 2025 | https://dan.org/?p=53939 |
| pmc-12286126 | Tsartsapakis i in. | Development and Implementation of a Core Training Protocol…, Methods Protoc 2025, sekcja 3.2 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/ |
| pmc-9528903 | Plotkin i in. | Progressive overload without progressing load?…, PeerJ 2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9528903/ |
| pmc-13517625 | Ghigiarelli i in. | Concurrent Validity… (MR EMG)… During the Leg Extension Exercise, Sensors 2026 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13517625/ |
| pmc-10753835 | Kinoshita i in. | Triceps surae muscle hypertrophy is greater after standing versus seated calf-raise training, Front Physiol 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/ |
| pmc-8152048 | Hasani i in. | LOAD-intensity and time-under-tension… feasibility, BMC Sports Sci Med Rehabil 2021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8152048/ |
| pmc-7919354 | Stien i in. | Electromyographic Comparison of Five Lower-Limb Muscles…, J Sports Sci Med 2021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7919354/ |
| pmc-4887549 | Moore | Is There an Economical Running Technique?…, Sports Med 2016 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4887549/ |
| pmc-5473370 | Folland i in. | Running Technique is an Important Component of Running Economy and Performance, MSSE 2017 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5473370/ |
| bini-2011 | Bini, Hume, Croft | Effects of bicycle saddle height on knee injury risk and cycling performance, Sports Med 2011, doi:10.2165/11588740-000000000-00000 (abstrakt, Europe PMC) | https://europepmc.org/article/MED/21615188 |
| berling-2006 | Berling i in. | …handrail support on oxygen uptake during steady-state treadmill exercise, J Cardiopulm Rehabil 2006 (abstrakt, Europe PMC) | https://europepmc.org/article/MED/17135860 |
| pmc-7343795 | de Oliveira i in. | …handrail support… during maximal exercise testing, Sci Rep 2020 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7343795/ |
| hofmann-2014 | Hofmann i in. | …handrail-use instructions… inclined treadmill walking, Int J Exerc Sci 7(4):339–345 (abstrakt) | https://digitalcommons.wku.edu/ijes/vol7/iss4/10 |
| pmc-11050476 | Krobot Cutura i in. | Evaluating Intraocular Pressure Alterations during Large Muscle Group Isometric Exercises…, IJERPH 2024, sekcja 2.2.2 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11050476/ |

## Nowe klucze tekstów (propozycja do `lib/cues/text/pl.json`)

| Klucz | Tekst PL (własny) |
|---|---|
| slam.move | Unieś piłkę oburącz nad głowę, potem z całej siły rzuć ją prosto w dół, w podłogę. |
| lext.setup | Ustaw oparcie tak, by kolana były na wysokości osi obrotu maszyny; wałek oprzyj nisko na goleniach, tuż nad kostkami. |
| lext.hold | Siedź oparty plecami o oparcie i trzymaj uchwyty po bokach. |
| lext.range | Prostuj nogi aż do wyprostu kolan; opuszczaj do zgięcia mniej więcej pod kątem prostym. |
| scalf.setup | Usiądź i oprzyj wałki maszyny na udach, blisko kolan. |
| urow.setup | Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. |
| urow.move | Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. |
| urow.elbows | Prowadź ruch łokciami, kierując je na boki — nie zginaj samych przedramion jak przy uginaniu. |
| pdeck.seat | Ustaw siedzisko tak, by uchwyty były mniej więcej na wysokości barków. |
| pdeck.back | Siedź prosto, plecami przy oparciu. |
| pdeck.move | Zbliżaj ręce do siebie przed klatką, potem wróć do rozłożenia rąk. |
| ckick.move | Odprowadź nogę w tył do wyprostu w biodrze, potem wróć z kontrolą. |
| ckick.knee | Noga prosta lub tylko lekko ugięta w kolanie przez cały ruch. |
| hadd.move | Przyciągaj nogę do środka, potem pozwól jej powoli wrócić na zewnątrz. |
| hadd.posture | Tułów wyprostowany i nieruchomy — ruch tylko w biodrach. |
| ccrunch.move | Zwijaj tułów w dół, przyciągając żebra w stronę miednicy wbrew oporowi linki. |
| hkr.move | Unieś kolana przed siebie co najmniej do wysokości bioder, potem opuść nogi. |
| hkr.control | Unoś i opuszczaj nogi powoli, bez rozbujania i zamachu. |
| wheel.setup | Uklęknij i chwyć kółko leżące na podłodze przed tobą. |
| wheel.move | Odtaczaj kółko w przód, potem przyciągnij je z powrotem do pozycji wyjściowej. |
| wheel.range | Odtaczaj tylko tak daleko, jak utrzymasz proste plecy — lędźwie nie wyginają się w łuk, biodra nie opadają. |
| rope.wrists | Kręć skakanką ruchem nadgarstków. |
| rope.low | Skacz nisko — tylko tyle, żeby skakanka przeszła pod stopami. |
| run.stride | Nie wydłużaj kroku na siłę — lepiej trochę krótszy niż za długi. |
| run.bounce | Biegnij płynnie, bez zbędnego podskakiwania w górę. |
| run.under | Stawiaj stopę blisko pod ciałem, nie daleko przed sobą — to ogranicza hamowanie. |
| bike.seat | Ustaw siodełko tak, by w najniższym położeniu pedału noga była prawie prosta — kolano lekko ugięte, nie zablokowane. |
| bike.foot | Na pedale opieraj przednią część stopy. |
| walk.rails | Poręczy używaj najwyżej do równowagi — nie podpieraj się na nich mocno i nie odchylaj do tyłu, bo to zmniejsza wysiłek. |
| walk.upright | Idź wyprostowany, tułów stabilny. |
| wall.breath | Oddychaj normalnie — nie wstrzymuj oddechu. |

Istniejące klucze użyte ponownie: `hinge.back`, `plank.brace`, `llc.control`, `calf.move`, `calf.edge`.
`wall.breath` to uzupełnienie ćwiczenia Wall Sit z partii 1 (docs/31, pytanie otwarte nr 5).

## Wskazówki i źródła — ćwiczenia z kompletem (14 + 1 warunkowo)

### Medicine Ball Slam

**Ruch**
- `slam.move` (nowy) — ACE 182 (krok 3–4: piłka nad głowę, potem rzut z całej siły prosto w podłogę; parafraza); Tsartsapakis 2025, sekcja 3.2 (Controlled Upward Phase → Explosive Downward Phase; parafraza).

**Wskazówki**
- `hinge.back` (istniejący) — ACE 182 (krok 2) „Maintain a flat back by bending forward at the hips.”; Tsartsapakis 2025, 3.2 (Neutral Spine Alignment) „Ensure the lumbar and thoracic spine remain neutral throughout the movement to prevent hyperextension or excessive flexion.”
- `plank.brace` (istniejący) — ACE 182 (krok 2–4: napięty brzuch przez cały ruch; parafraza); Tsartsapakis 2025, 3.2 „Engage the TrA and deep-core stabilizers prior to initiating the slam.”

Jedno źródło (nie wchodzi): wydech przy rzucie (Tsartsapakis), łapanie odbitej piłki (ACE — wariant z piłką odbijającą się).

### Leg Extension

**Ustawienie**
- `lext.setup` (nowy) — oś kolana: Plotkin 2022 (Methods, Muscle strength-endurance) „The backrest was adjusted so that the anatomical axis of the participant's knee joint aligned with the axis of the unit.”; HKU CSE SHSC s. 2 „Pull the handle to adjust the backseat, so that the knee joint is aligned with pivot point of the machine.” — wałek: Ghigiarelli 2026, 2.4 „The lower leg was secured against the machine's resistance pad just above the ankle”; HKU CSE Active s. 1 (wałek tuż nad kostką); Western Legs (wałek blisko kostek; parafraza).
- `lext.hold` (nowy) — Plotkin 2022 „Participants sat with their back flat against the backrest and grasped the handles of the unit for support.”; Western Legs (trzymaj boczne uchwyty, plecy dociśnięte do oparcia; parafraza); HKU CSE SHSC s. 2 (trzymanie uchwytów).

**Ruch**
- `lext.range` (nowy) — Plotkin 2022 (pełny zakres od 90° zgięcia do pełnego wyprostu; parafraza); HKU CSE Active s. 1 „Pause a second and slowly lower the weight back to the original position as you inhale, ensuring that you do not go past the 90-degree angle limit.”; Ghigiarelli 2026, 2.3 „All repetitions were performed through a full range of motion permitted by the leg extension machine”.

**Wskazówki**
- `llc.control` (istniejący) — Plotkin 2022 (stałe tempo 1-0-1 z metronomem); Ghigiarelli 2026, 2.5 (kontrolowane powtórzenia, metronom); Western Legs (opuszczanie pod kontrolą); HKU CSE Active s. 1 (powolne opuszczanie).

Uwaga: Hermann 2026 (ten sam zespół co Plotkin) powtarza opis Plotkina — nie liczę jako osobnego źródła.

### Seated Calf Raise

**Ustawienie**
- `scalf.setup` (nowy) — HKU CSE SHSC Calf s. 1 (wałki oparte na udach; parafraza); Western Legs (wałki udowe blisko kolan; parafraza).
- `calf.edge` (istniejący) — Western Legs (przednia część stóp na podnóżku, pięty poza krawędzią; parafraza); NASM Calf blog „full stretch at the bottom (heels below the toes on an elevated surface)”.

**Ruch**
- `calf.move` (istniejący) — Kinoshita 2023 (Introduction, ryc. 1: zakres od 20° zgięcia grzbietowego do 30° podeszwowego, kolana 90°; parafraza); HKU CSE SHSC Calf s. 1 „Lower the feet where the heels are lower than the level of the platform.”; Western Legs (pełne opuszczenie pięt na dole; parafraza); Hasani 2021 (Tabela 1: zakres zgięcia grzbietowego i podeszwowego; parafraza).

**Wskazówki**
- `llc.control` (istniejący) — Kinoshita 2023 (Training program: 2 s w górę, 2 s w dół, metronom); Hasani 2021 (tempo z metronomu); Plotkin 2022 „Participants were instructed to perform repetitions in a controlled fashion, with a concentric action of approximately 1 s and an eccentric action of approximately 2 s.”; NASM Calf blog „a controlled 2-to-3-second lowering”.

Jedno źródło (nie wchodzi): pauza w rozciągnięciu na dole (NASM).

### Upright Row (hantle)

**Ustawienie**
- `urow.setup` (nowy) — NSCA ETM (wariant: sztanga; Starting position: nachwyt, gryf zwisa na wyprostowanych rękach; parafraza, przedruk CAO); WebMD Ignite (hantle przed sobą, dłonie do ciała, łokcie proste; parafraza).

**Ruch**
- `urow.move` (nowy) — NSCA ETM (wariant; Upward/Downward movement: gryf blisko brzucha i klatki do wysokości między dolnym końcem mostka a brodą, opuszczanie powoli i pod kontrolą; parafraza); WebMD Ignite (ciężar blisko ciała w górę do obojczyków; parafraza).

**Wskazówki**
- `urow.elbows` (nowy) — NSCA ETM (łokcie na boki, nie „zawijać” gryfu; parafraza); WebMD Ignite (łokcie odchodzą na zewnątrz; parafraza).

Szeroki chwyt zwiększa udział mięśni naramiennych i czworobocznych (McAllister 2013, abstrakt) — dotyczy sztangi, nie wchodzi. Ostrzeżenia ze źródeł („problemy z barkiem — lekarz”) pokrywa stopka aplikacji.

### Pec Deck

**Ustawienie**
- `pdeck.seat` (nowy) — HKU CSE FHSC Chest s. 2 „Raise the seat until the shoulders are aligned with the handles while seated.”; Western Chest (uchwyty między wysokością ucha a barku; parafraza). Część wspólna: mniej więcej na wysokości barków.
- `pdeck.back` (nowy) — HKU CSE FHSC Chest s. 2 „Sit up straight and place your arms on the pads, with the arms making a 90° angle with the body.”; Western Chest (plecy oparte o ławkę, stopy na podłodze; parafraza).

**Ruch**
- `pdeck.move` (nowy) — HKU CSE FHSC Chest s. 2 „Move your elbows towards each other while using your pectoral muscles.”; Western Chest (ściągnij uchwyty do siebie przed klatką; parafraza).

Uwaga: oba źródła to uczelniane centra sportu — komplet zależy od uznania ich szczebla (patrz „Ryzyka”). Jedno źródło: ramiona pod kątem prostym do tułowia (HKU).

### Cable Kickback

**Ruch**
- `ckick.move` (nowy) — HKU CSE SHSC s. 4 „Kick out the strapped leg backwards while keeping a straight posture.”; Western FM (wersja na pośladki: noga prosta, pięta w tył i w górę, powrót; parafraza); Stien 2021 (wariant: maszyna; Measurements) „The concentric phase lasted until the leg was aligned with the upper body (180° in the hip joint).”

**Wskazówki**
- `ckick.knee` (nowy) — Western FM (noga wyprostowana; parafraza); Stien 2021 (wariant: maszyna; kolano ok. 170° przez cały ruch; parafraza).

Jedno źródło (HKU — dwie karty tej samej uczelni): tułów i biodra proste, ruch tylko w biodrze; ustawienie z opaską na kostce przodem do wyciągu.

### Hip Adduction

**Ruch**
- `hadd.move` (nowy) — ACE 104 (wariant: wyciąg, stojąc; krok 5–6: stopa do środka przed nogę podporową, pauza, powolny powrót; parafraza); HKU CSE SHSC s. 6 (wariant: wyciąg) „Kick the strapped leg inwards, crossing the other leg while keeping a straight posture.”

**Wskazówki**
- `hadd.posture` (nowy) — ACE 104 (krok 4: plecy proste; parafraza); HKU CSE SHSC s. 6 (cytat wyżej).

Uwaga: oba źródła opisują przywodzenie na wyciągu stojąc; maszyny (siedząc) dotyczy tylko Western (wspólne ustawienie z odwodzeniem, bez opisu ruchu przywodzenia). Liczone jako wariant (inny sprzęt, siedząc/stojąc) — [OTWARTE] dla audytora.

### Cable Crunch

**Ruch**
- `ccrunch.move` (nowy) — ACE 331 (wariant: stojąc) „Focus on rolling the rib cage down against the pull of the cable.”; Western FM Abs (wariant: stojąc, uchwyty przy klatce; barki w przód i w dół w stronę stóp; parafraza).

**Wskazówki**
- `llc.control` (istniejący) — ACE 331 (krok 7: powolny powrót; parafraza); Western FM Abs (powolny powrót; parafraza); HKU CSE Active Abs s. 1 (wariant: maszyna) „Be sure to use a slow and controlled motion.”

Uwaga: oba źródła opisują wersję stojącą; w katalogu ćwiczenie zwykle klęcząc — wariant (stojąc/klęcząc).

### Hanging Knee Raise

**Ruch**
- `hkr.move` (nowy) — HKU CSE FHSC Abs s. 3 (wariant: podpór na przedramionach) „Pull your legs up towards a 90° angle with the body while flexing your abdominals.”; Western Abs (wariant: Captain's Chair; kolana w stronę klatki, potem opuszczenie; parafraza).

**Wskazówki**
- `hkr.control` (nowy) — NASM Best Abs (Hanging Knee Raise, Coaching Tip) „Avoid using momentum to swing the legs upward.”; NASM Best Abs „Focus on moving slowly and maintaining a stable torso throughout each repetition.”; Western Abs (opuszczanie nóg pod kontrolą; parafraza).

Uwaga: HKU i Western opisują wersję z podparciem przedramion (krzesło), NASM — zwis; wariant (inny sprzęt). HKU: zdjęcie pokazuje ugięte kolana,
tekst mówi o nogach do 90° — część wspólna z Western: uda co najmniej do poziomu bioder.

### Ab Wheel

**Ustawienie**
- `wheel.setup` (nowy) — ACE 309 (wariant: sztanga; krok 2: klęk, chwyt na szerokość barków; parafraza); Sussexsport (Teaching Points: klęk, kółko na podłodze pod barkami; parafraza).

**Ruch**
- `wheel.move` (nowy) — ACE 309 (wariant; krok 3–5: odtoczenie i przyciągnięcie z powrotem; parafraza); Sussexsport (odtocz, potem wróć do startu; parafraza).

**Wskazówki**
- `wheel.range` (nowy) — ACE 309 „Keep the hips pressed forward and the back straight.”; Sussexsport „Reach out as far as possible without arching your back”; NASM Best Abs (Ab Wheel Rollout) „The further the body extends from the center, the harder the core must work to prevent lumbar extension.”

Ostrzeżenie Sussexsport o obciążeniu lędźwi — nie przenosimy (twierdzenie zdrowotne). Jedno źródło: ręce wyprostowane cały czas (Sussexsport).

### Skakanka

**Ruch**
- `rope.wrists` (nowy) — ACE Fit Facts (Learning the Basics) „Turn the rope from the wrist and aim to keep a smooth arc in the rope as it passes over your head.”; DAN (Basic Bounce: kręcenie skakanką nadgarstkami; parafraza).

**Wskazówki**
- `rope.low` (nowy) — ACE Fit Facts (Learning the Basics: skacz nisko; parafraza, uzasadnienie zdrowotne pominięte); DAN „Jump 1 to 2 inches (2.5 to 5 centimeters) off the ground, just high enough to clear the rope.”

Jedno źródło: łokcie blisko tułowia, kolana lekko ugięte, dobór długości skakanki (ACE); lądowanie na przedniej części stopy (DAN). Uwaga: DAN — organizacja spoza fitnessu (szczebel do decyzji audytora).

### Bieg

**Wskazówki**
- `run.stride` (nowy) — Moore 2016 (Spatiotemporal Factors) „This range appears to be the preferred stride length minus 3 % to the preferred stride length.”; Folland 2017 (krótszy krok i wyższa kadencja wiązały się z lepszą ekonomią; parafraza).
- `run.bounce` (nowy) — Moore 2016 (Spatiotemporal Factors) „Collectively, these results imply that reducing the magnitude of vertical displacement should be encouraged.”; Folland 2017 (mniejsze pionowe przemieszczenie miednicy — najsilniejszy kinematyczny korelat ekonomii; parafraza).
- `run.under` (nowy) — NASM Running Gait (overstriding) „the runner is likely creating unnecessary braking forces with each step.”; Moore 2016 (mniejsza odległość stopy od środka masy przy kontakcie zmniejszała siły hamujące; parafraza); Folland 2017 „the current comprehensive study convincingly demonstrates the importance of minimizing braking”.

Nie wchodzi (sprzeczność albo jedno źródło): sposób stawiania stopy (Moore — bez wpływu na ekonomię; NASM — „zależy od kontekstu”), pochylenie tułowia (Moore — dane sprzeczne), kadencja 170–180 (tylko NASM), praca ramion (Moore i NASM mówią o różnych rzeczach).

### Rower

**Ustawienie**
- `bike.seat` (nowy) — Concept2 BikeErg „With the ball of your foot on the pedal, your leg should maintain a slight bend at maximum extension.”; HSS (Seat height: kolano prawie proste, lekko ugięte) „It shouldn't be locked out, just bending noticeably.”; Bini 2011 (abstrakt: metoda kąta zgięcia kolana 25–30°; parafraza); Western Cardio (siodełko tak, by najbardziej wyprostowana noga miała lekkie ugięcie; parafraza).
- `bike.foot` (nowy) — Concept2 BikeErg (przednia część stopy na pedale; cytat wyżej); HSS (Foot position: śródstopie nad pedałem; parafraza).

Liczby nie wchodzą do tekstu: HSS podaje 5–10° (z piętą na pedale), Bini 25–30° (inna metoda pomiaru) — część wspólna to „lekko ugięte, nie zablokowane”.

### Incline Walk (bieżnia)

**Wskazówki**
- `walk.rails` (nowy) — Berling 2006 (abstrakt: mocne trzymanie poręczy obniżało tętno i pobór tlenu; parafraza); Hofmann 2014 (abstrakt) „holding the handrails and leaning backward significantly reduces metabolic cost”; NordicTrack „It's okay to use the side rails for balance, especially when you're getting used to steeper inclines.”; Life Fitness „If you feel more comfortable holding on, ensure that you keep an upright posture and don’t lean back!”; de Oliveira 2020 (z podparciem test trwał dłużej, tętno w środkowych etapach niższe; parafraza).
- `walk.upright` (nowy) — Life Fitness (cytat wyżej; „stand up straight”); NordicTrack „While a slight forward lean is normal, try to keep your core tight and your spine neutral.”

Część wspólna i różnica: Berling — mocny chwyt zmniejsza wysiłek; Hofmann — przy nachyleniu 10% trzymanie się w pozycji wyprostowanej nie zmniejszało go istotnie, odchylenie do tyłu — tak. Stąd tekst: poręcz najwyżej do równowagi, bez mocnego podpierania i odchylania.
Jedno źródło: zaczynaj od małego nachylenia (NordicTrack).

### Assault Bike — WARUNKOWO

- `bike.seat` i `bike.foot` — te same źródła co Rower: Concept2 BikeErg (wariant: rower powietrzny bez ruchomych rączek), HSS i Western (wariant: rower stacjonarny).
Żadne przeczytane źródło nie opisuje roweru z ruchomymi rączkami (strony producentów niedostępne). Czy rower stacjonarny to „wariant”
(liczy się), czy „analogia” — to samo pytanie co kąt ławki w docs/31 (pyt. 1). Bez rozstrzygnięcia: BRAK.

### Uzupełnienie partii 1: Wall Sit — oddech

- `wall.breath` (nowy) — Lea 2023 i Baffour-Awuah 2023 (zespół Wilesa, jedno źródło wg docs/31) + Krobot Cutura 2024, sekcja 2.2.2 „Subjects followed a normal breathing pattern”. Zamyka pytanie otwarte nr 5 z docs/31. Uzasadnienie medyczne z badania (ciśnienie wewnątrzgałkowe) — nie przenosimy.

## BRAK — do następnej partii (17)

| Ćwiczenie | Co sprawdzono i dlaczego brak |
|---|---|
| Chest Dip | McKenzie 2022 (Southern Cross) i HKU CSE FHSC (Dips: zejście do ok. 90° w łokciach) — wspólna tylko 1 wskazówka (ruch); głębokość i pozycja tułowia — po jednym źródle |
| Arnold Press | ACE, NASM, Eleiko, HKU, Western — brak; Europe PMC — brak badań z opisem; zostają serwisy konsumenckie (odrzucone) |
| Incline Curl (hantle) | Oliveira 2009 (UFRJ) — opis niejednoznaczny (dwa ustawienia oznaczone tym samym skrótem); Kassiano 2025 — tylko abstrakt bez opisu |
| Concentration Curl (hantle) | tylko ACE (ProSource 2014 i badanie ACE — ta sama organizacja) |
| Spider Curl | brak źródeł szczebla ≤ 4 |
| Skullcrusher (hantle) | brak opisu wersji z hantlami (ACE 36 — sztanga) |
| Triceps Kickback | tylko ACE 55; Human Kinetics „Dumbbell triceps extension” (Walk Your Way Fit) to inne ćwiczenie (proste ręce) |
| Box Squat | McBride 2010 i Díez-Fernández 2024 (Almería, maszyna Smitha) — wspólne: siad na skrzyni bez odbicia (1 wskazówka); szeroki rozstaw i pionowe piszczele — tylko Swinton 2012 |
| Sissy Squat | brak źródeł |
| Hip Abduction | Western (maszyna) i HKU SHSC s. 5 (wyciąg stojąc) — wspólna tylko 1 wskazówka (odwiedzenie i powrót); ACE 155 — bez opisu; de Almeida Paz 2022 — abstrakt bez opisu |
| Hanging Leg Raise | NASM — tylko jako progresja; Western — wskazówka „wyprostuj nogi” jako utrudnienie; HKU — tekst i zdjęcie niezgodne (nogi proste czy ugięte) |
| Hollow Hold | Root 2019 (A.T. Still University; leżenie na plecach, ręce wyciągnięte za głowę, nogi proste uniesione) — jedno źródło; Aube 2026 — tylko nazwa |
| Incline Chest Fly (hantle) | nadal tylko opisy ławki płaskiej (ACE 21, Eleiko); zależy od pytania o kąt ławki (docs/31, pyt. 1) |
| Decline Bench Press (hantle) | brak opisu; jw. |
| Floor Press (hantle) | Raiola 2025 — tylko nazwa w programie; brak opisu |
| Floor Press (sztanga) | brak opisu; Kirk 2026 (test izometryczny) nie czytano — brak otwartego dostępu |
| Squeeze Press (hantle) | brak źródeł |

## Podsumowanie — ćwiczenie → liczba wskazówek z ≥ 2 źródłami

| Ćwiczenie | Wskazówki | Status | Zależy od uznania szczebla |
|---|---|---|---|
| Pec Deck | 3 | komplet | tak (HKU, Western) |
| Chest Dip | 1 | BRAK | — |
| Arnold Press | 0 | BRAK | — |
| Upright Row (hantle) | 3 | komplet | tak (WebMD Ignite; NSCA ETM — przedruk) |
| Incline Curl (hantle) | 0 | BRAK | — |
| Concentration Curl (hantle) | 0 | BRAK | — |
| Spider Curl | 0 | BRAK | — |
| Skullcrusher (hantle) | 0 | BRAK | — |
| Triceps Kickback | 0 | BRAK | — |
| Box Squat | 1 | BRAK | — |
| Leg Extension | 4 | komplet | nie (badania wystarczą do `lext.range`, `llc.control`, części `lext.setup` i `lext.hold`) |
| Sissy Squat | 0 | BRAK | — |
| Cable Kickback | 2 | komplet | tak (HKU, Western; Stien sam nie wystarcza) |
| Hip Abduction | 1 | BRAK | — |
| Hip Adduction | 2 | komplet | tak (HKU) + wariant (wyciąg stojąc) |
| Seated Calf Raise | 4 | komplet | nie (`calf.move`, `llc.control` z badań i NASM) |
| Ab Wheel | 3 | komplet | częściowo (bez Sussexsport zostaje 1 wskazówka) |
| Hanging Leg Raise | 0 | BRAK | — |
| Hanging Knee Raise | 2 | komplet | tak (HKU, Western) + wariant (podpór przedramion) |
| Cable Crunch | 2 | komplet | tak (Western) + wariant (stojąc) |
| Hollow Hold | 0 | BRAK | — |
| Incline Walk (bieżnia) | 2 | komplet | nie |
| Bieg | 3 | komplet | nie |
| Rower | 2 | komplet | nie |
| Assault Bike | 2 | warunkowo (wariant czy analogia) | — |
| Skakanka | 2 | komplet | tak (DAN) |
| Medicine Ball Slam | 3 | komplet | nie |
| Incline Chest Fly (hantle) | 0 | BRAK | — |
| Decline Bench Press (hantle) | 0 | BRAK | — |
| Floor Press (hantle) | 0 | BRAK | — |
| Floor Press (sztanga) | 0 | BRAK | — |
| Squeeze Press (hantle) | 0 | BRAK | — |

Razem: komplet 14, warunkowo 1 (Assault Bike), BRAK 17. Komplety niezależne od spornych szczebli: 6 (Leg Extension, Seated Calf Raise,
Incline Walk, Bieg, Rower, Medicine Ball Slam). Od uczelnianych centrów sportu zależy 6 (Pec Deck, Cable Kickback, Hip Adduction,
Hanging Knee Raise, Cable Crunch, Ab Wheel), od WebMD Ignite — Upright Row, od DAN — Skakanka.

## Ryzyka

1. **Szczebel uczelnianych centrów sportu** (HKU CSE, Western SRS, Sussexsport): to instrukcje obsługi sprzętu bez autora i daty, nie materiały
   katedr kinezjologii. Proponuję szczebel 4 jako „materiały instytucji”, ale można je uznać za praktykę trenerską (szczebel 5, nie liczy się).
   Od tego zależy 6 kompletów (wyżej).
2. **Warianty zamiast dokładnego ćwiczenia**: Hip Adduction (oba źródła — wyciąg stojąc, w katalogu maszyna), Cable Crunch (stojąc zamiast klęcząc),
   Hanging Knee Raise (krzesło z podparciem przedramion), Upright Row (NSCA — sztanga), Ab Wheel (ACE — sztanga). Reguła z docs/27 to dopuszcza, ale
   granicę wariant/analogia ocenia audytor.
3. **Przedruk zamiast oryginału** (NSCA ETM przez Coaches Association of Ontario) — tekst przypisany NSCA, strona wydawcy już nie działa.
4. **Bieg i bieżnia**: wskazówki dotyczą ekonomii i wysiłku, nie zdrowia — uzasadnienia o kontuzjach i sercu ze źródeł celowo pominięte.
   Berling, Hofmann i de Oliveira to badania na małych grupach (10–15 osób); Hofmann — instytut producenta.
5. **Parafrazy z narzędzia**: dla stron ACE, Western, WebMD Ignite, HSS i abstraktów narzędzie zwracało streszczenie; miejsca podane, ale
   przed wdrożeniem warto, by audytor otworzył 3–4 losowe odwołania. Karty HKU, ACE Fit Facts i Sussexsport czytane w całości (PDF).

## Otwarte pytania

1. **[OTWARTE] Szczebel materiałów uczelnianych centrów sportu** (HKU CSE, Western SRS, Sussexsport) — 4 czy 5? Pytanie o metodę — rozstrzyga audytor merytoryczny.
2. **[OTWARTE] Szczebel DAN (Alert Diver) i WebMD Ignite** — organizacje spoza fitnessu / wydawca materiałów dla pacjentów.
3. **[OTWARTE] Przedruk NSCA ETM** — czy przedruk na stronie innej organizacji (z przypisaniem) spełnia wymóg „przeczytanego źródła”, i czy NSCA ETM to szczebel 3.
4. **[OTWARTE] Rower stacjonarny jako wariant Assault Bike** — to samo pytanie co kąt ławki (docs/31, pyt. 1).
5. **[OTWARTE] Dostęp do ExRx i stron producentów** (Assault Fitness, Life Fitness support, Hammer Strength) — potrzebne środowisko z dostępem
   do web.archive.org; z ExRx kilka BRAK (Arnold Press, Concentration Curl, Triceps Kickback, Skullcrusher hantle, Sissy Squat, Hip Abduction)
   miałoby drugie źródło.
6. Test `tests/research-quotes.test.ts` dla tego pliku — do uruchomienia przez koordynatora (w tej sesji agent nie miał narzędzia do uruchamiania poleceń);
   cytaty pisane jako jedno zdanie, poniżej 300 znaków.
