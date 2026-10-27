# Audyt: Programista — Trening (iOS) — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 (HEAD odłączony, sprawdzony na starcie) · Tryb: audit (wariant GŁĘBOKI, M1 przed 1.0) · Środowisko: Linux x86_64, Node 22.22.0, git; bez Xcode, symulatora i telefonu (kod Swift tylko czytany); `gh` bez ważnego tokenu (praca lokalna); sieć przez proxy działa (developer.apple.com, raw.githubusercontent.com: 200) — `dowody/srodowisko.txt`.

## Podsumowanie
Warstwa danych (jeden dokument JSON w tabeli `kv`, kolejka zapisów, kopie bezpieczeństwa, migracje w pamięci z kopią sprzed migracji, zapis zdarzeń zegarka przed potwierdzeniem) jest w dobrym stanie: nie znalazłem ścieżki utraty danych, a zapis ma testy na prawdziwym SQLite (`tests/db-real-sqlite.test.ts`). Najważniejsze ryzyka leżą przy StoreKit i ekranie zakupu. „Zarządzaj subskrypcją” otwiera adres sklepu zamiast systemowego arkusza, więc w TestFlight i w piaskownicy (także u recenzenta Apple) nie widać subskrypcji testowej (T-11). Ekran zakupu nie rozpoznaje też posiadanego planu: nagłówek „5 dni za darmo”, lista planów i „Subskrybuj” przy własnym planie, a karta nie podaje nazwy planu (niezgodnie z docs/27 5.5). Na poziomie procesu decyzja właściciela z 23.10 (kolejność planów) zginęła po drodze, a test pilnował stanu sprzed decyzji. To luka mechanizmu (systemowa): decyzje w docs/18 nie mają strażnika „decyzja → kod → test”. Nie ma znalezisk P0 ani P1. Decyzje: czy poprawić 001 i 002 przed zgłoszeniem 1.0 (tanie, wymagają nowego buildu) oraz jaki mechanizm „decyzja → test” przyjąć.

| ID | Poziom | Rodzaj | Tytuł | Status |
|---|---|---|---|---|
| 08-programista-001 | P2 | D | „Zarządzaj subskrypcją” otwiera stronę App Store zamiast arkusza StoreKit; w TestFlight i piaskownicy nie widać zakupów testowych | otwarte |
| 08-programista-002 | P2 | D | Ekran zakupu nie rozpoznaje posiadanego planu (nagłówek „za darmo”, „Subskrybuj” przy własnym planie, karta bez nazwy planu) | otwarte |
| 08-programista-003 | P2 | P | Decyzje właściciela bez strażnika „decyzja → kod → test”: decyzja z 23.10 nie weszła do kodu, test pilnował starego stanu, zadania gałęzi zginęły | otwarte |
| 08-programista-004 | P2 | D | Udział partii pomocniczej (0,5) wpisany liczbą w dwóch miejscach obok stałej `SECONDARY_SHARE` | otwarte |
| 08-programista-005 | P2 | P | Wiersz „Pełna wersja” w Ustawieniach w stanie darmowym czyta się jak stan, nie jak akcja | otwarte |
| 08-programista-006 | P2 | D | 67 liczbowych `fontSize` w 10 plikach mimo planu przejścia na tokeny przed 1.0 (zapadka zatrzymana) | otwarte |

Liczby: P0 0 · P1 0 · P2 6.

## Linia bazowa i założenia

**Stan projektu (z polecenia M1, nie pytano):** TestFlight 1.0 (build 1031) tuż przed zgłoszeniem; użytkownicy to tylko testerzy; App Store Connect skonfigurowany w pełni (3 produkty, PL 4,99 / 19,99 / 59,99 zł ręcznie, Family Sharing, bez okresu próbnego); rynek główny Polska, 35 języków; standard marki wysoki; próg opłacalności 500 USD (D-024); przegląd treści krytycznych: agentowa bramka 4. `CLAUDE.md` nie ma sekcji „Stan projektu”. Proponowany tekst (do wklejenia przez właściciela): „Stan projektu (27.10.2026): TestFlight 1.0 (build 1031) przed zgłoszeniem; dane tylko testerów; sklep skonfigurowany (M5 S1: 0,99/6,99/14,99 USD, PL 4,99/19,99/59,99 zł, bez próby); rynek PL, potem 35 języków; marka: wysoki standard; próg 500 USD netto/rok; treści krytyczne: recenzja agentowa (bramka 4)”.

**Bramka opłacalności (zasada 20):** wynik jest w `docs/monetyzacja.md`, sekcja „Bramka W0” (21.10.2026, dopisek K8 z 23.10.2026). Model M5 S1 daje normalnie ok. 471 USD/rok, czyli poniżej progu, i właściciel wybrał go świadomie 22.10.2026. Bez STOP.

**E0b: ścieżki zapisu i błędów odtworzone z kodu, zanim przeczytałem testy:**
1. Stan w pamięci → kolejka zapisów `persistNow` (klucze `state`, `cfg`, `live`, numer zapisu zamiast zegara). Trzy zapisy nie są w jednej transakcji, ale każda kombinacja przerwania prowadzi do spójnego stanu przy starcie: `live`/`cfg` nakłada się tylko z wyższym numerem.
2. Szkice edycji (`drafts`), znaczniki startu (`bootguard`, `bootphase`), stan kopii (`backupstat`) i ostatni wynik sklepu (`access`) to osobne wiersze `kv` zapisywane poza kolejką. Nie są częścią stanu, a w aplikacji nie ma transakcji, w które mogłyby wpaść.
3. Start: nieczytelny zapis trafia do `state_corrupt_*` razem z `live` i `cfg`, nigdy go nie nadpisujemy. Dane z nowszego schematu: blokada z wysłaniem danych. Migracja zostawia kopię sprzed migracji (`premigrate_*`, 30 dni).
4. Import kopii i CSV: najpierw parsowanie i `migrate` (błąd = brak zmian), potem kopia bezpieczeństwa w Plikach (błąd przerywa), na końcu `flushStrict` z cofnięciem w pamięci i komunikatem.
5. „Wyczyść wszystkie dane”: kopia bezpieczeństwa, potem reset i usunięcie kopii technicznych.
6. Koniec, anulowanie i usunięcie treningu, edycja historii, trening wstecz: zmiana w pamięci, `flush` i kopia automatyczna w Plikach. Porażka kopii daje baner.
7. Zegarek: zdarzenie → reducer z deduplikacją → `persistNow` → dopiero potem `ack` (bez zapisu nie ma potwierdzenia i zegarek ponawia).
8. Apple Zdrowie: znacznik „czeka”, zapis z ponowieniem. Własną kopię usuwamy tylko filtrem „id sesji + źródło = ta aplikacja”.
9. StoreKit: odczyt uprawnień (błąd = `unknown`, nigdy `free`), zakup, przywracanie, kod, zarządzanie (ta ostatnia ścieżka → 001).

**Wymiary pokrycia (kontrakt roli):**
- Ścieżki zapisu: sprawdzone (lista wyżej). Brak znalezisk.
- Obsługa błędów: baner błędu zapisu, baner porażki kopii, ekran błędu startu z wysłaniem danych, komunikaty importu. Puste `catch` mają komentarz z powodem. Brak znalezisk w danych. Na ekranie zakupu „Potrzebne połączenie z internetem” pada na każdy błąd zarządzania (drobne, w 001).
- Typy na granicach: `migrate` działa jak parser danych z bazy i importu (testy `migrate-unknown`, `migrate-released`), a wiersze StoreKit są sprawdzane `typeof` (`lib/store-native.ts`). `any` występuje wewnątrz `migrate`, za walidacją. Bez znaleziska.
- System projektowy: zapadka tokenów zatrzymana → 006.
- i18n: `npm run check:i18n` exit 0 (`dowody/check-i18n.txt`). Teksty bez `t()` są tylko w panelu sztucznego sklepu E2E i są opisane.
- Wydajność: interwały 250 ms w `components/ActiveWorkout.tsx` rysują ponownie tylko wtedy, gdy timer działa. Pełny zapis stanu idzie przy zmianie historii, a trening w toku małym kluczem `live`. Brak znalezisk.
- Testy na właściwym poziomie: logika czysta (`lib/access.ts`) jest testowana bez telefonu, a SQLite prawdziwe (`node:sqlite`). Luka jest jedna: atrapa `expo-iap` modeluje „zarządzanie subskrypcją” jako arkusz systemowy, a biblioteka otwiera adres (przyczyna 001).
- Dostępność w komponentach: role i etykiety są na ekranie zakupu i w karcie. Przy dużym tekście (T-04) brak dowodu z urządzenia → „Do sprawdzenia”.
- Liczby konfiguracyjne: duplikat 0,5 → 004.

**Soczewki (bez subagentów, po kolei):**
- (1) Użytkownik, któremu zapis przerwano w połowie: przeszedłem wszystkie kombinacje przerwania `state`/`cfg`/`live`, import, reset i zegarek. Bez luki.
- (2) Recenzent szukający ścieżki bez testu: `deepLinkToSubscriptions` ma test tylko na atrapie → 001. Stan „posiadacz subskrypcji” na ekranie zakupu nie ma asercji → 002 (sonda).
- (3) Programista czytający moduł pierwszy raz: komentarz adaptera „Systemowy arkusz zarządzania subskrypcją” (`lib/store-adapter.ts:44`) jest sprzeczny z działaniem biblioteki. Do tego dochodzi literał 0,5 obok stałej (004).
- (4) Użytkownik VoiceOver albo z dużym tekstem: T-04 (ikony ucięte przy największym tekście) → „Do sprawdzenia” z miejscami w kodzie. Na wiersz „Pełna wersja” VoiceOver mówi „przycisk”, ale wzrokowo czyta się on jak stan (005).

**Wzorzec najlepszych w klasie (przeczytane źródła):**
- Apple, StoreKit `AppStore.showManageSubscriptions(in:)` (odczyt 27.10.2026, `dowody/apple-showmanagesubscriptions.txt`): „Use this function to display the manage subscriptions sheet within your app.” oraz „Test the managing subscriptions functionality in the sandbox environment and StoreKit testing in Xcode.” Wniosek dla aplikacji: zarządzanie w arkuszu systemowym, które da się sprawdzić w TestFlight (001).
- Specyfikacja projektu docs/27 5.5 (`docs/27-subskrypcja-spec.md:314`) wymienia stan „aktywna subskrypcja (plan, data odnowienia”. Wniosek: ekran zakupu ma znać posiadany plan (002).
- Wzorzec roli (kontrakt): każda ścieżka zapisu i błędu ma test, który potrafi paść. Projekt spełnia to w warstwie danych (prawdziwe SQLite, testy własności, mutacje). Słabiej wypadają integracje z biblioteką natywną, gdzie atrapa zastępuje semantykę.
- Recenzji konkurencji w polskim App Store nie czytałem (obszar ról 01 i 02, bez wpływu na wzorzec kodu).

**Rejestr założeń:** `docs/zalozenia.md` nie istnieje. Zmian statusu nie proponuję. Brak rejestru zgłaszam roli 01/03 (poza obszarem programisty).

### E0: decyzje właściciela w obszarze kodu → kod → test-strażnik → wynik

| Decyzja (data, miejsce) | Kod | Test-strażnik | Wynik |
|---|---|---|---|
| M5 S1: limit 5 dni treningowych, blokada tylko startu ponad limit (22.10, `docs/18-przekazanie.md:441`) | `lib/access.ts:25`, `lib/access.ts:239` | `tests/access.test.ts`, `tests/m5s1-dni-treningowe.test.ts` | zgodne |
| (A) ekran zakupu tylko przy starcie ponad limit i z Ustawień (22.10, `docs/18-przekazanie.md:442`) | `lib/entitlement.ts:108`, `components/SubscriptionCard.tsx:16` | `tests/subscription-ui.test.tsx` | zgodne |
| (B) nagłówek ekranu z Ustawień (22.10, `docs/18-przekazanie.md:442`) | `app/paywall.tsx:66` | `tests/subscription-ui.test.tsx` | zgodne; pokazywany też posiadaczowi Pro → 002 |
| (C) nazwy planów (22.10, `docs/18-przekazanie.md:442`) | `app/paywall.tsx:24` | `tests/subscription-i18n.test.ts` | zgodne |
| Prośba o ocenę po 3. treningu (22.10, `docs/18-przekazanie.md:443`) | `lib/review.ts:14` | `tests/review.test.ts` | zgodne |
| Tekst przy starcie ponad limit, wariant B (22.10, `docs/18-przekazanie.md:444`) | `app/paywall.tsx:63` | `tests/subscription-i18n.test.ts` | zgodne |
| Trening wstecz i import nie zużywają dnia; dni zapisane osobno; migracja z historii; `expo-iap` przypięty 5.8.1; błąd sklepu = „nieznany” (22.10, `docs/18-przekazanie.md:445`) | `lib/state/finish.ts:91`, `lib/state/finish.ts:114`, `lib/state/migrate-live.ts:16`, `package.json:43`, `lib/entitlement.ts:63` | `tests/m5s1-dni-zapis.test.ts:173`, `tests/limity-wydan.json`, `tests/monetyzacja-csv.test.ts` | zgodne |
| Próg dnia 7 minut (23.10, `docs/18-przekazanie.md:484`) | `lib/access.ts:31` | `tests/m5s1-dni-zapis.test.ts:23` | zgodne |
| Kolejność planów miesięczny–roczny–dożywotni, domyślnie miesięczny (23.10, `docs/18-przekazanie.md:481`) | `lib/products.ts:19`, `app/paywall.tsx:36` (stara kolejność) | `tests/m5s1-bez-proby.test.ts:86` pilnuje STAREJ kolejności | niewdrożona; 27.10 ok. 17:00 zastąpiona decyzją, że kolejność zostaje jak w kodzie, więc nie jest znaleziskiem. Luka mechanizmu → 003 |
| Pozostałe pozycje gałęzi `naprawa-m1-dec07-ui`, m.in. „sprawdzenie Zarządzaj subskrypcją w TestFlight” (23.10, `docs/przekazanie-koordynatora-2026-10-23.md:48`) | scalono tylko K9 (`dowody/decyzja-kolejnosc-planow.txt`) | brak | niewykonane → 001, 003 |
| K1 jedna nazwa Pełna wersja (23.10, `docs/18-przekazanie.md:470`) | `app/_layout.tsx:119` | `tests/subscription-ui.test.tsx` (tytuł Full version) | zgodne |
| K9 ≤ 1 stuknięcie do odhaczonej serii (23.10, `docs/18-przekazanie.md:470`) | stan wyjściowy | `tests/dec07-k9-stukniecia.test.tsx` | zgodne |
| Domyślny motyw ciemny dla nowej instalacji (23.10, `docs/18-przekazanie.md:485`) | `lib/seed.ts:273` | `tests/domyslny-motyw.test.ts` | zgodne |
| DEC-05 zapowiedzi głosowe domyślnie wyłączone (20.10, `docs/18-przekazanie.md:327`) | `lib/seed.ts:323` | `tests/audit-m1-027-voice-default.test.ts` | zgodne |
| System miar nowej instalacji z regionu (20.10, `docs/18-przekazanie.md:333`) | `lib/state/boot.ts:135` | `tests/audit-m1-lok07-02-default-system.test.ts` | zgodne |
| ZM-07 pole `haptics` bez zmiany schematu (21.10, `docs/18-przekazanie.md:422`) | `lib/haptics.ts:15` | `tests/m3-p5d-haptics-done.test.tsx`, `tests/fixtures/p5d-zapis-starej-wersji.json` | zgodne |
| Manifest prywatności w `app.json` (21.10, `docs/18-przekazanie.md:395`) | `app.json:66` | `tests/privacy-manifest.test.ts` | zgodne w źródle; gotowy pakiet sprawdza tylko CI (nie sprawdzono tu) |
| Ikona zegarka przez pole `icon:` (22.10, `docs/18-przekazanie.md:429`) | `targets/watch-app/expo-target.config.js:8` | `tests/watch-availability.test.ts` | zgodne w źródle; walidacja Apple tylko w CI |
| Dopisek „plan zmieniony w …” w pasku tygodnia (22.10, `docs/18-przekazanie.md:437`) | `lib/plan.ts:62` | `tests/postep-tygodnia-zmiana-planu.test.tsx` | zgodne |
| Tryb cichy: wskazówka przy dźwięku (23.10, `docs/18-przekazanie.md:498`) | `app/more/settings.tsx:44` | `tests/tryb-cichy-wskazowka.test.tsx` | zgodne |
| Okno „Uczciwe zasady” raz, tylko `free` (25.10, `docs/18-przekazanie.md:515`, `docs/18-przekazanie.md:534`) | `lib/fairrules.ts:18` | `tests/monetyzacja-ui.test.tsx` | zgodne |
| Sekcja „Technika” domyślnie rozwinięta, zwinięta przy `?cues=0` (27.10, `docs/18-przekazanie.md:600`) | `app/exercise/[id].tsx:41` | `tests/audit-k1-fala2b.test.tsx` | zgodne; przypadek zwiniętej sekcji w treningu nie ma dziś drogi wejścia (zapisane w samej decyzji) |
| P3 B, P6 A, P7 A (12.10, docs/27; komentarze `lib/access.ts:16`) | `lib/access.ts:26`, `lib/access.ts:27` | `tests/access.test.ts`, `tests/audit-m1-012-status.test.ts` | zgodne |

`docs/decyzje.md`, `docs/sztafeta.md`, `docs/adr/` i `docs/architektura/` nie istnieją. Decyzje są w docs/18, a architektura w komentarzach modułów i w BRD.

## Pokrycie (co sprawdzono, czego nie)
| Obszar / pliki / ekrany | Sprawdzone? | Jak (plik dowodu) |
|---|---|---|
| Rdzeń zapisu: `lib/state/core.ts`, `lib/state/db.ts`, `lib/state/boot.ts`, `lib/state/crashguard.ts`, `lib/state/bootphase.ts`, `lib/state/util.ts` | tak, całe | czytanie kodu; `dowody/jest-wybrane.txt` (db-real-sqlite) |
| Koniec treningu, historia, dni limitu: `lib/state/finish.ts`, `lib/state/migrate-live.ts` | tak, całe | czytanie kodu |
| Kopie, import, CSV, reset: `lib/backup.ts`, `lib/csvimport.ts` (zapis), `app/more/backup.tsx`, `app/more/settings.tsx` (reset) | tak (zapis i błędy) | czytanie kodu |
| Migracje `lib/state/migrate.ts`, `lib/state/migrate-records.ts`, `lib/state/migrate-catalog.ts` | częściowo (nagłówki, kolejność, liveDays, `fairrules`) | testy `migrate-released`, `migrate-idem`, `migrate-unknown` istnieją; wynik zbiorczy w audit/M1-2026-10-27/wspolne/jest-podsumowanie.txt |
| Pozostałe moduły `lib/state/*` (sets, live, start, swap, templates…) | nie czytane wiersz po wierszu | pokrycie testami przez fasadę `lib/store` (`dowody/dev01-moduly-testy.txt`) |
| StoreKit: `lib/store-adapter.ts`, `lib/store-native.ts`, `lib/store-fake.ts`, `lib/products.ts`, `lib/entitlement.ts`, `lib/access.ts`, `app/paywall.tsx`, `components/SubscriptionCard.tsx` | tak, całe | `dowody/zarzadzaj-subskrypcja.txt`, `dowody/sonda-paywall-posiadacz.txt` |
| Biblioteka `expo-iap` 5.8.1 (JS) i OpenIAP Apple 3.6.0 (Swift, pobrane źródło) | wybrane funkcje (zakup, ceny, zarządzanie) | `dowody/zarzadzaj-subskrypcja.txt` |
| Zegarek, telefon: `modules/watch-link/*`, `lib/watch/link.ts`, `lib/watch/apply.ts` | tak | czytanie kodu |
| Zegarek, Swift: `targets/watch-app/*` | częściowo (trwałość, kolejka) | nie uruchomiono (brak macOS) |
| Moduły natywne `modules/rest-activity`, `modules/voice-cue` | tak (czytanie) | nie uruchomiono |
| Apple Zdrowie `lib/health.ts` (zapis, usuwanie własnej kopii) | częściowo | czytanie kodu |
| Konfiguracja buildu: `app.json`, `plugins/withoutPushEntitlement.js`, `package.json` | tak | czytanie |
| Ekran Trening przy dużym tekście (T-04) | nie (wymaga urządzenia lub symulatora) | „Do sprawdzenia” |
| Ceny w USD na liście planów (T-11) | kod sprawdzony; przyczyny nie ustalono | „Do sprawdzenia” |
| Sekrety w plikach i historii | tak | `dowody/sekrety.txt` |
| Osłabione testy, historia testów | tak | `dowody/testy-oslabione.txt`, `dowody/testy-historia.txt` |
| Testy razem z kodem (DEV-02) | tak, próbka | `dowody/dev02-proba.txt` |
| BRD i reguły z wektorami | tak | `dowody/brd-kontrola.txt` |
| Typecheck, lint, Jest (pełne) | wynik wspólny E0 (nie powtarzano) | audit/M1-2026-10-27/wspolne/typecheck.txt, audit/M1-2026-10-27/wspolne/lint.txt, audit/M1-2026-10-27/wspolne/jest-podsumowanie.txt |

## Kontrola dowodów i sekretów
- Sekrety: w plikach śledzonych brak trafień wzorców kluczy, a w historii nigdy nie dodano plików `.env`/`.p8`/`.p12`/`.pem`/`.key`/`.mobileprovision`/`.cer`. Zmienne `EXPO_PUBLIC_*` (BUILD_NUMBER, PSEUDO, STORE_FAKE, WATCH_FAKE) nie niosą sekretów (`dowody/sekrety.txt`). `appleTeamId` w `app.json` to identyfikator publiczny, nie sekret.
- Raport nie zawiera e-maili, UDID, sekretów ani nazw innych aplikacji. Cytaty ze źródeł mają najwyżej 1–2 zdania.
- Treść z zewnątrz: w kodzie biblioteki i w dokumentacji Apple nie było poleceń skierowanych do agenta.
- Wynik `sprawdz-raport.mjs` (`dowody/sprawdz-raport.txt`): `node audit/M1-2026-10-27/narzedzia/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 08-programista` → „OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone; format raportu 08-programista”, exit 0.

## Stosowalność listy kontrolnej
| Pozycja | Status (dotyczy / nie dotyczy + powód / decyzja D-xx) | Wynik (ok / znalezisko ID / nie sprawdzono + powód) |
|---|---|---|
| DEV-01 | dotyczy | ok: logika limitu i dostępu czysta (`lib/access.ts`); BRD 49 BR i 4 RD z 21 wektorami, kontrola 0 błędów, 1 uwaga („RD-04: brak wektora błędnych danych”, `dowody/brd-kontrola.txt`); każdy moduł `lib/` ma test bezpośrednio albo przez fasadę (`dowody/dev01-moduly-testy.txt`) |
| DEV-02 | dotyczy | ok: 10/10 ostatnich commitów zmieniających zachowanie ma test w tym samym commicie (f7cad151, 03723210, 968967b7, c6b1c813, 7a45540d, 71da7166, 2dee115f, c82b6e7e, fdb0a700, b58b98ae); w szerszej próbce 1 bez testu (7d8548e3, geometria rysunku) — `dowody/dev02-proba.txt` |
| DEV-03 | dotyczy | ok: 2 pominięcia warunkowe z powodem (replay macierzy, strefa DST); usunięte testy 7a45540d (historyczne wpisy „Co nowego” przy pustej historii 1.0) mają powód w commicie — `dowody/testy-oslabione.txt`, `dowody/testy-historia.txt` |
| DEV-04 | dotyczy | ok: typecheck exit 0, lint exit 0 (0 błędów, 104 ostrzeżenia), Jest 497/497 zestawów, 10326 zielonych, 1 pominięty (wspólne E0); wybrane pliki ponownie: 4/4, 96 testów (`dowody/jest-wybrane.txt`) |
| DEV-05 | dotyczy (moduł sqlite-expo) | ok: jedna tabela `kv` (klucz-wartość), bez kluczy obcych i dzieci; `INSERT OR REPLACE` ustawia obie kolumny (tabela-liść, nie znalezisko); jedyna transakcja to przeniesienie bazy przed innymi zapisami (`lib/state/db.ts:24`); brak `withExclusiveTransactionAsync` |
| DEV-06 | dotyczy | ok: migracje JSON w pamięci z kopią surowego zapisu przed migracją (`premigrate_*`) i testami na zapisach z wydanych buildów (`tests/fixtures/released`); kopie zapasowe to eksport JSON stanu (bez kopiowania pliku `.db`, więc problem WAL nie występuje) |
| DEV-07 | dotyczy | ok (próbka `lib/state/sets.ts`, `lib/stats.ts`, `lib/progress.ts`): `|| 0` / `?? 0` tylko w sumach i maksimach, gdzie 0 znaczy zero; brakujące wartości serii zostają `''` |
| DEV-08 | dotyczy | ok (próbka): `tsOf` odrzuca daty spoza zakresu; przerwa liczona od `endAt` (`lib/watch/link.ts` migawka), nie od ticków |
| DEV-09 | dotyczy | ok z uwagą: dane z bazy i importu przechodzą przez `migrate` (parser z białą listą pól); wiersze StoreKit sprawdzane `typeof` po `as Rec` (`lib/store-native.ts`) — bez zgadywania typu |
| DEV-10 | dotyczy | ok: nieudany zapis stanu → baner „Nie udało się zapisać danych”; import i reset z kopią bezpieczeństwa i komunikatem; drobne: każdy błąd „Zarządzaj subskrypcją” opisany jako brak internetu (w 001) |
| DEV-11 | dotyczy | znalezisko 08-programista-006 |
| DEV-12 | dotyczy | ok: `check:i18n` exit 0 (`dowody/check-i18n.txt`); liczba mnoga przez `tp`; wyjątek: panel sztucznego sklepu tylko w buildzie E2E (opisany w kodzie) |
| DEV-13 | dotyczy | znalezisko 08-programista-004 |
| DEV-14 | dotyczy | ok (`dowody/sekrety.txt`) |
| DEV-15 | dotyczy | ok: interwały i nasłuchy w `useEffect` mają sprzątanie; blokada wygaszania z parą `activateKeepAwakeAsync`/`deactivateKeepAwake` (`components/ActiveWorkout.tsx:52`) |
| DEV-16 | dotyczy | ok (próbka): czasy z jednostką w nazwie (`CALL_TIMEOUT_MS`, `tzOffsetMin`, `endAtMs`, `durationSec`); `Settings.defaultRest` w sekundach bez jednostki w nazwie, bez pomyłki (styl, nie zgłaszam) |

## Znaleziska (szczegóły)

### 08-programista-001 · „Zarządzaj subskrypcją” otwiera stronę App Store zamiast arkusza StoreKit; w TestFlight i piaskownicy nie widać zakupów testowych
- Pozycja listy kontrolnej: brak pozycji DEV (wymiar „testy na właściwym poziomie”; atrapa zastępuje działanie biblioteki)
- Poziom: P2
- Realność: realny (każdy tester TestFlight i recenzent Apple w piaskownicy) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód:
  - `lib/store-native.ts:126` „await m.deepLinkToSubscriptions()”.
  - W `expo-iap` 5.8.1 funkcja na iOS woła `deepLinkToSubscriptionsIOS`, czyli `node_modules/expo-iap/src/modules/ios.ts:379` „Linking.openURL('https://apps.apple.com/account/subscriptions')”.
  - Biblioteka ma też arkusz systemowy `showManageSubscriptionsIOS` (`node_modules/expo-iap/src/modules/ios.ts:186`), który w OpenIAP 3.6.0 woła `AppStore.showManageSubscriptions(in: scene)`.
  - Komentarz kontraktu `lib/store-adapter.ts:44` „Systemowy arkusz zarządzania subskrypcją” nie zgadza się z działaniem biblioteki, a test sprawdza tylko licznik wywołań na atrapie (`tests/subscription-ui.test.tsx:85`).
  - Pełny zapis: `dowody/zarzadzaj-subskrypcja.txt`. Objaw z telefonu (T-11): w TestFlight otwiera się lista produkcyjna bez zakupów testowych. Sprawdzenie tego w TestFlight było zaplanowane 23.10 i nie zostało wykonane (`docs/przekazanie-koordynatora-2026-10-23.md:48`).
- Wzorzec lub źródło: Apple, „showManageSubscriptions(in:)” (odczyt 27.10.2026, `dowody/apple-showmanagesubscriptions.txt`): „Use this function to display the manage subscriptions sheet within your app.” oraz „Test the managing subscriptions functionality in the sandbox environment and StoreKit testing in Xcode.”
- Kroki w aplikacji: kup subskrypcję w TestFlight → Ustawienia → Pełna wersja → „Zarządzaj subskrypcją”. Otwiera się App Store (konto produkcyjne), subskrypcji testowej nie ma i nie da się jej anulować ani zmienić z aplikacji. W wersji ze sklepu użytkownik opuszcza aplikację. Czy strona pokazuje wtedy prawdziwą subskrypcję, sprawdzimy dopiero po wydaniu [DO USTALENIA].
- Opcje: (a) `manageSubscriptions` przez `showManageSubscriptionsIOS()` (arkusz w aplikacji, działa w piaskownicy; zwraca zmienione zakupy, więc można od razu odświeżyć uprawnienia). Kompromis: nowy build i 1 min na telefonie. (b) Zostawić adres. Kompromis: w TestFlight nie da się sprawdzić zarządzania, a recenzent Apple może uznać przycisk za niedziałający (ryzyko niskie, niepotwierdzone). Rekomendacja: (a) przed zgłoszeniem 1.0, jeśli i tak powstaje nowy build. Inaczej 1.0.1.
- Test akceptacyjny: test kontraktu na makiecie `expo-iap` sprawdza, że `manageSubscriptions` woła `showManageSubscriptionsIOS`, a nie `deepLinkToSubscriptions`, i że po powrocie są odświeżane uprawnienia; na telefonie w TestFlight arkusz pokazuje subskrypcję testową.
- Status: otwarte

### 08-programista-002 · Ekran zakupu nie rozpoznaje posiadanego planu (nagłówek „za darmo”, „Subskrybuj” przy własnym planie, karta bez nazwy planu)
- Pozycja listy kontrolnej: brak pozycji DEV (zgodność kodu ze specyfikacją docs/27 5.5; wymiar „obsługa stanów”)
- Poziom: P2
- Realność: realny (każdy subskrybent, który otwiera Ustawienia → Pełna wersja) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód:
  - Nagłówek z limitem jest renderowany zawsze poza `reason=limit`, także przy aktywnym uprawnieniu: `app/paywall.tsx:66` „testID="paywall-headline"”.
  - Lista planów i przycisk zależą tylko od „nie dożywotni”: `app/paywall.tsx:76` „{!lifetime ? <>”. Domyślny wybór to roczny niezależnie od posiadanego (`app/paywall.tsx:36` „useState<EntitlementPlan>('yearly')”).
  - Karta posiadania nie ma nazwy planu: `app/paywall.tsx:69` „t('Masz dostęp na zawsze') : t('Masz pełną wersję')”. Dla subskrypcji odnawianej pokazuje „Dostęp do {data}” (`app/paywall.tsx:71` „t('Dostęp do {date}', { date: fmtDate(view.active.expiresAt) })”), co sugeruje koniec dostępu, a specyfikacja mówi o dacie odnowienia (`docs/27-subskrypcja-spec.md:314` „aktywna subskrypcja (plan, data odnowienia”).
  - Ostrzeżenie o podwójnym płaceniu przy dożywotnim pojawia się dopiero po zakupie (`app/paywall.tsx:72`).
  - Sonda w kopii roboczej dla posiadacza rocznej subskrypcji: karta posiadania jest, nagłówek jest, plany `yearly, monthly, lifetime`, zaznaczony `plan-yearly` (własny), przycisk „Subskrybuj” jest, nazwy planu na karcie brak (`dowody/sonda-paywall-posiadacz.txt`, exit 0).
- Wzorzec lub źródło: docs/27 5.5 (specyfikacja projektu). Uwaga T-11 z telefonu właściciela (build 1031).
- Kroki w aplikacji: kup plan roczny → Ustawienia → „Pełna wersja”. Na górze jest „Trenuj 5 dni w miesiącu za darmo. Pro zdejmuje limit…”, karta mówi „Masz pełną wersję / Dostęp do …” bez nazwy planu, a niżej zaznaczony jest Twój plan z przyciskiem „Subskrybuj”. Wybór „Trening to moje życie” → „Kup na zawsze” nie ostrzega przed zakupem, że subskrypcja dalej się odnawia.
- Opcje: (a) Stan „posiadacz”: bez nagłówka o darmowych dniach; karta z nazwą planu i „Odnawia się {data}” (z kodu: „Dostęp z kodu do …”); lista planów bez posiadanego, z pozostałymi jako zmiana planu; przed „Kup na zawsze” przy aktywnej subskrypcji zdanie o anulowaniu. Kompromis: zmiana tekstów w 35 językach i przegląd roli 04. (b) Minimum: nazwa planu na karcie, posiadany plan oznaczony „Twój plan” bez przycisku, nagłówek ukryty przy aktywnym uprawnieniu. Kompromis: mniej tekstów, zmiana planu dalej możliwa. Rekomendacja: (b) w tym samym buildzie co 001, jeśli właściciel chce poprawki przed zgłoszeniem. Inaczej (a) w 1.0.1. Wygląd i teksty zatwierdza rola 04 (zasada 15).
- Test akceptacyjny: test ekranu dla posiadacza miesięcznej, rocznej, z kodu i z Chmury rodzinnej sprawdza: brak `paywall-headline`, nazwę planu na karcie, brak przycisku zakupu przy posiadanym planie, zdanie o anulowaniu przed zakupem dożywotniego przy aktywnej subskrypcji. Do tego scenariusz Maestro 21 rozszerzony o widok po zakupie.
- Status: otwarte

### 08-programista-003 · Decyzje właściciela bez strażnika „decyzja → kod → test”: decyzja z 23.10 nie weszła do kodu, test pilnował starego stanu, zadania gałęzi zginęły
- Pozycja listy kontrolnej: brak pozycji DEV (E0b: brak; mechanizm pracy)
- Poziom: P2 (ocena zakresu: systemowa)
- Realność: realny (już wystąpił) · Pewność: wysoka
- Rodzaj: P (decyzja produktowa i procesowa)
- Dowód:
  - Decyzja z 23.10 (`docs/18-przekazanie.md:481` „kolejność planów **miesięczny, roczny, dożywotni**”) miała iść gałęzią `naprawa-m1-dec07-ui` razem z K1, K3, K9, ZK-05, ZK-06 i sprawdzeniem „Zarządzaj subskrypcją” w TestFlight (`docs/przekazanie-koordynatora-2026-10-23.md:48`).
  - Scalenie 99563b1e (25.10) zawierało jeden commit, tylko K9.
  - Kod został przy starej kolejności (`lib/products.ts:19` „export const PLAN_ORDER”), a test utrwalał stan sprzed decyzji (`tests/m5s1-bez-proby.test.ts:86` „kolejność planów bez zmian: roczny, miesięczny, dożywotni”).
  - Żaden dokument nie odnotował, że pozostałe pozycje nie weszły (`dowody/decyzja-kolejnosc-planow.txt`). Build 1031 trafił do właściciela niezgodny z jego decyzją, a zaplanowane sprawdzenie w TestFlight się nie odbyło (por. 001).
  - Sama kolejność nie jest znaleziskiem, bo 27.10 właściciel ją zatwierdził.
  - W pozostałych ok. 20 decyzjach z tabeli E0 strażniki istnieją, ale tylko dlatego, że ktoś je dopisał. Nic nie wymusza powiązania decyzji z testem.
- Wzorzec lub źródło: CLAUDE.md („Akcja ma być mechanizmem (test, strażnik w CI, krok listy kontrolnej…)”); zasada 2 i 4 wspólnych (rejestr, nie pamięć).
- Kroki w aplikacji: brak (proces). Skutek widać w aplikacji: kolejność planów w buildzie 1031 inna niż w zapisanej decyzji.
- Opcje: (a) Rejestr `decyzje-kod.json`: każda decyzja z docs/18 od dziś dostaje wpis {data, linia docs/18, pliki kodu, test-strażnik albo „bez kodu” z powodem}. Test w Jest sprawdza, że każda nowa pozycja „właściciel” w docs/18 ma wpis i że wskazany test istnieje. Kompromis: ok. 1 h pracy agenta i dyscyplina przy każdej decyzji, ale działa automatycznie. (b) Krok listy kontrolnej przy scalaniu gałęzi napraw: lista zadań gałęzi ze stanem (zrobione / przeniesione / porzucone, z datą) w opisie PR, a hak sprawdza obecność tej listy. Kompromis: tańsze, łapie zgubione zadania, ale nie decyzje spoza gałęzi. (c) Oba. Rekomendacja: (c). Najpierw (b) (kilka minut), (a) w 1.0.1.
- Test akceptacyjny: test-strażnik pada, gdy w docs/18 przybywa decyzja właściciela bez wpisu w rejestrze; PR gałęzi napraw bez listy zadań ze stanem nie przechodzi kontroli.
- Status: otwarte

### 08-programista-004 · Udział partii pomocniczej (0,5) wpisany liczbą w dwóch miejscach obok stałej `SECONDARY_SHARE`
- Pozycja listy kontrolnej: DEV-13
- Poziom: P2
- Realność: teoretyczny dziś (wartości równe), realny przy zmianie stałej · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: stała ze źródłem `lib/setSplit.ts:13` „export const SECONDARY_SHARE = 0.5”; ta sama wielkość jako literał w objętości na partię `lib/stats.ts:351` „(out[mu] ?? 0) + v * 0.5” i w Progresji `lib/progress.ts:57` „e.volume * 0.5”.
- Wzorzec lub źródło: CLAUDE.md („Liczby (progi, limity, czasy) w jednym miejscu”).
- Kroki w aplikacji: dziś brak różnicy. Po zmianie `SECONDARY_SHARE` paski serii i objętość na partię w Postępach liczyłyby się inaczej.
- Opcje: zamiana literałów na `SECONDARY_SHARE` (5 min) — jedyna sensowna. Rekomendacja: przy najbliższej zmianie kodu.
- Test akceptacyjny: test zmienia `SECONDARY_SHARE` (atrapa modułu) i sprawdza, że `volumeByMuscle` i Progresja liczą udział pomocniczej według stałej. Do tego grep-strażnik na `* 0.5` przy `secondaryMuscles`.
- Status: otwarte

### 08-programista-005 · Wiersz „Pełna wersja” w Ustawieniach w stanie darmowym czyta się jak stan, nie jak akcja
- Pozycja listy kontrolnej: brak pozycji DEV (wymiar „dostępność w komponentach”; wygląd i tekst należą do roli 04)
- Poziom: P2
- Realność: realny (każdy użytkownik darmowy) · Pewność: średnia (ocena czytelności; zgłoszone z telefonu T-11)
- Rodzaj: P (decyzja produktowa)
- Dowód: tytuł jest stały niezależnie od stanu: `components/SubscriptionCard.tsx:16` „<Item title={t('Pełna wersja')}”. W stanie darmowym podpis to licznik dni, więc wiersz brzmi „Pełna wersja — Darmowe dni treningowe…: wykorzystano 2 z 5”. VoiceOver ogłasza przycisk, ale wzrokowo jedyną wskazówką akcji jest znak „›”.
- Wzorzec lub źródło: docs/32 (wzorce interakcji, spójne etykiety akcji); uwaga T-11.
- Kroki w aplikacji: użytkownik darmowy → Więcej → Ustawienia → sekcja „Subskrypcja”.
- Opcje: (a) tytuł zależny od stanu: darmowy „Zobacz plany Pro”, z dostępem „Pełna wersja”. Kompromis: nowy tekst w 35 językach. (b) Zostawić tytuł i dodać przycisk „Zobacz plany” pod licznikiem. Kompromis: dodatkowy element. Rekomendacja: (a) w 1.0.1, po decyzji roli 04 (K1 z 23.10 ustala nazwę ekranu, nie etykietę akcji).
- Test akceptacyjny: test karty w stanach free, full, lifetime sprawdza tytuł i etykietę VoiceOver.
- Status: otwarte

### 08-programista-006 · 67 liczbowych `fontSize` w 10 plikach mimo planu przejścia na tokeny przed 1.0 (zapadka zatrzymana)
- Pozycja listy kontrolnej: DEV-11
- Poziom: P2
- Realność: realny (styl tekstu poza systemem ról typografii; skalowanie tekstu działa, ale bez reguł roli) · Pewność: wysoka
- Rodzaj: D (defekt)
- Dowód: `dowody/dev11-tokeny.txt`: 67 wystąpień, najwięcej w `components/GuardSection.tsx` (25) i `components/Dashboard.tsx` (18). Zapadka tests/token-baseline.json opisuje przejście „w partiach p2–p5”, a M3 jest scalone, choć te pliki zostały. Strażnik `tests/m3-token-guard.test.ts` pilnuje tylko, żeby liczba nie rosła.
- Wzorzec lub źródło: design-spec §11 i wymóg 04-011 (`docs/design/design-spec.md:103`).
- Kroki w aplikacji: Postępy (sekcja strażnika partii) i kafelki statystyk mają rozmiary spoza ról typografii. Widać to głównie przy dużym tekście i porównaniu z resztą ekranu.
- Opcje: (a) dokończyć migrację w 1.0.1 (ok. 1 h agenta, zrzuty kontrolne). (b) Zapisać pliki jako świadomy wyjątek z powodem. Rekomendacja: (a), decyzja roli 04.
- Test akceptacyjny: zapadka bez tych 10 plików (lista pusta), zrzuty Postępów przy dużym tekście bez regresji.
- Status: otwarte

## Do sprawdzenia (pewność ≤ 80%)
- **T-11, ceny w USD na liście planów, a arkusz Apple pobiera PLN.** Kod pokazuje wyłącznie `displayPrice` z StoreKit: `lib/store-native.ts:57`, a OpenIAP 3.6.0 przekazuje `product.displayPrice` bez zmian (`dowody/zarzadzaj-subskrypcja.txt`). Plik `.storekit` nie jest podpięty do buildu. Wartości 0.99/6.99/14.99 to ceny bazowe USA, więc StoreKit zwrócił produkty dla witryny USA. Przyczyny w kodzie nie znalazłem. Brakuje odczytu `Storefront.current` i `priceFormatStyle.currencyCode` na telefonie [DO USTALENIA]. Krok właściciela (5 min): na telefonie testerki Ustawienia → App Store → konto piaskownicy, region konta; potem usunięcie i ponowna instalacja aplikacji i ponowne otwarcie ekranu. Krok agenta (opcja): diagnostyczny wiersz kraju witryny w panelu testowym TestFlight.
- **T-04, ikony ucięte przy największym tekście na ekranie Trening.** Kandydaci w kodzie: znacznik dnia w pojemniku o stałej wysokości `components/TodayPlan.tsx:66` „height: 20, alignItems: 'center'” w kolumnie 1/7 szerokości obok liczb rosnących do `NUM_SCALE_MAX`. „Duża szara ikona startu” nie ma jednoznacznego odpowiednika w `components/StartPanel.tsx` [DO USTALENIA]. Krok: zrzut symulatora przy AX5 (e2e-ios, scenariusz dostępności) i porównanie z telefonem. Właściwa rola: 04.
- **Zapowiedź głosowa przerywana przez poprzednią.** Delegat nie sprawdza, której wypowiedzi dotyczy zdarzenie (`modules/voice-cue/ios/VoiceCueModule.swift:78` „didCancel u: AVSpeechUtterance) { done(false) }”), a `VoiceCueModule` podmienia delegata przy każdej zapowiedzi (`modules/voice-cue/ios/VoiceCueModule.swift:46`). Spóźnione `didCancel` poprzedniej wypowiedzi może zakończyć nową. Brakuje dowodu, czy iOS dostarcza `didCancel` po podmianie delegata. Krok: dwa szybkie odhaczenia serii z głosem na telefonie.
- **Kolejność odświeżenia uprawnień.** `refreshEntitlements` łączy wywołania z trwającym (`lib/entitlement.ts:62` „if (inflight) return inflight;”), a `restorePurchases` (`lib/entitlement.ts:125`) stosuje wynik obok. Starsze odświeżenie może nadpisać świeży wynik przywracania. Właściciel potwierdził, że przywracanie po reinstalacji działa, więc brakuje drogi przez UI.
- **Kod Swift zegarka i Live Activity** nie był uruchomiony (brak macOS). Testy `targets/watch-tests` biegną w CI. Nie twierdzę, że są zielone na tym commicie.

## Co działa dobrze i należy zachować
- Kolejka zapisów z numerem zapisu zamiast zegara. Nieczytelny zapis nigdy nie jest nadpisywany. Kopia sprzed migracji leży 30 dni. Strażnik pętli awarii z diagnostyką etapu.
- Import i reset: najpierw walidacja, potem kopia bezpieczeństwa w Plikach, zapis z `flushStrict` i cofnięcie w pamięci przy błędzie, bez fałszywego „Zaimportowano”.
- Zegarek: zdarzenie trafia do bazy przed `ack`, z deduplikacją po `eventId` i czasie, a kolejka natywna przeżywa wybudzenie w tle.
- StoreKit: błąd odczytu daje `unknown`, nigdy `free`; karencja płatności i zapamiętany wynik offline z 7 dniami; ceny wyłącznie z App Store; przypięta wersja biblioteki ze strażnikiem.
- Testy: prawdziwe SQLite dla warstwy bazy, testy własności, mutacje, macierz, zapisy z wydanych buildów, 10/10 commitów z testem.

## Decyzje dla właściciela
1. **001 i 002 przed zgłoszeniem 1.0 czy w 1.0.1?** (a) Teraz, jednym buildem: arkusz zarządzania StoreKit i minimalny stan „posiadacz” (002 b). Agent pracuje ok. 1–2 h. Czekamy na E2E pakietu podstawowego i TestFlight (kolejka maszyn macOS). Właściciel sprawdza na telefonie ok. 5 min. (b) W 1.0.1. Wydanie bez opóźnienia, ale recenzent Apple trafi na przycisk otwierający stronę bez subskrypcji testowej. Rekomendacja: (a), jeśli build 1.0 i tak będzie powtarzany. Inaczej (b) z zapisem ryzyka R-… w docs/40.
2. **Mechanizm „decyzja → test” (003):** (a) rejestr z testem, (b) lista zadań gałęzi przy scalaniu, (c) oba. Rekomendacja: (c), zaczynając od (b). Lekcja do docs/40 (ocena: systemowa) dopisuje koordynator w tej sesji audytu.
3. **Etykieta „Pełna wersja” (005) i tokeny (006):** decyzja roli 04; rekomendacja 1.0.1.
4. Rejestr założeń `docs/zalozenia.md` nie istnieje. Czy ma powstać (rola 01/03)? Rekomendacja: tak, po wydaniu 1.0.

## Proponowane polecenie naprawy
`node tools/assemble.mjs 08-programista --tryb fix --zadania 08-programista-001,08-programista-002,08-programista-004`
(003 to zmiana procesu dla koordynatora, 005 i 006 przez rolę 04.)

Na koniec `git status --porcelain` w /home/user/trening: pusty wynik (pliki śledzone nietknięte; katalog audit/ wykluczony w .git/info/exclude; kopia robocza sondy w scratchpadzie usunięta po sondzie: `git worktree remove --force`).
