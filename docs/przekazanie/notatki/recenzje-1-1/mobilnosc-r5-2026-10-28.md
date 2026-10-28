# Recenzja ruchu (bramka 4): mobility_stand i mobility_floor, runda 5

Worktree /home/user/wt/rodziny-mobilnosc @ 2435e7e3. Nic nie zapisałem w repo (`git status` po pracy jest czysty).

## Ważność podglądu
- Zbudowałem własny podgląd (`run.mjs --rodzina <r> --wyjscie .../scratchpad/mob-r5-rec --podglad`, bez `--zastosuj`). Porównałem go `cmp` z mob-r5: wszystkie HTML i PNG, `poze.json`, `katy-stawow.md`, `raport.json` i `PODGLAD-WAZNY.txt` są identyczne. `manifest.json` różni się tylko polem `wygenerowano`.
- `mob-r5/*/poze.json` zgadza się z lib/figures/v2/poses/mobility_{floor,stand}.json (`cwiczenia`) dla 17 z 17 póz.
- Oba katalogi mają PODGLAD-WAZNY.txt, `zgodnosc_manifestu` bez niezgodności, tabelę kątów, a klatki na obrazie odpowiadają `klatki_u`.
- Regresje względem r4 (`cmp`): zmieniły się tylko 3 pozy (Side-Lying Quad, Cat-Cow, Standing Soleus). Pozostałe 14 HTML i 14 PNG są identyczne bajt w bajt z r4, więc nic się w nich nie cofnęło.
- Widoki w aplikacji (lib/figures/v2/families.ts:61-62): mobility_floor pokazuje tylko widok z boku, mobility_stand z boku i z przodu. Rzut z przodu w podglądzie mobility_floor nie trafia do aplikacji.

Pomiary wziąłem ze współrzędnych ścieżek SVG w HTML (cm, podłoga y = 0, linia podłogi ma grubość 1,2). Dla każdej kolumny x co 0,5 cm liczyłem najniższy punkt obrysu ciała. Skrypty są w .../scratchpad/rec5tools/ (svg.py, gap.py, low.py).

## Werdykty

| Ćwiczenie | Werdykt |
|---|---|
| Side-Lying Quad Stretch | do poprawy: 1 znalezisko ŚREDNIE (krok 2, dolna ręka i głowa wiszą) + 2 NISKIE |
| Standing Soleus And Achilles Stretch | zatwierdzone (r4 #2 naprawione) |
| Cat-Cow | zatwierdzone (r4 #3 naprawione) |
| Chin To Chest, Side Neck, Overhead Triceps, Standing Chest, Standing Gastrocnemius, Wall Calf, Standing Lateral | zatwierdzone (bez zmian od r4, cmp identyczne) |
| The Straddle, Seated Calf, Seated Floor Hamstring, Butterfly, Child's Pose, Kneeling Hip Flexor, Supine Hamstring | zatwierdzone (bez zmian od r4, cmp identyczne) |
| Inchworm | wyjątek (bez zmian od r4) |

## Co naprawiono (sprawdzone)
- **Side-Lying, tułów i miednica (r4 #1):** obrys tułowia schodzi do 0,5 cm, spodenki do 1,9 cm, dolne udo do 2,6 cm. Styk tułowia jest przy barku (x −54…−48, ramię −1,9) i przy biodrze (x ≈ 0, 1,9 cm). Między nimi jest talia, do 4,8 cm nad podłogą (x −39…−6). To naturalne wcięcie talii, nie błąd. W r4 był tu prześwit 7–9 cm.
- **Side-Lying, dolna stopa (r4 #1):** stopa jest widoczna (ścieżka 11, pole 261 cm², x 75,3…104,5, y 0,5…13,9) i leży na podłodze (0,6–0,9 cm). Żadna ścieżka ciała nie ma zerowego rozmiaru w widoku z boku.
- **Side-Lying, głowa na ręce:** dolna krawędź głowy (13,8 cm) zachodzi na dłoń/przedramię o 0,2–0,5 cm na odcinku x −72…−66. Styk jest, ale patrz znalezisko 1.
- **Soleus (r4 #2):** kolana 25,4…27,2° (było 36,6…58,1°), w zakresie 10–30°. Obie stopy płasko na całej długości (y −0,2, pięta tylna −0,2…0,5 cm). Zgięcie grzbietowe tylnej kostki 30,5°. Rozstaw stóp 49 cm (r4: 41 cm), miednica 84 cm (stanie 89,5 cm), tułów 8° w przód.
- **Cat-Cow (r4 #3):** goleń i stopa mają we wszystkich 3 klatkach identyczne x (−30,9…7,3 i −34,2…−20,8), więc przesunięcie kolan wynosi 0,0 cm (r4: 1,6 cm). Dłonie przesuwają się o 0,3 cm. Łokieć 6,6…9,5°.

## Znaleziska

| # | Waga | Pewność | Ćwiczenie | Krok | Opis i dowód | Kroki w aplikacji | Realność |
|---|---|---|---|---|---|---|---|
| 1 | ŚREDNIE | 90% | Side-Lying Quad Stretch | 2 (styk, „nic nie wisi”) | Dolna ręka wisi nad podłogą, a głowa leży na tej wiszącej ręce. Podparcie głowy jest więc tylko pozorne. Pomiar w widoku z boku (u = 0 i u = 1, identyczne): pod odcinkiem x −75…−57 cm najniższy punkt ciała to dłoń i przedramię (ścieżki 5, 3, 1, #9DA2A9) na wysokości 7,9–9,3 cm. Pod nimi jest tylko podłoga. Głowa (ścieżka 17) ma dolną krawędź 13,8 cm i opiera się na tej dłoni. Podłogi dotyka dopiero ramię przy barku (ścieżka 4, x −58…−45). Przy 1,5 px/cm to ok. 12 px prześwitu pod dłonią. Widać to na PNG (kadr 4×: .../scratchpad/rec5tools/slq-side-4x.png). Prawdopodobna przyczyna: obrót tułowia −75° (r5) przechyla płaszczyznę zgięcia barku o 15°, więc ramię zgięte w barku o 100,8° unosi się od podłogi. W pozycji ze źródła (przedramię pod głową) ręka leży na podłodze. Reguła `cialo_lezy` (v2-jakosc.mjs:238-243) sprawdza tylko odległość głowy od ręki, a nie to, czy ręka leży, dlatego przepuszcza. Poprawka: dłoń i przedramię na podłodze (dolna krawędź ≤ 2 cm, np. chwyt L y ≈ 4–5), głowa opuszczona na dłoń, albo dolna ręka wyprostowana za głową wzdłuż podłogi z głową na ramieniu. | Rodzina ma status „planned”. Po nałożeniu: Biblioteka → Side-Lying Quad Stretch → rysunek (widok z boku). | realny |
| 2 | NISKIE | 85% | Side-Lying Quad Stretch | 2 (styk) | Dolna noga (prosta, leży) nad kolanem i goleniem nie dotyka podłogi. Prześwit: udo 2,0–3,8 cm (x 2…24), okolica kolana 5,1–7,3 cm (x 27…45, ścieżka 8), goleń 4,3–5,7 cm (x 48…72, ścieżki 6 i 10). Stopa dotyka (0,8 cm). W r4 było 7,6 cm pod kolanem, więc to nie regresja. Na PNG widać jasny klin pod podudziem (ok. 11 px przy 1,5 px/cm). Kostka y = 8 jest za wysoko dla nogi leżącej na boku. | jak wyżej | brzegowy (widoczne, ale ćwiczenie rozpoznawalne; backlog albo tania poprawka razem z #1) |
| 3 | NISKIE | 90% | Side-Lying Quad Stretch | 1 (przybliżenie) | Odchylenie tułowia do tyłu o 15° (obrotTulowia −75°, przechylTulowia 2°) odbiega od opisu źródła („biodra i barki jedno nad drugim”, ACE #149 w komentarzu mobility_floor.mjs:90). Nie jest jednak nazwane w polu `przyblizenie` manifestu. Opisuje je tylko komentarz w kodzie (mobility_floor.mjs:87). W jedynym widoku aplikacji (z boku) 15° obrotu nie widać i cecha rozpoznawcza zostaje (patrz niżej), więc to luka w dokumentacji, nie w obrazie. | nie dotyczy (manifest) | teoretyczny dla obrazu; dopisać do `przyblizenie` |

Waga według CLAUDE.md („Audyty i wydania”): żadne z tych znalezisk nie blokuje wydania (to nietrafiony rysunek, bez danych, liczb dla użytkownika ani prywatności). W bramce 4 znalezisko ŚREDNIE nr 1 blokuje nałożenie pozy Side-Lying Quad.

## Ocena merytoryczna dwóch zmienionych póz
- **Side-Lying Quad, zgodność z opisem:** biodra i barki są obrócone o ok. 15° do tyłu od pionu. W rzucie z przodu (niewyświetlanym) górne udo jest przesunięte względem dolnego o ok. 4,5 cm na 20 cm wysokości, czyli ok. 13°. To odchylenie mniejsze niż typowy błąd „przetaczanie się na plecy”, więc uznaję je za dopuszczalne uproszczenie (z warunkiem z #3). Cecha rozpoznawcza zostaje w widoku z boku: leżenie na boku, górne kolano zgięte 140,8°, dłoń przy kostce (pięta ku pośladkowi), dolna noga prosta (kolano 10°), górne udo leży na dolnym (górne udo y ≥ 18,5, dolne udo y ≤ 21,1, zachodzą na siebie).
- **Soleus vs częściowy przysiad:** to nie przysiad. Stopy są w wykroku (49 cm rozstawu), tylna pięta płasko na podłodze z kostką 30,5° zgięcia grzbietowego, oba kolana miękkie (ok. 26°), miednica tylko 5,5 cm niżej niż w staniu, tułów prawie pionowo. Obraz (kadr .../scratchpad/rec5tools/sol-mob-r5.png) czyta się jak „wykrok z lekko ugiętymi kolanami, pięta tylna w dół”.

## Lista kontrolna, krok po kroku
1. Przybliżenia: bez zmian od r4, z jedną luką (#3: obrót −75° nienazwany w manifeście).
2. Styki zmierzone z SVG dla 3 zmienionych póz we wszystkich klatkach. Pozostałe 14 jest identycznych z r4 (pomiary r4 nadal ważne). Leżenie na boku: tułów i miednica OK, ręka i głowa wiszą (#1), noga częściowo wisi (#2). Znikające części: w widokach aplikacji żadnej. Zerowy rozmiar ma jedynie ścieżka #13294B w rzucie z przodu Supine Hamstring, który w aplikacji się nie wyświetla (bez zmian od r4), oraz linie bez wypełnienia (pole 0 z definicji). Górny próg „lekko”: `obie_kolana_lekko` ma teraz max_max_deg 30 (figury-sens.json), a Soleus 27,2° go spełnia.
3. Rzędy błędów: żadna poza ich nie ma (bez zmian).
4. i 7. `node scripts/figures/jakosc-raport.mjs`: `cialo_lezy` 0 trafień, `czesc_ciala_nie_znika` 0, jedyne trafienie spoza zakresu to Wall Sit `klatki_rozne` (jak w r4). Obie nowe reguły biegną jednak tylko dla mobility_floor i mobility_stand (v2-jakosc.mjs:461), więc sprawdzianu na innych rodzinach nie było (luka poniżej). `npx jest` na figury-mobilnosc-reguly, figury-jakosc i figury-sens-r4-r5: 92 z 92 testów przechodzi.
5. Tabela kątów: Soleus kolano 25,4…27,2°, biodro 7,6…39,1°, kostka −3,5…30,5°, zgodne z „slightly flex”. Side-Lying: kolano 10…140,8°, biodro 10,9…13,4°, bark 100,8° (dolna ręka, przyczyna #1), kostka −28,3° (dolna stopa wyprostowana w kostce, leży na zewnętrznej krawędzi). Cat-Cow bez istotnych zmian.
6. Ważność: OK (wyżej).

## Luki listy kontrolnej i reguł
- `cialo_lezy`, część „głowa”: wystarcza ≤ glowaPodparcieCm od ręki, a reguła nie sprawdza, czy ta ręka sama leży. Propozycja: podpora głowy liczy się tylko wtedy, gdy podpierający odcinek ręki ma dolną krawędź ≤ lezyCm (łańcuch podparcia do podłogi). Ogólniej: „nic nie wisi” dla leżenia, czyli każda kończyna opisana jako leżąca ma dolną krawędź ≤ 2–3 cm.
- `cialo_lezy` nie obejmuje kończyn, które według opisu leżą (dolna noga przy leżeniu na boku, #2).
- `cialo_lezy` i `czesc_ciala_nie_znika` są ograniczone do dwóch rodzin mobilności (v2-jakosc.mjs:461). To łamie krok 4 („nowa reguła → przebieg na WSZYSTKICH pozach”) i krok 7 (sprawdzian na rodzinach, na których nie strojono progów). Przynajmniej `czesc_ciala_nie_znika` da się uruchomić na wszystkich rodzinach (dane + rigi) i zaraportować trafienia osobno.
- Krok 1: zmiana pozy z powodu ograniczeń rigu (tu obrót −75°, żeby ramię nie wchodziło pod podłogę) powinna automatycznie wymagać wpisu w `przyblizenie`. Teraz takie odstępstwo zostaje tylko w komentarzu kodu.
