# Wskazówki techniki — fala W2, core_floor część 4 (otwarte z W1, niebadane w W2 cz. 2) (02.11.2026)

Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/`.
Zakres (zlecenie koordynatora grupy G1, 02.11.2026): Tuck Crunch, Otis-Up, Seated Flat Bench Leg Pull-In, Weighted Sit-Ups - With Bands,
Side Jackknife, Smith Machine Hip Raise, Press Sit-Up, Cocoons, Stomach Vacuum. Powody otwarcia z W1: `core_floor-2.md`, `core_floor-3.md` (fala W1).
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` z uzupełnieniami 2–3 (Fitness Volt i Healthline „warunkowo 4” — liczy się
konkretna strona z autorem z kwalifikacjami i datą; szpitale i systemy ochrony zdrowia — 4, data niewymagana).
Wszystkie strony przeczytane przez WebFetch 02.11.2026 (PDF szpitala — odczyt pliku). Strony aplikacji treningowych pominięte i nigdzie niezapisane. Cytaty ≤ 1 zdanie.

## 1. Tabela ćwiczeń

| Klucz | Stan | Zdania | Uwagi |
|---|---|---|---|
| Tuck Crunch | gotowe (z uproszczeniem) | 4 (2 nowe ustawienie/ruch, 1 istniejące, 1 błąd z W2 + 1 błąd nowy) | Fitness Volt (M. Magnante, ACE CPT, 06.05.2023 / 11.08.2024) wprost + ACE #243 i #52 (jedna organizacja) jako `uproszczenie: wariant pozycji nóg` (ACE #243: uda pionowo, kolana proste; ACE #52: zwykły brzuszek). Błąd `core_floor.mis.neckPull` ze źródeł; `core_floor.mis.thighsPast` — wnioskowany (+ ACE #243 wprost) |
| Stomach Vacuum | gotowe (warunkowo — uproszczenie nazwy, p. 5 pyt. 1) | 4 (1 z W2, 2 nowe, 1 istniejące) | Healthline (K. Davidson, CPT; rec. J. Meacham, PhD, CSCS; akt. 13.10.2026) wprost + karta szpitala Virginia Mason (fizjoterapia; „Transverse Abdominus Isometric”). Obie każą oddychać normalnie → błąd `plank.mis.breath` ze źródeł. Bez liczb (czas przytrzymania: 5 s vs 20–30 s — sprzeczne) i bez twierdzeń zdrowotnych |
| Seated Flat Bench Leg Pull-In | otwarte (jedno źródło) | 0 | Fitness Volt „Knee Tucks”, wariant „Bench knee tuck” (P. Dale) — jedyne źródło szczebla 4; drugie nie znalezione (Generation Iron, The Manual — 5; Muscle & Strength 403) |
| Side Jackknife | otwarte (jedno źródło) | 0 | Fitness Volt (P. Dale, 19.02.2022 / 11.08.2024) — jedyne; Men's Health — strona niedostępna (OTWARTE w szczeblach) |
| Otis-Up | otwarte (jedno źródło) | 0 | Fitness Volt (M. Magnante, 16.08.2022 / 11.08.2024) — jedyne; reszta wyników to aplikacje |
| Cocoons | otwarte | 0 | w wynikach tylko producent sprzętu poza własnym sprzętem (Rogue — ćwiczenie bez sprzętu → 5), Physitrack (5), MasterClass (nieczytany) |
| Smith Machine Hip Raise | otwarte | 0 | tylko aplikacje i serwisy bez autora; ruch to „brzuszek odwrotny z obciążeniem” (note katalogu), ale ustawienia (stopy na sztandze w suwnicy) nie potwierdza żadne źródło — wariant `rcrunch.*` nie daje ustawienia |
| Press Sit-Up | otwarte | 0 | nie szukano ponownie po wyniku dla Otis-Up (ten sam wzorzec ruchu, tylko jedno źródło) — brak źródła szczebla 4 |
| Weighted Sit-Ups - With Bands | otwarte | 0 | nie szukano ponownie (W1 bez wyniku; rzadki wariant); kolejność wg briefu |

### Blok do wdrożenia

```json
{
 "Tuck Crunch": {
  "setup": [
   {"c": "core_floor.tuckCrunch.setup", "s": [
    ["fv-tuck-crunch", "How to, krok 2 („Lie on your back, then lift your knees up perpendicular to the floor, and bend your legs at a 90-degree angle.”)"],
    ["ace-243", "Step 1 (uda pionowo) — uproszczenie: wariant pozycji nóg (w ACE kolana wyprostowane)"]
   ]}
  ],
  "move": [
   {"c": "core_floor.tuckCrunch.move", "s": [
    ["fv-tuck-crunch", "How to, kroki 3–4 („…use your ab muscles to curl your upper body toward your knees”; powolne opuszczanie barków)"],
    ["ace-243", "Step 2–3 (zwijanie tułowia, łopatki od podłogi, powolny powrót) — uproszczenie: wariant pozycji nóg"]
   ]}
  ],
  "tips": [
   {"c": "crunch.lowBack", "s": [
    ["fv-tuck-crunch", "How to, krok 2 i wskazówki („Your lower back should not leave the ground during tuck crunches.”)"],
    ["ace-52", "Step 3 (stopy, kość ogonowa i lędźwie w kontakcie z matą) — uproszczenie: wariant pozycji nóg"]
   ]}
  ],
  "mistakes": [
   {"c": "core_floor.mis.neckPull", "s": [
    ["fv-tuck-crunch", "How to, krok 3 („However, do not pull up on your neck.”)"],
    ["ace-243", "Step 2 i uwagi końcowe (głowa w linii z kręgosłupem, „avoid flexing your head too far forward”) — błąd = zaprzeczenie standardu"]
   ]},
   {"c": "core_floor.mis.thighsPast", "s": [
    ["wniosek", "core_floor.tuckCrunch.setup"],
    ["ace-243", "uwagi końcowe („DO NOT move your thighs beyond this point.”) — uproszczenie: wariant pozycji nóg; jedno źródło"]
   ]}
  ]
 },
 "Stomach Vacuum": {
  "setup": [
   {"c": "core_floor.heelTouch.setup", "s": [
    ["healthline-stomach-vacuum", "wersja leżąca („Lie on the floor with your spine neutral, knees bent, and feet flat.”)"],
    ["vm-ta-isometric", "punkt 1 („Lie on your back with your knees bent and feet on the floor”) — uproszczenie: wariant nazwy (p. 5 pyt. 1)"]
   ]}
  ],
  "move": [
   {"c": "core_floor.vacuum.move", "s": [
    ["healthline-stomach-vacuum", "instrukcja (pępek przyciągany w stronę kręgosłupa; przytrzymanie)"],
    ["vm-ta-isometric", "punkty 4–5 („Gently draw in the muscles under your fingers.”; przytrzymanie) — uproszczenie: wariant nazwy"]
   ]}
  ],
  "tips": [
   {"c": "core_floor.vacuum.breathe", "s": [
    ["healthline-stomach-vacuum", "instrukcja („Continue to breathe normally as you hold your belly in.”)"],
    ["vm-ta-isometric", "punkty 2 i 6 („Continue to breathe normally”)"]
   ]}
  ],
  "mistakes": [
   {"c": "plank.mis.breath", "s": [
    ["healthline-stomach-vacuum", "instrukcja („You shouldn't be holding your breath…”)"],
    ["vm-ta-isometric", "punkty 2 i 6 (oddychaj normalnie) — błąd = zaprzeczenie standardu"]
   ]}
  ]
 }
}
```

Uwagi do bloku:
- Tuck Crunch: `cue-sets.json` ma `crunch.neck` („…nie ciągnij głowy rękami”) i `mis.jerk` („…ciężarem”). W Fitness Volt ręce są skrzyżowane na klatce („Cross your arms on your chest”), a ćwiczenie jest bez obciążenia — oba zdania zestawu ogólnego nie pasują; zastępuje je blok wyżej. `crunch.move` („żebra do miednicy”) — w Fitness Volt „tułów w stronę kolan”, więc nowe zdanie `core_floor.tuckCrunch.move`.
- Tuck Crunch, `core_floor.mis.thighsPast`: błąd wnioskowany z `core_floor.tuckCrunch.setup` (uda pionowo); ACE #243 podaje go wprost dla nóg prostych. Powód zdrowotny z ACE (obciążenie lędźwi) NIE trafia do zdania.
- Tuck Crunch, uproszczenie: tułów pracuje tak samo jak w brzuszku (ACE #52) i w brzuszku z nogami pionowo (ACE #243); różni się tylko ugięcie kolan przy nogach trzymanych w górze. `note` katalogu („ankles crossed”) — Fitness Volt nie mówi o skrzyżowaniu kostek, zdania tego nie podają.
- Stomach Vacuum: zdanie ustawienia `core_floor.heelTouch.setup` pochodzi z W2 (`core_floor-2.md`, jeszcze nie w `lib/`) — ta sama treść, bez nowego id. Ćwiczenie nie ma własnej pozy w `poses/core_floor.json` — przed wdrożeniem sprawdzić, czy figura pokazuje leżenie na plecach (inaczej ustawienie z karty nie zgadza się z rysunkiem; Healthline dopuszcza też stanie i klęk podparty).
- Stomach Vacuum: zdania nie mówią, ile trzymać (Healthline „20 to 30 seconds”, szpital „Hold five seconds”) ani czemu ćwiczenie służy — bez liczb i twierdzeń o zdrowiu/talii.

## 3. Nowe zdania

| id | PL | EN (propozycja) | Ćwiczenie |
|---|---|---|---|
| core_floor.tuckCrunch.setup | Połóż się na plecach i unieś nogi, tak żeby uda były pionowo. | Lie on your back and lift your legs so your thighs are vertical. | Tuck Crunch |
| core_floor.tuckCrunch.move | Zwiń tułów w stronę kolan, unosząc łopatki od podłogi; opuść się powoli. | Curl your upper body toward your knees, lifting your shoulder blades off the floor; lower slowly. | jw. |
| core_floor.mis.thighsPast | Uda uciekają za pion, w stronę klatki. | Letting your thighs drift past vertical toward your chest. | jw. |
| core_floor.vacuum.move | Wciągnij brzuch do środka, w stronę kręgosłupa, i przytrzymaj. | Draw your belly in toward your spine and hold. | Stomach Vacuum |
| core_floor.vacuum.breathe | Trzymając brzuch wciągnięty, oddychaj normalnie. | Keep breathing normally while you hold your belly in. | jw. |

Istniejące / z W2 użyte: `crunch.lowBack`, `plank.mis.breath` (istn. w `lib/cues/text/pl.json`), `core_floor.mis.neckPull`, `core_floor.heelTouch.setup` (nowe z W2 cz. 2).

Zdania-kandydaci (NIE do `lib/`; brak drugiego źródła szczebla 4 — p. 5):

| id | PL | EN | Ćwiczenie | Jedyne źródło |
|---|---|---|---|---|
| core_floor.benchTuck.setup | Usiądź na brzegu ławki, dłonie oprzyj obok bioder, odchyl się lekko i unieś stopy nad podłogę. | Sit on the edge of a bench with your hands by your hips, lean back slightly and lift your feet off the floor. | Seated Flat Bench Leg Pull-In | fv-knee-tucks, „Bench knee tucks” kroki 1 |
| core_floor.benchTuck.move | Przyciągnij kolana do klatki, pochylając tułów do przodu; potem wyprostuj nogi i odchyl się z powrotem. | Pull your knees toward your chest as you lean forward; then straighten your legs and lean back again. | jw. | jw., kroki 2–3 |
| core_floor.sideJack.setup | Połóż się na boku, ciało w jednej linii, biodro nad biodrem, bark nad barkiem. | Lie on your side with your body straight, hips and shoulders stacked. | Side Jackknife | fv-side-jackknife, krok 1 |
| core_floor.sideJack.move | Unieś jednocześnie barki i górną nogę, zginając się w pasie; opuść się i powtórz. | Lift your shoulders and top leg at the same time, folding at the waist; lower and repeat. | jw. | jw., kroki 4–5 |
| core_floor.otis.setup | Połóż się na plecach, kolana ugięte, stopy płasko; talerz trzymaj oburącz przy klatce. | Lie on your back, knees bent, feet flat; hold the plate with both hands at your chest. | Otis-Up | fv-otis-up, How to (ustawienie) |
| core_floor.otis.move | Usiądź, wypychając talerz nad głowę; wracając, opuść go do klatki. | Sit up while pressing the plate overhead; on the way down, bring it back to your chest. | jw. | jw., ruch i powrót |

Kandydaci błędów (wnioskowane, gotowe do użycia, gdy kandydaci ustawienia/ruchu dostaną drugie źródło): Side Jackknife — „Biodra przechylają się w przód albo w tył.” (zaprzeczenie `core_floor.sideJack.setup`; Fitness Volt wprost: „vertical and not leaning forward or back”); Seated Flat Bench Leg Pull-In — brak sensownego błędu wnioskowanego (stopy na podłodze między powtórzeniami Fitness Volt podaje jako ułatwienie, nie błąd).

## 4. Źródła

| id | adres | organizacja | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|---|
| fv-tuck-crunch (nowe) | https://fitnessvolt.com/tuck-crunch/ | Fitness Volt | 4 warunkowo spełnione — M. Magnante, w podpisie „ACE” (certyfikowany trener ACE), opubl. 06.05.2023, akt. 11.08.2024; recenzenta brak (jak `fv-scissor-kicks` w W2 cz. 2) | How to, kroki 1–4; wskazówki (szyja, lędźwie, oddech) |
| ace-243 (W1) | https://www.acefitness.org/resources/everyone/exercise-library/243/vertical-toe-touches/ | ACE | 4 (treść firmowana przez ACE) | Step 1–3; uwagi końcowe |
| ace-52 (istn. w `sources`) | https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/ | ACE | 4; z ace-243 to jedna organizacja — w każdym zdaniu liczony raz | Step 3 |
| healthline-stomach-vacuum (nowe) | https://www.healthline.com/health/fitness/stomach-vacuum | Healthline | 4 warunkowo spełnione — autorka K. Davidson, MScFN, RD, CPT; „Medically reviewed by” J. Meacham, PhD, RD, CSCS; „Updated” 13.10.2026 | instrukcja (wersja leżąca, wciągnięcie, oddech); błędy („Sucking in”, pochylanie) |
| vm-ta-isometric (nowe) | https://www.vmfh.org/content/dam/vmfhorg/pdf/legacy-vm/workfiles/pmr/Transverse%20Abdominus%20Isometric.pdf | Virginia Mason Physical Therapy (Virginia Mason Franciscan Health — system szpitali) | 4 — uzupełnienie 2: szpitale i systemy ochrony zdrowia, jawne firmowanie (logo i nagłówek „Virginia Mason Physical Therapy”), data niewymagana | jedyna strona, punkty 1–7 |
| fv-knee-tucks (nowe; kandydat) | https://fitnessvolt.com/knee-tucks/ | Fitness Volt | 4 warunkowo spełnione — P. Dale (biogram: 30 lat jako trener personalny i trener przygotowania, egzaminator kwalifikacji), opubl. 29.10.2021, akt. 11.08.2024 | „Bench knee tucks”, kroki 1–4 |
| fv-side-jackknife (nowe; kandydat) | https://fitnessvolt.com/side-jackknife/ | Fitness Volt | 4 warunkowo spełnione — P. Dale, opubl. 19.02.2022, akt. 11.08.2024 | How to, kroki 1–6 |
| fv-otis-up (nowe; kandydat) | https://fitnessvolt.com/otis-up-exercise/ | Fitness Volt | 4 warunkowo spełnione — M. Magnante (ACE), opubl. 16.08.2022, akt. 11.08.2024 | How to (ustawienie, ruch, powrót); wskazówki (pęd) |

Niezależność: Fitness Volt, ACE, Healthline, Virginia Mason — różni wydawcy. Daty Fitness Volt narzędzie podało z danych strukturalnych strony.

Odrzucone (szczebel 5 albo nieczytelne; nie liczą się):
- generationiron.com/in-and-out-exercise-guide/ — autor bez kwalifikacji trenerskich w biogramie (D. Wolf), bez recenzenta, „This post may contain affiliate links” → 5.
- themanual.com „seated ab exercises” — autorka bez kwalifikacji, bez recenzenta, prowizje afiliacyjne → 5.
- mindbodygreen.com „tabletop crunches” (01/04/2026) — autorka: redaktorka działu duchowości, instruktorka jogi; bez recenzenta; kroków nie przypisano trenerowi → 5.
- Rogue Fitness „movement demo tuck ups” — producent, ale ćwiczenie bez jego sprzętu → 5 (nieotwierana — znana tylko z wyników wyszukiwania).
- livestrong.com — dwa adresy przekierowują: jeden do serwisu aplikacji (pominięty), drugi do everydayhealth.com (narzędzie nie może pobrać).
- menshealth.com — niedostępne (szczebel OTWARTE wg pliku szczebli).
- Muscle & Strength — 403 (szczebel OTWARTE).

## 5. Otwarte i pytania do koordynatora

1. **[DO DECYZJI] Stomach Vacuum — czy karta szpitala o izometrii mięśnia poprzecznego to „ten sam ruch”.** Healthline opisuje stomach vacuum jako wciągnięcie brzucha z pracą mięśnia poprzecznego i podaje wersję leżącą (kolana ugięte, stopy płasko, oddychanie normalne) — to dokładnie ustawienie i ruch z karty Virginia Mason. Karta szpitala ma inną nazwę i mówi „gently” (delikatnie), bez wstępnego wydechu. Oznaczyłem jako `uproszczenie: wariant nazwy`. Jeśli koordynator uzna, że to inne ćwiczenie (analogia, jak ACE #121 „Supine Hollowing” w W1), karta ma jedno źródło (Healthline) → otwarte.
2. **Stomach Vacuum — `note` katalogu** („after full exhale”): „pełnego wydechu” nie potwierdza żadne przeczytane źródło (Healthline: „slowly exhale”; szpital: bez wydechu). Wskazówka o wydechu na start — tylko Healthline → nie wpisana. Do poprawy `note` (zadanie dla wykonawcy) albo zostawić jako opis katalogu bez wpływu na kartę.
3. **Tuck Crunch — uproszczenie wariantu**: jeśli audytor uzna, że nogi pionowo z prostymi kolanami (ACE #243) albo stopy na podłodze (ACE #52) zmieniają ćwiczenie, zdania mają jedno źródło (Fitness Volt) → częściowe/otwarte. Sprawdzić też pozę (`poses/core_floor.json`, „Tuck Crunch”): czy uda są pionowo, a ręce skrzyżowane na klatce (Fitness Volt) — przy dłoniach przy głowie trzeba by dobrać zdanie szyi inaczej.
4. Seated Flat Bench Leg Pull-In, Side Jackknife, Otis-Up — po jednym źródle szczebla 4 (Fitness Volt; kandydaci w p. 3). Tropy: Healthline (strona z recenzentem) dla „seated knee tuck” / „side jackknife”; Men's Health i Muscle & Strength po otwarciu w innym środowisku; ISSA/NFPT z autorem.
5. Seated Flat Bench Leg Pull-In — `cue-sets.json` ma `rcrunch.hips` i `db.slow` (analogia, jak w W1) oraz `mis.jerk` („ciężarem” — bez obciążenia); źródło mówi o pochylaniu tułowia do przodu przy przyciąganiu kolan — `rcrunch.hips` nie pasuje wprost.
6. Cocoons, Smith Machine Hip Raise, Press Sit-Up, Weighted Sit-Ups - With Bands — brak źródła szczebla 4; nie zgaduję. Otis-Up i Press Sit-Up mają `crunch.neck` w zestawie ogólnym — przy talerzu/sztandze trzymanych przed klatką „nie ciągnij głowy rękami” nie pasuje (jak w W1).
7. **Role mięśni — niesprawdzone.** Sprawdzenie, czy któreś z 9 ćwiczeń ma wiersz bez `role`, wymaga uruchomienia `muscleRoleRows` (`lib/muscleRoles.ts:55`) na danych `lib/muscleRoles/data.json`; w tej sesji nie miałem powłoki do uruchomienia kodu. Pliku `role-miesni-fala-w2/` nie tworzyłem. Do zrobienia przez agenta z dostępem do `node`.

## 6. Stan

- Zrobione (02.11.2026): 9 ćwiczeń przejrzanych; gotowe 2 (Tuck Crunch — z uproszczeniem wariantu; Stomach Vacuum — warunkowo, p. 5 pyt. 1), otwarte 7 (3 z jednym źródłem i kandydatami zdań: Seated Flat Bench Leg Pull-In, Side Jackknife, Otis-Up). Nowe zdania: 5 (+ 6 kandydatów). Błędy: 3 w kartach gotowych (2 ze źródeł, 1 wnioskowany).
- Zostało: drugie źródło dla kandydatów (p. 5 pkt 4); decyzje z p. 5 pkt 1 i 3; role mięśni (p. 5 pkt 7); Weighted Sit-Ups - With Bands i Press Sit-Up — wyszukiwanie od nowa.
- Następny krok: Healthline dla „seated knee tuck” i „side jackknife”; uruchomić `muscleRoleRows` dla 9 kluczy.
- Pułapki: livestrong.com przekierowuje do innych serwisów (w tym aplikacji); Fitness Volt — sprawdzać autora na każdej stronie (strony „substitute-exercises” bez autora → 5); PDF szpitala WebFetch zwraca jako dane binarne — trzeba odczytać zapisany plik; Healthline „Updated” 13.10.2026 — data z bieżącego roku, zapisana tak, jak na stronie.
