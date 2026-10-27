# Recenzja ruchu 1.1: rodzina lunge (24 ćwiczenia), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2 w klatce startowej, najgłębszej i końcowej; środek ciężkości jak w `leg_machine.md`).

Walidator: **24/24 OK**. Szczelność reguł automatycznych: **0 z 4 błędów (0%)**. Wszystkie 4 to jedna klasa (nr 1).

Kolana we wszystkich 24 pozach zginają się we właściwą stronę. Środek ciężkości leży między stopami albo nad stopą podporową we wszystkich klatkach, więc reguła z `leg_machine.md` nie daje tu alarmu.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Split Squat | OK z uwagą | Rozkrok 89 cm, tylna stopa na palcach. Miednica 71 → 50, przednie kolano 57° → 95°, tylne kolano w dole 5 cm nad podłogą, tułów 6°. Uwaga A |
| Split Squat (linki) | OK z uwagą | Jak wyżej, linka z bloczka przed osobą do dłoni przy biodrach. Uwaga A |
| Reverse Lunge | OK | Z postawy (miednica 90) krok w tył: tylna kostka (−89; 20), miednica 50, przednie kolano 95°, tylne kolano tuż nad podłogą (`lunge.back`) |
| Walking Lunges | OK | Z postawy krok w przód: przednia kostka 0 → 89, miednica x 0 → 53 i y 90 → 50, hantle w opuszczonych rękach (`lunge.dbSetup`). Animacja wahadłowa pokazuje krok i powrót, a nie marsz (przybliżenie) |
| Lunges (hantle) | OK | Jak Walking Lunges (wykrok w przód z powrotem, `lunge.fwd`) |
| Lunges (sztanga) | OK | Jak wyżej, sztanga na plecach |
| Barbell Walking Lunge | OK | Jak wyżej |
| Elevated Back Lunge | OK | Przednia stopa na podwyższeniu (12 cm), krok w tył dłuższy (tylna kostka x −100), miednica 90 → 50 |
| Slider Reverse Lunge | OK | Jak Reverse Lunge, tylna stopa sunie na ślizgaczu (kostka x 0 → −91) |
| Step Up | OK | Stopa R na skrzyni (blat 40). Miednica 88 → 130, kolano R 90° → 7°, na górze kolano L uniesione (87°), tułów 8° → 4° |
| Barbell Step Up | OK | Jak wyżej, sztanga na plecach |
| Pistol Squat | OK | Na jednej nodze: kolano 12° → 128°, miednica 90 → 38, tułów 2° → 34°, wolna noga w przód (kolano 31°, pięta nad podłogą). Środek ciężkości nad stopą (x 6 przy stopie −6…19) |
| Smith Machine Pistol Squat | OK | Jak wyżej, sztanga na prowadnicy, tułów 16° stale (opór o gryf) |
| Single-Leg High Box Squat | OK | Jak Pistol do miednicy 53, siad na skrzyni za osobą (blat 43,6, miednica nad skrzynią) |
| Lunge Pass Through | OK z uwagą | Krok w tył z kettlebell w prawej dłoni, tułów 6° → 35°. W dole obie dłonie spotykają się pod przednim udem (kettlebell (−15; 34; 6)). Uwaga B |
| Curtsy Lunge | OK | Krok w tył po skosie: tylna stopa przechodzi za przednią na drugą stronę (z −10 → +22, x −74), miednica 53, przednie kolano 95° w linii stopy |
| Crossover Reverse Lunge | OK | Poza identyczna z Curtsy Lunge (to samo ćwiczenie pod inną nazwą) |
| **Bulgarian Split Squat (hantle)** | **BŁĄD** | ruch tylko w dolnych 8 cm (nr 1); uwaga C |
| **Bulgarian Split Squat (sztanga)** | **BŁĄD** | nr 1; uwaga C |
| **Smith Machine Bulgarian Split Squat** | **BŁĄD** | nr 1; uwaga C |
| **Suspended Split Squat** | **BŁĄD** | nr 1 |
| Lateral Lunge | OK | Rozkrok 80 cm, miednica przesuwa się w bok nad prawą stopę (z 0 → 22, y 79 → 57), kolano R 52° → 100°, lewa noga prosta (10°), tułów 26° |
| Cossack Squat | OK | Jak wyżej, głębiej: miednica 47, kolano 112° |
| Barbell Side Split Squat | OK | Jak Lateral Lunge, sztanga na plecach |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Bulgarian Split Squat (hantle), (sztanga), Smith Machine Bulgarian Split Squat, Suspended Split Squat** (4) | wszystkie klatki, miednica i przednie kolano | **Pokazany jest tylko dół ruchu: postać tkwi w głębokim wykroku i ugina się o 8 cm.** Bulgarian: miednica y 52 → 44 cm, przednie kolano 84° → 95°, tylne 85° stale, tylne kolano y 23 → 19. Suspended: miednica 58 → 50 cm, przednie kolano 82° → 95°. Klatki na podglądzie prawie się nie różnią. Wskazówka `bss.move`: „Opuść się… aż tylne kolano będzie tuż nad podłogą; wstań, odpychając się przednią nogą”. W tym samym pliku Split Squat ma 21 cm ruchu (71 → 50), a Reverse Lunge 40 cm. | Góra: przednia noga prawie prosta (kolano ok. 10–20°), miednica ok. 30–35 cm wyżej niż w dole (y ≈ 75–80). Dół: tylne kolano tuż nad podłogą (oś ok. 10 cm, jak w Split Squat). | 90% | realny (każde wyświetlenie) | nie: wymóg ruchu (`minMotionCm`) jest spełniony, bo 8 cm przekracza próg, a reguła nie porównuje zakresu z ćwiczeniem |

## OK z uwagą (backlog, nie blokuje)

- **A. Split Squat (oba): góra niepełna.** W u = 0 oba kolana mają 56–57°, a miednica jest na y 71. Przy tym rozkroku miednica może wstać do ok. y 80 przy kolanach 10–15° (geometria: przednia kostka 36 cm, tylna 53 cm od rzutu miednicy, noga 83 cm). Na podglądzie postać „startuje” w półwykroku. Pewność 60%.
- **B. Lunge Pass Through:** przekazanie kettlebell pod udem do drugiej dłoni nie jest pokazane. `trzyma: R` przez cały ruch, a animacja wahadłowa wraca z kettlebell w prawej dłoni. Jako przybliżenie do przyjęcia, ale ruch zgodny z nazwą to przełożenie ciężaru z ręki do ręki. Pewność 50%.
- **C. Bulgarian (3 warianty): tylna stopa na czubku palców.** Palce (−106,6; 30,0) na blacie ławki, pięta (−110,9; 54,6), czyli stopa prawie pionowo. Wskazówka `bss.setup`: „oprzyj na niej grzbiet tylnej stopy”. Grzbiet stopy powinien leżeć na blacie (podeszwa w górę). Pewność 60%.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `zakres_wykroku` | rodzina lunge (bez izometrii): różnica wysokości miednicy między klatką najwyższą a najniższą ≥ 20 cm, a przednie kolano w klatce najwyższej ≤ 60° | 4 ćwiczenia: 8 cm, kolano 82–84° | Split Squat 21 cm / 57° (na granicy), pozostałe 19 ≥ 37 cm |
