# STAN partii B2 (figury nóg: 7 kart wstrzymanych w A2) — linia 1.1

## Teraz
- 09.11.2026 (sesja B #4, programista; gałąź `figury/b2-nogi` od `integracja-1-1` @ a2db6739): 7 kart własnych z badań A2 wdrożone jako **ukryte do recenzji niezależnej** (lista `hidden`, `karty_nowe`; Barbell Step Up — zestaw ogólny z recenzją → `zestawy_zmienione`). Dane: fixture `tests/fixtures/cues-b2-nogi.json`, test `tests/zrodla-pelne-cues-b2-nogi.test.ts`, zestaw przekładu `docs/lokalizacja/zestaw-przekladu-2026-11-09-b2-wskazowki.json` (9 zdań, bez API).
- Rozstrzygnięcie per karta (animowany błąd = błąd karty; `scripts/figures/agent-pozy/model.mjs:85`):
  | Karta | Błędy karty | Animacja | Decyzja |
  |---|---|---|---|
  | Split Squat, Lunges (sztanga), Barbell Walking Lunge | `lunge2.mis.lean` | było `lunge.mis.kneeIn` → brak | wycofane z animacji; pochylenie tułowia bez reguły kąta (plecy_proste mierzy zgięcie kręgosłupa) → `bledy_bez_animacji` |
  | Barbell Step Up | `stepup.mis.push`, `stepup.mis.drop` | było `kneeIn` → brak | wycofane; oba błędy to rozkład siły/tempo → `bledy_bez_animacji` |
  | Slider Hamstring Curl | `ballcurl.mis.sag` | było `ht.mis.arch` → brak | wycofane; reguły ślizgacza nie mierzą wysokości bioder → `bledy_bez_animacji`; **rysunek przebudowany na most — niżej** |
  | Bulgarian Split Squat (sztanga), Smith Machine BSS | `lunge2.mis.shallow` + **`lunge.mis.kneeIn`** | `kneeIn` bez zmian | błąd kolana dopisany do karty ze źródłami karty Bulgarian Split Squat (hantle) jako uproszczenie „wariant sprzętu” — **recenzent potwierdza**, że ruch się nie różni (Smith: prowadnica) |
  Pozy: usunięty tylko rząd błędu, klatki i sprzęt bez zmian (sprawdzone porównaniem JSON; wzorzec `figury-v2-zlote.json` — 5 odcisków, zmiana celowa opisana w teście; `figury-recenzja-p2` ZMIENIONE +5; `figury-p2-r3` −4 wyjątki przenikania ud — wiersze kneeIn zniknęły; `figury-p2-r2` próg liczności wierszy > 85).
- **glute_floor (Clamshell, Fire Hydrant) — odłożone (koordynator 09.11.2026: wariant A — razem z najbliższą zmianą plików wspólnych, CP-B po delt_raise, jedna recenzja różnicy):** przeniesienie błędu generatora z `hab.mis.high` na `clam.mis.roll`/`fh.mis.twist` wymaga wpisu w `grupy_bledow` (`data/zrodla/figury-sens.json`) → zmienia `lib/figures/v2/grupy.json`, który jest w `V2_WSPOLNE` (`scripts/zrodla-runtime.mjs:103`) — skrót wszystkich rodzin v2; sprawdzone lokalnie: `figury-recenzja.test.tsx` czerwony (skrót rodziny ready), `recenzja-wyjatki-1-1.test.ts` czerwony. Stan dziś spójny (pozy bez rzędu błędu ⊆ karta). Opcje dla koordynatora: **A** (rekomendacja) — zmiana `grupy.json` łącznie z najbliższą zmianą wspólną (np. gałąź delt_raise / fala wspólna) i jedna recenzja różnicy 7 rodzin ready (ruch, ślad, nakładka bez zmian — jak 08.11 przy `reguly-cwiczen.json`); **B** — osobno teraz (+1 runda recenzji różnicy); **C** — zostawić Clamshell/Fire Hydrant bez animowanego błędu (błąd tylko w tekście karty). Kod zmiany: 2 linie w `glute_floor.mjs` (cue w `hydrant()` i `clamshell()`) + 3 wpisy w figury-sens.json.
- **Slider Hamstring Curl — rysunek przebudowany na most (decyzja koordynatora 09.11.2026, wariant A):** karta z badań (NISMAT, ACE 59, NCSF) opisuje most — „biodra cały czas w górze”, błąd „biodra opadające” — a rysunek ACG-019 miał miednicę nisko i biodro zginające się z kolanem. Teraz `slizgacze()` w `scripts/figures/agent-pozy/leg_isolation.mjs` (tylko dane rodziny, bez `V2_WSPOLNE`) dobiera kąt tułowia w każdej z 9 klatek tak, by biodro było w linii z tułowiem. Pomiar (jointAngles, noga R): **przed** — miednica 19,9 cm stała, biodro 28° → −16°, kolano 100° → 12°; **po** — miednica 32,8 → 14,5 cm, biodro 5–9° od wyprostu w całym ruchu (siatka 41 próbek; znak biodra niepewny przy małych kątach), kolano 100° → 12°. Test ACG-019 zmieniony (`tests/figures-v2-planned-acg-leg-isolation.test.ts`, z datą). Karta nadal ukryta do recenzji.
- Dla recenzenta (L-047, L-050): rodziny `lunge` i `leg_isolation` mają status `planned` → `arkusz-slad.mjs` ich nie rysuje (`figureSpec` = null, `lib/figures/v2/figure.ts:33`); arkusz ze śladem toru dopiero przy statusie ready. Teraz: podgląd pełnej rodziny (Slider: zrób `--rodzina leg_isolation`) z zatwierdzonego stanu: `NODE_PATH=/opt/node-tools/node_modules node scripts/figures/agent-pozy/run.mjs --rodzina lunge --wyjscie <kat> --podglad` (i `--rodzina leg_isolation`) — PNG, `manifest.json` (błędy w pozie vs błędy karty), `katy-stawow.md`, znacznik `PODGLAD-WAZNY.txt`. Do sprawdzenia: treść 7 kart (źródła w `docs/research/27-wskazowki-zrodla.md`), uproszczenie BSS, źródło `hk-landow-stepup` (koordynator zleca badaczowi; Human Kinetics — organizacja warunkowa: szczebel 4 tylko przy autorze z kwalifikacjami; karta Barbell Step Up ma 2 organizacje tylko z nim), powody w `bledy_bez_animacji`.
- Otwarte (opcje, nie zrobione): animacja `lunge2.mis.shallow` (reguła `glebokosc_wykroku`, grupa zakres — wykonalna bez silnika, ale nowy rząd błędu = więcej recenzji); reguła wysokości bioder dla ślizgacza (nowa liczba → źródła).
- Narzędzia: import jak `narzedzia-a2.md` (`import_a2.py` z listą 7 kart, bez usuwania konfliktu póz, z dopisaniem `kneeIn` do BSS), potem `post` (figures.json open, wskazowki-ogolne, cue-sets own), `gen.mjs`, `zrodla-runtime --write`, `scripts/figures/gen.mjs`, `run.mjs --tylko … --zastosuj`, `UPDATE_SKROTY=1` (plik skrótów dopisany na końcu, kolejność zachowana), `ZLOTE_ZAPISZ=1`.
- Pułapka: `figury-sens.json` → `grupy.json` to plik wspólny skrótu rodzin; `bledy_bez_animacji` go nie zmienia (sprawdzone).

- **Recenzje niezależne 09.11.2026 (L-047):** audytor — ruch i ślad, 7/7 ZATWIERDZONE (`docs/research/recenzje/b2-nogi-figury-audytor-2026-11-09.md`); badacz — źródła kart, 6 „wyswietlana”, Barbell Step Up „poprawki” (`docs/research/recenzje/b2-nogi-karty-badacz-2026-11-09.md`). Wpisy v2 `lunge` i `leg_isolation` w `docs/research/figury-recenzja.json` zapisane (rodziny nadal `planned`, status bez zmian).
- **Barbell Step Up (koordynator 09.11.2026):** zdanie `stepup.mis.push` usunięte z karty (zostaje `stepup.mis.drop`); klucz `stepup.mis.push` usunięty też z `lib/cues/text/{pl,en}.json`, zestawu przekładu B2 (teraz 8 zdań), fixture i `figury-sens.json` — założenie „używa go karta Step Up” było błędne (karta Step Up go jeszcze nie ma; to właśnie P2), a strażnik `check:cues` odrzuca nieużywane zdanie. Sprzeczność z ACE 28 = otwarta pozycja P2 (uwaga w docs/21). Po zmianie zostaje wyłącznie materiał zatwierdzony przez badacza, więc ponowna weryfikacja niepotrzebna. Dopiski z raportu badacza wprowadzone (NSCA tab. 1 przy `lunge.mis.kneeIn` BSS sztanga/Smith; miejsce NSCA „Teaching cues” s. 44–45 przy `split.setup`/`bss.move`; dopisek „do potwierdzenia” zastąpiony potwierdzeniem).
- **Karty nadal w `karty_nowe` (wpisy „karty” odłożone):** zdania kart B2 (8) mają przekład tylko PL i EN (33 języki czekają — `docs/lokalizacja/zestaw-przekladu-2026-11-09-b2-wskazowki.json`; 2 z 35 plików `lib/cues/text/*.json`). Po przekładzie: wpisać poniższy JSON do sekcji `karty` w `docs/research/figury-recenzja.json` (skróty `sha` z `node scripts/zrodla-runtime.mjs --skroty` — przeliczyć, jeśli karta lub tekst się zmieni), usunąć 7 kart z `karty_nowe` w `tests/recenzja-wyjatki-1-1.json` i z `hidden` oraz odsłonić po decyzji o statusie rodzin.

```json
{
 "Split Squat": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; lunge2.mis.lean: NSCA PTQ tab. 1 + Catalyst 174",
  "uwagi": "Niska: miejsce NSCA przy split.setup/bss.move to „Teaching cues” s. 44–45, nie „table 2”.",
  "sha": "c778c8ec9faa"
 },
 "Lunges (sztanga)": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; lunge2.mis.lean: NSCA PTQ tab. 1 + Catalyst 354 + ACE 8",
  "sha": "5d8455f12883"
 },
 "Barbell Walking Lunge": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; lunge2.mis.lean: NSCA PTQ tab. 1 + Catalyst 600 (uproszczenie: ciężar nad głową → sztanga na plecach, potwierdzone)",
  "sha": "3818764a3055"
 },
 "Barbell Step Up": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana po usunięciu stepup.mis.push (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; stepup.mis.drop potwierdzone (Catalyst 560 + HK); stepup.mis.push usunięte z karty decyzją koordynatora 09.11.2026 (zostaje wyłącznie zatwierdzony materiał — bez rundy 2)",
  "uwagi": "Usunięte stepup.mis.push (sprzeczność z ACE 28 „Push off with the trailing leg”); sprzeczność na karcie Step Up — otwarta pozycja P2 (docs/21).",
  "sha": "f6d8ed690fd4"
 },
 "Bulgarian Split Squat (sztanga)": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; uproszczenie hantle → sztanga potwierdzone; lunge.mis.kneeIn: NASM BSS + NSCA PTQ tab. 1",
  "uwagi": "Niska: dopisać nsca-ptq-lunge (tab. 1 „Knee Caves Inward”) przy lunge.mis.kneeIn; ExRx nieprzeczytane w tej recenzji (403).",
  "sha": "b7d69b6803ae"
 },
 "Smith Machine Bulgarian Split Squat": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; uproszczenie hantle → suwnica Smitha potwierdzone; lunge.mis.kneeIn: NASM BSS + NSCA PTQ tab. 1",
  "uwagi": "Niska: jak Bulgarian Split Squat (sztanga).",
  "sha": "b7d69b6803ae"
 },
 "Slider Hamstring Curl": {
  "werdykt": "wyswietlana",
  "data": "2026-11-09",
  "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)",
  "autor": "programista sesji B #4 (figury/b2-nogi)",
  "recenzent": "badacz-merytoryczny (sesja koordynatora linii 1.1, niezależny)",
  "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia B2, runda 1 (01953ee4), 09.11.2026; „biodra cały czas w górze” i ballcurl.mis.sag: NISMAT + NCSF (wprost), ACE 59",
  "uwagi": "Niska: „kolana ugięte” w slcurl.setup wprost tylko NISMAT; ACE 59/NCSF to wariant piłki (nazwane uproszczenie).",
  "sha": "d4048f0a72f5"
 }
}
```

## Historia
