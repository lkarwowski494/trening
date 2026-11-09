# Recenzja niezależna różnicy silnika — figury/delt_raise (09.11.2026)

Recenzent: audytor (L-047: autor = programista delt_raise, commity a509bfc1 r3, 18d08164 r4, 51042308 r5; recenzent nie pisał zmiany).
Zakres: (lokalnie) HEAD f6466215 (git status czysty) vs origin/integracja-1-1 d84b43e7 (od bazy ab59dd5 integracja ma tylko commit z dokumentami).
Repo nie było zmieniane. Kopie do porównania: `git archive` obu wersji w scratchpadzie sesji.

## Werdykt per rodzina

Uwaga: zlecenie wymieniało 4 rodziny; nieaktualnych jest **7** — wszystkie rodziny `ready` (curl, olympic i triceps też, bo pliki silnika wchodzą do skrótu każdej rodziny).

| Rodzina | Skrót we wpisie → bieżący | Werdykt | Ruch/ślad/nakładka/statyczne/czas równe |
|---|---|---|---|
| squat | 6913ea2e7f22 → b62f05ccc077 | bez zmiany rysunku — skrót do odświeżenia | 25/25 |
| bench_press | c539a334eb2d → 3228d2db19d2 | bez zmiany rysunku — skrót do odświeżenia | 30/30 |
| hinge | bcc5dcf3b9f7 → 99bcd84b31c2 | bez zmiany rysunku — skrót do odświeżenia | 32/32 |
| pull_up | 39a3824aab23 → 236301a48766 | bez zmiany rysunku — skrót do odświeżenia | 11/11 (13 przypisanych, 2 bez rysunku) |
| curl | 832a9e774afe → bae16e242470 | bez zmiany rysunku — skrót do odświeżenia | 34/34 (36, 2 bez rysunku) |
| olympic | dfabbebac8da → c21b4af3feb5 | bez zmiany rysunku — skrót do odświeżenia | 24/24 (25, 1 bez rysunku) |
| triceps | a4b978a832e0 → b6c6c320ef1c | bez zmiany rysunku — skrót do odświeżenia | 29/29 (32, 3 bez rysunku) |

Pełna recenzja ze śladem (L-050) nie jest potrzebna dla żadnej z 7 rodzin: ruch i ślad są identyczne, więc arkusze z poprzednich recenzji nadal obowiązują.
Znaleziska KRYTYCZNE/WYSOKIE/ŚREDNIE: **brak**.

## 1. Różnica w kodzie (anim.ts, contract.ts, figure.ts + użycie w components/ExerciseFigureV2.tsx)

- anim.ts: `ONE_WAY_REP_MS` i `ONE_WAY_STATIC` mają tylko klucz `Alternating Deltoid Raise`; `oneWayRepMs(key)` dla innych kluczy zwraca `ONE_WAY.repMs` (`hasOwnProperty`, odporne na klucze z prototypu); `oneWayLength`/`oneWayAt` dostały parametr domyślny `= ONE_WAY.repMs`, więc wywołania bez argumentu działają jak wcześniej. Typ `PhaseName` + 'Naprzemiennie' (sam typ).
- figure.ts: `staticPositions` / `staticLabels` dla kluczy spoza `ONE_WAY_STATIC` zwracają `[0, 1]` / ['Pozycja wyjściowa','Pozycja końcowa'] (izometria `[1]` / []), czyli to samo co wcześniej. Reszta to skrócone komentarze.
- contract.ts: tylko walidator. `maxDynamic: 20` działa przy `ctx.dynamic` (deklaracja „dynamiczne”: delt_raise/ADR, plyo, **olympic** `*`, core_hang/Toes to Bar, kb_ballistic, sled_throw) — to tylko luźniejszy limit klatek; dane olympic się nie zmieniły. Miara „ruch” dla `jednokierunkowa` liczy maksimum także po klatkach pośrednich — wartość ≥ poprzedniej, więc reguła może tylko przestać zgłaszać błąd, nie zacznie zgłaszać nowego. Rysunku to nie zmienia.
- ExerciseFigureV2.tsx: podpis VoiceOver „Pozycje na rysunku” tylko przy > 2 pozycjach statycznych (tylko ADR); `oneWayAt(ms, oneWayRepMs(key))` daje to samo dla innych kluczy. Podpisy pozycji dla dwóch pozycji są takie same jak wcześniej.

## 2. Dowody wyniku

- `npx jest tests/figures-v2-zgodnosc-wsteczna.test.ts` w (lokalnie) zielony. `git diff origin/integracja-1-1 -- tests/fixtures/figury-v2-zlote.json`: 17 zmienionych i 1 nowy klucz — wszystkie `delt_raise/*` (sekcja `dane`); rigi, przykłady i pozy pozostałych rodzin bez zmian. Squat/bench_press/hinge (rigi) i pull_up/curl/olympic/triceps (pozy z danych) — SVG bajtowo te same.
- Złote odciski nie obejmują czasu pętli, pozycji statycznych, śladu ani nakładki. Dlatego dodatkowo: własny md5 (rozszerzony skrypt z recenzji 08.11: (lokalnie) — shapesAt bez i z mięśniami, contactShapes, badgesFor, trailFor, guideShapes/overlayShapes w wersji z kart i z aplikacji, onDrawingCues, oraz staticPositions, staticLabels, loopOf, loopSpan, phasesFor, oneWayLength, oneWayAt/cycleAt co 100 ms przez 4 s; u co 1/8; każdy błąd). Wynik na czystych kopiach: **równe we wszystkich 185 ćwiczeniach z rysunkiem** w 7 rodzinach.
- Skład skrótu (`rodzinaSkrot`, scripts/zrodla-runtime.mjs:110): porównałem składniki po `normalizujPlikV2` plik po pliku. Różnią się tylko anim.ts, figure.ts i contract.ts; `doborRodziny` jest równy dla każdej z 7 rodzin. Na kopii integracji bieżące skróty są równe wpisom (6913ea2e7f22 itd.), więc nieaktualność wynika wyłącznie z tej gałęzi.
- Testy pokrewne w wt-delt (figures-v2-petla-jednokierunkowa, figury-dynamiczne, figures-v2-tor): 313/313 zielone. tests/figury-recenzja.test.tsx: czerwony tylko w „rodzina v2 ready ⇒ bieżący skrót” (squat b62f05ccc077 ≠ 6913ea2e7f22; test zatrzymuje się na pierwszej rodzinie).

## 3. Uwagi bez progu (do wiadomości koordynatora)

- Stan gałęzi: commit f6466215 ma w lib/figures/data.json `"v2": []` (integracja: 7 rodzin). To poprawne zachowanie fail-closed przy nieaktualnych skrótach, ale **scalenie w tym stanie ukryłoby wszystkie figury v2 w aplikacji**. Po wpisaniu nowych skrótów trzeba przegenerować data.json (scripts/zrodla-runtime.mjs) i sprawdzić, że lista zawiera 7 rodzin; verify blokuje dziś przez figury-recenzja.test.tsx. Po przywróceniu listy w kopii md5 nakładki „z aplikacji” (techniquesOf/guidesOf) jest równy z integracją.
- ExerciseFigureV2.tsx: dla figur izometrycznych (`spec.static`, jedna pozycja) testID zmienia się z `exercise-figure-v2-end-*` na `-start-*` (wcześniej `p === 0 ? 'start' : 'end'` przy p = 1, teraz `pi === 0`). Użytkownik tego nie widzi i VoiceOver tego nie czyta; w tests/ i scenariuszach nie ma odwołań do tego testID dla izometrii (jedyne trafienie: Bench Press, `end-side`, dwie pozycje — bez zmiany). Teoretyczne, bez naprawy.
- Skróty są ważne dla drzewa f6466215. Każda dalsza zmiana któregoś pliku z V2_WSPOLNE (także ponowne scalenie integracji z silnikiem) znowu je unieważni — dlatego trzeba je przeliczyć `node scripts/zrodla-runtime.mjs --skroty` tuż przed zapisem.

## 4. Gotowe wpisy (autor ≠ recenzent)

Plik: (lokalnie) — pełne obiekty dla `v2.squat`, `v2.bench_press`, `v2.hinge`, `v2.pull_up`, `v2.curl`, `v2.olympic`, `v2.triceps` (pola `cwiczenia`, `bez_rysunku` i `liczba` przeniesione bez zmian; nowe: `data` 2026-11-09, `autor` = programista delt_raise, `recenzent` = audytor, `kto`, `stan`, `slad`, `sha`, `uwagi`). Wkleić w miejsce obecnych wpisów w docs/research/figury-recenzja.json, potem przegenerować data.json i uruchomić tests/figury-recenzja.test.tsx.

## Obszary sprawdzone bez znalezisk

Dane i migracje (zmiana nie dotyka danych użytkownika); prywatność i sekrety (brak); dostępność (nowy podpis VO tylko dla ADR, dla innych rodzin etykieta taka sama); liczby i twierdzenia (czasy tylko dla ADR, inne rodziny bez zmian); ryzyko Apple (brak).
