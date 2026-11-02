# Wskazówki techniki — rodzina `glute_floor` (fala W1, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny (dwie sesje: Clamshell — sesja 1; Donkey Kick, Fire Hydrant, Cable Kickback, Hip Extension with Bands — sesja 2)
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda: jak w `hip_abd_add.md` (ten sam katalog) i docs/33 „Metoda”. Szczeble organizacji wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026
(Western SRS = 5, Catalyst = 4, NFPT = 4 tylko z biogramem autora, producenci tylko dla własnego sprzętu).

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Cable Kickback | **gotowe** | ACE 6355, BarBend, Coach (HKU s. 4 tylko pomocniczo — szczebel do oceny, patrz „Otwarte”) |
| Donkey Kick | **gotowe** | ACE 270, ISSA, The Prehab Guys |
| Fire Hydrant | **gotowe** | ACE 7409 i 6402, Coach, ISSA, The Prehab Guys (Physitrack niepotrzebny) |
| Clamshell | **gotowe** | NASM (blog), ACE 6315, Physitrack, Catalyst Athletics (szczebel 4 potwierdzony 02.11) |
| Machine Glute Kickback | otwarte | Western SRS ma szczebel 5 — zostaje zero źródeł szczebla 4; instrukcji producenta maszyny nie znalazłem |
| Hip Extension with Bands | **gotowe** | Coach (wersja z gumą), The Prehab Guys, BarBend, ACE 6355 (wariant: bez gumy) |
| Prone Flutter Kicks | otwarte | jedno źródło (Coach, „Reverse flutter kicks on a bench”) |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Clamshell": {
    "setup": [
      {"c": "clam.setup", "s": [
        ["nasm-blog-banded-clamshell", "Setup — „lie on one side with the knees bent and stacked”"],
        ["ace-pro-6315", "Clam Shells — leżenie na boku, kolana ugięte, nogi jedna na drugiej"],
        ["physitrack-clamshell", "Step 1 — „Lie on your good side with your legs bent and stacked on top of one another.”"],
        ["catalyst-766", "opis — leżenie na boku z ugiętymi kolanami"]
      ]}
    ],
    "move": [
      {"c": "clam.move", "s": [
        ["nasm-blog-banded-clamshell", "Movement — stopy razem, górne kolano „as high as possible”, ruch „slow and controlled”"],
        ["ace-pro-6315", "Clam Shells — „Keeping the inner arches of the feet together, externally rotate the top leg…”"],
        ["physitrack-clamshell", "FAQ — stopy razem, powoli unieś górne kolano i powoli opuść"],
        ["catalyst-766", "opis — unieś górne kolano jak najdalej i wróć pod kontrolą"]
      ]}
    ],
    "tips": [
      {"c": "clam.noRoll", "s": [
        ["nasm-blog-banded-clamshell", "Movement — bez odchylania bioder do tyłu"],
        ["catalyst-766", "opis — „Without rolling the body” (parafraza z wynikiem narzędzia)"]
      ]},
      {"c": "llc.control", "s": [
        ["nasm-blog-banded-clamshell", "Movement / Coaching Cues — „slow and controlled”, unikać rozpędu"],
        ["catalyst-766", "opis — powrót pod kontrolą"],
        ["physitrack-clamshell", "FAQ — „slowly lower your top knee back to the starting position”"]
      ]}
    ],
    "mistakes": []
  },
  "Donkey Kick": {
    "setup": [
      {"c": "bd.setup", "s": [
        ["ace-270", "Step 1 — kolana „directly under your hips”, dłonie „directly under your shoulders”, kręgosłup neutralnie"],
        ["issa-donkey-kicks", "How to Do a Donkey Kick Correctly — „Start on all fours on the mat with hands shoulder-width apart and knees hip-width apart.”; „Focus on making your back a straight line.”"],
        ["prehab-donkey-kick", "HOW — „Start in a quadruped position on your hands and knees.”"]
      ]}
    ],
    "move": [
      {"c": "dk.move", "s": [
        ["prehab-donkey-kick", "HOW — kolano ugięte, „kick your foot back and up towards the ceiling”, „Slowly lower and repeat”"],
        ["issa-donkey-kicks", "How to Do… — kolano ugięte; „as if the bottom of your foot is going to press flat against the ceiling”; „The movement should be slow.”"],
        ["ace-270", "Step 2 — uniesienie nogi „while maintaining your bent-knee position”"]
      ]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [
        ["ace-270", "Step 1/2 — „Stiffen your core and abdominal muscles…”, „Maintain a strong, stable core”"],
        ["issa-donkey-kicks", "How to Do… — „Engage and tighten your core as you lift your right leg up”"],
        ["prehab-donkey-kick", "FEEL — mięśnie brzucha „working to resist body movement”"]
      ]},
      {"c": "hext.range", "s": [
        ["ace-270", "uwaga po kroku 3 — „Only raise the leg to a height where the low back position can be maintained”"],
        ["issa-donkey-kicks", "How to Do… — „Don't lift so high that your back starts to arch–keep a neutral spine.”"]
      ]}
    ],
    "mistakes": [
      {"c": "hext.mis.arch", "s": [
        ["prehab-donkey-kick", "COMPENSATION — „Do not arch your low back as you kick back.”"],
        ["issa-donkey-kicks", "How to Do… — za wysoko unoszona noga wygina plecy"],
        ["ace-270", "uwaga po kroku 3 — przy unoszeniu nogi „an increase in lumbar lordosis”"]
      ]}
    ]
  },
  "Fire Hydrant": {
    "setup": [
      {"c": "bd.setup", "s": [
        ["ace-pro-7409", "Fire Hydrant — „Start in a quadruped position with the hands under the shoulders and knees under the hips.”; „Keep the spine long”"],
        ["coach-fire-hydrant", "How to — „Start on all fours with your hands under your shoulders and your knees under your hips.”"],
        ["issa-hip-abduction", "Fire Hydrant — klęk podparty, dłonie w linii barków"]
      ]}
    ],
    "move": [
      {"c": "fh.move", "s": [
        ["ace-pro-7409", "Fire Hydrant — „slowly lifting the right leg out to the side”, „while keeping the knee bent”"],
        ["coach-fire-hydrant", "How to — „Lift one leg out to the side, keeping the 90° bend in your knee.”, potem opuść"],
        ["issa-hip-abduction", "Fire Hydrant — „raising your right knee away from the body keeping the leg flexed”"]
      ]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [
        ["ace-pro-7409", "Fire Hydrant — „brace the core muscles”"],
        ["coach-fire-hydrant", "Tips — „Brace your core, and try to keep it engaged throughout the move”"]
      ]},
      {"c": "fh.level", "s": [
        ["ace-pro-6402", "Two-legged Fire Hydrant — „Maintain a squared-off position in the shoulders and keep your hips level” (wariant: z uniesioną ręką)"],
        ["issa-hip-abduction", "Fire Hydrant — „Raise the leg up as far as you can without rotating or twisting the hips.”"],
        ["prehab-quadruped-firehydrants", "notatki — „The ONLY THING MOVING SHOULD BE THE HIP JOINT.”"]
      ]}
    ],
    "mistakes": []
  },
  "Cable Kickback": {
    "setup": [
      {"c": "ck.setup", "s": [
        ["ace-pro-6355", "Single-leg cable extension — wyciąg na najniższym poziomie, mankiet na kostce, przodem do zaczepu, trzymanie uchwytów"],
        ["barbend-glute-kickbacks", "Cable Glute Kickback, Step 1–3 — „adjust its height to the lowest position”, „face the cable machine”, ręce opierają się o maszynę"],
        ["coach-standing-glute-kickback", "How to — „Stand facing the machine … and hold the pole with both hands.”"]
      ]}
    ],
    "move": [
      {"c": "ck.move", "s": [
        ["ace-pro-6355", "Single-leg cable extension — „Slowly raise the heel by initiating the movement from the glutes.”"],
        ["barbend-glute-kickbacks", "Cable Glute Kickback — praca pośladka, noga w tył; Step 5 powrót"],
        ["coach-standing-glute-kickback", "How to — „Raise the leg attached to the machine directly behind you”"]
      ]}
    ],
    "tips": [
      {"c": "ck.slow", "s": [
        ["coach-standing-glute-kickback", "How to — „don't let the pull of the cable machine hurry you through this stage of the exercise”"],
        ["barbend-glute-kickbacks", "Step 5 — „slowly lower back to the starting position”"]
      ]},
      {"c": "hab.hips", "s": [
        ["barbend-glute-kickbacks", "Common mistakes — „Do not allow your lower back to arch, don't flare your upper back, or sway your hips.”"],
        ["ace-pro-6355", "Single-leg cable extension — „all while keeping an erect torso”"]
      ]}
    ],
    "mistakes": []
  },
  "Hip Extension with Bands": {
    "setup": [
      {"c": "hexb.setup", "s": [
        ["coach-standing-glute-kickback", "Resistance band glute kick-back — zaczep i „something you can hold”, „Loop the other end of the band around one ankle”"],
        ["prehab-standing-hip-ext-ankles", "HOW — guma na kostkach, przy problemie z równowagą oprzyj się o ścianę (wariant: miniguma)"]
      ]}
    ],
    "move": [
      {"c": "ck.move", "s": [
        ["coach-standing-glute-kickback", "Resistance band glute kick-back — to samo ćwiczenie co z wyciągiem: noga „directly behind you”"],
        ["prehab-standing-hip-ext-ankles", "HOW — „kick back as far as you can”; FEEL — pośladki"],
        ["barbend-band-glutes", "Standing Resistance Band Glute Kickback — „flex your glute to move the leg away from your body” (wariant: pod kątem ok. 45°)"]
      ]}
    ],
    "tips": [
      {"c": "hab.hips", "s": [
        ["prehab-standing-hip-ext-ankles", "COMPENSATION — „Avoid moving your low back or trunk with this exercise.”"],
        ["ace-pro-6355", "Hip extension and abductions — „Lift one leg back as high as possible without moving your upper body.” (wariant: bez gumy)"]
      ]},
      {"c": "plank.brace", "s": [
        ["barbend-band-glutes", "Standing Resistance Band Glute Kickback — „Maintain a slight hinge and a solid core brace”"],
        ["prehab-standing-hip-ext-ankles", "COMPENSATION — „keep everything stationary”"]
      ]}
    ],
    "mistakes": []
  }
}
```

Uwaga do zestawu ogólnego Clamshell (`hab.hips`, `llc.control`, `hab.mis.high`): `hab.mis.high` („Noga za wysoko…”) przeczy źródłom
(NASM i Catalyst: kolano „as high as possible”, ACE: do końca zakresu ruchu) — zestaw do poprawy; karta powyżej go nie ma.

Uwagi do zestawów ogólnych (sesja 2): przy Donkey Kick źródła potwierdzają `plank.brace`, `hext.range`, `hext.mis.arch` (zgodne z zestawem `hipExt`).
Przy Cable Kickback żadne przeczytane źródło nie mówi o ograniczaniu zakresu (`hext.range`) — ACE 6355 każe unosić „until you cannot lift your leg
anymore”, BarBend — do chwili, gdy tułów zaczyna uciekać; to różnica, więc `hext.range` poza kartą. Przy Fire Hydrant `hab.mis.high` — bez źródła
(Coach: do wysokości biodra, ISSA: „as far as you can” bez skręcania bioder).

## Nowe zdania

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| clam.setup | Połóż się na boku, kolana ugięte, nogi ułożone jedna na drugiej. | Lie on your side, knees bent, legs stacked. | brak zdania o ułożeniu na boku z ugiętymi kolanami |
| clam.move | Trzymając stopy razem, unieś górne kolano jak najwyżej i opuść je powoli. | Keep your feet together, lift your top knee as high as you can, then lower it slowly. | brak zdania o ruchu „muszli” |
| clam.noRoll | Biodra nie uciekają do tyłu — zostań na boku. | Don't let your hips roll back — stay on your side. | wspólna wskazówka NASM i Catalyst |
| dk.move | Nie prostując kolana, unieś nogę w tył i w górę, podeszwą w stronę sufitu; potem powoli ją opuść. | Keeping your knee bent, lift your leg back and up, sole toward the ceiling, then lower it slowly. | brak zdania o ruchu w klęku z ugiętym kolanem |
| fh.move | Nie prostując kolana, unieś nogę w bok i opuść ją z powrotem. | Keeping your knee bent, lift your leg out to the side, then bring it back down. | brak zdania o odwiedzeniu w klęku |
| fh.level | Ruch tylko w biodrze — nie przechylaj się i nie skręcaj bioder, żeby unieść nogę wyżej. | Move only at the hip — don't lean or twist your hips to get the leg higher. | wspólna wskazówka ACE, ISSA, Prehab; `bd.level` mówi o skręcaniu tułowia, nie o przechyle |
| ck.setup | Ustaw wyciąg nisko, załóż mankiet na kostkę i stań przodem do maszyny, trzymając się jej. | Set the pulley low, strap the cuff to your ankle and face the machine, holding on. | brak zdania o ustawieniu przy wyciągu przodem |
| ck.move | Odprowadź nogę w tył, prowadząc ruch pośladkiem, i wróć. | Drive your leg back, leading with your glute, then return. | brak zdania o wyproście biodra na stojąco (wyciąg i guma) |
| ck.slow | Wracaj powoli — nie daj się lince pociągnąć nogi do przodu. | Come back slowly — don't let the cable yank your leg forward. | wskazówka Coach i BarBend o fazie powrotu |
| hexb.setup | Załóż gumę na kostkę i przytrzymaj się czegoś stabilnego. | Loop the band around your ankle and hold onto something sturdy. | brak zdania o ustawieniu z gumą na stojąco |

Zdania istniejące użyte: `llc.control`, `bd.setup`, `plank.brace`, `hext.range`, `hext.mis.arch`, `hab.hips`.

Uwaga do `hab.hips` przy Cable Kickback i Hip Extension with Bands: źródła mówią o nieruchomym tułowiu i braku kołysania biodrami
(BarBend, Prehab, ACE) — zdanie pasuje. Przy odwodzeniu/przywodzeniu (plik `hip_abd_add.md`) nadal bez potwierdzenia.

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| nasm-blog-banded-clamshell | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes | NASM | 4 | Setup, Movement, Coaching Cues; „The primary muscle targeted during the banded clamshell is the gluteus medius.” |
| physitrack-clamshell | https://www.physitrack.com/exercise-library/how-to-perform-the-clamshell-exercise | Physitrack | 4 | Step 1–3, FAQ |
| catalyst-766 | https://catalystathletics.com/exercise/766/Clamshell/ | Catalyst Athletics (NOWA org.) | 4 (rozstrzygnięcie koordynatora 02.11) | opis ćwiczenia; narzędzie zwróciło parafrazę + krótki cytat „a very simple and accessible exercise to strengthen the lateral hip” |
| ace-pro-7409 | https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/ | ACE | 4 | P. McCall, 30.10.2019, „Fire Hydrant”: „Start in a quadruped position with the hands under the shoulders and knees under the hips.” |
| ace-pro-6402 | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ | ACE | 4 | A. Chelik, 01.05.2017, „Two-legged Fire Hydrant”: „keep your hips level as you continue to move the right leg” |
| physitrack-fire-hydrant | https://www.physitrack.com/exercise-library/how-to-perform-the-fire-hydrant-exercise | Physitrack | 4 | Step 1–2 — niewykorzystane w karcie (sprzeczności na stronie) |
| western-fm | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html | Western SRS | **5** (rozstrzygnięcie 02.11) | FM Hamstring, wersja na pośladki — nie liczy się do dwóch źródeł |
| ace-270 | https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/ | ACE | 4 | Quadruped Bent-knee Hip Extensions, Step 1–2 i uwaga po kroku 3: „Only raise the leg to a height where the low back position can be maintained” |
| ace-pro-6355 | https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/ | ACE | 4 | M. Martin, 21.03.2017, „Single-leg cable extension”, „Hip extension and abductions”: „Lift one leg back as high as possible without moving your upper body.” |
| issa-donkey-kicks | https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes | ISSA (NOWA org.) | 4 (treść firmowana „ISSA”, 05.02.2024) | „How to Do a Donkey Kick Correctly”: „Don't lift so high that your back starts to arch–keep a neutral spine.” |
| issa-hip-abduction | https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes | ISSA | 4 (treść firmowana „ISSA”, 05.02.2024) | „Fire Hydrant”: „Raise the leg up as far as you can without rotating or twisting the hips.” |
| prehab-donkey-kick | https://theprehabguys.com/vimeo-video/donkey-kick/ | The Prehab Guys | 4 | Exercise notes HOW/FEEL/COMPENSATION: „Do not arch your low back as you kick back.” |
| prehab-quadruped-firehydrants | https://theprehabguys.com/vimeo-video/quadruped-firehydrants/ | The Prehab Guys | 4 | notatki: „The ONLY THING MOVING SHOULD BE THE HIP JOINT.” |
| prehab-standing-hip-ext-ankles | https://theprehabguys.com/vimeo-video/standing-hip-extension-band-at-ankles-wall-supported/ | The Prehab Guys | 4 | HOW/COMPENSATION: „Avoid moving your low back or trunk with this exercise.” |
| coach-fire-hydrant | https://www.coachweb.com/glute-exercises/9113/fire-hydrant | Coach | 4 | N. Harris-Fry, 03.11.2021: „Lift one leg out to the side, keeping the 90° bend in your knee.” |
| coach-standing-glute-kickback | https://www.coachweb.com/glute-exercises/9117/standing-glute-kick-back | Coach | 4 | N. Harris-Fry, 05.11.2021; sekcja „Resistance band glute kick-back”: „you can do the standing glute kick-back with a resistance band” |
| barbend-glute-kickbacks | https://barbend.com/glute-kickbacks/ | BarBend | 4 (artykuł o technice) | E. Bugera, CSCS, akt. 24.04.2024, „Cable Glute Kickback”, Common mistakes |
| barbend-band-glutes | https://barbend.com/resistance-band-exercises-for-glutes/ | BarBend | 4 (artykuł o technice) | E. Bugera, akt. 17.11.2024, „Standing Resistance Band Glute Kickback”: „Maintain a slight hinge and a solid core brace” |
| coach-flutter-kicks | https://www.coachweb.com/abs-exercises/8505/flutter-kicks | Coach | 4 | N. Harris-Fry, akt. 21.07.2023, „Reverse flutter kicks” — tylko w „Otwarte” |

`ace-pro-6315` — opis w `hip_abd_add.md`. Dwie strony BarBend (`barbend-glute-kickbacks`, `barbend-band-glutes`) to jedna organizacja — nigdzie nie liczone jako dwa źródła.

ISSA i NFPT: NFPT („5 Effective Glute Activation Exercises”, E. Nitschke, 28.04.2025) przeczytane, ale strona nie ma biogramu z kwalifikacjami → szczebel 5
wg rozstrzygnięcia; nie użyte. ISSA nigdzie nie jest jedyną parą z NFPT.

```json
{
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; serwis szkoleniowy podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "ISSA": {"name": "International Sports Sciences Association — blog (issaonline.com; organizacja certyfikująca trenerów, treść firmowana ISSA z datą)", "level": 4, "kind": "org"}
  },
  "sources": {
    "nasm-blog-banded-clamshell": {"org": "NASM", "title": "The Banded Clamshell: A Simple Move for Stronger Glutes (blog NASM)", "url": "https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes", "level": 4},
    "physitrack-clamshell": {"org": "Physitrack", "title": "Step-by-step guide to the clamshell exercise", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-clamshell-exercise", "level": 4},
    "catalyst-766": {"org": "Catalyst Athletics", "title": "Clamshell (#766)", "url": "https://catalystathletics.com/exercise/766/Clamshell/", "level": 4},
    "ace-270": {"org": "ACE", "title": "Quadruped Bent-knee Hip Extensions", "url": "https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/", "level": 4},
    "ace-pro-6355": {"org": "ACE", "title": "Martin M.: 8 Butt-toning Moves (ACE, 21.03.2017)", "url": "https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/", "level": 4},
    "ace-pro-7409": {"org": "ACE", "title": "McCall P.: 7 New Moves to Challenge Your Glutes and Hamstrings (ACE, 30.10.2019)", "url": "https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/", "level": 4},
    "ace-pro-6402": {"org": "ACE", "title": "Chelik A.: 5 Ab Exercises — No Crunches, No Equipment (ACE, 01.05.2017)", "url": "https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/", "level": 4},
    "issa-donkey-kicks": {"org": "ISSA", "title": "Donkey Kicks: Benefits and Variations for Strong Glutes (ISSA, 05.02.2024)", "url": "https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes", "level": 4},
    "issa-hip-abduction": {"org": "ISSA", "title": "Hip Abduction Exercises for Stronger Hips and Glutes (ISSA, 05.02.2024) — Fire Hydrant", "url": "https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes", "level": 4},
    "prehab-donkey-kick": {"org": "The Prehab Guys", "title": "Donkey Kick", "url": "https://theprehabguys.com/vimeo-video/donkey-kick/", "level": 4},
    "prehab-quadruped-firehydrants": {"org": "The Prehab Guys", "title": "Quadruped Firehydrants With Band", "url": "https://theprehabguys.com/vimeo-video/quadruped-firehydrants/", "level": 4},
    "prehab-standing-hip-ext-ankles": {"org": "The Prehab Guys", "title": "Standing Hip Extension — Band At Ankles, Wall Supported", "url": "https://theprehabguys.com/vimeo-video/standing-hip-extension-band-at-ankles-wall-supported/", "level": 4},
    "coach-fire-hydrant": {"org": "Coach", "title": "How To Do The Fire Hydrant (Harris-Fry N., 03.11.2021)", "url": "https://www.coachweb.com/glute-exercises/9113/fire-hydrant", "level": 4},
    "coach-standing-glute-kickback": {"org": "Coach", "title": "How To Do The Standing Glute Kick-back (Harris-Fry N., 05.11.2021)", "url": "https://www.coachweb.com/glute-exercises/9117/standing-glute-kick-back", "level": 4},
    "barbend-glute-kickbacks": {"org": "BarBend", "title": "How to Do Glute Kickbacks to Build Your Butt (Bugera E., 2024)", "url": "https://barbend.com/glute-kickbacks/", "level": 4},
    "barbend-band-glutes": {"org": "BarBend", "title": "The 7 Best Resistance Band Exercises for Building Bigger, Better Glutes (Bugera E., 2024) — Standing Resistance Band Glute Kickback", "url": "https://barbend.com/resistance-band-exercises-for-glutes/", "level": 4}
  }
}
```

Catalyst Athletics ma szczebel 4 (rozstrzygnięcie koordynatora 02.11.2026), więc karta Clamshell jest kompletna (`clam.noRoll`: NASM + Catalyst).

## Otwarte

- **Machine Glute Kickback** — jedyny opis: Western „LF Hip and Glute” („Push the pad down with your leg until your hip is fully extended, then reverse
  the movement with control.”), ale Western SRS = szczebel 5. Maszyny różnią się konstrukcją (klęcząca z padem pod klatką, stojąca z padem na udzie).
  Rozstrzygnie: instrukcja producenta konkretnej maszyny (naklejka/instrukcja obsługi) + drugi producent albo organizacja szkoląca trenerów; najpierw
  ustalić z figurą, którą konstrukcję pokazuje karta.
- **Prone Flutter Kicks** — tylko Coach („Reverse flutter kicks (on a bench)”: biodra na krawędzi ławki, trzymaj przód ławki, „squeeze your glutes,
  then start to slowly move them up and down under control”). ACE 6355 „Hip extension on bench” (obie nogi razem, bez naprzemienności) — analogia.
  Rozstrzygnie: druga organizacja opisująca naprzemienne nożyce leżąc przodem na ławce.
- **Fire Hydrant — stopa w bok** (Prehab: częsty błąd to brak rotacji zewnętrznej, stopa ma wskazywać w bok) — jedna organizacja; nie w karcie.
- **Cable Kickback — kierunek i zakres** — T Nation (M. Shaughnessy, 06.05.2021, https://archive.t-nation.com/training/cable-glute-exercises-form/)
  zaleca prowadzić nogę „back and out by 30 degrees” i krótki zakres; szczebla serwisu (wydawca należy do producenta suplementów) nie oceniałem —
  nie liczony. `ck.move` („w tył”) mu nie przeczy; zalecenie „prosto w tył” celowo nie trafiło do zdania. BarBend też opisuje wariant pod kątem 45°.
- **HKU CSE** (`hku-shsc-legs`, s. 4 Cable Kickback) — uczelniane centrum sportu, jak Western; wg kryterium (a) rozstrzygnięcia prawdopodobnie szczebel 5.
  Karta Cable Kickback na nim nie polega. Do potwierdzenia przez koordynatora.
- **Physitrack** — platforma oprogramowania dla fizjoterapeutów; gdyby uznać ją za „dokumentację innej aplikacji”, karta Clamshell nadal ma 2 inne
  organizacje przy każdym zdaniu (NASM, ACE, Catalyst). Do potwierdzenia przez koordynatora.
- Zestawy ogólne `hipExt`: `plank.brace` przy Cable Kickback — BarBend tak, ACE/Coach nie; poza kartą. Prone Flutter Kicks — bez danych.

## Dostęp

- ExRx i web.archive.org — nie próbowano (polecenie koordynatora).
- Physio-pedia — 403. Strony serwisów aplikacji z wyników wyszukiwania pominięto (nie zapisano).
- Instrukcje maszyn do kickbacku: wyniki wyszukiwania to serwisy aplikacji i sklepy (pominięte) albo indeksy instrukcji bez treści ćwiczeń.
- issaonline.com — chwilowe 503 (druga próba udana).
