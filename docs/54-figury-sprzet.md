# 54 — Figury v2: sprzęt w kontrakcie danych

Zlecenie koordynatora 26.10.2026 (wątek „grafiki-sprzęt”): kontrakt, silnik rysowania, kolizje, walidator i generator poleceń obsługiwały tylko sztangę/drążek, słupek, podłogę i skrzynię (ławkę płaską jako skrzynię).
Przez to część ćwiczeń każdej rodziny była pomijana w poleceniach („pomiń — zrobi nasz agent”). Ten dokument: raport pokrycia, stan implementacji rodzajów sprzętu, konwencje wymiarów i otwarte pytania.
Zasady grafik: `docs/53-grafiki-model-pracy.md`. Rejestr kodu: `lib/figures/v2/gear.ts` (rodzaj → pola, rekwizyty, możliwości katalogu, punkty odniesienia). Wymiary: `data/zrodla/figury-sprzet.json` (test `tests/zrodla-pelne-sprzet.test.ts`).

## 1. Raport pokrycia (stan wyjściowy, 26.10.2026)

Katalog: **709** ćwiczeń (87 w rodzinach gotowych w kodzie, 622 do zrobienia). Sprzętu spoza kontraktu wymagało **459** ćwiczeń, w tym **383** z 622 do zrobienia; **239** do zrobienia nie wymagało nic poza kontraktem.
Liczby poniżej: ćwiczenia z 622, które wymagają danego rodzaju (w nawiasie: tylko tego rodzaju). Rodzaj ćwiczenia = pierwsza możliwość z niewspieranej grupy `requires` w katalogu.

| # | Rodzaj sprzętu (prymityw) | Ćwiczeń | Główne rodziny | Koszt | Stan |
|---|---|---|---|---|---|
| 1 | hantel / kettlebell / talerz / piłka lekarska w dłoni | 142 (123) | delt_raise 19, kb_ballistic 17, curl 16, sled_throw 12 | niski | **gotowe (26.10.2026)** |
| 2 | stojak, Smith, landmine, poręcze, gryf łamany/trap/T, ściana, mata, łańcuchy | 58 (50) | lunge 8, triceps 5, overhead_press 5, row 4 | niski (rekwizyty są w silniku) | w toku: stojak, gryf łamany/gruby, Smith, landmine, ściana, trap bar, uchwyty farmerskie i łańcuchy gotowe (26.10.2026) |
| 3 | wyciąg (słup, bloczek, uchwyt / lina / opaska na kostkę) | 76 (70) | curl 10, triceps 9, cable_row 7, pulldown 7 | średni | **gotowe (26.10.2026)** |
| 4 | ławka regulowana (skos +/−, wałki na nogi, modlitewnik) | 35 (9) | curl 12, delt_raise 6, core_floor 5 | niski–średni | ławka i modlitewnik gotowe (26.10.2026) |
| 5 | guma / taśma oporowa | 17 (16) | hip_abd_add 4, rotator_cuff 3 | niski | **gotowe (26.10.2026)** |
| 6 | piłka gimnastyczna, BOSU, ślizgacze, roller, kółko do brzucha | 25 (21) | foam_roll 10, core_floor 3, core_standing 3 | niski–średni | piłka gimnastyczna i wałek piankowy gotowe (26.10.2026); BOSU, ślizgacze, kółko do brzucha, wałek na nadgarstki — nie (po 1–2 ćwiczenia) |
| 7 | taśmy zawieszane, lina pionowa; ławki specjalne (rzymska, GHD, GHR, reverse hyper) | 5 + 4 | cardio, back_extension, core_floor | średni | taśmy i lina gotowe (26.10.2026); ławki specjalne — nie (4 ćwiczenia, osobne konstrukcje) |
| 8 | maszyny (siedzisko, oparcie, dźwignia; ok. 21 typów) | 45 (43) | leg_machine 7, sled_throw 6, leg_isolation 5 | wysoki | **gotowe jako schemat (26.10.2026)**: dźwignia obrotowa albo prowadnica + ławka jako siedzisko; sanie (sled) nie |
| 9 | cardio (ergometry) | 9 (9) | cardio 9 | inna klasa (rig, nie sprzęt) | wyjątek z powodem |

Kolejność: największa liczba ćwiczeń na koszt. Sprzęt nie jest jedynym brakiem rodzin: pushup_plank (rig w podporze), plyo, olympic, mobility_* mają mało braków sprzętowych, ale potrzebują osobnych rigów — poza zakresem tego dokumentu.

## 2. Rodzaje sprzętu w kontrakcie (`sprzet[].rodzaj`)

Wspólne zasady: sprzęt trzymany w dłoniach **nie ma własnych współrzędnych** — podąża za chwytem (środek między dłońmi + `przesuniecie`), więc nie da się go „oderwać” od dłoni; kontrola chwytu jest w walidatorze (kod `chwyt`, komunikat z wartością i wskazówką naprawy). Rysunek: role kolorów z palety (jasny/ciemny/Zwiększ kontrast), trzy widoki (z boku, z przodu, z góry). Kolizje: ciało nie przenika sprzętu (próg `TOL.pen` = 0,3 cm), przedramię trzymające sprzęt ma tolerancję kontaktu jak przy sztandze i hantlu; piłka i talerz nie schodzą pod podłogę.

### 2.1 hantel, kettlebell, talerz, pilka_lekarska (26.10.2026)

| Rodzaj | Pola | Chwyt (kontrola) | Kolider |
|---|---|---|---|
| `hantel` | `trzyma` obie (dwa hantle, domyślnie) / R / L; `pionowo` (jeden hantel obiema dłońmi, goblet); `promien` główki (domyślnie 6 cm) | środek hantla = chwyt (trywialnie spełniony); pionowo: dłonie ≤ 6,5 cm od środka | kula r główki na chwycie |
| `kettlebell` | `trzyma` obie (jeden kettlebell, obie dłonie) / R / L; `dzwon` dol / wzdluz / tyl; `promien` dzwonu (9,5) | dłonie ≤ 7 cm od środka rączki | kula dzwonu w kierunku `dzwon` |
| `talerz` | `trzyma` obie / R / L; `promien` (22,5); `przesuniecie` środka względem środka między dłońmi | dłoń ≤ 3 cm od okręgu obręczy (płaszczyzna y–z, powierzchnią do przodu) | 16 kapsuł obręczy + 4 średnice |
| `pilka_lekarska` | `trzyma` obie / R / L; `promien` (11); `przesuniecie` | dłoń ≤ 3 cm od powierzchni kuli (odległość od środka = promień) | kula |

`dzwon`: `dol` = pod rączką; `wzdluz` = w przedłużeniu przedramienia (swing, clean, snatch; przy przedramieniu uniesionym powyżej poziomu dzwon płynnie przechodzi za przedramię — liczone ze szkieletu); `tyl` = za rączką w kierunku −x (rack, nad głową).
Uproszczenia: piłka i talerz są w dłoniach w każdej klatce (moment wyrzutu piłki nie jest pokazywany); talerz tylko chwytem po bokach (jedna dłoń nad drugą nieobsługiwane); kolider talerza to obręcz i szprychy, nie pełna tarcza.
Polecenia: ćwiczenia z hantlem, kettlebell, talerzem i piłką lekarską nie są już pomijane; polecenie ma sekcję „Sprzęt w ćwiczeniach tej części” z punktami odniesienia (liczby z silnika).

### 2.2 Konstrukcje stałe (stojak, Smith, landmine, ściana, łańcuchy, gryfy)

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `slupek` (stojak) | `x`, `h`, `hak` (wysokość haka) | rack, bench.uprights, rack.safeties | słupki w z = ±64 poza zasięgiem ciała; położenie względem sztangi ocenia recenzent ruchu |
| `smith` | `x`, `h`; sztanga (podazaZaChwytem) na osi prowadnicy | smith | sprawdzenie: oś sztangi w x prowadnicy ± 1,5 cm w każdej klatce (kod `geometria`); wymaga wpisu sztanga; prowadnica bez pochylenia (uproszczenie) |
| `landmine` | `x`, `y` (oś obrotu, domyślnie 5), `z`, `dlugosc` (200), `trzyma` | landmine | sztywny gryf: dłonie na sferze o promieniu `dlugosc` wokół osi obrotu ± 3 cm (kod `geometria`), klatki co ≤ 48 cm drogi dłoni; bez osobnej sztangi |
| `sciana` | `x`, `h` (250), `przed` (ściana przed osobą) | wall | lita za osobą (domyślnie) albo przed osobą; kontakt ciała do 1,5 cm; w widoku z przodu ściana przed osobą nie jest rysowana (przekrój) |
| `gryf_szesciokatny` | bez pól (środek = środek między dłońmi) | trap_bar | uchwyty w z = ±29, dłonie na uchwytach ± 0,6 cm |
| `hantel` (uchwyty farmerskie) | `promien` 10–12 | farmers_handles (oraz db) | uchwyty farmerskie rysowane jako hantle z dużym promieniem — uproszczenie; tolerancja kontaktu przedramienia rośnie z promieniem |
| `lancuchy` | bez pól; wiszą na końcach gryfu (z = ±45) albo z dłoni | chains | pionowe linie przerywane do podłogi, bez kolidera; rysunek nie pokazuje zmiany obciążenia |
| `sztanga` (gryf łamany, gruby) | jak dotąd; gryf łamany: `dlugosc` 120 | ez_bar, axle_bar (oraz pullup.bar, rings, barbell) | gryf łamany i gruby rysowane jak sztanga — uproszczenie |

### 2.3 Wyciąg

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `wyciag` | `x`, `y` (wysokość bloczka), `z`, `h` (kolumna, 230), `dwa`, `chwyt` (uchwyt / lina / drazek / kostka), `trzyma` | cable.high/mid/low/dual/row_seat, lat_pulldown, ankle_strap, cable.handles, cable.rope | kolumna + bloczek + prosta linka do dłoni albo kostki (kierunek oporu = linka); kolumna i linka (poza ostatnimi 12 cm) nie przenikają ciała; wysokość bloczka zgodna z możliwością katalogu (niski 5–60, środkowy 70–160, wysoki 150–240 cm — konwencja) |

### 2.4 Ławka regulowana

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `lawka` | `x` (zawias), `top` (siedzisko: 43, ujemna 60), `kat` (−45…90°), `dlugosc` oparcia (75), `walki` (wałki na nogi) | bench.flat, bench.incline, bench.decline | geometria i kontakty jak w rigu wyciskania leżąc (BENCH): plecy/miednica/uda/głowa 1,5 cm, ramię 6, przedramię 2,5, sztanga na klatce 2,6/2,2; kąt musi odpowiadać możliwości katalogu (płaska ±5°, skośna ≥ 10°, ujemna ≤ −5°); skrzynia nie jest już ławką płaską |

### 2.5 Guma oporowa

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `guma` | `mocowanie` (zaczep / stopy / kostki / dlonie / sztanga), `x`, `y`, `z` (punkt zaczepu), `trzyma` | bands | linia przerywana od punktu mocowania do dłoni (po jednej na dłoń), między kostkami, między dłońmi albo od końców gryfu; bez kolidera i limitu długości (guma się rozciąga); kierunek oporu = linia |

### 2.6 Piłka gimnastyczna i wałek piankowy

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `pilka_gimnastyczna` | `x`, `z`, `promien` (32,5; 20–40) | stability_ball | kula na podłodze (nie w dłoniach); dopuszczalne wgniecenie 3 cm (miękka piłka); osie tułowia dotykają piłki w odległości promień + 9,5 cm |
| `rolka` | `x`, `z`, `promien` (7,5), `dlugosc` (90) | foam_roller | walec wzdłuż z na podłodze; wgniecenie do 2 cm; wałek się nie rusza (ciało się po nim przesuwa) |

### 2.7 Modlitewnik

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `modlitewnik` | `x`, `top` (górny koniec podpórki, 95), `kat` (30–80°, 60), `dlugosc` (45), `y` (siedzisko, 48) | preacher_bench | podpórka opada od osoby (+x), siedzisko za górnym końcem; kontakty: ramię/przedramię 3 cm, tułów 2 cm, miednica/uda 1,5 cm |

### 2.8 Taśmy do podwieszania, lina pionowa, sanie, poręcze

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `zawieszenie` | `x`, `y` (zaczep, 220), `z`, `punkt` (dlonie / kostki), `trzyma` | suspension | dwie taśmy z jednego zaczepu do dłoni albo kostek; kolider taśm (jak linka wyciągu) |
| `lina_pionowa` | `x`, `z`, `h` (góra, 400), `y` (dół, 20), `trzyma` | climbing_rope | dłonie na osi liny ± 3 cm; stopy i łydki mogą dociskać linę do 3 cm; szablon pull_up nie wymaga drążka przy linie; reguł sensu dla wspinania nadal brak (Rope Climb pomijany z tego powodu) |
| `sanie` | `x`, `h` (słupki, 100), `dlugosc` (60), `trzymanie` (slupki / lina) | sled | słupki: dłonie ± 1,5 cm; lina: linka od przodu sań do dłoni; bez pasa/uprzęży (dip_belt — nadal poza kontraktem) |
| `poreczy` | `x0`, `x1`, `h` (115), `z` (połowa rozstawu, 22) | dip.bars | dłonie na poręczach ± 1 cm |
| `skrzynia` (poza osią) | `z` (środek na boki), `dwa` (dwie symetrycznie, ±45) | box | decyzja koordynatora 26.10.2026: sprzęt poza osią z (Drop Push, Incline Push-Up Depth Jump) |
| `slizgacze` | `punkt` (kostki / dlonie), `trzyma` | sliders | krążki 16 cm × 2 cm na podłodze pod kostką/dłonią; bez kolidera |
| `kolko` | `promien` (8), `trzyma` | ab_wheel | oś między dłońmi na wysokości promienia (± 1,5 cm), kolider kulą |
| `pilka_lekarska` (kamień atlas, beczka, worek) | `promien` 6–20 | atlas_stones, keg, sandbag | rysowane jak kula — uproszczenie |

### 2.9 Maszyny (schematycznie)

| Rodzaj | Pola | Możliwości katalogu | Uwagi |
|---|---|---|---|
| `dzwignia` (+ `lawka` jako siedzisko i oparcie) | `tryb` obrot / prosta, `x`, `y`, `z` (oś obrotu albo początek prowadnicy), `dlugosc` (ramię 60 / skok 60), `kat` (kąt prowadnicy), `punkt` (dlonie / kostki / miednica), `trzyma` (domyślnie R) | 22 typy maszyn: leg_ext, leg_curl, leg_press, hack_squat, pendulum_squat, belt_squat_machine, chest_press_machine, shoulder_press_machine, pec_deck, row_machine, pullover_machine, ab_crunch_machine, biceps_curl_machine, triceps_ext_machine, lateral_raise_machine, glute_kickback_machine, hip_thrust_machine, hip_abductor_adductor, calf_machine, lever_machine, dip_machine, t_bar | **uproszczenie**: nie odwzorowujemy konstrukcji maszyn, tylko ruchomą część (sztywne ramię wokół osi albo prowadnicę liniową) i siedzisko z oparciem; jedna dźwignia po jednej stronie ciała; ramię przez ciało odrzucane (kolider poza ostatnimi 25 cm); punkt mocowania podąża za ciałem; długość ramienia i prowadnica sprawdzane ± 3 cm |

Przykłady few-shot z rigów gotowych rodzin (`exampleFor`) zawierają teraz wpis `lawka` (wcześniej ławka nie była zapisywana w danych).

Wymagany sprzęt ćwiczenia (`requiredGearIssues`, używane w `waliduj`): poza musi zawierać wpis rodzaju pokrywającego możliwość z `requires` katalogu (np. wyciąg z bloczkiem wysokim dla `cable.high`); alternatywy w grupie to ALBO; stojak (słupek) nie jest wymagany; grupy bez rodzaju w rejestrze pomijane. Kod błędu: `sprzet`.

## 2.10 Poza kontraktem (stan 26.10.2026)

Pozostałe ćwiczenia z niewspieranym sprzętem (z 622 do zrobienia): cardio (ergometry, bieżnie, skakanka, liny bojowe: 10), ławki specjalne (rzymska, GHD, glute-ham, reverse hyper: 4), sprzęt strongman (opona, jarzmo, kłoda, riksza, circus bell: 5), BOSU, wałek na nadgarstki, młot, uprząż na szyję, pas obciążeniowy z sańmi (dip_belt) — po 1–2 ćwiczenia. Powód: osobne konstrukcje albo inna klasa rigu (cardio = lokomocja, nie sprzęt). Do decyzji: wyjątek z powodem czy kolejne prymitywy.

## 3. Wymiary sprzętu — konwencja rysunku

Wszystkie wymiary (`EQUIP` w `lib/figures/v2/draw.ts`) są „konwencją rysunku” (uproszczenie ilustracyjne; aplikacja nie podaje ich użytkownikowi). Plik `data/zrodla/figury-sprzet.json` opisuje orientacyjną zgodność z powszechnymi rozmiarami (wiedza ogólna, **nie przeczytane źródło**).

Otwarte pytanie (do badacza, szczebel 4 — dokumentacja producentów i regulaminy federacji): potwierdzenie rozmiarów talerza 450 mm, gryfu 2,2 m, tulei 50 mm, ławki (szerokość/wysokość), piłki lekarskiej i dzwonu kettlebell przeczytanym źródłem. Do czasu potwierdzenia status zostaje „konwencja rysunku”; nic w aplikacji nie twierdzi zgodności z normą.
