# Wskazówki techniki — rodzina plyo (skoki), część 1

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3); uzupełnienie: druga sesja tego samego zadania, 02.11.2026. Zadanie: tylko zbieranie danych
(polecenie właściciela 02.11.2026) — nic nie jest w `data/zrodla/cues.json` ani `lib/`. Wdrożenie — programista po akceptacji; teksty EN — tłumacz (propozycje niżej).

Metoda: wyjątek dla wskazówek techniki z CLAUDE.md — każde zdanie ma ≥ 2 przeczytane, niezależne źródła (różne organizacje) szczebla 4
albo wyższego; wariant tego samego ćwiczenia (inny sprzęt, z obciążeniem / bez) liczy się z opisem „(wariant: …)”, inne ćwiczenie — nie.
Liczby (wysokość skrzyni, ciężar, serie) i twierdzenia o zdrowiu („chroni kolana”, „ryzyko kontuzji”) ze źródeł pominięte.
Zdania zestawu ogólnego „jump” użyte tylko tam, gdzie przeczytane źródła danego ćwiczenia je potwierdzają (uzupełnienie briefu 02.11).
Strony innych aplikacji treningowych pominięte (nie są źródłem, nazw nie zapisuję). ExRx i web.archive.org — niedostępne, nie użyte.

**Szczeble wg rozstrzygnięcia koordynatora linii 1.1 (02.11.2026), zastosowane w tej wersji:** szczebel 4 = organizacja szkoląca trenerów,
serwis z redakcją ekspercką albo producent *dla własnego rodzaju sprzętu*; autor + data albo treść firmowana; bez marketingu. Skutki dla
wcześniejszych wpisów: Rogue (Jump Squat bez sprzętu) i Torokhtiy (skok ze sztangą — producent akcesoriów, nie sztang) **nie liczą się** —
usunięte z danych; Weighted Jump Squat oparty teraz na Catalyst #353 + badaniu Suchomel i in. 2019 (szczebel 3, opis wykonania w metodach).
Topend Sports (brak autora i daty) = 5 — nie liczy się.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Jump Squat | gotowe | ACE #116, NASM, Catalyst #555; bez zdania o rękach (źródła się różnią — „Otwarte”). Rogue usunięty (producent, nie jego sprzęt) — bez wpływu, zostały ≥ 2 źródła |
| Broad Jump | gotowe | setup/move/wskazówka: ACE #177, Catalyst #549; błąd `jump.mis.stiff`: ACE #177 Step 6 + The Prehab Guys „Broad Jump” (COMPENSATION) — uzupełnione w 2. sesji |
| Weighted Jump Squat | gotowe | setup/move: Catalyst #353 + Suchomel i in. 2019 (metody); lądowanie i błąd — Catalyst #353 + warianty bez obciążenia (ACE #116, NASM). `sq.back` wycofane (po usunięciu Torokhtiy — jedno źródło) |
| Depth Jump | częściowe | setup/move: Catalyst #551 + badanie Louder i in. 2015; brak błędu z 2 źródłami; ISSA opisuje „zeskok” i głębokie ugięcie — sprzeczność, „Otwarte” |
| Tuck Jump | gotowe | ACE #180, NASM, Catalyst #558 |
| Split Jump | gotowe | ACE #234 (Cycled Split-Squat Jump), NASM Lunge Jump |
| Lateral Bound | otwarte | nadal jedno przeczytane źródło szczebla 4 (The Prehab Guys) |
| Star Jump | otwarte | jedyne opisy: Topend Sports (bez autora → 5) i karta fizjoterapii trustu NHS (bez daty, inny wariant lądowania) — za mało |
| Bench Jump | otwarte | nie szukano w 2. sesji (kolejność zadań); brak źródeł; niejasna definicja |
| Lateral Box Jump | otwarte | nie szukano w 2. sesji; brak przeczytanych źródeł |
| Frog Hops | otwarte | nie szukano w 2. sesji; brak drugiego źródła; źródła się różnią |
| Kneeling Jump Squat | otwarte | nie szukano w 2. sesji; brak źródeł szczebla 4 |

## 2. Dane (propozycja do `data/zrodla/cues.json`)

```json
{
  "orgs": {
    "Catalyst Athletics": {
      "name": "Catalyst Athletics — Exercise Library (catalystathletics.com; podnoszenie ciężarów, G. Everett)",
      "level": 4,
      "kind": "site"
    },
    "Louder, Bressel, Bressel (Utah State University)": {
      "name": "Louder, Bressel, Bressel (Utah State University) — badanie, J Hum Kinet 2015 (użyty tylko opis wykonania)",
      "level": 3,
      "kind": "study"
    },
    "Suchomel i in. (J Hum Kinet 2019)": {
      "name": "Suchomel, McKeever, Sijuwade, Carpenter, McMahon, Loturco, Comfort — badanie, J Hum Kinet 2019 (użyty tylko opis wykonania)",
      "level": 3,
      "kind": "study"
    }
  },
  "sources": {
    "ace-116": {"org": "ACE", "title": "Squat Jumps (#116)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/", "level": 4},
    "ace-177": {"org": "ACE", "title": "Forward Linear Jumps (#177)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/", "level": 4},
    "ace-180": {"org": "ACE", "title": "Tuck Jump (#180)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/", "level": 4},
    "ace-234": {"org": "ACE", "title": "Cycled Split-Squat Jump (#234)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/234/cycled-split-squat-jump/", "level": 4},
    "nasm-squat-jump": {"org": "NASM", "title": "Squat Jump", "url": "https://www.nasm.org/resource-center/exercise-library/squat-jump", "level": 4},
    "nasm-tuck-jump": {"org": "NASM", "title": "Tuck Jump", "url": "https://www.nasm.org/resource-center/exercise-library/tuck-jump", "level": 4},
    "nasm-lunge-jump": {"org": "NASM", "title": "Lunge Jump", "url": "https://www.nasm.org/resource-center/exercise-library/lunge-jump", "level": 4},
    "catalyst-353": {"org": "Catalyst Athletics", "title": "Back Squat Jump (#353)", "url": "https://catalystathletics.com/exercise/353/Back-Squat-Jump/", "level": 4},
    "catalyst-549": {"org": "Catalyst Athletics", "title": "Broad Jump (#549)", "url": "https://www.catalystathletics.com/exercise/549/Broad-Jump/", "level": 4},
    "catalyst-551": {"org": "Catalyst Athletics", "title": "Depth Jump (#551)", "url": "https://catalystathletics.com/exercise/551/Depth-Jump/", "level": 4},
    "catalyst-555": {"org": "Catalyst Athletics", "title": "Squat Vertical Jump (#555)", "url": "https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/", "level": 4},
    "catalyst-558": {"org": "Catalyst Athletics", "title": "Tuck Jump (#558)", "url": "https://catalystathletics.com/exercise/558/Tuck-Jump/", "level": 4},
    "prehab-broad-jump": {"org": "The Prehab Guys", "title": "Broad Jump", "url": "https://theprehabguys.com/vimeo-video/broad-jump-2/", "level": 4},
    "pmc-4723169": {"org": "Louder, Bressel, Bressel (Utah State University)", "title": "The Kinetic Specificity of Plyometric Training: Verbal Cues Revisited (J Hum Kinet 2015;49:201–208)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4723169/", "level": 3},
    "pmc-6724584": {"org": "Suchomel i in. (J Hum Kinet 2019)", "title": "The Effect of Load Placement on the Power Production Characteristics of Three Lower Extremity Jumping Exercises (J Hum Kinet 2019)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/", "level": 3}
  },
  "exercises": {
    "Jump Squat": {
      "setup": [
        {"c": "lunge.stand", "s": [["ace-116", "Step 1 (feet hip-width apart)"], ["nasm-squat-jump", "Step 1: Setup (feet hip-width apart)"]]}
      ],
      "move": [
        {"c": "plyo.dip", "s": [["ace-116", "Step 2 (push hips back and bend at the knees)"], ["nasm-squat-jump", "Step 2: Brace/Position (quarter-squat or half-squat)"], ["catalyst-555", "Instructions (squat … into the bottom)"]]},
        {"c": "plyo.extend", "s": [["ace-116", "Step 3 (extending ankles, knees and hips)"], ["nasm-squat-jump", "Step 3: Execute/Drive"], ["catalyst-555", "Instructions (drive into a maximal vertical jump)"]]}
      ],
      "tips": [
        {"c": "jump.land", "s": [["ace-116", "Step 5 (land softly; don't lock out the knees)"], ["nasm-squat-jump", "Step 4: Return/Descent (land softly … bent knees)"], ["catalyst-555", "Instructions (absorb the landing … bending the knees and hips)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["nasm-squat-jump", "Common Mistakes, pkt 1 (landing with straight or minimally bent knees)"], ["ace-116", "Step 5 (don't lock out your knees)"]]}
      ]
    },
    "Tuck Jump": {
      "setup": [
        {"c": "lunge.stand", "s": [["ace-180", "Step 1 (feet about hip-width apart)"], ["nasm-tuck-jump", "Step 1: Setup (feet hip-width apart)"]]}
      ],
      "move": [
        {"c": "jump.drive", "s": [["ace-180", "Step 3; wskazówka końcowa (arms forward and up)"], ["nasm-tuck-jump", "Step 3: Execute/Drive (extend hips, knees, ankles while swinging arms upward)"], ["catalyst-558", "opis (swing the arms forward and up, push against the ground)"]]},
        {"c": "plyo.tuck", "s": [["ace-180", "Step 3 (pull your knees toward your chest)"], ["nasm-tuck-jump", "Step 3: Execute/Drive (drive your knees toward your chest)"], ["catalyst-558", "opis (pull the knees up as high as possible)"]]}
      ],
      "tips": [
        {"c": "jump.land", "s": [["ace-180", "Step 4 (land softly; don't lock knees)"], ["nasm-tuck-jump", "Step 4: Return/Descent (land softly … bent knees)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["nasm-tuck-jump", "Common Mistakes, pkt 1"], ["ace-180", "Step 4 (don't lock your knees or quads)"]]}
      ]
    },
    "Split Jump": {
      "setup": [
        {"c": "plyo.splitSetup", "s": [["ace-234", "Step 1: Starting Position (right leg forward, left leg back)"], ["nasm-lunge-jump", "Step 3: Execute/Drive (step forward into a lunge position)"]]}
      ],
      "move": [
        {"c": "plyo.splitSwitch", "s": [["ace-234", "Step 2–4 (launch, swap legs in the air, land with the other leg in front)"], ["nasm-lunge-jump", "Step 3–4 (jumping to switch leg positions; land … opposite leg forward)"]]}
      ],
      "tips": [
        {"c": "jump.land", "s": [["ace-234", "Step 4: Landing (touch down softly; avoid locking out your knees)"], ["nasm-lunge-jump", "Step 4: Return/Descent (absorbing impact with bent knees)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["nasm-lunge-jump", "Common Mistakes, pkt 1 (landing with straight knees)"], ["ace-234", "Step 4 (avoid locking out your knees)"]]}
      ]
    },
    "Weighted Jump Squat": {
      "setup": [
        {"c": "plyo.wjsBarBack", "s": [["catalyst-353", "Instructions, pkt 1 (bar in back squat position, held tightly against the body)"], ["pmc-6724584", "Methods, Procedures (external load on the upper back, similar to a back squat)"]]}
      ],
      "move": [
        {"c": "plyo.wjsMove", "s": [["catalyst-353", "Instructions, pkt 2 (drive up … maximal vertical jump)"], ["pmc-6724584", "Methods, Procedures (rapid countermovement, then jump as high as possible)"]]}
      ],
      "tips": [
        {"c": "jump.land", "s": [["catalyst-353", "Instructions, pkt 4 (absorb the landing)"], ["ace-116", "Step 5 (wariant: bez obciążenia)"], ["nasm-squat-jump", "Step 4: Return/Descent (wariant: bez obciążenia)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["nasm-squat-jump", "Common Mistakes, pkt 1 (wariant: bez obciążenia)"], ["ace-116", "Step 5 (wariant: bez obciążenia)"]]}
      ]
    },
    "Broad Jump": {
      "setup": [
        {"c": "plyo.broadLoad", "s": [["ace-177", "Step 2: Downward Phase (push hips back; arms behind you)"], ["catalyst-549", "Instructions, pkt 1 (bend knees and hips, swing arms back)"]]}
      ],
      "move": [
        {"c": "plyo.broadDrive", "s": [["ace-177", "Step 3: Jumping Movement (drive forward and up; arms overhead)"], ["catalyst-549", "opis i pkt 2 (swing arms forward, push hard; as far forward as possible)"]]}
      ],
      "tips": [
        {"c": "plyo.broadLand", "s": [["ace-177", "Step 4–6 (legs forward; bend knees and hips to absorb)"], ["catalyst-549", "Instructions, pkt 3 (reach feet forward, absorb by bending knees and hips)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["ace-177", "Step 6 (lądowanie na prostych kolanach)"], ["prehab-broad-jump", "COMPENSATION (if you do not let them bend much, you will land stiff and hard)"]]}
      ]
    },
    "Depth Jump": {
      "setup": [
        {"c": "plyo.depthStep", "s": [["catalyst-551", "Instructions (stand at the front edge of a box … step off)"], ["pmc-4723169", "Methods (subjects were asked to step forward off the box)"]]}
      ],
      "move": [
        {"c": "plyo.depthRebound", "s": [["catalyst-551", "Instructions (land on the balls of both feet … drive straight back up)"], ["pmc-4723169", "Methods (subsequent vertical jump; cues: as high / as quick as possible)"]]}
      ],
      "tips": [],
      "mistakes": []
    }
  }
}
```

Uwaga do danych: `Depth Jump` ma puste `mistakes` — status „częściowe”; programista decyduje, czy karta częściowa jest wyświetlana
(reguła briefu: ≥ 1 zdanie w setup/move i ≥ 1 w mistakes, inaczej nie „gotowe”). Weighted Jump Squat: lądowanie i błąd stoją na wariancie bez
obciążenia (ACE, NASM) + Catalyst #353 tylko dla lądowania — zgodnie z metodą wariantów z tego pliku; do oceny recenzenta.

## 3. Nowe zdania

| Id | PL | EN (propozycja) |
|---|---|---|
| plyo.dip | Ugnij kolana i cofnij biodra do przysiadu. | Bend your knees and push your hips back into a squat. |
| plyo.extend | Wybij się dynamicznie, prostując jednocześnie biodra, kolana i kostki. | Jump explosively, straightening your hips, knees and ankles together. |
| plyo.tuck | W powietrzu przyciągnij kolana do klatki. | In the air, pull your knees up to your chest. |
| plyo.splitSetup | Ustaw się w wykroku: jedna noga z przodu, druga z tyłu. | Get into a split stance: one leg in front, the other behind. |
| plyo.splitSwitch | Wybij się w górę, w powietrzu zamień nogi i wyląduj w wykroku z drugą nogą z przodu. | Jump up, switch legs in the air and land in a split stance with the other leg in front. |
| plyo.broadLoad | Ugnij kolana i cofnij biodra, ręce zamachnij w tył. | Bend your knees and push your hips back, swinging your arms back. |
| plyo.broadDrive | Zamach rąk w przód i mocne wybicie nogami w przód i w górę — jak najdalej. | Swing your arms forward and drive hard with your legs, forward and up — as far as you can. |
| plyo.broadLand | W locie wysuń stopy przed siebie i wyląduj na obu, uginając kolana i biodra. | In the air, reach your feet forward and land on both, bending your knees and hips. |
| plyo.wjsBarBack | Sztanga na górze pleców, jak do przysiadu. | Bar on your upper back, like for a squat. |
| plyo.wjsMove | Zejdź do przysiadu i wybij się w górę jak najmocniej. | Squat down and jump up as hard as you can. |
| plyo.depthStep | Zejdź ze skrzyni krokiem w przód. | Step forward off the box. |
| plyo.depthRebound | Wyląduj na obu stopach i od razu, jak najszybciej, odbij się w górę. | Land on both feet and spring straight back up as fast as you can. |
| ~~plyo.wjsBar~~ (wycofane 2. sesja) | Sztanga na górze pleców, trzymana mocno, żeby się nie przesuwała. | — „trzymana mocno” potwierdza tylko Catalyst; zastąpione przez `plyo.wjsBarBack` |

Użyte istniejące zdania (treść sprawdzona słowo w słowo ze źródłami ćwiczenia): `lunge.stand`, `jump.drive` (tylko Tuck Jump),
`jump.land`, `jump.mis.stiff`. `sq.back` wycofane z Weighted Jump Squat (jedno źródło po zmianie szczebli). Zdań Box Jump (`bj.*`) nie użyłem:
`bj.land` („biodra cofnięte”) i `bj.setup`/`bj.move` (skrzynia) nie pasują słowo w słowo do żadnego z ćwiczeń tej części.

## 4. Źródła

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-116 | https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/ | ACE | 4 | Step 1–7, wskazówki końcowe |
| ace-177 | https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/ | ACE | 4 | Step 1–7, wskazówka końcowa |
| ace-180 | https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/ | ACE | 4 | Step 1–4, wskazówki i wariant |
| ace-234 | https://www.acefitness.org/resources/everyone/exercise-library/234/cycled-split-squat-jump/ | ACE | 4 | Step 1–5, wskazówki końcowe |
| ace-120 (nieużyte tu) | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Step 1–8 — skoki obunóż w bok przez pachołki; inne ćwiczenie niż Lateral Bound / Lateral Box Jump |
| nasm-squat-jump | https://www.nasm.org/resource-center/exercise-library/squat-jump | NASM | 4 | Step 1–4, Common Mistakes |
| nasm-tuck-jump | https://www.nasm.org/resource-center/exercise-library/tuck-jump | NASM | 4 | Step 1–4, Common Mistakes |
| nasm-lunge-jump | https://www.nasm.org/resource-center/exercise-library/lunge-jump | NASM | 4 | Step 1–4, Common Mistakes |
| catalyst-353 | https://catalystathletics.com/exercise/353/Back-Squat-Jump/ | Catalyst Athletics | 4 | Instructions pkt 1–4 (ciężar 20–30% pominięty — liczba) |
| catalyst-549 | https://www.catalystathletics.com/exercise/549/Broad-Jump/ | Catalyst Athletics | 4 | opis, Instructions pkt 1–3, wariant |
| catalyst-551 | https://catalystathletics.com/exercise/551/Depth-Jump/ | Catalyst Athletics | 4 | Instructions; Variations („heels … touch”), wysokość/progresja (liczby pominięte); brak listy błędów (sprawdzone ponownie w 2. sesji) |
| catalyst-555 | https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/ | Catalyst Athletics | 4 | Instructions |
| catalyst-558 | https://catalystathletics.com/exercise/558/Tuck-Jump/ | Catalyst Athletics | 4 | opis |
| prehab-broad-jump | https://theprehabguys.com/vimeo-video/broad-jump-2/ | The Prehab Guys | 4 | HOW, FEEL, COMPENSATION: „If you do not let them bend much, you will land "stiff" and hard.”; „They should not dive inwards on the landing.” |
| pmc-4723169 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4723169/ | Louder, Bressel, Bressel (Utah State University) | 3 | Methods (procedura depth jump) |
| pmc-6724584 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/ | Suchomel i in. (J Hum Kinet 2019) | 3 | Methods, Procedures: „The JS exercise was performed by holding the external load on the upper back, similar to a back squat.”; szybkie ugięcie i skok „as high as possible”; lądowania nie opisuje |
| rogue-jump-squat (wycofane) | https://www.roguecanada.ca/theindex/movement-library/movement-demo-jump-squat | Rogue Fitness (producent) | 5 dla tego ćwiczenia | producent, ćwiczenie bez jego sprzętu (rozstrzygnięcie 02.11) |
| torokhtiy-barbell-squat-jump (wycofane) | https://torokhtiy.com/blogs/guides/barbell-squat-jump | Torokhtiy Weightlifting (producent akcesoriów) | 5 dla tego ćwiczenia | technika, Common mistakes — nie liczone po rozstrzygnięciu 02.11 |
| performance-herts-broad-jump (nieużyte) | https://performanceherts.co.uk/news-exercise-of-the-month-1257 | Performance Herts (centrum sportu Univ. of Hertfordshire) | do decyzji koordynatora (brak autora; nie organizacja szkoląca trenerów) | Step 1–4, Common mistakes: „Landing with straight legs” — potwierdza `jump.mis.stiff` jako 3. źródło, niewliczone |
| issa-plyo-guide (nieużyte) | https://www.issaonline.com/blog/post/the-essential-guide-to-plyometrics-plus-a-sample-workout | ISSA (firmowane, 05.02.2024) | 4 | Depth jump: „Jump off a box, landing on the floor. Allow your knees to do a deep bend, then do a vertical jump.” — sprzeczne z Catalyst/Louder (krok, szybkie odbicie); broad jump tylko z nazwy |
| justfly-depth-jump (nieużyte) | https://www.just-fly-sports.com/depth-jump-guide/ | Just Fly Sports (J. Smith; bez podpisu na stronie) | 5 (brak autora i daty na stronie) | „Athletes shouldn't simply drop straight down off the box…”; pięty uderzające mocno = za wysoka skrzynia |
| elitefts-depth (nieużyte) | https://elitefts.com/blogs/training/depth-jumps-and-depth-land-progressions-to-increase-the-vertical-jump | EliteFTS (C. Janek, 09.10.2018) | 4? (do decyzji — sklep sprzętu z blogiem) | opisuje głównie depth land; brak listy błędów depth jump |
| nhs-kmpt-star-jumps (nieużyte) | https://www.kentmedwaymentalhealth.nhs.uk/pdf-documents/coronavirus-documents/coronavirus-page-documents/physiotherapy-cardio-workout/star-jumps-and-butt-kicks/ | trust NHS (fizjoterapia) | 4? (placówka medyczna; daty na stronie brak) | Star jumps: „Jump as high as you can into a big star shape.”; lądowanie z rozstawionymi nogami (inny wariant) |
| prehab-continuous-lateral-bound (nieużyte) | https://theprehabguys.com/vimeo-video/continuous-lateral-bound/ | The Prehab Guys | 4 | HOW, COMPENSATION — jedyne źródło dla Lateral Bound |
| topendsports-star-jumps (nieużyte) | https://www.topendsports.com/fitness/technique/star-jumps.htm | Topend Sports | 5 (brak autora i daty) | technika pkt 1–4 |

Niedostępne: NASM `broad-jump`, `depth-jump(s)`, `split-jump`, `lateral-bound`, `skater-jumps`, `star-jumps`, `broad-jumps` (404);
NSCA wideo „Exercise Technique: Depth Jump” (403); Dick's Sporting Goods „How to Do a Lateral Bound” (403, ponownie w 2. sesji); stack.com (503, ponownie);
Rogue `movement-demo-broad-jump` (404); The Prehab Guys „Squat Jumps” (logowanie); Royal Navy „star jumps” (403); simplifaster.com (403);
elitefts `/education/…` (404). ACE: mapa strony sprawdzona w całości do id ~377 — brak „bound”, „skater”, „star”, „frog”, „depth”.

## 5. Otwarte

- **Ręce w Jump Squat** — ACE #116 (Step 7: zamach rąk jako utrudnienie) i NASM (zamach w górę) vs Catalyst #555 (ręce nieruchomo przy klatce).
  Ten sam szczebel, różnica → do karty tylko część wspólna (`plyo.extend` bez rąk); zdanie zestawu ogólnego `jump.drive` NIE wpisane dla Jump Squat.
- **Głębokość przysiadu przed wybiciem (Jump Squat)** — NASM: ćwierć/pół przysiadu; ACE: do momentu, gdy pięty mają się oderwać; Catalyst #555: pełny
  przysiad. Bez liczby/głębokości w zdaniu (`plyo.dip`).
- **Rozstaw stóp** — ACE i NASM: na szerokość bioder; Catalyst (Tuck Jump), Prehab Guys i Performance Herts (skok w dal): na szerokość barków; ACE #177:
  szerzej niż biodra. Dla Jump Squat i Tuck Jump `lunge.stand` opiera się na ACE + NASM; dla Broad Jump pominięte.
- **Broad Jump — kolana do środka** (`sq.mis.kneesIn`): tylko The Prehab Guys (COMPENSATION). Drugie źródło brak — nie wpisane.
- **Broad Jump — „reset po każdym skoku”** (Catalyst) vs skoki ciągłe jako wariant (ACE Step 7) — nie wpisane.
- **Depth Jump — błąd**: brak dwóch źródeł szczebla 4. Kandydaci: „zeskok prosto w dół zamiast kroku w przód” (Just Fly — szczebel 5; Stack niedostępny),
  „pięty mocno uderzają = skrzynia za wysoka” (Just Fly; Catalyst każe pozwolić piętom dotknąć podłogi — sprzeczność). Nie wpisane.
- **Depth Jump — sprzeczność w wykonaniu**: ISSA („Jump off a box”, „deep bend”) vs Catalyst #551 i Louder i in. (krok ze skrzyni, szybkie odbicie).
  Ten sam szczebel 4 (+ badanie 3) — w danych krok ze skrzyni (szczebel 3 wygrywa), różnica zapisana tutaj.
- **Depth Jump — definicja**: katalog („zeskok z jednej skrzyni i wskok na drugą”) różni się od przeczytanych źródeł (zeskok i wyskok pionowy z
  podłogi). Do decyzji analityka.
- **Weighted Jump Squat** — `sq.back` (plecy proste) i „skacz prosto w górę, nie w przód” — tylko Catalyst #353; ciężar — liczba, nie wpisane.
- **Lateral Bound** — tylko The Prehab Guys. Szukane w 2. sesji: ACE (brak w mapie strony), NASM (404), ISSA (tylko „skater hop” z nazwy, bez opisu),
  NFPT (brak wyników), sklep sportowy (403); reszta wyników — strony aplikacji i serwisy bez autora.
- **Star Jump** — Topend Sports (szczebel 5) + trust NHS (bez daty; lądowanie w rozkroku = inny wariant niż Topend, który wraca do przysiadu). Część wspólna
  (wyskok z rozłożeniem rąk i nóg w gwiazdę) ma tylko jedno źródło spełniające kryteria — nie wpisane. Royal Navy (403) — do ponowienia.
- **Bench Jump, Lateral Box Jump, Frog Hops, Kneeling Jump Squat** — bez zmian względem 1. sesji (nie szukano w 2. sesji z powodu limitu kontekstu).
- **Do decyzji koordynatora — szczeble**: Performance Herts (uczelniane centrum sportu, bez autora), NISMAT/trust NHS (placówki medyczne — reguła
  „materiał placówki medycznej z datą” dotyczy tu analogicznie), EliteFTS (sklep sprzętu z blogiem eksperckim).

## 6. Stan

- Zrobione (1. sesja): Jump Squat, Tuck Jump, Split Jump, Weighted Jump Squat; Broad Jump i Depth Jump częściowo.
- Zrobione (2. sesja, 02.11): Broad Jump → gotowe (błąd z Prehab Guys); szczeble poprawione wg rozstrzygnięcia 02.11 (Rogue, Torokhtiy, Topend wycofane;
  Weighted Jump Squat przebudowany na Catalyst + Suchomel 2019, `plyo.wjsBar` → `plyo.wjsBarBack`, `sq.back` wycofane); Depth Jump — błędy szukane, nadal otwarte;
  Lateral Bound i Star Jump — szukane, nadal otwarte.
- Stan: gotowe 5 (Jump Squat, Broad Jump, Weighted Jump Squat, Tuck Jump, Split Jump), częściowe 1 (Depth Jump), otwarte 6.
- Zostało: błąd Depth Jump; drugie źródło Lateral Bound i Star Jump; Bench Jump, Lateral Box Jump, Frog Hops, Kneeling Jump Squat (nie szukane w 2. sesji).
- Następny krok: Royal Navy „get fit to join” (star jumps — inny adres/region), producenci skrzyń plyometrycznych (instrukcje PDF z „lateral box jump”,
  „bench/box hops”), Special Olympics (podręczniki trenerów, PDF — adres `specialolympics.ca/…/Agility.pdf` 404), NSCA Coach/PTQ PDF.
- Pułapki: NASM ma tylko kilka stron skoków (`squat-jump`, `tuck-jump`, `lunge-jump`, `box-jumps`); ACE — brak „bound/skater/star/frog/depth” w mapie
  strony; wyniki wyszukiwarki dla skoków to w większości strony aplikacji i sklepy z odzieżą (np. blogi sklepów odzieżowych — szczebel 5) — pomijać.
