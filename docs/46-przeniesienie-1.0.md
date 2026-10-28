# 46. Przeniesienie czystej wersji 1.0 do Apps4Brew — lista kontrolna i narzędzie (21.10.2026)

Dokument przygotowawczy (decyzja właściciela 21.10.2026). **Przeniesienia nie wykonano** — jest lista, narzędzie podglądu i pytania do właściciela.

## 1. Cel i zasady

- Nowe, **publiczne** repo w organizacji **Apps4Brew** (plan Free, 0 zł): **jeden początkowy commit**, bez historii obecnego repo `lkarwowski494/trening`.
- Zasada ogólna (właściciel, 28.10.2026): każdy projekt studia rozwijamy na prywatnym koncie GitHub właściciela do pierwszego wydania na produkcji (aplikacja w App Store albo publikacja strony); do organizacji Apps4Brew przenosimy dopiero po nim — Trening po wydaniu 1.0 w App Store (zgodne z D7 A), wpis w docs/18 z 28.10.2026.
- Trafiają tam tylko wydania dostępne w App Store (zasada właściciela 21.10.2026: „Tam będą lądowały tylko wydania dostępne w Apple Store”). Obecne repo zostaje jako **prywatne archiwum** (nie usuwać; docs/18, 12.10.2026).
- Nazwy innych firm i aplikacji usuwamy przy przenosinach (CLAUDE.md „Treści cudze i nazwy innych firm”). Rozwiązuje też S1 z audytu 0.10 (dane osobowe w dawnej historii i refach PR).
- Niczego nie wypychamy, dopóki **rejestr ryzyk w `docs/40` nie ma otwartych pozycji** (zasada L-001) i nie zapadły decyzje D1–D7 niżej.
- Narzędzie: `node scripts/przeniesienie-1.0.mjs` (**tylko podgląd**). Z `git archive` bieżącego HEAD buduje drzewo w katalogu tymczasowym, stosuje `scripts/przeniesienie-1.0.json`, uruchamia strażnika nazw (`tests/forbidden-names.json`) i wypisuje raport. Nic nie wypycha, nic nie tworzy na GitHubie. Przełączniki: `--decyzje=usun` (wariant: wszystko, co nieustalone, znika), `--zachowaj` (zostawia drzewo i katalog `na-dysk/` do obejrzenia), `--testy` (Jest w zbudowanym drzewie — ostateczny dowód, które testy padają; ok. 10 min). Test logiki: `tests/przeniesienie-1.0.test.ts`.

## 2. Decyzje do podjęcia przez właściciela (przed przeniesieniem)

Każda z co najmniej dwiema opcjami i rekomendacją; pozycje listy oznaczone „decyzja” mają numer D1–D7 w powodzie.

**D1 — dokumenty strategiczne** (`monetyzacja.md`, `wzrost.md`, `39`, `41`, `42`).
- A (rekomendacja): `wzrost.md`, `41`, `42` na Dysk (plan, kanały, droga do sklepu, „zły build” to praca studia, nie produkt); `monetyzacja.md` i `39` zostają — `monetyzacja.md` czytają testy cen (`audit-m1-045`) i jest zgodna z publicznym sklepem, `39` jest generowana z kodu (`scripts/flows-catalog.mjs`) i jest listą dla telefonu.
- B: wszystkie pięć na Dysk; wymaga zmiany testów cen i generatora listy kontrolnej (więcej pracy, ceny tracą jedno źródło w repo).
- C: wszystkie zostają (publicznie plan wydania i kanały wzrostu); najmniej pracy, ale repo pokazuje strategię studia.

**D2 — dokumenty robocze, które CLAUDE.md każe prowadzić** (`18-przekazanie.md`, `40-lekcje.md`).
- A (rekomendacja): nowe repo dostaje **świeże, krótkie** `docs/18` (decyzje obowiązujące po 1.0, z datą) i `docs/40` (lekcje i rejestr ryzyk od 1.0); stare na Dysk i w archiwum. Zmiana testów, które je czytają (lista w pkt 6).
- B: kopiujemy oba bez zmian — historia pracy (nazwy, daty, uwagi o koncie) publicznie; testy bez zmian.
- C: oba w prywatnym repo `studio`, w nowym repo tylko odwołanie; CLAUDE.md i testy zmieniają zasadę „zapisz w docs/18 i docs/40”.

**D3 — `.claude/agents/` i `CLAUDE.md`.**
- A: zostają bez zmian (jawny proces; zawiera odwołania do Dysku, kont i usuwanych dokumentów).
- B (rekomendacja): zostają po przeglądzie — usunąć odwołania do dokumentów, które nie przechodzą, i do Dysku, skrócić daty decyzji; testy czytające CLAUDE.md (`audit-m1-044-brd`, `audit-m1-048`, `public-repo`, `verify-docs`) zostają zielone, jeśli zachowamy sekcje, które sprawdzają.
- C: usunąć z repo (trzymać w prywatnym `studio`); agent w nowym repo nie ma wtedy zasad i testy czytające CLAUDE.md trzeba zmienić.

**D4 — `docs/research/`.** Zostaje to, co daje pochodzenie liczb i tekstów w aplikacji: rejestr twierdzeń, BRD, katalog sprzętu, biblioteka (`25-biblioteka`), wskazówki (`27`, `31`, `33`, których numery cytuje `lib/cues/data.json`), `24`, `22`–`23`, `26`, `28`–`30`, `32`, `34`–`36`, `masa-ciala`, `zakresy`. Na Dysk: raporty rynkowe, skargi, standardy promptów, przegląd badacza.
- A (rekomendacja): pozycje „decyzja” w `docs/research` zostają jak są — nazwy producentów sprzętu są tam **cytowanym źródłem** (tytuł strony, organizacja) albo kluczem katalogu, już objętymi wyjątkami strażnika (MER2-07); nazwy aplikacji-konkurentów tam nie występują.
- B: zredagować nazwy producentów w tych plikach — psuje cytaty sprawdzane przez `tests/research-quotes.test.ts` i `zrodlo-jedno.test.ts`.
- C: źródła wskazówek (`27`, `31`, `33`) na Dysk, w repo tylko `lib/cues/data.json` z adresami — traci się możliwość sprawdzenia cytatu w repo; testy i generator `scripts/cues/gen.mjs` do zmiany.

**D5 — `docs/design/` po M3** (jeszcze nie istnieje na `main`). A (rekomendacja): makiety, nagrania, AS IS/TO BE na Dysk; tokeny i specyfikacja wyglądu zostają. B: wszystko zostaje. Wpis na liście jest, bo M3 doda katalog; do ustalenia po scaleniu M3.

**D6 — nazwa repo i strona.** (a) Nazwa: `Apps4Brew/trening` (rekomendacja: adresy w README, podspecach i `site/support.html` zmienia się mechanicznie) albo inna — wtedy adresy dopisujemy po ustaleniu nazwy. (b) GitHub Pages z `site/` (`pages.yml`): rekomendacja **nie włączać** — polityka prywatności i wsparcie są na `apps4brew.com/trening/` (D-2, 14.10.2026); `pages.yml` zostaje w repo wyłączony albo trafia na listę usuniętych (wtedy zmiana testu `public-repo`). Alternatywa: włączyć Pages w nowym repo jako zapasowy adres (dodatkowy punkt przy zmianie wersji strony).

**D7 — moment przeniesienia.** Reguła 21.10 („tylko wydania dostępne w App Store”) i wpis 18.10 („build 1.0 z nowego repo”) się różnią.
- A (rekomendacja): przenosimy **po wydaniu 1.0 w App Store** — build i recenzja ze starego repo, nowe repo dostaje jeden commit ze stanem wydanym (tag `v1.0.0-b<numer>`); zgodne z regułą 21.10; do zmiany: nic w buildach. Wada: aktualizacja 1.0.1 pierwszy raz z nowego repo = pierwszy prawdziwy przebieg tam.
- B: przenosimy **przed wysyłką do Apple** — pierwszy build do sklepu z nowego repo (wpis 18.10); wymaga dowodowego przebiegu `testflight.yml` w nowym repo przed wysyłką i zamyka okno na „samo repo bez wydania”.

**Decyzja właściciela (21.10.2026, przez koordynatora): przyjęte wszystkie rekomendacje D1–D7** — D1: `wzrost`, `41`, `42` na Dysk, `monetyzacja.md` i `39` zostają; D2: w nowym repo świeże `docs/18` i `docs/40` od 1.0, stare na Dysk; D3: `.claude/agents` i `CLAUDE.md` zostają po przeglądzie; D4: research `24`, `25-biblioteka`, `27`, `31`, `33` zostaje; D5: makiety `docs/design` na Dysk, tokeny i specyfikacja zostają; D6: `Apps4Brew/trening`, bez GitHub Pages; D7: przeniesienie **po wydaniu 1.0 w App Store**.

## 3. Kroki właściciela (po jednym, krok po kroku z koordynatorem)

Koordynator prowadzi po jednym zadaniu; poniżej kolejność i co ma być na końcu każdego. Wartości sekretów **nie wklejamy do czatu**.

1. **Organizacja** Apps4Brew (https://github.com/Apps4Brew, plan Free, aplikacja Claude zainstalowana 14.10.2026) — sprawdź, że widzisz Settings organizacji.
2. **Puste repo**: Apps4Brew → New repository → nazwa wg D6, **Public**, bez README, bez .gitignore, bez licencji. Dodaj repo do aplikacji Claude (Settings → GitHub Apps → Claude → Repository access).
3. **Sekrety** (repo → Settings → Secrets and variables → Actions → Secrets): `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` (zawartość pliku .p8 z klucza „Developer” — dodaje się je ponownie, sekrety starego repo się nie przenoszą) oraz `ANTHROPIC_API_KEY` (klucz „Trening — przegląd tłumaczeń”, limit 200 USD, auto-reload wyłączony; można wystawić nowy). **Nie dodawać** `EXPO_TOKEN`, `ASC_API_KEY_P8`, `APPLE_TEAM_ID` (nieużywane, K-019 C).
4. **Zmienne** (te same ustawienia → Variables): `BUILD_BASE` — numer buildu = `BUILD_BASE` + numer przebiegu w nowym repo (od 1), więc musi być **wyższy niż najwyższy build w App Store Connect/TestFlight** (do 21.10.2026: 1022; podaj bieżący numer z ASC i dodaj zapas, np. +100); `NIGHTLY_REFS` (lista gałęzi nocnych, np. `["main"]`; bez niej domyślnie `["main"]`); `MAESTRO_VERSION` (jeśli w starym repo ustawiona — skopiuj; pusta = najnowsza).
5. **Ustawienia bezpieczeństwa**: Code security → Secret scanning i Push protection **Enable**; Settings → General → **Automatically delete head branches**; ochrona `main` (Settings → Rules → Rulesets: wymagane sprawdzenie z workflowu „Testy” — dodać po pierwszym przebiegu, blokada force-push); Settings → Environments → **`release`** z wymaganym recenzentem (Ty) — bez tego `testflight.yml` nie ruszy (zadanie `build` ma `environment: release`). Opcjonalnie później sekrety ASC do Environment secrets środowiska `release`.
6. **Strona / Pages**: wg D6 (domyślnie nic nie włączać).
7. **Repo narzędzi `apps4brew-narzedzia`**: transfer do organizacji (repo → Settings → General → Danger zone → Transfer ownership → Apps4Brew). Zrób po przeniesieniu aplikacji, nie przed; potem sprawdź, że wzmianki o jego adresie (jeśli są) wskazują nową lokalizację.
8. **Po zielonym pierwszym przebiegu w nowym repo**: w App Store Connect adresy polityki i wsparcia zostają na `apps4brew.com/trening/` (bez zmian); stare repo → Settings → Danger zone → **Change visibility → Private** (nie usuwać); sekrety starego repo usunąć.

## 4. Kroki koordynatora (po decyzjach D1–D7 i krokach 1–5 właściciela)

1. Przejrzeć rejestr ryzyk (`docs/40`): brak otwartych pozycji; `main` zielony (`tests.yml`, E2E pakiet podstawowy).
2. **Poprawki w starym repo** (zwykły PR, pełne `verify`): pozycje „popraw” z listy (pkt 5), zmiana testów i skryptów czytających usunięte pliki (pkt 6), nowe `docs/18` i `docs/40` wg D2, `CLAUDE.md` wg D3, `scripts/readme.mjs` (stała `REPO`, opisy katalogów `docs/audyt-0.10`, `docs/prompty`) i wygenerowane README oraz `docs/19`.
3. `node scripts/przeniesienie-1.0.mjs --zachowaj --testy` — raport musi pokazać: **0 nazw firm w zakresie strażnika**, 0 wyjątków zbędnych, brak testów czytających usunięte pliki, Jest w drzewie zielony. Nazwy w dokumentacji (pkt 5) = 0 do ręcznej poprawy.
4. Kopia pozycji „na Dysk” (`na-dysk/` z podglądu) do folderu „Trening App” — właściciel zachowuje; w repo zostają tylko własne wnioski z linkiem do Dysku.
5. Wykonanie: drzewo z kroku 3 → `git init`, **jeden commit** (autor: ustawienie właściciela, bez e-maila/UDID w treści — sprawdź `git diff --cached`), `git remote add`, `git push -u origin main`. Nie przenosić tagów ani gałęzi starego repo. Ten krok to jedyne wypchnięcie i dopiero po zgodzie właściciela — skrypt go nie zawiera.
6. **Pierwszy przebieg**: `tests.yml` (zielony), potem E2E z `workflow_dispatch`. Uwaga (ryzyko R-NOWE-1): test aktualizacji (33/34) bierze poprzednią wersję z pliku `Trening-sim.zip` przy wydaniu GitHub (`scripts/ci/poprzednia-wersja.sh`); nowe repo nie ma wydań → pierwszy przebieg pakietu podstawowego pada na tym kroku. Obejście: wydanie robocze w nowym repo z plikiem `Trening-sim.zip` z ostatniego wydania starego repo (jak K-062) dla commitu poprzedzającego, albo ręczny przebieg z `poprzednia_wersja_z_przebiegu = brak` (powód w podsumowaniu), a od drugiego wydania wszystko działa samo.
7. Dowodowy przebieg `testflight.yml` w nowym repo (L-001: zmiana budowania wymaga prawdziwego przebiegu), sprawdzenie, że numer buildu > ostatni w ASC; sprawdzenie, że `release` czeka na zatwierdzenie.
8. Dopisać wpis w docs/18 (nowym) z datą przeniesienia i adresem repo; poinformować właściciela skrótem lekcji, jeśli coś poszło nie tak (docs/40).

## 5. Co zostaje, co znika (wejście: `scripts/przeniesienie-1.0.json`, raport inwentaryzacji 21.10.2026)

Akcje: **zostaje** (domyślnie, wszystko, czego lista nie wymienia), **usuń** (nie trafia do nowego repo, kopia w prywatnym archiwum), **na Dysk** (usunięte z repo, właściciel zachowuje kopię), **decyzja** (czeka na właściciela, D1–D7), **popraw** (zostaje, ale wymaga ręcznej zmiany treści przed przeniesieniem).

| pozycja | akcja | uwagi |
|---|---|---|
| `docs/09-archiwum-do-0.11.md` | usuń | archiwum rund, nazwy sprzętu i narzędzi |
| `docs/09-plan-testow.md` | popraw | zostaje (plan testów, dziennik wydań); neutralne opisy zamiast nazw (Garmin, Sideloadly, producenci) |
| `docs/10`, `11`, `12`, `13`, `21` | na Dysk | research konkurencji; `21` zawiera „Backlog bez priorytetu” (wskazuje go CLAUDE.md) — razem z nim |
| `docs/14-e2-specyfikacja.md` | popraw | 2 wzmianki o innej aplikacji |
| `docs/15-app-store.md` | popraw | opis sklepu zostaje (test `audit-m1-045`); 3 wzmianki w historii decyzji (Garmin, Body Battery, preset marki) |
| `docs/18-archiwum-do-11.10.md` | na Dysk | zamrożone decyzje 06–11.10 |
| `docs/18-przekazanie.md`, `docs/40-lekcje.md` | decyzja D2 | rejestr decyzji i lekcje |
| `docs/25-audyt-0.10.md`, `docs/audyt-0.10/` | usuń | audyt 0.10.0 (11 plików), w tym wzmianka o danych osobowych w dawnej historii |
| `docs/35-zegarki.md`, `docs/38-…` | popraw | wzmianki Garmin (Garmin po App Store) |
| `docs/39`, `docs/monetyzacja.md` | decyzja D1 | |
| `docs/41`, `docs/42`, `docs/wzrost.md` | na Dysk | strategia (D1 rekomendacja A) |
| `docs/43`, `docs/44`, `docs/prompty/` | na Dysk | dokumenty robocze i przekazania |
| `docs/research/` (raporty rynkowe, skargi, standardy promptów, przegląd badacza) | na Dysk | research rynku i pracy zespołu; pozostały research zostaje (D4) |
| `docs/research/24`, `25-biblioteka/`, `27`, `31`, `33` | decyzja D4 | źródła; rekomendacja: zostają |
| `.claude/agents/`, `CLAUDE.md` | decyzja D3 | rekomendacja B (zostają po przeglądzie) |
| `docs/design/` | decyzja D5 | powstanie po M3 |
| `.github/workflows/pages.yml` | decyzja D6 | |
| `README.md`, `scripts/readme.mjs`, `site/support.html`, 3 × `*.podspec` | popraw | adres repo → nowe repo (po D6) |
| `tests/release-0.13…0.20` (7 plików) | popraw | po jednej linii `not.toMatch(…)` z listą nazw konkurentów małymi literami (strażnik, wrażliwy na wielkość liter, ich nie widzi) → `namesIn()` z `tests/forbidden-names` |
| `tests/audit011b`, `matrix-invariants`, `locations-catalog` | popraw (sprawdzić) | miękki przegląd: `STRONG`, `strong`, `voltra` — potwierdzić, czy to nazwa, czy identyfikator |
| `docs/46`, `scripts/przeniesienie-1.0.*`, `tests/przeniesienie-1.0.test.ts` | usuń | narzędzie jednorazowe; po przeniesieniu niepotrzebne (a ten dokument nazywa firmy) |
| wszystko inne | zostaje | kod, testy, skrypty, workflowy, `store/`, `site/`, `watch-fixtures/`, `docs/brd`, `docs/lokalizacja`, `docs/16`, `17`, `19`, `20`, `22`, `24`, `26`–`34`, `35-zegarek-apple`, `36`, `37` |

Aktualne liczby (pliki zostają / usunięte / na Dysk / decyzje / popraw): `node scripts/przeniesienie-1.0.mjs` (nagłówek raportu). Nie wpisujemy ich tu ręcznie.

**Wniosek ze słowników `cs` i `sk`:** `lib/locales/cs.json` i `sk.json` zawierają po jednym słowie „Strava” (klucz „Dieta”, wiersz 286). To widoczny w aplikacji tekst, ale to **zwykłe słowo czeskie i słowackie** („strava” = wyżywienie/jedzenie), nie nazwa aplikacji; strażnik ma na nie wyjątek z powodem. Nie jest to błąd nazwy firmy. Zostawiamy; jeśli właściciel woli uniknąć skojarzenia, zamiennik: „Výživa” (cs) i „Výživa” (sk) — decyzja produktowa, do sprawdzenia przez tłumacza.

**Inne nazwy w kodzie (objęte wyjątkami, zostają):** klucze katalogu sprzętu (`Assault Bike`, `Bosu`, `Ski Erg` — nazwa kanoniczna zapisana w danych użytkowników; nazwa wyświetlana jest ogólna), źródła wskazówek techniki w `lib/cues/data.json` (producent sprzętu jako cytowane źródło), fixtury migracji. Identyfikator `garmin` w protokole zegarka (`lib/watch/protocol.ts`, `watch-fixtures/`, testy zegarka) to nazwa klienta protokołu, nie tekst dla użytkownika; Garmin jest po App Store — do decyzji, czy zostawić identyfikator (zmiana protokołu = ryzyko, rekomendacja: zostawić).

## 6. Testy i skrypty do zmiany po usunięciach

Wynik `node scripts/przeniesienie-1.0.mjs --testy` oraz statycznej analizy odwołań (21.10.2026). Dokładna lista w raporcie skryptu, sekcja „Testy i skrypty czytające usunięte pliki”.

**Dowód z Jest w drzewie** (wariant domyślny: pozycje „decyzja” zostają, usunięto 12 plików + 16 na Dysk; 406 plików testów, 8 pada, 16 przypadków):

| test | przyczyna | co zmienić |
|---|---|---|
| `audit-k1-bl-mer.test.tsx` | czyta `docs/09-archiwum-do-0.11.md` (liczba ćwiczeń ze wskazówkami) | sprawdzać `docs/09-plan-testow.md` albo usunąć przypadek |
| `audit-m1-046-047-claims.test.tsx` | czyta `docs/10-miejsca-i-sprzet.md` (ACSM, krok podpowiedzi) | przenieść asercje do rejestru twierdzeń / BRD |
| `audit-m1-048-claims-registry.test.ts` (`check:claims`) | rejestr wskazuje usunięty dokument (`docs/10`, `docs/research/przeglad-badacza-…`) | zmienić odwołania w `docs/research/rejestr-twierdzen.json` i `--rehash` |
| `audit-m1-068-release-plan.test.ts` | cały test dotyczy `docs/42` i `docs/41` | usunąć test razem z dokumentami (D1 A) |
| `audit-m1-071-channels.test.ts`, `audit-m1-072-android-decision.test.ts` | czytają `docs/wzrost.md` | usunąć testy razem z dokumentem |
| `audit-m1-workflows.test.ts` | ścieżki `docs/…` w komentarzach workflowów (np. `store-screenshots.yml` → `docs/41`) | poprawić komentarze workflowów |
| `readme.test.ts` (+ `check:readme`) | README opisuje `docs/audyt-0.10`, `docs/prompty`, `docs/10`; odnośniki do usuniętych plików | `scripts/readme.mjs` (opisy katalogów, źródła liczb), `--write` |

Po wariancie D2 A/D1 B dojdą testy czytające `docs/18`, `docs/40`, `docs/39`, `monetyzacja.md` i `CLAUDE.md` (statyczna analiza wariantu `--decyzje=usun`): `audit-m1-045-store-description`, `audit-m1-049-critical-content`, `audit-m1-067-language-registry`, `audit-m1-p4b-queue`, `prices-decision`, `test-fast`, `verify-docs`, `audit-m1-044-brd`, `audit-m1-048`, `public-repo`, oraz skrypty `scripts/verify-docs.mjs`, `scripts/cues/gen.mjs` (czyta `docs/research/27`). Komentarze i opisy wspominające usunięte pliki (ok. 40 w kodzie, testach i workflowach) nie psują testów, ale po przeniesieniu wiszą — poprawić przy okazji.

Test `forbidden-names.test.ts` nie padł: po usunięciach żaden wyjątek nie stał się zbędny, a w zakresie strażnika nie ma nazw poza wyjątkami.


## 7. Ryzyka

- **R-NOWE-1** — test aktualizacji bez poprzedniego wydania w nowym repo (pkt 4.6). Warunek zamknięcia: pierwszy zielony pakiet podstawowy w nowym repo.
- **R-NOWE-2** — `BUILD_BASE` za niski → Apple odrzuca build o numerze niższym od istniejącego. Warunek: numer z ASC sprawdzony przed dodaniem zmiennej.
- **R-NOWE-3** — nazwy firm w dokumentacji poza zakresem strażnika (docs/ nie jest skanowane testem); raport podglądu je wypisuje, poprawa ręczna.
- **R-NOWE-4** — po usunięciu dokumentów zostają odwołania w komentarzach kodu i workflowów (`docs/10`, `docs/41`, `CLAUDE.md`): nie psują testów, ale wiszą; raport je wylicza.
- **R-NOWE-5** — workflowy z identyfikatorami repo (`GITHUB_REPOSITORY` jest dynamiczne; sprawdzone: brak zaszytego `lkarwowski494/trening` poza README, `scripts/readme.mjs`, podspecami, `site/support.html` i testami `public-repo`, `readme`, `store-urls`).
