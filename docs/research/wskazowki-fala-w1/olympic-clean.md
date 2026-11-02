# Wskazówki techniki — rodzina olympic, grupa zarzutu (clean)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3). Uzupełnienie: druga sesja tego samego dnia (sekcje oznaczone „[sesja 2]”).
Zakres: Power Clean, Clean, Hang Clean, Clean and Jerk, Clean Pull, Block Clean, Block Power Clean, Split Clean, Clean Shrug, Rack Delivery
(dziś zestaw ogólny `oly`; Rack Delivery bez zestawu). Status: **zebrane dane, PROPOZYCJA** — nic nie trafia do `lib/` ani `data/zrodla/` w tej fali.

Metoda: wyjątek dla wskazówek techniki z CLAUDE.md — każde zdanie w danym ćwiczeniu ma ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji.
Strony czytane przez WebFetch 02.11.2026 (narzędzie zwraca parafrazę z krótkimi cytatami — miejsca podane według nagłówków i kroków strony).
Dostęp: ExRx (403) i web.archive.org (zablokowane) — nieużyte; NSCA (artykuł NSCA Coach i PDF TSAC) — 403, nieużyte.
Strony aplikacji treningowych z wyników wyszukiwania pominięto (nie są źródłem; nazwy nie trafiają do repo).

**[sesja 2] Szczeble wg rozstrzygnięcia koordynatora linii 1.1 (02.11.2026)** — sprawdzone dla użytych organizacji:
Catalyst Athletics — 4; CrossFit (organizacja szkoląca trenerów, treść firmowana) — 4; BarBend — 4, bo wszystkie użyte strony to artykuły o technice
z autorem i datą; Coach i Experience Life — 4 (redakcja, autor, data); Rogue Fitness i Eleiko — producenci sztang, użyci tylko dla ćwiczeń ze sztangą (własny
rodzaj sprzętu) — 4. **IronMind — niepewny**: artykuły J. Schmitza mają autora i kwalifikacje, ale **nie mają daty** (sprawdzone na stronie
„Clean Deadlift & Shrug”: tylko stopka „© 2025”), a IronMind nie produkuje sztang (wydawca, chwytaki) → warunek (b) „autor+data” niespełniony;
do rozstrzygnięcia koordynatora. Do tego czasu **IronMind nie liczy się do dwóch źródeł** — zdanie `olympic.splitCatch` w Split Clean przeniesione do „Otwarte”,
a nowe zdania oparte na IronMind są w bloku warunkowym (sekcja 2b), nie w danych.

**Uproszczenie „bazowy ruch zarzutu”.** Strona Power Clean (catalyst-67, akapit 1) mówi, że power clean różni się od pełnego zarzutu
tylko głębokością przyjęcia; strony Block Clean / Block Power Clean (catalyst-379, -380) — że start z podestów to ta sama pozycja co w zarzucie
z ziemi na tej wysokości; Split Clean (catalyst-211) — że ciąg jest jak w zarzucie, inne jest tylko przyjęcie w wykroku.
Dlatego dla faz wspólnych (ustawienie pleców, ciąg, wyprost, obrót łokci, błędy ciągu) źródło innego wariantu zarzutu liczę jako „opis bazowego
ruchu” — przy takim źródle w miejscu dopisek „(bazowy ruch: …)”, a ćwiczenie ma w uwagach „uproszczenie”. Źródło o innym ćwiczeniu (np. zrywie,
podciąganiu ciągu) jako analogii — nie liczę. [sesja 2] Tak samo w Clean and Jerk: strona CrossFit o podrzucie (crossfit-jerk) opisuje ten sam podrzut,
który kończy dwubój — dopisek „(bazowy ruch: podrzut)”.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Power Clean | gotowe | wszystkie zdania z 2–4 źródłami o power clean; jedno źródło błędu „biodra za wcześnie” i „sztanga odjeżdża” o pełnym zarzucie (bazowy ruch) — uproszczenie |
| Clean | gotowe | część źródeł o power clean (ten sam ciąg wg catalyst-67) — uproszczenie |
| Hang Clean | gotowe | błędy ze źródeł o zarzucie z ziemi (różnica tylko w starcie) — uproszczenie; „pełny przysiad” zgodny z catalyst-68 i rogue-hang-squat-clean |
| Clean and Jerk | **gotowe [sesja 2]** | nowe źródło crossfit-cj (cała strona o dwuboju: zarzut + podrzut + błędy) — część podrzutu potwierdzona z catalyst-76; `olympic.mis.forward` z bazowym ruchem (podrzut) — uproszczenie |
| Clean Pull | **gotowe [sesja 2]** | nowe źródło barbend-clean-pull (artykuł o technice); błąd `olympic.mis.arms` potwierdzony (BarBend + Rogue) |
| Block Clean | częściowe | brak zdania o samym starcie z podestów z 2 źródeł szczebla 4 (drugie to IronMind — niepewny szczebel, sekcja 2b); reszta z bazowego ruchu — uproszczenie |
| Block Power Clean | częściowe | jak Block Clean |
| Split Clean | częściowe | **[sesja 2] `olympic.splitCatch` cofnięte do Otwarte** (drugie źródło to IronMind); zostają tylko fazy ciągu z bazowego ruchu — brak zdania o samym wykroku; uproszczenie |
| Clean Shrug | otwarte | catalyst-93 + IronMind („Clean Deadlift & Shrug”, wariant z ziemi) — gotowe zdanie w sekcji 2b, warunkowo |
| Rack Delivery | otwarte | jedno przeczytane źródło (catalyst-544); brak w `poses/olympic.json` |

Zdania zestawu ogólnego `oly` sprawdzone: `oly.close` i `oly.legs` — potwierdzone tam, gdzie wpisane niżej. `oly.back` („…klatka do góry”) — część „klatka
do góry” nie ma 2 źródeł dla power clean / clean (mają ją tylko rogue-* i experiencelife w fazie ciągu) → zastąpione `olympic.setupBack`. `oly.mis` (dwa błędy
w jednym zdaniu) — „plecy się zaokrąglają” nie występuje jako błąd w przeczytanych źródłach → nie wpisane; zamiast niego `mis.barAway` i `olympic.mis.*`.
[sesja 2] Clean Shrug: dzisiejszy zestaw ogólny (`oly.back`, `oly.close`, `oly.mis`) — `oly.close` ma tylko catalyst-93 („keep the bar against the body”);
IronMind mówi o sztandze przy piszczelach w fazie z ziemi, której w Clean Shrug (start ze zwisu, poza `Clean Shrug` w `poses/olympic.json`, klatka 0: tułów pochylony ok. 23°) nie ma.

## 2. Dane (format `cues.json`)

Wersja po sesji 2 (Clean and Jerk i Clean Pull rozszerzone; Split Clean bez `olympic.splitCatch`; reszta bez zmian).

```json
{
 "orgs": {
  "Catalyst Athletics": {"name": "Catalyst Athletics — Olympic Weightlifting Exercise Library (catalystathletics.com)", "level": 4, "kind": "site"},
  "Rogue Fitness": {"name": "Rogue Fitness — The Index, Movement Library (producent sztang i sprzętu do podnoszenia ciężarów)", "level": 4, "kind": "maker"},
  "Experience Life": {"name": "Experience Life (magazyn Life Time) — artykuł instruktażowy, autor CSCS", "level": 4, "kind": "site"},
  "CrossFit": {"name": "CrossFit — Essentials (materiały edukacyjne organizacji szkolącej trenerów)", "level": 4, "kind": "org"}
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
  "barbend-clean-pull": {"org": "BarBend", "title": "Clean Pull guide (J. Dickson, USAW-L2, akt. 15.07.2024)", "url": "https://barbend.com/clean-pull-guide/", "level": 4},
  "coach-power-clean": {"org": "Coach", "title": "How To Master The Power Clean (11.10.2018)", "url": "https://www.coachweb.com/barbell-exercises/6964/how-to-master-the-power-clean", "level": 4},
  "rogue-clean-pull": {"org": "Rogue Fitness", "title": "Movement Demo — Clean Pull", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull", "level": 4},
  "rogue-hang-squat-clean": {"org": "Rogue Fitness", "title": "Movement Demo — Hang Squat Clean", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean", "level": 4},
  "rogue-hang-power-clean": {"org": "Rogue Fitness", "title": "Movement Demo — Hang Power Clean", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-clean", "level": 4},
  "experiencelife-power-clean": {"org": "Experience Life", "title": "How to Power Clean (A. Heffernan, CSCS, 20.05.2019)", "url": "https://experiencelife.lifetime.life/article/learn-to-power-clean/", "level": 4},
  "crossfit-cj": {"org": "CrossFit", "title": "The Clean and Jerk (Essentials, 21.01.2020)", "url": "https://www.crossfit.com/essentials/the-clean-and-jerk", "level": 4},
  "crossfit-jerk": {"org": "CrossFit", "title": "Foundational Movement: Jerk — What Is a Jerk? (B. Burgener, 29.08.2023)", "url": "https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk", "level": 4}
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
    {"c": "olympic.setupBack", "s": [["catalyst-59", "akapit Setup (trunk braced, back extended)"], ["barbend-power-clean", "Step 2 (bazowy ruch: power clean — ten sam ciąg wg catalyst-67)"], ["crossfit-cj", "Setup Position (back flat; shoulders slightly in front of the bar)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-59", "akapit First pull (legs push through the whole foot); Setup (arms straight)"], ["barbend-clean", "Push, Hard (pushing into the floor with your legs)"]]},
    {"c": "olympic.extend", "s": [["catalyst-59", "akapit First pull (keep driving, extend hips forcefully)"], ["barbend-clean", "Extend Up (mid to high-thigh, triple extension)"], ["crossfit-cj", "Clean — Second Pull (from mid-thigh, fully extend hips and legs)"]]},
    {"c": "olympic.under", "s": [["catalyst-59", "akapity Third pull / Receive (elbows spin around the bar to rack)"], ["barbend-clean", "Flip and Rack"], ["crossfit-cj", "Clean — Third Pull (elbows high, bar racked on the shoulders)"]]},
    {"c": "olympic.catchLow", "s": [["catalyst-59", "akapity Third pull / Recovery (squat under; drive up immediately)"], ["barbend-clean", "Flip and Rack (drop under, catch, stand up)"], ["crossfit-cj", "Clean — Third Pull (finish in a front squat and stand up)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-59", "akapit Second pull (bar close to the body)"], ["coach-power-clean", "5. Bar Path (bazowy ruch: power clean)"], ["crossfit-cj", "Clean — First/Second Pull (bar close to the body)"]]},
    {"c": "oly.legs", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It”"], ["experiencelife-power-clean", "Common Mistakes: Pulling with the arms (bazowy ruch: power clean)"], ["crossfit-cj", "Clean — Second Pull (arms long)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.hipsEarly", "s": [["barbend-clean", "Common Mistakes: Hips Rising Early"], ["coach-power-clean", "2. First Pull (bazowy ruch: power clean)"]]},
    {"c": "mis.barAway", "s": [["barbend-clean", "Common Mistakes: Kicking the Bar"], ["experiencelife-power-clean", "Common Mistakes: Bar drifting away (bazowy ruch: power clean)"], ["crossfit-cj", "Common Faults: Incomplete first pull (bar drifts from the body)"]]},
    {"c": "olympic.mis.arms", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It”"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch: power clean)"], ["crossfit-cj", "Common Faults: Pulling early on the clean (arms bend before full hip and knee extension)"]]}
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
    {"c": "olympic.extend", "s": [["catalyst-59", "akapit First pull (bazowy ruch)"], ["barbend-clean", "Extend Up (bazowy ruch)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-clean", "Common Mistakes: Trying to „Muscle It” (bazowy ruch)"], ["experiencelife-power-clean", "Common Mistakes: Bending the arms too early (bazowy ruch)"]]}
   ]
  },
  "Clean and Jerk": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-76", "akapit Clean (braced back)"], ["crossfit-cj", "Setup Position (back flat)"]]}
   ],
   "move": [
    {"c": "olympic.legsFirst", "s": [["catalyst-76", "akapit Clean (push with the legs through the whole foot)"], ["barbend-clean", "Push, Hard (bazowy ruch: zarzut)"]]},
    {"c": "olympic.extend", "s": [["crossfit-cj", "Clean — Second Pull (from mid-thigh, fully extend hips and legs)"], ["barbend-clean", "Extend Up (bazowy ruch: zarzut)"]]},
    {"c": "olympic.under", "s": [["catalyst-76", "akapit Transition and rack (spin the elbows around the bar)"], ["crossfit-cj", "Clean — Third Pull (elbows high, bar racked on the shoulders)"]]},
    {"c": "olympic.catchLow", "s": [["catalyst-76", "akapit Transition and rack (receiving squat, then stand)"], ["crossfit-cj", "Clean — Third Pull (finish in a front squat and stand up)"]]},
    {"c": "olympic.splitMove", "s": [["catalyst-76", "część jerk (dip, drive straight back up with the legs, push the bar up, move the feet into the split as you punch the elbows)"], ["crossfit-cj", "Jerk — Dip / Drive / Split-Receive (arms push under the bar, feet into a split, arms locked out)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["crossfit-cj", "Clean — First/Second Pull (bar close to the body)"], ["catalyst-59", "akapit Second pull (bazowy ruch: zarzut)"]]},
    {"c": "olympic.dip", "s": [["catalyst-76", "część jerk („Dip by bending at the knees only with the trunk vertical”)"], ["crossfit-cj", "Jerk — Dip (hips and shoulders travel straight down, torso vertical)"]]},
    {"c": "pp.legs", "s": [["catalyst-76", "część jerk („As you finish the extension of the legs, push the bar up…”)"], ["crossfit-cj", "Jerk — Drive (aggressively extends the hips and knees), potem Split/Receive (arms push under)"]]},
    {"c": "olympic.feetHands", "s": [["catalyst-76", "część jerk (move the feet into the split as you punch the elbows)"], ["crossfit-cj", "Jerk — Split/Receive (arms locked out at the time the feet hit the floor)"]]},
    {"c": "olympic.recover", "s": [["catalyst-76", "część jerk (secure the bar, then recover to standing with the bar still overhead)"], ["crossfit-cj", "Jerk — Recovery (feet back in line, bar stays overhead)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["crossfit-cj", "Common Faults: Pulling early on the clean"], ["barbend-clean", "Common Mistakes: Trying to „Muscle It” (bazowy ruch)"]]},
    {"c": "mis.barAway", "s": [["crossfit-cj", "Common Faults: Incomplete first pull (bar drifts from the body)"], ["barbend-clean", "Common Mistakes: Kicking the Bar (bazowy ruch)"]]},
    {"c": "olympic.mis.forward", "s": [["catalyst-76", "część jerk (drive straight back up)"], ["crossfit-jerk", "Common Faults — Fault #2 (drives the barbell out front; bazowy ruch: podrzut)"]]}
   ]
  },
  "Clean Pull": {
   "setup": [
    {"c": "olympic.setupBack", "s": [["catalyst-98", "akapit Setup (trunk braced, back extended)"], ["rogue-clean-pull", "Start Position (flat back)"], ["barbend-clean-pull", "Step 1 — Set Up (low, braced starting posture)"]]}
   ],
   "move": [
    {"c": "olympic.triple", "s": [["catalyst-98", "akapity Extension / Heels and top position (extend roughly vertically, heels rise naturally)"], ["rogue-clean-pull", "Execution (explode through hips, knees, and ankles)"], ["barbend-clean-pull", "Step 3 — Get Tall (extend hips and legs, then shrug)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "olympic.mis.arms", "s": [["barbend-clean-pull", "Common Clean Pull Mistakes: Using Your Arms (only shrug once you've fully extended)"], ["rogue-clean-pull", "Execution (bez ciągnięcia rękami — wg notatki z sesji 1)"]]}
   ]
  }
 }
}
```

### 2b. Blok warunkowy — tylko jeśli koordynator uzna IronMind za szczebel 4 [sesja 2]

NIE są to dane do wdrożenia. Każde zdanie ma po jednym źródle szczebla 4 (Catalyst) + IronMind (autor z kwalifikacjami, bez daty).

```json
{
 "orgs": {
  "IronMind": {"name": "IronMind — Jim Schmitz on the Lifts (wydawca; autor: trener kadry olimpijskiej USA 1980, 1988, 1992; artykuły bez daty)", "level": "4?", "kind": "site"}
 },
 "sources": {
  "ironmind-split": {"org": "IronMind", "title": "Split Lifting Technique (J. Schmitz)", "url": "https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/", "level": "4?"},
  "ironmind-clean-dl-shrug": {"org": "IronMind", "title": "Clean Deadlift & Shrug (J. Schmitz)", "url": "https://ironmind.com/articles/jim-schmitz-on-the-lifts/Clean-Deadlift-Shrug/", "level": "4?"},
  "ironmind-blocks": {"org": "IronMind", "title": "Lifting off Blocks (J. Schmitz)", "url": "https://ironmind.com/articles/jim-schmitz-on-the-lifts/Lifting-off-Blocks/", "level": "4?"},
  "catalyst-93": {"org": "Catalyst Athletics", "title": "Clean Shrug", "url": "https://www.catalystathletics.com/exercise/93/Clean-Shrug/", "level": 4}
 },
 "exercises": {
  "Split Clean": {"move": [
   {"c": "olympic.splitCatch", "s": [["catalyst-211", "akapit Execution (squat clean mechanics, under in a split position)"], ["ironmind-split", "akapit o split clean (pulled just as for a power or squat lift; front leg forward, back leg backward)"]]}
  ]},
  "Block Clean": {"setup": [
   {"c": "olympic.blockStart", "s": [["catalyst-379", "akapit o starcie („from a dead stop with no prior stretch…”; static start)"], ["ironmind-blocks", "akapit 3 (dead stop — no hip, back or leg movement before the pull)"]]}
  ]},
  "Block Power Clean": {"setup": [
   {"c": "olympic.blockStart", "s": [["catalyst-380", "akapit o starcie („beginning from a dead stop…”)"], ["ironmind-blocks", "akapit 3 (dead stop; artykuł o zarzutach i zrywach z podestów)"]]}
  ]},
  "Clean Shrug": {"move": [
   {"c": "olympic.shrugTop", "s": [["catalyst-93", "opis (extend the entire body approximately vertically, shrug up and back; heels rise naturally)"], ["ironmind-clean-dl-shrug", "akapit 4 (fully extend hips, knees and ankles, shrug, rise onto toes; „deltoids to the earlobes”; wariant: start z ziemi)"]]}
  ]}
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
| olympic.blockStart [sesja 2, warunkowe] | Ruszaj z miejsca, bez bujania — od pierwszej chwili mocno ciągnij. | Start from a dead stop, no rocking — pull hard from the very first moment. |
| olympic.shrugTop [sesja 2, warunkowe] | Wyprostuj biodra, kolana i kostki i mocno wzrusz barkami w górę — pięty same się uniosą. | Extend your hips, knees and ankles and shrug hard — your heels will rise on their own. |

Istniejące zdania użyte słowo w słowo: `oly.close`, `oly.legs`, `mis.barAway`, `pp.legs` (Clean and Jerk). Zdania z olympic-jerk.md użyte w Clean and Jerk
(jedna przestrzeń nazw, bez dubli): `olympic.splitMove`, `olympic.dip`, `olympic.feetHands`, `olympic.recover`, `olympic.mis.forward`.

## 4. Źródła (przeczytane 02.11.2026)

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| catalyst-67 | https://www.catalystathletics.com/exercise/67/Power-Clean/ | Catalyst Athletics | 4 | opis: Setup, First pull, przyjęcie, różnica od pełnego zarzutu („only difference…”, akapit 1) |
| catalyst-59 | https://www.catalystathletics.com/exercise/59/Clean/ | Catalyst Athletics | 4 | Setup, First/Second pull, Third pull, Receive, Recovery |
| catalyst-68 | https://www.catalystathletics.com/exercise/68/Hang-Clean/ | Catalyst Athletics | 4 | pozycje zwisu, początek ruchu, łokcie, przyjęcie |
| catalyst-98 | https://www.catalystathletics.com/exercise/98/Clean-Pull/ | Catalyst Athletics | 4 | Setup, Pull, Extension, Finish, Heels |
| catalyst-379 | https://www.catalystathletics.com/exercise/379/Block-Clean/ | Catalyst Athletics | 4 | wysokość podestów („most commonly… knee height”), Setup and pull, start „from a dead stop” (sesja 2), Receive |
| catalyst-380 | https://www.catalystathletics.com/exercise/380/Block-Power-Clean/ | Catalyst Athletics | 4 | Setup, Pull, Receive depth, start „from a dead stop” (sesja 2) |
| catalyst-211 | https://www.catalystathletics.com/exercise/211/Split-Clean/ | Catalyst Athletics | 4 | Execution (tylko ogólnie) |
| catalyst-93 | https://www.catalystathletics.com/exercise/93/Clean-Shrug/ | Catalyst Athletics | 4 | start (stojąc, sztanga wysoko na udach), wyprost pionowy, wzruszenie „up and back”, pięty same się unoszą, sztanga przy ciele (sesja 2: ponownie) |
| catalyst-544 | https://www.catalystathletics.com/exercise/544/Clean-Rack-Delivery/ | Catalyst Athletics | 4 | pozycja „scarecrow”, obrót łokci, błąd: pochylanie klatki do sztangi (sesja 2: ponownie; nadal jedyne źródło) |
| catalyst-76 | https://www.catalystathletics.com/exercise/76/Clean-Jerk/ | Catalyst Athletics | 4 | Clean, Transition and rack, część jerk (dip, drive, split, recovery — sesja 2: cytaty sprawdzone); brak sekcji błędów |
| barbend-power-clean | https://barbend.com/power-clean/ | BarBend | 4 (artykuł o technice) | Steps 1–5, Common Mistakes (Using Your Arms, Pulling Early, Deadlifting the Weight) |
| barbend-clean | https://barbend.com/how-to-do-the-clean/ | BarBend | 4 (artykuł o technice) | Setup, Push Hard, Extend Up, Flip and Rack, Common Mistakes (4) |
| barbend-hang-clean | https://barbend.com/hang-clean/ | BarBend | 4 (artykuł o technice) | Steps 1–4, FAQ steps, Common Mistakes |
| barbend-clean-pull | https://barbend.com/clean-pull-guide/ | BarBend | 4 (artykuł o technice; J. Dickson, NASM-CPT, USAW-L2, 15.07.2024) | Step 1–3, Common Clean Pull Mistakes (Treating It Like a Deadlift, Coming Up Onto Toes Early, Using Your Arms) — sesja 2 |
| coach-power-clean | https://www.coachweb.com/barbell-exercises/6964/how-to-master-the-power-clean | Coach | 4 | kroki 1–5 (Strong Stance … Bar Path) |
| rogue-clean-pull | https://www.roguefitness.com/theindex/movement-library/movement-demo-clean-pull | Rogue Fitness (producent sztang) | 4 | Movement Breakdown: Start Position, Execution |
| rogue-hang-squat-clean | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-squat-clean | Rogue Fitness | 4 | Start/Hang Position, Execution, przyjęcie w pełnym przysiadzie |
| rogue-hang-power-clean | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-clean | Rogue Fitness | 4 | jak wyżej, przyjęcie w niepełnym przysiadzie (do przyszłego Hang Power Clean; tu nieużyte w danych) |
| experiencelife-power-clean | https://experiencelife.lifetime.life/article/learn-to-power-clean/ | Experience Life | 4 | kroki 1–4, Common Mistakes |
| crossfit-cj | https://www.crossfit.com/essentials/the-clean-and-jerk | CrossFit | 4 | Setup Position; Clean: First/Second/Third Pull, Transition; Jerk: Dip, Drive, Split/Receive („should be locked out at the time that the feet hit the floor on the split”), Recovery; Common Faults (5) — sesja 2 |
| crossfit-jerk | https://www.crossfit.com/essentials/foundational-movement-jerk-what-is-a-jerk | CrossFit | 4 | czytane w olympic-jerk.md; tu tylko Fault #2 (bazowy ruch: podrzut) |
| ironmind-split | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Split-Lifting-Technique/ | IronMind | **4? (bez daty — do rozstrzygnięcia)** | opis split clean (ciąg jak w zarzucie, noga w przód / w tył, szybkie stopy) |
| ironmind-clean-dl-shrug | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Clean-Deadlift-Shrug/ | IronMind | **4?** | akapity 2–10: ustawienie z ziemi, proste ręce, wyprost + wzruszenie + palce, błędy (zgięte ręce, okrągłe plecy, szarpanie) — sesja 2 |
| ironmind-blocks | https://ironmind.com/articles/jim-schmitz-on-the-lifts/Lifting-off-Blocks/ | IronMind | **4?** | akapity 1–9: wysokość (zwykle połowa ud), start z bezruchu (akapit 3), uwagi o odkładaniu na środek podestów — sesja 2 |

Uwaga o niezależności: barbend-* to jedna organizacja — w żadnym zdaniu nie liczą się razem jako dwa źródła. catalyst-* — ta sama organizacja;
w każdym zdaniu najwyżej jedno z nich liczone. crossfit-cj i crossfit-jerk — jedna organizacja (CrossFit).

Przeczytane w sesji 2 i nieprzydatne: zasoby Eleiko z PDF „Training for the Jerk” (Push Press, Tall Push Jerk, Tall Split Jerk, wykroki, wyciskanie
stojąc — żadnego o Clean Shrug / Block / Split Clean / Jerk Balance / Jerk Dip; adresy w olympic-jerk.md); IronMind „One in Front, One in Back…” (o podejściach
w zawodach, nie o technice). PDF Eleiko „Weightlifting Strength Station” — treść skompresowana, nieczytelna przez WebFetch.

## 5. Otwarte

- [OTWARTE] **Szczebel IronMind** — autor imiennie (trener kadry USA), brak daty artykułów; nie producent sztang. Wg rozstrzygnięcia z 02.11 warunek (b) niespełniony
  → do decyzji koordynatora. Od tego zależą: `olympic.splitCatch` (Split Clean), `olympic.blockStart` (Block Clean, Block Power Clean), `olympic.shrugTop` (Clean Shrug) — sekcja 2b.
- [OTWARTE] **Clean Shrug** — catalyst-93 + IronMind (warunkowo). Brak wspólnego ustawienia (Catalyst: start stojąc ze sztangą wysoko na udach; IronMind: z ziemi)
  i wspólnego błędu (Catalyst: sztanga odjeżdża; IronMind: zgięte ręce, okrągłe plecy) — nawet przy uznaniu IronMind ćwiczenie byłoby „częściowe” (tylko move).
  Zestaw ogólny `oly` (`oly.back`, `oly.close`, `oly.mis`) nie jest potwierdzony dla tego ćwiczenia — krótsza karta zamiast niego. Muscle & Strength (403, a szczebel „otwarte”) — nie liczę.
- [OTWARTE] **Rack Delivery** — tylko catalyst-544 (ustawienie w pozycji „strach na wróble”, obrót łokci, błąd: pochylanie klatki do sztangi). Brak drugiego źródła
  (sesja 2: wyszukiwania dały tylko strony aplikacji i blogi). Ćwiczenie nie ma pozy w `lib/figures/v2/poses/olympic.json`.
- [OTWARTE] **Block Clean / Block Power Clean — start z podestów** — `olympic.blockStart` z Catalyst + IronMind (warunkowo). **Wysokość podestów — rozbieżność**:
  Catalyst „most commonly… knee height”, IronMind „above the knees around the middle of the thighs” → część wspólna: „mniej więcej na wysokości kolan lub nieco wyżej”; nie wpisane (liczba/konwencja).
- [OTWARTE] **Split Clean — wykrok** — `olympic.splitCatch` (catalyst-211 + IronMind, warunkowo). Szczegóły (odległości stóp, przednia goleń pionowo, która noga wraca pierwsza)
  — w sesji 2 znalezione tylko źródła o podrzucie (split jerk) — analogia, nie liczę. Liczby IronMind („ok. 1 stopa / 2 stopy”) — poza wyjątkiem dla techniki.
- [OTWARTE] **Clean and Jerk — powrót z wykroku „najpierw przednia stopa”** — crossfit-cj (Recovery) + crossfit-jerk — jedna organizacja; catalyst-76 nie podaje kolejności. Nie wpisane.
- [OTWARTE] **Clean and Jerk — błąd „nogi z przodu za daleko / tylna noga prosta”** (crossfit-cj, Poor split jerk footwork) — jedno źródło.
- [OTWARTE] **Clean Pull — `oly.close`, `mis.barAway`** — tylko catalyst-98; **„za wczesne wspięcie na palce”** — tylko barbend-clean-pull.
- [OTWARTE] **Pozycja sztangi nad stopą na starcie** — catalyst-* mówi „nad przodostopiem” (balls of the foot), rogue-*, barbend-hang-clean i crossfit-cj („weight through the midfoot”) „nad śródstopiem”:
  rozbieżność na tym samym szczeblu; nie wpisane. Część wspólna: sztanga blisko piszczeli, nad stopą.
- [OTWARTE] **Wysokie łokcie w przyjęciu / błąd „łokcie nisko”** — catalyst-59/-67, barbend-clean (Incomplete Front Rack), crossfit-cj (Collapsing in the clean receiving position: „Keep the chest up and elbows high”).
  Trzy organizacje — merytorycznie wystarczy dla Clean i Clean and Jerk; zdanie `olympic.rack` („Łokcie wysoko, sztanga na przodzie barków.”) gotowe do wpisania,
  ale pominięte w sesji 1 z powodu łączenia z twierdzeniem o nadgarstkach — wersja bez twierdzenia o zdrowiu do decyzji koordynatora.
- [OTWARTE] **`oly.back`** („klatka do góry”) i **`oly.mis`** („plecy się zaokrąglają”) — dla tych ćwiczeń brak 2 źródeł na całe zdanie (patrz sekcja 1); crossfit-cj ma „rounded backs”
  tylko w przyjęciu zarzutu, nie w ciągu.
- Źródła niedostępne: ExRx (403), web.archive.org (zablokowane), NSCA (nsca.com i dxpprod.nsca.com — 403), educ.jmu.edu (zablokowany host), Muscle & Strength (403).

## 6. Stan

- Zrobione (sesja 1): 19 stron; 12 nowych zdań. (Sesja 2): +5 stron użytych (crossfit-cj, barbend-clean-pull, ironmind-clean-dl-shrug, ironmind-blocks, ponownie catalyst-76/-93/-379/-380/-544),
  +6 stron Eleiko i 1 IronMind przejrzanych bez wyniku. Stan: **5 gotowe** (Power Clean, Clean, Hang Clean, Clean and Jerk, Clean Pull), **3 częściowe** (Block Clean, Block Power Clean,
  Split Clean), **2 otwarte** (Clean Shrug, Rack Delivery). 2 nowe zdania warunkowe (`olympic.blockStart`, `olympic.shrugTop`). Poprawka szczebli: IronMind wyłączony z liczenia, `olympic.splitCatch` cofnięte.
- Zostało: decyzja o szczeblu IronMind; drugie źródło dla Rack Delivery i ustawienia w Clean Shrug; szczegóły wykroku Split Clean.
- Następny krok: jeśli IronMind = 4 — przenieść blok 2b do danych (Block × 2 → gotowe po dodaniu błędu z bazowego ruchu, już jest; Split Clean → częściowe z wykrokiem).
  Inaczej szukać: USA Weightlifting (materiały kursu L1 — PDF), Eleiko inspire360 (zasoby o zarzucie — adresy nieznane; PDF-y programów nieczytelne przez WebFetch).
- Pułapki: Catalyst przez WebFetch czasem zwraca inną stronę przy złym numerze (adres /exercise/58/ dał „Snatch”) — sprawdzaj tytuł strony; Rogue ma wiele adresów 404
  (dobre: `movement-demo-clean-pull`, `-hang-squat-clean`, `-hang-power-clean`); PDF-y Eleiko są skompresowane — WebFetch czyta tylko adresy linków, nie tekst.
