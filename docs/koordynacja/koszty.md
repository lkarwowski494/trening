# Koszty sesji (usage.cost_usd, równowartość w limicie subskrypcji; API przekładu osobno: 0 USD / 30 USD ZB-057)
| Sesja | Rola | Szacunek USD | Rzeczywisty USD | Kontekst max % | Czasy | Oczekiwanie | Uwagi |
|---|---|---|---|---|---|---|---|
| P-1 …VBw2eKcS22XQSJG4qft | partia 1 | — | 47 (21:00) | 29 | 18:57→21:36 | — | przekazana |
| P-1 …VBzsYzRKDwnh7aast4Y | partia 1 kont. | — | b.d. | ~20 | 21:36→23:06 | — | przekazana |
| P-1 …VBxNaAEefAUfCL8vLG1 | partia 1 kont.3 | — | 34 | 29 | 23:06→01:07 | — | przekazana |
| P-1 …VBx7QqXRjB2JpVi4Kww | partia 1 kont.4 | — | 20,6 | 38 | 01:07→04:03 | CI limit Jest | zarchiwizowana 05:56 |
| P-2 …VBx1RfrSnnQXw6gc6zC | partia 2 | — | 27 | 29,5 | 18:57→21:04 | — | przekazana |
| P-2 …VBydWMy3Mvkq6ew7xAZ | partia 2 kont. | — | 21 | 27,5 | 21:04→00:36 | — | przekazana |
| P-2 …VBvdsMU66FhsPJWpG8J | partia 2 kont.2 | — | 28,6 | 32 | 00:36→04:43 | — | zarchiwizowana 05:56 |
| P-3 …VBzsqbUGWibKL85ugBA | partia 3 | — | 36 | 50 | 18:57→21:45 | — | przekazana |
| P-3 …VBzk52zTw31SRXRs8To | partia 3 kont. | — | 4,5 | 28 | 21:45→00:37 | — | zarchiwizowana 05:56 |
| P-4 …VBz37fikLrafFxEbBYK | partia 4 | — | 60 | 31 | 23:35→02:53 | — | przekazana |
| P-4 …VByqWgLJQQccrmCXLmn | partia 4 kont. | — | 18,2 (archiwizacja 05:56) | 15 | 02:53→05:35 | — | wstrzymana, zarchiwizowana |
| P-5 …VByZrLpWxNF8yF3gpgu | partia 5 | — | 57,5 (archiwizacja 05:56) | 34 | 00:38→05:51 | — | wstrzymana, zarchiwizowana |
| koordynator …VByJCWCao1Hw3is68Cy | koordynator | — | 176 (05:05, od 08.11) | 44 | — | — | migracja na M9 |
| A …VBviwDCU3NCJVaVH1WP | 08 build (sonnet): pociąg-4, partia 4 | 25 | 3,69 | 29,1 | 07:06 zlecone → 07:08 start (2. próba create_session) → 07:47 push 760afa88 → CI b.d. → nieprzyjęte (A2) | 8 min: 1. próba startu przerwana (WG-05); 8 min: PYTANIE czekało na odczyt z transkryptu | kontekst wyczerpany scaleniem 1 z 2 gałęzi; następca A2 |
| B …VBzi6xg7DYJMg2oYF8Q | 08 build (opus): partia 5 domknięcie | 60 | 20,00 | 37,3 | 07:06 zlecone → 07:10 start → 09:11 push ef42f8e4 → CI w toku (42788593262) → odbiór po CI | ~20 min: jest(3) > 20 min na gałęzi bez KO-012 (KO-021) | push zbiorczy na końcu (114→74 commity) |
| A2 …VBywmTeUKRmGrUr71SN | 08 build (opus): pociąg-4 dokończenie | 40 | 10,54 | 27,7 | 08:02 zlecone → 08:05 start → 10:04 push d6d8f6ed → 10:18 CI zielone → 10:25 przyjęte | ~20 min: 1. verify:szybkie padł na płytkim klonie (maestro-57) | szacunek 40 vs 10,54 |
| C …VBxTDiB5JhTrZDFWNK4 | 08 build (opus): partia 6 plyo | 60 | 18,87 | 39,8 | 10:20 zlecone → 10:33 start → 11:36 push fed9a704 → CI b.d. → odbiór po C2 | ~50 min: czekanie na podział poseData.ts (KO-024) | kontekst 39,8% > 38% — zadanie rodziny 27 ćw. + 3 rundy recenzji za duże na jedną sesję |
Mnożnik szacunku: brak szacunków tej nocy [DO USTALENIA].
Przegląd przepływu 2026-11-10: największa strata ~1 h na każde dociąganie integracji → WG-01.
| D | 08 build | 60 | 37,30 | 32,3 | 10:36 → 10:36 → ? → (czerwony spodziewany) → nieprzyjęta | czekała na KO-024 ~2 h (zapas poseData.ts 0 B — błąd polecenia) | przekazanie do D2 |
Przegląd przepływu 2026-11-10 14:00: największa strata ok. 2 h × 4 sesje — oczekiwanie na podział poseData.ts (KO-024) → WG-08. Koszt od 07:00: ok. 205 USD (szacunek z get_session; C2, D2, E2 bez licznika).
| G | 08 build (pociąg-5) | 25 | 14,36 | 32,5 | 10:44 → 10:45 → 2d976328 → 42829498589 zielony → przyjęta 14:52 | ~3 h czekała na KO-024 | WG-08 |
| F | 08 build (partia 9) | 60 | 39,99 | 36,4 | 10:41 → 10:42 → … → nieprzyjęta (F2) | ~2 h push zablokowany do KO-024 | WG-08 |
