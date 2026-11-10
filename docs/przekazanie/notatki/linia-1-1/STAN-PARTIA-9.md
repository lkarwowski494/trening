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

## Stan po F2 (10.11.2026)
- `figury/partia-9` = dokumenty + `figury/partia-9-leg_isolation` (7c2692a + poprawka CI 0cf404d) + `figury/partia-9-lunge` (d744f06) + `origin/integracja-1-1` @ 649b0504 (pociąg-5, partia 5). Commity: 0cf404d, d9479b30 (scalenie lunge + poprawki CI lunge), bdf1fd5d (integracja).
- Czerwone CI gałęzi rodzin i poprawki: leg_isolation (42829490469) — `skrot-v2-podlaczenie` używał leg_isolation jako „planned” (teraz core_floor; core_hang jest ready od partii 5), lista L-047 (Leg Curl, Leg Extension zdjęte); lunge (42832847691) — wpisy v1 Lunges (hantle), Walking Lunges, Step Up, Reverse Lunge straciły autor/recenzent (przywrócone z integracji), lista L-047 (5 kart zdjętych), filtr wyjątków toru squat wyklucza rodzinę lunge.
- Skróty po scaleniu: lunge f2ff1a209120, leg_isolation 19fc316f3a19 (= wpisy v2). Pełne karty po scaleniu 423 (integracja 649b0504: 391; figury/partia-9 przed scaleniem integracji: 403). P9-LI-4 zrobione (docs/21).

## Następny krok
`verify:szybkie` → push → zielony `tests.yml` na głowie → scalenie do integracji przez koordynatora (`scal-galaz`).

## Do weta koordynatora
- W4 lunge: wyjątek `hipMin` −25° dla Split Squat i Split Squat (linki) (`figury-sens.json`; wpis w docs/18 na gałęzi lunge).
- Wspólny kod: pole `side` w `PhaseOverride`; `gear.ts` — sztanga z `podazaZaChwytem`: z = średnia chwytów (olympic przesunięcie ≤ 0,05 cm, skróty bez zmian; P9-LU-3).
- `figures-v2-tor`: próg łuku kolana z geometrii (NOGA_LUK, 6 ćw. leg_isolation) — K14 audytora: nie poluzowanie.

## Pułapki
- Test `figures-v2-planned-acg-leg-isolation` (ACG-019) i odciski `figury-v2-zlote.json` / `figury-recenzja-p2` nie mają nazwy rodziny w ścieżce — programiści i recenzenci ich nie uruchamiali (lekcja L-NNN w docs/40). Zawsze `grep -l` po nazwie rodziny.
- Zapadka `pokrycie-katalogu`: po fali kart `--podnies-minimum` (nie zmieniać testu).
- `architecture-limits` zielony po przeniesieniu na układ KO-024 (gałęzie rodzin).
- Backlog: P9-LI-1..6, P9-LU-1..4 w docs/21.
