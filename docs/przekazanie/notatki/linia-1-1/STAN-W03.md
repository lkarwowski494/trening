# STAN W-03 — przekład i recenzja lokalizacji (sesja T, 11.11.2026)

Gałąź `lok/w03-przeklad` (od `integracja-1-1` @ 46365a53; scalona świeża integracja 016ef5e1 w 0bd59b29). Polecenie: `docs/koordynacja/polecenia/T.md` na gałęzi `koordynacja`.

## Zrobione (SHA)
- bb9e794d inwentarz skryptem `scripts/i18n/inwentarz-przekladu.mjs` → `docs/lokalizacja/inwentarz-w03.md` (27 UI, 1 wskazówka, 277 nazw × 33).
- 2… kontekst z pozycji zestawu w `scripts/i18n/przeklad-api.mjs` (test czerwony→zielony, `tests/przeklad-kontekst.test.ts`).
- cba0247a/06aa2d9d nazwy lokalne: dane `docs/lokalizacja/nazwy-lokalne.json`, generator `scripts/i18n/gen-nazwy-lokalne.mjs` (--write/--check/--zestaw/--z-raportu), `lib/nazwy-lokalne.ts` tylko języki z recenzją „zatwierdzone”; PL zatwierdzone (recenzja `docs/research/recenzje/w03-lokalizacja-recenzent-2026-11-11.json`, 58 poprawek A + 9 B naniesione przez tłumacza); testy `tests/nazwy-lokalne-w03.test.ts`, zb044 (afterEach przywraca dane).
- e7d0c456 strażnik słownika terminów obejmuje nazwy lokalne (33 języki).
- 45def8bf przekład API UI 27×33 nałożony (run 43051553957, raport `docs/lokalizacja/raport-przekladu-2026-11-11-w03-ui`, szac. 1,77 USD); d6181ca6 wyjątek „Skok” cs/sk/hr/sl.
- d14f8c58 recenzja 27 kluczy UI × 33 (`docs/research/recenzje/w03-ui-recenzent-2026-11-11.json`, „zatwierdzone po poprawkach”) — 18 poprawek naniesionych przez tłumacza, zgodność sprawdzona skryptem (0 niezgodnych); otwarte z recenzji: zh-Hant „拉回”, pt „Flexão”/„Puxada”, bg „Разтягане” (native speaker), lt/ms stare „rysunek_zdanie” (spoza W-03), nazwy ustawień iOS w et/lt/sk/uk/ro.
- 0bd59b29 scalona integracja-1-1 @ 016ef5e1 (check:zrodla-runtime zielone).
- Kontekst „Ściąganie” skrócony do ≤ 200 znaków (był ucinany) — `docs/lokalizacja/konteksty-reczne.json`.

## Sesja T2 (11.11.2026, polecenie T2.md na gałęzi koordynacja)
- 02b046e7 fidr.move ×33 + odsłonięcie FIDR (odwrócenie 1eaa8fe8), cele pelnaKarta 523; 631e32dd skróty przekładu.
- 7b9f3c78 nazwy 277×33 nałożone; 0e70fe05 tłumacz skraca 44 nazwy > 60 zn.; 7afa7899 recenzja 33 języków (4 przebiegi recenzent-lokalizacji, 103 + 5 poprawek, tłumacz 108/108), 33 języki zatwierdzone w lib/nazwy-lokalne.ts; zapis docs/research/recenzje/w03-nazwy-33-recenzent-2026-11-11.json.
- 30e495b9 naprawa tests.yml 43070158337 (L-047 plik recenzenta recenzje/w02-delt_raise-r1.json zapisał audytor; wybor-testow-l103; docs/16 819 zdań; wyjątek „Bosu”); e2ee07fc lib/nazwy-lokalne.ts → lib/nazwy-lokalne.generated.ts (hak M1-054, 650 KB); tests.yml 43078373167 zielony; scalone do integracja-1-1 (79117f33).
- d13c3b22 ZB-057 ok. 8,75 USD z 30. Dokumenty: docs/18 (KO-047 „Przyciąganie” wariant A — otwarte do wdrożenia; nazwy 33 języków; „Skok”, kontekst), docs/49 W-03 (stan, pytania do native speakerów).

## Zostało
1. Wdrożenie KO-047: PhaseName „Przyciąganie” (lib/figures/v2/anim.ts:68) dla cable_row.ts:7 i hip_abd_add.ts:10, klucz UI w lib/i18n.en.ts („Pulling”) i 33 słownikach (brzmienie jak „Ściąganie”, neutralne kierunkowo), test — programista + tłumacz, po wecie koordynatora.
2. Odpowiedzi native speakerów (docs/49 W-03) — poprawki tłumacza po odpowiedzi.
3. Strażnik słownika terminów nie czyta nazw lokalnych (docs/49 W-03, uwaga) — decyzja koordynatora.

## Pułapki
- Hak pre-push uruchamia check:slowniki (skroty-przekladu, kropka-srodkowa) — verify:lekkie ich nie łapie; po zmianie lib/cues/text: UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts.
- Test:fast `--od-bazy` przy zmianie słowników trwa > 25 min — pojedyncze pliki `--runInBand`, reszta w CI.
- Zestaw nazw ma rodzaj „nazwa” i pole „katalog” (nie „id”).
