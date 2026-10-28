# Deadlift (sztanga) w build 1032 (main 025a50b9): co jest źle

Wynik: przerywana linia toru gryfu robi „S” na wysokości kolan. W 1032 gryf idzie: start 3,1 cm przed środkiem stopy, przy kolanie 7,1 cm przed nim, potem 1,7 cm za nim, a na samej górze znów 2,1 cm przed nim (haczyk). Rozrzut 8,8 cm, kierunek zmienia się 2 razy. Hantle: stałe −1,7 cm, linia prosta.
Na origin/main 2385e75a lib/figures/v2 jest identyczne z 1032, więc błąd nadal tam jest. integracja-1-1 nie ma poprawek 1.0 (c6b1c813/03723210) i wypada gorzej: gryf 10 cm przed środkiem stopy na starcie i 21 cm przed nim w połowie ruchu, hantle też.

## Pomiary (x od środka stopy 6,4 cm; skrypt: scratchpad/dl/gesto.mjs, siatka u co 0,02)
Deadlift (sztanga): u0–0,38: 3,1→4,3 | u0,46: 7,1 (y46, kolano y48) | u0,68–0,88: −1,7 (ogranicznik xMin) | u1: 2,1
Deadlift (hantle): −1,7 w całym ruchu (jedno odchylenie do +0,1 przy kolanie)
Kąty na starcie (sztanga/hantle): kolano 72°/82°, biodro 125°/127°, tułów 65°/58° od pionu, goleń 6°, bark 3 cm przed gryfem. Na górze kolano 6°, tułów 3°.
Gryf na starcie y 22,5 (talerze na podłodze, OK). Chwyt z ±23 (bark ±19, OK). Najmniejszy odstęp ciało–sprzęt ≥ 1,2 cm, nic nie przenika.

## Przyczyna (lib/figures/v2/rigs/hinge.ts:63–72, 108–112)
- Dla sztangi `clearance()` przyjmuje stały promień uda 8,9 cm (rt, „centre”) wokół odcinka biodro–kolano, także na końcu przy kolanie. Gryf musi więc być ≥ 10,5 cm przed osią stawu kolanowego. Kolano jest w x 2,8, więc gryf ląduje w x 13,3 i robi wybrzuszenie. Własna tabela GIRTH.thigh podaje przy kolanie 6,0, nie 8,9 (skeleton.ts:20).
- Nad kolanem gryf odrywa się od uda i spada na `xMin` 4,5 (−1,7 od środka stopy). Przy wyproście udo staje pionowo i wypycha gryf do przodu: to haczyk na górze.
- Hantle (z ±30, obok nóg) nigdy nie dotykają kapsuły, więc zostają na xMin i tor jest prosty. Tak naprawiono zgłoszenie właściciela dla hantli (03723210, HINGE.dbFloorGrip). Sztanga musi przejść przed kolanami, więc zostaje z błędem.
- Rysowanie: `trailFor` (figure.ts:126–130) łączy odcinkami prostymi 25 klatek u=i/24 i śledzi `info.load` (środek gryfu). Nie ma tu splajnu: wybrzuszenie jest w samych klatkach, nie wynika z interpolacji.

## Dlaczego test przepuścił
tests/figury-1-0-recenzja.test.ts:27 i 29 dopuszcza x ∈ [−3, +8] na klatkę i rozrzut ≤ 10 cm. Sztanga ma max 7,1 i rozrzut 8,8, więc przechodzi. Ostry próg [−3; +2,5] i rozrzut ≤ 3 dostały tylko hantle (test na wierszu 36). Nie ma testu monotoniczności ani kształtu narysowanego śladu (trailFor). tests/figures-v2-guides.test.tsx liczy tylko odcinki.

## Ten sam błąd (S, 2 zmiany kierunku, rozrzut 8,8–9,0, szczyt przy kolanie)
Axle Deadlift, Deadlift with Bands, Deadlift with Chains, Reverse Band Deadlift, Clean Deadlift, Deficit Deadlift, Snatch Deadlift, Cable Deadlift.
Pokrewne: Rack Pull i Rack Pull with Bands (1 zmiana kierunku: 6,3 → −1,7 → 2,1, rozrzut 8,5, z haczykiem). Stiff-Legged Barbell i Smith Stiff-Legged (1 zmiana, rozrzut 6,5).
Sumo (wszystkie 4 sztangowe): ukos −1,7 → 5,1 na górze (rozrzut 6,8, bez S).
Bez błędu: hantle, One-Arm Side, Trap Bar, Leverage, Rickshaw, Good Morning (0,0).

## PNG (pełna rozdzielczość, jak w aplikacji: figura + ślad + pion środka stopy + linia pleców)
- scratchpad/dl/1032-dl.png (sztanga i hantle, bok i przód, u 0…1 co 0,1)
- scratchpad/dl/kadr-sztanga-bok-u1.png: ślad wygięty na wysokości goleni i kolan, kropka startu na ok. 1/4 wysokości (to objaw ze zrzutu właściciela)
- scratchpad/dl/kadr-hantle-bok-u1.png: ślad prosty, równoległy do pionu

## Waga
WYSOKIE (merytoryczne: rysunek i jawnie narysowany tor przeczą wskazówce karty dl.feet/dl.close „blisko piszczeli, nad środkiem stopy” i wyglądają jak błąd mis.barAway). Realny: każdy, kto otworzy kartę Deadlift (sztanga). Pewność 90%.
Kierunek naprawy (do decyzji programisty): promień uda w clearance zwężany ku kolanu wg GIRTH zamiast stałego 8,9, test monotoniczności x(u) i ostry próg jak dla hantli dla wszystkich CONV.

## Dopisek po 2. wiadomości koordynatora
- Największe poziome odchylenie toru od prostej start–koniec (u co 0,02):
  - sztanga: +4,4 cm w przód (u 0,46, y 46, na wysokości kolana) i −4,1 cm w tył (u 0,68, y 63); od szczytu do szczytu 8,8 cm. Względem pionu przez start: +4,0 i −4,8.
  - hantle: +1,8 cm (u 0,46, y 47, przy kolanie; to zafalowanie widoczne na zrzucie właściciela), poza tym 0.
- Hipotezę „kolana za daleko w przód” sprawdziłem i nie potwierdza się. W chwili mijania kolana (u 0,46–0,5) kolano jest w x 2,8, goleń 4° od pionu, a kolano już za gryfem. Gryf odsuwa nadmiarowy promień kapsuły uda (8,9 cm + gryf 1,6) wokół stawu kolanowego. Miejsca w kodzie: hinge.ts:68 (rt = 8.9 dla 'centre'), :70 (kapsuła hip–knee), :110–111 (gryf szuka pierwszego kontaktu od przodu). Kolano z tej kapsuły jest kulą 8,9 cm, a GIRTH.thigh przy kolanie to 6,0 (skeleton.ts:20).
- Hantle: kapsuły w z ±30 (hinge.ts:61, HINGE.dbFloorGrip :41) prawie nie dotykają nóg (+1,8 przy kolanie, promień uda średni (9,2+6,0)/2 = 7,6).
