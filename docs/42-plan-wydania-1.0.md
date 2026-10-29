# 42. Plan wydania 1.0 (decyzja właściciela 20.10.2026, audyt M1-068, DEC-22 wariant a)

Krótki plan: **1.0 wydajemy ręcznie po kontroli na telefonie**, **aktualizacje wydajemy stopniowo przez 7 dni**, a przy złym buildzie postępujemy według punktu 4. Kwoty i model płatności: wyłącznie `docs/monetyzacja.md` (tu ich nie powtarzamy).
Droga do zgłoszenia (kroki, zależności, czas): `docs/41-droga-do-app-store.md`; ten dokument opisuje, co dzieje się **od gotowego buildu do użytkowników** i co robimy, gdy wydanie idzie źle. Plan jest punktem F3 w docs/41 i punktem 5 poniżej.

## 1. Bramki przed wysłaniem do recenzji

Wydania w App Store nie zgłaszamy, dopóki wszystkie poniższe punkty nie są spełnione (rejestr ryzyk w `docs/40-lekcje.md`: otwarte ryzyko blokuje wydanie).

1. **Rejestr ryzyk:** otwarte na 20.10.2026 — R-004 (uprawnienie powiadomień pilnych na telefonie; blokuje 1.0), R-005, R-006, R-007 (zamknięte 22.10.2026, docs/40), R-008, R-009, R-010 (drugi przegląd treści krytycznej — blokuje App Store; przegląd robi wyłącznie Claude, decyzja właściciela K-P4-2, 20.10.2026), R-011, R-012; od 21.10.2026 (redesign M3) R-013 (ikona zegarka — ponownie otwarte 22.10.2026 po odrzuceniu wysyłki build 1026; zamyka zielona wysyłka) i R-014 („Pogrubiony tekst” z krojem systemowym — telefon); od 25.10.2026 R-015 (wyjątek anonimizacji: stare tłumaczenia z nazwami źródeł w 33 językach — zamknięte 26.10.2026: przekład przez API nałożony, `npm run check:release` = 0); od 26.10.2026 R-016 (nazwy aplikacji w sklepie: ręczne sprawdzenie znaków towarowych w TMview, UPRP, WIPO, USPTO przez właściciela — blokuje App Store, nie TestFlight). Każde zamknięte z dowodem albo świadomie odłożone decyzją właściciela z datą. Dodane 26.10.2026: R-017 (strony apps4brew.com zgodne z `site/`, zamyka je zielony `check-urls.yml` na commicie wydania; docs/48 Z-10a).
2. **Testy:** pełne `npm run verify` na commicie wydania, `tests.yml` zielony; jeden pełny katalog E2E na standardowym iPhonie zielony (jedno ponowienie scenariusza dozwolone; CLAUDE.md, decyzja właściciela 21.10.2026, `docs/38-przeplywy-i-luki-e2e.md` pkt 11). Nocny pełny katalog to sygnał, nie bramka.
3. **Audyt:** pełny głęboki audyt całości przed upublicznieniem w App Store, naprawy KRYTYCZNYCH i WYSOKICH znalezisk bez drugiego audytu (CLAUDE.md „Audyty i wydania”, punkt 4; docs/41 A3–A4).
4. **Wygląd:** redesign M3 przed 1.0; zrzuty do sklepu i opis dopiero po M3 (decyzja właściciela 20.10.2026, `docs/18-przekazanie.md`).
5. **Droga do App Store:** punkty A–F z docs/41 spełnione (zakupy B1–B6, metadane D1–D11, prawo i kontakt E1–E6); opis sklepu zgodny z kodem (`docs/15-app-store.md`, test `tests/audit-m1-045-store-description.test.ts`).
6. **Model płatności:** zgodny z `docs/monetyzacja.md`; wynik bramki opłacalności: sekcja „Bramka W0” w `docs/monetyzacja.md` (przeprowadzona 21.10.2026, zastępuje zapis „brak” z K-P4-3; dla M5 S1 wynik normalny poniżej progu, model wybrany świadomie 22.10.2026) — nie blokuje wydania.
7. **Telefon:** lista kontrolna wydania (`docs/39-lista-kontrolna-wydania.md`) odhaczona przez właściciela na buildzie 1.0 z TestFlight.

## 2. Wydanie 1.0 — ręcznie, po kontroli na telefonie

- **Opcja wydania po akceptacji: ręcznie** (docs/41, D-5 wariant A, krok D11). Po akceptacji Apple właściciel sam klika „Release” w App Store Connect — w dniu, w którym są gotowe wpisy w społecznościach i nominacja (docs/41 E6, kanały i dziennik zgód: `docs/wzrost.md`).
- **Kontrola na telefonie przed kliknięciem:** ten sam build, który przeszedł recenzję, jest na TestFlight; właściciel przechodzi listę z docs/39 (ok. 15–20 min) i zakupy w piaskownicy (US-13). Wada → wiadomość do agenta z numerem punktu; „Release” czeka.
- **Pierwsze wydanie nie ma etapowania.** Opcja wydania stopniowego dotyczy aktualizacji wersji (strona Apple z punktu 3: „When you release a version update of your app …”), a przy 1.0 nie ma jeszcze użytkowników, którym można rozłożyć wydanie w czasie.
- **Po kliknięciu:** sprawdzenie na własnym telefonie, że aplikacja w App Store się instaluje i uruchamia (wersja i build zgodne z dziennikiem wydań w `docs/09-plan-testow.md`); wiersz wydania (tag `v1.0.0-b<numer>`, SHA, numer przebiegu) dopisany do dziennika wydań w tym samym commicie co tag.

## 3. Aktualizacje — wydanie stopniowe przez 7 dni

Każda aktualizacja po 1.0 (1.0.1 i dalsze) idzie z włączonym wydaniem stopniowym: przy zgłaszaniu wersji w App Store Connect, sekcja „Phased Release for Automatic Updates”, opcja „Release update over a 7-day period using phased release”.
Źródło: <https://developer.apple.com/help/app-store-connect/update-your-app/release-a-version-update-in-phases/> (odczytano 20.10.2026). Cytat: „Selecting this option will release your app's update gradually over 7 days.”

| dzień wydania stopniowego | odsetek użytkowników z automatycznymi aktualizacjami |
|---|---|
| 1 | 1% |
| 2 | 2% |
| 3 | 5% |
| 4 | 10% |
| 5 | 20% |
| 6 | 50% |
| 7 | 100% |

- Etapowanie obejmuje losową próbę użytkowników z włączonymi automatycznymi aktualizacjami; **każdy może pobrać aktualizację ręcznie w dowolnej chwili** (ta sama strona Apple) — wada nie dotknie więc tylko wskazanego odsetka.
- **Wstrzymanie:** „During phased release, you may pause the release for up to 30 days, with no limit on the number of pauses.” (ta sama strona; przycisk „Pause Phased Release”).
- W trakcie 7 dni właściciel co dzień sprawdza ocenę i opinie w App Store Connect (docs/15: liczby po premierze z „Analityka”) i zgłoszenia wsparcia; **progi „stop” (decyzja właściciela K-P4-4, 20.10.2026):** pauza wydania stopniowego po pierwszym zgłoszeniu utraty danych lub awarii przy starcie albo po 3 zgłoszeniach innego błędu tego samego rodzaju; informacja na stronie wsparcia i w „Co nowego” poprawki.

## 4. Zły build

Zły build = znalezisko KRYTYCZNE albo WYSOKIE po wydaniu (utrata lub zepsucie danych, awaria, błędne liczby, prywatność, zakupy; próg w CLAUDE.md „Audyty i wydania” punkt 1). Znalezisko niższe: backlog z wersją, plan bez zmian.

1. **Oceń realność** (CLAUDE.md, punkt 6): kroki w aplikacji, które do błędu prowadzą — realny, brzegowy czy teoretyczny; utrata danych i prywatność ocenia się zawsze.
2. **Wstrzymaj rozchodzenie się wersji:** trwa etapowanie → „Pause Phased Release” (punkt 3); decyzja o wycofaniu aplikacji ze sprzedaży należy do właściciela — wycofanie zatrzymuje etapowanie tej wersji, a po przywróceniu aplikacja jest dostępna dla wszystkich od razu (strona Apple z punktu 3). Skutek dla już zainstalowanych kopii: aplikacja zostaje na telefonach, a osoby, które ją pobrały, **nadal dostają aktualizacje** (także poprawkę) i mogą ją pobrać ponownie z historii zakupów — wycofanie zatrzymuje tylko nowe pobrania. Apple (App Store Connect → Pricing and Availability → „Remove App From Sale”; aplikacja znika ze sklepu do 24 h): „Users who previously downloaded your app from the App Store in that country or region will continue to receive app updates. The app can be redownloaded from a customer's purchase history as long as the necessary contract remains active.” (<https://developer.apple.com/help/app-store-connect/manage-your-apps-availability/manage-availability-for-your-app-on-the-app-store/>, odczyt 27.10.2026). Wniosek: wycofanie nie chroni osób, które już mają zły build — chroni je dopiero poprawka; przy utracie danych liczy się szybkość punktów 3–5.
3. **Odtwórz błąd testem** (czerwony), napraw minimalnie, `npm run verify` i E2E na poprawce (zasada „test przed kodem”).
4. **Dane użytkownika:** jeśli błąd mógł uszkodzić zapis — najpierw zabezpieczenie (kopia, migracja zachowawcza, zasady modułu „zmiany danych użytkownika”: test na bazie poprzedniej wersji), dopiero potem wydanie.
5. **Nowy build:** `testflight.yml` (numer buildu = 1000 + numer przebiegu), TestFlight, lista z docs/39 dla dotkniętych punktów, zgłoszenie jako aktualizacja z wydaniem stopniowym. Czas recenzji: **[OTWARTE]** (docs/41 F2). Przyspieszona recenzja (znalezisko KRYTYCZNE albo WYSOKIE): najpierw zgłoszenie poprawki do recenzji, potem formularz „Request an Expedited App Review”; w polu Notes zgłoszenia kroki odtworzenia błędu w obecnej wersji. Apple: „Only submissions that have already been sent to App Review can be expedited.” i „If you're requesting an expedited review to fix a critical bug, include this information in the Notes field in App Store Connect when you submit the app for review.” (<https://developer.apple.com/help/app-review/after-submitting-for-review/request-expedited-review/>, odczyt 27.10.2026); „When submitting an expedited review to fix a critical bug, include the steps to reproduce the bug on the current version of your app.” (<https://developer.apple.com/distribute/app-review/>, sekcja „Expedited reviews”, odczyt 27.10.2026). Apple rozpatruje prośbę „as allowed by availability and demand” — przyspieszenie nie jest gwarantowane. Poprawka błędu: jeśli recenzja znajdzie przy niej inne problemy, Apple może zaproponować przyjęcie poprawki i naprawę reszty w następnym zgłoszeniu (ta sama strona, sekcja „Bug fix submissions”; odpowiedź na wiadomość w App Store Connect).
6. **Lekcja w tej samej sesji** (CLAUDE.md, zasada właściciela 14.10.2026): wpis w `docs/40-lekcje.md` — co się stało, przyczyna źródłowa, akcje jako mechanizmy, ocena zakresu; nowe ryzyko w rejestrze, jeśli coś jest niepotwierdzone.
7. **Wiadomość do użytkowników:** „Co nowego” w aktualizacji z poprawką (decyzja właściciela 29.10.2026, wariant A; odrzucone: dodatkowo wpis na stronie wsparcia). Reakcja w pierwszym tygodniu: zgłoszenie trafia do sesji koordynatora, właściciel raz dziennie zagląda do App Store Connect i recenzji (wariant A; odrzucone: codzienny automatyczny przegląd recenzji).

## 5. Lista kontrolna wydania 1.0

Odhaczana przez właściciela i agenta przed „Release”; wynik zapisany w docs/18 z datą.

- [ ] **W1-01** Bramki z punktu 1 spełnione (ryzyka R-004…R-012 zamknięte albo odłożone decyzją z datą).
- [ ] **W1-02** Pełne `npm run verify` zielone na commicie wydania; jeden pełny katalog E2E na standardowym iPhonie zielony (jedno ponowienie scenariusza dozwolone).
- [ ] **W1-03** Build 1.0 na TestFlight; lista `docs/39-lista-kontrolna-wydania.md` odhaczona na telefonie.
- [ ] **W1-04** Zakup w piaskownicy (docs/39, US-13) i „Przywróć zakupy” sprawdzone.
- [ ] **W1-05** Metadane, zrzuty, zakupy i notatki dla recenzenta w App Store Connect kompletne (docs/41, A–F).
- [ ] **W1-06** Opcja wydania ustawiona na „ręcznie” (D11); po akceptacji Apple właściciel klika „Release”.
- [ ] **W1-07** Dziennik wydań (`docs/09-plan-testow.md`) ma wiersz tagu wydania z SHA i numerem przebiegu.
- [ ] **W1-08** Plan „zły build” (punkt 4) przeczytany przez właściciela; uzgodnione, kto i jak szybko reaguje w pierwszym tygodniu.
- [ ] **W1-09** Przy pierwszej aktualizacji: włączone wydanie stopniowe (punkt 3).
- [ ] **W1-10** Beta iOS/watchOS (lipiec–sierpień każdego roku, DEC-07 K10, 23.10.2026): gdy Apple udostępni betę nowego systemu, uruchamiamy zestaw E2E na symulatorze w CI z betą Xcode (niewiążąco, jak nocny pełny katalog), a właściciel przechodzi 5 min na telefonie z betą (start treningu, zapis serii, zegarek, kopia/przywrócenie); wynik w docs/18 z datą. Błąd z bety ocenia się wg progu i realności z CLAUDE.md (punkty 1 i 6), poprawka przed wrześniowym wydaniem systemu.

## 6. Po premierze: budżet czasu właściciela

Decyzja właściciela 23.10.2026 (DEC-07 K7, M1-057): po premierze 1.0 właściciel poświęca na aplikację **2 h tygodniowo** przez **8 tygodni** (okno punktu kontrolnego z `docs/monetyzacja.md` i decyzji o Androidzie z `docs/wzrost.md`); odpowiedzi na recenzje w App Store udzielamy w ciągu **48 h**.
Agent przygotowuje szkice odpowiedzi i zestawienie tygodniowe (pobrania, oceny, zgłoszenia), publikuje właściciel. Praca ponad budżet — tylko za zgodą właściciela (zła wersja: punkt 4, bez limitu czasu).
