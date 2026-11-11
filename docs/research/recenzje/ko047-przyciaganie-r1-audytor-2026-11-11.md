# KO-047 „Przyciąganie” — recenzja niezależna różnicy (r1, audytor, 11.11.2026)

Bramka 4 (CLAUDE.md), L-047, L-050. Autor zmiany: programista sesji U (commit b4be0f13). Recenzent: audytor (nie pisał zmiany).

## Zakres

Commit b4be0f13 (decyzja docs/18, 11.11.2026): etykieta fazy 0→1 „Ściąganie” → „Przyciąganie” w rodzinie v2 `cable_row` (`ui.names.first`)
i w wyjątkach `Hip Adduction` / `Cable Hip Adduction` rodziny `hip_abd_add`; nowa wartość typu `PhaseName` w `lib/figures/v2/anim.ts`.

## Komendy i wynik

1. `git diff b4be0f13^ b4be0f13 -- lib/figures` — 3 pliki: typ `PhaseName` (dodana wartość), `names.first` w `cable_row.ts` (+ komentarz),
   `names.first` w 2 wyjątkach `hip_abd_add.ts`. Pliki póz, rigi, nakładki, tempo, `lowerFirst`, kolejność faz i błędy — bez zmian.
2. `node scripts/skrot-v2-wynik.mjs cable_row,hip_abd_add --cwiczenia` na odłączonej kopii drzewa b4be0f13^ (kod 0) i na bieżącym drzewie (kod 0):
   - cable_row: 4376c0e6b911 → d413c8bb3429; zmienione skróty wszystkich 9 ćwiczeń (nazwy faz ustawione na poziomie rodziny).
   - hip_abd_add: eddcd1af9d43 → a81c1d024cfe; zmienione tylko Hip Adduction i Cable Hip Adduction; Hip Abduction (64552f1f8bf9)
     i Cable Hip Abduction (695592c015cb) bez zmian.
3. Test odwrotny: w kopii `git checkout b4be0f13 -- lib/figures`, potem przywrócenie etykiety `'Przyciąganie'` → `'Ściąganie'` w obu plikach rodzin;
   wynik skrot-v2-wynik.mjs (kod 0) bajtowo równy stanowi sprzed zmiany (`cmp` — identyczne). Kopia usunięta (`git worktree remove`).

## Kierunek ruchu

Obie fazy `first` to u: 0→1 z `lowerFirst: false` (wysiłek). `cable_row`: u = 0 ręce wyprostowane, u = 1 uchwyt przy tułowiu albo twarzy —
ruch do siebie. Przywodzenie: u = 1 noga(i) przywiedzione — ruch nogi do linii środka. „Przyciąganie” opisuje oba ruchy poprawnie
(poziome przyciągnięcie, nie ściąganie z góry).

## Werdykt

Bez znalezisk. Rysunek obu rodzin bez zmian, zmienia się wyłącznie etykieta pierwszej fazy. Werdykt „wyswietlana” zachowany,
nowe skróty: v2.cable_row d413c8bb3429, v2.hip_abd_add a81c1d024cfe. Ślad toru bez zmian (poprzednie arkusze z recenzji ruchu obowiązują).
