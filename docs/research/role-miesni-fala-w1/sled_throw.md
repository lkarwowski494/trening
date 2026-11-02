# Role mięśni — rodzina sled_throw (sanie, rzuty piłką, uderzenia) i pojedyncze ćwiczenia G3

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W1, G3; kontynuacja tego samego dnia — Wall Ball) · Tylko zbieranie danych — bez zmian w kodzie, `data/zrodla/*.json` i testach.

Dane wejściowe jak w `plyo.md` (ten sam katalog). Rodzina `sled_throw` wynika z nazw (`lib/figures/v2/families.ts`: „sled”, „throw”, „slam”,
„drag”, „wall ball”, „spider crawl”, „turkish” …). Ćwiczenia z luk spoza tej rodziny (Kettlebell Pirate Ships, Jerk Balance, Rack Delivery) opisano
tu jako „pojedyncze”, zgodnie z briefem. W katalogu nie ma dziś nameRules dla żadnego z tych ćwiczeń.

Szczeble źródeł według rozstrzygnięcia koordynatora linii 1.1 (02.11.2026): BarBend = 4 tylko dla artykułów o technice (W1G3-S5 to artykuł o technice
z autorem i datą — zostaje 4); CrossFit (organizacja szkoląca trenerów, treść firmowana z datą) = 4; Harvard Health Publishing (wydawca z redakcją
i recenzją ekspercką, autor + data) = 4.

## Wniosek

Gotowe są dwie pary pchania sań (Sled Push): mięsień czworogłowy (wyprost kolana) i łydki (zgięcie podeszwowe). Badanie EMG (szczebel 3, W1G3-S4:
aktywność czworogłowych podobna jak w przysiadzie, łydek o 61% większa) i serwis specjalistyczny pisany przez trenera z certyfikatem CSCS (szczebel 4,
W1G3-S5) zgadzają się z anatomią (S2, S12, S15).

Druga sesja (02.11.2026): gotowe dwie pary Wall Ball — czworogłowe (główny, wyprost kolana) i pośladki (pomocniczy, wyprost biodra). Dwa niezależne
źródła szczebla 4 opisują wybicie z przysiadu przed rzutem: organizacja szkoląca trenerów (W1G3-S7: „fully extends the hips and legs”) i wydawca
medyczny z recenzją trenera z CSCS (W1G3-S8: wybicie z przysiadu do stania, praca pośladków i nóg). Wyprost kolana przy wstawaniu z przysiadu — anatomia (S2, S12).

Wszystko pozostałe jest otwarte: nie przeczytałem źródła, które opisuje ruch w stawach przy ciągnięciu sań, przy tureckim wstawaniu ani przy
ćwiczeniach z ciężarem nad głową (w tej sesji przeczytane same streszczenia bez rozstrzygnięcia — niżej).

## Tabela luk

| Luka (pattern \| region \| rola) | Gotowe | Otwarte (ćwiczenie — powód) |
|---|---|---|
| other \| quads \| main | Sled Push → `quads.knee_ext`; **Wall Ball** → `quads.knee_ext` | Sled Drag (Harness), Backward Drag, Bear Crawl Sled Drag (brak źródła o ciągnięciu sań — badania ciągnięcia przy sprincie podają tylko kąty stawów; badanie West i in. 2014 o ciągnięciu sań tyłem — tylko tytuł, bez streszczenia; badania chodu tyłem to inne ćwiczenie = analogia) |
| other \| calves \| aux | Sled Push → `calves.plantar_flex` | Sled Drag (Harness), Backward Drag — j.w. |
| other \| glutes \| aux | **Wall Ball** → `glutes.hip_ext` | Sled Push — tylko jedno źródło szczebla 4 (W1G3-S5); Sled Drag (Harness), Bear Crawl Sled Drag, Turkish Get Up — brak źródła |
| other \| front_delt \| main | — | Turkish Get Up (W1G3-S9 — streszczenie: 8 grup mięśni barku, bez nazw mięśni najbardziej aktywnych), Kettlebell Pirate Ships, Sled Overhead Backward Walk, Jerk Balance, Rack Delivery — przy części z nich ramię jest utrzymywane nad głową albo z przodu (utrzymanie, nie „unoszenie”) |
| other \| front_delt \| aux | — | Wall Ball (W1G3-S7: „engages the shoulders and arms to launch the ball”, W1G3-S8: „shoulders” — kierunek ruchu w barku nie jest opisany; zgięcie barku byłoby wnioskiem), Bear Crawl Sled Drag (podpór — utrzymanie) |
| other \| quads \| aux | — | Sled Forward Drag with Press, Sled Overhead Backward Walk, Jerk Balance — brak źródła |
| other \| triceps \| aux | — | Sled Forward Drag with Press, Jerk Balance, Spider Crawl — brak źródła (pchanie uchwytów sań przypomina wyciskanie, ale to analogia) |
| other \| chest \| main | — | Sled Forward Drag with Press — analogia do wyciskania, brak źródła |
| other \| chest \| aux | — | Spider Crawl — brak źródła |
| other \| abs \| main | — | Turkish Get Up, Spider Crawl — brak źródła |
| other \| abs \| aux | — | Bear Crawl Sled Drag — brak źródła |
| other \| obliques \| main / aux | — | Turkish Get Up (main), Kettlebell Pirate Ships, Spider Crawl (aux) — brak źródła |
| other \| upper_back \| aux | — | Sled Overhead Backward Walk, Rack Delivery — brak źródła |
| other \| forearms \| aux | — | Backward Drag — chwyt za uchwyty/linę; `forearms.grip` ma status dwa_zrodla, ale nie przeczytałem źródła o tym ćwiczeniu → otwarte |
| core_flexion \| lats \| aux | — | Supine One-Arm Overhead Throw, Supine Two-Arm Overhead Throw — sam katalog ma przy nich „brak źródła — uproszczenie”; rzut zza głowy w leżeniu to wyprost ramienia (S1, S5), ale nie przeczytałem źródła o tym ćwiczeniu |

Razem: 4 pary gotowe, ok. 38 par otwartych.

## Propozycja danych (format role-miesni.json)

Nowych funkcji nie ma. Zdania (wariant „_”): quads main „Prostuje kolano.” | „Straightens your knee.”; calves aux „Pomaga unosić piętę.” | „Helps lift your heel.”;
glutes aux „Pomaga prostować biodro.” | „Helps straighten your hip.”

Uwaga: w `plyo.md` są już nameRules dla `quads.knee_ext` i `glutes.hip_ext` (skoki). Koordynator może scalić listy (Sled Push, Wall Ball dopisać do tych
samych reguł) albo zostawić osobne — w nameRules liczy się nazwa ćwiczenia, więc wynik ten sam.

```json
{
  "nameRules": {
    "reguly": [
      {
        "muscle": "quads",
        "roles": ["main", "aux"],
        "function": "quads.knee_ext",
        "zrodla": ["W1G3-S4", "W1G3-S5", "W1G3-S7", "W1G3-S8", "S2", "S12"],
        "uzasadnienie": "pchanie sań: krok za krokiem wyprost kolana; EMG czworogłowych jak w przysiadzie. Wall Ball: wybicie z przysiadu przed rzutem (wyprost bioder i nóg)",
        "exercises": ["Sled Push", "Wall Ball"],
        "pominiete": {
          "Sled Drag (Harness)": "brak przeczytanego źródła o ciągnięciu sań",
          "Backward Drag": "brak przeczytanego źródła (tylko blogi; badanie West i in. 2014 bez dostępnej treści)",
          "Bear Crawl Sled Drag": "brak przeczytanego źródła"
        }
      },
      {
        "muscle": "calves",
        "roles": ["main", "aux"],
        "function": "calves.plantar_flex",
        "zrodla": ["W1G3-S4", "W1G3-S5", "S2", "S15"],
        "uzasadnienie": "pchanie sań: odbicie stopą; EMG łydek większe niż w przysiadzie",
        "exercises": ["Sled Push"]
      },
      {
        "muscle": "glutes",
        "roles": ["main", "aux"],
        "function": "glutes.hip_ext",
        "zrodla": ["W1G3-S7", "W1G3-S8", "S2", "S11"],
        "uzasadnienie": "Wall Ball: wyprost bioder przy wybiciu z przysiadu (W1G3-S7), praca pośladków (W1G3-S8)",
        "exercises": ["Wall Ball"],
        "pominiete": {
          "Sled Push": "jedno źródło szczebla 4 (W1G3-S5)"
        }
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
      "uwaga": "artykuł o technice z autorem i datą — szczebel 4 wg rozstrzygnięcia koordynatora 02.11.2026; sam w sobie dla pośladków = jedno źródło"
    },
    {
      "id": "W1G3-S7",
      "tier": 4,
      "cite": "CrossFit. The Wall-Ball Shot. CrossFit Essentials, 21.07.2019 (treść firmowana przez organizację)",
      "url": "https://www.crossfit.com/essentials/the-wall-ball",
      "miejsce": "opis wykonania; Muscle Groups Worked",
      "cytaty": [
        "„The athlete drives with the legs out of this position and fully extends the hips and legs” (fragment zdania)",
        "„Once the legs and hips have extended out of the squat, the athlete engages the shoulders and arms to launch the ball toward the target.”"
      ]
    },
    {
      "id": "W1G3-S8",
      "tier": 4,
      "cite": "Solan M. The power of wall balls. Harvard Health Publishing, 07.01.2026 (recenzja: K. Buckwell, MS, CSCS)",
      "url": "https://www.health.harvard.edu/exercise-and-fitness/the-power-of-wall-balls",
      "miejsce": "opis wykonania; akapit o pracujących mięśniach",
      "cytaty": [
        "„Explode upward into a standing position” (z przysiadu, rzucając piłkę)",
        "mięśnie: „the chest, midsection, buttocks, legs, and shoulders”"
      ],
      "uwaga": "nie nazywa stawów wprost; wyprost kolana i biodra przy wstawaniu z przysiadu — anatomia (S2, S12, S11)"
    },
    {
      "id": "W1G3-S9",
      "tier": 3,
      "cite": "St-Onge E, Robb A, Beach TAC, Howarth SJ. A descriptive analysis of shoulder muscle activities during individual stages of the Turkish Get-Up exercise. J Bodyw Mov Ther 2019;23(1):23–31",
      "url": "https://pubmed.ncbi.nlm.nih.gov/30691756/",
      "miejsce": "Abstract (pełny tekst za opłatą)",
      "cytaty": [
        "„Overall, the greatest muscular demand occurred during the second (press to elbow support) and fifth (leg sweep) stages.”"
      ],
      "uwaga": "NIE UŻYTE do ról: streszczenie nie podaje, który z 8 mięśni barku pracuje najmocniej ani w jakim ruchu"
    }
  ]
}
```

## Źródła

| id | adres | organizacja / autorzy | szczebel | miejsce |
|---|---|---|---|---|
| W1G3-S4 | https://pubmed.ncbi.nlm.nih.gov/25226330/ | Maddigan, Button, Behm (J Strength Cond Res 2014) | 3 | Abstract |
| W1G3-S5 | https://barbend.com/sled-push/ | BarBend, artykuł o technice, autor z certyfikatem CSCS | 4 | Quadriceps, Glutes, Calves |
| W1G3-S7 | https://www.crossfit.com/essentials/the-wall-ball | CrossFit (organizacja szkoląca trenerów), 2019 | 4 | opis wykonania; Muscle Groups Worked |
| W1G3-S8 | https://www.health.harvard.edu/exercise-and-fitness/the-power-of-wall-balls | Harvard Health Publishing, 2026, recenzja CSCS | 4 | opis wykonania; mięśnie |
| W1G3-S9 | https://pubmed.ncbi.nlm.nih.gov/30691756/ | St-Onge i in. (J Bodyw Mov Ther 2019) | 3 | Abstract — nie użyte |
| S2, S11, S12, S15 | jak w `data/zrodla/role-miesni.json` | anatomia (OpenStax, TeachMeAnatomy), przegląd (pośladkowy wielki) | 2–4 | jak w pliku |

Ocena pewności: Sled Push quads/calves — **dwa źródła** (szczebel 3 + 4, niezależne zespoły) zgodne z anatomią. Zastrzeżenie: W1G3-S4 przeczytany tylko
w streszczeniu (EMG mięśnia prostego uda i brzuchatego łydki); pokazuje, że mięśnie pracują, a ruch w stawie (wyprost kolana, zgięcie podeszwowe) wynika
z anatomii i z W1G3-S5. Wall Ball quads/glutes — **dwa źródła** szczebla 4 (różne organizacje); W1G3-S7 opisuje wyprost bioder i nóg wprost, W1G3-S8 —
wstanie z przysiadu i pracę pośladków i nóg; nazwę stawu (kolano) dokłada anatomia.

Sprawdzone i **nie użyte** (druga sesja): West i in. 2014 (J Strength Cond Res 28(1):265–272, ciągnięcie sań tyłem — repozytorium Swansea: tylko tytuł,
„Full text not available”); badania chodu tyłem (PMC6706826 i in.) — inne ćwiczenie, przeniesienie na sanie = analogia; Fleischmann i in. 2010
(skoki w bok — streszczenie bez wyprostu stawów, zob. `plyo.md`).

## Otwarte

- [OTWARTE] Sled Push — pośladki (glutes aux, `glutes.hip_ext`): jedno źródło szczebla 4 (W1G3-S5). Badania EMG pośladków przy pchaniu sań (zespół
  z Texas Woman's University, 2020–2021) znalazłem tylko jako streszczenia z wyszukiwarki; strony repozytorium i DOAJ zwracały 403 → szukać pełnego tekstu.
- [OTWARTE] Ciągnięcie sań przodem (Sled Drag (Harness)), tyłem (Backward Drag), na czworakach (Bear Crawl Sled Drag) — brak przeczytanego źródła
  o pracy mięśni; badania ciągnięcia przy sprincie (np. PMC8538495) podają tylko kąty stawów; West i in. 2014 — bez dostępnej treści.
- [OTWARTE] Wall Ball — przedni akton (aux): oba źródła mówią o pracy barków przy rzucie, ale nie o kierunku ruchu (zgięcie barku) → wniosek, nie wyświetlane.
- [OTWARTE] Turkish Get Up — przedni akton, brzuch, skośne: W1G3-S9 przeczytany tylko w streszczeniu (bez nazw mięśni). Kettlebell Pirate Ships,
  Sled Overhead Backward Walk, Jerk Balance, Rack Delivery, Sled Forward Drag with Press, Spider Crawl — brak przeczytanego źródła. Dodatkowo kwestia
  sformułowania: utrzymywanie ciężaru nad głową lub w podporze to nie „unoszenie ramienia” — może wymagać nowej funkcji typu „trzyma ramię uniesione”
  (do zbadania, nie proponuję bez źródła).
- [OTWARTE] Supine One-/Two-Arm Overhead Throw (core_flexion, lats aux) — katalog sam oznacza „brak źródła — uproszczenie”; uwaga: reguła po pattern
  `core_flexion` dla lats objęłaby wszystkie ćwiczenia tej rodziny, więc tylko nameRules.
- [OTWARTE, sprawa danych katalogu, nie ról] Medicine Ball Slam, One-Arm Medicine Ball Slam, Backward Medicine Ball Throw, Medicine Ball Scoop Throw,
  Standing Two-Arm Overhead Throw, Supine Chest Throw, Sledgehammer Swings mają wpisy `muscleLoad` w katalogu, ale puste `muscles`/`secondaryMuscles`
  w wierszu biblioteki; `muscleLoadOf` w `lib/seed.ts` pomija wtedy regiony o udziale ≥ 0,5 (informacja koordynatora 02.11.2026), więc nie mają wierszy
  ról. Naprawa w danych katalogu, nie w regułach ról.

## Stan

Zrobione: Sled Push quads/calves (2 pary); Wall Ball quads main + glutes aux (2 pary, druga sesja, źródła W1G3-S7, W1G3-S8); przeszukanie źródeł dla sań
(przodem/tyłem), TGU (streszczenie W1G3-S9 — bez rozstrzygnięcia).
Zostało: pośladki przy pchaniu sań (pełny tekst badań EMG), ciągnięcie sań (wszystkie trzy), Wall Ball przedni akton, TGU, ćwiczenia z ciężarem nad głową
(Jerk Balance, Rack Delivery, Sled Overhead Backward Walk, Pirate Ships), Spider Crawl, Sled Forward Drag with Press, rzuty w leżeniu.
Następny krok: ciągnięcie sań — szukać biblioteki ćwiczeń drugiej organizacji szkolącej trenerów z opisem „backward sled drag” (wyprost kolana) albo pełnego tekstu West i in. 2014.
Pułapki: ExRx (403) i web.archive.org są niedostępne; core.ac.uk, twu-ir.tdl.org, doaj.org, mdpi.com zwracały 403; lida.sport-iat.de — 503; strony innych
aplikacji nie są źródłem; streszczenie z wyszukiwarki nie jest źródłem (tylko strona przeczytana przez WebFetch). Harvard Health i CrossFit nie nazywają
stawu kolanowego wprost — wyprost kolana z anatomii.
