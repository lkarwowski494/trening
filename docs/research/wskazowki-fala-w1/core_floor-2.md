# Wskazówki techniki — fala W1, core_floor część 2 (02.11.2026)

Autor: badacz merytoryczny (agent; sesja 1 i sesja 2 tego samego dnia). Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/`. Zakres: 14 kluczy katalogu (brief koordynatora 02.11.2026).
Metoda: `docs/research/33-wskazowki-partia2.md` („Metoda”), wyjątek dla wskazówek techniki z CLAUDE.md (2 zgodne źródła szczebla 4 z różnych organizacji, przeczytane przez WebFetch 02.11.2026).
**Kryteria szczebla 4 — rozstrzygnięcie koordynatora linii 1.1 (02.11.2026), zastosowane w sesji 2 także do wyników sesji 1:** naraz (a) organizacja szkoląca/certyfikująca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść jawnie firmowana przez organizację; (c) nie recenzja afiliacyjna ani marketing. Ocena każdego źródła — pkt 4.
ExRx (403) i web.archive.org (zablokowane) — nieużywane. Strony aplikacji treningowych nie są źródłem — wyniki z takich stron pominięte i nigdzie nie zapisane.

## 1. Tabela

| Klucz | Stan | Zdań | Uwagi |
|---|---|---|---|
| Decline Reverse Crunch | gotowe (wariant) | 2 | istniejące `rcrunch.move`, `rcrunch.hips`; ACE #76 + NASM (oba szczebel 4); źródła opisują wersję na podłodze, NASM wymienia „decline reverse crunch” jako progresję; `mis.jerk` niepotwierdzony |
| Cable Reverse Crunch | gotowe (wariant) — do oceny audytora | 2 | jak wyżej; źródła bez linki (wariant: bez obciążenia); żadne przeczytane źródło nie opisuje wersji z linką |
| Stability Ball Knee Tuck | otwarte (kandydaci) | 0 | po rozstrzygnięciu 02.11: ACE #60 = 4, karta VHI = 5 (bez autora i daty) → każde zdanie ma 1 źródło szczebla 4; było „gotowe” w sesji 1 |
| Crunch - Legs On Exercise Ball | otwarte (kandydaci) | 0 | po rozstrzygnięciu: karta VHI = 5, „Exercise Balls For Dummies” = 5 → 0 źródeł szczebla 4; było „gotowe” w sesji 1 |
| Cable Seated Crunch | otwarte (kandydaci) | 0 | po rozstrzygnięciu: Bowflex liczy się tylko dla własnego sprzętu (maszyna z oporem prętów), nie dla wyciągu; ACE #331 i #291 to jedna organizacja → 1 źródło; było „gotowe (warianty)” |
| Frog Sit-Ups | otwarte (kandydaci) | 0 | sesja 2: Coach (Future plc) = 5 (bez recenzji eksperckiej, linki afiliacyjne), PureGym = 5 (rozstrzygnięcie) |
| Janda Sit-Up | otwarte (kandydaci) | 0 | sesja 2: Breaking Muscle = 5 (rozstrzygnięcie), strona prywatna C. Bassa = 5; twierdzenia o zginaczach bioder i kręgosłupie → otwarte |
| Alternate Heel Touchers | otwarte (kandydat) | 0 | sesja 2: BarBend (artykuł o technice = 4) — jedno źródło; Cal Poly Pomona 404, JMU 503 |
| Butt-Ups | otwarte | 0 | sesja 2: tylko aplikacje, serwisy komercyjne i platforma fizjoterapeutyczna |
| Cross-Body Crunch | otwarte | 0 | sesja 2: ponowna próba bez wyniku (JMU 503, podręcznik UQ 403) |
| Crunch - Hands Overhead | otwarte | 0 | brak źródła szczebla 4 |
| Decline Oblique Crunch | otwarte | 0 | sesja 2: wyszukiwanie ISSA/NASM/BarBend bez wyniku |
| Kneeling Cable Crunch With Alternating Oblique Twists | otwarte | 0 | brak źródła ze skrętem; źródła bez skrętu = analogia |
| Leg Pull-In | otwarte | 0 | sesja 2: tylko aplikacje i serwisy komercyjne; zestaw ogólny podejrzany |

## 2. Blok do `exercises` (tylko gotowe)

```json
{
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

Uwaga do `ace-331` (przeczytany ponownie w sesji 2, 02.11.2026): strona „Standing Crunch” nie ma sekcji „Starting Position” ani numerowanych kroków — cały opis to jeden akapit (ustawienie: „the hips straight with the knees slightly bent”, wyciąg w najwyższym położeniu, lina przy uszach; ruch: „Focus on rolling the rib cage down against the pull of the cable and slowly returning to the top.”). Druga połowa `cc.ribs` („biodra zostają w miejscu”) ma w ACE #331 tylko pośrednie oparcie (biodra wyprostowane w ustawieniu); wprost mówi to tylko Bowflex. Miejsce cytatu w `data/zrodla/cues-zestawy.json` należy poprawić na „jedyny akapit opisu” (zadanie dla wykonawcy, nie dla badacza).

## 3. Nowe zdania

Brak zdań w gotowych ćwiczeniach — oba używają istniejących `rcrunch.move`, `rcrunch.hips`.

Zdania-kandydaci (NIE do `lib/`; wejdą, gdy znajdzie się drugie źródło szczebla 4 — pkt 5):

| id | PL | EN | Ćwiczenie |
|---|---|---|---|
| core_floor.ballTuck.setup | Połóż się brzuchem na piłce i przejdź na dłoniach do przodu, aż piłka znajdzie się pod goleniami albo kolanami. | Lie face down on the ball and walk your hands forward until the ball sits under your shins or knees. | Stability Ball Knee Tuck |
| core_floor.ballTuck.move | Przyciągaj kolana do klatki, tocząc piłkę w stronę dłoni. | Pull your knees toward your chest, rolling the ball toward your hands. | jw. |
| core_floor.legsBall.setup | Połóż się na plecach, łydki oprzyj na piłce, dłonie przy głowie. | Lie on your back with your lower legs resting on the ball and your hands by your head. | Crunch - Legs On Exercise Ball |
| core_floor.legsBall.move | Unieś barki i górną część pleców od podłogi. | Lift your shoulders and upper back off the floor. | jw. |
| core_floor.legsBall.squeeze | Napnij brzuch i przytrzymaj piłkę nogami. | Brace your abs and hold the ball with your legs. | jw. |
| core_floor.legsBall.neck | Szyja luźno, głowa w jednej linii z tułowiem. | Keep your neck relaxed and your head in line with your torso. | jw. (dawniej `core_floor.neckRelaxed`, przemianowane wg briefu) |
| core_floor.frog.setup | Połóż się na plecach, złącz stopy podeszwami i pozwól kolanom opaść na boki; ręce wyciągnij za głowę. | Lie on your back, put the soles of your feet together and let your knees drop out to the sides; reach your arms overhead. | Frog Sit-Ups |
| core_floor.frog.move | Napnij brzuch i unieś tułów, sięgając dłońmi w stronę stóp. | Brace your abs and sit up, reaching your hands toward your feet. | jw. (+ istniejące `rot.slow` na powrót) |
| core_floor.frog.easier | Za ciężko? Trzymaj ręce przy klatce. | Too hard? Keep your arms at your chest. | jw. |
| core_floor.janda.move | Unosząc tułów, dociskaj pięty do podłogi i ciągnij je do siebie, napinając tył ud i pośladki. | As you curl up, press your heels into the floor and pull them toward you, tightening your hamstrings and glutes. | Janda Sit-Up |

## 4. Źródła i ocena szczebla (kryteria koordynatora 02.11.2026)

| id | Adres | Organizacja | (a) | (b) | (c) | Szczebel |
|---|---|---|---|---|---|---|
| ace-60 | https://www.acefitness.org/resources/everyone/exercise-library/60/stability-ball-knee-tucks/ | ACE | tak — certyfikuje trenerów | treść firmowana przez ACE | tak | 4 |
| ace-76 | (już w `sources`) | ACE | tak | tak | tak | 4 |
| ace-291 | https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/ | ACE | tak | tak | tak | 4 (ta sama organizacja co ace-331 — razem jedno źródło) |
| ace-331 | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | ACE; miejsce: jedyny akapit opisu (przeczytany ponownie 02.11.2026) | tak | tak | tak | 4 |
| nasm-best-abs | (już w `sources`) | NASM | tak | tak | tak | 4 |
| vhi-hattiesburg-prone-knee-tuck | https://iris.hattiesburgclinic.com/patadv/exkit/Stability%20Ball/English/0450000216co080m_English.html | karta VHI na serwerze Hattiesburg Clinic | nie wykazano — VHI to dostawca kart ćwiczeń, nie organizacja szkoląca ani serwis z recenzją; strona nie nosi nawet marki kliniki | nie — tylko „Copyright © VHI”, bez autora i daty (przeczytane ponownie 02.11.2026) | tak | 5 — nie liczy się |
| vhi-hattiesburg-ball-basic-crunch | https://iris.hattiesburgclinic.com/patadv/exkit/Stability%20Ball/English/0450000196co070m_English.html | jw., „Basic Crunch” | jw. | jw. (karta tego samego typu) | tak | 5 — nie liczy się |
| hku-hlthfit-ball | https://cse.hku.hk/document/hlthfit_StabilityBall.pdf | HKU CSE (centrum sportu uczelni) | nie — centrum sportu uczelni, nie organizacja szkoląca | firmowane przez HKU | tak | 5; i tak tylko rysunek, źródło pomocnicze |
| dummies-exercise-balls-crunch | https://www.dummies.com/article/how-to-do-abdominal-crunches-with-an-exercise-ball-206649 | L. Chabut, „Exercise Balls For Dummies” (Wiley) | nie wykazano — poradnik instruktorki w wydawnictwie ogólnym, brak informacji o recenzji eksperckiej; nie Human Kinetics, autorka nie NSCA ani naukowiec | autor tak | nie sprawdzono | 5 — nie liczy się |
| bowflex-2-manual-p49 | https://www.manualslib.com/manual/19974/Bowflex-2.html?page=49 | instrukcja Bowflex 2 (kopia w serwisie z instrukcjami) | tak — producent, ale tylko dla własnego sprzętu (maszyna z oporem prętów) | firmowane przez Bowflex; kopia u strony trzeciej, wierność nieweryfikowana | tak (instrukcja, nie reklama) | 4 tylko dla ćwiczeń na maszynie Bowflex; dla wyciągu (Cable Seated Crunch) — nie liczy się |
| coach-frog-situp | https://www.coachweb.com/abs-exercies/5863/the-frog-sit-up-is-murder-on-the-abs | magazyn Coach (Future plc), N. Harris-Fry, „last updated 10 May 2023” | nie — redakcja bez wskazanej recenzji eksperckiej, autor dziennikarz | tak | nie — strona deklaruje prowizje afiliacyjne | 5 — nie liczy się |
| puregym-butterfly-situps | https://www.puregym.com/exercises/abs/butterfly-sit-ups/ | PureGym | — | — | — | 5 (rozstrzygnięcie koordynatora) |
| breakingmuscle-janda | https://breakingmuscle.com/save-your-spine-and-forget-the-ghd-enter-the-janda-sit-up/ | Breaking Muscle, C. Marker (PhD, CSCS) | — | — | — | 5 (rozstrzygnięcie; nigdy niezależne od BarBend) |
| cbass-janda | https://cbass.com/HardestSitup.htm | strona prywatna C. Bassa (2000) | nie — strona prywatna autora | autor i rok tak | tak | 5 — nie liczy się |
| barbend-heel-touches | https://barbend.com/heel-touches/ | BarBend, J. Zucker (NCSF CPT) | artykuł o technice | autor tak | — | 4 (rozstrzygnięcie: BarBend 4 tylko artykuły o technice) |

Propozycje `orgs`: brak nowych do dodania (sesja 1 proponowała VHI, Wiley, Bowflex — wycofane dla tego pliku; Bowflex można dodać jako „maker” tylko dla ćwiczeń na jego maszynach).

## 5. Otwarte

Kandydaci — zdania z pkt 3, którym brakuje drugiego źródła szczebla 4:
- Stability Ball Knee Tuck: `core_floor.ballTuck.setup` — ACE #60 Step 2 („Walk your hands forward… until your thighs or knees rest on the ball”); `core_floor.ballTuck.move` — ACE #60 Step 3 („slowly pull your knees towards your chest, rolling the ball forward”). Karta VHI zgodna, ale szczebel 5. Także `plank.brace`, `plank.mis.sag` z zestawu ogólnego — tylko ACE #60.
- Crunch - Legs On Exercise Ball: wszystkie 4 zdania mają tylko VHI + książkę (oba 5). Zestaw ogólny (`crunch.lowBack`, `crunch.neck`, `crunch.move`, `mis.jerk`) — bez źródła szczebla 4.
- Cable Seated Crunch: `cc.ribs`, `cc.slow` — tylko ACE (#331 stojąc z liną; #291 maszyna) = jedna organizacja. Trop: producent wyciągów z instrukcją do ćwiczenia „cable crunch” na własnym sprzęcie; NASM/ISSA. `mis.jerk` — bez źródła.
- Frog Sit-Ups: `core_floor.frog.setup`, `.move`, `.easier` + `rot.slow` — zgodne Coach (sekcja „How To Do The Frog Sit-Up”) i PureGym („How To Do Butterfly Sit Ups”, kroki 1–5), oba szczebel 5. Zestaw `crunch.*` nie pasuje (źródła opisują pełny siad z rękami za głową).
- Janda Sit-Up: `core_floor.janda.move` — Breaking Muscle, sekcja „How to Do a Janda Sit Up” („…performing a crunch while actively driving the heel into the ground.”) i C. Bass, sekcja „Bungee Cords Help”, akapit 3 („squeeze the glutes and pull your calves back against the roller pads with the hamstrings”) — oba szczebel 5. Twierdzenia, że ruch „wyłącza zginacze bioder” albo „chroni dolny odcinek pleców” — o działaniu/zdrowiu, niepotwierdzone (sam Marker przytacza krytykę) → nie do aplikacji. Materiałów uczelni ani fizjoterapii nie znaleziono.
- Alternate Heel Touchers: BarBend, „How to Do the Heel Touch”, kroki 1–4 (leżenie, kolana ugięte; uniesione barki i głowa, lędźwie przy podłodze; na przemian dłoń do pięty, zgięcie w bok; powoli, z kontrolą) i „Common Heel Touch Mistakes” („Pulling from Your Neck”) — jedno źródło szczebla 4; brak drugiego (Cal Poly Pomona 404, JMU 503, artykuł medialny przekierowany na stronę główną, blog producenta 403).

Platforma fizjoterapeutyczna (już w `orgs`): w wynikach dla Butt-Ups, Leg Pull-In i Cross-Body Crunch — nieczytana i nieliczona wg briefu; decyzja koordynatora linii (rozstrzygnięcie z 02.11 jej nie obejmuje).

Inne:
- Cable Reverse Crunch, Decline Reverse Crunch: „gotowe” opiera się na regule wariantu; jeśli audytor uzna, że ławka skośna albo linka zmieniają ćwiczenie, oba wracają do „otwarte”. `mis.jerk` — NASM („Slow, controlled reps are preferred over momentum”) to wskazówka tempa, jedno źródło.
- Leg Pull-In: zestaw `rcrunch.hips` + `db.slow` — `db.slow` pochodzi z dead buga, prawdopodobnie analogia; bez źródła szczebla 4.
- Kneeling Cable Crunch With Alternating Oblique Twists: `cc.slow` — źródła bez skrętu = analogia (i po rozstrzygnięciu i tak tylko ACE).
- Cross-Body Crunch, Decline Oblique Crunch, Crunch - Hands Overhead: zestaw `crunch.*` bez źródeł szczebla 4. Tropy: JMU Exercise and Movement Center (`cisat.jmu.edu/kin/emc/documents/…core fitness.pdf`, „Tic Tac Toe_core training.pdf” — 503 w obu sesjach; uczelnia — ocenić kryteriami po odczycie), University of Queensland, podręcznik „exercise delivery” (`uq.pressbooks.pub/exercisedelivery/chapter/oblique-crunch/` — 403), ISSA i NFPT (nie przeszukane wprost), BarBend (artykuły o technice).
- Butt-Ups: nazwa bywa używana dla różnych ćwiczeń (podpór na przedramionach z unoszeniem bioder; leżenie na plecach z wypychaniem bioder) — przed recenzją ruchu trzeba ustalić wariant katalogu.

## 6. Stan

- Sesja 1 (02.11.2026): 5 „gotowych”, 6 nowych zdań.
- Sesja 2 (02.11.2026): zbadane Frog Sit-Ups, Janda Sit-Up, Butt-Ups; ponowione Cross-Body Crunch, Alternate Heel Touchers, Leg Pull-In, Decline Oblique Crunch, uczelniane PDF (404/503/403). ACE #331 przeczytany ponownie — miejsce: jedyny akapit opisu (pkt 2). `core_floor.neckRelaxed` → `core_floor.legsBall.neck`. Zastosowane rozstrzygnięcie koordynatora o szczeblach: VHI, Wiley/Dummies, Coach, PureGym, Breaking Muscle, strona C. Bassa, HKU CSE = 5; Bowflex = 4 tylko dla własnego sprzętu → Stability Ball Knee Tuck, Crunch - Legs On Exercise Ball, Cable Seated Crunch cofnięte do „otwarte (kandydaci)”.
- Razem: 2 gotowe (Decline Reverse Crunch, Cable Reverse Crunch — wariant, istniejące zdania), 12 otwartych (6 z kandydatami w pkt 5); 0 nowych zdań do `lib/`, 10 zdań-kandydatów.
- Zostało: drugie źródło szczebla 4 dla kandydatów (najbliżej: Stability Ball Knee Tuck i Alternate Heel Touchers — każdemu brakuje jednego źródła; szukać w ISSA, NFPT z autorem i datą, BarBend o technice, NASM); Crunch - Hands Overhead i Kneeling Cable Crunch… — nie ponawiane w sesji 2.
- Następny krok: przeszukać ISSA/NFPT/NASM/BarBend dla: stability ball knee tuck, heel touches, cable crunch, frog/butterfly sit-up; ponowić JMU i UQ.
- Pułapki: ExRx 403; strony aplikacji dominują w wynikach — pomijać; muscleandstrength.com i uq.pressbooks.pub — 403; livestrong.com przekierowuje na inną stronę główną; karty VHI bez autora i daty (szczebel 5); ACE — wiele stron to jedna organizacja.
