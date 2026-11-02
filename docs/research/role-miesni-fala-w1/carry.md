# Role mięśni — rodzina `carry` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: luki w rodzinie `carry` (wzorzec `carry`): Farmer's Walk (+ trap bar, + Farmers Handles), Suitcase Carry, Overhead Carry (hantle), Double Kettlebell Front Rack Carry, Rickshaw Carry. Ten plik zawiera też wspólne nowe źródła dla `strongman.md`.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.

## Zasada wspólna (noszenie = utrzymanie)

W noszeniu mięśnie tułowia i obręczy barkowej głównie **utrzymują** pozycję (izometria), nie wykonują ruchu w stawie. Dlatego zdania ruchowe z istniejących funkcji („Skręca tułów i pochyla go na bok”, „Unosi barki”, „Zgina tułów”) nie pasują — potrzebne są funkcje z czasownikiem utrzymania („trzyma”, „nie pozwala”). Wzorzec `carry` nie ma fazy (`phases`), więc metryka `time` nie wyłącza opisu. Funkcja utrzymania wymaga źródła **o noszeniu** (EMG albo opis roli w tym ćwiczeniu); sama anatomia ruchu + „skoro unosi, to przy noszeniu trzyma” to analogia (uproszczenie, bez wyświetlania).

Ta zasada dotyczy też `strongman.md` (Yoke Walk, Conan's Wheel).

## Wyniki

| Ćwiczenie | Region (udział) | Wynik | Uzasadnienie |
|---|---|---|---|
| Suitcase Carry | obliques (1) | gotowe — nowa funkcja `obliques.resist_side_bend` (nameRule) | SN-C2 (Paek 2022, wyniki 3.2 i dyskusja): przy chodzie z hantlem w jednej ręce mięśnie tułowia, zwłaszcza skośny zewnętrzny, pracują mocniej po stronie przeciwnej do ciężaru. SN-C1 (McGill 2009, dyskusja s. 1160): w konkurencjach z noszeniem zawodnicy usztywniali tułów bocznymi mięśniami tułowia (skośne i czworoboczny lędźwi), a noszenie asymetryczne autorzy wskazują jako trening tego usztywnienia. Kierunek zgadza się z anatomią S18 (skośne pochylają tułów na swoją stronę → strona przeciwna do ciężaru opiera się przechyłowi). Dwa niezależne źródła szczebla 3 (różne zespoły, różne kraje) + SN-C3 jako potwierdzenie pochodne. |
| Suitcase Carry | abs (0,5) | otwarte | Brak przeczytanego źródła roli prostego brzucha w noszeniu jednostronnym (SN-C2 pokazuje tylko przesunięcie aktywności między stronami). |
| Farmer's Walk, Farmer's Walk (trap bar), Farmer's Walk (Farmers Handles) | obliques (0,5) | otwarte — **jedno źródło** | Przy noszeniu obustronnym rolę bocznych mięśni tułowia opisuje tylko SN-C1 (jarzmo i spacer farmera); SN-C3 i SN-C4 powtarzają te same dane (pochodne, nie niezależne). SN-C5 mierzy skośny zewnętrzny w spacerze farmera (ok. 9% MVIC, tab. 1), ale nie opisuje roli. Kandydat: rozszerzenie nameRule z Suitcase Carry po drugim niezależnym źródle o noszeniu obustronnym. |
| Farmer's Walk (×3) | upper_back (1) | otwarte — **jedno źródło** (propozycja funkcji z `status: jedno_zrodlo`, bez wyświetlania) | SN-C5 (Decker i in. 2026, tab. 1, s. 5): górna część czworobocznego najbardziej aktywna z mierzonych mięśni w spacerze farmera (ok. 32% MVIC). Funkcja unoszenia barków — S1, S5. Że czworoboczny „trzyma barki, gdy ciężar ciągnie je w dół”, to połączenie jednego badania z anatomią → jedno źródło. |
| Farmer's Walk (×3) | abs (0,5) | otwarte | Źródła niezgodne co do wielkości: SN-C1 — szczyt aktywności mięśni brzucha w fazie chodu; SN-C5 — prosty brzucha ok. 5,5% MVIC (niska). Brak przeczytanego źródła roli. |
| Overhead Carry (hantle) | abs (1) | otwarte | Brak przeczytanego źródła o noszeniu nad głową. |
| Overhead Carry (hantle) | front_delt (1), side_delt (0,5) | otwarte — uproszczenie | Utrzymanie ręki nad głową wymaga pracy zginaczy i odwodzicieli barku (S1, S6) — to wniosek z anatomii, nie źródło o tym ćwiczeniu. Wyszukiwanie EMG noszenia nad głową nie dało przeczytanego badania. |
| Double Kettlebell Front Rack Carry | abs (1), upper_back (0,5) | otwarte | Brak przeczytanego źródła. **Uwaga do katalogu (nie do ról):** SN-C3 (s. 52, „EMG Research”) podaje za McGillem i in., że aktywność tułowia i bioder w noszeniu „racked” była bardzo niska — to stoi w napięciu z `abs: 1` w `muscleLoad`. Do sprawdzenia przy przeglądzie katalogu (źródło pierwotne nieprzeczytane). |
| Rickshaw Carry | upper_back, lower_back, quads (0,5) | otwarte | Brak przeczytanego źródła o tym ćwiczeniu (SN-C4: ten typ noszenia praktycznie niebadany). |

## Propozycje do `data/zrodla/role-miesni.json`

### `functions` (nowe)

```json
"obliques.resist_side_bend": {
 "region": "obliques", "staw": "kręgosłup", "ruch": "opór przed zgięciem bocznym (izometria)",
 "pl": { "main": "Trzyma tułów prosto, gdy ciężar ciągnie go w bok", "aux": "Pomaga trzymać tułów prosto, gdy ciężar ciągnie go w bok" },
 "en": { "main": "Keeps your trunk upright as the weight pulls it sideways", "aux": "Helps keep your trunk upright as the weight pulls it sideways" },
 "pewnosc": "dwa źródła", "status": "dwa_zrodla", "zrodla": ["SN-C1", "SN-C2", "S18"],
 "uwaga": "Tylko jawna lista nameRules (noszenie jednostronne). SN-C3 pochodne (cytuje SN-C1)."
},
"upper_back.hold_shoulders": {
 "region": "upper_back", "staw": "łopatka", "ruch": "utrzymanie barków (izometria uniesienia)",
 "pl": { "main": "Trzyma barki, żeby ciężar nie ściągał ich w dół", "aux": "Pomaga trzymać barki, żeby ciężar nie ściągał ich w dół" },
 "en": { "main": "Holds your shoulders up against the pull of the weight", "aux": "Helps hold your shoulders up against the pull of the weight" },
 "pewnosc": "jedno źródło", "status": "jedno_zrodlo", "zrodla": ["SN-C5", "S1", "S5"],
 "uwaga": "Nie wyświetlać. Aktywność w noszeniu: tylko SN-C5; rola z anatomii (S1, S5). Wyświetlenie po drugim źródle o noszeniu."
}
```

Funkcję `upper_back.hold_shoulders` dodać tylko, jeśli koordynator chce mieć kandydata w danych (decyzja 26.10.2026 dopuszcza `jedno_zrodlo` bez wyświetlania); inaczej pominąć i zostawić w „Otwarte”.

### `nameRules.reguly` (nowy wpis)

```json
{ "muscle": "obliques", "roles": ["main", "aux"], "function": "obliques.resist_side_bend", "exercises": ["Suitcase Carry"] }
```

Dlaczego nameRule, nie reguła `carry × obliques`: dwa źródła dotyczą noszenia jednostronnego; obustronne ma jedno (patrz tabela). Inne ćwiczenia noszenia jednostronnego z `obliques` ≥ 0,5 bez opisu (jeśli są w katalogu) — dopisać do listy po sprawdzeniu nazwy.

### `open` (zmiana brzmienia)

Zamiast „[OTWARTE] Rola mięśni utrzymujących w martwym ciągu i noszeniu …” proponuję: „[OTWARTE] Rola mięśni utrzymujących w martwym ciągu i noszeniu obustronnym/nad głową/z przodu (najszersze, górna część pleców, brzuch, skośne, barki) — jedno źródło albo brak; skośne w noszeniu jednostronnym rozstrzygnięte 02.11.2026 (Suitcase Carry, nameRule)”.

## Nowe źródła (wspólne z `strongman.md`)

| id (roboczy) | org / zespół | tytuł, miejsce | url | szczebel | czytane |
|---|---|---|---|---|---|
| SN-C1 | Univ. of Waterloo (McGill SM, McDermott A, Fenwick CMJ) | Comparison of different strongman events: trunk muscle activation and lumbar spine motion, load, and stiffness. J Strength Cond Res 2009;23(4):1148–1161. Miejsca: Results — Super Yoke Walk (s. 1157–1158: moment odwodzenia biodra ok. 112% siły odwodzicieli), Log Lift (s. 1159: jednoczesny wyprost pleców i biodra, ryc. 4), Discussion (s. 1160: boczne mięśnie tułowia — skośne i czworoboczny lędźwi — usztywniają tułów i unoszą miednicę przy noszeniu, ryc. 7) | streszczenie: https://pubmed.ncbi.nlm.nih.gov/19528856/ ; pełny tekst przeczytany z PDF w serwisie kliniki (instituteofmotion.com, plik „Trunk-Activation-Strong-Man.pdf”) | 3 (n = 3) | 02.11.2026 |
| SN-C2 | Paek S i in. (Korea) | Changes in Trunk Muscle Activity during Unilateral Weight Bearing and Abnormal Postural Gait in Healthy Individuals. Medicina 2022;58(12):1800. Miejsca: 3.2 (skośny zewnętrzny — przesunięcie aktywności na stronę przeciwną do ciężaru), Discussion („relatively higher on the opposite side of the weight-bearing limb”) | https://pmc.ncbi.nlm.nih.gov/articles/PMC9785953 | 3 | 02.11.2026 |
| SN-C3 | NSCA (Taylor J, Reed M) | Increase Hip and Trunk Stability with Loaded Carries… NSCA Coach 7.3, s. 52, „EMG Research” | https://www.nsca.com/contentassets/927868f8d4bb45f2ac4429631d558d83/coach-7.3.6-increase-hip-and-trunk-stability-with-loaded-carries-for-injury-prevention-rehabilitation-and-performance.pdf | 4 (pochodne — streszcza SN-C1 i drugą pracę McGilla; nie liczyć jako niezależne) | 02.11.2026 |
| SN-C4 | Bond Univ. (Hindle BR i in.) | The Biomechanics and Applications of Strongman Exercises: a Systematic Review. Sports Med Open 2019;5:49. Miejsca: Discussion → Static Lifting → Log Lift („greater rapid extension of the hip during the second pull phase”); Discussion → Tire Flip (potrójny wyprost); Discussion → Bilateral Load Carriage (mało analiz jarzma). Opublikowano korektę (10.1186/s40798-020-0239-3) — nieprzeczytana | https://pmc.ncbi.nlm.nih.gov/articles/PMC6901656 | 2 | 02.11.2026 (do 100 000 znaku strony) |
| SN-C5 | Decker AD i in. | A Comparative Biomechanical Analysis of the Farmers and Zercher Carry Exercises. Int J Strength Cond 2026;6(1). Miejsce: Results → EMG, tab. 1 (s. 5) | https://journal.iusca.org/index.php/Journal/article/view/566 | 3 | 02.11.2026 |

Sprawdzone, nie użyte: abstrakt konferencyjny o mięśniach kończyny górnej w spacerze farmera (Int J Exerc Sci Conf Proc 15(7), art. 23; https://digitalcommons.wku.edu/ijesab/vol15/iss7/23) — tylko streszczenie, bez czworobocznego.

## Otwarte

- [OTWARTE] Skośne w noszeniu obustronnym (Farmer's Walk ×3) — drugie niezależne źródło o roli.
- [OTWARTE] Górna część pleców w noszeniu (Farmer's Walk ×3, Front Rack) — drugie źródło o noszeniu (jest SN-C5).
- [OTWARTE] Brzuch w noszeniu (wszystkie) — źródła niezgodne co do wielkości aktywności, brak źródła roli.
- [OTWARTE] Barki w Overhead Carry — brak przeczytanego badania/opisu ćwiczenia.
- [OTWARTE] Rickshaw Carry — brak źródła.
- [OTWARTE] Katalog: `abs: 1` w Double Kettlebell Front Rack Carry vs SN-C3 (niska aktywność tułowia w noszeniu z przodu) — przeczytać źródło pierwotne (McGill i in., noszenie „racked” i „bottoms-up”).
