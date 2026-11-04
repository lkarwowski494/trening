# Partia 4, ćwiczenia 1–10 — wyszukiwanie bez Gemini (03.11.2026)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move muszą mieć 2 niezależne źródła (szczebel 5 wystarczy, oznaczenie „praktyka”). Mis może pochodzić ze źródeł albo być wnioskiem z ruchu. Liczby i zdrowie są pominięte.
Strony aplikacji dopuszczam jako szczebel 5 (`docs/18-przekazanie.md:201`). Nazwy firm są tylko w tym pliku. Szczeble ustalam według `szczeble-organizacji-2026-11-02.md`. Fedb ma szczebel 5 i liczy się najwyżej jako 1 źródło; jego kopie się nie liczą.
Odmiany sprawdziłem w `docs/research/equipment/catalog.json` (wiersze są w JSON). We wcześniejszych wynikach (A/B/C/D-calosc, etap3, ksiazki) wszystkie 10 pozycji miało stan „brak” albo „1–2 z 3”. Nic stamtąd nie przeniosłem jako źródło liczone.
Pozycje oparte na szczeblu 5 mają stan „otwarte”, czyli czekają na recenzję niezależną (L-047). Szczegóły i cytaty są w `wyniki-p4a.json`.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone (setup / move) | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 1 | Rowing Machine | komplet (mis: wniosek z 2 opisów) | Concept2 (sz. 4, producent ergometru); fedb | 1 / 6 |
| 2 | Runner's Stretch | komplet (setup to część wspólna; mis z 1 źródła) | fedb; Yogapedia | 2 / 9 |
| 3 | Sandbag Load | komplet (mis z 1 źródła) | fedb; Fitness Volt (bez autora, sz. 5) | 1 / 4 |
| 4 | Seated Close-Grip Concentration Barbell Curl | **częściowo**: drugie źródło ma niepewną niezależność | fedb; Motra (kroki ułożone jak w fedb) | 2 / 5 |
| 5 | Seated Flat Bench Leg Pull-In | komplet (mis: wniosek z ruchu) | fedb; weighttraining.guide (E. Lord) | 1 / 4 |
| 6 | Seated Good Mornings | komplet (setup to część wspólna; mis z 2 źródeł) | Catalyst Athletics (sz. 4); fedb; FlabFix | 1 / 4 |
| 7 | See-Saw Press (Alternating Side Press) | komplet (mis z 1 źródła i wniosek) | fedb; exercise.com | 1 / 4 |
| 8 | Shoulder Circles | komplet (mis z 2 źródeł jako zaprzeczenie standardu) | HealthLink BC (sz. 4); UMass Memorial / WebMD Ignite; fedb | 1 / 3 |
| 9 | Side Jackknife | komplet (setup to część wspólna; mis z 1 źródła) | Fitness Volt (P. Dale, PT); exercise.com. Fedb nie ma tekstu | 1 / 3 |
| 10 | Side Lying Groin Stretch | **1 źródło** (fedb), stan otwarte | inne strony to kopie fedb | 2 / 2 |

Komplet: 8. Częściowo: 1 (nr 4). Jedno źródło: 1 (nr 10). Brak: 0.
Koszt łącznie: 13 wyszukań i 44 odczyty stron (z odczytami fedb), czyli średnio 1,3 wyszukania i 4,4 strony na ćwiczenie.
Pozycje ze szczeblem 4 w parze to 1, 6 i 8. Pozostałe pozycje z kompletem są na poziomie „praktyka”.

## Rozbieżności do recenzji (nie weszły do zdań)
- **Runner's Stretch:** fedb ma prostą tylną nogę. Yogapedia nie podaje, czy tylne kolano leży na ziemi. Endurance Magazine (S. Rountree) kładzie tylne kolano i cofa biodra, co jest inną odmianą. Recenzent musi porównać to z rysunkiem. Fitness Volt „runners-stretch-alternatives” jest kopią tekstu fedb.
- **Seated Close-Grip Concentration Curl:** Motra opisuje gryf EZ. Katalog dopuszcza sztangę prostą albo EZ. Zdania Motry są inne niż w fedb, ale kolejność kroków i wskazówek jest ta sama (pauza na górze, wydech, powolne opuszczanie). Koordynator musi zdecydować, czy to drugie źródło.
- **Seated Good Mornings:** fedb opisuje skrzynię w klatce i zdjęcie sztangi z wieszaków. Catalyst opisuje siad okrakiem na ławce, a FlabFix siad na brzegu ławki. Do zdania weszła część wspólna („ławka albo skrzynia”).
- **See-Saw Press:** fedb ustawia dłonie do siebie i obraca nadgarstek, a exercise.com każe stać w lekkim wykroku. Żadnego z tych szczegółów nie ma w zdaniach. Jefit ma układ jak fedb, więc go nie liczę.
- **Shoulder Circles:** partia A zapisała rozbieżność z potreningu.pl (sz. 5), który radzi unikać krążeń w barkach podczas rozgrzewki. To ogólna opinia, a nie opis tego ćwiczenia, więc ocenia ją recenzent. Szczebel UMass/WebMD Ignite: tabela główna wymaga daty, której strona nie ma. Uzupełnienie 2 uznaje szpital za szczebel 4 i daty nie wymaga. Komplet nie zależy od tego rozstrzygnięcia, bo jest HealthLink BC.
- **Side Jackknife:** dolna ręka jest w różnych miejscach (przed sobą albo na brzuchu), więc pominąłem ją w zdaniu. Fitness Volt (P. Dale) ma autora z kwalifikacjami i datę, ale nie ma nazwanego recenzenta. Szczebel 4 warunkowo, do potwierdzenia. W JSON wpisałem 5.

## Otwarte pytania
- [OTWARTE] Side Lying Groin Stretch: brak drugiego niezależnego opisu. Strony kliniczne pokazują inne ćwiczenie (wzmacnianie przywodzicieli leżąc na boku).
- [OTWARTE] Seated Close-Grip Concentration Barbell Curl: czy Motra liczy się jako niezależne źródło? Alternatywa to wariant sprzętu koncentrycznego uginania z hantlą jako „uproszczenie”. Wymaga to recenzenta, bo tu obie ręce trzymają jeden gryf.
- [OTWARTE] Runner's Stretch: czy rysunek ma prostą tylną nogę, jak w fedb?
- Nieczytelne strony: British Rowing (403); insideindoor.com (przekierowanie do insideindoor.britishrowing.org, nieczytane); clubs.britishrowing.org (host poza siecią sesji; trzeba go dopuścić w ustawieniach sieci); fitwill (403); grindergym (przekierowanie na inną domenę).
