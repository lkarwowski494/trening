# Recenzja niezależna r1 — rodzina v2 `core_standing` (partia 8), 10.11.2026

Recenzent: audytor (bramka 4, L-047 A, L-050). Autor: programista core_standing (partia 8). SHA zamrożony: 847fed98 (gałąź figury/partia-8-core_standing).
Skrót rodziny v2 (`node scripts/zrodla-runtime.mjs --skroty`, liczony przez recenzenta): `cbf3be33b708`. `assignAll()`: 19 ćwiczeń (16 z rysunkiem; bez pozy: Kettlebell Figure 8, Seated Barbell Twist, Spell Caster).

**Werdykt rodziny: do poprawy** (5 × WYSOKIE, 3 × ŚREDNIE, 1 × NISKIE).

## Metoda
- K4: arkusze `scripts/figures/arkusz-slad.mjs` wygenerowane samodzielnie dla 16 ćwiczeń × front i side (32 PNG). Obejrzane w pełnej rozdzielczości: Barbell Side Bend front, Cable Russian Twists side, Landmine Rotation front i side; nakładka (`arkusz-nakladka.mjs`): Kettlebell Windmill front. Pozostałe 27 arkuszy sprawdzone tylko liczbami (poniżej) — **nie oglądane** (limit kontekstu).
- K5–K8 liczbami dla wszystkich 16 × 21 kadrów (`frameAt`, u co 0,05): `checkFrame` (przenikanie, chwyt, podłoga, reach) — 0 problemów we wszystkich; odstęp ciężaru (`odstepCiezaru`) — min. ≥ 1,5 cm (Side Bend (hantel) u = 0,6), brak przenikania; zakresy łokcia/biodra/kolana, przechył i pochylenie tułowia, położenie sztangi/kettlebelli/śladu względem chwytu.
- K14: `git diff origin/integracja-1-1...847fed98 -- tests/` — tylko dopisanie rodziny do list i liczników (mapping 16, strona-eksport 386 → 402, skrot-v2-wynik, figures-v2-data: kierunek kąta) oraz nowy test nakładki. **Brak poluzowań.**

## Znaleziska

| ID | Klasa | Pewność | Ćwiczenie / miejsce | Opis i miara | Realność |
|---|---|---|---|---|---|
| W1 | WYSOKIE | 95% | Kettlebell Windmill, Double Kettlebell Windmill — nakładka `windmillArmStraightRef` | Prowadnica „Górna ręka z ciężarem prosta, nad barkiem” (wm.arm) rysuje się przy **dolnej, wolnej ręce (L)**, nie przy ręce z kettlebellem (R). Przyczyna: `overlayShapes.ts:32` podaje `side: measuredSide(spec)`, a dla wiatraków `measuredSide` = `L` (mierzone biodro). Test nakładki (`tests/figures-v2-nakladka-core-standing.test.tsx:61`) sprawdza tylko, że linia istnieje — brak przypadku „która ręka”. Miara do testu: środek prowadnicy w rzucie z przodu bliżej chwytu R niż L w każdym kadrze. Odpowiedź na pytanie autora (2): problemem nie jest offset 8 cm, tylko strona. | realny — każdy, kto otworzy kartę z nakładką |
| W2 | WYSOKIE | 95% | Barbell Side Bend (front) | Sztanga stoi poziomo i nieruchomo w osi z (środek gryfu z = 0 we wszystkich kadrach), a tułów przechyla się o 28° i przesuwa barki o 23,5 cm w bok: u = 1 bark R y = 125,0 cm, bark L y = 142,9, gryf y = 135,7 → gryf 10,7 cm nad barkiem R i 7,2 cm pod barkiem L; na arkuszu gryf przecina szyję/bark, sylwetka „wysuwa się” spod sztangi. Sztanga na plecach musi przechylać się i przesuwać razem z barkami. Miara: kąt gryfu w rzucie z przodu = przechył linii barków (± 3°) i odległość gryfu od obu barków stała (± 2 cm). | realny |
| W3 | WYSOKIE | 95% | Cable Russian Twists (side, front) — karta własna | Karta: „Oprzyj górę pleców na piłce gimnastycznej, unieś biodra w linię z tułowiem i trzymaj uchwyt na prostych rękach nad klatką”, „Obróć tułów w bok, nie uginając rąk”. Rysunek: siad prosto na piłce (pochylenie tułowia 0°, biodro 119,6°, miednica y = 64,5), łokcie zgięte 66° przez cały ruch, uchwyt przed klatką na wysokości 106,5 cm. Ruch sprzeczny z kartą (pozycja i ręce). Miara: tułów ≈ poziomo (pochylenie ≥ 70° od pionu), biodro ≥ 160°, łokieć ≥ 165°. | realny |
| W4 | WYSOKIE | 90% | Landmine Rotation (front, side) — orientacja sprzętu (K6) | Na końcu gryfu landmine rysowana jest **poprzeczna** sztanga 40 cm (`sztanga`, `dlugosc: 40`, oś z) nieruchoma w środku (c = [30, 100, 0]), a dłonie przesuwają się po niej ± 17 cm. Takiego elementu w tym ćwiczeniu nie ma; koniec gryfu ma iść za dłońmi. Do tego koniec gryfu porusza się tylko ± 17 cm w bok na stałej wysokości 100 cm przy łokciach 108–123° — ruch ledwie widoczny (zakres do potwierdzenia ze źródłem przy poprawce, bez karty własnej). Miara: brak kolidera „bar” poprzecznego; odległość końca gryfu od środka chwytów ≤ 3 cm w każdym kadrze. | realny |
| W5 | WYSOKIE | 90% | Medicine Ball Full Twist — ślad toru (K4, L-050) | Ślad = miednica [0; 89,5; 0] (nieruchomy punkt, 47,9 cm od chwytu), a piłka lekarska w dłoniach przechodzi łuk przed klatką. `contract.ts:324-341` nie obsługuje `pilka_lekarska` (ani `pilka_gimnastyczna` trzymanej) — kod wspólny; dotyczy też 6 póz sled_throw. Miara: ślad ≤ 3 cm od środka piłki / środka chwytów w każdym kadrze. | realny |
| Ś1 | ŚREDNIE | 85% | One-Arm High-Pulley Cable Side Bends, Bosu Ball Cable Crunch With Side Bends — DATA_UI (`poseData.ts`) | Pytanie autora (1): „Opuszczanie/Powrót” z `lowerFirst: true`. W obu ruch u 0 → 1 oddala uchwyt od bloczka (stos ciężaru idzie w górę) — to faza koncentryczna, a dostaje nazwę „Opuszczanie” i tempo opuszczania (`anim.ts:42-43`). Dla Barbell Side Bend, Side Bend (hantel), Weighted Ball Side Bend nazwy są poprawne (ciężar opada). Propozycja: „Skłon”/„Powrót”, `lowerFirst: false` dla dwóch ćwiczeń z wyciągiem. | realny |
| Ś2 | ŚREDNIE | 85% | Russian Twist — karta własna (K11) | Karta (rt.setup): „…ciężar trzymaj przed klatką”; katalog: `loadSource: dumbbell`. Rysunek bez ciężaru (dłonie puste, sprzęt tylko podłoga; ślad = miednica). Ruch i odchylenie 45° zgodne. | realny |
| Ś3 | ŚREDNIE | 85% | Pallof Press, Pallof Press With Rotation — K8 | Łokieć w u = 1 = 180,0° (pełne zablokowanie). Źródło reguły `pallof_wypchniecie` (Mullane 2021 s. 4) mówi „ensuring not to lock out the elbows”; nagłówek `overlay/core_standing.ts` też cytuje „bez blokowania łokci”. Karta PL „do wyprostu rąk” nie przeczy wprost. Miara: łokieć w u = 1 w przedziale ok. 160–175°. | realny |
| N1 | NISKIE | 80% | Kettlebell Windmill, Double KB Windmill — kolana | Kolano strony z ciężarem 158° w staniu i 154° na dole (22–26° zgięcia), druga noga prawie prosta (173°) — karta „kolana tylko lekko ugięte”; zgięcie raczej odwrotnie niż zwykle opisywane. Do sprawdzenia przy poprawce W1 ze źródłami reguły. | brzegowy |

## Bez znalezisk (liczby)
- Side Bend (hantel), Weighted Ball Side Bend: skłon w stronę hantla (przechył 26–28°), pochylenie 0°, skręt 0 → zgodne z sb.plane; ślad = chwyt R (0,0 cm).
- One-Arm High-Pulley Cable Side Bends: skłon od bloczka 26°, ręka nad głową, linka do bloczka; poza nazwą faz (Ś1) bez uwag.
- Russian Twist: odchylenie 45°, skręt ± 38°, plecy proste (zgięcie kręgosłupa 0) — nakładka `twistLeanPlumb`, `twistBackRef` poprawne (rzut z boku).
- Cable Woodchop (z góry R → dół L, skręt +28 → −30°), Cable Judo Flip (z dołu L → góra R), Pallof Press With Rotation (skręt 0 → −30°): kierunki zgodne z bloczkiem; ślad 3,0 cm od chwytu.
- Kettlebell Windmill (ruch): ręka z ciężarem prosta (łokieć 171–173°), chwyt 57–63 cm nad barkiem, biodra w tył i w stronę ciężaru, wolna dłoń do wewnętrznej strony stopy; kettlebell „dzwon: tył” — poprawna orientacja nad głową; drugi kettlebell (Double) „dół”, odstęp od nogi ≥ 4,9 cm.
- Bent Press: hantel prawie w miejscu (y 144 → 158), ciało schodzi pod ciężar, łokieć 34° → 157°, przechył 35°, skręt 40°.
- `checkFrame`: 0 problemów w 16 × 21 kadrach; przenikania ciężar–ciało brak.
- Odrzucenia elementów nakładki w nagłówku `overlay/core_standing.ts`: uzasadnione (skręt niewidoczny w rzutach front/side, strefa „zone” nieobsługiwana, reguły „analogia”/„jedno źródło” bez elementu).

## Niesprawdzone
- 27 arkuszy (poza wymienionymi) nieoglądane wzrokowo — tylko liczby; Bosu Ball Cable Crunch With Side Bends: pozycja (siad na Bosu, tułów −8° → +24°) bez karty i bez przeczytanego źródła — nie oceniono zgodności ze zwykłym wykonaniem.
- Kierunek wzroku (wm.eyes) — silnik go nie rysuje.
