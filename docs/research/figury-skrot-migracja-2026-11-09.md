# Migracja skrótów recenzji rodzin v2: z tekstu plików wspólnych na wynik rysunku (09.11.2026)

Zmiana **tylko sposobu liczenia** skrótu `sha` w `docs/research/figury-recenzja.json` (sekcja `v2`, 7 rodzin). Rysunek żadnej rodziny się nie zmienia. Decyzja właściciela 09.11.2026, wariant A (docs/18, wpis „skrót recenzji per rodzina”).
Wpisów recenzji (werdykt, data, autor, recenzent, uwagi, ślad) nie ruszano; zmieniono wyłącznie `sha` i dodano pole `skrot_migracja` z polem `potwierdzenie_recenzenta` (**null — do uzupełnienia przez audytora**, krótka kontrola poniżej).

## Co dowodzi, że rysunek jest ten sam

1. **Baza = commit `07567efd`** (gałąź `figury/rdl-pull-up`, po recenzjach RDL i Pull-Up z 09.11.2026). Na bazie stary skrót (tekst plików wspólnych) każdej z 7 rodzin **jest równy** wpisowi recenzji (`node scripts/zrodla-runtime.mjs --check` zielony), czyli wpisy opisują rysunek z bazy.
2. **Kod rysunku nie został zmieniony.** Różnica `lib/` względem bazy to cztery komentarze (`cueSets.ts`, `dumbbellAxis.ts`, `poseData.ts`, `poseInterp.ts` — zdanie o skrócie recenzji) i jeden parametr z wartością domyślną równą dotychczasowemu zachowaniu (`onDrawingCues(..., cueIds = cueIdsOf(spec.key).ids)` w `ui.ts`; skrót podaje surowe id wskazówek zamiast ich widoku po bramce kart, tak jak robi to `errorsOf`).
3. **Skrót wyniku (nowa metoda) policzony na bazie i na gałęzi — równy**, ćwiczenie po ćwiczeniu: `node scripts/skrot-v2-wynik.mjs <rodziny> --cwiczenia` w czystej kopii bazy (`git archive 07567efd lib scripts data` + skrypt metody + jednolinijkowa zmiana `ui.ts`) i w kopii gałęzi: **185 z 185 ćwiczeń identycznych** (każde ćwiczenie ma własny skrót z kształtów klatek, doboru, kadru, tempa, mięśni).
4. **Niezależna miara md5 (inna implementacja niż nowa metoda)**: skrypt jestowy w stylu skryptów audytora z 09.11.2026 (shapesAt z mięśniami i bez, contactShapes, trailFor, guideShapes, overlayShapes: wybrane / pełne rodziny / pełne z liniami, badgesFor, dobór guidesOf/techniquesOf/errorsOf/onDrawingCues; każdy rzut, u co 1/16, poza poprawna i każdy błąd z errorsOf; bramka kart otwarta jak w `tests/figure-gate-open.ts`), uruchomiony na bazie (`07567efd`) i na gałęzi: **185 z 185 ćwiczeń z identycznym md5 w sześciu składnikach** (ruch, ślad, linie, nakładka, znaczki, dobór). Skrót zbiorczy md5 rodziny (z md5 ćwiczeń, posortowane po nazwie) w ostatniej kolumnie.

## Zestawienie: stary skrót → nowy skrót

| Rodzina | Stary skrót (tekst plików; = wpis na bazie) | Nowy skrót (wynik rysunku) | Skrót wyniku przed = po | Ćwiczeń z rysunkiem przed / po | md5 klatek (zbiorczy) przed = po |
|---|---|---|---|---|---|
| squat | 42a611eb7489 | b4626b78e4ad | 70b73a1f2c08 = 70b73a1f2c08 | 25 / 25 | 9b122a9ee8a9 = 9b122a9ee8a9 |
| bench_press | 1670d3017903 | 6a7604cefcfb | 75a7394a4963 = 75a7394a4963 | 30 / 30 | 7ec98da57978 = 7ec98da57978 |
| hinge | 93b315f5edbc | db4345521e62 | b9f453656531 = b9f453656531 | 32 / 32 | 8277c6638b97 = 8277c6638b97 |
| pull_up | ebbbe1a8942a | 38181e68a042 | 14cbddc7671d = 14cbddc7671d | 11 / 11 | 0fb47f837402 = 0fb47f837402 |
| curl | 4a0ab9b3e9f4 | 39470f3a2918 | 4032efca84b2 = 4032efca84b2 | 34 / 34 | 6bacf03aa5ef = 6bacf03aa5ef |
| olympic | 3ca4763958cc | 5af5c052392f | 3611dc2710fd = 3611dc2710fd | 24 / 24 | 59b73eeef48e = 59b73eeef48e |
| triceps | a104236b39d1 | 083478892a51 | ef081c89ff82 = ef081c89ff82 | 29 / 29 | 2df07b8f0718 = 2df07b8f0718 |

Wszystkie 7 rodzin zostaje widocznych: `lib/figures/data.json` (`v2`) po `node scripts/zrodla-runtime.mjs --write` bez zmian (squat, bench_press, hinge, pull_up, curl, olympic, triceps); pokrycie katalogu (`docs/55-pokrycie-katalogu.md`, `tests/fixtures/pokrycie-katalogu.json`) bez zmian.

## Krótka kontrola dla audytora (wypełnia pole `potwierdzenie_recenzenta`)

Czy: (a) nowa metoda obejmuje wszystko, co rodzina pokazuje (patrz nagłówek `scripts/skrot-v2-wynik.mjs` i tabela pokrycia plików w `tests/skrot-v2-wynik.test.ts`); (b) macierz mutacji `tests/skrot-v2-wynik.test.ts` („L-047”) zmienia skrót przy każdej zmianie rysunku; (c) powyższa równość md5 przed/po zgadza się z własnym pomiarem recenzenta. Po potwierdzeniu: `potwierdzenie_recenzenta` = `{ "recenzent": …, "data": … }` w siedmiu wpisach.

## Ryzyka i granice nowej metody

- Skrót nie obejmuje tekstu plików wspólnych poza dwoma wyjątkami (render.ts i palette.ts — wspólna warstwa rysowania — oraz plik samej rodziny i jej nakładki): komentarz lub zmiana cudzego wariantu nie unieważnia recenzji; zmiana, która zmienia kształt klatki, dobór, kadr, tempo, pomiar albo legendę rodziny — unieważnia (macierz mutacji w teście).
- Współrzędne zaokrąglone do 1e-4 przed skróceniem: różnice ostatniego bitu między platformami nie zmieniają skrótu; zmiana mniejsza niż 1e-4 cm nie jest widoczna.
- Koszt czasu: `check:zrodla-runtime` oraz `check:pokrycie` — każdy ok. +13 s (pomiar w docs/18).
