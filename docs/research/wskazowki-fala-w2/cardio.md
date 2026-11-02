# Wskazówki techniki — rodzina `cardio` (fala W2, grupa G6)

- Data: 02.11.2026, fala W2 (badacz-merytoryczny, agent).
- Co zrobiono: nowe drugie źródła szczebla 4 dla Skakanki, Battle Ropes, Orbitreka i Stair Climbera (producenci własnego rodzaju sprzętu, ISSA); błędy wnioskowane dla kart własnych bez błędów (Rowing Machine, Burpees) i dopełnień `partial` (Bieg, Rower); karty częściowe dla Assault Bike, High Knees, Fast Skipping, Treadmill Walking, Stair Climber. Ski Erg, Jumping Jacks, Carioca — próby bez wyniku (sekcja 6).
- Podstawa: wyniki W1 po przeliczeniu 02.11.2026 (`wskazowki-fala-w1/cardio.md`, sekcje „Korekta szczebli” i „Blok do wdrożenia”), zasady szczebli z 02.11.2026 (producent = 4 tylko dla własnego rodzaju sprzętu; treść firmowana albo autor z datą). Bez liczb i twierdzeń zdrowotnych.
- Status: PROPOZYCJA do integracji przez koordynatora. Cardio nie ma rysunków — karta częściowa (bez błędu albo bez ruchu) może wejść (brief W2).
- Prefiks skakanki: `jrope.*` (zmiana koordynatora grupy W2, 02.11.2026) — `rope.*` należy do Rope Climb (rodzina pull_up, W1/W2); zdania skakanki z W1 (`rope.*` w `wskazowki-fala-w1/cardio.md`) przy integracji też jako `jrope.*`.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz) | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Skakanka | general (jump) + wpis `open` | **gotowe** | ACE + Elite Jumps (producent skakanek, autor i data). `jrope.length` otwarte (drugie źródło tylko Elevate Rope — warunkowe). Wpis `open` w `cues.json` można zamknąć |
| Battle Ropes | open | **gotowe** | ISSA (firmowane, 05.02.2024) + Bells of Steel (producent lin, 16.04.2025); ruch — część wspólna (bez „naprzemiennie”) |
| Orbitrek | general (cardioMachine) | **gotowe** | SOLE (producent orbitreków) + NordicTrack + Sunny; błąd ze źródła + wniosek |
| Stair Climber | general (cardioMachine) | **częściowe** (ustawienie, wskazówka, błąd; bez ruchu) | TRUE Fitness (producent schodołazów, bez daty) + Bells of Steel; `stair.foot` — jedno źródło (otwarte) |
| Assault Bike | general (bike) + wpis `open` | **częściowe** (ustawienie + 2 błędy; bez ruchu) | ruch rąk `abike.arms` — tylko REP (otwarte); błędy: `bike.mis.rock` (REP + Yoke i Armbruster, wariant), `bike.mis.low` (wniosek). Wpis `open` zostaje |
| Treadmill Walking | general (cardioMachine) | **częściowe** (tylko wskazówki) | `walk.upright`, `walk.gaze`, `walk.rails` — źródła z W1 (część to wariant z nachyleniem: uproszczenie); `tread.straddle` nadal jedno źródło |
| High Knees | general (jump) | **częściowe** (ruch + błąd wnioskowany), jedno źródło | `hk.knee` — Carr (szczebel 3), wariant w marszu → „jedno źródło” + „uproszczenie: wariant (w miejscu vs w marszu)” |
| Fast Skipping | general (jump) | **częściowe** (ruch), jedno źródło, warunkowo | `skip.move` — Carr (3); warunek: katalog rozumie „Fast Skipping” jako skip z wysokim kolanem (W1, Otwarte) |
| Rowing Machine | own (S1M2T2E0) | **tylko błędy wnioskowane dopisane** | 2 błędy: kolejność nóg i rąk (C2 potwierdza standard) |
| Burpees | own, `partial` (S0M2T0E0) | **tylko błędy dopisane** | `plank.mis.sag` (NASM wprost + wniosek), `burpee.mis.half` (wniosek) |
| Bieg | own, `partial` | **tylko błąd wnioskowany dopisany** | `run.mis.cross` (wniosek z `run.arms` z W1 + NASM) |
| Rower | own, `partial` | **tylko błąd wnioskowany dopisany** | `bike.mis.low` (wniosek z `bike.seat`) |
| Incline Walk (bieżnia) | own, `partial` | bez zmian w W2 | błąd `walk.mis.bend` już w dopełnieniu W1 |
| Jumping Jacks | general (jump) | **otwarte** | tylko NASM; Pfizer Health Answers bez autora i daty = 5 |
| Ski Erg | open | **otwarte** | tylko Concept2; Fitness Volt (strona HYROX/SkiErg) — „Editorial Team”, bez autora = 5 |
| Carioca Quick Step | open | **otwarte** | brak źródła ≤ 4 (W1); w W2 nie szukano ponownie |

## 2. Blok do wdrożenia

### Blok do wdrożenia

Format `data/zrodla/cues.json` → `exercises`. Karty z `"_tryb": "dopisz"` — tylko dopisanie do istniejących list (karta własna albo dopełnienie `partial` z W1). „Assault Bike” i „Skakanka” — wpisy w `open`: Skakankę usunąć z `open` (karta gotowa), Assault Bike zostawić (bez ruchu).

```json
{
  "Skakanka": {
    "setup": [
      {"c": "jrope.elbows", "s": [["ace-fitfacts-rope", "Learning the Basics (barki luźno, łokcie blisko tułowia; parafraza)"], ["elitejumps-mistakes", "błąd 7 „Drifting Hands” (dłonie blisko bioder, łokcie lekko ugięte; parafraza)"]]}
    ],
    "move": [
      {"c": "jrope.wrists", "s": [["ace-fitfacts-rope", "Learning the Basics („Turn the rope from the wrist…”)"], ["elitejumps-mistakes", "błąd 1 „Too Much Arm Movement” („Your wrists and forearms should be doing most of the work, not your entire arms.”)"]]},
      {"c": "jrope.low", "s": [["ace-fitfacts-rope", "Learning the Basics (skacz nisko; parafraza)"], ["elitejumps-mistakes", "błąd 2 „Jumping Too High” („Aim to jump just high enough for the rope to pass under your feet.”)"]]}
    ],
    "tips": [
      {"c": "jrope.upright", "s": [["ace-fitfacts-rope", "Learning the Basics (nie garb się, plecy proste, głowa w górze; parafraza)"], ["elitejumps-mistakes", "błąd 8 (wyprostowana postawa, napięty brzuch; parafraza)"]]}
    ],
    "mistakes": [
      {"c": "jrope.mis.arms", "s": [["elitejumps-mistakes", "błąd 1 „Too Much Arm Movement”"], ["ace-fitfacts-rope", "Learning the Basics (standard: kręcenie z nadgarstków)"], ["wniosek", "jrope.wrists"]]},
      {"c": "jrope.mis.high", "s": [["elitejumps-mistakes", "błąd 2 „Jumping Too High”"], ["ace-fitfacts-rope", "Learning the Basics (standard: niskie skoki)"], ["wniosek", "jrope.low"]]}
    ]
  },
  "Battle Ropes": {
    "setup": [
      {"c": "bropes.stance", "s": [["issa-battle-rope", "#1 Battle Rope Waves („Bend at your knees and hips so that you're in a quarter squat position.”); zasady ogólne (napięty brzuch)"], ["bos-battle-ropes", "krok o postawie („…knees slightly bent, and core engaged.”)"]]}
    ],
    "move": [
      {"c": "bropes.move", "s": [["issa-battle-rope", "#1 („Now begin moving both wrists and use your arms to make waves.”)"], ["bos-battle-ropes", "fale naprzemienne (ręce na zmianę w górę i w dół; parafraza)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "bropes.mis.hunch", "s": [["bos-battle-ropes", "Common Mistakes 1 „Poor Posture” („Rounding your back or hunching your shoulders…”)"], ["issa-battle-rope", "#1 i zasady ogólne (standard: „Keep your chest up and shoulders back…”)"]]}
    ]
  },
  "Orbitrek": {
    "setup": [
      {"c": "ell.upright", "s": [["sole-elliptical", "Posture („Keep your back straight and shoulders relaxed.”)"], ["nordictrack-elliptical", "form checklist („Maintain upright posture…”)"], ["sunny-elliptical-form", "Posture (wyprostowana sylwetka; parafraza)"]]}
    ],
    "move": [
      {"c": "ell.arms", "s": [["sole-elliptical", "„Push and pull the handles in sync with your leg movements.”"], ["nordictrack-elliptical", "Pro Tips „Use Arms Actively” (pchanie i ciągnięcie rączek; parafraza)"]]}
    ],
    "tips": [
      {"c": "ell.grip", "s": [["sunny-elliptical-form", "Handlebars („Gently hold onto the handlebars with minimal tension in your hands.”)"], ["nordictrack-elliptical", "form checklist („Keep your grip light but steady on the handles”)"], ["sole-elliptical", "„Hold the handles lightly to avoid gripping too hard.”"]]}
    ],
    "mistakes": [
      {"c": "ell.mis.lean", "s": [["sole-elliptical", "Mistakes („…leaning too heavily on the handlebars.”)"], ["wniosek", "ell.upright"]]}
    ]
  },
  "Stair Climber": {
    "setup": [
      {"c": "walk.upright", "s": [["true-climber-tips", "„Stand tall with a straight back, shoulders relaxed, and core engaged…”"], ["bellsofsteel-stair", "form („Keep your back straight and engage your core.”)"]]}
    ],
    "move": [],
    "tips": [
      {"c": "stair.rails", "s": [["bellsofsteel-stair", "form (nie opieraj się mocno na poręczach; parafraza)"], ["true-climber-tips", "(„…you shouldn't use the handles to support yourself…”)"]]}
    ],
    "mistakes": [
      {"c": "stair.mis.lean", "s": [["true-climber-tips", "(„Leaning on the handles for support…”) — wymienione jako błąd"], ["bellsofsteel-stair", "form (standard: bez mocnego opierania się na poręczach)"], ["wniosek", "walk.upright"]]}
    ]
  },
  "Assault Bike": {
    "setup": [
      {"c": "bike.seat", "s": [["rep-airbike-setup", "seat height (kolano lekko ugięte przy pedale w dole; parafraza)"], ["c2-bikeerg-setup", "(wariant: rower powietrzny bez ruchomych rączek) lekkie ugięcie przy pełnym wyproście"]]},
      {"c": "bike.foot", "s": [["rep-airbike-setup", "seat height (pedałowanie przednią częścią stopy; parafraza)"], ["c2-bikeerg-setup", "(wariant) przednia część stopy na pedale"], ["hss-bike", "(wariant: rower stacjonarny) Foot position"]]}
    ],
    "move": [],
    "tips": [],
    "mistakes": [
      {"c": "bike.mis.rock", "s": [["rep-airbike-setup", "seat height (kołysanie bioder przy za wysokim siodełku; parafraza)"], ["hk-yoke-cycling", "(wariant: rower stacjonarny) „The rider's hips will rock back and forth”"]]},
      {"c": "bike.mis.low", "s": [["wniosek", "bike.seat"]]}
    ]
  },
  "Treadmill Walking": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "walk.upright", "s": [["lifefitness-rails", "(wariant: z nachyleniem) wyprostowana postawa"], ["nordictrack-incline", "(wariant: z nachyleniem) napięty brzuch, neutralny kręgosłup; parafraza"]]},
      {"c": "walk.gaze", "s": [["lifespan-treadmill-safety", "Posture / common mistakes (wzrok przed siebie; parafraza)"], ["nordictrack-incline", "(wariant: z nachyleniem) Form First („…look ahead (not down)…”)"]]},
      {"c": "walk.rails", "s": [["lifefitness-rails", "(wariant: z nachyleniem) („…keep an upright posture and don't lean back!”)"], ["nordictrack-incline", "(wariant: z nachyleniem) poręcze do równowagi"], ["berling-2006", "abstrakt (mocne trzymanie poręczy obniżało wysiłek; parafraza)"]]}
    ],
    "mistakes": []
  },
  "High Knees": {
    "setup": [],
    "move": [
      {"c": "hk.knee", "s": [["carr-hk-drills", "(wariant: w marszu do przodu) ćwiczenia z wysokim kolanem — kolano do wysokości biodra; parafraza"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "hk.mis.low", "s": [["wniosek", "hk.knee"]]}
    ]
  },
  "Fast Skipping": {
    "setup": [],
    "move": [
      {"c": "skip.move", "s": [["carr-hk-drills", "skip z wysokim kolanem; parafraza"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Rowing Machine": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "erg.mis.arms", "s": [["wniosek", "erg.drive"], ["c2-technique", "The Drive (standard: ręce pracują na końcu, po nogach i tułowiu)"]]},
      {"c": "erg.mis.knees", "s": [["wniosek", "erg.recovery"], ["c2-technique", "The Recovery (standard: kolana uginają się dopiero, gdy dłonie miną kolana)"]]}
    ]
  },
  "Burpees": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "plank.mis.sag", "s": [["nasm-squat-thrust-burpees", "Common Mistakes (biodra opadają w podporze; parafraza — odczyt W1)"], ["wniosek", "burpee.down"]]},
      {"c": "burpee.mis.half", "s": [["wniosek", "burpee.up"], ["pmc-9517252", "2.3 (standard: „Jump to full hip and knee extension.”)"]]}
    ]
  },
  "Bieg": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "run.mis.cross", "s": [["wniosek", "run.arms"], ["nasm-running-gait", "What to Observe — Anterior View (ręce nie przechodzą przez linię środkową ciała; parafraza — odczyt W1)"]]}
    ]
  },
  "Rower": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "bike.mis.low", "s": [["wniosek", "bike.seat"]]}
    ]
  }
}
```

Uwagi do bloku:
- Skakanka, Battle Ropes, Orbitrek — „gotowe” (ustawienie + ruch + ≥ 1 błąd), bez oznaczenia „jedno źródło”.
- High Knees, Fast Skipping — „jedno źródło” (szczebel 3, Carr; czytany w przedruku — W1) i „uproszczenie: wariant” przy High Knees. Jeśli koordynator nie przyjmie przedruku — oba wracają do otwartych.
- Treadmill Walking — „uproszczenie: wariant (marsz z nachyleniem → bez nachylenia)” dla źródeł oznaczonych „wariant”; zdania i źródła z W1 (nie czytane ponownie w W2).
- Rower, Bieg, Burpees — zdania `run.arms` (W1) i `bike.seat` (aplikacja) to podstawa wniosku; `run.arms` musi wejść razem z dopełnieniem W1.

## 3. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| jrope.elbows | Łokcie trzymaj blisko tułowia. | Keep your elbows close to your body. | z W1 (nie było w pl.json); ACE + Elite Jumps |
| jrope.wrists | Kręć skakanką ruchem nadgarstków. | Turn the rope with your wrists. | z W1; ACE + Elite Jumps |
| jrope.low | Skacz nisko — tylko tyle, żeby skakanka przeszła pod stopami. | Jump low — just high enough for the rope to pass under your feet. | z W1; ACE + Elite Jumps |
| jrope.upright | Stój prosto, głowa w górze — nie garb się. | Stand tall, head up — don't hunch. | ZMIENIONE względem W1: usunięte „wzrok przed siebie” (było tylko u B. Lee = 5) |
| jrope.mis.arms | Kręcenie skakanką całymi rękami zamiast nadgarstkami. | Turning the rope with your whole arms instead of your wrists. | zaprzecza `jrope.wrists`; Elite Jumps wprost jako błąd |
| jrope.mis.high | Za wysokie skoki. | Jumping too high. | zaprzecza `jrope.low`; Elite Jumps wprost jako błąd |
| bropes.stance | Złap końce liny, lekko ugnij kolana i biodra, napnij brzuch. | Grab the rope ends, bend your knees and hips slightly, brace your core. | część wspólna ISSA (ćwierćprzysiad) i BoS (kolana lekko ugięte, brzuch napięty); rozstaw stóp tylko BoS — pominięty |
| bropes.move | Ruszaj rękami w górę i w dół, robiąc na linach fale. | Move your arms up and down to send waves through the ropes. | część wspólna; „naprzemiennie” tylko BoS (ISSA: oba nadgarstki, bez rytmu) |
| bropes.mis.hunch | Okrągłe plecy i barki zwinięte do przodu. | Rounding your back and hunching your shoulders forward. | BoS wprost jako błąd; ISSA standard „chest up, shoulders back” |
| ell.upright | Plecy proste — nie pochylaj się w pasie. | Keep your back straight — don't bend forward at the waist. | z W1; SOLE + NordicTrack + Sunny |
| ell.arms | Pchaj i ciągnij rączki w rytm kroków. | Push and pull the handles in time with your legs. | SOLE + NordicTrack |
| ell.grip | Rączki trzymaj luźno, bez mocnego ściskania. | Hold the handles lightly, without squeezing hard. | z W1; Sunny + NordicTrack + SOLE |
| ell.mis.lean | Pochylanie się do przodu i opieranie na rączkach. | Leaning forward and resting your weight on the handles. | zaprzecza `ell.upright`; SOLE wprost jako błąd |
| stair.rails | Poręczy używaj tylko do równowagi — nie wspieraj się na nich mocno. | Use the rails for balance only — don't lean your weight on them. | z W1; BoS + TRUE |
| stair.mis.lean | Wieszanie się na poręczach i pochylanie nad stopniami. | Hanging on the rails and leaning over the steps. | zaprzecza `walk.upright` (ustawienie tej karty); TRUE wprost jako błąd, BoS standard |
| bike.mis.low | Za nisko ustawione siodełko — na dole ruchu pedału kolano zostaje mocno zgięte. | Seat too low — your knee stays deeply bent at the bottom of the pedal stroke. | zaprzecza `bike.seat` (noga prawie prosta w najniższym położeniu pedału) |
| hk.knee | Unoś kolana na zmianę do wysokości bioder. | Drive your knees up to hip height, one at a time. | z W1; Carr (3) |
| hk.mis.low | Kolana unoszone wyraźnie poniżej bioder. | Knees coming up well below hip height. | zaprzecza `hk.knee` |
| skip.move | Skacz rytmicznie z nogi na nogę, za każdym razem unosząc wysoko kolano. | Skip rhythmically from foot to foot, driving one knee up each time. | z W1; Carr (3) |
| erg.mis.arms | Zginanie rąk, zanim nogi się wyprostują. | Bending your arms before your legs have straightened. | zaprzecza `erg.drive` (nogi → tułów → ręce) |
| erg.mis.knees | Uginanie kolan, zanim uchwyt minie kolana. | Bending your knees before the handle has passed them. | zaprzecza `erg.recovery` (ręce, tułów, dopiero potem kolana) |
| burpee.mis.half | Wyskok bez wyprostu bioder i kolan. | Jumping without fully straightening your hips and knees. | zaprzecza `burpee.up` |
| run.mis.cross | Wymachiwanie rękami w poprzek ciała. | Swinging your arms across your body. | zaprzecza `run.arms` (W1) |

Istniejące zdania użyte ponownie: `walk.upright`, `walk.gaze`, `walk.rails`, `bike.seat`, `bike.foot`, `plank.mis.sag`; z dopełnień W1: `bike.mis.rock`, `walk.gaze`. Każde nowe zdanie: wpis w rejestrze twierdzeń (`check:claims`) i w słowniku terminów przy integracji.

## 4. Źródła (nowe w W2 i użyte z W1)

| id | adres | organizacja | szczebel (uzasadnienie) | co przeczytano |
|---|---|---|---|---|
| elitejumps-mistakes | https://elitejumps.co/blogs/guides/8-common-jump-rope-mistakes | Elite Jumps (producent skakanek) | 4 — producent własnego rodzaju sprzętu („Most of our jump ropes are made here at our warehouse in Wenatchee, WA.” — https://elitejumps.co/pages/about-us); autor D. Meek, Director of Education, 29.05.2024 | WebFetch 02.11.2026: 8 błędów i poprawki |
| elevate-rope-basics | https://www.elevaterope.com/blogs/articles/jump-rope-basics | Elevate Rope (marka skakanek) | **warunkowo, nie liczony** — autor „Admin”, data bez roku; strona nie mówi, że firma produkuje skakanki | WebFetch 02.11.2026: długość (uchwyty blisko barku dla początkujących), łokcie, nadgarstki, kolana |
| issa-battle-rope | https://www.issaonline.com/blog/post/battle-rope-training-techniques-plus-7-exercise-variations | ISSA | 4 — organizacja certyfikująca trenerów; treść firmowana „By ISSA”, 05.02.2024 | WebFetch 02.11.2026: #1 Battle Rope Waves, wskazówki ogólne |
| bos-battle-ropes | https://bellsofsteel.us/blogs/content/how-to-correctly-use-battle-ropes | Bells of Steel | 4 — producent własnych lin (link do własnego produktu „Battle Rope” na stronie); treść firmowana, 16.04.2025 | WebFetch 02.11.2026: postawa, fale, Common Mistakes 1–4 |
| sole-elliptical | https://www.soletreadmills.com/blogs/news/how-to-properly-use-an-elliptical-tips-tricks-for-beginners | SOLE Fitness (producent orbitreków) | 4 — producent własnego rodzaju sprzętu; treść firmowana, 08.10.2024 | WebFetch 02.11.2026: postawa, chwyt, praca rąk, błędy |
| nordictrack-elliptical | https://www.nordictrack.com/learn/elliptical-training/ | NordicTrack | 4 — producent orbitreków; treść firmowana, 04.07.2019, akt. 04.09.2025 | WebFetch 02.11.2026: lista formy, „Use Arms Actively” |
| true-climber-tips | https://truefitness.com/stair-climber-tips-for-a-powerful-workout/ | TRUE Fitness (producent schodołazów Palisade) | 4 — producent własnego rodzaju sprzętu, treść firmowana; **bez daty** na stronie (kryterium 2 spełnione przez firmowanie) | WebFetch 02.11.2026: postawa, rączki, stopa na stopniu, błędy |
| bellsofsteel-stair | https://bellsofsteel.us/blogs/content/is-a-stair-climber-a-good-workout | Bells of Steel | 4 (W1; ponownie przeczytane 02.11.2026: 07.01.2025, bez autora; plecy proste, brzuch, poręcze) | WebFetch 02.11.2026 |
| c2-technique | https://www.concept2.com/training/rowing-technique | Concept2 | 4 (już w `cues.json`) | WebFetch 02.11.2026: sekcje The Drive, The Recovery („Once your hands have cleared your knees”) |
| ace-fitfacts-rope, sunny-elliptical-form, rep-airbike-setup, c2-bikeerg-setup, hss-bike, hk-yoke-cycling (3), carr-hk-drills (3), nasm-running-gait, nasm-squat-thrust-burpees, pmc-9517252, lifefitness-rails, nordictrack-incline, lifespan-treadmill-safety, berling-2006 | jak w W1 / `cues.json` | — | szczeble wg przeliczenia W1 02.11.2026 | nie czytane ponownie w W2 (miejsca z W1) |

Odrzucone w W2: Fitness Volt — strona SkiErg (https://fitnessvolt.com/roxrace/stations/skierg/) — „FitnessVolt Editorial Team”, bez autora = 5; Pfizer Health Answers — Jumping Jacks (https://healthanswers.pfizer.com/physical-activity/aerobic/how-to-do-jumping-jacks) — bez autora, recenzenta i daty = 5; SilverSneakers (bieżnia) — 403; nordictrack.com/blog/how-to-use-a-treadmill — 404.

## 5. Otwarte

- **Ski Erg** — nadal tylko Concept2; nie znaleziono drugiej organizacji szkolącej ani innego producenta ergometru narciarskiego z instrukcją techniki. Zdanie gotowe po drugim źródle: `ski.hinge` (W1).
- **Jumping Jacks** — tylko NASM; ACE i ISSA bez strony ćwiczenia w wynikach wyszukiwania.
- **Assault Bike — ruch** (`abike.arms`) — tylko REP; Assault Fitness (blog) — strona z listą filmów, bez instrukcji; sklepy (Better Body Equipped) = 5.
- **Treadmill Walking — ustawienie** (`tread.straddle`) — tylko Lifespan; instrukcje Matrix i Landice tylko w serwisach z kopiami (nie liczą się).
- **Stair Climber — ruch** (`stair.foot` „Stawiaj całą stopę na stopniu.”) — tylko TRUE; BoS nie opisuje stopy.
- **Skakanka — długość** (`jrope.length`) — ACE (do klatki) + Elevate Rope (do barku) — Elevate warunkowy; **kolana** (`jrope.knees`) — ACE „lekko ugięte” vs Elite Jumps „nogi raczej proste, nie zablokowane”: część wspólna „nie blokuj kolan”, ale drugie zgodne sformułowanie tylko u Elevate.
- **Battle Ropes — rozstaw stóp** — tylko BoS; „naprzemiennie” — tylko BoS (ISSA opisuje ruch obu rąk bez rytmu).
- **Orbitrek — stopy**: sprzeczność na tym samym szczeblu — NordicTrack „feet flat”, SOLE „cała stopa, nie na palcach” vs Sunny (pięta wysuniętej stopy może się odrywać); `ell.heel` i `ell.feet` z W1 — bez zdania.
- **Carioca Quick Step** — bez nowych prób (W1: brak źródła ≤ 4).
- **Role mięśni** — W1 zostawiła otwarte tylko Battle Ropes (wzorzec cardio bez reguł); w W2 nie badano (pliku `role-miesni-fala-w2/cardio.md` nie utworzono).

## 6. Uwagi dla koordynatora

- **Zestawy ogólne sprzeczne ze źródłami:** Orbitrek i Stair Climber mają w zestawie `walk.rails` („…nie odchylaj do tyłu…”) — część o odchylaniu potwierdzona tylko dla bieżni z nachyleniem (W1); karty własne z W2 zastępują je `ell.grip` / `stair.rails`. Skakanka, High Knees, Fast Skipping, Jumping Jacks: `jump.mis.stiff` w zestawie — dla skakanki źródło (Elite Jumps, błąd 3) zaleca nogi „raczej proste, nie zablokowane”, więc „lądowanie na sztywnych nogach” nie jest sprzeczne, ale nie ma potwierdzenia; dla High Knees i Fast Skipping — żadne przeczytane źródło.
- **TRUE Fitness bez daty** — przyjęto 4 przez firmowanie treści (kryterium 2: „autor z datą albo treść jawnie firmowana”); jeśli koordynator wymaga daty, Stair Climber spada do otwartych (zostaje tylko BoS).
- **Elite Jumps** — producent skakanek z autorem i datą; inna sytuacja niż B. Lee (tekst gościnny w cudzym wydawnictwie) — do potwierdzenia, że rozstrzygnięcie o B. Lee nie obejmuje dokumentacji producenta.
- **Błędy wnioskowane** z ustawienia innego niż zdanie tej karty: `stair.mis.lean` zaprzecza `walk.upright` (ustawienie tej karty w W2) — wspiera go też TRUE wprost.
- `plank.mis.sag` w Burpees — miejsce w NASM wg odczytu W1 („biodra opadają w podporze”), w W2 nie czytano ponownie.
