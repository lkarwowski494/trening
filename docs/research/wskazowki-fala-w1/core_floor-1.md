# Wskazówki techniki — fala W1, grupa core_floor (część 1)

Data: 02.11.2026 (sesja 1, sesja 2 i uzupełnienie 2 tego samego dnia). Autor: badacz merytoryczny (agent). Status: PROPOZYCJA. To dane do wklejenia przez koordynatora albo programistę. Nic z tego nie trafiło jeszcze do `lib/` ani do `data/zrodla/`.

**Metoda.** Jak w `docs/research/33-wskazowki-partia2.md` i w wyjątku dla wskazówek techniki (CLAUDE.md):
- każde zdanie ma co najmniej 2 przeczytane (WebFetch, 02.11.2026) źródła szczebla 4 z różnych organizacji;
- wariant (inny sprzęt albo pozycja) jest opisany „(wariant: …)”;
- bez liczb (kąty liczbowe, tempo, powtórzenia) i bez uzasadnień zdrowotnych.

**Uzupełnienie briefu koordynatora:**
- strony innych aplikacji treningowych nie są źródłem — pominięte i nigdzie niewpisane;
- zdania zestawu ogólnego (`lib/figures/v2/cue-sets.json`) wpisane tylko wtedy, gdy przeczytane źródła potwierdzają je dla tego ćwiczenia;
- ExRx (403) i web.archive.org (blokada) — nieużywane.

**Rozstrzygnięcie koordynatora linii 1.1 o szczeblach (02.11.2026), zastosowane w sesji 2.** Szczebel 4 wymaga naraz: (a) organizacja szkoląca/certyfikująca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść jawnie firmowana przez organizację; (c) nie recenzja afiliacyjna ani marketing. Dwa serwisy jednego właściciela = jedno źródło. Breaking Muscle = 5 i nigdy niezależne od BarBend; NFPT = 4 tylko z autorem, datą i kwalifikacjami; producent = 4 tylko dla własnego sprzętu; Catalyst = 4. Uzupełnienie 2 (02.11.2026) — sekcja 6.

Cytaty ze źródeł są tu najwyżej jednym krótkim fragmentem na źródło. Miejsca podano w JSON.

## 1. Tabela ćwiczeń (stan po uzupełnieniu 2)

| Klucz | Stan | Zdań | Uwagi |
|---|---|---|---|
| Cable Crunch | gotowe | 3 | ACE 331 (wariant stojący) + BarBend (klęcząc). `cc.ribs` zastąpione `core_floor.ccMove`; `mis.jerk` — 1 źródło. |
| Hollow Hold | gotowe | 3 | Catalyst 712 + BarBend. `core_floor.mis.legsHigh` → otwarte (tylko BarBend). |
| Superman | gotowe | 4 | ACE 9 + Cleveland Clinic (4; uzupełnienie 2 potwierdza: system ochrony zdrowia). |
| Decline Crunch | gotowe (warunkowo) | 2 | Catalyst + ACE 52 jako wariant. Warunek: decyzja audytora „wariant czy analogia” (Otwarte 4). |
| GHD Sit Up | gotowe | 2 | Catalyst + CrossFit (oba 4). `core_floor.ghdDown` → otwarte (Garage Strength = 5). |
| Sit Up | **otwarte** (uzupełnienie 2; było: gotowe warunkowo, 2) | 0 | YourCareEverywhere → 5 (treść firmowana przez MEDHOST Cloud Services — firmę IT, nie placówkę ochrony zdrowia; sekcja 6). Zostaje tylko Catalyst 432. |
| V-Up | gotowe | 3 | Catalyst + WebMD (oba 4). `vup.back` — 1 źródło. |
| Bicycle Crunch | gotowe | 3 | ACE 241 + BarBend: `bikeSetup`, `crunch.neck`, `crunch.lowBack`. `core_floor.bikeMove` i `core_floor.mis.momentum` → otwarte. |
| Lying Leg Raise | otwarte | 0 | Barbell Logic i Dynamo Fitness = 5. |
| Dragon Flag | otwarte | 0 | Catalyst (4) + Coach (5 — uzupełnienie 2: biogram autora sprawdzony, dziennikarz bez kwalifikacji trenerskich). |
| Machine Crunch | gotowe | 3 | ACE 291 + Hoist HD-3600 (producent maszyny tego rodzaju = 4). |
| Stability Ball Crunch | otwarte | 1 | NFPT = 5 (strona bez kwalifikacji autora). Zostaje tylko `crunch.neck` (ACE 68 + NASM) — za mało zdań. |

Gotowe: 7 (w tym warunkowo 1: Decline Crunch). Otwarte: 5 (Sit Up, Lying Leg Raise, Dragon Flag, Stability Ball Crunch; oraz zdania otwarte w ćwiczeniach gotowych).

## 2. JSON do `exercises` w `data/zrodla/cues.json` (tylko ćwiczenia gotowe)

```json
{
  "Cable Crunch": {
    "setup": [
      {"c": "core_floor.ccSetup", "s": [["ace-331", "Steps 2–3 (wariant: stojąc tyłem do wyciągu; wyciąg w najwyższej pozycji, końce liny przy uszach)"], ["barbend-cable-crunch", "Setup (kneel; rope across traps)"]]}
    ],
    "move": [
      {"c": "core_floor.ccMove", "s": [["ace-331", "Steps 5–6 (wariant: stojąc; roll rib cage down)"], ["barbend-cable-crunch", "Crunch (curl your torso towards the ground)"]]}
    ],
    "tips": [
      {"c": "cc.slow", "s": [["ace-331", "Step 7; Tips (control the return)"], ["barbend-cable-crunch", "Reset (slowly straighten your torso)"]]}
    ],
    "mistakes": []
  },
  "Hollow Hold": {
    "setup": [
      {"c": "core_floor.supineArms", "s": [["barbend-hollow-hold", "Setup (arms extended behind head)"], ["catalyst-hollow-hold", "opis (lie on your back with your arms overhead)"]]}
    ],
    "move": [
      {"c": "core_floor.hollowMove", "s": [["barbend-hollow-hold", "Position and Form Cues (lower back flat; lift shoulders and legs; hold)"], ["catalyst-hollow-hold", "opis (push your lower back flat into the floor; elevate your feet and upper back; isometric)"]]}
    ],
    "tips": [
      {"c": "db.back", "s": [["barbend-hollow-hold", "Position and Form Cues; Common Mistakes (Arched back)"], ["catalyst-hollow-hold", "opis (push your lower back flat into the floor)"]]}
    ],
    "mistakes": []
  },
  "Superman": {
    "setup": [
      {"c": "core_floor.supermanSetup", "s": [["ace-9", "Step 1"], ["cc-superman", "instrukcja, start (lying on your stomach, arms stretched over your head)"]]}
    ],
    "move": [
      {"c": "core_floor.supermanMove", "s": [["ace-9", "Steps 2–3 (a few inches off the floor; hold briefly; slowly lower)"], ["cc-superman", "instrukcja (lift both arms and both legs; hold a few seconds; only a few inches at first)"]]}
    ],
    "tips": [
      {"c": "core_floor.headNeutral", "s": [["ace-9", "Steps 1–2 (head in line with spine; without lifting your head)"], ["cc-superman", "wskazówki (keep your neck in a neutral position)"]]},
      {"c": "cobra.control", "s": [["ace-9", "Step 3 (slowly lower)"], ["cc-superman", "instrukcja (slowly lowering; go slow)"]]}
    ],
    "mistakes": []
  },
  "Decline Crunch": {
    "setup": [],
    "move": [
      {"c": "core_floor.declineMove", "s": [["catalyst-decline-crunch", "opis (curl the trunk upward; lift the upper and mid back off the bench; return maintaining tension)"], ["ace-52", "Steps 3–4 (wariant: na podłodze)"]]}
    ],
    "tips": [
      {"c": "core_floor.declineLowBack", "s": [["catalyst-decline-crunch", "opis (pushing the lower back down into it)"], ["ace-52", "Tips (keep lower back on the mat) (wariant: na podłodze)"]]}
    ],
    "mistakes": []
  },
  "GHD Sit Up": {
    "setup": [],
    "move": [
      {"c": "core_floor.ghdMove", "s": [["catalyst-ghd-sit-up", "opis (lean back, then crunch and sit back up, tightening the quads)"], ["crossfit-ghd-sit-up", "wskazówka trenera (sharply extend the legs while coming up)"]]}
    ],
    "tips": [
      {"c": "core_floor.ghdRange", "s": [["catalyst-ghd-sit-up", "Tips (limit the range; stop with upper body approximately horizontal)"], ["crossfit-ghd-sit-up", "Faults and warnings (newcomers come down to parallel)"]]}
    ],
    "mistakes": []
  },
  "V-Up": {
    "setup": [
      {"c": "core_floor.supineReach", "s": [["catalyst-v-up", "opis (lie on your back, legs straight, arms extended overhead)"], ["webmd-v-ups", "How to do V-ups, krok 1"]]}
    ],
    "move": [
      {"c": "core_floor.vupMove", "s": [["catalyst-v-up", "opis (simultaneously perform a sit-up and lift your straight legs; return to fully extended)"], ["webmd-v-ups", "How to do V-ups, kroki 3–4"]]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [["catalyst-v-up", "opis (maintaining ab tension)"], ["webmd-v-ups", "How to do V-ups, kroki 2–4; form tips (engage your core)"]]}
    ],
    "mistakes": []
  },
  "Bicycle Crunch": {
    "setup": [
      {"c": "core_floor.bikeSetup", "s": [["ace-241", "Step 1"], ["barbend-bicycle-crunch", "Step 1; Common mistakes (hands lightly behind your head)"]]}
    ],
    "move": [],
    "tips": [
      {"c": "crunch.neck", "s": [["ace-241", "wskazówki (don't pull on your head)"], ["barbend-bicycle-crunch", "Common mistakes (Neck strain)"]]},
      {"c": "crunch.lowBack", "s": [["ace-241", "wskazówki (lower back pressed into the floor)"], ["barbend-bicycle-crunch", "Form tips (lower back pressed into the floor)"]]}
    ],
    "mistakes": []
  },
  "Machine Crunch": {
    "setup": [
      {"c": "core_floor.mcSetup", "s": [["ace-291", "Steps 1–2; Tips (set the seat and weight before you begin) (wariant: maszyna z wałkiem na piszczele)"], ["hoist-hd-3600", "Ab Crunch — setup (seat height; select weight) (wariant: poduszka na klatce)"]]}
    ],
    "move": [
      {"c": "core_floor.mcMove", "s": [["ace-291", "Steps 5–7"], ["hoist-hd-3600", "Ab Crunch — movement (bend at the waist, push upper torso forward)"]]}
    ],
    "tips": [
      {"c": "cc.slow", "s": [["ace-291", "Step 8; Tips (return slowly)"], ["hoist-hd-3600", "Ab Crunch — movement (slowly return to the start position)"]]}
    ],
    "mistakes": []
  }
}
```

Uwagi do JSON:
- Bicycle Crunch ma pustą sekcję `move` (zdanie ruchu ma tylko ACE na szczeblu 4). Do decyzji koordynatora: czy ćwiczenie bez zdania ruchu wyświetlać w trybie `own`, czy zostawić `general` do czasu drugiego źródła ruchu.
- Sit Up usunięty z bloku w uzupełnieniu 2 (wstrzymane zdania niżej).

Dla każdego gotowego ćwiczenia: po wdrożeniu zmień tryb w `cue-sets.json` z `general` na `own` (decyzja koordynatora/programisty).

## 3. Nowe zdania

Zdania używane w JSON powyżej:

| id | PL | EN (propozycja) |
|---|---|---|
| core_floor.ccSetup | Uklęknij przy wyciągu z liną zawieszoną wysoko; końce liny trzymaj przy głowie. | Kneel at a high cable with a rope; hold the rope ends by your head. |
| core_floor.ccMove | Zwijaj tułów w dół, ściągając żebra w stronę podłogi. | Curl your torso down, rolling your ribs toward the floor. |
| core_floor.supineArms | Połóż się na plecach, ręce wyciągnięte za głowę. | Lie on your back with your arms reaching overhead. |
| core_floor.supineReach | Połóż się na plecach, nogi wyprostowane, ręce wyciągnięte za głowę. | Lie on your back, legs straight, arms reaching overhead. |
| core_floor.hollowMove | Dociśnij lędźwie do podłogi, unieś łopatki i nogi i trzymaj. | Press your lower back into the floor, lift your shoulder blades and legs, and hold. |
| core_floor.supermanSetup | Połóż się na brzuchu, nogi wyprostowane, ręce wyciągnięte przed głową. | Lie face down, legs straight, arms stretched out past your head. |
| core_floor.supermanMove | Unieś jednocześnie proste ręce i nogi nisko nad podłogę, chwilę przytrzymaj i powoli opuść. | Lift your straight arms and legs a little off the floor together, hold briefly, then lower slowly. |
| core_floor.headNeutral | Głowa w przedłużeniu tułowia — patrz w podłogę, nie zadzieraj głowy. | Keep your head in line with your body — eyes on the floor, don't lift your head. |
| core_floor.declineMove | Zwijaj tułów, aż górna część pleców oderwie się od ławki; wracaj pod kontrolą. | Curl up until your upper back leaves the bench; lower under control. |
| core_floor.declineLowBack | Dolna część pleców zostaje dociśnięta do ławki. | Keep your lower back pressed into the bench. |
| core_floor.ghdMove | Odchyl się do tyłu, a potem wróć do siadu, mocno prostując nogi. | Lean back, then sit up while driving your legs straight. |
| core_floor.ghdRange | Na początek odchylaj się tylko do poziomu; pełny zakres później. | Start by leaning back only to horizontal; go deeper later. |
| core_floor.vupMove | Jednocześnie unieś tułów i proste nogi, potem opuść je z powrotem. | Lift your torso and straight legs at the same time, then lower back down. |
| core_floor.bikeSetup | Połóż się na plecach, dłonie lekko za głową, nogi uniesione i ugięte w kolanach. | Lie on your back, hands lightly behind your head, legs up with knees bent. |
| core_floor.mcSetup | Ustaw siedzisko i ciężar przed serią. | Set the seat and weight before you start the set. |
| core_floor.mcMove | Napnij brzuch i pochyl tułów do przodu przeciw oporowi maszyny. | Brace your abs and bend your torso forward against the machine. |

Razem 16 nowych zdań w użyciu (uzupełnienie 2: `situpMove` przeniesione do kandydatów).

Zdania kandydujące — mają < 2 źródła szczebla 4 (NIE do aplikacji, czekają na drugie źródło):

| id | PL | EN | brakuje |
|---|---|---|---|
| core_floor.situpMove | Napnij brzuch, zwiń tułów i usiądź; do leżenia wracaj pod kontrolą. | Brace your abs, curl up and sit all the way up; lower back down under control. | Sit Up: tylko Catalyst 432 (YCE = 5 od uzupełnienia 2) |
| crunch.setup (Sit Up) | (istniejące) | (istniejące) | jw. |
| core_floor.mis.legsHigh | Nogi uniesione za wysoko. | Legs raised too high. | Hollow Hold: tylko BarBend (Breaking Muscle = 5) |
| core_floor.ghdDown | Odchylaj się pod kontrolą, bez opadania. | Lean back under control — don't drop. | GHD: tylko Catalyst (Garage Strength = 5) |
| core_floor.bikeMove | Przyciągaj kolano do klatki i kieruj do niego przeciwny łokieć, skręcając tułów; drugą nogę prostuj. Zmieniaj strony. | Pull one knee in and turn your torso to bring the opposite elbow toward it while the other leg straightens. Alternate sides. | Bicycle: tylko ACE 241 (Breaking Muscle, Coach = 5) |
| core_floor.mis.momentum | Robienie powtórzeń z rozpędu zamiast pod kontrolą. | Using momentum instead of control. | Bicycle: tylko BarBend; Ball: tylko NASM; Sit Up: tylko YCE (5) |
| core_floor.llrSetup | Połóż się na plecach z wyprostowanymi nogami. | Lie on your back with your legs straight. | LLR: Barbell Logic i Dynamo = 5 |
| core_floor.llrMove | Unieś proste nogi do pionu i powoli je opuść. | Raise your straight legs until vertical, then lower them slowly. | jw. |
| core_floor.ballSetup | Usiądź na piłce, przejdź stopami do przodu i połóż się na niej środkiem pleców; stopy płasko na podłodze. | Sit on the ball, walk your feet out and lie back with your mid-back on it, feet flat on the floor. | Ball: tylko ACE 68 (NFPT = 5) |
| core_floor.ballMove | Zwijaj tułów, aż górna część pleców oderwie się od piłki; wracaj powoli. | Curl up until your upper back leaves the ball; lower slowly. | jw. |
| core_floor.ballStill | Stopy i biodra zostają w miejscu — pracuje tylko tułów. | Feet and hips stay put — only your torso moves. | jw. |

Uwagi: „do poziomu” w `core_floor.ghdRange` — Catalyst („approximately horizontal”) i CrossFit („down to parallel”); to położenie, nie liczba.

Istniejące zdania użyte dla tych ćwiczeń: `cc.slow`, `db.back`, `cobra.control`, `plank.brace`, `crunch.neck`, `crunch.lowBack`.

## 4. Źródła i ocena szczebla (po uzupełnieniu 2, 02.11.2026)

### Źródła używane w JSON

| id | adres | organizacja | szczebel |
|---|---|---|---|
| ace-9 | https://www.acefitness.org/resources/everyone/exercise-library/9/supermans/ | ACE | 4 |
| ace-241 | https://www.acefitness.org/resources/everyone/exercise-library/241/supine-bicycle-crunches/ | ACE | 4 |
| ace-291 | https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/ | ACE | 4 |
| ace-331 | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | ACE | 4 |
| cc-superman | https://health.clevelandclinic.org/got-back-pain-try-superman-3-exercises (10.05.2021; cytowani PT i fizjolog wysiłku) | Cleveland Clinic | 4 |
| barbend-cable-crunch | https://www.barbend.com/cable-crunch/ (E. Bugera, CSCS, akt. 27.11.2024) | BarBend | 4 (artykuł o technice) |
| barbend-hollow-hold | https://barbend.com/hollow-hold (J. Dickson, NASM-CPT, akt. 17.07.2024) | BarBend | 4 (artykuł o technice) |
| barbend-bicycle-crunch | https://www.barbend.com/bicycle-crunch/ (A. Nelson, akt. 20.11.2024) | BarBend | 4 (artykuł o technice) |
| catalyst-hollow-hold | https://catalystathletics.com/exercise/712/Hollow-Hold | Catalyst Athletics | 4 |
| catalyst-v-up | https://www.catalystathletics.com/exercise/313/V-Up/ | Catalyst Athletics | 4 |
| catalyst-decline-crunch | https://catalystathletics.com/exercise/704/Decline-Crunch/ | Catalyst Athletics | 4 |
| catalyst-ghd-sit-up | https://catalystathletics.com/exercise/487/GHD-Sit-up/ | Catalyst Athletics | 4 |
| crossfit-ghd-sit-up | https://www.crossfit.com/essentials/the-glute-ham-developer-sit-up (G. Glassman; CrossFit Journal 2005, wersja www 09.07.2022) | CrossFit | 4 |
| webmd-v-ups | https://www.webmd.com/fitness-exercise/how-to-do-v-ups (A. Twu; recenzja lek. T. Wheeler, MD, 08.12.2024) | WebMD | 4 |
| hoist-hd-3600 | https://www.hoistfitness.com/pages/hd-3600-ab-crunch-low-back | Hoist Fitness | 4 (producent tej maszyny) |

Istniejące źródła użyte ponownie: `ace-52`, `nasm-best-abs`.

### Ocena organizacji kryteriami (a)–(c)

| Organizacja | Szczebel | Powód |
|---|---|---|
| ACE, NASM | 4 | organizacje certyfikujące trenerów; treść firmowana przez organizację |
| BarBend | 4 | tylko artykuły o technice z autorem i datą (wszystkie użyte takie są) |
| Catalyst Athletics | 4 | rozstrzygnięcie koordynatora |
| Cleveland Clinic (Health Essentials) | 4 | system ochrony zdrowia, treść jawnie firmowana (uzupełnienie 2; wcześniej ta sama ocena przez analogię do HSS). |
| CrossFit | 4 | (a) organizacja szkoląca i certyfikująca trenerów (kursy L1); (b) autor G. Glassman, CrossFit Journal 2005; (c) materiał szkoleniowy. |
| WebMD | 4 | (a) serwis z redakcją i nazwaną recenzją lekarza; (b) autor i data recenzji 08.12.2024; (c) artykuł poradnikowy. |
| YourCareEverywhere | **5** (uzupełnienie 2; było: 4 — propozycja) | WebFetch 02.11.2026: strona firmowana przez „MEDHOST Cloud Services” (firma IT dla szpitali), żaden szpital ani system ochrony zdrowia nie jest wydawcą ani sponsorem; autorka bez podanych kwalifikacji. Nie spełnia reguły „placówka ochrony zdrowia”; jako serwis komercyjny jak Physitrack/VHI → 5. |
| Hoist Fitness | 4 | producent maszyny do brzuszków; użyty tylko dla własnej maszyny |
| Coach (coachweb.com) | 5 | uzupełnienie 2 („warunkowo 4 z autorem z kwalifikacjami”): biogram N. Harris-Fry sprawdzony 02.11.2026 — „journalist who has been covering health and fitness since 2015”, bez kwalifikacji trenerskich; w tekście Dragon Flag brak cytowanego trenera. Coach i inne serwisy Future plc = jeden właściciel. |
| Breaking Muscle | 5 | rozstrzygnięcie koordynatora (i nie jest niezależny od BarBend) |
| NFPT | 5 (dla `nfpt-stability-ball-crunch`) | strona nie podaje kwalifikacji autora |
| Barbell Logic | 5 | strona bez autora i daty |
| Dynamo Fitness | 5 | blog dostawcy sprzętu — sprzedawca |
| Garage Strength | 5 | blog firmy treningowej bez autora i daty |
| The Gym Group | 5 | operator siłowni, strona bez autora i daty |
| Natural Health Co. (nhc.com) | 5 | sklep z suplementami — blog marketingowy |
| NY State Police | 5 / nie dotyczy | norma testu sprawności |

### Źródła przeczytane, ale nieliczone (szczebel 5) albo tylko w „Otwarte”

- `catalyst-sit-up` — https://catalystathletics.com/exercise/432/Sit-Up/ (4; jedyne źródło Sit Up szczebla 4 po uzupełnieniu 2)
- `yce-sit-up` — https://yourcareeverywhere.com/stay-well-and-fit/exercise/strength-and-training/how-to-do-a-sit-up.html (L. High, 28.07.2023; MEDHOST; 5 od uzupełnienia 2)
- `catalyst-dragon-flag` — https://catalystathletics.com/exercise/564/Dragon-Flag/ (4; jedyne źródło Dragon Flag)
- `coach-dragon-flag` — https://coachweb.com/abs-exercises/8420/dragon-flag (N. Harris-Fry, 26.03.2021; 5)
- `coach-bicycle-crunches` — https://www.coachweb.com/exercises/lose-weight/1716/bicycle-crunches (5)
- `breakingmuscle-hollow-body`, `breakingmuscle-bicycle-crunches` (5)
- `breakingmuscle-sit-up` — https://breakingmuscle.com/?p=160106 (5)
- `gymgroup-sit-up` — https://www.thegymgroup.com/exercises/abs-and-core-exercises/how-to-do-a-sit-up (5)
- `nhc-sit-ups` — https://www.nhc.com/blogs/articles/workout-wednesday-why-form-matters-when-doing-sit-ups (5)
- `nfpt-stability-ball-crunch` — https://nfpt.com/stability-ball-crunch/ (5)
- `barbelllogic-lying-leg-raise` — https://barbell-logic.com/?p=87094 (5)
- `dynamo-lying-leg-raise` — https://blog.dynamofitness.com.au/?p=2798 (5)
- `garagestrength-ghd-sit-ups` — https://www.garagestrength.com/blogs/news/ghd-sit-ups (5)
- `crossfit-anchored-sit-up` — https://www.crossfit.com/sport/cfg21-foundations-su (norma testu)
- `nysp-sit-ups` — https://joinstatepolice.ny.gov/sit-ups (norma testu)
- `ace-242` — https://www.acefitness.org/resources/everyone/exercise-library/242/v-ups/ (inny ruch)
- `ace-68` — https://www.acefitness.org/resources/everyone/exercise-library/68/stability-ball-sit-ups-crunches/ (4; Stability Ball Crunch otwarte)

### Propozycje nowych `orgs`

| Klucz | name (propozycja) | level | kind |
|---|---|---|---|
| Cleveland Clinic | Cleveland Clinic — Health Essentials (materiał edukacyjny systemu ochrony zdrowia) | 4 | site |
| Catalyst Athletics | Catalyst Athletics — Exercise Library | 4 | site |
| CrossFit | CrossFit — materiały szkoleniowe organizacji szkolącej trenerów | 4 | org |
| Hoist Fitness | Hoist Fitness — instrukcja maszyny producenta | 4 | maker |
| WebMD | WebMD — artykuły z recenzją lekarza | 4 | site |

Wycofane z propozycji (szczebel 5): YourCareEverywhere (uzupełnienie 2), NFPT (dla tej strony), Barbell Logic, Dynamo Fitness, Garage Strength.

## 5. Otwarte

**Ćwiczenia otwarte**

1. **Dragon Flag — otwarte.** Catalyst (4): ławka, chwyt brzegów ławki przy głowie, ciało proste podparte tylko górną częścią pleców, opuszczanie w linii prostej. Coach (5 — biogram sprawdzony w uzupełnieniu 2, autor bez kwalifikacji). Kandydatury zdań, gdyby znalazło się drugie źródło szczebla 4: ustawienie „Połóż się na ławce i chwyć jej brzegi przy głowie”, ruch „Unieś ciało w prostej linii, opierając się tylko o górną część pleców, i powoli opuszczaj je prosto”.
2. **Lying Leg Raise — otwarte.** Barbell Logic i Dynamo = 5. Potrzebne 2 nowe źródła szczebla 4 (np. Catalyst — niesprawdzone).
3. **Stability Ball Crunch — otwarte.** Tylko `crunch.neck` (ACE 68 + NASM). `ballSetup`, `ballMove`, `ballStill` mają tylko ACE 68.
4. **Sit Up — otwarte (uzupełnienie 2).** Tylko Catalyst 432 na szczeblu 4. Różnice między źródłami (do przyszłej części wspólnej): stopy — Catalyst płasko/można zaczepić, YCE zaczepione, Breaking Muscle (5) odradza zaczepianie; ręce — Catalyst palce po bokach głowy, YCE dłonie splecione. Potrzebne drugie źródło szczebla 4 (np. szpital/system ochrony zdrowia albo organizacja szkoląca trenerów).

**Brakujące sekcje i zdania w ćwiczeniach gotowych**

5. **Decline Crunch — wariant czy analogia.** Czy zwykły brzuszek na podłodze (ACE 52) to wariant brzuszka na ławce skośnej, czy analogia? Do decyzji audytora. Jeśli analogia — ćwiczenie wraca do „otwarte”.
6. **GHD Sit Up — ustawienie i `ghdDown`.** Ustawienie: Catalyst i Garage Strength (5). `ghdDown`: Catalyst + Garage Strength (5).
7. **Bicycle Crunch — zdanie ruchu.** `bikeMove` tylko ACE 241; `mis.momentum` tylko BarBend.
8. **Hollow Hold — `mis.legsHigh`.** Tylko BarBend.

**Zdania zestawu ogólnego niepotwierdzone (możliwe błędy zestawu ogólnego)**

9. **`mis.jerk`** przy ćwiczeniach bez obciążenia: Bicycle Crunch, Decline Crunch, Sit Up, V-Up, Lying Leg Raise — słowo „ciężarem” nie pasuje. Dla Cable Crunch i Machine Crunch brak 2 źródeł.
10. **`cc.ribs`** (Cable Crunch, Machine Crunch): „biodra zostają w miejscu” przy wyciągu tylko BarBend; o żebrach przy maszynie nie mówi żadne źródło.
11. **Hollow Hold:** `plank.brace` i `plank.mis.breath` — brak wzmianki o oddechu; nie wpisane.
12. **Superman:** `cobra.hips` — żadne źródło wprost; `cobra.mis` — tylko ACE. Nie wpisane.
13. **V-Up:** `vup.back` — tylko WebMD.
14. **Lying Leg Raise:** `db.back`, `db.slow` — bez źródeł szczebla 4.

**Szczeble źródeł**

15. ~~YourCareEverywhere i Coach do decyzji~~ — rozstrzygnięte uzupełnieniem 2: oba 5 (sekcja 6).

## 6. Korekta szczebli — uzupełnienie 2 (02.11.2026)

Podstawa: uzupełnienie 2 rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): szpitale/systemy ochrony zdrowia → 4 (jawne firmowanie wystarcza); magazyn Coach → warunkowo 4 tylko z autorem z kwalifikacjami; YourCareEverywhere — ocenić, czy treść jest firmowana przez placówkę ochrony zdrowia.

| źródło | przed | po | powód |
|---|---|---|---|
| yce-sit-up (YourCareEverywhere) | 4 (propozycja) | **5** | WebFetch 02.11.2026: firmowane wyłącznie przez MEDHOST Cloud Services („©2015-2024 MEDHOST Cloud Services, Inc.”), bez szpitala jako wydawcy/sponsora; autorka bez kwalifikacji. |
| coach-dragon-flag, coach-bicycle-crunches (Coach) | 5 | 5 | biogram autora Dragon Flag sprawdzony: dziennikarz, bez kwalifikacji trenerskich; brak cytowanego trenera. Bicycle — bez zmian (nie sprawdzano ponownie; ćwiczenie i tak gotowe bez niego). |
| cc-superman (Cleveland Clinic) | 4 | 4 | potwierdzone regułą „system ochrony zdrowia”. |

Skutek dla ćwiczeń:

| ćwiczenie | przed | po |
|---|---|---|
| Sit Up | gotowe warunkowo, 2 | **otwarte, 0** |
| Dragon Flag | otwarte | otwarte |
| pozostałe | bez zmian | bez zmian |

## Stan

**Sesja 1 (02.11.2026):** 12 ćwiczeń przejrzanych.

**Sesja 2 (02.11.2026):** rozstrzygnięcie o szczeblach zastosowane; gotowe 8 (warunkowo 2), otwarte 4.

**Uzupełnienie 2 (02.11.2026):** Sit Up → otwarte (YCE = 5); Dragon Flag bez zmian (Coach = 5 po sprawdzeniu biogramu). Wynik: **gotowe 7** (warunkowo 1: Decline Crunch), **otwarte 5** (Sit Up, Dragon Flag, Lying Leg Raise, Stability Ball Crunch; Bicycle Crunch bez zdania ruchu — pytanie w uwagach do JSON).

**Zostało:**
- decyzja audytora — Otwarte 5 (Decline Crunch);
- drugie źródło szczebla 4 dla: Sit Up, Dragon Flag, Lying Leg Raise, Stability Ball Crunch, `bikeMove`, `ghdDown`, `mis.legsHigh`;
- przegląd nowych zdań przez recenzenta lokalizacji;
- wpis do `cues.json` / `pl.json`, `claims.mjs --stub` i zmiana trybu w `cue-sets.json` (programista);
- poprawa zestawów ogólnych dla ćwiczeń otwartych (Otwarte 9–14).

**Następny krok przy kontynuacji:** Catalyst (`catalystathletics.com/exercise/<nr>/<nazwa>/`) dla Lying Leg Raise i Stability Ball Crunch; dla Sit Up — materiały szpitali/systemów ochrony zdrowia (szczebel 4 od uzupełnienia 2); dla Dragon Flag — organizacje szkolące trenerów kalisteniki.

**Pułapki dostępu (02.11.2026):**
- exrx.net — 403; web.archive.org zablokowane; mirafit.co.uk — 403.
- NASM: biblioteka ćwiczeń nie ma stron dla tych ćwiczeń (z brzucha tylko dead-bug, plank, side-plank, russian-twist, reverse-crunch-to-knee-up-with-rotation, floor-prone-cobra).
- barbend.com i breakingmuscle.com — „zgadnięte” slugi dają 404; szukać przez wyszukiwarkę. BarBend nie ma artykułu o Dragon Flag.
- bodybuilding.com przekierowuje do sklepu; muscleandstrength.com — 403 (i nie liczy się).
- Strona Body-Solid nie ma instrukcji ćwiczeń.
- „Superman” Health and Wellbeing Queensland to ruch z klęku podpartego (inne ćwiczenie) — nieużyta.
- ACE nie ma w bibliotece zwykłego sit-upu.
- Wiele wyników „sit-up”/„dragon flag” to strony aplikacji treningowych — pominięte.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Bez zmian stanu — ustalenia zbiorcze w `core_standing-2.md`, sekcja „Stan”, podsekcja „Uzupełnienie 3 dla pozostałych plików grupy”.
