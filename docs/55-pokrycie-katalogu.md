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
| Figura v2 w aplikacji (rodzina gotowa) | 98 | 13,8% |
| Figura v1 w aplikacji (bez v2) | 53 | 7,5% |
| Bez figury w aplikacji | 558 | 78,7% |
| — z czego: dane póz v2 są, rodzina jeszcze niewłączona | 438 | 61,8% |
| — z czego: wyjątek bez animacji (brak źródła techniki, powód w danych) | 29 | 4,1% |
| Animowany błąd | 92 | 13% |
| Własne wskazówki (źródłowe) | 102 | 14,4% |
| — z czego z częstymi błędami | 43 | 6,1% |
| Zestaw ogólny wskazówek wzorca ruchu | 538 | 75,9% |
| Bez tekstu wskazówek | 69 | 9,7% |
| Częste błędy (własne albo zestaw ogólny) | 557 | 78,6% |
| Role mięśni | 509 | 71,8% |
| **Pełna karta** | 17 | 2,4% |
| Figura z aktualną recenzją ruchu (bramka 4) | 0 | 0% |

## Cele wersji

Źródło: `docs/research/pokrycie-cele.json`. Krok listy kontrolnej wydania (`docs/39`): cel wersji osiągnięty albo zgoda właściciela z datą; sprawdzenie: `node scripts/pokrycie-katalogu.mjs --cel <wersja>`.

### Wersja 1.1 — do potwierdzenia przez właściciela

Cel startowy 1.1 = stan bieżący na dzień wprowadzenia licznika (28.10.2026, integracja-1-1 @ 55ba40cb); wartości docelowe ustali właściciel (ma być więcej niż stan bieżący — katalog jest powiększany do pełnego).

Cel osiągnięty: **tak** (47 z 47 liczb).

Wszystkie liczby celu są osiągnięte.

## Rodziny ruchu

| Rodzina | Stan | Ćwiczeń | Figura v2 | Dane v2 (niewłączone) | Figura v1 | Własne wsk. | Zestaw ogólny | Bez tekstu | Pełne karty | Recenzja |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `core_floor` | do zrobienia | 44 | 0 | 21 | 2 | 4 | 32 | 8 | 0 | 0 |
| `delt_raise` | do zrobienia | 38 | 0 | 30 | 3 | 5 | 29 | 4 | 0 | 0 |
| `curl` | do zrobienia | 36 | 0 | 36 | 5 | 6 | 30 | 0 | 0 | 0 |
| `mobility_stand` | do zrobienia | 36 | 0 | 8 | 0 | 0 | 36 | 0 | 0 | 0 |
| `hinge` | gotowa | 32 | 32 | 0 | 0 | 7 | 25 | 0 | 6 | 0 |
| `triceps` | do zrobienia | 32 | 0 | 29 | 4 | 4 | 25 | 3 | 0 | 0 |
| `bench_press` | gotowa | 30 | 30 | 0 | 0 | 5 | 25 | 0 | 4 | 0 |
| `pushup_plank` | do zrobienia | 30 | 0 | 17 | 4 | 7 | 23 | 0 | 0 | 0 |
| `plyo` | do zrobienia | 28 | 0 | 27 | 0 | 1 | 26 | 1 | 0 | 0 |
| `olympic` | do zrobienia | 25 | 0 | 23 | 0 | 0 | 23 | 2 | 0 | 0 |
| `squat` | gotowa | 25 | 25 | 0 | 0 | 5 | 20 | 0 | 4 | 0 |
| `lunge` | do zrobienia | 24 | 0 | 24 | 6 | 6 | 18 | 0 | 0 | 0 |
| `overhead_press` | do zrobienia | 23 | 0 | 21 | 5 | 5 | 16 | 2 | 0 | 0 |
| `mobility_floor` | do zrobienia | 22 | 0 | 9 | 0 | 0 | 21 | 1 | 0 | 0 |
| `chest_fly` | do zrobienia | 20 | 0 | 17 | 0 | 2 | 15 | 3 | 0 | 0 |
| `core_standing` | do zrobienia | 19 | 0 | 16 | 0 | 2 | 13 | 4 | 0 | 0 |
| `sled_throw` | do zrobienia | 19 | 0 | 8 | 0 | 1 | 9 | 9 | 0 | 0 |
| `kb_ballistic` | do zrobienia | 17 | 0 | 16 | 1 | 1 | 15 | 1 | 0 | 0 |
| `cardio` | do zrobienia | 16 | 0 | 0 | 1 | 5 | 8 | 3 | 0 | 0 |
| `leg_isolation` | do zrobienia | 14 | 0 | 8 | 1 | 4 | 8 | 2 | 0 | 0 |
| `calf_raise` | do zrobienia | 13 | 0 | 12 | 2 | 3 | 9 | 1 | 0 | 0 |
| `forearm` | do zrobienia | 13 | 0 | 11 | 0 | 0 | 9 | 4 | 0 | 0 |
| `pull_up` | gotowa | 13 | 11 | 0 | 0 | 3 | 8 | 2 | 3 | 0 |
| `row` | do zrobienia | 13 | 0 | 12 | 6 | 6 | 7 | 0 | 0 | 0 |
| `hip_bridge` | do zrobienia | 11 | 0 | 10 | 3 | 3 | 7 | 1 | 0 | 0 |
| `cable_row` | do zrobienia | 10 | 0 | 9 | 3 | 3 | 6 | 1 | 0 | 0 |
| `foam_roll` | do zrobienia | 10 | 0 | 0 | 0 | 0 | 10 | 0 | 0 | 0 |
| `strongman` | do zrobienia | 10 | 0 | 1 | 0 | 0 | 2 | 8 | 0 | 0 |
| `hip_abd_add` | do zrobienia | 8 | 0 | 6 | 0 | 0 | 7 | 1 | 0 | 0 |
| `leg_machine` | do zrobienia | 8 | 0 | 6 | 2 | 3 | 5 | 0 | 0 | 0 |
| `pulldown` | do zrobienia | 8 | 0 | 8 | 1 | 2 | 6 | 0 | 0 | 0 |
| `rotator_cuff` | do zrobienia | 8 | 0 | 7 | 0 | 0 | 7 | 1 | 0 | 0 |
| `shrug` | do zrobienia | 8 | 0 | 8 | 2 | 2 | 6 | 0 | 0 | 0 |
| `carry` | do zrobienia | 7 | 0 | 7 | 0 | 2 | 5 | 0 | 0 | 0 |
| `glute_floor` | do zrobienia | 7 | 0 | 7 | 0 | 0 | 7 | 0 | 0 | 0 |
| `chest_press_machine` | do zrobienia | 5 | 0 | 5 | 1 | 2 | 3 | 0 | 0 | 0 |
| `dip` | do zrobienia | 5 | 0 | 5 | 1 | 1 | 4 | 0 | 0 | 0 |
| `neck` | do zrobienia | 5 | 0 | 0 | 0 | 0 | 0 | 5 | 0 | 0 |
| `back_extension` | do zrobienia | 4 | 0 | 3 | 0 | 1 | 3 | 0 | 0 | 0 |
| `cable_press` | do zrobienia | 4 | 0 | 4 | 0 | 1 | 3 | 0 | 0 | 0 |
| `core_hang` | do zrobienia | 4 | 0 | 3 | 0 | 0 | 3 | 1 | 0 | 0 |
| `thruster` | do zrobienia | 3 | 0 | 3 | 0 | 0 | 3 | 0 | 0 | 0 |
| `kneeling_hinge` | do zrobienia | 2 | 0 | 1 | 0 | 0 | 1 | 1 | 0 | 0 |

## Języki

Kart z tekstami (wskazówki albo role mięśni): **671**. „Komplet” = karta ma wszystkie teksty w słowniku języka (bez angielskiego zastępczego). Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie poza polskim) — 0.

| Język | Kart kompletnych | Kart z brakiem | Brakujących tekstów | Nazwy lokalne |
|---|---:|---:|---:|---:|
| pl | 671 | 0 | 0 | 0 |
| en | 671 | 0 | 0 | 0 |
| cs | 449 | 222 | 574 | 0 |
| sk | 449 | 222 | 574 | 0 |
| hu | 449 | 222 | 574 | 0 |
| ro | 449 | 222 | 574 | 0 |
| bg | 449 | 222 | 574 | 0 |
| hr | 449 | 222 | 574 | 0 |
| sl | 449 | 222 | 574 | 0 |
| sr | 449 | 222 | 574 | 0 |
| lt | 449 | 222 | 574 | 0 |
| lv | 449 | 222 | 574 | 0 |
| et | 449 | 222 | 574 | 0 |
| uk | 449 | 222 | 574 | 0 |
| es | 449 | 222 | 574 | 0 |
| es-419 | 449 | 222 | 574 | 0 |
| pt | 449 | 222 | 574 | 0 |
| pt-BR | 449 | 222 | 574 | 0 |
| de | 449 | 222 | 574 | 0 |
| fr | 449 | 222 | 574 | 0 |
| it | 449 | 222 | 574 | 0 |
| nl | 449 | 222 | 574 | 0 |
| sv | 449 | 222 | 574 | 0 |
| da | 449 | 222 | 574 | 0 |
| nb | 449 | 222 | 574 | 0 |
| fi | 449 | 222 | 574 | 0 |
| tr | 449 | 222 | 574 | 0 |
| el | 449 | 222 | 574 | 0 |
| id | 449 | 222 | 574 | 0 |
| ms | 449 | 222 | 574 | 0 |
| vi | 449 | 222 | 574 | 0 |
| ru | 449 | 222 | 574 | 0 |
| ja | 449 | 222 | 574 | 0 |
| ko | 449 | 222 | 574 | 0 |
| zh-Hant | 449 | 222 | 574 | 0 |

## Ćwiczenia najbliżej pełnej karty

Pełnych kart: 17. Poniżej ćwiczenia, którym brakuje jednego elementu (grupy dłuższe niż 25 — tylko liczba).

- Brak ćwiczeń z jednym brakującym elementem.

| Brakujących elementów pełnej karty | Ćwiczeń |
|---:|---:|
| 0 | 17 |
| 1 | 0 |
| 2 | 97 |
| 3 | 56 |
| 4 | 356 |
| 5 | 183 |
