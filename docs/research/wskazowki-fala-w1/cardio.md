# Wskazówki techniki — rodzina `cardio` (fala W1, grupa G6)

- Data: 02.11.2026 (sesja 1 i kontynuacja — sesja 2)
- Autor: badacz-merytoryczny (agent)
- Zakres: Skakanka, Assault Bike, Jumping Jacks, High Knees, Stair Climber, Orbitrek, Treadmill Walking, Battle Ropes, Ski Erg,
  Fast Skipping, Carioca Quick Step; sprawdzenie wpisów `open` (Skakanka, Assault Bike); dopełnienie ćwiczeń z listy `partial`
  (Burpees, Bieg, Incline Walk (bieżnia), Rower) — sekcja 2a.
- Metoda: wyjątek dla wskazówek techniki (CLAUDE.md) — zdanie ustalone przy ≥ 2 zgodnych, przeczytanych źródłach szczebla 4 z różnych organizacji.
  Bez liczb (tętno, tempo, czas, kąty) i bez twierdzeń zdrowotnych. Szczeble organizacji wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026
  (producent liczy się tylko dla własnego rodzaju sprzętu; sieci siłowni i sprzedawcy — 5) i koordynatora G6 z 02.11.2026 (Physitrack nie liczony,
  The Prehab Guys = 4 do potwierdzenia) — ocena każdego źródła w sekcji 3a.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Skakanka | general (jump), `open` | **gotowe** | wpis `open` da się zamknąć BEZ DAN: drugie niezależne źródło to B. Lee (CrossFit Journal 2007 + fragment książki „Jump Rope Training”, Human Kinetics — ten sam autor, liczony raz) |
| Assault Bike | general (bike), `open` | **gotowe** (ustawienie + ruch rąk) | sesja 2: drugie źródło pracy rąk i odległości siodełka — SMAI (producent roweru powietrznego AirFit marki własnej); mistakes puste |
| Jumping Jacks | general (jump) | **gotowe** | NASM + The Prehab Guys (4, do potwierdzenia); Physitrack nie liczony (wstępnie 5, sekcja 3a) |
| High Knees | general (jump) | **częściowe** (ruch) | sesja 2: The Prehab Guys + G. Carr („Fundamentals of Track and Field”, wariant: w marszu do przodu) — wspólne tylko unoszenie kolan do wysokości bioder |
| Stair Climber | general (cardioMachine) | **gotowe** | StairMaster (instrukcja StepMill 3) + Bells of Steel (producent schodołazów — własny rodzaj sprzętu, sprawdzone 02.11.2026); ogólne `walk.rails` zastąpione `stair.rails` |
| Orbitrek | general (cardioMachine) | **gotowe** | Life Fitness (instrukcja X15) + Sunny Health & Fitness (producent orbitreków) |
| Treadmill Walking | general (cardioMachine) | **gotowe** | sesja 2: dodane ustawienie (`tread.straddle`: Precor + Lifespan Fitness) i `walk.gaze` |
| Battle Ropes | open | **otwarte** | po rozstrzygnięciu szczebli: Elevate Rope to producent skakanek, nie lin → szczebel 5 dla lin; zostaje jedno źródło (Bells of Steel) |
| Ski Erg | open | **otwarte** | The Barbell Physio — strona bez autora i daty, jednoosobowa marka; nie spełnia (a)–(b) → szczebel 5; zostaje jedno źródło (Concept2) |
| Fast Skipping | general (jump) | **częściowe** (ruch), warunkowo | Carr (skip z wysokim kolanem) + The Prehab Guys (A-skip); katalog nie definiuje, czym jest „Fast Skipping” — patrz Otwarte |
| Carioca Quick Step | open | **częściowe** (ruch) | Uniwersytet Calgary (program SHRED) + The Prehab Guys (wariant: przez drabinkę) |
| Burpees (partial) | partial | bez zmian (otwarte) | drugie źródło ustawienia i błędu to magazyn sieci siłowni (Life Time) → szczebel 5; `jump.land` — tylko NASM |
| Bieg (partial) | partial | **dopełnione częściowo** (ruch, wskazówka, błąd) | NASM (blog „Running Gait Basics”) + HSS („Proper Running Form”); ustawienie nadal puste |
| Incline Walk (bieżnia) (partial) | partial | **dopełnione** (ustawienie, ruch, wskazówka, błąd) | NordicTrack + Sunny (marsz z nachyleniem) + Precor + Lifespan (wejście na bieżnię) |
| Rower (partial) | partial | **dopełnione częściowo** (ustawienie, wskazówki, błąd) | HSS + NordicTrack + M. Yoke i C. Armbruster (Human Kinetics); ruch (praca nóg) nadal pusty |

## 2. Blok JSON do `exercises` w `data/zrodla/cues.json` (sesja 1)

```json
{
  "Skakanka": {
    "setup": [
      {"c": "rope.length", "s": [["ace-fitfacts-rope", "Roping Essentials (stopa na środku skakanki, uchwyty mniej więcej do klatki; parafraza)"], ["cfj-lee-rope", "s. 4, Rope measurement (uchwyty nie wyżej niż barki; parafraza)"]]},
      {"c": "rope.elbows", "s": [["ace-fitfacts-rope", "Learning the Basics (barki luźno, łokcie blisko tułowia; parafraza)"], ["cfj-lee-rope", "s. 2, Technique Tips pkt 5; s. 5, Body position and grip (ręce blisko boków; parafraza)"]]}
    ],
    "move": [
      {"c": "rope.wrists", "s": [["ace-fitfacts-rope", "Learning the Basics („Turn the rope from the wrist…”)"], ["cfj-lee-rope", "s. 5, Body position and grip (małe koła nadgarstkami; parafraza)"]]}
    ],
    "tips": [
      {"c": "rope.low", "s": [["ace-fitfacts-rope", "Learning the Basics (skacz nisko; parafraza, uzasadnienie zdrowotne pominięte)"], ["cfj-lee-rope", "s. 2, Technique Tips pkt 3 (tylko tyle, by przeskoczyć skakankę; parafraza)"], ["hk-lee-rope", "The bounce step, krok 2 („just high enough to clear the rope”)"]]},
      {"c": "rope.upright", "s": [["ace-fitfacts-rope", "Learning the Basics (nie garb się, plecy proste, głowa w górze; parafraza)"], ["cfj-lee-rope", "s. 5, Body position and grip (wyprostowany, głowa nad barkami, wzrok przed siebie; parafraza)"]]},
      {"c": "rope.knees", "s": [["ace-fitfacts-rope", "Learning the Basics (kolana lekko ugięte; parafraza)"], ["hk-lee-rope", "The bounce step, krok 2 (lekko ugięte kolana; parafraza)"]]}
    ],
    "mistakes": []
  },
  "Assault Bike": {
    "setup": [
      {"c": "bike.seat", "s": [["schwinn-ad6-manual", "s. 18, Seat Adjustment („Your leg should be bent slightly at the knee.”)"], ["rep-airbike-setup", "seat height (przy pedałowaniu przednią częścią stopy kolano lekko ugięte; parafraza)"], ["c2-bikeerg-setup", "(wariant: rower powietrzny bez ruchomych rączek) lekkie ugięcie przy pełnym wyproście"]]},
      {"c": "bike.foot", "s": [["rep-airbike-setup", "seat height (pedałowanie przednią częścią stopy; parafraza)"], ["c2-bikeerg-setup", "(wariant: rower powietrzny bez ruchomych rączek) przednia część stopy na pedale"], ["hss-bike", "(wariant: rower stacjonarny) Foot position"]]}
    ],
    "move": [],
    "tips": [],
    "mistakes": []
  },
  "Jumping Jacks": {
    "setup": [
      {"c": "jj.setup", "s": [["nasm-jumping-jacks", "Step 1: Setup (stopy razem, ręce wzdłuż boków; parafraza)"], ["prehab-jumping-jack", "instrukcja (start w staniu; pozycja: stopy razem, ręce przy bokach; parafraza)"]]}
    ],
    "move": [
      {"c": "jj.move", "s": [["nasm-jumping-jacks", "Step 3–4: Execute/Drive, Return (rozkrok z rękami nad głową i powrót; parafraza)"], ["prehab-jumping-jack", "instrukcja (naprzemiennie: ręce w górze i nogi szeroko / ręce przy bokach i stopy razem; parafraza)"]]}
    ],
    "tips": [
      {"c": "jump.land", "s": [["nasm-jumping-jacks", "Common Mistakes (lądowanie na prostych kolanach, twarde lądowanie; parafraza)"], ["prehab-jumping-jack", "instrukcja (ląduj miękko; parafraza)"]]}
    ],
    "mistakes": []
  },
  "Stair Climber": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "walk.upright", "s": [["stairmaster-sm3-manual", "s. 7, Using your StepMill 3, krok 6 („Relax, maintain an erect posture, and use handrails for balance.”)"], ["bellsofsteel-stair", "form (tułów wyprostowany, brzuch napięty; parafraza)"]]},
      {"c": "stair.rails", "s": [["stairmaster-sm3-manual", "s. 7, krok 6 (poręcze do równowagi; podpieranie się zmniejsza intensywność; parafraza)"], ["bellsofsteel-stair", "form („Avoid leaning too heavily on the handrails.”)"]]}
    ],
    "mistakes": []
  },
  "Orbitrek": {
    "setup": [
      {"c": "ell.feet", "s": [["lf-x15-manual", "s. 13, rozdz. 3 Correct Usage (stopy na pedałach przodem, kolana prosto; parafraza)"], ["sunny-elliptical-form", "Feet/Knees (stopy i kolana skierowane do przodu; parafraza)"]]}
    ],
    "move": [],
    "tips": [
      {"c": "ell.upright", "s": [["lf-x15-manual", "s. 13, Correct Usage („Keep back straight. Do not bend forward at the waist.”)"], ["sunny-elliptical-form", "Posture (wyprostowana sylwetka; parafraza)"]]},
      {"c": "ell.grip", "s": [["sunny-elliptical-form", "Handlebars („Gently hold onto the handlebars with minimal tension in your hands.”)"], ["lf-x15-manual", "s. 13, Correct Usage (dłonie swobodnie na rączkach; parafraza)"]]},
      {"c": "ell.heel", "s": [["lf-x15-manual", "s. 13, Correct Usage (pięty mogą się lekko unosić; parafraza)"], ["sunny-elliptical-form", "Feet (pięta wysuniętej stopy odrywa się, nacisk przez przednią część stopy; parafraza)"]]}
    ],
    "mistakes": []
  },
  "Treadmill Walking": {
    "setup": [],
    "move": [],
    "tips": [
      {"c": "walk.rails", "s": [["lifefitness-rails", "(wariant: z nachyleniem) So what's the smartest treadmill position? („…keep an upright posture and don’t lean back!”)"], ["nordictrack-incline", "(wariant: z nachyleniem) poręcze do równowagi"], ["berling-2006", "abstrakt (mocne trzymanie poręczy obniżało wysiłek; parafraza)"], ["hofmann-2014", "(wariant: z nachyleniem) abstrakt (odchylenie z trzymaniem poręczy zmniejsza koszt; parafraza)"]]},
      {"c": "walk.upright", "s": [["lifefitness-rails", "(wariant: z nachyleniem) wyprostowana postawa"], ["nordictrack-incline", "(wariant: z nachyleniem) napięty brzuch, neutralny kręgosłup; parafraza"]]}
    ],
    "mistakes": []
  }
}
```

Uwaga do integracji: wpisy „Skakanka” i „Assault Bike” usunąć z `open` w `cues.json` (i z tabeli w `docs/research/27-wskazowki-zrodla.md`).
Treadmill Walking: źródła `berling-2006`, `hofmann-2014`, `nordictrack-incline` czytane w docs/33; Life Fitness ponownie otwarty 02.11.2026 (artykuł dotyczy marszu z nachyleniem — stąd opis wariantu).
Jumping Jacks: odwołanie do `physitrack-jumping-jack` usunięte z bloku (koordynator G6, 02.11.2026 — nie liczy się do dwóch źródeł); zdanie `jump.land` ma nadal NASM + The Prehab Guys.
Zasada cytatu: najwyżej jedno zdanie cytowane na źródło; reszta odwołań to parafrazy z miejscem.

## 2a. Dopełnienie i nowe wpisy (sesja 2, 02.11.2026)

Pozycje do DOPISANIA na koniec istniejących list w `cues.json` (Assault Bike i Treadmill Walking — do bloku z sekcji 2; Incline Walk, Bieg, Rower —
do wpisów już w `cues.json`). High Knees, Fast Skipping, Carioca Quick Step — wpisy nowe. Burpees — bez zmian (sekcja 5).

```json
{
  "Assault Bike": {
    "setup": [
      {"c": "abike.reach", "s": [["rep-airbike-setup", "seat fore-aft (przy najdalszej rączce łokieć lekko ugięty; parafraza)"], ["smai-airfit-tips", "seat set-up (ręce nie przeprostowane, gdy rączka jest najdalej; parafraza)"]]}
    ],
    "move": [
      {"c": "abike.arms", "s": [["rep-airbike-setup", "praca rąk (pchanie i ciąganie rączek razem z pedałowaniem; parafraza)"], ["smai-airfit-tips", "„by using your arms (pushing + pulling) you can get the fan turning way faster”"]]}
    ]
  },
  "Treadmill Walking": {
    "setup": [
      {"c": "tread.straddle", "s": [["precor-935-manual", "s. 4, Important Safety Instructions (przed ruszeniem pasa stopy na bocznych platformach, okrakiem nad pasem; parafraza)"], ["lifespan-treadmill-safety", "Stepping onto the treadmill (stań na bocznych listwach, nie na pasie; parafraza)"]]}
    ],
    "tips": [
      {"c": "walk.gaze", "s": [["lifespan-treadmill-safety", "Posture / common mistakes (wzrok przed siebie, nie patrz pod nogi; parafraza)"], ["nordictrack-incline", "(wariant: z nachyleniem) Form First („…look ahead (not down)…”)"]]}
    ]
  },
  "Incline Walk (bieżnia)": {
    "setup": [
      {"c": "tread.straddle", "s": [["precor-935-manual", "s. 4, Important Safety Instructions (parafraza)"], ["lifespan-treadmill-safety", "Stepping onto the treadmill (parafraza)"]]}
    ],
    "move": [
      {"c": "walk.short", "s": [["nordictrack-incline", "Form First („take shorter, more controlled steps” przy większym nachyleniu)"], ["sunny-incline-walk", "Steps (krótkie, szybkie kroki, zwłaszcza przy większym nachyleniu; parafraza)"]]}
    ],
    "tips": [
      {"c": "walk.gaze", "s": [["nordictrack-incline", "Form First (patrz przed siebie, nie w dół; parafraza)"], ["lifespan-treadmill-safety", "(wariant: bez nachylenia) wzrok przed siebie; parafraza"]]}
    ],
    "mistakes": [
      {"c": "walk.mis.bend", "s": [["nordictrack-incline", "Form First (lekkie pochylenie jest normalne, ale bez przesadnego pochylania do przodu; parafraza)"], ["sunny-incline-walk", "Lean / Common Mistakes (pochylenie z kostek, nie z pasa; mocne zgięcie w biodrach to błąd; parafraza)"]]}
    ]
  },
  "Bieg": {
    "move": [
      {"c": "run.arms", "s": [["nasm-running-gait", "What to Observe — Lateral/Anterior View (ręce przód–tył, nie przez linię środkową ciała; parafraza)"], ["hss-running-form", "Arms (ręce luźno, w rytm nóg, góra–dół, nie na boki; parafraza)"]]}
    ],
    "tips": [
      {"c": "run.tall", "s": [["hss-running-form", "Posture („Run tall…”; lekkie pochylenie do przodu, nie sztywno)"], ["nasm-running-gait", "What to Observe — Lateral View (lekkie pochylenie normalne); Common Faults — Excessive Forward Trunk Lean; parafraza"]]}
    ],
    "mistakes": [
      {"c": "run.mis.overstride", "s": [["nasm-running-gait", "Common Faults — Overstriding (stopa ląduje za daleko przed ciałem; parafraza)"], ["hss-running-form", "Foot strike (stopa pod środkiem ciężkości, nie daleko przed sobą; parafraza)"], ["pmc-4887549", "Spatiotemporal Factors (parafraza)"]]}
    ]
  },
  "Rower": {
    "setup": [
      {"c": "bike.elbows", "s": [["hss-bike", "Posture (lekko ugięte łokcie; parafraza)"], ["hk-yoke-cycling", "ustawienie siodełka przód–tył (łokcie lekko ugięte przy chwycie kierownicy; parafraza)"]]}
    ],
    "tips": [
      {"c": "bike.back", "s": [["hss-bike", "Posture (kręgosłup w miarę prosty, brzuch napięty; parafraza)"], ["nordictrack-bike-mistakes", "błąd 3 („engage your core, keep your back straight…”)"], ["hk-yoke-cycling", "„maintain neutral spinal alignment on the bike”"]]},
      {"c": "bike.shoulders", "s": [["hss-bike", "Posture (barki z dala od uszu; parafraza)"], ["hk-yoke-cycling", "łopatki w dół, bez garbienia i unoszenia barków; parafraza"], ["nordictrack-bike-mistakes", "błąd 2 (szyja, ręce i barki rozluźnione; parafraza)"]]},
      {"c": "bike.grip", "s": [["nordictrack-bike-mistakes", "błąd 2 (dłonie lekko na kierownicy; parafraza)"], ["hk-yoke-cycling", "„ride with a relaxed grip and neutral wrists”"]]}
    ],
    "mistakes": [
      {"c": "bike.mis.rock", "s": [["hk-yoke-cycling", "„The rider's hips will rock back and forth” przy za wysokim siodełku"], ["rep-airbike-setup", "(wariant: rower powietrzny) seat height (kołysanie bioder przy za wysokim siodełku; parafraza)"]]}
    ]
  },
  "High Knees": {
    "setup": [],
    "move": [
      {"c": "hk.knee", "s": [["prehab-high-knees", "HOW (kolano na zmianę w górę, celem wysokość biodra; parafraza)"], ["carr-hk-drills", "(wariant: w marszu do przodu) high-knee drill („Lift each thigh to a horizontal position.”)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Fast Skipping": {
    "setup": [],
    "move": [
      {"c": "skip.move", "s": [["carr-hk-drills", "high-knee skipping (jak skakanie na skakance, udo w górę; parafraza)"], ["prehab-a-skip", "(wariant: A-skip) HOW (kolano w górę z lekkim podskokiem na nodze podporowej; parafraza)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Carioca Quick Step": {
    "setup": [],
    "move": [
      {"c": "car.move", "s": [["ucalgary-carioca", "Carioca crossovers (noga przekracza przed i za nogą prowadzącą; parafraza)"], ["prehab-ladder-carioca", "(wariant: przez drabinkę) HOW („Move laterally as you cross one leg over in the front and then that same leg behind you”)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Uwagi do integracji (sesja 2):
- `bike.mis.rock`: NordicTrack („8 Exercise Bike Mistakes”, błąd 3) zaleca „ruszać biodrami” — kontekst niejasny (bez opisu kołysania na siodełku). Książka Yoke i Armbruster (szczebel 3 albo 4) i REP mówią wprost o kołysaniu przy za wysokim siodełku; NordicTrack nie jest użyty dla tego zdania.
- `run.mis.overstride` i istniejąca wskazówka `run.under` mówią to samo z dwóch stron; koordynator może zamiast nowego błędu przenieść `run.under` do `mistakes` — do decyzji przy integracji.
- Lista `partial` w `cues.json`: Incline Walk ma po sesji 2 wszystkie sekcje → do usunięcia z `partial`. Bieg (bez ustawienia), Rower (bez ruchu), Burpees — zostają.
- High Knees, Fast Skipping, Carioca Quick Step, Jumping Jacks opierają się m.in. na The Prehab Guys (4, do potwierdzenia) — przy innej decyzji o szczeblu te wpisy wypadają (sekcja 3a).

## 3. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| ace-fitfacts-rope | ACE | Fit Facts: „Jumping Rope: Not Just for Kids Anymore” (2009) | https://contentcdn.eacefitness.com/assets/education-resources/lifestyle/fitfacts/pdfs/fitfacts/itemid_2688.pdf | 4 | tak, 02.11.2026 (PDF w całości) |
| cfj-lee-rope | B. Lee (CrossFit Journal) | B. Lee, „Jump Rope Basics, Part 1: Preparation”, CrossFit Journal nr 62 (10.2007) | https://library.crossfit.com/premium/pdf/62_07_Jump_Rope_Basics.pdf | 4 | tak, 02.11.2026 (s. 1–5) |
| hk-lee-rope | B. Lee (Human Kinetics) | fragment: B. Lee, „Jump Rope Training”, wyd. 2 — „Improve overall conditioning with these basic jump rope techniques” | https://us.humankinetics.com/blogs/excerpt/improve-overall-conditioning-with-these-basic-jump-rope-techniques | 4 | tak, 02.11.2026 |
| schwinn-ad6-manual | Schwinn (Nautilus) | Schwinn Airdyne AD6 — instrukcja obsługi, s. 18 (Operations) | https://www.manualsdir.com/manuals/720676/schwinn-airdyne-ad6.html?page=18 | 4 | tak, 02.11.2026 (kopia instrukcji w serwisie z instrukcjami; oficjalny PDF producenta — 403) |
| rep-airbike-setup | REP Fitness | R. MacPherson (CSCS), „The One Mistake Almost Every Air Bike User Makes” (25.02.2026, akt. 03.08.2026) | https://repfitness.com/blogs/guides/the-one-mistake-almost-every-air-bike-user-makes | 4 | tak, 02.11.2026 |
| nasm-jumping-jacks | NASM | Jumping Jacks | https://www.nasm.org/resource-center/exercise-library/jumping-jacks | 4 | tak, 02.11.2026 |
| prehab-jumping-jack | The Prehab Guys | Jumping Jack | https://theprehabguys.com/vimeo-video/jumping-jack/ | 4 (do potwierdzenia, 3a) | tak, 02.11.2026 |
| physitrack-jumping-jack | Physitrack | How to perform the jumping jack exercise | https://www.physitrack.com/exercise-library/how-to-perform-the-jumping-jack-exercise | do decyzji (wstępnie 5; nie liczony) | tak, 02.11.2026 (opis niespójny: krok 1 vs FAQ) — nie wpisywać do `cues.json` |
| stairmaster-sm3-manual | StairMaster | StepMill 3 — Owner's Manual (0300025A), s. 7 | https://cdn.shopify.com/s/files/1/0266/5883/2426/files/Stairmaster_3_Owner_s_Manual_78991996-ae45-4ec3-af2e-dabe93c67f63.pdf | 4 | tak, 02.11.2026 (s. 1–7; plik na serwerze sprzedawcy) |
| bellsofsteel-stair | Bells of Steel | „Is a Stair Climber a Good Workout?” (07.01.2025, bez autora) | https://bellsofsteel.us/blogs/content/is-a-stair-climber-a-good-workout | 4 | tak, 02.11.2026 |
| lf-x15-manual | Life Fitness | X15 Cross-Trainer — User Manual, s. 13, rozdz. 3 Correct Usage | https://www.manualsdir.com/manuals/166184/life-fitness-x15.html?page=14 | 4 | tak, 02.11.2026 (kopia instrukcji w serwisie z instrukcjami) |
| sunny-elliptical-form | Sunny Health & Fitness | „Elliptical proper form workout” (30.07.2021) | https://sunnyhealthfitness.com/blogs/products/elliptical-proper-form-workout | 4 | tak, 02.11.2026 |
| smai-airfit-tips | SMAI | „Training energy systems and tips on the SMAI AirFit Bike 2.0” (autor: fizjolog wysiłku; podpis niespójny — J. Scully / B. Smith-Wright; bez daty) | https://smai.com.au/blogs/news/training-energy-systems-and-tips-on-the-smai-airfit-bike-2-0 | 4 (warunkowo, 3a) | tak, 02.11.2026 (sesja 2) |
| precor-935-manual | Precor | Precor 9.35 — Owner's Manual, s. 4 Important Safety Instructions | https://www.manualslib.com/manual/134446/Precor-9-35.html?page=4 | 4 | tak, 02.11.2026 (kopia instrukcji w serwisie z instrukcjami) |
| lifespan-treadmill-safety | Lifespan Fitness | „How to Operate a Treadmill Safely” (13.09.2024, treść firmowa) | https://lifespanfitness.com.au/blogs/fitness-blogs/how-to-operate-a-treadmill-safely | 4 | tak, 02.11.2026 |
| sunny-incline-walk | Sunny Health & Fitness | C. Jenkins, „Incline Walking Guide: Benefits, Form Tips, and How to Progress” (03.03.2026) | https://sunnyhealthfitness.com/blogs/health-wellness/incline-walking-guide-benefits-form-tips-and-how-to-progress | 4 | tak, 02.11.2026 |
| hss-running-form | HSS | „Proper Running Form” (ekspert: K. Baird, ACSM-CEP, CSCS; 10.03.2024) | https://www.hss.edu/health-library/move-better/proper-running-form | 4 | tak, 02.11.2026 |
| nordictrack-bike-mistakes | NordicTrack | „8 Exercise Bike Mistakes You Should Stop Now” (16.07.2020, treść firmowa) | https://www.nordictrack.com/blog/8-exercise-bike-mistakes | 4 | tak, 02.11.2026 |
| hk-yoke-cycling | M. M. Yoke, C. Armbruster (Human Kinetics) | fragment: „Methods of Group Exercise Instruction”, wyd. 4 — „Positioning, alignment, and safety in group cycling classes” | https://us.humankinetics.com/blogs/excerpt/positioning-alignmentand-safety-in-group-cycling-classes | 3 albo 4 (3a) | tak, 02.11.2026 |
| carr-hk-drills | G. Carr (Human Kinetics) | fragment: G. Carr, „Fundamentals of Track and Field”, wyd. 2 — technika sprintu, ćwiczenia z wysokim kolanem (przedruk) | https://www.maxpreps.com/news/R9r5UtkH90iueZXBbnFYMg/sprinting-technique.htm | 4 (3a) | tak, 02.11.2026 |
| prehab-high-knees | The Prehab Guys | High Knees In Place | https://theprehabguys.com/vimeo-video/high-knees-in-place-2/ | 4 (do potwierdzenia, 3a) | tak, 02.11.2026 |
| prehab-a-skip | The Prehab Guys | A Skip | https://theprehabguys.com/vimeo-video/a-skip/ | 4 (do potwierdzenia, 3a) | tak, 02.11.2026 |
| prehab-ladder-carioca | The Prehab Guys | Ladder Carioca | https://theprehabguys.com/vimeo-video/ladder-carioca-2/ | 4 (do potwierdzenia, 3a) | tak, 02.11.2026 |
| ucalgary-carioca | University of Calgary (SIPRC, program SHRED Injuries) | Carioca crossovers (sekcja Volleyball; bez daty, treść firmowana przez uczelniany ośrodek badań) | https://ucalgary.ca/shred-injuries/all-sports/volleyball/cariocacrossovers | 4 | tak, 02.11.2026 |

Nowe organizacje (propozycja):
- „B. Lee (Jump Rope Training)” — `kind: site`, szczebel 4 (autor książki o skakance; dwa teksty tego samego autora = jedno niezależne źródło).
- Schwinn (Nautilus), REP Fitness, StairMaster, Bells of Steel, Sunny Health & Fitness, SMAI, Precor, Lifespan Fitness — producenci, `kind: maker`, szczebel 4 tylko dla własnego rodzaju sprzętu (3a). Life Fitness, NordicTrack, HSS — organizacje już są w `orgs`.
- M. Yoke i C. Armbruster (Human Kinetics), G. Carr (Human Kinetics) — książki; University of Calgary SIPRC — ośrodek uczelniany.
- Ryzyko: trzy instrukcje czytane z kopii w serwisach z instrukcjami (oryginał producenta niedostępny: 403), fragment Carra z przedruku w serwisie sportowym. Treść to dokument źródłowy; audytor może zażądać oryginału.

## 3a. Ocena szczebli wg rozstrzygnięć koordynatorów (02.11.2026)

| Źródło | Ocena | Uzasadnienie (kryteria a–c) |
|---|---|---|
| ACE, NASM | 4 | organizacje szkolące trenerów |
| CrossFit Journal (B. Lee) | 4 | wydawca certyfikuje trenerów; autor i data |
| Human Kinetics — B. Lee | 4 | autor nie z NSCA ani naukowiec; specjalista od skakanki — ocena autora; z CFJ liczony raz |
| Human Kinetics — M. Yoke, C. Armbruster | 3 albo 4 | podręcznik dla instruktorów zajęć grupowych; dorobek naukowy autorek niesprawdzony w tej sesji — dla wyniku bez znaczenia (≥ 4) |
| Human Kinetics — G. Carr | 4 (może 3) | podręcznik lekkiej atletyki; status naukowy autora niesprawdzony; czytany w przedruku |
| Schwinn (rower powietrzny), REP Fitness (rower powietrzny), SMAI (rower powietrzny AirFit) | 4 | producenci własnego rodzaju sprzętu; SMAI: autor bez daty, treść firmowa — warunek (b) spełniony przez firmowanie; że AirFit to marka własna SMAI, strona nie mówi wprost — do potwierdzenia |
| StairMaster, Bells of Steel (schodołazy — w ofercie własne, sprawdzone 02.11.2026) | 4 | własny rodzaj sprzętu; Bells of Steel: wpis firmowy na blogu sklepu producenta — część o technice bez treści reklamowej |
| Life Fitness, Sunny, Precor, Lifespan, NordicTrack (bieżnie, orbitreki, rowery stacjonarne) | 4 | własny rodzaj sprzętu; teksty instruktażowe z datą albo firmowane |
| Elevate Rope (dla lin) | 5 | producent skakanek, nie lin → Battle Ropes otwarte |
| The Barbell Physio (Ski Erg) | 5 | brak autora i daty, jednoosobowa marka, brak redakcji eksperckiej → Ski Erg otwarte |
| Life Time / Experience Life (Burpees) | 5 | magazyn sieci siłowni → nie liczony |
| HSS, University of Calgary SIPRC | 4 | szpital specjalistyczny i ośrodek uczelniany; treść firmowana, HSS z datą i ekspertem |
| The Prehab Guys | 4 — **do potwierdzenia** (koordynator G6, 02.11.2026: liczyć jako 4) | firma edukacyjna fizjoterapeutów, treść firmowana, bez daty; już używana w `cues.json`. Ma też płatną bibliotekę/aplikację — przy ocenie 5 odpadają: Jumping Jacks (zostaje NASM), High Knees, Fast Skipping, Carioca Quick Step |
| Physitrack | **szczebel do decyzji (wstępnie 5)** — nie liczy się do dwóch źródeł (koordynator G6, 02.11.2026) | dostawca oprogramowania z aplikacją dla pacjentów, strona bez autora i daty; był tylko trzecim źródłem (wariant) przy Jumping Jacks — usunięty z bloku JSON, status ćwiczeń policzony bez niego, wynik bez zmian |

## 4. Nowe zdania

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| rope.length | Dobierz długość: stań na środku skakanki — uchwyty mają sięgać mniej więcej klatki, nie wyżej niż barki. | Size the rope: stand on its middle — the handles should reach about chest height, no higher than your shoulders. | ACE (do klatki) + Lee (nie wyżej niż barki) — część wspólna |
| rope.elbows | Łokcie trzymaj blisko tułowia. | Keep your elbows close to your body. | ACE + Lee |
| rope.wrists | Kręć skakanką ruchem nadgarstków. | Turn the rope with your wrists. | ACE + Lee (zdanie z docs/33, dotąd nie w pl.json) |
| rope.low | Skacz nisko — tylko tyle, żeby skakanka przeszła pod stopami. | Jump low — just high enough for the rope to pass under your feet. | ACE + Lee (zdanie z docs/33) |
| rope.upright | Stój prosto, głowa w górze, wzrok przed siebie — nie garb się. | Stand tall, head up, eyes forward — don't hunch. | ACE + Lee |
| rope.knees | Kolana lekko ugięte. | Keep your knees slightly bent. | ACE + Lee (HK) |
| jj.setup | Stań prosto, stopy razem, ręce wzdłuż tułowia. | Stand tall, feet together, arms by your sides. | NASM + Prehab Guys |
| jj.move | Podskocz, rozstawiając nogi i unosząc ręce nad głowę; w kolejnym podskoku złącz stopy i opuść ręce. | Jump your feet out as your arms go overhead; on the next jump bring your feet together and arms down. | NASM + Prehab Guys |
| stair.rails | Poręczy używaj tylko do równowagi — nie wspieraj się na nich mocno. | Use the rails for balance only — don't lean your weight on them. | StairMaster + Bells of Steel |
| ell.feet | Stopy cały czas na pedałach, palce i kolana skierowane do przodu. | Keep your feet on the pedals the whole time, toes and knees pointing forward. | Life Fitness + Sunny |
| ell.upright | Plecy proste — nie pochylaj się w pasie. | Keep your back straight — don't bend forward at the waist. | Life Fitness + Sunny |
| ell.grip | Rączki trzymaj luźno, bez mocnego ściskania. | Hold the handles lightly, without squeezing hard. | Sunny + Life Fitness |
| ell.heel | Pięta przedniej stopy może lekko odrywać się od pedału — to normalne. | Your front heel can lift slightly off the pedal — that's fine. | Life Fitness + Sunny |
| abike.reach | Siodełko ustaw tak, żeby przy najdalszej rączce ręka była prawie prosta, nie wyprostowana na siłę. | Set the seat so your arm is almost straight at the farthest handle, not overreaching. | REP + SMAI (sesja 2) |
| abike.arms | Pchaj i ciągnij rączki razem z pedałowaniem — niech pracują i ręce, i nogi. | Push and pull the handles as you pedal — let your arms work too, not just your legs. | REP + SMAI |
| tread.straddle | Zanim pas ruszy, stań na bocznych listwach, nie na pasie. | Before the belt starts, stand on the side rails, not on the belt. | Precor + Lifespan |
| walk.gaze | Patrz przed siebie, nie pod nogi. | Look ahead, not down at your feet. | Lifespan + NordicTrack |
| walk.short | Pod górę stawiaj krótsze kroki. | Take shorter steps on the incline. | NordicTrack + Sunny |
| walk.mis.bend | Mocne pochylanie się do przodu w pasie. | Bending forward hard at the waist. | NordicTrack + Sunny |
| run.arms | Ręce pracują luźno przód–tył, nie w poprzek ciała. | Swing your arms loosely front to back, not across your body. | NASM + HSS |
| run.tall | Biegnij wyprostowany, z lekkim pochyleniem do przodu — bez przesady. | Run tall with a slight forward lean — don't overdo it. | HSS + NASM |
| run.mis.overstride | Stawianie stopy daleko przed sobą. | Landing with your foot far out in front of you. | NASM + HSS (+ PMC 4887549) |
| bike.elbows | Łokcie lekko ugięte. | Keep a slight bend in your elbows. | HSS + Yoke i Armbruster |
| bike.back | Plecy proste, brzuch napięty. | Keep your back straight and your core tight. | HSS + NordicTrack + Yoke i Armbruster |
| bike.shoulders | Barki luźno, z dala od uszu. | Keep your shoulders relaxed, away from your ears. | HSS + Yoke i Armbruster (+ NordicTrack) |
| bike.grip | Kierownicę trzymaj luźno. | Hold the handlebars lightly. | NordicTrack + Yoke i Armbruster |
| bike.mis.rock | Kołysanie biodrami na siodełku — zwykle znak, że siodełko jest za wysoko. | Hips rocking on the saddle — usually a sign the seat is too high. | Yoke i Armbruster + REP (wariant) |
| hk.knee | Unoś kolana na zmianę do wysokości bioder. | Drive your knees up to hip height, one at a time. | Prehab Guys + Carr (wariant) |
| skip.move | Skacz rytmicznie z nogi na nogę, za każdym razem unosząc wysoko kolano. | Skip rhythmically from foot to foot, driving one knee up each time. | Carr + Prehab Guys (wariant: A-skip) |
| car.move | Przesuwaj się bokiem, przekładając nogę na zmianę przed i za drugą nogą. | Move sideways, crossing your trailing leg in front, then behind the other. | Uniwersytet Calgary + Prehab Guys (wariant) |

Istniejące zdania użyte ponownie: `bike.seat`, `bike.foot`, `jump.land`, `walk.upright`, `walk.rails`.

## 5. Otwarte

- **Burpees (partial)** — sesja 2: NASM „Squat Thrust Burpees” (przeczytany ponownie 02.11.2026) daje ustawienie (stopy na szerokość bioder, ręce wzdłuż boków), błąd „biodra opadają w podporze” i miękkie lądowanie; PMC 9517252 (2.3) i ACE 306 (wariant z BOSU) tego nie opisują. Jedyne drugie źródło ustawienia i błędu `plank.mis.sag` to magazyn sieci siłowni (Life Time „Fitness Fix: How to Do the Perfect Burpee”, 2019; stopy na szerokość barków, ciało w jednej linii) — szczebel 5. The Prehab Guys (Burpee) odsyła do filmu, bez opisu. Zostaje bez zmian.
- **Bieg — ustawienie** — bieg nie ma pozycji startowej w sensie ustawienia; propozycja: zostawić `setup` puste i usunąć „Bieg” z `partial` z tym uzasadnieniem (decyzja koordynatora). Wzrok przed siebie — tylko HSS.
- **Rower — ruch** — praca nóg/kolana nad stopą: tylko HSS („knees track over the middle of your feet”); Yoke opisuje kolano nad osią pedału (ustawienie, nie ruch). Brak drugiego źródła.
- **High Knees** — wyprostowany tułów, nie przesuwaj się do przodu, napięty brzuch: tylko The Prehab Guys; Carr mówi o wzroku przed siebie i luźnych barkach, nie o pionie tułowia. Ręce przód–tył: tylko Carr (dla ćwiczenia z wysokim kolanem). Zestaw ogólny (`jump.land`, `jump.mis.stiff`) — żadne przeczytane źródło High Knees go nie potwierdza.
- **Fast Skipping** — katalog nie opisuje ćwiczenia (źródło katalogu L3-S17, oznaczone „jedno źródło”); założenie: skip z wysokim kolanem (A-skip). Jeśli to zwykły szybki skip bez wysokiego kolana — `skip.move` trzeba zawęzić. Tułów prosto, bez skręcania bioder: tylko Prehab (A-skip). Strona NSCA Kinetic Select „High Knee Drills” (fragment „Developing Speed”) — 403 (obie domeny).
- **Carioca Quick Step** — ustawienie tułowia sprzeczne: Calgary — biodra i barki nie obracają się w stronę ruchu („square to line”); Prehab — biodra obracają się z ruchem, „klatka zwrócona bocznie” (niejednoznaczne). Część wspólna niepewna → bez zdania. Lądowanie: Calgary — z przedniej części stopy na piętę, Prehab — na przedniej części stóp; bez zdania. Ugięte biodra i kolana, kolano nad stopą — tylko Calgary.
- **Battle Ropes** — jedno źródło (Bells of Steel); Elevate Rope po rozstrzygnięciu szczebli = 5 dla lin. Zdania gotowe do użycia po znalezieniu drugiego źródła: `bropes.stance` „Stopy na szerokość barków, kolana lekko ugięte, brzuch napięty.”, `bropes.move` „Naprzemiennie unoś i opuszczaj ręce, robiąc na linach fale.”, `bropes.mis.hunch` „Garbienie się i unoszenie barków.” NASM: blog o linach 301, strona ćwiczenia 404.
- **Ski Erg** — jedno źródło (Concept2 „SkiErg Technique”); The Barbell Physio = 5. Zdanie gotowe po drugim źródle: `ski.hinge` „Ciągnij rączki w dół, pochylając tułów w biodrach — nie przysiadaj.”
- **Assault Bike — błędy** — praca samymi nogami przy luźnych rękach, łokcie i kolana na boki, skręcanie tułowia: tylko SMAI. Schwinn AD6 opisuje tylko jazdę z rękami luźno (trening nóg). Strony Assault Fitness (blog „university”) — 404.
- **Skakanka — lądowanie na przedniej części stopy** — tylko B. Lee (oba teksty) i DAN; ACE nie mówi tego wprost.
- **Zestawy ogólne — błędy wykryte** (informacja dla właściciela zestawów):
  - Stair Climber, Orbitrek: ogólne `walk.rails` („…i nie odchylaj do tyłu, bo to zmniejsza wysiłek”) — część o odchylaniu potwierdzona tylko dla bieżni z nachyleniem; dla orbitreka (ruchome rączki) zdanie nie pasuje. Zastąpione `stair.rails` i `ell.grip`.
  - Skakanka, Jumping Jacks, High Knees, Fast Skipping: ogólne `jump.mis.stiff` — dla skakanki żadne źródło nie mówi o sztywnych nogach; dla Jumping Jacks tylko NASM; dla High Knees i Fast Skipping — żadne przeczytane.
- **Szczeble The Prehab Guys i Physitrack** — patrz 3a; od The Prehab Guys zależą High Knees, Fast Skipping, Carioca Quick Step i drugie źródło Jumping Jacks.

## 6. Stan

- Zrobione (02.11.2026, sesja 1): Skakanka, Assault Bike (zamknięcie `open`), Jumping Jacks, Stair Climber, Orbitrek, Treadmill Walking.
- Zrobione (02.11.2026, sesja 2): dopełnienie `partial` — Incline Walk (komplet), Bieg (ruch, wskazówka, błąd), Rower (ustawienie, 3 wskazówki, błąd), Burpees (bez zmian — powód w Otwarte); High Knees, Fast Skipping, Carioca Quick Step — po jednym zdaniu ruchu; Assault Bike — praca rąk i odległość siodełka; przegląd szczebli wg rozstrzygnięć koordynatorów (3a) → Battle Ropes i Ski Erg z „warunkowo” na „otwarte”, Physitrack wyłączony z liczenia.
- Zostało: drugie źródła dla Battle Ropes, Ski Erg, Burpees (wskazówki), Rower (ruch), High Knees (tułów); decyzja koordynatora linii 1.1 o szczeblu The Prehab Guys i Physitrack.
- Następny krok: Ski Erg — szukać drugiej organizacji szkolącej trenerów albo instrukcji innego producenta ergometru narciarskiego; Battle Ropes — producent lin (instrukcja albo poradnik firmowy).
- Pułapki: ExRx 403, web.archive.org zablokowane; assaultfitness.com/blogs/university/* — 404; support.lifefitness.com i support.sportsmith.com — 403; manualowl.com — 403 (manualsdir.com i manualslib.com działają); nsca.com/education/articles/kinetic-select/* — 403 (także dxpprod.nsca.com); brooksrunning.com — 403; canada.humankinetics.com przekierowuje — używać us.humankinetics.com; PDF-y (ACE Fit Facts, CrossFit Journal, StairMaster) WebFetch nie dekoduje — czytać zapisany plik narzędziem Read po stronach; nasm.org `…/high-knees` i `…/battle-ropes` — 404. W tej sesji agent nie miał narzędzia Edit ani Bash — plik aktualizowany pełnym zapisem.
