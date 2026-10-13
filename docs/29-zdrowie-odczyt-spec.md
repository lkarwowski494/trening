# 29. Apple Zdrowie — odczyt danych (wydanie 0.16.0) — specyfikacja (12.10.2026)

Stan: **projekt do decyzji właściciela, bez kodu.** Autor: agent (rola analityk produktu). Realizuje decyzje z `docs/18-przekazanie.md`:
- 11.10.2026 „Apple Zdrowie (pkt 9)” — etapy; dane czytane na bieżąco, nie zapisywane;
- 11.10.2026 „trening z zegarka (pkt 9, etap 2) — A”;
- 11.10.2026 „kolejność wydań natywnych — A”;
- 12.10.2026 „backlog — A: 0.15 Health biblioteka, 0.16 Health odczyt, 0.17 subskrypcja”.

Uwzględnia też starsze decyzje z `docs/18-archiwum-do-11.10.md` (07.10: kalorie A, ocena wysiłku; 08.10: pauzy jako przedziały), backlog „Wydanie Health” w `docs/21` oraz rozpoznanie biblioteki 16.x w `docs/28`. Zakłada, że 0.15.0 (biblioteka 8 → 16, zapis do Zdrowia jak dziś) jest wydane i sprawdzone na telefonie.

**Cel:** użytkownik z iPhone'em (i ewentualnie zegarkiem) widzi w Treningu to, co Apple Zdrowie już o nim wie: kroki i inne aktywności w planie dnia i tygodnia, a przy sesji siłowej tętno i aktywne kcal z zegarka. Jest przy tym jeden wpis treningu w Zdrowiu zamiast dwóch. Dane ze Zdrowia są tylko wyświetlane — nie trafiają do danych aplikacji, kopii ani CSV.

## Decyzje właściciela (12.10.2026, po specyfikacji)

P1 — A (etapy 1–2 + tętno i aktywne kcal; pauzy i ocena wysiłku do backlogu). P2 — A (osobny przełącznik odczytu, pole opcjonalne).
**P3 — wariant właściciela:** linia pod „Ten tydzień” ze **średnią dzienną kroków z ostatnich 7 dni** (nie suma tygodnia) + liczba innych aktywności.
P4 — A (tylko siłowe). P5 — A (kcal tylko z dopasowanego treningu z zegarka). P6 — C (ocena wysiłku: nic w 0.16; research 34).
P7 — A (masa ciała później, z pomiarami). **P8 — wariant właściciela:** na razie bez kategorii — każda aktywność jako „Inna aktywność” / „Inne aktywności”.
P9 — A (zawsze kcal). P10 — A (odczyt Zdrowia bez limitu subskrypcji). **P11 — B:** znacznik `Workout.live` wchodzi razem z 0.16.
Decyzje mają pierwszeństwo przed opisem wariantów niżej.

## 0. Rozbieżność zakresu — do rozstrzygnięcia najpierw (P1)

| Źródło | Co miało wejść do „wydania Health” |
|---|---|
| Decyzje 11.10 i 12.10 (najnowsze) | Etap 1: aktywności i kroki z Health, tylko do odczytu, w kalendarzu i tygodniu, bez liczenia do celów. Etap 2: trening siłowy z zegarka pokrywający się z sesją → łączenie automatyczne (tętno, aktywne kcal w szczegółach sesji), bez własnej kopii w Health. Etap 3 (cardio, cel kroków) — później, po badaczu. |
| Backlog 07–08.10 (`docs/21` w. 137) | Aktywne kcal „w oknie treningu”; ocena wysiłku (`workoutEffortScore`, przeliczenie RPE → ocena **[OTWARTE — badacz]**); prawdziwe zdarzenia pauzy z `Workout.pauses`; masa ciała i pomiary ciała. |

Co wynika ze sprawdzenia biblioteki (pliki API na gałęzi master, przeczytane 12.10.2026; zgodność z 16.1.0 **[DO SPRAWDZENIA — programista]**):
- **Pauzy:** zapis zdarzeń pauzy jest niewykonalny tą biblioteką. `saveWorkoutSample(type, quantities, start, end, totals?, metadata?)` nie przyjmuje zdarzeń, a w `WorkoutsModule` są tylko 4 funkcje, bez „buildera”. Przy łączeniu z zegarkiem prawdziwe pauzy i tak ma trening zegarka. Własna kopia zostaje z przesuniętym startem (decyzja 08.10).
- **Ocena wysiłku — zapis:** w API nie ma funkcji wiążącej ocenę z treningiem (w HealthKit robi to osobna metoda). Sam zapis próbki bez powiązania prawdopodobnie nie pojawi się przy treningu **[DO SPRAWDZENIA — badacz/programista]**.
- **Ocena wysiłku — odczyt z zegarka:** typ próbki istnieje (iOS 18+). Czy filtr `workout` zwraca oceny powiązane z treningiem — **[DO SPRAWDZENIA — programista]**.
- **Masa ciała:** odczyt możliwy (`queryQuantitySamples('HKQuantityTypeIdentifierBodyMass', …)`). Użycie jej do e1RM kłóci się z decyzją „dane z Health nie trafiają do danych aplikacji” (rozdz. 5.10).
- **Pomiary ciała:** w aplikacji nie ma takiej funkcji. Własne wpisy wymagałyby nowych danych w modelu.

**P1 — zakres 0.16:**

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| **A. Etapy 1–2 + kcal i tętno** | Kroki i aktywności w dniu i tygodniu; dopasowanie treningu z zegarka; tętno i aktywne kcal w szczegółach sesji. Do backlogu z powodem: zapis pauz (niewykonalny), zapis oceny wysiłku (niewykonalny, mapowanie otwarte), masa i pomiary ciała. | Zgodne z decyzjami 11.10; jeden spójny temat; najmniej uprawnień do opisania przed Apple | Masa ciała z Health czeka dłużej |
| B. A + masa ciała do wglądu | Jak A, plus w Postępach → „Masa ciała” linia „W Apple Zdrowie: 82,4 kg, 10.10” (bez wpływu na e1RM) | Mały koszt, korzysta z wagi łazienkowej | Kolejne uprawnienie i tekst; dwie masy na ekranie mogą mylić |
| C. Zakres z backlogu zamiast etapu 1 | kcal, ocena wysiłku (odczyt), masa i pomiary; bez kroków i aktywności | Bliżej pomysłu z 07.10 | Zmienia decyzję 11.10; pomiary ciała wymagają zmiany danych; pauzy i zapis oceny i tak odpadają |

**Rekomendacja: A.** Masa ciała jako osobna pozycja (P7), pomiary ciała razem z własną funkcją pomiarów w osobnym wydaniu.

Dalsza część opisuje wariant A. Elementy opcjonalne są oznaczone numerem pytania.

## 1. Zakres i poza zakresem

**W zakresie (wariant A):**
1. Włączenie odczytu i prośba o zgodę (P2).
2. **Etap 1:** w panelu dnia (zakładka Plan → dzień w kalendarzu) liczba kroków i lista innych aktywności z Health (rodzaj, czas trwania, ewentualnie dystans). W „Ten tydzień” suma kroków i liczba innych aktywności (P3). Bez celów, bez liczenia do serii, objętości czy planu.
3. **Etap 2:** dopasowanie treningu z zegarka do sesji (reguła — rozdz. 5.7, P4). W szczegółach sesji tętno średnie i maksymalne oraz aktywne kcal z dopasowanego treningu. Bez dubla w Health: aplikacja nie zapisuje kopii, gdy trening z zegarka już jest, a gdy zegarek zsynchronizuje się później — usuwa swoją kopię.
4. Nowe opisy uprawnień (35 języków), `site/privacy.html` (PL/EN), formularz prywatności w App Store Connect, wpis „Co nowego”.

**Poza zakresem:**

| Pozycja | Dlaczego |
|---|---|
| Zapis zdarzeń pauzy | Niewykonalne w bibliotece |
| Zapis oceny wysiłku i przeliczenie RPE → ocena | Brak funkcji powiązania; mapowanie **[OTWARTE — badacz]** |
| Odczyt oceny wysiłku z zegarka | P6 — rekomendacja: backlog |
| Pomiary ciała | Nowa funkcja z danymi — osobne wydanie |
| Masa ciała | P7 |
| Aktywności jako cardio w statystykach, cel kroków | Etap 3, po badaczu |
| Strefy tętna i jakakolwiek ocena wartości („dobrze/źle”) | Twierdzenia merytoryczne bez źródeł |
| Dopasowanie aktywności cardio | P4 |
| Odczyt w tle, obserwatory, kotwice | `docs/28`: wystarczy zapytanie przy otwarciu ekranu |
| Import danych z Health do historii | Odrzucone 11.10 (B) |
| Nazwy aplikacji lub urządzeń źródłowych | CLAUDE.md: nazwy innych firm nie w tekstach aplikacji; domyślnie pokazujemy tylko „Apple Health” |

## 2. Jak to działa dziś (kod, 12.10.2026)

- **`lib/health.ts`:** tylko zapis. `ensureAuthorization()` prosi o zapis `HKWorkoutTypeIdentifier`. `saveWorkout()` zapisuje trening z `HKMetadataKeySyncIdentifier = w.id`, start przesunięty o pauzy, metadane `Workout`, `VolumeKg`, `Sets`. Ponowienia: `healthPending`, `retryHealth()` przy starcie i powrocie z tła (`app/_layout.tsx`, w. 41). Moduł ładowany leniwie; brak modułu = „niedostępne”.
- **Ustawienia (`app/more/settings.tsx`, w. 54–58), sekcja „Dane i kopie”:** przełącznik „Zapisuj zakończone treningi do Apple Health” (`settings.healthSync`, domyślnie `false`) z alertem przy braku zgody, licznik oczekujących i „Ponów teraz”.
- **Szczegóły sesji (`app/history/[id].tsx`, w. 30–33):** linia z czasem, objętością i miejscem; „Nie zapisano jeszcze w Apple Health…”.
- **Lista sesji (`app/(tabs)/history.tsx`, w. 48):** przy usuwaniu sesji z `healthUUID` pojawia się zdanie „Kopia w Apple Health zostanie — usuniesz ją w aplikacji Zdrowie.”
- **Panel dnia (`components/DayPanel.tsx`):** linie stanu dnia (`lines`) i najwyżej 3 akcje. „Ten tydzień” to `components/Dashboard.tsx` → `WeekStats` (4 kafelki, `testID="week-tiles"`). Pasek tygodnia to `components/TodayPlan.tsx` (`week-strip`).
- **Masa ciała:** `app/more/bodymass.tsx`, dane `BodyMassEntry` w stanie i kopii; e1RM z `bodyMassOn`.
- **Opisy uprawnień:** `app.json` (PL: „Trening nie odczytuje danych zdrowotnych…”) i `locales/<kod>.json` w 35 językach (EN: „Training does not read health data…”). `scripts/verify-native.mjs` pilnuje obu kluczy.
- **`site/privacy.html` (w. 20, 37–40, 81–84):** „Aplikacja nie odczytuje żadnych danych z Apple Health”.
- **Kopia po imporcie:** `lib/backup.ts` → `recheckHealthAfterImport()` (zapis nie włącza się po cichu).

## 3. Decyzje wejściowe (nie zmieniane tutaj)

| Pozycja | Wartość | Źródło |
|---|---|---|
| Dane z Health | Czytane na bieżąco, **nie zapisywane** w danych aplikacji ani w kopii | docs/18, 11.10 (2) A |
| Etapy | 1: aktywności i kroki do odczytu (bez celów); 2: dopasowanie z zegarka; 3: cardio i cel kroków po badaczu | docs/18, 11.10 (1) A |
| Trening z zegarka | Łączenie automatyczne; tętno i kcal w szczegółach; bez własnej kopii; usunięcie kopii po późniejszej synchronizacji | docs/18, 11.10 etap 2 A |
| Kolejność wydań | 0.15 biblioteka → 0.16 odczyt → 0.17 subskrypcja | docs/18, 11.10 i 12.10 |
| Kcal | Odczyt z Health, bez własnego szacunku MET | archiwum 07.10, A |
| Porady medyczne | Brak; tętno bez interpretacji | CLAUDE.md |

## 4. Uprawnienia odczytu (lista typów)

Prośba tylko o typy faktycznie używane w wybranym zakresie. Prośba o nieużywane typy to ryzyko odrzucenia **[DO WERYFIKACJI — badacz, wytyczne 2.5.1/5.1.1]**. Lista w kodzie w jednym miejscu (stała w `lib/`), iterowana w teście macierzowym.

| Typ | Po co | Wariant |
|---|---|---|
| `HKQuantityTypeIdentifierStepCount` | Kroki dnia i tygodnia | A |
| `HKWorkoutTypeIdentifier` (odczyt) | Inne aktywności; trening z zegarka | A |
| `HKQuantityTypeIdentifierHeartRate` | Tętno w szczegółach sesji | A |
| `HKQuantityTypeIdentifierActiveEnergyBurned` | Aktywne kcal | A |
| `HKQuantityTypeIdentifierDistanceWalkingRunning` itp. | Dystans aktywności — tylko jeśli `totalDistance` treningu nie wystarcza **[DO SPRAWDZENIA — programista]** | A, opcjonalnie |
| `HKQuantityTypeIdentifierBodyMass` | Masa do wglądu | P7 = B |
| `HKQuantityTypeIdentifierWorkoutEffortScore` | Ocena z zegarka | P6 = A |

Zapis (`toShare`): bez zmian (`HKWorkoutTypeIdentifier`). Usunięcie własnej kopii korzysta z tej samej zgody na zapis (HealthKit pozwala usuwać tylko obiekty zapisane przez aplikację **[DO SPRAWDZENIA — programista]**).

## 5. Przepływy

### 5.1 Włączenie odczytu (pierwszy raz) — P2
Wariant rekomendowany A (Ustawienia):
1. Ustawienia → sekcja „Dane i kopie” (albo nowa sekcja „Apple Health” z oboma przełącznikami — wybór programisty, bez nowych pytań).
2. Przełącznik „Pokazuj dane z Apple Health” z opisem „Kroki, inne aktywności oraz tętno i kcal z zegarka — tylko do wglądu, dane zostają w Zdrowiu”.
3. Włączenie → `isHealthDataAvailable()`. Gdy `false` → alert „Apple Health niedostępne” i przełącznik zostaje wyłączony.
4. `requestAuthorization({ toRead: [typy z rozdz. 4], toShare: [] })` → systemowy arkusz Zdrowia. Gdy zapis był już włączony, arkusz pokaże tylko nowe typy.
5. Po zamknięciu arkusza przełącznik włączony, niezależnie od wyborów w arkuszu (iOS nie mówi aplikacji, czy odmówiono odczytu — `docs/28`). Krótka informacja: „Gotowe. Jeśli dane się nie pokażą, sprawdź dostęp w aplikacji Zdrowie: profil → Aplikacje → {app}.”
6. Wyłączenie przełącznika → aplikacja przestaje pytać Health. Zgoda w iOS zostaje — tekst pod przełącznikiem: „Zgodę cofniesz w aplikacji Zdrowie”.

**P2 — sposób włączenia:**

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| **A. Osobny przełącznik odczytu** (nowe pole `settings.healthRead?: true`) | Jak wyżej | Pełna kontrola w aplikacji; wzór jak zapis i powiadomienia; odczyt niezależny od zapisu | **Zmiana modelu danych** (pole opcjonalne, bez podnoszenia `SCHEMA_VERSION`, precedens `effortScale`/`doneEarly`); 0.16 nie aktualizuje SDK, więc reguła CLAUDE.md jej nie zabrania |
| B. Bez własnego pola | Przycisk „Połącz z Apple Health” do pierwszej prośby; stan z `getRequestStatusForAuthorization`; wyłączenie tylko w aplikacji Zdrowie | Zero zmian danych | Brak wyłącznika w aplikacji; mniej czytelne |
| C. Jeden przełącznik na odczyt i zapis (dawne `healthSync`) | „Połącz z Apple Health” | Najprostsze UI | Wymusza zapis u kogoś, kto chce tylko czytać; obecni użytkownicy z włączonym zapisem dostają nowy arkusz bez pytania |

**Rekomendacja: A.**

### 5.2 Odmowa lub częściowa zgoda
- Użytkownik odznacza w arkuszu wszystkie albo część typów → aplikacja tego nie wie. Zapytania zwracają pusty wynik, a ekrany pokazują stan „brak danych” (rozdz. 7), bez komunikatu o błędzie.
- Tekst stanu pustego zawsze neutralny, z drogą do zgody (nie twierdzimy „odmówiłeś”).
- Odmowa odczytu treningów przy włączonym zapisie: aplikacja widzi wtedy tylko własne wpisy (do potwierdzenia — rozdz. 15), dopasowanie z zegarka nie działa, a własna kopia zostaje. To poprawne zachowanie — nic nie usuwamy bez pewności.

### 5.3 Brak Zdrowia
- `isHealthDataAvailable() === false` (urządzenie bez HealthKit) albo brak modułu (Expo Go, testy) → przełącznik pokazuje alert „Apple Health niedostępne”. Nigdzie indziej nie pokazujemy elementów Health. `supportsTablet: false`, więc iPad praktycznie nie występuje.
- Moduł natywny rzuca błąd przy zapytaniu → element Health znika (stan „błąd” = jak brak danych), bez alertu, bez logów z danymi (repo i CI są publiczne).

### 5.4 Offline i opóźniona synchronizacja zegarka
- HealthKit działa lokalnie, bez internetu. Tryb samolotowy nie zmienia zachowania.
- Zegarek bez połączenia z telefonem → trening z zegarka pojawi się w Zdrowiu później. Aplikacja pyta ponownie przy każdym otwarciu ekranu i przy powrocie z tła. Przez ten czas sesja pokazuje się bez tętna i kcal, a własna kopia jest w Zdrowiu (przepływ 5.7).
- Telefon zablokowany: aplikacja nie czyta w tle (`background: false`), więc nie dotyczy.

### 5.5 Etap 1 — dzień w zakładce Plan
1. Użytkownik wybiera dzień w kalendarzu → `DayPanel`.
2. Pod liniami stanu dnia (po „Zrobione…”, „Zaplanowany…”) pojawia się blok „Apple Health”:
   - „Kroki: 8 432” — suma dnia (`queryStatisticsForQuantity` lub kolekcja dzienna, `cumulativeSum`). Deduplikację iPhone + zegarek robi HealthKit w statystykach **[DO SPRAWDZENIA na danych — programista/właściciel]**.
   - Linie aktywności: „Bieg · 32 min · 5,2 km”, „Spacer · 45 min” — treningi z Health tego dnia, **bez** własnych wpisów aplikacji i **bez** treningów dopasowanych do sesji (te są przy sesji). Nazwa rodzaju — P8.
   - Brak danych → blok niewidoczny albo jedna linia „Brak danych z Apple Health” (rozdz. 7).
3. Dzień = dzień kalendarzowy w strefie telefonu (granice dnia jak `dayKeyOf`). Aktywność przechodząca przez północ liczy się do dnia startu.
4. Dni przyszłe: bloku nie ma.
5. Bez akcji i stuknięć (tylko do wglądu). Bez wpływu na `dayStatus`, cele, Progresję i deload.

### 5.6 Etap 1 — tydzień — P3

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| **A. Jedna linia pod kafelkami „Ten tydzień”** | „Apple Health: 54 210 kroków · 2 inne aktywności” (bieżący tydzień, od poniedziałku jak `WeekStats`) | Nie miesza danych aplikacji z Health w kafelkach; mało miejsca | Mniej widoczne |
| B. Piąty i szósty kafelek „Kroki”, „Inne aktywności” | Kafelki obok treningów, serii itd. | Widoczne | Kafelki liczą „treningi” wg aplikacji — ryzyko pomylenia z celami; zawijanie na 320 pt |
| C. Znacznik w pasku tygodnia (`week-strip`) przy dniach z inną aktywnością | Mała ikona | Szybki rzut oka | Nowy znacznik do opisania w VoiceOver i do odróżnienia od znaczników planu |

**Rekomendacja: A.** C ewentualnie w etapie 3.

### 5.7 Etap 2 — trening z zegarka

**Reguła dopasowania** (czysta funkcja w `lib/`, testowalna bez HealthKit):
- Sesja `w`: zakończona, z godziną (nie `noClock`), przedział `[w.startedAt, w.finishedAt]`.
- Trening z Health `h`: źródło inne niż aplikacja (filtr `sources`/`NOT` z `currentAppSource()`; dodatkowo pomiń `h` z `HKMetadataKeySyncIdentifier` równym id dowolnej naszej sesji). Rodzaj z listy `WATCH_MATCH_TYPES` (P4).
- Dopasowanie = przedziały mają część wspólną dłuższą niż 0 (stykanie się końcami to nie dopasowanie). Nie wprowadzam progu procentowego — byłaby to liczba bez źródła. Jeśli właściciel chce progu, to jego decyzja produktowa (P4).
- Wiele kandydatów: para z najdłuższą częścią wspólną; remis → wcześniejszy start `h`. Jeden `h` najwyżej do jednej sesji (przydział zachłanny od najdłuższych części wspólnych). Wynik deterministyczny.

**P4 — które treningi z zegarka łączyć:**

| Opcja | Za | Przeciw |
|---|---|---|
| **A. Tylko siłowe** (`traditionalStrength`, `functionalStrength`) — dosłownie decyzja 11.10 | Najmniej błędnych połączeń | HIIT czy „core” z zegarka nie połączy się z sesją |
| B. Siłowe + pokrewne (np. `highIntensityIntervalTraining`, `crossTraining`, `coreTraining`) | Więcej trafień | Lista do ustalenia; więcej pomyłek |
| C. Wg rodzaju sesji (`workoutActivityType(w)`): sesja cardio „bieg” łączy się z biegiem z zegarka itd. | Spójne z zapisem | Wykracza poza decyzję 11.10 (cardio = etap 3) |

**Rekomendacja: A.**

**Szczegóły sesji** (`app/history/[id].tsx`, pod linią czasu i objętości):
- „Apple Health (zegarek): tętno śr. 128 /min, maks. 161 /min · 312 kcal aktywne”. Wartości z `WorkoutProxy.getStatistic('HKQuantityTypeIdentifierHeartRate')` (średnia, maksimum) i `getStatistic('HKQuantityTypeIdentifierActiveEnergyBurned')` albo `totalEnergyBurned`. Kształt odpowiedzi i jednostki **[DO SPRAWDZENIA — programista]**.
- Czas trwania sesji pozostaje z aplikacji (pauzy wg decyzji 08.10). Czasu z zegarka nie pokazujemy (dwa różne czasy mylą).
- Bez interpretacji („strefa”, „intensywność”) — zasada merytoryczna.
- Ładowanie: miejsce zarezerwowane jedną linią „Apple Health…” (bez skoku układu), potem wartości albo nic.
- `proxy.dispose()` po odczycie (`docs/28`).

**Bez dubla w Zdrowiu** (decyzja 11.10, etap 2 A) — działa tylko, gdy włączony jest zapis (`healthSync`) i odczyt:
1. „Zakończ” → przed zapisem (`syncAfterFinish`) jedno zapytanie o dopasowany trening z zegarka. Jest → **nie zapisujemy kopii**: `healthPending` zdjęty, `healthUUID = 'watch'` (nowa wartość istniejącego pola tekstowego, nie nowe pole; stara wersja aplikacji potraktuje to jako „zapisane” — zgodne). Brak → zapis jak dziś. To typowy przypadek, bo zegarek zwykle kończy się później niż „Zakończ”.
2. Start aplikacji i powrót z tła (po `retryHealth`): dla sesji z własną kopią (`healthUUID` ≠ `'watch'`, ≠ null), które mają teraz dopasowany trening z zegarka → `deleteObjects('HKWorkoutTypeIdentifier', filtr: metadane HKMetadataKeySyncIdentifier = w.id ORAZ źródło = ta aplikacja)` → po sukcesie `healthUUID = 'watch'`. Filtr zawsze z oboma warunkami — **nigdy nie usuwamy cudzego wpisu** (niezmiennik testowy). Dokładny kształt filtra w API **[DO SPRAWDZENIA — programista]**.
3. Zakres sprawdzania: bez okna czasowego (jedno zapytanie o własne treningi w Health + jedno o treningi siłowe innych źródeł w tym samym przedziale, dopasowanie w JS). Jeśli pomiar na telefonie właściciela z pełną historią pokaże zauważalny czas, okno ustala właściciel. Liczby nie zgadujemy.
4. Kolejność „zapis → usunięcie” zostawia przez chwilę dwa wpisy w Zdrowiu. Kcal się nie dublują (nasza kopia nie ma energii). Czy dubluje się czas w kręgu „Ćwiczenia” — **[DO SPRAWDZENIA — badacz/telefon]**.
5. Tekst przy usuwaniu sesji z historii dla `healthUUID = 'watch'`: „Trening z zegarka w Apple Health zostanie — usuniesz go w aplikacji Zdrowie.” Brzmienie **[DO WYJAŚNIENIA]** przy tłumaczeniu.

### 5.8 Kcal bez treningu z zegarka — P5

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| **A. Tylko z dopasowanego treningu z zegarka** | Bez zegarka brak linii kcal | Jedno jasne źródło; zgodne z 11.10 | Użytkownik z zegarkiem bez włączonego treningu nic nie widzi |
| B. Zapasowo suma `ActiveEnergyBurned` w czasie sesji bez pauz (`Workout.pauses`) — decyzja 07.10 A „w oknie treningu” | Działa z zegarkiem noszonym bez treningu | Z samym iPhone'em w szafce wartości bliskie zera mogą wprowadzać w błąd; dwa różne pochodzenia liczby do opisania |

**Rekomendacja: A** (decyzja 11.10 jest nowsza i węższa). Wariant B — ewentualnie w etapie 3.

### 5.9 Ocena wysiłku — P6

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| A. Odczyt oceny z zegarka do szczegółów sesji (iOS 18+) | „Ocena wysiłku (zegarek): 7” | Wartość wpisana przez użytkownika na zegarku | API niepewne; dodatkowe uprawnienie; iOS 18+ vs minimalna wersja aplikacji **[DO WYJAŚNIENIA]** |
| B. Zapis przeliczonego RPE | — | — | Niewykonalne w bibliotece; mapowanie **[OTWARTE — badacz]** |
| **C. Nic w 0.16 (backlog z powodem)** | — | Mniejsze wydanie | Funkcja z 07.10 dalej czeka |

**Rekomendacja: C.** A ewentualnie, gdy programista potwierdzi API.

### 5.10 Masa ciała — P7

| Opcja | Na czym polega | Za | Przeciw |
|---|---|---|---|
| **A. Backlog** (razem z pomiarami ciała) | — | 0.16 skupione; jedna przemyślana funkcja „pomiary” później | Dłużej ręczny wpis |
| B. Do wglądu | Postępy → „Masa ciała” i ekran pomiarów: „W Apple Zdrowie: 82,4 kg (10.10)”; e1RM liczy się nadal tylko z własnych pomiarów | Mały koszt; bez sprzeczności z decyzją 11.10 | Dwie masy na ekranie; kolejne uprawnienie |
| C. „Dodaj do moich pomiarów” (kopiowanie wartości na stuknięcie) | Wartość staje się wpisem użytkownika | Wygodne; e1RM z wagi łazienkowej | Dane z HealthKit trafiają do kopii (Pliki/iCloud Drive) — sprzeczne z decyzją 11.10 (2) i ryzyko 5.1.3 **[DO WERYFIKACJI — badacz]** |

**Rekomendacja: A.** C odradzam bez opinii badacza.

## 6. Ekrany i miejsca w UI

| Miejsce | Plik | Zmiana |
|---|---|---|
| Ustawienia | `app/more/settings.tsx` | Przełącznik odczytu (P2), opis, informacja po zgodzie; teksty przełącznika zapisu bez zmian |
| Plan → panel dnia | `components/DayPanel.tsx` | Blok „Apple Health”: kroki i aktywności (5.5) |
| Trening → „Ten tydzień” | `components/Dashboard.tsx` (`WeekStats`) | Linia tygodnia (P3 = A) |
| Szczegóły sesji | `app/history/[id].tsx` | Tętno i kcal z zegarka (5.7) |
| Lista sesji — usuwanie | `app/(tabs)/history.tsx` | Tekst dla `healthUUID = 'watch'` |
| Start i powrót z tła | `app/_layout.tsx` | Po `retryHealth()` — usuwanie zbędnych kopii (5.7 pkt 2) |
| Logika | `lib/health.ts` + nowy moduł (np. `lib/healthRead.ts`) | Zapytania, reguła dopasowania, formatowanie; czyste funkcje bez HealthKit |
| Kopia/import | `lib/backup.ts` | Przy imporcie z `healthRead` → prośba o zgodę jak `recheckHealthAfterImport` (odczytu nie da się sprawdzić — pole zostaje, gdy moduł i Health są dostępne) |
| Opisy uprawnień | `app.json`, `locales/*.json` (35) | Rozdz. 8 |
| Polityka prywatności | `site/privacy.html` (w. 20, 37–40, 81–84) | Rozdz. 9 |
| „Co nowego” | Wpis 0.16.0 | 35 języków |

Nowych tras (`app/`) nie ma.

## 7. Stany

| Stan | Ustawienia | Panel dnia / tydzień | Szczegóły sesji |
|---|---|---|---|
| Odczyt wyłączony (domyślnie) | Przełącznik wyłączony | Bez bloku Health (ekran jak dziś) | Jak dziś |
| Pierwszy raz po aktualizacji | Jak wyżej; informacja tylko we „Co nowego” | — | — |
| Ładowanie | — | Zarezerwowana linia „Apple Health…”, bez skoku | Jak obok |
| Brak danych / odmowa (nie do odróżnienia) | — | Jedna linia „Brak danych z Apple Health dla tego dnia” z podpowiedzią drogi do zgody (tylko w panelu dnia; w tygodniu linia znika) | Nic (sesja bez zegarka to normalny przypadek) |
| Dane częściowe (kroki są, treningów brak) | — | Pokazujemy to, co jest | — |
| Zegarek jeszcze niezsynchronizowany | — | Brak aktywności | Brak linii; pojawi się po powrocie z tła |
| Błąd zapytania / brak modułu | Alert tylko przy włączaniu | Jak „brak danych”, bez alertu | Nic |
| HealthKit niedostępny | Alert „Apple Health niedostępne”, przełącznik wyłączony | — | — |
| Offline | Bez zmian (HealthKit lokalny) | Bez zmian | Bez zmian |
| Długi tekst | — | Rodzaj aktywności z naszej listy (P8), linie zawijają się; duża czcionka do `maxFontSizeMultiplier` jak sąsiednie linie; 320 pt bez obcinania liczb | Linia zawija się w dwie |
| Inny język | Wszystkie teksty przez `t()` i `lib/i18n.en.ts` + 35 słowników; liczby `toLocaleString(locale())`; dystans wg istniejącego formatu (`fmtDist`), energia — P9 | | |
| Ciemny wygląd | Kolory z `useTheme()`, bez nowych kolorów; kontrast jak `Muted` | | |
| VoiceOver | Przełącznik z etykietą i opisem | Blok jako jeden element: „Apple Health: kroki 8 432; bieg, 32 minuty, 5,2 kilometra” | „Z zegarka: tętno średnie 128 na minutę, maksymalne 161; 312 kilokalorii aktywnych” (jednostki słownie) |

**P8 — nazwy aktywności:**
- **A (rekomendacja):** kilka własnych kategorii — Bieg, Spacer, Rower, Pływanie, Trening siłowy, Inna aktywność. Lista w jednym miejscu, mapowanie rodzajów Health → kategoria.
- B: pełne nazwy ok. 75+ rodzajów × 35 języków. Plus: dokładne. Minus: tłumaczenie i przegląd ok. 2600 tekstów.

**P9 — jednostka energii:**
- **A (rekomendacja):** zawsze kcal.
- B: jednostka preferowana w Zdrowiu (`getPreferredUnits`; kJ np. w Australii). Plus: zgodne ze Zdrowiem. Minus: dodatkowe teksty i testy.

## 8. Teksty zgody (propozycja dla wariantu A; dokładne brzmienie zależy od P1/P6/P7)

`NSHealthShareUsageDescription`:
- PL: „Trening odczytuje z Apple Health kroki, treningi (także z zegarka), tętno i aktywne kalorie, żeby pokazać je w planie i przy sesjach. Dane zostają w telefonie — aplikacja ich nie wysyła ani nie zapisuje w kopii.”
- EN: „Training reads steps, workouts (including from your watch), heart rate and active energy from Apple Health to show them in your plan and next to your sessions. The data stays on your iPhone — the app doesn't send it anywhere or store it in backups.”

`NSHealthUpdateUsageDescription`:
- PL: „Trening zapisuje zakończone treningi — siłowe i cardio — do Apple Health. Gdy ten sam trening zapisze zegarek, aplikacja usuwa swoją kopię.”
- EN analogicznie.

Tłumaczenia: rola tłumacz, 35 plików `locales/*.json`. `verify-native.mjs` i test uprawnień: żaden język nie może zawierać zdania „nie odczytuje”/„does not read”.

## 9. Prywatność

- **Dane:** aplikacja nie zapisuje wartości z Health (kroki, tętno, kcal, rodzaje, czasy) w stanie, SQLite, kopii, CSV, „Co nowego” ani w logach. Wyjątek: znacznik `healthUUID = 'watch'` (informacja, że wpis jest w Zdrowiu, bez danych zdrowotnych). Pamięć podręczna tylko w RAM, czyszczona przy wyjściu do tła albo zabiciu aplikacji.
- **„Data Not Collected” w App Store:** wg mojego rozumienia „collect” u Apple oznacza przesłanie danych poza urządzenie, więc odczyt lokalny nie powinien tego zmieniać. To jednak **[DO SPRAWDZENIA — badacz]** (przeczytana strona Apple „App Privacy Details” z cytatem). Formularz w App Store Connect wypełnia właściciel.
- **`site/privacy.html` PL/EN:** zastąpić „Aplikacja nie odczytuje żadnych danych z Apple Health” opisem odczytu (jakie typy, po co, tylko na telefonie, bez kopii, wyłączenie w aplikacji i w Zdrowiu) i usuwania własnej kopii. Zaktualizować komentarz w w. 20.
- **Wytyczna 5.1.3** (dane zdrowotne nie do reklam, nie w iCloud): zgodność wynika z decyzji 11.10 (2). Aktualne brzmienie **[DO WERYFIKACJI — badacz]**.

## 10. Dane i model

- **Schemat:** wariant P2 = A dodaje pole opcjonalne `settings.healthRead?: true` — **ZMIANA MODELU DANYCH** (bez podnoszenia `SCHEMA_VERSION`; zgodność z regułą w `lib/backup.ts` **[DO WYJAŚNIENIA — programista]**, jak w docs/27 4.3). P2 = B/C — bez zmian.
- `healthUUID = 'watch'` to nowa wartość istniejącego pola, bez migracji.
- CLAUDE.md zabrania łączenia aktualizacji SDK ze zmianą schematu. SDK zmienia się w 0.15, nie w 0.16, więc konfliktu nie ma. Nowej zależności natywnej w 0.16 nie ma — tylko teksty w Info.plist (nowy build natywny i tak potrzebny).
- **Subskrypcja 0.17 (docs/27):** odczyt Health nie jest blokowany przez limit (docs/27 blokuje tylko start treningu na żywo) — P10. Pole `Workout.live` (docs/27 4.4, „wydanie N”) **nie** wchodzi do 0.16 — P11.
- „Wyczyść wszystkie dane” → `healthRead` wraca do domyślnego (wyłączony). W Zdrowiu nic się nie usuwa.

## 11. Przypadki brzegowe (z oceną realności wg CLAUDE.md pkt 6)

| # | Przypadek | Ocena | Zachowanie |
|---|---|---|---|
| B1 | Zegarek kończy trening kilka minut po „Zakończ” | realny | Zapis kopii → usunięcie przy następnym otwarciu (5.7) |
| B2 | Dwa treningi z zegarka w jednej sesji (np. rozgrzewka na bieżni + siłowy) | realny | Siłowy dopasowany (P4 = A); bieżnia jako aktywność dnia |
| B3 | Jeden trening z zegarka obejmuje dwie sesje | brzegowy | Przydział do sesji z najdłuższą częścią wspólną; druga bez danych |
| B4 | Trening wstecz z przybliżonymi godzinami | realny | Dopasowanie jak zwykle; przy braku części wspólnej nic |
| B5 | Import CSV bez godzin (`noClock`) | realny | Nie dopasowujemy |
| B6 | Edycja godzin sesji po dopasowaniu | brzegowy | Dopasowanie liczone na nowo przy otwarciu; własnej kopii po edycji nie dosyłamy (jak dziś); jeśli kopia była usunięta, a dopasowanie zniknęło — sesji nie ma w Zdrowiu (notatka, bez naprawy) |
| B7 | Użytkownik usuwa w Zdrowiu trening z zegarka po usunięciu naszej kopii | brzegowy | Sesja nie wraca do Zdrowia (nie wiemy o tym bez zapisu danych); notatka |
| B8 | Przywrócenie kopii sprzed usunięcia (`healthUUID` = UUID) | brzegowy, dotyczy danych | Przy otwarciu ponowne sprawdzenie; `deleteObjects` zwraca 0 → `'watch'`; bez duplikatów (`SyncIdentifier`) |
| B9 | Zmiana strefy czasowej / podróż | brzegowy | Sesje wg `tzOffsetMin`; kroki dnia wg strefy telefonu — możliwa różnica dnia; notatka |
| B10 | Odczyt wyłączony, zapis włączony | realny | Bez usuwania kopii (nie mamy jak sprawdzić) |
| B11 | Zapis wyłączony, odczyt włączony | realny | Dopasowanie i wyświetlanie działają; usuwania nie ma (brak kopii) |
| B12 | Bardzo długa historia (tysiące sesji) | brzegowy | Pomiar czasu zapytań na telefonie właściciela (5.7 pkt 3) |
| B13 | Telefon z innym kontem iCloud / nowy telefon z kopii | realny | Prośba o zgodę przy imporcie (rozdz. 6) |
| B14 | Wartości dziwne (0 kroków, tętno brak, `end < start`) | brzegowy | Funkcje odrzucają złe przedziały; 0 kroków → „Kroki: 0” tylko w dniu minionym z innymi danymi, inaczej brak linii |

## 12. Testy wg definicji ukończenia (docs/20)

1. **Logika** (`tests/health-read.test.ts`): dopasowanie (część wspólna 0/stykanie/częściowa/pełna, remisy, wiele kandydatów, przydział jeden do jednego, cudze źródło vs własne `SyncIdentifier`, rodzaje spoza listy), agregacja kroków dnia i tygodnia, filtr aktywności (bez własnych i dopasowanych), formatowanie (kcal, /min, dystans, VoiceOver), złe dane (NaN, odwrócone przedziały, `undefined`). Makieta biblioteki o kontrakcie v16 (fabryki: kroki dnia, trening z tętnem i kcal, brak danych, błąd).
2. **Ekran** (`renderApp`): przełącznik (włącz → arkusz → stan; HealthKit niedostępny → alert), panel dnia ze wszystkimi stanami z rozdz. 7, „Ten tydzień”, szczegóły sesji (ładowanie, wartości, brak), tekst usuwania przy `'watch'`.
3. **Scenariusz:** włącz zapis i odczyt → trening → „Zakończ” (bez zegarka: kopia zapisana) → w makiecie pojawia się trening z zegarka → powrót z tła → `deleteObjects` wywołane z filtrem id + własne źródło → `healthUUID = 'watch'` → restart → szczegóły pokazują tętno i kcal (odczyt na nowo), stan bez wartości z Health.
4. **Macierz:** stała listy typów odczytu, `WATCH_MATCH_TYPES`, kategorie aktywności (P8) — iteracja w testach; nowe teksty w macierzy języków i dostępności (bez nowych tras).
5. **Niezmienniki** (`tests/matrix-invariants.test.ts`): akcje „pojawia się/znika trening z zegarka”, „zmiana zgody” w alfabecie. Niezmienniki: (a) stan i kopia nigdy nie zawierają wartości z Health; (b) usuwanie dotyczy wyłącznie własnych wpisów (filtr zawsze z oboma warunkami); (c) sesja nigdy nie ma dwóch dopasowań.
6. **Dane:** zapis → restart → ten sam stan; eksport kopii → import bez strat (`healthRead`, `'watch'`); `migrate` idempotentne; kopia ze starej wersji bez pola; CSV bez zmian (test, że nie zawiera danych Health).
7. **Języki i wygląd:** `check:i18n`, `tests/i18n-locales.test.ts` (35 języków, także `locales/*.json` bez „nie odczytuje”), jasny i ciemny wygląd, kg/lb (dystans i masa — tylko jeśli P7 = B).
8. **Regresja:** każdy błąd znaleziony przy wdrażaniu — test odtwarzający; zaktualizować `tests/setup.js` (mock), `audit-0.10-data.test.ts:205` (opcje pluginu), `scripts/verify-native.mjs`.
9. **E2E Maestro** (symulator):
   - **Da się:** aplikacja startuje z modułem; Ustawienia pokazują przełącznik i opis; stan wyłączony; panel dnia i szczegóły sesji bez bloku Health przy wyłączonym odczycie.
   - **Do sprawdzenia:** czy Maestro obsłuży systemowy arkusz zgody Zdrowia na symulatorze **[DO SPRAWDZENIA — tester-e2e]**.
   - **Nie da się:** sterowanie danymi Health w CI i trening z zegarka → rodzaj „E2E” dla ścieżek z danymi pominięty z powodem w docs/09. Zamiast tego lista ręczna dla właściciela na iPhonie z zegarkiem: (1) trening siłowy na zegarku równolegle z sesją; (2) po „Zakończ” i ponownym otwarciu w Zdrowiu jest jeden wpis; (3) tętno i kcal w szczegółach zgodne z aplikacją Zdrowie/Fitness; (4) kroki dnia zgodne ze Zdrowiem; (5) odmowa w arkuszu → neutralny stan pusty; (6) tryb samolotowy bez zmian.

## 13. Ryzyka App Review (wszystkie **[DO WERYFIKACJI — badacz]**, aktualny tekst wytycznych z adresem)

- **5.1.3 (zdrowie):** dane HealthKit nie do reklam ani marketingu; nie w iCloud. Zgodne z decyzją 11.10 (2), pod warunkiem że nic nie trafia do kopii.
- **2.5.1:** integracja HealthKit wyraźnie widoczna w interfejsie; prośba tylko o używane typy.
- **5.1.1:** opisy uprawnień dokładne (dzisiejszy tekst „nie odczytuje” musi zniknąć w tym samym buildzie) i aktualna polityka prywatności pod adresem z App Store Connect.
- Usuwanie własnych wpisów z Health — czy wymaga ujawnienia (proponuję wzmiankę w opisie zapisu, rozdz. 8).
- Przegląd zmiany deklaracji zdrowotnej może trwać dłużej (`docs/28`, do potwierdzenia).

## 14. Ryzyka techniczne

- Sprawdzałem master biblioteki, nie 16.1.0 — różnice w API do potwierdzenia przy pierwszym buildzie.
- Kształt `getStatistic` (średnia/maks., jednostka `count/min`), filtr `deleteObjects` (metadane + źródło), filtr „nie z tej aplikacji” w `queryWorkoutSamples`.
- Czy aplikacja czyta własne wpisy bez zgody na odczyt.
- Wydajność panelu dnia (zapytanie przy każdym wyborze dnia; pamięć podręczna w RAM na dzień).
- Jedno źródło biblioteki (jeden utrzymujący) — jak w `docs/28`.

## 15. Kryteria ukończenia (testowalne)

1. Świeża instalacja: odczyt wyłączony; żaden ekran nie pyta Health (makieta: 0 wywołań zapytań).
2. Włączenie odczytu wywołuje `requestAuthorization` dokładnie z typami z jednej stałej (test porównuje listę).
3. Panel dnia minionego z danymi w makiecie pokazuje kroki i aktywności (bez własnych i dopasowanych). Bez danych — neutralną linię z drogą do zgody.
4. „Ten tydzień” pokazuje sumę kroków i liczbę aktywności bieżącego tygodnia (P3 = A).
5. Szczegóły sesji z dopasowanym treningiem pokazują tętno śr./maks. i aktywne kcal; bez dopasowania nic.
6. Reguła dopasowania przechodzi wszystkie przypadki z rozdz. 12 pkt 1; wynik jest deterministyczny.
7. Przy zapisie i odczycie oraz dopasowaniu po „Zakończ” → brak zapisu kopii; po późniejszym dopasowaniu → `deleteObjects` z filtrem id + własne źródło, potem `healthUUID = 'watch'`. Nigdy wywołanie bez obu warunków (niezmiennik).
8. Kopia JSON i CSV po dowolnej sekwencji działań nie zawierają wartości z Health (niezmiennik).
9. Opisy uprawnień w `app.json` i 35 `locales/*.json` opisują odczyt; `verify:native` przechodzi; żaden nie zawiera „nie odczytuje”.
10. `site/privacy.html` PL/EN opisuje odczyt i usuwanie kopii.
11. Wszystkie nowe teksty w 35 językach; `check:i18n`, `check:matrix` bez braków; ciemny wygląd i VoiceOver w testach dostępności.
12. Pełne `npm run verify` zielone; `ios-unsigned.yml` kompiluje; E2E zielone (scenariusze z rozdz. 12 pkt 9).
13. Ręczna lista na iPhonie z zegarkiem (rozdz. 12 pkt 9) odhaczona przez właściciela na buildzie TestFlight.

## 16. Szacunek (orientacyjny)

- **Praca agenta (wariant A):** ok. 1–1,5 dnia z pracą równoległą (`docs/28`), w tym logika, UI, testy, teksty w 35 językach, privacy i docs. Każda opcja P6 = A, P7 = B, P8 = B dokłada pracę (P8 = B najwięcej — tłumaczenia).
- **Czekanie:** `ios-unsigned.yml`, `e2e-ios.yml` (wolny symulator, ponowienia przy braku maszyn), `testflight.yml`, przegląd Apple (możliwie dłuższy przy zmianie deklaracji zdrowotnej).
- **Czas właściciela:** decyzje P1–P11; test na iPhonie z zegarkiem; App Store Connect (formularz prywatności, adres polityki).

## 17. Pytania do właściciela

- **P1** — zakres 0.16: A etapy 1–2 + kcal i tętno / B A + masa ciała do wglądu / C zakres z backlogu 07.10. **Rek. A.**
- **P2** — włączenie odczytu: A osobny przełącznik (pole opcjonalne w ustawieniach) / B bez pola, przycisk + wyłączanie w Zdrowiu / C jeden przełącznik na zapis i odczyt. **Rek. A.**
- **P3** — tydzień: A linia pod „Ten tydzień” / B nowe kafelki / C znacznik w pasku tygodnia. **Rek. A.**
- **P4** — które treningi z zegarka łączyć: A tylko siłowe / B siłowe + pokrewne / C wg rodzaju sesji (także cardio). **Rek. A.**
- **P5** — kcal bez treningu z zegarka: A nie pokazywać / B suma w czasie sesji bez pauz. **Rek. A.**
- **P6** — ocena wysiłku: A odczyt z zegarka / B zapis z RPE (dziś niewykonalny) / C backlog. **Rek. C.**
- **P7** — masa ciała z Health: A backlog z pomiarami / B do wglądu / C kopiowanie do własnych pomiarów. **Rek. A.**
- **P8** — nazwy aktywności: A kilka własnych kategorii / B pełne nazwy ok. 75+ rodzajów. **Rek. A.**
- **P9** — jednostka energii: A zawsze kcal / B jak w Zdrowiu. **Rek. A.**
- **P10** — płatne po 0.17? A odczyt Health bez limitu, zgodnie z docs/27 / B za subskrypcją (przez jeden przełącznik `lib/access.ts` (`PAYWALL.ENABLED`, gałąź f017-logika)). **Rek. A.**
- **P11** — pole `Workout.live` z docs/27 (wydanie N przed 0.17): A osobne małe wydanie po 0.16 / B razem z 0.16 (formalnie dozwolone, bo bez SDK, ale miesza przyczyny błędów). **Rek. A.**

## 18. Otwarte i do wyjaśnienia

**[OTWARTE — badacz]:**
- Przeliczenie RPE → `workoutEffortScore`.
- „Data Not Collected” przy odczycie lokalnym.
- Brzmienie wytycznych 5.1.3, 2.5.1, 5.1.1.
- Czy własny trening w Zdrowiu dubluje minuty w kręgu „Ćwiczenia” do czasu usunięcia.
- Czy zapis do Health danych pochodzących z HealthKit w kopii (P7 = C) narusza 5.1.3.

**[DO SPRAWDZENIA — programista]:**
- Zgodność API 16.1.0 z master (12.10.2026).
- `authorizationStatusFor` (wartość „sharingAuthorized”).
- Filtr `deleteObjects` (metadane + źródło) i „NOT własne źródło” w zapytaniu treningów.
- Kształt i jednostki `getStatistic`.
- Odczyt własnych wpisów bez zgody na odczyt.
- Odczyt oceny wysiłku powiązanej z treningiem (P6 = A).
- Minimalna wersja iOS aplikacji vs iOS 18.
- Reguła pól opcjonalnych w `lib/backup.ts`.
- Czas zapytań przy długiej historii.

**[DO SPRAWDZENIA — tester-e2e]:**
- Obsługa systemowego arkusza zgody Zdrowia przez Maestro na symulatorze.

**[DO WYJAŚNIENIA]:**
- Ostateczne brzmienie tekstu przy usuwaniu sesji z `'watch'`.
- Deduplikacja kroków iPhone + zegarek na prawdziwych danych (test właściciela).
