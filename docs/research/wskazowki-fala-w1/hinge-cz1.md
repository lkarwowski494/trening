# Wskazówki techniki — rodzina `hinge`, część 1

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 2 (02.11.2026)

Zastosowano ROZSTRZYGNIĘCIE 2 koordynatora linii 1.1 (02.11.2026 ~07:55). Autorzy stron sprawdzeni WebFetch 02.11.2026 (bez nowych źródeł;
ponownie czytane tylko strony już w pliku).

- **Physitrack → 5** (`physitrack-stiff-leg-deadlift`; pytanie z sekcji 4 o „dokumentację innej aplikacji” zamknięte).
- **Coach — szczebel per artykuł** (warunkowo 4 tylko z autorem z kwalifikacjami):
  - `coach-single-leg-romanian-deadlift` — autor Sam Rider, w biogramie „REPS level 3 qualified personal trainer”, akt. 11.04.2024 → **4**.
  - `coach-stiff-leg-deadlift` — autor Sam Rider (jw.), akt. 29.01.2024 → **4**.
  - `coach-cable-machine-exercises` — autor Nick Harris-Fry, biogram: dziennikarz, bez kwalifikacji trenerskich (wybór ćwiczeń przypisany cytowanemu trenerowi, nie autorowi tekstu), 19.04.2021 → **5**.
  - `coach-good-morning` — autor Nick Harris-Fry (jw.), 17.10.2018, bez cytowanego eksperta → **5**.
  - `coach-rack-pull` — autor Harry Bullmore, „Staff writer”, bez kwalifikacji (cytowany trener NSCA nie jest autorem), akt. 27.01.2023 → **5**.
- Skutki dla ćwiczeń:
  - **Stiff-Legged Barbell Deadlift: gotowe → otwarte.** Bez Physitrack każde zdanie ustawienia, ruchu i błędów ma tylko Coach;
    BarBend (`barbend-stiff-leg-deadlift`, ponownie przeczytany) nie ma kroków ani błędów — jedynie „minimizes nearly all knee flexion”.
    Zostaje 1 zdanie z 2 źródłami (`rdl.knees`: Coach + BarBend). Usunięty z bloku JSON cały wpis — 6 zdań (`sldl.setup`, `sldl.move`,
    `rdl.knees`, `hinge.back`, `mis.roundBack`, `rdl.mis.knees`). Dane częściowe w sekcji 2b.
  - **Band Good Morning: gotowe → otwarte.** Coach = 5, zostaje tylko Set For Set. Usunięty z bloku JSON cały wpis — 5 zdań
    (`gmBand.setup`, `gm.move`, `hinge.back`, `rdl.knees`, `gm.mis.head`). Dane częściowe w sekcji 2b.
  - **Cable Pull Through: gotowe bez zmiany wyniku**, ale `pt.setup` traci Coach (5); drugie źródło — Speediance Step 1 (ponownie
    przeczytany: „Attach a rope handle to the low pulley… Stand facing away from the machine”; Step 2: lina między nogami) + BarBend
    („lowest setting”; „through your legs”; wariant z gumą „facing away from its anchor”, ten sam układ co wyciąg). `pt.move` traci Coach
    (zostaje BarBend + Speediance). Zmienione brzmienie `pt.setup` na część wspólną: „nisko ustawiony wyciąg” (BarBend: najniżej;
    Speediance: dolny wyciąg, ok. wysokość kolan). **Dodany błąd** `mis.roundBack` wg nowej reguły błędów: Speediance nazywa błąd
    wprost („Rounding the Back”, ponownie przeczytane) + BarBend `cable-pull-through` Step 3 podaje standard „keeping your back flat” —
    **błąd = zaprzeczenie standardu**.
  - **Rack Pull: nadal otwarte**; po korekcie Coach = 5 — dane częściowe mają już tylko BarBend.
  - **Single Leg RDL (hantel), (linki): bez zmian, gotowe** (Coach z autorem-trenerem = 4).
- Reguła błędów: `slrdl.mis.hipOpen` i `mis.roundBack` przy Single Leg RDL — oba źródła nazywają błąd wprost (bez oznaczenia).
  `mis.roundBack` przy Cable Pull Through — oznaczony „błąd = zaprzeczenie standardu”. `rdl.mis.knees` przy SLDL — po utracie
  Physitrack oba pozostałe źródła podają tylko standard (nikt nie nazywa błędu) → wypada. `gm.mis.waist` (Good Morning off Pins,
  dane warunkowe) — oznaczony „błąd = zaprzeczenie standardu”.
- NSCA — w pliku nie występuje (tylko nieprzeczytany kandydat przy Good Morning off Pins).
- Wynik: gotowe **5 → 3** (Single Leg RDL (hantel), Single Leg RDL (linki), Cable Pull Through); otwarte 6 → 8.

Metoda jak w `docs/research/33-wskazowki-partia2.md`: każde zdanie przy konkretnym ćwiczeniu ma ≥ 2 przeczytane źródła
szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki, CLAUDE.md, 25.10.2026). Źródło o tym samym ćwiczeniu z innym
obciążeniem (sztanga/hantel/linka/guma) liczone jako „(wariant: …)”. Bez liczb i bez uzasadnień zdrowotnych. Zdania z zestawu
ogólnego (`lib/figures/v2/cue-sets.json`), których przeczytane źródła danego ćwiczenia nie potwierdzają, nie trafiają do karty —
lista w sekcji „Otwarte” (uzupełnienie briefu koordynatora, 02.11.2026). Strony innych aplikacji pomijane.

**Korekta po rozstrzygnięciu koordynatora o szczeblach (02.11.2026, druga sesja):** Breaking Muscle = szczebel 5 i nigdy niezależne
od BarBend; producenci tylko dla własnego sprzętu; sprzedawcy i blogi marketingowe = 5. Ocena organizacji tego pliku — tabela w
sekcji 4a. Skutki: Rack Pull, Sumo Deadlift (kettlebell) i Deficit Deadlift przechodzą do „otwarte”; z Cable Pull Through usunięty
błąd `ht.mis.arch` (zostało jedno źródło), a `hinge.back` dostał drugie źródło; z Stiff-Legged Barbell Deadlift usunięte odwołania do
Breaking Muscle; Smith SLDL traci jedyne źródło (Gym Mikolo = 5).
Zmieniony tekst proponowanego zdania `rack.setup` (część wspólna bez Breaking Muscle).

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Rack Pull | otwarte | po korekcie 2: Coach = 5 (autor bez kwalifikacji); zostaje tylko BarBend. Titan = 5 |
| Single Leg RDL (hantel) | gotowe | ACE (hantel) + Coach (autor PT, 4) + BarBend (warianty: sztanga/hantel/kettlebell) |
| Single Leg RDL (linki) | gotowe | ACE (linka, wprost) + Coach + BarBend (wariant: wolne ciężary) |
| Cable Pull Through | gotowe | BarBend (2 artykuły — jedna organizacja), Speediance (producent wyciągów); Coach = 5 po korekcie 2; 2 wskazówki + 1 błąd (błąd = zaprzeczenie standardu) |
| Sumo Deadlift (kettlebell) | otwarte | Onnit jedyne źródło szczebla 4 (Titan, Gym Reapers — 5, sekcja 4a) |
| Single Arm RDL (hantel/linka) | otwarte | nadal brak źródła o wersji obunóż z ciężarem w jednej ręce |
| Deficit Deadlift | otwarte | BarBend + Breaking Muscle = jedno źródło |
| Stiff-Legged Barbell Deadlift | otwarte (korekta 2) | Physitrack = 5; Coach (4) + BarBend (4, tylko zdanie o kolanach) — dane częściowe 2b |
| Good Morning off Pins | otwarte | EliteFTS (4) + strona Jima Stoppaniego (szczebel do oceny koordynatora — sekcja 4a); dane warunkowe (sekcja 2a) |
| Band Good Morning | otwarte (korekta 2) | Coach = 5 (autor bez kwalifikacji); zostaje Set For Set — dane częściowe 2b |
| Smith Machine Stiff-Legged Deadlift | otwarte | brak źródła szczebla 4 (Gym Mikolo = 5) |

## 2. Wpisy do `cues.json` → `exercises`

```json
{
  "Single Leg RDL (hantel)": {
    "setup": [
      {"c": "slrdl.setup", "s": [["ace-127", "instrukcja (balance on the left leg… keep the left knee slightly bent)"], ["barbend-single-leg-romanian-deadlift", "Step 1: Stand on One Leg (wariant: dowolne obciążenie)"]]}
    ],
    "move": [
      {"c": "slrdl.move", "s": [["ace-127", "instrukcja (leaning forward on the left hip… straighten the right leg; stand up)"], ["coach-single-leg-romanian-deadlift", "The Hinge; The Return (wariant: sztanga, hantel)"], ["barbend-single-leg-romanian-deadlift", "Step 2: Push Your Hips Back; Step 3"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["ace-127", "instrukcja (the back straight)"], ["coach-single-leg-romanian-deadlift", "The Hinge (keeping your back flat)"], ["barbend-single-leg-romanian-deadlift", "Step 3 (keep the back flat)"]]}
    ],
    "mistakes": [
      {"c": "slrdl.mis.hipOpen", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rotating Your Hips"], ["barbend-single-leg-romanian-deadlift", "Step 2 (not allow the hip to rotate upwards); Form tips (hips staying even)"]]},
      {"c": "mis.roundBack", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rounding Your Back"], ["barbend-single-leg-romanian-deadlift", "Form tips, Step 2 (lower back rounds)"]]}
    ]
  },
  "Single Leg RDL (linki)": {
    "setup": [
      {"c": "slrdl.setup", "s": [["ace-350", "instrukcja (balancing body weight on the right leg… slight bend in the right knee)"], ["barbend-single-leg-romanian-deadlift", "Step 1 (wariant: wolne ciężary)"]]}
    ],
    "move": [
      {"c": "slrdl.move", "s": [["ace-350", "instrukcja (hinging forward on the right hip; stand up… lowering the left leg)"], ["coach-single-leg-romanian-deadlift", "The Hinge; The Return (wariant: sztanga, hantel)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["ace-350", "instrukcja (the back straight)"], ["coach-single-leg-romanian-deadlift", "The Hinge (wariant)"], ["barbend-single-leg-romanian-deadlift", "Step 3 (wariant)"]]}
    ],
    "mistakes": [
      {"c": "slrdl.mis.hipOpen", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rotating Your Hips (wariant)"], ["barbend-single-leg-romanian-deadlift", "Step 2; Form tips (wariant)"]]},
      {"c": "mis.roundBack", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rounding Your Back (wariant)"], ["barbend-single-leg-romanian-deadlift", "Form tips, Step 2 (wariant)"]]}
    ]
  },
  "Cable Pull Through": {
    "setup": [
      {"c": "pt.setup", "s": [["speediance-cable-pull-through", "Step 1 (rope handle to the low pulley; stand facing away from the machine); Step 2 (rope passes between your legs)"], ["barbend-cable-pull-through-vs-hip-thrust", "How to Do the Cable Pull-Through (lowest setting, rope attachment; rope through your legs; wariant z gumą: facing away from its anchor, ten sam układ)"]]}
    ],
    "move": [
      {"c": "pt.move", "s": [["barbend-cable-pull-through-vs-hip-thrust", "How-to (drive your butt back and hinge… extend your hips fully… squeeze your glutes)"], ["speediance-cable-pull-through", "Step 2; Step 3"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["speediance-cable-pull-through", "Step 2 (back straight… neutral spine)"], ["barbend-cable-pull-through", "Step 3 (keeping your back flat; strona: te same kroki z gumą i z wyciągiem)"]]},
      {"c": "rdl.knees", "s": [["speediance-cable-pull-through", "Step 2; Common Mistakes: Poor hip hinge and knee bend (rather than squatting down)"], ["barbend-cable-pull-through-vs-hip-thrust", "How-to (bend your knees slightly)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["speediance-cable-pull-through", "Common Mistakes: Rounding the Back"], ["barbend-cable-pull-through", "Step 3 (keeping your back flat) — błąd = zaprzeczenie standardu"]]}
    ]
  }
}
```

### 2a. Dane warunkowe (do włączenia dopiero po rozstrzygnięciu szczebla — sekcja 5)

Good Morning off Pins — gotowe, jeśli strona Jima Stoppaniego zostanie uznana za szczebel 4:

```json
{
  "Good Morning off Pins": {
    "setup": [
      {"c": "gmPins.setup", "s": [["elitefts-low-pin-goodmorning", "opis (set your pins at about hip joint level)"], ["stoppani-good-morning", "Safety pins (set the safety pins… bottom position of the good morning — somewhere around hip height)"]]}
    ],
    "move": [
      {"c": "gmPins.move", "s": [["elitefts-low-pin-goodmorning", "opis (reach your hips back… until the bar is on the pins; pause; drive your shoulders into the bar)"], ["stoppani-good-morning", "How to (push the glutes back; bar touches the safety bars; pause briefly, then reverse)"]]}
    ],
    "tips": [
      {"c": "gm.noRound", "s": [["elitefts-low-pin-goodmorning", "opis (keep your back arched)"], ["stoppani-good-morning", "Back position (lower back arched); Mistakes (wide grip lets the back round)"]]}
    ],
    "mistakes": [
      {"c": "gm.mis.waist", "s": [["stoppani-good-morning", "Mistakes (bending at the waist instead of hinging at the hips)"], ["elitefts-low-pin-goodmorning", "opis (reach your hips back) — błąd = zaprzeczenie standardu"]]}
    ]
  }
}
```

Uwaga (korekta 2): przy `gm.mis.waist` EliteFTS podaje tylko standard („cofnij biodra”). Wg reguły błędów z ROZSTRZYGNIĘCIA 2 liczy
się jako drugie źródło, bo „zginanie w pasie zamiast cofania bioder” jest bezpośrednim zaprzeczeniem „cofnij biodra” — oznaczenie
**„błąd = zaprzeczenie standardu”**. Przy uznaniu Stoppaniego za 4 karta ma wskazówki + błędy = 2. Całość nadal zależy od oceny
Stoppaniego (wg (a) raczej 5).

### 2b. Dane częściowe (ćwiczenia otwarte po korekcie 2 — nie do `cues.json`)

- **Stiff-Legged Barbell Deadlift** — źródła szczebla 4: `coach-stiff-leg-deadlift` (Sam Rider, PT), `barbend-stiff-leg-deadlift`
  (Mike Dewar, CSCS; tylko zdanie o kolanach). Z 2 źródłami zostaje tylko `rdl.knees`: Coach (How-to: knees — „slightly bent, knees
  fixed”) + BarBend („minimizes nearly all knee flexion throughout the movement”) — zgodne kierunkowo (kolana prawie nie pracują).
  Jednym źródłem szczebla 4 (Coach): `sldl.setup`, `sldl.move`, `hinge.back`; `mis.roundBack` — Coach podaje standard („if your back
  starts to round, reduce how far the bar travels”), nikt poza Physitrack nie nazywa błędu. `rdl.mis.knees`: Coach i BarBend podają tylko
  standard, żadne nie nazywa błędu → bez zdania. Physitrack (5) potwierdzał wszystkie te zdania — nie liczy się.
- **Band Good Morning** — źródło szczebla 4: tylko `setforset-banded-good-mornings` (setup, descent/ascent, neutral spine, slight knee
  bend; Common mistakes: rounding the back, too much knee bend, lifting the head). `coach-good-morning` (5) był zgodny we wszystkich
  zdaniach — nie liczy się.
- **Rack Pull** — źródło szczebla 4: tylko `barbend-rack-pulls` (Coach i Titan = 5).

## 3. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `rack.setup` | Ustaw sztangę na bolcach albo hakach stojaka, mniej więcej na wysokości kolan. | Set the bar on the rack pins or hooks, at about knee height. | Wstrzymane — po korekcie 2 tylko BarBend (Coach = 5). |
| `rack.lower` | Odkładaj sztangę na bolce spokojnie, pod kontrolą. | Lower the bar back to the pins under control. | Wstrzymane — tylko Coach (5). |
| `rack.mis.high` | Bolce ustawione za wysoko. | Pins set too high. | Wstrzymane — tylko BarBend. |
| `slrdl.setup` | Stań na jednej nodze, kolano lekko ugięte. | Stand on one leg with a slight bend in the knee. | Brak zdania o ustawieniu jednonóż. |
| `slrdl.move` | Pochyl się, cofając biodro, a wolną nogę prowadź prosto w tył; wróć, wypychając biodra w przód. | Hinge at the hip and let your free leg travel straight back; drive your hips forward to stand. | `rdl.move`/`rdl.dbMove` nie opisują wolnej nogi. |
| `slrdl.mis.hipOpen` | Biodro wolnej nogi skręca się i ucieka w górę. | The hip of the free leg rotates and opens upward. | Błąd specyficzny dla wersji jednonóż. |
| `pt.setup` | Lina na nisko ustawionym wyciągu; stań tyłem do maszyny, lina przechodzi między nogami. | Rope on a low pulley; stand facing away from the machine with the rope running between your legs. | Brak zdania o ustawieniu przy wyciągu. Korekta 2: brzmienie zmienione na część wspólną BarBend („lowest setting”) i Speediance („low pulley”, ok. wysokość kolan). |
| `pt.move` | Cofaj biodra i pochyl tułów; wróć, wypychając biodra w przód i napinając pośladki. | Push your hips back and lean forward; come up by driving your hips forward and squeezing your glutes. | `rdl.move` mówi o sztandze przy nogach — tu lina między nogami. |
| `sumoKb.setup` | Stań szeroko, palce stóp na zewnątrz, kettlebell między stopami; chwyć go oburącz. | Take a wide stance, toes turned out, kettlebell between your feet; grab it with both hands. | Ćwiczenie otwarte. |
| `sumoKb.mis.far` | Kettlebell stoi za daleko z przodu, zamiast między stopami. | The kettlebell sits too far in front instead of between your feet. | Ćwiczenie otwarte. |
| `def.setup` | Stań stabilnie na niskim podwyższeniu albo talerzu; sztanga zostaje na podłodze. | Stand firmly on a low platform or a plate; the bar stays on the floor. | Ćwiczenie otwarte. |
| `def.knees` | Nie zamieniaj tego w martwy ciąg na prostych nogach — ugnij kolana, żeby sięgnąć sztangi. | Don't turn it into a stiff-leg deadlift — bend your knees to reach the bar. | jw. |
| `def.low` | Zacznij od niskiego podwyższenia. | Start with a low platform. | jw. |
| `sldl.setup` | Chwyć sztangę nachwytem, kolana lekko ugięte. | Grab the bar overhand, knees slightly bent. | Wstrzymane (korekta 2) — tylko Coach. |
| `sldl.move` | Podnoś, wypychając biodra w przód — nogi prawie nie pracują — aż staniesz prosto. | Lift by driving your hips forward — the legs barely help — until you're standing tall. | Wstrzymane (korekta 2) — tylko Coach. |
| `gmBand.setup` | Stań na gumie, a drugi koniec pętli załóż na górę pleców, na barki — nie na szyję. | Stand on the band and loop the other end over your upper back and shoulders — not your neck. | Wstrzymane (korekta 2) — tylko Set For Set. |
| `gm.mis.head` | Zadzieranie głowy przy schodzeniu w dół. | Craning your neck to look up as you lower. | Wstrzymane (korekta 2) — tylko Set For Set (Coach = 5). |
| `gmPins.setup` | Ustaw bolce mniej więcej na wysokości bioder — to dolny punkt ruchu. | Set the pins at about hip height — that's the bottom of the movement. | Warunkowe (sekcja 2a). |
| `gmPins.move` | Cofając biodra, opuść sztangę na bolce, zatrzymaj ją na chwilę i wróć do stania. | Push your hips back to lower the bar onto the pins, pause for a moment, then stand back up. | Warunkowe (sekcja 2a). |
| `gm.noRound` | Nie pozwól plecom się zaokrąglić. | Don't let your back round. | Warunkowe. Oba źródła mówią „lędźwie wygięte”, nie „neutralne” — część wspólna: bez zaokrąglania. |
| `gm.mis.waist` | Zginanie się w pasie zamiast cofania bioder. | Bending at the waist instead of pushing your hips back. | Warunkowe; błąd = zaprzeczenie standardu (EliteFTS), sekcja 2a. |

## 4. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `titan-rack-pulls` | https://titan.fitness/blogs/workouts/rack-pulls | Titan Fitness (producent sprzętu) | 5 | „Adjust the height of your rack so the bar is at or slightly below knee level” |
| `barbend-rack-pulls` | https://barbend.com/rack-pulls/ | BarBend | 4 | Step 1–3; Common Rack Pull Mistakes („you don't want to set the pins or blocks too high”) |
| `coach-rack-pull` | https://www.coachweb.com/barbell-exercises/7370/how-to-do-the-rack-pull | Coach | 5 (korekta 2: autor bez kwalifikacji) | „Keep the bar close to your legs as you stand up straight.” |
| `breakingmuscle-deadlift-variations` | https://breakingmuscle.com/deadlift-variations/ | Breaking Muscle | 5 | wpisy Deficit Deadlift, Rack Pull, Stiff-Leg Deadlift |
| `ace-127` | https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/ | ACE | 4 | instrukcja |
| `ace-350` | https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/ | ACE | 4 | „Place a cable pulley at the lowest position and attach a single handle.” |
| `barbend-single-leg-romanian-deadlift` | https://barbend.com/single-leg-romanian-deadlift/ | BarBend | 4 | Step 1–3; Form tips |
| `coach-single-leg-romanian-deadlift` | https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift | Coach | 4 (korekta 2: autor Sam Rider, REPS L3 PT) | Set-up; The Hinge; The Return; Common mistakes |
| `barbend-cable-pull-through-vs-hip-thrust` | https://barbend.com/cable-pull-through-vs-hip-thrust/ | BarBend | 4 | „Set the pulley of a cable machine to the lowest setting and hook the rope attachment to it.” (Mike Dewar, CSCS; akt. 17.11.2024) |
| `barbend-cable-pull-through` | https://barbend.com/cable-pull-through/ | BarBend | 4 | Step 3: „Flex your hips while keeping your back flat…”; „You'll follow the same steps in both cases.” |
| `coach-cable-machine-exercises` | https://www.coachweb.com/exercises/8648/cable-machine-exercises | Coach | 5 (korekta 2: autor dziennikarz bez kwalifikacji) | wpis „Cable pull-through” — po korekcie nieużyte |
| `speediance-cable-pull-through` | https://www.speediance.com/blogs/fitness/cable-pull-through | Speediance (producent wyciągów) | 4 | Step 1: „Attach a rope handle to the low pulley on a cable machine.”; Common Mistakes: „Rounding the lower back during the movement is a major mistake.” (Yang Chen, 19.11.2024) |
| `mikolo-cable-pull-through` | https://gym-mikolo.com/blogs/home-gym/cable-pull-throughs-the-underrated-glute-builder-you-shouldn-t-skip | Gym Mikolo | 5 | nieużyte |
| `gymreapers-kettlebell-sumo-deadlift` | https://uk.gymreapers.com/blogs/news/kettlebell-sumo-deadlift | Gym Reapers | 5 | nieużyte |
| `onnit-kettlebell-deadlift-exercises` | https://www.onnit.com/blogs/the-edge/the-best-kettlebell-deadlift-exercises-for-your-workout | Onnit (producent kettlebelli; autor CSCS, 15.07.2025) | 4 | sekcja Sumo Deadlift, Step 1–3 — ćwiczenie otwarte |
| `titan-kettlebell-deadlift` | https://titan.fitness/blogs/workouts/kettlebell-deadlift | Titan Fitness | 5 | nieużyte |
| `barbend-deficit-deadlift` | https://barbend.com/deficit-deadlift/ | BarBend | 4 | how-to; Common Mistakes — ćwiczenie otwarte |
| `coach-stiff-leg-deadlift` | https://www.coachweb.com/leg-exercises/7387/how-to-do-the-stiff-leg-deadlift | Coach | 4 (korekta 2: autor Sam Rider, REPS L3 PT) | „Rather than locked straight, your knees should be ever so slightly bent.” — ćwiczenie otwarte |
| `physitrack-stiff-leg-deadlift` | https://www.physitrack.com/exercise-library/how-to-perform-the-stiff-leg-deadlift-exercise | Physitrack | 5 (ROZSTRZYGNIĘCIE 2) | po korekcie nieużyte |
| `barbend-stiff-leg-deadlift` | https://barbend.com/stiff-leg-deadlift/ | BarBend | 4 | „the lifter minimizes nearly all knee flexion throughout the movement” (Mike Dewar, CSCS; akt. 09.08.2023) — ćwiczenie otwarte |
| `coach-good-morning` | https://www.coachweb.com/exercises/back-exercises/184/good-morning | Coach | 5 (korekta 2: Nick Harris-Fry, dziennikarz bez kwalifikacji) | po korekcie nieużyte |
| `setforset-banded-good-mornings` | https://www.setforset.com/blogs/news/banded-good-mornings | Set For Set (gumy własnej marki) | 4 (sekcja 4a) | „Step on the band, with the band sitting in the arch of the foot.” — ćwiczenie otwarte |
| `elitefts-low-pin-goodmorning` | https://elitefts.com/coaching-logs/daily-movement-low-pin-paused-goodmorning | EliteFTS | 4 (sekcja 4a) | „Set your pins at about hip joint level.” (Nate Harvey, 24.07.2018) |
| `stoppani-good-morning` | https://jimstoppani.com/training/good-morning-master-class | Jim Stoppani, PhD (strona autorska) | do oceny (sekcja 4a) | „Set the safety pins in the rack to the bottom position of the good morning – somewhere around hip height.” (akt. 26.08.2021) |

```json
{
  "orgs": {
    "Titan Fitness": {"name": "Titan Fitness — blog producenta sprzętu siłowego (titan.fitness); bez autora i daty, treść wokół promocji produktów", "level": 5, "kind": "maker"},
    "Speediance": {"name": "Speediance — blog producenta wyciągów (speediance.com; autor i data)", "level": 4, "kind": "maker"},
    "Gym Mikolo": {"name": "Gym Mikolo — blog producenta sprzętu do domowej siłowni (gym-mikolo.com); bez autora i daty", "level": 5, "kind": "maker"},
    "Gym Reapers": {"name": "Gym Reapers — blog producenta akcesoriów siłowych (gymreapers.com)", "level": 5, "kind": "maker"},
    "Onnit": {"name": "Onnit — The Edge, blog producenta kettlebelli i sprzętu (onnit.com; autor CSCS, data)", "level": 4, "kind": "maker"},
    "Set For Set": {"name": "Set For Set — blog marki gum oporowych (setforset.com; autor NASM-CPT, weryfikacja faktów, data)", "level": 4, "kind": "maker"},
    "EliteFTS": {"name": "EliteFTS — serwis trenerski i producent sprzętu do trójboju (elitefts.com; autor, data)", "level": 4, "kind": "site"}
  },
  "sources": {
    "ace-127": {"org": "ACE", "title": "Single-Arm Single-Leg Romanian Deadlift", "url": "https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/", "level": 4},
    "ace-350": {"org": "ACE", "title": "Single-leg Romanian Deadlift (cable)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/", "level": 4},
    "barbend-single-leg-romanian-deadlift": {"org": "BarBend", "title": "Single Leg Romanian Deadlift", "url": "https://barbend.com/single-leg-romanian-deadlift/", "level": 4},
    "coach-single-leg-romanian-deadlift": {"org": "Coach", "title": "How To Do The Single-Leg Romanian Deadlift With Perfect Form (S. Rider, PT; 2024)", "url": "https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift", "level": 4},
    "barbend-cable-pull-through-vs-hip-thrust": {"org": "BarBend", "title": "Cable Pull-Through vs. Hip Thrust", "url": "https://barbend.com/cable-pull-through-vs-hip-thrust/", "level": 4},
    "barbend-cable-pull-through": {"org": "BarBend", "title": "Cable Pull-Through", "url": "https://barbend.com/cable-pull-through/", "level": 4},
    "speediance-cable-pull-through": {"org": "Speediance", "title": "Cable Pull-Through Guide: Correct Form & Benefits", "url": "https://www.speediance.com/blogs/fitness/cable-pull-through", "level": 4}
  }
}
```

Korekta 2: blok `sources` zawiera tylko źródła gotowych kart (konwencja jak w `hinge-cz2.md`). Usunięte z bloku: `barbend-rack-pulls`,
`coach-rack-pull`, `coach-cable-machine-exercises`, `onnit-kettlebell-deadlift-exercises`, `barbend-deficit-deadlift`,
`coach-stiff-leg-deadlift`, `physitrack-stiff-leg-deadlift`, `barbend-stiff-leg-deadlift`, `coach-good-morning`,
`setforset-banded-good-mornings`, `elitefts-low-pin-goodmorning` — adresy w tabeli wyżej; wracają do bloku, gdy zasilą gotową kartę.
Uwaga dla integracji: organizacja „Coach” w `cues.json` — szczebel per artykuł (autor z kwalifikacjami), nie dla całego serwisu;
„Physitrack” w `orgs` istniejącego `cues.json` — 5 wg ROZSTRZYGNIĘCIA 2.

### 4a. Ocena organizacji wg kryteriów (a)–(c) z rozstrzygnięcia koordynatora (02.11.2026)

| Organizacja | (a) | (b) | (c) | Ocena |
|---|---|---|---|---|
| Titan Fitness | producent własnych stojaków i kettlebelli | brak autora i daty; tylko firmowanie bloga | artykuły zbudowane wokół linków do produktów | **5** |
| Gym Mikolo | producent maszyn (wyciągi, Smith) | brak autora i daty | blog sklepu, strona mocno promuje produkty | **5** |
| Gym Reapers | głównie akcesoria; kettlebelle bez kategorii w sklepie | autor i data, bez kwalifikacji | poradnik ze wzmianką o produkcie | **5** |
| Speediance | producent wyciągów (Cable Pull Through = jego sprzęt) | autor (Yang Chen, Head of Content), data 19.11.2024 | poradnik z rekomendacją własnej maszyny | **4** |
| Onnit | producent kettlebelli | Sean Hyson, CSCS, CPPS, 15.07.2025 | poradnik | **4** |
| Set For Set | marka gum oporowych | Paulina Kairys, BSKin, NASM-CPT; weryfikacja faktów; data 08.01.2022, akt. 23.06.2025 | poradnik z linkiem do własnych gum | **4** — uwaga: „producent” vs „sprzedawca” niepewne |
| EliteFTS | serwis trenerski trójboju i producent sprzętu | Nate Harvey, 24.07.2018 | dziennik trenerski, nie marketing | **4** |
| Jim Stoppani, PhD | strona autorska, nie organizacja szkoląca ani serwis z redakcją | autor i data akt. 26.08.2021 | strona promuje też własne plany i suplementy | **do oceny koordynatora**: wg (a) raczej 5 |
| Coach (korekta 2) | magazyn — warunkowo 4 (ROZSTRZYGNIĘCIE 2) | per artykuł: Sam Rider (REPS L3 PT) — 2 artykuły; Nick Harris-Fry (dziennikarz) — 2 artykuły; Harry Bullmore (staff writer) — 1 artykuł | — | **4** tylko `coach-single-leg-romanian-deadlift`, `coach-stiff-leg-deadlift`; pozostałe **5** |
| Physitrack (korekta 2) | — | — | — | **5** (ROZSTRZYGNIĘCIE 2) |

## 5. Otwarte

Błędy zestawów ogólnych (zdania z `cue-sets.json` niepotwierdzone przez źródła danego ćwiczenia):
- **Single Leg RDL (hantel), (linki) — `rdl.depth`**: tylko BarBend; ACE i Coach nie mówią o głębokości.
- **Cable Pull Through — `rdl.depth`**: rozciągnięcie tylko BarBend (wersja z gumą). **`ht.mis.arch`** (przeprost na górze): jako błąd tylko Speediance („Overextending at the Top”); żadne przeczytane źródło szczebla 4 nie podaje standardu „na górze bez wyginania lędźwi”, więc reguła „błąd = zaprzeczenie standardu” nie ma zastosowania. (`mis.roundBack` — odzyskany w korekcie 2, sekcja 2.)
- **Stiff-Legged Barbell Deadlift — `rdl.depth`**: Coach — tylko tak nisko, jak pozwala tył uda; Physitrack (5) — do podłogi. Po korekcie 2 jedno źródło.
- **Band Good Morning — `gm.depth`, `gm.light`, `mis.roundBack`, `rdl.mis.knees`**: po korekcie 2 tylko Set For Set.

Ćwiczenia otwarte:
- **Stiff-Legged Barbell Deadlift** (korekta 2): dane częściowe w 2b. Rozstrzygnęłoby: drugie źródło szczebla 4 z krokami SLDL (organizacja szkoląca trenerów albo artykuł z autorem z kwalifikacjami).
- **Band Good Morning** (korekta 2): dane częściowe w 2b. Rozstrzygnęłoby: drugie źródło szczebla 4 o good morning z gumą (lub o good morning ze sztangą, które wprost mówi, że wersja z gumą to ten sam ruch, od autora z kwalifikacjami).
- **Rack Pull**: po korekcie 2 tylko BarBend (Coach i Titan = 5). Rozstrzygnęłoby: drugie źródło szczebla 4.
- **Sumo Deadlift (kettlebell)**: jedyne źródło szczebla 4 — Onnit. Rozstrzygnęłoby: drugie źródło szczebla 4.
- **Deficit Deadlift**: BarBend + Breaking Muscle = jedno źródło.
- **Rack Pull — za ciężko na start**: zalecenie o obciążeniu — poza wskazówkami bez liczb.
- **Single Leg RDL (linki) — uchwyt blisko ciała**: tylko ACE 350.
- **Cable Pull Through — „nie ciągnij rękami”**: tylko BarBend.
- **Single Arm RDL (hantel/linka)**: brak przeczytanego źródła szczebla 4 o wersji obunóż z ciężarem w jednej ręce.
- **Smith Machine Stiff-Legged Deadlift**: jedyne przeczytane źródło (Gym Mikolo) = 5.
- **Good Morning off Pins**: dane warunkowe w 2a; brakuje oceny Stoppaniego. Kandydat nieprzeczytany: artykuł o technice good morning w czasopiśmie trenerskim NSCA (2024) — tylko wpis bibliograficzny.

## 6. Dostęp

- ExRx (403) i web.archive.org (blokada) — niedostępne.
- NASM: brak stron `rack-pull` i `single-leg-romanian-deadlift` (404).
- Breaking Muscle `cable-pull-through` — 404. BarBend `rack-pull` — 404, użyty `rack-pulls`.
- Muscle & Strength — 403; Bodybuilding.com — 404; DMoose `band-good-mornings` — 404; EliteFTS `pull-thru-band-goodmorning` — 404; Victorem Gear — 503; The Prehab Guys — biblioteka za logowaniem; Rogue — tylko film.
- Pominięte jako strony aplikacji: kilka wyników dla Band Good Morning, Good Morning off Pins i Smith SLDL (bez nazw w repo).
- Living.Fit — inne ustawienie gumy; nieużyte.
- Korekta 2 (02.11.2026): ponownie przeczytane (WebFetch) dla autorów i treści — 5 stron Coach, Speediance (2 razy: Step 1, Common Mistakes), BarBend `stiff-leg-deadlift`, BarBend `cable-pull-through-vs-hip-thrust`.
