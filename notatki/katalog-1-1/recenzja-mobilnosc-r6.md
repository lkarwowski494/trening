# Recenzja ruchu (bramka 4): mobility_floor i mobility_stand, runda 6

Worktree /home/user/wt/rodziny-mobilnosc @ ff7332e7793d183638cdabec0c411188e07e4c3e (potwierdzone `git log -1`). Nic nie zapisałem w repo (`git status` czysty po pracy).

## Ważność podglądu
- Własny podgląd: `run.mjs --rodzina mobility_floor|mobility_stand --wyjscie .../scratchpad/mob-r6-rec/<rodzina> --podglad` (bez `--zastosuj`). Oba katalogi mają PODGLAD-WAZNY.txt, `zgodnosc_manifestu` = [], tabelę kątów, klatki na obrazie = `klatki_u`.
- `poze.json` = lib/figures/v2/poses/*.json dla 9/9 (floor) i 8/8 (stand) póz.
- cmp z podglądem autora (mob-r6): wszystkie HTML/PNG, poze.json, katy-stawow.md, raport.json, PODGLAD-WAZNY.txt identyczne. manifest.json różni się polem `przyblizenie` Side-Lying Quad: podgląd autora (12:07) ma stary wpis bez 15° i bez skłonu głowy, commit (13:06) ma nowy. Obrazy tego nie dotyczą (patrz luka 2).
- cmp z r5: zmieniły się tylko Side-Lying-Quad-Stretch HTML i PNG. Pozostałe 8 HTML + 8 PNG mobility_floor i 8 HTML + 8 PNG mobility_stand identyczne bajt w bajt (także poze/katy/raport mobility_stand). Brak regresji w 16 pozach.
- Widok w aplikacji: mobility_floor tylko z boku (lib/figures/v2/families.ts:62).

## Pomiar Side-Lying Quad Stretch z SVG (cm; podłoga y = 0, linia 1,2 → górna krawędź 0,6; klatki u = 0 i u = 1 identyczne)
Identyfikacja kształtów przez `v2.dataShapes` (id), profil co 2 cm (skrypty: .../scratchpad/rec6tools/prof.py, ids.mjs).

| Część | Dolna krawędź | r5 | Ocena |
|---|---|---|---|
| dłoń dolna (handL) | 1,4 (x −75,6…−66,4) | 7,9 | leży |
| przedramię (farmL, 2 kształty) | 1,0 | 8,6–9,1 | leży |
| łokieć/ramię (uarmL) | −0,5 i −1,9 (x −53…−49) | −1,9 / 3,9 | leży; bark wchodzi 1,3 cm pod linię (NISKIE #1, bez zmian od r5) |
| głowa (head) | 7,7; nad dłonią/przedramieniem: x −73…−71 głowa 7,7 / ręka do 7,4–7,7 (styk 0–0,3), x −69 odstęp 0,4 | 13,8 na wiszącej dłoni | leży na dłoni leżącej na podłodze; tył głowy (x −81…−75) wystaje poza dłoń, naturalnie |
| tułów (torso) | 0,5 przy barku i biodrze; talia do 4,9 (x −40…−10) | to samo | jak r5 (wcięcie talii, zaakceptowane) |
| miednica (shortsL) | 1,3–1,9 | 1,9 | leży |
| udo dolne (thighL) | 2,1–2,5 | 2,0–3,8 | leży (konwencja lezyBokNogaCm 3) |
| okolica kolana (szczelina między kształtami, x 28…46) | 2,7–3,5 | 5,1–7,3 | wcięcie stawu, < 1 cm ponad konwencję 3 cm w 5 kolumnach |
| goleń dolna (shankL) | 2,4–3,0 | 4,3–5,7 | leży |
| stopa dolna (footL) | 0,0 (−0,3 obrys) | 0,5–0,9 | leży, nie przenika |

- Przenikanie podłogi: tylko uarmL −1,9 (≈ 1,3 cm pod dolną krawędzią linii, ok. 2 px w PNG 1,5 px/cm, widoczne w kadrze 8×). Reszta ≥ −0,5.
- Znikanie: `czescCialaNieZnika` = [] ; żaden kształt części ciała w widoku z boku nie ma rozmiaru < 1,5 cm. `cialoLezy` = [] (głowa na dłoni, L1 i L2 przechodzą).
- Zgodność z opisem: leżenie na boku (tułów poziomy, obrót −75°), górne kolano zgięte 140,8°, dolne proste 9,3°, dłoń górnej ręki (handR x 0,6…13,5, y 41…48) na stopie/kostce górnej nogi (footR x 4,2…29,8, y 34,6…56,6), dolna ręka zgięta (łokieć 139,9°, zgięcie barku 104,8°), dłoń pod głową — zgodne z opisem źródła w komentarzu (przedramię pod głową). Głowa skłonem bocznym −20° (jointAngles headTilt). Wpis `przyblizenie` w manifeście z commitu nazywa 15° odchylenia i skłon ≈ 20° (r5 #3 zamknięte; test sprawdza wpis).
- Kadry PNG pełnej rozdzielczości: .../scratchpad/rec6tools/slq-r6rec-4x.png, .../scratchpad/rec6tools/slq-r6rec-glowa-8x.png (z mob-r6-rec/mobility_floor/mobility_floor/Side-Lying-Quad-Stretch-light.png, 1400×700).

## Werdykty
| Ćwiczenie | Werdykt |
|---|---|
| Side-Lying Quad Stretch | zatwierdzone (r5 #1, #2, #3 naprawione; 1 NISKIE bez zmian od r5) |
| pozostałe 16 póz (8 floor, 8 stand) | zatwierdzone, bez zmian od r5 (cmp identyczne) |
| Inchworm i wyjątki | bez zmian |

## Znaleziska
| # | Waga | Pewność | Ćwiczenie | Opis i dowód | Kroki w aplikacji | Realność |
|---|---|---|---|---|---|---|
| 1 | NISKIE | 85% | Side-Lying Quad Stretch | Dolny bark/ramię (uarmL, ścieżka 4 w HTML) schodzi do y −1,9 przy x −53…−49, czyli ok. 1,3 cm pod dolną krawędź linii podłogi; w kadrze 8× widać jasny garb pod linią. Mieści się w tolerancji reguły pod_podloga (podlogaTulow −2), było tak samo w r5 (−1,9), więc nie regresja. | Rodzina „planned”; po nałożeniu: Biblioteka → Side-Lying Quad Stretch → rysunek z boku | brzegowy (ok. 2 px przy 1,5 px/cm; backlog) |

Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH. Nic nie blokuje nałożenia pozy.

Obserwacja bez znaleziska (pewność defektu < 80%): `przyblizenie` mówi „biodro ≈ 13°”, tabela kątów po r6 ma biodro 8,2…10,9° (r5: 10,9…13,4°). Tekst wewnętrzny manifestu, nie trafia do aplikacji; warto zaktualizować przy okazji.

## Lista kontrolna (krok 2 i pozostałe)
1. Przybliżenia: wpis Side-Lying kompletny (15°, skłon głowy, dolna noga). Cecha rozpoznawcza zachowana.
2. Styk zmierzony z SVG we wszystkich klatkach (tabela wyżej); leżenie na boku: tułów, miednica, ręka, głowa, noga, stopa leżą; stopa grzbietem nie dotyczy; nic nie znika; „lekko”: bez zmian od r5 (obie_kolana_lekko max 30).
3. Rzędy błędów: brak (bez zmian).
4. i 7. `jakosc-raport.mjs`: 537 póz, cialo_lezy 0, czesc_ciala_nie_znika 0. Skan obu reguł na wszystkich rodzinach jest w tests/figury-mobilnosc-reguly.test.ts (zapadka w obie strony, trafienia ocenione PRAWDZIWE/FAŁSZYWE). `npx jest` figury-mobilnosc-reguly + figury-jakosc: 78/78.
5. Tabela kątów zgodna z opisem (wyżej).
6. Ważność: OK dla mojego podglądu.

## Luki listy i reguł
1. Reguły cialo_lezy i czesc_ciala_nie_znika w bramce produkcyjnej (v2-jakosc.mjs:471) nadal działają tylko dla mobility_floor/mobility_stand; inne rodziny pokrywa wyłącznie skan w teście z listą znanych trafień (np. Clamshell PRAWDZIWE, do poprawy w glute_floor). Akceptowalne jako zapadka, ale znane prawdziwe trafienia poza mobilnością nie blokują ich rodzin.
2. PODGLAD-WAZNY.txt nie wiąże podglądu z SHA commitu: podgląd autora mob-r6 (12:07) przeszedł kontrolę, choć jego manifest ma stary wpis `przyblizenie` (commit 13:06). Propozycja: zapisać SHA/hash danych i źródła PRZYBLIZENIA w znaczniku i porównywać przy recenzji.
3. L2 mierzy minimum na kształt, nie profil kolumnowy, więc szczelina przy kolanie (3,5 cm) przechodzi; komentarz progu to przewiduje (wcięcie stawu) — tylko do wiadomości.
4. Krok 2 listy nie wymienia progu przenikania pod linię dla kończyn (teraz −2 cm dla tułowia/głowy); warto ustalić jedną liczbę dla obrysu kończyn leżących.
