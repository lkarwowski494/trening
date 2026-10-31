# Trening — przyspieszenie `verify` i CI (przekazanie z sesji Oczko/prompts, 31.10.2026)

Dla: sesja agenta w repo `lkarwowski494/trening` (koordynator albo rola 07 Jakość, tryb `build`).
Od: sesja, która analizowała artykuł „CI jako wąskie gardło pracy agentów” wobec portfela (Oczko DEC-35, `prompts` D-050 / zasada wspólna 21).
Status: **analiza i propozycje, nic nie jest wdrożone.** Repo Trening było w tamtej sesji tylko do odczytu. Każda opcja niżej wymaga decyzji właściciela, zapisanej w formacie docs/18 (`[wdrożenie: …]`, `[test: …]`).

## 0. Zanim zaczniesz

1. Przeczytaj `docs/zobowiazania.md` („Aktywne”) i `docs/48-zgloszenie-1-0.md`. **Trwa zgłoszenie 1.0.** Zmiana workflowu `tests.yml` w oknie wydania to ryzyko dla ścieżki krytycznej. Zapytaj właściciela o termin: (a) po wysłaniu 1.0 do recenzji Apple (rekomendacja), (b) od razu na gałęzi, scalenie po wysłaniu, (c) od razu. Gdy wybierze (a), wpisz zobowiązanie z warunkiem startu do `docs/zobowiazania.md`.
2. Liczby z sekcji 1 to pomiar z innej maszyny. Przed planem powtórz najważniejszy pomiar u siebie (`npx jest --json --outputFile=<scratchpad>/jest.json`) i zapisz wynik.
3. Nie ruszaj modelu z L-049 (hak pre-push ze znacznikiem pełnego verify) bez osobnej decyzji właściciela. Propozycje niżej go nie zmieniają.

## 1. Pomiar (31.10.2026, kontener Linux 4 vCPU, `CI=1`, commit `main` z tego dnia)

| Krok `npm run verify` | Czas |
|---|---|
| `npm ci --ignore-scripts` | 27 s |
| typecheck | 23 s |
| lint | 31 s |
| check:i18n, cues, claims, decyzje, figures, figures-v2, zrodla-runtime, readme | 0,2–2,8 s każdy, razem ok. 8 s |
| check:matrix / check:licenses | 7,3 s / 0,3 s |
| **jest (569 plików, 10 702 testy, maxWorkers 3)** | **1 579 s = 26,3 min** (zimna pamięć podręczna, kod 0) |
| jest ponownie, ciepła pamięć podręczna | 1 613 s = 26,9 min, czyli **cache transformacji nic nie daje**; czas jest w samych testach |
| expo export iOS + check:bundle | 34 s + 0,7 s |
| verify:native | 8 s |
| **Razem** | **ok. 29 min**, z czego Jest to 90% |

- Dokumenty projektu podają `verify` w CI „ok. 25 min” (`docs/48-zgloszenie-1-0.md:155`), więc pomiar jest zgodny.
- Suma czasów plików Jest wynosi 71,8 min. Mediana pliku to 1,4 s; 332 pliki trwają poniżej 2 s. **10 najcięższych plików daje 44% sumy:**

| Plik | s | Plik | s |
|---|---|---|---|
| maestro-flows.test.tsx | 368 | matrix-dim-langs1.test.tsx | 134 |
| audit-r72-c.test.ts | 249 | audit-k1-bl-mer.test.tsx | 124 |
| migrate-idem.test.ts | 241 | matrix-invariants.test.ts | 119 |
| invariants.test.ts | 201 | matrix-dim-langs-routes6.test.tsx | 101 |
| maestro-e2e38563.test.tsx | 199 | matrix-dim-langs2.test.tsx | 93 |
| maestro-zycie.test.tsx | 162 | matrix-dim-langs-routes1/4/2, langs4 | 79–90 |

- W drugim przebiegu 4 pliki padły z „jest worker process was terminated by another process: SIGTERM” (matrix-dim-langs3, regress, matrix-dim-langs-routes3/5); pierwszy przebieg był zielony. Przyczyny nie ustalono, prawdopodobnie środowisko pomiaru. Gdy zobaczysz to u siebie albo w CI, to osobne znalezisko.

**Skutek dla pracy agentów:** każde wypchnięcie kosztuje ok. 29 min lokalnego `verify` (znacznik L-049) i ok. 25 min `tests.yml`. L-049 pokazuje, że długie verify skłania do wypychania przed jego końcem.

## 2. Znalezisko przy okazji (do naprawy niezależnie od decyzji)

`CLAUDE.md` (sekcja o verify) podaje „pełne `npm run verify` … ~12 min” oraz „hak pre-push … ok. 35 s”. Pomiar: verify ok. 29 min, a hak według własnego komentarza w `scripts/hooks/pre-push` ok. 80 s (pomiar 28.10.2026). To nieaktualne twierdzenia, klasa JAK-15. Popraw liczby z datą pomiaru albo odwołaj się do jednego miejsca z pomiarem.

## 3. Opcje (do decyzji właściciela)

### T1 — Jest w CI w 4 równoległych częściach + osobne zadanie kontroli (rekomendacja)

- **Co:** `tests.yml` dostaje trzy zadania:
  - `kontrole`: wszystko z verify poza Jest;
  - `jest` z macierzą `czesc: [1, 2, 3, 4]` i `npx jest --shard=<n>/4` (Jest 29.7 ma `--shard`);
  - `verify` (`needs: [kontrole, jest]`, `if: always()`), które pada, gdy którekolwiek nie jest `success`.
- **Nazwa zbiorcza:** zostaw zbiorcze zadanie pod nazwą `verify`, żeby nie zmieniać nazwy sprawdzenia wymaganego przy scalaniu. `[DO USTALENIA]`: czy ochrona gałęzi `main` wymaga konkretnej nazwy (Settings → Branches).
- **Szacunek:** ok. 7–10 min zamiast ok. 25.
  - Dolna granica to najdłuższy plik (`maestro-flows`, 6,1 min) plus ok. 1 min setupu.
  - Przy równym podziale 71,8 min CPU na 4 × 3 workery wychodzi ok. 6 min na część.
  - `--shard` dzieli po skrócie ścieżki, nie po czasie, więc części mogą być nierówne. Zmierz pierwszy przebieg. Przy rozrzucie powyżej 30% własny `testSequencer` z wagami (wzór: `scripts/ci/e2e-shards.json` i `.mjs`, czyli wagi = czasy) albo opcja T1b.
- **Jedno źródło prawdy:** nie przepisuj łańcucha verify do YAML. Wydziel w `package.json` skrypt kontroli bez Jest (np. `verify:kontrole`), a `verify` niech go woła razem z Jest i resztą. CI woła `verify:kontrole` i Jest w częściach. Strażnik `tests/package-scripts.test.ts` (L-008) wymaga, żeby każdy skrypt był w verify albo miał powód wyjątku; nowy skrypt będzie w verify. `check:matrix` czyta kod, nie wyniki Jest, więc kolejność względem Jest nie ma znaczenia (sprawdzone w nagłówku `scripts/test-matrix.mjs`).
- **Ograniczenia, które testy już pilnują i które muszą przejść:**
  - `tests/public-repo.test.ts:31`: w `tests.yml` tylko `permissions: contents: read`, bez `contents: write`, `pull_request_target` i `secrets.`; warunek `if` blokujący forki zostaje w **każdym** zadaniu.
  - `tests/prop-seed.test.ts:44–49`: w `tests.yml` brak `PROP_SEED`; w `nightly.yml` bez zmian `PROP_SEED=random npx jest --maxWorkers=2`.
  - `tests/audit-m1-p4b-queue.test.ts` (L-053): testy numeracji lekcji czytają `GITHUB_REF_NAME` i `GITHUB_BASE_REF`. Każda część Jest musi mieć te same zmienne co dziś.
  - `tests/hak-pre-push.test.ts:310`: polecenia agentów mówią „sprawdź wynik tests.yml”. Nazwa workflowu zostaje.
  - `tests/readme.test.ts:162`: README wymienia `tests.yml`.
- **Koszt:** 0 zł (repo publiczne, standardowe runnery Linux). Limit równoległych zadań Linux w planie darmowym: `[DO USTALENIA]` w dokumentacji GitHuba w dniu pracy (pamięć modelu: 20; macOS 5 jest zapisane w L-055). Przy 5 zadaniach na przebieg i dwóch przebiegach na commit z PR (T4) to 10 zadań naraz. Zapisz limit w jednym miejscu i dodaj strażnika jak w L-055.
- **Dowód ukończenia:**
  - przebieg `tests.yml` z czasem każdego zadania;
  - suma testów ze wszystkich części = liczba testów z pełnego `npx jest` (10 702; ta sama wersja kodu);
  - przebieg z celowo czerwonym testem w jednej części kończy zbiorcze `verify` na czerwono (próba na gałęzi, potem cofnięta).

### T1b — Podział 4 najcięższych plików (tańszy, pomaga też lokalnie)

`maestro-flows` (6,1 min), `audit-r72-c`, `migrate-idem` i `invariants` na mniejsze pliki tematycznie. Skraca „ogon” przebiegu, gdy pozostałe workery już czekają. Lokalnie zysk ograniczony (CPU 4 rdzenie, suma się nie zmienia); w CI z T1 obniża dolną granicę z 6,1 min. Uwaga na `check:matrix` i wyjątki macierzy, które mogą wskazywać nazwy plików.

### T2 — Mniej przypadków testów własności w verify, pełne w nocy

- **Fakt:** `audit-r72-c` (`:35`), `migrate-idem` (`:62`) i `invariants` (`:208`, `:215`) mają `numRuns: 3000` na stałym ziarnie (`tests/setup.js:12`, `PROP_SEED_DEFAULT`). Każde verify sprawdza więc te same 3000 przypadków; nowe przypadki daje tylko nocny przebieg z `PROP_SEED=random` (`nightly.yml`). `invariants` ma już pokrętło `INV_RUNS` (domyślnie 60).
- **Propozycja:** jedno pokrętło (np. `PROP_RUNS_SKALA`, domyślnie np. 0,25 w verify, 1 w nocy) w `tests/prop-seed.js`, użyte w plikach z `numRuns: 3000`. Strażnik: nocny przebieg ma pełną liczbę.
- **Szacunek:** te pliki to ok. 11,5 min CPU z 71,8; przy skali 0,25 zysk ok. 2–3 min lokalnie i w CI. Zmierz na jednym pliku przed wdrożeniem.
- **To zmiana standardu jakości,** więc wyłącznie decyzja właściciela. Odrzucona alternatywa: mniej przypadków także w nocy.

### T3 — ccache dla `xcodebuild` (E2E, TestFlight, ios-unsigned)

- **Fakt:** żaden workflow nie używa `actions/cache`. Build iOS trwa ok. 36–40 min (komentarz `e2e-ios.yml:77`: pods 2 min, xcodebuild 36 min). Szablon Expo z `node_modules/expo/template.tgz` (`ios/Podfile`) ma już domyślnie prekompilowany rdzeń RN (`RCT_USE_PREBUILT_RNCORE=1`, `RCT_USE_RN_DEP=1`) i moduły Expo (`EXPO_USE_PRECOMPILED_MODULES=1`), a ccache wyłączony (`apple.ccacheEnabled`).
- **Propozycja:** jeden przebieg próbny `ios-unsigned.yml` z `apple.ccacheEnabled=true` (przez `expo-build-properties` albo `Podfile.properties.json`), `brew install ccache` i `actions/cache` na katalog ccache. Klucz: wersja Xcode + `package-lock.json`. Dwa przebiegi pod rząd: zimny i ciepły.
- **Zysk niezmierzony.** Decyzja dopiero po pomiarze. Ryzyko: limit 10 GB cache na repo (`[DO USTALENIA]` w dniu pracy) i nieświeży cache przy zmianie Xcode. Nie dotyczy podpisanego archiwum TestFlight, dopóki próba nie pokaże, że build jest identyczny funkcjonalnie.

### T4 — Podwójny przebieg `tests.yml` na commit z otwartym PR (brzegowe)

`on: push` (wszystkie gałęzie) + `pull_request` do `main`. Grupy `concurrency` różnią się (`refs/heads/…` i `refs/pull/N/merge`), więc ten sam commit biegnie dwa razy. To świadomy wybór (L-053, wariant A). Wraca do tematu tylko, gdy po T1 zabraknie równoległych zadań Linux. Opcja na wtedy: `push` tylko dla `main` i `integracja-*`, gałęzie funkcji przez PR.

### Czego nie proponuję (z artykułu)

- Płatne runnery: zasada 0 zł.
- Oxlint i szybszy typechecker: lint 31 s, typecheck 23 s.
- `isolate: false` / wspólny worker: czas jest w testach, nie w ładowaniu modułów (pomiar ciepły ≈ zimny).
- Testy tylko zmienionych projektów: E2E ma już `paths-ignore`, a `test:fast` lokalnie istnieje.
- Lżejszy hak pre-push: odwracałby L-049.

## 4. Kolejność (rekomendacja)

1. Poprawka `CLAUDE.md` (sekcja 2), mała i niezależna.
2. Decyzja właściciela o terminie (sekcja 0) i o T1, T2, T3.
3. T1 na gałęzi; pierwszy przebieg informacyjny (zasada roli 07: nowa kontrola przechodzi raz w CI, zanim stanie się bramką). Pomiar części; przy dużym rozrzucie T1b albo sekwencer z wagami.
4. T2 po T1 (pomiar przed i po na tych samych plikach).
5. T3 jako osobny eksperyment po wydaniu 1.0.
6. Lekcja w `docs/40-lekcje.md` tylko wtedy, gdy wyjdzie błąd albo zaskoczenie (np. nierówne części).

## 5. Szacunek czasu

- **Agent:**
  - T1 ok. 1–2 h (YAML, `package.json`, strażnik, poprawki testów workflowu, próba z czerwonym testem);
  - T2 ok. 1 h;
  - T3 ok. 1 h plus analiza.
- **Czekanie:** każdy przebieg `tests.yml` ok. 25 min przed T1, ok. 8–10 min po; T3 dwa buildy po ok. 40 min.
- **Właściciel:** decyzje o terminie i T1–T3 (ok. 10 min), sprawdzenie nazwy wymaganego sprawdzenia w ustawieniach gałęzi `main` (ok. 2 min).

## 6. Źródła

- Pomiar: sesja Claude Code 31.10.2026 (kontener, 4 vCPU); pełny JSON czasów plików Jest nie jest w repo, więc powtórz pomiar (sekcja 0, pkt 2).
- Oczko DEC-35 (`lkarwowski494/oczko`, `docs/decyzje_biezace.md`): ten sam wzorzec, czyli E2E czerwone 2 tygodnie przez cichy wybór Xcode, a potem 10/10 scenariuszy Maestro na modalu powitalnym.
- `prompts` D-050 / C-046: zasada wspólna 21 „Bramki mechaniczne i stan CI”, rola 07 JAK-18.
- Artykuł o CI w pracy agentów (wklejony przez właściciela 31.10.2026): runnery, lint, typecheck, podział testów, cache setupu, równoległość, testy tylko zmian, hak przed pushem. Tezy artykułu to opinia; liczby w tym dokumencie pochodzą z pomiaru na repo Trening.
