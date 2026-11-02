# Wskazówki techniki — rodzina `rotator_cuff` (fala W1, G2)

- Data: 02.11.2026
- Autor: badacz-merytoryczny
- Metoda: dla każdego ćwiczenia przeczytałem (WebFetch, PDF otwarte w całości) materiały ćwiczeń szczebla 4 z różnych organizacji: towarzystwo ortopedów, szpitale (USA, NHS), uczelnia (dział sportu), organizacja szkoląca trenerów, serwis specjalistyczny i producenci sprzętu. Zdanie wpisuję tylko wtedy, gdy potwierdzają je ≥ 2 niezależne przeczytane źródła dla tego ćwiczenia (albo dla tego samego ruchu z tym samym sprzętem). Zdania z obecnych zestawów ogólnych (`rot.*`, `rear.*`, `mis.jerk`) zostawiam tylko tam, gdzie źródła je potwierdzają; pozostałe opisuję w „Otwarte”.
- Pozycja z rysunku (sprawdzone w `lib/figures/v2/poses/rotator_cuff.json` i `docs/50-figury-v2.md` pkt „Pozy”): External Rotation (hantel) — leżenie na lewym boku na podłodze (`pochylenieTulowia` −90, sprzęt `podloga` + `hantel`; w katalogu uwaga „Side-lying with one light dumbbell”); rotacje z gumą i wyciągiem — w staniu (`pochylenieTulowia` 0, guma na zaczepie około wysokości pasa / wyciąg); Band Pull Apart — w staniu; Reverse Flyes With External Rotation — klatka na skośnej ławce (`pochylenieTulowia` −45); Cuban Press — brak rysunku. Wskazówki niżej odpowiadają tym pozycjom.

## Ćwiczenia

| Ćwiczenie | Stan | Uwaga |
|---|---|---|
| Band Pull Apart | gotowe | 2 źródła (szpital, producent sprzętu). Obecne `rear.elbows`, `rear.arms`, `mis.jerk` zastąpione — nie potwierdzone dla tego ćwiczenia (Otwarte). |
| External Rotation with Band | gotowe | 4 źródła (AAOS, HSS, materiał szpitalny, uczelnia). |
| External Rotation (hantel) | gotowe | Wersja w leżeniu na boku, 3–4 źródła. Zdanie o głowie na dolnej ręce — sprawdzić z rysunkiem (Stan, pułapki). |
| External Rotation (linki) | gotowe | 2 źródła wprost z wyciągiem (ACE, uczelnia). |
| Internal Rotation with Band | gotowe | 4 źródła. |
| Cable Internal Rotation | gotowe | 2 źródła wprost z wyciągiem (ACE, uczelnia). |
| Reverse Flyes With External Rotation | otwarte | Żadne przeczytane źródło nie opisuje fazy obrotu; obecne `rear.elbows` może przeczyć ruchowi (Otwarte). |
| Cuban Press | gotowe | 3 źródła (serwis specjalistyczny, producent sprzętu, magazyn treningowy). Rodzina nie ma rysunku tego ćwiczenia (cue-sets `"b":"open"`). |

## Dane do `exercises` w `data/zrodla/cues.json`

```json
{
  "Band Pull Apart": {
    "setup": [
      {"c": "rotator_cuff.pullSetup", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, kroki 1–2"], ["gymreapers-band-pull-aparts", "How to do: setup"]]}
    ],
    "move": [
      {"c": "rotator_cuff.pullMove", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, krok 3"], ["gymreapers-band-pull-aparts", "How to do: movement"]]}
    ],
    "tips": [
      {"c": "rot.slow", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, krok 4"], ["gymreapers-band-pull-aparts", "How to do: return"]]}
    ],
    "mistakes": [
      {"c": "rotator_cuff.mis.shrug", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, krok 3"], ["gymreapers-band-pull-aparts", "Common mistakes: shrugging"]]}
    ]
  },
  "External Rotation with Band": {
    "setup": [
      {"c": "rotator_cuff.bandSetup", "s": [["hss-sutton-shoulder-program", "s. 1, External Rotation"], ["healthwise-columbia-shoulder-er", "instrukcja, akapity 1–2"], ["sussex-rotations", "External Rotations"]]},
      {"c": "rotator_cuff.erStart", "s": [["healthwise-columbia-shoulder-er", "instrukcja: elbow 90°, forearm across the belly"], ["sussex-rotations", "External Rotations"], ["hss-sutton-shoulder-program", "s. 1, External Rotation (hand close to chest)"]]}
    ],
    "move": [
      {"c": "rotator_cuff.erMove", "s": [["hss-sutton-shoulder-program", "s. 1, External Rotation"], ["healthwise-columbia-shoulder-er", "instrukcja: rotate the forearm outward"], ["aaos-rotator-cuff-program", "ćw. 9 External Rotation"], ["sussex-rotations", "External Rotations"]]}
    ],
    "tips": [
      {"c": "rot.elbow", "s": [["aaos-rotator-cuff-program", "ćw. 9 External Rotation"], ["healthwise-columbia-shoulder-er", "instrukcja: keep elbow and upper arm tucked"], ["hss-sutton-shoulder-program", "s. 1 (hinge on a gate)"]]},
      {"c": "rot.slow", "s": [["aaos-rotator-cuff-program", "ćw. 9 External Rotation"], ["healthwise-columbia-shoulder-er", "instrukcja: slowly bring the arm back"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["aaos-rotator-cuff-program", "ćw. 9 (keeping your elbow close to your side)"], ["sussex-rotations", "External Rotations (elbow close to the torso)"], ["healthwise-columbia-shoulder-er", "instrukcja: elbow and upper arm tucked in"]]}
    ]
  },
  "External Rotation (hantel)": {
    "setup": [
      {"c": "rotator_cuff.sideSetup", "s": [["aaos-rotator-cuff-program", "ćw. 17 External Rotation (side-lying)"], ["hss-sutton-shoulder-program", "s. 2, Sidelying external rotation"], ["nhs-southtees-side-lying", "instrukcja, krok 1"]]}
    ],
    "move": [
      {"c": "rotator_cuff.sideMove", "s": [["aaos-rotator-cuff-program", "ćw. 17"], ["hss-sutton-shoulder-program", "s. 2, Sidelying external rotation"], ["nhs-southtees-side-lying", "instrukcja, krok 2"], ["wiley-dummies-rotation", "home version, external rotation"]]}
    ],
    "tips": [
      {"c": "rotator_cuff.sideHead", "s": [["aaos-rotator-cuff-program", "ćw. 17 (unaffected arm under you, cradling your head)"], ["wiley-dummies-rotation", "home version, setup (rest your head in your left hand)"]]},
      {"c": "rot.slow", "s": [["aaos-rotator-cuff-program", "ćw. 17 (slowly lower the weight)"], ["hss-sutton-shoulder-program", "s. 2 (slowly lower the hand)"], ["nhs-southtees-side-lying", "instrukcja, krok 3"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["aaos-rotator-cuff-program", "ćw. 17 (keep your elbow against your side)"], ["hss-sutton-shoulder-program", "s. 2 (keep the arm firmly against your side)"], ["nhs-southtees-side-lying", "instrukcja, krok 2 (maintain contact with the towel)"]]}
    ]
  },
  "External Rotation (linki)": {
    "setup": [
      {"c": "rotator_cuff.cableSetup", "s": [["ace-352", "instrukcja, zdanie 1"], ["sussex-rotations", "External Rotations"]]},
      {"c": "rotator_cuff.erStart", "s": [["ace-352", "instrukcja (left hand, right side closest; cable in front of the stomach)"], ["sussex-rotations", "External Rotations (hand furthest away, forearm across the stomach)"]]}
    ],
    "move": [
      {"c": "rotator_cuff.erMove", "s": [["ace-352", "instrukcja (move the left hand to the outside of the body)"], ["sussex-rotations", "External Rotations"]]}
    ],
    "tips": [
      {"c": "rot.elbow", "s": [["ace-352", "instrukcja (elbow tucked in to the body)"], ["sussex-rotations", "External Rotations"]]},
      {"c": "rot.slow", "s": [["ace-352", "instrukcja (slowly lowering the weight)"], ["aaos-rotator-cuff-program", "ćw. 9 (ten sam ruch z gumą)"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["ace-352", "instrukcja (keep the left elbow tucked in)"], ["sussex-rotations", "External Rotations (elbow close to the torso)"]]}
    ]
  },
  "Internal Rotation with Band": {
    "setup": [
      {"c": "rotator_cuff.bandSetup", "s": [["hss-sutton-shoulder-program", "s. 1, Internal Rotation"], ["healthwise-columbia-shoulder-ir", "instrukcja, akapity 1–2"], ["sussex-rotations", "Internal Rotations"]]},
      {"c": "rotator_cuff.irStart", "s": [["healthwise-columbia-shoulder-ir", "instrukcja (affected side toward the door; elbow 90°)"], ["hss-sutton-shoulder-program", "s. 1, Internal Rotation (elbow flexed at 90 degrees)"], ["sussex-rotations", "Internal Rotations"]]}
    ],
    "move": [
      {"c": "rotator_cuff.irMove", "s": [["hss-sutton-shoulder-program", "s. 1 (move the hand toward the belly)"], ["healthwise-columbia-shoulder-ir", "instrukcja (until it touches your belly)"], ["aaos-rotator-cuff-program", "ćw. 8 Internal Rotation"], ["sussex-rotations", "Internal Rotations"]]}
    ],
    "tips": [
      {"c": "rot.elbow", "s": [["aaos-rotator-cuff-program", "ćw. 8 (keep your elbow pressed into your side)"], ["healthwise-columbia-shoulder-ir", "instrukcja"], ["sussex-rotations", "Internal Rotations (elbow must remain fixed to the side)"]]},
      {"c": "rot.slow", "s": [["aaos-rotator-cuff-program", "ćw. 8"], ["healthwise-columbia-shoulder-ir", "instrukcja (slowly move it back)"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["aaos-rotator-cuff-program", "ćw. 8 (keep your elbow pressed into your side)"], ["sussex-rotations", "Internal Rotations (elbow must remain fixed to the side)"]]}
    ]
  },
  "Cable Internal Rotation": {
    "setup": [
      {"c": "rotator_cuff.cableSetup", "s": [["ace-351", "instrukcja, zdanie 1"], ["sussex-rotations", "Internal Rotations"]]},
      {"c": "rotator_cuff.irStart", "s": [["ace-351", "instrukcja (right hand, right side closest; elbow tucked)"], ["sussex-rotations", "Internal Rotations (elbow close to the side)"]]}
    ],
    "move": [
      {"c": "rotator_cuff.irMove", "s": [["ace-351", "instrukcja (bring the right hand to the front of stomach)"], ["sussex-rotations", "Internal Rotations (forearm across the stomach)"]]}
    ],
    "tips": [
      {"c": "rot.elbow", "s": [["ace-351", "instrukcja"], ["sussex-rotations", "Internal Rotations"]]},
      {"c": "rot.slow", "s": [["ace-351", "instrukcja (slowly lowering the weight)"], ["aaos-rotator-cuff-program", "ćw. 8 (ten sam ruch z gumą)"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["ace-351", "instrukcja (still keeping elbow close to the body)"], ["sussex-rotations", "Internal Rotations (elbow must remain fixed to the side)"]]}
    ]
  },
  "Cuban Press": {
    "setup": [
      {"c": "rotator_cuff.cubanSetup", "s": [["coach-cuban-press", "How to: setup i krok 1"], ["sole-cuban-press", "setup (home base)"], ["barbend-cuban-press", "Step 1; Common mistakes: heavy weights"]]}
    ],
    "move": [
      {"c": "rotator_cuff.cubanRow", "s": [["coach-cuban-press", "krok 2"], ["sole-cuban-press", "upright row"], ["barbend-cuban-press", "Step 1; tip: lead with your elbows"]]},
      {"c": "rotator_cuff.cubanRotate", "s": [["coach-cuban-press", "krok 3"], ["sole-cuban-press", "rotation"], ["barbend-cuban-press", "Step 2"]]},
      {"c": "rotator_cuff.cubanPress", "s": [["coach-cuban-press", "kroki 4–5"], ["sole-cuban-press", "press; return"], ["barbend-cuban-press", "Step 3"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "rotator_cuff.mis.cubanHeavy", "s": [["barbend-cuban-press", "Common mistakes: heavy weights"], ["sole-cuban-press", "Common mistakes"], ["coach-cuban-press", "wariant four-point press (keep the dumbbells light)"]]},
      {"c": "rotator_cuff.mis.elbowsDrop", "s": [["sole-cuban-press", "rotation; Common mistakes"], ["coach-cuban-press", "krok 3 (keeping your upper arms horizontal)"]]}
    ]
  }
}
```

Uwaga do danych: przy rotacjach z wyciągiem `rot.slow` ma jedno źródło wprost z wyciągiem (ACE); drugie to ten sam ruch z gumą (AAOS) — analogia sprzętu, oznaczyć „uproszczenie”, jeśli koordynator liczy sprzęt osobno. Ćwiczenie i tak jest „gotowe” (setup + move mają 2 źródła z wyciągiem).

## Nowe zdania

| id | PL | EN | uwaga |
|---|---|---|---|
| rotator_cuff.bandSetup | Zaczep gumę na wysokości pasa i stań do niej bokiem. | Anchor the band at waist height and stand side-on to it. | guma ER/IR |
| rotator_cuff.cableSetup | Ustaw wyciąg z jednym uchwytem na wysokości pasa i stań do niego bokiem. | Set a single handle on the cable at waist height and stand side-on to it. | wyciąg ER/IR |
| rotator_cuff.erStart | Chwyć dalszą ręką; łokieć zgięty pod kątem prostym przy boku, przedramię przed brzuchem. | Hold it in the far hand, elbow bent at a right angle at your side, forearm across your stomach. | kąt prosty: Healthwise, HSS, AAOS (90°) |
| rotator_cuff.erMove | Obracaj ramię na zewnątrz, odsuwając dłoń od brzucha, tak daleko, jak wygodnie. | Rotate your arm out, moving your hand away from your stomach as far as is comfortable. | „wygodnie” — HSS; Healthwise: „do uczucia napięcia” |
| rotator_cuff.irStart | Chwyć bliższą ręką; łokieć zgięty pod kątem prostym przy boku. | Hold it in the near hand, elbow bent at a right angle at your side. | kierunek przedramienia na starcie pominięty — źródła różne (Otwarte) |
| rotator_cuff.irMove | Obracaj ramię do środka, prowadząc dłoń do brzucha. | Rotate your arm in, bringing your hand to your stomach. | |
| rotator_cuff.sideSetup | Połóż się na boku; górny łokieć zgięty pod kątem prostym przy boku, hantel przed brzuchem. | Lie on your side, top elbow bent at a right angle against your side, dumbbell in front of your stomach. | pozycja rysunku: lewy bok, podłoga |
| rotator_cuff.sideMove | Unoś hantel w górę, obracając ramię — łokieć zostaje przy boku. | Raise the dumbbell by rotating your arm, keeping your elbow against your side. | |
| rotator_cuff.sideHead | Dolną rękę podłóż pod głowę. | Rest your head on your bottom arm. | sprawdzić z rysunkiem |
| rotator_cuff.pullSetup | Trzymaj gumę przed sobą na wysokości klatki, dłonie mniej więcej na szerokość barków, łokcie lekko ugięte. | Hold the band in front of you at chest height, hands about shoulder-width apart, elbows slightly bent. | |
| rotator_cuff.pullMove | Rozciągnij gumę na boki, ściągając łopatki; dłonie zostają na wysokości klatki. | Pull the band apart, squeezing your shoulder blades together; keep your hands at chest height. | |
| rotator_cuff.mis.shrug | Unoszenie barków do uszu. | Shrugging your shoulders up to your ears. | |
| rotator_cuff.cubanSetup | Stań prosto, w dłoniach lekkie hantle. | Stand tall holding light dumbbells. | |
| rotator_cuff.cubanRow | Unieś łokcie bokiem do wysokości barków; łokcie zgięte pod kątem prostym, hantle zwisają w dół. | Lift your elbows out to shoulder height, bent at a right angle, dumbbells hanging down. | |
| rotator_cuff.cubanRotate | Obróć przedramiona w górę, nie opuszczając łokci — ramiona zostają poziomo. | Rotate your forearms up without dropping your elbows; upper arms stay level. | |
| rotator_cuff.cubanPress | Wyciśnij hantle nad głowę i wróć tą samą drogą. | Press the dumbbells overhead, then reverse the same path. | |
| rotator_cuff.mis.cubanHeavy | Za ciężkie hantle. | Going too heavy. | bez liczb (źródła podają różne kg/lb) |
| rotator_cuff.mis.elbowsDrop | Łokcie opadają przy obrocie. | Elbows dropping during the rotation. | |

Zdania istniejące użyte: `rot.elbow`, `rot.slow`, `rot.mis.elbowAway`.

## Nowe źródła

```json
{
  "aaos-rotator-cuff-program": {"org": "AAOS (OrthoInfo)", "title": "Rotator Cuff and Shoulder Conditioning Program", "url": "https://www.orthoinfo.org/en/recovery/rotator-cuff-and-shoulder-conditioning-program/", "level": 4},
  "hss-sutton-shoulder-program": {"org": "HSS (Hospital for Special Surgery)", "title": "Shoulder Rotator Cuff and Scapular Strengthening Program", "url": "https://hss.edu/sutton/shoulder-strengthening-program.pdf", "level": 4},
  "healthwise-columbia-shoulder-er": {"org": "Healthwise / WebMD Ignite (ColumbiaDoctors)", "title": "Shoulder external rotation (resisted)", "url": "https://www.columbiadoctors.org/health-library/multimedia/shoulder-external-rotation-resisted/", "level": 4},
  "healthwise-columbia-shoulder-ir": {"org": "Healthwise / WebMD Ignite (ColumbiaDoctors)", "title": "Shoulder internal rotation (resisted)", "url": "https://www.columbiadoctors.org/health-library/multimedia/shoulder-internal-rotation-resisted/", "level": 4},
  "healthwise-kaiser-band-exercises": {"org": "Healthwise / WebMD Ignite (Kaiser Permanente)", "title": "Resistance Training With Exercise Bands: Exercises", "url": "https://healthy.kaiserpermanente.org/health-wellness/health-encyclopedia/he.resistance-training-with-exercise-bands-exercises.bz1003", "level": 4},
  "sussex-rotations": {"org": "University of Sussex (Sussex Sport)", "title": "Internal / External Rotations", "url": "https://www.sussex.ac.uk/sport/documents/internal-external-rotations.pdf", "level": 4},
  "nhs-southtees-side-lying": {"org": "South Tees Hospitals NHS Foundation Trust", "title": "Rotator cuff in side lying", "url": "https://www.southtees.nhs.uk/resources/rotator-cuff-in-side-lying/", "level": 4},
  "ace-352": {"org": "ACE", "title": "Rotator Cuff External Rotation (#352)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/352/rotator-cuff-external-rotation/", "level": 4},
  "ace-351": {"org": "ACE", "title": "Rotator Cuff Internal Rotation (#351)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/351/rotator-cuff-internal-rotation/", "level": 4},
  "wiley-dummies-rotation": {"org": "Wiley (For Dummies)", "title": "How to Perform External and Internal Rotation Exercises", "url": "https://www.dummies.com/article/body-mind-spirit/physical-health-well-being/exercise-movement/strength-training/how-to-perform-external-and-internal-rotation-exercises-198449/", "level": 4},
  "gymreapers-band-pull-aparts": {"org": "Gym Reapers (producent sprzętu)", "title": "How to Do Resistance Band Pull Aparts", "url": "https://www.gymreapers.com/blogs/news/how-to-do-resistance-band-pull-aparts", "level": 4},
  "barbend-cuban-press": {"org": "BarBend", "title": "Cuban Press", "url": "https://barbend.com/cuban-press", "level": 4},
  "sole-cuban-press": {"org": "Sole Fitness (producent sprzętu)", "title": "Cuban Press With Dumbbells", "url": "https://www.soletreadmills.com/blogs/news/cuban-press-with-dumbbells-benefits-muscles-worked-alternatives", "level": 4},
  "coach-cuban-press": {"org": "Coach (magazyn treningowy)", "title": "How To Do The Cuban Press", "url": "https://coachweb.com/exercises/shoulder-exercises/208/cuban-press", "level": 4}
}
```

| id | organizacja | szczebel | co potwierdza |
|---|---|---|---|
| aaos-rotator-cuff-program | AAOS (towarzystwo ortopedów) | 4 | ćw. 8–9: rotacje z gumą, łokieć przy boku, powolny powrót; ćw. 17: rotacja w leżeniu na boku, głowa na dolnej ręce, łokieć 90° przy boku |
| hss-sutton-shoulder-program | HSS (szpital ortopedyczny) | 4 | s. 1: guma na wysokości pasa, stanie bokiem, łokieć przy boku, ruch dłoni od brzucha / do brzucha; s. 2: leżenie na boku, dłoń na brzuchu, unoszenie ku sufitowi, powolne opuszczanie |
| healthwise-columbia-shoulder-er / -ir | Healthwise / WebMD Ignite | 4 | guma na wysokości pasa, bokiem do zaczepu, łokieć 90° przy boku, start/koniec przy brzuchu, powolny powrót |
| healthwise-kaiser-band-exercises | Healthwise / WebMD Ignite | 4 | rozciąganie gumy na wysokości klatki: chwyt na szerokość barków, łopatki razem, bez unoszenia barków, powolny powrót. Ta sama organizacja co wpisy Columbia — nie liczyć ich razem dla jednego zdania (tu nie są). |
| sussex-rotations | University of Sussex | 4 | rotacje z wyciągiem lub gumą: wysokość pępka, stanie bokiem, dalsza/bliższa ręka, łokieć nieruchomo przy boku |
| nhs-southtees-side-lying | NHS (South Tees) | 4 | leżenie na boku, unoszenie przedramienia ku sufitowi, łokieć pod kątem prostym, powolny powrót |
| ace-352 / ace-351 | ACE | 4 | wyciąg na wysokości pasa, jeden uchwyt, bokiem; łokieć przy tułowiu; ruch dłoni na zewnątrz / przed brzuch; powolny powrót |
| wiley-dummies-rotation | Wiley (For Dummies) | 4 | leżenie na boku: głowa na dolnej ręce, łokieć przy boku, unoszenie hantla; strona bez podpisanego autora — tylko jako drugie źródło |
| gymreapers-band-pull-aparts | producent sprzętu | 4 | rozciąganie gumy: chwyt nieco szerzej niż barki, łokcie lekko ugięte, łopatki razem, bez unoszenia barków, powolny powrót |
| barbend-cuban-press | serwis specjalistyczny | 4 | lekkie hantle, łokcie 90°, obrót do pozycji „bramki”, wyciskanie nad głowę; błędy: za ciężko, za szybko |
| sole-cuban-press | producent sprzętu | 4 | etapy: wiosłowanie do wysokości barków, obrót bez opuszczania łokci, wyciskanie, powrót odwrotnie; błędy: za ciężko, opadające łokcie, unoszenie barków |
| coach-cuban-press | magazyn treningowy | 4 | lekkie hantle, łokcie 90° i ramiona poziomo, obrót, wyciskanie, powrót odwrotnie |

## Otwarte

- **Reverse Flyes With External Rotation — całe ćwiczenie.** Faza obrotu na zewnątrz (kiedy i jak obraca się przedramię, kąt w łokciu) nie jest opisana w żadnym przeczytanym źródle szczebla ≤ 4; jedyne strony z tą nazwą to bazy ćwiczeń aplikacji (wykluczone). Część „odwrotne rozpiętki na skośnej ławce” potwierdza `ace-34` (ławka 45–60°, ramiona w bok do wysokości barków), ale bez obrotu to inne ćwiczenie. Obecne `rear.elbows` („Kąt w łokciach stały przez cały ruch”) może przeczyć fazie obrotu (jeśli łokieć zgina się do 90°) — do usunięcia z zestawu albo do potwierdzenia; `mis.jerk` bez źródła dla tego ćwiczenia. Do sprawdzenia też rysunek (czy faza obrotu w ogóle jest pokazana).
- **Band Pull Apart — zestaw obecny.** `rear.elbows` (stały kąt w łokciach) i `rear.arms` („ramiona w bok, nie w tył… dłonie na linii barków”) nie są potwierdzone dla tego ćwiczenia (Kaiser: tylko „bend your elbows”; producent: „arms mostly straight, slight bend”); `mis.jerk` — jedno źródło (producent sprzętu: „Excessive momentum”). Proponuję zastąpić zestaw danymi wyżej.
- **Ręcznik między łokciem a bokiem** (rotacje) — jedno źródło na wersję: Healthwise (stojąc, „for comfort”), NHS South Tees (w leżeniu); AAOS wprost go nie podaje. Nie do danych.
- **„Nie odchylaj tułowia do tyłu przy unoszeniu” (rotacja w leżeniu)** — jedno źródło (AAOS ćw. 17: „Do not let your body roll back as you raise the weight”). Nie do danych do czasu drugiego źródła.
- **Kierunek przedramienia na starcie rotacji do środka** — źródła różne: Sussex „forearm pointing towards the cable column”, Healthwise „arm pointing straight ahead”. W `irStart` tylko część wspólna (bliższa ręka, łokieć 90° przy boku).
- **Cuban Press: „bez szarpania / bez rzucania rąk w tył”** (`mis.jerk`) — jedno źródło (BarBend). **Unoszenie barków** — wprost tylko Sole. Nie do danych.
- **Liczby** (serie, powtórzenia, tempo, ciężar w kg/lb, czas zatrzymania 1–2 s) — w źródłach są, ale różne i z materiałów rehabilitacyjnych; nie przenoszę (pełne zasady dla liczb).
- **Ból / zakres przy dolegliwościach** — źródła rehabilitacyjne piszą o ograniczaniu zakresu przy bólu (HSS: „to where the endpoint of pain limits you”; Kaiser: „Ease off the exercise if you start to have pain”). To treść zdrowotna z kontekstu rehabilitacji; nie dodaję zdania bez decyzji o ogólnym zdaniu ostrożności dla rodziny.

## Stan

- Zrobione: Band Pull Apart, External Rotation with Band, External Rotation (hantel), External Rotation (linki), Internal Rotation with Band, Cable Internal Rotation, Cuban Press (gotowe); Reverse Flyes With External Rotation (otwarte).
- Zostało: Reverse Flyes With External Rotation — szukać opisu fazy obrotu w źródle szczebla 3–4 (np. podręcznik NSCA/ACSM, materiały fizjoterapeutów) i sprawdzić, co pokazuje rysunek.
- Następny krok (koordynator): wkleić dane do `data/zrodla/cues.json`, zdania do `lib/cues/text/*.json`, zmienić zestawy w `lib/figures/v2/cue-sets.json` (Band Pull Apart: usunąć `rear.*` i `mis.jerk`; Cuban Press: z `open` na nowy zestaw — ale bez rysunku); rejestr twierdzeń (`claims.mjs --stub`).
- Pułapki:
  - Rysunek External Rotation (hantel) leży na lewym boku na podłodze — przed użyciem `rotator_cuff.sideHead` sprawdzić, czy dolna ręka jest pod głową (`bokDolnaReka` w `agent-pozy/mob.mjs`); jeśli nie — pominąć to zdanie albo poprawić pozę.
  - `healthwise-columbia-*` i `healthwise-kaiser-*` to ta sama organizacja (WebMD Ignite) — nie liczyć ich jako dwóch niezależnych źródeł jednego zdania.
  - PDF-y (HSS, Sussex) WebFetch nie odczytuje — trzeba je otworzyć narzędziem Read z zapisanego pliku.
  - ExRx (403) i archiwum stron niedostępne; strony baz ćwiczeń aplikacji pominięte (zasada koordynatora).
