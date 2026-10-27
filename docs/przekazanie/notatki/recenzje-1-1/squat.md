# Recenzja ruchu 1.1: rodzina squat (25 ćwiczeń, rig), 27.10.2026

Rodzina rysowana rigiem (`lib/figures/v2/rigs/squat.ts`, warianty w `variants.ts`), bez pliku póz. Oceniam `origin/integracja-1-1` @ 4e5a7f95. Uzasadnień generatorów ani opisów commitów nie czytałem.

Metoda:

- Podgląd z rigu: `scripts/figures/podglad-v2.mjs --family squat --us 0,0.25,0.5,0.75,1` (rzut z boku i z przodu, po 5 klatek). PNG 2400 px, oglądany w połówkach, wątpliwe miejsca liczbami.
- Liczby: `figureSpec` + `frameAt` + `jointAngles`, własny skrypt, u = 0 / 0,5 / 1. Wskazówki z `lib/cues` i `cue-sets.json`.
- Współrzędne: x w przód, y w górę, z w prawo, cm.

Automaty:

- `sens-gotowe.mjs` (reguły sensu na klatkach rigu, siatka 0,05): **0 naruszeń** w całej trójce rigów (87 figur).
- `v2-validate.mjs` dla rodzin rigowych pomija reguły sensu i jakości (`rigowa`). Żeby uruchomić go na rigach, przepuściłem przez `waliduj` pozy z `exampleFor` (rig zamieniony na dane): **17/25 OK**.
  Odrzuca: Front Squat (łokieć 163° > 149°, gryf 2 cm w tułowiu), 4 × Box Squat (miednica 0,5 cm w skrzyni przy tolerancji 0,3), Zercher (ramię 0,7 cm w gryfie), Overhead Squat (bark 194° > 171°) i One-Arm Overhead KB Squat (bark 183°).
  Poza Front Squat są to drobne przekroczenia tolerancji w miejscach zamierzonego kontaktu albo zakresu. Nie są to błędy ruchu.
- Szczelność wobec moich znalezisk: reguły działające w procesie (sens-gotowe) łapią **0 z 3**. Walidator kontraktu na pozach z rigu odrzuciłby Front Squat, ale z innego powodu niż błąd ruchu (łokieć poza zakresem, a nie kierunek ramienia), więc 1 z 3 przypadkiem.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Back Squat | OK | gryf wysoko na plecach, gryf nad środkiem stopy (x 6,5), tułów 16° → 45°, biodro 119°, kolano 118° (udo poziomo) |
| **Front Squat** | **BŁĄD** | ramiona pionowo w górę, łokcie nad głową (nr 1) |
| Goblet Squat | OK | hantel pionowo przy mostku, łokcie między kolanami na dole |
| Przysiad z pasem (linki) | OK | linka od bloczka przy podłodze do pasa, ręce przed sobą |
| Box Squat | OK | siad na skrzynię 45 cm (miednica 0,5 cm w skrzyni: styk) |
| Wall Sit | OK | plecy przy ścianie, uda poziomo, statycznie |
| Cable Squat | OK | linka z niskiego bloczka z przodu do dłoni przy klatce |
| Bodyweight Squat | OK | ręce w przód dla równowagi |
| Smith Machine Squat | OK | prowadnica, gryf pionowo |
| Zercher Squat | OK | gryf w zgięciach łokci przy brzuchu |
| Double Kettlebell Front Squat | OK | odważniki w pozycji rack przy barkach |
| Landmine Squat | OK | koniec gryfu przy klatce, oś z przodu na podłodze |
| Sumo Squat (hantel) | OK | szeroko, stopy na zewnątrz, hantel zwisa między nogami |
| **Box Squat with Bands** | **BŁĄD** | guma przez środek ciała (nr 2) |
| Box Squat with Chains | OK | łańcuchy przy końcach gryfu, do podłogi |
| **Reverse Band Box Squat** | **BŁĄD** | guma przez środek ciała i od dołu zamiast od góry (nr 2) |
| **Reverse Band Power Squat** | **BŁĄD** | jak wyżej (nr 2) |
| **Squat with Bands** | **BŁĄD** | guma przez środek ciała (nr 2) |
| Squat with Chains | OK | łańcuchy przy końcach gryfu |
| Barbell Hack Squat | OK | gryf za nogami w dłoniach, ręce proste |
| Overhead Squat | OK z uwagą | gryf nad środkiem stopy (x 6,5 przy biodrze −17,6 na dole), ręce proste; uwaga A |
| Dumbbell Squat | OK | hantle zwisają po bokach |
| One-Arm Overhead Kettlebell Squat | OK z uwagą | odważnik nad głową w prostej ręce, druga ręka w bok; A |
| **Dip Belt Squat** | **BŁĄD** | obok zwisającego odważnika linka od pasa do podłogi (nr 3) |
| Band Squat | OK z uwagą | uwaga B |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Front Squat** | wszystkie klatki, ramiona (oba rzuty) | **Ramiona sterczą pionowo w górę, a łokcie są nad głową.** W u = 0 bark jest w y 138,8, łokieć w (12,5; 167,4), czyli 28,6 cm nad barkiem i 6,6 cm nad środkiem głowy (y 160,8). Przedramię zwisa pionowo do gryfu (chwyt (10,3; 140,6), przedramię 7° od pionu). Zgięcie barku wynosi 154° w każdej klatce, a łokieć 163°. W rzucie z przodu ręce wychodzą ponad głowę, jak przy unoszeniu rąk. Wskazówka `fsq.rack` wyświetlana przy ćwiczeniu mówi: „łokcie wysoko, ramiona mniej więcej poziomo”. Stary model figur (`lib/figures/data.json`, Front Squat) kodował to wprost: bark i łokieć na jednej wysokości ± 12 cm. Nogi i tułów są poprawne (tułów 5° → 18°, przysiad do 97° w biodrze). | Pozycja rack: ramię mniej więcej poziomo w przód (zgięcie barku ok. 80–100°), łokieć na wysokości barku ± 12 cm, przedramię wraca do gryfu leżącego na przednich aktonach barków, łokieć mocno zgięty. | 90% | realny (rodzina gotowa, wyświetlana dziś) | nie: sens-gotowe 0 naruszeń; walidator kontraktu odrzuca pozę z rigu z innego powodu (łokieć 163° > 149°) |
| 2 | **Squat with Bands, Box Squat with Bands, Reverse Band Power Squat, Reverse Band Box Squat** | wszystkie klatki, guma (oba rzuty) | **Guma biegnie pionowo przez środek ciała, od środka gryfu do podłogi między stopami.** Rekwizyt `band`: od (6,5; 137,7; 0) do (6,5; 0; 0) w u = 0 i od (6,5; 86,6; 0) do (6,5; 0; 0) w u = 1. Miednica jest w (5,7; 89; 0), więc linia gumy przechodzi przez tułów, miednicę i krocze. W rzucie z przodu przerywana linia idzie przez oś ciała. Łańcuchy w tym samym rigu mają flagę `bar: true` i są rysowane przy obu końcach gryfu, a guma nie ma tej flagi. W odmianach „Reverse Band” guma jest narysowana tak samo, od dołu, choć w tej odmianie zwisa z góry stojaka i odciąża sztangę na dole ruchu. | Dwie gumy przy końcach gryfu (z ±60–100). W „with Bands” od gryfu do podłogi albo podstawy stojaka. W „Reverse Band” od góry stojaka do gryfu. | 85% | realny | nie: guma nie ma kolidera z ciałem; brak reguły kierunku gumy dla odmian „Reverse” |
| 3 | **Dip Belt Squat** | wszystkie klatki, sprzęt | **Dwa źródła obciążenia naraz: zwisający odważnik i linka do podłogi.** Rekwizyty: łańcuch od pasa do kettlebell (zwisa, w u = 1 środek odważnika y 24) **i** `cable` od kotwy na podłodze (6,5; 0; 0) do pasa. Ta druga to ten sam rekwizyt co w „Przysiad z pasem (linki)”. W u = 1 linka biegnie ukośnie od kotwy do miednicy (−17; 47,8), a na rysunku przy stopach widać punkt zaczepu. Linka przypięta do podłogi nie pozwala odważnikowi swobodnie wisieć, więc obraz czyta się jak przysiad z pasem na wyciągu z dodatkowym ciężarem. | Tylko pas, łańcuch i zwisający ciężar (zwykle stanie na dwóch podwyższeniach, żeby ciężar miał miejsce pod sobą). Bez linki do podłogi. | 70% | realny | nie |

## OK z uwagą (backlog, nie blokuje)

- **A. Bark poza zakresem kontraktu w przysiadach z ciężarem nad głową** (Overhead Squat: zgięcie barku 190–197° względem tułowia przy limicie 171°; One-Arm Overhead KB: 183°, uniesienie 176° przy 170°). Gryf stoi poprawnie nad środkiem stopy, a obraz jest czytelny.
  Ramię 20° „za uchem” względem tułowia to więcej, niż pozwala zakres stawu. Przy pochylonym tułowiu wynika to z utrzymania gryfu w pionie nad stopą. Bardziej prawdziwe byłoby mniejsze pochylenie tułowia na dole (ok. 10–15°, typowe dla tej odmiany) przy barku ≤ 175°. Pewność 55%.
- **B. Band Squat: guma do wyciągniętych rąk.** Guma biegnie od podłogi przy stopach (6,5; 0) do dłoni wyciągniętych w przód na wysokości barków (62,4; 134,9). Zwykle stoi się na gumie i trzyma ją przy barkach albo zakłada na barki, więc guma biegnie prawie pionowo. Wyciągnięte ręce przy gumie ciągnącej w dół to dodatkowe izometryczne unoszenie rąk. Pewność 60%.

## Proponowane reguły

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `rack_ramie_poziomo` | ładunek `frontBar` / `kbRack`: łokieć na wysokości barku ± 12 cm (jak w starym modelu `data.json`) | Front Squat: +28,6 cm | Double KB Front Squat: bez alarmu (do sprawdzenia przy wdrożeniu) |
| `rekwizyt_nie_przenika_ciala` (niezmiennik dla rigów) | linie gumy, łańcucha i linki nie przechodzą przez kapsuły tułowia, miednicy i ud (poza punktem zaczepu ≤ 12 cm) | 4 × guma przez tułów; Dip Belt: linka przez udo w u = 1 | łańcuchy przy końcach gryfu, Cable Squat, pas na linkach: bez alarmu |
| `sens-gotowe` + jakość | przepuszczać rigi przez `sprawdzJakosc` tak jak pozy z danych (dziś `rigowa` pomija sens i jakość w `waliduj`) | — | — |
