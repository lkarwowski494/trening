# D-1: kąt ramienia w Inverted Row (wiosłowanie w zwisie) — badacz, 08.11.2026

Zakres: kąt ramienia (bark → chwyt) w punkcie dolnym (zwis, ręce proste) i ustawienie łokcia w punkcie górnym (klatka przy drążku), na potrzeby reguły rysunku `zwisStartowy` (`scripts/figures/v2-jakosc.mjs:50-51`, `:467-472`) i odwiedzenia (`:97`, `ODWIEDZENIE_PRZOD['Inverted Row'] = 45`). Repo nie zmieniane.

## Werdykt

1. **Punkt dolny — żadne przeczytane źródło nie podaje kąta ramienia (ani względem pionu, ani względem tułowia).** Źródła mówią jakościowo: ręce w pełni wyprostowane, klatka (mostek / dolna część klatki / górna część brzucha) pod drążkiem. Zgodne: 1 źródło szczebla 3 + 3 szczebla 4 → **ustawienie „drążek nad klatką, ręce proste” = ustalone**.
2. **Proponowana reguła rysunku (uproszczenie, nazwać tak w kodzie):** u = 0 ręka prosta, **odchylona od pionu ku stopom 0–25°, nigdy ku głowie** (drążek nad klatką: od mostka do dolnej części klatki / górnej części brzucha). Liczba wynika z rachunku geometrycznego na opisie źródeł, nie z cytatu:
   - chwyt pionowo nad punktem klatki odległym o d od osi barków, długość bark–chwyt L ≈ 60 cm: odchylenie od pionu α = asin(d·cos θ / L); d = 7 cm (mostek, 15% bark→miednica jak w silniku) → ok. 7°; d = 15 cm (dolna klatka) → ok. 14°; d = 20–25 cm (górna część brzucha) → ok. 19–24° (θ = nachylenie tułowia 10–25°, cos θ ≥ 0,9).
   - spójne z torem: przy obrocie wokół pięt bark przesuwa się ok. 12 cm ku stopom (analiza D-1, `d1-wykonalnosc-2026-11-08.md:10`), więc start „nad dolną klatką / górnym brzuchem” daje na górze kontakt mostkiem — dokładnie to, co mówi Breaking Muscle (start pod dolną klatką/górnym brzuchem, kontakt dolną klatką).
   - Obecny próg `zwisKatDeg: 10` (pion ± 10°) + `zwisMostekCm: 8` jest węższy niż część wspólna źródeł (dopuszcza tylko start nad mostkiem); rozszerzenie do 25° ku stopom nie wychodzi poza źródła.
3. **„Ręka prostopadła do tułowia ±10°” — bez źródła; odradzam jako regułę merytoryczną.** Kąt ramię–tułów = 90° − θ + α zależy od wysokości drążka (θ), której źródła nie ustalają („mniej więcej na wysokości bioder/talii”, wyżej = łatwiej). Dla niskiego drążka (θ ≈ 10–15°) wychodzi ok. 85–100°, dla wysokiego (θ ≈ 25–30°) ok. 70–85°. Jeśli silnikowi wygodniej liczyć względem tułowia, to tylko jako **konwencja rysunku** z przedziałem ok. 70–100°, nie „90 ± 10”.
4. **Punkt górny — ustalone:** klatka dotyka drążka (albo dochodzi do poziomu dłoni); łokcie blisko tułowia, ku bokom/żebrom, nie rozłożone na boki (≥ 2 zgodne źródła szczebla 4 + szczebel 3 dla „klatka do poziomu dłoni”).
5. **Punkt górny — liczba „ok. 45° odwiedzenia”: [OTWARTE].** Żadne przeczytane źródło szczebla 3–4 nie podaje stopni; 45° pojawia się tylko w streszczeniach wyszukiwarki ze stron niskiej jakości (nieprzeczytane / nieuznane). Obecne `ODWIEDZENIE_PRZOD['Inverted Row'] = 45` pozostaje **konwencją rysunku** zgodną kierunkowo z „łokcie blisko tułowia, nie w literę T”.

## Źródła przeczytane 08.11.2026

| # | Źródło (adres) | Szczebel | Cytat (≤ 2 zdania) / miejsce | Co potwierdza |
|---|---|---|---|---|
| S1 | Snarr R.L., Esco M.R., JEPonline 2013;16(6):51-58, https://www.asep.org/asep/asep/JEPonlineDecember2013_Snarr_Esco.pdf | 3 (badanie, czasopismo recenzowane) | s. 52, Introduction: „in a supine position directly beneath the bar with the feet on the floor”; s. 54, Exercise Trials: „a supine bridge directly below the bar (or handles) with the arms fully extended … until the chest reached the level of the hands” | Start: ciało bezpośrednio pod drążkiem, ręce w pełni proste; góra: klatka na poziomie dłoni. Uwaga: w protokole kolana zgięte 90°, stopy płasko (inny wariant niż pięty). |
| S2 | Hevy, https://www.hevyapp.com/exercises/how-to-inverted-row/ | 4 (dokumentacja aplikacji) | „With your arms straight and bar over your chest, extend your body and balance your lower half on your heels.”; „touch the bar with your chest while having your elbows to your sides, but not flared out” | Start: drążek nad klatką, ręce proste; góra: klatka do drążka, łokcie przy bokach. |
| S3 | BarBend (M. Dewar, CSCS), https://barbend.com/inverted-row-guide/ | 4 | Krok ustawienia: „Lay underneath the bar, so it’s in line with your chest.”; „row your chest to the bar” | Start: drążek na linii klatki; góra: klatka do drążka. Brak kąta łokcia. |
| S4 | Breaking Muscle (A. Zachwalinski, CSCS), https://breakingmuscle.com/inverted-row/ | 4 | Ustawienie: dolna część klatki lub górna część brzucha pod drążkiem; „Do not let your elbows flare out too much on your sides.” | Start nieco ku stopom od mostka (górna granica przedziału 25°); kontakt dolną klatką; łokcie blisko tułowia. |
| S5 | ACE Exercise Library #84 (wiosłowanie w podwieszeniu), https://www.acefitness.org/resources/everyone/exercise-library/84/inverted-row/ | 4 | Step 3: „Your elbows should move towards your sides and remain close to your body” | Łokcie blisko tułowia (wariant na taśmach; już w repo jako `ace-84`). |
| S6 | StrengthLog, https://www.strengthlog.com/inverted-row/ | 4 | „high enough for you to be able to hang below it in straight arms, with your heels on the floor”; góra: „until your chest touches the bar” | Zwis na prostych rękach na piętach; klatka do drążka. |
| S7 | Catalyst Athletics #852, https://catalystathletics.com/exercise/852/Inverted-Row/ | 4 | „Keeping your body rigidly extended straight, hang from the bar … pull your body up as far as possible” | Ciało proste, pełny zakres; bez kątów. |
| S8 | Sussex Sport, https://www.sussex.ac.uk/sport/documents/inverted-row.pdf | 5 (materiał trenerski) | „Look out for: … bringing the sternum to the bar” | Góra: mostek do drążka (tylko wskazówka). |

Nieprzeczytane dziś: ExRx BWSupineRow (403; w repo cytowany przez archiwum z 10.05.2025 przy `inv.setup/pull/rigid`, `data/zrodla/cues.json:4187-4227`) — nie liczę go tu jako nowego potwierdzenia kąta. NSCA Kinetic Select i ResearchGate (Snarr, „Exercise Highlight”) — 403. Fitbod — 403.

## Sprzeczności

- Brak sprzeczności kierunkowej. Różnica na szczeblu 4: miejsce drążka na starcie — „nad klatką” (S2, S3; S1 „pod drążkiem”) vs „dolna klatka / górny brzuch” (S4). Część wspólna: drążek nad klatką, od mostka ku dolnej części klatki → odchylenie ramienia od pionu ku stopom 0 do ok. 25° (rachunek wyżej).
- S1 i S5 opisują warianty (kolana zgięte; taśmy) — ustawienie ramion zgodne, ale nie dowodzą wariantu „na piętach”; ten mają S2, S6.

## Otwarte pytania

- [OTWARTE] Liczba odwiedzenia ramienia w punkcie górnym (np. 45°) — brak przeczytanego źródła szczebla 3–4 ze stopniami. Do aplikacji (tekst) nie wchodzi; w rysunku tylko jako konwencja.
- [OTWARTE] Kąt ramię–tułów w punkcie dolnym jako liczba ze źródła — żadne źródło go nie podaje; zależy od wysokości drążka.
- Ponowne odczytanie ExRx BWSupineRow (żywa strona lub archiwum), gdy dostęp zadziała — tylko jako trzecie potwierdzenie ustawienia, nie zmienia werdyktu.
- Do recenzenta figur: przy progu 25° ku stopom sprawdzić na arkuszu ze śladem, że chwyt nie wypada nad brzuchem poniżej pępka (górna granica odpowiada „upper abs” z S4).
