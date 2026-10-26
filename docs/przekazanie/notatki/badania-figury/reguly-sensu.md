# Reguły sensu ruchu — luki i propozycje (badacz, 26.10.2026)

Stan wejściowy: gałąź `gemini-polecenia` (commit 68291fa, worktree `scratchpad/wt-polecenia`): `data/zrodla/figury-sens.json`, `data/zrodla/cues.json`, `lib/figures/v2/cue-sets.json`, `lib/cues/data.json`, `scripts/figures/v2-sens.mjs`, `docs/51-figury-v2-pokrycie.md`.
Wynik w formacie danych: `reguly-sensu.json` obok (zastępuje cały `figury-sens.json`; `pull_up` bez zmian). **Runda 2: `reguly-sensu-r2.json` — pełny zamiennik, obejmuje rundę 1.**
Układ: x przód, y góra, z prawo; cm, stopnie; łokieć/kolano 0° = staw prosty; u = 0 początek, u = 1 koniec fazy koncentrycznej.

## Zasada przyjęta w tej rundzie

- Kierunek ruchu ma źródło: wskazówkę z ≥ 2 źródłami w `cues.json` / słowniku badacza albo źródła przeczytane teraz (adres + miejsce niżej). Liczba bez źródła = „uproszczenie”/„konwencja” (pole `liczba`).
- Pole `pewnosc`: „ustalone” (≥ 2 niezależne źródła), „analogia” (wskazówka innego ćwiczenia — uproszczenie), „jedno źródło”.
- Ćwiczenie, którego sensu nie da się ustalić ze źródeł → `otwarte` (bez grafiki v2 do czasu źródła).
- Źródła przeczytane 26.10.2026 oznaczam „(przeczytane)”; pozostałe są w `cues.json` z miejscem (sekcja/krok) z wcześniejszego researchu.
- Nie użyłem streszczeń z wyszukiwarki. Serwisy komercyjne i aplikacje (szczebel 5) służą najwyżej do identyfikacji ruchu, nie jako źródło.

## Co trzeba zmienić w kodzie (dla programisty) — bez tego część reguł nie zadziała

1. `regulyDla`: do zbioru reguł z mapowania dodać `zawsze[]` rodziny (gdy ćwiczenie nie ma wpisu w `warianty`). `warianty` zastępuje wszystko, `[]` = brak reguł.
2. `wskazowkiCwiczenia`: dla zestawów ogólnych brać `ok` **i** `err`. Dziś bierze tylko `ok`, więc np. `push.mis.partial` z zestawów ogólnych nigdy nie daje reguły zakresu pompki.
3. Nowy klucz `otwarte` (ćwiczenie → powód): generator pomija je jak `pomin`, a test pokrycia (bramka 5) liczy je jako jawny wyjątek.
4. Nowe typy reguł: definicje w `_typy_nowe` w JSON (każdy jako warunek liczbowy na próbkach; nazwy pól szkieletu jak w `contract.ts`: `pelvis`, `shoulderC`, `head`, `headUp`, `legs[s].knee/ankle`, `arms[s].elbow/grip`).
5. Test zgodności: każda reguła ma test „poza poprawna przechodzi / poza z błędem łamie tylko swoją grupę” (docs/53, bramka 3). Nowych liczb nie dało się sprawdzić na pozach, bo poz tych rodzin jeszcze nie ma.

## Znalezisko: fałszywe naruszenie w spięciach na ławce skośnej

`Decline Crunch` i `Decline Oblique Crunch` dostają przez `crunch.lowBack` regułę `miednica_na_podlodze` (y ≤ 12 cm, wartość bezwzględna). Na ławce skośnej miednica leży znacznie wyżej, więc poprawna poza zawsze nie przejdzie bramki 3.
Kroki: generator → rodzina core_floor → Decline Crunch → walidacja sensu. Ocena: **realny** dla potoku grafik (blokuje grafikę, nie psuje danych aplikacji).
Naprawa w JSON: `warianty` z regułą względną `miednica_nieruchoma` (zakres wysokości ≤ 3 cm).

## Rozbieżność z listą zlecenia

Liczę 19 ćwiczeń core_floor bez reguł, nie 9. Lista 9 pomija: 4 spięcia na wyciągu/maszynie (`cc.ribs` bez mapowania), `Kneeling Cable Crunch With Alternating Oblique Twists`, `GHD Sit Up`, `Press Sit-Up`, `Smith Machine Hip Raise`, `Stability Ball Knee Tuck` i `Suspended Reverse Crunch`.
Liczyłem tak samo jak `v2-sens.mjs`: wskazówki własne albo `ok` z zestawu ogólnego, potem `wskazowki_na_reguly`.

## core_floor — 9 ćwiczeń ze zlecenia

| Ćwiczenie | Wynik | Reguły (warunek) | Pewność |
|---|---|---|---|
| Superman | reguły | kończyny uniesione: dłonie i kostki ≥ 5 cm wyżej w u = 1; łokcie i kolana ≤ 20°; miednica nieruchoma ≤ 3 cm; barki ≤ 10 cm w górę (błąd `cobra.mis` → grupa „przeprost”) | kierunek ustalony (ACE #9 + 2 badania); miednica i przeprost: jedno źródło + analogia |
| V-Up | reguły | start leżąc (barki i kostki ≤ 12 cm nad miednicą w u = 0); u = 1: tułów ≥ 30° i nogi ≥ 30° nad poziomem; kolana ≤ 20°; miednica y ≤ 12 cm | pozycja końcowa ustalona (ACE #242 + Catalyst); start: jedno źródło (Catalyst) |
| Cocoons | reguły | barki ≥ 8 cm w górę (miednica może się unieść); odległość kolana–barki maleje ≥ 15 cm; szyja ≤ 30° | analogia (spięcie + spięcie odwrotne) + jedno źródło bezpośrednie (Catalyst Jack Knife) |
| Leg Pull-In | reguły z mapowania | `rcrunch.hips` → miednica ≥ 8 cm w górę, barki ≤ 4 cm; kolana–barki maleje ≥ 15 cm | analogia do spięcia odwrotnego (zestaw ogólny z 25.10) |
| Seated Flat Bench Leg Pull-In | **OTWARTE** | projekt: miednica na ławce nieruchoma, kolana do klatki, tułów lekko w przód | jedno źródło (strona M. Yessisa); `rcrunch.hips` przeczy siadowi |
| Stomach Vacuum | **OTWARTE** (produktowo) | gotowa reguła: każdy punkt szkieletu ≤ 2 cm | analogia (badania manewru wciągnięcia); istoty ruchu nie widać w szkielecie |
| Butt-Ups | **OTWARTE** | — | tylko serwisy komercyjne |
| Dragon Flag | **OTWARTE** | — | brak źródła szczebla ≤ 4 i badań z opisem |
| Side Jackknife | **OTWARTE** | — | tylko serwisy komercyjne |

Pozostałe luki core_floor:
- 4 spięcia na wyciągu/maszynie (`Cable Crunch`, `Cable Seated Crunch`, `Machine Crunch`, `Standing Rope Crunch`): reguła z `cc.ribs` — odległość barki–miednica maleje ≥ 6 cm, miednica ≤ 4 cm.
- `Suspended Reverse Crunch`: reguły z `rcrunch.hips`.
- OTWARTE (nie badane w tej rundzie albo brak wskazówki ruchu): GHD Sit Up, Press Sit-Up, Smith Machine Hip Raise, Stability Ball Knee Tuck, Kneeling Cable Crunch With Alternating Oblique Twists.
- Przy okazji `Reverse Crunch`, `Cable Reverse Crunch` i `Decline Reverse Crunch` dostają `kolana_ku_barkom`. Sama `miednica_unosi_sie` przepuszcza mostek biodrowy (miednica w górę, barki stoją) — to ta sama luka.

## Największe rodziny — reguły rodzinne (mapowanie wskazówka → reguła)

**curl (36/36).**
- `curl.elbows` → łokieć względem barków przesuwa się ≤ 8 cm.
- `curl.noSwing` → pochylenie tułowia zmienia się ≤ 5°, miednica w poziomie ≤ 3 cm.
- `zawsze`: łokieć ≤ 30° w u = 0 i ≥ 100° w u = 1 (ruch definiujący rodzinę; wskazówki `curl.*Move` i `preacher.range`).
- Błąd `curl.mis.elbows` → grupa „lokcie”.

**triceps (29/32).**
- `tpd.elbows`, `ote.upperArm`, `skull.upperArm` → łokieć względem barków ≤ 8 cm.
- `zawsze`: łokieć ≥ 70° w u = 0 i ≤ 25° w u = 1.
- OTWARTE: Body-Up, Bodyweight Triceps Extension, Sled Overhead Triceps Extension (zestaw „open”).

**delt_raise (33/38).**
- Stały kąt łokcia: ≤ 40°, zmiana ≤ 12° (`lat/front/rear.elbows`).
- Łokieć ± 12 cm od wysokości barków w u = 1 (`lat.height`).
- Kąt ramię–tułów rośnie o ≥ 45° (`lat.move/front.move`; nie dla unoszeń w tył, bo tam ramię odwodzi się poziomo i ten kąt się nie zmienia).
- Unoszenia w tył (`rear.arms/rear.move/rpd.move`): dłoń ≤ 12 cm od płaszczyzny barków i oddala się w bok o ≥ 25 cm.
- Wiosłowanie pionowe (`ur.elbows`): łokieć nie niżej niż dłoń w u = 1.
- `halo.close`: ciężar ≤ 30 cm od głowy.
- Warianty: Car Drivers (trzymanie bez unoszenia), oba unoszenia na ławce skośnej bez reguły wysokości. (Crucifix — przeniesiony do chest_fly w rundzie 2.)
- OTWARTE: trzy „Incline Shoulder Raise”, Sled Reverse Flye, Kettlebell Halo with Overhead Extension.

**pushup_plank (30/30).**
- `push.rigid`, `plank.noSag`, `splank.noSag`, `inv.rigid` → miednica ≤ 6 cm od linii barki–dalsza kostka w całym ruchu.
- `push.move`, `ipush.move`, `push.mis.partial` → łokieć w ruchu osiąga ≥ 70° i ≤ 20°.
- `mc.stable` → zakres wysokości miednicy ≤ 5 cm.
- `ro.back` → linia barki–miednica–kolano (odmiany ze stóp: kostka) ≤ 6 cm w pozycji najdalszego wysunięcia.
- Błędy: `plank.mis.sag` → grupa „linia”, `push.mis.partial` → grupa „zakres”.

## Pokrycie regułami sensu (709 ćwiczeń) — po rundzie 1

| Rodzina | Ćwiczeń | Przed | Po | Bez reguł po |
|---|---|---|---|---|
| core_floor | 44 | 25 | 34 | 10 (OTWARTE, wyżej) |
| delt_raise | 38 | 0 | 33 | 5 (OTWARTE) |
| curl | 36 | 0 | 36 | 0 |
| mobility_stand | 36 | 0 | 0 | 36 |
| triceps | 32 | 0 | 29 | 3 (OTWARTE) |
| hinge* | 32 | 0 | 0 | 32 |
| pushup_plank | 30 | 0 | 30 | 0 |
| bench_press* | 30 | 0 | 0 | 30 |
| plyo | 28 | 0 | 0 | 28 |
| squat* | 25 | 0 | 0 | 25 |
| olympic | 25 | 0 | 0 | 25 |
| lunge | 24 | 0 | 0 | 24 |
| mobility_floor | 22 | 0 | 0 | 22 |
| overhead_press | 21 | 0 | 0 | 21 |
| chest_fly | 20 | 0 | 0 | 20 |
| core_standing, sled_throw | 19 + 19 | 0 | 0 | 38 |
| kb_ballistic | 17 | 0 | 0 | 17 |
| cardio | 16 | 0 | 0 | 16 |
| leg_isolation | 14 | 0 | 0 | 14 |
| row, calf_raise | 13 + 13 | 0 | 0 | 26 |
| pull_up | 13 | 12 | 12 | 1 (pomin: Rope Climb) |
| forearm | 12 | 0 | 0 | 12 |
| hip_bridge, foam_roll | 11 + 11 | 0 | 0 | 22 |
| cable_row, strongman | 10 + 10 | 0 | 0 | 20 |
| leg_machine, shrug, rotator_cuff, hip_abd_add, neck | 5 × 8 | 0 | 0 | 40 |
| pulldown, carry, glute_floor | 3 × 7 | 0 | 0 | 21 |
| dip, chest_press_machine | 5 + 5 | 0 | 0 | 10 |
| back_extension, core_hang, cable_press | 3 × 4 | 0 | 0 | 12 |
| thruster | 3 | 0 | 0 | 3 |
| kneeling_hinge | 2 | 0 | 0 | 2 |
| **Razem** | **709** | **37 (5,2%)** | **174 (24,5%)** | **535** |

\* Rodziny „gotowe” (87 ćwiczeń) mają figury sprzed bramki 3 i nie mają reguł sensu — to luka wsteczna (propozycja: osobna runda reguł, potem ponowna walidacja gotowych póz). **Zamknięta w rundzie 2.**
Imienne listy ćwiczeń rodzin bez reguł: `docs/51-figury-v2-pokrycie.md`, sekcja „Ćwiczenia według rodzin” (cała rodzina).
mobility_stand i mobility_floor (58): wskazówki `st.*`/`dyn.*` dotyczą napięcia, oddechu i tempa, nie geometrii, więc każde rozciąganie wymaga osobnych źródeł. Do tego czasu traktuję je jako OTWARTE.

## Źródła przeczytane 26.10.2026 (runda 1)

| # | Źródło | Szczebel | Miejsce | Do czego |
|---|---|---|---|---|
| Z1 | ACE, Supermans (#9) https://www.acefitness.org/resources/everyone/exercise-library/9/supermans/ | 4 | kroki 1–3 („Maintain your head and torso position, avoiding any arching in your back or raising of your head.”) | Superman |
| Z2 | PMC6165989 (graded superman exercises) https://pmc.ncbi.nlm.nih.gov/articles/PMC6165989/ | 3 | Materials and Methods → Graded superman exercises (GSE 3: ręce i nogi unoszone razem) | Superman |
| Z3 | PMC8136566 https://pmc.ncbi.nlm.nih.gov/articles/PMC8136566/ | 3 | Methods → Protocol (superman-UL: łokcie wyprostowane, nogi wyprostowane w kolanach) | Superman |
| Z4 | ACE, V-ups (#242) https://www.acefitness.org/resources/everyone/exercise-library/242/v-ups/ | 4 | kroki 3–7 (tułów 45°, obie stopy uniesione, kolana wyprostowane); Cautions | V-Up |
| Z5 | Catalyst Athletics, V-Up (#313) https://www.catalystathletics.com/exercise/313/V-Up/ | 4 | opis („Simultaneously perform a sit-up and lift your straight legs”) | V-Up |
| Z6 | Catalyst Athletics, Jack Knife (#318) https://www.catalystathletics.com/exercise/318/Jack-Knife/ | 4 | opis (jednoczesny skłon tułowia i uniesienie ugiętych kolan do łokci) | Cocoons |
| Z7 | ACE, Reverse Crunch (#76) https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/ | 4 | faza w górę i wskazówki końcowe (kolana w stronę głowy, gdy biodra się unoszą) | kolana_ku_barkom |
| Z8 | ACE, Standing Crunch (#331) https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | 4 | ruch („rolling the rib cage down against the pull of the cable”) | cc.ribs |
| Z9 | NASM, Floor Prone Cobra https://www.nasm.org/resource-center/exercise-library/floor-prone-cobra | 4 | Steps („Keep your hips and legs relaxed on the floor…”); Common Mistakes | cobra.hips, cobra.mis |
| Z10 | Hwang, Park 2017, J Exerc Rehabil 13(3):335–339 https://pmc.ncbi.nlm.nih.gov/articles/PMC5498091/ | 3 | Materials and Methods → Tasks and procedures („draw in their abdomen without moving the spine, ribs, or pelvis”) | Stomach Vacuum (analogia) |
| Z11 | Madokoro, Miaki, Yamazaki 2014, J Phys Ther Sci 26(6):889–893 https://pmc.ncbi.nlm.nih.gov/articles/PMC4085215/ | 3 | Subjects and Methods (wciągnięcie pępka na wydechu i utrzymanie pozycji) | Stomach Vacuum (analogia) |
| Z12 | doctoryessis.com, Seated Knee-Ups https://doctoryessis.com/?p=2740 | 4/5 | opis (tułów odchylony o 45–60°, kolana do klatki; „If the hips move up, you will be using the hip flexors…”) | Seated Flat Bench Leg Pull-In — jedno źródło |
| Z13 | ACE Lateral Raise (#26), Seated Biceps Curl (#44), Push-Up (#41), Triceps Pushdowns (#185) — adresy w `cues.json` | 4 | #26 krok 3; #44 krok 2; #41 kroki 3–4; #185 kroki 2–3 | delt_raise, curl, pushup_plank, triceps |

Pozostałe źródła reguł rodzinnych (ExRx, NASM, ACE #32, #34, #36, #54, #70, #74, #84, #258, #303, #309, #394, ISSA) mają miejsca podane w `cues.json` albo w słowniku badacza (`wskazowki-slownik*.json`, `wskazowki-cwiczenia-08-korekty.json`). Dziś ich nie czytałem ponownie.
Odrzucone: opisy Butt-Ups, Dragon Flag, Side Jackknife i dynamicznego V-Up w serwisach komercyjnych i aplikacjach (szczebel 5); strona aplikacji fizjoterapeutycznej z „V-up” opisuje inną odmianę (naprzemienną) i nie ma autora.

## Otwarte pytania (runda 1)

1. **[OTWARTE]** Dragon Flag, Butt-Ups, Side Jackknife: potrzebne źródło szczebla ≤ 4 (np. podręcznik NSCA/ACSM z opisem albo badanie EMG z opisem wykonania). Do tego czasu bez grafiki v2.
2. **[OTWARTE]** Seated Flat Bench Leg Pull-In: drugie źródło. Do tego potrzebna korekta zestawu wskazówek (`rcrunch.hips` przeczy siadowi na ławce) — zadanie dla badacza wskazówek.
3. **[OTWARTE — produktowe]** Stomach Vacuum: (A) statyczna figura bez animacji, z opisem „wciągnij brzuch” — tania, ale grafika nie pokazuje istoty ćwiczenia; (B) brak grafiki v2 (wyjątek w teście pokrycia) — uczciwsze. Rekomendacja: B.
4. **[OTWARTE]** V-Up, start z leżenia: jedno źródło bezpośrednie (Catalyst). ACE #242 opisuje odmianę z siadu (V-sit). Jeśli drugie źródło się nie znajdzie, regułę `vup_start_lezenie` zostawić jako „jedno źródło” albo uznać V-Up z siadu za wariant — do decyzji koordynatora.
5. **[OTWARTE]** GHD Sit Up, Press Sit-Up, Smith Machine Hip Raise, Stability Ball Knee Tuck: nie badane w tej rundzie.
6. Wszystkie progi liczbowe (cm, °) to uproszczenia rysunku. Aplikacja nie podaje ich jako faktu (docs/53). Pierwsze pozy każdej rodziny mogą wymagać korekty progu — zmiana tylko w JSON, z dopiskiem w `liczba`.

---

# Runda 2 (26.10.2026) — squat, bench_press, hinge, lunge, overhead_press, chest_fly, row, cable_row, pulldown, plyo, olympic

Plik danych: `reguly-sensu-r2.json` (pełny zamiennik `figury-sens.json`; runda 1 przepisana bez zmian, poza jednym wyjątkiem opisanym niżej).
Dane wejściowe: ten sam worktree `scratchpad/wt-polecenia` (68291fa). Nie mogłem uruchomić `git show origin/gemini-polecenia:…` (brak powłoki w tej sesji), więc jeśli gałąź zdalna ma nowszy `cues.json`, koordynator powinien porównać zestawy wskazówek.

## Jak zbudowana jest runda 2

- **Każde ćwiczenie 11 rodzin ma jawny wpis w `warianty`** (nazwany zestaw, np. `"Back Squat": "_przysiad"`, albo lista). Wynik nie zależy więc od mapowania wskazówek ani od propozycji `zawsze`/`err` z rundy 1 — działa na obecnym `regulyDla`. `wskazowki_na_reguly` zostaje jako dokumentacja (wskazówka → reguła) i dla nowych ćwiczeń.
- **34 nowe typy reguł** w `_typy_nowe_r2` (warunek liczbowy na próbkach, pola szkieletu jak w `skeleton.ts`: `legs[s].heel/toe/hip`, `arms[s].shoulder`, `sk.front`, `jointAngles().shAbd/ankle`, `kf.zgiecieKregoslupa`). „Strony pracujące” = `stronyRak()`, G = średnia chwytów stron pracujących.
- Nowy klucz `otwarte_czesciowo` jest tylko dokumentacją: ćwiczenie ma reguły, ale część sensu jest otwarta.
- Główne źródło nowe w tej rundzie: **NSCA Basics of Strength and Conditioning Manual** (szczebel 4, wyciąg `scratchpad/zrodla/nsca-basics.txt`, przeczytany dziś na nowo, strony niżej). Drugie, niezależne: ACE (strony czytane dziś) i źródła z `cues.json`.
- Korekta rundy 1: wpis `Crucifix` usunięty z `delt_raise.warianty` — w docs/51 ćwiczenie należy do `chest_fly` (wpis był martwy, nie zmieniał pokrycia).

## squat (25/25) — gotowa rodzina

| Reguła | Warunek | Wskazówka / błąd, który ją łamie | Liczba | Pewność |
|---|---|---|---|---|
| plecy_neutralne | zgięcie kręgosłupa −20°…10° w ruchu | sq.back, hinge.back / mis.roundBack | uproszczenie | ustalone (NSCA s. 49–50, ACE #135 kroki 3–5) |
| kolana_nad_stopami | przy kolanie ≥ 30° kolano nie odchodzi do środka od osi stopy o > 5° | sq.kneesToes / sq.mis.kneesIn | uproszczenie | ustalone (ACE #135 kroki 4 i 6, NSCA s. 50, SBS) |
| piety_na_podlodze | wysokość pięty zmienia się ≤ 2 cm | sq.down, sq.depth / sq.mis.heels | uproszczenie | ustalone (NSCA s. 49, ACE #135 kroki 4 i 6) |
| zejscie_biodra_i_kolana | na dole kolano ≥ 80°, biodro ≥ 60°; na górze kolano ≤ 15° | sq.down, gob.move | uproszczenie | ustalone (kierunek) |
| udo_rownolegle | w najniższym punkcie udo ≤ 15° nad poziomem | sq.depth | uproszczenie („prawie równolegle”) | ustalone (NSCA s. 49, ACE #135 krok 4) dla sztangi na plecach i bez obciążenia; analogia dla innych odmian |
| lokcie_wysoko (Front Squat) | łokieć ≤ 12 cm poniżej barków | fsq.elbows | uproszczenie | ustalone (NSCA s. 50, NASM, ExRx) |
| ciezar_przy_klatce (Goblet) | chwyt ≤ 25 cm od osi tułowia | gob.close | uproszczenie | ustalone wg cues.json |
| tulow_przy_scianie (Wall Sit) | tułów −5°…10° od pionu | wall.back | uproszczenie | ustalone wg cues.json |

Box Squat (×4): bez reguły głębokości — **[OTWARTE]** wysokość skrzyni (dziś 45 cm w `variants.ts`) nie ma źródła. Wall Sit: bez reguły głębokości (wall.depth: zależy od celu).
Nie wprowadzam reguły kąta tułowia: NSCA s. 49 podaje 35–45° od pionu dla przysiadu ze sztangą na plecach, ale to jedno źródło, a przysiad przedni i z hantlem przy klatce mają inny tułów.

## hinge (32/32) — gotowa rodzina

| Reguła | Warunek | Wskazówka / błąd | Liczba | Pewność |
|---|---|---|---|---|
| plecy_neutralne | kręgosłup −20°…10° | hinge.back / mis.roundBack | uproszczenie | ustalone (NSCA s. 51–52, ACE #317) |
| ciezar_przy_nogach | środek chwytu ≤ 15 cm od osi nóg (płaszczyzna strzałkowa), dopóki jest poniżej barków | dl.close, rdl.move / mis.barAway | uproszczenie | ustalone (NSCA s. 51–52, ACE #317, NASM, ExRx, SBS) |
| wyprost_na_gorze | jest próbka: kolana, biodra, tułów ≤ 15° | dl.lift, tb.lift, sumo.lift, rdl.move, gm.move | uproszczenie | ustalone (NSCA s. 51) |
| start_z_podlogi | chwyt ≥ 10 cm poniżej kolan w najniższym punkcie | dl.feet | uproszczenie | definicja + NSCA s. 51 |
| kolana_lekko_ugiete (RDL, dzień dobry) | kolano ≤ 35° | rdl.knees (też błąd w RDL) | uproszczenie | ustalone (NSCA s. 52, ACE #317, NASM) |
| zawias_w_biodrach | pochylenie tułowia zmienia się o ≥ 40° | rdl.move, gm.move | konwencja | ustalone (kierunek) |
| dzien_dobry_glebokosc | tułów ≤ 95° od pionu | gm.depth | uproszczenie | ustalone wg cues.json |
| kolana_sumo | jak kolana w przysiadzie | sumo.kneesOut | uproszczenie | ustalone wg cues.json |

Zestawy: `_ciag` (14), `_sumo` (5), `_rack` (2, bez „z podłogi”), `_rdl` (7), `_dzien_dobry` (3), Cable Pull Through osobno (linka z tyłu — bez reguły toru).

## bench_press (30/30) — gotowa rodzina

| Reguła | Warunek | Wskazówka / błąd | Liczba | Pewność |
|---|---|---|---|---|
| pelny_zakres | łokieć w ruchu ≥ 70° i ≤ 20° | bp.move, ibp.move, dbp.move | uproszczenie | ustalone (NSCA s. 53–54, ACE #5) |
| lawka_kontakt | miednica zmienia wysokość ≤ 2 cm, kręgosłup ≥ −15° | bp.contact / **bp.mis.arch** | uproszczenie | ustalone (NSCA s. 53–55, ACE #5, SBS) |
| dol_przy_klatce | na dole chwyt ≤ 20 cm nad osią tułowia | bp.move | uproszczenie | ustalone (NSCA, ACE #5, SBS Descent) |
| przedramie_pod_sztanga | chwyt ≤ 10 cm przed/za łokciem w poziomie przez cały ruch | — (nowa, ze źródeł) | uproszczenie | ustalone (NSCA s. 53–55, SBS Biomechanics) |
| lokcie_nie_szeroko | odwiedzenie ramienia na dole ≤ 75° | bp.elbowsMid | konwencja | ustalone (kierunek) |
| lokcie_przy_tulowiu (wąski chwyt) | odwiedzenie ≤ 45° | cgbp.elbows | uproszczenie | ustalone (kierunek) wg cues.json |

Zestawy: `_lawka` (17), `_waski` (4), `_podloga` (4: zakres ≥ 60°, bez reguły klatki), `_czesciowy` (Board, Pin — tylko wyprost u góry), Guillotine (bez przedramienia i łokci), `_hybryda` (JM Press, Decline Close-Grip To Skull Crusher — analogia).

## lunge (24/24)

| Reguła | Warunek | Wskazówka / błąd | Liczba | Pewność |
|---|---|---|---|---|
| plecy_proste | kręgosłup −20°…10° | lunge.torso, sq.back | uproszczenie | ustalone — część wspólna (NSCA: tułów 35–45° w przód; ACE/NASM/ExRx: wyprostowany) |
| kolano_nad_stopa | noga bardziej zgięta: kolano nie odchodzi do środka o > 5° | lunge.knee, stepup.knee, pistol.knee / **lunge.mis.kneeIn**, sq.mis.kneesIn | uproszczenie | ustalone |
| glebokosc_wykroku | niższe kolano ≤ 20 cm nad podłogą w najniższym punkcie | lunge.fwd/back/walk, bss.move | uproszczenie | ustalone (kierunek); ACE #363 dopuszcza „wygodny zakres” — rysunek pokazuje pełny |
| wejscie (Step Up) | miednica w górę ≥ 15 cm; noga na podwyższeniu ≤ 15° na górze | stepup.move | uproszczenie | ustalone wg cues.json |
| wolna_noga_w_przod (pistolet) | kostka wolnej nogi ≥ 5 cm nad podłogą, na dole ≥ 10 cm przed miednicą | pistol.setup | uproszczenie | ustalone wg cues.json (Smith: analogia) |

## overhead_press (19/21)

| Reguła | Warunek | Wskazówka / błąd | Pewność |
|---|---|---|---|
| ciezar_nad_glowe | chwyt ≥ 10 cm nad środkiem głowy | ohp.move | ustalone (NSCA s. 42, ACE #71) |
| wyprost_lokci | łokieć ≤ 20° na górze | ohp.fullExt, press.noLock | ustalone |
| start_przy_barkach | chwyt ≤ 20 cm nad barkami w najniższym punkcie | ohp.move | ustalone |
| lokcie_pod_dlonmi | łokieć ≤ 10 cm od pionu pod chwytem (x, z) | ohp.elbowsUnder | ustalone (NSCA s. 42–43, ExRx, ACE #186) |
| ciezar_nad_barkami | na górze chwyt ≤ 10 cm przed/za barkami | ohp.tall | ustalone |
| tulow_wysoko | tułów −15°…10° (push press: −15°…20°) | ohp.tall, ohp.seat / pp.dip | ustalone; push press: jedno źródło + analogia |
| krotkie_ugiecie (Push Press) | kolano 15°–60° | pp.dip | ustalone |
| landmine / jammer | wyprost łokcia (+ nogi ≥ 15° w jammerach) | press.noLock, pp.legs | analogia |
| Pike Push Up | zakres łokcia jak pompka | push.mis.partial | analogia |

`ohp.mis.lock` („gwałtowne” blokowanie) — bez animacji: to cecha prędkości. OTWARTE: Bradford Press, Handstand Push Up.

## chest_fly (17/20)

- `lokiec_staly` (fly.elbows): łokieć ≤ 40°, zmiana ≤ 12° — ustalone (ACE #21, ExRx DBFly, ACE #160).
- `luk_dloni` (dfly.move, cfly.move): odległość dłoni zmienia się ≥ 40 cm — ustalone.
- `dol_na_wysokosci_barkow` (leżąc): dłoń najwyżej 10 cm poniżej barków — **jedno źródło** (ACE #21 krok 3).
- Pullover (po.arms): łokieć ≤ 25°, kąt ramię–tułów zmienia się ≥ 45° (ten drugi: jedno źródło, ACE #37).
- Crucifix: trzymanie — łokieć stały, łokcie na wysokości barków (analogia z delt_raise). Pec Deck: tylko łuk dłoni.
- OTWARTE: Around The Worlds, Machine Pullover, Svend Press.

## row (13/13), cable_row (9/10), pulldown (7/7)

- **row** `_opad`: tułów 40°–105° (row.hinge; NSCA s. 46, ACE #12), tułów stabilny ≤ 10° / ≤ 5 cm (jedno źródło + analogia), kręgosłup (hinge.back / **mis.roundBack**), łokieć ≥ 70° i ≤ 20° (row.fullStretch, row.*Pull), łokieć ≥ 5 cm za linią barku (row.elbowsPast; dla wiosłowania w opadzie — analogia), kolana ≤ 40°. `_podpora` (klatka na podporze): stabilny tułów, zakres, łokieć za plecami.
- **cable_row** `_wioslo`: zakres łokcia (scr.pull), łokieć za plecami (fp.elbowsBack; dla wiosłowania analogia), kręgosłup (scr.sit/scr.chest), tułów stabilny (scr.control, fp.chest). Face pull i Rear-Delt Rows bez reguły kręgosłupa. OTWARTE: Sled Row.
- **pulldown** `_sciaganie`: wyprost u góry (lpd.fullStretch), chwyt na dole od −10 do +15 cm względem barków (lpd.toChest; ACE #158, NSCA s. 46), łokcie ≥ 10 cm poniżej barków (pu.elbowsDown), tułów −30°…5°, zmiana ≤ 10° (lpd.mis.lean; granica 30° — jedno źródło, ACE #158). Straight Arm Pulldown: ręce proste, kąt ramię–tułów ≥ 45°.

## plyo (27/28)

- `faza_lotu` (definicja): jest próbka, w której obie stopy są ≥ 3 cm nad podporą (podłoga albo skrzynia z `sprzet`).
- `miekkie_ladowanie` (jump.land, bj.land / **jump.mis.stiff**, **bj.mis.stiff**): po ostatniej próbce w locie kolano ≥ 30° i biodro ≥ 20° — ustalone (NSCA s. 77–79, ACE #177 kroki 5–6, NASM).
- `wyprost_przy_wybiciu` (jump.drive): kolano i biodro ≤ 15°, kostka ≤ −5° — ustalone (NSCA s. 78, ACE #177 krok 3, NASM).
- `zamach_rak` (jump.drive): co najmniej jedna dłoń na wysokości barków — ustalone.
- Tuck Jump: w locie biodro i kolano ≥ 90° — jedno źródło (NSCA s. 78).
- **Wymóg kontraktu [OTWARTE — koordynator]:** reguła lądowania działa tylko wtedy, gdy poza skoku w u 0…1 zawiera lot i lądowanie (u = 1 = pozycja po amortyzacji). Jeśli animacja ma kończyć się na wybiciu, „ląduj miękko” nie da się pokazać ani sprawdzić.
- Weighted Jump Squat, Dumbbell Seated Box Jump: bez `zamach_rak` — zestaw ma `jump.drive` z „zamachem rąk”, choć ręce trzymają ciężar → korekta zestawu wskazówek. OTWARTE: Kneeling Jump Squat.

## olympic (23/25)

- `plecy_neutralne` + `sztanga_blisko` w jednej grupie „plecy_tor”, bo błąd **oly.mis** łączy oba („sztanga odjeżdża albo plecy się zaokrąglają”) — ustalone (NSCA s. 36–40, ACE #125 kroki 2–3).
- `rece_proste_do_wyprostu` (oly.legs): łokieć ≤ 25° od najniższego punktu do wyprostu bioder — **jedno źródło** (NSCA Basics i NSCA TSAC Report to jedna organizacja; ACE #125 nie opisuje pracy rąk).
- `wyprost_bioder_kolan`: kolana i biodra ≤ 15° — ustalone (bez warunku kostki: wspięcie na palce tylko NSCA).
- `start_z_podlogi` (odmiany z podłogi), `odbior_na_barkach` (zarzuty, u = 1) — ustalone (NSCA s. 36–38, ACE #125).
- `odbior_nad_glowa` (rwania, podrzuty, u = 1): chwyt ≥ 10 cm nad głową, łokcie ≤ 20° — **jedno źródło + analogia** (Catalyst #79 dla rwania; NSCA s. 43 push jerk dla podrzutu).
- Jerk Dip Squat: krótkie ugięcie 15°–60°, sztanga cały czas przy barkach. Snatch Balance: odbiór nad głową, kręgosłup, kolana (analogia).
- OTWARTE: Rack Delivery, Jerk Balance (zestaw „open”; NSCA Basics opisuje tylko inne ćwiczenia).

## Oczekiwane naruszenia w gotowych figurach (do sprawdzenia przez programistę)

Szacunek z modeli w `rigs/squat.ts`, `rigs/benchPress.ts` i `variants.ts`. Liczby rigów to uproszczenia, więc naruszenie znaczy „rysunek odbiega od opisu w źródłach”, a nie „błąd danych”.
1. **Barbell Hack Squat** (głębokość 110°): podudzie pochylone o 36°, więc udo jest ok. 16° nad poziomem, a limit `udo_rownolegle` to 15°. Przy 115° (większość przysiadów) wychodzi ok. 11°, czyli w limicie. Kroki: generator → squat → Barbell Hack Squat → walidacja sensu. Ocena: realny dla potoku grafik.
2. **Wyciskanie sztangą na płasko** (punkt dotyku 33 cm, łokcie prawie przy tułowiu): z IK wychodzi łokieć ok. 10 cm bliżej głowy niż gryf na dole. To granica reguły `przedramie_pod_sztanga`. Brzegowy.
3. **Wąski chwyt** (×4, biegun łokcia z = 1,1): odwiedzenie ramienia może przekroczyć 45° (`lokcie_przy_tulowiu`). Brzegowy.
4. **Floor Press** (×4): zakres łokcia ≥ 60° nie jest potwierdzony na rigu.
Jeśli figura nie przechodzi, zmienia się parametr rigu w `variants.ts` (uproszczenie). Progu w JSON nie poluzowuję bez źródła.

## Pokrycie regułami sensu — przed i po rundzie 2

| Rodzina | Ćwiczeń | Przed (po r1) | Po r2 | Bez reguł po r2 |
|---|---|---|---|---|
| hinge* | 32 | 0 | 32 | 0 |
| bench_press* | 30 | 0 | 30 | 0 |
| squat* | 25 | 0 | 25 | 0 |
| plyo | 28 | 0 | 27 | 1 (OTWARTE) |
| olympic | 25 | 0 | 23 | 2 (OTWARTE) |
| lunge | 24 | 0 | 24 | 0 |
| overhead_press | 21 | 0 | 19 | 2 (OTWARTE) |
| chest_fly | 20 | 0 | 17 | 3 (OTWARTE) |
| row | 13 | 0 | 13 | 0 |
| cable_row | 10 | 0 | 9 | 1 (OTWARTE) |
| pulldown | 7 | 0 | 7 | 0 |
| core_floor, delt_raise, curl, triceps, pushup_plank, pull_up | 193 | 174 | 174 | 19 (bez zmian) |
| pozostałe 26 rodzin (mobility, cardio, kb_ballistic, …) | 281 | 0 | 0 | 281 |
| **Razem** | **709** | **174 (24,5%)** | **400 (56,4%)** | **309** |

\* gotowe rodziny: 87/87 ćwiczeń ma reguły, więc bramka 3 obejmuje teraz także figury, które już są w aplikacji. Wymaga to typów z `_typy_nowe_r2` w `v2-sens.mjs` i ponownej walidacji póz z `exampleFor`.
Następna runda wg liczebności: mobility_stand + mobility_floor (58, potrzebne osobne źródła geometrii rozciągań), core_standing (19), sled_throw (19), kb_ballistic (17), cardio (16).

## Źródła przeczytane 26.10.2026 (runda 2)

| # | Źródło | Szczebel | Miejsce | Do czego |
|---|---|---|---|---|
| Z14 | Sands, Wurth, Hewit, *NSCA — Basics of Strength and Conditioning Manual*, NSCA 2012 (https://www.nsca.com/uploadedFiles/NSCA/Resources/PDF/Publications/basics_of_strength_and_conditioning_manual.pdf; czytany wyciąg `scratchpad/zrodla/nsca-basics.txt`, PDF zwraca 403) | 4 | s. 36–40 (zarzut, high pull), s. 41–43 (unoszenia, wyciskanie zza karku, push press, push jerk), s. 44–46 (podciąganie, wiosłowania, ściąganie), s. 48–50 (przysiad, przysiad przedni: „Proper depth is achieved when mid-thigh is parallel to the floor”), s. 51–52 (martwy ciąg, RDL), s. 52–53 (wykroki), s. 53–55 (wyciskanie), s. 77–79 (skoki: „The landing should be soft and quiet”) | wszystkie rodziny rundy 2 |
| Z15 | ACE, Bodyweight Squat (#135) https://www.acefitness.org/resources/everyone/exercise-library/135/bodyweight-squat/ | 4 | kroki 3–6 („Continue to lower yourself until your thighs are parallel or almost parallel with the floor.”) | squat |
| Z16 | ACE, Romanian Deadlift (#317) https://www.acefitness.org/resources/everyone/exercise-library/317/romanian-deadlift/ | 4 | opis („keeping the bar very close to the body while standing”) | hinge |
| Z17 | ACE, Forward Lunge (#363) https://www.acefitness.org/resources/everyone/exercise-library/363/forward-lunge/ | 4 | opis („Descend to a comfortable range of motion”) | lunge |
| Z18 | ACE, Shoulder Press (#71) https://www.acefitness.org/resources/everyone/exercise-library/71/shoulder-press/ | 4 | opis („press the barbell directly overhead”) | overhead_press |
| Z19 | ACE, Chest Fly (#21) https://www.acefitness.org/resources/everyone/exercise-library/21/chest-fly/ | 4 | kroki 2–4 (łuk do poziomu barków lub klatki, lekko ugięte łokcie) | chest_fly |
| Z20 | ACE, Bent-Over Row (#12) https://www.acefitness.org/resources/everyone/exercise-library/12/bent-over-row/ | 4 | opis („Lower the bar towards the floor until the elbows are completely straight”) | row |
| Z21 | ACE, Seated Lat Pulldown (#158) https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/ | 4 | kroki 2–4 („Lean back slightly (no more than a 30 degree angle)”) | pulldown |
| Z22 | ACE, Forward Linear Jumps (#177) https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/ | 4 | kroki 3, 5–6 (potrójny wyprost z zamachem rąk; lądowanie na ugiętych kolanach i biodrach) | plyo |
| Z23 | ACE, Power Clean (#125) https://www.acefitness.org/resources/everyone/exercise-library/125/power-clean/ | 4 | kroki 2–6 (proste plecy; sztanga blisko ciała; odbiór na przedniej części barków) | olympic |
| Z24 | ACE, Bench Press (#5) https://www.acefitness.org/resources/everyone/exercise-library/5/bench-press/ | 4 | opis („Stop when the elbows are just below the bench.”) | bench_press |
| Z25 | Stronger by Science, How to Bench https://www.strongerbyscience.com/how-to-bench/ | 4 | How to Bench: Basics → Descent, Foot position; Biomechanics → Elbow Extension („the weight needs to stay more-or-less right over your elbow the whole time”) | bench_press |
| Z26 | Catalyst Athletics, Overhead Squat (#79) https://catalystathletics.com/exercise/79/Overhead-Squat | 4 | opis (podstawowa pozycja odbioru rwania; łokcie całkowicie wyprostowane) | olympic (rwanie) |

Pozostałe źródła reguł (ExRx, NASM, SBS, ACE #6, #11, #24, #28, #37, #48, #160, #168, #186, #308, #311, #319, #334, #336, #362, #366, Eleiko, PMC wall sit) mają miejsca podane w `cues.json` albo w słowniku badacza. Dziś ich nie czytałem ponownie (w JSON: „wg cues.json”).
Odrzucone lub nieczytelne: Catalyst Athletics #1 Snatch i #2 Clean (strony bez opisu ćwiczenia), ExRx PowerSnatch (403, archiwum niedostępne dla narzędzia), Wikipedia i streszczenia wyszukiwarki (nie są źródłem).

## Otwarte pytania (runda 2)

1. **[OTWARTE — koordynator]** Plyo: czy poza skoku obejmuje lot i lądowanie (u = 1 po amortyzacji)? Bez tego nie da się sprawdzić reguły „ląduj miękko” ani pokazać błędu `jump.mis.stiff`. Opcje: (A) kontrakt plyo wymaga fazy lądowania — rysunek pokazuje wskazówkę, ale pozy są dłuższe; (B) poza kończy się na wybiciu, a lądowanie trafia do `bledy_bez_animacji` — prościej, ale tracimy najważniejszą wskazówkę bezpieczeństwa. Rekomendacja: A.
2. **[OTWARTE]** Box Squat: wysokość skrzyni (45 cm) bez źródła, więc bez reguły głębokości.
3. **[OTWARTE]** Rwanie i podrzut, odbiór nad głową: jedno źródło + analogia. Potrzebne drugie źródło (np. podręcznik szkoleniowy związku podnoszenia ciężarów).
4. **[OTWARTE]** `oly.legs` (ręce proste do wyprostu bioder): tylko NSCA (dwa zespoły, jedna organizacja). Potrzebna druga organizacja.
5. **[OTWARTE]** Wiosłowanie — „tułów stabilny”: jedno źródło (NSCA s. 46) + analogia.
6. **[OTWARTE]** Rozpiętki leżąc — „dół na wysokości barków”: jedno źródło (ACE #21).
7. **[OTWARTE — badacz wskazówek]** Weighted Jump Squat i Dumbbell Seated Box Jump mają w zestawie wskazówkę z zamachem rąk, choć ręce trzymają ciężar. Zestaw do korekty.
8. **[OTWARTE]** Clean and Jerk: odbiór na barkach w środku ruchu wymaga typu reguły „w próbce pośredniej”. Dziś sprawdzam tylko początek (z podłogi) i koniec (nad głową).
9. **[OTWARTE]** Ćwiczenia bez reguł w rodzinach rundy 2 (9): Bradford Press, Handstand Push Up, Around The Worlds, Machine Pullover, Svend Press, Sled Row, Kneeling Jump Squat, Rack Delivery, Jerk Balance — zestawy „open”, nie badane.
10. Progi to uproszczenia rysunku, aplikacja nie pokazuje ich jako faktu. Naruszenia w gotowych figurach (sekcja wyżej) naprawia się parametrem rigu, nie luzowaniem progu bez źródła.
