# Recenzja ruchu 1.1: rodzina row (12 ćwiczeń), 27.10.2026

Metoda jak w `dip.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2).

Walidator: **12/12 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Bent Over Row (sztanga) | OK z uwagą | tułów 55° od pionu, kolana 35°, sztanga zwisa pod barkiem (x 9 przy barku 3) i idzie do brzucha (−15; 78), łokieć 18° → 119°; uwaga C |
| Bent Over Row (hantle) | OK z uwagą | jak wyżej; C |
| Reverse Grip Bent Over Row | OK z uwagą | podchwyt (obrót przedramienia +78°), łokcie bliżej (odwiedzenie 18°); C |
| Barbell Rear Delt Row | OK z uwagą | szeroki chwyt ±36, łokcie na boki (odwiedzenie 25° → 80°), ciągnięcie do klatki; C |
| Pendlay Row | OK z uwagą | tułów prawie poziomo (80°), sztanga z podłogi (y 23 = promień talerza); C |
| Smith Machine Bent Over Row | OK z uwagą | prowadnica, sztanga pionowo (x 11 stale); C |
| Bent Over Row (linki) | OK z uwagą | jak hantle, linki od dołu; C |
| **One Arm Row (hantle)** | **BŁĄD** | brak ławki, wolna ręka w powietrzu (nr 1) |
| T-Bar Row | OK z uwagą | dźwignia za plecami (oś x −85), chwyt–oś 101,0 / 101,1 cm (stały promień), chwyt wąski ±10; C |
| Seal Row (sztanga) | OK | leżenie przodem na ławce 80 cm, sztanga spod ławki (y 26 → 66), łokieć 12° → 118° |
| Lying T-Bar Row | OK z uwagą | uwaga D (biodro −37°, wyjątek zakresu) |
| Chest Supported Row | OK z uwagą | D; ruch rąk poprawny (łokieć 15° → 121°, łokcie wzdłuż tułowia, odwiedzenie 5–8°) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **One Arm Row (hantle)** | wszystkie klatki: sprzęt, lewa ręka, nogi | **Nie ma ławki, a wolna ręka wisi w powietrzu.** Sprzęt to tylko `podloga` i `hantel`. Postać stoi w rozkroku: kostka R x −10, kostka L x 14, oba kolana ok. 61° zgięte, tułów 68° od pionu. Lewa dłoń stoi przez cały ruch w (42,4; 55,7; −22), czyli 35 cm przed lewym kolanem (7,3; 47,2) i 9 cm nad nim, i nie dotyka niczego. Wskazówka `setup` wyświetlana przy ćwiczeniu mówi: „Oprzyj kolano i dłoń jednej strony na ławce; tułów mniej więcej równolegle do podłogi”. Ruch ręki pracującej jest poprawny (hantel (30; 33) → (−1; 73), łokieć w tył, 18° → 115°). | Ławka (`lawka`, blat ok. 45 cm): lewe kolano i lewa dłoń na blacie, prawa noga na podłodze, tułów bliżej poziomu (≈ 75–90° od pionu). Jeśli rysujemy wariant stojący, wolna dłoń musi opierać się o udo przedniej nogi, a wskazówka `setup` musi się zmienić. | 85% | realny | nie: `sprzet_rozpoznawczy` nie wymaga ławki (katalog nie ma `requires`), a reguła sensu nie sprawdza, czy wolna ręka ma podparcie |

## OK z uwagą (backlog, nie blokuje)

- **C. Błąd `mis.roundBack` niewidoczny w pierwszej klatce** (8 ćwiczeń z pochyleniem). Delta w u = 0 jest zerowa, a zgięcie kręgosłupa rośnie 0 → 16° → 32° dopiero w trakcie ciągnięcia. Pierwsza klatka wiersza błędu jest więc identyczna z pozą poprawną.
  Zaokrąglenie pleców w wiosłowaniu w pochyleniu to błąd postawy, najczęściej widoczny już na dole ruchu. Lepiej, żeby było widoczne stale, np. 25–30° od u = 0. Pewność 60%.
- **D. Leżenie przodem na ławce skośnej z biodrem w przeproście −37°** (Lying T-Bar Row, Chest Supported Row; ten sam wzorzec w Spider Curl ×2, Front Incline Dumbbell Raise, Reverse Flyes With External Rotation, Middle Back Shrug).
  Uda leżą poziomo na siedzisku, a tułów na oparciu pod kątem 45°. To jawny wyjątek zakresu (`figury-sens.json → zakres_wyjatki`, hipMin −45, „uproszczenie ilustracyjne”, decyzja właściciela 26.10.2026), więc nie liczę go jako błędu.
  Anatomicznie wyprost biodra o 37° przy kręgosłupie bez wygięcia leży jednak poza zakresem (limit kontraktu −17°). W praktyce osoba na ławce skośnej opiera stopy o podłogę za siedziskiem albo w rozkroku, a biodro jest wtedy blisko neutralnego lub lekko zgięte.
  Da się to narysować w obecnym modelu bez wyjątku: miednica na krawędzi siedziska, uda w dół do stóp na podłodze. Propozycja: przy najbliższej rundzie zastąpić wyjątek tą pozycją. Pewność 70%.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `podparcie_ze_wskazowki` | gdy wskazówka `setup` ćwiczenia wymienia podporę („na ławce”, „o podporę”, „oparciem”), poza musi mieć ten sprzęt, a wymieniona część ciała musi leżeć ≤ 3 cm od jego powierzchni | One Arm Row: brak ławki, dłoń 9 cm nad kolanem i bez kontaktu | Seal Row, Chest Supported: klatka na ławce, bez alarmu |
