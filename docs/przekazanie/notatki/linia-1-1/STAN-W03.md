# STAN W-03 — przekład i recenzja lokalizacji (sesja T, 11.11.2026)

Gałąź `lok/w03-przeklad` (od `integracja-1-1` @ 46365a53; scalona świeża integracja 016ef5e1 w 0bd59b29). Polecenie: `docs/koordynacja/polecenia/T.md` na gałęzi `koordynacja`.

## Zrobione (SHA)
- bb9e794d inwentarz skryptem `scripts/i18n/inwentarz-przekladu.mjs` → `docs/lokalizacja/inwentarz-w03.md` (27 UI, 1 wskazówka, 277 nazw × 33).
- 2… kontekst z pozycji zestawu w `scripts/i18n/przeklad-api.mjs` (test czerwony→zielony, `tests/przeklad-kontekst.test.ts`).
- cba0247a/06aa2d9d nazwy lokalne: dane `docs/lokalizacja/nazwy-lokalne.json`, generator `scripts/i18n/gen-nazwy-lokalne.mjs` (--write/--check/--zestaw/--z-raportu), `lib/nazwy-lokalne.ts` tylko języki z recenzją „zatwierdzone”; PL zatwierdzone (recenzja `docs/research/recenzje/w03-lokalizacja-recenzent-2026-11-11.json`, 58 poprawek A + 9 B naniesione przez tłumacza); testy `tests/nazwy-lokalne-w03.test.ts`, zb044 (afterEach przywraca dane).
- e7d0c456 strażnik słownika terminów obejmuje nazwy lokalne (33 języki).
- 45def8bf przekład API UI 27×33 nałożony (run 43051553957, raport `docs/lokalizacja/raport-przekladu-2026-11-11-w03-ui`, szac. 1,77 USD); d6181ca6 wyjątek „Skok” cs/sk/hr/sl.
- Kontekst „Ściąganie” skrócony do ≤ 200 znaków (był ucinany) — `docs/lokalizacja/konteksty-reczne.json`.

## Zostało
1. Pobrać artefakty (hosty productionresultssa3 / sa8 — prośba do koordynatora): fidr.move run 43053668717 (artefakt 13871485384), nazwy run 43053674252 (artefakt 13871855055); wygasają 18.11.2026.
2. fidr.move: `--zastosuj <raport> --zestaw docs/lokalizacja/zestaw-przekladu-2026-11-11-w02-wskazowki.json`; w tym samym commicie odsłonić kartę FIDR = odwrócić 1eaa8fe8 (figury-recenzja.json „wyswietlana” z pola w02, lib/cues/data.json, pokrycie-cele pelnaKarta 522→523 i 3 metryki +1, fixtures pokrycia, tests cel-1-1, delt-raise-w02, strona-eksport 778→779), docs/18 krótki wpis.
3. Nazwy: `node scripts/i18n/gen-nazwy-lokalne.mjs --z-raportu <raport>`; recenzja recenzent-lokalizacji 33 języków (próbka lub całość), poprawki tłumacz, ustawić `jezyki.<l>.recenzja` (wynik zatwierdzone) → `--write`.
4. „Ściąganie”: przekład z 1. przebiegu ma kontekst ucięty (cs „Stahování” = w dół) — recenzja w kroku 3 obejmuje ten klucz; poprawki tłumacz.
5. Recenzja nowych tekstów UI (27 kluczy) w 33 językach — recenzent-lokalizacji.
6. Koszt API do ZB-057 (szacunek.json z raportów): dowodowy 0,11 + UI 1,77 + fidr ? + nazwy ? USD.
7. docs/49 W-03, docs/18 decyzje (KO-046 lista = 278 NAME_EN; dane nazw z polem recenzji; wyjątek „Skok”), `verify:szybkie`/lekkie, push, `tests.yml` zielony.

## Pułapki
- Test:fast `--od-bazy` przy zmianie słowników trwa > 25 min — pojedyncze pliki `--runInBand`, reszta w CI.
- `NAME_EN` ma też dawne nazwy wyświetlane (LIB_DISPLAY_NAME) — dane nazw tylko po kluczach CATALOG.
- Zestaw nazw ma rodzaj „nazwa” i pole „katalog” (nie „id”) — inaczej trafia do PENDING testów albo jest brany za zestaw wskazówek.
