# Miejsca treningu i sprzęt (P-003) — research i projekt wdrożenia

Wersja robocza 02.10.2026. Status: **projekt do decyzji** (nic nie jest jeszcze w kodzie). Zgłoszenie: P-003 (02.10, test na iPhonie), wraca T-044 / D-011 (odłożone 01.10).
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
