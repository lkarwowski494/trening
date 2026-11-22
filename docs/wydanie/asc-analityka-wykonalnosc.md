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
