# Audyt treści kart ćwiczeń 1.1 — partia 1 (G2b), 27.10.2026

Audytor treści (niezależny), stan treści: `origin/integracja-1-1` @ 88c2bf73; kontekst ruchu: pierwotne recenzje `recenzje-1-1/<rodzina>.md` @ c7107a65 (ruchu nie oceniam ponownie).
Zakres: 10 rodzin, **143 ćwiczenia** (wpisy w `lib/figures/v2/poses/<rodzina>.json`): triceps 29, delt_raise 30, curl 36, forearm 11, shrug 8, carry 7, thruster 3, cable_press 4, rotator_cuff 7, pulldown 8.

Metoda (bez uruchamiania testów, tylko odczyt plików): karta = to, co składają `components/ExerciseCues.tsx` + `ExerciseFigureV2.tsx` + `MuscleRoles.tsx` + `app/exercise/[id].tsx`.
Sprawdzone dla każdego ćwiczenia: tryb wskazówek (`lib/cues/data.json` = własne, `lib/figures/v2/cue-sets.json` = ogólne z dopiskiem, open), tekst każdego id w `lib/cues/text/pl.json` / `en.json` (i komplet w 35 plikach językowych), źródła (`data/zrodla/cues.json`; dla zestawów ogólnych przez słownik badacza `badania-figury/wskazowki-slownik*.json` → ćwiczenie źródłowe), wiersze błędów rysunku (`bledy[]` w pozie + błąd tempa `mis.jerk`) względem sekcji „Częste błędy”, mięśnie (legenda figury `muscles.generated.ts` = mapa partii `MUSCLE_LOAD` — zgodne w 143/143), role mięśni (reguły `lib/muscleRoles/data.json`, teksty w `lib/i18n.en.ts` — komplet), tempo i „Kąt na rysunku” (`poseData.ts`: `DATA_UI`), nazwy źródeł/marek w tekstach, liczby i twierdzenia zdrowotne (rejestr twierdzeń).

## Podsumowanie

| | Liczba |
|---|---|
| Ćwiczenia | 143 (własne wskazówki 20, zestaw ogólny 121, open 2) |
| **OK** | **90** |
| **OK z uwagą** (NISKIE) | **28** |
| **BŁĄD** (treść) | **25** (WYSOKIE 1, ŚREDNIE 24) |
| Nazwy źródeł / organizacji / marek w tekstach karty | 0 |
| Liczby i twierdzenia zdrowotne w tekstach kart tych rodzin | 0 (żaden tekst nie wymaga wpisu w `rejestr-twierdzen.json`) |
| Wskazówki bez źródła | 0 (każde id ma ≥ 2 źródła; 1 błędne odesłanie w słowniku — S5) |
| Teksty brakujące w PL/EN | 10 id → 21 ćwiczeń (S1) |
| Pozostałe 33 języki | komplet dla 78 id z tekstem (es-419, pt-BR to nakładki) |

**Uwaga nadrzędna:** na `integracja-1-1` żadna z 10 rodzin nie jest podłączona (status `planned`; `poseData.ts`: `LOAD` i `DATA_UI` mają tylko `pull_up`). W aplikacji widać dziś tylko własne wskazówki 20 ćwiczeń (bez figury v2); zestawy ogólne, wiersze błędów, tempo i kąt pojawią się dopiero po podłączeniu. Znaleziska niżej dotyczą stanu karty po podłączeniu (i eksportu na stronę) — blokują status „zatwierdzona” rodziny, nie bieżące wydanie.

### Znaleziska systemowe

| # | Znalezisko | Ćwiczenia | Waga / realność | Co zrobić | Reguła łapie? |
|---|---|---|---|---|---|
| S1 | **Brak tekstu wskazówki w PL i EN** (id z `newIds`, „wdroży tłumacz”). `ExerciseCues` w trybie ogólnym po cichu odfiltrowuje id bez tekstu (`filter(x !== ids[i])`), a błąd bez tekstu nie dostaje wiersza rysunku. Brakujące: `wr.forearms`, `wr.range`, `wr.mis.lift`, `rot.elbow`, `rot.slow`, `rot.mis.elbowAway`, `ur.elbows`, `oly.back`, `oly.close`, `oly.mis`. Skutek: **wrist curl ×7 i rotacje ×5 — zero wskazówek i brak wiersza błędu**; Behind-the-Back Wrist Curl — tylko „Szarpanie…”; Upright Row ×7 — zostaje samo „Unoś mniej więcej do wysokości barków” (bez „łokcie prowadzą, wyżej niż dłonie” zdanie jest dwuznaczne: co ma dojść do barków?); Clean and Press — 1 z 4 (tylko `ohp.tall`). Teksty i po 2 źródła istnieją w słowniku badacza. | Barbell Wrist Curl, Barbell Reverse Wrist Curl, Wrist Curl (hantle), Reverse Wrist Curl (hantle), One-Arm Dumbbell Wrist Curl, One-Arm Dumbbell Reverse Wrist Curl, Cable Wrist Curl, Behind-the-Back Barbell Wrist Curl; External Rotation (hantel), External Rotation (linki), External Rotation with Band, Internal Rotation with Band, Cable Internal Rotation; Upright Row (sztanga), Upright Row (hantle), Dumbbell One-Arm Upright Row, Upright Row (linki), Band Upright Row, Smith Machine Upright Row, Smith Machine One-Arm Upright Row; Clean and Press (21) | ŚREDNIE, realny (po podłączeniu rodziny) | Tłumacz: 10 zdań do `lib/cues/text/*.json` (36 języków), potem wiersze błędów `wr.mis.lift`, `rot.mis.elbowAway`, `oly.mis` do póz (reguła `etykieta_bledu` je wtedy dopuści). | **Nie.** `tests/figures-v2-cues.test.tsx` akceptuje `newIds` bez tekstu; nic nie wiąże statusu `ready` rodziny z kompletem tekstów. Propozycja: test „rodzina `ready` ⇒ każde id jej zestawów ma tekst w pl i en” (`tekst_wskazowki_przed_ready`). |
| S2 | **„Kąt na rysunku” i licznik faz nie mają słów dla 5 rodzin.** Linia kąta jest bezwarunkowa, a `MeasuredJoint` = tylko kolano / łokieć / biodro; `PhaseName` = Podciąganie, Opuszczanie, Wypychanie, Wstawanie, Podnoszenie, Prostowanie. Test wymusza wpis `DATA_UI` przy podłączeniu, więc wznosy ramion, szrugsy, rotacje, nadgarstek i noszenie dostaną kąt stawu, który się nie rusza (np. „kolano 12°” przy wznosie bokiem), a noszenie (metryka dystans) — fazy „Opuszczanie 2 s · Pauza…”. Silnik już liczy `shAbd`, `shrug`, `wristFlex`, `forearmRoll` (`skeleton.ts`). | delt_raise (30), shrug (8), rotator_cuff (7), forearm (11), carry (7) = 63; nazwy faz także triceps („Zginanie” brak), pulldown („Ściąganie” brak), curl („Uginanie”) | ŚREDNIE, realny przy podłączeniu (liczba prawdziwa, ale o nieistotnym stawie — wprowadza w błąd) | Przed podłączeniem: rozszerzyć `MeasuredJoint` (bark: odwiedzenie/zgięcie, unoszenie barków, nadgarstek, rotacja) albo pozwolić `DATA_UI` ukryć linię kąta; dopisać nazwy faz (Uginanie, Prostowanie łokcia, Unoszenie, Obrót, Ściąganie) albo pętlę bez faz dla noszenia. Decyzja produktowa ≥ 2 opcje (koordynator). | Nie (test sprawdza tylko istnienie wpisu). |
| S3 | **Liczba mnoga w zestawach ogólnych przy ćwiczeniach jednorącz** („Ramiona nieruchomo, łokcie…”, „Prostuj ręce do końca…”, „Łokcie przy bokach…”). Zrozumiałe, ale trener powiedziałby „łokieć”, „rękę”. | Dumbbell One-Arm Triceps Extension, Standing Low-Pulley One-Arm Triceps Extension, One-Arm Lying Dumbbell Triceps Extension, Single Arm Triceps Pushdown, One-Arm Lateral Raise (hantel), One-Arm Cable Rear Lateral Raise, Standing One-Arm Cable Curl, Single Arm Cable Chest Press, Single Arm Lat Pulldown (9) | NISKIE, realny | Backlog: wersje zdań w liczbie pojedynczej albo neutralne („łokieć/łokcie”). | — |
| S4 | **Spójność wierszy błędu w rodzinie:** ćwiczenia z własnymi wskazówkami bez sekcji „Częste błędy” nie mają żadnego wiersza błędu, a ich odmiany z zestawem ogólnym mają wiersz „Szarpanie…” (np. Triceps Pushdown — brak, Reverse Grip Triceps Pushdown — jest). | 16 z 20 ćwiczeń „własnych” (wszystkie poza Barbell/EZ/Biceps/Hammer Curl, które mają `curl.mis.elbows`) | NISKIE, realny | Backlog: dopisać `mis.jerk` (już ze źródłami) do własnych wskazówek albo przyjąć jako zasadę (własne = tylko błędy z ich źródeł). | — |
| S5 | **Odesłanie do źródła w słowniku badacza wskazuje złe ćwiczenie:** `carry.noLean` → `data:Farmer's Walk`, a źródła tej wskazówki są przy Suitcase Carry (`data/zrodla/cues.json`). Źródła istnieją, błędny jest tylko ślad. | zestaw ogólny noszenia (5) | NISKIE (dokumentacja wewnętrzna) | Poprawić odesłanie w słowniku. | — |

### Rodziny gotowe treściowo (teksty, mięśnie, wiersze błędów)

- **Gotowe:** curl, shrug, carry, cable_press, pulldown — tylko uwagi NISKIE. Warunek przy podłączeniu: S2 (kąt/fazy) dla shrug i carry (oraz nazwy faz curl/pulldown).
- **Niegotowe:** triceps (B3), delt_raise (S1 Upright Row, B2), forearm (S1), thruster (S1 Clean and Press; Thruster ×2 OK z uwagą), rotator_cuff (S1).

## Znaleziska pojedyncze: BŁĄD

| # | Ćwiczenie | Co jest źle | Jak powinno być | Waga / realność | Reguła łapie? |
|---|---|---|---|---|---|
| B1 | 21 ćwiczeń z S1 | patrz S1 | patrz S1 | ŚREDNIE, realny | nie |
| B2 | **Straight Raises on Incline Bench** | Zestaw ogólny `raiseFront` daje „Unoś mniej więcej do wysokości barków” (`lat.height`), a rysunek prowadzi sztangę nad głowę (zgięcie barku 45° → 150°, recenzja ruchu delt_raise). Karta przeczy sobie: tekst mówi „do barków”, figura pokazuje ruch nad głowę. Analogicznie Front Raise to Overhead ma słusznie usunięte `lat.height`. | Ustalić wariant (badacz): albo zestaw bez `lat.height` (jak „to Overhead”), albo poza kończy na wysokości barków. | WYSOKIE (sprzeczne twierdzenie techniki na jednej karcie), realny po podłączeniu; pewność 70% | **Nie** — `CUE_REQUIRES` nie ma predykatów dla rodzin z danych. Propozycja: `lat.height` tylko gdy szczyt zgięcia/odwiedzenia barku ≤ ok. 110°. |
| B3 | **Skullcrusher (hantle), Band Skull Crusher, Decline Dumbbell Triceps Extension** | `skull.depth`: „Opuszczaj, aż **gryf** będzie tuż nad czołem…” przy hantlach i gumie. `data/zrodla/cues.json` sam zaznacza, że wersja z hantlami nie ma opisu w źródłach (open: „brak opisu wersji z hantlami”), a zestaw ogólny przenosi zdanie o gryfie. | Zdanie neutralne co do sprzętu („aż ciężar/dłonie będą tuż nad czołem”) albo `skull.depth` tylko przy gryfie (sztanga, EZ). | ŚREDNIE, realny | **Nie.** Propozycja: predykat w `CUE_REQUIRES` — zdania z „gryf/sztanga” tylko przy sprzęcie z chwytem `gryf`. |

## OK z uwagą (NISKIE, backlog)

- S3 (9 ćwiczeń jednorącz) i S5 (5 ćwiczeń noszenia: Farmer's Walk (Farmers Handles), Farmer's Walk (trap bar), Rickshaw Carry, Overhead Carry (hantle), Double Kettlebell Front Rack Carry).
- **Machine Triceps Extension, Machine Lateral Raise:** wskazówka `llc.control` („Ruch płynny w obie strony, bez szarpania”) i błąd `mis.jerk` („Szarpanie…”) mówią to samo.
- **Band Overhead Triceps Extension, Band Lateral Raise, Band Pull Apart:** błąd „Szarpanie i **rzucanie ciężarem**…” przy gumie (brak ciężaru). (Band Upright Row, Band Skull Crusher — już w BŁĘDACH.)
- **Car Drivers:** zestaw `raiseFront` („Unoś… do wysokości barków”, łokcie proste) nie mówi o istocie ćwiczenia (obrót talerza jak kierownicą); nie przeczy rysunkowi.
- **Incline Cable Chest Press:** `bp.control` „bez odbijania od klatki” przy linkach (nie ma czego odbijać); reszta zestawu ławkowego zgodna z rysunkiem, wiersz `bp.mis.arch` jest.
- **Incline Barbell Triceps Extension, Decline EZ Bar Triceps Extension:** `skull.upperArm` „ramiona… mniej więcej pionowo” na ławce skośnej — ramiona są prostopadle do tułowia, nie pionowo.
- **Thruster (hantle), Kettlebell Thruster:** legenda figury: barki (przedni akton) główne, ale „Co robią mięśnie” nie ma dla nich zdania (wzorzec `squat` ma role tylko dla nóg) — wyjaśniona jest tylko faza przysiadu.
- **Reverse Flyes With External Rotation:** jedna wskazówka (`rear.elbows`), nic o rotacji, która odróżnia ćwiczenie.
- **Dumbbell Lying Pronation, Dumbbell Lying Supination:** zestaw `open` (brak 2 zgodnych źródeł) — karta = figura + mięśnie, zgodnie z zasadą; przedramiona główne bez zdania roli.

## Wynik na ćwiczenie

Treść oceniona: wskazówki (teksty, źródła, zgodność z rysunkiem wg liczb z recenzji ruchu), mięśnie i role, wiersze błędów. Tempo i kąt: brak `DATA_UI` dla wszystkich 10 rodzin (S2) — do oceny przy podłączeniu.

| Rodzina | Ćwiczenie | Tryb | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|---|
| triceps | Overhead Triceps Extension (hantel), Cable Overhead Extension, Skullcrusher (EZ), Triceps Pushdown | własne | zgodna z rysunkiem; źródła ≥ 2 | OK (4) | brak wiersza błędu (S4) |
| triceps | Overhead Triceps Extension (EZ), Standing Overhead Barbell Triceps Extension, Kettlebell Overhead Triceps Extension, Cable Incline Triceps Extension, Kneeling Cable Triceps Extension, Skullcrusher (sztanga), Chain Handle Extension, Cable Lying Triceps Extension, Lying Close-Grip Barbell Triceps Extension Behind The Head, Tate Press, Reverse Grip Triceps Pushdown, Triceps Kickback, Two-Arm Dumbbell Kickback, Triceps Kickback (linki) | ogólny | zgodna | OK (14) | Tate Press: zestaw ławkowy, mięśnie „przybliżony”; ruch Tate Press ma BŁĄD w recenzji ruchu (nie treść) |
| triceps | Dumbbell One-Arm Triceps Extension, Standing Low-Pulley One-Arm Triceps Extension, One-Arm Lying Dumbbell Triceps Extension, Single Arm Triceps Pushdown | ogólny | l. mnoga | OK z uwagą (4) | S3 |
| triceps | Band Overhead Triceps Extension | ogólny | „ciężarem” przy gumie | OK z uwagą | NISKIE |
| triceps | Machine Triceps Extension | ogólny | dubel wskazówka/błąd | OK z uwagą | NISKIE |
| triceps | Incline Barbell Triceps Extension, Decline EZ Bar Triceps Extension | ogólny | „pionowo” na ławce skośnej | OK z uwagą (2) | NISKIE |
| triceps | Skullcrusher (hantle), Band Skull Crusher, Decline Dumbbell Triceps Extension | ogólny | „gryf” przy hantlach/gumie | **BŁĄD** (3) | B3, ŚREDNIE |
| delt_raise | Lateral Raise (hantle), Front Raise, Cable Lateral Raise, Reverse Fly (hantle), Reverse Pec Deck | własne | zgodna ze źródłami | OK (5) | Reverse Pec Deck: tekst („przodem do oparcia”) poprawny, rysunek mu przeczy — BŁĄD ruchu w recenzji ruchu; S4 |
| delt_raise | Dumbbell Scaption, Alternating Deltoid Raise, Cable Seated Lateral Raise, Single Dumbbell Front Raise, Front Plate Raise, Cable Front Raise, Front Incline Dumbbell Raise, Barbell Front Raise to Overhead, Dumbbell Front Raise to Overhead, Cable Reverse Fly, Y Raise (hantle), Cable Y Raise | ogólny | zgodna | OK (12) | |
| delt_raise | One-Arm Lateral Raise (hantel), One-Arm Cable Rear Lateral Raise | ogólny | l. mnoga | OK z uwagą (2) | S3 |
| delt_raise | Band Lateral Raise | ogólny | „ciężarem” przy gumie | OK z uwagą | NISKIE |
| delt_raise | Machine Lateral Raise | ogólny | dubel wskazówka/błąd | OK z uwagą | NISKIE |
| delt_raise | Car Drivers | ogólny | brak wskazówki o obrocie | OK z uwagą | NISKIE |
| delt_raise | Straight Raises on Incline Bench | ogólny | tekst „do barków” vs rysunek nad głowę | **BŁĄD** | B2, WYSOKIE |
| delt_raise | Upright Row (sztanga), Upright Row (hantle), Dumbbell One-Arm Upright Row, Upright Row (linki), Band Upright Row, Smith Machine Upright Row, Smith Machine One-Arm Upright Row | ogólny | brak `ur.elbows` | **BŁĄD** (7) | S1, ŚREDNIE |
| curl | Barbell Curl, EZ Bar Curl, Biceps Curl (hantle), Hammer Curl, Cable Curl, Preacher Curl | własne | zgodna; wiersz `curl.mis.elbows` = sekcja błędów (4 ćw.) | OK (6) | „do pełnego wyprostu” vs dół 18–26° to uwaga H ruchu, nie treści; Cable Curl, Preacher Curl: S4 |
| curl | Reverse Curl, Standing Dumbbell Reverse Curl, Zottman Curl, Standing Inner-Biceps Curl, Cross Body Hammer Curl, Reverse Cable Curl, Hammer Curl (linki), Cable Curl (dwie linki), Incline Curl (hantle), Incline Hammer Curl, Drag Curl, High Cable Curl, Bayesian Curl, Lying Supine Dumbbell Curl, Lying Close-Grip Bar Curl On High Pulley, Lying Cable Curl, Preacher Curl (EZ), Machine Biceps Curl, Spider Curl, Spider Curl (sztanga), Concentration Curl (hantle), Seated Close-Grip Concentration Barbell Curl, Standing Concentration Curl, Barbell Preacher Curl, Reverse EZ-Bar Preacher Curl, Preacher Hammer Dumbbell Curl, Zottman Preacher Curl, Cable Preacher Curl, One Arm Dumbbell Preacher Curl | ogólny | zgodna; 11 ćw. z `curl.mis.elbows` ma wiersz rysunku; Drag/High Cable/Bayesian słusznie bez „łokcie przy bokach” | OK (29) | Concentration Curl (hantle): BŁĄD ruchu w recenzji ruchu, treść OK |
| curl | Standing One-Arm Cable Curl | ogólny | l. mnoga | OK z uwagą | S3 |
| forearm | Barbell Wrist Curl, Barbell Reverse Wrist Curl, Wrist Curl (hantle), Reverse Wrist Curl (hantle), One-Arm Dumbbell Wrist Curl, One-Arm Dumbbell Reverse Wrist Curl, Cable Wrist Curl, Behind-the-Back Barbell Wrist Curl | ogólny | 0 wskazówek (Behind-the-Back: tylko błąd tempa) | **BŁĄD** (8) | S1, ŚREDNIE |
| forearm | Reverse Plate Curls | ogólny (curl) | zgodna, wiersz `curl.mis.elbows` | OK | |
| forearm | Dumbbell Lying Pronation, Dumbbell Lying Supination | open | brak wskazówek (zasada) | OK z uwagą (2) | NISKIE |
| shrug | Shrugs (sztanga), Shrugs (hantle) | własne | zgodna | OK (2) | S4 |
| shrug | Shrugs (linki), Barbell Shrug Behind The Back, Smith Machine Behind the Back Shrug, Leverage Shrug, Calf-Machine Shoulder Shrug, Middle Back Shrug | ogólny | zgodna (zestaw bez „proste ręce” — pasuje do łokci 21–45° na rysunku); Middle Back Shrug: wskazówki podparcia klatki i ściągania łopatek zgodne, słusznie bez zdania „Unosi barki” | OK (6) | S2 przy podłączeniu |
| carry | Farmer's Walk, Suitcase Carry | własne | zgodna | OK (2) | S4 |
| carry | Farmer's Walk (Farmers Handles), Farmer's Walk (trap bar), Rickshaw Carry, Overhead Carry (hantle), Double Kettlebell Front Rack Carry | ogólny | zgodna | OK z uwagą (5) | S5; S2 przy podłączeniu |
| thruster | Thruster (hantle), Kettlebell Thruster | ogólny (squat) | zgodna; wiersz `sq.mis.heels` jest | OK z uwagą (2) | role: brak zdania dla barków |
| thruster | Clean and Press | ogólny (oly) | 1 z 4 tekstów | **BŁĄD** | S1, ŚREDNIE |
| cable_press | Wyciskanie na linkach (stojąc) | własne | zgodna | OK | S4 |
| cable_press | Seated Cable Chest Press | ogólny | zgodna | OK | |
| cable_press | Single Arm Cable Chest Press | ogólny | l. mnoga | OK z uwagą | S3 |
| cable_press | Incline Cable Chest Press | ogólny (bench) | „odbijanie od klatki” przy linkach | OK z uwagą | NISKIE; wiersz `bp.mis.arch` = sekcja błędów |
| rotator_cuff | External Rotation (hantel), External Rotation (linki), External Rotation with Band, Internal Rotation with Band, Cable Internal Rotation | ogólny | 0 wskazówek, brak wiersza błędu | **BŁĄD** (5) | S1, ŚREDNIE; mięsień docelowy (stożek rotatorów) poprawnie opisany notatką „spoza mapy partii”; External Rotation (hantel): BŁĄD ruchu w recenzji ruchu |
| rotator_cuff | Band Pull Apart | ogólny | „ciężarem” przy gumie | OK z uwagą | NISKIE |
| rotator_cuff | Reverse Flyes With External Rotation | ogólny | 1 wskazówka, bez rotacji | OK z uwagą | NISKIE |
| pulldown | Lat Pulldown, Straight Arm Pulldown | własne | zgodna | OK (2) | S4 |
| pulldown | Close-Grip Front Lat Pulldown, Underhand Lat Pulldown, V-Bar Pulldown, Full Range-Of-Motion Lat Pulldown, Wide-Grip Pulldown Behind The Neck | ogólny | zgodna (Behind The Neck słusznie bez „do klatki”) | OK (5) | Behind The Neck: BŁĄD ruchu w recenzji ruchu |
| pulldown | Single Arm Lat Pulldown | ogólny | l. mnoga | OK z uwagą | S3 |

Kontrola sumy: OK 4+14+5+12+6+29+1+2+6+2+1+1+2+5 = 90; OK z uwagą 4+1+1+2+2+1+1+1+1+2+5+2+1+1+1+1+1 = 28; BŁĄD 3+1+7+8+1+5 = 25; razem 143.

## Szczelność reguł automatycznych

0 z 3 rodzajów błędów treści łapie istniejąca reguła (S1, B2, B3). Propozycje: `tekst_wskazowki_przed_ready` (S1), predykaty `CUE_REQUIRES` dla rodzin z danych — wysokość wznosu (B2) i sprzęt w treści zdania (B3); dla S2 — test „staw linii kąta zmienia się w ruchu ≥ X°” (inaczej linia ukryta).
