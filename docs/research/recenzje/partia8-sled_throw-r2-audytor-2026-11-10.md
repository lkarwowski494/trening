# Partia 8 — sled_throw (i potwierdzenie strongman), recenzja niezależna r2 różnicy (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusz ze śladem toru). Stan: figury/partia-8-sled_strongman @ 58232ce7, różnica względem r1 (75777836), odłączony worktree recenzenta. Recenzent nie pisał rodzin, kart, zestawów ani poprawek r1.

**Werdykt sled_throw: wyświetlana** (W1 naprawione, 0 × KRYTYCZNE/WYSOKIE). **Strongman: wpisy r1 obowiązują** (skróty bez zmian; Ś1 i N1 rozstrzygnięte poprawnie).

## Zakres różnicy
6 commitów, 15 plików. W `poses/sled_throw.json` zmieniło się tylko ćwiczenie Backward Medicine Ball Throw (porównanie wpisów JSON); generator `agent-pozy/sled_throw.mjs` — tylko ostatnia klatka typu `tyl` (pochylenie −6 → −16, ramię psi 78 → 90). Pozostałe 7 ćwiczeń i Yoke Walk bez zmian.

## W1 — Backward Medicine Ball Throw (naprawione)
- Arkusz `arkusz-slad.mjs` (side, 21 kadrów) wygenerowany samodzielnie, PNG 2100 px obejrzany: przysiad z piłką przed goleniami → wyprost → piłka nad głową i za głową; ślad kończy się za linią barków, kierunek rzutu do tyłu czytelny.
- Miary z `keyframeFrame` w u = 1: x chwytu −22,3 cm, x barku −14,3 cm, x głowy −17,1 cm → dłonie **8,0 cm za linią barków** (r1: 5,3 cm przed), ramię 7,2° za pionem; tułów **16,0° w tył** (r1: 6°); wyprost biodra 15,4°, kolano 1,1°, łokieć 0°.
- Zakres barku: zgięcie 171° (u = 1), uniesienie 169°, odwiedzenie 7° — w zakresie kontraktu (`v2-validate.mjs` dla ćwiczenia: OK, w tym reguły sensu rzut_wyprost/rzut_ugiecie i limit dynamiczny ciągłości). `checkFrame`: 0 kolizji (u co 0,01). Ślad 0,0 cm od środka chwytów.
- Przebieg: u = 0 kolano 99,7°, biodro 101°, tułów 40° w przód, łokcie proste (bmbt.setup); wyprost i odchylenie narastają płynnie, zero w tułowiu ok. u = 0,9.
- Wpis `tests/tor-wyjatki.json` „Backward Medicine Ball Throw|side”: miara figures-v2-tor (25 próbek) policzona samodzielnie: **66,8 cm / 1 zawrócenie** — zgodna z wpisem. Nowe testy odtwarzające W1 (`tests/figures-v2-sled-throw-tor.test.ts`: x chwytu < x barku, odchylenie ≤ −12°) — dane r1 by je oblały (+5,3 cm, −6°).

## Rozstrzygnięcia r1 — ocena
- N2 (sled): odwołanie poprawione na `tests/figures-v2-sled-throw.test.tsx` — poprawne.
- N3 (sled): komentarz `poseData.ts` opisuje teraz `dataUiForPose` zgodnie z kodem (poseData.ts:70). Strażnik „cykl_lustro bez DATA_UI ⇒ chód” nie dodany — dopuszczalne (teoretyczny).
- Ś1 (sled, Wall Ball) → P8-ST-1 w docs/21 (ŚREDNIE, z miarą) — zgodne z progiem; nie blokuje.
- N1 (sled, slam_plecy bez mapowania hinge.back) — bez zmian, pytanie do badacza w nagłówku overlay/sled_throw.ts; NISKIE, bez wpływu na werdykt.
- Strongman Ś1: uproszczenie nazwane w `PRZYBLIZENIA` generatora i w `data/zrodla/figury-ograniczenia-silnika.json` (status „przejrzane”, odcisk kontraktu zgodny — tests/figury-backlog-r2 zielony). Uwaga: `gear.ts:105` już ma możliwość `yoke` z etykietą „jarzmo (rysowane jak sztanga na barkach — uproszczenie)”, więc sformułowanie „kontrakt sprzętu nie ma jarzma” jest nieścisłe (kontrakt nie ma *osobnego rysunku* jarzma) — bez wpływu na treść w aplikacji, nie zgłaszam jako znalezisko.
- Strongman N1 → P8-SM-1 w docs/21 (NISKIE, z miarą) — poprawne.
- Wyjątek pustej nakładki strongman (K14): kazda-rodzina — wczesny powrót tylko dla `strongman` z `toEqual([])`; mobility-floor — lista pustych rodzin porównywana dokładnie z `['mobility_floor', 'strongman']`; S20 — wyjątek tylko dla pliku `strongman.ts`, reszta warunków (cue, rule, bez t()) bez zmian. Ochrona pozostałych rodzin niepoluzowana; wpis docs/18 z `[test: …mobility-floor… :: 10.11.2026]`, `check:decyzje` zielone. Uzasadnienie (wszystkie reguły strongman „analogia”) zgodne z r1.

## Testy (pojedyncze, --runInBand)
figures-v2-sled-throw, figures-v2-sled-throw-tor, figures-v2-tor, figures-v2-strongman (232/232); figury-backlog-r2, figures-v2-nakladka-kazda-rodzina, figures-v2-nakladka-mobility-floor, interaction-guards, figures-v2-nakladka-triceps-olympic (137/137). `assignAll()`: sled_throw 19, strongman 10.

## Skróty (`node scripts/zrodla-runtime.mjs --skroty`, policzone samodzielnie na 75777836 i 58232ce7)
Jedyna różnica: v2 sled_throw 693594ff4218 → **e936d3d6c19d**. Bez zmian: v2 strongman 04b91430146d; karty Medicine Ball Slam cbe93cfddf5e, Standing Two-Arm Overhead Throw 85de3b2b60b3, Backward Medicine Ball Throw 871996234a76, Wall Ball 6f2a286d08b6, Sled Push ef9ee9fdcec0; zestawy One-Arm Medicine Ball Slam ad4e223d4754, Medicine Ball Scoop Throw 12ca0a03ffbe, Sled Drag (Harness) 6fc414841b18, Yoke Walk 21ce36d7bae6.
