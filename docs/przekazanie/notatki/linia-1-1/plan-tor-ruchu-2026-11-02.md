# Plan toru recenzji ruchu rodzin v2 — linia 1.1 (02.11.2026, agent planu; decyzje koordynatora na końcu)

Źródło: agent planu (tylko odczyt) na integracja-1-1 @ e51c51da; decyzje koordynatora na końcu i w docs/18 (02.11.2026).

## 1. Recenzja jednej rodziny dziś
- Bramki i lista kontrolna: origin/przekazanie-konta docs/przekazanie/notatki/53-grafiki-model-pracy.md :8-21, :23-35, :37-45, próbka co 5. rodzinę :60.
- Autor: generator scripts/figures/agent-pozy/<r>.mjs (wzór pull_up.mjs:9,10,34), sens data/zrodla/figury-sens.json, podgląd `node scripts/figures/agent-pozy/run.mjs --rodzina <r> --wyjscie <kat> --podglad [--log x.jsonl]`, `--zastosuj` → lib/figures/v2/poses/<r>.json.
- Podłączenie (3 miejsca): status 'ready' families.ts:27-69; LOAD poseData.ts:13-15; DATA_UI poseData.ts:58-71 (brak: curl, triceps, lunge, olympic, core_floor, overhead_press; delt_raise :62; plyo ONE_WAY_UI :80). Bez nich figureSpec null (figure.ts:33-35). Ukrycie do recenzji: lib/figures/data.json (figure.ts:50-57; zrodla-runtime.mjs:104,119); stan przejściowy tests/recenzja-wyjatki-1-1.json (v2).
- Recenzent (inny agent): `node scripts/figures/arkusz-slad.mjs --out <kat> --key "…"` (21 kadrów), lista 53:23-35, skrót `node scripts/zrodla-runtime.mjs --skroty`. Zapis docs/research/figury-recenzja.json v2.<r> (wzór pull_up 02.11: werdykt, data, kto, sha, liczba, stan, autor, recenzent, uwagi, slad), potem zrodla-runtime --write, usunięcie z wyjątków, docs/55 + fixture (wzór 40a459ea).
- Zakres strażników: slad — tylko v2 z datą ≥ 2026-10-29, długość > 10 (figures-v2-tor.test.ts:88-90); L-047 — werdykt wyswietlana ≥ 2026-10-28, tekst autor≠recenzent (l047…:12,19-26); kształt toru — rodziny ready z figurą (figures-v2-tor.test.ts:13-16); styk ciężar–ciało — tylko squat/bench_press/hinge (figury-styk.test.ts:2-3,30-31).

## 2. Kolejność (dane póz / przypisane, docs/55:54-75)
curl 36/36 (pilotaż) → triceps 29/32 → lunge 24/24 → olympic 23/25 → overhead_press 21/23 (próbka 2. recenzenta) → core_floor 21/44 → delt_raise 30/38 i plyo 27/28 po ZB-030 (ZB-030 równolegle po pilotażu). Gotowe: squat, bench_press, hinge, pull_up.

## 3. Pilotaż curl — miary
czas zegarowy autora/recenzenta, tokeny i % kontekstu, uwagi wg wagi, rundy poprawek, odsetek zaliczonych za 1. razem (run.mjs --log, pierwsze.json), wyjątki/przybliżenia, czas regeneracji. Sukces: wpis v2 curl „wyswietlana”, autor≠recenzent, slad dla 36 ćw. we wszystkich widokach, ≤ 2 rundy, 0 wyjątków toru bez powodu, ≤ ~30% kontekstu, zielony tests.yml, docs/55 figura v2 curl = 36.

## 4. Agenci
Autor = programista, worktree figury/<r>, pliki: agent-pozy, figury-sens, families/poseData, wyjątki, tests/figures-v2-mapping.test.ts:42-49; nazwy faz PhaseName (anim.ts:51) — nowa nazwa → t() + tłumacz. Recenzent = audytor (opus), osobna sesja, bez uzasadnień autora; 36 ćw. może nie zmieścić się w 30% → awaryjnie 2 sesje (sztanga/EZ vs hantle/linka). Gałąź figur nie commituje plików generowanych (lib/cues/data.json, lib/figures/data.json, fixture pokrycia, docs/55) — koordynator po scaleniu. lib/cues/* i cue-sets.json tylko tor tekstów.

## 5. 9 od zera
Wzór: funkcja w generuj() generatora rodziny → podgląd → v2-validate/v2-sens → recenzja → --zastosuj; usunąć z WYJATKI i figury-wyjatki.json.
Inverted Row, Side Plank (kontrakt bez obrotu tułowia — contract.ts), Ab Wheel → pushup_plank; Nordic Curl (wyjątek), Sissy Squat (bez źródeł) → leg_isolation; Cable Crunch → core_floor; Calf Press → leg_machine (brak platformy); Handstand Push Up → overhead_press (brak źródła ruchu); Meadows Row → row (tor gryfu). Konsekwencja: tor obejmuje też rodziny pushup_plank (17), leg_isolation (8), leg_machine (12), row (12).

## 6. Ryzyka
R1: families.ts, poseData.ts, contract.ts w plikach wspólnych skrótu (zrodla-runtime.mjs:96; strona/recenzja-figur.mjs:16) — każda zmiana statusu/LOAD/DATA_UI unieważnia skróty wszystkich rodzin (figury-recenzja.test.tsx:72) → squat/bench/hinge/pull_up znikają do odświeżenia (precedens 845f776a). R2 rozmiar sesji. R3 styk dla nowych rodzin — rozszerzyć figury-styk w pilotażu. R4 EXERCISE_VIEWS poza strażnikiem toru. R5 próbka co 5.

## Decyzje koordynatora (02.11.2026, techniczne)
- R1 = (a): podłączanie rodzin partiami w jednym commicie integracji z jednym odświeżeniem skrótów i niezależnym potwierdzeniem (precedens 845f776a); (b) zmiana zakresu skrótu — odrzucona na teraz (zmiana strażnika, wykonalność niesprawdzona; wrócić, jeśli odświeżenia staną się wąskim gardłem).
- R3: rozszerzenie figury-styk.test.ts na rodziny z ciężarem — w zadaniu pilotażu curl.
- 4 dodatkowe rodziny (pushup_plank, leg_isolation, leg_machine, row) wynikają z decyzji właściciela o 58 obowiązkowych — informacja dla właściciela, nie nowa decyzja; Sissy Squat i Handstand Push Up czekają na badacza (fala obowiązkowych).
