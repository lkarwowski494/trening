# Recenzja ruchu 1.1: rodzina plyo (27 ćwiczeń), 27.10.2026

Metoda jak w `core_hang.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2). Uzasadnień generatorów ani opisów commitów nie czytałem.

Przy ruchach szybkich dodatkowo liczyłem na siatce u co 0,0125 (81–161 próbek):

- poślizg stopy w kontakcie, czyli przesunięcie kostki, gdy podeszwa jest < 1,5 cm nad podłożem w kolejnych próbkach;
- odcinki lotu (obie podeszwy > 1,5 cm nad podłogą albo blatem skrzyni);
- tor środka tułowia (średnia miednicy i barków) w locie;
- kąt kolana przy oderwaniu stóp.

Walidator: **27/27 OK**. Szczelność reguł automatycznych: **0 z 6 błędów w pozach (0%)**. Błąd warunkowy W (rzut) jest poza pozami, więc go tu nie liczę.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Jump Squat | OK z uwagą | przysiad 95°, lot u 0,44–0,90, miednica +34 cm, lądowanie z ugięciem 90°; B |
| Tuck Jump | OK z uwagą | B (zygzak 12 cm), C |
| Double Leg Butt Kick | OK z uwagą | B (zygzak 13 cm), D |
| Star Jump | OK z uwagą | z przodu X w u = 0,69 (kostki z ±30, dłonie nad głową na boki); B, **W** |
| Box Jump | OK | skrzynia 50 cm, lot u 0,41–0,91, lądowanie na blacie (podeszwy 50 cm) z ugięciem; błąd `bj.mis.stiff`: lądowanie na prostych nogach |
| Bench Jump | OK | jak Box Jump, blat 40 cm |
| Broad Jump | OK z uwagą | lot +120 cm w przód; E |
| Frog Hops | OK | głęboki przysiad (miednica 43 cm), skok w przód +64 cm, lądowanie w przysiad |
| Front Cone Hops | OK | niski skok w przód (+47 cm, miednica +18 cm) |
| Single-Leg Hop Progression | OK | wolna stopa cały czas ≥ 6,8 cm nad podłogą, skok na prawej nodze +40 cm w przód |
| Single Leg Butt Kick | OK z uwagą | B, D (kolano wolnej nogi 88°, udo w przeproście −11°: noga „w tył”, nie pięta do pośladka) |
| Box Skip | OK | wybicie z jednej nogi, lądowanie na skrzyni 40 cm (obie stopy nad blatem) |
| Single-Leg Stride Jump | OK | jak Box Skip, skrzynia 40 cm |
| Weighted Jump Squat | OK z uwagą | sztanga na plecach, stojak z tyłu; B |
| **Alternate Leg Push-Off** | **BŁĄD** | nr 5 |
| **Single Leg Push-Off** | **BŁĄD** | nr 5 |
| **Split Jump** | **BŁĄD** | nr 1 |
| **Alternate Leg Diagonal Bound** | **BŁĄD** | nr 2 |
| Depth Jump | OK | zejście ze skrzyni 50 cm (lot u 0,05–0,14), lądowanie z ugięciem, od razu skok (u 0,48–0,91, +37 cm) |
| Dumbbell Seated Box Jump | OK | siad na ławce 38 cm, wyskok z siadu, lądowanie na skrzyni 50 cm |
| Lateral Cone Hops | OK z uwagą | skok w bok +53 cm (z), obunóż; **W** |
| Side Hop-Sprint | OK z uwagą | sam skok w bok +58 cm, bez sprintu (uproszczenie); **W** |
| Side Standing Long Jump | OK z uwagą | skok w bok +107 cm; **W** |
| **Lateral Bound** | **BŁĄD** | nr 3 (+ W) |
| Single-Leg Lateral Hop | OK z uwagą | na prawej nodze w bok +45 cm; **W** |
| Lateral Box Jump | OK z uwagą | w bok na skrzynię 40 cm (stopy z 43–67 na blacie); **W** |
| **Side to Side Box Shuffle** | **BŁĄD** | nr 4 (+ W) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Split Jump** | u = 0,10 → 0,35, stopy | **Przed odbiciem stopy suną po podłodze ku sobie.** Start w wykroku (kostki x ±30). Od u = 0,10 do 0,35 podeszwy są 0–2 cm nad podłogą, a kostki zjeżdżają z ±29 do ±11 (każda o 18 cm po podłodze). Dopiero w u ≈ 0,45 obie stopy są razem i odrywają się. Zamiana nóg w locie (u 0,45–0,65) jest poprawna, lądowanie w odwrotnym wykroku też. | Odbicie wprost z wykroku: stopy stoją w miejscu do oderwania (przesunięcie ≤ 3 cm), nogi mijają się dopiero w powietrzu. | 85% | realny | nie: walidator nie mierzy przesunięcia stopy w kontakcie |
| 2 | **Alternate Leg Diagonal Bound** | cały ruch | **Brak „naprzemiennie” i „po skosie”.** Odbicie i lądowanie są obunóż (w u = 0,35 obie podeszwy 3 cm, w u = 1 obie 0–0,7 cm). Kostki stoją przez cały ruch w z ±12 (miednica z = 0), więc nie ma składowej bocznej. Tylna stopa przed odbiciem sunie po podłodze z x −45 do −12 (33 cm). Obraz to skok w dal z wykroku. | Wybicie z jednej nogi, lot w przód i w bok (po skosie), lądowanie na drugiej nodze, z przesunięciem w z co najmniej kilkudziesięciu cm (widoczne z przodu). | 85% | realny | nie |
| 3 | **Lateral Bound** | cały ruch, nogi | **Odbicie i lądowanie na tej samej nodze.** Prawa stopa stoi (z 12, podeszwa 0), lewa jest uniesiona 6,8 cm. Po skoku w bok o 90 cm (miednica z 0 → 90) postać ląduje znów na prawej (podeszwa 0), a lewa nadal wisi (6,8 cm). To ten sam ruch co Single-Leg Lateral Hop (tam +45 cm). Do tego odbicie jest z nogi po stronie kierunku skoku. | Wybicie z nogi przeciwnej do kierunku (lewej przy skoku w prawo), lądowanie na drugiej (prawej), czyli „z nogi na nogę” w bok. | 85% | realny | nie |
| 4 | **Side to Side Box Shuffle** | u ≥ 0,6, stopy i skrzynia | **Obie stopy lądują na skrzyni.** Skrzynia ma blat 12 cm, środek w z = 55. Na końcu obie podeszwy są na wysokości 12 cm (stopy z 43 i 67), więc to skok obunóż w bok na niską skrzynię, jak Lateral Box Jump. | Start z jedną stopą na skrzyni i drugą na podłodze obok. Przeskok w bok nad skrzynią z zamianą stóp: na końcu na skrzyni jest druga stopa, a pierwsza na podłodze po drugiej stronie. | 75% | realny | nie |
| 5 | **Alternate Leg Push-Off**, **Single Leg Push-Off** | u = 0 i u = 1, stopa podłogowa | **Lądowanie bez drugiej stopy, a klatka końcowa ma pauzę.** W u = 1 Alternate stoi lewą stopą na skrzyni (30 cm, x 42), a prawa wisi 20,3 cm nad podłogą w x = 6. Nogi się zamieniły poprawnie. Single kończy prawą na skrzyni, a lewa wisi 39,7 cm nad podłogą (kolano 116°). W u = 0 stopa „na podłodze” w obu jest 4,0 cm nad podłogą. Animacja zatrzymuje się na u = 1, więc postać stoi na jednej nodze na skrzyni z drugą w powietrzu. | W u = 0 i u = 1 stopa podłogowa stoi na podłodze (podeszwa 0), a stopa na skrzyni na blacie. Alternate kończy z zamienionymi nogami, Single z tym samym układem co na starcie. | 70% | realny | nie |

**W. Błąd warunkowy: rzut z boku nie pokazuje ruchu bocznego (8 ćwiczeń).** W `families.ts` rodzina plyo ma `views: ['side']` (status `planned`). W rzucie z boku 7 ćwiczeń bocznych (Lateral Cone Hops, Side Hop-Sprint, Side Standing Long Jump, Lateral Bound, Single-Leg Lateral Hop, Lateral Box Jump, Side to Side Box Shuffle) wygląda jak zwykły skok pionowy (arkusz z boku Lateral Cone Hops jest prawie identyczny jak Jump Squat), a Star Jump nie pokazuje rozkroku. Pozy mają przemieszczenie w z (45–107 cm), ale widać je tylko z przodu. Blokuje wydanie, jeśli rodzina zostanie włączona z samym rzutem z boku. Rozwiązanie: rzut `front` (albo oba rzuty) dla ćwiczeń z ruchem w z. Pewność 90%.

## OK z uwagą (backlog, nie blokuje)

- **A (cała rodzina): odbicie z ugiętych kolan.** W każdym skoku palce odrywają się od podłogi o 1–4 cm, gdy kolana są jeszcze zgięte 32–55° (u ≈ 0,3–0,45). Pełny wyprost (kolano 8°) przychodzi już w powietrzu, 4,3 cm nad podłogą. W rzeczywistości stopy (palce) są na podłodze do pełnego wyprostu. Widoczne na powiększeniu jako „unoszenie się” w fazie odbicia. Pewność 70%.
- **B: tor lotu niebalistyczny.** W skokach pionowych stopy w locie zostają w x ≈ 0–2, a środek tułowia przesuwa się o ok. 30 cm do tyłu i wraca (x +29…39 / −31…37 cm: Jump Squat, Tuck, Butt Kick, Star, Weighted, Single Leg Butt Kick i 6 bocznych). W Tuck Jump i Double Leg Butt Kick miednica w locie opada i znowu się wznosi (106 → 84 → 96 cm, 105 → 84 → 97 cm; zygzak 12–13 cm). W locie środek ciężkości porusza się po paraboli: w poziomie ze stałą prędkością, w pionie najpierw w górę, potem w dół.
- **C: Tuck Jump: kolana do wysokości bioder, nie do klatki** (biodro 118°, tułów 18° w przód, u = 0,73, już w fazie opadania). Pewność 60%.
- **D: pięty daleko od pośladków.** Double Leg Butt Kick: kolano 100° przy biodrze 2° (goleń poziomo). Single: kolano 88° przy biodrze −11°. Przy „butt kick” kolano jest zgięte ok. 120–140°. Pewność 65%.
- **E: Broad Jump: odbicie prawie pionowe.** Tułów pochylony 9° w chwili oderwania (u = 0,49), w locie pionowo. W skoku w dal z miejsca odbicie jest wyraźnie w przód, a przed lądowaniem nogi wychodzą przed ciało. Odległość (+120 cm) jest dobrze widoczna. Pewność 65%.
- **F: animacja wahadłowa.** Skoki z przemieszczeniem (Broad Jump, Box Jump, skoki w bok) w fazie 1 → 0 cofają się tym samym torem, czyli skok wstecz albo zeskok tyłem ze skrzyni. To ograniczenie silnika (uwaga przekrojowa w `README.md`).

## Proponowane reguły

| Reguła | Warunek | Błędy | Pozostałe |
|---|---|---|---|
| `stopa_w_kontakcie_stoi` (niezmiennik) | gdy podeszwa < 1,5 cm nad podłożem w kolejnych próbkach (siatka ≥ 80), przesunięcie kostki ≤ 3 cm, chyba że ćwiczenie deklaruje marsz w miejscu (wtedy tylko do tyłu, jak `strongman.md`) | Split Jump 18 cm, Diagonal Bound 33 cm | pozostałe skoki ≤ 2 cm |
| `lot_balistyczny` | w odcinku lotu środek tułowia ma w y jedno maksimum (zygzak ≤ 3 cm), a w x i z zmienia się monotonicznie (cofnięcie ≤ 5 cm) | Tuck, Butt Kick (y); B (x) | Box, Broad, Frog: x monotoniczne |
| `noga_odbicia_ladowania` | ćwiczenia „bound” / „alternate”: noga w kontakcie przy ostatniej próbce przed lotem ≠ noga przy pierwszym kontakcie po locie | Lateral Bound, Diagonal Bound | Single-Leg Lateral Hop, Hop Progression (ta sama noga, poprawnie) |
| `podparcie_klatek_koncowych` | w u = 0 i u = 1 każda stopa jest w kontakcie (≤ 1 cm) z podłogą albo sprzętem, chyba że ćwiczenie deklaruje stanie na jednej nodze | Push-Off ×2 (20 / 40 cm, start 4 cm) | Single-Leg Hop (wolna noga zadeklarowana) |
| `rzut_dla_ruchu_bocznego` | gdy zakres z miednicy w pozie > 20 cm albo rozstaw kostek zmienia się > 20 cm, rodzina albo ćwiczenie musi mieć rzut `front` | W (8 ćwiczeń) | — |

Progi to konwencja rysunku do potwierdzenia przez badacza. Dobrane na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.
