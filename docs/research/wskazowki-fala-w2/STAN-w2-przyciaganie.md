# STAN — grupa G6 (przyciąganie, chwyt, noszenie, strongman, cardio), fala W2, 02.11.2026

Koordynator grupy: sesja badań W2 G6. Gałąź `badania/w2-przyciaganie` od `2dc54e2` (`integracja-1-1`). Zakres: TYLKO zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json`, `lib/**` i testach. Integruje koordynator linii 1.1.

Podstawa: wyniki W1 po przeliczeniu szczebli (`origin/badania/g6-przyciaganie`, commit `5e8dd35`), szczeble `docs/research/szczeble-organizacji-2026-11-02.md` (`origin/badania/lokalne-0211`, uzupełnienia 1–3) i rozstrzygnięcia z briefu W2 (Generation Iron 4 tylko ekspert z listy; Fitness Volt 4 przy autorze z kwalifikacjami i dacie; gość bez kwalifikacji 5; kopie instrukcji nieutożsamione — nie liczą się; StrongFirst warunkowo 4 per strona z autorem; 8weeksout otwarte; Coach i Eleiko bez autora 5).
Pracowało 5 badaczy (`badacz-merytoryczny`) równolegle: pull_up + pulldown, row + cable_row, shrug + forearm, carry + strongman, cardio. Lista ćwiczeń: rodzina z `assignAll()` (`lib/figures/v2/families.ts:160`), tryb z `lib/figures/v2/cue-sets.json`, rysunek z `lib/figures/v2/poses/<rodzina>.json` — 98 ćwiczeń.

Pliki: `docs/research/wskazowki-fala-w2/<rodzina>.md` (każdy z jednym blokiem JSON „Blok do wdrożenia”; wpisy z `"_tryb": "dopisz"` = tylko błędy do istniejącej karty W1/aplikacji). Plików `role-miesni-fala-w2/` nie ma — żaden badacz nie miał nowych ustaleń o rolach (otwarte pozycje W1 bez zmian).

## Wynik na rodzinę

„Nowa karta z błędem” = ustawienie + ruch + ≥ 1 błąd (warunek wejścia w rodzinach z rysunkami v2, decyzja koordynatora 02.11.2026). „Dopisane błędy” = karta istniejąca (aplikacja albo W1) dostaje błędy.

| Rodzina | Ćw. | Nowe karty z błędem | Bez błędu / częściowe | Dopisane błędy do kart | Błędy wnioskowane | Role | Otwarte |
|---|---|---|---|---|---|---|---|
| pull_up | 13 | 2: Dead Hang, Scapular Pull-Up (obie zależą od decyzji 1) | Muscle Up — częściowe (open), poza blokiem | Rope Climb (1) | 1 | — | 6: Gironda, Mixed Grip, One Arm, Wide-Grip Rear, Side To Side, Gorilla |
| pulldown | 8 | 1: V-Bar (uproszczenie: wariant sprzętu Lat Pulldown) | — | 4: Lat Pulldown, Close-Grip Front, Underhand, Straight Arm (2 ze źródeł, 2 wnioskowane) | 2 | — | 3: Single Arm, Full ROM, Behind The Neck |
| row | 13 | 3: Reverse Grip Bent Over Row; Bent Over Row (linki) i Lying T-Bar Row (uproszczenia) | — | 3: Seal Row, Chest Supported Row, One Arm Row (hantle) | 4 | — | 2: Meadows Row, Barbell Rear Delt Row |
| cable_row | 10 | 2: Standing Cable Row; Single Arm Cable Row (decyzja 4) | — | 2: Face Pull (ze źródeł), Cable Rope Rear-Delt Rows | 1 | — | 3: Kneeling High Pulley Row, Leverage High Row, Sled Row |
| shrug | 8 | 4: Shrugs (linki), Leverage Shrug (uproszczenia); Barbell i Smith Behind The Back (decyzja 2) | — | 2: Shrugs (sztanga), Shrugs (hantle) — po 3 błędy ze źródeł | 2 | — | 2: Calf-Machine, Middle Back |
| forearm | 13 | 5: Reverse Wrist Curl (hantle), One-Arm Wrist Curl, One-Arm Reverse Wrist Curl, Cable Wrist Curl (uproszczenia), Plate Pinch (open) | — | 4 karty W1: Wrist Curl (hantle), Barbell Wrist Curl, Barbell Reverse Wrist Curl, Wrist Roller | 10 | — | 4: Behind-the-Back, Reverse Plate Curls, Lying Pronation, Lying Supination |
| carry | 7 | — (karty W1 kompletne po dopisaniu: Overhead Carry, Farmers Handles) | Farmer's Walk (trap bar) — częściowe, uproszczenie (decyzja 5) | 4: Farmer's Walk, Farmers Handles, Overhead Carry, Suitcase Carry | 4 | — | 2: Front Rack Carry, Rickshaw |
| strongman | 10 | 1: Atlas Stones (przegląd systematyczny + BarBend, błąd wnioskowany) | Tire Flip, Log Lift — sam ruch, częściowe (open) | — (Yoke Walk gotowe w W1) | 1 | — | 6: Sandbag, Keg, Jefferson, Circus Bell, Conan's Wheel, Power Stairs |
| cardio | 16 | 3: Skakanka, Battle Ropes, Orbitrek | 5 częściowych: Stair Climber, Assault Bike (bez ruchu), Treadmill Walking (same wskazówki), High Knees, Fast Skipping (jedno źródło szczebla 3) | 4: Rowing Machine, Burpees, Bieg, Rower | 9 wpisów (8 zdań) | — | 3: Ski Erg, Jumping Jacks, Carioca |
| **Razem** | **98** | **21** | **8 częściowych** | **27 kart** | **≈ 34** | **0** | **31** |

Nowe zdania (id nieobecne w `lib/cues/text/pl.json`; PL + EN w plikach rodzin, każde wymaga wpisu w rejestrze twierdzeń i słowniku terminów przy integracji): pull_up 7 (`hang.grip`, `hang.shoulders`, `hang.tight`, `hang.mis.shrug`, `scap.pull`, `scap.mis.elbows`, `rope.mis.arms`), pulldown 6, row 4 (w tym `row.bbPullCtrl` z W1), cable_row 6 (w tym `cr1.*` z W1), shrug 4, forearm 5, carry 3, strongman 6, cardio 25 (część z W1) — razem ok. 66.

## Decyzje dla koordynatora linii 1.1 (przed integracją)

1. **GORNATION** (producent drążków/sprzętu do kalisteniki): strony firmowane i datowane, ale z blokami „Shop Now” (kryterium 3). Od tego zależą Dead Hang i Scapular Pull-Up.
2. **`fv-13180`** (Fitness Volt, dwóch autorów z kwalifikacjami, data tylko w metadanych strony) — szczebel 4? Jeśli nie, obie karty zza pleców (shrug) wracają do otwartych. Ogólniej: **data Fitness Volt tylko w metadanych** (jak przy `fv-wrist-roller` w W1) — od tego zależy też `shrug.mis.roll`.
3. **Karty wyłącznie ze źródeł wariantu sprzętu** (`uproszczenie: wariant sprzętu`): Bent Over Row (linki), Lying T-Bar Row, V-Bar Pulldown, Shrugs (linki), Leverage Shrug, 4 karty forearm, Farmer's Walk (trap bar) — decyzja 4 z W1 nadal otwarta; recenzent ma potwierdzić, że ruch się nie różni.
4. **Single Arm Cable Row** — drugie źródło Healthline (nazwany recenzent DPT) opisuje wersję jednorącz krótką wzmianką; wystarcza?
5. **Farmer's Walk (trap bar)** — ustawienie `tb.inside` ze źródeł martwego ciągu z trap barem (uproszczenie); bez zgody zostaje otwarte.
6. **Cardio:** TRUE Fitness (firmowane, bez daty) = 4? (Stair Climber); czy rozstrzygnięcie o B. Lee (5) obejmuje dokumentację producenta skakanek Elite Jumps (autor i data) — od tego zależy karta Skakanki; przedruk Carra (szczebel 3) — High Knees, Fast Skipping.
7. **`wr.mis.lift` jako błąd wnioskowany** (forearm ×3) — W1 odmówiła go bez źródła; brief W2 dopuszcza wniosek.
8. **Seal Row `row.mis.chestOff`** — wniosek z `seal.setup` uznany przez badacza za „dość daleki”; przy odrzuceniu Seal Row zostaje kartą bez błędu.
9. **Pokrycia błędu ze wskazówką:** `carry.mis.lean` vs `carry.noLean` (Suitcase Carry), `sapd.mis.bend` vs `sapd.arms` — zostawić oba albo przenieść wskazówkę do błędów.
10. **Straight Arm Pulldown** — `sapd.setup`/`sapd.move` stoją na ACE + Eleiko bez autora (= 5; uwaga z W1); `sapd.mis.bend` ma sens tylko, jeśli te zdania zostaną.

## Konflikty identyfikatorów i rysunków

- **`rope.*`**: Rope Climb (pull_up) i Skakanka (cardio) używały tego samego prefiksu (`rope.mis.arms` w obu plikach W2 z innym znaczeniem). W pliku cardio W2 skakanka przemianowana na `jrope.*`; zdania skakanki z W1 przy integracji też `jrope.*`.
- **`hang.*`**: nowe zdania Dead Hang (`hang.grip`, `hang.shoulders`, `hang.tight`, `hang.mis.shrug`) wchodzą w przestrzeń zwisu z wznosami nóg (`hang.slow`, `hang.noSwing`, `hang.ribs` w `lib/cues/text/pl.json`); W1 proponowała `dh.*`. Kolizji id brak — decyzja o nazwach przy integracji.
- **`sb.*`** zajęty (`sb.plane`) — Sandbag Load z W1 (`sb.lap`) przy integracji np. `sbag.lap`.
- **Rysunki:** Cable Rope Rear-Delt Rows — rysunek pokazuje wersję siedzącą, `rdcr.setup` (W1) stojącą; Standing Cable Row — wyciąg w danych póz na `y: 100` przy maszynie 230 (badacz przypuszcza wysokość pasa, źródła: klatka) — do sprawdzenia w recenzji figur. Badacze nie sprawdzali, czy rysunki pokazują nowe błędy (bramka 4).
- **Zestawy ogólne sprzeczne ze źródłami** (bez zmian od W1, potwierdzone w W2): `walk.rails` (Orbitrek, Stair Climber), `jump.mis.stiff` (Skakanka, High Knees, Fast Skipping).

## Pułapki

- `tests/cues.test.tsx` w `verify:docs` pada pod obciążeniem (środowisko Jest zamknięte po czasie, `tests/app.tsx:41`) — tak samo w W1; ponowienie na spokojnej maszynie zielone (wynik niżej).
- Nagłówki bloków: w shrug.md i forearm.md „## 2. Blok do wdrożenia”, w carry/strongman „## Blok do wdrożenia”, w pozostałych „### …” — przy automatycznym wyciąganiu bloku szukaj „Blok do wdrożenia” niezależnie od poziomu.
- Ścieżki dostępu jak w W1 (exrx 403, muscleandstrength 403, archiwum niedostępne).

## Zostało

Nowy research ma małą szansę: otwarte to głównie ćwiczenia niszowe (strongman, Gorilla, Side To Side, Middle Back Shrug, Lying Pronation/Supination, Ski Erg, Carioca). Role mięśni: pozycje otwarte z W1 bez zmian (Muscle Up, One Arm, Dead Hang lats, przedramiona w szrugach, Wrist Roller, Plate Pinch, Farmer's ×3, Circus Bell, Conan's Wheel, Battle Ropes). Następny krok należy do koordynatora 1.1: decyzje 1–10, potem integracja z niezależną recenzją (L-047).

## Git i verify

- **Verify bazy (`2dc54e2`, pełne `npm run verify`, 02.11.2026): ZIELONE** — exit 0; Jest 658/660 w pierwszym przebiegu, 2 pliki (`maestro-flows`, `matrix-dim-langs-routes2`) przerwane SIGTERM workera, ponowione osobno przez `jest-ponow` — zielone; 15 934 testów zaliczonych, 3 pominięte; natywne OK; znacznik `pelne` zapisany.
- Commity: `8bed9db7` (carry, strongman), następny — pozostałe rodziny i ten plik. SHA wypchnięcia — raport końcowy sesji.
