# Wskazówki techniki — rodzina sled_throw, rzuty piłką lekarską (fala W2, G3)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W2, G3). Tylko zbieranie danych — nic nie jest w `lib/` ani w `data/zrodla/cues.json`.
Punkt wyjścia: plik W1 tej rodziny (część rzutów), sekcje „Korekta szczebli — przeliczenie koordynatora 02.11.2026” i „Blok do wdrożenia (po przeliczeniu)”.
Zasady: CLAUDE.md „Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki”; szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md`
(z uzupełnieniami 2–3). Pominięte zgodnie ze zleceniem: Wall Ball i Medicine Ball Slam (karty z błędami).

Identyfikacja ruchu (tylko „co to za ćwiczenie”, nie źródło techniki): opis w free-exercise-db (szczebel 5) pod nazwą z katalogu, czytany 02.11.2026
(`raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<nazwa>.json`, pole `instructions`). Ważne dla Scoop Throw — patrz sekcja 6.

## 1. Ćwiczenia — stan po W2

| Klucz | Stan po W1 (po przeliczeniu) | Stan po W2 | Co dodano w W2 |
|---|---|---|---|
| Medicine Ball Chest Pass | własna bez błędów | **własna z błędami** | `mbcp.mis.up` (wniosek z `mbcp.move`); trzecie źródło ustawienia i ruchu (ISSA) |
| Backward Medicine Ball Throw | własna bez błędów | **własna z błędami** | `mb.mis.armsOnly`, `bmbt.mis.bentArms` (ze źródeł: błąd = zaprzeczenie standardu) |
| Standing Two-Arm Overhead Throw | własna bez błędów | **własna z błędami** | `mb.mis.armsOnly` (ze źródeł: błąd = zaprzeczenie standardu), `soht.mis.noBehind` (wniosek z `soht.move`) |
| Medicine Ball Scoop Throw | otwarta | **własna z błędami** | ruch zidentyfikowany jako rzut zamachem spod nóg nad głową w tył z wyskokiem; `bmbt.setup`, `scoop.move`, `bmbt.armsStraight`, `mb.mis.armsOnly`, `bmbt.mis.bentArms` |
| Supine Chest Throw | otwarta | **własna z błędami** — jedno źródło (szczebel 3) | `sct.setup`, `sct.move` (recenzowane badanie, opis w metodach), `sct.mis.elbowsIn` (wniosek z `sct.setup`) |
| Supine Two-Arm Overhead Throw | otwarta | otwarta | brak źródła szczebla ≤ 4 ani badania z opisem (sekcja 5) |
| One-Arm Medicine Ball Slam | otwarta | otwarta | ruch NIE jest ten sam co Medicine Ball Slam (sekcja 5); brak źródła |
| Supine One-Arm Overhead Throw | otwarta | otwarta | zależy od wersji oburącz, która jest otwarta |

Razem (8 ćwiczeń z tego zlecenia): przed — własne bez błędów 3, otwarte 5; po — własne z błędami 5 (w tym 1 „jedno źródło, szczebel 3”), otwarte 3.

## 2. Błędy — uzasadnienie

**Chest Pass — `mbcp.mis.up`** (wniosek): `mbcp.move` „Mocno wypchnij piłkę od klatki prosto przed siebie.” Zaprzeczenie kierunku: piłka pchnięta łukiem w górę.
Zmienia tor piłki i ustawienie rąk przy wypuszczeniu (widać na rysunku z boku). Pomocniczo (nie liczę): RFL, tabela oceny „Release” — ✗ wypuszczenie za wysoko/za nisko (wariant: rzut na odległość).

**Backward Throw i Scoop Throw — `bmbt.mis.bentArms`** (ze źródeł, „błąd = zaprzeczenie standardu”, uzup. 2): standard „ręce proste przez cały ruch” podają dwa
niezależne źródła — NSCA/Human Kinetics (3) „Keep the arms straight throughout the duration of the exercise.” i World Athletics (4) „…keep both arms extended at all time”.
Błąd: łokcie uginają się w trakcie rzutu — ta sama część ciała, to samo kryterium.

**Backward, Scoop, Standing Overhead — `mb.mis.armsOnly`** (ze źródeł, „błąd = zaprzeczenie standardu”): standard „rzut zaczyna praca nóg (ugięcie i wyprost bioder i kolan)”:
- Backward i Scoop: Manske i Reiman (3) — „following a countermovement, flexes at the hips and knees before extending forcefully backward”; World Athletics (4) — przysiad i szybki wyprost nóg; NSCA/HK (3) — „perform a countermovement jump”.
- Standing Overhead: ACE #178 (4), krok 3 — „push the left leg into the ground create triple extension”; World Athletics, Overarm throw (4), Coaching points — wybuchowa praca nóg (W1: „use the explosive power of their legs”).
Błąd: rzut samymi rękami, nogi nie pracują — ta sama część ciała (nogi/biodra), to samo kryterium (czy pracują).

**Standing Overhead — `soht.mis.noBehind`** (wniosek): `soht.move` „Przenieś piłkę nad głowę, za głowę, potem mocno rzuć…”. Zaprzeczenie: rzut sprzed twarzy bez
wyprowadzenia piłki za głowę. Zgodne z ACE #178, krok 2 („bend your elbows to reach the medicine ball behind your head”). Widać na rysunku (pozycja piłki przed rzutem).

**Supine Chest Throw — `sct.mis.elbowsIn`** (wniosek): `sct.setup` mówi „łokcie ugięte i rozłożone na boki” (badanie: barki ok. 90° odwiedzenia, łokcie ugięte).
Zaprzeczenie: łokcie przyciśnięte do tułowia. Uwaga dla recenzenta: to ustawienie z protokołu testu, nie z listy błędów — jeśli recenzent uzna je za zbyt słabe, karta
zostaje bez błędu (= otwarta).

## 3. Blok

### Blok do wdrożenia

Pełne karty po W2 (karty z W1 = zdania z bloku W1 po przeliczeniu + nowe błędy). Organizacje i źródła z W1, których bloki używają, powtórzone dla kompletu.

```json
{
 "orgs": {
  "RFL": {"name": "Rugby Football League — karta ćwiczenia „Med Ball Chest Throw” (federacja, szkolenie trenerów)", "level": 4, "kind": "org"},
  "World Athletics": {"name": "World Athletics — Kids' Athletics, Teaching athletics (federacja, materiały szkoleniowe)", "level": 4, "kind": "org"},
  "ISSA": {"name": "ISSA — blog organizacji szkolącej i certyfikującej trenerów (artykuł firmowany „By ISSA”, z datą)", "level": 4, "kind": "org"},
  "Coleman, Szymanski (NSCA, Human Kinetics)": {"name": "NSCA — Strength Training for Baseball, red. Coleman, Szymanski (Human Kinetics; fragment ze strony wydawcy)", "level": 3, "kind": "book"},
  "Manske, Reiman (Wichita State University, Duke University)": {"name": "Manske, Reiman — przegląd testów funkcjonalnych, Sports Health 2013", "level": 3, "kind": "study"},
  "Johnson i in. (Texas Tech University)": {"name": "Johnson, Maurya, Sisneros, Ford, Palmer — badanie rzetelności rzutu piłką lekarską leżąc, J Musculoskelet Neuronal Interact 2024", "level": 3, "kind": "study"}
 },
 "sources": {
  "ace-178": {"org": "ACE", "title": "Overhead Medicine Ball Throws (#178)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/178/overhead-medicine-ball-throws/", "level": 4},
  "ace-264": {"org": "ACE", "title": "Medicine Ball Lunge to Chest Pass (#264)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/264/medicine-ball-lunge-to-chest-pass/", "level": 4},
  "rfl-mb-chest-throw": {"org": "RFL", "title": "Med Ball Chest Throw (karta PDF z oceną 1–5)", "url": "https://www.rugby-league.com/uploads/docs/Med%20Ball%20Chest%20Throw.pdf", "level": 4},
  "wa-backward-overhead-throw": {"org": "World Athletics", "title": "Backward overhead throw (Kids' Athletics, poziom 3)", "url": "https://worldathletics.org/kids-athletics/teaching-athletics/backward-overhead-throw", "level": 4},
  "wa-overarm-throw": {"org": "World Athletics", "title": "Overarm throw (Kids' Athletics)", "url": "https://worldathletics.org/kids-athletics/teaching-athletics/overarm-throw", "level": 4},
  "issa-10-mb": {"org": "ISSA", "title": "10 Highly Effective Medicine Ball Exercises (ISSA, 05.02.2024)", "url": "https://www.issaonline.com/blog/post/10-highly-effective-medicine-ball-exercises", "level": 4},
  "hk-blob-throw": {"org": "Coleman, Szymanski (NSCA, Human Kinetics)", "title": "Medicine ball BLOB throw (between legs, over back) — fragment, oprac. J. Dawes", "url": "https://us.humankinetics.com/blogs/excerpt/medicine-ball-blob-throw-between-legs-over-back", "level": 3},
  "pmc-3658404": {"org": "Manske, Reiman (Wichita State University, Duke University)", "title": "Functional Performance Testing for Power and Return to Sports, Sports Health 2013 (Trunk Power Tests)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3658404/", "level": 3},
  "pmc-11145318": {"org": "Johnson i in. (Texas Tech University)", "title": "Force Production Measurements During a Supine Medicine Ball Throw: a Reliability and Correlation Study (2024; 24(2):120–126)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11145318/", "level": 3}
 },
 "exercises": {
  "Medicine Ball Chest Pass": {
   "setup": [
    {"c": "mbcp.setup", "s": [["ace-264", "krok 1, Starting position (przodem do partnera, piłka na wysokości klatki; parafraza; wariant: z wykrokiem)"], ["rfl-mb-chest-throw", "Directions, punkty 1–2 („Stand with feet shoulder-width apart and hands behind the ball.”, piłka przyciągnięta do klatki; wariant: rzut na odległość z lekkiego przysiadu)"], ["issa-10-mb", "Chest Pass („…holding the ball with both hands in front of your chest.”; przodem do ściany)"]]}
   ],
   "move": [
    {"c": "mbcp.move", "s": [["ace-264", "krok 2 (wypchnięcie piłki od klatki do partnera; parafraza; wariant: z wykrokiem)"], ["rfl-mb-chest-throw", "Directions, punkt 3 („…extend your elbows to push ball away from body.”; wariant: rzut na odległość)"], ["issa-10-mb", "Chest Pass („using your elbows, extend forward throwing the ball hard enough to contact the wall”)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "mbcp.mis.up", "s": [["wniosek", "mbcp.move"]]}
   ]
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
   "mistakes": [
    {"c": "mb.mis.armsOnly", "s": [["pmc-3658404", "Backward Overhead Medicine Ball Throw („…flexes at the hips and knees before extending forcefully backward”; błąd = zaprzeczenie standardu)"], ["wa-backward-overhead-throw", "opis pod tytułem (przysiad i szybki wyprost nóg; błąd = zaprzeczenie standardu)"], ["hk-blob-throw", "Movement Phases, krok 3 („perform a countermovement jump”; błąd = zaprzeczenie standardu)"]]},
    {"c": "bmbt.mis.bentArms", "s": [["hk-blob-throw", "Coaching tips („Keep the arms straight throughout the duration of the exercise.”; błąd = zaprzeczenie standardu)"], ["wa-backward-overhead-throw", "opis pod tytułem („…keep both arms extended at all time”; błąd = zaprzeczenie standardu)"]]}
   ]
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
   "mistakes": [
    {"c": "mb.mis.armsOnly", "s": [["ace-178", "krok 3 („push the left leg into the ground create triple extension”; błąd = zaprzeczenie standardu)"], ["wa-overarm-throw", "Coaching points (wybuchowa praca nóg; błąd = zaprzeczenie standardu)"]]},
    {"c": "soht.mis.noBehind", "s": [["wniosek", "soht.move"]]}
   ]
  },
  "Medicine Ball Scoop Throw": {
   "setup": [
    {"c": "bmbt.setup", "s": [["hk-blob-throw", "Beginning Position („…stand with the arms straight and feet approximately shoulder-width apart”)"], ["pmc-3658404", "Backward Overhead Medicine Ball Throw („The athlete holds a medicine ball with arms straight in front of the body”)"], ["wa-backward-overhead-throw", "opis pod tytułem (tyłem do linii, piłka oburącz na długość ramion; parafraza)"]]}
   ],
   "move": [
    {"c": "scoop.move", "s": [["hk-blob-throw", "Movement Phases 2–3 („Swing the medicine ball downward and between the legs…”, „perform a countermovement jump”, rzut „overhead and backward as far as possible”)"], ["pmc-3658404", "jw. (zamach w dół w biodrach i kolanach, „extending forcefully backward to throw the ball over the head”; bez wyskoku)"], ["wa-backward-overhead-throw", "opis pod tytułem (przysiad, szybki wyprost nóg, rzut nad głową w tył; parafraza; bez wyskoku)"]]}
   ],
   "tips": [
    {"c": "bmbt.armsStraight", "s": [["hk-blob-throw", "Coaching tips („Keep the arms straight throughout the duration of the exercise.”)"], ["wa-backward-overhead-throw", "opis pod tytułem („…keep both arms extended at all time”)"]]}
   ],
   "mistakes": [
    {"c": "mb.mis.armsOnly", "s": [["hk-blob-throw", "Movement Phases, krok 3 („perform a countermovement jump”; błąd = zaprzeczenie standardu)"], ["pmc-3658404", "Backward Overhead Medicine Ball Throw („…flexes at the hips and knees before extending forcefully backward”; błąd = zaprzeczenie standardu)"], ["wa-backward-overhead-throw", "opis pod tytułem (przysiad i szybki wyprost nóg; błąd = zaprzeczenie standardu)"]]},
    {"c": "bmbt.mis.bentArms", "s": [["hk-blob-throw", "Coaching tips („Keep the arms straight…”; błąd = zaprzeczenie standardu)"], ["wa-backward-overhead-throw", "opis pod tytułem („…keep both arms extended at all time”; błąd = zaprzeczenie standardu)"]]}
   ]
  },
  "Supine Chest Throw": {
   "setup": [
    {"c": "sct.setup", "s": [["pmc-11145318", "Methods, Medicine Ball Throws („…in the supine position with their hands on the ball and knees and hips flexed at 90°”, „…started each throw with the ball positioned at their chest”, „…both shoulders at approximately 90° of abduction and elbows flexed”; jedno źródło, szczebel 3)"]]}
   ],
   "move": [
    {"c": "sct.move", "s": [["pmc-11145318", "Methods, Medicine Ball Throws („throw the ball explosively upward with as much force as possible”, „a motion similar to a basketball chest pass”; jedno źródło, szczebel 3)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "sct.mis.elbowsIn", "s": [["wniosek", "sct.setup"]]}
   ]
  }
 }
}
```

## 4. Nowe zdania

Użyte istniejące (bez zmian): `mbcp.setup`, `mbcp.move`, `bmbt.setup`, `bmbt.move`, `bmbt.armsStraight`, `soht.setup`, `soht.move` (z W1, jeszcze nie w `lib/cues/text`),
`plank.brace` (`lib/cues/text/pl.json`). `mb.legs` nadal nie wpisuję (wymienia kostki — patrz W1 „Otwarte”).

| Id | PL | EN (propozycja) |
|---|---|---|
| mbcp.mis.up | Pchanie piłki łukiem w górę zamiast prosto przed siebie. | Pushing the ball up in an arc instead of straight ahead. |
| mb.mis.armsOnly | Rzut samymi rękami, bez pracy nóg. | Throwing with just your arms, no leg drive. |
| bmbt.mis.bentArms | Uginanie łokci w trakcie rzutu. | Bending your elbows during the throw. |
| soht.mis.noBehind | Rzut sprzed twarzy, bez wyprowadzenia piłki za głowę. | Throwing from in front of your face without taking the ball behind your head. |
| scoop.move | Opuść piłkę między nogi, uginając biodra i kolana, potem wyskocz i na prostych rękach przerzuć ją nad głową jak najdalej za siebie. | Swing the ball down between your legs as you bend your hips and knees, then jump and throw it with straight arms over your head as far behind you as you can. |
| sct.setup | Połóż się na plecach z ugiętymi nogami, piłka oburącz przy klatce, łokcie ugięte i rozłożone na boki. | Lie on your back with your knees bent, ball in both hands at your chest, elbows bent and out to the sides. |
| sct.move | Wypchnij piłkę mocno w górę, jak przy podaniu od klatki. | Push the ball up hard, like a chest pass. |
| sct.mis.elbowsIn | Łokcie przyciśnięte do tułowia zamiast rozłożone na boki. | Elbows tucked against your sides instead of out wide. |

Uwagi do brzmienia: `scoop.move` — „wyskocz” stoi tylko na NSCA/HK (szczebel 3; Manske i World Athletics mówią o mocnym wyproście bez wyskoku — nie przeczą).
Id `mb.mis.armsOnly` w przestrzeni `mb.` (jak `mb.legs`), bo dotyczy trzech rzutów; jeśli integrator woli przestrzeń rodziny — `bmbt.mis.armsOnly`.

## 5. Źródła

| Id | Adres | Organizacja | Szczebel (uzasadnienie) | Co przeczytano (02.11.2026) |
|---|---|---|---|---|
| ace-178, ace-264, rfl-mb-chest-throw, wa-*, hk-blob-throw, pmc-3658404 | jak w bloku | jak w W1 | jak w przeliczeniu W1 (4 / 3) | ponownie: ACE 178 kroki 1–3 (łokcie za głową, potrójny wyprost), ACE 264 Starting position i kroki 1–6 (łokci nie wymienia), HK BLOB — Beginning Position, Movement Phases 1–3, Coaching Tips, Manske — Trunk Power Tests (tylko dwa testy z piłką: Backward Overhead i Sidearm; brak błędów i rzutów leżąc) |
| issa-10-mb | https://www.issaonline.com/blog/post/10-highly-effective-medicine-ball-exercises | ISSA | 4 — organizacja szkoląca/certyfikująca trenerów, artykuł firmowany „By ISSA”, data 05.02.2024 (warunek z tabeli szczebli: autor i data albo firmowanie „ISSA”) | Chest Pass (ustawienie, ruch, łapanie na wysokości klatki), Wall Underhand Throw (rzut boczny spod biodra — nie Scoop), Overhead Slam; brak sekcji błędów |
| pmc-11145318 | https://pmc.ncbi.nlm.nih.gov/articles/PMC11145318/ | Johnson, Maurya, Sisneros, Ford, Palmer (Texas Tech University) | 3 — oryginalne badanie w recenzowanym czasopiśmie (J Musculoskelet Neuronal Interact 2024; 24(2):120–126, przyjęte 21.01.2024), opis rzutu w metodach | Methods, „Medicine Ball Throws” (pozycja, piłka przy klatce, barki ok. 90°, łokcie ugięte, rzut w górę jak podanie od klatki, piłkę łapie badacz, 1 próba + 3 pomiarowe); brak reguł odrzucania prób |
| ace-5289 | https://www.acefitness.org/resources/pros/expert-articles/5289/8-creative-ways-to-use-a-medicine-ball/ | ACE (J. Crockford, DHSc, 09.02.2015) | 4 | Forward Underhand Toss, Reverse Slams, Chest Press — **nie użyte**: „Forward Underhand Toss” to rzut w przód, a katalogowy Scoop Throw — w tył (sekcja 6); Reverse Slams = rzut za siebie z szerokiego przysiadu, możliwe drugie źródło dla Scoop/Backward, nieużyte (ACE już jest w karcie innych rzutów, a Scoop ma 3 źródła) |
| ismni-jmni-24-120, wku-ijesab-2-15-10 | ismni.org/jmni/article/24/120; digitalcommons.wku.edu/ijesab/vol2/iss15/10 | ci sami autorzy | streszczenie artykułu i abstrakt konferencyjny tego samego badania — nie niezależne | tylko streszczenia |
| pmc-10331986 | https://pmc.ncbi.nlm.nih.gov/articles/PMC10331986/ | Kardor i in., J Orthop Surg Res 2023 | 3 | tylko rzut siedząc od klatki (plecy o ścianę) — nie dotyczy kart |
| wa-forward-throw | https://worldathletics.org/kids-athletics/teaching-athletics/forward-throw | World Athletics | 4 | Description (5 fragmentów) — nie mówi, skąd idzie piłka; nie użyte |
| free-exercise-db (5 plików) | raw.githubusercontent.com/yuhonas/free-exercise-db/… | — | 5 — tylko identyfikacja ruchu | instrukcje: Scoop Throw, Backward Throw, Supine Chest Throw, Supine Two-Arm i One-Arm Overhead Throw, One-Arm Slam |

Niedostępne 02.11.2026: nsca.com i dxpprod.nsca.com („Tests of Core Muscle Power”, 403), simplifaster.com (403), redalyc PDF (dane binarne, nie czytałem).

## 6. Otwarte

- **Scoop Throw — tożsamość ruchu (ważne dla rysownika i recenzenta).** W1 traktował Scoop jako rzut spod spodu w przód/w górę (Plyometric Anatomy, „Underhand
  Vertical Squat Throw”). Opis katalogowy (free-exercise-db, tylko identyfikacja): półprzysiad, piłka przy stopach, wyskok, zamach prostymi rękami nad głowę i rzut
  „the greatest distance behind you” — czyli ten sam ruch co rzut „BLOB” z podręcznika NSCA (między nogami, nad plecami). Karta W2 idzie za katalogiem. Do sprawdzenia
  przy recenzji ruchu: poza końcowa `scoop` w `scripts/figures/agent-pozy/sled_throw.mjs:58` (ramię `psi: 40`) różni się od pozy `tyl` (`psi: 78`, linia 57) —
  czy rysunek pokazuje wypuszczenie w tył nad głową. Jeśli właściciel/koordynator chce rzutu w przód — potrzebna zmiana tożsamości katalogowej (decyzja produktowa), a źródłem
  byłby ACE 5289 „Forward Underhand Toss” + drugie źródło (nie znalazłem).
- **Scoop vs Backward — prawie ta sama karta.** Różnią się tylko wyskokiem (`scoop.move`). Do decyzji koordynatora, czy to nie duplikat w katalogu (poza zakresem badań).
- **Supine Chest Throw** — jedno źródło szczebla 3 (protokół testu). Sussexsport i free-exercise-db (5) zgodne, nic nie przeczy. Brak drugiego źródła i źródła z błędami.
  `sct.mis.elbowsIn` to wniosek z protokołu — recenzent może go odrzucić (wtedy karta otwarta). Łapanie piłki: w badaniu łapie badacz, w opisie katalogowym ćwiczący — zdania
  o łapaniu nie wpisuję (jedno źródło szczebla 5); do rozważenia dla koordynatora, czy karta powinna mówić „z partnerem” (spadająca piłka nad twarzą — nie jest to porada
  medyczna, ale bezpieczeństwo; brak źródła ≥ 4).
- **Supine Two-Arm Overhead Throw** — szukane 02.11.2026: PMC (testy rzutów leżąc, „sit-up throw”), Human Kinetics (fragmenty, blog), ACE, NASM, ISSA, The Prehab Guys —
  wyniki to strony aplikacji, Physitrack (5), magazyny bez autora; przegląd Manske i badanie Sell i in. 2015 (rzuty w przód/tył/rotacyjne stojąc) nie opisują wersji leżąc.
  NSCA „Tests of Core Muscle Power” (403) — możliwe źródło, do otwarcia w środowisku z dostępem.
- **Supine One-Arm Overhead Throw** — otwarte, bo wersja oburącz nie ma źródła (uproszczenie wariantu niemożliwe).
- **One-Arm Medicine Ball Slam — czy ten sam ruch co Medicine Ball Slam: NIE w pełni.** Opis katalogowy (5): ustawienie w wykroku/kroku, piłka w ręce po stronie
  tylnej nogi, wyprost bioder, kolan i kostek z piłką nad głową, potem rzut w podłogę przed sobą. Różnice wobec `slam.move` („oburącz”, rzut prosto w dół): stopy w kroku,
  jedna ręka, tor ukośny ze strony tylnej nogi i kontrola obrotu tułowia. To nie tylko „wariant sprzętu/jednorącz” z tego samego ustawienia — uproszczenie do karty Slam
  byłoby mylące co najmniej w ustawieniu stóp. Źródeł szczebla ≤ 4 o wersji jednorącz brak (szukane: ACE, NSCA/HK, Prehab Guys — tylko filmy bez opisu, aplikacje).
  Human Kinetics „Overhead Medicine Ball Slam Rotation” (uk.humankinetics.com/blogs/excerpt/overhead-medicine-ball-slam-rotation) — znaleziony, nieprzeczytany; może
  opisywać ustawienie w kroku (do sprawdzenia autora i treści w kolejnej sesji).
- **Medicine Ball Slam** (poza zakresem) — nic nowego nie przeczy wpisowi; jedyna sprzeczność z W1 (Coach 2021 „Try not to bend at the hips”) pochodzi ze źródła szczebla 5.
  ISSA „Overhead Slam” (4) zgodne z `slam.move` („Slam the ball as hard as you can straight down into the ground.”).
- **Chest Pass: łokcie** (`mbcp.mis.elbows`) — nadal jedno źródło (RFL); ACE 264 i ISSA o łokciach na boki nie mówią.
- **Chest Pass: łapanie** — ISSA (4) „catch the ball at the same chest level as it bounces back” + ACE 264 krok 3 (łapiący przyjmuje piłkę do klatki) — dwa źródła szczebla 4
  dla zdania typu „Łap piłkę na wysokości klatki” (`mbcp.catch` z W1). Nie wpisuję do bloku: figury rzutów są jednokierunkowe (bez powrotu piłki, `sled_throw.mjs:111`),
  więc to wskazówka bez rysunku — do decyzji koordynatora (dane gotowe: ISSA „Chest Pass”, ACE 264 krok 3).

## 7. Stan

- Zrobione: wszystkie 8 ćwiczeń zlecenia. 5 kart z błędami (3 uzupełnione o błędy, 2 nowe), 3 otwarte. Błędy: 3 wnioskowane (`mbcp.mis.up`, `soht.mis.noBehind`,
  `sct.mis.elbowsIn`), 2 ze źródeł regułą „zaprzeczenie standardu” (`mb.mis.armsOnly` — 3 ćwiczenia, `bmbt.mis.bentArms` — 2 ćwiczenia). Nowe zdania: 8.
- Zostało: Supine Two-Arm / One-Arm Overhead Throw i One-Arm Slam — źródła (NSCA Kinetic Select przy dostępie; HK „Slam Rotation”).
- Pułapki: free-exercise-db zmienia znaczenie nazwy „Scoop Throw” względem intuicji (rzut w tył); nsca.com i simplifaster.com 403; wyniki wyszukiwania dla rzutów leżąc to
  prawie wyłącznie strony aplikacji (nie źródło).
