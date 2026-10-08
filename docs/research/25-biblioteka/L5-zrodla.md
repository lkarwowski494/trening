# 25 / L5. Biblioteka ćwiczeń — pchanie i przyciąganie (poziome i pionowe): źródła i podsumowanie (08.10.2026)

Część L5 przeglądu biblioteki (854 ćwiczenia, polecenie właściciela 08.10.2026: „zrób głęboki research i potwierdź każde z nich”): 165 ćwiczeń o wzorcach h_push, v_push, h_pull, v_pull. Dane: `L5.json` (jeden rekord na ćwiczenie). Ten plik niczego nie zmienia w kodzie ani w katalogu — poprawki wdroży osobny wykonawca z testami. Podsumowanie (sekcje 2–4) jest generowane skryptem z `L5.json`, nie przepisywane ręcznie.

## 1. Metoda

- Lista z `L5-input.json` (pełne rekordy katalogu); ćwiczenia bazowe (34 z `LIB_BASE`) — partie według `docs/research/24-przypisanie-partii.md` (autorytatywne; tu sprawdzone tylko sprzęt, wzorzec, zakres i ewentualne nowe źródła). Duplikaty sprawdzone w całym `catalog.json` (854).
- Źródła partii: ExRx.net (szczebel 4) — strony ćwiczeń przeczytane przez Wayback Machine (bezpośredni dostęp blokuje Cloudflare); badania EMG (szczebel 3) i przeglądy (szczebel 2) — streszczenia z PubMed (**A**). Identyfikacja rzadkich ćwiczeń — opis w free-exercise-db (L5-S44; tylko co to za ruch, nie podstawa merytoryczna).
- Pewność: **mocne** — badania wzrostu ≥ 2 zespołów (tylko przez docs/24); **umiarkowane** — ≥ 2 niezależne źródła (np. ExRx + EMG) albo analogia do ćwiczenia z mocnym dowodem; **jedno źródło**; **brak źródła — uproszczenie**.
- Zakres (ZOSTAJE / NISZOWE / SCALIĆ / USUNĄĆ) to **ocena produktowa**, nie merytoryczna. Reguły użyte konsekwentnie: ZOSTAJE — popularne ćwiczenie siłowni/domu albo przejrzane już przez właściciela (kroki 04.10 i 04.10b); NISZOWE — prawdziwe, ale rzadkie: sprzęt specjalny (łańcuchy, gumy na sztandze, strongman, sanki, kółka, lina), plyometria i rzuty, umiejętności zaawansowane, rzadkie warianty chwytu/ustawienia; SCALIĆ — różni się od innego wpisu tylko chwytem dłoni lub przyrządem w tym samym ruchu, przy tej samej mierze, trybie i partiach (chwyt można zapisać w notatce; kettle jako drugi przyrząd przez `requires` [db|kb], jak Goblet Squat); USUNĄĆ — sprzęt niemożliwy do opisania i błędnie zmapowany, ruch bez ustalonej nazwy/opisu poza jedną bazą, albo wymaga partnera do bezpiecznego wykonania. Ćwiczenia z historii użytkownika nie znikają (aplikacja je archiwizuje).

## 2. Liczby

- Werdykt: OK 117, POPRAWIĆ 23, SCALIĆ 22, USUNĄĆ 3.
- Zakres: ZOSTAJE 68, NISZOWE 72, SCALIĆ 22, USUNĄĆ 3.
- Pewność: mocne 4, umiarkowane 64, jedno źródło 75, brak źródła — uproszczenie 22.
- Domyślna lista po wdrożeniu (ZOSTAJE): 68 z 165; ukryte, ale wyszukiwalne (NISZOWE): 72; znikają z biblioteki (SCALIĆ + USUNĄĆ): 25.

## 3. Poprawki pól (POPRAWIĆ)

| Ćwiczenie | Zmiana | Pewność | Uzasadnienie |
|---|---|---|---|
| Clock Push-Up | `metric` → `"reps"`; `bandAssistable` → `false` | jedno źródło | Wg opisu źródła ruch plyometryczny („until you are air borne”) → miara jak Plyo Push-Up (powtórzenia); asysta gumą niespójna z Push Up (false). |
| Floor Press (hantle) | `secondaryMuscles` → `["triceps", "barki"]` | umiarkowane | Spójność z wyciskaniem i pozostałymi floor press (triceps + barki); przedni akton synergistą w ExRx; muscleLoad front_delt 0,5 już jest. |
| Floor Press (sztanga) | `secondaryMuscles` → `["triceps", "barki"]` | umiarkowane | Jak wyżej — dodać „barki” do pomocniczych (Floor Press with Chains i One Arm Floor Press już je mają). |
| Isometric Wipers | `bandAssistable` → `false` | jedno źródło | Przenoszenie ciężaru w pozycji pompki; asysta gumą niespójna z Push Up. |
| Push Up to Side Plank | `bandAssistable` → `false` | jedno źródło | Kombinacja pompki i podporu bokiem; asysta gumą niespójna z Push Up. |
| Push-Up Wide | `bandAssistable` → `false` | umiarkowane | Cogley 2005: szerokie ustawienie — mniejsza aktywność piersiowego i tricepsa niż wąskie; partie bez zmian. Asysta gumą niespójna z Push Up. |
| Single-Arm Push-Up | `bandAssistable` → `false` | jedno źródło | Zaawansowany wariant; asysta gumą niespójna z Push Up. |
| Smith Machine Bench Press | `secondaryMuscles` → `["triceps", "barki"]` | umiarkowane | ExRx Smith bench: synergista przedni akton; Saeterbakken 2011: aktywność piersiowego i aktonu bez różnic Smith/sztanga → pomocnicze jak Bench Press (sztanga). |
| Board Press | `group` → `"klatka"`; `muscles` → `["klatka"]`; `secondaryMuscles` → `["triceps", "barki"]`; `muscleLoad` → `{"chest": 1, "triceps": 0.5, "front_delt": 0.5}` | brak źródła — uproszczenie | Wyciskanie w niepełnym zakresie (do desek). Triceps jako główna — tylko praktyka trójboistów (szczebel 5, nieprzeczytana); bez źródła reguła spójności → jak wyciskanie. Pytanie otwarte Q5. |
| Close-Grip EZ-Bar Press | `note` → `"EZ bar, inner grip, bar over a bench (rack or bench uprights, same rule as Close Grip Bench Press)."` | umiarkowane | Wymagania (rack|stojaki) zgodne z konwencją „sztanga nad ławką”, ale notatka mówi „rack optional” — poprawić notatkę, nie wymagania. |
| Decline Close-Grip Bench To Skull Crusher | `recommended` → `["rack.safeties"]` | jedno źródło | Kombinacja wąskiego wyciskania i francuskiego; zalecane zabezpieczenia jak przy innych wyciskaniach sztangą nad ławką. |
| Incline Push-Up Close-Grip | `bandAssistable` → `false` | jedno źródło | ExRx close-grip incline push-up (na drążku): cel triceps — zgodne. Asysta gumą niespójna z Push Up. |
| Pin Press | `group` → `"klatka"`; `muscles` → `["klatka"]`; `secondaryMuscles` → `["triceps", "barki"]`; `muscleLoad` → `{"chest": 1, "triceps": 0.5, "front_delt": 0.5}` | brak źródła — uproszczenie | Wyciskanie z bolców (bez fazy ekscentrycznej) — jak Board Press: bez źródła reguła spójności z wyciskaniem. Q5. |
| Push-Ups - Close Triceps Position | `name` → `"Close-Grip Push-Up"`; `bandAssistable` → `false` | umiarkowane | Ustalona nazwa (ExRx): „Close Grip Push-up”, cel triceps. Różni się od Diamond Push Up (dłonie złączone) — zostaje osobno, ale niszowe. |
| Reverse Triceps Bench Press | `name` → `"Reverse Grip Bench Press"` | jedno źródło | Lehman 2005: chwyt podchwytem ↑ biceps i część obojczykowa piersiowego, węższy chwyt ↑ triceps — triceps główną przy wąskim chwycie zostawić; nazwa z „Triceps” nie jest ustalona. |
| Circus Bell | `requires` → `[["circus_bell"]]` | brak źródła — uproszczenie | Konkurencja strongman (duży hantel z grubym uchwytem). Dziś wymaga „db”, więc pojawia się w domu — sprzeczne z zasadą, że strongman jest poza presetami. Brak możliwości w słowniku → pytanie otwarte Q7. |
| Shoulder Press - With Bands | `name` → `"Band Shoulder Press"` | jedno źródło | Nazwa ujednolicona z „Band Bench Press”. |
| Standing Bradford Press | `name` → `"Bradford Press"` | jedno źródło | Cel scalenia wersji siedzącej; nazwa bez „Standing”. |
| Two-Arm Kettlebell Military Press | `name` → `"Double Kettlebell Press"` | jedno źródło | Nazwa wg konwencji katalogu („Double Kettlebell …”, recenzja 04.10). |
| Dips - Triceps Version | `name` → `"Triceps Dip"` | umiarkowane | Ustalona nazwa (ExRx): „Triceps Dip” — tułów pionowo, cel triceps; Chest Dip osobno (ExRx też rozdziela). |
| Band Pull Apart | `pattern` → `"isolation"` | jedno źródło | Odwodzenie poziome ramion (jak Reverse Fly, który ma wzorzec isolation) — nie wiosłowanie. Partie: analogia do rear delt (ExRx), anatomia. Przegląd właściciela 04.10. |
| Reverse Grip Bent-Over Rows | `name` → `"Reverse Grip Bent Over Row"` | umiarkowane | ExRx underhand bent-over row: cel plecy. Nazwa w liczbie pojedynczej jak pozostałe. |
| Underhand Cable Pulldowns | `name` → `"Underhand Lat Pulldown"` | umiarkowane | ExRx underhand pulldown: cel najszerszy; Lehman 2004: chwyt podchwytem nie zmienia aktywności bicepsa. Nazwa w liczbie pojedynczej, jak Lat Pulldown. |

## 4. Scalenia i usunięcia

| Ćwiczenie | Zakres | Cel scalenia | Powód |
|---|---|---|---|
| Return Push from Stance | SCALIĆ | Medicine Ball Chest Pass | Ćwiczenie z partnerem (bieg + odbiór + odrzut piłki) — wariant rzutu sprzed klatki; nie da się go zapisać inaczej niż Chest Pass (powtórzenia). Grupa „inne” niespójna z innymi rzutami („klatka”). |
| Alternating Kettlebell Floor Press | SCALIĆ | Floor Press (hantle) | Para kettli, naprzemiennie — ten sam ruch co Floor Press (hantle); przy scaleniu dopisać kettlebell jako przyrząd ([db|kb], jak Goblet Squat). Pola sprzętowe i tryb (×2) poprawne. |
| Chest Push from 3 Point Stance | SCALIĆ | Medicine Ball Chest Pass | Rzut piłką lekarską sprzed klatki z dwóch kroków — wariant Chest Pass (ta sama miara). |
| Dumbbell Bench Press with Neutral Grip | SCALIĆ | Bench Press (hantle) | Różni się tylko ustawieniem dłoni; sprzęt, miara, tryb i partie identyczne. Chwyt można zapisać w notatce. |
| Extended Range One-Arm Kettlebell Floor Press | SCALIĆ | One-Arm Kettlebell Floor Press | Ten sam ruch z dłuższym zakresem (przywiedzenie ponad linię środkową). |
| Hammer Grip Incline DB Bench Press | SCALIĆ | Incline Bench Press (hantle) | Tylko chwyt neutralny — jak wyżej. |
| Heavy Bag Thrust | USUNĄĆ | — | Wymaga wiszącego worka bokserskiego (brak w słowniku; „sandbag” to inny sprzęt — dzisiejsze mapowanie błędne); dynamiczne pchnięcie worka bez mierzalnego obciążenia — ćwiczenie kondycyjne, nie siłowe. |
| Incline Push-Up Wide | SCALIĆ | Incline Push Up | Różni się tylko szerokością rąk; ta sama miara i sprzęt. |
| Kneeling Chest Push (single response) | SCALIĆ | Medicine Ball Chest Pass | Rzut piłką z klęku — wariant Chest Pass. |
| One Arm Floor Press | USUNĄĆ | — | Wg opisu źródła: sztanga podawana przez partnera do jednej ręki, chwyt neutralny — niestabilny gryf nad tułowiem bez stojaków; wymaganie „rack” przeczy notatce. Ruch pokrywają One-Arm Kettlebell Floor Press i One Arm Dumbbell Bench Press. |
| Wide-Grip Decline Barbell Bench Press | SCALIĆ | Decline Bench Press | Rzadki wariant różniący się tylko szerokością chwytu. |
| Close-Grip Push-Up off of a Dumbbell | SCALIĆ | Push-Ups - Close Triceps Position | Hantel tylko jako podpórka — to pompka wąska. |
| Anti-Gravity Press | USUNĄĆ | — | Nazwa występuje tylko w free-exercise-db (brak w ExRx); ruch (wypychanie gryfu przed głowę w leżeniu przodem na ławce skośnej) jest ćwiczeniem dolnego czworobocznego, nie wyciskaniem pionowym — wzorzec v_push i partie niepotwierdzone. |
| One-Arm Kettlebell Para Press | SCALIĆ | Kettlebell Press | Różni się tylko ustawieniem łokcia/dłoni. |
| Seated Bradford/Rocky Press | SCALIĆ | Standing Bradford Press | Ten sam ruch (naprzemiennie przed/za głowę) siedząc; jedna pozycja „Bradford Press” wystarczy. |
| Standing Palm-In One-Arm Dumbbell Press | SCALIĆ | Single Arm Overhead Press (hantel) | Różni się tylko chwytem neutralnym. |
| Standing Palms-In Dumbbell Press | SCALIĆ | Overhead Press (hantle) | Różni się tylko chwytem neutralnym. |
| Weighted Bench Dip | SCALIĆ | Triceps Dips (ławka) | To samo ćwiczenie z obciążeniem na udach; przy ćwiczeniach z masą ciała ciężar dodatkowy wpisuje się w serii (weight_reps). Wymaganie drugiej ławki i obciążenia może przejść jako „zalecane”. |
| Bent Over Two-Dumbbell Row With Palms In | SCALIĆ | Bent Over Row (hantle) | Tylko chwyt neutralny. |
| Bodyweight Mid Row | SCALIĆ | Inverted Row | Wiosłowanie ciężarem ciała w zwisie z nogami zahaczonymi o drążek — ten sam wzorzec co Inverted Row, nietypowe ustawienie. |
| Kneeling Single-Arm High Pulley Row | SCALIĆ | Single Arm Lat Pulldown | Ciągnięcie jednej rączki z górnego wyciągu w dół do tułowia — w praktyce ściąganie jednorącz. |
| One-Arm Kettlebell Row | SCALIĆ | One Arm Row (hantle) | Ten sam ruch innym przyrządem; przy scaleniu dopisać kettlebell jako przyrząd ([db|kb]). |
| Two-Arm Kettlebell Row | SCALIĆ | Bent Over Row (hantle) | Ten sam ruch parą kettli; przy scaleniu dopisać kettlebell jako przyrząd. |
| Kipping Muscle Up | SCALIĆ | Muscle Up | Ta sama umiejętność z wymachem (technika, nie osobne ćwiczenie do zapisu). |
| Rocky Pull-Ups/Pulldowns | SCALIĆ | Pull Up | Naprzemiennie do klatki i za kark — rzadkie; wersję za karkiem ma Wide-Grip Rear Pull-Up. |

## 5. Najważniejsze ustalenia

**Mapowanie partii jest w tej części w większości poprawne.** Wszystkie wyciskania mają klatkę albo przedni akton jako partię główną i triceps jako pomocniczą,
wszystkie wiosłowania i ściągania mają plecy jako główną i biceps jako pomocniczą. To zgadza się z ExRx (cel i synergiści) oraz z EMG (L5-S26, S38, S39) i wzrostem (docs/24).
Błędy dotyczą głównie spójności, pól pomocniczych i zakresu biblioteki.

Najważniejsze poprawki:
1. **Brak „barki” wśród pomocniczych** przy Floor Press (hantle), Floor Press (sztanga) i Smith Machine Bench Press, choć ExRx wymienia przedni akton jako synergistę.
   Saeterbakken 2011 nie znalazł różnicy w aktywności aktonu między Smithem a sztangą. Pozostałe wyciskania poziome już mają triceps + barki.
2. **Board Press i Pin Press** mają triceps jako główną tylko na podstawie praktyki trójboistów. Brak źródła, więc według reguły spójności mapowanie jak wyciskanie
   (klatka / triceps + barki). Decyzja do potwierdzenia (Q5).
3. **Asysta gumą (`bandAssistable`) przy 8 wariantach pompek** jest niespójna z Push Up i Diamond Push Up (oba false). Propozycja: false. Alternatywa: true dla wszystkich pompek (Q2).
4. **Band Pull Apart: wzorzec `isolation` zamiast `h_pull`.** To odwodzenie poziome ramion, jak w Reverse Fly, a nie wiosłowanie.
5. **Clock Push-Up: miara „powtórzenia”.** Według opisu to pompka plyometryczna (z oderwaniem), jak Plyo Push-Up.
6. **Nazwy:** Close-Grip Push-Up, Triceps Dip, Underhand Lat Pulldown i Reverse Grip Bench Press (ustalone nazwy ExRx/EMG); Double Kettlebell Press (konwencja katalogu);
   Band Shoulder Press, Bradford Press i Reverse Grip Bent Over Row (ujednolicenie).
7. **Circus Bell (strongman) wymaga dziś `db`,** więc pojawia się w domu. Trzeba dodać możliwość „circus bell” albo inaczej oznaczyć sprzęt strongman (Q7).

Duplikaty i niemal-duplikaty: propozycje scalenia w sekcji 4. Do tego bez scalania:
- **Seated Cable Row ≈ Wiosłowanie na linkach (siedząc)** — rozdzielone decyzją właściciela 04.10.2026 (liczba linek);
- **Push-Ups - Close Triceps Position ≈ Diamond Push Up** — inne ułożenie dłoni (ExRx rozróżnia close grip, dłonie pod barkami);
- **Clean and Press vs Clean and Jerk** (inna część katalogu) — różne boje, zostają oba.

## Pytania otwarte

- **Q1. Scalanie wariantów chwytu i kettli (produktowe).**
  - A) Scalić (rek.): krótsza lista, a chwyt da się zapisać w notatce.
  - B) Zostawić je jako niszowe: pełniejsza historia wariantów, ale dłuższa wyszukiwarka.
  - Przy A kettlebell trzeba dopisać jako drugi przyrząd (`requires` [db|kb]) w One Arm Row (hantle), Bent Over Row (hantle) i Floor Press (hantle).
    To zmiana ćwiczeń bazowych, potrzebny test.
- **Q2. `bandAssistable` przy pompkach.** A) false wszędzie (rek., zgodnie z bazą); B) true wszędzie (pompka z gumą pod tułowiem to znana regresja).
  Guma przy pompce odciąża, czyli działa jak przy podciąganiu, i aplikacja liczy wtedy ciężar jako nieznany.
- **Q3. `muscleLoad` lower_back 0,5 przy wiosłowaniach w opadzie** (sztanga, hantle, Pendlay, T-bar, kettle, Smith, linki). ExRx podaje prostowniki grzbietu
  jako stabilizator, co według konwencji katalogu daje wagę 0,25. Dotyczy też ćwiczeń bazowych, więc nie zmieniam tego w L5. Do decyzji razem z Q4 z docs/24.
- **Q4. Ćwiczenia za karkiem** (Wide-Grip Pulldown Behind The Neck, Wide-Grip Rear Pull-Up, Standing Barbell Press Behind Neck, Push Press - Behind the Neck, Bradford Press).
  Przy ściąganiu EMG: Sperandei 2009 „should be avoided”, Signorile 2002 — wersja przed głową silniej pobudza najszerszy. Nie przeczytałem źródła o ryzyku urazu,
  więc zostają jako niszowe, a nie usunięte. Opcja: dopisek w opisie ćwiczenia „wersja przed głową skuteczniejsza (EMG)”.
- **Q5. Board Press / Pin Press:** partia główna triceps (praktyka) czy klatka (spójność z wyciskaniem)? Rekomenduję klatkę, dopóki nie będzie badania.
- **Q6. Barbell Guillotine Bench Press** (gryf do szyi): nie przeczytałem źródła o ryzyku, więc proponuję tylko NISZOWE. Gdyby właściciel chciał usunąć ćwiczenia
  wymagające asekuracji, to pierwszy kandydat.
- **Q7. Słownik sprzętu:** brak „circus bell” (Circus Bell), maszyny do dipów (Dip Machine, dziś zmapowana na triceps_ext_machine), worka bokserskiego (Heavy Bag Thrust — proponuję
  usunięcie) i ściany (Handstand Push Up, dziś bez wymagań).
- **Q8. Ćwiczenia, które przeszły przegląd właściciela 04.10** (24 pozycje bez `fedb`, np. Squeeze Press, Meadows Row, Renegade Row, Landmine Press).
  Wszystkie zostają (ZOSTAJE), ale kilka ma partie oznaczone „brak źródła — uproszczenie”.
- Partie ćwiczeń bazowych w tej części — bez zmian względem docs/24. Dwa przypisania mają teraz dodatkowe źródło i wyższą pewność:
  - Close Grip Bench Press: ExRx (cel triceps) i Lehman 2005;
  - Chest Dip: ExRx i McKenzie 2022.


## 6. Źródła

Szczebel wg CLAUDE.md; **PT** — przeczytany pełny tekst strony / wskazane fragmenty, **A** — streszczenie (PubMed). Identyfikatory `24:Sx` to źródła z `docs/research/24-przypisanie-partii.md` (tam pełne cytaty). Liczba rekordów cytujących źródło w nawiasie.

ExRx.net (szczebel 4, serwis specjalistyczny) — wszystkie strony czytane przez archiwum https://web.archive.org/web/<data>/https://exrx.net/…
(bezpośrednio exrx.net zwraca 403 / Cloudflare); podana data kopii. Cytat = sekcja „Muscles” strony (PT).

- **L5-S1** ExRx: Barbell Bench Press. https://exrx.net/WeightExercises/PectoralSternal/BBBenchPress (kopia 20241226). PT, szczebel 4.
  „Target Pectoralis Major, Sternal; Synergists Pectoralis Major, Clavicular, Deltoid, Anterior, Triceps Brachii, Coracobrachialis”.
- **L5-S2** ExRx: Barbell Incline Bench Press …/PectoralClavicular/BBInclineBenchPress (20260202); Dumbbell Incline Bench Press …/DBInclineBenchPress (20260127). PT, 4.
  „Target Pectoralis Major, Clavicular; Synergists Pectoralis Major, Sternal, Deltoid, Anterior, Triceps Brachii”.
- **L5-S3** ExRx: Barbell Decline Bench Press …/PectoralSternal/BBDeclineBenchPress (20260202); Dumbbell Decline Bench Press …/DBDeclineBenchPress (20260206). PT, 4.
  „Target Pectoralis Major, Sternal; Synergists Pectoralis Major, Clavicular, Deltoid, Anterior, Triceps Brachii”; „Latissimus Dorsi involvement is low on Decline Bench Press (Barnett 1995)”.
- **L5-S4** ExRx: Dumbbell Bench Press …/PectoralSternal/DBBenchPress (20250327). PT, 4. „Target Pectoralis Major, Sternal; Synergists … Deltoid, Anterior, Triceps Brachii”.
- **L5-S5** ExRx: Push-up …/PectoralSternal/BWPushup (20260222). PT, 4. „Target Pectoralis Major, Sternal; Synergists Pectoralis Major, Clavicular, Deltoid, Anterior,
  Triceps Brachii … Stabilizers Serratus Anterior, Pectoralis Minor, Rectus Abdominis, Obliques, Quadriceps”; „Other methods to increase difficulty include … elevate feet,
  plyometric variations, or have partner hold weight on back”.
- **L5-S6** ExRx: Decline Push-up …/PectoralClavicular/BWDeclinePushup (20260212); Decline Push-up on Ball …/BWDeclinePushupOnBall (20260609). PT, 4.
  „Target Pectoralis Major, Clavicular; Synergists Pectoralis Major, Sternal, Deltoid, Anterior, Triceps Brachii”.
- **L5-S7** ExRx: Incline Push-up …/PectoralSternal/BWInclinePushup (20260609). PT, 4. „Target Pectoralis Major, Sternal; Synergists … Deltoid, Anterior, Triceps Brachii”.
- **L5-S8** ExRx: Chest Dip …/PectoralSternal/BWChestDip (20250422). PT, 4. „Target Pectoralis Major, Sternal; Synergists Deltoid, Anterior, Triceps Brachii, Pectoralis Major,
  Clavicular, Pectoralis Minor, Rhomboids, Levator Scapulae, Latissimus Dorsi, Teres Major”.
- **L5-S9** ExRx: Lever Chest Press …/PectoralSternal/LVChestPress (20260219); Lever Decline Chest Press (plate loaded) …/LVDeclineChestPressPL (20210225). PT, 4.
  „Target Pectoralis Major, Sternal; Synergists Pectoralis Major, Clavicular, Deltoid, Anterior, Triceps Brachii”.
- **L5-S10** ExRx: Smith Bench Press …/PectoralSternal/SMBenchPress (20220829). PT, 4. „Target Pectoralis Major, Sternal; Synergists Pectoralis Major, Clavicular, Deltoid, Anterior, Triceps Brachii”.
- **L5-S11** ExRx: Cable Standing Chest Press …/PectoralSternal/CBStandingChestPress (20250422); Cable Chest Press …/CBChestPress (20260609); Cable Incline Chest Press
  …/PectoralClavicular/CBInclineChestPress (20250820). PT, 4. Wszystkie: synergiści „Deltoid, Anterior, Triceps Brachii”; wersja skośna — cel „Pectoralis Major, Clavicular”.
- **L5-S12** ExRx: Suspended Chest Press …/PectoralSternal/STChestPress (20260131). PT, 4. „This exercise can be performed on TRX style suspension trainer or adjustable length gymnastics rings.”
- **L5-S13** ExRx: Barbell Close Grip Bench Press …/Triceps/BBCloseGripBenchPress (20260202); Smith Close Grip Bench Press …/Triceps/SMCloseGripBenchPress (20231228). PT, 4.
  „Target Triceps Brachii; Synergists Deltoid, Anterior, Pectoralis Major, Sternal, Pectoralis Major, Clavicular”.
- **L5-S14** ExRx: Barbell JM Press …/Triceps/BBJMPress (20230428). PT, 4. „Target Triceps Brachii; Synergists Deltoid, Anterior, Pectoralis Major, Sternal, Pectoralis Major, Clavicular”.
- **L5-S15** ExRx: Close Grip Push-up …/Triceps/BWCloseGripPushup (20260212); Close Grip Incline Push-up (bar) …/Triceps/BWCloseGripInclinePushupBar (20260609). PT, 4.
  „hands under shoulders or slightly narrower”; „Target Triceps Brachii; Synergists Pectoralis Major, Sternal, Pectoralis Major, Clavicular, Deltoid, Anterior”.
- **L5-S16** ExRx: Triceps Dip …/Triceps/BWTriDip (20260616); Bench Dip …/Triceps/BWBenchDip (20250625); Weighted Bench Dip …/Triceps/WtBenchDip (20260206);
  Lever Triceps Dip (maszyna siedząca) …/Triceps/LVTriDip (20240105). PT, 4. Wszystkie: „Target Triceps Brachii; Synergists Deltoid, Anterior, Pectoralis Major, Sternal …”.
- **L5-S17** ExRx (barki): Barbell Military Press …/DeltoidAnterior/BBMilitaryPress (20241226), Seated Military Press …/BBSeatedMilitaryPress (20230530), Behind Neck Press
  …/BBBehindNeckPress (20230306), Dumbbell Shoulder Press …/DBShoulderPress (20241226), Dumbbell One Arm Shoulder Press …/DBOneArmShoulderPress (20230324), Arnold Press
  …/DBArnoldPress (20260206), Smith Shoulder Press …/SMShoulderPress (20240105), Cable Shoulder Press …/CBShoulderPress (20231227). PT, 4. Wszystkie: „Target Deltoid, Anterior”;
  synergiści m.in. „Deltoid, Lateral … Triceps Brachii … Trapezius, Middle, Trapezius, Lower”; wersja jednorącz dodatkowo „Obliques”; military press: „Grasp barbell from rack or clean barbell from floor”.
- **L5-S18** ExRx: Pike Press …/DeltoidAnterior/BWPikePress (20250815); Handstand Push-up (parallettes) …/BWHandstandPushupParallettes (20220301). PT, 4.
  „Target Deltoid, Anterior; Synergists Pectoralis Major, Clavicular, Triceps Brachii, Deltoid, Lateral”.
- **L5-S19** ExRx: Push Press …/OlympicLifts/PushPress (20260316); Split Jerk …/OlympicLifts/SplitJerk (20240105). PT, 4. Strona podaje ruchy stawów zamiast mięśni:
  „Dynamic Hip Extension, Knee Extension, Ankle Plantar Flexion, Shoulder Abduction, Flexion, Scapula & Clavicle Upward Rotation, Elbow Extension”.
- **L5-S20** ExRx: Kettlebell Press …/Kettlebell/KBPress (20250824). PT, 4. „Dynamic Shoulder Abduction, Flexion … Elbow Extension; Static Spine … Lateral Flexion”.
- **L5-S21** ExRx: Barbell Bent-over Row …/BackGeneral/BBBentOverRow (20260125); Underhand Bent-over Row …/BBUnderhandBentOverRow (20221113); Smith Bent-over Row
  …/SMBentOverRow (20260607); Lever T-bar Row …/LVTBarRow (20250814). PT, 4. „Target Back, General; Synergists Trapezius, Middle, Trapezius, Lower, Rhomboids, Latissimus Dorsi,
  Teres Major, Deltoid, Posterior … Brachialis, Brachioradialis …; Dynamic Stabilizers Biceps Brachii …; Stabilizers Erector Spinae, Hamstrings, Gluteus Maximus …”.
- **L5-S22** ExRx: Dumbbell Bent-over Row (jednorącz na ławce) …/BackGeneral/DBBentOverRow (20260125); Dumbbell Lying Row …/DBLyingRow (20230531); Lever Seated High Row
  …/LVSeatedHighRow (20230531); Cable Seated Row …/CBSeatedRow (20260202); Inverted (Supine) Row …/BWSupineRow (20260212). PT, 4. Wszystkie: „Target Back, General”;
  jednorącz — stabilizatory m.in. „Obliques”.
- **L5-S23** ExRx: Barbell Rear Delt Row …/DeltoidPosterior/BBRearDeltRow (20240310). PT, 4. „Target Deltoid, Posterior; Synergists Infraspinatus, Teres Minor, Deltoid, Lateral,
  Trapezius, Middle, Trapezius, Lower, Rhomboids, Brachialis, Brachioradialis”.
- **L5-S24** ExRx: Cable Front Pulldown …/LatissimusDorsi/CBFrontPulldown (20241226), Close Grip Pulldown …/CBCloseGripPulldown (20260127), Underhand Pulldown
  …/CBUnderhandPulldown (20231206), Parallel Grip Pulldown …/CBParallelGripPulldown (20251031). PT, 4. „Target Latissimus Dorsi; Synergists Brachialis, Brachioradialis,
  (Biceps Brachii), Teres Major, Deltoid, Posterior … Rhomboids … Trapezius, Lower, Trapezius, Middle”; przy chwycie podchwytem i równoległym biceps jako „Dynamic Stabilizer”.
- **L5-S25** ExRx: Pull-up …/LatissimusDorsi/BWPullup (20231020), Chin-up (underhand) …/BWUnderhandChinup (20251217), Archer Pull-up …/BWArcherPullup (20240424), One Arm
  Pull-up …/BWOneArmPullup (20260607). PT, 4. „Target Latissimus Dorsi; Synergists Brachialis, Brachioradialis, Biceps Brachii, Teres Major, Deltoid, Posterior …”.

Badania i przeglądy (PubMed, streszczenia):

- **L5-S26** Stastny P i in. A systematic review of surface electromyography analyses of the bench press movement task. PLoS One 2017;12(2):e0171632.
  https://pubmed.ncbi.nlm.nih.gov/28170449/. A, szczebel 2 (EMG). „PM and TB EMG activity is more dominant and shows greater EMG amplitude than anterior deltoid during the BP.”
- **L5-S27** Lehman GJ. The influence of grip width and forearm pronation/supination on upper-body myoelectric activity during the flat bench press. J Strength Cond Res
  2005;19(3):587–91. https://pubmed.ncbi.nlm.nih.gov/16095407/. A, szczebel 3 (EMG). „A supinated grip resulted in increased activity for the biceps brachii and the clavicular
  portion of the pectoralis major. Additionally, moving from wide to narrower grip widths increased triceps activity and decreased the sternoclavicular portion of the pectoralis major.”
- **L5-S28** Saeterbakken AH, van den Tillaar R, Fimland MS. A comparison of muscle activity and 1-RM strength of three chest-press exercises with different stability requirements.
  J Sports Sci 2011;29(5):533–8. https://pubmed.ncbi.nlm.nih.gov/21225489/. A, 3. „Electrical activity in the pectoralis major and anterior deltoid did not differ during the
  lifts” (Smith, sztanga, hantle); „triceps brachii activity was reduced using dumbbells versus barbell”.
- **L5-S29** Calatayud J i in. Bench press and push-up at comparable levels of muscle activity results in similar strength gains. J Strength Cond Res 2015;29(1):246–53.
  https://pubmed.ncbi.nlm.nih.gov/24983847/. A, 3 (RCT). „EMG amplitude showed no significant difference between 6RM bench press and band push-up”; podobne przyrosty 1RM.
- **L5-S30** Calatayud J i in. Muscle Activation during Push-Ups with Different Suspension Training Systems. J Sports Sci Med 2014;13(3):502–10. https://pubmed.ncbi.nlm.nih.gov/25177174/
  oraz Phys Sportsmed 2014;42(4):106–19, https://pubmed.ncbi.nlm.nih.gov/25419894/. A, 3. „the suspended push-up with a pulley system also provided the greatest triceps brachii,
  upper trapezius, rectus femoris and erector lumbar spinae muscle activation”; „Elastic-resisted push-ups induce similar EMG stimulus in the prime movers as the bench press”.
- **L5-S31** Cogley RM i in. Comparison of muscle activation using various hand positions during the push-up exercise. J Strength Cond Res 2005;19(3):628–33.
  https://pubmed.ncbi.nlm.nih.gov/16095413/. A, 3. „The EMG activity was greater in both muscle groups during push-ups performed from the narrow base hand position compared with
  the wide base position”.
- **L5-S32** Santana JC, Vera-Garcia FJ, McGill SM. A kinetic and electromyographic comparison of the standing cable press and bench press. J Strength Cond Res 2007;21(4):1271–7.
  https://pubmed.ncbi.nlm.nih.gov/18076235/. A, 3. „for the 1RM single-arm SP, the left internal oblique and left latissimus dorsi activities were similar to those of the anterior
  deltoid and pectoralis major”.
- **L5-S33** Saeterbakken AH, Fimland MS. Effects of body position and loading modality on muscle activity and strength in shoulder presses. J Strength Cond Res 2013;27(7):1824–31.
  https://pubmed.ncbi.nlm.nih.gov/23096062/. A, 3. „the exercise with the greatest stability requirement (standing and dumbbells) demonstrated the highest neuromuscular activity
  of the deltoid muscles”.
- **L5-S34** Saeterbakken AH, Fimland MS. Muscle activity of the core during bilateral, unilateral, seated and standing resistance exercise. Eur J Appl Physiol 2012;112(5):1671–8.
  https://pubmed.ncbi.nlm.nih.gov/21877146/. A, 3. „For external oblique: ~81% lower in seated bilateral versus unilateral … ~68% lower in standing bilateral than unilateral”.
- **L5-S35** Coratella G i in. Front vs Back and Barbell vs Machine Overhead Press: An Electromyographic Analysis. Front Physiol 2022;13:825880. https://pubmed.ncbi.nlm.nih.gov/35936912/.
  A, 3. „Performing back overhead press enhances the excitation of medial and posterior and partly anterior deltoid, while front overhead favors pectoralis major. Overhead press
  performed using barbell excites muscles more than using machine”.
- **L5-S36** Błażkiewicz M, Hadamus A. The Effect of the Weight and Type of Equipment on Shoulder and Back Muscle Activity … during the Overhead Press. Sensors 2022;22(24):9762.
  https://pubmed.ncbi.nlm.nih.gov/36560129/. A, 3 („preliminary”). „No significant differences were found in the activation of assessed muscles when comparing dumbbell to kettlebell
  press trials”. Pomocniczo: Busch A i in. J Bodyw Mov Ther 2024;37:308–14, https://pubmed.ncbi.nlm.nih.gov/38432822/ (A): hantel vs kettle — różnice tylko w bocznym aktonie i dolnym czworobocznym.
- **L5-S37** McKenzie A i in. Bench, Bar, and Ring Dips: Do Kinematics and Muscle Activity Differ? Int J Environ Res Public Health 2022;19(20):13211. https://pubmed.ncbi.nlm.nih.gov/36293792/.
  A, 3. „The bench dip predominantly targets the triceps brachii”; „The ring dip had similar peak activations to the bar dip”. Pomocniczo tych samych autorów: IJERPH 2022;19(21):14390,
  https://pubmed.ncbi.nlm.nih.gov/36361276/ (A): bar dip „appears to target pectoralis major and triceps brachii effectively”.
- **L5-S38** Youdas JW i in. Surface electromyographic activation patterns … during a pull-up, chin-up, or perfect-pullup rotational exercise. J Strength Cond Res 2010;24(12):3404–14.
  https://pubmed.ncbi.nlm.nih.gov/21068680/. A, 3. „latissimus dorsi (117-130%), biceps brachii (78-96%) …”; „The pectoralis major and biceps brachii had significantly higher EMG
  activation during the chin-up than during the pull-up”.
- **L5-S39** Lehman GJ i in. Variations in muscle activation levels during traditional latissimus dorsi weight training exercises. Dyn Med 2004;3(1):4. https://pubmed.ncbi.nlm.nih.gov/15228624/.
  A, 3. „No exercise type influenced biceps brachii activity. The highest latissimus dorsi to biceps ratio of activation occurred during the wide grip pulldown and the seated row.”
- **L5-S40** Signorile JF, Zink AJ, Szwed SP. A comparative electromyographical investigation of muscle utilization patterns using various hand positions during the lat pull-down.
  J Strength Cond Res 2002;16(4):539–46. https://pubmed.ncbi.nlm.nih.gov/12423182/. A, 3. „During the concentric phase, NrmsEMG results for the LD included WGA > WGP, SG, CG.”
- **L5-S41** Sperandei S i in. Electromyographic analysis of three different types of lat pull-down. J Strength Cond Res 2009;23(7):2033–8. https://pubmed.ncbi.nlm.nih.gov/19855327/.
  A, 3. „FNL is the better choice, whereas BNL is not a good lat pull-down technique and should be avoided. V-bar could be used as an alternative.”
- **L5-S42** Andersen V i in. Effects of grip width on muscle strength and activation in the lat pull-down. J Strength Cond Res 2014;28(4):1135–42. https://pubmed.ncbi.nlm.nih.gov/24662157/.
  A, 3. „There was similar EMG activation between grip widths for latissimus, trapezius, or infraspinatus”.
- **L5-S43** Fenwick CM, Brown SH, McGill SM. Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness. J Strength Cond Res
  2009;23(5):1408–17. https://pubmed.ncbi.nlm.nih.gov/19620925/. A, 3. „The inverted row elicited the highest activation of the latissimus dorsi muscles, upper back, and hip
  extensor muscles”; „The 1-armed cable row challenged the torsional capabilities of the trunk musculature.”
- **L5-S44** free-exercise-db (domena publiczna), dist/exercises.json, https://github.com/yuhonas/free-exercise-db — pole `instructions`. PT; **tylko identyfikacja ruchu**
  (co to za ćwiczenie, sprzęt), nie podstawa partii (baza bez autorów i źródeł; szczebel ≤ 5).

Przejrzane i odrzucone: Soria-Gila MA i in. 2015 (metaanaliza oporu zmiennego, J Strength Cond Res; https://pubmed.ncbi.nlm.nih.gov/25968227/) — **artykuł wycofany (retracted 2018)**,
nie użyty. Işiklar 2026 (Physiother Theory Pract, kettle vs hantel) — tylko streszczenie, nie wnosi do mapowania.
Nieprzeczytane (nie cytowane): Barnett 1995 (tylko przez wzmiankę ExRx), NSCA Exercise Technique Manual, ACE Exercise Library (strony nie pobrane).


Źródła L5 bez użycia w rekordach: brak. Liczba użyć: 24:S10 ×3, 24:S11 ×15, 24:S12 ×15, 24:S13 ×11, 24:S15 ×4, 24:S35 ×2, 24:S36 ×1, 24:S37 ×11, 24:S6 ×28, 24:S7 ×12, 24:S8 ×10, 24:S9 ×2, L5-S1 ×11, L5-S2 ×5, L5-S3 ×4, L5-S4 ×10, L5-S5 ×10, L5-S6 ×2, L5-S7 ×3, L5-S8 ×1, L5-S9 ×3, L5-S10 ×1, L5-S11 ×4, L5-S12 ×1, L5-S13 ×6, L5-S14 ×1, L5-S15 ×4, L5-S16 ×4, L5-S17 ×41, L5-S18 ×2, L5-S19 ×14, L5-S20 ×10, L5-S21 ×12, L5-S22 ×12, L5-S23 ×4, L5-S24 ×8, L5-S25 ×10, L5-S26 ×10, L5-S27 ×9, L5-S28 ×9, L5-S29 ×1, L5-S30 ×1, L5-S31 ×5, L5-S32 ×2, L5-S33 ×7, L5-S34 ×3, L5-S35 ×6, L5-S36 ×11, L5-S37 ×6, L5-S38 ×8, L5-S39 ×9, L5-S40 ×8, L5-S41 ×2, L5-S42 ×7, L5-S43 ×12, L5-S44 ×33.
