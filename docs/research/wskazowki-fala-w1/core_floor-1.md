# Wskazówki techniki — fala W1, grupa core_floor (część 1)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: PROPOZYCJA. To dane do wklejenia przez koordynatora albo programistę. Nic z tego nie trafiło jeszcze do `lib/` ani do `data/zrodla/`.

**Metoda.** Jak w `docs/research/33-wskazowki-partia2.md` i w wyjątku dla wskazówek techniki (CLAUDE.md):
- każde zdanie ma co najmniej 2 przeczytane (WebFetch, 02.11.2026) źródła szczebla 4 z różnych organizacji;
- wariant (inny sprzęt albo pozycja) jest opisany „(wariant: …)”;
- bez liczb (kąty liczbowe, tempo, powtórzenia) i bez uzasadnień zdrowotnych.

**Uzupełnienie briefu koordynatora:**
- strony innych aplikacji treningowych nie są źródłem — pominięte i nigdzie niewpisane;
- zdania zestawu ogólnego (`lib/figures/v2/cue-sets.json`) wpisane tylko wtedy, gdy przeczytane źródła potwierdzają je dla tego ćwiczenia;
- ExRx (403) i web.archive.org (blokada) — nieużywane.

Cytaty ze źródeł są tu najwyżej jednym krótkim fragmentem na źródło. Miejsca podano w JSON.

## 1. Tabela ćwiczeń

| Klucz | Stan | Zdań | Uwagi |
|---|---|---|---|
| Cable Crunch | gotowe | 3 | ACE 331 to wariant stojący, BarBend — klęcząc. `cc.ribs` z zestawu ogólnego zastąpione nowym zdaniem `core_floor.ccMove`: część „biodra w miejscu” ma tylko 1 źródło. `mis.jerk` ma tylko 1 źródło (BarBend). |
| Hollow Hold | gotowe | 4 | Wcześniej „jedno źródło” (docs/33), teraz BarBend + Breaking Muscle. `plank.brace` i `plank.mis.breath` z zestawu ogólnego — niepotwierdzone. |
| Superman | gotowe | 4 | ACE 9 + Cleveland Clinic (nowa organizacja). Zestaw ogólny `cobra.*` pasuje tylko częściowo — patrz „Otwarte”. |
| Decline Crunch | gotowe (warunkowo) | 2 | Catalyst Athletics + ACE 52 jako wariant (zwykły brzuszek na podłodze zamiast ławki skośnej). Do decyzji audytora, czy to wariant, czy analogia. Ustawienie — otwarte. |
| GHD Sit Up | gotowe (warunkowo) | 3 | Catalyst + CrossFit + Garage Strength. Szczebel Garage Strength to propozycja. Ustawienie — otwarte. |
| Sit Up | otwarte | 1 | Tylko ruch ma 2 źródła (normy testów sprawności). Patrz „Otwarte”. |
| V-Up | gotowe | 3 | Catalyst + WebMD. ACE 242 opisuje inny ruch (siad V z progresjami) — nieliczony. `vup.back` ma 1 źródło. `mis.jerk` niepotwierdzone. |
| Bicycle Crunch | gotowe | 5 | ACE 241 + Breaking Muscle + BarBend + Coach. `mis.jerk` („ciężarem”) nie pasuje do ćwiczenia bez obciążenia — zastąpione nowym zdaniem. |
| Lying Leg Raise | gotowe (warunkowo) | 3 | Barbell Logic + Dynamo Fitness (nowe organizacje, szczebel 4 to propozycja). `db.back`, `db.slow` i `mis.jerk` z zestawu ogólnego — niepotwierdzone. |
| Dragon Flag | otwarte | 0 | Jedno źródło (Catalyst). |
| Machine Crunch | gotowe | 3 | Dwie konstrukcje maszyny (wariant): ACE 291 (wałek na piszczele, uchwyty) i Hoist HD-3600 (poduszka na klatce). `cc.ribs` i `mis.jerk` niepotwierdzone. |
| Stability Ball Crunch | gotowe | 5 | ACE 68 + NFPT (nowa organizacja) + NASM Best Abs. |

„Warunkowo” = komplet zależy od uznania szczebla nowej organizacji (Decline Crunch: od uznania wariantu).

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
      {"c": "core_floor.supineReach", "s": [["barbend-hollow-hold", "Setup (legs straightened, arms extended behind head)"], ["breakingmuscle-hollow-body", "Floor setup (arms extended straight overhead)"]]}
    ],
    "move": [
      {"c": "core_floor.hollowMove", "s": [["barbend-hollow-hold", "Position and Form Cues (lower back flat; lift shoulders and legs; hold)"], ["breakingmuscle-hollow-body", "Floor setup (only bum and lower back touching; shoulder blades and legs off the floor)"]]}
    ],
    "tips": [
      {"c": "db.back", "s": [["barbend-hollow-hold", "Position and Form Cues; Common Mistakes (Arched back)"], ["breakingmuscle-hollow-body", "Common mistakes (lower backs peel off the ground)"]]}
    ],
    "mistakes": [
      {"c": "core_floor.mis.legsHigh", "s": [["barbend-hollow-hold", "Common Mistakes (Legs too high)"], ["breakingmuscle-hollow-body", "Common mistakes (feet way too high in the air)"]]}
    ]
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
      {"c": "core_floor.ghdMove", "s": [["catalyst-ghd-sit-up", "opis (lean back, then crunch and sit back up, tightening the quads)"], ["crossfit-ghd-sit-up", "wskazówka trenera (sharply extend the legs while coming up)"], ["garagestrength-ghd-sit-ups", "Tips (push knees toward the ground to flex the quads)"]]}
    ],
    "tips": [
      {"c": "core_floor.ghdDown", "s": [["catalyst-ghd-sit-up", "opis (lean back under control)"], ["garagestrength-ghd-sit-ups", "Mistakes and cautions (don't rush the descent)"]]},
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
      {"c": "core_floor.bikeSetup", "s": [["ace-241", "Step 1"], ["breakingmuscle-bicycle-crunches", "Step 1 (legs bent, feet in the air)"], ["barbend-bicycle-crunch", "Step 1; Common mistakes (hands lightly behind your head)"]]}
    ],
    "move": [
      {"c": "core_floor.bikeMove", "s": [["ace-241", "Steps 2–3"], ["breakingmuscle-bicycle-crunches", "Steps 2–3"], ["coach-bicycle-crunches", "How-to (extend one leg, opposite elbow towards the knee)"]]}
    ],
    "tips": [
      {"c": "crunch.neck", "s": [["ace-241", "wskazówki (don't pull on your head)"], ["barbend-bicycle-crunch", "Common mistakes (Neck strain)"], ["coach-bicycle-crunches", "Form tips (don't pull on your neck)"]]},
      {"c": "crunch.lowBack", "s": [["ace-241", "wskazówki (lower back pressed into the floor)"], ["barbend-bicycle-crunch", "Form tips (lower back pressed into the floor)"], ["coach-bicycle-crunches", "How-to (lower back pressed flat into the floor)"]]}
    ],
    "mistakes": [
      {"c": "core_floor.mis.momentum", "s": [["breakingmuscle-bicycle-crunches", "Common mistakes (Rushing reps)"], ["barbend-bicycle-crunch", "Common mistakes (Excessive speed / momentum)"]]}
    ]
  },
  "Lying Leg Raise": {
    "setup": [
      {"c": "core_floor.llrSetup", "s": [["barbelllogic-lying-leg-raise", "Setup (legs straight)"], ["dynamo-lying-leg-raise", "Setup (lie flat on your back; legs straight)"]]}
    ],
    "move": [
      {"c": "core_floor.llrMove", "s": [["barbelllogic-lying-leg-raise", "Movement (legs straight at 90 degrees at the hips)"], ["dynamo-lying-leg-raise", "Setup; Lowering (90-degree bend at the hips; lower in an arc)"]]}
    ],
    "tips": [
      {"c": "llc.control", "s": [["barbelllogic-lying-leg-raise", "Cues (Slow, controlled movement)"], ["dynamo-lying-leg-raise", "Cue; Mistake to avoid (swinging or jerking motions)"]]}
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
  },
  "Stability Ball Crunch": {
    "setup": [
      {"c": "core_floor.ballSetup", "s": [["ace-68", "Steps 1–2"], ["nfpt-stability-ball-crunch", "Setup (sit on the ball; roll down so mid to low back is on the ball; feet flat)"]]}
    ],
    "move": [
      {"c": "core_floor.ballMove", "s": [["ace-68", "Steps 4–5"], ["nfpt-stability-ball-crunch", "Movement (curl until upper back is off the ball; return slow and controlled)"]]}
    ],
    "tips": [
      {"c": "crunch.neck", "s": [["ace-68", "Step 4 (keep your neck relaxed)"], ["nfpt-stability-ball-crunch", "Common Mistakes (Pulling on the neck)"], ["nasm-best-abs", "Stability Ball Crunch, Coaching Tip"]]},
      {"c": "core_floor.ballStill", "s": [["ace-68", "Steps 4–5 (feet planted; tailbone and lower back in contact with the ball)"], ["nfpt-stability-ball-crunch", "Movement (maintain the lower body position)"]]}
    ],
    "mistakes": [
      {"c": "core_floor.mis.momentum", "s": [["nfpt-stability-ball-crunch", "Common Mistakes (Using momentum)"], ["nasm-best-abs", "Stability Ball Crunch, Coaching Tip (excessive momentum)"]]}
    ]
  }
}
```

Dla każdego gotowego ćwiczenia: po wdrożeniu zmień tryb w `cue-sets.json` z `general` na `own` (decyzja koordynatora/programisty).

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| core_floor.ccSetup | Uklęknij przy wyciągu z liną zawieszoną wysoko; końce liny trzymaj przy głowie. | Kneel at a high cable with a rope; hold the rope ends by your head. |
| core_floor.ccMove | Zwijaj tułów w dół, ściągając żebra w stronę podłogi. | Curl your torso down, rolling your ribs toward the floor. |
| core_floor.supineReach | Połóż się na plecach, nogi wyprostowane, ręce wyciągnięte za głowę. | Lie on your back, legs straight, arms reaching overhead. |
| core_floor.hollowMove | Dociśnij lędźwie do podłogi, unieś łopatki i nogi i trzymaj. | Press your lower back into the floor, lift your shoulder blades and legs, and hold. |
| core_floor.mis.legsHigh | Nogi uniesione za wysoko. | Legs raised too high. |
| core_floor.supermanSetup | Połóż się na brzuchu, nogi wyprostowane, ręce wyciągnięte przed głową. | Lie face down, legs straight, arms stretched out past your head. |
| core_floor.supermanMove | Unieś jednocześnie proste ręce i nogi nisko nad podłogę, chwilę przytrzymaj i powoli opuść. | Lift your straight arms and legs a little off the floor together, hold briefly, then lower slowly. |
| core_floor.headNeutral | Głowa w przedłużeniu tułowia — patrz w podłogę, nie zadzieraj głowy. | Keep your head in line with your body — eyes on the floor, don't lift your head. |
| core_floor.declineMove | Zwijaj tułów, aż górna część pleców oderwie się od ławki; wracaj pod kontrolą. | Curl up until your upper back leaves the bench; lower under control. |
| core_floor.declineLowBack | Dolna część pleców zostaje dociśnięta do ławki. | Keep your lower back pressed into the bench. |
| core_floor.ghdMove | Odchyl się do tyłu, a potem wróć do siadu, mocno prostując nogi. | Lean back, then sit up while driving your legs straight. |
| core_floor.ghdDown | Odchylaj się pod kontrolą, bez opadania. | Lean back under control — don't drop. |
| core_floor.ghdRange | Na początek odchylaj się tylko do poziomu; pełny zakres później. | Start by leaning back only to horizontal; go deeper later. |
| core_floor.vupMove | Jednocześnie unieś tułów i proste nogi, potem opuść je z powrotem. | Lift your torso and straight legs at the same time, then lower back down. |
| core_floor.bikeSetup | Połóż się na plecach, dłonie lekko za głową, nogi uniesione i ugięte w kolanach. | Lie on your back, hands lightly behind your head, legs up with knees bent. |
| core_floor.bikeMove | Przyciągaj kolano do klatki i kieruj do niego przeciwny łokieć, skręcając tułów; drugą nogę prostuj. Zmieniaj strony. | Pull one knee in and turn your torso to bring the opposite elbow toward it while the other leg straightens. Alternate sides. |
| core_floor.mis.momentum | Robienie powtórzeń z rozpędu zamiast pod kontrolą. | Using momentum instead of control. |
| core_floor.llrSetup | Połóż się na plecach z wyprostowanymi nogami. | Lie on your back with your legs straight. |
| core_floor.llrMove | Unieś proste nogi do pionu i powoli je opuść. | Raise your straight legs until vertical, then lower them slowly. |
| core_floor.mcSetup | Ustaw siedzisko i ciężar przed serią. | Set the seat and weight before you start the set. |
| core_floor.mcMove | Napnij brzuch i pochyl tułów do przodu przeciw oporowi maszyny. | Brace your abs and bend your torso forward against the machine. |
| core_floor.ballSetup | Usiądź na piłce, przejdź stopami do przodu i połóż się na niej środkiem pleców; stopy płasko na podłodze. | Sit on the ball, walk your feet out and lie back with your mid-back on it, feet flat on the floor. |
| core_floor.ballMove | Zwijaj tułów, aż górna część pleców oderwie się od piłki; wracaj powoli. | Curl up until your upper back leaves the ball; lower slowly. |
| core_floor.ballStill | Stopy i biodra zostają w miejscu — pracuje tylko tułów. | Feet and hips stay put — only your torso moves. |

Razem 24 nowe zdania. Uwagi:
- „do pionu” w `core_floor.llrMove` opiera się na 2 zgodnych źródłach (90° w biodrach: Barbell Logic, Dynamo).
- „do poziomu” w `core_floor.ghdRange` opiera się na Catalyst („approximately horizontal”) i CrossFit („down to parallel”).
- Oba zdania to położenia, nie liczby w tekście.

Istniejące zdania użyte dla tych ćwiczeń: `cc.slow`, `db.back`, `cobra.control`, `plank.brace`, `crunch.neck`, `crunch.lowBack`, `llc.control`.

## 4. Nowe źródła

| id | adres | organizacja | szczebel |
|---|---|---|---|
| ace-9 | https://www.acefitness.org/resources/everyone/exercise-library/9/supermans/ | ACE | 4 |
| ace-68 | https://www.acefitness.org/resources/everyone/exercise-library/68/stability-ball-sit-ups-crunches/ | ACE | 4 |
| ace-241 | https://www.acefitness.org/resources/everyone/exercise-library/241/supine-bicycle-crunches/ | ACE | 4 |
| ace-291 | https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/ | ACE | 4 |
| ace-331 | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | ACE | 4 |
| cc-superman | https://health.clevelandclinic.org/got-back-pain-try-superman-3-exercises (10.05.2021; cytowani PT i fizjolog wysiłku) | Cleveland Clinic | 4 |
| barbend-cable-crunch | https://www.barbend.com/cable-crunch/ (E. Bugera, CSCS, akt. 27.11.2024) | BarBend | 4 |
| barbend-hollow-hold | https://barbend.com/hollow-hold (J. Dickson, NASM-CPT, akt. 17.07.2024) | BarBend | 4 |
| barbend-bicycle-crunch | https://www.barbend.com/bicycle-crunch/ (A. Nelson, akt. 20.11.2024) | BarBend | 4 |
| breakingmuscle-hollow-body | https://breakingmuscle.com/the-hollow-body-the-most-important-skill-to-master/ (E. Beers, akt. 22.11.2021) | Breaking Muscle | 4 |
| breakingmuscle-bicycle-crunches | https://breakingmuscle.com/bicycle-crunches/ (C. Colucci, akt. 11.07.2023) | Breaking Muscle | 4 |
| coach-bicycle-crunches | https://www.coachweb.com/exercises/lose-weight/1716/bicycle-crunches (N. Harris-Fry, akt. 20.07.2023) | Coach | 4 |
| catalyst-v-up | https://www.catalystathletics.com/exercise/313/V-Up/ | Catalyst Athletics | 4 (propozycja) |
| catalyst-decline-crunch | https://catalystathletics.com/exercise/704/Decline-Crunch/ | Catalyst Athletics | 4 (propozycja) |
| catalyst-ghd-sit-up | https://catalystathletics.com/exercise/487/GHD-Sit-up/ | Catalyst Athletics | 4 (propozycja) |
| crossfit-ghd-sit-up | https://www.crossfit.com/essentials/the-glute-ham-developer-sit-up (G. Glassman; CrossFit Journal 2005, wersja www 09.07.2022) | CrossFit | 4 (propozycja) |
| garagestrength-ghd-sit-ups | https://www.garagestrength.com/blogs/news/ghd-sit-ups (bez autora i daty) | Garage Strength | 4 (propozycja) |
| webmd-v-ups | https://www.webmd.com/fitness-exercise/how-to-do-v-ups (A. Twu; recenzja lek. T. Wheeler, MD, 08.12.2024) | WebMD | 4 (propozycja) |
| barbelllogic-lying-leg-raise | https://barbell-logic.com/?p=87094 (bez autora i daty) | Barbell Logic | 4 (propozycja) |
| dynamo-lying-leg-raise | https://blog.dynamofitness.com.au/?p=2798 („The Dynamo Fitness Team”, bez daty) | Dynamo Fitness | 4 (propozycja) |
| hoist-hd-3600 | https://www.hoistfitness.com/pages/hd-3600-ab-crunch-low-back | Hoist Fitness | 4 |
| nfpt-stability-ball-crunch | https://nfpt.com/stability-ball-crunch/ (E. Nitschke, 10.08.2025) | NFPT | 4 |

Źródła przeczytane, ale użyte tylko w sekcji „Otwarte” (nie do `sources`, chyba że koordynator zechce je zachować):
- `catalyst-dragon-flag` — https://catalystathletics.com/exercise/564/Dragon-Flag/
- `crossfit-anchored-sit-up` — https://www.crossfit.com/sport/cfg21-foundations-su (30.03.2021)
- `nysp-sit-ups` — https://joinstatepolice.ny.gov/sit-ups
- `ace-242` — https://www.acefitness.org/resources/everyone/exercise-library/242/v-ups/

Istniejące źródła użyte ponownie: `ace-52`, `nasm-best-abs`.

### Propozycje nowych `orgs`

| Klucz | name (propozycja) | level | kind |
|---|---|---|---|
| Cleveland Clinic | Cleveland Clinic — Health Essentials (materiał edukacyjny szpitala; jak HSS) | 4 | site |
| Catalyst Athletics | Catalyst Athletics — Exercise Library (szkolenie trenerów podnoszenia ciężarów) | 4 | site |
| CrossFit | CrossFit — materiały szkoleniowe organizacji szkolącej trenerów | 4 | org |
| NFPT | National Federation of Professional Trainers — organizacja certyfikująca trenerów (nfpt.com) | 4 | org |
| Hoist Fitness | Hoist Fitness — instrukcja maszyny producenta | 4 | maker |
| WebMD | WebMD — artykuły z recenzją lekarza (wydawca medyczny) | 4 (do decyzji audytora; por. WebMD Ignite w docs/33) | site |
| Barbell Logic | Barbell Logic — firma szkoleniowa trenerów siłowych (barbell-logic.com) | 4 (do decyzji audytora; strona bez autora) | site |
| Dynamo Fitness | Dynamo Fitness (Australia) — blog dostawcy sprzętu | 4 (do decyzji audytora; producent czy sprzedawca — niesprawdzone) | maker |
| Garage Strength | Garage Strength — blog firmy treningowej | 4 (do decyzji audytora; bez autora) | site |

## 5. Otwarte

**Ćwiczenia otwarte**

1. **Sit Up — otwarte.** Tylko ruch („z leżenia do siadu i z powrotem do łopatek na podłodze”) ma 2 źródła: CrossFit — Anchored Sit-up i NY State Police — sit-ups. Oba to normy testów sprawności, nie przewodniki techniki. Źródła różnią się w kilku punktach:
   - ustawienie: stopy zaczepione (CrossFit) albo pięty na podłodze (NYSP);
   - ręce: nad głową (CrossFit) albo splecione za głową (NYSP).

   Z zestawu ogólnego `crunch.neck` i `mis.jerk` są niepotwierdzone — możliwy błąd zestawu ogólnego. Strony z przewodnikami, które pojawiły się w wyszukiwarce, należą do aplikacji albo są zablokowane (403).
2. **Dragon Flag — otwarte.** Jedno źródło: Catalyst. Opisuje ławkę, chwyt przy głowie, ciało proste na górnej części pleców i opuszczanie w linii prostej. Drugie źródło nie znalezione (strona Invictus nie opisuje ćwiczenia; pozostałe wyniki to aplikacje). Dziś tryb `open` — bez zmian.

**Brakujące sekcje w ćwiczeniach gotowych**

3. **Decline Crunch — ustawienie.** Tylko Catalyst opisuje ławkę skośną, stopy zaczepione i palce przy skroniach. `crunch.neck` (zestaw ogólny) ma tylko ACE 52 (wariant) — możliwy błąd zestawu ogólnego.
4. **Decline Crunch — wariant czy analogia.** Czy zwykły brzuszek na podłodze (ACE 52) to wariant brzuszka na ławce skośnej (inny sprzęt), czy analogia? Do decyzji audytora. Jeśli analogia — ćwiczenie wraca do „otwarte”.
5. **GHD Sit Up — ustawienie.** Catalyst: poduszka pod górną częścią ud z tyłu. Garage Strength: stopy zablokowane, twarz do sufitu. Każde po jednym źródle.

**Zdania zestawu ogólnego niepotwierdzone (możliwe błędy zestawu ogólnego)**

6. **`mis.jerk`** („Szarpanie i rzucanie ciężarem…”) przy ćwiczeniach bez obciążenia: Bicycle Crunch, Decline Crunch, Sit Up, V-Up, Lying Leg Raise. Słowo „ciężarem” nie pasuje do ćwiczeń bez obciążenia. Dla Cable Crunch i Machine Crunch brak 2 źródeł (Cable Crunch: tylko BarBend „body English”).
7. **`cc.ribs`** (Cable Crunch, Machine Crunch): część „biodra zostają w miejscu” ma przy wyciągu tylko BarBend. Przy maszynie ACE 291 mówi o biodrach przy oparciu, a o żebrach nie mówi żadne ze źródeł.
8. **Hollow Hold:** `plank.brace` i `plank.mis.breath` — w przeczytanych źródłach brak wzmianki o oddechu. O napięciu brzucha jest tylko pośrednio: „pull your ribcage down” / „contracting the abs”. Nie wpisane.
9. **Superman:**
   - `cobra.hips` („Biodra zostają na podłodze”) — żadne źródło nie mówi tego wprost.
   - `cobra.mis` („Wyginanie pleców na siłę, za wysoko”) — „bez wyginania” mówi tylko ACE. „Kilka cali” wysokości podają oba źródła, ale CC tylko „na początek”. Nie wpisane.
10. **V-Up:**
    - `vup.back` — tylko WebMD (błąd: wyginanie lub garbienie lędźwi).
    - ACE 242 o podobnej przestrodze opisuje siad V z progresjami, więc nie liczy się jako wariant.
11. **Lying Leg Raise:**
    - `db.back` (lędźwie przy podłodze) — tylko Barbell Logic.
    - `db.slow` — część „oddychaj normalnie” bez źródła (Dynamo każe wdech przy opuszczaniu).

**Szczeble źródeł**

12. Do decyzji audytora (pytanie w stylu docs/33, pyt. 1): Barbell Logic, Dynamo Fitness, Garage Strength, WebMD, Catalyst Athletics, CrossFit. Od tego zależą:
    - Lying Leg Raise — oba źródła z tej listy;
    - GHD Sit Up — Catalyst + CrossFit;
    - V-Up — Catalyst + WebMD;
    - Decline Crunch — Catalyst.

## Stan

**Zrobione:** wszystkie 12 ćwiczeń przejrzane.
- Gotowe: 10. Bez warunku: Cable Crunch, Hollow Hold, Superman, V-Up (zależy od szczebla Catalyst/WebMD), Bicycle Crunch, Machine Crunch, Stability Ball Crunch. Warunkowo: Decline Crunch, GHD Sit Up, Lying Leg Raise.
- Otwarte: 2 — Sit Up, Dragon Flag.

**Zostało:**
- decyzje audytora — punkty 4 i 12 w „Otwarte”;
- przegląd nowych zdań przez recenzenta lokalizacji;
- wpis do `cues.json` / `pl.json`, `claims.mjs --stub` i zmiana trybu w `cue-sets.json` (programista);
- poprawa zestawów ogólnych dla ćwiczeń otwartych (punkty 6–11).

**Następny krok przy kontynuacji:** drugie źródło dla Dragon Flag i Sit Up. Warto sprawdzić:
- materiały uczelniane HKU/Western (szczebel otwarty);
- stronę Coach z ćwiczeniami na brzuch (https://www.coachweb.com/exercises/abs-exercises) — dalsza, ucięta część listy;
- inne strony Catalyst (np. sit-up).

**Pułapki dostępu (02.11.2026):**
- exrx.net — 403; web.archive.org zablokowane.
- NASM: biblioteka ćwiczeń nie ma stron dla tych ćwiczeń (mapa `nasm.org/sitemap.xml`: z brzucha tylko dead-bug, plank, side-plank, russian-twist, reverse-crunch-to-knee-up-with-rotation, floor-prone-cobra).
- barbend.com i breakingmuscle.com — część adresów ze „zgadniętym” slugiem daje 404; lepiej szukać przez wyszukiwarkę.
- bodybuilding.com przekierowuje do sklepu; muscleandstrength.com — 403.
- Strona Body-Solid nie ma instrukcji ćwiczeń.
- Strona „superman” Health and Wellbeing Queensland opisuje w rzeczywistości ruch z klęku podpartego (inne ćwiczenie) — nieużyta.
