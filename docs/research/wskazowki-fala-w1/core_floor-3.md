# Wskazówki techniki — fala W1, core_floor część 3 (14 ćwiczeń)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tylko zbieranie danych — nic nie jest w `lib/` ani `data/zrodla/`.
Metoda: jak `docs/research/27-wskazowki-zrodla.md` i `docs/research/33-wskazowki-partia2.md` (≥ 2 przeczytane źródła szczebla 4
z różnych organizacji na zdanie; wariant liczy się z opisem, inne ćwiczenie = analogia; bez uzasadnień zdrowotnych; cytat ≤ 1 zdanie).
Uzupełnienie koordynatora 02.11.2026 zastosowane: strony innych aplikacji pominięte (nie wymieniam ich), ExRx pominięty, zdania zestawu
ogólnego bez potwierdzenia dla danego ćwiczenia — nie wpisane (lista w p. 5).
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — p. 7 „Korekta szczebli 02.11.2026”.

## 1. Tabela

| Klucz | Stan | Liczba zdań | Uwagi |
|---|---|---|---|
| Scissor Kick | otwarte | 0 | brak przeczytanego źródła szczebla 4 (p. 5) |
| Toe Touchers | otwarte (po korekcie; było „gotowe warunkowo”) | 0 | ACE #243 + PureGym; PureGym = szczebel 5 (koordynator) → każde zdanie ma 1 źródło szczebla 4 |
| Tuck Crunch | otwarte | 0 | nazwa niejednoznaczna, brak źródeł szczebla 4 |
| Oblique Crunches - On The Floor | otwarte | 0 | brak źródeł szczebla 4 |
| Otis-Up | otwarte | 0 | rzadka nazwa — nie zgaduję |
| Seated Flat Bench Leg Pull-In | otwarte | 0 | brak źródeł szczebla 4 |
| Standing Rope Crunch | otwarte (po korekcie; było „gotowe warunkowo”) | 0 | ACE #331 + Western SRS FM Abs; Western SRS = szczebel 5 (koordynator; uzupełnienie 2 — bez autora, nadal 5) |
| Suspended Reverse Crunch | gotowe | 2 | ACE #87 (wariant: nazwa „knee tucks”) + producent sprzętu (TRX, „Reverse Crunch”) — TRX po ocenie szczebel 4 (p. 7) |
| Weighted Sit-Ups - With Bands | otwarte | 0 | rzadki wariant, brak źródeł |
| Side Jackknife | otwarte | 0 | brak źródeł szczebla 4 |
| Smith Machine Hip Raise | otwarte | 0 | rzadki wariant, brak źródeł |
| Press Sit-Up | otwarte | 0 | rzadka nazwa — nie zgaduję |
| Cocoons | otwarte | 0 | rzadka nazwa — nie zgaduję |
| Stomach Vacuum | otwarte | 0 | technika zaczyna się od maksymalnego wydechu, oddech w trakcie sporny; brak źródeł szczebla 4 |

## 2. Blok do `exercises` (cues.json) — tylko gotowe (po korekcie 02.11.2026)

Miejsca w źródłach i cytaty (≤ 1 zdanie, przeczytane WebFetch 02.11.2026):

- ace-243 (Vertical Toe Touches): krok 1 — uda pionowo, kolana wyprostowane; krok 2 „Gently exhale, contract your abdominals to flex (curl) your trunk, lifting your scapulae (shoulder blades) off the floor”; krok 3 „…then slowly return downwards to your starting position”.
- puregym-toe-touches (szczebel 5 po korekcie): krok 1 „Lie on your back on the floor with your legs extended straight out” (dalej: uniesienie nóg do 90° z tułowiem — parafraza); krok 3 „reach your hands up to touch your toes”; krok 4 „Pause then slowly lower to the starting position.”
- ace-331 (Standing Crunch, wyciąg z liną): „Focus on rolling the rib cage down against the pull of the cable.”; ostatni krok „slowly returning to the top”.
- western-fm (szczebel 5 po korekcie; FM Abs, wariant: maszyna z oparciem, stojąc, taśmy przy klatce): „Lean your shoulders forward and down toward your feet, crunching your abs.”; potem powolny powrót do stania (parafraza).
- ace-87 (TRX Suspended Knee Tucks): krok 1 „Place your feet securely into the foot cradles positioned directly under the anchor point.”; krok 2 (podpór jak do pompki, ręce proste — parafraza) i „Slowly pull your knees toward your chest, bending your knees as they tuck under your hips.”; krok 3 powolny powrót do podporu (parafraza).
- trx-basics (Move 4: TRX Reverse Crunch): „Hands and knees on the ground. Feet face anchor point. Feet in foot cradles.”; „Pull your knees toward your waist for a crunch.” (wejście w podpór: „Rise up into a strong plank…”).

```json
{
  "Suspended Reverse Crunch": {
    "setup": [
      {"c": "core_floor.suspRevCrunch.setup", "s": [["ace-87", "Step 1–2 (stopy w uchwytach pod punktem zaczepienia; podpór jak do pompki — parafraza)"], ["trx-basics", "Move 4: TRX Reverse Crunch („Feet in foot cradles.”; „Rise up into a strong plank…”)"]]}
    ],
    "move": [
      {"c": "core_floor.suspRevCrunch.move", "s": [["ace-87", "Step 2–3 (wariant nazwy: knee tucks; „Slowly pull your knees toward your chest…”; powrót do podporu)"], ["trx-basics", "Move 4: TRX Reverse Crunch („Pull your knees toward your waist for a crunch.”)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

### Kandydaci wstrzymani przy korekcie (NIE do `exercises`; zachowane, żeby nie tracić wyników)

```json
{
  "Toe Touchers": {
    "setup": [
      {"c": "core_floor.toeTouch.setup", "s": [["ace-243", "Step 1 (uda pionowo, kolana wyprostowane)"], ["puregym-toe-touches", "krok 1 (nogi uniesione pod kątem 90° do tułowia) — szczebel 5"]]}
    ],
    "move": [
      {"c": "core_floor.toeTouch.move", "s": [["ace-243", "Step 2–3 („…lifting your scapulae (shoulder blades) off the floor”; powolny powrót)"], ["puregym-toe-touches", "kroki 2–4 („reach your hands up to touch your toes”; „Pause then slowly lower to the starting position.”) — szczebel 5"]]}
    ]
  },
  "Standing Rope Crunch": {
    "move": [
      {"c": "core_floor.ropeCrunch.move", "s": [["ace-331", "kroki („Focus on rolling the rib cage down against the pull of the cable.”)"], ["western-fm", "FM Abs (wariant: maszyna z oparciem; „Lean your shoulders forward and down toward your feet, crunching your abs.”) — szczebel 5"]]}
    ],
    "tips": [
      {"c": "cc.slow", "s": [["ace-331", "ostatni krok („slowly returning to the top”)"], ["western-fm", "FM Abs (wariant: maszyna; powolny powrót do stania — parafraza) — szczebel 5"]]}
    ]
  }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) | stan po korekcie |
|---|---|---|---|
| core_floor.toeTouch.setup | Połóż się na plecach i unieś wyprostowane nogi pionowo w górę. | Lie on your back and raise your straight legs vertically. | otwarte (tylko ACE) |
| core_floor.toeTouch.move | Zwiń tułów, unosząc łopatki od podłogi i sięgając dłońmi w stronę stóp; opuść się powoli. | Curl up, lifting your shoulder blades off the floor and reaching toward your feet; lower slowly. | otwarte (tylko ACE) |
| core_floor.ropeCrunch.move | Zwijaj tułów w przód i w dół, ściągając żebra w stronę podłogi. | Curl your torso forward and down, pulling your ribs toward the floor. | otwarte (tylko ACE) |
| core_floor.suspRevCrunch.setup | Włóż stopy w uchwyty taśm i wejdź w podpór jak do pompki. | Put your feet in the strap cradles and get into a push-up position. | gotowe |
| core_floor.suspRevCrunch.move | Przyciągnij kolana pod tułów, potem wyprostuj nogi z powrotem do podporu. | Pull your knees in under your torso, then extend your legs back to the plank. | gotowe |

Uwaga do `core_floor.ropeCrunch.move`: ACE mówi „żebra w dół w stronę podłogi”, Western „barki w stronę stóp” — zdanie bierze część wspólną (zwijanie w przód i w dół). Istniejącego `cc.ribs` nie użyto, bo jego druga część („biodra zostają w miejscu”) nie jest wprost w żadnym z dwóch źródeł.

## 4. Nowe źródła

| id | adres | organizacja | szczebel (po korekcie 02.11.2026 i uzupełnieniu 2) |
|---|---|---|---|
| ace-243 | https://www.acefitness.org/resources/everyone/exercise-library/243/vertical-toe-touches/ | ACE | 4 |
| ace-331 | https://www.acefitness.org/resources/everyone/exercise-library/331/standing-crunch/ | ACE | 4 (zaproponowane już w docs/33, brak w `sources`) |
| ace-87 | https://www.acefitness.org/resources/everyone/exercise-library/87/trx-reg-suspended-knee-tucks/ | ACE | 4 (sprawdzone 02.11.2026: treść firmowana przez ACE — „Copyright© The American Council on Exercise”, bez oznaczenia, że pochodzi od TRX → niezależne od trx-basics) |
| western-fm | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html | Western University, Sport and Recreation Services | **5** — uczelniane centrum sportu bez autora (uzupełnienie 2, p. 8) |
| trx-basics | https://www.trxtraining.com/blogs/news/trx-moves-of-the-week-the-basics | TRX (producent sprzętu; blog, 07.02.2022, podpis „Shopify API”, bez nazwiska) | 4 (ocena 02.11.2026, p. 7) |
| puregym-toe-touches | https://www.puregym.com/exercises/abs/toe-touches/ | PureGym (sieć siłowni, Wielka Brytania; bez autora i daty) | **5** (było: 4 PROPOZYCJA) — rozstrzygnięcie koordynatora |

Nieczytelne / odrzucone w tej sesji: cpp.edu „abdominals.pdf” (404), JMU „Every Move Counts core training cards” (503), Technogym strona multi-gym (403) — nie są źródłami. Strony innych aplikacji i portale bez organizacji (wyniki wyszukiwania) pominięte.

## 5. Otwarte (z powodem)

- **Scissor Kick** — wyszukiwanie zwróciło tylko portale i aplikacje; brak źródła szczebla 4 opisującego to ćwiczenie. Zestaw ogólny (`db.back`, `db.slow`, `mis.jerk`) pochodzi z Dead Bug — dla nożyc to analogia, możliwy błąd zestawu ogólnego.
- **Toe Touchers (po korekcie całe ćwiczenie)** — PureGym szczebel 5 → `toeTouch.setup` i `toeTouch.move` mają tylko ACE #243. Zestaw ogólny: `crunch.lowBack` potwierdzało tylko PureGym (ACE mówi o czymś innym: nie przenosić ud za pion); `crunch.move` — „żebra do miednicy” nie wprost w źródłach; `mis.jerk` mówi o „ciężarze”, a to ćwiczenie bez obciążenia. Możliwy błąd zestawu ogólnego. Wskazówka „uda nie dalej niż pionowo” — jedno źródło (ACE). Do zamknięcia: drugie źródło szczebla 4 (ISSA, NFPT z autorem i datą, BarBend o technice; ponowić JMU „Every Move Counts”).
- **Tuck Crunch** — nazwa niejednoznaczna: część opisów ma nieruchome nogi w pozycji „stolika”, część przyciąganie kolan do klatki; brak źródeł szczebla 4. Zestaw ogólny (`crunch.neck`, `crunch.lowBack`, `mis.jerk`) — analogia do zwykłego brzuszka, niepotwierdzona.
- **Oblique Crunches - On The Floor** — brak źródeł szczebla 4 (tylko portale); ponadto w różnych opisach pozycja bokiem albo na plecach — do ustalenia, jaki ruch pokazuje figura. Zestaw ogólny (`crunch.neck`, `crunch.lowBack`) dla leżenia bokiem nie pasuje („dolna część pleców na podłodze”) — prawdopodobny błąd zestawu ogólnego.
- **Otis-Up**, **Press Sit-Up**, **Cocoons** — rzadkie nazwy; nie szukałem dalej po braku źródeł szczebla 4 dla pokrewnych ćwiczeń; nie zgaduję. Otis-Up ma w zestawie ogólnym `crunch.neck` — dla brzuszka z talerzem trzymanym przed klatką (ręce nie przy głowie) zdanie „nie ciągnij głowy rękami” prawdopodobnie nie pasuje.
- **Seated Flat Bench Leg Pull-In** — tylko portale i aplikacje; `rcrunch.hips` z zestawu ogólnego to analogia do brzuszka odwrotnego w leżeniu.
- **Standing Rope Crunch (po korekcie całe ćwiczenie)** — Western SRS szczebel 5 → `ropeCrunch.move` i `cc.slow` mają tylko ACE #331; `cc.ribs` (część „biodra w miejscu”) i `mis.jerk` z zestawu ogólnego niepotwierdzone wprost; ustawienie (wyciąg wysoko, tyłem) — tylko ACE. Do zamknięcia: drugie źródło szczebla 4 dla brzuszków na wyciągu z liną (ISSA, NFPT, BarBend o technice, producent wyciągów z własną biblioteką).
- **Suspended Reverse Crunch** — zestaw ogólny: `rcrunch.hips` (TRX nie mówi o prowadzeniu ruchu miednicą), `plank.brace` (TRX tylko „strong plank”), `plank.mis.sag` (ACE wprost; TRX tylko „be mindful of your low back”) — po jednym źródle; nie wpisane. Reguła błędu (uzupełnienie 2) sprawdzona: „strong plank” nie określa linii ciała, więc opadanie bioder nie jest bezpośrednim zaprzeczeniem standardu TRX → `plank.mis.sag` zostaje otwarte.
- **Weighted Sit-Ups - With Bands**, **Smith Machine Hip Raise**, **Side Jackknife** — brak źródeł szczebla 4; nie zgaduję.
- **Stomach Vacuum** — opisy zaczynają się od maksymalnego wydechu, a co do oddychania w trakcie przytrzymania źródła (portale, nie szczebel 4) są sprzeczne: część każe wstrzymać oddech. Zgodnie z wyjątkiem dla wskazówek oddechu (bez wstrzymywania) — otwarte; potrzebne źródła szczebla 4 opisujące wersję z normalnym oddechem. ACE #121 „Supine Hollowing” to inne ćwiczenie (analogia), nie liczy się.

## 6. Stan

- **Przed korektą (02.11.2026):** wszystkie 14 ćwiczeń przejrzane; 1 gotowe (Suspended Reverse Crunch), 2 gotowe warunkowo (Toe Touchers — PureGym; Standing Rope Crunch — Western), 11 otwartych; 5 nowych zdań, 6 nowych źródeł.
- **Po korekcie szczebli (02.11.2026):** **1 gotowe** (Suspended Reverse Crunch — 2 zdania), 13 otwartych. Toe Touchers i Standing Rope Crunch → otwarte (PureGym i Western SRS — szczebel 5). Wyniki zachowane jako „Kandydaci wstrzymani” w p. 2. Brak commitu (robi koordynator).
- **Po uzupełnieniu 2 (02.11.2026):** bez zmian — 1 gotowe → 1 gotowe (p. 8).
- **Zostało:** drugie źródło szczebla 4 dla Toe Touchers i Standing Rope Crunch; tłumacz/recenzent EN; wpis zdań do `lib/cues/text/pl.json` i źródeł do `data/zrodla/cues.json` (programista); rejestr twierdzeń (`claims.mjs --stub`).
- **Następny krok:** dla otwartych — szukać w ISSA / NFPT (artykuł z autorem i datą) / BarBend (technika) / materiałach szpitali i fizjoterapii (szczebel 4 od uzupełnienia 2); ponowić JMU „Every Move Counts” (503; uczelnia — z autorem z kwalifikacjami warunkowo 4) dla toe touch / vertical leg crunch.
- **Pułapki:** ExRx 403; wiele wyników wyszukiwania to strony aplikacji (wykluczone); TRX „Reverse Crunch” ma stopy „face anchor point”, ACE — stopy pod punktem zaczepienia (zdanie ustawienia tego nie rozstrzyga celowo).

## 7. Korekta szczebli 02.11.2026

Podstawa: rozstrzygnięcie koordynatora linii 1.1 (02.11.2026), kryteria (a)–(c) dla szczebla 4. Strony TRX i ACE #87 otwarte ponownie (WebFetch 02.11.2026).

| źródło | przed | po | powód |
|---|---|---|---|
| puregym-toe-touches | 4 PROPOZYCJA | 5 | rozstrzygnięcie koordynatora (PureGym — 5). |
| western-fm | 4 PROPOZYCJA | 5 | rozstrzygnięcie koordynatora (Western Univ. SRS — 5). |
| trx-basics | 4 | 4 (bez zmiany, oceniony) | (a) producent własnego rodzaju sprzętu (taśmy do ćwiczeń w podwieszeniu), opis dotyczy tego sprzętu; (b) treść jawnie firmowana przez TRX na jej stronie, data 07.02.2022 (bez nazwiska — podpis „Shopify API”); (c) artykuł instruktażowy z serii ćwiczeń, z odnośnikiem do produktu TRX, bez recenzji i linków afiliacyjnych. Wątpliwość: strona sklepu z promocjami w nawigacji — jeśli koordynator uzna serię za blog marketingowy, Suspended Reverse Crunch → otwarte. |
| ace-87 | 4 | 4 | sprawdzona niezależność od TRX: treść firmowana przez ACE, TRX tylko jako nazwa sprzętu. |

| ćwiczenie | przed | po | zdania gotowe przed → po |
|---|---|---|---|
| Toe Touchers | gotowe warunkowo | otwarte | 2 → 0 |
| Standing Rope Crunch | gotowe warunkowo | otwarte | 2 → 0 |
| Suspended Reverse Crunch | gotowe | gotowe | 2 → 2 |
| pozostałe 11 | otwarte | otwarte | 0 → 0 |

## 8. Korekta szczebli — uzupełnienie 2 (02.11.2026): bez zmian stanu

Western SRS (`western-fm`) otwarte ponownie (WebFetch 02.11.2026): strona bez autora i kwalifikacji, bez daty — firmowanie tylko „Sport and Recreation Services — Western University” / „Western Campus Recreation”; uczelniane centrum sportu bez autora → 5, Standing Rope Crunch zostaje otwarte. Pozostałe źródła (ACE, TRX, PureGym) nie podlegają regułom uzupełnienia 2; reguła błędu nie przywraca `plank.mis.sag` (p. 5). Gotowe: 1 → 1.
