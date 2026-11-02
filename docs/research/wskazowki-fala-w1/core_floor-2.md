# Wskazówki techniki — fala W1, core_floor część 2 (02.11.2026)

Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/`. Zakres: 14 kluczy katalogu (brief koordynatora 02.11.2026).
Metoda: `docs/research/33-wskazowki-partia2.md` („Metoda”), wyjątek dla wskazówek techniki z CLAUDE.md (2 zgodne źródła szczebla 4 z różnych organizacji, przeczytane przez WebFetch 02.11.2026).
ExRx (403) i web.archive.org (zablokowane) — nieużywane. Strony aplikacji treningowych nie są źródłem (uzupełnienie briefu 02.11.2026) — wyniki wyszukiwania z takich stron pominięte i nigdzie nie zapisane.

## 1. Tabela

| Klucz | Stan | Zdań | Uwagi |
|---|---|---|---|
| Stability Ball Knee Tuck | gotowe | 2 | ACE #60 + klinika (VHI) + rysunek HKU; zestaw ogólny (`plank.brace`, `plank.mis.sag`) niepotwierdzony — pkt 5 |
| Crunch - Legs On Exercise Ball | gotowe | 4 | klinika (VHI) + książka poradnikowa (Wiley); zestaw ogólny częściowo niepotwierdzony — pkt 5 |
| Cable Seated Crunch | gotowe (warianty) | 2 | istniejące `cc.ribs`, `cc.slow`; źródła to warianty: stojąc z linką (ACE #331), siedząc na maszynie (Bowflex, ACE #291); `mis.jerk` niepotwierdzony |
| Decline Reverse Crunch | gotowe (wariant) | 2 | istniejące `rcrunch.move`, `rcrunch.hips`; źródła opisują wersję na podłodze, NASM wymienia „decline reverse crunch” jako progresję tego ćwiczenia; `mis.jerk` niepotwierdzony |
| Cable Reverse Crunch | gotowe (wariant) — do oceny audytora | 2 | jak wyżej; źródła bez linki (wariant: bez obciążenia); żadne przeczytane źródło nie opisuje wersji z linką |
| Cross-Body Crunch | otwarte | 0 | brak 2 przeczytanych źródeł szczebla 4 |
| Alternate Heel Touchers | otwarte | 0 | jw.; uczelniane PDF niedostępne (404/503) |
| Crunch - Hands Overhead | otwarte | 0 | brak źródła szczebla 4 |
| Decline Oblique Crunch | otwarte | 0 | brak źródła szczebla 4 |
| Kneeling Cable Crunch With Alternating Oblique Twists | otwarte | 0 | brak źródła ze skrętem; źródła bez skrętu = analogia |
| Leg Pull-In | otwarte | 0 | brak źródła szczebla 4; zestaw ogólny podejrzany |
| Frog Sit-Ups | otwarte | 0 | nie badane w tej sesji (limit kontekstu); wcześniej (docs/research/25-biblioteka/L6-zrodla.md) „brak źródła” |
| Janda Sit-Up | otwarte | 0 | jw. |
| Butt-Ups | otwarte | 0 | jw.; `data/zrodla/figury-sens.json`: opis tylko w serwisach komercyjnych |

## 2. Blok do `exercises` (tylko gotowe)

```json
{
 "Stability Ball Knee Tuck": {
  "setup": [
   {"c": "core_floor.ballTuck.setup", "s": [
    ["ace-60", "Step 2 („Walk your hands forward… until your thighs or knees rest on the ball”)"],
    ["vhi-hattiesburg-prone-knee-tuck", "instrukcja, zdanie 1 („walk forward on ball until it rests under shins”)"],
    ["hku-hlthfit-ball", "s. 1, rysunki „SB Jackknife (knees start on ball)” / „(ankles start on ball)” — tylko rysunek, źródło pomocnicze"]
   ]}
  ],
  "move": [
   {"c": "core_floor.ballTuck.move", "s": [
    ["ace-60", "Step 3 („slowly pull your knees towards your chest, rolling the ball forward”)"],
    ["vhi-hattiesburg-prone-knee-tuck", "instrukcja, zdanie 2 („Roll ball toward hands by bringing knees toward chest”)"]
   ]}
  ],
  "tips": [],
  "mistakes": []
 },
 "Crunch - Legs On Exercise Ball": {
  "setup": [
   {"c": "core_floor.legsBall.setup", "s": [
    ["vhi-hattiesburg-ball-basic-crunch", "instrukcja, zdanie 1 („Lie supine with legs on top of ball, hands at head.”)"],
    ["dummies-exercise-balls-crunch", "krok 1 („Lying on the floor, rest your lower legs on the ball.”) i krok o dłoniach („With your hands on either side of your head…”)"]
   ]}
  ],
  "move": [
   {"c": "core_floor.legsBall.move", "s": [
    ["vhi-hattiesburg-ball-basic-crunch", "instrukcja, zdanie 3 („Then raise shoulders and upper back toward ceiling.”)"],
    ["dummies-exercise-balls-crunch", "krok o unoszeniu barków („…slowly lift your shoulders from the floor toward your knees”)"]
   ]}
  ],
  "tips": [
   {"c": "core_floor.legsBall.squeeze", "s": [
    ["vhi-hattiesburg-ball-basic-crunch", "instrukcja, zdanie 2 („Tighten abdominals, contract hamstrings, and squeeze ball.”)"],
    ["dummies-exercise-balls-crunch", "krok 2 („As you tighten your abdominals, grasp the ball between your legs…”)"]
   ]},
   {"c": "core_floor.neckRelaxed", "s": [
    ["vhi-hattiesburg-ball-basic-crunch", "instrukcja („Keep head and neck neutral.”)"],
    ["dummies-exercise-balls-crunch", "krok o szyi („Relax your neck as you curl up into a crunch.”)"]
   ]}
  ],
  "mistakes": []
 },
 "Cable Seated Crunch": {
  "setup": [],
  "move": [
   {"c": "cc.ribs", "s": [
    ["ace-331", "opis („rolling the rib cage down against the pull of the cable”; biodra bez ruchu) (wariant: stojąc)"],
    ["bowflex-2-manual-p49", "s. 49 Seated (Resisted) Abdominal Crunch („curl only your torso, slowly moving your ribs toward your hips”; „without moving the hips”) (wariant: siedząc na ławce maszyny, plecy odchylone)"]
   ]}
  ],
  "tips": [
   {"c": "cc.slow", "s": [
    ["ace-331", "opis („slowly returning to the top”) (wariant: stojąc)"],
    ["bowflex-2-manual-p49", "s. 49 („Slowly reverse the motion returning to the starting position”) (wariant: maszyna)"],
    ["ace-291", "opis („Return slowly to the starting position.”) (wariant: maszyna z wybieranym ciężarem)"]
   ]}
  ],
  "mistakes": []
 },
 "Decline Reverse Crunch": {
  "setup": [],
  "move": [
   {"c": "rcrunch.move", "s": [
    ["ace-76", "Step 2–3 („slowly raise your hips off the mat”; „lower your spine back towards the mat in a controlled fashion”) (wariant: na podłodze)"],
    ["nasm-best-abs", "Reverse Crunch (kontrola fazy opuszczania; w „progressions” wymieniony „decline reverse crunch”) (wariant: na podłodze)"]
   ]}
  ],
  "tips": [
   {"c": "rcrunch.hips", "s": [
    ["ace-76", "uwaga po Step 3 („the emphasis… should be on pulling your pelvis upwards towards your rib cage”) (wariant: na podłodze)"],
    ["nasm-best-abs", "Reverse Crunch („Focus on lifting the hips rather than simply swinging the legs.”) (wariant: na podłodze)"]
   ]}
  ],
  "mistakes": []
 },
 "Cable Reverse Crunch": {
  "setup": [],
  "move": [
   {"c": "rcrunch.move", "s": [
    ["ace-76", "Step 2–3 (jw.) (wariant: bez linki)"],
    ["nasm-best-abs", "Reverse Crunch (kontrola fazy opuszczania) (wariant: bez linki)"]
   ]}
  ],
  "tips": [
   {"c": "rcrunch.hips", "s": [
    ["ace-76", "uwaga po Step 3 (jw.) (wariant: bez linki)"],
    ["nasm-best-abs", "Reverse Crunch (jw.) (wariant: bez linki)"]
   ]}
  ],
  "mistakes": []
 }
}
```

Uwaga do `ace-76`: przy Reverse Crunch w cues.json źródło ma inne „miejsce”; cytaty wyżej przeczytane ponownie 02.11.2026 (Starting Position, Step 2, Step 3 i uwaga końcowa bez nagłówka).

## 3. Nowe zdania

| id | PL | EN |
|---|---|---|
| core_floor.ballTuck.setup | Połóż się brzuchem na piłce i przejdź na dłoniach do przodu, aż piłka znajdzie się pod goleniami albo kolanami. | Lie face down on the ball and walk your hands forward until the ball sits under your shins or knees. |
| core_floor.ballTuck.move | Przyciągaj kolana do klatki, tocząc piłkę w stronę dłoni. | Pull your knees toward your chest, rolling the ball toward your hands. |
| core_floor.legsBall.setup | Połóż się na plecach, łydki oprzyj na piłce, dłonie przy głowie. | Lie on your back with your lower legs resting on the ball and your hands by your head. |
| core_floor.legsBall.move | Unieś barki i górną część pleców od podłogi. | Lift your shoulders and upper back off the floor. |
| core_floor.legsBall.squeeze | Napnij brzuch i przytrzymaj piłkę nogami. | Brace your abs and hold the ball with your legs. |
| core_floor.neckRelaxed | Szyja luźno, głowa w jednej linii z tułowiem. | Keep your neck relaxed and your head in line with your torso. |

`core_floor.neckRelaxed` — id bez przyrostka ćwiczenia, bo zdanie jest ogólne; przy kolizji z częścią 1/3 zmienić na `core_floor.legsBall.neck`. Istniejące zdania użyte: `cc.ribs`, `cc.slow`, `rcrunch.move`, `rcrunch.hips`.

## 4. Nowe źródła

| id | Adres | Organizacja | Szczebel |
|---|---|---|---|
| ace-60 | https://www.acefitness.org/resources/everyone/exercise-library/60/stability-ball-knee-tucks/ | ACE | 4 |
| ace-291 | https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/ | ACE | 4 |
| ace-331 | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | ACE (zaproponowane w docs/33; sprawdzić, czy jest w `sources` — cytat za `data/zrodla/cues-zestawy.json`, nie czytany ponownie w tej sesji) | 4 |
| vhi-hattiesburg-prone-knee-tuck | https://iris.hattiesburgclinic.com/patadv/exkit/Stability%20Ball/English/0450000216co080m_English.html | Hattiesburg Clinic — karty ćwiczeń dla pacjentów (treść © VHI), „Prone Knee Tuck” | 4 (PROPOZYCJA) |
| vhi-hattiesburg-ball-basic-crunch | https://iris.hattiesburgclinic.com/patadv/exkit/Stability%20Ball/English/0450000196co070m_English.html | jw., „Basic Crunch” (nogi na piłce) | 4 (PROPOZYCJA) |
| hku-hlthfit-ball | https://cse.hku.hk/document/hlthfit_StabilityBall.pdf | HKU CSE (org już w docs/33) | 4 |
| dummies-exercise-balls-crunch | https://www.dummies.com/article/how-to-do-abdominal-crunches-with-an-exercise-ball-206649 | L. Chabut, „Exercise Balls For Dummies” (Wiley) — fragment książki | 4 (PROPOZYCJA; książka poradnikowa instruktorki, nie podręcznik naukowy) |
| bowflex-2-manual-p49 | https://www.manualslib.com/manual/19974/Bowflex-2.html?page=49 | Bowflex — instrukcja właściciela „Bowflex 2”, s. 49 (kopia w serwisie z instrukcjami) | 4 (producent sprzętu) |

Propozycje `orgs`:
- „Hattiesburg Clinic / VHI” — materiały edukacyjne kliniki dla pacjentów (karty ćwiczeń VHI), szczebel 4, kind „site”; do decyzji audytora (jak WebMD Ignite w docs/33).
- „Wiley — For Dummies (L. Chabut)” — książka poradnikowa, szczebel 4, kind „site” (albo „book”, jeśli schemat pozwala).
- „Bowflex” — instrukcja producenta sprzętu, szczebel 4, kind „maker”. Uwaga: czytana kopia w serwisie manualslib, nie strona producenta.

## 5. Otwarte

Możliwe błędy zestawu ogólnego (zdania w `cue-sets.json` bez potwierdzenia dla tego ćwiczenia):
- Stability Ball Knee Tuck: `plank.brace`, `plank.mis.sag` — tylko ACE #60 („Avoid arching (sagging) your lower back…”); drugie źródło nie znalezione.
- Crunch - Legs On Exercise Ball: `crunch.lowBack` — tylko VHI („Keep low and middle back on floor”); `crunch.neck` w części „nie ciągnij głowy rękami” — bez źródła (zastąpione `core_floor.neckRelaxed`); `crunch.move` — „wracaj powoli” tylko w książce; `mis.jerk` — bez źródła.
- Cable Seated Crunch, Decline Reverse Crunch, Cable Reverse Crunch: `mis.jerk` — żadne przeczytane źródło nie mówi tego wprost (NASM: „Slow, controlled reps are preferred over momentum” to wskazówka tempa, nie błąd — jedno źródło).
- Leg Pull-In: zestaw `rcrunch.hips` + `db.slow` — ćwiczenie zaczyna się z nogami wyprostowanymi (przyciąganie kolan), `db.slow` pochodzi z dead buga — prawdopodobnie analogia; bez źródła szczebla 4.
- Kneeling Cable Crunch With Alternating Oblique Twists: `cc.slow` — źródła (ACE #331, Bowflex) bez skrętu; ze skrętem to analogia.
- Alternate Heel Touchers, Cross-Body Crunch, Decline Oblique Crunch, Crunch - Hands Overhead: zestaw `crunch.*` — brak źródeł szczebla 4 dla tych ćwiczeń.

Powody „otwarte” i dalsze tropy:
- Cross-Body Crunch, Alternate Heel Touchers, Crunch - Hands Overhead, Decline Oblique Crunch: w wynikach wyszukiwania tylko strony aplikacji i serwisy komercyjne. Tropy: uczelniane PDF z ćwiczeniami brzucha (Cal Poly Pomona `cpp.edu/health/docs/abdominals.pdf` — 404; James Madison University, Exercise and Movement Center, karty „core fitness” — 503 dnia 02.11.2026) — ponowić później.
- Physitrack (platforma fizjoterapeutyczna; org już w cues.json) ma strony dla „crunch – elbow to knee” i crunch z nogami na piłce — nieliczone wg uzupełnienia briefu (strony aplikacji). Pytanie do koordynatora: czy Physitrack, już obecny w `orgs`, wolno liczyć.
- Cable Reverse Crunch, Decline Reverse Crunch: „gotowe” opiera się na regule wariantu; jeśli audytor uzna, że ławka skośna albo linka zmieniają ćwiczenie, oba wracają do „otwarte”.
- Frog Sit-Ups, Janda Sit-Up, Butt-Ups: nie szukane w tej sesji; wcześniejsze rundy nie znalazły źródła szczebla ≤ 4.

## 6. Stan

- Zrobione (02.11.2026): 5 gotowych (Stability Ball Knee Tuck, Crunch - Legs On Exercise Ball, Cable Seated Crunch, Decline Reverse Crunch, Cable Reverse Crunch — trzy ostatnie na zasadzie wariantu), 6 nowych zdań; 9 otwartych.
- Zostało: Frog Sit-Ups, Janda Sit-Up, Butt-Ups (nie szukane); ponowne próby dla Cross-Body Crunch, Alternate Heel Touchers, Decline Oblique Crunch, Crunch - Hands Overhead, Leg Pull-In, Kneeling Cable Crunch With Alternating Oblique Twists.
- Następny krok: ponowić PDF JMU/Cal Pomona; przeszukać instrukcje producentów ławek skośnych i wyciągów (np. instrukcje ławek do brzuszków — ćwiczenia z ławką skośną) oraz karty VHI w innych klinikach (zestaw „Strength Training”, „Core”).
- Pułapki: ExRx 403; strony aplikacji w wynikach wyszukiwania dominują — pomijać; karty VHI w Hattiesburg są osiągalne pojedynczo (indeks katalogu zwraca 403, podstrony z wyszukiwarki działają); PDF HKU to same rysunki (tylko źródło pomocnicze).
