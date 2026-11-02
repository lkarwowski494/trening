# Wskazówki techniki — rodzina `squat`, część 1

- Data: 02.11.2026
- Autor: badacz-merytoryczny
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Korekta szczebli 2 (02.11.2026)

Podstawa: „ROZSTRZYGNIĘCIE 2” koordynatora linii 1.1 (02.11.2026 ~07:55). Nowych źródeł nie szukano; autorów stron Coach sprawdzono
WebFetch 02.11.2026.

| Źródło / organizacja | Było | Jest | Uzasadnienie |
|---|---|---|---|
| Physitrack (wszystkie strony w pliku) | 4 | **5** | rozstrzygnięcie 2: Physitrack → 5 |
| Coach `coach-hack-squat` | 4 | 4 | autor Sam Rider — trener personalny REPS poziom 3 (biogram na stronie), 11.01.2024; technikę komentuje trener z wykształceniem z nauk o ruchu |
| Coach `coach-bodyweight-squat` | 4 | **5** | autor N. Harris-Fry (dziennikarz, bez kwalifikacji trenerskich) i J. Warner (były redaktor), 11.05.2020; cytowany trener bez podanych kwalifikacji — nie jest autorem |
| Coach `coach-smith-squat`, `coach-dumbbell-squat`, `coach-sumo-squat`, `coach-box-squat` | 4 | **5** | autor N. Harris-Fry — dziennikarz, bez kwalifikacji trenerskich (2022) |
| Coach `coach-ohs` | 4 | **5** | autor J. Warner — były redaktor magazynu, bez kwalifikacji trenerskich (04.03.2019) |
| Coach `coach-landmine-squat` | 4 | **5** | autor J. Snape — dziennikarz, zawodnik strongman, bez kwalifikacji trenerskich (05.12.2017) |
| Uczelniane centra sportu, szpitale, NSCA, The Prehab Guys, Torokhtiy, Freelap | — | — | w tym pliku nie występują |

Przeliczenie zdań (≥ 2 niezależne źródła szczebla ≥ 4):
- **Bodyweight Squat: gotowe → otwarte.** Każde zdanie zostaje z samym ACE #135 (`gob.stance`, `sq.down`, `sq.kneesToes`, `sq.mis.kneesIn`: ACE + Coach 5; `sq.back`, `sq.mis.heels`: ACE + Physitrack 5).
- **Smith Machine Squat: gotowe → otwarte.** `smith.setup`, `sq.back`, `sq.mis.heels` — zostaje tylko BarBend; `hack.move` — 0 źródeł szczebla 4.
- **Dumbbell Squat: gotowe → otwarte.** Każde zdanie zostaje z samym BarBend.
- **Sumo Squat (hantel): gotowe → otwarte.** `sumo.setup`, `hack.move` — tylko ACE #5875; `sq.kneesToes`, `sq.back`, `sq.mis.heels` — 0 źródeł szczebla 4.
- **Overhead Squat: gotowe → otwarte.** Wszystkie zdania opierały się na Physitrack + Coach (J. Warner) → 0 źródeł szczebla 4.
- **Barbell Hack Squat — gotowe bez zmian** (BarBend + Coach S. Rider; oba 4). `sq.mis.heels`: oba źródła nazywają błąd wprost (BarBend „Heels lifting”, Coach „pressing through the forefoot”) — reguła „zaprzeczenia standardu” nie jest potrzebna.
- Otwarte wcześniej: Box Squat traci też `box.setup`, `box.move`, `hinge.back` (zostaje sam BarBend) — dane częściowe bez zdań z 2 źródłami; Landmine Squat — 0 źródeł szczebla 4; Zercher Squat i Double Kettlebell Front Squat — bez zmian (BarBend + ACE).
- Żadne ćwiczenie otwarte nie domyka się dzięki nowym regułom. Reguła błędów: w gotowym wpisie nie ma błędu opartego na samym standardzie.
- Wpisy zdań usunięte z bloku JSON: 24 (Bodyweight Squat 6, Smith Machine Squat 4, Dumbbell Squat 5, Sumo Squat 5, Overhead Squat 4 — licząc każde wystąpienie id osobno); usunięte także z danych częściowych: 3 (Box Squat).
- Gotowe w pliku: przed 6 → po **1** (Barbell Hack Squat).

Metoda jak w `docs/research/33-wskazowki-partia2.md` („Metoda”): każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z różnych
organizacji o tym ćwiczeniu (albo jego wariancie — opis „(wariant: …)”); źródło o innym ćwiczeniu = analogia, nie liczy się.
Bez liczb (tempo, obciążenia, głębokość w stopniach) i bez uzasadnień zdrowotnych. Zdania z zestawu ogólnego, których przeczytane
źródła danego ćwiczenia nie potwierdzają, nie trafiają do karty (opis w „Otwarte → błędy zestawów ogólnych”).

**Korekta 02.11.2026 (rozstrzygnięcie 1 koordynatora linii 1.1 o szczeblach):** Breaking Muscle = szczebel 5 (i nigdy niezależne od
BarBend); Gopher Sport (blog producenta i sprzedawcy sprzętu szkolnego, wpis bez autora z kwalifikacjami) oceniony jako 5 wg
kryterium (c) „blogi marketingowe”. Źródła tych organizacji nie liczą się do dwóch. Skutek: Box Squat, Zercher Squat, Landmine
Squat i Double Kettlebell Front Squat przeszły z „gotowe” do „otwarte”; Barbell Hack Squat bez zmiany wyniku (BarBend + Coach).

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Box Squat | otwarte (korekta 1) | po korekcie 2 każde zdanie ma tylko BarBend (Physitrack, Coach — 5) |
| Bodyweight Squat | **otwarte (korekta 2)** | tylko ACE #135 (Coach N. Harris-Fry, Physitrack — 5) |
| Smith Machine Squat | **otwarte (korekta 2)** | tylko BarBend (Coach N. Harris-Fry, Physitrack — 5) |
| Dumbbell Squat | **otwarte (korekta 2)** | tylko BarBend (Coach N. Harris-Fry, Physitrack — 5) |
| Zercher Squat | otwarte (korekta 1) | BarBend + ACE #5616: `zer.hold`, `hack.move`, `gob.close` — brak drugiej wskazówki/błędu |
| Landmine Squat | otwarte (korekta 1) | po korekcie 2 — 0 źródeł szczebla 4 (Coach J. Snape — 5) |
| Sumo Squat (hantel) | **otwarte (korekta 2)** | tylko ACE #5875 (Coach, Physitrack — 5) |
| Double Kettlebell Front Squat | otwarte (korekta 1) | ustawienie (`kbfs.rack`) i ruch (`kbfs.move`) z BarBend + ACE; `hinge.back`, `kbfs.lockout` — tylko ACE |
| Overhead Squat | **otwarte (korekta 2)** | 0 źródeł szczebla 4 (Physitrack, Coach J. Warner — 5) |
| Barbell Hack Squat | **gotowe** (bez zmian) | `bhs.setup`, `hack.move`, `hinge.back`, `sq.mis.heels` — BarBend + Coach (S. Rider, REPS L3). **Zestaw `hingeFloor` nie pasuje** — patrz „Otwarte” |
| Cable Squat | otwarte | jedyne źródło (Physitrack) — po korekcie 2 szczebel 5 |
| One-Arm Overhead Kettlebell Squat | otwarte | jedno źródło (ACE #393) — i to wariant ze stopą wysuniętą i skrętem tułowia |
| Dip Belt Squat | otwarte | jedno źródło (BarBend, ustawienie na dwóch skrzyniach) |

## 2. Wpisy do `cues.json` → `exercises`

```json
{
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

## 3. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `bhs.setup` | Sztanga za nogami, chwyt nachwytem w opuszczonych rękach; stopy na szerokość barków. | Bar behind your legs, overhand grip with arms hanging down; feet shoulder-width apart. | ustawienie tylko tego ćwiczenia |

Zdania przygotowane dla ćwiczeń otwartych (do użycia dopiero, gdy ćwiczenie się domknie; brzmienie bez zmian):

| id | PL | EN (propozycja) | Stan źródeł po korekcie 2 |
|---|---|---|---|
| `dbsq.setup` | Stopy mniej więcej na szerokość barków, w każdej ręce hantel. | Feet about shoulder-width apart, a dumbbell in each hand. | tylko BarBend (Physitrack, Coach — 5); miejsce hantli celowo pominięte — źródła się różnią |
| `smith.setup` | Stań pod sztangą na prowadnicy i oprzyj ją na górze pleców; stopy trochę przed sztangą. | Stand under the bar on the track and rest it on your upper back; feet slightly in front of the bar. | tylko BarBend |
| `sumo.setup` | Stopy szeroko, palce na zewnątrz; hantel trzymaj oburącz w opuszczonych rękach między nogami. | Feet wide, toes turned out; hold the dumbbell with both hands, arms hanging between your legs. | tylko ACE #5875 |
| `ohs.setup` | Sztanga nad głową na wyprostowanych rękach, stopy na szerokość barków. | Bar overhead on straight arms, feet shoulder-width apart. | 0 źródeł szczebla 4 |
| `ohs.move` | Zejdź w przysiad z uniesioną klatką i sztangą cały czas nad głową; wstań, wypychając podłogę stopami. | Squat down with your chest up and the bar overhead the whole time; stand up by pushing the floor away. | 0 źródeł szczebla 4 |
| `ohs.arms` | Ręce przez cały ruch wyprostowane. | Keep your arms straight the whole time. | 0 źródeł szczebla 4 |
| `box.setup` | Stań tuż przed skrzynią lub ławką, sztanga na górze pleców jak w zwykłym przysiadzie. | Stand just in front of the box or bench, bar on your upper back as in a regular squat. | tylko BarBend (korekta 2) |
| `box.move` | Cofnij biodra i usiądź na skrzyni pod kontrolą; po krótkiej pauzie wstań. | Push your hips back and sit onto the box under control; pause briefly, then stand up. | tylko BarBend (korekta 2) |
| `box.tight` | Na skrzyni zostań napięty — nie rozluźniaj się całkiem. | Stay tight on the box — don't relax completely. | tylko BarBend |
| `box.mis.bounce` | Odbijanie się od skrzyni. | Bouncing off the box. | tylko BarBend |
| `zer.hold` | Sztanga w zgięciach łokci, blisko tułowia; zdejmij ją ze stojaka. | Bar in the crooks of your elbows, close to your body; lift it out of the rack. | BarBend + ACE #5616 — 2 źródła są |
| `zer.move` | Zejdź w przysiad z tułowiem jak najbardziej pionowo; wstań, wypychając podłogę stopami. | Squat down with your torso as upright as you can; stand up by pushing the floor away. | tylko BarBend (ACE: „back straight”, nie „pionowo”) — zamiast niego `hack.move` |
| `zer.tense` | Przez cały ruch trzymaj napięte nogi, brzuch i ręce. | Keep your legs, abs and arms tight the whole time. | tylko BarBend |
| `lm.hold` | Trzymaj koniec sztangi oburącz przy klatce. | Hold the end of the bar with both hands at your chest. | 0 źródeł szczebla 4 (Coach — 5) |
| `kbfs.rack` | Dwa kettlebelle z przodu na barkach, oparte na przedramionach; nadgarstki proste. | Two kettlebells racked at the front of your shoulders, resting on your forearms; wrists straight. | BarBend + ACE — 2 źródła są |
| `kbfs.move` | Zejdź w przysiad, trzymając kettlebelle w tej samej pozycji; wstań, wypychając podłogę stopami. | Squat down keeping the kettlebells in the same position; stand up by pushing the floor away. | BarBend + ACE — 2 źródła są |
| `kbfs.lockout` | Na górze stań całkiem prosto, z wyprostowanymi biodrami. | At the top, stand all the way up with your hips straight. | tylko ACE |

## 4. Nowe źródła

| id | Adres | Organizacja | Szczebel | Miejsce / krótki cytat |
|---|---|---|---|---|
| `barbend-box-squat` | https://barbend.com/box-squat/ | BarBend | 4 | „Do not bounce up off the box or bench.” (Step 4) |
| `physitrack-box-squat` | https://www.physitrack.com/exercise-library/how-to-perform-the-box-squat-exercise | Physitrack | **5** (korekta 2) | „Push your hips back behind you, as you try and sit down into the chair.” (Step 2) |
| `coach-box-squat` | https://www.coachweb.com/leg-exercises/6283/power-up-your-lower-limbs-with-the-box-squat | Coach | **5** (korekta 2: autor bez kwalifikacji) | „Take extra care to keep your back straight and chest elevated.” (N. Harris-Fry, 13.09.2022) |
| `gopher-box-squat` | https://blog.gophersport.com/box-squats-for-developing-technique-and-power/ | Gopher Sport | 5 (korekta 1) | Setup, Descent, Contact with the box, Mistakes |
| `coach-bodyweight-squat` | https://www.coachweb.com/exercises/leg-exercises/193/squat-tips-for-perfect-form | Coach | **5** (korekta 2) | „Drive through the heels to stand up and complete the rep.” (N. Harris-Fry, J. Warner, 11.05.2020) |
| `physitrack-bodyweight-squat` | https://na.physitrack.com/home-exercise-video/bodyweight-squat | Physitrack | **5** (korekta 2) | opis ćwiczenia |
| `coach-smith-squat` | https://www.coachweb.com/exercises/leg-exercises/194/smith-squat | Coach | **5** (korekta 2) | „Push through your heels to come back up to standing.” (N. Harris-Fry, 21.04.2022) |
| `barbend-best-smith` | https://barbend.com/best-smith-machine-exercises/ | BarBend | 4 (zestawienie ćwiczeń z techniką, nie produktów) | „Don’t sit on your heels or pop up on your toes.” (Smith Machine Back Squat) |
| `physitrack-smith-squat-90` | https://us.physitrack.com/home-exercise-video/smith-machine-squat-to-90 | Physitrack | **5** (korekta 2) | „Begin with Smith Machine bar on your upper back (avoid placing directly on the neck)” |
| `barbend-dumbbell-squat` | https://barbend.com/dumbbell-squat/ | BarBend | 4 | „Set your feet about shoulder-width apart, and maybe a little wider depending on your height.” (J. Morris, akt. 01.07.2024) |
| `physitrack-db-squat` | https://us.physitrack.com/home-exercise-video/dumbbell-squat | Physitrack | **5** (korekta 2) | „Stand with your feet shoulder-width apart, holding a dumbbell in each hand.” |
| `coach-dumbbell-squat` | https://www.coachweb.com/exercises/dumbbell-exercises/dumbbell-squat | Coach | **5** (korekta 2) | sekcje „Dumbbell hold”, „Descent/Ascent” (N. Harris-Fry, 29.03.2022) |
| `breakingmuscle-zercher` | https://breakingmuscle.com/zercher-squat/ | Breaking Muscle | 5 (korekta 1) | „Keep your torso as upright as possible throughout the movement.” |
| `barbend-zercher` | https://barbend.com/zercher-squat-ultimate-guide/ | BarBend | 4 | „Be sure to resist the load as it attempts to pull your torso forwards.” (M. Dewar, CSCS, akt. 27.11.2024) |
| `ace-expert-5616` | https://www.acefitness.org/resources/pros/expert-articles/5616/6-functional-strength-and-conditioning-exercises-you-re-not-using-with-your-clients/ | ACE | 4 | „Cross the wrists and pull the bar in close against the body.” (Zercher Squat, J. Smith, 24.08.2015) |
| `coach-landmine-squat` | https://www.coachweb.com/leg-exercises/4920/how-to-nail-the-landmine-squat | Coach | **5** (korekta 2) | „Hold the loaded end in both hands” (J. Snape, 05.12.2017) |
| `breakingmuscle-landmine` | https://breakingmuscle.com/best-landmine-exercises/ | Breaking Muscle | 5 (korekta 1) | sekcja „Landmine Goblet Squat” |
| `ace-expert-5875` | https://www.acefitness.org/resources/pros/expert-articles/5875/5-variations-of-the-body-weight-squat/ | ACE | 4 | sekcja „Dumbbell Sumo Squat” |
| `coach-sumo-squat` | https://www.coachweb.com/bodyweight-exercises/7136/how-to-do-the-sumo-squat | Coach | **5** (korekta 2) | „Keep your chest up and knees out.” (N. Harris-Fry, akt. 19.08.2022) |
| `physitrack-sumo-db-squat` | https://au.physitrack.com/home-exercise-video/sumo-dumbbell-squat | Physitrack | **5** (korekta 2) | „Keep your knees inline with your toes and do not allow your heels to rise off the ground.” |
| `breakingmuscle-2kb-front-squat` | https://breakingmuscle.com/the-2-kettlebell-front-squat-the-best-exercise-youre-not-doing-2/ | Breaking Muscle | 5 (korekta 1) | Rack position, Descent, Ascent, Common faults |
| `barbend-front-squat-variations` | https://barbend.com/front-squat-variations/ | BarBend | 4 | sekcja „Double Kettlebell Front Squat” |
| `ace-expert-5386` | https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/ | ACE | 4 | „Lock the hips out at the top.” (Double Kettlebell Front Squat) |
| `physitrack-ohs` | https://www.physitrack.com/exercise-library/how-to-perform-the-overhead-squat-exercise | Physitrack | **5** (korekta 2) | „Squat down, keeping your chest up and your arms overhead the entire time.” (Step 2) |
| `physitrack-ohs-barbell` | https://us.physitrack.com/home-exercise-video/overhead-squat---with-barbell | Physitrack | **5** (korekta 2) | opis ćwiczenia |
| `coach-ohs` | https://www.coachweb.com/exercises/leg-exercises/2725/variation-overhead-squat | Coach | **5** (korekta 2) | „squat down as far as you can without letting your back arch” (J. Warner, 04.03.2019) |
| `barbend-hack-squat` | https://barbend.com/hack-squat/ | BarBend | 4 | sekcja „Barbell Hack Squat”: „Keep your arms relaxed the whole time.” |
| `coach-hack-squat` | https://www.coachweb.com/fitness/leg-exercises/hack-squat | Coach | 4 (korekta 2: autor S. Rider, REPS L3, 11.01.2024) | sekcja „Barbell Hack Squat” |
| `breakingmuscle-hack-squat` | https://breakingmuscle.com/hacking-the-hack-squat/ | Breaking Muscle | 5 (korekta 1) | „The goal is to keep the spine neutral, engage the glutes, and refrain from rounded shoulders.” |
| `physitrack-cable-squat` | https://us.physitrack.com/home-exercise-video/squat-with-cable-resistance | Physitrack | **5** (korekta 2) | „Do not allow your body to be pulled forward by the cable.” |
| `ace-393` | https://www.acefitness.org/resources/everyone/exercise-library/393/single-arm-overhead-squat/ | ACE | 4 | „Hold a kettlebell in the right hand with the right arm straight up overhead.” (Preparation) |
| `barbend-squat-variations` | https://barbend.com/squat-variations/ | BarBend | 4 | sekcja „Belt Squat”: wariant z pasem do dipów i dwiema skrzyniami (A. Polish, akt. 15.07.2025) |

Źródło już w `cues.json`: `ace-135`. Do `cues.json` proponowane tylko źródła szczebla 4 użyte w gotowym wpisie albo w danych
częściowych; źródeł szczebla 5 (Physitrack, Coach bez autora z kwalifikacjami, Breaking Muscle, Gopher Sport) nie dopisywać.
**Do decyzji koordynatora:** w `cues.json` → `orgs` „Breaking Muscle” ma dziś `level: 4`, a „Physitrack” i „Coach” zapewne też 4 —
po rozstrzygnięciach z 02.11 wymagają zmiany (Physitrack → 5; Coach → poziom na stronę, wg autora) i sprawdzenia innych ćwiczeń,
które opierają się na nich jako drugim źródle (poza zakresem badacza).

```json
{
  "sources": {
    "barbend-hack-squat": {"org": "BarBend", "title": "How to Do the Hack Squat (Barbell Hack Squat section)", "url": "https://barbend.com/hack-squat/", "level": 4},
    "coach-hack-squat": {"org": "Coach", "title": "How To Do The Hack Squat (barbell and machine) — S. Rider, REPS L3, 11.01.2024", "url": "https://www.coachweb.com/fitness/leg-exercises/hack-squat", "level": 4},
    "barbend-zercher": {"org": "BarBend", "title": "The Zercher Squat (ultimate guide)", "url": "https://barbend.com/zercher-squat-ultimate-guide/", "level": 4},
    "ace-expert-5616": {"org": "ACE", "title": "6 Functional Strength and Conditioning Exercises (expert article #5616) — Zercher Squat", "url": "https://www.acefitness.org/resources/pros/expert-articles/5616/6-functional-strength-and-conditioning-exercises-you-re-not-using-with-your-clients/", "level": 4},
    "barbend-front-squat-variations": {"org": "BarBend", "title": "Front Squat Variations", "url": "https://barbend.com/front-squat-variations/", "level": 4},
    "ace-expert-5386": {"org": "ACE", "title": "Advanced Kettlebell Workout (expert article #5386)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/", "level": 4}
  }
}
```

Przeczytane źródła szczebla 4 bez zdania z 2 źródłami (do wykorzystania przy domykaniu): `barbend-box-squat`, `barbend-best-smith`,
`barbend-dumbbell-squat`, `ace-expert-5875`, `ace-393`, `barbend-squat-variations`.

## 5. Otwarte

### Ćwiczenia otwarte — dane częściowe

Zdania niżej mają ≥ 2 źródła szczebla 4 i mogą wejść, gdy ćwiczenie dostanie brakujące zdanie (minimum: wskazówki + błędy ≥ 2).
Box Squat — po korekcie 2 bez zdań z 2 źródłami (wpis usunięty z bloku).

```json
{
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

- **Bodyweight Squat (korekta 2)** — każde zdanie ma tylko ACE #135 (Step 2–6: ustawienie, zejście, plecy, kolana nad drugim palcem, pięty na podłodze). Coach (autor-dziennikarz) i Physitrack — 5. Rozstrzygnie: drugie źródło szczebla 4 o przysiadzie z masą ciała (np. NASM, ISSA, NCSF, Coach z autorem-trenerem).
- **Smith Machine Squat (korekta 2)** — `smith.setup`, `sq.back`, `sq.mis.heels` tylko BarBend; ruch (`hack.move`) — 0 źródeł szczebla 4. Rozstrzygnie: producent maszyny Smitha (instrukcja własnej maszyny) albo organizacja szkoląca trenerów.
- **Dumbbell Squat (korekta 2)** — `dbsq.setup`, `sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn` tylko BarBend. Miejsce hantli: Coach (przy bokach) i Physitrack (między nogami) różnią się — dlatego `dbsq.setup` go nie podaje. Rozstrzygnie: drugie źródło szczebla 4.
- **Sumo Squat (hantel) (korekta 2)** — `sumo.setup`, `hack.move` tylko ACE #5875; wskazówki i błędy — 0 źródeł szczebla 4. Rozstrzygnie: drugie źródło szczebla 4 z ustawieniem, ruchem i dwiema wskazówkami/błędami.
- **Overhead Squat (korekta 2)** — 0 źródeł szczebla 4 (Physitrack i Coach J. Warner — 5). Rozstrzygnie: dwa źródła szczebla 4 (np. Catalyst Athletics, NSCA, ISSA).
- **Box Squat** — po korekcie 2 każde zdanie ma tylko BarBend (`box.setup`, `box.move`, `box.tight`, `box.mis.bounce`); Physitrack i Coach — 5. Physitrack (Step 2) każe pochylić klatkę do przodu — stąd wcześniej `hinge.back`, a nie `sq.back`. Rozstrzygnie: drugie źródło szczebla 4 (np. ACE, NASM, ISSA) z ustawieniem, ruchem i błędem „odbijanie od skrzyni”.
- **Zercher Squat** — brak drugiej wskazówki/błędu. `sq.back` złożone z dwóch źródeł po połowie (ACE „back straight”, BarBend „pull your chest up”, „torso upright”) — każda część tylko w jednym; `zer.tense` tylko BarBend; ACE „knees pointed straight ahead” — jedno źródło. Rozstrzygnie: drugie źródło szczebla 4 o Zercherze z napięciem tułowia albo plecami prostymi i klatką uniesioną.
- **Landmine Squat** — po korekcie 1 i 2 każde zdanie (`lm.hold`, `gob.move`, `gob.close`, `sq.mis.heels`) ma 0 źródeł szczebla 4 (Coach J. Snape — 5, Breaking Muscle — 5). Rozstrzygnie: dwa źródła szczebla 4 o przysiadzie z końcem sztangi przy klatce.
- **Double Kettlebell Front Squat** — `hinge.back`, `kbfs.lockout` tylko ACE (#5386). Rozstrzygnie: drugie źródło szczebla 4 (np. producent kettlebelli o własnym sprzęcie, organizacja szkoląca z kettlebelli) o neutralnych plecach i wyproście bioder na górze.
- **Cable Squat** — jedyne przeczytane źródło (Physitrack) ma po korekcie 2 szczebel 5 („Hold on to a cable machine with both hands”; krok w tył, przysiad z ugięciem bioder i kolan; błąd: dać się pociągnąć lince do przodu). Kandydaci do zdań: `hack.move` i nowe `csq.mis.pulled` („Linka ciągnie cię do przodu.”). BarBend `/cable-leg-workouts/` i `/best-quad-exercises/` — brak przysiadu z linką; Coach `/exercises/8648/cable-machine-exercises` — brak. Rozstrzygnie: dwa źródła szczebla 4 o przysiadzie z dolnym wyciągiem.
- **One-Arm Overhead Kettlebell Squat** — jedyne przeczytane źródło (ACE #393) opisuje wariant: stopa prawa przed lewą (pięta na wysokości palców), wzrok na kettlebellu, wolna ręka sięga do podłogi ze skrętem tułowia. To inny ruch niż zwykły przysiad z ciężarem nad głową — **zestaw ogólny (`sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`) nie ma potwierdzenia** w żadnym przeczytanym źródle tego ćwiczenia. BarBend `/unusual-kettlebell-exercises/` opisuje tylko jednorącz „thruster” (inne ćwiczenie). Rozstrzygnie: dwa źródła szczebla 4 o przysiadzie z jednym kettlebellem trzymanym nad głową przez cały ruch, i decyzja koordynatora, który wariant katalog oznacza.
- **Dip Belt Squat** — jedno źródło: BarBend `/squat-variations/` („Belt Squat”: pas do dipów, dwie stabilne skrzynie, stopy na skrzyniach w zwykłym rozstawie, ciężar zwisa w szczelinie pod tułowiem). Strony serwisu wydawanego przez producenta suplementów — kryterium (c), nie liczone. Istniejące w `cues.json` `exrx-Quadriceps/CBSquatBelt` dotyczy pasa na wyciągu (inny sprzęt) — analogia, nie liczy się. Kandydat do zdania: `dbelt.setup` („Stań na dwóch stabilnych skrzyniach, ciężar na pasie zwisa między nimi.”). Rozstrzygnie: drugie źródło szczebla 4 o przysiadzie z pasem do dipów na podwyższeniach.
- **Barbell Hack Squat — zestaw `hingeFloor` nie pasuje.** Oba źródła opisują przysiad (kolana idą w przód, tułów pionowo; Coach: biodra nie powinny cofać się, sztanga idzie pionowo w dół), nie zawias z podłogi; Coach zaczyna ze stojaka, nie z podłogi. Obecny zestaw ogólny (`hinge.back`, `sq.kneesToes`, `mis.roundBack`): `sq.kneesToes` — żadne przeczytane źródło tego ćwiczenia; `mis.roundBack` („…żeby dociągnąć ciężar”) — BarBend opisuje zaokrąglenie przy opuszczaniu, nie przy dociąganiu → pominięte. Rekomendacja dla koordynatora: rodzina figury/zestawu bliżej `squat` niż `hingeFloor`; decyzja o figurze i wpis recenzji w `docs/research/figury-recenzja.json` (klucz „Barbell Hack Squat”, dziś `rodzina: hingeFloor`, werdykt „wyswietlana”) — poza zakresem badacza, do bramki 4.
- **Coach — ocena na stronę:** po korekcie 2 tylko 1 z 8 przeczytanych stron Coach ma autora z kwalifikacjami (hack squat). Pozostałe pisali dziennikarze; jeśli koordynator uzna cytowanego trenera (np. przy `coach-bodyweight-squat`) za wystarczający, Bodyweight Squat wraca do gotowych (ACE + Coach: `gob.stance`, `sq.down`, `sq.kneesToes`, `sq.mis.kneesIn`).
- **Błędy zestawów ogólnych (informacja dla koordynatora):**
  - Box Squat: `sq.kneesToes`, `sq.mis.kneesIn`, `sq.mis.heels` — źródła wariantu nie opisują ich wprost; `sq.back` → `hinge.back` (Physitrack, szczebel 5: klatka pochylona do przodu).
  - Smith Machine Squat: `sq.down` („cofając biodra”) — źródła Smitha mówią tylko „bending at the hips and knees” (stopy przed sztangą); `sq.kneesToes`, `sq.mis.kneesIn` — brak w źródłach.
  - Bodyweight Squat: `sq.stance` (barki lub szerzej) — ACE „slightly wider than hip-width”, Coach „hip-width” → lepiej `gob.stance`.
  - Double Kettlebell Front Squat: `sq.down` („cofając biodra”) przeczy opisowi z Breaking Muscle („sit straight down”, szczebel 5 — tylko informacja) → `kbfs.move`; `sq.mis.heels` — brak źródła o piętach.
  - Sumo Squat (hantel): `sq.down` („cofając biodra”) — tylko Coach („sitting back”, szczebel 5).
  - Dumbbell Squat: `sq.mis.heels` — tylko Physitrack (szczebel 5).
  - One-Arm Overhead Kettlebell Squat: cały zestaw bez potwierdzenia (patrz wyżej).
  - Cable Squat, Dip Belt Squat: zestaw ogólny `sq.down`, `sq.back`, `sq.kneesToes`, `sq.mis.kneesIn`, `sq.mis.heels` — żadne przeczytane źródło tych ćwiczeń nie potwierdza ich.

## 6. Dostęp

- ExRx.net — 403; web.archive.org — zablokowane dla narzędzia (wg uzupełnienia briefu nie próbowano dalej). NSCA (artykuł o przysiadzie Zerchera) — 403. Kettlebell Kings (producent) — 402.
- NASM: `/resource-center/exercise-library/bodyweight-squat` — 404; `/exercise-library/prisoner-squat` — strona bez treści.
- BarBend: `/air-squat/`, `/bodyweight-squat/`, `/zercher-squat/`, `/landmine-squat/`, `/sumo-squat/` — 404. Breaking Muscle `/dumbbell-squat/` — 404. Physitrack `how-to-perform-the-bodyweight-squat-exercise` — 404.
- 02.11 (kontynuacja): strona przeglądu sprzętu o przysiadach z linką — 404; Coach `/workouts/kettlebell-workouts/…one-kettlebell…` — przekierowanie do innego serwisu, treść niedostępna; Coach `/kettlebell-exercises` — treść ucięta przed wpisami średniozaawansowanymi.

## Stan

- Zrobione (wskazówki, rodzina `squat` cz. 1): wszystkie 13 ćwiczeń zbadane; korekta szczebli 1 i 2 (02.11). Gotowe: Barbell Hack Squat. Otwarte: pozostałe 12 (Bodyweight, Smith Machine, Dumbbell, Sumo, Overhead — od korekty 2; Box, Zercher, Landmine, Double Kettlebell Front — od korekty 1; Cable, One-Arm Overhead Kettlebell, Dip Belt — po jednym źródle albo bez źródła szczebla 4).
- Zostało (dla domknięcia otwartych): drugie źródło szczebla 4 dla ćwiczeń z jednym źródłem (BarBend albo ACE) — wykaz w „Otwarte”.
- Następny krok: wyszukiwanie w ISSA (`issaonline.com`, treść z autorem i datą), NASM, NCSF, Catalyst Athletics (Zercher, Overhead), producenci maszyn Smitha i kettlebelli o własnym sprzęcie; strony Coach — tylko z autorem-trenerem.
- Pułapki: Breaking Muscle, Gopher Sport, Physitrack — szczebel 5; Coach — sprawdzać autora na każdej stronie (większość pisali dziennikarze); strony przeglądów sprzętu i serwis wydawany przez producenta suplementów — nie liczyć; wiele adresów BarBend zgadywanych z nazwy daje 404 — najpierw wyszukiwarka.
