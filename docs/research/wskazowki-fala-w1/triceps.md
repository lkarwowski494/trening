# Wskazówki techniki — fala W1, rodzina „triceps” (prostowanie ramion)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`.
Wdrożenie (scalenie bloku JSON do `data/zrodla/cues.json`, nowe zdania w `lib/cues/text/*.json` w 35 językach, rejestr twierdzeń,
zmiana `b` na `own` w `lib/figures/v2/cue-sets.json`) robi koordynator / programista / tłumacz. Przed statusem gotowym w aplikacji — niezależna recenzja (L-047).

## Metoda

Jak w `docs/research/27-wskazowki-zrodla.md` i `docs/research/33-wskazowki-partia2.md` oraz wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026):

- lista ćwiczeń: `lib/figures/v2/cue-sets.json` (tryb `general`, rodzina `triceps` według reguły w `lib/figures/v2/families.ts:116`
  — `triceps`, `tricep`, `skull`, `tate press`, `kickback`, `body-up`, `pushdown`, `chain handle`, `jm press`). Pominięte ćwiczenia z własnymi
  wskazówkami w `data/zrodla/cues.json`: Triceps Pushdown, Overhead Triceps Extension (hantel), Cable Overhead Extension, Skullcrusher (EZ)
  (ACG-006 — bez zmian), Triceps Dips (ławka);
- każde zdanie ma ≥ 2 źródła z RÓŻNYCH organizacji, przeczytane w tej sesji (WebFetch, 02.11.2026), z podanym miejscem. Źródło o wariancie tego samego ćwiczenia
  (inny sprzęt, jedną ręką / oburącz) liczy się z dopiskiem „(wariant: …)”; źródło o innym ćwiczeniu — nie;
- najpierw istniejące zdania (`skull.*`, `ote.*`, `tpd.*`, `press.noLock`, `llc.control`). Nowe tylko tam, gdzie istniejące mówią o innym sprzęcie
  („hantel”, „gryf”) albo o innym ułożeniu ciała. Zdań zestawu ogólnego, których nie potwierdzono dla danego wariantu, nie wpisuję — są w sekcji „Otwarte”;
- bez twierdzeń o zdrowiu; zdania własne, tylko część wspólna źródeł;
- nie korzystam ze stron ani dokumentacji innych aplikacji treningowych.

### Dostęp do źródeł w tej sesji

- **ExRx.net niedostępny** (exrx.net → 403, `web.archive.org` zablokowany przez narzędzie; sprawdzone 02.11.2026) — **nie użyty** w tej partii.
- Niedostępne: Mayo Clinic (filmy „Triceps extension / kickback” → 403), HKU CSE `exercises-Active-BicepsTriceps.pdf` (503),
  Western SRS `arms.html` (404). Strona `biceps_and_triceps.html` przeczytana — jest tam tylko maszyna „Seated Triceps” do wypychania w dół, inna niż
  „Machine Triceps Extension”. NASM Exercise Library nie ma stron prostowania ramion (404 dla `triceps-pushdown`, `skull-crusher`,
  `triceps-kickback`), a artykuł NASM „9 of the Best Arm-Sculpting Exercises” nie podaje instrukcji. Strona wideo Michigan State Univ. — bez tekstu.
- Strony aplikacji treningowych i sklepów z wyników wyszukiwania pominięte, nigdzie nie zapisane.

## (1) Tabela ćwiczeń

Kolejność: najpierw popularne (ZOSTAJE w `docs/research/25-biblioteka/L1-zrodla.md`).

| Klucz | Stan | Zdania / powód |
|---|---|---|
| Skullcrusher (hantle) | **gotowe** | nowe skullDb.setup, skullDb.move; skull.upperArm. Nie użyte: `skull.setup`/`skull.move`/`skull.depth`, bo mówią o gryfie |
| Triceps Kickback | **gotowe** | nowe kick.setup, kick.move, kick.upperArm; press.noLock |
| Overhead Triceps Extension (EZ) | **gotowe (wariant)** | nowe ote.setupLoad, ote.moveLoad; ote.upperArm, ote.elbowsIn, press.noLock. Źródła o hantlu — wariant sprzętu |
| Single Arm Triceps Pushdown | **gotowe** | tpd.setup, tpd.move, tpd.elbows, press.noLock. ACE #185 wprost podaje wersję jednorącz |
| Dumbbell One-Arm Triceps Extension | **gotowe** | ote.move (hantel), ote.upperArm, press.noLock; ISSA wprost podaje wersję jedną ręką. Nie użyte: `ote.setup` („oburącz”). Uwaga: zdania w l.mn. („ręce”, „łokcie”) |
| Skullcrusher (sztanga) | **gotowe (tylko 1 wskazówka)** | skull.upperArm (ACE #36 — sztanga, ISSA — hantle). Otwarte: skull.setup, skull.move, skull.depth — drugie źródło o sztandze tylko w ExRx (niedostępny) |
| Machine Triceps Extension | **gotowe (tylko wskazówki)** | press.noLock, llc.control (Naternicola/Human Kinetics + producent Hoist). Ustawienie (łokieć na osi obrotu) ma jedno źródło → otwarte |
| Triceps Kickback (linki) | **gotowe (wariant)** | kick.move, kick.upperArm, press.noLock — źródła o hantlu i gumie (wariant sprzętu). Nie użyte: kick.setup (oparcie wolnej ręki przy wyciągu niepotwierdzone) |
| Standing Overhead Barbell Triceps Extension | **gotowe (wariant)** | ote.setupLoad, ote.moveLoad, ote.upperArm, ote.elbowsIn, press.noLock — źródła o hantlu |
| Kettlebell Overhead Triceps Extension | **gotowe (wariant)** | jak wyżej |
| Standing Low-Pulley One-Arm Triceps Extension | **gotowe (tylko wskazówki, wariant)** | ote.upperArm, press.noLock — źródła o hantlu; ustawienie przy dolnym bloczku niepotwierdzone |
| Two-Arm Dumbbell Kickback | otwarte | źródła opisują wersję jednorącz z podparciem (ACE #55, ISSA). Human Kinetics/Zahab opisuje prowadzenie prostych rąk w tył — to inny ruch |
| Reverse Grip Triceps Pushdown | otwarte | żadne przeczytane źródło nie opisuje podchwytu (Delavier wymienia nachwyt, chwyt neutralny i linę) |
| Incline Barbell Triceps Extension | otwarte | brak przeczytanego źródła o wersji na ławce skośnej. Pilot 02.11.2026: `skull.upperArm` („pionowo”) jest fałszywe przy ławce 45–75° — **nie używać**. Proponowany zestaw `triOver` (ote.upperArm, ote.elbowsIn) też wymaga źródła o tej wersji |
| Cable Incline Triceps Extension | otwarte | jak wyżej (ławka skośna) + wyciąg |
| Kneeling Cable Triceps Extension | otwarte | ustawienie (klęk, wyciąg, ławka) niepotwierdzone |
| Cable Lying Triceps Extension | otwarte | brak źródła o wersji z wyciągiem |
| One-Arm Lying Dumbbell Triceps Extension | otwarte | brak źródła o wersji jednorącz leżąc |
| Decline Dumbbell Triceps Extension | otwarte | brak źródła o ławce ujemnej (to samo ryzyko co w pilocie: Decline/Incline) |
| Decline EZ Bar Triceps Extension | otwarte | jak wyżej |
| Decline Close-Grip Bench To Skull Crusher | otwarte | ćwiczenie złożone (wyciskanie + prostowanie) — brak źródła |
| Lying Close-Grip Barbell Triceps Extension Behind The Head | otwarte | brak źródła o opuszczaniu za głowę |
| Band Skull Crusher | otwarte | brak źródła o wersji z gumą na leżąco |
| Band Overhead Triceps Extension | otwarte | Human Kinetics/Sandler wspomina gumę nad głową tylko jednym zdaniem — za mało; zaczepienie gumy niepotwierdzone |
| Chain Handle Extension | otwarte | brak źródła |
| Tate Press | otwarte | jedno źródło (ISSA, #5) |
| JM Press | otwarte | brak źródła |
| Body-Up, Bodyweight Triceps Extension, Sled Overhead Triceps Extension | otwarte | dziś tryb `open`; brak źródeł |

Podsumowanie: **11 gotowych** (4 z pełnym zestawem i źródłem o tym samym ćwiczeniu; 7 częściowo — „wariant” lub „tylko wskazówki”) oraz **17 otwartych** (w tym 3 z trybu `open`).

## (2) Blok JSON do `data/zrodla/cues.json` — NIEAKTUALNY — patrz przeliczenie 02.11.2026

Nowe źródła (`sources`) i organizacje (`orgs`) są w sekcji (4). Ćwiczenia (tylko gotowe):

```json
{
  "Skullcrusher (hantle)": {
    "setup": [{"c": "skullDb.setup", "s": [["issa-tri-top5", "#2 Triceps Extension, wersja leżąc (dumbbells raised above the head)"], ["ace-36", "Step 1 (wariant: sztanga)"]]}],
    "move": [{"c": "skullDb.move", "s": [["issa-tri-top5", "#2 Triceps Extension, wersja leżąc (lowered to ear level)"], ["ace-36", "Step 2; Step 3 (wariant: sztanga; towards forehead or slightly behind head)"]]}],
    "tips": [
      {"c": "skull.upperArm", "s": [["ace-36", "Step 2; wskazówka końcowa (wariant: sztanga; upper arms vertical)"], ["issa-tri-top5", "#2 Triceps Extension, wersja leżąc (upper arm does not move)"]]}
    ],
    "mistakes": []
  },
  "Triceps Kickback": {
    "setup": [{"c": "kick.setup", "s": [["ace-55", "Step 1; Step 2"], ["issa-tri-top5", "#3 Triceps Kickback (knee and palm on bench, lean forward; elbow 90°)"], ["issa-band-20", "Triceps Kickback (neutral spine; arm tight to the side; wariant: guma)"]]}],
    "move": [{"c": "kick.move", "s": [["ace-55", "Step 3; Step 4"], ["issa-tri-top5", "#3 Triceps Kickback"]]}],
    "tips": [
      {"c": "kick.upperArm", "s": [["ace-55", "Step 3 (upper arm stationary next to torso)"], ["issa-tri-top5", "#3 Triceps Kickback (you don't move the upper arm)"]]},
      {"c": "press.noLock", "s": [["ace-55", "Step 3 (until your elbow is fully extended)"], ["issa-tri-top5", "#3 Triceps Kickback (Don't lock the elbow)"]]}
    ],
    "mistakes": []
  },
  "Overhead Triceps Extension (EZ)": {
    "setup": [{"c": "ote.setupLoad", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation; Movement (keep elbows pointing upward; wariant: hantel)"], ["issa-tri-top5", "#2 Triceps Extension (elbows in line with ears; wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 Triceps Extension (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (elbows close to ears, pointing upward; wariant: hantel)"], ["issa-tri-top5", "#2 Triceps Extension (keep your upper arm still; wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-74", "wskazówka końcowa (elbows shoulder-width apart; wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (elbows close to your ears; wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (not completely locked; wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation (straight but not locked; wariant: hantel)"], ["issa-tri-top5", "#2 Triceps Extension (not lock the elbows; wariant: hantel)"]]}
    ],
    "mistakes": []
  },
  "Single Arm Triceps Pushdown": {
    "setup": [{"c": "tpd.setup", "s": [["ace-185", "Step 1; wariant jednorącz"], ["hk-delavier", "Cable Push-Down, ustawienie (upper part of a pulley; wariant: oburącz)"], ["issa-tri-top5", "#4 Triceps Pushdown (elbows close to sides; wariant: oburącz)"]]}],
    "move": [{"c": "tpd.move", "s": [["ace-185", "Step 2; Step 3"], ["issa-tri-top5", "#4 Triceps Pushdown (wariant: oburącz)"], ["hk-delavier", "Cable Push-Down, wykonanie (wariant: oburącz)"]]}],
    "tips": [
      {"c": "tpd.elbows", "s": [["ace-185", "Step 1; Step 2; wskazówka końcowa"], ["hk-delavier", "Cable Push-Down, wykonanie (elbows close to your sides; wariant: oburącz)"], ["issa-tri-top5", "#4 Triceps Pushdown (wariant: oburącz)"]]},
      {"c": "press.noLock", "s": [["ace-185", "Step 3 (fully extended, do not lock out)"], ["issa-tri-top5", "#4 Triceps Pushdown (not lock them; wariant: oburącz)"]]}
    ],
    "mistakes": []
  },
  "Dumbbell One-Arm Triceps Extension": {
    "setup": [],
    "move": [{"c": "ote.move", "s": [["issa-tri-top5", "#2 Triceps Extension (or use one arm at a time)"], ["ace-74", "Step 2; Step 3 (wariant: oburącz)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: oburącz)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["issa-tri-top5", "#2 Triceps Extension (keep your upper arm still)"], ["ace-74", "Step 3; wskazówka końcowa (wariant: oburącz)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: oburącz)"]]},
      {"c": "press.noLock", "s": [["issa-tri-top5", "#2 Triceps Extension (not lock the elbows)"], ["ace-74", "Step 2 (wariant: oburącz)"]]}
    ],
    "mistakes": []
  },
  "Skullcrusher (sztanga)": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "skull.upperArm", "s": [["ace-36", "Step 2; wskazówka końcowa (upper arms vertical)"], ["issa-tri-top5", "#2 Triceps Extension, wersja leżąc (upper arm does not move; wariant: hantle)"]]}
    ],
    "mistakes": []
  },
  "Machine Triceps Extension": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "press.noLock", "s": [["hk-naternicola", "Figure 5.28 Machine Arm Extension, Movement (straight but not locked)"], ["hoist-rs2103", "instrukcja (not to lock-out elbows)"]]},
      {"c": "llc.control", "s": [["hk-naternicola", "Figure 5.28, Movement (slowly extend; slowly return)"], ["hoist-rs2103", "instrukcja (Slowly return to the start position)"]]}
    ],
    "mistakes": []
  },
  "Triceps Kickback (linki)": {
    "setup": [],
    "move": [{"c": "kick.move", "s": [["ace-55", "Step 3; Step 4 (wariant: hantel)"], ["issa-band-20", "Triceps Kickback (extend at the elbow and press the band back; wariant: guma)"], ["issa-tri-top5", "#3 (wariant: hantel; 90°)"]]}],
    "tips": [
      {"c": "kick.upperArm", "s": [["ace-55", "Step 3 (wariant: hantel)"], ["issa-band-20", "Triceps Kickback (arm tight to the side; wariant: guma)"]]},
      {"c": "press.noLock", "s": [["ace-55", "Step 3 (wariant: hantel)"], ["issa-tri-top5", "#3 (Don't lock the elbow; wariant: hantel)"]]}
    ],
    "mistakes": []
  },
  "Standing Overhead Barbell Triceps Extension": {
    "setup": [{"c": "ote.setupLoad", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation; Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-74", "wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": []
  },
  "Kettlebell Overhead Triceps Extension": {
    "setup": [{"c": "ote.setupLoad", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation; Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-74", "wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": []
  },
  "Standing Low-Pulley One-Arm Triceps Extension": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"], ["issa-tri-top5", "#2 (one arm at a time; wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": []
  }
}
```

Uwagi do wdrożenia:
- Po scaleniu zmienić w `lib/figures/v2/cue-sets.json` `b` z `general` na `own` dla tych kluczy (jak u Triceps Pushdown).
  Dla wpisów „tylko wskazówki” (Skullcrusher (sztanga), Machine, Low-Pulley) koordynator decyduje, czy pusta karta ustawienia i ruchu jest
  lepsza niż zestaw ogólny. Jeśli nie — zostają w `general` do czasu uzupełnienia.
- Pole „mistakes” jest puste we wszystkich wpisach — żaden częsty błąd nie ma 2 źródeł (sekcja 5).

## (3) Nowe zdania PL (+ propozycja EN)

Każde nowe zdanie: 35 języków (tłumacz) + wpis w `docs/research/rejestr-twierdzen.json` (`node scripts/claims.mjs --stub`, po przeglądzie `--rehash`).

| Id | PL | EN (propozycja) | Źródła |
|---|---|---|---|
| kick.setup | Pochyl się do przodu z prostymi plecami i oprzyj wolną rękę o ławkę albo udo; ramię przy tułowiu, łokieć zgięty pod kątem prostym. | Lean forward with a flat back and rest your free hand on a bench or your thigh; upper arm by your side, elbow bent to about 90°. | ace-55 Step 1–2; issa-tri-top5 #3; issa-band-20 (plecy neutralnie, ramię przy boku) |
| kick.move | Prostuj łokieć, odprowadzając dłoń do tyłu, aż ręka będzie prosta; wróć do kąta prostego. | Straighten your elbow, moving your hand back until your arm is straight; return to about 90°. | ace-55 Step 3–4; issa-tri-top5 #3 |
| kick.upperArm | Ramię nieruchomo przy tułowiu — rusza się tylko przedramię. | Keep your upper arm still by your side — only the forearm moves. | ace-55 Step 3; issa-tri-top5 #3; issa-band-20 |
| skullDb.setup | Połóż się na ławce i trzymaj hantle nad sobą na prostych rękach. | Lie on a bench and hold the dumbbells above you with straight arms. | issa-tri-top5 #2 (leżąc); ace-36 Step 1 (wariant: sztanga) |
| skullDb.move | Zginaj łokcie, opuszczając hantle w stronę głowy; wyprostuj ręce do pozycji wyjściowej. | Bend your elbows to lower the dumbbells toward your head; straighten your arms back to the start. | issa-tri-top5 #2 (do wysokości uszu); ace-36 Step 2–3 (w stronę czoła lub tuż za głowę; wariant: sztanga) |
| ote.setupLoad | Unieś ciężar nad głowę na prostych rękach, łokcie skierowane w górę. | Lift the weight overhead with straight arms, elbows pointing up. | ace-74 Step 2; hk-naternicola Fig. 5.27; issa-tri-top5 #2 |
| ote.moveLoad | Zginaj łokcie, opuszczając ciężar za głowę; wyprostuj ręce nad głową. | Bend your elbows to lower the weight behind your head; straighten your arms overhead. | ace-74 Step 2–3; hk-naternicola Fig. 5.27; issa-tri-top5 #2 |

Kontrola sformułowań:
- „prostymi plecami” — część wspólna ACE #55 (głowa w linii kręgosłupa, bez wyginania tułowia) i ISSA (neutral spine);
- „kąt prosty” — ACE (ok. 90°) i ISSA (90°);
- w `kick.move` celowo bez „powoli”, bo mówi o tym tylko ACE;
- `skullDb.move` mówi „w stronę głowy”: to część wspólna „do wysokości uszu” (ISSA) i „w stronę czoła” (ACE);
- `ote.setupLoad`/`ote.moveLoad` zamiast `ote.setup`/`ote.move`, bo tamte mówią o hantlu trzymanym oburącz.

Krótkie cytaty kontrolne:
- ACE #55: „Position the your left upper arm parallel to, and close to, your torso.” (Step 2)
- ISSA, #3: „Don’t lock the elbow.”
- Human Kinetics / Naternicola, Fig. 5.27: „Keep elbows pointing upward throughout the entire movement.”

## (4) Źródła

### Nowe organizacje (propozycja do `orgs` i do tabeli w docs/27)

| Skrót | Organizacja | Szczebel | `kind` | Uwagi |
|---|---|---|---|---|
| ISSA | International Sports Sciences Association — blog szkoleniowy (issaonline.com) | 4 | org | organizacja szkoląca trenerów, jak ACE i NASM |
| Human Kinetics — Naternicola | N. L. Naternicola, „Fitness: Steps to Success” (Human Kinetics), fragment na stronie wydawcy | 4 | site (propozycja) | książka; `CUE_BASIS_KINDS` nie ma „book” (`lib/cues/index.ts:25`) — [DO DECYZJI koordynatora] |
| Human Kinetics — Delavier, Gundill | F. Delavier, M. Gundill, „Delavier's Women's Strength Training Anatomy Workouts” (Human Kinetics), fragment | 3 (książka uznanych autorów); ostrożnie 4 | site (propozycja) | inny autor niż Naternicola, ten sam wydawca — liczę jako niezależne; w żadnym zdaniu nie tworzą jedynej pary źródeł |
| Hoist Fitness | Hoist Fitness — strona produktu RS-2103 Triceps Extension | 4 | maker | producent maszyny (nazwa spoza `tests/forbidden-names.json`) |

### Źródła (`sources`) — wszystkie przeczytane 02.11.2026

| Id | Org | Tytuł / miejsce | URL | Szczebel |
|---|---|---|---|---|
| ace-36 (istnieje) | ACE | Lying Barbell Triceps Extensions (#36) | https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/ | 4 |
| ace-55 (nowe) | ACE | Triceps Kickback (#55) | https://www.acefitness.org/resources/everyone/exercise-library/55/triceps-kickback/ | 4 |
| ace-74 (istnieje) | ACE | Triceps Extension (#74) | https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/ | 4 |
| ace-185 (istnieje) | ACE | Triceps Pushdowns (#185); w Step 3 wersja jednorącz | https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/ | 4 |
| issa-tri-top5 (nowe) | ISSA | „5 Best Triceps Exercises for Strength and Muscle Growth” (05.02.2024): #2 Triceps Extension (stojąc/siedząc, jedną ręką, leżąc), #3 Triceps Kickback, #4 Triceps Pushdown, #5 Tate Press | https://www.issaonline.com/blogs/training-tips/top-exercises-to-enhance-your-triceps-workout | 4 |
| issa-band-20 (nowe) | ISSA | „20-Minute Full-Body Resistance Band Workout” (05.02.2024), Triceps Kickback | https://www.issaonline.com/blogs/training-tips/20-minute-full-body-resistance-band-workout | 4 |
| hk-naternicola (nowe) | Human Kinetics — Naternicola | „Strengthen the triceps”: Figure 5.27 Triceps Extension; Figure 5.28 Machine Arm Extension | https://us.humankinetics.com/blogs/excerpt/strengthen-the-triceps | 4 |
| hk-delavier (nowe) | Human Kinetics — Delavier, Gundill | „Cable Push-Down” (ustawienie, wykonanie, wskazówki) | https://us.humankinetics.com/blogs/excerpt/cable-push-down | 3/4 |
| hoist-rs2103 (nowe) | Hoist Fitness | RS-2103 Triceps Extension — instrukcja na stronie produktu | https://www.hoistfitness.com/pages/rs-2103-triceps-extension | 4 |

Przeczytane, ale nieużyte:
- Human Kinetics / Sandler, „Tips to tone biceps and triceps…” — tylko ogólne zdanie o ruchu łokcia, nie o konkretnym ćwiczeniu;
- Human Kinetics / Zahab, „Dumbbell triceps extension” — prowadzenie prostych rąk w tył, inny ruch niż kickback;
- Western SRS, „Biceps and Triceps” — maszyna do wypychania w dół, nie maszyna z poduszką pod ramiona;
- Nautilus S912, instrukcja s. 18 — atlas domowy, inna maszyna.

## (5) Otwarte

1. **[OTWARTE] Skullcrusher (sztanga) — ustawienie, ruch, głębokość** (`skull.setup`, `skull.move`, `skull.depth`): drugie niezależne źródło
   o sztandze było tylko w ExRx (niedostępny). Kandydaci: HKU CSE, NSCA „Exercise Technique Manual” (przedruk), Mayo Clinic — przy dostępie.
2. **[OTWARTE] Rodzaj źródła „książka”** — jaki `kind` dla fragmentów Human Kinetics (w `CUE_BASIS_KINDS` nie ma „book”). Propozycja: `site`, szczebel 4.
3. **[OTWARTE] Częste błędy** — żaden nie ma 2 niezależnych źródeł:
   - prostowanie nad głową, wyginanie pleców w łuk: wprost mówi o tym tylko Naternicola („Back arches and hips rotate forward”, Fig. 5.27, Misstep).
     ACE #74 mówi ogólnie „bez zmiany pozycji tułowia”, więc wprost jest jedno źródło;
   - wyciąg, prostowanie w dół, bujanie tułowiem: Delavier („avoid any swaying of the torso”), ACE #185 tylko „tułów nieruchomo”;
   - wyciąg, łokcie uciekające do przodu: tylko ACE #185 (wskazówka końcowa); strona ISSA z błędami (exercise-videos) nie ma treści.
     Delavier dopuszcza unoszenie łokci przy powrocie („you can lift your elbows to your chin or nose level”) — to **sprzeczność** z ACE i ISSA
     (łokcie przy bokach) dla tej fazy ruchu. Bez drugiego zgodnego źródła nie wpisuję błędu „łokcie do przodu”;
   - kickback, wyginanie lub skręcanie tułowia: tylko ACE #55 Step 3;
   - maszyna, łokcie odrywane od poduszki i unoszenie barków: tylko Naternicola Fig. 5.28.
4. **[OTWARTE] Machine Triceps Extension — ustawienie** (łokcie na osi obrotu maszyny, plecy przy oparciu): wprost tylko Naternicola Fig. 5.28;
   Hoist podaje jedynie „plecy przy oparciu”. Nie wiadomo też, czy Hoist RS-2103 to ten sam typ maszyny (opis „pressing handles forward”
   nie wspomina poduszki pod ramiona). Dlatego z Hoist biorę tylko zdania ogólne: bez blokowania łokci, płynny powrót.
5. **[OTWARTE] Incline Barbell Triceps Extension i Cable Incline Triceps Extension** — brak źródła o wersji na ławce skośnej. Poprawka z pilotu
   (zamiana `skull.upperArm` → `triOver`) dotyczy zestawu ogólnego; sam zestaw `triOver` także nie jest potwierdzony dla tej wersji.
6. **[OTWARTE] Pozostałe warianty** — brak dwóch przeczytanych źródeł: Reverse Grip Triceps Pushdown (podchwyt), Two-Arm Dumbbell Kickback (bez podparcia),
   Tate Press (jedno źródło: ISSA #5), JM Press, wersje leżąc z wyciągiem / gumą / jednorącz / na ławce ujemnej, Lying Close-Grip … Behind The Head,
   Chain Handle Extension, Band Overhead Triceps Extension. Do sprawdzenia: HKU CSE (`exercises-*-BicepsTriceps.pdf`, 503 w tej sesji), Mayo Clinic (403).
7. **Liczba mnoga w zdaniach dla ćwiczeń jednorącz** (Single Arm Triceps Pushdown, Dumbbell One-Arm, Standing Low-Pulley One-Arm: „łokcie”, „ręce”)
   to sprawa językowa dla recenzenta lokalizacji, nie merytoryczna (w pilocie 02.11.2026 przyjęte z uwagą przy One Arm Chin-Up).
8. **Wpisy „wariant”** (Overhead EZ, Standing Overhead Barbell, Kettlebell Overhead, Kickback (linki), Low-Pulley) opierają się wyłącznie na
   źródłach o innym sprzęcie. Reguła z docs/33 na to pozwala, a zdania są neutralne co do sprzętu („ciężar”, „dłoń”). Recenzent powinien jednak
   sprawdzić, czy żadne zdanie nie przeczy specyfice wariantu (wniosek z pilotu: Decline/Incline/Kneeling/inny sprzęt).

## Stan

- Zrobione: 11 ćwiczeń w bloku JSON (4 pełne, 7 częściowych), 7 nowych zdań PL z propozycją EN, 6 nowych źródeł, 4 nowe organizacje, lista otwartych z powodami.
- Zostało: częste błędy (5.3), Skullcrusher (sztanga) — ustawienie i ruch, warianty na ławce skośnej i ujemnej oraz leżąc z wyciągiem — potrzebne źródła inne niż ExRx.
- Pułapki: zdania `skull.setup`/`skull.move`/`skull.depth` i `ote.setup` dotyczą konkretnego sprzętu („gryf”, „hantel oburącz”) — nie przypisywać
  ich innym wariantom; `skull.upperArm` („pionowo”) tylko na płaskiej ławce.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `docs/research/szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie, uzupełnienia 2 i 3). Kryterium karty (decyzje 02.11.2026): zdanie gotowe = ≥ 2
niezależne organizacje szczebla ≤ 4, przeczytane; karta własna = min. 1 zdanie ustawienia + 1 zdanie ruchu; „z błędami” = + min. 1 błąd; bez ruchu albo bez
ustawienia = otwarta. Kilka stron tej samej organizacji (ace-36/55/74/185; issa-tri-top5 + issa-band-20) = jedno źródło. Źródło o innym sprzęcie liczy się
z dopiskiem „wariant” (metoda tego pliku). Wpisy Skullcrusher (sztanga), Skullcrusher (hantle), Machine Triceps Extension, Standing Low-Pulley One-Arm,
Dumbbell One-Arm, Single Arm Triceps Pushdown i Overhead Triceps Extension (EZ) zastępuje `triceps-2.md` — ich przeliczenie jest tam. Tu: wpisy, które
zostają tylko w tym pliku.

### Źródła → szczebel

| Źródło | Szczebel | Dowód / powód |
|---|---|---|
| ACE (ace-36, ace-55, ace-74, ace-185) | 4 — jedno źródło | precedens ACE (szczeble-organizacji, kryterium pkt 1) |
| ISSA (issa-tri-top5, issa-band-20) | 4 — jedno źródło | szczeble-organizacji, wiersz ISSA; obie strony na blogu ISSA z datą 05.02.2024 (sekcja 4 tego pliku) |
| Human Kinetics — Naternicola (hk-naternicola) | 4 | szczeble-organizacji, wiersz Human Kinetics („ocena autora”). WebFetch 02.11.2026, us.humankinetics.com/products/fitness-steps-to-success: N. L. Naternicola — magister wychowania fizycznego (WVU), „faculty member and master trainer for the American Council on Exercise”; książka ©2015. Strona fragmentu nie podaje kwalifikacji ani daty. Uwaga: autorka jest trenerką ACE — przy parze ACE + Naternicola niezależność organizacyjna (inny wydawca), ale wspólne środowisko szkoleniowe (wątpliwość dla koordynatora) |
| Human Kinetics — Delavier, Gundill (hk-delavier) | 3 (rozstrzygnięcie (a) koordynatora, triceps-2.md „Metoda”) | WebFetch 02.11.2026: strona fragmentu bez kwalifikacji autorów i bez daty; szczebel z rozstrzygnięcia (a), nie z dowodu na stronie |
| Hoist Fitness (hoist-rs2103) | 4 tylko dla maszyny Hoist RS-2103; dla ogólnej „Machine Triceps Extension” — nie liczy się | szczeble-organizacji, wiersz Hoist; sekcja 5 pkt 4 tego pliku: RS-2103 to inny typ maszyny (wypychanie do przodu) |

### Zdania → stan (wpisy tylko z tego pliku)

| Karta | Zdanie | Źródła ≤ 4 po przeliczeniu | Stan |
|---|---|---|---|
| Triceps Kickback | `kick.setup`, `kick.move`, `kick.upperArm`, `press.noLock` | ACE #55 + ISSA | zostaje |
| Triceps Kickback (linki) | `kick.move`, `kick.upperArm`, `press.noLock` | ACE #55 + ISSA (wariant: hantel / guma) | zostaje |
| Standing Overhead Barbell Triceps Extension, Kettlebell Overhead Triceps Extension | `ote.setupLoad`, `ote.moveLoad`, `ote.upperArm`, `press.noLock` | ACE #74 + Naternicola + ISSA (wariant: hantel) | zostaje |
| jw. | `ote.elbowsIn` | ACE #74 + Naternicola (wariant: hantel) | zostaje |
| Machine Triceps Extension (wersja z części 1) | `press.noLock` | Naternicola; Hoist — inny typ maszyny | spada (patrz triceps-2.md) |

### Karty → stan

| Karta | Stan |
|---|---|
| Triceps Kickback | **własna bez błędów** (błędy kickbacku — po jednym źródle ≤ 4, sekcja 5 pkt 3; triceps-2.md sekcja 5 pkt 4) |
| Standing Overhead Barbell Triceps Extension | **własna bez błędów** (wariant; `mis.archBack` z triceps-2.md spada — patrz tamże) |
| Kettlebell Overhead Triceps Extension | **własna bez błędów** (wariant; jw.) |
| Triceps Kickback (linki) | otwarta — brak zdania ustawienia (do fali W2); zdania ruchu i wskazówek gotowe |
| 17 kluczy „otwarte” z sekcji 1 | patrz triceps-2.md (część z nich zmieniła stan w części 2) |

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

Tylko karty, które zostają wyłącznie w tym pliku. Pozostałe karty rodziny — blok w `triceps-2.md`; oba bloki są rozłączne i razem dają komplet rodziny.
Źródła i organizacje: ace-36/55/74, issa-tri-top5, issa-band-20, hk-naternicola (sekcja 4; `kind` = `book`, szczebel 4 — wg przeliczenia wyżej).

```json
{
  "Triceps Kickback": {
    "setup": [{"c": "kick.setup", "s": [["ace-55", "Step 1; Step 2"], ["issa-tri-top5", "#3 Triceps Kickback (knee and palm on bench, lean forward; elbow 90°)"], ["issa-band-20", "Triceps Kickback (neutral spine; arm tight to the side; wariant: guma)"]]}],
    "move": [{"c": "kick.move", "s": [["ace-55", "Step 3; Step 4"], ["issa-tri-top5", "#3 Triceps Kickback"]]}],
    "tips": [
      {"c": "kick.upperArm", "s": [["ace-55", "Step 3 (upper arm stationary next to torso)"], ["issa-tri-top5", "#3 Triceps Kickback (you don't move the upper arm)"]]},
      {"c": "press.noLock", "s": [["ace-55", "Step 3 (until your elbow is fully extended)"], ["issa-tri-top5", "#3 Triceps Kickback (Don't lock the elbow)"]]}
    ],
    "mistakes": []
  },
  "Standing Overhead Barbell Triceps Extension": {
    "setup": [{"c": "ote.setupLoad", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation; Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-74", "wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": []
  },
  "Kettlebell Overhead Triceps Extension": {
    "setup": [{"c": "ote.setupLoad", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation; Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3; wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-74", "wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Movement (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27, Preparation (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": []
  }
}
```
