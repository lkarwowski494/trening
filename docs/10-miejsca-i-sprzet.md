# Miejsca treningu i sprzęt (P-003) — research i projekt wdrożenia

Wersja robocza 02.10.2026. Status: **E1 wdrożone na gałęzi `feature/locations`** (niezmergowane, bez buildu) — szczegóły, przyjęte decyzje i odstępstwa w sekcji „Implementacja E1” na końcu. Zgłoszenie: P-003 (02.10, test na iPhonie), wraca T-044 / D-011 (odłożone 01.10).
Dane źródłowe: `docs/research/equipment/catalog.json` (katalog 125 ćwiczeń), `docs/research/kb/*.json` (baza wiedzy funkcji 10 aplikacji). Pełne raporty z researchu: sekcja „Źródła” na końcu.

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
- **Ćwiczenie** ma `requires`: lista grup — każda grupa musi być spełniona, w grupie wystarczy jedna możliwość (np. wyciskanie sztangi na ławce: `(barbell) + (bench.flat) + (rack lub bench.uprights)`; podciąganie: `(pullup.bar)`; hip thrust z hantlem: `(db) + (bench.flat lub box)`). Do tego `recommended` (np. asekuracja przy wyciskaniu — tylko ostrzeżenie, nie blokuje).
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
- **Para czy jeden hantel:** sam `loadMode` tego nie rozstrzyga. One Arm Row, Concentration Curl i Triceps Kickback mają `per_dumbbell`, a używa się jednego hantla. Do katalogu trzeba dodać `implements: 1 | 2`, które mówi, z której listy brać ciężary: pary (talerze dzielone na 4) czy pojedynczego (na 2). Przy trybie `total` lista pary ×2. Przy okazji wyszło, że w szablonie domowym Deadlift (hantle) i RDL mają 48 kg, a pozostałe hantle najwyżej 24, czyli prawdopodobnie suma wpisana pod `per_dumbbell` — do wyjaśnienia z użytkownikiem.
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
- **Ciężary:** zakres na stronę + krok + jednostka urządzenia. Seria zapisuje, ile linek pracowało (1 albo 2), a suma = liczba linek × ciężar na stronę. Dodatkowe ustawienie: urządzenie pokazuje „na stronę” albo „łącznie” — żeby wpisywać tę liczbę, którą widać na ekranie.
- **Presety:**
  - ViShape Pro: 1,5–65 kg na stronę, krok 0,5 kg. Wg FAQ producenta; starsze opisy podają 60 kg.
  - ViShape Lite: 1,5–35 kg na stronę, krok 0,5 kg.
  - Speediance: ok. 2–50 kg na stronę, krok 0,5 kg / 1 lb.
  - Pozostałe urządzenia oznaczone jako niezweryfikowane.
- **Tryby** (ekscentryczny, łańcuchy, izokinetyczny, elastyczny) nie zmieniają tego, jakie ćwiczenia da się zrobić. Najwyżej jako opcjonalny znacznik serii — nie w E1.
- **Uwaga do porównań:** ciężar z linek nie równa się ciężarowi wolnemu (w teście ViShape zmierzony opór statyczny był ok. 10% niższy od ustawionego). Rekordy są i tak per ćwiczenie, więc się nie mieszają.
- **Niepewne:**
  - czy aplikacja ViShape Pro pokazuje ciężar na stronę, czy łącznie (test fitnessowy.net sugeruje sumę: „100 kg” przy limicie 60 na stronę);
  - czy 45 kg startowe w „Przysiad z pasem (linki)” to suma, czy na stronę. Do sprawdzenia z użytkownikiem — bez pytań do odwołania.

Źródła: https://vishape.pl/faq · https://vishape.pl/smartgym-pro · https://vishape.pl/smartgym-lite · https://vishape.pl/akcesoria · https://fitnessowy.net/smartgym-pro-test/ · https://www.speediance.com/products/speediance-gym-monster-2 · https://tonal.com/products/tonal-2 · https://www.garagegymreviews.com/vitruvian-trainer-review · https://www.beyond-power.com/products/voltra

## 4. Wpływ na trening

1. **Start treningu:** pod nazwą szablonu „📍 Siłownia ▾” — domyślnie miejsce szablonu albo główne; zmiana jednym stuknięciem, tylko dla tej sesji.
2. **Wybór ćwiczenia:** domyślnie „Dostępne w: Dom” (filtr), przełącznik „pokaż wszystkie” zapamiętywany; niedostępne pokazane wyszarzone z dopiskiem „brak: ławka skośna”.
3. **Ćwiczenie z szablonu niedostępne w tym miejscu:** plakietka „brak sprzętu w: Dom” + „Zamień” (etap 2). **Nigdy** automatyczna zamiana.
4. **Podpowiedź progresji „↑ spróbuj X”:** X = **najbliższy większy dostępny** ciężar (nie „+1 kg”, którego nie masz). Co przy dużym skoku — decyzja 7, dwa warianty:
   - **(a) bez bramki** — jak dziś, tylko z prawdziwym ciężarem: górna granica na wszystkich seriach → „↑ spróbuj X”.
   - **(b) prosta bramka procentowa** (*rekomendacja*): jeśli skok do X ≤ 10% (górna granica ACSM 2009: 2–10%) → jak (a); jeśli > 10% → najpierw „ten sam ciężar, celuj w górną granicę + 2”, a dopiero po jej zrobieniu na wszystkich seriach „↑ spróbuj X”. Twardy limit +2, żeby nie gonić 20–40 powtórzeń.
   - Odrzucony wariant: „bramka Epleya” z raportu (`R ≥ ceil(30·((W′/W)·(1+rMin/30) − 1))`). Przegląd wykazał, że stosuje wzór Epleya powyżej 10 powtórzeń, a nasz e1RM sam go tam nie używa (`E1RM_MAX_REPS = 10`, Mayhew 2008). Przy lekkich hantlach daje absurdalne cele: 4→5 kg przy zakresie 15–15 = 27 powt., 4→6 kg = 38, 8→9 kg przy 10–12 = 15. Przy sztandze 60→62,5 daje 10, więc niczego nie zmienia (raport podał tu 13 — błąd rachunkowy).
   - Doprecyzowanie, niezależnie od wariantu: R = **najmniejsza** liczba powtórzeń wśród serii roboczych; brak górnej granicy powtórzeń w szablonie = brak podpowiedzi (jak dziś); ciężar poprzedni spoza listy (np. 32 kg z siłowni, w domu max 24) → brak „↑”, a w polu zostaje wartość z poprzedniego treningu tylko wtedy, gdy była w tym samym miejscu (pkt 4.7).
   - Podstawa: progresja powtórzeniami ≈ progresja ciężarem dla hipertrofii (Plotkin 2022, Chaves 2024); SBS: „dodaj powtórzenie lub serię, potem ciężar”. Sam próg 10% i limit +2 to **nasza propozycja**, niezweryfikowana bezpośrednio żadnym badaniem.
5. **Zaokrąglanie:** tylko w podpowiedziach i szacunkach, **w dół** do dostępnego (niedociążenie poprawisz powtórzeniami, przeciążenie kosztuje nieudaną serię). Wpisane wartości nigdy nie są zmieniane (A-002).
6. **Historia i rekordy:** osobno per ćwiczenie, **bez przeliczania** między wariantami (sztanga ↔ hantle: badania dają 72–83%, rozrzut za duży — Saeterbakken 2011, Smoak 2023; tabele %1RM różnią się między ćwiczeniami — Nuzzo 2023). Po zamianie: podpowiedzi z historii zamiennika + jedna linijka „sztanga ostatnio: 3×8 @ 80 kg” dla kontekstu.
7. **„Poprzednio”, wstępne wartości i miejsce:** dziś „Poprzednio” i wypełnienie przy starcie biorą ostatni trening ćwiczenia, gdziekolwiek był. Z miejscami trening domowy dostałby 32 kg z siłowni, czyli ciężar, którego w domu nie ma. Propozycja (decyzja 8): (a) najpierw ostatni trening **w tym samym miejscu**, a gdy go brak — ostatni w ogóle, z dopiskiem „(siłownia)” — *rekomendacja*; (b) zawsze ostatni w ogóle, jak dziś. Hevy i Alpha dają ten wybór w ustawieniach.

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

1. **Gdzie wybiera się miejsce:** (a) miejsce główne + domyślne miejsce szablonu + zmiana na starcie treningu — *rekomendacja*; (b) jedno globalne „aktywne miejsce” (Alpha/Liftosaur) — prostsze, ale łatwo zapomnieć przełączyć.
2. **Szablony a miejsca:** (a) jeden szablon + zamienniki per miejsce (E2) — *rekomendacja*, bez dublowania; (b) osobne szablony „Legs — dom / siłownia” (dzisiejszy stan) — proste, ale edycje trzeba robić dwa razy.
3. **Filtr w wyborze ćwiczenia:** (a) domyślnie tylko dostępne + „pokaż wszystkie” — *rekomendacja*; (b) wszystkie, dostępne na górze.
4. **Ćwiczenia z hantlami często robione bez obciążenia** — Walking Lunges, Reverse Lunge, Step Up, Russian Twist (Lunges (hantle) zawsze wymaga hantli): (a) nie wymagają hantli, hantle zalecane — *rekomendacja katalogu*; gdy w miejscu nie ma hantli, podpowiedź idzie w powtórzenia, nie w kilogramy; (b) wymagają hantli.
5. **Duplikaty w bibliotece:** Seated Cable Row ≡ Wiosłowanie na linkach (siedząc); Rear Delt Raise (hantle) ≈ Reverse Fly (hantle) — połączyć (z migracją historii) czy zostawić?
6. **Gumy (P-001):** zostają globalne czy stają się sprzętem miejsca? *Rekomendacja:* globalne na razie (gumy się nosi); w miejscu tylko „mam gumy: tak/nie”, dziś żadne ćwiczenie ich nie wymaga.
7. **Podpowiedź przy dużym skoku ciężaru** (pkt 4.4): (b) prosta bramka 10% z limitem +2 powtórzeń — *rekomendacja*; (a) bez bramki.
8. **Źródło „Poprzednio” i wstępnych wartości** (pkt 4.7): (a) najpierw to samo miejsce — *rekomendacja*; (b) zawsze ostatni trening.
9. **Twój dom — odpowiedzi użytkownika (02.10, 21:43):**
   - „Przysiad z pasem (linki)” robi na **ViShape** (model nieustalony; SmartGym Pro: elektryczny opór na dwóch niezależnych linkach od dołu, 1,5–60 kg na stronę, w zestawie ławka regulowana, drążek do linek, uchwyty, opaski na kostki i pas biodrowy; nie da się na nim ciągnąć z góry — źródło: test fitnessowy.net). Wniosek do projektu: potrzebna pozycja sprzętu **„stacja z linkami / opór elektryczny (np. ViShape)”**, która daje `cable.low`, `cable.dual` i pas, a ławkę regulowaną jako osobną pozycję. Ciężary to zakres na stronę; krok regulacji **nieustalony** (do sprawdzenia na urządzeniu). To tylko pozycja sprzętu, nie integracja z ViShape, więc decyzja z 28.09 („funkcje ViShape poza zakresem”) zostaje w mocy.
   - 48 kg w Deadlift (hantle) i RDL to **suma dwóch hantli** → zgłoszenie P-004: przy dzisiejszym trybie „na hantel” objętość tych ćwiczeń liczy się podwójnie.
   - Hantle: 2 × **TREXO TXO-B4W002 24 kg** (regulowane pokrętłem, gryf 3 kg, 8 talerzy, waga ok. 3–24 kg według sklepów). **Dokładne kroki regulacji nieustalone** — sklepy ich nie podają; do odczytania z pokrętła (lekcja 11: nie zgadujemy). Ten model wchodzi jako preset „hantle z szybką regulacją”.

### Sprawy do rozstrzygnięcia przy wdrożeniu (z przeglądu)
- Usunięcie miejsca: szablony i treningi zachowują `locationId` jako „(usunięte miejsce)”, a miejsca głównego nie da się usunąć, dopóki nie wskaże się innego (jak Freeletics).
- Maszyny w różnych siłowniach: ten sam „Leg Press” w dwóch siłowniach ma inne ciężary (Hevy radzi osobne ćwiczenie dla każdej siłowni). Propozycja: historia i rekordy dalej per ćwiczenie, a z decyzją 8 „Poprzednio” bierze to samo miejsce.
- Dociążenie (±kg) ćwiczeń z masą ciała: czy podpowiedź ma brać ciężary z talerzy/hantli miejsca? Propozycja: na razie bez zmian.
- Zamiana ćwiczenia w supersecie (E2): zachować `groupId` i `tplItemId`, żeby nie rozbić rundy i „Poprzednio”.
- Kopia ze schematem 14 nie wczyta się w starszej wersji aplikacji (jak przy każdej zmianie schematu).
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
- **B. `lib/loads.ts`** — lista ciężarów z przełącznikiem przy każdym, „zakres + krok” jako skrót edytora zapisywany do listy (odznaczone zostają odznaczone), uchwyt/gryf + talerze (ograniczona suma podzbiorów; para hantli = 4 sztuki na krok, jeden hantel / sztanga = 2), stacja elektryczna (zakres na stronę + krok; ×1/×2 linki), kg/lb przez to samo przyciąganie co wpis w polu (`snapLb`), tolerancja 0,01 kg. Testy: Hop-Sport para (8 ciężarów), jeden hantel (21 do 18,5), sztanga 20 + para talerzy (co 2,5 do 177,5), ViShape Pro (128 ustawień), fast-check (zgodność z pełnym przeliczeniem, sortowanie, „najbliższy większy ∈ dostępne”).
- **C. Model danych, schemat 14** — `Settings.locations[]`, `mainLocationId`, `pickerShowAll`; `Workout.locationId?`, `Template.locationId?`; ćwiczenie: `requires`, `recommended`, `pattern`, `loadSource`, `implements` (zapisane w ćwiczeniu). Migracja: ćwiczenia z flagą `lib` dostają dane z katalogu po nazwie kanonicznej; własne — `requires: []` (zawsze dostępne) i `loadSource` ze zgrubnego sprzętu (także po zmianie sprzętu w edycji). Biała lista Ustawień w `migrate()` rozszerzona (sprzęt i opcje tylko znane, ciężary sanityzowane, miejsce główne zawsze istnieje, gdy są miejsca). Testy: idempotencja (fast-check), eksport → import, restart, stary backup web 0.3.
- **D. Ekrany** — Ustawienia → „Miejsca treningu” (`app/more/locations.tsx`): lista (★ główne), „+ Dodaj miejsce” z presetami. Miejsce (`app/more/location/[id].tsx`): nazwa, „Ustaw jako główne”, licznik „Dostępne ćwiczenia: N z M”, sprzęt w grupach (przełączniki iOS), opcje pod pozycją, edytor ciężarów (`components/LoadEditor.tsx`: lista z odznaczaniem + „wypełnij zakresem” + „dodaj ciężar”; uchwyt/gryf + talerze w sztukach; min/max na stronę + krok; jednostka sprzętu kg/lb; presety modeli tylko ze źródeł: Gymtek 2,5–24, Hop-Sport 2×10, ViShape Pro i Lite), „Duplikuj”, „Usuń”. Zapis przy każdej zmianie.
- **E. Trening** — „📍 Dom ▾” pod nazwą treningu (tylko gdy są miejsca; zmiana tylko dla tej sesji, nic nie jest przepisywane); szablon: „Miejsce domyślne” (chipy); start: miejsce szablonu, inaczej główne; „Powtórz ostatni” — miejsce tamtego treningu. Wybór ćwiczenia: domyślnie tylko dostępne w miejscu treningu (albo w miejscu domyślnym edytowanego szablonu), zapamiętany przełącznik „Pokaż wszystkie”, niedostępne wyszarzone z „brak: sztanga, klatka / stojaki”; dokładna nazwa z wyszukiwania pokazuje się mimo filtra. Blok ćwiczenia: plakietka „brak sprzętu w: Dom (…)”, nigdy automatyczna zamiana.
- **F. Podpowiedzi** — „↑” = najbliższy większy **dostępny** ciężar; przy skoku > 10% najpierw „↑ ten sam ciężar, spróbuj {górna granica + 2} pow.”, po zrobieniu tego na wszystkich seriach — „↑ spróbuj X”; ciężar ≥ największy dostępny → brak „↑”; przyrząd bez wpisanych ciężarów → podpowiedź jak dotąd; brak przyrządu z ciężarem (np. wykroki w miejscu bez hantli) → podpowiedź w powtórzeniach. Masa ciała z dociążeniem — bez zmian. Wpisane wartości nigdy nie są zmieniane. „Poprzednio” i wstępne wartości: najpierw ostatni trening **w tym samym miejscu**, gdy go brak — ostatni gdziekolwiek, z dopiskiem „Poprzednio: Siłownia”.
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
| 7b | bramka 10% z limitem +2 | `PROGRESSION_GATE = 0.10` w `progressionFor` |
| 8a | „Poprzednio” z tego samego miejsca, potem gdziekolwiek | `previousBlockFor(…, locationId)`, w edytorze historii `previousBlockBefore(…, locationId)`; tylko gdy są miejsca |
| 3.4 | stacja elektryczna jako jedna pozycja | `electric` z opcjami |

### Dom użytkownika (test `tests/locations-catalog.test.ts`)
Ławka regulowana, drążek, poręcze, hantle z listą (TREXO), ViShape SmartGym Pro (1,5–65 kg/str., krok 0,5; dwie linki od dołu, pas, opaski; bez wysokiego wyciągu). Dostępnych **70 ze 125**, m.in. Bench Press (hantle) ✓, Pull Up ✓, Chest Dip ✓, Przysiad z pasem (linki) ✓ (stacja: wyciąg dolny + pas), cały szablon „Legs — dom” ✓; niedostępne m.in. Back Squat (sztanga, stojaki), Lat Pulldown / Face Pull / Triceps Pushdown (brak wysokiego wyciągu — po zaznaczeniu opcji „ramiona” byłyby dostępne), maszyny, cardio. Pełną listę warto przejrzeć z użytkownikiem (ekran miejsca pokazuje licznik, picker — „brak: …”).

### Odstępstwa i doprecyzowania
- **Testy schematu:** dwa istniejące testy miały wpisany literał `schemaVersion === 13` (audit-r72-b B7/B8, regress R55-01) — zmieniony na 14. Poza tym żaden dotychczasowy test nie był zmieniany.
- **`implements`** dopisane do `catalog.json` (9 × jeden, 29 × para); Łydki na stopniu = para (niepewne, bez znaczenia przy hantlach z listą).
- **Usuwanie:** miejsca głównego nie da się usunąć, dopóki jest inne; **jedyne** miejsce można usunąć — aplikacja wraca wtedy do trybu bez miejsc (inaczej nie dałoby się z niego wyjść).
- **Stacja elektryczna:** seria nie zapisuje (jeszcze) liczby linek. Ćwiczenia wymagające dwóch linek (`cable.dual`) — 2 × na stronę; przysiad z pasem (wymaga pasa) — jedna albo obie linki (×1 i ×2); pozostałe, w tym jednorącz, — tylko na stronę (po audycie: wartość ponad zakres jednej linki nie jest podpowiadana jako „dwie linki”). Ustawienie „urządzenie pokazuje na stronę / łącznie” — nie w E1.
- **Talerze** są opisane osobno przy każdej pozycji (sztanga, EZ, trap bar, hantle na talerze) — bez wspólnej puli talerzy miejsca (do rozważenia z kalkulatorem talerzy, E3).
- **Presety:** „Pełna siłownia” = cały sprzęt (125/125), sztanga/EZ/trap bar z talerzami 25…1,25 (po 8 szt.), hantle 2,5–50 co 2,5; **stosy maszyn, wyciągów i kettle — puste** (wartości z researchu niezweryfikowane; podpowiedź działa wtedy jak dotąd). „Hotel”: hantle 2,5–25 co 2,5, ławka regulowana, mata, bieżnia, rower — do potwierdzenia.
- **TREXO TXO-B4W002:** brak presetu modelu (kroki nieznane). Użytkownik wpisuje listę sam (np. „wypełnij zakresem” i odznaczenie brakujących).
- **Picker w edycji szablonu** filtruje tylko po jawnie ustawionym miejscu szablonu (szablon bez miejsca — bez filtra).
- **Wymagania ćwiczenia** są zapisane w ćwiczeniu, ale ekran edycji ćwiczenia ich jeszcze nie pokazuje ani nie edytuje.
- **Edycja historii i trening wstecz (docs/12, integracja 0.9.0):** edycja zachowuje miejsce treningu (po zapisie „Poprzednio” tego miejsca liczy się od nowa); trening wstecz dostaje miejsce jak start treningu (decyzja 1a: miejsce szablonu, inaczej główne; tylko gdy są miejsca) — w edytorze „📍 Dom” tylko do odczytu; wybór ćwiczenia w edytorze filtruje po miejscu szkicu, gdy je ma. Wartości wstawiane w edytorze historii stosują decyzję 8a: `previousBlockBefore(…, locationId)` skanuje `histOf(exId, loc)` z filtrem daty, a gdy w tym miejscu przed datą nie było ćwiczenia — całą historię sprzed daty (fallback jak w `previousBlockFor`). Ciężar z sesji w innym, znanym miejscu spoza listy dostępnych w miejscu szkicu (`offListAt`) nie jest wstawiany — puste zostają ciężar i powtórzenia razem. `repeatLast`, gdy najnowszy trening nie ma miejsca (sprzed miejsc, import), a miejsca są: „nieznane miejsce” — start w miejscu głównym, wartości bez wstrzymywania (jak treningi sprzed miejsc w starcie z szablonu i przy odhaczaniu). Bez miejsc — wszystko jak przed integracją.

### Co zostaje
- **E2:** „Zamień ćwiczenie” (ranking zamienników), zamienniki per miejsce w szablonie (`TemplateItem.alternates`), edycja wymagań w edycji ćwiczenia, liczba linek w serii, miejsce w historii (lista, filtr).
- **E3:** kalkulator talerzy i rozgrzewki z talerzy miejsca (wspólna pula talerzy).
- **Do ustalenia z użytkownikiem:** kroki regulacji TREXO (odczyt z pokrętła); czy ViShape pokazuje ciężar na stronę czy łącznie i czy 45 kg w „Przysiad z pasem (linki)” to suma; P-004 (Deadlift/RDL z hantlami wpisywane jako suma przy trybie „na hantel” — objętość ×2); wartości presetów (Hotel, stosy maszyn); przegląd listy 70 ćwiczeń dostępnych w domu.
- **Ryzyka:** kopia ze schematem 14 nie wczyta się w starszej wersji aplikacji; ekran miejsca ma ~50 przełączników i edytory ciężarów — do sprawdzenia na iPhonie (przewijanie, klawiatura nad polami „od/do/co”).

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
- **P-004 a podpowiedź w domu:** Deadlift (hantle) i RDL mają w szablonie 48 kg (suma pary) przy trybie „na hantel”, a lista hantli domu kończy się na 24 kg. 48 > największy dostępny → w domu brak „↑” dla tych ćwiczeń, dopóki P-004 nie zostanie rozstrzygnięte (tryb „łącznie” albo wpis na hantel).
- **Cable Fly na linkach od podłogi:** katalog wymaga tylko dwóch linek (`cable.dual`), więc na ViShape (linki od dołu) Cable Fly jest „dostępne” — w praktyce jako rozpiętki od dołu. Dokładniej dopiero po rozbiciu wysokości linek w wymaganiu (E2).
- **Jedna linka powyżej 65 kg:** ćwiczenia jednorącz nie dostają już wartości 2 × na stronę; ćwiczenia „łącznie” bez wymogu dwóch linek (poza przysiadem z pasem) — tylko wartości jednej linki.
- **Hantle co 2,5 kg i bramka 10%:** przy lekkich hantlach skok 2,5 kg to > 10% (10 → 12,5 kg = 25%), więc większość pracy hantlami w domu najpierw dostaje „ten sam ciężar, górna granica + 2”, a dopiero potem „↑ ciężar”. Tak działa decyzja 7b; od 25 kg skok 2,5 kg mieści się w 10%.

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
