# Recenzja ruchu 1.1: rodzina core_standing (16 ćwiczeń), 27.10.2026

Metoda jak w `core_hang.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości w obu rzutach, liczby silnikiem v2: pola skrętu, skłonu i pochylenia tułowia oraz położenie chwytu). Uzasadnień generatorów ani opisów commitów nie czytałem. Rodzina ma w aplikacji rzuty `front` i `side`.

Walidator: **16/16 OK**. Szczelność reguł automatycznych: **0 z 3 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Barbell Side Bend | OK | sztanga na barkach, skłon boczny 0 → 28°, miednica i nogi bez ruchu |
| Side Bend (hantel) | OK | hantel w prawej, skłon 28° w stronę ciężaru, lewa dłoń przy biodrze |
| One-Arm High-Pulley Cable Side Bends | OK | wyciąg wysoko z prawej (y 210), skłon −26° od wyciągu |
| Weighted Ball Side Bend | OK | siad na piłce (miednica 65 cm), hantel w prawej, skłon 26° |
| Bosu Ball Cable Crunch With Side Bends | OK | siad na bosu, linki zza głowy, skłon w przód (−8° → 24°) ze skłonem bocznym 24° |
| Russian Twist | OK | siad z odchyleniem 45°, stopy na podłodze, skręt ±38° |
| Medicine Ball Full Twist | OK | stanie, piłka przed klatką, skręt ±40° |
| Cable Russian Twists | OK | siad na piłce, wyciąg z boku na wysokości klatki, skręt ±36° |
| Pallof Press | OK | wyciąg z boku, wypchnięcie rąk przed klatkę bez skrętu tułowia (antyrotacja) |
| Pallof Press With Rotation | OK | jak wyżej, z obrotem 0 → −30° |
| Cable Woodchop | OK | wyciąg wysoko z prawej (190 cm), ruch po skosie w dół do lewego biodra, skręt 28 → −30°, pochylenie 18° |
| Cable Judo Flip | OK | wyciąg nisko z lewej, ruch po skosie w górę, skręt −28 → 30° |
| Landmine Rotation | OK z uwagą | uwaga A |
| **Kettlebell Windmill** | **BŁĄD** | nr 1 |
| **Double Kettlebell Windmill** | **BŁĄD** | nr 1 |
| **Bent Press** | **BŁĄD** | nr 2 |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Kettlebell Windmill, Double Kettlebell Windmill** | u = 0 → 1, tułów i biodra | **Płytki skłon boczny zamiast „wiatraka”.** Tułów ma tylko `przechylTulowia` 0 → −34°, a `pochylenieTulowia` 0 i `zgiecieKregoslupa` 0 przez cały ruch. Biodro zgina się do 30–36°, miednica stoi w z = 0 (bez wypchnięcia biodra w bok), a wolna dłoń schodzi tylko z 83 do 64 cm, czyli do połowy uda. Z przodu obraz to skłon boczny z ciężarem nad głową. | Biodro wypchnięte w stronę ciężaru (miednica przesuwa się w z), zgięcie w biodrze z obrotem tułowia ku nodze przeciwnej. Wolna dłoń zjeżdża wzdłuż nogi do kolana i niżej (ok. 10–40 cm nad podłogą), ręka z ciężarem pionowo, wzrok na ciężar. | 70% | realny | nie: `stopien_swobody` sprawdza zakres pól, a nie głębokość sięgnięcia ani zgięcie bioder |
| 2 | **Bent Press** | u = 0 | **Brak wyciskania: hantel jest nad głową na prostej ręce od pierwszej klatki.** W u = 0 łokieć ma 10°, a hantel jest na 202 cm. Dalej ruch jest prawie identyczny jak Kettlebell Windmill (skłon −30°, biodro do 31°, wolna dłoń do 67 cm), ten sam zestaw wskazówek (`windmill`). | Start z hantlem przy barku (łokieć zgięty). Tułów pochyla się w bok i w przód pod ciężarem, a ręka prostuje się, bo ciało schodzi w dół. Pionowy wyprost ręki osiąga się na końcu, w skłonie. | 80% | realny | nie: `wariant_rozny_od_bazy` (partia rec-11) albo reguła „ręka zgięta w u = 0” by to złapały |

## OK z uwagą (backlog, nie blokuje)

- **A. Landmine Rotation: mały łuk przy pasie.** Koniec sztangi jest w dłoniach na wysokości 100 cm (pas), 30 cm przed ciałem, przy łokciach 57–71°. Przy skręcie ±32° dłonie przesuwają się tylko o ±17 cm. W typowym wykonaniu ręce są wyprostowane przed klatką, a koniec sztangi zatacza łuk od biodra do biodra nad poziomem barków. Pewność 60%.

## Proponowana reguła

| Reguła | Warunek | Błędy | Pozostałe |
|---|---|---|---|
| `windmill_glebokosc` | „Windmill”: w u = 1 wolna dłoń ≤ 45 cm nad podłogą i zgięcie biodra ≥ 60° | nr 1 (64 cm, 36°) | — |
| `bent_press_start_przy_barku` | „Bent Press”: w u = 0 łokieć ręki z ciężarem ≥ 90° | nr 2 (10°) | — |
