# Wskazówki techniki — rodzina plyo (skoki), część 1

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3); uzupełnienia: druga i trzecia sesja tego samego zadania, 02.11.2026. Zadanie: tylko zbieranie danych
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

> **Przeliczenie 02.11.2026:** statusy w sekcji 1 i blok w sekcji 2 są NIEAKTUALNE — wiążąca jest sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026” na końcu pliku (The Prehab Guys bez autora na stronach = nie liczy się; Torokhtiy = 4 przy autorze).

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Jump Squat | gotowe | ACE #116, NASM, Catalyst #555; bez zdania o rękach (źródła się różnią — „Otwarte”). Rogue usunięty (producent, nie jego sprzęt) — bez wpływu, zostały ≥ 2 źródła |
| Broad Jump | gotowe | setup/move/wskazówka: ACE #177, Catalyst #549; błąd `jump.mis.stiff`: ACE #177 Step 6 + The Prehab Guys „Broad Jump” (COMPENSATION) — uzupełnione w 2. sesji |
| Weighted Jump Squat | gotowe | setup/move: Catalyst #353 + Suchomel i in. 2019 (metody); lądowanie i błąd — Catalyst #353 + warianty bez obciążenia (ACE #116, NASM). `sq.back` wycofane (po usunięciu Torokhtiy — jedno źródło) |
| Depth Jump | częściowe | setup/move: Catalyst #551 + badanie Louder i in. 2015; 3. sesja: `plyo.depthStep` dodatkowo inSPORTline (instrukcja skrzyń, „SQUAT DEPTH JUMP”). Nadal brak błędu z 2 źródłami (szukane w 3. sesji — „Otwarte”); ISSA opisuje „zeskok” i głębokie ugięcie — sprzeczność |
| Tuck Jump | gotowe | ACE #180, NASM, Catalyst #558 |
| Split Jump | gotowe | ACE #234 (Cycled Split-Squat Jump), NASM Lunge Jump |
| Lateral Box Jump | gotowe (warunkowo) | 3. sesja: setup/move — ISSA (17.06.2024) + The Prehab Guys „Counter Movement Lateral Vertical Box Jump”. Lądowanie i błąd — Prehab Guys (to ćwiczenie) + ACE #115 jako **wariant: skok na skrzynię przodem** (ISSA nazywa skok boczny wariantem box jumpa) — do oceny recenzenta; bez wariantu → „częściowe” |
| Lateral Bound | otwarte | nadal jedno przeczytane źródło szczebla 4 (The Prehab Guys) |
| Star Jump | otwarte | jedyne opisy: Topend Sports (bez autora → 5) i karta fizjoterapii trustu NHS (bez daty, inny wariant lądowania) — za mało |
| Bench Jump | otwarte | 3. sesja: definicja niejednoznaczna — katalog (25-biblioteka L6) „przeskoki przez ławkę”, figura ze skrzynią, jedyny znaleziony opis producenta ławek (Bells of Steel, 22.11.2023, bez autora, ton marketingowy → 5) — wskok NA ławkę. Brak źródeł szczebla 4 w ACE/NASM/ISSA/Catalyst |
| Frog Hops | otwarte | 3. sesja: szukane w ACE/NASM/ISSA/NFPT — brak; wyniki to strony aplikacji, blogi sklepów i serwisy bez autora (szczebel 5) |
| Kneeling Jump Squat | otwarte | 3. sesja: jedno źródło — EliteFTS (N. Harvey, 10.11.2017; szczebel do decyzji: sklep sprzętu z blogiem trenerów); Catalyst — brak w dziale skoków (19 ćwiczeń sprawdzonych) |

## 2. Dane (propozycja do `data/zrodla/cues.json`) — NIEAKTUALNY — patrz przeliczenie 02.11.2026

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
    "prehab-cm-lat-box-jump": {"org": "The Prehab Guys", "title": "Counter Movement Lateral Vertical Box Jump", "url": "https://theprehabguys.com/vimeo-video/counter-movement-lateral-vertical-box-jump/", "level": 4},
    "issa-box-jump-strategies": {"org": "ISSA", "title": "5 Strategies to Boost Your Box Jump Results (17.06.2024)", "url": "https://www.issaonline.com/blog/post/5-strategies-to-boost-your-box-jump-results", "level": 4},
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
        {"c": "plyo.depthStep", "s": [["catalyst-551", "Instructions (stand at the front edge of a box … step off)"], ["pmc-4723169", "Methods (subjects were asked to step forward off the box)"], ["insportline-qt1005", "s. 3, SQUAT DEPTH JUMP, Action (Step off the box) — źródło zdefiniowane w plyo-cz2"]]}
      ],
      "move": [
        {"c": "plyo.depthRebound", "s": [["catalyst-551", "Instructions (land on the balls of both feet … drive straight back up)"], ["pmc-4723169", "Methods (subsequent vertical jump; cues: as high / as quick as possible)"]]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Lateral Box Jump": {
      "setup": [
        {"c": "plyo.latBox.setup", "s": [["issa-box-jump-strategies", "część o wariantach: lateral box jump (standing to one side of the box)"], ["prehab-cm-lat-box-jump", "HOW (box set to the right of you; start with both feet on the ground)"]]}
      ],
      "move": [
        {"c": "plyo.latBox.move", "s": [["issa-box-jump-strategies", "część o wariantach: lateral box jump (jumping laterally)"], ["prehab-cm-lat-box-jump", "HOW (jump explosively up to the right, onto the box)"]]}
      ],
      "tips": [
        {"c": "bj.land", "s": [["prehab-cm-lat-box-jump", "COMPENSATION (bend hips and knees; send the hips back)"], ["ace-115", "Step 4–6 (wariant: skok na skrzynię przodem)"]]}
      ],
      "mistakes": [
        {"c": "bj.mis.stiff", "s": [["prehab-cm-lat-box-jump", "COMPENSATION (if you do not let them bend much, you will land stiff and hard)"], ["ace-115", "Step 5 (wariant: skok na skrzynię przodem; avoid locking your knees)"]]}
      ]
    }
  }
}
```

Uwaga do danych: `Depth Jump` ma puste `mistakes` — status „częściowe”; programista decyduje, czy karta częściowa jest wyświetlana
(reguła briefu: ≥ 1 zdanie w setup/move i ≥ 1 w mistakes, inaczej nie „gotowe”). Weighted Jump Squat: lądowanie i błąd stoją na wariancie bez
obciążenia (ACE, NASM) + Catalyst #353 tylko dla lądowania — zgodnie z metodą wariantów z tego pliku; do oceny recenzenta.
Lateral Box Jump (3. sesja): `bj.land` i `bj.mis.stiff` mają jedno źródło tego ćwiczenia (Prehab Guys) + ACE #115 jako wariant skoku przodem —
do oceny recenzenta; jeśli wariant kierunku się nie liczy, usunąć `tips` i `mistakes` (status „częściowe”). `ace-115` i org `The Prehab Guys`
istnieją już w `cues.json`; org ISSA w `cues.json` NIE istnieje — definicja w `plyo-cz2.md` (sprostowanie koordynatora 02.11.2026). `insportline-qt1005` — zdefiniowane w `plyo-cz2.md`.

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
| plyo.latBox.setup (3. sesja) | Stań bokiem do skrzyni. | Stand side-on to the box. |
| plyo.latBox.move (3. sesja) | Wskocz na skrzynię w bok. | Jump sideways up onto the box. |
| ~~plyo.wjsBar~~ (wycofane 2. sesja) | Sztanga na górze pleców, trzymana mocno, żeby się nie przesuwała. | — „trzymana mocno” potwierdza tylko Catalyst; zastąpione przez `plyo.wjsBarBack` |

Użyte istniejące zdania (treść sprawdzona słowo w słowo ze źródłami ćwiczenia): `lunge.stand`, `jump.drive` (tylko Tuck Jump),
`jump.land`, `jump.mis.stiff`; w 3. sesji `bj.land` („ugięte kolana, biodra cofnięte w tył” — Prehab Guys: bend hips and knees, send the hips back)
i `bj.mis.stiff` dla Lateral Box Jump (z zastrzeżeniem wariantu). `sq.back` wycofane z Weighted Jump Squat (jedno źródło po zmianie szczebli).
`bj.setup`/`bj.move` (stanie przed skrzynią, wskok przodem) nie pasują do Lateral Box Jump.

## 4. Źródła

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-116 | https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/ | ACE | 4 | Step 1–7, wskazówki końcowe |
| ace-177 | https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/ | ACE | 4 | Step 1–7, wskazówka końcowa |
| ace-180 | https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/ | ACE | 4 | Step 1–4, wskazówki i wariant |
| ace-234 | https://www.acefitness.org/resources/everyone/exercise-library/234/cycled-split-squat-jump/ | ACE | 4 | Step 1–5, wskazówki końcowe |
| ace-120 (nieużyte tu) | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Step 1–8 — skoki obunóż w bok przez pachołki; inne ćwiczenie niż Lateral Bound / Lateral Box Jump |
| ace-115 (istniejące) | https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ | ACE | 4 | Step 4–6 (lądowanie) — użyte w 3. sesji jako wariant dla Lateral Box Jump |
| nasm-squat-jump | https://www.nasm.org/resource-center/exercise-library/squat-jump | NASM | 4 | Step 1–4, Common Mistakes |
| nasm-tuck-jump | https://www.nasm.org/resource-center/exercise-library/tuck-jump | NASM | 4 | Step 1–4, Common Mistakes |
| nasm-lunge-jump | https://www.nasm.org/resource-center/exercise-library/lunge-jump | NASM | 4 | Step 1–4, Common Mistakes |
| catalyst-353 | https://catalystathletics.com/exercise/353/Back-Squat-Jump/ | Catalyst Athletics | 4 | Instructions pkt 1–4 (ciężar 20–30% pominięty — liczba) |
| catalyst-549 | https://www.catalystathletics.com/exercise/549/Broad-Jump/ | Catalyst Athletics | 4 | opis, Instructions pkt 1–3, wariant |
| catalyst-551 | https://catalystathletics.com/exercise/551/Depth-Jump/ | Catalyst Athletics | 4 | Instructions; Variations („heels … touch”), wysokość/progresja (liczby pominięte); brak listy błędów (sprawdzone ponownie w 2. sesji) |
| catalyst-555 | https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/ | Catalyst Athletics | 4 | Instructions |
| catalyst-558 | https://catalystathletics.com/exercise/558/Tuck-Jump/ | Catalyst Athletics | 4 | opis |
| catalyst-dzial-16 (3. sesja, nieużyte) | https://www.catalystathletics.com/exercises/section/16/Jumping-Plyometrics/ | Catalyst Athletics | 4 | lista 19 ćwiczeń działu skoków — brak skoku z klęku, skoku bocznego na skrzynię, skoków przez ławkę i „żabek” |
| prehab-broad-jump | https://theprehabguys.com/vimeo-video/broad-jump-2/ | The Prehab Guys | 4 | HOW, FEEL, COMPENSATION: „If you do not let them bend much, you will land "stiff" and hard.”; „They should not dive inwards on the landing.” |
| prehab-cm-lat-box-jump (3. sesja) | https://theprehabguys.com/vimeo-video/counter-movement-lateral-vertical-box-jump/ | The Prehab Guys | 4 | HOW: skrzynia „to the right of you”, start obunóż, wyskok w bok na skrzynię; COMPENSATION: kolana nie do środka, „you will land "stiff" and hard”, biodra w tył. Nie mówi wprost o lądowaniu obiema stopami na skrzyni |
| issa-box-jump-strategies (3. sesja) | https://www.issaonline.com/blog/post/5-strategies-to-boost-your-box-jump-results | ISSA (firmowane, 17.06.2024) | 4 | lateral box jump: „standing to one side of the box and jumping laterally”; dla tego wariantu brak lądowania i błędów; dla zwykłego box jumpa: start na szerokość barków, zamach rąk, lądowanie na środku skrzyni |
| pmc-4723169 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4723169/ | Louder, Bressel, Bressel (Utah State University) | 3 | Methods (procedura depth jump) |
| pmc-6724584 | https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/ | Suchomel i in. (J Hum Kinet 2019) | 3 | Methods, Procedures: „The JS exercise was performed by holding the external load on the upper back, similar to a back squat.”; szybkie ugięcie i skok „as high as possible”; lądowania nie opisuje |
| rogue-jump-squat (wycofane) | https://www.roguecanada.ca/theindex/movement-library/movement-demo-jump-squat | Rogue Fitness (producent) | 5 dla tego ćwiczenia | producent, ćwiczenie bez jego sprzętu (rozstrzygnięcie 02.11) |
| torokhtiy-barbell-squat-jump (wycofane) | https://torokhtiy.com/blogs/guides/barbell-squat-jump | Torokhtiy Weightlifting (producent akcesoriów) | 5 dla tego ćwiczenia | technika, Common mistakes — nie liczone po rozstrzygnięciu 02.11 |
| performance-herts-broad-jump (nieużyte) | https://performanceherts.co.uk/news-exercise-of-the-month-1257 | Performance Herts (centrum sportu Univ. of Hertfordshire) | do decyzji koordynatora (brak autora; nie organizacja szkoląca trenerów) | Step 1–4, Common mistakes: „Landing with straight legs” — potwierdza `jump.mis.stiff` jako 3. źródło, niewliczone |
| issa-plyo-guide (nieużyte) | https://www.issaonline.com/blog/post/the-essential-guide-to-plyometrics-plus-a-sample-workout | ISSA (firmowane, 05.02.2024) | 4 | Depth jump: „Jump off a box, landing on the floor. Allow your knees to do a deep bend, then do a vertical jump.” — sprzeczne z Catalyst/Louder (krok, szybkie odbicie); broad jump tylko z nazwy |
| justfly-depth-jump (nieużyte) | https://www.just-fly-sports.com/depth-jump-guide/ | Just Fly Sports (J. Smith; bez podpisu na stronie) | 5 (brak autora i daty na stronie) | „Athletes shouldn't simply drop straight down off the box…”; pięty uderzające mocno = za wysoka skrzynia |
| elitefts-depth (nieużyte) | https://elitefts.com/blogs/training/depth-jumps-and-depth-land-progressions-to-increase-the-vertical-jump | EliteFTS (C. Janek, 09.10.2018) | 4? (do decyzji — sklep sprzętu z blogiem) | opisuje głównie depth land; brak listy błędów depth jump |
| elitefts-kneeling-jumps (3. sesja, nieużyte) | https://elitefts.com/coaching-logs/daily-movements-kneeling-jumps-with-weight | EliteFTS (N. Harvey, 10.11.2017) | 4? (do decyzji — jak wyżej) | start z klęku, biodra wyprostowane; „Drop your hips down quickly and rebound up…”; lądowanie w pozycji atletycznej, kolana lekko na zewnątrz, klatka w górze; brak listy błędów. Jedyne źródło dla Kneeling Jump Squat |
| nsca-schexnayder-2022 (3. sesja, nieużyte) | https://www.nsca.com/globalassets/events/pdf/nat22/schexnayder-boo-hands-on-talk.pdf | NSCA — konferencja krajowa 2022 (B. Schexnayder, CSCS) | 4 (materiał NSCA z autorem i datą) | s. 1–9: same hasła programowania (wysokość skrzyni, gęstość) — brak opisu techniki i błędów depth jump |
| bellsofsteel-bench-jumps (3. sesja, nieużyte) | https://bellsofsteel.us/blogs/content/bench-jumps | Bells of Steel (producent ławek; blog bez autora, 22.11.2023) | 5 (bez autora, ton marketingowy) | wskok NA ławkę, lądowanie na ugiętych kolanach, zejście krokiem — inna definicja niż katalog („przez ławkę”) |
| pmc-4637913 (3. sesja, nieużyte) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4637913/ | Davies, Riemann, Manske 2015 (przegląd narracyjny) | 3 | Tab. 6 — tylko nazwy ćwiczeń (m.in. side to side push off jumps, single leg push off box, depth jumps); brak opisów wykonania i błędów (przeczytane do ok. 100 tys. znaków) |
| nhs-kmpt-star-jumps (nieużyte) | https://www.kentmedwaymentalhealth.nhs.uk/pdf-documents/coronavirus-documents/coronavirus-page-documents/physiotherapy-cardio-workout/star-jumps-and-butt-kicks/ | trust NHS (fizjoterapia) | 4? (placówka medyczna; daty na stronie brak) | Star jumps: „Jump as high as you can into a big star shape.”; lądowanie z rozstawionymi nogami (inny wariant) |
| prehab-continuous-lateral-bound (nieużyte) | https://theprehabguys.com/vimeo-video/continuous-lateral-bound/ | The Prehab Guys | 4 | HOW, COMPENSATION — jedyne źródło dla Lateral Bound |
| topendsports-star-jumps (nieużyte) | https://www.topendsports.com/fitness/technique/star-jumps.htm | Topend Sports | 5 (brak autora i daty) | technika pkt 1–4 |

Niedostępne: NASM `broad-jump`, `depth-jump(s)`, `split-jump`, `lateral-bound`, `skater-jumps`, `star-jumps`, `broad-jumps` (404);
NSCA wideo „Exercise Technique: Depth Jump” (403); Dick's Sporting Goods „How to Do a Lateral Bound” (403, ponownie w 2. sesji); stack.com (503, ponownie);
Rogue `movement-demo-broad-jump` (404); The Prehab Guys „Squat Jumps” (logowanie), `lateral-box-jump/` i `depth-jump/` (404, 3. sesja); Royal Navy „star jumps” (403); simplifaster.com (403);
elitefts `/education/…` (404). Brookbush Institute „lateral hop to single leg box jump” — treść instrukcji niewidoczna (3. sesja). ACE: mapa strony sprawdzona w całości do id ~377 — brak „bound”, „skater”, „star”, „frog”, „depth”;
filtr sprzętu „Raised Platform/Box” (3. sesja) — tylko #246, #115, #206, #230, #211, #28.

## 5. Otwarte

- **Ręce w Jump Squat** — ACE #116 (Step 7: zamach rąk jako utrudnienie) i NASM (zamach w górę) vs Catalyst #555 (ręce nieruchomo przy klatce).
  Ten sam szczebel, różnica → do karty tylko część wspólna (`plyo.extend` bez rąk); zdanie zestawu ogólnego `jump.drive` NIE wpisane dla Jump Squat.
- **Głębokość przysiadu przed wybiciem (Jump Squat)** — NASM: ćwierć/pół przysiadu; ACE: do momentu, gdy pięty mają się oderwać; Catalyst #555: pełny
  przysiad. Bez liczby/głębokości w zdaniu (`plyo.dip`).
- **Rozstaw stóp** — ACE i NASM: na szerokość bioder; Catalyst (Tuck Jump), Prehab Guys i Performance Herts (skok w dal): na szerokość barków; ACE #177:
  szerzej niż biodra. Dla Jump Squat i Tuck Jump `lunge.stand` opiera się na ACE + NASM; dla Broad Jump pominięte.
- **Broad Jump — kolana do środka** (`sq.mis.kneesIn`): tylko The Prehab Guys (COMPENSATION). Drugie źródło brak — nie wpisane.
- **Broad Jump — „reset po każdym skoku”** (Catalyst) vs skoki ciągłe jako wariant (ACE Step 7) — nie wpisane.
- **Depth Jump — błąd** (szukane ponownie w 3. sesji: NSCA — wideo 403, prezentacja Schexnayder 2022 bez techniki; Prehab Guys — brak strony; Davies 2015 — tylko nazwy;
  instrukcja skrzyń inSPORTline — bez błędów): brak dwóch źródeł szczebla 4. Kandydaci: „zeskok prosto w dół zamiast kroku w przód” (Just Fly — szczebel 5; Stack niedostępny),
  „pięty mocno uderzają = skrzynia za wysoka” (Just Fly; Catalyst każe pozwolić piętom dotknąć podłogi — sprzeczność). Nie wpisane.
  Następny krok: rozdział o pliometrii w podręczniku NSCA (Essentials of Strength Training and Conditioning — szczebel 3, zdjęcia z 2008 r. krążą w materiałach
  uczelnianych) albo fragment wydawcy, jeśli dostępny.
- **Depth Jump — sprzeczność w wykonaniu**: ISSA („Jump off a box”, „deep bend”) vs Catalyst #551 i Louder i in. (krok ze skrzyni, szybkie odbicie) — 3. sesja: krok
  potwierdza też inSPORTline. Ten sam szczebel 4 (+ badanie 3) — w danych krok ze skrzyni (szczebel 3 wygrywa), różnica zapisana tutaj.
- **Depth Jump — definicja**: katalog („zeskok z jednej skrzyni i wskok na drugą”) różni się od przeczytanych źródeł (zeskok i wyskok pionowy z
  podłogi). Do decyzji analityka.
- **Weighted Jump Squat** — `sq.back` (plecy proste) i „skacz prosto w górę, nie w przód” — tylko Catalyst #353; ciężar — liczba, nie wpisane.
- **Lateral Bound** — tylko The Prehab Guys. Szukane w 2. sesji: ACE (brak w mapie strony), NASM (404), ISSA (tylko „skater hop” z nazwy, bez opisu),
  NFPT (brak wyników), sklep sportowy (403); reszta wyników — strony aplikacji i serwisy bez autora.
- **Star Jump** — Topend Sports (szczebel 5) + trust NHS (bez daty; lądowanie w rozkroku = inny wariant niż Topend, który wraca do przysiadu). Część wspólna
  (wyskok z rozłożeniem rąk i nóg w gwiazdę) ma tylko jedno źródło spełniające kryteria — nie wpisane. Royal Navy (403) — do ponowienia.
- **Lateral Box Jump** (3. sesja) — (a) czy skok przodem na skrzynię (ACE #115) liczy się jako wariant dla lądowania i błędu — do oceny recenzenta;
  (b) `sq.mis.kneesIn` (kolana do środka) — tylko Prehab Guys; (c) „lądowanie obiema stopami na skrzyni” — żadne z dwóch źródeł nie mówi wprost, nie wpisane;
  (d) zestaw ogólny nie dotyczy (ćwiczenie nie ma dziś zestawu `jump` w cue-sets — sprawdzić przy wdrożeniu).
- **Bench Jump** (3. sesja) — definicja niejednoznaczna: katalog/L6 „przeskoki przez ławkę”, figura z „skrzynią”, producent ławek opisuje wskok NA ławkę.
  Najpierw decyzja analityka, który ruch to jest; źródeł szczebla 4 nie znaleziono (ACE/NASM/ISSA/Catalyst). Zestaw ogólny `jump` (`jump.drive`, `jump.land`,
  `jump.mis.stiff`) przypisany dziś w cue-sets — niepotwierdzony dla tego ćwiczenia (informacja o błędzie zestawu).
- **Frog Hops** (3. sesja) — brak źródła szczebla 4; opisy tylko w serwisach bez autora, sklepach i stronach aplikacji (pominięte). Źródła różnią się (ręce do podłogi
  vs za głową; skok w miejscu vs w przód) — nawet przy źródłach trzeba część wspólną.
- **Kneeling Jump Squat** (3. sesja) — jedno źródło (EliteFTS, szczebel do decyzji); katalog ma sztangę i stojak — EliteFTS opisuje wersję z ciężarem ogólnie
  („with weight”), bez sztangi wprost. Nie wpisane.
- **Do decyzji koordynatora — szczeble**: Performance Herts (uczelniane centrum sportu, bez autora), NISMAT/trust NHS (placówki medyczne — reguła
  „materiał placówki medycznej z datą” dotyczy tu analogicznie), EliteFTS (sklep sprzętu z blogiem eksperckim; artykuły z autorem i datą).

## 6. Stan

- Zrobione (1. sesja): Jump Squat, Tuck Jump, Split Jump, Weighted Jump Squat; Broad Jump i Depth Jump częściowo.
- Zrobione (2. sesja, 02.11): Broad Jump → gotowe (błąd z Prehab Guys); szczeble poprawione wg rozstrzygnięcia 02.11 (Rogue, Torokhtiy, Topend wycofane;
  Weighted Jump Squat przebudowany na Catalyst + Suchomel 2019, `plyo.wjsBar` → `plyo.wjsBarBack`, `sq.back` wycofane); Depth Jump — błędy szukane, nadal otwarte;
  Lateral Bound i Star Jump — szukane, nadal otwarte.
- Zrobione (3. sesja, 02.11): Lateral Box Jump → gotowe warunkowo (ISSA + Prehab Guys; lądowanie/błąd z wariantem przodem); Bench Jump, Frog Hops, Kneeling Jump Squat —
  szukane, nadal otwarte (powody w „Otwarte”); Depth Jump — błąd szukany ponownie (NSCA, Prehab Guys, Davies), nadal brak; `plyo.depthStep` + 3. źródło (inSPORTline).
- Stan: gotowe 5 + 1 warunkowo (Lateral Box Jump), częściowe 1 (Depth Jump), otwarte 5 (Lateral Bound, Star Jump, Bench Jump, Frog Hops, Kneeling Jump Squat).
- Zostało: błąd Depth Jump; drugie źródło Lateral Bound i Star Jump; Kneeling Jump Squat (drugie źródło); Bench Jump (najpierw definicja); Frog Hops.
- Następny krok: podręcznik NSCA (rozdział o pliometrii — fragmenty wydawcy Human Kinetics: „box drills”, „depth jumps”) — da opisy depth jump, push-off i lateral box jump
  ze szczebla 3; Royal Navy „get fit to join” (star jumps); wykaz ćwiczeń BFS (patrz `plyo-cz2.md`) nie ma opisów techniki.
- Pułapki: NASM ma tylko kilka stron skoków (`squat-jump`, `tuck-jump`, `lunge-jump`, `box-jumps`); ACE — brak „bound/skater/star/frog/depth” w mapie
  strony; Catalyst — dział skoków ma 19 ćwiczeń (lista w źródle `catalyst-dzial-16`); wyniki wyszukiwarki dla skoków to w większości strony aplikacji i sklepy
  z odzieżą (szczebel 5) — pomijać; PDF-y z obrazami czytać narzędziem Read ze stronami (WebFetch nie wyciąga tekstu z PDF).

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3) i rozstrzygnięcia koordynatora z 02.11.2026 (The Prehab Guys warunkowo 4
per strona — autor z kwalifikacjami i data; NISMAT i NHS — instytucje medyczne = 4; Torokhtiy warunkowo 4 — artykuł techniki z autorem). Strony warunkowe
sprawdzone WebFetch 02.11.2026.

| Źródło | Szczebel | Dowód |
|---|---|---|
| ACE (#116, #177, #180, #234, #115), NASM, Catalyst Athletics, ISSA | 4 | bez zmian (rozstrzygnięcie, tabela) |
| pmc-4723169 (Louder i in. 2015), pmc-6724584 (Suchomel i in. 2019) | 3 | badania, opis wykonania w metodach |
| insportline-qt1005 | 4 | producent skrzyń — instrukcja własnego sprzętu (definicja w plyo-cz2) |
| prehab-broad-jump | **nie liczy się (5)** | strona: brak autora i kwalifikacji; tylko „Updated Dec 10, 2021 / Published Jun 11, 2020” i stopka „© 2026 The Prehab Guys, Inc.” — warunek „autor z kwalifikacjami” niespełniony |
| prehab-cm-lat-box-jump | **nie liczy się (5)** | strona: brak autora; „Updated Jun 22, 2020 Published Apr 23, 2019”, stopka firmy |
| prehab-continuous-lateral-bound (nieużyte) | nie liczy się (5) | ta sama konstrukcja stron `vimeo-video` (bez autora) — nie otwierana osobno; Lateral Bound i tak 1 źródło |
| torokhtiy-barbell-squat-jump | **4** (było: wycofane) | strona: „Author: Oleksiy Torokhtiy”, podpis „Olympic Weightlifting Champion, PhD in Sport Science”, „Updated on September 16, 2024”; artykuł techniki (na stronie linki afiliacyjne i promocja produktu — treść instruktażowa, liczy się wg reguły Torokhtiy z uzup. 2) |
| nhs-kmpt-star-jumps | **4** (było: do decyzji) | trust NHS — instytucja medyczna, firmowanie wystarcza (rozstrzygnięcie koordynatora 02.11) |
| topendsports-star-jumps | 5 | bez autora i daty (bez zmian) |
| performance-herts-broad-jump (nieużyte) | 5 | uczelniane centrum sportu bez autora (uzup. 2) |
| elitefts-kneeling-jumps, elitefts-depth (nieużyte) | bez rozstrzygnięcia | EliteFTS nie ma wiersza w pliku szczebli; w sled_throw liczony jako producent sanek (własny sprzęt) — dla skoków bez sprzętu EliteFTS to nie dotyczy. Bez wpływu: Kneeling Jump Squat i tak 1 źródło |
| bellsofsteel-bench-jumps, justfly-depth-jump | 5 | bez zmian |

| Zdanie (ćwiczenie) | Źródła ≥ 4 (lub 3) po przeliczeniu | Stan |
|---|---|---|
| Jump Squat: `lunge.stand`, `plyo.dip`, `plyo.extend`, `jump.land`, `jump.mis.stiff` | ACE + NASM (+ Catalyst) | zostaje |
| Tuck Jump: `lunge.stand`, `jump.drive`, `plyo.tuck`, `jump.land`, `jump.mis.stiff` | ACE + NASM (+ Catalyst) | zostaje |
| Split Jump: `plyo.splitSetup`, `plyo.splitSwitch`, `jump.land`, `jump.mis.stiff` | ACE + NASM | zostaje |
| Weighted Jump Squat: `plyo.wjsBarBack`, `plyo.wjsMove` | Catalyst #353 + Suchomel (3) + **Torokhtiy** | zostaje (3 źródła) |
| Weighted Jump Squat: `jump.land` | Catalyst #353 + Torokhtiy („soft knees”) (+ warianty ACE/NASM) | zostaje — teraz bez potrzeby wariantu |
| Weighted Jump Squat: `jump.mis.stiff` | warianty ACE/NASM + Torokhtiy („soft knees”, błąd = zaprzeczenie standardu) | zostaje |
| Weighted Jump Squat: `sq.back` (kandydat do przywrócenia) | Torokhtiy („straight lower back”, „chest up”); Catalyst #353 — sprawdzone WebFetch: o plecach i klatce **nie mówi** („maintaining proper posture and balance”) | **nie wraca** — 1 źródło |
| Broad Jump: `plyo.broadLoad`, `plyo.broadDrive`, `plyo.broadLand` | ACE #177 + Catalyst #549 | zostaje |
| Broad Jump: `jump.mis.stiff` | ACE #177 (Step 6) + Catalyst #549 pkt 3 („absorb … by bending the knees and hips”) — błąd = zaprzeczenie standardu (ta sama część ciała, to samo kryterium); Prehab Guys odpada | zostaje (zmiana drugiego źródła) |
| Depth Jump: `plyo.depthStep`, `plyo.depthRebound` | Catalyst #551 + Louder (3) (+ inSPORTline dla kroku) | zostaje |
| Lateral Box Jump: `plyo.latBox.setup`, `plyo.latBox.move` | ISSA (Prehab Guys = 5) | **spada** |
| Lateral Box Jump: `bj.land`, `bj.mis.stiff` | ACE #115 tylko jako wariant (Prehab Guys = 5) | **spada** |
| Star Jump (nie było w danych) | NHS (4) + Topend (5) → 1 źródło; NHS opisuje inny wariant lądowania | bez zmian (poza danymi) |

| Karta | Stan przed | Stan po |
|---|---|---|
| Jump Squat | gotowe | **własna z błędami** |
| Tuck Jump | gotowe | **własna z błędami** |
| Split Jump | gotowe | **własna z błędami** |
| Weighted Jump Squat | gotowe | **własna z błędami** (Torokhtiy jako trzecie źródło; lądowanie i błąd już nie tylko na wariantach) |
| Broad Jump | gotowe | **własna z błędami** (błąd: ACE + Catalyst, błąd = zaprzeczenie standardu) |
| Depth Jump | częściowe | **własna bez błędów** (kryterium karty z 02.11: ustawienie + ruch) |
| Lateral Box Jump | gotowe (warunkowo) | **otwarta** (ustawienie i ruch — tylko ISSA) |
| Lateral Bound | otwarte | otwarta (jedyne źródło Prehab Guys = 5 → zero źródeł szczebla 4) |
| Star Jump | otwarte | otwarta (NHS = 4, ale jedno źródło) |
| Bench Jump, Frog Hops, Kneeling Jump Squat | otwarte | otwarte |

Razem cz1 (12 ćwiczeń): przed — gotowe 5 + 1 warunkowo, częściowe 1, otwarte 5; po — własne z błędami 5, własne bez błędów 1, otwarte 6.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

`insportline-qt1005` i org `inSPORTline`, `ISSA` — zdefiniowane w bloku do wdrożenia w `plyo-cz2.md` (ISSA już niepotrzebne w cz1 — Lateral Box Jump wypadł).

```json
{
 "orgs": {
  "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; podnoszenie ciężarów, G. Everett)", "level": 4, "kind": "site"},
  "Louder, Bressel, Bressel (Utah State University)": {"name": "Louder, Bressel, Bressel (Utah State University) — badanie, J Hum Kinet 2015 (użyty tylko opis wykonania)", "level": 3, "kind": "study"},
  "Suchomel i in. (J Hum Kinet 2019)": {"name": "Suchomel, McKeever, Sijuwade, Carpenter, McMahon, Loturco, Comfort — badanie, J Hum Kinet 2019 (użyty tylko opis wykonania)", "level": 3, "kind": "study"},
  "Torokhtiy": {"name": "Torokhtiy Weightlifting — przewodniki techniki z autorem (O. Torokhtiy, podpis: „Olympic Weightlifting Champion, PhD in Sport Science”); sklep i programy — nie źródło", "level": 4, "kind": "site"}
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
  "pmc-4723169": {"org": "Louder, Bressel, Bressel (Utah State University)", "title": "The Kinetic Specificity of Plyometric Training: Verbal Cues Revisited (J Hum Kinet 2015;49:201–208)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4723169/", "level": 3},
  "pmc-6724584": {"org": "Suchomel i in. (J Hum Kinet 2019)", "title": "The Effect of Load Placement on the Power Production Characteristics of Three Lower Extremity Jumping Exercises (J Hum Kinet 2019)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6724584/", "level": 3},
  "torokhtiy-barbell-squat-jump": {"org": "Torokhtiy", "title": "Barbell Squat Jump (O. Torokhtiy, akt. 16.09.2024)", "url": "https://torokhtiy.com/blogs/guides/barbell-squat-jump", "level": 4}
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
    {"c": "plyo.wjsBarBack", "s": [["catalyst-353", "Instructions, pkt 1 (bar in back squat position, held tightly against the body)"], ["pmc-6724584", "Methods, Procedures (external load on the upper back, similar to a back squat)"], ["torokhtiy-barbell-squat-jump", "technika (bar on the shoulders behind the neck, like a back squat)"]]}
   ],
   "move": [
    {"c": "plyo.wjsMove", "s": [["catalyst-353", "Instructions, pkt 2 (drive up … maximal vertical jump)"], ["pmc-6724584", "Methods, Procedures (rapid countermovement, then jump as high as possible)"], ["torokhtiy-barbell-squat-jump", "technika (jump as high as possible)"]]}
   ],
   "tips": [
    {"c": "jump.land", "s": [["catalyst-353", "Instructions, pkt 4 (absorb the landing)"], ["ace-116", "Step 5 (wariant: bez obciążenia)"], ["nasm-squat-jump", "Step 4: Return/Descent (wariant: bez obciążenia)"], ["torokhtiy-barbell-squat-jump", "technika (land on soft knees)"]]}
   ],
   "mistakes": [
    {"c": "jump.mis.stiff", "s": [["nasm-squat-jump", "Common Mistakes, pkt 1 (wariant: bez obciążenia)"], ["ace-116", "Step 5 (wariant: bez obciążenia)"], ["torokhtiy-barbell-squat-jump", "technika (land on soft knees) — błąd = zaprzeczenie standardu"]]}
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
    {"c": "jump.mis.stiff", "s": [["ace-177", "Step 6 (lądowanie na prostych kolanach)"], ["catalyst-549", "Instructions, pkt 3 (absorb the landing by bending the knees and hips) — błąd = zaprzeczenie standardu"]]}
   ]
  },
  "Depth Jump": {
   "setup": [
    {"c": "plyo.depthStep", "s": [["catalyst-551", "Instructions (stand at the front edge of a box … step off)"], ["pmc-4723169", "Methods (subjects were asked to step forward off the box)"], ["insportline-qt1005", "s. 3, SQUAT DEPTH JUMP, Action (Step off the box) — źródło zdefiniowane w plyo-cz2"]]}
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

Nowe zdania w bloku (12): `plyo.dip`, `plyo.extend`, `plyo.tuck`, `plyo.splitSetup`, `plyo.splitSwitch`, `plyo.broadLoad`, `plyo.broadDrive`, `plyo.broadLand`,
`plyo.wjsBarBack`, `plyo.wjsMove`, `plyo.depthStep`, `plyo.depthRebound`. Wypadły z bloku: `plyo.latBox.setup`, `plyo.latBox.move` (+ użycia `bj.land`, `bj.mis.stiff` w Lateral Box Jump).

Wątpliwości:
1. Sekcja 5 („Weighted Jump Squat — `sq.back` … tylko Catalyst #353”) była nieścisła: strona Catalyst #353 (WebFetch 02.11) nie mówi o plecach ani o klatce; „plecy proste, klatka w górze” podaje tylko Torokhtiy.
2. Lateral Box Jump wróci do „własnej” przy drugim źródle szczebla 4 dla ustawienia i ruchu (obok ISSA) — strony Prehab Guys z autorem nie znaleziono w tej sesji (nie szukano szeroko).
3. Lateral Bound / Prehab Guys „Continuous Lateral Bound” — strony nie otwierałem; wniosek „bez autora” z tej samej konstrukcji dwóch otwartych stron `vimeo-video`.
