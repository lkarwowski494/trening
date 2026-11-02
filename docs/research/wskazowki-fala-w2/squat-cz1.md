# Wskazówki techniki — rodzina `squat`, część 1 (fala W2)

- Data: 02.11.2026
- Rodzina: `squat` (status rodziny `ready`), część 1 — ćwiczenia z pliku W1 `squat-cz1.md` (gałąź badania/g4-nogi)
- Status: PROPOZYCJA — do integracji przez koordynatora linii 1.1
- Autor: badacz-merytoryczny (fala W2)

Podstawa: stan po W1 z pliku `przeliczenie-szczebli-2026-11-02.md` (gałąź badania/g4-nogi, sekcja „squat-cz1.md”) — nadrzędny wobec
„Korekty szczebli” w `squat-cz1.md`. Szczeble wg `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211).
Rodzina `squat` ma status `ready`, więc karta własna liczy się tylko z ≥ 1 błędem; bez błędu karty nie proponuję.
Rodzina `squat` nie ma pliku póz v2 (`lib/figures/v2/poses/` — brief: „wszystkie poza squat/hinge”), stąd kolumna „poza v2” = nie.

Reguły użyte w W2 (brief W2-G4): wariant sprzętu może korzystać ze źródeł wersji bazowej — oznaczone `uproszczenie: wariant sprzętu <baza>`
w polu miejsca źródła; błąd wnioskowany = logiczne zaprzeczenie potwierdzonego zdania tego ćwiczenia (`["wniosek", "<id>"]`).

## 1. Ćwiczenia

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Barbell Hack Squat | nie | gotowe z błędem | błąd wnioskowany `sq.mis.roundBack` (z `hinge.back` + BarBend „Rounding”); miejsce BarBend poprawione na „How to Do the Hack Squat” (przeliczenie, wiersz squat-cz1) | zestaw ogólny `hingeFloor` nie pasuje — decyzja koordynatora (W1, „Otwarte”) |
| Bodyweight Squat | nie | **gotowe z błędem** | drugie źródło szczebla 4: ISSA (`issa-mastering-squat`) → `gob.stance`, `sq.down`, `sq.kneesToes`, `sq.mis.kneesIn`; `sq.mis.heels` (ACE wprost + wniosek z `sq.down`) | `sq.back` — tylko ACE (ISSA nie mówi o klatce) |
| Dumbbell Squat | nie | **gotowe z błędem (uproszczenie)** | `uproszczenie: wariant sprzętu Bodyweight Squat` — ACE #135 + ISSA obok BarBend | zdanie o trzymaniu hantli (`dbsq.setup`) — tylko BarBend |
| Overhead Squat | nie | **gotowe z błędem** | Catalyst Athletics (#79) + ISSA (przysiad z rękami nad głową, wariant bez sztangi); nowe brzmienie `ohs.setup`, `ohs.move`; błędy `ohs.mis.armsForward`, `sq.mis.heels` | `sq.mis.kneesIn` — tylko ISSA |
| Zercher Squat | nie | **gotowe z błędem** | błąd wnioskowany `sq.mis.chestDrop` (z `gob.close` + BarBend „Torso”) — domyka dane częściowe W1 | druga wskazówka (`sq.back`, `zer.tense`) — po jednym źródle |
| Double Kettlebell Front Squat | nie | **gotowe z błędem** | błąd wnioskowany `kbfs.mis.drop` (z `kbfs.move` + BarBend „any loss of position”) | wskazówki (`hinge.back`, `kbfs.lockout`) — tylko ACE |
| Box Squat | nie | otwarte | sprawdzono Training & Conditioning (2017) — bez autora strony, przedruk kroków M. Galbraith (CSCS) — nie liczę (niżej) | drugie źródło szczebla 4 |
| Smith Machine Squat | nie | otwarte | — (nie szukano ponownie; limit kontekstu) | drugie źródło szczebla 4 dla `smith.setup`; ruch na prowadnicy różni się od przysiadu wolnego — wariant sprzętu nie wystarczy |
| Sumo Squat (hantel) | nie | otwarte | sprawdzono The Prehab Guys (`sumo-squat-dumbbell-2`) — bez autora (5), hantel przy klatce, nie między nogami | drugie źródło szczebla 4 |
| Landmine Squat | nie | otwarte | — | 2 źródła szczebla 4 |
| Cable Squat | nie | otwarte | — | 2 źródła szczebla 4 |
| One-Arm Overhead Kettlebell Squat | nie | otwarte | — | 2 źródła o przysiadzie z kettlebellem nad głową przez cały ruch + decyzja, który wariant oznacza katalog |
| Dip Belt Squat | nie | otwarte | — | drugie źródło szczebla 4 |

Ćwiczeń w zakresie: 13. Gotowe z błędem: 6 (Barbell Hack Squat — z W1, + 5 nowych). Otwarte: 7.

Uwaga do zestawu ogólnego: przy Double Kettlebell Front Squat karta używa `kbfs.move`, nie `sq.down` („cofając biodra”), zgodnie z uwagą W1
(źródło szczebla 5 opisuje zejście prosto w dół; przeczytane źródła szczebla 4 nie potwierdzają cofania bioder). Karta własna zastępuje zestaw ogólny.

### Blok do wdrożenia

Zależność: zdania `bhs.setup`, `zer.hold`, `kbfs.rack`, `kbfs.move` są propozycjami z W1 (`squat-cz1.md`, sekcja „Nowe zdania”) i trzeba je
dodać do `lib/cues/text/pl.json` / `en.json` razem z nowymi zdaniami z sekcji 2.

```json
{
  "Barbell Hack Squat": {
    "setup": [
      {"c": "bhs.setup", "s": [["barbend-hack-squat", "How to Do the Hack Squat — Setup/Grip (heels touching the bar behind you; feet shoulder-width; overhand grip behind you)"], ["coach-hack-squat", "Barbell Hack Squat — Setup/Grip (back to the bar; overhand grip, palms facing behind; feet shoulder-width)"]]}
    ],
    "move": [
      {"c": "hack.move", "s": [["barbend-hack-squat", "How to Do the Hack Squat — Descent (drop hips back and down); Ascent (push your feet into the floor to stand up)"], ["coach-hack-squat", "Barbell Hack Squat — Descent (bend your knees to lower); Ascent (back to the start)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["barbend-hack-squat", "How to Do the Hack Squat — Back (spine neutral); Mistakes: Rounding"], ["coach-hack-squat", "Barbell Hack Squat — Back (shoulder blades to straighten your back)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["barbend-hack-squat", "Mistakes: Heels lifting"], ["coach-hack-squat", "Barbell Hack Squat — Ascent (drive through midfoot and heels); Mistakes: pressing through the forefoot"]]},
      {"c": "sq.mis.roundBack", "s": [["wniosek", "hinge.back"], ["barbend-hack-squat", "Mistakes: Rounding (przy opuszczaniu)"]]}
    ]
  },
  "Bodyweight Squat": {
    "setup": [
      {"c": "gob.stance", "s": [["ace-135", "Step 1 (feet slightly wider than hip-width)"], ["issa-mastering-squat", "How to Perform a Proper Squat (feet just outside hip-width)"]]}
    ],
    "move": [
      {"c": "sq.down", "s": [["ace-135", "Step 3 (hips backwards then downwards, knees bend); Step 6 (extend hips and knees, push through heels)"], ["issa-mastering-squat", "How to Perform a Proper Squat (hinge from the hips and bend the knees, hips slightly back; press through your midfoot to return to standing)"]]}
    ],
    "tips": [
      {"c": "sq.kneesToes", "s": [["ace-135", "Step 5 (knees aligned over the second toe)"], ["issa-mastering-squat", "How to Perform a Proper Squat (knees track in the same direction as your big toes)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [["issa-mastering-squat", "Common mistakes: Knees falling in or out (Valgus or Varus Collapse)"], ["ace-135", "Step 5 (knees remain aligned over the second toe)"]]},
      {"c": "sq.mis.heels", "s": [["ace-135", "Step 4 (stop if your heels lift)"], ["wniosek", "sq.down"]]}
    ]
  },
  "Dumbbell Squat": {
    "setup": [
      {"c": "gob.stance", "s": [["barbend-dumbbell-squat", "How to do (feet about shoulder-width apart, maybe a little wider; one dumbbell in each hand)"], ["ace-135", "uproszczenie: wariant sprzętu Bodyweight Squat — Step 1 (slightly wider than hip-width)"], ["issa-mastering-squat", "uproszczenie: wariant sprzętu Bodyweight Squat — How to Perform a Proper Squat (just outside hip-width)"]]}
    ],
    "move": [
      {"c": "sq.down", "s": [["barbend-dumbbell-squat", "How to do (unlock your knees and hips… sit back; push with your legs… standing tall)"], ["ace-135", "uproszczenie: wariant sprzętu Bodyweight Squat — Step 3; Step 6"], ["issa-mastering-squat", "uproszczenie: wariant sprzętu Bodyweight Squat — How to Perform a Proper Squat"]]}
    ],
    "tips": [
      {"c": "sq.kneesToes", "s": [["barbend-dumbbell-squat", "How to do (toes out; knees out)"], ["ace-135", "uproszczenie: wariant sprzętu Bodyweight Squat — Step 5"], ["issa-mastering-squat", "uproszczenie: wariant sprzętu Bodyweight Squat — knees track with big toes"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [["issa-mastering-squat", "uproszczenie: wariant sprzętu Bodyweight Squat — Common mistakes: Knees falling in"], ["ace-135", "uproszczenie: wariant sprzętu Bodyweight Squat — Step 5"], ["wniosek", "sq.kneesToes"]]}
    ]
  },
  "Overhead Squat": {
    "setup": [
      {"c": "ohs.setup", "s": [["catalyst-79-overhead-squat", "opis (bar overhead; elbows extended fully; feet in your squat stance)"], ["issa-dont-know-squat", "uproszczenie: wariant sprzętu (bez sztangi) — overhead squat assessment (arms extended overhead, aligned with ears)"]]}
    ],
    "move": [
      {"c": "ohs.move", "s": [["catalyst-79-overhead-squat", "opis (squat at a controlled speed into full depth and return to standing; bar not moving relative to upper body)"], ["issa-dont-know-squat", "uproszczenie: wariant sprzętu (bez sztangi) — squat as if sitting in a chair, return to standing, arms stay overhead"]]}
    ],
    "tips": [
      {"c": "ohs.arms", "s": [["catalyst-79-overhead-squat", "opis (elbows extended fully and forcefully)"], ["issa-dont-know-squat", "uproszczenie: wariant sprzętu (bez sztangi) — arms extended overhead; faults: arms stay in place or fall forward"]]}
    ],
    "mistakes": [
      {"c": "ohs.mis.armsForward", "s": [["issa-dont-know-squat", "uproszczenie: wariant sprzętu (bez sztangi) — faults: Arms (fall forward)"], ["catalyst-79-overhead-squat", "opis (not allowing the bar to move relative to your upper body at all)"], ["wniosek", "ohs.move"]]},
      {"c": "sq.mis.heels", "s": [["issa-dont-know-squat", "uproszczenie: wariant sprzętu (bez sztangi) — faults: Feet (does the heel come off the ground?)"], ["catalyst-79-overhead-squat", "opis (even balance over the whole foot) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Zercher Squat": {
    "setup": [
      {"c": "zer.hold", "s": [["barbend-zercher", "Bar position (crooks of the elbows, 'scooping' it out of the rack)"], ["ace-expert-5616", "Zercher Squat, steps 1–2 (forearms under the bar; pull it close against the body; lift from the rack)"]]}
    ],
    "move": [
      {"c": "hack.move", "s": [["barbend-zercher", "Descent; Ascent"], ["ace-expert-5616", "Zercher Squat, steps 3–4 (squat down; extend knees and hips until legs are straight)"]]}
    ],
    "tips": [
      {"c": "gob.close", "s": [["barbend-zercher", "Torso (resist the load as it attempts to pull your torso forwards)"], ["ace-expert-5616", "Zercher Squat, step 3 (the hands close to body)"]]}
    ],
    "mistakes": [
      {"c": "sq.mis.chestDrop", "s": [["wniosek", "gob.close"], ["barbend-zercher", "Torso (resist the load as it attempts to pull your torso forwards)"]]}
    ]
  },
  "Double Kettlebell Front Squat": {
    "setup": [
      {"c": "kbfs.rack", "s": [["barbend-front-squat-variations", "Double Kettlebell Front Squat (front-rack position; keep your wrists neutral)"], ["ace-expert-5386", "Double Kettlebell Front Squat (kettlebells in the rack position)"]]}
    ],
    "move": [
      {"c": "kbfs.move", "s": [["ace-expert-5386", "Double Kettlebell Front Squat (pull yourself down; drive through the floor to stand)"], ["barbend-front-squat-variations", "Double Kettlebell Front Squat (any loss of position and you'll lose the kettlebells)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "kbfs.mis.drop", "s": [["wniosek", "kbfs.move"], ["barbend-front-squat-variations", "Double Kettlebell Front Squat (any loss of position and you'll lose the kettlebells)"]]}
    ]
  }
}
```

Źródła do dopisania w `cues.json` → `sources` (szczebel 4; ACE i BarBend — organizacje już w `orgs`):

```json
{
  "sources": {
    "issa-mastering-squat": {"org": "ISSA", "title": "Mastering the Squat: A Trainer's Guide to Form, Function, and Fixes (ISSA, 24.07.2025)", "url": "https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes", "level": 4},
    "issa-dont-know-squat": {"org": "ISSA", "title": "It's Not Your Fault That You Don't Know Squat — overhead squat assessment (ISSA, 05.02.2024)", "url": "https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat", "level": 4},
    "catalyst-79-overhead-squat": {"org": "Catalyst Athletics", "title": "Overhead Squat (exercise library #79)", "url": "https://catalystathletics.com/exercise/79/Overhead-Squat/", "level": 4},
    "barbend-dumbbell-squat": {"org": "BarBend", "title": "Dumbbell Squat — J. Morris, CSCS, akt. 01.07.2024", "url": "https://barbend.com/dumbbell-squat/", "level": 4},
    "barbend-hack-squat": {"org": "BarBend", "title": "How to Do the Hack Squat — J. Zucker, NCSF CPT; recenzja J. Dickson, CPT-NASM; akt. 12.01.2024", "url": "https://barbend.com/hack-squat/", "level": 4},
    "coach-hack-squat": {"org": "Coach", "title": "How To Do The Hack Squat — S. Rider, REPS L3, 11.01.2024", "url": "https://www.coachweb.com/fitness/leg-exercises/hack-squat", "level": 4},
    "barbend-zercher": {"org": "BarBend", "title": "The Zercher Squat (ultimate guide) — M. Dewar, CSCS, akt. 27.11.2024", "url": "https://barbend.com/zercher-squat-ultimate-guide/", "level": 4},
    "ace-expert-5616": {"org": "ACE", "title": "6 Functional Strength and Conditioning Exercises (#5616) — Zercher Squat", "url": "https://www.acefitness.org/resources/pros/expert-articles/5616/6-functional-strength-and-conditioning-exercises-you-re-not-using-with-your-clients/", "level": 4},
    "barbend-front-squat-variations": {"org": "BarBend", "title": "Front Squat Variations — Double Kettlebell Front Squat", "url": "https://barbend.com/front-squat-variations/", "level": 4},
    "ace-expert-5386": {"org": "ACE", "title": "Advanced Kettlebell Workout (#5386)", "url": "https://www.acefitness.org/resources/pros/expert-articles/5386/advanced-kettlebell-workout-for-increased-strength-and-conditioning/", "level": 4}
  }
}
```

Jeśli `orgs` nie ma „ISSA” i „Catalyst Athletics” — dopisać z `level: 4` (szczeble-organizacji-2026-11-02.md, tabela organizacji, wiersze ISSA i Catalyst Athletics).

## 2. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `sq.mis.roundBack` | Zaokrąglanie pleców przy schodzeniu w dół. | Rounding your back on the way down. | istniejące `mis.roundBack` mówi o „dociąganiu ciężaru” — nie pasuje do przysiadu (W1, Barbell Hack Squat) |
| `sq.mis.chestDrop` | Klatka opada, a ciężar odjeżdża od ciała. | Chest dropping and the weight drifting away from your body. | zaprzeczenie `gob.close`; brak istniejącego błędu o opadającej klatce w przysiadzie z ciężarem z przodu |
| `kbfs.mis.drop` | Kettlebelle zjeżdżają z pozycji przy barkach. | Kettlebells slipping out of the rack position. | zaprzeczenie `kbfs.move` (kettlebelle w tej samej pozycji) |
| `ohs.setup` | Sztanga nad głową na wyprostowanych rękach, stopy ustawione jak do zwykłego przysiadu. | Bar overhead on straight arms, feet set as for a regular squat. | **zmiana brzmienia propozycji W1** („stopy na szerokość barków” — żadne przeczytane źródło szczebla 4 tego nie podaje; Catalyst: „your squat stance”) |
| `ohs.move` | Zejdź w przysiad, trzymając sztangę cały czas nad głową, i wróć do stania. | Squat down with the bar overhead the whole time, then stand back up. | **zmiana brzmienia propozycji W1** — usunięte „z uniesioną klatką” i „wypychając podłogę stopami” (tylko jedno źródło każde) |
| `ohs.arms` | Ręce przez cały ruch wyprostowane. | Keep your arms straight the whole time. | z W1, bez zmian |
| `ohs.mis.armsForward` | Ręce ze sztangą uciekają do przodu. | Arms and bar drifting forward. | błąd nazwany wprost w ISSA; zaprzeczenie `ohs.move`; da się pokazać na rysunku |

Zdania z W1 potrzebne w bloku (bez zmian brzmienia): `bhs.setup`, `zer.hold`, `kbfs.rack`, `kbfs.move` — `squat-cz1.md`, sekcja 3.

## 3. Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| `issa-mastering-squat` | https://www.issaonline.com/blog/post/mastering-the-squat-a-trainers-guide-to-form-function-and-fixes | ISSA | firmowane „ISSA”; cytuje ISSA Master Trainer J. Liebl; 24.07.2025 | 4 — ISSA warunek „artykuł firmowany ISSA” spełniony; sekcja „How to Perform a Proper Squat”: „Then press through your midfoot to return to standing, extending the knees and hips.” |
| `issa-dont-know-squat` | https://www.issaonline.com/blog/post/its-not-your-fault-that-you-dont-know-squat | ISSA | firmowane „ISSA”; 05.02.2024 | 4 (ta sama organizacja co wyżej — przy jednym ćwiczeniu nie łączę obu jako dwóch źródeł). Ocena ruchu z rękami nad głową (bez sztangi) — dlatego `uproszczenie: wariant sprzętu` przy Overhead Squat. Miejsce: opis testu i lista błędów (stopy, kolana, dolny odcinek pleców, ręce: „fall forward”) |
| `catalyst-79-overhead-squat` | https://catalystathletics.com/exercise/79/Overhead-Squat/ | Catalyst Athletics | biblioteka firmowana przez Catalyst Athletics, bez autora i daty przy haśle | 4 (tabela organizacji: biblioteka ćwiczeń); opis: „Squat at a controlled speed into full depth and return to standing.” |
| `barbend-dumbbell-squat` | https://barbend.com/dumbbell-squat/ | BarBend | J. Morris, CSCS, SCCC; „Last updated on July 1st, 2024” | 4; „Pick the dumbbells up (one in each hand) and gaze straight forward.” |
| `ace-135` | https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/ | ACE | biblioteka ACE | 4 (już w `cues.json`); Step 5: „the knees should continue to remain aligned over the second toe.” |
| `barbend-hack-squat`, `coach-hack-squat`, `barbend-zercher`, `ace-expert-5616`, `barbend-front-squat-variations`, `ace-expert-5386` | jak w `squat-cz1.md`, sekcja 4 | BarBend, Coach, ACE | jak w W1 i przeliczeniu (BarBend hack: autor i recenzent; Coach: S. Rider, REPS L3) | 4 — bez zmian po przeliczeniu |

Niezależność: ACE, ISSA, Catalyst Athletics, BarBend, Coach — różne organizacje. Przy Overhead Squat liczę Catalyst + ISSA (jedna strona ISSA).

Sprawdzone i nieliczone:
- Training & Conditioning, „Boxed in”, https://training-conditioning.com/article/boxed-in (01.06.2017) — strona bez autora; kroki box squat przypisane M. Galbraith (CSCS) z innego serwisu. Wg reguły roboczej o przedrukach (oceniamy autora oryginału) mogłoby być warunkowo 4 — **do decyzji koordynatora**; nie liczę. Gdyby uznać: Box Squat `box.move` (BarBend + Galbraith: „sit back between your heels on the bench/box”) i pauza na skrzyni — do ponownej oceny.
- The Prehab Guys, https://theprehabguys.com/vimeo-video/sumo-squat-dumbbell-2/ — brak autora → 5; poza tym hantel przy klatce (inny chwyt niż w katalogu).
- NASM, https://www.nasm.org/resource-center/blog/squat-alternatives — brak opisu przysiadów z zakresu.
- USA Weightlifting, przedruk przewodnika BarBend o przysiadzie nad głową — strona bez treści kroków; BarBend `/overhead-squat/` — „Gone”.

## 4. Otwarte

- **Box Squat** — tylko BarBend (W1). Kandydat: Training & Conditioning (przedruk, decyzja koordynatora wyżej).
- **Smith Machine Squat** — tylko BarBend (`smith.setup`, `sq.back`, `sq.mis.heels`); ruch — 0 źródeł szczebla 4. Wariant sprzętu przysiadu ze sztangą nie wystarczy: stopy przed sztangą i tor prowadzony zmieniają ustawienie i ruch.
- **Sumo Squat (hantel)** — tylko ACE #5875.
- **Landmine Squat, Cable Squat, One-Arm Overhead Kettlebell Squat, Dip Belt Squat** — bez zmian względem W1 (powody: `squat-cz1.md`, „Otwarte”); w W2 nie szukano (limit kontekstu).
- **Bodyweight Squat `sq.back`** — tylko ACE; ISSA mówi o neutralnej szyi i napięciu brzucha, nie o klatce.
- **Dumbbell Squat `dbsq.setup`** (gdzie hantle) — tylko BarBend; karta podaje sam rozstaw stóp. Uproszczenie: przysiad z hantlami w opuszczonych rękach ma ten sam ruch nóg i tułowia co przysiad bez obciążenia — zmienia się tylko miejsce ciężaru.
- **Overhead Squat `sq.mis.kneesIn`** — tylko ISSA (Catalyst bez listy błędów). Uproszczenie przy ISSA: ocena ruchu bez sztangi, ręce nad głową — ten sam wzorzec ruchu, bez ciężaru.
- **Overhead Squat — pochylenie tułowia:** Catalyst mówi o lekkim pochyleniu tułowia do przodu z głową między ramionami, ISSA wymienia nadmierne pochylenie do przodu jako błąd — część wspólna: lekkie pochylenie dozwolone, nadmierne nie. Do karty nie wchodzi (brak zdania).
- **Zercher Squat, Double Kettlebell Front Squat — wskazówki:** po jednym źródle (W1). Karty mają ustawienie, ruch i błąd; wskazówek brak (DKBFS) albo jedna (Zercher).
- **Barbell Hack Squat — rodzina figury:** zestaw `hingeFloor` nie pasuje (W1) — decyzja koordynatora i bramka 4.
- **Nowe karty a recenzja (CLAUDE.md, „Animacje i karty ćwiczeń”):** każda karta z bloku wymaga niezależnej recenzji treści przed wydaniem.

## Stan

- Zrobione: 6 kart gotowych z błędem (1 z W1 + błąd dodatkowy, 5 nowych), 7 nowych zdań.
- Zostało: Box, Smith, Sumo, Landmine, Cable, One-Arm OH KB, Dip Belt — drugie źródła szczebla 4.
- Następny krok: decyzja koordynatora o Training & Conditioning (Box Squat); wyszukiwanie ISSA/ACE/NASM dla Smith Machine Squat i Sumo Squat z hantlem między nogami.
