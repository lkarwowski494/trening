# Wskazówki techniki — fala W2, rodzina core_floor (część 1)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — dane do wpisania przez koordynatora albo programistę; nic nie trafiło do `lib/` ani `data/zrodla/`.

Zakres: plik W1 `core_floor-1` — (a) ćwiczenia „otwarte” (Sit Up, Lying Leg Raise, Dragon Flag, Stability Ball Crunch) zbadane od nowa; (b) ćwiczenia „gotowe” z W1 bez żadnego błędu (wszystkie 8 kart W1 miały `"mistakes": []`) — dopisane błędy. Role mięśni — poza zakresem (inny badacz).

Metoda: źródła przeczytane przez WebFetch 02.11.2026; szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md` (z uzupełnieniami 2–3). Błędy: „ze źródeł” = 2 niezależne źródła szczebla 4 albo reguła „błąd = zaprzeczenie standardu” (źródło podaje standard tej samej części ciała i kryterium); „wniosek” = logiczne zaprzeczenie potwierdzonego zdania ustawienia/ruchu/wskazówki tego ćwiczenia. Bez liczb i bez uzasadnień zdrowotnych. Cytaty — najwyżej jeden krótki fragment na źródło.

## 1. Tabela ćwiczeń

| Klucz | Stan | Zdania | Uwagi |
|---|---|---|---|
| Stability Ball Crunch | **gotowe (warunkowo)** | 6 | ACE 68 + NFPT (artykuł E. Nitschke, 10.08.2025). Warunek: koordynator przyjmuje szczebel 4 dla tej strony NFPT (kwalifikacje autorki z biogramu na stronie ACE, nie NFPT — Otwarte 1). Błędy: `mis.momentum` (NFPT + NASM), `mis.ballPos` (NFPT + ACE 68 — zaprzeczenie standardu). |
| Sit Up | **gotowe** | 3 | Catalyst 432 + BarBend (J. Dickson, NASM-CPT, 26.11.2024). `situpMove` z nowym brzmieniem (część wspólna — Otwarte 2). Błąd `mis.situpFeet` (BarBend + Catalyst — zaprzeczenie standardu). |
| Lying Leg Raise | otwarte | 0 | Tylko Catalyst 563 (wersja naprzemienna) na szczeblu 4. Pozostałe znalezione: Physitrack, strony aplikacji, Barbell Logic/Dynamo (5), strony rehabilitacyjne o unoszeniu jednej nogi (inne ćwiczenie). |
| Dragon Flag | otwarte | 0 | Tylko Catalyst 564. Breaking Muscle (autor CSCS) = 5 zawsze; reszta wyników — strony aplikacji i serwisy bez autora. |
| Cable Crunch | gotowe (W1) + 2 błędy | +2 | `mis.ccArms` (BarBend + ACE 331 — zaprzeczenie standardu), `mis.fastReturn` (ACE 331 + BarBend). |
| Hollow Hold | gotowe (W1) + 1 błąd | +1 | `mis.lowBackUp` (BarBend „Arched back” + Catalyst — zaprzeczenie standardu). |
| Superman | gotowe (W1) + 2 błędy | +2 | `mis.headUp`, `cobra.mis` (ACE 9 + Cleveland Clinic — zaprzeczenie standardu). |
| Decline Crunch | gotowe warunkowo (W1) + 1 błąd | +1 | `mis.lowBackUp` — wniosek z `core_floor.declineLowBack` (ACE 52 to wariant/analogia do decyzji audytora, więc nie liczę go jako drugiego źródła błędu). |
| GHD Sit Up | gotowe (W1) + 1 błąd | +1 | `mis.ghdDeep` — wniosek z `core_floor.ghdRange`. |
| V-Up | gotowe (W1) + 1 błąd | +1 | `mis.vupKnees` (WebMD + Catalyst — zaprzeczenie standardu). |
| Bicycle Crunch | gotowe (W1) + 1 błąd | +1 | `mis.lowBackUp` (ACE 241 + BarBend — zaprzeczenie standardu). Pytanie W1 o brak zdania `move` — bez zmian. |
| Machine Crunch | gotowe (W1) + 1 błąd | +1 | `mis.fastReturn` (ACE 291 + Hoist — zaprzeczenie standardu). |

Wynik: ćwiczeń zbadanych 12; gotowe z błędem 10 (w tym warunkowo: Stability Ball Crunch, Decline Crunch); otwarte 2 (Lying Leg Raise, Dragon Flag); częściowe 0.

Uwaga o powtórzeniu treści: błąd będący zaprzeczeniem wskazówki z tej samej karty (np. `crunch.lowBack` i `mis.lowBackUp` przy Bicycle Crunch) mówi to samo z drugiej strony. Celowo nie dodałem `mis.pullHead` przy kartach, które już mają `crunch.neck` — patrz Otwarte 5.

### Blok do wdrożenia

Dla kart W1 — tylko nowe pozycje `mistakes` (do dopisania do istniejących wpisów). Stability Ball Crunch i Sit Up — pełne karty.

```json
{
  "Stability Ball Crunch": {
    "setup": [
      {"c": "core_floor.ballSetup", "s": [["ace-68", "Step 1 (sit on the ball, walk out, mid-back on top of the ball, feet flat)"], ["nfpt-stability-ball-crunch", "Starting Position (sit on the ball, feet flat; roll down so the mid to low back is on the ball)"]]}
    ],
    "move": [
      {"c": "core_floor.ballMove", "s": [["ace-68", "Steps 3–4 (curl up until your upper back is lifted off the ball; slowly uncurl)"], ["nfpt-stability-ball-crunch", "Upward Phase; Downward Phase (upper back off the ball; return slow and controlled)"]]}
    ],
    "tips": [
      {"c": "core_floor.ballStill", "s": [["ace-68", "Steps 3–4 (keep feet planted, tailbone and low back on the ball)"], ["nfpt-stability-ball-crunch", "Upward Phase (maintain the lower body position)"]]},
      {"c": "crunch.neck", "s": [["ace-68", "Step 3 (neck stays relaxed)"], ["nasm-best-abs", "Stability Ball Crunch, Coaching Tip (avoid pulling on the neck)"], ["nfpt-stability-ball-crunch", "Common Errors (Pulling on the neck)"]]}
    ],
    "mistakes": [
      {"c": "core_floor.mis.momentum", "s": [["nfpt-stability-ball-crunch", "Downward Phase; Common Errors (Using momentum)"], ["nasm-best-abs", "Stability Ball Crunch, Coaching Tip (excessive momentum)"]]},
      {"c": "core_floor.mis.ballPos", "s": [["nfpt-stability-ball-crunch", "Common Errors (Sitting too low or too far back on the ball)"], ["ace-68", "Step 1 (mid-back on the top of the ball) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Sit Up": {
    "setup": [
      {"c": "crunch.setup", "s": [["catalyst-sit-up", "opis (knees and hips bent, feet flat; fingers at the sides of the head)"], ["barbend-sit-up", "How to — setup (bend your knees; heels in the floor; hands behind your head)"]]}
    ],
    "move": [
      {"c": "core_floor.situpMove", "s": [["catalyst-sit-up", "opis (squeeze the abs, sit up completely; return maintaining tension)"], ["barbend-sit-up", "How to — movement and lowering (pull the torso up with the abs; lower slowly)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "core_floor.mis.situpFeet", "s": [["barbend-sit-up", "Common Mistakes (Swinging Your Feet)"], ["catalyst-sit-up", "opis (feet flat on the floor) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Cable Crunch": {
    "mistakes": [
      {"c": "core_floor.mis.ccArms", "s": [["barbend-cable-crunch", "Form Cues (arms only hold the rope, not involved in the movement)"], ["ace-331", "Steps 3–4, 6 (hands by the ears; roll the rib cage down against the cable) — błąd = zaprzeczenie standardu"]]},
      {"c": "core_floor.mis.fastReturn", "s": [["ace-331", "Step 6 (slowly returning to the top)"], ["barbend-cable-crunch", "Reset (slowly straighten your torso) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Hollow Hold": {
    "mistakes": [
      {"c": "core_floor.mis.lowBackUp", "s": [["barbend-hollow-hold", "Common Mistakes (Arched back)"], ["catalyst-hollow-hold", "opis (push your lower back flat into the floor) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Superman": {
    "mistakes": [
      {"c": "core_floor.mis.headUp", "s": [["ace-9", "Step 2 (avoiding any ... raising of your head)"], ["cc-superman", "wskazówki (keep your neck in a neutral position) — błąd = zaprzeczenie standardu"]]},
      {"c": "cobra.mis", "s": [["ace-9", "Step 2 (a few inches off the floor; avoiding any arching in your back)"], ["cc-superman", "instrukcja (only a few inches at first) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Decline Crunch": {
    "mistakes": [
      {"c": "core_floor.mis.lowBackUp", "s": [["wniosek", "core_floor.declineLowBack"]]}
    ]
  },
  "GHD Sit Up": {
    "mistakes": [
      {"c": "core_floor.mis.ghdDeep", "s": [["wniosek", "core_floor.ghdRange"]]}
    ]
  },
  "V-Up": {
    "mistakes": [
      {"c": "core_floor.mis.vupKnees", "s": [["webmd-v-ups", "How to do V-ups, krok 3 (keep both your arms and legs straight)"], ["catalyst-v-up", "opis (lift your straight legs) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Bicycle Crunch": {
    "mistakes": [
      {"c": "core_floor.mis.lowBackUp", "s": [["ace-241", "wskazówki (lower back pressed into the floor)"], ["barbend-bicycle-crunch", "Form tips (lower back pressed into the floor) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Machine Crunch": {
    "mistakes": [
      {"c": "core_floor.mis.fastReturn", "s": [["ace-291", "Step 4 (return slowly to the starting position)"], ["hoist-hd-3600", "Ab Crunch — return (slowly return to the start position) — błąd = zaprzeczenie standardu"]]}
    ]
  }
}
```

Po wdrożeniu: Stability Ball Crunch i Sit Up — tryb `own` w `cue-sets.json` (decyzja koordynatora/programisty); karty W1 — teraz mają błąd, więc spełniają warunek rodzin z pozami v2.

## 2. Nowe zdania

| id | PL | EN (propozycja) | uwagi |
|---|---|---|---|
| core_floor.ballSetup | Usiądź na piłce, przejdź stopami do przodu i połóż się na niej środkiem pleców; stopy płasko na podłodze. | Sit on the ball, walk your feet out and lie back with your mid-back on it, feet flat on the floor. | kandydat W1, teraz 2 źródła |
| core_floor.ballMove | Zwijaj tułów, aż górna część pleców oderwie się od piłki; wracaj powoli. | Curl up until your upper back leaves the ball; lower slowly. | kandydat W1 |
| core_floor.ballStill | Stopy i biodra zostają w miejscu — pracuje tylko tułów. | Feet and hips stay put — only your torso moves. | kandydat W1 |
| core_floor.situpMove | Napnij brzuch i unieś tułów aż do siadu; do leżenia wracaj powoli. | Brace your abs and come all the way up to sitting; lower back down slowly. | **zmienione brzmienie** kandydata W1 („zwiń tułów” usunięte — Otwarte 2) |
| core_floor.mis.momentum | Robienie powtórzeń z rozpędu zamiast pod kontrolą. | Using momentum instead of control. | kandydat W1; tu tylko dla Stability Ball Crunch |
| core_floor.mis.ballPos | Leżenie za nisko albo za daleko na piłce — środek pleców nie jest na jej szczycie. | Lying too low or too far back on the ball — your mid-back isn't on top of it. | |
| core_floor.mis.situpFeet | Wymach nogami — stopy odrywają się od podłogi. | Swinging your legs so your feet leave the floor. | |
| core_floor.mis.ccArms | Ciągnięcie liny rękami zamiast zwijania tułowia. | Pulling the rope down with your arms instead of curling your torso. | |
| core_floor.mis.fastReturn | Puszczanie ciężaru do góry zamiast powolnego powrotu. | Letting the weight pull you back up instead of returning slowly. | Cable Crunch, Machine Crunch |
| core_floor.mis.lowBackUp | Lędźwie odrywają się od podłoża. | Lower back lifting off the floor or bench. | Hollow Hold, Decline Crunch, Bicycle Crunch |
| core_floor.mis.headUp | Zadzieranie głowy. | Lifting your head up. | Superman |
| core_floor.mis.ghdDeep | Od razu odchylanie się dużo poniżej poziomu. | Leaning back far below horizontal right away. | GHD Sit Up |
| core_floor.mis.vupKnees | Uginanie kolan zamiast unoszenia prostych nóg. | Bending your knees instead of lifting straight legs. | V-Up |

Istniejące zdania użyte: `crunch.setup`, `crunch.neck`, `cobra.mis`. Razem nowych w użyciu: 13 (w tym 5 kandydatów W1). Wszystkie do przeglądu przez recenzenta lokalizacji.

## 3. Źródła

| id | adres | organizacja | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|---|
| ace-68 | https://www.acefitness.org/resources/everyone/exercise-library/68/stability-ball-sit-ups-crunches/ | ACE | 4 — organizacja certyfikująca trenerów, treść firmowana przez ACE | Steps 1–4 |
| nfpt-stability-ball-crunch | https://nfpt.com/?p=5089 („The Stability Ball Crunch”, E. Nitschke, 10.08.2025) | NFPT | **4 warunkowo** — NFPT = 4 przy autorze, dacie i kwalifikacjach w biogramie. Autor i data na stronie; kwalifikacje (EdD, NFPT-CPT, NSCA-CPT; członkini Scientific Advisory Panel ACE) przeczytane na https://www.acefitness.org/about-ace/our-team/scientific-advisory/erin-nitschke — strona zespołu NFPT zwróciła 404. W1 dał 5 (brak kwalifikacji na stronie). Do decyzji koordynatora (Otwarte 1). | Starting Position; Upward Phase; Downward Phase; Common Errors |
| nasm-best-abs | https://www.nasm.org/resource-center/blog/training/best-abs-exercises (H. Cherry, CPT, akt. 23.07.2026) | NASM | 4 — istniejące źródło w `cues.json` | sekcja Stability Ball Crunch, Coaching Tip: „Avoid pulling on the neck or using excessive momentum.” |
| catalyst-sit-up | https://catalystathletics.com/exercise/432/Sit-Up/ | Catalyst Athletics | 4 (rozstrzygnięcie koordynatora) | opis: „Squeeze the abs to crunch the trunk and then sit up completely.” |
| barbend-sit-up | https://barbend.com/sit-up/ („How to Perform a Picture-Perfect Sit-Up for Stronger Abs”, J. Dickson, NASM-CPT, USAW-L2, akt. 26.11.2024) | BarBend | 4 — artykuł o technice z autorem z kwalifikacjami i datą (bez znacznika „Expert Verified”) | How to (setup, movement, lowering); Common Mistakes: „Swinging Your Feet” |
| ace-331, ace-291, ace-9, ace-241 | jak w W1 | ACE | 4 | ace-331 Steps 3–6; ace-291 Step 4 („Return slowly to the starting position.”); ace-9 Step 2 („…avoiding any arching in your back or raising of your head.”); ace-241 wskazówki (W1) |
| barbend-cable-crunch | jak w W1 (E. Bugera, CSCS, 27.11.2024) | BarBend | 4 | Form Cues: ręce „by no means should be involved in the actual movement”; Reset |
| barbend-hollow-hold, barbend-bicycle-crunch | jak w W1 | BarBend | 4 | Common Mistakes (Arched back); Form tips (W1) |
| catalyst-hollow-hold, catalyst-v-up | jak w W1 | Catalyst Athletics | 4 | opis |
| cc-superman | jak w W1 | Cleveland Clinic | 4 (system ochrony zdrowia) | instrukcja, wskazówki (W1) |
| webmd-v-ups | https://www.webmd.com/fitness-exercise/how-to-do-v-ups (recenzja lek., 08.12.2024) | WebMD | 4 | krok 3: „Keep both your arms and legs straight.” |
| hoist-hd-3600 | https://www.hoistfitness.com/pages/hd-3600-ab-crunch-low-back | Hoist Fitness | 4 (producent tej maszyny) | Ab Crunch — „slowly return to the start position” |

Przeczytane, nieliczone:
- `catalyst-alt-lying-leg-raise` — https://catalystathletics.com/exercise/563/-Alternating-Lying-Leg-Raise (4; jedyne źródło LLR, wersja naprzemienna).
- Pfizer Health Answers — https://healthanswers.pfizer.com/physical-activity/strength-muscle/how-to-do-sit-ups — 5 (brak autora, recenzenta i daty; wydawca — firma farmaceutyczna, nie placówka ochrony zdrowia).
- DMC (Detroit Medical Center) — https://www.dmc.org/campaigns/sports-med/sports-performance-library/sports-performance/how-to-do-a-sit-up-correctly — 403, nieprzeczytane (wg wyszukiwarki tylko film).
- The Prehab Guys „Sit Up – Feet Unsupported” — przekierowanie do logowania, nieprzeczytane.
- https://barbend.com/?p=60035 — strona główna BarBend, nie artykuł; https://barbend.com/lying-leg-raise/ — 404.

## 4. Otwarte i pytania do koordynatora

1. **Szczebel `nfpt-stability-ball-crunch`.** Czy biogram autorki na stronie innej organizacji (ACE) spełnia warunek „kwalifikacje w biogramie” dla NFPT? Dodatkowo: autorka jest w panelu doradczym ACE, a drugim źródłem ustawienia i ruchu jest ACE 68 — organizacje różne (NFPT/Summit Professional Education vs ACE), ale wspólna osoba. Jeśli koordynator uzna zależność albo 5 — Stability Ball Crunch wraca do „otwarte” (zostaje tylko `crunch.neck`, ACE 68 + NASM, i `mis.momentum` traci drugie źródło).
2. **Sit Up — różnica między źródłami (część wspólna w `situpMove`).** Catalyst: „crunch the trunk and then sit up completely”; BarBend: błąd „Curling Your Spine” i opuszczanie „leading with your shoulders rather than curving your lower back”. Zdanie mówi tylko część wspólną (napięty brzuch, pełny siad, powolny powrót), bez rozstrzygania zaokrąglenia pleców. Też różnica: kolana „slightly bent” (BarBend) vs stopy płasko z ugiętymi kolanami i biodrami (Catalyst); stopy zaczepione — Catalyst dopuszcza, BarBend nie wspomina. Figura v2 nie powinna pokazywać mocnego zaokrąglenia ani zaczepionych stóp.
3. **Lying Leg Raise — otwarte.** Jedyne źródło szczebla 4: Catalyst 563 (wersja naprzemienna: lędźwie dociśnięte, prosta noga do pionu, pięta nie dotyka podłogi). Brak drugiego (ACE, NASM, BarBend — brak strony; strony szpitali opisują unoszenie jednej nogi z drugą ugiętą — inne ćwiczenie).
4. **Dragon Flag — otwarte.** Jedyne źródło szczebla 4: Catalyst 564. Następny krok: książka uznanego autora (szczebel 3, np. kalistenika) albo organizacja szkoląca trenerów kalisteniki.
5. **`mis.pullHead` niewprowadzony.** Przy Bicycle Crunch (ACE 241 + BarBend „Neck strain”) i Stability Ball Crunch (NFPT + NASM) błąd „ciągnięcie głowy rękami” ma 2 źródła, ale powtarza wskazówkę `crunch.neck` z tej samej karty. Jeśli koordynator woli błąd o szyi zamiast o lędźwiach przy Bicycle Crunch — zdanie PL „Ciągnięcie głowy rękami.” / EN „Pulling on your head with your hands.”.
6. **Decline Crunch i GHD — błędy tylko z wniosku.** `mis.lowBackUp` (Decline) zależy od decyzji o ACE 52 (W1, Otwarte 5); `mis.ghdDeep` — wniosek z `ghdRange` (Catalyst Tips i CrossFit „Faults and warnings” podają standard; nie czytałem ich ponownie w tej sesji — miejsca z W1).
7. **Machine Crunch, ACE 291:** strona każe „pull down on [the handles] to lean forward” — dlatego dla maszyny NIE proponuję błędu „ciągnięcie rękami” (inaczej niż przy wyciągu).

## Stan

- Zrobione: wszystkie 4 otwarte ćwiczenia z W1 zbadane (2 → gotowe, 2 zostają otwarte); wszystkie 8 kart W1 dostało ≥ 1 błąd.
- Zostało: decyzje z Otwarte 1, 2, 6; drugie źródło dla Lying Leg Raise i Dragon Flag; przegląd zdań przez recenzenta lokalizacji; wpis do `cues.json`/`pl.json` i `claims.mjs --stub` (programista).
- Pułapki: dmc.org — 403; The Prehab Guys — logowanie; barbend „zgadnięte” slugi — 404 albo strona główna (`?p=` kieruje na stronę główną); strona zespołu NFPT — 404.
