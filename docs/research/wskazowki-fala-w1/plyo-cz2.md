# Wskazówki techniki — plyo, część 2 (skoki, rzadsze ćwiczenia)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3); uzupełnienia: druga i trzecia sesja tego samego zadania, 02.11.2026. Zakres: tylko zbieranie danych (bez zmian w kodzie i `data/zrodla/*.json`).

Zasada: każde zdanie w danym ćwiczeniu ma ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki w CLAUDE.md). Zdania z zestawu ogólnego `jump` (`jump.drive`, `jump.land`, `jump.mis.stiff`) wpisuję tylko tam, gdzie przeczytane źródła dla tego wariantu je potwierdzają — w pozostałych przypadkach krótsza karta albo „otwarte”.

Uwaga o zbiorze, z którego pochodzą nazwy katalogu (pole `fedb`): według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026) to szczebel 5 — **nie liczy się** do dwóch źródeł (tak samo `docs/research/26-grafiki-i-wskazowki.md` pkt 1 i 6; inaczej niż w ACG-015, gdzie był policzony przy „Dumbbell Seated Box Jump”).

**Physitrack (2. sesja):** to platforma ćwiczeń dla fizjoterapeutów — według rozstrzygnięcia 02.11 dokumentacja innych aplikacji nie jest źródłem, a jej status jest niepewny. Wpisy, które stały na Physitrack + 1 źródle, przeniosłem do osobnego bloku **„warunkowo — do decyzji koordynatora”** (sekcja 2b); w głównym bloku danych zostaje tylko to, co ma 2 źródła bez Physitrack. Producenci liczą się tylko dla własnego rodzaju sprzętu (inSPORTline — skrzynie plyometryczne: tak).

> **Przeliczenie 02.11.2026:** statusy w sekcji 1 i bloki w sekcjach 2 i 2b są NIEAKTUALNE — wiążąca jest sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026” na końcu pliku (Physitrack = 5, NISMAT = 4, kryterium karty: ustawienie + ruch).

## 1. Tabela ćwiczeń

| Klucz | Status | Uwagi |
|---|---|---|
| Dumbbell Seated Box Jump | częściowe | Tips `bj.land`, błąd `bj.mis.stiff` (te same źródła co „Box Jump”; zgodne z ACG-015). Brak: setup, move — siad przodem do skrzyni potwierdza tylko Catalyst (`fedb` się nie liczy). `jump.drive` sprzeczny z wariantem — nie wpisywać. |
| Single-Leg Lateral Hop | otwarte (warunkowo częściowe) | Setup/move/tips stały na Physitrack + The Prehab Guys → blok warunkowy 2b. Zastępstwa dla Physitrack nie znalazłem. Brak błędu: „kolano do środka” tylko Prehab Guys. |
| Lateral Cone Hops | częściowe (warunkowo gotowe) | Bez Physitrack: move `plyo.coneLat.hop` = ACE #120 + NISMAT (placówka medyczna, treść firmowana, data w adresie — szczebel do potwierdzenia). Setup, wskazówki i błąd — tylko ACE poza Physitrack → blok 2b. |
| Front Cone Hops | częściowe (warunkowo) | 3. sesja: move `plyo.coneFwd.hop` = ACE #118 + BFS (program pliometrii 2020, Drill 5b; szczebel 4 do potwierdzenia — firma szkoląca trenerów szkolnych i wyposażająca siłownie). Brak błędu z 2 źródłami. Bez uznania BFS → „otwarte”. |
| Alternate Leg Diagonal Bound | otwarte | Nie znalazłem przeczytanego opisu w bibliotece szczebla 4. |
| Box Skip | otwarte | Jedno źródło (książka szczebla 3, fragment u wydawcy) — za mało; szczebel 3 tylko gdy autor NSCA / uznany naukowiec — do sprawdzenia. |
| Single-Leg Stride Jump | otwarte | Fragment wydawcy nie otwiera się; innych źródeł szczebla 4 brak. |
| Alternate Leg Push-Off | częściowe | Setup i move: ACE + producent skrzyń (inSPORTline, własny sprzęt — liczy się). Brak błędu: lądowanie na prostych kolanach tylko ACE. Zamach rąk — sprzeczność, pominięte. |
| Single Leg Push-Off | otwarte | 3. sesja: nadal tylko ACE #230. Szukane: filtr ACE „Raised Platform/Box”, instrukcja inSPORTline (nie ma tego ćwiczenia), Davies 2015 (tylko nazwa w tab. 6), wyszukiwanie — strony aplikacji i plany drużyn bez autora. |
| Side to Side Box Shuffle | otwarte | 3. sesja: nadal tylko inSPORTline s. 3 (druga „ALTERNATING PUSH-OFF”). Davies 2015 — tylko nazwa „side to side push off jumps”; opis w materiale studentów uczelni (FISO/Haaga-Helia, zdjęcia z podręcznika © 2008 Human Kinetics) — szczebel 5, nie liczy się. |
| Double Leg Butt Kick | otwarte | Brak przeczytanego źródła szczebla 4 (wyniki dotyczą biegowego „butt kicks”, inny ruch; karta trustu NHS też opisuje wariant biegowy). |
| Single Leg Butt Kick | otwarte | Jak wyżej. |
| Side Standing Long Jump | otwarte | Brak przeczytanego źródła szczebla 4. |
| Side Hop-Sprint | otwarte | Brak przeczytanego źródła szczebla 4. |
| Single-Leg Hop Progression | otwarte | Brak przeczytanego źródła szczebla 4. |

## 2. Dane (format `data/zrodla/cues.json`) — bez Physitrack — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "sources": {
    "ace-118": {
      "org": "ACE",
      "title": "Forward Cone Jumps (#118)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/",
      "level": 4
    },
    "ace-120": {
      "org": "ACE",
      "title": "Lateral Cone Jumps (#120)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/",
      "level": 4
    },
    "ace-246": {
      "org": "ACE",
      "title": "Alternate Leg Push-off (#246)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/",
      "level": 4
    },
    "insportline-qt1005": {
      "org": "inSPORTline",
      "title": "Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises”",
      "url": "https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf",
      "level": 4
    },
    "nismat-lat-jump-cone": {
      "org": "NISMAT",
      "title": "Lateral Jump Over Cone (26.05.2020)",
      "url": "https://nismat.org/2020/05/26/lateral-jump-over-cone/amp/",
      "level": 4
    },
    "bfs-plyo-2020": {
      "org": "BFS",
      "title": "The BFS Plyometric Program — Bounding, Jumping and Plyo Drills for Athletic Movement (2020), s. 2–3 „BFS Ground Based Drills”",
      "url": "https://cdn.shopify.com/s/files/1/0209/7514/files/2020-04_Plyo_and_Jumping-02.pdf",
      "level": 4
    }
  },
  "orgs": {
    "inSPORTline": {
      "name": "inSPORTline — instrukcja zestawu skrzyń plyometrycznych (producent sprzętu)",
      "level": 4,
      "kind": "maker"
    },
    "NISMAT": {
      "name": "Nicholas Institute of Sports Medicine and Athletic Trauma (placówka medycyny sportowej, Nowy Jork) — materiały ćwiczeń (szczebel 4 do potwierdzenia przez koordynatora)",
      "level": 4,
      "kind": "site"
    },
    "BFS": {
      "name": "Bigger Faster Stronger (BFS Inc.) — programy i szkolenia trenerów szkolnych, wyposażenie siłowni i skrzynie plyo (szczebel 4 do potwierdzenia przez koordynatora)",
      "level": 4,
      "kind": "site"
    },
    "ISSA": {
      "name": "ISSA — International Sports Sciences Association (blog, treść firmowana) — dla wpisu Lateral Box Jump w plyo-cz1",
      "level": 4,
      "kind": "site"
    }
  },
  "exercises": {
    "Lateral Cone Hops": {
      "setup": [],
      "move": [
        {"c": "plyo.coneLat.hop", "s": [["ace-120", "Step 2–3"], ["nismat-lat-jump-cone", "instrukcja, zdanie 2 (jump with both feet sideways over the cone, then back)"]]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Front Cone Hops": {
      "setup": [],
      "move": [
        {"c": "plyo.coneFwd.hop", "s": [["ace-118", "Step 1, 3 i 7 (cones in a straight line; explode forward and upwards over the first cone, then the second)"], ["bfs-plyo-2020", "s. 2, Drill 5b (Both Feet - Straight ahead, over multiple implements in a row; implements: cones)"]]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Alternate Leg Push-Off": {
      "setup": [
        {"c": "plyo.pushoff.setup", "s": [["ace-246", "Step 1"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Start"]]}
      ],
      "move": [
        {"c": "plyo.altPushoff.move", "s": [["ace-246", "Step 2–3"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Action"]]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Dumbbell Seated Box Jump": {
      "setup": [],
      "move": [],
      "tips": [
        {"c": "bj.land", "s": [["ace-115", "Step 4–6"], ["nasm-box-jumps", "Common Mistakes (landing with straight knees)"]]}
      ],
      "mistakes": [
        {"c": "bj.mis.stiff", "s": [["nasm-box-jumps", "Common Mistakes"], ["ace-115", "Step 5 (avoid locking your knees)"]]}
      ]
    }
  }
}
```

## 2b. Warunkowo — do decyzji koordynatora (wpisy stojące na Physitrack + 1 źródle) — NIEAKTUALNY — patrz przeliczenie 02.11.2026 (Physitrack = 5, blok odrzucony)

Wyniki pierwszej sesji, zachowane bez zmian. Wdrożyć tylko, jeżeli koordynator uzna Physitrack za źródło szczebla 4; inaczej pozostają otwarte.

```json
{
  "sources": {
    "physitrack-lat-hops-hurdles": {"org": "Physitrack", "title": "Lateral hops over hurdles", "url": "https://uk.physitrack.com/home-exercise-video/lateral-hops-over-hurdles", "level": 4},
    "physitrack-lat-jumps-hurdles": {"org": "Physitrack", "title": "Lateral jumps over hurdles", "url": "https://uk.physitrack.com/home-exercise-video/lateral-jumps-over-hurdles", "level": 4},
    "prehab-lat-sl-hop-cone": {"org": "The Prehab Guys", "title": "Lateral Single Leg Hop With Cone", "url": "https://theprehabguys.com/vimeo-video/lateral-single-leg-hop-with-cone/", "level": 4}
  },
  "exercises": {
    "Lateral Cone Hops": {
      "setup": [
        {"c": "plyo.coneLat.setup", "s": [["ace-120", "Step 1"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdania 1–2"]]}
      ],
      "move": [
        {"c": "plyo.coneLat.move", "s": [["ace-120", "Step 2–3; Step 7"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdania 2–5"]]}
      ],
      "tips": [
        {"c": "jump.land", "s": [["ace-120", "Step 5"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdanie 3"]]},
        {"c": "plyo.landTrunk", "s": [["ace-120", "Step 6"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdania 3–4"]]},
        {"c": "plyo.quickOff", "s": [["ace-120", "Step 3; Step 7 (ONLY a very brief pause)"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdanie ostatnie (minimising your time on the floor)"]]}
      ],
      "mistakes": [
        {"c": "jump.mis.stiff", "s": [["ace-120", "Step 5 (Avoid locking your knees or quads)"], ["physitrack-lat-jumps-hurdles", "instrukcja, zdanie 3 (pozytywnie: lądowanie z ugiętymi kolanami i biodrami)"]]}
      ]
    },
    "Single-Leg Lateral Hop": {
      "setup": [
        {"c": "plyo.slLatHop.setup", "s": [["physitrack-lat-hops-hurdles", "instrukcja, zdania 1–2"], ["prehab-lat-sl-hop-cone", "opis: set-up 2 cones to the side of you"]]}
      ],
      "move": [
        {"c": "plyo.slLatHop.move", "s": [["physitrack-lat-hops-hurdles", "instrukcja, zdania 3–5"], ["prehab-lat-sl-hop-cone", "opis: hopping on the same leg, then repeat on the other side"]]}
      ],
      "tips": [
        {"c": "plyo.landSoft", "s": [["physitrack-lat-hops-hurdles", "instrukcja, zdanie 3 (landing softly)"], ["prehab-lat-sl-hop-cone", "opis: landing softly vs. being loud/stomping"]]}
      ],
      "mistakes": []
    }
  }
}
```

Uwagi do danych:
- `ace-115`, `nasm-box-jumps`, orgi `ACE`, `Physitrack`, `The Prehab Guys` już istnieją w `cues.json` — bez zmian.
- **Korekta do `plyo-cz1.md` (3. sesja):** org `ISSA` **nie istnieje** w `cues.json` (sprawdzone 02.11) — zdanie w cz1 „istnieją już … `ISSA`” jest błędne; definicja orga ISSA jest w bloku wyżej. `insportline-qt1005` (używane też w cz1 dla Depth Jump) — zdefiniowane tutaj.
- Front Cone Hops: wpis zależy od uznania BFS za szczebel 4 (dokument firmowany przez BFS Inc., 2020, bez autora osobowego; tabela programu, nie opis techniki — potwierdza tylko sam ruch). Przy odrzuceniu BFS — usunąć wpis.
- Lateral Cone Hops: przy uznaniu Physitrack blok 2b zastępuje wpis z sekcji 2, a `plyo.coneLat.hop` (ACE + NISMAT) dochodzi do `move` obok `plyo.coneLat.move` albo go zastępuje (prostsze zdanie; decyzja programisty/recenzenta).
- Puste listy (`mistakes: []` itd.) oznaczają brak potwierdzenia — szczegóły w sekcji 5. Ćwiczenia „częściowe” nie powinny dostać statusu karty „gotowa”, dopóki braki nie są uzupełnione albo świadomie przyjęte.
- „Dumbbell Seated Box Jump”: dane dla `bj.land` i `bj.mis.stiff` przeniesione bez zmian z wpisu „Box Jump”; zgodnie z ACG-015 z zestawu ogólnego usunąć `jump.drive`.

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| `plyo.coneLat.hop` (2. sesja) | Przeskakuj obunóż bokiem nad pachołkiem. | Jump sideways over the cone, off both feet. |
| `plyo.coneFwd.hop` (3. sesja) | Przeskakuj obunóż w przód nad kolejnymi pachołkami ustawionymi w rzędzie. | Jump forward off both feet over each cone in the row. |
| `plyo.coneLat.setup` (warunkowo, 2b) | Ustaw pachołki w rzędzie i stań bokiem do pierwszego. | Set the cones in a row and stand side-on to the first one. |
| `plyo.coneLat.move` (warunkowo, 2b) | Z krótkiego ugięcia przeskocz obunóż bokiem nad pachołkiem i od razu nad kolejnym. | From a quick dip, jump sideways off both feet over the cone, then straight over the next one. |
| `plyo.landTrunk` (warunkowo, 2b) | Przy lądowaniu tułów lekko pochylony, plecy proste. | On landing, lean your chest slightly forward and keep your back straight. |
| `plyo.quickOff` (warunkowo, 2b) | Po lądowaniu odbijaj się od razu — jak najkrócej na ziemi. | Bounce straight off after each landing — spend as little time on the ground as you can. |
| `plyo.slLatHop.setup` (warunkowo, 2b) | Stań na jednej nodze bokiem do pachołka. | Stand on one leg, side-on to the cone. |
| `plyo.slLatHop.move` (warunkowo, 2b) | Przeskocz bokiem nad pachołkiem, cały czas na tej samej nodze; potem zmień nogę. | Hop sideways over the cone on the same leg, then switch legs. |
| `plyo.landSoft` (warunkowo, 2b) | Ląduj miękko, nie tupnij. | Land softly — don't stomp. |
| `plyo.pushoff.setup` | Stań przodem do skrzyni: jedna stopa na skrzyni, druga na podłodze. | Face the box with one foot on top and the other on the floor. |
| `plyo.altPushoff.move` | Odepchnij się nogą ze skrzyni w górę, w powietrzu zmień nogi i wyląduj drugą stopą na skrzyni. | Drive up off the foot on the box, switch legs in the air and land with the other foot on the box. |

Istniejące zdania użyte bez zmian: `jump.land`, `jump.mis.stiff` (tylko 2b), `bj.land`, `bj.mis.stiff`. Każde nowe zdanie wymaga wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`) i przeglądu tłumacza/recenzenta lokalizacji — poza zakresem tej pracy.

## 4. Źródła (przeczytane 02.11.2026)

| id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-120 | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Kroki 1–8 i uwaga końcowa. Step 5: „Avoid locking your knees or quads on your landing…”; Step 6: „Land with your trunk inclined slightly forward, head aligned with your spine and back rigid or flat.” |
| ace-118 | https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/ | ACE | 4 | Kroki 1–8 (przeczytane ponownie w 3. sesji). Step 3: „With ONLY a very brief pause at the bottom of your downward phase, explode forward and upwards”; Step 5: lądowanie bez blokowania kolan (błąd — jedno źródło). |
| ace-246 | https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/ | ACE | 4 | Step 1–4: „quickly swing your left leg forward and your right leg back so that you will land with your left foot on top”. |
| ace-230 | https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/ | ACE | 4 | Kroki 1–4 i wskazówki. Nieużyte — brak drugiego źródła. |
| ace-filtr-box (3. sesja) | https://www.acefitness.org/resources/everyone/exercise-library/equipment/raised-platform-box/ | ACE | 4 | Lista ćwiczeń ze skrzynią: #246, #115, #206, #230, #211, #28 — brak „side-to-side push-off”/„box shuffle” i „lateral box jump”. |
| ace-115 | https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ | ACE | 4 | (istniejące) Step 4–6 — lądowanie. |
| nasm-box-jumps | https://www.nasm.org/resource-center/exercise-library/box-jumps | NASM | 4 | (istniejące, wg ACG-015) Common Mistakes; Step 4: zejście krokiem. |
| insportline-qt1005 | https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf | inSPORTline (producent skrzyń — własny sprzęt) | 4 | s. 3 „Plyo Boxes Exercises” (przeczytana ponownie w 3. sesji jako obraz strony): LATERAL STEP-UP; ALTERNATING PUSH-OFF (prawa górna — przodem: „Stand on the ground and place one foot on the box, heel close to closest edge.”); ALTERNATING PUSH-OFF (lewa dolna — bokiem, przeskok nad skrzynią = „Side to Side Box Shuffle”: „Stand to one side of the box with the left foot raised onto the middle of box.”); SQUAT DEPTH JUMP („Step off the box and land in a 90-degree squat position.” — kąt pominięty, liczba). Brak single-leg push-off i błędów. |
| nismat-lat-jump-cone (2. sesja) | https://nismat.org/2020/05/26/lateral-jump-over-cone/amp/ | NISMAT (placówka medycyny sportowej; konto instytucji, data 26.05.2020 w adresie) | 4 — do potwierdzenia | „Jump with both feet sideways over the cone, then back.” (3 zdania; bez lądowania i błędów; wysokość pachołka i czas pominięte — liczby) |
| bfs-plyo-2020 (3. sesja) | https://cdn.shopify.com/s/files/1/0209/7514/files/2020-04_Plyo_and_Jumping-02.pdf | BFS Inc. (Bigger Faster Stronger; stopka „1976–2020”, adres firmy na każdej stronie) | 4 — do potwierdzenia (firma szkoląca trenerów szkolnych + producent sprzętu siłowni; dokument firmowany, bez autora osobowego; tabela programu) | s. 2: „Items to jump over: Cones foam blocks, hurdles, etc…”; Drill 5b: „Both Feet - Straight ahead (Progressive - over multiple implements in a row)”; Drill 2: „quick off the ground / short contact time”; s. 3: Drill 8b — obunóż w bok nad rzędem przeszkód; s. 4–5: progresja skoków na skrzynię (tylko nazwy, bez techniki). Liczby serii pominięte. |
| bfs-mini-course (3. sesja, nieużyte) | https://www.biggerfasterstronger.com/pages/bfs-jumping-and-plyo-progression | BFS | — | strona kursu: tylko opisy filmów, bez tekstu techniki; BFS opisuje się jako „weight room outfitter for schools & teams” z edukacją trenerów |
| fiso-haagahelia-box-drills (3. sesja, nieużyte) | https://www.fiso.it/_files/f_media/2020/03/20692.pdf | praca studentów (Haaga-Helia University of Applied Sciences), plik na stronie FISO | 5 (praca studencka; zdjęcia © 2008 Human Kinetics) | „Side to side push off”: start bokiem, stopa na skrzyni, przeskok nad skrzynią z zamachem rąk, lądowanie drugą stopą na skrzyni — zgodne z inSPORTline, ale się nie liczy. Wskazuje pierwotne źródło: podręcznik wydawnictwa Human Kinetics (2008). |
| pmc-4637913 (3. sesja, nieużyte) | https://pmc.ncbi.nlm.nih.gov/articles/PMC4637913/ | Davies, Riemann, Manske 2015 (przegląd narracyjny) | 3 | Tab. 6 — tylko nazwy („side to side push off jumps”, „single leg push off box”); bez opisów. |
| physitrack-lat-hops-hurdles | https://uk.physitrack.com/home-exercise-video/lateral-hops-over-hurdles | Physitrack | do decyzji koordynatora | Pełna instrukcja (7 zdań): „Stand at one end with your side to the hurdles and stand on one leg.” |
| physitrack-lat-jumps-hurdles | https://uk.physitrack.com/home-exercise-video/lateral-jumps-over-hurdles | Physitrack | do decyzji koordynatora | Pełna instrukcja (7 zdań); „The aim is to spring quickly off the floor between each hurdle, minimising your time on the floor.” |
| prehab-lat-sl-hop-cone | https://theprehabguys.com/vimeo-video/lateral-single-leg-hop-with-cone/ | The Prehab Guys | 4 | „Perform this drill with hopping on the same leg, then repeat on the other side.”; „we do not want the knee to collapse in”. |
| catalyst-552 | https://www.catalystathletics.com/exercise/552/Seated-Box-Jump/ | Catalyst Athletics | 4 | „Sit on a small box in front of a taller box and place your feet in your jumping stance close to the base.” Nieużyte (jedno źródło). |
| hk-radcliffe-box-skip | https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips | Human Kinetics (fragment książki J. Radcliffe, „High-Powered Plyometrics”, wyd. 3, s. 62–63) | 3 jeśli autor spełnia kryterium (NSCA / naukowiec) — do sprawdzenia | Box Skip: start „assume an upright stance with one leg slightly behind the other”. Nieużyte — jedno źródło. |
| ufl-recsports-handout (nieużyte) | https://recsports.ufl.edu/wp-content/uploads/2020/05/RecSports-Injury-Prevention-Handout.pdf | Univ. of Florida RecSports | do decyzji koordynatora (centrum rekreacji uczelni) | NIE przeczytany — 503 także w 3. sesji |

Odrzucone jako źródła (zasady projektu): strony innych aplikacji treningowych i serwisów z planami, zbiór z pola `fedb` (szczebel 5), materiały trenerów szkolnych i drużyn bez autora (szczebel 5), prace studenckie (szczebel 5), ExRx (403, archiwum zablokowane). Niedostępne: Special Olympics Canada „Agility.pdf” (404), UF RecSports PDF (503, dwukrotnie).

## 5. Otwarte

- [OTWARTE] **Physitrack** — status źródła do decyzji koordynatora (platforma ćwiczeń dla fizjoterapeutów; rozstrzygnięcie 02.11: dokumentacja innych aplikacji nie jest źródłem). Zależą od tego: Lateral Cone Hops (setup, 3 wskazówki, błąd) i Single-Leg Lateral Hop (setup, move, wskazówka). Zastępstw szukano: The Prehab Guys (tylko wersje jednonóż / inne kierunki), NISMAT (znalezione dla ruchu Lateral Cone Hops — bez lądowania i błędów), Special Olympics Canada (404).
- [OTWARTE] **BFS — szczebel** (3. sesja): firma od 1976 r. szkoli trenerów szkolnych i wyposaża siłownie (także skrzynie plyo); dokument firmowany, 2020, bez autora osobowego; to tabela programu, nie opis techniki. Zależy od tego Front Cone Hops (move). Uwaga: Drill 8b (obunóż w bok nad rzędem przeszkód) mógłby być trzecim źródłem ruchu dla Lateral Cone Hops — nie dopisany, bo ten wpis ma już 2 źródła.
- [OTWARTE] **Front Cone Hops — błąd i lądowanie**: tylko ACE #118 (Step 5–6); BFS nie opisuje lądowania. `plyo.quickOff` — ACE „ONLY a very brief pause” + BFS (krótki kontakt tylko w wariancie „Speed”) — za słabe, nie wpisane.
- [OTWARTE] **Dumbbell Seated Box Jump — setup i move**: niezależnie potwierdza tylko Catalyst (bez hantla). `fedb` to szczebel 5. Wariant „hantel oburącz przy klatce” wynika z nazwy ćwiczenia, nie z techniki.
- [OTWARTE] **`bj.stepDown`** (zejście krokiem): przeczytane tylko NASM.
- [OTWARTE] **Single-Leg Lateral Hop — błąd**: „kolano ucieka do środka” tylko w The Prehab Guys. „Lądowanie na sztywnych nogach” — żadne źródło wprost.
- [OTWARTE] **Lateral Cone Hops — `jump.mis.stiff`**: poza Physitrack tylko ACE; NISMAT nie opisuje lądowania.
- [OTWARTE] **Alternate Leg Push-Off — zamach rąk**: ACE (jedna ręka, naprzemiennie) vs producent (oburącz); część wspólna bez zdania. Błąd i miękkie lądowanie — tylko ACE.
- [OTWARTE] **Single Leg Push-Off**: tylko ACE #230 (szukane w 3. sesji — patrz tabela).
- [OTWARTE] **Side to Side Box Shuffle**: tylko inSPORTline (szukane w 3. sesji — patrz tabela). Najbliższe dobre źródło: podręcznik NSCA (Human Kinetics, 2008 — rozdział o pliometrii, „box drills”), z którego pochodzą zdjęcia w pracy studenckiej; fragmentu wydawcy nie znalazłem.
- [OTWARTE] **Box Skip**: tylko fragment książki; sprawdzić, czy autor spełnia kryterium szczebla 3.
- [OTWARTE] **Alternate Leg Diagonal Bound, Single-Leg Stride Jump, Double Leg Butt Kick, Single Leg Butt Kick, Side Standing Long Jump, Side Hop-Sprint, Single-Leg Hop Progression**: brak przeczytanego opisu w bibliotece szczebla 4 (w 3. sesji nie szukano — kolejność zadań). Rekomendacja dla koordynatora: karta bez własnych wskazówek albo ukrycie (status nie `ready`) do czasu źródeł — decyzja produktowa.
- Zestaw ogólny `jump` (`jump.drive` z zamachem rąk) dziś przypisany do „Alternate Leg Diagonal Bound” i „Bench Jump” oraz `jump.land`/`jump.mis.stiff` do „Alternate Leg Push-Off” i „Box Skip” — przeczytane źródła ich dla tych wariantów nie potwierdzają dwukrotnie; do rozważenia przy decyzji o kartach.

## 6. Stan

- Zrobione (1. sesja): 15/15 ćwiczeń ocenionych.
- Zrobione (2. sesja, 02.11): szczeble poprawione wg rozstrzygnięcia 02.11 (`fedb` = 5; producent tylko dla własnego sprzętu — inSPORTline zostaje); wpisy Physitrack przeniesione do bloku warunkowego 2b; Lateral Cone Hops: nowe zdanie `plyo.coneLat.hop` (ACE + NISMAT); Front Cone Hops — szukane, bez drugiego źródła.
- Zrobione (3. sesja, 02.11): Front Cone Hops → częściowe warunkowo (`plyo.coneFwd.hop`: ACE #118 + BFS 2020); Single Leg Push-Off i Side to Side Box Shuffle — szukane, nadal otwarte; instrukcja inSPORTline przeczytana ponownie w całości (s. 3); korekta: org ISSA dla cz1 zdefiniowany tutaj.
- Stan bez Physitrack i bez BFS: gotowe 0, częściowe 3 (Lateral Cone Hops, Alternate Leg Push-Off, Dumbbell Seated Box Jump), otwarte 12. Przy uznaniu BFS: + Front Cone Hops częściowe. Przy uznaniu Physitrack: Lateral Cone Hops gotowe, Single-Leg Lateral Hop częściowe.
- Zostało: Single Leg Push-Off, Side to Side Box Shuffle (drugie źródło), błędy w Front Cone Hops, Single-Leg Lateral Hop i Alternate Leg Push-Off; zastępstwa Physitrack; 7 ćwiczeń bez żadnego źródła (w 3. sesji nie szukane).
- Następny krok: fragmenty wydawcy Human Kinetics z podręcznika NSCA (rozdział o pliometrii: box drills — single-leg / side-to-side push-off; depth jumps) — jeśli dostępne, szczebel 3 i rozwiązuje kilka ćwiczeń naraz; potem pozostałe 7 ćwiczeń.
- Pułapki: strony innych aplikacji dominują w wynikach wyszukiwania — odrzucać; Physitrack ma adresy regionalne (us/uk/ca/au) tej samej treści — jedno źródło; The Prehab Guys: adresy `library.…?p=` przekierowują na logowanie, publiczne są `theprehabguys.com/vimeo-video/…` (nie każda nazwa istnieje — 404); blogi sklepów odzieżowych (bez autora) — szczebel 5; PDF-y: WebFetch nie wyciąga tekstu — czytać zapisany plik narzędziem Read ze stronami (kosztowne w kontekście — po 1–3 strony).

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3) i rozstrzygnięcia koordynatora z 02.11.2026 (Physitrack = 5;
The Prehab Guys warunkowo 4 per strona; NISMAT i NHS — instytucje medyczne = 4, firmowanie wystarcza). Kryterium karty z 02.11.2026: ustawienie + ruch.

| Źródło | Szczebel | Dowód |
|---|---|---|
| ACE (#118, #120, #246, #230, #115), NASM (box jumps), Catalyst #552 | 4 | bez zmian |
| insportline-qt1005 | 4 | producent skrzyń plyo — instrukcja własnego sprzętu (rozstrzygnięcie: producent tylko dla własnego rodzaju sprzętu) |
| nismat-lat-jump-cone | **4** (było: do potwierdzenia) | NISMAT — instytut medycyny sportowej szpitala Lenox Hill; instytucja medyczna, firmowanie wystarcza (uzup. 2, wiersz szpitali; rozstrzygnięcie koordynatora 02.11) |
| physitrack-lat-hops-hurdles, physitrack-lat-jumps-hurdles | **5** | uzup. 2, wiersz Physitrack (brak autora i daty, otoczenie marketingowe) |
| prehab-lat-sl-hop-cone | **nie liczy się (5)** | nie otwierana osobno; strony `theprehabguys.com/vimeo-video/…` sprawdzone w plyo-cz1 (2 strony, WebFetch 02.11) nie mają autora — warunek „autor z kwalifikacjami” niespełniony. Bez wpływu na wynik: Single-Leg Lateral Hop i tak bez drugiego źródła |
| bfs-plyo-2020 | bez rozstrzygnięcia (nie liczę) | BFS nie ma wiersza w pliku szczebli; dokument firmowany, bez autora osobowego. Bez wpływu: Front Cone Hops i tak bez ustawienia |
| hk-radcliffe-box-skip | bez rozstrzygnięcia (biogram nieczytany) | jedno źródło — bez wpływu |
| fiso-haagahelia-box-drills, ufl-recsports-handout | 5 / nieprzeczytany | bez zmian |

| Zdanie (ćwiczenie) | Źródła ≥ 4 po przeliczeniu | Stan |
|---|---|---|
| `plyo.pushoff.setup`, `plyo.altPushoff.move` (Alternate Leg Push-Off) | ACE #246 + inSPORTline | zostaje |
| `plyo.coneLat.hop` (Lateral Cone Hops, ruch) | ACE #120 + NISMAT (4) | zostaje jako zdanie — karta bez ustawienia |
| `plyo.coneLat.setup`, `plyo.coneLat.move`, `jump.land`, `plyo.landTrunk`, `plyo.quickOff`, `jump.mis.stiff` (Lateral Cone Hops, blok 2b) | ACE (Physitrack = 5) | **spada** (odrzucone) |
| `plyo.slLatHop.setup`, `plyo.slLatHop.move`, `plyo.landSoft` (Single-Leg Lateral Hop, blok 2b) | — (Physitrack 5, Prehab Guys strona bez autora) | **spada** (odrzucone) |
| `plyo.coneFwd.hop` (Front Cone Hops, ruch) | ACE #118 + BFS (bez rozstrzygnięcia) | bez zmian — warunkowe; karta i tak bez ustawienia |
| `bj.land`, `bj.mis.stiff` (Dumbbell Seated Box Jump) | ACE #115 + NASM | zostaje jako zdania — karta bez ustawienia i ruchu |

| Karta | Stan przed | Stan po |
|---|---|---|
| Alternate Leg Push-Off | częściowe | **własna bez błędów** |
| Lateral Cone Hops | częściowe (warunkowo gotowe) | **otwarta** (tylko ruch; ustawienie stało na Physitrack) |
| Dumbbell Seated Box Jump | częściowe | **otwarta** (brak ustawienia i ruchu; są tylko lądowanie i błąd) |
| Front Cone Hops | częściowe (warunkowo) | **otwarta** (brak ustawienia) |
| Single-Leg Lateral Hop | otwarte (warunkowo częściowe) | otwarta |
| pozostałe 10 (Alternate Leg Diagonal Bound, Box Skip, Single-Leg Stride Jump, Single Leg Push-Off, Side to Side Box Shuffle, Double/Single Leg Butt Kick, Side Standing Long Jump, Side Hop-Sprint, Single-Leg Hop Progression) | otwarte | otwarte |

Razem cz2 (15 ćwiczeń): przed — gotowe 0, częściowe 3 (+1 warunkowo; przy uznaniu Physitrack: 1 gotowe), otwarte 11–12; po — własne z błędami 0, własne bez błędów 1, otwarte 14.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

Ten blok definiuje też `insportline-qt1005` i org `inSPORTline`, których używa Depth Jump w bloku `plyo-cz1.md`.

```json
{
 "sources": {
  "ace-246": {"org": "ACE", "title": "Alternate Leg Push-off (#246)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/", "level": 4},
  "insportline-qt1005": {"org": "inSPORTline", "title": "Plyometric Box Set — instrukcja (QT1005), s. 3 „Plyo Boxes Exercises”", "url": "https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf", "level": 4}
 },
 "orgs": {
  "inSPORTline": {"name": "inSPORTline — instrukcja zestawu skrzyń plyometrycznych (producent sprzętu)", "level": 4, "kind": "maker"}
 },
 "exercises": {
  "Alternate Leg Push-Off": {
   "setup": [
    {"c": "plyo.pushoff.setup", "s": [["ace-246", "Step 1"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Start"]]}
   ],
   "move": [
    {"c": "plyo.altPushoff.move", "s": [["ace-246", "Step 2–3"], ["insportline-qt1005", "s. 3, ALTERNATING PUSH-OFF (pierwsza pozycja), Action"]]}
   ],
   "tips": [],
   "mistakes": []
  }
 }
}
```

Nowe zdania w bloku (2): `plyo.pushoff.setup`, `plyo.altPushoff.move`. Poza blokiem (potwierdzone, ale karta otwarta): `plyo.coneLat.hop` (ACE + NISMAT);
`bj.land`, `bj.mis.stiff` dla Dumbbell Seated Box Jump. Warunkowe: `plyo.coneFwd.hop` (BFS bez rozstrzygnięcia).

Wątpliwości:
1. Lateral Cone Hops: ACE #120 Step 1 opisuje ustawienie — jeśli NISMAT (3 zdania) zawiera też ustawienie (start bokiem do pachołka), karta byłaby własna; treści NISMAT
   pod tym kątem nie sprawdzałem (przeliczenie, nie fala badań).
2. Dumbbell Seated Box Jump i Lateral Cone Hops mają potwierdzone zdania lądowania/błędu albo ruchu, ale przy kryterium „ustawienie + ruch” nie dostają karty — do decyzji
   programisty/koordynatora, czy pojedyncze potwierdzone zdania mają trafić do danych bez karty.
