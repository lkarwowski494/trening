# 40. Lekcje po błędach (lessons learnt)

Zasada właściciela 14.10.2026 (CLAUDE.md): po każdym błędzie od razu wpis tutaj — co się stało, przyczyna źródłowa, akcje zapobiegawcze
(mechanizm, nie postanowienie) i ich stan, ocena zakresu: **lokalna** (fix tylko dla tego przypadku) albo **systemowa** (luka w modelu pracy →
propozycja zmiany dla właściciela). Najnowsze na górze. Przed wydaniem przejrzeć otwarte akcje.

Stan akcji: **zrobione** (z commitem/plikiem) · **w toku** · **otwarte**.

## Rejestr ryzyk (otwarte blokują wydanie)

| id | ryzyko | warunek zamknięcia | stan |
|---|---|---|---|
| R-001 | Podpis B (`codesign` z plikami uprawnień) — wysyłka do App Store Connect po eksporcie do pliku nie testowana na prawdziwym buildzie | pierwszy przebieg `testflight.yml` 0.20 zielony + strażnik uprawnień zielony | **zamknięte 19.10.2026** — dowód: testflight.yml run 39233940303 zielony, build 1018 wysłany z nowym podpisem; potwierdzenie właściciela na telefonie |
| R-002 | Zdrowie na telefonie po poprawce podpisu (odczyt i zapis, kolejka zapisu z 0.18) | lista kontrolna właściciela po TestFlight 0.20: włączenie odczytu bez błędu, zaległy trening widoczny w Zdrowiu | **zamknięte 19.10.2026** — dowód: build 1018 (run 39233940303); właściciel potwierdził na telefonie: przełączniki Apple Health działają, zaległy trening z 14.10 trafił do Zdrowia |
| R-003 | Zegarek: zgodność fałszywego telefonu z prawdziwym (kolejność migawka → ack) | lista kontrolna właściciela po TestFlight 0.20: seria odhaczona na zegarku → przerwa z timerem | **zamknięte 19.10.2026** — dowód: build 1018; właściciel potwierdził na Apple Watch (watchOS 10.6.2): zgoda na Zdrowie, odhaczenie → przerwa z timerem, „Cofnij” w 5 s, synchronizacja z telefonem |
| R-004 | Uprawnienie powiadomień pilnych (`com.apple.developer.usernotifications.time-sensitive`) na telefonie: baner końca przerwy przechodzi przez tryb skupienia; App ID ma włączoną możliwość (właściciel, 19.10.2026) | strażnik uprawnień w `testflight.yml` zielony (automat) + lista kontrolna właściciela po audycie M1: profil skupienia bez powiadomień → koniec przerwy daje baner; Ustawienia iOS → Trening → Powiadomienia → „Powiadomienia pilne” | otwarte (świadomie odłożone przez właściciela 19.10.2026 — blokuje 1.0) |
| R-005 | Strażnik pętli awarii (M1-003): dwa kolejne starty bez „kamienia” (1,5 s po zamontowaniu aplikacji) dają ekran awaryjny — scenariusz E2E z bardzo szybkim `stopApp` → `launchApp` mógłby go wywołać; na telefonie szybkie dwukrotne zabicie aplikacji tuż po starcie też | pakiet podstawowy E2E (`pakiet: podstawowy`) zielony na gałęzi `audyt-m1` po scaleniu partii 1 + brak ekranu awaryjnego w nocnym przebiegu pełnym | otwarte (partia 1 napraw M2, 20.10.2026) |
| R-006 | Zadanie M1-005 (zegarek): nowy dekoder `ClientState` i testy Swift (`WatchStoreTests.testPersistenceKeepsQueueFromOlderShape`, `testPersistenceRoundTripKeepsCurrentShape`, `testPersistenceWithoutConfigIsNil`) nie były uruchamiane (brak Xcode na Linuksie) | zielony krok „Testy logiki zegarka (XCTest)” w `watch-sim.yml` uruchomionym ręcznie na `audyt-m1` (`workflow_dispatch`) | otwarte (partia 1 napraw M2, 20.10.2026) |
| R-007 | M1-014: manifest prywatności — kategoria DiskSpace dopisywana skryptem `ensure-privacy-manifest.mjs --fix` po `pod install`; nieznane, czy format pliku z agregacji CocoaPods i kolejność kroków dadzą komplet 4 kategorii także w `.ipa` (Linux tego nie sprawdzi) | przebieg dowodowy `testflight.yml` na `audyt-m1` z `bez_wysylki: true`: krok „Manifest prywatności” zielony bez ostrzeżeń, krok „Strażnik uprawnień w .ipa” wypisuje „manifest prywatności OK (4 kategorie)” dla Payload/Trening.app | otwarte (partia 2 napraw M2, 20.10.2026) |
| R-008 | M1-023: `SOURCEMAP_FILE` przekazane jako ustawienie budowy `xcodebuild archive` może nie dotrzeć do fazy pakowania JS (Hermes: mapa musi być złożona) | ten sam przebieg dowodowy: krok „Mapa źródeł JS” zielony (plik niepusty), artefakt `mapy-zrodel-b<N>` obecny; po pierwszym wydaniu: mapa przy tagu i test symbolikacji (`npx metro-symbolicate`) na celowym błędzie JS | otwarte (partia 2 napraw M2, 20.10.2026) |
| R-009 | M1-018: bramka E2E (`bramka-e2e.sh`) rozpoznaje przebieg po tytule `run-name`; przebieg dowodowy musi potwierdzić, że GitHub nadaje taki tytuł przebiegom z `push` i `workflow_dispatch`, a bramka blokuje i przepuszcza zgodnie z opisem | dowód 1: dispatch `testflight.yml` (`bez_wysylki: true`) na SHA bez zielonego E2E kończy się błędem w zadaniu „bramka” przed `npm ci`; dowód 2: po zielonym `e2e-ios.yml` (pakiet podstawowy) na tym samym SHA ten sam dispatch przechodzi bramkę | otwarte (partia 2 napraw M2, 20.10.2026) |
| R-010 | M1-049: treść krytyczna (zdanie medyczne, asekuracja, zdania wskazówek techniki) w 34 językach ma tylko kontrolę automatyczną (komplet i różnica od źródła, docs/16 „Treść krytyczna”), bez drugiego przeglądu przez native speakera; forma zwracania się w fr („consulte”) i tr („danış”) niespójna z zapisanym rejestrem | (1) drugi przegląd wskazówek techniki i zdań medycznych/asekuracji zapisany dla każdego z 34 języków (kolumna „drugi przegląd” w docs/16 = wykonany, z datą i recenzentem) albo świadoma decyzja właściciela z datą, że wydanie w danym języku idzie bez niego; (2) fr i tr: zdanie medyczne i etykiety w formie z rejestru docs/16 (fr „vous”, tr „siz”), test zgodności; (3) opis ryzyka przeglądany przed wydaniem w App Store | otwarte (20.10.2026) — **blokuje wydanie w App Store, nie blokuje TestFlight** (wewnętrzna grupa testerów, decyzja 20.10.2026) |

## L-009 (20.10.2026) — czerwony tests.yml po wypchnięciu poprawki testu zegarka bez pełnego verify
- Co się stało: commit 867f63e (testy UI zegarka) wypchnięty na audyt-m1 bez przegenerowania README/docs/19 → tests.yml czerwony na check:readme; naprawione w 4bbb6df.
- Przyczyna źródłowa: zasada „pełne verify przed wypchnięciem” jest tylko poleceniem w CLAUDE.md i w promptach agentów; agent naprawiający CI uznał zmianę za „tylko testy” i pominął verify. Nic mechanicznie nie blokuje wypchnięcia z nieaktualnymi plikami generowanymi.
- Ocena zakresu: systemowa (każdy agent, każda gałąź).
- Akcje (do decyzji właściciela, ≥2 opcje): (a) hak pre-push w repo (`scripts/hooks/pre-push`: check:readme + check:matrix, ~10 s) instalowany przez `npm ci` (prepare) — mechanizm lokalny; (b) krok w promptach agentów + lista kontrolna koordynatora przed zleceniem wypchnięcia — słabszy, bo to postanowienie. Rekomendacja: (a). Stan: otwarte.
- Druga obserwacja (tester): ukryte założenie „testy UI mieszczą się w oknach czasowych aplikacji” — naprawione konfiguracją okna w Debug (867f63e) i strażnikiem tests/watch-ci.test.ts.

## L-008 (20.10.2026, audyt M1) — `npm run lint` bez eslint w zależnościach sam instaluje pakiety i zmienia package.json
- **Co się stało:** audyt M1 (zadanie M1-audytor-generalny-051) uruchomił `npm run lint` (`expo lint`). Projekt nie ma `eslint` w zależnościach ani konfiguracji, więc `expo lint` sam doinstalował pakiety i zmienił `package.json` (i lockfile) — polecenie sprawdzające zmieniło śledzone pliki; nie jest też częścią `npm run verify`, więc nikt nie zauważył, że nie działa.
- **Przyczyna źródłowa:** skrypt `lint` został dodany jako skrót z szablonu Expo bez zależności i konfiguracji, a bramka `verify` (typecheck, check:i18n, jest, export, verify:native) nie zawiera lintu — nic nie sprawdza, czy każde polecenie z `package.json` działa i nie zmienia repozytorium.
- **Ocena zakresu: systemowa** (każde polecenie w `package.json`, którego nie wykonuje żadna bramka, może przestać działać niezauważone; polecenie, które doinstalowuje zależności, zmienia repozytorium przy zwykłym uruchomieniu).
- **Akcje:**
  1. Naprawa: `eslint` w `devDependencies`, konfiguracja i krok `lint` w `npm run verify`; test akceptacyjny: `npm run lint` kończy się kodem 0 bez zmiany plików śledzonych (`git status --porcelain` pusty) — **otwarte** (zadanie M1-audytor-generalny-051, partia 4 napraw z audytu M1).
  2. Mechanizm: test w `tests/`, który wymaga, by każdy skrypt z `package.json` należał do `verify` albo był na liście wyjątków z powodem (ręczne: `start`, `ios`, `android`, `screens`, `mutation`, `perf`) — **otwarte** (razem z zadaniem 051).
  3. Do czasu naprawy: nie uruchamiać `npm run lint` (zmienia `package.json`); po przypadkowym uruchomieniu `git checkout -- package.json package-lock.json` — **zrobione** (ten wpis).

## L-007 (19.10.2026) — zła ścieżka w kroku listy kontrolnej dla właściciela
- **Co się stało:** w kroku 8 listy kontrolnej 0.20 koordynator kazał szukać „Dostosuj do miejsca” w Planie; funkcja jest w treningu w toku (przycisk 📍 → okno „Dostosuj do: X”), a w panelu dnia tylko „Więcej opcji → Inne miejsce…”. Właściciel szukał nieistniejącego przycisku.
- **Przyczyna źródłowa:** kroki „What to Test” i instrukcje dla właściciela pisane z opisu funkcji, nie z kodu; nic nie wiąże kroku listy z rzeczywistą drogą w UI.
- **Ocena zakresu: systemowa** (każda lista kontrolna i instrukcja krok po kroku dla właściciela).
- **Akcje:**
  1. Od 19.10 koordynator sprawdza ścieżkę w kodzie (grep etykiety → ekran → skąd `router.push`) przed podaniem kroku — **zrobione** (kroki 10–12 tej listy).
  2. Mechanizm: każdy punkt „What to Test” wskazuje scenariusz Maestro dochodzący do ekranu (katalog przepływów); test sprawdza, że scenariusz istnieje — **otwarte** (do decyzji właściciela przy pracach przed 1.0; wariant lżejszy: punkt listy kontrolnej wydawcy).

## L-006 (18.10.2026) — częste porażki E2E na błędach scenariuszy
- **Co się stało:** kolejne pełne przebiegi E2E 0.20 (po ok. 1,5 h) padały na scenariuszach, nie na aplikacji (selektory po tekście po przeniesieniu tekstów pod ⓘ i przebudowie Postępów, klawiatura/przewijanie, kolizje zmian kilku programistów). Właściciel: „bardzo nieefektywne”.
- **Przyczyna źródłowa:** scenariusze sprawdzane tylko w interpreterze Jest (uproszczony model telefonu); pierwszy kontakt z prawdziwym symulatorem dopiero w pełnym przebiegu (1,5 h, jedna porażka czerwieni całą część); selektory oparte na widocznym tekście; równoległe zmiany UI bez wspólnego przebiegu.
- **Ocena zakresu: systemowa.**
- **Akcje (decyzja właściciela 18.10.2026):**
  1. Szybki przebieg zmienionych scenariuszy na symulatorze przed oddaniem pracy (`tylko_scenariusze`) — **zrobione** (polecenie dla agentów od 18.10).
  2. Stałe identyfikatory zamiast tekstów + test blokujący nowe kliknięcia po tekście — **otwarte** (po scaleniu 0.20).
  3. Ponawianie pojedynczego scenariusza raz; w przebiegach wydań do App Store wyłączone (tryb ścisły) — **otwarte** (po scaleniu 0.20).

## L-005 (14.10.2026) — równoległe pełne verify przeciążają maszynę i dają fałszywe porażki
- **Co się stało:** 4–5 agentów naraz uruchamiało `npm run verify` na 4 rdzeniach (obciążenie 15–24): przekroczenia czasu testów, SIGKILL, ubite przebiegi po 30 min; każdy agent ręcznie powtarzał pliki i składał verify z kawałków.
- **Przyczyna źródłowa:** brak koordynacji zasobu wspólnego — każdy agent dostaje polecenie „pełne verify przed pushem”, nikt nie pilnuje, ile ich biegnie naraz.
- **Ocena zakresu: systemowa** (dotyczy każdej pracy równoległej agentów na jednej maszynie).
- **Akcje:**
  1. Kolejka verify: `scratchpad/tools/verify-kolejka.sh` (flock — jeden pełny verify naraz); polecenie dla agentów — **zrobione** (od 14.10, ok. 15:45).
  2. Przy następnym przeglądzie procesu: reguła w CLAUDE.md o kolejce verify przy pracy równoległej — **otwarte**.

## L-004 (14.10.2026) — podgląd zrzutów do sklepu na danych testowych
- **Co się stało:** do akceptacji podpisów pokazałem właścicielowi ramki nałożone na zrzuty z E2E (angielski interfejs, lb, wykres bez danych, plan „wszystkie dni FBW A”, pusta lista szablonów). Właściciel: „to nie są materiały marketingowe”.
- **Przyczyna źródłowa:** pośpiech z pokazaniem czegokolwiek zamiast najpierw ustalenia, co ekrany mają przedstawiać (scenorys) i obejrzenia wyniku własnymi oczami pod kątem odbiorcy; agent przygotował workflow i dane bez przebiegu i bez przeglądu obrazów.
- **Ocena zakresu: systemowa (lekka).** Ta sama luka grozi przy każdym materiale dla odbiorcy zewnętrznego (strona, opis, grafiki).
- **Akcje:**
  1. Materiał dla odbiorcy zewnętrznego: najpierw scenorys/cel do akceptacji, potem wykonanie, potem przegląd koordynatora (obejrzenie wyniku), dopiero potem pokazanie właścicielowi — **zrobione** (stosowane przy zrzutach: scratchpad/scenorys-zrzuty.md).
  2. Zrzuty do sklepu: przebieg dowodowy na symulatorze i przegląd każdego obrazu przed pokazaniem — **w toku** (f020-sklep).

## L-003 (14.10.2026) — słoweński odrzucony przez App Store Connect przy zapisie lokalizacji zakupów

- **Co się stało:** pierwszy zapis lokalizacji (skrypt `scripts/asc/iap-localizations.mjs`, run 38547020658) — 108 z 112 utworzonych,
  4 błędy 409 `UNSUPPORTED_LOCALE_CODE` dla `sl`. Bez skutków dla użytkowników; skrypt poszedł dalej, nic nie usunął.
- **Przyczyna źródłowa:** lista lokalizacji ASC przyjęta ze strony Apple dla metadanych aplikacji; dla zakupów lista jest węższa. Ryzyko było
  zapisane jako „[DO POTWIERDZENIA przy pierwszym apply]”, ale dry-run tego nie sprawdza (ASC nie ma trybu walidacji bez zapisu).
- **Ocena zakresu: lokalna.** Fakt o jednej usłudze Apple; skrypt już izoluje błąd pozycji. Bez zmiany modelu pracy.
- **Akcje:**
  1. `sl` → `ascLocale: null`, testy 4 × 27 — **zrobione** (1940697).
  2. Skrypt zapisu odporny na błąd pojedynczej pozycji (już był) — **zrobione**.

## L-002 (14.10.2026) — błędna informacja dla właściciela: „miejsca jadą z treningiem”

- **Co się stało:** w pytaniu o miejsca (0.19, pytanie 6) podałem właścicielowi, że miejsce przenosi się z treningiem; w kodzie miejsca były
  już przypisane do daty (P7 A). Właściciel podjął decyzję na podstawie fałszywej przesłanki; sprostowane w docs/18.
- **Przyczyna źródłowa:** opis zachowania wzięty z pamięci rozmowy i dokumentów, nie z kodu (zasada „udokumentowane ≠ zaimplementowane”).
- **Ocena zakresu: systemowa.** Ta sama luka (opis z pamięci zamiast z kodu) może dotyczyć każdej decyzji właściciela. Właściciel
  14.10.2026 nie przyjął tego jako osobnej zasady modelu pracy — zostaje praktyką koordynatora (akcja 1).
- **Akcje:**
  1. Reguła: przy pytaniu właściciela o zachowanie istniejącej funkcji opis stanu obecnego sprawdzam w kodzie lub testem (ścieżka pliku
     w uzasadnieniu opcji) — **zrobione** (ten wpis; stosowane w pytaniach od 14.10).

## L-001 (14.10.2026) — TestFlight 0.18 (build 1015) bez uprawnienia do Zdrowia — WYSOKI

- **Co się stało:** właściciel na telefonie: „Pokazuj dane z Apple Health” → „Nie udało się włączyć Apple Health”; zakończony trening
  czeka w kolejce („Czeka na zapis w Apple Health: 1”). Zapis do Zdrowia działał w buildach do 1014.
- **Przyczyna źródłowa:** zmiana podpisu w `testflight.yml` (88a5342, archiwum z `CODE_SIGNING_ALLOWED=NO`, podpis dopiero przy eksporcie)
  usunęła z aplikacji i zegarka `com.apple.developer.healthkit` (dowód: run 38549517589 — .ipa bez klucza; wariant z `codesign` z plikiem
  uprawnień — klucz jest). Ryzyko było zapisane jako „Niepotwierdzone (rozstrzygnie pierwszy build)”, ale:
  - nie było automatycznego sprawdzenia uprawnień w zbudowanym pakiecie — testy sprawdzały plik w projekcie, nie podpisaną aplikację;
  - „sprawdzę po buildzie” było postanowieniem, nie krokiem — nikt tego nie sprawdził przed instalacją u właściciela;
  - zadanie dla właściciela „sprawdź 0.18 na telefonie” było zbiorcze i odłożone, więc błąd wyszedł przy zwykłym używaniu.
- **Ocena zakresu: systemowa** (trzy luki modelu pracy, nie tylko podpis):
  - zmiana procesu budowania sprawdzona tylko testami pliku workflowu, bez przebiegu dowodowego na prawdziwym buildzie przed scaleniem;
  - ryzyko „niepotwierdzone” bez właściciela, terminu i warunku blokującego — znika w dokumencie;
  - sprawdzenie na telefonie po buildzie odłożone na później zamiast jako pierwsze zadanie po instalacji.
  Zmiany modelu pracy przyjęte przez właściciela 14.10.2026: przebieg dowodowy CI, rejestr ryzyk z blokadą, telefon zaraz po buildzie (CLAUDE.md).
- **Akcje:**
  1. Podpis uprawnień przed eksportem (`codesign` z plikami uprawnień) — **w toku** (gałąź f020-podpis-uprawnienia, 8ad01e4; potwierdzi
     pierwszy TestFlight 0.20 na telefonie).
  2. Strażnik w `testflight.yml`: eksport do pliku → `scripts/ci/check-entitlements.sh` (uprawnienia aplikacji i zegarka, `get-task-allow`)
     → dopiero wysyłka; brak uprawnienia zatrzymuje build przed TestFlight. Testy w `tests/public-repo.test.ts`, regres
     w `tests/regress.test.tsx` — **w toku** (ta sama gałąź).
  3. Reguła: każde ryzyko zapisane jako „niepotwierdzone / rozstrzygnie build” dostaje automatyczne sprawdzenie albo konkretny krok
     dla właściciela z datą, zanim build trafi na telefon — **zrobione** (ten wpis + zasada w CLAUDE.md).
  4. Po każdej zmianie sposobu budowania/podpisu: pierwsze zadanie dla właściciela po instalacji to sprawdzenie Zdrowia (włączenie
     odczytu, zakończony trening widoczny w Zdrowiu) i Live Activity — **otwarte** (przy TestFlight 0.20).
  5. Komunikat „Nie udało się zapisać w Apple Health… Sprawdź zgodę” myli, gdy przyczyną jest brak uprawnienia w aplikacji — backlog
     (ŚREDNI, 0.21) — **otwarte**.
