# Wskazówki techniki — rodzina `forearm` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: 13 ćwiczeń rodziny `forearm` (kolejność wg popularności z listy G6). Tylko wskazówki techniki; role mięśni robi inny agent.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda jak w `docs/research/33-wskazowki-partia2.md`: zdanie wchodzi do karty, gdy potwierdzają je ≥ 2 przeczytane źródła szczebla 4
z różnych organizacji (wyjątek dla wskazówek techniki, CLAUDE.md, 25.10.2026). Źródło o innym wariancie sprzętowym tego samego ruchu
liczy się z opisem „(wariant: …)”. Liczby (kąty, powtórzenia, tempo) z przeczytanych stron pominięte celowo.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Wrist Curl (hantle) | general `wrist` | gotowe | ACE #30, Coach, zestaw siłowni PureGym, NTCC (wariant: krótka sztanga) |
| Reverse Wrist Curl (hantle) | general `wrist` | gotowe | ACE #29, Coach, PureGym, GymNation (wariant: jednorącz); `wr.range` zastąpione nowym `wr.revMove` |
| Barbell Wrist Curl | general `wrist` | gotowe | GymNation (wprost), NTCC (krótka sztanga), reszta jako wariant: hantle |
| Barbell Reverse Wrist Curl | general `wrist` | gotowe | GymNation (wprost), NTCC (krótka sztanga), reszta jako wariant: hantle |
| One-Arm Dumbbell Wrist Curl | general `wrist` | gotowe | GymNation (wprost), reszta jako wariant: oburącz |
| One-Arm Dumbbell Reverse Wrist Curl | general `wrist` | gotowe | GymNation (wprost), reszta jako wariant: oburącz |
| Cable Wrist Curl | general `wrist` | gotowe | GymNation (wprost), reszta jako wariant: hantle/sztanga; ustawienie przy wyciągu — jedno źródło (pominięte) |
| Behind-the-Back Barbell Wrist Curl | general `wrist` | otwarte | jedno źródło, w dodatku wewnętrznie sprzeczne (patrz „Otwarte”) |
| Wrist Roller | open | gotowe | Bells of Steel (producent sprzętu) + GymNation |
| Plate Pinch | open | otwarte | jedno źródło (PureGym) |
| Reverse Plate Curls | general `curl` | otwarte | brak przeczytanego źródła |
| Dumbbell Lying Pronation | open | otwarte | ruch potwierdzony tylko w wariancie klęcząc/siedząc; ustawienie leżąc — brak źródła |
| Dumbbell Lying Supination | open | otwarte | jak wyżej |

Uwaga dla koordynatora: „gotowe” zakłada przyjęcie dwóch nowych organizacji (PureGym, GymNation — sieci siłowni) albo jednej z nich;
patrz sekcja 4. Bez nich: Wrist Curl (hantle) i Reverse Wrist Curl (hantle) zostają gotowe na ACE + Coach + NTCC (`wr.setupUp`,
`wr.range`, `wr.forearms`, `wr.revMove`), ale `curl.control` i `wr.mis.lift` mają wtedy po jednym źródle.

## 2. Wpisy do `exercises` (cues.json)

```json
{
  "Wrist Curl (hantle)": {
    "setup": [
      {"c": "wr.setupUp", "s": [["ace-30", "Step 1 (supinate your forearms… palms facing upward; dumbbells hanging freely off the edge)"], ["puregym-wrist-curls", "How to, kroki 2–3"], ["ntcc-forearm", "Kneeling Wrist Curls, krok 2 (wariant: krótka sztanga)"]]}
    ],
    "move": [
      {"c": "wr.range", "s": [["coach-wrist-curl", "Step 2 (roll the dumb-bells to the ends of your fingers, then curl up your wrists)"], ["ntcc-forearm", "Kneeling Wrist Curls, kroki 3–4 (wariant: krótka sztanga)"], ["ace-30", "Step 2–3"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["coach-wrist-curl", "Step 3 (keep your forearms on the pad throughout the move)"], ["puregym-wrist-curls", "How to, krok 4"]]},
      {"c": "curl.control", "s": [["ace-30", "Step 2 (slowly allow the wrists to move into extension)"], ["puregym-wrist-curls", "Tips (lower the weight back… with control)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["coach-wrist-curl", "Step 3 (odwrotność wskazówki)"], ["puregym-wrist-curls", "How to, krok 4 (keep your forearms flat on the bench; odwrotność)"]]}
    ]
  },
  "Reverse Wrist Curl (hantle)": {
    "setup": [
      {"c": "wr.setupDown", "s": [["ace-29", "Step 1 (pronate your forearms… palms downward)"], ["coach-reverse-wrist-curl", "Step 1"], ["puregym-wrist-extensions", "How to, kroki 1–2"]]}
    ],
    "move": [
      {"c": "wr.revMove", "s": [["ace-29", "Step 2–3"], ["puregym-wrist-extensions", "How to, kroki 3–4 (raise your knuckles toward your body)"], ["ntcc-forearm", "Seated Reverse Wrist Curl, kroki 3–4 (wariant: krótka sztanga)"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["coach-reverse-wrist-curl", "Step 2 (keep your forearms on the pad throughout the move)"], ["gymnation-db-reverse-wrist-curl", "Personal trainer notes (only your wrist should move; wariant: jednorącz)"]]},
      {"c": "curl.control", "s": [["ace-29", "Step 2 (slowly allow the wrists to move into flexion)"], ["puregym-wrist-extensions", "How to, krok 4 (lower back to the start slowly)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["coach-reverse-wrist-curl", "Step 2 (odwrotność wskazówki)"], ["gymnation-db-reverse-wrist-curl", "How-to, krok 3 (avoid lifting the forearm; wariant: jednorącz)"]]}
    ]
  },
  "Barbell Wrist Curl": {
    "setup": [
      {"c": "wr.setupUp", "s": [["gymnation-bb-wrist-curl", "How-to, kroki 1–2"], ["ntcc-forearm", "Kneeling Wrist Curls, krok 2 (wariant: krótka sztanga)"], ["ace-30", "Step 1 (wariant: hantle)"]]}
    ],
    "move": [
      {"c": "wr.range", "s": [["gymnation-bb-wrist-curl", "How-to, kroki 3–4 (full range of motion)"], ["ntcc-forearm", "Kneeling Wrist Curls, kroki 3–4 (wariant: krótka sztanga)"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["gymnation-bb-wrist-curl", "Personal trainer notes (only your wrists should move)"], ["coach-wrist-curl", "Step 3 (wariant: hantle)"]]},
      {"c": "curl.control", "s": [["gymnation-bb-wrist-curl", "How-to, krok 4; Personal trainer notes (don't rush through the lowering phase)"], ["ace-30", "Step 2 (wariant: hantle)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["gymnation-bb-wrist-curl", "Personal trainer notes (keep forearms resting on your thighs; odwrotność)"], ["coach-wrist-curl", "Step 3 (wariant: hantle; odwrotność)"]]}
    ]
  },
  "Barbell Reverse Wrist Curl": {
    "setup": [
      {"c": "wr.setupDown", "s": [["gymnation-bb-reverse-wrist-curl", "How-to, kroki 1–2"], ["ntcc-forearm", "Seated Reverse Wrist Curl, krok 2 (wariant: krótka sztanga)"], ["ace-29", "Step 1 (wariant: hantle)"]]}
    ],
    "move": [
      {"c": "wr.revMove", "s": [["gymnation-bb-reverse-wrist-curl", "How-to, kroki 3–4"], ["ntcc-forearm", "Seated Reverse Wrist Curl, kroki 3–4 (wariant: krótka sztanga)"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["gymnation-bb-reverse-wrist-curl", "Personal trainer notes (keep forearms fixed — the motion comes only from the wrists)"], ["coach-reverse-wrist-curl", "Step 2 (wariant: hantle)"]]},
      {"c": "curl.control", "s": [["gymnation-bb-reverse-wrist-curl", "How-to, krok 4 (lower slowly)"], ["ace-29", "Step 2 (wariant: hantle)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["gymnation-bb-reverse-wrist-curl", "Personal trainer notes (keep forearms fixed; odwrotność)"], ["coach-reverse-wrist-curl", "Step 2 (wariant: hantle; odwrotność)"]]}
    ]
  },
  "One-Arm Dumbbell Wrist Curl": {
    "setup": [
      {"c": "wr.setupUp", "s": [["gymnation-db-1arm-wrist-curl", "How-to, kroki 1–2"], ["ace-30", "Step 1 (wariant: oburącz)"], ["puregym-wrist-curls", "How to, kroki 2–3 (wariant: oburącz)"]]}
    ],
    "move": [
      {"c": "wr.range", "s": [["gymnation-db-1arm-wrist-curl", "How-to, kroki 2–4 (full range of motion)"], ["coach-wrist-curl", "Step 2 (wariant: oburącz)"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["gymnation-db-1arm-wrist-curl", "Personal trainer notes (only the wrist should move)"], ["coach-wrist-curl", "Step 3 (wariant: oburącz)"]]},
      {"c": "curl.control", "s": [["gymnation-db-1arm-wrist-curl", "How-to, krok 4; Personal trainer notes (slow eccentrics)"], ["puregym-wrist-curls", "Tips (wariant: oburącz)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["gymnation-db-1arm-wrist-curl", "Personal trainer notes (keep your forearm resting on the thigh; odwrotność)"], ["puregym-wrist-curls", "How to, krok 4 (wariant: oburącz; odwrotność)"]]}
    ]
  },
  "One-Arm Dumbbell Reverse Wrist Curl": {
    "setup": [
      {"c": "wr.setupDown", "s": [["gymnation-db-reverse-wrist-curl", "How-to, kroki 1–2 (jednorącz)"], ["ace-29", "Step 1 (wariant: oburącz)"], ["coach-reverse-wrist-curl", "Step 1 (wariant: oburącz)"]]}
    ],
    "move": [
      {"c": "wr.revMove", "s": [["gymnation-db-reverse-wrist-curl", "How-to, kroki 3–4"], ["ace-29", "Step 2–3 (wariant: oburącz)"], ["puregym-wrist-extensions", "How to, kroki 3–4 (wariant: oburącz)"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["gymnation-db-reverse-wrist-curl", "Personal trainer notes (only your wrist should move)"], ["coach-reverse-wrist-curl", "Step 2 (wariant: oburącz)"]]},
      {"c": "curl.control", "s": [["gymnation-db-reverse-wrist-curl", "How-to, krok 4 (slowly lower)"], ["ace-29", "Step 2 (wariant: oburącz)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["gymnation-db-reverse-wrist-curl", "How-to, krok 3 (avoid lifting the forearm)"], ["coach-reverse-wrist-curl", "Step 2 (wariant: oburącz; odwrotność)"]]}
    ]
  },
  "Cable Wrist Curl": {
    "setup": [
      {"c": "wr.setupUp", "s": [["gymnation-cable-wrist-curl", "How-to, kroki 1–2 (forearms on your thighs, wrists over your knees)"], ["ace-30", "Step 1 (wariant: hantle)"], ["ntcc-forearm", "Kneeling Wrist Curls, krok 2 (wariant: krótka sztanga)"]]}
    ],
    "move": [
      {"c": "wr.range", "s": [["gymnation-cable-wrist-curl", "How-to, kroki 3–4; Personal Trainer Notes (full range)"], ["ntcc-forearm", "Kneeling Wrist Curls, kroki 3–4 (wariant: krótka sztanga)"]]}
    ],
    "tips": [
      {"c": "wr.forearms", "s": [["gymnation-cable-wrist-curl", "Personal Trainer Notes (keep forearms resting on your thighs — only the wrist should move)"], ["coach-wrist-curl", "Step 3 (wariant: hantle)"]]},
      {"c": "curl.control", "s": [["gymnation-cable-wrist-curl", "How-to, krok 4 (slowly lower the bar)"], ["ace-30", "Step 2 (wariant: hantle)"]]}
    ],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["gymnation-cable-wrist-curl", "Personal Trainer Notes (odwrotność)"], ["puregym-wrist-curls", "How to, krok 4 (wariant: hantle; odwrotność)"]]}
    ]
  },
  "Wrist Roller": {
    "setup": [
      {"c": "wroll.setup", "s": [["bos-wrist-roller", "Standing or Seated, kroki 2–3"], ["gymnation-wrist-roller", "How-to, krok 1"]]}
    ],
    "move": [
      {"c": "wroll.move", "s": [["bos-wrist-roller", "Standing or Seated, kroki 4–5 (reverse the motion to lower it slowly)"], ["gymnation-wrist-roller", "How-to, kroki 3–4"]]}
    ],
    "tips": [
      {"c": "wroll.arms", "s": [["bos-wrist-roller", "Standing or Seated, krok 4 (keep the arms straight)"], ["gymnation-wrist-roller", "Trainer notes (keep arms fully extended…; move only at the wrist)"]]}
    ],
    "mistakes": [
      {"c": "wroll.mis.elbows", "s": [["bos-wrist-roller", "Standing or Seated, krok 4 (avoid letting the elbows drop)"], ["gymnation-wrist-roller", "Trainer notes (arms… parallel to the floor; don't turn it into a shoulder exercise)"]]}
    ]
  }
}
```

Uwaga do „odwrotność”: błąd `wr.mis.lift` i `wroll.mis.elbows` to odwrócenie wprost zapisanej wskazówki („keep forearms on the pad”,
„avoid letting the elbows drop”) — tak samo jak w istniejących wpisach rodziny. W ćwiczeniach na udach zdanie `wr.mis.lift`
(„od podparcia”) pasuje bez zmian.

## 3. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| ace-29 | ACE | Wrist Curl - Extension (#29) | https://www.acefitness.org/resources/everyone/exercise-library/29/wrist-curl-extension/ | 4 | 02.11.2026 |
| ace-30 | ACE | Wrist Curl - Flexion (#30) | https://www.acefitness.org/resources/everyone/exercise-library/30/wrist-curl-flexion/ | 4 | 02.11.2026 |
| ace-31 | ACE | Wrist Supination and Pronation (#31) | https://www.acefitness.org/resources/everyone/exercise-library/31/wrist-supination-and-pronation/ | 4 | 02.11.2026 (tylko „Otwarte”) |
| coach-wrist-curl | Coach | Introduction: Wrist curl | https://www.coachweb.com/exercises/arm-exercises/163/wrist-curl | 4 | 02.11.2026 |
| coach-reverse-wrist-curl | Coach | Variation: Reverse wrist curl | https://coachweb.com/exercises/arm-exercises/2835/variation-reverse-wrist-curl | 4 | 02.11.2026 |
| coach-forearm-rotation | Coach | Variation: Forearm rotation | https://www.coachweb.com/exercises/3123/2-dumb-bell-forearm-rotation | 4 | 02.11.2026 (tylko „Otwarte”) |
| ntcc-forearm | NTCC Athletics (nowa) | Live Like an Athlete — Forearm Exercises | https://ntcc.edu/athletics/live-athlete/exercises/forearm-exercises | 4 | 02.11.2026 |
| puregym-wrist-curls | PureGym (nowa) | Wrist Curls | https://www.puregym.com/exercises/arms-and-shoulders/forearm-and-grip-exercises/wrist-curls/ | 4 | 02.11.2026 |
| puregym-wrist-extensions | PureGym (nowa) | Wrist Extensions | https://www.puregym.com/exercises/arms-and-shoulders/forearm-and-grip-exercises/wrist-extensions/ | 4 | 02.11.2026 |
| puregym-plate-pinch | PureGym (nowa) | Plate Pinch | https://puregym.com/exercises/arms-and-shoulders/forearm-and-grip-exercises/plate-pinch | 4 | 02.11.2026 (tylko „Otwarte”) |
| gymnation-bb-wrist-curl | GymNation (nowa) | Barbell Wrist Curl | https://gymnation.com/en-ae/exercise-library/barbell-wrist-curl/ | 4 | 02.11.2026 |
| gymnation-bb-reverse-wrist-curl | GymNation (nowa) | Barbell Reverse Wrist Curl | https://gymnation.com/en-ae/exercise-library/barbell-reverse-wrist-curl/ | 4 | 02.11.2026 |
| gymnation-db-1arm-wrist-curl | GymNation (nowa) | Dumbbell One Arm Wrist Curl | https://gymnation.com/en-ae/exercise-library/dumbbell-one-arm-wrist-curl/ | 4 | 02.11.2026 |
| gymnation-db-reverse-wrist-curl | GymNation (nowa) | Dumbbell Reverse Wrist Curl (jednorącz) | https://gymnation.com/en-ae/exercise-library/dumbbell-reverse-wrist-curl/ | 4 | 02.11.2026 |
| gymnation-cable-wrist-curl | GymNation (nowa) | Cable Wrist Curl | https://gymnation.com/en-ae/exercise-library/cable-wrist-curl/ | 4 | 02.11.2026 |
| gymnation-bb-behind-back | GymNation (nowa) | Barbell Standing Back Wrist Curl | https://gymnation.com/en-ae/exercise-library/barbell-standing-back-wrist-curl/ | 4 | 02.11.2026 (tylko „Otwarte”) |
| gymnation-wrist-roller | GymNation (nowa) | Wrist Roller | https://gymnation.com/exercise-library/wrist-roller | 4 | 02.11.2026 |
| bos-wrist-roller | Bells of Steel (nowa) | How To Use a Wrist Roller (blog, 08.04.2025) | https://bellsofsteel.us/blogs/content/how-to-use-a-wrist-roller | 4 | 02.11.2026 |

### Nowe organizacje (propozycja)

| Organizacja | Propozycja wpisu `orgs` | Szczebel | Uwagi |
|---|---|---|---|
| NTCC Athletics | „Northeast Texas Community College — Athletics, Live Like an Athlete (uczelniany dział sportu)”, kind `org` | 4 | uczelniane centrum sportu (dozwolone w briefie); instrukcje krótkie, bez sekcji błędów |
| PureGym | „PureGym — Exercise library (sieć siłowni, Wielka Brytania)”, kind `site` | 4 | strona sieci siłowni, nie aplikacja; brak autora na stronach |
| GymNation | „GymNation — Exercise library (sieć siłowni, ZEA)”, kind `site` | 4 | sieć siłowni, ma też własną aplikację, ale biblioteka jest częścią strony sieci; strona Behind-the-Back zawiera błąd anatomiczny (patrz „Otwarte”) — do decyzji koordynatora, czy przyjąć |
| Bells of Steel | „Bells of Steel — blog producenta sprzętu”, kind `maker` | 4 | producent sprzętu (w tym wałków do nadgarstków) |

Odrzucone/niedostępne: ExRx (403), web.archive.org (zablokowane dla narzędzia), muscleandstrength.com (403), elitefts.com (404 na dwóch
stronach indeksu), barbend.com/wrist-curl (404), Physitrack „wrist roller” (to inne ćwiczenie — wyprost nadgarstka z gumą; nie liczy się),
strona Motra (aplikacja treningowa — wykluczona briefem). Pozostałe trafienia wyszukiwarki to aplikacje albo serwisy niskiej jakości — nie czytane jako źródła.

## 4. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| wr.setupUp | Oprzyj przedramiona dłońmi do góry, tak żeby nadgarstki wystawały poza oparcie. | Rest your forearms palms up, with your wrists hanging off the edge. | ace-30 Step 1; puregym-wrist-curls kroki 2–3; ntcc-forearm (Kneeling Wrist Curls 2); gymnation (bb, 1-arm, cable: forearms on thighs, wrists over knees). Celowo bez „ławka/uda” — źródła podają oba podparcia. |
| wr.setupDown | Oprzyj przedramiona dłońmi w dół, tak żeby nadgarstki wystawały poza oparcie. | Rest your forearms palms down, with your wrists hanging off the edge. | ace-29 Step 1; coach-reverse-wrist-curl Step 1; puregym-wrist-extensions 1–2; ntcc (Seated Reverse 2); gymnation (bb-rev, db-rev). |
| wr.revMove | Opuść dłonie, potem unieś je grzbietem w swoją stronę — pracują same nadgarstki. | Let your hands drop, then lift them back toward you — only your wrists move. | ace-29 Step 2–3; puregym-wrist-extensions 3–4 („raise your knuckles toward your body”); ntcc Seated Reverse 3–4 („until the back of your hands are facing the body”); gymnation-bb-rev krok 3. |
| wroll.setup | Stań prosto i trzymaj wałek oburącz przed sobą na wysokości barków, ręce proste. | Stand tall and hold the roller in front of you at shoulder height, arms straight. | bos-wrist-roller kroki 2–4; gymnation-wrist-roller krok 1. |
| wroll.move | Obracając nadgarstkami, nawijaj linkę, aż ciężar dojdzie do wałka; potem powoli ją odwijaj. | Turn your wrists to wind the cord until the weight reaches the roller, then unwind it slowly. | bos-wrist-roller kroki 4–5; gymnation-wrist-roller kroki 3–4. |
| wroll.arms | Ręce zostają proste — pracują nadgarstki, nie barki. | Keep your arms straight — your wrists do the work, not your shoulders. | bos krok 4; gymnation trainer notes. |
| wroll.mis.elbows | Opuszczanie łokci i rąk w trakcie nawijania. | Letting the elbows and arms drop while winding. | bos krok 4 („avoid letting the elbows drop”); gymnation notes (ręce równolegle do podłogi). |

Istniejące zdania użyte bez zmian: `wr.range`, `wr.forearms`, `wr.mis.lift`, `curl.control`.

## 5. Otwarte

- **Zestaw ogólny `wrist` dla wersji „reverse” (Reverse Wrist Curl hantle/sztanga/jednorącz):** `wr.range` („Opuść ciężar tak nisko,
  jak pozwala nadgarstek…”) nie jest potwierdzone dla wersji z dłońmi w dół — PureGym mówi o opuszczaniu do „lekkiego rozciągnięcia”,
  ACE i Coach nie mówią o zakresie dolnym. Zastąpione w propozycji przez `wr.revMove`. Informacja o błędzie zestawu ogólnego.
- **Toczenie ciężaru do końców palców w wrist curl:** Coach (Step 2) to zaleca, ACE #30 (Notes/Tips) opisuje to jako częsty błąd
  zwiększający ryzyko dla nadgarstka. Sprzeczność na tym samym szczeblu, do tego twierdzenie o zdrowiu → ani wskazówka, ani błąd.
  Zdanie `wr.range` celowo nie mówi o rozluźnieniu chwytu.
- **Siła chwytu:** ACE (#30, #31) — ściskać rączkę mocno; GymNation (Dumbbell Reverse Wrist Curl) — nie ściskać za mocno. Sprzeczne → pominięte.
- **Behind-the-Back Barbell Wrist Curl:** jedyne przeczytane źródło (GymNation, Barbell Standing Back Wrist Curl) opisuje ruch jako
  „extending your wrists… wrist extensors”, choć to zgięcie nadgarstka; strona wewnętrznie niespójna, jedno źródło. Zestaw ogólny
  (`wr.range`, `mis.jerk`) bez potwierdzenia dla tego wariantu. Do szukania: druga, rzetelna strona.
- **Plate Pinch:** tylko PureGym (kroki 1–6: chwyt krawędzi palcami i kciukiem, stać z talerzem przy boku, ściskać, odłożyć z kontrolą).
  elitefts — 404. Potrzebne drugie źródło. Liczby czasu trzymania z PureGym — nie do aplikacji.
- **Reverse Plate Curls:** brak przeczytanego źródła; zestaw ogólny `curl` (`curl.elbows`, `curl.noSwing`, `curl.control`, `curl.mis.elbows`)
  to analogia do uginania ramion — dla tego wariantu niepotwierdzona. Najbliższe przeczytane: NTCC „Standing Reverse Curls” (sztanga
  nachwytem; łokcie i tułów nieruchomo) — to wariant sprzętowy (sztanga zamiast talerza); z drugim źródłem dla talerza mogłoby wystarczyć.
- **Dumbbell Lying Pronation / Dumbbell Lying Supination:** ruch rotacji potwierdzony w wariancie klęcząc/siedząc z przedramieniem
  na ławce: ACE #31 (Step 1–3: nadgarstek neutralnie, obrót powoli, przedramię oparte) i Coach „Forearm rotation” (całe przedramię
  na ławce, dłoń w linii z przedramieniem). Kandydaci zdań: `fa.rotWrist` „Nadgarstek prosto — obraca się tylko przedramię.”
  (ACE Step 2–3 + Coach krok 3) i `fa.rotSupport` „Przedramię oparte przez cały ruch.” (ACE Step 1 + Coach krok 1). Brak źródła
  dla ustawienia leżąc — nie wiadomo, czy w tym wariancie przedramię jest oparte; dlatego nie wpisane do JSON.
- **Cable Wrist Curl — ustawienie przy wyciągu** (drążek na dolnym wyciągu, siad przodem do maszyny): tylko GymNation → pominięte.
- **Wrist Roller — kierunek nawijania a mięśnie, praca na stojaku, tempo:** jedno źródło albo liczby → pominięte.

## 6. Stan

Zrobione: 8/13 ćwiczeń z kompletem (7 × wrist curl + Wrist Roller). Zostało: Behind-the-Back Barbell Wrist Curl, Plate Pinch,
Reverse Plate Curls, Dumbbell Lying Pronation, Dumbbell Lying Supination — każde potrzebuje drugiego niezależnego źródła (dla Lying —
źródła z ustawieniem leżąc). Następny krok: szukać wśród producentów sprzętu i uczelnianych działów sportu. Pułapki: ExRx 403,
web.archive.org niedostępne dla WebFetch, muscleandstrength 403, elitefts 404, wiele trafień to aplikacje (wykluczone).
