# Recenzja ruchu 1.1: rodzina back_extension (3 ćwiczenia), 27.10.2026

Recenzent niezależny (bramka wydania 1.1, decyzja właściciela 27.10.2026, wariant A), partia 2 (dół ciała i tył). Oceniam pozy z `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/back_extension.json`. Uzasadnień generatorów ani opisów commitów z pozami nie czytałem.

Metoda jak w `pilotaz/recenzja-n6.md` i `dip.md`:

- Podgląd z zapisanych póz rysowałem `htmlPodgladu` z `v2-validate.mjs`: wszystkie klatki kluczowe, rzut z boku i z przodu, wiersze błędów. `agent-pozy/run.mjs --podglad` generuje pozy od nowa z generatora, więc go nie używałem.
- PNG oglądałem w pełnej rozdzielczości, kadry z wątpliwościami powiększone 3×.
- Każde podejrzenie sprawdziłem liczbami z silnika v2 (`keyframeFrame`, `jointAngles`, kształty `dataShapes`) na siatce u = 0…1 co 0,05.
- Kierunek zgięcia kolana mierzyłem osobno: odsunięcie kolana od linii biodro–kostka, rzutowane na „przód uda”. „Przód uda” to wektor `front` tułowia obrócony o kąt uda. Ujemne odsunięcie oznacza kolano wygięte do tyłu.
- Ruch porównywałem ze wskazówkami techniki (`lib/cues`, `cue-sets.json`).
- Współrzędne: x w przód sceny, y w górę, z w bok, w cm.

Walidator (`v2-validate.mjs`): **3/3 OK**. Szczelność reguł automatycznych w tej rodzinie: **0 z 2 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Back Extension** | **BŁĄD** | kolana wygięte do tyłu o 18° w każdej klatce (nr 2); poza tym ruch poprawny: biodro −13° → 73°, tułów sztywny (kręgosłup 0°), pięty pod wałkiem; uwagi A, B |
| **Reverse Hyperextension** | **BŁĄD** | kolana wygięte do tyłu o 17–33° w każdej klatce (nr 1); uwaga C |
| Lower Back Curl | OK z uwagą | uwaga D (mały zakres, kolano 14° do tyłu, stopy w bok) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Reverse Hyperextension** | wszystkie klatki, oba kolana (rzut z boku) | **Kolana zginają się do tyłu.** Postać leży przodem na podpórce (`front` tułowia w dół), a biegun kolana w danych jest skierowany ku tyłowi uda. Kolano leży 6,2–11,4 cm po tylnej stronie linii biodro–kostka, więc kąt w kolanie to przeprost: 17–18° w klatkach kluczowych (u = 0; 0,25; 0,5; 0,75; 1) i **33° w u = 0,35–0,40 oraz 0,60–0,65**, bo interpolacja skraca odcinek biodro–kostka. Przykład u = 0,6: biodro (≈19; 101,8), kolano (60,1; 93,0), kostka (88,9; 63,9), czyli goleń opada ku podłodze bardziej niż udo. Na powiększeniu klatki u = 0,5 kolano wygina się wyraźnie wierzchołkiem do góry. Zdrowe kolano ma przeprost rzędu kilku stopni, a 33° to staw złamany do tyłu. | Nogi proste (0–5°) albo lekko zgięte „normalnie”: pięty ku sufitowi, kolano po przedniej (dolnej) stronie linii. W danych biegun kolana ku przodowi uda (w dół, ku podłodze), a kostki tak, żeby odcinek biodro–kostka nie skracał się między klatkami. | 90% | realny (każde wyświetlenie) | nie: `jointAngles.knee` jest bez znaku, a zakres kolana (min 0) nie odróżnia zgięcia od przeprostu |
| 2 | **Back Extension** | wszystkie klatki, oba kolana | **Ta sama klasa: kolana wygięte do tyłu o 18°** (stale, nogi są nieruchome). Biegun kolana `[0,3; 1; 0]` przy postaci leżącej przodem wskazuje tył uda. Odcinek biodro–kostka ma 82,0 cm przy długości nogi 83 cm, więc IK musi zgiąć kolano, i zgina je w złą stronę. Kolano leży 6,4 cm za linią: biodro (−8,1; 99,4), kolano (27,8; 77,7), kostka (54,7; 46,7). Na powiększeniu nogi widać załamanie wierzchołkiem do góry. Mniej rzuca się w oczy niż w nr 1, ale to staw w niemożliwej pozycji przez cały ruch. | Nogi proste: kolano 0–5° albo lekkie zgięcie z biegunem ku przodowi uda (w dół). Najprościej: biegun `[−0,3; −1; 0]` albo kostka o ok. 1 cm dalej, żeby noga była wyprostowana. | 80% | realny | nie (jak wyżej) |

## OK z uwagą (backlog, nie blokuje)

- **A. Back Extension, góra ruchu:** biodro w −13° (przeprost przy prostym kręgosłupie), więc tułów wznosi się ponad linię nóg. Wskazówka `bext.noArch` mówi: „Na górze kończ w linii prostej”. Lepiej biodro ok. 0° (tułów w przedłużeniu nóg). Pewność 60%.
- **B. Back Extension, ręce:** zwisają pionowo w każdej klatce (dłoń stale 42 cm pod barkiem, łokieć 94°, łokcie na boki 34°). Ramię względem tułowia zmienia się więc od 37° do 119°, jak u bezwładnej lalki. Typowo ręce są skrzyżowane na klatce albo dłonie przy skroniach i poruszają się razem z tułowiem. Do tego podpórka 3,1–3,3 cm od uda i tułowia w u = 0–0,5, co widać jako szparę. Pewność 55%.
- **C. Reverse Hyperextension, dłonie:** chwyt w (−57; 96; ±14), czyli przy twarzy i w powietrzu. Sprzęt nie ma uchwytów, a w tym ćwiczeniu trzyma się uchwyty z przodu maszyny, żeby tułów nie zsuwał się z podpórki. Góra ruchu: biodro −14°, nogi nieco powyżej linii tułowia, co jest dopuszczalne, ale `bext.noArch` sugeruje linię prostą. Pewność 60%.
- **D. Lower Back Curl:**
  - Zakres jest mały: tułów 90° → 83°, bark unosi się o 6,1 cm, głowa o 8,5 cm. Na podglądzie klatki prawie się nie różnią.
  - Kolano 14° do tyłu (ta sama klasa co nr 1–2, ale nogi leżą na podłodze, więc widać tylko lekko uniesione kolana, 4–5 cm).
  - Stopy obrócone 90° w bok (pięta (−82,4; 4; ±3), palce (−82,4; 4; ±28)). W obu rzutach zasłania je ciało.
  - `cue-sets.json` deklaruje błąd `cobra.mis`, a poza nie ma wiersza błędu.

  Pewność 50%.

## Proponowana reguła

| Reguła | Warunek | Błędy | Pozostałe 75 póz partii 2 |
|---|---|---|---|
| `kolano_w_przod` (niezmiennik) | w każdej klatce siatki odsunięcie kolana od linii biodro–kostka, rzutowane na przód uda (wektor `front` obrócony o kąt uda w płaszczyźnie strzałkowej), ≥ −1 cm | Reverse Hyperextension −11,4 cm, Back Extension −6,4 cm, Lower Back Curl −4,9 cm (uwaga D), Prone Flutter Kicks −3,1 cm (glute_floor, uwaga) | bez alarmu w lunge, calf_raise, hip_bridge, leg_isolation, leg_machine, hip_abd_add, kneeling_hinge |

Sprawdzenie poza partią 2 (te same liczby; poza moim zakresem, do weryfikacji przez recenzenta tych rodzin):

- −19,0 cm / 67°: Lying T-Bar Row, Chest Supported Row, Spider Curl, Spider Curl (sztanga);
- −16,9 cm / 57°: Toe Touchers;
- −4,5 cm: Seal Row;
- −1,6 cm: Decline Push Up.

W leżeniu przodem na ławce skośnej z udem poziomo goleń zwisająca pionowo w dół oznacza kolano wygięte do tyłu. Może to być ta sama klasa błędu co nr 1, schowana pod wyjątkiem „biodro −37°” (`row.md`, uwaga D).
