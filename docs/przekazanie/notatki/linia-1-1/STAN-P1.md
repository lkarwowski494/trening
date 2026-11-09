# STAN partii P1 (tekst: squat i hinge, karty W1/W2) — linia 1.1

## Teraz
- 09.11.2026 (sesja chmurowa, programista): gałąź `tekst/p1-squat-hinge` od `origin/integracja-1-1` (0e881c5). Dane P1: **9 kart z 17** — Clean Deadlift, Single Leg RDL (hantel), Single Leg RDL (linki), Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat, Squat with Chains, Squat with Bands; 10 zdań PL/EN, 16 źródeł (fixture `tests/fixtures/cues-p1-squat-hinge.json`, test `tests/zrodla-pelne-cues-p1-squat-hinge.test.ts`, zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-p1-wskazowki.json`, lista dla recenzentów `p1-klucze.json`, wpis docs/18 09.11).
- Niewdrożone (bez błędu z 2 organizacjami; zostaje zestaw ogólny z animowanym błędem): SLDL, Smith SLDL, Deficit, Sumo (kettlebell), Axle, Cable (Bells of Steel = 5), Zercher, Double KB Front Squat. Błędy bez pozy rigu odrzucone: slrdl.mis.hipOpen, ohs.mis.armsForward.
- **Bloker do decyzji koordynatora (pytanie wysłane 09.11.2026):** 7 kart (6 squat + Clean Deadlift) zmienia dobór linii/elementów/błędów rysunku (`scripts/skrot-v2-dobor.mjs`) → skróty recenzji rodzin squat i hinge się zmieniają → rodziny znikają z v2 do recenzji różnicy (lista różnic: `p1-klucze.json` → `zmianyDoboru`). Opcje A/B/C w wiadomości; domyślnie A (squat, hinge w `v2` w `tests/recenzja-wyjatki-1-1.json`, asercje stanu przepisane; gałęzi nie scalać przed wpisem audytora).
- Następny krok: decyzja → test-fast --od-bazy, verify:lekkie, push, tests.yml; potem recenzja niezależna (badacz + lokalizacja PL/EN wg p1-klucze.json) i recenzja różnicy rodzin squat/hinge (audytor).

## Otwarte po P1
- EliteFTS (gumy, łańcuchy) = 4 jako producent własnego sprzętu — do potwierdzenia przez recenzenta (Chains, Bands).
- Pozy rigu dla błędów z 2 organizacjami: `slrdl.mis.hipOpen` (Single Leg RDL), `ohs.mis.armsForward` (Overhead Squat) — zmiana silnika (errors.ts, plik wspólny) poza partią tekstu.
- Drugie źródła szczebla 4: SLDL `mis.barAway`, Axle `mis.barAway`/`dl.mis.hipsFirst`, Zercher `sq.mis.chestDrop`, DKBFS `kbfs.mis.drop`, Cable Deadlift (ustawienie wyciągu — tylko blog producenta), Sumo (kb) `mis.roundBack` (tylko NASM).

## Narzędzia
- Python w katalogu roboczym sesji (`<SCRATCH>/tools`, poza repo): `import_p1.py` (bloki W2 i W1-przeliczenie, filtr ≥ 2 organizacje szczebla ≤ 4, błąd tylko z pozą rigu, karta tylko z błędem), `post_p1.py` (figures.json open, wskazowki-ogolne, cue-sets own, karty_nowe), `fx_p1.py` (fixture, zestaw przekładu), `klucze_p1.py` (+ `dobor.mjs` — różnica doboru względem bazy). Kolejność: import → post → `node scripts/cues/gen.mjs` → `node scripts/zrodla-runtime.mjs --write` (2×) → `node scripts/figures/gen.mjs` → fx → `UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts` → klucze.

## Pułapki
- Skrót recenzji rodziny v2 zawiera WYNIK doboru po kartach z pełnych danych (bez bramki ukrycia) — karta własna w rodzinie rigowej zmienia skrót nawet ukryta.
- Single Leg RDL ma rysunek v2 (hinge, styl singleLeg) — dobór bez zmian względem zestawu ogólnego.
