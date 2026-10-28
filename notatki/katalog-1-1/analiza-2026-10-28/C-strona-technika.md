# C. Strona techniqueatlas — stan techniczny, SEO i opcje (analiza 28.10.2026)

Zakres: repo strony `/home/user/ext/techniqueatlas` (commit `ac8df44`, tylko odczyt), eksport aplikacji z `/home/user/wt/int` (integracja-1-1, HEAD `55ba40c`) i z commitu przypiętego w `PIN.json` (`bd7e62f`). Budowanie robiłem w kopii w scratchpadzie (repo strony bez zmian). Zrzuty ekranu: `/home/user/wt/analiza/zrzuty/`.

Polecenia, na których opieram liczby (kopia strony w `$S/ta`, `$S` = scratchpad sesji):
- `npm run dane -- --app /home/user/wt/int` (w kopii z `PIN.json → commit 55ba40c`, bo `--app` wymaga commitu równego PIN), a potem `node src/build.mjs` i `node src/build.mjs --wszystkie --out dist35`;
- druga kopia na dokładnym PIN: lokalny klon `bd7e62f`, potem `node src/sync-dane.mjs --app <klon>`, `node src/build.mjs` i `node --test tests/build.test.mjs`;
- figury do zrzutów: `node scripts/strona/eksport.mjs --out … --recenzja <tymczasowy plik w scratchpadzie>`. Ten plik oznacza 4 rodziny „ready” jako recenzowane **tylko po to, żeby lokalnie zobaczyć animację**. To nie jest recenzja; nic z tego nie trafiło do żadnego repo;
- Playwright (chromium z `/opt/pw-browsers`) i axe-core: zrzuty, CLS/LCP, test wyszukiwarki, skrypt `$S/skrypty/zrzuty.mjs`;
- symulacja indeksowania: `build({cfg:{indeksowanie:true, jezyki: 35, indeksujJezyki: 35}, pominStraznikowStartu:true})`.

Oznaczenie znalezisk: waga / realność / widoczne w 1.0. Strona nie jest jeszcze opublikowana, więc żadne znalezisko nie jest widoczne w 1.0.

---

## Streszczenie (najważniejsze 15 punktów)

1. **Szkielet działa i jest szybki.** Wszystkie 35 języków buduje się w 29 s: 26 987 stron HTML, 27 036 plików, 342 MB (`du --apparent-size`). Mieści się w limicie Pages (1 GB) i w budżecie specyfikacji (700 MB). Stała część jest gotowa we wszystkich 35 językach (`src/ui/*.json`), ale `config.json` buduje tylko `pl, en`.
2. **WYSOKIE: „undefined” na 17 815 stronach.** Szablon czyta `r.id` (`src/pages.mjs:172`), a eksport aplikacji podaje `{region, text}` (`scripts/strona/eksport.mjs:148`, tak samo na PIN `bd7e62f`). Każde z 509 ćwiczeń z rolami mięśni, w 35 językach, pokazuje „**undefined** — Brings your upper arm…”. Widać to na zrzutach `cwiczenie-*.png`. Test przechodził, bo używał zmyślonych danych z polem `id`.
3. **WYSOKIE: testy strony nie przechodzą.** Na danych z PIN `bd7e62f`: 21 testów przechodzi, 1 nie (test 15 o rolach). Na danych z HEAD integracji: 3 testy nie przechodzą (11, 13, 15). CI strony jest więc prawdopodobnie czerwone [DO USTALENIA: brak dostępu API do repo strony w tej sesji].
4. **WYSOKIE (blokuje start): `pages.yml` nie ma `npm ci`.** `npm test` w workflow publikacji wywoła test dostępności, który wymaga `playwright-core` i `axe-core`, więc pierwsze wdrożenie się nie uda (`.github/workflows/pages.yml`, kroki: dane → test → build).
5. **Figury: dziś na stronę trafia 0 z 709.** Bramka recenzji (`scripts/strona/recenzja-figur.mjs`) wymaga pliku `docs/research/figury-recenzja.json`, którego na integracji nie ma, więc działa zgodnie z zasadą „fail closed”. Po zapisaniu recenzji 4 gotowych rodzin (squat, bench_press, hinge, pull_up) będzie ich 98. S6 wymaga 709 albo wyjątku z powodem (`start-wyjatki.json` jest pusty).
6. **Indeksowanie: 102 strony ćwiczeń na język.** Z regułą D1 (własne wskazówki) w indeksie byłoby 102 z 709 ćwiczeń na język. Indeksowane byłyby za to wszystkie 2 100 stron filtrów (43 rodziny, 11 partii i 6 rodzajów sprzętu na każdy z 35 języków). Strony filtrów prowadzą więc głównie do stron z `noindex`, czyli są cienkie.
7. **Cel „35 języków w wynikach wyszukiwania” jest dziś zablokowany decyzjami.** D3 B indeksuje tylko języki po przeglądzie, a według decyzji z 27.10 native speaker przejrzy tylko pt-BR i tylko raz. Przy obecnych regułach w indeksie będą więc najwyżej 3 języki. To wymaga nowej decyzji właściciela (opcje w §3.4).
8. **Nazwy „EN + lokalna” wymagają nowego pola danych w aplikacji i zmiany D2.** Aplikacja nie ma lokalnych nazw. `exName` w pl pokazuje mieszankę („Bench Press (sztanga)”), a w pozostałych 34 językach nazwę angielską. Strona ma na sztywno `lang="en"` (`src/pages.mjs:39`), a indeks wyszukiwarki zawiera tylko `[nazwa, slug]`. Wynik testu: de „bankdrücken” → 0 trafień, ja „スクワット” → 0, pl „wyciskanie” → 2 trafienia, i to tylko wśród nazw w pełni polskich.
9. **Tytuły i opisy są słabe pod kątem SEO.** Tytuł to `Bench Press (Barbell) — Übungsbibliothek`: marki „Technique Atlas” nie ma nigdzie, bo `siteName` to „Exercise library”. Opis meta to `Bench Press (Barbell): Brust` (ok. 30 znaków). Strony filtrów mają opis równy nagłówkowi H1.
10. **Brakuje danych strukturalnych i znaczników do udostępniania.** Strona ma tylko BreadcrumbList i WebSite, co jest dobrym wyborem (bez HowTo). Nie ma Open Graph, obrazu rastrowego ani ikony strony. Figury są w SVG przez `<use>`, więc nie trafią do wyszukiwania grafiki ani do podglądu linku w komunikatorach.
11. **hreflang jest kompletny, ale ma kilka niespójności.** `/` (x-default) nie wymienia wersji językowych. HTML wskazuje 34 wersje, także te z `noindex`, a mapa witryny tylko indeksowane. Okruszki linkują do `…/index.html`, a canonical ma postać `…/`. Brakuje `lastmod`.
12. **Konwersja do aplikacji jest dziś zerowa.** `appStoreId` jest pusty, więc nie ma banera ani linku. Specyfikacja przewiduje wezwanie ze zdaniem i plakietką w treści ćwiczenia (pkt 3.5 nr 10), ale jest tylko link w stopce. Link kampanii ma tylko `ct=` bez `pt=` [do potwierdzenia: chyba wtedy App Store Connect nie przypisze ruchu]. Aplikacja nie ma `associatedDomains` (`app.json`), więc linki uniwersalne nie działają, a trasa `exercise/[id]` otwiera ćwiczenie użytkownika, nie wpis z biblioteki.
13. **Reklamy są dziś wykluczone na trzy sposoby.** Specyfikacja mówi „Nie ma reklam (decyzja 25.10)” (docs/54 pkt 11). CSP ma `default-src 'self'`. Strażnik `straznik-analityka` blokuje skrypty zewnętrzne, cookies i wywołania sieciowe. Do tego regulamin Pages (R7) dotyczy „online business”. Reklamy to osobna decyzja z kosztem prywatności (baner zgody) i wydajności.
14. **Wydajność i dostępność są dobre.** HTML ćwiczenia ma 6–13 KB, a z kompresją gzip ok. 2,1–2,7 KB. Silnik figury to 13 KB gz w 7 modułach, a dane figury 0,8–3,3 KB gz. Lokalnie, bez dławienia: CLS 0–0,04, LCP ok. 0,1 s. axe (WCAG 2.2 AA) nie znalazł naruszeń na sprawdzonych 13 widokach. Poza stroną nie wychodzi żadne żądanie. Szerokość na telefonie wynosi 390 px, bez przewijania w poziomie.
15. **Domena `techniqueatlas.com` została zarejestrowana dziś (2026-10-28 19:16 UTC, RDAP).** Ma domyślne serwery nazw rejestratora i nie wskazuje jeszcze na Pages; HTTPS nie odpowiada. Do startu brakuje też: DNS i weryfikacji domeny w GitHub, Search Console, `wersjaWydania` i tagu `v1.1…` w PIN (`app.json` na integracji ma wciąż `1.0.0`), zamrożenia slugów, statusów znaków towarowych dla 794 nazw (S3) i sekcji „Progresje” (kalistenika, decyzja z 26.10, w kodzie strony jej nie ma).

**Uwaga o moim błędzie (do docs/40, jeśli koordynator uzna to za istotne).** Przy pierwszej próbie kopiowania (`rsync` nie istnieje, a `cd` się nie udało) polecenie `npm ci` uruchomiło się w `/home/user/trening`, czyli w katalogu roboczym sesji. Skutek: ponowna instalacja `node_modules` z tego samego `package-lock.json` (1314 pakietów). `git status` jest czysty, kod się nie zmienił. Przyczyna: polecenia połączone `;` zamiast `set -e` / `&&`. Zakres jest lokalny. Dalsze polecenia uruchamiałem już z `set -e` albo `&&`.

---

## 1. Stan: co jest gotowe, czego brakuje do startu z pełnym katalogiem w 35 językach

### 1.1 Gotowe (sprawdzone uruchomieniem)

| Element | Dowód |
|---|---|
| Eksport z aplikacji: 35 języków, figury, sylwetka, manifest | `npm run dane` → „eksport: 35 języków … wersja 1.0.0, commit 55ba40c”, 14 s |
| Generator: strona wyboru języka, strona główna, lista A–Z, 3 rodzaje filtrów, ćwiczenie, 404, przekierowania | `src/pages.mjs`; build 35 języków: 26 987 HTML w 29 s |
| Stała część strony we wszystkich 35 językach | `ls src/ui` → 35 plików (README pkt „Otwarte” mówi jeszcze o „33 językach bez słownika”, co jest nieaktualne) |
| hreflang (es-419 → 21 kodów es-XX, sr → sr-Cyrl), canonical, mapy witryny per język, noindex D1/D3, globalny wyłącznik | `src/taksonomia.mjs:102–106`, `src/build.mjs:66–78` |
| Strażnicy S1 (źródła), sekrety, analityka, dane, S3/S4/S6 (ostrzeżenia przy `indeksowanie=false`), S8 (axe) | `tests/*.test.mjs`, `src/straznicy.mjs` |
| Figura v2 w przeglądarce, pozycje statyczne bez JS i przy „Ogranicz ruch”, sylwetka mięśni | zrzuty `cwiczenie-en-telefon-light.png`, `cwiczenie-de-komputer-light.png` |

### 1.2 Brakuje albo nie działa (do startu z 1.1)

| # | Problem | Waga / realność | Dowód |
|---|---|---|---|
| B1 | Role mięśni pokazują `undefined` (rozjazd schematu `id` ↔ `region`) | WYSOKIE / realny | `src/pages.mjs:172` czyta `r.id`; eksport `{region, text}` (`/home/user/wt/int/scripts/strona/eksport.mjs:148`); `grep -rl "<strong>undefined" dist35` → 17 815 stron |
| B2 | Test ról używa zmyślonego schematu (`{id: 'quads'}`), więc nie wykrył B1. Na prawdziwych danych test nie przechodzi | WYSOKIE / realny (fałszywa zieleń) | `tests/build.test.mjs:146–149`; `node --test tests/build.test.mjs` na PIN → „fail 1”, na HEAD integracji → „fail 3” (11, 13, 15) |
| B3 | `pages.yml` bez `npm ci`, więc publikacja padnie na teście dostępności | WYSOKIE / realny (pierwszy przebieg) | `.github/workflows/pages.yml`: `npm run dane`, `npm test`, `npm run build` |
| B4 | 0/709 figur w eksporcie HEAD (brak pliku recenzji). Po recenzji 4 rodzin będzie 98/709. S6 wymaga 709 albo wyjątków z powodem | WYSOKIE (warunek startu) / realny | `node scripts/strona/recenzja-figur.mjs --skroty` → `"ready":[squat,bench_press,hinge,pull_up], "eksportowane":[]`; build: „figury ma 0 z 709” |
| B5 | `config.json`: `jezyki: [pl,en]`, `appStoreId: ""`, `wersjaWydania: ""`, `indeksowanie: false` | — (zgodnie z planem, do przełączenia przy starcie) | `config.json` |
| B6 | PIN wskazuje gałąź `integracja-1-1` i stary commit (o 502 commity za HEAD). `app.json` na integracji ma `version: 1.0.0`, a S4 wymaga tagu `v1.1…` | ŚREDNIE / realny | `git log --oneline bd7e62f..HEAD \| wc -l` → 502; eksport z PIN: „wersja 0.20.0” |
| B7 | `slugs.lock.json` i `trademark-check.json` puste: S3 zgłasza 794 nazwy bez statusu | WYSOKIE przy starcie (S3 przerwie build) / realny | ostrzeżenie builda „794 nazw bez statusu” |
| B8 | Sekcja „Progresje” (kalistenika, właściciel 26.10) nie ma specyfikacji ani kodu w repo strony | ŚREDNIE / realny | `grep -rni progres src docs/54…` → brak; docs/18:626 |
| B9 | Wyjątki „bez przeczytanego źródła techniki → bez animacji” (właściciel 27.10) nie są wpisane do `start-wyjatki.json` | ŚREDNIE / realny | `start-wyjatki.json: {}` |
| B10 | Domena zarejestrowana, ale DNS, weryfikacja w GitHub i Search Console nie są gotowe | WYSOKIE do startu / realny | RDAP: registration 2026-10-28T19:16:57Z; `curl https://techniqueatlas.com` → błąd TLS |
| B11 | Wezwanie do App Store w treści ćwiczenia (zdanie + plakietka, pkt 3.5 nr 10) nie jest zrobione; jest tylko link w stopce | ŚREDNIE / realny | `src/pages.mjs:27` (tylko `<footer>`) |
| B12 | 404 linkuje od korzenia (`/pl/`), więc pod adresem `…github.io/techniqueatlas/` (przed podpięciem domeny) linki 404 nie działają | NISKIE / brzegowy | `src/pages.mjs:61` |

**Nakład do startu (bez figur i bez lokalnych nazw):**
- praca agenta: B1–B3, B6, B9, B11 i B12 to ok. 3–4 h; S3 to ok. 1–2 h przy zmianie reguły (§4.3);
- czekanie: CI i pierwszy przebieg dowodowy Pages, ok. 30 min; propagacja DNS i certyfikat od kilku godzin do doby;
- czas właściciela: DNS i weryfikacja domeny ok. 20 min, Search Console ok. 15 min, App Store ID ok. 5 min.

Figury (S6) to osobny, największy koszt: docs/54 pkt 18 szacuje „ok. 126 h pracy agenta wg docs/51” i dochodzi do tego bramka recenzji 4.

---

## 2. Wygląd stron (zrzuty, Playwright, telefon 390×844 @2x i komputer 1280×900)

Pliki w `/home/user/wt/analiza/zrzuty/`:
- ćwiczenie: `cwiczenie-en-telefon-light.png`, `cwiczenie-en-telefon-dark.png`, `cwiczenie-en-komputer-*.png`, `cwiczenie-de-*.png`;
- strona główna, lista, filtr i wybór języka: `glowna-pl-*`, `lista-en-*`, `filtr-en-*`, `wybor-jezyka-*`.

**Telefon:**
- Treść czytelna, bez przewijania w poziomie (`scrollWidth = 390`).
- Figura: dwa widoki (bok, potem przód) jeden pod drugim zajmują ok. 1,3 ekranu, zanim zacznie się tekst.
- Przyciski „Show common mistake: …” zawierają cały opis błędu (3–4 linie).
- Sylwetka mięśni jest mała.
- Wiersze „**undefined** — …” widać od razu.
- Na górze nie ma logo, nazwy strony ani nawigacji: pierwszym elementem są okruszki „Home › Library › chest”.
- Brak jakiegokolwiek wezwania do aplikacji.
- Strona główna PL zaczyna się od napisu „Strona główna” bez linku (okruszek bieżącej strony), po którym idzie H1 „Biblioteka ćwiczeń”.
- Etykiety partii są małymi literami („klatka”, „barki”), bo pochodzą z aplikacji.

**Komputer:**
- Kolumna 44 rem (ok. 700 px) na środku, reszta ekranu pusta.
- Figury bok i przód stoją obok siebie (dobrze).
- Wygląd jest surowy, jak dokument techniczny: brak marki, ikony i wezwania do aplikacji.
- Stopka z listą 35 języków w jednym akapicie (w buildzie 35 języków).

**Ciemny motyw** działa (figura i sylwetka mają paletę ciemną).

**Ocena:** strona jest użyteczna i lekka, ale pod kątem konwersji i marki prawie pusta. Dla użytkownika z wyszukiwarki pierwsze, co widzi, to okruszki i nazwa angielska.

---

## 3. SEO techniczne

### 3.1 Adresy i slugi

- Struktura: `/{język}/exercises/{slug}/`, `/{język}/muscles|equipment|movements/{id}/`. Segmenty są angielskie (D2b), slug jeden dla wszystkich języków, tworzony z angielskiej nazwy (`makeSlugs`, eksport aplikacji, l. 22–29). Kody języków są pisane małymi literami (`pt-br`, `zh-hant`, `es-419`).
- `slugs.lock.json` jest pusty, `slug-overrides.json` też, co jest zgodne z planem do pierwszej publikacji.
- Ryzyko **NISKIE / brzegowe**: kolizje dostają przyrostek `-2` według kolejności kluczy, więc zmiana kolejności w katalogu przed zamrożeniem zmieni adresy. Lock to naprawia, o ile zostanie zrobiony przed indeksowaniem.
- Przekierowanie to `meta refresh 0` z canonical. Pages nie daje przekierowań 301. Google traktuje natychmiastowy meta refresh jak przekierowanie stałe [do potwierdzenia przez badacza, jak w docs/54 pkt 4].

### 3.2 hreflang, x-default, canonical, mapy witryny

- **Dobre:** każda strona wymienia siebie i wszystkie wersje. Canonical wskazuje stronę samą. Mapy witryny są per język (`sitemap-en.xml`: 164 adresy i 980 KB przy indeksowaniu wszystkich języków, daleko od limitu 50 tys. adresów i 50 MB).
- **Znalezisko H1 (ŚREDNIE / realny):** `/` ma tylko `<link hreflang="x-default">` do siebie, bez listy wersji językowych i bez canonical (`src/pages.mjs:54`). Strona x-default powinna należeć do tego samego zestawu wzajemnych odnośników.
- **Znalezisko H2 (NISKIE / realny):** HTML wymienia 35 wersji także wtedy, gdy 33 z nich mają `noindex` (D3), a mapa witryny wymienia tylko indeksowane (`build.mjs:68`). Odnośniki do stron `noindex` wyszukiwarka pominie. Lepiej, żeby HTML i mapa witryny wymieniały ten sam zbiór.
- **Znalezisko H3 (NISKIE / realny):** okruszki linkują do `../../index.html` (`src/pages.mjs:25`, `c.path` bez `urlOf`), a canonical i reszta linków mają postać `…/`. Powstają dwa adresy tej samej strony w linkach wewnętrznych.
- **Znalezisko H4 (NISKIE):** brak `lastmod` w mapach witryny (specyfikacja go przewiduje). Brak `x-default` w mapie witryny.
- Kody `es-419` → 21 kodów `es-XX` dodają ok. 2 KB na stronę. Jest to poprawne, ale warto przemyśleć wariant prostszy (§8.3).

### 3.3 Dane strukturalne

- Strona ma `BreadcrumbList` (ćwiczenie, lista, filtr) i `WebSite` (strona główna języka). JSON-LD ma poprawną składnię. Nie ma HowTo, FAQ ani VideoObject, co jest dobrą decyzją: wyniki rozszerzone HowTo Google wycofał w 2023, a docs/54 oznacza to jako do potwierdzenia przez badacza.
- **Znalezisko (NISKIE):** na stronie filtra okruszek „Muscle groups” prowadzi do strony głównej, więc BreadcrumbList ma dwa elementy z tym samym adresem (`src/pages.mjs:111`).
- `WebSite.name` = „Exercise library” (ogólne). Google używa `WebSite.name` jako nazwy witryny w wynikach. **ŚREDNIE / realny.**
- Nie dodawać `SearchAction`: pole wyszukiwania w wynikach Google zostało wycofane (2024) [do potwierdzenia przez badacza].
- `ExercisePlan` (schema.org, rozszerzenie medyczne) opisuje plan, nie technikę jednego ćwiczenia. Google nie ma dla niego wyniku rozszerzonego, więc zysk jest żaden, a jest ryzyko nieuczciwego typu.

### 3.4 Indeksowanie i cienka albo zduplikowana treść (ok. 25 tys. stron)

Symulacja z `indeksowanie: true` we wszystkich językach (`$S/skrypty/idx.mjs`):

| Rodzaj strony | Wszystkie | Indeksowane |
|---|---|---|
| ćwiczenie | 24 815 | 3 570 (102 na język) |
| rodzina ruchu | 1 505 | 1 505 |
| partia | 385 | 385 |
| sprzęt | 210 | 210 |
| strona główna, lista | 70 | 70 |

- Wskazówki w eksporcie en: `own` 102, `general` 538, `none` 69. Jest tylko 270 różnych zestawów tekstu na 709 ćwiczeń. Największe grupy identycznej treści liczą 69 (brak), 34, 22 i 20 ćwiczeń.
- **D1 dobrze chroni przed oceną jako treść masowa.** Skutek uboczny (**ŚREDNIE / realny**): 2 100 stron filtrów jest indeksowanych, mimo że mają tylko listę nazw (rodzina „squat”: 14,5 KB HTML, bez żadnego zdania własnego), a większość linków z nich prowadzi do stron z `noindex`. Strony „other” („Exercises: other”) nie mają wartości.
- **Między językami** treść główna jest przetłumaczona, więc nie jest duplikatem w rozumieniu Google („only considered duplicates if the main content … remains untranslated”, cytat w docs/54 pkt 5). Nazwa ćwiczenia (H1, tytuł) jest jednak w 34 językach angielska. To słabe dopasowanie do lokalnych zapytań, a nie problem duplikatu.
- **Języki:** przy decyzjach D3 B i „przegląd native speakera tylko pt-BR” (docs/18:635) w indeksie będą najwyżej pl, en i pt-BR. Cel właściciela „pełny katalog w 35 językach w wyszukiwarce” wymaga nowej decyzji (§8.4).

### 3.5 Core Web Vitals i rozmiar

| Zasób | Bez kompresji | gzip -9 |
|---|---|---|
| HTML ćwiczenia (bench press, en, z figurą) | 6,1 KB | 2,1 KB |
| HTML ćwiczenia (bez figury, 35 hreflang) | 13,1 KB | 2,7 KB |
| `assets/poz/<slug>.svg` (pozycje statyczne) | 30,6 KB | 5,5 KB |
| `assets/fig/<slug>.js` (dane animacji) | do 27,6 KB | 0,8–3,3 KB |
| silnik figury (7 modułów) | 35 KB | ok. 13 KB |
| `idx/en.js` (indeks wyszukiwarki) | 33 KB | 8,9 KB |
| lista A–Z (`en/exercises/`) | 149 KB | 16,8 KB |
| strona główna języka | 35,6 KB | 6,6 KB |

- 500 stron przekracza 20 KB HTML (strony główne, listy, filtry). Budżet 20 KB dotyczy stron ćwiczeń i ten jest spełniony.
- Pomiar lokalny w Chromium bez dławienia: CLS 0 na telefonie, 0,019–0,041 na komputerze (zamiana pozycji statycznych na animowane widoki, lista). LCP 60–120 ms. Strona ćwiczenia wysyła 14 żądań, w tym łańcuch modułów: `figura-strona.js` → `silnik/figura.js` → `draw.js` i pozostałe.
- **Ocena:** dobrze; ryzyko CWV jest niskie. Rzeczywiste wartości na telefonie w sieci komórkowej [DO USTALENIA po starcie, raport CWV w Search Console].
- Drobna poprawa (**NISKIE**): jeden plik silnika zamiast 7 modułów skraca łańcuch żądań; stałe wymiary kontenera figury dają CLS równe 0.

### 3.6 Dostępność

- axe-core (tagi WCAG 2.0/2.1/2.2 A/AA): 0 naruszeń na 13 sprawdzonych widokach (ćwiczenie en i de, strona główna pl, lista, filtr, wybór języka; telefon i komputer).
- „Pomiń do treści”, `aria-pressed` na przyciskach, `lang` na nazwach i pozycje przy „Ogranicz ruch” są zrobione.
- **NISKIE / realny:** w pl nazwy mieszane („Bench Press (sztanga)”) nie mają `lang`, więc VoiceOver czyta „Bench Press” po polsku. Po wprowadzeniu nazw „EN + lokalna” trzeba oznaczać `lang` dla każdej części osobno (§4).
- **NISKIE:** komunikat pustego wyniku wyszukiwania brzmi „No exercises match these filters”, choć użytkownik nie używał filtrów (`src/pages.mjs:78` używa `ui.noResults`).

---

## 4. Gotowość na nazwy „EN + lokalna” w 35 językach

### 4.1 Stan dzisiejszy

- **Źródło nazwy:** `exName` aplikacji (`/home/user/wt/int/lib/i18n.ts:138–144`). W pl to nazwa z katalogu (głównie angielska z polskim nawiasem, np. „Bench Press (sztanga)”, a kilka w pełni polskich, np. „Wyciskanie nad głowę (linki)”). W pozostałych 34 językach to nazwa angielska. Aplikacja nie ma pola z nazwą lokalną (`grep localName|nameLocal|aliases lib` nic nie zwraca).
- **Strona:**
  - H1, tytuł, okruszki, zamienniki i lista mają jedną nazwę `ex.name`;
  - `nameAttr` ustawia `lang="en"` na sztywno dla każdego języka poza pl (`src/pages.mjs:39`, także `:189`, `assets/szukaj.js:28`);
  - sortowanie listy działa collatorem języka, ale po nazwie angielskiej.
- **Wyszukiwarka** (`assets/szukaj.js`): indeks to `[nazwa, slug]` jednego języka. Porównanie przez `fold` usuwa znaki diakrytyczne i robi małe litery, a dopasowanie działa jak `includes`, z preferencją dla początku napisu. Wynik testu w przeglądarce:

| Język | Zapytanie | Wynik |
|---|---|---|
| en | „bench” | Bench Jump, Bench Press (Barbell)… ✔ |
| pl | „bench” | ✔ |
| pl | „wyciskanie” | tylko 2 nazwy w pełni polskie ✘ |
| de | „bankdrücken” | 0 ✘ |
| ja | „スクワット” | 0 ✘ |
| de | „squat” | „Squat Jerk, Squat with Bands…” przed „Back Squat”: ranking bez dopasowania początku słowa |

- **Pliki indeksu:** `idx/ja.js` i `idx/en.js` są identyczne (33 270 B), czyli 34 kopie tego samego pliku.

### 4.2 Co trzeba zmienić (niezależnie od wybranej opcji)

1. **Aplikacja:** nowe dane, czyli nazwa lokalna na język, pole `aliases` (lokalne i zwyczajowe) oraz przegląd tłumacza i recenzenta. To zmiana D2 (właściciel) i decyzja, czy aplikacja też je pokazuje (zasada „karty zgodne z aplikacją”).
2. **Eksport:** `nameEn`, `nameLocal`, `aliases[]` per ćwiczenie i język.
3. **Strona:**
   - H1 „Nazwa lokalna” z dopiskiem `<span lang="en">Bench Press (Barbell)</span>`;
   - tytuł „Bankdrücken mit Langhantel (Bench Press) — Technique Atlas”;
   - `lang` osobno dla każdej części;
   - sortowanie po nazwie lokalnej;
   - indeks wyszukiwarki `[slug, nazwaLokalna, nazwaEn, ...aliasy]`;
   - `fold` dla kana (katakana ↔ hiragana) i ranking po początku słowa.
   - Budżet indeksu ≤ 25 KB gz: dziś 8,9 KB gz, po dodaniu drugiej nazwy szacunkowo ok. 15–18 KB gz [DO USTALENIA pomiarem].
4. **S3 (znaki towarowe):** dziś każda widoczna nazwa potrzebuje wpisu „sprawdzone” z datą. Przy nazwach lokalnych to ok. 709 × 35 wpisów, nie do utrzymania ręcznie. Trzeba zmienić regułę, np. sprawdzać nazwę angielską bazową i lokalne słowa spoza listy terminów ogólnych.
5. **Slugi** bez zmian, jeśli zostają angielskie (§8.3).

---

## 5. Ograniczenia architektury: reklamy i konwersja do aplikacji

### 5.1 Reklamy

Co blokuje dziś:
- decyzja: docs/54 pkt 11 „Nie ma reklam (decyzja 25.10)”, D4 A „bez analityki”;
- technika: CSP `default-src 'self'; img-src 'self' data:` w `<meta>` (`src/pages.mjs:17`), więc skrypty, ramki i obrazy sieci reklamowej się nie załadują;
- strażnik `tests/straznik-analityka.test.mjs:10–23` przerywa build przy każdym zewnętrznym skrypcie, `document.cookie`, `localStorage`, `fetch` i podobnych;
- hosting: R7, czyli regulamin Pages wobec „online business”; reklamy wzmacniają to ryzyko;
- prawo i prywatność: reklamy personalizowane w EOG i Wielkiej Brytanii wymagają platformy zgody (baner) i zmiany polityki prywatności `apps4brew.com` (D12). Reklamy niepersonalizowane też zwykle używają pamięci przeglądarki [DO USTALENIA: badacz albo prawnik];
- jakość: sieci reklamowe oceniają witrynę. Strony z `noindex` i strony filtrów bez własnego tekstu to słaba podstawa. Reklamy pogarszają CWV i odciągają od celu „ściągnąć do aplikacji”.

### 5.2 Konwersja do aplikacji

| Element | Stan | Dowód |
|---|---|---|
| Smart App Banner | gotowy w kodzie, wyłączony (`appStoreId` pusty) | `src/pages.mjs:21`, test `build.test.mjs:187` |
| Link do App Store | tylko w stopce, tekst bez plakietki, parametr `ct=` bez `pt=`. Link kampanii App Store Connect wymaga tokenu dostawcy `pt` [do potwierdzenia przez badacza] | `src/pages.mjs:27` |
| Wezwanie w treści ćwiczenia (zdanie z listy funkcji wydania + plakietka) | brak | docs/54 pkt 3.5 nr 10 |
| Komputer → telefon (kod QR) | brak | — |
| Linki uniwersalne | brak: `app.json` ma `scheme: "trening"`, nie ma `associatedDomains`; strona nie ma `/.well-known/apple-app-site-association` | `/home/user/wt/int/app.json:6` |
| Głęboki link do karty ćwiczenia | trasa `app/exercise/[id].tsx` czyta ćwiczenie użytkownika (`exById(id)`); nie wiadomo, czy klucz biblioteki trafi w istniejące ćwiczenie [DO USTALENIA, programista] | `app/exercise/[id].tsx:28–33` |

---

## 6. Znaleziska zbiorczo (do backlogu albo napraw przed startem)

| ID | Znalezisko | Waga | Realność | 1.0 |
|---|---|---|---|---|
| C-01 | `undefined` w rolach mięśni (17 815 stron) | WYSOKIE (błędna treść publicznie) | realny | nie |
| C-02 | Test ról na zmyślonym schemacie (fałszywa zieleń); testy czerwone na prawdziwych danych | WYSOKIE | realny | nie |
| C-03 | `pages.yml` bez `npm ci` | WYSOKIE (start się nie uda) | realny | nie |
| C-04 | 0 figur w eksporcie HEAD (brak zapisu recenzji); S6 | WYSOKIE (warunek startu) | realny | nie |
| C-05 | Indeksowane strony filtrów bez własnej treści, prowadzące głównie do `noindex` | ŚREDNIE | realny | nie |
| C-06 | Brak marki w tytule i w `WebSite.name` („Exercise library”) | ŚREDNIE | realny | nie |
| C-07 | Opis meta ok. 30 znaków; opis filtra = H1 | ŚREDNIE | realny | nie |
| C-08 | `/` bez listy hreflang i canonical | ŚREDNIE | realny | nie |
| C-09 | Brak wezwania do aplikacji w treści; link bez `pt` | ŚREDNIE | realny | nie |
| C-10 | Nazwy wyłącznie angielskie poza pl, wyszukiwarka nie znajduje nazw lokalnych | ŚREDNIE (cel właściciela) | realny | nie |
| C-11 | Brak Open Graph, obrazu rastrowego i ikony strony | ŚREDNIE | realny | nie |
| C-12 | hreflang w HTML do stron z `noindex`; okruszki `index.html`; brak `lastmod` | NISKIE | realny | nie |
| C-13 | Komunikat „filtry” przy pustym wyszukiwaniu; ranking bez początku słowa | NISKIE | realny | nie |
| C-14 | 404 z linkami od korzenia (adres projektu Pages) | NISKIE | brzegowy | nie |
| C-15 | README „Otwarte” nieaktualne (33 języki bez słownika) | NISKIE | — | nie |
| C-16 | Brak sekcji „Progresje” i wyjątków S6 z decyzji 26–27.10 | ŚREDNIE | realny | nie |
| C-17 | Nota „Ogólne wskazówki dla tego ruchu” stoi nad sylwetką, daleko od sekcji „Wskazówki” | NISKIE | realny | nie |

Pytania dla trwającego audytu „wszystkich ćwiczeń i grafik”:
- Które rodziny dostaną wpis w `figury-recenzja.json` przed startem? To decyduje o liczbie stron z figurą na starcie.
- Które ćwiczenia idą do `start-wyjatki.json` (bez przeczytanego źródła techniki)?
- Czy teksty ról mięśni (509 ćwiczeń, publicznie na stronie) przeszły recenzję treści?

---

## 7. Koszty bazowe (do porównań)

Ceny poniżej to wiedza ogólna, nie przeczytany cennik: [DO USTALENIA przez badacza przed decyzją].
- GitHub Pages, Actions (repo publiczne) i Search Console: 0 zł.
- Domena: już kupiona (cena znana właścicielowi).
- CDN z darmowym planem: 0 zł.
- Analityka bez cookies jako usługa: płatny abonament.
- Platforma zgody na reklamy: często darmowa w podstawowym planie.

---

## 8. Opcje (≥ 2 na obszar, z kosztem i rekomendacją)

Czas właściciela podaję osobno. „Agent” to szacowany czas pracy agenta.

### 8.1 Hosting i domena

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. GitHub Pages + domena (stan planowany)** | 0 zł, gotowy workflow; 342 MB i 27 tys. plików mieszczą się w limicie | brak własnych nagłówków (CSP tylko w `<meta>`, brak 301, brak cache-control), ryzyko regulaminu R7 przy reklamach. Agent: 1 h (C-03, CNAME). Właściciel: DNS i weryfikacja domeny ok. 20 min |
| **B. Pages + CDN z darmowym planem przed domeną (proxy DNS)** | prawdziwe przekierowania 301 dla zmienionych slugów, nagłówki (CSP, cache), statystyki ruchu po stronie serwera bez skryptu (§8.9), ochrona przed nadmiernym ruchem | trzecia firma w ścieżce: logi IP u niej, zmiana informacji o prywatności. Agent: 2–3 h. Właściciel: konto i przeniesienie DNS ok. 30 min |
| **C. Inny darmowy hosting statyczny z nagłówkami i przekierowaniami** | 301, nagłówki, regulamin zwykle dopuszcza komercję | limity liczby plików na wdrożenie: znany mi darmowy plan jednego z dostawców ma limit ok. 20 tys. plików, a my mamy 27 036 [do potwierdzenia w cenniku]; nowy workflow i sekret wdrożeniowy (wbrew „bez nowych sekretów”). Agent: 3–4 h |

**Rekomendacja: A na start.** B dopiero wtedy, gdy będą potrzebne 301 albo statystyki, albo przy decyzji o reklamach. C tylko wtedy, gdy badacz potwierdzi, że R7 wyklucza Pages.

### 8.2 Generator

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Zostaje własny skrypt Node** | 29 s na 35 języków, zero zależności uruchomieniowych, strażnicy są już napisani | każdy nowy typ strony (huby, „Progresje”, kreator) dopisujemy ręcznie |
| **B. Gotowy generator statyczny** | szablony, i18n, wtyczki SEO | łańcuch dostaw (repo publiczne, strażnik analityki), przepisanie testów. Agent: 1–2 dni, zysk funkcjonalny żaden |

**Rekomendacja: A.** Warto rozdzielić `src/pages.mjs` (dziś 204 linie bardzo gęstego kodu) na moduły per typ strony przed dodaniem hubów. Agent: 2 h.

### 8.3 Struktura URL

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Zostaje `/{język}/exercises/{slug-en}/` (D2b)** | prosty hreflang, jeden lock, brak transliteracji | w adresie brak lokalnego słowa (słaby czynnik rankingowy; tytuł i H1 ważą więcej) |
| **B. Lokalne segmenty i slugi (`/de/uebungen/bankdruecken-langhantel/`)** | lepsze dopasowanie adresu i lepszy CTR w językach łacińskich | 709 × 34 slugów do tłumaczenia i zamrożenia, kolizje, problem cyrylicy i CJK (kodowanie procentowe albo transliteracja), lock per język. Agent: 1–2 dni + tłumacz. Ryzyko błędów przy zmianie nazwy |
| **C. Hybryda: segmenty angielskie, slug lokalny tylko dla języków łacińskich** | część zysku B | niespójność; testy dla dwóch reżimów |

**Rekomendacja: A.** Zysk z lokalnej nazwy uzyskujemy w tytule, H1 i opisie (§4). Drobna poprawka przy okazji: okruszki na adresy `…/` (C-12).

Dodatkowo es-419:
- **A1.** Zostaje 21 kodów `es-XX` (pełne pokrycie, ok. 2 KB na stronę).
- **A2.** Jeden język `es` bez osobnego es-419 (prościej, ale Ameryka Łacińska dostaje hiszpański europejski).

**Rekomendacja: A1.**

### 8.4 Indeksowanie języków (blokada celu „35 języków”)

| Opcja | Zysk | Koszt / ryzyko |
|---|---|---|
| **A. Zostaje D3 B (tylko języki po przeglądzie native speakera)** | najmniejsze ryzyko oceny „automatyczne tłumaczenie o niskiej wartości” | w praktyce pl, en i pt-BR na stałe, bo przegląd ma być tylko jeden |
| **B. Indeksować język po automatycznej bramce jakości** (recenzent lokalizacji + słownik terminów + strażnik terminów + tłumaczenie zwrotne próbki) | zasięg 35 języków bez native speakerów | ryzyko polityki „scaled content” i błędów merytorycznych w treści o technice. Agent: ok. 2–4 h na język na recenzję próbki |
| **C. Wdrażanie partiami z pomiarem** (np. 5 języków o największym rynku; następna partia, gdy Search Console nie pokazuje masowego „Crawled – not indexed” ani problemów jakości) | kontrola ryzyka, nauka na danych | wolniej (tygodnie na partię). Właściciel: wybór kolejności języków |

**Rekomendacja: C**, z bramką z B dla każdej partii. Kolejność rynków: decyzja produktowa właściciela.

### 8.5 Dane strukturalne i znaczniki udostępniania

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Minimalne poprawki: marka w `WebSite.name` i w tytule, `Organization` z logo, poprawione okruszki filtrów, lista hreflang i canonical na `/`** | poprawna nazwa witryny w wynikach, spójność | Agent: 2 h; właściciel: zatwierdzenie nazwy marki w tytule (np. „Technique Atlas”) |
| **B. A + Open Graph i obraz rastrowy per ćwiczenie** (pozycja skrajna figury jako PNG albo WebP, wspólny dla języków, generowany przy buildzie) | podgląd linków w komunikatorach, ruch z wyszukiwania grafiki | rasteryzacja w CI (Chrome z testów albo nowa zależność deweloperska); ok. 709 × ok. 20 KB ≈ 14 MB [szacunek]. Agent: 4–6 h |
| **C. Typy „bogate”** (ExercisePlan, HowTo) | brak wyniku rozszerzonego | ryzyko nieuczciwego typu |

**Rekomendacja: A teraz, B przed startem indeksowania, C odrzucić.**

### 8.6 Strony kategorii, mięśni i sprzętu (huby SEO)

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Huby jak dziś, ale `noindex`, dopóki nie mają N indeksowanych ćwiczeń albo własnego wstępu** | usuwa cienkie strony z indeksu (C-05) | mniej stron w indeksie na start. Agent: 1 h + test. Wartość N to decyzja właściciela |
| **B. Huby wzbogacone:** krótki własny wstęp (1–2 zdania na hub, przetłumaczony i przejrzany), miniatury pozycji statycznych, grupowanie „główne / pomocnicze”, bez „other” | strony odpowiadają na zapytania typu „ćwiczenia na klatkę” | ok. 60 hubów × 35 języków tekstów (tłumacz i recenzent); twierdzenia merytoryczne we wstępach podlegają rejestrowi twierdzeń. Agent: 1–2 dni |
| **C. Huby według 19 regionów mięśni zamiast 11 partii** (dane `regions` już są w eksporcie: quads, hamstrings, front_delt…) | trafia w częste zapytania („ćwiczenia na dwugłowe uda”) | nowy typ strony, etykiety regionów już są w aplikacji (`labels.regions`). Agent: 4–6 h |

**Rekomendacja: A od razu, potem C + B.** Bez stron kombinacji filtrów (zakaz z docs/54).

### 8.7 Wyszukiwarka na stronie

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Indeks `[slug, nazwa lokalna, nazwa EN, aliasy]` per język, `fold` z kana, ranking po początku słowa, poprawny komunikat pustego wyniku** | znajduje po angielsku i lokalnie, nadal bez sieci | zależy od danych z §4.2. Agent: 3–4 h. Budżet indeksu do zmierzenia |
| **B. Jeden wspólny indeks wszystkich języków** | szukanie w dowolnym języku z każdej strony | ok. 35 razy większy plik (przekroczy 25 KB gz) |
| **C. Bez zmian** | 0 h | nie spełnia celu „EN + lokalna” |

**Rekomendacja: A.** Przy okazji: pliki identyczne między językami mogą wskazywać jeden plik (mniej plików).

### 8.8 Wydajność

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Bez zmian** | już dobrze (§3.5) | — |
| **B. Jeden plik silnika zamiast 7 modułów, stała wysokość kontenera figury, przyciski błędów z krótką etykietą (pełny opis pod spodem)** | mniej żądań, CLS równe 0, czytelniejszy telefon | Agent: 2–3 h; zmiana silnika musi zachować „zero rozjazdu” z aplikacją (test w aplikacji) |

**Rekomendacja: B przy okazji prac nad wyglądem**, bez pośpiechu.

### 8.9 Analityka bez cookies

| Opcja | Zysk | Koszt / prywatność |
|---|---|---|
| **A. Bez analityki (D4 A) + Search Console + link kampanii App Store (`pt` + `ct`)** | 0 zł, zero danych osobowych, strażnik bez zmian | brak wiedzy o zachowaniu na stronie. Właściciel: weryfikacja domeny w Search Console ok. 15 min |
| **B. Statystyki po stronie serwera z CDN (§8.1 B)** | liczba odsłon i kraje bez skryptu i bez cookies | trzecia firma widzi IP (jak hosting); zmiana informacji o prywatności. Agent: 1 h |
| **C. Własny licznik bez danych osobowych** (endpoint na darmowym planie funkcji brzegowych, licznik per adres i dzień, bez IP i identyfikatorów) | pełna kontrola, dane tylko zagregowane | wyjątek w CSP (`connect-src` na własną subdomenę), zmiana strażnika analityki, utrzymanie endpointu, sekret wdrożeniowy (wbrew zasadzie). Agent: 4–6 h |
| **D. Usługa analityki bez cookies** | gotowe panele | abonament, zewnętrzny skrypt, wyjątek w CSP i strażniku, zmiana polityki |

**Rekomendacja: A na start** (decyzja D4 nadal obowiązuje). Po kilku tygodniach danych z Search Console ewentualnie B. C i D tylko przy realnej potrzebie, której A i B nie pokryją.

### 8.10 Gotowość reklam

| Opcja | Zysk | Koszt / ryzyko |
|---|---|---|
| **A. Bez reklam (stan decyzji 25.10); strona służy pozyskaniu użytkowników aplikacji** | czystość, CWV, brak banera zgody, zgodność z obecnymi strażnikami | brak przychodu ze strony |
| **B. Przygotować architekturę teraz, włączyć reklamy dopiero po progu ruchu** (próg według Search Console, wartość ustala właściciel): konfigurowalny wyjątek CSP, miejsce na reklamę z zarezerwowaną wysokością (bez CLS), szablon `ads.txt`, strażnik w wersji „tylko z flagą i tylko na stronach indeksowanych” | szybkie włączenie, gdy będzie ruch | Agent: 4–6 h teraz plus platforma zgody i polityka przy włączeniu. Wymaga decyzji o hostingu (R7) |
| **C. Reklamy od startu** | przychód od pierwszego dnia | przy obecnej skali (102 indeksowane strony ćwiczeń na język) przychód niewielki [DO USTALENIA: brak danych o ruchu], a koszt prywatności, CWV i konwersji do aplikacji jest pewny |

**Rekomendacja: A teraz.** Do B wracamy, gdy Search Console pokaże stały ruch; próg to decyzja właściciela. Najpierw konwersja do aplikacji (§8.11), bo to główny cel strony według docs/54 pkt 1.

### 8.11 Konwersja do aplikacji (dodatkowy obszar, mocno związany z celem)

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Minimum:** `appStoreId`, Smart App Banner, wezwanie w treści (zdanie z listy funkcji wydania + oficjalna plakietka, pkt 3.5 nr 10), link z `pt` i `ct` per język, kod QR (statyczny SVG) dla komputera | mierzalne wejścia do App Store | Agent: 3–4 h; badacz: zasady plakietki i format linku kampanii. Właściciel: App Store ID i token dostawcy ok. 10 min |
| **B. A + linki uniwersalne i otwarcie karty ćwiczenia w aplikacji** (`associatedDomains`, plik `apple-app-site-association` na stronie, obsługa trasy biblioteki w aplikacji, `app-argument` w banerze) | użytkownik z aplikacją ląduje od razu na karcie | wydanie aplikacji (nowe uprawnienie i test na telefonie), praca w aplikacji. Agent: 1–1,5 dnia + E2E. Decyzja D8 do zmiany |

**Rekomendacja: A do startu z 1.1, B w kolejnym wydaniu aplikacji** (razem z „Otwórz w aplikacji” kreatora planów z decyzji 26.10, bo ta sama infrastruktura linków).

### 8.12 Nazwy „EN + lokalna” (decyzja D2 do ponownego otwarcia)

| Opcja | Zysk | Koszt |
|---|---|---|
| **A. Zostaje D2 A (tylko EN, w pl katalogowa)** | 0 h, zgodność z aplikacją | słabe dopasowanie do lokalnych zapytań (R4), cel właściciela niespełniony |
| **B. Nazwa lokalna + angielska na stronie i w aplikacji** (nowe pole danych, tłumacz, recenzent, nowa reguła S3) | spełnia cel; spójność aplikacji i strony | ok. 709 × 34 nazw do tłumaczenia i recenzji (tłumacz przez API + recenzent: kilka dni agenta), zmiana UI aplikacji (wyszukiwanie, VoiceOver), testy macierzy. Agent: 2–4 dni |
| **C. Nazwa lokalna tylko na stronie (aplikacja bez zmian)** | szybciej | rozjazd z aplikacją (karta na stronie ≠ karta w aplikacji), wbrew celowi „zgodne z aplikacją” |

**Rekomendacja: B, etapami według partii języków z §8.4 C.** Nazwy lokalne są gotowe przed indeksowaniem danego języka. Slugi zostają angielskie (§8.3 A).

---

## 9. Proponowana kolejność (do akceptacji właściciela)

1. **Naprawy przed czymkolwiek** (agent ok. 3–4 h): C-01, C-02 (test na prawdziwym eksporcie zamiast zmyślonego schematu), C-03, C-14, C-15. Każdy błąd dostaje test odtwarzający.
2. **Start 1.1** (agent ok. 1 dzień poza figurami):
   - DNS i domena;
   - `appStoreId` i wezwanie (§8.11 A);
   - marka i tytuły (§8.5 A);
   - huby `noindex` (§8.6 A);
   - lock slugów, reguła S3;
   - `wersjaWydania` i tag w PIN;
   - figury według zapisu recenzji i wyjątków S6.
3. **Po starcie:** decyzje D2 (nazwy, §8.12) i D3 (partie języków, §8.4), potem huby po regionach (§8.6 C), Open Graph i obraz rastrowy (§8.5 B), wyszukiwarka (§8.7 A).
4. **Reklamy:** decyzja po danych z Search Console (§8.10).

Na co się czeka:
- figury 709 i recenzja (największy koszt; docs/54 pkt 18: ok. 126 h według docs/51);
- wydanie 1.1;
- DNS i certyfikat;
- indeksowanie przez wyszukiwarkę (tygodnie).
