# 20. Definicja ukończenia funkcjonalności — pełen zakres testów automatycznych

Zasada właściciela z 06.10.2026: „każda funkcjonalność ma mieć przy wdrażaniu full scope zautomatyzowanych testów każdych przypadków
i każdego rodzaju”. Funkcjonalność (nowa albo zmieniona) jest skończona dopiero, gdy ma wszystkie rodzaje testów poniżej, które jej dotyczą.
Brak któregoś rodzaju wymaga zapisanego powodu w docs/09 (wiersz tej zmiany), np. „funkcja bez UI — nie dotyczy”.

## Rodzaje testów (każdy, który ma zastosowanie)

| # | Rodzaj | Co sprawdza | Gdzie |
|---|---|---|---|
| 1 | Logika | każda nowa/zmieniona funkcja `lib/`: zwykły przypadek, puste dane, granice, złe dane, kg/lb | `tests/*.test.ts` |
| 2 | Ekran | każdy nowy element UI i komunikat pokazuje się na prawdziwym ekranie, a naciśnięcie/wpis daje skutek w danych | `tests/*.test.tsx` (`renderApp`) |
| 3 | Scenariusz | przepływ użytkownika od początku do końca, z restartem aplikacji w trakcie, gdy funkcja trzyma stan | `tests/scenario-full.test.tsx` lub nowy |
| 4 | Macierz | nowa wartość listy (metryka, typ serii, sprzęt, język…) jest w teście, który iteruje po stałej z `lib/` (wymiary generuje bramka z eksportowanych tablic i typów-unii — 09.10.2026, audyt 0.10 M5); kombinacje z istniejącymi wymiarami; nowy ekran — w przeglądzie dostępności i macierzy języków (trasy generowane z `app/`) | `tests/matrix-dim-*.test.tsx`, `tests/matrix-dim-langs-routes.test.tsx`, `tests/matrix-a11y.test.tsx` |
| 5 | Niezmienniki | nowa akcja dopisana do alfabetu działań losowych sekwencji; nowe reguły spójności jako niezmienniki | `tests/matrix-invariants.test.ts` |
| 6 | Dane | zapis → restart → ten sam stan; eksport → import bez strat; `migrate` idempotentne; CSV, gdy dotyczy; zmiana normalizacji przy starcie (inny wynik `migrate` na zapisie poprzedniego builda) = podbicie `SCHEMA_VERSION` i zapis odcisków (DEC-03 b, 27.10.2026; reguła w docs/brd NFR-DAN-001) | testy logiki/scenariusza; strażnik `tests/audit-m1-2026-10-27-014-normalizacja-schemat.test.ts` |
| 7 | Języki i wygląd | wszystkie języki z `LANGS` (liczba z kodu, nie z tego dokumentu; bez polskich tekstów poza pl), system miar metryczny/imperialny, motyw jasny/ciemny; nowe teksty w słowniku EN i w plikach wszystkich języków | `check:i18n`, `tests/i18n-locales.test.ts`, macierz |
| 8 | Regresja | każdy znaleziony błąd: test, który go odtwarza (czerwony przed poprawką) | `tests/regress.test.tsx` lub plik zmiany |
| 9 | E2E na symulatorze | przepływ widoczny dla użytkownika: scenariusz Maestro (nowy albo dopisany krok) | `.maestro/NN-*.yaml` |
| 10 | Katalog przepływów | (13.10.2026) nowy ekran albo funkcja = przepływ w katalogu ze scenariuszem Maestro albo wyjątkiem z powodem; ekran bez przepływu blokuje verify | `tests/przeplywy.json`, `tests/przeplywy.test.ts`, docs/37–39 |

## Co pilnuje automatycznie, a co przy przeglądzie

- **Automatycznie (`npm run verify`, commit nie przejdzie):** `check:matrix` — każdy ekran, element UI, komunikat, funkcja `lib/` i wartość
  wymiaru ma test (rodzaje 1, 2, 4); od 09.10.2026 (audyt 0.10 M5) dowodem jest tylko KOD testu — wzmianka w komentarzu, tytule testu albo
  w imporcie się nie liczy, a wymiary (tablice stałych i typy-unie z `lib/`) bramka generuje sama; `check:i18n` (kod → słownik) i test martwych
  kluczy (słownik → kod, `tests/audit-0.10-tst.test.ts`) (7); typy (`tsc`); `check:claims` — każdy tekst dziedzinowy interfejsu ma wpis w rejestrze twierdzeń (`docs/research/rejestr-twierdzen.json`), zmiana brzmienia wymaga ponownego przeglądu (M1-048); losowe sekwencje (5) przy każdym `jest`; każda trasa z `app/`
  w przeglądzie dostępności i macierzy wszystkich języków z `LANGS` (`tests/routes.ts`).
- **Przy przeglądzie zmiany (agent, przed commitem):** rodzaje 3, 5 (dopisanie akcji), 6, 8, 9 — wiersz w docs/09 wymienia testy każdego rodzaju
  albo powód „nie dotyczy”. Bramka sprawdza obecność testu, nie jego jakość: sama wzmianka tekstu w teście to za mało (CLAUDE.md).
- **Przed buildem (TestFlight):** pakiet podstawowy E2E (`e2e-ios.yml`, `scripts/ci/e2e-podstawowy.json`, jedno ponowienie pojedynczego scenariusza) zielony na commicie wydania — blokuje `testflight.yml`; **pełny katalog** biegnie nocą (`nightly.yml`), niewiążąco, z pomiarem niestabilności; przed App Store jeden pełny katalog E2E na standardowym iPhonie z jednym ponowieniem scenariusza; scenariusz czerwony z winy skryptu (potwierdzony logiem/zrzutem) nie blokuje (decyzje właściciela zapisane w CLAUDE.md, sekcja „E2E — podział”, które jest źródłem tej bramki; M1-audytor-generalny-023).
- **Przy każdym wypchnięciu (decyzja właściciela 06.10.2026, wariant A):** `tests.yml` — pełne `npm run verify` na każdej gałęzi (ubuntu, bez opłat);
  `e2e-ios.yml` samo przy wypchnięciu na `main` i `integration/**` (bez zmian tylko w `docs/` i `*.md`; domyślnie pakiet podstawowy). Bez wyzwalaczy dla PR z forków.
- **Co noc / codziennie:** `nightly.yml` (losowe sekwencje ×1000 z nowym ziarnem, testy mutacyjne, E2E na małym ekranie przy ciemnym wyglądzie),
  `tests-tz.yml` (cały zestaw w 7 strefach czasowych). Harmonogram działa z gałęzi domyślnej, ale testuje gałęzie ze zmiennej `NIGHTLY_REFS` (domyślnie `main` + gałąź wydania; audyt 0.10 M1).
- **Testy są trwałe:** każda wersja dokłada swoje testy do tych samych plików/zestawów; test usuwa się albo zmienia tylko przy celowej zmianie
  zachowania, z wpisem w docs/09.

## Stan

Liczby (pliki, testy, pozycje macierzy, scenariusze E2E) nie są tu przepisywane ręcznie (audyt 0.10 TST-10): macierz — `docs/19-macierz-testow.md`
(generowany, `node scripts/test-matrix.mjs --write`), wyniki przebiegów i testów mutacyjnych — wiersze docs/09 z datą, E2E — `.maestro/config.yaml`.
Losowe sekwencje: 100 przebiegów na stałym ziarnie przy każdym `jest`, nocą `MATRIX_SEED=random` (`nightly.yml`). Pozostałe testy
własności (fast-check) — tak samo (TST2-07, 09.10.2026): stałe ziarno przy każdym wypchnięciu, nocą `PROP_SEED=random`; ziarno przebiegu
w logu Jest (`tests/global-setup.js`), odtworzenie `PROP_SEED=<liczba> npx jest <plik>` (jedno miejsce: `tests/prop-seed.js`).
