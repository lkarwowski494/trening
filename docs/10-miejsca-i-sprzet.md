# Miejsca treningu i sprzęt (P-003) — research i projekt wdrożenia

Wersja robocza 02.10.2026, aktualizacja 03.10.2026 (decyzje właściciela z 07:35). Status: **E1 wdrożone na gałęzi `feature/locations`, zintegrowane w `integration/0.9.0`** (bez buildu) — szczegóły, przyjęte decyzje i odstępstwa w sekcji „Implementacja E1” na końcu; decyzje właściciela z 03.10 (7a, 8c, P-004 b, ViShape na stronę) — sekcja „Decyzje właściciela 03.10.2026”; decyzja z 08:11 (bez szablonów właściciela w aplikacji) i poprawki audytu commitów f132330/025ee6a — sekcja „Runda 82”; poprawki weryfikacji commitu 6ea37a3 — sekcja „Runda 82b”. Zgłoszenie: P-003 (02.10, test na iPhonie), wraca T-044 / D-011 (odłożone 01.10).
Dane źródłowe: `docs/research/equipment/catalog.json` (katalog 125 ćwiczeń; jego kopia jako arkusz „Katalog ćwiczeń — wymagania sprzętu” jest na Dysku Google w folderze „Trening App”), `docs/research/kb/*.json` (baza wiedzy funkcji 10 aplikacji). Pełne raporty z researchu: sekcja „Źródła” na końcu.

## 1. Co chcemy osiągnąć (słowami użytkownika)

„W ustawieniach sekcja miejsc treningu. Można zaznaczyć, że pełna siłownia, albo dodać nowe miejsce i wybrać sprzęt — np. dla domu: ławka regulowana, drążek, poręcze do dipów, hantle (i odznaczyć kilogramy, których nie mam); gdybym miał sztangę i obciążenie, też powinienem móc dodać. Później to powinno wpływać na dostępne wybory podczas treningu.” Wzór: Freeletics.

## 2. Jak to robią inni (skrót; szczegóły i źródła w bazie wiedzy)

| Aplikacja | Miejsca | Sprzęt | Dostępne ciężary | Wpływ na trening |
|---|---|---|---|---|
| Freeletics („Spaces”) | nazwane, jedno „główne” (nieusuwalne), przełączenie na jedną sesję („Adapt Session”) | płaska lista ~16 pozycji; drążek ma pod-pytania (pełny zwis, miejsce na muscle-up, czy można się bujać); przełączniki „mało miejsca”, „trenuj cicho”, „wspólna przestrzeń” | lista posiadanych hantli/kettli wpisywana ręcznie; brak modelu regulowanych hantli — trzeba wpisać każdą kombinację | generator układa sesje pod sprzęt |
| Fitbod | wiele miejsc, udostępnianie linkiem | ~70 pozycji, presety (duża/mała siłownia, garaż, dom, tylko masa ciała), domyślnie wszystko zaznaczone | „przyrosty” hantli/kettli/sztangi; kalkulator talerzy | filtr ćwiczeń; **zmiana miejsca regeneruje trening i kasuje edycje** (skargi) |
| Alpha Progression | wiele siłowni (Pro), jedna aktywna | ~35 pozycji w grupach; biała/czarna lista ćwiczeń | **zakresy min–max–krok** (kilka zakresów) albo **gryf + talerze**; warstwy: domyślne → siłownia → typ sprzętu → pojedyncze ćwiczenie | wybór ćwiczeń tylko z dostępnych; **podpowiedź ciężaru tylko z istniejących ciężarów** („31,7 kg nie ma sensu, gdy maszyna skacze z 30 na 35”); przy dużym skoku najpierw dokłada powtórzenia |
| Liftosaur (logger, open source) | wiele siłowni, „Duplikuj”, „bieżąca siłownia” | 8 typów + własne | gryf, liczba stron, **talerze w sztukach** (liczy się para), lista stałych ciężarów; jednostka per sprzęt | zaokrągla cel **w dół** do osiągalnego, pokazuje przekreślony cel + „dlaczego zmieniono ciężar”; picker „pokaż tylko dostępne” |
| SmartGym | do 5 list sprzętu, tagi na szablonach | lista | „wpisz ciężary, które masz” | zamiana ćwiczenia tylko na tę sesję; zamienniki z listy sprzętu |
| Hevy | brak profili (tylko tag siłowni od 08.2026); dla maszyn radzi duplikować ćwiczenie per siłownia | presety w generatorze (dom/garaż/komercyjna/duża) | ciężary hantli/talerzy/gryfu w generatorze; kalkulator talerzy | — |
| JEFIT | profili miejsc nie ustalono | sprzęt w preferencjach treningu | talerze, hantle i ustawienia maszyn, które masz; preferowane przyrosty | cele ciężaru zaokrąglane do posiadanych; filtr ćwiczeń wg sprzętu |
| StrengthLog | tylko profile kalkulatora talerzy per siłownia | — | talerze w sztukach, gryfy, zaciski, gryf przypisany do ćwiczenia | tylko kalkulator talerzy |
| Strong, Caliber | brak profili miejsc | — | tylko gryf/talerze w kalkulatorze | — |
| Boostcamp | nie ustalono | nie ustalono | nie ustalono (jest kalkulator talerzy) | — |

Uwaga do źródeł: Freeletics i Gymverse nie są w bazie wiedzy funkcji (tam 10 innych aplikacji) — ich opis pochodzi z osobnego raportu o miejscach i sprzęcie (źródła na końcu). To samo dotyczy szczegółów Fitbod (~70 pozycji sprzętu z 999 stron ćwiczeń, presety) i cytatu Alpha o 31,7 kg.

**Wnioski z researchu**
1. Brak profili = ręczne przeklikiwanie sprzętu przy każdej zmianie miejsca — to była główna skarga we Freeletics przed „Spaces” i główny zarzut wobec Gymverse.
2. Logger nie może niczego przepisywać za plecami (antywzorzec Fitbod: zmiana miejsca kasuje edycje). Zgodne z naszą zasadą A-002.
3. Regulowane hantle i wspólne talerze są źle obsłużone w większości aplikacji (Freeletics: „wpisz wszystkie kombinacje”). Dobrze robią to Liftosaur (gryf/uchwyt, liczba stron, talerze w sztukach — liczy się para) i Alpha (gryf + talerze); przejmujemy ten model: **uchwyt + talerze → aplikacja sama liczy osiągalne ciężary** (algorytm niżej).
4. Najlepsze wzorce: Alpha (podpowiedź z realnych ciężarów + najpierw powtórzenia przy dużym skoku), Liftosaur (zaokrąglanie w dół z wyjaśnieniem, duplikowanie miejsca), Freeletics (miejsce główne + szybka zmiana na jedną sesję).
5. Nikt nie modeluje porządnie „albo–albo” (drążek z klatki **albo** drążek rozporowy). Fitbod ma listę „wymaga wszystkich” — najlepszy precedens, ale bez alternatyw.

## 3. Model danych (propozycja)

### 3.1 Sprzęt w miejscu → „możliwości” → wymagania ćwiczenia
Dwie warstwy, żeby ćwiczenie nie musiało znać konkretnego sprzętu:
- **Miejsce** ma listę **pozycji sprzętu** (np. „Ławka regulowana”, opcja „ze skosem w dół”).
- Każda pozycja **daje możliwości** (np. ławka regulowana → `bench.flat`, `bench.incline` [+ `bench.decline`]; klatka z drążkiem → `rack`, `pullup.bar`; brama → `cable.high`, `cable.low`, `cable.mid`, `cable.dual`; wyciąg górny → `lat_pulldown`, `cable.high`).
- **Ćwiczenie** ma `requires`: lista grup — każda grupa musi być spełniona, w grupie wystarczy jedna możliwość (np. wyciskanie sztangi na ławce: `(barbell) + (bench.flat) + (rack lub bench.uprights)`; podciąganie: `(pullup.bar lub rings)` — jak w `catalog.json` i `lib/catalog.generated.ts`; hip thrust z hantlem: `(db) + (bench.flat lub box)`). Do tego `recommended` (np. asekuracja przy wyciskaniu — tylko ostrzeżenie, nie blokuje).
- Słownik możliwości i lista pozycji sprzętu (≈45, z polskimi nazwami ze sklepów: gryf olimpijski/prosty/łamany, ławka płaska/regulowana/skośna, klatka treningowa, stojaki, drążek rozporowy, poręcze do dipów, brama, wyciąg górny/dolny, suwnica Smitha, suwnica na nogi, modlitewnik, ławka rzymska, kettlebell, gumy, kółko do brzucha, skrzynia…) — jedno źródło prawdy w `lib/equipment.ts`, z niego generowane ekrany i testy.

### 3.2 Dostępne ciężary (per miejsce)
Jedna lista **osiągalnych ciężarów** na źródło obciążenia, liczona z jednego z trzech opisów:
- **lista** — hantle o stałej wadze, kettle, hantle z szybką regulacją (np. Gymtek 2,5–24 kg: 2,5; 3,5; 4,5; 5,5; 6,5; 8; 9; 10; 11,5; 13,5; 16; 18; 20,5; 22,5; 24), stos maszyny;
- **zakres + krok** — tylko skrót w edytorze (np. 2–24 kg co 2), zapisywany jako lista, żeby dało się **odznaczyć** pojedyncze ciężary (dokładnie to, o co prosi użytkownik);
- **uchwyt/gryf + talerze** — hantle regulowane z talerzami i sztanga: masa uchwytu/gryfu + talerze w sztukach (liczy się para na strony; dla pary hantli — 4 sztuki). Aplikacja liczy wszystkie osiągalne ciężary (ograniczona suma podzbiorów; greedy „od największego” bywa błędny przy ograniczonej liczbie talerzy).
  Przykład zweryfikowany skryptem: zestaw Hop-Sport 2×10 kg (uchwyty ok. 1,5 kg, talerze 4×2,5 + 4×1,25 + 4×0,5) → para: 1,5; 2,5; 4; 5; 6,5; 7,5; 9; 10 kg; jeden hantel (ćwiczenia jednorącz): 21 ciężarów do 18,5 kg.
- Hantle przechowujemy **na jeden hantel** (zgodnie z naszym `loadMode: per_dumbbell`).
- kg/lb: przechowujemy w jednostce sprzętu (talerz 45 lb ≠ 20 kg) — jak Liftosaur.

### 3.3 Gdzie żyje miejsce
- `Settings.locations[]`, `Settings.mainLocationId` (miejsce główne, jak Freeletics).
- `Workout.locationId` — trening pamięta, gdzie był (historia, filtr).
- `Template.locationId?` — opcjonalne miejsce domyślne szablonu („Legs — dom” → Dom).
- `TemplateItem.alternates?: { [locationId]: exerciseId }` — etap 2 (zamienniki per miejsce).
- `Exercise.requires / recommended / pattern / loadSource` — dla biblioteki z katalogu; **własne ćwiczenia bez wymagań = zawsze dostępne** (jak Alpha: custom zawsze widoczne).
- Migracja (schemat 14): brak miejsc = zachowanie jak dziś (wszystko dostępne, dzisiejsze kroki podpowiedzi).
- **Uwaga z przeglądu:** `migrate()` buduje `Settings` z białej listy pól, więc nowe pola (`locations`, `mainLocationId`, przełącznik filtra) trzeba do niej dopisać. Inaczej znikną przy każdym starcie i imporcie (`replaceState` też woła `migrate`). Potrzebny test: eksport → import → miejsca są.
- **Wymagania ćwiczenia: zapisane czy wyliczane?** Ćwiczenia z biblioteki można dziś edytować (nazwa, sprzęt, sposób liczenia). Propozycja: wymagania **zapisane w ćwiczeniu** (przy migracji przepisane z katalogu dla ćwiczeń z flagą `lib`) i edytowalne w edytorze ćwiczenia; nie wyliczać ich po nazwie, bo zmiana nazwy by je zgubiła. Flaga `lib` jest uzupełniana tylko dla danych sprzed schematu 10 — do sprawdzenia przy migracji.
- **Ćwiczenia własne:** bez wymagań są zawsze dostępne, ale źródło obciążenia brać z dzisiejszego zgrubnego sprzętu (hantle/sztanga/maszyna…), żeby działało zaokrąglanie do dostępnych ciężarów.
- **Para czy jeden hantel:** sam `loadMode` tego nie rozstrzyga. One Arm Row, Concentration Curl i Triceps Kickback mają `per_dumbbell`, a używa się jednego hantla. Do katalogu trzeba dodać `implements: 1 | 2`, które mówi, z której listy brać ciężary: pary (talerze dzielone na 4) czy pojedynczego (na 2). Przy trybie `total` lista pary ×2. Przy okazji wyszło, że w szablonie domowym Deadlift (hantle) i RDL mają 48 kg, a pozostałe hantle najwyżej 24, czyli prawdopodobnie suma wpisana pod `per_dumbbell` — **rozstrzygnięte 03.10 (P-004 b): hantle wpisuje się na hantel** (sekcja „Decyzje właściciela 03.10.2026”). Szablonów aplikacja nie przenosi ani nie poprawia — decyzja 03.10, 08:11: właściciel ustawia je sam (sekcja „Runda 82”).
- **kg/lb:** masy w aplikacji są w kg z dokładnością 0,01 (`kg2`), więc talerz 45 lb = 20,41 kg. Porównanie „podpowiedź ∈ dostępne” musi mieć tolerancję (np. 0,01 kg) i iść przez te same funkcje przeliczające co dziś (`wIn` / `dispKg`).

### 3.4 Stacja z oporem elektrycznym / magnetycznym (jedna pozycja — decyzja użytkownika 02.10, 21:47)

„Możesz dodać sprzęt z oporem magnetycznym jako jedno. Są inne sprzęty, które pozwalają na to samo, a nawet więcej.” Research (02.10) objął: ViShape SmartGym Pro i Lite, Speediance Gym Monster 2 / Gym Pal, Tonal 2, Vitruvian Trainer+, Beyond Power Voltra I, Amp, Oxefit XS1, Forme Studio Lift.

Wspólny wzorzec: dwie niezależne linki napędzane silnikiem, ciężar ustawiany **na stronę**, krok zwykle 0,5 kg albo 1 lb, minimum ok. 1,5–3 kg na stronę. Urządzenia różnią się głównie **położeniem linek**: z podłogi (ViShape, Vitruvian, Gym Pal) albo z ramion o regulowanej wysokości (Tonal, Gym Monster, Amp). Voltra ma jedną linkę.

Pozycja „Stacja z oporem elektrycznym / magnetycznym (np. ViShape, Speediance, Tonal…)”:

- **Daje zawsze:** `cable.low`, `cable.dual` (dwie niezależne linki), uchwyty, drążek, opaski na kostki, pas biodrowy.
- **Opcje do zaznaczenia:**
  - „ramiona regulowane / wysoki wyciąg” → `cable.high`, `cable.mid` (ściąganie z góry, face pull, krzyżowanie linek);
  - „ławka w zestawie” (płaska / regulowana);
  - „lina”;
  - „jedna linka” (np. Voltra) — wyłącza `cable.dual`;
  - pas i opaski można odznaczyć (Tonal i Forme nie mają pasa).
- **Ciężary:** zakres na stronę + krok + jednostka urządzenia. Propozycja z 02.10 (seria zapisuje liczbę linek, ustawienie „na stronę / łącznie”) **zastąpiona decyzją 03.10: „ViShape na stronę”** — ciężar stacji wpisuje się zawsze na stronę, tak jak pokazuje urządzenie (bez sumy linek i bez przełącznika).
- **Presety:**
  - ViShape Pro: 1,5–65 kg na stronę, krok 0,5 kg. Wg FAQ producenta; starsze opisy podają 60 kg.
  - ViShape Lite: 1,5–35 kg na stronę, krok 0,5 kg.
  - Speediance: ok. 2–50 kg na stronę, krok 0,5 kg / 1 lb.
  - Pozostałe urządzenia oznaczone jako niezweryfikowane.
- **Tryby** (ekscentryczny, łańcuchy, izokinetyczny, elastyczny) nie zmieniają tego, jakie ćwiczenia da się zrobić. Najwyżej jako opcjonalny znacznik serii — nie w E1.
- **Uwaga do porównań:** ciężar z linek nie równa się ciężarowi wolnemu (w teście ViShape zmierzony opór statyczny był ok. 10% niższy od ustawionego). Rekordy są i tak per ćwiczenie, więc się nie mieszają.
- **Rozstrzygnięte 03.10.2026 (właściciel: „ViShape na stronę”):** ciężar ViShape wpisuje się na stronę — także 45 kg startowe w „Przysiad z pasem (linki)” to 45 kg na stronę. (Wcześniej niepewne: test fitnessowy.net sugerował, że aplikacja ViShape Pro pokazuje sumę — „100 kg” przy limicie 60 na stronę.)

Źródła: https://vishape.pl/faq · https://vishape.pl/smartgym-pro · https://vishape.pl/smartgym-lite · https://vishape.pl/akcesoria · https://fitnessowy.net/smartgym-pro-test/ · https://www.speediance.com/products/speediance-gym-monster-2 · https://tonal.com/products/tonal-2 · https://www.garagegymreviews.com/vitruvian-trainer-review · https://www.beyond-power.com/products/voltra

## 4. Wpływ na trening

1. **Start treningu:** pod nazwą szablonu „📍 Siłownia ▾” — domyślnie miejsce szablonu albo główne; zmiana jednym stuknięciem, tylko dla tej sesji.
2. **Wybór ćwiczenia:** domyślnie „Dostępne w: Dom” (filtr), przełącznik „pokaż wszystkie” zapamiętywany; niedostępne pokazane wyszarzone z dopiskiem „brak: ławka skośna”.
3. **Ćwiczenie z szablonu niedostępne w tym miejscu:** plakietka „brak sprzętu w: Dom” + „Zamień” (etap 2). **Nigdy** automatyczna zamiana.
4. **Podpowiedź progresji „↑ spróbuj X”:** X = **najbliższy większy dostępny** ciężar (nie „+1 kg”, którego nie masz). Co przy dużym skoku — decyzja 7, dwa warianty (**03.10.2026 właściciel wybrał (a)** — „podpowiedź najpierw proponuje +2 powtórzenia — to ma sens? Chyba będzie wkurzające”):
   - **(a) bez bramki** — jak dziś, tylko z prawdziwym ciężarem: górna granica na wszystkich seriach → „↑ spróbuj X”.
   - **(b) prosta bramka procentowa** (*rekomendacja*): jeśli skok do X ≤ 10% (górna granica ACSM 2009: 2–10%) → jak (a); jeśli > 10% → najpierw „ten sam ciężar, celuj w górną granicę + 2”, a dopiero po jej zrobieniu na wszystkich seriach „↑ spróbuj X”. Twardy limit +2, żeby nie gonić 20–40 powtórzeń.
   - Odrzucony wariant: „bramka Epleya” z raportu (`R ≥ ceil(30·((W′/W)·(1+rMin/30) − 1))`). Przegląd wykazał, że stosuje wzór Epleya powyżej 10 powtórzeń, a nasz e1RM sam go tam nie używa (`E1RM_MAX_REPS = 10`, Mayhew 2008). Przy lekkich hantlach daje absurdalne cele: 4→5 kg przy zakresie 15–15 = 27 powt., 4→6 kg = 38, 8→9 kg przy 10–12 = 15. Przy sztandze 60→62,5 daje 10, więc niczego nie zmienia (raport podał tu 13 — błąd rachunkowy).
   - Doprecyzowanie, niezależnie od wariantu: brak górnej granicy powtórzeń w szablonie = brak podpowiedzi (jak dziś); ciężar poprzedni spoza listy (np. 32 kg z siłowni, w domu max 24) → brak „↑”; do pola nie jest wstawiany, gdy pochodzi z innego, znanego miejsca albo zrobiono go innym, znanym przyrządem (bezpiecznik M3, pkt 4.7); z sesji bez miejsca (0.8.5, web 0.3) jest wstawiany, z dopiskiem „ciężaru … nie ma tutaj — wpisz ciężar” (dokładna reguła dopisku — sekcja „Runda 82b”).
   - Podstawa: progresja powtórzeniami ≈ progresja ciężarem dla hipertrofii (Plotkin 2022, Chaves 2024); SBS: „dodaj powtórzenie lub serię, potem ciężar”. Sam próg 10% i limit +2 to **nasza propozycja**, niezweryfikowana bezpośrednio żadnym badaniem.
5. **Zaokrąglanie:** tylko w podpowiedziach i szacunkach, **w dół** do dostępnego (niedociążenie poprawisz powtórzeniami, przeciążenie kosztuje nieudaną serię). Wpisane wartości nigdy nie są zmieniane (A-002).
6. **Historia i rekordy:** osobno per ćwiczenie, **bez przeliczania** między wariantami (sztanga ↔ hantle: badania dają 72–83%, rozrzut za duży — Saeterbakken 2011, Smoak 2023; tabele %1RM różnią się między ćwiczeniami — Nuzzo 2023). Po zamianie: podpowiedzi z historii zamiennika + jedna linijka „sztanga ostatnio: 3×8 @ 80 kg” dla kontekstu.
7. **„Poprzednio”, wstępne wartości i miejsce:** dziś „Poprzednio” i wypełnienie przy starcie biorą ostatni trening ćwiczenia, gdziekolwiek był. Z miejscami trening domowy dostałby 32 kg z siłowni, czyli ciężar, którego w domu nie ma. Propozycja (decyzja 8): (a) najpierw ostatni trening **w tym samym miejscu**, a gdy go brak — ostatni w ogóle, z dopiskiem „(siłownia)” — *rekomendacja*; (b) zawsze ostatni w ogóle, jak dziś. Hevy i Alpha dają ten wybór w ustawieniach. **03.10.2026 właściciel wybrał wariant (c): ostatni raz TYM SAMYM PRZYRZĄDEM, gdziekolwiek** — „„Poprzednio” nie powinno brać najpierw treningu z tego samego miejsca, jeżeli ćwiczenie było wykonywane w międzyczasie gdzie indziej. Jedyne co można brać pod uwagę to sprzęt, jakim było wykonywane, bo hantle to nie sztanga”. Ciężar, którego tu nie ma, nie trafia do pól, gdy źródło jest „gdzie indziej”: sesja w innym, znanym miejscu albo blok zrobiony innym, znanym przyrządem (bezpiecznik M3; przyrząd — runda 82, LOW 3) — pola ciężaru i powtórzeń zostają puste, przy ćwiczeniu dopisek „ciężaru 32 kg nie ma tutaj — wpisz ciężar”. Sesja bez miejsca (0.8.5, web 0.3) to nie „gdzie indziej” (wstrzymanie dawało serie bez ciężaru — HIGH z weryfikacji 2): jej ciężar jest wstawiany, a gdy nie ma go na liście tego miejsca, ekran treningu i edytor historii pokazują ten sam dopisek (runda 82, MEDIUM 1).

## 5. Ekrany

- **Ustawienia → Miejsca treningu:** lista (główne oznaczone), „+ Dodaj miejsce” z presetami: *Pełna siłownia* (wszystko, sztanga 20 kg + talerze 25…1,25, hantle 2,5–50 co 2,5), *Dom* (pusto — do zaznaczenia), *Tylko masa ciała*, *Hotel* (hantle do 20–25 kg, ławka) — wartości presetów do potwierdzenia (część z researchu oznaczona jako niezweryfikowana).
- **Miejsce:** nazwa · „Ustaw jako główne” · sprzęt (grupy: Wolne ciężary / Ławki i stojaki / Drążki i poręcze / Wyciągi / Maszyny / Akcesoria / Cardio; przełączniki iOS — spójnie z P-002) · pod pozycją z ciężarami: edytor ciężarów (preset modelu, zakres+krok z odznaczaniem, uchwyt+talerze) · „Duplikuj” · „Usuń”. Zapis od razu przy każdej zmianie (antywzorzec Freeletics: sprzęt nie zapisywał się po geście „wstecz”).
- **Trening:** chip miejsca, filtr w pickerze, plakietka braku sprzętu.

## 6. Etapy (propozycja)

| Etap | Zakres | Uzasadnienie |
|---|---|---|
| **E1** | miejsca + sprzęt + ciężary (lista / zakres z odznaczaniem / uchwyt+talerze); miejsce na treningu i w szablonie; filtr w wyborze ćwiczenia; podpowiedź progresji i zaokrąglanie z dostępnych ciężarów; wymagania 125 ćwiczeń z katalogu | dokładnie to, o co prosi P-003 |
| **E2** | „Zamień ćwiczenie” w trakcie treningu (ranking: dostępny sprzęt → ten sam wzorzec i mięsień główny → mięśnie pomocnicze → historia użytkownika; 3–4 propozycje + cała biblioteka; „tylko dziś / zawsze w: Dom”); zamienniki per miejsce w szablonie | zamiana ćwiczenia jest w 10/10 badanych aplikacji, u nas brak |
| **E3** | kalkulator talerzy (8/10 aplikacji) i rozgrzewki (7,5/10) na podstawie talerzy z miejsca | naturalne rozszerzenie inwentarza |

## 7. Decyzje do podjęcia (rekomendacja pierwsza)

> Przy wdrożeniu E1 (02.10, właściciel niedostępny) przyjęto rekomendacje: 1a, 2a (bez zamienników w E1 — to E2), 3a, 4a, 5 — zostawić duplikaty, 6 — gumy globalne, 7b, 8a. Zapis i odstępstwa: „Implementacja E1”.
> **03.10.2026, 07:35 — decyzje właściciela:** 7b → **7a** (bez bramki), 8a → **8c** („Poprzednio” = ostatni raz tym samym przyrządem), P-004 → **(b)** (hantle na hantel), ViShape → **na stronę**. Wdrożenie: sekcja „Decyzje właściciela 03.10.2026”.

1. **Gdzie wybiera się miejsce:** (a) miejsce główne + domyślne miejsce szablonu + zmiana na starcie treningu — *rekomendacja*; (b) jedno globalne „aktywne miejsce” (Alpha/Liftosaur) — prostsze, ale łatwo zapomnieć przełączyć.
2. **Szablony a miejsca:** (a) jeden szablon + zamienniki per miejsce (E2) — *rekomendacja*, bez dublowania; (b) osobne szablony „Legs — dom / siłownia” (stan właściciela; od 03.10, 08:11 szablony ustawia sam — aplikacja startuje bez szablonów) — proste, ale edycje trzeba robić dwa razy.
3. **Filtr w wyborze ćwiczenia:** (a) domyślnie tylko dostępne + „pokaż wszystkie” — *rekomendacja*; (b) wszystkie, dostępne na górze.
4. **Ćwiczenia z hantlami często robione bez obciążenia** — Walking Lunges, Reverse Lunge, Step Up, Russian Twist (Lunges (hantle) zawsze wymaga hantli): (a) nie wymagają hantli, hantle zalecane — *rekomendacja katalogu*; gdy w miejscu nie ma hantli, podpowiedź idzie w powtórzenia, nie w kilogramy; (b) wymagają hantli.
5. **Duplikaty w bibliotece:** Seated Cable Row ≡ Wiosłowanie na linkach (siedząc); Rear Delt Raise (hantle) ≈ Reverse Fly (hantle) — połączyć (z migracją historii) czy zostawić?
6. **Gumy (P-001):** zostają globalne czy stają się sprzętem miejsca? *Rekomendacja:* globalne na razie (gumy się nosi); w miejscu tylko „mam gumy: tak/nie”, dziś żadne ćwiczenie ich nie wymaga.
7. **Podpowiedź przy dużym skoku ciężaru** (pkt 4.4): (b) prosta bramka 10% z limitem +2 powtórzeń — *rekomendacja*; (a) bez bramki. **Decyzja 03.10: (a).**
8. **Źródło „Poprzednio” i wstępnych wartości** (pkt 4.7): (a) najpierw to samo miejsce — *rekomendacja*; (b) zawsze ostatni trening. **Decyzja 03.10: (c) — ostatni raz tym samym przyrządem, miejsce bez znaczenia.**
9. **Twój dom — odpowiedzi użytkownika (02.10, 21:43):**
   - „Przysiad z pasem (linki)” robi na **ViShape** (model nieustalony; SmartGym Pro: elektryczny opór na dwóch niezależnych linkach od dołu, 1,5–60 kg na stronę, w zestawie ławka regulowana, drążek do linek, uchwyty, opaski na kostki i pas biodrowy; nie da się na nim ciągnąć z góry — źródło: test fitnessowy.net). Wniosek do projektu: potrzebna pozycja sprzętu **„stacja z linkami / opór elektryczny (np. ViShape)”**, która daje `cable.low`, `cable.dual` i pas, a ławkę regulowaną jako osobną pozycję. Ciężary to zakres na stronę; krok regulacji **nieustalony** (do sprawdzenia na urządzeniu). To tylko pozycja sprzętu, nie integracja z ViShape, więc decyzja z 28.09 („funkcje ViShape poza zakresem”) zostaje w mocy.
   - 48 kg w Deadlift (hantle) i RDL to **suma dwóch hantli** → zgłoszenie P-004: przy dzisiejszym trybie „na hantel” objętość tych ćwiczeń liczy się podwójnie. **Decyzja 03.10: (b) — „Jeżeli coś jest hantlami, to powinno być wpisywane per hantel”.**
   - Hantle: 2 × **TREXO TXO-B4W002 24 kg** (regulowane pokrętłem, gryf 3 kg, 8 talerzy, waga ok. 3–24 kg według sklepów). **Dokładne kroki regulacji nieustalone** — sklepy ich nie podają; do odczytania z pokrętła (lekcja 11: nie zgadujemy). Ten model wchodzi jako preset „hantle z szybką regulacją”.

### Sprawy do rozstrzygnięcia przy wdrożeniu (z przeglądu)
- Usunięcie miejsca: szablony i treningi zachowują `locationId` jako „(usunięte miejsce)”, a miejsca głównego nie da się usunąć, dopóki nie wskaże się innego (jak Freeletics).
- Maszyny w różnych siłowniach: ten sam „Leg Press” w dwóch siłowniach ma inne ciężary (Hevy radzi osobne ćwiczenie dla każdej siłowni). Historia i rekordy dalej per ćwiczenie; po decyzji 8c (03.10) „Poprzednio” bierze ostatni raz tym samym przyrządem — maszyna w siłowni A i B to ten sam przyrząd („machine”), więc różne stosy trzeba rozróżnić osobnym ćwiczeniem (jak radzi Hevy).
- Dociążenie (±kg) ćwiczeń z masą ciała: czy podpowiedź ma brać ciężary z talerzy/hantli miejsca? Propozycja: na razie bez zmian.
- Zamiana ćwiczenia w supersecie (E2): zachować `groupId` i `tplItemId`, żeby nie rozbić rundy i „Poprzednio”.
- Kopia ze schematem 15 (wcześniej 14) nie wczyta się w starszej wersji aplikacji (jak przy każdej zmianie schematu).
- Ciężary spoza listy, wpisane wcześniej (np. szablon ma 21 kg, a lista hantli idzie co 2): wpisane wartości zostają (A-002), podpowiedź idzie do najbliższego większego z listy.
- Ćwiczenie dostępne zamiennie dwoma przyrządami (RDL: hantle albo wyciąg; goblet: hantel albo kettle): źródło obciążenia brane z tego przyrządu, który miejsce ma, a gdy ma oba — z zapisanego w ćwiczeniu.

## 8. Testy (plan)
- Algorytm osiągalnych ciężarów: fast-check — każdy wynik da się złożyć z talerzy (para na strony), lista posortowana i bez powtórzeń, brak talerzy → tylko uchwyt; przypadki z researchu (Hop-Sport, sztanga 20 + para każdego talerza = co 2,5 kg do 177,5).
- Wymagania: każdy z 125 wpisów używa tylko słownika; presety „Pełna siłownia” → 125/125 dostępne; „Tylko masa ciała” → dokładnie ćwiczenia z pustą listą wymagań (dziś 20; zależy od decyzji 4 — przy (b) 17); przykład domu użytkownika (ławka regulowana, drążek, poręcze, hantle) — lista dostępnych do przejrzenia z użytkownikiem.
- Brak miejsc = zachowanie bit w bit jak dziś (cały obecny zestaw testów bez zmian).
- Podpowiedź: przypadki z pkt 4.4 (także lekkie hantle i zakres o równych granicach, np. 15–15) + niezmiennik „podpowiedziany ciężar ∈ dostępne ciężary” (z tolerancją kg/lb).
- Migracja idempotentna, eksport → import zachowuje miejsca.

## 9. Otwarte pytania / niepewne liczby
- Domyślne presety: zestaw hantli 1–10 co 1 kg w siłowniach komercyjnych, kettle 4/6/10/14 kg, stosy maszyn co 5 kg w UE — **niezweryfikowane** (oznaczone w raporcie). Do potwierdzenia przed wpisaniem do kodu.
- Polskie nazwy części sprzętu oznaczone w raporcie gwiazdką — potoczne, niezweryfikowane w sklepach.
- Kroki regulacji TREXO TXO-B4W002 i ViShape — do odczytania z urządzeń.
- Nordic curl (kotwica stóp w domu: kanapa, pas) i „Rower” (rower stacjonarny vs własny rower na zewnątrz) — niska pewność w katalogu.

## 10. Weryfikacja
Niezależny przegląd 02.10.2026 (agent, który nie pisał dokumentu): 6 wysokich, 14 średnich, 8 niskich uwag. Wszystkie wysokie i średnie są uwzględnione wyżej:
- bramka Epleya odrzucona na rzecz prostej bramki 10%;
- miejsce a „Poprzednio” (decyzja 8);
- biała lista pól w `migrate()`;
- poprawiony wiersz tabeli o JEFIT, StrengthLog i Boostcamp;
- „Legs — dom” → decyzja 9;
- źródła spoza bazy wiedzy;
- uznanie Liftosaur i Alpha;
- para czy jeden hantel;
- kg/lb;
- ćwiczenia własne;
- sprawy do rozstrzygnięcia przy wdrożeniu.

Poprawki katalogu (Wall Sit, Bieg, Rower, siedzisko na skosie, Łydki na stopniu, kółka, kettle przy spacerze farmera, face pull, stojak przy wiosłowaniu) wprowadzone w `catalog.json`. Sprawdzone i poprawne: algorytm talerzy (3 przypadki) i liczby w katalogu.

## Implementacja E1 (gałąź feature/locations)

Stan 03.10.2026: 4 commity E1 + 2 commity poprawek po niezależnym audycie + po 1 commicie po weryfikacjach 2 i 3 (sekcja „Audyt E1” niżej) na `feature/locations` (bez push i buildu). Weryfikacja: `npx tsc --noEmit` ✓, `npm run check:i18n` ✓, `npx jest --maxWorkers=2` 763/763 ✓ (650 dotychczasowych + 113 nowych w `tests/locations-*.test.ts(x)`), `node scripts/equipment/gen.mjs --check` ✓, `node scripts/verify-native.mjs` ✓.

### Co jest zrobione
- **A. `lib/equipment.ts`** — jedno źródło prawdy: słownik możliwości (z katalogu + `bands`, `cable.rope`, `ankle_strap`, `cable.handles`), 50 pozycji sprzętu w 7 grupach (PL/EN, opcje → dodatkowe możliwości, rodzaj ciężarów), stacja z oporem elektrycznym/magnetycznym jako **jedna pozycja** (zawsze `cable.low`; domyślnie zaznaczone opcje: dwie linki, pas biodrowy, opaski; do zaznaczenia: ramiona/wysoki wyciąg, ławka, lina), presety miejsc, `availability(ćwiczenie, miejsce)` → `{ ok, missing: grupy, missingRecommended }`, `loadsFor(ćwiczenie, miejsce)`. Wymagania 125 ćwiczeń są **generowane** z `catalog.json` (`scripts/equipment/gen.mjs` → `lib/catalog.generated.ts`; test sprawdza, że plik jest aktualny).
- **B. `lib/loads.ts`** — lista ciężarów z przełącznikiem przy każdym, „zakres + krok” jako skrót edytora zapisywany do listy (odznaczone zostają odznaczone), uchwyt/gryf + talerze (ograniczona suma podzbiorów; para hantli = 4 sztuki na krok, jeden hantel / sztanga = 2), stacja elektryczna (zakres na stronę + krok; od 03.10 zawsze wartości na stronę — „ViShape na stronę”, bez ×2 dla dwóch linek), kg/lb przez to samo przyciąganie co wpis w polu (`snapLb`), tolerancja 0,01 kg. Testy: Hop-Sport para (8 ciężarów), jeden hantel (21 do 18,5), sztanga 20 + para talerzy (co 2,5 do 177,5), ViShape Pro (128 ustawień), fast-check (zgodność z pełnym przeliczeniem, sortowanie, „najbliższy większy ∈ dostępne”).
- **C. Model danych, schemat 14** — `Settings.locations[]`, `mainLocationId`, `pickerShowAll`; `Workout.locationId?`, `Template.locationId?`; ćwiczenie: `requires`, `recommended`, `pattern`, `loadSource`, `implements` (zapisane w ćwiczeniu). Migracja: ćwiczenia z flagą `lib` dostają dane z katalogu po nazwie kanonicznej; własne — `requires: []` (zawsze dostępne) i `loadSource` ze zgrubnego sprzętu (także po zmianie sprzętu w edycji). Biała lista Ustawień w `migrate()` rozszerzona (sprzęt i opcje tylko znane, ciężary sanityzowane, miejsce główne zawsze istnieje, gdy są miejsca). Testy: idempotencja (fast-check), eksport → import, restart, stary backup web 0.3.
- **D. Ekrany** — Ustawienia → „Miejsca treningu” (`app/more/locations.tsx`): lista (★ główne), „+ Dodaj miejsce” z presetami. Miejsce (`app/more/location/[id].tsx`): nazwa, „Ustaw jako główne”, licznik „Dostępne ćwiczenia: N z M”, sprzęt w grupach (przełączniki iOS), opcje pod pozycją, edytor ciężarów (`components/LoadEditor.tsx`: lista z odznaczaniem + „wypełnij zakresem” + „dodaj ciężar”; uchwyt/gryf + talerze w sztukach; min/max na stronę + krok; jednostka sprzętu kg/lb; presety modeli tylko ze źródeł: Gymtek 2,5–24, Hop-Sport 2×10, ViShape Pro i Lite), „Duplikuj”, „Usuń”. Zapis przy każdej zmianie.
- **E. Trening** — „📍 Dom ▾” pod nazwą treningu (tylko gdy są miejsca; zmiana tylko dla tej sesji, nic nie jest przepisywane); szablon: „Miejsce domyślne” (chipy); start: miejsce szablonu, inaczej główne; „Powtórz ostatni” — miejsce tamtego treningu. Wybór ćwiczenia: domyślnie tylko dostępne w miejscu treningu (albo w miejscu domyślnym edytowanego szablonu), zapamiętany przełącznik „Pokaż wszystkie”, niedostępne wyszarzone z „brak: sztanga, klatka / stojaki”; dokładna nazwa z wyszukiwania pokazuje się mimo filtra. Blok ćwiczenia: plakietka „brak sprzętu w: Dom (…)”, nigdy automatyczna zamiana.
- **F. Podpowiedzi** — „↑” = najbliższy większy **dostępny** ciężar (od 03.10 bez bramki 10% — decyzja 7a; wcześniej przy skoku > 10% najpierw „ten sam ciężar, + 2 pow.”); ciężar ≥ największy dostępny → brak „↑”; przyrząd bez wpisanych ciężarów → podpowiedź jak dotąd; brak przyrządu z ciężarem (np. wykroki w miejscu bez hantli) → podpowiedź w powtórzeniach. Masa ciała z dociążeniem — bez zmian. Wpisane wartości nigdy nie są zmieniane. „Poprzednio” i wstępne wartości: w E1 najpierw ostatni trening w tym samym miejscu (8a); **od 03.10 ostatni raz tym samym przyrządem, gdziekolwiek (8c)** — dopisek „Poprzednio: Siłownia”, gdy źródło jest z innego, znanego miejsca.
- **Bez miejsc** aplikacja działa jak dotąd: trening nie dostaje pola `locationId`, picker bez filtra, podpowiedzi i „Poprzednio” bez zmian (cały dotychczasowy zestaw testów przechodzi).

### Decyzje zastosowane
| # | Decyzja | Jak w kodzie |
|---|---|---|
| 1a | miejsce główne + miejsce szablonu + zmiana na starcie | `startLocationId()`, chip „📍” w treningu, chipy w szablonie; trening wstecz — `startLocationId()` w `beginPast` (bez zmiany, „📍” tylko do odczytu) |
| 2 | bez zamienników per miejsce w E1 | szablony bez zmian; `alternates` → E2 |
| 3a | tylko dostępne + zapamiętane „Pokaż wszystkie” | `Settings.pickerShowAll` (jedno ustawienie dla wszystkich miejsc) |
| 4a | wykroki, step-up, russian twist bez wymogu hantli | z katalogu; „Tylko masa ciała” = 20 ćwiczeń |
| 5 | duplikaty zostają | bez zmian w bibliotece |
| 6 | gumy globalne | pozycja „Gumy oporowe” (możliwość `bands`) tylko informacyjnie; nic jej nie wymaga |
| ~~7b~~ → **7a** (03.10) | bez bramki: zawsze najbliższy większy dostępny ciężar | `progressionFor` — usunięte `PROGRESSION_GATE` i krok „↑ ten sam ciężar, spróbuj {n} pow.” (klucz i18n usunięty) |
| ~~8a~~ → **8c** (03.10) | „Poprzednio” i wstępne wartości = ostatni raz tym samym przyrządem, gdziekolwiek | `WExercise.impl` (schemat 15) + `previousBlockFor(…, impl)`, `previousBlockBefore(…, impl)`; tylko gdy są miejsca; reguła — sekcja „Decyzje właściciela 03.10.2026” |
| **P-004 b** (03.10) | hantle wpisuje się na hantel | wpisuje użytkownik; od decyzji z 08:11 aplikacja startuje BEZ szablonów i migracja nie zmienia ciężarów ani treści szablonów (dawne 24 kg w seedzie i migracja 48 → 24 usunięte — runda 82; zostaje normalizacja jak w main — runda 82b); historia bez zmian |
| 3.4 | stacja elektryczna jako jedna pozycja | `electric` z opcjami |
| **ViShape na stronę** (03.10) | ciężar stacji zawsze na stronę | `loadsFor`: stacja `mult: [1]` dla każdego ćwiczenia; presety ViShape Pro/Lite na stronę; podpowiedź w edytorze stacji; etykieta ciężaru bloku na stacji „kg/stronę” / „kg/str.” (runda 82, MEDIUM 2); objętość — otwarte pytanie (sekcja „Runda 82”) |

### Dom użytkownika (test `tests/locations-catalog.test.ts`)
Ławka regulowana, drążek, poręcze, hantle z listą (TREXO), ViShape SmartGym Pro (1,5–65 kg/str., krok 0,5; dwie linki od dołu, pas, opaski; bez wysokiego wyciągu). Dostępnych **70 ze 125**, m.in. Bench Press (hantle) ✓, Pull Up ✓, Chest Dip ✓, Przysiad z pasem (linki) ✓ (stacja: wyciąg dolny + pas), cały szablon „Legs — dom” ✓ (szablon właściciela — w testach z danych testowych `tests/fixtures/demo-templates.ts`); niedostępne m.in. Back Squat (sztanga, stojaki), Lat Pulldown / Face Pull / Triceps Pushdown (brak wysokiego wyciągu — po zaznaczeniu opcji „ramiona” byłyby dostępne), maszyny, cardio. Pełną listę warto przejrzeć z użytkownikiem (ekran miejsca pokazuje licznik, picker — „brak: …”).

### Odstępstwa i doprecyzowania
- **Testy schematu:** dwa istniejące testy miały wpisany literał `schemaVersion === 13` (audit-r72-b B7/B8, regress R55-01) — zmieniony na 14 (03.10: na 15). Poza tym żaden dotychczasowy test nie był zmieniany w E1 (zmiany z 03.10 — sekcja „Decyzje właściciela 03.10.2026”).
- **`implements`** dopisane do `catalog.json` (9 × jeden, 29 × para); Łydki na stopniu = para (niepewne, bez znaczenia przy hantlach z listą).
- **Usuwanie:** miejsca głównego nie da się usunąć, dopóki jest inne; **jedyne** miejsce można usunąć — aplikacja wraca wtedy do trybu bez miejsc (inaczej nie dałoby się z niego wyjść).
- **Stacja elektryczna:** seria nie zapisuje liczby linek. W E1 ćwiczenia wymagające dwóch linek dostawały 2 × na stronę, a przysiad z pasem ×1 i ×2; **od 03.10 („ViShape na stronę”) każde ćwiczenie na stacji — tylko wartości na stronę** (tak jak pokazuje urządzenie). Ustawienia „urządzenie pokazuje na stronę / łącznie” nie ma — wszystkie zbadane urządzenia ustawiają ciężar na stronę.
- **Talerze** są opisane osobno przy każdej pozycji (sztanga, EZ, trap bar, hantle na talerze) — bez wspólnej puli talerzy miejsca (do rozważenia z kalkulatorem talerzy, E3).
- **Presety:** „Pełna siłownia” = cały sprzęt (125/125), sztanga/EZ/trap bar z talerzami 25…1,25 (po 8 szt.), hantle 2,5–50 co 2,5; **stosy maszyn, wyciągów i kettle — puste** (wartości z researchu niezweryfikowane; podpowiedź działa wtedy jak dotąd). „Hotel”: hantle 2,5–25 co 2,5, ławka regulowana, mata, bieżnia, rower — do potwierdzenia.
- **TREXO TXO-B4W002:** brak presetu modelu (kroki nieznane). Użytkownik wpisuje listę sam (np. „wypełnij zakresem” i odznaczenie brakujących).
- **Picker w edycji szablonu** filtruje tylko po jawnie ustawionym miejscu szablonu (szablon bez miejsca — bez filtra).
- **Wymagania ćwiczenia** są zapisane w ćwiczeniu, ale ekran edycji ćwiczenia ich jeszcze nie pokazuje ani nie edytuje.
- **Edycja historii i trening wstecz (docs/12, integracja 0.9.0):** edycja zachowuje miejsce treningu i przyrządy bloków; trening wstecz dostaje miejsce jak start treningu (decyzja 1a: miejsce szablonu, inaczej główne; tylko gdy są miejsca) — w edytorze „📍 Dom” tylko do odczytu; wybór ćwiczenia w edytorze filtruje po miejscu szkicu, gdy je ma. Wartości wstawiane w edytorze historii stosują decyzję 8c (od 03.10; wcześniej 8a): `previousBlockBefore(…, impl)` skanuje sesje sprzed daty pasujące do przyrządu bloku, a gdy takiej nie ma — całą historię sprzed daty (fallback jak w `previousBlockFor`). Ciężar z sesji w innym, znanym miejscu albo z bloku innym, znanym przyrządem (runda 82, LOW 3) spoza listy dostępnych w miejscu szkicu (`offListAt`) nie jest wstawiany — puste zostają ciężar i powtórzenia razem; z sesji bez miejsca jest wstawiany, a blok w edytorze pokazuje dopisek „ciężaru … nie ma tutaj — wpisz ciężar”, dopóki pole jest wypełnione przez aplikację (runda 82, MEDIUM 1). `repeatLast`, gdy najnowszy trening nie ma miejsca (sprzed miejsc, import), a miejsca są: „nieznane miejsce” — start w miejscu głównym, wartości bez wstrzymywania (jak treningi sprzed miejsc w starcie z szablonu i przy odhaczaniu; dopisek jak wyżej). Bez miejsc — wszystko jak przed integracją.

### Co zostaje
- **E2:** ~~„Zamień ćwiczenie” (ranking zamienników), zamienniki per miejsce w szablonie (`TemplateItem.alternates`)~~ — zrobione 04.10.2026 (docs/14 pkt 10); zostaje: edycja wymagań w edycji ćwiczenia, liczba linek w serii, miejsce w historii (lista, filtr).
- **E3:** kalkulator talerzy i rozgrzewki z talerzy miejsca (wspólna pula talerzy).
- **Do ustalenia z użytkownikiem:** kroki regulacji TREXO (odczyt z pokrętła); wartości presetów (Hotel, stosy maszyn); przegląd listy 70 ćwiczeń dostępnych w domu. (ViShape na stronę i P-004 — rozstrzygnięte 03.10.)
- **Ryzyka:** kopia ze schematem 16 (od 04.10, E2; wcześniej 15) nie wczyta się w starszej wersji aplikacji; ekran miejsca ma ~50 przełączników i edytory ciężarów — do sprawdzenia na iPhonie (przewijanie, klawiatura nad polami „od/do/co”).

### Audyt E1 (03.10.2026) — poprawki
Niezależny audyt gałęzi: 3 wysokie, 11 średnich, kilka niskich. Wszystkie poprawione (M9 i M10 — tylko opisane niżej), każda z testem regresji w `tests/locations-audit.test.tsx` (23 testy).

| # | Problem | Poprawka |
|---|---|---|
| H1 | sanityzacja ucinała listę do 300 ciężarów / 30 talerzy, a edytor pozwalał na 2000 → utrata danych przy starcie/imporcie | jeden limit `LOAD_LIMITS` (lista 300, rodzaje talerzy 30, ustawienia stacji 2000, kombinacje talerzy 50 000) w edytorze, sanityzacji i obliczeniach; limit widoczny w edytorze |
| H2 | z listą ciężarów i poprzednim ciężarem 0 (wykroki, russian twist) podpowiedź „+1 kg”, choć najmniejszy hantel to 3 kg | lista + ciężar 0 → „↑ spróbuj {górna granica + 1} pow.” (spójne z decyzją 4a) |
| H3 | własne ćwiczenia na maszynie/wyciągu traciły „↑”, gdy istniało jakiekolwiek miejsce | brak dopasowanego przyrządu → „nieznane” (podpowiedź jak dotąd); „brak” tylko dla ćwiczeń biblioteki bez wymagań z obciążeniem zalecanym (4a) |
| M1 | ciężary wszystkich wyciągów łączone (Pushdown dostawał stos wyciągu do ściągania) | dobór pozycji po wymaganiu: najpierw pozycja dająca wprost pierwszą możliwość grupy, potem dowolną wymaganą wprost, potem „przy okazji” (`secondary`: wyciąg górny stacji do ściągania, dolny stacji do wiosłowania); bez dopasowania — wszystkie pozycje tego rodzaju (poza maszynami) |
| M2 | maszyna T-bar nie była źródłem ciężaru | możliwości maszyn z ciężarami w wymaganiach dodają rodzaj „maszyna” |
| M3 | ciężar z innego miejsca wstawiany do pól, choć tu go nie ma (32 kg z siłowni, w domu max 24) | przy starcie i odhaczeniu pustej serii ciężar z innego (znanego — weryfikacja 2) miejsca spoza listy nie jest wstawiany — zostaje tylko w „Poprzednio” (pkt 4.4); bez miejsc bez zmian |
| M4 | zmiana jednostki sprzętu zmieniała tylko podpis | `convertSpec`: kg → lb do 0,1 lb, lb → kg przez `snapLb`; kg → lb → kg wraca do tych samych kg |
| M5 | odznaczenie pozycji kasowało ciężary; preset modelu nadpisywał listę bez pytania | odznaczona pozycja dostaje `off: true` (opcje i ciężary zostają, także w kopii); preset pyta „Zastąpić wpisane ciężary?”, gdy coś jest wpisane |
| M6 | wymagania biblioteki kopiowane raz | `CATALOG_REV` (skrót treści katalogu, generowany); ćwiczenie z inną wersją dostaje przy starcie aktualne wymagania; `catalogRev: 'user'` = edytowane — przyszły edytor wymagań ma ustawiać tę wartość |
| M7 | VoiceOver: opcje bez nazwy pozycji, przyciski edytora bez kontekstu, ciężary jako zwykłe przyciski | etykiety „Pozycja: opcja”, „Akcja — Pozycja”; ciężary jako przełączniki ze stanem |
| M8 | „Poprzednio: bez miejsca” wszędzie po utworzeniu pierwszego miejsca | dopisek tylko, gdy poprzedni trening był w innym, określonym miejscu |
| M11 | zakresy i kombinacje talerzy ucinane po cichu (bez najcięższych) | ponad limit: edytor pokazuje komunikat i nie zmienia listy; opis ponad limit daje pustą listę (podpowiedź jak bez miejsca), nigdy listę bez najcięższych |
| LOW | — | `achievable` zapamiętywane po treści opisu (nie po rewizji miejsca: edytor zmienia obiekt w miejscu, a klucz z treści nie daje starego wyniku; `capsOf`/`availability` są tanie); preset „Pełna siłownia” i „Hotel” w lb (gryf 45 lb, talerze 45…2,5, hantle co 5 lb); nazwy presetów modeli wg języka; nazwa miejsca ≤ 80 znaków, wyjście z pustą nazwą przywraca poprzednią; stacja z max < min zostaje jak wpisana i edytor to zgłasza; uszkodzona grupa wymagań → `['?']` (ćwiczenie niedostępne, „brak: ?” — wybór zachowawczy); jednorącz na linkach > 65 kg/str. nie dostaje wartości „dwóch linek” |

**Weryfikacja 2 (03.10.2026)** — 1 nowy wysoki (skutek poprawki M3) i 4 niskie; poprawione, testy w `tests/locations-verify2.test.tsx` (7 testów):
- **HIGH:** M3 traktowało treningi zapisane przed utworzeniem miejsc (bez `locationId`) jako „inne miejsce”, a M8 — nie. Po dodaniu pierwszego miejsca ciężar z historii był wstrzymywany, a ✓ zapisywało serię z powtórzeniami i PUSTYM ciężarem (objętość, rekordy i progresja psute; następna sesja dziedziczyła pustkę). Teraz M3 działa tylko, gdy poprzedni trening ma **znane, inne** miejsce (spójnie z M8). Siatka bezpieczeństwa: gdy ciężar z podpowiedzi jest wstrzymany, a pole ciężaru puste, ✓ nie wstawia nic (ani powtórzeń z podpowiedzi, ani dolnej granicy zakresu), a start treningu nie przepisuje samych powtórzeń — nigdy „ciężar pusty + powtórzenia z podpowiedzi”. Testy: scenariusz z raportu (24×10, 61×5 → „Pełna siłownia”) i wypełnianie z historii tego samego miejsca.
- **LOW 1:** talerze przy zmianie jednostki przeliczane dokładnym współczynnikiem (10⁻⁶), a sumy talerzy liczone w milionowych — zaokrąglanie każdego talerza do 0,1 lb dawało prawie-duplikaty (68 zamiast 64 ciężarów; przy 8 sztukach 486 zamiast 253).
- **LOW 2:** jeden zakres wartości 0,001–1000 (`W_MIN`, `W_MAX`) w edytorze (zakres, dodawany ciężar, krok stacji) i sanityzacji; zły opis ciężarów z importu zastępowany pustym domyślnym (edytor nie znika); dopiero dodany wiersz talerza (0) zostaje.
- **LOW 3:** przeliczony krok stacji zaokrąglany w górę tak, by nie przekroczyć limitu 2000 ustawień.
- **LOW 4:** ciężar w edytorze (przełącznik) ma w podpowiedzi VoiceOver nazwę pozycji.

**Weryfikacja 3 (03.10.2026)** — 0 wysokich, 0 średnich, 5 niskich; poprawione, testy w `tests/locations-verify3.test.tsx` (7 testów):
- **L1:** okno „Zakończyć trening?” ostrzega „Odhaczone serie bez ciężaru: n” (ćwiczenia z ciężarem, bez masy ciała; pusty ciężar, nie 0 kg) — także bez miejsc (pierwsza sesja; dotychczasowe testy okna sprawdzają treść przez dopasowanie, więc dodatkowa linia ich nie zmienia). Przy ćwiczeniu dopisek „Poprzednio: Siłownia · ciężaru 32 kg nie ma tutaj — wpisz ciężar”.
- **L2:** „Powtórz ostatni” stosuje to samo sprawdzenie co start z szablonu (ostatni trening w znanym, innym miejscu — np. usuniętym — i ciężar spoza listy: pole puste, bez samych powtórzeń).
- **L3:** stacja przy zmianie jednostki przeliczana dokładnym współczynnikiem (jak talerze); zakresy liczone w milionowych; przeliczenie lb → kg najpierw na siatkę wyświetlania 0,1 lb (jak `wOut`) — 22,0462 lb nie zaokrągla się podwójnie do 22,1 (10,02 kg). Ustawienia w kg przed i po zmianie jednostki są te same.
- **L4:** pola uchwytu/gryfu, talerzy i stacji pokazują najwyżej 3 miejsca po przecinku (zapis zostaje dokładny).
- **L5:** zmiana sprzętu ćwiczenia z biblioteki: wymagania i zalecane czyszczone (ćwiczenie zawsze dostępne), źródło obciążenia ze zgrubnego sprzętu, `implements` usunięte, `catalogRev: 'user'` (start aplikacji nie przywraca wymagań z katalogu). Np. Bench Press (hantle) przestawione na linki bierze ciężary stacji, nie hantli.

**Znane skutki zasad (M9, M10 — bez zmian w kodzie):**
- **P-004 a podpowiedź w domu:** ~~48 kg (suma pary) w szablonie → w domu brak „↑”~~ — rozstrzygnięte 03.10 (b): hantle na hantel; szablony ustawia właściciel (08:11 — aplikacja ich nie zmienia). Zostaje skutek dla historii i szablonów zapisanych jako suma (sekcja „Decyzje właściciela 03.10.2026”, ryzyka).
- **Cable Fly na linkach od podłogi:** katalog wymaga tylko dwóch linek (`cable.dual`), więc na ViShape (linki od dołu) Cable Fly jest „dostępne” — w praktyce jako rozpiętki od dołu. Dokładniej dopiero po rozbiciu wysokości linek w wymaganiu (E2).
- **Stacja powyżej 65 kg/str.:** od 03.10 wszystkie ćwiczenia na stacji dostają tylko wartości na stronę — 65 kg/str. (ViShape Pro) to koniec listy, więc dalej brak „↑”.
- ~~**Hantle co 2,5 kg i bramka 10%**~~ — nieaktualne od 03.10 (decyzja 7a: bez bramki, od razu następny dostępny ciężar).

## Decyzje właściciela 03.10.2026 (07:35) — wdrożenie (runda 81, `integration/0.9.0`)

Słowa właściciela: „gdy następny ciężar to skok o ponad 10%, podpowiedź najpierw proponuje +2 powtórzenia — to ma sens? Chyba będzie wkurzające. „Poprzednio” nie powinno brać najpierw treningu z tego samego miejsca, jeżeli ćwiczenie było wykonywane w międzyczasie gdzie indziej. Jedyne co można brać pod uwagę to sprzęt, jakim było wykonywane, bo hantle to nie sztanga — poprzednio pokazuje ostatni raz tym samym sprzętem. Jeżeli coś jest hantlami, to powinno być wpisywane per hantel. ViShape na stronę.”

| # | Było | Jest | Jak w kodzie |
|---|---|---|---|
| 7 | 7b: skok > 10% → najpierw „ten sam ciężar, górna granica + 2” | **7a:** gdy wszystkie serie robocze doszły do górnej granicy — „↑ spróbuj X”, X = najbliższy większy DOSTĘPNY ciężar, także przy dużym skoku (10 → 12 kg, 25 → 30 kg na maszynie) | `progressionFor`: usunięte `PROGRESSION_GATE` i `gate`; klucz i18n „↑ ten sam ciężar, spróbuj {n} pow.” usunięty. Zostają poprawki audytu: ciężar ≤ 0 → powtórzenia (H2), przyrząd bez ciężarów / „nieznane” → podpowiedź jak przed P-003 (H3), „brak” (wykroki bez hantli) → powtórzenia albo nic, nigdy ciężar spoza listy |
| 8 | 8a: najpierw ostatni trening w tym samym miejscu | **8c:** ostatni raz **tym samym przyrządem**, gdziekolwiek | patrz „Reguła 8c” niżej |
| P-004 | szablony z sumą pary (48 kg) przy trybie „na hantel” | **(b):** hantle wpisuje się **na hantel** | ~~`lib/seed.ts` 48 → 24 i migracja szablonów~~ — **zastąpione decyzją z 08:11** („Nie przenoś do aplikacji żadnych moich szablonów. Sam je ustawię.”): seed bez szablonów, migracja nie zmienia ciężarów ani treści szablonów — poza normalizacją jak w main (sekcje „Runda 82” i „Runda 82b”) |
| 3.4 | stacja: 2 × na stronę dla ćwiczeń na dwie linki, przysiad z pasem ×1/×2 | **ViShape na stronę:** ciężar stacji zawsze na stronę (domyślnie i w presetach ViShape Pro/Lite: 1,5–65 / 1,5–35 kg na stronę) | `lib/equipment.ts` `resolveLoads`: stacja `mult: [1]`; edytor stacji: „Ciężar serii na stacji wpisuj na stronę — tak, jak pokazuje urządzenie.” |

### Reguła 8c (dokładnie)
- **Przyrząd bloku** `WExercise.impl` ∈ `barbell | ez_bar | trap_bar | dumbbell | kettlebell | cable | electric | machine` — zapisywany, gdy blok powstaje w treningu z miejscem: start z szablonu, „+ ćwiczenie” w trakcie, „Powtórz ostatni” (liczony od nowa dla miejsca NOWEGO treningu, nie kopiowany), trening wstecz i ćwiczenie dodane w edytorze historii (wg miejsca szkicu); zmiana miejsca chipem „📍” w trakcie liczy od nowa przyrządy bloków **bez odhaczonych serii** (`setActiveLocation`; blok z odhaczonymi seriami zachowuje przyrząd, którym je zrobiono — runda 82, LOW 5). Edycja treningu z historii zachowuje przyrządy. Trening bez miejsca i dane sprzed schematu 15 — pola brak.
- **Rozstrzygnięcie przyrządu** (`implAt`) = ten sam dobór co `loadsFor`: pierwszy rodzaj ciężaru ćwiczenia (źródło z katalogu, potem alternatywy z wymagań: RDL hantle|wyciąg dolny, Goblet hantel|kettle, T-Bar sztanga|maszyna…), który w miejscu ma wpisane ciężary; gdy żaden nie ma — pierwszy obecny. Wyciąg: `electric`, gdy wartości (albo pierwsza pasująca pozycja) pochodzą ze stacji z oporem elektrycznym/magnetycznym, inaczej `cable`. Masa ciała / brak pasującego przyrządu — brak.
- **„Poprzednio” i wstępne wartości** (`previousBlockFor(…, impl)`, w edytorze historii `previousBlockBefore(…, impl)` z filtrem daty): gdy są miejsca i blok ma przyrząd — **najnowsza sesja spośród tych, w których któryś blok tego ćwiczenia ma ten sam przyrząd ALBO przyrząd nieznany**; gdy takiej nie ma — najnowsza sesja w ogóle. Miejsce nie ma znaczenia. Dalej ten sam dobór bloku (pozycja szablonu, k-ty blok, drop sety) w tej samej (przefiltrowanej) historii — a w wybranej sesji tylko spośród bloków tym samym albo nieznanym przyrządem (runda 82, LOW 4: sesja z RDL hantlami i na linkach nie miesza wartości). Blok bez przyrządu (np. masa ciała, trening bez miejsca) — najnowsza sesja w ogóle.
- **Dlaczego nieznany przyrząd pasuje:** to dane sprzed miejsc i treningi bez miejsca — zwykle tym samym przyrządem (w aplikacji hantle i sztanga to i tak osobne ćwiczenia, np. Bench Press (hantle) / (sztanga)), a pominięcie ich kazałoby wracać do dużo starszych sesji. Najprostsza poprawna reguła: jeden filtr, bez porównywania dat między grupami.
- **Bez miejsc** — bit w bit jak na `main`: przyrząd nie jest zapisywany, klucze cache i wyniki te same (test: `previousBlockFor(…, impl)` zwraca TEN SAM obiekt co bez przyrządu, także gdy dane mają `impl`).
- **Zostaje:** bezpiecznik M3 (ciężar z sesji w innym, znanym miejscu — albo, od rundy 82, z bloku innym, znanym przyrządem, np. fallback na stację, gdy dziś hantle w tym samym miejscu — którego nie ma na liście tego miejsca, nie jest wstawiany — puste ciężar i powtórzenia; widoczny w dopisku „Poprzednio: Siłownia · ciężaru 32 kg nie ma tutaj — wpisz ciężar”, przy tym samym miejscu bez prefiksu; jedna reguła `prevFromOther` w starcie z szablonu, „Powtórz ostatni”, odhaczeniu i edytorze historii; z sesji bez miejsca wartość zostaje z tym samym dopiskiem — runda 82, MEDIUM 1; dopisek tylko dla serii roboczych > 0 spoza listy i znika po wpisaniu ciężaru — runda 82b, `offListNote`), ostrzeżenie „Odhaczone serie bez ciężaru” przy „Zakończ” i „Serie bez ciężaru” w edytorze. Dopisek „Poprzednio: ‹miejsce›” — gdy sesja źródłowa jest z innego, znanego miejsca niż trening (od 8c zdarza się częściej: np. hantle ostatnio w siłowni).
- **Schemat 15:** `migrate()` zostawia tylko znane wartości `impl` (historia i trening w toku); idempotentne, eksport → import i restart 1:1 (testy).

### P-004 — migracja istniejących instalacji (USUNIĘTA w rundzie 82)
- ~~Przy przejściu ze schematu < 15: w szablonach Deadlift (hantle) / RDL (hantle/linki) z biblioteki w trybie „na hantel” 48 → 24.~~ Decyzja właściciela 03.10.2026, 08:11: „Nie przenoś do aplikacji żadnych moich szablonów. Sam je ustawię.” — **aplikacja nie zmienia ciężarów ani treści szablonów użytkownika**: przy przejściu na schemat 15, przy imporcie kopii i imporcie web 0.3 48 zostaje 48 i nic nie jest dopisywane ani przeliczane. Precyzyjnie (runda 82b, weryfikacja 6ea37a3 LOW 8): `migrate()` dalej robi tę samą normalizację co w main — usuwa pozycje szablonu, których ćwiczenia nie ma albo jest usunięte (zarchiwizowane), i porządkuje pola (liczba serii 1–50, zakresy powtórzeń, przerwa, ciężar startowy na siatce kg, supersety); poza tym szablony zostają, jak były. Schemat 15 zostaje (pole `impl`).
- **Historia bez zmian** (A-002): zapisane serie zostają, jak były.

### Ryzyka i znane skutki
- **Import web 0.3 (test E3 w docs/09):** jeśli w web serie Deadlift (hantle) / RDL zapisywano jako sumę pary (48), po imporcie liczą się jako 48 na hantel — objętość tych ćwiczeń ×2, rekordy zawyżone, a „Poprzednio” pokaże 48. Sesje z web 0.3 (i z 0.8.5) nie mają miejsca, więc 48 **jest wstawiane** do pól (bez wstrzymania — HIGH z weryfikacji 2); w miejscu, w którym 48 nie ma na liście (dom: hantle do 24), przy ćwiczeniu i w edytorze historii pojawia się dopisek „ciężaru 48 kg nie ma tutaj — wpisz ciężar”, a „↑” nie ma (runda 82, MEDIUM 1). Ciężary szablonów z kopii zostają, jak były (48 kg — decyzja 08:11; tylko normalizacja jak w main). Po pierwszym treningu z wpisem na hantel (24) „Poprzednio” jest już poprawne; historii aplikacja nie przelicza. To samo dotyczy obecnej historii na telefonie (0.8.5), jeśli tam wpisywano sumę.
- **Przyrząd wybiera miejsce, nie użytkownik:** RDL w domu z hantlami i ViShape zawsze rozstrzyga się na hantle (pierwsze źródło z ciężarami); RDL na linkach w domu zapisze się jako „hantle”. Wybór przyrządu per blok — razem z „Zamień ćwiczenie” (E2).
- **Ta sama maszyna w dwóch siłowniach** to ten sam przyrząd (`machine`) — „Poprzednio” bierze ostatni raz gdziekolwiek; różne stosy rozróżnia osobne ćwiczenie.
- **Objętość na stacji:** ciężar na stronę × powtórzenia; ćwiczenia w trybie „łącznie” na dwie linki (np. przysiad z pasem, rozpiętki) liczą objętość z wartości na stronę (×1 — połowa realnego oporu). Porównania i rekordy są per ćwiczenie, więc spójne; tryb liczenia można zmienić w edycji ćwiczenia. **Otwarte pytanie** — sekcja „Runda 82”.
- **Sesja z dwoma blokami tego samego ćwiczenia różnymi przyrządami** pasuje do obu przyrządów (filtr działa na sesjach), ale wartości bierze tylko z bloków tym samym albo nieznanym przyrządem (runda 82, LOW 4; wcześniej mieszała serie obu bloków).
- Kopia ze schematem 15 nie wczyta się w starszej wersji aplikacji (jak przy każdej zmianie schematu).

### Testy
`tests/decisions-0310.test.tsx` (17): 7a (właściwość fast-check „dokładnie następny dostępny albo nic”, skoki +20% i +100%, poprawki audytu), 8c (implAt, reguła z nieznanym przyrządem i fallbackiem, start z szablonu dom ↔ garaż, wyciąg ≠ stacja, dwa ekrany z dopiskiem i bez, dodanie w trakcie / zmiana miejsca / „Powtórz ostatni”, edycja i trening wstecz, ZERO miejsc), schemat 15 (sanityzacja `impl`, idempotencja, eksport → import, restart), ~~P-004 (seed PL/EN, migracja 48 → 24)~~ → od rundy 82 decyzja 08:11 (seed PL/EN bez szablonów, przejście ze schematu 14 i import kopii / web 0.3 — szablony 1:1, 48 zostaje, historia bez zmian), ViShape na stronę (wszystkie ćwiczenia na stacji, presety, tekst w edytorze). Dotychczasowe testy 7b/8a przepisane na 7a/8c (locations-progress, locations-model, locations-audit, locations-loads, locations-ui, integration-090) oraz literał schematu 14 → 15 (audit-r72-b, regress R55-01, locations-model).

## Runda 82 (03.10.2026) — decyzja 08:11 i poprawki audytu commitów f132330 / 025ee6a

**Decyzja właściciela 03.10.2026, 08:11:** „Nie przenoś do aplikacji żadnych moich szablonów. Sam je ustawię.”

| # | Było | Jest | Jak w kodzie |
|---|---|---|---|
| Szablony | seed tworzył 4 szablony właściciela (Upper A, Upper B, Legs — siłownia, Legs — dom); migracja P-004 zmieniała 48 → 24 kg w szablonach przy przejściu na schemat 15 | świeża instalacja: **`templates: []`** (biblioteka ćwiczeń i gumy bez zmian); aplikacja nie zmienia ciężarów ani treści szablonów użytkownika — przejście ze schematu 14, import kopii i import web 0.3 zostawiają je bez zmian poza normalizacją jak w main (usunięcie pozycji z brakującym/usuniętym ćwiczeniem, pola liczbowe — runda 82b) | `lib/seed.ts` `seedState` bez szablonów; `lib/store.ts` `migrate` — usunięte `P004_NAMES` i zmiana 48 → 24; schemat 15 zostaje (pole `impl`). Ekran główny bez szablonów: wskazówka „Pierwszy raz? Utwórz swój szablon („+ Nowy szablon” niżej) albo zacznij pusty trening…”, pusty stan „Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.” i przycisk „+ Nowy szablon” (PL i EN). Dawne szablony żyją tylko w danych testowych `tests/fixtures/demo-templates.ts` (`withDemoTemplates()`, `seedWithDemo()` w `tests/helpers.ts`; zrzuty ekranu i pomiar wydajności dokładają je jawnie); E2E Maestro tworzą szablon „Upper A” przez UI (`.maestro/subflows/szablon-testowy.yaml`, wołany w 01, 02, 03, 05). |
| MEDIUM 1 | historia bez miejsca (0.8.5, web 0.3) wstawiała ciężar spoza listy po cichu | wartość **zostaje** (bez powrotu do wstrzymywania — HIGH z weryfikacji 2), ale ekran treningu pokazuje dopisek „ciężaru 32 kg nie ma tutaj — wpisz ciężar” (bez prefiksu „Poprzednio:” — M8), a edytor historii — ten sam dopisek w bloku, dopóki ciężar jest wstawiony przez aplikację i nieruszony | `components/ActiveWorkout.tsx` (dopisek, gdy pierwszy ciężar z „Poprzednio” jest spoza listy miejsca treningu — z każdego źródła; prefiks miejsca tylko dla innego, znanego miejsca); `lib/edit.ts` `prefilledOffList` + `app/history/edit/[id].tsx` — **reguła zawężona w rundzie 82b** (`store.offListNote`) |
| MEDIUM 2 | „ViShape na stronę” zmieniało tylko listy ciężarów; kolumna mówiła „kg” / „kg/hantel” | blok na stacji (`impl` 'electric') — etykieta ciężaru **„kg/stronę”** (kolumna „kg/str.”), EN „kg/side” — dla każdego ćwiczenia na stacji, także „Przysiad z pasem (linki)”, „Cable Fly”, „RDL (hantle/linki)” | `loadLabel(ex, impl)` / `loadLabelShort(ex, impl)`; przyrząd bloku: historia sesji i edycja zapisanego treningu — `blockImpl` (zapisany, a gdy go nie ma — rozstrzygnięty dla miejsca treningu); trening w toku i nowy trening wstecz w edytorze historii — od rundy 82b `liveBlockImpl` (to samo, ale bez miejsc przyrząd się nie liczy — etykiety jak w main, LOW 4 rundy 82b); edytor szablonu — przyrząd w miejscu startu szablonu |
| LOW 3 | „Poprzednio” z fallbacku 8c zrobione innym przyrządem w tym samym miejscu omijało bezpiecznik M3 | znany, inny przyrząd bloku źródłowego = jak inne, znane miejsce: ciężar spoza listy nie trafia do pól (puste ciężar i powtórzenia), dopisek jak wyżej | jedna reguła `prevFromOther(src, exId, locationId, impl)` w `startFromTemplate`, `repeatLast`, odhaczeniu pustej serii i `prefillFor` (edytor historii) |
| LOW 4 | sesja z dwoma blokami tego samego ćwiczenia różnymi przyrządami mieszała wartości obu | w wybranej sesji tylko bloki tym samym albo nieznanym przyrządem (gdy takie są) | `implBlocks` w `prevScan` i `byTplBlockScan`, warunek przyrządu w `byItemScan`; tylko przy aktywnym filtrze 8c (bez miejsc — bez zmian) |
| LOW 5 | zmiana miejsca w trakcie przemianowywała przyrząd bloków z odhaczonymi seriami | od nowa tylko przyrządy bloków bez odhaczonych serii | `setActiveLocation` |
| LOW 6 | docs/10: „×1/×2 linki”, „schemat 14” | poprawione (stacja zawsze na stronę; schemat 15) | — |

**Otwarte pytanie (decyzja właściciela): objętość stacji — ×1 czy ×2 przy ćwiczeniach na dwie linki.** Dziś (bez zmian w rundzie 82): objętość = ciężar na stronę × powtórzenia × mnożnik trybu liczenia ćwiczenia (`exMult`): ćwiczenia w trybie „łącznie” (np. „Przysiad z pasem (linki)”, „Cable Fly”) ×1 — czyli połowa realnego oporu dwóch linek; „RDL (hantle/linki)” w trybie „na hantel” ×2 także na stacji. Do wyboru: (a) zostawić ×1 (spójne rekordy per ćwiczenie, prostsze); (b) ×2 dla bloków na stacji przy ćwiczeniach na dwie linki (realna objętość, ale zmiana historii rekordów po wdrożeniu i potrzeba rozróżnienia jednej/dwóch linek). Rekordy „Max ciężar (na stronę)” w Postępach zależą dziś od trybu liczenia ćwiczenia, nie od przyrządu bloku.

**Testy:** `tests/audit-r82.test.tsx` (13: MEDIUM 1 — start z szablonu, odhaczenie, edytor historii z ekranem, bez miejsc; MEDIUM 2 — etykiety PL/EN, trening w garażu i w domu, historia, edytor szablonu, objętość bez zmian; LOW 3 — start, odhaczenie, edytor, „Powtórz ostatni”, ekran, `prevFromOther`; LOW 5), `tests/decisions-0310.test.tsx` (LOW 4 — wartości, nie tylko id sesji; decyzja 08:11 — seed PL/EN bez szablonów, schemat 14 z 48 kg → 48 zostaje przez migrację i start aplikacji, import kopii i web 0.3), `tests/flows.test.tsx` (B1 — pierwszy start bez szablonów: wskazówka, pusty stan, „+ Nowy szablon” → edytor; B1 (EN) — to samo po angielsku; B1b — szablony z danych testowych). Testy, które potrzebowały szablonów z seeda, biorą je jawnie z danych testowych (asercje bez zmian).

## Runda 82b (03.10.2026) — poprawki niezależnej weryfikacji commitu 6ea37a3

| # | Było (6ea37a3) | Jest | Jak w kodzie |
|---|---|---|---|
| MEDIUM 1 | dopisek „ciężaru X nie ma tutaj — wpisz ciężar” sprawdzał KAŻDY ciężar sesji „Poprzednio” względem listy miejsca: odpalał się (a) dla sesji w tym samym miejscu tym samym przyrządem (23 kg, gdy lista ma tylko parzyste — a użytkownik zrobił tam 23), (b) dla drop setów (niewstawianych), (c) dla 0 kg, (d) w lb przez zaokrąglenie kg | dopisek tylko, gdy: (i) są miejsca (trening ma miejsce, a blok korzysta z jego listy — LOW 5); (ii) źródło „Poprzednio” jest **gdzie indziej** — inne, znane miejsce albo znany, inny przyrząd (`prevFromOther`, kontrakt M3: wartość wstrzymana, pole puste) — **albo bez miejsca** (0.8.5 / web 0.3: wartość zostaje); to samo, znane miejsce tym samym albo nieznanym przyrządem — nigdy; (iii) wartość **konkretnej serii roboczej** źródła (ta sama, którą pokazuje „Poprzednio” dla tej serii; bez rozgrzewek i drop setów; > 0) nie jest osiągalna tutaj — porównanie wg jednostki: tolerancja `LOAD_TOL_KG` albo (w lb) ta sama liczba na ekranie (`hasLoadShown`, `wOut`; bez nowej stałej) — np. 19,97 kg (wpis w kg) to w lb „44 lb”, jak pozycja listy 44 lb (19,95 kg). Ta sama porównywarka jest w `offListAt`, więc bezpiecznik M3 i dopisek się nie rozjeżdżają | `lib/store.ts` `offListNote` (jedna reguła), `offListAt` → `hasLoadShown` (`lib/loads.ts`) |
| LOW 3 | dopisek w treningu liczony z serii sesji źródłowej, niezależnie od pól; edytor historii miał własną regułę (`prefilledOffList`: tylko wstawiona, nieruszona wartość spoza listy) | dopisek liczony z **bieżących pól**: pokazuje się, dopóki któraś seria robocza ma pole ciężaru puste albo wciąż z wartością źródła spoza listy; wpisany ciężar (dostępny albo świadomie inny) chowa go przy kolejnym renderze. Jeden helper (`offListNote`) w treningu i w edytorze historii; edytor dodatkowo patrzy tylko na pola ciężaru wciąż wypełnione przez aplikację (zapisany trening bez dodanych serii — bez dopisku) i — tak jak trening — pokazuje dopisek także przy wartości wstrzymanej (źródło z innego miejsca, pole puste; wcześniej tylko przy wartości wstawionej). Prefiks „Poprzednio: ‹miejsce›” bez zmian (tylko inne, znane miejsce — M8) | `components/ActiveWorkout.tsx` (`offListNote` z `hintFor` — od rundy 82c `srcSetAt`), `lib/edit.ts` `prefilledOffList` → `offListNote` (wspólne `prefillSrc` z `prefillFor`) |
| LOW 4 | etykieta „kg/str.” brała `e.impl` także, gdy w trakcie treningu usunięto wszystkie miejsca | **trening w toku** (i nowy trening wstecz w edytorze): bez miejsc przyrząd się nie liczy — etykiety jak bez miejsc, czyli jak w main („kg/hant.”, „kg”). **Zakończona historia** (szczegóły sesji, edycja zapisanego treningu) zostaje przy zapisanym przyrządzie: „kg/str.” prawdziwie mówi, że wpis był na stronę, także gdy miejsc już nie ma — świadomy wybór | `liveBlockImpl` (trening w toku, `app/history/edit/[id].tsx` dla nowego treningu wstecz), `blockImpl` (historia, edycja zapisanego treningu) |
| LOW 5 | po zmianie miejsca blok z odhaczonymi seriami zachowywał przyrząd (runda 82, L5), ale dopisek, „↑ spróbuj X” i wstrzymanie przy odhaczeniu brały listę NOWEGO miejsca (`loadsFor` nie patrzy na przyrząd bloku) | blok, którego przyrząd ≠ przyrząd rozstrzygnięty w bieżącym miejscu (albo tu żaden), nie korzysta z listy tego miejsca: bez dopisku, „↑” jak bez listy ciężarów (krok +1 / +2,5 kg), odhaczenie bez wstrzymywania z listy nowego miejsca (wartość z sesji tym samym przyrządem — np. 41 kg na stacji — wstawiana). Blok bez przyrządu (nieznany) — lista miejsca jak dotąd | `listLocFor(e, locationId)` w `offListNote`, `progressionFor` (ekran) i `fillFromHints` |
| LOW 8 | nieaktualne „schemat 15 … P-004” w testach; w docs „migracja/import nigdy nie zmieniają szablonów” | testy poprawione; precyzyjnie: aplikacja nie zmienia ciężarów ani treści szablonów — zostaje normalizacja jak w main (usunięcie pozycji z brakującym/usuniętym ćwiczeniem, pola liczbowe; test w `audit-r82b`) | `tests/locations-model.test.ts`, `tests/audit-r72-b.test.ts`, komentarze `lib/store.ts` `migrate`, `lib/seed.ts` |

Bez miejsc — bez zmian względem main (c713236): `listLocFor` i `liveBlockImpl` zwracają `undefined`, `offListAt` bez miejsca — `false`, etykiety i „↑” jak w main.

**Testy:** `tests/audit-r82b.test.tsx` (13: MEDIUM 1 a–d, LOW 3 — trening z ekranem, wartość wstrzymana z prefiksem, kilka serii, edytor; LOW 4 — trening i historia; LOW 5 — „↑”, dopisek, odhaczenie; LOW 8 — normalizacja szablonów). Weryfikacja 6ea37a3 MEDIUM 2 i LOW 6 — w planie testów (docs/09: F1, C1, runda 82b).

## Runda 82c (03.10.2026) — poprawki niezależnej weryfikacji commitu 82a8a16

| # | Było (82a8a16) | Jest | Jak w kodzie |
|---|---|---|---|
| LOW 1 | start z szablonu wstawia w serie za końcem źródła wartość jego OSTATNIEJ serii (`prev.sets[min(i, n−1)]`), a dopisek „ciężaru X nie ma tutaj” na ekranie treningu porównywał serię i tylko z i-tą serią „Poprzednio” (`hintFor` — za końcem źródła nic). Sesja bez miejsca 2×32, szablon 4 serie, dom max 24 → pola [32, 32, 32, 32]; po wpisaniu 24 w serie 1–2 dopisek znikał, choć serie 3–4 wciąż miały 32 | jedno mapowanie serii źródła dla wartości wstawianych i dla dopisku: i-ta seria źródła bez drop setów, a za końcem źródła — ostatnia. Ekran treningu i edytor historii dają tę samą odpowiedź na tych samych polach (dopisek zostaje, dopóki któraś seria ma 32 albo puste pole; znika po wpisaniu ciężaru we wszystkie). Kolumna „Poprzednio” bez zmian (`hintFor` — to, co zrobiono w i-tej serii) | `store.srcSetAt(sets, i, perSet)` w `startFromTemplate`, `lib/edit.ts` `prefillSrc` (blok z pozycji szablonu — i-ta/ostatnia; blok dodany w edytorze — zawsze ostatnia, `perSet` false) i `components/ActiveWorkout.tsx` (`offListNote(…, si => srcSetAt(prev?.sets, si))`) |
| LOW 2 | zmiana sprzętu miejsca treningu W TOKU (pozycja, opcja, ciężary) zostawiała blokom przyrząd, do którego miejsce już się nie rozstrzyga; `listLocFor` wyłączał wtedy dla bloku listę miejsca. Dom: hantle bez ciężarów + ViShape → RDL na stacji; po wpisaniu hantli 2–24 w trakcie blok dalej „kg/str.”, „↑ spróbuj 21 kg” (krok bez listy) | przyrządy bloków **bez odhaczonych serii** liczone od nowa przy każdej zmianie sprzętu miejsca treningu i przy usunięciu tego miejsca — ta sama reguła co zmiana miejsca w trakcie (L5): blok z odhaczonymi seriami zachowuje przyrząd, którym je zrobiono. Przykład wyżej: nieruszony blok RDL staje się blokiem hantlami — „↑ spróbuj 22 kg” z listy, kolumna „kg/hant.”; wpisane wartości zostają (A-002). Usunięte miejsce treningu: nieruszone bloki bez przyrządu (jak bez miejsca; trening nadal pokazuje „(usunięte miejsce)”). Zmiana innego miejsca niż miejsce treningu, trening bez miejsca, zero miejsc — nic | `store.locationEquipChanged(locationId)` (wspólne z `setActiveLocation`: `restampUntouched`), wołane w `lib/locations.ts` przed zapisem: `setEquip`, `setOpt`, `setLoad`, `deleteLocation` i nowe `locationEdited(l)` — edytor ciężarów (`components/LoadEditor.tsx`) zapisuje przez nie zamiast `save(loc)` |
| LOW 3 | `tests/invariants.test.ts`: licznik niezmiennika supersetów szablonów rósł przy każdym szablonie i każdym sprawdzeniu (zawsze > 0); start z szablonu z supersetem nie był gwarantowany (szablony demonstracyjne nie mają supersetów) | licznik tylko szablonów z supersetem; każdy przebieg zaczyna się stałym krokiem: połączenie dwóch pierwszych pozycji (losowo wybranego) szablonu, start z niego — w treningu w toku superset z ≥ 2 blokami — sprawdzenie niezmienników, anulowanie; test wymaga ≥ 1 takiego startu na przebieg | `supersetStart` w `tests/invariants.test.ts` |
| LOW 4 | docs/10 (runda 82, MEDIUM 2): „przyrząd z bloku (`blockImpl`) … trening w toku” | poprawione: historia sesji i edycja zapisanego treningu — `blockImpl`; trening w toku i nowy trening wstecz — od rundy 82b `liveBlockImpl` | — |
| main | `scripts/perf/app.perf.tsx`: pomiar wpisu w pole serii szukał etykiety „kg” — pierwszy blok szablonu demonstracyjnego ma „kg/hantel”, więc pomiar był po cichu pomijany | pole ciężaru pierwszego bloku z ciężarem wg etykiety z ekranu (`loadLabel` z `liveBlockImpl`); brak pola albo bloku z ciężarem — błąd testu; sprawdzenie, że wpis trafił do serii | `scripts/perf/app.perf.tsx` |

Bez miejsc — bez zmian względem main (c713236): `srcSetAt` w `startFromTemplate` i edytorze to ta sama arytmetyka co wcześniej, `offListNote` bez miejsca — `null`, `locationEquipChanged` bez miejsca treningu — nic (a bez miejsc nie ma czego edytować).

**Testy:** `tests/audit-r82c.test.tsx` (13: LOW 1 — `srcSetAt`, scenariusz 2×32 / 4 serie z kontrolą starego mapowania, ekran z wpisem w pola, edytor historii = trening, drop set w źródle, bez miejsc; LOW 2 — RDL stacja → hantle z „↑ 22 kg” i „kg/hant.” na ekranie, kontrola bez przeliczenia, blok z odhaczoną serią, edytor ciężarów na ekranie miejsca (wypełnij zakresem, odznaczenie hantli), inne miejsce / trening bez miejsca, usunięcie miejsca treningu, usunięcie ostatniego miejsca); `tests/invariants.test.ts` (LOW 3); `tests/audit-r82b.test.tsx` — `noteOf` liczy jak ekran (`srcSetAt`).

## Podsumowanie audytów rund 81–82c (przeniesione z Dysku 04.10.2026)

Skrót z dawnej kopii tego dokumentu na Dysku Google (sekcja „Aktualizacja 03.10.2026”); szczegóły poprawek — sekcje „Runda 82”, „Runda 82b”, „Runda 82c” wyżej.

| Audyt (03.10.2026) | Wynik | Poprawki |
|---|---|---|
| niezależny audyt commitów rundy 81 (f132330 / 025ee6a) | 0 wysokich / 2 średnie / 4 niskie | runda 82 |
| niezależna weryfikacja commitu rundy 82 (6ea37a3) | 0 wysokich / 2 średnie / 6 niskich | runda 82b |
| niezależna weryfikacja commitu rundy 82b (82a8a16) | 0 wysokich / 0 średnich / 4 niskie | runda 82c — niskie naprawione, temat zamknięty |

Po rundzie 82c: 875 testów. Otwarte pytanie o objętość stacji (×1 czy ×2 przy ćwiczeniach na dwie linki — sekcja „Runda 82”) ma numer **Q-024**.

## Źródła (wybór)
- Freeletics Spaces: https://www.freeletics.com/en/blog/posts/freeletics-spaces-feature/ · https://forum.freeletics.com/t/new-feature-spaces-%E2%80%93-train-anywhere-smarter-%F0%9F%92%AA/22310 · https://help.freeletics.com/hc/en-us/articles/115005747425-Adjust-your-Bodyweight-Journey-preferences · https://forum.freeletics.com/t/need-help-how-to-set-up-adjustable-dumbbellskettlebellsbarbell-in-the-freeletics-app/23488
- Fitbod: https://help.fitbod.me/hc/en-us/articles/34336407191191-My-Plan · https://help.fitbod.me/hc/en-us/articles/360007700013-Plate-Calculator · https://help.fitbod.me/hc/en-us/articles/42333470514455-Why-did-my-workout-change-Understanding-workout-refreshes
- Alpha Progression: https://alphaprogression.com/en/blog/alpha-progression-guide
- Liftosaur: https://www.liftosaur.com/features/equipment-and-gyms · https://raw.githubusercontent.com/astashov/liftosaur/master/src/models/weight.ts
- SmartGym: https://help.smartgymapp.com/article/136-different-equipment-lists
- Hevy: https://help.hevyapp.com/hc/en-us/articles/43572343844247-How-Hevy-Trainer-Settings-Work · https://help.hevyapp.com/hc/en-us/articles/43651329105687-Tracking-Progress-on-Gym-Machines-And-Why-It-Can-Be-Inconsistent
- StrengthLog: https://help.strengthlog.com/help-article/plate-calculator/
- Taksonomie: https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/schema.json · https://wger.de/api/v2/equipment/?format=json · https://fitbod.me/exercises/sitemap.xml
- Ciężary: https://www.sport-shop.pl/hantla-regulowana-2-5-24kg-gymtek-czerwona-p-170823.html · https://hop-sport.pl/hantle/zestaw-hantli-zeliwnych-2x10kg-z-przeduzanym-gryfem/5902308215542 · https://iwf.sport/weightlifting_/equipment/ · https://www.bowflex.com/product/552-results-series-adjustable-dumbbells/ZMK4011008.html
- Polskie nazwy: https://hop-sport.pl/gryfy · https://trainingshowroom.com/636-lawki-treningowe · https://www.e-insportline.pl/wyciagi-do-cwiczen · https://hms-fitness.pl/oferta/sprzet-silowy/atlasy-bramy-i-suwnice-smitha
- Progresja i zamienniki: https://peerj.com/articles/14142/ (Plotkin 2022) · https://www.strongerbyscience.com/progressive-overload-strategies/ · https://tourniquets.org/wp-content/uploads/PDFs/ACSM-Progression-models-in-resistance-training-for-healthy-adults-2009.pdf · https://link.springer.com/article/10.1007/s40279-023-01937-7 (Nuzzo 2023) · https://www.researchgate.net/publication/49746305 (Saeterbakken 2011) · https://www.nsca.com/contentassets/3d09f06f0b4c4f6fbd8cc382ed1f3d4a/ptq-10.2.1-progressive-strategies-for-teaching-fundamental-resistance-training-movement-patterns.pdf · https://link.springer.com/article/10.1007/s40279-021-01559-x (Halperin 2022, RIR)
