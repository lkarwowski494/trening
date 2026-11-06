# Uzupełnienie 2, ćwiczenia 6–13 — wyszukiwanie bez Gemini (uz2a, 03.11.2026)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move: 2 niezależne źródła (szczebel 5 wystarczy → „praktyka”); mis ze źródeł albo wniosek z ruchu. Bez liczb i twierdzeń o zdrowiu.
Szukałem tylko punktów z „need:” (`gemini-20/v3-uzupelnienie-2.txt`). Strony aplikacji = szczebel 5 (`docs/18-przekazanie.md:201`); szczeble wg `szczeble-organizacji-2026-11-02.md` (Fitness Volt bez nazwanego recenzenta → 5, jak w p4a; Physitrack → 5, wiersz 73). Fedb liczy się najwyżej raz; jego lustra (repstack.pages.dev, bodybuilding.com) i przeredagowania (exercise.com „lying-machine-squat”) nie.
Wszystkie pozycje mają stan „otwarte” — czekają na recenzję niezależną (L-047). Cytaty i miejsca: `wyniki-uz2a.json`.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone (setup / move) | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 6 | Downward Facing Balance | komplet (mis: wniosek z ruchu) | fedb; Jefit 843 „Stability Ball Balance” (własne brzmienie) | 1 / 3 |
| 7 | Dumbbell Lying Pronation | **częściowo**: 2 źródła, ale leżenie na boku, a katalog mówi „prone”; fedb to inny ruch | Fitness Volt (M. Magnante, ACE); weighttraining.guide (E. Lord) | 1 / 6 |
| 8 | Dumbbell Lying Supination | komplet (setup część wspólna; mis 1 źródło + wniosek) — z flagą fedb | weighttraining.guide (E. Lord); exercise.com | 1 / 5 |
| 9 | Incline Push-Up Reverse Grip | **1 źródło** (fedb) + kandydat „uproszczenie” | fedb; WorkoutLabs (sztanga przy podłodze) tylko warunkowo | 2 / 5 |
| 10 | Keg Load | komplet (setup część wspólna) | fedb (medley); Bearly Fit (pages.dev) | 2 / 5 |
| 11 | Kettlebell Pirate Ships | komplet (mis 1 źródło + wniosek) | fedb; Lift Manual | 1 / 4 |
| 12 | Lying Machine Squat | **częściowo**: część wspólna zgodna, mechanika maszyny różna | fedb; GMWD (blog sprzedawcy, Y. Royer) | 1 / 3 |
| 13 | Foot SMR (tylko setup) | komplet setup | Physitrack; Experience Life (K. Riley) | 1 / 2 |

Komplet: 5 (6, 8, 10, 11, 13). Częściowo: 2 (7, 12). Jedno źródło: 1 (9). Brak: 0.
Koszt łącznie: 10 wyszukań i 33 odczyty stron (z odczytami fedb i stronami 403/404), średnio 1,25 wyszukania i 4,1 strony na ćwiczenie. Poza tym 1 kontrolne pobranie fedb (Keg Load — potwierdzenie dosłownej frazy kroku 3; w JSON miejsce opisane jako „przez lustro”, ale fraza jest potwierdzona bezpośrednio na fedb).
Wszystkie komplety są na poziomie „praktyka” (szczebel 5); szczebla 4 w parze brak.

## Rozbieżności do recenzji (nie weszły do zdań)
- **Dumbbell Lying Pronation i Supination — najważniejsze.** Fedb (pole `fedb` w catalog.json:16755 i :16796) opisuje rotację zewnętrzną w stawie ramiennym: krok 4 „externally rotate your forearm so that the dumbbell is lifted forward/up” przy ramieniu uniesionym (pronation: leżenie przodem) albo przy tułowiu (supination: leżenie na boku). Note katalogu (:16781, :16823) i mięśnie (przedramiona) mówią o obrocie przedramienia. Jeśli rysunek pochodzi z fedb, pokazuje inny ruch niż karta. Fedb nie liczę jako źródła żadnej z tych pozycji. Do decyzji koordynatora: który ruch jest w aplikacji.
- **Dumbbell Lying Pronation:** oba czytelne źródła opisują leżenie na boku (FV: ramię na ławce przed sobą, przedramię poza krawędzią; wtg: ramię przy boku). Note katalogu: „Prone” (przodem). Fitwill 0347 (wg wyszukiwarki leżenie przodem) — 403. ACE (sz. 4) — klęk z łokciami na ławce, ten sam obrót przedramienia; liczyłby się tylko, gdyby recenzent uznał pozycję ciała za drugorzędną.
- **Dumbbell Lying Supination:** wtg — przedramię na biodrze; exercise.com — ramię przed sobą na ławce. Zdanie podaje część wspólną (leżenie na boku, ramię nieruchome).
- **Incline Push-Up Reverse Grip:** WorkoutLabs ma ten sam chwyt podchwytem i ruch, ale sztanga leży na podłodze (pompka prawie pozioma). Może wejść jako nazwane „uproszczenie” tylko po potwierdzeniu recenzenta.
- **Keg Load:** fedb opisuje medley (beczki w odległości od podestu, bieg z beczką), Bearly Fit — beczkę tuż przed podestem; note katalogu (:11667) obejmuje oba. Zdania pomijają dystans i bieg.
- **Kettlebell Pirate Ships:** wysokość łuku — fedb: do głowy; Lift Manual: do bioder lub klatki. Wysokość pominięta w zdaniu; recenzent porównuje z rysunkiem.
- **Lying Machine Squat:** fedb (krok 4 „make your whole body erect”) — rusza się ciało z oparciem przy nieruchomej platformie; GMWD — „Slowly lower the footplate toward your body”, rusza platforma (bliżej suwnicy leżąc). Zdania mówią tylko o części wspólnej (leżenie na plecach, wypchnięcie nogami). Recenzent: czy GMWD opisuje tę samą maszynę co rysunek.
- **Foot SMR:** oba źródła mówią o piłce; wałka (z opisu w briefie) nie ma — zdanie mówi tylko o piłce.

## Otwarte pytania
- [OTWARTE] Dumbbell Lying Pronation/Supination: rotacja przedramienia (note katalogu) czy rotacja zewnętrzna barku (fedb)? Od tego zależy, które źródła się liczą i czy rysunek jest poprawny.
- [OTWARTE] Dumbbell Lying Pronation: brak czytelnego opisu wersji „leżąc przodem” (Fitwill 403). Opcje: zmienić note na „leżąc na boku” (2 źródła) albo szukać dalej.
- [OTWARTE] Incline Push-Up Reverse Grip: drugie niezależne źródło wersji na drążku na wysokości bioder; muscleandstrength (403) i Fitwill (403) do sprawdzenia z innej sieci.
- [OTWARTE] Lying Machine Squat: drugie źródło z tą samą mechaniką co fedb (ciało rusza się z oparciem).
- Nieczytelne strony: fitwill.app 0347 i 0349 (403); muscleandstrength.com/exercises/reverse-grip-incline-push-up (403); atrtrainingsystems.com/intro-to-strongman-kegs (404).
