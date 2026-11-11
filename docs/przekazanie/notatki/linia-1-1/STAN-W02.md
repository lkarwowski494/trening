# STAN W-02 (sesja L, 11.11.2026) — przekazanie do następcy

Gałąź `figury/w02-przed-1-1` (od `integracja-1-1` @ 5721a16e). Koordynator: session_01T66VBz531oNhivgrQu5LZg.

## Zrobione (scalone lokalnie na gałęzi, recenzje niezależne audytora)
- Straight Raises on Incline Bench: nogi proste, siedzisko 2 cm (generator delt_raise bez starego nadpisania nóg); test `tests/figures-v2-delt-raise-w02.test.ts`; recenzja `docs/research/recenzje/w02-delt_raise-roznica-audytor-2026-11-11.md` „wyswietlana”; skrót delt_raise ec3e3e8e5841.
- `fidr.move` → „co najmniej do wysokości barków” (PL/EN; 33 języki do przekładu W-03: `docs/lokalizacja/zestaw-przekladu-2026-11-11-w02-wskazowki.json`); karta „wyswietlana”, `lib/cues/data.json` przeliczony; cel 1.1 pelnaKarta 520 → 521.
- Dźwignia barki/uda (`gear.ts`, `contract.ts`): Standing i Seated Calf Raise zdjęte z `V2_WSTRZYMANE` po recenzji `w02-calf_raise-roznica-audytor-2026-11-11.md`; skrót calf_raise f4bca2a3f7ef; cel pelnaKarta 521 → 523; test `tests/figures-v2-dzwignia-barki-uda.test.ts`.
- `ROZJAZDY_POZA_ZAKRESEM` pusta (calf_raise, pull_up, mobility_stand, hip_abd_add w `W_ZAKRESIE`).
- Badacz: `docs/research/w02-badacz-reguly-2026-11-11.md` (cytaty sprawdzone curl); wnioski → backlog W02-BAD-1…5 (docs/21).
- Odłożone → 1.2 (docs/18 11.11.2026): obrót dzwonu kb (P1-KB-2; WIP lokalnie `w02/d-silnik` @ ee2a130a — NIE wypchnięte), PP-W1, P3-MARSZ (generator marszu w repo, recenzja `w02-p3-marsz-audytor-2026-11-11.md` „do poprawy”).

## Zostało (następca)
`npm run verify:szybkie` (4. przebieg, głowa przed tym plikiem) — Jest: 16 plików czerwonych, 21 testów. Gałąź wypchnięta ze znacznikiem `lekkie` (bez Jest), więc `tests.yml` będzie czerwony do naprawy. Większość to oczekiwane skutki zamierzonych zmian (testy pilnujące starego stanu):
- `figures-v2-zgodnosc-wsteczna` — bajtowa baza SVG Standing/Seated Calf Raise i Straight Raises: przeliczyć bazę (zmiana zamierzona, zrecenzowana).
- `figures-v2-delt-raise-w02` — test „karta zostaje ukryta” nieaktualny po recenzji (werdykt „wyswietlana”): odwrócić asercję.
- `figures-v2-slad-dzwignia` — Standing (miednica → barki), Seated (kostka → udo): zaktualizować przypadki.
- `figures-v2-nakladka-fix4` (R1: macierz wskazówka vs element — Standing Calf Raise ma teraz element), `figury-rozszerzenia-gora` (leżenie przodem na skosie — lista ćwiczeń/zakres biodra po nogach prostych), `figury-backlog-r2` (L4 odcisk kontraktu po zmianie `contract.ts`).
- `figury-recenzja`, `karty-recenzja`, `l047-recenzja-niezalezna` — zapis recenzji: wpis w pliku recenzenta `docs/research/recenzje/*.json` (sha, werdykt, recenzent) dla nowych wpisów delt_raise/calf_raise/FIDR; FIDR nie jest już „do poprawy”.
- `skroty-przekladu` (`UPDATE_SKROTY=1` po zmianie fidr.move), `research-quotes` (długość cytatów — prawdopodobnie `w02-badacz-reguly-2026-11-11.md` albo recenzje W-02), `wybor-testow-l103` (liczba testów wybieranych dla docs/research).
- `pokrycie-katalogu` (zapadka/minimum), `strona-eksport`, `strona-eksport-recenzja` (wstrzymane puste, karta FIDR bez przekładu = brak zdania), `store-review-notes` (rodziny/wstrzymane w notatce do recenzji Apple).
Log: przy następnym przebiegu `npm run verify:szybkie > plik`; nazwy testów w raporcie PRZEKAZANIE.

## Pułapki
- Zmiana `contract.ts` przesuwa odcisk L4; zmiana póz — skróty w `figury-recenzja.json` (`node scripts/zrodla-runtime.mjs --skroty`).
- Po każdej zmianie kart: `node scripts/zrodla-runtime.mjs --write`, `node scripts/pokrycie-katalogu.mjs --write`, `node scripts/readme.mjs --write`, `node scripts/test-matrix.mjs --write`.
- Worktree lokalne wt-a…wt-d znikną z kontenerem; `w02/d-silnik` (obrót dzwonu) istnieje tylko lokalnie — opis i pomiary w docs/18 11.11.2026.
