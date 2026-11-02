# Wskazówki techniki — plyo, część 2 (skoki, rzadsze ćwiczenia)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3). Zakres: tylko zbieranie danych (bez zmian w kodzie i `data/zrodla/*.json`).

Zasada: każde zdanie w danym ćwiczeniu ma ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji (wyjątek dla wskazówek techniki w CLAUDE.md). Zdania z zestawu ogólnego `jump` (`jump.drive`, `jump.land`, `jump.mis.stiff`) wpisuję tylko tam, gdzie przeczytane źródła dla tego wariantu je potwierdzają — w pozostałych przypadkach krótsza karta albo „otwarte”.

Uwaga o zbiorze, z którego pochodzą nazwy katalogu (pole `fedb`): według `docs/research/26-grafiki-i-wskazowki.md` (pkt 1 i 6) jego opisy nie są niezależnym ani sprawdzonym źródłem — służą tylko do rozpoznania ruchu. Dlatego **nie liczę go jako źródła** (inaczej niż w ACG-015, gdzie był policzony przy „Dumbbell Seated Box Jump”; zob. Otwarte).

## 1. Tabela ćwiczeń

| Klucz | Status | Uwagi |
|---|---|---|
| Dumbbell Seated Box Jump | częściowe | Tips `bj.land`, błąd `bj.mis.stiff` (te same źródła co „Box Jump”: lądowanie na skrzyni się nie różni; zgodne z ACG-015). Brak: setup, move — siad przodem do skrzyni i wybicie z siadu z rękami przy klatce potwierdza tylko jedno niezależne źródło (Catalyst). `bj.stepDown` z ACG-015 — jedno źródło (NASM). `jump.drive` (zamach rąk) sprzeczny z wariantem — nie wpisywać. |
| Single-Leg Lateral Hop | częściowe | Setup, move, tips potwierdzone (Physitrack + The Prehab Guys). Brak błędu: „kolano ucieka do środka” tylko w jednym źródle (Prehab Guys); „sztywne nogi” — żadne z dwóch nie mówi tego wprost. `jump.land` nie wpisany (ugięte kolana tylko w Physitrack). |
| Lateral Cone Hops | gotowe | ACE (Lateral Cone Jumps) + Physitrack (Lateral jumps over hurdles — obunóż, bokiem, z przysiadu). Błąd `jump.mis.stiff`: ACE wprost („Avoid locking your knees…”), Physitrack pozytywnie („landing softly with your knees and hips bent”) — do decyzji recenzenta, czy pozytywna instrukcja wystarcza jako drugie źródło błędu (precedens: `bj.mis.stiff` miał dwa źródła wprost). |
| Front Cone Hops | otwarte | Przeczytane tylko ACE (Forward Cone Jumps). Drugiego niezależnego źródła dla przeskoków obunóż w przód nie znalazłem (Physitrack: adresy 404 albo opis bez techniki). |
| Alternate Leg Diagonal Bound | otwarte | Nie znalazłem przeczytanego opisu w bibliotece szczebla 4. |
| Box Skip | otwarte | Jedno źródło (książka szczebla 3, fragment u wydawcy) — za mało do wskazówek. |
| Single-Leg Stride Jump | otwarte | Fragment wydawcy książki o tym ćwiczeniu nie otwiera się (strona przekierowuje na główną); innych źródeł szczebla 4 nie znalazłem. |
| Alternate Leg Push-Off | częściowe | Setup i move: ACE + producent skrzyń (instrukcja inSPORTline). Brak błędu: lądowanie na prostych kolanach tylko ACE. Zamach rąk: ACE — jedna ręka w przód (naprzemiennie), producent — oburącz → sprzeczność, pominięte. `jump.land` (obecny zestaw) — tylko ACE. |
| Single Leg Push-Off | otwarte | Tylko ACE (#230). Strona producenta sprzętu z tym ćwiczeniem — 404. |
| Side to Side Box Shuffle | otwarte | Tylko instrukcja producenta skrzyń (druga pozycja „Alternating push-off” na s. 3 opisuje właśnie przeskok bokiem nad skrzynią). Strona drugiego producenta — 404/strona serwisowa; ExRx niedostępny. |
| Double Leg Butt Kick | otwarte | Brak przeczytanego źródła szczebla 4 (wyniki wyszukiwania dotyczą biegowego „butt kicks”, to inny ruch). |
| Single Leg Butt Kick | otwarte | Jak wyżej. |
| Side Standing Long Jump | otwarte | Brak przeczytanego źródła szczebla 4. |
| Side Hop-Sprint | otwarte | Brak przeczytanego źródła szczebla 4. |
| Single-Leg Hop Progression | otwarte | Brak przeczytanego źródła szczebla 4. |

## 2. Dane (format `data/zrodla/cues.json`)

```json
{
  "sources": {
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
    "physitrack-lat-hops-hurdles": {
      "org": "Physitrack",
      "title": "Lateral hops over hurdles",
      "url": "https://uk.physitrack.com/home-exercise-video/lateral-hops-over-hurdles",
      "level": 4
    },
    "physitrack-lat-jumps-hurdles": {
      "org": "Physitrack",
      "title": "Lateral jumps over hurdles",
      "url": "https://uk.physitrack.com/home-exercise-video/lateral-jumps-over-hurdles",
      "level": 4
    },
    "prehab-lat-sl-hop-cone": {
      "org": "The Prehab Guys",
      "title": "Lateral Single Leg Hop With Cone",
      "url": "https://theprehabguys.com/vimeo-video/lateral-single-leg-hop-with-cone/",
      "level": 4
    }
  },
  "orgs": {
    "inSPORTline": {
      "name": "inSPORTline — instrukcja zestawu skrzyń plyometrycznych (producent sprzętu)",
      "level": 4,
      "kind": "maker"
    }
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

Uwagi do danych:
- `ace-115`, `nasm-box-jumps`, orgi `ACE`, `Physitrack`, `The Prehab Guys` już istnieją w `cues.json` — bez zmian.
- Puste listy (`mistakes: []` itd.) oznaczają brak potwierdzenia — szczegóły w sekcji 5. Ćwiczenia o statusie „częściowe” nie powinny dostać statusu karty „gotowa”, dopóki braki nie są uzupełnione albo świadomie przyjęte (decyzja koordynatora/recenzenta).
- „Dumbbell Seated Box Jump”: dane dla `bj.land` i `bj.mis.stiff` przeniesione bez zmian z wpisu „Box Jump”; zgodnie z ACG-015 z zestawu ogólnego usunąć `jump.drive`.

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| `plyo.coneLat.setup` | Ustaw pachołki w rzędzie i stań bokiem do pierwszego. | Set the cones in a row and stand side-on to the first one. |
| `plyo.coneLat.move` | Z krótkiego ugięcia przeskocz obunóż bokiem nad pachołkiem i od razu nad kolejnym. | From a quick dip, jump sideways off both feet over the cone, then straight over the next one. |
| `plyo.landTrunk` | Przy lądowaniu tułów lekko pochylony, plecy proste. | On landing, lean your chest slightly forward and keep your back straight. |
| `plyo.quickOff` | Po lądowaniu odbijaj się od razu — jak najkrócej na ziemi. | Bounce straight off after each landing — spend as little time on the ground as you can. |
| `plyo.slLatHop.setup` | Stań na jednej nodze bokiem do pachołka. | Stand on one leg, side-on to the cone. |
| `plyo.slLatHop.move` | Przeskocz bokiem nad pachołkiem, cały czas na tej samej nodze; potem zmień nogę. | Hop sideways over the cone on the same leg, then switch legs. |
| `plyo.landSoft` | Ląduj miękko, nie tupnij. | Land softly — don't stomp. |
| `plyo.pushoff.setup` | Stań przodem do skrzyni: jedna stopa na skrzyni, druga na podłodze. | Face the box with one foot on top and the other on the floor. |
| `plyo.altPushoff.move` | Odepchnij się nogą ze skrzyni w górę, w powietrzu zmień nogi i wyląduj drugą stopą na skrzyni. | Drive up off the foot on the box, switch legs in the air and land with the other foot on the box. |

Istniejące zdania użyte bez zmian: `jump.land`, `jump.mis.stiff`, `bj.land`, `bj.mis.stiff`. Każde nowe zdanie wymaga wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`) i przeglądu tłumacza/recenzenta lokalizacji — poza zakresem tej pracy.

## 4. Źródła (przeczytane 02.11.2026)

| id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-120 | https://www.acefitness.org/resources/everyone/exercise-library/120/lateral-cone-jumps/ | ACE | 4 | Kroki 1–8 i uwaga końcowa. Step 5: „Avoid locking your knees or quads on your landing…”; Step 6: „Land with your trunk inclined slightly forward, head aligned with your spine and back rigid or flat.” |
| ace-118 | https://www.acefitness.org/resources/everyone/exercise-library/118/forward-cone-jumps/ | ACE | 4 | Kroki 1–8 (przeskoki obunóż w przód nad pachołkami; lądowanie jak w #120). Nieużyte w danych — brak drugiego źródła. |
| ace-246 | https://www.acefitness.org/resources/everyone/exercise-library/246/alternate-leg-push-off/ | ACE | 4 | Step 1 (jedna stopa na skrzyni, druga na ziemi), Step 2 (wybicie, zamach ręki), Step 3: „quickly swing your left leg forward and your right leg back so that you will land with your left foot on top”; Step 4 (lądowanie). |
| ace-230 | https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/ | ACE | 4 | Kroki 1–4 i wskazówki (wybicie z nogi na skrzyni, lądowanie tą samą stopą). Nieużyte — brak drugiego źródła. |
| ace-115 | https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ | ACE | 4 | (istniejące) Step 4–6 — lądowanie. |
| nasm-box-jumps | https://www.nasm.org/resource-center/exercise-library/box-jumps | NASM | 4 | (istniejące, wg ACG-015) Common Mistakes; Step 4: zejście krokiem. |
| insportline-qt1005 | https://www.insportline.eu/upload/file/7267_manual_QT1005_or.pdf | inSPORTline (producent) | 4 | s. 3 „Plyo Boxes Exercises”: ALTERNATING PUSH-OFF (lewa górna) — Start: „Stand on the ground and place one foot on the box, heel close to closest edge.”; Action: „…land with feet reversed (box foot lands a split second before ground foot).” Druga pozycja o tej samej nazwie (lewa dolna) opisuje przeskok bokiem nad skrzynią z „shuffling back and forth” — odpowiada „Side to Side Box Shuffle”. |
| physitrack-lat-hops-hurdles | https://uk.physitrack.com/home-exercise-video/lateral-hops-over-hurdles | Physitrack | 4 | Pełna instrukcja (7 zdań): „Stand at one end with your side to the hurdles and stand on one leg.”; „…landing softly with your knee and hips bent and your back straight but leaning forwards.” |
| physitrack-lat-jumps-hurdles | https://uk.physitrack.com/home-exercise-video/lateral-jumps-over-hurdles | Physitrack | 4 | Pełna instrukcja (7 zdań), obunóż z przysiadu; „The aim is to spring quickly off the floor between each hurdle, minimising your time on the floor.” |
| prehab-lat-sl-hop-cone | https://theprehabguys.com/vimeo-video/lateral-single-leg-hop-with-cone/ | The Prehab Guys | 4 | Opis: „Perform this drill with hopping on the same leg, then repeat on the other side.”; „You should feel like you're landing softly vs. being loud/stomping your feet.”; o kolanie: „we do not want the knee to collapse in”. |
| catalyst-552 | https://www.catalystathletics.com/exercise/552/Seated-Box-Jump/ | Catalyst Athletics | 4 | Opis: „Sit on a small box in front of a taller box and place your feet in your jumping stance close to the base.”; ręce: „hold the hands loosely at the chest”. Wersja bez ciężaru. Nieużyte w danych (jedno źródło dla setup/move). |
| hk-radcliffe-box-skip | https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips | Human Kinetics (fragment książki J. Radcliffe, „High-Powered Plyometrics”, wyd. 3, s. 62–63) | 3 | Box Skip: start „assume an upright stance with one leg slightly behind the other”, wybicie z tylnej nogi, wypchnięcie kolana, lądowanie na skrzyni. Nieużyte — jedno źródło. |

Odrzucone jako źródła (zasady projektu): strony innych aplikacji treningowych i serwisów z planami (wg uzupełnienia briefu 02.11), zbiór z pola `fedb` (pochodny, niesprawdzony — docs/research/26), materiały trenerów szkolnych (szczebel 5), ExRx (403, archiwum zablokowane).

## 5. Otwarte

- [OTWARTE] **Dumbbell Seated Box Jump — setup i move** (`sbj.move` z ACG-015, siad przodem do skrzyni): niezależnie potwierdza tylko Catalyst (bez hantla). ACG-015 liczył jako drugie źródło opis ze zbioru `fedb`, który wg docs/research/26 nie jest niezależny ani sprawdzony → tu nie liczę. Wariant „hantel oburącz przy klatce” wynika z definicji katalogu (nazwa ćwiczenia), nie z techniki. Do szukania: druga biblioteka szczebla 4 z opisem skoku na skrzynię z siadu (wyszukane strony: 404, strona za logowaniem albo inne aplikacje).
- [OTWARTE] **`bj.stepDown`** (zejście krokiem): przeczytane tylko NASM; drugie źródło z wyszukiwania to artykuły prasowe/innej aplikacji — nie liczę.
- [OTWARTE] **Single-Leg Lateral Hop — błąd**: „kolano ucieka do środka” tylko w The Prehab Guys; Physitrack nie mówi. „Lądowanie na sztywnych nogach” — żadne z dwóch wprost.
- [OTWARTE] **Lateral Cone Hops — `jump.mis.stiff`**: drugie źródło (Physitrack) mówi to pozytywnie, nie jako błąd. Jeżeli recenzent wymaga dwóch źródeł wprost — przenieść do otwartych (wtedy status „częściowe”).
- [OTWARTE] **Alternate Leg Push-Off — zamach rąk**: ACE (jedna ręka w przód, naprzemiennie) i producent (oburącz) się różnią; część wspólna: ręce pomagają w wybiciu — nie wpisuję zdania o rękach. Błąd (lądowanie na prostych kolanach) i miękkie lądowanie — tylko ACE.
- [OTWARTE] **Front Cone Hops**: tylko ACE #118. Do szukania: druga biblioteka z przeskokami obunóż w przód nad pachołkami/płotkami.
- [OTWARTE] **Single Leg Push-Off**: tylko ACE #230.
- [OTWARTE] **Side to Side Box Shuffle**: tylko instrukcja inSPORTline (s. 3).
- [OTWARTE] **Box Skip**: tylko fragment książki (szczebel 3, jedno źródło).
- [OTWARTE] **Alternate Leg Diagonal Bound, Single-Leg Stride Jump, Double Leg Butt Kick, Single Leg Butt Kick, Side Standing Long Jump, Side Hop-Sprint, Single-Leg Hop Progression**: nie znalazłem przeczytanego opisu w bibliotece szczebla 4 (to nazwy z jednego zbioru, w dużej części z podręcznika plyometrii; publiczne biblioteki organizacji ich nie mają). Rekomendacja dla koordynatora: dla tych ćwiczeń zostawić kartę bez własnych wskazówek albo rozważyć ukrycie (status nie `ready`) do czasu źródeł — decyzja produktowa.
- Zestaw ogólny `jump` (`jump.drive` z zamachem rąk) dziś przypisany do „Alternate Leg Diagonal Bound” i „Bench Jump” oraz `jump.land`/`jump.mis.stiff` do „Alternate Leg Push-Off” i „Box Skip” — przeczytane źródła ich dla tych wariantów nie potwierdzają dwukrotnie (patrz wyżej); do rozważenia przy decyzji o kartach.

## 6. Stan

- Zrobione: 15/15 ćwiczeń ocenionych; gotowe 1 (Lateral Cone Hops), częściowe 3 (Dumbbell Seated Box Jump, Single-Leg Lateral Hop, Alternate Leg Push-Off), otwarte 11. Nowe zdania: 9. Nowe źródła w danych: 6 (+ 1 org: inSPORTline); dodatkowo przeczytane, nieużyte: ace-118, ace-230, catalyst-552, hk-radcliffe-box-skip.
- Zostało: drugie źródła dla Front Cone Hops, Single Leg Push-Off, Side to Side Box Shuffle, Dumbbell Seated Box Jump (setup/move), błędów w Single-Leg Lateral Hop i Alternate Leg Push-Off; pozostałe 7 ćwiczeń bez żadnego źródła szczebla 4.
- Następny krok: szukać w instrukcjach innych producentów skrzyń plyometrycznych (PDF-y z ćwiczeniami) i w bibliotekach fizjoterapeutycznych; artykuły NSCA Coach o plyometrii (PDF).
- Pułapki: strony innych aplikacji dominują w wynikach wyszukiwania — odrzucać; Physitrack ma wiele adresów regionalnych (us/uk/ca/au) tej samej treści — to jedno źródło; The Prehab Guys: adresy `library.…?p=` przekierowują na logowanie, publiczne są `theprehabguys.com/vimeo-video/…`; strona wydawcy z fragmentem „stride jump” przekierowuje na stronę główną.
