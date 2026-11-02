# Wskazówki techniki — rodzina `mobility_stand`, część: rozciągania statyczne (metryka czas)

Data: 02.11.2026. Autor: badacz-merytoryczny (agent), fala W1, grupa G2 mobilność.

**Metoda.** Dla każdego ćwiczenia czytałem strony (WebFetch; PDF-y czytane jako obraz strony) bibliotek ćwiczeń organizacji szkolących trenerów,
szpitali i organizacji zdrowia; zdanie jest „gotowe”, gdy potwierdzają je ≥ 2 przeczytane źródła szczebla ≤ 4 z różnych organizacji
(wariant tego samego ćwiczenia — przy ścianie / na stopniu, siedząc / stojąc — liczy się z dopiskiem „wariant”, jak w docs/research/33).
Zdania z zestawu ogólnego (`st.*`) wpisuję tylko tam, gdzie przeczytane źródła dla TEGO ćwiczenia je potwierdzają (polecenie koordynatora 02.11.2026);
pozostałe przypadki — w „Otwarte”. Strony innych aplikacji treningowych pominięte (nie są źródłem). Liczby (czas trzymania) — nie wchodzą do zdań.

## Ćwiczenia

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| Standing Gastrocnemius Calf Stretch | gotowe | wariant na stopniu; `gcalf.*` potwierdzone nowym odczytem (bez dotychczasowego źródła z platformy ćwiczeń — patrz „Otwarte”) |
| Wall Calf Stretch | gotowe | 4 organizacje |
| Standing Elevated Quad Stretch | częściowe | setup + move gotowe dla wersji stojącej „pięta do pośladka”; znaczenie „Elevated” niepotwierdzone, wskazówki po jednym źródle |
| Cross-Body Shoulder Stretch | gotowe | |
| Overhead Triceps Stretch | gotowe | bez wskazówek dodatkowych (po jednym źródle) |
| Standing Chest Stretch | otwarte | jedno źródło (ACE #209) |
| Standing Toe Touches | otwarte | nie zbadane w tej sesji (limit kontekstu) |
| Standing Lateral Stretch | gotowe | `sb.plane` — jedno źródło stojące + wariant siedzący (ACE #212) |
| Wall Lat Stretch | otwarte | nie zbadane w tej sesji |
| Side Neck Stretch | częściowe | setup + move + wskazówka gotowe; zdanie ostrożności (zawroty głowy) — jedno źródło, otwarte |
| Chin To Chest Stretch | otwarte | jedno źródło (ACE #204) |
| Standing Soleus And Achilles Stretch | gotowe | |
| Chest And Front Of Shoulder Stretch | otwarte | nie zbadane; postać ćwiczenia nieustalona |
| Standing Biceps Stretch | otwarte | tylko analogia (ACE #208 — wersja siedząca o innej mechanice) i wariant ACE #209 |
| One Knee To Chest | otwarte | nie zbadane; katalog zaleca matę — niejasne, czy stojąc |
| Overhead Stretch | otwarte | nie zbadane |
| Chest Stretch on Stability Ball | otwarte | nie zbadane |

## Dane (do `exercises` w `data/zrodla/cues.json`)

```json
{
  "Standing Gastrocnemius Calf Stretch": {
    "setup": [
      {"c": "gcalf.set", "s": [["ace-211", "Step 1: tylko przednia część stopy na stopniu, „The heel is off the step.”"], ["webmd-calf-step", "kroki 1–2: stopień schodów, pięty opuszczane za krawędź"]]},
      {"c": "gcalf.support", "s": [["ace-211", "Step 1: palce dłoni lekko na ścianie dla równowagi"], ["nhs-flexibility", "Calf stretch: „Place your hands on a wall for stability” (wariant: przy ścianie)"]]}
    ],
    "move": [
      {"c": "gcalf.move", "s": [["webmd-calf-step", "krok 2–3: „Slowly let your heels down over the edge of the step…”, potem przytrzymanie"], ["nhs-shrops-calf", "s. 1, How to Stretch: na schodach „drop your heels down with the legs straight”"], ["ace-211", "Step 2: powoli opuść piętę tylnej nogi"]]}
    ],
    "tips": [
      {"c": "gcalf.knee", "s": [["nhs-shrops-calf", "s. 1, How to Stretch: nogi proste — środek łydki; kolana ugięte — „lower down the calf”"], ["ace-152", "Step 4: lekko ugięte tylne kolano przenosi rozciąganie na płaszczkowaty (wariant: przy ścianie)"]]},
      {"c": "st.tension", "s": [["webmd-calf-step", "kroki 2–3: powolne opuszczanie, „You should feel a gentle stretch…”"], ["ace-211", "Step 2: „Slowly lower the left (back) heel…”"]]}
    ],
    "mistakes": []
  },
  "Wall Calf Stretch": {
    "setup": [
      {"c": "mobility_stand.s.wallCalfSet", "s": [["ace-152", "Step 1: dłonie na ścianie, krok w tył do wykroku, obie stopy płasko, palce do przodu"], ["nhs-flexibility", "Calf stretch: dłonie na ścianie, lewa noga w tył, „both feet flat on the floor”"], ["ccv-flexibility", "Calf stretch: twarzą do ściany, dłonie płasko na ścianie, jedna stopa w tył"], ["webmd-heelcord", "dłonie na ścianie, krok jedną nogą do ściany"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.wallCalfMove", "s": [["ace-152", "Step 2: przednie kolano ugina się, tylna noga prosta, pięta wciskana w podłogę"], ["nhs-flexibility", "Calf stretch: ugięte przednie kolano, tylna noga prosta, pięta na podłodze"], ["ccv-flexibility", "Calf stretch: pochyl się, przednie kolano lekko ugięte, tylna noga prosta"], ["webmd-heelcord", "„Lean forward, keeping the left leg straight and the left heel on the floor.”"]]}
    ],
    "tips": [
      {"c": "st.tension", "s": [["ace-152", "Step 2: „Slowly move your body toward the wall…”, pogłębianie stopniowo"], ["ccv-flexibility", "Calf stretch: tylna stopa dalej, aż poczujesz rozciąganie; General: stretch to mild discomfort"]]},
      {"c": "gcalf.knee", "s": [["nhs-shrops-calf", "s. 1, How to Stretch: kolano proste — środek łydki; ugięte — niżej (płaszczkowaty)"], ["ace-152", "Step 4: lekko ugięte tylne kolano — płaszczkowaty"]]}
    ],
    "mistakes": [
      {"c": "mobility_stand.s.mis.heelUp", "s": [["nhs-shrops-calf", "s. 1, How to Stretch: „Do not lift the heels or push your bottom out.”"], ["ace-152", "Step 3: „…heels in contact with the floor.”"], ["nhs-flexibility", "Calf stretch: pięta na podłodze"]]}
    ]
  },
  "Standing Soleus And Achilles Stretch": {
    "setup": [
      {"c": "mobility_stand.s.wallCalfSet", "s": [["ace-152", "Step 1 (ustawienie przy ścianie, wspólne z wariantem z kroku 4)"], ["nhs-shrops-calf", "s. 1, How to Stretch: „Stand with one foot in front of the other and place your hands/ or elbows on the wall.”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.soleusMove", "s": [["ace-152", "Step 4: lekko ugnij tylne kolano, pięta wciśnięta w podłogę"], ["nhs-shrops-calf", "s. 1, How to Stretch: kolana ugięte — rozciąganie w dolnej części łydki (płaszczkowaty)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mobility_stand.s.mis.heelUp", "s": [["nhs-shrops-calf", "s. 1: „Do not lift the heels…” (w opisie wersji z ugiętymi kolanami)"], ["ace-152", "Step 3–4: pięta w kontakcie z podłogą"]]}
    ]
  },
  "Standing Elevated Quad Stretch": {
    "setup": [
      {"c": "mobility_stand.s.quadSet", "s": [["webmd-quad-standing", "„…stand holding a chair, counter, or wall.”"], ["ccv-flexibility", "Quadriceps stretch: „Stand near a wall for support” (parafraza)"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.quadMove", "s": [["webmd-quad-standing", "chwyć przód stopy, „pull your foot toward your buttock until you feel a gentle stretch…”"], ["ccv-flexibility", "Quadriceps stretch: unieś stopę w tył, chwyć kostkę, przyciągnij piętę do pośladka"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Cross-Body Shoulder Stretch": {
    "setup": [
      {"c": "mobility_stand.s.xbodySet", "s": [["ccv-flexibility", "Shoulder stretch: ręka na wysokość barku, przeciągnięta przed klatką"], ["webmd-shoulder-posterior", "„…pull your affected arm gently up and across your body.”"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.xbodyMove", "s": [["webmd-shoulder-posterior", "„Hold the elbow of your affected arm with your other hand.”"], ["ccv-flexibility", "Shoulder stretch: delikatnie przeciągnij przez klatkę, podtrzymując drugą ręką"]]}
    ],
    "tips": [
      {"c": "mobility_stand.s.shoulderLoose", "s": [["ccv-flexibility", "Shoulder stretch: bark rozluźniony, nie unosi się do ucha"], ["webmd-shoulder-posterior", "„Relax your shoulders.”"]]}
    ],
    "mistakes": []
  },
  "Overhead Triceps Stretch": {
    "setup": [
      {"c": "mobility_stand.s.triSet", "s": [["ace-174", "Step 1: ręka w górę, zgięcie w łokciu, dłoń na środek pleców"], ["ccv-flexibility", "Triceps stretch: zgięty łokieć, przedramię opuszczone wzdłuż pleców"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.triMove", "s": [["ace-174", "Step 1: palce drugiej ręki nad łokciem, „applying light pressure to deepen the stretch.”"], ["ccv-flexibility", "Triceps stretch: drugą ręką delikatnie dociśnij łokieć w dół"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Standing Lateral Stretch": {
    "setup": [
      {"c": "mobility_stand.s.sideSet", "s": [["nhs-flexibility", "Sideways bend: „Stand upright with your feet hip-width apart and arms by your sides.”"], ["webmd-side-bend", "wersja stojąca: ręce wzdłuż ciała, stopy na szerokość barków"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.sideMove", "s": [["nhs-flexibility", "Sideways bend: zsuwaj rękę wzdłuż boku „as far as is comfortable”, czujesz rozciąganie"], ["webmd-side-bend", "„Slowly bend to the left.”"]]}
    ],
    "tips": [
      {"c": "sb.plane", "s": [["webmd-side-bend", "„Don't twist your torso.”; „avoid rounding your back”"], ["ace-212", "Step 2: skłon w bok bez skrętu i bez pochylenia w przód (wariant: siedząc)"]]}
    ],
    "mistakes": []
  },
  "Side Neck Stretch": {
    "setup": [
      {"c": "mobility_stand.s.neckSet", "s": [["ace-202", "Step 1: stań, łopatki w dół i do tyłu"], ["nhs-flexibility", "Neck stretch: siedź prosto, bark przytrzymany w dole (wariant: siedząc)"]]}
    ],
    "move": [
      {"c": "mobility_stand.s.neckSideMove", "s": [["ace-202", "Step 2: powoli ucho do barku, „when you feel the stretch” zatrzymaj"], ["nhs-wwl-neck", "s. 6, ćw. 2 Side Flexions: „Tilt your head toward one shoulder until you feel the stretch on the opposite side.”"], ["nhs-flexibility", "Neck stretch: „Slowly tilt your head to the right…”"]]}
    ],
    "tips": [
      {"c": "mobility_stand.s.neckShouldersDown", "s": [["ace-202", "Step 2: „Keep your shoulders down and back” (parafraza)"], ["nhs-flexibility", "Neck stretch: bark przytrzymany w dole drugą ręką"]]}
    ],
    "mistakes": []
  }
}
```

Uwaga do `gcalf.move` i `gcalf.knee`: zdanie mówi „z prostym kolanem” — wprost dla wersji na stopniu potwierdza to `nhs-shrops-calf` („legs straight”); `webmd-calf-step` i `ace-211` opisują opuszczanie pięty bez wzmianki o kolanie (zgodne kierunkowo).

## Nowe zdania

| Id | PL | EN (propozycja) | Uwaga |
|---|---|---|---|
| mobility_stand.s.wallCalfSet | Oprzyj dłonie o ścianę i cofnij jedną nogę; obie stopy płasko, palce do przodu. | Hands on the wall, one leg back, both feet flat and toes pointing forward. | ACE #152, NHS, CCV, WebMD Ignite |
| mobility_stand.s.wallCalfMove | Ugnij przednie kolano i przenieś ciężar w stronę ściany; tylna noga prosta, pięta na podłodze. | Bend the front knee and shift toward the wall; back leg straight, heel down. | jw. |
| mobility_stand.s.mis.heelUp | Odrywanie tylnej pięty od podłogi. | Letting the back heel come off the floor. | NHS Shropshire, ACE #152, NHS |
| mobility_stand.s.soleusMove | Lekko ugnij tylne kolano, pięta zostaje na podłodze — poczujesz rozciąganie niżej w łydce. | Bend the back knee slightly, heel stays down — you'll feel it lower in the calf. | ACE #152 krok 4, NHS Shropshire |
| mobility_stand.s.quadSet | Stań przy ścianie albo krześle i przytrzymaj się dla równowagi. | Stand next to a wall or chair and hold on for balance. | WebMD Ignite, CCV |
| mobility_stand.s.quadMove | Ugnij nogę, chwyć stopę i przyciągnij piętę do pośladka, aż poczujesz rozciąganie z przodu uda. | Bend your knee, grab your foot and pull the heel toward your glutes until you feel the front of the thigh stretch. | WebMD Ignite, CCV |
| mobility_stand.s.xbodySet | Unieś rękę do wysokości barku i przełóż ją przed klatką na drugą stronę. | Raise your arm to shoulder height and bring it across your chest. | CCV, WebMD Ignite |
| mobility_stand.s.xbodyMove | Drugą ręką złap za łokieć i delikatnie dociągnij rękę do klatki. | Hold the elbow with your other hand and gently pull the arm in. | WebMD Ignite, CCV |
| mobility_stand.s.shoulderLoose | Bark luźno — nie podciągaj go do ucha. | Keep the shoulder relaxed — don't let it creep up to your ear. | CCV, WebMD Ignite |
| mobility_stand.s.triSet | Unieś rękę, ugnij ją w łokciu i opuść dłoń na plecy, między łopatki. | Raise your arm, bend the elbow and drop your hand down your back. | ACE #174, CCV |
| mobility_stand.s.triMove | Drugą ręką lekko dociśnij łokieć, aż poczujesz rozciąganie z tyłu ramienia. | Use your other hand to press lightly on the elbow until you feel the back of the arm stretch. | ACE #174, CCV |
| mobility_stand.s.sideSet | Stań prosto, ręce wzdłuż ciała. | Stand tall, arms by your sides. | NHS, WebMD Ignite |
| mobility_stand.s.sideMove | Powoli skłoń się w bok, aż poczujesz rozciąganie boku. | Slowly bend to the side until you feel the stretch along your side. | NHS, WebMD Ignite |
| mobility_stand.s.neckSet | Stań prosto, barki opuszczone. | Stand tall with your shoulders down. | ACE #202, NHS (wariant siedząc) |
| mobility_stand.s.neckSideMove | Powoli przechyl głowę, ucho w stronę barku, aż poczujesz rozciąganie z boku szyi. | Slowly tilt your head, ear toward your shoulder, until you feel the side of your neck stretch. | ACE #202, NHS WWL, NHS |
| mobility_stand.s.neckShouldersDown | Barki trzymaj nisko — nie unoś ich do uszu. | Keep your shoulders down, away from your ears. | ACE #202, NHS |

Słownik terminów: „łydka”, „pośladek”, „łopatki” — zwykłe słowa; „płaszczkowaty” nie trafia do zdań (tylko w uwagach).

## Nowe źródła

```json
{
  "ace-152": {"org": "ACE", "title": "Standing Dorsi-Flexion (Calf Stretch) (#152)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/152/", "level": 4},
  "ace-174": {"org": "ACE", "title": "Overhead Triceps Stretch (#174)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/174/", "level": 4},
  "ace-202": {"org": "ACE", "title": "Lateral Neck Flexion (#202)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/202/lateral-neck-flexion/", "level": 4},
  "ace-204": {"org": "ACE", "title": "Neck Flexion and Extension (#204)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/204/neck-flexion-and-extension/", "level": 4},
  "ace-209": {"org": "ACE", "title": "Standing Chest Stretch (#209)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/209/", "level": 4},
  "ace-211": {"org": "ACE", "title": "Step Stretch (#211)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/211/step-stretch/", "level": 4},
  "ace-212": {"org": "ACE", "title": "Seated Side Straddle Stretch (#212)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/212/seated-side-straddle-stretch/", "level": 4},
  "nhs-flexibility": {"org": "NHS (nhs.uk)", "title": "Flexibility exercises", "url": "https://www.nhs.uk/live-well/exercise/flexibility-exercises/", "level": 4},
  "nhs-shrops-calf": {"org": "Shropshire Community Health NHS Trust (podiatria)", "title": "Calf Stretching Information Leaflet", "url": "https://www.shropscommunityhealth.nhs.uk/content/doclib/13861.pdf", "level": 4},
  "nhs-wwl-neck": {"org": "Wrightington, Wigan and Leigh Teaching Hospitals NHS FT (fizjoterapia MSK)", "title": "Neck and Upper Back Exercises Level 1 (Tpy 023, v2)", "url": "https://www.wwl.nhs.uk/pdfreader/accessiblePDF/cnv-wwl-68ca8bce9edd73.73954624", "level": 4},
  "ccv-flexibility": {"org": "Cancer Council Victoria", "title": "Flexibility exercises", "url": "https://www.cancervic.org.au/get-support/guides/managing-daily-life/exercise/flexibility-exercises", "level": 4},
  "webmd-calf-step": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Calf stretch (step)", "url": "https://www.columbiadoctors.org/health-library/multimedia/calf-stretch-step/", "level": 4},
  "webmd-quad-standing": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Standing quad stretch", "url": "https://www.columbiadoctors.org/health-library/multimedia/standing-quad-stretch/", "level": 4},
  "webmd-shoulder-posterior": {"org": "WebMD Ignite (publikacja: ColumbiaDoctors)", "title": "Shoulder stretch (posterior)", "url": "https://www.columbiadoctors.org/health-library/multimedia/shoulder-stretch-posterior/", "level": 4},
  "webmd-heelcord": {"org": "WebMD Ignite (publikacja: UMass Memorial Health)", "title": "Heel Cord (Gastrocnemius) Stretch (Flexibility)", "url": "https://www.ummhealth.org/health-library/heel-cord-gastrocnemius-stretch-flexibility", "level": 4},
  "webmd-side-bend": {"org": "WebMD Ignite (publikacja: UMass Memorial Health)", "title": "Back Exercises: Side Bend Stretch", "url": "https://www.ummhealth.org/health-library/back-exercises-side-bend-stretch", "level": 4}
}
```

| Id | Organizacja | Szczebel | Co potwierdza |
|---|---|---|---|
| ace-152 | ACE | 4 | łydka przy ścianie: ustawienie, ruch, pięta na podłodze, ugięte kolano → płaszczkowaty |
| ace-174 | ACE | 4 | triceps nad głową: ustawienie, lekki docisk łokcia |
| ace-202 | ACE | 4 | skłon szyi w bok: ustawienie, ruch, barki nisko |
| ace-204 | ACE | 4 | broda do klatki (tylko jedno źródło — otwarte) |
| ace-209 | ACE | 4 | rozciąganie klatki stojąc (jedno źródło — otwarte) |
| ace-211 | ACE | 4 | łydka na stopniu: ustawienie, podparcie, opuszczanie pięty |
| ace-212 | ACE | 4 | skłon w bok bez skrętu i pochylenia (wariant siedzący; już używane przez `sb.plane`) |
| nhs-flexibility | NHS | 4 | łydka przy ścianie, skłon w bok, skłon szyi (wariant siedzący) |
| nhs-shrops-calf | NHS Shropshire | 4 | łydka przy ścianie i na schodach, kolano proste / ugięte, „nie odrywaj pięt” |
| nhs-wwl-neck | NHS WWL | 4 | skłon szyi w bok do odczucia rozciągania; „przerwij przy zawrotach głowy” (otwarte) |
| ccv-flexibility | Cancer Council Victoria | 4 (PROPOZYCJA — organizacja zdrowia non-profit; do potwierdzenia przez audytora jak WebMD Ignite w docs/33) | łydka, czworogłowy, bark w poprzek, triceps; zasady ogólne (bez sprężynowania, bez wstrzymywania oddechu, do lekkiego dyskomfortu) |
| webmd-* (5 stron) | WebMD Ignite | 4 (PROPOZYCJA, jak w docs/33) | jedna organizacja — w każdym ćwiczeniu liczona raz |

Uwaga o niezależności: nhs.uk, NHS Shropshire i NHS WWL to różne instytucje NHS; w żadnym ćwiczeniu zdanie nie opiera się wyłącznie na dwóch źródłach NHS.

## Otwarte

- **Zestaw ogólny `st.*` (informacja o błędach zestawów):** dla większości ćwiczeń tej części tylko jedno przeczytane źródło dotyczy tego ćwiczenia wprost:
  - `st.noBounce` („do not bounce”) i `st.breathe` („Do not hold your breath”) — przeczytane tylko w zasadach ogólnych `ccv-flexibility` (obejmują łydkę, czworogłowy, bark, triceps); drugie źródło dla tych ćwiczeń nie znalezione → nie wpisane nigdzie.
  - `st.mis.force` — `ccv-flexibility` („Never keep pushing a stretch that hurts”, parafraza) i `webmd-side-bend` („Stay within your pain limits”) to różne ćwiczenia; dla żadnego ćwiczenia nie ma 2 źródeł → nie wpisane.
  - `st.tension` — wpisane tylko dla obu wersji łydki (2 źródła); dla pozostałych nie wpisane, choć źródła opisują „do odczucia rozciągania” (zawarte w zdaniach `...Move`).
- **`gcalf.*` — dotychczasowe źródło z platformy ćwiczeń dla fizjoterapeutów** (w `wskazowki-ogolne.json`): po uzupełnieniu briefu (02.11.2026, strony innych aplikacji nie są źródłem) do decyzji koordynatora, czy ta platforma podlega regule; niniejsze dane `gcalf.*` jej nie używają. Wpis `gcalf.knee` w `wskazowki-ogolne.json` ma też instrukcję producenta sprzętu (odczyt 28.10.2026, nie powtarzany).
- **Standing Elevated Quad Stretch:** słowo „Elevated” (stopa na podwyższeniu? kolano/udo uniesione?) — nie ustalone; dane opisują wersję stojącą „pięta do pośladka” (zgodną z figurą `piety_do_posladka`). Wskazówki „kolana obok siebie, kolano w dół” (tylko `webmd-quad-standing`) i „tułów prosto” (tylko `ccv-flexibility`) — po jednym źródle.
- **Overhead Triceps Stretch:** „bark nisko, z dala od ucha” — tylko ACE #174; „ręka blisko ucha, głowa nie w przód” — tylko CCV.
- **Side Neck Stretch — ostrożność (zdrowie, pełne zasady):** „przerwij, jeśli zakręci Ci się w głowie albo poczujesz się źle” — przeczytane tylko w `nhs-wwl-neck` (s. 5–7, przy każdym ćwiczeniu). Jedno źródło szczebla 4 → nie do aplikacji. „Dłonią tylko lekki docisk” — tylko ACE #202 (i ACE #204 — ta sama organizacja).
- **Chin To Chest Stretch:** ruch „powoli broda do klatki” — tylko ACE #204; NHS WWL opisuje cofanie brody (inne ćwiczenie). Strony HSS (neck pain relief) i uczelniany PDF (University of Iowa) nie zawierają tego opisu / nieczytelne.
- **Standing Chest Stretch:** tylko ACE #209 (unieś klatkę, barki w dół i do tyłu, łopatki ściągnięte). CCV opisuje rozciąganie przy ścianie (inne ustawienie).
- **Standing Biceps Stretch, Chest And Front Of Shoulder Stretch:** ACE #209 (wariant z dłońmi splecionymi za plecami) — jedno źródło; ACE #208 to wersja siedząca z przesuwaniem bioder (analogia, nie liczy się).
- **Standing Toe Touches, Wall Lat Stretch, One Knee To Chest, Overhead Stretch, Chest Stretch on Stability Ball:** nie zbadane (limit kontekstu).

## Stan

- **Zrobione:** Standing Gastrocnemius Calf Stretch, Wall Calf Stretch, Standing Soleus And Achilles Stretch, Cross-Body Shoulder Stretch, Overhead Triceps Stretch, Standing Lateral Stretch (gotowe); Standing Elevated Quad Stretch, Side Neck Stretch (częściowe); Chin To Chest, Standing Chest, Standing Biceps (sprawdzone — otwarte, jedno źródło).
- **Zostało:** Standing Toe Touches, Wall Lat Stretch, Chest And Front Of Shoulder Stretch, One Knee To Chest, Overhead Stretch, Chest Stretch on Stability Ball; drugie źródło dla Standing Chest, Chin To Chest, ostrożności szyi, wskazówek quad/triceps; drugie źródło dla `st.noBounce` / `st.breathe` per ćwiczenie.
- **Następny krok:** szukać stron WebMD Ignite (columbiadoctors.org / ummhealth.org „health-library”) i NHS dla: hamstring stretch standing (toe touches), knee to chest standing, lat stretch, chest stretch (doorway / hands behind back); drugie źródło dla chin-to-chest i ostrożności szyi (szpitalne ulotki NHS w HTML).
- **Pułapki:** Mayo Clinic — 403; exrx.net — 403; web.archive.org — zablokowane; NASM — strony statycznych rozciągań w większości 404 (istnieją tylko nieliczne, np. static-standing-adductor-stretch); PDF-y NHS przez WebFetch nieczytelne — trzeba je czytać z zapisanego pliku jako obraz strony (Read z `pages`); nationwidechildrens.org — domena poza siecią sesji; NHS Fife, healthwell.eani — 403. WebMD Ignite publikuje te same treści na wielu witrynach szpitali — zawsze jedna organizacja.
