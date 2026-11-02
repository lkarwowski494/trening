# G4 (nogi i biodra) — korekta szczebli, przeliczenie koordynatora 02.11.2026

Data: 02.11.2026 · autor: badacz-merytoryczny (przeliczenie na zlecenie koordynatora linii 1.1) · **Status: PROPOZYCJA**

Reguły: `szczeble-organizacji-2026-11-02.md` — rozstrzygnięcie, uzupełnienie 1, 2 i **3** (G4 miała zastosowane rozstrzygnięcie
i uzupełnienie 2, bez uzupełnienia 3 — `STAN-g4-nogi.md:5`). Kryterium karty (02.11.2026): zdanie gotowe = ≥ 2 niezależne
organizacje szczebla ≤ 4, przeczytane; karta własna = min. 1 zdanie ustawienia + 1 zdanie ruchu; „z błędami” = + min. 1 błąd.
Nowych źródeł nie szukano; WebFetch 02.11.2026 tylko do sprawdzenia autora i daty stron już opisanych w plikach.

**Odstępstwo od briefu (do decyzji koordynatora):** sekcja przeliczenia jest w tym jednym pliku zamiast na końcu każdego pliku
rodziny — dostępne narzędzie zapisu nadpisuje cały plik, a przepisanie 11 plików (ok. 2100 linii) przekroczyłoby limit kontekstu
agenta. Treść jest per plik (sekcje niżej). **Wszystkie wcześniejsze bloki JSON wpisów do `exercises` w plikach rodziny G4 są
NIEAKTUALNE — patrz przeliczenie 02.11.2026** (lista miejsc w sekcji „Bloki nieaktualne”). Programista bierze wyłącznie blok
z sekcji „Blok do wdrożenia (po przeliczeniu 02.11.2026)”.

## Wynik

| | przed (STAN-g4-nogi.md:22) | po przeliczeniu |
|---|---|---|
| karty gotowe | 12 | ~~11~~ → **10** po korekcie 2 (8 z błędami, 2 bez błędów; Cable Pull Through otwarte — sekcja „Korekta 2” na końcu) |
| zmiana | — | Smith Machine Calf Raise: gotowe → **otwarte** (Major Fitness = 5) |
| nowe gotowe | — | 0 (Fitness Volt per strona dało 4 tylko przy Pendulum Squat — za mało do karty) |

## Szczeble źródeł objętych uzupełnieniem 3 (i źródeł kart gotowych sprawdzonych per strona)

| źródło (id) | plik | szczebel po przeliczeniu | dowód (strona czytana 02.11.2026) |
|---|---|---|---|
| Onnit — `onnit-kettlebell-deadlift-exercises`, `onnit-suitcase-deadlift` | hinge-cz1, hinge-cz2 | **5** (było 4) | uzup. 3, wiersz Onnit: serwis-sklep, artykuły bez daty; reguła dla organizacji, nie per strona. Ćwiczenia (Sumo Deadlift kb, One-Arm Side Deadlift) były już otwarte — teraz bez źródła szczebla 4 |
| Speediance — `speediance-cable-pull-through` | hinge-cz1 | **4 warunkowo** (bez zmiany) | autor Yang Chen, „Head of Content”, w biogramie NSCA-CSCS i ACE-CPT; data 19.11.2024; producent wyciągów (własny rodzaj sprzętu). Otoczenie handlowe (banery wyprzedaży, polecenie własnej maszyny) — jak Eleiko w uzup. 3 (liczy się tekst z autorem z kwalifikacjami). Wątpliwość niżej |
| BarBend — `barbend-single-leg-romanian-deadlift` | hinge-cz1 | 4 | „Written by Mike Dewar” (MS Exercise Physiology, CSCS); „Last updated on August 13th, 2024” |
| BarBend — `barbend-cable-pull-through` | hinge-cz1 | 4 | Mike Dewar, CSCS; „Last updated on November 27th, 2024” |
| BarBend — `barbend-cable-pull-through-vs-hip-thrust` | hinge-cz1 | 4 | Mike Dewar, CSCS; 17.11.2024 (sprawdzone w korekcie 2, hinge-cz1.md:200) |
| BarBend — `barbend-hack-squat` | squat-cz1 | 4 | „Written by Jesse Zucker, NCSF CPT…”; „Expert Verified By: Jake Dickson, CPT-NASM, USAW-L2”; aktualizacja 12.01.2024. Uwaga: strona nie ma sekcji o tytule „Barbell Hack Squat” — wersja ze sztangą jest pod „How to Do the Hack Squat”; poprawić miejsce w polu źródła przy integracji |
| BarBend — `barbend-axle-deadlift` | hinge-cz2 | 4 | Mike Dewar, CSCS; „Last updated on May 27th, 2025” |
| Coach — `coach-single-leg-romanian-deadlift`, `coach-hack-squat` | hinge-cz1, squat-cz1 | 4 | Sam Rider, REPS L3 PT, daty 11.04.2024 i 11.01.2024 (korekta 2, hinge-cz1.md:12, squat-cz1.md:15) — bez zmian |
| Fitness Volt — `fitnessvolt-axle-vs-barbell` | hinge-cz2 | **5** (bez zmiany) | podpis „By Patrick Dale, PT, ex-Marine”; **brak widocznej daty** (tylko w metadanych strony), brak recenzenta. Uzup. 3, „Reguła ogólna”: strona musi pokazywać autora z kwalifikacjami i datę |
| Fitness Volt — `fitnessvolt-seated-good-morning` | kneeling_hinge | **5** (bez zmiany) | jw.: Patrick Dale, PT; data tylko w metadanych (19.09.2023 / 11.08.2024), brak recenzenta; dodatkowo artykuł wewnętrznie niespójny (kneeling_hinge.md:95) |
| Fitness Volt — `fitnessvolt-pendulum-squat` | leg_machine | **4 warunkowo** (było 5) | Patrick Dale, PT; widoczne „Published: September 22, 2022”, aktualizacja 06.01.2024, „Fact checked by Dr. Malik” (MD) |
| Eleiko — `eleiko-6582f9bc` (eleiko.inspire360.com) | hinge-cz2 | **5** (było 4) | strona działu edukacji (platforma Inspire360), ale **bez autora i daty**; uzup. 3: liczy się tekst z działu edukacji z autorem albo firmowany „Eleiko Education” — strona nie używa tej nazwy |
| Major Fitness — `majorfitness-smith-calf-raise` | calf_raise, leg_machine | **5** (było 4) | brak autora; data 16.07.2026; ogólny artykuł w dziale „/blogs/wiki/”, nie instrukcja konkretnej maszyny; poleca własne maszyny, baner „Black Friday: Up to $734 OFF…”. Uzup. 3 (Mikolo): blog producenta = 5, 4 tylko instrukcja własnej maszyny |
| RitFit — `ritfit-pendulum-squat` | leg_machine | **5** (było 4) | autor „RitFit Editorial Team” (biogram: „fitness products and marketing”), bez kwalifikacji; ogólny blog, nie instrukcja; strona nie pokazuje maszyny wahadłowej RitFit (zaleca inne maszyny) — nie jest to dokumentacja własnego sprzętu |
| Life Fitness — `lf-pro-sl60`, `lf-pro-sl55` (kopie w manualsdir.com) | hip_abd_add | **nie liczy się** (było 4) | uzup. 3, wiersz kopii instrukcji: kopia w serwisie z instrukcjami tylko po utożsamieniu z dokumentem producenta; oryginał na support.lifefitness.com zwraca 403 — nieutożsamione |
| Gym Mikolo — `mikolo-cable-pull-through` | hinge-cz1 | 5 (bez zmiany) | uzup. 3 — blog = 5; i tak nieużyte |
| Barbell Logic — `barbelllogic-bands`, `barbelllogic-belt-squat`, `barbelllogic-set-up-chains` | hinge-cz2, leg_machine, squat-cz2 | **warunkowo 4 — niesprawdzone per strona; do sprawdzenia nie liczy się** (było 4) | uzup. 3: liczy się artykuł z autorem z certyfikatem w biogramie i datą; stron nie otwierano (ćwiczenia i tak otwarte — liczby bez zmian) |

Źródła kart gotowych spoza uzupełnienia 3 (ACE, NASM, NCSF, ISSA, Catalyst Athletics, Bodylastics, Performance Health/TheraBand) —
szczebel bez zmian (rozstrzygnięcie i uzup. 2; producenci gum tylko dla ćwiczeń z gumami).

## Per plik

### hinge-cz1.md
| zdanie / karta | stan |
|---|---|
| Single Leg RDL (hantel) — `slrdl.setup`, `slrdl.move`, `hinge.back`, `slrdl.mis.hipOpen`, `mis.roundBack` | zostaje (ACE, Coach S. Rider, BarBend z autorem i datą) — **własna z błędami** |
| Single Leg RDL (linki) — jw. | zostaje — **własna z błędami** |
| Cable Pull Through — `pt.setup`, `pt.move`, `hinge.back`, `rdl.knees`, `mis.roundBack` (błąd = zaprzeczenie standardu) | ~~zostaje~~ → po korekcie 2: **spadają** (zostaje tylko BarBend, jedna organizacja) — **otwarta** |
| Sumo Deadlift (kettlebell) — dane `sumoKb.*` | spada: Onnit = 5 → 0 źródeł szczebla 4; **otwarta** |
| pozostałe ćwiczenia | bez zmian — **otwarte** |
| blok `orgs` (hinge-cz1.md:224) | wpis „Onnit” — poziom 5 albo usunąć (nie zasila karty) |

### hinge-cz2.md
| zdanie / karta | stan |
|---|---|
| Clean Deadlift — `cdl.setup`, `cdl.move`, `dl.close`, `hinge.back`, `mis.barAway` (błąd = zaprzeczenie standardu) | zostaje (Catalyst + BarBend/Vaughn, autor i data sprawdzone w korekcie 2) — **własna z błędami** |
| Axle Deadlift — `axle.setup`, `dl.lift`, `dl.close`, `dl.mis.hipsFirst` | bez zmian: Fitness Volt bez widocznej daty = 5 → **otwarta**. Wróci do „własna z błędami”, jeśli koordynator uzna datę w metadanych strony (wszystkie 4 zdania mają BarBend + Fitness Volt) |
| Cable Deadlift — `cabledl.setup`, `tb.lift`, `cabledl.close` | spadają do 1 źródła (Eleiko inspire360 = 5) — **otwarta** |
| One-Arm Side Deadlift — `sdl.*` | spadają do 0 źródeł szczebla 4 (Onnit = 5, Prehab bez autora = 5) — **otwarta** |
| pozostałe | bez zmian — **otwarte** |
| blok `orgs` (hinge-cz2.md:142) | wpis „Onnit” — poziom 5 albo usunąć |

### kneeling_hinge.md
| zdanie / karta | stan |
|---|---|
| Seated Good Mornings — `gm.seatSetup`, `gm.seatMove`, `hinge.back`, `gm.seatLoad` | bez zmian: Fitness Volt bez widocznej daty = 5 → **otwarta** (jak w korekcie 1) |
| Kneeling Squat | **otwarta** |

### leg_machine.md
| zdanie / karta | stan |
|---|---|
| Pendulum Squat — `hack.setup2`, `hack.move`, `lp.noLock` | Fitness Volt (pendulum) = 4, ale RitFit = 5 → nadal po 1 źródle szczebla 4 — **otwarta**; `hack.hips` — Fitness Volt (4) + Legion (5) → 1 źródło |
| Belt Squat Machine — `belt.setup`, `belt.move` | Barbell Logic niesprawdzone per strona → 1 źródło (Bells of Steel) — **otwarta** (i tak bez wskazówek) |
| Hack Squat, Single Leg Press, Smith Machine Leg Press, Lying Machine Squat | bez zmian — **otwarte** |
| lista `orgs` (leg_machine.md:190) | `RitFit` → 5, `Major Fitness` → 5, `Fitness Volt` → warunkowo 4 per strona, `Barbell Logic` → warunkowo 4 per strona |

### hip_abd_add.md
| zdanie / karta | stan |
|---|---|
| Lateral Band Walk — `bw.setup`, `bw.move`, `bw.squat`, `bw.tension` | zostaje (NASM + ACE) — **własna bez błędów** |
| Hip Abduction, Hip Adduction (maszyna) | Life Fitness (kopia manualsdir) nie liczy się → 0 źródeł szczebla 4 — **otwarte** |
| pozostałe | bez zmian — **otwarte** |

### calf_raise.md
| zdanie / karta | stan |
|---|---|
| Smith Machine Calf Raise — `calf.edge`, `calf.move`, `calf.mis.partial` | **spadają** (zostaje tylko NASM) |
| Smith Machine Calf Raise — `calf.pause` | **spada** (zostaje tylko ACE 51) |
| Smith Machine Calf Raise — karta | gotowe → **otwarta** (brak ustawienia i ruchu z 2 źródłami) |
| Band Calf Raise — `calf.band`, `calf.rise`, `calf.pause`, `calf.mis.partial` (błąd = zaprzeczenie standardu) | zostaje (Bodylastics, TheraBand, ACE, NASM) — **własna z błędami** |
| blok `orgs`/`sources` (calf_raise.md:166, :171) | usunąć `Major Fitness` i `majorfitness-smith-calf-raise` |

### squat-cz1.md
| zdanie / karta | stan |
|---|---|
| Barbell Hack Squat — `bhs.setup`, `hack.move`, `hinge.back`, `sq.mis.heels` | zostaje (BarBend z autorem i recenzentem + Coach S. Rider) — **własna z błędami**; poprawić opis miejsca w BarBend (sekcja „How to Do the Hack Squat”) |
| pozostałe | bez zmian — **otwarte** |

### squat-cz2.md
Barbell Logic (`barbelllogic-set-up-chains`) — warunkowo 4, niesprawdzone; i tak bez techniki. Brak kart gotowych; bez zmian.

### leg_isolation.md, hip_bridge.md, glute_floor.md
Brak źródeł objętych uzupełnieniem 3. Karty bez zmian: Stability Ball Hamstring Curl (ACE + NCSF) — **własna z błędami**;
Single Leg Glute Bridge (ACE + Catalyst) — **własna z błędami**; Donkey Kick (ACE + ISSA) — **własna z błędami**;
Clamshell (NASM, ACE, Catalyst) — **własna bez błędów**.

## Bloki nieaktualne

NIEAKTUALNY — patrz przeliczenie 02.11.2026: bloki wpisów do `exercises` w `hinge-cz1.md:71`, `hinge-cz2.md:70`,
`kneeling_hinge.md:41`, `leg_machine.md` (blok sekcji „Wpisy”, ok. :85), `hip_abd_add.md:38`, `calf_raise.md:55`,
`squat-cz1.md` (blok ok. :65), `leg_isolation.md:70`, `hip_bridge.md` (blok ok. :47), `glute_floor.md:43`; bloki warunkowe
i częściowe (np. `hinge-cz1.md:125`, `squat-cz1.md:178–188`, `leg_isolation.md:198–201`) — nie do wdrożenia.
Bloki `orgs`/`sources` w plikach rodziny zostają jako materiał, z poprawkami z tabel wyżej (Onnit, Major Fitness, RitFit → 5).

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

10 kart (korekta 02.11.2026, sekcja „Korekta 2” na końcu pliku: Cable Pull Through usunięty). Brzmienie zdań i miejsca w źródłach — bez zmian względem plików rodziny (nowe zdania: sekcje „Nowe zdania” tych plików).

```json
{
  "Single Leg RDL (hantel)": {
    "setup": [{"c": "slrdl.setup", "s": [["ace-127", "instrukcja (balance on the left leg… keep the left knee slightly bent)"], ["barbend-single-leg-romanian-deadlift", "Step 1: Stand on One Leg (wariant: dowolne obciążenie)"]]}],
    "move": [{"c": "slrdl.move", "s": [["ace-127", "instrukcja (leaning forward on the left hip… straighten the right leg; stand up)"], ["coach-single-leg-romanian-deadlift", "The Hinge; The Return (wariant: sztanga, hantel)"], ["barbend-single-leg-romanian-deadlift", "Step 2: Push Your Hips Back; Step 3"]]}],
    "tips": [{"c": "hinge.back", "s": [["ace-127", "instrukcja (the back straight)"], ["coach-single-leg-romanian-deadlift", "The Hinge (keeping your back flat)"], ["barbend-single-leg-romanian-deadlift", "Step 3 (keep the back flat)"]]}],
    "mistakes": [
      {"c": "slrdl.mis.hipOpen", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rotating Your Hips"], ["barbend-single-leg-romanian-deadlift", "Step 2 (not allow the hip to rotate upwards); Form tips (hips staying even)"]]},
      {"c": "mis.roundBack", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rounding Your Back"], ["barbend-single-leg-romanian-deadlift", "Form tips, Step 2 (lower back rounds)"]]}
    ]
  },
  "Single Leg RDL (linki)": {
    "setup": [{"c": "slrdl.setup", "s": [["ace-350", "instrukcja (balancing body weight on the right leg… slight bend in the right knee)"], ["barbend-single-leg-romanian-deadlift", "Step 1 (wariant: wolne ciężary)"]]}],
    "move": [{"c": "slrdl.move", "s": [["ace-350", "instrukcja (hinging forward on the right hip; stand up… lowering the left leg)"], ["coach-single-leg-romanian-deadlift", "The Hinge; The Return (wariant: sztanga, hantel)"]]}],
    "tips": [{"c": "hinge.back", "s": [["ace-350", "instrukcja (the back straight)"], ["coach-single-leg-romanian-deadlift", "The Hinge (wariant)"], ["barbend-single-leg-romanian-deadlift", "Step 3 (wariant)"]]}],
    "mistakes": [
      {"c": "slrdl.mis.hipOpen", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rotating Your Hips (wariant)"], ["barbend-single-leg-romanian-deadlift", "Step 2; Form tips (wariant)"]]},
      {"c": "mis.roundBack", "s": [["coach-single-leg-romanian-deadlift", "Common mistakes: Rounding Your Back (wariant)"], ["barbend-single-leg-romanian-deadlift", "Form tips, Step 2 (wariant)"]]}
    ]
  },
  "Clean Deadlift": {
    "setup": [{"c": "cdl.setup", "s": [["catalyst-176", "opis (starting position)"], ["barbend-vaughn-clean-deadlift", "start position (knees out, clean grip)"]]}],
    "move": [{"c": "cdl.move", "s": [["catalyst-176", "opis (back angle until bar passes knees)"], ["barbend-vaughn-clean-deadlift", "back holding position as legs lift"]]}],
    "tips": [
      {"c": "dl.close", "s": [["catalyst-176", "opis (bar close to legs)"], ["barbend-vaughn-clean-deadlift", "keep bar close"]]},
      {"c": "hinge.back", "s": [["catalyst-176", "opis (back braced and extended)"], ["barbend-vaughn-clean-deadlift", "back tension and position maintenance"]]}
    ],
    "mistakes": [{"c": "mis.barAway", "s": [["barbend-vaughn-clean-deadlift", "shoulders in front → bar drifts forward"], ["catalyst-176", "opis (bar as close as possible) — błąd = zaprzeczenie standardu"]]}]
  },
  "Barbell Hack Squat": {
    "setup": [{"c": "bhs.setup", "s": [["barbend-hack-squat", "How to Do the Hack Squat (heels touching the bar behind you; feet shoulder-width; overhand grip behind you)"], ["coach-hack-squat", "Barbell Hack Squat — Setup/Grip (back to the bar; overhand grip, palms facing behind; feet shoulder-width)"]]}],
    "move": [{"c": "hack.move", "s": [["barbend-hack-squat", "How to Do the Hack Squat — Descent (drop hips back and down); Ascent (push your feet into the floor to stand up)"], ["coach-hack-squat", "Barbell Hack Squat — Descent (bend your knees to lower); Ascent (back to the start)"]]}],
    "tips": [{"c": "hinge.back", "s": [["barbend-hack-squat", "How to Do the Hack Squat — Back (spine neutral); Mistakes: Rounding"], ["coach-hack-squat", "Barbell Hack Squat — Back (shoulder blades to straighten your back)"]]}],
    "mistakes": [{"c": "sq.mis.heels", "s": [["barbend-hack-squat", "Mistakes: Heels lifting"], ["coach-hack-squat", "Barbell Hack Squat — Ascent (drive through midfoot and heels); Mistakes: pressing through the forefoot"]]}]
  },
  "Stability Ball Hamstring Curl": {
    "setup": [{"c": "ballcurl.setup", "s": [["ace-59", "Step 1–2 (na plecach, łydki i pięty na piłce; unieś biodra do linii z tułowiem; parafraza)"], ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) pozycja wyjściowa (biodra w pełnym wyproście, obie pięty na piłce; parafraza)"]]}],
    "move": [{"c": "ballcurl.move", "s": [["ace-59", "Step 3–4 (przyciągnij pięty do bioder, potem powoli wróć; parafraza)"], ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) przyciągnięcie pięty do pośladków przy wyprostowanym biodrze, powolny powrót; parafraza"]]}],
    "tips": [{"c": "plank.brace", "s": [["ace-59", "Step 1; Tips (Brace your abs before lifting and keep them engaged; parafraza)"], ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) wskazówki (aktywny tułów przez całe powtórzenie; parafraza)"]]}],
    "mistakes": [{"c": "ballcurl.mis.sag", "s": [["ncsf-single-leg-ball-curl", "(wariant: jednonóż) przestrogi (opadające biodra; parafraza)"], ["ace-59", "Step 3 (tułów stabilny, w linii z udami — biodra wyżej, nie niżej; parafraza) — błąd = zaprzeczenie standardu"]]}]
  },
  "Single Leg Glute Bridge": {
    "setup": [{"c": "gb.slSetup", "s": [["ace-145", "Step 1"], ["catalyst-496", "opis (one knee bent, other leg straight)"]]}],
    "move": [{"c": "gb.slMove", "s": [["ace-145", "Step 2; Step 3"], ["catalyst-496", "opis (press through the whole foot, emphasizing the heel; lower under control)"]]}],
    "tips": [{"c": "ht.rigid", "s": [["ace-145", "Step 1 (brace abs); Step 2 (avoid pushing your hips too high … arching)"], ["catalyst-496", "opis (ensure the motion is at the hip)"]]}],
    "mistakes": [{"c": "ht.mis.arch", "s": [["ace-145", "Step 2"], ["catalyst-496", "opis (not excessive lumbar extension)"]]}]
  },
  "Clamshell": {
    "setup": [{"c": "clam.setup", "s": [["nasm-blog-banded-clamshell", "Setup — lie on one side with the knees bent and stacked"], ["ace-pro-6315", "Clam Shells — leżenie na boku, kolana ugięte, nogi jedna na drugiej"], ["catalyst-766", "opis — leżenie na boku z ugiętymi kolanami"]]}],
    "move": [{"c": "clam.move", "s": [["nasm-blog-banded-clamshell", "Movement — stopy razem, górne kolano as high as possible, ruch slow and controlled"], ["ace-pro-6315", "Clam Shells — Keeping the inner arches of the feet together, externally rotate the top leg…"], ["catalyst-766", "opis — unieś górne kolano jak najdalej i wróć pod kontrolą"]]}],
    "tips": [
      {"c": "clam.noRoll", "s": [["nasm-blog-banded-clamshell", "Movement — bez odchylania bioder do tyłu"], ["catalyst-766", "opis — Without rolling the body (parafraza z wynikiem narzędzia)"]]},
      {"c": "llc.control", "s": [["nasm-blog-banded-clamshell", "Movement / Coaching Cues — slow and controlled, unikać rozpędu"], ["catalyst-766", "opis — powrót pod kontrolą"]]}
    ],
    "mistakes": []
  },
  "Donkey Kick": {
    "setup": [{"c": "bd.setup", "s": [["ace-270", "Step 1 — kolana directly under your hips, dłonie directly under your shoulders, kręgosłup neutralnie"], ["issa-donkey-kicks", "How to Do a Donkey Kick Correctly — Start on all fours…; Focus on making your back a straight line."]]}],
    "move": [{"c": "dk.move", "s": [["issa-donkey-kicks", "How to Do… — kolano ugięte; stopa jak do sufitu; The movement should be slow."], ["ace-270", "Step 2 — uniesienie nogi while maintaining your bent-knee position"]]}],
    "tips": [
      {"c": "plank.brace", "s": [["ace-270", "Step 1/2 — Stiffen your core and abdominal muscles…"], ["issa-donkey-kicks", "How to Do… — Engage and tighten your core as you lift your right leg up"]]},
      {"c": "hext.range", "s": [["ace-270", "uwaga po kroku 3 — Only raise the leg to a height where the low back position can be maintained"], ["issa-donkey-kicks", "How to Do… — Don't lift so high that your back starts to arch"]]}
    ],
    "mistakes": [{"c": "hext.mis.arch", "s": [["issa-donkey-kicks", "How to Do… — za wysoko unoszona noga wygina plecy"], ["ace-270", "uwaga po kroku 3 — przy unoszeniu nogi an increase in lumbar lordosis"]]}]
  },
  "Lateral Band Walk": {
    "setup": [{"c": "bw.setup", "s": [["nasm-blog-active-recovery", "Lateral Band Walk — Place the mini-band just above your knees (or lower…), feet hip-width apart"], ["ace-pro-5043", "Lateral Band Walks — taśma na podudziach nad kostkami"], ["ace-pro-6315", "Monster Walks (wersja: chód w bok) — taśma tuż nad kolanem"]]}],
    "move": [{"c": "bw.move", "s": [["nasm-blog-active-recovery", "Lateral Band Walk — sidestep in one direction with slow and controlled steps"], ["ace-pro-6315", "Monster Walks — chód w bok, krok zaczyna noga prowadząca"]]}],
    "tips": [
      {"c": "bw.squat", "s": [["nasm-blog-active-recovery", "Lateral Band Walk — Keep your knees bent … athletic stance (almost a squat)"], ["ace-pro-6315", "Monster Walks — keep a soft bend at the knees"]]},
      {"c": "bw.tension", "s": [["nasm-blog-active-recovery", "Lateral Band Walk — stopy co najmniej na szerokość bioder to maintain resistance in the band"], ["ace-pro-6315", "Monster Walks — Maintain resistance with the band"]]}
    ],
    "mistakes": []
  },
  "Band Calf Raise": {
    "setup": [{"c": "calf.band", "s": [["bodylastics-standing-calf-raise-flat-bands", "Setup (uchwyt w każdej dłoni, tułów wyprostowany)"], ["theraband-ankle-calf-raise-standing", "Step One–Two (guma pod przednią częścią stóp, końce w dłoniach przy biodrach)"]]}],
    "move": [{"c": "calf.rise", "s": [["bodylastics-standing-calf-raise-flat-bands", "Movement (as high on your toes as you can go; Lower your heels back to the floor under control.)"], ["theraband-ankle-calf-raise-standing", "Step Three–Four"]]}],
    "tips": [{"c": "calf.pause", "s": [["theraband-ankle-calf-raise-standing", "Step Four (Hold and slowly return.)"], ["ace-51", "Step 6 (wariant: sztanga)"]]}],
    "mistakes": [{"c": "calf.mis.partial", "s": [["nasm-calf-blog", "Technique Standards That Change Everything (szybkie, niepełne powtórzenia jako częsty błąd; wariant: stojąc na podeście)"], ["bodylastics-standing-calf-raise-flat-bands", "Movement (pełne wspięcie i opuszczenie pięt na podłogę; błąd = zaprzeczenie standardu)"]]}]
  }
}
```

Uwaga: przy przepisywaniu usunąłem cudzysłowy typograficzne z pól miejsca (bez zmiany treści); brzmienie pól miejsca przy
Hack Squat (BarBend) poprawione na faktyczny nagłówek strony.

## Wątpliwości dla koordynatora

1. **[ROZSTRZYGNIĘTE 02.11.2026 — nie źródło, Cable Pull Through otwarte; sekcja „Korekta 2” na końcu]** **Speediance** — blog producenta z autorem CSCS/ACE-CPT i datą, ale artykuł poleca własną maszynę i jest otoczony banerami
   sprzedaży. Uznałem warunkowo 4 (jak Eleiko: liczy się tekst z autorem z kwalifikacjami). Jeśli koordynator uzna polecenie
   własnej maszyny w tekście za pkt 3 (marketing) → 5, a **Cable Pull Through spada do otwartych** (`pt.setup` zostaje tylko z BarBend).
2. **Fitness Volt — data tylko w metadanych** (Axle Deadlift, Seated Good Mornings): przyjąłem dosłownie „strona, na której widać
   autora z kwalifikacjami i datę” → 5. Gdyby data w danych strukturalnych wystarczała, wracają **Axle Deadlift (własna z błędami)**
   i Seated Good Mornings (ustawienie + ruch + 2 wskazówki, bez błędów; ale artykuł FV wewnętrznie niespójny — kneeling_hinge.md:95).
3. **Kwalifikacja „PT” bez nazwy certyfikatu** (Patrick Dale, Fitness Volt) — uznałem za kwalifikację w podpisie (Pendulum Squat ma też
   nazwanego sprawdzającego). Nie zmienia liczb.
4. **Eleiko inspire360** — dział edukacji bez autora: przyjąłem 5 (brief: „tylko dział edukacji z autorem”).

## Otwarte
- [OTWARTE] Barbell Logic — trzy strony nieotwarte per strona (autor/certyfikat/data); nie wpływa na liczby.
- [OTWARTE] Life Fitness SL55/SL60 — oryginał instrukcji u producenta (support.lifefitness.com 403).
- Liczby w `STAN-g4-nogi.md` zaktualizowane (sekcja „Po przeliczeniu 02.11.2026”).

## Korekta 2 — rozstrzygnięcie koordynatora 02.11.2026 (producent z własną aplikacją treningową)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 do wątpliwości 1 — producent sprzętu z własną aplikacją treningową
nie jest źródłem techniki („dokumentacja innych aplikacji treningowych nie jest źródłem”, docs/18 02.11.2026); producent liczy się
tylko dla instrukcji własnej maszyny, a ta strona jest ogólnym poradnikiem. Fitness Volt z datą tylko w metadanych — 5, bez zmian.
Nowych stron nie otwierano.

| źródło (id) | szczebel | powód |
|---|---|---|
| Speediance — `speediance-cable-pull-through` | **nie źródło** (było 4 warunkowo) | producent wyciągów z własną aplikacją treningową; ogólny poradnik na blogu, nie instrukcja konkretnej maszyny |

| zdanie (Cable Pull Through) | źródła po korekcie | stan |
|---|---|---|
| `pt.setup` | BarBend | spada (1 organizacja) |
| `pt.move` | BarBend | spada |
| `hinge.back` | BarBend | spada |
| `rdl.knees` | BarBend | spada |
| `mis.roundBack` | BarBend (zaprzeczenie standardu) | spada |

Uwaga: dwa artykuły BarBend (`barbend-cable-pull-through`, `barbend-cable-pull-through-vs-hip-thrust`) = jedna organizacja.
Inne zdania na tym źródle: brak (w `hip_abd_add.md:151` tylko wzmianka „brak opisu”; w `hinge-cz1.md` przy Hip Thrust
`ht.mis.arch` miało już jedno źródło — nie było w bloku).

| karta | przed | po |
|---|---|---|
| Cable Pull Through | własna z błędami | **otwarta** (brak ustawienia i ruchu z 2 organizacji) |

Wynik G4: karty własne **11 → 10** (z błędami 9 → **8**, bez błędów 2 → 2); otwarte 84 → **85**; nowe zdania w kartach gotowych
22 → **20** (odpadają `pt.setup`, `pt.move`). Blok do wdrożenia wyżej poprawiony (usunięty wpis Cable Pull Through; 10 kart).
Do `orgs`/`sources` przy integracji: nie dodawać tej organizacji ani źródła.
