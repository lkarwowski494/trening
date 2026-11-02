# Wskazówki techniki — rodzina `cable_row` (fala W1, G6)

- Data: 02.11.2026 (dwie sesje; druga — kontynuacja od „Stanu” i zastosowanie rozstrzygnięcia koordynatora o szczeblach z 02.11.2026)
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `cable_row` bez własnych wskazówek — Single Arm Cable Row, Machine Row, Standing Cable Row, Kneeling High Pulley Row,
  Leverage High Row, Cable Rope Rear-Delt Rows, Sled Row.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1 (praca NIEDOKOŃCZONA — patrz „Stan”)
- **Przeliczenie koordynatora 02.11.2026 — nadrzędne; sekcja na końcu pliku.**

Metoda jak w `row.md` (ta sama fala): ≥ 2 przeczytane (WebFetch, 02.11.2026) źródła szczebla 4 z różnych organizacji o TYM ćwiczeniu (wariant sprzętu
oznaczony); strony aplikacji treningowych wykluczone; zdania zestawu ogólnego bez potwierdzenia nie przechodzą; bez liczb. Szczeble wg rozstrzygnięcia
koordynatora (02.11.2026): szczebel 4 = organizacja szkoląca trenerów / serwis z redakcją i recenzją ekspercką / producent dla własnego rodzaju sprzętu,
z autorem i datą albo treścią firmowaną, bez marketingu i afiliacji; sprzedawcy, sieci i blogi siłowni = 5.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Single Arm Cable Row | general (row) | gotowe (krótka karta) | katalog dopuszcza wyciąg dolny, środkowy i ławkę do wiosłowania — zdania niezależne od pozycji; wskazówki i błędy — otwarte |
| Machine Row | general (row) | gotowe (karta + 1 błąd) | NASM (oparcie pleców), Physitrack i Healthline (podpora klatki) — zdania obejmują część wspólną; doszedł błąd `mis.jerk` (NASM, Healthline) |
| Cable Rope Rear-Delt Rows | general (faceRow) | gotowe (krótka karta) | Major Fitness, Bells of Steel (wariant: szeroki drążek), Fitness Volt (szczebel do decyzji); dwa zdania zestawu ogólnego nie przechodzą (sprzeczność / jedno źródło) |
| Standing Cable Row | general (row) | otwarte (było: częściowe) | Your House Fitness to blog sieci siłowni → szczebel 5; zostaje 1 źródło (Physitrack) |
| Kneeling High Pulley Row | general (row) | otwarte | przeczytane: Fitness Volt (tekst z free-exercise-db → 5), Dynamo Fitness (sprzedawca, wariant V → 5) |
| Leverage High Row | general (row) | otwarte | Fitness Volt (szczebel do decyzji) + Set For Set (marka odzieżowa → 5); zestaw ogólny `row.fullStretch` przeczy Fitness Volt |
| Sled Row | open | otwarte | tylko Generation Iron (wariant „sled pull” stojąc, strona z deklaracją afiliacji); reszta to aplikacje, free-exercise-db lub serwisy otwarte |

## 2. Blok JSON do `exercises` w `data/zrodla/cues.json` — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "Single Arm Cable Row": {
    "setup": [
      {"c": "cr1.setup", "s": [["ace-337", "Step 2–3 (single handle on the cable pulley, one hand)"], ["prehabguys-single-arm-row-cable", "HOW (cable set-up, single arm row)"]]}
    ],
    "move": [
      {"c": "cr1.pull", "s": [["ace-337", "Step 3; Step 5 (pull the handle toward your body; slowly straighten the arm)"], ["prehabguys-single-arm-row-cable", "HOW (drive your elbow towards your back pocket; arm straightens on the return)"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Machine Row": {
    "setup": [
      {"c": "mrow.setup", "s": [["nasm-seated-machine-row-close-grip", "Step 1–2 (adjust seat to the handles, feet on the platform, grip the handles)"], ["physitrack-seated-row-machine", "instrukcja (sit upright, adjust handles and chest pad, choose a grip)"], ["healthline-seated-row", "How to do a seated row, setup (adjust seat and chest pad so shoulders are level with the handles; sit upright; hold the handle)"]]}
    ],
    "move": [
      {"c": "mrow.pull", "s": [["nasm-seated-machine-row-close-grip", "Step 3–4 (pull toward your torso driving the elbows back; lower)"], ["physitrack-seated-row-machine", "instrukcja (pull until elbows are just past your sides; return to start)"], ["healthline-seated-row", "How to do a seated row, pull and return (bend the elbows keeping them tucked; slowly extend the arms)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mis.jerk", "s": [["nasm-seated-machine-row-close-grip", "Common mistakes (jerking the weight)"], ["healthline-seated-row", "Common mistakes: swinging torso; rapid movements (wariant: seated row machine / cable)"]]}
    ]
  },
  "Cable Rope Rear-Delt Rows": {
    "setup": [
      {"c": "rdcr.setup", "s": [["majorfitness-cable-rear-delt-row", "Setup (cable at chest height, rope, palms facing down, step back until the cable is taut)"], ["bellsofsteel-rear-delt-cable", "Cable Wide-Grip Row (wariant: szeroki drążek zamiast liny; pulley at chest height, overhand grip, step back until under tension)"], ["fitnessvolt-cable-rear-delt-row-rope", "Instructions, step 1 (rope at about mid-chest level, stand a few feet back) — szczebel do decyzji"]]}
    ],
    "move": [
      {"c": "rdcr.pull", "s": [["majorfitness-cable-rear-delt-row", "Movement; Return (elbows flared perpendicular to the body, pull toward the shoulders; slowly let the rope return)"], ["bellsofsteel-rear-delt-cable", "Cable Wide-Grip Row (wariant: drążek; elbows high and wide, pull to upper chest, return slowly)"], ["fitnessvolt-cable-rear-delt-row-rope", "Instructions, steps 2–3 (flare elbows out, pull toward mid-chest; slowly straighten the arms forward) — szczebel do decyzji"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Uwaga do Machine Row: źródło `physitrack-seated-row-machine` jest w cues.json organizacją szczebla 4 (biblioteka ćwiczeń dla fizjoterapeutów), ale Physitrack to platforma
oprogramowania do zlecania ćwiczeń — koordynator może chcieć ocenić ją ponownie wg punktu „dokumentacja innych aplikacji”. Machine Row nie zależy od tej oceny:
zdania mają też NASM + Healthline.

Uwaga do Cable Rope Rear-Delt Rows: każdy element zdań ma ≥ 2 źródła szczebla 4 bez Fitness Volt (Major Fitness, Bells of Steel — obaj producenci sprzętu
kablowego, treść firmowana z datą); lina: Major Fitness + Fitness Volt — przy odrzuceniu Fitness Volt słowo „lina” w `rdcr.setup` ma 1 źródło i trzeba je zastąpić
„uchwyt” (Bells of Steel to wariant z drążkiem). Wysokość końca ruchu: Bells of Steel — górna część klatki, Fitness Volt — środek klatki, Major Fitness — barki;
zdanie mówi „górna część klatki” (część wspólna przedziału).

## 3. Nowe źródła (przeczytane WebFetch 02.11.2026)

| id | org | tytuł | url | szczebel |
|---|---|---|---|---|
| ace-337 | ACE (istnieje) | Single Arm Row (cable) | https://www.acefitness.org/resources/everyone/exercise-library/337/single-arm-row/ | 4 |
| prehabguys-single-arm-row-cable | The Prehab Guys (istnieje) | Single Arm Row – Cable | https://theprehabguys.com/vimeo-video/single-arm-row-cable/ | 4 (przeliczenie 02.11.2026: **5**) |
| physitrack-seated-row-machine | Physitrack (istnieje) | Seated row, machine | https://us.physitrack.com/home-exercise-video/seated-row%252c-machine | 4 (org do ponownej oceny — patrz uwaga wyżej; przeliczenie 02.11.2026: **5**) |
| physitrack-cable-rowing-standing | Physitrack (istnieje) | Cable Machine Rowing in Standing | https://ie.physitrack.com/home-exercise-video/cable-machine-rowing-in-standing | 4 (jw.; przeliczenie 02.11.2026: **5**) |
| yourhouse-cable-row | Your House Fitness (nowa) | Exercise Tutorial: Cable Row | https://www.yourhousefitness.com/blog/exercise-tutorial-cable-row | **5** — blog sieci siłowni (rozstrzygnięcie 02.11) — nie liczy się |
| healthline-seated-row | Healthline (nowa) | Seated Row: muscles, how-to, variations | https://www.healthline.com/health/seated-row | 4 — serwis z redakcją i recenzją medyczną (autorka, recenzent DPT, data 31.05.2019) |
| majorfitness-cable-rear-delt-row | Major Fitness (proponowana w `row.md`) | How to Do a Cable Rear Delt Row | https://www.majorfitness.com/blogs/training-tips/how-to-do-a-cable-rear-delt-row | 4 — producent sprzętu kablowego (bramy/wyciągi, akcesoria), treść firmowana, data 02.08.2024; bez autora, linki do własnych produktów |
| bellsofsteel-rear-delt-cable | Bells of Steel (proponowana w `row.md`) | The Ultimate Guide to Rear Delt Cable Exercises | https://bellsofsteel.us/blogs/content/rear-delt-cable-exercises | 4 — producent wyciągów, treść firmowana, data 06.12.2023; bez autora, linki do własnych produktów; użyty wariant „Cable Wide-Grip Row” |
| fitnessvolt-cable-rear-delt-row-rope | Fitness Volt (proponowana w `row.md`) | Standing Cable Rear Delt Row with Rope | https://fitnessvolt.com/standing-cable-rear-delt-row-with-rope | **do decyzji** — autor z biogramem (MD), daty 2019/2024, brak recenzji eksperckiej, w panelu bocznym zestawienia produktów; przy ścisłym kryterium (a) — 5 |
| fitnessvolt-machine-high-row | Fitness Volt | Machine High Row (Seated High Row) | https://fitnessvolt.com/24579/machine-high-row/ | do decyzji (jw.) |
| setforset-machine-high-row | Set For Set (nowa) | Machine High Row | https://www.setforset.com/blogs/news/machine-high-row | **5** — marka odzieżowa, nie producent sprzętu; w `row.md` tekst tej marki powielał inny serwis |
| fitnessvolt-khpr | Fitness Volt | Kneeling High Pulley Row Alternatives (sekcja „Original Exercise”) | https://fitnessvolt.com/substitute-exercises/kneeling-high-pulley-row-alternatives | **5** — kroki to tekst z free-exercise-db (zestawienie zamienników) |
| dynamo-kneeling-incline-row | Dynamo Fitness (nowa) | Kneeling Cable Close Grip Incline Row | https://blog.dynamofitness.com.au/exercise-archives/kneeling-cable-close-grip-incline-row | **5** — sprzedawca sprzętu, artykuł kończy się wezwaniem do zakupu, bez daty |
| generationiron-sled-push-pull | Generation Iron | Sled push/pull exercises | https://generationiron.com/sled-push-pull-exercises/ | do decyzji — autor z kwalifikacjami (ACSM CPT), data 07.08.2025, ale deklaracja linków afiliacyjnych |

Istniejące źródło użyte ponownie: `nasm-seated-machine-row-close-grip` — przeczytane ponownie 02.11.2026; opisuje maszynę (oparcie pleców, podest na stopy),
więc dla Machine Row jest źródłem wprost.

Przeczytane, nie liczone: Physitrack „Cable machine rear deltoid row” (uk.physitrack.com/home-exercise-video/cable-machine-rear-deltoid-row) — opisuje wersję z wyciągu
górnego w klęku jednonóż, ruch do głowy (bliżej przyciągania liny do twarzy niż wiosłowania na tylne aktony stojąc); Physitrack „High cable row” (exercise-library) —
wersja stojąc, nie w klęku; Life Fitness, strona maszyny Iso-Lateral High Row — brak instrukcji wykonania; PDF Uniwersytetu Sussex „half kneeling cable high pull” —
tekst nieczytelny (obrazy), nie źródło.
Niedostępne/wykluczone: silversneakers.com (403), exrx.net (403); strony aplikacji treningowych (wiele wyników dla Kneeling High Pulley Row, Leverage High Row, Sled Row) —
wykluczone; bodybuilding.com (przekierowanie, tekst free-exercise-db = 5); muscleandstrength.com — „otwarte, nie licz” wg rozstrzygnięcia.

## 4. Nowe zdania

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| cr1.setup | Przypnij pojedynczy uchwyt do wyciągu i chwyć go jedną ręką. | Clip a single handle to the cable and hold it in one hand. | ACE, The Prehab Guys |
| cr1.pull | Przyciągnij uchwyt, prowadząc łokieć w tył, potem powoli wyprostuj rękę. | Pull the handle by driving your elbow back, then slowly straighten your arm. | ACE, The Prehab Guys |
| mrow.setup | Ustaw siedzisko pod uchwyty, usiądź prosto i chwyć uchwyty. | Set the seat to the handles, sit tall and grab the handles. | NASM, Physitrack, Healthline |
| mrow.pull | Przyciągnij uchwyty do tułowia, łokcie w tył; wróć do pozycji wyjściowej. | Pull the handles to your torso, elbows back; return to the start. | NASM, Physitrack, Healthline |
| rdcr.setup | Ustaw wyciąg mniej więcej na wysokości klatki, chwyć końce liny nachwytem i cofnij się, aż linka się napnie. | Set the cable at about chest height, grab the rope ends overhand and step back until the cable is taut. | Major Fitness, Bells of Steel (wariant: drążek), Fitness Volt (do decyzji) |
| rdcr.pull | Łokcie szeroko na boki; przyciągnij linę w stronę górnej części klatki, potem wróć powoli do wyprostu rąk. | Elbows wide to the sides; pull the rope toward your upper chest, then return slowly until your arms are straight. | Major Fitness, Bells of Steel (wariant: drążek), Fitness Volt (do decyzji) |
| scrow.setup | Chwyć uchwyt wyciągu oburącz i stań przodem do maszyny. | Grab the cable handle with both hands and stand facing the machine. | NIE DO APLIKACJI — tylko Physitrack (Your House Fitness = 5) |
| scrow.pull | Przyciągnij uchwyt do tułowia, potem wróć powoli, pod kontrolą. | Pull the handle to your torso, then return slowly and under control. | NIE DO APLIKACJI — jw. |

Istniejące zdanie użyte: `mis.jerk` (Machine Row). Zdania `row.*` z `row.md` (`row.pauseTop`, `row.elbowsLead`, `row.slowDown`) sprawdzone dla każdego wariantu —
żadne nie ma tu 2 źródeł szczebla 4 (szczegóły w „Otwarte”).

## 5. Otwarte

- **Standing Cable Row** — [OTWARTE] (było „częściowe”): po rozstrzygnięciu z 02.11 Your House Fitness ma szczebel 5; zostaje 1 źródło (Physitrack). Źródła różniły się
  też wysokością wyciągu (klatka vs biodra), łokciami i ustawieniem nóg. Proponowany wcześniej blok JSON wycofany; potrzebne drugie źródło szczebla 4.
- **Single Arm Cable Row — wskazówki i błędy**: pauza na końcu (`row.pauseTop`; tylko ACE), ściągnięcie łopatki i „nie wzruszaj barkami, nie wyginaj pleców”
  (tylko The Prehab Guys) — po jednym źródle. Healthline opisuje wersję jednorącz tylko jako utrudnienie („ciągnij wzdłuż boku”), bez błędów.
- **Machine Row — inne błędy i sprzeczność z zestawem ogólnym**: NASM każe NIE prostować rąk do końca na powrocie („stop short of fully straightening”), a Healthline
  pisze, że częściowy wyprost nie pracuje mięśni w pełni — sprzeczność na tym samym szczeblu; zdanie `row.fullStretch` (zestaw ogólny) nie wolno używać dla Machine Row,
  a zdanie o skracaniu ruchu też nie przechodzi. Wzruszanie barkami (Healthline) i zaokrąglanie barków / ciągnięcie samymi rękami (NASM) — po jednym źródle.
- **Cable Rope Rear-Delt Rows — zestaw ogólny**: `fp.chest` („tułów wyprostowany”) — Major Fitness: stój prosto, nie pochylaj się; Bells of Steel (wariant drążek):
  lekko pochyl się w biodrach → sprzeczność, nie używać. Ściąganie łopatek: Fitness Volt i Bells of Steel — ściągaj, Major Fitness — NIE ściągaj (błąd) → sprzeczność,
  nie używać `scr.chest`. `fp.elbowsBack` / `row.elbowsLead` — tylko Major Fitness. `mis.jerk` — żadne przeczytane źródło o tym wariancie. „Nie przyciskaj łokci
  do tułowia” jako błąd — tylko Major Fitness wprost (pozostałe mówią o łokciach szeroko jako instrukcji). Oddech (wydech przy przyciąganiu) — Fitness Volt i Major
  Fitness zgodnie; w słowniku nie ma zdań o oddechu w rodzinie — nowa kategoria do decyzji, nie dodawane.
- **Kneeling High Pulley Row** — [OTWARTE]: przeczytane Fitness Volt (kroki z free-exercise-db → 5) i Dynamo Fitness (sprzedawca → 5; wariant z uchwytem V w klęku
  jednonóż). Sprzeczność między nimi: łokcie na zewnątrz (Fitness Volt) vs przy tułowiu (Dynamo). Zestaw ogólny (`scr.chest`, `scr.control`, `mis.jerk`) — niepotwierdzony
  przez żadne źródło szczebla 4. Kandydaci do sprawdzenia: producenci wyciągów z poradnikami (Bells of Steel, Major Fitness — wyszukiwanie nie dało strony o tym ćwiczeniu).
- **Leverage High Row** — [OTWARTE]: Fitness Volt (szczebel do decyzji) + Set For Set (5). Gdyby Fitness Volt dostał 4, nadal 1 źródło. Część wspólna obu (do przyszłego
  zdania): ustaw siedzisko i wałki na uda pod siebie; przyciągaj uchwyty, prowadząc łokcie w tył; krótka pauza; powolny powrót. Zestaw ogólny: Fitness Volt każe nie
  prostować łokci do końca na górze — przeczy `row.fullStretch` (obecny zestaw ogólny tego ćwiczenia!); `scr.chest` i `scr.control` — niepotwierdzone. Life Fitness
  (producent maszyny) — strona bez instrukcji.
- **Sled Row** — [OTWARTE]: tylko Generation Iron (wariant stojąc w „sled pull”: przodem do sań, krok w tył z wyprostowanymi rękami, przyciągnij sanie jak przy wiosłowaniu);
  pozostałe wyniki to aplikacje, free-exercise-db (5), Muscle & Strength (otwarte — nie liczyć), serwisy bez oceny (stack.com, insidefitnessmag.com — nieprzeczytane).
- **Szczebel Fitness Volt i Generation Iron** — do decyzji koordynatora wg kryteriów (a)–(c): oba mają autora z kwalifikacjami i datę, brak recenzji eksperckiej;
  Generation Iron deklaruje linki afiliacyjne, Fitness Volt ma w panelu zestawienia produktów. Dotyczy też `row.md`.

## 6. Stan

- Zrobione: Single Arm Cable Row, Machine Row (gotowe, Machine Row z 1 błędem i trzecim źródłem Healthline), Cable Rope Rear-Delt Rows (gotowe, krótka karta);
  Standing Cable Row przeniesione do otwartych (szczebel 5 bloga sieci siłowni); Kneeling High Pulley Row, Leverage High Row, Sled Row — zbadane, otwarte z powodem;
  oceny źródeł zaktualizowane wg rozstrzygnięcia z 02.11.2026.
- Zostało: drugie źródło szczebla 4 dla Standing Cable Row, Kneeling High Pulley Row, Leverage High Row (np. producenci maszyn dźwigniowych z instrukcją na naklejce/PDF
  instrukcji obsługi), Sled Row (producenci sań); wskazówki i błędy dla Single Arm Cable Row; decyzja o szczeblu Fitness Volt / Generation Iron / Physitrack.
- Następny krok: instrukcje obsługi (PDF) producentów maszyn high row (Life Fitness — „owner's manual”/„placard”), poradniki producentów sań; dla Standing Cable Row —
  ACE/NASM wersja stojąc (wyszukać w bibliotekach ćwiczeń).
- Pułapki: exrx.net 403; muscleandstrength.com 403 (i tak „otwarte, nie licz”); bodybuilding.com/exercises przekierowuje (404); silversneakers.com 403;
  adresy barbend.com/?p=… i breakingmuscle.com/?p=… z wyszukiwarki prowadzą do strony głównej; większość wyników to strony aplikacji (wykluczone);
  strony „substitute-exercises” Fitness Volt mają kroki skopiowane z free-exercise-db (5); PDF-y Uniwersytetu Sussex są obrazami (WebFetch nie czyta tekstu).

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3); kryterium karty z decyzji 02.11.2026.

### Źródła → szczebel

| Źródło | Szczebel | Dowód |
|---|---|---|
| `ace-337` (ACE) | 4 | organizacja certyfikująca, strona firmowana |
| `nasm-seated-machine-row-close-grip` (NASM) | 4 | organizacja certyfikująca |
| `healthline-seated-row` (Healthline) | **4** | uzup. 3 (warunkowo 4: autor, data, nazwany recenzent z kwalifikacjami). WebFetch 02.11.2026: „Medically reviewed by Gregory Minnis, DPT — Written by Kirsten Nunez on May 31, 2019” |
| `prehabguys-single-arm-row-cable` (The Prehab Guys) | **5** | `g6-szczeble-uzupelnienie-2.md`, tabela 1: biblioteka wideo bez autora, przycisk sprzedaży programu; uzup. 2: liczy się tylko artykuł z autorem |
| `physitrack-seated-row-machine`, `physitrack-cable-rowing-standing` | **5** | uzup. 2 (Physitrack = 5) |
| `majorfitness-cable-rear-delt-row` (Major Fitness) | 4 | producent sprzętu kablowego — własny rodzaj sprzętu (rozstrzygnięcie dla producentów); treść firmowana, data 02.08.2024 |
| `bellsofsteel-rear-delt-cable` (Bells of Steel) | 4 | producent wyciągów — własny rodzaj sprzętu; treść firmowana, data 06.12.2023 |
| `fitnessvolt-cable-rear-delt-row-rope` (Fitness Volt) | 4 (warunkowo spełnione) | uzup. 3: autor z kwalifikacjami w podpisie i data — w pliku: autor z biogramem (MD), daty 2019/2024; bez nazwanego recenzenta (wątpliwość — STAN, decyzja 8) |
| `fitnessvolt-machine-high-row` | nie oceniane per strona | bez wpływu (Leverage High Row ma i tak jedno źródło) |
| `generationiron-sled-push-pull` | 5 | uzup. 3: liczy się tylko autor z listy ekspertów GI; deklaracja afiliacji; bez wpływu (Sled Row otwarte) |
| `yourhouse-cable-row`, `setforset-machine-high-row`, `fitnessvolt-khpr`, `dynamo-kneeling-incline-row` | 5 | bez zmian |

### Zdania → stan

| Zdanie | Ćwiczenie | Źródła po przeliczeniu | Stan |
|---|---|---|---|
| `cr1.setup`, `cr1.pull` | Single Arm Cable Row | tylko ACE | **spadają** |
| `mrow.setup`, `mrow.pull` | Machine Row | NASM + Healthline | zostają (Physitrack usunięty) |
| `mis.jerk` | Machine Row | NASM + Healthline (błąd wprost w obu) | zostaje |
| `rdcr.setup`, `rdcr.pull` | Cable Rope Rear-Delt Rows | Major Fitness + Bells of Steel (wariant: drążek) + Fitness Volt | zostają; słowo „lina” — Major Fitness + Fitness Volt |

### Karty → stan

| Ćwiczenie | Stan | Powód |
|---|---|---|
| Machine Row | **własna z błędami** | ustawienie + ruch + `mis.jerk` (NASM + Healthline) |
| Cable Rope Rear-Delt Rows | własna bez błędów | ustawienie + ruch |
| Single Arm Cable Row | **otwarta** (było: gotowe) | The Prehab Guys = 5 → jedno źródło |
| Standing Cable Row, Kneeling High Pulley Row, Leverage High Row, Sled Row | otwarte | bez zmian |

Liczby: przed — gotowe 3, otwarte 4; po — własne z błędami 1, własne bez błędów 1, otwarte 5.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

```json
{
  "Machine Row": {
    "setup": [
      {"c": "mrow.setup", "s": [["nasm-seated-machine-row-close-grip", "Step 1–2 (adjust seat to the handles, feet on the platform, grip the handles)"], ["healthline-seated-row", "How to do a seated row, setup (adjust seat and chest pad so shoulders are level with the handles; sit upright; hold the handle)"]]}
    ],
    "move": [
      {"c": "mrow.pull", "s": [["nasm-seated-machine-row-close-grip", "Step 3–4 (pull toward your torso driving the elbows back; lower)"], ["healthline-seated-row", "How to do a seated row, pull and return (bend the elbows keeping them tucked; slowly extend the arms)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "mis.jerk", "s": [["nasm-seated-machine-row-close-grip", "Common mistakes (jerking the weight)"], ["healthline-seated-row", "Common mistakes: swinging torso; rapid movements (wariant: seated row machine / cable)"]]}
    ]
  },
  "Cable Rope Rear-Delt Rows": {
    "setup": [
      {"c": "rdcr.setup", "s": [["majorfitness-cable-rear-delt-row", "Setup (cable at chest height, rope, palms facing down, step back until the cable is taut)"], ["bellsofsteel-rear-delt-cable", "Cable Wide-Grip Row (wariant: szeroki drążek zamiast liny; pulley at chest height, overhand grip, step back until under tension)"], ["fitnessvolt-cable-rear-delt-row-rope", "Instructions, step 1 (rope at about mid-chest level, stand a few feet back)"]]}
    ],
    "move": [
      {"c": "rdcr.pull", "s": [["majorfitness-cable-rear-delt-row", "Movement; Return (elbows flared perpendicular to the body, pull toward the shoulders; slowly let the rope return)"], ["bellsofsteel-rear-delt-cable", "Cable Wide-Grip Row (wariant: drążek; elbows high and wide, pull to upper chest, return slowly)"], ["fitnessvolt-cable-rear-delt-row-rope", "Instructions, steps 2–3 (flare elbows out, pull toward mid-chest; slowly straighten the arms forward)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

Nowe zdania w bloku: `mrow.setup`, `mrow.pull`, `rdcr.setup`, `rdcr.pull` (4). Przy ścisłym odczycie reguły Fitness Volt (wymagany nazwany recenzent) w `rdcr.setup` zamienić „liny” na „uchwyt” (Bells of Steel — wariant z drążkiem).
