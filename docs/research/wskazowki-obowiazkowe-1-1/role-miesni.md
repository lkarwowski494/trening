# Role mięśni — fala „obowiązkowe 1.1”, grupa mieszane: Dead Bug, Hollow Hold, Bird Dog, Medicine Ball Slam, Ab Wheel (02.11.2026)

Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — bez zmian w `data/zrodla/role-miesni.json`.
Format jak `role-miesni-fala-w2/` (gałąź `badania/w2-core`). Reguły po nazwie (`nameRules`) sprawdzane w `matchRole` przed regułami rodziny (`lib/muscleRoles.ts:35`); funkcje z własnym statusem (docs/18 l.143). Kryterium „ma role” w liczniku: co najmniej jeden wiersz z wyświetlanym zdaniem (`scripts/pokrycie-katalogu.mjs:70,75`).
Udziały mięśni z `lib/catalog.generated.ts:827–849` (MUSCLE_LOAD); wiersz roli powstaje tylko przy udziale ≥ `MUSCLE_MIN_LOAD` = 0,5 (`lib/figures/v2/muscles.ts:15`, `lib/muscleRoles.ts:28,57`).

## Co już było zbadane (najpierw przeczytane)

- **Dead Bug, Hollow Hold — abs main → `abs.antilordosis`**: W1 g1 (`role-miesni-fala-w1/core_floor.md:18,27,33,35`, gałąź `badania/g1-core`) — „gotowe” przez podniesienie funkcji do `dwa_zrodla` (S17 Kenhub + S32-g1 przegląd systematyczny, część „Context”). W2 core (`role-miesni-fala-w2/core_floor.md:11`) przyjął to samo przy Scissor Kick. Natomiast g5 (`role-miesni-fala-w1/pushup_plank.md:9`) i W2 pchanie (`role-miesni-fala-w2/pushup_plank-cz2.md:16`) uznały funkcję za „jedno źródło” — nie uwzględniły S32-g1. W danych dziś: `jedno_zrodlo` (`data/zrodla/role-miesni.json:278–284`), więc zdanie się nie wyświetla. **Brak ról w liście obowiązkowej to skutek nieintegrowanej propozycji W1 i sprzeczności między grupami — rozstrzygnięcie niżej.**
- Skośne aux w Dead Bug / Hollow Hold (`obliques.antilordosis`) — uproszczenie (W1 i W2), bez zmian.
- Bird Dog obliques main (`obliques.antirotation`) — jedno źródło (W2 core_floor.md:13); abs aux — brak źródła (W2 :14).
- Medicine Ball Slam — W1 g3 (`role-miesni-fala-w1/sled_throw.md:189–192`): wiersze ról nie powstają, bo wiersz biblioteki ma puste partie (`muscles`/`secondaryMuscles`), a `muscleLoadOf` odrzuca wtedy regiony ≥ 0,5 (`lib/seed.ts:157`); pozostałe regiony (0,25) są poniżej progu 0,5. Sprawa danych katalogu, nie reguł.
- Ab Wheel — abs main jak Dead Bug (reguła `core_anti_ext`+abs+main, `data/zrodla/role-miesni.json:1067–1077`); lats aux — W1 g5 odnotował uwagę poboczną (`role-miesni-fala-w1/chest_fly.md:48`).

## Rozstrzygnięcie `abs.antilordosis` (nowe źródło)

NASM, biblioteka ćwiczeń, Bird Dog (przeczytane 02.11.2026), lista mięśni głównych: „Rectus Abdominis – primary stabilizer resisting spinal extension during opposite limb extension”. To trzecie, niezależne źródło (szczebel 4, organizacja certyfikująca trenerów — precedens w `szczeble-organizacji-2026-11-02.md` pkt 1), które wprost przypisuje mięśniowi prostemu brzucha opór przed wyprostem lędźwi. Razem: S17 (Kenhub, 4), S32-g1 (przegląd systematyczny, zdanie w tle — waga pojedynczej publikacji; cytat sprawdzony ponownie dziś), nasm-bird-dog-rola (4). **Proponowany status: `dwa_zrodla`** (trzy niezależne zespoły; nie „ustalone”, bo żadne źródło szczebla 2 nie ma tego jako wyniku). To usuwa sprzeczność g1 ↔ g5 niezależnie od tego, jak liczyć S32-g1 (S17 + NASM wystarczają).

## Pary

| wiersz (ćwiczenie, mięsień, rola) | funkcja / reguła | źródła (miejsce, szczebel) | status |
|---|---|---|---|
| Dead Bug, abs, main | `abs.antilordosis` — istniejąca reguła `core_anti_ext` (zmiana tylko statusu funkcji) | funkcja: jw.; związek z ćwiczeniem: karta Dead Bug, zdanie `db.back` (ACE 147 krok 1 „without increasing the arch in your low back”; NASM Dead Bug krok 2) — `data/zrodla/cues.json:6274–6286` | **gotowe** (`dwa_zrodla`) |
| Dead Bug, obliques, aux | `obliques.antilordosis` | bez zmian (W1/W2: ruch, nie utrzymanie) | otwarte (uproszczenie) |
| Hollow Hold, abs, main | `abs.antilordosis` — reguła rodziny | funkcja: jw.; związek: W2 core_floor-1.md:18 (błąd `mis.lowBackUp`: BarBend „Arched back” + Catalyst) | **gotowe** (`dwa_zrodla`) |
| Hollow Hold, obliques, aux | `obliques.antilordosis` | bez zmian | otwarte (uproszczenie) |
| Bird Dog, abs, aux | `abs.antilordosis` (zdanie aux „Pomaga utrzymać lędźwie bez wygięcia”); `nameRules` {abs, [aux], ["Bird Dog"]} | nasm-bird-dog-rola (lista mięśni, zdanie wyżej; 4) i healthline-bird-dog (rec. D. Hildreth, RN, CPT, akt. 12.05.2026; wymienia „rectus abdominis” wśród mięśni stabilizujących i instrukcję „engage your core to prevent your back from sagging”; 4) | **gotowe** (`dwa_zrodla`) |
| Bird Dog, glutes, aux | `glutes.hip_ext` („Pomaga prostować biodro”, funkcja `ustalone`); `nameRules` {glutes, [aux], ["Bird Dog"]} | NASM Bird Dog: krok 3 „extending your left leg backward”, pośladki w mięśniach pomocniczych (4); Healthline: „Raise your right arm and left leg”, „glutes” wśród pracujących mięśni (4). Wyprost biodra przy odwiedzeniu nogi w tył z klęku podpartego — anatomia (S2, S11 jak w rejestrze; ten sam sposób co Wall Ball w W1 g3, `sled_throw.md:169–170`) | **gotowe** (`dwa_zrodla`) |
| Bird Dog, lower_back, main | `lower_back.spine_ext` („Prostuje plecy i trzyma je prosto”) | NASM: „Erector Spinae – assist in spinal stabilization and control”; Healthline: „erector spinae” wśród stabilizatorów, „Keep your spine neutral” | otwarte — **uproszczenie**: zdanie mówi też „prostuje”, a w tym ćwiczeniu plecy są tylko utrzymywane; ponadto funkcja zależy od decyzji o TeachMeAnatomy (W1 g1 `core_floor.md:236`). Do decyzji koordynatora |
| Bird Dog, obliques, main | `obliques.antirotation` | bez zmian (jedno źródło szczebla 4: fv-pallof-press). NASM Bird Dog mówi o rotacji przy mięśniu poprzecznym i w błędach („Allowing the spine to rotate”), nie przy skośnych | otwarte (jedno źródło) |
| Ab Wheel, abs, main | `abs.antilordosis` — reguła rodziny | funkcja: jw.; związek: NASM Best Abs, sekcja Ab Wheel Rollout „the core must work to prevent lumbar extension” (już w `data/zrodla/wskazowki-ogolne.json:833`) i ACE 309 (zdanie `ro.back`, `data/zrodla/figury-sens.json:908`) | **gotowe** (`dwa_zrodla`) |
| Ab Wheel, lats, aux | `lats.shoulder_ext_add` („Pomaga ściągać ramię w dół i do tyłu”, funkcja `ustalone`); `nameRules` {lats, [aux], ["Ab Wheel"]} | hildenbrand-2004 (Methods, Exercise Equipment and Performance: powrót obejmuje „shoulder extension and hip flexion as well as lumbar spinal flexion”; 3) i teixeira-2022 (Discussion: wcześniejsze badania aktywności najszerszego „for shoulder extension exercises (Pullover and Ab Wheel Rollout)”; 3) | **gotowe** (`dwa_zrodla`); uwaga: ramię wraca do tułowia w fazie powrotu — zdanie bez fazy pasuje |
| Ab Wheel, obliques, aux | — | tylko aktywność EMG (W2 pushup_plank-cz2.md:17) | otwarte |
| Medicine Ball Slam, (lats / abs) | kandydaci: lats aux → `lats.shoulder_ext_add`; abs aux → `abs.trunk_flex` | barbend-mb-slams (M. Dewar, MSc, CSCS, akt. 19.06.2024; 4): „Taking the medicine ball from overhead to the floor involves drawing the arm down in front of the body”; „The abs are used to generate the downwards force during the slam”. Fitness Volt (V. Vukas, 04.05.2024) — autor bez kwalifikacji trenerskich → warunek szczebla 4 niespełniony | otwarte: **(1) blokada danych** — bez partii w wierszu biblioteki wiersze ról nie powstają (`lib/seed.ts:157`, próg `lib/figures/v2/muscles.ts:15`); partie celowo puste (`docs/research/25-biblioteka/L6-zrodla.md:222`, „jedno źródło”); **(2)** po zmianie katalogu i tak jedno źródło szczebla 4 na parę |

Wynik dla listy obowiązkowej: **Dead Bug, Hollow Hold, Bird Dog, Ab Wheel — role gotowe** (po integracji statusu funkcji i reguł); **Medicine Ball Slam — otwarte** (blokada katalogu + jedno źródło).

## Blok do wklejenia (format role-miesni.json)

```json
{
  "_tryb": "dopisz",
  "nameRules": [
    { "muscle": "abs", "roles": ["aux"], "function": "abs.antilordosis", "exercises": ["Bird Dog"],
      "uwaga": "obowiązkowe 1.1, 02.11.2026: NASM Bird Dog (prosty brzucha opiera się wyprostowi przy wyciąganiu kończyn) + Healthline (kręgosłup neutralny, plecy nie opadają)" },
    { "muscle": "glutes", "roles": ["aux"], "function": "glutes.hip_ext", "exercises": ["Bird Dog"],
      "uwaga": "noga prostowana w tył z klęku podpartego (NASM krok 3, Healthline); wyprost biodra — anatomia" },
    { "muscle": "lats", "roles": ["aux"], "function": "lats.shoulder_ext_add", "exercises": ["Ab Wheel"],
      "uwaga": "rollout = wyprost barku przy powrocie (Hildenbrand i Noble 2004; Teixeira i in. 2022)" }
  ],
  "functions": {
    "abs.antilordosis": {
      "pewnosc": "dwa źródła (trzy niezależne)",
      "uwaga": "obowiązkowe 1.1, 02.11.2026: S17 (Kenhub, Function), S32-g1 (przegląd systematyczny, Context — waga pojedynczej publikacji), nasm-bird-dog-rola (lista mięśni). S26 — tylko aktywność. Rozstrzyga sprzeczność g1/g5.",
      "zrodla": ["S17", "S32-g1", "nasm-bird-dog-rola", "S26"],
      "status": "dwa_zrodla"
    }
  },
  "sources": [
    { "id": "S32-g1", "tier": 2,
      "cite": "Aragón Salamanca JC. Abdominal Drawing-In Maneuver is Less Effective for Core Stability During High Load Tasks: A Systematic Review. Asian J Sports Med 2024;15(3):e148003",
      "url": "https://brieflands.com/articles/asjsm-148003", "miejsce": "1. Context (tło przeglądu)",
      "cytaty": ["„RA plays a critical role in controlling anterior pelvic tilt” (fragment zdania)"] },
    { "id": "nasm-bird-dog-rola", "tier": 4,
      "cite": "NASM, Exercise Library: Bird Dog (treść firmowana, bez autora i daty)",
      "url": "https://www.nasm.org/resource-center/exercise-library/bird-dog", "miejsce": "Primary Muscles; Secondary Muscles; Step 3",
      "cytaty": ["„Rectus Abdominis – primary stabilizer resisting spinal extension during opposite limb extension”"] },
    { "id": "healthline-bird-dog", "tier": 4,
      "cite": "Cronkleton E., rec. Hildreth D. (RN, CPT). Bird dog exercise. Healthline, akt. 12.05.2026",
      "url": "https://www.healthline.com/health/bird-dog-exercise", "miejsce": "mięśnie; instrukcja",
      "cytaty": ["„Keep your spine neutral and engage your core to prevent your back from sagging.”"] },
    { "id": "hildenbrand-2004", "tier": 3,
      "cite": "Hildenbrand K, Noble L. Abdominal Muscle Activity While Performing Trunk-Flexion Exercises Using the Ab Roller, ABslide, FitBall, and Conventionally Performed Trunk Curls. J Athl Train 2004;39(1):37–43",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC385260", "miejsce": "Methods — Exercise Equipment and Performance",
      "cytaty": ["powrót z rolloutu obejmuje „shoulder extension and hip flexion as well as lumbar spinal flexion”"] },
    { "id": "teixeira-2022", "tier": 3,
      "cite": "Teixeira LFM, Gomes WA, da Silva JJ, Magalhães RA, Marchetti PH. Int J Exerc Sci 2022;15(4):797–807 (W1G5-7)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9362894", "miejsce": "Discussion",
      "cytaty": ["„… for shoulder extension exercises (Pullover and Ab Wheel Rollout)” (fragment zdania)"] }
  ]
}
```

Uwaga do bloku: id `S32-g1` pochodzi z propozycji W1 g1 — jeśli koordynator scali najpierw tamten plik, wpis źródła jest już obecny. Liczby `pairs` przelicza generator.

## Źródła (przeczytane WebFetch 02.11.2026)

| id | adres | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|
| nasm-bird-dog-rola | https://www.nasm.org/resource-center/exercise-library/bird-dog | 4 — organizacja certyfikująca trenerów, treść firmowana (szczeble pkt 1, precedens NASM) | Primary/Secondary Muscles; Step 1–4; Common Mistakes |
| healthline-bird-dog | https://www.healthline.com/health/bird-dog-exercise | 4 warunkowo spełnione — autor, nazwany recenzent z kwalifikacjami (RN, CPT), data (uzup. 3) | mięśnie; kroki |
| S32-g1 | https://brieflands.com/articles/asjsm-148003 | 2 (przegląd systematyczny; twierdzenie w tle → waga pojedynczej publikacji) | 1. Context |
| S17 | https://www.kenhub.com/en/library/anatomy/rectus-abdominis-muscle | 4 (istniejące; nie otwierane ponownie — zapis W1 g1) | Function |
| hildenbrand-2004 | https://pmc.ncbi.nlm.nih.gov/articles/PMC385260 | 3 | Methods; nie przypisuje brzuchowi oporu przed wyprostem (sprawdzone — nie użyte do `abs.antilordosis`) |
| teixeira-2022 | https://pmc.ncbi.nlm.nih.gov/articles/PMC9362894 | 3 — rollout tylko w Discussion (powołanie na wcześniejsze badanie), aktywność najszerszego w rolloucie nie mierzona w tej pracy | Discussion |
| barbend-mb-slams | https://barbend.com/medicine-ball-slams | 4 — artykuł o technice, autor CSCS, data (BarBend warunkowo 4) | Muscles Worked (Lats, Abs) |
| fitnessvolt-mb-slam | https://fitnessvolt.com/medicine-ball-slam-guide/ | nie 4 — autor student, bez certyfikatu, bez recenzenta | — nie liczy się |
| Martinelli i in. 2008 (UNESP) | https://repositorio.unesp.br/items/4314d6d5-342a-4b0f-9f44-4399e955a85b/full | 3 — streszczenie: „aid the stabilization of the pelvis”, bez opisu oporu przed lordozą | nie użyte |

## Pytania dla koordynatora

1. `abs.antilordosis` → `dwa_zrodla`: zatwierdzić (rozstrzyga sprzeczność g1 vs g5/W2-pchanie; dotyczy wszystkich 9 par reguły `core_anti_ext`, także Plank i rolloutów z `pushup_plank`).
2. Bird Dog lower_back main — `lower_back.spine_ext` mówi „Prostuje plecy i trzyma je prosto”; w bird dogu plecy są tylko utrzymywane. Uznać za pasujące (druga połowa zdania) czy zostawić uproszczenie bez tekstu? Bird Dog ma role i bez tej pary.
3. Medicine Ball Slam — rola wymaga najpierw decyzji katalogowej (partie w wierszu biblioteki; dziś celowo puste, L6). Nawet po niej: lats/abs po jednym źródle szczebla 4 (BarBend). Opcje: (A) zostawić Slam bez ról w 1.1 i zgłosić właścicielowi jako wyjątek listy obowiązkowej; (B) zlecić drugie źródło (ACE/NSCA/badanie EMG slamu) i zmianę katalogu. Rekomendacja: B tylko gdy znajdzie się drugie źródło — inaczej A.

## Stan

- Zrobione: 5 ćwiczeń; 4 z rolami gotowymi do integracji (Dead Bug, Hollow Hold przez status funkcji; Bird Dog — 2 pary; Ab Wheel — abs + lats), Medicine Ball Slam otwarte.
- Pułapki: próg wiersza roli to 0,5, nie 0,25 (komentarz w `lib/muscleRoles.ts:27` jest mylący — wartość w `lib/figures/v2/muscles.ts:15`); Fitness Volt — każdą stronę sprawdzać osobno.

## Kontynuacja (02.11.2026, drugi badacz) — Medicine Ball Slam: drugie źródło dla ról

Zadanie: drugie źródło szczebla ≤ 4 dla par lats aux (`lats.shoulder_ext_add`, „Pomaga ściągać ramię w dół i do tyłu”, `data/zrodla/role-miesni.json:446–452`) i abs aux (`abs.trunk_flex`, „Pomaga zginać tułów”, `data/zrodla/role-miesni.json:246–252`). Blokada katalogu (puste partie, `lib/seed.ts:157`) i decyzja zakresu dla właściciela (docs/18, 02.11.2026, grupa mieszane, pkt 5) — bez zmian; poniżej tylko źródła.

| para | nowe źródło (miejsce, szczebel) | inne przeczytane | status proponowany |
|---|---|---|---|
| Medicine Ball Slam, lats, aux → `lats.shoulder_ext_add` | **tsartsapakis-2025** (szczebel 3 — artykuł w recenzowanym czasopiśmie, ale **protokół badania**: twierdzenie w opisie ćwiczenia/tle, nie wynik pomiaru; najszerszego nie mierzono EMG), sekcja 3.3: „The deltoids, triceps, and latissimus dorsi play a significant role in the overhead phase,” — „contributing to arm extension and controlled force application” | ISSA (MB slams, 05.02.2024): tylko „several back muscles”, bez najszerszego i bez funkcji — nie liczy się; ACE 182 Overhead Slams: tylko „Back” w częściach ciała — nie liczy się; Healthline (rec. M. Lal, CSCS, 08.12.2025): „upper back”, bez najszerszego — nie liczy się | **dwa źródła — warunkowo** (barbend-mb-slams 4 + tsartsapakis-2025 3), jeśli koordynator uzna zdanie z tła protokołu za źródło (precedens wagi: S32-g1 — zdanie w tle przeglądu liczone jako pojedyncza publikacja) |
| Medicine Ball Slam, abs, aux → `abs.trunk_flex` | **tsartsapakis-2025**, sekcja 3.3: „The RA, obliques, and TrA collectively facilitate spinal flexion, rotational control” (fragment zdania; opis slamu, nie wynik — mierzono tylko aktywność RA, skośnego zewnętrznego i biodrowo-żebrowego) | Healthline: „abdominals” wśród mięśni, polecenie „Clenching your core tightly, throw the ball down” (napięcie, nie zgięcie tułowia — nie potwierdza funkcji); **ACE 182** opisuje inną wersję (piłka między nogi, „Maintain a flat back by bending forward at the hips”, brzuch „bracing” — usztywnienie, nie zgięcie) → kierunkowo **inna funkcja** dla tej wersji; recenzent oceni, czy to „przeczy” | **dwa źródła — warunkowo** (barbend-mb-slams 4 + tsartsapakis-2025 3), z tym samym warunkiem; uwaga o ACE 182 do recenzenta. Alternatywa przy sprzeciwie recenzenta: `abs.antilordosis`-podobne usztywnienie — bez pary źródeł dla slamu (ACE + Healthline mówią o napięciu, nie o funkcji mięśnia) → otwarte |

Blok (dopisz po decyzji katalogowej i K-MBS niżej):

```json
{
  "_tryb": "dopisz",
  "nameRules": [
    { "muscle": "lats", "roles": ["aux"], "function": "lats.shoulder_ext_add", "exercises": ["Medicine Ball Slam"],
      "uwaga": "obowiązkowe 1.1, kontynuacja 02.11.2026: BarBend (ramię ściągane w dół przed ciałem) + Tsartsapakis i in. 2025, sekcja 3.3 (najszerszy — wyprost ramienia w fazie nad głową; zdanie z opisu protokołu)" },
    { "muscle": "abs", "roles": ["aux"], "function": "abs.trunk_flex", "exercises": ["Medicine Ball Slam"],
      "uwaga": "BarBend (brzuch wytwarza siłę w dół) + Tsartsapakis i in. 2025, sekcja 3.3 (RA, skośne — zgięcie tułowia); ACE 182 — wersja z płaskimi plecami, do recenzenta" }
  ],
  "sources": [
    { "id": "tsartsapakis-2025", "tier": 3,
      "cite": "Tsartsapakis I, Zafeiroudi A, Trigonis I, Lyrtzis C, Astrapellos K. Development and Implementation of a Core Training Protocol… Methods Protoc. 2025;8(4):77. doi:10.3390/mps8040077",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/", "miejsce": "3.3 Validation and Muscle Activation in the Medicine Ball Overhead Slam (opis; protokół bez wyników)",
      "cytaty": ["„The deltoids, triceps, and latissimus dorsi play a significant role in the overhead phase,” (fragment zdania)"] }
  ]
}
```

Źródła tej kontynuacji (odczyt 02.11.2026):

| id | adres | szczebel | miejsce |
|---|---|---|---|
| tsartsapakis-2025 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12286126/ | 3 — czasopismo z recenzją (daty przyjęcia/poprawek), ale protokół bez wyników; twierdzenia o mięśniach w opisie ćwiczenia (sekcja 3.3), nie w pomiarze. Przeczytane pierwsze 100 000 znaków strony (sekcja 3.3 w tej części) | 3.3 |
| issa-mb-slams | https://www.issaonline.com/blog/post/medicine-ball-slams-form-function-and-variations | 4 (By ISSA, 05.02.2024) | „…including the legs, glutes, abs, shoulders, arms, and several back muscles.” — bez najszerszego, bez funkcji |
| ace-182 | https://www.acefitness.org/resources/everyone/exercise-library/182/overhead-slams/ | 4 | Target Body Part (Back, Shoulders…); Step 2: „Maintain a flat back by bending forward at the hips” |
| healthline-slam-ball | https://www.healthline.com/health/fitness-exercise/slam-ball-exercises | 4 (J. Salyer; rec. M. Lal, MA, CSCS; akt. 08.12.2025) | mięśnie: „hamstrings, quadriceps, glutes, shoulders, upper back, and abdominals” |

Pytanie K-MBS dla koordynatora: czy zdanie z opisu ćwiczenia w artykule-protokole (szczebel 3, bez pomiaru najszerszego) liczy się jako drugie źródło roli? Jeśli tak — obie pary Medicine Ball Slam „dwa źródła” (po decyzji katalogowej właściciela, docs/18 pkt 5: opcja B z rekomendacji wyżej staje się wykonalna od strony źródeł). Jeśli nie — zostaje opcja A (Slam bez ról w 1.1).
