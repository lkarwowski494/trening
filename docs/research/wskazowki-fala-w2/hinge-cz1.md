# Wskazówki techniki — rodzina `hinge`, część 1 (fala W2)

Data: 02.11.2026 · rodzina: `hinge` (ćwiczenia z pliku W1 `hinge-cz1.md`) · **Status: PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: wyniki W1 (gałąź badania/g4-nogi, plik `hinge-cz1.md`) i przeliczenie szczebli (ta sama gałąź, plik
`przeliczenie-szczebli-2026-11-02.md` — nadrzędny), szczeble organizacji: `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211).
Rodzina `hinge` ma status `ready` — karta liczy się tylko z ≥ 1 błędem. Żadne ćwiczenie z tej części nie ma wpisu póz v2
(`lib/figures/v2/poses/*.json` — brak trafień dla nazw z tej części, sprawdzone 02.11.2026).

## 1. Ćwiczenia

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Single Leg RDL (hantel) | nie | gotowe z błędem (W1) | nic — karta W1 (blok w przeliczeniu szczebli) ma już 2 błędy | — |
| Single Leg RDL (linki) | nie | gotowe z błędem (W1) | nic — jw. | — |
| Stiff-Legged Barbell Deadlift | nie | **gotowe z błędem** | drugie źródło szczebla 4 (ISSA) dla ustawienia, ruchu, pleców, sztangi blisko nóg; błędy `mis.barAway` (źródło + wniosek), `mis.roundBack` (wniosek) | `rdl.depth` (różnica Coach / ISSA) |
| Smith Machine Stiff-Legged Deadlift | nie | **gotowe z błędem — uproszczenie** | karta jako wariant sprzętu SLDL; błąd `mis.roundBack` (wniosek) | źródło szczebla 4 o samej maszynie Smitha |
| Deficit Deadlift | nie | **gotowe z błędem** | ISSA (deficyt = klasyczny martwy ciąg z podwyższenia) + BarBend; błąd `mis.roundBack` (wniosek) | `def.knees`, `def.low` — po jednym źródle |
| Sumo Deadlift (kettlebell) | nie | **gotowe z błędem — uproszczenie** | wariant sprzętu `Sumo Deadlift` (karta własna) + NASM o kettlebellu między stopami; błąd `mis.roundBack` (NASM + wniosek) | źródło szczebla 4 wprost o wersji sumo z kettlebellem |
| Cable Pull Through | nie | otwarte | kandydat EliteFTS (D. Tate) — warunkowy; Set For Set i Training & Conditioning odrzucone | 2. organizacja dla `hinge.back` i błędu |
| Rack Pull | nie | otwarte | — (wyszukiwanie bez źródła szczebla 4) | 2. źródło szczebla 4 |
| Band Good Morning | nie | otwarte | **Set For Set odpada** (strona promuje własną aplikację z trenerem AI — precedens Speediance) | ustawienie gumy: 0 źródeł szczebla 4 |
| Good Morning off Pins | nie | otwarte | bez zmian (ocena strony J. Stoppaniego nadal u koordynatora) | jw. W1 |
| Single Arm RDL (hantel/linka) | nie | otwarte | — | źródło o wersji obunóż z ciężarem w jednej ręce |

### Blok do wdrożenia

Format `data/zrodla/cues.json` → `exercises`. Single Leg RDL (hantel/linki) — bez zmian, wpisy w bloku przeliczenia szczebli W1 (nie powtarzam).

```json
{
  "Stiff-Legged Barbell Deadlift": {
    "setup": [
      {"c": "sldl.setup", "s": [["coach-stiff-leg-deadlift", "How-to (grasp the bar with an overhand grip; knees ever so slightly bent)"], ["issa-deadlift-variations", "Romanian (stiff-leg) deadlift (normal or alternate grip; knees soft but slightly locked)"]]}
    ],
    "move": [
      {"c": "sldl.move", "s": [["coach-stiff-leg-deadlift", "How-to (drive your hips forward… until standing straight; maintain this slight flex throughout)"], ["issa-deadlift-variations", "Romanian (stiff-leg) deadlift (hinge at the hips; press the hips forward at the top)"], ["barbend-stiff-leg-deadlift", "opis (minimizes nearly all knee flexion)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["coach-stiff-leg-deadlift", "How-to (your back should remain flat)"], ["issa-deadlift-variations", "Romanian (straight torso… straight spine); wskazówki ogólne (keep the spine straight (neutral))"]]},
      {"c": "rdl.knees", "s": [["coach-stiff-leg-deadlift", "How-to (knees ever so slightly bent)"], ["barbend-stiff-leg-deadlift", "opis (minimizes nearly all knee flexion)"], ["issa-deadlift-variations", "Romanian (knees soft but slightly locked)"]]},
      {"c": "dl.close", "s": [["coach-stiff-leg-deadlift", "How-to (keep the bar touching your body throughout)"], ["issa-deadlift-variations", "Romanian (bar stays close to the legs)"]]}
    ],
    "mistakes": [
      {"c": "mis.barAway", "s": [["coach-stiff-leg-deadlift", "Common mistakes (forgetting to keep the bar close to their shins)"], ["wniosek", "dl.close"]]},
      {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"]]}
    ]
  },
  "Smith Machine Stiff-Legged Deadlift": {
    "setup": [
      {"c": "sldl.setup", "s": [["coach-stiff-leg-deadlift", "How-to — uproszczenie: wariant sprzętu Stiff-Legged Barbell Deadlift"], ["issa-deadlift-variations", "Romanian (stiff-leg) — uproszczenie: wariant sprzętu Stiff-Legged Barbell Deadlift"]]}
    ],
    "move": [
      {"c": "sldl.move", "s": [["coach-stiff-leg-deadlift", "How-to — uproszczenie: wariant sprzętu"], ["issa-deadlift-variations", "Romanian — uproszczenie: wariant sprzętu"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["coach-stiff-leg-deadlift", "How-to (back flat) — uproszczenie: wariant sprzętu"], ["issa-deadlift-variations", "Romanian; wskazówki ogólne — uproszczenie: wariant sprzętu"]]},
      {"c": "rdl.knees", "s": [["coach-stiff-leg-deadlift", "How-to — uproszczenie: wariant sprzętu"], ["issa-deadlift-variations", "Romanian — uproszczenie: wariant sprzętu"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"]]}
    ]
  },
  "Deficit Deadlift": {
    "setup": [
      {"c": "def.setup", "s": [["issa-deadlift-variations", "Deficit deadlift (feet slightly elevated, typically no more than a couple inches; utilizing a platform; weight stays on the floor)"], ["barbend-deficit-deadlift", "Step 1 — Set the Deficit (elevation around two inches)"]]},
      {"c": "dl.feet", "s": [["barbend-deficit-deadlift", "Step 2 — Set Up (hip-to-shoulder width stance, bar over midfoot; shins touch the bar)"], ["nasm-barbell-deadlift", "Step 1: Setup — uproszczenie: ISSA opisuje deficyt jako klasyczny martwy ciąg z podwyższenia"]]}
    ],
    "move": [
      {"c": "dl.lift", "s": [["barbend-deficit-deadlift", "Step 3 — Lift Off (drive through your quads… hips forward as the bar passes your knees)"], ["issa-deadlift-variations", "Deficit deadlift (complete a conventional deadlift; very similar to the conventional deadlift)"], ["nasm-barbell-deadlift", "Step 3: Execute/Drive — uproszczenie jw."]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["barbend-deficit-deadlift", "Step 2 — Set Up (flatten your back)"], ["issa-deadlift-variations", "wskazówki ogólne (keep the spine straight (neutral) throughout the movement)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"]]}
    ]
  },
  "Sumo Deadlift (kettlebell)": {
    "setup": [
      {"c": "sumo.stance", "s": [["exrx-ErectorSpinae/BBSumoDeadlift", "Preparation; Comments — uproszczenie: wariant sprzętu Sumo Deadlift"], ["sbs-how-to-deadlift", "Stance Width: Sumo Contrast — uproszczenie: wariant sprzętu Sumo Deadlift"], ["issa-deadlift-variations", "Sumo deadlift (much wider stance, toes turned out) — wariant sprzętu"]]},
      {"c": "sumoKb.grip", "s": [["nasm-kettlebell-deadlift", "instrukcja (kettlebell positioned on the ground between your feet; both hands) — wariant: stopy na szerokość bioder"], ["sbs-how-to-deadlift", "Grip: Sumo Contrast — uproszczenie: wariant sprzętu Sumo Deadlift (chwyt między nogami)"], ["issa-deadlift-variations", "Sumo deadlift (grip on the inside of the legs) — wariant sprzętu"]]}
    ],
    "move": [
      {"c": "sumo.lift", "s": [["exrx-ErectorSpinae/BBSumoDeadlift", "Execution — uproszczenie: wariant sprzętu Sumo Deadlift"], ["sbs-how-to-deadlift", "Locking out — uproszczenie: wariant sprzętu"], ["issa-deadlift-variations", "Sumo deadlift (extend the knees and hips together, hips forward at the top) — wariant sprzętu"]]}
    ],
    "tips": [
      {"c": "sumo.kneesOut", "s": [["exrx-ErectorSpinae/BBSumoDeadlift", "Comments — uproszczenie: wariant sprzętu Sumo Deadlift"], ["sbs-how-to-deadlift", "Performing the pull: Sumo Contrast — uproszczenie: wariant sprzętu"]]},
      {"c": "hinge.back", "s": [["nasm-kettlebell-deadlift", "instrukcja (maintain a neutral spine)"], ["exrx-ErectorSpinae/BBSumoDeadlift", "Preparation; Comments — uproszczenie: wariant sprzętu"], ["sbs-how-to-deadlift", "Lowering under control — uproszczenie: wariant sprzętu"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["nasm-kettlebell-deadlift", "Common mistakes (rounding the lower back) — wariant: kettlebell, stopy na szerokość bioder"], ["wniosek", "hinge.back"]]}
    ]
  }
}
```

Uzasadnienia uproszczeń:
- **Smith Machine SLDL ← Stiff-Legged Barbell Deadlift** (wariant sprzętu): ten sam chwyt, to samo zgięcie w biodrach przy prawie
  prostych kolanach; maszyna tylko prowadzi sztangę pionowo, a w SLDL sztanga i tak idzie pionowo przy nogach (Coach, ISSA). Pominięte
  `dl.close` i `mis.barAway` (tor wyznacza maszyna). Brak źródła szczebla 4 o samej maszynie — Gym Mikolo = 5 (W1).
- **Sumo Deadlift (kettlebell) ← Sumo Deadlift** (karta własna w `cues.json`): to samo szerokie ustawienie, kolana na zewnątrz, ten sam
  wyprost bioder i kolan; ciężar wisi między nogami jak sztanga trzymana chwytem między nogami. Różnica — chwyt oburącz za jedną
  rączkę — ma źródło wprost dla kettlebella (NASM, wersja klasyczna). `sumo.grip` (sztanga na szerokość barków) nie pasuje — zastąpione `sumoKb.grip`.
- **Deficit Deadlift ← Deadlift (sztanga)**: nie wariant sprzętu, tylko zakresu — dlatego oparcie na ISSA, które wprost pisze, że to
  klasyczny martwy ciąg z podwyższenia; `nasm-barbell-deadlift` tylko obok, oznaczone.
- **SLDL a RDL**: ISSA opisuje „Romanian (stiff-leg)” jako jedno ćwiczenie. Karta SLDL nie mówi, skąd zaczynać (Coach: z podłogi,
  jeśli pozwala gibkość; ISSA: od pozycji stojącej) — różnica w sekcji Otwarte.

## Nowe zdania

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| `sldl.setup` | Chwyć sztangę nachwytem, kolana lekko ugięte. | Grab the bar overhand, knees slightly bent. | z W1; teraz 2 źródła (Coach, ISSA). |
| `sldl.move` | Podnoś, wypychając biodra w przód — nogi prawie nie pracują — aż staniesz prosto. | Lift by driving your hips forward — the legs barely help — until you're standing tall. | z W1; Coach + ISSA (+ BarBend: kolana prawie się nie zginają). |
| `def.setup` | Stań na niskim, stabilnym podwyższeniu; sztanga zostaje na podłodze. | Stand on a low, stable platform; the bar stays on the floor. | zmiana brzmienia z W1 (bez „talerza” — nie sprawdzone w obu źródłach); ISSA + BarBend. |
| `sumoKb.grip` | Kettlebell między stopami — chwyć go oburącz za rączkę. | Kettlebell between your feet — grab the handle with both hands. | `sumo.grip` mówi o sztandze; NASM (kettlebell) + baza sumo. |

Zdania istniejące użyte bez zmian: `hinge.back`, `rdl.knees`, `dl.close`, `dl.feet`, `dl.lift`, `mis.barAway`, `mis.roundBack`,
`sumo.stance`, `sumo.lift`, `sumo.kneesOut` (`lib/cues/text/pl.json`).

## Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| `issa-deadlift-variations` (nowe) | https://www.issaonline.com/blog/post/deadlift-variations-for-added-challenge-and-better-form | ISSA | „By ISSA”, 05.02.2024 — przeczytane 02.11.2026 | 4 — organizacja szkoląca trenerów, tekst firmowany przez ISSA z datą (szczeble-organizacji, wiersz ISSA) |
| `coach-stiff-leg-deadlift` (W1) | https://www.coachweb.com/leg-exercises/7387/how-to-do-the-stiff-leg-deadlift | Coach | Sam Rider (REPS L3 PT), akt. 29.01.2024 — ponownie przeczytane 02.11.2026 | 4 — magazyn, autor z kwalifikacjami (warunek „warunkowo 4” spełniony) |
| `barbend-stiff-leg-deadlift` (W1) | https://barbend.com/stiff-leg-deadlift/ | BarBend | Mike Dewar, CSCS, akt. 09.08.2023 (W1) | 4 |
| `barbend-deficit-deadlift` (W1) | https://barbend.com/deficit-deadlift/ | BarBend | Eric Bugera, CSCS, CISSN, akt. 25.11.2024 — przeczytane 02.11.2026 | 4 |
| `nasm-kettlebell-deadlift` (istniejące) | https://www.nasm.org/resource-center/exercise-library/kettlebell-deadlift | NASM | biblioteka firmowana przez NASM, bez autora i daty — przeczytane 02.11.2026 | 4 — organizacja szkoląca (jak w `cues.json`) |
| `nasm-barbell-deadlift` (istniejące) | wg `cues.json` | NASM | — | 4 (tylko obok, przy uproszczeniu) |
| `exrx-ErectorSpinae/BBSumoDeadlift`, `sbs-how-to-deadlift` (istniejące) | wg `cues.json` | ExRx.net, Stronger by Science | — | 4 — miejsca jak w karcie `Sumo Deadlift`; w tej sesji nie czytane ponownie (ExRx 403), użyte tylko przez uproszczenie |
| `elitefts-pull-through` (kandydat, nieużyte) | https://elitefts.com/blogs/training/pull-through | EliteFTS | Dave Tate, 24.07.2012; kwalifikacji brak na stronie (założyciel serwisu, trójboista) | **do oceny koordynatora** — wg reguły „autor z kwalifikacjami w biogramie” raczej 5 |
| `setforset-cable-pull-through` (odrzucone) | https://www.setforset.com/blogs/news/cable-pull-through | Set For Set | Sam Coleman, współzałożyciel; strona promuje własną aplikację z trenerem AI | **nie źródło** (precedens Speediance: producent z własną aplikacją). Dotyczy też `setforset-banded-good-mornings` z W1 |
| `tc-pulling-through` (odrzucone) | https://training-conditioning.com/article/pulling-through-d4/ | Training & Conditioning | brak autora; kroki przypisane cytowanemu trenerowi (NASM CPT), 15.03.2018 | 5 — trener cytowany, autor nieznany |
| `prehab-hip-hinge-pull-through-band` (odrzucone) | https://theprehabguys.com/vimeo-video/hip-hinge-pull-through-band-2/ | The Prehab Guys | bez autora; 17.05.2020, akt. 16.09.2021 | 5 — strona bez autora (W1, leg_isolation) |
| `rogue-banded-good-mornings` (odrzucone) | https://www.roguefitness.com/theindex/movement/how-to-do-banded-good-mornings | Rogue | tylko film, bez tekstu | nie do użycia (brak tekstu do cytowania) |

## Otwarte

- **Stiff-Legged Barbell Deadlift — punkt startu i `rdl.depth`**: Coach — z podłogi (gdy gibkość pozwala), głębokość wg tyłu uda; ISSA — od
  pozycji stojącej, zwykle do sztangi tuż pod kolanami. `rdl.depth` otwarte; karta nie podaje punktu startu.
- **Smith Machine SLDL**: brak źródła szczebla 4 o maszynie Smitha w tym ćwiczeniu; karta = uproszczenie.
- **Deficit Deadlift — `def.knees`, `def.low`**: tylko BarBend; „Too Deep of a Deficit” — tylko BarBend.
- **Sumo Deadlift (kettlebell)**: brak przeczytanego źródła szczebla 4 wprost o wersji sumo z kettlebellem (Onnit = 5; Body-Solid —
  adres prowadzi do innej strony; Kettlebell Kings — 402; Prehab Guys — bez autora).
- **Cable Pull Through**: `pt.setup`, `pt.move` — BarBend + kandydat EliteFTS (D. Tate, kwalifikacje nie podane — do oceny);
  `hinge.back` i `mis.roundBack` — tylko BarBend (Tate nie mówi o plecach). Nawet po uznaniu EliteFTS karta nie ma błędu → otwarta.
  NASM `cable-pull-through` — 404; ACE, ISSA — brak strony w wynikach.
- **Rack Pull**: nadal tylko BarBend; wyniki wyszukiwania bez strony szczebla 4 (sprzedawcy, aplikacje, blogi).
- **Band Good Morning**: `setforset-banded-good-mornings` traci status (własna aplikacja na stronie, jak Speediance) → 0 źródeł szczebla 4.
  `gm.move`, `hinge.back`, `mis.roundBack` dałoby się wziąć z karty `Good Morning` (wariant sprzętu), ale ustawienia gumy nie potwierdza
  żadne źródło szczebla 4 (Rogue — tylko film). Do korekty pliku W1 (koordynator).
- **Good Morning off Pins**: bez zmian względem W1 (ocena strony J. Stoppaniego).
- **Single Arm RDL (hantel/linka)**: ciężar w jednej ręce dodaje pracę przeciw skrętowi — nie traktuję jako wariantu sprzętu
  `RDL (hantle/linki)`; brak źródła szczebla 4.
