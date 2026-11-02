# STAN — grupa G6 (przyciąganie i inne), fala W1, 02.11.2026

Koordynator grupy: sesja badań G6. Gałąź `badania/g6-przyciaganie` od `15abc58` (stan `integracja-1-1` na starcie sesji; zdalna gałąź integracji poszła dalej — przy scaleniu wystarczy scalić/przenieść same pliki z `docs/research/`).
Zakres: TYLKO zbieranie danych (polecenie właściciela 02.11.2026) — bez zmian w kodzie, `data/zrodla/*.json`, `lib/**` i testach. Integruje koordynator linii 1.1.

Pliki wyników: `docs/research/wskazowki-fala-w1/<rodzina>.md` (wskazówki) i `docs/research/role-miesni-fala-w1/<rodzina>.md` (role mięśni).
Stosowane reguły: CLAUDE.md (wyjątek dla wskazówek techniki, źródła publicznie anonimowo, prawo cytatu) + uzupełnienia koordynatora linii 1.1 z 02.11 (strony innych aplikacji nie są źródłem; nie przepisywać niepotwierdzonych zdań zestawu ogólnego) + **rozstrzygnięcie o szczeblach organizacji z 02.11** (wszystkie pliki wskazówek przeliczone po nim — nota „Korekta szczebli 02.11.2026” na początku plików pisanych przed nim).

## Wynik na rodzinę

Liczby ćwiczeń: lista `LIB` (`lib/seed.ts`), rodzina z `assignAll()` (`lib/figures/v2`), tryb wskazówek z `lib/figures/v2/cue-sets.json`, luki ról z `muscleRoleRows` (stan bazy `15abc58`). „Gotowe” = każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji (blok JSON w pliku); „częściowe” = część sekcji w JSON; „warunkowe” = zależne od decyzji niżej.

| Rodzina | Ćwiczeń (bez własnych wsk.) | Wskazówki: gotowe | częściowe / warunkowe | otwarte | Role: luki → zamknięte propozycją | Role otwarte |
|---|---|---|---|---|---|---|
| pull_up | 13 (10) | 2: Muscle Up, Rope Climb | — | 8: Dead Hang¹, Scapular Pull-Up¹, Gironda, Mixed Grip, One Arm, Wide-Grip Rear, Side To Side, Gorilla | 12 ćwiczeń z lukami → 10× upper_back (v_pull, zmiana statusu `upper_back.scap_down_retract` na dwa_zrodla), rear_delt (nowa reguła v_pull), Dead Hang forearms (nameRule `forearms.grip`) | Muscle Up triceps/chest, One Arm abs, Scapular Pull-Up, Gorilla, Dead Hang lats |
| row | 13 (7) | 3: Seal Row, Smith Bent Over Row, Lying T-Bar Row² | — | 4: Meadows, Reverse Grip, Barbell Rear Delt Row, Bent Over Row (linki) | brak luk | — |
| cable_row | 10 (7) | 3: Single Arm Cable Row, Machine Row, Cable Rope Rear-Delt Rows² (krótkie karty) | — | 4: Standing Cable Row, Kneeling High Pulley Row, Leverage High Row, Sled Row | brak luk | — |
| pulldown | 8 (6 + Straight Arm `partial`) | 1: Single Arm Lat Pulldown; dopełnienie Straight Arm Pulldown | 2: Close-Grip Front, Underhand | 3: V-Bar, Behind The Neck, Full ROM | 7× upper_back (ta sama zmiana statusu), Behind The Neck rear_delt | — |
| shrug | 8 (6) | — | 2 warunkowe: Shrugs (linki), Leverage Shrug (źródła o innym sprzęcie) | 4: za plecami ×2, Calf-Machine, Middle Back | — | forearms ×2 (analogia), Middle Back (pominięty świadomie) |
| forearm | 13 (13) | 8: Wrist Curl i Reverse (hantle), Barbell ×2, Cable, Wrist Roller, One-Arm ×2³ | — | 5: Behind-the-Back, Plate Pinch, Reverse Plate Curls, Lying Pronation/Supination | 3: Lying Pronation (`forearms.pronate`), Lying Supination (`forearms.supinate`), Reverse Plate Curls (`forearms.elbow_flex`) — nameRules | Wrist Roller, Plate Pinch |
| carry | 7 (5 + 2 `partial`) | — | 3: Overhead Carry, Farmer's Walk (trap bar), (Farmers Handles); `partial` bez zmian | 2: Front Rack Carry, Rickshaw | 1: Suitcase Carry obliques (`obliques.resist_side_bend`, nameRule) | Farmer's ×3 upper_back/obliques (jedno źródło), abs wszędzie, Overhead barki, Front Rack, Rickshaw |
| strongman | 10 (10) | 1: Yoke Walk | 3: Atlas Stones, Tire Flip, Sandbag Load | 6: Log Lift, Keg Load, Jefferson Squat, Circus Bell, Conan's Wheel, Power Stairs | 2: Log Lift glutes⁴, Yoke Walk abductors (nameRules do istniejących funkcji) | Circus Bell, Yoke pozostałe, Conan's Wheel, upper_back w 4× hinge |
| cardio | 16 (11 + 4 `partial`) | 6 + 1: Skakanka, Assault Bike, Jumping Jacks, Stair Climber, Orbitrek, Treadmill Walking; Incline Walk dopełnione | High Knees, Fast Skipping, Carioca (częściowe⁵); Bieg, Rower (dopełnione częściowo) | Battle Ropes, Ski Erg; Burpees bez zmian | brak luk poza Battle Ropes | Battle Ropes (wzorzec cardio bez reguł; jedyne badanie nieprzeczytane) |

¹ zależy od szczebla Physitrack / The Prehab Guys (decyzja 1). ² zależy od Fitness Volt / Generation Iron (decyzja 2). ³ dwie karty jednorącz złożone wyłącznie ze źródeł wariantów (decyzja 4). ⁴ przegląd Hindle 2019 — korekta nieprzeczytana, strona przeczytana do ok. 100 tys. znaków; wpuścić po doczytaniu. ⁵ zależą od The Prehab Guys (decyzja 1).

Skakanka i Assault Bike — wpisy w `open` w `data/zrodla/cues.json` i docs/27 do usunięcia przy integracji.

**Nowe zdania (propozycje PL + EN w plikach; liczby z raportów badaczy, część przeniesiona do „Otwarte” po korekcie szczebli):** pull_up 11 (w JSON 6: `mu.*` 3, `rope.*` 3), row 15, cable_row 8, pulldown 9, shrug 0, forearm 5, carry 2, strongman 17 (w JSON 9), cardio 31. Role: 5 nowych funkcji (`forearms.pronate`, `forearms.supinate`, `forearms.elbow_flex`, `obliques.resist_side_bend`, opcjonalnie niewyświetlana `upper_back.hold_shoulders`), 1 nowa reguła (`v_pull` × `rear_delt`), nameRules (Dead Hang, pronacja/supinacja, Reverse Plate Curls, Suitcase Carry, Log Lift, Yoke Walk), 1 zmiana statusu (`upper_back.scap_down_retract`). Każde nowe zdanie wymaga wpisu w rejestrze twierdzeń (`check:claims`) i słownika terminów przy integracji.

## Decyzje dla koordynatora linii 1.1 (przed integracją)

1. **Physitrack i The Prehab Guys** (w `cues.json` → `orgs` szczebel 4): wg kryteriów (a)–(c) z 02.11 badacz ocenił Physitrack na 5 (dostawca oprogramowania z aplikacją dla pacjentów; strona bez autora i daty; reklama oprogramowania); The Prehab Guys — (b) spełnione, (a) i (c) wątpliwe. W G6 Physitrack tymczasowo nie liczony; The Prehab Guys liczony jako 4 „do potwierdzenia”. Pytanie wysłane koordynatorowi 02.11. Dotyczy też istniejących wpisów w cues.json.
2. **Fitness Volt, Generation Iron** — wstępnie 4 tylko dla artykułów o technice z autorem i datą (Fitness Volt: strona redakcji z kontrolą przez certyfikowanego trenera; Generation Iron: „Fact checked by”, ale ogólna informacja o afiliacji). Nie sprawdzono wspólnego właściciela (żadne zdanie w JSON nie stoi wyłącznie na tej parze — wg forearm.md).
3. **Healthline** (recenzja medyczna, data) — badacz przyjął 4; spoza listy rozstrzygnięcia (cable_row, Machine Row — trzecie źródło). **Eleiko** — nie sprawdzono, czy produkuje wyciągi (Single Arm Lat Pulldown, Straight Arm Pulldown). **NTCC Athletics** (dział sportu college'u) → 5 jak Western SRS. **StrongFirst** → 4, **Equinox** → 5, **Cerberus Strength** → 5 (katalog bez kłody i kamieni), **Catalyst** 4, **8weeksout** 4 (kurs certyfikujący), **EliteFTS** 5 dla opony/kłody — oceny badaczy do potwierdzenia.
4. **Karty złożone wyłącznie ze źródeł wariantów** (forearm: One-Arm Wrist Curl/Reverse; shrug: linki, Leverage) — dopuszczalne?
5. **Tryb `open` zamiast zestawu ogólnego** tam, gdzie przeczytane źródła nie potwierdzają albo przeczą zestawowi: Gironda, Wide-Grip Rear Pull-Up, Wide-Grip Pulldown Behind The Neck, Calf-Machine Shrug, Kneeling High Pulley Row, Jefferson Squat (albo samo `sq.back` jako uproszczenie). Sprzeczności zestawów ogólnych (informacja o błędach): `npu.hang` w Dead Hang (uchwyty zamiast drążka — próbna recenzja 02.11), `row.fullStretch` (Machine Row: NASM przeczy; Leverage High Row), `row.bbGrip` (podchwyt, Rear Delt Row), `carry.walk` (Overhead Carry — tempo sporne; Yoke Walk — źródła: krótkie szybkie kroki), `carry.noLean` (warianty symetryczne), `walk.rails` (orbitrek, stair climber), `jump.mis.stiff` (skakanka), `wr.range` (wersja z dłońmi w dół), `wr.mis.lift` (bez potwierdzenia), `vpull` „do klatki” (zza karku), `shrug.setup` (maszyna do łydek).
6. Drobne: prefiks Dead Hang (`hang.` zajęty przez wznosy nóg → proponowane `dh.`); termin „fałszywy chwyt” (słownik terminów); `run.mis.overstride` dubluje `run.under` (można przenieść `run.under` do błędów); Fast Skipping — katalog nie definiuje wariantu (przyjęto skip z wysokim kolanem); Rope Climb — rysunek dziś pomijany (docs/54).
7. Uwaga do katalogu (nie do ról): Double Kettlebell Front Rack Carry `abs: 1` vs NSCA Coach s. 52 (za McGillem niska aktywność tułowia przy noszeniu z przodu) — źródła pierwotnego nie czytano.

## Pułapki dostępu (02.11.2026)

exrx.net 403, web.archive.org zablokowane w narzędziu; muscleandstrength 403; NSCA Kinetic Select 403; support.lifefitness.com 403; brooksrunning 403; elitefts `/education/` 404 (działa `/blogs/training/`); bodybuilding.com/exercises → sklep/404; adresy `?p=` BarBend/Breaking Muscle/NFPT z wyszukiwarki prowadzą gdzie indziej; WebFetch nie czyta PDF (zapis + Read po stronach); kilka instrukcji producentów czytanych z kopii w serwisach z instrukcjami (oryginał 403) — audytor może zażądać oryginału.

## Zostało (następny krok, jeśli koordynator zleci kolejną turę)

Po decyzjach 1–4 przeliczyć statusy (bez nowego researchu). Nowy research tylko dla popularnych: Bent Over Row (linki), Meadows Row, Reverse Grip Row (drugie źródło); V-Bar i Underhand Pulldown; Burpees (błędy); Farmer's Walk — warianty. Niszowe (strongman, Gorilla, Side To Side, Plate Pinch, Battle Ropes, Ski Erg) — mała szansa na drugie źródło szczebla 4.

## Git i verify

Commity lokalne: `8c99385`, `3a23b1e`, `f495287`, `6719bc7`, `b62c3fe`, `fa3a0e0`, `4bd1a2a`, `92b5253`, `57d31ab`, `7d6c4d3`, `f023abe`, `06db1cd`, `1130691`, `b6a004e`, `c49ed36`, `04e93f7` (+ ten plik). Wynik verify bazy i SHA wypchnięcia — w sekcji niżej (uzupełniane po zakończeniu verify).
