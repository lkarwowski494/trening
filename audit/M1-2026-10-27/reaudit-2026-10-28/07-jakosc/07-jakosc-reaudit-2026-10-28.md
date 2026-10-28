# Reaudyt: Jakość (strategia testów, gotowość wydania) — Trening — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony) · Tryb: reaudit, pętla 1 · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Środowisko: Linux x86_64 (4 rdzenie, 15 GB, bez swap), Node 22.22.0, git; MCP GitHub tylko do odczytu; brak macOS, Xcode, symulatora i Maestro.

## Werdykt: ZABLOKOWANE
Commit: 2385e75 · Kandydat do wydania: ten sam (main = 2385e75, PR #79) · Rozstrzygnął warunek: próg projektu — rejestr ryzyk z blokadą (CLAUDE.md, model po L-001 pkt 2: otwarte ryzyko blokuje wydanie); `npm run check:release` na 2385e75 kończy się kodem 1: 6 otwartych ryzyk (R-005, R-004, R-010, R-013, R-014, R-RES) — dowody/check-release.txt · Próg projektu: CLAUDE.md „Audyty i wydania” pkt 1 (blokują tylko KRYTYCZNE/WYSOKIE) i rejestr ryzyk (otwarte blokuje).

Uzasadnienie: ta rola nie ma otwartych P0/P1, pełny zestaw jest zielony w CI na 2385e75, a E2E pakietu podstawowego też jest zielone na tym SHA. Blokuje mechanizm, który naprawa M1-012 właśnie uruchomiła: bramka zgłoszenia (docs/48 Z-25b) działa i zatrzymuje wydanie na sześciu ryzykach. Pięć z nich zamknie krok właściciela na telefonie albo symulatorze, a R-010 jego decyzja. To nie są defekty kodu. Po ich zamknięciu albo odroczeniu z datą werdykt przechodzi na GOTOWE Z ZASTRZEŻENIAMI. Zastrzeżenia: aktualizacja z poprzedniej wersji na telefonie (AK-05), stan „dziś bez treningu” przy dużym tekście, noc i tests-tz na 2385e75. Build TestFlight nie jest blokowany, bo `testflight.yml` nie woła check:release (decyzja właściciela z 27.10), a R-010 z definicji nie blokuje TestFlight.

## Komendy (każda osobno)
| Komenda | Kod wyjścia | Wynik (liczby) | Uwagi |
|---|---|---|---|
| `git rev-parse HEAD` w /home/user/trening i w kopii roboczej | 0 | 2385e75 | `git status --porcelain` na starcie puste (dowody/git-status-start.txt) |
| typecheck, lint (wspólne) | 0 / 0 | — | ../wspolne/typecheck.txt, ../wspolne/lint.txt, nie powtarzane |
| `npx jest --ci --maxWorkers=1` (pełny zestaw, raz, /home/user/trening) | 0 | 539/539 zestawów, 10730 zielonych, 2 pominięte, 5 migawek | dowody/jest.txt, 4195 s jednym procesem (dowody/jest-czas.txt) |
| tests.yml 40657525976 na 2385e75 (MCP) | success | pełne verify w CI | dowody/ci-przebiegi.txt |
| e2e-ios.yml 40657526205 (pakiet podstawowy, push main) na 2385e75 (MCP) | success | — | dowody/ci-przebiegi.txt |
| e2e-ios.yml 40646282170 (acb7d72, przodek) i 40624070610 (4c73243, przodek; scenariusz 58) | success / success | — | dowody/ci-przebiegi.txt |
| `npm run check:release` | **1** | 6 otwartych ryzyk; wyjątek anonimizacji pusty | dowody/check-release.txt |
| `npm run check:decyzje` | 0 | 341 wpisów | dowody/check-decyzje.txt |
| `node scripts/pochodne.mjs` (check:pochodne) | 0 | 15 kroków zielonych, 17 s | dowody/check-pochodne.txt |
| `npx jest --ci --maxWorkers=1 tests/figury-recenzja.test.tsx` | 0 | 32/32 | dowody/jest-figury-recenzja.txt |
| `… tests/decyzje-straznik.test.ts` | 0 | 21/21 | dowody/jest-decyzje-straznik.txt |
| `… tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx` | 1, potem 0 i 0 | 9/10 (przekroczenie 5 s przy zimnej pamięci podręcznej), w powtórkach jednym procesem 10/10 dwa razy | dowody/jest-audit-m1-2026-10-27-010-stan-mam-plan.txt, dowody/jest-010-powtorka-1.txt, dowody/jest-010-powtorka-2.txt |
| `… tests/audit-m1-2026-10-27-012-rejestr-ryzyk-bramka.test.ts` | 0 | 4/4 | dowody/jest-audit-m1-2026-10-27-012-rejestr-ryzyk-bramka.txt |
| `… tests/audit-m1-2026-10-27-023-bramki-dokumenty.test.ts` | 0 | 4/4 | dowody/jest-audit-m1-2026-10-27-023-bramki-dokumenty.txt |
| `… tests/maestro-tap-tekst-guard.test.ts` | 0 | 2/2 | dowody/jest-maestro-tap-tekst-guard.txt |
| `… tests/blokada-wydania.test.ts`, `pochodne`, `hak-pre-push`, `verify-docs`, `zrodla-paczka`, `zrodla-wiedzy` | 0 (każdy) | 5, 13, 45, 36, 11, 21 | dowody/jest-blokada-wydania.txt, dowody/jest-pochodne.txt, dowody/jest-hak-pre-push.txt, dowody/jest-verify-docs.txt, dowody/jest-zrodla-paczka.txt, dowody/jest-zrodla-wiedzy.txt |
| `tests/history-calendar.test.tsx` z `--randomize`, ziarna 42, 7, 1, 2026, 99999 i 3 strefy | 0 (8 z 8) | 46/46 w każdym | dowody/kalendarz-losowa-kolejnosc.txt |
| 4 ręczne mutacje w kopii roboczej + testy powiązane | 1 przy każdym mutancie | 4/4 zabite; kopia przywrócona | dowody/mutacje-reaudit.txt |
| próbka regresji (grep workflowów, stref, wycinków) | — | bez znalezisk | dowody/proba-regresji.txt |

## Pełny zestaw
Lokalnie na 2385e75: `npx jest --ci --maxWorkers=1` → kod 0, 539/539 zestawów, 10730 testów zielonych, 2 pominięte, 0 czerwonych (dowody/jest.txt, 4195 s). Wynik zgadza się z CI tests.yml 40657525976 na tym SHA (success, pełne verify: typy, tłumaczenia, Jest, eksport iOS, strażnik paczki).

## Podsumowanie
Naprawy M2 w obszarze jakości działają. Bramka recenzji figur, strażnik decyzji, rejestr ryzyk w check:release, stan „Masz plan”, zapadka stuknięć Maestro i test kalendarza mają testy, które padają na mutacjach (4 z 4 zabite). Wszystkie przechodzą na 2385e75, a CI i E2E pakietu podstawowego są zielone na tym SHA. Nadal otwarte są trzy P2: zakres testów mutacyjnych (010), metoda pomiaru dużego tekstu w NFR (009) i opis trybu ścisłego w `e2e-ios.yml` (część 008). Nowe jest jedno P2: pola `otwarte → ID` w docs/18 nie nadążają za naprawami (601). Wydanie blokuje rejestr ryzyk: 6 ryzyk otwartych, a każde zamyka krok właściciela.

| ID | M1 | Poziom | Wynik | Dowód |
|---|---|---|---|---|
| 07-jakosc-006 | M1-005 | P2 (M1: P1) | zweryfikowane (mechanizm); zastrzeżenie: zapis v2 nie dowodzi recenzji poprawek po rundzie 2 → Do sprawdzenia | `tests/figury-recenzja.test.tsx:42`, dowody/jest-figury-recenzja.txt, mutant A w dowody/mutacje-reaudit.txt |
| 07-jakosc-005 | M1-009 | P2 | zweryfikowane; resztę luki opisuje nowe 07-jakosc-601 | dowody/check-decyzje.txt, dowody/jest-decyzje-straznik.txt |
| 07-jakosc-003 | M1-010 | P1 | zweryfikowane | `app/paywall.tsx:78`, dowody/jest-010-powtorka-1.txt, mutant B |
| 07-jakosc-004 | M1-011 | P1 | zweryfikowane (strażnik znaków-ikon, scenariusz 58 zielony); stan „dziś bez treningu” tylko krok telefonu | `tests/matrix-a11y.test.tsx:249`, dowody/ci-przebiegi.txt |
| 07-jakosc-009 | M1-011 | P2 | nadal otwarte | `docs/brd/wymagania.md:852`, `docs/39-lista-kontrolna-wydania.md:71` |
| 07-jakosc-001 | M1-012 | P1 | zweryfikowane (krok Z-25b i lista wydawcy, decyzja 27.10) | `docs/48-zgloszenie-1-0.md:95`, `.claude/agents/wydawca.md:10`, dowody/jest-audit-m1-2026-10-27-012-rejestr-ryzyk-bramka.txt |
| 07-jakosc-002 | M1-012 | P1 | zweryfikowane (mechanizm działa: kod 1 przy 6 otwartych); same ryzyka czekają na kroki właściciela | `scripts/ci/blokada-wydania.mjs:32`, dowody/check-release.txt, mutant C |
| 07-jakosc-008 | M1-023 | P2 | nadal otwarte (część: opis trybu ścisłego w workflowie, wiersz R-015) | `.github/workflows/e2e-ios.yml:52`, `docs/40-lekcje.md:32` |
| 07-jakosc-007 | M1-034 | P2 | zweryfikowane | `tests/maestro-tap-tekst-guard.test.ts:25`, mutant D |
| 07-jakosc-010 | M1-034 | P2 | nadal otwarte (poza testem akceptacyjnym M1-034) | `stryker.config.json:55`, `.github/workflows/nightly.yml:77` |
| 07-jakosc-011 | M1-034 | P2 | zweryfikowane | dowody/kalendarz-losowa-kolejnosc.txt |
| 07-jakosc-601 | — | P2 | nowe | `docs/18-przekazanie.md:282`, `scripts/decyzje.mjs:97` |

Nowe znaleziska: P0 0, P1 0, P2 1. Regresji z napraw: 0.

## Szczegóły weryfikacji ID

### 07-jakosc-006 (M1-005), bramka 4
- `docs/research/figury-recenzja.json` ma 71 wpisów v1: 53 wyświetlane, 15 zastąpionych przez v2, 3 ukryte (Push Press, Pendlay Row, Reverse Lunge). To zgadza się z decyzjami 2a i Reverse Lunge z 28.10. Lunges, Walking Lunges, Incline Push Up i Step Up mają wpis z datą 28.10 i odesłaniem do recenzji niezależnej (Step Up po drugiej poprawce). Rodziny v2 `ready` mają wpisy squat, bench_press i hinge.
- Test wiąże skrót danych z recenzją (`tests/figury-recenzja.test.tsx:42`). Mutant A zmienił kąt tułowia Step Up w `data/zrodla/figures.json` bez nowej recenzji: wywrócił 2 testy, a `check:zrodla-runtime` skończył się kodem 1.
- Zastrzeżenie: wpis v2 deklaruje rundy 1–2 z 27.10 i ma skrót rigu po poprawkach rundy 2 (Front Squat, Reverse Band). Repo nie pokazuje, że recenzja objęła wersję po tych poprawkach. Wpis przeniesiono z L-042 bez nowej recenzji, co mówi pole uwag. Zapisy są na gałęzi, której nie czytam, więc pozycja idzie do „Do sprawdzenia”.
- Eksport strony (9a) jest poza main: tylko wypisuję.

### 07-jakosc-005 (M1-009), decyzje → test
- `check:decyzje` = 0 (341 wpisów); strażnik 21/21; jest w `verify` i `verify:docs` (`package.json`, `scripts/verify-docs.mjs:67`). Mutacje strażnika wykonała rola w fix (7/7 zabitych, role/07-jakosc/fix-2026-10-27/dowody/mutacje-straznika-decyzji.txt w katalogu M1); nie powtarzałem.
- Próbka powiązań z 28.10 (wpisy 609, 614–617, 619, 621): każde wskazuje istniejący test zmienionego zachowania. Rozjazd pól „otwarte” — 07-jakosc-601.

### 07-jakosc-003 (M1-010), stan „Masz plan”
- Wstęp o darmowych dniach jest ukryty przy aktywnym planie (`app/paywall.tsx:78`), a nagłówek karty to `ownedPlanTitle` (`components/SubscriptionCard.tsx:12`). Uzgodnienie 1A × DEC-09 a z 28.10 (Masz plan: miesięczny, roczny albo dożywotni) jest wdrożone.
- Mutant B (wstęp widoczny także przy aktywnym planie) → 8 z 10 testów czerwonych.
- Pierwszy przebieg pliku: 1 przekroczenie 5 s przy zimnej pamięci transformacji, gdy obok biegł pełny zestaw. Dwie powtórki jednym procesem dały 10/10 w ok. 5 s. To obciążenie maszyny, nie test niestabilny.

### 07-jakosc-004 i 009 (M1-011), duży tekst
- 004: strażnik znaków-ikon (`tests/matrix-a11y.test.tsx:249`, limit `GLYPH_SCALE_MAX`) przechodzi w pełnym zestawie CI. Workflow ma wejście `rozmiar_tekstu` (`.github/workflows/e2e-ios.yml:190`). Scenariusz 58 jest zielony w 40624070610 na 4c73243 (przodek 2385e75); wejść przebiegu narzędzie MCP nie pokazuje, więc ten szczegół biorę z raportu M2. Stan dziś bez treningu z dużą ikoną startu nie jest pokryty, bo zależy od dnia tygodnia: zostaje krokiem telefonu ZD-03.
- 009 nadal otwarte. NFR-DOS-001 wskazuje jako metodę tylko test Jest (`docs/brd/wymagania.md:852`), choć test nie widzi ucięć. Scenariusz 58 ucięć nie sprawdza asercją (opis w nagłówku `.maestro/58-duzy-tekst.yaml`), a noc nie podaje `rozmiar_tekstu`, więc dowód z dużym tekstem nie powtarza się sam. Do tego `docs/39-lista-kontrolna-wydania.md:71` twierdzi, że ustawienie rozmiaru tekstu wymagałoby zmiany workflowu, a ta zmiana już jest. Test akceptacyjny 009 (metoda z urządzenia w NFR) nie jest spełniony.

### 07-jakosc-001 i 002 (M1-012), bramka i rejestr ryzyk
- Decyzja właściciela z 27.10 (`docs/18-przekazanie.md:602`): check:release jest krokiem listy wydania, bez zmiany `testflight.yml`. Krok jest w `docs/48-zgloszenie-1-0.md:95` (Z-25b) i `.claude/agents/wydawca.md:10`, a test pilnuje obu.
- `blockingRisks` (`scripts/ci/blokada-wydania.mjs:32`) blokuje stany otwarte i częściowe bez odroczenia z datą. Na 2385e75 daje kod 1 dla R-005, R-004, R-010, R-013, R-014 i R-RES. Mutant C (częściowe nie blokują) został zabity.
- Stany w rejestrze mają daty, a R-006 jest zamknięte z dowodem. Raport M1 przypisywał telefonowi 27.10 potwierdzenie warunków R-004 i R-014. W repo nie ma zapisu tego wyniku, więc ryzyka pozostają otwarte, co jest poprawne. Właściciel zamyka je krokiem z docs/39 albo odroczeniem z datą.

### 07-jakosc-008 (M1-023), dokumenty bramek
- docs/20 (wiersz TestFlight/App Store) zgodny z CLAUDE.md; R-006 zgodne w docs/40 i docs/48; docs/18 bez opisu dawnego błędu interpretera — test 4/4.
- Nadal sprzeczne: opis wejścia `tryb_scisly` w `.github/workflows/e2e-ios.yml:52` (widoczny w formularzu uruchomienia), komentarz `.github/workflows/e2e-ios.yml:10` i krok `.github/workflows/e2e-ios.yml:228`. Mówią, że wydanie do App Store idzie bez ponowień, a CLAUDE.md dopuszcza jedno ponowienie. Kto uruchomi bramkę App Store z formularza, wybierze tryb ścisły. Wiersz R-015 (`docs/40-lekcje.md:32`) w warunku zamknięcia nadal mówi o kroku w `testflight.yml`, wbrew decyzji z 27.10 i nagłówkowi `scripts/ci/blokada-wydania.mjs:6`. Test 023 tych miejsc nie sprawdza.

### 07-jakosc-007, 010, 011 (M1-034)
- 007: zapadka z listą bazową (`tests/maestro-tap-tekst-baza.json`). Mutant D (nowe stuknięcie po tekście w scenariuszu 01) został zabity. Strażnik jest też w haku przez check:pochodne (lista `STRAZNIKI` w `scripts/pochodne.mjs:17`).
- 010: `stryker.config.json` bez zmian od bazy (`git diff --quiet` kod 0). Macierz nocna (`.github/workflows/nightly.yml:77`) nie ma modułów dostępu, migracji ani importu, a próg `break` 40 (`stryker.config.json:55`) nie ma decyzji. Test akceptacyjny M1-034 tej części nie obejmował.
- 011: 5 ziaren i 3 strefy z losową kolejnością, wszystkie 46/46.

## Przegląd różnicy 025a50b..2385e75 (obszar jakości)
- **check:bundle wariant C (cf5f2287):** paczka nie sprawdza już skrótów (≤ 4 litery, `scripts/check-bundle.mjs:48`); przejął je deterministyczny skaner literałów TS/TSX i JSON w `tests/zrodla-wiedzy.test.ts`. Lista plików wynika z drzewa, a nieznany rodzaj pliku wywala test. Sprawdziłem importy z app/components/lib/modules: poza tymi katalogami importowane są tylko czcionki. JSON w `modules/` to konfiguracja modułów natywnych, nie tekst UI. Nazwy dłuższe łapie nadal paczka (`tests/zrodla-paczka.test.ts:71`). Testy zielone, bez znaleziska.
- **check:pochodne w haku (7a0a92e7, 8a):** 15 kroków, kod 0, test 13/13, hak 45/45. Uwaga bez znaleziska: krok `wektory BRD` porównuje plik z połączonym stdout i stderr skryptu, więc ostrzeżenie na stderr dałoby fałszywą czerwień w haku. Taka czerwień jest bezpieczna, bo nic nie przepuszcza.
- **check:decyzje:** w verify i verify:docs; patrz 005 i 601.
- **Rejestr ryzyk przed wydaniem:** działa jako bramka zgłoszenia (Z-25b); TestFlight świadomie bez niej.
- **e2e-ios.yml:** nowe wejście `rozmiar_tekstu` przekazane przez `env`, nie wprost w `run:`. Bez nowych uprawnień i sekretów.
- **tests/przeplywy.json:** nowy przepływ US-21 (scenariusz 58), DA zaktualizowany o stan „Masz plan”. docs/19 jest generowany i jego aktualność potwierdził check:pochodne (krok macierz testów). docs/20 rodzaj 6 dostał regułę DEC-03 b ze strażnikiem.
- **docs/40, rejestr:** nowe R-WAL (sprawdzenie po wydaniu) i R-RES (otwarte, symulator albo telefon).

## Próbka regresji (poza zmienionymi plikami)
| Pozycja | Wynik | Dowód |
|---|---|---|
| JAK-10 (workflowy bez `pull_request_target`/`workflow_run`, dane zdarzeń przez env, akcje spoza actions/* przypięte) | ok: 0 trafień wyzwalaczy i danych zdarzeń w `run:`; jedyne `uses:` spoza actions/* to lokalny workflow | dowody/proba-regresji.txt |
| JAK-06 (strefy i chwile zmiany czasu) | ok: tests-tz.yml z listą stref i PIN_NOW, ostatni przebieg 40629551022 zielony (na 025a50b; na 2385e75 jeszcze brak) | dowody/proba-regresji.txt, dowody/ci-przebiegi.txt |
| JAK-08 (wycinki prawdziwych plików) | ok: importy CSV w trzech formatach, zapisy baz z wydanych tagów z opisem pochodzenia (dane syntetyczne, bez danych osobowych) | dowody/proba-regresji.txt |

## Znaleziska (szczegóły)

### 07-jakosc-601 · Pola „otwarte → zadanie” w rejestrze decyzji nie nadążają za naprawami, więc rejestr nie pokazuje, które decyzje naprawdę czekają
- Pozycja listy kontrolnej: JAK-15
- Poziom: P2
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `docs/18-przekazanie.md:282` (18.10, stuknięcia po tekście) wskazuje M1-audytor-generalny-034, `docs/18-przekazanie.md:398` (21.10, poczta w polityce) wskazuje 017, a `docs/18-przekazanie.md:610` (28.10, 1a) wskazuje 006. Wszystkie trzy mają `[wdrożenie: otwarte → …]`, choć w plan-napraw.json mają status naprawione-do-weryfikacji z commitami 321d287b, d0ae52e i a38ce270. Strażnik 034 istnieje (`tests/maestro-tap-tekst-guard.test.ts:25`). Strażnik sprawdza tylko postać pola (`scripts/decyzje.mjs:97`), nie stan zadania.
- Mechanizm: `grep -n "\[wdrożenie: otwarte" docs/18-przekazanie.md` → 5 trafień, z czego 3 wskazują zadania już naprawione. Instrukcja z wyniku fix („wykonawca zmienia pole na kod”) to krok ręczny bez kontroli.
- Powraca: 07-jakosc-005 (ta sama klasa: zapis decyzji rozjeżdża się z kodem bez sygnału) → trwała kontrola w strażniku.
- Wzorzec lub źródło: CLAUDE.md, pole wdrożenia decyzji (DEC-02 a, 27.10.2026; powód: decyzja utknęła bez sygnału); zasada wspólna 4 (rejestr, nie pamięć).
- Kroki w aplikacji: nie dotyczy interfejsu. Skutek: przed wydaniem lista „otwartych” decyzji jest zawyżona, a prawdziwe otwarte (K1 przy 009, eksport figur 9a) giną w szumie. Pole nie blokuje wydania, więc decyzja naprawdę otwarta też nie daje sygnału na bramce.
- Opcje: (a) `check:decyzje` czyta stan zadania z ID (plan napraw albo docs/21): dla zadania zamkniętego wymaga zmiany pola na `kod` i testu. Kosztem jest zależność strażnika od pliku planu. (b) Przegląd pól `otwarte` jako krok Z-25b przed zgłoszeniem, tańszy, ale bez mechanizmu. (c) `check:release` wypisuje wpisy `otwarte` jako listę do decyzji właściciela, bez blokady. Rekomendacja: (c) i jednorazowa aktualizacja trzech pól. Sygnał trafia wtedy na bramkę wydania, a strażnik nie zależy od plików audytu.
- Test akceptacyjny: wpis `otwarte → ID` przy zadaniu zamkniętym jest widoczny na bramce wydania; trzy pola (282, 398, 610) zmienione na `kod` z testem albo `bez kodu`.
- Status: otwarte

Pozostałe ID: bez nowych sekcji (D-043), stan w tabeli Podsumowania i w „Szczegółach weryfikacji”.

## Nie sprawdzono
| Co | Dlaczego (środowisko) | Krok i kto | Wpływ na werdykt |
|---|---|---|---|
| R-004, R-005, R-013, R-014 (telefon, zegarek) | wymagają urządzenia | właściciel: kroki z docs/39 na buildzie z 2385e75, wynik z datą do docs/40 | blokują zgłoszenie (check:release kod 1) |
| R-RES (kopia ratunkowa plików bazy na iOS) | tylko symulator albo telefon | koordynator: scenariusz z bazą zastąpioną plikiem nie-SQLite (e2e-ios, za zgodą) albo właściciel na telefonie | blokuje zgłoszenie |
| R-010 (drugi przegląd treści krytycznej w 34 językach) | decyzja właściciela | właściciel: przegląd albo decyzja z datą „wydanie bez drugiego przeglądu w języku X” | blokuje App Store, nie TestFlight |
| AK-05: aktualizacja z poprzedniego buildu z danymi na telefonie | urządzenie | właściciel po buildzie kandydata | **warunek wysyłki (dane)**; utrata danych = ZABLOKOWANE |
| ZD-03 stan „dziś bez treningu” przy największym tekście | scenariusz 58 nie wymusza dnia | właściciel na telefonie, dzień bez planu | zastrzeżenie |
| Pełny katalog E2E na standardowym iPhonie (bramka App Store) | nie uruchamiam workflowów | koordynator: e2e-ios `pakiet: pelny` na 2385e75 (jedno ponowienie, bez trybu ścisłego — patrz 008) | warunek wysyłki do App Store |
| nightly.yml i tests-tz.yml na 2385e75 | najbliższa noc | odczyt rano 29.10 | sygnał, nie bramka |
| Recenzja v2 po poprawkach rundy 2 | zapisy poza main (gałąź nieczytana z polecenia) | koordynator: wskazać w `docs/research/figury-recenzja.json` raport recenzji wersji końcowej | zastrzeżenie bramki 4 |
| Testy Swift i natywny build | brak Xcode | — | bez zmian natywnych w zakresie roli |

## Otwarte P0/P1 innych ról z tego commitu
Raportów innych ról nie czytałem (polecenie). Liczby i ID scali M1.

| ID | Rola | Tytuł | Status |
|---|---|---|---|
| — | wszystkie | nie czytano | do scalenia przez M1 |

## Lista wydania (moduł wydanie)
1. **Jeden commit:** tests.yml i E2E pakietu podstawowego zielone na 2385e75. Scenariusz 58 i zmienione scenariusze zielone na przodkach 4c73243 i acb7d72, ale `git diff --stat acb7d72 2385e75` pokazuje 17 plików, więc dowód nie pochodzi z tego samego SHA. Pakiet podstawowy na 2385e75 obejmuje główne przepływy.
2. **Wersja i build:** 1.0.0; numer buildu nadaje `testflight.yml` (bez zmian w zakresie).
3. **Pełny zestaw, typecheck, lint:** zielone (CI 40657525976; wspólne typecheck i lint).
4. **E2E:** pakiet podstawowy zielony na SHA; pełny katalog na standardowym iPhonie nieuruchomiony.
5. **Aktualizacja z poprzedniej wersji:** automat (scenariusze 33/34 w pakiecie podstawowym) zielony; telefon AK-05 bez wyniku → warunek wysyłki. Strażnik normalizacji DEC-03 b ma nowy zapis `v1.0.0-b1032`.
6. **Lista „tylko telefon”:** zob. „Nie sprawdzono”.
7. **Zakres zmian:** `git log --oneline 025a50b..2385e75` → 118 commitów; ryzyka dotknięte zmianami mają testy zielone (tabela wyżej).
8. **Raporty innych ról:** M1.
9. **Plan cofnięcia:** rola 10. Koszt reguły DEC-03 b (kopia z podbitym schematem odrzucana przez starsze wersje) zapisany w docs/18.
10. **Zasady projektu:** rejestr ryzyk — 6 otwartych, check:release kod 1 (blokada); bramka 4 — wymuszona testem; zamrożenie zakresu — w różnicy są tylko naprawy z planu i decyzje z 28.10, nie oceniałem pod kątem nowych funkcji.

## Do sprawdzenia (pewność ≤ 80%)
- Wpis v2 w `docs/research/figury-recenzja.json` może nie odpowiadać recenzji wersji po poprawkach rundy 2 (Front Squat, Reverse Band). Pewność 60%, bo zapisy mogą być na gałęzi przekazania.

## Kontrola dowodów i sekretów
`node sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 07-jakosc` → kod 0, „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 07-jakosc” (dowody/sprawdz-raport.txt). W raporcie i dowodach nie ma e-maili, UDID, sekretów ani nazw innych aplikacji.

## Decyzje dla właściciela
1. Rejestr ryzyk: zamknąć R-004, R-005, R-013 i R-014 krokiem telefonu albo odroczyć je z datą. Do tego R-010 (decyzja o drugim przeglądzie) i R-RES. Bez tego zgłoszenie do App Store stoi (Z-25b).
2. 07-jakosc-601: opcja (c) z rekomendacją.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 07-jakosc --tryb fix --zadania 07-jakosc-601,07-jakosc-008,07-jakosc-009,07-jakosc-010` (wszystko P2 — backlog 1.0.x albo przed zgłoszeniem, decyzja właściciela; nie blokuje).

## git status --porcelain
Początek: pusty (dowody/git-status-start.txt). Koniec: dowody/git-status-koniec.txt (puste = pliki śledzone nietknięte)
