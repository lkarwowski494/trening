# Weryfikacja Gemini research 4 — ćwiczenia 11–20 (03.11.2026)

Wejście: `gemini/research-4.json`, obiekty 11–20 (Pendulum Squat … Round The World Shoulder Stretch); odmiany z
`gemini-20/v3-partia-3.txt:51–60`. Reguła: etap 2 (CLAUDE.md, „Merytoryczne podstawy”) — ustawienie i przebieg ruchu
z 2 niezależnych źródeł szczebla 5 („praktyka”); „czego unikać” ze źródeł albo wniosek z ruchu; liczby i zdrowie pominięte.
Strony aplikacji treningowych = szczebel 5 (`docs/18-przekazanie.md:201`, wariant A); nazwy firm tylko tutaj, nigdy w pl/en.
Szczeble wg `szczeble-organizacji-2026-11-02.md` (Catalyst Athletics = 4, wiersz 32; pozostałe = 5).
Wszystkie pozycje „otwarte” do recenzji niezależnej (L-047). Szczegóły, adresy, cytaty: `wyniki-gemini-4b.json`.

## Wynik

| # | Ćwiczenie | Stan | Źródła pary |
|---|---|---|---|
| 11 | Pendulum Squat | komplet (setup, move); mis 1 źródło + wniosek | Gravitus (cytaty Gemini niezgodne — użyta faktyczna treść) + That Fit Friend (J. Boly) |
| 12 | Power Stairs | komplet | FitLoop + Iron&Oven (tekst fedb); Ellim = inna odmiana |
| 13 | Press Sit-Up | komplet (setup, move); mis wniosek | Jefit /67 (Gemini podał zły adres /1111) + RepStack (fedb) |
| 14 | Prone Flutter Kicks | komplet (setup, move); mis wniosek + 1 źródło | RepStack (fedb) + Coach/coachweb (spoza Gemini) |
| 15 | Push-Ups With Feet On A Stability Ball | komplet | WeightTraining.guide (E. Lord) + Fitness Programer + SET FOR SET |
| 16 | Rack Delivery | komplet | Catalyst Athletics /544 (szczebel 4; Gemini podał /383 — inne ćwiczenie) + Motra (spoza Gemini) |
| 17 | Reverse Flyes With External Rotation | częściowo (setup komplet; obrót dłoni 1 linia) | Jefit /442 + RepStack (fedb) |
| 18 | Reverse Hyperextension | komplet (źródła zastępcze) | StrengthLog + Motra; wszystkie adresy Gemini 404 albo puste |
| 19 | Rickshaw Carry | komplet warunkowo (niezależność od fedb) | FitLoop + Hueman |
| 20 | Round The World Shoulder Stretch | komplet | StrengthLog (A. Abelsson) + StretchBurner (+ Iron&Oven/fedb) |

Komplet: 8 (11, 12, 13, 14, 15, 16, 18, 20) + 1 warunkowo (19). Częściowo: 1 (17). 1 źródło / brak: 0.

## Miara jakości promptu (adresy Gemini z obiektów 11–20)

40 adresów: 16 × 404, 5 nieczytelnych (fitwill ×2, skimble, fitbod — 403; paulstokes — 526), 1 przekierowanie na stronę
główną (yourhousefitness), 1 strona pusta (tviky — JS). Otwarte z treścią: 17.

| Wynik dla 17 otwartych | Liczba | Adresy |
|---|---|---|
| Cytat dosłowny, to ćwiczenie i ta odmiana | 8 | That Fit Friend, FitLoop (power stairs, rickshaw — sklejone kolejne kroki), Fitness Programer, SET FOR SET, Hueman, StrengthLog (setup; ruch sklejony), WeightTraining.guide (mis; setup sklejony z pominięciem zdania) |
| Cytat niezgodny ze stroną | 3 | Gravitus (żadnego cytatu nie ma), Body by Choice (brak opisu ćwiczenia), StretchBurner (częściowo: setup z innej sekcji, ruch sklejony) |
| Inne ćwiczenie albo inna odmiana | 4 | Jefit /1111 (wyciskanie hantli siedząc), Catalyst /383 (Clean-Grip Snatch), Ellim power stairs (wchodzenie z przyrządem), Ellim press sit-up (na podłodze) |
| Kopia free-exercise-db (nieoznaczona przez Gemini) | 2 | Iron&Oven (power stairs, round the world) — cytaty dosłowne |

Uwaga: w 2 przypadkach (Jefit, Catalyst) cytaty Gemini były prawdziwe, ale pod innym numerem strony tego samego serwisu
— Gemini zgadywał identyfikator w adresie mimo zakazu w prompcie. Kopie oznaczone przez Gemini (skimble = Jefit, gimmy = atletiq) — oba adresy i tak nieczytelne.

## Otwarte pytania

- [OTWARTE] 17 Reverse Flyes With External Rotation: drugie niezależne źródło do obrotu dłoni i jego kierunku (fedb: z „w dół”
  do „do siebie”; Gemini/Paul Stokes, nieczytelny: „do sufitu”). Do tego czasu obrót = jedno źródło.
- [OTWARTE] 19 Rickshaw Carry: Hueman wygląda na parafrazę tekstu fedb — sprawdzić z tekstem fedb; FitLoop też krótki, możliwy skrót fedb.
- [OTWARTE] 11 Pendulum Squat: głębokość i rozstaw stóp różnią się między źródłami — zdania bez nich.
- [OTWARTE] 16 Motra: brzmienie zdania ustawienia pochodzi z wyniku wyszukiwania; treść potwierdzona WebFetch — przy wpisie do rejestru otworzyć raz jeszcze.
- [OTWARTE] Szczeble autorów z kwalifikacjami (J. Boly CSCS — That Fit Friend; S. Coleman — SET FOR SET; E. Lord — WeightTraining.guide)
  nie są w `szczeble-organizacji`; przyjęte 5 (dla etapu 2 wystarcza).
- 13, 14, 17: „Czego unikać” tylko wniosek z ruchu (Fitwill/Fitbod 403, Ellim — inna odmiana).
