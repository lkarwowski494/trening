# Recenzja ruchu 1.1: rodzina dip (5 ćwiczeń), 27.10.2026

Recenzent niezależny (bramka wydania 1.1, decyzja właściciela 27.10.2026, wariant A). Oceniam pozy z `origin/integracja-1-1` @ 4e5a7f95, plik `lib/figures/v2/poses/dip.json`.
Uzasadnień generatorów ani opisów commitów z pozami nie czytałem.

Metoda jak w `pilotaz/recenzja-n6.md`:

- Podgląd z istniejących póz rysowałem własnym skryptem. `htmlPodgladu` z `v2-validate.mjs` daje wszystkie klatki kluczowe, rzut z boku i z przodu oraz wiersze błędów.
- Nie używałem `agent-pozy/run.mjs --podglad`, bo ten skrypt generuje pozy od nowa z generatora, a nie rysuje tych zapisanych w danych.
- PNG oglądałem w pełnej rozdzielczości. Każde podejrzenie sprawdziłem pozycjami stawów i kątami przeliczonymi silnikiem v2 (`keyframeFrame`, `jointAngles`) w klatkach u = 0 / 0,25 / 0,5 / 0,75 / 1.
- Ruch porównywałem ze wskazówkami techniki ćwiczenia (`lib/cues`, `cue-sets.json`).
- Współrzędne: x w przód, y w górę, z w prawo osoby, w cm.

Walidator (`v2-validate.mjs`, reguła `waliduj` na każdej pozie): **5/5 OK**. Szczelność reguł automatycznych w tej rodzinie: **0 z 1 błędów (0%)**.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Chest Dip | OK | tułów 28° → 34°, łokieć 12,5° → 95°, bark schodzi 21 cm (178,5 → 157,4); kolana zgięte 95°, stopy za ciałem |
| Triceps Dip | OK | tułów pionowo (4°), łokieć 12° → 95°, łokcie idą do tyłu (x −3 → −23), bark −21 cm |
| **Ring Dips** | **BŁĄD** | kółka narysowane jako sztywny drążek |
| Dip Machine | OK z uwagą | ruch poprawny, ale narysowana tylko prawa dźwignia |
| Triceps Dips (ławka) | OK | dłonie na krawędzi ławki (grip y 47 przy blacie 43), miednica schodzi 60 → 43 cm tuż przed ławką, łokieć 15° → 86°, nogi w przód (kostki x 73) |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / element | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Ring Dips** | wszystkie klatki, sprzęt | **Zamiast kółek jest jeden sztywny drążek.** Sprzęt to `{"rodzaj":"sztanga","y":115}`, a chwyty leżą w (0; 115; ±22). W rzucie z przodu drążek przecina sylwetkę na wysokości bioder i łączy obie dłonie, więc widać dip na prostym drążku (straight bar dip), czyli inne ćwiczenie. Kąty i tor ciała są identyczne jak w Chest Dip: tułów 24° → 30°, łokieć 12° → 95°. Silnik nie ma rodzaju „kółka gimnastyczne”, bo `kolko` to kółko do brzucha, a `sztanga` deklaruje cap `rings` bez opisu przybliżenia (`capLabel` ma tylko jarzmo). | Dwie niezależne rączki zawieszone na taśmach po bokach ciała. Da się to narysować już dziś: `zawieszenie` (taśmy z zaczepem wysoko, `punkt: dlonie`) daje dokładnie ten obraz. Można też dodać do silnika osobny rodzaj „kółka”. Cap `rings` należy zdjąć z `sztanga` albo nazwać jako przybliżenie. | 85% | realny (każde wyświetlenie) | nie: `sprzet_rozpoznawczy` i wymagany sprzęt (`requires: rings`) spełnia drążek, bo `sztanga` ma cap `rings` |

## OK z uwagą (backlog, nie blokuje)

- **Dip Machine:** siedzi, oparcie odchylone 10°, ręka od łokcia 90° (dłoń x 26, y 60) do wyprostu przy biodrze (łokieć 21°, dłoń y 35). Ruch jest poprawny i animacja wahadłowa pokazuje obie fazy.
  Dźwignia ma jednak `trzyma: "R"`, więc w rzucie z przodu jest tylko jedna. Lewa ręka wykonuje ten sam ruch w powietrzu. Kontrakt pozwala dać dwa wpisy `dzwignia` (R i L), tak jak Double Kettlebell Press ma dwa kettlebelle.
  Ten sam wzorzec ma 8 maszyn dwuręcznych w innych rodzinach (Pec Deck, Reverse Pec Deck, Machine Lateral Raise, Machine Biceps Curl, Machine Triceps Extension, Leverage Shrug, Calf-Machine Shoulder Shrug). Opis w `README.md`.

## Wartości przy progach

Brak istotnych. Głębokość dipów (łokieć 86–95° w dole) leży w środku wskazówki „mniej więcej kąt prosty w łokciach” (`bdip.move`).

## Proponowana reguła

| Reguła | Warunek | Błąd | Pozostałe |
|---|---|---|---|
| `sprzet_przyblizony_jawnie` | gdy wymagany cap ćwiczenia (np. `rings`) spełnia rodzaj sprzętu, dla którego ten cap jest przybliżeniem, poza musi mieć wpis w `capLabel` / przybliżeniach i trafia do recenzenta z porównaniem obrazu | Ring Dips | Chest/Triceps Dip (`poreczy` = cap natywny) bez alarmu |
