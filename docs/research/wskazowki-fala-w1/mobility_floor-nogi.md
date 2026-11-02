# Wskazówki techniki — `mobility_floor`, część biodra i nogi (fala W1, G2)

Data: 02.11.2026. Autor: badacz-merytoryczny.
Metoda: każde ćwiczenie zidentyfikowane po polu `note` w `docs/research/equipment/catalog.json` (i opisie wpisu źródłowego katalogu, gdy `note`
był niejasny). Dla każdego zdania przeczytano strony lub PDF (WebFetch, odczyt stron PDF) co najmniej dwóch niezależnych organizacji szczebla 4
(organizacja szkoląca trenerów, szpitale, uczelnia, sieci fizjoterapii, serwis sportowy). Zdania z zestawu ogólnego (`st.*`) wpisane tylko tam,
gdzie ≥ 2 przeczytane źródła potwierdzają je dla TEGO ćwiczenia; pozostałe w „Otwarte”. Liczby (czasy trzymania, serie) świadomie pominięte —
źródła się różnią (15–20 s, 15–30 s, 30 s, 30–60 s).

## 1. Ćwiczenia

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| Kneeling Hip Flexor Stretch | gotowe | 3 źródła (ACE, szpital, NHS) |
| Supine Hamstring Stretch | gotowe | wariant z pasem na stopie (jak w katalogu) — 2 sieci fizjoterapii + ACE/StayWell dla ruchu |
| Supine Figure-Four Stretch | gotowe | ruch: przyciągasz DOLNĄ nogę (NHS, sieć fizjoterapii) |
| Butterfly Stretch | gotowe | 3 źródła (ACE, szpital, uczelnia) |
| Seated Floor Hamstring Stretch | gotowe | 4 źródła; jedyne ćwiczenie z potwierdzonym `st.noBounce` |
| Runner's Stretch | częściowe | tylko ustawienie; źródła opisują dwa różne ruchy (biodra w przód vs biodra w tył) |
| Side-Lying Quad Stretch | gotowe | 3 źródła (NHS, sieć fizjoterapii, serwis sportowy) |
| The Straddle | otwarte | jedno źródło (materiał miejskiego działu rekreacji) |
| IT Band and Glute Stretch | gotowe | 2 sieci fizjoterapii (pas, noga w poprzek ciała) |
| Intermediate Groin Stretch | otwarte | jedno źródło (sieć fizjoterapii) |
| Side Lying Groin Stretch | otwarte | brak źródła poza opisem wpisu katalogu |
| Seated Calf Stretch | gotowe | 2 źródła (materiał kliniki, sieć fizjoterapii) |
| Peroneals Stretch | otwarte | nie znaleziono przeczytanego źródła rozciągania z pasem w inwersji |
| Posterior Tibialis Stretch | otwarte | j.w., w ewersji |
| Downward Facing Balance | otwarte | to NIE jest rozciąganie — zob. „Otwarte” |

## 2. Dane do `exercises` w `data/zrodla/cues.json`

```json
{
  "Kneeling Hip Flexor Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hfKneel", "s": [["ace-142", "Step 1 (starting position)"], ["covenant-lower-body-flex", "s. 1, HIP FLEXOR STRETCH, pkt 1"], ["livewell-lower-limb-stretch", "s. 2, Hip Flexor Muscle Stretches, rysunek 1"]]},
      {"c": "mobility_floor.n.hfKnee", "s": [["ace-142", "Step 1 (knee over ankle)"], ["livewell-lower-limb-stretch", "s. 2, Hip Flexor Muscle Stretches, punkty 2–3"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.hfShift", "s": [["ace-142", "Step 3 (lean forward into the front hip, back knee pressed down)"], ["covenant-lower-body-flex", "s. 1, HIP FLEXOR STRETCH, pkt 2"], ["livewell-lower-limb-stretch", "s. 2, Hip Flexor Muscle Stretches, punkt 1"]]}
    ],
    "tips": [
      {"c": "mobility_floor.n.core", "s": [["ace-142", "Step 2 (brace core, pelvis level)"], ["covenant-lower-body-flex", "s. 1, HIP FLEXOR STRETCH, pkt 1"], ["livewell-lower-limb-stretch", "s. 1, Instructions for Stretching, punkt 5"]]},
      {"c": "mobility_floor.n.tall", "s": [["ace-142", "Step 1 (spine tall)"], ["livewell-lower-limb-stretch", "s. 2, Hip Flexor Muscle Stretches, punkt 1 (torso upright)"]]}
    ],
    "mistakes": []
  },
  "Supine Hamstring Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hsStrap", "s": [["orthoindy-itb-program", "s. 1, Supine Hamstring Stretch with Strap, Setup"], ["baystate-pmc-strap", "Hamstring stretch"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.hsPull", "s": [["orthoindy-itb-program", "s. 1, Supine Hamstring Stretch with Strap, Movement"], ["baystate-pmc-strap", "Hamstring stretch"], ["vumc-90608", "krok 2"]]}
    ],
    "tips": [
      {"c": "mobility_floor.n.hsSoftKnee", "s": [["orthoindy-itb-program", "s. 1, Supine Hamstring Stretch with Strap, Tip"], ["vumc-90608", "krok 2 (straight or slightly bent)"]]},
      {"c": "st.tension", "s": [["ace-235", "Tips (stretch only to the point of tension)"], ["baystate-pmc-strap", "Hamstring stretch (until you feel tension)"], ["vumc-90608", "krok 2 (pull slowly, as high as comfortable)"]]}
    ],
    "mistakes": []
  },
  "Supine Figure-Four Stretch": {
    "setup": [
      {"c": "mobility_floor.n.f4Cross", "s": [["athletico-figure-4", "Step 1 i Step 2 (Beginner)"], ["alberta-abk4469", "kroki 1–2"], ["livewell-lower-limb-stretch", "s. 2, Hip Extensor Muscle Stretch, punkt 1"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.f4Pull", "s": [["livewell-lower-limb-stretch", "s. 2, Hip Extensor Muscle Stretch, punkty 2–3"], ["athletico-figure-4", "Step 2 (Advanced)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Butterfly Stretch": {
    "setup": [
      {"c": "mobility_floor.n.bfSoles", "s": [["covenant-lower-body-flex", "s. 2, BUTTERFLY STRETCH, pkt 1"], ["uiowa-chc-lower-body", "Butterfly Stretch"]]},
      {"c": "mobility_floor.n.tall", "s": [["ace-216", "Starting position (trunk upright)"], ["covenant-lower-body-flex", "s. 2, BUTTERFLY STRETCH, pkt 2 (spinal alignment)"], ["uiowa-chc-lower-body", "Butterfly Stretch (sit upright)"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.bfHinge", "s": [["ace-216", "Step 1"], ["covenant-lower-body-flex", "s. 2, BUTTERFLY STRETCH, pkt 1 (press down with your elbows)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_floor.n.mis.roundBack", "s": [["ace-216", "Step 1 (back flat, move from the hips, not the low back)"], ["covenant-lower-body-flex", "s. 2, BUTTERFLY STRETCH, pkt 2 (do not allow pelvis to tilt backward)"]]}
    ]
  },
  "Seated Floor Hamstring Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hsSeat", "s": [["livewell-lower-limb-stretch", "s. 2, Hamstring Muscle Stretch, punkt 1"], ["uiowa-chc-lower-body", "Hamstring Stretch"], ["staywell-89925", "opis ułożenia"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.hsReach", "s": [["livewell-lower-limb-stretch", "s. 2, Hamstring Muscle Stretch, punkty 2–3"], ["uiowa-chc-lower-body", "Hamstring Stretch"], ["staywell-89925", "opis ruchu (lean toward the ankle)"], ["covenant-lower-body-flex", "s. 1, HURDLER STRETCH, pkt 2"]]}
    ],
    "tips": [
      {"c": "mobility_floor.n.hsKneeStraight", "s": [["livewell-lower-limb-stretch", "s. 2, Hamstring Muscle Stretch, punkt 3"], ["covenant-lower-body-flex", "s. 1, HURDLER STRETCH, pkt 2 (maintain knee extension)"], ["staywell-89925", "opis ruchu (knee straight)"]]},
      {"c": "mobility_floor.n.hingeFlat", "s": [["staywell-89925", "opis ruchu (back straight)"], ["covenant-lower-body-flex", "s. 1, HURDLER STRETCH, pkt 3 (maintain spinal alignment)"]]},
      {"c": "st.noBounce", "s": [["staywell-89925", "uwagi (be sure not to bounce)"], ["livewell-lower-limb-stretch", "s. 1, Instructions for Stretching, punkt 4 (dotyczy wszystkich rozciągań ulotki)"]]}
    ],
    "mistakes": []
  },
  "Runner's Stretch": {
    "setup": [
      {"c": "mobility_floor.n.lungeHands", "s": [["topend-lunge-forward", "opis (back knee on the ground, hands on the ground)"], ["endurancemag-runners-lunge", "krok 1 (low lunge, hands on the floor)"]]}
    ],
    "move": [],
    "tips": [],
    "mistakes": []
  },
  "Side-Lying Quad Stretch": {
    "setup": [
      {"c": "mobility_floor.n.qSide", "s": [["livewell-lower-limb-stretch", "s. 2, Quadriceps Muscle Stretch, punkt 1"], ["topend-quads-lying", "kroki 1 i 4"], ["orthoindy-itb-program", "s. 2, Sidelying Quadriceps Stretch, Setup/Movement"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.qPull", "s": [["livewell-lower-limb-stretch", "s. 2, Quadriceps Muscle Stretch, punkty 1 i 3"], ["topend-quads-lying", "kroki 1 i 3 (thighs side by side)"], ["orthoindy-itb-program", "s. 2, Sidelying Quadriceps Stretch, Movement"]]}
    ],
    "tips": [
      {"c": "mobility_floor.n.qHipLine", "s": [["livewell-lower-limb-stretch", "s. 2, Quadriceps Muscle Stretch, punkt 3 (thigh in line with the torso)"], ["topend-quads-lying", "krok 5 (press the hip forward)"]]},
      {"c": "mobility_floor.n.core", "s": [["topend-quads-lying", "krok 2"], ["livewell-lower-limb-stretch", "s. 1, Instructions for Stretching, punkt 5"]]}
    ],
    "mistakes": []
  },
  "IT Band and Glute Stretch": {
    "setup": [
      {"c": "mobility_floor.n.hsStrap", "s": [["orthoindy-itb-program", "s. 1, Supine ITB Stretch with Strap, Setup"], ["baystate-pmc-strap", "IT band stretch"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.itbAcross", "s": [["orthoindy-itb-program", "s. 1, Supine ITB Stretch with Strap, Movement"], ["baystate-pmc-strap", "IT band stretch (cross your midline)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Seated Calf Stretch": {
    "setup": [
      {"c": "mobility_floor.n.calfStrap", "s": [["hattiesburg-peronank", "Towel stretch"], ["baystate-pmc-strap", "Calf stretch"]]}
    ],
    "move": [
      {"c": "mobility_floor.n.calfPull", "s": [["hattiesburg-peronank", "Towel stretch (pull toward you, leg straight)"], ["baystate-pmc-strap", "Calf stretch (legs extended, pull toes toward you)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

## 3. Nowe zdania

| id | PL | EN | uwaga |
|---|---|---|---|
| mobility_floor.n.hfKneel | Uklęknij na jedno kolano, drugą stopę postaw przed sobą. | Kneel on one knee with the other foot planted in front of you. | |
| mobility_floor.n.hfKnee | Przednie kolano trzymaj nad kostką. | Keep your front knee over your ankle. | |
| mobility_floor.n.hfShift | Przesuń biodra w przód, aż poczujesz rozciąganie z przodu biodra tylnej nogi. | Shift your hips forward until you feel a stretch at the front of your back leg's hip. | |
| mobility_floor.n.core | Lekko napnij brzuch, żeby miednica się nie bujała. | Lightly brace your abs to keep your pelvis steady. | wspólne dla kilku ćwiczeń |
| mobility_floor.n.tall | Tułów trzymaj prosto. | Keep your torso upright. | wspólne |
| mobility_floor.n.hsStrap | Połóż się na plecach i załóż pas na stopę jednej nogi; końce trzymaj w dłoniach. | Lie on your back with a strap around one foot, holding the ends. | też IT Band and Glute Stretch |
| mobility_floor.n.hsPull | Pasem przyciągaj nogę w górę, aż poczujesz rozciąganie z tyłu uda. | Use the strap to pull your leg up until you feel a stretch in the back of your thigh. | |
| mobility_floor.n.hsSoftKnee | Kolano może być lekko ugięte. | A slight bend in the knee is fine. | |
| mobility_floor.n.f4Cross | Połóż się na plecach z ugiętymi kolanami i oprzyj kostkę jednej nogi na kolanie drugiej. | Lie on your back, knees bent, and rest one ankle on the opposite knee. | |
| mobility_floor.n.f4Pull | Przyciągaj dolną nogę do klatki, aż poczujesz rozciąganie w pośladku. | Draw the bottom leg toward your chest until you feel a stretch in your glute. | rozciągany pośladek po stronie nogi założonej na kolano |
| mobility_floor.n.bfSoles | Usiądź, złącz podeszwy stóp i pozwól kolanom opaść na boki. | Sit with the soles of your feet together and let your knees drop out to the sides. | |
| mobility_floor.n.bfHinge | Pochyl się z bioder i łokciami delikatnie dociśnij uda w dół. | Hinge forward from your hips and gently press your thighs down with your elbows. | |
| mobility_floor.n.mis.roundBack | Garbienie się i odchylanie miednicy w tył. | Rounding your back and tucking your pelvis under. | |
| mobility_floor.n.hsSeat | Usiądź z jedną nogą prostą, stopę drugiej oprzyj o wewnętrzną stronę uda. | Sit with one leg straight and the sole of the other foot against your inner thigh. | |
| mobility_floor.n.hsReach | Pochyl się nad prostą nogą i sięgnij w stronę stopy. | Lean over the straight leg and reach toward your foot. | |
| mobility_floor.n.hsKneeStraight | Kolano prostej nogi się nie ugina. | Keep the straight leg's knee straight. | |
| mobility_floor.n.hingeFlat | Pochylaj się z bioder, plecy zostają proste. | Hinge from your hips and keep your back straight. | |
| mobility_floor.n.lungeHands | Wejdź w niski wykrok, tylne kolano na podłodze, dłonie oprzyj o podłogę. | Drop into a low lunge, back knee down, hands on the floor. | |
| mobility_floor.n.qSide | Połóż się na boku i chwyć dłonią stopę górnej nogi. | Lie on your side and grab the foot of your top leg. | |
| mobility_floor.n.qPull | Przyciągaj piętę do pośladka, kolana trzymaj razem. | Pull your heel toward your glutes, knees together. | |
| mobility_floor.n.qHipLine | Udo trzymaj w linii z tułowiem — biodro lekko w przód. | Keep your thigh in line with your torso, hip pushed slightly forward. | |
| mobility_floor.n.itbAcross | Pasem prowadź prostą nogę w poprzek ciała, aż poczujesz rozciąganie z boku uda i biodra. | Use the strap to guide your straight leg across your body until you feel a stretch along the outside of your thigh and hip. | |
| mobility_floor.n.calfStrap | Usiądź z wyprostowaną nogą i załóż pas lub ręcznik na przód stopy. | Sit with your leg straight and loop a strap or towel around the ball of your foot. | |
| mobility_floor.n.calfPull | Przyciągaj palce do siebie, kolano trzymaj proste. | Pull your toes toward you, keeping your knee straight. | |

Do sprawdzenia przez recenzenta lokalizacji: zgodność ze słownikiem terminów (nie sprawdzano w tej sesji).

## 4. Nowe źródła

```json
{
  "ace-142": {"org": "ACE", "title": "Kneeling Hip Flexor Stretch (#142)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/142/kneeling-hip-flexor-stretch/", "level": 4},
  "ace-216": {"org": "ACE", "title": "Seated Butterfly Stretch (#216)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/216/seated-butterfly-stretch/", "level": 4},
  "ace-235": {"org": "ACE", "title": "Supine Hamstrings Stretch (#235)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/235/supine-hamstrings-stretch/", "level": 4},
  "covenant-lower-body-flex": {"org": "Covenant HealthCare (za zgodą Kettering Sports Medicine)", "title": "Lower Body Flexibility (PDF, 2 s.)", "url": "https://covenanthealthcare.com/Uploads/Public/Documents/Workfiles/Covenant%20Medical%20Group/Sports_Medicine/Lower_Body_Flexibility.pdf", "level": 4},
  "livewell-lower-limb-stretch": {"org": "Livewell Southwest (NHS, Podiatry Services)", "title": "Lower Limb Muscle Stretching Exercises, v2 04.2016 (PDF, 2 s.)", "url": "https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Adult-Stretching-Leafelt-V2-April-2016.pdf", "level": 4},
  "uiowa-chc-lower-body": {"org": "University of Iowa, Community Health Collaborative", "title": "Lower Body Stretches", "url": "https://chtc.sites.uiowa.edu/lower-body-stretches", "level": 4},
  "vumc-90608": {"org": "StayWell (biblioteka pacjenta Vanderbilt Health)", "title": "Supine Hamstring Stretch", "url": "https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90608", "level": 4},
  "staywell-89925": {"org": "StayWell (Krames)", "title": "Seated Hamstring Stretch", "url": "https://pahealthwellness.kramesonline.com/HealthSheets/3,S,89925", "level": 4},
  "athletico-figure-4": {"org": "Athletico Physical Therapy", "title": "Stretch of the Week: Figure 4", "url": "https://athletico.com/?p=27325", "level": 4},
  "alberta-abk4469": {"org": "MyHealth.Alberta (treść Healthwise)", "title": "Piriformis stretch (from legs bent)", "url": "https://myhealth.alberta.ca/Health/healthy-living/pages/conditions.aspx?hwid=abk4469", "level": 4},
  "topend-quads-lying": {"org": "Topend Sports", "title": "Quadriceps Stretch - side lying", "url": "https://www.topendsports.com/medicine/stretches/quads-lying.htm", "level": 4},
  "topend-lunge-forward": {"org": "Topend Sports", "title": "Forward Lunge Stretch", "url": "https://www.topendsports.com/medicine/stretches/lunge-forward.htm", "level": 4},
  "orthoindy-itb-program": {"org": "OrthoIndy Physical Therapy", "title": "IT Band Home Exercise Program (PDF, rev. 8/15)", "url": "https://orthoindy.com/wp-content/uploads/IT-Band-Program.pdf", "level": 4},
  "baystate-pmc-strap": {"org": "Bay State Physical Therapy (wpis na blogu Pan-Mass Challenge)", "title": "7 stretches for PMC riders from Bay State Physical Therapy", "url": "https://www.pmc.org/blog/7-stretches-for-pmc-riders-from-bay-state-physical-therapy", "level": 4},
  "hattiesburg-peronank": {"org": "Hattiesburg Clinic (treść RelayHealth, Adult Advisor 2016.4)", "title": "Peroneal tendon / ankle rehabilitation exercises — Towel stretch", "url": "https://iris.hattiesburgclinic.com/patadv/aha/aha_peronank_rex.htm", "level": 4},
  "endurancemag-runners-lunge": {"org": "Endurance Magazine (S. Rountree, PhD, trenerka triathlonu)", "title": "YOGA – Runner's Lunge", "url": "https://www.endurancemag.com/?p=666", "level": 4}
}
```

| id | organizacja | szczebel | co potwierdza |
|---|---|---|---|
| ace-142 | ACE | 4 | klęk, kolano nad kostką, napięty brzuch, biodro w przód, prosty tułów |
| ace-216 | ACE | 4 | motyl: prosty tułów, skłon z bioder, łokcie na udach, błąd: ruch z odcinka lędźwiowego |
| ace-235 | ACE | 4 | rozciąganie dwugłowych leżąc (wariant przy ścianie): prostowanie nogi, „tylko do napięcia” |
| covenant-lower-body-flex | Covenant HealthCare | 4 | zginacze bioder, dwugłowe leżąc, „hurdler”, motyl (miednica nie odchyla się w tył) |
| livewell-lower-limb-stretch | NHS Livewell Southwest | 4 | zginacze bioder, dwugłowe siedząc, czworogłowe na boku, „figure-four” leżąc; ogólne: bez sprężynowania, napięty brzuch |
| uiowa-chc-lower-body | University of Iowa | 4 | motyl, dwugłowe siedząc |
| vumc-90608 | StayWell / Vanderbilt | 4 | dwugłowe leżąc: powoli, do wygodnego zakresu, kolano proste lub lekko ugięte, napięty brzuch |
| staywell-89925 | StayWell / Krames | 4 | dwugłowe siedząc: plecy i kolano proste, bez sprężynowania |
| athletico-figure-4 | Athletico | 4 | „figure-four”: ułożenie, przyciąganie dolnej nogi |
| alberta-abk4469 | MyHealth.Alberta / Healthwise | 4 | „figure-four”: ułożenie |
| topend-quads-lying | Topend Sports | 4 | czworogłowe na boku: chwyt, pięta do pośladka, biodro w przód, brzuch |
| topend-lunge-forward | Topend Sports | 4 | niski wykrok z dłońmi na podłodze |
| orthoindy-itb-program | OrthoIndy | 4 | pas na stopie leżąc: dwugłowe, pasmo biodrowo-piszczelowe (noga w poprzek), czworogłowe na boku |
| baystate-pmc-strap | Bay State Physical Therapy | 4 | pas: dwugłowe, noga w poprzek, łydka siedząc |
| hattiesburg-peronank | Hattiesburg Clinic / RelayHealth | 4 | łydka siedząc z ręcznikiem, noga prosta |
| endurancemag-runners-lunge | Endurance Magazine | 4 (graniczny: artykuł trenerki w magazynie sportowym) | niski wykrok, dłonie na podłodze |

Uwaga o niezależności: `vumc-90608` i `staywell-89925` to ten sam dostawca treści (StayWell) — w żadnym zdaniu nie liczone jako dwa źródła.
Źródło sprawdzone, ale nieużyte w danych: City of Newport Beach, „Adductor Stretch” (PDF, https://newportbeachca.gov/home/showpublisheddocument/67378/637327494253770000)
— materiał miejskiego działu rekreacji bez autora; opisuje The Straddle (nogi szeroko, skłon z bioder, klatka w górę, plecy proste).

## 5. Otwarte

**Zestaw ogólny (`st.tension`, `st.noBounce`, `st.breathe`, `st.mis.force`) — błąd zestawu:** dla większości ćwiczeń przeczytane źródła NIE
potwierdzają tych zdań parami. Stan po tej sesji:
- `st.noBounce` — potwierdzone tylko dla Seated Floor Hamstring Stretch. Pojedyncze źródła: Supine Hamstring (ACE 235), Butterfly (ACE 216),
  Kneeling Hip Flexor i Side-Lying Quad (tylko ogólna uwaga ulotki NHS).
- `st.tension` — potwierdzone tylko dla Supine Hamstring Stretch. Pojedyncze: Butterfly (ACE 216 „tension, not pain”), Side-Lying Quad (Topend „mild stretch”).
- `st.breathe` — nigdzie 2 źródła: Supine Hamstring (StayWell „do not hold your breath”), Figure-Four (Athletico). ACE „exhale” to nie zakaz wstrzymywania.
- `st.mis.force` — żadne przeczytane źródło wprost.
Rekomendacja: nie przypisywać zestawu ogólnego hurtem; Seated Calf Stretch i tak go nie miał w pełni.

**Ćwiczenia otwarte:**
- The Straddle — jedno źródło (Newport Beach, szczebel graniczny 4/5). Zdania gotowe do wpisania po drugim źródle: ustawienie „nogi szeroko, plecy proste”, ruch `mobility_floor.n.hingeFlat`.
- Intermediate Groin Stretch (leżąc, pas, noga w bok) — jedno źródło: Bay State („Adductor stretch”). Szukać drugiego (np. sieci fizjoterapii, szpitale).
- Side Lying Groin Stretch — jedyny opis to wpis źródłowy katalogu (nie jest niezależnym źródłem); nie znaleziono materiału szczebla 4. Rozważyć scalenie/usunięcie z katalogu (decyzja analityka).
- Peroneals Stretch, Posterior Tibialis Stretch (siedząc, pas, stopa w inwersji/ewersji) — żadne przeczytane źródło nie opisuje tego rozciągania; materiał Hattiesburg mimo nazwy „peroneal” opisuje rozciąganie łydki (ciągniesz do siebie). Bez źródła — nie wyświetlać wskazówek.
- Downward Facing Balance — w katalogu: leżenie przodem na piłce gimnastycznej, dłonie na podłodze, nogi uniesione i proste (`pattern: other`, `metric: time`, wymaga `stability_ball`, mięśnie: pośladki, dwugłowe, prostowniki). To ćwiczenie równowagi/wzmacniające tył ciała, nie rozciąganie podłogowe — przypisanie do rodziny `mobility_floor` wygląda na błąd (do analityka / figur). W bibliotece L6 oznaczone „brak źródła — uproszczenie”. Wskazówek nie podano.
- Runner's Stretch — ruch: Topend (biodra nisko i w przód — rozciąganie zginaczy biodra) vs Endurance Magazine (biodra cofnięte nad tylne kolano — rozciąganie dwugłowych) vs opis wpisu katalogu (biodra w górę). Najpierw ustalić, który wariant pokazuje figura, potem szukać 2 źródeł dla ruchu.

**Pojedyncze źródła (nie wpisane):** Kneeling Hip Flexor — ściśnij pośladek tylnej nogi (ACE 142), błąd „wyginanie odcinka lędźwiowego” (ACE 142);
Supine Hamstring — druga noga nie odrywa się od podłogi (OrthoIndy); IT Band — barki i biodra na podłodze (OrthoIndy); Side-Lying Quad — biodra
nie przechylają się w przód ani w tył (OrthoIndy); Butterfly — im bliżej stopy, tym mocniej (UIowa).

**Liczby:** czasy trzymania i liczby powtórzeń nie przenoszone (rozbieżne: 15–20 s × 5, 15–30 s, 30 s, 30–60 s) — temat dla pełnych zasad (szczebel 2).

## 6. Stan

- Zrobione: wszystkie 15 ćwiczeń przejrzane; gotowe 8 (Kneeling Hip Flexor, Supine Hamstring, Supine Figure-Four, Butterfly, Seated Floor
  Hamstring, Side-Lying Quad, IT Band and Glute, Seated Calf), częściowe 1 (Runner's Stretch), otwarte 6 (The Straddle, Intermediate Groin, Side Lying Groin, Peroneals, Posterior Tibialis, Downward Facing Balance).
- Zostało: drugie źródło dla The Straddle i Intermediate Groin; źródła dla Peroneals/Posterior Tibialis; ustalenie wariantu Runner's Stretch; decyzja o rodzinie Downward Facing Balance.
- Następny krok: koordynator wkleja blok JSON i źródła do `data/zrodla/cues.json`, zdania do `lib/cues/text/pl.json`/`en.json`; recenzja lokalizacji zdań.
- Pułapki: Mayo Clinic, UCSF (PDF) — 403; HSS, Emory (PDF), Cleveland Clinic — 404; UF RecSports — 503; ExRx i Wayback niedostępne.
  PDF-y szpitali czytelne tylko po pobraniu i odczycie stron (WebFetch zwraca binaria). Wiele wyników wyszukiwania to strony aplikacji — pominięte zgodnie z briefem.
