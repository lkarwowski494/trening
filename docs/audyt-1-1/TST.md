# Raport TST — jakość testów i bramek (audyt 1.1, W-10, commit 79117f33)

Rola: 07-jakosc. Soczewka: sceptyk szukający testu, który nie może paść; programista, który jutro zmieni kod.
Kopia robocza: worktree 79117f33 (detached), usunięta po pracy. Materiały: `testy-TST/` (obok tego raportu).

## Zakres i pokrycie

Przeczytano / uruchomiono:
- (1) Mutanty ręczne: 18 mutantów w 4 obszarach ryzyka wysokiego — `lib/state/migrate.ts` (migrate), `lib/backup.ts` (parseBackup, rotacja kopii), `lib/access.ts` (dostęp po zakupie / limit dni), `lib/stats.ts` (`e1rm`, `e1rmR`). Zestawy testów: pliki `tests/` wywołujące daną funkcję (migrate: `migrate(` + lista MUT_TESTS z nightly.yml, 65 plików; backup: parseBackup/importBackup/autoBackup/AUTO_KEEP, 63; access: importy `lib/access`/`lib/entitlement`, 39; e1rm: 41). Przebiegi bazowe (bez mutanta) zielone dla wszystkich 4 zestawów. Harness: `testy-TST/uruchom.mjs`, definicje (diff = pole old/new): `testy-TST/mutanty.json`, wyniki: `testy-TST/wynik3.txt` (wiarygodne), logi: `testy-TST/log-*.txt`.
- (2) Powtarzalność: grep `Date.now()`, `new Promise(r => setTimeout(...))`, asercje czasu; `tests/global-setup.js` (TZ), `tests/straznik-zegar.test.ts`, `.github/workflows/tests-tz.yml`, `scripts/ci/przejscia-czasu.js`.
- (3) Bramki CI: `tests.yml`, `nightly.yml`, `e2e-ios.yml`, `testflight.yml`, `tests-tz.yml`, `scripts/jest-ponow.mjs`, `scripts/ci/kontrole.mjs`, `scripts/ci/bramka-e2e.sh`, `scripts/ci/poprzednia-wersja.sh`, `package.json` (verify*).
- (4) Deklaracje: `node scripts/test-matrix.mjs --check` (kod 0: 2872 pozycji, bez testu 0), `node scripts/readme.mjs --check` (kod 0), `wc -l CLAUDE.md` = 159 linii (33 752 B), README tabela liczb, CLAUDE.md, `scripts/ci/czasy-tests.json`.
- (5) E2E: `.maestro/` (50 scenariuszy + config), `scripts/ci/e2e-podstawowy.json`, przebiegi `e2e-ios.yml` (API GitHub), lista wydań GitHub z `Trening-sim.zip`.
- (6) Przebieg `tests.yml` 43078373167 (e2ee07fc) — API GitHub.

Nie przeczytano: docs/09 i docs/19 w całości (tylko liczby i wynik `--check`), wyników Strykera z nocy (podsumowanie kroku niedostępne przez API), treści wszystkich 68 plików z niezapiętym `Date.now()`.

## Wyniki części (1) — mutanty

| ID | Plik | Mutacja | Wynik | Test zabijający (pierwszy) |
|---|---|---|---|---|
| M1 | migrate.ts:68 | `schemaVersion >= 11` → `>= 12` (lb dawnych kopii) | zabity | matrix-migrations „drabina migracji … schemat 11” |
| M2 | migrate.ts:96 | filtr pustych sesji → `length >= 0` | zabity | regress R60-02 |
| M3 | migrate.ts:113 | nowszy wpis poranny `>` → `<` | zabity | regress R17-02 |
| M4 | migrate.ts:125 | masa ciała `w <= 1000` → `w < 1000` | **przeżył** | — |
| M5 | migrate.ts:138 | usuwa zarchiwizowane ćwiczenia z historią (`|| used.has`) | zabity | regress R51-01 |
| B1 | backup.ts:161 | `ver > SCHEMA_VERSION` → `> SCHEMA_VERSION + 1` | zabity | matrix-data-fuzz „schemat z przyszłości” |
| B2 | backup.ts:156 | `lv.seq >= st.saveSeq` → `>` | **przeżył** | — (mutant równoważny, niżej) |
| B3 | backup.ts:160 | wersja tylko z koperty (goły stan z nowszej wersji) | zabity | matrix-data-fuzz (fast-check) |
| B4 | backup.ts:78 | rotacja `slice(AUTO_KEEP)` → `+1` | zabity | regress Q-014 |
| A1 | access.ts:94 | `now < end` → `now <= end` (aktywne w chwili wygaśnięcia) | zabity | maestro-zycie (odtworzenie scenariusza 35) |
| A2 | access.ts:110 | karencja offline `<` → `<=` | zabity | access.test „karencja” |
| A3 | access.ts:253 | `used < limit` → `<=` (6. dzień za darmo) | zabity | maestro-zycie (35) |
| A4 | access.ts:206 | dzień treningowy `> 7 min` → `>=` | zabity | audit-m1-044-brd RD-06 |
| A5 | access.ts:145 | `freeSince`: `end > now` → `>=` | **przeżył** | — |
| E1 | stats.ts:24 | e1RM do 10 powt. `>` → `>=` | zabity | regress R73-03 |
| E2 | stats.ts:65 | Epley `/30` → `/31` | zabity | regress R26-01 |
| E3 | stats.ts:65 | `reps > 0` → `>= 0` | zabity | regress R1-11 |
| E4 | stats.ts:65 | zaokrąglenie 1e-6 → 1e-2 | zabity | matrix-dim-metrics |

Wynik: 15/18 zabitych. Ocena 3 ocalałych:
- B2 — mutant równoważny: pełny zapis (`lib/state/core.ts:78–83`) daje `state.saveSeq` i `live.seq` ten sam numer, a `state` zawiera już te same `active`/`timer`; przy równości wynik jest identyczny. Nie luka.
- M4 — granica 1000 kg masy ciała w porannym wpisie: teoretyczny (tylko ręczna edycja pliku), jedna linijka.
- A5 — granica jednej milisekundy (koniec uprawnienia dokładnie w `now`): praktycznie równoważny. Jedna linijka.

Uwaga metodyczna (nie znalezisko aplikacji): pierwszy przebieg z `--runInBand` na 39–65 plikach kończył się `FATAL ERROR: … JavaScript heap out of memory` (kod 134) i harness liczył to jako „zabity”. Wyniki z tego przebiegu (`testy-TST/wynik.txt`) są NIEWIARYGODNE dla M1, M4, B1, B2; powtórzone na `--maxWorkers=2` (`wynik3.txt`). Ostrzeżenie dla kolejnych audytorów: `--runInBand` tylko dla pojedynczych plików (jak w CLAUDE.md), i „zabity” liczyć tylko z nazwaną porażką asercji.

Wniosek: testy logiki ryzyka wysokiego są silne — wszystkie mutanty z realnym skutkiem dla użytkownika (utrata historii, przyjęcie kopii z nowszej wersji, rotacja kopii, limit darmowych dni, karencja, e1RM) giną. Kilka zabija tylko jeden test pośredni (A1, A3 — test odtwarzający scenariusz Maestro `maestro-zycie`; E2 — jeden test remisu) — sprawne, ale wąskie.

## Znaleziska

### TST-01 — Test aktualizacji przed 1.1 nie instaluje wersji z App Store (1.0.0 b1033), a nie da się jej wskazać jawnie
- **Waga:** WYSOKIE (bramka wydania W-15 na ścieżce ryzyka utraty danych przy aktualizacji jest niewykonalna w obecnej postaci). **Realność:** realny — każdy użytkownik 1.0.0 aktualizuje się z b1033.
- **Kroki:** uruchomić `e2e-ios.yml` (pakiet pełny albo podstawowy) na kandydacie 1.1 bez wejścia `poprzednia_wersja_z_przebiegu` → krok „Aktualizacja — wybór poprzedniej wersji”.
- **Dowód:**
  - `scripts/ci/poprzednia-wersja.sh`: bierze PIERWSZE wydanie z listy `repos/$REPO/releases?per_page=30` (kolejność od najnowszego), które ma `Trening-sim.zip`, ma wersję ≤ `package.json` (`1.0.1` na 79117f33) i inny SHA niż testowany.
  - Lista wydań (API, 11.11.2026): `v1.0.1-b1037` (06.11), `v1.0.1-b1035` (31.10), `v1.0.0-b1033` (29.10) — wszystkie z `Trening-sim.zip`. Dla 79117f33 skrypt wybierze **b1037** (build tylko właściciela, docs/49:14); na 1f339f4c (= tag b1037, ostatni E2E integracji 42285310215) wybrał **b1035**. b1033 nie jest wybierane nigdy, dopóki istnieją nowsze pliki.
  - Jedyna droga ręczna: wejście `poprzednia_wersja_z_przebiegu` = numer przebiegu z artefaktem `trening-sim-app` (`e2e-ios.yml:41–42, 258–259`), a artefakty mają `retention-days: 1` (`e2e-ios.yml:117,122,…`); przebieg na tagu b1033 (42243578715, 06.11) ma już wygasły artefakt. Wejścia z tagiem wydania nie ma.
  - Opis wejścia jest też nieaktualny: „Pusty = ostatni zielony przebieg na main … gdy wygasł, test aktualizacji jest pomijany z ostrzeżeniem” (`e2e-ios.yml:42`), a kod od M1-062 bierze plik wydania i przy braku kończy się porażką.
- **Mechanizm:** jedno miejsce wyboru (`poprzednia-wersja.sh`); ten sam skrypt służy nocnemu pełnemu katalogowi — tam także testowana jest aktualizacja z najnowszego pliku, nie z wersji w sklepie.
- **Rozstrzyga [DO USTALENIA] W-15 (docs/49:53, 134):** przebieg NIE instaluje b1033.
- **Propozycja naprawy (opcje dla koordynatora):** A (rekomendacja) — nowe wejście `poprzednia_wersja_tag` (np. `v1.0.0-b1033`) przekazywane do `poprzednia-wersja.sh` jako filtr; przebieg dowodowy pokazuje w logu „Poprzednia wersja: 1.0.0 (build 1033)” (`e2e-ios.yml:282` już to wypisuje). B — domyślnie wybierać wydanie oznaczone w repo jako „w App Store” (jedno miejsce, np. plik w `scripts/ci/`), a najnowsze tylko jako drugi przebieg. Wykonalność: `poprzednia-wersja.sh` jest ~20 linii, wejście dodaje się w `on.workflow_dispatch.inputs` i `workflow_call.inputs` (`e2e-ios.yml:24–67`).
- **Test akceptacyjny:** test skryptu (wzór istniejących testów `scripts/ci`) — przy liście wydań [b1037, b1035, b1033] i wejściu `v1.0.0-b1033` pobierany jest plik b1033; bez wejścia zachowanie bez zmian; przebieg dowodowy `e2e-ios.yml` z `tylko_scenariusze: "33 34"` z logiem build 1033.

### TST-02 — Kandydat 1.1 bez E2E i bez testów stref czasowych od ok. 900–1400 commitów; testy stref nie są bramką 1.1
- **Waga:** ŚREDNIE (sygnał, który już istnieje, nie trafia na kandydata; same bramki W-15 i tak wymuszą E2E). **Realność:** realny (zmiany w kodzie zależnym od daty i strefy w 1.1).
- **Dowód:**
  - Ostatni E2E na `integracja-1-1`: 42285310215 (pakiet podstawowy, 1f339f4c, 06.11) — `compare 1f339f4c...79117f33`: 902 commity do przodu (API).
  - `tests-tz.yml` (7 stref + przypięte chwile zmiany czasu) biegnie nocą tylko dla `NIGHTLY_REFS` (domyślnie `main`, `tests-tz.yml:31,74`); ostatnie 6 nocy: tylko `main`. Ostatni przebieg na integracji: 41400900312 (40a459ea, 02.11) — 1432 commity wstecz.
  - docs/49 (W-13…W-18) nie wymienia `tests-tz.yml` jako bramki kandydata (grep „tz”/„strefy” w docs/49: brak).
- **Propozycja:** dopisać do docs/49 krok „`tests-tz.yml` (workflow_dispatch) zielony na SHA kandydata” obok W-13/W-14; albo ustawić `NIGHTLY_REFS` na `["main","integracja-1-1"]` do wydania.
- **Test akceptacyjny:** zielony przebieg `tests-tz.yml` z `head_sha` kandydata (10 zadań: 7 stref + 3–4 chwile).

### TST-03 — Nieaktualne deklaracje o CI w CLAUDE.md i komentarzu tests.yml (JAK-15)
- **Waga:** NISKIE. **Realność:** realny dla agentów planujących pracę.
- **Dowód:** CLAUDE.md:16 „testy biegną w `tests.yml` na 4 maszynach”, „ok. 14 min — kontrole i 4 części Jest”; `tests.yml:6` „w czterech częściach”, `:7`/`:72` itd.; stan: `scripts/ci/czasy-tests.json` `"czesci_jest": 5`, `tests.yml:42` `czesc: [1, 2, 3, 4, 5]`; przebieg 43078373167 trwał 15,5 min (18:30:13–18:45:45). Opis wejścia `poprzednia_wersja_z_przebiegu` (`e2e-ios.yml:42`) — jak w TST-01.
- **Propozycja:** liczbę części i czas w CLAUDE.md/komentarzu brać z `czasy-tests.json` (zasada „liczby w jednym miejscu”); strażnik: test porównujący „N części” w CLAUDE.md i tests.yml z `czesci_jest`.

## Do sprawdzenia (pewność ≤ 80%)
- `tests-tz.yml` zadanie „chwile” robi checkout bez `ref: matrix.ref` — chwile liczy skrypt z gałęzi domyślnej, nie z testowanej. Przy zmianie `przejscia-czasu.js` na gałęzi przebieg ręczny użyje starej wersji. Wpływ niski; nie sprawdzono, czy gałąź domyślna to `main`.
- 68 plików testów używa `Date.now()` bez przypięcia zegara (strażnik `tests/straznik-zegar.test.ts` łapie tylko kalendarz z `new Date()` i asercje czasu wykonania). Nocne przebiegi z przypiętą chwilą zmiany czasu i w 7 strefach są zielone na `main`, więc brak dowodu niestabilności — ale na kodzie 1.1 tego nie sprawdzono (TST-02).

## Co działa dobrze
- **Siła testów**: 15/18 mutantów zabitych, 3 ocalałe równoważne lub teoretyczne (tabela wyżej). Nocny Stryker obejmuje te same moduły (`stryker.config.json` `mutate`, `nightly.yml:81`).
- **tests.yml = verify**: `kontrole` wylicza kroki z `package.json` `scripts.verify` (`scripts/ci/kontrole.mjs`, pomija tylko `jest-ponow` i `verify-znacznik`), Jest przez `jest-ponow --shard`; zbiorcze `verify` zielone tylko gdy oba zielone (`tests.yml:66–78`, `always()` + `test … = success`). Brak `|| true`, `continue-on-error`, `--passWithNoTests`, `--forceExit` w tests.yml. testflight.yml uruchamia pełne `npm run verify` (`testflight.yml:99`) i bramkę E2E na tym samym SHA (`scripts/ci/bramka-e2e.sh`).
- **jest-ponow**: ponawia raz tylko pliki przerwane sygnałem/OOM lub padłe WYŁĄCZNIE na „Exceeded timeout”; jakakolwiek inna porażka = czerwone bez ponowienia; brak pliku wyniku = czerwone (`scripts/jest-ponow.mjs`, `werdykt`, `czyLimitCzasu`).
- **`continue-on-error` / `|| true`** występują tylko w miejscach niewiążących z opisem: eksperymenty E2E, pobranie raportów do podsumowań, `simctl terminate/uninstall/boot`, krok plików wydania po tagu (`testflight.yml:288`).
- **E2E ponowienia**: jedno ponowienie pojedynczego scenariusza, tryb ścisły bez ponowień, ponowny start tylko przy „driver not ready” (`e2e-ios.yml:216–248`), strażnik czasu na grupę procesów.
- **Strefy i DST**: TZ testów ustalona (`tests/global-setup.js`), chwile zmiany czasu WYLICZANE (`node scripts/ci/przejscia-czasu.js macierz` → 2027-10-31, 2027-03-28, 2027-11-07 LA, 2027-01-03), lista stref pilnowana `tests/matrix-time.test.ts:97`.
- **Deklaracje**: `test-matrix --check` i `readme --check` kod 0; README zgodne ze stanem w liczbach macierzy, scenariusze Maestro 50 (46 + 4 eksperymentalne) zgodne z `.maestro/`.
  - Drobna rozbieżność: `ls tests/*.test.ts*` = 807, README „Pliki testów Jest | 806”, a `readme.mjs --check` przechodzi — możliwe, że skrypt liczy inaczej (np. pomija plik pomocniczy). Nie zgłaszam jako znalezisko.
- **Przebieg (6)**: `tests.yml` 43078373167 dla e2ee07fc — `success` (kontrole + 5 części Jest + verify). 79117f33 ma własny przebieg 43082632634 **anulowany** (concurrency, kolejne wypchnięcie 0fa2f448), ale drzewo 800043f8 = drzewo e2ee07fc (`git diff e2ee07fc 800043f8` pusty), a 79117f33 zmienia tylko `docs/40-lekcje.md` (1 linia) — wynik zielony obejmuje kod badanego commitu.
- **Pakiet podstawowy E2E** (14 scenariuszy) pokrywa przepływy danych i zakupu; kopia/przywrócenie (42) i uszkodzona baza (60) to wciąż eksperymenty (niewiążące) — wiadome z `e2e-podstawowy.json` „_opis”/36.

## Nie sprawdzono
- Wynik nocnego Strykera dla `access`, `backup`, `state/migrate` (podsumowanie kroku niedostępne przez API) — krok: pobrać artefakt `mutacje-*` z najbliższego przebiegu nightly na kandydacie.
- Czy b1033 → 1.1 na symulatorze zachowuje dane (wymaga TST-01 + przebiegu na macOS).
- `NIGHTLY_REFS` (zmienna repo) — API zwraca 403 przez proxy; wniosek o `main` z listy przebiegów.
- Pełna liczba plików różnicy (API compare ucina na 300 plikach); liczby commitów są pełne.
