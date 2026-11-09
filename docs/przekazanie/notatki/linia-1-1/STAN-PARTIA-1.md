# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

Stan 09.11.2026 ~23:20 UTC (przekazanie sesji — limit kontekstu). `figury/partia-1` zawiera: integrację 55c9f206 (ślad dźwigni), wszystkie gałęzie rodzin, poprawki chest_fly r1 (c537f8a4) i overhead_press r1 (b8890ffa).

| Rodzina | Status | Recenzja | Następny krok |
|---|---|---|---|
| calf_raise | ready | r2 wyswietlana | **recenzja różnicy po śladzie dźwigni 55c9f206** (Donkey/maszyny), nowe sha z `--skroty` |
| row | ready | r3 wyswietlana (K10 zrobione) | **recenzja różnicy Lying T-Bar Row po 55c9f206** |
| curl | ready | różnica Spider Curl wyswietlana | — |
| chest_fly | planned | r1 do poprawy → poprawki W1–W3 + S3 zrobione (c537f8a4: guma 2 zaczepy z ±75, Crucifix w ISOMETRIC, Wide-Grip ±35 cm, Cable Fly bloczek 140/pochylenie 12°) | **r2 audytora** (+ Pec Deck po śladzie dźwigni); przy czystej r2: `ready`, listy w testach, wpisy 1:1 |
| overhead_press | planned | r1 do poprawy → poprawki W1, Ś1, Ś2 (b8890ffa: dół 13,3/9 cm przed/nad barkiem, sztanga–tułów 5 cm, łokieć–chwyt ≤ 8 cm, KB start 12/14; zza karku xTop −9; ohp.seat usunięte z Seated Cable) | **r2 audytora** (ślad zmienił kształt; landmine po 55c9f206). Przy włączeniu: tor side 12,5 cm (wyjątek z powodem w tests/tor-wyjatki.json albo próg łuku rodziny — rekomendacja autora a), listy `figures-v2-kierunek-u`/`-petla-jednokierunkowa`, K15 Landmine Press (animowany błąd), Bradford Press i Handstand Push Up bez wpisu w figury-wyjatki.json |
| kb_ballistic | planned | r2 do poprawy (W1-r2) | poprawki W1-r2 robi subagent na `figury/partia-1-kb-r2` (polecenie: wypchnąć gałąź po verify:lekkie) — `git fetch origin figury/partia-1-kb-r2`, scal, potem **r3**. Też: zapadka `figury-mobilnosc-reguly` (R6_palce_nie_slizgaja_sie|kb_ballistic) i `figury-recenzja-p4a` „regresja: pozy bez zmian” — do zaktualizowania świadomie po poprawce |

Czerwone testy znane na tej gałęzi (stan 86d5ce29, przed pełnym przebiegiem): kb (p4a regresja póz, mobilnosc R6), ohp (kierunek-u, petla — strażniki iterują pliki póz także rodzin planned). Wspólne listy po powrocie do planned poprawione (mapping, recenzja-wyjatki, strona-eksport 236, ACG-002, p2 baza, cel animowanyBlad 266). Uruchom: `npx jest tests/figures-v2 tests/figury tests/strona-eksport tests/recenzja-wyjatki-1-1 tests/cel-1-1 tests/skrot-v2 tests/l047 tests/karty-recenzja --runInBand` i domknij.
Kolejność dla następnej sesji: (1) pełny przebieg testów figur i poprawki list; (2) recenzje: chest r2, ohp r2, różnica calf i row po śladzie dźwigni — audytor przez `briefy/partia-1-recenzent.md`; (3) kb: scal gałąź kb-r2, r3; (4) wpisy 1:1, włączenie rodzin z czystą recenzją, `zrodla-runtime --write`, pokrycie, cel = symulacja; (5) zestaw przekładu (nowych kluczy UI: brak) — szacunek 0 USD; (6) `verify:szybkie`, push, zielony tests.yml, raport do koordynatora.

Zadanie poza partią (koordynator): `delt_raise.json` ≠ generator w „Straight Raises on Incline Bench” (stara poza leżąca; po regeneracji potrzebne `stopyNaPalcach`). Backlog z recenzji: docs/21 P1-ROW-1, P1-CURL-1, P1-KB-1, P1-CHEST-1, P1-OHP-1.
Zgłoszenia silnika (nie ruszane): punkty dźwigni „barki”/„uda” (P1-CALF-1), kostka w MeasuredJoint (P1-CALF-3), nakładka „limb” wymaga pokazanego stawu, widoki ćwiczenia = widoki rodziny, gryf landmine zawsze poprzeczny, kąt kostki bez znaku, limit zgięcia łokcia 149° (ohp).
Uwaga koordynatora (09.11.2026 ~21:04 UTC): partia 2 zmienia `lib/figures/v2/cueSets.ts` (row.fullStretch) — przy scaleniu suma obu stron.
Pomiary czasu (agent): recenzja rodziny 12–25 min (kb 40 min), scalenie 4 gałęzi rodzin + integracji ok. 45 min.

## kb_ballistic (autor: programista; recenzja r1: audytor, `docs/research/recenzje/partia1-kb_ballistic-r1-audytor-2026-11-09.md`)
- Zrobione: 8d23a707, 62cfede4, 208a8740 (podłączenie, nakładka plecy + biodro swingu, 16 wyjątków toru, pętla jednokierunkowa dla 9 ćwiczeń); poprawki r1 w commicie „kb_ballistic: poprawki r1” (SHA w `git log`).
- Poprawki r1: W1 — start zarzutu i rwania jak dół swingu (generator: `hike`, `polowa`, `ciag`; chwyt x ≤ 0 względem kostek; Dumbbell Clean ≤ 25 cm; wysunięcie chwytu przed bark w ciągu ≤ 33 cm = BODY.farm + BODY.hand; test p1 z negatywem), 7 wyjątków toru zmierzonych od nowa (nadal przekraczają próg 4 cm: łuk). Ś1 — oly.close/legs/mis usunięte z zestawów 13 ćwiczeń kb_ballistic w cue-sets.json (neutralnego zestawu brak; `CUE_NOT_IN_FAMILY` + strażnik ACG-001); sumo.kneesOut wypada przez CUE_REQUIRES, Sumo High Pull zostaje z hinge.back. N1 — Double i One-Arm Jerk kończą wstaniem (kolana 0°). N2 — Sumo High Pull: ruch bez zatrzymania, tor 2,8 cm, 3 zawr. (wyjątek zostaje). N3 — Push Press w teście pp_ugiecie, testy startu i ciągu.
- Zostało: N4 (Kettlebell Pirate Ships: wpis w figury-wyjatki.json albo potwierdzenie koordynatora); wpisy recenzji (figury-recenzja, karty, zestawy, v1 Kettlebell Swing → zastapiona); 6 ćwiczeń ma teraz `err` pusty w zestawie ogólnym (oly.mis usunięte); recenzja r2 ruchu (arkusze (arkusze tymczasowe — wygenerować ponownie arkusz-slad.mjs) są tymczasowe — wygenerować ponownie: `arkusz-slad.mjs`); `pelna` w strona-eksport czerwone do wpisów kart (jak calf_raise).
- Pułapki: limit ciągłości dynamiczny — rwanie kettlebella jest na granicy 6 cm/1/48 (zmiana `pod` w pozie przechwytu, `pitch` polowa i `th` startu psuje ciągłość; działa pod -30, pitch 22); generator `run.mjs --zastosuj` nakłada tylko pozy, które przeszły walidację (reszta zostaje starą wersją — sprawdzaj „16/16”); `cue-sets.json` ma wcięcie 2 (JSON.stringify), nie przepisywać innym formatem. Snatch: koniec w ugięciu (kolano 28°) bez wstania — pytanie recenzenta do badacza, nie ruszone.
