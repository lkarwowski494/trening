# STAN partii P1 (tekst: squat i hinge, karty W1/W2) — linia 1.1

## Teraz
- 09.11.2026 (sesja chmurowa, programista): gałąź `tekst/p1-squat-hinge` od `origin/integracja-1-1` (0e881c5). Dane P1: **9 kart z 17** — Clean Deadlift, Single Leg RDL (hantel), Single Leg RDL (linki), Barbell Hack Squat, Bodyweight Squat, Dumbbell Squat, Overhead Squat, Squat with Chains, Squat with Bands; 10 zdań PL/EN, 16 źródeł (fixture `tests/fixtures/cues-p1-squat-hinge.json`, test `tests/zrodla-pelne-cues-p1-squat-hinge.test.ts`, zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-p1-wskazowki.json`, lista dla recenzentów `p1-klucze.json`, wpis docs/18 09.11).
- Niewdrożone (bez błędu z 2 organizacjami; zostaje zestaw ogólny z animowanym błędem): SLDL, Smith SLDL, Deficit, Sumo (kettlebell), Axle, Cable (Bells of Steel = 5), Zercher, Double KB Front Squat. Błędy bez pozy rigu odrzucone: slrdl.mis.hipOpen, ohs.mis.armsForward.
- 09.11.2026: koordynator przyjął wariant A (squat, hinge w `v2` w recenzja-wyjatki-1-1.json, asercje stanu zależne od listy; decyzja w docs/18) — e3c80049.
- **Bloker 2 (raport do koordynatora 09.11.2026):** test-fast --od-bazy (222 pliki) + ponowienie 12 padłych na e3c80049: 21 testów czerwonych w 11 plikach. (1) Skutek ukrycia rodzin squat/hinge do recenzji różnicy: maestro-flows 17-biblioteka-technika i 57-grafika-cwiczenia (Back Squat bez rysunku — także prawdziwe E2E), maestro-57-bramka, spojnosc-karta-rysunek (5 rodzin/132), figury-recenzja N1, strona-eksport (`pelna`), pokrycie-katalogu zapadka (figura.v2 126<132, animowanyBlad 73<124, wskazowki.zTekstem 280<298, …). (2) Skutek karty ukrytej do przekładu (zestaw ogólny zastąpiony, karta własna niewidoczna — 9 ćwiczeń traci wskazówki w aplikacji do przekładu): figures-v2-nakladka-fix4 (Single Leg RDL), nakladka-squat-hinge W4' (Hack bez mis.roundBack), karty-recenzja (zestaw Barbell Hack Squat), zrodla-pelne-cues-a2-nogi:53 (strażnik A2: Overhead/Clean/… bez kart własnych), wybor-testow-l103 (+1), strona-eksport (słownik en +10). Nie przepisuję strażników przed decyzją (ryzyko osłabienia; reguła „dwa podejścia”).
- tests.yml gałęzi będzie czerwony (świadomie, do decyzji).
- Następny krok: decyzja koordynatora o blokerze 2 → poprawki strażników treściowych, test-fast, verify:lekkie, push, tests.yml.

## Otwarte po P1
- EliteFTS (gumy, łańcuchy) = 4 jako producent własnego sprzętu — do potwierdzenia przez recenzenta (Chains, Bands).
- Pozy rigu dla błędów z 2 organizacjami: `slrdl.mis.hipOpen` (Single Leg RDL), `ohs.mis.armsForward` (Overhead Squat) — zmiana silnika (errors.ts, plik wspólny) poza partią tekstu.
- Drugie źródła szczebla 4: SLDL `mis.barAway`, Axle `mis.barAway`/`dl.mis.hipsFirst`, Zercher `sq.mis.chestDrop`, DKBFS `kbfs.mis.drop`, Cable Deadlift (ustawienie wyciągu — tylko blog producenta), Sumo (kb) `mis.roundBack` (tylko NASM).

## Narzędzia
- Python w katalogu roboczym sesji (`<SCRATCH>/tools`, poza repo): `import_p1.py` (bloki W2 i W1-przeliczenie, filtr ≥ 2 organizacje szczebla ≤ 4, błąd tylko z pozą rigu, karta tylko z błędem), `post_p1.py` (figures.json open, wskazowki-ogolne, cue-sets own, karty_nowe), `fx_p1.py` (fixture, zestaw przekładu), `klucze_p1.py` (+ `dobor.mjs` — różnica doboru względem bazy). Kolejność: import → post → `node scripts/cues/gen.mjs` → `node scripts/zrodla-runtime.mjs --write` (2×) → `node scripts/figures/gen.mjs` → fx → `UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts` → klucze.

## Pułapki
- Skrót recenzji rodziny v2 zawiera WYNIK doboru po kartach z pełnych danych (bez bramki ukrycia) — karta własna w rodzinie rigowej zmienia skrót nawet ukryta.
- Single Leg RDL ma rysunek v2 (hinge, styl singleLeg) — dobór bez zmian względem zestawu ogólnego.
