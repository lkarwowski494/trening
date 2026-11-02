# Role mięśni — rodzina plyo (skoki i plyometria), grupa G3

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3; kontynuacja tego samego dnia — skoki w bok bez wyniku) · Tylko zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json` i testach.

Dane wejściowe: `docs/research/equipment/catalog.json` i `lib/catalog.generated.ts` (muscleLoad, pattern), `data/zrodla/role-miesni.json`
(format, istniejące funkcje i źródła S1–S28), `lib/muscleRoles.ts` (nameRules przed regułami, wariant zdania „_” — bez fazy),
`data/zrodla/figury-sens.json` (podział rodziny plyo na `_skok`, `_podskok`, `_obciazony`). Podświetlenie od udziału 0,5 (`MUSCLE_MIN_LOAD = 0.5`
w `lib/figures/v2/muscles.ts`), więc pary z udziałem 0,25 pominięto. W katalogu nie ma dziś żadnych nameRules dla ćwiczeń tej rodziny
(są tylko szrugsy i zginanie/prostowanie nadgarstka).

Szczeble źródeł według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): ACE i NASM (organizacje certyfikujące trenerów, treść firmowana) = 4;
wpisy tego pliku bez zmian.

## Wniosek

Wybicie w skoku w górę albo w przód (obunóż i jednonóż, także małe podskoki) to jednoczesny wyprost biodra i kolana oraz zgięcie
podeszwowe stopy (tzw. potrójny wyprost). Mówią to wprost dwie niezależne organizacje szkolące trenerów (szczebel 4: W1G3-S1 i W1G3-S2), a badanie
pracy stawów w skoku (szczebel 3: W1G3-S3) pokazuje pracę wykonywaną w stawie skokowym, kolanowym i biodrowym. Funkcje mięśni w tych ruchach
są już w danych i mają status ustalone albo dwa_zrodla (anatomia: S2, S11, S12, S15, S19). Wystarczą więc trzy jawne listy (nameRules), bez nowej funkcji
i bez reguły dla całego `other`.

Nie obejmuje to skoków w bok i po skosie (kierunek ruchu inny niż w przeczytanych źródłach, a do tego dochodzą odwodziciele i przywodziciele) ani
wyskoku z klęku — te zostają otwarte. Druga sesja (02.11.2026) nie znalazła źródła dla skoków w bok — szczegóły w „Otwarte”.

## Tabela luk

| Luka (pattern \| region \| rola) | Gotowe (ćwiczenia) | Otwarte (ćwiczenia, powód) |
|---|---|---|
| other \| quads \| main | 19: Box Jump, Jump Squat, Weighted Jump Squat, Tuck Jump, Star Jump, Bench Jump, Broad Jump, Depth Jump, Dumbbell Seated Box Jump, Frog Hops, Split Jump, Double Leg Butt Kick, Single-Leg Stride Jump, Alternate Leg Push-Off, Single Leg Push-Off, Box Skip, Front Cone Hops, Single-Leg Hop Progression, Single Leg Butt Kick → `quads.knee_ext` | 7 skoków w bok/po skosie: Side Standing Long Jump, Lateral Box Jump, Lateral Cone Hops, Single-Leg Lateral Hop, Side Hop-Sprint, Side to Side Box Shuffle, Alternate Leg Diagonal Bound — źródła opisują wybicie w górę/w przód; przeniesienie na kierunek boczny to analogia (= uproszczenie, nie wyświetlane). Wall Ball — gotowe w sled_throw.md; sanki — sled_throw.md |
| other \| quads \| aux | — | Kneeling Jump Squat, Lateral Bound (powody niżej) |
| other \| glutes \| main | Broad Jump, Dumbbell Seated Box Jump → `glutes.hip_ext` | Kneeling Jump Squat (brak przeczytanego opisu ruchu; figury-sens: „nie badane”), Lateral Bound (skok w bok) |
| other \| glutes \| aux | 16: Box Jump, Jump Squat, Weighted Jump Squat, Tuck Jump, Star Jump, Bench Jump, Depth Jump, Frog Hops, Split Jump, Double Leg Butt Kick, Single-Leg Stride Jump, Alternate Leg Push-Off, Single Leg Push-Off, Box Skip, Front Cone Hops, Single-Leg Hop Progression → `glutes.hip_ext` | Side Standing Long Jump, Lateral Box Jump, Lateral Cone Hops, Alternate Leg Diagonal Bound (kierunek); Turkish Get Up, sanki — sled_throw.md (Wall Ball tam gotowe) |
| other \| calves \| aux | 18: Box Jump, Jump Squat, Weighted Jump Squat, Tuck Jump, Star Jump, Bench Jump, Broad Jump, Depth Jump, Frog Hops, Split Jump, Double Leg Butt Kick, Single-Leg Stride Jump, Alternate Leg Push-Off, Single Leg Push-Off, Box Skip, Front Cone Hops, Single-Leg Hop Progression, Single Leg Butt Kick → `calves.plantar_flex` | 7 skoków w bok/po skosie (jak wyżej); sanki — sled_throw.md |
| other \| hamstrings \| aux | — | Single Leg Butt Kick, Double Leg Butt Kick, Box Skip (w katalogu też 0,5), Kneeling Jump Squat — patrz Otwarte |
| other \| abductors \| aux | — | Single-Leg Lateral Hop, Lateral Bound — brak przeczytanego źródła o odwodzicielach przy wybiciu w bok |
| other \| adductors \| aux | — | Lateral Bound — j.w. |

Razem dla plyo: 55 par gotowych (19 + 2 + 16 + 18), 26 par otwartych.

## Propozycja danych (format role-miesni.json)

Nowych funkcji nie ma — wszystkie trzy istnieją, ze statusem ustalone/dwa_zrodla. Zdania (wariant „_”, bez fazy):
quads main „Prostuje kolano.” | „Straightens your knee.”; glutes main „Prostuje biodro.” | „Straightens your hip.”; glutes aux „Pomaga prostować biodro.” |
„Helps straighten your hip.”; calves aux „Pomaga unosić piętę.” | „Helps lift your heel.”

Identyfikatory źródeł z przedrostkiem `W1G3-`, żeby nie zderzyły się z równoległymi falami — numer `S29+` nadaje koordynator przy scalaniu.

```json
{
  "nameRules": {
    "reguly": [
      {
        "muscle": "quads",
        "roles": ["main", "aux"],
        "function": "quads.knee_ext",
        "zrodla": ["W1G3-S1", "W1G3-S2", "W1G3-S3", "S2", "S12"],
        "uzasadnienie": "wybicie w skoku w górę/w przód = wyprost kolana (potrójny wyprost)",
        "exercises": [
          "Box Jump", "Jump Squat", "Weighted Jump Squat", "Tuck Jump", "Star Jump", "Bench Jump", "Broad Jump",
          "Depth Jump", "Dumbbell Seated Box Jump", "Frog Hops", "Split Jump", "Double Leg Butt Kick",
          "Single-Leg Stride Jump", "Alternate Leg Push-Off", "Single Leg Push-Off", "Box Skip", "Front Cone Hops",
          "Single-Leg Hop Progression", "Single Leg Butt Kick"
        ],
        "pominiete": {
          "Side Standing Long Jump": "skok w bok — analogia, otwarte",
          "Lateral Box Jump": "skok w bok — analogia, otwarte",
          "Lateral Cone Hops": "skok w bok — analogia, otwarte",
          "Single-Leg Lateral Hop": "skok w bok — analogia, otwarte",
          "Side Hop-Sprint": "skok w bok — analogia, otwarte",
          "Side to Side Box Shuffle": "skok w bok — analogia, otwarte",
          "Alternate Leg Diagonal Bound": "skok po skosie — analogia, otwarte",
          "Lateral Bound": "skok w bok — analogia, otwarte",
          "Kneeling Jump Squat": "wyskok z klęku — brak przeczytanego opisu ruchu"
        }
      },
      {
        "muscle": "glutes",
        "roles": ["main", "aux"],
        "function": "glutes.hip_ext",
        "zrodla": ["W1G3-S1", "W1G3-S2", "W1G3-S3", "S2", "S11", "S19"],
        "uzasadnienie": "wybicie w skoku w górę/w przód = wyprost biodra",
        "exercises": [
          "Box Jump", "Jump Squat", "Weighted Jump Squat", "Tuck Jump", "Star Jump", "Bench Jump", "Broad Jump",
          "Depth Jump", "Dumbbell Seated Box Jump", "Frog Hops", "Split Jump", "Double Leg Butt Kick",
          "Single-Leg Stride Jump", "Alternate Leg Push-Off", "Single Leg Push-Off", "Box Skip", "Front Cone Hops",
          "Single-Leg Hop Progression"
        ]
      },
      {
        "muscle": "calves",
        "roles": ["main", "aux"],
        "function": "calves.plantar_flex",
        "zrodla": ["W1G3-S1", "W1G3-S2", "W1G3-S3", "S2", "S15"],
        "uzasadnienie": "wybicie w skoku = zgięcie podeszwowe stopy (odbicie z palców)",
        "exercises": [
          "Box Jump", "Jump Squat", "Weighted Jump Squat", "Tuck Jump", "Star Jump", "Bench Jump", "Broad Jump",
          "Depth Jump", "Frog Hops", "Split Jump", "Double Leg Butt Kick", "Single-Leg Stride Jump",
          "Alternate Leg Push-Off", "Single Leg Push-Off", "Box Skip", "Front Cone Hops", "Single-Leg Hop Progression",
          "Single Leg Butt Kick"
        ]
      }
    ]
  },
  "sources": [
    {
      "id": "W1G3-S1",
      "tier": 4,
      "cite": "American Council on Exercise (ACE). Exercise Library: Box Jumps (nr 115); Single Leg Push-Off (nr 230); Jump and Reach (nr 176)",
      "url": "https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/",
      "urlDodatkowe": [
        "https://www.acefitness.org/education-and-resources/lifestyle/exercise-library/230/single-leg-push-off",
        "https://www.acefitness.org/acefit/exercise-library-details/6/176"
      ],
      "miejsce": "instrukcja krok po kroku (Box Jumps krok 3; Single Leg Push-Off krok 2; Jump and Reach krok 2); Target Body Parts",
      "cytaty": [
        "Box Jumps: triple extension — „pushing and extending your ankles, knees and hips simultaneously”",
        "Single Leg Push-Off: „create triple extension (ankle plantarflexion, knee and hip extension)”"
      ],
      "uwaga": "trzy strony tej samej organizacji = jedno niezależne źródło"
    },
    {
      "id": "W1G3-S2",
      "tier": 4,
      "cite": "National Academy of Sports Medicine (NASM). Exercise Library: Box Jumps",
      "url": "https://www.nasm.org/resource-center/exercise-library/box-jumps",
      "miejsce": "instrukcja, krok 3 (Execute/Drive); sekcja Muscles Worked",
      "cytaty": [
        "„Explosively extend your hips, knees, and ankles while swinging your arms upward to generate momentum.”",
        "Primary Muscles: „Quadriceps”, „Glutes”, „Gastrocnemius and Soleus”"
      ]
    },
    {
      "id": "W1G3-S3",
      "tier": 3,
      "cite": "Wade L, Lichtwark G, Farris DJ. Movement Strategies for Countermovement Jumping are Potentially Influenced by Elastic Energy Stored and Released from Tendons. Sci Rep 2018",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5797114",
      "miejsce": "Abstract; Discussion (udział pracy stawów)",
      "cytaty": [
        "Abstract: praca w stawie skokowym utrzymuje stały udział „(~64%) to total work” przy dodanym obciążeniu",
        "Discussion: przy wyższym skoku „the work contribution of the hip and knee joints are increased”"
      ]
    }
  ]
}
```

## Źródła

| id | adres | organizacja / autorzy | szczebel | miejsce |
|---|---|---|---|---|
| W1G3-S1 | https://www.acefitness.org/resources/everyone/exercise-library/115/box-jumps/ (+ nr 230, 176) | American Council on Exercise | 4 | instrukcja krok 2–3, Target Body Parts |
| W1G3-S2 | https://www.nasm.org/resource-center/exercise-library/box-jumps | National Academy of Sports Medicine | 4 | krok 3 „Execute/Drive”, Muscles Worked |
| W1G3-S3 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5797114 | Wade, Lichtwark, Farris (Sci Rep 2018) | 3 | Abstract, Discussion |
| S2, S11, S12, S15, S19 | jak w `data/zrodla/role-miesni.json` | anatomia (OpenStax, TeachMeAnatomy), przegląd systematyczny (pośladkowy wielki) | 2–4 | jak w pliku |

Ocena pewności: zastosowanie istniejących funkcji do skoków w górę/w przód — **dwa źródła** szczebla 4 (ACE, NASM; różne organizacje) wprost o potrójnym
wyproście przy wybiciu + jedno badanie szczebla 3 o pracy stawów; funkcje anatomiczne — status bez zmian (ustalone/dwa_zrodla). Przeniesienie z opisanych
ćwiczeń (box jump, jump and reach, single-leg push-off) na pokrewne skoki w górę/w przód z tej samej rodziny (np. Tuck Jump, Frog Hops) to ta sama mechanika
wybicia, którą obie organizacje opisują ogólnie dla skoku; skoków w bok tym nie objęto.

Sprawdzone w drugiej sesji i **nie użyte** (skoki w bok):
- Kariyama Y, Zushi K. The differences between horizontal and vertical direction during a single-leg rebound jump (ISBS, https://ojs.ub.uni-konstanz.de/cpa/article/view/5636/5129) — przeczytane; skoki w przód i w górę, nie w bok (moment odwodzący biodra przy wybiciu jednonóż) → nie dotyczy kierunku bocznego.
- Fleischmann J i in. Load-dependent movement regulation of lateral stretch shortening cycle jumps. Eur J Appl Physiol 2010 (streszczenie, springermedicine.com) — skoki w bok, ale streszczenie opisuje przemieszczenia stawów i odruchy, bez wyprostu kolana/biodra przy wybiciu i bez nazw mięśni.
- Badanie kroku dostawnego (moment wyprostny biodra rośnie z prędkością boczną) — strona lida.sport-iat.de zwróciła 503; tylko streszczenie z wyszukiwarki (nie źródło).
- Biblioteki ACE i NASM — w wynikach brak stron skoku w bok; NASM `lateral-bound` → 404. Pozostałe wyniki to strony aplikacji i platform ćwiczeń fizjoterapeutycznych (nie są źródłem).

## Otwarte

- [OTWARTE] Skoki w bok i po skosie (7 ćwiczeń + Lateral Bound) dla quads/glutes/calves — przeczytane źródła opisują wybicie w górę/w przód; nie
  znalazłem przeczytanego źródła o pracy stawów przy wybiciu w bok (dwie sesje; wyniki: badania lądowania, streszczenia bez wyprostu stawów, strony aplikacji). Przeniesienie = analogia.
  Kandydat do przeczytania: pełny tekst Fleischmann i in. 2010 (Eur J Appl Physiol) i badanie kroku dostawnego (ISBS/lida) — gdy dostępne.
- [OTWARTE] Odwodziciele i przywodziciele w skokach w bok (Single-Leg Lateral Hop, Lateral Bound) — brak przeczytanego badania EMG ani opisu organizacji;
  znalezione były tylko blogi i badania lądowania.
- [OTWARTE] Dwugłowe uda w Butt Kick (Single/Double Leg) i Box Skip — ruch „pięta do pośladka” to zgięcie kolana (S2, S13), ale nie przeczytałem źródła
  szczebla ≤ 4 (poza stronami aplikacji i blogami), które opisuje to ćwiczenie. Box Skip — rola dwugłowych niejasna.
- [OTWARTE] Kneeling Jump Squat (glutes main, quads aux, hamstrings aux) — brak przeczytanego opisu ruchu; w `figury-sens.json` „nie badane”.
- [OTWARTE, produktowe] Zdanie bez fazy („Prostuje kolano.”) jest prawdziwe, ale mało obrazowe przy skoku. Faza „gdy się wybijasz” | „as you take off”
  wymaga zmiany w `lib/muscleRoles.ts` (nameRules zawsze wariant „_”) — decyzja właściciela; dane źródłowe (ACE, NASM) ją wspierają.
- [OTWARTE, tłumacz] „Pomaga unosić piętę” przy skoku brzmi mniej naturalnie niż np. „Pomaga odbić się z palców” — do oceny recenzenta lokalizacji
  (to ta sama funkcja, zgięcie podeszwowe; W1G3-S1: „ankle plantarflexion”).
- [OTWARTE, poza zadaniem] Liczby luk w briefie (np. hamstrings aux = 2) nie obejmują Double Leg Butt Kick i Box Skip, które w `lib/catalog.generated.ts`
  mają hamstrings 0,5 — do sprawdzenia generatorem przy scalaniu.

## Stan

Zrobione: luki quads/glutes/calves dla skoków w górę/w przód (55 par); dwie sesje wyszukiwania dla skoków w bok (bez wyniku → Otwarte), odwodzicieli/przywodzicieli, Butt Kick, Kneeling Jump Squat.
Zostało: skoki w bok (8 ćwiczeń × quads/glutes/calves), Butt Kick, Kneeling Jump Squat.
Następny krok: koordynator przenosi blok JSON do `data/zrodla/role-miesni.json` (nadanie numerów S29+), dopisuje test listy nameRules, generator przelicza liczby. Dla skoków w bok — dostęp do pełnego tekstu Fleischmann i in. 2010 albo biblioteka ćwiczeń organizacji szkolącej trenerów z opisem skoku w bok.
Pułapki: nameRules nie sprawdzają `metric: time` (wszystkie te ćwiczenia mają `reps`/`weight_reps` — w porządku); ACE i NASM to szczebel 4, nie szczebel 2;
nie wpisywać do listy ćwiczeń, których nie ma w katalogu (wszystkie nazwy sprawdzone w `lib/catalog.generated.ts`/`catalog.json`); platformy ćwiczeń
fizjoterapeutycznych i strony aplikacji nie są źródłem; lida.sport-iat.de — 503.
