# Wskazówki techniki — fala W2, rodzina `delt_raise`, część 1

Data: 02.11.2026. Autor: badacz merytoryczny (agent, G7). Status: **PROPOZYCJA** — nic nie trafia do `lib/` ani `data/` bez programisty i recenzji
(bramka 4: wykonawca ≠ recenzent). Podstawa: plik W1 `delt_raise.md` (sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026” i blok po
przeliczeniu — zdania „zostaje” użyte bez ponownego badania). Ćwiczenia z `delt_raise-2.md` — inny badacz (nie badane tu).
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` (rozstrzygnięcia + uzupełnienia 2–3). free-exercise-db = 5 — nie liczy się i nie jest wpisywany.
Wszystkie strony przeczytane przez WebFetch 02.11.2026; PDF MGH przeczytany jako obraz stron 1–4. Narzędzie często zwraca parafrazę — oznaczone „(parafraza)”.

## 1. Ćwiczenia — stan

| Ćwiczenie | Stan | Uwagi |
|---|---|---|
| One-Arm Lateral Raise (hantel) | **własna z błędami** | W1: setup/move/tip zostają; + `lat.height` (2. tip), błędy `delt1.mis.arch` (źródła), `delt1.mis.elbows` (wniosek) |
| Dumbbell Scaption | **własna z błędami** | W1: setup/move/tip zostają; + `lat.height` (2. tip), błąd `scap.mis.plane` (wniosek) |
| Dumbbell Lying One-Arm Rear Lateral Raise | **własna z błędami** (było: otwarta) | ustawienie: HSS s. 3 + szpital Tomah (MSD Manuals) — 2 organizacje; ACE 34 Step 1 NIE opisuje leżenia przodem (siad przodem do oparcia 45–60°) — nie liczy się dla ustawienia; błąd `rear1.mis.high` |
| Front Plate Raise | **własna z błędami** (było: otwarta) | Catalyst 803 (sztanga) + ACE 54 (hantle) — uproszczenie „wariant sprzętu” |
| Single Dumbbell Front Raise | **własna z błędami** | jw. |
| Cable Front Raise | **własna z błędami** | Catalyst 812 (wyciąg) + ACE 54 (hantle) — uproszczenie „wariant sprzętu” |
| Alternating Deltoid Raise | **własna z błędami — ruch z uproszczeniem** | ustawienie: ACE 54 + Catalyst 822 (wprost); ruch naprzemienny opisuje tylko Catalyst 822 — ACE 54/26 opisują składowe → „uproszczenie: złożenie dwóch ruchów”; recenzent decyduje, czy to wystarcza |
| Upright Row (sztanga) | **własna z błędami** | NSCA ETM (przedruk, szczebel 3) + ISSA (4) — oba sztanga; UMass/WebMD Ignite (hantle) trzecie |
| Upright Row (linki), Smith Machine Upright Row, Dumbbell One-Arm Upright Row, Smith Machine One-Arm Upright Row | **własna z błędami** | uproszczenie „wariant sprzętu sztanga/hantle” — ruch ten sam (ciężar prowadzony pionowo przy ciele); Smith: ISSA wymienia wersję na suwnicy jako wariant |
| Band Upright Row | **własna z błędami (ustawienie z uproszczeniem)** | Bodylastics (4 dla taśm) + wersja bazowa; szczegół „stań na taśmie” — jedno źródło (Bodylastics), więc w zdaniu ustawienia go nie ma |
| Cable Reverse Fly | otwarta | nadal tylko ACE 353; wyszukiwanie drugiego (ISSA/NASM/NSCA) bez wyniku szczebla ≤ 4 (trafienia: aplikacje, Physitrack = 5, sklepy) |
| Machine Lateral Raise, One-Arm Cable Rear Lateral Raise, Cable Seated Lateral Raise, Sled Reverse Flye | nie badane | wymienione też w tabeli `delt_raise-2.md` („bez zmian”) — zostawione drugiemu badaczowi, żeby nie dublować |

Razem w tej części: **13 kart własnych z błędami** (2 dopełnione z W1, 11 nowych), 1 otwarta, 4 pozostawione części 2.

Uwaga dla programisty — strażnik kompletu: `tests/cues-014.test.tsx:44` wymaga od każdej karty spoza listy `partial` co najmniej 2 wskazówek (`tips.length >= 2`);
dlatego dopisuję `lat.height` do One-Arm Lateral Raise i Scaption oraz `rear.arms` do Lying One-Arm Rear. `tests/cues-014.test.tsx:49` pilnuje BRAKU
zdania `urow.setup` w słowniku PL („wskazówki zależne od spornych źródeł”) — wprowadzenie `urow.setup` odwraca ten stan: zmiana testu w tym samym
commicie i wpis decyzji w docs/18 (szczeble WebMD Ignite / przedruku NSCA rozstrzygnięte 02.11.2026 — niżej, sekcja 4).

## 2. Uzasadnienia (część wspólna, różnice)

- **Front raises (Plate, Single DB, Cable, Alternating):** ACE 54 — hantle przed udami, łokcie „extended or holding a slight bend”, unoszenie do poziomu
  barków, powolne opuszczanie; Catalyst 803/812/822 — ciężar zwisa na wyprostowanych rękach, „straight arms… to above shoulder height… lower again under
  control”. Część wspólna: „łokcie proste lub lekko ugięte”, „mniej więcej do wysokości barków” (istniejące `front.elbows`, `lat.height`). Wariant sprzętu:
  talerz/pojedynczy hantel trzymany oburącz = jak sztanga Catalyst 803 (jeden przyrząd w obu dłoniach); wyciąg = Catalyst 812 wprost; tor ruchu (proste ręce
  w przód) nie zależy od przyrządu.
- **`delt1.mis.arch`:** ACE 54 Step 3 i ACE 26 Step 3 — „Maintain your torso erect (no arching your low back)” (błąd nazwany wprost); Catalyst 803/812/822 —
  „Keeping the trunk braced tightly” (standard: ta sama część ciała — tułów, to samo kryterium — tułów sztywny) → „błąd = zaprzeczenie standardu”.
  Dla Upright Row NIE dopisuję: NSCA („do not… swing the body (i.e., hyperextend the spine)”) jest jedyny, ISSA/UMass nie mówią o tułowiu.
- **Lying One-Arm Rear:** HSS s. 3 (odczyt W1) i szpital Tomah (MSD Manuals) — leżenie przodem, ręka zwisa poza krawędzią, unoszenie do poziomu barku.
  `rear1.mis.high`: HSS s. 3 „Limit the height that you raise the arm to 90 degrees, or in other words, horizontal to the floor” (granica wprost) +
  Tomah „Lift arm upward to shoulder level” (standard) → „błąd = zaprzeczenie standardu”. Kciuk: HSS „thumb faces forward”, Tomah „thumb pointed out away
  from body” — rozbieżne, pominięte.
- **Niezależność HSS i MGH:** PDF Massachusetts General Hospital Sports Physical Therapy „Shoulder Rotator Cuff and Scapular Strengthening Program”
  ma ten sam tytuł i niemal identyczne zdania jak PDF HSS (K. M. Sutton), np. Lateral Raises: „Do not raise the hands higher than the shoulder.” —
  **to jedno źródło (kopia), nie para**. Nie używam MGH. Pary W1 (HSS + ACE) się nie zmieniają.
- **Upright row:** ustawienie — NSCA „Grasp the bar evenly with a closed and pronated grip… Allow the bar to hang at full elbow extension.”; ISSA
  „Grip the barbell with an overhand grip (palms face your body) and hold it so the arms are fully extended.”; UMass/WebMD Ignite — hantle przed sobą,
  „palms facing the body”; Bodylastics — „palms facing behind you”. Ruch — NSCA: gryf blisko brzucha i klatki do strefy dolny koniec mostka–broda,
  „Lower the bar slowly and under control”; ISSA „Lift the barbell while keeping it close to the front of the body”; UMass — „up to your collarbone”;
  Catalyst 805 „then lower under control”. Łokcie — NSCA „the elbows should be level with or slightly higher than the shoulders and wrists”, ISSA
  „make sure each elbow stays above the forearm”, Bodylastics „Lead the movement with your elbows”.
  **Różnice (część wspólna zamiast nich):** szerokość chwytu — NSCA „shoulder-width or slightly wider”, Catalyst 805 „hands touching each other or very
  close” → w tekście bez szerokości. Wysokość — NSCA łokcie ≥ barki, UMass do obojczyków, Bodylastics dłonie do dołu klatki, Catalyst „elbows as high as
  possible” → „w stronę obojczyków” / „mniej więcej do wysokości barków” (istniejące `ur.height`). Wzruszanie barkami — NSCA „do not shrug the shoulders”,
  Catalyst 805 „allowing yourself to shrug up and back naturally” → sprzeczność; wg hierarchii wyższy szczebel (NSCA, 3) wygrywa, ale błąd wymaga 2
  źródeł → **[OTWARTE]**, nie wchodzi.
  `urow.mis.curl` — NSCA „do not curl the bar upward” (wprost) + wniosek z `ur.elbows`; `urow.mis.away` — wniosek z `urow.move` („blisko ciała”;
  standard w NSCA, ISSA, UMass, Bodylastics). Smith: bez `urow.mis.away` (tor gryfu prowadzony).
- **Scaption `scap.mis.plane`:** wniosek z `scap.move` (ok. 30° od linii przodu — HSS + ACE 8951); da się pokazać na rysunku (ręce w płaszczyźnie
  czołowej albo strzałkowej zamiast pośredniej).
- **`delt1.mis.elbows`:** wniosek z `rear.elbows` (One-Arm Lateral; „Kąt w łokciach stały”) i z `front.elbows` (front raises; „w tym samym ustawieniu
  przez cały ruch”).
- ACE (artykuły) zaleca zastępowanie upright row unoszeniem bokiem — to twierdzenie o zdrowiu stawu; **nie przenoszę do aplikacji**.

### Blok do wdrożenia

Źródła z W1 (już zaproponowane tam, nie dubluję wpisów): `hss-sutton-shoulder`, `ace-354`, `ace-cert-8951`, `catalyst-803`, `catalyst-812`, `catalyst-822`
(organizacja Catalyst Athletics — jeśli nie wpisana wcześniej, wpis niżej). Istniejące: `ace-26`, `ace-34`, `ace-54`. Nowe źródła/orgs — w bloku.

```json
{
  "exercises": {
    "One-Arm Lateral Raise (hantel)": {
      "setup": [{"c": "lat1.setup", "s": [["hss-sutton-shoulder", "s. 1, Lateral Raises (arm at your side with the elbow straight)"], ["ace-26", "Step 1 (wariant: dwie ręce)"]]}],
      "move": [{"c": "lat1.move", "s": [["hss-sutton-shoulder", "s. 1, Lateral Raises (until the hands reach shoulder level; slowly lower)"], ["ace-354", "opis (wariant: wyciąg)"]]}],
      "tips": [
        {"c": "rear.elbows", "s": [["hss-sutton-shoulder", "s. 1, Lateral Raises (raise the arm straight)"], ["ace-26", "Step 1; Step 4"]]},
        {"c": "lat.height", "s": [["hss-sutton-shoulder", "s. 1, Lateral Raises (until the hands reach shoulder level)"], ["ace-26", "Step 3 (until your arms are level with your shoulders)"]]}
      ],
      "mistakes": [
        {"c": "delt1.mis.arch", "s": [["ace-26", "Step 3 (no arching your low back)"], ["catalyst-822", "opis (trunk braced tightly) — błąd = zaprzeczenie standardu"]]},
        {"c": "delt1.mis.elbows", "s": [["wniosek", "rear.elbows"]]}
      ]
    },
    "Dumbbell Scaption": {
      "setup": [{"c": "scap.setup", "s": [["hss-sutton-shoulder", "s. 1, full-can (keeping the elbows straight)"], ["ace-cert-8951", "Dumbbell V-Raise (arms are straight)"]]}],
      "move": [{"c": "scap.move", "s": [["hss-sutton-shoulder", "s. 1, full-can (30°, to shoulder level)"], ["ace-cert-8951", "Dumbbell V-Raise (30°, shoulder height; wariant: na zmianę)"]]}],
      "tips": [
        {"c": "sapd.arms", "s": [["hss-sutton-shoulder", "s. 1, full-can (keeping the elbows straight)"], ["ace-cert-8951", "Dumbbell V-Raise (arms straight)"]]},
        {"c": "lat.height", "s": [["hss-sutton-shoulder", "s. 1, full-can (to shoulder level)"], ["ace-cert-8951", "Dumbbell V-Raise (up to shoulder height)"]]}
      ],
      "mistakes": [{"c": "scap.mis.plane", "s": [["wniosek", "scap.move"]]}]
    },
    "Dumbbell Lying One-Arm Rear Lateral Raise": {
      "setup": [{"c": "rear1.setup", "s": [["hss-sutton-shoulder", "s. 3, Prone horizontal abduction (lie face down… arm hanging freely off of the side)"], ["msd-tomah-prone-habd", "instrukcja (Lie on stomach with involved arm down off edge of table)"]]}],
      "move": [{"c": "rear1.move", "s": [["hss-sutton-shoulder", "s. 3 (to shoulder height; slowly lower)"], ["ace-34", "Step 2; Step 3 (wariant: dwie ręce)"], ["msd-tomah-prone-habd", "instrukcja (Lift arm upward to shoulder level)"]]}],
      "tips": [
        {"c": "rear.elbows", "s": [["hss-sutton-shoulder", "s. 3 (keeping the elbows straight)"], ["ace-34", "Step 1 (wariant: dwie ręce; elbows slightly flexed)"]]},
        {"c": "rear.arms", "s": [["hss-sutton-shoulder", "s. 3 (thumb… aligned with your cheek)"], ["ace-34", "wskazówka końcowa (in line with the ears) — wg cues.json:5802"]]}
      ],
      "mistakes": [{"c": "rear1.mis.high", "s": [["hss-sutton-shoulder", "s. 3 (Limit the height… to 90 degrees… horizontal to the floor)"], ["msd-tomah-prone-habd", "instrukcja (to shoulder level) — błąd = zaprzeczenie standardu"]]}]
    },
    "Front Plate Raise": {
      "setup": [{"c": "front2.setup", "s": [["catalyst-803", "opis (hanging at arms' length)"], ["ace-54", "Step 1 (elbows extended or holding a slight bend)"]], "uproszczenie": "wariant sprzętu sztanga/hantle"}],
      "move": [{"c": "front.move", "s": [["catalyst-803", "opis (straight arms… lower under control)"], ["ace-54", "Step 3; Step 4"]], "uproszczenie": "wariant sprzętu sztanga/hantle"}],
      "tips": [
        {"c": "front.elbows", "s": [["catalyst-803", "opis (straight arms)"], ["ace-54", "Step 1; Step 4"]]},
        {"c": "lat.height", "s": [["catalyst-803", "opis (just above shoulder height)"], ["ace-54", "Step 3 (level with your shoulders)"]]}
      ],
      "mistakes": [
        {"c": "delt1.mis.arch", "s": [["ace-54", "Step 3 (no arching of your low back)"], ["catalyst-803", "opis (trunk braced) — błąd = zaprzeczenie standardu"]]},
        {"c": "delt1.mis.elbows", "s": [["wniosek", "front.elbows"]]}
      ]
    },
    "Single Dumbbell Front Raise": "(identycznie jak Front Plate Raise — te same zdania, źródła i uproszczenie)",
    "Cable Front Raise": {
      "setup": [{"c": "cfr.setup", "s": [["catalyst-812", "opis (straight handle, low cable)"], ["ace-54", "Step 1 (wariant: hantle; in front of your thighs)"]], "uproszczenie": "wariant sprzętu hantle"}],
      "move": [{"c": "front.move", "s": [["catalyst-812", "opis"], ["ace-54", "Step 3; Step 4 (wariant: hantle)"]]}],
      "tips": [
        {"c": "front.elbows", "s": [["catalyst-812", "opis (straight arms)"], ["ace-54", "Step 1; Step 4"]]},
        {"c": "lat.height", "s": [["catalyst-812", "opis (above shoulder height)"], ["ace-54", "Step 3"]]}
      ],
      "mistakes": [
        {"c": "delt1.mis.arch", "s": [["ace-54", "Step 3 (no arching of your low back)"], ["catalyst-812", "opis (trunk braced tightly) — błąd = zaprzeczenie standardu"]]},
        {"c": "delt1.mis.elbows", "s": [["wniosek", "front.elbows"]]}
      ]
    },
    "Alternating Deltoid Raise": {
      "setup": [{"c": "front.setup", "s": [["ace-54", "Step 1"], ["catalyst-822", "opis (pair of dumbbells hanging at arms' length, palms facing back)"]]}],
      "move": [{"c": "adr.move", "s": [["catalyst-822", "opis (next rep out to the sides; alternating)"], ["ace-54", "Step 3 (składowa: w przód)"], ["ace-26", "Step 3 (składowa: bokiem)"]], "uproszczenie": "złożenie dwóch ruchów (front raise + lateral raise)"}],
      "tips": [
        {"c": "front.elbows", "s": [["ace-54", "Step 1; Step 4"], ["catalyst-822", "opis (straight arms)"]]},
        {"c": "lat.height", "s": [["ace-54", "Step 3"], ["catalyst-822", "opis (above shoulder height)"]]}
      ],
      "mistakes": [{"c": "delt1.mis.arch", "s": [["ace-54", "Step 3"], ["catalyst-822", "opis (trunk braced tightly) — błąd = zaprzeczenie standardu"]]}]
    },
    "Upright Row (sztanga)": {
      "setup": [{"c": "urow.setup", "s": [["nsca-etm-urow", "Starting position (pronated grip; bar hangs at full elbow extension)"], ["issa-urow", "How to (overhand grip, arms fully extended, bar at the thighs)"]]}],
      "move": [{"c": "urow.move", "s": [["nsca-etm-urow", "Upward/Downward movement (close to the body; lower sternum–chin; slowly and under control)"], ["issa-urow", "How to (close to the front of the body; to shoulder height — parafraza)"], ["catalyst-805", "opis (lower under control)"]]}],
      "tips": [
        {"c": "ur.elbows", "s": [["nsca-etm-urow", "Upward movement (elbows level with or higher than wrists)"], ["issa-urow", "How to (each elbow stays above the forearm)"]]},
        {"c": "ur.height", "s": [["nsca-etm-urow", "Upward movement (elbows level with shoulders; bar brushes the body)"], ["issa-urow", "How to (close to the body, to shoulder height)"]]}
      ],
      "mistakes": [
        {"c": "urow.mis.curl", "s": [["nsca-etm-urow", "Upward movement (do not curl the bar upward)"], ["wniosek", "ur.elbows"]]},
        {"c": "urow.mis.away", "s": [["wniosek", "urow.move"]]}
      ]
    },
    "Upright Row (linki)": "(jak Upright Row (sztanga); przy setup i move \"uproszczenie\": \"wariant sprzętu sztanga\")",
    "Smith Machine Upright Row": "(jak Upright Row (sztanga) BEZ urow.mis.away; setup/move \"uproszczenie\": \"wariant sprzętu sztanga\"; dodatkowo w move [\"issa-urow\", \"Variations (Smith machine)\"])",
    "Dumbbell One-Arm Upright Row": "(jak Upright Row (sztanga) + w setup/move/ur.height trzecie źródło [\"webmd-ignite-urow\", \"instrukcja (hand weights, palms facing the body; up to your collarbone)\"]; \"uproszczenie\": \"wariant sprzętu sztanga; jedna ręka\")",
    "Smith Machine One-Arm Upright Row": "(jak Smith Machine Upright Row; \"uproszczenie\": \"wariant sprzętu sztanga; jedna ręka\")",
    "Band Upright Row": {
      "setup": [{"c": "urow.setup", "s": [["bodylastics-upright-row", "instrukcja (grip the bar… palms facing behind you)"], ["nsca-etm-urow", "Starting position (wariant: sztanga)"]], "uproszczenie": "wariant sprzętu sztanga (bez „stań na taśmie” — jedno źródło)"}],
      "move": [{"c": "urow.move", "s": [["bodylastics-upright-row", "instrukcja (hands to the bottom of your chest; controlling the resistance)"], ["nsca-etm-urow", "Upward/Downward movement"]]}],
      "tips": [
        {"c": "ur.elbows", "s": [["bodylastics-upright-row", "instrukcja (lead the movement with your elbows)"], ["nsca-etm-urow", "Upward movement"]]},
        {"c": "ur.height", "s": [["bodylastics-upright-row", "instrukcja (bar close to your body)"], ["nsca-etm-urow", "Upward movement"]]}
      ],
      "mistakes": [
        {"c": "urow.mis.curl", "s": [["nsca-etm-urow", "Upward movement (do not curl the bar upward)"], ["wniosek", "ur.elbows"]]},
        {"c": "urow.mis.away", "s": [["wniosek", "urow.move"]]}
      ]
    }
  },
  "sources": {
    "catalyst-805": {"org": "Catalyst Athletics", "title": "Barbell Upright Row (#805)", "url": "https://catalystathletics.com/exercise/805/Barbell-Upright-Row/", "level": 4},
    "nsca-etm-urow": {"org": "NSCA ETM", "title": "Exercise Technique Manual for Resistance Training, 3. wyd. — Upright Row (przedruk: Coaches Association of Ontario, 04.12.2020)", "url": "https://www.coachesontario.ca/articles/breaking-down-the-upright-row/", "level": 3},
    "issa-urow": {"org": "ISSA", "title": "Upright Row: Muscles Worked, Benefits, Proper Form & More (By ISSA, 05.02.2024)", "url": "https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more", "level": 4},
    "webmd-ignite-urow": {"org": "WebMD Ignite", "title": "Upper Body Exercises: Upright Row (UMass Memorial Health)", "url": "https://www.ummhealth.org/health-library/upper-body-exercises-upright-row", "level": 4},
    "bodylastics-upright-row": {"org": "Bodylastics", "title": "Upright Row (taśmy)", "url": "https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row", "level": 4},
    "msd-tomah-prone-habd": {"org": "Tomah Memorial Hospital", "title": "Prone shoulder horizontal abduction (MSD Manuals, Professional; Tomah Memorial Hospital, Dept. of Physical Therapy)", "url": "https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction", "level": 4}
  },
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — biblioteka ćwiczeń (serwis specjalistyczny podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "NSCA ETM": {"name": "NSCA — Exercise Technique Manual for Resistance Training (książka organizacji; czytany przedruk z przypisaniem)", "level": 3, "kind": "book"},
    "ISSA": {"name": "International Sports Sciences Association — artykuły firmowane przez ISSA", "level": 4, "kind": "org"},
    "WebMD Ignite": {"name": "WebMD Ignite — materiały dla pacjentów publikowane przez placówkę medyczną", "level": 4, "kind": "site"},
    "Bodylastics": {"name": "Bodylastics — biblioteka ćwiczeń producenta taśm (tylko ćwiczenia z taśmami)", "level": 4, "kind": "maker"},
    "Tomah Memorial Hospital": {"name": "Tomah Memorial Hospital, Department of Physical Therapy (materiał w MSD Manuals)", "level": 4, "kind": "site"}
  }
}
```

Wpisy tekstowe w bloku (np. `"Single Dumbbell Front Raise": "(identycznie…)"`) to skróty dla programisty — rozwinąć do pełnych tablic przed wstawieniem.
`"uproszczenie"` przy wpisie zdania — pole jak w briefie W2; jeśli schemat `cues.json` go nie zna, programista decyduje o miejscu (np. `"s"` z dopiskiem w polu miejsca).

## 3. Nowe zdania (PL + EN)

Istniejące użyte: `front.setup`, `front.move`, `front.elbows`, `lat.height`, `rear.elbows`, `rear.arms`, `sapd.arms`, `ur.elbows`, `ur.height`.
Z W1 (jeszcze nie w `pl.json`): `lat1.setup`, `lat1.move`, `scap.setup` (brzmienie skrócone), `scap.move`, `front2.setup`, `cfr.setup`, `adr.move`, `rear1.move`.
Kolizje sprawdzone: żadne z poniższych id nie występuje w `lib/cues/text/pl.json` ani w plikach W1.

| Id | PL | EN (propozycja) |
|---|---|---|
| `rear1.setup` (nowe brzmienie zamiast W1) | Połóż się przodem na ławce; ręka z hantlem zwisa swobodnie w dół. | Lie face down on a bench, the arm with the dumbbell hanging straight down. |
| `urow.setup` (brzmienie z docs/research/33) | Stań prosto, ciężar trzymaj przed udami na wyprostowanych rękach, dłonie zwrócone do ciała. | Stand tall holding the weight in front of your thighs, arms straight, palms facing you. |
| `urow.move` (brzmienie z docs/research/33) | Unoś ciężar blisko ciała w stronę obojczyków, potem opuść go powoli do wyprostu rąk. | Lift the weight close to your body toward your collarbones, then lower it slowly until your arms are straight. |
| `delt1.mis.arch` | Odchylanie się w tył i wyginanie lędźwi przy unoszeniu. | Leaning back and arching your lower back as you lift. |
| `delt1.mis.elbows` | Zginanie łokci w trakcie unoszenia. | Bending your elbows as you lift. |
| `scap.mis.plane` | Ręce idą prosto przed siebie albo szeroko w bok zamiast lekko na skos. | Arms going straight forward or wide to the sides instead of slightly angled out. |
| `rear1.mis.high` | Unoszenie ręki wyżej niż bark. | Raising your arm above shoulder height. |
| `urow.mis.curl` | Podciąganie ciężaru samymi przedramionami — łokcie zostają niżej niż dłonie. | Curling the weight up with your forearms — elbows stay below your hands. |
| `urow.mis.away` | Ciężar odjeżdża od ciała. | The weight drifts away from your body. |

`rear1.setup` zmienione względem W1: bez „łokieć prosty lub lekko ugięty” (to mówił tylko fedb = 5 i HSS; Tomah nie mówi o łokciu; kąt łokcia i tak niesie `rear.elbows`).
`delt1.mis.elbows` przy jednorącz — liczba mnoga jak w `rear.elbows` (uwaga W1 pkt 7, decyzja recenzenta lokalizacji).

## 4. Źródła (szczebel z uzasadnieniem)

| Id | Adres | Organizacja | Szczebel | Uzasadnienie (co widać na stronie) |
|---|---|---|---|---|
| ace-54 | https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/ | ACE | 4 | precedens ACE; Steps 1–4 przeczytane |
| ace-26 | https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/ | ACE | 4 | jw.; Step 3 „Maintain your torso erect (no arching your low back)” |
| ace-34 | https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/ | ACE | 4 | Step 1: „sit on a bench facing the backrest angled at 45 to 60 degrees” — siad przodem do oparcia, nie leżenie |
| ace-353 | https://www.acefitness.org/resources/everyone/exercise-library/353/reverse-fly/ | ACE | 4 | przeczytane ponownie; jedyne źródło Cable Reverse Fly |
| catalyst-803 / -812 / -822 / -805 | https://catalystathletics.com/exercise/803/Barbell-Front-Raise/ (i 812, 822, 805) | Catalyst Athletics | 4 | szczeble-organizacji, „Rozstrzygnięcia”; 805: „Stand holding a barbell in the center with the hands touching each other or very close.” |
| hss-sutton-shoulder | https://www.hss.edu/globalassets/physician-files/sutton/shoulder-strengthening-program.pdf | HSS | 4 | Uzupełnienie 2 (szpitale); odczyt W1 (s. 1 i 3) |
| msd-tomah-prone-habd | https://www.msdmanuals.com/professional/multimedia/video/prone-shoulder-horizontal-abduction | Tomah Memorial Hospital (w MSD Manuals) | 4 | Uzupełnienie 2 (szpitale; firmowanie przez instytucję wystarcza): „Courtesy of Tomah Memorial Hospital, Department of Physical Therapy”; autorzy E. C. K. Bender, W. Gnewikow; brak daty recenzji. Niezależny od HSS (inne sformułowania, inny kciuk) |
| nsca-etm-urow | https://www.coachesontario.ca/articles/breaking-down-the-upright-row/ | NSCA ETM (przedruk CAO, 04.12.2020) | 3 | „Szczebel książek: książki NSCA = 3”; przedruk oceniany wg widocznego autora oryginału (reguła robocza z Uzupełnienia 3, wiersz Men's Health; Uzupełnienie 2, przedruk ACE). Przypisanie widoczne: NSCA, ETM 3. wyd., Human Kinetics |
| issa-urow | https://www.issaonline.com/blogs/strength/upright-row-muscles-worked-benefits-proper-form-more | ISSA | 4 | „Rozstrzygnięcia”, ISSA: artykuł firmowany „By ISSA”, data 05.02.2024 |
| webmd-ignite-urow | https://www.ummhealth.org/health-library/upper-body-exercises-upright-row | WebMD Ignite / UMass Memorial Health | 4 (z zastrzeżeniem) | „Rozstrzygnięcia”: WebMD Ignite 4 warunkowo — „materiał publikowany przez placówkę medyczną z datą”; strona ma tylko „Copyright © 2026”, bez daty. Uzupełnienie 2 (szpitale): „data nie jest wymagana” — przyjmuję 4, rozbieżność w „Otwarte” 3. W kartach to zawsze trzecie źródło, nie rozstrzyga |
| bodylastics-upright-row | https://www.bodylastics.com/exercises/resistance-bands/shoulders/upright-row | Bodylastics | 4 tylko dla taśm | „Rozstrzygnięcia”, Bodylastics; brak autora i daty — jak w rozstrzygnięciu (dokumentacja producenta) |
| (nie użyte) MGH Sports PT PDF | https://www.massgeneralbrigham.org/content/dam/unified-xwalk/pdf/patient-education/english/mass-general-shoulder-twelve-strengthening-program.pdf | Massachusetts General Hospital | 4, ale kopia | ten sam tekst co HSS — nie jest drugim źródłem |
| (odrzucone) The Prehab Guys, Band Upright Row | https://theprehabguys.com/vimeo-video/upright-row-band/ | The Prehab Guys | 5 | brak autora (Uzupełnienie 2: liczy się tylko artykuł z autorem) |

## 5. Otwarte

1. **[OTWARTE] Wzruszanie barkami w upright row** — NSCA (3) „do not shrug the shoulders” vs Catalyst 805 (4) „shrug up and back naturally”; błąd wymaga 2 źródeł.
2. **[OTWARTE] Odchylanie tułowia w upright row** — tylko NSCA; ISSA, UMass, Bodylastics nie mówią o tułowiu (Prehab Guys = 5).
3. **[OTWARTE] Szczebel WebMD Ignite bez daty** — sprzeczność „Rozstrzygnięcia” (z datą) vs Uzupełnienie 2 (szpitale: data niewymagana); karty nie zależą od tego.
4. **[OTWARTE] Przedruk NSCA ETM** (docs/research/33 pyt. 3) — przyjęty jako 3 wg reguły przedruków; jeśli koordynator go nie uzna, Upright Row (sztanga) zostaje z ISSA + UMass (wariant: hantle) i Catalyst 805 dla opuszczania; `urow.mis.curl` traci źródło (zostaje sam wniosek).
5. **[OTWARTE] Alternating Deltoid Raise — ruch** — naprzemienność opisuje tylko Catalyst 822; ACE tylko składowe (uproszczenie). Bez akceptacji recenzenta karta bez `move` = otwarta.
6. **[OTWARTE] Band Upright Row — „stań na taśmie”** — tylko Bodylastics; w zdaniu pominięte.
7. **[OTWARTE] Cable Reverse Fly** — drugie źródło szczebla ≤ 4 nieznalezione.
8. **[OTWARTE] Unoszenie ponad barki w unoszeniu bokiem** — HSS „Do not raise the hands higher than the shoulder” vs Catalyst 822 „up past shoulder height”: sprzeczność na szczeblu 4 → nie robię z tego błędu (tylko wskazówka `lat.height` „mniej więcej”).
9. Pozostawione części 2: Machine Lateral Raise, One-Arm Cable Rear Lateral Raise, Cable Seated Lateral Raise, Sled Reverse Flye.
