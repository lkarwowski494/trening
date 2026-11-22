# Audyt: Programista — Trening, automat danych App Store Connect — 2026-11-22
Recenzja niezależna (CLAUDE.md, L-047). **autor:** sesja AM · **recenzent:** sesja AN · **data:** 22.11.2026 · **SHA:** `089ff0f27b39e62edd3c4d04881740c59e120f43` (głowa `origin/ci/asc-analityka`; późniejszy commit AM `e51ebbb6` zmienia tylko `docs/wydanie/STAN-AM.md` — plik stanu sesji AM, celowo nieczytany (L-047); kod bez zmian).
Tryb: audit (rola 08-programista, polecenie koordynatora AN). Zakres: `git diff 3332dc62..089ff0f2` — `scripts/asc/analityka.mjs`, `scripts/asc/na-zywo.mjs`, zależności `scripts/asc/iap-localizations.mjs` (klient, JWT) i `scripts/asc/metadane.mjs` (`readOnlyClient`), `scripts/asc/prywatne-repo/asc-dane.yml`, `tests/asc-analityka.test.ts`, `docs/wydanie/asc-analityka-*.md`.
Środowisko: Linux, Node 22, sieć do developer.apple.com (surowy JSON dokumentacji). Nic nie uruchamiano przeciw App Store Connect; testy i mutacje wyłącznie na atrapie API w osobnym worktree w scratchpadzie (kod AM nietknięty).

## Podsumowanie
Wymóg (a) jest spełniony: jedyny zapis to `POST /v1/analyticsReportRequests`, tylko przy `--zapisz-zadanie`, po GET listy żądań, nigdy przy stanie `stoppedDueToInactivity`; poza nim tylko GET (klient blokuje DELETE, PATCH nie jest wołany). Wymóg (d) zgodny z dokumentacją Apple (paginacja `links.next`, `limit=200` = maksimum, pobranie segmentu od razu po liście, gzip, suma MD5, najnowsza instancja per data, scalenie bez duplikatów). Jedno znalezisko WYSOKIE (blokuje włączenie harmonogramu, naprawa jedną linią): workflow z sekretami uruchamia skrypty z ruchomej gałęzi, nie z przypiętego SHA. Wymóg (b): w kodzie jedna luka ŚREDNIA (identyfikator raportu Apple nie jest maskowany w komunikacie błędu HTTP), a testy nie wykryłyby 4 z 8 mutacji łamiących (a)/(b) — patrz 003.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 08-programista-001 | P1 (WYSOKIE: sekrety) | D | Harmonogram z sekretami uruchamia kod z gałęzi `ci/asc-analityka`, nie z przypiętego SHA | otwarte |
| 08-programista-002 | P2 (ŚREDNIE) | D | Identyfikator raportu Apple (`r142-<uuid żądania>`) nie jest maskowany w komunikacie błędu HTTP | otwarte |
| 08-programista-003 | P1 (ŚREDNIE) | D | Testy nie wykrywają wycieku danych w ścieżkach błędów ani usunięcia `readOnlyClient` (4/8 mutacji przechodzi) | otwarte |
| 08-programista-004 | P2 (NISKIE) | P | `unique_counts` sumowane po urządzeniach zapisane pod nazwą „unikalne” | otwarte |

Ocena wg progu CLAUDE.md: scalenie blokuje tylko 001 (tania naprawa). 002–004 → backlog z wersją.

## Linia bazowa i założenia
Linię bazową zbudowano z kodu i dokumentacji Apple przed przeczytaniem dokumentów AM (ich uzasadnień nie czytano poza krokami właściciela i nagłówkiem wykonalności).
- **Ścieżki zapisu (ASC):** jedna — `scripts/asc/analityka.mjs:130`, warunek `plan === 'brak' && zapiszZadanie` w linii 129; po POST ponowny GET (131) i kod 1, gdy żądania nie widać (134). Stan zatrzymany → kod 1 bez POST (140).
- **Ścieżki zapisu (pliki):** `writeFileSync` do `--out` (163, 168); `scal` (105–108) zastępuje całe daty z nowych wierszy, starsze zostają — przy przerwaniu w połowie pierwszy plik może być już zapisany, ale kolejny przebieg jest idempotentny (brak utraty).
- **Obsługa błędów:** jedno `catch` na przebieg (170) wypisuje `e.message` obcięte do 200 znaków; treść wiadomości pochodzi z klienta (`scripts/asc/iap-localizations.mjs:57`: metoda, ścieżka bez zapytania z maską `/[0-9a-f-]{8,}`, status, `code: title` z `errors[]`, bez `detail` i bez treści).
- **Typy na granicach:** odpowiedzi API czytane opcjonalnym łańcuchem bez parsowania z `unknown`; skrypt `.mjs` (bez typecheck). Brak skutku dla użytkownika aplikacji — nie zgłaszam (DEV-09 to tu styl).
- **Wzorzec najlepszych:** dokumentacja Apple „Downloading analytics reports” i strony endpointów (odczyt 22.11.2026, surowy JSON): „If you don’t retrieve data for a long time, a report request changes to `stoppedDueToInactivity`. You need to make a new request to resume getting reports.”; segmenty: „The download URLs are valid for 5 minutes after generating. You need to download the reports immediately after calling this endpoint.”; instancja „might contain data for that day, full data for past dates, or both”; `limit` maksimum 200 dla `.../reports`, `.../instances`, `.../segments`. Przykładowe ID raportu w dokumentacji: `r142-<UUID>` (prefiks + UUID żądania).
- **Soczewki:** przebieg przerwany w połowie (OK, idempotentny), recenzent szukający ścieżki bez testu (003), czytający moduł pierwszy raz (komentarze nagłówkowe jasne), VoiceOver — nie dotyczy (brak UI).
- Rejestr założeń: bez propozycji zmian.

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| `scripts/asc/analityka.mjs` (całość, 184 linie) | tak | lektura + 30 testów + mutacje M2–M5, M7, M8 |
| `scripts/asc/na-zywo.mjs` (całość, 80 linii) | tak | lektura + mutacja M6 |
| `scripts/asc/iap-localizations.mjs` klient i JWT (linie 17–67) | tak | lektura; maska ścieżki sprawdzona na ID z dokumentacji Apple |
| `scripts/asc/metadane.mjs` `readOnlyClient` (linia 92) | tak | lektura |
| `scripts/asc/prywatne-repo/asc-dane.yml` | tak | lektura |
| `tests/asc-analityka.test.ts` | tak | `npx jest --ci` + mutacje |
| `docs/wydanie/asc-analityka-kroki-wlasciciela.md` | tak | lektura (zgodność z workflowem) |
| `docs/wydanie/asc-analityka-wykonalnosc.md` | częściowo | tylko nagłówek (uzasadnienia AM celowo nieczytane, L-047) |
| Przebieg na prawdziwym App Store Connect | nie | zakaz polecenia; zachowanie S3 (nagłówek `Content-Encoding`) → „Do sprawdzenia” |

## Kontrola dowodów i sekretów
Dowody (komenda → kod wyjścia → wynik), wykonane w worktree scratchpadu na SHA `089ff0f2`:
- `npx jest --ci tests/asc-analityka.test.ts` → 0 → `Tests: 30 passed, 30 total`.
- Mutacje (skrypt podmienia jeden fragment, uruchamia ten sam plik testów, przywraca; `git status --porcelain` worktree pusty po przebiegu):
  - M1 klient dopisuje `JSON.stringify(odpowiedź)` do komunikatu błędu HTTP → testy **przechodzą** (niewykryta).
  - M2 POST także przy stanie zatrzymanym → pada test „żądanie zatrzymane…”.
  - M3 POST bez `--zapisz-zadanie` → pada test „tryb odczytu bez żądania…”.
  - M4 ponowienie POST po błędzie → pada tylko test statyczny (liczba literałów `'POST'` w źródle = 1); pętla z jednym literałem przeszłaby.
  - M5 treść segmentu (wiersze z terytoriami i liczbami) w komunikacie błędu sumy kontrolnej → **przechodzą** (niewykryta).
  - M6 `na-zywo.mjs` bez `readOnlyClient` (`const c = client`) → **przechodzą** (niewykryta: test sprawdza tylko obecność słowa w źródle, a import zostaje).
  - M7 identyfikator aplikacji w logu `catch` → **przechodzą** (niewykryta).
  - M8 `scal` gubi stare daty → padają 2 testy scalania.
- Maska ścieżki na formacie ID z dokumentacji Apple: `node -e` z `'/v1/analyticsReports/r142-<UUID>/instances'.replace(/\/[0-9a-f-]{8,}/gi,'/{id}')` → 0 → wynik bez zmian: `GET /v1/analyticsReports/r142-<UUID>/instances`.
- Sekrety: raport nie zawiera kluczy ani identyfikatorów konta; ID w raporcie pochodzi z przykładu w publicznej dokumentacji Apple. `sprawdz-raport.mjs --rola 08-programista`: wynik na końcu sekcji „Proponowane polecenie naprawy”.

## Stosowalność listy kontrolnej
| Pozycja | Status | Wynik |
|---|---|---|
| DEV-01 logika czysta z testami | dotyczy | ok: `planZadania`, `wybierzRaport`, `parsujSegment`, `agreguj`, `najnowszePoDacie`, `scal`, `doCsv/zCsv` mają testy (`tests/asc-analityka.test.ts:95-153`) |
| DEV-02 testy razem z kodem | dotyczy | ok: 2/2 commity kodu (`ab2ab7c`, `089ff0f`) zmieniają test w tym samym commicie |
| DEV-03 testy nieosłabione | dotyczy | ok: brak `.skip/.only/todo`; słabość asercji → 08-programista-003 |
| DEV-04 testy przechodzą | dotyczy | ok: 30/30 (Jest `--ci`); typecheck/lint nie dotyczą `.mjs` poza lintem (nieuruchamiany — `verify:docs` przy commicie raportu) |
| DEV-05 zapis bez kasowania | dotyczy (pliki CSV) | ok: `scal` zastępuje tylko daty obecne w nowych wierszach (M8 wykryta) |
| DEV-06 migracje i kopie | nie dotyczy | brak bazy SQLite |
| DEV-07 brak zgadywania | dotyczy | uwaga: nienumeryczne liczby → 0 w `agreguj` (komentarz 61); Apple podaje liczby, puste pola rzadkie — bez znaleziska |
| DEV-08 daty | dotyczy | ok: daty jako tekst ISO z raportu, porównanie `processingDate` leksykograficzne poprawne dla RRRR-MM-DD |
| DEV-09 typy na granicach | dotyczy | bez znaleziska (skrypt narzędziowy, nie dane użytkownika aplikacji) |
| DEV-10 błędy obsłużone | dotyczy | ok: każdy błąd → kod 1 i krok „Wynik” czerwony; treść komunikatu → 08-programista-002 |
| DEV-11 tokeny UI | nie dotyczy | brak UI |
| DEV-12 i18n | nie dotyczy | log techniczny CI, nie tekst aplikacji |
| DEV-13 liczby konfiguracyjne | dotyczy | ok: `limit=200` w kliencie, stany w stałych |
| DEV-14 sekrety | dotyczy | ok w repo; uruchamianie kodu z sekretami → 08-programista-001 |
| DEV-15 zasoby | nie dotyczy | brak nasłuchów/timerów poza `sleep` przy 429 |
| DEV-16 jednostki | nie dotyczy | brak przeliczeń jednostek |

## Znaleziska (szczegóły)

### 08-programista-001 · Harmonogram z sekretami uruchamia kod z ruchomej gałęzi `ci/asc-analityka`
- Pozycja listy kontrolnej: DEV-14
- Poziom: P1; wg CLAUDE.md WYSOKIE (sekrety/bezpieczeństwo) — blokuje włączenie harmonogramu w prywatnym repo
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: `scripts/asc/prywatne-repo/asc-dane.yml:27` (`SKRYPTY_REF: ci/asc-analityka`) i `scripts/asc/prywatne-repo/asc-dane.yml:37` (`ref: ${{ inputs.skrypty_ref || env.SKRYPTY_REF }}`); uruchomienie z harmonogramu nie ma `inputs`, więc bierze gałąź. Komentarz w linii 26 odkłada przypięcie „po scaleniu”.
- Mechanizm: każdy przyszły commit na gałęzi publicznego repo (dowolnej sesji z prawem push) wykona się co poniedziałek z kluczem Admin ASC bez recenzji; `grep -n "ref:" scripts/asc/prywatne-repo/asc-dane.yml` → 1 trafienie (linia 37).
- Powraca: nie
- Wzorzec lub źródło: CLAUDE.md „Model pracy po L-001” pkt 1 (przebieg dowodowy na konkretnym kodzie); polecenie AN pkt 2 (089ff0f2 jako SHA uruchamiane z sekretami).
- Kroki: agent wypycha poprawkę na `ci/asc-analityka` (np. dopisuje log diagnostyczny) → poniedziałek 05:17 UTC przebieg w prywatnym repo wykonuje nowy kod z kluczem Admin.
- Opcje: (A) `SKRYPTY_REF` = pełny SHA `089ff0f27b39e62edd3c4d04881740c59e120f43` już teraz i zmiana SHA tylko po recenzji — kompromis: każda zmiana skryptów wymaga ręcznej podmiany SHA w prywatnym repo; (B) gałąź chroniona tylko do odczytu dla agentów — kompromis: ustawienia GitHub po stronie właściciela, nadal brak recenzji per zmiana. Rekomendacja: A; dodatkowo test w `tests/asc-analityka.test.ts`, że `SKRYPTY_REF` ma postać 40 znaków hex.
- Test akceptacyjny: test szablonu odrzuca `SKRYPTY_REF` niebędący 40-znakowym SHA.
- Status: otwarte

### 08-programista-002 · Identyfikator raportu Apple nie jest maskowany w komunikacie błędu HTTP
- Pozycja listy kontrolnej: DEV-10
- Poziom: P2; wg CLAUDE.md ŚREDNIE (log w prywatnym repo; identyfikator bez klucza nie daje dostępu) — backlog
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: `scripts/asc/iap-localizations.mjs:57` maskuje tylko segmenty zaczynające się od znaku hex; ID raportu w dokumentacji Apple ma postać `r142-<UUID żądania>` (przykład z GET `/v1/analyticsReportRequests/{id}/reports`). Komenda z sekcji o kontroli dowodów → maska nie zmienia ścieżki. Błąd trafia do logu przez `scripts/asc/analityka.mjs:170` (200 znaków).
- Mechanizm: maska po wzorcu zamiast po pozycji segmentu; `grep -n "replace(/\\\\/\[0-9a-f-\]" scripts/asc/*.mjs` → 1 trafienie (`scripts/asc/iap-localizations.mjs:57`); dotyczy wszystkich skryptów `scripts/asc/` używających `makeClient` (ID zrzutów, lokalizacji są UUID — maskowane).
- Powraca: nie
- Wzorzec lub źródło: polecenie AN pkt 3b; nagłówek `scripts/asc/analityka.mjs:7`.
- Kroki: Apple zwraca 5xx/403 na `GET /v1/analyticsReports/{id}/instances` → w logu ścieżka `GET /v1/analyticsReports/r142-<uuid>/instances → 500` bez maski, czyli też UUID żądania raportu.
- Opcje: (A) maskować każdy segment ścieżki po nazwie zasobu (`/v1/<zasób>/<cokolwiek>` → `{id}`) — kompromis: zmiana wspólnego klienta, testy innych skryptów ASC do sprawdzenia; (B) maska rozszerzona o `[a-z]\d+-[0-9a-f-]+` — kompromis: znowu po wzorcu. Rekomendacja: A.
- Test akceptacyjny: atrapa zwraca 500 na `/v1/analyticsReports/r142-<uuid>/instances` → log nie zawiera `r142` ani UUID.
- Status: otwarte

### 08-programista-003 · Testy nie wykryłyby wycieku danych w ścieżkach błędów ani usunięcia `readOnlyClient`
- Pozycja listy kontrolnej: DEV-03
- Poziom: P1; wg CLAUDE.md ŚREDNIE (dziś kod nie wycieka poza 002; ryzyko regresji) — backlog z wersją, najlepiej razem z 001
- Realność: realny (dla przyszłej zmiany) · Pewność: wysoka
- Rodzaj: D
- Dowód: mutacje M1, M5, M6, M7 przechodzą (sekcja „Kontrola dowodów”). Test prywatności `tests/asc-analityka.test.ts:212-216` sprawdza tylko pełny przebieg bez błędu; test błędu POST (185–189) sprawdza tylko `'403'`; ochrona `na-zywo` (`tests/asc-analityka.test.ts:327`) sprawdza obecność słowa `readOnlyClient` w źródle. Ochrona przed ponowieniem POST (M4) jest tylko statyczna (`tests/asc-analityka.test.ts:325`).
- Mechanizm: asercje prywatności i metod na jednej ścieżce zamiast na wszystkich scenariuszach.
- Powraca: nie
- Wzorzec lub źródło: rola 08, zasada „test, który potrafi paść”; polecenie AN pkt 3e.
- Kroki: przyszła poprawka diagnostyczna dopisuje treść odpowiedzi do błędu → testy zielone, dane w logu.
- Opcje: (A) we wszystkich scenariuszach `drive()` (także błędów: 4xx/5xx z `errors[].detail` zawierającym dane, zła suma, wyjątek parsowania) wspólna asercja „log bez zakazanych napisów” + atrapa zapisująca `detail` z danymi; dla `na-zywo` test, że POST przez `run()` rzuca (atrapa klienta z metodą `call('POST')`), oraz liczba POST = 1 w teście 403 — kompromis: kilkanaście linii testu; (B) tylko zakazane napisy w ścieżkach błędów — kompromis: M6 nadal niewykryta. Rekomendacja: A.
- Test akceptacyjny: mutacje M1, M4 (wersja pętli), M5, M6, M7 każda daje co najmniej jeden czerwony test.
- Status: otwarte

### 08-programista-004 · `unique_counts` sumowane po urządzeniach zapisane jako liczba unikalnych
- Pozycja listy kontrolnej: DEV-07
- Poziom: P2; wg CLAUDE.md NISKIE (dane wewnętrzne do hipotez H-51…H-53, nie w aplikacji)
- Realność: realny · Pewność: średnia (skala zawyżenia nieznana)
- Rodzaj: P
- Dowód: `scripts/asc/analityka.mjs:62` (komentarz o zawyżeniu) i `scripts/asc/analityka.mjs:70` (suma); w CSV kolumna nazywa się `unique_counts` bez zastrzeżenia.
- Mechanizm: agregacja sum po wymiarach pominiętych (Device, Platform Version); 1 trafienie.
- Powraca: nie
- Kroki: osoba licząca konwersję z `discovery.csv` bierze `unique_counts` za liczbę osób.
- Opcje: (A) kolumna `unique_counts_suma_urzadzen` — kompromis: zmiana nagłówka istniejących plików (przed pierwszym przebiegiem — darmowa); (B) zostawić, opisać w dokumencie odbiorcy — kompromis: łatwo przeoczyć. Rekomendacja: A, przed pierwszym przebiegiem.
- Test akceptacyjny: nagłówek CSV nie twierdzi „unique” bez zastrzeżenia.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- Czy S3 Apple wysyła segment z `Content-Encoding: gzip`: wtedy `fetch` rozpakuje treść i suma MD5 (`scripts/asc/analityka.mjs:115`) się nie zgodzi → przebieg kod 1 (głośno, bez utraty danych). Rozstrzygnie pierwszy prawdziwy przebieg.
- Dwie instancje z tym samym `processingDate` i tą samą datą (`najnowszePoDacie`, linia 81) są łączone, a `agreguj` je sumuje — podwójne liczenie, gdyby Apple wystawił duplikat; dokumentacja tego nie wyklucza ani nie opisuje.
- Stany `appInfo` opublikowanego (`scripts/asc/na-zywo.mjs:17`) — autor oznaczył `[DO USTALENIA]`; zachowanie zastępcze jest bezpieczne (tylko odczyt).
- Akcje w workflowie przypięte tagiem (`actions/checkout@v5`, `actions/setup-node@v5`), nie SHA — oficjalne akcje GitHub, niskie ryzyko.

## Co działa dobrze i należy zachować
- Jedyny zapis odgrodzony trzema warunkami (flaga, GET przed POST, brak ONGOING) i sprawdzony w usłudze w tym samym przebiegu; stan zatrzymany nigdy nie tworzy nowego żądania (M2, M3 wykryte).
- Segment pobierany bez nagłówka `Authorization`, od razu po liście segmentów danej instancji (zgodnie z 5-minutową ważnością), z kontrolą MD5.
- Klient nie wypisuje `detail` ani treści odpowiedzi; ścieżka bez zapytania; UUID i numeryczne ID aplikacji maskowane.
- Klucz: osobny krok, `umask 077`, `$RUNNER_TEMP`, maski linii klucza, usuwanie w `if: always()`; `ASC_KEY_P8` tylko w pierwszym kroku; drugi checkout `persist-credentials: false`; jedyne uprawnienie `contents: write`.
- Scalenie CSV: daty z nowych instancji zastępują stare w całości, starsze daty zostają (M8 wykryta).

## Decyzje dla właściciela
Brak decyzji produktowych wymagających właściciela teraz. 001 i 002 to poprawki techniczne (koordynator). 004: wybór nazwy kolumny — koordynator albo właściciel, opcje wyżej, rekomendacja A.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 08-programista --tryb fix --zadania 08-programista-001,08-programista-002,08-programista-003,08-programista-004` — wykonawca inny niż recenzent (L-047); 001 przed włączeniem harmonogramu.

Wynik `node sprawdz-raport.mjs docs/wydanie/asc-analityka-recenzja.md . --rola 08-programista` (kopia skryptu w scratchpadzie): kod 0, „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 08-programista”. `git status --porcelain` przed commitem: tylko `?? docs/wydanie/asc-analityka-recenzja.md` (plików AM nie zmieniono).

## Recenzja 2 (KO-121 i odbiór poprawek 001–004)
**autor:** sesja AM · **recenzent:** sesja AN · **data:** 22.11.2026 · **zakres:** `git diff a6b66e1e..5cbe1642 -- scripts tests` (nowe `scripts/asc/recenzje.mjs`, `scripts/asc/ceny.mjs`, `scripts/asc/pomocnicze.mjs`, 3 raporty Commerce w `scripts/asc/analityka.mjs`, kroki w szablonie) oraz odbiór poprawek z `cc670b8d` (`git diff 089ff0f..a6b66e1e`). Odwołania `plik:linia` w tej sekcji dotyczą SHA `5cbe1642`; w sekcjach wyżej — SHA `089ff0f2`. Nic nie uruchamiano przeciw App Store Connect.

**Odbiór poprawek (to nie nowy audyt):**
| ID | Stan | Dowód |
|---|---|---|
| 001 | zamknięte co do mechanizmu, ale patrz 005 | szablon przyjmuje tylko pełny SHA (krok walidacji przed pobraniem skryptów, także pole ręczne); testy „001: …” |
| 002 | zamknięte | `maskujSciezke` maskuje segment z cyfrą-tylko, myślnikiem albo długim hex; mutacja M17 (bez reguły myślnika) → 5 testów czerwonych |
| 003 | zamknięte (z resztą niską, 007) | mutacje M1, M4b (ponowienie POST w pętli z jednym literałem), M5 (treść segmentu w błędzie sumy, jawny TSV) i M7 → czerwone testy; dawniej przechodziły |
| 004 | zamknięte | kolumna `unique_counts_suma_urzadzen`, test „004: …” |

**Wymagania dla nowego kodu:**
- (a) Tylko GET: `recenzje.mjs` i `ceny.mjs` owijają klienta w `readOnlyClient` (`scripts/asc/recenzje.mjs:25`, `scripts/asc/ceny.mjs:25`), a `stronicuj` woła wyłącznie `call('GET', …)`. Raporty Commerce idą tym samym żądaniem ONGOING, więc nie dodają zapisu. Jedyny POST bez zmian (M2, M3, M4b czerwone).
- (b) Prywatność: pseudonim autora nie jest zapisywany (`scripts/asc/recenzje.mjs:17` — tylko id, data, terytorium, ocena, tytuł, treść; mutacja M9 dopisująca pseudonim → test czerwony). W logu tylko liczności (M10 tytuł w logu, M11 treść w logu błędu, M14 kwota w logu → czerwone). Ścieżki błędów: komunikat klienta z maską, ID grupy subskrypcji (liczba) maskowane, `filter[productId]` odcięty z zapytaniem.
- (d) Dokumentacja Apple (odczyt 22.11.2026, surowy JSON stron): kolumny raportów App Store Purchases, Subscription State i Subscription Event zgadzają się z nazwami w kodzie (m.in. Proceeds in USD, Sales in USD, Event Date, State Metric, Auto-Renew Status, Cancellation Reason, App Download Source Type); „Paying Users” pominięte zgodnie z „This metric is not summable across rows”; endpointy `customerReviews`, `customerReviewSummarizations` (z wymaganym `filter[platform]`), `subscriptions/{id}/prices`, `inAppPurchasesV2` (`filter[productId]`), `iapPriceSchedule`, `manualPrices`/`automaticPrices` istnieją, `include` zgodne z dozwolonymi wartościami, `limit` maksimum 200.
- (e) Testy: 52/52 (`npx jest --ci tests/asc-analityka.test.ts`, kod 0); 14 mutacji: 12 wykrytych, 2 niewykryte (M12, M13 — patrz 007).

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 08-programista-005 | P1 (ŚREDNIE) | D | Szablon przypina `089ff0f2`, w którym nie ma `recenzje.mjs`, `ceny.mjs` ani poprawek 002/004 — kroki recenzji i cen padną, „Wynik” czerwony co tydzień | otwarte |
| 08-programista-006 | P2 (NISKIE) | D | Uszkodzony `recenzje.json` jest po cichu zastępowany listą z bieżącej odpowiedzi API | otwarte |
| 08-programista-007 | P2 (NISKIE) | D | Usunięcie `readOnlyClient` w `recenzje.mjs`/`ceny.mjs` nie łamie żadnego testu | otwarte |

### 08-programista-005 · Przypięty SHA nie zawiera skryptów, które szablon uruchamia
- Pozycja listy kontrolnej: DEV-04
- Poziom: P1; wg CLAUDE.md ŚREDNIE (nie dane, nie sekrety: przebieg czerwony, App Analytics działa) — nie blokuje scalenia, ale szablonu nie kopiować do prywatnego repo przed podmianą SHA
- Realność: realny · Pewność: wysoka
- Rodzaj: D
- Dowód: `scripts/asc/prywatne-repo/asc-dane.yml:28` (`SKRYPTY_REF: 089ff0f27b39e62edd3c4d04881740c59e120f43`); `git cat-file -e 089ff0f2:scripts/asc/recenzje.mjs` → brak (to samo `ceny.mjs`, `pomocnicze.mjs`); `git show 089ff0f2:scripts/asc/iap-localizations.mjs | grep -c maskujSciezke` → 0, czyli przypięta wersja nie ma też poprawki 002 ani nazwy kolumny z 004.
- Mechanizm: SHA w szablonie nie jest aktualizowany razem z dodaniem kroków; brak testu spójności; 1 trafienie.
- Powraca: tak — wariant 001 → trwała kontrola: test, że każdy skrypt wołany w szablonie istnieje w przypiętym SHA (`git cat-file -e`), z pominięciem, gdy SHA nie ma w klonie CI.
- Kroki: właściciel kopiuje szablon do prywatnego repo → poniedziałkowy przebieg: krok „Recenzje…” kończy się `Cannot find module` → krok „Wynik” czerwony.
- Opcje: (A) po tej recenzji przypiąć `5cbe1642…` (pełny SHA) i dodać test spójności — kompromis: kolejny commit; (B) przypinać dopiero SHA scalenia do `main` — kompromis: do scalenia szablon niespójny. Rekomendacja: A.
- Test akceptacyjny: test spójności szablonu czerwony na `089ff0f2`, zielony na nowym SHA.
- Status: otwarte

### 08-programista-006 · Uszkodzony `recenzje.json` jest po cichu nadpisywany
- Pozycja listy kontrolnej: DEV-10
- Poziom: P2; wg CLAUDE.md NISKIE (historia w git prywatnego repo pozwala odzyskać)
- Realność: brzegowy (plik pisze tylko skrypt; uszkodzenie np. przy ręcznej edycji albo konflikcie) · Pewność: wysoka
- Rodzaj: D
- Dowód: `scripts/asc/recenzje.mjs:33` — błąd parsowania daje `stare = []` bez komunikatu, potem zapis zastępuje plik; recenzje, których API już nie zwraca (usunięte przez autorów), znikają z bieżącego pliku.
- Mechanizm: puste `catch` przy odczycie danych do scalenia; 1 trafienie w nowych skryptach.
- Powraca: nie
- Opcje: (A) błąd parsowania → kod 1 bez zapisu — kompromis: wymaga ręcznej naprawy pliku; (B) kopia `recenzje.uszkodzone.json` i komunikat — kompromis: więcej kodu. Rekomendacja: A.
- Test akceptacyjny: atrapa z nieprawidłowym `recenzje.json` → kod 1, plik bez zmian.
- Status: otwarte

### 08-programista-007 · Ochrona „tylko odczyt” nowych skryptów nie ma testu zachowania
- Pozycja listy kontrolnej: DEV-03
- Poziom: P2; wg CLAUDE.md NISKIE (dziś skrypty nie wołają metod zapisu; to druga linia obrony)
- Realność: teoretyczny dziś, realny przy przyszłej zmianie · Pewność: wysoka
- Rodzaj: D
- Dowód: mutacje M12 (`recenzje.mjs` bez `readOnlyClient`) i M13 (`ceny.mjs` bez `readOnlyClient`) → testy zielone; test źródła sprawdza tylko brak literałów `'POST'|'PATCH'|'DELETE'`. Dla `na-zywo.mjs` poprawka 003 dodała test źródła (`c = readOnlyClient(client)` i brak innych odwołań do `client`), dla nowych skryptów go nie ma.
- Mechanizm: ta sama luka co M6 w 003, powtórzona w nowych plikach; 2 trafienia.
- Powraca: tak — 003/M6 → trwała kontrola: jeden test źródła obejmujący listę wszystkich skryptów tylko-do-odczytu w `scripts/asc/` (na-zywo, recenzje, ceny).
- Opcje: (A) rozszerzyć test 003/M6 na listę plików — kompromis: kilka linii; (B) test zachowania: `run()` z klientem, którego `call('POST')` zapisuje wywołanie, plus wstrzyknięty błąd w kodzie — kompromis: wymaga punktu wstrzyknięcia. Rekomendacja: A.
- Test akceptacyjny: M12 i M13 dają czerwony test.
- Status: otwarte

**Do sprawdzenia (pewność ≤ 80%):** `ceny.mjs` nie zapisuje `planType` (MONTHLY/UPFRONT, dozwolony atrybut ceny subskrypcji) — przy planie z rocznym zobowiązaniem i płatnością miesięczną dwie ceny tego samego terytorium byłyby nierozróżnialne; dla obecnych produktów Treningu `[DO USTALENIA]`. `ocena: Number(rating ?? 0)` (`scripts/asc/recenzje.mjs:17`) zamienia brak oceny na 0; Apple podaje ocenę 1–5 zawsze — teoretyczne.

**Dowody Recenzji 2:** worktree w scratchpadzie na `5cbe1642`; `npx jest --ci tests/asc-analityka.test.ts` → 0, `Tests: 52 passed`; mutacje: M1, M2, M3, M4b, M5 (poprawiona: jawny TSV), M9, M10, M11, M14, M15 (scalenie recenzji gubi stare), M16 (ignorowana `Event Date`), M17 → czerwone; M12, M13 → zielone. `git status --porcelain` worktree pusty po każdej mutacji. Gałąź recenzji scaliła `origin/ci/asc-analityka` (5cbe1642) bez zmian w kodzie AM, żeby odwołania wskazywały istniejące linie.
