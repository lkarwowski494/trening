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
| Figura v2 w aplikacji (rodzina gotowa) | 214 | 30,2% |
| Figura v1 w aplikacji (bez v2) | 41 | 5,8% |
| Bez figury w aplikacji | 453 | 64% |
| — z czego: dane póz v2 są, rodzina jeszcze niewłączona | 322 | 45,5% |
| — z czego: wyjątek bez animacji (brak źródła techniki, powód w danych) | 109 | 15,4% |
| Animowany błąd | 132 | 18,6% |
| Własne wskazówki (źródłowe) | 215 | 30,4% |
| — z czego z częstymi błędami | 112 | 15,8% |
| Zestaw ogólny wskazówek wzorca ruchu | 113 | 16% |
| Bez tekstu wskazówek | 380 | 53,7% |
| Częste błędy (własne albo zestaw ogólny) | 225 | 31,8% |
| Role mięśni | 510 | 72% |
| **Pełna karta** | 209 | 29,5% |
| **Pełna karta + błąd** | 130 | 18,4% |
| Figura z aktualną recenzją ruchu (bramka 4) | 214 | 30,2% |

## Cele wersji

Źródło: `docs/research/pokrycie-cele.json`. Krok listy kontrolnej wydania (`docs/39`): cel wersji osiągnięty albo zgoda właściciela z datą; sprawdzenie: `node scripts/pokrycie-katalogu.mjs --cel <wersja>`.

### Wersja 1.1 — potwierdzony przez właściciela 31.10.2026 (decyzja 2 = A, docs/18); od 08.11.2026 cel pelnaKarta (standard 1 wg decyzji 02.11.2026 ~15:30) policzony z danych: 465

Cel startowy 1.1 = stan bieżący na dzień wprowadzenia licznika (28.10.2026, integracja-1-1 @ 55ba40cb); wartości docelowe ustali właściciel (ma być więcej niż stan bieżący — katalog jest powiększany do pełnego). 31.10.2026 (scalenie wersja-1-0-1-r2): 33 liczb kompletu kart języków podniesione 524 → 525 do minimum zapadki (przekład bp.elbowsMid z 1.0.1) — nadal cel startowy, liczby docelowe w decyzji 2 właściciela. 01.11.2026 (ZB-025 a): pełna karta liczona wg Z3 (wskazówki własne albo zrecenzowany zestaw ogólny + częste błędy tekst + figura v2 + animowany błąd + role mięśni); symulacja stanu docelowego (4 rodziny z recenzją ruchu, wszystkie 538 zestawów ogólnych zrecenzowanych) daje pełną kartę 90 (stara definicja: 17), więc cel 17 jest spójny (nie za wysoki), ale po Z3 nie jest już wartością oczekiwaną — podniesienie celu (np. do 90) wymaga decyzji właściciela. 02.11.2026 (wpis v2 pull_up i 7 zestawów ogólnych rodziny po próbnej partii recenzji): liczby celu niższe od minimum zapadki podniesione do minimum (jak 31.10.2026) — nadal cel startowy, bez zmiany decyzji 2. 02.11.2026 (P0 integracji): cele figura.zDanymiV2, roleMiesni i komplet tekstów karty w 33 językach obniżone o 1 (532 → 531, 536 → 535, 509 → 508) — ukrycie Wide-Grip Pulldown Behind The Neck zmniejszyło katalog do 708 (decyzja właściciela 02.11.2026); nie jest to spadek jakości. 04.11.2026 (scalenie przekładu P1 i P2, koordynator): 33 liczb kompletu kart języków podniesionych do minimum zapadki — nadal cel startowy, liczby docelowe w decyzji właściciela. 04.11.2026 (T1, przekład API 52 zdań kart delt_raise): 33 liczb kompletu kart języków podniesione do 572 (stan po przekładzie) — nadal cel startowy. 08.11.2026 (Z0, C-1/C-2; decyzja właściciela 02.11.2026 ~15:30 „dwa standardy publikacji”, ~17:00 „pełna karta dla każdego ćwiczenia, dla którego mamy dane” + lista obowiązkowych, 04.11.2026 (4) B mobilność bez ról): pelnaKarta = standard 1 (wskazówki + figura v2 + role mięśni; mobilność bez ról), cel pelnaKarta 465 = 452 ćwiczeń z danymi póz v2 i rolami mięśni albo mobilnością (bez 2 wstrzymanych w V2_WSTRZYMANE) + 13 spośród 51 obowiązkowych (docs/research/pokrycie-1-1-obowiazkowe.json), których ten warunek nie obejmuje (9 bez danych póz: Inverted Row, Nordic Curl, Side Plank, Sissy Squat, Calf Press (leg press), Ab Wheel, Cable Crunch, Meadows Row, Handstand Push Up; 4 z danymi, ale bez ról mięśni: Dead Bug, Hollow Hold, Bird Dog, Medicine Ball Slam — role i pozy dochodzą w D-7); stan w chwili ustalenia: 179 w standardzie 1, 125 w standardzie 2. Pozostałe liczby bez zmian (cel startowy).

Cel osiągnięty: **nie** (42 z 47 liczb).

| Metryka | Cel | Stan | Brakuje |
|---|---:|---:|---:|
| wskazówki (własne lub zestaw ogólny) | 640 | 328 | 312 |
| częste błędy (tekst) | 557 | 225 | 332 |
| pełna karta | 465 | 209 | 256 |
| komplet tekstów karty: pl | 671 | 573 | 98 |
| komplet tekstów karty: en | 671 | 573 | 98 |

## Rodziny ruchu

| Rodzina | Stan | Ćwiczeń | Figura v2 | Dane v2 (niewłączone) | Figura v1 | Własne wsk. | Zestaw ogólny | Bez tekstu | Pełne karty | Recenzja |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `core_floor` | do zrobienia | 44 | 0 | 21 | 2 | 4 | 0 | 40 | 0 | 0 |
| `delt_raise` | gotowa | 38 | 31 | 0 | 0 | 31 | 3 | 4 | 30 | 31 |
| `curl` | gotowa | 36 | 34 | 0 | 0 | 6 | 28 | 2 | 34 | 34 |
| `mobility_stand` | do zrobienia | 36 | 0 | 8 | 0 | 10 | 0 | 26 | 0 | 0 |
| `hinge` | gotowa | 32 | 32 | 0 | 0 | 7 | 25 | 0 | 32 | 32 |
| `triceps` | gotowa | 32 | 29 | 0 | 0 | 26 | 3 | 3 | 29 | 29 |
| `bench_press` | gotowa | 30 | 30 | 0 | 0 | 5 | 25 | 0 | 30 | 30 |
| `pushup_plank` | do zrobienia | 30 | 0 | 18 | 4 | 7 | 0 | 23 | 0 | 0 |
| `plyo` | do zrobienia | 28 | 0 | 27 | 0 | 6 | 0 | 22 | 0 | 0 |
| `olympic` | gotowa | 25 | 22 | 2 | 0 | 21 | 1 | 3 | 21 | 22 |
| `squat` | gotowa | 25 | 25 | 0 | 0 | 5 | 20 | 0 | 24 | 25 |
| `lunge` | do zrobienia | 24 | 0 | 24 | 6 | 6 | 0 | 18 | 0 | 0 |
| `overhead_press` | do zrobienia | 23 | 0 | 21 | 5 | 5 | 0 | 18 | 0 | 0 |
| `mobility_floor` | do zrobienia | 22 | 0 | 9 | 0 | 9 | 0 | 13 | 0 | 0 |
| `chest_fly` | do zrobienia | 20 | 0 | 17 | 0 | 2 | 0 | 18 | 0 | 0 |
| `core_standing` | do zrobienia | 19 | 0 | 16 | 0 | 2 | 0 | 17 | 0 | 0 |
| `sled_throw` | do zrobienia | 19 | 0 | 8 | 0 | 6 | 0 | 13 | 0 | 0 |
| `kb_ballistic` | do zrobienia | 17 | 0 | 16 | 1 | 4 | 0 | 13 | 0 | 0 |
| `cardio` | do zrobienia | 16 | 0 | 0 | 1 | 5 | 0 | 11 | 0 | 0 |
| `leg_isolation` | do zrobienia | 14 | 0 | 8 | 1 | 4 | 0 | 10 | 0 | 0 |
| `calf_raise` | do zrobienia | 13 | 0 | 12 | 2 | 3 | 0 | 10 | 0 | 0 |
| `forearm` | do zrobienia | 13 | 0 | 11 | 0 | 0 | 0 | 13 | 0 | 0 |
| `pull_up` | gotowa | 13 | 11 | 0 | 0 | 3 | 8 | 2 | 9 | 11 |
| `row` | do zrobienia | 13 | 0 | 12 | 6 | 6 | 0 | 7 | 0 | 0 |
| `hip_bridge` | do zrobienia | 11 | 0 | 10 | 3 | 3 | 0 | 8 | 0 | 0 |
| `cable_row` | do zrobienia | 10 | 0 | 9 | 3 | 3 | 0 | 7 | 0 | 0 |
| `foam_roll` | do zrobienia | 10 | 0 | 0 | 0 | 8 | 0 | 2 | 0 | 0 |
| `strongman` | do zrobienia | 10 | 0 | 1 | 0 | 0 | 0 | 10 | 0 | 0 |
| `hip_abd_add` | do zrobienia | 8 | 0 | 6 | 0 | 0 | 0 | 8 | 0 | 0 |
| `leg_machine` | do zrobienia | 8 | 0 | 6 | 2 | 2 | 0 | 6 | 0 | 0 |
| `rotator_cuff` | do zrobienia | 8 | 0 | 7 | 0 | 3 | 0 | 5 | 0 | 0 |
| `shrug` | do zrobienia | 8 | 0 | 8 | 2 | 2 | 0 | 6 | 0 | 0 |
| `carry` | do zrobienia | 7 | 0 | 7 | 0 | 2 | 0 | 5 | 0 | 0 |
| `glute_floor` | do zrobienia | 7 | 0 | 7 | 0 | 0 | 0 | 7 | 0 | 0 |
| `pulldown` | do zrobienia | 7 | 0 | 7 | 1 | 2 | 0 | 5 | 0 | 0 |
| `chest_press_machine` | do zrobienia | 5 | 0 | 5 | 1 | 2 | 0 | 3 | 0 | 0 |
| `dip` | do zrobienia | 5 | 0 | 5 | 1 | 1 | 0 | 4 | 0 | 0 |
| `neck` | do zrobienia | 5 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 |
| `back_extension` | do zrobienia | 4 | 0 | 3 | 0 | 1 | 0 | 3 | 0 | 0 |
| `cable_press` | do zrobienia | 4 | 0 | 4 | 0 | 1 | 0 | 3 | 0 | 0 |
| `core_hang` | do zrobienia | 4 | 0 | 3 | 0 | 0 | 0 | 4 | 0 | 0 |
| `thruster` | do zrobienia | 3 | 0 | 3 | 0 | 2 | 0 | 1 | 0 | 0 |
| `kneeling_hinge` | do zrobienia | 2 | 0 | 1 | 0 | 0 | 0 | 2 | 0 | 0 |

## Języki

Kart z tekstami (wskazówki albo role mięśni): **573**. „Komplet” = karta ma wszystkie teksty w słowniku języka (bez angielskiego zastępczego). Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie poza polskim) — 0.

| Język | Kart kompletnych | Kart z brakiem | Brakujących tekstów | Nazwy lokalne |
|---|---:|---:|---:|---:|
| pl | 573 | 0 | 0 | 0 |
| en | 573 | 0 | 0 | 0 |
| cs | 573 | 0 | 0 | 0 |
| sk | 573 | 0 | 0 | 0 |
| hu | 573 | 0 | 0 | 0 |
| ro | 573 | 0 | 0 | 0 |
| bg | 573 | 0 | 0 | 0 |
| hr | 573 | 0 | 0 | 0 |
| sl | 573 | 0 | 0 | 0 |
| sr | 573 | 0 | 0 | 0 |
| lt | 573 | 0 | 0 | 0 |
| lv | 573 | 0 | 0 | 0 |
| et | 573 | 0 | 0 | 0 |
| uk | 573 | 0 | 0 | 0 |
| es | 573 | 0 | 0 | 0 |
| es-419 | 573 | 0 | 0 | 0 |
| pt | 573 | 0 | 0 | 0 |
| pt-BR | 573 | 0 | 0 | 0 |
| de | 573 | 0 | 0 | 0 |
| fr | 573 | 0 | 0 | 0 |
| it | 573 | 0 | 0 | 0 |
| nl | 573 | 0 | 0 | 0 |
| sv | 573 | 0 | 0 | 0 |
| da | 573 | 0 | 0 | 0 |
| nb | 573 | 0 | 0 | 0 |
| fi | 573 | 0 | 0 | 0 |
| tr | 573 | 0 | 0 | 0 |
| el | 573 | 0 | 0 | 0 |
| id | 573 | 0 | 0 | 0 |
| ms | 573 | 0 | 0 | 0 |
| vi | 573 | 0 | 0 | 0 |
| ru | 573 | 0 | 0 | 0 |
| ja | 573 | 0 | 0 | 0 |
| ko | 573 | 0 | 0 | 0 |
| zh-Hant | 573 | 0 | 0 | 0 |

## Ćwiczenia najbliżej pełnej karty

Pełnych kart: 209 (z błędem: 130). Poniżej ćwiczenia, którym brakuje jednego elementu pełnej karty (grupy dłuższe niż 25 — tylko liczba).

- Brakuje tylko: wskazówki (własne albo zrecenzowany zestaw ogólny) — 1: Front Incline Dumbbell Raise
- Brakuje tylko: figura v2 w aplikacji — 89
- Brakuje tylko: role mięśni — 4: Dead Hang, Jerk Balance, Scapular Pull-Up, Wall Sit

| Brakujących elementów pełnej karty | Ćwiczeń |
|---:|---:|
| 0 | 209 |
| 1 | 94 |
| 2 | 305 |
| 3 | 100 |
