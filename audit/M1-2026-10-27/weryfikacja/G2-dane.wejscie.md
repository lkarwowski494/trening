### 05-architekt-001 · Notatka serii z importu CSV (do 500 znaków) jest ucinana do 300 przy edycji
- Pozycja listy kontrolnej: ARCH-05
- Poziom: P1 (ten sam parametr — maksymalna długość notatki serii — ma w kodzie dwie wartości; skutek: utrata części tekstu użytkownika)
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D
- Dowód: `lib/csvcore.ts:16` „export const IMPORT_NOTE_MAX = 500;” (import CSV zapisuje notatkę serii do 500 znaków); edycja ucina do 300 literałem w dwóch miejscach: `app/history/edit/[id].tsx:113` „set.note = clampName((v ?? '').trim(), 300)” i `components/WorkoutBlocks.tsx:134` „set.note = clampName((v ?? '').trim(), 300)”. Sonda na kopii kodu: notatka 450 znaków po imporcie ma 450, po „Zapisz” w oknie notatki 300 (dowody/sonda-arch05-notatka.txt, exit 0). Notatka treningu ma trzecią wartość: pole 1000 znaków (`components/ActiveWorkout.tsx:194`, `app/history/edit/[id].tsx:81`) wobec 500 w imporcie — bez utraty, ale ta sama luka.
- Wzorzec lub źródło: CLAUDE.md projektu („Liczby (progi, limity, czasy) w jednym miejscu”); zasada architekta 8.
- Kroki w aplikacji: Więcej → Kopia zapasowa → import CSV z serią, której notatka ma 301–500 znaków → Historia → sesja → Edytuj → seria → „Edytuj notatkę” → okno pokazuje cały tekst → „Zapisz” → „Zapisz” sesji: notatka trwale skrócona do 300 znaków, bez komunikatu.

- Test akceptacyjny: test scenariuszowy — import CSV z notatką 450 znaków, otwarcie edycji, „Zapisz” bez zmian → notatka ma 450 znaków; strażnik: brak literału długości notatki w `app/` i `components/` (import stałej).


### 05-architekt-002 · Kopia sprzed migracji powstaje tylko przy zmianie numeru schematu
- Pozycja listy kontrolnej: ARCH-08
- Poziom: P2
- Realność: teoretyczny (dziś; dotyczy danych — wymaga przyszłej zmiany normalizacji) · Pewność: wysoka
- Rodzaj: P (brak: pominięte ryzyko)
- Dowód: `migrate()` biegnie przy każdym starcie, a kopia `premigrate_*` powstaje tylko przy innym numerze schematu: `lib/state/boot.ts:87` „setS(migrate(raw)); needsPersist = before !== SCHEMA_VERSION;”, kopia w `lib/state/boot.ts:90` „await savePreMigrate(Number(before) || 0, row.v, liveTxt, cfgTxt)”. Pierwszy zapis po starcie i tak zapisuje pełny, znormalizowany stan: `lib/state/core.ts:41` „let fullDirty = true;”. Sonda: zapis ze schematem 19 z wpisem, który normalizacja usuwa → po pierwszym `flush` wpisu nie ma w `state`, kluczy `premigrate*` brak (dowody/sonda-arch08-normalizacja.txt, exit 0; usunięcie pustej sesji jest zamierzone — sonda pokazuje mechanizm). W 1.0 doszła normalizacja zmieniająca dane bez podbicia schematu (`lib/state/migrate-live.ts:20`, uzupełnianie `liveDays` z historii). Fixture’y wydanych zapisów powstają per numer schematu, nie per build (`tests/fixtures/released/README.md`), więc buildy 1019–1031 nie mają własnego zapisu wzorcowego.
- Wzorzec lub źródło: zasada wspólna 10 („test na kopii bazy poprzedniej wersji”); moduł `dane-lokalne-sqlite`, „Wydanej migracji nie zmieniasz” — tu funkcja migracji jest zmieniana w każdym wydaniu i stosowana do danych już zmigrowanych.
- Kroki w aplikacji: aktualizacja z TestFlight / App Store do wersji, w której zmieniono normalizację bez podbicia schematu → pierwszy start → przejście do tła: znormalizowany stan nadpisuje poprzedni bez kopii do odzyskania.

- Test akceptacyjny: (a) test startu z zapisem z poprzedniego buildu przy tym samym schemacie → istnieje kopia `premigrate_*` z surowym zapisem; (b) w `tests/fixtures/released` jest zapis z ostatniego wydanego buildu.


### 05-architekt-003 · Nieudany zapis po „Zapisz” poza zakładką Trening nie daje komunikatu na miejscu
- Pozycja listy kontrolnej: ARCH-18
- Poziom: P2 (komunikat istnieje, dane zostają do ponowienia; brakuje go w miejscu działania)
- Realność: brzegowy (pełna pamięć telefonu, błąd I/O) · Pewność: wysoka
- Rodzaj: D
- Dowód: baner błędu zapisu renderuje tylko zakładka Trening — `getPersistError` jest używane wyłącznie w `app/(tabs)/index.tsx:26` „const err = getPersistError();”; zapis edycji historii kończy się `flush()`, który połyka błąd: `lib/state/finish.ts:181` „st.userTouched = true; purgeOrphans(); save(w); flush();” oraz `lib/state/core.ts:97` „export async function flush(): Promise<void> { await persistNow(true).catch(() => {}); await writeDrafts(); }”. Stan w pamięci zostaje i jest ponawiany przy następnym zapisie (`lib/state/core.ts:91`).
- Wzorzec lub źródło: polityka błędów roli („nigdy cicho: komunikat i dane zachowane do ponowienia”).
- Kroki w aplikacji: telefon bez wolnego miejsca → Historia → sesja → Edytuj → zmiana → „Zapisz”: ekran wraca jak po sukcesie, komunikat pojawi się dopiero po przejściu na zakładkę Trening; zamknięcie aplikacji przed udanym ponowieniem gubi zmianę.

- Test akceptacyjny: test ekranu z `global.__dbFail = true` — po „Zapisz” w edycji historii komunikat o błędzie zapisu jest widoczny bez zmiany zakładki.


### 12-niezawodnosc-001 · Wyjątek w migracji przy starcie daje pustą aplikację zamiast trybu awaryjnego; kopie po treningu wypierają z puli całą dawną historię, a „Ukryj komunikat” + „Wyczyść” usuwa ostatnią kopię
- Pozycja listy kontrolnej: NIE-14
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `lib/state/boot.ts:87` migracja w tym samym bloku `try` co odczyt JSON; każdy wyjątek (także błąd kodu migracji na czytelnych danych) trafia do `catch` (`lib/state/boot.ts:91-94`), który odkłada zapis pod `state_corrupt_*`, ustawia `setS(null)` (`lib/state/boot.ts:109`) i startuje od danych startowych (`lib/state/boot.ts:133-134`). Kopia po treningu rotuje pulę do 10 najnowszych bez względu na treść (`lib/backup.ts:77`, `lib/backup.ts:84`). Kopia bezpieczeństwa przed czyszczeniem danych dołącza zapis nieczytelny tylko, gdy komunikat jest widoczny (`lib/backup.ts:100`); czyszczenie usuwa `state_corrupt_*` (`lib/state/boot.ts:235`). Sonda A na prawdziwym SQLite (dowody/sonda-ratowanie-zrodlo.txt, wynik dowody/sonda-ratowanie-wynik.txt, exit=0): przed startem 25 treningów w bazie i 10 kopii z 25 treningami; po starcie z migracją rzucającą wyjątek: brak trybu awaryjnego, 0 treningów w aplikacji, 25 w `state_corrupt_*`; po 10 nowych treningach: 0 kopii z dawną historią w puli; po ukryciu komunikatu i wyczyszczeniu danych: 0 miejsc w telefonie z 25 treningami (z widocznym komunikatem: 1 — pole `recovery` w kopii bezpieczeństwa).
- Wzorzec lub źródło: wzorzec roli NIE-14 i zasada roli 1 („Dane użytkownika przed dostępnością”); intencja projektu w `docs/09-plan-testow.md:22` opisuje nieczytelny zapis, nie błąd kodu migracji; recenzje PL (dowody/recenzje-pl-wzorzec.txt): utrata historii po aktualizacji to najcięższy zarzut wobec konkurencji.
- Kroki w aplikacji: aktualizacja do wersji, której migracja (albo normalizacja przy każdym starcie) rzuca wyjątek na danych tego użytkownika → aplikacja otwiera się pusta z banerem „Poprzednich danych nie dało się odczytać” → użytkownik trenuje dalej (10 treningów wypiera kopie z historią) → „Ukryj komunikat” → „Wyczyść wszystkie dane” (np. żeby „zacząć od nowa”). Import dawnej kopii w wersji z błędem też się nie uda (ta sama migracja). W 1.0 warstwa danych jest identyczna jak w 1031 (dowody/diff-1031-head-warstwa-danych.txt), więc pierwsze realne narażenie to błąd normalizacji na nietypowych danych albo następna aktualizacja ze zmianą migracji.

- Test akceptacyjny: start z migracją rzucającą wyjątek na danych z 25 treningami → ekran awaryjny, „state” bajt w bajt bez zmian, pula kopii bez zmian; „Wyślij dane” daje 25 treningów; dla nieczytelnego JSON zachowanie jak dziś, a kopia bezpieczeństwa przed „Wyczyść” zawiera nieczytelny zapis także po „Ukryj komunikat”.


### 12-niezawodnosc-002 · Ekran błędu startu nie ostrzega, że usunięcie aplikacji skasuje dane i kopie; przy bazie, która się nie otwiera, „Wyślij dane” daje tylko ostatnią kopię po treningu albo nic
- Pozycja listy kontrolnej: NIE-01
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: ekran pokazuje tylko miejsce kopii (`components/StartError.tsx:29`) i komunikat o niezmienionych danych (`app/_layout.tsx:65`); ostrzeżenie o znikaniu kopii razem z aplikacją jest wyłącznie na ekranie Kopia zapasowa (`app/more/backup.tsx:32`). Gdy baza się nie otwiera, `openDb` rzuca (`lib/state/db.ts:39-48`), `readRawData` nie ma bazy i „Wyślij dane” udostępnia najnowszy plik z puli (`lib/backup.ts:199-210`); ścieżki kopiowania pliku bazy brak. Sonda B (dowody/sonda-ratowanie-wynik.txt): baza 12 treningów i przerwa domyślna 177 s, kopia w puli 12 treningów i 90 s → wysłano kopię (zmiana po ostatniej kopii przepada); bez kopii w puli (kopia automatyczna wyłączona albo brak treningu) „Wyślij dane” = false. Ekran błędu startu nie ma wyjścia innego niż ponowienie, więc naturalny ruch użytkownika to reinstalacja, która usuwa bazę i folder Backup.
- Wzorzec lub źródło: NIE-01 (ścieżka ratunkowa daje kompletną kopię także przy bazie, która się nie otwiera); sqlite.org/howtocorrupt.html (kopiowanie bazy bez dziennika psuje dane — dotyczy wariantu (b) niżej); tekst samej aplikacji: „Kopie automatyczne znikają razem z aplikacją” (`app/more/backup.tsx:32`).
- Kroki w aplikacji: start kończy się ekranem „Nie udało się otworzyć danych.” (baza nieczytelna albo wyjątek po wczytaniu, który powtarza się przy każdym „Spróbuj ponownie”) → użytkownik usuwa i instaluje aplikację → dane i wszystkie kopie w Plikach znikają. Przy wyjątku po wczytaniu „Wyślij dane” wysyła pełne dane, ale ekran nie mówi, że trzeba to zrobić przed reinstalacją.

- Test akceptacyjny: test ekranu: `start-error` zawiera tekst ostrzeżenia we wszystkich językach (macierz i słownik); dla (b): przy `openDb` rzucającym „Wyślij dane” udostępnia kopię bazy, której `integrity_check` = ok i liczba treningów = liczba w bazie.


