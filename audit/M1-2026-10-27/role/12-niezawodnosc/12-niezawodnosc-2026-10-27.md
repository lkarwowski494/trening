# Audyt: Niezawodność — Trening (iOS, dziennik treningu siłowego) — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 (HEAD odłączony, zgodny z poleceniem) · Tryb: audit (głęboki, moduły ratowanie-danych i widocznosc-awarii) · Środowisko: Linux x86_64, Node 22.22.0, git 2.43, gh 2.89 (REST działa, część ścieżek API zablokowana przez proxy), Playwright 1.63; bez Xcode, symulatora i telefonu; sieć przez proxy działa (dowody/srodowisko.txt). Instalacji, buildu ani pełnego Jest nie powtarzałem (wyniki E0 w `audit/M1-2026-10-27/wspolne/`: 497/497 zestawów, 10326 testów zielonych). Sondy tylko w kopii roboczej w scratchpadzie (`git worktree` na 025a50b9).

## Podsumowanie
Ścieżki ratunku są w kodzie przemyślane: tryb awaryjny przy pętli awarii niczego nie zmienia i pozwala wysłać dane, import kopii sprawdza plik przed zastąpieniem i robi kopię bezpieczeństwa, „Wyczyść wszystkie dane” zaczyna od kopii, migracja schematu zostawia surowy zapis na 30 dni, a kopia po treningu jest atomowa i ma widoczny stan porażki. Najpoważniejsze ryzyko: wyjątek w migracji na danych użytkownika nie prowadzi do trybu awaryjnego, tylko do pustej aplikacji — sonda pokazała, że po 10 kolejnych treningach w puli kopii nie zostaje żadna kopia z dawną historią, a po „Ukryj komunikat” i „Wyczyść wszystkie dane” w telefonie nie ma jej nigdzie (25 → 0). Drugie: ekran błędu startu nie mówi, że usunięcie aplikacji skasuje dane i kopie w Plikach, a przy bazie, która się nie otwiera, „Wyślij dane” daje tylko ostatnią kopię po treningu. Brak runbooka, ćwiczeń i źródła sygnału o awariach po premierze bez Maca to decyzje dla właściciela, nie znaleziska. W wydaniu 1.0 warstwa danych i startu jest identyczna jak w buildzie 1031 testerów (dowody/diff-1031-head-warstwa-danych.txt), więc oba P1 dotyczą trybów awarii, a nie zmiany wprowadzonej w tym wydaniu.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 12-niezawodnosc-001 | P1 | D | Wyjątek w migracji przy starcie daje pustą aplikację zamiast trybu awaryjnego; pula kopii po treningu wypiera całą dawną historię, a „Ukryj komunikat” + „Wyczyść” usuwa ostatnią kopię | otwarte |
| 12-niezawodnosc-002 | P1 | D | Ekran błędu startu nie ostrzega, że usunięcie aplikacji skasuje dane i kopie; przy nieotwierającej się bazie „Wyślij dane” daje tylko ostatnią kopię po treningu albo nic | otwarte |
| 12-niezawodnosc-003 | P2 | D | „Napisz do nas” z ekranu błędu startu nie dołącza kodu diagnostycznego ani treści błędu | otwarte |

Liczby: P0 = 0, P1 = 2, P2 = 1. Decyzje do podjęcia: termin naprawy 001 (teraz czy warunek pierwszej aktualizacji ze zmianą migracji), runbook i źródło sygnału o awariach po premierze (bez Maca), los kopii sprzed migracji przy „Wyczyść”, zamknięcie R-005 krokiem na telefonie.

## Linia bazowa i założenia
**E0b — tryby awarii od zera** (zanim przeczytałem runbooki i stare ustalenia; aplikacja offline, bez konta, cały stan jako jeden dokument JSON w SQLite `kv`, kopie JSON w Dokumentach):

| Wymiar pokrycia | Co znalazłem | Wynik |
|---|---|---|
| Utrata danych | zapis z opóźnieniem 300 ms i wymuszony przy wyjściu do tła (`app/_layout.tsx:55`); trening w toku w osobnym kluczu „live”; błąd zapisu = baner; kopia po każdym treningu (domyślnie włączona) w Plikach, 10 najnowszych (`lib/backup.ts:46`); import i „Wyczyść” poprzedza kopia bezpieczeństwa | ok, poza ścieżką błędu migracji (001) |
| Pętla awarii przy starcie | strażnik z progiem 2 (`lib/state/crashguard.ts:9`), licznik w bazie, tryb awaryjny bez wczytywania danych (`lib/state/boot.ts:54`); wektory z wzorców przechodzą (sonda C) | ok; kamień milowy to licznik czasu 1,5 s po gotowości — patrz sekcja Do sprawdzenia |
| Uszkodzony pakiet albo kopia | pakietów treści brak; zły plik kopii odrzucany przed zmianą danych (sonda D); baza, która się nie otwiera → ekran błędu, dane nietknięte (sonda B) | ok; luka wyniesienia danych (002) |
| Brak miejsca | błąd zapisu stanu = baner, kopia po treningu = znacznik porażki, nieudana kopia bezpieczeństwa przerywa import i czyszczenie, nieudana kopia sprzed migracji wstrzymuje zapis zmigrowanego stanu | ok (przepływ świadomie pominięty w E2E: `tests/przeplywy.json:3336`) |
| Zawieszenie lub zabicie w tle | zapis przy wyjściu do tła; trening porzucony ponad 6 h zapisuje się sam przy starcie i powrocie (`app/_layout.tsx:38-40`, 14 plików testów) | ok |
| Zła aktualizacja (binarka, OTA) | brak expo-updates (dowody/grep-nie07-nie10-sdk-ota.txt); test aktualizacji w E2E z poprzedniego wydania (R-012 zamknięte); dane z nowszej wersji → ekran bez zapisu; zapisy wydanych buildów 1005/1017/1018 w `tests/migrate-released.test.ts` | ok; między 1031 a HEAD warstwa danych bez zmian |
| Migracja przerwana w połowie i baza nowsza niż aplikacja | migracja w pamięci (dokument JSON), zapis jednym poleceniem; kopia surowego zapisu przed zapisem zmigrowanego; nowszy schemat → ekran „zaktualizuj” bez zapisu (`lib/state/boot.ts:67-70`) | ok; wyjątek w migracji — 001 |
| Widoczność bez SDK | TestFlight w przeglądarce: liczba awarii buildu i awarie zgłoszone przez testerów (120 dni); po premierze raporty tylko w Xcode Organizer (Mac) albo e-mailem z urządzenia; MetricKit nieużywany; Android nie dotyczy | decyzja (D-2, D-3) |
| Ścieżki ratunku przećwiczone | E2E: wyczyść → import z kopii (`42-kopia-przywrocenie.yaml`, symulator); brak ćwiczenia na czystej instalacji z licznościami i wymuszonej pętli na telefonie | nie sprawdzono (kroki właściciela) |
| Tor incydentu | wysyłka tylko ręcznie i ze środowiskiem `release` (`.github/workflows/testflight.yml:19`, `.github/workflows/testflight.yml:68`); progi wstrzymania wydania stopniowego z decyzji właściciela K-P4-4 (`docs/42-plan-wydania-1.0.md:42`); brak runbooka incydentu | decyzja (D-2) |
| Progi | próg pętli 2 i 1,5 s: decyzja projektu (M1-003, L-029); progi wstrzymania: decyzja K-P4-4; Apple nie podaje progu odsetka awarii | ok |
| Zależności zewnętrzne | sieć tylko StoreKit (start z `.catch`); klucz ASC API w sekretach; certyfikat dystrybucyjny zarządzany w chmurze; opłata Apple Developer i domena wsparcia — kroki właściciela | ok, bez znalezisk |
| Pliki od użytkowników | docs/34: załączniki tylko na prośbę, poza repo, usuwane z wiadomością | ok |

**Soczewki (po kolei, osobno):**
- *Użytkownik bez startu, z latami danych:* tryb awaryjny i ekran błędu niczego nie zmieniają, „Wyślij dane” działa; ale ekran nie mówi „nie usuwaj aplikacji”, a przy bazie, która się nie otwiera, wysyła tylko ostatnią kopię po treningu (002). Przy błędzie migracji użytkownik nie dostaje ekranu awaryjnego, tylko pustą aplikację (001).
- *Właściciel w weekend bez Maca:* awarie testerów widzi w App Store Connect w przeglądarce; po premierze raportów awarii nie zobaczy bez Maca (D-3). E-mail z ekranu błędu nie ma kodu diagnostycznego (003).
- *Prowadzący incydent po wydaniu z błędem:* binarki nie cofnie; jest ręczna wysyłka z bramką E2E, mapa źródeł JS przy tagu wydania (dowody/release-b1031.txt), progi wstrzymania z decyzji; brakuje spisanej kolejności kroków (D-2).
- *Audytor post-mortem za rok:* numer buildu → tag → commit działa (`v1.0.0-b1031` = 001ecf2); lekcje i rejestr ryzyk w docs/40; brak zapisu ćwiczeń (data, build, liczności).

**Wzorzec najlepszych w klasie (przeczytane 27.10.2026, dowody/zrodla-odczyt.txt):** Apple: „TestFlight users of your app automatically share crash reports with you” oraz raporty klientów w Organizerze tylko od tych, którzy udostępniają diagnostykę; poza tym „ask the customer to e-mail you the crash report” (acquiring-crash-reports-and-diagnostic-logs). MetricKit: „Diagnostic reports arrive immediately in iOS 15 and later”. SQLite: „Application faults and power failures typically leave the content of the database intact” (recovery.html) — uszkodzenie pliku jest rzadkie, częstsze są błędy aplikacji, więc ratunek ma chronić przede wszystkim przed własnymi błędami kodu (migracja, start). Rynek główny: w recenzjach PL dzienników treningowych najostrzejsze oceny dotyczą utraty historii po aktualizacji i kopii, której nie da się przywrócić (194 recenzje, dowody/recenzje-pl-wzorzec.txt). Wniosek: najlepsza w klasie aplikacja przy błędzie po aktualizacji zatrzymuje się bez zapisu i daje wyniesienie danych, a kopie nie rotują w trakcie incydentu.

**Rejestr założeń:** `docs/zalozenia.md` nie istnieje — brak propozycji zmian statusu.

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Start: `app/_layout.tsx`, `lib/state/boot.ts`, `lib/state/db.ts`, `lib/state/crashguard.ts`, `lib/state/bootphase.ts` | tak (całość) | odczyt + sonda C (dowody/sonda-ratowanie-wynik.txt) |
| Zapis: `lib/state/core.ts` (kolejka, live/cfg/state, błąd zapisu) | tak | odczyt |
| Kopie i przywracanie: `lib/backup.ts`, `app/more/backup.tsx`, „Wyczyść” w `app/more/settings.tsx` | tak | sondy A, B, D (dowody/sonda-ratowanie-wynik.txt, dowody/sonda-przywracanie-wynik.txt) |
| Ekran awaryjny: `components/StartError.tsx`, baner kopii nieczytelnych danych w `app/(tabs)/index.tsx:31` | tak (kod); zrzut ekranu — nie (brak symulatora) | dowody/grep-ekran-awaryjny-i-kopie.txt |
| Migracje `lib/state/migrate*.ts` | tylko ścieżka błędu i kopia sprzed migracji; poprawność migracji = rola 05 (ARCH-08/09) | sonda A; testy istniejące (dowody/jest-istniejace-testy-niezawodnosci.txt) |
| SDK, OTA, sieć, manifest prywatności | tak | dowody/grep-nie07-nie10-sdk-ota.txt |
| Tor wydania: `.github/workflows/testflight.yml`, workflowy ASC, `eas.json` | tak (pliki); reguły środowiska `release` — nie (API zablokowane przez proxy, 403) | dowody/grep-nie11-tor-wydania.txt |
| Symbole i mapy źródeł | tak (konfiguracja, plik wydania b1031); symbolikacja na prawdziwym raporcie — nie | dowody/release-b1031.txt |
| Aktualizacja 1031 → HEAD | tak (różnica w warstwie danych pusta) | dowody/diff-1031-head-warstwa-danych.txt |
| Zachowanie na telefonie (pętla, ekran awaryjny, reinstalacja, raport w TestFlight) | nie sprawdzono — wymaga telefonu/App Store Connect | kroki w „Decyzje dla właściciela” |
| Zegarek i jego kolejka zdarzeń | nie (poza zakresem roli; lista telefonu: zegarek OK) | — |

## Kontrola dowodów i sekretów
`node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 12-niezawodnosc` — wynik w dowody/sprawdz-raport.txt: „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 12-niezawodnosc”. W raporcie i dowodach nie ma e-maili użytkowników, UDID, sekretów ani nazw innych aplikacji (recenzje zanonimizowane jako „aplikacja A/B/C”).

## Stosowalność listy kontrolnej
| Pozycja | Status (dotyczy / nie dotyczy + powód / decyzja D-xx) | Wynik (ok / znalezisko ID / nie sprawdzono + powód) |
|---|---|---|
| NIE-01 | dotyczy (dane użytkownika na urządzeniu). Ścieżka ratunkowa eksportuje JSON z otwartej bazy (stan + live + cfg), nie plik `.db`; kopia pliku bazy nie istnieje w kodzie | baza otwarta: ok (komplet kluczy użytkownika). Baza się nie otwiera: znalezisko 12-niezawodnosc-002 |
| NIE-02 | dotyczy | ok: brak `VACUUM`, `REINDEX`, `.recover`; jedyne `deleteDatabaseAsync` sprząta starą bazę po udanym przeniesieniu (`lib/state/db.ts:103`); nieczytelny zapis najpierw kopiowany, potem zastępowany (`lib/state/boot.ts:93-94`); brak obietnicy naprawy w tekstach (dowody/grep-nie02-naprawa.txt) |
| NIE-03 | dotyczy w formie importu kopii JSON (przywracania pliku bazy brak — to nie znalezisko; import = też ARCH-11) | ok: plik pusty, ucięty, `{}`, obcy i nowszy odrzucone przed zmianą danych (7 → 7 treningów, bez kopii bezpieczeństwa); starszy (schemat 15) i poprawny przywrócone po kopii bezpieczeństwa (7 → 6, 6 → 3) — dowody/sonda-przywracanie-wynik.txt |
| NIE-04 | dotyczy | ok na wektorach (sonda C: 14 przypadków zgodnych z wzorcem; uwaga do etykiety sondy: po pierwszym starcie świeżej instalacji zapisane są dane startowe, więc drugi start bez kamienia jest awaryjny — zgodne z celem, ZK-07 wyłącza tylko bazę bez zapisu). Odstępstwa: licznik w tej samej bazie, zapisywany po jej otwarciu (`lib/state/boot.ts:39-51`) — awaria natywna przy samym otwieraniu bazy nie jest liczona (teoretyczne, jedna linijka); kamień = licznik czasu 1,5 s po gotowości (`app/_layout.tsx:48`) — patrz sekcja Do sprawdzenia |
| NIE-05 | dotyczy | ok: tryb awaryjny przerywa start przed wczytaniem stanu i migracją, bez sieci; akcje „Wyślij dane”, „Spróbuj ponownie”, „Napisz do nas”, żadna nie zmienia bazy; czyszczenia pamięci podręcznej brak — nie ma pamięci podręcznej, która mogłaby powodować pętlę. Zrzut ekranu: nie sprawdzono (brak symulatora) |
| NIE-06 | dotyczy | brak ADR i runbooka źródła sygnału → decyzja D-2/D-3 (brak dokumentu to nie znalezisko); ćwiczenie „awaria testowa z TestFlight dotarła” — nie sprawdzono (wymaga buildu z wyzwalaczem awarii i App Store Connect); e-mail z ekranu błędu bez diagnostyki — 12-niezawodnosc-003 |
| NIE-07 | dotyczy (sprawdzenie braku SDK) | ok: brak SDK awarii, analityki i OTA; manifest `NSPrivacyCollectedDataTypes: []`, `NSPrivacyTracking: false` (dowody/grep-nie07-nie10-sdk-ota.txt) |
| NIE-08 | dotyczy | ok w konfiguracji: mapa źródeł JS jako artefakt i plik wydania przy tagu (`.github/workflows/testflight.yml:141-144`; plik `main.jsbundle.map` 12 MB przy `v1.0.0-b1031`); symbole natywne wysyła eksport z `destination upload`. Test symbolikacji na prawdziwym raporcie — nie sprawdzono (R-008 część b, `docs/40-lekcje.md:20`) |
| NIE-09 | dotyczy | ok: brak dziennika diagnostycznego wysyłanego z urządzenia; kod `bootphase` bez danych osobowych (etap, ms, schemat, licznik); e-mail tylko z inicjatywy użytkownika z podglądem w poczcie, stopka: wersja, iOS, język (`lib/support.ts:19`) |
| NIE-10 | nie dotyczy: brak expo-updates (pakiet nie zainstalowany, brak `updates`/`runtimeVersion` w app.json) | — |
| NIE-11 | dotyczy | ok: `testflight.yml` tylko `workflow_dispatch`, zadanie budowy w środowisku `release`; brak automatycznego zgłoszenia do recenzji i automatycznego wydania (dowody/grep-nie11-tor-wydania.txt). Reguły zatwierdzania środowiska `release` — nie sprawdzono (API 403); runbook incydentu brak → D-2 |
| NIE-12 | dotyczy (aplikacja z kopią i przywracaniem, wydania TestFlight) | nie sprawdzono: ćwiczenie przywrócenia na czystej instalacji z licznościami i wymuszona pętla na telefonie bez zapisu z datą; częściowo pokrywa E2E `42-kopia-przywrocenie.yaml` (wyczyść → import, symulator). Przed App Store: warunek wysyłki (kroki w D-5) |
| NIE-13 | nie dotyczy: treści w paczce aplikacji, brak pobierania pakietów (brak `fetch` w kodzie) | — |
| NIE-14 | dotyczy | kopia sprzed migracji zostaje 30 dni i tylko po udanym zapisie (`lib/state/util.ts:42`) — ok; błąd migracji nie prowadzi do pętli, ale też nie do trybu awaryjnego — znalezisko 12-niezawodnosc-001 |

Pozycje wspólne: NIE-01/ARCH-10, NIE-03/ARCH-11, NIE-14/ARCH-08-09, NIE-12/JAK-16 — raportów ról 05 i 07 nie czytałem (polecenie M1), więc pozycje zgłaszam sam z ID; M1 scali duplikaty.

## Znaleziska (szczegóły)

### 12-niezawodnosc-001 · Wyjątek w migracji przy starcie daje pustą aplikację zamiast trybu awaryjnego; kopie po treningu wypierają z puli całą dawną historię, a „Ukryj komunikat” + „Wyczyść” usuwa ostatnią kopię
- Pozycja listy kontrolnej: NIE-14
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `lib/state/boot.ts:87` migracja w tym samym bloku `try` co odczyt JSON; każdy wyjątek (także błąd kodu migracji na czytelnych danych) trafia do `catch` (`lib/state/boot.ts:91-94`), który odkłada zapis pod `state_corrupt_*`, ustawia `setS(null)` (`lib/state/boot.ts:109`) i startuje od danych startowych (`lib/state/boot.ts:133-134`). Kopia po treningu rotuje pulę do 10 najnowszych bez względu na treść (`lib/backup.ts:77`, `lib/backup.ts:84`). Kopia bezpieczeństwa przed czyszczeniem danych dołącza zapis nieczytelny tylko, gdy komunikat jest widoczny (`lib/backup.ts:100`); czyszczenie usuwa `state_corrupt_*` (`lib/state/boot.ts:235`). Sonda A na prawdziwym SQLite (dowody/sonda-ratowanie-zrodlo.txt, wynik dowody/sonda-ratowanie-wynik.txt, exit=0): przed startem 25 treningów w bazie i 10 kopii z 25 treningami; po starcie z migracją rzucającą wyjątek: brak trybu awaryjnego, 0 treningów w aplikacji, 25 w `state_corrupt_*`; po 10 nowych treningach: 0 kopii z dawną historią w puli; po ukryciu komunikatu i wyczyszczeniu danych: 0 miejsc w telefonie z 25 treningami (z widocznym komunikatem: 1 — pole `recovery` w kopii bezpieczeństwa).
- Wzorzec lub źródło: wzorzec roli NIE-14 i zasada roli 1 („Dane użytkownika przed dostępnością”); intencja projektu w `docs/09-plan-testow.md:22` opisuje nieczytelny zapis, nie błąd kodu migracji; recenzje PL (dowody/recenzje-pl-wzorzec.txt): utrata historii po aktualizacji to najcięższy zarzut wobec konkurencji.
- Kroki w aplikacji: aktualizacja do wersji, której migracja (albo normalizacja przy każdym starcie) rzuca wyjątek na danych tego użytkownika → aplikacja otwiera się pusta z banerem „Poprzednich danych nie dało się odczytać” → użytkownik trenuje dalej (10 treningów wypiera kopie z historią) → „Ukryj komunikat” → „Wyczyść wszystkie dane” (np. żeby „zacząć od nowa”). Import dawnej kopii w wersji z błędem też się nie uda (ta sama migracja). W 1.0 warstwa danych jest identyczna jak w 1031 (dowody/diff-1031-head-warstwa-danych.txt), więc pierwsze realne narażenie to błąd normalizacji na nietypowych danych albo następna aktualizacja ze zmianą migracji.
- Opcje: (a) rozróżnić nieczytelny JSON od wyjątku w migracji: wyjątek migracji → tryb jak przy pętli awarii (bez zapisu, ekran z „Wyślij dane”, „Spróbuj ponownie”, „Napisz do nas”), nieczytelny JSON — jak dziś; kompromis: aplikacja do czasu poprawki nie działa, ale niczego nie gubi; (b) zostawić pusty start, ale wstrzymać rotację puli, dopóki istnieje `state_corrupt_*`, i dołączać zapis nieczytelny do każdej kopii bezpieczeństwa niezależnie od ukrycia komunikatu; kompromis: aplikacja działa, pula rośnie, dane rozjeżdżają się na stare i nowe; (c) (a) + część (b) dotycząca kopii bezpieczeństwa. Rekomendacja: (c) — zmiana w `init` i `safetyBackup`, test czerwony najpierw (sonda A jako wzór).
- Test akceptacyjny: start z migracją rzucającą wyjątek na danych z 25 treningami → ekran awaryjny, „state” bajt w bajt bez zmian, pula kopii bez zmian; „Wyślij dane” daje 25 treningów; dla nieczytelnego JSON zachowanie jak dziś, a kopia bezpieczeństwa przed „Wyczyść” zawiera nieczytelny zapis także po „Ukryj komunikat”.
- Status: otwarte

### 12-niezawodnosc-002 · Ekran błędu startu nie ostrzega, że usunięcie aplikacji skasuje dane i kopie; przy bazie, która się nie otwiera, „Wyślij dane” daje tylko ostatnią kopię po treningu albo nic
- Pozycja listy kontrolnej: NIE-01
- Poziom: P1
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: ekran pokazuje tylko miejsce kopii (`components/StartError.tsx:29`) i komunikat o niezmienionych danych (`app/_layout.tsx:65`); ostrzeżenie o znikaniu kopii razem z aplikacją jest wyłącznie na ekranie Kopia zapasowa (`app/more/backup.tsx:32`). Gdy baza się nie otwiera, `openDb` rzuca (`lib/state/db.ts:39-48`), `readRawData` nie ma bazy i „Wyślij dane” udostępnia najnowszy plik z puli (`lib/backup.ts:199-210`); ścieżki kopiowania pliku bazy brak. Sonda B (dowody/sonda-ratowanie-wynik.txt): baza 12 treningów i przerwa domyślna 177 s, kopia w puli 12 treningów i 90 s → wysłano kopię (zmiana po ostatniej kopii przepada); bez kopii w puli (kopia automatyczna wyłączona albo brak treningu) „Wyślij dane” = false. Ekran błędu startu nie ma wyjścia innego niż ponowienie, więc naturalny ruch użytkownika to reinstalacja, która usuwa bazę i folder Backup.
- Wzorzec lub źródło: NIE-01 (ścieżka ratunkowa daje kompletną kopię także przy bazie, która się nie otwiera); sqlite.org/howtocorrupt.html (kopiowanie bazy bez dziennika psuje dane — dotyczy wariantu (b) niżej); tekst samej aplikacji: „Kopie automatyczne znikają razem z aplikacją” (`app/more/backup.tsx:32`).
- Kroki w aplikacji: start kończy się ekranem „Nie udało się otworzyć danych.” (baza nieczytelna albo wyjątek po wczytaniu, który powtarza się przy każdym „Spróbuj ponownie”) → użytkownik usuwa i instaluje aplikację → dane i wszystkie kopie w Plikach znikają. Przy wyjątku po wczytaniu „Wyślij dane” wysyła pełne dane, ale ekran nie mówi, że trzeba to zrobić przed reinstalacją.
- Opcje: (a) jedno zdanie na ekranie błędu startu (35 języków): nie usuwaj aplikacji, najpierw „Wyślij dane” i zapisz plik poza telefonem; kompromis: tani, zależy od przeczytania; (b) dodatkowo przy bazie, która się nie otwiera, kopia pliku bazy razem z plikiem dziennika (`-journal`/`-wal`/`-shm`) do pamięci podręcznej i udostępnienie jej obok kopii JSON (odzysk u dewelopera); kompromis: kod natywnego dostępu do `Library/SQLite` przez expo-file-system [DO USTALENIA], rzadki przypadek; (c) bez zmian, ryzyko nazwane. Rekomendacja: (a) teraz, (b) do backlogu z wersją (decyzja właściciela).
- Test akceptacyjny: test ekranu: `start-error` zawiera tekst ostrzeżenia we wszystkich językach (macierz i słownik); dla (b): przy `openDb` rzucającym „Wyślij dane” udostępnia kopię bazy, której `integrity_check` = ok i liczba treningów = liczba w bazie.
- Status: otwarte

### 12-niezawodnosc-003 · „Napisz do nas” z ekranu błędu startu nie dołącza kodu diagnostycznego ani treści błędu
- Pozycja listy kontrolnej: NIE-06
- Poziom: P2
- Realność: brzegowy · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: przycisk woła `openSupportMail('feedback')` bez parametrów (`components/StartError.tsx:32`); treść wiadomości to tylko stopka wersja/iOS/język (`lib/support.ts:19-21`); kod etapu startu (`diag`) jest tylko do zaznaczenia na ekranie (`components/StartError.tsx:28`) (dowody/grep-ekran-awaryjny-i-kopie.txt).
- Wzorzec lub źródło: NIE-06 i wzorzec roli (właściciel dowiaduje się o awarii przed recenzjami); bez Maca e-mail od użytkownika jest głównym źródłem sygnału po premierze (D-3).
- Kroki w aplikacji: start kończy się ekranem awaryjnym → „Napisz do nas” → e-mail bez etapu startu i treści błędu; właściciel nie wie, czy padło `init`, czy pierwszy ekran.
- Opcje: (a) ekran błędu przekazuje do maila linię `diag` i treść błędu (bez danych osobowych; `bootphase` zawiera tylko etap, czas, schemat, licznik); kompromis: mała zmiana sygnatury `openSupportMail`; (b) bez zmian — użytkownik przepisuje kod. Rekomendacja: (a).
- Test akceptacyjny: test `buildSupportMailto` z `diag` i komunikatem: treść zawiera kod i komunikat, nie zawiera danych treningowych; test ekranu `start-error` → `Linking.openURL` z kodem w treści.
- Status: otwarte

## Do sprawdzenia
- **Kamień milowy jako licznik czasu (NIE-04).** Start uznawany za udany 1,5 s po gotowości albo przy wyjściu do tła (`app/_layout.tsx:48`, `lib/state/crashguard.ts:11`). Natywna awaria w zadaniach po starcie później niż po 1,5 s (np. sklep albo łącze z zegarkiem — hipotezy z L-029) dawałaby pętlę bez ekranu awaryjnego. Brakuje: dowodu, że taka awaria jest możliwa (raporty awarii TestFlight z etapem `stable` w kodzie diagnostycznym). Pewność skutku poniżej 80%.
- **Odczyt pliku bazy z `Library/SQLite` przez expo-file-system** (wariant (b) w 002) — [DO USTALENIA] w dokumentacji expo-file-system 57.
- **Liczba awarii po premierze w App Store Connect w przeglądarce** — strona „Overview of reporting tools” nie wspomina awarii (dowody/zrodla-odczyt.txt); czy App Analytics pokazuje liczbę awarii buildów z App Store — [DO USTALENIA].
- **Pobranie starszego buildu przez testera z TestFlight** a ekran „Dane z nowszej wersji” — przepływ PR-16 zakłada, że cofnięcie wersji przez TestFlight jest nieobsługiwane (`tests/przeplywy.json:1304`); kod obsługuje nowszy schemat bez zapisu, więc skutku dla danych nie widzę, [DO USTALENIA] tylko założenie.

## Co działa dobrze i należy zachować
- Nieczytelny zapis nigdy nie jest nadpisany przed kopią; nieudana kopia przerywa start zamiast startować na pustym (`lib/state/boot.ts:91-108`).
- Tryb awaryjny przy pętli awarii nie wczytuje i nie zmienia danych (sonda C: „state” niezmieniony), licznik odporny na zły zapis (`{"x":1}`, nie-JSON, `null` → start normalny), świeża instalacja bez danych nie trafia w tryb awaryjny (ZK-07).
- Kopia surowego zapisu przed migracją schematu; brak kopii (np. brak miejsca) wstrzymuje zapis zmigrowanego stanu; sprzątanie tylko po udanym zapisie.
- Import: walidacja przed jakąkolwiek zmianą, kopia bezpieczeństwa przed zastąpieniem, powrót do poprzedniego stanu przy nieudanym zapisie (sonda D).
- Kopia po treningu: zapis atomowy, numerowanie w tej samej sekundzie, rotacja po czasie zapisu, znacznik porażki na ekranie Trening.
- Przeniesienie bazy z Dokumentów do `Library/SQLite` w transakcji, stara baza usuwana dopiero po udanym przeniesieniu (testy na prawdziwym SQLite zielone).
- Brak SDK i sieci poza sklepem; tor wydania wyłącznie ręczny; mapa źródeł JS trwale przy tagu wydania.
- Istniejące testy niezawodności: 8 plików, 76 testów zielonych (dowody/jest-istniejace-testy-niezawodnosci.txt).

## Decyzje dla właściciela
- **D-1. Termin naprawy 12-niezawodnosc-001.** (a) teraz, przed zgłoszeniem 1.0 — kompromis: ok. 2–3 h pracy agenta + verify (12 min) + E2E pakietu podstawowego (CI ok. 1 h), bez czasu właściciela; (b) jako warunek pierwszej aktualizacji, która zmienia migrację (1.1) — kompromis: 1.0 wychodzi bez zmian w warstwie danych względem 1031, ale błąd normalizacji na nietypowych danych już w 1.0 skończyłby się pustą aplikacją. Rekomendacja: (a); próg z CLAUDE.md (P1 blokuje) też na to wskazuje.
- **D-2. Runbook i ćwiczenia (brak dokumentów to nie znalezisko).** (a) tryb `build` tej roli od E1 na obecnym kodzie (runbook, ćwiczenia, ewentualnie MetricKit); (b) tylko runbook: gdzie i kiedy patrzeć (TestFlight w przeglądarce co tydzień — już w `docs/34-wsparcie-i-opinie.md:11`), symbolikacja (`npx metro-symbolicate` z mapą przy tagu), kolejność kroków incydentu (wstrzymanie wydania stopniowego wg K-P4-4, nowy build, przyspieszona recenzja, komunikat); (c) bez zmian, ryzyko nazwane. Rekomendacja: (b) przed App Store, ok. 1 h pracy agenta.
- **D-3. Źródło sygnału o awariach po premierze bez Maca.** (a) dostęp do Maca z Xcode Organizer raz w tygodniu; (b) MetricKit w aplikacji z lokalnym zapisem i wysyłką tylko przez użytkownika (bez SDK; moduł natywny, rola 05/10: deklaracja); (c) jak dziś: e-mail i recenzje, w TestFlight liczba awarii buildu. Rekomendacja: (a), jeśli jest dostęp do Maca; inaczej (c) dla 1.0 i (b) do backlogu 1.1 razem z 003.
- **D-4. Kopia sprzed migracji przy „Wyczyść wszystkie dane”.** Dziś ani nie ma drogi jej wysłania z aplikacji (`lib/store.ts:93` tylko reeksport), ani nie trafia do kopii bezpieczeństwa, a „Wyczyść” ją usuwa (decyzja A-2, prywatność). (a) dołączyć ją do kopii bezpieczeństwa przed „Wyczyść” (jak zapis nieczytelny); (b) bez zmian — ratunek po cichej utracie w migracji wymaga poprawki wydanej w 30 dni (`lib/state/util.ts:42`). Rekomendacja: (a), tani dopisek w `safetyBackup`.
- **D-5. Kroki na telefonie (ok. 10 min, przed zgłoszeniem do App Store).** (1) R-005, otwarte w rejestrze ryzyk (`docs/40-lekcje.md:16`) i według CLAUDE.md blokujące wydanie: usuń aplikację → zainstaluj z TestFlight → otwórz → od razu wyjdź do ekranu głównego → otwórz ponownie: ma się otworzyć normalnie. (2) NIE-12: zrób trening → Więcej → Kopia zapasowa → Eksportuj backup do iCloud Drive → usuń aplikację → zainstaluj → Importuj backup → liczba sesji w Historii taka jak przed usunięciem; zapisz datę, build i liczbę sesji w docs/18. (3) Sprawdź w App Store Connect → TestFlight → Crashes, czy są awarie buildów 1030–1031 (wynik: liczba i etap).

## Proponowane polecenie naprawy
`node tools/assemble.mjs 12-niezawodnosc --tryb fix --zadania 12-niezawodnosc-001,12-niezawodnosc-002,12-niezawodnosc-003`
(teksty ekranu awaryjnego w 002 — rola 04/06 i tłumacz; zmiana zachowania przy błędzie migracji — aktualizacja BRD i macierzy w tym samym commicie, CLAUDE.md).

**git status --porcelain** (na końcu pracy, /home/user/trening): pusty — pliki śledzone nietknięte (dowody/git-status-koniec.txt).
