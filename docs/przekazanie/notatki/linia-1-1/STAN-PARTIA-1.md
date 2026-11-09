# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

Stan 10.11.2026 ~00:10 UTC (sesja kontynuacji 3, session_01T66VBxNaAEefAUfCL8vLG1). Wypchnięte de89b808 (+ commity testów po nim).

| Rodzina | Status | Recenzja | Następny krok |
|---|---|---|---|
| calf_raise | ready | r2 + różnica po śladzie dźwigni **wyswietlana** (sha 41ff550cd2bf, 1e678bbc) | — (N1 test śladu Donkey w backlogu P1-CALF-4) |
| row | ready | r3 wyswietlana | różnica po 55c9f206 **zbędna**: v2.row --skroty = wpis 94a4a8448fe9 (Lying T-Bar Row ma punkt „dlonie”) |
| curl | ready | wyswietlana | — |
| chest_fly | **ready** (f52f0c6e) | r2 **wyswietlana** (sha 8415d1a06aa5) | zestaw Crucifix ukryty bramką 4 (R2-S1, docs/18 10.11.2026); P1-CHEST-2 |
| overhead_press | planned | r2 **do poprawy** (W1-r2 wybrzuszenie toru w górę 22,7 cm przed barkiem; W2-r2 KB start łokieć 23 cm przed barkiem) | poprawki robi subagent na `figury/partia-1-ohp-r2` → scal → r3. Łuk 12,5 cm: recenzent = błąd ruchu, wyjątku NIE wpisywać (koordynator zatwierdził (a) pod warunkiem akceptacji recenzenta — warunek niespełniony); przyjmie 4–6 cm po poprawce, Arnold 9,6 cm = cecha |
| kb_ballistic | planned | r2 do poprawy (W1-r2) | poprawki robi subagent na `figury/partia-1-kb-r2` → scal → r3 |

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
