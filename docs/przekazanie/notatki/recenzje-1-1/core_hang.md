# Recenzja ruchu 1.1: rodzina core_hang (3 ćwiczenia), 27.10.2026

Recenzent niezależny (bramka wydania 1.1, decyzja właściciela 27.10.2026, wariant A). Pozy z `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/core_hang.json`. Uzasadnień generatorów ani opisów commitów nie czytałem.

Metoda jak w `pilotaz/recenzja-n6.md` i `dip.md`:

- Podgląd zapisanych póz: `htmlPodgladu` z `v2-validate.mjs` oraz własny render tymi samymi funkcjami silnika (`dataShapes`, `svgDocument`) w większej skali. Klatki są zawijane po 6–8, osobno rzut z boku, z przodu i wiersze błędów.
- PNG oglądałem w pełnej rozdzielczości, a wątpliwe kadry powiększałem 3×.
- Każde podejrzenie sprawdziłem liczbami silnika v2 (`keyframeFrame`, `jointAngles`) w klatkach kluczowych i na siatce u co 0,0125: poślizg stopy w kontakcie, lot, wysokość miednicy.
- Ruch porównywałem ze wskazówkami (`lib/cues`, `cue-sets.json`) i z regułami sensu (`data/zrodla/figury-sens.json`).
- Współrzędne: x w przód, y w górę, z w prawo osoby, w cm.

Walidator (`waliduj` na każdej pozie): **3/3 OK**. Szczelność reguł automatycznych: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Hanging Knee Raise | OK z uwagą | biodro 10° → 100°, kolano 6° → 110°, łokcie proste (15–16°); uwagi A, B |
| Hanging Leg Raise | OK z uwagą | biodro 10° → 83° (nogi ok. poziomo), kolana 6–12°; uwagi A, B |
| **Toes to Bar** | **BŁĄD** | palce kończą 58 cm od drążka (nr 1) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Toes to Bar** | u = 1, nogi i tułów | **Palce nie dochodzą do drążka.** W u = 1 palce stoją w (52,7; 204,6), a drążek w (0; 230), czyli 25 cm niżej i 53 cm przed nim (odległość 58 cm). Biodro zgięte 119°, kolana proste (10°), tułów odchylony 26° do tyłu. Na powiększeniu ostatniej klatki stopy są na wysokości czoła, daleko przed dłońmi. Obraz to wysokie unoszenie nóg, a nie „palce do drążka”, i niewiele różni się od Hanging Leg Raise (83°). | Palce dotykają drążka między dłońmi albo tuż obok (≤ 5–10 cm). Biodro zgięte ok. 150–170°, miednica wyraźnie unosi się i cofa pod drążek, tułów mocniej odchylony do tyłu, a barki „dociskają” drążek (ramię mniej uniesione niż w zwisie). | 90% | realny (każde wyświetlenie) | nie: `palce_do_drazka` wymaga tylko, żeby nogi w u = 1 były ≥ 45° nad poziomem (jest ok. 51°), a nie mierzy odległości palców od drążka |

## OK z uwagą (backlog, nie blokuje)

- **A. Miednica się nie zwija** (Knee Raise, Leg Raise). Zgięcie kręgosłupa przez cały ruch wynosi 0°. Wskazówka `hang.ribs` i źródło reguły (ISSA: „tuck their pelvis… curling the hips up and under”) mówią o podwinięciu miednicy na górze. Ruch nóg jest poprawny, ale ćwiczenie „na brzuch” wygląda jak samo zgięcie bioder. Propozycja: w u = 1 zgięcie kręgosłupa 15–25°. Pewność 70%.
- **B. Drążek w rzucie z boku jest prawie niewidoczny.** To przekrój o średnicy kilku pikseli ukryty w dłoni (rzut z przodu pokazuje go dobrze). W aplikacji rodzina ma tylko rzut z boku (`families.ts`, `views: ['side']`), więc użytkownik widzi wiszącą postać bez drążka. To ograniczenie rysunku sprzętu, a nie pozy.

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `palce_przy_drazku` | Toes to Bar: w u = 1 odległość palca od osi drążka ≤ 12 cm | 58 cm | nie dotyczy pozostałych |

Próg to konwencja rysunku do potwierdzenia przez badacza.
