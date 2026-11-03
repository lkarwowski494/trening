# Pliki wpisów recenzenta (L-047-A, decyzja właściciela 03.11.2026)

Źródłem prawdy dla skrótu `sha` (i werdyktu) wpisu karty jest plik, który zapisuje **recenzent**, nie wykonawca poprawki. Wykonawca nie edytuje wpisów recenzji
i nie przepisuje w nich skrótów (lekcja: wykonawca przepisał skróty `sha` w cudzych wpisach recenzji).

## Krok recenzenta (dopisz do zlecenia recenzji)

1. Po recenzji partii zapisz plik `docs/research/recenzje/<partia>-r<N>.json` (`<partia>-r<N>.json`, np. `p2-r1.json`; N = numer rundy recenzji tej partii).
2. Format: `{ "karty": { "<nazwa ćwiczenia>": { "werdykt", "data", "stan", "autor", "recenzent", "sha", "uwagi" } } }` — pola jak wpisy `karty` w
   `docs/research/figury-recenzja.json`; `sha` = 12 znaków hex skrótu treści karty, który recenzent zobaczył; `autor` ≠ `recenzent`.
3. Wykonawca przenosi do `figury-recenzja.json` wpis z identycznymi `sha`, `werdykt` i `recenzent` (kopia, nie nowa wartość).

## Strażnik

`tests/l047-recenzja-niezalezna.test.ts`: każdy wpis `karty` z werdyktem „wyswietlana”, którego nie ma na zamrożonej liście `tests/l047-lista-zamrozona.json`, ma w którymś pliku
`docs/research/recenzje/*.json` wpis o tym samym kluczu i identycznych `sha`, `werdykt`, `recenzent`. Lista (zamrożona 03.11.2026; zastąpiła próg daty, który
dawał się obejść datą wpisu) ma dwie części: `zwolnione` — karty zrecenzowane przed regułą (historii nie przepisujemy) i `do_uzupelnienia` — karty P1/P2 bez
pliku recenzenta, z polem `termin`. Lista tylko maleje (limity `maks`, nowej karty nie dopisujemy); gdy plik recenzenta ma zgodny wpis, kartę usuwa się z listy;
po terminie `do_uzupelnienia` musi być pusta.
