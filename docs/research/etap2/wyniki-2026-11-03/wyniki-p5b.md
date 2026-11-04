# Partia 5, ćwiczenia 11–20 – wyszukiwanie bez Gemini (03.11.2026, p5b)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move potrzebują 2 niezależnych źródeł (szczebel 5 wystarczy, oznaczenie „praktyka”). Mis może pochodzić ze źródeł albo być wnioskiem z ruchu. Liczby i zdrowie są pominięte.
Strony aplikacji dopuszczam jako szczebel 5 (`docs/18-przekazanie.md:201`). Nazwy firm są tylko w tym pliku. Szczeble ustalam według `szczeble-organizacji-2026-11-02.md`. Fedb ma szczebel 5 i liczy się najwyżej jako 1 źródło; jego kopie się nie liczą (Bodybuilding.com, Jefit /799/).
Odmiany sprawdziłem w `docs/research/equipment/catalog.json` (wiersze są w JSON). Wcześniejsze wyniki (A, B, D) miały dla tych 10 pozycji stan „brak” albo „1 z 3”. Nic stamtąd nie przeniosłem jako źródło liczone.
Wszystkie pozycje mają stan „otwarte”, czyli czekają na recenzję niezależną (L-047). Szczegóły i cytaty są w `wyniki-p5b.json`.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone (setup / move) | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 11 | Standing Barbell Rollout | **częściowo**: move komplet (część wspólna), setup rozbieżny (1 źródło dla wersji ze stania); mis z 2 źródeł | fedb; Lyfta | 3 / 8 |
| 12 | Standing Elevated Quad Stretch | komplet (move łączy fragmenty 2 źródeł; mis fedb + exercise.com o niepewnej niezależności) | fedb; Sole Shaping (trener z certyfikatem) | 1 / 3 |
| 13 | Standing Inner-Biceps Curl | komplet (mis z 2 źródeł) | fedb; Lyfta; Motra (układ jak fedb) | 1 / 4 |
| 14 | Standing Pelvic Tilt | komplet (setup to część wspólna; mis z 2 źródeł) | fedb; Physitrack; Lyfta tylko do mis | 1 / 3 |
| 15 | Standing Rope Crunch | komplet (setup to część wspólna; mis z 1 źródła i wniosek) | fedb; Fitness and Power | 1 / 3 |
| 16 | Straight Raises on Incline Bench | komplet (move to część wspólna; mis z 1 źródła i wniosek) | fedb; Motra | 1 / 3 |
| 17 | Supine One-Arm Overhead Throw | **1 źródło** (fedb), otwarte | Jefit /799/ to układ fedb | 1 / 3 |
| 18 | Supine Two-Arm Overhead Throw | komplet (mis: zaprzeczenie standardu z 1 źródła i wniosek) | fedb; Physitrack | 1 / 3 |
| 19 | Toe Touchers | komplet (mis z 2 źródeł) | fedb; weighttraining.guide (E. Lord); The Gym Group | 1 / 3 |
| 20 | Torso Rotation | komplet (mis z 1 źródła sz. 4 i wniosek) | ACE (sz. 4, wariant z wyprostowanymi rękami); fedb | 1 / 2 |

Komplet: 8. Częściowo: 1 (nr 11). Jedno źródło: 1 (nr 17). Brak: 0.
Koszt łącznie: 12 wyszukań i 35 odczytów stron (z odczytami fedb), czyli średnio 1,2 wyszukania i 3,5 strony na ćwiczenie.
Pozycja ze szczeblem 4 w parze to tylko nr 20. Pozostałe komplety są na poziomie „praktyka”.

## Rozbieżności do recenzji (nie weszły do zdań)
- **Standing Barbell Rollout:** fedb („Barbell Ab Rollout”) zaczyna w podporze jak do pompki i toczy gryf w stronę stóp. Lyfta zaczyna ze skłonu w staniu i toczy gryf w przód. Tor jest ten sam, ale punkt startu inny. Setup wersji ze stania ma tylko Lyftę, dlatego zdanie setup ma znacznik [OTWARTE]. Fitness Volt (Ash, ACE, MSc) i Generation Iron (T. Ramos, ACSM CPT) wymieniają wersję ze stania tylko jednym zdaniem.
- **Standing Elevated Quad Stretch:** zdanie move łączy ugięte kolano (fedb) z biodrami w przód i uniesioną klatką (tylko Sole Shaping). Recenzent ocenia, czy to dopuszczalne, czy skrócić zdanie do części wspólnej. exercise.com ma te same kroki co fedb, więc jego niezależność jest niepewna.
- **Standing Inner-Biceps Curl:** note katalogu (:16396) mówi o dłoniach obróconych na zewnątrz i hantlach idących na boki. Motra i Lyfta trzymają łokcie przy tułowiu, a Motra wymienia „Flaring elbows outward” jako błąd. Fedb ma tylko wskazówkę o przedramionach w linii z bocznym aktonem barku. Recenzent porównuje z rysunkiem; być może trzeba poprawić note katalogu.
- **Standing Pelvic Tilt:** fedb kończy przytrzymaniem podwiniętej kości ogonowej, a Physitrack opisuje ruch w obie strony. Lyfta ma niespójne kroki, więc wzięła tylko udział w mis.
- **Standing Rope Crunch:** fedb trzyma linkę przy górnej części klatki, a Fitness and Power – dłonie za głową. Do zdania weszło „przy głowie, nad barkami”.
- **Straight Raises on Incline Bench:** fedb unosi gryf przed głowę z prostymi łokciami. Motra unosi do poziomu ramion z lekko ugiętymi łokciami i wymienia „Raising too high” jako błąd. Do zdania weszła część wspólna.
- **Supine Two-Arm Overhead Throw:** fedb mówi o rzucie „na maksymalną odległość”; do zdania tego nie wpisałem.
- **Torso Rotation:** ACE ma podstawową wersję z piłką przy klatce, a wyprostowane ręce jako trudniejszy wariant. Fitness Volt według wyszukiwarki opisuje siad na piłce (nie czytałem). Fedb używa piłki gimnastycznej, ACE – lekarskiej; katalog dopuszcza obie.

## Otwarte pytania
- [OTWARTE] Supine One-Arm Overhead Throw: brak drugiego niezależnego opisu. Opcja do decyzji koordynatora: wersja oburącz (nr 18) jako nazwane „uproszczenie”. Wymaga potwierdzenia recenzenta, bo rzut jedną ręką różni się chwytem i torem ręki.
- [OTWARTE] Standing Barbell Rollout: drugi opis ustawienia w wersji ze stania. Strony, które mogą go mieć, były niedostępne (Fitwill 0103 i 2826, Fitbod – 403).
- Nieczytelne strony: ExRx Plyometrics/MBSitUpWall (403), Muscle & Strength (403), Fitwill (403), Fitbod (403), Elitefts Swiss bar incline front raise (404).
