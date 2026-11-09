# Stan — partia rodzin 1 (linia 1.1)

Gałąź `figury/partia-1` od `origin/integracja-1-1` @ aeabf69. Zlecenie koordynatora 09.11.2026 (sesja koordynatora linii 1.1).
Rodziny: calf_raise, row, kb_ballistic, chest_fly, overhead_press (kolejność: od najmniejszej — pomiar czasu na rodzinę).
Brief autora rodziny: `briefy/partia-1-autor.md`. Recenzja: subagent `audytor` (≠ autor), pliki `docs/research/recenzje/partia1-<rodzina>-*`.

Zysk z `node scripts/pokrycie-symulacja.mjs` (09.11.2026, przed pracą): overhead_press +21, chest_fly +17, kb_ballistic +16, calf_raise +12, row +12 (pełna karta).

| Rodzina | Autor (SHA) | Recenzja ruchu | Nakładka/zestawy | Wpisy | Stan |
|---|---|---|---|---|---|
| calf_raise | — | — | — | — | w toku |
| row | — | — | — | — | otwarte |
| kb_ballistic | — | — | — | — | otwarte |
| chest_fly | — | — | — | — | otwarte |
| overhead_press | — | — | — | — | otwarte |

## kb_ballistic (autor: programista; recenzja r1: audytor, `docs/research/recenzje/partia1-kb_ballistic-r1-audytor-2026-11-09.md`)
- Zrobione: 8d23a707, 62cfede4, 208a8740 (podłączenie, nakładka plecy + biodro swingu, 16 wyjątków toru, pętla jednokierunkowa dla 9 ćwiczeń); poprawki r1 w commicie „kb_ballistic: poprawki r1” (SHA w `git log`).
- Poprawki r1: W1 — start zarzutu i rwania jak dół swingu (generator: `hike`, `polowa`, `ciag`; chwyt x ≤ 0 względem kostek; Dumbbell Clean ≤ 25 cm; wysunięcie chwytu przed bark w ciągu ≤ 33 cm = BODY.farm + BODY.hand; test p1 z negatywem), 7 wyjątków toru zmierzonych od nowa (nadal przekraczają próg 4 cm: łuk). Ś1 — oly.close/legs/mis usunięte z zestawów 13 ćwiczeń kb_ballistic w cue-sets.json (neutralnego zestawu brak; `CUE_NOT_IN_FAMILY` + strażnik ACG-001); sumo.kneesOut wypada przez CUE_REQUIRES, Sumo High Pull zostaje z hinge.back. N1 — Double i One-Arm Jerk kończą wstaniem (kolana 0°). N2 — Sumo High Pull: ruch bez zatrzymania, tor 2,8 cm, 3 zawr. (wyjątek zostaje). N3 — Push Press w teście pp_ugiecie, testy startu i ciągu.
- Zostało: N4 (Kettlebell Pirate Ships: wpis w figury-wyjatki.json albo potwierdzenie koordynatora); wpisy recenzji (figury-recenzja, karty, zestawy, v1 Kettlebell Swing → zastapiona); 6 ćwiczeń ma teraz `err` pusty w zestawie ogólnym (oly.mis usunięte); recenzja r2 ruchu (arkusze `/tmp/claude-0/sh2` są tymczasowe — wygenerować ponownie: `arkusz-slad.mjs`); `pelna` w strona-eksport czerwone do wpisów kart (jak calf_raise).
- Pułapki: limit ciągłości dynamiczny — rwanie kettlebella jest na granicy 6 cm/1/48 (zmiana `pod` w pozie przechwytu, `pitch` polowa i `th` startu psuje ciągłość; działa pod -30, pitch 22); generator `run.mjs --zastosuj` nakłada tylko pozy, które przeszły walidację (reszta zostaje starą wersją — sprawdzaj „16/16”); `cue-sets.json` ma wcięcie 2 (JSON.stringify), nie przepisywać innym formatem. Snatch: koniec w ugięciu (kolano 28°) bez wstania — pytanie recenzenta do badacza, nie ruszone.
