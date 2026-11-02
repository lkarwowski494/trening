# Wskazówki techniki — rodzina `cardio` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: Skakanka, Assault Bike, Jumping Jacks, High Knees, Stair Climber, Orbitrek, Treadmill Walking, Battle Ropes, Ski Erg,
  Fast Skipping, Carioca Quick Step; sprawdzenie wpisów `open` (Skakanka, Assault Bike). Podsekcja „partial” (Incline Walk, Bieg, Rower, Burpees) — nie zrobiona, patrz „Stan”.
- Metoda: wyjątek dla wskazówek techniki (CLAUDE.md) — zdanie ustalone przy ≥ 2 zgodnych, przeczytanych źródłach szczebla 4 z różnych organizacji.
  Bez liczb (tętno, tempo, czas, kąty) i bez twierdzeń zdrowotnych. Producenci sprzętu (dokumentacja, instrukcje obsługi) — szczebel 4.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Skakanka | general (jump), `open` | **gotowe** | wpis `open` da się zamknąć BEZ DAN: drugie niezależne źródło to B. Lee (CrossFit Journal 2007 + fragment książki „Jump Rope Training”, Human Kinetics — ten sam autor, liczony raz) |
| Assault Bike | general (bike), `open` | **gotowe (krótka karta: ustawienie)** | pytanie „rower stacjonarny jako wariant” przestaje być potrzebne: dwie instrukcje producentów rowerów powietrznych z ruchomymi rączkami (Schwinn Airdyne AD6, REP Fitness) |
| Jumping Jacks | general (jump) | **gotowe** | NASM + The Prehab Guys (+ Physitrack jako wariant) |
| High Knees | general (jump) | otwarte | jedno źródło (The Prehab Guys); Physitrack opisuje wariant przez płotki; NASM — strona 404 |
| Stair Climber | general (cardioMachine) | **gotowe** | StairMaster (instrukcja StepMill 3) + Bells of Steel; zdanie ogólne `walk.rails` niepotwierdzone w części „nie odchylaj do tyłu” → nowe zdanie `stair.rails` |
| Orbitrek | general (cardioMachine) | **gotowe** | Life Fitness (instrukcja X15) + Sunny Health & Fitness; ogólne `walk.rails` nie pasuje (ruchome rączki) |
| Treadmill Walking | general (cardioMachine) | **gotowe** | te same źródła co Incline Walk (wariant: z nachyleniem) |
| Battle Ropes | open | warunkowo (otwarte) | Bells of Steel + Elevate Rope (anonimowy wpis bez roku, producent skakanek) — szczebel drugiego źródła do decyzji |
| Ski Erg | open | warunkowo (otwarte) | Concept2 + The Barbell Physio (strona bez autora i daty) — szczebel drugiego źródła do decyzji |
| Fast Skipping | general (jump) | otwarte | nie badane (limit kontekstu) |
| Carioca Quick Step | open | otwarte | nie badane (limit kontekstu) |

## 2. Blok JSON do `exercises` w `data/zrodla/cues.json`

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
      {"c": "jump.land", "s": [["nasm-jumping-jacks", "Common Mistakes (lądowanie na prostych kolanach, twarde lądowanie; parafraza)"], ["prehab-jumping-jack", "instrukcja (ląduj miękko; parafraza)"], ["physitrack-jumping-jack", "(wariant z przysiadem) krok 4 (lądowanie w ugięciu; parafraza)"]]}
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
Zasada cytatu: najwyżej jedno zdanie cytowane na źródło; reszta odwołań to parafrazy z miejscem.

## 3. Nowe źródła

| id | org | tytuł | url | szczebel | czytane |
|---|---|---|---|---|---|
| ace-fitfacts-rope | ACE | Fit Facts: „Jumping Rope: Not Just for Kids Anymore” (2009) | https://contentcdn.eacefitness.com/assets/education-resources/lifestyle/fitfacts/pdfs/fitfacts/itemid_2688.pdf | 4 | tak, 02.11.2026 (PDF w całości) |
| cfj-lee-rope | B. Lee (CrossFit Journal) | B. Lee, „Jump Rope Basics, Part 1: Preparation”, CrossFit Journal nr 62 (10.2007) | https://library.crossfit.com/premium/pdf/62_07_Jump_Rope_Basics.pdf | 4 | tak, 02.11.2026 (s. 1–5) |
| hk-lee-rope | B. Lee (Human Kinetics) | fragment: B. Lee, „Jump Rope Training”, wyd. 2 — „Improve overall conditioning with these basic jump rope techniques” | https://us.humankinetics.com/blogs/excerpt/improve-overall-conditioning-with-these-basic-jump-rope-techniques | 4 (książka — może 3) | tak, 02.11.2026 |
| schwinn-ad6-manual | Schwinn (Nautilus) | Schwinn Airdyne AD6 — instrukcja obsługi, s. 18 (Operations) | https://www.manualsdir.com/manuals/720676/schwinn-airdyne-ad6.html?page=18 | 4 | tak, 02.11.2026 (kopia instrukcji w serwisie z instrukcjami; oficjalny PDF producenta — 403) |
| rep-airbike-setup | REP Fitness | R. MacPherson (CSCS), „The One Mistake Almost Every Air Bike User Makes” (25.02.2026, akt. 03.08.2026) | https://repfitness.com/blogs/guides/the-one-mistake-almost-every-air-bike-user-makes | 4 | tak, 02.11.2026 |
| nasm-jumping-jacks | NASM | Jumping Jacks | https://www.nasm.org/resource-center/exercise-library/jumping-jacks | 4 | tak, 02.11.2026 |
| prehab-jumping-jack | The Prehab Guys | Jumping Jack | https://theprehabguys.com/vimeo-video/jumping-jack/ | 4 | tak, 02.11.2026 |
| physitrack-jumping-jack | Physitrack | How to perform the jumping jack exercise | https://www.physitrack.com/exercise-library/how-to-perform-the-jumping-jack-exercise | 4 | tak, 02.11.2026 (opis niespójny: krok 1 vs FAQ; użyty tylko jako wariant) |
| stairmaster-sm3-manual | StairMaster | StepMill 3 — Owner's Manual (0300025A), s. 7 | https://cdn.shopify.com/s/files/1/0266/5883/2426/files/Stairmaster_3_Owner_s_Manual_78991996-ae45-4ec3-af2e-dabe93c67f63.pdf | 4 | tak, 02.11.2026 (s. 1–7; plik na serwerze sprzedawcy) |
| bellsofsteel-stair | Bells of Steel | „Is a Stair Climber a Good Workout?” (07.01.2025, bez autora) | https://bellsofsteel.us/blogs/content/is-a-stair-climber-a-good-workout | 4 | tak, 02.11.2026 |
| lf-x15-manual | Life Fitness | X15 Cross-Trainer — User Manual, s. 13, rozdz. 3 Correct Usage | https://www.manualsdir.com/manuals/166184/life-fitness-x15.html?page=14 | 4 | tak, 02.11.2026 (kopia instrukcji w serwisie z instrukcjami) |
| sunny-elliptical-form | Sunny Health & Fitness | „Elliptical proper form workout” (30.07.2021) | https://sunnyhealthfitness.com/blogs/products/elliptical-proper-form-workout | 4 | tak, 02.11.2026 |

Nowe organizacje (propozycja; wszystkie `kind: maker` poza B. Lee):
- „B. Lee (Jump Rope Training)” — `kind: site`, szczebel 4 (autor książki o skakance; dwa teksty tego samego autora = jedno niezależne źródło). Fragment książki mógłby być szczeblem 3 — bez znaczenia dla wyniku.
- Schwinn (Nautilus), REP Fitness, StairMaster, Bells of Steel, Sunny Health & Fitness — producenci sprzętu, szczebel 4. Life Fitness — organizacja już jest w `orgs`.
- Ryzyko: dwie instrukcje czytane z kopii w serwisie z instrukcjami (oryginał producenta niedostępny: 403). Treść to dokument producenta; audytor może zażądać oryginału.

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

Istniejące zdania użyte ponownie: `bike.seat`, `bike.foot`, `jump.land`, `walk.upright`, `walk.rails`.

## 5. Otwarte

- **High Knees** — jedno źródło (The Prehab Guys: tułów wyprostowany, kolano do wysokości biodra, w miejscu; błędy: garbienie/odchylanie, przesuwanie się do przodu). Physitrack opisuje wariant przez płotki; NASM `…/high-knees` — 404; ACE — brak strony. Zestaw ogólny (`jump.land`, `jump.mis.stiff`) — żadne przeczytane źródło High Knees go nie potwierdza.
- **Battle Ropes (warunkowo)** — gotowe zdania, jeśli drugie źródło zostanie uznane: `bropes.stance` „Stopy na szerokość barków, kolana lekko ugięte, brzuch napięty.” (Bells of Steel „How To Correctly Use Battle Ropes?”, 16.04.2025, Basic Wave; Elevate Rope „Battle Ropes 101”, Alternating waves), `bropes.move` „Naprzemiennie unoś i opuszczaj ręce, robiąc na linach fale.” (oba), `bropes.mis.hunch` „Garbienie się i unoszenie barków.” (oba, Common Mistakes). Powód: Elevate Rope — wpis „Admin” bez roku, producent skakanek (nie lin). Blog NASM o linach przekierowuje na ogólną bibliotekę (301), strona ćwiczenia — 404.
- **Ski Erg (warunkowo)** — Concept2 „SkiErg Technique” (start, ciąg z zawiasu biodrowego, finisz z rączkami przy udach, powrót) + The Barbell Physio (The Drive: zawias, nie przysiad; The Follow Through) — strona bez autora i daty. Gotowe zdanie przy uznaniu: `ski.hinge` „Ciągnij rączki w dół, pochylając tułów w biodrach — nie przysiadaj.” Brak drugiej organizacji szkolącej trenerów/producenta.
- **Assault Bike — ruch** — praca rąk (pchanie i ciąganie rączek razem z pedałowaniem) i dobór odległości siodełka (lekko ugięty łokieć przy najdalszej rączce) — jedno źródło (REP Fitness). Schwinn AD6 opisuje tylko jazdę z rękami luźno (trening nóg). Strony Assault Fitness (blog „university”) — 404.
- **Skakanka — lądowanie na przedniej części stopy** — tylko B. Lee (oba teksty) i DAN; ACE nie mówi tego wprost. Zostaje jako jedno źródło (DAN nadal ze spornym szczeblem).
- **Zestawy ogólne — błędy wykryte** (informacja dla właściciela zestawów):
  - Stair Climber, Orbitrek: ogólne `walk.rails` („…i nie odchylaj do tyłu, bo to zmniejsza wysiłek”) — część o odchylaniu potwierdzona tylko dla bieżni z nachyleniem; dla orbitreka (ruchome rączki) zdanie nie pasuje. Zastąpione `stair.rails` i `ell.grip`.
  - Skakanka, Jumping Jacks, High Knees, Fast Skipping: ogólne `jump.mis.stiff` — dla skakanki żadne źródło nie mówi o sztywnych nogach (mówią: nisko i lekko); dla Jumping Jacks tylko NASM.
- **Fast Skipping, Carioca Quick Step** — nie badane w tej sesji.

## 6. Stan

- Zrobione (02.11.2026): Skakanka, Assault Bike (zamknięcie `open`), Jumping Jacks, Stair Climber, Orbitrek, Treadmill Walking — gotowe; High Knees — otwarte; Battle Ropes, Ski Erg — warunkowo.
- Zostało: Fast Skipping, Carioca Quick Step; podsekcja „partial”: Incline Walk (brak setup/move/mistakes), Bieg (brak setup/move/mistakes), Rower (brak move/tips/mistakes), Burpees (brak setup/tips/mistakes).
- Następny krok: Burpees — NASM „Squat Thrust Burpees” i PMC 9517252 są już źródłami; sprawdzić, czy oba mówią o ciele w linii w podporze (zdanie `plank.noSag`) i o miękkim lądowaniu. Rower — drugi producent/serwis o pracy nóg bez kołysania biodrami (REP wspomina kołysanie bioder przy za wysokim siodełku — jedno źródło).
- Pułapki: ExRx 403, web.archive.org zablokowane; assaultfitness.com/blogs/university/* — 404; support.lifefitness.com i support.sportsmith.com — 403; manualowl.com — 403 (manualsdir.com działa); PDF-y (ACE Fit Facts, CrossFit Journal, StairMaster) WebFetch nie dekoduje — czytać zapisany plik narzędziem Read po stronach; nasm.org `…/high-knees` i `…/battle-ropes` — 404.
