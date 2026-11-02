# Wskazówki techniki — `mobility_floor`, część: tułów i ramiona (fala W1, G2 mobilność)

Data: 02.11.2026. Autor: badacz-merytoryczny (agent).

**Metoda.** Każdą stronę i każdy PDF przeczytałem (WebFetch; PDF-y otwarte w całości jako tekst/obraz strony), nie streszczenia wyszukiwarki.
Zdanie trafia do danych, gdy potwierdzają je ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki,
CLAUDE.md); wariant tego samego ćwiczenia (siedząc/stojąc, jedno/oba kolana) liczy się z dopiskiem „(wariant: …)”, inne ćwiczenie — nie.
Ruch ćwiczeń 3–7 zidentyfikowałem po nazwie źródłowej z katalogu (`docs/research/25-biblioteka/L3-zrodla.md`: „Knee Across The Body”,
„Dancer's Stretch” itd.) i opisie w otwartym zbiorze ćwiczeń, z którego pochodzi katalog — ten opis służy tylko identyfikacji, nie jest źródłem.
Strony innych aplikacji treningowych pominięte (nie są źródłem, nazw nie zapisuję). ExRx — nie używany (403).

## Ćwiczenia

| Ćwiczenie | Stan | Uwaga |
|---|---|---|
| Cat-Cow | gotowe | 5 niezależnych organizacji; obecny zestaw `dyn.control`/`st.breathe`/`dyn.mis.jerk` nie ma potwierdzenia w brzmieniu — zastąpiony (patrz „Otwarte”) |
| Child's Pose | gotowe | ustawienie i ruch: ACE + szpital (CCSM) + WebMD Ignite; wskazówek dodatkowych brak (po jednym źródle) |
| Supine Spinal Twist | gotowe | ruch z jednym kolanem: 1 źródło wprost (VHI) + 3 warianty z oboma kolanami (HSS, Advocate Aurora, CUH NHS) |
| Seated Rotation Stretch | gotowe | wprost: Univ. of Illinois Extension + Mayo Clinic (MFMER) |
| Upper Back Stretch | częściowe | setup + ruch mają 2 źródła, ale szczebel obu organizacji (WebMD Ignite, Sussexsport) jest otwarty od docs/research/33, pyt. 1–3 |
| Middle Back Stretch | częściowe | tylko ruch (warianty siedząc: NHS, CUH NHS); ustawienie stojąc z rękami na biodrach — bez przeczytanego źródła |
| Kneeling Forearm Stretch | otwarte | jedno wiarygodne źródło (Medical News Today) i to z przeciwnym kierunkiem ruchu (pochylenie w przód zamiast w tył) |

## Dane (do `exercises` w `data/zrodla/cues.json`)

```json
{
  "Cat-Cow": {
    "setup": [
      {"c": "mobility_floor.t.catCow.setup", "s": [["ace-15", "Steps, krok 2"], ["kmpt-stretches", "s. 5, Cat stretch, pkt 1"], ["hwq-cat-cow", "Steps, krok 1"], ["southtees-cat-stretch", "Fig A"], ["ccsm-back-stretching", "s. 1, Cat Cow, pkt 1 (kolana zgięte 90°)"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.catCow.round", "s": [["ace-15", "Steps, krok 4 (Cat Phase)"], ["kmpt-stretches", "s. 5, Cat stretch, pkt 3"], ["southtees-cat-stretch", "Fig B"], ["ccsm-back-stretching", "s. 1, Cat Cow, pkt 2"]]},
      {"c": "mobility_floor.t.catCow.arch", "s": [["ace-15", "Steps, krok 5 (Cow Phase)"], ["kmpt-stretches", "s. 5, Cat stretch, pkt 2"], ["southtees-cat-stretch", "Fig C"], ["ccsm-back-stretching", "s. 1, Cat Cow, pkt 2"], ["hwq-cat-cow", "Steps, krok 4"]]}
    ],
    "tips": [
      {"c": "mobility_floor.t.catCow.smooth", "s": [["kmpt-stretches", "s. 5, Cat stretch, podtytuł i pkt 4"], ["southtees-cat-stretch", "Fig C"], ["ccsm-back-stretching", "s. 1, Cat Cow, pkt 3"], ["hwq-cat-cow", "Breathing / krok 6"]]},
      {"c": "mobility_floor.t.catCow.exhale", "s": [["ace-15", "Steps, krok 4"], ["hwq-cat-cow", "Breathing, krok 5"]]}
    ],
    "mistakes": []
  },
  "Child's Pose": {
    "setup": [
      {"c": "mobility_floor.t.child.setup", "s": [["ace-227", "Starting Position, krok 1"], ["ccsm-back-stretching", "s. 1, Child's Pose, pkt 1"], ["webmd-ignite-childs-pose", "kroki 1–2"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.child.sitBack", "s": [["ace-227", "krok 2"], ["ccsm-back-stretching", "s. 1, Child's Pose, pkt 2–3"], ["webmd-ignite-childs-pose", "krok 1"]]},
      {"c": "mobility_floor.t.child.reach", "s": [["ace-227", "krok 2"], ["ccsm-back-stretching", "s. 1, Child's Pose, pkt 2"], ["webmd-ignite-childs-pose", "kroki 2–3"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Supine Spinal Twist": {
    "setup": [
      {"c": "mobility_floor.t.supTwist.setup", "s": [["vhi-supine-rotation", "krok 1"], ["hss-back-neck-stretches", "Trunk Rotation, krok 1 (wariant: oba kolana)"], ["aurora-lower-trunk-rotation", "krok 1 (wariant: oba kolana)"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.supTwist.move", "s": [["vhi-supine-rotation", "krok 2"], ["hss-back-neck-stretches", "Trunk Rotation (wariant: oba kolana)"], ["aurora-lower-trunk-rotation", "krok 2 (wariant: oba kolana)"], ["cuh-spinal-rom", "Lying on back, Knee rolls (wariant: oba kolana)"]]}
    ],
    "tips": [
      {"c": "mobility_floor.t.supTwist.shoulders", "s": [["hss-back-neck-stretches", "Trunk Rotation"], ["aurora-lower-trunk-rotation", "krok 1"]]},
      {"c": "st.tension", "s": [["vhi-supine-rotation", "krok 2"], ["hss-back-neck-stretches", "Trunk Rotation (wariant: oba kolana)"]]}
    ],
    "mistakes": [
      {"c": "mobility_floor.t.supTwist.mis.shoulder", "s": [["hss-back-neck-stretches", "Trunk Rotation"], ["aurora-lower-trunk-rotation", "krok 1"]]}
    ]
  },
  "Seated Rotation Stretch": {
    "setup": [
      {"c": "mobility_floor.t.seatRot.setup", "s": [["uiuc-seated-spinal-twist", "kroki 1–2"], ["mayo-seated-spinal-twist", "kroki 1–2"]]},
      {"c": "mobility_floor.t.seatRot.elbow", "s": [["uiuc-seated-spinal-twist", "krok 2"], ["mayo-seated-spinal-twist", "krok 4"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.seatRot.move", "s": [["uiuc-seated-spinal-twist", "krok 3"], ["mayo-seated-spinal-twist", "krok 5"], ["webmd-ignite-trunk-twist-seated", "krok 3 (wariant: nogi skrzyżowane)"]]}
    ],
    "tips": [
      {"c": "mobility_floor.t.seatRot.head", "s": [["mayo-seated-spinal-twist", "krok 5"], ["cuh-spinal-rom", "Seated trunk rotation (wariant: krzesło)"]]}
    ],
    "mistakes": []
  },
  "Upper Back Stretch": {
    "setup": [
      {"c": "mobility_floor.t.upperBack.setup", "s": [["webmd-ignite-upper-back", "krok 2"], ["sussex-trapezius", "Trapezius, akapit 1 (i zdjęcie)"]]}
    ],
    "move": [
      {"c": "mobility_floor.t.upperBack.reach", "s": [["webmd-ignite-upper-back", "krok 4"], ["sussex-trapezius", "Trapezius, akapit 1"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Middle Back Stretch": {
    "setup": [],
    "move": [
      {"c": "mobility_floor.t.midBack.turn", "s": [["nhs-sitting-exercises", "Upper-body twist (wariant: siedząc)"], ["cuh-spinal-rom", "Seated trunk rotation (wariant: siedząc)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Kneeling Forearm Stretch — bez wpisu (otwarte).

## Nowe zdania

| id | PL | EN (propozycja) | uwaga |
|---|---|---|---|
| mobility_floor.t.catCow.setup | Stań na czworakach: dłonie pod barkami, kolana pod biodrami. | Get on all fours, hands under your shoulders and knees under your hips. | CCSM: kolana zgięte 90° — zgodne |
| mobility_floor.t.catCow.round | Zaokrąglij plecy w górę i opuść głowę. | Round your back up toward the ceiling and let your head drop. | |
| mobility_floor.t.catCow.arch | Potem opuść brzuch w stronę podłogi, żeby plecy się wygięły. | Then let your belly sink toward the floor so your back arches. | |
| mobility_floor.t.catCow.smooth | Przechodź z pozycji do pozycji powoli i płynnie. | Move slowly and smoothly between the two positions. | zastępuje `dyn.control` (patrz Otwarte) |
| mobility_floor.t.catCow.exhale | Zaokrąglając plecy, zrób wydech. | Breathe out as you round your back. | wskazówka oddechu prosta, bez wstrzymywania; zastępuje `st.breathe` |
| mobility_floor.t.child.setup | Uklęknij i oprzyj dłonie o podłogę przed sobą. | Kneel and put your hands on the floor in front of you. | CCSM: „all fours”; ACE: dłonie pod barkami |
| mobility_floor.t.child.sitBack | Cofnij biodra w stronę pięt. | Sit your hips back toward your heels. | |
| mobility_floor.t.child.reach | Ręce zostaw wyciągnięte przed sobą, a klatkę opuść w stronę podłogi. | Keep your arms stretched out in front and lower your chest toward the floor. | |
| mobility_floor.t.supTwist.setup | Połóż się na plecach i ugnij kolano. | Lie on your back and bend your knee. | wariant z oboma kolanami u HSS/Aurora |
| mobility_floor.t.supTwist.move | Powoli przenieś ugięte kolano w poprzek ciała, w stronę podłogi. | Slowly bring the bent knee across your body toward the floor. | |
| mobility_floor.t.supTwist.shoulders | Barki zostają na podłodze. | Keep both shoulders on the floor. | |
| mobility_floor.t.supTwist.mis.shoulder | Odrywanie barku od podłogi. | Lifting a shoulder off the floor. | HSS: wprost zakaz; Aurora: „flat throughout” |
| mobility_floor.t.seatRot.setup | Usiądź z prostymi nogami, jedną ugnij i postaw stopę za kolanem drugiej. | Sit with your legs straight, bend one and plant that foot outside the other knee. | |
| mobility_floor.t.seatRot.elbow | Przeciwny łokieć oprzyj o zewnętrzną stronę ugiętego kolana. | Rest the opposite elbow against the outside of the bent knee. | |
| mobility_floor.t.seatRot.move | Powoli obróć tułów w stronę ugiętego kolana. | Slowly turn your upper body toward the bent knee. | |
| mobility_floor.t.seatRot.head | Głowa obraca się razem z tułowiem. | Let your head turn with your upper body. | |
| mobility_floor.t.upperBack.setup | Spleć palce przed sobą na wysokości barków. | Interlace your fingers in front of you at shoulder height. | szczebel źródeł otwarty |
| mobility_floor.t.upperBack.reach | Sięgaj dłońmi w przód, aż poczujesz rozciąganie w górnej części pleców. | Reach your hands forward until you feel a stretch across your upper back. | szczebel źródeł otwarty |
| mobility_floor.t.midBack.turn | Obracaj tułów w jedną, potem w drugą stronę. | Turn your upper body to one side, then the other. | źródła: wariant siedząc |

## Nowe źródła

```json
{
  "ace-15": {"org": "ACE", "title": "Cat-Cow (#15)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/15/cat-cow/", "level": 4},
  "ace-227": {"org": "ACE", "title": "Childs Pose (#227)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/227/childs-pose/", "level": 4},
  "hwq-cat-cow": {"org": "Health and Wellbeing Queensland", "title": "Cat and cow stretch", "url": "https://hw.qld.gov.au/?p=41297", "level": 4},
  "kmpt-stretches": {"org": "Kent and Medway NHS and Social Care Partnership Trust", "title": "Physiotherapy Stretches (KM1237), s. 4–5", "url": "http://www.kentmedwaymentalhealth.nhs.uk/media/2613/km1237-physiotherapy-stretches-exercise-booklet.pdf", "level": 4},
  "southtees-cat-stretch": {"org": "South Tees Hospitals NHS Foundation Trust", "title": "Cat stretch (Physiotherapy)", "url": "https://www.southtees.nhs.uk/?p=31588", "level": 4},
  "ccsm-back-stretching": {"org": "Connecticut Children's Sports Medicine", "title": "Back Stretching Home Exercise Program", "url": "https://www.connecticutchildrens.org/sites/default/files/2026-04/pdf_sportsmed_back-stretching-home-exercise-program.pdf", "level": 4},
  "webmd-ignite-childs-pose": {"org": "WebMD Ignite", "title": "Child's pose (ColumbiaDoctors Health Library, stan na 01.05.2026)", "url": "https://www.columbiadoctors.org/health-library/multimedia/child-s-pose/", "level": 4},
  "webmd-ignite-trunk-twist-seated": {"org": "WebMD Ignite", "title": "Trunk twist (seated) (ColumbiaDoctors Health Library)", "url": "https://www.columbiadoctors.org/health-library/multimedia/trunk-twist-seated/", "level": 4},
  "webmd-ignite-upper-back": {"org": "WebMD Ignite", "title": "Lower neck and upper back (rhomboid) stretch (ColumbiaDoctors Health Library, stan na 01.05.2026)", "url": "https://www.columbiadoctors.org/health-library/multimedia/lower-neck-upper-back-rhomboid-stretch/", "level": 4},
  "hss-back-neck-stretches": {"org": "HSS", "title": "HSS Rehabilitation and Performance, Back and Neck Stretches (17.02.2021)", "url": "https://www.hss.edu/health-library/move-better/back-neck-stretches", "level": 4},
  "aurora-lower-trunk-rotation": {"org": "Advocate Aurora Health", "title": "Lumbar – Lower Trunk Rotation, Hooklying (X20549, rev. 12/2019)", "url": "https://ahc.aurorahealthcare.org/fywb/x20549.pdf", "level": 4},
  "vhi-supine-rotation": {"org": "VHI (karta ćwiczeń, publikowana przez Hattiesburg Clinic)", "title": "Supine With Rotation", "url": "https://iris.hattiesburgclinic.com/patadv/exkit/Complete Stretching/English/0241000495lowb019m_English.html", "level": 4},
  "cuh-spinal-rom": {"org": "Cambridge University Hospitals NHS FT", "title": "Spinal range of movement/stretching exercises", "url": "https://www.cuh.nhs.uk/patient-information/spinal-range-of-movementstretching-exercises/", "level": 4},
  "uiuc-seated-spinal-twist": {"org": "University of Illinois Extension (Eat.Move.Save)", "title": "Seated Spinal Twist", "url": "https://eat-move-save.extension.illinois.edu/move/exercise/seated-spinal-twist", "level": 4},
  "mayo-seated-spinal-twist": {"org": "Mayo Clinic (MFMER), Mayo Clinic Care Network", "title": "Seated spinal twist (wideo z opisem)", "url": "https://www.mymlc.com/health-information/videos/lifestyle/stress-management/stress-relief/seated-spinal-twist/", "level": 4},
  "sussex-trapezius": {"org": "Sussexsport", "title": "Trapezius / Pectorals (karta)", "url": "https://www.sussex.ac.uk/sport/documents/trapezius-pectorals.pdf", "level": 4},
  "nhs-sitting-exercises": {"org": "NHS", "title": "Sitting exercises — Upper-body twist", "url": "https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/sitting-exercises/", "level": 4}
}
```

| id | organizacja | szczebel | co potwierdza (cytat ≤ 1 zdanie albo parafraza) |
|---|---|---|---|
| ace-15 | ACE | 4 | Cat-Cow: dłonie pod barkami, kolana pod biodrami (krok 2); „Gently exhale and contract your abdominal muscles, pushing your spine upwards towards the ceiling” (krok 4); brzuch w stronę podłogi (krok 5) |
| ace-227 | ACE | 4 | Child's Pose: klęk, dłonie pod barkami; „exhale and hinge at the hips, bringing your glutes to your heels” (krok 2); klatka między udami, czoło na podłodze |
| hwq-cat-cow | Health and Wellbeing Queensland (rząd Queensland) | 4 | „Inhale to arch your spine, exhale to round your spine.” (Breathing); ustawienie (krok 1) |
| kmpt-stretches | NHS (KMPT, fizjoterapeuci) | 4 | s. 5 Cat stretch: „Move smoothly between the two movements”; dłonie pod barkami, kolana pod biodrami; s. 4 Child's pose (zdjęcie); s. 1 zdanie o bólu (patrz Otwarte) |
| southtees-cat-stretch | NHS (South Tees, fizjoterapia) | 4 | Fig A ustawienie; Fig B zaokrąglenie z głową w przód; „Gently reverse the position in a slow controlled manner…” (Fig C) |
| ccsm-back-stretching | Connecticut Children's (szpital, medycyna sportowa) | 4 | s. 1 Cat Cow: „keep your movements slow and controlled”; Child's Pose: cofnięcie bioder do pięt, ręce wyciągnięte, klatka do podłogi |
| webmd-ignite-childs-pose | WebMD Ignite (szczebel otwarty, docs/33 pyt. 2–3) | 4? | „Kneel on the floor, and sit back on your ankles.” (krok 1); ręce wyciągnięte przed siebie (krok 2) |
| webmd-ignite-trunk-twist-seated | WebMD Ignite | 4? | „Slowly twist your body (trunk) to your right.” (krok 3; nogi skrzyżowane) |
| webmd-ignite-upper-back | WebMD Ignite | 4? | palce splecione na wysokości barków (krok 2); sięganie w przód, rozciąganie w górnej części pleców (krok 4) |
| hss-back-neck-stretches | HSS | 4 | Trunk Rotation: kolana powoli na boki, „so that you feel a stretch in your torso”; barki: „do not lift them up as your knees rotate” |
| aurora-lower-trunk-rotation | Advocate Aurora Health | 4 | „Shoulders should remain flat throughout the entire exercise.” (krok 1); kolana opuszczane powoli w bok (krok 2) |
| vhi-supine-rotation | VHI (karty ćwiczeń dla fizjoterapii) | 4 | „Slowly bring bent leg across body until stretch is felt in lower back area.” (krok 2) |
| cuh-spinal-rom | NHS (Cambridge University Hospitals) | 4 | Knee rolls: kolana powoli na boki przy nieruchomej górze tułowia; Seated trunk rotation: „Rotate your trunk with your head and shoulders leading.” |
| uiuc-seated-spinal-twist | University of Illinois Extension | 4 | „Cross one leg over the other and put your opposite elbow on the outside of your bent knee.” (krok 2); „Gently turn your upper body toward your bent knee.” (krok 3) |
| mayo-seated-spinal-twist | Mayo Clinic (MFMER) | 4 | stopa za kolanem drugiej nogi (krok 2); łokieć na zewnątrz kolana (krok 4); obrót klatki, głowy i oczu (krok 5) |
| sussex-trapezius | Sussexsport, University of Sussex (szczebel otwarty, docs/33 pyt. 1) | 4? | „Reach out until you can feel the stretch across the upper back.” (Trapezius) |
| nhs-sitting-exercises | NHS | 4 | Upper-body twist: „Without moving your hips, turn your upper body to the left as far as is comfortable.” |

Przeczytane, niewykorzystane w danych: WebMD Ignite „Cat-cow” (ColumbiaDoctors, https://www.columbiadoctors.org/health-library/multimedia/cat-cow/)
i „Back Exercises: Cat and Cow” (ECU Health, ta sama organizacja — StayWell/WebMD Ignite) — zgodne z danymi, nie dodane, bo Cat-Cow ma
wystarczająco źródeł; NHS „Flexibility exercises” (bez skrętu tułowia); WebMD Ignite „Wrist flexion (flexibility)” (inne ćwiczenie);
Medical News Today „11 wrist and hand stretches…” (patrz Otwarte); UNM HSC „Back Exercises” (materiał położniczy, inny kontekst — pominięty).

## Otwarte

- **Cat-Cow — `dyn.control`** („…a zakres zwiększaj stopniowo”): źródła mówią tylko „powoli, płynnie”; stopniowego zwiększania zakresu
  żadne nie podaje → zastąpione przez `mobility_floor.t.catCow.smooth`. Błąd zestawu.
- **Cat-Cow — `st.breathe`** („nie wstrzymuj oddechu”): żadne przeczytane źródło tego nie mówi; potwierdzony jest wydech przy zaokrąglaniu
  (ACE, HWQ) → `mobility_floor.t.catCow.exhale`. Wdech przy wygięciu — tylko HWQ (jedno źródło), nie dodane.
- **Cat-Cow — `dyn.mis.jerk`**: żadne źródło nie nazywa szarpania błędem (tylko odwrotność „powoli”) → bez sekcji błędów.
  Kandydaci po jednym źródle: przenoszenie ciężaru do tyłu (tylko WebMD Ignite), zapadanie się lędźwi w pozycji wyjściowej (tylko ACE).
- **Cat-Cow — trzymać czy płynąć?** ACE każe trzymać każdą pozycję 10–15 s, WebMD Ignite 5 s / 15–30 s, CCSM 3–5 s; KMPT, South Tees, HWQ —
  płynnie bez zatrzymania. Część wspólna: powolne przejścia; liczby czasu nie wpisuję (różne, i to liczba wg pełnych zasad).
- **Child's Pose — `st.tension`, `st.breathe`, `st.mis.force`**: brak 2 źródeł. Oddech (5–10 spokojnych oddechów) — tylko ACE;
  „rozluźnij się w pozycji” — tylko CCSM; poduszka pod pośladki przy dolegliwościach kolan — tylko WebMD Ignite (i to zdanie o zdrowiu → pełne zasady).
  Szersze kolana — ACE (opcjonalnie) i wariant boczny CCSM (inne ćwiczenie) → nie dodane.
- **Supine Spinal Twist — `st.noBounce`, `st.breathe`, `st.mis.force`**: brak źródeł dla tego ćwiczenia. Ręce rozłożone w bok i głowa w przeciwną
  stronę — tylko Aurora (głowa) i opis identyfikacyjny → nie dodane. Pozycja z jedną nogą prostą: wprost tylko VHI.
- **Seated Rotation Stretch — `st.*`, `rot.slow`**: „wracaj powoli” — tylko Mayo; oddech (wydech przy wchodzeniu w skręt) — tylko Mayo;
  biodra nieruchome — tylko NHS (wariant na krześle) → nie dodane.
- **Upper Back Stretch**: (a) szczebel WebMD Ignite i Sussexsport nierozstrzygnięty (docs/research/33, pyt. 1–3) — jeśli audytor uzna je za
  szczebel 5, ćwiczenie spada do „otwarte”; (b) **sprzeczność**: WebMD Ignite każe zaokrąglić górę pleców i „rozsunąć łopatki”, Sussexsport —
  utrzymać kręgosłup prosty; część wspólna (splecione dłonie, sięganie w przód do odczucia rozciągania) wpisana, zaokrąglanie — nie.
- **Middle Back Stretch**: ustawienie stojąc z rękami na biodrach i „biodra w miejscu” — bez dwóch źródeł (NHS tylko siedząc; inne strony to
  aplikacje). Do sprawdzenia: PDF Leeds Teaching Hospitals „NASS Home exercises for axSpA” (21 stron, pobrany, nieprzeczytany w całości).
- **Kneeling Forearm Stretch**: jedyne wiarygodne źródło (Medical News Today, „Wrist strengthener”, rec. M. Lal, 16.01.2026) opisuje
  pochylenie w przód, opis identyfikacyjny — w tył (do pięt). Kierunek sprzeczny, drugiego źródła brak → bez danych. Obecny zestaw
  ogólny (`st.tension`, `st.noBounce`, `st.breathe`, `st.mis.force`) też bez potwierdzenia dla tego ćwiczenia.
- **Zestaw ogólny `st.noBounce` / `st.mis.force` dla całej części**: żadne przeczytane źródło dla tych 7 ćwiczeń nie mówi o sprężynowaniu
  ani o wciskaniu na siłę → do przeglądu zestawu.
- **Zdanie ostrożności przy bólu (zdrowie, pełne zasady)** — kandydat, NIE w danych: KMPT s. 1 („If you feel dizzy, experience pain or any new
  symptom during exercise, please stop immediately and seek advice from your Doctor.”), HSS (rozciąganie „should not cause any pain when done
  correctly”), CUH NHS (przy bólu — porada fizjoterapeuty lub lekarza). Trzy niezależne źródła szczebla 4, brak szczebla 1–2 →
  do decyzji koordynatora, czy wystarcza „kilka niezależnych źródeł”; propozycja brzmienia: „Jeśli coś boli, przerwij ćwiczenie.”
  Bez twierdzeń o leczeniu bólu pleców.

## Stan

- **Zrobione (02.11.2026):** wszystkie 7 ćwiczeń przejrzane; 4 gotowe (Cat-Cow, Child's Pose, Supine Spinal Twist, Seated Rotation Stretch),
  2 częściowe (Upper Back Stretch, Middle Back Stretch), 1 otwarte (Kneeling Forearm Stretch). 19 nowych zdań, 17 nowych źródeł.
- **Zostało:** ustawienie dla Middle Back Stretch; źródło dla Kneeling Forearm Stretch; rozstrzygnięcie szczebla WebMD Ignite/Sussexsport.
- **Następny krok:** przeczytać PDF Leeds NASS (strony z rotacją tułowia i rozciąganiem nadgarstków); szukać karty klęku z dłońmi palcami
  do kolan w materiałach szpitalnych/uczelnianych (fraza „reverse wrist stretch on all fours”).
- **Pułapki:** PDF-y szpitalne WebFetch zwraca jako binarne — trzeba otworzyć zapisany plik narzędziem Read; Mayo Clinic (mayoclinic.org) → 403,
  treść Mayo czytana przez stronę sieci Mayo Clinic Care Network; WebMD Ignite występuje pod wieloma szpitalami (Columbia, ECU, PeaceHealth,
  UMass, Krames) — to jedna organizacja; umaine.edu i extension.uga.edu → 503; ExRx — nie próbowano (403 wg briefu).
