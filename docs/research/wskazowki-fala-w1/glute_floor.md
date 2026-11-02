# Wskazówki techniki — rodzina `glute_floor` (fala W1, G4)

Data: 02.11.2026 · autor: badacz-merytoryczny (dwie sesje: Clamshell — sesja 1; Donkey Kick, Fire Hydrant, Cable Kickback, Hip Extension with Bands — sesja 2)
Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Korekta szczebli 2 (02.11.2026)

Zastosowano ROZSTRZYGNIĘCIE 2 koordynatora linii 1.1 (02.11.2026, ok. 07:55). Bez nowych źródeł (dwa już użyte źródła przeczytane ponownie, żeby sprawdzić, czy ratują zdania — nie ratują).

- **Physitrack** (`physitrack-clamshell`, `physitrack-fire-hydrant`) 4 → **5** (lista koordynatora).
- **The Prehab Guys** (`prehab-donkey-kick`, `prehab-quadruped-firehydrants`, `prehab-standing-hip-ext-ankles`) 4 → **5**: sprawdzone 02.11 (WebFetch) strony `vimeo-video` (`donkey-kick`; także `single-leg-hip-thrust` z `hip_bridge.md`) — bez autora i kwalifikacji, tylko data i stopka firmy; te strony mają ten sam szablon.
- **Coach** (`coach-fire-hydrant`, `coach-standing-glute-kickback`, `coach-flutter-kicks`) 4 → **5**: sprawdzone 02.11 — autor N. Harris-Fry, biogram: „a journalist who has been covering health and fitness since 2015”, bez kwalifikacji trenerskich; wszystkie trzy artykuły tego autora.
- **HKU CSE** (`hku-shsc-legs`) → **5** (uczelniane centrum sportu bez autora). Western SRS — 5 bez zmian.
- Potwierdzone 4: ACE, NASM, ISSA, Catalyst Athletics, BarBend (E. Bugera, CSCS — artykuły o technice).
- Reguła błędów: `hext.mis.arch` przy Donkey Kick ma w obu liczonych źródłach jawne ostrzeżenie (ISSA: „Don't lift so high that your back starts to arch”; ACE 270: „an increase in lumbar lordosis”) — nie opiera się na samym standardzie, bez oznaczenia.
- Zmiany w kartach:
  - **Clamshell** — zostaje gotowe; usunięte odwołania do Physitrack (każde zdanie ma nadal NASM + ACE/Catalyst).
  - **Donkey Kick** — zostaje gotowe; usunięte odwołania do Prehab (każde zdanie ma ACE + ISSA).
  - **Fire Hydrant: gotowe → otwarte** — `plank.brace` miał ACE 7409 + Coach → zostaje 1 źródło; usunięty z bloku. Zostaje `fh.level` jako jedyne zdanie wskazówek (minimum to 2). ISSA przeczytana ponownie — o napięciu brzucha nie mówi.
  - **Cable Kickback: gotowe → otwarte** — `ck.slow` miał Coach + BarBend → 1 źródło; usunięty. ACE 6355 przeczytany ponownie — o powolnym powrocie nie mówi („Return to starting position and repeat.”). Zostaje `hab.hips` jako jedyne zdanie wskazówek.
  - **Hip Extension with Bands: gotowe → otwarte** — `hexb.setup` (Coach + Prehab → 0), `ck.move` (→ tylko BarBend), `hab.hips` (→ tylko ACE 6355), `plank.brace` (→ tylko BarBend).
  - Prone Flutter Kicks — było otwarte (jedyne źródło Coach, teraz 5).
- Zdania usunięte z bloku JSON: 12 (po 4 na ćwiczenie — liczone wpisy zdań przy ćwiczeniach: Fire Hydrant `bd.setup`, `fh.move`, `plank.brace`, `fh.level`; Cable Kickback `ck.setup`, `ck.move`, `ck.slow`, `hab.hips`; Hip Extension with Bands `hexb.setup`, `ck.move`, `hab.hips`, `plank.brace`). Dane w „Dane częściowe”.
- Gotowe: przed 5 → po **2** (Clamshell, Donkey Kick).

Metoda: jak w `hip_abd_add.md` (ten sam katalog) i docs/33 „Metoda”. Szczeble organizacji wg rozstrzygnięć koordynatora linii 1.1 z 02.11.2026
(Western SRS = 5, Catalyst = 4, NFPT = 4 tylko z biogramem autora, producenci tylko dla własnego sprzętu; rozstrzygnięcie 2 — wyżej).

## Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Cable Kickback | otwarte (korekta 2) | ustawienie, ruch, `hab.hips` — ACE 6355 + BarBend; brakuje drugiego zdania wskazówek/błędów (`ck.slow` — tylko BarBend) |
| Donkey Kick | **gotowe** | ACE 270, ISSA |
| Fire Hydrant | otwarte (korekta 2) | ustawienie, ruch, `fh.level` — ACE + ISSA; brakuje drugiego zdania wskazówek/błędów (`plank.brace` — tylko ACE) |
| Clamshell | **gotowe** | NASM (blog), ACE 6315, Catalyst Athletics |
| Machine Glute Kickback | otwarte | Western SRS ma szczebel 5 — zostaje zero źródeł szczebla 4; instrukcji producenta maszyny nie znalazłem |
| Hip Extension with Bands | otwarte (korekta 2) | Coach i Prehab — 5; zostają BarBend (wariant: pod kątem) i ACE 6355 (wariant: bez gumy), każde przy innym zdaniu |
| Prone Flutter Kicks | otwarte | jedyne źródło (Coach) — szczebel 5 |

## Wpisy do `cues.json` → `exercises`

```json
{
  "Clamshell": {
    "setup": [
      {"c": "clam.setup", "s": [
        ["nasm-blog-banded-clamshell", "Setup — „lie on one side with the knees bent and stacked”"],
        ["ace-pro-6315", "Clam Shells — leżenie na boku, kolana ugięte, nogi jedna na drugiej"],
        ["catalyst-766", "opis — leżenie na boku z ugiętymi kolanami"]
      ]}
    ],
    "move": [
      {"c": "clam.move", "s": [
        ["nasm-blog-banded-clamshell", "Movement — stopy razem, górne kolano „as high as possible”, ruch „slow and controlled”"],
        ["ace-pro-6315", "Clam Shells — „Keeping the inner arches of the feet together, externally rotate the top leg…”"],
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
        ["catalyst-766", "opis — powrót pod kontrolą"]
      ]}
    ],
    "mistakes": []
  },
  "Donkey Kick": {
    "setup": [
      {"c": "bd.setup", "s": [
        ["ace-270", "Step 1 — kolana „directly under your hips”, dłonie „directly under your shoulders”, kręgosłup neutralnie"],
        ["issa-donkey-kicks", "How to Do a Donkey Kick Correctly — „Start on all fours on the mat with hands shoulder-width apart and knees hip-width apart.”; „Focus on making your back a straight line.”"]
      ]}
    ],
    "move": [
      {"c": "dk.move", "s": [
        ["issa-donkey-kicks", "How to Do… — kolano ugięte; „as if the bottom of your foot is going to press flat against the ceiling”; „The movement should be slow.”"],
        ["ace-270", "Step 2 — uniesienie nogi „while maintaining your bent-knee position”"]
      ]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [
        ["ace-270", "Step 1/2 — „Stiffen your core and abdominal muscles…”, „Maintain a strong, stable core”"],
        ["issa-donkey-kicks", "How to Do… — „Engage and tighten your core as you lift your right leg up”"]
      ]},
      {"c": "hext.range", "s": [
        ["ace-270", "uwaga po kroku 3 — „Only raise the leg to a height where the low back position can be maintained”"],
        ["issa-donkey-kicks", "How to Do… — „Don't lift so high that your back starts to arch–keep a neutral spine.”"]
      ]}
    ],
    "mistakes": [
      {"c": "hext.mis.arch", "s": [
        ["issa-donkey-kicks", "How to Do… — za wysoko unoszona noga wygina plecy"],
        ["ace-270", "uwaga po kroku 3 — przy unoszeniu nogi „an increase in lumbar lordosis”"]
      ]}
    ]
  }
}
```

Uwaga do zestawu ogólnego Clamshell (`hab.hips`, `llc.control`, `hab.mis.high`): `hab.mis.high` („Noga za wysoko…”) przeczy źródłom
(NASM i Catalyst: kolano „as high as possible”, ACE: do końca zakresu ruchu) — zestaw do poprawy; karta powyżej go nie ma.

Uwagi do zestawów ogólnych (sesja 2): przy Donkey Kick źródła potwierdzają `plank.brace`, `hext.range`, `hext.mis.arch` (zgodne z zestawem `hipExt`).
Przy Cable Kickback żadne przeczytane źródło nie mówi o ograniczaniu zakresu (`hext.range`) — ACE 6355 każe unosić „until you cannot lift your leg
anymore”, BarBend — do chwili, gdy tułów zaczyna uciekać; to różnica, więc `hext.range` poza kartą. Przy Fire Hydrant `hab.mis.high` — bez źródła
(Coach: do wysokości biodra, ISSA: „as far as you can” bez skręcania bioder).

## Dane częściowe (ćwiczenia otwarte — nie do `cues.json`)

- **Fire Hydrant** (korekta 2) — z 2 źródłami szczebla 4: `bd.setup` (ACE 7409 „Start in a quadruped position…”; ISSA Fire Hydrant — klęk podparty, dłonie w linii barków), `fh.move` (ACE 7409 „slowly lifting the right leg out to the side … keeping the knee bent”; ISSA „raising your right knee away from the body keeping the leg flexed”), `fh.level` (ACE 6402 — wariant: z uniesioną ręką; ISSA „without rotating or twisting the hips”). Z 1 źródłem: `plank.brace` (ACE 7409 „brace the core muscles”; Coach — 5). Brakuje drugiego zdania wskazówek/błędów.
- **Cable Kickback** (korekta 2) — z 2 źródłami: `ck.setup` (ACE 6355; BarBend Cable Glute Kickback Step 1–3), `ck.move` (ACE 6355 „Slowly raise the heel by initiating the movement from the glutes”; BarBend), `hab.hips` (BarBend Common mistakes; ACE 6355 „keeping an erect torso”). Z 1 źródłem: `ck.slow` (BarBend Step 5; Coach — 5). Brakuje drugiego zdania wskazówek/błędów. `hext.mis.arch` — tylko BarBend wprost; ACE „erect torso” nie jest jego bezpośrednim zaprzeczeniem, więc reguła „błąd = zaprzeczenie standardu” nie ma tu zastosowania.
- **Hip Extension with Bands** (korekta 2) — żadne zdanie nie ma 2 źródeł szczebla 4: `hexb.setup` (Coach, Prehab — oba 5), `ck.move` (BarBend — wariant: pod kątem; Coach, Prehab — 5), `hab.hips` (ACE 6355 — wariant: bez gumy; Prehab — 5), `plank.brace` (BarBend; Prehab — 5).

## Nowe zdania

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| clam.setup | Połóż się na boku, kolana ugięte, nogi ułożone jedna na drugiej. | Lie on your side, knees bent, legs stacked. | brak zdania o ułożeniu na boku z ugiętymi kolanami |
| clam.move | Trzymając stopy razem, unieś górne kolano jak najwyżej i opuść je powoli. | Keep your feet together, lift your top knee as high as you can, then lower it slowly. | brak zdania o ruchu „muszli” |
| clam.noRoll | Biodra nie uciekają do tyłu — zostań na boku. | Don't let your hips roll back — stay on your side. | wspólna wskazówka NASM i Catalyst |
| dk.move | Nie prostując kolana, unieś nogę w tył i w górę, podeszwą w stronę sufitu; potem powoli ją opuść. | Keeping your knee bent, lift your leg back and up, sole toward the ceiling, then lower it slowly. | brak zdania o ruchu w klęku z ugiętym kolanem |

Zdania istniejące użyte: `llc.control`, `bd.setup`, `plank.brace`, `hext.range`, `hext.mis.arch`.

Zdania wstrzymane w korekcie 2 (ćwiczenia otwarte; propozycje zostają do czasu brakującego źródła):

| id | PL | EN (propozycja) | Potrzeba |
|---|---|---|---|
| fh.move | Nie prostując kolana, unieś nogę w bok i opuść ją z powrotem. | Keeping your knee bent, lift your leg out to the side, then bring it back down. | ruch odwiedzenia w klęku (Fire Hydrant) |
| fh.level | Ruch tylko w biodrze — nie przechylaj się i nie skręcaj bioder, żeby unieść nogę wyżej. | Move only at the hip — don't lean or twist your hips to get the leg higher. | wspólna wskazówka ACE i ISSA; `bd.level` mówi o skręcaniu tułowia, nie o przechyle |
| ck.setup | Ustaw wyciąg nisko, załóż mankiet na kostkę i stań przodem do maszyny, trzymając się jej. | Set the pulley low, strap the cuff to your ankle and face the machine, holding on. | ustawienie przy wyciągu przodem |
| ck.move | Odprowadź nogę w tył, prowadząc ruch pośladkiem, i wróć. | Drive your leg back, leading with your glute, then return. | wyprost biodra na stojąco (wyciąg i guma) |
| ck.slow | Wracaj powoli — nie daj się lince pociągnąć nogi do przodu. | Come back slowly — don't let the cable yank your leg forward. | po korekcie 2 tylko BarBend |
| hexb.setup | Załóż gumę na kostkę i przytrzymaj się czegoś stabilnego. | Loop the band around your ankle and hold onto something sturdy. | po korekcie 2 bez źródła szczebla 4 |

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| nasm-blog-banded-clamshell | https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes | NASM | 4 | Setup, Movement, Coaching Cues; „The primary muscle targeted during the banded clamshell is the gluteus medius.” |
| physitrack-clamshell | https://www.physitrack.com/exercise-library/how-to-perform-the-clamshell-exercise | Physitrack | **5** (korekta 2) | Step 1–3, FAQ — nie liczy się |
| catalyst-766 | https://catalystathletics.com/exercise/766/Clamshell/ | Catalyst Athletics (NOWA org.) | 4 (rozstrzygnięcie koordynatora 02.11) | opis ćwiczenia; narzędzie zwróciło parafrazę + krótki cytat „a very simple and accessible exercise to strengthen the lateral hip” |
| ace-pro-7409 | https://www.acefitness.org/resources/pros/expert-articles/7409/7-new-moves-to-challenge-your-glutes-and-hamstrings/ | ACE | 4 | P. McCall, 30.10.2019, „Fire Hydrant”: „Start in a quadruped position with the hands under the shoulders and knees under the hips.” — tylko w „Dane częściowe” |
| ace-pro-6402 | https://www.acefitness.org/resources/pros/expert-articles/6402/5-ab-exercises-no-crunches-no-equipment/ | ACE | 4 | A. Chelik, 01.05.2017, „Two-legged Fire Hydrant”: „keep your hips level as you continue to move the right leg” — tylko w „Dane częściowe” |
| physitrack-fire-hydrant | https://www.physitrack.com/exercise-library/how-to-perform-the-fire-hydrant-exercise | Physitrack | **5** (korekta 2) | Step 1–2 — niewykorzystane (sprzeczności na stronie) |
| western-fm | https://uwo.ca/campusrec/orientation/equipment_guides/freemotion_transmissions.html | Western SRS | 5 (rozstrzygnięcie 02.11) | FM Hamstring, wersja na pośladki — nie liczy się do dwóch źródeł |
| ace-270 | https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/ | ACE | 4 | Quadruped Bent-knee Hip Extensions, Step 1–2 i uwaga po kroku 3: „Only raise the leg to a height where the low back position can be maintained” |
| ace-pro-6355 | https://www.acefitness.org/resources/pros/expert-articles/6355/8-butt-toning-moves/ | ACE | 4 | M. Martin, 21.03.2017, „Single-leg cable extension”, „Hip extension and abductions”: „Lift one leg back as high as possible without moving your upper body.” — tylko w „Dane częściowe” |
| issa-donkey-kicks | https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes | ISSA (NOWA org.) | 4 (treść firmowana „ISSA”, 05.02.2024) | „How to Do a Donkey Kick Correctly”: „Don't lift so high that your back starts to arch–keep a neutral spine.” |
| issa-hip-abduction | https://issaonline.com/blog/post/hip-abduction-exercises-for-stronger-hips-and-glutes | ISSA | 4 (treść firmowana „ISSA”, 05.02.2024) | „Fire Hydrant”: „Raise the leg up as far as you can without rotating or twisting the hips.” — tylko w „Dane częściowe” |
| prehab-donkey-kick | https://theprehabguys.com/vimeo-video/donkey-kick/ | The Prehab Guys | **5** (korekta 2: bez autora) | „Do not arch your low back as you kick back.” — nie liczy się |
| prehab-quadruped-firehydrants | https://theprehabguys.com/vimeo-video/quadruped-firehydrants/ | The Prehab Guys | **5** (korekta 2: ten sam szablon bez autora) | „The ONLY THING MOVING SHOULD BE THE HIP JOINT.” — nie liczy się |
| prehab-standing-hip-ext-ankles | https://theprehabguys.com/vimeo-video/standing-hip-extension-band-at-ankles-wall-supported/ | The Prehab Guys | **5** (korekta 2) | „Avoid moving your low back or trunk with this exercise.” — nie liczy się |
| coach-fire-hydrant | https://www.coachweb.com/glute-exercises/9113/fire-hydrant | Coach | **5** (korekta 2: autor dziennikarz, bez kwalifikacji) | N. Harris-Fry, 03.11.2021 — nie liczy się |
| coach-standing-glute-kickback | https://www.coachweb.com/glute-exercises/9117/standing-glute-kick-back | Coach | **5** (korekta 2) | N. Harris-Fry, 05.11.2021 — nie liczy się |
| barbend-glute-kickbacks | https://barbend.com/glute-kickbacks/ | BarBend | 4 (artykuł o technice) | E. Bugera, CSCS, akt. 24.04.2024, „Cable Glute Kickback”, Common mistakes — tylko w „Dane częściowe” |
| barbend-band-glutes | https://barbend.com/resistance-band-exercises-for-glutes/ | BarBend | 4 (artykuł o technice) | E. Bugera, akt. 17.11.2024, „Standing Resistance Band Glute Kickback”: „Maintain a slight hinge and a solid core brace” — tylko w „Dane częściowe” |
| coach-flutter-kicks | https://www.coachweb.com/abs-exercises/8505/flutter-kicks | Coach | **5** (korekta 2) | N. Harris-Fry, akt. 21.07.2023, „Reverse flutter kicks” — tylko w „Otwarte” |
| hku-shsc-legs | https://www.cse.hku.hk/document/exercises-SHSC-GlutesQuadsHipHamstrings.pdf | HKU CSE | **5** (korekta 2: uczelniane centrum sportu bez autora) | s. 4 Cable Kickback — nie liczy się |

`ace-pro-6315` — opis w `hip_abd_add.md`. Dwie strony BarBend (`barbend-glute-kickbacks`, `barbend-band-glutes`) to jedna organizacja — nigdzie nie liczone jako dwa źródła.

ISSA i NFPT: NFPT („5 Effective Glute Activation Exercises”, E. Nitschke, 28.04.2025) przeczytane, ale strona nie ma biogramu z kwalifikacjami → szczebel 5
wg rozstrzygnięcia; nie użyte. ISSA nigdzie nie jest w parze z NFPT.

```json
{
  "orgs": {
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; serwis szkoleniowy podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "ISSA": {"name": "International Sports Sciences Association — blog (issaonline.com; organizacja certyfikująca trenerów, treść firmowana ISSA z datą)", "level": 4, "kind": "org"}
  },
  "sources": {
    "nasm-blog-banded-clamshell": {"org": "NASM", "title": "The Banded Clamshell: A Simple Move for Stronger Glutes (blog NASM)", "url": "https://www.nasm.org/resource-center/blog/training/the-banded-clamshell-a-simple-move-for-stronger-glutes", "level": 4},
    "catalyst-766": {"org": "Catalyst Athletics", "title": "Clamshell (#766)", "url": "https://catalystathletics.com/exercise/766/Clamshell/", "level": 4},
    "ace-270": {"org": "ACE", "title": "Quadruped Bent-knee Hip Extensions", "url": "https://www.acefitness.org/resources/everyone/exercise-library/270/quadruped-bent-knee-hip-extensions/", "level": 4},
    "issa-donkey-kicks": {"org": "ISSA", "title": "Donkey Kicks: Benefits and Variations for Strong Glutes (ISSA, 05.02.2024)", "url": "https://www.issaonline.com/blogs/strength/donkey-kicks-benefits-and-variations-for-strong-glutes", "level": 4}
  }
}
```

Źródła używane tylko w „Dane częściowe” (`ace-pro-7409`, `ace-pro-6402`, `ace-pro-6355`, `issa-hip-abduction`, `barbend-glute-kickbacks`, `barbend-band-glutes`) — wpis JSON dopisać przy domknięciu ćwiczenia; źródła szczebla 5 — bez wpisu (gdyby koordynator chciał je zapisać: `level: 5`).

## Otwarte

- **Fire Hydrant** (korekta 2) — brakuje drugiego zdania wskazówek/błędów z 2 źródłami szczebla 4. `plank.brace`: ACE 7409 tak, ISSA nie (przeczytane ponownie 02.11), Coach — 5. Rozstrzygnie: druga organizacja szczebla 4 z opisem fire hydrant (napięcie brzucha albo błąd, np. skręcanie bioder jako jawny błąd).
- **Cable Kickback** (korekta 2) — brakuje drugiego zdania wskazówek/błędów. `ck.slow`: BarBend tak, ACE 6355 nie (przeczytane ponownie 02.11), Coach — 5. Rozstrzygnie: druga organizacja szczebla 4 o powolnym powrocie albo o wyginaniu lędźwi przy kickbacku z wyciągiem.
- **Hip Extension with Bands** (korekta 2) — po odpadnięciu Coach i Prehab żadne zdanie nie ma 2 źródeł szczebla 4. Rozstrzygnie: dwa źródła szczebla 4 o wyproście biodra z gumą na stojąco (np. producent gum — szczebel 4 dla własnego sprzętu).
- **Machine Glute Kickback** — jedyny opis: Western „LF Hip and Glute” („Push the pad down with your leg until your hip is fully extended, then reverse
  the movement with control.”), ale Western SRS = szczebel 5. Maszyny różnią się konstrukcją (klęcząca z padem pod klatką, stojąca z padem na udzie).
  Rozstrzygnie: instrukcja producenta konkretnej maszyny (naklejka/instrukcja obsługi) + drugi producent albo organizacja szkoląca trenerów; najpierw
  ustalić z figurą, którą konstrukcję pokazuje karta.
- **Prone Flutter Kicks** — tylko Coach (szczebel 5 po korekcie 2; „Reverse flutter kicks (on a bench)”: biodra na krawędzi ławki, trzymaj przód ławki).
  ACE 6355 „Hip extension on bench” (obie nogi razem, bez naprzemienności) — analogia. Rozstrzygnie: dwie organizacje szczebla 4 opisujące naprzemienne nożyce leżąc przodem na ławce.
- **Fire Hydrant — stopa w bok** (Prehab: częsty błąd to brak rotacji zewnętrznej, stopa ma wskazywać w bok) — źródło szczebla 5; nie w karcie.
- **Cable Kickback — kierunek i zakres** — T Nation (M. Shaughnessy, 06.05.2021, https://archive.t-nation.com/training/cable-glute-exercises-form/)
  zaleca prowadzić nogę „back and out by 30 degrees” i krótki zakres; szczebla serwisu (wydawca należy do producenta suplementów) nie oceniałem —
  nie liczony. `ck.move` („w tył”) mu nie przeczy; zalecenie „prosto w tył” celowo nie trafiło do zdania. BarBend też opisuje wariant pod kątem 45°.
- **The Prehab Guys w `cues.json`** — organizacja zapisana tam jako szczebel 4; strony `vimeo-video` nie mają autora. Decyzja koordynatora: zmiana szczebla całej organizacji albo tylko tych stron.
- Zestawy ogólne `hipExt`: `plank.brace` przy Cable Kickback — BarBend tak, ACE nie; poza kartą. Prone Flutter Kicks — bez danych.

## Dostęp

- ExRx i web.archive.org — nie próbowano (polecenie koordynatora).
- Physio-pedia — 403. Strony serwisów aplikacji z wyników wyszukiwania pominięto (nie zapisano).
- Instrukcje maszyn do kickbacku: wyniki wyszukiwania to serwisy aplikacji i sklepy (pominięte) albo indeksy instrukcji bez treści ćwiczeń.
- issaonline.com — chwilowe 503 (druga próba udana).
