# Lista per ćwiczenie — partia 4A: rodziny `planned` core_floor, delt_raise, curl (stan @ fbd00673 = `integracja-1-1` 1c683be3 + docs audytu)

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
