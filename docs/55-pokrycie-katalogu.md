# 55. Pokrycie katalogu ćwiczeń (generowane — nie edytować ręcznie)

Wygenerowano z runtime aplikacji poleceniem `node scripts/pokrycie-katalogu.mjs --write` (te same moduły co ekran karty ćwiczenia i eksport strony). Decyzja właściciela 28.10.2026 (M-B): katalog ma być
regularnie powiększany do pełnego — licznik jest generowany z kodu, zapadka `tests/pokrycie-katalogu.test.ts` (część `npm run verify`) nie pozwala, by „dobre” liczby spadły poniżej `tests/fixtures/pokrycie-katalogu-min.json`
(obniżka tylko świadomie, z polem `powod`; podniesienie po fali prac: `node scripts/pokrycie-katalogu.mjs --podnies-minimum`), a lista kontrolna wydania (`docs/39`) wymaga celu wersji z sekcji „Cele”. Dane ćwiczeń, figur i tekstów skrypt tylko liczy.

**Pełna karta** = wskazówki (własne albo zrecenzowany zestaw ogólny wzorca ruchu — Z3, 31.10.2026) + częste błędy (tekst) + figura v2 w aplikacji + animowany błąd + role mięśni. **Komplet tekstów w języku** = wszystkie zdania karty (wskazówki, animowane błędy, role mięśni) są w słowniku tego języka;
angielski tekst zastępczy nie liczy się jako przekład.

## Sumy

Ćwiczeń w katalogu: **708**.

| Co | Ćwiczeń | Udział |
|---|---:|---:|
| Figura v2 w aplikacji (rodzina gotowa) | 132 | 18,6% |
| Figura v1 w aplikacji (bez v2) | 48 | 6,8% |
| Bez figury w aplikacji | 528 | 74,6% |
| — z czego: dane póz v2 są, rodzina jeszcze niewłączona | 401 | 56,6% |
| — z czego: wyjątek bez animacji (brak źródła techniki, powód w danych) | 94 | 13,3% |
| Animowany błąd | 85 | 12% |
| Własne wskazówki (źródłowe) | 163 | 23% |
| — z czego z częstymi błędami | 72 | 10,2% |
| Zestaw ogólny wskazówek wzorca ruchu | 68 | 9,6% |
| Bez tekstu wskazówek | 477 | 67,4% |
| Częste błędy (własne albo zestaw ogólny) | 140 | 19,8% |
| Role mięśni | 508 | 71,8% |
| **Pełna karta** | 83 | 11,7% |
| Figura z aktualną recenzją ruchu (bramka 4) | 132 | 18,6% |

## Cele wersji

Źródło: `docs/research/pokrycie-cele.json`. Krok listy kontrolnej wydania (`docs/39`): cel wersji osiągnięty albo zgoda właściciela z datą; sprawdzenie: `node scripts/pokrycie-katalogu.mjs --cel <wersja>`.

### Wersja 1.1 — potwierdzony przez właściciela 31.10.2026 (decyzja 2 = A, docs/18); pełna karta liczona wg definicji Z3 (ZB-025 a, wdrożona 01.11.2026) — liczba 17 z definicji sprzed Z3 zostaje podłogą do decyzji właściciela

Cel startowy 1.1 = stan bieżący na dzień wprowadzenia licznika (28.10.2026, integracja-1-1 @ 55ba40cb); wartości docelowe ustali właściciel (ma być więcej niż stan bieżący — katalog jest powiększany do pełnego). 31.10.2026 (scalenie wersja-1-0-1-r2): 33 liczb kompletu kart języków podniesione 524 → 525 do minimum zapadki (przekład bp.elbowsMid z 1.0.1) — nadal cel startowy, liczby docelowe w decyzji 2 właściciela. 01.11.2026 (ZB-025 a): pełna karta liczona wg Z3 (wskazówki własne albo zrecenzowany zestaw ogólny + częste błędy tekst + figura v2 + animowany błąd + role mięśni); symulacja stanu docelowego (4 rodziny z recenzją ruchu, wszystkie 538 zestawów ogólnych zrecenzowanych) daje pełną kartę 90 (stara definicja: 17), więc cel 17 jest spójny (nie za wysoki), ale po Z3 nie jest już wartością oczekiwaną — podniesienie celu (np. do 90) wymaga decyzji właściciela. 02.11.2026 (wpis v2 pull_up i 7 zestawów ogólnych rodziny po próbnej partii recenzji): liczby celu niższe od minimum zapadki podniesione do minimum (jak 31.10.2026) — nadal cel startowy, bez zmiany decyzji 2. 02.11.2026 (P0 integracji): cele figura.zDanymiV2, roleMiesni i komplet tekstów karty w 33 językach obniżone o 1 (532 → 531, 536 → 535, 509 → 508) — ukrycie Wide-Grip Pulldown Behind The Neck zmniejszyło katalog do 708 (decyzja właściciela 02.11.2026); nie jest to spadek jakości. 04.11.2026 (scalenie przekładu P1 i P2, koordynator): 33 liczb kompletu kart języków podniesionych do minimum zapadki — nadal cel startowy, liczby docelowe w decyzji właściciela.

Cel osiągnięty: **nie** (41 z 47 liczb).

| Metryka | Cel | Stan | Brakuje |
|---|---:|---:|---:|
| ćwiczenia z danymi figury v2 (włączonymi albo nie) | 535 | 533 | 2 |
| animowany błąd | 92 | 85 | 7 |
| wskazówki (własne lub zestaw ogólny) | 640 | 231 | 409 |
| częste błędy (tekst) | 557 | 140 | 417 |
| komplet tekstów karty: pl | 671 | 571 | 100 |
| komplet tekstów karty: en | 671 | 571 | 100 |

## Rodziny ruchu

| Rodzina | Stan | Ćwiczeń | Figura v2 | Dane v2 (niewłączone) | Figura v1 | Własne wsk. | Zestaw ogólny | Bez tekstu | Pełne karty | Recenzja |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `core_floor` | do zrobienia | 44 | 0 | 21 | 2 | 4 | 0 | 40 | 0 | 0 |
| `delt_raise` | do zrobienia | 38 | 0 | 30 | 3 | 5 | 0 | 33 | 0 | 0 |
| `curl` | gotowa | 36 | 34 | 0 | 0 | 6 | 28 | 2 | 32 | 34 |
| `mobility_stand` | do zrobienia | 36 | 0 | 8 | 0 | 10 | 0 | 26 | 0 | 0 |
| `hinge` | gotowa | 32 | 32 | 0 | 0 | 7 | 11 | 14 | 17 | 32 |
| `triceps` | do zrobienia | 32 | 0 | 29 | 4 | 4 | 0 | 28 | 0 | 0 |
| `bench_press` | gotowa | 30 | 30 | 0 | 0 | 1 | 19 | 10 | 18 | 30 |
| `pushup_plank` | do zrobienia | 30 | 0 | 17 | 4 | 7 | 0 | 23 | 0 | 0 |
| `plyo` | do zrobienia | 28 | 0 | 27 | 0 | 6 | 0 | 22 | 0 | 0 |
| `olympic` | do zrobienia | 25 | 0 | 23 | 0 | 21 | 0 | 4 | 0 | 0 |
| `squat` | gotowa | 25 | 25 | 0 | 0 | 5 | 4 | 16 | 8 | 25 |
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
| `pull_up` | gotowa | 13 | 11 | 0 | 0 | 3 | 6 | 4 | 8 | 11 |
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

Kart z tekstami (wskazówki albo role mięśni): **571**. „Komplet” = karta ma wszystkie teksty w słowniku języka (bez angielskiego zastępczego). Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie poza polskim) — 0.

| Język | Kart kompletnych | Kart z brakiem | Brakujących tekstów | Nazwy lokalne |
|---|---:|---:|---:|---:|
| pl | 571 | 0 | 0 | 0 |
| en | 571 | 0 | 0 | 0 |
| cs | 571 | 0 | 0 | 0 |
| sk | 571 | 0 | 0 | 0 |
| hu | 571 | 0 | 0 | 0 |
| ro | 571 | 0 | 0 | 0 |
| bg | 571 | 0 | 0 | 0 |
| hr | 571 | 0 | 0 | 0 |
| sl | 571 | 0 | 0 | 0 |
| sr | 571 | 0 | 0 | 0 |
| lt | 571 | 0 | 0 | 0 |
| lv | 571 | 0 | 0 | 0 |
| et | 571 | 0 | 0 | 0 |
| uk | 571 | 0 | 0 | 0 |
| es | 571 | 0 | 0 | 0 |
| es-419 | 571 | 0 | 0 | 0 |
| pt | 571 | 0 | 0 | 0 |
| pt-BR | 571 | 0 | 0 | 0 |
| de | 571 | 0 | 0 | 0 |
| fr | 571 | 0 | 0 | 0 |
| it | 571 | 0 | 0 | 0 |
| nl | 571 | 0 | 0 | 0 |
| sv | 571 | 0 | 0 | 0 |
| da | 571 | 0 | 0 | 0 |
| nb | 571 | 0 | 0 | 0 |
| fi | 571 | 0 | 0 | 0 |
| tr | 571 | 0 | 0 | 0 |
| el | 571 | 0 | 0 | 0 |
| id | 571 | 0 | 0 | 0 |
| ms | 571 | 0 | 0 | 0 |
| vi | 571 | 0 | 0 | 0 |
| ru | 571 | 0 | 0 | 0 |
| ja | 571 | 0 | 0 | 0 |
| ko | 571 | 0 | 0 | 0 |
| zh-Hant | 571 | 0 | 0 | 0 |

## Ćwiczenia najbliżej pełnej karty

Pełnych kart: 83. Poniżej ćwiczenia, którym brakuje jednego elementu (grupy dłuższe niż 25 — tylko liczba).

- Brakuje tylko: animowany błąd — 1: JM Press
- Brakuje tylko: role mięśni — 1: Scapular Pull-Up

| Brakujących elementów pełnej karty | Ćwiczeń |
|---:|---:|
| 0 | 83 |
| 1 | 2 |
| 2 | 40 |
| 3 | 113 |
| 4 | 327 |
| 5 | 143 |
