# Audyt 0.10.0 — testy, dokumentacja, CI (TST)

Raport źródłowy audytora z 08.10.2026 (commit d2a1e85), bez zmian treści. Zbiorczo: [docs/25](../25-audyt-0.10.md). Ścieżki do plików roboczych (worktree, scratchpad) dotyczą sesji audytu — pliki nie są w repozytorium.

## Zakres i pokrycie

Audyt dotyczył commita **d2a1e85**. Worktree powstał najpierw z f435c8c, potem koordynator przełączył go na d2a1e85. Wcześniej rozpakowałem d2a1e85 przez `git archive` do scratchpadu (`tst-d2a1e85/`), więc wszystkie analizy są z właściwego kodu. W repo nic nie zmieniłem: `git status` pokazuje tylko nieśledzone pliki `tests/zz-audit-tst-*`.

- **Testy (152 pliki):** 144 zestawy i 8 plików pomocniczych. Statycznie (parser TS) 1724 bloki `test`/`it`; CI dla d2a1e85 (run 37793325265) wykonuje 2584 testy, 1 pominięty celowo (`replay`). Szukałem: bloków bez `expect`, `skip`/`only`, `expect(getBy…).toBeTruthy`, asercji pod warunkiem (105), w pętli (345) i w callbackach (27), testów zależnych od zegara i od kolejności, testów czytających kod źródłowy. Sprawdziłem atrapy w `tests/setup.js` i `tests/app.tsx`.
- **Mutacje (ręczne):** 52 mutanty w 11 modułach: generator, plan, deload, deload-sets, backup, timer, store (migrate i pauza), period, dashboard, whatsnew, planReminder. Każdy mutant szedł najpierw na testy modułu, a przeżywający dodatkowo na szerszy zestaw (grep po nazwie). Wynik: **26 zabitych, 6 równoważnych, 20 przeżyło** (zabite 26/46 = 57% bez równoważnych).
- **Macierz:** `test-matrix.mjs --check` przechodzi (rc 0, 1282 pozycje). Dodatkowo przeliczyłem dowody bez komentarzy i importów oraz tylko po literałach w testach.
- **Definicja ukończenia (docs/20):** 18 wierszy funkcji z 07–08.10 w docs/09 (wiersze 186–196 i 205–212) zestawione z faktycznymi plikami testów.
- **E2E:** 14 scenariuszy, podprzepływ i `config.yaml`; selektory dosłowne porównane ze słownikiem EN; sprawdzone, co każdy scenariusz faktycznie weryfikuje.
- **CI:** wszystkie 8 workflowów. Przez `gh` (tylko odczyt) przejrzałem ostatnie przebiegi, w tym jedyne przebiegi `nightly` i `tests-tz`.
- **Dryf dokumentacji:** CLAUDE.md, README, docs/09, 14, 16, 18, 20, 21, 24.
- **Przestarzałe nazwy:** grep po całym repo (kod, testy, docs, 26 słowników, assets, app.json, package-lock) dla: Tektur, Archivo, Kreda, widżet, poranny wpis, waga, Strong/Hevy, „Pierwszy raz?”, „Usuń”/„− seria”, moduły, Historia.
- **Uruchomienia:**
  - ziarno z nocnego przebiegu odtworzone na d2a1e85;
  - 13 plików testów dat w 4 skrajnych strefach;
  - 12 plików nowych funkcji w losowej kolejności;
  - 6 przebiegów `pause.test.tsx` z losowaniem kolejności;
  - `gen.mjs --check` i `check-i18n`.

## Znaleziska

### TST-01 — Testy nocne i strefowe nigdy nie objęły gałęzi wydania 0.10.0, a porażki z 08.10 przeszły bez reakcji
**Waga:** WYSOKA

**Dowód (POTWIERDZONE):**
- `nightly.yml:10-11` i `tests-tz.yml:10-11` uruchamia tylko harmonogram, a ten działa z gałęzi domyślnej `main`. Gałąź domyślna to `main` (`gh api`).
- Każdy workflow ma w historii jeden przebieg, oba na `main` = f435c8c, czyli 61 commitów za d2a1e85. Na `feature/e2-swap` nie było żadnego.
- `nightly` run 37720124756 (08.10, 02:54 UTC): **wszystkie 3 zadania nieudane.**
  - **losowe:** `MATRIX_SEED=426708283` → „krok 15: rememberAlt: zamiennik wskazuje usunięte ćwiczenie”. Odtworzyłem na d2a1e85 (`MATRIX_SEED=426708283 MATRIX_RUNS=400`, „Property failed after 352 tests”). Skrócony kontrprzykład: start → `swap` na ćwiczenie X → `delEx` X (archiwum, bo jest w treningu) → `rememberAlt`. Przyczyna z kodu: `canRememberAlt` i `rememberAlt` (`lib/store.ts:1043-1050`) nie odrzucają zarchiwizowanego ćwiczenia.
  - **mutacje:** „ERROR DryRunExecutor: Initial test run timed out!” po 5 min (domyślny `dryRunTimeoutMinutes`, którego brak w `stryker.config.json`). Raport nigdy nie powstał, kolejny krok padł na „Cannot find module report.json”.
  - **E2E (iPhone 17e, ciemny):** 2/11 nieudane (10 Gumy, 07 Zamiana: „Search exercises…” niewidoczne). Prawdopodobnie ta sama przyczyna, którą na `feature/e2-swap` poprawiono po run 37730170793 (centerElement). Na małym ekranie nikt tego nie sprawdził.
- docs/09 i docs/18 nie wspominają tych porażek. docs/09:211 odkłada ryzyko małego ekranu „do sprawdzenia w nocnym przebiegu”, który tej gałęzi nie uruchamia.

**Opis i skutek:** Losowe sekwencje z nowym ziarnem, 7 stref czasowych, mutacje i E2E na małym ekranie nie testują kodu, który idzie do wydania. Jeśli coś znajdą (jak 08.10), nikt tego nie widzi. Przy każdym wypchnięciu losowe sekwencje biegną na stałym ziarnie, więc nie szukają nowych przypadków. Sam znaleziony błąd ma mały skutek: zamiennik w szablonie wskazuje usunięte ćwiczenie, `migrate` usuwa go przy restarcie. Za to luka w procesie jest ogólna.

**Propozycja:**
- **A:** w `nightly.yml` i `tests-tz.yml` matryca `ref` ze zmiennej repozytorium (np. `NIGHTLY_REFS=main,feature/e2-swap`) plus `checkout ref:`; przy porażce `gh issue create` (wymaga `issues: write`).
  - plus: pełny zakres co noc na właściwej gałęzi i widoczny ślad porażki;
  - minus: trzeba pamiętać o liście gałęzi.
- **B:** do `tests.yml` dodać zadanie z `MATRIX_SEED=random MATRIX_RUNS=200` i dwie skrajne strefy.
  - plus: wynik przy każdym wypchnięciu;
  - minus: ok. 10 min dłużej (darmowe), a losowe porażki mogą trafić na niezwiązane commity (ziarno jest w logu).
- **Rekomendacja: A.** Do tego:
  - test regresji z kontrprzykładem i poprawka `canRememberAlt`, który ma odrzucać `archived`;
  - w `stryker.config.json` `dryRunTimeoutMinutes: 30` i `thresholds.break`;
  - wpis do docs/09 z wynikami nocnych przebiegów.

### TST-02 — Mutacje: 20 przeżyło, plan tygodnia ma najsłabsze testy (3/10 zabitych)
**Waga:** WYSOKA

**Dowód (POTWIERDZONE):** wyniki w `scratchpad/tst-mut1.txt` i `tst-mut2.txt`.

| Moduł | Zabite / bez równoważnych | Przeżyły (realne) |
|---|---|---|
| `lib/plan.ts` (testy: 9 plików importujących) | **3/10** | `tidy` −60→−30 dni; `activatePlan` zostawia dzisiejszą zmianę (`<`→`<=`); okno przeniesienia 6→5; `backToBack` bez pary (dzień przed, start); okno powrotu +1; `futureChanges` bez dziś; `SHIFT_MAX_DAYS` 14→7 (limit nigdy nietestowany) |
| `lib/generator.ts` | 2/5 | core bez przerwy izolacji (90 s), osiągalne przy 90 min; próg braków `<10`→`<=10`; `plate_loaded_machine` nie oznacza siłowni |
| `lib/timer.ts` | 3/7 | `T.total` może być ujemne; okno odtworzenia 1→2 h; alarm `<=0`→`<0`; `Math.max(1→0)` sekund powiadomienia (atrapa przyjmuje 0, TST-06) |
| store (migrate, pauza) | 6/8 | limit `deloadWeeks` 520→52 tygodni; limit `savedPlans` 50→5 (cicha utrata danych przy mutancie) |
| backup | 6/7 | czas w CSV: `round`→`floor` |
| period / dashboard / whatsnew | 1/3 | trening dokładnie o północy poniedziałku liczony w dwóch tygodniach (`<`→`<=`); szablon w archiwum zalicza krok 1 „Pierwszych kroków” |
| planReminder | 2/3 | termin za < 60 s planowany |
| deload | 3/3 | — |

Równoważne (nie liczę ich jako luki): G1 i G3 (przy obecnych podziałach niedziela to tylko cardio, a cardio jest raz), D3 (`deloadHint` wcześniej zwraca `current`), B4 (przy równym numerze zapisu „state” i „live” są identyczne), T6 (praktycznie nieosiągalny), S9 (`cleanPauses` wyklucza ujemne przedziały).

**Opis i skutek:** Granice liczbowe (dni, limity, okna) w nowych modułach przeważnie nie mają testu. Zmiana stałej albo operatora porównania przejdzie zielono. docs/09:92 podaje wynik Strykera z 01.10 (stats 88%, units 83%), ale od tamtej pory `lib/stats.ts` zmieniło się w 10 commitach, a nocny Stryker nie działa (TST-01).

**Propozycja:** po jednym teście granicznym na każdy z 20 mutantów z tabeli. `mutate` w Strykerze rozszerzyć o `plan`, `generator`, `deload*`, `planReminder`, `period`, `backup`, uruchamiane nocą na gałęzi wydania (po naprawie TST-01).

### TST-03 — Definicja ukończenia nie jest spełniona dla funkcji z 07–08.10 i brak zapisanych powodów
**Waga:** WYSOKA

**Dowód:**
- **Niezmienniki (POTWIERDZONE):** alfabet działań losowych sekwencji (`tests/matrix-invariants.test.ts:33-51`) ostatnio zmieniono 06.10 (f59d36e). Nie ma w nim akcji dla planu tygodnia, przesunięć i propozycji, kilku planów, generatora, pauzy, tygodnia deload, „Pomiń dziś” ani folderów i archiwum. Testy `matrix-migrations`, `matrix-data-fuzz`, `roundtrip` i `migrate-idem` nie zawierają nowych pól stanu (`weekPlan`, `planOverrides`, `savedPlans`, `pauses`, `deloadWeeks`, `guideSeen`, `whatsNewSeen`).
- **Języki i wygląd (Z KODU):** `matrix-a11y.test.tsx:52-55` (nazwy VoiceOver, kontrast, Dynamic Type) i `matrix-dim-langs*.test.tsx:39` (26 języków × motywy) obejmują tylko stare trasy. Brak `/plan`, `/generator`, `/guide`, `/swap`, `/picker`, `/reorder`, `/history/add`. Testy nowych funkcji sprawdzają najwyżej `en`.
- **Zapis powodów (heurystyka po słowach w docs/09):** w 18 wierszach funkcji brakuje słowa „Macierz” w 16, „Scenariusz” w 17, „Niezmienniki” w 14. „Nie dotyczy” nie występuje w żadnym z nich. Jedyny zapisany powód pominięcia to E2E przypomnienia (wiersz 208).

**Skutek:** Zasada z docs/20 („brak rodzaju wymaga zapisanego powodu”) nie jest przestrzegana. Losowe sekwencje i eksport/import nie mieszają nowych danych z resztą działań, a nowe ekrany nie przechodzą kontroli dostępności i języków.

**Propozycja:**
- **A:** rozszerzyć alfabet o akcje i niezmienniki tych funkcji, np.:
  - plan wskazuje żywe szablony albo null;
  - klucze zmian dni to daty;
  - pauzy mieszczą się w czasie treningu;
  - tygodnie deload to poniedziałki;
  - generator nie rusza istniejących szablonów.

  Do tego test, który generuje listę tras z `app/` (jak EKRAN w `test-matrix.mjs`) i wymaga ich w `matrix-a11y` i macierzy języków.
- **B:** dopisać w docs/09 powody „nie dotyczy”. Taniej, ale sprzeczne z celem zasady właściciela.
- **Rekomendacja: A.**

### TST-04 — Sekrety w zasięgu kodu zależności w `iphone-eas.yml` i `iphone-local.yml`
**Waga:** WYSOKA. Nie daję KRYTYCZNEJ, bo do wycieku potrzebna jest skompromitowana zależność npm; logi i forki nie są narażone.

**Dowód (Z KODU):**
- `iphone-eas.yml:28-32`: `EXPO_TOKEN` i identyfikatory ASC w `env` całego workflowu.
- `iphone-eas.yml:58`: klucz `.p8` (Admin) zapisany na dysk **przed** `npm ci` (linia 60) i `npm test` (linia 63).
- `iphone-local.yml:26`: `EXPO_TOKEN` w `env` całego workflowu, także dla `npm ci` (47) i testów (49).
- Dla porównania `testflight.yml` naprawiono 06.10 (klucz zapisywany dopiero po prebuild i pod install). `tests/public-repo.test.ts` pilnuje tego tylko dla testflight.

**Skutek:** Skrypt instalacyjny dowolnej zależności albo kod testu może odczytać token Expo i klucz App Store Connect.

**Propozycja:**
- **A:** sekrety tylko w `env` kroków, które ich potrzebują; `.p8` zapisywany tuż przed użyciem; `npm ci --ignore-scripts` tam, gdzie to możliwe; strażnik w `public-repo.test.ts`.
- **B:** usunąć oba workflowy, skoro drogą instalacji jest TestFlight (docs/15). Zostaje wtedy do sprzątnięcia sekret `ASC_API_KEY_P8` i `EXPO_TOKEN`.
- **Rekomendacja:** B, jeśli właściciel potwierdzi rezygnację z EAS; w przeciwnym razie A.

### TST-05 — Macierz testów sprawdza wzmiankę, nie zachowanie; wymiary to ręczna lista 13 pozycji
**Waga:** ŚREDNIA

**Dowód:**
- **POTWIERDZONE:** dowodem jest dowolny ciąg w pliku testu, także w komentarzu i tytule (`test-matrix.mjs:58-60, 73-75`). Po usunięciu komentarzy (parser TS) 6 pozycji ma „test” tylko w komentarzach:
  - UI: „↺ cofnij”, „Sprzęt”;
  - TEKST: „Edycja sesji”, „Trening wstecz”, „Z szablonu”, „sam gryf”.
  - Dodatkowo Maestro jest liczone po polskich tekstach, które w YAML są wyłącznie w komentarzach.
- **Z KODU, LOGIKA:** wystarczy nazwa funkcji gdziekolwiek w teście. Przykłady: `relabel` i `onWorkoutSaved` występują tylko w tytułach testów.
- **Z KODU, WYMIAR:** to ręczna lista `DIMS` (13 pozycji) plus znacznik w komentarzu `@matrix X`. Nie ma w niej nowych list wartości: cele, sesje i minuty generatora (`GEN_SESSIONS`, `GEN_MINUTES`), `GUIDE`, `WHATS_NEW`, `PARTS`, skala RPE/RIR, `PeriodKind`, `DayStatus`.
- `DIMS` i docs/20:14 wskazują nieistniejący plik `tests/matrix-dimensions.test.tsx`.
- CLAUDE.md powołuje się na `tests/matrix-exceptions.json`, którego nie ma (skrypt to obsługuje).

**Skutek:** Zapis „każdy element ma test” jest mocniejszy niż to, co bramka sprawdza. Nowe wymiary nie trafiają do macierzy automatycznie.

**Propozycja:**
- **A:** dowód tylko z literałów w testach (parser TS); dla UI wymagać zapytania o ekran (`getBy*`/`tap`); wymiary generować z eksportowanych tablic `as const` z `lib/` z wyjątkami z powodem.
- **B:** poprawić tylko sformułowania w CLAUDE.md i docs/20.
- **Rekomendacja: A**, etapami.

### TST-06 — Atrapy ukrywają realne ścieżki: przypomnienie z planu nigdy nie prosi o zgodę na powiadomienia
**Waga:** ŚREDNIA

**Dowód (Z KODU):**
- W `tests/setup.js` `getPermissionsAsync` i `requestPermissionsAsync` zawsze zwracają `granted: true`, a `scheduleNotificationAsync` przyjmuje dowolny trigger. Dlatego przeżył mutant T8 (sekundy = 0).
- `components/PlanReminderSync.tsx` i `syncPlanReminders` nie sprawdzają zgody. Zgoda jest pobierana tylko w `ActiveWorkout.tsx:40` i przyciskiem w Ustawieniach.
- Przypomnienie jest domyślnie włączone. Nowa osoba, która idzie za „Pierwszymi krokami” (szablon, potem plan) przed pierwszym treningiem, nie dostanie przypomnień i nic jej o tym nie powie. `plan-reminder.test.tsx` nie ma przypadku braku zgody, a docs/09:208 opisuje prośbę o zgodę tylko przy włączaniu przełącznika.
- Atrapa SQLite ignoruje tekst zapytań SQL (`runAsync` traktuje każde zapytanie jako upsert albo delete).

**Propozycja:** w atrapie wariant „brak zgody” i walidacja triggerów (seconds ≥ 1, DATE w przyszłości). Sama poprawka to decyzja produktowa:
- **A:** zapytać o zgodę przy pierwszym zapisie planu z włączonym przypomnieniem.
- **B:** pokazywać w Kalendarzu i Ustawieniach informację, że brak zgody.
- **Rekomendacja:** A, a B jako uzupełnienie.

### TST-07 — Instrukcje agenta i README kierują na workflow, który zużywa wyczerpany limit Expo; domyślne ustawienia zużywają limit
**Waga:** ŚREDNIA

**Dowód (Z KODU):**
- CLAUDE.md:6 i :27 mówią „używaj `iphone-local.yml` (`eas build --local` + `eas upload`)”, a README:60 i :72 „bez limitu Expo”. Według docs/15:159-161 `eas upload` zużywa darmowy limit, wyczerpany do 01.11.2026; obowiązuje `testflight.yml`, o którym README w ogóle nie wspomina.
- `iphone-local.yml:18` ma domyślnie `wyslij: true`, a `iphone-eas.yml:22` domyślnie `build` (build w chmurze z limitu 15 na miesiąc).
- README:81 i komentarz `iphone-eas.yml:3-4` mówią, że wysyłka do TestFlight jest „jeszcze niewłączona”, choć od 07.10 działa.
- README:107 i `e2e-ios.yml:1-2` mówią „ręcznie”, a E2E uruchamia się samo przy push na `main` i `integration/**`.

**Propozycja:** poprawić CLAUDE.md i README (droga: `testflight.yml`); ustawić domyślnie `wyslij: false` i akcję niezużywającą limitu; poprawić komentarze w nagłówkach workflowów.

### TST-08 — Nazwy usuniętych albo zmienionych mechanik w opisach bieżącego stanu
**Waga:** ŚREDNIA

**Dowód:**
- **UI (POTWIERDZONE):** `app/_layout.tsx:26`, komunikat po autozapisie „Znajdziesz go w Historii”, EN „You will find it in History”, w 26 językach. Zakładka od 08.10 nazywa się „Kalendarz” (`(tabs)/_layout.tsx:32`). `tests/matrix-ui.test.tsx:374` utrwala ten tekst.
- **Martwe wpisy słownika (POTWIERDZONE):** 41 kluczy EN bez literału w kodzie, w 26 plikach językowych. Wśród nich: „Poranny wpis”, „Poranne wpisy”, „Dziś rano”, „BB, sen, waga — 20 sekund”, „Sen (wynik)”, „Przypomnienie o wadze”, „w poniedziałek o 7:00”, „− seria”, „Usuń serię”, „Usuń ćwiczenie”, „Usuń z szablonu”, „Usunąć ostatnią serię?”, „Moduły”, „Ukryj to, czego nie używasz”, „Trening jest zawsze włączony. Pozostałe moduły…”. `check-i18n` z założenia nie wykrywa nieużywanych kluczy.
- **README (Z KODU):** :4 i :11 opisują poranny wpis jako funkcję, :22 przypomnienie o wadze, :6 „schemat dziś 16” (jest 17), :51 zakładkę „Historia”.
- **Komentarze (Z KODU):** `ActiveWorkout.tsx:244` to osierocony komentarz o gotowości z porannego wpisu; `backup.ts:149` „ustawienie z kopii” przy funkcji, która dziś tylko odwołuje stare powiadomienie.
- **Testy i dokumenty (Z KODU):**
  - `tests/theme-choice.test.tsx:12` ma w tytule „domyślnie jasna Kreda”;
  - docs/16:134 wskazuje nieistniejący `tests/brand-kreda.test.tsx`;
  - docs/21 opisuje w czasie teraźniejszym stan sprzed zmian: :175 „Nasz pomarańcz #E8590C”, :190 „app.json ma jeden płaski PNG”, :191 „dzisiejszy problem Archivo”;
  - docs/21:113: pozycja backlogu z „[OTWARTE] koliduje z decyzją 03.10” stoi obok wpisu, że generator jest zrobiony (docs/21:92).

**Propozycja:** poprawić tekst na „w Kalendarzu” w 26 językach razem z testem; dodać `check-i18n --unused` z listą kluczy używanych dynamicznie; uporządkować README, komentarze i teraźniejsze zdania w docs/21. Wpisy historyczne w docs/18 i docs/09 są w porządku.

### TST-09 — Testy, które nie mogą się wywrócić albo nie sprawdzają tego, co obiecuje tytuł
**Waga:** ŚREDNIA

**Dowód:**
- **POTWIERDZONE:** `tests/swap-logic.test.ts:47-52` — „Leg Extension nie dostaje »tego samego ruchu« od Leg Curl”. Leg Curl nie jest wśród 101 kandydatów (sprawdzone testem w scratchpadzie), więc `if (curl) expect(…)` nigdy się nie wykonuje.
- **Z KODU:** `tests/audit-journey-d.test.tsx:16` „D1 … alert + history + poprzednio” nie ma żadnej asercji (tylko wyciszone `log`).
- **Z KODU:** `tests/audit-records-perf.test.ts:12` „perf split” nie ma asercji, a buduje 300 i 1000 treningów przy każdym `jest`.
- 671 razy `expect(getBy…).toBeTruthy()` w 52 plikach. To szum, nie błąd, bo `getBy` sam rzuca wyjątek.
- W losowej próbie asercji warunkowych znalazłem jedną martwą (powyżej). Reszta, np. `catalog-v2:178` (Hip Adduction istnieje), się wykonuje.

**Propozycja:** w `swap-logic` wybrać parę, która istnieje, i sprawdzić obecność kandydata; dopisać asercje do D1 albo go usunąć; „perf split” przenieść do `jest.perf.config.js`.

### TST-10 — Te same liczby wpisane ręcznie w kilku miejscach (zasada „liczby w jednym miejscu”)
**Waga:** ŚREDNIA

**Dowód (Z KODU):**
- `lib/generator.ts:98` ma `< 10` zamiast `WEEKLY_SETS_MARK` (`lib/stats.ts:229`).
- Teksty UI z liczbami wpisanymi na sztywno: `app/generator.tsx:22-23` („3 serie po 4–6”, „6–10”, „10 serii”, „8–12 (w domu 12–20)”, „1–3”), :58 („150–300”), :64; `lib/whatsnew.ts:18` („10 serii”). Ekran Postępów robi to dobrze: `{n}` z `WEEKLY_SETS_MARK`.
- docs/20:35-40 „Stan na 07.10.2026” podaje 120 plików, 2091 testów, macierz 944 i 12 E2E. Na d2a1e85 jest 144 zestawów, 2584 testy, macierz 1282 i 14 E2E.
- docs/24:25 podaje „dodatkowe 2–3 ×”, a kod zawsze daje 3; docs/24:14 „sesje siłowe 2–6”, a przy redukcji siłowych jest 2–5.

**Propozycja:** liczby przekazywać do tekstów jako parametry ze stałych; „Stan” w docs/20 generować skryptem (np. `test-matrix --write`) albo usunąć liczby.

### TST-11 — E2E: niepinowany Maestro i kroki, które nie sprawdzają skutku
**Waga:** NISKA

**Dowód (Z KODU):**
- `e2e-ios.yml:113`: `curl … get.maestro.mobile.dev | bash` bez przypiętej wersji. Każda nowa wersja Maestro może zmienić zachowanie, a do tego wykonuje się nieprzypięty skrypt z sieci.
- Komentarz `e2e-ios.yml:124` mówi „40 min”, a `MAESTRO_ALARM` to 3000 s.
- `.maestro/05:139-142`: po „Fewer sets” scenariusz nie sprawdza, że serii jest mniej.
- `.maestro/14`: generator testowany tylko na ustawieniach domyślnych. `.maestro/13`: propozycje nie są stosowane („Apply”).
- E2E dla d2a1e85 (run 37793333239) stało w kolejce od 14:32 UTC (sprawdzałem o 17:08 UTC).

**Propozycja:** `MAESTRO_VERSION` przypięte w instalatorze; dopisać asercję liczby serii i krok „Apply”.

### TST-12 — Niestabilny test pauzy pod obciążeniem
**Waga:** NISKA

**Dowód (POTWIERDZONE raz):** przy losowej kolejności i obciążonej maszynie raz padł `pause.test.tsx` „»Pauza« zatrzymuje zegar…”. W 7 kolejnych przebiegach (różne ziarna) przechodził; szczegółów błędu nie mam. docs/09:197 notuje podobne jednorazowe porażki (R54-01, fast-check).

**Propozycja:** prowadzić rejestr niestabilnych testów w docs/09 i zapisywać pełny log porażki (np. `--json` jako artefakt w `tests.yml`).

### TST-13 — Zakres i opis Strykera niezgodne z rzeczywistością
**Waga:** NISKA

**Dowód (Z KODU):** `stryker.config.json` mutuje tylko `units.ts` i `stats.ts`, bez progu `thresholds`. docs/09:92 deklaruje też „logikę lib/store.ts”, a wynik z 01.10 jest nieaktualny (patrz TST-01, TST-02).

**Propozycja:** dopisać moduły, próg `break` i datę ostatniego wyniku generowaną z raportu.

### TST-14 — Część tłumaczeń generowana skryptem spoza repo
**Waga:** NISKA

**Dowód (Z KODU):** docs/09:212 opisuje kroki przewodnika tłumaczone „skryptem w scratchpadzie”. W `scripts/` nie ma generatora `lib/locales/*.json`, więc nie da się go odtworzyć ani sprawdzić przez `--check`.

**Propozycja:** dodać skrypt do `scripts/` z trybem `--check`.

### TST-15 — Na gałęzi funkcji anulowane przebiegi zostawiają commity nigdy niesprawdzone osobno
**Waga:** NISKA

**Dowód (POTWIERDZONE, `gh run list`):** `cancel-in-progress` anulował testy dla commitów z generatorem (f383168), przewodnikiem (fa62ffd), wersją 0.10.0 (0956436), RIR (ca34eda), deload (f32f3c1) i przypomnieniem (1f0c264). Ostatni commit z serii jest jednak zawsze sprawdzany, więc to tylko dziura w historii.

**Propozycja:** zostawić tak, jak jest, i zapisać w docs/09, że weryfikowany jest ostatni commit serii.

## Sprawdzone i w porządku

- **Generowane dokumenty i kontrole:** `test-matrix.mjs --check` rc 0 (docs/19 aktualny, 1282 pozycje, 0 bez testu); `gen.mjs --check` „aktualny”; `check-i18n` OK (805 tekstów w kodzie, 893 w słowniku).
- **Bezpieczeństwo CI na publicznym repo:**
  - brak `pull_request` i `pull_request_target`;
  - wszędzie `permissions: contents: read`;
  - artefakty trzymane 1 dzień;
  - maskowanie UDID przetestowane w `public-repo.test.ts`;
  - `testflight.yml` zapisuje klucz późno i usuwa identyfikatory z `env`;
  - E2E bez sekretów poza `GITHUB_TOKEN`;
  - link rejestracji urządzenia blokowany na publicznym repo;
  - tylko akcje `actions/*`, standardowe maszyny (darmowe), timeouty we wszystkich zadaniach.
- **Usunięte mechaniki:** Tektur, Archivo i kolory Kredy zniknęły z kodu, `app.json` i assets (pilnują tego `brand-tuleja` i `matrix-i18n`). Cofnięty widżet na ekran główny i przyciski na ekranie blokady nie występują w kodzie; „widżet” w repo to rozszerzenie Live Activity, które zostaje. Import Strong/Hevy nie istnieje (CSV w układzie Stronga to eksport). „Pierwszy raz?” to celowo krok 3 „Pierwszych kroków”.
- **Strefy czasowe:** 13 plików testów dat (plan, deload, podsumowanie, dashboard, przypomnienie, kalendarz, pauza, generator, „Co nowego”) przechodzi 161/161 w Pacific/Kiritimati, Pacific/Pago_Pago, America/Los_Angeles i Australia/Lord_Howe.
- **Losowa kolejność:** 12 plików nowych funkcji przeszło 117/117 przy drugim uruchomieniu (wyjątek: TST-12).
- **E2E:** brak `skip`/`only`/`todo`. Każdy scenariusz kończy się sprawdzeniem, wszystkie 14 są w `config.yaml`, funkcje z 08.10 mają kroki E2E poza przypomnieniem (powód zapisany).
- **Mocne obszary mutacji:** deload (3/3), sanityzacja `migrate` nowych pól (6/8), backup (6/7). Atrapa `expo-file-system` główne wejście celowo rzuca wyjątek.

Skrypty audytu są w worktree jako nieśledzone `tests/zz-audit-tst-*` (do usunięcia): `matrix-strict.mjs`, `lit.mjs`, `scan.mjs`, `maestro.mjs`, `mut.mjs`, `mut1.json`, `mut2.json`. Wyniki są w scratchpadzie: `tst-mut1.txt`, `tst-mut2.txt`, `tst-inv-seed.txt`, `tst-tz-*.txt`, `tst-scan.txt`, `tst-matrix-strict.txt`.

