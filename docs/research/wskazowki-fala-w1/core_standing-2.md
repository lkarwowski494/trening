# Wskazówki techniki — fala W1, core_standing (część 2)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tryb: tylko zbieranie danych (polecenie właściciela 02.11.2026) — nic nie jest w `data/` ani `lib/`.
Metoda: `docs/research/33-wskazowki-partia2.md` („Metoda”) i `docs/research/27-wskazowki-zrodla.md`; wyjątek dla wskazówek techniki z CLAUDE.md
(2 zgodne, przeczytane źródła szczebla 4 z różnych organizacji na każde zdanie). Strony innych aplikacji treningowych nie są źródłem (uzupełnienie
briefu koordynatora) — pominięte i nienazwane. ExRx — 403, archiwum — zablokowane (nie próbowano ponownie).

## 1. Tabela

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Double Kettlebell Windmill | gotowe | 6 | ACE #386 (wariant: jeden kettlebell) + Experience Life (Life Time) — wprost wariant z dwoma kettlebellami. `mis.jerk` z zestawu ogólnego NIE potwierdzony — usunięty (pkt 5). |
| Kettlebell Figure 8 | gotowe | 3 | ACE #382 + Gymreapers + Breaking Muscle (wariant: „figure 8 to a hold”). Brak potwierdzonych „tips” — sekcja pominięta. |
| Seated Barbell Twist | otwarte | 0 | jedno przeczytane źródło szczebla 4 (wariant z drążkiem); pozostałe niedostępne (403) albo strony aplikacji |
| One-Arm High-Pulley Cable Side Bends | otwarte | 0 | brak źródeł szczebla 4 — tylko strony aplikacji i agregatory |
| Weighted Ball Side Bend | otwarte | 0 | brak 2 źródeł; ćwiczenie wykonuje się LEŻĄC bokiem na piłce — zestaw ogólny `sideBend` (stojąc) prawdopodobnie błędny (pkt 5) |
| Cable Judo Flip | otwarte | 0 | tylko strony aplikacji i agregatory |
| Bosu Ball Cable Crunch With Side Bends | otwarte | 0 | tylko strony aplikacji/agregatory; opisy sprzeczne (klęk / siad / stanie na Bosu) |
| Spell Caster | otwarte | 0 | tylko strony aplikacji/agregatory; opisy sprzeczne co do samego ruchu |

## 2. Blok do `exercises` (tylko gotowe)

```json
{
  "Double Kettlebell Windmill": {
    "setup": [
      {"c": "core_standing.windmill.setup", "s": [
        ["lifetime-el-kb-windmill", "Step 1 („press a single kettlebell overhead”) i wariant „Double-Loaded Kettlebell Windmill” („holding kettlebells in both the top and bottom hands”)"],
        ["ace-386", "opis, start (wariant: jeden kettlebell; kettlebell nad głową na prostej ręce)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.windmill.move", "s": [
        ["ace-386", "opis (wariant: jeden kettlebell; „sink back into the left hip”, wolna ręka w dół wzdłuż wewnętrznej strony nogi)"],
        ["lifetime-el-kb-windmill", "Step 2 („Shift your weight back…”) i Step 4 („allow your lower arm to trace the inside of your leg”)"]
      ]},
      {"c": "core_standing.windmill.up", "s": [
        ["ace-386", "opis, powrót (wariant: jeden kettlebell; wypchnięcie bioder w przód do pozycji stojącej)"],
        ["lifetime-el-kb-windmill", "Step 4 („then reverse the motion to come to standing”)"]
      ]}
    ],
    "tips": [
      {"c": "wm.arm", "s": [
        ["ace-386", "opis, start (wariant: jeden kettlebell; ręka z kettlebellem prosta nad głową)"],
        ["lifetime-el-kb-windmill", "Step 3 („With your extended arm reaching toward the ceiling…”)"]
      ]},
      {"c": "wm.eyes", "s": [
        ["ace-386", "opis (wariant: jeden kettlebell; „look up at the left hand”)"],
        ["lifetime-el-kb-windmill", "Step 3 („Keep your eyes on the kettlebell.”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.windmill.mis.elbow", "s": [
        ["lifetime-el-kb-windmill", "Common mistakes, „Bending the top elbow”"],
        ["ace-386", "opis, start (wariant: jeden kettlebell; polecenie trzymania górnej ręki prosto — odwrotność błędu)"]
      ]}
    ]
  },
  "Kettlebell Figure 8": {
    "setup": [
      {"c": "core_standing.figure8.setup", "s": [
        ["ace-382", "opis, start („Stand with both feet on the floor wider than shoulder-width apart, grip a kettlebell with the left hand…” + zejście w przysiad)"],
        ["gymreapers-kb-figure-8", "How-To („Bend your knees and hinge at your hips to create space for the kettlebell…”)"]
      ]}
    ],
    "move": [
      {"c": "core_standing.figure8.move", "s": [
        ["ace-382", "opis („Complete the figure-8 by passing the kettlebell from the left hand to the right under the left leg.”)"],
        ["gymreapers-kb-figure-8", "How-To (przełożenie kettlebella między nogami za nogą do drugiej ręki)"],
        ["breakingmuscle-kb-figure-8-hold", "„Kettlebell Figure Eight to a Hold” (wariant: z rozmachem; „You will pass the KB from the right hand to the left hand at this point.”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.figure8.mis.hunch", "s": [
        ["gymreapers-kb-figure-8", "Common Mistakes, „Rounding the back”"],
        ["breakingmuscle-kb-figure-8-hold", "warunek wstępny („without bowing over and looking as you pass the KB”; wariant: z rozmachem)"]
      ]}
    ]
  }
}
```

Uwaga do wdrożenia: w `lib/figures/v2/cue-sets.json` „Double Kettlebell Windmill” ma dziś `err: ["mis.jerk"]`, a „Kettlebell Figure 8” — `open`.
Własny wpis zastępuje zestaw ogólny; `mis.jerk` nie trafia do karty windmilla (pkt 5).

## 3. Nowe zdania

| id | PL | EN |
|---|---|---|
| core_standing.windmill.setup | Weź kettlebell do każdej ręki: jeden wypchnij nad głowę na prostej ręce, drugi trzymaj w dole. | Hold a kettlebell in each hand: press one overhead on a straight arm and let the other hang down. |
| core_standing.windmill.move | Cofnij biodro po stronie górnej ręki i przenieś na nie ciężar, a dolną rękę prowadź w dół po wewnętrznej stronie nogi. | Push the hip on the top-arm side back and shift your weight onto it, sliding the bottom hand down the inside of your leg. |
| core_standing.windmill.up | Wróć do stania tą samą drogą. | Return to standing the same way you came down. |
| core_standing.windmill.mis.elbow | Uginanie łokcia górnej ręki. | Bending the top elbow. |
| core_standing.figure8.setup | Stań w szerokim rozkroku, ugnij kolana i zejdź w przysiad, kettlebell w jednej ręce. | Take a wide stance, bend your knees and sit into a squat with the kettlebell in one hand. |
| core_standing.figure8.move | Przekładaj kettlebell pod nogą z ręki do ręki, zataczając ósemkę wokół nóg. | Pass the kettlebell under your leg from hand to hand, tracing a figure 8 around your legs. |
| core_standing.figure8.mis.hunch | Garbienie się nad kettlebellem przy podawaniu. | Hunching over the kettlebell as you pass it. |

Uwagi:
- Zdania `core_standing.windmill.*` pasują też do „Kettlebell Windmill” (jeden kettlebell) z wyjątkiem `setup`. Badacz robiący „Kettlebell Windmill”
  może mieć własne zdania o tym samym sensie — koordynator przy scalaniu powinien ujednolicić (jedno id dla `move`, `up`, `mis.elbow`).
- Rozstaw stóp w windmillu celowo pominięty: ACE #386 „wider than shoulder-width”, Experience Life „no wider than shoulder width” — sprzeczność
  na tym samym szczeblu, część wspólna niepraktyczna (okolice szerokości barków) → [OTWARTE].
- Figure 8 — głębokość: ACE uda równolegle do podłogi, Gymreapers „half-squat”; zdanie mówi tylko „zejdź w przysiad” (część wspólna).
  Rozstaw: ACE szerzej niż barki, Gymreapers nieco szerzej niż biodra → „szeroki rozkrok” (część wspólna).

## 4. Nowe źródła

| id | adres | organizacja | szczebel |
|---|---|---|---|
| ace-386 | https://acefitness.org/resources/everyone/exercise-library/386/high-windmill | ACE — „High Windmill (#386)” | 4 |
| ace-382 | https://www.acefitness.org/resources/everyone/exercise-library/382/figure-eight/ | ACE — „Figure Eight (#382)” | 4 |
| lifetime-el-kb-windmill | https://experiencelife.lifetime.life/article/the-kettlebell-windmill/ | Life Time — magazyn „Experience Life” (M. Fazeli Fard, 24.04.2020) | 4 (PROPOZYCJA: wydawnictwo sieci klubów z trenerami; nowa organizacja — do akceptacji audytora) |
| gymreapers-kb-figure-8 | https://uk.gymreapers.com/blogs/news/kettlebell-figure-8 | Gymreapers — blog producenta sprzętu treningowego (R. Pilon, 11.08.2023) | 4 (PROPOZYCJA: producent akcesoriów; nowa organizacja) |
| breakingmuscle-kb-figure-8-hold | https://breakingmuscle.com/?p=60011 | Breaking Muscle — „2 Kettlebell Exercises to Create Incredible Trunk Power” (W. J. Dorey, akt. 22.11.2021) | 4 (organizacja już w rejestrze) |
| prehab-seated-thoracic-rotation-dowel | https://theprehabguys.com/vimeo-video/seated-thoracic-rotation-dowel-2/ | The Prehab Guys — „Seated Thoracic Rotation – Dowel” | 4 (organizacja już w rejestrze; użyte tylko w „otwarte”) |

## 5. Otwarte

- **Double Kettlebell Windmill — `mis.jerk` (zestaw ogólny):** żadne z przeczytanych źródeł (ACE #386, Experience Life) nie wymienia szarpania
  jako błędu; Experience Life wymienia inne błędy (za szeroki rozkrok, skłon w bok zamiast zawiasu, zgięty łokieć, wymuszanie rozciągania,
  przeniesienie ciężaru w przód, za duży ciężar). Możliwy błąd zestawu ogólnego — w karcie pominięte.
- **Double Kettlebell Windmill — dalsze zdania:** „patrz/ruch nie jest skłonem w bok” i „schodź tylko tak nisko, jak pozwala ruchomość” —
  tylko Experience Life (jedno źródło). Stopy obrócone ok. 45° — jedno źródło (liczba — pełne zasady). Rozstaw stóp — sprzeczność (pkt 3).
- **Kettlebell Figure 8 — tips:** „plecy proste, klatka uniesiona” tylko Gymreapers; ACE i Breaking Muscle nie mówią o plecach wprost → bez wskazówki.
- **Seated Barbell Twist:** przeczytane jedno źródło szczebla 4 — The Prehab Guys (wariant: drążek gimnastyczny, ćwiczenie mobilności;
  „rotate only your upper and mid back back and forth to each side”, „Do this in a slow and controlled motion”). Druga strona serwisu
  specjalistycznego — 403; pozostałe wyniki to strony aplikacji/agregatory. Zestaw ogólny (`rt.control`, `rt.back`) ma więc tylko jedno źródło
  (Prehab Guys: powoli i kontrolowanie; „Stay seated up straight, don’t slouch”) — możliwy niedostatek zestawu ogólnego; `mis.jerk` niepotwierdzony.
  Dodatkowo położenie sztangi (na barkach za szyją vs. pod szyją) różni się między opisami — nie zgadujemy.
- **One-Arm High-Pulley Cable Side Bends:** wyniki wyszukiwania tylko ze stron aplikacji i agregatorów; ACE/NASM — brak strony.
  Kierunek skłonu (od wyciągu) odwrotny niż przy wyciągu dolnym, więc źródła „cable side bend” z dolnym wyciągiem nie są czystym wariantem.
  Zestaw ogólny (`sb.plane`, `dyn.control`, `mis.jerk`) — bez przeczytanego źródła dla tego ćwiczenia.
- **Weighted Ball Side Bend:** opis w katalogu źródłowym (free-exercise-db, tylko do rozpoznania ruchu, nie źródło): leżenie bokiem na piłce
  gimnastycznej, talerz przy głowie, skłon tułowia w bok. Zestaw ogólny `sideBend` (skłon stojąc) i figura stojąca — **prawdopodobnie błędne
  przypisanie** (do sprawdzenia przez koordynatora/recenzję figur). Źródła: strona uczelni (James Madison University, PDF „Stability ball core
  routine”) — 503; serwis jednoautorski — szczebel niepewny. Brak 2 źródeł.
- **Cable Judo Flip, Spell Caster, Bosu Ball Cable Crunch With Side Bends:** tylko strony aplikacji i agregatory; opisy wzajemnie sprzeczne
  (Spell Caster: zamach w poprzek ciała vs. skłon w bok vs. zawias; Bosu: klęk / siad / stanie). Zestawy ogólne `rotation` dla Judo Flip
  (`rt.control`, `plank.brace`, `mis.jerk`) — bez przeczytanego źródła. Do ponownej próby: biblioteki producentów wyciągów i ACE/NASM pod innymi nazwami.

## Stan

- Zrobione: 2 z 8 gotowe (Double Kettlebell Windmill — 6 zdań, Kettlebell Figure 8 — 3 zdania); 7 nowych zdań; 6 nowych źródeł (5 użytych w gotowych).
- Otwarte: 6 kluczy (pkt 5), w tym 1 podejrzenie błędnego przypisania figury/zestawu (Weighted Ball Side Bend) i 1 niepotwierdzony `mis.jerk` (windmill).
- Następny krok: (1) koordynator — ujednolicić zdania windmilla z badaczem „Kettlebell Windmill”; (2) audytor — szczebel Life Time „Experience Life”
  i Gymreapers; (3) ponowna próba dla otwartych: PDF JMU (503), strony producentów wyciągów, nazwy alternatywne w ACE/NASM.
