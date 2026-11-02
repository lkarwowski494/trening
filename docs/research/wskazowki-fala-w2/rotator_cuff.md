# Wskazówki techniki — rodzina `rotator_cuff` (fala W2, G2)

- Data: 02.11.2026
- Autor: badacz-merytoryczny
- Wejście: plik W1 rodziny, przeliczenie W1 z 02.11.2026 (ma pierwszeństwo), rozstrzygnięcie szczebli z uzupełnieniami 1–3.
- Metoda: strony czytane przez WebFetch; PDF-y (Mass General, Cook Children's) zapisane przez narzędzie i odczytane w całości jako dokument.
  Ustawienie i ruch: 2 niezależne źródła szczebla ≤ 4 albo jedno szczebla 3. Błędy: 2 źródła, reguła „błąd = zaprzeczenie standardu” albo
  wniosek z potwierdzonego zdania tego ćwiczenia. Pozycje figur sprawdzone w `scripts/figures/agent-pozy/rotator_cuff.mjs` (Band Pull Apart: ręce
  prawie proste, zgięcie 14°; Reverse Flyes With External Rotation: leżenie przodem na ławce skośnej 45°, łokieć stały lekko zgięty, obrót
  przedramienia narasta w górę ruchu; Cuban Press: bez rysunku, `WYJATKI`).

## 1. Tabela ćwiczeń

| Ćwiczenie | Stan po W1 (przeliczenie) | Stan po W2 | Błędy (źródła / wnioskowane) | W bloku |
|---|---|---|---|---|
| Band Pull Apart | otwarte | gotowe | 1 / 1 | pełna karta |
| External Rotation (linki) | otwarte | gotowe | 1 / 1 | pełna karta |
| Cable Internal Rotation | otwarte | gotowe (uproszczenie: wariant sprzętu) | 0 / 2 | pełna karta |
| Cuban Press | otwarte | gotowe warunkowo — zależy od szczebla Fitness Volt (pkt 5, uwaga 1); bez niego „jedno źródło” | 0 / 1 | pełna karta |
| Reverse Flyes With External Rotation | otwarte | otwarte (faza obrotu: jedno źródło szczebla 4) | — | brak (kandydaci w Otwarte) |
| External Rotation (hantel) | gotowe | gotowe | 1 / 1 | tylko `mistakes` |
| External Rotation with Band | gotowe | gotowe | 1 / 1 | tylko `mistakes` |
| Internal Rotation with Band | gotowe | gotowe | 0 / 2 | tylko `mistakes` |

## 2. Blok do wdrożenia

### Blok do wdrożenia

```json
{
  "Band Pull Apart": {
    "setup": [
      {"c": "rotator_cuff.pullHold", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, kroki 1–2"], ["w2g2-rc-catalyst-pullapart", "opis, zdanie 1"]]}
    ],
    "move": [
      {"c": "rotator_cuff.pullMove", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, krok 3"], ["w2g2-rc-catalyst-pullapart", "opis, zdanie 2 (arms remaining horizontal)"], ["w2g2-rc-throwers10", "Appendix A, Standing horizontal abduction with neutral"]]}
    ],
    "tips": [
      {"c": "rot.slow", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, krok 4"], ["w2g2-rc-throwers10", "Appendix A (then slowly move your arms in)"]]}
    ],
    "mistakes": [
      {"c": "rotator_cuff.mis.shrug", "s": [["healthwise-kaiser-band-exercises", "Chest-level pull, krok 3 (do not pull your shoulders up toward your ears)"], ["w2g2-rc-catalyst-pullapart", "opis, zdanie 2 (keeping them down) — błąd = zaprzeczenie standardu"]]},
      {"c": "rotator_cuff.mis.handsDrop", "s": [["wniosek", "rotator_cuff.pullMove"]]}
    ]
  },
  "External Rotation (linki)": {
    "setup": [
      {"c": "rotator_cuff.cableSetup", "s": [["ace-352", "instrukcja, zdania 1–2"], ["w2g2-rc-fv-cable-er", "Setup (single handle, approximately elbow height)"], ["hss-sutton-shoulder-program", "s. 1, External Rotation — uproszczenie: wariant sprzętu External Rotation with Band"], ["healthwise-columbia-shoulder-er", "instrukcja, akapity 1–2 — uproszczenie: wariant sprzętu External Rotation with Band"]]},
      {"c": "rotator_cuff.erStart", "s": [["ace-352", "instrukcja (left hand, right side closest; cable in front of the stomach)"], ["w2g2-rc-fv-cable-er", "Setup (working arm farther from the stack; about 90 degrees; upper arm close to your side)"]]}
    ],
    "move": [
      {"c": "rotator_cuff.erMove", "s": [["ace-352", "instrukcja (move the left hand to the outside of the body)"], ["w2g2-rc-fv-cable-er", "Movement (move the forearm away from the cable)"], ["aaos-rotator-cuff-program", "ćw. 9 — uproszczenie: wariant sprzętu External Rotation with Band"]]}
    ],
    "tips": [
      {"c": "rot.elbow", "s": [["ace-352", "instrukcja (elbow tucked in to the body)"], ["w2g2-rc-fv-cable-er", "Setup; Movement (elbow stays near the same spot)"]]},
      {"c": "rot.slow", "s": [["ace-352", "instrukcja (slowly lowering the weight)"], ["w2g2-rc-fv-cable-er", "Return (under control)"], ["aaos-rotator-cuff-program", "ćw. 9 — uproszczenie: wariant sprzętu"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["w2g2-rc-fv-cable-er", "Common mistakes: Pulling the elbow away from the ribs"], ["ace-352", "instrukcja (keep the left elbow tucked in) — błąd = zaprzeczenie standardu"]]},
      {"c": "rotator_cuff.mis.elbowOpens", "s": [["wniosek", "rotator_cuff.erStart"]]}
    ]
  },
  "Cable Internal Rotation": {
    "setup": [
      {"c": "rotator_cuff.cableSetup", "s": [["ace-351", "instrukcja, zdania 1–2"], ["hss-sutton-shoulder-program", "s. 1, Internal Rotation — uproszczenie: wariant sprzętu Internal Rotation with Band"], ["healthwise-columbia-shoulder-ir", "instrukcja, akapity 1–2 — uproszczenie: wariant sprzętu Internal Rotation with Band"]]},
      {"c": "rotator_cuff.irStart", "s": [["ace-351", "instrukcja (right hand, right side closest; elbow tucked)"], ["hss-sutton-shoulder-program", "s. 1, Internal Rotation (elbow flexed at 90 degrees) — uproszczenie: wariant sprzętu"], ["healthwise-columbia-shoulder-ir", "instrukcja (elbow 90°) — uproszczenie: wariant sprzętu"]]}
    ],
    "move": [
      {"c": "rotator_cuff.irMove", "s": [["ace-351", "instrukcja (bring the right hand to the front of stomach)"], ["hss-sutton-shoulder-program", "s. 1 (move the hand toward the belly) — uproszczenie: wariant sprzętu"], ["aaos-rotator-cuff-program", "ćw. 8 — uproszczenie: wariant sprzętu"]]}
    ],
    "tips": [
      {"c": "rot.elbow", "s": [["ace-351", "instrukcja (elbow tucked in; still keeping elbow close to the body)"], ["aaos-rotator-cuff-program", "ćw. 8 (keep your elbow pressed into your side) — uproszczenie: wariant sprzętu"]]},
      {"c": "rot.slow", "s": [["ace-351", "instrukcja (slowly lowering the weight)"], ["aaos-rotator-cuff-program", "ćw. 8 — uproszczenie: wariant sprzętu"]]}
    ],
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["wniosek", "rotator_cuff.irStart"]]},
      {"c": "rotator_cuff.mis.elbowOpens", "s": [["wniosek", "rotator_cuff.irStart"]]}
    ]
  },
  "Cuban Press": {
    "setup": [
      {"c": "rotator_cuff.cubanStand", "s": [["w2g2-rc-barbend-cuban", "How to, Step 1 (Grab light dumbbells in both hands)"], ["w2g2-rc-fv-cuban", "Setup (Stand with your feet about hip-width apart) — uproszczenie: wariant sprzętu (sztanga)"]]},
      {"c": "rotator_cuff.cubanBlades", "s": [["w2g2-rc-barbend-cuban", "Step 1, Coach's Tip; Common mistakes: Not Setting Your Scapula"], ["w2g2-rc-fv-cuban", "Setup (shoulders pulled down and back)"]]}
    ],
    "move": [
      {"c": "rotator_cuff.cubanRow", "s": [["w2g2-rc-barbend-cuban", "Step 1 (elbows up to a 90-degree angle, parallel to the floor)"], ["w2g2-rc-fv-cuban", "Step 2 (upper arms roughly parallel to the floor, elbows bent to 90-degrees) — uproszczenie: wariant sprzętu"]]},
      {"c": "rotator_cuff.cubanRotate", "s": [["w2g2-rc-barbend-cuban", "Step 2 (goalpost position)"], ["w2g2-rc-fv-cuban", "Step 3 (Without lowering your upper arms, externally rotate) — uproszczenie: wariant sprzętu"]]},
      {"c": "rotator_cuff.cubanPressUp", "s": [["w2g2-rc-barbend-cuban", "Step 3 (Press your arms overhead; Coach's Tip: press up straight)"], ["w2g2-rc-fv-cuban", "Step 4 (Press the bar up to arms' length) — uproszczenie: wariant sprzętu"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "rotator_cuff.mis.elbowsDrop", "s": [["wniosek", "rotator_cuff.cubanRotate"]]}
    ]
  },
  "External Rotation (hantel)": {
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["aaos-rotator-cuff-program", "ćw. 17 (keep your elbow against your side)"], ["hss-sutton-shoulder-program", "s. 2 (keep the arm firmly against your side)"], ["nhs-southtees-side-lying", "instrukcja, krok 2"], ["w2g2-rc-cook-throwers", "s. 3, 5. Side-lying external rotation, krok 5 (Keep elbow pressed into your side)"]]},
      {"c": "rotator_cuff.mis.elbowOpens", "s": [["wniosek", "rotator_cuff.sideSetup"]]}
    ]
  },
  "External Rotation with Band": {
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["aaos-rotator-cuff-program", "ćw. 9 (keeping your elbow close to your side)"], ["healthwise-columbia-shoulder-er", "instrukcja: elbow and upper arm tucked in"], ["w2g2-rc-cook-throwers", "s. 1, 2A External rotation at 15 degrees abduction, krok 5 (Keep elbow pressed against your side)"]]},
      {"c": "rotator_cuff.mis.elbowOpens", "s": [["wniosek", "rotator_cuff.erStart"]]}
    ]
  },
  "Internal Rotation with Band": {
    "mistakes": [
      {"c": "rot.mis.elbowAway", "s": [["wniosek", "rotator_cuff.irStart"]]},
      {"c": "rotator_cuff.mis.elbowOpens", "s": [["wniosek", "rotator_cuff.irStart"]]}
    ]
  }
}
```

Uwagi do bloku:
- **Zmiana zestawów względem W1.** Band Pull Apart: `rotator_cuff.pullSetup` (W1) zastąpione przez `rotator_cuff.pullHold` — źródła są sprzeczne co do łokci
  (Kaiser: „bend your elbows”; Catalyst: „spread your straight arms”; Throwers 10: „Keeping your elbows straight”), a szerokość chwytu podaje tylko Kaiser;
  zostaje część wspólna. Cuban Press: `rotator_cuff.cubanSetup` → `cubanStand` (słowo „lekkie” ma jedno źródło), `rotator_cuff.cubanPress` → `cubanPressUp`
  (powrót „tą samą drogą” ma tylko Fitness Volt, wersja ze sztangą); `rotator_cuff.mis.cubanHeavy` usunięte (jedno źródło szczebla 4 — Otwarte).
- **Uproszczenie: wariant sprzętu (rotacje z wyciągiem).** External Rotation (linki) i Cable Internal Rotation biorą źródła wersji z gumą
  (External Rotation with Band, Internal Rotation with Band — gotowe w W1). Ruch się nie różni: w obu wersjach stoi się bokiem do punktu zaczepu na wysokości
  pasa, łokieć jest zgięty pod kątem prostym i przyciśnięty do boku, a ramię obraca się w barku, więc przedramię zatacza łuk w poziomie (od brzucha na zewnątrz
  albo do brzucha). Zmienia się tylko źródło oporu (linka z ciężarem zamiast gumy); kierunek siły jest ten sam — w poziomie, od strony zaczepu. Dla
  External Rotation (linki) uproszczenie jest tylko zapasem: ma dwa źródła wprost z wyciągiem (ACE, Fitness Volt), jeśli Fitness Volt liczy się jako 4.
- **Wysokość wyciągu:** ACE „waist-height”, Fitness Volt „approximately elbow height”. Przy łokciu przy boku zgiętym pod kątem prostym łokieć jest mniej więcej
  na wysokości pasa; zdanie `rotator_cuff.cableSetup` („na wysokości pasa”) traktuję jako część wspólną. Recenzent może woleć „na wysokości łokcia” — wtedy nowe zdanie.
- **Błąd `rot.mis.elbowAway` przy Internal Rotation with Band** (pytanie koordynatora): da się go dać jako wnioskowany z `rotator_cuff.irStart`
  („łokieć zgięty pod kątem prostym przy boku”), które zostaje po przeliczeniu (HSS + Healthwise). Łokieć odjeżdżający od tułowia to wprost zaprzeczenie
  „przy boku”, widoczne na rysunku. Alternatywnie reguła „błąd = zaprzeczenie standardu”: AAOS ćw. 8 („keep your elbow pressed into your side”) + Healthwise IR
  (oba w potwierdzonym `rot.elbow`). Cook Children's 2B („Keep your elbow against your side”) dotyczy wersji „at 45 degrees abduction” — nie liczę.
- **`rotator_cuff.mis.elbowOpens`** — wnioskowany z „łokieć zgięty pod kątem prostym” (`erStart`, `irStart`, `sideSetup`); prostowanie łokcia zmienia obrót
  w barku w ruch przedramienia i da się je narysować (kąt w łokciu ≠ 90°).
- **`rotator_cuff.mis.elbowsDrop` (Cuban Press)** — W1 miał Sole i Coach (oba szczebel 5); teraz wniosek z `cubanRotate` („nie opuszczając łokci — ramiona zostają
  poziomo”), a Fitness Volt (krok 3) podaje ten standard wprost.

## 3. Nowe zdania

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| rotator_cuff.pullHold | Chwyć gumę oburącz i trzymaj ręce przed sobą na wysokości klatki. | Hold the band in both hands with your arms out in front at chest height. | Kaiser kroki 1–2 („Raise your arms to chest level”), Catalyst („hold your arms horizontal in front of yourself”); część wspólna bez łokci i szerokości chwytu |
| rotator_cuff.mis.handsDrop | Ręce opadają poniżej klatki. | Letting your hands drop below chest height. | zaprzeczenie `rotator_cuff.pullMove` („dłonie zostają na wysokości klatki”); standard też: Kaiser krok 3, Catalyst „arms remaining horizontal” |
| rotator_cuff.mis.elbowOpens | Łokieć się prostuje. | Letting your elbow straighten. | zaprzeczenie „łokieć zgięty pod kątem prostym” (`erStart`, `irStart`, `sideSetup`) |
| rotator_cuff.cubanStand | Stań prosto z hantlami w dłoniach. | Stand tall with a dumbbell in each hand. | BarBend krok 1, Fitness Volt (ustawienie, sztanga — wariant sprzętu) |
| rotator_cuff.cubanBlades | Zanim zaczniesz, ściągnij łopatki do tyłu i w dół. | Before you start, set your shoulder blades back and down. | BarBend („move your shoulder blades back and down”), Fitness Volt („shoulders pulled down and back”) |
| rotator_cuff.cubanPressUp | Wyciśnij hantle prosto nad głowę. | Press the dumbbells straight overhead. | BarBend krok 3 („Simply press up straight”), Fitness Volt krok 4 |

Zdania istniejące użyte: `rotator_cuff.pullMove`, `rotator_cuff.mis.shrug`, `rotator_cuff.cableSetup`, `rotator_cuff.erStart`, `rotator_cuff.erMove`,
`rotator_cuff.irStart`, `rotator_cuff.irMove`, `rotator_cuff.cubanRow`, `rotator_cuff.cubanRotate`, `rotator_cuff.mis.elbowsDrop` (wszystkie z W1),
`rot.elbow`, `rot.slow`, `rot.mis.elbowAway`. Uwaga: `rot.mis.elbowAway` ma tekst w `lib/cues/text/pl.json:282`, a `WYJATKI_OPISU` w
`scripts/figures/agent-pozy/rotator_cuff.mjs:74` mówi, że tekstu brak — do sprawdzenia przez programistę (nieaktualny komentarz albo brak w `en.json`).

## 4. Źródła

| id | adres | organizacja | szczebel i uzasadnienie |
|---|---|---|---|
| w2g2-rc-catalyst-pullapart | https://www.catalystathletics.com/exercise/762/Band-Pull-Apart/ | Catalyst Athletics | 4 — biblioteka firmowana przez Catalyst Athletics, Inc. (rozstrzygnięcie szczebli, wiersz Catalyst); bez autora i daty przy haśle |
| w2g2-rc-throwers10 | https://pmc.ncbi.nlm.nih.gov/articles/PMC8637269/ | Mullaney i in., Int J Sports Phys Ther 2021;16(6) | 3 — recenzowany artykuł kliniczny z opisem wykonania (Appendix A); ten sam artykuł co S30 w rolach W1 |
| w2g2-rc-barbend-cuban | https://barbend.com/cuban-press/ | BarBend | 4 warunkowo — artykuł o technice z autorem (Caroline Lubinsky, CF-L1) i datą (aktualizacja 17.06.2024); bez „Expert Verified” (wiersz BarBend: „najlepiej”) |
| w2g2-rc-fv-cuban | https://fitnessvolt.com/cuban-press/ | Fitness Volt | 4 warunkowo / sporne — autor z kwalifikacjami w podpisie (Patrick Dale, PT; 30 lat treningu personalnego), data (27.08.2021, zm. 11.08.2024); brak nazwanego recenzenta (uwaga 1) |
| w2g2-rc-fv-cable-er | https://fitnessvolt.com/cable-external-shoulder-rotation/ | Fitness Volt | 4 warunkowo / sporne — autor „Dr. Malik”, MD (w biogramie), data (08.05.2018, zm. 12.07.2026); brak nazwanego recenzenta (uwaga 1) |
| w2g2-rc-cook-throwers | https://www.cookchildrens.org/SiteCollectionDocuments/Rehab/sports-throwers-ten.pdf | Cook Children's Medical Center (szpital) | 4 — firmowanie szpitala (uzupełnienie 2) |
| w2g2-rc-mgh-shoulder | https://www.massgeneralbrigham.org/content/dam/unified-xwalk/pdf/patient-education/english/mass-general-shoulder-twelve-strengthening-program.pdf | Massachusetts General Hospital, Sports Physical Therapy | 4 — szpital; ALE tekst rotacji („think of this elbow as being a hinge on a gate”) jest identyczny jak w `hss-sutton-shoulder-program` (ten sam tytuł dokumentu) → nie jest niezależny od HSS; w bloku nieużyty |
| w2g2-rc-msd-prone-er | https://www.msdmanuals.com/home/multimedia/video/prone-shoulder-horizontal-abduction-with-external-rotation | MSD Manuals (materiał szpitala Tomah Memorial, autorzy MSPT/DPT) | 4 — ale opisuje inne ćwiczenie (obrót przedramienia przy łokciu 90°), w bloku nieużyty |

Źródła z W1 użyte ponownie: `healthwise-kaiser-band-exercises` (strona Kaiser Permanente, „Current as of September 24, 2026”, recenzja kliniczna WebMD Ignite — 4),
`ace-351`, `ace-352`, `ace-34`, `aaos-rotator-cuff-program`, `hss-sutton-shoulder-program`, `healthwise-columbia-shoulder-er` / `-ir`, `nhs-southtees-side-lying`.
Niezależność: `healthwise-kaiser-*` i `healthwise-columbia-*` = jedna organizacja (nigdzie nie liczone razem dla jednego zdania); dwa artykuły Fitness Volt =
jedna organizacja (użyte przy różnych ćwiczeniach).

## 5. Otwarte i uwagi dla integratora

1. **[OTWARTE] Szczebel Fitness Volt.** Uzupełnienie 3 ma dwie formuły: wiersz tabeli „warunkowo 4 — autor z kwalifikacjami w podpisie i datą (najlepiej
   z nazwanym recenzentem)” oraz regułę ogólną „przy deklarowanej recenzji — nazwanego recenzenta”. Obie strony mają autora z kwalifikacjami i datę, nie mają
   recenzenta. Skutek: przy regule ogólnej Fitness Volt = 5 → **Cuban Press** ma tylko BarBend (jedno źródło szczebla 4 → „jedno źródło”, stan otwarte);
   **External Rotation (linki)** zostaje gotowe dzięki uproszczeniu (wariant sprzętu od gumy), a `rot.mis.elbowAway` przechodzi na wniosek z `erStart`.
   Rozstrzyga koordynator.
2. **[OTWARTE] Reverse Flyes With External Rotation — faza obrotu.** Ustawienie i odwodzenie potwierdza `ace-34` (Incline Reverse Fly: oparcie 45–60°, ręce
   zwisają, łokcie lekko ugięte, unoszenie bokiem do wysokości barków), ale ACE ma dłonie zwrócone do siebie — bez obrotu. Obrót na zewnątrz w odwodzeniu
   poziomym w leżeniu przodem opisuje tylko Cook Children's 6B („Thumb should be pointing out”, „Slowly raise straight arm slightly in front of shoulder”,
   „Thumb should be pointing up”) — jedno źródło szczebla 4, na stole, jedną ręką, prostą ręką. Inne szpitalne kopie programu Throwers Ten (Erlanger, IOS)
   to ten sam protokół — nie traktuję ich jako niezależnych. Mass General „T's” ma kciuk „forward” (pozycja neutralna), MSD — inne ćwiczenie. Kandydat na
   kartę (do czasu drugiego źródła NIE do aplikacji): setup — nowe zdanie „Połóż się klatką na skośnej ławce; hantle zwisają, łokcie lekko ugięte.” (ace-34
   krok 1; drugie źródło — `exrx-DeltoidPosterior/DBRearLateralRaise` z rejestru, nieczytelne w tej sesji, 403); ruch — „Unoś ręce bokiem do wysokości barków,
   obracając je tak, by kciuki szły w górę.” (Cook 6B; analogia — uproszczenie). Rozbieżność z rysunkiem: źródło ma obrót od początku (kciuk na zewnątrz
   w zwisie), rysunek — obrót narastający w górę ruchu; źródła mają prostą rękę, rysunek — łokieć lekko zgięty. `rear.elbows` i `mis.jerk` bez źródła dla
   tego ćwiczenia. Dalsze tropy: pełny tekst Reinold 2004 / Ekstrom 2003 (opis „prone horizontal abduction with full ER”), podręcznik NSCA.
3. **[OTWARTE] Cuban Press — jedno źródło:** „lekkie hantle” i błąd „za ciężkie hantle” (BarBend, krok 1 i „Picking Heavy Weights”); „nie rzucaj dłońmi w tył
   przy obrocie” (BarBend, krok 2, Coach's Tip); dłonie nad środkiem głowy (BarBend, krok 3); powrót tą samą drogą (Fitness Volt, sztanga; Coach i Sole = 5).
   Unoszenie barków jako błąd — tylko Sole (5); wniosek z `cubanBlades` odrzuciłem, bo przy wyciskaniu nad głowę łopatki i tak się unoszą i obracają.
   Szukano: ACE, NASM, ISSA, NFPT, Catalyst (brak hasła), T3 (treść nieczytelna), Outdoor Swimmer (płatne), IMG Academy (tylko film).
4. **[OTWARTE] External Rotation (linki) — „obracanie tułowia zamiast ramienia”** — tylko Fitness Volt („Twisting through the waist”). AAOS ćw. 17 („Do not let
   your body roll back”) dotyczy leżenia na boku — inne ćwiczenie.
5. **[OTWARTE] Band Pull Apart — łokcie:** Kaiser „bend your elbows” vs Catalyst i Throwers 10 „straight”. Rysunek (zgięcie 14°) mieści się w „prawie proste”,
   ale zdanie o łokciach nie przechodzi — sprzeczność na tym samym szczeblu bez części wspólnej poza „ręce przed sobą”. Obecne `rear.elbows`, `rear.arms`,
   `mis.jerk` w zestawie Band Pull Apart — bez źródła dla tego ćwiczenia (jak W1).
6. **Niezależność HSS i Mass General.** Dokument HSS (`hss.edu/sutton/shoulder-strengthening-program.pdf`) i Mass General („Shoulder Rotator Cuff and Scapular
   Strengthening Program”) mają ten sam tytuł i identyczne zdania — jedno źródło. W W1 nie zmienia to stanów (każde zdanie z HSS ma jeszcze AAOS albo Healthwise),
   ale przy przyszłych zdaniach nie liczyć ich razem.
7. **Liczby i zdrowie** (serie, powtórzenia, „over 10 pounds per hand”, „through a pain-free range”) — nie przenoszę.
