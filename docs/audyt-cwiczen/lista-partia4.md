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
