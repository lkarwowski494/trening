# Recenzja ruchu 1.1: rodzina hinge (32 ćwiczenia, rig), 27.10.2026

Rodzina rysowana rigiem (`lib/figures/v2/rigs/hinge.ts`, warianty w `variants.ts`). Oceniam `origin/integracja-1-1` @ 4e5a7f95. Uzasadnień generatorów ani opisów commitów nie czytałem.

Metoda jak w `squat.md`:

- `podglad-v2.mjs --family hinge --us 0,0.25,0.5,0.75,1`: bok i przód.
- Liczby z `frameAt` na siatce u co 0,1 i 0,05: położenie gryfu względem środka stopy (pięta–palce) i palców, odległość osi gryfu od osi goleni i uda, kąty biodra, kolana i tułowia, rekwizyty.
- Współrzędne: x w przód, y w górę, z w prawo, cm. Kostka x 0, środek stopy x 6,4, palce x 18,7.

Automaty:

- `sens-gotowe.mjs`: **0 naruszeń**.
- `waliduj` na pozach z `exampleFor`: **30/32 OK**. Odrzuca Deficit Deadlift (udo 0,43 cm w gryfie przy tolerancji 0,3, drobiazg) i One-Arm Side Deadlift (dłoń 10,2 cm od gryfu, gryf 4,8 cm w goleniach: to znalezisko nr 2).
- Szczelność wobec znalezisk: reguły działające w procesie łapią **0 z 4**. Walidator kontraktu na pozach z rigu złapałby nr 2 (1 z 4).

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Deadlift (sztanga)** | **BŁĄD** | nr 1 |
| **Deadlift (hantle)** | **BŁĄD** | nr 1 |
| Sumo Deadlift | OK | gryf pionowo nad środkiem stopy (−0,2 cm), szeroko, stopy na zewnątrz, tułów 39° → 2° |
| Trap Bar Deadlift | OK | uchwyty nad środkiem stopy (−1,7 cm), tułów 36° na starcie |
| **RDL (sztanga)** | **BŁĄD** | nr 4 (kolano 44°) |
| **RDL (hantle/linki)** | **BŁĄD** | nr 4 (40°) |
| **Good Morning** | **BŁĄD** | nr 4 (44°) |
| **Rack Pull** | **BŁĄD** | nr 1 (gryf 19 cm przed środkiem stopy już na starcie); uwaga A |
| **Single Leg RDL (hantel)** | **BŁĄD** | nr 4 (41°) |
| **Single Leg RDL (linki)** | **BŁĄD** | nr 4 (44°) |
| Cable Pull Through | OK | linka między nogami z tyłu, biodro 9° → 75°, kolano 13° |
| Sumo Deadlift (kettlebell) | OK | odważnik pionowo między stopami |
| **Single Arm RDL (hantel/linka)** | **BŁĄD** | nr 4 (44°) |
| **Axle Deadlift** | **BŁĄD** | nr 1 |
| **Deadlift with Bands** | **BŁĄD** | nr 1; uwaga B (guma) |
| **Deadlift with Chains** | **BŁĄD** | nr 1; łańcuchy przy końcach gryfu, poprawnie |
| **Deficit Deadlift** | **BŁĄD** | nr 1 |
| **Rack Pull with Bands** | **BŁĄD** | nr 1; A, B |
| **Reverse Band Deadlift** | **BŁĄD** | nr 1 i nr 3 |
| **Cable Deadlift** | **BŁĄD** | nr 1 |
| Leverage Deadlift | OK | jak trap bar |
| **One-Arm Side Deadlift** | **BŁĄD** | nr 2 (i nr 1) |
| Rickshaw Deadlift | OK | jak trap bar |
| **Band Good Morning** | **BŁĄD** | nr 3 (guma przez tułów) i nr 4 |
| **Clean Deadlift** | **BŁĄD** | nr 1 |
| **Good Morning off Pins** | **BŁĄD** | nr 4; A |
| **Reverse Band Sumo Deadlift** | **BŁĄD** | nr 3 |
| Smith Machine Stiff-Legged Deadlift | OK | kolano 24°, tułów 64°, prowadnica pionowo |
| **Snatch Deadlift** | **BŁĄD** | nr 1 (szeroki chwyt poprawny) |
| Stiff-Legged Barbell Deadlift | OK | kolano 24°, tułów 64° |
| Sumo Deadlift with Bands | OK z uwagą | B |
| Sumo Deadlift with Chains | OK | łańcuchy przy końcach gryfu |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **13 wariantów martwego ciągu klasycznego z podłogi i z podwyższenia:** Deadlift (sztanga, hantle), Axle, with Bands, with Chains, Deficit, Reverse Band, Cable, One-Arm Side, Clean, Snatch, Rack Pull, Rack Pull with Bands | u = 0–0,6, gryf i kolana (bok) | **Sztanga startuje nad palcami, a w połowie ruchu jest przed palcami.** Deadlift (sztanga): w u = 0 gryf w x 16,5, czyli 10,1 cm przed środkiem stopy (x 6,4), a palce są w x 18,7. W u = 0,4 gryf jest w x 27,3: 20,8 cm przed środkiem stopy i 8,6 cm przed palcami. Potem wraca do x 13,3 na górze. Gryf trzyma się nóg (oś gryfu 8 cm od osi goleni, potem 10,6 cm od osi uda, czyli styk), ale goleń jest na starcie pochylona 26° od pionu (kolano x 17,9), więc gryf musi obejść kolana z przodu. Rack Pull startuje z gryfem 19,1 cm przed środkiem stopy. Wskazówka `dl.feet` wyświetlana przy ćwiczeniu mówi: „sztanga tuż przy piszczelach, nad środkiem stopy”. Wiersz błędu `mis.barAway` („Sztanga odjeżdża od ciała”) ma gryf 22–27 cm przed środkiem stopy, czyli tylko 6–12 cm dalej niż poza poprawna, więc błąd ledwie różni się od wzorca. Sumo i trap bar są poprawne (−0,2 i −1,7 cm). | Gryf nad środkiem stopy (± 3 cm) na starcie i tor gryfu prawie pionowy (odchylenie ≤ 5 cm). Goleń na starcie bardziej pionowo (kolana tylko trochę przed gryfem), barki nad gryfem lub tuż przed nim (`dl.hipsLow`). Wiersz `mis.barAway` wtedy wyraźnie odstaje od wzorca. | 80% | realny (rodzina gotowa, wyświetlana dziś) | nie: sens-gotowe 0 naruszeń; brak reguły „gryf nad środkiem stopy” |
| 2 | **One-Arm Side Deadlift** | wszystkie klatki, gryf (oba rzuty) | **Pełna sztanga leży w poprzek przed nogami i przechodzi przez golenie, a trzyma ją jedna ręka.** Rekwizyt `barbell` w (16,5; 22,5; 0) z gryfem wzdłuż osi z, czyli w poprzek ciała. Chwyt prawej ręki jest w z = 2 (środek gryfu), a dłoń 10,2 cm od gryfu. Gryf wchodzi 4,8 cm w golenie (u = 0–0,33), 2,4 cm w uda i 0,8 cm w tułów (walidator kontraktu na pozie z rigu). W rzucie z przodu widać zwykły martwy ciąg z jedną ręką na biodrze. | Gryf z boku ciała, wzdłuż osi przód–tył (x), dłoń na środku gryfu, jak walizka. Talerze przed i za osobą, gryf przy zewnętrznej stronie uda. | 85% | realny | nie w procesie (rig pomijany); walidator kontraktu na pozie z rigu: tak |
| 3 | **Band Good Morning, Reverse Band Deadlift, Reverse Band Sumo Deadlift** | wszystkie klatki, guma | **Guma w osi ciała: w Good Morning przechodzi przez tułów, a w odmianach „Reverse” ciągnie od dołu.** Band Good Morning: `band` od gryfu na plecach (−1,5; 138,4; 0) do podłogi (−1,5; 0; 0), przez głowę, tułów i miednicę (miednica x 1,4, z 0). W rzucie z przodu przerywana linia biegnie środkiem sylwetki. Reverse Band (klasyczny i sumo): guma od gryfu w dół do podłogi, tak samo jak w „with Bands”, choć w tej odmianie zwisa z góry stojaka. Ta sama klasa co w `squat.md` nr 2 i `bench_press.md` nr 2. | Dwie gumy przy końcach gryfu: w dół do podłoża (with Bands) albo od góry stojaka (Reverse Band). | 80% | realny | nie |
| 4 | **RDL (sztanga), RDL (hantle/linki), Single Arm RDL, Single Leg RDL (hantel, linki), Good Morning, Band Good Morning, Good Morning off Pins** | u = 1 (dół), kolana | **Kolana zgięte 40–44° na dole, a wskazówki mówią „lekko ugięte”.** RDL (sztanga): w u = 1 kolano 44°, biodro 77°, tułów tylko 39° od pionu, miednica opada z y 89,8 do 80,2. Good Morning: kolano 44° przy tułowiu 48°. Wskazówki wyświetlane przy ćwiczeniach: `rdl.move` „kolana lekko ugięte”, `rdl.knees` „Kolana tylko lekko ugięte — to nie przysiad”, `gm.setup` „kolana lekko ugięte”. Wiersz błędu `rdl.knees` (kneesBent) ma kolano 58°, tylko 14° więcej niż poza poprawna. Stiff-Legged (kolano 24°, tułów 64°) pokazuje, że rig potrafi narysować głębszy zawias przy mniejszym zgięciu kolan. | Kolano ok. 15–25° na dole, ruch przede wszystkim w biodrze (tułów 60–80° od pionu w RDL, do poziomu w Good Morning), miednica cofa się, a nie opada. Wiersz `rdl.knees` wtedy wyraźnie różni się od wzorca. | 65% | realny | nie |

## OK z uwagą (backlog, nie blokuje)

- **A. Rack Pull, Rack Pull with Bands, Good Morning off Pins bez stojaka ani bolców.** Gryf startuje (albo kończy) na wysokości kolan w powietrzu. Ta sama uwaga co w `bench_press.md` (Board, Pin). Pewność 60%.
- **B. „with Bands”: jedna guma w osi** (Deadlift with Bands, Rack Pull with Bands, Sumo with Bands). Guma biegnie od środka gryfu do podłogi między stopami, przed ciałem, ale nie przez nie (inaczej niż w przysiadzie i wyciskaniu). Zwykle są dwie gumy przy końcach gryfu. Pewność 70%.

## Proponowane reguły

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `gryf_nad_srodkiem_stopy` | martwe ciągi z podłogi i podwyższenia: w u = 0 gryf ≤ 5 cm od środka stopy, w każdej klatce ≤ 8 cm | 13 wariantów: 10,1 / 20,8 cm (Rack Pull 19,1) | sumo, trap bar, leverage, rickshaw: bez alarmu |
| `blad_odstaje_od_wzorca` | wiersz błędu różni się od pozy poprawnej o ≥ 15 cm (położenie) albo ≥ 20° (kąt) w klatce, w której błąd jest najsilniejszy | barAway: +6–12 cm; kneesBent: +14° | do sprawdzenia na pozostałych wierszach błędów rigów |
| `zawias_kolana_lekko` | warianty `rdl` i `goodMorning` ze wskazówką „kolana lekko ugięte”: kolano ≤ 30° w każdej klatce | 8 ćwiczeń: 40–44° | Stiff-Legged 24°: bez alarmu |
| `rig_przez_walidator` | rigi przechodzą przez `waliduj` (geometria, chwyt) na pozach z `exampleFor`, z tolerancjami dla zamierzonych styków | One-Arm Side Deadlift | drobiazgi (0,4–0,5 cm) do tolerancji |
