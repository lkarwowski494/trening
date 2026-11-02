# Wskazówki techniki — fala W1, core_floor część 2 (02.11.2026)

Autor: badacz merytoryczny (agent; sesja 1, sesja 2 i uzupełnienie 2 tego samego dnia). Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/`. Zakres: 14 kluczy katalogu (brief koordynatora 02.11.2026).
Metoda: `docs/research/33-wskazowki-partia2.md` („Metoda”), wyjątek dla wskazówek techniki z CLAUDE.md (2 zgodne źródła szczebla 4 z różnych organizacji, przeczytane przez WebFetch 02.11.2026).
**Kryteria szczebla 4 — rozstrzygnięcie koordynatora linii 1.1 (02.11.2026), zastosowane w sesji 2 także do wyników sesji 1:** naraz (a) organizacja szkoląca/certyfikująca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść jawnie firmowana przez organizację; (c) nie recenzja afiliacyjna ani marketing. Ocena każdego źródła — pkt 4. Uzupełnienie 2 (02.11.2026) — pkt 7.
ExRx (403) i web.archive.org (zablokowane) — nieużywane. Strony aplikacji treningowych nie są źródłem — wyniki z takich stron pominięte i nigdzie nie zapisane.

## 1. Tabela

| Klucz | Stan | Zdań | Uwagi |
|---|---|---|---|
| Decline Reverse Crunch | gotowe (wariant) | 2 | istniejące `rcrunch.move`, `rcrunch.hips`; ACE #76 + NASM (oba szczebel 4); źródła opisują wersję na podłodze, NASM wymienia „decline reverse crunch” jako progresję; `mis.jerk` niepotwierdzony |
| Cable Reverse Crunch | gotowe (wariant) — do oceny audytora | 2 | jak wyżej; źródła bez linki (wariant: bez obciążenia); żadne przeczytane źródło nie opisuje wersji z linką |
| Stability Ball Knee Tuck | otwarte (kandydaci) | 0 | ACE #60 = 4, karta VHI = 5 (uzupełnienie 2 potwierdza: VHI → 5) → każde zdanie ma 1 źródło szczebla 4 |
| Crunch - Legs On Exercise Ball | otwarte (kandydaci) | 0 | karta VHI = 5, „Exercise Balls For Dummies” = 5 → 0 źródeł szczebla 4 |
| Cable Seated Crunch | otwarte (kandydaci) | 0 | Bowflex liczy się tylko dla własnego sprzętu; ACE #331 i #291 to jedna organizacja → 1 źródło |
| Frog Sit-Ups | otwarte (kandydaci) | 0 | Coach = 5 (uzupełnienie 2: biogram sprawdzony — dziennikarz, bez kwalifikacji; brak cytowanego trenera; linki afiliacyjne), PureGym = 5 |
| Janda Sit-Up | otwarte (kandydaci) | 0 | Breaking Muscle = 5, strona prywatna C. Bassa = 5; twierdzenia o zginaczach bioder i kręgosłupie → otwarte |
| Alternate Heel Touchers | otwarte (kandydat) | 0 | BarBend (artykuł o technice = 4) — jedno źródło; Cal Poly Pomona 404, JMU 503 |
| Butt-Ups | otwarte | 0 | tylko aplikacje, serwisy komercyjne i platforma fizjoterapeutyczna (Physitrack = 5 od uzupełnienia 2) |
| Cross-Body Crunch | otwarte | 0 | ponowna próba bez wyniku (JMU 503, podręcznik UQ 403) |
| Crunch - Hands Overhead | otwarte | 0 | brak źródła szczebla 4 |
| Decline Oblique Crunch | otwarte | 0 | wyszukiwanie ISSA/NASM/BarBend bez wyniku |
| Kneeling Cable Crunch With Alternating Oblique Twists | otwarte | 0 | brak źródła ze skrętem; źródła bez skrętu = analogia |
| Leg Pull-In | otwarte | 0 | tylko aplikacje i serwisy komercyjne; zestaw ogólny podejrzany |

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

Uwaga do `ace-331` (przeczytany ponownie w sesji 2, 02.11.2026): strona „Standing Crunch” nie ma sekcji „Starting Position” ani numerowanych kroków — cały opis to jeden akapit (ustawienie: „the hips straight with the knees slightly bent”, wyciąg w najwyższym położeniu, lina przy uszach; ruch: „Focus on rolling the rib cage down against the pull of the cable and slowly returning to the top.”). Druga połowa `cc.ribs` („biodra zostają w miejscu”) ma w ACE #331 tylko pośrednie oparcie; wprost mówi to tylko Bowflex. Miejsce cytatu w `data/zrodla/cues-zestawy.json` należy poprawić na „jedyny akapit opisu” (zadanie dla wykonawcy).

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
| core_floor.legsBall.neck | Szyja luźno, głowa w jednej linii z tułowiem. | Keep your neck relaxed and your head in line with your torso. | jw. (dawniej `core_floor.neckRelaxed`) |
| core_floor.frog.setup | Połóż się na plecach, złącz stopy podeszwami i pozwól kolanom opaść na boki; ręce wyciągnij za głowę. | Lie on your back, put the soles of your feet together and let your knees drop out to the sides; reach your arms overhead. | Frog Sit-Ups |
| core_floor.frog.move | Napnij brzuch i unieś tułów, sięgając dłońmi w stronę stóp. | Brace your abs and sit up, reaching your hands toward your feet. | jw. (+ istniejące `rot.slow` na powrót) |
| core_floor.frog.easier | Za ciężko? Trzymaj ręce przy klatce. | Too hard? Keep your arms at your chest. | jw. |
| core_floor.janda.move | Unosząc tułów, dociskaj pięty do podłogi i ciągnij je do siebie, napinając tył ud i pośladki. | As you curl up, press your heels into the floor and pull them toward you, tightening your hamstrings and glutes. | Janda Sit-Up |

## 4. Źródła i ocena szczebla (kryteria koordynatora 02.11.2026 + uzupełnienie 2)

| id | Adres | Organizacja | (a) | (b) | (c) | Szczebel |
|---|---|---|---|---|---|---|
| ace-60 | https://www.acefitness.org/resources/everyone/exercise-library/60/stability-ball-knee-tucks/ | ACE | tak — certyfikuje trenerów | treść firmowana przez ACE | tak | 4 |
| ace-76 | (już w `sources`) | ACE | tak | tak | tak | 4 |
| ace-291 | https://www.acefitness.org/resources/everyone/exercise-library/291/seated-crunch/ | ACE | tak | tak | tak | 4 (ta sama organizacja co ace-331 — razem jedno źródło) |
| ace-331 | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | ACE; miejsce: jedyny akapit opisu | tak | tak | tak | 4 |
| nasm-best-abs | (już w `sources`) | NASM | tak | tak | tak | 4 |
| vhi-hattiesburg-prone-knee-tuck | https://iris.hattiesburgclinic.com/patadv/exkit/Stability%20Ball/English/0450000216co080m_English.html | karta VHI na serwerze Hattiesburg Clinic | nie — dostawca kart ćwiczeń; strona nie nosi marki kliniki | nie — tylko „Copyright © VHI”, bez autora i daty | tak | 5 — potwierdzone uzupełnieniem 2 (VHI → 5) |
| vhi-hattiesburg-ball-basic-crunch | https://iris.hattiesburgclinic.com/patadv/exkit/Stability%20Ball/English/0450000196co070m_English.html | jw., „Basic Crunch” | jw. | jw. | tak | 5 — jw. |
| hku-hlthfit-ball | https://cse.hku.hk/document/hlthfit_StabilityBall.pdf | HKU CSE (centrum sportu uczelni) | — | firmowane przez HKU, bez autora | tak | 5 — potwierdzone uzupełnieniem 2 (uczelniane centrum sportu bez autora → 5); i tak tylko rysunek |
| dummies-exercise-balls-crunch | https://www.dummies.com/article/how-to-do-abdominal-crunches-with-an-exercise-ball-206649 | L. Chabut, „Exercise Balls For Dummies” (Wiley) | nie wykazano — wydawnictwo ogólne, nie Human Kinetics ani NSCA | autor tak | nie sprawdzono | 5 — bez zmian (reguła Human Kinetics/NSCA nie dotyczy) |
| bowflex-2-manual-p49 | https://www.manualslib.com/manual/19974/Bowflex-2.html?page=49 | instrukcja Bowflex 2 (kopia w serwisie z instrukcjami) | producent, tylko dla własnego sprzętu | firmowane przez Bowflex; kopia u strony trzeciej | tak | 4 tylko dla ćwiczeń na maszynie Bowflex; dla wyciągu — nie liczy się |
| coach-frog-situp | https://www.coachweb.com/abs-exercies/5863/the-frog-sit-up-is-murder-on-the-abs | magazyn Coach (Future plc), N. Harris-Fry, „last updated 10 May 2023” | uzupełnienie 2: warunkowo 4 tylko z autorem z kwalifikacjami — biogram (WebFetch 02.11.2026): „a journalist who has been covering health and fitness since 2015”, bez kwalifikacji trenerskich; techniki nie przypisano trenerowi | tak | nie — prowizje afiliacyjne | 5 — bez zmian |
| puregym-butterfly-situps | https://www.puregym.com/exercises/abs/butterfly-sit-ups/ | PureGym | — | — | — | 5 |
| breakingmuscle-janda | https://breakingmuscle.com/save-your-spine-and-forget-the-ghd-enter-the-janda-sit-up/ | Breaking Muscle, C. Marker (PhD, CSCS) | — | — | — | 5 (rozstrzygnięcie; nigdy niezależne od BarBend) |
| cbass-janda | https://cbass.com/HardestSitup.htm | strona prywatna C. Bassa (2000) | nie | autor i rok tak | tak | 5 |
| barbend-heel-touches | https://barbend.com/heel-touches/ | BarBend, J. Zucker (NCSF CPT) | artykuł o technice | autor tak | — | 4 |

Propozycje `orgs`: brak nowych do dodania (VHI, Wiley wycofane; Bowflex tylko jako „maker” dla ćwiczeń na jego maszynach).

## 5. Otwarte

Kandydaci — zdania z pkt 3, którym brakuje drugiego źródła szczebla 4:
- Stability Ball Knee Tuck: `core_floor.ballTuck.setup` — ACE #60 Step 2 („Walk your hands forward… until your thighs or knees rest on the ball”); `core_floor.ballTuck.move` — ACE #60 Step 3 („slowly pull your knees towards your chest, rolling the ball forward”). Karta VHI zgodna, ale szczebel 5. Także `plank.brace`, `plank.mis.sag` — tylko ACE #60.
- Crunch - Legs On Exercise Ball: wszystkie 4 zdania mają tylko VHI + książkę (oba 5).
- Cable Seated Crunch: `cc.ribs`, `cc.slow` — tylko ACE (#331, #291) = jedna organizacja. Trop: producent wyciągów z instrukcją „cable crunch”; NASM/ISSA. `mis.jerk` — bez źródła.
- Frog Sit-Ups: `core_floor.frog.setup`, `.move`, `.easier` + `rot.slow` — zgodne Coach i PureGym, oba szczebel 5 (Coach ponownie sprawdzony w uzupełnieniu 2).
- Janda Sit-Up: `core_floor.janda.move` — Breaking Muscle („…performing a crunch while actively driving the heel into the ground.”) i C. Bass („squeeze the glutes and pull your calves back against the roller pads with the hamstrings”) — oba 5. Twierdzenia o „wyłączaniu zginaczy bioder” i „ochronie dolnego odcinka pleców” — o działaniu/zdrowiu, niepotwierdzone → nie do aplikacji.
- Alternate Heel Touchers: BarBend „How to Do the Heel Touch”, kroki 1–4 i „Common Heel Touch Mistakes” — jedno źródło szczebla 4.

Platforma fizjoterapeutyczna (Physitrack, już w `orgs`): w wynikach dla Butt-Ups, Leg Pull-In i Cross-Body Crunch — uzupełnienie 2: Physitrack = 5, nie liczy się (nieczytana).

Inne:
- Cable Reverse Crunch, Decline Reverse Crunch: „gotowe” opiera się na regule wariantu; jeśli audytor uzna, że ławka skośna albo linka zmieniają ćwiczenie, oba wracają do „otwarte”. `mis.jerk` — NASM („Slow, controlled reps are preferred over momentum”) to wskazówka tempa, jedno źródło.
- Leg Pull-In: `db.slow` pochodzi z dead buga, prawdopodobnie analogia; bez źródła szczebla 4.
- Kneeling Cable Crunch With Alternating Oblique Twists: `cc.slow` — źródła bez skrętu = analogia.
- Cross-Body Crunch, Decline Oblique Crunch, Crunch - Hands Overhead: zestaw `crunch.*` bez źródeł szczebla 4. Tropy: JMU Exercise and Movement Center (503; uczelnia — od uzupełnienia 2: bez autora 5, z autorem z kwalifikacjami warunkowo 4), UQ „exercise delivery” (403), ISSA, NFPT, BarBend, materiały szpitali (4 od uzupełnienia 2).
- Butt-Ups: nazwa bywa używana dla różnych ćwiczeń — przed recenzją ruchu ustalić wariant katalogu.

## 6. Stan

- Sesja 1 (02.11.2026): 5 „gotowych”, 6 nowych zdań.
- Sesja 2 (02.11.2026): rozstrzygnięcie o szczeblach zastosowane → 2 gotowe, 12 otwartych.
- Uzupełnienie 2 (02.11.2026): przejrzane wszystkie źródła; VHI, HKU CSE (uczelniane centrum sportu bez autora), Physitrack = 5 (potwierdzone); Coach (Frog Sit-Ups) — biogram autora sprawdzony, nadal 5; Dummies/Wiley — reguła Human Kinetics nie dotyczy, 5. **Bez zmian: 2 gotowe → 2 gotowe** (Decline Reverse Crunch, Cable Reverse Crunch — wariant), 12 otwartych; 0 nowych zdań do `lib/`, 10 kandydatów.
- Zostało: drugie źródło szczebla 4 dla kandydatów (najbliżej: Stability Ball Knee Tuck i Alternate Heel Touchers; szukać w ISSA, NFPT z autorem i kwalifikacjami, BarBend o technice, NASM, materiałach szpitali/fizjoterapii NHS).
- Pułapki: ExRx 403; strony aplikacji dominują w wynikach — pomijać; muscleandstrength.com i uq.pressbooks.pub — 403; livestrong.com przekierowuje; karty VHI bez autora i daty (5); ACE — wiele stron to jedna organizacja.

### Stan zadania „uzupełnienie 2” dla całej fali (zatrzymane na limicie kontekstu, 02.11.2026)

Przejrzane i zapisane: `wskazowki-fala-w1/neck.md`, `core_floor-1.md`, `core_floor-2.md` (ten plik).

**NIEprzejrzane** (sekcja „Korekta szczebli — uzupełnienie 2” jeszcze nie dopisana): `wskazowki-fala-w1/core_floor-3.md`, `core_standing-1.md`, `core_standing-2.md`,
`core_hang.md`, `back_extension.md`; `role-miesni-fala-w1/core_floor.md`, `core_standing.md`, `core_hang.md`, `back_extension.md`, `neck.md`.

Wstępne ustalenia z przeszukania tych plików (do potwierdzenia przez następnego agenta przy dopisywaniu sekcji; nie zmieniają stanu bez lektury całego pliku):
- `core_floor-3.md`: Western University Sport and Recreation Services (`western-fm`) — uczelniane centrum sportu; jeśli bez autora → 5 (bez zmian względem korekty 1).
- `core_standing-1.md`: Intermountain Health (`intermountain-mb-partner`) → 4 potwierdzone (sieć szpitali); Medicine Ball Full Twist i tak ma tylko jedno źródło szczebla 4 (RDX = 5) → otwarte; gotowe prawdopodobnie bez zmian (3 → 3). Institute of Motion i Speediance — poza zakresem uzupełnienia 2.
- `core_standing-2.md`: The Prehab Guys (Seated Barbell Twist) — warunkowo 4 tylko z autorem z kwalifikacjami; jedyne przeczytane źródło, więc ćwiczenie zostaje otwarte niezależnie od biogramu.
- `core_hang.md`: Western SRS i HKU CSE — uczelniane centra sportu → 5 (bez zmian).
- `back_extension.md`: StayWell/OU Health (`staywell-ou-prone`) → 4 (placówka ochrony zdrowia; data niewymagana) — Lower Back Curl bez zmian; HKU CSE → 5 (bez zmian).
- `role-miesni-fala-w1/*`: TeachMeAnatomy „do decyzji” — poza zakresem uzupełnienia 2 (serwis anatomiczny, nie placówka zdrowia); Sussex Sport (University of Sussex) — uczelniane centrum sportu, sprawdzić autora (bez autora → 5, jak w pliku); `neck.md` — dopisać, że HealthLink BC = 4 (jedno źródło z Kaiser/UMM), NHS = 4.

## 7. Korekta szczebli — uzupełnienie 2 (02.11.2026)

Podstawa: uzupełnienie 2 rozstrzygnięcia koordynatora linii 1.1 (02.11.2026).

| źródło | przed | po | powód |
|---|---|---|---|
| vhi-hattiesburg-* (VHI) | 5 | 5 | reguła wprost: VHI → 5. Strona nie nosi marki kliniki, więc reguła „placówka ochrony zdrowia” też nie ma zastosowania. |
| hku-hlthfit-ball (HKU CSE) | 5 | 5 | uczelniane centrum sportu bez autora → 5. |
| coach-frog-situp (Coach) | 5 | 5 | warunkowo 4 tylko z autorem z kwalifikacjami — WebFetch 02.11.2026: autor dziennikarz, technika nieprzypisana trenerowi; dodatkowo linki afiliacyjne (c). |
| dummies-exercise-balls-crunch | 5 | 5 | Wiley, nie Human Kinetics/NSCA; reguła książek nie dotyczy. |
| Physitrack (nieczytana) | nie liczona | 5 | reguła wprost. |

Skutek: żadne ćwiczenie nie zmienia stanu (gotowe 2 → 2).
