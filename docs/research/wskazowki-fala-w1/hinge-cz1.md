# Wskazówki techniki — rodzina `hinge`, część 1

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda jak w `docs/research/33-wskazowki-partia2.md`: każde zdanie przy konkretnym ćwiczeniu ma ≥ 2 przeczytane źródła
szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki, CLAUDE.md, 25.10.2026). Źródło o tym samym ćwiczeniu z innym
obciążeniem (sztanga/hantel/linka/guma) liczone jako „(wariant: …)”. Bez liczb i bez uzasadnień zdrowotnych. Zdania z zestawu
ogólnego (`lib/figures/v2/cue-sets.json`), których przeczytane źródła danego ćwiczenia nie potwierdzają, nie trafiają do karty —
lista w sekcji „Otwarte” (uzupełnienie briefu koordynatora, 02.11.2026). Strony innych aplikacji pomijane.

**Korekta po rozstrzygnięciu koordynatora o szczeblach (02.11.2026, druga sesja):** Breaking Muscle = szczebel 5 i nigdy niezależne
od BarBend; producenci tylko dla własnego sprzętu; sprzedawcy i blogi marketingowe = 5. Ocena organizacji tego pliku — tabela w
sekcji 4a. Skutki: Rack Pull, Sumo Deadlift (kettlebell) i Deficit Deadlift przechodzą do „otwarte”; z Cable Pull Through usunięty
błąd `ht.mis.arch` (zostało jedno źródło), a `hinge.back` dostał drugie źródło; z Stiff-Legged Barbell Deadlift usunięte odwołania do
Breaking Muscle (karta zostaje — każde zdanie ma nadal 2 źródła); Smith SLDL traci jedyne źródło (Gym Mikolo = 5).
Zmieniony tekst proponowanego zdania `rack.setup` (część wspólna bez Breaking Muscle).

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Rack Pull | otwarte | po korekcie szczebli: Coach + BarBend dają ustawienie, ruch i `dl.close`; brak drugiego zdania wskazówki/błędu. Warunkowo gotowe, gdy koordynator uzna Titan za 4 (sekcja 5) |
| Single Leg RDL (hantel) | gotowe | ACE (hantel) + 2 serwisy (warianty: sztanga/hantel/kettlebell) |
| Single Leg RDL (linki) | gotowe | ACE (linka, wprost) + 2 serwisy (wariant: wolne ciężary) |
| Cable Pull Through | gotowe | Coach, BarBend (2 artykuły — jedna organizacja), Speediance (producent wyciągów); bez błędów — tylko wskazówki |
| Sumo Deadlift (kettlebell) | otwarte | po korekcie: Onnit jedyne źródło szczebla 4 (Titan, Gym Reapers — 5, sekcja 4a) |
| Single Arm RDL (hantel/linka) | otwarte | nadal brak źródła o wersji obunóż z ciężarem w jednej ręce (druga sesja: wyszukiwanie bez wyniku szczebla 4) |
| Deficit Deadlift | otwarte | po korekcie: BarBend + Breaking Muscle = jedno źródło |
| Stiff-Legged Barbell Deadlift | gotowe | Coach, Physitrack, BarBend (bez Breaking Muscle) |
| Good Morning off Pins | otwarte | EliteFTS (4) + strona Jima Stoppaniego (szczebel do oceny koordynatora — sekcja 4a); dane gotowe warunkowo (sekcja 2a) |
| Band Good Morning | gotowe | Coach (źródło samo mówi, że wersja z gumą to ten sam ruch) + Set For Set (producent gum, autor NASM-CPT, data) |
| Smith Machine Stiff-Legged Deadlift | otwarte | brak źródła szczebla 4 (Gym Mikolo = 5; producent maszyn Smitha opisuje tylko RDL, martwy ciąg, sumo, rack pull) |

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
      {"c": "pt.setup", "s": [["coach-cable-machine-exercises", "Cable pull-through (lowest position… facing away… rope between your legs)"], ["barbend-cable-pull-through-vs-hip-thrust", "How to Do the Cable Pull-Through (lowest setting, rope attachment; rope through your legs)"]]}
    ],
    "move": [
      {"c": "pt.move", "s": [["coach-cable-machine-exercises", "Cable pull-through (hinging at the hips… squeeze your glutes and drive your hips forwards)"], ["barbend-cable-pull-through-vs-hip-thrust", "How-to (drive your butt back and hinge… extend your hips fully… squeeze your glutes)"], ["speediance-cable-pull-through", "Step 2; Step 3"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["speediance-cable-pull-through", "Step 2 (back straight… neutral spine)"], ["barbend-cable-pull-through", "Step 3 (keeping your back flat; strona: te same kroki z gumą i z wyciągiem)"]]},
      {"c": "rdl.knees", "s": [["speediance-cable-pull-through", "Step 2; Common Mistakes: Poor hip hinge and knee bend (rather than squatting down)"], ["barbend-cable-pull-through-vs-hip-thrust", "How-to (bend your knees slightly)"]]}
    ],
    "mistakes": []
  },
  "Stiff-Legged Barbell Deadlift": {
    "setup": [
      {"c": "sldl.setup", "s": [["coach-stiff-leg-deadlift", "How-to: setup (knees ever so slightly bent… grip the bar overhand)"], ["physitrack-stiff-leg-deadlift", "Step 1 (knees slightly bent… overhand grip; wariant: hantle — strona: sztanga albo hantle)"]]}
    ],
    "move": [
      {"c": "sldl.move", "s": [["coach-stiff-leg-deadlift", "How-to: lift (drive your hips forward… until standing straight)"], ["physitrack-stiff-leg-deadlift", "Step 3"]]}
    ],
    "tips": [
      {"c": "rdl.knees", "s": [["coach-stiff-leg-deadlift", "How-to: knees; return (slightly bent, knees fixed)"], ["physitrack-stiff-leg-deadlift", "Common mistakes (knees slightly bent, but not too much)"]]},
      {"c": "hinge.back", "s": [["coach-stiff-leg-deadlift", "How-to: stance and back (back should remain flat)"], ["physitrack-stiff-leg-deadlift", "Step 2 (keeping your back straight)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["physitrack-stiff-leg-deadlift", "Common mistakes: Rounding the back"], ["coach-stiff-leg-deadlift", "How-to: depth (if your back starts to round, reduce how far the bar travels)"]]},
      {"c": "rdl.mis.knees", "s": [["physitrack-stiff-leg-deadlift", "Common mistakes: Bending the knees too much"], ["barbend-stiff-leg-deadlift", "opis (minimizes nearly all knee flexion)"]]}
    ]
  },
  "Band Good Morning": {
    "setup": [
      {"c": "gmBand.setup", "s": [["coach-good-morning", "wariant z gumą (stand on a large looped band with both feet… rests on your shoulders); how-to (feet shoulder-width apart)"], ["setforset-banded-good-mornings", "How-to: setup (band in the arch of the foot; feet between shoulder and hip width; over the back of the shoulders, not the neck)"]]}
    ],
    "move": [
      {"c": "gm.move", "s": [["coach-good-morning", "how-to (hinge forward from your hips, back flat; drive the hips forward to rise) — strona: wersja z gumą to ten sam ruch"], ["setforset-banded-good-mornings", "How-to: descent; ascent (hinge at the hips, push your butt backward, neutral spine; squeeze glutes, hips forward)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["coach-good-morning", "how-to (keeping your back flat… spine neutral)"], ["setforset-banded-good-mornings", "How-to: descent (maintain your neutral spine); Common mistakes: rounding the back"]]},
      {"c": "rdl.knees", "s": [["coach-good-morning", "how-to (slight bend in your knees)"], ["setforset-banded-good-mornings", "How-to: descent (slight knee bend); Common mistakes: too much knee bend (turns into a squat)"]]}
    ],
    "mistakes": [
      {"c": "gm.mis.head", "s": [["coach-good-morning", "tips (don't crane your neck; look toward the floor as you lower)"], ["setforset-banded-good-mornings", "Common mistakes: lifting the head (keep your chin tucked)"]]}
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
      {"c": "gm.mis.waist", "s": [["stoppani-good-morning", "Mistakes (bending at the waist instead of hinging at the hips)"], ["elitefts-low-pin-goodmorning", "opis (reach your hips back) — tylko wskazówka, nie błąd; DRUGIE ŹRÓDŁO NIEPEŁNE"]]}
    ]
  }
}
```

Uwaga: przy `gm.mis.waist` drugie źródło mówi tylko „cofnij biodra” (wskazówka), nie nazywa błędu — bez trzeciego źródła to
zdanie wypada, a karta ma wtedy wskazówki + błędy = 1 (poniżej minimum). Pełne „gotowe” wymaga więc i oceny Stoppaniego, i jeszcze
jednego zdania z 2 źródłami.

## 3. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `rack.setup` | Ustaw sztangę na bolcach albo hakach stojaka, mniej więcej na wysokości kolan. | Set the bar on the rack pins or hooks, at about knee height. | Korekta 02.11 (druga sesja): bez Breaking Muscle część wspólna Coach (tuż nad kolanem) i BarBend (tuż pod kolanem albo przy dole ud) to „okolice kolan”. Ćwiczenie otwarte — zdanie do użycia, gdy karta się domknie. |
| `rack.lower` | Odkładaj sztangę na bolce spokojnie, pod kontrolą. | Lower the bar back to the pins under control. | Po korekcie tylko Coach (Titan = 5) — zdanie wstrzymane. |
| `rack.mis.high` | Bolce ustawione za wysoko. | Pins set too high. | Po korekcie tylko BarBend („Incorrect Starting Position”) — zdanie wstrzymane. |
| `slrdl.setup` | Stań na jednej nodze, kolano lekko ugięte. | Stand on one leg with a slight bend in the knee. | Brak zdania o ustawieniu jednonóż. |
| `slrdl.move` | Pochyl się, cofając biodro, a wolną nogę prowadź prosto w tył; wróć, wypychając biodra w przód. | Hinge at the hip and let your free leg travel straight back; drive your hips forward to stand. | `rdl.move`/`rdl.dbMove` nie opisują wolnej nogi. |
| `slrdl.mis.hipOpen` | Biodro wolnej nogi skręca się i ucieka w górę. | The hip of the free leg rotates and opens upward. | Błąd specyficzny dla wersji jednonóż. |
| `pt.setup` | Lina na najniższym wyciągu; stań tyłem do maszyny i trzymaj linę między nogami. | Rope on the lowest pulley; stand facing away from the machine, holding the rope between your legs. | Brak zdania o ustawieniu przy wyciągu. |
| `pt.move` | Cofaj biodra i pochyl tułów; wróć, wypychając biodra w przód i napinając pośladki. | Push your hips back and lean forward; come up by driving your hips forward and squeezing your glutes. | `rdl.move` mówi o sztandze przy nogach — tu lina między nogami. |
| `sumoKb.setup` | Stań szeroko, palce stóp na zewnątrz, kettlebell między stopami; chwyć go oburącz. | Take a wide stance, toes turned out, kettlebell between your feet; grab it with both hands. | Ćwiczenie otwarte po korekcie — „między stopami” ma tylko Gym Reapers i Titan (oba 5). |
| `sumoKb.mis.far` | Kettlebell stoi za daleko z przodu, zamiast między stopami. | The kettlebell sits too far in front instead of between your feet. | Ćwiczenie otwarte po korekcie. |
| `def.setup` | Stań stabilnie na niskim podwyższeniu albo talerzu; sztanga zostaje na podłodze. | Stand firmly on a low platform or a plate; the bar stays on the floor. | Ćwiczenie otwarte po korekcie (BarBend + Breaking Muscle = jedno źródło). |
| `def.knees` | Nie zamieniaj tego w martwy ciąg na prostych nogach — ugnij kolana, żeby sięgnąć sztangi. | Don't turn it into a stiff-leg deadlift — bend your knees to reach the bar. | jw. |
| `def.low` | Zacznij od niskiego podwyższenia. | Start with a low platform. | jw. |
| `sldl.setup` | Chwyć sztangę nachwytem, kolana lekko ugięte. | Grab the bar overhand, knees slightly bent. | `rdl.setup` podaje rozstaw stóp i start z góry — źródła SLDL różnią się co do startu (podłoga vs stanie), więc tylko część wspólna. |
| `sldl.move` | Podnoś, wypychając biodra w przód — nogi prawie nie pracują — aż staniesz prosto. | Lift by driving your hips forward — the legs barely help — until you're standing tall. | Opis ruchu bez sztangi „przy nogach” (to tylko jedno źródło). |
| `gmBand.setup` | Stań na gumie, a drugi koniec pętli załóż na górę pleców, na barki — nie na szyję. | Stand on the band and loop the other end over your upper back and shoulders — not your neck. | `gm.setup` mówi o sztandze. Oba źródła: guma pod stopami, pętla na barkach (Set For Set wprost: nie na szyi; Coach: na barkach). |
| `gm.mis.head` | Zadzieranie głowy przy schodzeniu w dół. | Craning your neck to look up as you lower. | Brak zdania o ustawieniu głowy w zawiasie biodrowym; Coach (porada) i Set For Set (błąd) zgodne. |
| `gmPins.setup` | Ustaw bolce mniej więcej na wysokości bioder — to dolny punkt ruchu. | Set the pins at about hip height — that's the bottom of the movement. | Warunkowe (sekcja 2a). |
| `gmPins.move` | Cofając biodra, opuść sztangę na bolce, zatrzymaj ją na chwilę i wróć do stania. | Push your hips back to lower the bar onto the pins, pause for a moment, then stand back up. | Warunkowe (sekcja 2a). |
| `gm.noRound` | Nie pozwól plecom się zaokrąglić. | Don't let your back round. | Warunkowe. Oba źródła mówią „lędźwie wygięte”, nie „neutralne” — dlatego nie `hinge.back` (neutralne), tylko część wspólna: bez zaokrąglania. |
| `gm.mis.waist` | Zginanie się w pasie zamiast cofania bioder. | Bending at the waist instead of pushing your hips back. | Warunkowe, z drugim źródłem niepełnym (sekcja 2a). |

## 4. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `titan-rack-pulls` | https://titan.fitness/blogs/workouts/rack-pulls | Titan Fitness (producent sprzętu) | 5 (korekta, sekcja 4a) | „Adjust the height of your rack so the bar is at or slightly below knee level” |
| `barbend-rack-pulls` | https://barbend.com/rack-pulls/ | BarBend | 4 | Step 1–3; Common Rack Pull Mistakes („you don't want to set the pins or blocks too high”) |
| `coach-rack-pull` | https://www.coachweb.com/barbell-exercises/7370/how-to-do-the-rack-pull | Coach | 4 | „Keep the bar close to your legs as you stand up straight.” |
| `breakingmuscle-deadlift-variations` | https://breakingmuscle.com/deadlift-variations/ | Breaking Muscle | 5 (rozstrzygnięcie koordynatora) | wpisy Deficit Deadlift, Rack Pull, Stiff-Leg Deadlift |
| `ace-127` | https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/ | ACE | 4 | instrukcja |
| `ace-350` | https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/ | ACE | 4 | „Place a cable pulley at the lowest position and attach a single handle.” |
| `barbend-single-leg-romanian-deadlift` | https://barbend.com/single-leg-romanian-deadlift/ | BarBend | 4 | Step 1–3; Form tips |
| `coach-single-leg-romanian-deadlift` | https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift | Coach | 4 | Set-up; The Hinge; The Return; Common mistakes |
| `barbend-cable-pull-through-vs-hip-thrust` | https://barbend.com/cable-pull-through-vs-hip-thrust/ | BarBend | 4 | „Set the pulley of a cable machine to the lowest setting and hook the rope attachment to it.” |
| `barbend-cable-pull-through` | https://barbend.com/cable-pull-through/ | BarBend | 4 | Step 3: „Flex your hips while keeping your back flat…”; „You'll follow the same steps in both cases.” (guma i wyciąg) |
| `coach-cable-machine-exercises` | https://www.coachweb.com/exercises/8648/cable-machine-exercises | Coach | 4 | wpis „Cable pull-through” |
| `speediance-cable-pull-through` | https://www.speediance.com/blogs/fitness/cable-pull-through | Speediance (producent wyciągów) | 4 | Step 1–4; Common Mistakes and Fixes (autor, 19.11.2024) |
| `mikolo-cable-pull-through` | https://gym-mikolo.com/blogs/home-gym/cable-pull-throughs-the-underrated-glute-builder-you-shouldn-t-skip | Gym Mikolo | 5 (korekta) | How-to; Tips; Common mistakes — nieużyte |
| `gymreapers-kettlebell-sumo-deadlift` | https://uk.gymreapers.com/blogs/news/kettlebell-sumo-deadlift | Gym Reapers | 5 (korekta) | Mistake #1–4 — nieużyte |
| `onnit-kettlebell-deadlift-exercises` | https://www.onnit.com/blogs/the-edge/the-best-kettlebell-deadlift-exercises-for-your-workout | Onnit (producent kettlebelli; autor CSCS, 15.07.2025) | 4 | sekcja Sumo Deadlift, Step 1–3 |
| `titan-kettlebell-deadlift` | https://titan.fitness/blogs/workouts/kettlebell-deadlift | Titan Fitness | 5 (korekta) | how-to; wariant sumo — nieużyte |
| `barbend-deficit-deadlift` | https://barbend.com/deficit-deadlift/ | BarBend | 4 | how-to; Common Mistakes — ćwiczenie otwarte |
| `coach-stiff-leg-deadlift` | https://www.coachweb.com/leg-exercises/7387/how-to-do-the-stiff-leg-deadlift | Coach | 4 | „Rather than locked straight, your knees should be ever so slightly bent.” |
| `physitrack-stiff-leg-deadlift` | https://www.physitrack.com/exercise-library/how-to-perform-the-stiff-leg-deadlift-exercise | Physitrack | 4 (wg `orgs`) | Step 1–3; Common mistakes („Can be done with either barbell or dumbbell.”) |
| `barbend-stiff-leg-deadlift` | https://barbend.com/stiff-leg-deadlift/ | BarBend | 4 | „the lifter minimizes nearly all knee flexion throughout the movement” |
| `coach-good-morning` | https://www.coachweb.com/exercises/back-exercises/184/good-morning | Coach | 4 | how-to; tips; wariant z gumą: „stand on a large looped band with both feet and bring the other side of the loop over your head so it rests on your shoulders” (Nick Harris-Fry, 17.10.2018) |
| `setforset-banded-good-mornings` | https://www.setforset.com/blogs/news/banded-good-mornings | Set For Set (gumy własnej marki) | 4 (sekcja 4a) | How-to; Tips; Common mistakes — „Step on the band, with the band sitting in the arch of the foot.” |
| `elitefts-low-pin-goodmorning` | https://elitefts.com/coaching-logs/daily-movement-low-pin-paused-goodmorning | EliteFTS | 4 (sekcja 4a) | „Set your pins at about hip joint level.” (Nate Harvey, 24.07.2018) |
| `stoppani-good-morning` | https://jimstoppani.com/training/good-morning-master-class | Jim Stoppani, PhD (strona autorska) | do oceny (sekcja 4a) | „Set the safety pins in the rack to the bottom position of the good morning – somewhere around hip height.” (akt. 26.08.2021) |

Physitrack — w `orgs` jest jako szczebel 4 (biblioteka ćwiczeń dla fizjoterapeutów); jest to też narzędzie programowe dla
gabinetów — czy podpada pod „dokumentację innych aplikacji” z rozstrzygnięcia, ocenia koordynator (jeśli tak, Stiff-Legged Barbell
Deadlift wraca do otwartych — bez Physitrack każde zdanie ma tylko Coach albo BarBend).

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
    "barbend-rack-pulls": {"org": "BarBend", "title": "Learn Rack Pulls for More Pulling Strength and a Bigger Back", "url": "https://barbend.com/rack-pulls/", "level": 4},
    "coach-rack-pull": {"org": "Coach", "title": "How To Do The Rack Pull", "url": "https://www.coachweb.com/barbell-exercises/7370/how-to-do-the-rack-pull", "level": 4},
    "ace-127": {"org": "ACE", "title": "Single-Arm Single-Leg Romanian Deadlift", "url": "https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/", "level": 4},
    "ace-350": {"org": "ACE", "title": "Single-leg Romanian Deadlift (cable)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/", "level": 4},
    "barbend-single-leg-romanian-deadlift": {"org": "BarBend", "title": "Single Leg Romanian Deadlift", "url": "https://barbend.com/single-leg-romanian-deadlift/", "level": 4},
    "coach-single-leg-romanian-deadlift": {"org": "Coach", "title": "How To Do The Single-Leg Romanian Deadlift With Perfect Form", "url": "https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift", "level": 4},
    "barbend-cable-pull-through-vs-hip-thrust": {"org": "BarBend", "title": "Cable Pull-Through vs. Hip Thrust", "url": "https://barbend.com/cable-pull-through-vs-hip-thrust/", "level": 4},
    "barbend-cable-pull-through": {"org": "BarBend", "title": "Cable Pull-Through", "url": "https://barbend.com/cable-pull-through/", "level": 4},
    "coach-cable-machine-exercises": {"org": "Coach", "title": "The Best Cable Machine Exercises For All Levels", "url": "https://www.coachweb.com/exercises/8648/cable-machine-exercises", "level": 4},
    "speediance-cable-pull-through": {"org": "Speediance", "title": "Cable Pull-Through Guide: Correct Form & Benefits", "url": "https://www.speediance.com/blogs/fitness/cable-pull-through", "level": 4},
    "onnit-kettlebell-deadlift-exercises": {"org": "Onnit", "title": "The Best Kettlebell Deadlift Exercises For Your Workout", "url": "https://www.onnit.com/blogs/the-edge/the-best-kettlebell-deadlift-exercises-for-your-workout", "level": 4},
    "barbend-deficit-deadlift": {"org": "BarBend", "title": "How To Do The Deficit Deadlift To Enhance Your Pulling Power", "url": "https://barbend.com/deficit-deadlift/", "level": 4},
    "coach-stiff-leg-deadlift": {"org": "Coach", "title": "How To Do The Stiff-Leg Deadlift And Strengthen Your Hamstrings", "url": "https://www.coachweb.com/leg-exercises/7387/how-to-do-the-stiff-leg-deadlift", "level": 4},
    "physitrack-stiff-leg-deadlift": {"org": "Physitrack", "title": "Step-by-step guide to the stiff leg deadlift exercise", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-stiff-leg-deadlift-exercise", "level": 4},
    "barbend-stiff-leg-deadlift": {"org": "BarBend", "title": "Stiff Leg Deadlift", "url": "https://barbend.com/stiff-leg-deadlift/", "level": 4},
    "coach-good-morning": {"org": "Coach", "title": "How To Do The Good Morning Exercise", "url": "https://www.coachweb.com/exercises/back-exercises/184/good-morning", "level": 4},
    "setforset-banded-good-mornings": {"org": "Set For Set", "title": "Banded Good Mornings", "url": "https://www.setforset.com/blogs/news/banded-good-mornings", "level": 4},
    "elitefts-low-pin-goodmorning": {"org": "EliteFTS", "title": "Daily Movement: Low Pin Paused Goodmorning", "url": "https://elitefts.com/coaching-logs/daily-movement-low-pin-paused-goodmorning", "level": 4}
  }
}
```

Źródła szczebla 5 (Titan, Gym Mikolo, Gym Reapers, Breaking Muscle) i `stoppani-good-morning` celowo poza blokiem `sources` —
przeczytane, ale nieużyte w kartach; adresy w tabeli wyżej.

### 4a. Ocena organizacji wg kryteriów (a)–(c) z rozstrzygnięcia koordynatora (02.11.2026)

| Organizacja | (a) | (b) | (c) | Ocena |
|---|---|---|---|---|
| Titan Fitness | producent własnych stojaków i kettlebelli | brak autora i daty; tylko firmowanie bloga | artykuły zbudowane wokół linków do produktów, sekcja promocyjna na końcu | **5** — ten sam profil co Gym Mikolo (przykład z rozstrzygnięcia); do potwierdzenia koordynatora |
| Gym Mikolo | producent maszyn (wyciągi, Smith) | brak autora i daty | blog sklepu, strona mocno promuje produkty | **5** |
| Gym Reapers | głównie akcesoria (pasy, paski); kettlebelle własne wspomniane jako wyprzedane, bez kategorii w sklepie | autor i data, bez kwalifikacji | poradnik ze wzmianką o produkcie | **5** — kettlebell nie jest jego rodzajem sprzętu w praktyce |
| Speediance | producent wyciągów (Cable Pull Through = jego sprzęt) | autor (Head of Content), data 19.11.2024 | poradnik z rekomendacją własnej maszyny | **4** — producent dla własnego rodzaju sprzętu, autor i data |
| Onnit | producent kettlebelli | Sean Hyson, CSCS, CPPS, 15.07.2025 | poradnik | **4** |
| Set For Set | marka gum oporowych (sprzedaje gumy pod własną nazwą; strona nie mówi, czy sama produkuje) | Paulina Kairys, BSKin, NASM-CPT; weryfikacja faktów; data 08.01.2022, akt. 23.06.2025 | poradnik z linkiem do własnych gum | **4** — autor z kwalifikacjami i recenzja; uwaga: „producent” vs „sprzedawca” niepewne |
| EliteFTS | serwis trenerski trójboju i producent stojaków/sztang specjalnych | Nate Harvey, 24.07.2018 | dziennik trenerski, nie marketing | **4** |
| Jim Stoppani, PhD | strona autorska uznanego autora (doktor fizjologii wysiłku), nie organizacja szkoląca ani serwis z redakcją | autor i data akt. 26.08.2021 | poradnik (strona promuje też własne plany i suplementy) | **do oceny koordynatora**: wg (a) nie pasuje → raczej 5 |

## 5. Otwarte

Błędy zestawów ogólnych (zdania z `cue-sets.json` niepotwierdzone przez źródła danego ćwiczenia):
- **Single Leg RDL (hantel), (linki) — `rdl.depth`**: tylko BarBend (czuć w tyle uda); ACE i Coach nie mówią o głębokości.
- **Cable Pull Through — `rdl.depth`**: rozciągnięcie tylko BarBend (wersja z gumą); **`mis.roundBack`** i **`ht.mis.arch`** (przeprost na górze): jako błąd tylko Speediance (Gym Mikolo = 5; Coach i oba artykuły BarBend o tym milczą).
- **Stiff-Legged Barbell Deadlift — `rdl.depth`**: sprzeczność: Coach — tylko tak nisko, jak pozwala tył uda; Physitrack — do podłogi. Część wspólna nieustalona → bez zdania o głębokości.
- **Band Good Morning — `gm.depth`**: Coach — łagodne rozciągnięcie, nie niżej niż poziomo; Set For Set — tylko „poczuj rozciąganie”. Druga połowa zdania („nie dalej niż do poziomu”) ma jedno źródło → poza kartą. **`gm.light`**: oba źródła mówią „zacznij lekko” (Set For Set: od lżejszej gumy), ale zdanie mówi o „ciężarze” — dla gumy potrzebne inne brzmienie; do decyzji koordynatora (wzór `gm.light`). **`mis.roundBack`**: jako błąd tylko Set For Set (treść pokrywa `hinge.back`). **`rdl.mis.knees`**: jako błąd tylko Set For Set.

Ćwiczenia otwarte:
- **Rack Pull** (po korekcie): z Coach + BarBend zostają `rack.setup` (nowe brzmienie), `dl.lift` (Coach: hips forwards, straightening knees; BarBend Step 2: push your hips forward… hips fully locked out), `dl.close`. Jednym źródłem: `hinge.back`, `dl.hipsLow`, `rack.lower` (tylko Coach), `rack.mis.high` (tylko BarBend). Rozstrzygnęłoby: uznanie Titan za 4 (wtedy karta poprzedniej wersji bez Breaking Muscle: `hinge.back`, `dl.hipsLow`, `rack.lower`, `rack.mis.high` mają po 2 źródła) albo trzecie źródło szczebla 4 (np. organizacja szkoląca trenerów z opisem rack pull).
- **Sumo Deadlift (kettlebell)** (po korekcie): jedyne źródło szczebla 4 — Onnit (Step 1: stopy szerzej niż barki, palce na zewnątrz, kolana na zewnątrz; Step 2: długi kręgosłup, chwyt oburącz; Step 3: wyprost bioder). Onnit nie mówi „kettlebell między stopami”. Rozstrzygnęłoby: drugie źródło szczebla 4 (np. inny producent kettlebelli z autorem, organizacja szkoląca).
- **Deficit Deadlift** (po korekcie): BarBend + Breaking Muscle = jedno źródło. Potrzebne drugie niezależne (nie Breaking Muscle).
- **Rack Pull — za ciężko na start** (Titan, BarBend): zalecenie o obciążeniu — poza wskazówkami bez liczb; po korekcie i tak jedno źródło szczebla 4.
- **Single Leg RDL (linki) — uchwyt blisko ciała**: tylko ACE 350.
- **Cable Pull Through — „nie ciągnij rękami”**: tylko BarBend (oba artykuły BarBend to jedna organizacja).
- **Single Arm RDL (hantel/linka)**: brak przeczytanego źródła szczebla 4 o wersji obunóż z ciężarem w jednej ręce; ACE 127 opisuje wersję jednonóż (analogia). Druga sesja: wyszukiwanie zwróciło magazyn lifestyle'owy i strony aplikacji. Rozstrzygnęłyby: 2 biblioteki z tą wersją albo potwierdzenie z katalogu, że chodzi o wersję jednonóż (wtedy karta jak Single Leg RDL (hantel)).
- **Smith Machine Stiff-Legged Deadlift**: jedyne przeczytane źródło (Gym Mikolo) = 5. Major Fitness (producent maszyn Smitha, „how to deadlift on smith machine”, 04.09.2025) opisuje tylko RDL, sumo, rack pull i klasyczny martwy ciąg w maszynie Smitha — nie wersję na prostych nogach (analogia). Rozstrzygnęłyby: 2 źródła szczebla 4 o tej wersji.
- **Good Morning off Pins**: EliteFTS (4) i Stoppani (szczebel do oceny, sekcja 4a) są zgodne co do bolców na wysokości bioder, cofania bioder, pauzy na bolcach i niezaokrąglania pleców (oba: „lędźwie wygięte”). Dane w sekcji 2a. Brakuje: oceny Stoppaniego i trzeciego zdania wskazówki/błędu z 2 źródłami. Kandydat nieprzeczytany: artykuł o technice good morning w czasopiśmie trenerskim NSCA (2024, Ross, Comfort, McMahon) — dostępny tylko wpis bibliograficzny, treść niedostępna; jeśli opisuje wersję z bolców, byłby szczeblem 3.
- **Physitrack** — patrz uwaga w sekcji 4 (czy to „dokumentacja innej aplikacji”).

## 6. Dostęp

- ExRx (403) i web.archive.org (blokada) — niedostępne; zgodnie z uzupełnieniem briefu nie używane.
- NASM: brak stron `rack-pull` i `single-leg-romanian-deadlift` (404).
- Breaking Muscle `cable-pull-through` — 404. BarBend `rack-pull` (liczba pojedyncza) — 404, użyty `rack-pulls`.
- Coach „how to deadlift more without getting injured” — treść ucięta, wpisu o deficycie nie znaleziono.
- Druga sesja: Muscle & Strength — 403 (i tak „nie licz” wg rozstrzygnięcia); Bodybuilding.com — przekierowanie do sklepu, 404; DMoose `band-good-mornings` — 404; EliteFTS `pull-thru-band-goodmorning` — 404; Victorem Gear `banded-good-mornings` — 503; The Prehab Guys — biblioteka za logowaniem; Rogue (strona „banded good mornings”) — tylko film, bez tekstu.
- Pominięte jako strony aplikacji: kilka wyników dla Band Good Morning, Good Morning off Pins i Smith SLDL (bez nazw w repo).
- Living.Fit (https://living.fit/blogs/news/how-to-do-good-mornings-with-resistance-bands-or-movement-breakdown) — przeczytane, ale opisuje gumę zaczepioną na wysokości bioder (inne ustawienie niż Band Good Morning z katalogu: guma pod stopami); autor i data niesprawdzone — nieużyte.
