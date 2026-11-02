# Wskazówki techniki — rodzina `squat`, część 1

- Data: 02.11.2026
- Autor: badacz-merytoryczny
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda jak w `docs/research/33-wskazowki-partia2.md` („Metoda”): każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z różnych
organizacji o tym ćwiczeniu (albo jego wariancie — opis „(wariant: …)”); źródło o innym ćwiczeniu = analogia, nie liczy się.
Bez liczb (tempo, obciążenia, głębokość w stopniach) i bez uzasadnień zdrowotnych. Zdania z zestawu ogólnego, których przeczytane
źródła danego ćwiczenia nie potwierdzają, nie trafiają do karty (opis w „Otwarte → błędy zestawów ogólnych”).

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Box Squat | gotowe | nowe `box.setup`, `box.move`, `box.tight`, `box.mis.bounce`; `hinge.back` |
| Bodyweight Squat | gotowe | tylko istniejące zdania |
| Smith Machine Squat | gotowe | nowe `smith.setup`; ruch — istniejące `hack.move`; błąd `sq.mis.heels` — drugie źródło (Coach) mówi tylko „push through your heels” (zgodne, ale nie nazywa błędu) |
| Dumbbell Squat | otwarte | brak ustawienia z 2 źródłami (pozycja hantli i rozstaw stóp tylko w jednym źródle) |
| Zercher Squat | gotowe | nowe `zer.hold`, `zer.move`, `zer.tense`; `gob.close` |
| Landmine Squat | gotowe | nowe `lm.hold`; reszta istniejące |
| Sumo Squat (hantel) | gotowe | nowe `sumo.setup`; ruch `hack.move` |
| Double Kettlebell Front Squat | gotowe | nowe `kbfs.rack`, `kbfs.move`, `kbfs.lockout`; `hinge.back` |
| Overhead Squat | gotowe | nowe `ohs.setup`, `ohs.move`, `ohs.arms`; `sq.back` |
| Barbell Hack Squat | gotowe | nowe `bhs.setup`; `hack.move`, `hinge.back`, `sq.mis.heels`. **Zestaw `hingeFloor` nie pasuje** — patrz „Otwarte” |
| Cable Squat | nie zbadane | patrz „Stan” |
| One-Arm Overhead Kettlebell Squat | nie zbadane | patrz „Stan” |
| Dip Belt Squat | nie zbadane | patrz „Stan” |

## 2. Wpisy do `cues.json` → `exercises`

```json
{
  "Box Squat": {
    "setup": [
      {"c": "box.setup", "s": [["barbend-box-squat", "Step 1–2 (box a few feet back; calves nearly touching the box; set up as for back squats)"], ["physitrack-box-squat", "FAQ: correct form (start in front of the box)"], ["gopher-box-squat", "Setup (bar on upper back — shoulder blades form a shelf)"]]}
    ],
    "move": [
      {"c": "box.move", "s": [["barbend-box-squat", "Step 3–4 (hips back, squat until butt is on the box, pause, stand up)"], ["gopher-box-squat", "Descent; Contact with the box (hips begin the motion, sit back to the box, pause briefly)"], ["physitrack-box-squat", "Step 2–3 (push hips back, sit down into the chair; stand up)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["physitrack-box-squat", "Step 2 (keeping your back straight)"], ["gopher-box-squat", "Setup/Back (back arched, abdominals squeezed)"]]},
      {"c": "box.tight", "s": [["barbend-box-squat", "Step 3–4 (stay tense; stay tight); Mistakes: Sitting Too Long"], ["gopher-box-squat", "Contact with the box (relax hip flexors while keeping every muscle tight)"]]}
    ],
    "mistakes": [
      {"c": "box.mis.bounce", "s": [["barbend-box-squat", "Step 4 (do not bounce up off the box)"], ["gopher-box-squat", "Mistakes (trying to bounce off the box)"]]}
    ]
  },
  "Bodyweight Squat": {
    "setup": [
      {"c": "gob.stance", "s": [["ace-135", "Preparation (feet slightly wider than hip-width, toes slightly out)"], ["coach-bodyweight-squat", "Step 1 (feet hip-width apart)"]]}
    ],
    "move": [
      {"c": "sq.down", "s": [["ace-135", "Step 3 (hips back then down; hips and knees bend together); Step 6 (pressing through heels)"], ["coach-bodyweight-squat", "Descent (sit back into an invisible chair); Ascent (drive through the heels)"]]}
    ],
    "tips": [
      {"c": "sq.back", "s": [["ace-135", "Step 2 (lift your chest); Step 3 (back flat)"], ["physitrack-bodyweight-squat", "Instructions (back straight, head and chest up)"]]},
      {"c": "sq.kneesToes", "s": [["ace-135", "Step 4–5 (knees tracking over second toe)"], ["physitrack-bodyweight-squat", "Instructions (knees over your toes)"], ["coach-bodyweight-squat", "Knees (never roll inwards)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["ace-135", "Step 4 (stop if heels lift); Step 6 (heels stay down)"], ["physitrack-bodyweight-squat", "Instructions (heels flat on the floor)"]]},
      {"c": "sq.mis.kneesIn", "s": [["ace-135", "Step 4 (knees over second toe, ankles not collapsing in)"], ["coach-bodyweight-squat", "Knees (never let your knees roll inwards)"]]}
    ]
  },
  "Smith Machine Squat": {
    "setup": [
      {"c": "smith.setup", "s": [["coach-smith-squat", "Steps 1–2 (rest bar on the back of the shoulders; feet slightly in front of the bar)"], ["barbend-best-smith", "Smith Machine Back Squat (bar on upper back; feet slightly in front of the barbell)"], ["physitrack-smith-squat-90", "Instructions (bar on upper back, not on the neck)"]]}
    ],
    "move": [
      {"c": "hack.move", "s": [["coach-smith-squat", "Steps 3–4 (lower bending at the hips and knees; push back up to standing)"], ["physitrack-smith-squat-90", "Instructions (squat down; press up until legs are straight)"]]}
    ],
    "tips": [
      {"c": "sq.back", "s": [["coach-smith-squat", "Step 3 (keep your chest up, spine neutral)"], ["barbend-best-smith", "Smith Machine Back Squat (head forward, spine neutral)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["barbend-best-smith", "Form tips (even foot pressure; don't pop up on your toes)"], ["coach-smith-squat", "Step 4 (push through your heels)"]]}
    ]
  },
  "Zercher Squat": {
    "setup": [
      {"c": "zer.hold", "s": [["breakingmuscle-zercher", "Bar position (bar in rack, squat under it, bar in the crook of the elbows)"], ["barbend-zercher", "Bar position (crooks of the elbows, 'scooping' it out of the rack)"]]}
    ],
    "move": [
      {"c": "zer.move", "s": [["breakingmuscle-zercher", "Descent; Torso (torso as upright as possible); Ascent (press up, feet flat)"], ["barbend-zercher", "Descent; Torso (start upright, resist the forward pull); Ascent (push hard through the floor)"]]}
    ],
    "tips": [
      {"c": "gob.close", "s": [["breakingmuscle-zercher", "Mistakes: Leaning forward (keep the bar close to your body, torso vertical)"], ["barbend-zercher", "Torso (resist the load as it attempts to pull your torso forwards)"]]},
      {"c": "zer.tense", "s": [["breakingmuscle-zercher", "Descent (keep your legs, core, and arms tense)"], ["barbend-zercher", "Ascent (tension should be felt in the legs, arms, shoulders, and core)"]]}
    ],
    "mistakes": []
  },
  "Landmine Squat": {
    "setup": [
      {"c": "lm.hold", "s": [["coach-landmine-squat", "How-to (hold the loaded end in both hands, at chest height)"], ["breakingmuscle-landmine", "Landmine Goblet Squat (support the end of the bar with both hands near your upper chest) (wariant: landmine goblet squat — ten sam chwyt i ruch)"]]}
    ],
    "move": [
      {"c": "gob.move", "s": [["coach-landmine-squat", "How-to (squat with the bar in front of your chest; weight on heels; chest up as you stand)"], ["breakingmuscle-landmine", "Landmine Goblet Squat (bar tight to your chest; squat down; feet flat; stand up)"]]}
    ],
    "tips": [
      {"c": "gob.close", "s": [["breakingmuscle-landmine", "Landmine Goblet Squat (keep the bar tight to your chest; don't let the weight drift away)"], ["coach-landmine-squat", "How-to (keep your chest up)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["coach-landmine-squat", "How-to (keeping your weight on your heels)"], ["breakingmuscle-landmine", "Landmine Goblet Squat (keep your feet flat)"]]}
    ]
  },
  "Sumo Squat (hantel)": {
    "setup": [
      {"c": "sumo.setup", "s": [["ace-expert-5875", "Dumbbell Sumo Squat (feet wider than hips, toes out; one dumbbell in both hands, arms toward the floor)"], ["coach-sumo-squat", "Stance; Weighted version (feet wide, toes out; weight hangs down towards the floor)"], ["physitrack-sumo-db-squat", "Instructions (feet slightly wider than shoulders, dumbbell in both hands)"]]}
    ],
    "move": [
      {"c": "hack.move", "s": [["coach-sumo-squat", "Descent (bending at the hips and knees); Ascent (stand back up)"], ["physitrack-sumo-db-squat", "Instructions (flexing at the hips, knees and ankles; straighten your legs)"], ["ace-expert-5875", "Dumbbell Sumo Squat (bend the knees, lower; straighten the legs)"]]}
    ],
    "tips": [
      {"c": "sq.kneesToes", "s": [["physitrack-sumo-db-squat", "Instructions (knees inline with your toes)"], ["coach-sumo-squat", "Knees and chest (knees out)"]]},
      {"c": "sq.back", "s": [["physitrack-sumo-db-squat", "Instructions (back straight and upright, head up)"], ["coach-sumo-squat", "Knees and chest (keep your chest up)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["physitrack-sumo-db-squat", "Instructions (do not allow your heels to rise off the ground)"], ["coach-sumo-squat", "Mistakes to avoid (don't lift your feet off the ground)"]]}
    ]
  },
  "Double Kettlebell Front Squat": {
    "setup": [
      {"c": "kbfs.rack", "s": [["breakingmuscle-2kb-front-squat", "Rack position (bells on forearms, biceps, shoulders; neutral wrist)"], ["barbend-front-squat-variations", "Double Kettlebell Front Squat (front-rack position; keep your wrists neutral)"], ["ace-expert-5386", "Double Kettlebell Front Squat (kettlebells in the rack position)"]]}
    ],
    "move": [
      {"c": "kbfs.move", "s": [["breakingmuscle-2kb-front-squat", "Descent (sit straight down); Ascent (pressing the ground away)"], ["ace-expert-5386", "Double Kettlebell Front Squat (pull yourself down; drive through the floor to stand)"], ["barbend-front-squat-variations", "Double Kettlebell Front Squat (any loss of position and you'll lose the kettlebells)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["ace-expert-5386", "Double Kettlebell Front Squat (maintain a neutral spine)"], ["breakingmuscle-2kb-front-squat", "Torso/Back (neutral setup); Common faults: losing your hip tuck"]]},
      {"c": "kbfs.lockout", "s": [["ace-expert-5386", "Double Kettlebell Front Squat (lock the hips out at the top)"], ["breakingmuscle-2kb-front-squat", "Ascent (finish in the same neutral position); Common faults: Not finishing"]]}
    ],
    "mistakes": []
  },
  "Overhead Squat": {
    "setup": [
      {"c": "ohs.setup", "s": [["physitrack-ohs", "Step 1 (hold it above your head with your arms straight; feet shoulder-width)"], ["coach-ohs", "How-to (feet shoulder-width; bar overhead, arms straight)"], ["physitrack-ohs-barbell", "Instructions (barbell overhead, arms fully locked out)"]]}
    ],
    "move": [
      {"c": "ohs.move", "s": [["physitrack-ohs", "Step 2 (squat down, chest up, arms overhead the entire time)"], ["coach-ohs", "How-to (squat down; keep your chest elevated; drive back up through your heels)"]]}
    ],
    "tips": [
      {"c": "ohs.arms", "s": [["physitrack-ohs", "Step 1–2 (arms straight; overhead the entire time)"], ["coach-ohs", "How-to (ensuring your arms are straight)"]]},
      {"c": "sq.back", "s": [["physitrack-ohs-barbell", "Instructions (back straight and upright, head up)"], ["coach-ohs", "How-to (head and spine neutral; chest elevated)"]]}
    ],
    "mistakes": []
  },
  "Barbell Hack Squat": {
    "setup": [
      {"c": "bhs.setup", "s": [["barbend-hack-squat", "Barbell Hack Squat — Setup/Grip (heels touching the bar behind you; feet shoulder-width; overhand grip behind you)"], ["coach-hack-squat", "Barbell Hack Squat — Setup/Grip (back to the bar; overhand grip, palms facing behind; feet shoulder-width)"]]}
    ],
    "move": [
      {"c": "hack.move", "s": [["barbend-hack-squat", "Barbell Hack Squat — Descent (drop hips back and down); Ascent (push your feet into the floor to stand up)"], ["coach-hack-squat", "Barbell Hack Squat — Descent (bend your knees to lower); Ascent (back to the start)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["barbend-hack-squat", "Barbell Hack Squat — Back (spine neutral); Mistakes: Rounding"], ["coach-hack-squat", "Barbell Hack Squat — Back (shoulder blades to straighten your back)"], ["breakingmuscle-hack-squat", "Back/Spine (keep the spine neutral)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["barbend-hack-squat", "Barbell Hack Squat — Mistakes: Heels lifting"], ["coach-hack-squat", "Barbell Hack Squat — Ascent (drive through midfoot and heels); Mistakes: pressing through the forefoot"]]}
    ]
  }
}
```

Uwaga: puste `mistakes` (Zercher, Double Kettlebell Front Squat, Overhead Squat) — minimum (wskazówki + błędy ≥ 2) spełniają dwie wskazówki.

## 3. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `box.setup` | Stań tuż przed skrzynią lub ławką, sztanga na górze pleców jak w zwykłym przysiadzie. | Stand just in front of the box or bench, bar on your upper back as in a regular squat. | żadne istniejące zdanie nie mówi o skrzyni |
| `box.move` | Cofnij biodra i usiądź na skrzyni pod kontrolą; po krótkiej pauzie wstań. | Push your hips back and sit onto the box under control; pause briefly, then stand up. | ruch z pauzą na skrzyni — inny niż `sq.down` |
| `box.tight` | Na skrzyni zostań napięty — nie rozluźniaj się całkiem. | Stay tight on the box — don't relax completely. | cecha tylko tego wariantu |
| `box.mis.bounce` | Odbijanie się od skrzyni. | Bouncing off the box. | błąd tylko tego wariantu |
| `smith.setup` | Stań pod sztangą na prowadnicy i oprzyj ją na górze pleców; stopy trochę przed sztangą. | Stand under the bar on the track and rest it on your upper back; feet slightly in front of the bar. | stopy przed sztangą — inne niż `sq.bar` |
| `zer.hold` | Sztanga w zgięciach łokci, blisko tułowia; zdejmij ją ze stojaka. | Bar in the crooks of your elbows, close to your body; lift it out of the rack. | chwyt tylko tego ćwiczenia |
| `zer.move` | Zejdź w przysiad z tułowiem jak najbardziej pionowo; wstań, wypychając podłogę stopami. | Squat down with your torso as upright as you can; stand up by pushing the floor away. | `gob.move` mówi o ciężarze „przy klatce” — tu sztanga w łokciach |
| `zer.tense` | Przez cały ruch trzymaj napięte nogi, brzuch i ręce. | Keep your legs, abs and arms tight the whole time. | brak zdania o napięciu całego ciała |
| `lm.hold` | Trzymaj koniec sztangi oburącz przy klatce. | Hold the end of the bar with both hands at your chest. | chwyt tylko tego ćwiczenia |
| `sumo.setup` | Stopy szeroko, palce na zewnątrz; hantel trzymaj oburącz w opuszczonych rękach między nogami. | Feet wide, toes turned out; hold the dumbbell with both hands, arms hanging between your legs. | ustawienie sumo |
| `kbfs.rack` | Dwa kettlebelle z przodu na barkach, oparte na przedramionach; nadgarstki proste. | Two kettlebells racked at the front of your shoulders, resting on your forearms; wrists straight. | pozycja tylko tego ćwiczenia |
| `kbfs.move` | Zejdź w przysiad, trzymając kettlebelle w tej samej pozycji; wstań, wypychając podłogę stopami. | Squat down keeping the kettlebells in the same position; stand up by pushing the floor away. | ruch z utrzymaniem pozycji ciężarów |
| `kbfs.lockout` | Na górze stań całkiem prosto, z wyprostowanymi biodrami. | At the top, stand all the way up with your hips straight. | brak zdania o dokończeniu ruchu w rodzinie squat |
| `ohs.setup` | Sztanga nad głową na wyprostowanych rękach, stopy na szerokość barków. | Bar overhead on straight arms, feet shoulder-width apart. | ustawienie tylko tego ćwiczenia |
| `ohs.move` | Zejdź w przysiad z uniesioną klatką i sztangą cały czas nad głową; wstań, wypychając podłogę stopami. | Squat down with your chest up and the bar overhead the whole time; stand up by pushing the floor away. | ruch z ciężarem nad głową |
| `ohs.arms` | Ręce przez cały ruch wyprostowane. | Keep your arms straight the whole time. | brak takiego zdania (istniejące `ohp.*` dotyczą wyciskania) |
| `bhs.setup` | Sztanga za nogami, chwyt nachwytem w opuszczonych rękach; stopy na szerokość barków. | Bar behind your legs, overhand grip with arms hanging down; feet shoulder-width apart. | ustawienie tylko tego ćwiczenia |

## 4. Nowe źródła

| id | Adres | Organizacja | Szczebel | Miejsce / krótki cytat |
|---|---|---|---|---|
| `barbend-box-squat` | https://barbend.com/box-squat/ | BarBend | 4 | „Do not bounce up off the box or bench.” (Step 4) |
| `physitrack-box-squat` | https://www.physitrack.com/exercise-library/how-to-perform-the-box-squat-exercise | Physitrack | 4 | „Push your hips back behind you, as you try and sit down into the chair.” (Step 2) |
| `gopher-box-squat` | https://blog.gophersport.com/box-squats-for-developing-technique-and-power/ | Gopher Sport (nowa) | 4 | Setup, Descent, Contact with the box, Mistakes |
| `coach-bodyweight-squat` | https://www.coachweb.com/exercises/leg-exercises/193/squat-tips-for-perfect-form | Coach | 4 | „Drive through the heels to stand up and complete the rep.” |
| `physitrack-bodyweight-squat` | https://na.physitrack.com/home-exercise-video/bodyweight-squat | Physitrack | 4 | opis ćwiczenia |
| `coach-smith-squat` | https://www.coachweb.com/exercises/leg-exercises/194/smith-squat | Coach | 4 | „Push through your heels to come back up to standing.” |
| `barbend-best-smith` | https://barbend.com/best-smith-machine-exercises/ | BarBend | 4 | „Don’t sit on your heels or pop up on your toes.” (Smith Machine Back Squat) |
| `physitrack-smith-squat-90` | https://us.physitrack.com/home-exercise-video/smith-machine-squat-to-90 | Physitrack | 4 | „Begin with Smith Machine bar on your upper back (avoid placing directly on the neck)” |
| `breakingmuscle-zercher` | https://breakingmuscle.com/zercher-squat/ | Breaking Muscle | 4 | „Keep your torso as upright as possible throughout the movement.” |
| `barbend-zercher` | https://barbend.com/zercher-squat-ultimate-guide/ | BarBend | 4 | „Be sure to resist the load as it attempts to pull your torso forwards.” |
| `coach-landmine-squat` | https://www.coachweb.com/leg-exercises/4920/how-to-nail-the-landmine-squat | Coach | 4 | „Hold the loaded end in both hands” |
| `breakingmuscle-landmine` | https://breakingmuscle.com/best-landmine-exercises/ | Breaking Muscle | 4 | sekcja „Landmine Goblet Squat” |
| `ace-expert-5875` | https://www.acefitness.org/resources/pros/expert-articles/5875/5-variations-of-the-body-weight-squat/ | ACE | 4 | sekcja „Dumbbell Sumo Squat” |
| `coach-sumo-squat` | https://www.coachweb.com/bodyweight-exercises/7136/how-to-do-the-sumo-squat | Coach | 4 | „Keep your chest up and knees out.” |
| `physitrack-sumo-db-squat` | https://au.physitrack.com/home-exercise-video/sumo-dumbbell-squat | Physitrack | 4 | „Keep your knees inline with your toes and do not allow your heels to rise off the ground.” |
| `breakingmuscle-2kb-front-squat` | https://breakingmuscle.com/the-2-kettlebell-front-squat-the-best-exercise-youre-not-doing-2/ | Breaking Muscle | 4 | Rack position, Descent, Ascent, Common faults |
| `barbend-front-squat-variations` | https://barbend.com/front-squat-variations/ | BarBend | 4 | sekcja „Double Kettlebell Front Squat” |
| `ace-expert-5386` | https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/ | ACE | 4 | „Lock the hips out at the top.” (Double Kettlebell Front Squat) |
| `physitrack-ohs` | https://www.physitrack.com/exercise-library/how-to-perform-the-overhead-squat-exercise | Physitrack | 4 | „Squat down, keeping your chest up and your arms overhead the entire time.” (Step 2) |
| `physitrack-ohs-barbell` | https://us.physitrack.com/home-exercise-video/overhead-squat---with-barbell | Physitrack | 4 | opis ćwiczenia |
| `coach-ohs` | https://www.coachweb.com/exercises/leg-exercises/2725/variation-overhead-squat | Coach | 4 | „squat down as far as you can without letting your back arch” |
| `barbend-hack-squat` | https://barbend.com/hack-squat/ | BarBend | 4 | sekcja „Barbell Hack Squat”: „Keep your arms relaxed the whole time.” |
| `coach-hack-squat` | https://www.coachweb.com/fitness/leg-exercises/hack-squat | Coach | 4 | sekcja „Barbell Hack Squat” |
| `breakingmuscle-hack-squat` | https://breakingmuscle.com/hacking-the-hack-squat/ | Breaking Muscle | 4 | „The goal is to keep the spine neutral, engage the glutes, and refrain from rounded shoulders.” |

Źródło już w `cues.json`: `ace-135`. Uwaga: dwa źródła Physitrack przy jednym ćwiczeniu (Overhead Squat) liczą się jako jedna organizacja — każde zdanie ma też Coach.

```json
{
  "orgs": {
    "Gopher Sport": {"name": "Gopher Sport — blog producenta sprzętu sportowego (blog.gophersport.com)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "barbend-box-squat": {"org": "BarBend", "title": "Box Squat", "url": "https://barbend.com/box-squat/", "level": 4},
    "physitrack-box-squat": {"org": "Physitrack", "title": "Box squat — step-by-step guide", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-box-squat-exercise", "level": 4},
    "gopher-box-squat": {"org": "Gopher Sport", "title": "Box Squats for Developing Technique and Power", "url": "https://blog.gophersport.com/box-squats-for-developing-technique-and-power/", "level": 4},
    "coach-bodyweight-squat": {"org": "Coach", "title": "How To Squat", "url": "https://www.coachweb.com/exercises/leg-exercises/193/squat-tips-for-perfect-form", "level": 4},
    "physitrack-bodyweight-squat": {"org": "Physitrack", "title": "Bodyweight squat (exercise video)", "url": "https://na.physitrack.com/home-exercise-video/bodyweight-squat", "level": 4},
    "coach-smith-squat": {"org": "Coach", "title": "How To Do The Smith Machine Squat", "url": "https://www.coachweb.com/exercises/leg-exercises/194/smith-squat", "level": 4},
    "barbend-best-smith": {"org": "BarBend", "title": "The 15 Best Smith Machine Exercises", "url": "https://barbend.com/best-smith-machine-exercises/", "level": 4},
    "physitrack-smith-squat-90": {"org": "Physitrack", "title": "Smith Machine Squat to 90 (exercise video)", "url": "https://us.physitrack.com/home-exercise-video/smith-machine-squat-to-90", "level": 4},
    "breakingmuscle-zercher": {"org": "Breaking Muscle", "title": "How to Do the Zercher Squat", "url": "https://breakingmuscle.com/zercher-squat/", "level": 4},
    "barbend-zercher": {"org": "BarBend", "title": "The Zercher Squat (ultimate guide)", "url": "https://barbend.com/zercher-squat-ultimate-guide/", "level": 4},
    "coach-landmine-squat": {"org": "Coach", "title": "How To Nail The Landmine Squat", "url": "https://www.coachweb.com/leg-exercises/4920/how-to-nail-the-landmine-squat", "level": 4},
    "breakingmuscle-landmine": {"org": "Breaking Muscle", "title": "The 14 Best Landmine Exercises", "url": "https://breakingmuscle.com/best-landmine-exercises/", "level": 4},
    "ace-expert-5875": {"org": "ACE", "title": "5 Variations of the Body-weight Squat (expert article #5875)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5875/5-variations-of-the-body-weight-squat/", "level": 4},
    "coach-sumo-squat": {"org": "Coach", "title": "How To Do The Sumo Squat", "url": "https://www.coachweb.com/bodyweight-exercises/7136/how-to-do-the-sumo-squat", "level": 4},
    "physitrack-sumo-db-squat": {"org": "Physitrack", "title": "Sumo dumbbell squat (exercise video)", "url": "https://au.physitrack.com/home-exercise-video/sumo-dumbbell-squat", "level": 4},
    "breakingmuscle-2kb-front-squat": {"org": "Breaking Muscle", "title": "The 2-Kettlebell Front Squat", "url": "https://breakingmuscle.com/the-2-kettlebell-front-squat-the-best-exercise-youre-not-doing-2/", "level": 4},
    "barbend-front-squat-variations": {"org": "BarBend", "title": "Front Squat Variations", "url": "https://barbend.com/front-squat-variations/", "level": 4},
    "ace-expert-5386": {"org": "ACE", "title": "Advanced Kettlebell Workout (expert article #5386)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/", "level": 4},
    "physitrack-ohs": {"org": "Physitrack", "title": "Overhead squat — step-by-step guide", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-overhead-squat-exercise", "level": 4},
    "physitrack-ohs-barbell": {"org": "Physitrack", "title": "Overhead squat — with barbell (exercise video)", "url": "https://us.physitrack.com/home-exercise-video/overhead-squat---with-barbell", "level": 4},
    "coach-ohs": {"org": "Coach", "title": "The Overhead Squat", "url": "https://www.coachweb.com/exercises/leg-exercises/2725/variation-overhead-squat", "level": 4},
    "barbend-hack-squat": {"org": "BarBend", "title": "How to Do the Hack Squat (Barbell Hack Squat section)", "url": "https://barbend.com/hack-squat/", "level": 4},
    "coach-hack-squat": {"org": "Coach", "title": "How To Do The Hack Squat (barbell and machine)", "url": "https://www.coachweb.com/fitness/leg-exercises/hack-squat", "level": 4},
    "breakingmuscle-hack-squat": {"org": "Breaking Muscle", "title": "Hacking the Hack Squat", "url": "https://breakingmuscle.com/hacking-the-hack-squat/", "level": 4}
  }
}
```

## 5. Otwarte

- **Dumbbell Squat** — ustawienie: pozycja hantli (po bokach) potwierdza tylko Coach (https://www.coachweb.com/exercises/dumbbell-exercises/dumbbell-squat, „Dumbbell hold”); BarBend (https://barbend.com/dumbbell-squat/, Step 2) mówi tylko „one in each hand”, bez miejsca; rozstaw stóp tylko BarBend („Stance”). Rozstrzygnie: drugie źródło szczebla 4 opisujące przysiad z dwoma hantlami po bokach. Dane częściowe: ruch `sq.down` (BarBend „Descent/Ascent”, Coach „Descent/Ascent”), wskazówka `sq.back` (BarBend „Chest/Back” + błąd „Body posture”, Coach „Keep your chest up”), błąd `sq.mis.kneesIn` (Coach „cave inwards”, BarBend „toes out; knees out”).
- **Barbell Hack Squat — zestaw `hingeFloor` nie pasuje.** Oba źródła opisują przysiad (kolana idą w przód, tułów pionowo; Coach: biodra nie powinny cofać się, sztanga idzie pionowo w dół), nie zawias z podłogi; Coach zaczyna ze stojaka, nie z podłogi. Obecny zestaw ogólny (`hinge.back`, `sq.kneesToes`, `mis.roundBack`): `sq.kneesToes` — żadne przeczytane źródło tego ćwiczenia; `mis.roundBack` („…żeby dociągnąć ciężar”) — BarBend opisuje zaokrąglenie przy opuszczaniu, nie przy dociąganiu → pominięte. Rekomendacja dla koordynatora: rodzina figury/zestawu bliżej `squat` niż `hingeFloor`; decyzja o figurze i wpis recenzji w `docs/research/figury-recenzja.json` (klucz „Barbell Hack Squat”, dziś `rodzina: hingeFloor`, werdykt „wyswietlana”) — poza zakresem badacza, do bramki 4.
- **Błędy zestawów ogólnych (informacja dla koordynatora):**
  - Box Squat: `sq.kneesToes`, `sq.mis.kneesIn`, `sq.mis.heels` — źródła wariantu nie opisują ich wprost — pominięte; `sq.back` → `hinge.back` (źródła: „back straight/arched”, bez „klatka uniesiona”).
  - Smith Machine Squat: `sq.down` („cofając biodra”) — źródła Smitha mówią tylko „bending at the hips and knees” (stopy przed sztangą) → `hack.move`; `sq.kneesToes`, `sq.mis.kneesIn` — brak w źródłach.
  - Bodyweight Squat: `sq.stance` (barki lub szerzej) — ACE „slightly wider than hip-width”, Coach „hip-width” → `gob.stance`.
  - Double Kettlebell Front Squat: `sq.down` („cofając biodra”) przeczy źródłu (Breaking Muscle: „sit straight down… hips underneath you”) → `kbfs.move`; `sq.mis.heels` — źródło mówi o odrywaniu palców, nie pięt → pominięte.
  - Sumo Squat (hantel): `sq.down` („cofając biodra”) — tylko Coach („sitting back”) → `hack.move`.

## 6. Dostęp

- ExRx.net — 403; web.archive.org — zablokowane dla narzędzia (wg uzupełnienia briefu nie próbowano dalej). NSCA (artykuł o przysiadzie Zerchera) — 403. Kettlebell Kings (producent) — 402.
- NASM: `/resource-center/exercise-library/bodyweight-squat` — 404; `/exercise-library/prisoner-squat` — strona bez treści.
- BarBend: `/air-squat/`, `/bodyweight-squat/`, `/zercher-squat/`, `/landmine-squat/`, `/sumo-squat/` — 404. Breaking Muscle `/dumbbell-squat/` — 404. Physitrack `how-to-perform-the-bodyweight-squat-exercise` — 404.

## Stan

- Zrobione: Box Squat, Bodyweight Squat, Smith Machine Squat, Zercher Squat, Landmine Squat, Sumo Squat (hantel), Double Kettlebell Front Squat, Overhead Squat, Barbell Hack Squat (gotowe); Dumbbell Squat (otwarte).
- Zostało: Cable Squat, One-Arm Overhead Kettlebell Squat, Dip Belt Squat.
- Następny krok: wyszukiwanie z `allowed_domains` (barbend.com, coachweb.com, breakingmuscle.com, physitrack.com, acefitness.org) — dla Dip Belt Squat sprawdzić też istniejące w `cues.json` źródło `exrx-Quadriceps/CBSquatBelt` i wpis „Przysiad z pasem” (inny sprzęt: pas na maszynie vs pas do dipów); dla One-Arm Overhead Kettlebell Squat — ACE #393 „Single Arm Overhead Squat” (https://www.acefitness.org/resources/everyone/exercise-library/393/single-arm-overhead-squat/, nieprzeczytane).
- Pułapki: wiele adresów BarBend zgadywanych z nazwy daje 404 — najpierw wyszukiwarka; Physitrack ma dwie formy stron (`/exercise-library/how-to-perform-…` i `xx.physitrack.com/home-exercise-video/…`) — to ta sama organizacja.
