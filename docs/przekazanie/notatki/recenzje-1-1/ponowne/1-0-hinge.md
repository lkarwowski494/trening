# Ponowna recenzja 1.0: rodzina hinge (32 ćwiczenia, rig), 27.10.2026, recenzent 1.0 hinge

Oceniam `origin/naprawa-figury-1-0` @ 6a9dd655 (baza main 4b77c9f6, PR #73). Podgląd: `podglady-1-1/naprawa-1-0/` (hinge-light-0…3.png, katy-stawow.md, manifest.json, PODGLAD-WAZNY.txt — ważny; brak `zgodnosc_manifestu`, rodzina z rigu, akceptowalne). Opisu PR, komunikatów commitów, README podglądów ani lekcji nie czytałem.

Metoda (jak pierwotna `recenzje-1-1/hinge.md`):
- arkusze PNG w pełnej rozdzielczości + własne rendery z torem ruchu (`trailFor`, ten sam, który rysuje `components/ExerciseFigureV2.tsx`), kadry boku;
- liczby z `frameAt` na siatce u co 0,025 (41 klatek): x ciężaru względem środka stopy (x 6,5; palce x 18,8), zakres toru, kąt kolana/biodra, tułów od pionu; to samo dla wierszy błędów (`barAway`, `kneesBent`, `roundBack`);
- porównanie z main 4b77c9f6 tą samą miarą;
- treść karty: `lib/cues/data.json` (own), `lib/figures/v2/cue-sets.json` (general), teksty `lib/cues/text/pl.json`, mięśnie `muscles.generated.ts`, źródła wskazówek `data/zrodla/cues.json`.

## Podsumowanie

| | liczba |
|---|---|
| OK | 14 |
| OK z uwagą | 16 |
| BŁĄD | 2 (Reverse Band Deadlift, Reverse Band Sumo Deadlift — ta sama przyczyna) |

**Czy hinge może być wyświetlana w 1.0: TAK PO POPRAWCE R1** — gumy w dwóch odmianach „Reverse Band” rysowane od podłogi zamiast od góry stojaka (odwrócona cecha rozpoznawcza). Poprawka tania: guma od gryfu w górę (do górnej belki stojaka) albo — minimalnie — bez gumy w tych dwóch odmianach. Reszta znalezisk to ŚREDNIE/NISKIE (backlog 1.1).

Zalecane, choć nieblokujące: U1 dla **Deadlift (hantle)** — właściciel zgłaszał ten tor; tor już nie wychodzi przed stopy, ale na wysokości kolan nadal widać łagodne „S” (ok. 6 cm do przodu i z powrotem), które może zostać odebrane jako ten sam błąd.

### Stan wcześniejszych znalezisk (`recenzje-1-1/hinge.md`)

| # | Było | Teraz (6a9dd655) | Stan |
|---|---|---|---|
| 1 | Martwy ciąg klasyczny: gryf 10 cm przed środkiem stopy na starcie, 21 cm w połowie ruchu (przed palcami); Rack Pull 19 cm | Deadlift (sztanga) start **+3,0 cm**, max **+7,0 cm** (u≈0,5, wysokość kolan), nigdy przed palcami (zapas ≥ 5 cm). Deadlift (hantle) start **−0,5**, max **+5,8** (main: +8,0 / +21,0, 8,7 cm przed palcami). Rack Pull start **+6,3** (main +19,0). Pozostałe klasyczne: start +2,5…+3,3 | **usunięty** (resztka: U1, U2) |
| 1b | `mis.barAway` tylko 6–12 cm od wzorca | błąd: start +14,5 cm, czyli **+11,5 cm** od poprawnej | **usunięty** |
| 2 | One-Arm Side: gryf w poprzek przed nogami, przez golenie, dłoń 10 cm od gryfu | gryf wzdłuż osi przód–tył, z boku ciała (z 26), dłoń na środku, x nad środkiem stopy przez cały ruch; z przodu talerz jako koło przed ciałem | **usunięty** |
| 3 | Guma przez tułów (Band GM) i „Reverse” ciągnięte od dołu | Band Good Morning: dwie gumy przy końcach gryfu — **usunięty**. Reverse Band Deadlift i Reverse Band Sumo: nadal gumy od końców gryfu **w dół do podłogi**, identycznie jak „with Bands” | **częściowo — R1** |
| 4 | Kolana 40–44° w RDL / GM przy „lekko ugięte” | RDL (sztanga) max 20,7° (dół 15,5°), RDL (hantle) 18,4°, SL RDL 17,0/20,5°, Single Arm RDL 25,2°, GM / Band GM / GM off Pins 23,9°, SLDL i Smith SLDL 25,2°; tułów RDL na dole 60°, SLDL 68°. `rdl.knees` (kneesBent): 58° vs 16° (**+42°**) | **usunięty** |
| A | Rack Pull, Rack Pull with Bands, GM off Pins bez stojaka/bolców | bez zmian (gryf startuje w powietrzu) | uwaga, backlog |
| B | „with Bands”: jedna guma w osi | dwie gumy przy końcach gryfu | **usunięta** |

## Wynik na ćwiczenie

| Ćwiczenie | Ruch | Treść karty | Werdykt | Szczegóły |
|---|---|---|---|---|
| Deadlift (sztanga) | start +3,0 cm, tułów 65°, barki 3 cm przed gryfem, goleń 6° | own: dl.feet, dl.grip, dl.lift, dl.lower, hinge.back, dl.close, dl.hipsLow; błędy roundBack, barAway — zgodne z rysunkiem | OK z uwagą | U1 |
| Deadlift (hantle) | start −0,5, max +5,8 przy kolanach, koniec −1,8; tułów 60°→0° (main: −9,8° odchylenie na górze — usunięte) | own: dbdl.setup „ciężar przy nogach”, dl.lift, dl.lower, hinge.back, dbdl.hips; zgodne | OK z uwagą | U1 (zgłoszenie właściciela), U5 |
| Sumo Deadlift | gryf −1,8, szeroko, stopy na zewnątrz, kolana 100° | own: sumo.* — zgodne | OK | |
| Trap Bar Deadlift | uchwyty −1,8, pionowo | own: tb.inside, tb.lift „aż staniesz prosto” | OK z uwagą | U4 (na górze tułów −6,4° — lekkie odchylenie) |
| RDL (sztanga) | kolano max 21°, tułów 60°, gryf przy nogach | own: rdl.setup/move/depth/knees, dl.close; błąd rdl.knees +42° — wyraźny | OK | |
| RDL (hantle/linki) | kolano max 18°, tułów 60° | own: rdl.dbSetup/dbMove/depth; zgodne | OK | |
| Good Morning | kolano 24°, tułów do 42° | own: gm.setup „lekko ugięte”, gm.depth „łagodne rozciągnięcie, nie dalej niż poziom” — zgodne | OK | |
| Rack Pull | start +6,3 cm, przy przejściu przez udo tor cofa się o ok. 8 cm („hak” na torze) | general hingeFloor (dl.lift, hinge.back, dl.close) — zgodne | OK z uwagą | A, U2 |
| Single Leg RDL (hantel) | kolano 17°, tułów 61°, wolna noga w tył | general rdl | OK | |
| Single Leg RDL (linki) | kolano 20,5° | general rdl | OK | |
| Cable Pull Through | linka z bloczka z tyłu między nogami; na dole kolano 41,5°, tułów tylko 30° | general rdl (hinge.back, rdl.depth) | OK z uwagą | U6 |
| Sumo Deadlift (kettlebell) | odważnik między stopami, pionowo | general | OK | |
| Single Arm RDL (hantel/linka) | kolano 25°, wolna ręka na biodrze | general z rdl.knees — 25° mieści się w „lekko” | OK | |
| Axle Deadlift | jak Deadlift (sztanga) | general | OK z uwagą | U1 |
| Deadlift with Bands | jak wyżej, dwie gumy przy końcach w dół | general | OK z uwagą | U1 |
| Deadlift with Chains | łańcuchy przy końcach | general | OK z uwagą | U1 |
| Deficit Deadlift | podest 6 cm, start +2,5 | general | OK z uwagą | U1 |
| Rack Pull with Bands | jak Rack Pull, dwie gumy | general | OK z uwagą | A, U2 |
| **Reverse Band Deadlift** | gumy od końców gryfu do podłogi (jak „with Bands”) | general (bez zdania o gumie) | **BŁĄD** | **R1** |
| Cable Deadlift | linka od podłogi pionowo do dłoni | general | OK z uwagą | U1 |
| Leverage Deadlift | jak trap bar | general | OK z uwagą | U4 |
| One-Arm Side Deadlift | gryf z boku wzdłuż x, dłoń na środku | general (dl.lift, hinge.back) | OK | nr 2 usunięty |
| Rickshaw Deadlift | jak trap bar | general (tb.lift) | OK z uwagą | U4 |
| Band Good Morning | dwie gumy przy końcach w dół, kolano 24° | general (gm.move, hinge.back) | OK | |
| Clean Deadlift | jak Deadlift (sztanga) | general | OK z uwagą | U1 |
| Good Morning off Pins | bez bolców | general | OK z uwagą | A |
| **Reverse Band Sumo Deadlift** | gumy od gryfu do podłogi | general | **BŁĄD** | **R1** |
| Smith Machine Stiff-Legged Deadlift | prowadnice pionowo, kolano 25°, tułów 68° | general z rdl.knees | OK | |
| Snatch Deadlift | szeroki chwyt, start +3,3 | general | OK z uwagą | U1 |
| Stiff-Legged Barbell Deadlift | kolano 25°, tułów 68° | general z rdl.knees | OK | |
| Sumo Deadlift with Bands | dwie gumy przy końcach | general | OK | |
| Sumo Deadlift with Chains | łańcuchy przy końcach | general | OK | |

Treść kart (wszystkie 32): wskazówki brzmią naturalnie, bez nazw źródeł i marek; każde użyte id wskazówki ma wpis źródeł w `data/zrodla/cues.json`; mięśnie zgodne z ruchem, poziom pewności podany (Rack Pull „jedno źródło”, One-Arm Side „brak źródła — uproszczenie”, odmiany „analogia”). Dopisek „Ogólne wskazówki dla tego ruchu” przy zestawach general — zgodnie z decyzją z 25.10. Nie znalazłem wskazówki, która przeczy rysunkowi.

## BŁĘDY KRYTYCZNE / WYSOKIE (blokują)

| # | Ćwiczenia | Klatka / element | Co jest źle | Jak powinno być | Waga | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|---|
| R1 | **Reverse Band Deadlift, Reverse Band Sumo Deadlift** | wszystkie klatki, guma (oba widoki) | Wariant ma `band: true` jak „with Bands”: guma od końców gryfu (x gryfu, y gryfu) w dół do podłogi (y 0). Rysunek pokazuje więc opór rosnący do góry, a w tej odmianie gumy zwisają z góry stojaka i odciążają gryf na dole — cecha rozpoznawcza odwrócona. | Dwie gumy od końców gryfu w górę (do górnej belki stojaka), albo w 1.0 bez gumy (rysunek zwykłego martwego ciągu jest mniej mylący niż odwrócony). | WYSOKIE (błędne twierdzenie merytoryczne w obrazie) | 80% | realny (ćwiczenie w katalogu, rodzina `ready`) | nie: `figury-1-0-recenzja.test.ts` sprawdza tylko flagę `bar` na gumie, nie kierunek; potrzebna reguła „Reverse Band → guma powyżej gryfu” |

Kroki odtworzenia w aplikacji: Ćwiczenia (biblioteka) → wyszukaj „Reverse Band Deadlift” (albo „Reverse Band Sumo Deadlift”) → otwórz kartę ćwiczenia (Technika) → animacja: przerywane linie gumy biegną od końców gryfu w dół do podłogi, tak samo jak w „Deadlift with Bands”; najlepiej widać w widoku z przodu.

## OK z uwagą (backlog 1.1, nie blokują)

- **U1 — tor gryfu w kształcie „S” przy kolanach** (Deadlift sztanga/hantle, Axle, with Bands, with Chains, Deficit, Cable, Clean, Snatch). Start w normie (≤ 3,3 cm od środka stopy), ale przy przejściu przez kolano ciężar wychodzi do przodu (sztanga max +7,0 cm, zakres toru 8,8 cm; hantle max +5,8, zakres 7,5 cm), potem cofa się do x 4,8 (−1,8) i na górze znów do przodu (sztanga do +2,0). W aplikacji tor jest rysowany linią przerywaną, więc „S” jest widoczne (kadr: render boku z `trailFor`). Wcześniejsze kryterium „odchylenie toru ≤ 5 cm” nadal przekroczone o 2–4 cm. Dla hantli trzymanych po bokach przyczyną jest zderzenie hantla (z 26) z kolanami — hantle trzymane wzdłuż nóg (uchwyt równoległy) mogłyby iść pionowo. ŚREDNIE (wskazówki dl.feet/dl.close nie są złamane: start nad środkiem stopy, gryf w styku z nogami). Pewność 70%. Reguła: test sprawdza tylko u = 0 — brak reguły na zakres toru w ruchu.
- **U2 — Rack Pull (i with Bands): start +6,3 cm**, potem „hak” (cofnięcie ok. 8 cm przy udzie). Test dopuszcza 8 cm dla startu z podwyższenia. ŚREDNIE/NISKIE.
- **A — brak stojaka/bolców** (Rack Pull, Rack Pull with Bands, GM off Pins): gryf startuje w powietrzu. Bez zmian względem pierwotnej recenzji. NISKIE.
- **U4 — trap bar / leverage / rickshaw: na górze tułów −6,4° (odchylenie do tyłu) przy kolanie 0°.** Delikatne, ale to klasyczny błąd „przeprostu na górze”. NISKIE.
- **U5 — widok z przodu, Deadlift (hantle) (i inne z ciężarem po bokach): tor rysowany w osi ciała**, między nogami, a hantle są po bokach. NISKIE.
- **U6 — Cable Pull Through: na dole kolano 41,5°, tułów tylko 30° od pionu** — bardziej półprzysiad niż zawias; wskazówka rdl.depth („schodź, dopóki czujesz rozciąganie tyłu ud”) sugeruje głębszy skłon w biodrach. ŚREDNIE/NISKIE, pewność 55%.

## Szczelność reguł

- R1: nie łapie żadna reguła (test sprawdza obecność i flagę gumy, nie kierunek). Propozycja: `reverse_band_od_gory` — dla kluczy „Reverse Band …” koniec gumy powyżej gryfu.
- U1: `figury-1-0-recenzja.test.ts` sprawdza x ciężaru tylko w u = 0. Propozycja: `tor_pionowy` — dla martwych ciągów klasycznych max |x − środek stopy| ≤ 5 cm w każdej klatce (dziś łapie 10 ćwiczeń z wartościami 5,8–7,3 cm).
