# 35. Zegarki — protokół telefon ↔ zegarek (0.20 „Zegarki i głos”)

Specyfikacja części wspólnej wydania 0.20: protokół, model zegarka, teksty, zapis do Zdrowia i pliki wzorcowe dla klientów Apple Watch (SwiftUI) i Garmina (Monkey C).
Powstała z analizy produktowej z 13.10.2026 (research i wyciągi z dokumentacji producentów: materiały robocze na Dysku, folder „Trening App”) i **decyzji właściciela z 13.10.2026**
(docs/18), które mają pierwszeństwo przed wcześniejszym szkicem. Głos: `docs/36-glos.md`. Wzorce interakcji: `docs/32`.

## 1. Decyzje właściciela (13.10.2026)

1. **Zegarek tylko WYŚWIETLA** i zarządza bieżącą akcją. Pokazuje: bieżące ćwiczenie, „seria X z Y”, ciężar i powtórzenia, **od początku przerwy następne ćwiczenie** (ten sam tekst co głos)
   i odliczanie przerwy z wibracją. **Bez edycji** ćwiczeń, serii i ciężarów na zegarku — edycja tylko w telefonie.
2. **Zdarzenia z zegarka:** „zrobione według planu” (`done`), „zrobione inaczej niż w planie” (`differ`), „pomiń” (`skip`, z potwierdzeniem na zegarku), „cofnij” (`undo`), koniec przerwy (`restEnded`).
   W przerwie przycisk główny odhacza **następną** serię (to zwykłe `done` następnej serii).
3. **„Zrobione inaczej”:** seria dostaje znacznik **„do uzupełnienia”**; **przed „Zakończ” telefon prosi o uzupełnienie** takich serii; **rekord dla nich liczy się dopiero po uzupełnieniu**.
4. **Mówi telefon** (zapowiedź na początku przerwy: ćwiczenie, ciężar, liczba powtórzeń — bez talerzy). Garmin nie ma syntezy mowy, Apple Watch dostaje ten sam tekst do wyświetlenia.
5. **Apple Zdrowie:** zapis z zegarka, jeśli prowadził sesję treningu; inaczej z telefonu — **bogatsze źródło z priorytetem, bez duplikatów** (rozdz. 6).
6. Garmin: „seria zrobiona” na górnym prawym przycisku (START). Apple Watch: przycisk główny i podwójne stuknięcie. Apple Watch testowany tylko wirtualnie; Garmin fēnix 8 na urządzeniu.
7. Siri odpuszczone; Apple Watch i Garmin budowane równolegle na **jednym protokole**.

Odstępstwa od szkicu analityka (zapisane, żeby dało się je cofnąć): (a) opcja „P1-C” (znacznik `fromWatch` na każdej serii z zegarka) zastąpiona decyzją właściciela — znacznik dostaje tylko
„zrobione inaczej” i nazywa się `toFill`; (b) **zdarzeń „na ślepo” nie ma**: po dwóch odhaczeniach bez telefonu zegarek pokazuje „Połącz z telefonem” i nie przyjmuje kolejnych (nie zgadujemy serii,
których nie zna — ryzyko odhaczenia złej serii przewyższa zysk); (c) sygnał końca przerwy to dotychczasowe powiadomienie lokalne (dźwięk + wibracja), nie osobny dźwięk modułu głosu.

## 2. Architektura

**Telefon = mózg** (stan, teksty, decyzje, głos, zapis), **zegarek = wyświetlacz z jednym przyciskiem**. Oba klienty są cienkie: nie składają zdań, nie liczą reguł, niczego nie edytują.
Prawie całą logikę sprawdzają testy Jest na Linuksie; klienty natywne odtwarzają **pliki wzorcowe** wygenerowane z kodu telefonu (rozdz. 8).

| Warstwa | Plik | Rola |
|---|---|---|
| Protokół | `lib/watch/protocol.ts` | typy, stałe (`WATCH`), walidacja wejścia z sieci (`parseWatchMessage`), kodowanie |
| Teksty | `lib/live.ts` (`restCue`, `spokenLoad`, `counterLabel`), `lib/watch/labels.ts` | jedno źródło tekstu zapowiedzi i stałych etykiet, 35 języków |
| Migawka | `lib/watch/snapshot.ts` | stan treningu → migawka dla zegarka (czysta funkcja) |
| Reducer | `lib/watch/apply.ts` | zdarzenie z zegarka → decyzja (czysta) → skutek tą samą drogą co ✓ na telefonie (`lib/setFlow.ts`) |
| Łącze | `lib/watch/link.ts` | transport wstrzykiwany, migawka przy zmianie treści, `ack`, `welcome`, negocjacja sesji |
| Model zegarka | `lib/watch/client.ts` | **wzorzec referencyjny** zachowania klienta (offline, „Cofnij”, potwierdzenie „Pomiń”) |
| Atrapa | `lib/watch/fake.ts` | zegarek z modelu + transport (testy, E2E); odtwarza kolejki transportów |
| Zdrowie | `lib/watch/health.ts`, `lib/health.ts` | kto zapisuje trening |

Transport (WatchConnectivity po stronie Apple, Connect IQ Mobile SDK po stronie Garmina) rejestruje moduł natywny przez `startWatchLink(transport)`; do tego czasu aplikacja działa bez zmian.
Transport ma trzy metody: `send(msg)`, `onMessage(cb)`, `reachable()`. Komunikat to JSON (obiekt albo tekst); Garmin przesyła słowniki — `decodeWatchMessage` przyjmuje oba.

## 3. Protokół (wersja 1)

Każdy komunikat ma `v` (wersja) i `kind`. Wartości liczbowe (okno „Cofnij”, limity długości, budżet rozmiaru, tolerancje) są w jednym miejscu — `lib/watch/protocol.ts` (`WATCH`) —
i w `watch-fixtures/protocol.json`; tu nie są przepisywane.

### 3.1 Telefon → zegarek

| `kind` | Treść | Kiedy |
|---|---|---|
| `snapshot` | pełny stan do wyświetlenia (rozdz. 3.3) | przy każdej zmianie **treści**; `rev` rośnie tylko wtedy (zegar „teraz” nie należy do treści) |
| `ack` | `eventId`, `status` (`applied` / `duplicate` / `ignored` / `rejected`), `reason`, `rev` | po każdym zdarzeniu; **najpierw migawka, potem `ack` z numerem tej migawki** |
| `welcome` | `ok`, `protocol`, `upgrade` (`watch` / `phone` / null) | odpowiedź na `hello`; `upgrade='watch'` → „Zaktualizuj aplikację na zegarku” |
| `session` | `action` (`start` / `end`), `workoutId`, `save` | negocjacja sesji treningu zegarka (rozdz. 6) |

### 3.2 Zegarek → telefon

| `kind` / `type` | Pola | Znaczenie |
|---|---|---|
| `hello` | `client` (`apple` / `garmin`), `protocol`, `app`, `caps.session` | zgłoszenie przy starcie aplikacji i po odzyskaniu zasięgu; telefon odpowiada `welcome` + migawką |
| `event` / `done` | `setId` | seria zrobiona **według planu** |
| `event` / `differ` | `setId` | zrobiona **inaczej niż w planie** → znacznik „do uzupełnienia” |
| `event` / `skip` | `blockId` | pomiń ćwiczenie (zegarek już zapytał o potwierdzenie, telefon nie pyta drugi raz) |
| `event` / `undo` | `setId` | cofnij odhaczenie (tylko tuż po nim) |
| `event` / `restEnded` | `setId` | skończyło się odliczanie przerwy po tej serii |
| `event` / `sessionStarted`, `sessionEnded` | `saved` (tylko koniec) | sesja treningu zegarka (rozdz. 6) |

Wspólne pola zdarzenia: `eventId` (unikalny, np. `apple-17`), `workoutId`, `baseRev` (numer migawki, którą zegarek miał), `at` (godzina zegarka, ms), `client`.
Pola nieznane są pomijane (zgodność w przód). Walidacja: wersja, rodzaj, typ, długości identyfikatorów, liczby skończone.

### 3.3 Migawka (`snapshot`)

`rev`, `lang`, `phase` (`idle` / `set` / `rest` / `done`), `paused`, `workoutId`, `title`, `now`, `rest`, `after`, `doneCount`, `totalCount`, `toFillCount`. Wszystkie teksty gotowe, w języku aplikacji.

- `now` — bieżąca seria: `setId`, `blockId`, `title` (ćwiczenie), `counter` („seria 2 z 4”), `load` („80 kg × 8”, „+10 kg × 8”, „masa ciała × 12”, „45 s”), `group` („SS A” albo null), `timed`, `targetSec`.
- `rest` — przerwa w toku: `setId`, `startedAt`, `endsAt`, `totalSec`, **`cue`** (= tekst zapowiedzi: ten sam co głos, podpis przerwy na ekranie telefonu i Live Activity), `last`.
  W fazie `rest` pole `now` to **następna** seria (przycisk główny odhacza ją).
- `after` — co zobaczy zegarek **po „Seria zrobiona” na bieżącej serii**, policzone przez telefon z góry: `restSec` (null = bez przerwy, środek rundy supersetu albo drop set po serii),
  `cue`, `last`, `now` (następna seria). Dzięki temu zegarek przechodzi do przerwy od razu, także bez telefonu.
- `phase='rest'` po ostatniej serii treningu: `now` null, `rest.last` = true, `cue` = „nic więcej do zrobienia” (przerwa po ostatniej serii zostaje — decyzja LIVE-04 B). Po jej końcu `phase='done'`. **Zegarek (decyzja właściciela 23.10.2026):** nie wyświetla tej zapowiedzi (`view.cue` = null przy `rest.last`), tylko jedną stałą etykietę `finishOnPhone` („Zakończ trening na telefonie”) pod odliczaniem i na ekranie `done` — wcześniej „nic więcej do zrobienia” stało dwa razy (zapowiedź + etykieta).
- Pominięty blok („Pomiń dziś”) nie liczy się do `totalCount` i nie jest bieżącą serią.

### 3.4 Reguły (telefon)

1. **Źródłem prawdy jest telefon**; zegarek trzyma migawkę i zdarzenia czekające na migawkę.
2. **Zdarzenia są bezwzględne** („seria o tym id jest odhaczona”), nie przełączniki — powtórzenie, zła kolejność i stara `baseRev` nie psują danych. Dodatkowo dziennik `eventId` w treningu w toku
   (`Workout.watchEvents`, przeżywa restart telefonu): powtórzony `eventId` → `duplicate`.
3. `done` / `differ` dla serii, której już nie ma → `rejected` (`set-gone`); dla bloku pominiętego → `rejected` (`skipped-block`); dla serii już odhaczonej → `duplicate`. `differ` na serii już odhaczonej
   (np. z telefonu) tylko dodaje znacznik „do uzupełnienia”.
4. `undo` ważne tylko tuż po odhaczeniu (okno `WATCH.UNDO_SEC` + tolerancja zegarów) i tylko dla serii odhaczonej w tej chwili; późniejsze, nowsze odhaczenie z telefonu nie da się cofnąć starym zdarzeniem.
5. `restEnded` przyspiesza alarm tylko wtedy, gdy telefon też liczy tę przerwę i jej koniec jest w tolerancji; w przeciwnym razie `ignored`. Dźwięk i wibrację końca przerwy daje powiadomienie lokalne telefonu jak dotąd.
6. Zdarzenie z innego treningu → `rejected` (`other-workout`); zbyt stare albo „z przyszłości” → `rejected`.
7. Odhaczenie z zegarka idzie **tą samą drogą co ✓ na telefonie** (`lib/setFlow.ts completeSet`, godzina `at` zdarzenia): przerwa liczona od niej, stoper serii na czas, Live Activity, głos.
8. **Bez zmiany schematu danych:** nowe pola opcjonalne `WSet.toFill`, `Workout.watchEvents`, `Workout.watch` (bez podnoszenia `SCHEMA_VERSION`; wzór `live?: true`) — sprzątane przy zakończeniu treningu i przez `migrate`.

## 4. Model zegarka (`lib/watch/client.ts`)

Klienty implementują **dokładnie** ten model; `watch-fixtures/scenarios/*.json` to jego wejścia i oczekiwane wyjścia.

- **Ekrany:** `idle` („Zacznij trening na telefonie”), `set`, `rest`, `done`, `connect` („Połącz z telefonem”), `update` („Zaktualizuj aplikację na zegarku”), `finished` („Trening zakończony”).
- **Akcje:** `done` (przycisk główny), `differ`, `skip` (z oknem „Pominąć ćwiczenie?” [Anuluj, Pomiń]), `undo` (tylko w oknie czasowym po odhaczeniu). Przycisk i gest (podwójne stuknięcie) zawsze wywołują akcję główną ekranu.
- **Widok lokalny:** po akcji zegarek od razu pokazuje skutek (projekcja migawki z `after`), z oznaczeniem `busy`, dopóki telefon nie potwierdzi migawką. `ack` wyprzedzający migawkę nie powoduje migotania
  (`ackRev`). „Cofnij” po tym, jak telefon już uwzględnił odhaczenie, wraca do ostatniej migawki, w której ta seria była bieżąca.
- **Bez telefonu:** po „zrobione” przerwa z pola `after`, drugie „zrobione” (przycisk w przerwie) odhacza następną serię; po `WATCH.OFFLINE_DONE_MAX` odhaczeniach — ekran `connect` i brak dalszych akcji.
  Zdarzenia czekają w kolejce transportu (Apple: `transferUserInfo`) i po powrocie dochodzą po kolei.
- **Koniec przerwy:** `tick` w chwili `endsAt` wysyła `restEnded` (raz); platforma daje wibrację.
- **Migawka starsza** od ostatniej (ten sam trening) jest pomijana. Pauza treningu: `paused`, przerwa liczy dalej (jak na telefonie).
- **Tekst:** zegarek nigdy nie składa zdań; stałe etykiety z `watch-fixtures/labels/<język>.json` (generowane z `t()`), reszta z migawki. Długi tekst: dwie linie + przewijanie; nazwa ćwiczenia może być ucięta,
  ciężar i powtórzenia zawsze widoczne.

## 5. Telefon: „do uzupełnienia” i zakończenie

- Seria odhaczona z zegarka jako `differ` ma `toFill` — w wierszu serii widać „do uzupełnienia” i przycisk „Gotowe” (potwierdza wartości z planu albo po poprawce w polach).
- **Rekord** (plakietka PR, karta rekordów, zapowiedź rekordu głosem) **nie liczy takich serii**, dopóki znacznik jest (`stats.prMap`).
- **„Zakończ”:** jeśli są serie `toFill`, najpierw okno „Serie do uzupełnienia” [Anuluj, Zakończ mimo to] (wzorzec potwierdzeń docs/32; „Anuluj” wraca do treningu). „Zakończ mimo to”
  zostawia wartości z planu i zdejmuje znaczniki. Zakończenie po porzuconym treningu (ciche) działa jak „Zakończ mimo to”.
- Cofnięcie odhaczenia serii (z telefonu albo `undo`) zdejmuje znacznik. Znacznika nie ma w historii, eksporcie ani kopii (`finishWorkout`, `putHistoryWorkout`, `migrate`).

## 6. Apple Zdrowie: kto zapisuje trening

Zasada właściciela: **z zegarka, jeśli prowadził sesję treningu (tętno, kcal — bogatsze źródło, ma pierwszeństwo), inaczej z telefonu; bez duplikatów.**

1. `hello.caps.session` — klient zgłasza, że umie prowadzić sesję treningu (Apple: tak; Garmin: nie).
2. Telefon wysyła `session start` (`save` = zapis do Zdrowia włączony w Ustawieniach); zegarek odpowiada `sessionStarted`. Sesja jest też środkiem technicznym (praca w tle, wibracja po opuszczeniu ręki).
3. Po „Zakończ” (albo odrzuceniu) telefon wysyła `session end`; zegarek kończy sesję, zapisuje trening w Zdrowiu tylko gdy `save`, i odpowiada `sessionEnded{saved}`.
4. Decyzja (`watchHealthPlan`, czysta): sesji nie było → zapis z telefonu; `saved` → **znacznik `healthUUID='watch'`, telefon nie zapisuje**; zegarek nie zapisał → telefon; brak odpowiedzi w `WATCH.HEALTH_WAIT_SEC` → telefon.
5. Dubel mimo wszystko (zegarek zapisał po upływie czasu): istniejąca reguła `lib/healthRead` (trening z zegarka nakładający się na sesję → własna kopia usuwana po synchronizacji; wymaga włączonego odczytu).
6. `Workout.watch` żyje tylko do rozstrzygnięcia zapisu (`healthPending`).
7. **Pauza treningu (B-04, wersja 1.0.1; audyt 1.0):** bez tego czas w Zdrowiu zależał od tego, kto zapisał — zapis z telefonu przesuwa start o sumę pauz (`healthStart`), a sesja zegarka trwała od startu do końca razem z pauzami. Rozwiązanie bez zmiany protokołu (v1): migawka już niesie `paused` i `workoutId`; zegarek (`WatchStore`) przy zmianie `paused` wywołuje `WorkoutDriver.setPaused`, a `WorkoutController` wstrzymuje i wznawia `HKWorkoutSession` (HealthKit zapisuje zdarzenia pauzy, a czas treningu ich nie liczy). Sesja wystartowana w trakcie pauzy jest od razu wstrzymana; koniec treningu (migawka idle) wznawia i kończy sesję. Odrzucone: (a) pauzy w poleceniu `session end` i dopisanie zdarzeń z datami po fakcie (dokładniejsze przy rozłączeniu, ale ręczne zdarzenia w żywym builderze — ryzyko konfliktu, nie do sprawdzenia bez urządzenia); (b) zapis zawsze z telefonu, gdy były pauzy (traci tętno i kcal z zegarka). Ograniczenie: gdy zegarek jest poza zasięgiem w chwili pauzy lub wznowienia, pauza sesji zaczyna się dopiero po odebraniu migawki (różnica w Zdrowiu = czas rozłączenia). Garmin nie prowadzi sesji w Zdrowiu — bez zmian. Testy: `tests/watch-link.test.ts` (migawka z `paused`, kontrakt źródeł Swift), `WatchStoreTests.swift` (3 testy pauzy). **Do wykonania po zielonym 1.0 (maszyny macOS mają pierwszeństwo dla 1.0): uruchomić ręcznie `watch-sim.yml` i `ios-unsigned.yml` na gałęzi `wersja-1-0-1` (kompilacja Swift i `swift test`), a na telefonie z zegarkiem sprawdzić: pauza 2 min w treningu, w Zdrowiu czas treningu = czas w Historii.**

Pełne wdrożenie po stronie Apple Watch (HKWorkoutSession, zapis) należy do osobnego agenta; telefon obsługuje opisany protokół.

## 7. Języki i dostępność

- Zapowiedź i licznik — z `t()` i słownika (35 języków), liczba mnoga powtórzeń przez `tp`; pole puste albo 0 jest pomijane (nie zgadujemy liczby).
- Stałe etykiety: `lib/watch/labels.ts` (14 identyfikatorów) → `watch-fixtures/labels/<język>.json`. Klienty generują z nich `Localizable.strings` i `strings.xml` (wzór: `tests/widget-i18n.test.ts`).
  Czcionki Garmina dla alfabetów spoza łacińskiego (grecki, cyrylica, CJK, wietnamski) — do sprawdzenia przy budowie klienta Garmina.
- Etykiety jak na telefonie (docs/32): „Seria zrobiona”, „Pomiń”, „Anuluj”, „Cofnij”. VoiceOver na Apple Watch z tymi samymi etykietami; duże czcionki systemowe.
- Nazwy innych marek nie występują w kodzie ani tekstach (parowanie Garmina pokazuje neutralnie „zegarek” — brak wyjątku w CLAUDE.md; decyzja o nazwie na ekranie parowania: otwarte, rozdz. 10).

## 8. Pliki wzorcowe (`watch-fixtures/`)

Generowane z kodu (`UPDATE_WATCH=1 npx jest tests/watch-fixtures.test.ts`), sprawdzane przy każdym `jest` — nikt ich nie przepisuje ręcznie. Opis katalogów: `watch-fixtures/README.md`.

- `messages/valid` — po jednym komunikacie każdego rodzaju (klient koduje zdarzenia i `hello`, dekoduje migawkę, `ack`, `welcome`, `session`);
- `snapshots` — migawki z prawdziwego telefonu (fazy, superset, seria na czas, masa ciała, funty, niemiecki, japoński, portugalski brazylijski);
- `labels` — 35 plików;
- `scenarios` — wejścia zegarka (`launch`, `connection`, `receive`, `press`, `tick`, każde z godziną `at`) i oczekiwane `out` (komunikaty do telefonu) oraz `view` (co wyświetlić, komplet pól).
  Klient (Swift: `swift test` na pakiecie WatchCore; Monkey C: Run No Evil) odtwarza kroki i porównuje wynik z `expect`.

Identyfikatory w plikach to stałe aliasy (`workout-1`, `block-0`, `set-0-0`); czas w ms epoki UTC. Pliki nie zależą od strefy czasowej maszyny.

## 9. Testy (docs/20)

| Rodzaj | Testy |
|---|---|
| Logika | `tests/watch-protocol.test.ts` (walidacja, kodowanie, etykiety), `tests/watch-cue.test.ts` (zapowiedź), `tests/watch-snapshot.test.ts`, `tests/watch-apply.test.ts` (reducer), `tests/watch-client.test.ts` (model zegarka), `tests/watch-health.test.ts` |
| Scenariusz | `tests/watch-link.test.ts` — telefon + atrapa zegarka: trening sterowany zdarzeniami, kolejka offline, restart telefonu w trakcie |
| Macierz | metryki × typy serii × jednostki × 35 języków (snapshot, cue), wszystkie typy zdarzeń × stany (reducer) |
| Niezmienniki | `tests/watch-invariants.test.ts` — losowe sekwencje zdarzeń z zegarka przeplatane działaniami na telefonie |
| Dane | migracja `toFill` / `watchEvents` / `watch`, eksport → import, zakończenie treningu |
| Wygląd / języki | 35 języków w migawce i etykietach; ekran „do uzupełnienia” w PL/EN, jasny/ciemny |
| Regresja | zmieniony tekst podpisu przerwy (wcześniej „dalej: nazwa”) w istniejących testach, z uzasadnieniem w docs/09 |
| E2E | Maestro nie obsługuje watchOS ani Garmina. Na telefonie: scenariusz z atrapą zegarka (`lib/watch/fake.ts`) — do dopisania razem z klientami; Apple Watch: XCUITest na symulatorze; Garmin: lista właściciela |

**Czego nie sprawdzimy wirtualnie:** siła wibracji i wibracja w tle na urządzeniu, podwójne stuknięcie, Always On, `transferUserInfo` (symulator go nie obsługuje), wybudzenie zablokowanego iPhone'a,
instalacja z TestFlight / sklepu Connect IQ. Zegarek, który nie przejdzie testów, zostaje wyłączony flagą i nie blokuje drugiego (decyzja o wydaniu bez niego należy do właściciela).

## 10. Otwarte pytania (do właściciela, z rekomendacją)

1. **Długość okna „Cofnij” po odhaczeniu** — wartość `WATCH.UNDO_SEC` (dziś 5 s) jest założeniem. Opcje: 5 s (rekomendacja: wystarczy na przypadkowe stuknięcie, nie zostawia „Cofnij” na ekranie podczas przerwy) / 10 s.
   Sprawdzić w ręku na fēnix 8 (przycisk START łatwo nacisnąć przypadkiem).
2. **Nazwa zgodnego sprzętu na ekranie parowania Garmina:** A (rekomendacja) neutralnie („zegarek z Connect IQ”, bez nazwy marki — zgodnie z CLAUDE.md i wytycznymi Apple 2.3.7 / 5.2.1) / B wyjątek tylko na ekranie
   parowania. Zależy od badacza (czy nazwa zgodnego sprzętu jest dozwolona).
3. **Trzecie „zrobione” bez telefonu:** dziś blokada („Połącz z telefonem”). Opcja B: kolejka „na ślepo” — odrzucona w tej wersji (ryzyko złej serii); do ponownej oceny po testach na fēnix 8.
4. **Zapis do Zdrowia po czasie** (zegarek zapisał po `HEALTH_WAIT_SEC`, telefon już zapisał): dubel usuwa tylko reguła z odczytem (`healthRead`). Opcja: wymagać odczytu przy zegarku (rekomendacja: nie, rzadkie).
