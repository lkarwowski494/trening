# Lista per ćwiczenie — partia 4: rodziny `planned` (4A: core_floor, delt_raise, curl @ fbd00673; 4B: mobility_stand, triceps, pushup_plank @ 433289f7 — kod jak w 4A, `integracja-1-1` 1c683be3; 4C: plyo, olympic, lunge, overhead_press @ 294812ef — kod jak w 4A)

Metoda (audytor niezależny, 31.10.2026): walidacja v2 (`waliduj` z `scripts/figures/v2-validate.mjs`: schemat, geometria, sens, jakość) na każdym wpisie `lib/figures/v2/poses/<rodzina>.json`; `jakosc-raport.mjs --json --styk-wszystkie` (0 naruszeń w 3 rodzinach); pomiary `keyframeFrame` (`contract.ts`) co u = 0,05: kąty stawów (`jointAngles`), stopy (pięta/palce y), najniższe kształty ciała (`dataShapes`, rzut z boku), położenie kolan, chwytów i ciężaru, oś lędźwi, skręt/skłon tułowia; arkusze PNG (rzut z boku, u = 0 / 0,5 / 1; PIL, poza repo) dla wszystkich figur core_floor. Karta: własna (`lib/cues/data.json`) albo zestaw ogólny (`lib/figures/v2/cue-sets.json`, tekst PL). Rodziny są dziś niewidoczne (status `planned`, `poseData.ts` ładuje tylko pull_up), zestawy ogólne pokazują się tylko przy pokazywanej figurze v2 — wszystko poniżej dotyczy 1.1 po włączeniu rodziny.

Kolumny: Ruch „ok” = walidacja bez błędów i pomiary bez wady; „bez figury” = ćwiczenie rodziny bez wpisu w pliku póz (zestaw ogólny nigdy niewidoczny, ocena dopasowania tylko po nazwie). Zestaw pasuje: tak / tak* (zdanie nie dotyczy rysunku, ale mu nie przeczy) / nie.

## core_floor — 44 ćwiczenia, 21 z danymi (karty własne 4, zestawy 32, brak 8)

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Alternate Heel Touchers | tak | ok (skłon boczny ±16°, lędźwie ≤ 0 cm nad podłogą) | general crunch | tak* | `crunch.neck` — dłonie przy piętach, nie przy głowie |
| Bicycle Crunch | tak | ok w walidacji; pokazana jedna strona, prawa stopa stale na podłodze, skręt tułowia 0° | general crunch | tak* | OP-4; `crunch.neck` — dłonie nie przy głowie (łokcie na podłodze, przedramiona pionowo) |
| Bird Dog | tak | ok (dłoń pod barkiem x 60/59,9; ręka i noga do poziomu: ramię 0°, noga 178,5°) | own (v1 aktualna) | — | jedna strona (jak v1 zrecenzowana) |
| Butt-Ups | nie | bez figury | none (open) | — | — |
| Cable Crunch | nie | bez figury | general cableCrunch | tak | — |
| Cable Reverse Crunch | nie | bez figury | general legRaiseFloor | tak | — |
| Cable Seated Crunch | nie | bez figury | general cableCrunch | tak | — |
| Cocoons | tak | ok | none (open) | — | figura bez wskazówek |
| Cross-Body Crunch | tak | ok w walidacji; skręt tułowia 0° (dłoń przesuwa się do środka o 22 cm) | general crunch | tak | OP-4 |
| Crunch | tak | **wada**: kolana opadłe na boki (kolano y 14 cm, z 48 cm), dłonie przy biodrach | own | **nie** (rysunek przeczy karcie) | **ACG-008, ACG-009** |
| Crunch - Hands Overhead | tak | ok (kolano y 45) | general crunch | tak | — |
| Crunch - Legs On Exercise Ball | nie | bez figury | general crunch | tak | — |
| Dead Bug | tak | ok (biodro 88,9°, kolano 89,8°, ramię 90° → 159°; stopa min 3,6 cm, dłoń min 31 cm nad podłogą) | own (v1 aktualna) | — | jedna strona |
| Decline Crunch | nie | bez figury | general crunch | tak* | `crunch.lowBack` „na podłodze” przy ławce skośnej (teoretyczny — zestaw bez figury niewidoczny) |
| Decline Oblique Crunch | nie | bez figury | general crunch | tak* | jw. |
| Decline Reverse Crunch | nie | bez figury | general legRaiseFloor | tak | — |
| Dragon Flag | nie | bez figury | none | — | — |
| Frog Sit-Ups | tak | ok (kolana na boki celowo: `odchylenieKolana` 50) | general crunch | tak* | stopy pionowo, palce 26 cm nad podłogą — bez źródła, nie zgłaszam; `crunch.neck` — dłonie nie przy głowie |
| GHD Sit Up | nie | bez figury | none | — | — |
| Hollow Hold | tak | ok, poza statyczna (2 identyczne klatki) | general plank | tak | nie ma na liście `ISOMETRIC` (`poseData.ts`), katalog: pomiar czasu — strażnik `tests/figures-v2-data.test.tsx:53` złapie przy włączeniu |
| Janda Sit-Up | tak | **wada**: kolana opadłe na boki (y 14 → 25, z 48) | general crunch | tak* | **ACG-009** |
| Kneeling Cable Crunch With Alternating Oblique Twists | nie | bez figury | general cableCrunch | tak | — |
| Leg Pull-In | tak | ok (miednica unosi się 9,5 → 21,5) | general legRaiseFloor | tak | — |
| Lying Leg Raise | tak | ok (biodro 17 → 87°, miednica stała) | general legRaiseFloor | tak | — |
| Machine Crunch | nie | bez figury | general cableCrunch | tak | — |
| Oblique Crunches - On The Floor | tak | **wada**: kolana opadłe na boki; skręt i skłon tułowia 0° | general crunch | tak* | **ACG-009**, OP-4 |
| Otis-Up | nie | bez figury | general crunch | tak* | — |
| Press Sit-Up | nie | bez figury | none | — | — |
| Reverse Crunch | tak | ok (miednica 9,5 → 20,5, lędźwie od podłoża) | own | — | — |
| Scissor Kick | tak | ok w walidacji; kolana zgięte 47–54° przez cały ruch, nogi naprzemiennie | general legRaiseFloor | tak | OP-5 |
| Seated Flat Bench Leg Pull-In | nie | bez figury | general legRaiseFloor | tak | — |
| Side Jackknife | nie | bez figury | none | — | — |
| Sit Up | tak | **wada**: kolana opadłe na boki (y 14 → 25, z 48) | general crunch | tak* | **ACG-009** |
| Smith Machine Hip Raise | nie | bez figury | none | — | — |
| Stability Ball Crunch | nie | bez figury | general crunch | tak | — |
| Stability Ball Knee Tuck | nie | bez figury | general plank | tak | — |
| Standing Rope Crunch | nie | bez figury | general cableCrunch | tak | — |
| Stomach Vacuum | nie | bez figury | none | — | — |
| Superman | tak | ok (miednica stała y 9,5, biodro −16,7°, ręce 170°) | general cobra | tak | — |
| Suspended Reverse Crunch | nie | bez figury | general plank | tak | — |
| Toe Touchers | tak | ok (nogi w górze, stopy 70–74 cm) | general crunch | tak | — |
| Tuck Crunch | tak | ok | general crunch | tak* | ręce skrzyżowane, `crunch.neck` nie dotyczy |
| V-Up | tak | ok | general vup | tak | — |
| Weighted Sit-Ups - With Bands | nie | bez figury | general crunch | tak | — |

## delt_raise — 38 ćwiczeń, 30 z danymi (karty własne 5, zestawy 29, brak 4)

Pomiary w pozycji górnej (strona pracująca): dłoń − bark (y), łokieć − dłoń (y), kąt łokcia w ruchu; tułów, miednica i stopy stałe we wszystkich stojących (stopy y = 0, tułów 0° albo stały skłon), siedzące — styk siedziska i oparcia. Arkusze: przód (7) i bok (7).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Alternating Deltoid Raise | tak | rysunek = unoszenie przodem jedną ręką (dane jak Front Raise, lewa ręka w dół), łokieć 8,1 cm pod dłonią | general raiseSide | **nie** | **ACG-010** |
| Band Lateral Raise | tak | ok (dłoń 9,6 cm pod barkiem, łokieć 8,6 cm nad dłonią, łokieć 6,5–15,7°) | general raiseSide | tak | — |
| Band Upright Row | tak | ok (łokieć 9,4 cm nad dłonią, 4,1 cm pod barkiem) | general uprightRow | tak | — |
| Barbell Front Raise to Overhead | tak | ok (ramię do 167°, łokieć 24,9–28,6°, tułów 0°) | general raiseFront | tak | — |
| Barbell Incline Shoulder Raise | nie | bez figury | none (open) | — | — |
| Cable Front Raise | tak | ok (jedna ręka, dłoń 8 cm nad barkiem) | general raiseFront | tak | — |
| Cable Lateral Raise | tak | ok | own | — | — |
| Cable Reverse Fly | tak | ok (ramiona na wysokości barków 89,5–92°, koniec: dłoń 11 cm za linią barków) | general raiseRear | tak | — |
| Cable Seated Lateral Raise | tak | ok (siedzisko i oparcie) | general raiseSide | tak | — |
| Cable Y Raise | tak | ok (ramię do 152°, łokieć stały 13,7–18,5°) | general raise | tak | — |
| Car Drivers | tak | ok w walidacji; obrót talerza tylko w jedną stronę | general raiseFront | tak* | **ACG-011**; `lat.height` — talerz cały czas na wysokości barków, nic nie jest unoszone |
| Dumbbell Front Raise to Overhead | tak | ok | general raiseFront | tak | — |
| Dumbbell Incline Shoulder Raise | nie | bez figury | none (open) | — | — |
| Dumbbell Lying One-Arm Rear Lateral Raise | nie | bez figury | general raiseRear | tak | — |
| Dumbbell One-Arm Upright Row | tak | ok | general uprightRow | tak | — |
| Dumbbell Scaption | tak | ok (dłoń 39 cm przed barkiem — płaszczyzna łopatki, łokieć 4,6 cm nad dłonią) | general raiseSide | tak | — |
| Front Incline Dumbbell Raise | tak | ok (oparcie 30°, styk pleców i głowy) | general raiseFront | tak | — |
| Front Plate Raise | tak | ok (łokieć 28,4–31,1°) | general raiseFront | tak | — |
| Front Raise | tak | ok (obie ręce, dłoń 8 cm nad barkiem) | own | — | — |
| Kettlebell Halo | nie | bez figury | general halo | tak | — |
| Kettlebell Halo with Overhead Extension | nie | bez figury | general halo | tak | — |
| Lateral Raise (hantle) | tak | ok | own | — | — |
| Machine Lateral Raise | tak | ok | general raiseSide | tak | — |
| One-Arm Cable Rear Lateral Raise | tak | ok (tułów 68° od pionu, dłoń na linii barków, odwiedzenie 88°) | general raiseRear | tak | — |
| One-Arm Incline Lateral Raise | nie | bez figury | general raiseSide | tak | — |
| One-Arm Lateral Raise (hantel) | tak | ok | general raiseSide | tak | — |
| Reverse Fly (hantle) | tak | ok (tułów 68° od pionu — „prawie poziomo”, dłoń 2,2 cm pod barkiem, ramię prostopadle) | own | — | — |
| Reverse Pec Deck | tak | ok (łokcie na wysokości barków, koniec: łokieć 13 cm za stawem barkowym) | own | — | — |
| Single Dumbbell Front Raise | tak | ok | general raiseFront | tak | — |
| Sled Reverse Flye | nie | bez figury | none (open) | — | — |
| Smith Incline Shoulder Raise | nie | bez figury | none (open) | — | — |
| Smith Machine One-Arm Upright Row | tak | ok (gryf pionowo w prowadnicy) | general uprightRow | tak | — |
| Smith Machine Upright Row | tak | ok | general uprightRow | tak | — |
| Straight Raises on Incline Bench | tak | ok (przodem do oparcia, sztanga od zwisu do wysokości barków: dłoń −0,1 cm) | general raiseFront | tak | — |
| Upright Row (hantle) | tak | ok | general uprightRow | tak | — |
| Upright Row (linki) | tak | ok | general uprightRow | tak | — |
| Upright Row (sztanga) | tak | ok | general uprightRow | tak | — |
| Y Raise (hantle) | tak | ok (tułów 45°, ramię do 145°, odwiedzenie 37° — litera Y) | general raise | tak | — |

## curl — 36 ćwiczeń, 36 z danymi (karty własne 6, zestawy 30)

Pomiary (ręka pracująca): kąt łokcia, kąt ramienia od osi tułowia i jego zmiana (Δ — „łokcie przy bokach”), łokieć x − bark, przedramię od pionu w pozycji górnej, obrót przedramienia, tułów i stopy; modlitewnik — odległość ramienia od linii podpórki. Tułów stały (0° albo stały skłon/oparcie) i stopy y = 0 we wszystkich. Arkusze: bok (7).

| Ćwiczenie | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|
| Barbell Curl | ok poza górą: łokieć 21–135°, ramię Δ2,1°, przedramię na górze **40,4° od pionu** | own | — | **ACG-012** |
| Barbell Preacher Curl | ok (środek ramienia 2,5–3,1 cm od linii podpórki, łokieć 13,7–126°) | general curl | tak | OP-6 |
| Bayesian Curl | ok (ramię 35–40° za tułowiem, stałe) | general curl | tak | — |
| Biceps Curl (hantle) | ok (supinacja 0 → 70° — „obracając dłoń”, łokieć 18–134°) | own | — | — |
| Cable Curl | ok (Δ2,1°) | own | — | — |
| Cable Curl (dwie linki) | ok | general curl | tak | — |
| Cable Preacher Curl | ok | general curl | tak | OP-6 |
| Concentration Curl (hantle) | ok (tułów 50°, siad, łokieć przy udzie) | general curl | tak | — |
| Cross Body Hammer Curl | ok (dłoń z 25 → 3 cm — przez tułów, chwyt neutralny) | general curl | tak | — |
| Drag Curl | ok (łokcie w tył do −11,7 cm, Δ17° — zestaw bez `curl.elbows`, zgodnie z ruchem) | general curl | tak | — |
| EZ Bar Curl | ok poza górą: przedramię na górze **41,5° od pionu** | own | — | **ACG-012** |
| Hammer Curl | ok poza górą: przedramię na górze **40,2° od pionu**; chwyt neutralny (obrót 0°) | own | — | **ACG-012** |
| Hammer Curl (linki) | ok | general curl | tak | — |
| High Cable Curl | ok (ramiona odwiedzione 96–100°, łokieć 7,6–118°) | general curl | tak | — |
| Incline Curl (hantle) | ok (oparcie 35°, ramię pionowo, Δ7,5°) | general curl | tak | — |
| Incline Hammer Curl | ok | general curl | tak | — |
| Lying Cable Curl | ok (leżenie na podłodze, ramię wzdłuż tułowia) | general curl | tak | OP-6 |
| Lying Close-Grip Bar Curl On High Pulley | ok (ławka, ramię pionowo do wyciągu, łokieć 18–107,6°) | general curl | tak* | OP-6 (najmniejsze zgięcie końcowe w rodzinie) |
| Lying Supine Dumbbell Curl | ok | general curl | tak | OP-6 |
| Machine Biceps Curl | ok | general curl | tak | OP-6 |
| One Arm Dumbbell Preacher Curl | ok | general curl | tak | OP-6 |
| Preacher Curl | ok | own | — | OP-6 |
| Preacher Curl (EZ) | ok | general curl | tak | OP-6 |
| Preacher Hammer Dumbbell Curl | ok | general curl | tak | OP-6 |
| Reverse Cable Curl | ok (nachwyt −70°) | general curl | tak | — |
| Reverse Curl | ok (nachwyt −70°) | general curl | tak | — |
| Reverse EZ-Bar Preacher Curl | ok | general curl | tak | OP-6 |
| Seated Close-Grip Concentration Barbell Curl | ok | general curl | tak | — |
| Spider Curl | ok (klatka na ławce 45°, ramię pionowo, łokieć 1,5–124,6°) | general curl | tak | OP-6 |
| Spider Curl (sztanga) | ok | general curl | tak | OP-6 |
| Standing Concentration Curl | ok (skłon 45°, ramię zwisa) | general curl | tak | OP-6 |
| Standing Dumbbell Reverse Curl | ok | general curl | tak | — |
| Standing Inner-Biceps Curl | ok (ramię odwiedzione 20–23,5°, supinacja) | general curl | tak | — |
| Standing One-Arm Cable Curl | ok | general curl | tak | — |
| Zottman Curl | ok (obrót −60 ↔ 60°) | general curl | tak | — |
| Zottman Preacher Curl | ok | general curl | tak | OP-6 |

## mobility_stand — 36 ćwiczeń, 8 z danymi (karty własne 0, zestawy 36, brak 0)

Wszystkie 8 figur to pozy statyczne (2 identyczne klatki; `poseData.ts:97` — rozciąganie statyczne bez pętli). Pomiary: kąty stawów, stopy, najniższe kształty (−0,2 cm — grubość kreski), głowa/tułów. Walidacja 8/8 bez błędów, `jakosc-raport --styk-wszystkie` 0 naruszeń.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Ankle Circles | nie | bez figury | general mobility | tak | — |
| Arm Circles | nie | bez figury | general mobility | tak | — |
| Chest And Front Of Shoulder Stretch | nie | bez figury | general stretch | tak | — |
| Chest Stretch on Stability Ball | nie | bez figury | general stretch | tak | — |
| Chin To Chest Stretch | tak | ok (poza statyczna, `pochylenieGlowy` 45°, stopy y = 0, tułów 0°) | general stretch | tak | — |
| Cross-Body Shoulder Stretch | nie | bez figury | general stretch | tak | — |
| Dynamic Back Stretch | nie | bez figury | general mobility | tak | — |
| Dynamic Chest Stretch | nie | bez figury | general mobility | tak | — |
| Groiners | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Hip Circles (Prone) | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Inchworm | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Iron Crosses (Stretch) | nie | bez figury | general mobility | tak | — |
| Knee Circles | nie | bez figury | general mobility | tak | — |
| Leg Swings (Front-to-Back) | nie | bez figury | general mobility | tak | — |
| Leg Swings (Side-to-Side) | nie | bez figury | general mobility | tak | — |
| Lying Leg Crossover Swings | nie | bez figury | general mobility | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| One Knee To Chest | nie | bez figury | general stretch | tak | ćwiczenie leżąc/w podporze w rodzinie „stojąc” — tylko przy tworzeniu figury (teoretyczne) |
| Overhead Stretch | nie | bez figury | general stretch | tak | — |
| Overhead Triceps Stretch | tak | ok (prawa ręka nad głową: ramię 167°, łokieć 145,7°, dłoń za głową x −12, y 144) | general stretch | tak | druga ręka wzdłuż ciała (nie dociąga łokcia) — zestaw tego nie opisuje, nie przeczy |
| Round The World Shoulder Stretch | nie | bez figury | general mobility | tak | — |
| Shoulder Circles | nie | bez figury | general mobility | tak | — |
| Side Neck Stretch | tak | ok (`przechylGlowy` 25° — widok z przodu) | general stretch | tak | — |
| Standing Biceps Stretch | nie | bez figury | general stretch | tak | — |
| Standing Chest Stretch | tak | ok (dłonie splecione za plecami x −24, ramię 29° w tył) | general stretch | tak | — |
| Standing Elevated Quad Stretch | nie | bez figury | general stretch | tak | — |
| Standing Gastrocnemius Calf Stretch | tak | ok w walidacji; **rysunek = rozciąganie przy ścianie** (dłonie na ścianie x 72/ściana 75, wykrok: przednie kolano 41,9°, tylne 7,9°, wszystkie pięty i palce y = 0, brak stopnia) — dane identyczne z Wall Calf Stretch | general stretch (gcalf.*, zrecenzowany 28.10) | **nie** | **ACG-013** |
| Standing Hip Circles | nie | bez figury | general mobility | tak | — |
| Standing Lateral Stretch | tak | ok (`przechylTulowia` 20°, skręt 0°, pochylenie w przód 0°, lewa ręka nad głową) | general stretch (sb.plane) | tak | — |
| Standing Pelvic Tilt | nie | bez figury | general mobility | tak | — |
| Standing Soleus And Achilles Stretch | tak | ok (oba kolana ugięte 25–27°, pięty y = 0) | general stretch | tak | — |
| Standing Toe Touches | nie | bez figury | general stretch | tak | — |
| Torso Rotation | nie | bez figury | general mobility | tak | — |
| Wall Calf Stretch | tak | ok (jw. jak Standing Gastrocnemius — tylna noga prosta, pięta na podłodze) | general stretch | tak | — |
| Wall Lat Stretch | nie | bez figury | general stretch | tak | — |
| World's Greatest Stretch | nie | bez figury | general mobility | tak | — |
| Wrist Circles | nie | bez figury | general mobility | tak | — |

## triceps — 32 ćwiczenia, 29 z danymi (karty własne 4, w tym 1 ukryta; zestawy 25, brak 3)

Pomiary (ręka pracująca): kąt łokcia (0° = prosty) — zakres i najmniejsze zgięcie w wyproście; ramię od pionu i od osi tułowia (Δ — „ramiona nieruchomo”), łokieć poza linią barków (z, „łokcie nie rozchodzą się”), dół wyciskania francuskiego: gryf a obrys głowy (elipsa `head`), tułów, stopy, styki. Walidacja 29/29 bez błędów; `jakosc-raport` 0 naruszeń (z `--styk-wszystkie`: R17 tylko na 2 figurach z ławką ujemną — klasa fałszywych alarmów opisana w `v2-jakosc.mjs:657`). „uwaga W” = najmniejsze zgięcie łokcia w wyproście (raport sekcja 10, uwagi): w modelu v2 „prosta ręka” to ok. 11–16° (zrecenzowany pull_up: zwis 13,8–15,5°, Push Up góra 11,4°), więc wartości 14,5–17,9° są w tej konwencji; 19–24° — wyraźniej ugięte, bez znaleziska (pewność < 80%).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Band Overhead Triceps Extension | tak | ramię 12–14° od pionu (Δ2,4°), łokieć 14,5–124,2°, łokcie ≤ 2,2 cm poza linią barków | general triOver | tak | uwaga W (wyprost 14,5°) |
| Band Skull Crusher | tak | ok (ramię 8–10° od pionu, łokieć 14,8–109,6°, styk pleców, głowy, siedziska) | general triLying | tak | dół: dłoń nad czubkiem głowy (jak Skullcrusher (sztanga)) |
| Body-Up | nie | bez figury | none (open) | — | — |
| Bodyweight Triceps Extension | nie | bez figury | none (open) | — | — |
| Cable Incline Triceps Extension | tak | ok (oparcie 35°, ramię 8° od pionu, łokieć 20,7–75,9°) | general triOver | tak | uwaga W (wyprost 20,7°) |
| Cable Lying Triceps Extension | tak | ok (jak Skullcrusher (sztanga), łokieć 17,9–109,1°) | general triLying | tak | uwaga W (wyprost 17,9°) |
| Cable Overhead Extension | tak | ramię 12–14° od pionu, łokieć 20,6–122,7° (zgięcie spełnia `cote.move` v1 ≥ 110°) | own | — | uwaga W (wyprost 20,6°; kryterium v1 ≤ 9°) |
| Chain Handle Extension | tak | ok (łokieć 14,8–109,6°) | general triLying | tak | uwaga W (wyprost 14,8°) |
| Decline Dumbbell Triceps Extension | tak | ok (ławka −20°, stopy na końcu siedziska y 59 przy wałkach; łokieć 8,3–110,1°) | general triLying | tak | R17 `styk_z_podlozem` tylko z `--styk-wszystkie` — klasa „ławka ujemna” (fałszywy alarm, `v2-jakosc.mjs:657`) |
| Decline EZ Bar Triceps Extension | tak | ok (jw., łokieć 17,9–109,2°) | general triLying | tak | jw. (R17); zestaw bez `press.noLock` |
| Dumbbell One-Arm Triceps Extension | tak | ok (jedna ręka, łokieć 14,5–124,2°) | general triOver | tak | uwaga W (wyprost 14,5°) |
| Incline Barbell Triceps Extension | tak | ok (oparcie 35°, ramię 8° od pionu, łokieć 17,8–75,5°) | general triLying | tak | uwaga W (wyprost 17,8°) |
| Kettlebell Overhead Triceps Extension | tak | ok (łokieć 16,9–119,7°, łokcie 1–3 cm do środka) | general triOver | tak | uwaga W (wyprost 16,9°) |
| Kneeling Cable Triceps Extension | tak | **inny wariant**: klęk prosty, tułów 0°, ręce nad głową jak w Cable Overhead Extension (dane identyczne w górnej części), ławka narysowana przed ćwiczącym (x 55–170, łokcie x 6,5) i nieużyta, uchwyt lina; łokieć 20,6–122,7° | general triOver | tak* (opisuje rysunek) | **ACG-014**; uwaga W (wyprost 20,6°) |
| Lying Close-Grip Barbell Triceps Extension Behind The Head | tak | ok (ramię 19–20° w tył — gryf za głowę, łokieć 19,2–99,6°, łokcie ≤ 1,4 cm poza barki) | general triLying | tak | uwaga W (wyprost 19,2°) |
| Machine Triceps Extension | tak | ok (siad, ramię wzdłuż tułowia 8–11°, łokieć 10,2–100,1°) | general triPush | tak | — |
| One-Arm Lying Dumbbell Triceps Extension | tak | ok (łokieć 7,8–110,1°) | general triLying | tak | — |
| Overhead Triceps Extension (EZ) | tak | ok (łokieć 17,6–123,5°, łokcie ≤ 2,2 cm poza barki) | general triOver | tak | uwaga W (wyprost 17,6°) |
| Overhead Triceps Extension (hantel) | tak | ok (łokieć 16,9–119,7°) | own | — | uwaga W (wyprost 16,9°) |
| Reverse Grip Triceps Pushdown | tak | ok (łokcie przy bokach: ramię 8,6–10,5° od tułowia, Δ2,7°; łokieć 19,1–98,5°) | general triPush | tak | uwaga W (wyprost 19,1°) |
| Single Arm Triceps Pushdown | tak | ok (łokieć 15,5–98,4°) | general triPush | tak | uwaga W (wyprost 15,5°) |
| Skullcrusher (EZ) | tak | jak Skullcrusher (sztanga) (dane identyczne) | own — ukryta (`hidden`, brak wpisu w `data.json`) | — | karta ukryta (ACG-006, partia 3); figura v2 bez karty |
| Skullcrusher (hantle) | tak | ok (łokieć 7,8–110,1°) | general triLying | tak | — |
| Skullcrusher (sztanga) | tak | ok (ramię 8,5–10° od pionu — „mniej więcej pionowo”; łokieć 17,9–109,1°); dół: gryf [−82,9; 67,9], głowa (elipsa) środek [−72; 53,2], rx 10,6 poziomo — gryf nad czubkiem, ok. 10 cm od obrysu | general triLying | tak | `skull.depth` „tuż nad czołem — albo wcześniej” — kryterium v1 (`touch` tol 12) spełnione na granicy (11,9); bez znaleziska |
| Sled Overhead Triceps Extension | nie | bez figury | none (open) | — | — |
| Standing Low-Pulley One-Arm Triceps Extension | tak | ok (łokieć 14,5–124,2°) | general triOver | tak | uwaga W (wyprost 14,5°) |
| Standing Overhead Barbell Triceps Extension | tak | ok (łokieć 15,6–123,9°) | general triOver | tak | uwaga W (wyprost 15,6°) |
| Tate Press | tak | ok (łokcie 9–18 cm poza linią barków — cecha ćwiczenia; łokieć 0–145°, styk 5 punktów) | general bench | tak | — |
| Triceps Kickback | tak | ok (tułów 68°, ramię równolegle do tułowia 6–7°, Δ3,1°; łokieć 7,3–90,8°) | general triPush | tak | — |
| Triceps Kickback (linki) | tak | ok (jw.) | general triPush | tak | — |
| Triceps Pushdown | tak | ok poza dołem: łokcie przy bokach (ramię 8,7–10,3°, Δ2°), łokieć **23,9**–98,5° (góra 98,5° — kryterium v1 `tpd.move` ≥ 100° prawie spełnione) | own | — | uwaga W (wyprost 23,9°; kryterium v1 ≤ 11°) |
| Two-Arm Dumbbell Kickback | tak | ok (jw. jak Triceps Kickback) | general triPush | tak | — |

## pushup_plank — 30 ćwiczeń, 17 z danymi (karty własne 7, w tym 2 bez figury v2; zestawy 23, brak 0)

Pomiary: linia bark–biodro–kostka (kąt w biodrze na rzucie z boku; przy klęku bark–biodro–kolano), łokieć, bark i najniższy punkt tułowia w dole (kształty `torso`/`pelvis`), dłoń względem barku (x) i rozstaw dłoni (z) wobec szerokości barków, kolana, stopy, styki; Incline — odległość klatki od krawędzi skrzyni w dole; Mountain Climbers — faza nóg co u = 0,25. Walidacja 17/17 bez błędów, `jakosc-raport --styk-wszystkie` 0 naruszeń. W modelu v2 „prosta noga” ma kąt kolana ok. 11–17° (stanie: 11,6°) — nie oceniam tego jako ugięcia.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Ab Wheel | nie | bez figury | general rollout | tak | — |
| Barbell Rollout from Bench | tak | ok (klęk na ławce: kolano y 52, biodro 128 → 8,4°, na końcu linia bark–biodro–kolano −0,1°, łokieć 9–15°) | general rollout | tak | — |
| Clock Push-Up | nie | bez figury | general pushup | tak | — |
| Close-Grip Push-Up | tak | ok (linia bark–biodro–kostka ≤ 0,1°, dłonie 20 cm / barki 38, tułów w dole 5,8 cm nad podłogą, łokieć 11,5–144°) | general pushup | tak | — |
| Copenhagen Plank | nie | bez figury | general plank | tak | — |
| Decline Push Up | tak | ok (stopy na skrzyni 43 cm, dłonie na podłodze 44 / 38, linia ≤ 0,1°, tułów w dole 11 cm) | general pushup | tak | — |
| Diamond Push Up | tak | ok (dłonie 4,5 cm od osi — razem, 6–13 cm za barkami, pod klatką; linia 0°, tułów w dole 2,3 cm) | own | — | — |
| Drop Push | nie | bez figury | general pushup | tak | — |
| Incline Push Up | tak | ok (dłonie na skrzyni 45 cm, w dole klatka 1,7 cm od krawędzi, linia ≤ 0,1°, łokieć 12,4–148°) | own | — | — |
| Incline Push-Up Close-Grip | tak | ok (dłonie 20 cm, klatka 2,4 cm od krawędzi) | general pushup | tak | — |
| Incline Push-Up Depth Jump | nie | bez figury | general pushup | tak | — |
| Incline Push-Up Reverse Grip | nie | bez figury | general pushup | tak | — |
| Inverted Row | nie | bez figury | own | — | karta własna bez rysunku — sprawdzona w partii 3 |
| Isometric Wipers | nie | bez figury | general pushup | tak | — |
| Mountain Climbers | tak | ok (dłonie pod barkami 0 cm, nogi naprzemiennie i jednocześnie: kolano 17,7 ↔ 138,5°, tylna noga prosta; bark y stały 65,6–65,7) | own | — | — |
| Plank | tak | ok (przedramiona: łokieć x −bark 2,4 cm — pod barkiem, łokieć 89,3°; linia −0,1°; poza statyczna) | own | — | — |
| Plank Shoulder Taps | tak | ok (linia 0°, miednica stała 48,5, dłoń dotyka drugiego barku: rozstaw 38 → 2 cm) | general plank | tak | — |
| Plyo Kettlebell Push-Ups | nie | bez figury | general pushup | tak | — |
| Plyo Push-Up | tak | ok (linia ≤ 0,1°, bark do 77,5 — wybicie, tułów w dole 8,8 cm) | general pushup | tak | — |
| Push Up | tak | ok (dłonie 38 = barki, linia ≤ 0,1°, tułów w dole 7,7 cm — „prawie do podłogi”, łokieć 11,4–144,1°) | own | — | — |
| Push Up to Side Plank | nie | bez figury | general pushup | tak | — |
| Push-Up Wide | tak | ok (dłonie 66 / barki 38, tułów w dole 2,3 cm) | general pushup | tak | — |
| Push-Ups With Feet On A Stability Ball | nie | bez figury | general pushup | tak | — |
| Renegade Row | nie | bez figury | general pushup | tak | — |
| Rollout (sztanga) | tak | ok (klęk: kolano y 9,8, start biodro 64°, od u = 0,5 linia bark–biodro–kolano 0°, łokieć 6,7–11,4°) | general rollout | tak | — |
| Side Plank | nie | bez figury | own | — | karta własna bez rysunku — sprawdzona w partii 3 |
| Single-Arm Push-Up | tak | ok (jedna ręka pod osią ciała, druga ręka stała; linia 0°; dół płytszy: łokieć do 95°, tułów 25 cm nad podłogą) | general pushup | tak | zestaw nie ma `push.mis.partial` — płytszy dół nie przeczy |
| Standing Barbell Rollout | tak | ok (stopy na podłodze, biodro 107 → 3,6°, na końcu linia 3,5°, ramię–tułów 148°) | general rollout | tak | — |
| Suspended Fallout | tak | ok (linia bark–biodro–kolano 5,5–7,6°, ramię 83 → 158°, łokieć 22–24° stały) | general rollout | tak | — |
| Suspended Push-Up | tak | ok (dłonie w taśmach 45 cm nad podłogą, linia 0°, łokieć 11,4–144,1°) | general pushup | tak | — |

## plyo — 28 ćwiczeń, 27 z danymi (karty własne 1, zestawy 26 — wszystkie `jump`, brak 1) — partia 4C @ 294812ef (kod jak w 4A/4B)

Pomiary co u = 0,01 (`keyframeFrame`, kształty `dataShapes` z boku): lot = najniższy punkt kształtu stopy nad powierzchnią pod nią (`powierzchniePodparcia`), wybicie = ostatnia klatka przed lotem, lądowanie = pierwsza po locie; kolano, biodro (`jointAngles`), pięta − palce, miednica (x/y/z), chwyt; porównanie z notą ćwiczenia w `docs/research/equipment/catalog.json`. Arkusze (bok: Jump Squat, Split Jump, Broad Jump, Box Jump, Frog Hops, Dumbbell Seated Box Jump, Weighted Jump Squat; przód: Lateral Box Jump, Side to Side Box Shuffle, Star Jump) — PIL, poza repo. Walidacja 27/27 bez błędów, `jakosc-raport` 0 naruszeń; z `--styk-wszystkie` R17 na 27/27 — plyo nie ma wpisów w `LOT` (`v2-jakosc.mjs:108`), więc każdy lot jest „wiszeniem”: fałszywy alarm reguły (uwaga U-4C-1). Zestaw `jump`: `jump.drive` „Wybij się, prostując biodra, kolana i kostki, z zamachem rąk”, `jump.land` „Ląduj miękko, na ugiętych kolanach”, błąd `jump.mis.stiff`. We wszystkich skokach pełny wyprost przed oderwaniem (kolano 8–14°, biodro 7–9°, pięta 21 cm nad palcami) i lądowanie z ugięciem do 85–123° — zdania zestawu zgodne z rysunkiem.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Alternate Leg Diagonal Bound | tak | ok (odbicie z jednej nogi, lot 30 cm, miednica x 0 → 81, z 0 → 45 — skos; lądowanie na drugą nogę, kolano do 122°) | general jump | tak | — |
| Alternate Leg Push-Off | tak | ok (prawa stopa na skrzyni 30 cm, lot 25 cm, zmiana nóg w powietrzu, lądowanie lewą na skrzyni) | general jump | tak | — |
| Bench Jump | tak | ok jako skok na skrzynię 40 cm (lot 43 cm, lądowanie na skrzyni, kolano do 90°) | general jump | tak | **ACG-014** (klasa: inny wariant niż nota — katalog „jumps over a bench or low box”, rysunek: wskok na skrzynię, kopia Box Jump z niższą skrzynią) |
| Box Jump | tak | ok (stopy 24 cm, lot 52 cm, lądowanie obiema stopami na skrzyni 50 cm, kolano 90°, biodro 93°; błąd `bj.mis.stiff` narysowany) | own | — | — |
| Box Skip | tak | ok (z jednej nogi na skrzynię 40 cm, druga noga uniesiona) | general jump | tak | — |
| Broad Jump | tak | ok (lot 25 cm, miednica x −17 → 126 — skok w dal, lądowanie kolano 90°) | general jump | tak | — |
| Depth Jump | tak | ok (zejście ze skrzyni 50 cm, lądowanie kolano 19 → 84°, wyskok 29 cm, lądowanie na podłodze) | general jump | tak | nota katalogu: wskok na drugą skrzynię — rysunek pokazuje częstszy wariant z wyskokiem w górę (bez znaleziska) |
| Double Leg Butt Kick | tak | ok (lot 26 cm, kolano do 99° w locie — pięty do pośladków) | general jump | tak | — |
| Dumbbell Seated Box Jump | tak | **wada**: dwa hantle w wyprostowanych rękach, zamach nad głowę (hantle do 256 cm) w locie; start z ławki 38 cm, lądowanie na skrzyni 50 cm | general jump | **nie** (`jump.drive` „z zamachem rąk” przy hantlu trzymanym przy klatce wg noty) | **ACG-015** |
| Frog Hops | tak | ok (głęboki przysiad: kolano 118°, biodro 129°, lot 21 cm, przemieszczenie do przodu 81 cm) | general jump | tak | — |
| Front Cone Hops | tak | ok (lot 17 cm, przemieszczenie 55 cm; pachołki nienarysowane — nota: „not in vocabulary”) | general jump | tak | — |
| Jump Squat | tak | ok (przysiad kolano 94°, wyprost przed oderwaniem 13,6°, lot 29 cm, lądowanie 21 → 90°) | general jump | tak | — |
| Kneeling Jump Squat | nie | bez figury | none (open) | — | — |
| Lateral Bound | tak | ok (z jednej nogi na drugą w bok: miednica z 0 → 90, lot 30 cm; widok z przodu) | general jump | tak | — |
| Lateral Box Jump | tak | ok (z przodu: skok w bok na skrzynię 40 cm, z = 55; lądowanie na wierzchu) | general jump | tak | z boku skrzynia nakłada się na sylwetkę (rzut; widok z przodu rozstrzyga) |
| Lateral Cone Hops | tak | ok (lot 17 cm, z 0 → 55) | general jump | tak | — |
| Side Hop-Sprint | tak | ok jako przeskok w bok (lot 19 cm, z 0 → 60); sprintu brak | general jump | tak | uproszczenie: pokazany tylko przeskok |
| Side Standing Long Jump | tak | ok (z 0 → 110 — skok w dal w bok, lot 25 cm) | general jump | tak | — |
| Side to Side Box Shuffle | tak | ok (skrzynia 12 cm, stopa na wierzchu zmienia się, miednica z −21 → 21) | general jump | tak | — |
| Single Leg Butt Kick | tak | ok (jedna noga, kolano wolnej 66–103°, lot 21 cm) | general jump | tak | — |
| Single Leg Push-Off | tak | ok (ta sama noga na skrzyni 30 cm przed i po locie) | general jump | tak | — |
| Single-Leg Hop Progression | tak | ok (jedna noga, lot 19 cm, przemieszczenie 50 cm) | general jump | tak | — |
| Single-Leg Lateral Hop | tak | ok (jedna noga, z 0 → 45) | general jump | tak | — |
| Single-Leg Stride Jump | tak | ok w walidacji; start na podłodze na jednej nodze, lądowanie na skrzyni 40 cm — ruch jak Box Skip | general jump | tak | **ACG-014** (klasa: nota „standing beside a box, inside foot on it; jump up driving the opposite knee” — stopa wewnętrzna nie stoi na skrzyni) |
| Split Jump | tak | ok (wykrok, lot 50 cm, zmiana nóg w powietrzu: przód R x 30 → tył; lądowanie w wykroku) | general jump | tak | — |
| Star Jump | tak | ok (z przodu: ręce i nogi rozchylone w locie, lot 29 cm) | general jump | tak | — |
| Tuck Jump | tak | ok (kolano do 110,5° w locie, lot 36 cm) | general jump | tak | — |
| Weighted Jump Squat | tak | ok (sztanga na plecach przez cały ruch, lot 23 cm, stojaki w tle) | general jump | tak | zestaw bez `jump.drive` (zamach rąk) — słusznie |

## olympic — 25 ćwiczeń, 23 z danymi (karty własne 0; zestawy: `oly` 18, `pushPress` 4, `squat` 1; brak 2) — partia 4C

Pomiary co u = 0,01: start (zgięcie kręgosłupa, pochylenie tułowia, kolano, biodro, łokieć), szerokość chwytu wobec barków, odstęp sztangi od obrysu nogi/tułowia w rzucie z boku (kształty `shank`/`thigh`/`shorts`/`torso`/`pelvis` na wysokości osi gryfu), wyprost (najmniejszy kąt biodra przed najwyższym położeniem sztangi) i łokieć w tej chwili, odbiór (najniższa miednica po szczycie): miednica wobec kolana, łokieć, rozkrok; środek ciężkości (`srodekCiezkosci` z `v2-jakosc.mjs`, z gryfem jako dodatkową masą) wobec wielokąta podparcia (`otoczka(punktyPodparcia)`). Arkusz z boku (Jerk Dip Squat, Power Clean, Clean, Barbell Snatch, Snatch Balance; u = 0 / 0,25 / 0,5 / 0,75 / 1) — PIL, poza repo. Walidacja 23/23 bez błędów, `jakosc-raport` 0 naruszeń; z `--styk-wszystkie` R17 na 21 figurach (wspięcie na palce i podskok przy podsiadzie 1,1–1,8 cm, bez wpisu w `LOT`) — fałszywy alarm (U-4C-1). Wspólne dla zestawu `oly`: start z płaskimi plecami (zgięcie kręgosłupa 0, tułów 49–54°), sztanga 2–11 cm od obrysu nóg i bioder przez cały ciąg (`oly.close`), łokcie proste (18–23°) do pełnego wyprostu bioder i kolan, w rwaniu ugięcie zaczyna się w chwili wyprostu (28–45° przy biodrze 5°) — `oly.legs` zgodne; chwyt podrzutowy 50 cm / barki 38, rwaniowy 80 cm.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Snatch | tak | ok (z podłogi, odbiór w pełnym przysiadzie: miednica 37,8 < kolano 40,2; łokcie 19°) | general oly | tak | OP-8 (b): gryf w odbiorze 5 cm przed palcami (x 23,7, palce 18,7) |
| Block Clean | tak | ok (talerze na skrzyniach 29,5 cm — start nad kolanem; odbiór jak Clean) | general oly | tak | — |
| Block Power Clean | tak | ok (start z bloków, odbiór wysoki: miednica 68,5 > kolano 45,2) | general oly | tak | OP-8 (c) |
| Block Power Snatch | tak | ok (start z bloków, odbiór wysoki, łokcie 19°) | general oly | tak | OP-8 (c) |
| Block Snatch | tak | ok (start z bloków, odbiór w pełnym przysiadzie) | general oly | tak | OP-8 (b) |
| Clean | tak | ok (z podłogi, odbiór w przysiadzie — miednica 40,3 ≈ kolano 41,5; gryf na przednich barkach: 14 cm nad i 12 cm przed stawem barkowym, łokieć 146°) | general oly | tak | — |
| Clean Pull | tak | ok (bez odbioru, wyprost na palcach, łokcie 19–20°) | general oly | tak | — |
| Clean Shrug | tak | ok (start z połowy uda — gryf 72 cm, wyprost i wzruszenie barków na palcach) | general oly | tak | — |
| Clean and Jerk | tak | ok (zarzut w przysiad, podrzut z odbiorem w nożyce: rozkrok 47 cm, łokcie 16°) | general oly | tak | — |
| Hang Clean | tak | ok (start gryf 72 cm — nad kolanem, odbiór jak Clean) | general oly | tak | — |
| Hang Snatch | tak | ok (start gryf 76 cm, odbiór w pełnym przysiadzie) | general oly | tak | OP-8 (b) |
| Jerk Balance | nie | bez figury | none (open) | — | — |
| Jerk Dip Squat | tak | ok w walidacji; ugięcie kolan 10 → 51°, gryf cofa się o 15,5 cm (x 8,3 → −7,2) przy zejściu o 11 cm; środek ciężkości 4,6–5,3 cm za piętami w dole | general pushPress | tak* | `pp.legs` („ręce kończą ruch”) nie dotyczy — figura nie wybija; OP-8 (a) |
| Muscle Snatch | tak | ok (kolana nie uginają się ponownie: odbiór kolano 9,7°; ręce ciągną od u 0,34, gryf nad głową, łokcie 19°) | general oly | tak | zestaw bez `oly.legs` — słusznie |
| Power Clean | tak | ok (odbiór wysoki: miednica 68,5 > kolano 45,2; gryf na barkach) | general oly | tak | OP-8 (c): gryf nad piętą (x −5,7, pięta −5,9), środek ciężkości 2,4–3,1 cm za piętami |
| Power Jerk | tak | ok (z przedniego podparcia, ugięcie i wybicie, odbiór w półprzysiadzie, łokcie 15°) | general pushPress | tak | OP-8 (c) |
| Power Snatch | tak | ok (odbiór wysoki, gryf nad stopą x 1) | general oly | tak | OP-8 (c) |
| Rack Delivery | nie | bez figury | none (open) | — | — |
| Snatch Balance | tak | ok (gryf z karku, zejście pod gryf do przysiadu nad głową, łokcie 19°) | general squat | tak* | `sq.kneesToes` — tylko widok z boku; OP-8 (b) |
| Snatch Pull | tak | ok (bez odbioru, chwyt rwaniowy, łokcie 21°) | general oly | tak | — |
| Snatch Shrug | tak | ok (z połowy uda, chwyt rwaniowy) | general oly | tak | — |
| Split Clean | tak | ok (odbiór w nożycach: rozkrok 47 cm) | general oly | tak | — |
| Split Jerk | tak | ok (odbiór w nożycach, łokcie 16°) | general pushPress | tak | — |
| Split Snatch | tak | ok (odbiór w nożycach, łokcie 20°) | general oly | tak | — |
| Squat Jerk | tak | ok (odbiór w pełnym przysiadzie nad głową, łokcie 14°) | general pushPress | tak | OP-8 (b) |

## lunge — 24 ćwiczenia, 24 z danymi (karty własne 6; zestawy: `lunge` 15, `pistol` 2, `mobility` 1) — partia 4C

Pomiary co u = 0,02: dół = najniższa miednica; noga przednia = większe zgięcie biodra; przednie kolano i biodro, nachylenie goleni, tylne kolano (staw i najniższy punkt obrysu `shank`/`thigh` nad podłogą), kolano przednie wobec kostki i palców (x, z), kierunek stopy (pięta → palce) a kierunek kolana w rzucie na podłogę, R11 (`katOsiStopyOdPlaszczyzny`), tułów i zgięcie kręgosłupa, stopy (pięta/palce y, x, z) na starcie, w dole i na końcu, chwyty; arkusze z boku (Bulgarian Split Squat (hantle), Step Up, Single-Leg High Box Squat, Pistol Squat, Walking Lunges) i z przodu (Lateral Lunge, Cossack Squat, Split Squat, Curtsy Lunge) — PIL, poza repo. Walidacja 24/24 bez błędów, `jakosc-raport` 0 naruszeń; z `--styk-wszystkie` R17 na 5 figurach (stopa w kroku 1,5–4,2 cm nad podłogą, gdy druga stoi na podłodze albo skrzyni) — fałszywy alarm (U-4C-1). Wspólne: tylne kolano w dole 4,4–7 cm nad podłogą (obrys; „tuż nad podłogą” w `lunge.fwd`/`lunge.back`/`lunge.walk`/`bss.move` zgodne), kręgosłup 0°, tułów 6° (`lunge.torso` zgodne), przednie kolano nad stopą w osi (z kolana − z kostki 2,6–3,8 cm, kierunek kolana 5–16° od osi stopy) we wszystkich wykrokach w przód i w tył.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Side Split Squat | tak | ok w walidacji (szeroki rozkrok z 30 / −50, zejście w bok na prawą: kolano 100°, lewa prosta; sztanga na plecach) — dane nóg identyczne z Lateral Lunge | general lunge | tak* | OP-9 (stopa prowadząca palcami do środka 20°, kolano 29,5° od osi stopy; nota: „angled lead foot”) |
| Barbell Step Up | tak | ok (jak Step Up, sztanga na plecach) | general lunge | tak | — |
| Barbell Walking Lunge | tak | ok w walidacji; krok w przód i powrót do startu (wahadło) — rysunek Lunges (sztanga) | general lunge | **nie** (`lunge.walk` „wstań na przedniej nodze i od razu zrób krok drugą”) | **ACG-016** |
| Bulgarian Split Squat (hantle) | tak | ok (grzbiet tylnej stopy na ławce 30 cm — palce 32, pięta 44,5; przednia goleń pionowo −0,8°; tylne kolano 6 cm nad podłogą; hantle w dół) | own | — | — |
| Bulgarian Split Squat (sztanga) | tak | ok (jak wyżej, sztanga na plecach, stojaki) | general lunge | tak | — |
| Cossack Squat | tak | ok w walidacji (zejście w bok: kolano 112°, druga noga prosta) | general lunge | tak* | OP-9 (stopa pracująca palcami do środka 28°, kolano 41° od osi stopy; R11 34° — wyjątek `OS_STOPY_WYJATKI` „do przeglądu przy rodzinie”, `v2-jakosc.mjs:358`) |
| Crossover Reverse Lunge | tak | ok w walidacji; dane identyczne z Curtsy Lunge (`klatki` równe), skręt tułowia brak | general mobility | tak | **ACG-014** (klasa: nota „reverse lunge with a torso rotation” — rotacji nie ma); R11 tylnej nogi 54° (wyjątek `v2-jakosc.mjs:357`) |
| Curtsy Lunge | tak | ok (tylna noga skrzyżowana za przednią: z kostki −10 → 22) | general lunge | tak | R11 tylnej nogi 54° (wyjątek `:356`) — nie dotyczy zdania o przednim kolanie |
| Elevated Back Lunge | tak | ok (przednia stopa na podwyższeniu 12 cm, krok w tył na podłogę, tylne kolano 4,4 cm) | general lunge | tak | — |
| Lateral Lunge | tak | ok w walidacji (zejście w bok, druga noga prosta) | general lunge | tak* | OP-9 (jak Barbell Side Split Squat) |
| Lunge Pass Through | tak | ok (kettlebell przekładany pod przednim udem: chwyt w dole x −15, y 34; tułów 35°) | general lunge | tak | — |
| Lunges (hantle) | tak | ok (stopy 20 cm — z ±10, hantle w dół; krok w przód 89 cm, tylne kolano 4,4 cm, powrót do startu) | own | — | — |
| Lunges (sztanga) | tak | ok (jak wyżej, sztanga na plecach) | general lunge | tak | — |
| Pistol Squat | tak | ok (stopa wolnej nogi 4–43 cm nad podłogą, ręce w przód; dół kolano 128°, biodro 126°) | own | — | wolna noga zgięta 31° w kolanie przy `pistol.setup` „drugą wyprostuj” — ponad konwencję prostej nogi v2 (11–17°), pewność niezgodności < 80% (uwaga U-4C-3) |
| Reverse Lunge | tak | ok (krok w tył 89 cm, tylne kolano 4,4 cm) | own | — | — |
| Single-Leg High Box Squat | tak | ok w walidacji; stopa podporowa na podłodze, skrzynia 43,6 cm za postacią, w dole siad na skrzyni (miednica 53,4) — przysiad na skrzynię | general pistol | tak | **ACG-014** (klasa: nota „standing on a high box, free leg hanging”) |
| Slider Reverse Lunge | tak | ok (tylna stopa na ślizgaczu — palce y 2, przesuw 90 cm) | general lunge | tak | — |
| Smith Machine Bulgarian Split Squat | tak | ok (jak Bulgarian, gryf w suwnicy Smitha) | general lunge | tak | — |
| Smith Machine Pistol Squat | tak | ok (gryf Smitha na plecach, dół jak Pistol) | general pistol | tak | — |
| Split Squat | tak | ok (pozycja stała rozkroku, tylne kolano 4,4 cm) | general lunge | tak | — |
| Split Squat (linki) | tak | ok (uchwyty z dolnych wyciągów w dłoniach) | general lunge | tak | — |
| Step Up | tak | ok (cała stopa na skrzyni 40 cm, wyprost nogi na skrzyni — miednica 129,8; druga stopa w górze; powrót tą samą drogą) | own | — | — |
| Suspended Split Squat | tak | ok (tylna stopa w taśmie 20–42 cm, tylne kolano 11,4 cm) | general lunge | tak | — |
| Walking Lunges | tak | ok w walidacji; dane identyczne z Lunges (hantle) — krok w przód i powrót do startu | own | — | **ACG-016** (`lunge.walk`) |

## overhead_press — 23 ćwiczenia, 21 z danymi (karty własne 5; zestawy: `ohp` 11, `press` 3, `pushPress` 1, `pushup` 1; brak 2) — partia 4C

Pomiary co u = 0,02 dla każdej ręki z zakresem łokcia > 20°: łokieć w górze i w dole, chwyt i bark (y, x), odchylenie przedramienia od pionu z boku i z przodu (`ohp.elbowsUnder`), chwyt x − bark (tor ciężaru), rotacja przedramienia (Arnold), pochylenie i skłon boczny tułowia, kolano (ugięcie w podrzucie), stopy, szerokość chwytu wobec barków. Walidacja 21/21 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Wspólne dla wariantów stojących: dół — chwyt 14 cm nad stawem barkowym i 22 cm przed nim (przód barków), góra — łokieć 9,2°, chwyt 7 cm przed barkiem i głową (ciężar nad głową, `ohp.move`/`ohp.tall`/`ohp.fullExt` zgodne), przedramię −13…3° od pionu z boku i −5…3° z przodu (`ohp.elbowsUnder` zgodne), tułów 0°, stopy na podłodze. Siedzące: ławka 45 cm, oparcie 85°, tułów −5° (oparty), kolano 78°, stopy na podłodze.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Arnold Press | tak | ok (rotacja przedramienia −75 → 80°, dłonie z 12 → 24 cm od osi, łokieć 9°) | general ohp | tak | zestaw bez `ohp.elbowsUnder` — słusznie (łokcie z przodu w dole) |
| Band Shoulder Press | tak | ok (guma, tor jak sztanga) | general ohp | tak | — |
| Bradford Press | nie | bez figury | none (open) | — | — |
| Double Kettlebell Press | tak | ok (dwa kettlebelle z przedniego podparcia) | general ohp | tak | — |
| Handstand Push Up | nie | bez figury | none (open) | — | — |
| Kettlebell Arnold Press | tak | ok (jedna ręka, rotacja −75 → 80°) | general ohp | tak | — |
| Kettlebell Press | tak | ok (jedna ręka, druga nieruchomo) | general ohp | tak | — |
| Kettlebell Seated Press | tak | ok w walidacji; siad na ławce z oparciem 85° (dane jak Seated Shoulder Press), jedna ręka | general ohp | tak | **ACG-014** (klasa: nota „Seated on the floor, legs spread”) |
| Landmine Press | tak | ok (oburącz, koniec gryfu 16 → 55 cm przed barkiem, łokieć 141 → 16°) | general press | tak | nota: „usually one arm at a time” — oburącz dopuszczalne |
| Landmine Linear Jammer | tak | ok (wybicie z nóg: kolano 7 → 67 → 7°, tułów do 12°, oburącz) | general press | tak | — |
| Overhead Press (hantle) | tak | ok (hantle przy barkach, przedramię pionowo) | own | — | — |
| Overhead Press (sztanga) | tak | ok (chwyt 52 cm / barki 38, gryf przy przedniej części barków, stopy na podłodze) | own | — | — |
| Pike Push Up | tak | ok (biodra wysoko, dłonie pod barkami, łokieć 15 → 115°, bark y 64,5 → 36,5) | general pushup | tak | — |
| Push Press | tak | ok (ugięcie kolan do 54°, tułów do 10° w przód w ugięciu, wybicie, łokieć 9°) | own | — | OP-8 (a): tułów pochyla się 10° w przód w ugięciu przy `pp.dip` „tułów napięty” |
| Push Press - Behind the Neck | tak | ok (gryf z karku: chwyt 13 cm za barkiem, 92 cm szeroko; ugięcie jak Push Press) | general pushPress | tak | — |
| Seated Barbell Military Press | tak | ok (siad z oparciem, stojaki, sztanga) | general ohp | **nie** (`ohp.seat` „…; hantle przy barkach” przy sztandze) | **ACG-017** |
| Seated Cable Shoulder Press | tak | ok (siad z oparciem, uchwyty z wyciągów) | general ohp | **nie** (`ohp.seat` „hantle przy barkach” przy linkach) | **ACG-017** |
| Seated Shoulder Press (hantle) | tak | ok (plecy na oparciu 85°, stopy na podłodze, hantle przy barkach) | own | — | — |
| See-Saw Press (Alternating Side Press) | tak | ok w walidacji; ręce naprzemiennie, skłon boczny tułowia 0° | general ohp | tak | **ACG-014** (klasa: nota „press one side while leaning the torso to the opposite side” — skłonu nie ma) |
| Single Arm Overhead Press (hantel) | tak | ok (jedna ręka) | general ohp | tak | — |
| Single-Arm Linear Jammer | tak | ok (jedna ręka, wybicie z nóg) | general press | tak | — |
| Standing Barbell Press Behind Neck | tak | ok (gryf z karku 13 cm za barkiem, chwyt 92 cm, łokieć 122 → 16°) | general ohp | tak | — |
| Wyciskanie nad głowę (linki) | tak | ok (uchwyty przy barkach, łokcie w dół) | own | — | — |

## mobility_floor — 22 ćwiczenia, 9 z danymi (karty własne 0; zestawy: `stretch` 20, `mobility` 1; brak 1) — partia 4D @ 9657fde1 (kod jak w 4A)

Pomiary (`keyframeFrame`, u = 0 / 0,5 / 1; 8 póz statycznych z dwóch identycznych klatek, wszystkie na liście `ISOMETRIC`, `poseData.ts:95`): kąty stawów, położenie kolan, kostek, palców, chwytów, barków i głowy, najniższy punkt ciała (−0,3…−2,1 cm — styk z podłogą), nota katalogu (`docs/research/equipment/catalog.json`) a rysunek. Walidacja 9/9 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Arkusz z boku — poza repo.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Butterfly Stretch | tak | ok (stopy razem z ±5, kolana na boki z ±44, dłonie na stopach, tułów 32° w przód — nota „forward lean”) | general stretch | tak | — |
| Cat-Cow | tak | ok (dłonie pod barkami x 60/59, kolana pod biodrami x 12,9; kręgosłup −16 → 26°, głowa w górę w wygięciu) | general mobility | tak | — |
| Child's Pose | tak | ok (kolana szeroko z ±28, miednica nad piętami, czoło przy podłodze — głowa y 9,8; ręce wzdłuż ciała, dłonie x −2) | general stretch | tak | wariant z rękami do tyłu — zgodny z notą „sit back on the heels” |
| Downward Facing Balance | nie | bez figury | none (open) | — | — |
| IT Band and Glute Stretch | nie | bez figury | general stretch | tak | — |
| Intermediate Groin Stretch | nie | bez figury | general stretch | tak | — |
| Kneeling Forearm Stretch | nie | bez figury | general stretch | tak | — |
| Kneeling Hip Flexor Stretch | tak | ok (przednie kolano 91°, cała stopa na podłodze, tylne kolano na podłodze y 7,9, biodro tylne w wyproście 15,7°) | general stretch | tak | tułów 12° w przód (bark x 10,4 przed miednicą) — zestaw nie mówi o wyprostowanym tułowiu; do recenzji ruchu, bez znaleziska |
| Middle Back Stretch | nie | bez figury | general stretch | tak | nota: stojąc — rodzina „floor” bez skutku (bez figury) |
| Peroneals Stretch | nie | bez figury | general stretch | tak | — |
| Posterior Tibialis Stretch | nie | bez figury | general stretch | tak | — |
| Runner's Stretch | nie | bez figury | general stretch | tak | — |
| Seated Calf Stretch | tak | ok (obie nogi proste — kolano 6°, palce w górę, guma z zaczepem na stopach, dłonie trzymają gumę) | general stretch | tak | nota „one leg extended” — obie nogi; wariant równoważny, bez znaleziska |
| Seated Floor Hamstring Stretch | tak | ok (prawa noga prosta 7,5°, lewa stopa przy wewnętrznej stronie prawego uda z −1…−7, dłonie na goleni x 52) | general stretch | tak | — |
| Seated Rotation Stretch | nie | bez figury | general stretch | tak | — |
| Side Lying Groin Stretch | nie | bez figury | general stretch | tak | — |
| Side-Lying Quad Stretch | tak | ok (górne kolano 141°, dłoń trzyma kostkę — chwyt = kostka, biodro 10,9°; dolna ręka pod głową) | general stretch | tak | — |
| Supine Figure-Four Stretch | nie | bez figury | general stretch | tak | — |
| Supine Hamstring Stretch | tak | ok (noga pionowo, kolano 8,6°, stopa 99,7 cm; druga noga zgięta, stopa na podłodze; dłonie na tyle uda y 34) | general stretch | tak | nota: pasek na stopie — rysunek: dłonie na udzie (wariant bez paska, `sprzet` tylko podłoga); bez znaleziska |
| Supine Spinal Twist | nie | bez figury | general stretch | tak | — |
| The Straddle | tak | ok (nogi proste 7,9°, rozkrok kostki z ±62, palce w górę, tułów 50° w przód, dłonie na podłodze między nogami) | general stretch | tak | — |
| Upper Back Stretch | nie | bez figury | general stretch | tak | — |

## chest_fly — 20 ćwiczeń, 17 z danymi (karty własne 2; zestawy: `fly` 10, `pullover` 4, `raiseSide` 1; brak 3) — partia 4D

Pomiary co u = 0,05: łokieć (stały kąt — `fly.elbows`), uniesienie i odwiedzenie ramienia, chwyt wobec barku (y, x, z), tułów, stopy, najniższy punkt ciała, ciężar; punkty kluczowe u = 0 / 0,5 / 1. Wspólne dla rozpiętek leżących: łokieć 13,7–18,2°, dół — dłonie 8 cm nad barkiem (y 61,2 / bark 53,2), góra — dłonie nad klatką. Walidacja 17/17 bez błędów, `jakosc-raport` 0 naruszeń (z `--styk-wszystkie` R17 tylko na 2 figurach ławki ujemnej — ciało 34–42 cm nad podłogą na ławce, fałszywy alarm jak w 4B).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Around The Worlds | nie | bez figury | none (open) | — | — |
| Band Chest Fly | tak | ok (dane jak Cable Fly, guma z tyłu na wysokości klatki) | general fly | tak | — |
| Bent-Arm Barbell Pullover | tak | ok (łokieć stały 50°, ramię 70 → 165°, gryf za głową y 42 — talerze nad podłogą) | general pullover | tak | zestaw bez `po.arms` — słusznie (ręce ugięte) |
| Cable Fly | tak | ok w walidacji (bloczki na wysokości barków — chwyt y 139,5 = bark; łokieć 13,7–18,2°); **tułów 0° przez cały ruch** | own | — | **ACG-018** (`fly.posture` „lekkie pochylenie w przód”) |
| Cable Fly (high to low) | tak | ok (dłonie z wysokości barków y 142,6 w dół do 107,6, łokieć 13–19°) | general fly | tak | — |
| Cable Fly (low to high) | tak | ok w walidacji (dłonie z y 121 do 170,3 — 31 cm nad barkiem, ramię 119° w zgięciu) | general fly | tak | OP-10 (wysokość końca ruchu) |
| Chest Fly (hantle) | tak | ok (płaska ławka, dół: hantle 8 cm nad barkiem, łokieć 13,7–18,2°, stopy na podłodze) | own | — | karta zgodna |
| Crucifix | tak | ok, poza statyczna (2 identyczne klatki, ręce w bok 90°, łokieć 10°, hantle) | general raiseSide | tak* | `lat.height` „Unoś…” — w rysunku nic nie jest unoszone (wytrzymanie); nie ma na liście `ISOMETRIC`, katalog `weight_time` — strażnik `tests/figures-v2-data.test.tsx:53` złapie przy włączeniu (jak Hollow Hold) |
| Decline Dumbbell Fly | tak | ok (ławka ujemna −20°, stopy zaczepione y 59, ramię 70–90°) | general fly | tak | R17 z `--styk-wszystkie` — fałszywy alarm |
| Flat Bench Cable Fly | tak | ok (ruch jak Chest Fly, uchwyty z dolnych wyciągów) | general fly | tak | — |
| Front Raise And Pullover | tak | ok (proste ręce: łokieć 6,5–15°, gryf z x 4 nad biodrami za głowę x −113) | general pullover | tak | nota: start z gryfem na udach — w rysunku gryf 34 cm nad miednicą; bez znaczenia dla ruchu |
| Incline Chest Fly (hantle) | tak | ok (oparcie 35°, ramię 90–145°) | general fly | tak | — |
| Incline Cable Fly | tak | ok (jak Incline Chest Fly, dolne wyciągi) | general fly | tak | — |
| Machine Pullover | nie | bez figury | none (open) | — | — |
| One-Arm Flat Bench Dumbbell Fly | tak | ok (jedna ręka, druga odwiedziona nieruchomo bez ciężaru) | general fly | tak | — |
| Pec Deck | tak | ok (siad z oparciem 80°, ręce na wysokości barków y 103,8, łokieć 14–17°) | general fly | tak | — |
| Pullover (hantel) | tak | ok (jeden hantel oburącz, łokieć 11,5–15,2°, ramię 60 → 163°) | general pullover | tak | — |
| Single Arm Cable Fly | tak | ok (jedna ręka, druga na biodrze) | general fly | tak | — |
| Svend Press | nie | bez figury | none (open) | — | — |
| Wide-Grip Decline Barbell Pullover | tak | ok (ławka ujemna, proste ręce, gryf za głowę) | general pullover | tak | R17 z `--styk-wszystkie` — fałszywy alarm |

## core_standing — 19 ćwiczeń, 16 z danymi (karty własne 2; zestawy: `rotation` 7, `sideBend` 3, `windmill` 3; brak 4) — partia 4D

Pomiary co u = 0,05: skłon boczny (`przechylTulowia`), skręt i pochylenie tułowia z klatek, łokieć, uniesienie ramienia, kolana, stopy, chwyty (strona ruchu wobec wyciągu), miednica; punkty kluczowe u = 0 / 0,5 / 1 (bark, chwyt, głowa, kostki). Walidacja 16/16 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Wszystkie skłony i obroty pokazują jedną stronę (pętla wahadło) — jak w zrecenzowanych rodzinach.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Side Bend | tak | ok (gryf na karku x −12,8, skłon 0 → 28°, bez skrętu i pochylenia) | general sideBend | tak | — |
| Bent Press | tak | ok (hantel stoi y 144 → 158, tułów schodzi pod ciężar: miednica w bok x −27, łokieć 146 → 23°; dolna dłoń do y 15) | general windmill | tak | — |
| Bosu Ball Cable Crunch With Side Bends | tak | ok w walidacji; **siad na kopule Bosu** (miednica y 41, tułów −8 → 24°, skłon 0 → 24°), jedna strona | none (open) | — | **ACG-014** (nota: „Lying on a Bosu”) |
| Cable Judo Flip | tak | ok (lina z dolnego wyciągu z boku, skręt −28 → 30°, dłonie y 99 → 154) | general rotation | tak | — |
| Cable Russian Twists | tak | ok w walidacji; **siad prosto na piłce** (miednica y 64,5, biodro 60°, tułów 0°), skręt ±36°, uchwyt oburącz | general rotation | tak | **ACG-014** (nota: „upper back on a stability ball”) |
| Cable Woodchop | tak | ok (lina z górnego wyciągu: dłonie y 147 → 87 na drugą stronę, skręt 28 → −30°, tułów do 18°) | general rotation | tak | — |
| Double Kettlebell Windmill | tak | ok (jak Kettlebell Windmill; drugi kettlebell w dolnej dłoni, y 76 → 32) | general windmill | tak | — |
| Kettlebell Figure 8 | nie | bez figury | none (open) | — | — |
| Kettlebell Windmill | tak | ok (górna ręka nad barkiem: chwyt 11 cm od pionu nad barkiem w dole, łokieć 6–13°; biodra w tył x −18, dolna dłoń do y 32) | general windmill | tak | `wm.eyes` — kierunek wzroku niezmierzony |
| Landmine Rotation | tak | ok (koniec gryfu oburącz y 100, skręt ±32°) | general rotation | tak | — |
| Medicine Ball Full Twist | tak | ok (piłka oburącz, skręt ±40°, stopy stałe) | general rotation | tak | nota: z partnerem — rysunek bez partnera; ruch ten sam, bez znaleziska |
| One-Arm High-Pulley Cable Side Bends | tak | ok (uchwyt nad głową y 198–202, skłon −26° od wyciągu — wyciąg z +52, dłoń do z −32) | general sideBend | tak | — |
| Pallof Press | tak | ok (wyciąg z boku z 75 na wysokości klatki, dłonie x 16 → 58 prosto przed siebie, z ±3, skręt 0°) | own | — | karta zgodna |
| Pallof Press With Rotation | tak | ok (wypchnięcie i obrót −30° od wyciągu) | general rotation | tak | — |
| Russian Twist | tak | ok w walidacji (siad, tułów −45° w tył, kolana 131°, stopy na podłodze, skręt ±38°); **dłonie złączone bez ciężaru** (`sprzet` tylko podłoga) | own | — | **ACG-018** (`rt.setup` „ciężar trzymaj przed klatką”); „lekko w tył” przy 45° — do recenzji ruchu |
| Seated Barbell Twist | nie | bez figury | general rotation | tak | — |
| Side Bend (hantel) | tak | ok (hantel w prawej, skłon 28° w stronę ciężaru, druga dłoń na biodrze) | none (open) | — | figura bez wskazówek |
| Spell Caster | nie | bez figury | none (open) | — | — |
| Weighted Ball Side Bend | tak | ok w walidacji; **siad na piłce z hantlem w opuszczonej ręce**, skłon 26° | general sideBend | tak | **ACG-014** (nota: „Side on a stability ball, plate held by the head”) |

## sled_throw — 19 ćwiczeń, 8 z danymi (karty własne 1; zestawy: `mbThrow` 4, `sled` 3, `squat` 1, `tgu` 1; brak 9) — partia 4D

Pomiary co u = 0,05 i tor piłki u = 0 / 0,2 / … / 1 (rzuty: pętla jednokierunkowa; sanie: `cykl_lustro`): łokieć, kolano, biodro, tułów, stopy (wspięcie, wybicie), miednica, chwyt i piłka, kierunek rzutu wobec ustawienia stóp. Walidacja 8/8 bez błędów, `jakosc-raport` 0 naruszeń (z `--styk-wszystkie` R17 na 6 rzutach — 1,1–1,3 cm przy wspięciu na palce w wyrzucie, jak U-4C-1). Model nie ma wypuszczenia przedmiotu — piłka zostaje w dłoniach do końca pętli (U-4D-1).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Backward Drag | nie | bez figury | general sled | tak | — |
| Backward Medicine Ball Throw | tak | ok (piłka z dołu między nogami y 31 → łukiem przed ciałem → nad głowę x −0,4 y 217,5; przysiad kolano 100° → wyprost i wspięcie, pięty y 21) | general mbThrow | tak | U-4D-1 |
| Bear Crawl Sled Drag | nie | bez figury | none (open) | — | — |
| Medicine Ball Chest Pass | nie | bez figury | none (open) | — | — |
| Medicine Ball Scoop Throw | tak | ok (półprzysiad kolano 102°, piłka y 45 → 201 przed ciałem, wyprost i wspięcie) | general mbThrow | tak | U-4D-1 |
| Medicine Ball Slam | tak | ok (piłka nad głową y 215 → w dół przed ciałem do y 51; tułów do 52°, kolano do 58°, kręgosłup 0° — plecy proste) | own | — | karta zgodna co do ruchu; „rzuć w podłogę” — piłka nie opuszcza dłoni (U-4D-1) |
| One-Arm Medicine Ball Slam | tak | ok (jak Medicine Ball Slam, piłka w prawej dłoni) | general mbThrow | — | zestaw bez zdań (`ok` i `err` puste) — nic się nie pokaże; jak ćwiczenie bez wskazówek |
| Sled Drag (Harness) | tak | ok (marsz w przód, sanie za plecami x −170 na pasie, tułów 34°, kolano 13–129°) | general sled | tak | — |
| Sled Forward Drag with Press | nie | bez figury | none (open) | — | — |
| Sled Overhead Backward Walk | nie | bez figury | none (open) | — | — |
| Sled Push | tak | ok (dłonie na słupkach sań x 75 y 88, tułów 32,5°, łokieć 28°, marsz z lustrem) | general sled | tak | — |
| Sledgehammer Swings | nie | bez figury | none (open) | — | — |
| Spider Crawl | nie | bez figury | none (open) | — | — |
| Standing Two-Arm Overhead Throw | tak | ok (piłka zza głowy x −22 → przed ciało x 70 na wysokości y 184–213, tułów −8 → 18°, wspięcie) | general mbThrow | tak | U-4D-1 |
| Supine Chest Throw | nie | bez figury | none (open) | — | — |
| Supine One-Arm Overhead Throw | nie | bez figury | none (open) | — | — |
| Supine Two-Arm Overhead Throw | nie | bez figury | none (open) | — | — |
| Turkish Get Up | nie | bez figury | general tgu | tak | — |
| Wall Ball | tak | ok (piłka przy klatce y 130, przysiad kolano 102°, wstanie i wyrzut nad głowę y 213,5; ściana x 95) | general squat | tak | U-4D-1 (piłka nie dolatuje do ściany) |

## kb_ballistic — 17 ćwiczeń, 16 z danymi (karty własne 1; zestawy: `oly` 9, `pushPress` 5, `kbSwing` 1; brak 1) — partia 4D

Pomiary co u = 0,05: kolano, łokieć, biodro, tułów, kręgosłup, pięty (wspięcie), miednica, chwyt i ciężar; przebieg kolana w czasie (ugięcie, wybicie, ponowne ugięcie w podrzucie), kolano wobec osi stopy w rozkroku sumo, położenie kettlebella w zamachu wobec kolan. Wspólne: kręgosłup 0° we wszystkich (plecy proste), zamach — biodro do 86°, kolano do 45°, tułów do 62°. Walidacja 16/16 bez błędów, `jakosc-raport` 0 naruszeń (z `--styk-wszystkie` R17 na 9 figurach — 1,1–1,4 cm przy wspięciu na palce w wybiciu, jak U-4C-1).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Bottoms-Up Clean From The Hang Position | tak | ok (kettlebell dnem do góry — `dzwon` `wzdluz_gora`; z zwisu y 53 do barku y 145, przedramię pionowo) | general oly | **nie** (`oly.close`, `oly.mis` „Sztanga…”) | **ACG-017** (rozszerzenie) |
| Double Kettlebell Clean | tak | ok (dwa kettlebelle do pozycji przy barkach y 130, łokieć 132°) | general oly | **nie** („Sztanga…”) | **ACG-017** |
| Double Kettlebell Jerk | tak | ok (ugięcie kolano 35°, wybicie z wspięciem — pięty y 21, ponowne ugięcie pod ciężar do 27° przy prostych rękach y 200) | general pushPress | tak | — |
| Double Kettlebell Push Press | tak | ok (ugięcie 35°, wybicie, ręce kończą ruch, nogi proste w górze; tułów 2–3°) | general pushPress | tak | różnica z Jerk poprawna (bez ponownego ugięcia) |
| Double Kettlebell Snatch | tak | ok (dwa kettlebelle z zawieszenia nad głowę y 201, łokieć 8°, wspięcie) | general oly | **nie** („Sztanga…”) | **ACG-017** |
| Dumbbell Clean | tak | ok (jak Double Kettlebell Clean, hantle) | general oly | **nie** („Sztanga…”) | **ACG-017** |
| Kettlebell Clean | tak | ok (jedna ręka do pozycji przy barku y 130; druga ręka wolno w przód) | general oly | **nie** („Sztanga…”) | **ACG-017**; start z kettlebellem przed nogami (x 30), bez przejścia między nogami — wariant |
| Kettlebell Pirate Ships | nie | bez figury | none (open) | — | — |
| Kettlebell Snatch | tak | ok (jedna ręka nad głowę y 200,7, łokieć 5°, wspięcie pięty y 18) | general oly | **nie** („Sztanga…”) | **ACG-017** |
| Kettlebell Sumo High Pull | tak | ok (szeroki rozkrok, kolano 20° na zewnątrz osi stopy, kettlebell oburącz y 39 → 148, łokcie wysoko 134°) | general oly | **nie** (`oly.close` „Sztanga…”) | **ACG-017**; `sumo.kneesOut` zgodne z rysunkiem |
| Kettlebell Swing | tak | ok (zamach: uchwyt między nogami x −7 za linią kolan x 10, y 60 → przed ciałem y 151; biodra wypchnięte, kolana proste w górze, ręce 0–18°) | own | — | karta zgodna; góra 11 cm nad barkiem (wysokość oczu) — mieści się w „unosi się przed tobą” |
| One-Arm Kettlebell Clean and Jerk | tak | ok (zarzut jedną ręką do barku, potem podrzut z wykrokiem: kolana 80° / 96°) | general oly | **nie** („Sztanga…”) | **ACG-017** |
| One-Arm Kettlebell Jerk | tak | ok (jak Double Kettlebell Jerk, jedna ręka; ponowne ugięcie do 27°) | general pushPress | tak | — |
| One-Arm Kettlebell Push Press | tak | ok (jak Double Kettlebell Push Press, jedna ręka) | general pushPress | tak | — |
| One-Arm Kettlebell Split Jerk | tak | ok (odbiór w wykroku: kolana 80° / 96°, miednica y 68) | general pushPress | tak | — |
| One-Arm Kettlebell Swings | tak | ok (jak Kettlebell Swing, jedna ręka; druga wolno w przód) | general kbSwing | tak | — |
| Snatch (hantel) | tak | ok (jak Kettlebell Snatch, hantel) | general oly | **nie** („Sztanga…”) | **ACG-017** |

## leg_isolation — 14 ćwiczeń, 8 z danymi (karty własne 4, w tym 1 bez figury; zestawy: `legCurl` 5, `bridge` 2, `legExt` 1; brak 2) — partia 4D

Pomiary co u = 0,05 i punkty u = 0 / 0,5 / 1: kolano, biodro (`lcurl.still` — udo nieruchomo), tułów, stopy, położenie kolana wobec osi dźwigni maszyny, styki (siedzisko, oparcie). Walidacja 8/8 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Glute Ham Raise | nie | bez figury | general legCurl | tak | — |
| Leg Curl | tak | ok (siad z oparciem 80°, kolano w osi dźwigni x 50,6 y 48, kolano 11 → 100°, biodro stałe 80–83°) | own | — | karta zgodna |
| Leg Curl (hantel) | nie | bez figury | general legCurl | tak | — |
| Leg Extension | tak | ok (kolano w osi dźwigni, 90 → 11°, udo stałe) | own | — | karta zgodna |
| Lying Leg Curl | tak | ok (leżenie przodem, kolano w osi dźwigni x −42, kolano 3 → 100°, biodro 8–9° stałe) | own | — | karta zgodna (`llc.hips`) |
| Nordic Curl | nie | bez figury | own | — | karta bez figury v2 (partia 3) |
| Reverse Nordic | nie | bez figury | none (open) | — | — |
| Seated Band Hamstring Curl | tak | ok w walidacji; **udo opada przy wyproście**: kolano y 49,6 → 31,1 przy biodrze y 48 (biodro 92 → 67°), pięta sunie po podłodze; skrzynia tylko pod pośladkami (x −40…−1) | general legCurl | **nie** (`lcurl.still` „Uda i biodra nieruchomo — ruch tylko w kolanach”) | **ACG-019** |
| Single-Leg Leg Extension | tak | ok (jak Leg Extension, druga noga zgięta 90°) | general legExt | tak | — |
| Sissy Squat | nie | bez figury | none (open) | — | — |
| Slider Hamstring Curl | tak | ok (mostek na barkach, ślizgacze pod piętami x 52 → 81, kolano 12 ↔ 100°, biodro −16 … 28°) | general bridge | **nie** (`ht.rigid` „Ruch tylko w biodrach”; ruch jest głównie w kolanach) | **ACG-019** |
| Stability Ball Hamstring Curl | nie | bez figury | general bridge | **nie** (jw., po nazwie) | ACG-019 (teoretyczny — bez figury zestaw niewidoczny) |
| Standing Cable Leg Curl | tak | ok (mankiet na kostce, wyciąg z przodu x 95, kolano 9 → 95°, biodro stałe 10–12°) | general legCurl | tak | — |
| Standing Leg Curl | tak | ok (oparcie tułowiem 24°, kolano 9 → 95°, biodro stałe 25–28°) | general legCurl | tak | — |

## row — 13 ćwiczeń, 12 z danymi (karty własne 6, w tym 3 ukryte w 1.1; zestawy: `rowBent` 5, `row` 2; brak 0) — partia 4D

Pomiary co u = 0,05: łokieć, uniesienie i odwiedzenie ramienia, kolano, biodro, tułów, kręgosłup (0° we wszystkich), stopy, chwyt i ciężar; w pozycji górnej odległość łokcia od linii miednica–bark (`row.elbowsPast`, `row1.top`; tułów ma ok. 10 cm grubości od osi). Walidacja 12/12 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Karty ukryte w 1.1 (Bent Over Row ×2, T-Bar Row) — rysunek bez wskazówek, w 1.0 karty z figurą v1 (partia 3).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Rear Delt Row | tak | ok (szeroki chwyt z ±36, łokcie odwiedzone do 85°, gryf do górnej części klatki) | general rowBent | tak | nota: tułów równolegle — w rysunku 55° (jak pozostałe wiosłowania w opadzie); ruch właściwy, bez znaleziska |
| Bent Over Row (hantle) | tak | ok (tułów 55°, kolano 26°, łokieć 18 → 117°, łokieć w górze 18,6 cm ponad linią pleców) | own (ukryta w 1.1) | — | — |
| Bent Over Row (linki) | tak | ok (jak hantle, uchwyty z dolnych wyciągów) | general rowBent | tak | — |
| Bent Over Row (sztanga) | tak | ok (jak hantle, gryf od wyprostu rąk do brzucha) | own (ukryta w 1.1) | — | — |
| Chest Supported Row | tak | ok (klatka na ławce 45°, hantle z wyprostu rąk, łokcie 22 cm ponad linią pleców) | own | — | karta zgodna |
| Lying T-Bar Row | tak | ok (ruch jak Chest Supported Row, dźwignia z uchwytem oburącz) | general row | tak | — |
| Meadows Row | nie | bez figury | general rowBent | tak | — |
| One Arm Row (hantle) | tak | ok (kolano i dłoń na ławce — kolano 68°, tułów 75°, hantel y 36 → 79, łokieć 18,8 cm ponad linią pleców) | own | — | karta zgodna („mniej więcej równolegle” przy 75°) |
| Pendlay Row | tak | ok (tułów 80°, gryf startuje z podłogi y 23,2 = promień talerza, łokieć do 143°, tułów stały) | own | — | karta zgodna (`pendlay.floor`, `pendlay.mis.torso`) |
| Reverse Grip Bent Over Row | tak | ok (podchwyt, ruch jak sztanga) | general rowBent | tak | — |
| Seal Row (sztanga) | tak | ok (leżenie przodem na wysokiej ławce top 80, nogi na ławce, gryf z y 26 do 65,5) | general row | tak | łokieć w górze 7,7 cm od osi — ok. na linii pleców (`row.elbowsPast` na granicy) |
| Smith Machine Bent Over Row | tak | ok (tułów 78°, gryf w prowadnicy y 25 → 70) | general rowBent | tak | — |
| T-Bar Row | tak | ok (dźwignia z końca przy podłodze x −85, tułów 55°) | own (ukryta w 1.1) | — | — |

## calf_raise — 13 ćwiczeń, 12 z danymi (karty własne 3; zestawy: `calf` 9; brak 1) — partia 4D

Pomiary u = 0 / 0,5 / 1: pięta i palce (y) obu stóp — czy pięta schodzi poniżej palców (rozciągnięcie, `calf.move`), kolano (`calf.knees`), biodro, miednica, chwyt; sprzęt podparcia stóp (skrzynia/stopień). Walidacja 12/12 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Na stopniu (6 figur): pięta w dole 4,3 cm poniżej palców, w górze 17,7 cm nad nimi, kolano 5,2–5,6°.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Band Calf Raise | tak | ok (płaska podłoga, pięta 0 → 17,7, guma pod stopami, uchwyty przy barkach — nota) | general calf | tak* | `calf.move` „opuść pięty, aż poczujesz rozciągnięcie” — na podłodze pięta nie schodzi niżej; wariant bez stopnia zgodny z notą |
| Barbell Seated Calf Raise | tak | ok w walidacji (siad, gryf na kolanach, kolano 90°); **stopy na podłodze bez podestu**, pięta 0 → 14 | general calf | **nie** (`calf.move` rozciągnięcie, `calf.mis.partial` „Skrócony zakres”) | **ACG-020**; nota: „toes on a block” |
| Calf Raise (linki) | tak | ok (płaska podłoga, uchwyty z dolnych wyciągów) | general calf | tak* | jak Band Calf Raise |
| Calf Raise (sztanga) | tak | ok (gryf na karku, palce na skrzyni 6 cm, pięta 4,3 cm poniżej palców w dole) | general calf | tak | — |
| Donkey Calf Raise | tak | ok (pochylenie w biodrach 78–86°, dłonie na podporze, palce na skrzyni) | general calf | tak | — |
| Dumbbell Seated One-Leg Calf Raise | tak | ok w walidacji (hantel na prawym kolanie, jedna noga); **bez podestu**, pięta 0 → 14 | general calf | **nie** (jw.) | **ACG-020**; nota: „toes on a block” |
| Seated Calf Raise | tak | ok w walidacji (maszyna, wałek na kolanach, kolano 90°); **stopy na podłodze bez podestu**, pięta 0 → 14 | own | — | **ACG-020** (`calf.move` „opuść pięty, aż poczujesz rozciągnięcie”) |
| Seated Calf Raise (hantle) | tak | ok w walidacji (hantle na kolanach); **bez podestu**, pięta 0 → 14 | general calf | **nie** (jw.) | **ACG-020** |
| Single Leg Calf Raise | tak | ok (jedna noga na stopniu, druga zgięta 86°, dłoń na ścianie) | general calf | tak | — |
| Smith Machine Calf Raise | tak | ok (dane jak Calf Raise (sztanga), gryf w prowadnicy) | general calf | tak | — |
| Smith Machine Reverse Calf Raise | nie | bez figury | none (open) | — | — |
| Standing Calf Raise | tak | ok (palce na podeście 6 cm, dźwignia przy miednicy, kolana proste 5°) | own | — | karta zgodna (`calf.edge`, `calf.knees`) |
| Łydki na stopniu | tak | ok (stopień 8 cm, dłoń przy podporze, pięta 4,3 cm poniżej palców w dole) | own | — | karta zgodna |

## forearm — 13 ćwiczeń, 11 z danymi (karty własne 0; zestawy: `wrist` 8, `curl` 1; brak 4) — partia 4D

Pomiary co u = 0,05: zgięcie nadgarstka (`wristFlex`), rotacja przedramienia, łokieć, ramię, siad (kolano, miednica), chwyt; podparcie przedramienia na udzie u = 0 / 1 (łokieć–nadgarstek poziomo y ≈ 62 nad udem, dłoń za kolanem). Walidacja 11/11 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Wspólne dla 7 uginań w siadzie: tułów 43,5°, łokieć stały 117°, przedramię na udzie.

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Reverse Wrist Curl | tak | ok (nachwyt — rotacja −78°, nadgarstek −48 → 40°) | general wrist | tak | — |
| Barbell Wrist Curl | tak | ok (podchwyt 78°, nadgarstek −32 → 52°, przedramię na udzie) | general wrist | tak | — |
| Behind-the-Back Barbell Wrist Curl | tak | ok (stanie, gryf za plecami x −18, nadgarstek −30 → 50°, łokieć 0–22°) | general wrist | tak | — |
| Cable Wrist Curl | tak | ok (jak Barbell Wrist Curl, drążek z dolnego wyciągu z przodu) | general wrist | tak | — |
| Dumbbell Lying Pronation | tak | ok w walidacji; **siad z przedramieniem na udzie** (miednica y 53,8, kolano 86°), rotacja −70 ↔ 70° | none (open) | — | **ACG-014** (nota: „Prone on a bench”); dane identyczne z Supination (wahadło pokazuje oba kierunki) |
| Dumbbell Lying Supination | tak | ok w walidacji; jw. | none (open) | — | **ACG-014** (nota: „Lying on a bench”) |
| One-Arm Dumbbell Reverse Wrist Curl | tak | ok (jedna ręka, nachwyt) | general wrist | tak | — |
| One-Arm Dumbbell Wrist Curl | tak | ok (jedna ręka, podchwyt) | general wrist | tak | — |
| Plate Pinch | nie | bez figury | none (open) | — | — |
| Reverse Plate Curls | tak | ok (talerz oburącz nachwytem, łokieć 24 → 123°, ramię przy tułowiu 6–8°, nadgarstek 0°) | general curl | tak | — |
| Reverse Wrist Curl (hantle) | tak | ok (nachwyt, dwa hantle) | general wrist | tak | — |
| Wrist Curl (hantle) | tak | ok (podchwyt, dwa hantle) | general wrist | tak | — |
| Wrist Roller | nie | bez figury | none (open) | — | — |

## hip_bridge — 11 ćwiczeń, 10 z danymi (karty własne 3; zestawy: `bridge` 7; brak 1) — partia 4E

Pomiary co u = 0,25 i punkty u = 0 / 1: biodro, kolano, odchylenie linii bark–biodro–kolano w górze, kręgosłup (0° we wszystkich), pięty i palce, ciężar wobec miednicy, styk z ławką i piłką (odległość tułowia od środka piłki). Walidacja 10/10 bez błędów, `jakosc-raport` 0 naruszeń (z `--styk-wszystkie` R17 tylko Glute Bridge (sztanga) 1,0 cm — na progu). Zakres kolana we wszystkich mostkach 16–19° (geometria: stopy i barki stoją, miednica się unosi).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Frog Pump | tak | ok (kolana na boki z ±22, pięty razem z ±1,6, palce na zewnątrz z ±16; biodro 43 → −9°, w górze linia 4°) | general bridge | tak | podeszwy nie złączone (pięty razem) — do recenzji ruchu |
| Glute Bridge | tak | ok (biodro 47 → −10°, w górze miednica 3,5 cm nad linią bark–kolano (9°), stopy płasko) | own | — | karta zgodna (figura v2; ACG-007 dotyczy figury v1) |
| Glute Bridge (sztanga) | tak | ok (jak Glute Bridge; gryf na biodrach x −14 y 41 przy miednicy x −5 y 31, dłonie na gryfie) | general bridge | tak | R17 1,0 cm — na progu |
| Hip Thrust (hantel) | tak | ok (łopatki na ławce top 43, biodro 61 → −7°, w górze barki y 53 = miednica y 53, kolano 82°; hantel na biodrach, dłonie na nim) | own | — | karta zgodna (`ht.dbSetup`, `ht.hold`) |
| Hip Thrust (sztanga) | tak | ok (jak hantel; gryf 13 cm nad miednicą, dłonie na gryfie) | own | — | karta zgodna (podkładka — „najlepiej”) |
| London Bridges | nie | bez figury | none (open) | — | — |
| Machine Hip Thrust | tak | ok (jak Hip Thrust; prowadnica, dłonie na uchwytach) | general bridge | tak | — |
| Single Leg Glute Bridge | tak | ok (prawa stopa na podłodze, lewa noga w górze — kolano 31°) | general bridge | tak | — |
| Single Leg Hip Thrust | tak | ok (jw., łopatki na ławce) | general bridge | tak | — |
| Smith Machine Hip Thrust | tak | ok (gryf w prowadnicy x −4) | general bridge | tak | — |
| Stability Ball Hip Bridge | tak | ok w walidacji (łopatki na piłce r 32,5 — tułów 32 cm od środka przez cały ruch); **w górze kolano 42°** (start 92°), kolano 14 cm za kostką, miednica 6 cm nad linią bark–kolano (14°) | general bridge | tak* | **OP-11** |

## cable_row — 10 ćwiczeń, 9 z danymi (karty własne 3; zestawy: `row` 5, `faceRow` 1; brak 1) — partia 4E

Pomiary u = 0 / 0,5 / 1: łokieć, uniesienie i odwiedzenie ramienia, tułów (0° stały we wszystkich), kolano, stopy, chwyt wobec barku i miednicy, położenie bloczka i kierunek linki, styki (siedzisko, oparcie, podest). Walidacja 9/9 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Cable Rope Rear-Delt Rows | tak | ok (siad, lina do szyi y 101–107 przy barku 103, łokcie szeroko — odwiedzenie 57–74°) | general faceRow | tak | bloczek dolny y 55 — linka skośnie do dłoni (U-4E-2) |
| Face Pull | tak | ok (bloczek y 150 ≥ bark 140; lina y 147,5 stale — wysokość brody; łokcie w tył x −18 na wysokości barków) | own | — | karta zgodna; przedramiona poziomo, bez rotacji zewnętrznej — do recenzji ruchu |
| Kneeling High Pulley Row | tak | ok (klęk, bloczek górny y 190, drążek y 104 → 74, łokieć 19 → 123°) | general row | tak | nota „to the chest” — koniec 24 cm nad miednicą (górna część brzucha); start: ręce poziomo przy lince pod kątem ok. 56° (U-4E-2) |
| Leverage High Row | tak | ok (siad z oparciem, dźwignia: uchwyty y 116 → 81, łokieć 16 → 130°) | general row | tak | — |
| Machine Row | tak | ok w walidacji; **plecy na oparciu** (ławka 80°, styk `back`), bez podparcia klatki | general row | tak | **ACG-014** (nota: „Chest-supported seated row machine”) |
| Seated Cable Row | tak | ok (siad, stopy na podeście, kolana 25°, drążek y 85 → 65 do brzucha, łokcie przy tułowiu — odwiedzenie 2–12°) | own | — | karta zgodna |
| Single Arm Cable Row | tak | ok (stanie, jedna ręka y 137 → 102, druga dłoń przy biodrze) | general row | tak | — |
| Sled Row | nie | bez figury | none (open) | — | — |
| Standing Cable Row | tak | ok (stanie, drążek y 137 → 102) | general row | tak | bloczek y 100, start: ręce na wysokości barków (U-4E-2) |
| Wiosłowanie na linkach (siedząc) | tak | ok (dane jak Seated Cable Row) | own | — | karta zgodna |

## pulldown — 8 ćwiczeń, 8 z danymi (karty własne 2; zestawy: `vpull` 6; brak 0) — partia 4E

Pomiary u = 0 / 1 i co u = 0,05: chwyt w górze i w dole wobec barku (siad: bark y 105), łokieć, odwiedzenie, tułów, styki, położenie wyciągu. Walidacja 8/8 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Wszystkie ćwiczenia w siadzie mają ławkę z oparciem 85° (styk plecy i głowa) i nie mają wałków na udach — model nie ma takiego elementu (`contract.ts:198`, lista `rodzaj`).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Close-Grip Front Lat Pulldown | tak | ok (chwyt z ±11, drążek y 167 → 88 — 17 cm pod barkiem, łokieć 19 → 141°) | general vpull | tak | `lpd.toChest` — dół na wysokości środka mostka, granica „górnej części klatki” |
| Full Range-Of-Motion Lat Pulldown | tak | ok (dwa wyciągi z ±60, uchwyty y 167 → 88, łokcie do boków) | general vpull | tak | nota: uchwyty skrzyżowane — w rysunku każda dłoń ze swojego wyciągu (bez zdania w zestawie) |
| Lat Pulldown | tak | ok (drążek y 166 → 97 — 8 cm pod barkiem, łokieć 19 → 140°, tułów −5°); **ławka z oparciem, bez wałków na udach** | own | — | **ACG-018** (`lpd.thighs` „ustaw wałki tak, żeby mocno przytrzymywały uda”) |
| Single Arm Lat Pulldown | tak | ok (jedna ręka, druga dłoń na udzie) | general vpull | tak | — |
| Straight Arm Pulldown | tak | ok (stanie, tułów 15°, łokieć 12–20° — konwencja „prosto”, drążek y 183 → 77 do ud) | own | — | karta zgodna |
| Underhand Lat Pulldown | tak | ok (podchwyt z ±18, y 167 → 88) | general vpull | tak | jak Close-Grip |
| V-Bar Pulldown | tak | ok (uchwyt V z ±7, y 166 → 97) | general vpull | tak | — |
| Wide-Grip Pulldown Behind The Neck | tak | ok (chwyt z ±42, drążek za głową — x 0 przy środku głowy x 12, dół y 109 na karku) | general vpull | tak | — |

## shrug — 8 ćwiczeń, 8 z danymi (karty własne 2; zestawy: `shrug` 5, `row` 1; brak 0) — partia 4E

Pomiary co u = 0,05: uniesienie chwytu (barków), łokieć, uniesienie ramienia, tułów, stopy, położenie gryfu wobec ud; arkusz z boku (u = 0 / 1) dla Middle Back Shrug, Calf-Machine Shoulder Shrug i Smith (PIL, poza repo). Walidacja 8/8 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`). Stojące ze sztangą, hantlami i linkami: tułów 0 → −4,5° w trakcie uniesienia (drobne wobec `shrug.tall` „nieruchomo”).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Barbell Shrug Behind The Back | tak | ok (gryf za udami x −16, uniesienie 8,6 cm, łokieć 3–14°) | general shrug | tak | — |
| Calf-Machine Shoulder Shrug | tak | ok w walidacji; **dłonie na uchwytach prowadnicy** (dane jak Leverage Shrug), bez wałków na barkach; **łokieć 32 → 45°** | general shrug | **nie** (`shrug.tall` „pracują tylko barki”) | **ACG-014** (nota: „shoulder pads loaded … no grip needed”), **ACG-019** (rozszerzenie) |
| Leverage Shrug | tak | ok w walidacji; uchwyty prowadnicy y 78,5 → 87, **łokieć 32 → 45°** | general shrug | **nie** (jw.) | **ACG-019** (rozszerzenie) |
| Middle Back Shrug | tak | ok (przodem na ławce 45° — ustawienie jak Chest Supported Row; hantle cofają się x −38 → −31 i w górę o 6 cm — ściąganie łopatek; łokieć stały 42°) | general row | tak | nota: proste ręce — w rysunku 42° (bez zdania w zestawie) |
| Shrugs (hantle) | tak | ok (hantle przy udach, uniesienie 7,8 cm, łokieć 4–13°) | own | — | karta zgodna |
| Shrugs (linki) | tak | ok (drążek z dolnego wyciągu, dane jak sztanga) | general shrug | tak | — |
| Shrugs (sztanga) | tak | ok (gryf przed udami x 14–17, uniesienie 8,3 cm, łokieć 4–14°) | own | — | karta zgodna |
| Smith Machine Behind the Back Shrug | tak | ok w walidacji; gryf w prowadnicy za udami x −15,5, **łokieć 21 → 38°** | general shrug | **nie** (`shrug.tall`) | **ACG-019** (rozszerzenie) |

## carry — 7 ćwiczeń, 7 z danymi (karty własne 2; zestawy: `carry` 5; brak 0) — partia 4E

Pomiary co u = 0,04 (pętla `cykl_lustro`, marsz w miejscu — miednica x 0): tułów (0° we wszystkich), łokieć, chwyt i ciężar wobec barku (y 137,6), stopy (w każdej klatce co najmniej jedna stopa ≤ 1 cm nad podłogą). Walidacja 7/7 bez błędów, `jakosc-raport` 0 naruszeń (także z `--styk-wszystkie`).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Double Kettlebell Front Rack Carry | tak | ok w walidacji; kettlebelle y 136–142, **łokieć 15,5 cm i dłoń 34 cm przed barkiem** (koniec zarzutu w kb_ballistic: łokieć pod barkiem, dłoń 22 cm) | general carry | tak | **OP-12** |
| Farmer's Walk | tak | ok (hantle przy biodrach y 73–80, łokieć 13–15°) | own | — | karta zgodna |
| Farmer's Walk (Farmers Handles) | tak | ok (uchwyty rysowane jak hantle z ±29) | general carry | tak | sprzęt zastępczy (U-4E-3) |
| Farmer's Walk (trap bar) | tak | ok (gryf sześciokątny y 74–81) | general carry | tak | — |
| Overhead Carry (hantle) | tak | ok (hantle nad głową y 199–205, łokieć 14–15°; dłoń 16 cm przed barkiem — ramię 162°) | general carry | tak | do recenzji ruchu (jak przedramię od pionu w 4C) |
| Rickshaw Carry | tak | ok (rama rysowana jak gryf sześciokątny) | general carry | tak | sprzęt zastępczy (U-4E-3) |
| Suitcase Carry | tak | ok (kettlebell w prawej dłoni y 73,5–81, druga ręka wolno; tułów 0°) | own | — | karta zgodna („ciężar”; nota: hantel) |

## glute_floor — 7 ćwiczeń, 7 z danymi (karty własne 0; zestawy: `hipExt` 5, `hipAbd` 2; brak 0) — partia 4E

Pomiary u = 0 / 1 i zakresy co u = 0,05: biodro, kolano, kręgosłup (0° we wszystkich), miednica (stała we wszystkich), położenie kolana pracującej nogi, dłonie i kolana podporu wobec barku i biodra, styki. Walidacja 7/7 bez błędów, `jakosc-raport` 0 naruszeń (z `--styk-wszystkie` R17 tylko Prone Flutter Kicks — ciało na ławce).

| Ćwiczenie | Dane | Ruch | Karta | Zestaw pasuje | Uwagi / znaleziska |
|---|---|---|---|---|---|
| Cable Kickback | tak | ok (stanie, pochylenie 24°, mankiet na kostce, biodro 36 → −14°) | general hipExt | tak | — |
| Clamshell | tak | ok (leżenie bokiem, kolana 88–90°, górne kolano y 23 → 43, pięty razem, miednica stała) | general hipAbd | tak | palce górnej stopy unoszą się o 10 cm — drobne |
| Donkey Kick | tak | ok (dłonie pod barkami x 60, kolana pod biodrem x 11,6; udo do 11° od linii tułowia, kolano 90–105°) | general hipExt | tak | — |
| Fire Hydrant | tak | ok (kolano w bok z 8,5 → 43 i w górę y 9 → 27, miednica stała) | general hipAbd | tak | — |
| Hip Extension with Bands | tak | ok (stanie, tułów 8°, biodro 22 → −16°); guma między kostkami | general hipExt | tak | nota: guma z zaczepu na jednej kostce — w rysunku pętla na obu (wariant, bez zdania w zestawie) |
| Machine Glute Kickback | tak | ok (dłonie na uchwytach, dźwignia na kostce, biodro 44 → 11°) | general hipExt | tak | — |
| Prone Flutter Kicks | tak | ok (przodem na ławce, biodra przy krawędzi — miednica x −66, koniec ławki x −75; proste nogi ±15,6° naprzemiennie) | general hipExt | tak | R17 — ławka |
