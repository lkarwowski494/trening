# STAN partii A4 (tekst: core/moc + przedramiona) — linia 1.1

## Teraz
- 09.11.2026 (sesja B #3, programista): **A4a (core) — dane gotowe**: 17 kart, 50 zdań PL/EN, 33 źródła, rola Superman (fixture `tests/fixtures/cues-a4-core.json`, test `tests/zrodla-pelne-cues-a4-core.test.ts`, zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-a4-wskazowki.json`, wpis docs/18 09.11, lista dla recenzenta `a4-klucze.json`). Bramka przed wypchnięciem w toku.
- Następny krok A4a: zielony tests.yml → recenzja niezależna (koordynator: badacz + recenzent lokalizacji PL/EN wg a4-klucze.json) → przekład (osobna zgoda — ZB-051 obejmuje A1–A3).
- Następny krok A4b: osobna sesja albo kontynuacja od tego pliku (zakres niżej).

## Podział A4 (zakres > ok. 12 h — decyzja programisty wg briefu)
Zakres z `policz()` na a2db6739 (ćwiczenia bez wskazówek / bez ról):
- **A4a core** — core_floor 40 / 10, core_standing 17 / 18, core_hang 4 / 1, carry 5 / 2. Badania: bloki dla 36 ćwiczeń; po regule partii 17 kart.
- **A4b moc + przedramiona** — kb_ballistic 13 / 1, plyo 22 / 28, sled_throw 13 / 16, strongman 10 / 2, forearm 13 / 4. Badania: W1 `badania/g3-moc` (blok „po przeliczeniu 02.11.2026” w każdym pliku), W2 `badania/w2-moc` (kb_ballistic.md, plyo-a/b.md, sled_throw-sanki/rzuty.md), strongman i forearm: `badania/g6-przyciaganie` + `badania/w2-przyciaganie` (nagłówki „Blok do wdrożenia” na różnych poziomach). Szacunek wg STAN-w2-moc: kb 11, plyo 12, sled 10 kart z błędami w badaniach (przed regułą partii), forearm ok. 9, strongman 1–2. Decyzje do zastosowania z góry: REP Fitness, Radcliffe, SHRED Calgary, ISBS — w W2 „do decyzji koordynatora” (bez rozstrzygnięcia w docs/18 → niebyłe); elitefts-eight-drag (autor bez kwalifikacji); 4 karty forearm i Farmer's Walk — „wariant sprzętu” (pole `uproszczenie`); `wr.mis.lift` wnioskowany → odrzucony.
- Poza A4: olympic, thruster (nie w wierszu 1-A4 planu).

## Otwarte po A4a
- Niebyłe (pytania do koordynatora; każde rozstrzygnięcie na „4” przywraca karty): NFPT o crunchu na piłce (Stability Ball Crunch), Fitness Volt bez nazwiska autora (Alternate Heel Touchers, Barbell Side Bend), Institute of Motion (Cable Woodchop — `woodchop.setup`), FIG (L-Sit), Speediance (Pallof Press With Rotation).
- Role: `abs.brace`, `obliques.antirotation`, `obliques.side_bend` — nowe funkcje z tekstami UI w 31 językach; `abs.antilordosis` → dwa źródła (Dead Bug, Hollow Hold, Dragon Flag, Scissor Kick).
- Bez bloków w badaniach (core): Lying Leg Raise, Dragon Flag, Butt-Ups, Cable Seated Crunch, Cocoons, Decline Oblique Crunch, Stability Ball Knee Tuck, Frog Sit-Ups, Janda Sit-Up, Kneeling Cable Crunch With Alternating Oblique Twists, Leg Pull-In, Oblique Crunches - On The Floor, Otis-Up, Press Sit-Up, Seated Flat Bench Leg Pull-In, Side Jackknife, Smith Machine Hip Raise, Standing Rope Crunch, Weighted Sit-Ups - With Bands, Toe Touchers; Bent Press, Bosu Ball Cable Crunch With Side Bends, Cable Judo Flip, Medicine Ball Full Twist, One-Arm High-Pulley Cable Side Bends, Seated Barbell Twist, Spell Caster, Weighted Ball Side Bend; Double Kettlebell Front Rack Carry, Rickshaw Carry.

## Narzędzia
- Python w katalogu roboczym sesji (`<SCRATCH>/tools`, poza repo; pliki badań: `git show origin/badania/<gałąź>:<plik>` do `<SCRATCH>/bad/<gałąź>/…`): `ext.py` (bloki JSON z nagłówkiem), `tabs.py` (tabele zdań i źródeł), `cards.py` (W2/obowiązkowe z ustawieniem lub ruchem zastępuje W1; inaczej W1 + błędy W2; bloki „Kandydaci”, „NIEAKTUALNY”, „wstrzyman”, „warunkow” pominięte), `levels.py` (NIEBYLE, ALIAS, NEWORG, org_of po domenie), `evalc.py` (reguła ≥ 2 organizacje, bez ustawienia/ruchu, bez błędu przy pozach), `import_a4a.py` (zapis do repo), `zakres.mjs` (zakres z `policz()`). Kolejność: zakres → stage1 → evalc → import → rola → `node scripts/cues/gen.mjs` → `node scripts/zrodla-runtime.mjs --write` (2×) → `node scripts/figures/gen.mjs` → `UPDATE_ROLE_COUNTS=1 npx jest tests/muscle-roles.test.ts` → `UPDATE_SKROTY=1 npx jest tests/skroty-przekladu.test.ts` (potem kolejność kluczy jak w bazie — nowe na końcu).

## Pułapki
- Zdanie zestawu ogólnego używane tylko przez ćwiczenie z nową kartą staje się nieużywane (`gen.mjs`: „nieużywane zdanie”) — usunąć ze wszystkich słowników i z `cues-zestawy.json`, licznik w `tests/zrodla-pelne-cues-zestawy.test.ts`.
- Te same id zdań w dwóch plikach badań z innym brzmieniem (windmill core_standing-1 vs -2, `hang.pressBar` W1 vs W2, `core_floor.situpMove`) — wybór jawny w importerze.
- Cyfra w tekście („figure 8”) czerwieni test tekstów — „figure eight”.
- `UPDATE_SKROTY` przestawia kolejność kluczy w `skroty-przekladu.json` (duży diff i konflikt z gałęzią przekładu) — przywrócić kolejność bazy.
