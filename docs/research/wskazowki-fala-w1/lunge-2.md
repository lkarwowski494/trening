# Wskazówki techniki — fala W1, rodzina „lunge”, część 2

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`. Kontynuacja
`docs/research/wskazowki-fala-w1/lunge.md` (gałąź agenta ade38c73; dalej „część 1”). Format, zasady i pułapki jak w części 1.

## Metoda i zakres

- Zadanie: 6 niezbadanych ćwiczeń (Slider Reverse Lunge, Lunge Pass Through, Single Leg Press, Single-Leg High Box Squat, Smith Machine Pistol Squat,
  Crossover Reverse Lunge), potem ćwiczenia otwarte z jednym źródłem z części 1 i drugie źródło dla Smith Machine Bulgarian Split Squat (O-3).
- Zasada: wyjątek dla wskazówek techniki (CLAUDE.md) — każde zdanie ≥ 2 przeczytane źródła szczebla 4 z RÓŻNYCH organizacji; wariant sprzętowy tego samego
  ćwiczenia z dopiskiem „(wariant: …)”, inne ćwiczenie = analogia (nie liczy się). free-exercise-db = jedno źródło (ACG-010); czytany tylko, żeby ustalić,
  jakie ćwiczenie kryje się pod kluczem katalogu.
- Odrzucone jako źródła: strony aplikacji treningowych (w tej partii: serwis przemianowany z organizacji szkoleniowej na aplikację z licznikiem powtórzeń —
  strona sama to mówi; platforma ćwiczeń dla fizjoterapeutów będąca aplikacją; agregatory ćwiczeń i „AI-generated” strony). Nazw nie wpisuję (repo publiczne).
- Dostęp: ExRx — 403 (bez zmian), Monash Cossack-Squat.pdf — 403, MacEwan University (sport and wellness) — 410, EliteFTS (indeks ćwiczeń) — 404,
  ummhealth.org — 403, NASM pod adresami `resource-center/exercise-library/{cossack-squat, curtsy-lunges, smith-machine-bulgarian-split-squat}` — 404,
  Eleiko `resource/lunge` (strona zbiorcza) — 500.

## 1. Tabela ćwiczeń (stan po części 2)

| Klucz | Stan | Powód / uwagi |
|---|---|---|
| Single Leg Press | **gotowe (bez ustawienia), warunkowo** | 2 nowe zdania `lp1.move`, `lp1.knee` — NASM (Single-Leg Press) + PhysioRehab (K3 Single Leg Press; klinika fizjoterapii — organizacja do akceptacji, O2-1). Ustawienie (`lp.setup` ma liczbę mnogą „stopy”) — tylko NASM → otwarte (O2-2) |
| Smith Machine Bulgarian Split Squat | **uzupełnienie O-3, warunkowo** | nowe zdanie `smithbss.setup` (ławka ok. krok za sztangą, przednia stopa trochę przed sztangą) — dwa blogi firm sprzętowych (RitFit, Dynamo Fitness); organizacje do akceptacji (O2-3). Ułożenie sztangi na górze pleców — tylko RitFit → nie wpisane |
| Split Squat | **uzupełnienie O-1** | `lunge.knee` dochodzi: NSCA PTQ 4.4 (Boyd, Milton) + canfitpro (wariant: przysiad w rozkroku z linką) + WebMD Ignite (wariant: wykrok). `split.setup` ma teraz trzecie niezależne źródło (NSCA PTQ) i nie zależy od WebMD Ignite (O-6). `lunge.mis.kneeIn` — NSCA wprost, reszta pośrednio → nie wpisane |
| Lunges (sztanga), Barbell Walking Lunge | **uzupełnienie O-6** | `lunge.knee` i `lunge.mis.kneeIn` mają drugie źródło niezależne od WebMD Ignite: NSCA PTQ (Table 1, „Knee Caves Inward”; wykrok z ciężarem — Table 3). Odrzucenie WebMD Ignite przez audytora nie usuwa już tych zdań z kart |
| Curtsy Lunge | otwarte (jedno źródło) | canfitpro (Crossover Lunge to Curtsey Lunge) — przeczytane, opis wprost. Druga organizacja: tylko The Prehab Guys (wariant ze ślizgaczem; O2-4). ACE #82 to wykrok skrzyżny W PRZÓD z taśmami podwieszanymi — inne ćwiczenie, nie liczy się |
| Crossover Reverse Lunge | otwarte (jedno źródło) | wg free-exercise-db to krok w tył ZA nogę podporową = to samo co Curtsy Lunge (aliasy w źródłach); stan jak Curtsy Lunge. O-8 z części 1 (`f: "mobility"`) bez zmian |
| Slider Reverse Lunge | otwarte | jedyne opisy z organizacji: The Prehab Guys (Posterior Lunge – Slider, przeczytane) i ACE blog „Challenge Your Entire Body With Sliders” (jedno zdanie bez techniki: „Using one slider under the moving foot, perform reverse and lateral lunge variations.”) — za mało |
| Lunge Pass Through | otwarte | brak źródła szczebla 4: jedyny opis z instrukcją był na stronie aplikacji (odrzucone); reszta — agregatory i magazyny |
| Single-Leg High Box Squat | otwarte — **niejasna definicja** | free-exercise-db (źródło klucza katalogu) opisuje WEJŚCIE na wysoką skrzynię z taśmą/liną do równowagi („step onto the box to a full standing position”), a nazwa i źródła (The Prehab Guys „Single Leg Box Squat”, Sussex Sport „Pistol Squat”) — przysiad na jednej nodze do skrzyni albo na skrzyni. Najpierw decyzja analityka, co to za ćwiczenie (O2-5) |
| Smith Machine Pistol Squat | otwarte | dwa blogi firm sprzętowych (RitFit, Major Fitness) zgodne tylko co do „druga noga wyprostowana w przód nad podłogą”; RitFit powtarza liczbę z free-exercise-db („about 12 inches in front of the bar”) — możliwe przejęcie, niezależność wątpliwa; głębokość sprzeczna („at least parallel” vs „adjusted based on your level of comfort”) (O2-6) |
| Cossack Squat | otwarte (jedno źródło) | dalej tylko Catalyst; Monash 403; ACE/NASM/Eleiko/canfitpro — brak strony |
| Barbell Side Split Squat | otwarte (jedno źródło) | dalej tylko Catalyst; nie znaleziono drugiej organizacji |
| Suspended Split Squat | otwarte (jedno źródło) | dalej tylko ACE #93; ExRx (ma stronę) — 403; reszta wyników to aplikacje |
| Elevated Back Lunge | otwarte | wykrok w tył z podwyższenia — żadnej organizacji szczebla 4 (tylko magazyny i aplikacje) |
| Split Squat (linki) | otwarte | Eleiko „Split Squat, Front – Dual Cable, Straight Bar” (nieprzeczytane w całości — tylko fragment w wyszukiwarce); canfitpro „Cable Horizontal Split Squat” to inny ruch (przesunięcie w poziomie, nie w dół) |

## 2. Blok JSON do `data/zrodla/cues.json`

Nowe i zmienione wpisy ćwiczeń (dopisać do bloku z części 1; `Split Squat`, `Lunges (sztanga)`, `Barbell Walking Lunge` — uzupełnić listy `s`):

```json
{
  "Single Leg Press": {
    "setup": [],
    "move": [
      {"c": "lp1.move", "s": [["nasm-single-leg-press", "Step 3–4 (press the platform forward by extending your leg; lower the platform back with control)"], ["physiorehab-k3", "Instructions (slowly lower using ONE leg; push the plate away)"]]}
    ],
    "tips": [
      {"c": "lp1.knee", "s": [["physiorehab-k3", "Special Notes (keep knee out over the middle of your foot)"], ["nasm-single-leg-press", "Common Mistakes (knee caving inward)"]]}
    ],
    "mistakes": []
  },
  "Smith Machine Bulgarian Split Squat": {
    "setup": [
      {"c": "smithbss.setup", "s": [["ritfit-smith-bss", "Bench Position; Front Foot (one large stride behind the bar; front foot under the bar or slightly forward)"], ["dynamo-smith-bss", "instrukcja (bench a step's distance away; one foot slightly in front of the bar)"]]},
      {"c": "bss.setup", "s": [["ace-366", "opis (wariant: hantle)"], ["eleiko-6581e6ea", "Starting Position (wariant: 1 hantla)"]]}
    ]
  },
  "Split Squat": {
    "setup": [
      {"c": "split.setup", "s": [["eleiko-6581e00b", "Starting Position"], ["nsca-ptq-lunge", "Starting Position (one foot in front, one behind; back heel off the ground); Table 2 Completely Stationary"], ["catalyst-174", "opis (split stance)"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["catalyst-174", "opis"], ["eleiko-6581e00b", "Procedure; Coaching Key"]]},
      {"c": "lunge.knee", "s": [["nsca-ptq-lunge", "Table 1 Knee Caves Inward — Solution (toes and knees of the same leg point in the same direction; „in all cases of the lunge”)"], ["canfitpro-cable-split", "opis (knee towards the second toe; wariant: z linką)"], ["webmd-ignite-lunge", "lista wskazówek (wariant: wykrok)"]]}
    ]
  },
  "Lunges (sztanga)": {
    "tips": [
      {"c": "lunge.knee", "s": [["eleiko-65848315", "Coaching Key"], ["nsca-ptq-lunge", "Table 1 Knee Caves Inward — Solution; Table 3 Add Resistance (barbell)"], ["webmd-ignite-lunge", "lista wskazówek"]]}
    ],
    "mistakes": [
      {"c": "lunge.mis.kneeIn", "s": [["eleiko-65848315", "Coaching Key"], ["nsca-ptq-lunge", "Table 1 Over-Pronation of the Foot/Knee Caves Inward"]]}
    ]
  },
  "Barbell Walking Lunge": {
    "tips": [
      {"c": "lunge.knee", "s": [["eleiko-65848315", "Coaching Key (wariant)"], ["nsca-ptq-lunge", "Table 1 (wariant: wykrok; Table 3 Make it Mobile — walking lunges)"]]}
    ],
    "mistakes": [
      {"c": "lunge.mis.kneeIn", "s": [["eleiko-65848315", "Coaching Key (wariant)"], ["nsca-ptq-lunge", "Table 1 Knee Caves Inward (wariant)"]]}
    ]
  }
}
```

Uwaga dla wdrażającego: `Single Leg Press` ma pusty `setup` — jak przy Lateral Lunge: jeśli generator wymaga ustawienia, ćwiczenie zostaje w zestawie ogólnym do
rozstrzygnięcia O2-2. Wpisy `Single Leg Press` i `smithbss.setup` wchodzą tylko po akceptacji organizacji (O2-1, O2-3); bez niej — usunąć.

Nowe źródła (do `sources`):

```json
{
  "nasm-single-leg-press": {"org": "NASM", "title": "Single-Leg Press (exercise library)", "url": "https://www.nasm.org/resource-center/exercise-library/single-leg-press", "level": 4},
  "physiorehab-k3": {"org": "PhysioRehab (klinika fizjoterapii, Australia)", "title": "K3 | Single Leg Press (rehab exercise library)", "url": "https://physiorehab-com.treepl.co/rehab-exercise-library/k3-single-leg-press", "level": 4},
  "nsca-ptq-lunge": {"org": "NSCA", "title": "Boyd J, Milton K: The Undervalued Lunge, NSCA Personal Training Quarterly 4(4):44–48", "url": "https://www.nsca.com/contentassets/24dd7222ed1b4caeb8a0a46b81bd11f3/ptq-4.4.9-the-undervalued-lunge.pdf", "level": 4},
  "canfitpro-cable-split": {"org": "canfitpro", "title": "Movement of the Month: Cable Horizontal Split Squat", "url": "https://www.canfitpro.com/blog/mom-cable-horizontal-split-squat/", "level": 4},
  "canfitpro-curtsey": {"org": "canfitpro", "title": "Movement of the Month: Crossover Lunge to Curtsey Lunge", "url": "https://www.canfitpro.com/blog/mom-crossover-lunge-to-curtsey-lunge/", "level": 4},
  "ritfit-smith-bss": {"org": "RitFit (producent sprzętu)", "title": "How to Do Smith Machine Bulgarian Split Squats Correctly", "url": "https://www.ritfitsports.com/blogs/article/how-to-do-smith-machine-bulgarian-split-squats-correctly", "level": 4},
  "dynamo-smith-bss": {"org": "Dynamo Fitness (sprzedawca sprzętu)", "title": "Smith Machine Bulgarian Split Squat (exercise videos)", "url": "https://blog.dynamofitness.com.au/?p=2962", "level": 4}
}
```

`canfitpro-curtsey` — do `sources` dopiero, gdy Curtsy Lunge dostanie drugie źródło (teraz tylko w rejestrze badań). Nowe organizacje do `orgs`:
„canfitpro” — kanadyjska organizacja certyfikująca trenerów, szczebel 4, `kind: "site"`; „PhysioRehab”, „RitFit”, „Dynamo Fitness” — PROPOZYCJA (O2-1, O2-3).
NSCA i NASM już są. Sprawdzić `tests/forbidden-names.json`: żadna z nowych nazw nie jest na liście (stan 02.11.2026).

## 3. Nowe zdania PL (+ proponowane EN)

| Id | PL | EN (propozycja) | Źródła (różne organizacje) |
|---|---|---|---|
| `lp1.move` | Wypchnij platformę jedną nogą, prostując ją; opuść powoli. | Press the platform away with one leg until it's straight; lower it slowly. | NASM Single-Leg Press (Step 3: „Press the platform forward by extending your leg”; Step 4 „with control”), PhysioRehab K3 („Slowly lower your body down using ONE leg.”) |
| `lp1.knee` | Kolano nad środkiem stopy — nie ucieka do środka. | Knee over the middle of your foot — don't let it cave in. | PhysioRehab K3 („Keep knee out over the middle of your foot throughout both parts of the movement.”), NASM Single-Leg Press (Common Mistakes: „Allowing the knee to cave inward (valgus)”) |
| `smithbss.setup` | Ustaw ławkę mniej więcej krok za sztangą; przednią stopę postaw trochę przed sztangą. | Set the bench about a stride behind the bar; front foot slightly ahead of the bar. | RitFit (Bench Position: „around one large stride length behind the bar”; Front Foot: „under the bar or slightly forward”), Dynamo Fitness („Place a bench a step's distance away from the smith machine bar”; „one foot flat on the floor, slightly in front of the bar”) |

Nie wpisane z premedytacją: z `lp1.move` pominięto „bez blokowania kolana” (PhysioRehab ogranicza to do osób z nadmierną ruchomością — „if you are hypermobile”;
NASM wprost) i głębokość (NASM: ok. 90°, PhysioRehab: „only as far as you are comfortable”). Z Dynamo i RitFit — zdania „kolano nie przed palce” (sprzeczne
z `sq.kneesPast`, pułapka z części 1). Z NSCA PTQ — „front knee directly above the ankle and not over the toe” (jw.).

Istniejące zdania użyte bez zmian: `split.setup`, `lunge.torso`, `lunge.knee`, `lunge.mis.kneeIn`, `bss.setup`.

## 4. Źródła (przeczytane 02.11.2026, WebFetch; PDF — pełny tekst)

| Id | Adres | Organizacja | Szczebel | Miejsce / co potwierdza |
|---|---|---|---|---|
| nasm-single-leg-press | (sekcja 2) | NASM | 4 | Step 1–4, Common Mistakes: plecy i głowa na oparciu; jedna stopa na platformie, kolano ok. 90°; wypchnięcie bez blokowania kolana; opuszczanie z kontrolą; błędy: kolano do środka, blokowanie, zejście poniżej 90° |
| physiorehab-k3 | (sekcja 2) | PhysioRehab (Australia; strona prowadzi do kliniki w Bondi Junction) | 4 PROPOZYCJA | Instructions, Special Notes: opuszczanie jedną nogą, „push the plate away”, kolano nad środkiem stopy, miednica równo |
| nsca-ptq-lunge | (sekcja 2) | NSCA (artykuł w PTQ; autorki: Winthrop University) | 4 | s. 44–45 Starting Position: stopy jedna przed, druga za tułowiem, tylna pięta w górze, tułów wyprostowany; Table 1: kolano do środka — błąd, „the toes and knees (of the same leg) should point in the same direction”; Table 2: wersja w miejscu („Completely Stationary”); Table 3: chodzony wykrok, obciążenie sztangą |
| canfitpro-cable-split | (sekcja 2) | canfitpro | 4 | rozkrok, tylna noga „on your toes”; „taking your right knee towards the second toe” (wariant z linką, ruch w poziomie) |
| canfitpro-curtsey | (sekcja 2) | canfitpro | 4 | „take your right leg and cross it in behind your torso and come down into a lunge”; tall spine; tylna pięta odrywa się, kontakt przez palce |
| ritfit-smith-bss | (sekcja 2) | RitFit — marka sprzętu do domowej siłowni (zespół redakcyjny) | 4 PROPOZYCJA | Bar Position: „rest it across your upper traps”; Bench Position; Front Foot; Rear Foot („top of your rear foot … or use the ball of the foot”); Torso „chest up and spine neutral” |
| dynamo-smith-bss | (sekcja 2) | Dynamo Fitness — australijski sprzedawca sprzętu z własną ofertą maszyn Smitha | 4 PROPOZYCJA | ławka „a step's distance away”, sztanga na wysokości barków, przednia stopa „slightly in front of the bar”, tylna na ławce |
| prehab-posterior-slider, prehab-curtsey-slider, prehab-sl-box-squat | https://theprehabguys.com/vimeo-video/posterior-lunge-slider/ ; …/curtsey-lunge-slider/ ; …/single-leg-box-squat/ | The Prehab Guys, Inc. (fizjoterapeuci) | 4? PROPOZYCJA | HOW / COMPENSATION: ślizgacz pod nogą, która się przesuwa, praca nogi stojącej, „Pretend there is an eggshell under your foot.”; przysiad do skrzyni — „the taller it is the easier”, „Avoid letting the knee cave in” — nieużyte (O2-4) |
| sussex-pistol | https://www.sussex.ac.uk/sport/documents/9-pistol-squat.pdf | University of Sussex — Sussex Sport | 4 | Teaching Points: stanie na skrzyni/ławce ok. wysokości kolana, zejście do równoległego uda; Look out for: kolana do środka/na zewnątrz, odrywanie pięt — nieużyte (O2-5) |
| ritfit-pistol, majorfitness-pistol | https://www.ritfitsports.com/blogs/article/pistol-squats-smith-machine ; https://www.majorfitness.com/blogs/wiki/pistol-squats-on-smith-machine-works-what-muscles-and-how | RitFit; Major Fitness (producenci sprzętu) | 4 PROPOZYCJA | wolna noga wyprostowana w przód nad podłogą (oba); reszta rozbieżna — nieużyte (O2-6) |
| ace-82 | https://www.acefitness.org/resources/everyone/exercise-library/82/ | ACE | 4 | wykrok skrzyżny w przód z taśmami podwieszanymi („step your right leg across to the left”) — inne ćwiczenie niż Curtsy Lunge, nieużyte |
| ace-blog-sliders | https://www.acefitness.org/resources/everyone/blog/4843/challenge-your-entire-body-with-sliders/ | ACE | 4 | sekcja „Lunge Variations” — jedno zdanie bez techniki, nieużyte |

Przeczytane, nieużyte także: WebMD Ignite „Leg and Knee Exercises: Leg Press” (healthlibrary.ecuhealth.org — tylko wersja obunóż), free-exercise-db
(Single-Leg High Box Squat, Smith Machine Pistol Squat — tylko do ustalenia definicji).

## 5. Otwarte

- **O2-1 PhysioRehab jako organizacja** — klinika fizjoterapii z publiczną biblioteką ćwiczeń (szczebel 4? jak HSS, ale mniejsza i bez recenzji). Bez akceptacji
  audytora `Single Leg Press` wraca do otwartych (NASM = jedno źródło).
- **O2-2 Ustawienie w Single Leg Press** — tylko NASM (plecy i głowa na oparciu, jedna stopa, kolano ok. 90°). `lp.setup` ma liczbę mnogą — do karty jednonóż nie pasuje.
  Potrzebne drugie źródło dla wersji jednonóż; też `lp.noLock` (PhysioRehab warunkowo) i głębokość (sprzeczne).
- **O2-3 Blogi firm sprzętowych (RitFit, Dynamo Fitness, Major Fitness)** — formalnie „dokumentacja producentów sprzętu” (szczebel 4), w praktyce artykuły
  marketingowe; Dynamo to głównie sprzedawca. Decyzja audytora, czy je przyjąć; bez nich `smithbss.setup` odpada, a O-3 zostaje otwarte.
- **O2-4 The Prehab Guys** — treści fizjoterapeutów, ale niesprawdzone, czy biblioteka nie jest dokumentacją ich aplikacji (wtedy nie jest źródłem, zasada
  koordynatora). Po akceptacji: drugie źródło dla Curtsy Lunge i Crossover Reverse Lunge (wariant: ślizgacz) — nowe zdanie ruchu z canfitpro; Slider Reverse Lunge nadal tylko jedno.
- **O2-5 Single-Leg High Box Squat — definicja** — klucz z free-exercise-db opisuje wejście na skrzynię z taśmą do równowagi, nazwa sugeruje przysiad do skrzyni.
  Pytanie do analityka produktu (nie merytoryczne): które ćwiczenie pokazuje figura i karta? Dopiero potem szukanie źródeł.
- **O2-6 Smith Machine Pistol Squat** — źródła słabe i możliwie zależne od free-exercise-db; zostaje na zestawie ogólnym. Uwaga: zdanie zestawu ogólnego `pistol.move`
  („tak nisko, jak kontrolujesz ruch”) nie jest sprzeczne z Major Fitness, ale RitFit mówi „at least parallel” — nie potwierdzone dla wariantu.
- **O2-7 Bez zmian z części 1** — Cossack Squat, Barbell Side Split Squat (tylko Catalyst), Suspended Split Squat (tylko ACE #93), Elevated Back Lunge, Split Squat (linki),
  Lunge Pass Through, Slider Reverse Lunge; O-1 dla BSS (sztanga/Smith), Barbell Step Up, Lateral Lunge; O-4, O-5, O-8.
- **O2-8 Dostęp** — po odzyskaniu ExRx (Suspended Split Squat ma tam stronę) i Monash (Cossack Squat) sprawdzić w pierwszej kolejności.

## Stan

- Zrobione: Single Leg Press (warunkowo, 2 nowe zdania), Smith Machine BSS — ustawienie względem sztangi (warunkowo, 1 nowe zdanie), Split Squat — kolano (O-1 częściowo),
  Lunges (sztanga) / Barbell Walking Lunge — kolano niezależne od WebMD Ignite (O-6 częściowo); 7 nowych źródeł.
- Zostało: O2-1…O2-8.
- Następny krok: decyzja audytora o organizacjach (PhysioRehab, blogi firm sprzętowych, The Prehab Guys); decyzja analityka o definicji Single-Leg High Box Squat;
  pełne przeczytanie Eleiko „Split Squat, Front – Dual Cable, Straight Bar” (6581db4f…) i szukanie drugiej organizacji dla wersji z linką.
- Pułapki: PDF przez WebFetch nie daje tekstu — czytać zapisany plik narzędziem Read (PDF z obrazami zużywa dużo kontekstu); część stron „organizacji szkoleniowych”
  przeszła w aplikacje — sprawdzać stopkę i opis strony; blogi firm sprzętowych powtarzają liczby z free-exercise-db („12 inches”) — sprawdzać niezależność.
