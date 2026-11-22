# Automat odczytu App Analytics przez API App Store Connect — wykonalność (E0, KO-100)

Stan: 22.11.2026, rola programisty (sesja AM), gałąź `ci/asc-analityka`. Bez kodu. Odbiorca liczb: hipotezy H-51…H-53 (`docs/45-widocznosc-w-sklepie.md:97-99`) i diagnoza „ruch tylko z PL”.
Odczyt dokumentacji Apple: 22.11.2026, surowy JSON stron `developer.apple.com/tutorials/data/documentation/...` (ta sama treść co strony `developer.apple.com/documentation/...`; zapis cytatów dosłowny z odczytanego tekstu).

## 1. Wynik: wykonalność WARUNKOWO — tak

Warunki: (a) zgoda właściciela na jeden zapis w ASC (żądanie raportu), (b) wybór wariantu prywatności, (c) pierwsze dane dopiero po 1–2 dniach od żądania.

## 2. Co mówi API (twierdzenia ze źródłem)

| # | Twierdzenie | Źródło (adres, cytat) |
|---|---|---|
| 1 | Żądanie raportu tworzy się `POST /v1/analyticsReportRequests`, body: `accessType` ∈ {`ONGOING`, `ONE_TIME_SNAPSHOT`} + powiązanie z aplikacją. | developer.apple.com/documentation/appstoreconnectapi/post-v1-analyticsreportrequests; `AnalyticsReportRequestCreateRequest.Data.Attributes`: „The `accessType` `ONGOING` provides current data and is the most typical. It generates reports daily, weekly and monthly. Use `ONE_TIME_SNAPSHOT` to get historical data.” |
| 2 | `POST` wymaga roli **Admin**; pobieranie raportów: Admin, Finance, Sales and Reports. | .../appstoreconnectapi/analytics, tabela ról: „Admin | Request Reports and Delete a Report Request | Read Reports for a Specific Request”; Finance i Sales and Reports tylko druga kolumna. |
| 3 | Pierwsze dane po 1–2 dniach, potem codziennie. | .../downloading-analytics-reports: „Your first report request generates in 1–2 days. Subsequent ONGOING reports are available daily.” |
| 4 | Bez żądania Apple nie generuje raportów — czyli pierwsze żądanie to **zapis w koncie ASC**, trwały (ONGOING generuje się dalej, aż do nieaktywności lub usunięcia). | .../analytics-reports: „Apple does not generate reports until you create a valid Analytics Report Request.”; .../get-v1-analyticsreportrequests-_id_: „If you don’t retrieve data for a long time, a report request changes to stoppedDueToInactivity. You need to make a new request to resume getting reports.” (próg „długo” — **[DO USTALENIA]**, Apple nie podaje liczby w odczytanych stronach). |
| 5 | Ścieżka odczytu (tylko GET): `GET /v1/apps/{id}/analyticsReportRequests` → `GET /v1/analyticsReportRequests/{id}/reports` (filtry `filter[category]`, `filter[name]`; kategorie m.in. `APP_STORE_ENGAGEMENT`, `COMMERCE`) → `GET /v1/analyticsReports/{id}/instances` (granularity daily/weekly/monthly, `processingDate`) → `GET /v1/analyticsReportInstances/{id}/segments` (URL pobrania). | .../get-v1-analyticsreportrequests-_id_-reports (parametry), .../downloading-analytics-reports. |
| 6 | URL segmentu ważny 5 minut; segmenty trzeba pobrać wszystkie; `sizeInBytes` i `checksum` służą do weryfikacji. | .../get-v1-analyticsreportinstances-_id_-segments: „The download URLs are valid for 5 minutes after generating.”; downloading-analytics-reports: „you need to download all segments for a given instance” (analytics-reports) i „use `sizeInBytes` and `checksum`”. |
| 7 | Instancja żyje 35 dni; historię odtwarza `ONE_TIME_SNAPSHOT`, **jeden na miesiąc**; dane od 1.01.2024. | .../analytics-reports: „Once you generate a report instance, it’s available for 35 days.”, „You can make a single, one-time snapshot request per month.”; app-store-discovery-and-engagement: „History: On request, data is available beginning from January 1, 2024.” |
| 8 | Nowsza instancja z późniejszym `processingDate` nadpisuje starszą — nie łączyć rekordów tej samej daty z dwóch instancji. | .../data-completeness-corrections: „Don’t merge records for a Date of `2024-03-30` across two report instances to avoid double counting. Use the latest instance.” |
| 9 | Kolumny po nazwach, nie pozycjach. | .../analytics-reports: „Rely on column names instead of column positions”. |

Nie ustalone (nie zgaduję): format pliku segmentu (kompresja, separator) — strona obiektu `AnalyticsReportSegment` nie opisuje go w odczytanym JSON; **[DO USTALENIA]** przy pierwszym odczycie jednego segmentu. Dokładne nazwy raportów w polu `name` (np. wariant „Standard”/„Detailed”) — widoczne dopiero w odpowiedzi API dla konta; skrypt filtruje po `category` i dopasowaniu nazwy z listy, nie po zgadniętym ciągu. Co zwraca `POST`, gdy żądanie `ONGOING` już istnieje (odpowiedź 409 Conflict jest w specyfikacji, jej znaczenie nie jest opisane) — **[DO USTALENIA]**; dlatego skrypt zawsze najpierw czyta `GET /v1/apps/{id}/analyticsReportRequests` i tworzy żądanie tylko, gdy żadne `ONGOING` nie istnieje.

## 3. Miary z celu właściciela a pola raportów

Dwa raporty, wariant **Standard** wystarcza do celu (Source Info i Page Title są tylko w Detailed; Territory i Source Type są w obu): „Download the standard report unless you need to analyze the unique fields in the detailed report.” (app-store-discovery-and-engagement, Privacy).

| Miara | Raport → pola | Uwaga |
|---|---|---|
| Impressions | App Store Discovery and Engagement: `Event` = Impression, `Counts` / `Unique Counts` | **Rozbieżność z celem:** Apple opisuje `Unique Counts` jako „the total number of unique users”, nie „unique devices”. Używamy `Unique Counts` i w raporcie podpisujemy „unikalni użytkownicy (wg Apple)”. |
| Product Page Views | to samo: `Event` = Page view, `Page Type` = Product page | Bez filtra `Page Type` widoki obejmują też strony wydarzeń itd. |
| Pierwsze i ponowne pobrania | App Store Downloads: `Download Type` = First-time Download / Redownload, `Counts` | Raport pobrań ma tylko `Counts` (bez unikalnych). |
| Conversion Rate | **nie jest polem raportu** — wyliczamy: pobrania pierwszorazowe ÷ odsłony strony (jak H-52) | Dwa różne raporty (różny stopień kompletności: Discovery 3 dni, Downloads 2 dni): liczymy tylko dla dat obu kompletnych. Definicji wskaźnika z interfejsu App Analytics nie odczytałem — nie twierdzę, że jest identyczny. |
| Wymiary | `Date`, `Territory`, `Source Type` (App Store search, App Store browse, App referrer, Web referrer, ...) | definicje wartości: tabele w obu raportach. |

## 4. Klucz i środowisko dziś

- Workflowy `asc-*` (`.github/workflows/asc-status-wersji.yml:7,25-29,35-38`; ten sam wzór w `asc-kontrola.yml:26-28`, `asc-metadane.yml:34-36`) używają sekretów **`ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`**; klucz zapisują do `RUNNER_TEMP` i usuwają w kroku `if: always()` (`asc-status-wersji.yml:44-46`); `permissions: contents: read`.
- Rola klucza: **Admin** (`docs/15` wiersz 339: „dostęp **Admin**”) — czyli spełnia warunek z p. 2 (może tworzyć żądania); **nowego sekretu ani uprawnienia nie trzeba**.
- Klient i JWT już są: `scripts/asc/iap-localizations.mjs` (`makeClient`, `makeJwt`, `BUNDLE_ID`), tryb tylko-odczyt: `readOnlyClient` w `scripts/asc/metadane.mjs`, użycie: `scripts/asc/status-wersji.mjs:8-9,34`. Nowy skrypt używa tych samych elementów; metody niebędące GET w trybie domyślnym kończą się błędem.
- Środowisko `release` (wymagana zgoda) mają tylko zadania zapisujące (`asc-metadane.yml:58`); odczytowe go nie mają. Zapis ONGOING = analogicznie osobne zadanie z `environment: release`.

## 5. Prywatność (repozytorium i logi publiczne)

Fakt: artefakty i logi przebiegów publicznego repozytorium są czytelne dla każdego (CLAUDE.md: „Logi i artefakty CI też są publiczne”); `::add-mask` maskuje ciągi, nie chroni liczb w tabeli. Dane Apple są dodatkowo zaszumione / progowane (w Detailed: „omit data from values that have fewer than 5 users or 5 unique devices”, privacy) — nie czyni to ich publicznymi.

| Wariant | Opis | Kompromis | Wykonalność | Wymaga zgody właściciela? |
|---|---|---|---|---|
| **A. Tylko wskaźniki** | W logu / `GITHUB_STEP_SUMMARY` tylko udziały i konwersje (np. udział „App Store search” w pobraniach pierwszorazowych, konwersja z wyszukiwania, udział terytoriów w wyświetleniach), zaokrąglone do 1 p.p. i z flagą „za mało danych”, gdy mianownik < 20 (próg do ustalenia, zapis w jednym module konfiguracji); bez liczb bezwzględnych, bez pliku danych. | Zero kroków właściciela, zero nowych sekretów; odpowiada wprost na H-51/H-52/H-53 i „ruch tylko z PL”. Nie da się z tego odtworzyć szeregu dziennego ani policzyć czegoś nowego bez ponownego przebiegu. | Prosty: ten sam wzorzec co `status-wersji.mjs` (czyste funkcje + `log`), test na plikach przykładowych w Node. | Nie. |
| **B. Artefakt szyfrowany kluczem publicznym** | Surowe wiersze dzienne (CSV) zapisywane jako artefakt **zaszyfrowany**: klucz publiczny (RSA/age) leży w repo (nie jest sekretem), prywatny ma tylko właściciel i odszyfrowuje lokalnie. W logu nadal tylko wskaźniki jak w A. | Pełne dane dla właściciela i agenta (po przekazaniu pliku), bez nowych sekretów w repo; koszt: właściciel raz generuje parę kluczy i przy każdej analizie pobiera i odszyfrowuje (kilka komend). Klucz prywatny w złych rękach = ujawnienie danych sprzed utraty. | Szyfrowanie hybrydowe (AES-256-GCM + RSA-OAEP) w `node:crypto` bez nowych zależności; test odszyfrowania w jednostce. Retencja artefaktu 35 dni (zgodna z oknem instancji Apple). | Tak — klucz publiczny dodaje właściciel (jeden plik w repo); generowanie pary po jego stronie. |
| **C. Prywatne miejsce właściciela** (prywatne repo / Dysk) | Skrypt wypycha CSV poza publiczny zasięg. | Najwygodniejsze dla analizy, ale wymaga **nowego sekretu lub tokenu zapisu** poza repo → rozszerzenie uprawnień. | Niesprawdzone (brak istniejącego sekretu na taki cel) — wykonalność niesprawdzona. | Tak, nowy sekret. |

**Rekomendacja (do weta):** A od razu (pierwszy przebieg dowodowy i odpowiedź na H-51…H-53 bez udziału właściciela), B jako rozszerzenie, gdy właściciel zechce surowe dane (np. do analizy „ruch tylko z PL” po terytoriach i źródłach). C odrzucone teraz — wymaga nowego sekretu. Uzasadnienie: A mieści się w zakazie nowych sekretów i uprawnień, B dopiero po jednym kroku właściciela.

## 6. Pierwszy zapis w ASC, koszt, czas

- **Pierwsze żądanie raportu to zapis w koncie ASC** (p. 2 i 4 z sekcji 2): tworzy trwałe żądanie `ONGOING` dla aplikacji. Potrzebna zgoda właściciela na ten jeden zapis. Skrypt: najpierw `GET` istniejących żądań; `POST` tylko gdy brak `ONGOING`; zakres zapisu: jedna aplikacja, `accessType: ONGOING`; sprawdzenie w usłudze: `GET` żądania i jego stanu (nie `stoppedDueToInactivity`) w tym samym przebiegu (L-001, pierwszy zapis najpierw na jednym elemencie). `ONE_TIME_SNAPSHOT` (limit: 1 na miesiąc) — dopiero osobną decyzją, jeśli potrzebna historia (dane od 1.01.2024 — aplikacja mogła jeszcze nie istnieć; nie sprawdzano).
- Cofnięcie: `DELETE /v1/analyticsReportRequests/{id}` (rola Admin, ta sama tabela ról).
- Opóźnienie: pierwsze dane 1–2 dni po żądaniu; Discovery kompletne po 3 dniach, Downloads po 2 („Completeness: Within three days / two days”). Rozstrzygnięcie H-51…H-53 na 26.12.2026 jest osiągalne, jeśli żądanie powstanie do końca listopada (pierwsze dni 1–2 + tydzień zbieranych danych).
- Koszt: 0 zł (ubuntu-latest w publicznym repo, jak pozostałe `asc-*`). Czas pracy agenta: skrypt + testy + workflow ok. 1 sesji; czekanie: przebieg dowodowy po dniach od żądania, nie godzinach; właściciel: zgoda na zapis, ewentualnie wariant B (klucz publiczny).
- Ograniczenie: instancje żyją 35 dni, `stoppedDueToInactivity` wymaga regularnych odczytów — workflow tylko `workflow_dispatch` (jak pozostałe `asc-*`) oznacza, że „ręcznie raz na kilka tygodni” może zatrzymać żądanie; planowanie (`schedule`) to decyzja do właściciela — rekomenduję krótki harmonogram tygodniowy dopiero po pierwszym zielonym przebiegu.

## 7. Decyzje do weta (KO-101…KO-102, tryb „analogia”)

- KO-101: wariant prywatności A od razu, B jako opcja; C odrzucone teraz. Powód: patrz sekcja 5.
- KO-102: jedno żądanie `ONGOING` dla aplikacji, `ONE_TIME_SNAPSHOT` osobno. Powód: patrz sekcja 6.

## 8. Otwarte

- Format segmentu i dokładne nazwy raportów — z pierwszego odczytu (sekcja 2).
- Znaczenie odpowiedzi 409 i próg `stoppedDueToInactivity` — nieopisane w odczytanych stronach.
- Czy żądanie `ONGOING` już istnieje w koncie — nie sprawdzono (brak dostępu do ASC z tej sesji; skrypt sprawdza `GET` jako pierwszy krok).

## 9. Inwentarz danych z ASC przez API (rozszerzenie zakresu, właściciel 22.11.2026)

Cel właściciela (dosłownie): „Chce zeby wszystko co sie da bylo wyciagane z ASC przez API zebym nie musial sam dawac danych do analiz.” Odczyt: 22.11.2026, `developer.apple.com/tutorials/data/documentation/appstoreconnectapi/...` (adres strony: `developer.apple.com/documentation/appstoreconnectapi/<nazwa>`) i Pomoc ASC. „Klucz dziś” = sekrety `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (`asc-status-wersji.yml:25-29`), rola **Admin** (`docs/15:339`); wymóg „Team key” dla sprzedaży i finansów potwierdza Apple (poniżej), czy nasz klucz jest Team, nie Individual — **[DO USTALENIA]**, rozstrzyga pierwszy przebieg odczytu sprzedaży.
Role per endpoint Apple podaje tylko dla analityki (p. 2); dla pozostałych zasobów odczytanych stron roli nie ma — Admin obejmuje odczyt (rola najwyższa), nie twierdzę więcej.
Limit: „The limits apply to requests you send using the same API key.” (identifying-rate-limits); nagłówek `X-Rate-Limit` (`user-hour-lim`, `user-hour-rem`), 429 `RATE_LIMIT_EXCEEDED`, przykład 3500/h, „Actual limits can vary.”.
Prywatność wszystkich wariantów: publiczne repo → wzorzec z p. 5 (A: tylko wskaźniki; B: szyfrowany artefakt). Wyjątek: dane już publiczne (stan wersji, metadane w sprzedaży, ceny, dostępność — widoczne w sklepie) mogą iść do logu jawnie.

| # | Kategoria | Endpoint / raport (cytat) | Rola | Zapis w ASC? | Opóźnienie | Klucz dziś | Prywatność |
|---|---|---|---|---|---|---|---|
| 1 | **App Analytics** (wyświetlenia, odsłony strony, pobrania, źródło × terytorium) | `GET /v1/analyticsReportRequests/{id}/reports` itd. (p. 2); „Territories: Worldwide” | Admin / Finance / Sales and Reports | **Tak, raz** (POST ONGOING) | 1–2 dni na pierwsze dane; potem codziennie; kompletność 3 dni (Discovery), 2 dni (Downloads) | tak | A od razu, B opcjonalnie |
| 2 | **Sprzedaż i trendy** (jednostki, proceeds, subskrypcje) | `GET /v1/salesReports`: „Download sales and trends reports filtered by your specified criteria.”; typy: SALES, SUBSCRIPTION, SUBSCRIBER, SUBSCRIPTION_EVENT, PRE_ORDER… (DAILY/WEEKLY/MONTHLY/YEARLY) | Sales and Reports (także Admin/Finance wg tabeli ról) | nie | strefa PT: „Reports are based on Pacific Time (PT).”; godzina publikacji **[DO USTALENIA]** | **warunkowo**: „These endpoints require a Team key and aren’t usable with an Individual key.”; wymaga numeru dostawcy (`filter[vendorNumber]`) — nowy parametr, **nie sekret, ale dana konta** (nie do publicznego logu) | A (tylko sumy/udziały) lub B |
| 3 | **Finanse** (wypłaty) | `GET /v1/financeReports`: „Download finance reports filtered by your specified criteria.” (miesiąc fiskalny, region) | Finance (Admin wg tabeli ról analityki; dla finansów strona roli nie podaje) | nie | miesięczne; termin **[DO USTALENIA]** | jak wyżej (Team key, vendorNumber) | tylko B — kwoty |
| 4 | **Subskrypcje — stan i zdarzenia** | Raporty Analytics „App Store Subscription State/Event” (Commerce) oraz Sales: SUBSCRIPTION, SUBSCRIPTION_EVENT; wersja 1_3 („Version 1_2 … is no longer available”) | jak 1–2 | tak (jak 1; ten sam POST ONGOING obejmuje kategorię COMMERCE) | jak 1 / 2 | tak | tylko A lub B |
| 5 | **Opinie i recenzje klientów** | `GET /v1/apps/{id}/customerReviews`: „Get a list of customer reviews for a specific app.”; filtry `filter[rating]`, `filter[territory]`; `GET /v1/apps/{id}/customerReviewSummarizations`: „Get the customer review summarization for a specific app.” | (Admin; rola nie opisana) | nie | **[DO USTALENIA]** | tak | treść recenzji jest publiczna w sklepie, imiona autorów — nie wypisywać w logu (tylko liczba, ocena, terytorium) |
| 6 | **Ocena gwiazdkowa bez tekstu / średnia na terytorium** | Nie znalazłem endpointu: lista zasobów „App Store” (38 tematów) zawiera Customer Reviews i Customer Review Responses, nic o samych ocenach. **API tego nie daje (według odczytanej listy)**; średnią publicznie daje `itunes.apple.com/lookup` (już użyte w `docs/wydanie/diagnoza-ruch-poza-pl.md`). | — | — | — | — | publiczne |
| 7 | **Metadane wersji W SPRZEDAŻY** (słowa kluczowe, opis, „What’s new”, wszystkie lokalizacje) | `GET /v1/apps/{id}/appStoreVersions` z `filter[appStoreState]` (strona: parametr istnieje; wartość `READY_FOR_SALE` używa już `status-wersji.mjs:14`) → `GET /v1/appStoreVersions/{id}/appStoreVersionLocalizations` („Get a list of localized, version-level information about an app, for all locales.”, `filter[locale]`) | Admin | nie | na żywo | tak | publiczne (sklep pokazuje) — można jawnie do logu |
| 8 | **Nazwa i podtytuł na żywo** | `GET /v1/appInfos/{id}/appInfoLocalizations` („localized, app-level information”, `filter[locale]`); jeden `appInfo` ma stan wersji (do sprawdzenia przy odczycie: który jest „na żywo”) — **[DO USTALENIA]** | Admin | nie | na żywo | tak | publiczne |
| 9 | **Dostępność terytoriów** | `GET /v1/apps/{id}/appAvailabilityV2`: „Get a list of availabilities for a specific app.” | Admin | nie | na żywo | tak | publiczne |
| 10 | **Ceny** | `GET /v1/apps/{id}/appPriceSchedule` („Read price schedule details for a specific app.”), `GET /v1/apps/{id}/appPricePoints` (`filter[territory]`); dla IAP/subskrypcji osobne zasoby cen (nieodczytane — **[DO USTALENIA]**) | Admin | nie | na żywo | tak | publiczne |
| 11 | **Stan recenzji Apple** | `GET /v1/apps/{id}/reviewSubmissions` (`filter[platform]`, `filter[state]`) — już w `status-wersji.mjs:48` | Admin | nie | na żywo | **już działa** (`asc-status-wersji.yml`) | już bez identyfikatorów |
| 12 | **Wiadomości Apple (Resolution Center), powody odrzuceń** | Nie znalazłem w liście zasobów „App Store” (38 tematów) zasobu wiadomości z Resolution Center; istnieją tylko „App Store review details” (dane kontaktowe do recenzji) i załączniki. **API tego nie daje (według odczytanej listy)**; przekazanie przez właściciela. | — | — | — | — | — |
| 13 | **Eksperymenty strony, własne strony produktu, wydarzenia** | `GET /v1/apps/{id}/appCustomProductPages` (`filter[visible]`), `GET /v1/apps/{id}/appEvents`; eksperymenty: grupa „App Store version experiments” w liście zasobów | Admin | nie | na żywo | tak | publiczne (liczby wyników — w raportach Analytics, p. 1) |
| 14 | **Wydajność i zużycie** (uruchomienie, pamięć, baterie) | `GET /v1/apps/{id}/perfPowerMetrics`: „Get the performance and power metrics data for the most recent version of an app.” (filtry deviceType/metricType/platform) | Admin | nie | **[DO USTALENIA]** | tak | A (agregaty) |
| 15 | **TestFlight** (opinie testerów, zakresy) | Zasób w sekcji „TestFlight” głównego indeksu; strona `betaFeedback` pod adresem z mojego odczytu nie istnieje (404) — **nieodczytane, [DO USTALENIA]** | Admin | nie | — | tak | — |

### Rekomendowana kolejność wdrożenia (od tego, co zasila diagnozę „ruch tylko z PL” i pomiar)

Diagnoza (`aso/pozycjonowanie-1-2`, `docs/wydanie/diagnoza-ruch-poza-pl.md`, „Dane potrzebne z API”) potrzebuje: wyświetlenia × odsłony × pierwsze pobrania × źródło × terytorium (31) × dziennie od 05.11, oceny/recenzje × terytorium, słowa kluczowe na żywo w 32 lokalizacjach.

1. **Odczyt na żywo (tylko GET, bez zapisu, bez zgody na zapis; jeden przebieg `asc-metadane`-podobny):** pozycje 7, 8, 9, 10, 11 — metadane W SPRZEDAŻY (słowa kluczowe, nazwa, podtytuł, 32 lokalizacje), dostępność terytoriów, ceny, stan recenzji. Zasila „przyczynę 9” i naprawia dzisiejszy brak (podgląd czyta tylko wersję edytowalną, „Brak edytowalnej wersji”). Dane publiczne → jawny log. Do rozstrzygnięcia przy kodzie: który `appInfo` i która wersja jest „na żywo”.
2. **Pozycja 1 (App Analytics), po zgodzie na jeden zapis:** żądanie ONGOING (+ ewentualnie `ONE_TIME_SNAPSHOT` na dane od 05.11, jeśli Apple je wyda — historia „on request”, p. 7) i odczyt; wariant A w logu. To jedyne źródło miar źródło × terytorium × dziennie; opóźnienie 1–2 dni, więc **żądanie jak najwcześniej**, kod odczytu równolegle.
3. **Pozycja 5 (recenzje):** liczba i ocena × terytorium od 05.11 (do „przyczyny 1”); w logu bez treści i autorów.
4. **Pozycja 2 i 4 (sprzedaż, subskrypcje):** jednostki × terytorium dziennie jako niezależna kontrola pobrań; wymaga ustalenia typu klucza i numeru dostawcy (dana konta; osobny krok właściciela, jeśli klucz nie jest Team).
5. Później: 14, 13, 3, 15.

Czego API nie daje (wprost): oceny gwiazdkowej bez recenzji tekstowej i średniej z terytorium (pozycja 6), wiadomości z Resolution Center (pozycja 12) — według odczytanej listy zasobów; do sprawdzenia, czy Apple nie dodał ich w notatkach wydań (`app-store-connect-api-release-notes`, nieprzeczytane — **[DO USTALENIA]**). Nie sprawdzono też, ile historii Apple wyda przy `ONE_TIME_SNAPSHOT` dla aplikacji z danymi od 05.11.

## 10. Decyzje właściciela z 22.11.2026 (KO-106) i wdrożenie

- Zapis w ASC: tak, jeden (żądanie ONGOING; GET najpierw, POST tylko przy braku, sprawdzenie stanu w tym samym przebiegu).
- Prywatność: **prywatne repo właściciela** (wariant C z p. 5, zmieniony: dane w prywatnym repo, kod publiczny). Wykonalność przeczytana 22.11.2026: Actions w repo prywatnym liczą się do puli „included compute usage” (GitHub Free: $12 miesięcznie; „The included compute usage is expressed as a monetary amount, not a fixed number of minutes”), Linux 2-core $0.006/min (docs.github.com …/billing/reference/actions-runner-pricing) — przebieg ok. 3 min raz w tygodniu to ok. $0.08 miesięcznie (rachunek: 4,3 × 3 min × $0.006). Zapis do własnego repo: `permissions: contents: write` (docs.github.com …/workflow-syntax: „contents: write allows the action to create a release” — to samo uprawnienie obejmuje commit); `GITHUB_TOKEN` działa tylko w repo przebiegu. Schedule działa na „Last commit on default branch” i „can be delayed during periods of high loads”.
- Nowe sekrety: tylko kopie istniejących trzech (`ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8`) w prywatnym repo — nowego typu uprawnień brak; rekomendowany osobny klucz Admin dla tego repo (unieważnienie osobne). Kroki: `docs/wydanie/asc-analityka-kroki-wlasciciela.md`.
- Harmonogram: cron raz w tygodniu (poniedziałek 05:17 UTC) + dispatch (`scripts/asc/prywatne-repo/asc-dane.yml`). **Ryzyko:** Apple nie podaje progu `stoppedDueToInactivity` (get-v1-analyticsreportrequests-_id_: „If you don’t retrieve data for a long time…”; atrybut boolean `stoppedDueToInactivity` w AnalyticsReportRequest.Attributes). Tydzień może być bezpieczny albo nie — nieznane. Zabezpieczenie: skrypt przy zatrzymanym żądaniu kończy kodem 1 (workflow czerwony), nie tworzy drugiego żądania (drugi zapis wymaga zgody); w razie zatrzymania zmiana crona na codzienny (jedna linia) i nowe żądanie za zgodą. Dane nie giną: instancje żyją 35 dni, więc odczyt co 7 dni nie gubi dni.
- Kod (publiczny `trening`, bez danych i identyfikatorów w logach): `scripts/asc/na-zywo.mjs` (kolejność (a): wersja READY_FOR_SALE → słowa kluczowe, nazwa, podtytuł, dostępność terytoriów; tylko odczyt), `scripts/asc/analityka.mjs` (kolejność (b): raporty Discovery i Downloads Standard → `discovery.csv`, `pobrania.csv`; jedyny zapis `--zapisz-zadanie`), testy `tests/asc-analityka.test.ts` (30). Kolejność (c) (recenzje, sprzedaż, subskrypcje, wydajność) — po przebiegu dowodowym (a) i (b).
- Rozszerzenia po odczycie dokumentacji: segment pobierany bez nagłówka Authorization (adres podpisany przez Apple, inny host); suma `md5` z `AnalyticsReportSegment.Attributes.checksum` weryfikowana; nowsza instancja (późniejszy `processingDate`) zastępuje starszą dla tej samej daty (data-completeness-corrections).
- Decyzje do weta (tryb „analogia”, KO-103…KO-104): KO-103 — raporty tylko wariantu Standard (Source Info i Page Title są tylko w Detailed; do celu wystarczają Territory i Source Type); KO-104 — Unique Counts sumowane po urządzeniach (może zawyżać liczbę unikalnych użytkowników); od 22.11.2026 (recenzja AN, 004) kolumna w CSV nazywa się `unique_counts_suma_urzadzen`.
- **Nie sprawdzone dotąd:** format pliku segmentu (obsługujemy gzip i TSV/CSV po nazwach kolumn), dokładne nazwy raportów (`name`), stany `appInfo` (obsługa „założony”), kształt odpowiedzi `appAvailabilityV2` — to rozstrzygnie przebieg dowodowy.
- Uzupełnienie (22.11.2026, korekta koordynatora: słowa kluczowe, ceny i stan recenzji są dla prywatnego repo): `na-zywo.mjs` zapisuje też `zgloszenia_do_recenzji` (stan, platforma, data wysłania; `GET /v1/apps/{id}/reviewSubmissions`). Ceny: odczytane i istniejące endpointy ceny aplikacji (`GET /v1/appPriceSchedules/{id}/manualPrices` i `…/automaticPrices`, filtr `filter[territory]`; schedule przez `GET /v1/apps/{id}/appPriceSchedule`), ale ceny z docs/48 Z-36 dotyczą subskrypcji — ich endpointów (ceny subskrypcji) nie czytałem; **cena w kodzie dopiero w kroku (c)** po odczytaniu tych stron.
- Poprawki po recenzji niezależnej AN (22.11.2026, `recenzja/asc-analityka`): 001 `SKRYPTY_REF` tylko pełny SHA + walidacja w pierwszym kroku workflowu; 002 maska identyfikatorów w kliencie po segmentach ścieżki (`maskujSciezke`: liczba, myślnik albo hex ≥ 8 → `{id}`; obejmuje `r142-<UUID>`); 003 testy ścieżek błędów (treść odpowiedzi, treść segmentu, identyfikator w logu, jeden POST po błędzie, `readOnlyClient` w `na-zywo`); 004 kolumna `unique_counts_suma_urzadzen`. Mutacje M1, M4, M5, M6, M7 dają teraz czerwone testy.

## 11. Wykonalność (c) recenzje klientów i (d) sprzedaż/subskrypcje (22.11.2026, przed kodem)

Odczyt: developer.apple.com/documentation/appstoreconnectapi/… i …/analytics-reports/… (surowy JSON, 22.11.2026). Prywatność jak w p. 10: dane tylko do prywatnego repo, w logu liczby rekordów i kody.

### (c) Recenzje klientów — wykonalne, bez zapisu, bez nowych sekretów
- `GET /v1/apps/{id}/customerReviews` (filtry `filter[rating]`, `filter[territory]`, stronicowanie `links.next`); atrybuty `CustomerReview.Attributes`: `body`, `createdDate`, `rating`, `reviewerNickname`, `title`, `territory`.
- `GET /v1/apps/{id}/customerReviewSummarizations` (`filter[territory]`, `filter[platform]`); atrybuty: `createdDate`, `locale`, `platform`, `text` — streszczenie recenzji generowane przez Apple (dostępność dla naszej aplikacji i języka — **[DO USTALENIA]** przy pierwszym odczycie).
- Rola: Admin (odczyt; Apple nie podaje roli dla tego zasobu — wynik pierwszego odczytu). Opóźnienie: **[DO USTALENIA]** (strona nie podaje).
- Ograniczenia: API zwraca recenzje z tekstem; ocen bez tekstu i średniej na terytorium tu nie ma (p. 9, poz. 6).
- Dane osobowe: `reviewerNickname` to pseudonim osoby trzeciej — **nie zapisujemy** (rekomendacja); zapis: data, terytorium, ocena, tytuł, treść (prywatne repo). Treść recenzji nie trafia do logu.
- Kod: jeden skrypt `recenzje` w stylu `na-zywo.mjs` (tylko GET), plik `dane/recenzje.csv` scalany po identyfikatorze recenzji (identyfikator zasobu Apple jako klucz scalania, kolumna `id` w prywatnym CSV). Nakład: ok. 1 sesja.

### (d) Sprzedaż i subskrypcje — dwie drogi, rekomendacja: najpierw Analytics Commerce, potem raporty Sales

**Droga 1: raporty Commerce w tym samym żądaniu ONGOING (bez numeru dostawcy, bez nowego zapisu, bez nowych sekretów).** Kategoria `COMMERCE` jest już w naszym żądaniu (to ona zawiera „App Downloads”). Raporty (Standard i Detailed, odczyt stron raportów):
- „App Store Purchases” (`analytics-reports/app-store-purchase`): pola `Purchase Type`, `Content Name`, `Payment Method`, `Source Type`, `Territory`, `Purchases` („Negative value indicates refunds”), `Proceeds in USD`, `Sales in USD`, `Paying Users` („This metric is not summable across rows”); dziennie, kompletność w ciągu ok. 2 dni (tekst skrócony w odczycie, dokładna liczba — **[DO USTALENIA]**).
- „App Store Subscription State” (`…/subscription-state`): `State Metric`, `Subscription Name`, `Subscription Duration`, `Billing Frequency`, `Offer Type`, `Auto-Renew Status`, `Cancellation Reason`, `Territory`, `Counts`; dziennie, kompletność w ciągu 3 dni, historia od 1.01.2025.
- „App Store Subscription Event” (`…/subscription-event`): `Event Date`, `Event Sub Type`, `Event Grouping`, `Subscription Name`, `Plan Change Type`, `Cancellation Reason`, `Territory`, `Counts`.
- Rola/klucz: ta sama co Analytics (Admin; odczyt także Finance, Sales and Reports). Kod: trzy wpisy w `RAPORTY` w `analityka.mjs` (kolumny po nazwach, ta sama maszyneria: segmenty, suma MD5, scalanie po dacie) + osobna agregacja `Paying Users` (nie sumować po wierszach: zapisujemy wiersze bez sumowania tej kolumny albo wcale). Nakład: ok. 0,5 sesji. Uwaga: `Event Date`/`Date` — kolumna daty różni się między raportami (`Event Date` w zdarzeniach); `najnowszePoDacie` i `scal` wymagają parametru nazwy kolumny daty.
- Dane „zaszumione” według Apple (Detailed: szum ±kilka; Standard: do rozstrzygnięcia przy pierwszym odczycie, **[DO USTALENIA]**) — to szacunki do trendów, nie księgowość.

**Droga 2: `GET /v1/salesReports` (liczby bez szumu: jednostki, dochód deweloperski).**
- Parametry obowiązkowe: `filter[reportType]` (np. SALES, SUBSCRIPTION, SUBSCRIPTION_EVENT, SUBSCRIBER), `filter[reportSubType]`, `filter[frequency]`, `filter[version]` i **`filter[vendorNumber]`** („You can find your vendor number in View payments and proceeds.”); odpowiedź `200 application/a-gzip` (gzip), błędy 400/401/403/429. Dozwolone kombinacje: SALES SUMMARY DAILY/WEEKLY/MONTHLY/YEARLY 1_0; SUBSCRIPTION SUMMARY DAILY 1_3; SUBSCRIPTION_EVENT SUMMARY DAILY 1_3; SUBSCRIBER DETAILED DAILY 1_3; PRE_ORDER, WIN_BACK_ELIGIBILITY i inne.
- **Klucz Team:** Apple: „These endpoints require a Team key and aren’t usable with an Individual key.” Nasz klucz powstał w „Users and Access → Integrations → App Store Connect API → +” (`docs/15:339`), a Apple opisuje tę ścieżkę jako **Team Keys** („Select Users and Access … Integrations … Team Keys tab … Generate API Key”; klucz indywidualny powstaje w profilu użytkownika) — czyli nasz klucz jest typu Team (wniosek z opisu ścieżki, potwierdzi pierwszy odczyt).
- **Rola dla Sales:** Apple wymienia „Sales and Reports” jako rolę, która „can also read Download sales and trends reports”; czy Admin ma tu odczyt — tabela ról analityki o Sales nie mówi, **[DO USTALENIA]** (wynik pierwszego wywołania; w razie 403 wystarczy drugi klucz z rolą Sales and Reports — to krok właściciela).
- **Numer dostawcy** (`vendorNumber`): jest w App Store Connect w „Payments and Financial Reports” (strona pomocy Apple jest renderowana skryptem i nie dała się przeczytać surowo — **miejsce w interfejsie [DO USTALENIA]**, właściciel zna je z menu). To identyfikator konta, nie klucz, ale dana konta: trafia do prywatnego repo jako **nowy sekret lub zmienna** `ASC_VENDOR_NUMBER` — **decyzja i krok właściciela** (zasada „bez nowych sekretów”).
- Opóźnienie: Apple Help: „Sales and Trends provides next-day data”; strefa Pacific Time (p. 10, `download-and-view-reports`); godzina publikacji — **[DO USTALENIA]**. Finanse (`/v1/financeReports`): miesięczne, wymagają roli Finance i `vendorNumber` — dla naszych celów (diagnoza ruchu) niepotrzebne.
- Nakład: ok. 1 sesji (gzip, TSV, scalanie po dacie, zapis do `dane/sprzedaz/`).

### Ceny subskrypcji (Z-36) — wykonalne, tylko GET
- Lista: `GET /v1/subscriptionGroups/{id}/subscriptions` (grupa z `SUBSCRIPTION_GROUP_ID`, `scripts/asc/iap-localizations.mjs:18`) → atrybuty `name`, `productId`, `state`, `subscriptionPeriod`.
- Ceny: `GET /v1/subscriptions/{id}/prices?filter[territory]=POL&include=subscriptionPricePoint,territory` — sam `SubscriptionPrice` nie niesie kwoty (atrybuty: `planType`, `preserved`, `startDate`); kwota to `SubscriptionPricePoint.customerPrice` (tekst), `proceeds`, `proceedsYear2` (dołączony przez `include`).
- Dożywotni zakup (IAP): `GET /v2/inAppPurchases/{id}/iapPriceSchedule` (+ `manualPrices`/`automaticPrices` w schedule; atrybuty price pointu: `customerPrice`, `proceeds`); endpoint listy `manualPrices` dla IAP nie został przeczytany — **[DO USTALENIA]** przy kodzie.
- Nakład: 0,5 sesji; weryfikuje wprost Z-36 (4,99 / 19,99 / 59,99 zł).

### Rekomendowana kolejność
1. (c) recenzje (zasila „przyczynę 1”: oceny i recenzje × terytorium od 05.11) — 1 sesja, tylko GET.
2. (d) Droga 1: trzy raporty Commerce w `RAPORTY` — 0,5 sesji, bez decyzji właściciela; ceny subskrypcji równolegle (0,5).
3. (d) Droga 2 (Sales) dopiero, gdy Droga 1 nie wystarczy albo potrzebne liczby bez szumu — wymaga od właściciela numeru dostawcy w prywatnym repo (nowy sekret/zmienna) i ewentualnie klucza Sales and Reports.
Opcje i kompromisy dla właściciela przy kroku 3: (A) tylko Droga 1 — zero kroków właściciela, dane z szumem Apple; (B) Droga 1 + Droga 2 — dokładne jednostki, jedna dana konta w prywatnym repo. Rekomendacja: A teraz, B po zobaczeniu pierwszych danych.
