# Wskazówki techniki — fala W1, core_standing (część 2)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Tryb: tylko zbieranie danych (polecenie właściciela 02.11.2026) — nic nie jest w `data/` ani `lib/`.
Metoda: `docs/research/33-wskazowki-partia2.md` („Metoda”) i `docs/research/27-wskazowki-zrodla.md`; wyjątek dla wskazówek techniki z CLAUDE.md
(2 zgodne, przeczytane źródła szczebla 4 z różnych organizacji na każde zdanie). Strony innych aplikacji treningowych nie są źródłem (uzupełnienie
briefu koordynatora) — pominięte i nienazwane. ExRx — 403, archiwum — zablokowane (nie próbowano ponownie).
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — sekcja „Korekta szczebli 02.11.2026” na końcu.

## 1. Tabela

| klucz | stan | liczba zdań | uwagi |
|---|---|---|---|
| Double Kettlebell Windmill | gotowe (po korekcie: 2 zdania, było 6) | 2 | ACE #386 + Catalyst Athletics #522 (oba: wariant z jednym kettlebellem). Life Time „Experience Life” po korekcie szczebel 5 — `setup`, `up`, `wm.eyes`, `mis.elbow` otwarte. Brak zdania o drugim kettlebellu (pkt 5). `mis.jerk` z zestawu ogólnego NIE potwierdzony. |
| Kettlebell Figure 8 | otwarte (po korekcie; było gotowe, 3 zdania) | 0 | każde zdanie ma tylko ACE #382; Gymreapers i Breaking Muscle — szczebel 5 (korekta) |
| Seated Barbell Twist | otwarte | 0 | jedno przeczytane źródło (The Prehab Guys, wariant z drążkiem); pozostałe niedostępne (403) albo strony aplikacji |
| One-Arm High-Pulley Cable Side Bends | otwarte | 0 | brak źródeł szczebla 4 — tylko strony aplikacji i agregatory |
| Weighted Ball Side Bend | otwarte | 0 | brak 2 źródeł; ćwiczenie wykonuje się LEŻĄC bokiem na piłce — zestaw ogólny `sideBend` (stojąc) prawdopodobnie błędny (pkt 5) |
| Cable Judo Flip | otwarte | 0 | tylko strony aplikacji i agregatory |
| Bosu Ball Cable Crunch With Side Bends | otwarte | 0 | tylko strony aplikacji/agregatory; opisy sprzeczne (klęk / siad / stanie na Bosu) |
| Spell Caster | otwarte | 0 | tylko strony aplikacji/agregatory; opisy sprzeczne co do samego ruchu |

## 2. Blok do `exercises` (tylko gotowe, po korekcie 02.11.2026)

```json
{
  "Double Kettlebell Windmill": {
    "setup": [],
    "move": [
      {"c": "core_standing.windmill.move", "s": [
        ["ace-386", "opis (wariant: jeden kettlebell; „sink back into the left hip”, wolna ręka w dół wzdłuż wewnętrznej strony nogi)"],
        ["catalyst-522", "opis (wariant: jeden ciężar; „push the hips back and toward the side holding the weight”; wolna dłoń w dół po wewnętrznej stronie przeciwnej stopy) — źródło przeczytane w core_standing-1.md"]
      ]}
    ],
    "tips": [
      {"c": "wm.arm", "s": [
        ["ace-386", "opis, start (wariant: jeden kettlebell; ręka z kettlebellem prosta nad głową)"],
        ["catalyst-522", "opis (wariant: jeden ciężar; „rotating the trunk to keep the loaded arm straight up”) — źródło przeczytane w core_standing-1.md"]
      ]}
    ],
    "mistakes": []
  }
}
```

Uwaga do wdrożenia: w `lib/figures/v2/cue-sets.json` „Double Kettlebell Windmill” ma dziś `err: ["mis.jerk"]`, a „Kettlebell Figure 8” — `open`.
Własny wpis zastępuje zestaw ogólny; `mis.jerk` nie trafia do karty windmilla (pkt 5). Karta windmilla z dwoma kettlebellami po korekcie nie ma
zdania ustawienia — opiera się wyłącznie na wariancie z jednym kettlebellem (dozwolone: wariant liczy się z opisem); jeśli koordynator uzna, że karta
bez opisu drugiego kettlebella wprowadza w błąd, przenieść ćwiczenie do otwartych.

### Kandydaci wstrzymani przy korekcie (NIE do `exercises`; zachowane, żeby nie tracić wyników)

```json
{
  "Double Kettlebell Windmill": {
    "setup": [
      {"c": "core_standing.windmill.setup", "s": [
        ["lifetime-el-kb-windmill", "Step 1 („press a single kettlebell overhead”) i wariant „Double-Loaded Kettlebell Windmill” („holding kettlebells in both the top and bottom hands”) — szczebel 5 po korekcie"],
        ["ace-386", "opis, start (wariant: jeden kettlebell; kettlebell nad głową na prostej ręce) — nie opisuje drugiego kettlebella"]
      ]}
    ],
    "move": [
      {"c": "core_standing.windmill.up", "s": [
        ["ace-386", "opis, powrót (wariant: jeden kettlebell; wypchnięcie bioder w przód do pozycji stojącej)"],
        ["lifetime-el-kb-windmill", "Step 4 („then reverse the motion to come to standing”) — szczebel 5 po korekcie"]
      ]}
    ],
    "tips": [
      {"c": "wm.eyes", "s": [
        ["ace-386", "opis (wariant: jeden kettlebell; „look up at the left hand”)"],
        ["lifetime-el-kb-windmill", "Step 3 („Keep your eyes on the kettlebell.”) — szczebel 5 po korekcie"]
      ]}
    ],
    "mistakes": [
      {"c": "core_standing.windmill.mis.elbow", "s": [
        ["lifetime-el-kb-windmill", "Common mistakes, „Bending the top elbow” — szczebel 5 po korekcie"],
        ["ace-386", "opis, start (wariant: jeden kettlebell; polecenie trzymania górnej ręki prosto — odwrotność błędu)"]
      ]}
    ]
  },
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

`core_standing.windmill.mis.elbow` z ACE + Catalyst nie jest wpisany: oba źródła dają tylko polecenie „ręka prosto” (odwrotność błędu, nie błąd wprost),
a to samo pokrywa już `wm.arm`.

## 3. Nowe zdania

| id | PL | EN | stan po korekcie |
|---|---|---|---|
| core_standing.windmill.setup | Weź kettlebell do każdej ręki: jeden wypchnij nad głowę na prostej ręce, drugi trzymaj w dole. | Hold a kettlebell in each hand: press one overhead on a straight arm and let the other hang down. | otwarte (drugi kettlebell — tylko Life Time, szczebel 5) |
| core_standing.windmill.move | Cofnij biodro po stronie górnej ręki i przenieś na nie ciężar, a dolną rękę prowadź w dół po wewnętrznej stronie nogi. | Push the hip on the top-arm side back and shift your weight onto it, sliding the bottom hand down the inside of your leg. | gotowe (ACE + Catalyst) |
| core_standing.windmill.up | Wróć do stania tą samą drogą. | Return to standing the same way you came down. | otwarte (ACE; Catalyst — brak zapisu o powrocie) |
| core_standing.windmill.mis.elbow | Uginanie łokcia górnej ręki. | Bending the top elbow. | otwarte (błąd wprost tylko Life Time) |
| core_standing.figure8.setup | Stań w szerokim rozkroku, ugnij kolana i zejdź w przysiad, kettlebell w jednej ręce. | Take a wide stance, bend your knees and sit into a squat with the kettlebell in one hand. | otwarte (tylko ACE) |
| core_standing.figure8.move | Przekładaj kettlebell pod nogą z ręki do ręki, zataczając ósemkę wokół nóg. | Pass the kettlebell under your leg from hand to hand, tracing a figure 8 around your legs. | otwarte (tylko ACE) |
| core_standing.figure8.mis.hunch | Garbienie się nad kettlebellem przy podawaniu. | Hunching over the kettlebell as you pass it. | otwarte (brak źródła szczebla 4) |

Uwagi:
- Zdania `core_standing.windmill.*` pasują też do „Kettlebell Windmill” (jeden kettlebell) z wyjątkiem `setup`. Badacz robiący „Kettlebell Windmill”
  (`core_standing-1.md`) ma własne zdania o tym samym sensie — koordynator przy scalaniu powinien ujednolicić (jedno id dla `move`, `up`, `mis.elbow`).
- Rozstaw stóp w windmillu celowo pominięty: ACE #386 „wider than shoulder-width”, Experience Life „no wider than shoulder width” — sprzeczność
  (po korekcie Experience Life i tak szczebel 5) → [OTWARTE].
- Figure 8 — głębokość: ACE uda równolegle do podłogi, Gymreapers „half-squat”; rozstaw: ACE szerzej niż barki, Gymreapers nieco szerzej niż biodra.
  Po korekcie Gymreapers szczebel 5 — część wspólna nie ma już dwóch źródeł szczebla 4.

## 4. Nowe źródła

| id | adres | organizacja | szczebel (po korekcie 02.11.2026) |
|---|---|---|---|
| ace-386 | https://acefitness.org/resources/everyone/exercise-library/386/high-windmill | ACE — „High Windmill (#386)” | 4 |
| ace-382 | https://www.acefitness.org/resources/everyone/exercise-library/382/figure-eight/ | ACE — „Figure Eight (#382)” | 4 |
| lifetime-el-kb-windmill | https://experiencelife.lifetime.life/article/the-kettlebell-windmill/ | Life Time — magazyn „Experience Life” (M. Fazeli Fard, 24.04.2020) | **5** (było: 4 PROPOZYCJA) — powód w sekcji „Korekta” |
| gymreapers-kb-figure-8 | https://uk.gymreapers.com/blogs/news/kettlebell-figure-8 | Gymreapers — blog producenta akcesoriów (R. Pilon, 11.08.2023) | **5** (było: 4 PROPOZYCJA) — powód w sekcji „Korekta” |
| breakingmuscle-kb-figure-8-hold | https://breakingmuscle.com/?p=60011 | Breaking Muscle — „2 Kettlebell Exercises to Create Incredible Trunk Power” (W. J. Dorey, akt. 22.11.2021) | **5** (było: 4) — rozstrzygnięcie koordynatora |
| prehab-seated-thoracic-rotation-dowel | https://theprehabguys.com/vimeo-video/seated-thoracic-rotation-dowel-2/ | The Prehab Guys — „Seated Thoracic Rotation – Dowel” | 4 wg wcześniejszego wpisu (organizacja w rejestrze); nie oceniane ponownie — użyte tylko w „otwarte”, nie wpływa na stan |
| catalyst-522 (nie nowe — z `core_standing-1.md`) | https://catalystathletics.com/exercise/522/Windmill | Catalyst Athletics | 4 (rozstrzygnięcie koordynatora); użyte zamiast Life Time |

## 5. Otwarte

- **Double Kettlebell Windmill — po korekcie:** `setup` (drugi kettlebell w dole) — jedyne źródło wprost to Experience Life (szczebel 5);
  `windmill.up` i `wm.eyes` — ACE + Experience Life → po jednym źródle szczebla 4; `mis.elbow` wprost tylko Experience Life. Do zamknięcia: drugie
  źródło szczebla 4 opisujące windmill z dwoma kettlebellami (ISSA, NFPT z autorem i datą, BarBend o technice) albo Catalyst #522 przeczytany ponownie pod kątem powrotu i wzroku.
- **Double Kettlebell Windmill — `mis.jerk` (zestaw ogólny):** żadne z przeczytanych źródeł (ACE #386, Experience Life) nie wymienia szarpania
  jako błędu. Możliwy błąd zestawu ogólnego — w karcie pominięte.
- **Double Kettlebell Windmill — dalsze zdania:** „ruch nie jest skłonem w bok” i „schodź tylko tak nisko, jak pozwala ruchomość” —
  tylko Experience Life (szczebel 5). Stopy obrócone ok. 45° — jedno źródło (liczba — pełne zasady). Rozstaw stóp — sprzeczność (pkt 3).
- **Kettlebell Figure 8 (po korekcie całe ćwiczenie):** każde zdanie ma tylko ACE #382; Gymreapers (artykuł poleca kettlebelle Gymreapers) i Breaking Muscle — szczebel 5.
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
  routine”) — 503; serwis jednoautorski — szczebel niepewny. Brak 2 źródeł.
- **Cable Judo Flip, Spell Caster, Bosu Ball Cable Crunch With Side Bends:** tylko strony aplikacji i agregatory; opisy wzajemnie sprzeczne
  (Spell Caster: zamach w poprzek ciała vs. skłon w bok vs. zawias; Bosu: klęk / siad / stanie). Zestawy ogólne `rotation` dla Judo Flip
  (`rt.control`, `plank.brace`, `mis.jerk`) — bez przeczytanego źródła. Do ponownej próby: biblioteki producentów wyciągów i ACE/NASM pod innymi nazwami.

## 6. Korekta szczebli 02.11.2026

Podstawa: rozstrzygnięcie koordynatora linii 1.1 (02.11.2026) — szczebel 4 wymaga naraz (a) organizacji szkolącej/certyfikującej trenerów,
serwisu z redakcją i recenzją ekspercką albo producenta własnego rodzaju sprzętu, (b) autora z datą albo treści jawnie firmowanej przez organizację,
(c) braku marketingu i linków afiliacyjnych. Strony otwarte ponownie (WebFetch 02.11.2026) tam, gdzie trzeba było sprawdzić autora, datę i marketing.

| źródło | przed | po | powód |
|---|---|---|---|
| lifetime-el-kb-windmill (Life Time „Experience Life”) | 4 PROPOZYCJA | 5 | (a) niespełnione: wydawca to sieć klubów (jak PureGym — 5 wg koordynatora); strona nie podaje recenzji eksperckiej; autorka — redaktorka magazynu i trenerka Life Time (24.04.2020), więc (b) spełnione. Strona ma reklamy i odnośniki do sklepu. Do zmiany tylko decyzją koordynatora (też dla `core_standing-1.md`, gdzie ta sama organizacja jest „4 warunkowo”). |
| gymreapers-kb-figure-8 | 4 PROPOZYCJA | 5 | (c) niespełnione: sekcja „Best Kettlebells For Figure 8s” poleca kettlebelle Gymreapers (marketing własnego produktu w artykule); autor bez podanych kwalifikacji; brak recenzji. |
| breakingmuscle-kb-figure-8-hold | 4 | 5 | rozstrzygnięcie koordynatora (Breaking Muscle — 5, nigdy niezależne od BarBend). |
| catalyst-522 | — | 4 | rozstrzygnięcie koordynatora; źródło przeczytane w `core_standing-1.md`, użyte zamiast Life Time (wolno: już przeczytane w tej fali). |

| ćwiczenie | przed | po | zdania gotowe przed → po |
|---|---|---|---|
| Double Kettlebell Windmill | gotowe | gotowe (z uwagą: tylko wariant z jednym kettlebellem) | 6 → 2 (`windmill.move`, `wm.arm` — ACE + Catalyst) |
| Kettlebell Figure 8 | gotowe | otwarte | 3 → 0 |
| pozostałe 6 | otwarte | otwarte | 0 → 0 |

## Stan

- Przed korektą: 2 z 8 gotowe (Double Kettlebell Windmill — 6 zdań, Kettlebell Figure 8 — 3 zdania).
- Po korekcie 02.11.2026: **1 z 8 gotowe** (Double Kettlebell Windmill — 2 zdania, oba z wariantu z jednym kettlebellem); Kettlebell Figure 8 → otwarte.
  Wyniki nie usunięte — wstrzymani kandydaci w pkt 2 („Kandydaci wstrzymani przy korekcie”).
- Otwarte: 7 kluczy (pkt 5), w tym 1 podejrzenie błędnego przypisania figury/zestawu (Weighted Ball Side Bend) i 1 niepotwierdzony `mis.jerk` (windmill).
- Następny krok: (1) koordynator — decyzja, czy karta windmilla z dwoma kettlebellami bez zdania o drugim kettlebellu może być „gotowa”; ujednolicić zdania
  z `core_standing-1.md`; (2) drugie źródło szczebla 4 dla Figure 8 i windmilla z dwoma kettlebellami (ISSA, NFPT z autorem, BarBend o technice);
  (3) ponowna próba dla otwartych: PDF JMU (503), strony producentów wyciągów, nazwy alternatywne w ACE/NASM.
