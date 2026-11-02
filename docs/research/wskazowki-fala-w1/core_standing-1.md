# Wskazówki techniki — fala W1, rodzina core_standing (część 1)

Data: 02.11.2026. Zakres: tylko zebranie danych (bez zmian w kodzie, `data/zrodla/*.json`, `lib/**`, testach).
Metoda: `docs/research/27-wskazowki-zrodla.md`, `docs/research/33-wskazowki-partia2.md`; wyjątek dla wskazówek techniki z CLAUDE.md
(2 niezależne źródła szczebla 4 z różnych organizacji na każde zdanie; wariant sprzętowy liczy się z opisem „(wariant: …)”).
Wszystkie źródła przeczytane 02.11.2026 (WebFetch). Strony aplikacji treningowych nie są źródłem (uzupełnienie briefu koordynatora) —
odrzucone mimo trafień w wyszukiwarce. Miejsce „opis” = jedyny akapit instrukcji na stronie.

**Rozstrzygnięcie koordynatora linii 1.1 (02.11.2026) o szczeblach — zastosowane do całego pliku, także wyników sesji 1.**
Szczebel 4 = naraz: (a) organizacja szkoląca/certyfikująca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu;
(b) autor z datą albo treść jawnie firmowana przez organizację; (c) nie recenzja afiliacyjna ani marketing. Dwa serwisy jednego właściciela = jedno źródło.
Sieci siłowni/klubów = 5. Ocena każdego źródła — kolumna „szczebel i powód” w sekcji 4. Zdania z < 2 źródłami szczebla 4 i ćwiczenia z < 2 zdaniami przeniesione
do sekcji 5 (dane zachowane w bloku „Kandydaci wstrzymani — nie do wdrożenia”). Spójność z `core_standing-2.md`: Life Time = 5 (sekcja 7).

## 1. Tabela

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Cable Woodchop | gotowe | 3 | ACE + Institute of Motion (`setup`, `move`, `trunk`); `mis.arch` wstrzymane (Life Time — 5); zestaw ogólny (`chop.close`, `plank.brace`, `rt.control`, `mis.jerk`) niepotwierdzony — „otwarte” |
| Kettlebell Windmill | gotowe | 3 | ACE #386 + Catalyst #522 (`setup` w nowym brzmieniu, `move`, `wm.arm`); `knees`, `mis.elbow`, `wm.eyes` wstrzymane (Life Time i MTI — 5) |
| Side Bend (hantel) | gotowe | 2 | 2 nowe zdania (ISSA + Catalyst #497); `sb.plane` → otwarte (drugie źródło to sprzedawca — szczebel 5) |
| Landmine Rotation | otwarte | 0 | po rozstrzygnięciu: Dynamo Fitness i Performance Herts — szczebel 5 |
| Barbell Side Bend | otwarte | 0 | zostało 1 zdanie (`core_standing.sidebend.move`) — za mało na kartę |
| Pallof Press With Rotation | otwarte | 0 | obrót tylko Speediance (jedna organizacja); samo `pallof.setup` = 1 zdanie |
| Cable Russian Twists | otwarte | 0 | weighttraining.guide — szczebel 5; zostaje tylko ACE #65 (wariant bez wyciągu) |
| Medicine Ball Full Twist | otwarte | 0 | RDX — szczebel 5; zostaje tylko Intermountain Health; do tego sprawa katalogowa (ćwiczenie w parze) |
| Bent Press | otwarte | 0 | Breaking Muscle i Legendary Strength — szczebel 5 |

## 2. JSON do `exercises` (tylko gotowe, po korekcie 02.11.2026 — spójność Life Time)

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
        ["iom-lx48264v", "opis („perform a chopping motion high to low”)"]
      ]}
    ],
    "tips": [
      {"c": "core_standing.woodchop.trunk", "s": [
        ["iom-lx48264v", "opis („initiating the movement from the torso and obliques”)"],
        ["ace-108", "Step 6 (biodra obracają się razem z rękami; wariant: piłka lekarska)"]
      ]}
    ]
  },
  "Kettlebell Windmill": {
    "setup": [
      {"c": "core_standing.windmill.setup", "s": [
        ["catalyst-522", "opis („Stand with a shoulder-width or slightly wider stance and hold a dumbbell or kettlebell overhead with one arm.”)"],
        ["ace-386", "opis („Stand with the feet wider than shoulder-width apart, and hold a kettlebell in the left hand”; potem „pressing the kettlebell straight overhead”)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.windmill.move", "s": [
        ["catalyst-522", "opis („push the hips back and toward the side holding the weight”; wolna dłoń do podłogi po wewnętrznej stronie przeciwnej stopy)"],
        ["ace-386", "opis („sinking back into the left hip”; prawa ręka „along the inside of the right leg”; powrót: „push the hips forward”)"]
      ]}
    ],
    "tips": [
      {"c": "wm.arm", "s": [
        ["catalyst-522", "opis („rotating the trunk to keep the loaded arm straight up”)"],
        ["ace-386", "opis („Keeping the left arm straight during the movement.”)"]
      ]}
    ]
  },
  "Side Bend (hantel)": {
    "setup": [
      {"c": "core_standing.sidebend.setup", "s": [
        ["issa-planes-2024", "Frontal Plane Exercises → Side Bend („Grab a single dumbbell and hold it at your side with your palm facing your thigh.”; stopy na szerokość barków)"],
        ["catalyst-497", "opis („Stand with the feet hip to shoulder width and hold a weight in one arm at your side”)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.sidebend.move", "s": [
        ["catalyst-497", "opis („bend to one side as far as possible and then to the other with a controlled tempo”)"],
        ["issa-planes-2024", "Frontal Plane Exercises → Side Bend (hantel w dół wzdłuż nogi, potem „bend your upper body in the other direction”)"]
      ]}
    ]
  }
}
```

Uwaga do `core_standing.sidebend.move`: „powoli” — Catalyst („controlled tempo”); ISSA tempa nie podaje. Jeśli recenzent uzna to za element bez 2 źródeł, wersja bez tempa: „Skłoń się w bok, wróć do pionu i skłoń się w drugą stronę.”

### Kandydaci wstrzymani — nie do wdrożenia (dane zachowane; brak 2 źródeł szczebla 4)

```json
{
  "Cable Woodchop": {
    "move": [{"c": "core_standing.woodchop.move", "s": [["lifetime-wood-chop", "kroki („Lower the dumbbell down and across your body”, do zewnętrznej strony biodra; „powerful yet controlled”; wariant: hantel; szczebel 5 — dodatkowe źródło, zdanie i tak gotowe przez ACE + IoM)"]]}],
    "tips": [{"c": "core_standing.woodchop.trunk", "s": [["lifetime-wood-chop", "Common Mistakes → Doing too little („using only your arms to lift and lower the weight”; wariant: hantel; szczebel 5 — zdanie i tak gotowe)"]]}],
    "mistakes": [{"c": "core_standing.woodchop.mis.arch", "s": [["lifetime-wood-chop", "Common Mistakes → Doing too much („arching your back as you raise the weight”; wariant: hantel; szczebel 5)"], ["ace-108", "Step 2 (łopatki w dół i w tył „without arching your low back”; wariant: piłka lekarska)"]]}]
  },
  "Kettlebell Windmill": {
    "setup": [{"c": "core_standing.windmill.setup (brzmienie sprzed korekty: z „palce odwrócone od ręki z ciężarem”)", "s": [["lifetime-kb-windmill", "kroki (stopy obrócone od strony ręki z kettlebellem, „angling them about 45 degrees”; szczebel 5)"]]}],
    "move": [{"c": "core_standing.windmill.move", "s": [["lifetime-kb-windmill", "kroki (dolna ręka wzdłuż wewnętrznej strony przedniej nogi, powrót do stania; szczebel 5 — zdanie i tak gotowe)"]]}],
    "tips": [
      {"c": "wm.arm", "s": [["lifetime-kb-windmill", "wskazówki (górna ręka wyprostowana, łokieć zablokowany, sięga do sufitu; szczebel 5 — zdanie i tak gotowe)"]]},
      {"c": "core_standing.windmill.knees", "s": [["catalyst-522", "opis („Keeping the knees close to straight”)"], ["lifetime-kb-windmill", "kroki (lekko ugięte kolano — „soft bend”; szczebel 5)"]]},
      {"c": "wm.eyes", "s": [["ace-386", "opis („Turn to look up at the left hand”)"], ["lifetime-kb-windmill", "(szczebel 5)"], ["mti-1321", "(szczebel 5)"]]}
    ],
    "mistakes": [{"c": "core_standing.windmill.mis.elbow", "s": [["lifetime-kb-windmill", "Common Mistakes (uginanie łokcia górnej ręki; szczebel 5)"], ["catalyst-522", "opis (ręka z ciężarem „straight up” — wskazówka, nie błąd wprost)"], ["ace-386", "opis (ręka prosta — wskazówka, nie błąd wprost)"]]}]
  },
  "Landmine Rotation": {
    "setup": [{"c": "core_standing.landmine.setup", "s": [["dynamo-landmine-180", "kroki („Adopt a wide stance”)"], ["herts-landmine-rotation", "kroki („with a wide stance for balance”)"]]}],
    "move": [{"c": "core_standing.landmine.move", "s": [["dynamo-landmine-180", "kroki („Keep your arms extended throughout”)"], ["herts-landmine-rotation", "kroki („rotate the bar to one side, while keeping your arms extended”)"]]}]
  },
  "Barbell Side Bend": {
    "move": [{"c": "core_standing.sidebend.move", "s": [["catalyst-701", "opis („bend the trunk to one side as far as possible and then to the other with a controlled tempo”)"], ["issa-planes-2024", "Frontal Plane Exercises → Side Bend (wariant: hantel)"]]}],
    "tips": [{"c": "sb.plane", "s": [["catalyst-701", "opis („your hips and shoulders squared off facing forward”)"], ["dumbbellsdirect-side-bends", "Common Mistakes (szczebel 5)"]]}]
  },
  "Pallof Press With Rotation": {
    "setup": [{"c": "pallof.setup", "s": [["speediance-pallof-training", "Pallof Press with Rotation → Setup („Set up exactly as you would for the Standing Cable Pallof Press.”)"], ["ace-332", "opis (wariant: bez obrotu)"], ["mullane-2021", "s. 4 (wariant: bez obrotu)"]]}]
  },
  "Cable Russian Twists": {
    "setup": [{"c": "core_standing.cabletwist.setup", "s": [["ace-65", "opis („upper back on the ball”; wariant: bez wyciągu)"], ["wtg-cable-russian-twist", "Starting position (szczebel 5)"]]}],
    "move": [{"c": "core_standing.cabletwist.move", "s": [["ace-65", "opis („Twist through the stomach and shoulders”; wariant: bez wyciągu)"], ["wtg-cable-russian-twist", "Execution (szczebel 5)"]]}],
    "tips": [{"c": "core_standing.cabletwist.hips", "s": [["ace-65", "opis („with the hips up”)"], ["wtg-cable-russian-twist", "Comments and tips (szczebel 5)"]]}]
  },
  "Medicine Ball Full Twist": {
    "setup": [{"c": "core_standing.mbtwist.setup", "s": [["intermountain-mb-partner", "Back-to-back pass off („Stand back-to-back with your partner”)"], ["rdx-mb-pass", "(szczebel 5)"]]}],
    "move": [{"c": "core_standing.mbtwist.move", "s": [["intermountain-mb-partner", "Back-to-back pass off („rotate your body to the right to pass the ball off to your partner”)"], ["rdx-mb-pass", "(szczebel 5)"]]}],
    "tips": [
      {"c": "core_standing.mbtwist.feet", "s": [["intermountain-mb-partner", "(„With your feet planted to the ground”)"], ["rdx-mb-pass", "(„keep your legs still”; szczebel 5)"]]},
      {"c": "plank.brace", "s": [["intermountain-mb-partner", "(„your core tight”)"], ["rdx-mb-pass", "(„Contract your abs a bit”; szczebel 5)"]]}
    ]
  },
  "Bent Press": {
    "setup": [{"c": "core_standing.bentpress.setup", "s": [["breakingmuscle-bent-press-2", "(„Clean and side rack the bell.”; szczebel 5)"], ["legendary-bent-press", "(wariant: sztanga; szczebel 5)"]]}],
    "move": [
      {"c": "core_standing.bentpress.move", "s": [["breakingmuscle-bent-press-2", "(„Start to fall away”; „under” zamiast „up”; szczebel 5)"], ["legendary-bent-press", "(„you do not press out with the tricep”; szczebel 5)"]]},
      {"c": "core_standing.bentpress.stand", "s": [["breakingmuscle-bent-press-2", "(„standing up with the bell over your head”; szczebel 5)"], ["legendary-bent-press", "(przejście do „overhead squat”; szczebel 5)"]]}
    ]
  }
}
```

## 3. Nowe zdania

Do wdrożenia (ćwiczenia gotowe):

| id | PL | EN |
|---|---|---|
| core_standing.woodchop.setup | Stań bokiem do wyciągu ustawionego wysoko i chwyć uchwyt oburącz. | Stand side-on to a high cable and grip the handle with both hands. |
| core_standing.woodchop.move | Prowadź uchwyt ukośnie w dół przez ciało do biodra po drugiej stronie, potem pod kontrolą wróć do góry. | Pull the handle diagonally down across your body to the opposite hip, then return to the top under control. |
| core_standing.woodchop.trunk | Ruch zaczynaj tułowiem — ręce tylko trzymają uchwyt, nie ciągną same. | Start the movement with your torso — your arms just hold the handle, they don't do the pulling. |
| core_standing.windmill.setup | Stopy nieco szerzej niż barki; kettlebell trzymaj nad głową na prostej ręce. | Feet a little wider than shoulder-width; hold the kettlebell overhead on a straight arm. |
| core_standing.windmill.move | Wypchnij biodra w tył, w stronę ręki z ciężarem, i zsuwaj wolną dłoń po wewnętrznej stronie przeciwnej nogi w dół; wróć tą samą drogą. | Push your hips back toward the loaded side and slide your free hand down the inside of the opposite leg; come back up the same way. |
| core_standing.sidebend.setup | Stań w lekkim rozkroku i trzymaj hantel w jednej ręce przy boku. | Stand with your feet about shoulder-width apart, holding a dumbbell in one hand at your side. |
| core_standing.sidebend.move | Powoli skłoń się w bok, wróć do pionu i skłoń się w drugą stronę. | Slowly bend to one side, come back upright and bend to the other side. |

Uwaga do `core_standing.windmill.setup` (zmiana brzmienia 02.11.2026): poprzednie brzmienie („Stopy mniej więcej na szerokość barków, palce odwrócone od ręki z ciężarem; …”)
opierało „palce odwrócone” wyłącznie na Life Time (teraz szczebel 5), a „na szerokość barków” przeczy ACE #386 („wider than shoulder-width”). Część wspólna Catalyst
(„shoulder-width or slightly wider”) i ACE („wider than shoulder-width”): „nieco szerzej niż barki”. Nowe brzmienie wymaga `claims.mjs --stub`/`--rehash` przy wdrożeniu.

Przygotowane, ale wstrzymane/otwarte (nie wdrażać, dopóki nie będzie 2 źródeł szczebla 4):

| id | PL | EN |
|---|---|---|
| core_standing.woodchop.mis.arch | Wyginanie pleców w łuk przy unoszeniu ciężaru. | Arching your back as the weight goes up. |
| core_standing.windmill.knees | Nogi prawie proste — kolana tylko lekko ugięte. | Legs nearly straight — just a soft bend in the knees. |
| core_standing.windmill.mis.elbow | Uginanie łokcia ręki z ciężarem. | Bending the elbow of the arm holding the weight. |
| core_standing.landmine.setup | Stań szeroko i unieś koniec sztangi oburącz na prostych rękach. | Take a wide stance and lift the end of the bar with both hands, arms straight. |
| core_standing.landmine.move | Prowadź koniec sztangi łukiem z jednego boku na drugi, obracając tułów; ręce cały czas proste. | Swing the end of the bar in an arc from one side to the other by rotating your torso; keep your arms straight throughout. |
| core_standing.cabletwist.setup | Oprzyj górę pleców na piłce, unieś biodra do linii z tułowiem i trzymaj uchwyt na prostych rękach nad klatką. | Rest your upper back on the ball, lift your hips in line with your torso and hold the handle on straight arms above your chest. |
| core_standing.cabletwist.move | Obróć tułów w bok, nie uginając rąk, i wróć do środka. | Rotate your torso to the side without bending your arms, then come back to the middle. |
| core_standing.cabletwist.hips | Biodra cały czas w górze — nie opuszczaj ich przy obrocie. | Keep your hips up the whole time — don't let them drop as you rotate. |
| core_standing.mbtwist.setup | Stań plecami do partnera, piłkę trzymaj oburącz. | Stand back to back with your partner, holding the ball in both hands. |
| core_standing.mbtwist.move | Obróć tułów w bok i podaj piłkę partnerowi, potem obróć się w drugą stronę i odbierz ją. | Turn your torso to one side and hand the ball to your partner, then turn to the other side to take it back. |
| core_standing.mbtwist.feet | Stopy zostają w miejscu — obraca się sam tułów. | Keep your feet planted — only your torso turns. |
| core_standing.bentpress.setup | Zarzuć kettlebell na bark. | Clean the kettlebell up to your shoulder. |
| core_standing.bentpress.move | Odchylaj tułów w bok i w dół, z dala od ciężaru — ręka prostuje się, bo wchodzisz pod kettlebell, a nie wypychasz go w górę. | Lean your torso sideways and down, away from the weight — your arm straightens because you get under the kettlebell, not because you press it up. |
| core_standing.bentpress.stand | Z zablokowaną ręką wstań, trzymając ciężar nad głową. | With your arm locked out, stand up holding the weight overhead. |

## 4. Nowe źródła (z oceną szczebla wg rozstrzygnięcia 02.11.2026)

| id | adres | organizacja | szczebel i powód |
|---|---|---|---|
| ace-340 | https://www.acefitness.org/resources/everyone/exercise-library/340/kneeling-wood-chop/ | ACE (Kneeling Wood Chop #340) | 4 — organizacja certyfikująca trenerów, treść firmowana |
| ace-108 | https://www.acefitness.org/resources/everyone/exercise-library/108/standing-wood-chop/ | ACE (Standing Wood Chop #108) | 4 — jw. (ta sama organizacja co ace-340) |
| ace-386 | https://www.acefitness.org/resources/everyone/exercise-library/386/kettlebell-windmill/ | ACE (Kettlebell Windmill #386); przeczytane 02.11.2026 (też w `core_standing-2.md`) | 4 — jw.; bez autora i daty, stopka „The American Council on Exercise” (treść firmowana) |
| iom-lx48264v | https://platform.instituteofmotion.com/library/activity/lx48264v | Institute of Motion | 4 — sprawdzone ponownie 02.11.2026: (a) organizacja szkoląca trenerów — strona główna instituteofmotion.com, sekcja „Fitness Education”: kursy AHHPS Level 1–3 dla „Fitness Professionals” (certyfikatu/akredytacji CEU strona nie wymienia); (b) brak autora i daty, treść na platformie organizacji (subdomena instituteofmotion.com, „Program Builder”), ale nazwa organizacji nie pada w tekście strony ćwiczenia — firmowanie przez domenę; (c) strona ćwiczenia bez reklam, afiliacji i sklepu. Najsłabszy punkt: (b) — do potwierdzenia przez koordynatora; od tego zależą wszystkie 3 zdania woodchop |
| lifetime-wood-chop | https://experiencelife.lifetime.life/article/how-to-do-the-wood-chop/ | Life Time, „Experience Life” (M. Fazeli Fard, RKC, starsza redaktorka, 20.12.2024) | 5 — korekta 02.11.2026 (spójność z `core_standing-2.md`): (a) niespełnione — wydawca to sieć klubów (jak PureGym); brak noty o recenzji eksperckiej; (c) reklamy i odnośniki do sklepu na stronach magazynu (wg `core_standing-2.md`, sekcja 6) |
| lifetime-kb-windmill | https://experiencelife.lifetime.life/article/the-kettlebell-windmill/ | Life Time, „Experience Life” (M. Fazeli Fard, 24.04.2020) | 5 — jw. |
| catalyst-522 | https://catalystathletics.com/exercise/522/Windmill | Catalyst Athletics | 4 — wg listy koordynatora; ponownie przeczytane 02.11.2026 (o wzroku, łokciu i kącie stóp nic) |
| catalyst-497 | https://catalystathletics.com/exercise/497/Side-Bend/ | Catalyst Athletics (Side Bend; kettlebell, hantel, talerz) | 4 — wg listy |
| catalyst-701 | https://catalystathletics.com/exercise/701/Barbell-Side-Bend | Catalyst Athletics (Barbell Side Bend) | 4 — wg listy |
| issa-planes-2024 | https://www.issaonline.com/blogs/training-tips/planes-of-motion-fontal-sagittal-and-transverse-exercises-and-benefits | ISSA (blog, 05.02.2024); „Frontal Plane Exercises” → Side Bend | 4 — wg listy |
| speediance-pallof-training | https://eu.speediance.com/en/blogs/fitness/pallof-press-training | Speediance (Y. Chen, 26.06.2026) | 4 warunkowo — producent własnego wyciągu (Pallof na wyciągu = własny rodzaj sprzętu), autor + data; tekst odwołuje się do własnej maszyny (element marketingu) |
| speediance-pallof-cable | https://www.speediance.com/blogs/fitness/pallof-press-with-cable | Speediance (Y. Chen, 09.04.2026) | jw.; ten sam właściciel → razem z poprzednim jedno źródło |
| mti-1321 | https://mtntactical.com/exercises/mnt1321-kettlebell-windmill/ | Mountain Tactical Institute | 5 — sprawdzone ponownie 02.11.2026 (strona główna mtntactical.com; /about → 404): (a) niespełnione — firma sprzedająca plany („Athlete Subscription”, licencje dla siłowni), o szkoleniu/certyfikacji trenerów strona nic nie mówi; nie redakcja, nie producent; (c) niespełnione — strona prowadzi do sprzedaży planów |
| dynamo-landmine-180 | https://blog.dynamofitness.com.au/?p=2716 | Dynamo Fitness | 5 — brak autora i daty, wpis z „SHOP NOW” (marketing); nie ustalono, czy produkuje własny landmine |
| herts-landmine-rotation | https://performanceherts.co.uk/news-exercise-of-the-month-1352 | Performance Herts (Uniwersytet Hertfordshire) | 5 — (a) niespełnione: klub/obiekt sportowy, nie szkoli trenerów, nie redakcja, nie producent |
| dumbbellsdirect-side-bends | https://dumbbellsdirect.com/blogs/dumbbell-exercises-specific-movements/dumbbell-side-bends | Dumbbells Direct (11.09.2026, bez autora) | 5 — sprzedawca sprzętu, blog sklepu |
| wtg-cable-russian-twist | https://weighttraining.guide/exercises/cable-russian-twist-on-a-stability-ball | weighttraining.guide (M. Livelo) | 5 — serwis jednej osoby bez redakcji i recenzji, promuje własny e-book |
| intermountain-mb-partner | https://www.intermountainhealth.org/blogs/two-person-medicine-ball-workout | Intermountain Health (sieć szpitali; 15.01.2014, akt. 25.10.2023, autor „Unknown”) | 4 warunkowo — materiał placówki medycznej z datą (analogia do reguły WebMD Ignite); do potwierdzenia przez koordynatora |
| rdx-mb-pass | https://blogs.rdxsports.com/?p=4063 | RDX Sports (16.02.2016, bez autora) | 5 — blog marketingowy producenta; nie ustalono, czy piłki lekarskie to jego własny rodzaj sprzętu |
| breakingmuscle-bent-press-2 | https://breakingmuscle.com/tackle-the-kettlebell-bent-press-part-2/ | Breaking Muscle (C. Abbott, akt. 22.11.2021) | 5 — wg listy |
| legendary-bent-press | https://legendarystrength.com/?p=11339 | Legendary Strength (L. Christopher, 24.09.2019) | 5 — strona trenera sprzedająca własne produkty; nie organizacja szkoląca, nie redakcja |

Odrzucone (przeczytane, nie pasują): Sussex Sport PDF „Anti Rotations and Pallof Press” (bez obrotu), Australian Fitness Academy (warianty Pallof bez obrotu),
EliteFTS „Anti-Rotational Drills (Pallof Press)” (bez obrotu), Training Station (bez obrotu), Performance Herts #1297 (bez obrotu).
Odrzucone z zasady: biblioteka ćwiczeń firmy fizjoterapeutycznej, która sprzedaje też aplikację (Pallof z obrotem na gumie) — potraktowana jak strona aplikacji.
Szukanie zastępczego źródła dla `woodchop.mis.arch` (02.11.2026): wyszukiwarka nie zwróciła stron ACE/NASM/ISSA/BarBend o błędzie „wyginanie pleców” w woodchop — tylko strony aplikacji, agregatory i prasa ogólna (nieliczone).

## 5. Otwarte

- **Korekta 02.11.2026 (spójność Life Time) — skutki:** `core_standing.woodchop.mis.arch` ma tylko ACE #108 → wstrzymane. W windmillu `knees` (tylko Catalyst), `mis.elbow` (błąd wprost tylko Life Time; ACE i Catalyst mówią „ręka prosta” jako wskazówkę — spójnie z `core_standing-2.md` nie liczę odwrócenia wskazówki jako źródła błędu) i `wm.eyes` (ACE #386 + dwa źródła szczebla 5) → wstrzymane.
- **Institute of Motion (b):** jeśli koordynator nie uzna firmowania przez domenę za „treść jawnie firmowaną”, Cable Woodchop spada do 0 zdań z 2 źródłami (każde ma tylko ACE) → otwarte w całości.
- **Cable Woodchop — możliwe błędy zestawu ogólnego** (`lib/figures/v2/cue-sets.json`, dziś `general`):
  - `chop.close` („Ciężar blisko ciała…”) — w wersji z wyciągiem ręce są wyciągnięte; „blisko ciała” mówi tylko ACE #108 o piłce w etapie 1 → niepotwierdzone, możliwy błąd zestawu.
  - `plank.brace` — napięcie brzucha wprost tylko ACE #108 (jedna organizacja).
  - `rt.control`, `mis.jerk` — „kontrola” jest u ACE („slowly”); Life Time (szczebel 5) zaleca ruch szybki („Quickly and with control”) — po korekcie nie tworzy sprzeczności na tym samym szczeblu, ale „płynnie, bez rzucania” nadal ma tylko jedną organizację szczebla 4.
  - Różnica w ACE: #340 (klęk) — górna część ciała nieruchomo; #108 i Institute of Motion — obrót tułowia. Część wspólna w karcie: tor ukośny z góry do przeciwnego biodra, ruch prowadzi tułów.
  - Obrót tylnej stopy (ACE #108 etap 3) — pominięty: u ACE dopiero w etapie zaawansowanym.
- **Landmine Rotation:** po rozstrzygnięciu brak źródła szczebla 4. Dodatkowo sprzeczność Dynamo („trunk and hips”) vs Herts („Keep your hips facing forward”). Zestaw ogólny (`rt.control`, `plank.brace`, `mis.jerk`) — żadne przeczytane źródło tego nie mówi → możliwy błąd zestawu. Następny krok: ACE/ISSA/NSCA/Catalyst — wpis landmine rotation („landmine 180”, „rainbow”).
- **Kettlebell Windmill:** zestaw ogólny przypisuje `wm.eyes` → dziś jedno źródło szczebla 4 (ACE #386). Szerokość stóp: Catalyst „shoulder-width or slightly wider”, ACE „wider than shoulder-width” → „nieco szerzej niż barki” (Life Time „nie szerzej niż barki” — szczebel 5, nie liczy się). Kąt stóp 45° i obrót palców — tylko Life Time (5) → nie wpisane. „Windmill to nie skłon w bok” — tylko Life Time. `mis.jerk` — niepotwierdzone.
- **Side Bend (hantel):** `sb.plane` — Catalyst #497 („hips and shoulders remain squared off facing forward”) + Dumbbells Direct (szczebel 5) → jedno źródło szczebla 4, otwarte; ISSA umieszcza ćwiczenie w płaszczyźnie czołowej, ale „bez skrętu i pochylenia” wprost nie pisze. Wolna ręka na głowie — tylko Catalyst. „Hantel wzdłuż nogi do kolana” — tylko ISSA. Liczby powtórzeń (Catalyst 10–15) — nie wpisane.
- **Barbell Side Bend:** ustawienie sztangi (jak do przysiadu) — tylko Catalyst #701; `sb.plane` — Catalyst #701 + Dumbbells Direct (5); `core_standing.sidebend.move` — Catalyst #701 + ISSA (wariant: hantel) — jedyne zdanie z 2 źródłami → za mało na kartę. Zestaw ogólny `dyn.control` („zakres zwiększaj stopniowo”) — żadne przeczytane źródło tego nie mówi → możliwy błąd zestawu.
- **Pallof Press With Rotation:** obrót od wyciągu po wypchnięciu, biodra przodem, ruch z tułowia, pauza, powolny powrót — tylko Speediance (jeden właściciel). `pallof.setup` (Speediance odsyła do ustawienia zwykłego Pallofa + ACE #332 i Mullane 2021 jako wariant bez obrotu) — jedno zdanie, za mało na kartę; do decyzji koordynatora, czy zwykły Pallof liczy się tu jako wariant. `pallof.noTwist` NIE pasuje do tej pozycji (ćwiczenie zakłada obrót) — jeśli zestaw ogólny/rodzinny je przypisuje, to błąd. Zakres obrotu (20–45° ze streszczenia wyszukiwarki) — nieprzeczytany.
- **Cable Russian Twists:** po rozstrzygnięciu tylko ACE #65 (wariant bez wyciągu, dłonie złożone). Kierunek „od wyciągu”, wydech — tylko weighttraining.guide (5). Kolana 90° — tylko ACE (liczba). `rt.setup` / `rt.move` (siad) nie pasują do wersji na piłce.
- **Medicine Ball Full Twist:** w przeczytanych źródłach nazwa oznacza ćwiczenie w parze (podawanie piłki plecami do siebie); katalog wymaga tylko piłki (`loadSource: none`), bez partnera → sprawa produktowa/katalogowa dla analityka (opis „w parze”, zmiana nazwy albo wersja solo). Po rozstrzygnięciu: Intermountain (4 warunkowo) + RDX (5) → każde zdanie ma 1 źródło. Odległość 2–3 stopy — tylko streszczenie wyszukiwarki.
- **Bent Press:** oba źródła szczebla 5. `wm.eyes` w zestawie ogólnym — żadne przeczytane źródło bent press o wzroku nie mówi → możliwy błąd zestawu. Ustawienie stóp: brak części wspólnej. Następny krok: Catalyst (biblioteka ćwiczeń), organizacje kettlebellowe (RKC/StrongFirst — sprawdzić kryteria a–c).

## 6. Stan

- Zrobione (02.11.2026, sesja 1): Cable Woodchop, Landmine Rotation, Kettlebell Windmill.
- Zrobione (02.11.2026, sesja 2): Side Bend (hantel), Barbell Side Bend, Pallof Press With Rotation, Cable Russian Twists, Medicine Ball Full Twist, Bent Press; zastosowane rozstrzygnięcie koordynatora o szczeblach do całego pliku.
- Zrobione (02.11.2026, sesja 3): korekta spójności Life Time = 5 (sekcja 7); ocena Institute of Motion i Mountain Tactical Institute wg (a)–(c); ACE #386 dodane do windmilla.
- Wynik: gotowe — Cable Woodchop (3), Kettlebell Windmill (3), Side Bend (hantel) (2); otwarte — Landmine Rotation, Barbell Side Bend, Pallof Press With Rotation, Cable Russian Twists, Medicine Ball Full Twist, Bent Press.
- Do decyzji koordynatora: Institute of Motion — czy firmowanie przez domenę spełnia (b) (od tego zależy cały woodchop); Intermountain Health; Speediance; czy zwykły Pallof liczy się jako wariant Pallofa z obrotem; nowe brzmienie `core_standing.windmill.setup`.
- Następny krok: szukać drugiego źródła szczebla 4 (ACE, NASM, ISSA, NFPT z autorem, Catalyst, BarBend — tylko artykuły o technice) dla: `woodchop.mis.arch`, `windmill.knees`, `wm.eyes`, obrotu w Pallof z obrotem, landmine rotation, bent press, cable russian twist (na piłce), `sb.plane`, ustawienia w barbell side bend.
- Pułapki: ExRx 403, archiwum zablokowane; NASM nie ma wpisu woodchop ani side bend; strony Eleiko (inspire360) słabo indeksowane; wyszukiwarka zwraca głównie strony aplikacji; `sport.herts.ac.uk` → `performanceherts.co.uk`; muscleandstrength 403 (i tak się nie liczy); biblioteka ćwiczeń sklepu z suplementami — przekierowanie i 404; johnsonfitness.com 403; stack.com 503; mtntactical.com/about → 404; narzędzie Edit niedostępne — zapis tylko przez pełne Write.

## 7. Korekta szczebli 02.11.2026 (spójność Life Time)

Podstawa: `core_standing-2.md`, sekcja 6 — Life Time „Experience Life” = 5 (wydawca to sieć klubów jak PureGym, brak recenzji eksperckiej, reklamy, odnośnik do sklepu).
Tu było „4 warunkowo” — ujednolicone. Strony ACE #386, Catalyst #522, Institute of Motion (biblioteka i strona główna) i mtntactical.com przeczytane ponownie 02.11.2026 (WebFetch).

| źródło | przed | po | powód |
|---|---|---|---|
| lifetime-wood-chop | 4 warunkowo | 5 | spójność z `core_standing-2.md` — (a) i (c) niespełnione |
| lifetime-kb-windmill | 4 warunkowo | 5 | jw. |
| iom-lx48264v | 4 | 4 (z uwagą o (b)) | (a) kursy AHHPS dla trenerów; (b) firmowanie tylko przez domenę platformy; (c) bez marketingu na stronie ćwiczenia |
| mti-1321 | 5 | 5 (potwierdzone) | (a) i (c) niespełnione — sprzedaż planów, brak szkolenia trenerów |
| ace-386 | — | 4 | dodane jako drugie źródło dla windmilla zamiast Life Time |

| ćwiczenie / zdanie | przed | po |
|---|---|---|
| Cable Woodchop | gotowe, 4 zdania | gotowe, 3 zdania |
| `core_standing.woodchop.setup` | ACE #340 + IoM | bez zmian |
| `core_standing.woodchop.move` | ACE #340 + IoM + Life Time | ACE #340 + IoM (Life Time do wstrzymanych jako dodatkowe) |
| `core_standing.woodchop.trunk` | IoM + Life Time + ACE #108 | IoM + ACE #108 |
| `core_standing.woodchop.mis.arch` | Life Time + ACE #108 | wstrzymane (tylko ACE) |
| Kettlebell Windmill | gotowe, 5 zdań | gotowe, 3 zdania |
| `core_standing.windmill.setup` | Catalyst + Life Time; „na szerokość barków, palce odwrócone…” | Catalyst + ACE #386; nowe brzmienie „nieco szerzej niż barki” bez palców |
| `core_standing.windmill.move` | Catalyst + Life Time | Catalyst + ACE #386 |
| `wm.arm` | Catalyst + Life Time | Catalyst + ACE #386 |
| `core_standing.windmill.knees` | Catalyst + Life Time | wstrzymane (tylko Catalyst) |
| `core_standing.windmill.mis.elbow` | Life Time + Catalyst | wstrzymane (błąd wprost tylko Life Time) |
| `wm.eyes` | otwarte (Life Time + MTI) | otwarte (ACE #386 + dwa źródła szczebla 5) |
| pozostałe ćwiczenia | bez Life Time | bez zmian |

Uwaga: liczba ćwiczeń gotowych bez zmian (3 z 9), zdań gotowych 11 → 8.
