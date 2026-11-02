# Wskazówki techniki — rodzina sled_throw, rzuty piłką lekarską (fala W1, G3)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3); druga sesja tego samego dnia — błędy (mistakes), wersje jednorącz, szczeble źródeł.
Zakres: 9 ćwiczeń z rzutami piłką lekarską (bez sanek — osobny plik). Tylko zbieranie danych; nic nie jest w `lib/` ani w `data/zrodla/cues.json`.

Metoda: zasady z CLAUDE.md („Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki”), wzór docs/research/33 i rozstrzygnięcie szczebli
koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = organizacja szkoląca/certyfikująca trenerów, serwis z redakcją i recenzją ekspercką albo producent
o własnym rodzaju sprzętu; autor + data albo treść firmowana; bez marketingu; Breaking Muscle = 5; strony innych aplikacji nie są źródłem).
Każde zdanie ma ≥ 2 przeczytane źródła z różnych organizacji (szczebel 4 albo wyższy); wariant tego samego ćwiczenia liczy się z opisem „(wariant: …)”.
Zdań z zestawu ogólnego (`lib/figures/v2/cue-sets.json`), których przeczytane źródła dla danego ćwiczenia nie potwierdzają, nie wpisuję — opis w „Otwarte”.
ExRx, web.archive.org i topendsports niedostępne.

> **Przeliczenie 02.11.2026:** statusy w sekcji 1 i blok w sekcji 2 są NIEAKTUALNE — wiążąca jest sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026” na końcu pliku (Coach i Freelap USA — strony bez autora z kwalifikacjami = nie liczą się).

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Wall Ball | gotowe | setup, move ×2, mistakes ×1; `wb.catch` stoi na Coach + REP Fitness — Coach do decyzji koordynatora (niżej) |
| Medicine Ball Chest Pass | częściowe | setup, move (ACE + RFL); brak potwierdzonego błędu — `mbcp.mis.elbows` do decyzji koordynatora (RFL + Freelap USA); `mbcp.catch`, `plank.brace` spadły (Physitrack nie jest źródłem) |
| Backward Medicine Ball Throw | częściowe | setup, move, tips ×1 (nowe: World Athletics); brak błędu |
| Standing Two-Arm Overhead Throw | częściowe | setup, move, tips ×1 (nowe: World Athletics); brak błędu |
| Medicine Ball Scoop Throw | otwarte | po zmianie szczebli tylko jedno źródło (Plyometric Anatomy); Breaking Muscle = 5; strona TRX powiela tę samą listę rzutów (niezależność wątpliwa) |
| Supine Chest Throw | otwarte | Sussexsport i VHI = szczebel 5 (uzasadnienie niżej) |
| Supine Two-Arm Overhead Throw | otwarte | Physitrack (nie źródło) + VHI (5) |
| One-Arm Medicine Ball Slam | otwarte | brak przeczytanego źródła szczebla ≤ 4 o wersji jednorącz |
| Supine One-Arm Overhead Throw | otwarte | brak przeczytanego źródła o wersji jednorącz |

## 2. Dane (propozycja w formacie cues.json) — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "orgs": {
    "CrossFit": {"name": "CrossFit — CrossFit Essentials (crossfit.com, materiały szkoleniowe organizacji)", "level": 4, "kind": "org"},
    "REP Fitness": {"name": "REP Fitness — blog Training (producent sprzętu, m.in. piłek do wall ball, 2026)", "level": 4, "kind": "maker"},
    "Coach": {"name": "Coach (coachweb.com) — magazyn o treningu, artykuły z autorem i datą", "level": 4, "kind": "site"},
    "RFL": {"name": "Rugby Football League — karta ćwiczenia „Med Ball Chest Throw” (federacja, szkolenie trenerów)", "level": 4, "kind": "org"},
    "World Athletics": {"name": "World Athletics — Kids' Athletics, Teaching athletics (federacja, materiały szkoleniowe)", "level": 4, "kind": "org"},
    "Coleman, Szymanski (NSCA, Human Kinetics)": {"name": "NSCA — Strength Training for Baseball, red. Coleman, Szymanski (Human Kinetics; fragment ze strony wydawcy)", "level": 3, "kind": "book"},
    "Manske, Reiman (Wichita State University, Duke University)": {"name": "Manske, Reiman — przegląd testów funkcjonalnych, Sports Health 2013", "level": 3, "kind": "study"}
  },
  "sources": {
    "ace-178": {"org": "ACE", "title": "Overhead Medicine Ball Throws (#178)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/", "level": 4},
    "ace-264": {"org": "ACE", "title": "Medicine Ball Lunge to Chest Pass (#264)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/", "level": 4},
    "crossfit-wall-ball": {"org": "CrossFit", "title": "The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning", "url": "https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon", "level": 4},
    "rep-wall-balls": {"org": "REP Fitness", "title": "How to Improve Your Wall Balls", "url": "https://uk.repfitness.com/blogs/training/wall-balls", "level": 4},
    "coach-wall-balls": {"org": "Coach", "title": "How To Do Wall Balls (H. Bullmore, 2023)", "url": "https://www.coachweb.com/medicine-ball-exercises-and-workouts/6542/how-to-do-wall-balls-and-why-it-s-worth-putting-yourself", "level": 4},
    "rfl-mb-chest-throw": {"org": "RFL", "title": "Med Ball Chest Throw (karta PDF z oceną 1–5)", "url": "https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf", "level": 4},
    "wa-backward-overhead-throw": {"org": "World Athletics", "title": "Backward overhead throw (Kids' Athletics, poziom 3)", "url": "https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw", "level": 4},
    "wa-overarm-throw": {"org": "World Athletics", "title": "Overarm throw (Kids' Athletics)", "url": "https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw", "level": 4},
    "hk-blob-throw": {"org": "Coleman, Szymanski (NSCA, Human Kinetics)", "title": "Medicine ball BLOB throw (between legs, over back) — fragment, oprac. J. Dawes", "url": "https://us.humankinetics.com/blogs/excerpt/medicine-ball-blob-throw-between-legs-over-back", "level": 3},
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
          ["ace-264", "krok 1, Starting position (przodem do partnera, piłka na wysokości klatki; parafraza; wariant: z wykrokiem)"],
          ["rfl-mb-chest-throw", "Directions, punkty 1–2 („Stand with feet shoulder-width apart and hands behind the ball.”, piłka przyciągnięta do klatki; wariant: rzut na odległość z lekkiego przysiadu)"]
        ]}
      ],
      "move": [
        {"c": "mbcp.move", "s": [
          ["ace-264", "krok 2 (wypchnięcie piłki od klatki do partnera; parafraza; wariant: z wykrokiem)"],
          ["rfl-mb-chest-throw", "Directions, punkt 3 („…extend your elbows to push ball away from body.”; wariant: rzut na odległość)"]
        ]}
      ],
      "tips": [],
      "mistakes": []
    },
    "Backward Medicine Ball Throw": {
      "setup": [
        {"c": "bmbt.setup", "s": [
          ["pmc-3658404", "Trunk Power Tests → Backward Overhead Medicine Ball Throw, ryc. 2 („The athlete holds a medicine ball with arms straight in front of the body”)"],
          ["hk-blob-throw", "Setup („…stand with the arms straight and feet approximately shoulder-width apart”)"],
          ["wa-backward-overhead-throw", "opis pod tytułem (tyłem do linii, piłka oburącz na długość ramion; parafraza)"]
        ]}
      ],
      "move": [
        {"c": "bmbt.move", "s": [
          ["pmc-3658404", "jw. (ruch zamachowy w dół w biodrach i kolanach, potem „extending forcefully backward to throw the ball over the head”)"],
          ["hk-blob-throw", "Action (zamach piłką w dół między nogi, wyskok i rzut „overhead and backward as far as possible”)"],
          ["wa-backward-overhead-throw", "opis pod tytułem (przysiad, szybki wyprost nóg, rzut nad głową w tył; parafraza)"]
        ]}
      ],
      "tips": [
        {"c": "bmbt.armsStraight", "s": [
          ["hk-blob-throw", "Coaching tips („Keep the arms straight throughout the duration of the exercise.”)"],
          ["wa-backward-overhead-throw", "opis pod tytułem („…keep both arms extended at all time”)"]
        ]}
      ],
      "mistakes": []
    },
    "Standing Two-Arm Overhead Throw": {
      "setup": [
        {"c": "soht.setup", "s": [
          ["ace-178", "Preparation i krok 1 (przodem do partnera, piłka oburącz; parafraza)"],
          ["wa-overarm-throw", "Description („…hold the medicine ball with both hands behind the head”; przodem do kierunku rzutu)"]
        ]}
      ],
      "move": [
        {"c": "soht.move", "s": [
          ["ace-178", "krok 2–3 (piłka nad głowę i za głowę, potem ręce mocno w przód nad głową; parafraza)"],
          ["wa-overarm-throw", "Description („They throw the medicine ball over the head as far as possible…”)"]
        ]}
      ],
      "tips": [
        {"c": "plank.brace", "s": [
          ["ace-178", "krok 1–2 („contract and brace the abdominals…”; brzuch napięty także przy zamachu)"],
          ["wa-overarm-throw", "Coaching points („…keep their trunk muscles tense the whole time…”)"]
        ]}
      ],
      "mistakes": []
    }
  }
}
```

## 3. Nowe zdania

Istniejące zdania z `lib/cues/text/pl.json` użyte bez zmian: `plank.brace` (Standing Two-Arm Overhead Throw). `slam.move` nie pasuje do wersji jednorącz
(„oburącz”). `sq.down`, `sq.kneesToes`, `sq.mis.kneesIn`, `mb.legs` — patrz „Otwarte”.

| Id | PL | EN (propozycja) |
|---|---|---|
| wb.setup | Stań przodem do ściany, piłkę trzymaj oburącz przy klatce. | Face the wall and hold the ball with both hands at your chest. |
| wb.move | Zejdź do przysiadu, a wstając, jednym ruchem wyrzuć piłkę w górę, w cel na ścianie. | Squat down, then as you stand, throw the ball up to the target on the wall in one motion. |
| wb.catch | Złap piłkę po odbiciu i od razu schodź z nią do kolejnego przysiadu. | Catch the ball off the wall and go straight down into the next squat. |
| wb.mis.shallow | Za płytki przysiad. | Squatting too shallow. |
| mbcp.setup | Stań przodem do celu, piłka oburącz przy klatce. | Face your target, ball in both hands at your chest. |
| mbcp.move | Mocno wypchnij piłkę od klatki prosto przed siebie. | Push the ball hard from your chest straight ahead. |
| bmbt.setup | Stań tyłem do kierunku rzutu, piłka oburącz na prostych rękach przed sobą. | Stand with your back to the throw, ball in both hands, arms straight in front of you. |
| bmbt.move | Ugnij biodra i kolana, opuszczając piłkę, potem dynamicznie się wyprostuj i przerzuć ją nad głową za siebie. | Bend your hips and knees as you lower the ball, then drive up hard and throw it back over your head. |
| bmbt.armsStraight | Ręce proste przez cały ruch. | Keep your arms straight the whole way. |
| soht.setup | Stań przodem do celu, piłka oburącz. | Face your target, ball in both hands. |
| soht.move | Przenieś piłkę nad głowę, za głowę, potem mocno rzuć ją znad głowy przed siebie. | Take the ball overhead and behind your head, then throw it hard forward from overhead. |

Zmiany względem pierwszej sesji: `mbcp.setup` i `soht.setup` bez „ściany albo partnera” (ściana miała tylko źródła, które spadły; źródła
zgodne co do celu przed sobą). Zdania przygotowane w pierwszej sesji, dziś bez dwóch źródeł szczebla ≤ 4 (nie do danych, w „Otwarte”):
`mbcp.catch`, `scoop.setup`, `scoop.move`, `sct.setup`, `sct.move`, `soht2.setup`, `soht2.move` — brzmienie zostaje w historii gita tego pliku.

## 4. Źródła

| Id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-178 | https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/ | ACE | 4 | Preparation, kroki 1–4; brak sekcji błędów |
| ace-264 | https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/ | ACE | 4 | kroki 1–6 (wariant z wykrokiem) |
| crossfit-wall-ball | https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon | CrossFit | 4 | „THE WALL-BALL SHOT” (points of performance, częsty błąd) |
| rep-wall-balls | https://uk.repfitness.com/blogs/training/wall-balls | REP Fitness (producent piłek do wall ball) | 4 | opis ruchu, wypowiedź trenerki, częste błędy (akt. 03.08.2026, bez autora — treść firmowana) |
| coach-wall-balls | https://www.coachweb.com/medicine-ball-exercises-and-workouts/6542/how-to-do-wall-balls-and-why-it-s-worth-putting-yourself | Coach | 4 (do decyzji) | „How To Do Wall Balls” (2023) |
| rfl-mb-chest-throw | https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf | RFL | 4 | Directions (4 punkty); tabela ✓/✗: Starting position, Preparation lower/upper body, Coordination and drive, Release |
| wa-backward-overhead-throw | https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw | World Athletics | 4 | Aim i opis pod tytułem (2 zdania wskazówek); brak sekcji błędów |
| wa-overarm-throw | https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw | World Athletics | 4 | Aim, Description, Coaching points |
| wa-forward-throw | https://worldathletics.org/kids-athletics/teaching-athletics/forward-throw | World Athletics | 4 | Aim, Description, Coaching points — nie użyte: strona nie mówi, skąd idzie piłka (spod spodu czy od klatki) |
| hk-blob-throw | https://us.humankinetics.com/blogs/excerpt/medicine-ball-blob-throw-between-legs-over-back | Coleman, Szymanski (NSCA, Human Kinetics) | 3 | Setup, Action, Coaching tips (2) |
| pmc-3658404 | https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/ | Manske, Reiman | 3 | Trunk Power Tests → Backward Overhead Medicine Ball Throw, ryc. 2 |
| hk-plyo-anatomy-throws | https://www.fitpro.com/blog/five-medicine-ball-throws/ | Hansen, Kennelly (Human Kinetics; przedruk FitPro) | do decyzji (3 tylko gdy autor NSCA/naukowiec — nie sprawdziłem) | Underhand Vertical Squat Throw (kroki 1–5, uwaga o spadającej piłce), Kneeling Overhead Pass, Downward Slam Throw |
| freelap-mb-mistakes | https://www.freelapusa.com/3-mistakes-you-might-be-making-with-medicine-ball-training | Freelap USA (C. Valle) | do decyzji (blog producenta pomiaru czasu, nie o własnym sprzęcie; autor bez kwalifikacji na stronie) | „Your Technique Needs Some Work”: Overhead Throws, Underhand Scoops, Chest Passes and Shot Throws |
| seedman-ahp | https://advancedhumanperformance.com/blog/the-best-medicine-ball-exercise-youve-never-done | Advanced Human Performance (J. Seedman, PhD) | 5 (blog trenera) | uwaga o podaniu od klatki na stojąco |
| trx-mb-throws | https://www.trxtraining.com/blogs/news/medicine-ball-throws | TRX (Tristan Z., 29.07.2024) | 4 formalnie, ale nie niezależne od Plyometric Anatomy (ta sama lista pięciu rzutów) | 5 rzutów; brak błędów |
| tc-building-power-5 | https://training-conditioning.com/article/building-power-part-five/ | Training & Conditioning (N. Tumminello, 2017) | 4 | tylko rzuty boczne (side-scoop, punch) — poza zakresem ćwiczeń |
| breakingmuscle-overhead-mb-throw | https://breakingmuscle.com/?p=67437 | Breaking Muscle | 5 (rozstrzygnięcie koordynatora) | nie liczy się |
| sussex-chest-power, sussex-mb-lying-throw | https://www.sussex.ac.uk/sport/documents/upper-body-chest-power.pdf, …/med-ball-lying-throw.pdf | Sussexsport | 5 (niżej) | Level One–Two; Teaching Points, Look out for |
| vhi-situp-wall-throw, vhi-partner-drop-toss | iris.hattiesburgclinic.com/patadv/exkit/… | VHI | 5 (niżej) | instrukcje 1–2 zdania |
| physitrack-* (3 strony) | *.physitrack.com/home-exercise-video/… | Physitrack | nie źródło (platforma ćwiczeń = inna aplikacja; do decyzji koordynatora) | instrukcje 3–6 zdań |

### Rozstrzygnięcie: Sussexsport i VHI — szczebel 5

- **Sussexsport** (centrum sportu University of Sussex): karty są firmowane, ale to materiał dla użytkowników siłowni uczelnianej, nie organizacji
  szkolącej trenerów ani serwisu z redakcją i recenzją; bez autora, jedna z kart z datą 2012. Warunek (a) z rozstrzygnięcia koordynatora niespełniony → **5**.
  Wcześniejsza „PROPOZYCJA” w docs/33 — zgodnie z tym tylko wskazówka.
- **VHI** (karty ćwiczeń dla pacjentów, podawane przez portal kliniki): komercyjna biblioteka ćwiczeń dla fizjoterapeutów (bliżej platformy ćwiczeń niż
  organizacji szkolącej), bez autora i daty; analogicznie do reguły „WebMD Ignite: 4 tylko materiał placówki z datą” — tu brak daty → **5**.

## 5. Otwarte

- **Do decyzji koordynatora — `mbcp.mis.elbows`** (Chest Pass): PL „Opuszczone łokcie — zamiast trzymać je na boki, za piłką.”, EN „Dropping your elbows
  instead of keeping them out to the sides behind the ball.” Źródła: RFL, tabela „Preparation upper body” (✓ „chest up and elbows out”, ✗ „elbows down”;
  wariant: rzut na odległość z lekkiego przysiadu) i Freelap USA, „Chest Passes and Shot Throws” → „Elbows Up” („Dropping the elbow increases torque on the shoulder…”
  — uzasadnienie zdrowotne pomijam). Dane gotowe: `{"c": "mbcp.mis.elbows", "s": [["rfl-mb-chest-throw", "Preparation upper body, ✗"], ["freelap-mb-mistakes", "Elbows Up"]]}`.
  Wejdzie, jeśli Freelap USA zostanie uznany za szczebel 4; inaczej jedno źródło.
- **Chest Pass: inne błędy** — „ciało leci w przód dla rozpędu” tylko Seedman (5); RFL „ręce pchają przed nogami”, „za mała praca nóg”, „wypuszczenie za nisko/za wysoko”
  dotyczą rzutu na odległość z przysiadu — jedno źródło. `mbcp.catch` i `plank.brace` — po odrzuceniu Physitrack tylko ACE.
- **Chest Pass: szerokość stóp** — RFL i Sussexsport „shoulder width”, ACE „hip-width” — pominięta.
- **Backward Throw: błędy** — źródła (NSCA, World Athletics, Manske) podają tylko wskazówki; brak źródła z błędami. Krótkie przejście z zamachu w wyrzut — tylko NSCA.
  „Aktywne odbicie nóg przy wypuszczeniu” — tylko World Athletics.
- **Standing Two-Arm Overhead Throw: błędy** — „blokowanie przednią nogą i przyspieszenie tułowia przez ręce” tylko Freelap USA (i niejasne do krótkiej karty);
  przegięcie lędźwi — tylko strony aplikacji. `mb.legs` — World Athletics „use the explosive power of their legs” + ACE 178 (potrójny wyprost); `mb.legs` wymienia
  biodra, kolana i kostki, World Athletics stawów nie wymienia → nie wpisuję (możliwe krótsze zdanie „Rzucaj całym ciałem, z nóg” — do decyzji, nie przygotowane).
- **Scoop Throw (otwarte):** jedyne źródło ≥ 4 to Plyometric Anatomy (status do decyzji); Breaking Muscle = 5; TRX powiela tę samą listę rzutów. Błąd
  „rzut z lędźwi zamiast z nóg (prostowanie się jak w szybkim martwym ciągu)” — tylko Freelap USA. „Uważaj, żeby spadająca piłka w ciebie nie trafiła” — tylko
  Plyometric Anatomy. World Athletics „Forward throw” (plecy proste i napięte przy uginaniu kolan, ręce proste przy wypuszczeniu) nie mówi, że piłka idzie spod spodu — nie użyte.
- **Supine Chest Throw (otwarte):** Sussexsport (5) i VHI (5). Błędy „wyginanie pleców”, „piłka nie leci prosto w górę” tylko Sussexsport. Brak źródła ≥ 4 (szukano: ACE, NASM, NSCA, producenci).
- **Supine Two-Arm Overhead Throw (otwarte):** Physitrack (nie źródło) i VHI (5).
- **One-Arm Medicine Ball Slam (otwarte):** żadne przeczytane źródło szczebla ≤ 4 nie opisuje wersji jednorącz (ACE 182, Coach, Plyometric Anatomy, TRX — tylko oburącz;
  wyszukiwanie ACE/NASM/NSCA/CrossFit 02.11 — tylko strony aplikacji i blogi). `slam.move` mówi „oburącz” — nie pasuje.
- **Supine One-Arm Overhead Throw (otwarte):** brak przeczytanego źródła o wersji jednorącz (tylko sklepy i aplikacje).
- **Wall Ball: `sq.mis.kneesIn`, `sq.kneesToes`, `sq.down`** (zestaw ogólny dziś) — żadne z trzech przeczytanych źródeł nie mówi o kolanach ani o cofaniu bioder; nie wpisuję.
  `lib/figures/v2/families.ts` uzasadnia widok z przodu błędem „kolana do środka” — dla wall ball niepotwierdzony (do wiadomości koordynatora/rysownika).
- **Wall Ball: `wb.catch`** stoi na Coach + REP Fitness; jeśli koordynator nie uzna magazynu Coach za szczebel 4 (redakcja tak, recenzja ekspercka niesprawdzona) — do Otwartych.
- **Wall Ball: rozbijanie ruchu na przysiad i osobny rzut** — tylko REP Fitness. Łokcie w dół i do środka, piłka nie zasłania celu, odległość od ściany — po jednym źródle.
  Głębokość przysiadu jako liczba — różnica między źródłami; w danych tylko „za płytki przysiad”, bez progu.
- **Medicine Ball Slam (już w cues.json, poza zakresem):** Coach (2021: „Try not to bend at the hips.”) przeczy opisowi ACE 182 (pochylenie w biodrach); do przejrzenia przy recenzji rodziny.
- **Szczeble do decyzji koordynatora:** Coach (magazyn), Freelap USA, Plyometric Anatomy (Human Kinetics — czy autorzy spełniają „NSCA albo uznany naukowiec”), Physitrack.
- Niedostępne: ExRx (403), web.archive.org, stack.com (503 — m.in. artykuł „Med Ball Throwing Exercises: You're Doing Them Wrong”), topendsports (domena zablokowana, także fallback.topendsports.com).

## 6. Stan

- Zrobione (02.11.2026, sesja 2): poszukiwanie błędów dla 6 ćwiczeń i wersji jednorącz; rozstrzygnięcie Sussexsport/VHI (5); zastosowanie szczebli koordynatora
  (Breaking Muscle, Sussexsport, VHI, Physitrack wypadły); nowe źródła: RFL, World Athletics ×2 (+1 przeczytane, nieużyte), Freelap USA, TRX, Training & Conditioning, Seedman.
  Wynik: 1 gotowe (Wall Ball), 3 częściowe (Chest Pass, Backward Throw, Standing Two-Arm Overhead Throw), 5 otwartych. 11 zdań w danych (1 nowe w tej sesji: `bmbt.armsStraight`),
  1 zdanie warunkowe (`mbcp.mis.elbows`).
- Zostało: błędy dla Chest Pass / Backward / Standing Overhead (źródła z sekcją błędów są rzadkie — w przeczytanych materiałach organizacji są tylko wskazówki);
  zastępstwo dla Scoop i obu Supine; wersje jednorącz (prawdopodobnie zostaną otwarte).
- Następny krok: decyzja koordynatora o Freelap USA / Coach / Plyometric Anatomy (odblokowuje `mbcp.mis.elbows` i częściowo Scoop); potem szukać kart federacji
  (inne karty RFL, UK Athletics, Athletics Australia „Athletics Coach”, World Athletics — strona indeksu Teaching athletics) z tabelami ✓/✗ jak w RFL.
- Pułapki: wyniki wyszukiwania to w większości strony aplikacji (nie źródło); TRX powiela listę rzutów z Plyometric Anatomy (niezależność); PDF czytać narzędziem
  Read z pliku zapisanego przez WebFetch (WebFetch zwraca binaria); karty World Athletics nie mają sekcji błędów — tylko „Participants should remember…”.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3) i rozstrzygnięcia koordynatora z 02.11.2026 (Freelap USA i Coach warunkowo 4
per autor — biogram z kwalifikacjami; Physitrack = 5). Kryterium karty z 02.11.2026: ustawienie + ruch. Strony warunkowe sprawdzone WebFetch 02.11.2026.

| Źródło | Szczebel | Dowód |
|---|---|---|
| ace-178, ace-264 | 4 | bez zmian |
| crossfit-wall-ball | 4 | organizacja szkoląca trenerów, treść firmowana (bez zmian) |
| rep-wall-balls | 4 | producent piłek do wall ball — własny rodzaj sprzętu, treść firmowana, akt. 03.08.2026 |
| rfl-mb-chest-throw, wa-backward-overhead-throw, wa-overarm-throw | 4 | federacje — materiały szkoleniowe firmowane (bez zmian) |
| hk-blob-throw (NSCA, Human Kinetics), pmc-3658404 | 3 | książka NSCA (uzup. 2: książki NSCA = 3), przegląd w czasopiśmie |
| coach-wall-balls | **nie liczy się (5)** | strona: „By Harry Bullmore Contributions by Nick Harris-Fry”, „last updated 28 November 2023”; biogram autora: „Harry covers news, reviews and features for Coach…”, „over a decade of training experience” — brak kwalifikacji trenerskich; recenzenta brak |
| freelap-mb-mistakes | **nie liczy się (5)** | strona: tylko „By Carl Valle” i zdjęcie — bez biogramu, kwalifikacji i daty |
| hk-plyo-anatomy-throws (przedruk FitPro) | nie liczy się | uzup. 2: „Plyometric Anatomy” — do sprawdzenia biogramów, do tego czasu nie liczy się (bez zmian; jedno źródło Scoop) |
| trx-mb-throws | nie niezależne (bez zmian) | powiela listę z Plyometric Anatomy |
| sussex-*, vhi-*, physitrack-*, breakingmuscle-*, seedman-ahp | 5 | bez zmian (uzup. 2) |

| Zdanie (ćwiczenie) | Źródła ≥ 4 (lub 3) po przeliczeniu | Stan |
|---|---|---|
| `wb.setup`, `wb.move`, `wb.mis.shallow` (Wall Ball) | CrossFit + REP Fitness (Coach odpada jako trzecie) | zostaje |
| `wb.catch` (Wall Ball) | REP Fitness (Coach = 5) | **spada** |
| `mbcp.setup`, `mbcp.move` (Chest Pass) | ACE #264 + RFL (warianty opisane) | zostaje |
| `mbcp.mis.elbows` (Chest Pass, warunkowe) | RFL (Freelap = 5) | nie wchodzi (było: do decyzji) |
| `bmbt.setup`, `bmbt.move` (Backward Throw) | Manske (3) + NSCA/HK (3) + World Athletics (4) | zostaje |
| `bmbt.armsStraight` (Backward Throw) | NSCA/HK (3) + World Athletics (4) | zostaje |
| `soht.setup`, `soht.move`, `plank.brace` (Standing Two-Arm Overhead Throw) | ACE #178 + World Athletics | zostaje |

| Karta | Stan przed | Stan po |
|---|---|---|
| Wall Ball | gotowe | **własna z błędami** (bez `wb.catch`) |
| Medicine Ball Chest Pass | częściowe | **własna bez błędów** |
| Backward Medicine Ball Throw | częściowe | **własna bez błędów** |
| Standing Two-Arm Overhead Throw | częściowe | **własna bez błędów** |
| Medicine Ball Scoop Throw, Supine Chest Throw, Supine Two-Arm Overhead Throw, One-Arm Medicine Ball Slam, Supine One-Arm Overhead Throw | otwarte | otwarte |

Razem rzuty (9 ćwiczeń): przed — gotowe 1, częściowe 3, otwarte 5; po — własne z błędami 1, własne bez błędów 3, otwarte 5.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

```json
{
 "orgs": {
  "CrossFit": {"name": "CrossFit — CrossFit Essentials (crossfit.com, materiały szkoleniowe organizacji)", "level": 4, "kind": "org"},
  "REP Fitness": {"name": "REP Fitness — blog Training (producent sprzętu, m.in. piłek do wall ball, 2026)", "level": 4, "kind": "maker"},
  "RFL": {"name": "Rugby Football League — karta ćwiczenia „Med Ball Chest Throw” (federacja, szkolenie trenerów)", "level": 4, "kind": "org"},
  "World Athletics": {"name": "World Athletics — Kids' Athletics, Teaching athletics (federacja, materiały szkoleniowe)", "level": 4, "kind": "org"},
  "Coleman, Szymanski (NSCA, Human Kinetics)": {"name": "NSCA — Strength Training for Baseball, red. Coleman, Szymanski (Human Kinetics; fragment ze strony wydawcy)", "level": 3, "kind": "book"},
  "Manske, Reiman (Wichita State University, Duke University)": {"name": "Manske, Reiman — przegląd testów funkcjonalnych, Sports Health 2013", "level": 3, "kind": "study"}
 },
 "sources": {
  "ace-178": {"org": "ACE", "title": "Overhead Medicine Ball Throws (#178)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/", "level": 4},
  "ace-264": {"org": "ACE", "title": "Medicine Ball Lunge to Chest Pass (#264)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/", "level": 4},
  "crossfit-wall-ball": {"org": "CrossFit", "title": "The Wall-Ball Shot: CrossFit's Secret Weapon for Cardiovascular Conditioning", "url": "https://www.crossfit.com/essentials/crossfit-wall-ball-secret-weapon", "level": 4},
  "rep-wall-balls": {"org": "REP Fitness", "title": "How to Improve Your Wall Balls", "url": "https://uk.repfitness.com/blogs/training/wall-balls", "level": 4},
  "rfl-mb-chest-throw": {"org": "RFL", "title": "Med Ball Chest Throw (karta PDF z oceną 1–5)", "url": "https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf", "level": 4},
  "wa-backward-overhead-throw": {"org": "World Athletics", "title": "Backward overhead throw (Kids' Athletics, poziom 3)", "url": "https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw", "level": 4},
  "wa-overarm-throw": {"org": "World Athletics", "title": "Overarm throw (Kids' Athletics)", "url": "https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw", "level": 4},
  "hk-blob-throw": {"org": "Coleman, Szymanski (NSCA, Human Kinetics)", "title": "Medicine ball BLOB throw (between legs, over back) — fragment, oprac. J. Dawes", "url": "https://us.humankinetics.com/blogs/excerpt/medicine-ball-blob-throw-between-legs-over-back", "level": 3},
  "pmc-3658404": {"org": "Manske, Reiman (Wichita State University, Duke University)", "title": "Functional Performance Testing for Power and Return to Sports, Sports Health 2013 (Trunk Power Tests)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/", "level": 3}
 },
 "exercises": {
  "Wall Ball": {
   "setup": [
    {"c": "wb.setup", "s": [["rep-wall-balls", "opis ruchu („holding the ball at your chest”)"], ["crossfit-wall-ball", "THE WALL-BALL SHOT („Keep the ball low to the chest.”)"]]}
   ],
   "move": [
    {"c": "wb.move", "s": [["rep-wall-balls", "wypowiedź trenerki („squat and as soon as you open your hips, throw the ball”)"], ["crossfit-wall-ball", "THE WALL-BALL SHOT (przysiad na początku każdego powtórzenia, wyrzut w cel; parafraza)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "wb.mis.shallow", "s": [["crossfit-wall-ball", "THE WALL-BALL SHOT („…it is very common to see poor squat depth in this exercise.”)"], ["rep-wall-balls", "częste błędy (za płytki przysiad; „Quarter squats won't provide the full benefit”)"]]}
   ]
  },
  "Medicine Ball Chest Pass": {
   "setup": [
    {"c": "mbcp.setup", "s": [["ace-264", "krok 1, Starting position (przodem do partnera, piłka na wysokości klatki; parafraza; wariant: z wykrokiem)"], ["rfl-mb-chest-throw", "Directions, punkty 1–2 („Stand with feet shoulder-width apart and hands behind the ball.”, piłka przyciągnięta do klatki; wariant: rzut na odległość z lekkiego przysiadu)"]]}
   ],
   "move": [
    {"c": "mbcp.move", "s": [["ace-264", "krok 2 (wypchnięcie piłki od klatki do partnera; parafraza; wariant: z wykrokiem)"], ["rfl-mb-chest-throw", "Directions, punkt 3 („…extend your elbows to push ball away from body.”; wariant: rzut na odległość)"]]}
   ],
   "tips": [],
   "mistakes": []
  },
  "Backward Medicine Ball Throw": {
   "setup": [
    {"c": "bmbt.setup", "s": [["pmc-3658404", "Trunk Power Tests → Backward Overhead Medicine Ball Throw, ryc. 2 („The athlete holds a medicine ball with arms straight in front of the body”)"], ["hk-blob-throw", "Setup („…stand with the arms straight and feet approximately shoulder-width apart”)"], ["wa-backward-overhead-throw", "opis pod tytułem (tyłem do linii, piłka oburącz na długość ramion; parafraza)"]]}
   ],
   "move": [
    {"c": "bmbt.move", "s": [["pmc-3658404", "jw. (ruch zamachowy w dół w biodrach i kolanach, potem „extending forcefully backward to throw the ball over the head”)"], ["hk-blob-throw", "Action (zamach piłką w dół między nogi, wyskok i rzut „overhead and backward as far as possible”)"], ["wa-backward-overhead-throw", "opis pod tytułem (przysiad, szybki wyprost nóg, rzut nad głową w tył; parafraza)"]]}
   ],
   "tips": [
    {"c": "bmbt.armsStraight", "s": [["hk-blob-throw", "Coaching tips („Keep the arms straight throughout the duration of the exercise.”)"], ["wa-backward-overhead-throw", "opis pod tytułem („…keep both arms extended at all time”)"]]}
   ],
   "mistakes": []
  },
  "Standing Two-Arm Overhead Throw": {
   "setup": [
    {"c": "soht.setup", "s": [["ace-178", "Preparation i krok 1 (przodem do partnera, piłka oburącz; parafraza)"], ["wa-overarm-throw", "Description („…hold the medicine ball with both hands behind the head”; przodem do kierunku rzutu)"]]}
   ],
   "move": [
    {"c": "soht.move", "s": [["ace-178", "krok 2–3 (piłka nad głowę i za głowę, potem ręce mocno w przód nad głową; parafraza)"], ["wa-overarm-throw", "Description („They throw the medicine ball over the head as far as possible…”)"]]}
   ],
   "tips": [
    {"c": "plank.brace", "s": [["ace-178", "krok 1–2 („contract and brace the abdominals…”; brzuch napięty także przy zamachu)"], ["wa-overarm-throw", "Coaching points („…keep their trunk muscles tense the whole time…”)"]]}
   ],
   "mistakes": []
  }
 }
}
```

Nowe zdania w bloku (10): `wb.setup`, `wb.move`, `wb.mis.shallow`, `mbcp.setup`, `mbcp.move`, `bmbt.setup`, `bmbt.move`, `bmbt.armsStraight`, `soht.setup`, `soht.move`.
Wypadło: `wb.catch` (+ org `Coach`). `mbcp.mis.elbows` zostaje w „Otwarte” (jedno źródło).

Wątpliwości:
1. Medicine Ball Slam (istniejący wpis w `cues.json`) — jeśli opiera się na Coach (2021), trzeba sprawdzić autora tamtej strony tą samą miarą; poza zakresem tego przeliczenia.
