# Wskazówki techniki — rodzina sled_throw: sanki i ruchy całego ciała

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3)

Zakres: Sled Push, Turkish Get Up, Sled Drag (Harness), Backward Drag, Sledgehammer Swings, Bear Crawl Sled Drag,
Sled Forward Drag with Press, Sled Overhead Backward Walk, Spider Crawl (definicje: `docs/research/equipment/catalog.json`,
`lib/figures/v2/poses/sled_throw.json`). Reguła: wyjątek dla wskazówek techniki z CLAUDE.md — zdanie wchodzi, gdy potwierdzają je
2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji. Tylko zbieranie danych — kod, `data/zrodla/*.json` i `lib/**` bez zmian.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Sled Push | częściowe | setup, move, 2 wskazówki potwierdzone; brak błędu z dwoma źródłami (Otwarte O1). |
| Turkish Get Up | częściowe | setup, move, 2 wskazówki potwierdzone (w tym istniejące `tgu.arm`, `tgu.eyes`); brak błędu z dwoma źródłami (O2). Zestaw ogólny miał `mis.jerk` — nie potwierdzony dla tego ćwiczenia, pominięty. |
| Backward Drag | częściowe | setup i move potwierdzone; brak błędu z dwoma źródłami (O3). Zestaw ogólny `sled.legs` zastąpiony zdaniem dla jazdy tyłem. |
| Sled Drag (Harness) | otwarte | tylko jedno przeczytane źródło opisuje technikę (O4). |
| Sledgehammer Swings | otwarte | jedno źródło szczebla 4–5, dwa kolejne niedostępne (402/404) (O5). |
| Bear Crawl Sled Drag | otwarte | źródła wymieniają ćwiczenie bez opisu techniki (O6). |
| Sled Forward Drag with Press | otwarte | brak przeczytanego opisu wersji „krok + wypchnięcie” (O7). |
| Sled Overhead Backward Walk | otwarte | brak przeczytanego opisu (O8). |
| Spider Crawl | otwarte | znalezione opisy dotyczą innego ćwiczenia (pompka „spiderman”), nie czołgania (O9). |

## 2. Dane (format `data/zrodla/cues.json`)

```json
{
  "orgs": {
    "Rep Fitness": {"name": "Rep Fitness — blog Training (producent sanek i sprzętu; autor CSCS, weryfikacja NASM-CPT)", "level": 4, "kind": "maker"},
    "EliteFTS": {"name": "EliteFTS — artykuły szkoleniowe (producent sprzętu siłowego, autorzy-trenerzy)", "level": 4, "kind": "maker"},
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; szkolenie trenerów podnoszenia ciężarów)", "level": 4, "kind": "site"}
  },
  "sources": {
    "ace-388": {"org": "ACE", "title": "Turkish Get-up (#388)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/388/turkish-get-up/", "level": 4},
    "catalyst-481": {"org": "Catalyst Athletics", "title": "Turkish Get-up (#481)", "url": "https://catalystathletics.com/exercise/481/Turkish-Get-up/", "level": 4},
    "rep-sled-push": {"org": "Rep Fitness", "title": "Sled Push Technique Guide (2026)", "url": "https://repfitness.com/blogs/training/sled-push-technique", "level": 4},
    "rep-sled-pull": {"org": "Rep Fitness", "title": "3 Techniques to Elevate Your Sled Pull Workouts (2026)", "url": "https://repfitness.com/blogs/training/sled-pull-workout", "level": 4},
    "bm-sled-6wk": {"org": "Breaking Muscle", "title": "A Six-Week Sled Training Program (2023)", "url": "https://breakingmuscle.com/a-six-week-sled-training-program/", "level": 4},
    "elitefts-backward-pull": {"org": "EliteFTS", "title": "Backward Sled Pulls for Quad Size and Strength (2016)", "url": "https://elitefts.com/blogs/training/backwards-sled-pulls-for-quad-size-and-strength", "level": 4},
    "elitefts-drag-variations": {"org": "EliteFTS", "title": "Endless Sled Dragging Variations (2011/2020)", "url": "https://elitefts.com/blogs/training/endless-sled-dragging-variations-that-will-dramatically-improve-your-performance", "level": 4}
  },
  "exercises": {
    "Sled Push": {
      "setup": [
        {"c": "sled.pushGrip", "s": [
          ["rep-sled-push", "Choose Your Hand Position (wysokie uchwyty na prostych rękach albo niższe / przedramiona o słupki; parafraza)"],
          ["bm-sled-6wk", "The Exercises: Sled Push („Grab the uprights near the top.”)"]
        ]}
      ],
      "move": [
        {"c": "sled.legs", "s": [
          ["rep-sled-push", "Take Short, Quick Steps (odpychanie przodem stopy; „Don't push with your arms since they are not nearly as strong as your legs.”)"],
          ["bm-sled-6wk", "The Exercises: Sled Push („Push down and back with the ball of your foot.”)"]
        ]},
        {"c": "sled.extend", "s": [
          ["rep-sled-push", "Take Short, Quick Steps (pełny wyprost tylnej nogi w każdym kroku — biodro, kolano, staw skokowy; parafraza)"],
          ["bm-sled-6wk", "The Exercises: Sled Push („Finish each step by extending the hip.”)"]
        ]}
      ],
      "tips": [
        {"c": "sled.lean", "s": [
          ["rep-sled-push", "Get Low and Lean In (pochylenie ok. 45°; parafraza)"],
          ["bm-sled-6wk", "The Exercises: Sled Push („Lean forward at about 45 degrees…”)"]
        ]},
        {"c": "hinge.back", "s": [
          ["rep-sled-push", "Get Low and Lean In (plecy płaskie) oraz Avoid These Common Mistakes (bez zaokrąglania lędźwi; parafraza)"],
          ["bm-sled-6wk", "The Exercises: Sled Push („Brace the core” i „neutral spine”)"]
        ]}
      ],
      "mistakes": []
    },
    "Turkish Get Up": {
      "setup": [
        {"c": "tgu.setup", "s": [
          ["catalyst-481", "opis, zdania 1–2 („Lie on your back and hold a kettlebell or similar straight up in one extended arm.”)"],
          ["ace-388", "ustawienie (na plecach, kolano po stronie ciężaru ugięte, stopa płasko, ciężar prosto nad sobą; parafraza)"]
        ]}
      ],
      "move": [
        {"c": "tgu.move", "s": [
          ["catalyst-481", "opis, zdania 4–11 (podpór na wolnej ręce, wysoki mostek, noga pod siebie do klęku, wstanie, powrót tą samą drogą; parafraza)"],
          ["ace-388", "kroki wstawania i powrotu (dłoń w podłogę, mostek, kolano pod biodra, klęk, wstanie; odwrotnie w dół; parafraza)"]
        ]}
      ],
      "tips": [
        {"c": "tgu.arm", "s": [
          ["catalyst-481", "opis, zdanie 10 („with the weight still stabilized overhead on a straight arm”)"],
          ["ace-388", "ustawienie i krok wstawania („hold it straight overhead”; „Continue to hold the right arm overhead”)"]
        ]},
        {"c": "tgu.eyes", "s": [
          ["catalyst-481", "opis, zdanie 6 („It typically helps to look at the weight throughout the exercise.”)"],
          ["ace-388", "krok mostka („Keeping the eyes on the kettlebell throughout the movement”)"]
        ]}
      ],
      "mistakes": []
    },
    "Backward Drag": {
      "setup": [
        {"c": "sled.backGrip", "s": [
          ["rep-sled-pull", "Backwards Walk („You can hold the rope in your hands…”)"],
          ["elitefts-drag-variations", "Sled Exercises, pozycja 16 („Backward drag with split rope…”) i The Belt (lina z dwoma uchwytami w kształcie Y)"]
        ]}
      ],
      "move": [
        {"c": "sled.backWalk", "s": [
          ["elitefts-backward-pull", "technika („Lean back, away from the sled, the entire movement.”; „Use your legs.”)"],
          ["bm-sled-6wk", "The Exercises: Backward Sled Walk („…lean back to get the sled moving.”; krok w tył z wypchnięciem pięty w podłoże)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    }
  }
}
```

Uwaga do `Backward Drag` (move): Breaking Muscle opisuje wariant z pasem na biodrach, EliteFTS i Rep Fitness — z liną w rękach;
zdanie `sled.backWalk` mówi tylko o tym, co wspólne (odchylenie od sanek, praca nóg), więc pasuje do obu.

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| sled.pushGrip | Stań za sankami i chwyć słupki. | Stand behind the sled and grab the posts. |
| sled.extend | Przy każdym kroku wyprostuj do końca nogę, którą się odpychasz. | On every step, fully straighten the leg you push off with. |
| sled.backGrip | Chwyć linę albo pasy sanek w obie ręce. | Hold the sled rope or straps in both hands. |
| sled.backWalk | Odchyl się od sanek i idź tyłem, odpychając się nogami. | Lean back away from the sled and walk backward, driving with your legs. |
| tgu.setup | Połóż się na plecach, ciężar w wyprostowanej ręce nad sobą; nogę po tej stronie ugnij, stopa płasko na podłodze. | Lie on your back with the weight held straight up in one arm; bend the leg on that side, foot flat on the floor. |
| tgu.move | Wstawaj etapami: podeprzyj się wolną ręką, unieś biodra, przełóż prostą nogę pod siebie do klęku i wstań. Wracaj tą samą drogą. | Get up in stages: prop on your free hand, lift your hips, sweep the straight leg under you to a kneel and stand up. Go back down the same way. |

Istniejące zdania użyte bez zmian: `sled.lean`, `sled.legs`, `hinge.back`, `tgu.arm`, `tgu.eyes`.

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| ace-388 | https://www.acefitness.org/resources/everyone/exercise-library/388/turkish-get-up/ | ACE | 4 | cały opis kroków (ustawienie, wstawanie, powrót) |
| catalyst-481 | https://catalystathletics.com/exercise/481/Turkish-Get-up/ | Catalyst Athletics | 4 | cały opis (11 zdań) |
| ace-ps-5686 (pomocniczo, ta sama organizacja co ace-388) | https://www.acefitness.org/continuing-education/prosource/november-2015/5686/ace-technique-series-turkish-get-up/ | ACE | 4 | kroki, wskazówki, błędy, bezpieczeństwo |
| rep-sled-push | https://repfitness.com/blogs/training/sled-push-technique | Rep Fitness | 4 | wszystkie sekcje (uchwyty, pochylenie, kroki, oddech, błędy) |
| rep-sled-pull | https://repfitness.com/blogs/training/sled-pull-workout | Rep Fitness | 4 | trzy techniki (Backwards Walk, Arm Pull, Hip Drive Pull) |
| bm-sled-6wk | https://breakingmuscle.com/a-six-week-sled-training-program/ | Breaking Muscle | 4 | sekcje Sled Push, Sled Drag, Backward Sled Walk |
| elitefts-backward-pull | https://elitefts.com/blogs/training/backwards-sled-pulls-for-quad-size-and-strength | EliteFTS | 4 | technika i błędy jazdy tyłem |
| elitefts-drag-variations | https://elitefts.com/blogs/training/endless-sled-dragging-variations-that-will-dramatically-improve-your-performance | EliteFTS | 4 | lista wariantów (pozycje 1, 5, 7, 14, 16), sekcje The First Time, The Belt |
| (nie użyte) eight sled drag variations | https://elitefts.com/blogs/training/eight-sled-drag-variations-for-strength-and-athleticism | EliteFTS | 4 | warianty z wyciskaniem w wykroku i czołganie „panther” — nie te same ćwiczenia co w katalogu |
| (nie użyte) BarBend TGU | https://barbend.com/news/doing-turkish-get-ups-wrong/ | BarBend | 4 | błędy: ręka podporowa, kolano, krok w tył przy schodzeniu |
| (nie użyte) Greg Robins, 6 błędów TGU | https://ericcressey.com/6-common-turkish-get-up-technique-mistakes/ | blog trenera | 5 | 6 błędów (tylko wskazówka, szczebel 5) |
| (nie użyte) Seedman, sledgehammer | https://www.advancedhumanperformance.com/blog/master-the-sledgehammer-for-strength-and-performance | firma trenerska | 5 | uchwyt, przesuw ręki, biodra, błędy |
| (nie użyte) Onnit, sledgehammer | https://onnit.com/academy/how-to-develop-power-with-sledgehammer-workouts | producent sprzętu | 4 | tylko ustawienie stóp i ostrzeżenie o ciężarze młota |

Nie użyte z powodu zasad: strony i biblioteki innych aplikacji treningowych, sklepy odzieżowe, ExRx (403), NSCA Kinetic Select (403),
The Prehab Guys (logowanie), Kettlebell Kings (402), indeks ćwiczeń EliteFTS (404).

## 5. Otwarte

- **O1 Sled Push — błędy.** Rep Fitness wymienia: pchanie rękami, zaokrąglanie lędźwi albo zbyt wyprostowana sylwetka, długie kroki,
  unoszenie bioder. Breaking Muscle jako błąd nazywa tylko kołysanie biodrami („Hips stay level”). Żaden błąd nie jest wymieniony
  wprost w dwóch źródłach; wskazówki odwrotne (np. „neutral spine”) nie zostały policzone jako drugie źródło błędu. Krótkie kroki
  — tylko Rep Fitness (Breaking Muscle o długości kroku nie pisze). Istniejące `mis.roundBack` („…żeby dociągnąć ciężar”) nie pasuje do pchania.
- **O2 Turkish Get Up — błędy.** ACE (ProSource 5686) wymienia: ugięta ręka z ciężarem, nadgarstek odgięty przez ciężar, przejście z mostka
  od razu do wstania, pośpiech. BarBend: ręka podporowa przyciągana do ciała, kolano za blisko dłoni, za krótki krok w tył przy schodzeniu.
  Brak części wspólnej dwóch organizacji szczebla 4. `mis.jerk` z zestawu ogólnego nie ma potwierdzenia dla tego ćwiczenia.
  Także: `tgu.arm` mówi „Kettlebell”, a katalog dopuszcza hantel (`requires: kb | db`) — przy wersji z hantlem zdanie byłoby nieścisłe;
  do decyzji produktowej, czy dodać neutralne zdanie („Ciężar przez cały czas nad barkiem, ręka prosta.” — źródła mówią „straight overhead”).
  Oddech „normalnie” — tylko ACE (ProSource), jedno źródło.
- **O3 Backward Drag — błędy i wskazówki.** EliteFTS: nie wiosłuj rękami („Never row the weight”), nie rób długich kroków, nie zatrzymuj sanek;
  krótkie, szybkie kroki. Żadne z drugich źródeł (Rep Fitness, Breaking Muscle) tego nie podaje. Zestaw ogólny `sled.legs` („odpychaj się
  od podłoża”) zastąpiony przez `sled.backWalk`.
- **O4 Sled Drag (Harness).** Tylko Breaking Muscle (sekcja Sled Drag: pas, pochylenie w przód, wyprost w każdym kroku, ręce pracują
  w rytm nóg). EliteFTS wymienia ćwiczenie bez techniki; NSCA (Kinetic Select „Light Sled Pulls”) zwraca 403. Zestaw ogólny
  (`sled.lean`, `sled.legs`) ma więc dziś jedno źródło dla tego wariantu — do usunięcia z zestawu albo do potwierdzenia drugim źródłem.
- **O5 Sledgehammer Swings.** Jedyny przeczytany opis techniki (przesuw górnej ręki do dolnej, siła z bioder, nie z rąk, bez skakania,
  bez pośpiechu) — firma trenerska (szczebel 5). Onnit: tylko stopy przodem do opony i lekki młot dla początkujących. Kettlebell Kings — 402.
- **O6 Bear Crawl Sled Drag.** EliteFTS wymienia „Bear crawls … with strap around belt” bez techniki; strona indeksu EliteFTS — 404.
- **O7 Sled Forward Drag with Press.** Przeczytane źródła mają tylko wyciskanie w miejscu albo w wykroku (EliteFTS), nie marsz z wypchnięciem.
- **O8 Sled Overhead Backward Walk.** Brak przeczytanego opisu w źródłach szczebla 4.
- **O9 Spider Crawl.** Wyniki dotyczą pompki „spiderman” (kolano do łokcia przy opuszczaniu), a katalog opisuje czołganie w niskim podporze;
  nie przenoszę wskazówek (byłaby to analogia).

## 6. Stan

- Zrobione: Sled Push, Turkish Get Up, Backward Drag — częściowe (setup + move + wskazówki, bez błędów); 6 nowych zdań; 7 nowych źródeł, 3 nowe organizacje.
- Zostało: błędy dla trzech częściowych (O1–O3); pozostałe 6 ćwiczeń otwarte (O4–O9).
- Następny krok: spróbować NSCA Kinetic Select (inna ścieżka niż dxpprod/www) i podręczników NSCA (PDF) dla sanek; stron szkoleniowych
  StrongFirst / RKC dla Turkish Get Up (błędy); producentów sanek (np. inni producenci sprzętu) dla Sled Drag z uprzężą i wersji z wyciskaniem.
- Pułapki: wiele wyników to strony aplikacji i sklepów odzieżowych (zakazane jako źródła); indeks ćwiczeń EliteFTS zmienił adresy (404);
  ExRx i NSCA zwracają 403.
