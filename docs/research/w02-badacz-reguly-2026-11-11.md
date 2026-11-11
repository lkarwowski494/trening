# W-02 — badacz: zakres `lokcie_pod_dlonmi`, glute_floor, pewność mobility_floor i kneeling_hinge (11.11.2026)

Zadanie W-02 z `docs/49-wydanie-1-1.md:40`. Plik danych `data/zrodla/figury-sens.json` i reguły NIE były zmieniane — niżej werdykty i propozycje.

**Sposób odczytu (ważne):** w tej sesji nie było powłoki (brak curl). Wszystkie cytaty są z odczytu narzędziem WebFetch 11.11.2026
(wyjątek: PDF Advocate Aurora — odczyt pobranego pliku PDF z tekstem i zdjęciami). Przed zmianą pewności w danych recenzent niezależny (L-047)
potwierdza brzmienie na surowym tekście (curl). Szczeble: wg docs/18:138, 144, 145 (plik `docs/research/szczeble-organizacji-2026-11-02.md`
nadal nie istnieje na tej gałęzi). Strony nieosiągalne 11.11.2026 (HTTP 403 dla WebFetch): NSCA Basics PDF, ExRx, startingstrength.com, mayoclinic.org.

## Werdykty (skrót)

| Reguła | Rodzina | Obecnie | Werdykt |
|---|---|---|---|
| `lokcie_pod_dlonmi` | overhead_press | ustalone, cały ruch, osie x i z, ≤ 10 cm | **bez zmiany zakresu** (cały tor); [DO USTALENIA] drugie przeczytane źródło dla osi x w środku ruchu; źródło ACE #186 nie zawiera twierdzenia |
| `miednica_bez_skretu` | glute_floor | ustalone (kierunek), źródło = wniosek z ACE #38 | **bez zmiany pewności; zmiana źródła** na bezpośrednie (Clamshell); **mapowanie `clam.noRoll`/`clam.mis.roll` i `fh.level`/`fh.mis.twist` → ta reguła**; dodać do wariantu Fire Hydrant |
| `miednica_bez_przechylu` | glute_floor | analogia | **bez zmiany** (analogia); żadne przeczytane źródło Clamshell/Fire Hydrant nie mówi o przechyle czołowym |
| `czworka_kolana` | mobility_floor | analogia | **zmiana pewności → ustalone (kierunek)**; liczba 70° konwencja |
| `skret_miednica_vs_barki` | mobility_floor | jedno źródło (IT Band) + analogia (Spinal Twist) | **zmiana pewności → ustalone (kierunek) dla Supine Spinal Twist** (uproszczenie: wariant „oba kolana”); IT Band bez zmian (jedno źródło) |
| `plecy` | kneeling_hinge | analogia | **zmiana pewności → ustalone (kierunek)** pod warunkiem przyjęcia szczebla Fitness Volt (warunkowo 4); liczba −20…10° uproszczenie |
| `pochylenie` | kneeling_hinge | analogia | **zmiana pewności → ustalone (kierunek)** przy tym samym warunku; liczba ≥ 30°, ≤ 95° konwencja |

Pozostałe reguły mobility_floor z pewnością „jedno źródło” (np. `siad_prosto`, `posladki_na_pietach`, `kolano_tylne_na_podlodze`) — poza zakresem pytania (pytanie dotyczyło „analogii”), nie badane.

## 1. `lokcie_pod_dlonmi` (overhead_press) — dół i góra czy cały tor?

Kontekst: docs/21:250 (P1-OHP-2), recenzja r3 pkt (d) (`docs/research/recenzje/partia1-overhead_press-r3-audytor-2026-11-10.md:27`), docs/18:363, 367.
Reguła: `data/zrodla/figury-sens.json:2238–2252` (typ `lokiec_pod_chwytem`, osie x i z, ≤ 10 cm, „NSCA Basics s. 42–43 … przez cały ruch”).

### Źródła przeczytane 11.11.2026

| ID | Adres | Szczebel | Cytat (≤ 2 zdania) i miejsce | Faza |
|---|---|---|---|---|
| BB-OHP | https://barbend.com/overhead-press/ (Jake Boly, CSCS; aktualizacja Jake Dickson, NASM-CPT, USAW-L2, 28.07.2026) | warunkowo 4 — spełnione (autor CSCS) | „your forearm should be perpendicular to the barbell when you're in the middle of your press” (część techniki); krok zdjęcia ze stojaków: „your wrists stacked over your elbows”; błąd „Pressing Around the Head”: „if they're not stacked on each other, you won't be as strong and stable.” | środek ruchu (oś z — przedramię prostopadle do gryfu, widok z przodu); start |
| CF-SP | https://www.crossfit.com/essentials/the-shoulder-press (CrossFit, 18.01.2019) | [DO USTALENIA] — CrossFit nie ma szczebla w docs/18; organizacja szkoląca trenerów, bez autora osobowego; nie liczę do pary | „If the elbows are behind the bar, the athlete is more likely to press the bar away from the body.” oraz „pull the chin back and out of the way before pressing the bar.” | faza wyciskania (oś x — łokieć nie za gryfem, raczej lekko przed: „slightly in front of the bar” w ustawieniu); głowa schodzi z toru |
| HL-OHP | https://www.healthline.com/health/overhead-press-muscles (Sara Lindberg; recenzent Micky Lal, MA, CSCS; 20.06.2023) | warunkowo 4 — spełnione (nazwany recenzent CSCS) | „Pippin notes to keep your elbows either directly underneath your wrists or slightly more inward.” (sekcja „Keep your elbows in”) | bez wskazania fazy (oś z) |
| ACE-186 | https://www.acefitness.org/resources/everyone/exercise-library/186/seated-overhead-press/ | 4 | krok 1: „Position your elbows in the 4 and 8 o'clock position”; krok 2: „extending your elbows overhead while maintaining a neutral wrist position” | **nie mówi o łokciu pod nadgarstkiem** — tylko neutralny nadgarstek |

Nieosiągalne 11.11.2026 (403): NSCA Basics 2012 s. 42–43 (zapis „łokcie dokładnie pod dłońmi przez cały ruch” — odczyt innej sesji 26.10.2026),
ExRx DBShoulderPress („Preparation (elbows below wrists)” — wg cues.json:6543 to faza przygotowania), ExRx CBStandingShoulderPress, wątek forum Starting Strength
(wynik wyszukiwarki sugeruje, że „pionowe przedramiona” to wskazówka pozycji startowej — streszczenie wyszukiwarki, nie źródło; nie liczę).

### Wniosek

- **Oś z (widok z przodu) w środku ruchu:** BB-OHP wprost („in the middle of your press”), HL-OHP bez fazy — kierunkowo zgodne, nic nie przeczy. Reguła obejmuje cały tor — zgodnie ze źródłami.
- **Oś x (widok z boku) w środku ruchu:** jedyne przeczytane dziś zdanie o fazie wyciskania to CF-SP — łokieć nie może zostać za gryfem (dopuszczalny lekko przed). Zapis NSCA Basics „przez cały ruch” jest z odczytu 26.10.2026, dziś nie do potwierdzenia. Żadne przeczytane źródło nie zawęża reguły do dołu i góry.
- **Skąd konflikt w figurach siedzących (Ś1-r3):** CF-SP opisuje tor prosty blisko twarzy dzięki cofnięciu głowy („pull the chin back”). Model ma sztywny bark i głowę (r3 pkt d), więc łokieć pod chwytem wypycha chwyt ok. 22 cm przed barki. To ograniczenie modelu, nie zakresu reguły.

**Werdykt: bez zmiany zakresu reguły** (cały tor, osie x i z). Rekomendacja dla P1-OHP-2: zostawić wyjątek toru siedzących (`tests/tor-wyjatki.json`) albo rozszerzyć model (cofnięcie głowy, uniesienie łopatek) — decyzja koordynatora/programisty, nie zmiana reguły.

**Odrzucone alternatywy:** (a) zawężenie reguły do dołu i góry — żadne przeczytane źródło tak nie mówi, a CF-SP zakazuje łokcia za gryfem w fazie wyciskania; (b) poluzowanie progu 10 cm w osi x — źródła nie podają liczby („slightly in front”), więc nowy próg byłby tylko konwencją bez potrzeby źródłowej; (c) próg jednostronny w osi x (łokieć przed gryfem dowolnie) — CF-SP mówi „slightly”, bez granicy; obecne ±10 cm już dopuszcza łokieć 10 cm przed chwytem.

**[DO USTALENIA]:**
- Drugie przeczytane źródło szczebla ≥ 4 dla osi x w środku ruchu (ponowny odczyt NSCA Basics s. 42–43 przez curl albo ExRx CBStandingShoulderPress) — do tego czasu oś x w środku ruchu stoi na NSCA Basics (odczyt 26.10) + CF-SP (szczebel nieustalony).
- **Znalezisko poboczne:** `ohp.elbowsUnder` w `data/zrodla/cues.json:6540–6551, 6588–6598, 8029–8039` podaje ACE #186 jako drugie źródło, a strona ACE #186 nie zawiera twierdzenia „łokieć pod nadgarstkiem” (tylko neutralny nadgarstek i łokcie „4 i 8”). Propozycja: zastąpić ACE #186 przez BB-OHP („wrists stacked over your elbows”; „forearm … perpendicular to the barbell … in the middle of your press”) po recenzji niezależnej. Do tego czasu para źródeł tej wskazówki = ExRx (dziś nieosiągalny) + ACE #186 (nie zawiera) — do sprawdzenia przez recenzenta.
- Szczebel CrossFit (organizacja szkoląca trenerów, strona firmowana) — decyzja koordynatora wg reguły szczebli.

## 2. glute_floor — mapowanie `fh.level` / `clam.noRoll` i pewność reguł miednicy

Kontekst: docs/21:488, 501; `docs/research/glute-floor-pewnosc-regul-2026-11-10.md` (propozycja 5 — pewność `miednica_bez_przechylu` → analogia — jest już w danych, `figury-sens.json:5713`).
Co mierzą pola (`docs/50-figury-v2.md:171, 173`; `lib/figures/v2/contract.ts:79, 156`): `skretTulowia` — skręt klatki względem miednicy, liczony względem ciała (oś długa);
`przechylMiednicy` — przechył w płaszczyźnie czołowej ciała, „prawe biodro wyżej” = przesunięcie biodra ku głowie, przesuwa tylko biodra.

### Źródła przeczytane 11.11.2026

| ID | Adres | Szczebel | Cytat (≤ 2 zdania) i miejsce |
|---|---|---|---|
| NASM-CLAM | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes (Heather Cherry, aktualizacja 22.07.2026) | 4 | „…lifts the top knee as high as possible without allowing the hips to rotate backward.” (instrukcja); FAQ: „maintain stacked hips throughout the movement.” |
| CAT-766 | https://catalystathletics.com/exercise/766/Clamshell/ | 4 | „Without rolling the body, open the hip to lift the top knee as far as possible and return under control.” (opis) |
| ISSA-ABD | https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes (ISSA, 05.02.2024) | 4 | Banded Clamshell: „It is important you do not rotate your hips or lift your left leg off the ground.”; Fire Hydrant: „Raise the leg up as far as you can without rotating or twisting the hips.” |
| ACE-6402 | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ (Angel Chelik, 01.05.2017) | 4 (ACE) | „Maintain a squared-off position in the shoulders and keep your hips level as you continue to move the right leg.” — wariant z uniesioną ręką |
| HL-FH | https://www.healthline.com/health/exercise-fitness/fire-hydrant-exercise (Kirsten Nunez; recenzent Daniel Bubnis, M.S., NASM-CPT; 23.05.2019) | warunkowo 4 — spełnione (nazwany recenzent) | „Keep your core and pelvis stable. Your hip should be the only thing moving.” |

### Werdykt per reguła

- **`miednica_bez_skretu` — Clamshell: bez zmiany pewności („ustalone (kierunek)”), zmiana pola `zrodlo`.** Trzy niezależne źródła szczebla 4 wprost: NASM-CLAM, ISSA-ABD, CAT-766 (obrót miednicy w tył = skręt miednicy względem barków w leżeniu bokiem; „stacked hips” = biodro nad biodrem). Obecne `zrodlo` (wniosek z ACE #38, `figury-sens.json:5728`) zastąpić tymi źródłami. Liczba ±10° — konwencja.
- **Mapowanie `clam.noRoll` / `clam.mis.roll` → `miednica_bez_skretu`.** Źródła tych wskazówek (cues.json:21310–21349: NASM-CLAM, CAT-766) to dokładnie źródła reguły. Propozycja: `wskazowki_na_reguly.clam.noRoll: ["miednica_bez_skretu"]`, `grupy_bledow.clam.mis.roll: "miednica"`.
- **Mapowanie `fh.level` / `fh.mis.twist` → `miednica_bez_skretu` (nie `miednica_bez_przechylu`).** ISSA-ABD mówi o obrocie/skręcie bioder; ACE-6402 łączy „barki ustawione równo” z „biodra poziomo” — w klęku podpartym biodra poziomo przy nieruchomych barkach to brak obrotu miednicy wokół osi długiej względem klatki, czyli `skretTulowia`, nie `przechylMiednicy` (ten w klęku przesuwa biodro ku głowie). Pewność: **ustalone (kierunek)** — ISSA-ABD wprost + ACE-6402 (wariant z uniesioną ręką; nazwane uproszczenie: ruch nogi i miednicy ten sam) + HL-FH pomocniczo. Propozycja: dodać `miednica_bez_skretu` do `warianty["Fire Hydrant"]` (`figury-sens.json:5773`), `wskazowki_na_reguly.fh.level: ["miednica_bez_skretu"]`, `grupy_bledow.fh.mis.twist: "miednica"`. Zmiana zachowania figury → bramka 4 (recenzja ruchu) i test.
- **`miednica_bez_przechylu` — Clamshell i Fire Hydrant: bez zmiany („analogia”).** Żadne przeczytane źródło tych ćwiczeń nie mówi o przechyle czołowym (biodro ku głowie); HL-FH „pelvis stable” jest ogólne i kierunkowo zgodne, ale to jedno źródło warunkowe bez wskazania rodzaju ruchu miednicy. Reguła nie przeczy źródłom (nieruchoma miednica), więc może zostać jako analogia; nie może nieść zdania karty jako „ustalone”.

**Odrzucone alternatywy:** (a) `fh.level` → `miednica_bez_przechylu` — źródła mówią o skręcie, a pole mierzy co innego; (b) usunięcie `miednica_bez_przechylu` z Fire Hydrant — źródła tego nie wymagają (ogólne „pelvis stable” nie przeczy); decyzja produktowa/recenzenta, nie merytoryczna; (c) podniesienie `miednica_bez_przechylu` do „ustalone” przez HL-FH — jedno źródło warunkowe, ogólne.

**[DO USTALENIA]:** potwierdzenie cytatów curl; czy `skretTulowia` w klęku podpartym rzeczywiście rejestruje skręt miednicy przy ustalonych barkach (sprawdzenie programisty na danych póz, nie źródeł); Donkey Kick — kandydat `miednica_bez_skretu` z poprzedniego pliku (EL-DK, HL-DK warunkowo 4) — nie badane dziś.

## 3. Pewność reguł mobility_floor i kneeling_hinge

### 3a. kneeling_hinge (`figury-sens.json:6154–6204`; docs/21:287–288 KH-F1)

Reguły dotyczą tylko Seated Good Mornings (Kneeling Squat — bez reguł, „open”).

| ID | Adres | Szczebel | Cytat (≤ 2 zdania) i miejsce |
|---|---|---|---|
| CAT-184 | https://www.catalystathletics.com/exercise/184/Seated-Good-Morning | 4 | „Set your back tightly in extension and brace the trunk forcefully.”; „Hinge at the hip to bend forward as far as you can without losing the back extension.” (opis) |
| FV-SGM | https://fitnessvolt.com/seated-good-morning/ (Patrick Dale, trener osobisty ok. 30 lat, były Royal Marine; 19.09.2023, zm. 11.08.2024) | warunkowo 4 (docs/18:145, „autor-ekspert”) — [DO USTALENIA] czy kwalifikacje spełniają warunek | „In seated good mornings, maintain a neutral spine and strong back arch throughout.”; „Hinge at the hips with a straight back, lowering your torso until almost parallel to the floor.” |
| PG-SGM | https://theprehabguys.com/vimeo-video/seated-good-morning-dumbbell/ | 5 (warunkowo 4 bez autora na stronie) — nie liczę | „hinge at the hips bringing the dumbbells down towards the ground.” |

- **`plecy`: analogia → ustalone (kierunek)**, jeśli FV-SGM zostanie przyjęty jako szczebel 4 (2 źródła szczebla 4 wprost dla siadu, wyjątek dla wskazówek techniki z 25.10.2026). Oba: plecy bez zaokrąglenia, wyprost/łuk dopuszczony — zgodne z przedziałem −20…10° (ujemne = łuk). Liczba: uproszczenie. Bez przyjęcia FV-SGM: „jedno źródło” (CAT-184), nadal nie „ustalone”. Uwaga: FV-SGM zawiera też twierdzenie zdrowotne („could lead to injury”) — nie przenosić.
- **`pochylenie`: analogia → ustalone (kierunek)** przy tym samym warunku. CAT-184 „tak daleko, jak się da bez utraty wyprostu”, FV-SGM „prawie równolegle do podłogi” — kierunek (tułów wyraźnie w przód z bioder) zgodny; liczba ≥ 30° zmiany, ≤ 95° — konwencja (FV-SGM „prawie równolegle” to jedno źródło, nie podstawa liczby; nic nie przeczy 95°).
- Skutek dla KH-F1: warunek powrotu nakładki (docs/21:288) spełniony dopiero po (1) przyjęciu szczebla FV-SGM, (2) potwierdzeniu cytatów curl, (3) recenzji niezależnej.

**Odrzucone:** PG-SGM jako drugie źródło (brak autora → 5); dalsza analogia do stojącego good morningu (NASM, ExRx) — niepotrzebna, gdy są źródła siadu.

### 3b. mobility_floor (`figury-sens.json:7510–7820`)

Reguły z „analogią”: `czworka_kolana` i część `skret_miednica_vs_barki`. Oba ćwiczenia, których dotyczą (Supine Figure-Four Stretch, Supine Spinal Twist), są dziś wyjątkami bez animacji z powodem „brak przeczytanego źródła pozycji” (`scripts/figures/agent-pozy/mobility_floor.mjs:119–123`), choć ich karty własne mają źródła w `data/zrodla/cues.json:15316–15340, 15593–15620`.

| ID | Adres | Szczebel | Cytat (≤ 2 zdania) i miejsce |
|---|---|---|---|
| CC-PIRI | https://health.clevelandclinic.org/piriformis-syndrome-stretches-exercises (Cleveland Clinic, 01.07.2022; ekspert Robert Catanese, PT, DPT) | 4 (system ochrony zdrowia, docs/18:144) | „Lie flat on your back with both knees bent. Cross your ankle over your opposite knee.” (Ankle-over-knee piriformis stretch) |
| HW-PIRI | https://www.healthlinkbc.ca/healthwise/piriformis-stretch (Healthwise, recenzja m.in. Joan Rigg PT, OCS; 27.02.2023) | 4 | „Lie on your back. Bend your right knee so that your right foot is flat on the floor.”; „Cross your left leg over your right so that your left ankle rests on your right knee.” — ta sama treść Healthwise co `alberta-abk4469` w cues.json (jedno źródło, nie dwa) |
| ATH-F4 | https://athletico.com/?p=27325 (Athletico, 09.03.2016) | 4 (wg cues.json:2702) | wersja początkująca: „Place your feet on the wall so your knees are bent at 90 degrees.” |
| HSS-TR | https://www.hss.edu/health-library/move-better/back-neck-stretches (HSS Rehabilitation and Performance, 17.02.2021) | 4 | Trunk Rotation: „Lying on your back, bend both knees, keeping your feet flat on the bed or the floor.”; „Keep your shoulders in place and do not lift them up as your knees rotate.” |
| AUR-LTR | https://ahc.aurorahealthcare.org/fywb/x20549.pdf (Advocate Aurora Health, X20549 rev. 12/2019) | 4 | krok 1: „Shoulders should remain flat throughout the entire exercise.”; krok 2: „Gently drop your knees to one side and turn your head in the opposite direction.” |
| HPH-LBR | https://livinghealthy.hawaiipacifichealth.org/orthopedics/management/back-exercises-lower-back-rotation (Hawaii Pacific Health; recenzja RN, MD, PT; 01.04.2024) | 4 | „Drop both knees to one side.”; „Keep your shoulders flat on the floor.” |

- **`czworka_kolana` (oba kolana ≥ 70°): analogia → ustalone (kierunek).** CC-PIRI wprost („both knees bent”, kostka na kolanie), HW-PIRI (kolano nogi podporowej zgięte; noga skrzyżowana zgięta — kostka na kolanie), ATH-F4 (kolana 90° w wersji przy ścianie) — 3 niezależne organizacje szczebla 4, nic nie przeczy. Liczba 70° — konwencja (ATH-F4 podaje 90° tylko dla wersji przy ścianie).
- **`skret_miednica_vs_barki` — Supine Spinal Twist: analogia → ustalone (kierunek), nazwane uproszczenie „wariant oba kolana”.** HSS-TR, AUR-LTR, HPH-LBR: barki zostają na podłodze, kolana opadają na bok → skręt miednicy względem barków. Uproszczenie: źródła opisują wariant z obu kolanami zgiętymi (jak karta własna w cues.json:15600 „wariant: oba kolana”); jeśli rysunek Supine Spinal Twist pokazuje inny wariant (np. jedna noga prosta), potrzebne potwierdzenie recenzenta, że ruch miednicy względem barków się nie różni. Liczba ≥ 30° — konwencja. IT Band and Glute Stretch — bez zmiany („jedno źródło”, ACE #232; ćwiczenie i tak jest wyjątkiem bez animacji, `mobility_floor.mjs:124`).
- Skutek: powód wyjątku „brak przeczytanego źródła pozycji” (`mobility_floor.mjs:119`) dla tych dwóch ćwiczeń przestaje być prawdziwy po przyjęciu pewności — zdjęcie wyjątku to decyzja koordynatora (nowe pozy + recenzja ruchu, bramka 4).

**Odrzucone:** liczenie HW-PIRI i `alberta-abk4469` jako dwóch źródeł (ta sama treść Healthwise); strony aplikacji (fizjoterapia cyfrowa, rowery stacjonarne) i Physitrack (5) z wyników wyszukiwania — nieliczone, nieczytane jako źródło.

## Otwarte pytania

- [DO USTALENIA] Potwierdzenie wszystkich cytatów na surowym tekście (curl) — dziś tylko WebFetch.
- [DO USTALENIA] NSCA Basics s. 42–43 i ExRx (shoulder press) — ponowny odczyt; oba 403 dla WebFetch 11.11.2026.
- [DO USTALENIA] Źródła `ohp.elbowsUnder` — ACE #186 nie zawiera twierdzenia (sekcja 1).
- [DO USTALENIA] Szczebel CrossFit (CF-SP) i Fitness Volt / Patrick Dale (FV-SGM) — decyzja wg reguły szczebli (docs/18:138, 145).
- [DO USTALENIA] Co `skretTulowia` mierzy w klęku podpartym przy Fire Hydrant — sprawdzenie programisty na danych póz.
- [DO USTALENIA] Wariant rysunku Supine Spinal Twist (oba kolana czy jedna noga) — przy tworzeniu pozy.

## Sprawdzenie dosłowne (koordynator sesji L, 11.11.2026)

Fragmenty cytatów z tabel (BB-OHP, CF-SP, HL-OHP, NASM-CLAM, CAT-766, ISSA-ABD, ACE-6402, HL-FH, CAT-184, FV-SGM, CC-PIRI, HW-PIRI, ATH-F4, HSS-TR, HPH-LBR, AUR-LTR) odnalezione w surowym tekście stron (`curl -sSL`, HTML bez znaczników; AUR-LTR przez `pdftotext`) — każda strona HTTP 200, każdy fragment 1 trafienie. Cytaty mają więc status „przeczytane dosłownie”. Szczeble oznaczone [DO USTALENIA] (CrossFit, Fitness Volt — Patrick Dale) zostają otwarte.
