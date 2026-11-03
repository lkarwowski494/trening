# Pliki wpisów recenzenta (L-047-A, decyzja właściciela 03.11.2026)

Źródłem prawdy dla skrótu `sha` (i werdyktu) wpisu karty jest plik, który zapisuje **recenzent**, nie wykonawca poprawki. Wykonawca nie edytuje wpisów recenzji
i nie przepisuje w nich skrótów (lekcja: wykonawca przepisał skróty `sha` w cudzych wpisach recenzji).

## Krok recenzenta (dopisz do zlecenia recenzji)

1. Po recenzji partii zapisz plik `docs/research/recenzje/<partia>-r<N>.json` (`<partia>-r<N>.json`, np. `p2-r1.json`; N = numer rundy recenzji tej partii).
2. Format: `{ "karty": { "<nazwa ćwiczenia>": { "werdykt", "data", "stan", "autor", "recenzent", "sha", "uwagi" } } }` — pola jak wpisy `karty` w
   `docs/research/figury-recenzja.json`; `sha` = 12 znaków hex skrótu treści karty, który recenzent zobaczył; `autor` ≠ `recenzent`.
3. Wykonawca przenosi do `figury-recenzja.json` wpis z identycznymi `sha`, `werdykt` i `recenzent` (kopia, nie nowa wartość).

## Strażnik

`tests/l047-recenzja-niezalezna.test.ts`: każdy wpis `karty` z werdyktem „wyswietlana” i datą od 04.11.2026 (dzień wejścia strażnika) ma w którymś pliku
`docs/research/recenzje/*.json` wpis o tym samym kluczu i identycznych `sha`, `werdykt`, `recenzent`. Wpisy starsze (28.10–03.11.2026) zostają bez pliku
recenzenta — historii nie przepisujemy.
