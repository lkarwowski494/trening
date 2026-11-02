# STAN — fala W2, grupa G4 (nogi i biodra)

Data: 02.11.2026. Koordynator grupy G4 fali W2 (agent). Gałąź `badania/w2-nogi` od `integracja-1-1` (2dc54e2). Tylko dane — bez zmian w kodzie, `lib/**`, `data/zrodla/*.json`, testach. Integruje koordynator linii 1.1. Status wszystkich plików: **PROPOZYCJA**; każda karta przed wydaniem wymaga niezależnej recenzji treści (bramka 4, L-047).

Podstawa: stan W1 po przeliczeniu szczebli (`origin/badania/g4-nogi` 2a32209, `przeliczenie-szczebli-2026-11-02.md` — 10 kart: 8 z błędami, 2 bez). Szczeble: `szczeble-organizacji-2026-11-02.md` (gałąź `badania/lokalne-0211`) + rozstrzygnięcia W1 z briefu (Speediance nie źródło, Fitness Volt z datą tylko w metadanych = 5, Major Fitness /blogs/wiki/ = 5).

## Wynik na rodzinę

„Karty z błędami” = łącznie z kartami z W1 (blok W2 je powtarza, jeśli dopisano błędy). „Warunkowe” = zależą od decyzji koordynatora o szczeblu jednego źródła (lista niżej).

| Rodzina | Ćwiczeń w zakresie | Karty z błędami (w tym z W1 / warunkowe) | Karty bez błędów | Błędy wnioskowane (wpisy) | Role gotowe | Otwarte | Nowe zdania | Pliki |
|---|---|---|---|---|---|---|---|---|
| calf_raise | 10 | 8 (1 / 3) | 0 | 1 | — (brak luk) | 2 | 4 | `calf_raise.md` |
| glute_floor | 7 | 5 (2 / 0) | 0 | 2 | 1 (Clamshell `glutes.hip_ext_rot`) | 2 | 6 | `glute_floor.md`, role |
| hip_abd_add | 8 | 3 (1 / 2 — jedyny błąd `hadd.mis.short`, granica „ogólnego”) | 0 | 3 | 0 (propozycja `glutes.hip_abd`, uproszczenie, 4 ćw.) | 5 | 4 | `hip_abd_add.md`, role |
| hip_bridge | 8 | 5 (1 / 0) | 0 | 0 | 0 | 3 | 3 | `hip_bridge.md`, role |
| kneeling_hinge | 2 | 0 | 0 | 0 | — | 2 | 0 | `kneeling_hinge.md` |
| leg_isolation | 10 | 5 (1 / 2) | 0 | 4 | 0 | 5 | 7 | `leg_isolation.md`, role |
| leg_machine | 6 | 1 (0 / 1) + Single Leg Press poza blokiem (warunkowo) | 0 | 0 | 0 | 4 | 3 | `leg_machine.md`, role |
| squat (`ready`) | 20 | 8 (1 / 2) | — (nie proponowane) | 4 | 0 | 12 | 9 (+1 tylko propozycja) | `squat-cz1.md`, `squat-cz2.md`, role |
| hinge (`ready`) | 25 | 9 (3 / 0) | — (nie proponowane) | 9 | 0 | 16 | 8 | `hinge-cz1.md`, `hinge-cz2.md`, role |
| **Razem** | **96** | **44** (10 z W1, w tym Clamshell i Lateral Band Walk bez→z błędami / **8 warunkowych**; +1 poza blokiem) | 0 | **23** | **1** (+1 propozycja uproszczenia) | **51** | **44** | |

Przyrost względem W1: 10 → 44 karty z błędami (bezwarunkowo 36). Liczby z raportów badaczy; bloki JSON sprawdzone skryptem (poprawny JSON, nazwy ćwiczeń w katalogu `cue-sets.json`, bez adresów e-mail i ścieżek lokalnych).

## Do decyzji koordynatora linii 1.1 (wpływ na liczby)
1. **NFPT „by Guest Author” z ramką autora** (R. Bovee, „Certified Master PPT, RTS, ETS, FTS”, 11.08.2025) — reguła „ramka podaje kwalifikacje” spełniona, ale ramka może być domyślna dla wpisów gościnnych (W1 widział ją też na innej stronie). Od tego zależą: Hack Squat, Single-Leg Leg Extension.
2. **Bells of Steel — rozbieżność ocen:** `leg_machine.md` ocenia wpisy blogowe (hack squat, belt squat) na 5 (bez autora, banery sprzedaży, bez nazwy własnej maszyny); `hinge-cz2.md` ocenia stronę Cable Deadlift na 4 (tekst firmowany, data, producent wyciągów); `hip_bridge.md` — 4 dla instrukcji własnej maszyny hip thrust; `leg_isolation.md` — GHR warunkowo. Trzeba jednej reguły per strona (uzup. 3: blog producenta = 5, instrukcja własnej maszyny = 4). Zależą: Cable Deadlift, Machine Hip Thrust, Glute Ham Raise, błąd Smith Machine Hip Thrust.
3. **EliteFTS** — `squat-cz2.md` ocenia jako producenta gum/łańcuchów opisującego ustawienie własnego sprzętu (4); `hinge-cz1.md` — strona D. Tate bez podanych kwalifikacji (niezaliczona). Zależą: Squat with Chains, Squat with Bands.
4. **Wersje siedzące łydek** — krawędź podestu wprost tylko ISSA (maszyna); badanie Kinoshita i in. (szczebel 3) potwierdza siad i zakres, położenie stóp to parafraza. Zależą: Seated Calf Raise (hantle), Barbell Seated Calf Raise, Dumbbell Seated One-Leg Calf Raise.
5. **`hadd.mis.short`** (skrócony zakres) jako jedyny błąd Band/Cable Hip Adduction — czy nie „ogólny”.
6. **Single Leg Press** — analogia prasa obunóż → jednonóż na tej samej maszynie (recenzja 28.10 odrzuciła analogię prasa → hack); blok poza blokiem do wdrożenia.
7. **Nowe oceny stron do potwierdzenia:** Generation Iron (autor z listy „Our Team”, nie „Our Experts” → 5; jeśli 4 — Pendulum Squat gotowe), Training & Conditioning (Box Squat; przedruk M. Galbraith, CSCS, bez autora strony), Westside Barbell (B. Hawk, 2025), strona J. Stoppaniego, Radiopaedia (rola Fire Hydrant), Performance Health/TheraBand strona bez autora (Hip Extension with Bands — uproszczenie), Set For Set (strona promuje własną aplikację — wg zasady „nie źródło”; poprawić ocenę w pliku W1 `hinge-cz1.md`), Barbell Logic `?p=5455` i „How To Set Up Chains” — bez autora i daty → 5 (rozstrzyga „warunkowo 4” z przeliczenia W1).
8. **Cable Deadlift `cabledl.setup`** — ustawienie wyciągu tylko Bells of Steel: przyjąć jako część uproszczenia wariantu sprzętu albo skrócone brzmienie z pliku („Uwagi do bloku”).
9. **Błędna rodzina (z W1, potwierdzone):** London Bridges (zejście po linie; `lib/figures/v2/families.ts:103`, dopasowanie po nazwie), Smith Machine Reverse Calf Raise (unoszenie palców); zestaw `hingeFloor` przy Barbell Hack Squat.

## Uwagi dla integracji
- Teksty części zdań użytych w blokach są w plikach W1, nie W2 (np. `clam.*`, `dk.move`, `fh.move`, `fh.level`, `ck.setup` — `glute_floor.md` W1; `bhs.setup`, `zer.hold`, `kbfs.*`, `cdl.*`, `calf.rise`, `calf.band` — W1). Przy integracji brać PL/EN z obu fal (W2 ma pierwszeństwo przy zmienionym brzmieniu: `hexb.setup`, `ht.slSetup`, `hack.setup2`, `ohs.setup`, `ohs.move`, `def.setup`, `ghr.move`, `bandcurl.setup`, `slcurl.*`).
- Nowe organizacje/źródła do `data/zrodla/cues.json`: ISSA (kilka artykułów = jedno źródło), Catalyst Athletics, HSS, NSCA (SCJ), BarBend (nowe strony), Bells of Steel (wg pkt 2), EliteFTS (wg pkt 3) — id w sekcjach „Źródła” plików.
- `lext.range` → w kartach `lext.move` (wyprost bez blokowania potwierdza tylko jedno źródło); `hab.mis.high` w zestawie ogólnym Clamshell/Fire Hydrant nie ma źródła albo przeczy źródłom; ACE 51 bez numerowanych kroków (miejsce „opis”).
- Nagłówek bloku w `hinge-cz1.md` ujednolicony do `### Blok do wdrożenia` przez koordynatora grupy (bez zmiany treści).
- Plik `calf_raise.md` ma 285 linii (ponad zalecane ~250) — niedzielony.

## Git i verify
- Verify bazy (`npm run verify` na `integracja-1-1` 2dc54e2, czysta kopia, 02.11.2026): **ZIELONE** (exit 0; 660 plików testów, 15941 testów; `tests/maestro-flows.test.tsx` przerwany SIGTERM workera i raz ponowiony przez `jest-ponow` — zielony); znacznik `pelne` 2dc54e2.
- `npm run verify:docs` w worktree: 1. przebieg — 1 porażka w przebiegu równoległym (te same 4 pliki osobno `--runInBand`: 104/104 zielone); 2. przebieg — zielony (104 testy), znacznik `dokumenty` fd9dfd53. Wypchnięcie bez `--no-verify`. Wymagało `git fetch --unshallow origin` i `git fetch origin main` (bez tego `origin/main` nie istnieje w klonie).
- Commity: 93e2b3a (glute_floor), 19a9214b (calf_raise), fd9dfd53 (hip_abd_add, hip_bridge, kneeling_hinge, leg_isolation, leg_machine), następny — squat, hinge i ten plik.

## Zostało (następny krok)
- Decyzje z listy wyżej, potem przeliczenie warunkowych.
- Drugie źródła szczebla 4 dla otwartych: Rack Pull, Cable Pull Through, Snatch Deadlift, One-Arm Side Deadlift, Belt Squat Machine, Pendulum Squat, Cable Hip Abduction, Monster Walk, Standing (Cable) Leg Curl, Reverse Band Box/Power Squat, Band Squat, Seated Good Mornings, Box Squat; nie badane ponownie w W2: Leverage/Chains/Rack Pull with Bands, sumo z gumami i łańcuchami, Rickshaw, Landmine/Cable/One-Arm OH KB/Dip Belt Squat, Reverse Nordic, Sissy Squat, Leg Curl (hantel), Hip Flexion with Band, Prone Flutter Kicks.
- Role: `upper_back` w martwych ciągach i `abs`/`obliques` aux w przysiadach — brak źródeł szczebla 2–3 określających rolę (abstrakty EMG pokazują aktywność, nie rolę); jeden badacz na całość.

## Pułapki
- Badacz ma tylko Write — nie widzi gałęzi innych sesji; materiały W1 trzeba wyciągnąć `git show` do katalogu roboczego poza repo.
- Strony 403/404: ExRx, NSCA PDF, muscleandstrength, OncoLink, MyMichigan, elitefts i T-Nation (część adresów), support.lifefitness.com; kopie instrukcji w serwisach z instrukcjami się nie liczą (nieutożsamione).
