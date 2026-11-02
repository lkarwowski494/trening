# Wskazówki techniki — rodzina `foam_roll` (rolowanie wałkiem), fala W2, grupa G2

Data: 02.11.2026. Autor: badacz-merytoryczny (agent). Status: PROPOZYCJA (nic nie trafiło do `lib/` ani `data/zrodla/cues.json`).

Podstawa: plik fali W1 tej rodziny i przeliczenie stanu z 02.11.2026 (uzupełnienie 2 rozstrzygnięcia szczebli: HKU CSE = szczebel 5, więc
zdania oparte na HKU + jednym źródle trafiły do „pominięcia”). W tej sesji sam przeczytałem: PDF OrthoBethesda (s. 1–2, obraz stron),
PDF Connecticut Children's (s. 1–2), transkrypcję OSU, blog ACE 5624, strony NASM (łydki, przywodziciele, najszerszy) i nową ulotkę
Livewell Southwest (NHS, podiatria). Zdań o zdrowiu i liczb (sekundy, minuty, powtórzenia) nie dodaję.

## 1. Ćwiczenia

| Ćwiczenie | Stan po W1 | Stan po W2 | Błędy (ze źródeł / wnioskowane) | Uwaga dla integratora |
|---|---|---|---|---|
| Foam Roll: Quadriceps | gotowe | gotowe | 1 / 0 | tylko `mistakes` |
| Foam Roll: Hamstrings | gotowe | gotowe | 1 / 0 | tylko `mistakes`; `foam_roll.angle` nadal pominięte (Otwarte) |
| Calves-SMR | gotowe | gotowe | 1 / 0 (+2 z W1) | `mistakes` + przywrócone `tips`: `smr.tender`, `foam_roll.angle` (drugie źródło znalezione) |
| Iliotibial Tract-SMR | gotowe | gotowe | 1 / 0 | tylko `mistakes`; `foam_roll.angle` nadal pominięte |
| Adductor-SMR | gotowe | gotowe | 0 / 1 (+1 z W1) | tylko `mistakes` |
| Latissimus Dorsi-SMR | gotowe | gotowe | 0 / 1 (+2 z W1) | tylko `mistakes` |
| Piriformis-SMR | gotowe | gotowe | 0 / 1 | `mistakes` + przywrócone `setup` `foam_roll.pir.lean` i `tips` `smr.tender` |
| Rhomboids-SMR | gotowe | gotowe | 0 / 1 | tylko `mistakes`; `foam_roll.ub.arms` nadal pominięte |
| Foot-SMR | gotowe | gotowe | 0 / 0 | brak potwierdzonego zdania, którego zaprzeczenie zmienia ruch (Otwarte) |
| Peroneals-SMR | otwarte | gotowe — **uproszczenie: wariant Calves-SMR** (do decyzji recenzenta; bez uproszczenia: otwarte) | 1 / 0 (przez wariant) | pełny wpis |

Przy błędzie „ze źródeł” dla wałka na kolanie: zdanie `foam_roll.offKnee` jest już wskazówką (tips) tych ćwiczeń; błąd pokazuje to samo
od strony „czego unikać” i ma własne dwa źródła wprost (OrthoBethesda „Safety”, ACE + karta danej partii). Jeśli integrator uzna dublowanie
wskazówki i błędu za zbędne — błąd można pominąć tam, gdzie `foam_roll.offKnee` już stoi.

## 2. Blok do wdrożenia

```json
{
  "Foam Roll: Quadriceps": {
    "mistakes": [
      {"c": "foam_roll.mis.onKnee", "s": [["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints (i.e knee, elbow, spine)”)"], ["osu-foam-rolling", "„Quadriceps” („keeping the roll off your knee”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”; lista obejmuje „quads”)"]]}
    ]
  },
  "Foam Roll: Hamstrings": {
    "mistakes": [
      {"c": "foam_roll.mis.onKnee", "s": [["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints (i.e knee…)”); s. 2, „2. Hamstrings” (start „just above the back of the knees”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”; lista obejmuje „hamstrings”)"]]}
    ]
  },
  "Calves-SMR": {
    "tips": [
      {"c": "smr.tender", "s": [["nasm-foam-roll-calves", "Step 3 („pausing on tender areas”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Spend extra time pausing on tender areas”; dokument opisuje łydki w s. 2, „4. Calves”)"], ["w2g2-fr-livewell-calf", "punkt 1 („When you find a sore/tender spot, try concentrating on rolling your calf up and down along this area”)"]]},
      {"c": "foam_roll.angle", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („Change the angle with each pass in order to target the entire muscle”)"], ["w2g2-fr-livewell-calf", "punkt 2 („rotating/turning your leg to apply pressure to different areas of your calf muscle”)"]]}
    ],
    "mistakes": [
      {"c": "foam_roll.mis.onKnee", "s": [["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints (i.e knee…)”); s. 2, „4. Calves” (koniec „just below the back of the knee”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”; lista obejmuje „calves”)"]]}
    ]
  },
  "Iliotibial Tract-SMR": {
    "mistakes": [
      {"c": "foam_roll.mis.onKnee", "s": [["ccmc-foam-rolling", "s. 1, „IT Band” („Don't roll past your knee.”)"], ["osu-foam-rolling", "„Iliotibial band” (roll off the knee)"], ["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints”)"]]}
    ]
  },
  "Adductor-SMR": {
    "mistakes": [
      {"c": "foam_roll.mis.onKnee", "s": [["wniosek", "foam_roll.add.path"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”; lista obejmuje „adductors”) — pomocniczo"]]}
    ]
  },
  "Latissimus Dorsi-SMR": {
    "mistakes": [
      {"c": "foam_roll.mis.lat.shoulder", "s": [["wniosek", "foam_roll.lat.setup"]]}
    ]
  },
  "Piriformis-SMR": {
    "setup": [
      {"c": "foam_roll.pir.lean", "s": [["osu-foam-rolling", "„Glute piriformis” (lean slightly toward the side of the crossed leg)"], ["orthobethesda-foam-rolling", "s. 2, „3. Glutes/Hip Rotators” („crossing the ankle (of the side you are applying pressure) over the opposite thigh” — nacisk po stronie założonej nogi)"]]}
    ],
    "tips": [
      {"c": "smr.tender", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („Spend extra time pausing on tender areas”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll the tender areas”; lista obejmuje „glutes”)"], ["ccmc-foam-rolling", "s. 1, wstęp („focus on these areas by rolling specifically back and forth over them”)"]]}
    ],
    "mistakes": [
      {"c": "foam_roll.mis.pir.noLean", "s": [["wniosek", "foam_roll.pir.lean"]]}
    ]
  },
  "Rhomboids-SMR": {
    "mistakes": [
      {"c": "foam_roll.mis.lowBack", "s": [["wniosek", "foam_roll.ub.path"], ["ace-blog-5624", "How to Foam Roll („The only place to avoid direct foam rolling is the lower back (lumbar spine).”) — pomocniczo"], ["orthobethesda-foam-rolling", "s. 2, „7. Mid/Upper Back” (start „under your lower ribs”, w górę do podstawy szyi) — pomocniczo"]]}
    ]
  },
  "Peroneals-SMR": {
    "setup": [
      {"c": "foam_roll.calf.setup", "s": [["uproszczenie", "wariant Calves-SMR — to samo ustawienie w siadzie z podporem rąk"], ["nasm-foam-roll-calves", "Step 1–2"], ["osu-foam-rolling", "„Calves” („Lift your body with your arms”)"]]},
      {"c": "foam_roll.per.turn", "s": [["uproszczenie", "wariant Calves-SMR — noga obrócona, by wałek trafił w bok podudzia"], ["w2g2-fr-livewell-calf", "punkt 2 („rotating/turning your leg to apply pressure to different areas”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Change the angle with each pass in order to target the entire muscle”)"]]}
    ],
    "move": [
      {"c": "foam_roll.calf.path", "s": [["uproszczenie", "wariant Calves-SMR — ten sam zakres kostka–pod kolanem"], ["nasm-foam-roll-calves", "Step 3"], ["orthobethesda-foam-rolling", "s. 2, „4. Calves”"]]},
      {"c": "smr.slow", "s": [["uproszczenie", "wariant Calves-SMR"], ["nasm-foam-roll-calves", "Step 3 („Perform slow, controlled rolling motions.”)"], ["w2g2-fr-livewell-calf", "punkt 2 („Continue to slowly move up and down the roller”)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "foam_roll.mis.onKnee", "s": [["uproszczenie", "wariant Calves-SMR"], ["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints (i.e knee…)”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”)"]]}
    ]
  }
}
```

Format `["uproszczenie", "…"]` w polu `s` to propozycja oznaczenia — integrator dopasuje do konwencji `cues.json`, jeśli jest inna.

**Peroneals-SMR — różnica względem Calves-SMR:** ruch jest ten sam (siad, podpór na rękach, uniesione biodra, toczenie podudzia po wałku
od kostki do miejsca pod kolanem, powoli). Różni się tylko ułożenie nogi: noga obrócona do środka, żeby wałek leżał pod zewnętrzną stroną
podudzia, a nie pod łydką. Dwa źródła szczebla 4 (Livewell, OrthoBethesda) mówią o obracaniu nogi / zmianie kąta, żeby objąć inne części
mięśnia — ale piszą o łydce, nie wprost o boku podudzia; stąd oznaczenie „uproszczenie”. Wersja leżąca na boku (opisywana na stronach
aplikacji i platform ćwiczeń) nie ma przeczytanego źródła szczebla ≤ 4 — nie wpisana. Jeśli recenzent nie przyjmie uproszczenia,
ćwiczenie zostaje otwarte.

## 3. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `foam_roll.mis.onKnee` | Wałek wjeżdża na kolano. | Rolling onto the knee. | ze źródeł: OrthoBethesda Safety (knee wprost) + ACE („avoiding bones and joints”, lista partii) + OSU/CCMC dla czworogłowych i pasma; dla przywodzicieli wniosek z `foam_roll.add.path` („między kolanem a pachwiną”) |
| `foam_roll.mis.lat.shoulder` | Wałek pod barkiem zamiast tuż pod pachą. | Roller under the shoulder instead of just below the armpit. | wniosek: zaprzeczenie `foam_roll.lat.setup` („wałek tuż pod pachą”) |
| `foam_roll.mis.pir.noLean` | Siedzenie na środku wałka, bez przechyłu na stronę założonej nogi. | Sitting square on the roller instead of leaning toward the crossed leg. | wniosek: zaprzeczenie `foam_roll.pir.lean` (potwierdzone w tej sesji) |
| `foam_roll.mis.lowBack` | Zjeżdżanie wałkiem na lędźwie. | Rolling down onto your lower back. | wniosek: zaprzeczenie `foam_roll.ub.path` („wzdłuż górnej części pleców”); ACE wprost wskazuje lędźwie jako miejsce do pominięcia (pomocniczo; bez słów o zdrowiu w zdaniu) |
| `foam_roll.per.turn` | Obróć nogę do środka, żeby wałek był pod zewnętrzną stroną podudzia. | Turn your leg in so the roller sits under the outside of your lower leg. | uproszczenie: wariant Calves-SMR (Livewell pkt 2, OrthoBethesda s. 1) |

Istniejące zdania użyte bez zmian: `smr.slow`, `smr.tender`, `foam_roll.calf.setup`, `foam_roll.calf.path`, `foam_roll.angle`, `foam_roll.pir.lean` (z W1).

## 4. Źródła

| id | adres | organizacja | szczebel i uzasadnienie |
|---|---|---|---|
| `w2g2-fr-livewell-calf` (nowe) | https://www.livewellsouthwest.co.uk/wp-content/uploads/2023/06/Calf-Muscle-Rolling-Massage-v1.0-Oct-2020.pdf | Livewell Southwest (dostawca usług NHS, Podiatry Services) | 4 — ulotka dla pacjentów firmowana przez organizację ochrony zdrowia, „Patient Information Leaflet”, wersja V1 październik 2020; w metadanych autor z funkcją „Lead Podiatrist”. Ta sama organizacja co `livewell-lower-limb-stretch` w rodzinie mobility_floor — w foam_roll nowa, niezależna od pozostałych. |
| `orthobethesda-foam-rolling` (W1) | https://www.orthobethesda.com/foam-rolling-exercises/ (zwraca PDF) | OrthoBethesda Therapy Services | 4 — fizjoterapia przy praktyce ortopedycznej (firmowanie instytucji medycznej); przeczytane s. 1–2 w tej sesji |
| `ccmc-foam-rolling` (W1) | https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf | Connecticut Children's Sports Medicine | 4 — szpital; przeczytane s. 1–2 w tej sesji |
| `osu-foam-rolling` (W1) | https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt | Ohio State Wexner Medical Center | 4 — szpital uczelniany; przeczytane w tej sesji |
| `ace-blog-5624` (W1) | https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/ | ACE | 4 — organizacja szkoląca trenerów; autorka z certyfikatami ACE i CSCS, data 28.08.2015 |
| `nasm-foam-roll-calves` (W1) | https://www.nasm.org/resource-center/exercise-library/foam-roll-calves | NASM | 4 — organizacja szkoląca trenerów (treść firmowana, bez autora i daty na stronie) |
| `nasm-foam-roll-latissimus-dorsi` (W1) | https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi | NASM | 4 — j.w.; przeczytana w tej sesji (błędy: tylko ogólne „Not positioning the foam roller correctly” — nie użyte) |

`hku-foam-rolling` — szczebel 5 (uczelniane centrum sportu, przeliczenie 02.11.2026); w tym pliku nieużywane.

## 5. Otwarte

- **`foam_roll.angle` dla Hamstrings i Iliotibial Tract-SMR** → wprost tylko OrthoBethesda (instrukcje ogólne); HKU = 5. Livewell dotyczy
  tylko łydki. Bez drugiego źródła.
- **`foam_roll.ub.arms` (Rhomboids-SMR)** → tylko OrthoBethesda („Hug your elbows with your arms…”). OSU proponuje inaczej: dłonie
  na brzuchu, gdy szyja jest napięta. HKU = 5. Bez drugiego źródła.
- **Foot-SMR — błąd** → potwierdzone zdania (`foam_roll.foot.setup` „usiądź”, `foam_roll.foot.path` „od pięty do poduszki”) nie dają
  sensownego zaprzeczenia: stanie na piłce to inny wariant, nie błąd. Bez błędu.
- **Peroneals-SMR — wersja leżąca na boku** i „omijanie kości strzałkowej” → tylko strony aplikacji i platform ćwiczeń (szczebel 5,
  nie zapisane z nazwy). Przeszukano trzy zapytania (szpitale, NHS, „outside of your lower leg”). Nie wpisane.
- **Rhomboids-SMR — „rolowanie obok kręgosłupa, nie po nim”** (OrthoBethesda s. 2 „Make sure to roll on either side of the spine”) →
  jedno źródło; dla wałka w poprzek pleców sens niejasny. Nie wpisane.
- **`smr.mis.fast` i `foam_roll.mis.pressure` poza łydkami, przywodzicielami i najszerszym** → bez zmian względem W1 (błąd wprost tylko NASM).

## 6. Uwagi dla integratora

- Dla ćwiczeń z dopiskiem „tylko `mistakes`” scal klucz z blokiem W1. Calves-SMR i Piriformis-SMR mają też przywrócone zdania z listy
  „do pominięcia” (`smr.tender`, `foam_roll.angle` dla łydek; `foam_roll.pir.lean`, `smr.tender` dla gruszkowatego) — z nowym zestawem źródeł
  bez HKU; zastąp nimi wpisy W1.
- `Piriformis-SMR` `foam_roll.pir.lean`: OrthoBethesda nie mówi „przechyl się”, tylko że kostkę zakłada się po stronie, na którą idzie nacisk —
  to ta sama pozycja (ciężar na stronę założonej nogi). Recenzent może uznać to za słabsze potwierdzenie; wtedy pir.lean i błąd
  `foam_roll.mis.pir.noLean` wracają do „otwarte”.
- Słownik terminów nie ma haseł „wałek”/„podudzie” — do sprawdzenia przez recenzenta lokalizacji.
