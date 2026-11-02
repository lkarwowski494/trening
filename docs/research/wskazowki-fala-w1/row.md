# Wskazówki techniki — rodzina `row` (fala W1, G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `row` bez własnych wskazówek — Meadows Row, Seal Row (sztanga), Reverse Grip Bent Over Row,
  Smith Machine Bent Over Row, Bent Over Row (linki), Lying T-Bar Row, Barbell Rear Delt Row.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) — zdanie wchodzi, gdy potwierdzają je ≥ 2 przeczytane (WebFetch, 02.11.2026)
źródła szczebla 4 z różnych organizacji, opisujące TO ćwiczenie (albo wprost jego wariant). Opis innego ćwiczenia (np. zwykłego wiosłowania
sztangą dla wersji na suwnicy Smitha) traktuję jako analogię i nie liczę go. Zdania zestawu ogólnego, których przeczytane źródła nie potwierdzają,
nie trafiają do karty (uzupełnienie briefu koordynatora, 02.11.2026). Liczb (kąty tułowia, tempo, serie) nie wprowadzam — źródła się w nich różnią.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Meadows Row | general (rowBent) | gotowe | 3 niezależne źródła; kąt pochylenia różny (ok. 45° vs prawie poziomo) — pominięty |
| Seal Row (sztanga) | general (row) | gotowe (krótka karta) | brak ≥ 2 źródeł na błędy; szerokość chwytu tylko w 1 źródle |
| Reverse Grip Bent Over Row | general (rowBent) | gotowe | 2 źródła wprost o podchwycie; kąt tułowia różny (45° vs prawie poziomo) — pominięty |
| Smith Machine Bent Over Row | general (rowBent) | gotowe | 3 źródła (2 producentów sprzętu + serwis); wysokość gryfu: część wspólna „na wysokości ud” |
| Bent Over Row (linki) | general (rowBent) | otwarte | tylko 1 przeczytane źródło (wariant naprzemienny jednorącz); reszta wyników to aplikacje |
| Lying T-Bar Row | general (row) | gotowe | 2 źródła o wersji z podparciem klatki na maszynie |
| Barbell Rear Delt Row | general (rowBent) | gotowe (krótka karta) | 2 źródła; kąt tułowia różny (30–45° vs prawie poziomo) — pominięty |

## 2. Blok JSON do `exercises` w `data/zrodla/cues.json`

```json
{
  "Meadows Row": {
    "setup": [
      {"c": "meadows.setup", "s": [["sole-meadows-row", "Equipment Setup; Starting Position 1 (stand sideways, inside foot forward)"], ["athleanx-meadows-row", "How to do Meadows Rows — Setup; Stance (leg nearest the bar forward)"]]},
      {"c": "meadows.grip", "s": [["sole-meadows-row", "Starting Position 2–4 (hinge, grip the loaded sleeve, other hand on front thigh)"], ["athleanx-meadows-row", "How to — Hinge; Grip (sleeve, free hand on front thigh)"], ["generationiron-meadows-row", "Meadows Row Techniques — grip end of the bar overhand, forearm on front leg"]]}
    ],
    "move": [
      {"c": "meadows.pull", "s": [["sole-meadows-row", "Execution Steps 1, 3 (elbow up and back to the hip; lower slowly)"], ["athleanx-meadows-row", "How to — Pull path; Return (toward the hip; lower under control)"], ["generationiron-meadows-row", "Meadows Row Techniques (pull toward back hip; slowly lower)"]]}
    ],
    "tips": [
      {"c": "meadows.noTwist", "s": [["sole-meadows-row", "Form Tips and Common Mistakes (keep your body still, no rocking or twisting)"], ["athleanx-meadows-row", "How to — Top (keep torso still, don't twist); Common Mistakes — Over-rotating the torso"]]},
      {"c": "row.fullStretch", "s": [["sole-meadows-row", "Execution Steps 3 (arm fully straighten)"], ["athleanx-meadows-row", "Common Mistakes — Cutting the bottom stretch short"], ["generationiron-meadows-row", "Meadows Row Techniques (lower until elbow is straight)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["sole-meadows-row", "Form Tips and Common Mistakes (rocking or twisting)"], ["athleanx-meadows-row", "Common Mistakes — Over-rotating the torso (momentum pull)"], ["generationiron-meadows-row", "uwaga po krokach (momentum, keep it controlled)"]]}
    ]
  },
  "Seal Row (sztanga)": {
    "setup": [
      {"c": "seal.setup", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (bench on boxes/plates, lie face down, overhand grip)"], ["bellsofsteel-seal-row", "wersja z ławką (bench on sturdy objects, lie under it, overhand grip)"], ["kensui-seal-rows", "Traditional Set-up: Barbells; How to set up"]]}
    ],
    "move": [
      {"c": "seal.pull", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (pull toward lower ribs, bar touches the bench; lower slowly)"], ["bellsofsteel-seal-row", "wersja z ławką (pull toward your torso; lower in a controlled way)"]]}
    ],
    "tips": [
      {"c": "row.pauseTop", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (pause at the top)"], ["bellsofsteel-seal-row", "wersja z ławką (pause briefly at the top)"]]}
    ],
    "mistakes": []
  },
  "Reverse Grip Bent Over Row": {
    "setup": [
      {"c": "row.hinge", "s": [["breakingmuscle-reverse-grip-row", "Step 2 (hinge at the hips, knees slightly bent, neutral spine)"], ["fitnessvolt-reverse-grip-row", "Hinge and Torso 3–4 (hinge, back straight, knees slightly bent)"]]},
      {"c": "row.revGrip", "s": [["breakingmuscle-reverse-grip-row", "Step 1 (underhand, slightly wider than shoulder-width)"], ["fitnessvolt-reverse-grip-row", "Setup and Grip 2 (underhand, about shoulder-width)"]]}
    ],
    "move": [
      {"c": "row.bbPullCtrl", "s": [["breakingmuscle-reverse-grip-row", "Step 3–4 (toward the belly button; lower under control)"], ["fitnessvolt-reverse-grip-row", "Pull Path 6; Return 8 (toward lower ribcage; lower under control) — część wspólna: brzuch"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["breakingmuscle-reverse-grip-row", "Step 2; Step 4 (neutral spine, flat back)"], ["fitnessvolt-reverse-grip-row", "Hinge and Torso 4 (back straight)"]]},
      {"c": "row.pauseTop", "s": [["breakingmuscle-reverse-grip-row", "Step 4 (hold briefly at the top)"], ["fitnessvolt-reverse-grip-row", "Pull Path 7 (pause briefly at the top)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["breakingmuscle-reverse-grip-row", "Common Mistakes — Rounded lower back"], ["fitnessvolt-reverse-grip-row", "Common Mistakes — Rounding the back"]]},
      {"c": "mis.jerk", "s": [["breakingmuscle-reverse-grip-row", "Common Mistakes — Using momentum"], ["fitnessvolt-reverse-grip-row", "Common Mistakes — Using momentum (jerking or swinging)"]]}
    ]
  },
  "Smith Machine Bent Over Row": {
    "setup": [
      {"c": "smith.rowSetup", "s": [["majorfitness-smith-row", "How to 1–2 (bar around upper thigh; feet about shoulder-width)"], ["ritfit-smith-row", "How-to Steps 1–2 (bar about mid-thigh; feet hip to shoulder width)"], ["generationiron-smith-row", "Steps 1–2 (just below waist height; feet shoulder-width)"]]},
      {"c": "row.bbGrip", "s": [["majorfitness-smith-row", "How to 3 (overhand, shoulder-width or slightly wider)"], ["ritfit-smith-row", "How-to Steps 3 (pronated, a bit wider than shoulder width)"], ["generationiron-smith-row", "Steps 3 (slightly wider than shoulder width, overhand or underhand)"]]},
      {"c": "row.hinge", "s": [["ritfit-smith-row", "How-to Steps 5 (hips back, soft knee bend, no rounding)"], ["generationiron-smith-row", "Steps 4 (hinge at the hips, slight knee bend, spine neutral)"]]}
    ],
    "move": [
      {"c": "row.bbPullCtrl", "s": [["ritfit-smith-row", "How-to Steps 7–8 (lower ribs or upper waist; lower under control)"], ["generationiron-smith-row", "Steps 6–7 (toward your navel; return slowly with control)"], ["majorfitness-smith-row", "How to 5–6 (toward the torso; lower under control)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["majorfitness-smith-row", "How to 7 (same neutral spine every rep)"], ["ritfit-smith-row", "How-to Steps 5 (without rounding your back)"], ["generationiron-smith-row", "Steps 4 (spine neutral)"]]},
      {"c": "row.elbowsLead", "s": [["majorfitness-smith-row", "How to 5 (lead with your elbows, not your hands); Common Mistakes — Pulling with your arms"], ["ritfit-smith-row", "How-to Steps 7 (drive elbows back rather than curling with your hands)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["majorfitness-smith-row", "Common Mistakes — Rounded lower back"], ["ritfit-smith-row", "Common Mistakes 2 — Rounding the low back"], ["generationiron-smith-row", "form cautions (losing a neutral spine)"]]},
      {"c": "mis.jerk", "s": [["ritfit-smith-row", "Common Mistakes 6 — Using momentum"], ["generationiron-smith-row", "form cautions (jerking the bar, momentum)"]]}
    ]
  },
  "Lying T-Bar Row": {
    "setup": [
      {"c": "ltbar.setup", "s": [["fitnessvolt-cs-tbar-row", "1. Setup; 2. Grip (feet on the platform; overhand grip)"], ["generationiron-cs-tbar-row", "Setup 1; Grip 3 (feet on the platform; pronated grip)"]]},
      {"c": "csr.chest", "s": [["fitnessvolt-cs-tbar-row", "1. Setup (press your chest firmly against the pad)"], ["generationiron-cs-tbar-row", "Setup 2; Common Mistakes — Losing position (chest off the pad)"]]}
    ],
    "move": [
      {"c": "tbar.pull", "s": [["fitnessvolt-cs-tbar-row", "2.–4. (start with arms fully extended; elbows back past torso; lower slowly)"], ["generationiron-cs-tbar-row", "Pull 4; Return 6 (toward the chest; extend elbows to lower)"]]}
    ],
    "tips": [
      {"c": "row.pauseTop", "s": [["fitnessvolt-cs-tbar-row", "3. Pull (hold the top position)"], ["generationiron-cs-tbar-row", "Pull 5 (pause and squeeze)"]]},
      {"c": "row.slowDown", "s": [["fitnessvolt-cs-tbar-row", "4. Return (lower slowly and under control)"], ["generationiron-cs-tbar-row", "Return 6 (lower slowly, don't let it drop)"]]}
    ],
    "mistakes": []
  },
  "Barbell Rear Delt Row": {
    "setup": [
      {"c": "rdrow.setup", "s": [["dumbbellsdirect-rear-delt-row", "How-To — Grip; Hinge & Torso (wider than shoulders; hinge at the hips)"], ["generationiron-rear-delt-row", "1. Grip; 2. Hinge and Torso (overhand, wider than shoulders; hinge forward)"]]}
    ],
    "move": [
      {"c": "rdrow.pull", "s": [["dumbbellsdirect-rear-delt-row", "Pull Path & Elbows; Return (elbows flared wide, toward upper chest; lower slowly)"], ["generationiron-rear-delt-row", "3. Elbows; 4. Pull Path; 6. Return (elbows out, toward upper chest; lower slowly)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Uwaga dla integracji: w Meadows Row źródło `generationiron-meadows-row` nie potwierdza nogi z przodu — `meadows.setup` opiera się na 2 źródłach
(Sole, Athlean-X), które zgodnie wskazują nogę bliżej gryfu z przodu.

## 3. Nowe źródła (wszystkie przeczytane WebFetch 02.11.2026)

| id | org | tytuł | url | szczebel |
|---|---|---|---|---|
| sole-meadows-row | Sole Fitness | Meadows Row Workout: Ultimate Guide | https://www.soletreadmills.com/blogs/news/meadows-row-workout-ultimate-guide-with-benefits-proper-form-tips-muscles-worked | 4 |
| athleanx-meadows-row | ATHLEAN-X | How to Do the Meadows Row | https://learn.athleanx.com/articles/back-for-men/how-to-do-the-meadows-row | 4 |
| generationiron-meadows-row | Generation Iron | Meadows Row Exercise Guide | https://generationiron.com/meadows-row-exercise-guide/ | 4 |
| fitnessvolt-seal-row | Fitness Volt | Seal Row | https://fitnessvolt.com/seal-row/ | 4 |
| bellsofsteel-seal-row | Bells of Steel | How To Do Seal Rows at Home | https://bellsofsteel.us/blogs/content/how-to-do-seal-rows-at-home | 4 |
| kensui-seal-rows | Kensui Fitness | Seal Rows | https://kensui.com/blogs/news/seal-rows | 4 |
| breakingmuscle-reverse-grip-row | Breaking Muscle (istnieje) | Reverse-Grip Bent-Over Row | https://breakingmuscle.com/reverse-grip-bent-over-row/ | 4 |
| fitnessvolt-reverse-grip-row | Fitness Volt | Barbell Reverse-Grip Bent-Over Row | https://fitnessvolt.com/barbell-reverse-grip-bent-over-row-guide/ | 4 |
| majorfitness-smith-row | Major Fitness | How to Do Bent Over Rows on Smith Machine | https://www.majorfitness.com/blogs/wiki/how-to-do-bent-over-rows-on-smith-machine-a-step-by-step-guide | 4 |
| ritfit-smith-row | RitFit | How to Do the Smith Machine Bent Over Row | https://www.ritfitsports.com/blogs/article/how-to-do-the-smith-machine-bent-over-row | 4 |
| generationiron-smith-row | Generation Iron | Smith Machine Row Exercise Guide | https://generationiron.com/smith-machine-row-exercise-guide/ | 4 |
| fitnessvolt-cs-tbar-row | Fitness Volt | Chest-Supported T-Bar Row | https://fitnessvolt.com/chest-supported-t-bar-row-guide/ | 4 |
| generationiron-cs-tbar-row | Generation Iron | Chest Supported T-Bar Row | https://generationiron.com/chest-supported-t-bar-row/ | 4 |
| dumbbellsdirect-rear-delt-row | Dumbbells Direct | Barbell Rear Delt Row | https://dumbbellsdirect.com/blogs/barbell-exercisesspecific-movements/barbell-rear-delt-row | 4 |
| generationiron-rear-delt-row | Generation Iron | Barbell Rear Delt Row Exercise Guide | https://generationiron.com/barbell-rear-delt-row-exercise-guide/ | 4 |
| eisenhorn-alt-cable-bent-row | Eisenhorn | 225 Alternating bent-over rowing with cable pull | https://eisenhorn.com/en/eisenhorn-exercises/225-alternating-bent-over-rowing-with-cable-pull | 4 (tylko w „Otwarte”) |

Nowe organizacje (propozycja szczebla 4):

| org | kind | uzasadnienie |
|---|---|---|
| Fitness Volt | site | serwis specjalistyczny, przewodniki techniki ćwiczeń |
| Generation Iron | site | serwis specjalistyczny (kulturystyka), przewodniki ćwiczeń |
| ATHLEAN-X | site | serwis trenera-fizjoterapeuty; przewodniki techniki (do decyzji koordynatora: szczebel 4 albo 5) |
| Sole Fitness | maker | producent sprzętu (bieżnie, siłownia domowa) — poradnik |
| Bells of Steel | maker | producent sprzętu siłowego — poradnik |
| Kensui Fitness | maker | producent sprzętu siłowego — poradnik |
| Major Fitness | maker | producent sprzętu (suwnice Smitha, klatki) — poradnik |
| RitFit | maker | producent sprzętu (suwnice Smitha) — poradnik |
| Dumbbells Direct | maker | sprzedawca sprzętu siłowego — poradnik (do decyzji: sprzedawca, nie producent) |
| Eisenhorn | maker | producent sprzętu — opis ćwiczenia |

Przeczytane, NIE liczone:
- Set For Set „Meadows Rows” (setforset.com) — marka odzieżowa; tekst kroków niemal identyczny z Generation Iron (brak niezależności).
- REP Fitness „How to do a Landmine Row” — o Meadows Row tylko jedno zdanie w „Landmine Row Variations” (wiosłowanie jednorącz, ciało pod kątem do gryfu); za mało na zdanie.

Niedostępne 02.11.2026 (nie są źródłami): exrx.net (403, także `WeightExercises/BackGeneral/SMBentOverRow`), muscleandstrength.com (403),
powerliftingtechnique.com (403), library.theprehabguys.com (przekierowanie do logowania), t3.com (treść artykułu nie wczytana),
bodybuilding.com/exercises (przekierowanie do sklepu, 404), barbend.com/meadows-row (404), bodysolid.com Exercises/Article/25 (strona o konserwacji, nie ćwiczenie).
Strony innych aplikacji treningowych z wyników wyszukiwania pominięte (uzupełnienie briefu, 02.11.2026).

## 4. Nowe zdania

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| meadows.setup | Jeden koniec gryfu w uchwycie do wiosłowania albo w rogu. Stań bokiem do gryfu w wykroku, noga bliżej gryfu z przodu. | One end of the bar in a landmine or a corner. Stand side-on to the bar in a split stance, leg nearer the bar in front. | Sole, Athlean-X |
| meadows.grip | Pochyl tułów w biodrach, chwyć gryf za końcówkę przy talerzach, wolną rękę oprzyj o udo z przodu. | Hinge at the hips, grab the bar by the loaded sleeve and rest your free hand on your front thigh. | Sole, Athlean-X, Generation Iron |
| meadows.pull | Ciągnij łokieć w tył, prowadząc gryf w stronę biodra; opuść powoli do wyprostu ręki. | Drive your elbow back and pull the bar toward your hip; lower slowly until your arm is straight. | Sole, Athlean-X, Generation Iron |
| meadows.noTwist | Tułów nieruchomo — nie skręcaj go, żeby pomóc sobie rozpędem. | Keep your torso still — don't twist to get momentum. | Sole, Athlean-X |
| seal.setup | Ustaw ławkę wyżej na stabilnych podporach, połóż się na niej przodem i chwyć sztangę pod ławką nachwytem. | Raise the bench on stable supports, lie face down on it and grab the bar below with an overhand grip. | Fitness Volt, Bells of Steel, Kensui |
| seal.pull | Przyciągnij sztangę w stronę ławki, potem opuść ją powoli. | Pull the bar up toward the bench, then lower it slowly. | Fitness Volt, Bells of Steel |
| row.pauseTop | Na górze zatrzymaj się na chwilę. | Pause briefly at the top. | Seal: FV, BoS; Reverse: BM, FV; Lying T-Bar: FV, GI |
| row.revGrip | Chwyć sztangę podchwytem, mniej więcej na szerokość barków. | Grab the bar with an underhand grip, about shoulder-width. | Breaking Muscle, Fitness Volt |
| row.bbPullCtrl | Przyciągnij sztangę do brzucha, potem opuść ją pod kontrolą. | Pull the bar to your stomach, then lower it under control. | Reverse: BM, FV; Smith: RitFit, GI, Major |
| smith.rowSetup | Ustaw gryf na wysokości ud i stań przed nim, stopy mniej więcej na szerokość barków. | Set the bar at thigh height and stand in front of it, feet about shoulder-width apart. | Major Fitness, RitFit, Generation Iron (część wspólna wysokości: od połowy uda do tuż pod pasem) |
| row.elbowsLead | Ciągnij łokciami, nie dłońmi. | Lead with your elbows, not your hands. | Major Fitness, RitFit |
| ltbar.setup | Stopy na podeście, chwyć uchwyty nachwytem. | Feet on the platform, grab the handles with an overhand grip. | Fitness Volt, Generation Iron |
| row.slowDown | Opuszczaj ciężar powoli, nie pozwól mu opaść. | Lower the weight slowly — don't let it drop. | Fitness Volt, Generation Iron |
| rdrow.setup | Chwyć sztangę nachwytem, wyraźnie szerzej niż barki, i pochyl tułów w biodrach. | Grab the bar overhand, well wider than your shoulders, and hinge at the hips. | Dumbbells Direct, Generation Iron |
| rdrow.pull | Łokcie szeroko na boki; przyciągnij sztangę do górnej części klatki, potem opuść ją powoli. | Elbows flared wide; pull the bar to your upper chest, then lower it slowly. | Dumbbells Direct, Generation Iron |

Istniejące zdania użyte: `row.hinge`, `row.bbGrip`, `row.fullStretch`, `hinge.back`, `csr.chest`, `tbar.pull`, `mis.roundBack`, `mis.jerk`.
Każde nowe zdanie trzeba dodać do `lib/cues/text/pl.json` i `en.json` oraz do rejestru twierdzeń (`node scripts/claims.mjs --stub`), jeśli `check:claims` je rozpozna.
Nazwa „landmine” w `meadows.setup` po polsku oddana opisowo („uchwyt do wiosłowania”) — do sprawdzenia przez tłumacza ze słownikiem terminów.

## 5. Otwarte

- **Bent Over Row (linki)** — [OTWARTE]: przeczytane tylko 1 źródło spoza aplikacji (Eisenhorn, wariant naprzemienny jednorącz z linkami:
  pochylenie w biodrach, ciągnięcie w stronę biodra, kontrola bez rozpędu). Drugie wyszukiwanie dało wyłącznie strony aplikacji (wykluczone)
  oraz Body-Solid (strona o konserwacji). Do czasu drugiego źródła zostaje zestaw ogólny albo tryb „open”.
- **Zestaw ogólny `rowBent` / `row` a przeczytane źródła** (informacja o zestawach): zdanie `row.fullStretch` („ręce do końca, barki w dół”)
  nie ma potwierdzenia dla Smitha, Seal Row ani Rear Delt Row (źródła mówią tylko „opuść pod kontrolą/powoli”); `row.bbGrip` („na szerokość barków lub
  szerzej”) nie pasuje do Reverse Grip (podchwyt) ani do Rear Delt Row (wyraźnie szerzej). `hinge.back` dla Rear Delt Row potwierdza tylko Generation Iron
  (naturalne wygięcie odcinka lędźwiowego) — Dumbbells Direct mówi tylko o napięciu brzucha, więc pominięte.
- **Kąt pochylenia tułowia** — źródła się różnią: Meadows (Sole ok. 45° vs Athlean-X prawie poziomo), Reverse Grip (Breaking Muscle ok. 45° vs Fitness Volt
  prawie poziomo), Rear Delt (Dumbbells Direct 30–45° vs Generation Iron prawie poziomo). Nie wprowadzam liczby; ewentualna część wspólna wymagałaby
  przedziału, a to liczba techniki — reguła „przedziały kątów: 2 zgodne źródła i żadne nie przeczy” nie jest spełniona.
- **Błędy dla Seal Row, Lying T-Bar Row, Rear Delt Row** — przeczytane źródła wymieniają różne błędy (np. unoszenie głowy, łokcie przy tułowiu w Rear Delt
  vs chwyt podchwytem), żaden nie ma 2 zgodnych źródeł.
- **Meadows Row — wzruszanie barkami** (Athlean-X, Set For Set) — Set For Set nie jest niezależny od Generation Iron i to marka odzieżowa; zostaje jedno źródło.
- **Smith — odblokowanie gryfu obrotem nadgarstków** (Major Fitness „twist”, Generation Iron „unlatch”) — zgodne, ale pominięte dla zwięzłości karty; można dodać zdanie `smith.unrack`.
- **ATHLEAN-X i Dumbbells Direct** — szczebel do potwierdzenia przez koordynatora (serwis trenera / sprzedawca). Gdyby uznać je za szczebel 5, tracą
  komplet: Meadows `meadows.setup` i `meadows.noTwist` (zostaje po 1 źródle) oraz cała karta Rear Delt Row.

## 6. Stan

Rodzina `row`: zakończona (6 gotowych, 1 otwarte). Plik `cable_row.md` — osobno.
