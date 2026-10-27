# Recenzja ruchu i treści kart: mobility_stand (9) i mobility_floor (9), 27.10.2026

Recenzent niezależny („recenzent mobilność”). To pierwsza recenzja tych rodzin; pierwotnej recenzji nie ma, więc nie ma wcześniejszych znalezisk do sprawdzenia.
Nie czytałem uzasadnień generatora: README podglądów, komentarzy w `scripts/figures/agent-pozy/*.mjs`, opisów commitów, linii stanu ani docs/54.

**Co sprawdziłem i czym:**
- Podglądy: `docs/przekazanie/notatki/podglady-1-1/mobility_stand/` i `.../mobility_floor/` (origin/przekazanie-konta). Oglądałem pełną rozdzielczość, kadry 2–5×.
- Ważność: w obu katalogach jest `PODGLAD-WAZNY.txt`, w obu tabela kątów (`katy-stawow.md`, `manifest.json`).
- Pozy: `origin/rodziny-mobilnosc` @ c3913afd (odłączony worktree, tylko odczyt).
- Każde podejrzenie z obrazu przeliczyłem silnikiem v2 (`keyframeFrame`: stawy, chwyty, pięty i palce w u = 0…1 co 0,1).
- Walidator `v2-validate.mjs` na każdej pozie osobno: **18/18 OK**.
- Treść karty: `cue-sets.json`, `lib/cues/data.json`, `lib/cues/text/pl.json`, `muscles.generated.ts`, `catalog.generated.ts`, `figury-sens.json`, `figury-wyjatki.json`, `lib/figures/v2/{figure,poseData,anim}.ts`, `lib/i18n.en.ts`.

## Podsumowanie

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 3 | Wall Calf Stretch, Standing Lateral Stretch, The Straddle |
| OK z uwagą | 7 | Side Neck Stretch, Standing Chest Stretch, Standing Soleus And Achilles Stretch, Butterfly Stretch, Seated Floor Hamstring Stretch, Supine Hamstring Stretch, Kneeling Hip Flexor Stretch |
| **BŁĄD** | **8** | **Standing Gastrocnemius Calf Stretch, Seated Calf Stretch, Cat-Cow, Child's Pose, Chin To Chest Stretch** (wszystkie WYSOKIE); **Overhead Triceps Stretch, Side-Lying Quad Stretch, Inchworm** (ŚREDNIE) |

- **Szczelność reguł automatycznych: 0 z 8.** Wszystkie pozy z błędem przechodzą walidator i reguły sensu (szczegóły w kolumnie „Reguła łapie?”).
- **Realność:** obie rodziny mają status `planned`, a `DATA_UI` w `poseData.ts` nie ma dla nich wpisu. `figureSpec` zwraca więc `null` i dziś nic z tego nie trafia do aplikacji ani na stronę. Wydania 1.0 nic nie blokuje.
- Po nałożeniu każdy błąd będzie **realny**, bo widać go przy każdym wyświetleniu.
- **Rodziny gotowe do statusu „zatwierdzona”: żadna.** Każda ma błędy WYSOKIE.
- **Treść kart.** Żadne z 18 ćwiczeń nie ma tekstu wskazówek: `cuesFor` zwraca `null`. Zestaw ogólny (`st.*`, `dyn.*`, `sb.plane`) jest w `newIds`, a w `lib/cues/text/pl.json` brakuje tych zdań.
- Karta to więc tylko rysunek i mięśnie. Brak tekstów twierdzeń oznacza też brak potrzebnych wpisów w rejestrze twierdzeń. Wiersze błędów: `bledy: []` we wszystkich 18. Oba błędy ogólne (`st.mis.force`, `dyn.mis.jerk`) mają jawny powód braku animacji (cecha tempa lub siły).
- **Teksty faz Cat-Cow i Inchworm NIE idą przez t(), bo nie istnieją.** Szczegóły w sekcji „Fazy i nałożenie”.

## Tabela

Konwencja kątów jak w `katy-stawow.md`. Kostka: dodatnia = zgięcie grzbietowe, ujemna = podeszwowe (sprawdzone na Wall Calf: tylna noga +31,5° przy pięcie na podłodze).
`pochylenieGlowy` mierzymy od pionu (bezwzględnie), do przodu dodatnio. `zgiecieKregoslupa` dodatnie = zaokrąglony grzbiet.

| # | Ćwiczenie | Ruch | Treść | Werdykt | Szczegóły (klatka, staw, liczba, co powinno być) | Waga / realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Standing Gastrocnemius Calf Stretch** | błąd | mięśnie zgodne z rysunkiem, nie z nazwą | **BŁĄD** | Wszystkie klatki pokazują w praktyce rozciąganie tyłu uda na podwyższeniu (szczegóły pod tabelą). Łydka nie jest rozciągana. | WYSOKIE / realny | nie |
| 2 | **Seated Calf Stretch** | błąd | — | **BŁĄD** | **Kostka −13,1°** (zgięcie podeszwowe), czyli palce odchylone od siebie. Widać to na rzucie z boku: ciemna stopa pochylona w prawo, od ciała. Szczegóły pod tabelą. | WYSOKIE / realny | nie |
| 3 | **Cat-Cow** | błąd | brak tekstów faz | **BŁĄD** | **Głowa w przeciwfazie do kręgosłupa** (liczby pod tabelą). Zakres zgięcia kręgosłupa (42°) przy szerokości kadru w aplikacji jest ledwo widoczny (uwaga). Dłonie pod barkami (x 60 = 60) i kolana pod biodrami (x 13,9 = 13,9) są poprawne. | WYSOKIE / realny | nie |
| 4 | **Child's Pose** | błąd | — | **BŁĄD** | Zamiast pozycji odpoczynku jest aktywne utrzymanie (szczegóły pod tabelą). | WYSOKIE / realny | nie |
| 5 | **Chin To Chest Stretch** | błąd | — | **BŁĄD** | Dwa problemy: cecha zasłonięta w widoku głównym i pozycja bez źródła (szczegóły pod tabelą). | WYSOKIE (szyja = zdrowie, decyzja 27.10) / realny | nie |
| 6 | **Overhead Triceps Stretch** | błąd | mięśnie OK | **BŁĄD** | Ręka pomocnicza i ręka rozciągana są ustawione nienaturalnie (szczegóły pod tabelą). Cecha główna (łokieć nad głową, 30 cm nad barkiem) jest zachowana. | ŚREDNIE / realny | nie |
| 7 | **Side-Lying Quad Stretch** | błąd | mięśnie OK | **BŁĄD** | Cecha niewidoczna w widoku głównym, a stopa dolnej nogi obrócona o 90° (szczegóły pod tabelą). | ŚREDNIE / realny | nie |
| 8 | **Inchworm** | błąd | brak tekstów faz | **BŁĄD** | **Palce stóp ślizgają się po podłodze o 13,8 cm.** Fazy są czytelne: u = 0 skłon z dłońmi na podłodze, u = 1 podpór; ciało w linii, kolana 13–18°. Szczegóły i uwagi pod tabelą. | ŚREDNIE / realny | nie |
| 9 | Side Neck Stretch | OK | — | OK z uwagą | Skłon głowy 25° w prawo, ręka prawa dociąga głowę od góry (chwyt 14,7 cm nad środkiem głowy), lewa ręka zwisa, tułów pionowo. Kierunek poprawny. **Uwaga:** dociąganie ręką nie wynika z cytatów w `figury-sens.json` (NHS: „tilt… while holding your shoulder down”; ACE #202: „draw your right ear…”). Do potwierdzenia przez badacza (szyja = zdrowie); bez potwierdzenia rysować skłon bez ręki. | ŚREDNIE / realny | — |
| 10 | Standing Chest Stretch | OK | mięśnie OK | OK z uwagą | Ręce proste za plecami (łokieć 22°), dłonie blisko siebie (8 cm), tułów pionowo. **Uwaga:** wyprost barku tylko −28,9°, więc ręce wiszą lekko z tyłu i rozciąganie klatki słabo widać. | NISKIE | — |
| 11 | Standing Soleus And Achilles Stretch | OK | OK | OK z uwagą | Tylna pięta na podłodze, tylne kolano ugięte, kostka tylna 36°: płaszczkowaty rozciągnięty. Dłonie na biodrach. **Uwaga:** tylna stopa tylko 9 cm za miednicą (przednia 32 cm przed), więc sylwetka wygląda jak półprzysiad w małym rozkroku. | NISKIE | — |
| 12 | Butterfly Stretch | OK | OK | OK z uwagą | Kolana na zewnątrz (z ±42,8), dłonie na stopach, skłon z płaskimi plecami. **Uwaga:** stopy w „V”: pięty 2 cm od siebie, palce 19 cm. Podeszwy nie przylegają do siebie. | NISKIE | — |
| 13 | Seated Floor Hamstring Stretch | OK | OK | OK z uwagą | Noga prawa prosta, pięta lewej przy wewnętrznej stronie uda prawej (z 1,5 wobec powierzchni uda ok. 1,8), skłon 38° z płaskimi plecami, dłonie na kolanie. **Uwaga:** stopa prostej nogi w zgięciu podeszwowym (−13,1°). | NISKIE | — |
| 14 | Supine Hamstring Stretch | OK | OK | OK z uwagą | Noga prawa prosta w górę (biodro 81,7°), dłonie z tyłu uda (ok. 5 cm od osi), druga noga na podłodze, głowa na podłodze. **Uwaga merytoryczna:** cytowane źródło (ACE #235) opisuje nogę opartą o ścianę, a rysunek pokazuje przytrzymanie dłońmi. Według decyzji 27.10 trzeba źródła tego wariantu albo rysunku wariantu ze ścianą. | ŚREDNIE / realny | — |
| 15 | Kneeling Hip Flexor Stretch | OK | uwaga do mięśni | OK z uwagą | Tylne kolano na podłodze (oś 7,9 cm), biodro tylne −15,7° (miednica przesunięta w przód), przednie kolano 81,5° nad kostką (x 41,8 i 43), dłonie na biodrach. **Uwagi:** tułów pochylony w przód 12° (dopuszczalne do 15°, ale osłabia rozciąganie); mięśnie tylko `quads` (zginacze biodra jako zginacz z mapy, gdy będzie). | NISKIE | — |
| 16 | Wall Calf Stretch | OK | OK | OK | Tylna noga prosta (kolano 7,9°), pięta na podłodze, kostka tylna +31,5°; przednie kolano 32°; dłonie na ścianie (chwyt 3 cm od ściany przy grubości dłoni 3,6). | — | — |
| 17 | Standing Lateral Stretch | OK | OK | OK | Skłon boczny 20° w prawo, lewa ręka nad głową w stronę skłonu, prawa wzdłuż boku, skręt 0°. | — | — |
| 18 | The Straddle | OK | OK | OK | Nogi proste (7,9°), kostki ±61,7 cm od osi, skłon z płaskimi plecami, dłonie na podłodze przed miednicą, palce stóp w górę. | — | — |

### Szczegóły błędów (do wierszy 1–8)

**1. Standing Gastrocnemius Calf Stretch**
- **Przednia stopa (R):** pięta na skrzyni (y 12,0 przy blacie 12), a **palce w powietrzu 21,7 cm nad blatem** (stopa 60° w górę, nic jej nie podpiera).
- **Tylna noga (L):** stoi pionowo pod miednicą (kostka x −8 przy miednicy x −10; kostka tylko 10°), więc jej łydka się nie rozciąga.
- **Tułów:** pochylony 45° (biodro do 84°), dłonie na udzie przedniej nogi. Przednie kolano 23,8°.
- **Mięśnie:** karta pokazuje `calves` i `hamstrings`, czyli zgadza się z rysunkiem, nie z nazwą.
- **Jak powinno być:** wariant ze źródła (ACE #152, z cytatów reguł): tylna noga prosta, odstawiona w tył, pięta na podłodze, kostka tylna ≥ ok. 20–30°. Ewentualnie wariant „palce na stopniu lub ścianie, pięta na podłodze” z przeczytanym źródłem.

**2. Seated Calf Stretch**
- To odwrotność istoty ćwiczenia (palce do siebie, zgięcie grzbietowe).
- Siad prosto (18°), nogi proste (7,5°) i dłonie na goleniach są poprawne.
- **Jak powinno być:** kostka ≥ ok. +10° (palce w stronę ciała); ewentualnie ręcznik lub dłonie na stopach.

**3. Cat-Cow**
- **u = 0:** grzbiet zaokrąglony **+26°** (koci grzbiet), a głowa **12° od pionu**, czyli uniesiona i wyprostowana ok. 60° względem tułowia (tułów 72°).
- **u = 1:** lędźwie wygięte **−16°** (krowa), a głowa opuszczona (52°).
- Typowa i spójna koordynacja jest odwrotna: przy kocim grzbiecie głowa w dół, przy krowie w górę lub neutralnie. Jeśli źródło nie mówi o głowie, głowa powinna iść za kręgosłupem.
- Badacz powinien sprawdzić, co mówi ACE #15.

**4. Child's Pose**
- Tułów poziomo (95°) na wysokości barków 37,6 cm i miednicy 42 cm.
- **Głowa wisi 24,7 cm nad podłogą** (środek y 34,2, promień 9,5).
- Ręce opadają skośnie do podłogi (palce dotykają przy x 120).
- Miednica 18 cm przed piętami, kolano 139°.
- Palce stóp podwinięte (podbicie −85°), choć zwykle stopy leżą grzbietem na podłodze.
- **Jak powinno być:** pośladki do pięt (cytat ACE #227), tułów opuszczony między uda (kolana są szeroko, z ±28,6), czoło na podłodze lub blisko niej, ręce leżą na podłodze.

**5. Chin To Chest Stretch**
- **(a) Cecha zasłonięta.** W widoku głównym (bok) ramię bliższej ręki (bark → łokieć 9,3 / 82,5 / 37,8) zasłania głowę, więc „broda do klatki” jest nieczytelna. Czytelne jest dopiero w widoku z przodu (widać czubek głowy).
- Liczby są poprawne: `headUp` 45°, reguła `glowa_do_klatki` przechodzi.
- **(b) Pozycja bez źródła.** Postać siedzi w siadzie z podeszwami razem (nogi jak w Butterfly: kolana z ±42,8) z dłońmi splecionymi na czubku głowy (dociskanie).
- Cytowane źródło (ACE #204) mówi tylko „drop your chin toward your chest”. Reguła `tulow_pion` cytuje postawę stojącą, a rodzina to „stojąc”.
- Dociskanie szyi rękami to twierdzenie dotyczące zdrowia bez przeczytanego źródła, co jest sprzeczne z decyzją 27.10.
- **Jak powinno być:** postawa ze źródła (stojąc lub siedząc prosto, ręce wzdłuż ciała), sam skłon głowy, rzut główny bez zasłaniania głowy.

**6. Overhead Triceps Stretch**
- **Ręka pomocnicza (L):** łokieć **przed twarzą** (x 21,6 cm przed osią głowy, y 156 na wysokości brody), przedramię poziomo przed szyją. Dłoń L chwyta ramię R **ok. 10 cm nad barkiem** (y 149), a nie łokieć (y 169,4).
- **Ręka rozciągana (R):** dłoń R za potylicą (y 151,2, 11,7 cm nad barkiem), a nie „na środku pleców”, jak w cytacie reguły (ACE #174).
- **Jak powinno być:** dłoń R między łopatkami (y ok. 125–135), dłoń L na łokciu R nad głową, łokieć L z boku głowy, nie przed twarzą.

**7. Side-Lying Quad Stretch**
- **(a) Cecha niewidoczna w widoku głównym.** Postać leży na prawym boku twarzą do kamery (`headFront` +z), a pięta górnej nogi (z −22,6) i dłoń na kostce (z −21,8) są za ciałem.
- W rzucie z boku widać tylko udo górnej nogi, więc „pięta do pośladka” jest zasłonięta. Rodzina ma jeden widok (`views: ['side']` w families.ts).
- **(b) Stopa dolnej nogi palcami w sufit.** Palce mają y 26,6 nad piętą 1,7, czyli stopa obrócona o 90° względem nogi. Przy leżeniu na boku palce powinny wskazywać kierunek twarzy (+z).
- Widać to w każdej klatce: ciemna pionowa stopa na prawym końcu.
- **Jak powinno być:** leżenie tyłem do kamery (pięta i dłoń na pierwszym planie) albo widok z góry; stopa w przedłużeniu ustawienia nogi.

**8. Inchworm**
- **Poślizg palców:** czubek palców przesuwa się z x 18,9 do 5,1 (y = 0 przez cały czas), a stopa powinna obracać się wokół palców.
- **Uwaga — dłonie:** suną 75 cm po podłodze bez odrywania (x 71,8 → 146,9). To uproszczenie „przejścia na dłoniach” i trzeba je nazwać uproszczeniem.
- **Uwaga — powrót:** w pętli 0 → 1 → 0 dłonie wracają do stóp, a w źródle (ACE #254) stopy dochodzą do dłoni. Brakuje też startu ze stania.
- **Uwaga — podpór:** dłonie 21,5 cm przed barkami (źródło: „push-up position”).

## Fazy i nałożenie (Cat-Cow, Inchworm, rozciągania statyczne)

- **Brak tekstów faz.** Typ `PhaseName` w `lib/figures/v2/anim.ts` ma tylko: Podciąganie, Opuszczanie, Wypychanie, Wstawanie, Podnoszenie, Prostowanie, Pauza. W `lib/i18n.en.ts` są klucze tylko dla nich. `DATA_UI` w `lib/figures/v2/poseData.ts` ma wpis tylko dla `pull_up`.
  - Dla Cat-Cow i Inchworm nie ma więc żadnych nazw faz ani w t(), ani w kodzie.
  - Nazwy w rodzaju „Koci grzbiet / Wygięcie” albo „Wyjście w podpór / Powrót” trzeba dodać jako klucze t() ze słownikiem `lib/i18n.en.ts` (i 35 języków) w kroku nałożenia.
  - Gdyby rodzinę nałożono przez sam wpis `DATA_UI` z istniejącymi nazwami, licznik pokazałby błędne „Opuszczanie / Wstawanie”.
  - Waga ŚREDNIE (dziś niewyświetlane), warunek nałożenia.
- **16 rozciągań statycznych** (`poza_nieruchoma`, klatki identyczne) przy nałożeniu musi trafić do `ISOMETRIC` (poseData.ts; dziś tylko Dead Hang), żeby były pozą statyczną bez pętli i bez licznika faz.
  - Proponuję test, który sprawdza, że każde ćwiczenie z regułą `szkielet_nieruchomy` jest w `ISOMETRIC`.

## Wyjątki bez animacji (`data/zrodla/figury-wyjatki.json` na gałęzi)

Wyjątki nowe w tej gałęzi: 2 całe rodziny i 40 ćwiczeń.
Sprawdziłem, czy każdy ma powód i czy powód zgadza się z decyzją właściciela 27.10 („bez przeczytanego źródła techniki → bez animacji”) oraz z `figury-sens.json`.

| Wyjątek | Powód zgodny z decyzją? | Uwagi |
|---|---|---|
| rodzina `neck` (5 ćwiczeń: Isometric Neck ×2, Lying Neck Extension/Flexion, Neck Harness Extension) | tak | W `figury-sens.json` wszystkie mają „nie badane”. Trzy ćwiczenia z „neck” w nazwie (wyciskania i ściąganie zza karku) są już przeniesione `OVERRIDES` (families.ts:135), więc ich powód „ćwiczenie szyi” ich nie dotyczy. Chin To Chest i Side Neck są poprawnie wyłączone z rodziny `neck` (families.ts:81) i mają źródła. |
| rodzina `foam_roll` | tak dla 10 ćwiczeń SMR | **Wrist Roller (NISKIE):** reguła rodziny (families.ts:82, `'wrist roller'`) wciąga do `foam_roll` ćwiczenie siłowe przedramion (katalog: wzorzec `isolation`, mięśnie `forearms`). Powód „brak źródła techniki rolowania (położenie wałka…)” go nie dotyczy. Właściwa rodzina to `forearm` (families.ts:115), a właściwy powód: „brak stawu nadgarstka w kontrakcie, brak źródła” (tak mówi już `figury-sens.json`). Teoretyczny skutek: gdy `foam_roll` dostanie źródła, Wrist Roller trafi do złej rodziny. |
| 27 ćwiczeń `mobility_stand` (6 rozciągań bez źródła pozycji, 13 dynamicznych z regułą „z nazwy”, 3 z analogii, 4 „otwarte”, Standing Pelvic Tilt) | tak | Zgodne z `otwarte` i `otwarte_czesciowo` w `figury-sens.json`. Pelvic Tilt łączy decyzję z 26.10 (ruch niewidoczny) z 27.10, co jest poprawne. |
| 12 ćwiczeń `mobility_floor` (6 bez źródła pozycji, 2 z analogii, Seated Rotation z konwencji, Downward Facing Balance, Peroneals i Posterior Tibialis) + IT Band (wiersz niżej) | tak | Peroneals i Posterior Tibialis: istota poza stopniami swobody, a do tego brak źródła. Poprawnie. |
| IT Band and Glute Stretch | tak, ale **inny rodzaj** | Powód to ograniczenie modelu (12 prób), nie brak źródła (źródło ACE #232 jest). Jest zgodny z praktyką (jak Inverted Row), ale nie z decyzją 27.10. Ćwiczenie trzeba ponowić po rozszerzeniu modelu. |

- **Luka w drugą stronę (ważniejsza):** ta sama decyzja powinna objąć elementy pozycji w **animowanych** pozach, które nie wynikają z cytowanych źródeł:
  - Chin To Chest: siad i dłonie na głowie;
  - Supine Hamstring: dłonie zamiast ściany;
  - Standing Gastrocnemius: pięta na skrzyni, palce w górę;
  - Overhead Triceps: chwyt ręki pomocniczej;
  - Side Neck: ręka dociągająca.
- Albo badacz dopisze źródło wariantu, albo poza wraca do wariantu ze źródła, albo ćwiczenie dostaje wyjątek.
- Mechanizm: reguła sensu `chwyt`/`podpór` opisująca, gdzie są dłonie, wymagana dla każdej pozy rozciągania. Brak reguły oznacza, że ręce stoją swobodnie wzdłuż ciała albo ćwiczenie dostaje wyjątek.

## Szczelność reguł: czego zabrakło (propozycje mechanizmów)

1. **Gastrocnemius / Seated Calf:** reguła „kostka rozciąganej nogi ≥ +10° (zgięcie grzbietowe)” dla rozciągań łydki, czyli wszystkich z `calves` w nazwie lub w mięśniach. Do tego reguła „stopa podparta”: palce na sprzęcie albo na podłodze, nie w powietrzu (`nic_nie_wisi` dla stóp poza leżeniem).
2. **Cat-Cow:** reguła sprzężenia „pochylenie głowy względem tułowia rośnie razem ze zgięciem kręgosłupa” (znak różnicy głowa−tułów taki sam jak znak zmiany zgięcia).
3. **Child's Pose:** reguła „pośladki przy piętach”, czyli odległość miednica–pięta ≤ X cm, a nie sam kąt kolana (`posladki_na_pietach` sprawdza tylko kolano ≥ 120°). Do tego „głowa przy podłodze” (najniższy punkt głowy ≤ ok. 5 cm).
4. **Chin To Chest / Side-Lying Quad:** reguła widoczności cechy w rzucie głównym (punkt cechy, np. broda albo pięta, nie może być zasłonięty kształtem bliższej kończyny lub tułowia). Do tego reguła orientacji stopy wobec goleni w pozach nie-pionowych.
5. **Overhead Triceps:** reguła „chwyt ręki pomocniczej przy łokciu drugiej ręki (≤ 8 cm)” i „łokieć nie przed twarzą”.
6. **Inchworm:** reguła styku „punkt podparcia stopy (palce) nie przesuwa się > 2 cm, dopóki y ≈ 0” (taka sama jak dla dłoni w podporze).

## Pliki

- Podglądy: `docs/przekazanie/notatki/podglady-1-1/mobility_stand/`, `.../mobility_floor/` (origin/przekazanie-konta).
- Pozy: `lib/figures/v2/poses/mobility_stand.json`, `mobility_floor.json` (origin/rodziny-mobilnosc @ c3913afd).
- Wyjątki: `data/zrodla/figury-wyjatki.json`; reguły: `data/zrodla/figury-sens.json` (ta sama gałąź).
