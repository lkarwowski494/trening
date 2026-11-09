# STAN partii A4b (tekst: moc + przedramiona) — linia 1.1

## Teraz
- 09.11.2026 (sesja B #5, programista): gałąź `tekst/a4b-moc-przedramiona` od `origin/tekst/a4-core-moc` (b9ca7a37). Zakres z `policz()`: 71 ćwiczeń bez wskazówek
  (kb_ballistic 13, plyo 22, sled_throw 13, strongman 10, forearm 13).
- **Dane:** 10 kart (Kettlebell Clean, Kettlebell Snatch, Double/One-Arm Kettlebell Push Press, Double Kettlebell Snatch, Split Jump, Lateral Cone Hops, Backward Drag,
  Atlas Stones, Plate Pinch), 9 niepełnych, 24 zdania PL/EN, 18 źródeł, 3 nowe organizacje — fixture `tests/fixtures/cues-a4b-moc.json`, test `tests/zrodla-pelne-cues-a4b-moc.test.ts`,
  zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-a4b-wskazowki.json`, lista dla recenzenta `a4b-klucze.json`.
- 09.11.2026: strażniki liczności (cues, cues-014, figures-v2-cues, strona-eksport, P2 — Split Jump w zestawy_zmienione, docs/09, L-103 +1), skróty przekładu, pliki generowane; zawężone `kbb.cleanMove`, `kbb.rack`, `as.grip` do przeczytanych miejsc źródeł (lekcja recenzji A4a); scalone poprawki rundy 1 A4a (dane A4b odtworzone importerem na wersji A4a); zapadka kompletu kart języków 574 → 573 z powodem (Split Jump ukryty do przekładu — decyzja do potwierdzenia przez koordynatora; alternatywa: wstrzymać Split Jump). Bramka: test-fast --od-bazy 276/276 zielone, verify:lekkie zielone; push 01a306d3 → tests.yml 42578614502 (w toku przy zapisie).
- Następny krok: zielony tests.yml → recenzja niezależna (badacz + recenzent lokalizacji PL/EN wg a4b-klucze.json) → przekład (osobna zgoda); role plyo/sled_throw — osobne zadanie.

## Wstrzymane do decyzji koordynatora (karty spełniają albo prawie spełniają regułę)
- One-Arm Kettlebell Clean and Jerk — „ta sama faza” (decyzja audytora z W1, nierozstrzygnięta).
- Depth Jump — pytanie P2 z 03.11: katalog = wskok na drugą skrzynię, źródła = odbicie z podłogi.
- Turkish Get Up — P2: „do decyzji koordynatora” (wygaszenie `tgu.eyes`, test lokalizacji pt/pt-BR). Karta W1 spełnia regułę.
- Medicine Ball Scoop Throw — jedyne źródło wyskoku (Human Kinetics, fragment książki NSCA) bez kwalifikacji i daty na stronie (odczyt 09.11) → niebyłe; bez wyskoku karta = Backward Medicine Ball Throw (duplikat w katalogu?).

## Niewdrożone
- Bez ustawienia/ruchu: Front Cone Hops (PEP ustawienia tylko pośrednio — warunkowo), Single-Leg Lateral Hop i Lateral Bound (jedno badanie szczebla 3), Supine Chest Throw,
  Bear Crawl Sled Drag (EliteFTS M. Roy niebyłe), Log Lift, Tire Flip, Yoke Walk (Bells of Steel niebyłe), Wrist Roller (jw.).
- Bez błędu przy pozach v2: One-Arm KB Jerk, One-Arm KB Swings, Single Leg Push-Off, 7 kart forearm (błędy tylko wnioskowane — `wr.mis.lift` odrzucony).
- Bez bloków w badaniach: 38 (lista `otwarte` w fixture).

## Narzędzia (poza repo, `<SCRATCH>/tools`)
`ext.py` (bloki JSON z plików badań `<SCRATCH>/bad/<gałąź>/`), `dump.py`, `stage.py` (wybór bloku per ćwiczenie, NIEBYLE, ocena ≥ 2 organizacje), `importer.py` (zapis do repo,
teksty PL/EN, figures.json open, cue-sets own, karty_nowe), `zakres.mjs` / `pozy.mjs` (z `policz()`). Kolejność: importer → `node scripts/cues/gen.mjs` → `zrodla-runtime.mjs --write` ×2 → `figures/gen.mjs`.

## Pułapki
- `kind` organizacji: tylko org, site, maker, study, book, app (badania mają „medical”).
- `figures.json` i `cue-sets.json` mają wcięcie 2, `cues.json` — 1; słowniki tekstów nie są sortowane (nowe klucze na końcu).
- `tgu.eyes` osieroca się, gdy Turkish Get Up dostaje kartę.
