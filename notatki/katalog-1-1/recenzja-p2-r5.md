# Recenzja ruchu (bramka 4) — leg_machine, runda p2-r5 (28.10.2026)

Materiał: origin/przekazanie-konta, docs/przekazanie/notatki/podglady-1-1/poprawki-p2-r5/leg_machine (PODGLAD-WAZNY, zgodnosc_manifestu = [], tabela kątów obecna). Kod: /home/user/wt/poprawki-p2 @ 64ba5f2e (zmiana: a5622658).
Metoda: własny parser SVG z HTML podglądu (krzywe Béziera próbkowane po 20 punktów; jednostka SVG = 1 cm; transformacja `g` taka sama we wszystkich klatkach). Płyta = linia `stroke-width=3 #4A5361`, prowadnica = `stroke-width=2 #6B7380`, but = `fill=#18202B` poniżej y = 100. Odstęp = (środek płyty − punkt buta) · kierunek prowadnicy; dodatni = przed płytą (po stronie ćwiczącego), ujemny = za płytą. Skrypty: /tmp/claude-0/-home-user/43220166-1b11-51f4-bc49-d1302bde56f8/scratchpad/skr/mierz.py, bbox.py. PNG oglądane w pełnej rozdzielczości i w powiększeniu 5x (crop-Leg-Press.png).

## Werdykty

| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Leg Press | zatwierdzone | znalezisko r4 usunięte (pomiar niżej); uwaga NISKA: palce 3,7 cm poza górną krawędzią płyty |
| Single Leg Press | zatwierdzone | jak Leg Press; noga wolna nieruchoma na podłodze |
| Calf Press (leg press) | zatwierdzone (bez regresji) | widok z boku identyczny z r3 bajt w bajt; zniknął tylko widok z przodu (zamierzone w c17aaf59) |
| Hack Squat | zatwierdzone (bez regresji) | HTML i PNG identyczne z r4 (cmp) |
| Pendulum Squat | zatwierdzone (bez regresji) | HTML i PNG identyczne z r4 (cmp) |
| Lying Machine Squat | zatwierdzone (bez regresji) | HTML i PNG identyczne z r4 (cmp) |
| Belt Squat Machine | zatwierdzone (bez regresji) | HTML identyczny z r3 (cmp; w r4 nie było tej pozy) |

## Pomiar Leg Press / Single Leg Press (noga pracująca), klatki u = 0; 0,25; 0,5; 0,75; 1

Odstęp podeszwy od linii środkowej płyty, cm (taki sam w każdej klatce, oba buty Leg Press):
- pięta: −0,30
- śródstopie: −0,21
- palce: −0,29 (czubek: −0,01)
Grubość rysowanej płyty 3 cm (±1,5), więc podeszwa leży w obrysie płyty — na obrazie płyta przylega do podeszwy, bez szczeliny i bez przenikania. Dla porównania r4: −7,0 cm.
- But nie przenika płyty z drugiej strony: najdalszy punkt buta po stronie ćwiczącego +12,7 cm, po drugiej stronie −0,30 cm (< 1,5 cm połowy grubości płyty).
- Tor stóp zgodny z prowadnicą: przesunięcie buta u 0→1 = (+21,7; −5,8) cm, przesunięcie środka płyty = (+21,70; −5,79); kąt prowadnicy −15,0°, płyta prostopadła (iloczyn skalarny 0,000), środek płyty 0,1 cm od osi prowadnicy; skok 0,45…22,91 cm w prowadnicy 28,6 cm.
- Kolano bez przeprostu: kolano 15,5…86,0° (LP) / 15,5…95,0° (SLP; 95° to noga wolna), min. > 0; tabela kątów identyczna z r3/r4 (zmieniło się tylko położenie platformy).
- Miednica nieruchoma: obrys tułowia (−11,22…17,45; 38,73…103,13) i miednicy (−1,3…18,5; 39,4…56,6) oraz głowy identyczne we wszystkich 5 klatkach; oparcie stałe.
- Płyta w całości widoczna: końce płyty w u = 1 x 92,8…102,1, koniec prowadnicy 102,93; pole widoku do x = 108,9; nic nie jest ucięte (PNG potwierdza).
- Single Leg Press, noga wolna: but nieruchomy w każdej klatce (x 39,4…68,5, y −0,5…12,9 — 0,5 cm pod linią podłogi, w grubości kreski 1,2 cm), daleko pod dolnym końcem płyty (y ≥ 32,8) — brak kolizji.

## Znaleziska

| # | Poziom | Pewność | Ćwiczenie | Opis | Realność | Dowód |
|---|---|---|---|---|---|---|
| 1 | NISKIE | 90% | Leg Press, Single Leg Press | Płyta (36 cm) jest wyśrodkowana w punkcie „kostka + wysokość kostki”, a nie w środku stopy: podeszwa zajmuje −7,0…+21,7 cm wzdłuż płyty (płyta −18…+18), więc czubek buta wystaje ok. 3,7 cm (wizualnie ok. 2 cm po zaokrąglonym końcu kreski) ponad górną krawędź płyty we wszystkich klatkach. Pięta i przodostopie leżą na płycie, wskazówka „całą stopą” czytelna. | realny (widoczny w każdej animacji), ale kosmetyczny — nie blokuje | Leg-Press-light.html u=0: płyta M71.1 32.8L80.42 67.57, but do (80.87; 70.9); profil wzdłuż płyty w raporcie skryptu; crop-Leg-Press.png |
| 2 | NISKIE | 85% | Calf Press (leg press) | Etykieta capLabel `leg_press` zmieniona na „prowadnica, punkt: podeszwy”, a Calf Press ma dźwignię „obrot” z punktem „kostki” — opis sprzętu w manifeście (i w poleceniu dla generatora) przeczy danym. Przed r5 też był niezgodny („prowadnica, punkt: kostki”). Tekst wewnętrzny, nie w UI. | teoretyczny dla użytkownika; ryzyko mylącego polecenia przy przyszłym generowaniu | manifest.json, Calf Press opis.sens; lib/figures/v2/gear.ts (capLabel leg_press) |

Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH.

## Lista kontrolna (docs/53, bramka 4)

1. Przybliżenia: suwnica pozioma zachowuje cechę rozpoznawczą (siad, wypychanie płyty stopami po prowadnicy); SLP — jedna noga, druga na podłodze. OK.
2. Wskazówki widoczne: „pchaj całą stopą, pięty nie odrywają się” — pięta na płycie w każdej klatce (pomiar). OK.
3. Rzędy błędów: LP/SLP bez rzędów błędu (kneesIn nie do pokazania z boku, decyzja r4); pozostałe rzędy bez zmian względem r3/r4.
4. Nowa reguła na wszystkich pozach: test tests/figury-p2-r5.test.ts p. 2 sprawdza całą paczkę (jedyne „podeszwy” to LP/SLP; „prosta + kostki” tylko Seated Calf Raise). Nie uruchamiałem testu sam — oparte na odczycie kodu testu.
5. Tabela kątów porównana z opisem i z r3/r4 — bez zmian.
6. PODGLAD-WAZNY, zgodnosc_manifestu = [] — OK.
7. Sprawdzian przeciw dopasowaniu progów — nie uruchamiałem jakosc-raport.mjs.

## Luki listy kontrolnej / reguł

- L1: reguła `stopa_na_platformie` mierzy tylko odległość od płaszczyzny płyty, nie to, czy podeszwa mieści się w długości płyty (znalezisko 1 przeszło automat). Propozycja: dodać warunek „pięta i palce w obrysie płyty wzdłuż jej długości (|s| ≤ machinePad/2)”.
- L2: brak w liście stałego kroku „pomiar styku ciało–sprzęt ze współrzędnych (odległość i zasięg), nie na oko” dla każdego punktu podparcia (płyta, wałek, poduszka, podłoga) — błąd r3/r4 umknął właśnie ocenie na oko.
- L3: lista nie każe sprawdzać spójności etykiety sprzętu (capLabel) z trybem/punktem dźwigni w danych (znalezisko 2).
