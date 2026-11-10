# Recenzja scalenia pociągu-6 (partia 7 z integracją po partii 6)

- autor: programista scalenia pociągu-6 (sesja H)
- recenzent: audytor (subagent)
- data: 10.11.2026
- zakres: scalenie `33eef50b` (rodzic 1 `584bca92` — integracja-1-1 z partią 6, plyo; rodzic 2 `9e3db956` — figury/partia-7, core_floor i glute_floor; baza wspólna `649b0504`) oraz `f1b6d8e9` (`node scripts/pokrycie-katalogu.mjs --podnies-minimum`).

## Metoda

- Pliki zmienione po obu stronach: część wspólna `git diff --name-only 649b0504..584bca92` i `649b0504..9e3db956` — 29 plików.
- Pliki zmienione tylko po jednej stronie: `git diff <rodzic> 33eef50b -- <plik>` puste dla każdego — przeniesione bez zmian (w tym docs/40 z rodzica 1).
- JSON (figury-recenzja, reguly-cwiczen, cues/data, figures/data, pokrycie-katalogu-min, pokrycie-cele, tor-wyjatki, figury-v2-zlote): spłaszczenie do liści (tablice wartości prostych jako zbiory); każdy liść dodany lub zmieniony przez stronę musi być w scaleniu, liść usunięty przez stronę nie może w nim zostać, liść nowy w scaleniu musi pochodzić z którejś strony — wyjątki tylko tam, gdzie reguła KO-020 każe przeliczyć (cele, minimum).
- Tekst (docs/18, docs/21, docs/brd/wymagania.md, overlay.ts, testy): każda linia dodana przez stronę jest w scaleniu albo jej tokeny (nazwy, liczby, napisy) są w odpowiadającej linii scalenia; linie zmienione ręcznie przeczytane.
- Generatory i skrypty uruchomione na `f1b6d8e9` (bez Jest i bez verify).

## 1. Żaden wpis nie zginął — wynik: zgodnie

- `docs/research/figury-recenzja.json`: liście 5836 (baza) + 181 (r1) + 198 (r2) = 6215 w scaleniu, 0 rozbieżności.
- `lib/figures/v2/reguly-cwiczen.json`: 1217 + 59 + 55 = 1331, 0 rozbieżności. `tests/tor-wyjatki.json`: 70 + 34 + 2 = 106, 0.
- `lib/cues/data.json`, `lib/figures/data.json` (porównanie zbiorów): 0 rozbieżności; `v2` = baza + plyo + core_floor + glute_floor.
- `tests/fixtures/figury-v2-zlote.json`: bez zmian względem stron.
- `lib/figures/v2/overlay.ts`: importy `*_TECHNIQUE` 31 (baza) → 32 (r1) / 33 (r2) → 34 w scaleniu; rejestr TECHNIQUE ma `plyo`, `core_floor`, `glute_floor`.
- `lib/figures/v2/families.ts`: core_floor i glute_floor `ready`, plyo bez zmian.
- docs/18, docs/brd/wymagania.md: każda linia dodana przez którąkolwiek stronę jest w scaleniu, bez nowych duplikatów.
- docs/21: obie sekcje backlogu partii 7 (CF-*, GF-*) obecne; wpis o „ciężkich” zawiera historię obu stron („216 … partia 6”, „237 … partia 7”) i nowe „210 po scaleniu … na scal/pociag-6”.
- `docs/research/pokrycie-cele.json` (`opis`): oba dopiski stron obecne dosłownie, plus dopisek scalenia.
- Testy: listy w `figures-v2-mapping` (ready, POSE_FAMILIES, suma), `figures-v2-nakladka-fix4` (odciete = suma: Dumbbell Seated Box Jump z r1, Machine Glute Kickback i Prone Flutter Kicks z r2), `figures-v2-nakladka-triceps-olympic` (34 rodziny, komentarze obu stron), `figures-v2-data`, `gemini-polecenia`, `recenzja-wyjatki-1-1`, `skrot-v2-wynik`, `strona-eksport`, `figures-v2-zgodnosc-wsteczna`, `cel-1-1-bez-ciezkich` — brak tokenu strony, którego nie ma w scaleniu; komentarze historyczne obu stron zachowane.

## 2. Liczby zgodne ze skryptami — wynik: zgodnie

- `node scripts/pokrycie-symulacja.mjs --json` → `cel` identyczny z `wersje.1.1.min` w pokrycie-cele.json (wszystkie 47 metryk; m.in. roleMiesni 564, pelnaKarta 498, animowanyBlad 274, języki 632).
- `rozbicie.c` = 51 = `expect(r.c).toBe(51)` (tests/cel-1-1-bez-ciezkich.test.ts:49); `cele.min.pelnaKarta` = 498 = test (:83); `rozbicie.obecnie` 412 + `przyrost` 86 = 498.
- `cwiczeniaCiezkie.cwiczen` = 210 = docs/21 („210 z 708”) = 708 − 498.
- `tests/strona-eksport.test.ts:165` 470 = 442 (r1) + 21 core_floor + 7 glute_floor; `tests/figures-v2-mapping.test.ts:63` suma = 478 = „ćwiczeń z gotową figurą: 478” w docs/51 (generowane).
- Kod wyjścia 0: `readme.mjs --check`, `test-matrix.mjs --check` (2865 pozycji, bez testu 0), `pokrycie-katalogu.mjs --check`, `figures/v2-gen.mjs --check` (obejmuje docs/51), `zrodla-runtime.mjs --check`, `i18n-context.mjs --check`.

## 3. Progi nie w dół — wynik: zgodnie

- `tests/fixtures/pokrycie-katalogu-min.json` po `f1b6d8e9`: każda metryka `minimum` i `rekord` ≥ max(rodzic 1, rodzic 2) i ≥ wartości w `33eef50b`; brak usuniętych kluczy; `obnizenia` identyczne z bazą (obie strony ich nie zmieniały). Przykład: pelnaKarta 391/391 → 412, figura.v2 442/415 → 470, jezyk.pl.kompletne 619/602 → 621.
- Cele 1.1 ≥ max(rodzic 1, rodzic 2) dla każdej metryki; cel ≥ minimum dla każdej metryki mającej cel (`pelnaKartaBlad` jest tylko w minimum — tak samo w bazie, poza zakresem scalenia).

## Znaleziska

0 znalezisk.

Uwaga do zakresu: testy Jest nie były uruchamiane (polecenie: inny proces testuje na maszynie) — zgodność liczb w testach sprawdzona przez skrypty i przeliczenie; ostateczny dowód to zielony `tests.yml`.
