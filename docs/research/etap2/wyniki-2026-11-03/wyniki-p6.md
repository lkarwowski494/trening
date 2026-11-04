# p6: partia 6 (1–5) i uzupełnienie 2 (nr 1–5), wyszukiwanie bez Gemini (03.11.2026)

Reguła: etap 2 (CLAUDE.md „Merytoryczne podstawy”, właściciel 03.11.2026). Setup i move potrzebują 2 niezależnych źródeł; szczebel 5 wystarczy i daje oznaczenie „praktyka”. Mis pochodzi ze źródeł albo jest wnioskiem z ruchu. Liczby (powtórzenia, czasy, kąty, kalorie) i twierdzenia o zdrowiu pominąłem.
Strony aplikacji liczę jako szczebel 5 (`docs/18-przekazanie.md:201`). Szczeble przypisałem według `szczeble-organizacji-2026-11-02.md` (Physitrack ma tam szczebel 5, wiersz 73). Fedb liczy się najwyżej jako 1 źródło. Bodybuilding.com jest pierwowzorem tekstu fedb, więc go nie liczę.
Cytaty z fedb pobrałem przez WebFetch pytaniem o dosłowne zdania krótsze niż 120 znaków (narzędzie nie zwraca całego JSON). Cytaty z innych stron to dosłowne fragmenty zwrócone przez narzędzie na pytanie o tekst dokładny.
Wszystkie pozycje mają stan **„otwarte”**: czekają na recenzję niezależną (L-047) i na porównanie z rysunkiem. Szczegóły, zdania PL/EN i cytaty są w `wyniki-p6.json`.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone (setup / move) | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 6.1 | Treadmill Walking | komplet; mis z 2 źródeł | True Fitness (sz. 4, producent bieżni); fedb | 1 / 4 |
| 6.2 | Weighted Ball Hyperextension | komplet (setup to część wspólna); mis z 1 źródła | fedb; weighttraining.guide (M. Livelo) | 1 / 3 |
| 6.3 | Weighted Ball Side Bend | komplet (setup to część wspólna); mis z 1 źródła i wniosek | fedb; weighttraining.guide (E. Lord); Jefit 251 | 1 / 5 |
| 6.4 | Weighted Sit-Ups - With Bands | komplet move; setup to część wspólna (**sprzeczność miejsca zaczepienia taśm**); mis: wniosek | fedb; Trainwell | 1 / 3 |
| 6.5 | Wide-Grip Decline Barbell Pullover | komplet; mis z 1 źródła i wniosek | fedb; Jefit 168; Motra | 1 / 4 |
| U2.1 | Dynamic Back Stretch | komplet setup i move (need) | fedb; Brian Mackenzie (brianmac.co.uk) | 1 / 2 |
| U2.2 | Fast Skipping | move komplet; setup **część wspólna, słaba** („wyprostowany, rozluźniony”) | fedb; Outright Workout Library | 1 / 2 |
| U2.3 | Barbell Incline Shoulder Raise | komplet setup i move; mis: wniosek z 2 opisów | fedb; Jefit 369 | 1 / 3 |
| U2.4 | Cable Judo Flip | **częściowo**: Jefit 786 ma zdania bliskie fedb, więc niezależność jest niepewna; mis: wniosek | fedb; Jefit 786 (?) | 1 / 4 |
| U2.5 | Chest Stretch on Stability Ball | komplet setup i move; mis: wniosek z ruchu | fedb; Physitrack (sz. 5); Jefit 840 | 1 / 3 |

Komplet: 9 (z tego 6.4 i U2.2 z zastrzeżeniem w setup). Częściowo: 1 (U2.4). Jedno źródło: 0. Brak: 0.
Koszt łącznie: 10 wyszukań i 33 odczyty stron (z odczytami fedb), czyli średnio 1 wyszukanie i 3,3 strony na ćwiczenie.
Szczebel 4 w parze ma tylko pozycja 6.1. Pozostałe są na poziomie „praktyka”.

## Rozbieżności do recenzji (nie weszły do zdań)
- **6.2 Weighted Ball Hyperextension:** fedb trzyma talerz pod brodą albo za karkiem i ma palce stóp na podłodze. Weighttraining.guide trzyma go za głową albo przy klatce (ręce skrzyżowane) i opiera stopy o ścianę. W zdaniu jest część wspólna: talerz za głową albo przy klatce, stopy na podłodze. Ściana nie weszła.
- **6.3 Weighted Ball Side Bend:** fedb trzyma talerz jedną ręką przy boku głowy, a drugą rękę kładzie na boku brzucha. Jefit: jedna ręka z talerzem przy głowie, druga na klatce. Weighttraining.guide: obie ręce na głowie albo za nią. W zdaniu jest tylko „talerz przy głowie”. Fedb ma też skrzyżowane nogi, czego nie podaje nikt inny.
- **6.4 Weighted Sit-Ups - With Bands:** fedb zaczepia taśmy u podstawy ławki skośnej, a uchwyty są przy obojczykach. Trainwell zaczepia taśmę do „top end” ławki, czyli tam, gdzie są zablokowane stopy. Taśma od strony stóp raczej pomagałaby w ruchu, zamiast mu przeszkadzać. Miejsce zaczepienia nie weszło do zdania. Recenzent porówna je z rysunkiem. Fitwill (band decline sit-up) ma taśmę na plecach, czyli inną odmianę, i jej nie czytałem (wcześniej 403).
- **6.5 Wide-Grip Decline Barbell Pullover:** fedb każe trzymać ręce całkiem wyprostowane. Motra pisze o lekkim ugięciu łokci i błędzie „Locking elbows”. Jefit chwyta sztangę bardzo szeroko, przy talerzach. W zdaniach są tylko „ręce proste” (bez „zablokowane”) i „chwyt szeroki”. Motra opuszcza sztangę do poziomu podłogi, tak jak fedb. Układ zdań Motry może być oparty na fedb (por. p4a, nr 4), ale do kompletu wystarczą fedb i Jefit.
- **U2.2 Fast Skipping:** fedb i Outright opisują **niskie**, szybkie podskoki z krótkim czasem w powietrzu („Popping too high” to błąd). Opis odmiany w zleceniu („quick skips with high knees”) zakłada wysokie kolana. To sprzeczność z obydwoma źródłami. Recenzent musi porównać to z rysunkiem. Health-os to prawdopodobnie kopia fedb (gemini-1-r2), więc jej nie liczę.
- **U2.4 Cable Judo Flip:** Jefit 786 ma te same elementy w tej samej kolejności i podobne zdania co fedb („Turn your body away from the machine as you bring the rope over your shoulder as if you were performing a judo flip”). Fitness Volt (Ash, ACE, MSc, 06.12.2024) opisuje inną odmianę: pojedynczy uchwyt i obrót **w stronę** maszyny. Nie liczę go. Lyfta nie podaje wysokości bloczka ani liny i opisuje inny chwyt, więc też go nie liczę.
- **U2.5 Chest Stretch on Stability Ball:** fedb kładzie na piłce łokieć, Physitrack przedramię, a Jefit tylko „rękę”. W zdaniu jest „łokieć albo przedramię”, tak jak w opisie odmiany.

## Otwarte pytania
- [OTWARTE] U2.4 Cable Judo Flip: czy Jefit 786 liczy się jako niezależne źródło? Jeśli nie, pozycja ma 1 źródło. W tym wyszukaniu nie było innego opisu liny na dolnym bloczku z ruchem przez bark.
- [OTWARTE] 6.4: gdzie zaczepiona jest taśma (u podstawy ławki czy przy stopach)? Rozstrzyga recenzent na podstawie rysunku.
- [OTWARTE] U2.2: niskie podskoki (źródła) czy wysokie kolana (opis w zleceniu)?
- [OTWARTE] Szczebel brianmac.co.uk (Brian Mackenzie, trener lekkoatletyki, 2003): nie ma go w pliku szczebli, więc wpisałem 5.
