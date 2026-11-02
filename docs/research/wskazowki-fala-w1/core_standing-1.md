# Wskazówki techniki — fala W1, rodzina core_standing (część 1)

Data: 02.11.2026. Zakres: tylko zebranie danych (bez zmian w kodzie, `data/zrodla/*.json`, `lib/**`, testach).
Metoda: `docs/research/27-wskazowki-zrodla.md`, `docs/research/33-wskazowki-partia2.md`; wyjątek dla wskazówek techniki z CLAUDE.md
(2 niezależne źródła szczebla 4 z różnych organizacji na każde zdanie; wariant sprzętowy liczy się z opisem „(wariant: …)”).
Wszystkie źródła przeczytane 02.11.2026 (WebFetch). Strony aplikacji treningowych nie są źródłem (uzupełnienie briefu koordynatora) —
odrzucone mimo trafień w wyszukiwarce. Miejsce „opis” = jedyny akapit instrukcji na stronie.

## 1. Tabela

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Cable Woodchop | gotowe | 4 | 4 nowe zdania; zestaw ogólny (`chop.close`, `plank.brace`, `rt.control`, `mis.jerk`) niepotwierdzony — „otwarte” |
| Landmine Rotation | gotowe | 2 | 2 nowe zdania; krótka karta (brak potwierdzonego błędu); `rt.control`, `plank.brace`, `mis.jerk` niepotwierdzone |
| Kettlebell Windmill | gotowe | 6 | `wm.arm`, `wm.eyes` potwierdzone; 4 nowe zdania; `mis.jerk` niepotwierdzone |
| Side Bend (hantel) | otwarte | 0 | jedno źródło spoza stron aplikacji (ISSA) |
| Barbell Side Bend | otwarte | 0 | brak przeczytanego źródła szczebla 4 |
| Pallof Press With Rotation | nie zaczęte | — | limit kontekstu |
| Cable Russian Twists | nie zaczęte | — | limit kontekstu |
| Medicine Ball Full Twist | nie zaczęte | — | limit kontekstu |
| Bent Press | nie zaczęte | — | limit kontekstu; uwaga: to inne ćwiczenie niż windmill (wyciskanie w skłonie) |

## 2. JSON do `exercises`

```json
{
  "Cable Woodchop": {
    "setup": [
      {"c": "core_standing.woodchop.setup", "s": [
        ["ace-340", "opis („Place a cable pulley at the highest position, attach a rope handle”; wyciąg z boku ciała; wariant: w klęku)"],
        ["iom-lx48264v", "opis („Standing at an angle to the cable cross machine and holding a single cable in both hands”)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.woodchop.move", "s": [
        ["ace-340", "opis (linka w dół „in front of the left hip”, potem „slowly reversing the motion”; wariant: w klęku)"],
        ["iom-lx48264v", "opis („perform a chopping motion high to low”)"],
        ["lifetime-wood-chop", "kroki („Lower the dumbbell down and across your body”, do zewnętrznej strony biodra; „powerful yet controlled”; wariant: hantel)"]
      ]}
    ],
    "tips": [
      {"c": "core_standing.woodchop.trunk", "s": [
        ["iom-lx48264v", "opis („initiating the movement from the torso and obliques”)"],
        ["lifetime-wood-chop", "Common Mistakes → Doing too little („using only your arms to lift and lower the weight”; wariant: hantel)"],
        ["ace-108", "Step 6 (biodra obracają się razem z rękami; wariant: piłka lekarska)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.woodchop.mis.arch", "s": [
        ["lifetime-wood-chop", "Common Mistakes → Doing too much („arching your back as you raise the weight”; wariant: hantel)"],
        ["ace-108", "Step 2 (łopatki w dół i w tył „without arching your low back”; wariant: piłka lekarska)"]
      ]}
    ]
  },
  "Landmine Rotation": {
    "setup": [
      {"c": "core_standing.landmine.setup", "s": [
        ["dynamo-landmine-180", "kroki („Adopt a wide stance”; koniec sztangi oburącz „with both hands and arms extended in front of you”)"],
        ["herts-landmine-rotation", "kroki („extended arms above your head with the barbell in your hands, with a wide stance for balance”)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.landmine.move", "s": [
        ["dynamo-landmine-180", "kroki („rotating your trunk and hips as you swing the weight all the way down to one side”; „Keep your arms extended throughout”)"],
        ["herts-landmine-rotation", "kroki („Using your core and hips, rotate the bar to one side, while keeping your arms extended.”)"]
      ]}
    ]
  },
  "Kettlebell Windmill": {
    "setup": [
      {"c": "core_standing.windmill.setup", "s": [
        ["catalyst-522", "opis („Stand with a shoulder-width or slightly wider stance and hold a dumbbell or kettlebell overhead with one arm.”)"],
        ["lifetime-kb-windmill", "kroki (stopy obrócone od strony ręki z kettlebellem, „angling them about 45 degrees”; kettlebell wyciśnięty nad głowę)"],
        ["mti-1321", "opis („Take a wide stance with the one toe slightly pointed out.”; kettlebell w ręce po przeciwnej stronie)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.windmill.move", "s": [
        ["catalyst-522", "opis („push the hips back and toward the side holding the weight”; wolna dłoń do podłogi po wewnętrznej stronie przeciwnej stopy)"],
        ["mti-1321", "opis („Slide your hand down your leg starting at the inside of your leg, pushing your hips back”)"],
        ["lifetime-kb-windmill", "kroki (dolna ręka wzdłuż wewnętrznej strony przedniej nogi, powrót do stania)"]
      ]}
    ],
    "tips": [
      {"c": "wm.arm", "s": [
        ["catalyst-522", "opis („rotating the trunk to keep the loaded arm straight up”)"],
        ["lifetime-kb-windmill", "wskazówki (górna ręka wyprostowana, łokieć zablokowany, sięga do sufitu)"],
        ["mti-1321", "opis („Lock out kettlebell in the opposite arm”)"]
      ]},
      {"c": "wm.eyes", "s": [
        ["lifetime-kb-windmill", "wskazówki („Keep your eyes on the kettlebell.”)"],
        ["mti-1321", "opis („Keep your eyes on the kettlebell.”)"]
      ]},
      {"c": "core_standing.windmill.knees", "s": [
        ["catalyst-522", "opis („Keeping the knees close to straight”)"],
        ["lifetime-kb-windmill", "kroki (lekko ugięte kolano — „soft bend”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.windmill.mis.elbow", "s": [
        ["lifetime-kb-windmill", "Common Mistakes (uginanie łokcia górnej ręki)"],
        ["catalyst-522", "opis (ręka z ciężarem „straight up” przez cały ruch)"],
        ["mti-1321", "opis („Lock out kettlebell”)"]
      ]}
    ]
  }
}
```

## 3. Nowe zdania

| id | PL | EN |
|---|---|---|
| core_standing.woodchop.setup | Stań bokiem do wyciągu ustawionego wysoko i chwyć uchwyt oburącz. | Stand side-on to a high cable and grip the handle with both hands. |
| core_standing.woodchop.move | Prowadź uchwyt ukośnie w dół przez ciało do biodra po drugiej stronie, potem pod kontrolą wróć do góry. | Pull the handle diagonally down across your body to the opposite hip, then return to the top under control. |
| core_standing.woodchop.trunk | Ruch zaczynaj tułowiem — ręce tylko trzymają uchwyt, nie ciągną same. | Start the movement with your torso — your arms just hold the handle, they don't do the pulling. |
| core_standing.woodchop.mis.arch | Wyginanie pleców w łuk przy unoszeniu ciężaru. | Arching your back as the weight goes up. |
| core_standing.landmine.setup | Stań szeroko i unieś koniec sztangi oburącz na prostych rękach. | Take a wide stance and lift the end of the bar with both hands, arms straight. |
| core_standing.landmine.move | Prowadź koniec sztangi łukiem z jednego boku na drugi, obracając tułów; ręce cały czas proste. | Swing the end of the bar in an arc from one side to the other by rotating your torso; keep your arms straight throughout. |
| core_standing.windmill.setup | Stopy mniej więcej na szerokość barków, palce odwrócone od ręki z ciężarem; kettlebell trzymaj nad głową na prostej ręce. | Feet about shoulder-width apart, toes turned away from the loaded arm; hold the kettlebell overhead on a straight arm. |
| core_standing.windmill.move | Wypchnij biodra w tył, w stronę ręki z ciężarem, i zsuwaj wolną dłoń po wewnętrznej stronie przeciwnej nogi w dół; wróć tą samą drogą. | Push your hips back toward the loaded side and slide your free hand down the inside of the opposite leg; come back up the same way. |
| core_standing.windmill.knees | Nogi prawie proste — kolana tylko lekko ugięte. | Legs nearly straight — just a soft bend in the knees. |
| core_standing.windmill.mis.elbow | Uginanie łokcia ręki z ciężarem. | Bending the elbow of the arm holding the weight. |

## 4. Nowe źródła

| id | adres | organizacja | szczebel |
|---|---|---|---|
| ace-340 | https://www.acefitness.org/resources/everyone/exercise-library/340/kneeling-wood-chop/ | ACE (Kneeling Wood Chop #340) | 4 |
| ace-108 | https://www.acefitness.org/resources/everyone/exercise-library/108/standing-wood-chop/ | ACE (Standing Wood Chop #108) | 4 |
| iom-lx48264v | https://platform.instituteofmotion.com/library/activity/lx48264v | Institute of Motion (LLT Cable Cross – High to Low Chop) | 4 |
| lifetime-wood-chop | https://experiencelife.lifetime.life/article/how-to-do-the-wood-chop/ | Life Time, „Experience Life” (M. Fazeli Fard, 20.12.2024) | 4 |
| dynamo-landmine-180 | https://blog.dynamofitness.com.au/?p=2716 | Dynamo Fitness (producent sprzętu; Landmine 180) | 4 |
| herts-landmine-rotation | https://performanceherts.co.uk/news-exercise-of-the-month-1352 | Performance Herts, Hertfordshire Sports Village (Uniwersytet Hertfordshire; „Exercise of the month”) | 4 |
| catalyst-522 | https://catalystathletics.com/exercise/522/Windmill | Catalyst Athletics (Windmill) | 4 |
| lifetime-kb-windmill | https://experiencelife.lifetime.life/article/the-kettlebell-windmill/ | Life Time, „Experience Life” (The Kettlebell Windmill) | 4 |
| mti-1321 | https://mtntactical.com/exercises/mnt1321-kettlebell-windmill/ | Mountain Tactical Institute (Kettlebell Windmill) | 4 |
| issa-planes-2024 | https://www.issaonline.com/blogs/training-tips/planes-of-motion-fontal-sagittal-and-transverse-exercises-and-benefits | ISSA (blog, 05.02.2024) — tylko do otwartych | 4 |

Uwagi: `ace-340` i `ace-108` to ta sama organizacja, `lifetime-*` też — w każdym zdaniu jest co najmniej jedno źródło z innej organizacji.
Miejsca w `lifetime-kb-windmill` opisane słownie (cytat dosłowny tylko przy `wm.eyes`); przy wdrożeniu warto doprecyzować nagłówki sekcji strony.

## 5. Otwarte

- **Cable Woodchop — możliwe błędy zestawu ogólnego** (`lib/figures/v2/cue-sets.json`, dziś `general`):
  - `chop.close` („Ciężar blisko ciała…”) — w wersji z wyciągiem ręce są wyciągnięte; „blisko ciała” mówi tylko ACE #108 o piłce w etapie 1 → niepotwierdzone dla tego ćwiczenia, możliwy błąd zestawu.
  - `plank.brace` — napięcie brzucha wprost tylko ACE #108 (jedna organizacja).
  - `rt.control`, `mis.jerk` — „kontrola” jest (ACE: „slowly”; Life Time: „powerful yet controlled”), ale Life Time zaleca ruch szybki („Quickly and with control”), więc „płynnie, bez rzucania” nie jest częścią wspólną.
  - Sprzeczność na tym samym szczeblu: ACE #340 (klęk) — górna część ciała nieruchomo („do not allow the upper body to move”); ACE #108, Life Time, Institute of Motion — obrót tułowia. Część wspólna w karcie: tor ukośny z góry do przeciwnego biodra, ruch prowadzi tułów.
  - Obrót tylnej stopy (ACE #108 etap 3, Life Time) — pominięty: u ACE dopiero w etapie zaawansowanym.
- **Landmine Rotation:** sprzeczność — Dynamo: obrót „trunk and hips”; Performance Herts: „Keep your hips facing forward”. Karta nie mówi o biodrach. Pozycja startowa: Dynamo na wysokości barków, Herts nad głową → w karcie „na prostych rękach” bez wysokości. Lekko ugięte kolana — tylko Herts (jedno źródło). Zestaw ogólny (`rt.control`, `plank.brace`, `mis.jerk`) — żadne przeczytane źródło tego wprost nie mówi → możliwy błąd zestawu.
- **Kettlebell Windmill:** szerokość stopy — Catalyst „shoulder-width or slightly wider”, MTI „wide stance”, Life Time: nie szerzej niż barki → w karcie „mniej więcej na szerokość barków”. Kąt stóp 45° — tylko Life Time (liczba, jedno źródło) → nie wpisany. „Windmill to nie skłon w bok” i „schodź tylko tak nisko, jak pozwala zakres” — tylko Life Time (MTI: „until you touch the floor or shoe” — inne ujęcie). `mis.jerk` z zestawu ogólnego — niepotwierdzone.
- **Side Bend (hantel):** przeczytane tylko ISSA (sekcja „Frontal Plane Exercises”: „Grab a single dumbbell and hold it at your side with your palm facing your thigh.”). Pozostałe trafienia to strony aplikacji (wyłączone). Zestaw ogólny `sb.plane` dla rodziny sideBend (np. Barbell Side Bend) dziś bez przeczytanego źródła w tej fali. Następny krok: szpitalne/uczelniane karty ćwiczeń z „lateral flexion with weight”, NSCA, producenci sprzętu.
- **Barbell Side Bend:** brak źródła; uwaga — w zestawie ogólnym `dyn.control` („zakres zwiększaj stopniowo”) to zdanie z rozgrzewki dynamicznej; do sprawdzenia, czy pasuje do ćwiczenia z obciążeniem.
- **Bent Press:** w zestawie ogólnym przypisany do rodziny `windmill` (`wm.eyes`); to osobne ćwiczenie (wyciśnięcie ciężaru przez „wejście pod niego” w skłonie) — przy badaniu sprawdzić, czy źródła potwierdzają `wm.eyes`.

## 6. Stan

- Zrobione (02.11.2026): Cable Woodchop, Landmine Rotation, Kettlebell Windmill (gotowe); Side Bend (hantel), Barbell Side Bend (otwarte — szukane, bez 2 źródeł).
- Zostało: Pallof Press With Rotation, Cable Russian Twists, Medicine Ball Full Twist, Bent Press; dokończenie Side Bend (hantel) i Barbell Side Bend.
- Następny krok: Pallof Press With Rotation — zacząć od `ace-332`, `mullane-2021`, `eleiko-659d665d` (już w cues.json; sprawdzić, czy opisują wariant z obrotem); Russian Twists — `ace-305`, `ace-65`, `nasm-russian-twist`, `issa-planes-2024` (sekcja „Top 4 Transverse Plane Exercises”) jako warianty.
- Pułapki: ExRx 403, archiwum zablokowane; NASM nie ma wpisu woodchop ani side bend (wyszukiwanie); strony Eleiko (inspire360) słabo indeksowane; wyszukiwarka zwraca głównie strony aplikacji — nie są źródłem; `sport.herts.ac.uk` przekierowuje na `performanceherts.co.uk`.
