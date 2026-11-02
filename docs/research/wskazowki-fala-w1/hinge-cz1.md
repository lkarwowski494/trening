# Wskazówki techniki — rodzina `hinge`, część 1

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda jak w `docs/research/33-wskazowki-partia2.md`: każde zdanie przy konkretnym ćwiczeniu ma ≥ 2 przeczytane źródła
szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki, CLAUDE.md, 25.10.2026). Źródło o tym samym ćwiczeniu z innym
obciążeniem (sztanga/hantel/linka/guma) liczone jako „(wariant: …)”. Bez liczb i bez uzasadnień zdrowotnych. Zdania z zestawu
ogólnego (`lib/figures/v2/cue-sets.json`), których przeczytane źródła danego ćwiczenia nie potwierdzają, nie trafiają do karty —
lista w sekcji „Otwarte” (uzupełnienie briefu koordynatora, 02.11.2026). Strony innych aplikacji pomijane.

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Rack Pull | gotowe | 4 źródła (producent sprzętu, 3 serwisy); wysokość startu różni się między źródłami — zdanie z częścią wspólną |
| Single Leg RDL (hantel) | gotowe | ACE (hantel) + 2 serwisy (warianty: sztanga/hantel/kettlebell) |
| Single Leg RDL (linki) | gotowe | ACE (linka, wprost) + 2 serwisy (wariant: wolne ciężary) |
| Cable Pull Through | gotowe | 2 serwisy + 2 producentów sprzętu |
| Sumo Deadlift (kettlebell) | gotowe | 3 producentów sprzętu; `sumo.kneesOut` z zestawu ogólnego — tylko 1 źródło, poza kartą |
| Single Arm RDL (hantel/linka) | otwarte | brak źródła o wersji obunóż z ciężarem w jednej ręce (źródła opisują wersję jednonóż) |
| Deficit Deadlift | gotowe | 2 serwisy; ruch = zwykły martwy ciąg wg Breaking Muscle (źródło samo to mówi) |
| Stiff-Legged Barbell Deadlift | gotowe | Coach, Breaking Muscle, Physitrack, BarBend |
| Good Morning off Pins | otwarte | nie zbadane — limit kontekstu (patrz „Stan”) |
| Band Good Morning | otwarte | nie zbadane — limit kontekstu (patrz „Stan”) |
| Smith Machine Stiff-Legged Deadlift | otwarte | jedno przeczytane źródło (producent sprzętu); reszta wyników to strony aplikacji albo opis RDL/martwego ciągu w maszynie Smitha (analogia) |

## 2. Wpisy do `cues.json` → `exercises`

```json
{
  "Rack Pull": {
    "setup": [
      {"c": "rack.setup", "s": [["titan-rack-pulls", "Prepare your rack (at or slightly below knee level)"], ["barbend-rack-pulls", "Step 1: Set Your Rack Height (just below the knee… bottom of your quads)"], ["coach-rack-pull", "How-to: set-up (an inch or two above knee height)"], ["breakingmuscle-deadlift-variations", "Rack Pull (bar starts at your mid-shins)"]]}
    ],
    "move": [
      {"c": "dl.lift", "s": [["coach-rack-pull", "How-to: lift; hold (driving your hips forwards and straightening your knees… stand up straight)"], ["titan-rack-pulls", "Lift; Hold the weight (straighten your legs… upright position, squeeze your glutes)"]]},
      {"c": "rack.lower", "s": [["coach-rack-pull", "How-to: return (control the descent)"], ["titan-rack-pulls", "Hold the weight (carefully lower it)"]]}
    ],
    "tips": [
      {"c": "dl.close", "s": [["coach-rack-pull", "How-to: hold (keep the bar close to your legs)"], ["barbend-rack-pulls", "Step 2: Get Tight and Lift (pull the bar close to your body)"]]},
      {"c": "hinge.back", "s": [["titan-rack-pulls", "Tips (back flat; don't round your back)"], ["coach-rack-pull", "Form tips (keep your back straight)"]]},
      {"c": "dl.hipsLow", "s": [["titan-rack-pulls", "Tips (arms straight… shoulders starting above the bar)"], ["coach-rack-pull", "Form tips (bar almost directly under your shoulders)"]]}
    ],
    "mistakes": [
      {"c": "rack.mis.high", "s": [["breakingmuscle-deadlift-variations", "Rack Pull, tip (don't set the bar too high)"], ["titan-rack-pulls", "Common Mistakes: Wrong rack height (starting too high or too low)"]]}
    ]
  },
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
      {"c": "pt.setup", "s": [["coach-cable-machine-exercises", "Cable pull-through (lowest position… facing away… rope between your legs)"], ["barbend-cable-pull-through-vs-hip-thrust", "How to Do the Cable Pull-Through (lowest setting, rope attachment; rope through your legs)"], ["mikolo-cable-pull-through", "How-to: setup (lowest pulley; face away)"]]}
    ],
    "move": [
      {"c": "pt.move", "s": [["coach-cable-machine-exercises", "Cable pull-through (hinging at the hips… squeeze your glutes and drive your hips forwards)"], ["barbend-cable-pull-through-vs-hip-thrust", "How-to (drive your butt back and hinge… extend your hips fully… squeeze your glutes)"], ["speediance-cable-pull-through", "Step 2; Step 3"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["speediance-cable-pull-through", "Step 2 (back straight… neutral spine)"], ["mikolo-cable-pull-through", "Execution (back flat)"]]},
      {"c": "rdl.knees", "s": [["speediance-cable-pull-through", "Step 2; Common Mistakes: Poor hip hinge and knee bend (rather than squatting down)"], ["mikolo-cable-pull-through", "Tips: stance and knees; Common mistakes: Bending the knees too much (not a squat)"], ["barbend-cable-pull-through-vs-hip-thrust", "How-to (bend your knees slightly)"]]}
    ],
    "mistakes": [
      {"c": "ht.mis.arch", "s": [["speediance-cable-pull-through", "Common Mistakes: Overextending at the top"], ["mikolo-cable-pull-through", "Common mistakes: Overarching the back (squeezing the glutes, not arching the lower back)"]]}
    ]
  },
  "Sumo Deadlift (kettlebell)": {
    "setup": [
      {"c": "sumoKb.setup", "s": [["gymreapers-kettlebell-sumo-deadlift", "How-to (wider-than-shoulder-width stance… toes pointed outwards; kettlebell in between your feet; grip with both hands)"], ["onnit-kettlebell-deadlift-exercises", "Sumo Deadlift, Step 1–2 (stance wider than shoulders, toes out; grip with both hands)"], ["titan-kettlebell-deadlift", "Sumo variation (feet wider than hips, toes slightly outward; arms between legs)"]]}
    ],
    "move": [
      {"c": "sumo.lift", "s": [["onnit-kettlebell-deadlift-exercises", "Sumo Deadlift, Step 1; Step 3 (proud chest; stand tall by extending your hips)"], ["titan-kettlebell-deadlift", "How-to, step 5 (drive your hips forward, stand up) — strona podaje, że wersja sumo różni się tylko ustawieniem"], ["gymreapers-kettlebell-sumo-deadlift", "How-to (stand up… stiffness in the upper torso)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["onnit-kettlebell-deadlift-exercises", "Sumo Deadlift, Step 2 (keeping a long spine)"], ["titan-kettlebell-deadlift", "How-to, step 2 (back and neck neutral)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["gymreapers-kettlebell-sumo-deadlift", "Mistake #2: Excessive Back Rounding"], ["titan-kettlebell-deadlift", "Common mistakes (rounding the back)"]]},
      {"c": "sumoKb.mis.far", "s": [["gymreapers-kettlebell-sumo-deadlift", "Mistake #1: Kettlebell Is Too Far Forward"], ["titan-kettlebell-deadlift", "Common mistakes (kettlebell too far from your ankles)"]]}
    ]
  },
  "Deficit Deadlift": {
    "setup": [
      {"c": "def.setup", "s": [["barbend-deficit-deadlift", "Setting the platform (small surface to elevate… even foot contact)"], ["breakingmuscle-deadlift-variations", "Deficit Deadlift (stand securely on a small platform or a weight plate)"]]}
    ],
    "move": [
      {"c": "dl.lift", "s": [["barbend-deficit-deadlift", "Lift (press through your quads… drive your hips forward… stand tall)"], ["breakingmuscle-deadlift-variations", "Deficit Deadlift (perform a regular deadlift — źródło samo mówi, że ruch jak w zwykłym martwym ciągu)"]]}
    ],
    "tips": [
      {"c": "def.knees", "s": [["breakingmuscle-deadlift-variations", "Deficit Deadlift, tip (don't turn it into a stiff-leg deadlift; bend your knees)"], ["barbend-deficit-deadlift", "Back (bend your knees until your shins touch the bar); Lift (press through your quads)"]]},
      {"c": "def.low", "s": [["breakingmuscle-deadlift-variations", "Deficit Deadlift, tip (start with the lowest height)"], ["barbend-deficit-deadlift", "Common Mistakes: Too deep of a deficit"]]}
    ],
    "mistakes": []
  },
  "Stiff-Legged Barbell Deadlift": {
    "setup": [
      {"c": "sldl.setup", "s": [["coach-stiff-leg-deadlift", "How-to: setup (knees ever so slightly bent… grip the bar overhand)"], ["physitrack-stiff-leg-deadlift", "Step 1 (knees slightly bent… overhand grip; wariant: hantle — strona: sztanga albo hantle)"]]}
    ],
    "move": [
      {"c": "sldl.move", "s": [["coach-stiff-leg-deadlift", "How-to: lift (drive your hips forward… until standing straight)"], ["breakingmuscle-deadlift-variations", "Stiff-Leg Deadlift (hinge at the hips with little leg drive, stand fully)"], ["physitrack-stiff-leg-deadlift", "Step 3"]]}
    ],
    "tips": [
      {"c": "rdl.knees", "s": [["coach-stiff-leg-deadlift", "How-to: knees; return (slightly bent, knees fixed)"], ["breakingmuscle-deadlift-variations", "Stiff-Leg Deadlift (legs only slightly bent)"], ["physitrack-stiff-leg-deadlift", "Common mistakes (knees slightly bent, but not too much)"]]},
      {"c": "hinge.back", "s": [["coach-stiff-leg-deadlift", "How-to: stance and back (back should remain flat)"], ["physitrack-stiff-leg-deadlift", "Step 2 (keeping your back straight)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["physitrack-stiff-leg-deadlift", "Common mistakes: Rounding the back"], ["coach-stiff-leg-deadlift", "How-to: depth (if your back starts to round, reduce how far the bar travels)"]]},
      {"c": "rdl.mis.knees", "s": [["physitrack-stiff-leg-deadlift", "Common mistakes: Bending the knees too much"], ["barbend-stiff-leg-deadlift", "opis (minimizes nearly all knee flexion)"]]}
    ]
  }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `rack.setup` | Ustaw sztangę na bolcach albo hakach stojaka — gdzieś od połowy goleni do okolic kolan. | Set the bar on the rack pins or hooks — anywhere from mid-shin to around knee height. | Brak zdania o wysokości startu. Źródła różnią się (połowa goleni; tuż pod kolanem; tuż nad kolanem) — zdanie podaje część wspólną (przedział). |
| `rack.lower` | Odkładaj sztangę na bolce spokojnie, pod kontrolą. | Lower the bar back to the pins under control. | `dl.lower` opisuje opuszczanie do podłogi — przeczytane źródła rack pull mówią tylko o kontroli. |
| `rack.mis.high` | Bolce ustawione za wysoko. | Pins set too high. | Błąd specyficzny dla rack pull. |
| `slrdl.setup` | Stań na jednej nodze, kolano lekko ugięte. | Stand on one leg with a slight bend in the knee. | Brak zdania o ustawieniu jednonóż. |
| `slrdl.move` | Pochyl się, cofając biodro, a wolną nogę prowadź prosto w tył; wróć, wypychając biodra w przód. | Hinge at the hip and let your free leg travel straight back; drive your hips forward to stand. | `rdl.move`/`rdl.dbMove` nie opisują wolnej nogi. |
| `slrdl.mis.hipOpen` | Biodro wolnej nogi skręca się i ucieka w górę. | The hip of the free leg rotates and opens upward. | Błąd specyficzny dla wersji jednonóż. |
| `pt.setup` | Lina na najniższym wyciągu; stań tyłem do maszyny i trzymaj linę między nogami. | Rope on the lowest pulley; stand facing away from the machine, holding the rope between your legs. | Brak zdania o ustawieniu przy wyciągu. |
| `pt.move` | Cofaj biodra i pochyl tułów; wróć, wypychając biodra w przód i napinając pośladki. | Push your hips back and lean forward; come up by driving your hips forward and squeezing your glutes. | `rdl.move` mówi o sztandze przy nogach — tu lina między nogami. |
| `sumoKb.setup` | Stań szeroko, palce stóp na zewnątrz, kettlebell między stopami; chwyć go oburącz. | Take a wide stance, toes turned out, kettlebell between your feet; grab it with both hands. | `sumo.stance`/`sumo.grip` mówią o sztandze i dłoniach wewnątrz stóp względem sztangi. |
| `sumoKb.mis.far` | Kettlebell stoi za daleko z przodu, zamiast między stopami. | The kettlebell sits too far in front instead of between your feet. | Brak odpowiednika. |
| `def.setup` | Stań stabilnie na niskim podwyższeniu albo talerzu; sztanga zostaje na podłodze. | Stand firmly on a low platform or a plate; the bar stays on the floor. | Brak zdania o podwyższeniu. |
| `def.knees` | Nie zamieniaj tego w martwy ciąg na prostych nogach — ugnij kolana, żeby sięgnąć sztangi. | Don't turn it into a stiff-leg deadlift — bend your knees to reach the bar. | Wskazówka specyficzna dla deficytu. |
| `def.low` | Zacznij od niskiego podwyższenia. | Start with a low platform. | Wskazówka specyficzna dla deficytu, bez liczb. |
| `sldl.setup` | Chwyć sztangę nachwytem, kolana lekko ugięte. | Grab the bar overhand, knees slightly bent. | `rdl.setup` podaje rozstaw stóp i start z góry — źródła SLDL różnią się co do startu (podłoga vs stanie), więc tylko część wspólna. |
| `sldl.move` | Podnoś, wypychając biodra w przód — nogi prawie nie pracują — aż staniesz prosto. | Lift by driving your hips forward — the legs barely help — until you're standing tall. | Opis ruchu bez sztangi „przy nogach” (to tylko jedno źródło). |

## 4. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `titan-rack-pulls` | https://titan.fitness/blogs/workouts/rack-pulls | Titan Fitness (producent sprzętu) | 4 | „Adjust the height of your rack so the bar is at or slightly below knee level” |
| `barbend-rack-pulls` | https://barbend.com/rack-pulls/ | BarBend | 4 | Step 1–3; Common Rack Pull Mistakes |
| `coach-rack-pull` | https://www.coachweb.com/barbell-exercises/7370/how-to-do-the-rack-pull | Coach | 4 | „Keep the bar close to your legs as you stand up straight.” |
| `breakingmuscle-deadlift-variations` | https://breakingmuscle.com/deadlift-variations/ | Breaking Muscle | 4 | wpisy Deficit Deadlift, Rack Pull, Stiff-Leg Deadlift |
| `ace-127` | https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/ | ACE | 4 | instrukcja |
| `ace-350` | https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/ | ACE | 4 | „Place a cable pulley at the lowest position and attach a single handle.” |
| `barbend-single-leg-romanian-deadlift` | https://barbend.com/single-leg-romanian-deadlift/ | BarBend | 4 | Step 1–3; Form tips |
| `coach-single-leg-romanian-deadlift` | https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift | Coach | 4 | Set-up; The Hinge; The Return; Common mistakes |
| `barbend-cable-pull-through-vs-hip-thrust` | https://barbend.com/cable-pull-through-vs-hip-thrust/ | BarBend | 4 | „Set the pulley of a cable machine to the lowest setting and hook the rope attachment to it.” |
| `coach-cable-machine-exercises` | https://www.coachweb.com/exercises/8648/cable-machine-exercises | Coach | 4 | wpis „Cable pull-through” |
| `speediance-cable-pull-through` | https://www.speediance.com/blogs/fitness/cable-pull-through | Speediance (producent sprzętu) | 4 | Step 1–4; Common Mistakes and Fixes |
| `mikolo-cable-pull-through` | https://gym-mikolo.com/blogs/home-gym/cable-pull-throughs-the-underrated-glute-builder-you-shouldn-t-skip | Gym Mikolo (producent sprzętu) | 4 | How-to; Tips; Common mistakes |
| `gymreapers-kettlebell-sumo-deadlift` | https://uk.gymreapers.com/blogs/news/kettlebell-sumo-deadlift | Gym Reapers (producent akcesoriów) | 4 | „Set up with a kettlebell in between your feet.”; Mistake #1–4 |
| `onnit-kettlebell-deadlift-exercises` | https://www.onnit.com/blogs/the-edge/the-best-kettlebell-deadlift-exercises-for-your-workout | Onnit (producent kettlebelli; autor CSCS) | 4 | sekcja Sumo Deadlift, Step 1–3 |
| `titan-kettlebell-deadlift` | https://titan.fitness/blogs/workouts/kettlebell-deadlift | Titan Fitness | 4 | how-to; wariant sumo; common mistakes |
| `barbend-deficit-deadlift` | https://barbend.com/deficit-deadlift/ | BarBend | 4 | how-to; Common Mistakes |
| `coach-stiff-leg-deadlift` | https://www.coachweb.com/leg-exercises/7387/how-to-do-the-stiff-leg-deadlift | Coach | 4 | „Rather than locked straight, your knees should be ever so slightly bent.” |
| `physitrack-stiff-leg-deadlift` | https://www.physitrack.com/exercise-library/how-to-perform-the-stiff-leg-deadlift-exercise | Physitrack | 4 | Step 1–3; Common mistakes („Can be done with either barbell or dumbbell.”) |
| `barbend-stiff-leg-deadlift` | https://barbend.com/stiff-leg-deadlift/ | BarBend | 4 | opis („the lifter minimizes nearly all knee flexion throughout the movement”) |

Uwaga: przeczytane, ale nie użyte w kartach: `barbend-cable-pull-through` (https://barbend.com/cable-pull-through/ — opis główny z gumą) i `mikolo-smith-stiff-leg` (https://gym-mikolo.com/blogs/home-gym/mastering-the-stiff-leg-deadlift-on-the-smith-machine-a-complete-guide — jedyne źródło Smitha). Physitrack — w `orgs` już jest; czy to „strona innej aplikacji” — do oceny koordynatora (w `orgs` figuruje jako biblioteka ćwiczeń dla fizjoterapeutów).

```json
{
  "orgs": {
    "Titan Fitness": {"name": "Titan Fitness — blog producenta sprzętu siłowego (titan.fitness)", "level": 4, "kind": "maker"},
    "Speediance": {"name": "Speediance — blog producenta sprzętu (speediance.com)", "level": 4, "kind": "maker"},
    "Gym Mikolo": {"name": "Gym Mikolo — blog producenta sprzętu do domowej siłowni (gym-mikolo.com)", "level": 4, "kind": "maker"},
    "Gym Reapers": {"name": "Gym Reapers — blog producenta akcesoriów siłowych (gymreapers.com)", "level": 4, "kind": "maker"},
    "Onnit": {"name": "Onnit — The Edge, blog producenta kettlebelli i sprzętu (onnit.com; autor CSCS)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "titan-rack-pulls": {"org": "Titan Fitness", "title": "Rack Pulls: Benefits, Muscles Worked, and How To", "url": "https://titan.fitness/blogs/workouts/rack-pulls", "level": 4},
    "barbend-rack-pulls": {"org": "BarBend", "title": "Learn Rack Pulls for More Pulling Strength and a Bigger Back", "url": "https://barbend.com/rack-pulls/", "level": 4},
    "coach-rack-pull": {"org": "Coach", "title": "How To Do The Rack Pull", "url": "https://www.coachweb.com/barbell-exercises/7370/how-to-do-the-rack-pull", "level": 4},
    "breakingmuscle-deadlift-variations": {"org": "Breaking Muscle", "title": "15 Deadlift Variations for Muscle, Strength, and More", "url": "https://breakingmuscle.com/deadlift-variations/", "level": 4},
    "ace-127": {"org": "ACE", "title": "Single-Arm Single-Leg Romanian Deadlift", "url": "https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/", "level": 4},
    "ace-350": {"org": "ACE", "title": "Single-leg Romanian Deadlift (cable)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/350/single-leg-romanian-dead-lift/", "level": 4},
    "barbend-single-leg-romanian-deadlift": {"org": "BarBend", "title": "Single Leg Romanian Deadlift", "url": "https://barbend.com/single-leg-romanian-deadlift/", "level": 4},
    "coach-single-leg-romanian-deadlift": {"org": "Coach", "title": "How To Do The Single-Leg Romanian Deadlift With Perfect Form", "url": "https://www.coachweb.com/leg-exercises/8130/how-to-do-the-single-leg-romanian-deadlift", "level": 4},
    "barbend-cable-pull-through-vs-hip-thrust": {"org": "BarBend", "title": "Cable Pull-Through vs. Hip Thrust", "url": "https://barbend.com/cable-pull-through-vs-hip-thrust/", "level": 4},
    "coach-cable-machine-exercises": {"org": "Coach", "title": "The Best Cable Machine Exercises For All Levels", "url": "https://www.coachweb.com/exercises/8648/cable-machine-exercises", "level": 4},
    "speediance-cable-pull-through": {"org": "Speediance", "title": "Cable Pull-Through Guide: Correct Form & Benefits", "url": "https://www.speediance.com/blogs/fitness/cable-pull-through", "level": 4},
    "mikolo-cable-pull-through": {"org": "Gym Mikolo", "title": "Cable Pull-Throughs: The Underrated Glute Builder", "url": "https://gym-mikolo.com/blogs/home-gym/cable-pull-throughs-the-underrated-glute-builder-you-shouldn-t-skip", "level": 4},
    "gymreapers-kettlebell-sumo-deadlift": {"org": "Gym Reapers", "title": "Kettlebell Sumo Deadlift: How-To, Muscles, Benefits, Mistakes", "url": "https://uk.gymreapers.com/blogs/news/kettlebell-sumo-deadlift", "level": 4},
    "onnit-kettlebell-deadlift-exercises": {"org": "Onnit", "title": "The Best Kettlebell Deadlift Exercises For Your Workout", "url": "https://www.onnit.com/blogs/the-edge/the-best-kettlebell-deadlift-exercises-for-your-workout", "level": 4},
    "titan-kettlebell-deadlift": {"org": "Titan Fitness", "title": "Kettlebell Deadlift: Benefits, Muscles Worked, and How To", "url": "https://titan.fitness/blogs/workouts/kettlebell-deadlift", "level": 4},
    "barbend-deficit-deadlift": {"org": "BarBend", "title": "How To Do The Deficit Deadlift To Enhance Your Pulling Power", "url": "https://barbend.com/deficit-deadlift/", "level": 4},
    "coach-stiff-leg-deadlift": {"org": "Coach", "title": "How To Do The Stiff-Leg Deadlift And Strengthen Your Hamstrings", "url": "https://www.coachweb.com/leg-exercises/7387/how-to-do-the-stiff-leg-deadlift", "level": 4},
    "physitrack-stiff-leg-deadlift": {"org": "Physitrack", "title": "Step-by-step guide to the stiff leg deadlift exercise", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-stiff-leg-deadlift-exercise", "level": 4},
    "barbend-stiff-leg-deadlift": {"org": "BarBend", "title": "Stiff Leg Deadlift", "url": "https://barbend.com/stiff-leg-deadlift/", "level": 4}
  }
}
```

## 5. Otwarte

Błędy zestawów ogólnych (zdania z `cue-sets.json` niepotwierdzone przez źródła danego ćwiczenia):
- **Rack Pull — `mis.roundBack`**: jako błąd tylko Titan; treść pokrywa wskazówka `hinge.back` (2 źródła).
- **Single Leg RDL (hantel), (linki) — `rdl.depth`**: tylko BarBend (czuć w tyle uda); ACE i Coach nie mówią o głębokości.
- **Cable Pull Through — `rdl.depth`**: rozciągnięcie tylko BarBend (wersja z gumą); **`mis.roundBack`**: jako błąd tylko Speediance.
- **Sumo Deadlift (kettlebell) — `sumo.kneesOut`**: tylko Onnit; Titan i Gym Reapers nie mówią o kolanach.
- **Deficit Deadlift — `hinge.back`, `dl.close`, `mis.roundBack`**: plecy płasko tylko BarBend; reszta brak drugiego źródła o deficycie.
- **Stiff-Legged Barbell Deadlift — `rdl.depth`**: sprzeczność: Coach — tylko tak nisko, jak pozwala tył uda; Physitrack — do podłogi. Część wspólna nieustalona → bez zdania o głębokości.

Pozostałe:
- **Rack Pull — za ciężko na start** (Titan, BarBend zgodne): zalecenie o obciążeniu — poza wskazówkami bez liczb; do decyzji koordynatora (wzór: `gm.light`). „Nie odbijaj od bolców” — tylko Titan. Stopy i chwyt — tylko Titan.
- **Single Leg RDL (linki) — uchwyt blisko ciała**: tylko ACE 350.
- **Cable Pull Through — „nie ciągnij rękami”**: tylko BarBend (guma).
- **Single Arm RDL (hantel/linka)**: brak przeczytanego źródła o wersji obunóż z ciężarem w jednej ręce; ACE 127 opisuje wersję jednonóż (analogia). Rozstrzygnęłyby: 2 biblioteki z tą wersją (albo potwierdzenie z katalogu, że to wersja jednonóż — wtedy karta jak Single Leg RDL (hantel)).
- **Smith Machine Stiff-Legged Deadlift**: przeczytane tylko Gym Mikolo (start z bolców tuż pod biodrami, biodra w tył, lekko ugięte kolana, neutralne plecy). Drugie źródło szczebla 4 o tej wersji nie znalezione (wyniki to strony aplikacji albo RDL/martwy ciąg w Smicie — analogia).
- **Good Morning off Pins, Band Good Morning**: nie zbadane (limit kontekstu).

## 6. Dostęp

- ExRx (403) i web.archive.org (blokada) — niedostępne; zgodnie z uzupełnieniem briefu nie używane.
- NASM: brak stron `rack-pull` i `single-leg-romanian-deadlift` (404).
- Breaking Muscle `cable-pull-through` — 404. BarBend `rack-pull` (liczba pojedyncza) — 404, użyty `rack-pulls`.
- Coach „how to deadlift more without getting injured” — treść ucięta, wpisu o deficycie nie znaleziono.

## Stan

- Zrobione: Rack Pull, Single Leg RDL (hantel), Single Leg RDL (linki), Cable Pull Through, Sumo Deadlift (kettlebell), Deficit Deadlift, Stiff-Legged Barbell Deadlift (gotowe); Single Arm RDL, Smith Machine Stiff-Legged Deadlift (otwarte z powodem).
- Zostało: Good Morning off Pins, Band Good Morning — szukać stron „good morning from pins/safeties” i „banded good morning” (BarBend, Coach, Breaking Muscle, producenci gum/sprzętu, np. Titan, Rogue); Smith SLDL — drugi producent maszyn Smitha (np. Major Fitness, REP — strony o RDL/martwym ciągu w Smicie sprawdzić, czy opisują wersję na prostych nogach).
- Pułapki: ExRx i Wayback nie działają; NASM nie ma tych wariantów; wiele wyników wyszukiwania to strony aplikacji (pomijać); Breaking Muscle `deadlift-variations` ma kilka wariantów na jednej stronie.
