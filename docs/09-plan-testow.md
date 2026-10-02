# 09 Plan testów — Trening App (od 0.8.1)

Cel (pierwotny): aplikacja trafia na telefon dopiero wtedy, gdy **3 kolejne rundy testów kończą się zerem błędów**. Od rundy 69 (uzgodnione 01.10.2026): rundy tematyczne z progiem ważności — błędy wysokie i średnie naprawiane od razu (z testem), niskie mogą trafić do backlogu; temat zamknięty, gdy runda weryfikacyjna nie znajduje nic wysokiego ani średniego. Runda = pełny zestaw automatów + niezależny przegląd „świeżymi oczami” (audytor, który nie widział poprzednich poprawek) według tego planu. Każdy znaleziony błąd → poprawka → test regresji dopisany do automatów → licznik rund zeruje się.

Zasady: test sprawdza zachowanie, nie opis w dokumentacji. Każdy błąd dostaje test, który go odtwarza, zanim zostanie naprawiony. Wyniki rund są logowane z liczbami (tabela na końcu).

## Warstwy

| Warstwa | Czym | Gdzie | Uruchomienie |
|---|---|---|---|
| A. Logika i dane | Jest (Node), prawdziwe moduły lib/, atrapa SQLite | tests/logic.test.ts | npm test |
| B. Przepływy ekranów | expo-router/testing-library: renderowane prawdziwe ekrany, tapnięcia i wpisywanie | tests/flows.test.tsx | npm test |
| C. UX | automatyczne miary UX na wyrenderowanych ekranach | tests/ux.test.tsx | npm test |
| D. Build i natywne | typecheck, check:i18n, bundle Metro, prebuild iOS, kontrola entitlements / lokalizacji / linkowania modułu | skrypt + CI | npm run verify |
| E. Telefon | ręcznie, runbook (20 kroków) | iPhone | po zamknięciu rund (stan 01.10.2026: zamknięte) |

## A. Logika i dane

- A1 Migracje: goły stan web 0.3, natywna 0.1.0, schematy 8–12 → 13 (12 → 13: masa ciała poza obliczeniami — usuwane udział %, waga z Ustawień i zamrożona w treningu; nowe ustawienia: podpowiedź progresji, kopia automatyczna, przypomnienie o wadze) (10 → 11: przyciąganie starych wartości z funtów tylko raz; własne ćwiczenia o nazwach z biblioteki zostają własne); od rundy 60: kg na siatce 0,01 (połówki od zera), w historii tylko odhaczone serie, puste sesje odpadają; idempotencja (dwa razy = to samo); uszkodzone wpisy (null, nie-obiekt, brak pól) nie wywracają migracji; częściowe ustawienia uzupełniane polami domyślnymi.
- A2 Start: pusty telefon → dane startowe w języku systemu; nieczytelny zapis → kopia pod state_corrupt_*, dane nie są nadpisane, baner odzysku; stary schemat zapisany od razu po migracji.
- A3 Zapis: debounce 300 ms; flush przy tle / końcu treningu / imporcie / resecie; błąd zapisu → baner, a po udanym zapisie baner znika.
- A4 Obliczenia: objętość ma jedną definicję — historia = Postępy (tydzień) = sesja ćwiczenia; sztanga ×1, hantle ×2, jeden hantel ×1, masa ciała ×1, obciążenie = samo dociążenie (asysta = 0, masa ciała poza obliczeniami od rundy 75); e1RM Epley; rekordy; silnik PR (od rundy 73): rekord = suma na treningu (objętość / powtórzenia bez asysty / łączny czas / łączny dystans), odznaka przy serii, która przebiła najlepszy trening, raz na trening, + e1RM (Epley, ≤ 10 powt., bez dropów i gumy bez kg); identyczne serie → jeden PR, kolejność odhaczenia; pierwsza sesja bez PR; zaokrąglenia lb nie dają rekordu; podsumowanie: jeden wpis na ćwiczenie i rodzaj, z wartościami; tydzień od poniedziałku odporny na zmianę czasu; partie 1 / 0,5; to samo ćwiczenie dwa razy w treningu.
- A5 Przerwy i supersety: przerwa po zamknięciu rundy (liczba serii, nie kolejność; przerwa rundy; ostatnia seria ostatniego ćwiczenia zamyka rundę mimo pominiętej serii, gdy reszta już zaczęła; rozgrzewka w trwającej rundzie bez przerwy), brak przerwy przed nieodhaczonym drop setem, przerwa po serii czasowej liczona od końca serii, nierówne liczby serii, rozgrzewka z własną przerwą, przerwa 0 s = brak przerwy, rzeczywista przerwa po cofnięciu odhaczenia i po restarcie.
- A6 Jednostki: lb ↔ kg bez dryfu (135, 12,5, 45, 225, 2,5), 1,25 kg widoczne, format liczb PL „62,5” i EN „62.5”.
- A7 Backup i CSV: koperta i goły stan, nowszy schemat odrzucany (także goły), CSV: BOM na początku pliku, cudzysłowy, nowe linie, \r, numeracja serii roboczych, daty lokalne w nazwach plików; kopia automatyczna po treningu w Backup/ (10 najnowszych); baza w Library/SQLite (poza Plikami).
- A8 Tłumaczenia: każdy tekst w kodzie ma EN i te same parametry; wartości domenowe (partie, sprzęt, typy, rekordy, gumy); liczebniki PL (1, 2–4, 5+, 12–14, 22, ułamki).
- A9 Podpis: odczyt daty z profilu zakodowanego base64; brak profilu → brak banera.

## B. Przepływy ekranów

- B1 Pierwszy start: ekran Trening, podpowiedź dla nowego użytkownika, 4 szablony.
- B2 Start Upper A → trening w toku; ✓ pierwszej serii → pasek przerwy, zaplanowane powiadomienie.
- B3 Wpisanie „12,5” w polu ciężaru → w danych 12.5, pole nie gubi przecinka w trakcie pisania.
- B4 Cofnięcie ✓ starszej serii nie kasuje przerwy uruchomionej przez nowszą.
- B5 Rozgrzewka (W): „Poprzednio” dopasowane do serii roboczych.
- B6 Ćwiczenie na czas: ▶ → pasek stopera; ✓ na trwającej serii kończy pomiar; zapisany czas nie przekracza celu.
- B7 Superset w treningu: przerwa dopiero po zamknięciu rundy, także przy odhaczaniu w innej kolejności.
- B8 Zakończenie z rekordem: alert z rekordami, historia sesji pokazuje te same PR.
- B9 Zakończenie bez odhaczonych serii → propozycja odrzucenia, brak pustej sesji w historii.
- B10 Edytor szablonu: skasowanie „serie” i wpisanie 4 → 4; przesuwanie; usunięcie pozycji wymaga potwierdzenia; superset porządkuje się po przesunięciu.
- B11 Usunięcie ćwiczenia z historią → znika z listy, historia dalej pokazuje nazwę i objętość.
- B12 Ustawienia: przełącznik zmienia się po jednym tapnięciu; English przełącza tytuły zakładek; lb przelicza wyświetlanie.
- B13 Gumy: skasowanie koloru nie wywraca aplikacji, usunięcie wymaga potwierdzenia.
- B14 Poranny wpis: samo wejście nie tworzy rekordu; wpisanie wagi tworzy.
- B15 Import i reset: timery zatrzymane.
- B16 Powtórz ostatni: bez usuniętych ćwiczeń.

## C. UX (automatyczne miary)

- C1 Liczba tapnięć od uruchomienia do pierwszej odhaczonej serii ≤ 2 (Start, ✓) — cel produktu „< 20 s do pierwszej serii”.
- C2 Każdy przycisk z samą ikoną (✓ ▶ ⇅ ✂ ↑ ↓ ✕ −15 +15) ma opis dla VoiceOver.
- C3 Cele dotykowe ✓, ▶, numer serii, guma ≥ 44 pt.
- C4 Wiersz serii mieści się na 375 pt i 320 pt dla każdej kombinacji kolumn z biblioteki (albo „Poprzednio” schodzi pod wiersz).
- C5 Kontrast tokenów motywu (WCAG): tekst ≥ 4,5:1, duże cyfry i elementy ≥ 3:1 — w jasnym i ciemnym.
- C6 English: na każdym ekranie brak polskich tekstów interfejsu (poza danymi użytkownika).
- C7 Każda akcja niszcząca (usuń sesję, szablon, ćwiczenie, gumę, pozycję szablonu, anuluj trening, wyczyść dane, import) ma potwierdzenie.
- C8 Puste stany mają zrozumiały tekst (historia, szablony, wyszukiwarka, postępy).
- C9 Żaden ekran nie zgłasza ostrzeżeń Reacta (klucze list, aktualizacje po odmontowaniu).
- C10 Pola i przyciski mają limit powiększenia tekstu (Dynamic Type nie rozsadza wiersza serii).

## D. Build i natywne (automatycznie w npm run verify i w CI)

- D1 TypeScript bez błędów; check:i18n bez braków.
- D2 Bundle Metro iOS buduje się.
- D3 Prebuild iOS: entitlements = tylko HealthKit (bez Push); InfoPlist.strings pl i en z prawdziwymi tekstami; moduł RestActivity w autolinkingu; cel widżetu z kolorem akcentu; brak UIBackgroundModes; NSSupportsLiveActivities = true; RestTimerAttributes.swift identyczny w module i widżecie (rundy 63–64).
- D4 Workflow CI: Xcode 16.2, pipefail, kontrola binarki / bundle / widżetu, log przy błędzie.

## E. Na telefonie — pierwszy test (weekend 3–4.10.2026)

Stan kodu: 0.8.4 po audycie przed telefonem (runda 77). Kolejność ma znaczenie — każdy krok zależy od poprzedniego.

E1. Build i instalacja (README, Kroki 2–3): push na GitHub → Actions „iOS unsigned IPA” (30–45 min) → Sideloadly → Tryb dewelopera (Ustawienia → Prywatność i ochrona, restart) → zaufanie profilowi. Gdy build padnie: artefakt z logiem kompilacji → koniec logu do Claude. Najbardziej niepewne bez Xcode: kompilacja Swift (moduł Live Activity i widżet, T-037).
E2. Pierwsze uruchomienie: brak ekranu błędu; szablony Upper A/B itd. są; język polski; zgoda na powiadomienia przy pierwszej przerwie.
E3. Import z web 0.3 (T-004): web → Więcej → Backup → „Pobierz plik backupu” → AirDrop/iCloud → natywna: Więcej → Backup → Importuj. Sprawdź: liczba treningów w Historii = w web, „Poprzednio” przy ćwiczeniach z szablonu, ćwiczenia typu plank/marsz (jeśli były) z wartościami widocznymi.
E4. Trening (prawdziwy albo 10 min na sucho): start z szablonu; zmień ciężar w serii 1 → ✓ → dalsze nieruszone serie przejmują wartość; klawiatura chowa się po ✓, pasek przerwy widoczny (przeciągnięcie listy w dół też chowa klawiaturę); zablokuj ekran w przerwie → powiadomienie o końcu i Live Activity na ekranie blokady / Dynamic Island; seria czasowa (plank) z celem → koniec sam, wibracja; podciąganie z gumą; superset → przerwa po rundzie; „≡ Kolejność” w trakcie → przeciąganie płynne, wibracja przy zmianie miejsca; Zakończ → rekordy → Historia.
E5. Odporność: zabij aplikację w przerwie i w trakcie stopera z celem → otwórz ponownie: przerwa liczy dalej, seria z celem odhaczona z czasem = cel.
E6. Apple Health: Ustawienia → zapis do Zdrowia → czy pojawia się systemowe okno zgody? Po treningu: Zdrowie → Treningi. Brak okna = Sideloadly nie przeniósł uprawnienia HealthKit przy darmowym Apple ID (ograniczenie podpisu, nie błąd aplikacji) — zapisz, nie naprawiaj na siłę.
E7. Pliki: Pliki → Na moim iPhonie → Trening → Backup — po treningu jest plik JSON; bazy (trening.db) tam nie ma.
E8. Więcej: data wygaśnięcia podpisu (7 dni od instalacji).
E9. Odczucia: opóźnienie przy wpisywaniu w serii przy długim treningu (Q-020: ok. 80 ms w testach), płynność przeciągania, obsługa jedną ręką, duża czcionka systemowa, tryb jasny/ciemny.
Co odesłać: zrzuty ekranu + jedno zdanie „co zrobiłem → co się stało → czego się spodziewałem”; przy porażce buildu — log z Actions.
Znane, nie zgłaszać: Q-004, Q-012…Q-021 (backlog), brak Live Activity/Health jako skutek podpisu darmowym Apple ID.

## F. Metoda od rundy 69 (bez udziału telefonu)

| Warstwa | Czym | Gdzie | Uruchomienie |
|---|---|---|---|
| F1. Niezmienniki | fast-check: migracja nic nie zmienia w danych zapisanych przez apkę i jest idempotentna przez JSON; supersety ciągłe i ≥2; kg na siatce; para guma–asysta; poprawna historia; skończone objętości i rekordy; odhaczenie+odznaczenie przywraca serię; lb↔kg bez dryfu; podziałki osi rosnące, obejmujące, bez powtórzonych etykiet (także oś czasu); eksport→import = ten sam stan; PR treningu w toku = PR w historii; przerwa supersetu tylko po pełnej rundzie | tests/invariants, roundtrip, migrate-idem, audit-* | npm test (INV_RUNS, INV_SEED) |
| F2. Mutacje | Stryker na lib/units.ts, lib/stats.ts i logice lib/store.ts (porzucony trening, przerwy, odhaczanie, podpowiedzi — runda 74; testy store-stale/rest/toggle/hint) — czy testy wykrywają celowo zepsuty kod; przeżywające mutanty → nowe testy (tests/units.test.ts, tests/stats.test.ts). Wynik 01.10.2026: stats.ts 88% zabitych, units.ts 83%; reszta to mutanty równoważne (zbędne zabezpieczenia, remisy, kod nieosiągalny) | stryker.config.json + jest.mutation.config.js (tylko szybkie testy logiki) | w kawałkach po ~25 linii, na pierwszym planie: `npx stryker run --mutate "lib/stats.ts:1-30"` (pełny przebieg ~2 h; procesy w tle są ubijane) |
| F3. Zrzuty ekranów | eksport web (react-native-web), Chromium/Playwright, detektor nachodzących i uciętych elementów na 320/375/430 pt, PL i EN | scripts/screens | npm run screens (wynik: .expo/screens/shots, „problemy: 0”) |
| F4. Wydajność | 1000 / 5000 treningów: rozmiar stanu, zapis/odczyt+migracja, rekordy, PR historii, render startu, historii i Postępów; minimum z kilku prób. Uwaga: Jest (vm) spowalnia dostęp do globali ~30× względem zwykłego Node — liczby porównywać między wersjami, nie traktować jako czasu na telefonie. Równoważność szybkich ścieżek z wzorcem: tests/audit-perf-equiv.test.ts (fast-check) | scripts/perf/app.perf.tsx | npm run perf (PERF_N=1000,5000) |
| F5. Audyty tematyczne | niezależny audytor na temat (trwałość, porzucony trening, wymiana danych, logika treningu, ścieżka użytkownika); każdy błąd z testem odtwarzającym; próg ważności jak wyżej | tests/audit-*.test.ts(x) | npm test |

## Rundy

| Runda | Data | Automaty (pass/fail) | Przegląd świeżymi oczami | Nowe błędy | Licznik czystych rund |
|---|---|---|---|---|---|
| 1–68 | 28.09–30.09.2026 | rosnąco (337 testów w rundzie 70) | tak (audyty po każdej rundzie) | każdy błąd z testem R1…R68 w tests/regress.test.tsx | — (metoda zmieniona w rundzie 69) |
| 69 | 01.10.2026 | pass | nowa funkcja: porzucony trening; podział zapisu (klucz „live”); audyty T1 (trwałość), T2 (wykresy/UI) | błędy z T1/T2 naprawione w rundzie 70 | — |
| 70 | 01.10.2026 | pass | poprawki T1/T2 (testy R70-01…06); audyty T1b, T3 | T1b: 1 średni, 3 niskie; T3: 1 średni + drobne | — |
| 71 | 01.10.2026 | pass | poprawki T1b/T3 (R71-01…07); audyty T4a (trwałość), T4b (wymiana danych) | T4a: 1 średni, 6 niskich; T4b: 3 średnie, 3 niskie | — |
| 72a | 01.10.2026 | 377 pass | poprawki T4; audyt T5 (logika treningu) | 4 średnie, 2 nisko-średnie, 4 niskie | — |
| 72b | 01.10.2026 | 388 pass | poprawki T5; audyt T6 (regresje) | 3 średnie, 1 nisko-średni, niskie | — |
| 72c | 01.10.2026 | 406 pass | poprawki T6; audyt T7 (weryfikacja) | 1 średni, 5 niskich | — |
| 72d | 01.10.2026 | 420 pass | poprawki T7; audyt T8 (pełna ścieżka PL/kg i EN/lb) | 2 średnie, 4 niskie | — |
| 72e | 01.10.2026 | 426 pass, 2 pominięte (backlog) | poprawki T8; audyt T9 (weryfikacja końcowa) | 1 średni (sprzed rundy 72), 2 niskie | — |
| 72f | 01.10.2026 | 445 pass, 2 pominięte (backlog), 29 plików | poprawki T9; audyt T10 (weryfikacja końcowa) | 1 średni (w poprawce T9), niskie → backlog | — |
| 72g | 01.10.2026 | 453 pass, 2 pominięte, 33 pliki | poprawki T10; audyt T11 (runda zamykająca) | 1 średni (pytanie o porzucony trening przed domknięciem serii czasowej), 3 niskie (naprawione) | — |
| 72h | 01.10.2026 | 464 pass, 2 pominięte, 36 plików | poprawki T11; audyt T12 (runda zamykająca) | **0 wysokich, 0 średnich**; 3 niskie → backlog | temat zamknięty |
| 73 | 01.10.2026 | 469 pass, 2 pominięte, 36 plików | zmiana definicji rekordu (decyzja D-012); test R70-05 miał wpisaną stałą datę i „przeterminował się” — przepisany na czas względny | — | — |
| 73b | 01.10.2026 | 501 pass, 2 pominięte, 38 plików | testy mutacyjne units/stats w kawałkach; 2 nowe pliki testów (units, stats); martwy kod w raise() usunięty | brak błędów w działaniu — luki w testach | — |
| 74 | 01.10.2026 | 593 pass, 2 pominięte, 50 plików | optymalizacja (indeks treningów z ćwiczeniem, summarize w jednym przejściu, rekordy narastające + wyszukiwanie binarne, hasHistory, kropki wykresu ≤ 60, leniwe etykiety dat, szybka ścieżka migracji); backlog Q-005, Q-008, Q-010, Q-011 naprawione; mutacje store.ts (stale, przerwy, odhaczanie, podpowiedzi); audyt T13b (rekordy + optymalizacje, niezależny) | **0 wysokich, 0 średnich**; 2 niskie (max pow. bez asysty liczył drop set; stoper w pamięci po cichym zapisie) — naprawione z testami | temat rekordów i wydajności zamknięty |
| 75 | 02.10.2026 | 617 pass, 0 pominiętych, 52 pliki | backlog z decyzjami 02.10: Q-001 (masa ciała poza obliczeniami, schemat 13), Q-002 (stoper po zamknięciu aplikacji), Q-006 (superset: pominięta seria, rozgrzewka w rundzie), Q-007 (BOM w CSV), T-017 (podpowiedź progresji), T-016 (pasek postępu), T-012 (kopia automatyczna w Plikach), T-013 (przypomnienie o wadze); audyty T14 (1 średni: baza widoczna w Plikach → przeniesiona do Library/SQLite), T14b (1 średni: przeniesienie przez expo-file-system niemożliwe → przez SQLite), T14c (1 średni: nieczytelna nowa baza → pusta aplikacja → teraz błąd startu), T14d | **0 wysokich, 0 średnich** w T14d; niskie → backlog Q-013…Q-015 | temat zamknięty |
| 76 | 02.10.2026 | 631 pass, 0 pominiętych, 53 pliki | T-010: kolejność ćwiczeń przeciąganiem (szablon i trening w toku; ekran „Kolejność ćwiczeń”, superset przesuwa się w całości, w nim — uchwytami; członkostwo w supersetach bez zmian; VoiceOver: akcje wyżej/niżej; przewijanie przy krawędzi; bez nowych modułów natywnych — PanResponder + Animated); audyt T15: 0 wysokich/średnich, 6 niskich — naprawione: kolizja klucza bloku (id grupy = id ćwiczenia), rozerwana grupa w szablonie z importu (migrate zawsze normalizuje), przewijanie zablokowane po zniknięciu listy w trakcie, przesunięcia po upuszczeniu bez zmiany, komunikat VoiceOver o nowej pozycji; w backlogu (Q-016, Q-017): „Poprzednio” dla dwóch bloków tego samego ćwiczenia poza szablonem idzie za pozycją, koszt pierwszego przeciągania do zmierzenia na iPhonie (tests/reorder-t010.test.tsx) | **0 wysokich, 0 średnich** w T15; niskie naprawione albo → backlog Q-016, Q-017 | temat zamknięty |
| 77 | 02.10.2026 | 642 pass, 0 pominiętych, 54 pliki | audyt przed telefonem — 5 niezależnych audytorów: A dane/zapis (import web 0.3 na prawdziwym formacie: 1 średni — plank/marsz z web niewidoczne → metryka ze starych wpisów), B trening/timery (2 średnie: klawiatura zasłaniała pasek przerwy → chowanie po ✓/starcie stopera i przeciągnięciem; zmiana ciężaru nie przechodziła na wstępnie wypełnione serie → decyzja 02.10 „przenieś na nieruszone”), C statystyki (0), D build/natywne (2 średnie w README: Tryb dewelopera, iTunes+iCloud; Xcode 16.2 sprawdzany jawnie, Jest --maxWorkers=2), E UI/a11y/i18n (klawiatura jak B; „Anuluj” w wyborze ćwiczenia, limit czcionki paska timera, tekst o kopiach); weryfikacja 1: 3 średnie (literówka po ponownym ✓, „+ seria”, podwójne Anuluj) → naprawione; weryfikacja 2: 0 (tests/audit-prephone.test.tsx, fixtures/web03-backup.json) | **0 wysokich, 0 średnich** w weryfikacji 2; niskie → backlog Q-018…Q-021 | temat zamknięty |
