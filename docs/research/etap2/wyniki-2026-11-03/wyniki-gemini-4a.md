# Weryfikacja Gemini research-4, ćwiczenia 1–10 (03.11.2026)

Plik wejściowy: `gemini/research-4.txt`, linie 1–983 (Middle Back Shrug … Pallof Press); odmiany z `gemini-20/v3-partia-3.txt:41–50`.
Reguła: etap 2 (CLAUDE.md, właściciel 03.11.2026): ustawienie i przebieg ruchu z 2 niezależnych źródeł (szczebel 5 wystarczy,
oznaczenie „praktyka”), „czego unikać” może być wnioskiem z ruchu; liczby i zdrowie pominięte. Strony aplikacji treningowych
dopuszczone jako szczebel 5 (`docs/18-przekazanie.md:201`, wariant A); nazwy firm są tylko tutaj. Szczeble: `szczeble-organizacji-2026-11-02.md`
(Catalyst Athletics = 4, wiersz 32; Breaking Muscle = 5, wiersz 44; pozostałe serwisy bez autora z kwalifikacjami = 5). Wszystkie pozycje opierają się
na źródłach szczebla 5, więc mają stan „otwarte” do recenzji niezależnej (L-047), a nie „gotowe”. Szczegóły i cytaty: `wyniki-gemini-4a.json`.
Fedb (free-exercise-db) = szczebel 5. Liczy się najwyżej jako JEDNO źródło, a jego kopie (liftchat side bends, fitzport, qantra, workoutdirector) nie są drugim źródłem.

## Wynik

| # | Ćwiczenie | Stan | Źródła liczone (setup / move) |
|---|---|---|---|
| 1 | Middle Back Shrug | komplet (+ mis wniosek z 2 opisów) | liftchat; Generation Iron (V. Saini) |
| 2 | Middle Back Stretch | komplet (mis 1 źródło) | fedb; Fitness Volt (M. Magnante) |
| 3 | Monster Walk | komplet (mis 1 źródło), **drugie i trzecie źródło spoza Gemini** | fedb; Redefining Strength; Catalyst Athletics (sz. 4) |
| 4 | Muscle Up | komplet (setup część wspólna kółka/drążek; mis 1 źródło) | fedb; Gymshark (L. Dale-Tooze) |
| 5 | Neck Harness Extension | **komplet dla siedzenia bez pozycji tułowia**; pochylenie tułowia: 1 źródło, sprzeczne z 2 | fedb; weighttraining.guide (M. Livelo); loadmuscle (spoza Gemini) |
| 6 | One-Arm High-Pulley Cable Side Bends | komplet, **drugie źródło spoza Gemini** | fedb (przez kopię liftchat); Fitness Volt cable side crunch (M. Magnante) |
| 7 | One-Arm Incline Lateral Raise | komplet (setup część wspólna; mis wniosek), **drugie źródło spoza Gemini** (poprawiony adres) | fedb (kopia fitzport); jefit /428/ |
| 8 | One-Arm Kettlebell Split Jerk | komplet (+ mis z 2 źródeł) | G4 Physio; Nuffield Health (O. Tyler); fedb |
| 9 | Otis-Up | komplet (+ mis z 2 źródeł) | smartworkout; Fitness Volt (M. Magnante); fedb |
| 10 | Pallof Press | komplet (+ mis z 2 źródeł) | REP Fitness (R. MacPherson); Breaking Muscle (M. Lincoln); fedb |

Komplet: 10 (w tym 5 z zastrzeżeniem: część wspólna albo pominięty szczegół). Częściowo: 0. Jedno źródło: 0. Brak: 0.
Uwaga: Fitness Volt (M. Magnante) to drugie źródło dla 2, 6 i 9. Są to różne ćwiczenia, więc nie ma tu problemu z niezależnością.

## Rozbieżności do recenzji (nie weszły do zdań)
- **Neck Harness Extension:** prompt opisuje odmianę „seated and bent forward”. Pochylenie tułowia ma tylko weighttraining.guide. Fedb („nearly upright”) i loadmuscle („back upright”) każą siedzieć prosto. Smartworkout to wersja stojąca w skłonie, więc liczy się tylko dla błędów. Koordynator musi ustalić, którą odmianę pokazuje rysunek. Cytat z fedb mam tylko w parafrazie narzędzia (setup), dosłowne jest zdanie o ruchu.
- **Muscle Up:** żadne przeczytane źródło nie mówi wprost „strict” (bez wymachu), bo Gymshark opisuje kroki wspólne dla strict i kipping. Fedb opisuje kółka z chwytem „false grip”, Gymshark drążek z nachwytem.
- **Side Bends:** żadne źródło nie nazywa wprost kierunku skłonu („od maszyny”); oba mówią „side crunch” po stronie pracującej. Fitness Volt zaleca lekki skręt w stronę wyciągu.
- **Incline Lateral Raise:** początkowa pozycja ręki jest różna. Fedb: ręka przed sobą, równolegle do podłogi, w poprzek ciała. Jefit: hantla przy miednicy.
- **Monster Walk:** fedb każe założyć dwie gumy (kostki i kolana), Catalyst jedną pod kolanami, Redefining jedną na kostkach. Ugięcie kolan podaje tylko Catalyst.
- **Otis-Up:** moment wyciśnięcia jest różny (po wyprostowaniu tułowia / w trakcie siadania). Fedb ma stopy zablokowane, pozostałe źródła nie.
- **Middle Back Shrug:** liftchat podaje proste ręce, Generation Iron „lekkie ugięcie łokci”.
- **Pallof Press:** katalog ma osobny wpis „Pallof Press” (`docs/research/equipment/catalog.json:3325`) bez fedb oraz „Pallof Press With Rotation” (`:25030`). Wynik dotyczy wersji bez obrotu, czyli odmiany z promptu. Uwaga „sprawdzić” w JSON przy Pallof jest tym samym rozstrzygnięta.

## Miara jakości promptu (adresy Gemini, ćw. 1–10)
- Unikalnych adresów Gemini: 38, z czego **martwych według curl (404): 19** (training.fit, abooyeah, letsworkout, fitnesskar, kaizer ×2, fittux,
  backmusclesolutions, fiteducation, rfvchiro, calisthenics-corner, hevyapp, aegirlab, corehealthhq, fitnessvolt side-bends-alternatives, workoutify, atletiq,
  kovofitness pallof, tonal). Do tego 1 adres ze spacją w środku (fitnessvolt „exercise- substitutes”).
- **Otwarte przeze mnie: 19.** Nieczytelnych było 4: adamschiro (503), skimble (403), wodprep (pusta treść), strengthlog (404 przy odczycie).
- Wśród 15 przeczytanych:
  - **cytat dosłownie zgodny: 14 z 14 sprawdzonych na właściwej stronie**, a cytat niezgodny ze stroną: **0**;
  - **inne ćwiczenie pod adresem: 1** (jefit /318/ prowadzi do roweru stacjonarnego; ten sam cytat jest pod /428/);
  - **inna odmiana: 1** (smartworkout neck to wersja stojąca, mimo że prompt mówi „seated”);
  - **kopie fedb: 2** (liftchat side bends, fitzport). Gemini nie oznaczył ich jako kopii. Według tekstu cytatu kopiami fedb są też 3 nieczytane adresy: workoutdirector, qantra i adamschiro.
- Wniosek: cytaty z żywych stron są wiarygodne (0 niezgodnych, poprawa wobec research-3), ale połowa adresów nie istnieje. Monster Walk miał wszystkie adresy martwe albo zablokowane.

## Otwarte pytania
- [OTWARTE] Neck Harness Extension: która odmiana (siedząc prosto czy w pochyleniu)? Pochylenie ma tylko 1 źródło i przeczą mu 2.
- [OTWARTE] Muscle Up: „strict” bez wymachu nie ma źródła wprost. Zdania tego nie twierdzą.
- [OTWARTE] Side Bends: kierunek skłonu do potwierdzenia z rysunkiem przez recenzenta.
- Nieczytane, bo wystarczyło: workoutdirector, liftmanual, kovofitness otis, qantra; fitwill otis (403) i wodprep ring.
