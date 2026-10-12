# 31 — Wskazówki techniki, partia 1 (50 ćwiczeń): źródła i propozycje

Data: 12.10.2026. Autor: badacz merytoryczny (agent). Decyzja właściciela 11.10.2026: badacz, partie po ok. 50 ćwiczeń,
adresy od Gemini tylko jako punkt startu.

**Status: PROPOZYCJA — nic nie jest jeszcze w `lib/`.** Wdrożenie (dane w `lib/cues/data.json`, teksty w `lib/cues/text/pl.json`,
`scripts/cues/gen.mjs`) robi programista po akceptacji. Teksty angielskie — tłumacz.

## Metoda

Dokładnie jak w `docs/research/27-wskazowki-zrodla.md` (sekcje „Zasady” i „Organizacje i szczeble”):

- każda wskazówka ma co najmniej 2 przeczytane źródła z RÓŻNYCH organizacji; miejsce w źródle podane;
- źródło o innym ćwiczeniu = „analogia”, nie liczy się do minimum; wariant tego samego ćwiczenia (inny sprzęt, siedząc/stojąc,
  jednorącz/oburącz, inna wysokość bloczka) liczy się, z opisem „(wariant: …)” w miejscu odwołania;
- sformułowania własne (parafraza faktów), tylko część wspólna źródeł, bez twierdzeń medycznych (o kontuzjach, ciśnieniu, bólu);
- cytat dla weryfikacji najwyżej 1 zdanie; gdzie narzędzie zwróciło tylko parafrazę — „(parafraza)” i dokładne miejsce;
- ćwiczenie bez co najmniej 2 wskazówek z dwoma źródłami każda → „BRAK — do następnej partii”.

### Odstępstwo od metody w tej partii (ważne)

- **ExRx.net był w tej sesji nieosiągalny**: narzędzie pobierania stron blokuje `web.archive.org` i `archive.ph`, a sam exrx.net
  odpowiada 403. Żadnej strony ExRx z listy od Gemini (LVPecDeckFly, BWChestDip, WtBackExtension, DBConcentrationCurl,
  BBPreacherCurl, LVSeatedHipAbduction, SLLegHipRaise) nie przeczytano, więc ExRx nie jest źródłem w tej partii.
  Wcześniejsze odczyty ExRx z etapu 1 (lista „Otwarte” w docs/27) nie mają zapisanych miejsc dla tych ćwiczeń — nie da się ich użyć bez ponownego odczytu.
- PubMed (pubmed.ncbi.nlm.nih.gov) i Mayo Clinic zwracały błąd (ciasteczka / 403); abstrakty czytane przez Europe PMC
  (`ebi.ac.uk/europepmc`), pełne teksty przez `pmc.ncbi.nlm.nih.gov`.
- Strony aplikacji i sklepów treningowych z wyników wyszukiwania pominięto (szczebel poniżej 4, treści konkurencji) — nie zapisano ich nigdzie.

## Nowe organizacje (propozycja do tabeli „Organizacje i szczeble”)

| Skrót | Organizacja | Szczebel | Rodzaj (podpis w aplikacji) | Uwagi |
|---|---|---|---|---|
| Eleiko | Eleiko — Online Education, Exercise Video Library (eleiko.inspire360.com) | 4 | producent sprzętu | dokumentacja producenta sprzętu (hierarchia, szczebel 4) |
| NSCA | National Strength and Conditioning Association — NSCA Coach (artykuł edukacyjny) | 4 | organizacja szkoleniowa (artykuł) | to nie stanowisko NSCA (szczebel 2), tylko artykuł edukacyjny, nierecenzowany |
| Mullane, Turner, Bishop (Middlesex University) | artykuł techniczny w Strength and Conditioning Journal (recenzowany, NSCA) | 3 | badanie (czasopismo recenzowane) | rękopis zaakceptowany, repozytorium uczelni |
| van der Horst i in. (UMC Utrecht) | RCT, Am J Sports Med 2015 | 3 | badanie (czasopismo recenzowane) | |
| Chen, Wu, Guo (Beijing Sport University i in.) | RCT, Sci Rep 2023 | 3 | badanie (czasopismo recenzowane) | |
| Ripley i in. (University of Salford) | badanie, Muscles 2024 | 3 | badanie (czasopismo recenzowane) | |
| Lea, O’Driscoll, Wiles (Canterbury Christ Church University) | badanie pilotażowe, Eur J Appl Physiol 2023 | 3 | badanie (czasopismo recenzowane) | |
| Ng i in. (Chinese University of Hong Kong) | protokół RCT, Trials 2026 | 3 | badanie (czasopismo recenzowane) | protokół, nie wynik |
| Baffour-Awuah i in. (University of New England) | przegląd z zaleceniami, Clin Hypertens 2023 | 3 | badanie (czasopismo recenzowane) | współautor Wiles — NIE niezależny od Lea i in. |
| Lyons i in. (University of Central Florida) | badanie, Int J Sports Phys Ther 2025 | 3 | badanie (czasopismo recenzowane) | |
| Andersen i in. (Western Norway University of Applied Sciences) | badanie EMG, J Sports Sci Med 2021 | 3 | badanie (czasopismo recenzowane) | |
| Nunes i in. (Londrina State University) | badanie, Int J Environ Res Public Health 2020 | 3 | badanie (czasopismo recenzowane) | |
| Havers i in. (IST University of Applied Sciences, Düsseldorf) | badanie, Eur J Sport Sci 2025 | 3 | badanie (czasopismo recenzowane) | |
| Intziegianni i in. (UCLan Cyprus) | badanie EMG, Muscles 2026 | 3 | badanie (czasopismo recenzowane) | |
| Marcolin i in. (University of Padova) | badanie EMG, J Athl Train 2015 | 3 | badanie (czasopismo recenzowane) | |
| Polevoy i in. (Moscow Aviation Institute i in.) | badanie, Int J Environ Res Public Health 2022 | 3 | badanie (czasopismo recenzowane) | |
| Šiska i in. (Catholic University in Ružomberok) | badanie, J Funct Morphol Kinesiol 2024 | 3 | badanie (czasopismo recenzowane) | użyte tylko pomocniczo |

## Nowe źródła (propozycja wpisów `sources`)

| Id (propozycja) | Org | Tytuł | URL |
|---|---|---|---|
| ace-334 | ACE | Straight Arm Pressdown (#334) | https://www.acefitness.org/resources/everyone/exercise-library/334/straight-arm-pressdown/ |
| ace-359 | ACE | Farmer’s Carry (#359) | https://www.acefitness.org/resources/everyone/exercise-library/359/farmer-s-carry/ |
| ace-358 | ACE | Suitcase Carry (#358) | https://www.acefitness.org/resources/everyone/exercise-library/358/suitcase-carry/ |
| ace-161 | ACE | Standing Decline Cable Flyes (#161) | https://www.acefitness.org/resources/everyone/exercise-library/161/standing-decline-cable-flyes/ |
| ace-163 | ACE | Standing Incline Cable Flyes (#163) | https://www.acefitness.org/resources/everyone/exercise-library/163/standing-incline-cable-flyes/ |
| ace-165 | ACE | Seated Cable Press (#165) | https://www.acefitness.org/resources/everyone/exercise-library/165/seated-cable-press/ |
| ace-338 | ACE | Single-arm Chest Press (#338) | https://www.acefitness.org/resources/everyone/exercise-library/338/single-arm-chest-press/ |
| ace-332 | ACE | Standing Anti-Rotation Press (#332) | https://www.acefitness.org/resources/everyone/exercise-library/332/standing-anti-rotation-press/ |
| ace-76 | ACE | Reverse Crunch (#76) | https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/ |
| ace-131 | ACE | Prone (Lying) Hamstrings Curl (#131) | https://www.acefitness.org/resources/everyone/exercise-library/131/prone-lying-hamstrings-curl/ |
| ace-306 | ACE | Burpee (#306, wersja z BOSU) | https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/306/burpee/ |
| ace-186 | ACE | Seated Shoulder Press (#186) — już w danych; potwierdzono: maszyna (selectorized) | https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/ |
| nasm-seated-leg-curl | NASM | Seated Leg Curl | https://www.nasm.org/resource-center/exercise-library/seated-leg-curl |
| nasm-single-leg-seated-leg-curl | NASM | Single-Leg Seated Leg Curl | https://www.nasm.org/resource-center/exercise-library/single-leg-seated-leg-curl |
| nasm-squat-thrust-burpees | NASM | Squat Thrust Burpees | https://www.nasm.org/resource-center/exercise-library/squat-thrust-burpees |
| nasm-best-abs | NASM | Best Abs Exercises (blog, H. Cherry, akt. 23.07.2026) | https://www.nasm.org/resource-center/blog/training/best-abs-exercises |
| nasm-cable-crossover, nasm-barbell-bench-press | NASM | już w danych | — |
| nsca-coach-7-3 | NSCA | Taylor, Reed: Increase Hip and Trunk Stability with Loaded Carries…, NSCA Coach 7.3 | https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf |
| eleiko-659433c2 | Eleiko | Declined Bench Press – Barbell | https://eleiko.inspire360.com/resource/659433c2f0a925ba4e09373b |
| eleiko-659842f4 | Eleiko | Dual Cable Straight Arm Pulldown – Straight Bar | https://eleiko.inspire360.com/resource/659842f49607aaa1f400b866 |
| eleiko-6598447e | Eleiko | Dual Cable Straight Arm Pulldown – Handles | https://eleiko.inspire360.com/resource/6598447ec5f892e7790ccbb8 |
| eleiko-65944cf0 | Eleiko | Horizontal Cable Press – Dual Cable, Standing | https://eleiko.inspire360.com/resource/65944cf0a15f04fdb30a8c1b |
| eleiko-659445eb | Eleiko | Horizontal Cable Press – 1/2 Kneeling, 1-Arm | https://eleiko.inspire360.com/resource/659445ebeb710a27950b8e05 |
| eleiko-65944a76 | Eleiko | Horizontal Cable Press – Low Split Stance, 1-Arm | https://eleiko.inspire360.com/resource/65944a7639c5b816e305b796 |
| eleiko-659d665d | Eleiko | Pallof Cable Press – Low Split Stance | https://eleiko.inspire360.com/resource/659d665daa93b5993f0c90c7 |
| eleiko-659463af | Eleiko | Overhead Press – Seated, 2 DB | https://eleiko.inspire360.com/resource/659463af0ba5d8897900b853 |
| mullane-2021 | Mullane, Turner, Bishop | Exercise Technique: The Pallof Press, Strength Cond J 43(2):121–128, doi:10.1519/SSC.0000000000000596 (rękopis) | https://repository.mdx.ac.uk/item/89098 |
| vdhorst-2015 | van der Horst i in. | The Preventive Effect of the Nordic Hamstring Exercise… RCT, Am J Sports Med 2015, doi:10.1177/0363546515574057 | https://instituteofmotion.com/wp-content/uploads/2018/03/Nordic-hamstring-2015.pdf |
| pmc-10624851 | Chen, Wu, Guo | Nordic hamstring exercises in functional knee rehabilitation after ACL reconstruction, Sci Rep 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10624851/ |
| pmc-12225522 | Ripley i in. | Kinematic, neuromuscular and bicep femoris in vivo mechanics during the NHE…, Muscles 2024 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12225522/ |
| pmc-10786991 | Lea, O’Driscoll, Wiles | Home-based isometric wall squat intervention…, Eur J Appl Physiol 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10786991/ |
| pmc-13449400 | Ng i in. | Isometric resistance exercise… study protocol for a RCT, Trials 2026 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13449400/ |
| pmc-10015931 | Baffour-Awuah i in. | An evidence-based guide to… isometric resistance training in hypertension, Clin Hypertens 2023 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10015931/ |
| pmc-11964695 | Lyons i in. | …Following 45-Degree Roman Chair Exercise, Int J Sports Phys Ther 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11964695/ |
| pmc-8057707 | Andersen i in. | Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises…, J Sports Sci Med 2021 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8057707/ |
| pmc-7460162 | Nunes i in. | …Cable vs. Barbell Preacher Curl Training…, IJERPH 2020 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/ |
| pmc-12621570 | Havers i in. | Partial Range, Full Gains?…, Eur J Sport Sci 2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12621570/ |
| pmc-13029269 | Intziegianni i in. | EMG… Standard, Diamond, and Wide Hand Position Push-Ups, Muscles 2026 | https://pmc.ncbi.nlm.nih.gov/articles/PMC13029269/ |
| pmc-4732391 | Marcolin i in. | Selective Activation of Shoulder, Trunk, and Arm Muscles… Push-Up Variants, J Athl Train 2015 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4732391/ |
| pmc-9517252 | Polevoy i in. | The Influence of Burpee on Endurance and Short-Term Memory of Adolescents, IJERPH 2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9517252/ |
| pmc-11503278 | Šiska i in. | The Relationship Between the Burpee Movement Program and…, JFMK 2024 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11503278/ |

## Nowe klucze tekstów (propozycja do `lib/cues/text/pl.json`)

| Klucz | Tekst PL (własny) |
|---|---|
| carry.two | Weź ciężar w każdą rękę; ręce opuszczone wzdłuż boków, ciężary przy biodrach. |
| carry.one | Weź ciężar w jedną rękę; ręka opuszczona wzdłuż boku, ciężar przy biodrze. |
| carry.walk | Idź spokojnym, kontrolowanym krokiem na ustalony dystans albo czas. |
| carry.noLean | Nie przechylaj się ani w stronę ciężaru, ani od niego — idź wyprostowany. |
| pallof.setup | Stań bokiem do wyciągu ustawionego mniej więcej na wysokości klatki; uchwyt trzymaj oburącz przy klatce, linka napięta. |
| pallof.move | Wypchnij uchwyt prosto przed siebie do wyprostu rąk, przytrzymaj chwilę i powoli wróć do klatki. |
| pallof.noTwist | Nie pozwól, by linka obróciła tułów — tułów i biodra zostają nieruchomo. |
| rcrunch.move | Zwijaj biodra od podłoża w stronę żeber, potem powoli opuść je z powrotem. |
| rcrunch.hips | Ruch prowadzi miednica — nie wymachuj nogami. |
| sapd.setup | Ustaw wyciąg wysoko i chwyć drążek prostymi rękami przed sobą. |
| sapd.move | Prostymi rękami ściągnij drążek w dół, w stronę ud; wróć powoli do góry. |
| sapd.arms | Ręce proste przez cały ruch — nie zginaj łokci. |
| cpress.setup | Ustaw bloczki mniej więcej na wysokości klatki lub barków, stań tyłem do wyciągu, uchwyty przy barkach. |
| cpress.base | Dociskaj stopy do podłogi i napnij brzuch — tułów stabilny. |
| cpress1.setup | Stań tyłem do wyciągu, uchwyt w jednej ręce przy barku. |
| cpress1.move | Wypchnij uchwyt przed siebie do wyprostu ręki; wracaj powoli. |
| msp.seat | Usiądź tak, by uchwyty były mniej więcej na wysokości barków (ustaw siedzisko). |
| lcurl.move | Zginaj kolana, przyciągając pięty w stronę pośladków; wracaj powoli do wyprostu. |
| lcurl.still | Uda i biodra nieruchomo — ruch tylko w kolanach. |
| nordic.setup | Uklęknij na miękkim podłożu; kostki muszą być mocno przytrzymane (partner, wałki albo zaczep). |
| nordic.move | Pochylaj się w przód jak najwolniej, hamując ruch tyłem ud. |
| nordic.hips | Biodra wyprostowane — tułów i uda w jednej linii, bez zginania w biodrach. |
| nordic.catch | Gdy nie dasz rady dalej hamować, złap się dłońmi jak przy pompce. |
| wall.setup | Oprzyj plecy o stabilną ścianę, wysuń stopy w przód i zsuń się po ścianie do wybranej wysokości. |
| wall.back | Plecy oparte o ścianę, tułów wyprostowany. |
| wall.depth | Im niżej zejdziesz (mniejszy kąt w kolanach), tym trudniej — można zacząć wyżej i obniżać pozycję stopniowo. |
| bext.move | Opuść tułów, zginając się w biodrach mniej więcej do kąta prostego; wróć do linii prostej z nogami. |
| bext.noArch | Na górze kończ w linii prostej — bez wyginania lędźwi w łuk. |
| preacher.setup | Oprzyj tył ramienia o podpórkę modlitewnika, pachą blisko jej krawędzi. |
| preacher.range | Pełny zakres: od wyprostu do pełnego zgięcia łokcia. |
| diamond.setup | Dłonie razem pod środkiem klatki — kciuki i palce wskazujące stykają się, tworząc romb; ciało proste. |
| burpee.down | Z przysiadu oprzyj dłonie o podłogę i wyskocz nogami w tył do podporu jak do pompki. |
| burpee.up | Wskocz stopami z powrotem do dłoni i wyskocz w górę, prostując biodra i kolana. |

Istniejące klucze użyte ponownie: `lunge.torso`, `hinge.back`, `llc.control`, `curl.control`, `push.rigid`, `plank.brace`,
`fly.control`, `mcp.move`, `ohp.move`, `ohp.feet`, `ohp.fullExt`, `bp.grip`, `bp.move`, `bp.control`.

## Wskazówki i źródła — ćwiczenia z kompletem (17 + 1 warunkowo)

### Straight Arm Pulldown

**Ustawienie**
- `sapd.setup` (nowy) — ACE 334 (opis: wyciąg w najwyższym położeniu, drążek; parafraza); Eleiko 659842f4 (Setup: bloczek na wysokości głowy, ręce proste; parafraza).

**Ruch**
- `sapd.move` (nowy) — ACE 334 (opis: proste ręce, dłonie do przodu pasa, powolny powrót; parafraza); Eleiko 659842f4 (Procedure: drążek w stronę ud prostymi rękami, powrót pod kontrolą; parafraza) i Eleiko 6598447e (wariant: uchwyty) „Keep your torso stable, shoulders back and down, and pull the handles to the outside of the hips with straight arms.”

**Wskazówki**
- `sapd.arms` (nowy) — ACE 334 (opis: ręce proste przez cały ruch; parafraza); Eleiko 659842f4 (Procedure: ręce proste; parafraza) i 6598447e (cytat wyżej).

Tylko jedno źródło (nie wchodzi): ruch zaczynany od ściągnięcia łopatek w dół i w tył (Eleiko: „Initiate the movement by sliding your shoulder blades back and down.”).
Uwaga: strona ACE 334 jest wewnętrznie niespójna (drążek w jednym kroku, „końce liny” w następnym) — wskazówki nie zależą od rodzaju uchwytu.

### Wyciskanie na linkach (stojąc)

**Ustawienie**
- `cpress.setup` (nowy) — Eleiko 65944cf0 (Setup: bloczki na wysokości klatki, tyłem do maszyny, uchwyty przed barkami; parafraza); ACE 338 (wariant: jednorącz) „Place the pulley at shoulder-height, and use a single handle.”; ACE 165 (wariant: siedząc) Step 1 (uchwyty na wysokości barków lub środka klatki).

**Ruch**
- `mcp.move` (istniejący) — Eleiko 65944cf0 (Movement: wypchnięcie do pełnego wyprostu i powrót); ACE 165 (wariant: siedząc) Step 2–3 (wyprost „not locked”, powolny powrót do klatki).

**Wskazówki**
- `cpress.base` (nowy) — Eleiko 65944cf0 (Coaching points) „Keep your torso stable and avoid excessive rotation.”; ACE 338 (wariant: jednorącz) „Press both feet into the floor, squeeze the stomach, and straighten the arm.”

### Single Arm Cable Chest Press

**Ustawienie**
- `cpress1.setup` (nowy) — ACE 338 „Turn so that the back is towards the machine.”; Eleiko 659445eb / 65944a76 (wariant: półklęk / wykrok) Setup: tyłem do maszyny, uchwyt w jednej ręce przed barkiem.

**Ruch**
- `cpress1.move` (nowy) — ACE 338 (krok 5–7) „slowly bringing the arm back to lower the weight.”; Eleiko 65944a76 (Movement: wyprost ręki, powrót pod kontrolą; parafraza).

**Wskazówki**
- `cpress.base` (nowy) — ACE 338 (krok 5, cytat wyżej); Eleiko 659445eb (Coaching Points: nacisk nóg w podłogę, tułów stabilny; parafraza).

Tylko jedno źródło: ograniczanie skrętu tułowia (Eleiko).

### Machine Shoulder Press

**Ustawienie**
- `msp.seat` (nowy) — ACE 186 (Setup: siedzisko tak, by uchwyty były na wysokości barków lub tuż nad nimi; parafraza); Eleiko 659463af (wariant: hantle siedząc) Setup: ciężary przed barkami.

**Ruch**
- `ohp.move` (istniejący) — ACE 186 (Movement: wyciśnięcie nad głowę, powolne opuszczenie); Eleiko 659463af (wariant: hantle) Movement.

**Wskazówki**
- `ohp.feet` (istniejący) — ACE 186 (Setup: stopy na podłodze lub podnóżkach); Eleiko 659463af (Coaching points: stopy wciskane w podłogę przez całą serię).
- `ohp.fullExt` (istniejący) — ACE 186 (Movement: łokcie prawie proste, nie zablokowane); Eleiko 659463af (Movement: pełny wyprost rąk). Część wspólna: wyprost na górze; „bez gwałtownego blokowania” mówi tylko ACE — tak jak w istniejących wpisach.

### Decline Bench Press — WARUNKOWO

Jedyne źródło opisujące ławkę skośną w dół to Eleiko; drugie (NASM) opisuje wyciskanie na ławce płaskiej. Czy kąt ławki to „wariant”
(liczy się), czy „analogia” (nie liczy się) — pytanie otwarte o regułę, patrz niżej. Bez rozstrzygnięcia: BRAK.

**Ustawienie**
- `bp.grip` (istniejący) — Eleiko 659433c2 (Setup: chwyt nieco szerszy niż barki; parafraza); NASM Barbell Bench Press (wariant: ławka płaska) Step 2 „Grip the bar with hands slightly wider than shoulder-width apart.”

**Ruch**
- `bp.move` (istniejący) — Eleiko 659433c2 „Lower the bar in a controlled manner until the bar touches the chest.”; NASM Barbell Bench Press (wariant) Step 3–4.

**Wskazówki**
- `bp.control` (istniejący) — Eleiko 659433c2 (cytat wyżej); NASM Barbell Bench Press (wariant) Common Mistakes „Lowering the bar too quickly, which reduces time under tension and increases injury risk.”

### Leg Curl

**Ruch**
- `lcurl.move` (nowy) — NASM Seated Leg Curl (Execution; Return: pięty do pośladków, powrót pod kontrolą; parafraza); ACE 131 (wariant: leżąc, z linką) „slowly return your leg back to your starting position”.

**Wskazówki**
- `lcurl.still` (nowy) — NASM Seated Leg Curl (Common Mistakes: przesuwanie lub skręcanie bioder) i NASM Single-Leg Seated Leg Curl (kolano w miejscu); ACE 131 (wariant) „without moving your thigh (the top of your thigh remains on the mat)”.
- `llc.control` (istniejący) — NASM Seated Leg Curl (Common Mistakes: szarpany, niekontrolowany ruch); ACE 131 (wariant) krok 4 (powolny powrót).

Tylko jedno źródło (nie wchodzi): ustawienie wałka tuż nad kostkami i kolan pod kątem ok. 90° (NASM).

### Nordic Curl

**Ustawienie**
- `nordic.setup` (nowy) — van der Horst 2015, s. 2 (Intervention) „The training partner ensures that the player’s feet are in contact with the ground throughout the exercise by applying pressure to the player’s heels/lower legs.”; Chen 2023 (Methodology, pkt 2) „the therapist secured the patient’s ankles in place”; Ripley 2024 (Materials and Methods) „knelt on a padded Nordic bench”.

**Ruch**
- `nordic.move` (nowy) — van der Horst 2015, s. 2 „The player then lowers his upper body to the ground, as slowly as possible to maximize loading in the eccentric phase.”; Ripley 2024 „as slowly as possible to a prone position”; Chen 2023 (powolne pochylanie z oporem tyłu ud).

**Wskazówki**
- `nordic.hips` (nowy) — van der Horst 2015, s. 2 „Players start in a kneeling position, with the torso from the knees upward held rigid and straight.”; Ripley 2024 „with arms held across the chest and hips extended” (zgięcie bioder = powtórzenie nieudane).
- `nordic.catch` (nowy) — van der Horst 2015, s. 2 (ręce hamują upadek i odpychają z powrotem); Ripley 2024 (po utracie kontroli ręce kontrolują opad ruchem jak w pompce).

Bez twierdzeń o zapobieganiu kontuzjom (cel badań — nie przenosimy do aplikacji).

### Wall Sit

**Ustawienie**
- `wall.setup` (nowy) — Lea 2023 (Methods, HR-EX: Baseline testing) „lower their back down a sturdy wall”, (RPE-EX) „moving their feet forward until they reached the squat height marker”; Ng 2026 (Intervention arm) „posture (feet are shoulder width apart, back and head in a neutral position/against the wall)”.

**Wskazówki**
- `wall.back` (nowy) — Lea 2023 „a vertical lower limb and an erect trunk”; Ng 2026 (cytat wyżej).
- `wall.depth` (nowy) — Ng 2026 „allowing individualized exercise progression towards 95° by 10 weeks (the maximum possible intensity)”; Baffour-Awuah 2023 (Clinical implications, Tabela 4) „Isometric wall squat exercise intensity can be reliably adjusted by manipulating knee joint angle”.

Jedno źródło (zespół Wilesa: Lea 2023 i Baffour-Awuah 2023 mają wspólnego autora): „oddychaj normalnie, nie wstrzymuj oddechu” — [OTWARTE], nie wchodzi.
Bez twierdzeń o ciśnieniu tętniczym (tematyka badań — poza aplikacją).

### Back Extension

**Ruch**
- `bext.move` (nowy) — Andersen 2021 (Experimental session) „until the hip angle was approximately 90 degrees”, potem powrót do pozycji wyjściowej; Lyons 2025 (Methods: Session 1) „until a neutral spine angle was achieved”.

**Wskazówki**
- `hinge.back` (istniejący) — Lyons 2025 „a neutral spine position throughout the exercise”; Andersen 2021 „The back had to be straight with a natural sway throughout the whole movement.”
- `bext.noArch` (nowy) — Lyons 2025 (unikanie nadmiernego wyginania; koniec w pozycji neutralnej); Andersen 2021 (plecy proste, powrót do pozycji wyprostowanej).
- `llc.control` (istniejący) — Andersen 2021 „self-selected but controlled tempo”; Lyons 2025 (tempo z metronomu, 4 s na cykl).

Jedno źródło (nie wchodzi): podparcie tuż pod grzebieniami biodrowymi, ręce skrzyżowane na klatce (Lyons: „just below the iliac crest”). Oba badania na ławce 45° — GHD (poziomo) to wariant.

### Preacher Curl

**Ustawienie**
- `preacher.setup` (nowy) — Havers 2025 (sekcja 2.5, test MVC na ławce 65° odwzorowującej modlitewnik: ramię całą powierzchnią na ławce, pacha przy krawędzi; parafraza); Nunes 2020 (2.3) „The elbow was supported on a padded shelf with the shoulder flexed at an angle of 60°, similar to the preacher bench.” Oba opisy pochodzą z ustawień testowych — zaznaczone jako słabsze.

**Wskazówki**
- `preacher.range` (nowy) — Nunes 2020 (2.5) „in the maximum range of motion”; Havers 2025 (2.3: pełny zakres ok. 0–140°).
- `curl.control` (istniejący) — Nunes 2020 (2.5) „a tempo of 1:2 s (concentric and eccentric phases, respectively)”; Havers 2025 (2.3: ok. 2 s faza ekscentryczna, 1 s koncentryczna).

Warianty: Nunes — sztanga i wyciąg, Havers — maszyna; w katalogu ćwiczenie z hantlami.

### Diamond Push Up

**Ustawienie**
- `diamond.setup` (nowy) — Intziegianni 2026 (2.3) „place their hands under their chest in the midline of their sternum”; Marcolin 2015 (Testing Procedures) „the hands stayed together with the right thumb and forefinger touching the left thumb and forefinger”.

**Wskazówki**
- `push.rigid` (istniejący) — Intziegianni 2026 (2.3: prosta linia ciała, napięty brzuch); Marcolin 2015 „A rigid posture with trunk and legs aligned was required for all the variants.”

Jedno źródło: łokcie blisko tułowia, zejście tuż nad podłogę (Intziegianni).

### Pallof Press

**Ustawienie**
- `pallof.setup` (nowy) — ACE 332 „The cable pulley should be at approximately chest height.”; Mullane 2021, s. 4 „Ensure that the band or cable machine is fixed to approximately the mid-torso level.”; Eleiko 659d665d (Setup: bokiem do wyciągu, uchwyt oburącz przy środku tułowia).

**Ruch**
- `pallof.move` (nowy) — ACE 332 (wypchnięcie, przytrzymanie 2–3 s, powolny powrót); Mullane 2021, s. 4 „To begin the movement, slowly extend and press the hands away from the torso, ensuring not to lock out the elbows (Figure 2).”

**Wskazówki**
- `pallof.noTwist` (nowy) — NASM Best Abs (Pallof Press) „The goal is to prevent movement, not create it.”; Eleiko 659d665d „Stay tall through your hips without allowing any movement in your torso.”; Mullane 2021, s. 4 (ćwiczenie antyrotacyjne).
- `plank.brace` (istniejący) — Mullane 2021, s. 4 (tułów napięty, kręgosłup neutralnie); Eleiko 659d665d (Coaching Points: stopy w podłogę, by ustabilizować tułów).

### Reverse Crunch

**Ruch**
- `rcrunch.move` (nowy) — ACE 76 (krok 2–3) „Continue rolling out until your spine and pelvis (hips) contact the mat”; NASM Best Abs (Reverse Crunch: kontrola fazy opuszczania).

**Wskazówki**
- `rcrunch.hips` (nowy) — ACE 76 (wskazówka końcowa: unoszenie miednicy; „Avoid any change in the angle of your knees during the roll-up.”); NASM Best Abs „Focus on lifting the hips rather than simply swinging the legs.”

Jedno źródło: pozycja wyjściowa (kolana nad biodrami, ugięte 90°) — ACE.

### Farmer’s Walk

**Ustawienie**
- `carry.two` (nowy) — ACE 359 „allow the arms to rest along the sides of the body so the dumbbells are next to each hip.”; NSCA Coach 7.3, s. 52 (Exercise Set-Up: równy ciężar w każdej ręce).

**Ruch**
- `carry.walk` (nowy) — ACE 359 (marsz na ustalony dystans i z powrotem); NSCA Coach 7.3, s. 52 „A general rule of thumb for these exercises is to maintain an upright torso, walk slow and controlled, and to avoid any lateral bending of the spine for unilateral exercises.”

**Wskazówki**
- `lunge.torso` (istniejący) — ACE 359 (plecy proste); NSCA Coach 7.3, s. 52 (cytat wyżej); NASM Best Abs (wariant: ciężary nierówne) „Maintain a tall posture and level shoulders throughout the carry.”

### Suitcase Carry

**Ustawienie**
- `carry.one` (nowy) — ACE 358 (ciężar w jednej ręce przy biodrze; parafraza); NSCA Coach 7.3, s. 52 (suitcase carry: ciężar po jednej stronie).

**Ruch**
- `carry.walk` (nowy) — ACE 358 (marsz na ustalony dystans); NSCA Coach 7.3, s. 52.

**Wskazówki**
- `carry.noLean` (nowy) — NASM Best Abs „Clients should walk tall and avoid leaning toward or away from the weight.”; NSCA Coach 7.3, s. 52 (bez bocznego zginania kręgosłupa); ACE 358 (kręgosłup wyprostowany).

Jedno źródło: zmiana ręki po przejściu dystansu (ACE).

### Burpees

**Ruch**
- `burpee.down` (nowy) — NASM Squat Thrust Burpees (Execute/Drive) „Jump or step your feet backward into a push-up position, perform one push-up.”; Polevoy 2022 (2.3 Execution Technique) „Jump back to a push-up position.”; ACE 306 (wariant z BOSU: wyskok nogami w tył do podporu).
- `burpee.up` (nowy) — NASM Squat Thrust Burpees (powrót stopami do dłoni, wyskok); Polevoy 2022 (2.3) „Jump to full hip and knee extension.”; Šiska 2024 (2.3: z przysiadu wyskok — pomocniczo).

Różnica w źródłach (część wspólna nie obejmuje): pompka w podporze — jest u NASM i Polevoy, nie jest wymagana u Šiska. Łatwiejsza wersja (krok zamiast skoku) — tylko NASM.

### Cable Fly (high to low)

**Wskazówki**
- `fly.control` (istniejący) — ACE 161 (Step 4: powolny, kontrolowany powrót); NASM Cable Crossover (wariant: bloczki na wysokości barków) Step 4 „Slowly return the handles to the starting position with control, maintaining tension in the chest.”
- `plank.brace` (istniejący) — ACE 161 (Step 1: napięcie brzucha); NASM Cable Crossover (wariant) Step 2 „engage your core.”

Jedno źródło (ACE 161, nie wchodzi): uchwyty na wysokości czubka głowy, ruch w dół do zetknięcia dłoni poniżej klatki.
Sprzeczność: ACE każe nie pochylać się w przód, NASM (bloczki na wysokości barków) — „lekkie pochylenie”; wskazówka o postawie pominięta.

### Cable Fly (low to high)

**Wskazówki**
- `fly.control` (istniejący) — ACE 163 „allowing your arms to move back outwards in a slow, controlled manner.”; NASM Cable Crossover (wariant) Step 4.
- `plank.brace` (istniejący) — ACE 163 (Step 1: napięcie brzucha); NASM Cable Crossover (wariant) Step 2.

Jedno źródło (ACE 163): „Position the cable handles level with the region between your knees and hips.”; ruch w górę do wysokości twarzy. Ta sama sprzeczność o pochyleniu.

## BRAK — do następnej partii (32)

| Ćwiczenie | Co sprawdzono i dlaczego brak |
|---|---|
| Pec Deck | ACE, NASM, Eleiko — brak opisu; ExRx niedostępny; w badaniach (Europe PMC) brak opisu wykonania |
| Chest Dip | ACE i NASM — brak; McKenzie 2022 (Southern Cross University) celowo bez wskazówek technicznych („No coaching cues were provided at any point.”) |
| Arnold Press | ACE 45 to inne ćwiczenie; NASM, Eleiko — brak; tylko strony aplikacji (odrzucone) |
| Upright Row (hantle) | ACE, NASM, Eleiko — brak opisu |
| Incline Curl (hantle) | brak opisu techniki (artykuł ACE o badaniu wymienia ćwiczenie bez opisu) |
| Concentration Curl (hantle) | jedno źródło: ACE ProSource 08.2014 (ramię oparte o udo); brak drugiego |
| Spider Curl | brak źródeł |
| Skullcrusher (hantle) | ACE 36 to sztanga; wersji z hantlami nie opisuje żadne przeczytane źródło |
| Triceps Kickback | jedno źródło: ACE 55; Mayo Clinic (wersja z taśmą) — 403 |
| Box Squat | Swinton 2012 (szeroki rozstaw, pionowe piszczele) i McBride 2010 (przerwanie cyklu rozciągnięcie–skurcz na skrzyni) — różne aspekty, brak części wspólnej |
| Leg Extension | ACE 183 bez opisu; badania opisują dynamometr (inne urządzenie) albo tylko zakres testu 1RM |
| Sissy Squat | tylko strony nieuznane; brak ACE/NASM/badań |
| Cable Kickback | brak źródeł (ExRx niedostępny) |
| Hip Abduction | brak opisu maszyny w ACE/NASM/Eleiko (Eleiko — tylko ćwiczenia izometryczne bez maszyny) |
| Hip Adduction | jak wyżej |
| Seated Calf Raise | ACE 5771 („Seated Heel Raise”, hantel na udach) — jedno źródło; ACE 294 to wspięcia z prostymi nogami; NASM — analogia (prasa) |
| Ab Wheel | ACE 309 (rollout ze sztangą); NASM Best Abs — bez wskazówek technicznych; brak drugiego |
| Hanging Leg Raise | NASM — tylko jako progresja; McGill 2014 — abstrakt bez opisu wykonania |
| Hanging Knee Raise | jedno źródło: NASM Best Abs („Avoid using momentum to swing the legs upward.”) |
| Cable Crunch | jedno źródło: ACE 331 (wersja stojąca) |
| Hollow Hold | brak źródeł szczebla ≤ 4 |
| Medicine Ball Slam | ACE 182 przeczytany; artykuł NASM o treningach grupowych przekierowuje (niedostępny) — brak drugiego |
| Incline Walk (bieżnia) | nie szukano dokumentacji producentów — poza zakresem tej partii |
| Bieg | jw. — wymaga osobnego researchu (organizacje lekkoatletyczne) |
| Rower | jw. |
| Assault Bike | jw. (dokumentacja producenta niesprawdzona) |
| Skakanka | jedno źródło (ACE, blog) |
| Incline Chest Fly (hantle) | ACE 21 i Eleiko opisują rozpiętki na ławce płaskiej — żadne źródło nie opisuje ławki skośnej |
| Decline Bench Press (hantle) | żadne źródło nie opisuje wersji z hantlami na ławce w dół |
| Floor Press (hantle) | brak opisu (ACE — tylko wzmianka w artykule) |
| Floor Press (sztanga) | brak opisu |
| Squeeze Press (hantle) | brak źródeł |

Uwaga: Decline Bench Press (sztanga) liczy się do kompletu tylko po rozstrzygnięciu pytania o kąt ławki (niżej).
Bez niego kompletów jest 17, a BRAK — 33.

## Podsumowanie — ćwiczenie → liczba wskazówek z ≥ 2 źródłami

| Ćwiczenie | Wskazówki | Status |
|---|---|---|
| Decline Bench Press | 3 | warunkowo (kąt ławki) |
| Pec Deck | 0 | BRAK |
| Wyciskanie na linkach (stojąc) | 3 | komplet |
| Chest Dip | 0 | BRAK |
| Diamond Push Up | 2 | komplet |
| Straight Arm Pulldown | 3 | komplet |
| Back Extension | 4 | komplet |
| Arnold Press | 0 | BRAK |
| Machine Shoulder Press | 4 | komplet |
| Upright Row (hantle) | 0 | BRAK |
| Incline Curl (hantle) | 0 | BRAK |
| Concentration Curl (hantle) | 0 | BRAK |
| Preacher Curl | 3 | komplet |
| Spider Curl | 0 | BRAK |
| Skullcrusher (hantle) | 0 | BRAK |
| Triceps Kickback | 0 | BRAK |
| Box Squat | 0 | BRAK |
| Leg Extension | 0 | BRAK |
| Leg Curl | 3 | komplet |
| Nordic Curl | 4 | komplet |
| Sissy Squat | 0 | BRAK |
| Wall Sit | 3 | komplet |
| Cable Kickback | 0 | BRAK |
| Hip Abduction | 0 | BRAK |
| Hip Adduction | 0 | BRAK |
| Seated Calf Raise | 0 | BRAK |
| Ab Wheel | 0 | BRAK |
| Pallof Press | 4 | komplet |
| Hanging Leg Raise | 0 | BRAK |
| Hanging Knee Raise | 0 | BRAK |
| Cable Crunch | 0 | BRAK |
| Reverse Crunch | 2 | komplet |
| Hollow Hold | 0 | BRAK |
| Farmer's Walk | 3 | komplet |
| Suitcase Carry | 3 | komplet |
| Incline Walk (bieżnia) | 0 | BRAK |
| Bieg | 0 | BRAK |
| Rower | 0 | BRAK |
| Assault Bike | 0 | BRAK |
| Skakanka | 0 | BRAK |
| Burpees | 2 | komplet |
| Medicine Ball Slam | 0 | BRAK |
| Incline Chest Fly (hantle) | 0 | BRAK |
| Decline Bench Press (hantle) | 0 | BRAK |
| Floor Press (hantle) | 0 | BRAK |
| Floor Press (sztanga) | 0 | BRAK |
| Squeeze Press (hantle) | 0 | BRAK |
| Cable Fly (low to high) | 2 | komplet |
| Cable Fly (high to low) | 2 | komplet |
| Single Arm Cable Chest Press | 3 | komplet |

## Otwarte pytania

1. **[OTWARTE] Kąt ławki: wariant czy analogia?** Reguła z docs/27 wymienia jako warianty „siedząc/stojąc, hantle/sztanga”. Czy płaska ławka
   liczy się jako wariant ławki skośnej w dół (Decline Bench Press)? To pytanie o metodę — rozstrzyga audytor merytoryczny, nie właściciel.
   Ta sama odpowiedź dotyczy Incline Chest Fly i Decline Bench Press (hantle).
2. **[OTWARTE] Dostęp do ExRx** — w tym środowisku Wayback Machine jest zablokowany. Następna partia (i ponowna weryfikacja ExRx
   z listy od Gemini) wymaga środowiska z dostępem do web.archive.org.
3. **[OTWARTE] Szczebel NSCA Coach** — zaproponowano 4 (artykuł edukacyjny); jeśli audytor uzna publikacje NSCA za szczebel 2–3, tabela do poprawy.
4. **[OTWARTE] Preacher Curl, ustawienie** — oba źródła opisują ustawienie testu, które odwzorowuje modlitewnik, a nie samo ćwiczenie.
   Jeśli audytor uzna to za za słabe, zostają 2 wskazówki (zakres, tempo) — nadal komplet.
5. **[OTWARTE] Wall Sit, oddech** — tylko zespół Wilesa (2 artykuły); potrzebne niezależne źródło.
6. Ćwiczenia cardio (Bieg, Rower, Incline Walk, Assault Bike, Skakanka) wymagają osobnego researchu (organizacje lekkoatletyczne,
   kolarskie, dokumentacja producentów) — proponuję osobną partię.
