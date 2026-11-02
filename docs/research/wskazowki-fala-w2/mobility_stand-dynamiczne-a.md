# Wskazówki techniki — `mobility_stand`, rozgrzewka dynamiczna, część A (fala W2)

Data: 02.11.2026. Autor: badacz-merytoryczny (agent). Fala W2, grupa G2 (mobilność).

**Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/cues.json`.** Uzupełnia pliki W1 `mobility_stand-dynamiczne.md`
i `mobility_stand-dynamiczne-uzupelnienie.md` po przeliczeniu szczebli z 02.11.2026 (Sport Singapore i CFMWS bez autora → szczebel 5,
więc wymachy nóg, Inchworm i World's Greatest Stretch straciły drugie źródło). Ten plik szuka nowych źródeł szczebla 4 z innych organizacji.

**Metoda.** Czytane strony i PDF-y szpitali (Hartford HealthCare, Dartmouth-Hitchcock, Children's Hospital of Philadelphia) i ACE.
Szczebel 4 szpitali — z samego firmowania (rozstrzygnięcie szczebli, uzupełnienie 2). Ćwiczenie „bez skrętu” albo z innym podparciem liczone
jako „(wariant: …)” z opisem różnicy — do oceny recenzenta. Id zdań z plików W1 użyte bez zmian; nowe zdania w przestrzeni `mobility_stand.d.*`.

## 1. Ćwiczenia

| Ćwiczenie (katalog) | Stan po W1 (przeliczenie) | Stan po W2 | Błędy (źródła / wnioskowane) |
|---|---|---|---|
| Inchworm | otwarte | **gotowe** | 2 / 1 |
| World's Greatest Stretch | otwarte | **gotowe wg definicji, z zastrzeżeniem** — ustawienie i wyprost nogi potwierdzone, skręt z ręką do sufitu dalej jedno źródło (szczebla 5 po przeliczeniu) | 0 / 1 |
| Torso Rotation | częściowe | **gotowe** (wersja z piłką z katalogu: ACE #106; KU — wariant bez piłki) | 0 / 0 |
| Leg Swings (Front-to-Back) | otwarte | **gotowe warunkowo** — drugie źródło to wariant (Dartmouth-Hitchcock: z kijkami, ze skrętem stopy); recenzent ocenia, czy wariant się liczy | 1 / 0 |
| Leg Swings (Side-to-Side) | otwarte | otwarte (tylko KU) | — |
| Groiners | otwarte | otwarte | — |

## 2. Blok do wdrożenia

Pełne wpisy (zastępują wpisy W1 tych ćwiczeń): Inchworm, World's Greatest Stretch, Torso Rotation, Leg Swings (Front-to-Back).
Leg Swings (Side-to-Side) i Groiners — bez wpisu.

```json
{
  "Inchworm": {
    "setup": [
      {"c": "mobility_stand.d.inchStart", "s": [["ace-254", "Step 1–2"], ["w2g2-msa-dh", "s. 3, „Crawl stretch”, zdania 1–2"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.inchWalk", "s": [["ace-254", "Step 3 i Step 5"], ["w2g2-msa-hhc", "„Inch Worm”"], ["w2g2-msa-dh", "s. 3, „Crawl stretch”, zdania 3–5"], ["w2g2-msa-chop", "s. 3, „Inchworm Stretch”"]]}
    ],
    "tips": [
      {"c": "mobility_stand.d.inchLegsStraight", "s": [["w2g2-msa-hhc", "„Inch Worm” (keeping your knees straight)"], ["w2g2-msa-dh", "s. 3, „Crawl stretch” (Keeping your legs straight)"], ["w2g2-msa-chop", "s. 3, „Inchworm Stretch” (keeping your knees straight)"], ["ace-254", "Tips (extended but not locked)"]]},
      {"c": "mobility_stand.d.flatBack", "s": [["ace-254", "Tips (keeping your spine flat)"], ["w2g2-msa-chop", "s. 3, „Inchworm Stretch” (back flat)"], ["w2g2-msa-dh", "s. 3, „Crawl stretch” (back is straight and parallel with the floor)"]]},
      {"c": "mobility_stand.d.inchHeels", "s": [["w2g2-msa-dh", "s. 3, „Crawl stretch” (try to keep your heels on the floor)"], ["w2g2-msa-chop", "s. 3, „Inchworm Stretch” (pushing your heels toward the ground)"]]}
    ],
    "mistakes": [
      {"c": "mobility_stand.d.mis.roundBack", "s": [["ace-254", "Tips (avoid any rounding of your low back)"], ["w2g2-msa-chop", "s. 3 — standard „back flat” (błąd = zaprzeczenie standardu)"], ["w2g2-msa-dh", "s. 3 — standard „back is straight” (jw.)"]]},
      {"c": "mobility_stand.d.inchMisHips", "s": [["ace-254", "Step 4 (do not allow your low back to sag)"], ["w2g2-msa-chop", "s. 3 — standard „back flat” (błąd = zaprzeczenie standardu)"]]},
      {"c": "mobility_stand.d.inchMisKnees", "s": [["wniosek", "mobility_stand.d.inchLegsStraight"]]}
    ]
  },
  "World's Greatest Stretch": {
    "setup": [
      {"c": "mobility_stand.d.wgsLunge", "s": [["ace-140", "Step 2–3 (wariant: bez skrętu)"], ["w2g2-msa-hhc", "„Spider Man Walks”, zdanie 1 (stopa na zewnątrz dłoni; wariant: bez skrętu)"], ["w2g2-msa-chop", "s. 3, „Spider Stretch” (stopa przy dłoni, tylne kolano proste; wariant: bez skrętu)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.wgsHamstring", "s": [["ace-140", "Step 6 (Variation)"], ["w2g2-msa-vail", "s. 2, „Lunge to Hamstring Stretch” (przeczytane w W1)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_stand.d.wgsMisBackKnee", "s": [["wniosek", "mobility_stand.d.wgsLunge"]]}
    ]
  },
  "Torso Rotation": {
    "setup": [
      {"c": "mobility_stand.d.feetApart", "s": [["kuhs-dynamic-stretching", "„4. Trunk Rotations and Side Bends” (shoulder-width; wariant: bez piłki)"], ["w2g2-msa-ace-106", "Starting Position (hip-width)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.torsoTwist", "s": [["kuhs-dynamic-stretching", "„4. Trunk Rotations and Side Bends” (wariant: bez piłki)"], ["w2g2-msa-ace-106", "Step 2 i Step 3 (Variation: proste ręce na wysokości barków)"], ["nhs-sitting", "„Upper-body twist” (wariant: siedząc)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Leg Swings (Front-to-Back)": {
    "setup": [
      {"c": "mobility_stand.d.oneLeg", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings”"], ["w2g2-msa-dh", "s. 4, „Standing hip swings” (wariant: podparcie na kijkach)"]]}
    ],
    "move": [
      {"c": "mobility_stand.d.swingFrontBack", "s": [["kuhs-dynamic-stretching", "„1. Leg Swings”"], ["w2g2-msa-dh", "s. 4, „Standing hip swings” (wariant: ze skrętem stopy, wymach w tył lekko w bok)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "dyn.mis.jerk", "s": [["kuhs-dynamic-stretching", "„Tips for successful stretching” (with control; nie za daleko) — zasada strony"], ["w2g2-msa-dh", "s. 2, „Facts about dynamic stretching” (comfortable range of motion – if you push too hard…) — zasada dokumentu"]]}
    ]
  }
}
```

## 3. Nowe zdania

Zdania W1 użyte bez zmian: `mobility_stand.d.inchWalk`, `.flatBack`, `.inchMisHips`, `.wgsLunge`, `.wgsHamstring`, `.torsoTwist`, `.oneLeg`, `.swingFrontBack` (teksty w pliku W1).

| Id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| mobility_stand.d.inchStart | Stań prosto, pochyl się i oprzyj dłonie płasko o podłogę przed stopami. | Stand tall, bend forward and put your hands flat on the floor in front of your feet. | ACE #254 Step 1–2 (start na stojąco, skłon z bioder, dłonie na podłodze przed sobą); Dartmouth-Hitchcock „Crawl stretch” (Stand straight… Bend over until both hands are flat on the ground). Zastępuje `inchPlank` (podpór „w jednej linii” — tylko ACE). |
| mobility_stand.d.inchLegsStraight | Nogi trzymaj proste. | Keep your legs straight. | HHC, D-H, CHOP („knees/legs straight”); ACE: kolana wyprostowane, nie zablokowane — nie przeczy. Rozbieżność W1 (CFMWS vs ACE) rozstrzyga część wspólna: proste. |
| mobility_stand.d.inchHeels | Staraj się trzymać pięty na podłodze. | Try to keep your heels on the floor. | D-H („try to keep your heels on the floor”), CHOP („pushing your heels toward the ground”). |
| mobility_stand.d.mis.roundBack | Zaokrąglone plecy. | Rounded back. | ACE #254 Tips wprost + zaprzeczenie standardu `flatBack` (CHOP, D-H). Osobne od `mobility_stand.s.mis.roundBack` („przy skłonie”), bo w Inchwormie dotyczy też podporu. |
| mobility_stand.d.inchMisKnees | Mocno ugięte kolana. | Knees bent a lot. | Wnioskowany: zaprzeczenie `inchLegsStraight`. „Mocno”, bo ACE dopuszcza lekkie ugięcie. |
| mobility_stand.d.wgsMisBackKnee | Tylne kolano opada na podłogę. | Back knee dropping to the floor. | Wnioskowany: zaprzeczenie `wgsLunge` („tylna noga wyciągnięta w tył”; CHOP: „keeping your back knee straight”). |
| mobility_stand.d.feetApart | Stań w lekkim rozkroku. | Stand with your feet a little apart. | KU (shoulder-width) i ACE #106 (hip-width) — część wspólna. Zastępuje `feetShoulder` (szerokość barków — tylko KU). |

## 4. Źródła

Źródła z plików W1 użyte ponownie pod tymi samymi id: `ace-254`, `ace-140`, `kuhs-dynamic-stretching`, `nhs-sitting` (adresy i opisy — plik W1).
Szczeble: ACE — organizacja szkoląca trenerów, treść firmowana (precedens; 4); KU Health System, NHS — system ochrony zdrowia (4).

```json
{
  "w2g2-msa-hhc": {"org": "Hartford HealthCare Rehabilitation Network (Sports Medicine)", "title": "Dynamic Stretch Warmup", "url": "https://hartfordhealthcarerehabnetwork.org/services/sports-medicine/conditions-treatments/dynamic-stretch-warmup", "level": 4},
  "w2g2-msa-dh": {"org": "Dartmouth-Hitchcock Rehabilitation Medicine", "title": "Dynamic Stretching for Athletes (nr 201110-240)", "url": "https://www.dartmouth-hitchcock.org/sites/default/files/2020-12/dynamic-stretching-for-athletes.pdf", "level": 4},
  "w2g2-msa-chop": {"org": "Children's Hospital of Philadelphia — Sports Medicine and Performance Center", "title": "Ready. Set. Prevent. (ACL, 2024)", "url": "https://chop.edu/sites/default/files/2024-10/Ready-Set-Prevent-Ortho-ACL_0.pdf", "level": 4},
  "w2g2-msa-ace-106": {"org": "ACE", "title": "Standing Trunk Rotation (#106)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/106/standing-trunk-rotation/", "level": 4},
  "w2g2-msa-vail": {"org": "Vail Health", "title": "Fitness As You Age — Stretches (handout)", "url": "https://www.vailhealth.org/pdf/events/VH_FitnessAsYouAge-Handout-Stretches.pdf", "level": 4}
}
```

| Id | Szczebel i uzasadnienie | Co potwierdza | Cytat kontrolny (≤ 1 zdanie) |
|---|---|---|---|
| w2g2-msa-hhc | 4 — system szpitalny, strona firmowana (© Hartford HealthCare), bez autora i daty (data niewymagana — uzupełnienie 2) | Inchworm: z podporu stopy do dłoni, dłonie z powrotem, kolana proste; WGS (Spider Man Walks): stopa na zewnątrz dłoni | „Starting in a push-up position, keeping your knees straight, inch your feet in towards your hands” |
| w2g2-msa-dh | 4 — szpital (Dartmouth-Hitchcock, Rehabilitation Medicine), dokument firmowany, nr 201110-240; tekst czytelny z pobranego PDF | Inchworm (Crawl stretch): start na stojąco, dłonie płasko, plecy proste, nogi proste, pięty na podłodze; wymachy nóg (Standing hip swings — wariant); zasada „comfortable range” | s. 3: „Keeping your legs straight, "walk" your feet toward your hands.” |
| w2g2-msa-chop | 4 — szpital dziecięcy, program opracowany przez lekarzy i fizjoterapeutów (s. 1), 2024 (metadane PDF) | Inchworm: kolana proste, plecy płaskie, pięty do podłogi; Spider Stretch: stopa przy dłoni, tylne kolano proste | s. 3: „Slowly walk your feet toward your hands, keeping your knees straight and back flat” |
| w2g2-msa-ace-106 | 4 — ACE, treść firmowana | Torso Rotation (piłka lekarska): stopy na szerokość bioder, obrót tułowia w obie strony; wariant z prostymi rękami na wysokości barków = wersja z katalogu | Step 3: „To increase the exercise intensity, fully extend your arms to shoulder height” |
| w2g2-msa-vail | 4 — szpital, treść firmowana, bez daty; **przeczytane w W1** (plik uzupełnienia, tabela „Przeczytane, nieużyte”), w tej sesji nie czytane ponownie | WGS: biodra w tył i wyprost przedniej nogi | — (patrz plik W1) |

**Przeczytane, nieliczone:**
- WebMD, „How to Do Trunk Rotation Exercise” (https://www.webmd.com/fitness-exercise/how-to-do-trunk-rotation-exercise; autorka bez kwalifikacji, recenzja lekarza, 25.11.2024) — warunkowo 4 wg reguły dla serwisów z recenzją, ale kroki 1–4 to parafraza ACE #106 (to samo słownictwo: usztywnij tułów, barki w dół i do tyłu, bez wyginania lędźwi, głowa–klatka–tułów razem) → **zależność od ACE, kopia, nie liczona**. Ta sama grupa co WebMD Ignite.
- NSCA Coach 5.1, Triano i Pellegrini, „Dynamic Warm-Ups for Land-Based Athletes” (https://www.nsca.com/contentassets/11647622285541019ee8ed532743cce5/coach-5.1.4-dynamic-warm-ups-for-the-land-based-athlete.pdf) — szczebel 4 (autorzy CSCS), ale tylko nazwy („Lunge with rotation”, „Inchworm with push-up”, Table 1) i zdjęcia s. 30, bez opisu wykonania.
- McLeod Sports Medicine, „Active Dynamic Warm-Up” (2014, https://www.mcleodhealth.org/wp-content/uploads/2017/01/Dynamic_Warm_Up.pdf) — tylko nazwy ćwiczeń.
- Special Olympics, strona filmu „forward and lateral leg swings” — sam opis filmu, bez instrukcji i autora.
- JSSM 18:282, Table 2 (protokół z „Spiderman”) — opis wykroku z łokciem do pachy, bez skrętu; nie dotyczy ćwiczeń z tego pliku.

## 5. Otwarte i uwagi dla integratora

**Otwarte (z powodem):**
- **World's Greatest Stretch — skręt z ręką do sufitu** (`mobility_stand.d.wgsTwist` z W1) — brak źródła szczebla ≤ 4 (CFMWS spadło do 5). Przeszukane w W2: ACE (biblioteka: tylko #140 bez skrętu, #360 z hantlem), NSCA Coach 5.1 (sama nazwa „Lunge with rotation”), ISSA i NASM (wyszukiwarka nie zwraca stron), HHC, D-H, CHOP (wersje bez skrętu albo skręt na stojąco z piłką), PMC (blokada reCAPTCHA). Znalezione opisy skrętu — wyłącznie szczebel 5 (Physitrack, media, serwisy aplikacji). **Bez skrętu karta nie opisuje istoty ćwiczenia** — rekomendacja: integrator traktuje WGS jako „częściowe” mimo spełnienia definicji, albo właściwa rola rozstrzyga, czy karta bez skrętu może iść do wydania.
- **WGS — wszystkie źródła to warianty bez skrętu** (wykrok z łokciem do stopy, Spider Stretch, Spider Man Walks). Precedens W1 (ACE #140 jako „wariant”), ale recenzent może uznać to za analogię (inne ćwiczenie) — wtedy WGS → otwarte.
- **Leg Swings (Front-to-Back)** — drugie źródło (D-H „Standing hip swings”) różni się: podparcie na kijkach, skręt stopy do środka i na zewnątrz, wymach w tył „i w bok”. Jeśli recenzent nie uzna wariantu → otwarte (zostaje tylko KU). Przeszukane bez skutku: ACE (biblioteka nie ma wymachów nóg; wyszukiwarka nie zwraca), HSS (same nazwy, W1), Nemours, UPMC (przekierowanie), OhioHealth PDF (403), szpitale z listy (UCHealth, Nebraska, Intermountain, Rush, Hopkins, MGB — brak trafień), trusty NHS (tylko ćwiczenia w staniu bez wymachów), Special Olympics (sam film).
- **Leg Swings (Side-to-Side)** — tylko KU; D-H nie ma wymachu w bok. Te same poszukiwania co wyżej.
- **Leg Swings — `dyn.control`** (stopniowo większy zakres) — tylko KU. **Prosty tułów** („Keep your back as straight as possible and try not to turn your body”) — tylko D-H.
- **Inchworm — małe kroki** (`inchSmallSteps`) — wprost tylko ACE (HHC „inch your feet” — za słabe). **Podpór w jednej linii** (`inchPlank`) — tylko ACE; nie wpisano. **Start z podporu** (HHC, CHOP) vs **start na stojąco** (ACE, D-H) — oba warianty poprawne; wpisany start na stojąco (2 źródła), bez sprzeczności.
- **Torso Rotation — chwyt piłki w prostych rękach** — tylko ACE #106 (WebMD = kopia). Karta nie wspomina piłki; zdanie o piłce otwarte. **Głowa, klatka i tułów razem / bez przechylania** — tylko ACE. **Biodra nieruchome** — D-H tylko przy innym ćwiczeniu (skręt w pochyleniu z kijem) → analogia.
- **Groiners** — w katalogu (opis z bazy źródłowej katalogu, W1) to wskok obunóż z podporu stopami do dłoni; żadne przeczytane źródło szczebla ≤ 4 tego nie opisuje. Przeczytane źródła szpitalne pod podobnymi nazwami (HHC „Spider Man Walks”, CHOP „Spider Stretch”) opisują przejście **jedną nogą** do wykroku przy dłoni — inne ćwiczenie. Najbliższa analogia (fragment „squat thrust”/burpee) — nie liczy się.
- Liczby (powtórzenia, dystanse 15–20 jardów, zatrzymanie 2–3 s z D-H) — nie wpisywane.

**Uwagi dla integratora:**
- Inchworm: usuń z wpisu W1 `inchPlank`, `inchSmallSteps` (zdania do pominięcia), wstaw blok wyżej. `inchMisHips` ma teraz ACE + standard `flatBack` (CHOP) — reguła „błąd = zaprzeczenie standardu”; jeśli recenzent uzna, że opadające biodra nie są wprost zaprzeczeniem „pleców prostych”, zostaje `mis.roundBack`.
- Torso Rotation: `feetShoulder` (W1) zastąpione `feetApart`. Katalog wymaga piłki (`lib/catalog.generated.ts:699`: `"requires":[["stability_ball","med_ball"]]`); ACE #106 opisuje dokładnie tę wersję, KU i NHS — warianty bez piłki z tym samym ruchem tułowia.
- Groiners: rozważyć zmianę definicji w katalogu na powszechne znaczenie (wykrok z podporu, stopa przy dłoni) — wtedy HHC + CHOP dają źródła; decyzja należy do właściwej roli, nie do badacza.
- Zestaw ogólny w `lib/figures/v2/cue-sets.json` (wiersze 253, 273, 343, 344, 669, 702: `dyn.control`, `st.breathe`, `dyn.mis.jerk`) dla tych sześciu ćwiczeń jest niepotwierdzony poza `dyn.mis.jerk` przy Leg Swings (Front-to-Back) — jak w W1.

## Stan

- Zrobione (02.11.2026): 6 ćwiczeń przejrzanych; Inchworm i Torso Rotation gotowe; WGS gotowe wg definicji z zastrzeżeniem (brak skrętu); Leg Swings (Front-to-Back) gotowe warunkowo (wariant); Side-to-Side i Groiners otwarte. Nowe zdania: 7. Nowe źródła: 5 (1 przeczytane w W1).
- Pułapki: PDF-y szpitalne (D-H, CHOP, McLeod, NSCA) przez WebFetch nieczytelne — czytelne przez odczyt zapisanego pliku; PMC — reCAPTCHA; Europe PMC REST — 500; OhioHealth — 403; wyszukiwarka biblioteki ACE nie filtruje (zwraca ćwiczenia polecane).
