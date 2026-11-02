# Role mięśni — rodzina sled_throw (sanie, rzuty piłką, uderzenia) i pojedyncze ćwiczenia G3

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3) · Tylko zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json` i testach.

Dane wejściowe jak w `plyo.md` (ten sam katalog). Rodzina `sled_throw` wynika z nazw (`lib/figures/v2/families.ts`: „sled”, „throw”, „slam”,
„drag”, „wall ball”, „spider crawl”, „turkish” …). Ćwiczenia z luk spoza tej rodziny (Kettlebell Pirate Ships, Jerk Balance, Rack Delivery) opisano
tu jako „pojedyncze”, zgodnie z briefem. W katalogu nie ma dziś nameRules dla żadnego z tych ćwiczeń.

## Wniosek

Gotowe są tylko dwie pary pchania sań (Sled Push): mięsień czworogłowy (wyprost kolana) i łydki (zgięcie podeszwowe). Badanie EMG (szczebel 3, W1G3-S4:
aktywność czworogłowych podobna jak w przysiadzie, łydek o 61% większa) i serwis specjalistyczny pisany przez trenera z certyfikatem CSCS (szczebel 4,
W1G3-S5) zgadzają się z anatomią (S2, S12, S15). Wszystko pozostałe jest otwarte: nie przeczytałem żadnego źródła, które opisuje ruch w stawach przy
ciągnięciu sań, rzucie o ścianę ani przy ćwiczeniach z ciężarem nad głową. Znajdowałem tylko blogi, strony aplikacji (wyłączone z mocy polecenia koordynatora)
albo same streszczenia, bez treści.

## Tabela luk

| Luka (pattern \| region \| rola) | Gotowe | Otwarte (ćwiczenie — powód) |
|---|---|---|
| other \| quads \| main | Sled Push → `quads.knee_ext` | Wall Ball (brak przeczytanego źródła o mechanice przysiad + rzut); Sled Drag (Harness), Backward Drag, Bear Crawl Sled Drag (brak źródła o ciągnięciu sań — badania ciągnięcia przy sprincie podają tylko kąty stawów; teza o czworogłowych przy ciągnięciu tyłem — tylko blogi) |
| other \| calves \| aux | Sled Push → `calves.plantar_flex` | Sled Drag (Harness), Backward Drag — j.w. |
| other \| glutes \| aux | — | Sled Push — tylko jedno źródło szczebla 4 (W1G3-S5: „main muscle used to have a powerful leg extension, especially at the hip joint”); badania EMG pośladków przy pchaniu sań znam tylko ze streszczeń z wyszukiwarki (nie źródło) → jedno źródło, nie wyświetlane. Sled Drag (Harness), Bear Crawl Sled Drag, Wall Ball, Turkish Get Up — brak źródła |
| other \| front_delt \| main | — | Turkish Get Up, Kettlebell Pirate Ships, Sled Overhead Backward Walk, Jerk Balance, Rack Delivery — przy części z nich ramię jest utrzymywane nad głową albo z przodu (utrzymanie, nie „unoszenie”), co w `front_delt.shoulder_flex` („Unosi ramię do przodu”) nie opisuje ruchu; brak przeczytanego źródła o każdym z nich (dla TGU znalazłem tylko streszczenie badania EMG barku, bez treści) |
| other \| front_delt \| aux | — | Wall Ball (rzut — brak źródła), Bear Crawl Sled Drag (podpór — utrzymanie) |
| other \| quads \| aux | — | Sled Forward Drag with Press, Sled Overhead Backward Walk, Jerk Balance — brak źródła |
| other \| triceps \| aux | — | Sled Forward Drag with Press, Jerk Balance, Spider Crawl — brak źródła (pchanie uchwytów sań przypomina wyciskanie, ale to analogia) |
| other \| chest \| main | — | Sled Forward Drag with Press — analogia do wyciskania, brak źródła |
| other \| chest \| aux | — | Spider Crawl — brak źródła |
| other \| abs \| main | — | Turkish Get Up, Spider Crawl — brak źródła; dla TGU wyszukiwanie dało tylko rejestr badania (bez wyników) i wątek na forum |
| other \| abs \| aux | — | Bear Crawl Sled Drag — brak źródła |
| other \| obliques \| main / aux | — | Turkish Get Up (main), Kettlebell Pirate Ships, Spider Crawl (aux) — brak źródła |
| other \| upper_back \| aux | — | Sled Overhead Backward Walk, Rack Delivery — brak źródła |
| other \| forearms \| aux | — | Backward Drag — chwyt za uchwyty/linę; `forearms.grip` ma status dwa_zrodla, ale nie przeczytałem źródła o tym ćwiczeniu → otwarte |
| core_flexion \| lats \| aux | — | Supine One-Arm Overhead Throw, Supine Two-Arm Overhead Throw — sam katalog ma przy nich „brak źródła — uproszczenie”; rzut zza głowy w leżeniu to wyprost ramienia (S1, S5), ale nie przeczytałem źródła o tym ćwiczeniu |

Razem: 2 pary gotowe, ok. 40 par otwartych.

## Propozycja danych (format role-miesni.json)

Nowych funkcji nie ma. Zdania (wariant „_”): quads main „Prostuje kolano.” | „Straightens your knee.”; calves aux „Pomaga unosić piętę.” | „Helps lift your heel.”

```json
{
  "nameRules": {
    "reguly": [
      {
        "muscle": "quads",
        "roles": ["main", "aux"],
        "function": "quads.knee_ext",
        "zrodla": ["W1G3-S4", "W1G3-S5", "S2", "S12"],
        "uzasadnienie": "pchanie sań: krok za krokiem wyprost kolana; EMG czworogłowych jak w przysiadzie",
        "exercises": ["Sled Push"],
        "pominiete": {
          "Sled Drag (Harness)": "brak przeczytanego źródła o ciągnięciu sań",
          "Backward Drag": "brak przeczytanego źródła (tylko blogi)",
          "Bear Crawl Sled Drag": "brak przeczytanego źródła",
          "Wall Ball": "brak przeczytanego źródła"
        }
      },
      {
        "muscle": "calves",
        "roles": ["main", "aux"],
        "function": "calves.plantar_flex",
        "zrodla": ["W1G3-S4", "W1G3-S5", "S2", "S15"],
        "uzasadnienie": "pchanie sań: odbicie stopą; EMG łydek większe niż w przysiadzie",
        "exercises": ["Sled Push"]
      }
    ]
  },
  "sources": [
    {
      "id": "W1G3-S4",
      "tier": 3,
      "cite": "Maddigan ME, Button DC, Behm DG. Lower-limb and trunk muscle activation with back squats and weighted sled apparatus. J Strength Cond Res 2014;28(12):3346–53",
      "url": "https://pubmed.ncbi.nlm.nih.gov/25226330/",
      "miejsce": "Abstract (przeczytane samo streszczenie w PubMed; pełny tekst niedostępny)",
      "cytaty": [
        "„the sled and squat exercises provided similar EMG activity for the quadriceps, hamstrings, and TrA/IO”",
        "„61.2% greater gastrocnemius EMG with the sled exercise (p = 0.01)”"
      ]
    },
    {
      "id": "W1G3-S5",
      "tier": 4,
      "cite": "Dewar M (MSc, CSCS). Sled Push. BarBend (akt. 28.06.2024)",
      "url": "https://barbend.com/sled-push/",
      "miejsce": "sekcje Quadriceps, Glutes, Calves",
      "cytaty": [
        "„The quadriceps extend the knee joint, so they're naturally active during every step of the sled push.”",
        "o łydkach: sanie pozwalają uzyskać „high amounts of force output through the calf with every step”"
      ],
      "uwaga": "serwis specjalistyczny (szczebel 4); sam w sobie dla pośladków = jedno źródło"
    }
  ]
}
```

## Źródła

| id | adres | organizacja / autorzy | szczebel | miejsce |
|---|---|---|---|---|
| W1G3-S4 | https://pubmed.ncbi.nlm.nih.gov/25226330/ | Maddigan, Button, Behm (J Strength Cond Res 2014) | 3 | Abstract |
| W1G3-S5 | https://barbend.com/sled-push/ | BarBend, autor z certyfikatem CSCS | 4 | Quadriceps, Glutes, Calves |
| S2, S12, S15 | jak w `data/zrodla/role-miesni.json` | anatomia (OpenStax, TeachMeAnatomy) | 3–4 | jak w pliku |

Ocena pewności: Sled Push quads/calves — **dwa źródła** (szczebel 3 + 4, niezależne zespoły) zgodne z anatomią. Zastrzeżenie: W1G3-S4 przeczytany tylko
w streszczeniu (EMG mięśnia prostego uda i brzuchatego łydki); pokazuje, że mięśnie pracują, a ruch w stawie (wyprost kolana, zgięcie podeszwowe) wynika
z anatomii i z W1G3-S5.

## Otwarte

- [OTWARTE] Sled Push — pośladki (glutes aux, `glutes.hip_ext`): jedno źródło szczebla 4 (W1G3-S5). Badania EMG pośladków przy pchaniu sań (zespół
  z Texas Woman's University, 2020–2021) znalazłem tylko jako streszczenia z wyszukiwarki; strony repozytorium i DOAJ zwracały 403 → szukać pełnego tekstu.
- [OTWARTE] Ciągnięcie sań przodem (Sled Drag (Harness)), tyłem (Backward Drag), na czworakach (Bear Crawl Sled Drag) — brak przeczytanego źródła
  o pracy mięśni; badania ciągnięcia przy sprincie (np. PMC8538495) podają tylko kąty stawów. Ciągnięcie tyłem: znalezione tylko blogi i praca dyplomowa (null result).
- [OTWARTE] Wall Ball — brak przeczytanego źródła szczebla ≤ 4 (wyniki: blogi, strona aplikacji — wyłączone).
- [OTWARTE] Turkish Get Up, Kettlebell Pirate Ships, Sled Overhead Backward Walk, Jerk Balance, Rack Delivery, Sled Forward Drag with Press, Spider Crawl —
  brak przeczytanego źródła. Dodatkowo kwestia sformułowania: utrzymywanie ciężaru nad głową lub w podporze to nie „unoszenie ramienia” — może wymagać
  nowej funkcji typu „trzyma ramię uniesione” (do zbadania, nie proponuję bez źródła). Dla TGU: badanie EMG barku (J Bodyw Mov Ther 2019, PubMed 30691756) —
  przeczytać pełny tekst.
- [OTWARTE] Supine One-/Two-Arm Overhead Throw (core_flexion, lats aux) — katalog sam oznacza „brak źródła — uproszczenie”; uwaga: reguła po pattern
  `core_flexion` dla lats objęłaby wszystkie ćwiczenia tej rodziny, więc tylko nameRules.
- [OTWARTE, poza zadaniem — rozbieżność z briefem] Brief mówi, że Medicine Ball Slam, One-Arm Medicine Ball Slam, Backward Medicine Ball Throw,
  Medicine Ball Scoop Throw, Standing Two-Arm Overhead Throw, Supine Chest Throw i Sledgehammer Swings nie mają regionów w muscleLoad. W
  `lib/catalog.generated.ts` (mapa muscleLoad) i `docs/research/equipment/catalog.json` **mają** wpisy (np. Medicine Ball Slam: lats 0,5, abs 0,5 …;
  Backward Medicine Ball Throw: glutes 1 …); mają za to puste `muscles`/`secondaryMuscles` w wierszu biblioteki. Do sprawdzenia przez koordynatora,
  czy `muscleLoadOf` je pomija — wtedy brak obciążeń mięśni w aplikacji to sprawa katalogu, nie ról.

## Stan

Zrobione: Sled Push quads/calves (2 pary, JSON); przeszukanie źródeł dla sań (ciągnięcie przodem/tyłem), Wall Ball, TGU — bez wyniku (Otwarte).
Zostało: pośladki przy pchaniu sań (pełny tekst badań EMG), ciągnięcie sań, Wall Ball, TGU (pełny tekst PubMed 30691756), ćwiczenia z ciężarem nad głową
(Jerk Balance, Rack Delivery, Sled Overhead Backward Walk, Pirate Ships), Spider Crawl, Sled Forward Drag with Press, rzuty w leżeniu.
Następny krok: nowy agent zaczyna od listy „Zostało”; najpierw sanie (największa liczba par), potem pojedyncze.
Pułapki: ExRx (403) i web.archive.org są niedostępne; core.ac.uk, twu-ir.tdl.org, doaj.org, mdpi.com zwracały 403; strony innych aplikacji nie są
źródłem; streszczenie z wyszukiwarki nie jest źródłem (tylko strona przeczytana przez WebFetch).
