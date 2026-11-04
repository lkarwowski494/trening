# Weryfikacja „Gemini uzupełnienie 1” — ćwiczenia 12–21 (03.11.2026)

Wejście: `gemini/uzupelnienie-1.json`, obiekty 12–21 (Dumbbell Front Raise to Overhead … Clock Push-Up); odmiany i „need:”
z `gemini-20/v3-uzupelnienie-1.txt:52–61`. Połączone ze stanem z `wyniki-gemini-1.json` i `wyniki-gemini-1-r2.json` (r2 ma
pierwszeństwo; to samo źródło nie liczone dwa razy). Reguła: etap 2 (CLAUDE.md, „Merytoryczne podstawy”, właściciel 03.11.2026) —
setup i move z 2 niezależnych źródeł szczebla 5 („praktyka”), kopie tekstu free-exercise-db (fedb) = jedno źródło; mis ze źródeł
albo wniosek z ruchu; liczby i zdrowie pominięte. Strony aplikacji = szczebel 5 (`docs/18-przekazanie.md:201`); nazwy firm tylko tutaj.
Wszystkie pozycje „otwarte” do recenzji niezależnej (L-047). Zdania pl/en, adresy i cytaty: `wyniki-uzup-1b.json`.

## Wynik po połączeniu

| # | Ćwiczenie | Przed | Po | Para źródeł |
|---|---|---|---|---|
| 12 | Dumbbell Front Raise to Overhead | brak | komplet (setup, move, mis) | Ellim + Kovo |
| 13 | Circus Bell | brak | komplet (setup, move, mis) | BarBend/M. Gill (właściwy adres znaleziony; Gemini podał 404) + LiftProof + Gegns Gym |
| 14 | Barbell Rollout from Bench | brak | komplet (setup, move, mis) | WeightTraining.guide (M. Livelo) + Fitness Volt (Ash, ACE); PeakHealth = tekst fedb |
| 15 | Bent Press | brak | komplet (setup, move, mis; mis częściowo wniosek) | Fitness Volt (V. Vukas) + Breaking Muscle (C. Abbott) + Ellim |
| 16 | Body-Up | 1 źródło (fedb) | komplet warunkowo (setup, move; mis wniosek + 1) | wrkout (fedb) + WeightTraining.guide „Bodyweight Triceps Extension” (E. Lord, spoza Gemini) — inna nazwa, ten sam ruch |
| 17 | Bosu Ball Cable Crunch With Side Bends | 1 źródło (bearly) | 1 źródło (fedb/LiftChat) | bearly = inna odmiana (siad, 1 uchwyt za głową) |
| 18 | Butt-Ups | 1 źródło (bearly) | komplet (setup, move; mis 1 + wniosek) | HomeGym-Exercises + Lift Manual (+ bearly z r2) |
| 19 | Cable Seated Crunch | brak | komplet (setup, move; mis wniosek) | fedb (raw) + FitnessAI (spoza Gemini) |
| 20 | Chain Handle Extension | brak | komplet (setup, move; mis 1 + wniosek) | fedb (raw) + GMLYFT |
| 21 | Clock Push-Up | otwarte (sprzeczność) | setup i mis komplet; move komplet warunkowo (odmiana z promptu) | Ellim + Maniac Muscle (r2); Kovo + FitLoop = inna odmiana |

Komplet: 7 (12, 13, 14, 15, 18, 19, 20) + 2 warunkowo (16 — tożsamość ruchu; 21 — odmiana wg rysunku). 1 źródło: 1 (17). Brak: 0.

## Miara jakości (adresy Gemini z obiektów 12–21)

45 adresów: 15 × 404; 7 nieczytelnych (Fitwill × 5 — 403, dwie próby, trzy nieotwierane, bo komplet był z innych; healthy-magazines — pusta treść; Caliverse — 500). Otwarte z treścią: 23.

| Wynik dla 23 otwartych | Liczba | Adresy |
|---|---|---|
| Cytat zgodny, to ćwiczenie i ta odmiana | 12 | Ellim i Kovo (12), LiftProof (13), WeightTraining.guide (14; mis niezgodny), Fitness Volt (14), Fitness Volt, Breaking Muscle, Ellim (15; rola „setup” to krok ruchu), HomeGym, Lift Manual (18), GMLYFT (20), Ellim (21) |
| Cytat niezgodny ze stroną | 2 | Gegns Gym circus (tekstu Gemini nie ma), stayfit.dev (strona główna aplikacji bez opisu) |
| Inne ćwiczenie albo inna odmiana | 6 | Jefit /1114 (wyciskanie hantli jednorącz — zgadnięty numer), Fitness Volt i Ellim (19: dolny wyciąg / przodem do maszyny), Kovo (15: najpierw wyciśnięcie, potem skłon), Kovo i FitLoop (21: obrót całego ciała) |
| Kopia fedb (nieoznaczona przez Gemini) | 3 | getwrkout (16), LiftChat (17), PeakHealth (14) |

Uwaga: BarBend (13) — adres Gemini 404, ale cytaty prawdziwe pod innym adresem tego serwisu (jak Jefit/Catalyst w 4b). Gemini
nie oznaczył żadnej kopii fedb (`copy_of` wszędzie null); cytaty Atletiq (16, 18, 19, 20) to dosłowny tekst fedb, adresy 404.

## Otwarte pytania

- [OTWARTE] 16 Body-Up: dwie odmiany pod tą nazwą — (A) fedb: dłonie płasko, wyprost łokci; (B) przejście z przedramion na dłonie po jednej ręce. Zdania = A; rozstrzyga rysunek. Recenzent potwierdza, że „Bodyweight Triceps Extension” (WTG) to ten sam ruch.
- [OTWARTE] 17 Bosu: drugie niezależne źródło wersji leżącej z dwoma dolnymi wyciągami; do tego czasu 1 źródło (fedb). Bearly (r2) przesunięte do „inna odmiana”.
- [OTWARTE] 21 Clock Push-Up: trzy odmiany (dłoń po tarczy / obrót całego ciała / fedb z wybiciem w locie). Zdanie move = odmiana z promptu; przy innym rysunku zamiana (obrót całego ciała ma parę Kovo + FitLoop; fedb = 1 źródło).
- [OTWARTE] 15 Bent Press: prompt mówi „ręka zostaje prosta”, źródła — ręka prostuje się, bo ciało schodzi spod ciężaru; recenzent porównuje z rysunkiem (Kovo opisuje wersję bliższą wiatrakowi).
- [OTWARTE] 19 Cable Seated Crunch: „plecami do wyciągu” wprost tylko w fedb; FitnessAI — „lina nad głową” w siadzie (wynika z tego, nie jest napisane).
- [OTWARTE] 13 Circus Bell: pozycja kuli na barku różni się między źródłami (za głową / przy obojczyku) — zdanie bez niej. BarBend = warunkowo 4 (autor), tu liczony jako 5.
- [OTWARTE] 18 Butt-Ups: fedb każe lekko wygiąć plecy w górę, pozostałe — linia prosta; zdania idą za większością, recenzent z rysunkiem.
- 14: oddech sprzeczny między WTG i Fitness Volt — pominięty.
