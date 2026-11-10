# Recenzja niezależna r1 — rodzina v2 `cable_press` (partia 4, linia 1.1), 10.11.2026

Recenzent: audytor (bramka 4, L-047 A, L-050; nie pisał rodziny). Stan: `figury/partia-4-cable_press` @ cbcff71 (baza 47e3715f), podłączony.
Arkusze wygenerowane samodzielnie: `arkusz-slad.mjs` (4 ćwiczenia × z boku i z góry), `arkusz-nakladka.mjs --family cable_press` (10 arkuszy, w tym poza błędu Incline); liczby z `frameAt`. Walidator kontraktu: OK ×4. Testy `figures-v2-cable_press-podpora`, `figures-v2-nakladka-cable_press`, `figures-v2-tor` (`--runInBand`): zielone.

**Werdykt rodziny: do poprawy** (1 × WYSOKIE). Wpisy: `partia4-cable_press-r1.json`.

## Znaleziska

| # | Poziom | Pewność | Ćwiczenie | Co | Miara (test odtwarzający) | Realność |
|---|---|---|---|---|---|---|
| W1 | WYSOKIE | 85% | Wyciskanie na linkach (stojąc) | Bloczki na wysokości głowy, a karta (`cpress.setup`): „Ustaw bloczki mniej więcej na wysokości klatki lub barków”; źródła karty: producent sprzętu 65944cf0 (Setup: klatka), ACE #338 (bark). Linki biegną z góry w dół do dłoni | `wyciag.y` 160 cm; bark 139,5; środek głowy 161,5 → bloczek 20,5 cm nad barkiem. Test: `wyciag.y − shoulder.y ∈ [−25, +5]` | realny |
| Ś1 | ŚREDNIE | 85% | Incline Cable Chest Press (zestaw `bench`) | `bp.control` „Opuszczaj ciężar powoli — bez odbijania od klatki.” — zdanie z wyciskania sztangą; uchwyty linek nie dotykają klatki (u = 0 chwyt 16,7 cm przed barkiem) | zestaw bez wpisu i tak się nie wyświetla → poprawka zestawu (usunąć `bp.control`) | brak wpływu do poprawki |

NISKIE (backlog, bez blokady): (1) `otwarte_czesciowo` Single Arm w `figury-sens.json` nieaktualne — dane mają `sprzet.trzyma: "R"`, `measuredAngle` mierzy rękę R (145,6° → 17,8°), nakładka i reguła zakres działają; wpis do zamknięcia. (2) `press.mis.lock` (karta Seated) bez wpisu w `bledy_bez_animacji` (jak `ohp.mis.lock` w chest_press_machine). (3) Incline: środek głowy 2,3 cm za końcem oparcia (77,3 / 75 cm wzdłuż oparcia) — głowa leży na krawędzi; `bp.contact` nadal zgodne.

## Odpowiedzi na pytania autora
- **Linia miednica–bark jako element `tulow_stabilny`**: akceptowalna. Reguła „ustalone (kierunek)”, wskazówka `cpress.base` („tułów stabilny”) na karcie stojącego i w zestawie Single Arm; linia stoi w miejscu (test: końce ≤ 0,5 cm), tylko z boku — ten sam wzór co `machineBackRef` / `olympicBackRef`. Seated nie dostaje elementu (brak `cpress.base` na karcie) — poprawnie.
- **Single Arm vs `otwarte_czesciowo`**: przyczyna wpisu (brak `trzyma`) usunięta w danych; zestaw ogólny (`cpress.base`, `press.noLock`) pokaże łuk łokcia ręki pracującej i linię tułowia po wpisie „zestawy”. Zostawić element, zamknąć wpis (NISKIE 1).
- **Zestaw Incline (`bench`)**: `bp.contact` (głowa, barki, pośladki na oparciu, stopy na podłodze) — zgodne; `bp.blades` — zgodne; `bp.mis.arch` — poza błędu widoczna (łuk lędźwi −30°, miednica +4 cm); `bp.control` — nie dotyczy linek (Ś1).

## Sprawdzone bez znalezisk
- **Ruch (K4, K8)**: zakres łokcia 145,6–145,8° → 17,8–19,5° (≤ 25° reguły, ≤ 20° reguł analogicznych); stojąc i siedząc tor prosto przed siebie (+7 cm w pionie na 48 cm), z góry prosto w osi przy z = 28; skośnie tor w górę i w przód pod 43° (prostopadła do tułowia 35°); start uchwyty przy barkach / klatce zgodnie z kartami; Single Arm bloczek 9,5 cm pod barkiem (klatka), wolna ręka wzdłuż tułowia.
- **Styki i sprzęt (K6, K7)**: dłoń–koniec linki 0,0 cm w każdym u; linka od bloczka z tyłu po tej samej stronie; Seated/Incline bark i miednica na oparciu ±1 cm (nowy test z negatywami); odstęp osi linki od ramienia ≥ 12 cm, od tułowia ≥ 30 cm, przy przedramieniu 3–4 cm tylko przy dłoni (linka wychodzi z uchwytu wzdłuż ręki).
- **Nakładka**: `cablePressElbowLimb` (zakres, ustalone) i `cablePressTorsoRef` (tulow_stabilny) tylko z boku; `lawka_kontakt` („analogia”) słusznie bez elementu.
- **K10**: żadne z 4 ćwiczeń nie ma wpisu v1 w `figury-recenzja.json` ani figury v1 w `lib/figures/data.json` → `v1_zastapiona: []`.
- **K14 (zmiany testów)**: wyłączenie `cable_press` z ogólnego testu „frameAt z danych” zastąpione własnym (staw, fazy, ≥ 70° / ≤ 25°) — bez osłabienia (ogólny zakłada rosnący kąt); `BLAD_NIEWIDOCZNY` Seated|mis.jerk — błąd tempa, jak curl/delt_raise; `W_ZAKRESIE` generatora + cable_press — zaostrzenie; nowy test podpory z 3 negatywami; liczniki (218, 4 z 4, 32 rodziny) z podłączenia.
- **K9, K11–K13, K15**: `liczba` = 4; skróty z `--skroty` w kopii recenzji: v2 `f5178aa7b0c0`, karty stojąc `08c8964e60ab`, Seated `8a64c572d245`, zestawy Single Arm `571f01a5d4df`, Incline `acd851225cdc`; fazy Wypychanie/Powrót w `lib/i18n.en.ts`; błąd animowany tylko `bp.mis.arch` (tekst w zestawie Incline).
