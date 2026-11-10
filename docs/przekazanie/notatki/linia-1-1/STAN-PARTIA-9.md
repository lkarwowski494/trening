# Stan partii 9 rodzin figur v2 (figury/partia-9)

Sesja F (tura 3), rola 08-programista; koordynator: session_01T66VBvauzmGEDCSRshqWXa (od 10.11.2026 ~12:00 UTC; wcześniej session_01T66VBzARTWMJ7smU82sfJs). Gałąź od `origin/integracja-1-1` @ b66ecfa2 (10.11.2026).
Rodziny: lunge (24 ćw. z pozami), leg_isolation (14 w rodzinie, 8 z pozami). cardio/neck/foam_roll — planned do 1.2 (KO-025, docs/18, docs/21).
Zysk z `node scripts/pokrycie-symulacja.mjs` (przed pracą; pełna karta): lunge +24, leg_isolation +8. Pomiar `pokrycie-katalogu` na gałęziach rodzin: pełne karty 371 → 379 (leg_isolation) i 371 → 395 (lunge); po scaleniu obu oczekiwane 403.
Model pracy: autor (programista, gałąź `figury/partia-9-<rodzina>`) → audytor r1 → poprawki innego programisty → r2… → przepisanie 1:1 przez leada → scalenie do `figury/partia-9`.

| Rodzina | Stan | Skrót v2 | Recenzje (docs/research/recenzje/) |
|---|---|---|---|
| leg_isolation | wyswietlana po r3; wpisy przepisane 1:1; scalona integracja 038efefc (KO-024) — `origin/figury/partia-9-leg_isolation` @ 7c2692a | 19fc316f3a19 (liczba 14) | partia9-leg_isolation-r1..r3 |
| lunge | wyswietlana po r2 (+ aneks K14 do d8282b8); wpisy przepisane 1:1; scalona integracja 038efefc (KO-024) — `origin/figury/partia-9-lunge` @ d744f06 | f2ff1a209120 (liczba 24) | partia9-lunge-r1, -r2 |

Commity LOAD/DATA_UI (do przeniesienia po podziale KO-024): leg_isolation 73f9548, lunge 18cdb40 (+ pole `side` w `PhaseOverride` — poseData.ts i figure.ts dataUiOf/measureOf, commit 1728824; wpisy `side: 'R'` tylko w DATA_UI lunge).

## Następny krok (F2)
Obie gałęzie rodzin mają już integrację 038efefc (podział `poseData.ts`): wpisy w `lib/figures/v2/rodziny/{leg_isolation,lunge}.ts`, pole `side` w `PhaseOverride`; skróty bez zmian; `verify:lekkie` 0, wypchnięte (10.11.2026).
1. `figury/partia-9` (dokumenty) + `origin/figury/partia-9-leg_isolation` + `origin/figury/partia-9-lunge` → scalenie. Konflikty jako suma: `docs/research/figury-recenzja.json` (scal JSON — wpisy obu rodzin), `tests/recenzja-wyjatki-1-1.test.ts` (po delt_raise: 'lunge', 'leg_isolation'), `lib/figures/v2/rodziny/index.ts`, families.ts, overlay.ts, mapping, strona-eksport (n), gemini-polecenia (planned −2), nakładka (rejestr), `tests/skrot-v2-wynik.test.ts` (overlay obu rodzin w regexie; scenariusz L-080 = core_hang), generator-odtwarza (W_ZAKRESIE), BRD, docs/18 (suma); pliki generowane przelicz (zrodla-runtime --write, pokrycie-katalogu --write + --podnies-minimum, test-matrix --write, readme --write).
2. docs/21: P9-LI-4 oznacz ZROBIONE (poprawka w 7c2692a: `wskazowki_na_reguly["lext.range"]` + zdjęty warunek omijający).
3. Skróty po scaleniu: lunge f2ff1a209120, leg_isolation 19fc316f3a19; testy czytające pozy obu rodzin (`grep -l "lunge\|leg_isolation" tests/`), `npm run verify:szybkie`, push, zielony `tests.yml`.

## Do weta koordynatora
- W4 lunge: wyjątek `hipMin` −25° dla Split Squat i Split Squat (linki) (`figury-sens.json`; wpis w docs/18 na gałęzi lunge).
- Wspólny kod: pole `side` w `PhaseOverride`; `gear.ts` — sztanga z `podazaZaChwytem`: z = średnia chwytów (olympic przesunięcie ≤ 0,05 cm, skróty bez zmian; P9-LU-3).
- `figures-v2-tor`: próg łuku kolana z geometrii (NOGA_LUK, 6 ćw. leg_isolation) — K14 audytora: nie poluzowanie.

## Pułapki
- Test `figures-v2-planned-acg-leg-isolation` (ACG-019) i odciski `figury-v2-zlote.json` / `figury-recenzja-p2` nie mają nazwy rodziny w ścieżce — programiści i recenzenci ich nie uruchamiali (lekcja L-NNN w docs/40). Zawsze `grep -l` po nazwie rodziny.
- Zapadka `pokrycie-katalogu`: po fali kart `--podnies-minimum` (nie zmieniać testu).
- `architecture-limits` zielony po przeniesieniu na układ KO-024 (gałęzie rodzin).
- Backlog: P9-LI-1..6, P9-LU-1..4 w docs/21.
