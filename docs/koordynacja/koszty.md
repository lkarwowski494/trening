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
| E | 08 build (partia 8 + podział) | 60 | 31,62 | 32,7 | 10:39 → 10:39 → 5df065f9 → 42817800530 zielony (podział) → podział przyjęty 13:15; partia 8 → E2 | ~2 h oczekiwania na KO-024 (sama wykonywała podział) | zarchiwizowana 15:15 |
| koordynator …VBvauzmGEDCSRshqWXa | M9 | — | 15,38 | ~29 | 12:05 → 15:07 | — | przekazanie |
| C2 | 08 build (partia 6) | 60 | 8,14 | 27,9 | 13:16 → … → ca9e8357 → 42847984477 zielony → przyjęta 16:30 | — | w integracji 584bca9 |
| D2 | 08 build (partia 7) | 60 | 10,51 | 31,5 | 13:20 → … → 9e3db956 → 42848680372 zielony → do pociągu-6 | konflikt z partią 6 (28 plików) → pociąg | zarchiwizowana 16:40 |
| F2 | 08 build (partia 9) | 60 | 9,02 | 28,6 | 14:28 → … → 1bb3b55c → 42857877718 zielony → do pociągu-6 | — | zarchiwizowana 17:12 |
| H | 08 build (pociąg-6) | 25 | 11,92 | 30,8 | 16:38 → … → 7240d164 → 42882227994 zielony → przyjęte 19:32 | ~1 h verify:szybkie (WG-07) | zarchiwizowana 19:32 |
| E2 | 08 build (partia 8) | 60 | 19,96 | 35,4 | 13:58 → … → 213c3f9e → 42860496841 zielony → do pociągu-6 | 3 próby verify:szybkie (WG-07) | zarchiwizowana 17:55 |
| I | 08 build (pociąg-7, partia 8) | 25 | 13,10 | 32,9 | 19:36 → 19:40 → 20:02 (lokalnie) → 96918631 push 22:47 → tests.yml 42917720413 w toku | ok. 2 h verify:szybkie lokalnie (2 przebiegi; 1. padł na SEC2-08 — ścieżka /tmp w raporcie audytora) (WG-07) | zarchiwizowana 22:49 |
| K | 08 build (PR main, poprawki nocne) | 25 | 10,77 | 28,4 | 20:45 → 20:50 → fd636db5 push 22:25 → tests.yml 42914460167 + nightly 42914472276 (attempt 2) zielone 02:35 → PR #108 02:56 | ok. 2 h: 4 pełne verify (SIGTERM Jest, KO-035) + 5 h nightly | zarchiwizowana 03:00 |
| O | 08 build (docs: start strony) | 15 | 2,92 | 19,6 | 07:05 → 07:14 → ee49d68e → verify:docs 0 (koordynator) → przyjęte 07:40, integracja ddfcbe61 | 0 | zarchiwizowana 07:41 |
| M | 08 build (W-05 ryzyka + KO-038) | 25 | 8,70 | 28,0 | 06:30 → 06:43 → d0d5e9a7 push ~07:26 → tests.yml 42979568375 zielone 07:43 → recenzja audytora 0 KRYT/WYS 07:58 → przyjęte 08:00, integracja 1974df92 | odbiór ~15 min (recenzja) | zarchiwizowana 08:01 |
| L | 08 build (W-02 figury) | 30 | 28,75 | 31,8 | 06:30 → 06:40 → 8e0aa08f push 08:22 (verify:szybkie 1, znacznik lekkie) → PRZEKAZANIE 08:22 → L2 | — | zarchiwizowana 08:52; reszta W-02 → L2 |
| N | 08 build (PR #108 → main) | 15 | 5,50 | 20,6 | 06:30 → 06:37 → verify #1–#3 SIGTERM (06:40–08:08) → wariant C 08:10 → verify #4 08:42 (strażnik) → #5 kod 0 09:15 → tests.yml 42993593690/42993601066 zielone → main 2d975814 09:43 | ok. 90 min na 3 verify padłe przez SIGTERM (WG: brak ponowienia na main) | zarchiwizowana 09:46 |
| J | 08 build (docs/49) | 15 (pułap) | 3,55 | 23,5 | 20:45 → 20:47 → 20:54 (7b27799a) → verify:docs 21:12 (CI pominięte, same dokumenty) → przyjęte 21:12 | ok. 18 min: przekazanie koordynatora (20:55–21:02) | archiwizacja 21:15 |
| L2 | 08 build | — | 12,46 | 34,5 | 08:30 → 08:30 → ~09:30 → 11:47 (43008771733) → 11:50 | ~45 min kolejka CI za nightly/tests-tz na main | W-02 dokończenie |
| R | 08 build (W-04b ZB-056, ZB-039) | 20 (pułap) | 3,95 | 20,6 | 12:44 → 12:48 → edaf5348 → tests.yml 43027319569 + ios-unsigned 43027324931 zielone (aeab7fa0, 13:32) → przyjęte 13:50 (scalenie czeka na tests.yml d8d16910) | ok. 18 min CI | kod ZB już w integracji; dopisane listy „tylko telefon” |
| Q | 08 build (W-04a ZB-025, ZB-044) | 20 (pułap) | 10,71 | 27,3 | 12:44 → 12:46 → 575ea924 (tests.yml 43036550634, 14:29) → konflikt scalenia docs → 4bcfadad (43040280496, 14:56) → przyjęte 15:15 | ~35 min: konflikt docs z gałęzią R (równoległe W-04 na tych samych dokumentach) | |
| S | 08 build (W-04c ZB-023) | 20 (pułap) | 8,84 | 24,5 | 12:50 → 12:52 → 876ba3fb (tests.yml 43034279912, 14:17) → konflikt docs z R/Q → b1da6004 (43047948233) → przyjęte 15:52 | ~70 min: kolejne scalanie po Q (te same dokumenty docs/49, docs/18-przekazanie, zobowiazania) | WG: równoległe sesje W-04 na wspólnych dokumentach |
| T | 09 build (W-03 przekład, część 1) | 30 (pułap) | 18,25 | 38,4 | 15:20 → 15:25 → bb9e794d … 6b14a29e (tests.yml brak zielonego: przebiegi anulowane kolejnymi pushami) → PRZEKAZANIE 16:54 → T2 | ~60 min: 3× prośba o host sieci productionresultssa* (15:45, 15:56, 16:48; jedna przepadła przy restarcie workera) | API przekładu ≈ 8,75 USD (ZB-057) poza kosztem sesji |
| T2 | 09-lokalizacja build | — | 16,70 | 32,7 | 17:02 → 17:02 → 17:23 → 18:45 → 18:56 (UTC 11.11) | 15 min: czerwony tests.yml 43070158337 (L-130) | prompt roli przez subagenta |
| W | 10-wydanie build | — | 4,74 | 21,1 | 19:05 → 19:06 → ~19:20 → 19:58 → 20:05 (UTC 11.11) | 0 | API 0 USD |
| U | 08 build (KO-047 + W-08) | — | 11,87 (+ API ~1,50) | 32,5 | 19:05 → 19:05 → b4be0f13 → tests.yml 43096889322 (w kolejce 21:05) → — | kolejka tests.yml ≥ 30 min | przekazanie przy 31,7%; verify:szybkie przerwane (znacznik lekkie) |
| V | 07 audit (W-10) | 40 (pułap) | 46,51 | 25,6 | 19:05 → 19:07 → — → tests.yml 43107225879 (w toku 22:05) → 21:55 | — | pułap przekroczony o 16% (poniżej STOP); audyt pełny 1.1 kosztuje ~45 USD — szacunek na następny pełny audyt 50 |
| X | 08 fix (W-11 + W-22) | 25 (pułap) | 14,19 (+ API ~1,45) | 36,2 | 22:05 → 22:08 → a1d4b1ae → tests.yml 43134953310 (w toku 01:33) → — | tests.yml czerwony 2× na pushach pośrednich (~40 min) | 3 pushe zamiast 1; host sa14 zablokował przekład |
