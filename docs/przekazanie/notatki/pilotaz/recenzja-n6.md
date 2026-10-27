# Recenzja kontrolna ruchu nr 6: pilotaż agent-pozy, przebieg n6 (bramka 4), 27.10.2026

Recenzent niezależny. Uzasadnień generatora nie czytałem: komentarzy w `scripts/figures/agent-pozy/*.mjs`, opisów commitów rundy 5 ani sekcji o rundzie 5 w `docs/przekazanie/README.md`.
Oglądałem PNG z `podglady-n6/` w pełnej rozdzielczości. Kadry przycinałem do treści i dzieliłem na części, a wątpliwe miejsca powiększałem 2–3× (`scratchpad/rec6/crop/`, `scratchpad/rec6/zoom/`).
Każde podejrzenie z obrazu sprawdziłem liczbami: tabelą kątów (`katy-stawow.md`) i przeliczeniem póz silnikiem v2 we własnym, czystym worktree na `origin/jakosc-r2` @ f1e9e314. Użyłem do tego własnych skryptów w `scratchpad/rec6/`:

- `miary` — stawy, kąty, sprzęt i najniższy kształt w klatce;
- `ksztalty` — dolna krawędź kształtów w obu rzutach i wszystkich rzędach;
- `styk` — najniższy punkt ciała w funkcji u;
- `krawedz` i `skan5` — zapas od progów;
- `roznice` — co zmieniło się od n5 (6079d6e);
- `reguly` — pojedyncze reguły walidatora.

Wynik walidatora (`v2-validate.mjs`, pliki póz obu rodzin): **pushup_plank 17/17 OK, core_floor 21/21 OK (w tym 12 z zestawu n6), kod wyjścia 0**.

W n6 zmieniło się 13 z 29 póz: Decline, Single-Arm, Mountain Climbers, trzy rollouty, Suspended Fallout, Bird Dog, Reverse Crunch, Tuck Crunch, Cocoons, Leg Pull-In i Heel Touchers.

## Krok 6: ważność podglądu

Podgląd jest **ważny**. Oba katalogi mają `PODGLAD-WAZNY.txt`, a `PODGLAD-NIEWAZNY.txt` nie ma. `zgodnosc_manifestu` = `[]` w obu manifestach.
Każde z 17 + 12 ćwiczeń ma obraz, `klatki_u` i `katy_stawow`. `klatki_na_obrazie` = `klatki_u`, a obrazy mają po jednej komórce na klatkę w każdym rzucie i rzędzie. Wyjątki opisu (`ro.back`, `cobra.mis`) mają jawny powód.
Animacja jest wahadłowa (`anim.ts`: 0 → 1 → 0, łagodzenie cosinusowe, pauzy 0,5 s na końcach). Dlatego pompka narysowana „tylko w dół” to pełne powtórzenie.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 17 | Push Up, Push-Up Wide, Close-Grip, Diamond, Plank, Plank Shoulder Taps, Suspended Push-Up, Suspended Fallout, Standing Barbell Rollout, Crunch HO, Dead Bug, Hollow Hold, Lying Leg Raise, Reverse Crunch, Superman, V-Up, Alternate Heel Touchers |
| OK z uwagą | 10 | Mountain Climbers, Single-Arm Push-Up, Rollout (sztanga), Barbell Rollout from Bench, Incline Push Up, Incline CG, Plyo Push-Up, Bird Dog, Tuck Crunch, Leg Pull-In |
| **BŁĄD** | **2** | **Cocoons, Decline Push Up** |

**Szczelność reguł automatycznych: 0 z 2 błędów, czyli 0%** (cel ≥ 90%; w n4 i n5 też 0%). Obie pozy z błędem przechodzą walidator `origin/jakosc-r2` @ f1e9e314.

Wszystkie 5 błędów z n5 jest naprawionych w swojej klasie:

| Ćwiczenie | Błąd n5 | Stan w n6 |
|---|---|---|
| Mountain Climbers | kolana po przeciwnej stronie osi | z kolana ±11,3…13,1, ten sam znak co biodro |
| Suspended Fallout | taśma się wydłużała | taśma 155,0 cm w u = 0 i 155,1 cm w u = 1 |
| Barbell Rollout from Bench | kolana nad blatem | oś kolana 10,0 cm nad blatem, ten sam układ klęku co rollout z podłogi |
| Tuck Crunch | sztywny tułów | kręgosłup 0 → 40° |
| Alternate Heel Touchers | kształt pod podłogą | −1,9 cm (w n5 −6,4) |

Leg Pull-In i Bird Dog mają też poprawione uwagi z n5.

Obok dwóch poprawek wyrósł jednak **nowy błąd innej klasy**:

- **Cocoons:** wymóg „miednica unosi się ≥ 3 cm” (R14b) spełniono, unosząc całe ciało. Postać lewituje do 6,7 cm nad podłogą.
- **Decline:** kąt przedramienia (R6, 54,5° → 50,5°) poprawiono, obniżając skrzynię pod stopami z 14 do 10 cm. Ćwiczenie traci cechę rozpoznawczą.

Mniejsza skala, ten sam wzorzec:

- **Bench:** kolano zeszło do 10,0 cm, czyli pod próg 11 cm nowej reguły R13. Tempo ruchu się nie zmieniło.
- **Mountain Climbers:** kolano 11,5 cm przy progu 11 cm.

## Znaleziska — BŁĄD (od najpoważniejszego)

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Cocoons** | u = 0,25 → 1, całe ciało (rzut z boku) | **Ciało lewituje nad podłogą.** Środek miednicy unosi się z y = 9,5 (leżenie) do 17,5 cm, a tułów sztywno pochyla się do 28° nad poziomem (zgięcie kręgosłupa 0 → 40°). Najniższy narysowany punkt ciała (kształt tułowia) leży kolejno 0,2 / 1,3 / 2,8 / 4,3 / 5,5 / 6,4 / **6,7 cm** nad podłogą (u = 0,25 … 1). Na powiększeniu klatek u = 0,75–1 (`rec6/zoom/Cocoons-1-0-800.png`) między pośladkami a linią podłogi jest wyraźna przerwa, więc postać wisi w powietrzu. W pozostałych 11 pozach leżących ciało dotyka podłogi w każdej klatce (najniższy punkt od −2,9 do −0,3 cm). Kolana i ręce spotykają się nad tułowiem poprawnie (cecha z katalogu: „arms and knees meet over the torso”). | Ciało balansuje na kości krzyżowej i pośladkach: najniższy punkt ≤ 0 cm w każdej klatce. Uniesienie miednicy (R14b) przez jej zwinięcie (tył miednicy zostaje na podłodze, unosi się przód i lędźwie), nie przez przesunięcie całego ciała w górę. | 95% | realny (każde wyświetlenie) | nie. Reguła `nic_nie_wisi` istnieje i złapałaby błąd (1,3 cm > 1 cm już w u = 0,25), ale działa tylko przy cesze „leżenie” (reguła sensu `miednica_na_podlodze`). Cocoons tej reguły nie ma, więc `cechyRuchu` = ∅. `wyjatek_wymaga_mechanizmu` przechodzi: wymaga „miednica unosi się ≥ 3 cm” (jest 8 cm) i nie sprawdza, czy coś zostaje na podłodze |
| 2 | **Decline Push Up** | wszystkie klatki, sprzęt pod stopami | **Stopy na 10-centymetrowym klocku, więc pompka nie wygląda na „decline”.** W tej rundzie skrzynię obniżono z `top: 14` do `top: 10`. Kostki y = 30,3 przy 20,3 w Push Up. W górze ciało wznosi się ku głowie o 15,5° (Push Up 20,1°), czyli różni się od zwykłej pompki o 4,6°. W dole jest −4,5° (Push Up −0,1°). Dane aplikacji opisują ćwiczenie jako „Feet on a bench or box (elevated-surface shape)”, a ławka w tym samym modelu ma blat 42 cm (Barbell Rollout from Bench). Zmiana idzie w parze z kątem przedramienia w dole: 54,5° w n5 → 50,5° w n6 (R6: ≤ 55°). Niższe stopy poprawiają mierzoną liczbę i osłabiają cechę rozpoznawczą. | Stopy na ławce albo skrzyni (rząd 30–45 cm). W górze ciało prawie poziome albo opadające ku głowie, w dole barki wyraźnie niżej niż stopy. Przedramię w dole ustawić przez położenie dłoni względem barku, nie przez wysokość podparcia stóp. | 70% (zakres wysokości z wiedzy ogólnej, do potwierdzenia przez badacza; kierunek „bench or box” z danych aplikacji) | realny | nie: żadna reguła nie wiąże ćwiczenia „Decline” z minimalnym uniesieniem stóp względem dłoni. `sprzet_rozpoznawczy` sprawdza tylko obecność skrzyni, nie jej wysokość |

## OK z uwagą (backlog, nie blokuje)

- **Mountain Climbers:** kolana są po swojej stronie (błąd n5 naprawiony). Dwie wartości leżą jednak tuż nad progami: najniższe kolano 11,5 cm przy progu 11 (R5), a rozpiętość wysokości miednicy 4,8 cm przy 5 (`miednica_stala_wysokosc`).
  W u = 0,125–0,875 palce obu stóp są 2,5–6,8 cm nad podłogą, a w u = 0,5 obie nogi stoją w identycznym położeniu (kolano 111°). Wskazówka `mc.move` mówi „zmieniaj nogi jednocześnie”, czyli przeskok, więc chwila lotu jest spójna z opisem. Obraz środka ruchu czyta się jednak jak „przysiad podparty w powietrzu”.
- **Barbell Rollout from Bench:** klęk na blacie naprawiony (oś kolana 10,0 cm nad blatem, palce na blacie y = 42,3, ten sam układ co rollout z podłogi). Uwagi zostają dwie:
  - Ruch kończy się w u ≈ 0,4: od u = 0,4 do 1 chwyt przesuwa się tylko o 8,7 cm (wcześniej 71 cm), więc większość fazy to „pełzanie”. Bez zmian od n5.
  - Łokieć 14,9° przy progu 15° (`proste_rece_rollout`).
- **Rollout (sztanga):** ten sam rozkład tempa (chwyt +51 cm do u = 0,3, potem +11 cm do u = 1). Widoczność błędu 4,1 cm przy progu 4 cm (także w Bench i Standing).
- **Single-Arm Push-Up:** ręka pracująca jest prosta w u = 0 (łokieć 10,8°, uwaga z n5 zamknięta). Dłoń stoi w z = 4, pod osią ciała, a nie pod barkiem (z = 19). Przy stopach w z = 19 / −11 dopiero to mieści środek ciężkości w trójkącie podparcia, więc to spójne z wymaganiem równowagi.
  W dole (u = 1) łokieć jest jednak 16,7 cm na zewnątrz od dłoni w rzucie z przodu, czyli przedramię odchyla się ok. 38° od pionu. Miednica 5,6 cm od linii przy progu 6 cm.
- **Bird Dog:** łokcie proste (15–16°, uwaga z n5 zamknięta). Tułów jest pochylony 17°, bo barki są 14,5 cm wyżej niż biodra (proporcje rigu). Uniesiona noga jest pozioma, więc biodro ma −14,8°: noga leży 15° ponad linią tułowia, a wskazówka mówi „do linii tułowia” i ostrzega przed wyginaniem lędźwi. W praktyce noga „równolegle do podłogi” jest typową wskazówką (pewność 60%).
- **Tuck Crunch:** kręgosłup się zwija (błąd n5 naprawiony), a lędźwie leżą. Dłonie nie są jednak przy głowie: środek chwytu x = −38 przy głowie x = −72, czyli 34–35 cm od jej środka. Łokcie sterczą 22 cm nad barkami ku kolanom, a dłonie leżą skrzyżowane na mostku (z ∓6).
  Wyświetlana przy ćwiczeniu wskazówka `crunch.neck` („nie ciągnij głowy rękami”) i `crunch.setup` („dłonie przy głowie”) zakładają dłonie przy głowie. Ręce na klatce to poprawny wariant, ale niespójny ze wskazówką.
- **Leg Pull-In:** koniec ruchu to już nie „stolik” (biodro 114°, kolana x = −28,5 nad klatką, miednica +12 cm, ciało dotyka podłogi). Uwaga z n5 zamknięta w swojej klasie. Zostaje sztywny tułów (zgięcie kręgosłupa 0), jak w Reverse Crunch.
- **Plyo Push-Up:** lot z przodu nadal wygląda jak stanie (bez zmian od n5).
- **Incline Push Up / Incline CG:** bez zmian od n5.

## Szczegóły dla wybranych OK

- **Suspended Fallout:** taśma stała (155,0 / 155,1 cm, zaczep przeniesiony z x = 125,2 na 160). Uchwyty jadą po łuku wokół zaczepu (x 142 → 188, y 66–69). Ciało opada płynnie (tułów 47° → 72° od pionu, bark 83° → 158°), a kolana 17–18° i biodro 6–9° są w linii.
- **Alternate Heel Touchers:** w u = 0,5 prawa dłoń (22,9; 5,8; 21,9) jest ok. 6 cm od prawej pięty (24,1; 0; 21). Skłon boczny 16° w tę samą stronę, łopatki uniesione (zgięcie kręgosłupa 40°). Kształty najniżej −1,9 cm z przodu.
- **Reverse Crunch** (zmieniony): miednica unosi się 9,5 → 20,5 cm, biodro 89° → 120°, kolana ku klatce, tułów dotyka podłogi.
- **Standing Barbell Rollout:** chwyt 76 → 190 cm równo w 8 klatkach, na końcu miednica na linii kostka–bark (34,5 cm wobec 34,3 z linii), kolana 17–21°.
- **Push-Up Wide:** w dole łokieć 20 cm nad barkiem przy prawie pionowym przedramieniu. W głębokim dole pompki to anatomicznie poprawne (bark ok. 14 cm nad podłogą). Rozstaw dłoni 173,7% szerokości barków przy granicy 175%.
- **Krok 4** (nowe reguły na pozach niezmienianych): walidator z regułami R13–R16 i R14b przechodzi na wszystkich 16 pozach niezmienionych od n5.
- **Przybliżenia z manifestu (krok 1):** Superman (stopy), Tuck (kostki), Cocoons (ramiona), Heel Touchers (sztywny skłon), Plyo, Suspended Push-Up i Fallout zachowują cechę rozpoznawczą. Przybliżenie Cocoons nie wspomina o uniesieniu całego ciała (błąd nr 1).

## Wartości tuż przy progach (≤ 5% od progu)

Skan `skan5`: każdy próg walidatora (PROGI jakości i parametry reguł sensu) osobno zaostrzony o dokładnie 5%. Wymienione pozy przestają wtedy przechodzić.

| Ćwiczenie | Reguła | Wartość / próg | Zapas |
|---|---|---|---|
| Barbell Rollout from Bench | `proste_rece_rollout` (łokieć ≤ 15°) | 14,9° / 15° | 0,7% |
| Rollout (sztanga), Bench, Standing | `blad_widoczny_stale` (≥ 4 cm) | 4,1 cm / 4 cm | 2,5% |
| Mountain Climbers | `miednica_stala_wysokosc` (≤ 5 cm) | 4,8 cm / 5 cm | 4% |
| Standing Barbell Rollout | `kolana_proste_podpor` (≤ 22°) | 21,1° / 22° | 4,1% |
| Mountain Climbers | `podpor_bez_kleku` (≥ 11 cm) | 11,5 cm / 11 cm | 4,5% |

Tuż poza 5%:

- Push-Up Wide `rozstaw_dloni`: odchylenie 23,7 pkt proc. przy tolerancji 25, zapas 5,3%.
- Single-Arm `cialo_w_linii`: 5,6 / 6 cm, zapas 6,7%.
- Bench `podparcie_kolan`: 10,0 / 11 cm, zapas 9%. W n5 było 13,1 cm, więc wartość zeszła tuż pod próg reguły z n5.

Lista `na_krawedzi` z manifestu używa marginesu „5%, ale ≥ 1 cm/1°” i podaje te same ćwiczenia (plus rollouty z `rollout_linia_kolana` 5,1–5,2 / 6 cm). Lista jest zgodna z moim skanem.

## Proponowane reguły (z geometrii; progi = konwencja rysunku, do potwierdzenia przez badacza)

| # | Reguła | Warunek | Zakres | Błąd n6 | Pozostałe 27 |
|---|---|---|---|---|---|
| R17 | `styk_z_podlozem` (niezmiennik) | w każdej klatce najniższy punkt narysowanego ciała ≤ 1 cm nad podłożem (podłoga albo zadeklarowany sprzęt podpierający), chyba że ćwiczenie ma zadeklarowaną fazę lotu (`LOT`) | wszystkie rodziny, bez warunku cechy „leżenie” | Cocoons 6,7 cm | ≤ −0,3 cm (pozy leżące), stopy/dłonie w podporach ≤ 0,3 cm; Plyo: dłonie w locie, stopy na podłodze |
| R18 | `wyjatek_bez_skutku_ubocznego` | mechanizm wyjątku (R14b „zwijanie”) mierzony **względem podłogi**: unosi się środek miednicy, a najniższy punkt miednicy zostaje ≤ 1 cm | LEDZWIE_WYJATKI | Cocoons: najniższy punkt +6,7 cm | V-Up −0,3 cm |
| R19 | `podparcie_wyzej_niz_dlonie` | ćwiczenia „Decline …”: (kostka y − dłoń y) ≥ 25 cm, albo w u = 0 linia kostka–bark nachylona ≤ 5° nad poziom | warianty decline w rodzinach pompek i deski | Decline 28 cm, ale nachylenie 15,5° | Push Up 18 cm / 20,1° (nie dotyczy). **Słaba separacja w pierwszym warunku**: lepszy jest drugi (nachylenie) albo wysokość podparcia w danych ćwiczenia |
| R20 | `tempo_rowne` | przesunięcie punktu prowadzącego (chwyt, stopa) między klatkami kluczowymi proporcjonalne do Δu ± 50% (nie ma „ruchu w 30% i pełzania przez 70%”) | ćwiczenia z ruchem ciągłym | Rollout: 51 cm na Δu = 0,3, potem 11 cm na Δu = 0,7; Bench: 71 / 8,7 cm | Standing: równo (76 → 190 cm) |
| P3 | krok procesu: **zmiana sprzętu jest zmianą ćwiczenia** | każda zmiana `sprzet` (wysokość skrzyni, położenie zaczepu) w poprawce trafia do recenzenta z opisem „dlaczego” i z porównaniem cechy rozpoznawczej przed/po | wszystkie rodziny | Decline 14 → 10 cm | Fallout (zaczep 125,2 → 160): zmiana trafna |

R17 i R18 łapią błąd nr 1 bez fałszywego alarmu na pozostałych 28 pozach. Próg R19 oparty na nachyleniu łapie błąd nr 2 i nie flaguje Push Up, ale do zakresu potrzebne jest źródło (badacz).
R20 dotyczy uwag, nie błędów. Progi dobrałem na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.

## Wniosek

**Wzorzec z n5 się powtarza**, choć w mniejszej skali: 2 błędy zamiast 5, a wszystkie 5 błędów z n5 zniknęło w swojej klasie. Poprawka trafia w mierzoną liczbę, a obok wyrasta błąd innej klasy, którego żadna reguła nie mierzy:

1. **Cocoons:** n5 kazało, żeby wyjątek „zwijanie obu końców” miał mechanizm (R14b: miednica unosi się ≥ 3 cm, kręgosłup ≥ 20°). Generator uniósł miednicę o 8 cm, przesuwając w górę całe ciało. Liczba jest spełniona z zapasem, a postać wisi 6,7 cm nad podłogą.
   Reguła, która by to złapała (`nic_nie_wisi`), już istnieje, ale włącza się tylko przy cesze „leżenie”. Luka nie leży więc w braku reguły, tylko w **warunku włączenia**: reguły niezmiennicze (nic nie wisi, nic nie przenika podłogi) nie powinny zależeć od cech ćwiczenia.
2. **Decline Push Up** jest trzecią rundą tej samej spirali:
   - n4: łokieć 8,4 cm pod barkiem → reguła R6;
   - n5: przedramię 54,5° przy progu 55° (na krawędzi) → P2 (celuj w środek przedziału);
   - n6: przedramię 50,5° (zapas jest), ale uzyskane obniżeniem podparcia stóp z 14 do 10 cm, czyli osłabieniem tego, co odróżnia ćwiczenie od zwykłej pompki.

   Generator ma swobodę w sprzęcie i używa jej jako „pokrętła”. Reguła mierzy kąt, a nikt nie mierzy, czy to nadal decline.
3. **Spadek pod próg reguły z poprzedniej recenzji** powtarza się jak w n5: Bench 13,1 → 10,0 cm przy progu 11, MC 11,9 → 11,5 cm przy progu 11. Krok P2 działa (manifest sam zgłasza `na_krawedzi`), ale zgłoszenie nie wymusza zmiany pozy. Bench nadal ma łokieć 14,9° przy 15°.
4. **Co działa:** reguły niezmiennicze z n5 (R12 taśma, R15 kształty nad podłogą) zamknęły swoje klasy bez skutków ubocznych (Fallout, Heel Touchers). Reguły „na wartość” (R13 kolano ≤ 11 cm, R14b uniesienie ≥ 3 cm, R6 kąt) zamykają klasę, ale otwierają sąsiednią.

Propozycja dla modelu pracy:

- (a) Reguły niezmiennicze (R17: styk z podłożem) bez warunku cechy, sprawdzane na każdej pozie.
- (b) Każda reguła „na wartość” ma regułę-parę, która pilnuje sposobu spełnienia: R18 dla R14b, R19 dla R6.
- (c) Krok P3: zmiana sprzętu w poprawce wymaga opisu i porównania cechy rozpoznawczej przed i po.
- (d) Pozę `na_krawedzi` z reguły dodanej w poprzedniej recenzji traktować jak niezamkniętą uwagę, a nie OK.
