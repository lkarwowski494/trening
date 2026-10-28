# Reaudyt: Niezawodność — Trening (iOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony — zgodny z poleceniem) · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Tryb: reaudit, pętla 1 · Środowisko: Linux x86_64, Node 22.22.0, git 2.43 (dowody/srodowisko.txt); bez Xcode, symulatora i telefonu; typecheck i lint wspólne (kod 0, `wspolne/`), pełnych testów i buildu nie powtarzałem. Testy M2 uruchomione pojedynczo z `--maxWorkers=1` w drzewie głównym (tylko odczyt); sondy w `git worktree` na 2385e75 w scratchpadzie (usunięty na końcu).

## Podsumowanie
Trzy naprawy z mojego obszaru działają w kodzie i w testach: wyjątek migracji przy starcie prowadzi teraz do ekranu błędu startu bez żadnego zapisu (dane nietknięte), ekran ostrzega przed usunięciem aplikacji, a przy bazie, która się nie otwiera, „Wyślij dane” kopiuje komplet plików bazy (baza, -wal, -shm, -journal) do folderu w Plikach — moja sonda na prawdziwym SQLite w trybie WAL potwierdza 25 → 25 wierszy i `integrity_check` = ok, a kopia samego pliku `.db` nie ma nawet tabeli. E-mail „Napisz do nas” nie zawiera treści błędu (decyzja 7a) — zweryfikowane. Kod diagnostyczny trafia jednak do e-maila tylko z ekranu pętli awarii; z ekranu błędu migracji i nieotwierającej się bazy e-mail jest bez kodu (003 częściowo otwarte). Nowe, drobne skutki naprawy 013: następny zimny start po błędzie migracji pokazuje komunikat pętli awarii „zamknęła się nieoczekiwanie”, choć aplikacja się nie zamknęła (601, P2). Nowych P0/P1 brak.

| ID | Źródło (plan M1/M2) | Wynik | Dowód |
|---|---|---|---|
| 12-niezawodnosc-001 | M1-audytor-generalny-013 (commit 8f3fb6f) | zweryfikowane (zakres planu: wyjątek migracji → ekran błędu startu, dane nietknięte); część poboczna z audytu (kopia bezpieczeństwa przed „Wyczyść” po „Ukryj komunikat” przy nieczytelnym JSON) nie była w teście akceptacyjnym planu — zostaje decyzją D-4 z raportu audytu | `lib/state/boot.ts:92`, `lib/state/boot.ts:99`; dowody/jest-audit-m1-2026-10-27-013-wyjatek-migracji.txt (3/3, kod 0); dowody/sonda-migracja-wynik.txt |
| 12-niezawodnosc-002 | M1-audytor-generalny-004 (commit 451862d) | zweryfikowane (kod, test na prawdziwym SQLite, sonda kopiowania plików); zachowanie na telefonie — nie sprawdzono | `components/StartError.tsx:34`, `lib/rescue.ts:28`, `lib/backup.ts:212`; dowody/jest-audit-m1-2026-10-27-004-ratunek.txt (7/7, kod 0); dowody/sonda-ratunek-wynik.txt |
| 12-niezawodnosc-003 | M1-audytor-generalny-032 (commit dbc9f3b) | nadal otwarte (częściowo, P2): kod etapu w e-mailu tylko z ekranu pętli awarii; ekran błędu migracji i nieotwierającej się bazy nie ma kodu, e-mail ma samą stopkę | `app/_layout.tsx:43`; dowody/jest-audit-m1-2026-10-27-032-kod-diagnostyczny.txt (3/3, kod 0); dowody/sonda-migracja-wynik.txt (S1) |
| 12-niezawodnosc-003 | M2-koordynator-napraw-002 (commit 0311996e, decyzja 7a) | zweryfikowane: treść błędu nie trafia do e-maila; kod diagnostyczny bez danych osobowych (etap, ms, schemat, licznik) | `components/StartError.tsx:37`, `lib/support.ts:22`, `lib/state/bootphase.ts:27`; dowody/jest-audit-m1-2026-10-27-032-kod-diagnostyczny.txt |
| 12-niezawodnosc-601 | nowe (skutek naprawy 013) | regresja, P2: po błędzie migracji kolejny zimny start pokazuje komunikat pętli awarii „zamknęła się nieoczekiwanie” | `lib/state/boot.ts:54`; dowody/sonda-migracja-wynik.txt (S2) |

Liczby nowych znalezisk: P0 = 0, P1 = 0, P2 = 1 (601). Otwarte z poprzednich: 003 częściowo (P2). Wiersz M2-koordynator-napraw-002 ma w pierwszej kolumnie ID 003, bo to ta sama ścieżka (e-mail z ekranu błędu startu).

Otwarte poza main (tylko wypisuję, nie znalezisko): 9a eksport figur strony (gałąź naprawy/M2-po-decyzjach-eksport-figur), propozycje A/B w lekcjach L-047 i L-048 (docs/40), backlog 1.0.1 w docs/21.

## Weryfikacja ID (szczegóły)

**12-niezawodnosc-001 / M1-013.** `migrate(raw)` ma własny `try`; wyjątek inny niż „bad state” jest opakowany z flagą `migrationFailed` (`lib/state/boot.ts:92`), a zewnętrzny `catch` przepuszcza go dalej, zanim cokolwiek zapisze (`lib/state/boot.ts:99`) — nie powstaje `state_corrupt_*`, `recovery` ani czysty stan. `app/_layout.tsx:66` pokazuje wtedy StartError z „Wyślij dane” (pełne dane z bazy przez `readRawData`). Test M2: „state” bez zmian, brak `state_corrupt_*`, „Wyślij dane” daje dane z bazy; nieczytelny JSON i zły kształt zapisu — jak dotąd (dowody/jest-audit-m1-2026-10-27-013-wyjatek-migracji.txt, kod 0). Sonda S1: licznik strażnika zostaje 1 po czasie kamienia (ekran błędu nie zeruje licznika, `app/_layout.tsx:56`), więc pętla nie powstaje bez ekranu. Pula kopii po treningu nie rotuje, bo aplikacja nie dochodzi do trybu normalnego. Pozostała część z audytu: `safetyBackup` nadal dołącza nieczytelny zapis tylko przy widocznym komunikacie (`lib/backup.ts:101`), a „Wyczyść” usuwa `state_corrupt_*` (`lib/state/boot.ts:243`) — dotyczy tylko ścieżki nieczytelnego JSON, istniało wcześniej i było w audycie decyzją D-4, nie częścią planu M1-013.

**12-niezawodnosc-002 / M1-004.** Ostrzeżenie na ekranie (`components/StartError.tsx:34`, test: wszystkie słowniki). Przy bazie, która się nie otwiera, `exportStartDataDetailed` (`lib/backup.ts:212`) woła `rescueDbCopy`, które tylko kopiuje (`copyAsync`) pliki z `DB_FILES` do Dokumenty/Backup/Rescue-… (`lib/rescue.ts:28`), bez otwierania bazy i bez usuwania — zgodne z decyzją właściciela z 27.10.2026 (docs/18, 4a). Sonda (dowody/sonda-ratunek-wynik.txt, kod 0): awaria procesu z zapisami w `-wal` → kopia samego `trening.db` `no such table: kv`, komplet plików 25/25 wierszy, `integrity_check` ok; komplet kopiowany przy otwartym, bezczynnym połączeniu — też 25/25 (przypadek, gdy baza jest otwarta, ale `exportRawData` zwróci false). Uprawnienia: expo-file-system 57 (legacy `copyAsync`) dopuszcza odczyt spoza Dokumentów, gdy plik jest czytelny dla procesu (`node_modules/expo-modules-core/ios/FileSystemUtilities/FileSystemManager.swift`, `getExternalPathPermissions`), a istniejący cel usuwa przed kopiowaniem — drugie stuknięcie w tej samej minucie nie kończy się błędem. Odstępstwo od wzorca NIE-01: kopia nie przechodzi `integrity_check` przed udostępnieniem — przy bazie, która się nie otwiera, to surowiec do odzysku u dewelopera, a aplikacja nie twierdzi, że kopia jest sprawna; bez znaleziska. Na telefonie (ścieżka `Library/SQLite`, widoczność folderu w Plikach) — nie sprawdzono.

**12-niezawodnosc-003 / M1-032 i M2-002.** `openSupportMail('feedback', undefined, diag || undefined)` (`components/StartError.tsx:37`); `buildSupportMailto` dopisuje tylko `extra` pod stopką (`lib/support.ts:22`); kod to `start: <etap>, <ms> ms, data|empty, schema N, n=K` (`lib/state/bootphase.ts:27`) — bez danych osobowych i treningowych. Treść błędu (`detail`) zostaje tylko na ekranie (decyzja 7a) — test M2 sprawdza, że w adresie mailto nie ma tekstu błędu ani danych z zapisu. Luka: `diag` ustawia się wyłącznie z `e.bootDiag` (`app/_layout.tsx:43`), który ma tylko wyjątek trybu awaryjnego pętli (`lib/state/boot.ts:54`). Wyjątek migracji, błąd otwarcia bazy, wyjątek po wczytaniu i granica błędu ekranu (`app/_layout.tsx:79`) nie mają kodu, więc e-mail zawiera samą stopkę (sonda S1: „start:” w treści = false). Test M2 dla ekranu (wyjątek po wczytaniu) sprawdza tylko brak treści błędu, nie obecność kodu. Naprawa tego samego miejsca co 601 — opcje tam.

## Przegląd różnicy 025a50b..2385e75 w obszarze roli
Pliki: `components/StartError.tsx`, `lib/rescue.ts` (nowy), `lib/state/boot.ts`, `app/_layout.tsx`, `lib/support.ts`, `lib/backup.ts` (dowody/diff-obszar-025a50b-2385e75.txt, 81 dodanych, 15 usuniętych linii).
- **Prywatność e-maila diagnostycznego:** ok (wyżej). Jedyne inne wywołania `openSupportMail` (O aplikacji, Pomysł) bez `extra` — bez zmian.
- **Tryb awaryjny przy wyjątku migracji:** ok dla danych; skutki uboczne: brak kodu (003) i mylący komunikat przy następnym starcie (601).
- **Ratunek przed usunięciem aplikacji:** ok; folder Rescue-… nie pasuje do wzorców puli (`AUTO_RE`, `SAFETY_RE`), więc rotacja kopii go nie usuwa, a „Wyczyść wszystkie dane” nie rusza folderu Backup. Każde stuknięcie w innej minucie tworzy kolejną pełną kopię bazy, której aplikacja nigdy nie sprząta — przy rzadkim ekranie błędu bez znaczenia (bez znaleziska).
- **Nowe okno błędu zapisu** (`PersistErrorAlert`, M1-015, `app/_layout.tsx`): dane czekają w pamięci, „Spróbuj ponownie” woła `flush()`; nic nie kasuje — bez uwag w moim obszarze.
- **Warstwa danych:** brak zmian w `lib/state/migrate.ts`, `lib/state/db.ts`, `lib/state/core.ts`, `lib/state/crashguard.ts` i w schemacie (dowody/diff-stat-proba-regresji.txt); zmiany w `effort.ts`, `sets.ts`, `util.ts` to stałe i etykiety, bez formatu zapisu.

## Próbka regresji (pozycje spoza zmienionych plików)
| Pozycja | Wynik | Dowód |
|---|---|---|
| NIE-04 strażnik pętli (`lib/state/crashguard.ts` bez zmian) | ok: 19/19 testów | dowody/jest-crash-guard.txt (kod 0) |
| NIE-02 naprawa nie niszczy danych | ok: brak `VACUUM`, `REINDEX`, `.recover`; `deleteDatabaseAsync` tylko przy sprzątaniu starej bazy po przeniesieniu (`lib/state/db.ts:103`); nowe `rescue.ts` tylko kopiuje | dowody/grep-nie02-proba.txt |
| NIE-07 SDK i sieć | ok: brak SDK awarii, analityki i expo-updates (jedyne trafienie to wzorzec konfiguracji Jest), brak `fetch(` w kodzie aplikacji; package.json zmienił tylko skrypty | dowody/grep-nie07-proba.txt |
| NIE-11 tor wydania (dodatkowo) | ok: `testflight.yml` tylko `workflow_dispatch`, środowisko `release`; zmiana `e2e-ios.yml` to nowe wejście rozmiaru tekstu symulatora | dowody/grep-nie11-proba.txt |

## Znaleziska

### 12-niezawodnosc-601 · Po błędzie migracji kolejny zimny start pokazuje komunikat „Aplikacja zamknęła się nieoczekiwanie”, choć aplikacja się nie zamknęła
- Pozycja listy kontrolnej: NIE-14 (z NIE-06: diagnostyka)
- Poziom: P2
- Realność: brzegowy (wymaga błędu w kodzie migracji na danych użytkownika) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: start z wyjątkiem migracji zostawia licznik strażnika na 1 (ekran błędu nie zeruje go, `app/_layout.tsx:56`), więc następny zimny start trafia w tryb awaryjny pętli z komunikatem z `lib/state/boot.ts:54`. Sonda (dowody/sonda-migracja-zrodlo.txt, wynik dowody/sonda-migracja-wynik.txt, kod 0): S1 — ekran błędu startu, licznik `{"starts":1}` po czasie kamienia, e-mail bez kodu; S2 — przy liczniku 1 komunikat pętli = true; po `Spróbuj ponownie` znowu ekran z treścią błędu migracji. Użytkownik widzi na zmianę dwa różne opisy tej samej przyczyny, a właściciel w e-mailu dostaje kod `start: begin…` z ekranu pętli zamiast informacji o migracji.
- Mechanizm: wyjątek migracji nie ma własnej kategorii w ścieżce startu; `grep -n "bootDiag" app/_layout.tsx lib/state/boot.ts` → 2 trafienia: `app/_layout.tsx:43` (odczyt), `lib/state/boot.ts:54` (tylko pętla).
- Powraca: nie (nowe zachowanie po 8f3fb6f; przed naprawą ten przypadek dawał pustą aplikację) → trwała kontrola w teście akceptacyjnym niżej.
- Wzorzec lub źródło: wzorzec roli „Strażnik pętli awarii” (ekran awaryjny nie jest kamieniem milowym — zachowanie licznika poprawne; błędny jest tylko opis przyczyny); NIE-06 (właściciel ma się dowiedzieć, co padło).
- Kroki w aplikacji: aktualizacja z migracją rzucającą wyjątek → ekran „Nie udało się otworzyć danych.” → użytkownik zamyka aplikację → otwiera ponownie → „Aplikacja zamknęła się nieoczekiwanie przy ostatnich uruchomieniach.” Dane w obu przypadkach nietknięte, „Wyślij dane” działa.
- Opcje: (a) wyjątek migracji niesie własny kod diagnostyczny (np. `start: migrate, schema A→B`, bez treści błędu) i ten sam kod trafia do e-maila; przy następnym starcie, gdy poprzedni etap to błąd migracji, ekran pokazuje komunikat migracji zamiast komunikatu pętli — kompromis: mała zmiana w `init` i `_layout`, nowy tekst w 35 językach tylko przy wariancie z osobnym komunikatem; (b) tylko kod diagnostyczny dla wszystkich błędów startu (zamyka też 003), komunikat pętli bez zmian — kompromis: bez nowych tekstów, użytkownik nadal widzi mylący komunikat; (c) bez zmian — dane bezpieczne, nazwane ryzyko diagnostyczne. Rekomendacja: (b) w 1.0.1 (bez nowych tekstów przed zgłoszeniem; P2 nie blokuje wydania), (a) przy pierwszej aktualizacji, która zmienia migrację.
- Test akceptacyjny: start z wyjątkiem migracji → e-mail z ekranu zawiera kod etapu migracji i nie zawiera treści błędu; drugi zimny start → kod w e-mailu wskazuje migrację (dla (a) także komunikat migracji zamiast komunikatu pętli); „state” bez zmian w obu startach.
- Status: otwarte

## Stosowalność listy kontrolnej (reaudit)
| Pozycja | Status | Wynik |
|---|---|---|
| NIE-01 | dotyczy | ok — 002 zweryfikowane; odstępstwo `integrity_check` opisane wyżej, bez znaleziska |
| NIE-02 | dotyczy | ok (próbka regresji) |
| NIE-03 | dotyczy (import kopii JSON) | nie zmieniane w różnicy (`importBackup` bez zmian logiki); bez ponownej sondy |
| NIE-04 | dotyczy | ok (próbka regresji, 19/19) |
| NIE-05 | dotyczy | ok: akcje ekranu błędu nie zmieniają bazy; nowa akcja kopii ratunkowej tylko kopiuje; zrzut ekranu — nie sprawdzono (brak symulatora) |
| NIE-06 | dotyczy | 003 częściowo otwarte; 601; źródło sygnału po premierze — decyzja D-3 z audytu (bez zmian) |
| NIE-07 | dotyczy | ok (próbka) |
| NIE-08 | dotyczy | nie zmieniane w różnicy; bez ponownego sprawdzenia |
| NIE-09 | dotyczy | ok: e-mail tylko z inicjatywy użytkownika, z podglądem w poczcie, bez treści błędu i danych (M2-002) |
| NIE-10 | nie dotyczy (brak expo-updates, potwierdzone ponownie) | — |
| NIE-11 | dotyczy | ok (próbka) |
| NIE-12 | dotyczy | nie sprawdzono: ćwiczenia na telefonie (kroki D-5 z audytu) nadal bez zapisu z datą — warunek wysyłki, nie znalezisko |
| NIE-13 | nie dotyczy (brak pakietów treści) | — |
| NIE-14 | dotyczy | ok dla danych (001 zweryfikowane); 601 (P2, opis przyczyny) |

## Czego nie sprawdzono
- Zachowanie na telefonie: ekran błędu startu, kopia Rescue-… w `Library/SQLite` → Pliki, widoczność folderu w aplikacji Pliki. Krok właściciela (ok. 5 min, wymaga buildu z wymuszonym błędem otwarcia bazy — realnie tylko przy ćwiczeniu NIE-12; inaczej pozostaje dowód z testu na prawdziwym SQLite).
- Raporty awarii w App Store Connect (TestFlight → Crashes) — narzędzia tylko do odczytu repo, bez dostępu do App Store Connect.
- Dysk Google właściciela — niedostępny.

## Kontrola dowodów i sekretów
`node audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 12-niezawodnosc` — wynik w dowody/sprawdz-raport.txt (kod 0). W raporcie i dowodach nie ma adresów e-mail (adres wsparcia zamaskowany; `grep` wzorca adresu w dowody/ — brak trafień), UDID, sekretów ani nazw innych aplikacji.

**git status --porcelain** (koniec pracy, /home/user/trening): pusty — pliki śledzone nietknięte (dowody/git-status-koniec.txt)
