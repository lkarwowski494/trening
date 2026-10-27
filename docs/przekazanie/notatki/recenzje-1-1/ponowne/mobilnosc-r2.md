# Ponowna recenzja ruchu i treści kart: mobility_stand (9) i mobility_floor (9), runda 2, 27.10.2026

Recenzent niezależny („recenzent mobilność r2”). Poprzednia recenzja: `recenzje-1-1/ponowne/mobilnosc.md` (8 BŁĘDÓW na c3913afd).
Nie czytałem uzasadnień generatora: README podglądów, komentarzy w `scripts/figures/agent-pozy/*.mjs`, opisów commitów, linii stanu ani docs/54.

**Co sprawdziłem i czym:**
- Pozy z `origin/rodziny-mobilnosc` @ e6e95f26 (odłączony worktree, tylko odczyt). Zmienione od c3913afd: 10 póz (Chin To Chest, Side Neck, Overhead Triceps, Standing Gastrocnemius, Inchworm, Seated Calf, Child's Pose, Supine Hamstring, Side-Lying Quad, Cat-Cow). Pozostałe 8 bez zmian, bajt w bajt.
- **Render własny: 484 klatki** (18 póz × 13 klatek, a Inchworm 21; u = 0…1 co 1/12 plus klatki kluczowe, widoki bok i przód). Do tego powiększenia: klatka u = 0 każdej pozy (bok i przód), Cat-Cow w u = 0 / 0,5 / 1, Inchworm w 11 klatkach kluczowych z boku i w 6 z przodu.
  - Narzędzia: `dataShapes` i `svgDocument` silnika v2 oraz playwright.
  - Wierszy błędów nie ma, bo `bledy: []` we wszystkich 18 pozach.
  - PNG z `podglady-1-1/mobilnosc-r2/` służył tylko do orientacji. Ma znacznik ważności i tabele kątów. Moje kąty (`jointAngles`) zgadzają się z `katy-stawow.md` dla Child's Pose, Seated Calf, Overhead Triceps i Gastrocnemius.
- Liczby: `keyframeFrame` i `jointAngles` (stawy, chwyty, pięty i palce). Walidator `waliduj` (v2-validate) na każdej pozie: **18/18 OK**.
- Treść karty sprawdziłem w plikach:
  - `cue-sets.json`, `lib/cues/text/pl.json`, `muscles.generated.ts`, `catalog.generated.ts`;
  - `data/zrodla/figury-sens.json`, `poseData.ts`, `anim.ts`, `figure.ts`;
  - `lib/i18n.en.ts`, `lib/locales/*.json`, `docs/lokalizacja/konteksty-reczne.json`;
  - `tests/figury-mobilnosc-reguly.test.ts`.

## Podsumowanie

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 6 | Chin To Chest Stretch, Side Neck Stretch, Supine Hamstring Stretch, Wall Calf Stretch, Standing Lateral Stretch, The Straddle |
| OK z uwagą | 9 | Overhead Triceps, Standing Gastrocnemius, Seated Calf, Cat-Cow, Standing Chest, Standing Soleus, Butterfly, Seated Floor Hamstring, Kneeling Hip Flexor |
| **BŁĄD** | **3** | **Child's Pose, Side-Lying Quad Stretch, Inchworm** — wszystkie ŚREDNIE |

**Błędy z rundy 1.** Z 8 błędów 5 jest usuniętych w całości: Gastrocnemius, Seated Calf, Cat-Cow, Chin To Chest i Overhead Triceps. W Overhead Triceps i Seated Calf zostały uwagi NISKIE, wynikające z granic modelu. Pozostałe trzy usunięto częściowo:

| Ćwiczenie | Co naprawione | Co zostało albo jest nowe |
|---|---|---|
| Child's Pose | głowa leży na podłodze | pośladki dalej nie sięgają pięt (granica modelu) |
| Side-Lying Quad | cecha widoczna, dolna stopa poprawna | nowe: dłoń nie trzyma kostki |
| Inchworm | palce i dłonie się nie ślizgają | nowe: obie stopy podskakują jednocześnie |

**Uwagi z rundy 1.** Uwagi do Side Neck (ręka dociągająca) i Supine Hamstring (wariant bez źródła) są usunięte. Uwagi do 5 póz bez zmian zostają bez zmian.

**Nowe ustalenia rundy 2:**
- dłoń w Side-Lying Quad nie trzyma kostki;
- podskok obiema stopami w Inchwormie;
- mięśnie Gastrocnemius i Child's Pose nie zgadzają się z rysunkiem;
- „Wygięcie” po polsku jest dwuznaczne.

**Szczelność reguł: 0 z 3.** Wszystkie 3 błędy przechodzą walidator i 6 nowych reguł z `figury-mobilnosc-reguly.test.ts`. Próg R3 (`miednicaPietaMaxCm: 38`) jest ustawiony pod granicę modelu, a nie pod źródło. Szczegóły w ostatniej sekcji.

**Realność.** Obie rodziny mają dalej status `planned` i nie mają wpisu `DATA_UI`. `figureSpec` zwraca więc `null`: dziś nic z tego nie trafia do aplikacji. Po nałożeniu każdy błąd będzie realny, bo widać go przy każdym wyświetleniu.

**Gotowość rodzin.** Żadna rodzina nie ma znaleziska KRYTYCZNEGO ani WYSOKIEGO. Według progu z CLAUDE.md obie mogą dostać status „zatwierdzona”, a błędy ŚREDNIE idą do backlogu.
- **Rekomenduję jednak** przed nałożeniem tanie poprawki Inchworma (naprzemienne stopy) i Side-Lying Quad (dłoń na kostce).
- Child's Pose wymaga decyzji koordynatora: rozszerzyć model, przyjąć nazwane uproszczenie albo dać wyjątek.
- Niezależnie od rysunków nałożenie blokują trzy warunki kart (sekcja „Treść kart”).

## Tabela

Konwencja kątów jak w `katy-stawow.md`. Kostka: wartość dodatnia oznacza zgięcie grzbietowe. Oś x biegnie w przód sceny, y w górę, z w stronę kamery widoku z boku. Wszystkie liczby dotyczą u = 0, chyba że podano inaczej.

| # | Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły (klatka, staw, liczba, co powinno być) | Waga / realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Child's Pose** | błąd | mięśnie niezgodne | **BŁĄD** | Głowa naprawiona, ale istota pozy nadal nie widać. Liczby i warianty naprawy pod tabelą. | ŚREDNIE / realny | nie (R3 przechodzi przy progu 38 cm dobranym pod model) |
| 2 | **Side-Lying Quad Stretch** | błąd | OK | **BŁĄD** | Naprawione: widoczność cechy i dolna stopa. **Nowe:** dłoń nie trzyma kostki. Liczby pod tabelą. | ŚREDNIE / realny | nie |
| 3 | **Inchworm** | błąd | fazy OK | **BŁĄD** | Naprawione: brak poślizgu palców i dłoni. **Nowe:** obie stopy odrywają się razem, czyli podskoki zamiast kroków. Liczby i uwagi pod tabelą. | ŚREDNIE / realny | nie (R6 sprawdza tylko poślizg) |
| 4 | Overhead Triceps Stretch | OK | OK | OK z uwagą | Ręka pomocnicza usunięta. **Cecha rozpoznawcza zachowana:** łokieć R 30,2 cm nad barkiem (y 169,7, nad głową, x 5,9 przy osi głowy 4,7), łokieć zgięty 145,7°, przedramię za głową. Ręka L swobodnie wzdłuż ciała. Brak ręki pomocniczej jest zgodny z regułą `lokiec_nad_barkiem`: źródło opisuje rękę w górę i dłoń na plecach, nie chwyt drugą ręką. **Uwaga:** dłoń R (y 144) jest **4,5 cm nad linią barków**, czyli u nasady szyi, a nie „na środku pleców”. Przy przedramieniu ok. 27 cm i łokciu 30 cm nad barkiem model nie sięgnie niżej niż ok. y 143, więc to granica geometrii. Nazwać uproszczeniem. | NISKIE | — |
| 5 | Standing Gastrocnemius Calf Stretch | OK | uwaga do mięśni | OK z uwagą | Poza (szczegóły pod tabelą) jest prawie identyczna z Wall Calf: ten sam rysunek i te same reguły. **To akceptowalne:** prosta tylna noga z piętą na podłodze to właśnie rozciąganie brzuchatego łydki, a źródło reguł (ACE #152) jest to samo. **Uwagi:** (a) mięśnie karty to `calves` i `hamstrings`, a Wall Calf przy tym samym rysunku ma tylko `calves`. Tył uda nie jest tu rozciągany, więc `hamstrings` trzeba usunąć. (b) Katalog `recommended: ["box"]` nie ma odbicia w rysunku. Dwie identyczne karty w katalogu → backlog (scalenie lub różnicowanie, decyzja produktowa). | ŚREDNIE (mięśnie: twierdzenie niezgodne z rysunkiem) / realny | — |
| 6 | Seated Calf Stretch | OK | uwaga | OK z uwagą | Naprawione: kostki +5,5° (było −13,1°), stopy prostopadle do goleni, kolana proste (6°), tułów prosto (8°). Dłonie przed klatką (łokcie 121°) trzymają gumę lub pasek zaczepiony o stopę R. **Uwagi:** (a) zgięcie grzbietowe 5,5° to granica kontraktu (podbicie ≤ 90°), więc „palce do siebie” widać słabo i trzeba to nazwać uproszczeniem. Backlog: rozszerzyć zakres podbicia dla siadu. (b) Pasek i chwyt nie mają reguły ani cytatu w `figury-sens.json` (reguły: tylko `poza_nieruchoma`, `kolana_proste`, `siad_prosto`). Według decyzji z 27.10 element pozycji wymaga przeczytanego źródła, więc badacz musi potwierdzić, że ACE #214 opisuje ręcznik lub pasek. Bez tego trzeba rysować bez paska. | ŚREDNIE (źródło elementu) / realny | — |
| 7 | Cat-Cow | OK | uwaga do nazwy fazy | OK z uwagą | **Głowa w fazie z kręgosłupem:** u = 0 koci grzbiet (+26°), głowa 28° w dół względem tułowia; u = 1 krowa (−16°), głowa w linii tułowia. Kierunek poprawny, R2 przechodzi. Dłonie pod barkami, kolana pod biodrami, łokcie proste (≤ 9,7°). Fazy u 0 → 1 to „Wygięcie”, powrót to „Zaokrąglenie”: kolejność zgodna z `uAt` (pierwsza faza: u rośnie). **Uwagi:** (a) amplituda 42° jest widoczna w powiększeniu, ale skromna (NISKIE, jak w rundzie 1). (b) **„Wygięcie” po polsku jest dwuznaczne**, bo „kot wygina grzbiet” to właśnie koci grzbiet. Przekazać recenzentowi lokalizacji, np. „Brzuch w dół / Grzbiet w górę” albo „Krowa / Koci grzbiet”. EN „Arching / Rounding” jest dobre. | NISKIE | — |
| 8 | Chin To Chest Stretch | OK | OK | OK | Naprawione: postawa stojąca, ręce wzdłuż ciała (łokieć 13°), głowa pochylona do klatki (`headUp` ok. 45° od pionu), tułów pionowo. W widoku z boku broda nie jest zasłonięta, z przodu widać czubek głowy. Zgodne z ACE #204 i #202 („arms by your sides”, `rece_proste`). | — | — |
| 9 | Side Neck Stretch | OK | OK | OK | Naprawione: brak ręki dociągającej, ręce wzdłuż ciała. Skłon głowy w bok ok. 25° (widok z przodu), tułów pionowo, barki opuszczone. Zgodne z cytatami ACE #202 i NHS. | — | — |
| 10 | Supine Hamstring Stretch | OK | OK | OK | Wariant ze źródłem (AAOS, wpisany w `figury-sens.json`). Noga R prosta w górę: kolano 8,6°, biodro 92°. Dłonie z tyłu uda (oś uda x ≈ −1, dłonie x 4,3 i 7,3). Noga L zgięta, stopa na podłodze (kolano 128°). Głowa i miednica na podłodze. | — | — |
| 11 | Standing Chest Stretch | OK | OK | OK z uwagą | Bez zmian od rundy 1. Uwaga z rundy 1 aktualna: wyprost barku tylko −28,9°, więc rozciąganie klatki słabo widać. | NISKIE | — |
| 12 | Standing Soleus And Achilles Stretch | OK | OK | OK z uwagą | Bez zmian. Uwaga aktualna: tylna stopa tylko 9 cm za miednicą, sylwetka jak półprzysiad. | NISKIE | — |
| 13 | Butterfly Stretch | OK | OK | OK z uwagą | Bez zmian. Uwaga aktualna: podeszwy w „V” (pięty 2 cm od siebie, palce 19 cm). | NISKIE | — |
| 14 | Seated Floor Hamstring Stretch | OK | OK | OK z uwagą | Bez zmian. Uwaga aktualna: stopa prostej nogi w zgięciu podeszwowym (−13,1°). | NISKIE | — |
| 15 | Kneeling Hip Flexor Stretch | OK | uwaga do mięśni | OK z uwagą | Bez zmian. Uwagi aktualne: tułów 12° w przód, mięśnie tylko `quads`. | NISKIE | — |
| 16 | Wall Calf Stretch | OK | OK | OK | Bez zmian (jak w rundzie 1). | — | — |
| 17 | Standing Lateral Stretch | OK | OK | OK | Bez zmian. | — | — |
| 18 | The Straddle | OK | OK | OK | Bez zmian. | — | — |

### Szczegóły do wierszy tabeli

**1. Child's Pose (BŁĄD)**
- **Co jest:**
  - Głowa leży na podłodze (najniższy punkt ok. 0 cm), tułów pochylony w dół do głowy (tułów 100°).
  - Kolana szeroko (z ±41), stopy na palcach (podbicie −90).
  - Ręce do tyłu wzdłuż ciała: dłonie na podłodze przy kolanach (x 22), łokcie 20 cm nad podłogą i odstawione na boki.
- **Co nie zgadza się z istotą pozy:**
  - Miednica (x 26, y 34) jest **7,5 cm przed kolanami** (x 18,5) i **wyżej niż barki** (y 25,3).
  - Biodro zgięte tylko **78,6°**. Pośladki są ok. 20 cm przed piętami (środek miednicy 34 cm od pięt).
  - Cytowana wskazówka ACE #227 („bringing your glutes to your heels”) jest na obrazie niespełniona. Sylwetka czyta się jak klęk z czołem na podłodze, a nie jak siad na piętach z odpoczynkiem.
- **Przyczyna to granica modelu**, co potwierdzam rachunkiem:
  - Kolano ma maksimum 141° (`rom.side.knee.max`, zakres czynny). Przy goleni ok. 43 cm i udzie ok. 49 cm środek miednicy nie zbliży się do kostki bardziej niż na ok. 31 cm.
  - Stopa grzbietem na podłodze wymaga podbicia poza zakresem kontraktu −90…90°.
- **Mięśnie:** `lats` 0,25. Przy rękach wzdłuż ciała najszerszy grzbietu się nie rozciąga (rozciąga się przy rękach wyciągniętych w przód), więc karta przeczy rysunkowi.
- **Do decyzji koordynatora (rekomendacja: A):**
  - **A.** Rozszerzyć model o bierne zgięcie kolana w klęku (ok. 155–160°) i stopę grzbietem na podłodze, potem przerysować. Daje to pośladki przy piętach i biodro powyżej 120°.
  - **B.** Przyjąć poza jako nazwane uproszczenie (wpis w `figury-sens.json`, `liczba`). Do tego ręce wyciągnięte w przód albo usunięcie `lats` z mięśni.
  - **C.** Wyjątek bez animacji do czasu rozszerzenia modelu.

**2. Side-Lying Quad Stretch (BŁĄD)**
- **Naprawione:**
  - Postać leży tyłem do kamery (`front` = −z), więc pięta górnej nogi (z +6) i dłoń są na pierwszym planie.
  - Stopa dolnej nogi leży płasko i wskazuje kierunek przodu ciała.
  - Głowa leży na dłoni dolnej ręki (dłoń y 14, środek głowy y 23).
- **Nowy błąd:** dłoń górnej ręki (x 12,6 / y 37,6 / z 0,8) jest **15,5 cm od kostki** (x 27 / y 35,5 / z 6). Na obrazie dłoń kończy się przed stopą, więc nie trzyma kostki ani stopy. Cytat ACE #149 („pull your left heel up towards your left glute”) wymaga chwytu.
- **Przyczyny:**
  - Biodro górnej nogi jest zgięte **57,5°** (kolano wysunięte 32 cm przed tułów), więc kostka odsuwa się w stronę stóp (x 27).
  - Odległość bark–kostka wynosi 77 cm, a sięg ręki ok. 63 cm.
  - Przy rozciąganiu czworogłowego udo powinno leżeć mniej więcej w linii tułowia, a zgięte biodro osłabia rozciąganie prostego uda.
- **Jak powinno być:** udo górnej nogi w linii tułowia (biodro ok. 0–20°), dłoń na kostce lub grzbiecie stopy (≤ 8 cm), pięta możliwie blisko pośladka. Kolano jest już na 140,7°, czyli na granicy modelu.

**3. Inchworm (BŁĄD)**
- **Naprawione:**
  - Dłonie stoją w miejscu (x 150) przez wszystkie 21 klatek. Rysunek w układzie dłoni jest więc spójny.
  - Palce nie ślizgają się: w każdej klatce podparcia stoją, przenoszone są w powietrzu (y 5).
  - Podpór w u = 0: linia pięta–bark–miednica prosta (miednica 1,5 cm pod linią), pięty uniesione, kolana 13–17°.
  - Skłon w u = 1: biodro 127°, pięty na podłodze, kolana miękkie (zgodnie z cytatem ACE #254).
- **Błąd:** obie stopy odrywają się **jednocześnie**: w u = 0,1 / 0,3 / 0,5 / 0,7 / 0,9 obie mają y 5 przy tym samym x.
  - To 5 podskoków obunóż po 15–20 cm, a nie „małe kroki”.
  - Z boku nogi się nakładają i tego nie widać, ale z przodu (rodzina ma widoki `side` i `front`) widać szczelinę pod obiema stopami naraz.
  - **Jak powinno być:** stopy naprzemiennie, jedna zawsze na podłodze.
- **Uwagi (NISKIE):**
  - (a) W u = 0,9 → 1 stopy lądują 9 cm za miejscem, nad którym były w powietrzu (x 106,3 → 97), a barki cofają się o 11 cm. W pętli widać to jako krok wstecz na końcu fazy.
  - (b) W podporze dłonie są 15,5 cm przed barkami (było 21,5).
  - (c) Pętla tam i z powrotem: w fazie „Marsz w podpór” stopy cofają się przy nieruchomych dłoniach, a w źródle dłonie idą w przód. To dopuszczalna odmiana (wyjście w podpór krokami stóp). Nazwę fazy „Marsz w podpór” zostawiam, a do kontekstu tłumacza warto dopisać, że idą stopy.
- **Nazwy faz:** u 0 → 1 to „Stopy do dłoni”, powrót to „Marsz w podpór”. Kolejność jest zgodna z ruchem.

### Treść kart (wszystkie 18)

- **Wskazówek nadal brak.** `cue-sets.json` daje `st.*` i `dyn.*`, ale w `lib/cues/text/pl.json` nie ma ani jednego klucza `st.*`, `dyn.*` ani `sb.*` (0 z 306). Karta to więc tylko rysunek i mięśnie.
  - Warunek nałożenia (ŚREDNIE): teksty wskazówek albo świadoma decyzja, że karta rozciągania jest bez tekstu.
  - Brak tekstów oznacza też brak wymaganych wpisów w rejestrze twierdzeń. Po dodaniu tekstów każdy (np. czasy 15–30 s) potrzebuje wpisu: `node scripts/claims.mjs --stub`.
- **Nazwy faz** (Wygięcie, Zaokrąglenie, Stopy do dłoni, Marsz w podpór) przechodzą przez t():
  - typ `PhaseName`, `PHASES_BY_EXERCISE`, `phaseNames()` z pierwszeństwem przed `DATA_UI`;
  - EN w `lib/i18n.en.ts` i `_source.json`, konteksty ręczne dla tłumacza;
  - test sprawdza, że nie są to nazwy faz siłowych.
- **Tłumaczenia faz:** jest tylko 1 z 35 plików `lib/locales/*.json` (`_source.json`), pozostałe 34 języki ich nie mają. Klucze są w zestawie przekładu, ale trzeba je przetłumaczyć przed nałożeniem (warunek nałożenia).
- **Pozy statyczne (16) w `ISOMETRIC`:** jedna poza bez pętli i bez licznika faz, a katalog ma dla nich miarę czasu (test sprawdza oba warunki). Karta ma sens jako „przytrzymaj pozycję”. Ruchowe (Cat-Cow, Inchworm) poza `ISOMETRIC`, miara powtórzeń.
  - Przycisk „Pokaż częsty błąd” się nie pojawi. Dla danych `faultApplicable` przyjmuje tylko błędy z `bledy[]` albo `jerk`, a cue `dyn.mis.jerk` nie mapuje się na `jerk` (`mis.jerk`). To spójne z `bledy_bez_animacji`.
- **Warunek nałożenia (jak w rundzie 1):** rodzina musi dostać wpis `DATA_UI` (`lowerFirst`, `joint`). Inaczej `figureSpec` zwraca `null`, a `measuredJoint` czyta `DATA_UI[family].joint`. Dla rodzin rozciągań staw mierzony nie ma oczywistego sensu, więc trzeba go wybrać świadomie albo ukryć kąt dla póz statycznych.
- **Nazwy marek i źródeł** w tekstach UI: brak (tekstów UI jest tylko 4, to nazwy faz).

## Szczelność reguł: czego zabrakło (propozycje mechanizmów)

1. **Child's Pose:** próg R3 `miednicaPietaMaxCm: 38` wynika z granicy modelu (komentarz w teście), a nie ze źródła, więc reguła przepuszcza pozę niezgodną z cytatem. Proponuję:
   - regułę „zgięcie biodra ≥ ok. 110°” w pozie dziecka;
   - zasadę, że progu nie stroi się pod granicę modelu. Gdy model nie pozwala, ćwiczenie dostaje nazwane uproszczenie albo wyjątek, a test to odnotowuje.
2. **Side-Lying Quad (i każde rozciąganie czworogłowego „pięta do pośladka”):** reguła „dłoń ≤ 8 cm od kostki tej samej nogi” oraz „biodro rozciąganej nogi ≤ ok. 30°”.
3. **Inchworm (i każdy chód w podporze):** reguła „w każdej chwili co najmniej jedna stopa w podparciu (y ≤ 0,3 cm)”, gdy obie stopy zmieniają położenie w ruchu. Do tego „stopa nie przesuwa się w x przeciwnie do kierunku marszu przy lądowaniu”.
4. **Mięśnie a rysunek:**
   - test spójności „ćwiczenia o identycznych pozach mają identyczne mięśnie” (Gastrocnemius / Wall Calf);
   - mapa „mięsień ↔ warunek pozy”, np. `lats` w rozciąganiu wymaga ręki nad barkiem.
5. **Element pozycji bez reguły** (pasek w Seated Calf, ręce w Child's Pose): rozciąganie z dłońmi poza „wzdłuż ciała” powinno mieć regułę `chwyt` lub `podpór` z cytatem (propozycja z rundy 1, nadal otwarta).

## Pliki

- Pozy: `lib/figures/v2/poses/mobility_stand.json`, `mobility_floor.json` (origin/rodziny-mobilnosc @ e6e95f26).
- Podglądy do orientacji: `docs/przekazanie/notatki/podglady-1-1/mobilnosc-r2/` (origin/przekazanie-konta).
- Reguły z recenzji: `tests/figury-mobilnosc-reguly.test.ts`; źródła: `data/zrodla/figury-sens.json`.
