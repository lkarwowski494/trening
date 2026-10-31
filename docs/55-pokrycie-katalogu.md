# 55. Pokrycie katalogu ćwiczeń (generowane — nie edytować ręcznie)

Wygenerowano z runtime aplikacji poleceniem `node scripts/pokrycie-katalogu.mjs --write` (te same moduły co ekran karty ćwiczenia i eksport strony). Decyzja właściciela 28.10.2026 (M-B): katalog ma być
regularnie powiększany do pełnego — licznik jest generowany z kodu, zapadka `tests/pokrycie-katalogu.test.ts` (część `npm run verify`) nie pozwala, by „dobre” liczby spadły poniżej `tests/fixtures/pokrycie-katalogu-min.json`
(obniżka tylko świadomie, z polem `powod`; podniesienie po fali prac: `node scripts/pokrycie-katalogu.mjs --podnies-minimum`), a lista kontrolna wydania (`docs/39`) wymaga celu wersji z sekcji „Cele”. Dane ćwiczeń, figur i tekstów skrypt tylko liczy.

**Pełna karta** = własne wskazówki (źródłowe, nie zestaw ogólny) + częste błędy + figura v2 w aplikacji + animowany błąd + role mięśni. **Komplet tekstów w języku** = wszystkie zdania karty (wskazówki, animowane błędy, role mięśni) są w słowniku tego języka;
angielski tekst zastępczy nie liczy się jako przekład.

## Sumy

Ćwiczeń w katalogu: **709**.

| Co | Ćwiczeń | Udział |
|---|---:|---:|
| Figura v2 w aplikacji (rodzina gotowa) | 0 | 0% |
| Figura v1 w aplikacji (bez v2) | 52 | 7,3% |
| Bez figury w aplikacji | 657 | 92,7% |
| — z czego: dane póz v2 są, rodzina jeszcze niewłączona | 449 | 63,3% |
| — z czego: wyjątek bez animacji (brak źródła techniki, powód w danych) | 35 | 4,9% |
| Animowany błąd | 0 | 0% |
| Własne wskazówki (źródłowe) | 97 | 13,7% |
| — z czego z częstymi błędami | 36 | 5,1% |
| Zestaw ogólny wskazówek wzorca ruchu | 0 | 0% |
| Bez tekstu wskazówek | 612 | 86,3% |
| Częste błędy (własne albo zestaw ogólny) | 36 | 5,1% |
| Role mięśni | 509 | 71,8% |
| **Pełna karta** | 0 | 0% |
| Figura z aktualną recenzją ruchu (bramka 4) | 0 | 0% |

## Cele wersji

Źródło: `docs/research/pokrycie-cele.json`. Krok listy kontrolnej wydania (`docs/39`): cel wersji osiągnięty albo zgoda właściciela z datą; sprawdzenie: `node scripts/pokrycie-katalogu.mjs --cel <wersja>`.

### Wersja 1.1 — potwierdzony przez właściciela 31.10.2026 (decyzja 2 = A, docs/18); pełna karta — po zmianie definicji (Z3, ZB-025)

Cel startowy 1.1 = stan bieżący na dzień wprowadzenia licznika (28.10.2026, integracja-1-1 @ 55ba40cb); wartości docelowe ustali właściciel (ma być więcej niż stan bieżący — katalog jest powiększany do pełnego). 31.10.2026 (scalenie wersja-1-0-1-r2): 33 liczb kompletu kart języków podniesione 524 → 525 do minimum zapadki (przekład bp.elbowsMid z 1.0.1) — nadal cel startowy, liczby docelowe w decyzji 2 właściciela.

Cel osiągnięty: **nie** (36 z 47 liczb).

| Metryka | Cel | Stan | Brakuje |
|---|---:|---:|---:|
| figura v2 w aplikacji | 98 | 0 | 98 |
| figura w aplikacji (v2 albo v1) | 151 | 52 | 99 |
| ćwiczenia z danymi figury v2 (włączonymi albo nie) | 536 | 449 | 87 |
| animowany błąd | 92 | 0 | 92 |
| własne wskazówki | 102 | 97 | 5 |
| własne wskazówki z częstymi błędami | 43 | 36 | 7 |
| wskazówki (własne lub zestaw ogólny) | 640 | 97 | 543 |
| częste błędy (tekst) | 557 | 36 | 521 |
| pełna karta | 17 | 0 | 17 |
| komplet tekstów karty: pl | 671 | 525 | 146 |
| komplet tekstów karty: en | 671 | 525 | 146 |

## Rodziny ruchu

| Rodzina | Stan | Ćwiczeń | Figura v2 | Dane v2 (niewłączone) | Figura v1 | Własne wsk. | Zestaw ogólny | Bez tekstu | Pełne karty | Recenzja |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `core_floor` | do zrobienia | 44 | 0 | 21 | 2 | 4 | 0 | 40 | 0 | 0 |
| `delt_raise` | do zrobienia | 38 | 0 | 30 | 3 | 5 | 0 | 33 | 0 | 0 |
| `curl` | do zrobienia | 36 | 0 | 36 | 5 | 6 | 0 | 30 | 0 | 0 |
| `mobility_stand` | do zrobienia | 36 | 0 | 8 | 0 | 0 | 0 | 36 | 0 | 0 |
| `hinge` | gotowa | 32 | 0 | 0 | 0 | 7 | 0 | 25 | 0 | 0 |
| `triceps` | do zrobienia | 32 | 0 | 29 | 3 | 3 | 0 | 29 | 0 | 0 |
| `bench_press` | gotowa | 30 | 0 | 0 | 0 | 5 | 0 | 25 | 0 | 0 |
| `pushup_plank` | do zrobienia | 30 | 0 | 17 | 4 | 7 | 0 | 23 | 0 | 0 |
| `plyo` | do zrobienia | 28 | 0 | 27 | 0 | 1 | 0 | 27 | 0 | 0 |
| `olympic` | do zrobienia | 25 | 0 | 23 | 0 | 0 | 0 | 25 | 0 | 0 |
| `squat` | gotowa | 25 | 0 | 0 | 0 | 5 | 0 | 20 | 0 | 0 |
| `lunge` | do zrobienia | 24 | 0 | 24 | 6 | 6 | 0 | 18 | 0 | 0 |
| `overhead_press` | do zrobienia | 23 | 0 | 21 | 5 | 5 | 0 | 18 | 0 | 0 |
| `mobility_floor` | do zrobienia | 22 | 0 | 9 | 0 | 0 | 0 | 22 | 0 | 0 |
| `chest_fly` | do zrobienia | 20 | 0 | 17 | 0 | 2 | 0 | 18 | 0 | 0 |
| `core_standing` | do zrobienia | 19 | 0 | 16 | 0 | 2 | 0 | 17 | 0 | 0 |
| `sled_throw` | do zrobienia | 19 | 0 | 8 | 0 | 1 | 0 | 18 | 0 | 0 |
| `kb_ballistic` | do zrobienia | 17 | 0 | 16 | 1 | 1 | 0 | 16 | 0 | 0 |
| `cardio` | do zrobienia | 16 | 0 | 0 | 1 | 5 | 0 | 11 | 0 | 0 |
| `leg_isolation` | do zrobienia | 14 | 0 | 8 | 1 | 4 | 0 | 10 | 0 | 0 |
| `calf_raise` | do zrobienia | 13 | 0 | 12 | 2 | 3 | 0 | 10 | 0 | 0 |
| `forearm` | do zrobienia | 13 | 0 | 11 | 0 | 0 | 0 | 13 | 0 | 0 |
| `pull_up` | gotowa | 13 | 0 | 11 | 3 | 3 | 0 | 10 | 0 | 0 |
| `row` | do zrobienia | 13 | 0 | 12 | 3 | 3 | 0 | 10 | 0 | 0 |
| `hip_bridge` | do zrobienia | 11 | 0 | 10 | 3 | 3 | 0 | 8 | 0 | 0 |
| `cable_row` | do zrobienia | 10 | 0 | 9 | 3 | 3 | 0 | 7 | 0 | 0 |
| `foam_roll` | do zrobienia | 10 | 0 | 0 | 0 | 0 | 0 | 10 | 0 | 0 |
| `strongman` | do zrobienia | 10 | 0 | 1 | 0 | 0 | 0 | 10 | 0 | 0 |
| `hip_abd_add` | do zrobienia | 8 | 0 | 6 | 0 | 0 | 0 | 8 | 0 | 0 |
| `leg_machine` | do zrobienia | 8 | 0 | 6 | 2 | 2 | 0 | 6 | 0 | 0 |
| `pulldown` | do zrobienia | 8 | 0 | 8 | 1 | 2 | 0 | 6 | 0 | 0 |
| `rotator_cuff` | do zrobienia | 8 | 0 | 7 | 0 | 0 | 0 | 8 | 0 | 0 |
| `shrug` | do zrobienia | 8 | 0 | 8 | 2 | 2 | 0 | 6 | 0 | 0 |
| `carry` | do zrobienia | 7 | 0 | 7 | 0 | 2 | 0 | 5 | 0 | 0 |
| `glute_floor` | do zrobienia | 7 | 0 | 7 | 0 | 0 | 0 | 7 | 0 | 0 |
| `chest_press_machine` | do zrobienia | 5 | 0 | 5 | 1 | 2 | 0 | 3 | 0 | 0 |
| `dip` | do zrobienia | 5 | 0 | 5 | 1 | 1 | 0 | 4 | 0 | 0 |
| `neck` | do zrobienia | 5 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 |
| `back_extension` | do zrobienia | 4 | 0 | 3 | 0 | 1 | 0 | 3 | 0 | 0 |
| `cable_press` | do zrobienia | 4 | 0 | 4 | 0 | 1 | 0 | 3 | 0 | 0 |
| `core_hang` | do zrobienia | 4 | 0 | 3 | 0 | 0 | 0 | 4 | 0 | 0 |
| `thruster` | do zrobienia | 3 | 0 | 3 | 0 | 0 | 0 | 3 | 0 | 0 |
| `kneeling_hinge` | do zrobienia | 2 | 0 | 1 | 0 | 0 | 0 | 2 | 0 | 0 |

## Języki

Kart z tekstami (wskazówki albo role mięśni): **525**. „Komplet” = karta ma wszystkie teksty w słowniku języka (bez angielskiego zastępczego). Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie poza polskim) — 0.

| Język | Kart kompletnych | Kart z brakiem | Brakujących tekstów | Nazwy lokalne |
|---|---:|---:|---:|---:|
| pl | 525 | 0 | 0 | 0 |
| en | 525 | 0 | 0 | 0 |
| cs | 525 | 0 | 0 | 0 |
| sk | 525 | 0 | 0 | 0 |
| hu | 525 | 0 | 0 | 0 |
| ro | 525 | 0 | 0 | 0 |
| bg | 525 | 0 | 0 | 0 |
| hr | 525 | 0 | 0 | 0 |
| sl | 525 | 0 | 0 | 0 |
| sr | 525 | 0 | 0 | 0 |
| lt | 525 | 0 | 0 | 0 |
| lv | 525 | 0 | 0 | 0 |
| et | 525 | 0 | 0 | 0 |
| uk | 525 | 0 | 0 | 0 |
| es | 525 | 0 | 0 | 0 |
| es-419 | 525 | 0 | 0 | 0 |
| pt | 525 | 0 | 0 | 0 |
| pt-BR | 525 | 0 | 0 | 0 |
| de | 525 | 0 | 0 | 0 |
| fr | 525 | 0 | 0 | 0 |
| it | 525 | 0 | 0 | 0 |
| nl | 525 | 0 | 0 | 0 |
| sv | 525 | 0 | 0 | 0 |
| da | 525 | 0 | 0 | 0 |
| nb | 525 | 0 | 0 | 0 |
| fi | 525 | 0 | 0 | 0 |
| tr | 525 | 0 | 0 | 0 |
| el | 525 | 0 | 0 | 0 |
| id | 525 | 0 | 0 | 0 |
| ms | 525 | 0 | 0 | 0 |
| vi | 525 | 0 | 0 | 0 |
| ru | 525 | 0 | 0 | 0 |
| ja | 525 | 0 | 0 | 0 |
| ko | 525 | 0 | 0 | 0 |
| zh-Hant | 525 | 0 | 0 | 0 |

## Ćwiczenia najbliżej pełnej karty

Pełnych kart: 0. Poniżej ćwiczenia, którym brakuje jednego elementu (grupy dłuższe niż 25 — tylko liczba).

- Brak ćwiczeń z jednym brakującym elementem.

| Brakujących elementów pełnej karty | Ćwiczeń |
|---:|---:|
| 0 | 0 |
| 1 | 0 |
| 2 | 32 |
| 3 | 54 |
| 4 | 438 |
| 5 | 185 |
