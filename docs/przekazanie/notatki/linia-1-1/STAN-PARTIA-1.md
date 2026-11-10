# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

Stan 10.11.2026 ~01:05 UTC (koniec sesji kontynuacji 3, session_01T66VBxNaAEefAUfCL8vLG1 — limit kontekstu). `figury/partia-1` @ 5186b19d (zawiera integrację 34838fa6, scalenie 3e9b2a93). **Do dociągnięcia: integracja-1-1 @ fbd92527 (partia 3)** — scalić przed raportem końcowym (pliki generowane generatorami; figury-recenzja.json scalać słownikowo, trójstronnie — tekstowo dubluje klucze).

| Rodzina | Status | Recenzja | Następny krok |
|---|---|---|---|
| calf_raise | ready | różnica po śladzie dźwigni wyswietlana (41ff550cd2bf) | — |
| row | ready | r3 wyswietlana; różnica zbędna (skrót bez zmian) | — |
| curl | ready | wyswietlana | — |
| chest_fly | ready | r2 wyswietlana (8415d1a06aa5); zestaw Crucifix „do poprawy” ukryty | — |
| overhead_press | **ready (5186b19d, niezweryfikowane testami)** | r3 **wyswietlana** (065ae12bd57d; Ś1-r3 siedzące 10,5–12,6 cm ŚREDNIE, N1–N3 NISKIE) | **napraw 10 czerwonych testów** (niżej); backlog: Ś1-r3 + pytanie do badacza o `lokcie_pod_dlonmi` w środku toru (rec. r3 pkt d), N3-r3 tryb dzwonu gear.ts, N2-r3 test l.112 (indeks zamiast u), opis wyjątków siedzących w tor-wyjatki.json („recenzent r2 uznał…” → stan po r3) |
| kb_ballistic | planned | r3 **do poprawy** (W1-r3 szarpnięcie, W2-r3 start Snatch (hantel)) | poprawki: `figury/partia-1-kb-r3` (3fa2515d: W1-r3, W2-r3, N2-r3, N3-r3 zrobione); subagent tej sesji dokańcza R6 (zapadka ≤ 4), Ś2, N4 — jeśli przerwany: STAN-AGENTA.md w jego worktree / git log gałęzi. Ś1-r3 (przeskok dzwonu, gear.ts:493 resolveBells) → backlog silnika. Potem scal do partia-1 i **r4 audytora** (warunek koordynatora: ciągłość rwań jawnie; szarpnięcie = WYSOKIE) |

Czerwone po włączeniu ohp (lokalny przebieg 15 plików, 10/1351): figures-v2-mapping (lista ready + liczba figur +21), strona-eksport (n +21 → 292?), recenzja-wyjatki-1-1 (lista v2 + overhead_press), karty-recenzja („każdy zestaw ogólny przy figurze v2 ma wpis w zestawy” — brakujące wpisy zestawów ohp), figures-v2-data (frameAt pull_up/ogólne + macierz błędów — zobacz które ćwiczenie ohp; błąd tempa mis.jerk w landmine → JERK_TEMPO_RODZINY?), figures-v2-kierunek-u (DATA_UI ohp kierunek u; lot/rzut → petla jednokierunkowa), figures-v2-petla-jednokierunkowa (licznik 63). Wynik: /tmp nie przetrwa — uruchom ponownie te pliki `--runInBand`. Przy brakach wpisów zestawów — NIE wymyślaj sha; jeśli recenzja r3 nie objęła zestawu, zestaw zostaje ukryty (bramka) albo krótka recenzja audytora.
Koordynator (decyzje 10.11): ohp — gdy badacz potwierdzi, że reguła łokcia dotyczy tylko dołu/góry → poprawka reguły + r4 siedzących (1.1.x); kb rwania „dynamiczne” zatwierdzone (do weta) pod warunkiem braku szarpnięcia.

Zmiany testów (10.11.2026): `tests/helpers/rodziny-planned.ts` (PLANNED_Z_DANYMI — jedno miejsce dla mapping i data); figures-v2-data testuje tylko gotowe rodziny; row w JERK_TEMPO_RODZINY. Złote odciski ohp (`figures-v2-zgodnosc-wsteczna`, ZLOTE_ZAPISZ=1) przeliczyć po scaleniu poprawek ohp r2 (zmiana celowa r1+r2).
Koordynator (info): partia 2 commit 0f069d93 — CUE_NOT_IN_FAMILY['row.fullStretch'] = ['cable_row'] w cueSets.ts + usunięcie id z cue-sets.json (Single Arm Cable Row, Leverage High Row); przy konflikcie suma wpisów.

Czerwone testy znane na tej gałęzi (stan 86d5ce29, przed pełnym przebiegiem): kb (p4a regresja póz, mobilnosc R6), ohp (kierunek-u, petla — strażniki iterują pliki póz także rodzin planned). Wspólne listy po powrocie do planned poprawione (mapping, recenzja-wyjatki, strona-eksport 236, ACG-002, p2 baza, cel animowanyBlad 266). Uruchom: `npx jest tests/figures-v2 tests/figury tests/strona-eksport tests/recenzja-wyjatki-1-1 tests/cel-1-1 tests/skrot-v2 tests/l047 tests/karty-recenzja --runInBand` i domknij.
Kolejność dla następnej sesji: (1) pełny przebieg testów figur i poprawki list; (2) recenzje: chest r2, ohp r2, różnica calf i row po śladzie dźwigni — audytor przez `briefy/partia-1-recenzent.md`; (3) kb: scal gałąź kb-r2, r3; (4) wpisy 1:1, włączenie rodzin z czystą recenzją, `zrodla-runtime --write`, pokrycie, cel = symulacja; (5) zestaw przekładu (nowych kluczy UI: brak) — szacunek 0 USD; (6) `verify:szybkie`, push, zielony tests.yml, raport do koordynatora.

Zadanie poza partią (koordynator): `delt_raise.json` ≠ generator w „Straight Raises on Incline Bench” (stara poza leżąca; po regeneracji potrzebne `stopyNaPalcach`). Backlog z recenzji: docs/21 P1-ROW-1, P1-CURL-1, P1-KB-1, P1-CHEST-1, P1-OHP-1.
Zgłoszenia silnika (nie ruszane): punkty dźwigni „barki”/„uda” (P1-CALF-1), kostka w MeasuredJoint (P1-CALF-3), nakładka „limb” wymaga pokazanego stawu, widoki ćwiczenia = widoki rodziny, gryf landmine zawsze poprzeczny, kąt kostki bez znaku, limit zgięcia łokcia 149° (ohp).
Uwaga koordynatora (09.11.2026 ~21:04 UTC): partia 2 zmienia `lib/figures/v2/cueSets.ts` (row.fullStretch) — przy scaleniu suma obu stron.
Pomiary czasu (agent): recenzja rodziny 12–25 min (kb 40 min), scalenie 4 gałęzi rodzin + integracji ok. 45 min.

## kb_ballistic (autor: programista; recenzja r1: audytor, `docs/research/recenzje/partia1-kb_ballistic-r1-audytor-2026-11-09.md`)
- Zrobione: 8d23a707, 62cfede4, 208a8740 (podłączenie, nakładka plecy + biodro swingu, 16 wyjątków toru, pętla jednokierunkowa dla 9 ćwiczeń); poprawki r1 w commicie „kb_ballistic: poprawki r1” (SHA w `git log`).
- Poprawki r1: W1 — start zarzutu i rwania jak dół swingu (generator: `hike`, `polowa`, `ciag`; chwyt x ≤ 0 względem kostek; Dumbbell Clean ≤ 25 cm; wysunięcie chwytu przed bark w ciągu ≤ 33 cm = BODY.farm + BODY.hand; test p1 z negatywem), 7 wyjątków toru zmierzonych od nowa (nadal przekraczają próg 4 cm: łuk). Ś1 — oly.close/legs/mis usunięte z zestawów 13 ćwiczeń kb_ballistic w cue-sets.json (neutralnego zestawu brak; `CUE_NOT_IN_FAMILY` + strażnik ACG-001); sumo.kneesOut wypada przez CUE_REQUIRES, Sumo High Pull zostaje z hinge.back. N1 — Double i One-Arm Jerk kończą wstaniem (kolana 0°). N2 — Sumo High Pull: ruch bez zatrzymania, tor 2,8 cm, 3 zawr. (wyjątek zostaje). N3 — Push Press w teście pp_ugiecie, testy startu i ciągu.
- N2-r2 (10.11.2026): `sumo.kneesOut` NIE wypada w czasie działania (cueSelection zwraca JSON; CUE_REQUIRES sprawdza tylko strażnik squat/bench/hinge) — zestaw Sumo przyjęty przez recenzenta r2.
- Zostało: N4 (Kettlebell Pirate Ships: wpis w figury-wyjatki.json albo potwierdzenie koordynatora); wpisy recenzji (figury-recenzja, karty, zestawy, v1 Kettlebell Swing → zastapiona); 6 ćwiczeń ma teraz `err` pusty w zestawie ogólnym (oly.mis usunięte); recenzja r2 ruchu (arkusze (arkusze tymczasowe — wygenerować ponownie arkusz-slad.mjs) są tymczasowe — wygenerować ponownie: `arkusz-slad.mjs`); `pelna` w strona-eksport czerwone do wpisów kart (jak calf_raise).
- Pułapki: limit ciągłości dynamiczny — rwanie kettlebella jest na granicy 6 cm/1/48 (zmiana `pod` w pozie przechwytu, `pitch` polowa i `th` startu psuje ciągłość; działa pod -30, pitch 22); generator `run.mjs --zastosuj` nakłada tylko pozy, które przeszły walidację (reszta zostaje starą wersją — sprawdzaj „16/16”); `cue-sets.json` ma wcięcie 2 (JSON.stringify), nie przepisywać innym formatem. Snatch: koniec w ugięciu (kolano 28°) bez wstania — pytanie recenzenta do badacza, nie ruszone.
