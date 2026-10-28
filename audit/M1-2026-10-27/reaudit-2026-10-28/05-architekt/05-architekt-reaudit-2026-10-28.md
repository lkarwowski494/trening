# Ponowny audyt: Architekt systemu — Trening (iOS + watchOS) — 2026-10-28
Commit: 2385e75aeb3880c0c90ba5edd69145a1c6d80b01 (main po naprawach M2, HEAD odłączony — sprawdzone `git rev-parse HEAD`) · Tryb: reaudit, pętla 1 · Baza: 025a50b96f504ea9d16d573720d1e92dc951a103 · Środowisko: Linux x86_64, Node v22.22.0; sondy w `git worktree` w scratchpadzie (usunięty na końcu), `node_modules` z repo przez dowiązanie; testy pojedynczo `--maxWorkers=1`; brak Xcode, symulatora i telefonu; workflowów nie uruchamiano. Typecheck i lint: wspólne wyniki (kod 0).

Ostatni nagłówek promptu roli (przeczytanego do linii 669): „## Kontrola dowodów i sekretów przed oddaniem raportu”.

## Podsumowanie

Wszystkie cztery ID tej roli mają dowód z 2385e75. M1-003 (notatka serii) i M1-015 (błąd zapisu na miejscu) są naprawione w kodzie i mają zielone testy; M1-014 (reguła „zmiana normalizacji = podbicie schematu”) ma strażnika, który na celowo zmienionej normalizacji w kopii kodu daje czerwień na 4 zapisach wzorcowych; M1-035 jest w backlogu 1.1 ze strażnikiem limitu. Przegląd różnicy w warstwie danych (symbol masy 10a, ratunkowa kopia plików bazy, wyjątek migracji, pamięć końca dostępu, RIR→RPE) nie pokazał ścieżki utraty danych: etykieta lokalna nie trafia do zapisu, CSV ani kopii (sonda round-trip w ru/uk/el/sr/bg × kg/lb: 10/10). Nowe: jedno znalezisko P2 (istniało wcześniej) — strażnik limitu rozmiaru pomija `lib/figures`. P0/P1 nowych brak.

| ID | Źródło M1 | Wynik | Dowód (skrót) |
|---|---|---|---|
| 05-architekt-001 | M1-audytor-generalny-003 | zweryfikowane | jedna stała `SET_NOTE_MAX = 500` w imporcie i obu oknach; test 3/3 (dowody/jest-003-notatka-serii-ponowienie.txt) |
| 05-architekt-002 | M1-audytor-generalny-014 | zweryfikowane | reguła w BRD NFR-DAN-001 i docs/18; strażnik 16/16 zielony, celowa zmiana → 4 czerwone, kod 1 (dowody/sonda-014-celowy-blad.txt) |
| 05-architekt-003 | M1-audytor-generalny-015 | zweryfikowane | okno „Nie udało się zapisać danych” w układzie głównym; test 2/2 (dowody/jest-015-blad-zapisu.txt) |
| 05-architekt-004 | M1-audytor-generalny-035 | zweryfikowane (wg planu: backlog z wersją + strażnik) | docs/21 pozycja 1.1; strażnik 4/4; zasięg strażnika → 05-architekt-601 |
| 05-architekt-601 | — (nowe) | istniało wcześniej, P2 | strażnik limitu pomija katalog `figures` (3 pliki > 20 KB bez progu) |

Liczby nowych znalezisk: P0 = 0, P1 = 0, P2 = 1 (istniało wcześniej).

## Weryfikacja ID źródłowych

### 05-architekt-001 (M1-audytor-generalny-003) — zweryfikowane
- Jedna wartość: `lib/state/util.ts:44` „export const SET_NOTE_MAX = 500;”; import: `lib/csvcore.ts:16` „export const IMPORT_NOTE_MAX = SET_NOTE_MAX;”; edycja historii `app/history/edit/[id].tsx:113` i trening w toku `components/WorkoutBlocks.tsx:137` — obie „clampName((v ?? '').trim(), SET_NOTE_MAX)”.
- Test `npx jest tests/audit-m1-2026-10-27-003-notatka-serii.test.tsx --maxWorkers=1`: pierwszy przebieg kod 1 — scenariusz przekroczył domyślny limit 5 s Jesta (9056 ms) przy obciążeniu maszyny współdzielonej (load 4,97 na 4 rdzeniach), dwa testy logiki zielone (dowody/jest-003-notatka-serii.txt); ponowienie z `--testTimeout=60000`: 3/3, scenariusz 1172 ms, kod 0 (dowody/jest-003-notatka-serii-ponowienie.txt). Wniosek: kod poprawny; uwaga o limicie czasu testu w sekcji „Uwagi”.
- Reszta z dowodu pierwotnego (bez utraty danych, nie zgłaszam ponownie): notatka treningu ma pole 1000 znaków (`components/ActiveWorkout.tsx:194`) wobec 500 w imporcie — import nie przekracza pola, więc tekst nie ginie.

### 05-architekt-002 (M1-audytor-generalny-014) — zweryfikowane
- Reguła: `docs/brd/wymagania.md:846` (NFR-DAN-001), wpis decyzji `docs/18-przekazanie.md:606` (DEC-03 b, 27.10.2026). `SCHEMA_VERSION` bez zmian w różnicy (19, `lib/seed.ts:12`); kopia `premigrate_*` przy zmianie schematu: `lib/state/boot.ts:97`.
- Strażnik na 2385e75: 16 zielonych, 1 pominięty (zapis odcisków), kod 0 (dowody/jest-014-normalizacja-schemat.txt).
- Weryfikacja przeciwna (kopia kodu w worktree, cofnięta): `migrate()` przycina `defaultRest` do 100 s przy tym samym schemacie (dowody/sonda-014-celowy-blad.diff.txt) → 4 czerwone („settings (zmieniony)” na zapisach b1005, b1017, b1018, b1032), kod 1 (dowody/sonda-014-celowy-blad.txt). Strażnik działa także na nowym zapisie wzorcowym z 1.0.
- Wydane migracje: `git diff 025a50b..2385e75 -- lib/state/migrate*.ts lib/seed.ts` — pusty; `tests/migrate-released.test.ts` 13/13, kod 0 (dowody/jest-migrate-released.txt).
- Otwarte pytanie z wyniku naprawy (scalenia katalogu `LIB_MERGED` a reguła) — w docs/18 brak rozstrzygnięcia; to decyzja właściciela, nie znalezisko (sekcja „Decyzje dla właściciela”).

### 05-architekt-003 (M1-audytor-generalny-015) — zweryfikowane
- `app/_layout.tsx:100` „Alert.alert(t('Nie udało się zapisać danych'), undefined, [okButton(), { text: t('Spróbuj ponownie')” — komponent w układzie głównym, więc okno pojawia się na każdym ekranie, jedno na epizod błędu; dane zostają w pamięci do ponowienia.
- Test 2/2, kod 0 (dowody/jest-015-blad-zapisu.txt): edycja sesji z historii przy `__dbFail` → okno od razu, „Spróbuj ponownie” zapisuje zmianę; trzy nieudane zapisy w ustawieniach → jedno okno.

### 05-architekt-004 (M1-audytor-generalny-035) — zweryfikowane wg planu (backlog z wersją)
- Backlog: `docs/21-roadmapa-offline.md:160` (wersja 1.1, lista plików). Strażnik `tests/architecture-limits.test.ts` 4/4, kod 0 (dowody/jest-architecture-limits.txt); test akceptacyjny M2 2/2 (dowody/jest-035-duze-pliki.txt).
- `granice.mjs` na 2385e75 (dowody/granice-2385e75.txt): 16 plików ponad 20 KB bez generowanych i słowników, cykli importów brak. Pliki z listy wyjątków urosły w różnicy w granicach progu (np. `lib/backup.ts` 21 309 → 21 773 B, próg 22 528). Nowy moduł `lib/rescue.ts` powstał właśnie po to, żeby nie tworzyć cyklu z `lib/backup.ts` — skrypt cyklu nie zgłasza.
- Zasięg strażnika (katalog `figures` pominięty) → nowe 05-architekt-601.

## Przegląd różnicy 025a50b..2385e75 w obszarze roli

| Zmiana | Ryzyko dla danych | Wynik |
|---|---|---|
| Symbol masy lokalnie (5ca7577, decyzja 10a): `lib/units.ts`, `lib/state/sets.ts`, `lib/equipment.ts`, `lib/live.ts`, `lib/board.ts` | etykieta „кг/фнт/κιλά” w zapisie, CSV albo kopii | ok — wartość logiczna `lib/units.ts:16` bez zmian, etykieta tylko w `unitLabel`/`withLabel` (`lib/units.ts:21`, `lib/units.ts:96`); CSV bierze jednostkę z `wu()` i pisze łacinką `'lb', 'm'` (`lib/backup.ts:132`, `lib/backup.ts:140`); ustawienie zapisuje `'kg'`/`'lb'` z opcji (`app/more/settings.tsx:37`); klucz pamięci statystyk używa wartości logicznej (`lib/stats.ts:120`); kod Swift zegarka i widżetu nie porównuje jednostki (grep „unit” w `*.swift`: 0 trafień) — dostaje gotowy tekst. Sonda round-trip ru/uk/el/sr/bg × kg/lb: nagłówek i wiersze CSV bez cyrylicy i greki, `parseImport` czyta 1 sesję, `parseBackup(buildBackup())` zwraca identyczne treningi i tę samą jednostkę — 10/10, kod 0 (dowody/sonda-10a-roundtrip.txt, skrypt sondy: dowody/sonda-10a-roundtrip.test.ts.txt). Testy projektu: `tests/units-label.test.ts` 42/42 (dowody/jest-units-label.txt), `tests/csv-jednostka-eksportu.test.ts` 5/5 (dowody/jest-csv-jednostka-eksportu.txt). |
| Kopia ratunkowa plików bazy (451862d, M1-004): `lib/rescue.ts`, `lib/backup.ts` | przeniesienie lub nadpisanie oryginału | ok — tylko kopiowanie (`lib/rescue.ts:28`), komplet plików bazy z dziennikiem, każdy błąd → null; uruchamiana tylko gdy surowego zapisu nie da się wysłać. Plik nie opuszcza urządzenia bez działania użytkownika. |
| Wyjątek migracji przy starcie (8f3fb6f, M1-013): `lib/state/boot.ts` | odłożenie czytelnych danych pod `state_corrupt_*` i start od czystego stanu | ok — wyjątek kodu migracji oznaczany `migrationFailed` (`lib/state/boot.ts:92`) i przepuszczany bez żadnego zapisu (`lib/state/boot.ts:99`); zły kształt zapisu („bad state”) dalej idzie ścieżką odkładania. Test 3/3 (dowody/jest-audit-m1-2026-10-27-013-wyjatek-migracji.txt). |
| Pamięć końca dostępu (M1-002): `lib/entitlement.ts`, `lib/access.ts` | nowe pole w kluczu `kv` „access” | ok — pole opcjonalne `endedAt` (`lib/entitlement.ts:36`), stara wersja je pomija; zapis `INSERT OR REPLACE` na tabeli bez tabel podrzędnych (ARCH-07 nie dotyczy, jak w audycie). Klucz nie wchodzi do stanu ani kopii. |
| RIR → RPE (7fb4f1a, M1-020): `lib/state/effort.ts` | przeliczenie zapisanych RPE | ok — zmienia tylko wpis nowej wartości; zapisane RPE bez zmian, strażnik normalizacji zielony (dane wzorcowe bez zmian). |
| `SET_NOTE_MAX` (e66902b): `lib/state/util.ts`, `lib/csvcore.ts`, `lib/store.ts` | — | ok — 05-architekt-001. |
| Arkusz subskrypcji (f775eb5): `lib/store-native.ts` | — | brak wpływu na dane (wywołanie arkusza systemowego, zapas na starą ścieżkę). |

Zasada 10 (zero utraty danych): dla każdej zmiany warstwy danych w różnicy ścieżka zapisu albo jest tylko do odczytu, albo dodaje pole opcjonalne, albo jest objęta strażnikiem normalizacji. Odtworzenie liczności nie było potrzebne — w różnicy nie ma nowego `DELETE`, `REPLACE` na tabeli z dziećmi ani zmiany migracji.

## Próbka regresji (pozycje spoza zmienionych plików)

| Pozycja | Pliki (bez zmian w różnicy) | Wynik |
|---|---|---|
| ARCH-17 | `lib/state/db.ts`, `lib/state/core.ts`, repozytoria | ok — zapytań z `${` albo konkatenacją: 0; `execAsync` tylko ze stałym SQL (2 trafienia) (dowody/regresja-arch17.txt) |
| ARCH-21 | pliki śledzone | ok — plików kluczy 0; wzorców kluczy poza `tests/` 0; `EXPO_PUBLIC_*` tylko przełączniki i numer buildu (dowody/regresja-arch21.txt) |
| ARCH-15 | `app.json`, `targets/watch-app/Info.plist`, `scripts/verify-native.mjs` | ok — aplikacja bez `UIBackgroundModes` i lokalizacji, zegarek tylko `workout-processing`, strażnik w verify-native (dowody/regresja-arch15.txt) |

## Znaleziska (szczegóły)

### 05-architekt-601 · Strażnik limitu rozmiaru pomija katalog z kodem figur, więc rosnące tam pliki nie blokują verify
- Pozycja listy kontrolnej: ARCH-04
- Poziom: P2
- Realność: realny (koszt utrzymania; pliki figur są teraz intensywnie zmieniane w bramce 4) · Pewność: wysoka
- Rodzaj: D
- Dowód: `tests/architecture-limits.test.ts:9` „const SKIP_DIRS = new Set(['locales', 'cues', 'figures', 'node_modules']);” — katalog `figures` wyłączony razem z danymi i słownikami, choć zawiera kod; `granice.mjs` (dowody/granice-2385e75.txt): `lib/figures/v2/contract.ts` 32,9 KB, `lib/figures/geom.ts` 22,5 KB, `lib/figures/v2/draw.ts` 20,5 KB — bez progu na liście wyjątków.
- Mechanizm: wyłączenie po nazwie katalogu zamiast po rodzaju pliku (dane JSON vs kod TS); `git show 025a50b:tests/architecture-limits.test.ts` ma to samo wyłączenie, rozmiary tych plików bez zmian w różnicy → istniało wcześniej.
- Powraca: 05-architekt-004 / M1-audytor-generalny-035 (test akceptacyjny: „nowy plik ponad limit blokuje verify”) → trwała kontrola w `tests/architecture-limits.test.ts`.
- Wzorzec lub źródło: zasada architekta 7 (pliki do ok. 20 KB, sprawdzane skryptem).
- Kroki w aplikacji: brak (utrzymanie kodu).
- Opcje: (a) pomijać w `figures` tylko pliki danych (`*.json`), a trzy pliki TS dopisać do listy wyjątków z progiem — kompromis: jedna zmiana testu, figury dalej mogą rosnąć do progu; (b) zostawić wyłączenie i opisać powód w teście — kompromis: brak ochrony przed rozrostem kodu rysowania. Rekomendacja: (a), po 1.0 razem z pozycją backlogu M1-035.
- Test akceptacyjny: `tests/architecture-limits.test.ts` obejmuje pliki `.ts` w `lib/figures`; nowy plik TS > 20 KB w tym katalogu daje czerwień.
- Status: otwarte (istniało wcześniej — poza bieżącą pętlą, do decyzji właściciela)

## Uwagi (bez znaleziska)

- Test scenariuszowy M1-003 nie ustawia własnego limitu czasu (domyślne 5 s), a test M1-015 w tym samym stylu ustawia 60 s. Na maszynie współdzielonej scenariusz trwał 9 s i padł na limicie; w CI (`tests.yml` zielone wg raportu M2) przeszedł. Obszar roli 07 — do rozważenia `jest.setTimeout` w pliku testu, żeby nie dawał fałszywej czerwieni przy pracy równoległej.

## Otwarte poza main (wypis, nie znaleziska)

- 9a: eksport figur strony tylko po recenzji — gałąź `naprawy/M2-po-decyzjach-eksport-figur`, poza main.
- Propozycje A/B w lekcjach L-047 (samoocena figur) i L-048 (strażniki słowników) w docs/40 — czekają na decyzję właściciela.
- Backlog 1.0.1 w docs/21 (m.in. Reverse Lunge, Push Press, Pendlay Row ukryte do 1.0.1).

## Decyzje dla właściciela

1. Z wyniku naprawy M1-014: czy przepięcia odwołań przez scalenia w katalogu (`LIB_MERGED`) też podbijają numer schematu — (1) tak, bez wyjątków (kopia sprzed zmiany; starsze wersje odrzucą nowe kopie zapasowe), (2) nazwany wyjątek z własnym znacznikiem rewizji i testem 1:1. Rekomendacja wykonawcy naprawy: (1). Rozstrzygnięcia w docs/18 nie ma.
2. 05-architekt-601 — opcja (a) albo (b) z sekcji znaleziska.

## Kontrola dowodów i sekretów

Wynik `node audit/M1-2026-10-27/reaudit-2026-10-28/sprawdz-raport.mjs <raport> /home/user/trening <katalog roli> --rola 05-architekt`: dowody/sprawdz-raport.txt (ostatni przebieg: kod 0); `git status --porcelain` w `/home/user/trening` po usunięciu worktree: 0 linii — pliki śledzone nietknięte; HEAD 2385e75 bez zmian; worktree sondy usunięty (`git worktree list` bez wpisu roli).

Nie sprawdzono (wymaga telefonu): wygląd lokalnych symboli na ekranie i zegarku w ru/el oraz zachowanie kopii ratunkowej plików bazy na prawdziwym urządzeniu (krok: ekran błędu startu → „Wyślij dane”, potem Pliki → Backup → folder Rescue-…).
