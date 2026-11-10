# 55. Pokrycie katalogu ćwiczeń (generowane — nie edytować ręcznie)

Wygenerowano z runtime aplikacji poleceniem `node scripts/pokrycie-katalogu.mjs --write` (te same moduły co ekran karty ćwiczenia i eksport strony). Decyzja właściciela 28.10.2026 (M-B): katalog ma być
regularnie powiększany do pełnego — licznik jest generowany z kodu, zapadka `tests/pokrycie-katalogu.test.ts` (część `npm run verify`) nie pozwala, by „dobre” liczby spadły poniżej `tests/fixtures/pokrycie-katalogu-min.json`
(obniżka tylko świadomie, z polem `powod`; podniesienie po fali prac: `node scripts/pokrycie-katalogu.mjs --podnies-minimum`), a lista kontrolna wydania (`docs/39`) wymaga celu wersji z sekcji „Cele”. Dane ćwiczeń, figur i tekstów skrypt tylko liczy.

Dwa standardy publikacji ćwiczenia (decyzja właściciela 02.11.2026 ~15:30): **Pełna karta** = wskazówki (własne albo zrecenzowany zestaw ogólny wzorca ruchu) + figura v2 w aplikacji + role mięśni; **Pełna karta + błąd** = pełna karta + częste błędy (tekst) + animowany błąd. Dla ćwiczeń mobilności (rozciąganie) pełna karta jest bez ról mięśni (04.11.2026). **Komplet tekstów w języku** = wszystkie zdania karty (wskazówki, animowane błędy, role mięśni) są w słowniku tego języka;
angielski tekst zastępczy nie liczy się jako przekład.

## Sumy

Ćwiczeń w katalogu: **708**.

| Co | Ćwiczeń | Udział |
|---|---:|---:|
| Figura v2 w aplikacji (rodzina gotowa) | 200 | 28,2% |
| Figura v1 w aplikacji (bez v2) | 31 | 4,4% |
| Bez figury w aplikacji | 477 | 67,4% |
| — z czego: dane póz v2 są, rodzina jeszcze niewłączona | 277 | 39,1% |
| — z czego: wyjątek bez animacji (brak źródła techniki, powód w danych) | 156 | 22% |
| Animowany błąd | 104 | 14,7% |
| Własne wskazówki (źródłowe) | 309 | 43,6% |
| — z czego z częstymi błędami | 197 | 27,8% |
| Zestaw ogólny wskazówek wzorca ruchu | 86 | 12,1% |
| Bez tekstu wskazówek | 313 | 44,2% |
| Częste błędy (własne albo zestaw ogólny) | 283 | 40% |
| Role mięśni | 513 | 72,5% |
| **Pełna karta** | 196 | 27,7% |
| **Pełna karta + błąd** | 102 | 14,4% |
| Figura z aktualną recenzją ruchu (bramka 4) | 200 | 28,2% |

## Cele wersji

Źródło: `docs/research/pokrycie-cele.json`. Krok listy kontrolnej wydania (`docs/39`): cel wersji osiągnięty albo zgoda właściciela z datą; sprawdzenie: `node scripts/pokrycie-katalogu.mjs --cel <wersja>`.

### Wersja 1.1 — potwierdzony przez właściciela 31.10.2026 (decyzja 2 = A, docs/18); od 09.11.2026 cel każdej metryki = stan końcowy linii 1.1 bez „ciężkich” (decyzja właściciela 09.11.2026, docs/18; symulacja scripts/pokrycie-symulacja.mjs): pelnaKarta 457 (8.11.2026 standard 1 wg decyzji 02.11.2026 ~15:30: 465, po przeniesieniu 9 ćwiczeń do 1.2 — 456)

Cel startowy 1.1 = stan bieżący na dzień wprowadzenia licznika (28.10.2026, integracja-1-1 @ 55ba40cb); wartości docelowe ustali właściciel (ma być więcej niż stan bieżący — katalog jest powiększany do pełnego). 31.10.2026 (scalenie wersja-1-0-1-r2): 33 liczb kompletu kart języków podniesione 524 → 525 do minimum zapadki (przekład bp.elbowsMid z 1.0.1) — nadal cel startowy, liczby docelowe w decyzji 2 właściciela. 01.11.2026 (ZB-025 a): pełna karta liczona wg Z3 (wskazówki własne albo zrecenzowany zestaw ogólny + częste błędy tekst + figura v2 + animowany błąd + role mięśni); symulacja stanu docelowego (4 rodziny z recenzją ruchu, wszystkie 538 zestawów ogólnych zrecenzowanych) daje pełną kartę 90 (stara definicja: 17), więc cel 17 jest spójny (nie za wysoki), ale po Z3 nie jest już wartością oczekiwaną — podniesienie celu (np. do 90) wymaga decyzji właściciela. 02.11.2026 (wpis v2 pull_up i 7 zestawów ogólnych rodziny po próbnej partii recenzji): liczby celu niższe od minimum zapadki podniesione do minimum (jak 31.10.2026) — nadal cel startowy, bez zmiany decyzji 2. 02.11.2026 (P0 integracji): cele figura.zDanymiV2, roleMiesni i komplet tekstów karty w 33 językach obniżone o 1 (532 → 531, 536 → 535, 509 → 508) — ukrycie Wide-Grip Pulldown Behind The Neck zmniejszyło katalog do 708 (decyzja właściciela 02.11.2026); nie jest to spadek jakości. 04.11.2026 (scalenie przekładu P1 i P2, koordynator): 33 liczb kompletu kart języków podniesionych do minimum zapadki — nadal cel startowy, liczby docelowe w decyzji właściciela. 04.11.2026 (T1, przekład API 52 zdań kart delt_raise): 33 liczb kompletu kart języków podniesione do 572 (stan po przekładzie) — nadal cel startowy. 08.11.2026 (Z0, C-1/C-2; decyzja właściciela 02.11.2026 ~15:30 „dwa standardy publikacji”, ~17:00 „pełna karta dla każdego ćwiczenia, dla którego mamy dane” + lista obowiązkowych, 04.11.2026 (4) B mobilność bez ról): pelnaKarta = standard 1 (wskazówki + figura v2 + role mięśni; mobilność bez ról), cel pelnaKarta 465 = 452 ćwiczeń z danymi póz v2 i rolami mięśni albo mobilnością (bez 2 wstrzymanych w V2_WSTRZYMANE) + 13 spośród 51 obowiązkowych (docs/research/pokrycie-1-1-obowiazkowe.json), których ten warunek nie obejmuje (9 bez danych póz: Inverted Row, Nordic Curl, Side Plank, Sissy Squat, Calf Press (leg press), Ab Wheel, Cable Crunch, Meadows Row, Handstand Push Up; 4 z danymi, ale bez ról mięśni: Dead Bug, Hollow Hold, Bird Dog, Medicine Ball Slam — role i pozy dochodzą w D-7); stan w chwili ustalenia: 179 w standardzie 1, 125 w standardzie 2. Pozostałe liczby bez zmian (cel startowy). 09.11.2026 (ZB-053, decyzja właściciela 09.11.2026, docs/18): 9 ćwiczeń bez danych póz wypada z celu 1.1 do 1.2 (lista `poza11`), zostają 4 bez ról mięśni; cel pelnaKarta 456 = 465 − 9 (liczba wynika z listy `poza11`, pilnuje tego test). 09.11.2026 (decyzja właściciela 09.11.2026, docs/18: „Obniżmy próg wyciągając z niego ciężkie.”): cel każdej metryki = wartość w symulowanym stanie końcowym, który nie wymaga nowych badań ani treści (scripts/pokrycie-symulacja.mjs; zgodność celu z symulacją pilnuje tests/cel-1-1-bez-ciezkich.test.ts) — (b) wszystkie rodziny z danymi póz v2 włączone i zrecenzowane (poza V2_WSTRZYMANE) z zestawami ogólnymi zrecenzowanymi, (a) wszystkie karty z tekstem w data/zrodla/cues.json odsłonięte i przetłumaczone w każdym języku, (c) role mięśni dla ćwiczeń, którym dziś brakuje tylko ról; cel nie jest niższy niż minimum zapadki. „Ciężkie” (poza celem, backlog 1.2): ćwiczenia bez tekstu wskazówek w źródłach i bez zestawu ogólnego, bez danych póz v2 albo wymagające nowego ruchu silnika. Zmiany celu (stare → nowe): figura.v2 98 → 533, figura.wAplikacji 151 → 535, animowanyBlad 92 → 264, wskazowki.wlasne 102 → 285, wskazowki.wlasneZBledami 43 → 176, wskazowki.zTekstem 640 → 572, czesteBledyTekst 557 → 451, roleMiesni 508 → 516, pelnaKarta 456 → 457, recenzjaFigur 98 → 533, jezyk.pl i jezyk.en 671 → 631, pozostałe języki 574 (es-419: 572) → 631; figura.zDanymiV2 535 i nazwaLokalna.razem 0 bez zmian. 09.11.2026 (koordynator, tryb nocny, wariant B, do weta właściciela): symulacja nie liczy kart z werdyktem „do poprawy” w figury-recenzja.json (karty; dziś Front Incline Dumbbell Raise i Barbell Incline Shoulder Raise) — pelnaKarta zostaje 457 (karta nie jest pełna do czasu poprawki fidr.move), a metryki zależne od karty własnej spadają o 2 (wskazowki.wlasne 285 → 283, wskazowki.wlasneZBledami 176 → 174, wskazowki.zTekstem 572 → 570, czesteBledyTekst 451 → 449, komplet kart każdego języka 631 → 630); figura.v2, figura.wAplikacji, figura.zDanymiV2 i recenzjaFigur rosną o 1 (rysunek Front Incline Dumbbell Raise po włączeniu delt_raise). Naprawa karty (wariant A) podniosłaby pelnaKarta do 458 — osobne zadanie. 09.11.2026 (lead partii 2, scalenie integracji): Machine Hip Thrust wstrzymany (V2_WSTRZYMANE, recenzja r1 hip_bridge — WYSOKIE prowadnica dźwigni) wypada ze stanu końcowego — figura.v2, figura.wAplikacji, recenzjaFigur, animowanyBlad, wskazowki.zTekstem, czesteBledyTekst i pelnaKarta niższe o 1 (wynik symulacji; wraca po poprawce prowadnicy, backlog docs/21). 09.11.2026 (scalenie integracji 34838fa6 — partia 2 — z partią 3, do weta koordynatora): symulacja na wspólnym stanie po wstrzymaniu Machine Hip Thrust (partia 2) i marszów z gumą Lateral Band Walk, Monster Walk (partia 3, P3-MARSZ w docs/21) — figura.v2 533 → 531, figura.wAplikacji 535 → 533, figura.zDanymiV2 536 → 534, animowanyBlad 263 → 262, wskazowki.zTekstem 569 → 568, czesteBledyTekst 448 → 447, roleMiesni 516 → 517, pelnaKarta 456 → 455, recenzjaFigur 533 → 531; pelnaKarta wraca o 1 po każdej z tych poprawek (ta sama symulacja).

Cel osiągnięty: **nie** (3 z 47 liczb).

| Metryka | Cel | Stan | Brakuje |
|---|---:|---:|---:|
| figura v2 w aplikacji | 531 | 200 | 331 |
| figura w aplikacji (v2 albo v1) | 533 | 231 | 302 |
| ćwiczenia z danymi figury v2 (włączonymi albo nie) | 534 | 477 | 57 |
| animowany błąd | 257 | 104 | 153 |
| wskazówki (własne lub zestaw ogólny) | 571 | 395 | 176 |
| częste błędy (tekst) | 447 | 283 | 164 |
| role mięśni | 517 | 513 | 4 |
| pełna karta | 455 | 196 | 259 |
| figura z aktualną recenzją ruchu | 531 | 200 | 331 |
| komplet tekstów karty: pl | 632 | 588 | 44 |
| komplet tekstów karty: en | 632 | 588 | 44 |
| komplet tekstów karty: cs | 632 | 588 | 44 |
| komplet tekstów karty: sk | 632 | 588 | 44 |
| komplet tekstów karty: hu | 632 | 588 | 44 |
| komplet tekstów karty: ro | 632 | 588 | 44 |
| komplet tekstów karty: bg | 632 | 588 | 44 |
| komplet tekstów karty: hr | 632 | 588 | 44 |
| komplet tekstów karty: sl | 632 | 588 | 44 |
| komplet tekstów karty: sr | 632 | 588 | 44 |
| komplet tekstów karty: lt | 632 | 588 | 44 |
| komplet tekstów karty: lv | 632 | 588 | 44 |
| komplet tekstów karty: et | 632 | 588 | 44 |
| komplet tekstów karty: uk | 632 | 588 | 44 |
| komplet tekstów karty: es | 632 | 588 | 44 |
| komplet tekstów karty: es-419 | 632 | 588 | 44 |
| komplet tekstów karty: pt | 632 | 588 | 44 |
| komplet tekstów karty: pt-BR | 632 | 588 | 44 |
| komplet tekstów karty: de | 632 | 588 | 44 |
| komplet tekstów karty: fr | 632 | 588 | 44 |
| komplet tekstów karty: it | 632 | 588 | 44 |
| komplet tekstów karty: nl | 632 | 588 | 44 |
| komplet tekstów karty: sv | 632 | 588 | 44 |
| komplet tekstów karty: da | 632 | 588 | 44 |
| komplet tekstów karty: nb | 632 | 588 | 44 |
| komplet tekstów karty: fi | 632 | 588 | 44 |
| komplet tekstów karty: tr | 632 | 588 | 44 |
| komplet tekstów karty: el | 632 | 588 | 44 |
| komplet tekstów karty: id | 632 | 588 | 44 |
| komplet tekstów karty: ms | 632 | 588 | 44 |
| komplet tekstów karty: vi | 632 | 588 | 44 |
| komplet tekstów karty: ru | 632 | 588 | 44 |
| komplet tekstów karty: ja | 632 | 588 | 44 |
| komplet tekstów karty: ko | 632 | 588 | 44 |
| komplet tekstów karty: zh-Hant | 632 | 588 | 44 |

## Rodziny ruchu

| Rodzina | Stan | Ćwiczeń | Figura v2 | Dane v2 (niewłączone) | Figura v1 | Własne wsk. | Zestaw ogólny | Bez tekstu | Pełne karty | Recenzja |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `core_floor` | do zrobienia | 44 | 0 | 21 | 2 | 15 | 0 | 29 | 0 | 0 |
| `delt_raise` | gotowa | 38 | 31 | 0 | 0 | 31 | 3 | 4 | 30 | 31 |
| `curl` | gotowa | 36 | 34 | 0 | 0 | 8 | 28 | 0 | 34 | 34 |
| `mobility_stand` | do zrobienia | 36 | 0 | 8 | 0 | 10 | 0 | 26 | 0 | 0 |
| `hinge` | gotowa | 32 | 0 | 0 | 0 | 10 | 0 | 22 | 0 | 0 |
| `triceps` | gotowa | 32 | 29 | 0 | 0 | 26 | 3 | 3 | 29 | 29 |
| `bench_press` | gotowa | 30 | 30 | 0 | 0 | 5 | 25 | 0 | 30 | 30 |
| `pushup_plank` | do zrobienia | 30 | 0 | 18 | 4 | 12 | 0 | 18 | 0 | 0 |
| `plyo` | do zrobienia | 28 | 0 | 27 | 0 | 8 | 0 | 20 | 0 | 0 |
| `olympic` | gotowa | 25 | 22 | 2 | 0 | 21 | 1 | 3 | 21 | 22 |
| `squat` | gotowa | 25 | 0 | 0 | 0 | 11 | 0 | 14 | 0 | 0 |
| `lunge` | do zrobienia | 24 | 0 | 24 | 6 | 12 | 0 | 12 | 0 | 0 |
| `overhead_press` | do zrobienia | 23 | 0 | 21 | 5 | 11 | 0 | 12 | 0 | 0 |
| `mobility_floor` | do zrobienia | 22 | 0 | 9 | 0 | 9 | 0 | 13 | 0 | 0 |
| `chest_fly` | do zrobienia | 20 | 0 | 17 | 0 | 3 | 0 | 17 | 0 | 0 |
| `core_standing` | do zrobienia | 19 | 0 | 16 | 0 | 6 | 0 | 13 | 0 | 0 |
| `sled_throw` | do zrobienia | 19 | 0 | 8 | 0 | 7 | 0 | 12 | 0 | 0 |
| `kb_ballistic` | do zrobienia | 17 | 0 | 16 | 1 | 9 | 0 | 8 | 0 | 0 |
| `cardio` | do zrobienia | 16 | 0 | 0 | 1 | 5 | 0 | 11 | 0 | 0 |
| `leg_isolation` | do zrobienia | 14 | 0 | 8 | 1 | 6 | 0 | 8 | 0 | 0 |
| `calf_raise` | do zrobienia | 13 | 0 | 12 | 2 | 11 | 0 | 2 | 0 | 0 |
| `forearm` | do zrobienia | 13 | 0 | 11 | 0 | 1 | 0 | 12 | 0 | 0 |
| `pull_up` | gotowa | 13 | 11 | 0 | 0 | 3 | 8 | 2 | 10 | 11 |
| `row` | do zrobienia | 13 | 0 | 12 | 6 | 8 | 0 | 5 | 0 | 0 |
| `hip_bridge` | gotowa | 11 | 9 | 1 | 0 | 6 | 3 | 2 | 9 | 9 |
| `cable_row` | gotowa | 10 | 9 | 0 | 0 | 5 | 4 | 1 | 9 | 9 |
| `foam_roll` | do zrobienia | 10 | 0 | 0 | 0 | 8 | 0 | 2 | 0 | 0 |
| `strongman` | do zrobienia | 10 | 0 | 1 | 0 | 1 | 0 | 9 | 0 | 0 |
| `hip_abd_add` | gotowa | 8 | 4 | 0 | 0 | 1 | 4 | 3 | 4 | 4 |
| `leg_machine` | gotowa | 8 | 6 | 0 | 1 | 4 | 3 | 1 | 6 | 6 |
| `rotator_cuff` | do zrobienia | 8 | 0 | 7 | 0 | 6 | 0 | 2 | 0 | 0 |
| `shrug` | gotowa | 8 | 8 | 0 | 0 | 5 | 3 | 0 | 7 | 8 |
| `carry` | do zrobienia | 7 | 0 | 7 | 0 | 2 | 0 | 5 | 0 | 0 |
| `glute_floor` | do zrobienia | 7 | 0 | 7 | 0 | 5 | 0 | 2 | 0 | 0 |
| `pulldown` | gotowa | 7 | 7 | 0 | 0 | 6 | 1 | 0 | 7 | 7 |
| `chest_press_machine` | do zrobienia | 5 | 0 | 5 | 1 | 2 | 0 | 3 | 0 | 0 |
| `dip` | do zrobienia | 5 | 0 | 5 | 1 | 2 | 0 | 3 | 0 | 0 |
| `neck` | do zrobienia | 5 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 |
| `back_extension` | do zrobienia | 4 | 0 | 3 | 0 | 1 | 0 | 3 | 0 | 0 |
| `cable_press` | do zrobienia | 4 | 0 | 4 | 0 | 2 | 0 | 2 | 0 | 0 |
| `core_hang` | do zrobienia | 4 | 0 | 3 | 0 | 3 | 0 | 1 | 0 | 0 |
| `thruster` | do zrobienia | 3 | 0 | 3 | 0 | 2 | 0 | 1 | 0 | 0 |
| `kneeling_hinge` | do zrobienia | 2 | 0 | 1 | 0 | 0 | 0 | 2 | 0 | 0 |

## Języki

Kart z tekstami (wskazówki albo role mięśni): **588**. „Komplet” = karta ma wszystkie teksty w słowniku języka (bez angielskiego zastępczego). Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie poza polskim) — 0.

| Język | Kart kompletnych | Kart z brakiem | Brakujących tekstów | Nazwy lokalne |
|---|---:|---:|---:|---:|
| pl | 588 | 0 | 0 | 0 |
| en | 588 | 0 | 0 | 0 |
| cs | 588 | 0 | 0 | 0 |
| sk | 588 | 0 | 0 | 0 |
| hu | 588 | 0 | 0 | 0 |
| ro | 588 | 0 | 0 | 0 |
| bg | 588 | 0 | 0 | 0 |
| hr | 588 | 0 | 0 | 0 |
| sl | 588 | 0 | 0 | 0 |
| sr | 588 | 0 | 0 | 0 |
| lt | 588 | 0 | 0 | 0 |
| lv | 588 | 0 | 0 | 0 |
| et | 588 | 0 | 0 | 0 |
| uk | 588 | 0 | 0 | 0 |
| es | 588 | 0 | 0 | 0 |
| es-419 | 588 | 0 | 0 | 0 |
| pt | 588 | 0 | 0 | 0 |
| pt-BR | 588 | 0 | 0 | 0 |
| de | 588 | 0 | 0 | 0 |
| fr | 588 | 0 | 0 | 0 |
| it | 588 | 0 | 0 | 0 |
| nl | 588 | 0 | 0 | 0 |
| sv | 588 | 0 | 0 | 0 |
| da | 588 | 0 | 0 | 0 |
| nb | 588 | 0 | 0 | 0 |
| fi | 588 | 0 | 0 | 0 |
| tr | 588 | 0 | 0 | 0 |
| el | 588 | 0 | 0 | 0 |
| id | 588 | 0 | 0 | 0 |
| ms | 588 | 0 | 0 | 0 |
| vi | 588 | 0 | 0 | 0 |
| ru | 588 | 0 | 0 | 0 |
| ja | 588 | 0 | 0 | 0 |
| ko | 588 | 0 | 0 | 0 |
| zh-Hant | 588 | 0 | 0 | 0 |

## Ćwiczenia najbliżej pełnej karty

Pełnych kart: 196 (z błędem: 102). Poniżej ćwiczenia, którym brakuje jednego elementu pełnej karty (grupy dłuższe niż 25 — tylko liczba).

- Brakuje tylko: wskazówki (własne albo zrecenzowany zestaw ogólny) — 1: Front Incline Dumbbell Raise
- Brakuje tylko: figura v2 w aplikacji — 155
- Brakuje tylko: role mięśni — 3: Jerk Balance, Middle Back Shrug, Scapular Pull-Up

| Brakujących elementów pełnej karty | Ćwiczeń |
|---:|---:|
| 0 | 196 |
| 1 | 159 |
| 2 | 270 |
| 3 | 83 |
