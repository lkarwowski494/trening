# Wskazówki techniki — fala W1, core_standing (część 2)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tryb: tylko zbieranie danych (polecenie właściciela 02.11.2026) — nic nie jest w `data/` ani `lib/`.
Metoda: `docs/research/33-wskazowki-partia2.md` („Metoda”) i `docs/research/27-wskazowki-zrodla.md`; wyjątek dla wskazówek techniki z CLAUDE.md
(2 zgodne, przeczytane źródła szczebla 4 z różnych organizacji na każde zdanie). Strony innych aplikacji treningowych nie są źródłem (uzupełnienie
briefu koordynatora) — pominięte i nienazwane. ExRx — 403, archiwum — zablokowane (nie próbowano ponownie).
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — sekcja 6; uzupełnienie 2 — sekcja 7; **uzupełnienie 3 — sekcja 8**
(Life Time „Experience Life” = 4 dla strony windmilla: autorka-trenerka + data).

## 1. Tabela

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Double Kettlebell Windmill | gotowe (po uzupełnieniu 3: 6 zdań, było 2) | 6 | ACE #386 + Catalyst #522 (wariant z jednym kettlebellem) + Life Time „Experience Life” (szczebel 4 od uzupełnienia 3; opisuje też wariant z dwoma kettlebellami). `setup` — drugi kettlebell wprost tylko Life Time (pkt 5). `mis.jerk` z zestawu ogólnego NIE potwierdzony. |
| Kettlebell Figure 8 | otwarte (po korekcie; było gotowe, 3 zdania) | 0 | każde zdanie ma tylko ACE #382; Gymreapers i Breaking Muscle — szczebel 5 (korekta) |
| Seated Barbell Twist | otwarte | 0 | jedno przeczytane źródło (The Prehab Guys, wariant z drążkiem); pozostałe niedostępne (403) albo strony aplikacji |
| One-Arm High-Pulley Cable Side Bends | otwarte | 0 | brak źródeł szczebla 4 — tylko strony aplikacji i agregatory |
| Weighted Ball Side Bend | otwarte | 0 | brak 2 źródeł; ćwiczenie wykonuje się LEŻĄC bokiem na piłce — zestaw ogólny `sideBend` (stojąc) prawdopodobnie błędny (pkt 5) |
| Cable Judo Flip | otwarte | 0 | tylko strony aplikacji i agregatory |
| Bosu Ball Cable Crunch With Side Bends | otwarte | 0 | tylko strony aplikacji/agregatory; opisy sprzeczne (klęk / siad / stanie na Bosu) |
| Spell Caster | otwarte | 0 | tylko strony aplikacji/agregatory; opisy sprzeczne co do samego ruchu |

## 2. Blok do `exercises` (tylko gotowe, po uzupełnieniu 3 z 02.11.2026)

```json
{
  "Double Kettlebell Windmill": {
    "setup": [
      {"c": "core_standing.windmill.setup", "s": [
        ["lifetime-el-kb-windmill", "Step 1 („press a single kettlebell overhead”) i wariant „Double-Loaded Kettlebell Windmill” (kettlebelle „in both the top and bottom hands”)"],
        ["ace-386", "opis, start (wariant: jeden kettlebell; kettlebell nad głową na prostej ręce) — nie opisuje drugiego kettlebella"]
      ]}
    ],
    "move": [
      {"c": "core_standing.windmill.move", "s": [
        ["ace-386", "opis (wariant: jeden kettlebell; „sink back into the left hip”, wolna ręka w dół wzdłuż wewnętrznej strony nogi)"],
        ["catalyst-522", "opis (wariant: jeden ciężar; „push the hips back and toward the side holding the weight”; wolna dłoń w dół po wewnętrznej stronie przeciwnej stopy) — źródło przeczytane w core_standing-1.md"],
        ["lifetime-el-kb-windmill", "Step 4 (dolna ręka „trace the inside of your leg”; wariant: jeden kettlebell)"]
      ]},
      {"c": "core_standing.windmill.up", "s": [
        ["ace-386", "opis, powrót (wariant: jeden kettlebell; wypchnięcie bioder w przód do pozycji stojącej)"],
        ["lifetime-el-kb-windmill", "Step 4 („then reverse the motion to come to standing”)"]
      ]}
    ],
    "tips": [
      {"c": "wm.arm", "s": [
        ["ace-386", "opis, start (wariant: jeden kettlebell; ręka z kettlebellem prosta nad głową)"],
        ["catalyst-522", "opis (wariant: jeden ciężar; „rotating the trunk to keep the loaded arm straight up”) — źródło przeczytane w core_standing-1.md"]
      ]},
      {"c": "wm.eyes", "s": [
        ["ace-386", "opis (wariant: jeden kettlebell; „look up at the left hand”)"],
        ["lifetime-el-kb-windmill", "Step 3 („Keep your eyes on the kettlebell.”)"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.windmill.mis.elbow", "s": [
        ["lifetime-el-kb-windmill", "lista błędów we wstępie („Bending the elbow of your top arm.”)"],
        ["ace-386", "opis, start (wariant: jeden kettlebell; górna ręka prosto — standard; błąd = zaprzeczenie standardu)"]
      ]}
    ]
  }
}
```

Uwaga do wdrożenia: w `lib/figures/v2/cue-sets.json` „Double Kettlebell Windmill” ma dziś `err: ["mis.jerk"]`, a „Kettlebell Figure 8” — `open`.
Własny wpis zastępuje zestaw ogólny; `mis.jerk` nie trafia do karty windmilla (pkt 5). `core_standing.windmill.setup` w tej karcie: element „drugi kettlebell
w dole” ma wprost tylko Life Time; ACE #386 potwierdza resztę zdania jako wariant z jednym kettlebellem — tak samo jak przed korektą z sekcji 6; do potwierdzenia przez koordynatora (pkt 5).

### Kandydaci wstrzymani przy korekcie (NIE do `exercises`; zachowane, żeby nie tracić wyników)

```json
{
  "Kettlebell Figure 8": {
    "setup": [
      {"c": "core_standing.figure8.setup", "s": [
        ["ace-382", "opis, start („Stand with both feet on the floor wider than shoulder-width apart, grip a kettlebell with the left hand…” + zejście w przysiad)"],
        ["gymreapers-kb-figure-8", "How-To („Bend your knees and hinge at your hips to create space for the kettlebell…”) — szczebel 5 po korekcie"]
      ]}
    ],
    "move": [
      {"c": "core_standing.figure8.move", "s": [
        ["ace-382", "opis („Complete the figure-8 by passing the kettlebell from the left hand to the right under the left leg.”)"],
        ["gymreapers-kb-figure-8", "How-To (przełożenie kettlebella między nogami za nogą do drugiej ręki) — szczebel 5 po korekcie"],
        ["breakingmuscle-kb-figure-8-hold", "„Kettlebell Figure Eight to a Hold” (wariant: z rozmachem) — szczebel 5"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.figure8.mis.hunch", "s": [
        ["gymreapers-kb-figure-8", "Common Mistakes, „Rounding the back” — szczebel 5 po korekcie"],
        ["breakingmuscle-kb-figure-8-hold", "warunek wstępny („without bowing over and looking as you pass the KB”; wariant: z rozmachem) — szczebel 5"]
      ]}
    ]
  }
}
```

## 3. Nowe zdania

| id | PL | EN | stan po uzupełnieniu 3 |
|---|---|---|---|
| core_standing.windmill.setup | Weź kettlebell do każdej ręki: jeden wypchnij nad głowę na prostej ręce, drugi trzymaj w dole. | Hold a kettlebell in each hand: press one overhead on a straight arm and let the other hang down. | gotowe (Life Time + ACE wariant; drugi kettlebell — tylko Life Time, pkt 5) |
| core_standing.windmill.move | Cofnij biodro po stronie górnej ręki i przenieś na nie ciężar, a dolną rękę prowadź w dół po wewnętrznej stronie nogi. | Push the hip on the top-arm side back and shift your weight onto it, sliding the bottom hand down the inside of your leg. | gotowe (ACE + Catalyst + Life Time) |
| core_standing.windmill.up | Wróć do stania tą samą drogą. | Return to standing the same way you came down. | gotowe (ACE + Life Time) |
| core_standing.windmill.mis.elbow | Uginanie łokcia górnej ręki. | Bending the top elbow. | gotowe (Life Time wprost + ACE standard) |
| core_standing.figure8.setup | Stań w szerokim rozkroku, ugnij kolana i zejdź w przysiad, kettlebell w jednej ręce. | Take a wide stance, bend your knees and sit into a squat with the kettlebell in one hand. | otwarte (tylko ACE) |
| core_standing.figure8.move | Przekładaj kettlebell pod nogą z ręki do ręki, zataczając ósemkę wokół nóg. | Pass the kettlebell under your leg from hand to hand, tracing a figure 8 around your legs. | otwarte (tylko ACE) |
| core_standing.figure8.mis.hunch | Garbienie się nad kettlebellem przy podawaniu. | Hunching over the kettlebell as you pass it. | otwarte (brak źródła szczebla 4) |

Uwagi:
- Zdania `core_standing.windmill.*` pasują też do „Kettlebell Windmill” (jeden kettlebell) z wyjątkiem `setup`. `core_standing-1.md` ma własne zdania o tym samym sensie
  (tam `windmill.setup` w nowym brzmieniu dla jednego kettlebella, `windmill.mis.elbow` „…ręki z ciężarem”) — koordynator przy scalaniu powinien ujednolicić
  (jedno id dla `move`, `up`, `mis.elbow`; dwa różne id dla `setup` jednego i dwóch kettlebelli).
- Rozstaw stóp w windmillu celowo pominięty: ACE #386 „wider than shoulder-width”, Experience Life „no wider than shoulder width” — od uzupełnienia 3
  sprzeczność na tym samym szczeblu 4 bez części wspólnej → [OTWARTE].
- Figure 8 — głębokość: ACE uda równolegle do podłogi, Gymreapers „half-squat”; rozstaw: ACE szerzej niż barki, Gymreapers nieco szerzej niż biodra.
  Po korekcie Gymreapers szczebel 5 — część wspólna nie ma już dwóch źródeł szczebla 4.

## 4. Nowe źródła

| id | adres | organizacja | szczebel (po korekcie 02.11.2026 i uzupełnieniach 2–3) |
|---|---|---|---|
| ace-386 | https://acefitness.org/resources/everyone/exercise-library/386/high-windmill | ACE — „High Windmill (#386)” | 4 |
| ace-382 | https://www.acefitness.org/resources/everyone/exercise-library/382/figure-eight/ | ACE — „Figure Eight (#382)” | 4 |
| lifetime-el-kb-windmill | https://experiencelife.lifetime.life/article/the-kettlebell-windmill/ | Life Time — magazyn „Experience Life” (M. Fazeli Fard, 24.04.2020) | **4** (uzupełnienie 3; wcześniej 5, przedtem 4 PROPOZYCJA) — biogram „…senior editor and Alpha Strong coach at Life Time.”, data 24.04.2020; WebFetch 02.11.2026 |
| gymreapers-kb-figure-8 | https://uk.gymreapers.com/blogs/news/kettlebell-figure-8 | Gymreapers — blog producenta akcesoriów (R. Pilon, 11.08.2023) | **5** (było: 4 PROPOZYCJA) — powód w sekcji 6 |
| breakingmuscle-kb-figure-8-hold | https://breakingmuscle.com/?p=60011 | Breaking Muscle — „2 Kettlebell Exercises to Create Incredible Trunk Power” (W. J. Dorey, akt. 22.11.2021) | **5** (było: 4) — rozstrzygnięcie koordynatora |
| prehab-seated-thoracic-rotation-dowel | https://theprehabguys.com/vimeo-video/seated-thoracic-rotation-dowel-2/ | The Prehab Guys — „Seated Thoracic Rotation – Dowel” | uzupełnienie 2: warunkowo 4 tylko przy autorze z kwalifikacjami — biogramu nie sprawdzano (strona wideo, bez wpływu na stan: jedyne przeczytane źródło) |
| catalyst-522 (nie nowe — z `core_standing-1.md`) | https://catalystathletics.com/exercise/522/Windmill | Catalyst Athletics | 4 (rozstrzygnięcie koordynatora) |

## 5. Otwarte

- **Double Kettlebell Windmill — `setup`:** drugi kettlebell w dolnej ręce opisuje wprost tylko Experience Life (wariant „Double-Loaded”); ACE #386 i Catalyst #522 —
  tylko jeden ciężar. Zdanie oparte na Life Time + ACE (wariant) — jak przed korektą z sekcji 6. Do decyzji koordynatora, czy element „drugi w dole” wymaga drugiego
  źródła szczebla 4 wprost (wtedy `setup` wstrzymane, karta 5 zdań). Szukać: ISSA, NFPT z autorem i datą, BarBend o technice, producent kettlebelli z biblioteką ćwiczeń.
- **Life Time — strona windmilla:** biogram podaje rolę „Alpha Strong coach at Life Time” bez certyfikatu na tej stronie (certyfikat RKC autorki — na stronie wood chop, 2024;
  `core_standing-1.md`, sekcja 9). Jeśli koordynator uzna to za niewystarczające, karta wraca do 2 zdań (`move`, `wm.arm`).
- **Double Kettlebell Windmill — `mis.jerk` (zestaw ogólny):** żadne z przeczytanych źródeł (ACE #386, Experience Life) nie wymienia szarpania
  jako błędu. Możliwy błąd zestawu ogólnego — w karcie pominięte.
- **Double Kettlebell Windmill — dalsze zdania:** „ruch nie jest skłonem w bok” i „schodź tylko tak nisko, jak pozwala ruchomość” —
  tylko Experience Life (od uzupełnienia 3 jedno źródło szczebla 4). Stopy obrócone ok. 45° — jedno źródło (liczba — pełne zasady). Rozstaw stóp — sprzeczność (pkt 3).
- **Kettlebell Figure 8 (po korekcie całe ćwiczenie):** każde zdanie ma tylko ACE #382; Gymreapers (artykuł poleca kettlebelle Gymreapers) i Breaking Muscle — szczebel 5.
  `figure8.mis.hunch` — ACE #382 nie podaje standardu postawy pleców, więc reguła błędu nie ma zastosowania.
  Do zamknięcia: drugie źródło szczebla 4 (ISSA, NFPT z autorem i datą, BarBend o technice, Catalyst, producent kettlebelli z własną biblioteką ćwiczeń).
- **Seated Barbell Twist:** przeczytane jedno źródło — The Prehab Guys (wariant: drążek gimnastyczny, ćwiczenie mobilności;
  „rotate only your upper and mid back back and forth to each side”, „Do this in a slow and controlled motion”). Druga strona serwisu
  specjalistycznego — 403; pozostałe wyniki to strony aplikacji/agregatory. Zestaw ogólny (`rt.control`, `rt.back`) ma więc tylko jedno źródło;
  `mis.jerk` niepotwierdzony. Położenie sztangi (na barkach za szyją vs. pod szyją) różni się między opisami — nie zgadujemy.
- **One-Arm High-Pulley Cable Side Bends:** wyniki wyszukiwania tylko ze stron aplikacji i agregatorów; ACE/NASM — brak strony.
  Kierunek skłonu (od wyciągu) odwrotny niż przy wyciągu dolnym, więc źródła „cable side bend” z dolnym wyciągiem nie są czystym wariantem.
  Zestaw ogólny (`sb.plane`, `dyn.control`, `mis.jerk`) — bez przeczytanego źródła dla tego ćwiczenia.
- **Weighted Ball Side Bend:** opis w katalogu źródłowym (free-exercise-db, szczebel 5 — tylko do rozpoznania ruchu, nie źródło): leżenie bokiem na piłce
  gimnastycznej, talerz przy głowie, skłon tułowia w bok. Zestaw ogólny `sideBend` (skłon stojąc) i figura stojąca — **prawdopodobnie błędne
  przypisanie** (do sprawdzenia przez koordynatora/recenzję figur). Źródła: strona uczelni (James Madison University, PDF „Stability ball core
  routine”) — 503 (uzupełnienie 2: uczelnia bez autora → 5, z autorem z kwalifikacjami warunkowo 4); serwis jednoautorski — szczebel niepewny. Brak 2 źródeł.
- **Cable Judo Flip, Spell Caster, Bosu Ball Cable Crunch With Side Bends:** tylko strony aplikacji i agregatory; opisy wzajemnie sprzeczne
  (Spell Caster: zamach w poprzek ciała vs. skłon w bok vs. zawias; Bosu: klęk / siad / stanie). Zestawy ogólne `rotation` dla Judo Flip
  (`rt.control`, `plank.brace`, `mis.jerk`) — bez przeczytanego źródła. Do ponownej próby: biblioteki producentów wyciągów i ACE/NASM pod innymi nazwami.

## 6. Korekta szczebli 02.11.2026 (dla Life Time ZASTĄPIONA uzupełnieniem 3, sekcja 8)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 (02.11.2026) — szczebel 4 wymaga naraz (a) organizacji szkolącej/certyfikującej trenerów,
serwisu z redakcją i recenzją ekspercką albo producenta własnego rodzaju sprzętu, (b) autora z datą albo treści jawnie firmowanej przez organizację,
(c) braku marketingu i linków afiliacyjnych.

| źródło | przed | po | powód |
|---|---|---|---|
| lifetime-el-kb-windmill (Life Time „Experience Life”) | 4 PROPOZYCJA | 5 | (a) niespełnione: wydawca to sieć klubów; strona nie podaje recenzji eksperckiej; autorka — redaktorka magazynu i trenerka Life Time (24.04.2020), więc (b) spełnione. Strona ma reklamy i odnośniki do sklepu. |
| gymreapers-kb-figure-8 | 4 PROPOZYCJA | 5 | (c) niespełnione: sekcja „Best Kettlebells For Figure 8s” poleca kettlebelle Gymreapers (marketing własnego produktu w artykule); autor bez podanych kwalifikacji; brak recenzji. |
| breakingmuscle-kb-figure-8-hold | 4 | 5 | rozstrzygnięcie koordynatora (Breaking Muscle — 5, nigdy niezależne od BarBend). |
| catalyst-522 | — | 4 | rozstrzygnięcie koordynatora; źródło przeczytane w `core_standing-1.md`, użyte zamiast Life Time. |

| ćwiczenie | przed | po | zdania gotowe przed → po |
|---|---|---|---|
| Double Kettlebell Windmill | gotowe | gotowe (z uwagą: tylko wariant z jednym kettlebellem) | 6 → 2 (`windmill.move`, `wm.arm` — ACE + Catalyst) |
| Kettlebell Figure 8 | gotowe | otwarte | 3 → 0 |
| pozostałe 6 | otwarte | otwarte | 0 → 0 |

## 7. Korekta szczebli — uzupełnienie 2 (02.11.2026): bez zmian stanu

The Prehab Guys (Seated Barbell Twist) — warunkowo 4 tylko z autorem z kwalifikacjami; to jedyne przeczytane źródło, więc ćwiczenie zostaje otwarte niezależnie od biogramu. JMU (Weighted Ball Side Bend) — niedostępne (503), uczelnia. Gotowe: 1 → 1 (2 zdania).

## 8. Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: uzupełnienie 3 rozstrzygnięcia koordynatora linii 1.1 (02.11.2026) — Experience Life (Life Time) warunkowo 4, tylko strona z autorem z kwalifikacjami
trenerskimi i datą; sama deklaracja recenzji w polityce serwisu nie wystarcza. Strona przeczytana ponownie (WebFetch 02.11.2026): biogram „Maggie Fazeli Fard is an
Experience Life senior editor and Alpha Strong coach at Life Time.”, data 24.04.2020, recenzenta brak; treść: Step 1–4, lista błędów we wstępie, wariant „Double-Loaded”.

| źródło | przed | po | powód |
|---|---|---|---|
| lifetime-el-kb-windmill | 5 | **4** (do potwierdzenia — rola trenerki bez certyfikatu na tej stronie) | autorka-trenerka z datą |
| gymreapers, Breaking Muscle, The Prehab Guys, ACE, Catalyst | bez zmian | bez zmian | nie należą do kategorii z uzupełnienia 3 |

| ćwiczenie / zdanie | przed | po | powód |
|---|---|---|---|
| Double Kettlebell Windmill | gotowe, 2 zdania | gotowe, **6** zdań | — |
| `core_standing.windmill.setup` | wstrzymane | **gotowe** (Life Time + ACE wariant; pkt 5) | przywrócone |
| `core_standing.windmill.up` | otwarte (tylko ACE) | **gotowe** (ACE + Life Time) | przywrócone |
| `wm.eyes` | wstrzymane | **gotowe** (ACE + Life Time) | przywrócone |
| `core_standing.windmill.mis.elbow` | wstrzymane | **gotowe** (Life Time wprost + ACE standard) | przywrócone wg reguły błędu |
| `core_standing.windmill.move` | ACE + Catalyst | + Life Time | dodatkowe źródło |
| Kettlebell Figure 8 i pozostałe 6 | otwarte | otwarte | Life Time ich nie dotyczy |

Skutek: gotowe 1 → 1 ćwiczenie; zdań 2 → 6.

## Stan

- Przed korektą: 2 z 8 gotowe (Double Kettlebell Windmill — 6 zdań, Kettlebell Figure 8 — 3 zdania).
- Po korekcie 02.11.2026: 1 z 8 gotowe (Double Kettlebell Windmill — 2 zdania); Kettlebell Figure 8 → otwarte.
- Po uzupełnieniu 2 (02.11.2026): bez zmian — 1 z 8 gotowe (sekcja 7).
- **Po uzupełnieniu 3 (02.11.2026): 1 z 8 gotowe — Double Kettlebell Windmill, 6 zdań** (sekcja 8).
- Otwarte: 7 kluczy (pkt 5), w tym 1 podejrzenie błędnego przypisania figury/zestawu (Weighted Ball Side Bend) i 1 niepotwierdzony `mis.jerk` (windmill).
- Do decyzji koordynatora: strona windmilla Life Time (rola „coach” zamiast certyfikatu na stronie); element „drugi kettlebell w dole” w `setup` (tylko Life Time wprost); ujednolicenie id z `core_standing-1.md`.
- Następny krok: drugie źródło szczebla 4 dla Figure 8 i windmilla z dwoma kettlebellami (ISSA, NFPT z autorem, BarBend o technice); ponowna próba dla otwartych: PDF JMU (503), strony producentów wyciągów, nazwy alternatywne w ACE/NASM.

### Uzupełnienie 3 dla pozostałych plików grupy (02.11.2026) — bez zmian stanu, plików nie przepisywano (oszczędność kontekstu, tylko narzędzie Write)

- `core_floor-1.md` — Barbell Logic „Lying Leg Raise: Gym Shorts” (https://barbell-logic.com/?p=87094, WebFetch 02.11.2026): bez autora, bez daty, bez recenzenta → 5 (tak już było); Lying Leg Raise otwarte, bez zmian.
- `core_floor-2.md` — instrukcja Bowflex 2 z manualslib: nie wspiera żadnego gotowego zdania (Cable Seated Crunch otwarte; dla wyciągu i tak się nie liczy); zgodności numeru/wersji z oryginałem producenta nie sprawdzano, bo nie zmienia stanu.
- `core_hang.md` — źródła (Catalyst, NASM, CrossFit, FIG) nie należą do kategorii z uzupełnienia 3 → bez zmian.
- `back_extension.md` — zmiana stanu zapisana w tym pliku (Barbell Logic → 5).
