# Audyt wskazówek makiety silnika figur (CUES_CATALOG) — 25.10.2026

Zakres: `makieta/engine.js`, stała `CUES_CATALOG` (16 pozycji, l. 1036–1053), przypisania `primaryCue`/`faultCue`
w `compileCatalogEntry` (l. 719–1002) i domyślne tempo (l. 1001). Mięśnie — osobno w `miesnie-wzorce.md`, oddech i tempo — `oddech-tempo.md`.

Zasada (CLAUDE.md, „Merytoryczne podstawy”): źródło przeczytane; ≥ 2 niezależne źródła albo 1 źródło szczebla 1–2 z twierdzeniem
wprost; szczebel 3–5 pojedynczo → „jedno źródło”; analogia → „uproszczenie”. Dopisek właściciela (25.10.2026): tekst dla
użytkownika naturalny, jak od trenera, bez żargonu („retrakcja”, „knee valgus”, „przeprost lędźwi”); rygor w danych i w docs.

Skróty źródeł: identyfikatory wskazówek (`hinge.back` itd.) to istniejące, sprawdzone zdania z `lib/cues/text/pl.json`;
ich źródła (adres + miejsce) są w `docs/research/27-wskazowki-zrodla.md`. Źródła przeczytane w tej sesji (25.10.2026) podane
z adresem i cytatem.

## Wynik w skrócie

| Kategoria | Liczba | Pozycje |
|---|---|---|
| (a) potwierdzone (po kosmetyce językowej) | 5 | pushup_core_brace (bez „pośladków”), bench_arch_scap, hinge_neutral_back, pull_scap_depress, spine_flex_crunch |
| (b) do przeformułowania (sedno ma źródła, ale żargon, język medyczny, dopowiedzenia przyczynowe albo kilka błędów w jednym) | 8 | pushup_hip_sag, squat_heel_lift, squat_butt_wink, knee_track_toe, knee_valgus_err, hinge_rounded_back, spine_hip_flex_err, squat_midfoot |
| (c) bez źródła / sprzeczne źródła → otwarte | 3 | elbow_tuck_45 (liczba 45°), elbow_flare_90 (liczba 90° jako błąd), pull_shrug_err (jako „częsty błąd” przy przyciąganiu) |

Ważniejsze od treści: **przypisanie wskazówek do ćwiczeń w makiecie jest w wielu miejscach błędne** (sekcja 3) — m.in. przy
wspięciach na palce błędem jest „odrywanie pięt” (czyli sam ruch), a przy szrugsach wskazówka „barki w dół, z dala od uszu”
(odwrotność ruchu). To błędne twierdzenia merytoryczne, więc według progu wydania (CLAUDE.md, Audyty pkt 1) — KRYTYCZNE/WYSOKIE,
gdyby weszły do aplikacji.

## 1. Pozycja po pozycji

Kolumna „Tekst dla użytkownika” to propozycja (naturalna, krótka); twierdzenie i źródło zostają w danych.

### 1.1 pushup_core_brace — „✓ Napnij brzuch i pośladki — utrzymuj sztywną linię od pięt do barków.”
- Werdykt: **(a) potwierdzone bez „pośladków”**.
- Twierdzenie: przy pompce tułów usztywniony napięciem brzucha, ciało w jednej linii.
- Źródła (przeczytane 25.10.2026): ACE Push Up #41, https://www.acefitness.org/resources/everyone/exercise-library/41/push-up/ — Step 2:
  „Stiffen your torso by contracting your core/abdominal muscles ("bracing").”; NASM Push Up, https://www.nasm.org/resource-center/exercise-library/push-up
  — Step 2: „Create a straight line from your head to heels, maintaining a neutral spine throughout the movement.”
  W repo: `plank.brace`, `push.setup`, `push.rigid`.
- „Pośladki” — w tych źródłach przy pompce brak (ACE wspomina pośladki przy desce bocznej, nie przy pompce) → usunąć.
- Tekst dla użytkownika: **„Napnij brzuch — ciało w jednej linii od głowy do pięt.”**
- Przypisanie: pompki, deska, wiosłowanie odwrotne — tak (dla deski i wiosłowania odwrotnego są własne zdania `plank.*`, `inv.rigid`).
  Pallof, „drwal”, skłony boczne (rig standingCore) — **nie** (inny ruch; dla Pallofa jest `pallof.noTwist`).

### 1.2 pushup_hip_sag — „✕ CZĘSTY BŁĄD: Zapadnięte biodra w dół (przeprost lędźwi i brak aktywacji core)!”
- Werdykt: **(b) przeformułować**. Sedno (biodra opadają) — źródła: NASM Push Up, Common Mistakes: „Allowing the hips to sag, which
  indicates core disengagement and reduces effectiveness”; ACE #41, Step 3: „Do not allow your low back to sag or your hips to hike
  upwards during this downward phase.” (oba przeczytane 25.10.2026). W repo: `push.rigid`, `plank.mis.sag`.
- Do usunięcia: „przeprost lędźwi” (żargon, brzmi medycznie), „brak aktywacji core” (przyczyna — tylko NASM, jedno źródło; nie jest
  potrzebna użytkownikowi), wykrzyknik i wielkie litery (ton pouczający).
- Tekst: **„Biodra opadają albo idą w górę.”** (oba kierunki — ACE).

### 1.3 elbow_tuck_45 — „✓ Prowadź łokcie pod kątem ~45° względem tułowia i ustabilizuj łopatki.”
- Werdykt: **(c) liczba 45° otwarta; łagodna wersja bez liczby — tylko dla wyciskania leżąc.**
- Źródła przeczytane 25.10.2026:
  - NASM Barbell Bench Press, https://www.nasm.org/resource-center/exercise-library/barbell-bench-press — Common Mistakes:
    „Positioning elbows too wide or too close, which compromises shoulder mechanics and chest engagement” (bez liczby).
  - Stronger by Science, How to Bench, https://www.strongerbyscience.com/how-to-bench/ — FAQ „How much should I tuck my elbows?”:
    „In general, the angle between your upper arm and torso should be around 45-60 degrees.” (szczebel 4, jedno źródło dla liczby).
  - NASM Push Up — Step 3: „Keep your elbows at approximately 45 degrees from your body.”
  - ACE Push Up #41 — Step 3: „Allow your elbows to flare outwards during the lowering phase.” → **sprzeczność na szczeblu 4** przy pompkach.
  - Noteboom i in. 2024, Front Physiol 15:1393235, https://pmc.ncbi.nlm.nih.gov/articles/PMC11224528/ (szczebel 3, 10 osób, model
    mięśniowo-szkieletowy; porównano odwiedzenie 45°, 70°, 90°) — wyniki: „a small abduction angle of 45° led to larger glenohumeral
    superior shear force components”; kąt odwiedzenia miał mniejszy wpływ niż szerokość chwytu i ustawienie łopatek; autorzy:
    „this study design does not allow for the identification of actual injury risks”.
  - Przegląd zakresowy cech wyciskania (PLoS One 2024, https://pmc.ncbi.nlm.nih.gov/articles/PMC11554178/) — technika to jedna z najmniej
    zbadanych dziedzin; kąt odwiedzenia barku tylko w jednym badaniu, związek z wynikiem „unclear”.
- Wniosek: brak źródła szczebla 1–2; na szczeblu 4 przy wyciskaniu leżąc liczba tylko w SBS (45–60°), przy pompkach NASM vs ACE
  sprzeczne. Część wspólna dla wyciskania leżąc (NASM + SBS): łokcie ani maksymalnie na boki, ani przyklejone. **Liczby 45° nie
  pokazywać** ani w tekście, ani jako „poprawny” kąt na rysunku (rysunek może mieć łokcie pośrodku jako uproszczenie ilustracyjne,
  jak w docs/research/28: „Wskazówki nie podają kąta łokci względem tułowia”).
- „Ustabilizuj łopatki” — mgliste; jest sprawdzone `bp.blades` („Ściągnij łopatki do siebie i w dół…”).
- Tekst (tylko wyciskanie leżąc/skos, 2 źródła szczebla 4 — NASM, SBS): **„Łokcie trochę bliżej tułowia — nie rozkładaj ich szeroko na boki.”**
- Przypisanie w makiecie błędne dla: uginania ramion (właściwe `curl.elbows`), unoszenia bokiem/przodem (`lat.elbows`), francuskiego
  wyciskania (`skull.upperArm`, `ote.elbowsIn`), rozpiętek (`fly.elbows`), pullovera (brak zdań — otwarte), wyciskania nad głowę
  (`ohp.elbowsUnder`), prostowania na wyciągu (`tpd.elbows`).

### 1.4 elbow_flare_90 — „✕ CZĘSTY BŁĄD: Rozszerzanie łokci do 90° i rozklejone łopatki!”
- Werdykt: **(c) bez źródła dla liczby 90° jako błędu.** Żadne przeczytane źródło nie nazywa 90° błędem; NASM mówi tylko „too wide”
  (wyciskanie) i „Elbows flaring too wide” (pompka, Common Mistakes); Noteboom 2024 (wyżej) nie wskazuje 90° jako gorszego.
  „Rozklejone łopatki” — brak źródła jako „częsty błąd” (jest tylko wskazówka pozytywna `bp.blades`).
- Tekst (wyciskanie leżąc; NASM + SBS): **„Łokcie uciekają szeroko na boki.”** — bez liczby. Dla pompek: [OTWARTE] (ACE dopuszcza łokcie na zewnątrz).
- Uwaga językowa: NASM uzasadnia błąd „shoulder stress” — to twierdzenie zdrowotne, do aplikacji nie przenosimy.

### 1.5 bench_arch_scap — „✓ Wbij łopatki w ławkę (retrakcja) i zaprzyj całe stopy stabilnie o podłoże.”
- Werdykt: **(a) potwierdzone**, przeformułować język. Źródła: NASM Barbell Bench Press — Step 2: „Engage your core, retract your
  shoulder blades, and maintain a neutral spine throughout the movement.”; Step 1: „Position your feet slightly wider than
  shoulder-width apart for stability.” (przeczytane 25.10.2026). W repo: `bp.blades` (NASM, SBS, ACE), `bp.contact` (ACE, NASM).
- Nazwa klucza „arch” — łuk lędźwiowy nie ma źródła jako zalecenie; nadmierny łuk to w repo **błąd** (`bp.mis.arch`). Nie rysować
  wygiętych lędźwi jako wzorca.
- Tekst: **„Ściągnij łopatki i oprzyj je o ławkę. Stopy płasko na podłodze.”**

### 1.6 squat_midfoot — „✓ Środek ciężkości w linii pionowej nad śródstopiem, pełna kontrola w całym zakresie.”
- Werdykt: **(b) jedno źródło + mechanika; przeformułować**. SBS How to Squat, https://www.strongerbyscience.com/how-to-squat/ — sekcja
  „Creating full-body tension”: „This will help ensure you keep your balance, and it will keep your center of mass over mid-foot.”
  (przeczytane 25.10.2026; szczebel 4, jedno źródło). Mechanika: w równowadze rzut środka ciężkości mieści się w podstawie podparcia —
  kierunkowo zgodne, ale „nad śródstopiem” to zawężenie (uproszczenie). Przy martwym ciągu „nad środkiem stopy” ma 3 źródła (`dl.feet`).
- Dla użytkownika lepiej to, co ma 2+ źródła: `sq.down` („…wstań, wypychając podłogę całymi stopami”) i `sq.mis.heels`.
- Tekst: **„Cała stopa na podłodze — pięty też.”**
- Przypisanie błędne: makieta daje tę wskazówkę **wspięciom na palce** (sprzeczne z ruchem).

### 1.7 squat_heel_lift — „✕ CZĘSTY BŁĄD: Odrywanie pięt i utrata stabilności stawu skokowego!”
- Werdykt: **(b)**. Sedno potwierdzone: `sq.mis.heels` (ACE Bodyweight Squat #135 Step 4/6; ExRx BBFullSquat Comments; NASM Dumbbell
  Front Squat Common Mistakes — docs/research/27). „Utrata stabilności stawu skokowego” — brak źródła, brzmi medycznie → usunąć.
- Tekst: **„Pięty odrywają się od podłogi.”**
- Przypisanie: **KRYTYCZNE** — makieta używa tego błędu dla wspięć na palce (Standing/Seated Calf Raise itd.), gdzie unoszenie pięt
  jest celem ruchu. Dla łydek: `calf.move`, `calf.pause`, `calf.mis.partial`.

### 1.8 squat_butt_wink — „✕ CZĘSTY BŁĄD: Podwinięcie miednicy na dole (Butt-wink), oderwane pięty i ucieczka kolan!”
- Werdykt: **(b) rozbić na trzy i przeformułować**.
  - „Butt wink”: SBS How to Squat (przeczytane 25.10.2026), odpowiedź „What do I do about buttwink?”: „this increases shear forces on
    the spine, and should be avoided as much as possible.” — jedno źródło szczebla 4, uzasadnienie biomechaniczno-zdrowotne (nie do
    aplikacji). Wersję neutralną mają 2+ źródła: `sq.depth` („Schodź tak nisko, jak pozwala ruchomość przy prostych plecach…” — ACE,
    NASM, ExRx).
  - „Oderwane pięty” → `sq.mis.heels`; „ucieczka kolan” → `sq.mis.kneesIn`.
- Tekst (zamiast butt wink): **„Schodź tylko tak nisko, jak utrzymasz proste plecy.”**

### 1.9 knee_track_toe — „✓ Kolana pracują w osi stóp — aktywuj pośladki wypychając kolana lekko na zewnątrz.”
- Werdykt: **(b)**. „Kolana w linii palców” — potwierdzone (`sq.kneesToes`: NASM Goblet Squat, ACE #135, ExRx; `lunge.knee`: ExRx,
  NASM). SBS (25.10.2026, „Foot Angle”): „You want your knees to track over roughly your first or second toe.”
  „Aktywuj pośladki” — twierdzenie przyczynowe bez źródła → usunąć. „Wypychaj kolana na zewnątrz” — źródła tylko dla martwego ciągu
  sumo (`sumo.kneesOut`); dla przysiadu nie przenosić.
- Tekst: **„Kolana idą w tę samą stronę co palce stóp.”**
- Przypisanie błędne: uginanie nóg na maszynie (stojąc/siedząc), prostowanie nóg, odwodzenie/przywodzenie bioder, „kickback” —
  tam kolana nie „jadą” nad palcami. Dla maszyn: `lcurl.still`, `lext.range`, `llc.*`.

### 1.10 knee_valgus_err — „✕ CZĘSTY BŁĄD: Koślawienie kolan do środka (Knee Valgus) — utrata osiowości kończyny i stabilności biodra!”
- Werdykt: **(b)**. Sedno: `sq.mis.kneesIn` / `lunge.mis.kneeIn` (SBS FAQ „My knees are caving in”: „However, excessive knee caving
  should be avoided.”; NASM, ACE, ExRx). Usunąć: „Knee Valgus”, „koślawienie”, „utrata osiowości kończyny i stabilności biodra”
  (żargon, przyczynowość bez źródła, ton medyczny).
- Tekst: **„Kolana uciekają do środka.”**
- Przypisanie błędne: prostowanie nóg na maszynie, odwodzenie/przywodzenie.

### 1.11 hinge_neutral_back — „✓ Kręgosłup neutralny, ruch inicjowany z biodra przy zachowaniu sztywnego tułowia.”
- Werdykt: **(a)**, język do uproszczenia. `hinge.back` (ACE, NASM, ExRx), `rdl.move` / `row.hinge` („cofaj biodra” — NASM, ACE).
- Tekst: **„Plecy proste. Ruch zaczynasz od cofnięcia bioder.”** (druga część tylko dla RDL, dzień dobry, swingu, skłonów —
  nie dla martwego ciągu z podłogi, gdzie biodra i kolana prostują się razem: `dl.lift`).
- Przypisanie błędne: ćwiczenia szyi, „koci grzbiet” (cat-cow — tam plecy celowo się zaokrąglają), nordic, uginanie leżąc, wioślarz,
  bieg/rower/mobilność (domyślne w makiecie).

### 1.12 hinge_rounded_back — „✕ CZĘSTY BŁĄD: „Koci grzbiet” (zgięcie lędźwi pod obciążeniem) i utrata osi ruchu!”
- Werdykt: **(b)**. Sedno: `mis.roundBack` (NASM Barbell Deadlift Common Mistakes; ACE #6; ExRx). Usunąć „zgięcie lędźwi pod
  obciążeniem” (żargon), „utrata osi ruchu” (bez znaczenia i źródła). „Koci grzbiet” myli się z nazwą ćwiczenia cat-cow.
- Tekst: **„Plecy się zaokrąglają.”**
- Przypisanie błędne: wyciskanie nad głowę (v_push), uginania ramion, Pallof/drwal, cat-cow (sprzeczne), uginanie nóg siedząc/stojąc.

### 1.13 pull_scap_depress — „✓ Zainicjuj ruch od depresji i retrakcji łopatek (barki w dół, z dala od uszu).”
- Werdykt: **(a)** dla podciągania i ściągania drążka. `pu.shoulders` (ACE Pull Ups #191 Step 1; NASM Pull Up Step 2: „Depress your
  shoulder blades and position your body for controlled vertical pulling.” — przeczytane 25.10.2026); ACE Seated Lat Pulldown #158
  Step 2: „by first depressing (lower) your scapulae” (przeczytane 25.10.2026). Przy wiosłowaniach — łopatki w tył (`scr.chest`).
- Tekst (pionowe): **„Najpierw ściągnij łopatki w dół — barki z dala od uszu.”**; (poziome): **„Na końcu ściągnij łopatki do siebie.”**
- Przypisanie **KRYTYCZNE**: makieta daje to szrugsom (ćwiczenie polega na unoszeniu barków). Dla szrugsów: `shrug.move`, `shrug.tall`.

### 1.14 pull_shrug_err — „✕ CZĘSTY BŁĄD: Barki przyklejone do uszu (brak depresji łopatek)!”
- Werdykt: **(c) jako „częsty błąd” bez źródła.** NASM Pull Up — lista Common Mistakes nie wymienia unoszenia barków (przeczytane
  25.10.2026); ACE #158 i NASM — tylko wskazówka pozytywna. Zostawić tylko wskazówkę pozytywną (1.13).
- Przypisanie błędne: szrugsy (sprzeczne), unoszenie bokiem (brak źródła w repo dla „nie unoś barków” przy unoszeniu bokiem —
  [OTWARTE]), szyja.

### 1.15 spine_flex_crunch — „✓ Kontrolowana praca mięśni brzucha — zbliżaj żebra do miednicy bez szarpania szyją.”
- Werdykt: **(a)** dla brzuszków. `crunch.move` (ACE Crunch #52 Step 3–4; ExRx BWCrunch), `crunch.neck` (ACE, ExRx).
- Tekst: **„Zbliżaj żebra do miednicy. Nie ciągnij głowy rękami.”**
- Przypisanie: unoszenie nóg w zwisie, „toes to bar”, L-sit, zwis (dead hang) — **nie** (inny ruch; Hanging Leg Raise jest w repo
  otwarte, docs/research/27 tabela „Otwarte”).

### 1.16 spine_hip_flex_err — „✕ CZĘSTY BŁĄD: Szarpanie biodrami i odcinkiem lędźwiowym zamiast izolacji brzucha!”
- Werdykt: **(b)**. „Izolacja brzucha” — twierdzenie bez źródła. Właściwe, sprawdzone odpowiedniki: brzuszki — `crunch.lowBack`
  („Dolna część pleców zostaje na podłodze”, ACE, ExRx); odwrotne brzuszki — `rcrunch.hips` („…nie wymachuj nogami”); podciąganie —
  `pu.noSwing` (ACE, NASM).
- Tekst (brzuszki): **„Dolna część pleców zostaje na podłodze.”**

## 2. Kąty liczbowe w makiecie

| Kąt | Gdzie | Ocena |
|---|---|---|
| ~45° łokieć–tułów jako „poprawny” | elbow_tuck_45 | [OTWARTE] — tylko SBS (45–60°, wyciskanie) i NASM (45°, pompka); ACE przy pompce przeciwnie; brak szczebla 1–2; Noteboom 2024 nie wspiera 45° jako lepszego. |
| 90° jako błąd | elbow_flare_90 | [OTWARTE] — żadne źródło. |
| benchAngle 30° (skos), −18° (skos w dół) | l. 729 | uproszczenie ilustracyjne (docs/research/28: „Nachylenie oparcia ilustracyjne (wskazówki nie podają kąta ławki)”); nie pokazywać jako zalecenia. |
| torsoLeanRange [6,32], [2,16], [4,18] | przysiady | uproszczenie ilustracyjne — brak źródła dla liczb pochylenia tułowia (docs/research/28 to samo dla przysiadu). |
| ACE #158: odchylenie przy ściąganiu „no more than a 30 degree angle” | (nie w makiecie) | jedno źródło (ACE); nie dodawać jako liczby. |

Rysunek może mieć kąty (musi), ale tylko z etykietą „uproszczenie ilustracyjne” i bez znaków ✓/✕ przy liczbie, dopóki liczba nie ma źródeł.

## 3. Przypisania wskazówek do ćwiczeń — błędy w `compileCatalogEntry`

Makieta ma 2 wskazówki na ćwiczenie (primaryCue, faultCue) z 16 ogólnych. Błędy merytoryczne (wskazówka nie pasuje albo przeczy ruchowi):

| Ćwiczenia (warunek w makiecie) | Przypisane | Problem | Waga |
|---|---|---|---|
| wspięcia na palce (`calf`, l. 932–937) | squat_midfoot + squat_heel_lift | „odrywanie pięt” jako błąd — a to jest ruch | KRYTYCZNE (błędne twierdzenie) |
| szrugsy (`shrug`, l. 942–945) | pull_scap_depress + pull_shrug_err | „barki w dół” — odwrotność ruchu | KRYTYCZNE |
| cat-cow (l. 770–775) | hinge_neutral_back + hinge_rounded_back | zaokrąglanie pleców jest częścią ćwiczenia | WYSOKIE |
| uginania ramion (l. 956–961) | elbow_tuck_45 + hinge_rounded_back | kąt 45° nie dotyczy; właściwe `curl.elbows`, `curl.noSwing` | WYSOKIE |
| unoszenia bokiem/przodem/tył (l. 946–951) | elbow_tuck_45 + pull_shrug_err | właściwe `lat.elbows`, `lat.height`, `rear.elbows` | WYSOKIE |
| triceps, rozpiętki, pullover (l. 912–931, 952–955) | elbow_tuck_45 + elbow_flare_90 | właściwe `tpd.elbows`, `ote.upperArm`, `skull.upperArm`, `fly.elbows` | WYSOKIE |
| wyciskanie nad głowę (l. 817–838) | elbow_tuck_45 + hinge_rounded_back | właściwe `ohp.tall`, `ohp.elbowsUnder`, `ohp.fullExt` | WYSOKIE |
| uginanie nóg stojąc/siedząc (l. 759–762) | knee_track_toe + hinge_rounded_back | właściwe `lcurl.still`, `llc.control` | WYSOKIE |
| prostowanie nóg (l. 757–758) | knee_track_toe + knee_valgus_err | właściwe `lext.range`, `llc.control` | ŚREDNIE |
| szyja (l. 739–742) | hinge_neutral_back + pull_shrug_err | brak źródeł dla szyi | [OTWARTE] |
| Pallof/drwal/skłony (l. 781–786) | pushup_core_brace + hinge_rounded_back | właściwe `pallof.noTwist`, `plank.brace` (Pallof) | ŚREDNIE |
| zwis/unoszenie nóg w zwisie (l. 733–738) | spine_flex_crunch + spine_hip_flex_err | inny ruch; HLR otwarte w repo | ŚREDNIE |
| cardio, mobilność, noszenie, skoki (l. 971–994) | hinge_neutral_back + hinge_rounded_back | domyślne „na wszelki wypadek” — bez związku z ruchem | WYSOKIE |

Rekomendacja: wskazówki nie mogą wynikać z „rigu” animacji. Przypisanie: najpierw własne zdania ćwiczenia z `lib/cues/data.json`
(102 ćwiczenia), potem zestaw wzorca (`wskazowki-wzorce.json`) z etykietą „uproszczenie (analogia)”, a gdy wzorzec nie ma zestawu —
brak wskazówek (sam rysunek i stopka „skonsultuj ze specjalistą przy bólu”).

## 4. Ton i znaki

- „CZĘSTY BŁĄD” wielkimi literami i „!” — ton pouczający; w repo sekcja nazywa się „Częste błędy” i zdania są neutralne (`mis.*`).
- Znaki ✓/✕ w tekście — do decyzji projektowej (docs/32 wzorce interakcji); merytorycznie bez znaczenia.
- Słowa do usunięcia z tekstów dla użytkownika: retrakcja, depresja (łopatek), knee valgus, koślawienie, butt wink, przeprost lędźwi,
  aktywacja core, izolacja brzucha, utrata osiowości/stabilności, śródstopie, zgięcie lędźwi.

## 5. Otwarte pytania

1. [OTWARTE] Kąt łokci przy wyciskaniu leżąc (liczba) — potrzebne źródło szczebla 2 (NSCA Essentials / Exercise Technique Manual,
   ACSM's Resources for the Personal Trainer 6e — rozdział o technice ćwiczeń oporowych: sprawdzić, czy podaje kąt).
2. [OTWARTE] Łokcie przy pompkach — NASM (45°) vs ACE (na zewnątrz). Do sprawdzenia w podręczniku ACSM (opis pompki).
3. [OTWARTE] „Barki do uszu” jako częsty błąd przy podciąganiu/ściąganiu i unoszeniu bokiem — brak źródła.
4. [OTWARTE] Szyja (neck harness, izometrie szyi) — brak źródeł; bez wskazówek.
5. [OTWARTE] Pullover — brak zdań w repo.
