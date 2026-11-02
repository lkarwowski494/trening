# Wskazówki techniki — rodzina `squat`, część 1

- Data: 02.11.2026
- Autor: badacz-merytoryczny
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda jak w `docs/research/33-wskazowki-partia2.md` („Metoda”): każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z różnych
organizacji o tym ćwiczeniu (albo jego wariancie — opis „(wariant: …)”); źródło o innym ćwiczeniu = analogia, nie liczy się.
Bez liczb (tempo, obciążenia, głębokość w stopniach) i bez uzasadnień zdrowotnych. Zdania z zestawu ogólnego, których przeczytane
źródła danego ćwiczenia nie potwierdzają, nie trafiają do karty (opis w „Otwarte → błędy zestawów ogólnych”).

**Korekta 02.11.2026 (rozstrzygnięcie koordynatora linii 1.1 o szczeblach):** Breaking Muscle = szczebel 5 (i nigdy niezależne od
BarBend); Gopher Sport (blog producenta i sprzedawcy sprzętu szkolnego, wpis bez autora z kwalifikacjami) oceniony jako 5 wg
kryterium (c) „blogi marketingowe”. Źródła tych organizacji nie liczą się do dwóch. Skutek: Box Squat, Zercher Squat, Landmine
Squat i Double Kettlebell Front Squat przeszły z „gotowe” do „otwarte” (dane częściowe w „Otwarte”); Barbell Hack Squat bez zmiany
wyniku (zostaje BarBend + Coach).

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Box Squat | otwarte (zmiana 02.11) | ustawienie i ruch mają po 2–3 źródła; wskazówki + błędy tylko 1 zdanie (`hinge.back`: Physitrack + Coach); `box.tight`, `box.mis.bounce` — tylko BarBend |
| Bodyweight Squat | gotowe | tylko istniejące zdania |
| Smith Machine Squat | gotowe | nowe `smith.setup`; ruch — istniejące `hack.move`; błąd `sq.mis.heels` — drugie źródło (Coach) mówi tylko „push through your heels” (zgodne, ale nie nazywa błędu) |
| Dumbbell Squat | gotowe (02.11, kontynuacja) | nowe `dbsq.setup` (BarBend + Physitrack + Coach); `sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn` |
| Zercher Squat | otwarte (zmiana 02.11) | zostaje BarBend, dodane ACE #5616; z 2 źródłami: `zer.hold`, `hack.move`, `gob.close` — brak drugiej wskazówki/błędu |
| Landmine Squat | otwarte (zmiana 02.11) | po odjęciu Breaking Muscle każde zdanie ma tylko Coach |
| Sumo Squat (hantel) | gotowe | nowe `sumo.setup`; ruch `hack.move` |
| Double Kettlebell Front Squat | otwarte (zmiana 02.11) | ustawienie (`kbfs.rack`) i ruch (`kbfs.move`) z BarBend + ACE; `hinge.back`, `kbfs.lockout` — tylko ACE |
| Overhead Squat | gotowe | nowe `ohs.setup`, `ohs.move`, `ohs.arms`; `sq.back` |
| Barbell Hack Squat | gotowe | nowe `bhs.setup`; `hack.move`, `hinge.back`, `sq.mis.heels`; korekta 02.11: bez `breakingmuscle-hack-squat`. **Zestaw `hingeFloor` nie pasuje** — patrz „Otwarte” |
| Cable Squat | otwarte | jedno źródło (Physitrack); inne przeczytane strony nie opisują przysiadu z linką |
| One-Arm Overhead Kettlebell Squat | otwarte | jedno źródło (ACE #393) — i to wariant ze stopą wysuniętą i skrętem tułowia |
| Dip Belt Squat | otwarte | jedno źródło (BarBend, ustawienie na dwóch skrzyniach) |

## 2. Wpisy do `cues.json` → `exercises`

```json
{
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
  "Dumbbell Squat": {
    "setup": [
      {"c": "dbsq.setup", "s": [["barbend-dumbbell-squat", "Setup (feet about shoulder-width apart, maybe a little wider; dumbbells one in each hand)"], ["physitrack-db-squat", "Instructions (feet shoulder-width apart, holding a dumbbell in each hand)"], ["coach-dumbbell-squat", "Dumbbell hold (a dumbbell in each hand)"]]}
    ],
    "move": [
      {"c": "sq.down", "s": [["barbend-dumbbell-squat", "Descent (unlock knees and hips; sit back into your heels); Ascent (push with your legs, stand tall)"], ["coach-dumbbell-squat", "Descent; Ascent"]]}
    ],
    "tips": [
      {"c": "sq.back", "s": [["barbend-dumbbell-squat", "Ascent (keeping a big chest); Mistakes: Body Posture"], ["physitrack-db-squat", "Instructions (back straight and upright, head up)"], ["coach-dumbbell-squat", "Keep your chest up"]]},
      {"c": "sq.kneesToes", "s": [["physitrack-db-squat", "Instructions (knees inline with your toes)"], ["coach-dumbbell-squat", "Knees (don't let them cave inwards)"], ["barbend-dumbbell-squat", "Descent (toes out; knees out)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [["coach-dumbbell-squat", "Knees (cave inwards)"], ["barbend-dumbbell-squat", "Descent (toes out; knees out)"]]}
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
      {"c": "hinge.back", "s": [["barbend-hack-squat", "Barbell Hack Squat — Back (spine neutral); Mistakes: Rounding"], ["coach-hack-squat", "Barbell Hack Squat — Back (shoulder blades to straighten your back)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["barbend-hack-squat", "Barbell Hack Squat — Mistakes: Heels lifting"], ["coach-hack-squat", "Barbell Hack Squat — Ascent (drive through midfoot and heels); Mistakes: pressing through the forefoot"]]}
    ]
  }
}
```

Uwaga: puste `mistakes` (Overhead Squat) — minimum (wskazówki + błędy ≥ 2) spełniają dwie wskazówki. Wpisy Dumbbell Squat dla
`coach-dumbbell-squat` — miejsca według notatek z przeczytania w poprzedniej sesji (sekcje „Dumbbell hold”, „Descent/Ascent”,
„Keep your chest up”, „cave inwards”); `barbend-dumbbell-squat` i `physitrack-db-squat` przeczytane 02.11 w tej sesji.

## 3. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `dbsq.setup` | Stopy mniej więcej na szerokość barków, w każdej ręce hantel. | Feet about shoulder-width apart, a dumbbell in each hand. | brak zdania o ustawieniu z dwoma hantlami; miejsce hantli (przy bokach / między nogami) celowo pominięte — źródła się różnią |
| `smith.setup` | Stań pod sztangą na prowadnicy i oprzyj ją na górze pleców; stopy trochę przed sztangą. | Stand under the bar on the track and rest it on your upper back; feet slightly in front of the bar. | stopy przed sztangą — inne niż `sq.bar` |
| `sumo.setup` | Stopy szeroko, palce na zewnątrz; hantel trzymaj oburącz w opuszczonych rękach między nogami. | Feet wide, toes turned out; hold the dumbbell with both hands, arms hanging between your legs. | ustawienie sumo |
| `ohs.setup` | Sztanga nad głową na wyprostowanych rękach, stopy na szerokość barków. | Bar overhead on straight arms, feet shoulder-width apart. | ustawienie tylko tego ćwiczenia |
| `ohs.move` | Zejdź w przysiad z uniesioną klatką i sztangą cały czas nad głową; wstań, wypychając podłogę stopami. | Squat down with your chest up and the bar overhead the whole time; stand up by pushing the floor away. | ruch z ciężarem nad głową |
| `ohs.arms` | Ręce przez cały ruch wyprostowane. | Keep your arms straight the whole time. | brak takiego zdania (istniejące `ohp.*` dotyczą wyciskania) |
| `bhs.setup` | Sztanga za nogami, chwyt nachwytem w opuszczonych rękach; stopy na szerokość barków. | Bar behind your legs, overhand grip with arms hanging down; feet shoulder-width apart. | ustawienie tylko tego ćwiczenia |

Zdania przygotowane dla ćwiczeń, które po korekcie 02.11 są otwarte (do użycia dopiero, gdy ćwiczenie się domknie; brzmienie bez zmian):

| id | PL | EN (propozycja) | Stan źródeł po korekcie |
|---|---|---|---|
| `box.setup` | Stań tuż przed skrzynią lub ławką, sztanga na górze pleców jak w zwykłym przysiadzie. | Stand just in front of the box or bench, bar on your upper back as in a regular squat. | BarBend + Physitrack + Coach — 2 źródła są |
| `box.move` | Cofnij biodra i usiądź na skrzyni pod kontrolą; po krótkiej pauzie wstań. | Push your hips back and sit onto the box under control; pause briefly, then stand up. | BarBend + Physitrack (+ Coach „glutes rest on the box”, bez cofania bioder) — 2 źródła są |
| `box.tight` | Na skrzyni zostań napięty — nie rozluźniaj się całkiem. | Stay tight on the box — don't relax completely. | tylko BarBend |
| `box.mis.bounce` | Odbijanie się od skrzyni. | Bouncing off the box. | tylko BarBend |
| `zer.hold` | Sztanga w zgięciach łokci, blisko tułowia; zdejmij ją ze stojaka. | Bar in the crooks of your elbows, close to your body; lift it out of the rack. | BarBend + ACE #5616 — 2 źródła są |
| `zer.move` | Zejdź w przysiad z tułowiem jak najbardziej pionowo; wstań, wypychając podłogę stopami. | Squat down with your torso as upright as you can; stand up by pushing the floor away. | tylko BarBend (ACE: „back straight”, nie „pionowo”) — zamiast niego `hack.move` |
| `zer.tense` | Przez cały ruch trzymaj napięte nogi, brzuch i ręce. | Keep your legs, abs and arms tight the whole time. | tylko BarBend |
| `lm.hold` | Trzymaj koniec sztangi oburącz przy klatce. | Hold the end of the bar with both hands at your chest. | tylko Coach |
| `kbfs.rack` | Dwa kettlebelle z przodu na barkach, oparte na przedramionach; nadgarstki proste. | Two kettlebells racked at the front of your shoulders, resting on your forearms; wrists straight. | BarBend + ACE — 2 źródła są |
| `kbfs.move` | Zejdź w przysiad, trzymając kettlebelle w tej samej pozycji; wstań, wypychając podłogę stopami. | Squat down keeping the kettlebells in the same position; stand up by pushing the floor away. | BarBend + ACE — 2 źródła są |
| `kbfs.lockout` | Na górze stań całkiem prosto, z wyprostowanymi biodrami. | At the top, stand all the way up with your hips straight. | tylko ACE |

## 4. Nowe źródła

| id | Adres | Organizacja | Szczebel | Miejsce / krótki cytat |
|---|---|---|---|---|
| `barbend-box-squat` | https://barbend.com/box-squat/ | BarBend | 4 | „Do not bounce up off the box or bench.” (Step 4) |
| `physitrack-box-squat` | https://www.physitrack.com/exercise-library/how-to-perform-the-box-squat-exercise | Physitrack | 4 | „Push your hips back behind you, as you try and sit down into the chair.” (Step 2) |
| `coach-box-squat` | https://www.coachweb.com/leg-exercises/6283/power-up-your-lower-limbs-with-the-box-squat | Coach | 4 | „Take extra care to keep your back straight and chest elevated.” (N. Harris-Fry, 13.09.2022) |
| `gopher-box-squat` | https://blog.gophersport.com/box-squats-for-developing-technique-and-power/ | Gopher Sport | **5** (korekta 02.11) — nie liczy się | Setup, Descent, Contact with the box, Mistakes |
| `coach-bodyweight-squat` | https://www.coachweb.com/exercises/leg-exercises/193/squat-tips-for-perfect-form | Coach | 4 | „Drive through the heels to stand up and complete the rep.” |
| `physitrack-bodyweight-squat` | https://na.physitrack.com/home-exercise-video/bodyweight-squat | Physitrack | 4 | opis ćwiczenia |
| `coach-smith-squat` | https://www.coachweb.com/exercises/leg-exercises/194/smith-squat | Coach | 4 | „Push through your heels to come back up to standing.” |
| `barbend-best-smith` | https://barbend.com/best-smith-machine-exercises/ | BarBend | 4 (zestawienie ćwiczeń z techniką, nie produktów) | „Don’t sit on your heels or pop up on your toes.” (Smith Machine Back Squat) |
| `physitrack-smith-squat-90` | https://us.physitrack.com/home-exercise-video/smith-machine-squat-to-90 | Physitrack | 4 | „Begin with Smith Machine bar on your upper back (avoid placing directly on the neck)” |
| `barbend-dumbbell-squat` | https://barbend.com/dumbbell-squat/ | BarBend | 4 | „Set your feet about shoulder-width apart, and maybe a little wider depending on your height.” (J. Morris, akt. 01.07.2024) |
| `physitrack-db-squat` | https://us.physitrack.com/home-exercise-video/dumbbell-squat | Physitrack | 4 | „Stand with your feet shoulder-width apart, holding a dumbbell in each hand.” |
| `coach-dumbbell-squat` | https://www.coachweb.com/exercises/dumbbell-exercises/dumbbell-squat | Coach | 4 | sekcje „Dumbbell hold”, „Descent/Ascent” |
| `breakingmuscle-zercher` | https://breakingmuscle.com/zercher-squat/ | Breaking Muscle | **5** (korekta 02.11) — nie liczy się | „Keep your torso as upright as possible throughout the movement.” |
| `barbend-zercher` | https://barbend.com/zercher-squat-ultimate-guide/ | BarBend | 4 | „Be sure to resist the load as it attempts to pull your torso forwards.” (M. Dewar, CSCS, akt. 27.11.2024) |
| `ace-expert-5616` | https://www.acefitness.org/resources/pros/expert-articles/5616/6-functional-strength-and-conditioning-exercises-you-re-not-using-with-your-clients/ | ACE | 4 | „Cross the wrists and pull the bar in close against the body.” (Zercher Squat, J. Smith, 24.08.2015) |
| `coach-landmine-squat` | https://www.coachweb.com/leg-exercises/4920/how-to-nail-the-landmine-squat | Coach | 4 | „Hold the loaded end in both hands” |
| `breakingmuscle-landmine` | https://breakingmuscle.com/best-landmine-exercises/ | Breaking Muscle | **5** (korekta 02.11) — nie liczy się | sekcja „Landmine Goblet Squat” |
| `ace-expert-5875` | https://www.acefitness.org/resources/pros/expert-articles/5875/5-variations-of-the-body-weight-squat/ | ACE | 4 | sekcja „Dumbbell Sumo Squat” |
| `coach-sumo-squat` | https://www.coachweb.com/bodyweight-exercises/7136/how-to-do-the-sumo-squat | Coach | 4 | „Keep your chest up and knees out.” |
| `physitrack-sumo-db-squat` | https://au.physitrack.com/home-exercise-video/sumo-dumbbell-squat | Physitrack | 4 | „Keep your knees inline with your toes and do not allow your heels to rise off the ground.” |
| `breakingmuscle-2kb-front-squat` | https://breakingmuscle.com/the-2-kettlebell-front-squat-the-best-exercise-youre-not-doing-2/ | Breaking Muscle | **5** (korekta 02.11) — nie liczy się | Rack position, Descent, Ascent, Common faults |
| `barbend-front-squat-variations` | https://barbend.com/front-squat-variations/ | BarBend | 4 | sekcja „Double Kettlebell Front Squat” |
| `ace-expert-5386` | https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/ | ACE | 4 | „Lock the hips out at the top.” (Double Kettlebell Front Squat) |
| `physitrack-ohs` | https://www.physitrack.com/exercise-library/how-to-perform-the-overhead-squat-exercise | Physitrack | 4 | „Squat down, keeping your chest up and your arms overhead the entire time.” (Step 2) |
| `physitrack-ohs-barbell` | https://us.physitrack.com/home-exercise-video/overhead-squat---with-barbell | Physitrack | 4 | opis ćwiczenia |
| `coach-ohs` | https://www.coachweb.com/exercises/leg-exercises/2725/variation-overhead-squat | Coach | 4 | „squat down as far as you can without letting your back arch” |
| `barbend-hack-squat` | https://barbend.com/hack-squat/ | BarBend | 4 | sekcja „Barbell Hack Squat”: „Keep your arms relaxed the whole time.” |
| `coach-hack-squat` | https://www.coachweb.com/fitness/leg-exercises/hack-squat | Coach | 4 | sekcja „Barbell Hack Squat” |
| `breakingmuscle-hack-squat` | https://breakingmuscle.com/hacking-the-hack-squat/ | Breaking Muscle | **5** (korekta 02.11) — nie liczy się | „The goal is to keep the spine neutral, engage the glutes, and refrain from rounded shoulders.” |
| `physitrack-cable-squat` | https://us.physitrack.com/home-exercise-video/squat-with-cable-resistance | Physitrack | 4 | „Do not allow your body to be pulled forward by the cable.” |
| `ace-393` | https://www.acefitness.org/resources/everyone/exercise-library/393/single-arm-overhead-squat/ | ACE | 4 | „Hold a kettlebell in the right hand with the right arm straight up overhead.” (Preparation) |
| `barbend-squat-variations` | https://barbend.com/squat-variations/ | BarBend | 4 | sekcja „Belt Squat”: wariant z pasem do dipów i dwiema skrzyniami (A. Polish, akt. 15.07.2025) |

Źródło już w `cues.json`: `ace-135`. Uwaga: dwa źródła Physitrack przy jednym ćwiczeniu (Overhead Squat) liczą się jako jedna organizacja — każde zdanie ma też Coach.
Do `cues.json` proponowane tylko źródła szczebla 4 użyte w gotowych wpisach albo w danych częściowych; źródeł szczebla 5 (Breaking Muscle,
Gopher Sport) nie dopisywać — organizacji Gopher Sport nie dodawać do `orgs`. **Do decyzji koordynatora:** w `cues.json` → `orgs`
„Breaking Muscle” ma dziś `level: 4` — po rozstrzygnięciu z 02.11 wymaga zmiany na 5 (poza zakresem badacza; sprawdzić, czy inne ćwiczenia
opierają się na nim jako drugim źródle).

```json
{
  "sources": {
    "barbend-box-squat": {"org": "BarBend", "title": "Box Squat", "url": "https://barbend.com/box-squat/", "level": 4},
    "physitrack-box-squat": {"org": "Physitrack", "title": "Box squat — step-by-step guide", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-box-squat-exercise", "level": 4},
    "coach-box-squat": {"org": "Coach", "title": "How To Do The Box Squat", "url": "https://www.coachweb.com/leg-exercises/6283/power-up-your-lower-limbs-with-the-box-squat", "level": 4},
    "coach-bodyweight-squat": {"org": "Coach", "title": "How To Squat", "url": "https://www.coachweb.com/exercises/leg-exercises/193/squat-tips-for-perfect-form", "level": 4},
    "physitrack-bodyweight-squat": {"org": "Physitrack", "title": "Bodyweight squat (exercise video)", "url": "https://na.physitrack.com/home-exercise-video/bodyweight-squat", "level": 4},
    "coach-smith-squat": {"org": "Coach", "title": "How To Do The Smith Machine Squat", "url": "https://www.coachweb.com/exercises/leg-exercises/194/smith-squat", "level": 4},
    "barbend-best-smith": {"org": "BarBend", "title": "The 15 Best Smith Machine Exercises", "url": "https://barbend.com/best-smith-machine-exercises/", "level": 4},
    "physitrack-smith-squat-90": {"org": "Physitrack", "title": "Smith Machine Squat to 90 (exercise video)", "url": "https://us.physitrack.com/home-exercise-video/smith-machine-squat-to-90", "level": 4},
    "barbend-dumbbell-squat": {"org": "BarBend", "title": "How to Do the Dumbbell Squat", "url": "https://barbend.com/dumbbell-squat/", "level": 4},
    "physitrack-db-squat": {"org": "Physitrack", "title": "Dumbbell squat (exercise video)", "url": "https://us.physitrack.com/home-exercise-video/dumbbell-squat", "level": 4},
    "coach-dumbbell-squat": {"org": "Coach", "title": "How To Do The Dumbbell Squat", "url": "https://www.coachweb.com/exercises/dumbbell-exercises/dumbbell-squat", "level": 4},
    "barbend-zercher": {"org": "BarBend", "title": "The Zercher Squat (ultimate guide)", "url": "https://barbend.com/zercher-squat-ultimate-guide/", "level": 4},
    "ace-expert-5616": {"org": "ACE", "title": "6 Functional Strength and Conditioning Exercises (expert article #5616) — Zercher Squat", "url": "https://www.acefitness.org/resources/pros/expert-articles/5616/6-functional-strength-and-conditioning-exercises-you-re-not-using-with-your-clients/", "level": 4},
    "coach-landmine-squat": {"org": "Coach", "title": "How To Nail The Landmine Squat", "url": "https://www.coachweb.com/leg-exercises/4920/how-to-nail-the-landmine-squat", "level": 4},
    "ace-expert-5875": {"org": "ACE", "title": "5 Variations of the Body-weight Squat (expert article #5875)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5875/5-variations-of-the-body-weight-squat/", "level": 4},
    "coach-sumo-squat": {"org": "Coach", "title": "How To Do The Sumo Squat", "url": "https://www.coachweb.com/bodyweight-exercises/7136/how-to-do-the-sumo-squat", "level": 4},
    "physitrack-sumo-db-squat": {"org": "Physitrack", "title": "Sumo dumbbell squat (exercise video)", "url": "https://au.physitrack.com/home-exercise-video/sumo-dumbbell-squat", "level": 4},
    "barbend-front-squat-variations": {"org": "BarBend", "title": "Front Squat Variations", "url": "https://barbend.com/front-squat-variations/", "level": 4},
    "ace-expert-5386": {"org": "ACE", "title": "Advanced Kettlebell Workout (expert article #5386)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/", "level": 4},
    "physitrack-ohs": {"org": "Physitrack", "title": "Overhead squat — step-by-step guide", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-overhead-squat-exercise", "level": 4},
    "physitrack-ohs-barbell": {"org": "Physitrack", "title": "Overhead squat — with barbell (exercise video)", "url": "https://us.physitrack.com/home-exercise-video/overhead-squat---with-barbell", "level": 4},
    "coach-ohs": {"org": "Coach", "title": "The Overhead Squat", "url": "https://www.coachweb.com/exercises/leg-exercises/2725/variation-overhead-squat", "level": 4},
    "barbend-hack-squat": {"org": "BarBend", "title": "How to Do the Hack Squat (Barbell Hack Squat section)", "url": "https://barbend.com/hack-squat/", "level": 4},
    "coach-hack-squat": {"org": "Coach", "title": "How To Do The Hack Squat (barbell and machine)", "url": "https://www.coachweb.com/fitness/leg-exercises/hack-squat", "level": 4},
    "physitrack-cable-squat": {"org": "Physitrack", "title": "Squat with Cable Resistance (exercise video)", "url": "https://us.physitrack.com/home-exercise-video/squat-with-cable-resistance", "level": 4},
    "ace-393": {"org": "ACE", "title": "Single Arm Overhead Squat", "url": "https://www.acefitness.org/resources/everyone/exercise-library/393/single-arm-overhead-squat/", "level": 4},
    "barbend-squat-variations": {"org": "BarBend", "title": "10 Unique Squat Variations (Belt Squat section)", "url": "https://barbend.com/squat-variations/", "level": 4}
  }
}
```

## 5. Otwarte

### Ćwiczenia otwarte po korekcie szczebli (02.11) — dane częściowe

Zdania niżej mają ≥ 2 źródła szczebla 4 i mogą wejść, gdy ćwiczenie dostanie brakujące zdanie (minimum: wskazówki + błędy ≥ 2).

```json
{
  "Box Squat": {
    "setup": [{"c": "box.setup", "s": [["barbend-box-squat", "Step 1–2 (box a few feet back; set up as for back squats)"], ["physitrack-box-squat", "FAQ: correct form (start in front of the box)"], ["coach-box-squat", "How-to (box or bench; bar on your upper traps, not your neck)"]]}],
    "move": [{"c": "box.move", "s": [["barbend-box-squat", "Step 3–4 (hips back, squat until butt is on the box, pause, stand up)"], ["physitrack-box-squat", "Step 2–3 (push hips back, sit down into the chair; stand up)"]]}],
    "tips": [{"c": "hinge.back", "s": [["physitrack-box-squat", "Step 2 (keeping your back straight)"], ["coach-box-squat", "How-to (keep your back straight)"]]}],
    "mistakes": []
  },
  "Zercher Squat": {
    "setup": [{"c": "zer.hold", "s": [["barbend-zercher", "Bar position (crooks of the elbows, 'scooping' it out of the rack)"], ["ace-expert-5616", "Zercher Squat, steps 1–2 (forearms under the bar; pull it close against the body; lift from the rack)"]]}],
    "move": [{"c": "hack.move", "s": [["barbend-zercher", "Descent; Ascent"], ["ace-expert-5616", "Zercher Squat, steps 3–4 (squat down; extend knees and hips until legs are straight)"]]}],
    "tips": [{"c": "gob.close", "s": [["barbend-zercher", "Torso (resist the load as it attempts to pull your torso forwards)"], ["ace-expert-5616", "Zercher Squat, step 3 (the hands close to body)"]]}],
    "mistakes": []
  },
  "Double Kettlebell Front Squat": {
    "setup": [{"c": "kbfs.rack", "s": [["barbend-front-squat-variations", "Double Kettlebell Front Squat (front-rack position; keep your wrists neutral)"], ["ace-expert-5386", "Double Kettlebell Front Squat (kettlebells in the rack position)"]]}],
    "move": [{"c": "kbfs.move", "s": [["ace-expert-5386", "Double Kettlebell Front Squat (pull yourself down; drive through the floor to stand)"], ["barbend-front-squat-variations", "Double Kettlebell Front Squat (any loss of position and you'll lose the kettlebells)"]]}],
    "tips": [],
    "mistakes": []
  }
}
```

- **Box Squat** — brak drugiego zdania wskazówki/błędu. `box.tight` i `box.mis.bounce` ma tylko BarBend (Coach i Physitrack nie piszą o napięciu na skrzyni ani o odbijaniu). Physitrack (Step 3) „knees travel forwards over your toes” — `sq.kneesToes` ma jedno źródło. Rozstrzygnie: drugie źródło szczebla 4 (np. ACE, NASM, ISSA) z błędem „odbijanie od skrzyni” albo „rozluźnienie na skrzyni”. Uwaga: Physitrack (Step 2) każe pochylić klatkę do przodu — stąd `hinge.back`, a nie `sq.back` („klatka uniesiona”).
- **Zercher Squat** — brak drugiej wskazówki/błędu. `sq.back` złożone z dwóch źródeł po połowie (ACE „back straight”, BarBend „pull your chest up”, „torso upright”) — każda część tylko w jednym; `zer.tense` tylko BarBend; ACE „knees pointed straight ahead” — jedno źródło. Rozstrzygnie: drugie źródło szczebla 4 o Zercherze z napięciem tułowia albo plecami prostymi i klatką uniesioną.
- **Landmine Squat** — po odjęciu Breaking Muscle każde zdanie (`lm.hold`, `gob.move`, `gob.close`, `sq.mis.heels`) ma tylko Coach. Rozstrzygnie: drugie źródło szczebla 4 o przysiadzie z końcem sztangi przy klatce.
- **Double Kettlebell Front Squat** — `hinge.back`, `kbfs.lockout` tylko ACE (#5386). Rozstrzygnie: drugie źródło szczebla 4 (np. producent kettlebelli o własnym sprzęcie, organizacja szkoląca z kettlebelli) o neutralnych plecach i wyproście bioder na górze.
- **Cable Squat** — przeczytane jedno źródło o tym ćwiczeniu: Physitrack („Hold on to a cable machine with both hands”; ruch: krok w tył, przysiad z ugięciem bioder i kolan; błąd: dać się pociągnąć lince do przodu). Kandydaci do zdań: `hack.move` i nowe `csq.mis.pulled` („Linka ciągnie cię do przodu.”). BarBend `/cable-leg-workouts/` i `/best-quad-exercises/` — brak przysiadu z linką (tylko przysiad goblet z liną bez opisu ruchu i przysiad wykroczny); Coach `/exercises/8648/cable-machine-exercises` — brak. Strona z opisem przysiadu z liną przy klatce (serwis recenzji sprzętu) — szczebel otwarty wg rozstrzygnięcia, nie liczy się, i zwraca 404. Rozstrzygnie: drugie źródło szczebla 4 o przysiadzie z dolnym wyciągiem.
- **One-Arm Overhead Kettlebell Squat** — jedyne przeczytane źródło (ACE #393) opisuje wariant: stopa prawa przed lewą (pięta na wysokości palców), wzrok na kettlebellu, wolna ręka sięga do podłogi ze skrętem tułowia. To inny ruch niż zwykły przysiad z ciężarem nad głową — **zestaw ogólny (`sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`) nie ma potwierdzenia** w żadnym przeczytanym źródle tego ćwiczenia. BarBend `/unusual-kettlebell-exercises/` opisuje tylko jednorącz „thruster” (wyciskanie przy wstawaniu — inne ćwiczenie). Rozstrzygnie: dwa źródła szczebla 4 o przysiadzie z jednym kettlebellem trzymanym nad głową przez cały ruch, i decyzja koordynatora, który wariant katalog oznacza.
- **Dip Belt Squat** — jedno źródło: BarBend `/squat-variations/` („Belt Squat”: pas do dipów, dwie stabilne skrzynie, stopy na skrzyniach w zwykłym rozstawie, ciężar zwisa w szczelinie pod tułowiem). Strony serwisu wydawanego przez producenta suplementów (artykuły i forum o przysiadzie z pasem) — kryterium (c), nie liczone. Istniejące w `cues.json` `exrx-Quadriceps/CBSquatBelt` dotyczy pasa na wyciągu (inny sprzęt) — analogia, nie liczy się. Kandydat do zdania: `dbelt.setup` („Stań na dwóch stabilnych skrzyniach, ciężar na pasie zwisa między nimi.”). Rozstrzygnie: drugie źródło szczebla 4 o przysiadzie z pasem do dipów na podwyższeniach.
- **Dumbbell Squat — miejsce hantli:** Coach (przy bokach) i Physitrack („allow your arms towards the floor between your legs”) różnią się — dlatego `dbsq.setup` nie mówi, gdzie trzymać hantle. `sq.mis.heels` — tylko Physitrack wprost (BarBend „sit back into your heels” nie nazywa błędu) → pominięte.
- **Barbell Hack Squat — zestaw `hingeFloor` nie pasuje.** Oba źródła opisują przysiad (kolana idą w przód, tułów pionowo; Coach: biodra nie powinny cofać się, sztanga idzie pionowo w dół), nie zawias z podłogi; Coach zaczyna ze stojaka, nie z podłogi. Obecny zestaw ogólny (`hinge.back`, `sq.kneesToes`, `mis.roundBack`): `sq.kneesToes` — żadne przeczytane źródło tego ćwiczenia; `mis.roundBack` („…żeby dociągnąć ciężar”) — BarBend opisuje zaokrąglenie przy opuszczaniu, nie przy dociąganiu → pominięte. Rekomendacja dla koordynatora: rodzina figury/zestawu bliżej `squat` niż `hingeFloor`; decyzja o figurze i wpis recenzji w `docs/research/figury-recenzja.json` (klucz „Barbell Hack Squat”, dziś `rodzina: hingeFloor`, werdykt „wyswietlana”) — poza zakresem badacza, do bramki 4.
- **Błędy zestawów ogólnych (informacja dla koordynatora):**
  - Box Squat: `sq.kneesToes`, `sq.mis.kneesIn`, `sq.mis.heels` — źródła wariantu nie opisują ich wprost (Physitrack: kolana nad palcami — jedno źródło); `sq.back` → `hinge.back` (Physitrack: klatka pochylona do przodu).
  - Smith Machine Squat: `sq.down` („cofając biodra”) — źródła Smitha mówią tylko „bending at the hips and knees” (stopy przed sztangą) → `hack.move`; `sq.kneesToes`, `sq.mis.kneesIn` — brak w źródłach.
  - Bodyweight Squat: `sq.stance` (barki lub szerzej) — ACE „slightly wider than hip-width”, Coach „hip-width” → `gob.stance`.
  - Double Kettlebell Front Squat: `sq.down` („cofając biodra”) przeczy opisowi z Breaking Muscle („sit straight down”, szczebel 5 — tylko informacja) → `kbfs.move`; `sq.mis.heels` — brak źródła o piętach.
  - Sumo Squat (hantel): `sq.down` („cofając biodra”) — tylko Coach („sitting back”) → `hack.move`.
  - Dumbbell Squat: `sq.mis.heels` — jedno źródło (Physitrack).
  - One-Arm Overhead Kettlebell Squat: cały zestaw bez potwierdzenia (patrz wyżej).
  - Cable Squat, Dip Belt Squat: zestaw ogólny `sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`, `sq.mis.heels` — żadne przeczytane źródło tych ćwiczeń nie potwierdza ich (Physitrack Cable Squat: tylko ugięcie bioder i kolan oraz błąd pociągnięcia przez linkę).

## 6. Dostęp

- ExRx.net — 403; web.archive.org — zablokowane dla narzędzia (wg uzupełnienia briefu nie próbowano dalej). NSCA (artykuł o przysiadzie Zerchera) — 403. Kettlebell Kings (producent) — 402.
- NASM: `/resource-center/exercise-library/bodyweight-squat` — 404; `/exercise-library/prisoner-squat` — strona bez treści.
- BarBend: `/air-squat/`, `/bodyweight-squat/`, `/zercher-squat/`, `/landmine-squat/`, `/sumo-squat/` — 404. Breaking Muscle `/dumbbell-squat/` — 404. Physitrack `how-to-perform-the-bodyweight-squat-exercise` — 404.
- 02.11 (kontynuacja): strona przeglądu sprzętu o przysiadach z linką — 404; Coach `/workouts/kettlebell-workouts/…one-kettlebell…` — przekierowanie do innego serwisu, treść niedostępna; Coach `/kettlebell-exercises` — treść ucięta przed wpisami średniozaawansowanymi.

## Stan

- Zrobione (wskazówki, rodzina `squat` cz. 1): wszystkie 13 ćwiczeń zbadane. Gotowe: Bodyweight Squat, Smith Machine Squat, Dumbbell Squat, Sumo Squat (hantel), Overhead Squat, Barbell Hack Squat. Otwarte: Box Squat, Zercher Squat, Landmine Squat, Double Kettlebell Front Squat (po korekcie szczebli 02.11 — brakuje po jednym zdaniu albo drugiego źródła), Cable Squat, One-Arm Overhead Kettlebell Squat, Dip Belt Squat (po jednym źródle).
- Zostało (opcjonalnie, dla domknięcia otwartych): drugie źródło szczebla 4 dla Box Squat (błąd „odbijanie”), Zercher (napięcie / plecy), Landmine, Double Kettlebell Front Squat (wyprost bioder), Cable Squat, One-Arm Overhead Kettlebell Squat, Dip Belt Squat.
- Następny krok: wyszukiwanie w ISSA (`issaonline.com`, treść z autorem i datą), NASM, Catalyst Athletics (Zercher, Overhead), The Prehab Guys; dla kettlebelli — strony producentów o własnym sprzęcie.
- Pułapki: Breaking Muscle i Gopher Sport — szczebel 5, nie liczyć; strony przeglądów sprzętu (szczebel otwarty) i serwis wydawany przez producenta suplementów — nie liczyć; wiele adresów BarBend zgadywanych z nazwy daje 404 — najpierw wyszukiwarka; Physitrack ma dwie formy stron — ta sama organizacja.
