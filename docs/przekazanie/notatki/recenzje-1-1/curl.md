# Recenzja ruchu 1.1: rodzina curl (36 ćwiczeń), 27.10.2026

Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2).

Walidator: **36/36 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

Szablony rodziny:

- **stojący** (16 ćwiczeń): łokieć przy boku (x 1 → 3, odwiedzenie 6°), łokieć 18–26° → 122–135°, chwyt (12; 78) → (34; 103) → (24; 134);
- **modlitewnik** (9): ramię na podpórce (bark (−11; 106), łokieć (14; 88), pochylenie ramienia ok. 35°), łokieć 13–18° → 118–128°;
- **ławka skośna** (Incline ×2: ramię pionowo przy tułowiu odchylonym 35°, łokieć 5° → 127°) i **leżenie przodem** (Spider ×2: ramię pionowo pod barkiem, łokieć 1° → 125°).

Obrót przedramienia odpowiada nazwie:

- podchwyt: +70;
- młotkowy: 0;
- nachwyt (Reverse): −70;
- gryf łamany: +25;
- supinacja w trakcie (hantle): 0 → +70.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Barbell Curl, EZ Bar Curl, Reverse Curl, Biceps Curl (hantle), Hammer Curl, Standing Dumbbell Reverse Curl, Standing Inner-Biceps Curl (łokieć odwiedziony 21°), Cable Curl, Reverse Cable Curl, Hammer Curl (linki), Standing One-Arm Cable Curl, Cable Curl (dwie linki) | OK z uwagą (12) | uwaga H (dół 18–26°) |
| Cross Body Hammer Curl | OK | hantel ku środkowi ciała (z 25 → 3), łokieć przy boku |
| Drag Curl | OK z uwagą | łokieć cofa się (x 0 → −12), ale sztanga w połowie ok. 13 cm przed brzuchem (uwaga I) |
| Zottman Curl, Zottman Preacher Curl | OK z uwagą (2) | uwaga J (animacja wahadłowa) |
| Incline Curl (hantle), Incline Hammer Curl | OK | |
| Lying Supine Dumbbell Curl | OK z uwagą | ramię leży wzdłuż tułowia na wysokości ławki (łokieć y 44 przy blacie 43), przedramię do pionu; typowy wariant ma ramiona zwisające poza ławkę (pewność 55%) |
| High Cable Curl | OK | ramiona w odwiedzeniu 80°, linki z górnych bloczków (z ±100), łokieć 8° → 118° |
| Bayesian Curl | OK | wyciąg za plecami (x −70), ramię za tułowiem (zgięcie barku −35°), łokieć 9° → 127° |
| **Concentration Curl (hantle)** | **BŁĄD** | łokieć bez oparcia o udo, wolna ręka w powietrzu (nr 1) |
| Seated Close-Grip Concentration Barbell Curl | OK z uwagą | łokcie między nogami (z ±12), 20 cm od ud (kolana z ±33); uwaga K |
| Standing Concentration Curl | OK z uwagą | wolna dłoń (−3; 70; −21) ok. 16 cm nad udem, łokieć w bok (z −43); K |
| Lying Close-Grip Bar Curl On High Pulley | OK | leżenie na ławce, ramiona za głową ku bloczkowi (zgięcie barku 112°), łokieć 18° → 108° |
| Lying Cable Curl | OK | leżenie na podłodze, wyciąg od stóp (x 120), ramiona wzdłuż tułowia, łokieć 14° → 125° |
| Barbell Preacher Curl, Preacher Curl (EZ), Reverse EZ-Bar Preacher Curl, Preacher Curl, Preacher Hammer Dumbbell Curl, Cable Preacher Curl, One Arm Dumbbell Preacher Curl | OK (7) | ramię na podpórce, pachą przy krawędzi (`preacher.setup`) |
| Machine Biceps Curl | OK z uwagą | jedna dźwignia (`trzyma: R`), uwaga przekrojowa z `README.md` |
| Spider Curl, Spider Curl (sztanga) | OK z uwagą (2) | uwaga D z `row.md` (biodro −37°, wyjątek zakresu) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Concentration Curl (hantle)** | wszystkie klatki: łokieć R, ręka L | **Łokieć ręki pracującej nie opiera się o udo, a wolna ręka wisi w powietrzu.** Siad na ławce, tułów 40° w przód, kolana szeroko (z ±33). Łokieć R jest w (54; 61; 11), a oś prawego uda w tym samym x leży w ok. (54; 47; 31,5). Łokieć jest więc ok. 25 cm od osi uda i ok. 16 cm od jego powierzchni: ramię zwisa pionowo między kolanami. Wolna ręka L: łokieć sterczy w bok i w przód (73; 81; −41), dłoń (46; 70; −26) wisi 26 cm od lewego kolana. W rzucie z przodu widać „skrzydło” na wysokości pasa. Ruch ręki pracującej jest poprawny (łokieć 17° → 127°, supinacja 0 → 70). | Tył ramienia (łokieć) oparty o wewnętrzną stronę uda tej samej strony. Łokieć ≤ 3 cm od powierzchni uda: kolana węższe albo łokieć bardziej na zewnątrz. Wolna dłoń na drugim kolanie albo udzie. | 70% | realny | nie: nie ma reguły podparcia łokcia (oparcie o udo jest cechą ćwiczenia, ale nie ma jej w danych sensu) |

## OK z uwagą (backlog, nie blokuje)

- **H. Dół uginania 18–26°** (12 ćwiczeń stojących). Wskazówki mówią „opuść sztangę do pełnego wyprostu rąk”. 26° (EZ Bar Curl, Inner-Biceps, Hammer linki) jest wyraźnie zgiętym łokciem w rzucie z boku. Proponuję ≤ 15°, tak jak w Incline (5°) i Spider (1°). Pewność 55%.
- **I. Drag Curl:** sztanga ma „sunąć po tułowiu”, a w u = 0,5 chwyt jest w x 25 przy linii brzucha ok. x 12, czyli ok. 13 cm przed ciałem. Na górze (17; 126) już przy klatce. Pewność 55%.
- **J. Zottman Curl / Zottman Preacher Curl:** obrót przedramienia +60° → −60° rozkłada się na całą fazę unoszenia. Przy animacji wahadłowej (0 → 1 → 0) opuszczanie odtwarza go wstecz, więc nie widać istoty ćwiczenia: w górę podchwytem, obrót na górze, w dół nachwytem. Tego nie da się wyrazić w ruchu wahadłowym. Potrzebny tryb animacji „pętla” albo dwie fazy z obrotem w szczycie. Ograniczenie silnika, nie pozy. Pewność 75%.
- **K. Pozostałe warianty „concentration”:** łokcie bez oparcia (Seated Close-Grip: łokcie 20 cm od ud), a w wersji stojącej wolna dłoń bez podparcia. Mniej istotne niż nr 1, bo wersja ze sztangą i stojąca bywają wykonywane z ramieniem zwisającym swobodnie. Pewność 55%.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `podparcie_lokcia` | ćwiczenia z oparciem ramienia w opisie (concentration, preacher): odległość łokcia od powierzchni podpory (udo / modlitewnik) ≤ 3 cm w każdej klatce | Concentration (hantle) ok. 16 cm | modlitewnik: łokieć na podpórce (bez alarmu) |
| `wolna_reka_podparta` | ćwiczenia jednorącz w siadzie lub pochyleniu: wolna dłoń ≤ 5 cm od uda, kolana, ławki albo biodra | Concentration 26 cm, One Arm Row (row.md) 9 cm nad kolanem / 35 cm przed nim | Kettlebell Press: dłoń na biodrze |
