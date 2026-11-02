# Wskazówki techniki — fala W2, rodzina `calf_raise` (wspięcia na palce)

Data: 02.11.2026 · Rodzina: `calf_raise` · **Status: PROPOZYCJA** · Autor: badacz-merytoryczny (fala W2)

Podstawa: brief W2 G4; stan po W1 — gałąź badania/g4-nogi, plik `w1/przeliczenie-szczebli-2026-11-02.md` (sekcja calf_raise, „Blok do wdrożenia (po przeliczeniu 02.11.2026)”) i `w1/calf_raise.md`; szczeble — `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211). Rodzina ma pozy v2 (`lib/figures/v2/poses/calf_raise.json`, 12 ćwiczeń) → karta wchodzi tylko z ≥ 1 błędem.

Nowe w W2: **ISSA** (organizacja szkoląca i certyfikująca trenerów; szczebel 4 przy artykule firmowanym „ISSA” z datą — szczeble-organizacji, wiersz ISSA). Dwa artykuły ISSA = jedno źródło. Razem z ACE i NASM (W1) daje drugie niezależne źródło dla wersji stojących, jednonóż i siedzących.

Uwaga do rysunków (sprawdzone w `calf_raise.json`, pole `sprzet`): podest (`skrzynia`) mają Smith, sztanga, jednonóż i wszystkie wersje siedzące; z podłogi — tylko linki (`wyciag`) i guma. Dlatego wersje z podestem dostają `calf.edge`/`calf.move` (rozciągnięcie poniżej palców), a linki — `calf.rise` (bez rozciągnięcia; uwaga W1 o `calf.move` przy wersjach z podłogi).

## 1. Ćwiczenia

Poza zakresem (karta własna `own`): Standing Calf Raise, Łydki na stopniu, Seated Calf Raise, Calf Press (leg press).

| Ćwiczenie | Poza v2 | Stan | Co dodano w W2 | Brak |
|---|---|---|---|---|
| Smith Machine Calf Raise | tak | gotowe z błędem (uproszczenie: wariant sprzętu wspięć stojąc na podeście) | ISSA zamiast Major Fitness (5): `calf.edge`, `calf.move`, `calf.knees`, `calf.pause`, `calf.mis.partial` | — |
| Calf Raise (sztanga) | tak | gotowe z błędem (uproszczenie: wariant sprzętu wspięć stojąc na podeście) | karta jak Smith; `calf.knees` ACE 51 + ISSA (brzmienie „proste lub lekko ugięte” zgodne z obu) | ustawienie sztangi na plecach (`sq.bar`) — otwarte |
| Calf Raise (linki) | tak | gotowe z błędem (uproszczenie: wariant sprzętu wspięć stojąc z podłogi) | `calf.stand` (nowe), `calf.rise`, `calf.knees`, `calf.pause`, `calf.mis.partial` | ustawienie wyciągu i uchwytów — otwarte |
| Single Leg Calf Raise | tak | gotowe z błędem (uproszczenie: wariant jednonóż wspięć na podeście) | `calf.stepOne` (nowe brzmienie, bez podpory), `calf.move`, `calf.knees`, `calf.pause`, `calf.mis.partial`, `calf.mis.otherLeg` (nowe; źródło + wniosek) | podpora dla równowagi — otwarte |
| Seated Calf Raise (hantle) | tak | gotowe z błędem (uproszczenie: wariant sprzętu Seated Calf Raise na maszynie) — do akceptacji koordynatora, pkt 6 | `calf.seatedEdge` (nowe), `calf.move`, `calf.pause`, `calf.mis.partial` | położenie ciężaru na kolanach — otwarte |
| Barbell Seated Calf Raise | tak | jak wyżej | jak wyżej | jak wyżej |
| Dumbbell Seated One-Leg Calf Raise | tak | jak wyżej (+ uproszczenie: jedna noga) | jak wyżej | jak wyżej |
| Band Calf Raise | tak | gotowe z błędem (W1, bez zmian) | — (blok W1 przeniesiony) | wariant zaczepienia gumy — otwarte (W1) |
| Donkey Calf Raise | tak | otwarte | — | brak źródła szczebla ≤ 4 dla pozycji w zgięciu bioder (NFPT „Guest” = 5); to nie tylko inny sprzęt, więc bez uproszczenia |
| Smith Machine Reverse Calf Raise | nie | otwarte — błędna rodzina | — | patrz pkt 6 |

### Blok do wdrożenia

```json
{
 "Smith Machine Calf Raise": {
  "setup": [
   {"c": "calf.edge", "s": [
    ["issa-top6-calves", "Elevated Calf Raises („heels of both feet hanging off the edge of the platform”; uproszczenie: wariant sprzętu — wspięcia stojąc na podeście)"],
    ["nasm-calf-blog", "The Exercise Menu („Standing calf raise (machine, smith, or dumbbell on a step)”); Technique Standards (pięty poniżej palców)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["issa-top6-calves", "Elevated Calf Raises (opuszczanie „until the heels are slightly below the raised platform”)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything"]
   ]}
  ],
  "tips": [
   {"c": "calf.knees", "s": [
    ["issa-25min-calves", "Standing Calf Raise („Keep your legs straight without locking out your knees completely.”)"],
    ["ace-51", "opis („Keep a slight bend in knees”; wariant: sztanga)"]
   ]},
   {"c": "calf.pause", "s": [
    ["issa-top6-calves", "Standing Calf Raises („…with a slight pause at the top of the contraction.”)"],
    ["ace-51", "opis („Pause at the top, and slowly roll the heels back down”; wariant: sztanga)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (szybkie, niepełne powtórzenia jako częsty błąd)"],
    ["issa-top6-calves", "Elevated Calf Raises (standard: wspięcie z pauzą na górze i opuszczenie pięt poniżej podestu; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 },
 "Calf Raise (sztanga)": {
  "setup": [
   {"c": "calf.edge", "s": [
    ["issa-top6-calves", "Elevated Calf Raises (uproszczenie: wariant sprzętu — wspięcia stojąc na podeście); ISSA 25-min: obciążenie „place a barbell on your back”"],
    ["nasm-calf-blog", "The Exercise Menu; Technique Standards (pięty poniżej palców; wariant: maszyna/Smith/hantle)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["issa-top6-calves", "Elevated Calf Raises („until the heels are slightly below the raised platform”)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything"]
   ]}
  ],
  "tips": [
   {"c": "calf.knees", "s": [
    ["ace-51", "opis („Keep a slight bend in knees”)"],
    ["issa-25min-calves", "Standing Calf Raise („Keep your legs straight without locking out your knees completely.”)"]
   ]},
   {"c": "calf.pause", "s": [
    ["ace-51", "opis („Pause at the top, and slowly roll the heels back down”)"],
    ["issa-top6-calves", "Standing Calf Raises (slight pause at the top)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (szybkie, niepełne powtórzenia)"],
    ["issa-top6-calves", "Elevated Calf Raises (standard pełnego zakresu; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 },
 "Calf Raise (linki)": {
  "setup": [
   {"c": "calf.stand", "s": [
    ["ace-51", "opis („toes pointed forward”; uproszczenie: wariant sprzętu — sztanga)"],
    ["issa-top6-calves", "Standing Calf Raises („toes pointed forward and a straight knee”)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["ace-51", "opis („press the toes into the ground while lifting the heels up”; „slowly roll the heels back down to the floor”)"],
    ["issa-25min-calves", "Standing Calf Raise („slowly raise your heels off the ground”; obciążenie trzymane przy bokach)"]
   ]}
  ],
  "tips": [
   {"c": "calf.knees", "s": [
    ["ace-51", "opis („Keep a slight bend in knees”)"],
    ["issa-25min-calves", "Standing Calf Raise („Keep your legs straight without locking out your knees completely.”)"]
   ]},
   {"c": "calf.pause", "s": [
    ["ace-51", "opis („Pause at the top…”)"],
    ["issa-top6-calves", "Standing Calf Raises (slight pause at the top)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (szybkie, niepełne powtórzenia; wariant: na podeście)"],
    ["ace-51", "opis (pełne wspięcie i opuszczenie pięt do podłogi; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 },
 "Single Leg Calf Raise": {
  "setup": [
   {"c": "calf.stepOne", "s": [
    ["issa-top6-calves", "Single-Leg Calf Raises (także „on … an elevated platform”); Elevated Calf Raises (pięty poza krawędzią)"],
    ["ace-73", "Exercise Variation (1): Single-leg Calf Raise („bend your left knee to lift your left foot off the floor”; wariant: z podłogi)"],
    ["nasm-calf-blog", "The Exercise Menu („dumbbell on a step”; wariant: obunóż)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["issa-top6-calves", "Elevated Calf Raises („until the heels are slightly below the raised platform”; uproszczenie: wariant jednonóż)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything (wariant: obunóż)"]
   ]}
  ],
  "tips": [
   {"c": "calf.knees", "s": [
    ["ace-73", "Step 2 („keeping your knees extended”); Variation (1)"],
    ["issa-top6-calves", "Standing Calf Raises („a straight knee”)"]
   ]},
   {"c": "calf.pause", "s": [
    ["ace-73", "Step 2–3 („Hold your raised position briefly.”; „slowly lower your heels”)"],
    ["issa-top6-calves", "Standing Calf Raises (slight pause at the top)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything"],
    ["issa-top6-calves", "Elevated Calf Raises (standard pełnego zakresu; błąd = zaprzeczenie standardu)"]
   ]},
   {"c": "calf.mis.otherLeg", "s": [
    ["issa-top6-calves", "Single-Leg Calf Raises (cel: „so that the opposite leg doesn't take over”)"],
    ["wniosek", "calf.stepOne"]
   ]}
  ]
 },
 "Seated Calf Raise (hantle)": {
  "setup": [
   {"c": "calf.seatedEdge", "s": [
    ["issa-top6-calves", "Seated Calf Raises („Heels should be hanging with the balls of the feet pressing into the foot platform on the machine.”; uproszczenie: wariant sprzętu — maszyna)"],
    ["pmc-10753835", "Methods, Participants and overview („seated/knee 90°-flexed position”); ryc. 1 (zakres od 20° zgięcia grzbietowego — pięty niżej niż palce; parafraza)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["pmc-10753835", "ryc. 1 (zakres od 20° zgięcia grzbietowego do 30° podeszwowego, kolano 90°; parafraza)"],
    ["issa-25min-calves", "Seated Calf Raise („let your heels drop below the foot platform”; uproszczenie: wariant sprzętu — maszyna)"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["issa-25min-calves", "Seated Calf Raise („squeeze the back of the legs at the top of the motion”)"],
    ["ace-51", "opis (pauza na górze, powolne opuszczanie; wariant: stojąc)"],
    ["pmc-10753835", "Methods, Training program (2 s opuszczania; parafraza)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (wariant: stojąc)"],
    ["issa-25min-calves", "Seated Calf Raise (standard: pięty poniżej podestu, napięcie na górze; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 },
 "Barbell Seated Calf Raise": {
  "setup": [
   {"c": "calf.seatedEdge", "s": [
    ["issa-top6-calves", "Seated Calf Raises (pięty poza podestem; uproszczenie: wariant sprzętu — maszyna)"],
    ["pmc-10753835", "Methods („seated/knee 90°-flexed position”); ryc. 1 (parafraza)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["pmc-10753835", "ryc. 1 (zakres zgięcia grzbietowego i podeszwowego w siadzie; parafraza)"],
    ["issa-25min-calves", "Seated Calf Raise („let your heels drop below the foot platform”)"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["issa-25min-calves", "Seated Calf Raise (squeeze at the top)"],
    ["ace-51", "opis (wariant: stojąc)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (wariant: stojąc)"],
    ["issa-25min-calves", "Seated Calf Raise (standard pełnego zakresu; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 },
 "Dumbbell Seated One-Leg Calf Raise": {
  "setup": [
   {"c": "calf.seatedEdge", "s": [
    ["issa-top6-calves", "Seated Calf Raises (uproszczenie: wariant sprzętu — maszyna; wariant: obunóż)"],
    ["pmc-10753835", "Methods („seated/knee 90°-flexed position”, trening jednej nogi w siadzie); ryc. 1 (parafraza)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["pmc-10753835", "ryc. 1 (parafraza)"],
    ["issa-25min-calves", "Seated Calf Raise („let your heels drop below the foot platform”)"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["issa-25min-calves", "Seated Calf Raise (squeeze at the top)"],
    ["ace-51", "opis (wariant: stojąc)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (wariant: stojąc)"],
    ["issa-25min-calves", "Seated Calf Raise (standard pełnego zakresu; błąd = zaprzeczenie standardu)"]
   ]}
  ]
 },
 "Band Calf Raise": {
  "setup": [{"c": "calf.band", "s": [["bodylastics-standing-calf-raise-flat-bands", "Setup (uchwyt w każdej dłoni, tułów wyprostowany)"], ["theraband-ankle-calf-raise-standing", "Step One–Two (guma pod przednią częścią stóp, końce w dłoniach przy biodrach)"]]}],
  "move": [{"c": "calf.rise", "s": [["bodylastics-standing-calf-raise-flat-bands", "Movement („as high on your toes as you can go”; „Lower your heels back to the floor under control.”)"], ["theraband-ankle-calf-raise-standing", "Step Three–Four"]]}],
  "tips": [{"c": "calf.pause", "s": [["theraband-ankle-calf-raise-standing", "Step Four („Hold and slowly return.”)"], ["ace-51", "opis (wariant: sztanga)"]]}],
  "mistakes": [{"c": "calf.mis.partial", "s": [["nasm-calf-blog", "Technique Standards That Change Everything (wariant: stojąc na podeście)"], ["bodylastics-standing-calf-raise-flat-bands", "Movement (pełne wspięcie i opuszczenie pięt; błąd = zaprzeczenie standardu)"]]}]
 }
}
```

Uwaga do `ace-51`: strona nie ma numerowanych kroków (odczyt 02.11.2026 — jeden akapit instrukcji), dlatego miejsce „opis”, jak w istniejącym wpisie Standing Calf Raise; W1 pisał „Step 6” — do ujednolicenia przy integracji.

## 2. Nowe zdania

| id | PL | EN | Uzasadnienie |
|---|---|---|---|
| `calf.stand` | Stań prosto, palce stóp skierowane do przodu. | Stand tall with your toes pointing forward. | Ustawienie wersji stojącej z podłogi (linki); ACE 51 + ISSA. Obracanie stóp do środka/na zewnątrz źródła podają jako odmianę z uzasadnieniem mięśniowym — nie wpisuję (W1 pkt 5). |
| `calf.stepOne` | Stań jedną stopą na krawędzi stopnia, pięta poza krawędzią. | Stand on one foot on the edge of a step, heel hanging off. | Brzmienie W1 skrócone o „przytrzymaj się czegoś” — podpora ma tylko ACE 73 (pkt 4). |
| `calf.seatedEdge` | Usiądź z ugiętymi kolanami, przód stóp oprzyj na podwyższeniu, pięty poza krawędzią. | Sit with your knees bent, the balls of your feet on a raised edge and your heels hanging off. | Wersje siedzące (rysunki z ławką i podestem); bez wzmianki o ciężarze na kolanach (tylko szczebel 5). |
| `calf.mis.otherLeg` | Pomaganie sobie drugą nogą. | Letting the other leg help. | Single Leg: ISSA jawnie + wniosek z `calf.stepOne`; widać na rysunku (druga stopa na podeście/podłodze). |

`calf.rise`, `calf.band` — z W1 (jeszcze nie w `lib/cues/text/pl.json`), bez zmian.

## 3. Źródła

| id | adres | organizacja | autor / data | szczebel |
|---|---|---|---|---|
| `issa-top6-calves` (nowe) | https://www.issaonline.com/blog/post/top-six-exercises-for-building-bigger-calves | ISSA | „By ISSA”, 05.02.2024 (firmowane, data na stronie); odczyt 02.11.2026 | 4 — organizacja szkoląca trenerów, treść firmowana z datą (szczeble-organizacji, wiersz ISSA) |
| `issa-25min-calves` (nowe) | https://issaonline.com/blog/post/25-minute-calf-workout | ISSA | firmowane ISSA, 05.02.2024; odczyt 02.11.2026 | 4 — ta sama organizacja co wyżej: oba ISSA liczą się jako JEDNO źródło (w blokach nigdy razem jako para) |
| `ace-51` (istniejące) | https://www.acefitness.org/resources/everyone/exercise-library/51/calf-raises/ | ACE | biblioteka firmowana ACE; odczyt 02.11.2026 | 4 |
| `ace-73` (istniejące) | https://www.acefitness.org/resources/everyone/exercise-library/73/standing-calf-raises-wall/ | ACE | jw.; odczyt 02.11.2026 (Step 1–3, Variation 1–2) | 4 (ta sama organizacja co `ace-51`) |
| `nasm-calf-blog` (istniejące) | https://www.nasm.org/resource-center/blog/training/calf-training-how-to-program-this-stubborn-muscle-group-for-clients | NASM | H. Cherry, akt. 25.07.2026; odczyt W1 02.11.2026 | 4 |
| `pmc-10753835` (istniejące) | https://pmc.ncbi.nlm.nih.gov/articles/PMC10753835/ | Kinoshita i in., Front Physiol 2023 | odczyt 02.11.2026 (Methods; ryc. 1–2) | 3 — recenzowane badanie |
| `bodylastics-standing-calf-raise-flat-bands`, `theraband-ankle-calf-raise-standing` | jak w W1 | Bodylastics, Performance Health | jak w W1 | 4 tylko dla gum |

Do `cues.json`: nowa organizacja `"ISSA": {"name": "ISSA — organizacja szkoląca i certyfikująca trenerów (blog firmowany)", "level": 4}` i oba źródła z `level: 4`.

Pominięte w W2 (szczebel 5 albo nie źródło): Major Fitness (5, przeliczenie W1), Body-Solid — strona „Seated Calf Raise” to serwis i konserwacja, bez instrukcji (odczyt 02.11.2026); wyniki wyszukiwania będące stronami aplikacji treningowych, Fitness Volt, Muscle & Strength (403), serwis ze strumieniami treningów z własną aplikacją — pominięte bez wpisu.

## 4. Otwarte

- **Wersje siedzące — ustawienie (do akceptacji koordynatora):** krawędź podestu i pięty poza nią podaje wprost tylko ISSA (maszyna); Kinoshita i in. (szczebel 3) potwierdza siad z kolanem 90° i zakres od 20° zgięcia grzbietowego, z którego wynika opuszczenie pięt poniżej palców — to parafraza, nie zdanie wprost (strona nie mówi, gdzie stoi przód stopy). Jeśli koordynator nie uzna tego za drugie źródło: trzy wersje siedzące → „częściowe” (ISSA = jedno źródło).
- **Ciężar na kolanach** (hantle/sztanga/hantel na jednym kolanie) — tylko Physitrack/Prehab (5). Nie wpisane.
- **Podpora dla równowagi przy jednej nodze** — ACE 73 („Use your hands on the wall to support your body”) jedyne przeczytane źródło ≤ 4; wpis ExRx w `cues.json` (Łydki na stopniu) dziś 403, nie odczytany ponownie.
- **Sztanga — położenie na plecach** (`sq.bar`): ACE 51 w całości („rests behind the neck across the top of the back”, chwyt tuż za barkami, zejście ze stojaka); ISSA 25-min tylko „place a barbell on your back” → chwyt i stojak — jedno źródło.
- **Linki — ustawienie przy wyciągu** (uchwyty z dolnych bloczków) — brak źródła ≤ 4; karta opisuje wspólną część wspięcia stojąc (uproszczenie).
- **Donkey Calf Raise** — bez źródła szczebla ≤ 4 (W1); pozycja w zgięciu bioder to inna pozycja ciała niż wspięcie stojąc, więc nie stosuję uproszczenia wariantu sprzętu.
- **Smith Machine Reverse Calf Raise** — w katalogu notatka „Toe raise with heels on a platform” (W1): unoszenie palców przy opartych piętach, inny ruch i inne mięśnie (przód podudzia). Zestaw `calf` nie pasuje; potrzebna osobna rodzina albo osobne zdania. Nie badane (polecenie koordynatora).
- **`calf.mis.bounce`** — nadal tylko NASM (W1).
- **ACE 51 a podest przy sztandze:** ACE opisuje wersję z podłogi („squarely set on the floor”), rysunek ma podest — karta korzysta ze źródeł wersji na podeście (ISSA, NASM) jako uproszczenie; ACE służy tylko do `calf.knees`/`calf.pause`, które nie zależą od podestu.
- Role mięśni: luk W1 dla tej rodziny brak — pliku ról nie tworzę.
