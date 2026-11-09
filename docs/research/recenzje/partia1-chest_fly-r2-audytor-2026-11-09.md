# Recenzja niezależna rodziny figur v2 `chest_fly` — runda r2 (partia 1, linia 1.1), 09.11.2026

Recenzent: audytor (L-047; nie pisał tej rodziny ani poprawek r1). Autor: programista partii 1 (poprawki r1: commit `c537f8a4`, gałąź `figury/partia-1`, SHA `3044df5`).

## Werdykt rodziny: **wyswietlana**

- KRYTYCZNE 0, WYSOKIE 0, ŚREDNIE 1, NISKIE 1.
- Wszystkie trzy WYSOKIE z r1 (W1, W2, W3) zamknięte, S3 z r1 zamknięte. Werdykt każdego z 17 ćwiczeń z rysunkiem: „wyswietlana”.
- ŚREDNIE R2-S1 dotyczy **zestawu ogólnego** Crucifix, nie rysunku. Wpis `zestawy.Crucifix` w JSON ma werdykt „do poprawy” (bez `sha`). Rodziny to nie blokuje.
- S1, S2, N1 i N2 z r1 nadal występują i są w backlogu `P1-CHEST-1` (docs/21:226, 1.1.x). Nie zgłaszam ich ponownie.
- K10 nie dotyczy: rodzina nie ma wpisów `v1` w `figury-recenzja.json`.

## Metoda

- Czysta kopia: `git archive 3044df5` → `/home/user/rev-p1/chest_fly-r2` (z dowiązanym `node_modules`). W `/home/user/trening` nic nie zmieniałem.
- **Status `ready` tylko w kopii.** W kopii zmieniłem w `lib/figures/v2/families.ts:48` `status: 'planned'` na `'ready'` dla chest_fly. Bez tego `figureSpec` zwraca `null` (arkusze puste), a `--skroty` nie liczy `v2.chest_fly`. Z tą zmianą powstały arkusze, `node scripts/zrodla-runtime.mjs --skroty` (wynik: `/home/user/rev-p1/tools-r2/skroty.json`) i przebieg testu rodziny.
- **Arkusze śladu (K4):** `arkusz-slad.mjs` dla 17 ćwiczeń × 2 widoki (top, side), czyli 34 arkusze, motyw jasny: `/home/user/rev-p1/chest_fly-r2/arkusze/slad/`.
  - Motyw ciemny: Pec Deck, Band Chest Fly, Cable Fly, Wide-Grip Decline Barbell Pullover, Crucifix × 2 widoki, czyli 10 arkuszy: `arkusze/slad-dark/`.
- **Nakładka:** `arkusz-nakladka.mjs --family chest_fly`, 34 arkusze: `arkusze/nakladka/` (spis elementów w `cwiczenia.json`).
- **Obejrzane w pełnej rozdzielczości** (Read na PNG albo kadry pełnej rozdzielczości: `/home/user/rev-p1/tools-r2/k1.png`, `k2.png`):
  - Band Chest Fly top i side (wszystkie 21 kadrów) oraz ciemny top u 0,70–1;
  - Cable Fly top i side (21 kadrów);
  - Wide-Grip top u 0–0,30 i side u 0–0,65;
  - Pec Deck top u 0–0,30 (jasny) i side u 0–0,30 (ciemny);
  - Crucifix top (21 kadrów) i side u 0–0,30.
- **Pozostałe 13 ćwiczeń:** dane póz identyczne z r1. Porównanie JSON `c537f8a^` ↔ `3044df5` wykazuje zmiany tylko w Cable Fly, Band Chest Fly i Wide-Grip. Zmiana silnika w tym zakresie to wyłącznie `contract.ts:327–334` (ślad dźwigni z punktem poza dłońmi), a żadne ćwiczenie chest_fly nie ma takiej dźwigni. Arkusze tych ćwiczeń są wygenerowane, ślad sprawdzony liczbowo (niżej). Kadrów nie oglądałem ponownie, bo ocena r1 („bez uwag”) dotyczy niezmienionych danych.
- **Liczby:** `frameAt` / `jointAngles` / `measuredAngle` / `equipColliders` / `gap` / `checkFrame` w u = 0, 0,25, 0,5, 0,75 i 1 oraz co 0,05 dla szczelin i śladu. Skrypty i wyniki:
  - `/home/user/rev-p1/tools-r2/dump.mjs` → `dump.txt`;
  - `gap.mjs` — najgorsza para ciężar/sprzęt–ciało;
  - `trail.mjs` — położenie `info.trail` względem chwytu R i środka chwytów w 21 kadrach;
  - `cnt.mjs` — `assignAll()`.
- **Test rodziny w kopii:** `npx jest --runInBand tests/figures-v2-chest-fly-p1.test.ts` — 26/26 zielone. Pełnego Jest nie uruchamiałem.
- **Testy (K14):** `git diff c537f8a^..3044df5 -- tests/`.

## Weryfikacja poprawek r1

| r1 | Stan | Dowód |
|---|---|---|
| W1 Band Chest Fly — guma przez tułów | **zamknięte** | Dwie gumy: `from [-60,138,±75]` → chwyt R/L, osobno dla każdej dłoni. Przy u = 1 odcinek w płaszczyźnie barków (x = 0) biegnie przy z ≈ 47, czyli ok. 28 cm na zewnątrz barku (bark z 19). Przy u = 0,5 jest ok. 25 cm od ramienia. Na rzucie z góry (`arkusze/slad/Band-Chest-Fly-top.png`) gumy biegną obok ramion we wszystkich 21 kadrach. Z boku linia przechodzi przez sylwetkę tylko w rzucie, bo guma jest w innej płaszczyźnie. Guma się rozciąga: długość 59,6 cm przy u = 0 i 136 cm przy u = 1. Test szczeliny gumy ≥ 0 z negatywem na starym zaczepie jest zielony. |
| W2 Crucifix — utrzymanie z fazami | **zamknięte** | `spec.static === true`, `staticPositions = [1]`. Poza stała: chwyt `[0, 145,2, ±82,5]`, shElev 90°, łokieć 10° we wszystkich u. Ślad pusty (static). Test UI `figures-v2-data` „Crucifix … bez wiersza faz” sprawdza brak `exercise-figure-v2-phases`, brak „Opuszczanie” i brak przycisku „Zatrzymaj animację”, z negatywem na Chest Fly (hantle). Kąt utrzymania 90° jest pokazany, zgodnie z `lat.height`. |
| W3 Wide-Grip — chwyt na szerokość barków | **zamknięte** | Chwyty `z ±35,1` (70 cm, barki 38 cm), stałe w całym ruchu. shAbd ok. 15°, łokieć 7–12°. Ślad leży na środku gryfu (z = 0). Na rzucie z góry ramiona tworzą wyraźne „V”, a dłonie są daleko poza barkami (`k1.png`, wiersz 1). Test rozstawu z negatywem (Front Raise And Pullover i Bent-Arm oblewają próg) jest zielony. |
| S3 Cable Fly — karta a rysunek | **zamknięte** | Bloczek `y 140` przy barku `y 138,4` („mniej więcej na wysokości barków”). Przy u = 1 dłonie `z ±4,5` (9 cm), czyli „złącz dłonie przed klatką”. Tułów pochylony 12° (bark x 10,4 przy miednicy x 0, biodro 17,6°), czyli „lekkie pochylenie w przód”. Bloczki 15 cm za osobą, zgodnie z „zrób krok w przód”. Najmniejsza szczelina linki od ciała to 1,9 cm (u = 1). Na arkuszach top i side bez przenikania. |
| Pec Deck po scaleniu śladu dźwigni (55c9f206) | **poprawne** | Dźwignia `punkt: "dlonie"`, `trzyma: "R"`, więc `dzwigniaPozaDlonmi = false` (`contract.ts:331`) i ślad trafia do `grips.R`. W 21 kadrach odległość śladu od chwytu R wynosi 0 cm, a łuk na rzucie z góry biegnie przez dłoń (`k1.png`, wiersz 2). Druga dźwignia (S1 r1) nadal brakuje — backlog P1-CHEST-1. |

## Znaleziska

| ID | Poziom | Pewność | Realność | Ćwiczenie / widok / u | Miara / dowód | Kierunek naprawy |
|---|---|---|---|---|---|---|
| R2-S1 | ŚREDNIE | 85% | realny (zestaw widoczny pod rysunkiem po włączeniu rodziny) | Crucifix / zestaw ogólny `raiseSide` / całe ćwiczenie | **(1) Wpis na włączenie rodziny.** Backlog `docs/21:208` mówi: „Crucifix (rodzina chest_fly, status planned): zestaw do poprawy PRZED włączeniem chest_fly”. Źródłem wpisu jest recenzja `delt-raise-zestawy-audytor-2026-11-09.md:43–49`. To r2 jest właśnie tym włączeniem, a zestaw jest bez zmian (`cue-sets.json:1092`, sha `7ff2316c5a09` jak w r1). W r1 nie zauważyłem tego wpisu i wystawiłem zestawowi „wyswietlana” — tę ocenę koryguję. **(2) Wskazówka oddechu.** `plank.mis.breath` („Wstrzymywanie oddechu.”) pochodzi ze źródeł deski. `data/zrodla/figury-sens.json:7902` sam opisuje ją jako „jedno wskazanie pośrednie, do potwierdzenia źródłem opisu”. CLAUDE.md wymaga dla wskazówek oddechu 2 zgodnych źródeł szczebla 4. **(3) Brzmienie.** `front.elbows` brzmi „…w tym samym ustawieniu przez cały ruch”, a od poprawki W2 rysunek wprost pokazuje jedną pozycję bez ruchu (ISOMETRIC). | Przed włączeniem rodziny jedna z dwóch dróg. (a) Zestaw Crucifix bez `plank.mis.breath` (np. `mis.jerk` albo bez błędu) i ze wskazówką trzymania zamiast `front.elbows`; nowe zdanie przez rejestr twierdzeń i recenzję. (b) Zestaw ukryty do czasu (a). Rysunek Crucifix zostaje „wyswietlana”. Wpis `zestawy.Crucifix` w JSON z tej rundy: „do poprawy”, bez `sha`. Zastępuje wpis r1 „wyswietlana” w `figury-recenzja.json`; mechanizm ukrycia wybiera koordynator. |
| R2-N1 | NISKIE | 90% | teoretyczny (test) | — / `tests/figures-v2-data.test.tsx` (test „izometria w pomiarze ciężar + czas”) | „Przypadek negatywny” `expect(bezCrucifix.has('Crucifix') === (metricFor('Crucifix') === 'weight_time' && poseStala('Crucifix'))).toBe(false)` jest tautologią. Lewa strona jest zawsze `false`, a prawą sprawdzono wcześniej jako `true`, więc test przejdzie niezależnie od zawartości `ISOMETRIC`. Prawdziwym strażnikiem jest pętla po wszystkich `weight_time` (`poseStala(k) === ISOMETRIC.has(k)`) oraz `expect(ISOMETRIC.has('Crucifix')).toBe(true)`, więc ochrona istnieje. | Negatyw jako miara: np. strażnik pętli wywołany na zbiorze bez Crucifix musi oblać. Backlog 1.1.x, dopisać do P1-CHEST-1. |

## Sprawdzone bez znalezisk

- **Ślad toru (K4):** `trail.mjs` w 21 kadrach każdego ćwiczenia.
  - Pary hantli, dwie linki, dwie gumy i Pec Deck: ślad w chwycie R (odległość 0 cm).
  - Pullover (hantel): środek chwytów.
  - Sztangi: ślad na gryfie w środku (z = 0, `dump.txt`).
  - Crucifix: bez śladu (static).
  - Skoków między kadrami co 0,05 nie widać na obejrzanych arkuszach.
- **Styki (K7):** `checkFrame` puste (u = 0; 0,5; 1).
  - Ujemne szczeliny tylko w parach chwyt–przedramię (hantel albo gryf w dłoni: −9,3 / −4,9, z założenia) oraz w Pec Deck siedzisko–udo −0,5 cm.
  - Ławka–tułów/głowa 0,7 cm, siedzisko–udo −0,1 cm, czyli w granicy 1 cm.
  - Wide-Grip na ławce ujemnej: głowa na ławce (0,7 cm).
- **Zakres (K8):** łokieć w rozpiętkach 12–16°, stały (≤ 40°, zmiana ≤ 12°). Cable Fly shAbd 82° → 6°, Band 82° → 6°, Pec Deck 82° → 6°. Wide-Grip shElev 137° → 42°, łokieć ≤ 12° (`po.arms` ≤ 25°).
- **Orientacja sprzętu (K6):** bez zmian względem r1. Crucifix — oś hantla odchylona ok. 25° od przód–tył, jak w r1 (akceptowalne). Wide-Grip — talerze na końcach gryfu, gryf poprzecznie.
- **Fazy / tempo (K15):** `DATA_UI.chest_fly` bez zmian. Kierunek u = 0 → 1 koncentryczny, Unoszenie 1 s / Opuszczanie 2 s. Crucifix bez faz.
- **Nakładka:** `flyArmArc` tylko w Chest Fly (hantle) i Incline Chest Fly (hantle). Cable Fly i Band Chest Fly bez elementów. Błąd `jerk` jest tempowy i bez kolorowania pozy. Łuk w rzucie z góry (S2 r1) — backlog.
- **Zestawy ogólne (K12):** skróty `sha` zestawów bez zmian względem r1:
  - `fly` 815db3c89ef8;
  - Pec Deck 4b17dac24c84;
  - `pullover` 8f971a753192;
  - Bent-Arm 3713336cd4ba.

  Ocena r1 pozostaje ważna dla zmienionych póz:
  - Band Chest Fly — `fly.elbows` (łokieć ok. 14° stały), `fly.control` i `mis.jerk` zgodne z nową gumą;
  - Cable Fly (high to low) itd. bez zmian;
  - Wide-Grip `pullover` — `po.arms` (łokieć ≤ 12°) zgodny z szerokim chwytem.

  Wyjątek: Crucifix (R2-S1). N2 r1 (`po.slow` przy Front Raise And Pullover) — backlog.
- **Karty własne (K11):** skróty kart bez zmian:
  - Chest Fly (hantle) 3ff26778cc1d;
  - Incline 0c22493e2ff8;
  - Cable Fly 8c26991ac3f6.

  Wpisy „karty” są ważne. Spójność Cable Fly z rysunkiem jest teraz pełna (`cfly.setup`, `cfly.move`, `fly.posture`; patrz S3). Nowych wpisów kart nie wystawiam.
- **Testy (K14), `c537f8a^..3044df5`:**
  - `figures-v2-chest-fly-p1` — zaostrzenia: guma ≥ 0 cm z negatywem, rozstaw Wide-Grip z negatywem, `static` tylko dla Crucifix. `angleLineShown` Crucifix `true` — uzasadnione: poza statyczna pokazuje kąt utrzymania. Negatyw nakładki przeniesiony z Cable Fly na Band Chest Fly — uzasadnione, element i tak wybiera lista `exercises`.
  - `figures-v2-data` — wyjątek Crucifix usunięty (zaostrzenie). Warunek ISOMETRIC poszerzony o `weight_time` ze stałą pozą — uzasadnione, z pętlą-strażnikiem. Negatyw słaby — R2-N1.
  - `figures-v2-mapping` — chest_fly w `PLANNED_Z_DANYMI` (`figureSpec === null`). Przy przejściu na `ready` ten test trzeba odwrócić w tym samym commicie, bo sam się nie zmieni.
  - `figures-v2-tor` (Leg Press, ślad w kostce), `fala-wspolna-2`, `skrot-v2-wynik`, `strona-eksport*`, `recenzja-wyjatki-1-1`, `figury-recenzja-p2` — zmiany z innych rodzin / D1 A, bez poluzowań dotyczących chest_fly.
  - `figury-v2-zlote` — 3 odciski zmienione celowo, opis w `figures-v2-zgodnosc-wsteczna.test.ts`.

## Tabela ćwiczeń

| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Chest Fly (hantle) | wyswietlana | bez zmian od r1; S2 (nakładka) w backlogu |
| Incline Chest Fly (hantle) | wyswietlana | bez zmian od r1 |
| Decline Dumbbell Fly | wyswietlana | bez zmian od r1 |
| One-Arm Flat Bench Dumbbell Fly | wyswietlana | bez zmian od r1 |
| Flat Bench Cable Fly | wyswietlana | bez zmian od r1 |
| Incline Cable Fly | wyswietlana | bez zmian od r1 |
| Cable Fly | wyswietlana | S3 zamknięte: bloczek 140, dłonie 9 cm, tułów 12° |
| Cable Fly (high to low) | wyswietlana | bez zmian od r1 |
| Cable Fly (low to high) | wyswietlana | bez zmian od r1 |
| Single Arm Cable Fly | wyswietlana | bez zmian od r1 |
| Band Chest Fly | wyswietlana | W1 zamknięte: dwie gumy z zaczepów z ±75, obok ramion |
| Pec Deck | wyswietlana | ślad w chwycie R po 55c9f206; S1 (druga dźwignia) w backlogu |
| Crucifix | wyswietlana | W2 zamknięte (ISOMETRIC); zestaw — R2-S1 „do poprawy” |
| Pullover (hantel) | wyswietlana | bez zmian od r1 |
| Front Raise And Pullover | wyswietlana | N2 (zestaw) w backlogu |
| Wide-Grip Decline Barbell Pullover | wyswietlana | W3 zamknięte: chwyt ±35 cm |
| Bent-Arm Barbell Pullover | wyswietlana | bez zmian od r1 |

Bez rysunku (3): Around The Worlds, Machine Pullover, Svend Press. `liczba` = 20 (`assignAll()`).

## Czego nie obejrzałem w pełnej rozdzielczości

Pełne kadry 13 ćwiczeń bez zmian danych od r1 oraz ciemny motyw części arkuszy. Wszystkie wygenerowane arkusze leżą w `/home/user/rev-p1/chest_fly-r2/arkusze/`. Ślad i szczeliny tych ćwiczeń sprawdziłem liczbowo w tej rundzie.
