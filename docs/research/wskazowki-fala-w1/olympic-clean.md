# Wskazówki techniki — rodzina olympic, grupa zarzutu (clean)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3).
Zakres: Power Clean, Clean, Hang Clean, Clean and Jerk, Clean Pull, Block Clean, Block Power Clean, Split Clean, Clean Shrug, Rack Delivery
(dziś zestaw ogólny `oly`; Rack Delivery bez zestawu). Status: **zebrane dane, PROPOZYCJA** — nic nie trafia do `lib/` ani `data/zrodla/` w tej fali.

Metoda: wyjątek dla wskazówek techniki z CLAUDE.md — każde zdanie w danym ćwiczeniu ma ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji.
Strony czytane przez WebFetch 02.11.2026 (narzędzie zwraca parafrazę z krótkimi cytatami — miejsca podane według nagłówków i kroków strony).
Dostęp: ExRx (403) i web.archive.org (zablokowane) — nieużyte; NSCA (artykuł NSCA Coach i PDF TSAC) — 403, nieużyte.
Strony aplikacji treningowych z wyników wyszukiwania pominięto (nie są źródłem; nazwy nie trafiają do repo).

**Uproszczenie „bazowy ruch zarzutu”.** Strona Power Clean (catalyst-67, akapit 1) mówi, że power clean różni się od pełnego zarzutu
tylko głębokością przyjęcia; strony Block Clean / Block Power Clean (catalyst-379, -380) — że start z podestów to ta sama pozycja co w zarzucie
z ziemi na tej wysokości; Split Clean (catalyst-211, ironmind-split) — że ciąg jest jak w zarzucie, inne jest tylko przyjęcie w wykroku.
Dlatego dla faz wspólnych (ustawienie pleców, ciąg, wyprost, obrót łokci, błędy ciągu) źródło innego wariantu zarzutu liczę jako „opis bazowego
ruchu” — przy takim źródle w miejscu dopisek „(bazowy ruch: …)”, a ćwiczenie ma w uwagach „uproszczenie”. Źródło o innym ćwiczeniu (np. zrywie,
podciąganiu ciągu) jako analogii — nie liczę.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Power Clean | gotowe | wszystkie zdania z 2–4 źródłami o power clean; jedno źródło błędu „biodra za wcześnie” i „sztanga odjeżdża” o pełnym zarzucie (bazowy ruch) — uproszczenie |
| Clean | gotowe | część źródeł o power clean (ten sam ciąg wg catalyst-67) — uproszczenie |
| Hang Clean | gotowe | błędy ze źródeł o zarzucie z ziemi (różnica tylko w starcie) — uproszczenie; „pełny przysiad” zgodny z catalyst-68 i rogue-hang-squat-clean |
| Block Clean | częściowe | brak zdania o samym ustawieniu przy podestach (jedno źródło) → Otwarte; reszta z bazowego ruchu — uproszczenie |
| Block Power Clean | częściowe | jak Block Clean |
| Split Clean | częściowe | potwierdzone tylko „przyjęcie w wykroku”; szczegóły wykroku i wstawania → Otwarte; ciąg z bazowego ruchu — uproszczenie |
| Clean and Jerk | częściowe | część zarzutu potwierdzona (z bazowym ruchem — uproszczenie); część podrzutu (jerk) → Otwarte |
| Clean Pull | częściowe | setup i move potwierdzone; błędy → Otwarte (tylko po jednym źródle o tym ćwiczeniu) |
| Clean Shrug | otwarte | jedno przeczytane źródło (catalyst-93) |
| Rack Delivery | otwarte | jedno przeczytane źródło (catalyst-544); brak w `poses/olympic.json` |

Zdania zestawu ogólnego `oly` sprawdzone: `oly.close` i `oly.legs` — potwierdzone tam, gdzie wpisane niżej. `oly.back` („…klatka do góry”) — część „klatka
do góry” nie ma 2 źródeł dla power clean / clean (mają ją tylko rogue-* i experiencelife w fazie ciągu) → zastąpione `olympic.setupBack`. `oly.mis` (dwa błędy
w jednym zdaniu) — „plecy się zaokrąglają” nie występuje jako błąd w przeczytanych źródłach → nie wpisane; zamiast niego `mis.barAway` i `olympic.mis.*`.

## 2. Dane (format `cues.json`)

```json
{
 "orgs": {
  "Catalyst Athletics": {"name": "Catalyst Athletics — Olympic Weightlifting Exercise Library (catalystathletics.com)", "level": 4, "kind": "site"},
  "Rogue Fitness": {"name": "Rogue Fitness — The Index, Movement Library (producent sprzętu)", "level": 4, "kind": "maker"},
  "Experience Life": {"name": "Experience Life (magazyn Life Time) — artykuł instruktażowy, autor CSCS", "level": 4, "kind": "site"},
  "IronMind": {"name": "IronMind — Jim Schmitz on the Lifts (wydawca i producent sprzętu; autor: trener kadry olimpijskiej USA)", "level": 4, "kind": "maker"}
 },
 "sources": {
  "catalyst-67": {"org": "Catalyst Athletics", "title": "Power Clean", "url": "https://www.catalystathletics.com/exercise/67/Power-Clean/", "level": 4},
  "catalyst-59": {"org": "Catalyst Athletics", "title": "Clean", "url": "https://www.catalystathletics.com/exercise/59/Clean/", "level": 4},
  "catalyst-68": {"org": "Catalyst Athletics", "title": "Hang Clean", "url": "https://www.catalystathletics.com/exercise/68/Hang-Clean/", "level": 4},
  "catalyst-98": {"org": "Catalyst Athletics", "title": "Clean Pull", "url": "https://www.catalystathletics.com/exercise/98/Clean-Pull/", "level": 4},
  "catalyst-379": {"org": "Catalyst Athletics", "title": "Block Clean", "url": "https://www.catalystathletics.com/exercise/379/Block-Clean/", "level": 4},
  "catalyst-380": {"org": "Catalyst Athletics", "title": "Block Power Clean", "url": "https://www.catalystathletics.com/exercise/380/Block-Power-Clean/", "level": 4},
  "catalyst-211": {"org": "Catalyst Athletics", "title": "Split Clean", "url": "https://www.catalystathletics.com/exercise/211/Split-Clean/", "level": 4},
  "catalyst-76": {"org": "Catalyst Athletics", "title": "Clean & Jerk", "url": "https://www.catalystathletics.com/exercise/76/Clean-Jerk/", "level": 4},
  "barbend-power-clean": {"org": "BarBend", "title": "The Power Clean Exercise: How To… (akt. 25.03.2024)", "url": "https://barbend.com/power-clean/", "level": 4},
  "barbend-clean": {"org": "BarBend", "title": "How to Do the Clean… (akt. 19.11.2024)", "url": "https://barbend.com/how-to-do-the-clean/", "level": 4},
  "barbend-hang-clean": {"org": "BarBend", "title": "How to Do a Hang Clean (akt. 19.12.2023)", "url": "https://barbend.com/hang-clean/", "level": 4},
  "coach-power-clean": {"org": "Coach", "title": "How To Master The Power Clean (11.10.2018)", "url": "https://www.coachweb.com/barbell-exercises/6964/how-to-master-the-power-clean", "level": 4},
  "rogue-clean-pull": {"org": "Rogue Fitness", "title": "Movement Demo — Clean Pull", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull", "level": 4},
  "rogue-hang-squat-clean": {"org": "Rogue Fitness", "title": "Movement Demo — Hang Squat Clean", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean", "level": 4},
  "rogue-hang-power-clean": {"org": "Rogue Fitness", "title": "Movement Demo — Hang Power Clean", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-clean", "level": 4},
  "experiencelife-power-clean": {"org": "Experience Life", "title": "How to Power Clean (A. Heffernan, CSCS, 20.05.2019)", "url": "https://experiencelife.lifetime.life/article/learn-to-power-clean/", "level": 4},
  "ironmind-split": {"org": "IronMind", "title": "Split Lifting Technique (J. Schmitz)", "url": "https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/", "level": 4}
 },
 "exercises": {
  "Power Clean": {
   "setup": [
    {"c": "olympic.feet", "s": [["catalyst-67", "akapit Setup (feet about hip-width, toes turned out)"], ["barbend-power-clean", "Step 1 (hip-width stance, feet pointed out slightly)"], ["coach-power-clean", "1. Strong Stance (shoulder width, toes slightly out)"]]},
    {"c": "olympic.setupBack", "s": [["catalyst-67", "akapit Setup (trunk braced, back extended)"], ["barbend-power-clean", "Step 2 (Flatten your back)"], ["coach-power-clean", "1. Strong Stance (engage lats, tight back)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-67", "akapit First pull (push through the whole foot); Setup (arms straight)"], ["barbend-power-clean", "Step 3 (pushing down into the floor)"], ["coach-power-clean", "2. First Pull (drive the floor away, arms straight)"]]},
    {"c": "olympic.extend", "s": [["catalyst-67", "akapit First pull (after the knees: drive legs, extend hips aggressively)"], ["coach-power-clean", "3. Second Pull (drive your hips forward forcefully)"], ["experiencelife-power-clean", "3. The Second Pull (thrust hips forward, straighten knees)"]]},
    {"c": "olympic.under", "s": [["catalyst-67", "akapity Second pull / Receiving (elbows up and out; spin elbows around the bar into rack)"], ["barbend-power-clean", "Step 5 (flip your elbows around, front rack)"], ["experiencelife-power-clean", "4. The Catch (rotate elbows forward and under, fronts of the shoulders)"]]},
    {"c": "olympic.catchHigh", "s": [["catalyst-67", "akapit Receiving (partial squat, brake hard, stay above parallel)"], ["barbend-power-clean", "Step 5 (legs slightly bent)"], ["experiencelife-power-clean", "4. The Catch (quarter- to half-squat)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-67", "akapit First pull (bar close to the body)"], ["coach-power-clean", "5. Bar Path"], ["experiencelife-power-clean", "3. The Second Pull (keep the bar close to the body)"]]},
    {"c": "oly.legs", "s": [["barbend-power-clean", "Common Mistakes: Using Your Arms"], ["experiencelife-power-clean", "2. The Transition (arms straight) + Common Mistakes: Pulling with the arms"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-power-clean", "Common Mistakes: Using Your Arms"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early"]]},
    {"c": "mis.barAway", "s": [["experiencelife-power-clean", "Common Mistakes: Bar drifting away from the body"], ["barbend-clean", "Common Mistakes: Kicking the Bar (bazowy ruch: zarzut)"]]},
    {"c": "olympic.mis.hipsEarly", "s": [["coach-power-clean", "2. First Pull (hips should not come up faster than shoulders)"], ["barbend-clean", "Common Mistakes: Hips Rising Early (bazowy ruch: zarzut)"]]}
   ]
  },
  "Clean": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-59", "akapit Setup (trunk braced, back extended)"], ["barbend-power-clean", "Step 2 (bazowy ruch: power clean — ten sam ciąg wg catalyst-67)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-59", "akapit First pull (legs push through the whole foot); Setup (arms straight)"], ["barbend-clean", "Push, Hard (pushing into the floor with your legs)"]]},
    {"c": "olympic.extend", "s": [["catalyst-59", "akapit First pull (keep driving, extend hips forcefully)"], ["barbend-clean", "Extend Up (mid to high-thigh, triple extension)"]]},
    {"c": "olympic.under", "s": [["catalyst-59", "akapity Third pull / Receive (elbows spin around the bar to rack)"], ["barbend-clean", "Flip and Rack"]]},
    {"c": "olympic.catchLow", "s": [["catalyst-59", "akapity Third pull / Recovery (squat under; drive up immediately)"], ["barbend-clean", "Flip and Rack (drop under, catch, stand up)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-59", "akapit Second pull (bar close to the body)"], ["coach-power-clean", "5. Bar Path (bazowy ruch: power clean)"]]},
    {"c": "oly.legs", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It”"], ["experiencelife-power-clean", "Common Mistakes: Pulling with the arms (bazowy ruch: power clean)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.hipsEarly", "s": [["barbend-clean", "Common Mistakes: Hips Rising Early"], ["coach-power-clean", "2. First Pull (bazowy ruch: power clean)"]]},
    {"c": "mis.barAway", "s": [["barbend-clean", "Common Mistakes: Kicking the Bar"], ["experiencelife-power-clean", "Common Mistakes: Bar drifting away (bazowy ruch: power clean)"]]},
    {"c": "olympic.mis.arms", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It”"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch: power clean)"]]}
   ]
  },
  "Hang Clean": {
   "setup": [
    {"c": "olympic.hangStart", "s": [["catalyst-68", "akapit Starting hang position (stand the bar up, lower under control to the hang; high-hang/knee: shoulder above or slightly in front of the bar)"], ["rogue-hang-squat-clean", "Hang Position (just above the knees, hips back, flat back, shoulders on top or just in front)"], ["barbend-hang-clean", "FAQ Step 2 (hinge until the bar is past your knees)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-68", "akapit How the lift begins (drive through the floor with the legs)"], ["rogue-hang-squat-clean", "Execution (leg drive, arms remaining straight)"], ["barbend-hang-clean", "Step 2 (push your feet into the floor)"]]},
    {"c": "olympic.extend", "s": [["catalyst-68", "akapit How the lift begins (hips extend forcefully)"], ["rogue-hang-squat-clean", "Execution (explosively extend hips and knees)"], ["barbend-hang-clean", "Step 3 (drive your hips forward)"]]},
    {"c": "olympic.under", "s": [["catalyst-68", "akapit Elbows and rack (spin the elbows around the bar)"], ["rogue-hang-squat-clean", "Execution (fast elbows, under and around the bar)"], ["barbend-hang-clean", "Step 3–4 (high elbows, front rack)"]]},
    {"c": "olympic.catchLow", "s": [["catalyst-68", "akapit Receive (squat under, drive up immediately)"], ["rogue-hang-squat-clean", "Receiving (full-depth squat)"], ["barbend-hang-clean", "Step 4 (drop into a deep squat)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-68", "akapit How the lift begins (bar close to the body)"], ["rogue-hang-squat-clean", "Execution (keep the bar close)"], ["barbend-hang-clean", "FAQ Step 3 (keeping it close to your body)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch: zarzut z ziemi)"], ["barbend-clean", "Common Mistakes: Trying to „Muscle It” (bazowy ruch: zarzut z ziemi)"]]},
    {"c": "mis.barAway", "s": [["experiencelife-power-clean", "Common Mistakes: Bar drifting away (bazowy ruch)"], ["barbend-clean", "Common Mistakes: Kicking the Bar (bazowy ruch)"]]}
   ]
  },
  "Block Clean": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-379", "akapit Setup and pull (brace the trunk; same position as a clean at that height)"], ["barbend-clean", "Setup (bazowy ruch: zarzut z ziemi)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-379", "akapit Setup and pull (drive through the floor with the legs)"], ["barbend-clean", "Push, Hard (bazowy ruch)"]]},
    {"c": "olympic.extend", "s": [["catalyst-379", "akapit Setup and pull (fully extend the hips)"], ["barbend-clean", "Extend Up (bazowy ruch)"]]},
    {"c": "olympic.under", "s": [["catalyst-379", "akapit Receive (spin the elbows around the bar)"], ["barbend-clean", "Flip and Rack (bazowy ruch)"]]},
    {"c": "olympic.catchLow", "s": [["catalyst-379", "akapity Receive / Recovery (squat under; drive back up immediately)"], ["barbend-clean", "Flip and Rack (bazowy ruch)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-379", "akapit Setup and pull (bar as close to the body as possible)"], ["coach-power-clean", "5. Bar Path (bazowy ruch)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It” (bazowy ruch)"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch)"]]},
    {"c": "mis.barAway", "s": [["barbend-clean", "Common Mistakes: Kicking the Bar (bazowy ruch)"], ["experiencelife-power-clean", "Common Mistakes: Bar drifting away (bazowy ruch)"]]}
   ]
  },
  "Block Power Clean": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-380", "akapit Setup (same position as at that point of a power clean from the floor)"], ["barbend-power-clean", "Step 2 (bazowy ruch: power clean z ziemi)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-380", "akapit Pull (drive through the whole foot)"], ["barbend-power-clean", "Step 3 (bazowy ruch)"]]},
    {"c": "olympic.extend", "s": [["catalyst-380", "akapit Pull (extend the hips violently)"], ["coach-power-clean", "3. Second Pull (bazowy ruch)"]]},
    {"c": "olympic.under", "s": [["catalyst-380", "akapit Receive depth (elbows up and out, spin into the rack)"], ["barbend-power-clean", "Step 5 (bazowy ruch)"]]},
    {"c": "olympic.catchHigh", "s": [["catalyst-380", "akapit Receive depth (brake hard, stay above parallel)"], ["barbend-power-clean", "Step 5 (legs slightly bent; bazowy ruch)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-380", "akapit Pull (keeping the bar as close as possible)"], ["experiencelife-power-clean", "3. The Second Pull (bazowy ruch)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-power-clean", "Common Mistakes: Using Your Arms (bazowy ruch)"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch)"]]},
    {"c": "mis.barAway", "s": [["experiencelife-power-clean", "Common Mistakes: Bar drifting away (bazowy ruch)"], ["barbend-clean", "Common Mistakes: Kicking the Bar (bazowy ruch)"]]}
   ]
  },
  "Split Clean": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-59", "akapit Setup (bazowy ruch: catalyst-211 odsyła do mechaniki zarzutu)"], ["barbend-clean", "Setup (bazowy ruch)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-59", "akapit First pull (bazowy ruch)"], ["barbend-clean", "Push, Hard (bazowy ruch)"]]},
    {"c": "olympic.extend", "s": [["catalyst-59", "akapit First pull (bazowy ruch)"], ["barbend-clean", "Extend Up (bazowy ruch)"]]},
    {"c": "olympic.splitCatch", "s": [["catalyst-211", "akapit Execution (squat clean mechanics, under in a split position)"], ["ironmind-split", "akapit o split clean (pulled just as for a power or squat lift; front leg forward, back leg backward)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It” (bazowy ruch)"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch)"]]}
   ]
  },
  "Clean and Jerk": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-76", "akapit Clean (braced back)"], ["barbend-clean", "Setup (bazowy ruch: zarzut)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-76", "akapit Clean (push with the legs through the whole foot)"], ["barbend-clean", "Push, Hard (bazowy ruch)"]]},
    {"c": "olympic.under", "s": [["catalyst-76", "akapit Transition and rack (spin the elbows around the bar)"], ["barbend-clean", "Flip and Rack (bazowy ruch)"]]},
    {"c": "olympic.catchLow", "s": [["catalyst-76", "akapit Transition and rack (receiving squat, then stand)"], ["barbend-clean", "Flip and Rack (bazowy ruch)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It” (bazowy ruch)"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch)"]]}
   ]
  },
  "Clean Pull": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-98", "akapit Setup (trunk braced, back extended)"], ["rogue-clean-pull", "Start Position (flat back)"]]}
   ],
   "move": [
    {"c": "olympic.triple", "s": [["catalyst-98", "akapity Extension / Heels and top position (extend roughly vertically, heels rise naturally)"], ["rogue-clean-pull", "Execution (explode through hips, knees, and ankles)"]]}
   ],
   "tips": [],
   "mistakes": []
  }
 }
}
```

## 3. Nowe zdania

| Id | PL | EN (propozycja) |
|---|---|---|
| olympic.feet | Stopy między szerokością bioder a barków, palce lekko na zewnątrz. | Feet between hip and shoulder width, toes turned slightly out. |
| olympic.setupBack | Na starcie plecy proste, tułów mocno napięty. | Start with a flat back and your trunk braced hard. |
| olympic.legsFirst | Zacznij od pchania nogami w podłogę — ręce zostają proste. | Start by pushing the floor away with your legs — arms stay straight. |
| olympic.extend | Gdy sztanga minie kolana, mocno wyprostuj biodra i nogi. | Once the bar passes your knees, drive your hips and legs to full extension. |
| olympic.triple | Na górze pełny wyprost: biodra, kolana i kostki. | Finish tall: hips, knees and ankles fully extended. |
| olympic.under | Po wyproście szybko obróć łokcie wokół sztangi i przyjmij ją na przód barków. | After the extension, whip your elbows around the bar and catch it on the front of your shoulders. |
| olympic.catchHigh | Sztangę przyjmij w płytkim przysiadzie. | Catch the bar in a partial squat. |
| olympic.catchLow | Sztangę przyjmij w pełnym przysiadzie i od razu wstań. | Catch the bar in a full squat and stand right up. |
| olympic.hangStart | Wstań ze sztangą i opuść ją tuż nad kolana: biodra w tył, plecy proste, barki nad sztangą lub lekko przed nią. | Stand up with the bar, then lower it to just above your knees: hips back, back flat, shoulders over or slightly ahead of the bar. |
| olympic.splitCatch | Ciągnij jak w zwykłym zarzucie, a sztangę przyjmij w wykroku — jedna noga w przód, druga w tył. | Pull as in a regular clean, but catch the bar in a split — one foot forward, one back. |
| olympic.mis.arms | Ciągnięcie rękami za wcześnie, zanim nogi i biodra skończą wyprost. | Pulling with the arms before the legs and hips finish the extension. |
| olympic.mis.hipsEarly | Biodra idą w górę szybciej niż barki na początku ciągu. | Hips shooting up faster than the shoulders off the floor. |

Istniejące zdania użyte słowo w słowo: `oly.close`, `oly.legs`, `mis.barAway`.

## 4. Źródła (przeczytane 02.11.2026)

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| catalyst-67 | https://www.catalystathletics.com/exercise/67/Power-Clean/ | Catalyst Athletics | 4 | opis: Setup, First pull, przyjęcie, różnica od pełnego zarzutu („only difference…”, akapit 1) |
| catalyst-59 | https://www.catalystathletics.com/exercise/59/Clean/ | Catalyst Athletics | 4 | Setup, First/Second pull, Third pull, Receive, Recovery |
| catalyst-68 | https://www.catalystathletics.com/exercise/68/Hang-Clean/ | Catalyst Athletics | 4 | pozycje zwisu, początek ruchu, łokcie, przyjęcie |
| catalyst-98 | https://www.catalystathletics.com/exercise/98/Clean-Pull/ | Catalyst Athletics | 4 | Setup, Pull, Extension, Finish, Heels |
| catalyst-379 | https://www.catalystathletics.com/exercise/379/Block-Clean/ | Catalyst Athletics | 4 | wysokość podestów, Setup and pull, Receive |
| catalyst-380 | https://www.catalystathletics.com/exercise/380/Block-Power-Clean/ | Catalyst Athletics | 4 | Setup, Pull, Receive depth |
| catalyst-211 | https://www.catalystathletics.com/exercise/211/Split-Clean/ | Catalyst Athletics | 4 | Execution (tylko ogólnie) |
| catalyst-93 | https://www.catalystathletics.com/exercise/93/Clean-Shrug/ | Catalyst Athletics | 4 | start, ruch, koniec, czego nie robić (jedyne źródło — Otwarte) |
| catalyst-544 | https://www.catalystathletics.com/exercise/544/Clean-Rack-Delivery/ | Catalyst Athletics | 4 | pozycja „strach na wróble”, obrót łokci, błąd: pochylanie klatki do sztangi (jedyne źródło — Otwarte) |
| catalyst-76 | https://www.catalystathletics.com/exercise/76/Clean-Jerk/ | Catalyst Athletics | 4 | Clean, Transition and rack, dip/drive, split, recovery |
| barbend-power-clean | https://barbend.com/power-clean/ | BarBend | 4 | Steps 1–5, Common Mistakes (Using Your Arms, Pulling Early, Deadlifting the Weight) |
| barbend-clean | https://barbend.com/how-to-do-the-clean/ | BarBend | 4 | Setup, Push Hard, Extend Up, Flip and Rack, Common Mistakes (4) |
| barbend-hang-clean | https://barbend.com/hang-clean/ | BarBend | 4 | Steps 1–4, FAQ steps, Common Mistakes |
| coach-power-clean | https://www.coachweb.com/barbell-exercises/6964/how-to-master-the-power-clean | Coach | 4 | kroki 1–5 (Strong Stance … Bar Path) |
| rogue-clean-pull | https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull | Rogue Fitness | 4 | Movement Breakdown: Start Position, Execution |
| rogue-hang-squat-clean | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean | Rogue Fitness | 4 | Start/Hang Position, Execution, przyjęcie w pełnym przysiadzie |
| rogue-hang-power-clean | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-clean | Rogue Fitness | 4 | jak wyżej, przyjęcie w niepełnym przysiadzie (do przyszłego Hang Power Clean; tu nieużyte w danych) |
| experiencelife-power-clean | https://experiencelife.lifetime.life/article/learn-to-power-clean/ | Experience Life | 4 | kroki 1–4, Common Mistakes |
| ironmind-split | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/ | IronMind | 4 | opis split clean (ciąg jak w zarzucie, noga w przód / w tył, szybkie stopy) |

Uwaga o niezależności: barbend-clean i barbend-power-clean to ta sama organizacja — w żadnym zdaniu nie liczą się razem jako dwa źródła.
catalyst-59/-67/-68/-76/-379/-380/-211 — ta sama organizacja; w każdym zdaniu najwyżej jedno z nich.

## 5. Otwarte

- [OTWARTE] **Clean Shrug** — tylko catalyst-93; nie znalazłem drugiego przeczytanego źródła szczebla 4 (strony z wyników to biblioteki aplikacji lub sklepy
  — pominięte). Zestawu `oly` nie potwierdzam dla tego ćwiczenia: `oly.legs` („ręce proste jak najdłużej”) nie pasuje do ruchu bez przyjęcia sztangi.
- [OTWARTE] **Rack Delivery** — tylko catalyst-544 (ustawienie w pozycji „strach na wróble”, obrót łokci, błąd: pochylanie klatki do sztangi). Brak drugiego źródła.
  Ćwiczenie nie ma pozy w `lib/figures/v2/poses/olympic.json`.
- [OTWARTE] **Block Clean / Block Power Clean — ustawienie przy podestach** („ustaw się tak, jak w zarzucie z ziemi na tej wysokości”, zwykle na wys. kolan) —
  tylko Catalyst (379, 380). Drugie źródło z wyników było stroną aplikacji — pominięte.
- [OTWARTE] **Split Clean — szczegóły wykroku i wstawania** (odległości stóp, przednia goleń pionowo, która noga wraca pierwsza) — ironmind-split podaje odległości,
  pozostałe szczegóły tylko w źródłach z wyszukiwarki (nieprzeczytane / aplikacje). Liczby („ok. 1 stopa / 2 stopy”) — jedno źródło, poza wyjątkiem dla techniki.
- [OTWARTE] **Clean and Jerk — część podrzutu** (krótkie ugięcie samymi kolanami, wybicie nogami, wykrok, ustabilizuj sztangę przed wstaniem) — tylko catalyst-76.
  Zdania `pp.dip`/`pp.legs` z zestawu ogólnego `pushPress` mają źródła o push pressie — dla podrzutu to analogia, nie wpisane.
- [OTWARTE] **Clean Pull — błędy** (sztanga odjeżdża od ciała: catalyst-98; „nie ciągnij rękami”: rogue-clean-pull) — po jednym źródle na zdanie.
  Także `oly.close` dla Clean Pull — tylko catalyst-98 wprost.
- [OTWARTE] **Pozycja sztangi nad stopą na starcie** — catalyst-* mówi „nad przodostopiem” (balls of the foot), rogue-* i barbend-hang-clean „nad śródstopiem”:
  rozbieżność na tym samym szczeblu; nie wpisane. Część wspólna: sztanga blisko piszczeli, nad stopą.
- [OTWARTE] **Wysokie łokcie w przyjęciu / błąd „łokcie nisko”** — catalyst-59/-67 (elbows high) i barbend-clean (Incomplete Front Rack); dla Clean to by wystarczyło,
  ale zdanie łączy się z twierdzeniem o obciążeniu nadgarstków (zdrowie) — pominięte; do decyzji, czy wpisać samo „łokcie wysoko” (`olympic.rack`).
- [OTWARTE] **`oly.back`** („klatka do góry”) i **`oly.mis`** („plecy się zaokrąglają”) — dla tych ćwiczeń brak 2 źródeł na całe zdanie (patrz sekcja 1).
- Źródła niedostępne w tej sesji: ExRx (403), web.archive.org (zablokowane), NSCA (nsca.com i dxpprod.nsca.com — 403): „A Simple Approach to Teaching the Power Clean
  in a Group Environment” (TSAC Report) i „Integration of Clean Variations…” (NSCA Coach) — warto przeczytać w kolejnej fali do Block/Split/Shrug.

## 6. Stan

- Zrobione: przeczytane 19 stron (10 Catalyst, 3 BarBend, 1 Coach, 3 Rogue, 1 Experience Life, 1 IronMind); 3 ćwiczenia gotowe, 5 częściowych, 2 otwarte; 12 nowych zdań.
- Zostało: drugie źródło dla Clean Shrug, Rack Delivery, ustawienia przy podestach, szczegółów wykroku w Split Clean, części podrzutu w Clean and Jerk, błędów Clean Pull.
- Następny krok: spróbować NSCA (inna ścieżka dostępu), USA Weightlifting, Eleiko (biblioteka wideo z opisami) i IronMind (inne artykuły Schmitza, np. o podrzucie).
- Pułapki: Catalyst przez WebFetch czasem zwraca inną stronę przy złym numerze (adres /exercise/58/ dał „Snatch”) — sprawdzaj tytuł strony; Rogue ma wiele adresów 404
  (dobre: `movement-demo-clean-pull`, `-hang-squat-clean`, `-hang-power-clean`; strona „The Power Clean” to samo wideo bez tekstu).
