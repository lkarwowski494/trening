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
| R-011 | M1-058: `scripts/ci/sim-wybor.mjs` w obu krokach „Simulator” `e2e-ios.yml` (Node na maszynie macOS, format listy `simctl`); nie wiadomo, czy obraz macos-26 ma iPhone SE (375 pt) — bez niego „mały ekran” zostaje 390 pt (16e/17e), a log pokaże to wprost | przebieg `e2e-ios.yml` z wejściem `urzadzenie` jak w `nightly.yml` i `tylko_scenariusze: 01`: w logu „Ekran: … szerokość ekranu N pt”; decyzja co do braku SE (właściciel) | **zamknięte 21.10.2026** — dowód: nocny przebieg 39537208004 („Ekran: iPhone 17e — szerokość ekranu 390 pt”), SE niedostępny w obrazie macos-26; decyzja właściciela 21.10.2026: 390 pt wystarcza (docs/18) |
| R-012 | M1-062 (DEC-27): test aktualizacji bierze poprzednią wersję z pliku wydania `Trening-sim.zip`; zadanie „tag” w `testflight.yml` ma go dołączać (pobranie artefaktu `trening-sim-app` z zielonego przebiegu E2E, `gh release upload`), a `poprzednia-wersja.sh` pobierać na GitHub Actions. Linux tego nie sprawdzi; do czasu pierwszego wydania z plikiem E2E z testem aktualizacji kończy się błędem (zamierzone) | dowód 1: plik `Trening-sim.zip` dołączony ręcznie do istniejącego wydania + `e2e-ios.yml` (pakiet podstawowy) zielony z logiem „Poprzednia wersja (plik wydania): <tag>” i wersją oraz buildem obu aplikacji; dowód 2: pierwsze prawdziwe wydanie TestFlight — krok „Plik wydania Trening-sim.zip” zielony, wydanie ma plik | **otwarte** — przebieg dowodowy do zlecenia (raport M2, partia 4)
| R-013 | M3 (STOP E3, 21.10.2026): ikona zegarka 1088×1088 we własnym `AppIcon.appiconset` (`docs/design/ikona/konfiguracja.md` §2) — nie wiadomo, czy `actool` przyjmie rozmiar 1088 w zestawie watchOS (Linux tego nie sprawdzi) | przebieg dowodowy `ios-unsigned.yml` na gałęzi partii p1: bez ostrzeżeń `actool` o AppIcon zegarka, `Assets.car` w `.app` zegarka; inaczej powrót do 1024 (opcja b ze STOP E3) | **zamknięte 21.10.2026** — przebieg `ios-unsigned.yml` nr 22 (39597639278) na commicie `f520f07` gałęzi M3: zielony; w logu cel `TreningWatch` — „Generate Asset Symbols Assets.xcassets” i „Emplaced …/TreningWatch.app/Assets.car”, bez ostrzeżeń o AppIcon ani o rozmiarze 1088 (`grep` logu: 0 trafień na actool/AppIcon przy celu zegarka). Jeśli ikona zegarka nie pokaże się na zegarku (lista „tylko telefon”) — wraca 1024 (opcja b ze STOP E3) |
| R-014 | M3: treść krojem systemowym (`fontFamily: 'System'` + `fontWeight`) zamiast IBM Plex — nie wiadomo, czy iOS sam pogrubia go przy „Pogrubiony tekst” (M1-024 dotąd robił to ręcznie dla Plex) | lista „tylko telefon” po pierwszym TestFlight z partią p1: włączyć „Pogrubiony tekst” → treść i przyciski grubsze; jeśli nie — przesunięcie wagi w `font()` (`docs/design/theme.ts`) i test | otwarte (21.10.2026) |

## L-017 (21.10.2026, M3) — przebieg E2E 39676394005: tablica „teraz” ukrywała pole wpisu przed VoiceOver, ⓘ w Postępach przewijało na górę

- **Co się stało:** E2E pokazał (1) scenariusz 11: po „Seria zrobiona” bez ciężaru pole `board-input-weight` niewidoczne dla XCTest — leżało w grupie `accessible` (`board-desc`), więc iOS chował je także przed VoiceOver (bariera dostępności); (2) scenariusz 05: stuknięcie ⓘ nisko na ekranie Postępów przewijało ekran na górę; (3) scenariusz 35: po wyborze „RIR” trening pokazał RPE (w kodzie aplikacji zapis i odczyt skali działają — test Jest przechodzi; przyczyna w scenariuszu: wybór segmentu po tekście „RIR”, bez id).
- **Przyczyna źródłowa:** (1) testy Jest sprawdzały etykietę opisu tablicy i obecność pola, ale nie relację „potomek grupy accessible” — Jest nie odtwarza reguły iOS, że grupa chowa potomków; (2) `contentOffset` ScrollView ustawiany z refa w każdym renderze (zmiana M3 p3) — testy sprawdzały wybór chipa, nie stabilność przewinięcia po rerenderze; (3) scenariusz bez testID w segmencie i bez asercji zaznaczenia.
- **Ocena zakresu: systemowa** dla (1) i (2): ta sama luka (reguła platformy lub rerender niewidoczne w Jest) może wrócić w innym ekranie. Propozycja dla właściciela: (a) strażniki ogólne w Jest dla klas błędów (zrobione dla tablicy: żaden przycisk ani pole nie leży pod `accessible`; `contentOffset` bez zmian po rerenderze) — tanie, pokrywają znane miejsca; (b) strażnik po całym drzewie wszystkich ekranów (każdy element interaktywny bez przodka `accessible`) — szerszy, ryzyko fałszywych alarmów przy wierszach list. Rekomendacja: (a) teraz, (b) jako osobne zadanie.
- **Akcje:** 1. `tests/m3-fix-e2e.test.tsx` (E2E-11, E2E-05, E2E-35) — **zrobione** (commity „[M3 fix]”). 2. Reguła scenariuszy: wybór segmentu po `testID` z asercją `selected` — **zrobione** (scenariusz 35). 3. Strażnik Maestro: `pressKey: Enter` zaraz po wpisie w wyszukiwarce wyboru ćwiczenia — **zrobione** (ten sam plik testów). 4. Strażnik ogólny (b) — **otwarte** (propozycja).

## L-016 (21.10.2026, M3) — scalenie main wypchnięte mimo `verify` EXIT 1 (README nieaktualny)

- **Co się stało:** commit 6140082 (scalenie main do gałęzi M3) wypchnięty, choć pełne `verify` w pliku dowodu kończyło się `EXIT 1` (`check:readme`: README z podwójnym wierszem „README.md” w drzewie katalogów). Naprawione w 63d3514 (README przegenerowany, `check:readme` i `tests/readme.test.ts` zielone).
- **Przyczyna źródłowa:** (1) koordynator M3 ocenił wynik po kodzie wyjścia polecenia uruchomionego w tle, który zawsze wynosi 0 (polecenie kończy się `echo "EXIT $?" >> plik`), a nie po linii `EXIT` w pliku; (2) README przegenerowany w trakcie scalania **przed** `git add` rozwiązanych plików: `scripts/readme.mjs` bierze listę z `git ls-files`, które przy nierozwiązanym konflikcie wypisuje plik raz na każdy etap konfliktu → zdublowany wiersz „README.md” (przyczynę odtworzył testem koordynator projektu, 21.10.2026; pierwotny zapis tej lekcji wskazywał błędnie worktree agentów).
- **Ocena zakresu: systemowa** (każde `verify` w tle i każda praca równoległa w worktree). Akcje-mechanizmy: hak pre-push (decyzja właściciela 21.10.2026, L-009/L-015 — wdraża koordynator projektu na main) zablokuje takie wypchnięcie; `scripts/readme.mjs` bez powtórzeń z `git ls-files` (+ `.claude` w ścieżce awaryjnej bez gita) z testem `tests/readme-ls-files.test.ts` — koordynator projektu, gałąź `sprzatanie-galezi`; do czasu scalenia: przy scalaniu najpierw rozwiązanie konfliktów i `git add`, dopiero potem `readme.mjs --write`.
- **Akcje:**
  1. README przegenerowany — **zrobione** (63d3514).
  2. Polecenie `verify` w tle w przebiegu M3 kończy się odczytem `tail -1` pliku dowodu, a decyzja o commicie zależy od tej linii — **zrobione** (praktyka M3 od 21.10; wzór w `audit/…/postep.md`).
  3. Generator README odporny na konflikt scalania — **w toku** (koordynator projektu, `sprzatanie-galezi`); do tego czasu kolejność „rozwiąż → git add → --write” w scalaniach M3 — **zrobione** (praktyka M3).
  4. Hak pre-push — **w toku** (koordynator, L-015).
  5. **Powtórzenie 21.10.2026 ~21:00:** d2b9d5a (poprawka wibracji przy ✓) wypchnięte z nieaktualnym `docs/19` — lokalne `verify` EXIT 0, CI (39674286427) czerwone na `check:matrix`; naprawione w 4abd1b7 (CI 39677132378 zielone). Przyczyna nieustalona (macierz przegenerowana przed ostatnią zmianą testów albo różnica środowiska). Trzecie wystąpienie klasy „pliki generowane” w M3 → mechanizm: hak pre-push (w toku, koordynator) — do czasu jego scalenia polecenia M3 każą przegenerować macierz i README **bezpośrednio przed** końcowym `verify`, po ostatniej zmianie plików.

## L-015 (21.10.2026, M3) — `tests.yml` czerwony na każdym wypchnięciu gałęzi `redesign/trening-2026-10-21` (9 przebiegów)

- **Co się stało:** od 09:17 każdy przebieg „Testy (każde wypchnięcie)” na gałęzi M3 kończył się błędem (39575739645 … 39584701537). Pierwszy: `check:matrix` — `docs/19-macierz-testow.md` nieaktualny po commicie `6212579` (koordynator, zmiana `tests/audit-m1-045-store-description.test.ts` bez `test-matrix.mjs --write`). Od `4d5cdfe` (rola 04, E2) wcześniej pada `lint`: narzędzia makiet w `docs/design/narzedzia/` (`ikona.mjs` — `Buffer` bez importu; `zrzuty.mjs`, `ikona.mjs`, `warsztat.mjs` — import `playwright`, którego nie ma w zależnościach). Za `lint` czekał trzeci błąd, zasłonięty wcześniejszym: `tests/public-repo.test.ts` (adres e-mail autora kroju w `docs/design/fonty/saira-condensed/OFL.txt`, krój odrzucony, plik TTF usunięty w E3). Nikt tego nie zauważył przez 8 wypchnięć; wykryte w E4 roli 04 przy przeglądzie `eslint docs/design`. Kod aplikacji i testy Jest były zielone (402/402 w przebiegu 39575739645).
- **Przyczyna źródłowa:** (1) polecenia etapów M3 dla roli 04 wymagają przed commitem tylko wybranych testów (`readme.test.ts`), a nie `lint` ani `check:matrix`, a pliki `.mjs` w `docs/` nie są wyłączone z `eslint .` (wyłączone są `scripts/**`, `tests/**`) — narzędzia projektu traktowano jak „nie kod aplikacji”; (2) po wypchnięciu nikt nie sprawdza wyniku CI (`gh run list --branch …`) — ani subagent, ani koordynator; to ta sama luka co L-009 (wypchnięcie bez pełnego verify), tu na gałęzi bez wydania, więc czerwony stan nie blokował nikogo i nie był widoczny.
- **Naprawa (lokalna):** `docs/design/narzedzia/*.mjs` — `import { Buffer } from 'node:buffer'` i wyjątek `import/no-unresolved` z powodem przy imporcie Playwrighta (narzędzie spoza projektu, zasada „bez nowych zależności”); `docs/19` przegenerowany; usunięty zbędny `OFL.txt` odrzuconego kroju Saira Condensed (bez pliku kroju licencja nie jest potrzebna). Po naprawie lokalnie: `eslint .` 0 błędów, `check:matrix` zgodny. Wynik CI po wypchnięciu: `audit/M3-2026-10-21/role/04-build/stop-e4.md`.
- **Ocena zakresu: systemowa** (każdy etap bez wydania na gałęzi roboczej może tak samo długo leżeć na czerwono). Propozycja dla właściciela: (a) w każdym poleceniu etapu M3 (i w szablonie koordynatora) krok po wypchnięciu: `gh run list --branch <gałąź> --limit 1` i przy czerwonym — naprawa przed STOP-em; plus hak pre-push z L-009 (a) rozszerzony o `lint` i `check:matrix`; (b) tylko krok w poleceniach (postanowienie, słabsze). Rekomendacja: (a) — hak łapie błąd przed wypchnięciem, krok `gh run` łapie resztę (Jest, eksport iOS).
- **Akcje:**
  1. Naprawa lintu narzędzi i `docs/19` — **zrobione** (commit E4 roli 04, 21.10.2026).
  2. Krok „sprawdź CI po wypchnięciu” w poleceniach etapów M3 — **zrobione** (decyzja właściciela 21.10.2026; polecenia M3 od partii p1).
  3. Hak pre-push z `lint` + `check:readme` + `check:matrix` (L-009 a) — **w toku** (decyzja właściciela 21.10.2026; wdrożenie na main — koordynator projektu).

## L-014 (21.10.2026, M3) — błędna uwaga dla właściciela o makiecie: „w A2 ciemnym przyciski są ciemne”

- **Co się stało:** przy przekazaniu STOP E2b koordynator napisał właścicielowi, że na `docs/design/porownanie-a.png` w wariancie A2 (ciemny motyw)
  przyciski „Seria zrobiona” i „Pomiń” są ciemne, inaczej niż w A1. Projektant w E3 tego nie odtworzył; `cmp` pokazał, że zrzuty
  A1 i A2 karty „teraz” (390 pt, jasny i ciemny) są identyczne bajt w bajt. Koordynator pomylił kolumny (A1 jasny, A2 jasny, A1 ciemny, A2 ciemny)
  na obrazie zmniejszonym do ok. 40% (1720 → 730 px). Sprostowane w odpowiedzi do właściciela 21.10.2026; decyzji na tej podstawie nie podjęto.
- **Przyczyna źródłowa:** twierdzenie o różnicy między wariantami oparte na podglądzie w małej skali, bez sprawdzenia plików źródłowych —
  ta sama klasa co L-002 (opis bez sprawdzenia u źródła), tu dla obrazów.
- **Ocena zakresu: systemowa** (każda uwaga wizualna z podglądu arkusza może być błędna tak samo). Propozycja dla właściciela: (a) reguła w CLAUDE.md —
  uwaga o różnicy wizualnej dla właściciela tylko po sprawdzeniu plików (`cmp`/różnica pikseli albo kadr w pełnej rozdzielczości, ścieżka w uwadze);
  (b) praktyka koordynatora bez reguły. Rekomendacja: (a).
- **Akcje:**
  1. Sprawdzenie plików przed uwagą wizualną w przebiegu M3 (polecenia koordynatora od E3) — **zrobione** (ten wpis; dziennik `postep.md` M3).
  2. Reguła w CLAUDE.md — **zrobione** (decyzja właściciela 21.10.2026, wariant a; linia „Uwagi wizualne dla właściciela”).

## L-013 (21.10.2026) — nocny przebieg czerwony od 16.10 bez reakcji: mutacje nie mierzą się, martwa gałąź w liście nocnej, E2E 17e pada deterministycznie

- **Co się stało:** przegląd nocnego przebiegu (run 39537208004, main 0fd4687; tester-e2e) — trzy niezależne przyczyny:
  (1) **mutacje (main)** padają w dry-run Strykera po ~2 min: strażnik `tests/limits-single-source.test.ts` (M1-053, 20.10) szuka literału 1800 w `lib/`,
  a Stryker instrumentuje `lib/` i wstawia id mutantów jako liczby (`stryMutAct_9fa48("1800")` w `plan.ts:80`) — fałszywe trafienie; pomiaru siły testów brak;
  (2) **mutacje i strefy na `feature/e2-swap`** — gałąź scalona w PR #13 dalej w domyślnym `NIGHTLY_REFS` (`nightly.yml`, `tests-tz.yml`), jej stary kod pada;
  (3) **E2E pełny katalog na iPhone 17e (390 pt)** — 21 scenariuszy pada dwa razy na „Bench Press (Dumbbell)” w podprzepływie `szablon-testowy.yaml`
  (wiersz wyników tuż nad klawiaturą, stuknięcie trafia w klawiaturę), plus 07, 12, 31 (do potwierdzenia zrzutem). Na iPhone 17 (pakiet podstawowy) te same zielone.
  Ponadto: zadanie `e2e-maly-ekran-ciemny` w praktyce testuje **jasny** motyw (ustawienie aplikacji `theme: 'light'` po czystej instalacji przesłania wygląd systemu).
- **Przyczyna źródłowa:** (a) zasada „przegląd nocy zbiorczo raz dziennie” (CLAUDE.md, 19.10) jest postanowieniem bez mechanizmu — przy pracy nad M2 i przekazaniu konta
  nikt nie przeglądał nocy; czerwień od 16.10 nie miała właściciela; (b) strażnik z 20.10 nie był uruchomiony pod Strykerem (verify go nie uruchamia);
  (c) lista nocnych gałęzi to stała w workflowie, nie wynika z tego, które gałęzie żyją; (d) scenariusze pisane i sprawdzane tylko na iPhone 17.
- **Ocena zakresu: systemowa** (sygnał nocny ignorowany = brak bramki „3 czyste noce” przed App Store; licznik dziś 0).
  Opcje dla właściciela: (A) koordynator na początku każdej sesji czyta wynik ostatniej nocy (krok w docs/43 „Zasady pracy”) — tanie, ale znów postanowienie;
  (B) zadanie zbiorcze w `nightly.yml`, które przy czerwieni otwiera/aktualizuje jedno zgłoszenie (issue) z listą porażek — mechanizm, sygnał w GitHubie i w powiadomieniach;
  (C) zaplanowane zadanie Claude raz dziennie (przegląd nocy, raport) — mechanizm, ale zużywa limit. Rekomendacja: B (+A jako uzupełnienie).
- **Akcje:**
  1. Strażnik limitów wycina instrumentację Strykera (`bezInstrumentacji`) + test na przykładzie z `plan.ts:80`; dowód: `MUT_TESTS=limits-single-source npx stryker run --dryRunOnly` EXIT 0 („Initial test run succeeded”) — **zrobione** (gałąź `claude/optimistic-clarke-9tj0im`).
  2. Domyślny `NIGHTLY_REFS` = `["main"]` w `nightly.yml` i `tests-tz.yml`, strażnik w `tests/public-repo.test.ts` — **zrobione** (zmiana workflowu → PR do zatwierdzenia przez właściciela).
  3. Scenariusze na małym ekranie: po `inputText` w wyszukiwarce wyboru ćwiczenia zamknięcie klawiatury przed stuknięciem wiersza + strażnik w `tests/maestro-selectors.test.ts`; 12 i 31 — zrzut przed stuknięciem — **zrobione 21.10.2026** (gałąź `e2e-maly-ekran`, dowód niżej; właściciel 21.10: teraz, równolegle z M3).
     Stan (21.10.2026, gałąź `e2e-maly-ekran`): strażnik „każdy `inputText` po `tapOn` wyszukiwarki ma `pressKey: Enter` przed następnym stuknięciem (poza „Continue”)” (31 miejsc w 19 plikach, razem z `subflows/szablon-testowy.yaml`; czerwony przed poprawką)
     + `pressKey: Enter` w 30 miejscach (klawisz „search” kończy edycję i chowa klawiaturę — wzorzec jak po nazwie szablonu; jedno wspólne wejście nie powstało, bo `runFlow` z `env:` nie jest obsługiwane przez interpreter
     i nie da się go sprawdzić na Linuksie — strażnik pilnuje spójności zamiast kopiowania). 07, 08, 12 i podprzepływ obejmuje ta sama poprawka (07: wiersz pod chipem miejsca leży niżej niż w 08).
     12 i 31: przyczyna `skipped today` — **hipoteza** (zrzut 31: koniec listy bez wiersza; po zwinięciu ćwiczenia lista się skraca i przewija do końca, wiersz leży nad ekranem): wyśrodkowanie + zrzuty przed i po stuknięciu
     + `scrollUntilVisible … UP` zamiast czekania na ekranie; zrzuty rozstrzygną przy następnej porażce.
     Dowód na symulatorze (`e2e-ios.yml`, gałąź `e2e-maly-ekran`, `urzadzenie` i `wyglad` jak w nocy): run 39578355425 (pełny katalog, aplikacja z nocnego przebiegu) — 36 z 42 zielonych za pierwszym razem, 1 w ponowieniu (24),
     5 czerwonych: 14 i 34 to **niezgodność aplikacji z przebiegu (main 0fd4687) ze scenariuszami z gałęzi** (14 oczekuje nowszego brzmienia zdania ACSM; 34 — ekran awaryjny „Could not open your data” przy aplikacji z artefaktu, tego nie odtworzył świeży build),
     08, 13, 32 to dalsze przyczyny małego ekranu (ⓘ zakresu przy krawędzi; „Remove place” pod krawędzią; stuknięcie „Set 2 done” trafiało w zakładkę „More” — zrzut kroku „Skip”) → poprawione w 25b8566.
     Run 39590138756 (świeży build z gałęzi, scenariusze 01 07 08 12 13 14 24 31 32 33 34): **11/11 zielonych za pierwszym razem**, w tym 12 i 31. **Zrobione** poza tym, że przyczyna `skipped today` pozostaje hipotezą (po poprawce zielone; zrzuty 46a/46b i 83a/83b rozstrzygną przy ewentualnym nawrocie).
     Wniosek procesowy: `aplikacja_z_przebiegu` bierze aplikację z innego commitu — przy gałęzi starszej/nowszej od niej scenariusze oczekują innego tekstu (jak L-011); do dowodu na gałęzi używać świeżego builda, gdy gałąź ma zmiany w `app/`, `lib/` lub tekstach.
  4. Ciemny motyw w nocnym E2E rzeczywiście ciemny (ustawienie „Auto” na starcie albo osobny scenariusz) — **otwarte**.
  5. Mechanizm przeglądu nocy — właściciel 21.10: **B** (zgłoszenie z `nightly.yml`) — **w toku**.
  6. R-011: obraz macos-26 nie ma iPhone SE — właściciel 21.10: 390 pt wystarcza — **zrobione** (R-011 zamknięte).

## L-012 (21.10.2026) — czerwony tests.yml na main: losowe id ćwiczenia zaczęło się od „8432”, liczby szukanej przez niezmiennik Zdrowia

- **Co się stało:** `tests.yml` na main po scaleniu PR #16 (run 39549939632, d171db1) czerwony: `tests/health-query.test.ts`, niezmiennik (a)
  „wartości ze Zdrowia nie trafiają do stanu” znalazł „8432” (kroki z fałszywego Zdrowia) w losowym id ćwiczenia `"8432ed24-…"`. Aplikacja bez błędu
  (ocena: **teoretyczny** dla użytkownika — tylko test; realny dla CI, ok. 1 na kilkaset przebiegów).
- **Przyczyna źródłowa:** poprawka z 12.10 (ta sama liczba w środku id) wykluczyła tylko znaki **przed** liczbą; po liczbie dopuszczała litery hex,
  więc id zaczynające się od niej nadal pasowało. Poprawka powstała z jednego przypadku, bez testu samego wzorca na wszystkich położeniach w UUID.
  Głębiej: niezmiennik „brak liczby X” sprawdzany na danych z losowym UUID jest z natury niedeterministyczny.
- **Ocena zakresu: systemowa** (drugie wystąpienie tej samej klasy; inne testy „brak wartości w JSON” mogą mieć to samo).
  Opcje: (A) zawężony wzorzec + test samego wzorca na id z liczbą na początku, w środku i po „-” (**zrobione**, tanie, tylko ten test);
  (B) deterministyczne `randomUUID` w testach (stałe ziarno w konfiguracji Jest) — usuwa całą klasę, ale zmienia dane we wszystkich testach
  i może ukryć błędy zależne od unikalności id. Rekomendacja: A teraz, B dopiero przy trzecim wystąpieniu.
- **Akcje:**
  1. `tests/health-query.test.ts`: wzorzec `lone()` wyklucza litery i „-” także po liczbie; asercje wzorca na id „8432ed24-…”, „a-8432-b”, „18432”
     oraz na wyciekach `8432`, `8432.5`, `"8432"` — **zrobione** (gałąź `claude/optimistic-clarke-9tj0im`).
  2. Decyzja właściciela A/B dla całej klasy — **otwarte**.

## L-011 (20.10.2026, audyt M1) — zmiana etykiety w ustawieniach położyła scenariusze 33 i 34 testu aktualizacji (stara wersja ma inne etykiety)

- **Co się stało:** E2E pakiet podstawowy (run 39427683836): 33 szukał „Measurement system” (LOK-07, partia 4) na POPRZEDNIEJ wersji (v0.20.0-b1018),
  która ma „Weight unit” bez testID segmentu → porażka; 34 padł na „Pause workout”, bo 33 nie przygotował treningu w toku (skutek, nie osobna przyczyna).
  Ponadto 09 (po zmianie LOK-07 dystans w yd): klawiatura numeryczna została na ekranie, bo tekst karty „Change the values…” przy dwóch ćwiczeniach
  leży pod klawiaturą, a pasek zakładek jest zasłonięty → „Settings” nie pojawia się. 01: stuknięcie zakładki „More” zaraz po starcie zgubione (przeszło po ponowieniu).
- **Dodatkowo (run 39427688524):** 32 padł na „Save measurement” — po scrollUntilVisible bez centerElement pozycja „Body weight — measurements” ledwie wystawała nad pasek zakładek i stuknięcie ją ominęło (zrzut: wciąż Progress); 29 miał już centerElement, 15/19/32/33 nie. Poprawione we wszystkich, strażnik w teście.
- **Przyczyna źródłowa:** (1) test w Jest uruchamia 33 na BIEŻĄCYM UI, więc nie widzi, że etykiety starej wersji są inne; nic nie wiązało zmiany etykiety
  z listą scenariuszy, które działają na poprzedniej wersji. (2) interpreter szacuje układ i nie wykrył tekstu pod klawiaturą przy dwóch ćwiczeniach.
  (3) podprzepływ nie czekał na efekt stuknięcia zakładki (ta sama klasa co run 39185287611).
- **Ocena zakresu: systemowa** — każda zmiana etykiety/id w ekranie używanym przez 33 lub 34 znów je położy, a wychodzi to dopiero w CI.
  Opcje: (A) strażnik tekstowy na 33/34 + lista „etykiety obu wersji” w nagłówku (przyjęte tu, tanie, nie wykrywa nowych przypadków samo);
  (B) test w Jest uruchamiający 33 na migawce UI poprzedniego tagu (dokładny, kosztowny: trzeba trzymać drugie drzewo kodu). Rekomendacja: A teraz, B jeśli się powtórzy.
- **Akcje:**
  1. Strażniki `tests/maestro-przebieg-39427683836.test.ts` (33: brak id unit-system, etykiety obu wersji; 09: fokus zdejmuje „Previous”; podprzepływ: retry zakładki) — **zrobione**.
  2. Reguła przy zmianie etykiety/id w Ustawieniach, Szablonach, Planie lub ekranie treningu: sprawdź `.maestro/33-*.yaml` i `34-*.yaml` (muszą działać na poprzedniej wersji) — **zrobione** (komentarz w 33 + ten wpis).
  3. Szybki przebieg `tylko_scenariusze` przy każdej zmianie scenariusza lub etykiety obejmuje 33 i 34 — **otwarte** (nawyk koordynatora; do zapisania w liście kontrolnej wydania).

## L-010 (20.10.2026, audyt M1) — zmiana układu ekranu treningu (karta zgody M1-035, „⋯” M1-028) położyła trzy scenariusze pakietu podstawowego
- **Co się stało:** E2E pakietu podstawowego na `audyt-m1` (run 39399241275, f37c5a4): 36 (brak `w-0-0`/`r-0-0`), 13 („Set 1 done”) i 31 („Resume workout”) padły. Hipoteza strażnika pętli awarii (R-005) nie potwierdziła się: 36 pada przed pierwszym restartem, scenariusze z restartami (02, 32, 41) przeszły. Przyczyny: (a) na czystej instalacji karta zgody na powiadomienia wydłuża ekran treningu — pola serii pod klawiaturą, „Set done” poza ekranem; (b) po odhaczeniu serii lista jest przewinięta do karty „teraz”, a „Pause workout” leży nad ekranem — hierarchia iOS go zwraca, `scrollUntilVisible` nie przewija, stuknięcie trafia w pasek stanu (ta sama klasa co E2E 105).
- **Przyczyna źródłowa:** poprawka M1-035 dodała „Not now” tylko do 31 i 41 — nikt nie sprawdził, które scenariusze startują trening na czystej instalacji; interpreter Maestro nie modeluje klawiatury ani przycinania hierarchii, więc Jest tego nie złapał, a E2E na symulatorze nie biegło przed wypchnięciem partii (macOS tylko w CI).
- **Akcje:** test strażnik kolejności kroków `tests/maestro-e2e39399.test.ts` (karta zamknięta w podprzepływie `start-szablonu` i w 13; swipe na początek listy przed pauzą w 31) — zrobione; szybki przebieg `tylko_scenariusze` przed oddaniem partii zmieniającej układ ekranu treningu — reguła już w CLAUDE.md, tu zastosowana.
- **Ciąg dalszy (run 39410740673):** po zamknięciu karty 13 i 36 nadal padały — hierarchia pokazała kartę „teraz” o wysokości 761 pt z ok. 520 pt pustego miejsca na grafikę (`focus-done` na y 863, wiersze serii poza ekranem). Podejrzana przyczyna (nie potwierdzona na urządzeniu): `onLayout` miejsca na grafikę zapamiętywał `Math.ceil(wysokość)`, a szum float układu (minHeight + 1e-5) dawał +1 pt na każde przeliczenie. Poprawka: `slotHeight` z tolerancją 0,05 pt (`tests/slot-height.test.ts`). To jest błąd aplikacji (realny — pierwszy trening z hantlami na czystej instalacji), nie scenariusza; Jest go nie widział, bo nie ma silnika układu.
- **Zakres:** lokalna (scenariusze); R-005 pozostaje otwarte do przebiegu pełnego (brak dowodu na fałszywy alarm, brak dowodu przeciw).

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
  1. Naprawa: `eslint` w `devDependencies`, konfiguracja i krok `lint` w `npm run verify`; test akceptacyjny: `npm run lint` kończy się kodem 0 bez zmiany plików śledzonych (`git status --porcelain` pusty) — **zrobione** 20.10.2026 (M1-audytor-generalny-051: `eslint` ^9 i `eslint-config-expo` w devDependencies, `eslint.config.js`, `lint` = `eslint .` w `verify`; reguły „React Compiler” z react-hooks 7 wyłączone z powodem w konfiguracji — 109 trafień w istniejących ekranach, osobne zadanie przeglądu; 110 ostrzeżeń — głównie nieużywane zmienne — bez blokady).
  2. Mechanizm: test w `tests/`, który wymaga, by każdy skrypt z `package.json` należał do `verify` albo był na liście wyjątków z powodem (ręczne: `start`, `ios`, `android`, `screens`, `mutation`, `perf`) — **zrobione** 20.10.2026 (`tests/package-scripts.test.ts`).
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
