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
| 4 | Macierz | nowa wartość listy (metryka, typ serii, sprzęt, język…) wchodzi do pętli `@matrix`; kombinacje z istniejącymi wymiarami | `tests/matrix-dimensions.test.tsx` |
| 5 | Niezmienniki | nowa akcja dopisana do alfabetu działań losowych sekwencji; nowe reguły spójności jako niezmienniki | `tests/matrix-invariants.test.ts` |
| 6 | Dane | zapis → restart → ten sam stan; eksport → import bez strat; `migrate` idempotentne; CSV, gdy dotyczy | testy logiki/scenariusza |
| 7 | Języki i wygląd | 16 języków (bez polskich tekstów poza pl), kg/lb, motyw jasny/ciemny; nowe teksty w słowniku EN i 14 plikach | `check:i18n`, `tests/i18n-locales.test.ts`, macierz |
| 8 | Regresja | każdy znaleziony błąd: test, który go odtwarza (czerwony przed poprawką) | `tests/regress.test.tsx` lub plik zmiany |
| 9 | E2E na symulatorze | przepływ widoczny dla użytkownika: scenariusz Maestro (nowy albo dopisany krok) | `.maestro/NN-*.yaml` |

## Co pilnuje automatycznie, a co przy przeglądzie

- **Automatycznie (`npm run verify`, commit nie przejdzie):** `check:matrix` — każdy ekran, element UI, komunikat, funkcja `lib/` i wartość
  wymiaru ma test (rodzaje 1, 2, 4); `check:i18n` i test słowników (7); typy (`tsc`); losowe sekwencje (5) przy każdym `jest`.
- **Przy przeglądzie zmiany (agent, przed commitem):** rodzaje 3, 5 (dopisanie akcji), 6, 8, 9 — wiersz w docs/09 wymienia testy każdego rodzaju
  albo powód „nie dotyczy”. Bramka sprawdza obecność testu, nie jego jakość: sama wzmianka tekstu w teście to za mało (CLAUDE.md).
- **Przed buildem:** E2E (`e2e-ios.yml`) zielone na commicie z linii „GOTOWE DO BUILDU” (docs/14).
- **Przy każdym wypchnięciu (decyzja właściciela 06.10.2026, wariant A):** `tests.yml` — pełne `npm run verify` na każdej gałęzi (ubuntu, bez opłat);
  `e2e-ios.yml` samo przy wypchnięciu na `main` i `integration/**` (bez zmian tylko w `docs/` i `*.md`). Bez wyzwalaczy dla PR z forków.
- **Co noc / codziennie:** `nightly.yml` (losowe sekwencje ×1000 z nowym ziarnem, testy mutacyjne, E2E na małym ekranie przy ciemnym wyglądzie),
  `tests-tz.yml` (cały zestaw w 7 strefach czasowych). Harmonogram działa z gałęzi domyślnej (`main`).
- **Testy są trwałe:** każda wersja dokłada swoje testy do tych samych plików/zestawów; test usuwa się albo zmienia tylko przy celowej zmianie
  zachowania, z wpisem w docs/09.

## Stan na 07.10.2026

- Jest: 120 plików testów, 2091 testów (2090 + 1 pominięty celowo: odtwarzanie kontrprzykładu na żądanie).
- Macierz: 944 pozycji, 0 bez testu (`docs/19-macierz-testow.md`).
- Losowe sekwencje: 100 przebiegów na stałym ziarnie przy każdym `jest` (`MATRIX_SEED=random` — dodatkowe ziarna).
- E2E Maestro: 11 scenariuszy (01–11).
