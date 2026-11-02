# Wskazówki techniki — rodzina plyo (skoki), część 1

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3). Zadanie: tylko zbieranie danych (polecenie właściciela 02.11.2026) —
nic nie jest w `data/zrodla/cues.json` ani `lib/`. Wdrożenie — programista po akceptacji; teksty EN — tłumacz (propozycje niżej).

Metoda: wyjątek dla wskazówek techniki z CLAUDE.md — każde zdanie ma ≥ 2 przeczytane, niezależne źródła (różne organizacje) szczebla 4
albo wyższego; wariant tego samego ćwiczenia (inny sprzęt, z obciążeniem / bez) liczy się z opisem „(wariant: …)”, inne ćwiczenie — nie.
Liczby (wysokość skrzyni, ciężar, serie) i twierdzenia o zdrowiu („chroni kolana”, „ryzyko kontuzji”) ze źródeł pominięte.
Zdania zestawu ogólnego „jump” użyte tylko tam, gdzie przeczytane źródła danego ćwiczenia je potwierdzają (uzupełnienie briefu 02.11).
Strony innych aplikacji treningowych pominięte (nie są źródłem, nazw nie zapisuję). ExRx i web.archive.org — niedostępne, nie użyte.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Jump Squat | gotowe | ACE #116, NASM, Catalyst #555, Rogue; bez zdania o rękach (źródła się różnią — „Otwarte”) |
| Broad Jump | częściowe | setup/move/wskazówka potwierdzone (ACE #177, Catalyst #549); brak błędu z 2 źródłami |
| Weighted Jump Squat | gotowe | Catalyst #353, Torokhtiy; błąd lądowania — także warianty bez obciążenia (ACE #116, NASM) |
| Depth Jump | częściowe | setup/move: Catalyst #551 + badanie Louder i in. 2015; brak błędu z 2 źródłami; definicja w katalogu (skok na drugą skrzynię) różni się od źródeł — „Otwarte” |
| Tuck Jump | gotowe | ACE #180, NASM, Catalyst #558 |
| Split Jump | gotowe | ACE #234 (Cycled Split-Squat Jump), NASM Lunge Jump |
| Lateral Bound | otwarte | tylko jedno przeczytane źródło szczebla 4 |
| Bench Jump | otwarte | brak przeczytanych źródeł; niejasna definicja (przeskok przez ławkę czy wskok) |
| Lateral Box Jump | otwarte | brak przeczytanych źródeł |
| Star Jump | otwarte | tylko jedno przeczytane źródło szczebla 4 |
| Frog Hops | otwarte | brak drugiego źródła; źródła różnią się (skoki ciągłe vs reset po każdym) |
| Kneeling Jump Squat | otwarte | brak źródeł szczebla 4 (znalezione tylko strony aplikacji i baz ćwiczeń) |

## 2. Dane (propozycja do `data/zrodla/cues.json`)

```json
{
  "orgs": {
    "Catalyst Athletics": {
      "name": "Catalyst Athletics — Exercise Library (catalystathletics.com; podnoszenie ciężarów, G. Everett)",
      "level": 4,
      "kind": "site"
    },
    "Rogue Fitness": {
      "name": "Rogue Fitness — The Index, Movement Library (producent sprzętu)",
      "level": 4,
      "kind": "maker"
    },
    "Torokhtiy Weightlifting": {
      "name": "Torokhtiy Weightlifting — Guides (producent sprzętu do podnoszenia ciężarów; autor O. Torokhtiy, PhD nauk o sporcie)",
      "level": 4,
      "kind": "maker"
    },
    "Louder, Bressel, Bressel (Utah State University)": {
      "name": "Louder, Bressel, Bressel (Utah State University) — badanie, J Hum Kinet 2015 (użyty tylko opis wykonania)",
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
    "rogue-jump-squat": {"org": "Rogue Fitness", "title": "Movement Demo | Jump Squat", "url": "https://www.roguecanada.ca/theindex/movement-library/movement-demo-jump-squat", "level": 4},
    "torokhtiy-barbell-squat-jump": {"org": "Torokhtiy Weightlifting", "title": "Barbell Squat Jump", "url": "https://torokhtiy.com/blogs/guides/barbell-squat-jump", "level": 4},
    "pmc-4723169": {"org": "Louder, Bressel, Bressel (Utah State University)", "title": "The Kinetic Specificity of Plyometric Training: Verbal Cues Revisited (J Hum Kinet 2015;49:201–208)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4723169/", "level": 3}
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
        {"c": "jump.land", "s": [["ace-116", "Step 5 (land softly; don't lock out the knees)"], ["nasm-squat-jump", "Step 4: Return/Descent (land softly … bent knees)"], ["catalyst-555", "Instructions (absorb the landing … bending the knees and hips)"], ["rogue-jump-squat", "Landing"]]}
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
        {"c": "plyo.wjsBar", "s": [["catalyst-353", "Instructions, pkt 1 (holding the bar tightly against your body)"], ["torokhtiy-barbell-squat-jump", "technika (bar well fixed on the traps)"]]}
      ],
      "move": [
        {"c": "plyo.wjsMove", "s": [["catalyst-353", "Instructions, pkt 2 (drive up … maximal vertical jump)"], ["torokhtiy-barbell-squat-jump", "technika (squat down, jump as high as you can)"]]}
      ],
      "tips": [
        {"c": "sq.back", "s": [["torokhtiy-barbell-squat-jump", "Common mistakes: poor form (chest up, don't round your back)"], ["catalyst-353", "Instructions, pkt 3 (keep your posture upright)"]]},
        {"c": "jump.land", "s": [["torokhtiy-barbell-squat-jump", "technika: landing (always land on soft knees)"], ["catalyst-353", "Instructions, pkt 4 (absorb the landing and squat into the next rep)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["torokhtiy-barbell-squat-jump", "technika: landing (always land on soft knees)"], ["nasm-squat-jump", "Common Mistakes, pkt 1 (wariant: bez obciążenia)"], ["ace-116", "Step 5 (wariant: bez obciążenia)"]]}
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
      "mistakes": []
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

Uwaga do danych: `Broad Jump` i `Depth Jump` mają puste `mistakes` — status „częściowe”; programista decyduje, czy karta częściowa jest wyświetlana
(reguła briefu: ≥ 1 zdanie w setup/move i ≥ 1 w mistakes, inaczej nie „gotowe”).

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
| plyo.wjsBar | Sztanga na górze pleców, trzymana mocno, żeby się nie przesuwała. | Bar on your upper back, held tight so it doesn't shift. |
| plyo.wjsMove | Zejdź do przysiadu i wybij się w górę jak najmocniej. | Squat down and jump up as hard as you can. |
| plyo.depthStep | Zejdź ze skrzyni krokiem w przód. | Step forward off the box. |
| plyo.depthRebound | Wyląduj na obu stopach i od razu, jak najszybciej, odbij się w górę. | Land on both feet and spring straight back up as fast as you can. |

Użyte istniejące zdania (treść sprawdzona słowo w słowo ze źródłami ćwiczenia): `lunge.stand`, `jump.drive` (tylko Tuck Jump),
`jump.land`, `jump.mis.stiff`, `sq.back`. Zdań Box Jump (`bj.*`) nie użyłem: `bj.land` („biodra cofnięte”) i `bj.setup`/`bj.move` (skrzynia)
nie pasują słowo w słowo do żadnego z ćwiczeń tej części.

## 4. Źródła

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-116 | https://www.acefitness.org/resources/everyone/exercise-library/116/squat-jumps/ | ACE | 4 | Step 1–7, wskazówki końcowe |
| ace-177 | https://www.acefitness.org/resources/everyone/exercise-library/177/forward-linear-jumps/ | ACE | 4 | Step 1–7, wskazówka końcowa |
| ace-180 | https://www.acefitness.org/resources/everyone/exercise-library/180/tuck-jump/ | ACE | 4 | Step 1–4, wskazówki i wariant |
| ace-234 | https://www.acefitness.org/resources/everyone/exercise-library/234/cycled-split-squat-jump/ | ACE | 4 | Step 1–5, wskazówki końcowe |
| ace-120 (nieużyte) | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Step 1–8 — skoki obunóż w bok przez pachołki; inne ćwiczenie niż Lateral Bound / Lateral Box Jump, nie liczone |
| nasm-squat-jump | https://www.nasm.org/resource-center/exercise-library/squat-jump | NASM | 4 | Step 1–4, Common Mistakes |
| nasm-tuck-jump | https://www.nasm.org/resource-center/exercise-library/tuck-jump | NASM | 4 | Step 1–4, Common Mistakes |
| nasm-lunge-jump | https://www.nasm.org/resource-center/exercise-library/lunge-jump | NASM | 4 | Step 1–4, Common Mistakes |
| catalyst-353 | https://catalystathletics.com/exercise/353/Back-Squat-Jump/ | Catalyst Athletics | 4 | Instructions pkt 1–4 (ciężar 20–30% pominięty — liczba) |
| catalyst-549 | https://www.catalystathletics.com/exercise/549/Broad-Jump/ | Catalyst Athletics | 4 | opis, Instructions pkt 1–3, wariant |
| catalyst-551 | https://catalystathletics.com/exercise/551/Depth-Jump/ | Catalyst Athletics | 4 | Instructions, uwagi o wysokości i progresji (liczby pominięte) |
| catalyst-555 | https://catalystathletics.com/exercise/555/Squat-Vertical-Jump/ | Catalyst Athletics | 4 | Instructions |
| catalyst-558 | https://catalystathletics.com/exercise/558/Tuck-Jump/ | Catalyst Athletics | 4 | opis |
| rogue-jump-squat | https://www.roguecanada.ca/theindex/movement-library/movement-demo-jump-squat | Rogue Fitness (producent) | 4 | Set Up, Execution, Landing, Regressions, Progressions |
| torokhtiy-barbell-squat-jump | https://torokhtiy.com/blogs/guides/barbell-squat-jump | Torokhtiy Weightlifting (producent) | 4 | technika, Common mistakes |
| pmc-4723169 | https://pmc.ncbi.nlm.nih.gov/articles/PMC4723169/ | Louder, Bressel, Bressel (Utah State University) | 3 | Methods (procedura depth jump) |
| prehab-continuous-lateral-bound (nieużyte) | https://theprehabguys.com/vimeo-video/continuous-lateral-bound/ | The Prehab Guys | 4 | Exercise notes (HOW, COMPENSATION) — jedyne źródło dla Lateral Bound |
| topendsports-star-jumps (nieużyte) | https://www.topendsports.com/fitness/technique/star-jumps.htm | Topend Sports | 4 (propozycja; brak autora na stronie) | technika pkt 1–4 — jedyne źródło dla Star Jump |

Niedostępne w tej sesji: NASM `broad-jump`, `depth-jump(s)`, `split-jump`, `lateral-bound`, `skater-jumps`, `star-jumps`, `broad-jumps` (404);
NSCA wideo „Exercise Technique: Depth Jump” (403); Dick's Sporting Goods „How to Do a Lateral Bound” (403); stack.com (503);
Rogue `movement-demo-broad-jump` (404); The Prehab Guys „Squat Jumps” (przekierowanie na logowanie).

## 5. Otwarte

- **Ręce w Jump Squat** — ACE #116 (Step 7: zamach rąk jako utrudnienie) i NASM (zamach w górę) vs Catalyst #555 (ręce nieruchomo przy klatce).
  Ten sam szczebel, różnica → do karty tylko część wspólna (`plyo.extend` bez rąk); zdanie zestawu ogólnego `jump.drive` NIE wpisane dla Jump Squat.
- **Głębokość przysiadu przed wybiciem (Jump Squat)** — NASM: ćwierć/pół przysiadu; ACE: do momentu, gdy pięty mają się oderwać; Catalyst #555: pełny
  przysiad. Bez liczby/głębokości w zdaniu (`plyo.dip`).
- **Rozstaw stóp** — ACE i NASM: na szerokość bioder; Rogue (Jump Squat) i Catalyst (Tuck Jump): na szerokość barków; ACE #177 (skok w dal): szerzej
  niż biodra. Dla Jump Squat i Tuck Jump `lunge.stand` („mniej więcej na szerokość bioder”) opiera się na ACE + NASM; dla Broad Jump pominięte.
- **Broad Jump — błędy**: tylko ACE #177 Step 6 (lądowanie na prostych kolanach); Catalyst #549 nie wymienia błędów. Potrzebne drugie źródło
  dla `jump.mis.stiff`. Także „reset po każdym skoku” (Catalyst) vs skoki ciągłe jako wariant (ACE Step 7) — nie wpisane.
- **Depth Jump — definicja**: katalog („zeskok z jednej skrzyni i wskok na drugą”, fedb „Linear Depth Jump”) różni się od przeczytanych źródeł
  (zeskok i wyskok pionowy z podłogi; Catalyst nazywa wskok na skrzynię wariantem bardziej ryzykownym). Do decyzji analityka: czy wskazówki
  dotyczą wersji z podłogi. Brak błędu z 2 źródłami; `jump.land` nie wpisane (Louder i in. nie opisują lądowania).
- **Weighted Jump Squat — „skacz prosto w górę, nie w przód”** — tylko Catalyst #353 pkt 3; ciężar („lekki, pozwalający naprawdę wyskoczyć”) —
  liczba/obciążenie, pełne zasady, nie wpisane.
- **Lateral Bound** — tylko The Prehab Guys (wybicie z jednej nogi w bok, lądowanie na drugiej z zatrzymaniem; „nie poświęcaj techniki dla
  odległości”). Brak drugiego niezależnego źródła szczebla 4 (NASM 404, sklep sportowy 403, pozostałe wyniki — strony aplikacji).
- **Star Jump** — tylko Topend Sports (bez autora). Brak drugiego źródła.
- **Bench Jump** — katalog: „skoki obunóż przez ławkę lub niską skrzynię”; brak przeczytanych źródeł; najbliższe ACE #120 (skoki w bok przez
  pachołki) to inne ćwiczenie (analogia, nie liczy się).
- **Lateral Box Jump** — brak przeczytanych źródeł.
- **Frog Hops** — ACE #177 Step 7 (ciągłe skoki w przód) to wariant skoku w dal, ale Catalyst #549 zaleca reset po każdym skoku; brak źródła
  opisującego właśnie „frog hops” (głęboki przysiad, kolejne skoki). Otwarte.
- **Kneeling Jump Squat** — znalezione opisy tylko na stronach aplikacji i baz ćwiczeń (nie są źródłem); brak szczebla 4.
- Organizacje do akceptacji audytora: Catalyst Athletics (serwis specjalistyczny, 4), Rogue Fitness i Torokhtiy Weightlifting (producenci, 4),
  Topend Sports (4, brak autora — nieużyte).

## 6. Stan

- Zrobione: Jump Squat, Tuck Jump, Split Jump, Weighted Jump Squat (gotowe); Broad Jump, Depth Jump (częściowe); 6 ćwiczeń otwartych z powodem.
- Zostało: drugie źródło błędu dla Broad Jump i Depth Jump; źródła dla Lateral Bound, Star Jump, Bench Jump, Lateral Box Jump, Frog Hops,
  Kneeling Jump Squat.
- Następny krok: szukać w materiałach NSCA (artykuły/PDF o pliometrii), USA Track & Field, uczelnianych kartach ćwiczeń i u producentów sprzętu
  (np. pliometryczne skrzynie — instrukcje), oraz w otwartych badaniach (PMC) z opisem wykonania.
- Pułapki: NASM ma tylko kilka stron skoków (`squat-jump`, `tuck-jump`, `lunge-jump`, `box-jumps`); ACE — numery 115–120, 176–177, 180, 222,
  234 (mapa `acefitness.org/sitemap.xml`); wyniki wyszukiwarki dla skoków to w większości strony aplikacji — pomijać.
