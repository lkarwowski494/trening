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

## L-009 (20.10.2026, audyt M1) — zmiana układu ekranu treningu (karta zgody M1-035, „⋯” M1-028) położyła trzy scenariusze pakietu podstawowego
- **Co się stało:** E2E pakietu podstawowego na `audyt-m1` (run 39399241275, f37c5a4): 36 (brak `w-0-0`/`r-0-0`), 13 („Set 1 done”) i 31 („Resume workout”) padły. Hipoteza strażnika pętli awarii (R-005) nie potwierdziła się: 36 pada przed pierwszym restartem, scenariusze z restartami (02, 32, 41) przeszły. Przyczyny: (a) na czystej instalacji karta zgody na powiadomienia wydłuża ekran treningu — pola serii pod klawiaturą, „Set done” poza ekranem; (b) po odhaczeniu serii lista jest przewinięta do karty „teraz”, a „Pause workout” leży nad ekranem — hierarchia iOS go zwraca, `scrollUntilVisible` nie przewija, stuknięcie trafia w pasek stanu (ta sama klasa co E2E 105).
- **Przyczyna źródłowa:** poprawka M1-035 dodała „Not now” tylko do 31 i 41 — nikt nie sprawdził, które scenariusze startują trening na czystej instalacji; interpreter Maestro nie modeluje klawiatury ani przycinania hierarchii, więc Jest tego nie złapał, a E2E na symulatorze nie biegło przed wypchnięciem partii (macOS tylko w CI).
- **Akcje:** test strażnik kolejności kroków `tests/maestro-e2e39399.test.ts` (karta zamknięta w podprzepływie `start-szablonu` i w 13; swipe na początek listy przed pauzą w 31) — zrobione; szybki przebieg `tylko_scenariusze` przed oddaniem partii zmieniającej układ ekranu treningu — reguła już w CLAUDE.md, tu zastosowana.
- **Ciąg dalszy (run 39410740673):** po zamknięciu karty 13 i 36 nadal padały — hierarchia pokazała kartę „teraz” o wysokości 761 pt z ok. 520 pt pustego miejsca na grafikę (`focus-done` na y 863, wiersze serii poza ekranem). Podejrzana przyczyna (nie potwierdzona na urządzeniu): `onLayout` miejsca na grafikę zapamiętywał `Math.ceil(wysokość)`, a szum float układu (minHeight + 1e-5) dawał +1 pt na każde przeliczenie. Poprawka: `slotHeight` z tolerancją 0,05 pt (`tests/slot-height.test.ts`). To jest błąd aplikacji (realny — pierwszy trening z hantlami na czystej instalacji), nie scenariusza; Jest go nie widział, bo nie ma silnika układu.
- **Zakres:** lokalna (scenariusze); R-005 pozostaje otwarte do przebiegu pełnego (brak dowodu na fałszywy alarm, brak dowodu przeciw).

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
