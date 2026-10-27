# Recenzja ruchu 1.1: rodzina chest_press_machine (5 ćwiczeń), 27.10.2026

Metoda jak w `cable_row.md`: `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/chest_press_machine.json`, podgląd `htmlPodgladu`, PNG w pełnej rozdzielczości z powiększeniem kadrów, liczby silnikiem v2 (`keyframeFrame`, `jointAngles`, odległość ramienia dźwigni od środka głowy). Uzasadnień generatorów nie czytałem.
Rodzina ma status `planned` i widok tylko z boku (`views: ['side']`), więc oceniam rzut z boku. Rzut z przodu z podglądu walidatora pomijam. Współrzędne: x w przód, y w górę, z w prawo, cm. Promień głowy 9,5 cm (`BODY.headR`).

Walidator: **5/5 OK**. Szczelność reguł automatycznych: **0 z 2 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Machine Chest Press | OK z uwagą | siedzisko 45, oparcie 85°, uchwyty 7 cm pod barkiem (środek klatki, `mcp.seat`), wypychanie poziomo (98,3 → 108,5), łokieć 148° → 22°; dźwignia z osią nad głową ≥ 20,6 cm od środka głowy; uwaga A |
| Leverage Incline Chest Press | OK z uwagą | oparcie 50° (tułów 40° od pionu), wypychanie 38° nad poziom przy prostopadłej do tułowia 40°, łokieć 148° → 22°; A |
| **Leverage Decline Chest Press** | **BŁĄD** | łokieć wędruje za głowę (nr 1) |
| **Machine Shoulder Press** | **BŁĄD** | koniec dźwigni przy ustach, uchwyty na wysokości ust (nr 2) |
| Smith Machine Shoulder Press | OK z uwagą | prowadnica x 25 (22 cm przed środkiem głowy), sztanga pionowo y 119 → 164,8, łokieć 133° → 15°; uwaga B |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Leverage Decline Chest Press** | u = 0,25–0,75, ramię i łokieć (rzut z boku) | **Łokieć przechodzi za głowę, ruch wygląda jak przenoszenie ręki nad głową, a nie wyciskanie.** Leżenie głową w dół na ławce ujemnej (−20°), bark (−50,5; 52,5), głowa (−71,2; 45). W u = 0 łokieć jest poprawnie pod barkiem i lekko ku stopom (−39,2; 44,1). W u = 0,25 przeskakuje 35 cm ku głowie, na (−74,2; 53,2), a w u = 0,5 jest w (−78,4; 59,4), czyli 28 cm za barkiem w stronę głowy, nad twarzą. Ramię odchyla się wtedy od prostopadłej do tułowia o ok. 56° ku głowie, a przedramię o ok. 48° ku stopom, więc łokieć „prowadzi” ku głowie i tworzy literę V. Bark sagitalnie skacze z −57° (u = 0) na 158° (u = 0,25). Na powiększeniu klatek u = 0,25–0,75 łokieć leży przy twarzy, a dłoń nad klatką. Koniec ruchu jest poprawny: dłonie (−69,9; 111,8) na prostopadłej do tułowia, łokieć 22°. | Łokieć w całym ruchu blisko płaszczyzny barku prostopadłej do tułowia (ramię ≤ 20–30° od prostopadłej, raczej ku stopom), przedramię w linii pchania (prostopadle do tułowia, por. decyzja właściciela o wyciskaniu: „przedramiona pionowo”). Dłoń jedzie po łuku dźwigni od klatki do wyprostu, łokieć stale z boku, nie za głową. | 85% | realny | nie: zakresy stawów i ciągłość przechodzą (bark 158° mieści się w zakresie 171°). Brak reguły o położeniu łokcia względem płaszczyzny barku w wyciskaniach |
| 2 | **Machine Shoulder Press** | u = 0–0,5, koniec dźwigni i dłonie (rzut z boku) | **Ramię dźwigni kończy się przy ustach.** Dźwignia jest jedna, w z = 0 (`trzyma: obie`), z punktem mocowania w środku między dłońmi. W u = 0,25 ten punkt (12,6; 131,3; 0) leży 10,5 cm od środka głowy (3; 126,9; 0), czyli ok. 1 cm od twarzy, także w 3D, bo oba punkty są w z = 0. Na powiększeniu klatek u = 0,125–0,25 pręt wchodzi w usta jak fajka. Uchwyty w u = 0 są w y 120,2, czyli 15 cm nad barkiem (y 105), na wysokości ust. Wskazówka `msp.seat` mówi: „uchwyty mniej więcej na wysokości barków”. Łokcie idą do przodu (bark sagitalnie 53°, odwiedzenie 27°). | Opis kontraktu `dzwignia` mówi: „dla maszyn z dźwigniami po bokach (…, wyciskanie) rysujemy JEDNĄ dźwignię po jednej stronie (trzyma "R"), z poza ciałem”. Dźwignia przy prawej dłoni w z ≥ 30 nie zbliża się do twarzy. Uchwyty startowe na wysokości barków (y ok. 105–110), po bokach głowy. | 80% | realny | nie: kolider ramienia dźwigni pomija ostatnie 25 cm przy punkcie mocowania (`EQUIP.leverEnd`), a punkt mocowania „obie” leży w osi ciała |

## OK z uwagą (backlog, nie blokuje)

- **A. Łokcie przy tułowiu w wyciskaniach na maszynie** (Machine Chest Press, Leverage Incline: odwiedzenie ramienia 10–25°). Ramię w połowie ruchu biegnie prawie wzdłuż tułowia. To dopuszczalny wariant (uchwyty neutralne), ale typowe ustawienie przy uchwytach poziomych to ok. 45–60°. Pewność 55%.
- **B. Smith Machine Shoulder Press:** sztanga opuszczona do y 119 (podbródek, 14 cm nad barkiem; `ohp.move` mówi „do barków”), a wyprost kończy się 20 cm przed barkiem (bark sagitalnie 149°), czyli ramiona ok. 30° przed pionem. To wynika z prowadnicy w x 25. Prowadnica bliżej (x ok. 12–15) dałaby wyprost nad głową i zejście do górnej części klatki. Pewność 60%.

## Proponowane reguły

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `lokiec_przy_plaszczyznie_barku` (wyciskania: bench, chest_press_machine, cable_press) | w każdej klatce rzut ramienia na płaszczyznę strzałkową odchyla się od prostopadłej do tułowia ≤ 45° ku głowie | Decline: 56° ku głowie w u = 0,5 | Machine Chest Press, Incline: łokcie ku biodrom, bez alarmu; Seated/Incline Cable Press: bez alarmu |
| `dzwignia_z_dala_od_glowy` (niezmiennik) | cały odcinek dźwigni, łącznie z końcówką przy punkcie mocowania, ≥ 3 cm od powierzchni głowy | Machine Shoulder Press: 1,0 cm | pozostałe 4: ≥ 11 cm od powierzchni głowy |
