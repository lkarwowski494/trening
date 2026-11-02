# Wskazówki techniki — fala W2, core_floor (z plików W1 core_floor-2 i core_floor-3) (02.11.2026)

Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/`.
Zakres (brief grupy G1, 02.11.2026): (a) ćwiczenia „otwarte” z W1 `core_floor-2.md` i `core_floor-3.md` — od nowa; (b) „gotowe” z W1 bez błędu — błędy (wnioskowane albo ze źródeł).
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` z uzupełnieniami 2–3 (Fitness Volt, Healthline, BarBend — „warunkowo 4”, liczy się konkretna strona z autorem z kwalifikacjami i datą).
Wszystkie strony przeczytane przez WebFetch 02.11.2026. Strony aplikacji treningowych pominięte i nigdzie niezapisane. Cytaty ≤ 1 zdanie.

## 1. Tabela ćwiczeń

| Klucz | Stan | Zdania | Uwagi |
|---|---|---|---|
| Decline Reverse Crunch | gotowe (karta W1 + 1 nowy błąd) | +1 | `core_floor.mis.legSwing`: NASM wprost + ACE #76 (błąd = zaprzeczenie standardu). Wariant: źródła opisują wersję na podłodze (jak w W1) |
| Cable Reverse Crunch | gotowe (karta W1 + 1 nowy błąd; wariant — jak w W1, do oceny audytora) | +1 | jw.; źródła bez linki |
| Suspended Reverse Crunch | gotowe WARUNKOWO (karta W1 + 1 błąd) | +1 | `plank.mis.sag`: ACE #87 wprost (kroki 2 i 3) + TRX — standard „active plank… best plank alignment”; liczenie TRX jako drugiego źródła zależy od uznania „plank alignment” za to samo kryterium (linia ciała) — pytanie 1 w p. 5. Gdy nie — „częściowe” |
| Alternate Heel Touchers | gotowe (nowa karta) | 4 | BarBend (J. Zucker, NCSF CPT, akt. 23.04.2024) + Fitness Volt (autor ACE CPT, MSc, 23.10.2024) |
| Scissor Kick | gotowe (nowa karta) | 4 | Fitness Volt (P. Dale, 25.03.2023 / 11.08.2024) + Healthline (rec. D. Bubnis, NASM-CPT, 01.05.2019). Figura (`poses/core_floor.json`, klatki u=0 i u=0,5: kostki na różnej wysokości, z = ±12 bez skrzyżowania) pokazuje nożyce góra–dół — zgodnie ze źródłami; `note` katalogu („alternately crossed”) temu przeczy → p. 5 pyt. 2 |
| Toe Touchers | otwarte | 0 | nadal tylko ACE #243; Fitness Volt (strona „alternatives”) bez autora i daty → 5; The Gym Group (sieć siłowni) → 5 |
| Stability Ball Knee Tuck | otwarte | 0 | nadal tylko ACE #60; w wynikach tylko serwisy bez autora/aplikacje i prasa lokalna |
| Standing Rope Crunch | otwarte | 0 | nadal tylko ACE #331; wyszukiwanie NASM/ISSA/NSCA bez wyniku |
| Cable Seated Crunch | otwarte | 0 | jw. (ACE #331/#291 = jedna organizacja) |
| Oblique Crunches - On The Floor | otwarte | 0 | jedyny trop szczebla 4 (strona trenerska JMU, „Core Series: Obliques”) — host educ.jmu.edu zablokowany w sieci sesji; reszta: aplikacje, sieci siłowni |
| Crunch - Legs On Exercise Ball, Frog Sit-Ups, Janda Sit-Up, Butt-Ups, Cross-Body Crunch, Crunch - Hands Overhead, Decline Oblique Crunch, Kneeling Cable Crunch With Alternating Oblique Twists, Leg Pull-In, Tuck Crunch, Otis-Up, Seated Flat Bench Leg Pull-In, Weighted Sit-Ups - With Bands, Side Jackknife, Smith Machine Hip Raise, Press Sit-Up, Cocoons, Stomach Vacuum | otwarte — w W2 NIE badane ponownie | 0 | limit kontekstu; kolejność wg briefu (najpierw popularne). Powody z W1 aktualne |

### Blok do wdrożenia

Dla kart W1 (Decline Reverse Crunch, Cable Reverse Crunch, Suspended Reverse Crunch) — tylko nowe `mistakes`; reszta karty bez zmian względem W1.

```json
{
 "Decline Reverse Crunch": {
  "mistakes": [
   {"c": "core_floor.mis.legSwing", "s": [
    ["nasm-best-abs", "Reverse Crunch, „Programming guidance” („Focus on lifting the hips rather than simply swinging the legs.”) (wariant: na podłodze)"],
    ["ace-76", "uwaga po Step 3 (miednica ciągnięta w stronę żeber — błąd = zaprzeczenie standardu) (wariant: na podłodze)"]
   ]}
  ]
 },
 "Cable Reverse Crunch": {
  "mistakes": [
   {"c": "core_floor.mis.legSwing", "s": [
    ["nasm-best-abs", "Reverse Crunch, „Programming guidance” (jw.) (wariant: bez linki)"],
    ["ace-76", "uwaga po Step 3 (jw.; błąd = zaprzeczenie standardu) (wariant: bez linki)"]
   ]}
  ]
 },
 "Suspended Reverse Crunch": {
  "mistakes": [
   {"c": "plank.mis.sag", "s": [
    ["ace-87", "Step 2 (unikać opadania lędźwi i unoszenia bioder) i Step 3 („Avoid any arching or sagging in your low back throughout the range of motion.”)"],
    ["trx-compound-2", "TRX Crunch („come to an active plank”; „flex your feet to enable the best plank alignment”; powrót „to the active plank position”) — błąd = zaprzeczenie standardu, WARUNKOWO (p. 5 pyt. 1)"]
   ]}
  ]
 },
 "Alternate Heel Touchers": {
  "setup": [
   {"c": "core_floor.heelTouch.setup", "s": [
    ["barbend-heel-touches", "How to Do the Heel Touch, krok 1 („Lie on your back with your feet on the floor and your knees bent at a 90-degree angle.”)"],
    ["fv-heel-touchers", "How-to, ustawienie (kolana ugięte pod kątem 90°, stopy płasko na podłodze na szerokość bioder)"]
   ]}
  ],
  "move": [
   {"c": "core_floor.heelTouch.move", "s": [
    ["barbend-heel-touches", "kroki 2–4 (uniesienie górnej części pleców i barków; dłoń do pięty po tej samej stronie, na zmianę)"],
    ["fv-heel-touchers", "kroki 1–4 („Engage your core and lift your shoulders slightly off the ground.”; dłoń do pięty po tej samej stronie, na zmianę)"]
   ]}
  ],
  "tips": [
   {"c": "core_floor.heelTouch.breath", "s": [
    ["barbend-heel-touches", "krok 3 („Inhale, then exhale to reach your right hand to touch your right heel.”)"],
    ["fv-heel-touchers", "Common Mistakes — oddech (wydech przy sięganiu do pięty, wdech przy powrocie)"]
   ]}
  ],
  "mistakes": [
   {"c": "core_floor.mis.neckPull", "s": [
    ["barbend-heel-touches", "Common Heel Touch Mistakes — „Pulling from Your Neck” („Avoid pulling from your neck to keep your upper body slightly lifted.”)"],
    ["fv-heel-touchers", "Common Mistakes — szyja (unoszenie barków przy neutralnej szyi)"]
   ]}
  ]
 },
 "Scissor Kick": {
  "setup": [
   {"c": "core_floor.scissor.setup", "s": [
    ["fv-scissor-kicks", "How to, ustawienie kroki 1–2 („Lie on your back with your legs straight.”; dłonie pod pośladkami)"],
    ["healthline-scissor-kicks", "instrukcja, krok 1 (na plecach, nogi wyprostowane; ręce wzdłuż ciała albo dłonie pod pośladkami)"]
   ]},
   {"c": "core_floor.scissor.lift", "s": [
    ["fv-scissor-kicks", "ustawienie kroki 3–4 („Tilt your pelvis, press your lower back into the floor, and brace your core.”; nogi kilka cali nad podłogą)"],
    ["healthline-scissor-kicks", "instrukcja, kroki 2–3 (dociśnięcie lędźwi do maty; obie nogi 15–30 cm nad podłogą)"]
   ]}
  ],
  "move": [
   {"c": "core_floor.scissor.move", "s": [
    ["fv-scissor-kicks", "ruch, kroki 1–3 (jedna noga do ok. 45°, potem w dół, jednocześnie druga w górę)"],
    ["healthline-scissor-kicks", "ruch („lower one leg toward the floor as you lift the other leg up”)"]
   ]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "core_floor.mis.archBack", "s": [
    ["fv-scissor-kicks", "wskazówki („Stop your set if you feel your lower back lifting off the floor…”)"],
    ["healthline-scissor-kicks", "wskazówki formy („Make sure your back is not arching.”)"]
   ]}
  ]
 }
}
```

Uwagi do bloku:
- `cue-sets.json` ma dla Alternate Heel Touchers `crunch.neck` („…nie ciągnij głowy rękami”) i `crunch.lowBack` — w obu źródłach dłonie są wzdłuż ciała, a lędźwi przy podłodze żadne nie wymienia → nie wpisane (zestaw ogólny nie pasuje). Dla Scissor Kick `db.slow` (jedno źródło na tempo — Healthline; oddech — tylko Fitness Volt) i `mis.jerk` („ciężarem” — ćwiczenie bez obciążenia) — nie wpisane.
- `db.back` pasowałby do Scissor Kick (oba źródła), ale powtarzałby `core_floor.scissor.lift` i błąd `core_floor.mis.archBack` — pominięty celowo.
- Wariant Decline/Cable Reverse Crunch — jak w W1 (`uproszczenie: wariant sprzętu` reverse crunch na podłodze: ruch miednicy względem żeber się nie zmienia; ławka skośna zmienia kąt, linka dokłada opór na nogi).

## 3. Nowe zdania

| id | PL | EN (propozycja) | Ćwiczenia |
|---|---|---|---|
| core_floor.mis.legSwing | Wymachiwanie nogami bez unoszenia miednicy. | Swinging your legs without lifting your hips. | Decline Reverse Crunch, Cable Reverse Crunch (pasuje też do Reverse Crunch) |
| core_floor.heelTouch.setup | Połóż się na plecach, kolana ugięte, stopy płasko na podłodze. | Lie on your back, knees bent, feet flat on the floor. | Alternate Heel Touchers |
| core_floor.heelTouch.move | Unieś barki nad podłogę i na zmianę sięgaj dłonią do pięty po tej samej stronie. | Lift your shoulders off the floor and reach one hand to the heel on the same side, alternating sides. | jw. |
| core_floor.heelTouch.breath | Wydech, gdy sięgasz do pięty. | Breathe out as you reach for your heel. | jw. |
| core_floor.mis.neckPull | Ciągnięcie głowy szyją zamiast unoszenia barków. | Pulling with your neck instead of lifting your shoulders. | jw. |
| core_floor.scissor.setup | Połóż się na plecach z prostymi nogami, dłonie pod pośladkami albo wzdłuż ciała. | Lie on your back with your legs straight and your hands under your glutes or by your sides. | Scissor Kick |
| core_floor.scissor.lift | Dociśnij lędźwie do podłogi i unieś nogi nisko nad nią. | Press your lower back into the floor and lift your legs just off it. | jw. |
| core_floor.scissor.move | Na zmianę unoś jedną nogę wyżej, a drugą opuszczaj w stronę podłogi. | Alternately raise one leg higher while lowering the other toward the floor. | jw. |
| core_floor.mis.archBack | Lędźwie odrywają się od podłogi i wyginają w łuk. | Lower back lifting off the floor and arching. | jw. |

Istniejące zdanie użyte jako błąd: `plank.mis.sag` (Suspended Reverse Crunch).
Uwaga do `core_floor.scissor.lift`: Fitness Volt — „a few inches”, Healthline — „6 to 12 inches”; zdanie bierze część wspólną („nisko”), bez liczby.

## 4. Źródła

| id | adres | organizacja | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|---|
| nasm-best-abs (istn.) | https://www.nasm.org/resource-center/blog/training/best-abs-exercises | NASM | 4 (organizacja certyfikująca; w `sources`) | Reverse Crunch, „Programming guidance” |
| ace-76 (istn.) | https://www.acefitness.org/resources/everyone/exercise-library/76/reverse-crunch/ | ACE | 4 | uwaga po Step 3 (cytat w W1) |
| ace-87 (W1) | https://www.acefitness.org/resources/everyone/exercise-library/87/trx-reg-suspended-knee-tucks/ | ACE | 4 (treść firmowana przez ACE; bez autora i daty) | Step 2, Step 3 |
| trx-compound-2 (nowe) | https://www.trxtraining.com/blogs/news/trx-moves-of-the-week-compound-movements-part-2 | TRX (producent taśm) | 4 tylko dla ćwiczeń na własnym sprzęcie (precedens producentów); treść firmowana przez TRX, data 07.02.2022, podpis „Shopify API” — ta sama seria co `trx-basics` z W1, więc z nim jedno źródło | TRX Crunch (plank, powrót do podporu) |
| barbend-heel-touches (W1) | https://barbend.com/heel-touches/ | BarBend | 4 warunkowo — artykuł o technice; J. Zucker, NCSF CPT (biogram); „Last updated on April 23rd, 2024”; bez „Expert Verified” | How to Do the Heel Touch 1–4; Common Heel Touch Mistakes |
| fv-heel-touchers (nowe) | https://fitnessvolt.com/alternate-heel-touchers-guide/ | Fitness Volt | 4 warunkowo spełnione — autor w podpisie z kwalifikacjami (ACE CPT; MSc Exercise Science), data 23.10.2024; recenzenta brak; na stronie brak ujawnienia afiliacji | How-to (ustawienie, kroki 1–4); Common Mistakes (szyja, oddech) |
| fv-scissor-kicks (nowe) | https://fitnessvolt.com/scissor-kicks/ | Fitness Volt | 4 warunkowo spełnione — P. Dale (biogram: 30 lat jako trener personalny i trener przygotowania siłowego, egzaminator kwalifikacji fitness), opubl. 25.03.2023, akt. 11.08.2024; recenzenta brak; brak ujawnienia afiliacji | How to (ustawienie 1–4, ruch 1–3); wskazówki (lędźwie, oddech) |
| healthline-scissor-kicks (nowe) | https://www.healthline.com/health/scissor-kicks | Healthline | 4 warunkowo spełnione — autor S. Lindberg, „medically reviewed” D. Bubnis, M.S., NASM-CPT, 01.05.2019 | instrukcja (ustawienie, ruch); wskazówki formy |

Niezależność: BarBend i Fitness Volt — różni wydawcy; Fitness Volt i Healthline — różni wydawcy; ACE i TRX — niezależne (sprawdzone w W1: ACE #87 firmowany przez ACE).
Odrzucone w W2 (nie źródła): fitnessvolt.com/substitute-exercises/toe-touchers-alternatives/ (bez autora i daty → 5); thegymgroup.com (sieć siłowni → 5); The Prehab Guys — biblioteka filmów (strona sprzedażowa, nieczytana); fragment Human Kinetics „trx knee tuck…” (adres prowadzi do strony głównej / zamknięcia sklepu kanadyjskiego — treści nie da się przeczytać); PDF IDEA „TRX Beyond the Basics” (404); educ.jmu.edu (host zablokowany w sieci sesji).

## 5. Otwarte i pytania do koordynatora

1. **[DO DECYZJI] Suspended Reverse Crunch — `plank.mis.sag`.** ACE #87 podaje błąd wprost. TRX podaje standard „active plank”, „best plank alignment” i powrót „to the active plank position”. W W1 samo „strong plank” uznano za niewystarczające (nie określa linii ciała). „Plank alignment” odnosi się do ustawienia ciała w podporze, ale nie mówi wprost o biodrach. Jeśli koordynator uzna, że to nie to samo kryterium, karta jest „częściowa” (bez błędu) i `plank.mis.sag` ma jedno źródło (ACE).
2. **[DO DECYZJI] Scissor Kick — wariant.** `note` w `docs/research/equipment/catalog.json` mówi „legs low and alternately crossed” (krzyżowanie w poziomie). Figura v2 i oba źródła pokazują nożyce góra–dół, a Fitness Volt podaje krzyżowanie tylko jako odmianę („Do leg crossovers instead of vertical kicks for variation.”). Karta opisuje wariant z figury. Do poprawy `note` w katalogu (zadanie dla wykonawcy) albo — jeśli katalog ma zostać przy krzyżowaniu — `core_floor.scissor.move` ma jedno źródło.
3. Toe Touchers, Stability Ball Knee Tuck, Standing Rope Crunch, Cable Seated Crunch — nadal po jednym źródle szczebla 4 (ACE). Tropy: strona trenerska JMU (wymaga dopuszczenia hosta educ.jmu.edu), Healthline/Fitness Volt (strony z autorem i datą) dla „cable crunch” i „stability ball knee tuck”.
4. Oblique Crunches - On The Floor — brak źródła szczebla 4 (tylko aplikacje, sieci siłowni, serwisy bez autora).
5. 18 pozostałych ćwiczeń (wiersz zbiorczy w tabeli) — w W2 niebadane; stan i powody z W1.
6. `crunch.neck`, `crunch.lowBack` w zestawie Alternate Heel Touchers oraz `mis.jerk` w Scissor Kick — prawdopodobne błędy zestawu ogólnego (nie pasują do opisu w źródłach); przy wdrożeniu karty własnej zastępuje je blok wyżej.

## 6. Stan

- Zrobione (02.11.2026): błędy dla 3 kart W1 (Decline Reverse Crunch, Cable Reverse Crunch — źródłowe; Suspended Reverse Crunch — warunkowo); nowe karty Alternate Heel Touchers i Scissor Kick; próby dla Toe Touchers, Stability Ball Knee Tuck, Standing Rope Crunch / Cable Seated Crunch, Oblique Crunches (bez wyniku).
- Zostało: 18 ćwiczeń z wiersza zbiorczego; drugie źródło szczebla 4 dla ćwiczeń z pkt 3; decyzje z pkt 1–2.
- Następny krok: Healthline/Fitness Volt (strony z autorem i datą) dla „cable crunch” (stojąc/siedząc) i „stability ball knee tuck”; Cross-Body Crunch i Decline Oblique Crunch tą samą drogą.
- Pułapki: Fitness Volt — sprawdzać autora i datę na każdej stronie (strony „substitute-exercises” bywają bez autora → 5); TRX `trx-basics` i `trx-compound-2` to jedna seria jednej firmy; educ.jmu.edu zablokowany w sieci sesji.
- Błędy wnioskowane w W2: 0 (wszystkie nowe błędy mają źródła; dla reverse crunch reguła „błąd = zaprzeczenie standardu” przy ACE #76).
