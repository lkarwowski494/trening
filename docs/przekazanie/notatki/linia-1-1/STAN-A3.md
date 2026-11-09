# STAN partii A3 (tekst: przyciąganie/ramiona) — linia 1.1

## Teraz
- 09.11.2026 (sesja B #2, programista): dane A3 — 17 kart, 33 zdania PL/EN, 25 źródeł (fixture `tests/fixtures/cues-a3-przyciaganie.json`, test `tests/zrodla-pelne-cues-a3-przyciaganie.test.ts`, zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-a3-wskazowki.json`, wpis docs/18 09.11, lista dla recenzenta `a3-klucze.json`). Role: 2 z 12 (Dead Hang, Lower Back Curl — istniejące funkcje).
- Zakres z `policz()` na ab59dd5: row 7, cable_row 7, pulldown 5, pull_up 2, shrug 6, back_extension 3, delt_raise 7, curl 2, triceps 3, rotator_cuff 5 = 47 bez wskazówek; role 12 (pull_up 2, shrug 1, back_extension 1, delt_raise 3, rotator_cuff 5). forearm (13) poza — pytanie do koordynatora.
- Karty ukryte do przekładu: 17 w `karty_nowe` (tests/recenzja-wyjatki-1-1.json); bez wpisów „karty” w figury-recenzja.json.
- Zottman Curl: reguły sensu z zestawu ogólnego przypisane w `figury-sens.json` `curl.warianty` — `reguly-cwiczen.json` (plik wspólny silnika) bez zmian.
- Następny krok: bramka (check:pochodne, test-fast --od-bazy, verify:lekkie) → push → tests.yml; potem recenzja niezależna (koordynator).

## Otwarte po A3
- Single Arm Cable Row — decyzja 4 W2 G6 (Healthline, krótka wzmianka o jednorącz).
- Role rotator_cuff 5 — nowe funkcje rotacji (W1 G2) wymagają tekstów UI w 31 językach (tłumacz + recenzja lokalizacji).
- Role: Scapular Pull-Up, Middle Back Shrug (brak 2 źródeł), Incline Shoulder Raise ×3 (dane katalogu).
- Rope Climb (BarBend + blog producenta lin = 5), Seal Row (FV + Bells of Steel), Smith Machine Bent Over Row (blogi producentów), Cable Rope Rear-Delt Rows — szukać drugiego źródła szczebla 4.
- Bez bloków w badaniach: delt_raise 7, triceps 3, Barbell Rear Delt Row, Kneeling High Pulley Row, Leverage High Row, Sled Row, Full Range-Of-Motion Lat Pulldown, Calf-Machine Shoulder Shrug, Middle Back Shrug, Weighted Ball Hyperextension, Reverse Flyes With External Rotation.

## Narzędzia
- Python w katalogu roboczym sesji (`<SCRATCH>/tools`, poza repo): `ext.py`, `tabs.py` (tabele „id/org/url/szczebel” także w wariancie W1 G6), `cards.py` (blok W2/obowiązkowe nadpisuje W1; nagłówki „NIEAKTUALNY/warunkowo/wstrzymane” pomijane; „dopisz” dokłada błędy), `import_a3.py` (lista NIEBYLE, WSTRZYMANE, UPR — uproszczenia), `fix_a3.py` (opisy stron), `post_a3.py`, `fx_a3.py`, `klucze_a3.py`. Kolejność: import → fix → post → fx → `node scripts/cues/gen.mjs` → `node scripts/zrodla-runtime.mjs --write` (2×) → `node scripts/figures/gen.mjs` → `UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts` → klucze.

## Pułapki
- `zrodla-runtime --write` przelicza `reguly-cwiczen.json` z kart — karta własna zastępująca zestaw ogólny w rodzinie z nakładką zmienia plik wspólny (wszystkie rodziny v2 tracą skrót recenzji i znikają z listy v2). Naprawa: `warianty` w figury-sens.json z pełną listą (łącznie z regułami „zawsze”, w tej samej kolejności).
- Źródła W1 G6 bez uzupełnienia 3 — blogi producentów liczone jako 5.
