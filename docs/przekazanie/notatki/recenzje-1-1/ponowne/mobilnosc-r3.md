# Ponowna recenzja ruchu i treści kart: mobilność, runda 3 (5 póz), 27.10.2026

Recenzent niezależny („recenzent mobilność r3”). Poprzednia recenzja: `recenzje-1-1/ponowne/mobilnosc-r2.md` (e6e95f26).
Nie czytałem README podglądów, komentarzy generatorów `agent-pozy/*.mjs`, opisów commitów, linii stanu ani docs/54.

**Co sprawdziłem i czym**
- Pozy z `origin/rodziny-mobilnosc` @ e2fc5303 (odłączony worktree `/home/user/wt/rec-mob3`, tylko odczyt).
  - Zmienione od e6e95f26 dokładnie 5 póz: Child's Pose, Side-Lying Quad, Inchworm, Wall Calf, Standing Gastrocnemius. Pozostałe 13 są bez zmian.
  - Złote odciski (`figury-v2-zlote.json`) zmieniły się tylko dla tych 5 póz, więc zmiana kontraktu nie ruszyła innych rodzin.
- **Render własny: 117 klatek × 2 widoki = 234.** Każda poza ma u = 0…1 co 1/20 plus wszystkie klatki kluczowe (Inchworm 33 klatki), widoki bok i przód. Do tego 8 powiększeń w pełnej rozdzielczości.
  - Narzędzia: `dataShapes` i `svgDocument` silnika v2 oraz playwright.
  - Wierszy błędów nie ma, bo `bledy: []` w każdej z 5 póz.
- Liczby: `keyframeFrame` i `jointAngles` w każdej klatce. Wartości dla Child's Pose i Side-Lying Quad zgadzają się z `katy-stawow.md` podglądu `mobilnosc-r3` (znacznik ważności jest).
- Kontrole automatyczne:
  - `waliduj` (v2-validate): 5/5 OK;
  - `npx jest tests/figury-mobilnosc-reguly.test.ts tests/figury-stopa-grzbietem.test.ts --maxWorkers=1`: 11/11 PASS.
- **CI:** tests.yml dla e2fc5303, przebieg 40517378022, **w toku** w chwili recenzji (14:06 UTC). Poprzedni przebieg 40502594483 (e6e95f26): success.

## Podsumowanie

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 1 | Wall Calf Stretch |
| OK z uwagą | 3 | Child's Pose, Side-Lying Quad Stretch, Standing Gastrocnemius Calf Stretch |
| **BŁĄD** | **1** | **Inchworm** (ŚREDNIE): kolejność ruchu niezgodna ze źródłem |

**Błędy z rundy 2:**
- Child's Pose i Side-Lying Quad są usunięte w całości.
- W Inchwormie usunięty jest podskok obunóż, bo stopy w ogóle już nie idą. W zamian pojawił się nowy problem zgodności ze źródłem (wiersz 3).
- Uwagi do mięśni z rundy 2 są usunięte: z Gastrocnemius zniknął `hamstrings`, z Child's Pose zniknął `lats`.
- Nazwa fazy „Wygięcie” zmieniona na „Grzbiet w dół / Koci grzbiet”, co usuwa dwuznaczność.

**Gotowość rodzin:** żadna z rodzin nie ma znaleziska KRYTYCZNEGO ani WYSOKIEGO.
- **mobility_floor:** gotowa do statusu „zatwierdzona”. Zostają tylko uwagi NISKIE.
- **mobility_stand:** według progu też może dostać ten status, bo Inchworm to błąd ŚREDNI, który idzie do backlogu. Rekomenduję jednak poprawić go przed nałożeniem (opcje w wierszu 3).
- Nałożenie obu rodzin nadal blokują trzy warunki kart z r2 (sekcja „Treść kart”).

## Tabela

| # | Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły | Waga / realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | Child's Pose | OK | OK (mięśnie `lower_back` i `glutes`, bez `lats`) | OK z uwagą | Szczegóły pod tabelą | NISKIE / realny | R3 (próg 13 cm ze źródła): 11 cm, przechodzi słusznie |
| 2 | Side-Lying Quad Stretch | OK | OK | OK z uwagą | Szczegóły pod tabelą | NISKIE | R7 przechodzi słusznie |
| 3 | **Inchworm** | błąd zgodności ze źródłem | nazwa fazy „Dłonie do stóp” utrwala błąd | **BŁĄD** | Szczegóły pod tabelą | ŚREDNIE / realny po nałożeniu | **nie** (brak reguły kolejności) |
| 4 | Wall Calf Stretch | OK | OK | OK | Szczegóły pod tabelą | — | R8 przechodzi słusznie |
| 5 | Standing Gastrocnemius Calf Stretch | OK | uwaga | OK z uwagą | Szczegóły pod tabelą | NISKIE (backlog) | — |

### Szczegóły do wierszy tabeli

**1. Child's Pose (OK z uwagą)**
- **Poza** (statyczna, wszystkie 21 klatek identyczne):
  - Pośladki przy piętach: środek miednicy (x 2 / y 26) jest **11 cm** nad piętą (x 2 / y 15). W r2 było 34 cm.
  - Biodro zgięte 138,5°, kolano 151,8°.
  - Stopa leży grzbietem na podłodze: palce x −20 / y 3,3 skierowane do tyłu, pięta w górze (y 15).
  - Głowa przy podłodze: środek y 9,8, twarz w dół.
- **Kolano 152° nie wygląda na wyłamane.** Udo i goleń składają się naturalnie, a z boku goleń wygląda na skróconą tylko dlatego, że kolana są rozstawione (z ±28). Bierne zgięcie kolana w siadzie na piętach ma w kontrakcie limit 160° i jest nazwane uproszczeniem. Źródło tej liczby: `[DO USTALENIA]`.
- **Uwaga (NISKIE):** ręce nie są „extended alongside the body” (ACE #227, krok 4):
  - łokcie zgięte 60,8°, 15 cm nad podłogą i odstawione na boki (z ±36 przy barkach ±18);
  - z przodu wyglądają jak skrzydła, choć dłonie leżą przy stopach;
  - **jak powinno być:** łokcie prawie proste (≤ ok. 20°), na podłodze, przedramiona wzdłuż ud. Odległość bark–dłoń wynosi ok. 55 cm, więc proste ręce mieszczą się w modelu.

**2. Side-Lying Quad Stretch (OK z uwagą)**
- **Naprawione:**
  - Dłoń górnej ręki (x 9,4 / y 47,4 / z 19,8) jest **1,2 cm od kostki** (10,6 / 47,5 / 20,2), czyli trzyma ją.
  - Biodro rozciąganej nogi zgięte 13,3°, więc udo jest w linii tułowia.
  - Kolano 140,8°, pięta ok. 11 cm od środka miednicy w stronę stóp, za ciałem.
  - Dolna noga prosta (kolano 6,8°), głowa leży na dłoni dolnej ręki.
- **Uwaga (NISKIE):**
  - Widok z przodu patrzy wzdłuż leżącego ciała i jest mało czytelny.
  - Stopa górnej nogi sterczy palcami ku górze jak płetwa (kostka 12,7°).
  - Cechę rozpoznawczą widać w pełni z boku.

**3. Inchworm (BŁĄD)**
- **Co jest na rysunku:** pętla podpór → skłon.
  - Palce stóp stoją w x 0 przez całą pętlę, pięty stopniowo opadają (y 20,5 → 0).
  - Dłonie idą naprzemiennie, po 4 kroki każda, ok. 23,5 cm na krok (R 124,7 → 101,1 → 77,5 → 53,8 → 30,2; L z przesunięciem 1/16).
  - Zawsze jedna dłoń jest na podłodze, dłoń w powietrzu unosi się 5 cm.
  - Podpór: linia pięta–miednica–bark prosta (odchyłka 1,5 cm), dłonie 5 cm przed barkami. Skłon: biodro 122°, kolana 13,5° (miękkie, zgodnie ze źródłem).
  - Pompki nie ma.
- **Czytelność:** z boku i z przodu ruch czyta się jako „przejście dłońmi do podporu i z powrotem” (walk-out), a nie jako inchworm. Brakuje cechy rozpoznawczej, czyli podejścia stopami do dłoni.
- **Niezgodność ze źródłem.** ACE #254 opisuje kolejność: skłon, dłonie idą do podporu (krok 3), pompka (krok 4), a w kroku 5 „Slowly begin walking your feet forward towards your hands, taking 6-12" steps without moving your hands.”
  - Druga faza rysunku („Marsz w podpór”, skłon → podpór dłońmi) zgadza się z krokiem 3.
  - Pierwsza faza („Dłonie do stóp”, dłonie wracają do stóp, które stoją) nie ma oparcia w źródle i jest odwrotnością kroku 5.
  - Ani `figury-sens.json` (jest tylko wpis `dynamiczne`), ani rejestr nie nazywają tego wariantu uproszczeniem.
  - Brak pompki też nie jest nazwany uproszczeniem w danych sensu.
  - Notatka katalogu („Walk hands out to a plank and back”) zgadza się z rysunkiem, ale to opis wewnętrzny bez przeczytanego źródła, więc nie wygrywa z ACE.
- **Uwaga (NISKIE):** łokcie w podporze są zgięte 28–29° (źródło: „full push-up position”). W kroku dłoni łokieć zgina się do 53°.
- **Opcje naprawy (rekomendacja: A):**
  - **A.** Pierwsza faza zgodna z krokiem 5: stopy idą naprzemiennie do nieruchomych dłoni, krokami 15–30 cm. Druga faza bez zmian: dłonie wychodzą do podporu. Ruch to stopy na zmianę, nie podskok obunóż jak w r2. Fazy: „Stopy do dłoni / Marsz w podpór”.
  - **B.** Zostawić rysunek i nazwać go wariantem „walk-out tam i z powrotem” z przeczytanym źródłem szczebla ≥ 4, wpisanym w `figury-sens.json` jako uproszczenie. Trzeba wtedy rozważyć, czy karta nadal może się nazywać „Inchworm”.

**4. Wall Calf Stretch (OK)**
- **Łokcie zgięte 63,1°** (ACE #152, krok 2: „allowing your elbows to bend as you shift your weight forward”).
- Dłonie na ścianie (x 72 przy ścianie x 75) 5,6 cm nad barkami (krok 1: „slightly higher than your shoulders”).
- Tylna noga prosta (kolano 7,9°), pięta na podłodze (y 0), kostka tylnej nogi 31,5° zgięcia grzbietowego. Przednie kolano zgięte 41,9°.
- Poza statyczna.

**5. Standing Gastrocnemius Calf Stretch (OK z uwagą)**
- Rysunek jest identyczny z Wall Calf, łokcie zgięte tak samo. Mięśnie to teraz tylko `calves`, zgodnie z rysunkiem.
- **Uwaga (NISKIE, backlog jak w r2):** katalog ma `recommended: ["box"]`, a wewnętrzna notatka opisuje inny wariant („heel on a step, reach for the toes”). Polecony sprzęt i rysunek ze ścianą się więc rozjeżdżają.
- Decyzja produktowa (scalić kartę z Wall Calf albo przerysować wariant ze stopniem) jest dalej otwarta.

## Treść kart (bez zmian od r2, nadal warunki nałożenia)

- **Wskazówki:** w `lib/cues/text/pl.json` nie ma ani jednego klucza `st.*` ani `dyn.*` (0). Karty to sam rysunek i mięśnie. Po dodaniu tekstów każde twierdzenie liczbowe potrzebuje wpisu w rejestrze twierdzeń.
- **Nazwy faz:** nowe klucze („Grzbiet w dół”, „Koci grzbiet”, „Dłonie do stóp”) są tylko w `_source.json`, czyli w 1 z 35 plików `lib/locales`. Konteksty dla tłumacza są zaktualizowane.
  - EN „Arching / Rounding” pasuje do nowych PL.
  - Przy opcji A dla Inchworma trzeba wrócić do „Stopy do dłoni / Feet to hands”.
- **Brak wpisu `DATA_UI`** dla obu rodzin, więc `figureSpec` zwraca `null`. Do aplikacji nic dziś nie trafia.
- **Nazwy marek i źródeł** w tekstach UI: brak.

## Szczelność reguł

- R3, R6b, R6c, R7 i R8 są teraz oparte na źródle, a nie na granicy modelu. Na 5 pozach przechodzą słusznie.
- **Luka:** żadna reguła nie sprawdza **kolejności ruchu względem źródła** w Inchwormie. R6b i R6c sprawdzają podparcie i brak cofania, a nie to, czy idą stopy, czy dłonie.
- **Propozycja:** reguła „Inchworm: w fazie u 0→1 przesuwają się stopy (Δx palców ≥ 15 cm), dłonie stoją (Δx ≤ 2 cm)”. Ogólnie: tabela „która kończyna się porusza, a która stoi” na fazę, z cytatem źródła, dla ruchów lokomocyjnych.
- **Brak reguły rąk** w Child's Pose (krok 4: ręce wyciągnięte wzdłuż ciała). Propozycja: „łokieć ≤ 25°, łokieć ≤ 6 cm nad podłogą”.

## Pliki
- Pozy: `lib/figures/v2/poses/mobility_floor.json` i `mobility_stand.json` (origin/rodziny-mobilnosc @ e2fc5303).
- Kontrakt: `lib/figures/v2/contract.ts` (`kneePassiveMaxDeg` 160, `hipPassiveMaxDeg` 150, `frames.max` 18, `podbicie` do 270°).
- Reguły: `tests/figury-mobilnosc-reguly.test.ts`. Źródła: `data/zrodla/figury-sens.json`, `docs/przekazanie/notatki/badania/mobilnosc-cytaty.md`.
