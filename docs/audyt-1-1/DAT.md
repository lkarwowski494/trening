# Raport DAT — dane i ich trwałość (audyt W-10, 1.1, commit 79117f33)

Soczewka: użytkownik, który traci dane. Audytor: DAT. Data: 11.11.2026.

## Zakres i pokrycie

**Przeczytano:** `lib/store.ts` (fasada), `lib/state/core.ts` (kolejka zapisów, „state”/„live”/„cfg”, szkice), `lib/state/boot.ts` (start, `state_corrupt_*`, `recovery`, `premigrate_*`, nowszy schemat), `lib/state/db.ts` (katalog bazy), `lib/state/migrate.ts` (wejście), `lib/state/migrate-catalog.ts` (`retireCatalog`, `usedIds`), `lib/state/exercises.ts` (`deleteExercise`, `purgeOrphans`), `lib/catalog-wycofane.ts`, `lib/backup.ts` (`parseBackup`, `importBackup`), `app/more/backup.tsx`, `app/more/settings.tsx:92` („Wyczyść wszystkie dane”), wszystkie wywołania akcji niszczących w `app/` i `components/` (grep `deleteWorkout|deleteTemplate|deleteExercise|removeBodyMass|resetAll|cancelWorkout|deleteBand|removeItem|deleteLocation|deletePlan|tplRemoveRow`), diff zegarka (`targets/watch-app/Core/WatchStore.swift`, `WorkoutController.swift`, `WatchConnectivityClient.swift` — kolejka zdarzeń i potwierdzenia).

**Zmiany od 1.0 w warstwie danych** (`git diff --stat v1.0.0-b1033 79117f33 -- lib/state lib/seed.ts lib/backup.ts lib/draft.ts lib/edit.ts`): tylko `boot.ts` (kopia odzysku obejmuje też `cfg`), `crashguard.ts` (start w tle nie liczy się jako awaria), `time.ts` (formatowanie dat), `seed.ts` (`LIB_WYCOFANE` → `LIB_REMOVED` — wycofanie „Wide-Grip Pulldown Behind The Neck”, decyzja 02.11.2026). `SCHEMA_VERSION` = 19 bez zmian; `migrate.ts`, `core.ts`, `migrate-records.ts`, `lib/watch/*` bez zmian. Zmiana SDK 57 → 58 (`expo-sqlite` 57.0.3 → 58.0.15) — natywna, nie do sprawdzenia na Linuksie. Warstwa danych 1.0.1 (b1037) = kandydat (jedyna różnica w `seed.ts`: `setRenamedCheck`, wyświetlanie nazwy).

**Uruchomione testy repo (wszystkie zielone):** `tests/migrate-released.test.ts` (17/17), `audit-persist`, `db-real-sqlite`, `migrate-idem`, `matrix-data-fuzz`, `wide-grip-pulldown-behind-neck-2026-11-02` (razem 47/47), `audit-m1-2026-10-27-014-normalizacja-schemat` (17 + 1 pominięty), `watch-apply`, `watch-invariants`, `audit-m1-009-watch-edit` (30/30).

**Testy robocze** (`<scratchpad>/testy-DAT/`):
- `gen-bogaty-1033.test.ts` — generator bogatego zapisu kodem tagu `v1.0.0-b1033` (worktree tagu): 38 treningów, wszystkie miary (ciężar×powt., czas, dystans, ciężar×dystans, dystans×czas, ciężar×czas), guma i dociążenie, superserie, `swappedFrom`, pauzy, notatki serii i treningów, miejsca (w tym jednorazowe), szablony z wierszami, zamiennikami, folderem, notatką, archiwum, plan + historia + zapisany plan + nadpisania + `planPlaces`, deload, masa ciała, poranki, ćwiczenie własne z notatką/tempem, ćwiczenie biblioteki zmienione przez użytkownika, **wycofane ćwiczenie użyte w historii i szablonie (z notatką)**, ustawienia zmienione (lb, en, dark, odwrócone przełączniki), trening w toku z odhaczoną serią i trwającą pauzą; restart kodem 1033 przed zapisem. Wynik: `bogaty-1033.json`.
- `zz-dat-wczytaj-1033.test.ts` — wczytanie kandydatem, różnice pole po polu, 2× restart; wynik `bogaty-kandydat.json`; ten sam plik uruchomiony w worktree 1033 na danych kandydata = cofnięcie (`bogaty-cofniety-1033.json`).
- `zz-dat-kopia.test.ts` — eksport → import → restart → 2× migrate; import koperty z 1.0; 12 plików uszkodzonych/obcych.
- `zz-dat-fuzz.test.ts` — fast-check, 1500 przypadków, seed 20261111.
- `zz-dat-trwalosc.test.ts` — zabicie procesu bez flush, flush przy wyjściu do tła, błąd zapisu i ponowienie, nieczytelny zapis.
- `zz-dat-dbg.test.ts` — sonda do kontrprzykładu fuzzu (zarchiwizowane ćwiczenie w szablonie).

**Nie czytano:** `lib/draft.ts`, `lib/edit.ts` (bez zmian od 1.0), `lib/csvimport.ts` w głąb (import CSV tylko dopisuje — z podglądem), Zdrowie poza zapisem (inny audytor).

## Wyniki sprawdzeń (dowody)

1. **1033 → kandydat (bogaty zapis):** `DAT_IN=…/bogaty-1033.json npx jest tests/zz-dat-wczytaj-1033.test.ts` → kod 0, `RECOVERY null`, klucze `[state, live]`, **3 różnice, wszystkie zamierzone**: `.exercises.340.lib: true -> undefined`, `.libKey: "Wide-Grip Pulldown Behind The Neck" -> undefined`, `.catalogRev -> undefined` (wycofane ćwiczenie, użyte → zostaje jako własne z tym samym id, notatką i całą historią; decyzja 02.11.2026). 38/38 treningów, wszystkie serie, szablony, trening w toku z pauzą, ustawienia — bez zmian. `RESTART1 brak różnic`, `RESTART2 brak różnic`.
2. **Cofnięcie (dane kandydata otwarte kodem 1033):** ten sam test w worktree `v1.0.0-b1033` na `bogaty-kandydat.json` → `ROZNICE 0`, `RESTART1/2 brak różnic`, bez `state_corrupt`/`recovery`. 1033 niczego nie kasuje ani nie zmienia przy zapisie; odłączone ćwiczenie nie wraca do biblioteki (warunek `schemaVersion < 10` w `migrate-catalog.ts:74`). 1037 ma tę samą warstwę danych co kandydat (diff wyżej) — cofnięcie na 1037 jest identyczne z kandydatem.
3. **Kopia zapasowa:** `IMPORT brak różnic`, `RESTART brak różnic`, `MIGRATE2 brak różnic` (2× migrate idempotentne), `IMPORT10 brak różnic` (koperta 1.0 = stan po starcie z bazy). Pliki: ucięty, pusty, CSV, obcy obiekt, tablica, `null`, liczba, schemat 20, goły stan ze schematem 99, `exercises` nie-tablica, koperta odzysku bez stanu → **wszystkie odrzucone w `parseBackup`**, czyli przed `safetyBackup` i `replaceState` (`lib/backup.ts:184-186`) — obecne dane nietknięte. Import poprzedzony oknem „Nadpisać dane?” z informacją o kopii (`app/more/backup.tsx:26`).
4. **Trwałość:** `TLO_flush` — wartość wpisana i wyjście do tła (`flush`, `app/_layout.tsx:57`) przeżywa zabicie; `ZABICIE_350ms` — wpis po upływie 300 ms przeżywa; błąd zapisu → `persistError='disk full'`, po ponowieniu `null` i trening w bazie (1); nieczytelny `state` → `state_corrupt_<t>` + `state_corrupt_<t>_live` + `recovery`, `readRecovery` daje kopertę `trening-recovery` (od 1.1 także z `cfg`).
5. **Fuzz (≥1000):** `PRZYPADKI 1500`, zielony. Pola losowane: wycofane ćwiczenie (użyte / w szablonie / w zamienniku / w treningu w toku / z notatką / przemianowane / zarchiwizowane / `lib` śmieciowe / duplikat), schemat 18/19/'19'/brak, śmieciowe wartości 10 ustawień i 7 pól ćwiczenia. Niezmienniki: brak rzutu, idempotencja, liczba serii zachowana, każde `exerciseId` (treningi, szablony, zamienniki) istnieje, klucz wycofany znika, użyte/osobiste wycofane ćwiczenie zostaje. Pierwszy kontrprzykład (zarchiwizowane wycofane ćwiczenie tylko w szablonie znika razem z pozycją szablonu) to zachowanie ogólne i zamierzone: zarchiwizowane = usunięte przez użytkownika, a `deleteExercise` (`lib/state/exercises.ts:73-81`) zawsze najpierw usuwa je z szablonów — przez UI szablon nie zawiera zarchiwizowanego ćwiczenia (teoretyczne).
6. **Akcje niszczące w UI:** wszystkie trafienia mają okno potwierdzenia (`DeleteButton`/`SwipeRow`/`confirmDelete`/`Alert.alert` z przyciskiem destrukcyjnym): sesja w historii (`app/history/[id].tsx:79`, `app/(tabs)/history.tsx:53`), pusty trening przy edycji (`app/history/edit/[id].tsx:59`), ćwiczenie (`app/exercise/[id].tsx:97`, `app/exercises.tsx:45` — z historią tylko archiwizacja), miejsce (`app/more/location/[id].tsx:60`, `locations.tsx:25` — główne zablokowane), masa ciała (`bodymass.tsx:47`), guma (`bands.tsx:34`), plan (`plan.tsx:106,135`), seria i pozycja szablonu (`template/[id].tsx:129,136,189,197`), archiwum szablonu w planie (`template/[id].tsx:74`), odrzucenie treningu (`ActiveWorkout.tsx:121,156,170`), import (kopia bezpieczeństwa przed), „Wyczyść wszystkie dane” (`settings.tsx:92` — kopia bezpieczeństwa przed, ostrzeżenie o treningu w toku). Od 1.0 nie doszła żadna nowa akcja niszcząca (diff `app components`: zmiany to `FullValue`, nazwy lokalne, `fmtDayRange`).
7. **Zegarek → telefon (zapis):** `lib/watch/*` bez zmian od 1.0; zegarek nie trzyma własnych serii — wysyła zdarzenia `done`/`differ` z kolejką (`ClientState.queue`, `transferUserInfo` bez połączenia, ponowienie do potwierdzenia, telefon pomija powtórzone `eventId` — `WatchConnectivityClient.swift:4-7`, `WatchStore.swift:206`); zmiana 1.1 dotyczy tylko pauzy sesji HealthKit. Testy `watch-apply`, `watch-invariants`, `audit-m1-009-watch-edit` zielone.

## Znaleziska

### DAT-01 — Test zapisu z 1.0 (b1033) porównuje tylko część pól, a plik zapisu nie ma większości rodzajów danych
- **Waga:** ŚREDNIE (luka w teście; kod migracji jest poprawny — sprawdzone bogatym zapisem wyżej). **Realność:** nie dotyczy (zabezpieczenie przed przyszłą regresją przy zmianie migracji bez podbicia schematu).
- **Dowód:** `tests/migrate-released.test.ts:38-49` porównuje treningi tylko przez `[s.id, s.weight, s.reps, s.kind, s.rpe, s.note, s.done]`, szablony przez `[i.exerciseId, i.sets]`, miejsca przez `[id, name, oneOff]`, z ustawień tylko `defaultRest`. Nie porównuje: `durationSec`, `distanceM`, `bandId`, `addKg`, `swappedFrom`, `impl`, `groupId`, pauz, notatek treningów, ćwiczeń (notatki, tempo, przerwy, zmiany użytkownika), wierszy szablonu (`rows`), zamienników, folderu/notatki/archiwum szablonu, gum, pozostałych ustawień. Plik `tests/fixtures/released/state-v1.0.0-b1033-schema19.json` (`features`) nie zawiera: wierszy szablonu, zamienników, superserii, gum i dociążenia, miar czasu i dystansu, `swappedFrom`, pauzy trwającej w treningu w toku, ustawień poza `defaultRest/autoBackup/voice/haptics`, użytego wycofanego ćwiczenia.
- **Mechanizm:** ten sam wzorzec (porównanie wybranych pól) dotyczy wszystkich 5 plików z `tests/fixtures/released/` (jeden `describe.each`); `restart po migracji` (linie 57-60) porównuje pełny stan, ale tylko kandydat z kandydatem.
- **Naprawa:** dodać do `tests/fixtures/released/` bogaty zapis wygenerowany kodem tagu b1033 (gotowy generator: `testy-DAT/gen-bogaty-1033.test.ts`, zapis po restarcie kodem tagu) i w `migrate-released.test.ts` porównanie **całego** stanu z jawną listą oczekiwanych różnic (dziś: `lib/libKey/catalogRev` wycofanego ćwiczenia) oraz test cofnięcia (zapis kandydata wczytany kodem tagu — tu ręcznie w worktree; w CI np. przez zapisany wynik „odczytu 1033” jako drugi plik).
- **Test akceptacyjny:** zmiana dowolnego pola serii/szablonu/ćwiczenia w `migrate` bez podbicia schematu czerwieni `migrate-released.test.ts`.

### DAT-02 — Odhaczenie serii i wpis z ostatnich 300 ms giną, gdy aplikacja padnie, zanim zapis zdąży
- **Waga:** NISKIE. **Realność:** brzegowy (awaria procesu albo zabicie przez system bez przejścia do tła w ciągu 0,3 s od dotknięcia; zwykłe zamknięcie i wyjście do tła robią `flush`).
- **Kroki:** trening w toku → wpisz ciężar, odhacz serię → w ciągu 0,3 s awaria aplikacji → po starcie seria nieodhaczona, ciężar sprzed wpisu.
- **Dowód:** `zz-dat-trwalosc.test.ts`: `ZABICIE_0ms done= false w= 24` (wpisane 77, odhaczona); `ZABICIE_350ms reps= 9` (po 300 ms zapisane). Przyczyna: `save()` z opóźnieniem 300 ms (`lib/state/core.ts:169-170`), natychmiast tylko `setTimerState` (`core.ts:223-229`).
- **Mechanizm:** zamierzony kompromis wydajności (runda 69, PERF); bez zmian od 1.0. Ten sam wzorzec: każda zmiana przez `save()`/`saveCfg()`.
- **Naprawa (backlog):** przy `toggleDone` zapis klucza „live” bez opóźnienia (mały klucz, jak timer) — koszt mały. **Test:** `toggleDone` + `__resetForTests` + `init` bez czekania → seria odhaczona.

(Teoretyczne, jedna linijka: plik kopii z ręcznie wpisanym `"workouts": null` przechodzi import jako 0 treningów — zastępuje dane, ale po oknie „Nadpisać dane?” i z kopią bezpieczeństwa w Plikach.)

## Do sprawdzenia

- Czy zmiana normalizacji przez `retireCatalog` dla „Wide-Grip Pulldown Behind The Neck” (02.11.2026, bez podbicia `SCHEMA_VERSION`) jest objęta regułą NFR-DAN-001 — odciski w `tests/fixtures/odciski-normalizacji.json` dla b1033 zapisano 05.11.2026 (commit aacc8571), czyli już z tą zmianą, więc strażnik jej nie zobaczył. Wpływ na dane sprawdzony (cofnięcie na 1033 bez różnic, fuzz zielony), więc to pytanie o regułę procesu, nie o utratę danych. Pewność, że to luka reguły: ok. 50%.

## Co działa dobrze

- Migracja 1033 → 1.1 bogatego zapisu: tylko zamierzone 3 pola; restart ×2 bez różnic; brak kopii odzysku.
- Cofnięcie do 1033 (i 1037, ta sama warstwa danych): 0 różnic — starsza wersja nie psuje ani nie kasuje danych 1.1.
- Kopia JSON: pełny obieg bez różnic; każdy uszkodzony lub obcy plik odrzucony przed jakąkolwiek zmianą danych; kopia bezpieczeństwa przed importem i przed czyszczeniem.
- Nieczytelny zapis nigdy nie jest nadpisany (`state_corrupt_*` z `live` i od 1.1 z `cfg`); baza z nowszego schematu nie jest migrowana ani zapisywana.
- Wycofane ćwiczenie: użyte albo „osobiste” zostaje jako własne z historią i szablonami (fuzz 1500).
- Każda akcja niszcząca w UI ma potwierdzenie; nowych od 1.0 brak.
- Bundle ID bez zmian mimo nowej nazwy (`app.json`: dochodzi tylko `CFBundleDisplayName`), katalog kopii `Backup/` i wzorce nazw plików kopii bez zmian.

## Nie sprawdzono

- **Natywny SQLite po zmianie SDK 57 → 58 na prawdziwej aktualizacji 1033 → 1.1** (plik bazy w `Library/SQLite`, przeniesienie z `Documents/SQLite`). Kod `lib/state/db.ts` bez zmian; `expo-sqlite` 58 nadal zwraca `Documents/SQLite` (`node_modules/expo-sqlite/ios/SQLiteModule.swift:24-29`), więc `dbDirectory` działa jak dotąd; changelog 58.0.12 przenosi tylko bazy z nazwą zakodowaną procentowo (nasza `trening.db` — nie dotyczy). Krok: W-15 (E2E aktualizacji **z b1033**, dziś [DO USTALENIA] w docs/49) i W-20 (aktualizacja z App Store na telefonie).
- Zapis przy wyjściu do tła na prawdziwym iOS (AppState `inactive/background` → `flush`) i start w tle (`startedInBackground`) — tylko symulator/telefon.
- Zegarek na prawdziwym sprzęcie (kolejka `transferUserInfo` bez połączenia) — telefon + zegarek, lista „tylko telefon”.
