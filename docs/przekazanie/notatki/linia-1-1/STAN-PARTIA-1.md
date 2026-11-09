# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

Stan 09.11.2026 ~22:45 UTC (sesja kontynuacji). **Wszystkie gałęzie rodzin scalone do `figury/partia-1`** (+ integracja bb1072f3); dalsza praca na `figury/partia-1`, gałęzie `figury/partia-1-{calf,row,chest,ohp}` są historyczne.

| Rodzina | Status | Recenzja | Wpisy w figury-recenzja.json | Następny krok |
|---|---|---|---|---|
| calf_raise | ready | r2 **wyswietlana** (10 z 13; Standing/Seated w V2_WSTRZYMANE) | przeniesione | po scaleniu integracji 55c9f206 (ślad dźwigni): recenzja różnicy, nowe sha z `--skroty` |
| row | ready | r3 **wyswietlana** (`partia1-row-r3*`, sha 94a4a8448fe9); W1-r2 stopy → `stopyNaPalcach` (gora.mjs) | v2, 5 zestawów, 5 kart, K10: 6 × v1 zastapiona | po 55c9f206: recenzja różnicy Lying T-Bar Row (dźwignia) |
| curl | ready (integracja) | różnica Spider Curl **wyswietlana** (`curl-roznica-spider*`, sha 3380994ca6df) | v2 curl | — |
| kb_ballistic | **planned** | r2 do poprawy (W1-r2 ciąg zarzutu/rwania, 7 ćw.; Snatch (hantel) z podłogi) | 6 zestawów, karta KB Swing | poprawki: programista na `figury/partia-1-kb-r2` (worktree), potem r3 |
| chest_fly | **planned** | r1 do poprawy (W1 Band — guma przez tułów, W2 Crucifix nie w ISOMETRIC, W3 Wide-Grip pullover) | 13 zestawów | poprawki: `figury/partia-1-chest-r1`, potem r2 (+ Pec Deck po śladzie dźwigni) |
| overhead_press | **planned** | r1 do poprawy (W1 dół ruchu 22 cm przed barkami, 13 ćw.) | 6 zestawów | poprawki: `figury/partia-1-ohp-r1`; ryzyko: limit łokcia silnika 149° / reguła lokcie_pod_dlonmi — opcje do koordynatora; potem r2 |

Zadanie poza partią (koordynator): `delt_raise.json` ≠ generator w „Straight Raises on Incline Bench” (stara poza leżąca; po regeneracji potrzebne `stopyNaPalcach`). Backlog z recenzji: docs/21 P1-ROW-1, P1-CURL-1, P1-KB-1, P1-CHEST-1, P1-OHP-1.
Zgłoszenia silnika (nie ruszane): punkty dźwigni „barki”/„uda” (P1-CALF-1), kostka w MeasuredJoint (P1-CALF-3), nakładka „limb” wymaga pokazanego stawu, widoki ćwiczenia = widoki rodziny, gryf landmine zawsze poprzeczny, kąt kostki bez znaku, limit zgięcia łokcia 149° (ohp).
Uwaga koordynatora (09.11.2026 ~21:04 UTC): partia 2 zmienia `lib/figures/v2/cueSets.ts` (row.fullStretch) — przy scaleniu suma obu stron.
Pomiary czasu (agent): recenzja rodziny 12–25 min (kb 40 min), scalenie 4 gałęzi rodzin + integracji ok. 45 min.

## kb_ballistic (autor: programista; recenzja r1: audytor, `docs/research/recenzje/partia1-kb_ballistic-r1-audytor-2026-11-09.md`)
- Zrobione: 8d23a707, 62cfede4, 208a8740 (podłączenie, nakładka plecy + biodro swingu, 16 wyjątków toru, pętla jednokierunkowa dla 9 ćwiczeń); poprawki r1 w commicie „kb_ballistic: poprawki r1” (SHA w `git log`).
- Poprawki r1: W1 — start zarzutu i rwania jak dół swingu (generator: `hike`, `polowa`, `ciag`; chwyt x ≤ 0 względem kostek; Dumbbell Clean ≤ 25 cm; wysunięcie chwytu przed bark w ciągu ≤ 33 cm = BODY.farm + BODY.hand; test p1 z negatywem), 7 wyjątków toru zmierzonych od nowa (nadal przekraczają próg 4 cm: łuk). Ś1 — oly.close/legs/mis usunięte z zestawów 13 ćwiczeń kb_ballistic w cue-sets.json (neutralnego zestawu brak; `CUE_NOT_IN_FAMILY` + strażnik ACG-001); sumo.kneesOut wypada przez CUE_REQUIRES, Sumo High Pull zostaje z hinge.back. N1 — Double i One-Arm Jerk kończą wstaniem (kolana 0°). N2 — Sumo High Pull: ruch bez zatrzymania, tor 2,8 cm, 3 zawr. (wyjątek zostaje). N3 — Push Press w teście pp_ugiecie, testy startu i ciągu.
- Zostało: N4 (Kettlebell Pirate Ships: wpis w figury-wyjatki.json albo potwierdzenie koordynatora); wpisy recenzji (figury-recenzja, karty, zestawy, v1 Kettlebell Swing → zastapiona); 6 ćwiczeń ma teraz `err` pusty w zestawie ogólnym (oly.mis usunięte); recenzja r2 ruchu (arkusze (arkusze tymczasowe — wygenerować ponownie arkusz-slad.mjs) są tymczasowe — wygenerować ponownie: `arkusz-slad.mjs`); `pelna` w strona-eksport czerwone do wpisów kart (jak calf_raise).
- Pułapki: limit ciągłości dynamiczny — rwanie kettlebella jest na granicy 6 cm/1/48 (zmiana `pod` w pozie przechwytu, `pitch` polowa i `th` startu psuje ciągłość; działa pod -30, pitch 22); generator `run.mjs --zastosuj` nakłada tylko pozy, które przeszły walidację (reszta zostaje starą wersją — sprawdzaj „16/16”); `cue-sets.json` ma wcięcie 2 (JSON.stringify), nie przepisywać innym formatem. Snatch: koniec w ugięciu (kolano 28°) bez wstania — pytanie recenzenta do badacza, nie ruszone.
