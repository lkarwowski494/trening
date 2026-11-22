# STAN sesji AM (automat odczytu ASC, KO-100/KO-106) — 22.11.2026

Gałąź `ci/asc-analityka` @ 089ff0f27 (kod i testy) + commit ze stanem. Koordynator: session_01BM51odgG7NSW2dnk3ZgwQ4.

## Zrobione
- E0 wykonalność i inwentarz 15 kategorii: `asc-analityka-wykonalnosc.md` (sekcje 1–10).
- Kroki właściciela: `asc-analityka-kroki-wlasciciela.md`.
- Kod: `scripts/asc/na-zywo.mjs` (odczyt, w tym zgłoszenia do recenzji), `scripts/asc/analityka.mjs` (Discovery i Downloads Standard; jedyny zapis `--zapisz-zadanie`), szablon `scripts/asc/prywatne-repo/asc-dane.yml`; `tests/asc-analityka.test.ts` (30 testów); `verify:lekkie` zielone.
- Przebiegi dowodowe w prywatnym repo (wg koordynatora): 45011742965 odczyt — success (wersja READY_FOR_SALE, 32 lokalizacje wersji i informacji, 2 zgłoszenia, 175 terytoriów); 45012222900 z zapisz_zadanie — żądanie ONGOING utworzone i potwierdzone w usłudze („aktywne”).

## Zrobione po recenzji AN (22.11.2026)
- Poprawki 001–004 (a6b66e1e6), wykonalność (c)/(d) (sekcja 11), wdrożenie KO-121 (sekcja 12): recenzje, ceny, raporty Commerce; 52 testy w `tests/asc-analityka.test.ts`.

## Zostało / czeka
- Recenzja niezależna (sesja AN): do wyniku kodu na gałęzi nie zmieniam, poza poprawkami na prośbę koordynatora.
- Droga 2 sprzedaży (salesReports, numer dostawcy) odłożona do oceny po pierwszych danych; wydajność (perfPowerMetrics), TestFlight — nieczytane.
- Pierwsze dane Analytics po 1–2 dniach od żądania (22.11); wtedy pierwszy odczyt rozstrzygnie format segmentu i nazwy raportów.
- Otwarte [DO USTALENIA]: próg stoppedDueToInactivity (tydzień może nie wystarczyć → cron dzienny), stany appInfo, typ klucza dla sprzedaży/finansów (Team).

## Następny krok
Poprawki po recenzji AN, potem na polecenie koordynatora (c) w kolejności z sekcji 9 pliku wykonalności.

## Pułapki
- `verify:docs` wymaga `git fetch --unshallow origin` i odniesienia `origin/integracja-1-1` (`npm run verify:docs -- origin/integracja-1-1`); hak pre-push chce znacznika, więc przed wypchnięciem `npm run verify:lekkie`.
- Jest nie ma dynamicznego `import()` bez flagi — funkcje ESM w testach wołane w procesie potomnym.
