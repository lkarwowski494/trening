# Lista per ćwiczenie — partia 3: karty własne i figury v1 (31.10.2026)

Stany porównane: **1.0** = build 1033, tag `v1.0.0-b1033` (fced34b, `docs/48` Z-26); **1.1** = `integracja-1-1` @ 1c683be (scalona do gałęzi audytu). Widoczność policzona kodem aplikacji w obu drzewach (ładowanie TS jak `scripts/strona/ts-loader.mjs`): `CUE_DATA.exercises`, `shownFigureSpec`, `V2_WSTRZYMANE` (1.0) / `figureWithheld` (1.1), `figureByKey` — ta sama logika co `components/ExerciseCues.tsx:45`.

## Liczby (z kodu)

| | 1.0 | 1.1 |
|---|---|---|
| Karty własne pokazywane (`lib/cues/data.json` exercises) | 101 | 97 |
| Karty ukryte (`hidden`) | 1 (Hack Squat) | 5 (Bent Over Row ×2, T-Bar Row, Skullcrusher (EZ), Hack Squat) |
| Figury v1 w danych (`lib/figures/data.json`) | 68 | 67 (15 „zastąpionych”) |
| Figury v1 **widoczne** | 53 | 52 |
| Karty z rysunkiem v2 | 15 (squat/bench_press/hinge — partia 2) | 0 |
| Karty bez rysunku | 33 (31 bez figury + 2 wstrzymane v2) | 45 (30 bez figury + 15 wstrzymanych) |
| Id zdań kart własnych / w 33 słownikach bazowych | 304 / brak 0 | 300 / brak 0 |

Figury v1 sprawdzone: **56** różnych (49 widocznych w obu wersjach, 4 tylko w 1.0: Bent Over Row ×2, T-Bar Row, Skullcrusher (EZ); 3 tylko w 1.1: Push Press, Pendlay Row, Reverse Lunge) + 2 wersje 1.0 zmienionych w 1.1 (Walking Lunges, Step Up). 15 figur v1 „zastąpionych” nie jest widocznych w żadnej wersji (w 1.0 zamiast nich v2, w 1.1 nic) — bez oceny.

## Metoda (każda pozycja, bez próbkowania)

- **Treść karty:** przeczytane wszystkie 101 kart 1.0 (PL, 452 odwołania do zdań) i zmiany 1.1 (Pendlay Row, RDL ×2: `rdl.knees` → `rdl.mis.knees`; nowe brzmienia `calf.edge`, `skull.depth`). Kryteria: zdanie opisuje to ćwiczenie i sprzęt, sekcje się nie przeczą, brak twierdzeń o zdrowiu bez odesłania.
- **Źródła:** skrypt na `data/zrodla/cues.json` (oba drzewa): każde zdanie każdej karty ma ≥ 2 źródła z różnych organizacji — 452/452 (1.0), 433/433 (1.1); sekcje runtime = sekcje w źródłach (0 rozbieżności). Przeczytane wyrywkowo: 1 (NASM Bench Dips, krok 3: „until your elbows bend to approximately 90 degrees” — zgodne z `bdip.move`); ExRx zwrócił 403.
- **Języki:** 33 słowniki bazowe (+ es-419/pt-BR jako nakładki) — brak 0 zdań kart; liczby w zdaniu zgodne z PL (2 różnice to „90” zamiast „kąta prostego” w id i „1” w ja — poprawne).
- **Figury v1:** arkusz PNG wszystkich klatek kluczowych każdej figury (renderer PIL z kształtów `figureFrames`, poza repo), pomiary punktów `framePoints`/`jointAngles`, sprawdzenia `why` (0 niespełnionych), przejście pętli co 0,05 (`poseBetween` + `shapes`) — kształty ciała pod linią podłogi.
- **Karta a figura:** porównanie każdego zdania „Ustawienie/Ruch/Wskazówki” z klatkami (kąt, tor, ustawienie, sprzęt); uwagi z recenzji v1 (`docs/research/figury-recenzja.json`) i backlogu (`docs/21`) nie są zgłaszane ponownie.

## Tabela (jedna linia na ćwiczenie)

| Ćwiczenie | Karta 1.0 | Karta 1.1 | Rysunek 1.0 | Rysunek 1.1 | Treść karty (źródła ≥ 2 org., 35 jęz.) | Karta a rysunek v1 / uwagi |
|---|---|---|---|---|---|---|
| Back Extension | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Back Squat | tak | tak | v2 (squat) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Barbell Curl | tak | tak | v1 | v1 | ok | zgodne (łokieć 0–14° od pionu, przedramię prawie pionowo) |
| Bench Press (hantle) | tak | tak | v2 (bench_press) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Bench Press (sztanga) | tak | tak | v2 (bench_press) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Bent Over Row (hantle) | tak | ukryta | v1 | brak | ok | zgodne; w 1.1 ukryta (wpis v1 nieaktualny) |
| Bent Over Row (sztanga) | tak | ukryta | v1 | brak | ok | zgodne (sztanga z wyprostu rąk do brzucha, kolana ok. 20°); w 1.1 ukryta (wpis v1 nieaktualny) |
| Biceps Curl (hantle) | tak | tak | v1 | v1 | ok | zgodne |
| Bieg | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Bird Dog | tak | tak | v1 | v1 | ok | zgodne (dalsza noga 1,2 j. poniżej podłogi — pomijalne) |
| Box Jump | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Bulgarian Split Squat (hantle) | tak | tak | v1 | v1 | ok | zgodne (tylne kolano 5,2 j. nad podłogą) |
| Burpees | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Cable Curl | tak | tak | v1 | v1 | ok | zgodne |
| Cable Fly | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Cable Lateral Raise | tak | tak | v1 | v1 | ok | zgodne |
| Cable Overhead Extension | tak | tak | v1 | v1 | ok | zgodne |
| Calf Press (leg press) | tak | tak | v1 | v1 | ok | zgodne |
| Chest Fly (hantle) | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Chest Supported Row | tak | tak | v1 | v1 | ok | zgodne |
| Chin Up | tak | tak | v1 | v1 | ok | zgodne (jak Pull Up) |
| Close Grip Bench Press | tak | tak | brak (wstrzymana) | brak (wstrzymana) | ok | 1.0: v2 wstrzymana, karta bez rysunku; 1.1: wstrzymana |
| Crunch | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Dead Bug | tak | tak | v1 | v1 | ok | zgodne (przeciwne kończyny, dłoń i stopa nad podłogą) |
| Deadlift (hantle) | tak | tak | v2 (hinge) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Deadlift (sztanga) | tak | tak | brak (wstrzymana) | brak (wstrzymana) | ok | 1.0: v2 wstrzymana (V2_WSTRZYMANE), karta bez rysunku; 1.1: wstrzymana |
| Diamond Push Up | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| EZ Bar Curl | tak | tak | v1 | v1 | ok | zgodne |
| Face Pull | tak | tak | v1 | v1 | ok | zgodne (dłoń przy twarzy, łokieć za linią pleców) |
| Farmer's Walk | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Front Raise | tak | tak | v1 | v1 | ok | zgodne |
| Front Squat | tak | tak | v2 (squat) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Glute Bridge | tak | tak | v1 | v1 | ok | **ACG-007** (pozycja końcowa: głowa 4,8 j. pod linią podłogi) |
| Goblet Squat | tak | tak | v2 (squat) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Good Morning | tak | tak | v2 (hinge) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Hack Squat | ukryta | ukryta | brak | brak | — | karta ukryta w 1.0 i 1.1 (werdykt „do poprawy”) — niewidoczna |
| Hammer Curl | tak | tak | v1 | v1 | ok | zgodne |
| Hip Thrust (hantel) | tak | tak | v1 | v1 | ok | zgodne |
| Hip Thrust (sztanga) | tak | tak | v1 | v1 | ok | zgodne |
| Incline Bench Press (hantle) | tak | tak | v2 (bench_press) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Incline Bench Press (sztanga) | tak | tak | v2 (bench_press) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Incline Push Up | tak | tak | v1 | v1 | ok | znana uwaga NISKA (dłoń 3,2 j. po blacie, docs/21) — nie zgłaszam ponownie |
| Incline Walk (bieżnia) | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Inverted Row | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Kettlebell Swing | tak | tak | v1 | v1 | ok | zgodne (kettlebell za kolanami, na górze na wysokości barków) |
| Lat Pulldown | tak | tak | v1 | v1 | ok | zgodne (drążek na wysokości barków przed klatką) |
| Lateral Raise (hantle) | tak | tak | v1 | v1 | ok | zgodne (łokieć wyżej niż dłoń, do wysokości barków) |
| Leg Curl | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Leg Extension | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Leg Press | tak | tak | v1 | v1 | ok | zgodne (kolano 6°–89°) |
| Lunges (hantle) | tak (częściowa) | tak (częściowa) | v1 | v1 | ok | znana uwaga NISKA (tylna stopa, docs/21, odłożone) — nie zgłaszam ponownie |
| Lying Leg Curl | tak | tak | v1 | v1 | ok | zgodne |
| Łydki na stopniu | tak | tak | v1 | v1 | ok | zgodne |
| Machine Chest Press | tak | tak | v1 | v1 | ok | zgodne (uchwyty na wysokości środka klatki) |
| Machine Shoulder Press | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Medicine Ball Slam | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Mountain Climbers | tak | tak | v1 | v1 | ok | zgodne |
| Neutral Grip Pull Up | tak | tak | v1 | v1 | ok | zgodne (z boku uchwytów nie odróżnić — bez uwagi) |
| Nordic Curl | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| One Arm Row (hantle) | tak | tak | v1 | v1 | ok | zgodne |
| Overhead Press (hantle) | tak | tak | v1 | v1 | ok | zgodne |
| Overhead Press (sztanga) | tak | tak | v1 | v1 | ok | zgodne |
| Overhead Triceps Extension (hantel) | tak | tak | v1 | v1 | ok | zgodne |
| Pallof Press | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Pendlay Row | tak | tak | brak | v1 | ok | 1.0: karta jak wiosłowanie w opadzie, bez rysunku — backlog 1.0.1 (docs/21); 1.1: nowa karta pendlay.* i figura 4 pozycje — zgodne |
| Pistol Squat | tak | tak | v1 | v1 | ok | zgodne |
| Plank | tak | tak | v1 | v1 | ok | zgodne |
| Preacher Curl | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Przysiad z pasem (linki) | tak | tak | v2 (squat) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Pull Up | tak | tak | v1 | v1 | ok | zgodne (zwis na prostych rękach, broda nad drążkiem, biodro ±7 j.) |
| Push Press | tak | tak | brak | v1 | ok | 1.0 bez rysunku (backlog: 4. pozycja); 1.1: v1 4 pozycje — zgodna |
| Push Up | tak | tak | v1 | v1 | ok | zgodne |
| RDL (hantle/linki) | tak | tak | v2 (hinge) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| RDL (sztanga) | tak | tak | v2 (hinge) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Reverse Crunch | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Reverse Fly (hantle) | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Reverse Lunge | tak (częściowa) | tak (częściowa) | brak | v1 | ok | 1.0 bez rysunku (backlog: 4. pozycja); 1.1: v1 — zgodna |
| Reverse Pec Deck | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Rower | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Rowing Machine | tak | tak | v1 | v1 | ok | zgodne |
| Russian Twist | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Seated Cable Row | tak | tak | v1 | v1 | ok | zgodne (kolano 21°, uchwyt do brzucha) |
| Seated Calf Raise | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Seated Shoulder Press (hantle) | tak | tak | v1 | v1 | ok | zgodne |
| Shrugs (hantle) | tak | tak | v1 | v1 | ok | zgodne |
| Shrugs (sztanga) | tak | tak | v1 | v1 | ok | zgodne |
| Side Plank | tak | tak | brak | brak | ok | bez rysunku v1 — tylko treść |
| Skullcrusher (EZ) | tak | ukryta | v1 | brak | ok | **ACG-006** (rysunek: gryf na dole za czubkiem głowy, karta: „tuż nad czołem”); w 1.1 ukryta (wpis v1 nieaktualny) |
| Standing Calf Raise | tak | tak | v1 | v1 | ok | zgodne (pięta 4,8 j. poniżej krawędzi na dole) |
| Step Up | tak | tak | v1 | v1 | ok | 1.0: znana uwaga NISKA (docs/21); 1.1: poprawiona, zgodna |
| Straight Arm Pulldown | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Suitcase Carry | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Sumo Deadlift | tak | tak | v2 (hinge) | brak | ok | rysunek v2 — partia 2 |
| T-Bar Row | tak | ukryta | v1 | brak | ok | zgodne (kosmetyka talerza w backlogu z recenzji v1); w 1.1 ukryta (wpis v1 nieaktualny) |
| Trap Bar Deadlift | tak | tak | v2 (hinge) | brak (wstrzymana) | ok | rysunek v2 — partia 2 |
| Triceps Dips (ławka) | tak | tak | v1 | v1 | ok | zgodne (łokieć 90° na dole) |
| Triceps Pushdown | tak | tak | v1 | v1 | ok | zgodne |
| Walking Lunges | tak (częściowa) | tak (częściowa) | v1 | v1 | ok | 1.0: 3 pozycje, pętla wraca do startu (docs/21); 1.1: 4 pozycje, krok drugą nogą — zgodna |
| Wall Sit | tak (częściowa) | tak (częściowa) | v2 (squat) | brak | ok | rysunek v2 — partia 2 |
| Wiosłowanie na linkach (siedząc) | tak | tak | v1 | v1 | ok | zgodne |
| Wyciskanie na linkach (stojąc) | tak (częściowa) | tak (częściowa) | brak | brak | ok | bez rysunku v1 — tylko treść |
| Wyciskanie nad głowę (linki) | tak | tak | v1 | v1 | ok | zgodne |
