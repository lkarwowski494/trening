# Recenzja niezależna: naprawa buildu TestFlight 1.1 (czas testów) — Trening — 2026-11-13
Commit badany: `c00f5e41` (gałąź `napr/testflight-1-1-czas`, HEAD zgodny z poleceniem AC) · Zakres: `git diff 073fc4aa..c00f5e41` (91 plików, autor zmian: sesja AB) · Tryb: 07-jakosc audit (recenzja niezależna, sesja AC) · Środowisko: Linux, Node 22, Jest lokalnie; bez macOS/Xcode (przebiegu `testflight.yml` nie uruchamiano — zakaz z polecenia).

## Werdykt: PRZYJĘTE
Rola 07: GOTOWE Z ZASTRZEŻENIAMI. Brak znalezisk KRYTYCZNYCH ani WYSOKICH. Zastrzeżenie (warunek scalenia, nie znalezisko): przed scaleniem zmiany workflowu potrzebny przebieg dowodowy `testflight.yml` (wejście `bez_wysylki`) na SHA gałęzi, z zielonym CAŁYM workflowem — wymóg CLAUDE.md, „Model pracy po lekcji L-001”, pkt 1. Na 13.11.2026 takiego przebiegu nie ma (lista przebiegów gałęzi: `tests.yml` 43332896326 zielony na c00f5e41, E2E 43332944768 oczekuje, `testflight.yml` — brak). Limit 45 min zadania `testy` jest szacunkiem (`probka_min: []`), więc ten przebieg jest też pierwszym pomiarem.

Próg projektu: „wydanie blokują tylko znaleziska KRYTYCZNE i WYSOKIE” (CLAUDE.md, „Audyty i wydania”, pkt 1).

## Podsumowanie
Naprawa robi to, co deklaruje: zestaw kontroli przed buildem jest ten sam co w dawnym `npm run verify` (poza zapisem znacznika i `--czysta`, oba bez znaczenia w świeżej kopii CI), pełny zestaw plików Jest jest podzielony na 6 części bez pominięć i powtórzeń, `build` czeka na wszystkie części, nie ma nowych sekretów ani uprawnień. Zamiana 66 porównań „moduł główny” na `jestGlowny` jest mechaniczna i poprawna (sprawdzone parami), a eksport strony bez `--skroty` daje bajtowo ten sam wynik co przed zmianą. Trzy znaleziska ŚREDNIE/NISKIE dotyczą siły strażników: nowy test workflowu nie wykrywa wyciszenia błędów (dawny wykrywał), detektor kruchego wzorca widzi tylko porównanie w jednej linii, a jeden komentarz podaje 5 części zamiast 6.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 07-jakosc-004 | P2 (ŚREDNIE) | D | Strażnik zadania `testy` nie wykrywa wyciszenia błędu (`\|\| true`, `continue-on-error`, `if: always()` przy build) — słabszy niż dawny | otwarte |
| 07-jakosc-005 | P2 (ŚREDNIE) | D | Detektor kruchego porównania „moduł główny” widzi tylko wzorzec w jednej linii plików `.mjs` w `scripts/` i `docs/` | otwarte |
| 07-jakosc-006 | P2 (NISKIE) | D | Komentarz w teście mówi o 5 częściach, workflow ma 6 | otwarte |

## Linia bazowa i założenia
Ryzyka od zera (soczewka „właściciel wydający wersję” i „sceptyk szukający testu, który nie może paść”):
1. Build TestFlight powstaje bez części testów (część pominięta, plik poza wszystkimi częściami, porażka wyciszona) — fałszywa pewność przed wysyłką. Sprawdzone: kontrole, podział, `needs`, próby mutacji (niżej).
2. Skrypt CI po zamianie warunku przestaje działać jako główny albo uruchamia się przy imporcie (cichy kod 0 albo efekt uboczny w teście). Sprawdzone: pary zamian, ścieżki importu, test na dowiązaniach.
3. Eksport strony (publiczny, bramka 4 figur) zmienia wynik po dodaniu `--skroty`. Sprawdzone: eksport starego i nowego commitu, porównanie bajtowe.
4. Limit czasu znów za niski albo maszyny macOS zajęte ponad plan darmowy. Sprawdzone: liczby i strażniki; czas realny — nie sprawdzono (wymaga macOS).

Wymiary pokrycia: rejestr ryzyk — wyżej; wyrocznie — test podziału używa `jest --listTests` (niezależne od kodu workflowu), test eksportu porównuje dwie ścieżki liczenia; dane testowe — nie dotyczy; platforma — `testflight.yml` tylko na macOS, nie uruchomiony; dostępność — nie dotyczy; bramki CI — sprawdzone; niestabilne testy — sprawdzone, brak (jeden przebieg 96/96); siła testów — mutacje (4 workflowu, 3 strażnika modułu głównego); dowody wydania — brak przebiegu `testflight.yml` (warunek).

## Pokrycie
| Obszar / pliki | Sprawdzone? | Jak |
|---|---|---|
| `.github/workflows/testflight.yml` (zadania `testy`, `build`) | tak | odczyt diffu, porównanie z łańcuchem `verify` z `package.json`, mutacje |
| `scripts/ci/kontrole.mjs` | tak | odczyt; `node scripts/ci/kontrole.mjs --wypisz` kod 0 (20 kroków, tabela w zadaniu a) |
| `scripts/modul-glowny.mjs` + 66 skryptów z zamianą | tak | skrypt par „usunięta linia ↔ dodana linia + import”, istnienie ścieżki importu |
| `tests/modul-glowny-symlink.test.ts` | tak | uruchomienie + mutacje |
| `scripts/strona/eksport.mjs`, `tests/strona-eksport-recenzja.test.ts` | tak | eksport 073fc4aa vs c00f5e41, przegląd asercji |
| `scripts/ci/czasy-tests.json`, `tests/testflight-testy-czas.test.ts`, `tests/macos-max-parallel.test.ts` | tak | odczyt, uruchomienie, mutacje |
| Zmiany w testach istniejących (public-repo, audit-m1-workflows, ci-tagi-jest, ponowienia-workflow, kontrole-ci, hak-pre-push) | tak | diff + uruchomienie |
| Czas realny części na macOS | nie | wymaga przebiegu `testflight.yml` (zakaz uruchamiania w AC) |
| `docs/40-lekcje.md`, pliki generowane (README, macierz) | częściowo | tylko spójność liczby części; treści lekcji nie oceniano |

Dowody uruchomień (lokalnie, katalog roboczy recenzji poza repo):
- `npx jest --ci --runInBand` na 9 plikach (modul-glowny-symlink, testflight-testy-czas, macos-max-parallel, ci-tagi-jest, strona-eksport-recenzja, ci-srodowisko, ponowienia-workflow, audit-m1-workflows, public-repo): kod 0, „Test Suites: 9 passed”, „Tests: 96 passed”.
- Eksport strony w kopiach 073fc4aa i c00f5e41 (`node scripts/strona/eksport.mjs --out <k> --langs en,pl --commit abc1234def`), oba kod 0; `diff -r` kod 0, 8 plików (13 MB) identycznych.
- Pary zamian: 66 plików, 0 nietypowych (każdy plik: dokładnie jedna linia usunięta, jedna dodana z warunkiem i jedna z importem `modul-glowny.mjs`, ścieżka importu istnieje). Ogony po warunku zgodne liczbowo: `{` 48/48, `main();` 5/5, `.catch(...)` 4/4, `process.exit(main(...))` 3/3, `const isMain` 3/3, `.then(c, e)` 2/2, `.then(c)` 1/1. Siedemdziesiąta siódma zmiana to `eksport.mjs` (sprawdzona osobno).

## Kontrola dowodów i sekretów
`node sprawdz-raport.mjs docs/audyt-1-1/recenzja-testflight-czas-2026-11-13.md . --rola 07-jakosc`: kod 0, „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 07-jakosc”. Raport nie zawiera sekretów, UDID ani adresów e-mail.

## Stosowalność listy kontrolnej
| Pozycja | Status | Wynik |
|---|---|---|
| JAK-01 ryzyka wysokie z testem | dotyczy (ryzyka 1–3 wyżej) | ok: każde ma test, który przechodzi |
| JAK-02 pochodzenie wartości oczekiwanych | dotyczy częściowo | ok: podział porównany z `jest --listTests` (niezależna wyrocznia); eksport — parytet dwóch ścieżek |
| JAK-03 kryteria akceptacji z ID | dotyczy | ok: testy niosą ID 07-jakosc-001/002/003 |
| JAK-04 testy mogą paść | dotyczy | częściowo: strażnik modułu głównego i `needs` padają na mutacji; wyciszenie błędu nie — 07-jakosc-004, kruchy wzorzec dwuliniowy — 07-jakosc-005 |
| JAK-05 powtarzalność | dotyczy | ok w jednym przebiegu; pełnego zestawu 3× nie uruchamiano (poza zakresem recenzji) |
| JAK-06 strefy czasu | nie dotyczy (brak logiki kalendarzowej w zakresie) | — |
| JAK-07 własności | nie dotyczy (brak niezmienników domeny w zakresie) | — |
| JAK-08 dane z zewnątrz | nie dotyczy | — |
| JAK-09 bramka CI = pełny zestaw, bez wyciszeń | dotyczy | ok w stanie obecnym (brak `\|\| true`, `continue-on-error` w zadaniach testów i buildu; `if: always()` tylko w kroku odczytu pamięci, `.github/workflows/testflight.yml:96`); strażnik słabszy — 07-jakosc-004 |
| JAK-10 sekrety i uprawnienia | dotyczy | ok: `testy` dziedziczy `permissions: contents: read`, bez `secrets.*`; nowe akcje tylko `actions/*` |
| JAK-11 koszt CI | dotyczy | ok: repo publiczne (ADR-031), standardowe runnery darmowe; max-parallel 3 |
| JAK-12 E2E | dotyczy | bramka E2E bez zmian (`needs: bramka`); przebieg E2E na c00f5e41 oczekuje |
| JAK-13 dostępność | nie dotyczy | — |
| JAK-14 geo | nie dotyczy | — |
| JAK-15 deklaracje | dotyczy | 07-jakosc-006 (5 vs 6 części); README i macierz — `tests.yml` zielony na c00f5e41 (check:readme, check:matrix w kontrolach) |
| JAK-16 jeden SHA kandydata | dotyczy | nie sprawdzono: brak przebiegu `testflight.yml` (warunek scalenia) |
| JAK-17 nazwa vs działanie | dotyczy | ok: zadanie „testy macOS” uruchamia kontrole i Jest |
| JAK-18 stan CI | dotyczy | `tests.yml` 43332896326 zielony na c00f5e41; nocny `main` 12.11 czerwony (poza zakresem, rozpatruje koordynator) |

### Zadanie a — dawne `npm run verify` w buildzie vs nowe zadania
Dawne: krok „Testy (jak przed każdym buildem — pełne npm run verify)” w zadaniu `build` w 073fc4aa (`run: npm run verify`). Nowe: `scripts/ci/kontrole.mjs` czyta łańcuch `scripts.verify` z `package.json` i pomija tylko kroki pasujące do `scripts/ci/kontrole.mjs:13` (`jest-ponow`, `verify-znacznik`).

| Krok dawnego `verify` | Gdzie teraz |
|---|---|
| `sprawdz-instalacje.mjs` | kontrole (część 1, `.github/workflows/testflight.yml:90`) |
| `verify-znacznik --czysta` | pominięty (świeży checkout + `npm ci`, kopia czysta z definicji; tak samo w `tests.yml` od ZB-029 T1) |
| typecheck, lint, check:i18n, cues, claims, decyzje, figures, figures-v2, zrodla-runtime, pokrycie, readme, whatsnew-sklep, znaczniki | kontrole (część 1) |
| `node scripts/jest-ponow.mjs` (pełny Jest) | 6 części `--shard=K/6` (`.github/workflows/testflight.yml:94`), podział pełny — test `tests/testflight-testy-czas.test.ts` (ostatni test, `jest --listTests` sumowany po częściach = całość) |
| check:matrix, check:licenses, `expo export --platform ios`, check:bundle, sprzątanie eksportu, `verify:native` | kontrole (część 1) |
| `verify-znacznik --zapisz pelne` | pominięty (znacznik czyta tylko hak lokalny) |

Pozostałe warunki: `fail-fast: false` (`.github/workflows/testflight.yml:74`); `build` ma `needs: [bramka, testy]` (`.github/workflows/testflight.yml:101`), więc porażka którejkolwiek części zatrzymuje build; brak nowych sekretów; `testy` biegnie po bramce E2E. Mutacja: usunięte `testy` z needs — strażnik czerwony (2 testy).

### Zadanie d — liczby
- `testflight_macos`: `czesci_jest: 6`, `limit_tymczasowy_min: 45`, `probka_min: []` → limit zadania 45 (`.github/workflows/testflight.yml:72`), zgodny z regułą testu. Szacunek 18–22 min na część i ok. 8 min kontroli w części 1 jest oznaczony w pliku jako szacunek — rozstrzygnie przebieg dowodowy.
- `max-parallel: 3` (`.github/workflows/testflight.yml:75`) mieści się w `MACOS_MAX_PARALLEL` = 3; zakres strażnika: `tests/macos-max-parallel.test.ts:19` (wszystkie workflowy, zadania `macos*` z `strategy.matrix`) — obejmuje `testflight.yml:testy` (test przeszedł).
- L-080 (gałąź długo żyjąca): oba nowe strażniki czytają drzewo robocze, nie różnicę względem `main` (`tests/modul-glowny-symlink.test.ts:14` — katalogi `scripts`, `docs`; test podziału — `jest --listTests` na drzewie), więc przypadek gałęzi z wcześniejszymi zmianami nie zmienia ich wyniku; powód zapisany w nagłówkach obu testów. Uznane za spełnione z powodem, bez osobnego przypadku testowego.

## Znaleziska

### 07-jakosc-004 · Strażnik zadania `testy` nie wykrywa wyciszenia porażki testów
- Pozycja listy kontrolnej: JAK-09 (z JAK-04)
- Poziom: P2 (ŚREDNIE — nie blokuje; stan workflowu dziś poprawny)
- Realność: teoretyczny dziś, brzegowy przy przyszłej edycji workflowu · Pewność: wysoka
- Rodzaj: D
- Dowód: dawny test w `tests/public-repo.test.ts` kotwiczył krok: `run: npm run verify\s*$` (dopisek `|| true` dawał czerwień). Nowy: `tests/public-repo.test.ts:327` i `tests/testflight-testy-czas.test.ts:46` — `toMatch(/run: node scripts\/jest-ponow\.mjs --shard=/)` bez kotwicy końca linii. Mutacje na kopii c00f5e41, uruchomione: testflight-testy-czas, audit-m1-workflows, ponowienia-workflow, kontrole-ci (41 testów): (1) `... --shard=${{ matrix.czesc }}/6 || true` → kod 0, 41 passed; (2) `continue-on-error: true` w zadaniu `testy` → kod 0; (3) `if: always()` przy `build` → kod 0. Kontrola: (4) `needs: bramka` zamiast `[bramka, testy]` → kod 1, 2 failed.
- Mechanizm: asercja na obecność komendy zamiast na całą linię i na brak klauzul wyciszających; `grep -rn "continue-on-error" tests/` → tylko `tests/e2e-pakiet.test.ts:92` (inny workflow).
- Powraca: nie (nowe osłabienie przy przebudowie kroku)
- Kroki w aplikacji: brak — dotyczy procesu wydania; skutek: build TestFlight z czerwonymi testami, gdyby ktoś wyciszył krok.
- Opcje: (a) w `tests/testflight-testy-czas.test.ts` kotwica `$` na liniach `run:` kontroli i Jest oraz `not.toMatch(/continue-on-error|\|\| true/)` w zadaniu `testy` i `not.toMatch(/if: always\(\)/)` w zadaniu `build` — tanie, lokalne; (b) wspólny strażnik „zadania bramkujące bez wyciszeń” dla wszystkich workflowów (lista zadań w pliku) — szerszy, więcej pracy. Rekomendacja: (a) teraz, (b) do backlogu.
- Test akceptacyjny: każda z mutacji (1)–(3) daje czerwony test.
- Status: otwarte

### 07-jakosc-005 · Detektor kruchego porównania widzi tylko wzorzec w jednej linii
- Pozycja listy kontrolnej: JAK-04
- Poziom: P2 (ŚREDNIE)
- Realność: teoretyczny (dziś 0 wystąpień) · Pewność: wysoka
- Rodzaj: D
- Dowód: `tests/modul-glowny-symlink.test.ts:21` — `kruche` wymaga `argv[1]` i `import.meta.url` w tej samej linii; zakres `tests/modul-glowny-symlink.test.ts:14` — tylko `.mjs` w `scripts/` i `docs/`. Mutacja na kopii: dopisane do `scripts/check-urls.mjs` dwie linie `const self = fileURLToPath(import.meta.url);` / `if (process.argv[1] === self) { }` — strażnik ich nie zgłosił (zgłosił tylko równoległą mutację jednoliniową w `scripts/ci/kontrole.mjs:31`). Stan dziś: wszystkie `argv[1]` poza `jestGlowny` w kodzie (5 trafień) to `endsWith(...)` albo `realpathSync` — odporne na dowiązania.
- Mechanizm: detekcja liniowa; nowy skrypt pisany w stylu „zmienna + porównanie” ominie strażnika.
- Powraca: nie
- Kroki w aplikacji: brak — skrypt CI na macOS kończy się cicho kodem 0 (tak jak w buildzie 1.1).
- Opcje: (a) detekcja na poziomie pliku: plik zawiera `process.argv[1]` porównane operatorem `===` i nie importuje `jestGlowny`/`realpathSync` — tanie, możliwe fałszywe trafienia do wyjątków; (b) zostawić i dopisać do `docs/32` wzorzec „zawsze `jestGlowny`” — bez mechanizmu. Rekomendacja: (a).
- Test akceptacyjny: wariant dwuliniowy z mutacji daje czerwony test; obecne drzewo zielone.
- Status: otwarte

### 07-jakosc-006 · Komentarz w teście podaje 5 części, workflow ma 6
- Pozycja listy kontrolnej: JAK-15
- Poziom: P2 (NISKIE)
- Realność: realny (tylko dokumentacja) · Pewność: wysoka
- Rodzaj: D
- Dowód: `tests/public-repo.test.ts:324` „zadanie testy w 5 częściach”; workflow `.github/workflows/testflight.yml:77` ma 6; tytuł commitu ce02c9fd też „5 częściach” (historia, bez zmiany).
- Mechanizm: liczba przepisana ręcznie zamiast odesłania do `czasy-tests.json` (zasada „liczby w jednym miejscu”).
- Powraca: nie
- Kroki w aplikacji: brak.
- Opcje: (a) zamienić na „w częściach (liczba: scripts/ci/czasy-tests.json)” — bez liczby; (b) poprawić na 6. Rekomendacja: (a).
- Test akceptacyjny: brak liczby części w komentarzach poza `czasy-tests.json` i nazwą zadania.
- Status: otwarte

## Do sprawdzenia
- Czas części na macOS (zwłaszcza części 1: kontrole + `verify:native` + `expo export` + 1/6 Jest) względem limitu 45 min — pierwszy przebieg `testflight.yml` (`bez_wysylki`); po nim wpis do `probka_min`.
- Wymiana pamięci na macOS przy 2 procesach Jest po 4096 MB (krok odczytu `vm.swapusage`, `.github/workflows/testflight.yml:96`) — wynik z tego samego przebiegu.

## Co działa dobrze i należy zachować
- Jedno źródło listy kontroli (`scripts/ci/kontrole.mjs` czyta `scripts.verify`) — nowa kontrola w verify sama trafia do CI.
- Test podziału porównuje sumę części z `jest --listTests` (wyrocznia niezależna od workflowu) i ma dolną granicę 700 plików.
- Parytet eksportu: test liczy raz ścieżką produkcyjną (bez `--skroty`) i porównuje z plikiem skrótów (`tests/strona-eksport-recenzja.test.ts:99`); domyślne `skroty = {}` w `scripts/strona/eksport.mjs:45` i `scripts/strona/recenzja-figur.mjs:19` zachowuje dawną ścieżkę. Pozostałe asercje testu bez zmian (zmienione tylko źródło skrótów: `skroty()` → `skrotyRaz()`, ta sama funkcja liczona raz).
- `jestGlowny` porównuje ścieżki realne obu stron i zwraca fałsz przy błędzie; test sprawdza dowiązanie do katalogu, do pliku i import (mutacja bez `realpathSync` — test czerwony).

## Decyzje dla właściciela
Brak decyzji blokujących. Koordynator: czy 07-jakosc-004 i 005 naprawić przed scaleniem (tanio, opcje (a)), czy do backlogu 1.1.x. Rekomendacja: 004 przed scaleniem (dotyczy bramki wydania), 005 i 006 do backlogu.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 07-jakosc --tryb fix --zadania 07-jakosc-004,07-jakosc-005,07-jakosc-006` — potem przebieg dowodowy `testflight.yml` (`bez_wysylki`) na SHA gałęzi.

## Stan kopii roboczej
Na początku i na końcu recenzji `git status --porcelain` puste (pliki śledzone nietknięte; mutacje tylko w kopiach `git worktree` poza repo, usunięte).
