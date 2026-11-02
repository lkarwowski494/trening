# Wskazówki techniki — rodzina sled_throw, rzuty piłką lekarską (fala W1, G3)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3).
Zakres: 9 ćwiczeń z rzutami piłką lekarską (bez sanek — osobny plik). Tylko zbieranie danych; nic nie jest w `lib/` ani w `data/zrodla/cues.json`.

Metoda: zasady z CLAUDE.md („Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki”) i wzór docs/research/33. Każde zdanie
ma ≥ 2 przeczytane źródła z różnych organizacji (szczebel 4 albo wyższy); wariant tego samego ćwiczenia (klęcząc/stojąc, na podłodze/na piłce
gimnastycznej, z partnerem/ze ścianą) liczy się z opisem „(wariant: …)”. Zdań z zestawu ogólnego (`lib/figures/v2/cue-sets.json`), których
przeczytane źródła dla danego ćwiczenia nie potwierdzają, nie wpisuję (polecenie koordynatora 02.11.2026) — opis w „Otwarte”.
Strony innych aplikacji treningowych pominięte (nie są źródłem; nazw nie zapisuję). ExRx i web.archive.org niedostępne.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Wall Ball | gotowe | setup, move ×2, mistakes ×1; `sq.mis.kneesIn`, `sq.down`, `sq.kneesToes` z zestawu ogólnego — niepotwierdzone dla wall ball (Otwarte) |
| Medicine Ball Chest Pass | częściowe | setup, move ×2, tips ×1; brak potwierdzonego błędu |
| One-Arm Medicine Ball Slam | otwarte | brak przeczytanego źródła szczebla ≤ 4 o wersji jednorącz |
| Backward Medicine Ball Throw | częściowe | setup, move; brak błędu; `mb.legs` niepotwierdzone (Otwarte) |
| Medicine Ball Scoop Throw | częściowe | setup, move; brak błędu; `mb.legs` — drugie źródło nie wymienia kostek (Otwarte) |
| Standing Two-Arm Overhead Throw | częściowe | setup, move; brak błędu; `mb.legs` — tylko jedno źródło (Otwarte) |
| Supine Chest Throw | częściowe | setup, move; błędy tylko w jednym źródle (Otwarte) |
| Supine Two-Arm Overhead Throw | częściowe | setup, move; brak błędu |
| Supine One-Arm Overhead Throw | otwarte | brak przeczytanego źródła o wersji jednorącz |

## 2. Dane (propozycja w formacie cues.json)

```json
{
  "orgs": {
    "CrossFit": {"name": "CrossFit — CrossFit Essentials (crossfit.com, materiały szkoleniowe organizacji)", "level": 4, "kind": "org"},
    "REP Fitness": {"name": "REP Fitness — blog Training (producent sprzętu, 2026)", "level": 4, "kind": "maker"},
    "Sussexsport": {"name": "University of Sussex, Sussexsport — karty ćwiczeń (PDF; materiały uczelnianego centrum sportu)", "level": 4, "kind": "site"},
    "VHI": {"name": "VHI — karty ćwiczeń dla pacjentów (biblioteka ćwiczeń dla fizjoterapeutów, publikowana przez Hattiesburg Clinic)", "level": 4, "kind": "site"},
    "Coleman, Szymanski (NSCA, Human Kinetics)": {"name": "NSCA — Strength Training for Baseball, red. Coleman, Szymanski (Human Kinetics; fragment ze strony wydawcy)", "level": 3, "kind": "book"},
    "Hansen, Kennelly (Human Kinetics)": {"name": "Hansen, Kennelly — Plyometric Anatomy (Human Kinetics; fragment przedrukowany przez FitPro)", "level": 3, "kind": "book"},
    "Manske, Reiman (Wichita State University, Duke University)": {"name": "Manske, Reiman — przegląd testów funkcjonalnych, Sports Health 2013", "level": 3, "kind": "study"}
  },
  "sources": {
    "ace-178": {"org": "ACE", "title": "Overhead Medicine Ball Throws (#178)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/", "level": 4},
    "ace-264": {"org": "ACE", "title": "Medicine Ball Lunge to Chest Pass (#264)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/", "level": 4},
    "crossfit-wall-ball": {"org": "CrossFit", "title": "The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning", "url": "https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon", "level": 4},
    "rep-wall-balls": {"org": "REP Fitness", "title": "How to Improve Your Wall Balls", "url": "https://uk.repfitness.com/blogs/training/wall-balls", "level": 4},
    "coach-wall-balls": {"org": "Coach", "title": "How To Do Wall Balls (H. Bullmore, 2023)", "url": "https://www.coachweb.com/medicine-ball-exercises-and-workouts/6542/how-to-do-wall-balls-and-why-it-s-worth-putting-yourself", "level": 4},
    "physitrack-mb-chest-throw": {"org": "Physitrack", "title": "Medicine ball chest throw", "url": "https://au.physitrack.com/home-exercise-video/medicine-ball-chest-throw", "level": 4},
    "physitrack-overhead-wall-throws": {"org": "Physitrack", "title": "Overhead Wall Throws (Arms only)", "url": "https://ca.physitrack.com/home-exercise-video/overhead-wall-throws-%2528arms-only%2529", "level": 4},
    "physitrack-situp-overhead-throw": {"org": "Physitrack", "title": "Sit ups - Ball overhead throw", "url": "https://ie.physitrack.com/home-exercise-video/sit-ups---ball-overhead-throw", "level": 4},
    "sussex-chest-power": {"org": "Sussexsport", "title": "Upper Body Chest Power (PDF)", "url": "https://www.sussex.ac.uk/sport/documents/upper-body-chest-power.pdf", "level": 4},
    "sussex-mb-lying-throw": {"org": "Sussexsport", "title": "Level One: Med Ball Throws — lying throw (PDF, 2012)", "url": "https://www.sussex.ac.uk/sport/documents/med-ball-lying-throw.pdf", "level": 4},
    "vhi-situp-wall-throw": {"org": "VHI", "title": "Sit-Up: Wall Throw (Medicine Ball)", "url": "https://iris.hattiesburgclinic.com/patadv/exkit/Strength Training/English/0250000058fab30m_English.html", "level": 4},
    "vhi-partner-drop-toss": {"org": "VHI", "title": "Partner Drill: Drop / Toss", "url": "https://iris.hattiesburgclinic.com/patadv/exkit/Stability Ball/English/0450000314mb006m_English.html", "level": 4},
    "hk-blob-throw": {"org": "Coleman, Szymanski (NSCA, Human Kinetics)", "title": "Medicine ball BLOB throw (between legs, over back) — fragment, oprac. J. Dawes", "url": "https://us.humankinetics.com/blogs/excerpt/medicine-ball-blob-throw-between-legs-over-back", "level": 3},
    "hk-plyo-anatomy-throws": {"org": "Hansen, Kennelly (Human Kinetics)", "title": "Five medicine ball throws (fragment Plyometric Anatomy)", "url": "https://www.fitpro.com/blog/five-medicine-ball-throws/", "level": 3},
    "breakingmuscle-overhead-mb-throw": {"org": "Breaking Muscle", "title": "Overhead Medicine Ball Throw (Movement Library)", "url": "https://breakingmuscle.com/?p=67437", "level": 4},
    "pmc-3658404": {"org": "Manske, Reiman (Wichita State University, Duke University)", "title": "Functional Performance Testing for Power and Return to Sports, Sports Health 2013 (Trunk Power Tests)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/", "level": 3}
  },
  "exercises": {
    "Wall Ball": {
      "setup": [
        {"c": "wb.setup", "s": [
          ["coach-wall-balls", "How To Do Wall Balls („hold the former up to your chest and face the latter”)"],
          ["rep-wall-balls", "opis ruchu („holding the ball at your chest”)"],
          ["crossfit-wall-ball", "THE WALL-BALL SHOT („Keep the ball low to the chest.”)"]
        ]}
      ],
      "move": [
        {"c": "wb.move", "s": [
          ["coach-wall-balls", "How To Do Wall Balls („push up through your heels and maintain that momentum to throw the ball against the wall”)"],
          ["rep-wall-balls", "wypowiedź trenerki („squat and as soon as you open your hips, throw the ball”)"],
          ["crossfit-wall-ball", "THE WALL-BALL SHOT (przysiad na początku każdego powtórzenia, wyrzut w cel; parafraza)"]
        ]},
        {"c": "wb.catch", "s": [
          ["coach-wall-balls", "How To Do Wall Balls („Catch the ball on the rebound and immediately drop into another squat.”)"],
          ["rep-wall-balls", "opis łapania (piłkę spadającą przyjmujesz, już schodząc do przysiadu; parafraza)"]
        ]}
      ],
      "tips": [],
      "mistakes": [
        {"c": "wb.mis.shallow", "s": [
          ["crossfit-wall-ball", "THE WALL-BALL SHOT („…it is very common to see poor squat depth in this exercise.”)"],
          ["rep-wall-balls", "częste błędy (za płytki przysiad; „Quarter squats won't provide the full benefit”)"],
          ["coach-wall-balls", "How To Do Wall Balls (przysiad co najmniej do równoległego ud; parafraza)"]
        ]}
      ]
    },
    "Medicine Ball Chest Pass": {
      "setup": [
        {"c": "mbcp.setup", "s": [
          ["physitrack-mb-chest-throw", "instrukcja, zdanie 1 („…the ball held at chest height.”)"],
          ["ace-264", "krok 1, Starting position (przodem do partnera, piłka na wysokości klatki; parafraza; wariant: z wykrokiem)"],
          ["sussex-chest-power", "Level Two: Standing Chest Pass (podanie do ściany albo partnera; parafraza)"]
        ]}
      ],
      "move": [
        {"c": "mbcp.move", "s": [
          ["sussex-chest-power", "Level Two („The ball should travel in a straight line.”)"],
          ["ace-264", "krok 2 (wypchnięcie piłki od klatki do partnera; parafraza; wariant: z wykrokiem)"],
          ["physitrack-mb-chest-throw", "instrukcja, zdanie 2–3 (odbicie od ściany, podanie jak w koszykówce; parafraza)"]
        ]},
        {"c": "mbcp.catch", "s": [
          ["physitrack-mb-chest-throw", "instrukcja, zdanie 2 („…catch it just in front of your chest.”)"],
          ["ace-264", "krok 3 (łapiący przyjmuje piłkę wyprostowanymi rękami i wyhamowuje ją do klatki; parafraza)"]
        ]}
      ],
      "tips": [
        {"c": "plank.brace", "s": [
          ["physitrack-mb-chest-throw", "instrukcja, zdanie 1 i 4 („core muscles tight”, „maintaining a rigid core”)"],
          ["ace-264", "krok 1 („brace your abs”; parafraza)"]
        ]}
      ],
      "mistakes": []
    },
    "Backward Medicine Ball Throw": {
      "setup": [
        {"c": "bmbt.setup", "s": [
          ["pmc-3658404", "Trunk Power Tests → Backward Overhead Medicine Ball Throw, ryc. 2 („The athlete holds a medicine ball with arms straight in front of the body”)"],
          ["hk-blob-throw", "Setup („…stand with the arms straight and feet approximately shoulder-width apart”)"]
        ]}
      ],
      "move": [
        {"c": "bmbt.move", "s": [
          ["pmc-3658404", "jw. (ruch zamachowy w dół w biodrach i kolanach, potem „extending forcefully backward to throw the ball over the head”)"],
          ["hk-blob-throw", "Action (zamach piłką w dół między nogi, wyskok i rzut „overhead and backward as far as possible”)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Medicine Ball Scoop Throw": {
      "setup": [
        {"c": "scoop.setup", "s": [
          ["hk-plyo-anatomy-throws", "Underhand Vertical Squat Throw, krok 2 („Descend into a low squat, keeping the torso upright, arms extended and ball in front of the body”)"],
          ["breakingmuscle-overhead-mb-throw", "start (biodra w tył, piłka opuszczona między kolana do przysiadu; parafraza)"]
        ]}
      ],
      "move": [
        {"c": "scoop.move", "s": [
          ["hk-plyo-anatomy-throws", "Underhand Vertical Squat Throw, krok 3–4 (wyprost jak w wyskoku z przysiadu, ręce proste, piłka wyrzucona w górę; parafraza)"],
          ["breakingmuscle-overhead-mb-throw", "wyrzut (eksplozja z dołu przysiadu, rzut spod spodu nad głowę łukiem; parafraza)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Standing Two-Arm Overhead Throw": {
      "setup": [
        {"c": "soht.setup", "s": [
          ["ace-178", "Preparation i krok 1 (przodem do partnera, piłka oburącz; parafraza)"],
          ["physitrack-overhead-wall-throws", "zdanie 1 („Stand tall facing a wall … holding a ball with both hands.”; wariant: tylko ręce)"]
        ]}
      ],
      "move": [
        {"c": "soht.move", "s": [
          ["ace-178", "krok 2–3 (piłka nad głowę i za głowę, potem ręce mocno w przód nad głową; parafraza)"],
          ["hk-plyo-anatomy-throws", "Kneeling Medicine Ball Overhead Pass („Draw the medicine ball behind the head and then pass powerfully to a partner or against a firm wall”; wariant: klęcząc)"],
          ["physitrack-overhead-wall-throws", "zdanie 2 („Bring the ball forwards and above your head and throw the ball against the wall.”; wariant: tylko ręce)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Supine Chest Throw": {
      "setup": [
        {"c": "sct.setup", "s": [
          ["sussex-mb-lying-throw", "Teaching Points 1–2 (leżenie na plecach na macie, ręce wyciągnięte w górę, gotowe do łapania; parafraza)"],
          ["vhi-partner-drop-toss", "zdanie 1 („Lie supine over ball, arms outstretched.”; wariant: na piłce gimnastycznej)"]
        ]}
      ],
      "move": [
        {"c": "sct.move", "s": [
          ["sussex-mb-lying-throw", "Teaching Points 5 („Participant catches the ball and immediately throws it forcefully upwards extending both arms vertically”)"],
          ["vhi-partner-drop-toss", "zdanie 2 („Catch ball, allowing it to return to chest. Quickly throw ball back up to partner.”; wariant: na piłce gimnastycznej)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Supine Two-Arm Overhead Throw": {
      "setup": [
        {"c": "soht2.setup", "s": [
          ["physitrack-situp-overhead-throw", "instrukcja 1–3 (leżenie, piłka oburącz za głową tuż nad podłogą; parafraza)"],
          ["vhi-situp-wall-throw", "instrukcja („Holding small medicine ball beyond head…”)"]
        ]}
      ],
      "move": [
        {"c": "soht2.move", "s": [
          ["physitrack-situp-overhead-throw", "instrukcja 4 („Sit up and throw the ball to a partner standing in front of you or against a wall.”)"],
          ["vhi-situp-wall-throw", "instrukcja („…sit up and bounce ball off wall.”)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    }
  }
}
```

## 3. Nowe zdania

Istniejące zdania z `lib/cues/text/pl.json` użyte bez zmian: `plank.brace` (Chest Pass). `slam.move` nie pasuje do wersji jednorącz
(„oburącz”). `sq.down`, `sq.kneesToes`, `sq.mis.kneesIn`, `mb.legs` — patrz „Otwarte”.

| Id | PL | EN (propozycja) |
|---|---|---|
| wb.setup | Stań przodem do ściany, piłkę trzymaj oburącz przy klatce. | Face the wall and hold the ball with both hands at your chest. |
| wb.move | Zejdź do przysiadu, a wstając, jednym ruchem wyrzuć piłkę w górę, w cel na ścianie. | Squat down, then as you stand, throw the ball up to the target on the wall in one motion. |
| wb.catch | Złap piłkę po odbiciu i od razu schodź z nią do kolejnego przysiadu. | Catch the ball off the wall and go straight down into the next squat. |
| wb.mis.shallow | Za płytki przysiad. | Squatting too shallow. |
| mbcp.setup | Stań przodem do ściany albo partnera, piłka oburącz na wysokości klatki. | Face the wall or a partner, ball in both hands at chest height. |
| mbcp.move | Mocno wypchnij piłkę od klatki prosto przed siebie. | Push the ball hard from your chest straight ahead. |
| mbcp.catch | Złap piłkę przed klatką i od razu podaj ją znowu. | Catch the ball in front of your chest and pass it again right away. |
| bmbt.setup | Stań tyłem do kierunku rzutu, piłka oburącz na prostych rękach przed sobą. | Stand with your back to the throw, ball in both hands, arms straight in front of you. |
| bmbt.move | Ugnij biodra i kolana, opuszczając piłkę, potem dynamicznie się wyprostuj i przerzuć ją nad głową za siebie. | Bend your hips and knees as you lower the ball, then drive up hard and throw it back over your head. |
| scoop.setup | Zejdź do przysiadu z piłką trzymaną nisko przed sobą na prostych rękach. | Squat down holding the ball low in front of you, arms straight. |
| scoop.move | Wybij się z przysiadu jak do wyskoku i wyrzuć piłkę spod spodu w górę. | Drive out of the squat as if jumping and throw the ball up underhand. |
| soht.setup | Stań przodem do ściany albo partnera, piłka oburącz. | Face the wall or a partner, ball in both hands. |
| soht.move | Przenieś piłkę nad głowę, za głowę, potem mocno rzuć ją znad głowy przed siebie. | Take the ball overhead and behind your head, then throw it hard forward from overhead. |
| sct.setup | Połóż się na plecach, ręce wyciągnięte w górę, gotowe do złapania piłki. | Lie on your back with your arms reaching up, ready to catch the ball. |
| sct.move | Złap piłkę nad klatką i od razu wyrzuć ją mocno pionowo w górę, prostując ręce. | Catch the ball over your chest and throw it straight back up hard, straightening your arms. |
| soht2.setup | Połóż się na plecach z piłką trzymaną oburącz za głową. | Lie on your back holding the ball with both hands behind your head. |
| soht2.move | Usiądź i w trakcie siadu rzuć piłkę znad głowy do partnera albo w ścianę. | Sit up and, as you come up, throw the ball from overhead to a partner or the wall. |

Uwaga do `sct.move`: VHI opisuje pozwolenie piłce zejść do klatki przed wyrzutem, Sussexsport — natychmiastowy wyrzut; zdanie zawiera tylko część wspólną (złap → od razu wyrzuć w górę).

## 4. Źródła (nowe)

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-178 | https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/ | ACE | 4 | Preparation, kroki 1–3, Exercise Variation |
| ace-264 | https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/ | ACE | 4 | kroki 1–6 (wariant z wykrokiem) |
| crossfit-wall-ball | https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon | CrossFit | 4 | sekcja „THE WALL-BALL SHOT” (points of performance, częsty błąd) |
| rep-wall-balls | https://uk.repfitness.com/blogs/training/wall-balls | REP Fitness (producent) | 4 | opis ruchu, wypowiedź trenerki, częste błędy (akt. 03.08.2026, bez autora) |
| coach-wall-balls | https://www.coachweb.com/medicine-ball-exercises-and-workouts/6542/how-to-do-wall-balls-and-why-it-s-worth-putting-yourself | Coach | 4 | „How To Do Wall Balls”, porady trenera (2023) |
| physitrack-mb-chest-throw | https://au.physitrack.com/home-exercise-video/medicine-ball-chest-throw | Physitrack | 4 | instrukcja (4 zdania) |
| physitrack-overhead-wall-throws | https://ca.physitrack.com/home-exercise-video/overhead-wall-throws-%2528arms-only%2529 | Physitrack | 4 | instrukcja (3 zdania) |
| physitrack-situp-overhead-throw | https://ie.physitrack.com/home-exercise-video/sit-ups---ball-overhead-throw | Physitrack | 4 | instrukcja (6 zdań) |
| sussex-chest-power | https://www.sussex.ac.uk/sport/documents/upper-body-chest-power.pdf | Sussexsport | 4 | Level One–Two (PDF, 1 s.) |
| sussex-mb-lying-throw | https://www.sussex.ac.uk/sport/documents/med-ball-lying-throw.pdf | Sussexsport | 4 | Teaching Points, Look out for (PDF, 1 s.) |
| vhi-situp-wall-throw | https://iris.hattiesburgclinic.com/patadv/exkit/Strength Training/English/0250000058fab30m_English.html | VHI | 4 | instrukcja (1 zdanie) |
| vhi-partner-drop-toss | https://iris.hattiesburgclinic.com/patadv/exkit/Stability Ball/English/0450000314mb006m_English.html | VHI | 4 | instrukcja (2 zdania) |
| hk-blob-throw | https://us.humankinetics.com/blogs/excerpt/medicine-ball-blob-throw-between-legs-over-back | Coleman, Szymanski (NSCA, Human Kinetics) | 3 | Setup, Action, coaching points |
| hk-plyo-anatomy-throws | https://www.fitpro.com/blog/five-medicine-ball-throws/ | Hansen, Kennelly (Human Kinetics) | 3 | Underhand Vertical Squat Throw (kroki 1–5), Kneeling Overhead Pass, Downward Slam Throw |
| breakingmuscle-overhead-mb-throw | https://breakingmuscle.com/?p=67437 | Breaking Muscle | 4 | Overhead Medicine Ball Throw — start, przysiad, wyrzut |
| pmc-3658404 | https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/ | Manske, Reiman | 3 | Trunk Power Tests → Backward Overhead Medicine Ball Throw, ryc. 2 |

Do decyzji audytora: Sussexsport i VHI jako szczebel 4 (w docs/33 Sussexsport był „PROPOZYCJA”); dwa fragmenty Human Kinetics to różne zespoły
autorów (niezależne), ale ten sam wydawca. Trzy strony Physitrack to jedna organizacja — nigdzie nie liczę ich podwójnie.

## 5. Otwarte

- **One-Arm Medicine Ball Slam** — żadne przeczytane źródło szczebla ≤ 4 nie opisuje wersji jednorącz (ACE 182, Coach i Plyometric Anatomy — tylko oburącz;
  jedyne trafienia to strony aplikacji, pominięte). `slam.move` mówi „oburącz” — nie pasuje. Zestaw ogólny ma dziś puste ok/err.
- **Supine One-Arm Overhead Throw** — brak przeczytanego źródła o wersji jednorącz (tylko sklep z suplementami / aplikacje). Zostaje „open”.
- **Wall Ball: `sq.mis.kneesIn`, `sq.kneesToes`, `sq.down`** (zestaw ogólny dziś) — żadne z trzech przeczytanych źródeł o wall ball nie mówi o kolanach
  ani o cofaniu bioder; zgodnie z poleceniem koordynatora nie wpisuję. Uwaga: `lib/figures/v2/families.ts` uzasadnia widok z przodu błędem
  „kolana do środka” — ten błąd nie ma dziś potwierdzenia dla wall ball (do wiadomości koordynatora/rysownika).
- **Wall Ball: rozbijanie ruchu na przysiad i osobny rzut rękami** — tylko REP Fitness wprost („separate squat, throw, catch, pause, and reset”). Jedno źródło.
- **Wall Ball: łokcie w dół i do środka, piłka nie zasłania celu, odległość na długość ręki od ściany** — po jednym źródle (CrossFit; Coach).
- **Wall Ball: głębokość przysiadu jako liczba** („wyraźnie poniżej kolan” w regulaminie zawodów vs „co najmniej równolegle”) — różnica między źródłami; w danych tylko błąd „za płytki przysiad”, bez progu.
- **`mb.legs` (Backward Throw, Scoop Throw, Standing Two-Arm Overhead Throw)** — „prostuj biodra, kolana i kostki”: Standing Overhead — tylko ACE 178
  (Physitrack „tylko ręce”, Plyometric Anatomy klęcząc); Scoop — Breaking Muscle wymienia kostki, Plyometric Anatomy tylko kolana i biodra (+ oderwanie stóp);
  Backward — źródła mówią o wyproście/wyskoku, kostek nie wymieniają. Nie wpisuję.
- **Backward Throw: ręce proste przez cały ruch; krótkie przejście z zamachu w wyrzut** — tylko fragment NSCA (Coleman, Szymanski). Jedno źródło.
- **Scoop Throw: uważaj, żeby spadająca piłka w ciebie nie trafiła** — tylko Plyometric Anatomy. Jedno źródło. Kierunek rzutu: źródła — pionowo
  albo lekko w przód (Plyometric Anatomy) / łukiem nad głową (Breaking Muscle); w danych tylko „w górę”.
- **Supine Chest Throw: błędy** — „wyginanie pleców”, „piłka nie leci prosto w górę” tylko w karcie Sussexsport („Look out for”). Jedno źródło.
- **Supine Two-Arm Overhead Throw: napięty brzuch, łapanie przy powrocie do leżenia** — po jednym źródle (VHI; Physitrack).
- **Chest Pass: błędy** — nie znaleziono w przeczytanych źródłach szczebla ≤ 4 (wskazówka „nie odchylaj się dla rozpędu” tylko na stronach aplikacji).
- **Chest Pass: szerokość stóp** — Sussexsport „shoulder width”, ACE „hip-width” — pominięta.
- **Medicine Ball Slam (już w cues.json, poza zakresem):** Coach („How To Do The Mighty Medicine Ball Slam”, 2021: „Try not to bend at the hips.”) przeczy
  opisowi ACE 182 (pochylenie w biodrach) co do wykonania; `hinge.back` (neutralne plecy) nie jest tym podważone, ale opis ruchu warto przejrzeć przy recenzji rodziny.
- Niedostępne w tej sesji: ExRx (403), web.archive.org, stack.com (503), topendsports (domena zablokowana), PDF NSCA Basics (403).

## 6. Stan

- Zrobione (02.11.2026): wszystkie 9 ćwiczeń przejrzane; 1 gotowe (Wall Ball), 6 częściowych, 2 otwarte; 17 nowych zdań, 16 nowych źródeł, 7 nowych organizacji.
- Zostało: błędy (mistakes) dla 6 ćwiczeń częściowych; wersje jednorącz (One-Arm Slam, Supine One-Arm Overhead Throw).
- Następny krok: szukać kart z sekcją błędów (np. materiały NSCA o rzutach piłką lekarską w PDF, inni producenci piłek lekarskich, uczelniane centra sportu);
  dla wersji jednorącz — materiały rehabilitacji barku (np. programy plyometryczne szpitali) jako „wariant”.
- Pułapki: wiele trafień wyszukiwarki to strony aplikacji (nie źródło); kilka stron Physitrack = jedna organizacja; PDF Sussexsport czytać z pliku (WebFetch zwraca binaria).
