# Recenzja scalenia pociągu-5 (scal/pociag-5 @ e883aaf9)

- autor: programista scalenia pociągu-5 (sesja G)
- recenzent: audytor (subagent)
- data: 10.11.2026
- commit scalenia: `e883aaf9` = `b66ecfa2` (origin/integracja-1-1, partie 1–4 i 2) + `ef42f8e4` (origin/figury/partia-5: forearm, carry, core_hang, kneeling_hinge, rotator_cuff); baza `dfaeeefe`

## Zakres

1. Kompletność: każdy wpis obu stron jest w wyniku (pliki z konfliktem i pliki generowane).
2. Liczby i wyjątki w testach zgodne z wynikiem skryptów (cele, „ciężkie”, zapadka pokrycia, limit rozmiaru `poseData.ts`, listy rodzin).
3. Bez pełnego Jest (inna sesja testuje na tej maszynie) — tylko skrypty node, `tsc --noEmit`, ESLint na plikach z konfliktem. Kod nie był zmieniany.

## Werdykt: brak znalezisk (0 KRYTYCZNE, 0 WYSOKIE, 0 ŚREDNIE, 0 NISKIE)

## Dowody

### 1. Kompletność scalenia

- Pliki zmienione tylko po jednej stronie: w wyniku identyczne z tą stroną (`git diff --quiet <strona> e883aaf9 -- <plik>` dla każdego pliku z `git diff --name-only dfaeeefe <strona>`). Jedyny wyjątek to `tests/architecture-limits.test.ts` (zmiana progu, pkt 2). Żaden plik spoza obu stron nie został zmieniony.
- 32 pliki zmienione po obu stronach: dla plików TS/TSX porównanie wielozbiorów linii po transpilacji TypeScript z `removeComments` (oczekiwane = P1 + (P2 − baza) − (baza − P2)). Różnice tylko w liniach, gdzie obie strony zmieniły ten sam wiersz. Każdą sprawdzono ręcznie i każda jest sumą obu stron:
  - `lib/figures/v2/families.ts`: 32 rodziny `ready` = 27 (P1) + forearm, carry, core_hang, rotator_cuff, kneeling_hinge (P2). Lista w `tests/figures-v2-mapping.test.ts:45` ma tę samą kolejność co `FAMILIES` (sprawdzone grepem po statusach).
  - `lib/figures/v2/overlay.ts`: klucze `TECHNIQUE` (31) = suma zbiorów P1 (27) i P2 (23). Importy obu stron są na miejscu, `limbTriple` `wristFlex` z P2 zostało. `tests/figures-v2-nakladka-triceps-olympic.test.tsx:199-200` („dokładnie 31 rodzin”, posortowana lista) jest zgodny.
  - `tests/figures-v2-nakladka-kazda-rodzina.test.tsx`: oba nazwane wyjątki zostały — mobility_floor z P1 (pusta nakładka) i kneeling_hinge z P2 (bez wpisu, test wygaśnięcia).
  - `tests/figures-v2-data.test.tsx:51` filtr `DATA_KEYS` = suma wykluczeń obu stron. `:171` `BLAD_NIEWIDOCZNY` = suma (Seated Cable Chest Press z P1; Reverse Flyes With External Rotation i Behind-the-Back Barbell Wrist Curl z P2).
  - `tests/figures-v2-mapping.test.ts:52` `POSE_FAMILIES` = kolejność kluczy `LOAD` w scalonym `poseData.ts` (29 rodzin). `:63` suma figureSpec = suma P1 (394) + 11 + 7 + 3 + 1 + 7 = 423. Różnica wobec eksportu strony (8) = różnica P1 (394 − 386), a różnica P2 i bazy wynosi 6 (+2 wstrzymane P1: Triceps Dips (ławka), Plyo Push-Up).
  - `tests/figury-generator-odtwarza.test.ts` `W_ZAKRESIE`, `tests/skrot-v2-wynik.test.ts` (wyrażenie `rodzinne`): suma obu list.
  - `tests/strona-eksport.test.ts:165` 415 = 386 (P1) + 29 (partia 5); zgodne z `figura.v2` = 415 w `tests/fixtures/pokrycie-katalogu.json` (`dobre`).
  - `tests/recenzja-wyjatki-1-1.test.ts:97`: oczekiwany obiekt równy wynikowi `buildFigures`/`rodzinyZAktualnaRecenzja` uruchomionym na scalonym drzewie (porównanie JSON: MATCH).
  - `tests/gemini-polecenia.test.ts`: „rodzin: 10” = 22 (baza) − 7 (P1) − 5 (P2). Potwierdzone uruchomieniem `gemini-polecenia.mjs --wszystkie` na korzeniu jak `tmpRoot(true)`: `rodzin: 10, plików: 32`, rodziny bez ćwiczeń do wysłania: cardio, foam_roll, neck.
- Pliki JSON (porównanie strukturalne baza → strona → wynik): `docs/research/figury-recenzja.json`, `tests/tor-wyjatki.json`, `tests/fixtures/figury-v2-zlote.json`, `lib/figures/v2/reguly-cwiczen.json` — każda zmiana obu stron jest w wyniku. `tests/l047-lista-zamrozona.json` `zwolnione` = baza minus usunięte przez P1 (Back Extension, Machine Shoulder Press, Wyciskanie na linkach (stojąc)) i przez P2 (Farmer's Walk, Suitcase Carry).
- Dokumenty: `docs/18`, `docs/brd/wymagania.md` — żadna linia dodana przez którąkolwiek stronę nie zginęła. `docs/21:176` i opis w `pokrycie-cele.json` łączą wpisy obu stron (wpis P1 i P2 występuje w scalonym opisie). `node scripts/decyzje.mjs --check` zielone (769 wpisów). `node scripts/kontrola-brd.mjs docs/brd` — 0 błędów; wektory równe `tests/wektory/brd.json` (`cmp`).
- Pliki generowane: `zrodla-runtime.mjs --check`, `figures/v2-gen.mjs --check`, `pokrycie-katalogu.mjs --check`, `test-matrix.mjs --check`, `readme.mjs --check`, `cues/gen.mjs --check`, `figures/gen.mjs --check`, `figures/v2-validate.mjs --schema --check`, `claims.mjs --check`, `check-znaczniki-konfliktu.mjs`, `pochodne.mjs`, `slowniki.mjs`, `check-i18n.mjs` — wszystkie z kodem wyjścia 0; kopia robocza po nich czysta.
- `tsc --noEmit` (cały projekt) — kod wyjścia 0; ESLint na 15 plikach z konfliktem — 0 błędów.

### 2. Liczby i wyjątki

- `docs/research/pokrycie-cele.json` `wersje.1.1.min` = pole `cel` z `node scripts/pokrycie-symulacja.mjs --json` (wszystkie 46 metryk identyczne).
- „Ciężkie”: `cwiczeniaCiezkie.cwiczen` = 243 = 708 − 465; `docs/21-roadmapa-offline.md:176` podaje 243 (250 z P1 − 7 z (c) partii 5). `tests/cel-1-1-bez-ciezkich.test.ts:49` `r.c` = 18 = `rozbicie.c`; `:83` `pelnaKarta` 465 = cel.
- Zapadka `tests/fixtures/pokrycie-katalogu-min.json`: dla każdej metryki minimum ≥ max(P1, P2) i ≤ stan bieżący (`pokrycie-katalogu.json` `dobre`); rekord = max rekordów obu stron; żaden wpis `obnizenia` nie zginął; nie ma minimum > rekord; przy minimum < rekord jest powód (`tests/pokrycie-katalogu.test.ts:31-33`). Języki: 597 (P1) ≥ 591 (P2), ≤ 600.
- `tests/architecture-limits.test.ts:36`: próg 24 698 ≤ 24 736 (wpis po pociągu-4) i równy `wc -c lib/figures/v2/poseData.ts` = 24 698 (test porównuje `statSync().size`).
- `poseData.ts` — kod bez zmian poza scaleniem: po transpilacji z `removeComments` wielozbiór linii wyniku jest dokładnie równy oczekiwanemu (P1 + zmiany P2). Jedyny konflikt kodu (wpisy `DATA_UI` kneeling_hinge / chest_press_machine) rozwiązano sumą; kolejność kluczy `LOAD` zgodna z testem `POSE_FAMILIES`.

## Uwagi (nie znaleziska)

- Nie uruchamiano Jest (zgodnie ze zleceniem). Zgodność asercji sprawdzono wyliczeniem tych samych wartości skryptami. Ostateczną bramką pozostaje zielony `tests.yml` dla SHA głowy przed `scal-galaz`.
- W `pokrycie-katalogu-min.json` zostają wpisy `obnizenia` przy metrykach, gdzie teraz minimum = rekord (np. `figura.v2` „Plyo Push-Up wstrzymany: −1”). Wzorzec był już po obu stronach przed scaleniem, test ich nie zabrania — bez wpływu na wydanie.
- W trakcie recenzji (ok. 11:10 UTC) inny proces na tej maszynie zmienił w kopii roboczej `tests/fixtures/pokrycie-katalogu-min.json` (minimum podniesione do stanu bieżącego, np. `figura.v2` 362 → 415; wygląda na `--podnies-minimum`). Recenzent tego nie robił i tego nie oceniał. Powyższe ustalenia dotyczą zatwierdzonego `e883aaf9` (odczyt przez `git show`), a kontrole skryptami biegły na czystej kopii przed tą zmianą.
