# D-1 — wykonalność: zwis pod drążkiem (Inverted Row) i platforma pod przodostopiem (Calf Press)

Analiza tylko do odczytu na `integracja-1-1` (08.11.2026, agent planujący na zlecenie koordynatora). Decyzja źródłowa: `docs/18-przekazanie.md:297`. Wyjątki dziś: `data/zrodla/figury-wyjatki.json:10` (Inverted Row), `:12` (Calf Press).

## Ustalenia wspólne
- Skrót recenzji rodziny = plik rodziny + 34 pliki `V2_WSPOLNE` (`scripts/zrodla-runtime.mjs:103`, `:110`). Zmiana pliku wspólnego unieważnia skrót 7 rodzin z recenzją (squat, bench_press, hinge, pull_up, curl, olympic, triceps); przy rysunku bez zmian wystarcza recenzja różnicy (md5 kształtów, precedens 05.11 i 08.11; ok. 0,5–1 h audytora).
- Inverted Row należy do `pushup_plank` (`families.ts:114`), Calf Press do `leg_machine` (`families.ts:106`) — obie rodziny bez recenzji (partie D-3/B1 i D-4/B2). Generatory istnieją: `scripts/figures/agent-pozy/pushup_plank.mjs:134-152` (`inverted()`), `leg_machine.mjs:15-41` (`suwnica`, `calfPunkt`).

## Inverted Row
- Silnik wystarcza (drążek `sztanga` + `slupek`, styk dłoni `contacts.ts:41`, styk pięt `contacts.ts:27-31`). Blokada jest geometryczna: przy obrocie ciała wokół pięt bark przesuwa się ok. 12 cm ku stopom, więc reguła „ręce w pionie ±10°, drążek nad mostkiem ±8 cm” (`scripts/figures/v2-jakosc.mjs:50-51`, `:468-472`) nie da się pogodzić z torem łokcia i odwiedzeniem ≤ 45° (`:246`, `:475-480`) — zgodne z `figury-wyjatki.json:10`.
- **IR-0** — strojenie w obecnych regułach (tylko rodzina), 1 h na próbę, szansa ok. 20%.
- **IR-A (rekomendacja)** — doprecyzowanie reguły zwisu (np. „ręka prosta, prostopadła do tułowia ±10°” albo ≤ 20–25° od pionu) + strojenie; pliki: `v2-jakosc.mjs:50`, `pushup_plank.mjs`, `poses/pushup_plank.json`, `figury-wyjatki.json:10`, testy `figury-jakosc.test.ts:25,97-98,136-138`; bez plików wspólnych; 3–5 h. Kąt zwisu to kwestia merytoryczna (technika) — rozstrzyga badacz źródłami (już cytowane przy `inv.rigid`, `data/zrodla/figury-sens.json:928`), oznaczenie „uproszczenie”, nie decyzja właściciela.
- IR-B (przeniesienie do `row`, zmiana `families.ts`) i IR-C (zmiana modelu ciała) — odradzane.

## Calf Press
- Platforma suwnicy jest zawieszona przy kostce i rysowana symetrycznie (`gear.ts:284-286`, `draw.ts:391-396`); `props()` nie dostaje pięty ani palców (`gear.ts:554`, `contract.ts:319`) — bez zmian silnika nie da się oprzeć platformy o przodostopie (CP-0 niewykonalne).
- **CP-B (rekomendacja)** — rozszerzenie tylko dopisujące: punkt `przodostopie` w `gear.ts` (LEVER_POINT), stopy przekazane w `contract.ts:319`, widok z boku w `families.ts:76-79`; reguła `stopa_na_platformie` z parametrem (bez nowego id w `grupy.json`); 3 pliki wspólne → recenzja różnicy 7 rodzin; 5–7 h.
- CP-A (pełny prymityw płyty z koliderem i stykiem, ok. 7 plików wspólnych, 9–13 h) — dopiero gdy recenzent odrzuci CP-B albo w 1.2.

## Kolejność
1. IR-0 (limit 1 h) → przy porażce IR-A po rozstrzygnięciu badacza.
2. CP-B jedną partią „silnik: zwis i platforma”, z jedną recenzją różnicy 7 rodzin.
3. D-1 przed recenzjami rodzin pushup_plank (B1) i leg_machine (B2) — zmiana pozy po recenzji ją unieważnia. Po recenzji: usunąć wpisy `figury-wyjatki.json:10` i `:12`.
Łącznie ok. 8–12 h agenta + 0,5–1 h recenzji różnicy.
