# Pomiar: pozy części górnej (gałąź pozy-gora), 26.10.2026

Czas zegarowy całości: ok. 90 min (start 15:30 UTC, ostatnia rodzina ok. 17:00 UTC), w tym oczekiwanie na kolejkę testów (maszyna wspólna z 3 innymi agentami). Czas pracy nad rodziną liczony od pierwszego generatora do zaliczenia wszystkich bramek.

| rodzina | poz w generatorze | wyjątki | zaliczone za 1. razem | uwagi |
|---|---|---|---|---|
| curl | 34 | 2 (Spider Curl, Spider Curl sztanga) | ok. 18/34 (rekonstrukcja z logu) | 3 iteracje pętli, ok. 20 min (w tym infrastruktura wspólna) |
| triceps | 28 | 4 | 16/25 (log iteracji 1) | ok. 10 min |
| delt_raise | 28 | 10 (5 otwartych + 5 ograniczeń modelu) | 19/29 | ok. 15 min |
| shrug | 7 | 1 (Middle Back Shrug, otwarte) | 0/7 | ruch ≥ 8 cm wymusił przybliżenie |
| rotator_cuff | 6 | 2 | 1/6 | błąd rot.mis.elbowAway bez tekstu w pl.json: nie rysowany |
| forearm | 9 | 3 | 1/11 | błąd wr.mis.lift bez tekstu w pl.json: nie rysowany |
| chest_fly | 17 | 3 | 12/17 | |
| row | 10 | 3 | 1/10 | błąd mis.roundBack rysowany |
| cable_row | 8 | 2 | 4/8 | |
| pulldown | 8 | 0 | 0/8 | brak błędów rysowanych |
| overhead_press | 20 | 3 (2 otwarte + jedna sztanga jednorącz) | 12/21 | błąd push.mis.partial rysowany (pike) |
| chest_press_machine | 5 | 0 | 3/5 | |
| cable_press | 4 | 0 | 1/4 | błąd bp.mis.arch rysowany |

Razem: 184 poz, 33 wyjątki. Zaliczone za 1. razem (dokładnie od delt_raise, wcześniejsze rodziny przybliżone): ok. 88/185 (48%). Typowe przyczyny porażki 1. przebiegu: zakres stawu (łokieć 149°, bark 171°), przenikanie sprzętu (kolumna wyciągu, dźwignia), kolejność reguł sensu (łokieć pod dłonią), ciągłość (skok > 6 cm).
