# Grafiki ćwiczeń v2 — łokcie przy wyciskaniu, EMG w fazach ruchu, oddech, podglądy podręczników (2026-10)

Badacz merytoryczny, 25.10.2026. Zasady: CLAUDE.md „Merytoryczne podstawy” + decyzje 25.10.2026 (szczebel 4 przy 2 zgodnych źródłach
dla techniki, kątów i prostego oddechu; publicznie bez nazw źródeł). Tylko materiały legalnie dostępne (PMC/otwarty dostęp, abstrakty
Europe PMC, strony organizacji i wydawców). Pliku NSCA Basics z Dysku nie czytałem (w tej sesji brak narzędzia Dysku).
Oznaczenia dostępu: **P** — przeczytany pełny tekst (PMC), **A** — tylko abstrakt (Europe PMC), **S** — strona www przeczytana.
Dane dla animacji: `emg-fazy.json` w tym samym katalogu.

## 1. „Szerokie łokcie (~90°) przy wyciskaniu to błąd / ryzyko dla barku”

### Wniosek

- **Twierdzenie o ryzyku dla barku przy ~90° — NIE potwierdzone na szczeblach 2–3. [OTWARTE] — nie do aplikacji.**
  Jedyne przeczytane badanie, które zmieniało kąt odwiedzenia ramienia (45°/70°/90°) — model mięśniowo-szkieletowy, szczebel 3 —
  pokazało, że wpływ kąta na siły w stawie był **mały i krótkotrwały**, a przy 45° część sił (ścinanie ku górze w stawie
  ramiennym) była **większa** niż przy 70°. Mechanizm „ciasnoty podbarkowej przy 90°” autorzy opisują jako **teorię z anatomii**
  (cytują dwa przeglądy narracyjne z 2001 i 2007 r.), nie wynik pomiaru.
- **Szczebel 4 (2 zgodne źródła):** oba odradzają *skrajne* rozkładanie łokci, bez liczby: jedno — „za szeroko albo za wąsko”,
  drugie — rozkładanie łokci *przez cały ruch razem z dotykaniem wysoko na klatce*. Część wspólna: **łokcie nie skrajnie na boki**.
  Na mocy decyzji z 25.10 to może być wskazówka techniki („nie rozkładaj łokci skrajnie na boki”), ale **bez uzasadnienia
  „bo uraz barku”** — tu wyższy szczebel (3) nie potwierdza, a hierarchia mówi: wygrywa wyższy.
- **Liczba kąta (45°, 75°, 90°) — [OTWARTE].** Żadne przeczytane źródło nie podaje progu ze wsparciem danych.
- **Szerokość chwytu > 1,5 szerokości barków:** model (szczebel 3) — większy nacisk w stawie barkowo-obojczykowym i większe siły
  w stawie ramiennym; przegląd zakresowy (szczebel 2) o osteolizie obojczyka — znaczenie szerokości chwytu **niepewne**
  („hipotezy”). Wniosek: **jedno źródło**, bez twierdzenia o ryzyku w aplikacji.
- **Dla grafiki:** figura w wyciskaniu z łokciami w pośrednim ustawieniu (ani przy tułowiu, ani w linii barków) — **konwencja
  graficzna**; nie pokazywać „90° = błąd” z czerwonym znakiem.

### Źródła (zad. 1)

| # | Źródło | Szczebel | Dostęp | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| B1 | Noteboom L i in. Effects of bench press technique variations on musculoskeletal shoulder loads and potential injury risk. Front Physiol 2024;15:1393235. https://pmc.ncbi.nlm.nih.gov/articles/PMC11224528/ | 3 (n=10, model OpenSim, sztanga 16 kg) | P | Discussion: „shoulder abduction angles were shown to have a smaller effect on the joint reaction forces than grip width and scapula pose.” Results: różnice kąta „only present during very short parts of the bench press cycle”. Discussion (ból podbarkowy): „it might be better to avoid small shoulder abduction angles of 45°”. Ograniczenia: „this study design does not allow for the identification of actual injury risks”. Introduction: mechanizm ciasnoty przy szerokim chwycie i ~90° — „theorized based on anatomical knowledge” (cyt. Durall 2001, Green i Comfort 2007). |
| B2 | Wilkinson M i in. Risk factors and management of atraumatic distal clavicular osteolysis: A scoping review. Shoulder Elbow 2026. https://pmc.ncbi.nlm.nih.gov/articles/PMC13506996/ | 2 (przegląd zakresowy; 8 badań retrospektywnych/serii) | P | Discussion (o szerokości chwytu): „These biomechanical findings should be interpreted as hypothesis-generating”. Wyciskanie najczęstszą aktywnością u chorych (Results). |
| B3 | Kolber MJ i in. Shoulder injuries attributed to resistance training: a brief review. J Strength Cond Res 2010;24(6):1696. PMID 20508476 | 3 (przegląd narracyjny) | A | Abstrakt: czynnik ryzyka „improper attention to exercise technique” — bez wzmianki o wyciskaniu ani kącie. |
| B4 | Fees M i in. Upper extremity weight-training modifications for the injured athlete. Am J Sports Med 1998. PMID 9784824 | 5/3 (perspektywa kliniczna) | A | Abstrakt: omawia „grip, hand spacing, bar trajectory” — bez liczb. Nie liczy się jako potwierdzenie. |
| B5 | NASM Exercise Library: Barbell Bench Press. https://www.nasm.org/resource-center/exercise-library/barbell-bench-press | 4 | S | Common Mistakes: „Positioning elbows too wide or too close, which compromises shoulder mechanics and chest engagement”. |
| B6 | Stronger by Science: How to Bench Press (G. Nuckols). https://www.strongerbyscience.com/how-to-bench/ | 4 | S | Biomechanics / Shoulder flexion: „It's risky for your shoulders (not to mention weaker) to flare through the whole lift and touch the bar high on your chest.” |
| — | Green CM, Comfort P. The affect of grip width on bench press performance and risk of injury. Strength Cond J 2007;29(5):10–14 | 3 (przegląd narracyjny) | **nie przeczytany** (płatny; repozytorium uczelni 403) | Nie liczy się. Znany tylko z cytowania w B1. |

## 2. EMG w fazach ruchu — czy uczciwie animować „napięcie”?

### Wniosek

**Tak, ale wąsko i jako uproszczenie.** Da się uczciwie pokazać dwie rzeczy, trzeciej — nie:

1. **Które mięśnie pracują w danym ćwiczeniu (główne / pomocnicze)** — to już mamy w danych partii (`muscleLoad`, docs/research/24, 25);
   EMG to potwierdza dla wyciskania (szczebel 2), martwego ciągu (szczebel 2), przysiadu, ściągania/podciągania i wiosłowania (szczebel 3).
2. **W fazie opuszczania (ekscentrycznej) te same mięśnie pracują, ale z mniejszym pobudzeniem niż przy podnoszeniu (koncentrycznej)**:
   - martwy ciąg — **ustalone** (przegląd systematyczny, „w każdym przypadku”);
   - zasada ogólna — przegląd fizjologiczny (szczebel 3) + niezależne badania wyciskania (Ateny), przysiadu (Mediolan, Korea),
     ściągania i wiosłowania (Mediolan), podciągania (abstrakt) — **zgodne kierunkowo**;
   - **wyjątki:** w przysiadzie prostowniki grzbietu i część mięśni uda nie zawsze różnią się między fazami (Coratella 2021;
     Park 2022: prostowniki wyżej w opuszczaniu). Dlatego prostowników w przysiadzie nie przyciemniać w opuszczaniu.
3. **NIE da się uczciwie pokazać „zmiany mięśnia dominującego między fazami”** (np. „w opuszczaniu klatka, w wypychaniu triceps”).
   Żadne przeczytane źródło tego nie pokazuje; w tych bojach te same mięśnie hamują ruch w dół i napędzają w górę. Ponadto
   **porównywanie poziomów EMG między różnymi mięśniami jest zawodne** (Vigotsky 2017), a EMG mierzy pobudzenie, nie siłę ani
   „napięcie”. Animacja „napięcia” mięśniowego = **uproszczenie**, nazwane tak w danych.

**Proponowany sposób animacji (do decyzji produktowej):** podświetlenie mięśni wg roli (główny / pomocniczy) przez cały ruch;
w fazie opuszczania jasność głównych nieco niższa niż w fazie podnoszenia (jeden wspólny współczynnik — **konwencja graficzna**, bez
liczby z badań), z wyjątkami oznaczonymi w JSON (`ecc_vs_con: "mieszane"` → bez zmiany jasności). Bez etykiet „% aktywacji”.

Format danych (`emg-fazy.json`): `ćwiczenie → mięsień → { rola, ecc_vs_con, pewnosc, zrodla }`, gdzie
`rola ∈ {glowny, pomocniczy, stabilizujacy}`, `ecc_vs_con ∈ {con>ecc, mieszane, brak_danych}`,
`pewnosc ∈ {ustalone, zgodne_2_zespoly, jedno_zrodlo, uproszczenie, otwarte}`.

### Źródła (zad. 2)

| # | Źródło | Szczebel | Dostęp | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| E1 | Martín-Fuentes I i in. Electromyographic activity in deadlift exercise and its variants. A systematic review. PLoS One 2020. https://pmc.ncbi.nlm.nih.gov/articles/PMC7046193/ | 2 | P | „Concentric and eccentric phases”: „the concentric phase showed greater muscle activation than the eccentric phase for every single case”. Conclusions: „Erector spinae and quadriceps muscles are more activated than gluteus maximus and biceps femoris”. |
| E2 | Stastny P i in. A systematic review of surface electromyography analyses of the bench press movement task. PLoS One 2017. https://pmc.ncbi.nlm.nih.gov/articles/PMC5295722/ | 2 | P | Results: „TB and PM have similar activity during the BP, which is significantly higher than the activity of AD.” Brak zestawienia faz (jest tylko pojedyncze badanie Keogh 1999). |
| E3 | Duchateau J, Enoka RM. Neural control of lengthening contractions. J Exp Biol 2016;219:197. https://journals.biologists.com/jeb/article/219/2/197/33460/ | 3 (przegląd narracyjny) | S (pełny tekst na stronie wydawcy) | Methodological issues: „muscle activity assessed by surface electromyography (EMG) is usually less during the lengthening phase of the movement”. |
| E4 | Vigotsky AD i in. Interpreting Signal Amplitudes in Surface Electromyography Studies in Sport and Rehabilitation Sciences. Front Physiol 2017. https://pmc.ncbi.nlm.nih.gov/articles/PMC5758546/ | 3 (przegląd metodologiczny) | P | „One should be wary when attempting to compare excitation patterns of different muscles, especially during dynamic efforts.” (Within-subject, between-muscles). |
| E5 | Tsoukos A i in. (eccentric vs concentric, bench press to failure). J Hum Kinet 2023. https://pmc.ncbi.nlm.nih.gov/articles/PMC10407316/ | 3 (n=10, Smith, 40% i 80% 1RM, %MVIC) | P | Results, sEMG Activity: „sEMG was higher during the CON compared with the ECC phase in both muscles” (klatka, triceps; naramienny nie mierzony). |
| E6 | Coratella G i in. Gluteal, thigh, and lower back muscles in different squat variations… Int J Environ Res Public Health 2021. https://pmc.ncbi.nlm.nih.gov/articles/PMC7831128/ | 3 (n=10 kulturystów, %MVIC) | P | Results (pośladkowy wielki): „greater normalized RMS was found during the ascending vs. descending phase in all exercises”; uda i prostowniki — różnice tylko w części wariantów. |
| E7 | Park JH i in. Loads and loading position… squat. Int J Environ Res Public Health 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC9602963/ | 3 (n=28, 50–70% 1RM) | P | Tabele 2–5: faza koncentryczna wyżej dla VM, VL, RF, BF, mięśni brzucha; prostowniki grzbietu wyżej w ekscentrycznej (np. 70% 1RM HBBS: 28,5 vs 26,6). Cytat metodyczny: „the data obtained from each muscle were quantified using MVC.” |
| E8 | Park JH i in. Barbell position and squat depth… Medicina 2026. https://pmc.ncbi.nlm.nih.gov/articles/PMC13413768/ | 3 (n=22, 80% 1RM) | P | Tabele 3 i 6: średnie koncentryczne wyższe niemal wszędzie (autorzy nie testują fazy jako czynnika — to mój odczyt średnich). Prawdopodobnie ten sam zespół co E7 → liczyć jako jeden zespół. |
| E9 | Coratella G i in. Romanian, step-Romanian and stiff-leg deadlift. Int J Environ Res Public Health 2022. https://pmc.ncbi.nlm.nih.gov/articles/PMC8835508/ | 3 | P | Discussion (tło, nie wynik): „the descending phase implies overall eccentric actions that require less muscle excitation than concentric actions”. |
| E10 | High-Density Electromyography Excitation in Front vs. Back Lat Pull-Down Prime Movers. J Hum Kinet 2024. https://pmc.ncbi.nlm.nih.gov/articles/PMC11057623/ | 3 (n=14, 8RM) | P | Results: „The descending phase exhibited greater nRMS compared to the ascending phase in all muscles” (w ściąganiu faza „w dół” = koncentryczna). Zespół Coratelli. |
| E11 | Padovan R i in. HD-sEMG of prime movers across scapular positions in the seated row. J Funct Morphol Kinesiol 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12821611/ | 3 (n=14, 8RM) | P | Ryc. 4: „nRMS was greater during the concentric than the eccentric phase for all muscles.” Zespół Coratelli. |
| E12 | Dickie JA i in. Electromyographic analysis of muscle activation during pull-up variations. J Electromyogr Kinesiol 2017. PMID 28011412 | 3 | A | Abstrakt: „The concentric phases of each pull-up variation resulted in significantly greater EMGARV of the brachioradialis” (także dwugłowy i piersiowy; o najszerszym abstrakt nie mówi). |
| E13 | Snarr RL i in. Electromyographical comparison of a traditional, suspension device, and towel pull-up. J Hum Kinet 2017. https://pmc.ncbi.nlm.nih.gov/articles/PMC5548150/ | 3 (n=15) | P | Faz nie rozdzielono („the breakdown of concentric and eccentric phases was not analyzed”); całe powtórzenie %MVC: najszerszy 80, aktony tylne 106, czworoboczny środkowy 61, dwugłowy 44. |

Zespoły niezależne: Mediolan (E6, E9, E10, E11), Korea (E7, E8 — prawdopodobnie jeden), Ateny (E5), Dickie (E12), przeglądy E1, E2 (Praga — Stastny, ten sam
ośrodek co badania oddechu O1, O2), E3, E4. Wiosłowanie i ściąganie — tylko zespół mediolański → **jedno źródło** (zespół); podciąganie — E12
(abstrakt) + analogia do ściągania (E10) → **uproszczenie (analogia)**.

## 3. Oddech przy ciężkich bojach wielostawowych

### Wniosek

**Źródła szczebla 2–3 nie dają jednego przepisu.** Przegląd systematyczny opisuje mechanizm i ryzyka, ale nie zaleca konkretnego
wzorca oddechu; badania szczebla 3 dochodzą do różnych zaleceń. Zakres zgody:

1. **Wstrzymanie oddechu / próba Valsalvy podnosi ciśnienie w jamie brzusznej i klatce, co usztywnia tułów** — szczebel 2 (O1),
   „studies agree”. **Ustalone** (jako mechanizm).
2. **Ten sam manewr mocno podnosi ciśnienie tętnicze**; ryzyko dla zdrowych uznawane za niskie, ale **niepotwierdzone**
   (O1; przegląd O4). Dla osób z nadciśnieniem i chorobami naczyń — ryzyko (O1). → W aplikacji: **tylko odesłanie do specjalisty**,
   bez porad.
3. **Wdech w trakcie wysiłku (przy podnoszeniu) pogarsza wynik** — dwa niezależne zespoły (O2 — Praga, wyciskanie 1RM;
   O3 — Turcja, wyciskanie ~90% 1RM). **Zgodne, 2 zespoły, szczebel 3.**
4. **Różnica:** O2 — Valsalva i „lung packing” skracają strefę martwą, zalecenie wg preferencji zawodnika; O3 — „wydech jest
   najbezpieczniejszy”, choć ciśnienie krwi **nie różniło się** między strategiami w tym badaniu (n=12). Szczebel 4 (SBS) —
   wstrzymanie oddechu przez całe powtórzenie przy wyciskaniu.

**Co może wejść (zgodnie z decyzją 25.10 o „prostym oddechu”):** „nie wciągaj powietrza w trakcie podnoszenia” — część wspólna O2 i O3
(szczebel 3, 2 zespoły). Zalecenie „wstrzymaj oddech przy ciężkich powtórzeniach” albo „zawsze wydychaj przy wysiłku” —
**[OTWARTE]**: źródła się różnią; jeśli w ogóle, to jako opis dwóch dopuszczalnych sposobów + zdanie o specjaliście przy
nadciśnieniu / chorobach serca. Stanowisk NSCA i AHA (2007) **nie przeczytałem** (płatne / blokada 403) — [OTWARTE].

### Źródła (zad. 3)

| # | Źródło | Szczebel | Dostęp | Miejsce i cytat (≤ 1 zdanie) |
|---|---|---|---|---|
| O1 | Blazek D i in. Systematic review of intra-abdominal and intrathoracic pressures initiated by the Valsalva manoeuvre during high-intensity resistance exercises. Biol Sport 2019. https://pmc.ncbi.nlm.nih.gov/articles/PMC6945051/ | 2 (16 badań) | P | Discussion: „Studies agree that increased IAP and ITP lead to greater stabilization of the trunk.” Ryzyka: wzrost ciśnienia, spadek przepływu mózgowego; ostrzeżenie dla nadciśnienia i anomalii naczyń mózgowych. |
| O2 | Blazek D i in. The effect of breathing technique on sticking region during maximal bench press. Biol Sport 2021;38(3). https://pmc.ncbi.nlm.nih.gov/articles/PMC8329978/ | 3 (n=24, trenujący ≥ 3 lata) | P | Conclusion: „The authors suggest that the REVB should not be used during 1 RM lifts.” (REVB = wdech w fazie koncentrycznej, Methods). Ciśnienia nie mierzono. |
| O3 | Deniz IE i in. Influence of breathing strategies on maximal strength output and hemodynamic parameters during bench press exercise. BMC Sports Sci Med Rehabil 2025. https://pmc.ncbi.nlm.nih.gov/articles/PMC12801646/ | 3 (n=12, ~4RM) | P | Conclusion: „Exhalation remains the safest and most effective strategy for maintaining performance and minimizing cardiovascular strain” — ale ciśnienie skurczowe/rozkurczowe bez istotnych różnic (Results); wdech przy podnoszeniu = mniej serii i mniejsza objętość. |
| O4 | Hackett DA, Chow CM. The Valsalva maneuver: its effect on intra-abdominal pressure and safety issues during resistance exercise. J Strength Cond Res 2013. PMID 23222073 | 3 (przegląd narracyjny) | A | Abstrakt: „The health risks associated with the VM during resistance exercise remain unconfirmed.” |
| O5 | Stronger by Science: How to Bench Press. https://www.strongerbyscience.com/how-to-bench/ | 4 | S | Ascent: „Hold your breath throughout the duration of the rep.” |
| — | NASM Barbell Bench Press (B5) | 4 | S | O oddechu nic (tylko „Engage your core”). |
| — | ACSM position stand 2026 (infografika) https://acsm.org/wp-content/uploads/2026/03/Resistance-Training-Position-Stand-infographic.pdf | 2 | S | Infografika nie mówi o oddechu; pełnego tekstu stanowiska nie czytałem. |

## 4. Podręczniki — legalne podglądy i ceny (sprawdzone 25.10.2026)

| Książka | Format | Cena | Adres | Podgląd |
|---|---|---|---|---|
| NSCA „Essentials of Strength Training and Conditioning”, 5. wyd. (Human Kinetics, ©2027 na stronie; Google Books: 2026), 864 s. | e-book (epub, VitalSource, z HKPropel), **dostęp 10 lat** | **89,00 USD** | https://us.humankinetics.com/products/essentials-of-strength-training-and-conditioning-5th-edition-epub | Brak rozdziału próbnego; spis treści (26 rozdz.), 4 próbki wideo; zakładka „Excerpts” to osobne artykuły, nie rozdziały. Google Books: „limited preview” tylko spis treści i indeks (https://books.google.com/books?vid=ISBN9781718216280). |
| j.w. | twarda + zasoby online | 119,00 USD (wg wyszukiwarki; strony produktu nie otwierałem) | us.humankinetics.com | — |
| NSCA „Exercise Technique Manual for Resistance Training”, 4. wyd. | e-book (epub) | **67,00 USD** | https://us.humankinetics.com/search?q=exercise+technique+manual+for+resistance+training | najbardziej przydatna do techniki/kątów (opisy ćwiczeń) |
| j.w. | papier + wideo online | 89,00 USD | j.w. | — |
| ACSM „Guidelines for Exercise Testing and Prescription”, 12. wyd. (Wolters Kluwer, 24.03.2025) | **Digital Instant Access** | **59,37 USD** | https://shop.lww.com/ACSM-s-Guidelines-for-Exercise-Testing-and-Prescription--12e--Lippincott-Connect-Print-Book-and-Digital-Access/p/9781975257637 | Przycisk „Preview” bez treści; Google Books: brak e-booka i podglądu dla 12. wyd. Warunki licencji cyfrowej (czas dostępu) — niesprawdzone. |
| j.w. | papier | 62,53 USD; pakiet papier + Lippincott Connect 79,98 USD | j.w. | — |

Uwaga: Human Kinetics poza USA (Europa) dystrybuuje Mare Nostrum — cena w UE może się różnić. Wcześniejszy zapis (docs/18, 09.10):
ETM 67 USD, Essentials 89 USD — bez zmian. Dla grafik i techniki (zad. 1, oddech) najwięcej dałby **ETM** (opisy ćwiczeń z
ustawieniem łokci i oddechem); ACSM Guidelines dotyczą głównie testów i zaleceń zdrowotnych, mniej techniki.

## Otwarte pytania

1. [OTWARTE] Liczbowy kąt łokci/ramienia przy wyciskaniu (45°/75°) — brak źródła z danymi; sprawdzić w ETM (jeśli zakup) i NSCA Basics (Dysk).
2. [OTWARTE] Ryzyko urazu barku przy szerokim rozłożeniu łokci — brak danych prospektywnych (B1, B2 wprost).
3. [OTWARTE] Zmiana dominującego mięśnia w obrębie fazy (np. triceps pod koniec wypychania, strefa martwa) — tylko wzmianka w E2; nie animować.
4. [OTWARTE] Wiosłowanie sztangą w opadzie i podciąganie — brak przeczytanego badania z rozdziałem faz dla najszerszego (E12 tylko abstrakt, bez najszerszego).
5. [OTWARTE] Stanowiska NSCA (Essentials/ETM — zasady oddechu) i AHA 2007 — nieprzeczytane; mogą rozstrzygnąć „wydech przy wysiłku” vs „Valsalva u zaawansowanych”.
6. Decyzja produktowa (właściciel): czy animować różnicę faz w ogóle. Opcja A — tylko podświetlenie ról (pewne, proste); opcja B — role +
   przyciemnienie w opuszczaniu z wyjątkami z JSON (więcej informacji, wymaga etykiety „uproszczenie”). Rekomendacja: A teraz, B po
   uzupełnieniu pkt 4.
