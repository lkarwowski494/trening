# Wskazówki techniki — rodzina `foam_roll` (rolowanie wałkiem), fala W1, grupa G2

Data: 02.11.2026. Autor: badacz-merytoryczny (agent).

**Metoda.** Dla każdego ćwiczenia przeczytałem (WebFetch, a PDF-y jako obrazy stron) instrukcje organizacji szkolących trenerów
(NASM, ACE) oraz materiały edukacyjne szpitali, klinik i uczelni (Ohio State Wexner Medical Center, Connecticut Children's Sports Medicine,
OrthoBethesda Therapy Services, HKU Centre for Sports and Exercise, UW Medicine, ColumbiaDoctors). Zdanie wchodzi do danych, gdy potwierdzają
je ≥ 2 przeczytane źródła szczebla 4 z różnych organizacji. Ogólne instrukcje dokumentu (np. „General Instructions”) liczę dla ćwiczenia
tylko wtedy, gdy ten sam dokument opisuje albo wymienia tę partię ciała. Stron aplikacji treningowych nie używałem. Zdań o zdrowiu,
bólu ani liczb (sekundy, powtórzenia) nie dodaję — źródła się w nich rozjeżdżają (sekcja „Otwarte”).

**Status: PROPOZYCJA** — nic nie jest jeszcze w `lib/` ani w `data/zrodla/cues.json`.

## Ćwiczenia

| Klucz ćwiczenia | Stan | Uwaga |
|---|---|---|
| Foam Roll: Quadriceps | gotowe | ustawienie i ruch po 3 źródła; „nie wyginaj pleców” — jedno źródło (Otwarte); bez `smr.mis.fast` (Otwarte) |
| Foam Roll: Hamstrings | gotowe | sekcja „Hamstrings” w karcie Connecticut Children's to kopia tekstu „Glutes” — nie liczę jej dla ustawienia |
| Calves-SMR | gotowe | 5 zgodnych źródeł; potwierdzone wszystkie trzy zdania zestawu ogólnego `smr.*` |
| Iliotibial Tract-SMR | gotowe | zakres ruchu: źródła różnią się (Otwarte) — wpisana część wspólna „między biodrem a kolanem” |
| Adductor-SMR | gotowe | ustawienie przodem (2 źr.); NASM opisuje wariant w siadzie — inny, nie wpisany |
| Latissimus Dorsi-SMR | gotowe | ułożenie ręki — Otwarte |
| Piriformis-SMR | gotowe | |
| Rhomboids-SMR | gotowe | źródła opisują rolowanie górnej części pleców wałkiem (nie piłką); dopasowanie do figury sprawdzi recenzja |
| Peroneals-SMR | otwarte | brak źródła szczebla ≤ 4 spoza stron aplikacji |
| Foot-SMR | gotowe | oba źródła to karty ćwiczeń dla pacjentów (zapalenie rozcięgna); wziąłem z nich tylko ustawienie i ruch, bez twierdzeń zdrowotnych; bez zdań `smr.*` (Otwarte) |

## Dane (do `exercises` w `data/zrodla/cues.json`)

```json
{
  "Foam Roll: Quadriceps": {
    "setup": [
      {"c": "foam_roll.quad.setup", "s": [["ccmc-foam-rolling", "s. 2, „Quad” („lying on your stomach with a foam roller under your upper thigh… elbows”)"], ["osu-foam-rolling", "„Quadriceps” („Lie with the roll under the top of one thigh… Prop yourself on your elbows”)"], ["orthobethesda-foam-rolling", "s. 2, „1. Quadriceps” („Begin by lying face down”)"]]}
    ],
    "move": [
      {"c": "foam_roll.quad.path", "s": [["orthobethesda-foam-rolling", "s. 2, „1. Quadriceps” (start „just above the knees”, „Roll the FR upward to just below the hip crease”)"], ["osu-foam-rolling", "„Quadriceps” („keeping the roll off your knee”)"], ["ccmc-foam-rolling", "s. 1, wstęp („completed over the entirety of the muscle(s)”)"]]},
      {"c": "smr.slow", "s": [["ccmc-foam-rolling", "s. 2, „Quad” („Now very slowly roll your leg back and forth”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Slowly move the roller along the muscle”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll the tender areas…”; lista obejmuje „quads”)"]]}
    ],
    "tips": [
      {"c": "foam_roll.offKnee", "s": [["osu-foam-rolling", "„Quadriceps” („keeping the roll off your knee”)"], ["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints (i.e knee, elbow, spine)”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”)"]]},
      {"c": "foam_roll.oneLeg", "s": [["osu-foam-rolling", "„Quadriceps” („cross your other leg over it”)"], ["orthobethesda-foam-rolling", "s. 2, „1. Quadriceps” („shift the FR laterally and roll on one leg only”)"]]},
      {"c": "smr.tender", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („pausing on tender areas”)"], ["hku-foam-rolling", "s. 2, „Quadriceps” („Hold on tender areas”)"], ["ccmc-foam-rolling", "s. 1, wstęp („focus on these areas”)"]]}
    ],
    "mistakes": []
  },
  "Foam Roll: Hamstrings": {
    "setup": [
      {"c": "foam_roll.ham.setup", "s": [["orthobethesda-foam-rolling", "s. 2, „2. Hamstrings” („Begin in long-sitting, with the FR placed just above the back of the knees”)"], ["osu-foam-rolling", "„Hamstrings” („Sit with the roll under both thighs. Use your arms…”)"]]}
    ],
    "move": [
      {"c": "foam_roll.ham.path", "s": [["orthobethesda-foam-rolling", "s. 2, „2. Hamstrings” („Roll the FR upward to the buttocks”)"], ["ccmc-foam-rolling", "s. 1, wstęp („completed over the entirety of the muscle(s)”)"], ["osu-foam-rolling", "„Hamstrings” („roll forward and back”)"]]},
      {"c": "smr.slow", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („Slowly move the roller along the muscle”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll…”; lista obejmuje „hamstrings”)"], ["hku-foam-rolling", "s. 1, wstęp („Slowly roll along the targeted muscle”)"]]}
    ],
    "tips": [
      {"c": "foam_roll.offKnee", "s": [["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints (i.e knee…)”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”)"]]},
      {"c": "foam_roll.angle", "s": [["hku-foam-rolling", "s. 1, „Hamstring” („Turn your toes right and left”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Change the angle with each pass in order to target the entire muscle”)"]]},
      {"c": "smr.tender", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („pausing on tender areas”)"], ["hku-foam-rolling", "s. 1, wstęp („pause on tender areas”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll the tender areas…”)"]]}
    ],
    "mistakes": []
  },
  "Calves-SMR": {
    "setup": [
      {"c": "foam_roll.calf.setup", "s": [["nasm-foam-roll-calves", "Step 1–2 („Support yourself with your hands behind you and lift your hips slightly off the ground.”)"], ["osu-foam-rolling", "„Calves” („Lift your body with your arms”)"], ["ccmc-foam-rolling", "s. 1, „Calf” („Push yourself off the ground with your arms”)"]]}
    ],
    "move": [
      {"c": "foam_roll.calf.path", "s": [["nasm-foam-roll-calves", "Step 3 („from just below your knee down toward your ankle”)"], ["orthobethesda-foam-rolling", "s. 2, „4. Calves” (start „just above the heel”, „Roll the FR upward to just below the back of the knee”)"]]},
      {"c": "smr.slow", "s": [["nasm-foam-roll-calves", "Step 3 („Perform slow, controlled rolling motions.”)"], ["hku-foam-rolling", "s. 1, „Calves” („rolling both calves together slowly”)"], ["ccmc-foam-rolling", "s. 1, „Calf” („slowly roll your calf”)"]]}
    ],
    "tips": [
      {"c": "foam_roll.oneLeg", "s": [["nasm-foam-roll-calves", "Step 1 („Position one leg on top of the other for additional pressure control.”)"], ["osu-foam-rolling", "„Calves” („your left leg on top”)"], ["hku-foam-rolling", "s. 1, „Calves” („placing one leg on top of the other”)"]]},
      {"c": "foam_roll.angle", "s": [["hku-foam-rolling", "s. 1, „Calves” („play around with the angle of the ankle”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Change the angle with each pass”)"]]},
      {"c": "smr.tender", "s": [["nasm-foam-roll-calves", "Step 3 („pausing on tender areas”)"], ["hku-foam-rolling", "s. 1, „Calves” („pausing on tender areas”)"]]}
    ],
    "mistakes": [
      {"c": "smr.mis.fast", "s": [["nasm-foam-roll-calves", "Common Mistakes („Rolling too quickly…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Move about 1 inch per second”)"]]},
      {"c": "foam_roll.mis.pressure", "s": [["nasm-foam-roll-calves", "Common Mistakes („Applying excessive pressure…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („applying moderate pressure”)"]]}
    ]
  },
  "Iliotibial Tract-SMR": {
    "setup": [
      {"c": "foam_roll.it.setup", "s": [["osu-foam-rolling", "„Iliotibial band” („Lie on your side with the roll under your bottom thigh.”)"], ["orthobethesda-foam-rolling", "s. 2, „5. Lateral Thigh (IT Band)” („Begin by lying on your side”)"], ["ccmc-foam-rolling", "s. 1, „IT Band” („lying on your side with your hip resting on a foam roll”)"]]},
      {"c": "foam_roll.it.topLeg", "s": [["ccmc-foam-rolling", "s. 1, „IT Band” („your upper leg crossed in front of the other, and that foot resting on the ground”)"], ["osu-foam-rolling", "„Iliotibial band” („Use your arms and top leg to roll”)"]]}
    ],
    "move": [
      {"c": "foam_roll.it.path", "s": [["orthobethesda-foam-rolling", "s. 2, „5. Lateral Thigh” (start „just above the outside of the knee”, „Roll the FR upward to the lateral hip”)"], ["osu-foam-rolling", "„Iliotibial band” („roll along the side of your thigh”)"], ["ccmc-foam-rolling", "s. 1, „IT Band” („Slowly roll the side of your leg up and down”)"]]},
      {"c": "smr.slow", "s": [["ccmc-foam-rolling", "s. 1, „IT Band” („Slowly roll…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Slowly move the roller”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll…”; lista obejmuje „IT bands”)"]]}
    ],
    "tips": [
      {"c": "foam_roll.offKnee", "s": [["osu-foam-rolling", "„Iliotibial band” („Keep the roll above your knee.”)"], ["ccmc-foam-rolling", "s. 1, „IT Band” („Don't roll past your knee.”)"], ["orthobethesda-foam-rolling", "s. 1, Safety („Avoid rolling directly over the joints”)"]]},
      {"c": "foam_roll.it.hipBone", "s": [["orthobethesda-foam-rolling", "s. 2, „5. Lateral Thigh” („avoid placing pressure directly over the bony area near the top of the thigh”)"], ["ace-blog-5624", "How to Foam Roll („avoiding bones and joints”)"]]},
      {"c": "foam_roll.angle", "s": [["hku-foam-rolling", "s. 2, „Tensor Fasciae Latae” („change the angle of the body to find the tender point”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Change the angle with each pass”)"]]},
      {"c": "smr.tender", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („pausing on tender areas”)"], ["hku-foam-rolling", "s. 2, „Tensor Fasciae Latae” („find the tender point”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll the tender areas…”)"]]}
    ],
    "mistakes": []
  },
  "Adductor-SMR": {
    "setup": [
      {"c": "foam_roll.add.setup", "s": [["ccmc-foam-rolling", "s. 2, „Adductor” („lying face down on your elbows… foam roller resting under the inside of your other thigh”)"], ["osu-foam-rolling", "„Hip adductors” („Lie face-down with the roll diagonally under your inner thigh.”)"]]}
    ],
    "move": [
      {"c": "foam_roll.add.path", "s": [["nasm-foam-roll-adductors", "Step 3 („along your inner thigh from the hip area down toward the knee”)"], ["osu-foam-rolling", "„Hip adductors” („roll up and down the leg”)"], ["ccmc-foam-rolling", "s. 2, „Adductor” („Roll your inner thigh back and forth”)"]]},
      {"c": "smr.slow", "s": [["nasm-foam-roll-adductors", "Step 3 („Slowly roll…”; slow, controlled motions)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll…”; lista obejmuje „adductors”)"]]}
    ],
    "tips": [
      {"c": "smr.tender", "s": [["nasm-foam-roll-adductors", "Step 3 („pausing on tender areas”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll the tender areas…”)"]]}
    ],
    "mistakes": [
      {"c": "smr.mis.fast", "s": [["nasm-foam-roll-adductors", "Common Mistakes („Rolling too quickly…”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll…”)"]]}
    ]
  },
  "Latissimus Dorsi-SMR": {
    "setup": [
      {"c": "foam_roll.lat.setup", "s": [["nasm-foam-roll-latissimus-dorsi", "Step 1 („Lie on your side on a foam roller positioned just below your armpit”)"], ["orthobethesda-foam-rolling", "s. 2, „6. Lats” („lying on your side… FR placed just below your armpit”)"], ["hku-foam-rolling", "s. 3, „Latissimus Dorsi” („Lie on your side. Place the foam roller under the armpit”)"]]}
    ],
    "move": [
      {"c": "foam_roll.lat.path", "s": [["nasm-foam-roll-latissimus-dorsi", "Step 2–3 („along the side of your torso”, „from your armpit down toward your hip”)"], ["orthobethesda-foam-rolling", "s. 2, „6. Lats” („Roll back and forth or side-to-side a few inches”)"]]},
      {"c": "smr.slow", "s": [["nasm-foam-roll-latissimus-dorsi", "Step 3 („Perform slow, controlled rolling motions.”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Slowly move the roller”)"]]}
    ],
    "tips": [
      {"c": "smr.tender", "s": [["nasm-foam-roll-latissimus-dorsi", "Step 3 („pausing on tender areas”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („pausing on tender areas”)"]]}
    ],
    "mistakes": [
      {"c": "smr.mis.fast", "s": [["nasm-foam-roll-latissimus-dorsi", "Common Mistakes („Rolling too quickly…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Move about 1 inch per second”)"]]},
      {"c": "foam_roll.mis.pressure", "s": [["nasm-foam-roll-latissimus-dorsi", "Common Mistakes („Applying excessive pressure…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („applying moderate pressure”)"]]}
    ]
  },
  "Piriformis-SMR": {
    "setup": [
      {"c": "foam_roll.pir.setup", "s": [["osu-foam-rolling", "„Glute piriformis” („Sit on the roll with your right leg crossed over your left knee”)"], ["ccmc-foam-rolling", "s. 1, „Glutes” („sitting on a wrapped foam roll with one ankle resting on your opposite knee”)"], ["orthobethesda-foam-rolling", "s. 2, „3. Glutes/Hip Rotators” („crossing the ankle… over the opposite thigh, just above the knee”)"]]},
      {"c": "foam_roll.pir.lean", "s": [["osu-foam-rolling", "„Glute piriformis” („lean slightly toward your right side”, przy prawej nodze założonej)"], ["hku-foam-rolling", "s. 2, „Piriformis + Glutes” („lean over to side of the crossed leg”)"]]}
    ],
    "move": [
      {"c": "foam_roll.pir.path", "s": [["osu-foam-rolling", "„Glute piriformis” („Use your arms and left leg to roll across your buttock.”)"], ["orthobethesda-foam-rolling", "s. 2, „3. Glutes/Hip Rotators” („Roll back and forth or side-to-side a few inches”)"], ["ccmc-foam-rolling", "s. 1, „Glutes” („Slowly roll your bottom back and forth”)"]]},
      {"c": "smr.slow", "s": [["ccmc-foam-rolling", "s. 1, „Glutes” („Slowly roll…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Slowly move the roller”)"], ["hku-foam-rolling", "s. 1, wstęp („Slowly roll along the targeted muscle”)"]]}
    ],
    "tips": [
      {"c": "smr.tender", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („pausing on tender areas”)"], ["hku-foam-rolling", "s. 1, wstęp („pause on tender areas”)"]]}
    ],
    "mistakes": []
  },
  "Rhomboids-SMR": {
    "setup": [
      {"c": "foam_roll.ub.setup", "s": [["osu-foam-rolling", "„Spine roll” („Lie on your back with the roll under your back”)"], ["orthobethesda-foam-rolling", "s. 2, „7. Mid/Upper Back” („lying on your back, with the FR placed under your lower ribs”)"], ["hku-foam-rolling", "s. 3, „Upper Back” (zdjęcie: wałek w poprzek pleców, stopy na podłodze)"]]},
      {"c": "foam_roll.ub.arms", "s": [["orthobethesda-foam-rolling", "s. 2, „7. Mid/Upper Back” („Hug your elbows… This will move your shoulder blades out of the way”)"], ["hku-foam-rolling", "s. 3, „Upper Back” („close the elbows for a greater feeling”)"]]}
    ],
    "move": [
      {"c": "foam_roll.ub.path", "s": [["osu-foam-rolling", "„Spine roll” („Use your legs to roll slowly up and down.”)"], ["orthobethesda-foam-rolling", "s. 2, „7. Mid/Upper Back” („Roll the FR upward to the top of the shoulder/base of the neck”)"], ["hku-foam-rolling", "s. 3, „Upper Back” („Slowly roll the upper back”)"]]},
      {"c": "smr.slow", "s": [["osu-foam-rolling", "„Spine roll” („roll slowly up and down”)"], ["hku-foam-rolling", "s. 3, „Upper Back” („Slowly roll…”)"], ["orthobethesda-foam-rolling", "s. 1, General Instructions („Slowly move the roller”)"]]}
    ],
    "tips": [
      {"c": "smr.tender", "s": [["orthobethesda-foam-rolling", "s. 1, General Instructions („pausing on tender areas”)"], ["ace-blog-5624", "How to Foam Roll („Slowly roll the tender areas…”; lista obejmuje „upper back”)"]]}
    ],
    "mistakes": []
  },
  "Foot-SMR": {
    "setup": [
      {"c": "foam_roll.foot.setup", "s": [["uwmed-plantar-fasciitis", "s. 2, „Ball Massage” („Sit upright with your feet under your knees. Place a dense ball… under your… foot.”)"], ["columbia-plantar-fasciitis", "„Plantar fascia self-massage” („Sit in a chair. Place your foot on a firm, tube-shaped object”)"]]}
    ],
    "move": [
      {"c": "foam_roll.foot.path", "s": [["uwmed-plantar-fasciitis", "s. 2, „Ball Massage” („Roll it along the arch of your foot, from the ball to the heel.”)"], ["columbia-plantar-fasciitis", "„Plantar fascia self-massage” („Roll your foot back and forth over the object”)"]]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

## Nowe zdania

| id | PL | EN (propozycja) | uwaga |
|---|---|---|---|
| `foam_roll.quad.setup` | Połóż się przodem, oprzyj na przedramionach, wałek pod udami. | Lie face down on your forearms with the roller under your thighs. | |
| `foam_roll.quad.path` | Roluj od miejsca nad kolanem do biodra. | Roll from just above the knee up to the hip. | |
| `foam_roll.ham.setup` | Usiądź z wałkiem pod tyłem ud i podeprzyj się rękami. | Sit with the roller under the backs of your thighs and prop yourself up on your hands. | „ręce” — OSU „use your arms”, zdjęcie OrthoBethesda |
| `foam_roll.ham.path` | Roluj od miejsca nad kolanem do pośladków. | Roll from just above the knee up to your glutes. | |
| `foam_roll.calf.setup` | Usiądź z wałkiem pod łydkami, podeprzyj się rękami z tyłu i unieś biodra. | Sit with the roller under your calves, hands behind you, and lift your hips. | |
| `foam_roll.calf.path` | Roluj od kostki do miejsca pod kolanem. | Roll from the ankle up to just below the knee. | kierunek w źródłach różny (NASM w dół, OrthoBethesda w górę) — zdanie podaje zakres, ruch w obie strony |
| `foam_roll.oneLeg` | Chcesz mocniej — roluj jedną nogę, a drugą połóż na niej. | For more pressure, roll one leg and rest the other on top. | używane tylko tam, gdzie 2 źródła (czworogłowe, łydki) |
| `foam_roll.offKnee` | Trzymaj wałek nad kolanem, nie wjeżdżaj na staw. | Keep the roller above the knee, not on the joint. | wskazówka ułożenia, nie twierdzenie zdrowotne |
| `foam_roll.angle` | Zmieniaj lekko kąt, żeby objąć cały mięsień. | Shift the angle a little to cover the whole muscle. | |
| `foam_roll.it.setup` | Połóż się na boku, wałek pod zewnętrzną stroną uda. | Lie on your side with the roller under the outside of your thigh. | |
| `foam_roll.it.topLeg` | Górną nogę przełóż przed siebie i oprzyj stopę o podłogę. | Cross your top leg in front and put that foot on the floor. | |
| `foam_roll.it.path` | Roluj bok uda między biodrem a kolanem. | Roll the side of your thigh between hip and knee. | część wspólna źródeł (Otwarte: zakres) |
| `foam_roll.it.hipBone` | Nie dociskaj wałka do kości z boku biodra. | Don't press the roller into the bone at the side of your hip. | OrthoBethesda wprost, ACE ogólnie („avoiding bones”) |
| `foam_roll.add.setup` | Połóż się przodem na przedramionach, wałek pod wewnętrzną stroną uda. | Lie face down on your forearms with the roller under your inner thigh. | |
| `foam_roll.add.path` | Roluj wewnętrzną stronę uda, między kolanem a pachwiną. | Roll your inner thigh between the knee and the groin. | |
| `foam_roll.lat.setup` | Połóż się na boku, wałek tuż pod pachą. | Lie on your side with the roller just below your armpit. | |
| `foam_roll.lat.path` | Roluj bok tułowia, zaczynając tuż pod pachą. | Roll along the side of your torso, starting just below the armpit. | |
| `foam_roll.pir.setup` | Usiądź na wałku i połóż kostkę jednej nogi na kolanie drugiej. | Sit on the roller and rest one ankle on the opposite knee. | |
| `foam_roll.pir.lean` | Przechyl się na stronę założonej nogi. | Lean toward the side of the crossed leg. | |
| `foam_roll.pir.path` | Roluj pośladek krótkimi ruchami, podpierając się rękami. | Roll your glute in short movements, supporting yourself on your hands. | |
| `foam_roll.ub.setup` | Połóż się na plecach, wałek w poprzek pod górną częścią pleców, stopy na podłodze. | Lie on your back with the roller across your upper back, feet on the floor. | „w poprzek” — zdjęcia HKU i OrthoBethesda |
| `foam_roll.ub.arms` | Skrzyżuj ręce na klatce, żeby odsunąć łopatki. | Cross your arms over your chest to move your shoulder blades out of the way. | |
| `foam_roll.ub.path` | Odpychaj się nogami i przetaczaj wałek wzdłuż górnej części pleców. | Push with your legs and roll the roller along your upper back. | |
| `foam_roll.foot.setup` | Usiądź i postaw stopę na piłce albo wałku. | Sit and put your foot on a ball or roller. | |
| `foam_roll.foot.path` | Roluj podeszwę w przód i w tył, od pięty do poduszki pod palcami. | Roll the sole back and forth, from the heel to the ball of your foot. | |
| `foam_roll.mis.pressure` | Za mocny nacisk. | Pressing too hard. | bez dopisku o bólu/siniakach (twierdzenie zdrowotne) |

Słownik terminów (`docs/lokalizacja/slownik-terminow.json`) nie ma haseł „wałek” / „rolowanie” — użyłem słów z istniejących `smr.*`.

## Nowe źródła

```json
{
  "nasm-foam-roll-calves": {"org": "NASM", "title": "Foam Roll Calves", "url": "https://www.nasm.org/resource-center/exercise-library/foam-roll-calves", "level": 4},
  "nasm-foam-roll-adductors": {"org": "NASM", "title": "Foam Roll Adductors", "url": "https://www.nasm.org/resource-center/exercise-library/foam-roll-adductors", "level": 4},
  "nasm-foam-roll-latissimus-dorsi": {"org": "NASM", "title": "Foam Roll Latissimus Dorsi", "url": "https://www.nasm.org/resource-center/exercise-library/foam-roll-latissimus-dorsi", "level": 4},
  "ace-blog-5624": {"org": "ACE", "title": "Foam Rolling 101 (blog)", "url": "https://www.acefitness.org/resources/everyone/blog/5624/foam-rolling-101/", "level": 4},
  "ccmc-foam-rolling": {"org": "Connecticut Children's Sports Medicine", "title": "Lower Extremity Foam Rolling Home Exercise Program (PDF, 2 s.)", "url": "https://www.connecticutchildrens.org/sites/default/files/2024-01/lower_extremity_foam_rolling_home_exercise_program.pdf", "level": 4},
  "orthobethesda-foam-rolling": {"org": "OrthoBethesda Therapy Services", "title": "Foam Rolling (FR) Exercises (PDF, 2 s., 2015)", "url": "https://www.orthobethesda.com/foam-rolling-exercises/", "level": 4},
  "osu-foam-rolling": {"org": "Ohio State University Wexner Medical Center", "title": "Foam Rolling Exercises (transkrypcja filmu)", "url": "https://wexnermedical.osu.edu/-/media/transcripts/wexnermedical/blog/2y2leqbvrgw_foamrollingexercises.txt", "level": 4},
  "hku-foam-rolling": {"org": "HKU CSE", "title": "Foam Rolling (PDF, 3 s., Exercise is Medicine on Campus)", "url": "https://www.cse.hku.hk/document/hlthfit_FoamRolling.pdf", "level": 4},
  "uwmed-plantar-fasciitis": {"org": "UW Medicine", "title": "Exercises for Plantar Fasciitis (Sports Medicine Clinic, PDF, 5 s.)", "url": "https://honline.s.uw.edu/sites/default/files/record_pdfs/Exercises-Plantar-Fasciitis.pdf", "level": 4},
  "columbia-plantar-fasciitis": {"org": "ColumbiaDoctors", "title": "Plantar Fasciitis Exercises (Health Library)", "url": "https://www.columbiadoctors.org/health-library/how-to/plantar-fasciitis-exercises", "level": 4}
}
```

| id | organizacja | szczebel | co potwierdza |
|---|---|---|---|
| `nasm-foam-roll-calves` | NASM | 4 | łydki: ustawienie, zakres, wolno, przystanki, nogi na sobie; błędy: za szybko, za mocny nacisk |
| `nasm-foam-roll-adductors` | NASM | 4 | przywodziciele: zakres biodro–kolano, wolno, przystanki, błąd „za szybko”; ustawienie w siadzie (wariant, nieużyty) |
| `nasm-foam-roll-latissimus-dorsi` | NASM | 4 | najszerszy: ustawienie pod pachą, zakres, wolno, przystanki, błędy |
| `ace-blog-5624` | ACE | 4 | ogólnie: wolno, tkliwe miejsca, omijanie kości i stawów, lista partii ciała |
| `ccmc-foam-rolling` | Connecticut Children's (szpital dziecięcy, medycyna sportowa) | 4 | czworogłowe, pasmo, łydki, pośladki, przywodziciele: ustawienie i ruch; „nie za kolano” |
| `orthobethesda-foam-rolling` | OrthoBethesda (fizjoterapia przy praktyce ortopedycznej) | 4 | instrukcje ogólne (tempo, nacisk, kąt, przystanki), bezpieczeństwo (stawy), 7 partii z punktami startu i końca |
| `osu-foam-rolling` | Ohio State Wexner Medical Center | 4 | ustawienie i ruch: pasmo, pośladek, łydki, czworogłowe, dwugłowe, plecy, przywodziciele |
| `hku-foam-rolling` | HKU Centre for Sports and Exercise | 4 (propozycja jak w docs/33) | łydki, dwugłowe, czworogłowe, TFL, gruszkowaty, górne plecy, najszerszy |
| `uwmed-plantar-fasciitis` | UW Medicine Sports Medicine Clinic | 4 | stopa: ustawienie i ruch na piłce |
| `columbia-plantar-fasciitis` | ColumbiaDoctors (Columbia University Irving Medical Center) | 4 | stopa: ustawienie i ruch na wałku/butelce |

Nowe organizacje do `orgs` (propozycja): Connecticut Children's Sports Medicine, OrthoBethesda Therapy Services, Ohio State University Wexner Medical Center,
HKU CSE (już proponowana w docs/33), UW Medicine, ColumbiaDoctors. Wszystkie to materiały edukacyjne dla pacjentów albo uczelniane, szczebel 4.

## Otwarte

- **Peroneals-SMR** → brak przeczytanego źródła szczebla ≤ 4: wyszukiwanie zwraca prawie tylko strony aplikacji i sklepów (wykluczone),
  a NASM i ACE nie mają tego ćwiczenia. Do szukania: materiały szpitalne albo uczelniane o rolowaniu boku podudzia.
- **Czas i liczba przejść** (wszystkie ćwiczenia) → źródła się rozjeżdżają: ACE 30–60 s na tkliwe miejsce (początkujący 5–10 s), NASM 1–2 min
  na nogę/stronę, OrthoBethesda 1–2 min na partię i „około cala na sekundę”, HKU 30 s–1 min, Connecticut Children's 60–90 s, OSU 10–20 powtórzeń,
  UW 15 przejść, Columbia 2–5 min. Część wspólna wszystkich czterech przedziałów czasowych to tylko ok. 60 s, a dane OSU i UW podano w powtórzeniach. Nie wpisuję liczby.
- **`smr.mis.fast` dla czworogłowych, dwugłowych, pasma, gruszkowatego, górnej części pleców i stopy** → jako BŁĄD opisuje to tylko NASM,
  a jego strony obejmują łydki, przywodziciele i najszerszy. Dla pozostałych są tylko wskazówki „powoli”, bez błędu wprost. Wpisuję tylko tam, gdzie NASM jest.
  Uwaga dla zestawu ogólnego: rodzina `foam_roll` dostaje dziś `smr.mis.fast` dla wszystkich ćwiczeń, a źródła tego nie pokrywają.
- **`smr.slow` / `smr.tender` dla stopy** → źródła dotyczące stopy (UW, Columbia) nie mówią o tempie ani o przystankach. Zestaw ogólny nie ma tu potwierdzenia.
- **`foam_roll.mis.pressure` dla pozostałych ćwiczeń** → wprost tylko NASM (łydki, przywodziciele, najszerszy); dla przywodzicieli drugie źródło tylko w tej samej organizacji (FAQ NASM).
- **Czworogłowe: „nie wyginaj pleców”** → jedno źródło (HKU, s. 2 „IMPORTANT: Remember not to arch your back”).
- **Dwugłowe: noga na nodze dla mocniejszego nacisku** → jedno źródło (OrthoBethesda); karta Connecticut Children's ma w sekcji „Hamstrings” tekst skopiowany z „Glutes”.
- **Pasmo biodrowo-piszczelowe — zakres** → OrthoBethesda i OSU: cały bok uda do kolana; HKU: tylko okolica TFL przy miednicy („you do not need to roll all the way down to the knee”).
  Wpisana część wspólna „między biodrem a kolanem”.
- **Przywodziciele — ustawienie w siadzie** (NASM Step 1–2) → inny wariant niż „przodem” w dwóch źródłach szpitalnych. Figura i zdanie muszą być zgodne z jednym wariantem.
- **Najszerszy — ułożenie dolnej ręki** → OrthoBethesda: ręka uniesiona do przodu na 90° i więcej; HKU: ręka wyciągnięta (zdjęcie) i „swing your arm up and down”; NASM: podpór na dolnej ręce.
  Brak zgody → bez zdania.
- **Górna część pleców: „biodra w górze, brzuch napięty”** → jedno źródło (HKU). **„Nie zjeżdżaj na lędźwie”** → wprost tylko ACE („The only place to avoid direct foam rolling is the lower back”);
  OrthoBethesda wymienia ogólnie kręgosłup wśród stawów. Twierdzenie zdrowotne → potrzebne drugie źródło wprost.
- **Gruszkowaty: ostrzeżenie o nerwach** (HKU „it might be sensitive”) → jedno źródło, twierdzenie zdrowotne.
- **Stopa: „tkliwość tak, ostry ból nie”** → UW wprost; ACE ogólnie („Expect some discomfort”). Twierdzenie o bólu → nie wpisuję.
- **Bezpieczeństwo ogólne** (konsultacja przy chorobach serca/naczyń, osteoporozie, lekach przeciwkrzepliwych — ACE, OrthoBethesda) → porada medyczna; poza zakresem wskazówek techniki.
- **Rhomboids-SMR** → źródła opisują rolowanie górnej części pleców wałkiem. Recenzja figury powinna sprawdzić, czy figura pokazuje właśnie to (wałek w poprzek pleców, a nie piłkę między łopatką a kręgosłupem).

## Stan

- **Zrobione:** 9 z 10 ćwiczeń (gotowe), dane JSON, 26 nowych zdań, 10 nowych źródeł.
- **Zostało:** Peroneals-SMR (otwarte — brak źródeł).
- **Następny krok:** koordynator wkleja dane po recenzji, a tłumacz dopracowuje EN. Szukanie źródła o bocznej stronie podudzia (szpital/uczelnia) może przywrócić Peroneals-SMR.
- **Pułapki:** strona NASM `foam-roll-quadriceps` → 404 (NASM ma w bibliotece tylko łydki, przywodziciele i najszerszy). Niedostępne: Mayo Clinic Health System PDF (403),
  MCRD San Diego PDF (403), Montgomery County PDF (404), archiwum UNT (503), UW-La Crosse PDF (503), hr.mtsac.edu (domena zablokowana w sesji), elitefts (404).
  PDF-y Connecticut Children's, OrthoBethesda, HKU i UW czytane jako obrazy stron, bo WebFetch nie odczytuje tekstu PDF. Strona OrthoBethesda pod adresem HTML zwraca PDF.
  Wyniki wyszukiwania dla peroneals i stopy to w większości strony aplikacji — pominięte, nigdzie niezapisane.
