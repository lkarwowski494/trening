# Uzupełnienie 2, ćwiczenia 14–21: wyszukiwanie bez Gemini (uz2b, 03.11.2026)

Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026). Setup i move potrzebują 2 niezależnych źródeł. Wystarczy szczebel 5, wtedy wpis dostaje oznaczenie „praktyka”. Mis może pochodzić ze źródła albo z wniosku z ruchu. Liczby i zdrowie są pominięte.
Szukałem tylko punktów z pola „need:” (`gemini-20/v3-uzupelnienie-2.txt:54–61`). Wcześniejsze źródła pochodzą z wyniki-gemini-2a, -2b, -3a, -3b i -1-r2; ich nie liczyłem ponownie.
Szczeble ustalam według `szczeble-organizacji-2026-11-02.md`. Fedb ma szczebel 5 i liczy się najwyżej jako 1 źródło. Każdy komplet ma stan „otwarte” i czeka na recenzję niezależną (L-047). Cytaty i miejsca są w `wyniki-uz2b.json`.

## Wynik

| # | Ćwiczenie (punkt) | Stan | Źródła liczone | Koszt (wyszukania / strony) |
|---|---|---|---|---|
| 14 | Incline Walk (move) | **komplet** | Life Fitness (sz. 4, producent bieżni) + Peloton (sz. 5, z 2a) | 1 / 1 |
| 15 | Kettlebell Halo with Overhead Extension (move: wyprost) | **komplet jako uproszczenie (analogia)**, do potwierdzenia recenzenta | Iron and Oven (sz. 5, z 2b) + BarBend (D. Fraiser, warunkowo 4, inne ćwiczenie: „Pull Over”) | 3 / 4 |
| 16 | Kneeling Cable Crunch With Alternating Oblique Twists (move) | **komplet** (warunek z 2b usunięty) | fedb raw (sz. 5) + The Workout Digest (B. Ward, sz. 5) | 0 / 3 |
| 17 | Kneeling High Pulley Row (move) | **1 źródło** (fedb), bez zmian | — | 4 / 3 |
| 18 | Lying Supine Dumbbell Curl (setup, move) | **częściowo**: bez zmian względem 3b (fedb + Wikipedia, niezależność Wikipedii warunkowa) | brak nowego niezależnego źródła | 1 / 6 |
| 19 | Belt Squat Machine (move) | **komplet** | Bells of Steel (sz. 4 warunkowo, producent) + Barbell Logic (sz. 5) + StrengthLog (sz. 5, z r2) | 1 / 2 |
| 20 | Donkey Calf Raise (setup) | **komplet**, wersja z maszyną; zastępuje uproszczenie z r2 | fedb (sz. 5) + training.fit (sz. 5) | 1 / 4 |
| 21 | Cable Fly (high to low) (move) | **komplet**, oburącz; uproszczenie z r2 niepotrzebne | Motra (sz. 5) + atlas.kulturystyka.pl (sz. 5, z etapu 2) | 1 / 2 |

Komplet: 5 (14, 16, 19, 20, 21) i 1 jako uproszczenie (15). Częściowo: 1 (18). Jedno źródło: 1 (17). Brak: 0.
Koszt łącznie: 12 wyszukań i 25 odczytów stron (licząc 403 i 404), średnio 1,5 wyszukania i 3,1 strony na ćwiczenie.
Szczebel 4 jest w parze w pozycjach 14 i 19 (w 19 warunkowo) oraz w 15 (warunkowo, analogia). Pozostałe pozycje to „praktyka”.

## Rozbieżności do recenzji (nie weszły do zdań)
- **Kneeling Cable Crunch:** fedb kieruje łokieć do przeciwnego kolana i zaczyna skręt w połowie ruchu. Workout Digest prowadzi łokcie do kolana po tej samej stronie i skręca od początku. Zdanie nie mówi, do którego kolana. Fragment „w połowie ruchu” jest tylko w fedb, więc recenzent może go usunąć.
- **Kettlebell Halo:** BarBend opisuje wyprost nad głową w innym ćwiczeniu (Pull Over). Recenzent musi potwierdzić, że ten element ruchu jest taki sam. Breaking Muscle (sz. 5, właściciel BarBend) potwierdza, że połączenie halo z wyprostem istnieje, ale nie opisuje kolejności ruchów. Nie liczę go. Pliku fedb pod nazwą z katalogu nie ma (404).
- **Belt Squat:** miejsce pasa. Na biodrach mają go Bells of Steel, Barbell Logic i J. Bradley, na talii StrengthLog. Bells of Steel to producent maszyny, ale na tej samej stronie maszyna jest w sprzedaży (kryterium pkt 3). Szczebel potwierdza koordynator. Komplet stoi też bez tej strony.
- **Donkey Calf Raise:** fedb kładzie poduszkę na dolnej części pleców i biodrach, training.fit na kości ogonowej. Do zdania weszła część wspólna. Przedramiona na podpórce są tylko w training.fit.
- **Cable Fly (high to low):** dłonie spotykają się „przed biodrami” tylko według Motry. Recenzent może skrócić zdanie do „w dół i do środka”. Weighttraining.guide (M. Livelo) opisuje w kroku wykonania fazę w górę i na zewnątrz, więc go nie liczę.
- **Incline Walk:** sprzeczność z 2a pozostaje. Peloton dopuszcza lekkie pochylenie, Hinge Health uznaje pochylanie za błąd. Life Fitness mówi „stand up straight”, „don't lean back”. Do zdania weszły tylko wyprostowana postawa i zakaz odchylania się do tyłu.

## Otwarte pytania
- [OTWARTE] Kneeling High Pulley Row, move: nie ma drugiego opisu odmiany w klęku z liną z górnego wyciągu. Kandydat na uproszczenie to stojące wiosłowanie liną na tylne barki z wyciągu na wysokości głowy (ExRx `CBStandingRearDeltRowRope`). Strona zwraca 403 i nie jest przeczytana. Czy różnicę klęk/stanie wolno uznać za uproszczenie, rozstrzyga recenzent.
- [OTWARTE] Lying Supine Dumbbell Curl: czy Wikipedia jest niezależna od fedb? Active.com (J. Gates, 2015) to parafraza fedb. Liftosaur i Virtuagym opisują ręce skierowane do sufitu albo nie podają ich pozycji. Fitwill i musclewiki zwracają 403.
- Nieczytelne strony: exrx.net (403), fitwill.app (403), musclewiki.com (403), fedb Kettlebell_Halo_with_Overhead_Extension.json (404).
