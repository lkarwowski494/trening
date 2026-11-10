# Recenzja niezależna rodziny hip_bridge — partia 2, runda r1 (audytor, 09.11.2026)

Stan: `figury/partia-2` @ ddb6cbae (rysunek, nakładka) i 4572d987 (zmiana tylko `tests/figures-v2-data.test.tsx`). Worktree odłączony, arkusze własne.
Autor ≠ recenzent (L-047). Skróty z `node scripts/zrodla-runtime.mjs --skroty` na obu SHA — identyczne (`cmp`): v2 hip_bridge `76ab2ca8939b`.

**Werdykt rodziny: do poprawy** (1 WYSOKIE w jednym ćwiczeniu; pozostałe 9 bez blokerów).

## Znaleziska

| # | Klasa | Pewność | Ćwiczenie | Opis i miara | Kroki | Realność |
|---|---|---|---|---|---|---|
| 1 | WYSOKIE | 90% | Machine Hip Thrust | Prosta prowadnica dźwigni (`dzwignia`, `tryb: prosta`, start x −8,1 / y 25,3 / **z 0**, długość 34,4; `poses/hip_bridge.json`) leży w płaszczyźnie środkowej ciała: odległość odcinka od środka miednicy 0,0 cm w każdym kadrze. Od u ≈ 0,45 dolny odcinek (y 25,3 → ok. 43, ok. 18 cm w u = 1) wystaje spod tułowia, czyli przechodzi przez ciało; odstęp ciężaru −4,7 cm (u = 0) … −0,7 cm (u = 1). Test: dla każdego u co 0,05 prowadnica nie przecina kapsuły miednicy/tułowia (odległość > promień) albo ma z ≠ 0 poza ciałem. Osobno: ślad dźwigni — znane, poprawka `figury/slad-dzwignia`; ślad do ponownego arkusza po scaleniu. | Karta ćwiczenia → animacja | realny |
| 2 | ŚREDNIE | 85% | Frog Pump | Rysunek z boku nie do odróżnienia od Glute Bridge: kolana odwiedzione tylko o ok. 19° (kolano z ±22 cm przy biodrze ±8,5), stopy płasko, palce na zewnątrz 35° — ćwiczenie to „podeszwy razem, kolana szeroko” (wyniki-C-czesc3.json: frogp.setup, 2 źródła szczebla 5). Teksty w aplikacji (zestaw ogólny) tego nie twierdzą, więc nie ma sprzeczności z kartą. Miara: kąt odwiedzenia uda ≥ ok. 45° albo widok z przodu. | Karta → animacja | realny |
| 3 | NISKIE | 85% | Single Leg Glute Bridge | Karta (gb.slSetup): „drugą nogę wyprostuj albo przyciągnij do klatki”; noga wolna stale zgięta w kolanie 30,8° (biodro 55,6° → 17,5°) — ani prosta, ani przy klatce. Miara: zgięcie kolana wolnej nogi ≤ ok. 10°. | Karta → animacja | realny |
| 4 | NISKIE | 90% | test (K14) | `BLAD_NIEWIDOCZNY` dla `ht.mis.arch` (1 ćw. w ddb6cbae, 7 w 4572d987): błąd **jest czytelny** — kręgosłup −35° vs 0°, `spineMid` przesuwa się o 7,0 cm w rzucie z boku we wszystkich 10, garb lędźwi widoczny na kadrach 4×. Wyjątek jest więc poluzowaniem nie tam, gdzie trzeba: punkty testu nie obejmują kręgosłupa. Lepiej dodać `spineMid` do `pts` (i mierzyć w 2D rzutu) i usunąć 7 wpisów. Uwaga do (b): w mostkach z podłogi test „przechodzi” przez łokieć 3,36 cm, ale to głównie oś z (w rzucie z boku 1,9 cm) — też argument za `spineMid` w 2D. | — | brzegowy (maskuje przyszłą regresję; reguła sensu `plecy_bez_przeprostu` częściowo chroni) |
| 5 | NISKIE | 85% | Hip Thrust (sztanga), Smith | Odstęp gryfu od miednicy −1,6 cm w u = 0 (miara `odstep-ciezaru.mjs`); kapsuły checkFrame czyste (udo×gryf 0,4 cm). Niewidoczne przy podkładce. | — | brzegowy |

## Sprawdzone bez znalezisk
- **Ruch K4–K8**: 10 arkuszy side (jedyny widok), kadry co 0,05; zakresy z `frameAt`: mostki biodro 46,9° → −10°, hip thrust 61,2° → −7,4° (goleń pionowa, kolano 82°), piłka 38,6° → −14,9°; miednica na górze ≤ 5,4 cm od linii barki–kolano (próg reguły 8 cm); pięty 0 cm; checkFrame bez komunikatów (poprawna i błąd, 21 kadrów). Styki: ławka ≥ 0,9 cm, piłka −0,1 cm (kontakt zadeklarowany), podłoga ≥ −0,5 cm.
- **Sprzęt K6**: gryf z talerzami na biodrach (talerz na podłodze w u = 0), Smith na prowadnicy, hantel pionowo w obu dłoniach (karta nie określa ułożenia).
- **(c) Stability Ball Hip Bridge**: barki na piłce, stopy na podłodze — zgodne z odmianą katalogu (`catalog.json`, fedb Physioball Hip Bridge: „upper back is on the ball”) i 3 źródłami szczebla 5 (`wyniki-p5a.json`). Komentarz w `overlay/hip_bridge.ts:7` („nie wiadomo”) jest nieaktualny, ale wyłączenie linii jest i tak słuszne (reguła dla piłki to analogia).
- **Nakładka**: jeden element `bridgeTopLine` tylko dla Glute Bridge i Glute Bridge (sztanga); reguła `linia_na_gorze` „ustalone (most)”, wskazówka gb.move na obu kartach, tylko rzut side; arkusz z nakładką: linia przechodzi przez miednicę na górze.
- **Zestawy K12**: Frog Pump, Smith, Machine, Stability Ball — każde zdanie pasuje do ruchu postaci (wpisy w JSON).
- **Karty K10–K11**: Glute Bridge, Hip Thrust (sztanga), Hip Thrust (hantel) — nowe wpisy kart; v1 tych trzech → „zastapiona”. Istniejące wpisy kart Glute Bridge (sztanga), Single Leg Glute Bridge, Single Leg Hip Thrust mają skróty równe moim.
- **K9**: `assignAll()` = 11 (London Bridges bez rysunku). **K15**: nazwy faz „Unoszenie/Opuszczanie” już w słowniku (delt_raise).
- **`pelna` w eksporcie strony**: mechanizm potwierdzony — eksport w teście bierze zapis recenzji ze wszystkimi rodzinami ready (`tests/strona-eksport.test.ts:37-53`, `scripts/strona/eksport.mjs:72,134`), a licznik `policz()` bierze `v2.shownFigureSpec` (`scripts/pokrycie-katalogu.mjs:85` → `lib/figures/v2/figure.ts:53-60`, lista `v2` w `lib/figures/data.json`) bez hip_bridge do czasu wpisu recenzji. Rozbieżność zniknie po wpisie v2 i odświeżeniu `data.json`.
