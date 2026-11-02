# Wskazówki techniki — fala W1, rodzina `delt_raise`, część 2

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`. Kontynuacja
`docs/research/wskazowki-fala-w1/delt_raise.md` (część 1, worktree agent-aaa720089206e1a61); format, zasady i metoda bez zmian.

Rozstrzygnięcie koordynatora (02.11.2026): free-exercise-db (fedb) = jedno źródło szczebla 4 (precedens ACG-010,
`docs/research/acg-010-015-technika-2026-10-31.md:4`); drugie źródło musi być od niego niezależne. Strony z opisami w serwisie, z którego
pochodzi fedb, nie są niezależne od fedb — pominięte. Dokumentacja i strony innych aplikacji treningowych nie są źródłem (pominięte, nie zapisane).
Producenci sprzętu — dozwoleni jak dotąd (szczebel 4, „dokumentacja producentów sprzętu”).

Wszystkie źródła przeczytane przez WebFetch 02.11.2026. fedb zwraca przez narzędzie parafrazy `instructions[i]` — miejsce podane indeksem.

## 1. Ćwiczenia — stan po części 2

| Klucz | Stan | Powód / uwagi |
|---|---|---|
| Kettlebell Halo | **gotowe** | fedb „Kettlebell Halo” + ACE #394 „Halo” — dwie różne organizacje |
| Band Lateral Raise | **gotowe** | fedb „Lateral Raise - With Bands” + producent taśm (Bodylastics, „Lateral Raise With Flat Bands”) |
| One-Arm Incline Lateral Raise | **gotowe (warunkowo)** | fedb „One-Arm Incline Lateral Raise” + NFPT (organizacja certyfikująca trenerów; nowa w `orgs` — szczebel 4 do uznania, otwarte 1) |
| Kettlebell Halo with Overhead Extension | otwarte | brak pliku w fedb pod tą nazwą (404 `Kettlebell_Halo_with_Overhead_Extension.json`); ACE #394 opisuje samo halo, bez prostowania nad głową — brak definicji ruchu w przeczytanym źródle |
| Barbell Front Raise to Overhead, Dumbbell Front Raise to Overhead | otwarte | fedb „Standing Front Barbell Raise Over Head” przeczytane; ACE, NASM, Catalyst — brak wersji „nad głowę” (Catalyst #823 to zwykłe unoszenie w przód); pozostałe trafienia to aplikacje lub serwis źródłowy fedb |
| Front Incline Dumbbell Raise | otwarte | fedb przeczytane (ławka 30–60°, unoszenie tuż nad barki); drugie źródło szczebla 4 nieznalezione (trafienia: serwis źródłowy fedb, aplikacje, serwisy o nieustalonym szczeblu) |
| Straight Raises on Incline Bench | otwarte | fedb przeczytane (leżenie przodem na skośnej ławce, sztanga prostymi rękami w przód za głowę); drugiego źródła nie znaleziono |
| Barbell / Dumbbell / Smith Incline Shoulder Raise | otwarte | fedb „Dumbbell Incline Shoulder Raise” przeczytane; ExRx (SMInclineShoulderRaise) 403; reszta trafień to aplikacje i serwisy „zamienników” |
| Car Drivers | otwarte | fedb „Car Drivers” przeczytane; ACE/NASM/Catalyst — brak; trafienia to blogi i aplikacje |
| Y Raise (hantle), Cable Y Raise | otwarte | ACE i NASM — brak strony; nadal tylko HSS „Prone scaption (Y’s)” z części 1; trafienia to aplikacje i siłownie sieciowe (szczebel nieustalony) |
| Machine Lateral Raise | otwarte | bez zmian — czeka na uznanie Western SRS (część 1, otwarte 4) |
| One-Arm Cable Rear Lateral Raise, Cable Seated Lateral Raise, Sled Reverse Flye | otwarte | bez zmian — jedno źródło (fedb); w tej sesji nie szukano dalej (limit kontekstu) |
| Upright row ×6 | otwarte | pominięte zgodnie z poleceniem (czeka na docs/33) |

Razem po obu częściach: **11 gotowych** (8 z części 1 + 3 tu, w tym 1 warunkowo), **27 otwartych**.

## 2. Blok JSON do `data/zrodla/cues.json` (tylko gotowe) — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "Kettlebell Halo": {
    "setup": [
      {"c": "halo.setup", "s": [["fedb-Kettlebell_Halo", "instructions[0] (hold by the horns, close to the chest)"], ["ace-394", "opis (hold a kettlebell by the horns, in front of the chest)"]]}
    ],
    "move": [
      {"c": "halo.move", "s": [["fedb-Kettlebell_Halo", "instructions[1]; instructions[2] (past one ear, behind the head, past the other ear, back to the chest)"], ["ace-394", "opis (over the right shoulder, around and behind the head, back over the left shoulder to the chest)"]]}
    ],
    "tips": [
      {"c": "halo.dir", "s": [["fedb-Kettlebell_Halo", "instructions[3] (same number in the other direction)"], ["ace-394", "opis (desired number of reps, then switch directions)"]]},
      {"c": "halo.torso", "s": [["fedb-Kettlebell_Halo", "instructions[4] (head, hips and lower back steady)"], ["ace-394", "opis (back straight)"]]}
    ],
    "mistakes": []
  },
  "Band Lateral Raise": {
    "setup": [
      {"c": "blat.setup", "s": [["fedb-Lateral_Raise_-_With_Bands", "instructions[0] (stand on the band; handles at thighs; elbows slightly bent)"], ["bodylastics-lateral-raise", "Set Up, Body Position (stand on the bands; arms at sides, slightly bent)"]]}
    ],
    "move": [
      {"c": "lat.move", "s": [["fedb-Lateral_Raise_-_With_Bands", "instructions[1]; instructions[2] (out to the sides; lower slowly)"], ["bodylastics-lateral-raise", "Movement (straight out to the sides; lower under control)"]]}
    ],
    "tips": [
      {"c": "lat.height", "s": [["fedb-Lateral_Raise_-_With_Bands", "instructions[1] (slightly above parallel)"], ["bodylastics-lateral-raise", "Movement (elbows at shoulder height)"]]}
    ],
    "mistakes": [
      {"c": "mis.jerk", "s": [["fedb-Lateral_Raise_-_With_Bands", "instructions[1]; instructions[2] (torso still; lower slowly)"], ["bodylastics-lateral-raise", "Movement (lower under control)"]]}
    ]
  },
  "One-Arm Incline Lateral Raise": {
    "setup": [
      {"c": "inc1.setup", "s": [["fedb-One-Arm_Incline_Lateral_Raise", "instructions[0]; instructions[1] (side-lying on incline bench; dumbbell in the upper hand, arm in front)"], ["nfpt-incline-side-lateral", "Starting Position (lie on the non-working side on an incline bench; arm in front of and close to the body)"]]}
    ],
    "move": [
      {"c": "inc1.move", "s": [["fedb-One-Arm_Incline_Lateral_Raise", "instructions[2]; instructions[3] (raise out to the side; lower back to start)"], ["nfpt-incline-side-lateral", "Movement (raise out from the side; lower back to the starting position)"]]}
    ],
    "tips": [
      {"c": "inc1.sides", "s": [["fedb-One-Arm_Incline_Lateral_Raise", "instructions[5] (switch sides)"], ["nfpt-incline-side-lateral", "Movement (all reps on one side before switching)"]]}
    ],
    "mistakes": []
  }
}
```

Celowo pominięte (tylko jedno źródło albo sprzeczność):
- Kettlebell Halo: łokcie blisko głowy, kettlebell dnem do góry, wolne tempo, „żebra w dół” — tylko fedb; szerokość stóp — fedb „na szerokość bioder”, ACE „na szerokość barków” → w tekście bez szerokości.
- Band Lateral Raise: `lat.elbows` (łokcie wyżej niż dłonie) — tylko Bodylastics; „lekko ugięte” jest w obu i weszło do `blat.setup`. Chwyt — fedb „dłonie w dół”, Bodylastics „dłonie do ciała” → bez chwytu. Wysokość — fedb „nieco powyżej poziomu”, Bodylastics „łokcie na wysokości barków” → istniejące „mniej więcej do wysokości barków”. `mis.jerk` na tym samym wzorcu co w części 1 (kontrola przy opuszczaniu + nieruchomy tułów).
- One-Arm Incline Lateral Raise: wysokość — fedb „aż ręka wskaże sufit”, NFPT „aż łokieć w linii z barkiem” → sprzeczność, tekst bez wysokości; tempo 2–3 s i „łokieć lekko ugięty, prowadzi ruch” — tylko NFPT (liczby tempa wymagają i tak zasad ogólnych, nie wyjątku techniki); kąt ławki — NFPT 55°, fedb bez kąta → pominięty.

## 3. Nowe zdania (PL + proponowane EN)

Istniejące użyte: `lat.move`, `lat.height`, `mis.jerk`.

| Id | PL | EN (propozycja dla tłumacza) | Źródła |
|---|---|---|---|
| `halo.setup` | Stań prosto i trzymaj kettlebell za rogi przed klatką piersiową. | Stand tall and hold the kettlebell by the horns in front of your chest. | fedb-Kettlebell_Halo; ace-394 |
| `halo.move` | Prowadź kettlebell wokół głowy: nad jednym barkiem, za głową, nad drugim barkiem i z powrotem przed klatkę. | Circle the kettlebell around your head: over one shoulder, behind your head, over the other shoulder and back to your chest. | fedb-Kettlebell_Halo; ace-394 |
| `halo.dir` | Zrób powtórzenia w jedną stronę, potem tyle samo w drugą. | Do your reps in one direction, then the same number the other way. | fedb-Kettlebell_Halo; ace-394 |
| `halo.torso` | Plecy proste, tułów nieruchomy przez cały ruch. | Keep your back straight and your torso still throughout. | fedb-Kettlebell_Halo; ace-394 |
| `blat.setup` | Stań na taśmie, uchwyty w dłoniach przy udach, łokcie lekko ugięte. | Stand on the band with the handles at your thighs, elbows slightly bent. | fedb-Lateral_Raise_-_With_Bands; bodylastics-lateral-raise |
| `inc1.setup` | Połóż się bokiem na skośnej ławce; hantel w górnej ręce, ręka wyciągnięta przed sobą. | Lie on your side on an incline bench; dumbbell in your top hand, arm reaching out in front of you. | fedb-One-Arm_Incline_Lateral_Raise; nfpt-incline-side-lateral |
| `inc1.move` | Unieś rękę bokiem w górę, potem opuść ją z powrotem przed siebie. | Raise your arm out to the side and up, then lower it back in front of you. | fedb-One-Arm_Incline_Lateral_Raise; nfpt-incline-side-lateral |
| `inc1.sides` | Zrób wszystkie powtórzenia jedną ręką, potem zmień stronę. | Finish all reps with one arm, then switch sides. | fedb-One-Arm_Incline_Lateral_Raise; nfpt-incline-side-lateral |

Każde nowe zdanie: 35 języków (tłumacz) + wpis w `docs/research/rejestr-twierdzen.json` (`node scripts/claims.mjs --stub`, potem `--rehash`).
Teksty bez nazw źródeł (zasada „źródła publicznie anonimowo”). „Halo” w fedb i ACE to rozgrzewka/mobilność — w tekstach brak twierdzeń o korzyściach i zdrowiu.

## 4. Źródła i organizacje (propozycja wpisów)

Nowe organizacje do `orgs`:

| Skrót (org) | Nazwa | Szczebel | kind | Uwagi |
|---|---|---|---|---|
| NFPT | National Federation of Professional Trainers — artykuły edukacyjne (nfpt.com) | 4 (PROPOZYCJA) | org | organizacja certyfikująca trenerów, jak ACE/NASM; artykuł podpisany „by Guest” (z notką o trenerze) — do uznania przez audytora, otwarte 1 |
| Bodylastics | Bodylastics — biblioteka ćwiczeń producenta taśm oporowych (bodylastics.com) | 4 | maker | dokumentacja producenta sprzętu (jak inni producenci w `orgs`) |

(free-exercise-db — wpis z części 1.)

Nowe źródła do `sources`:

| Id | Org | Tytuł / miejsce | URL |
|---|---|---|---|
| fedb-Kettlebell_Halo | free-exercise-db | Kettlebell Halo, `instructions[0–4]` | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Halo.json |
| ace-394 | ACE | Halo (#394), opis (jeden akapit kroków) | https://www.acefitness.org/resources/everyone/exercise-library/394/halo/ |
| fedb-Lateral_Raise_-_With_Bands | free-exercise-db | Lateral Raise - With Bands, `instructions[0–2]` | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lateral_Raise_-_With_Bands.json |
| bodylastics-lateral-raise | Bodylastics | Lateral Raise With Flat Bands — Set Up, Movement, Points To Remember | https://bodylastics.com/exercise/lateral-raise-with-flat-bands |
| fedb-One-Arm_Incline_Lateral_Raise | free-exercise-db | One-Arm Incline Lateral Raise, `instructions[0–5]` | https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/One-Arm_Incline_Lateral_Raise.json |
| nfpt-incline-side-lateral | NFPT | How to do Incline Side Lateral Dumbbell Raises (11.08.2025) — Starting Position, Movement, Warning Tips | https://nfpt.com/how-to-do-incline-side-lateral-dumbbell-raises/ |

Przeczytane, użyte tylko do oceny „otwarte” (do `sources` po znalezieniu drugiego źródła):
fedb `Standing_Front_Barbell_Raise_Over_Head.json`, `Front_Incline_Dumbbell_Raise.json`, `Straight_Raises_on_Incline_Bench.json`,
`Dumbbell_Incline_Shoulder_Raise.json`, `Car_Drivers.json` (ten sam katalog raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/).

Cytaty do weryfikacji (≤ 1 fraza na źródło; narzędzie podało je jako dosłowne):
- bodylastics-lateral-raise, Movement: „until your elbows are at shoulder height”; Set Up: „Stand on the bands”.
- nfpt-incline-side-lateral, Movement: „until your elbow is in line with your shoulder”.
- ace-394: narzędzie zwróciło parafrazę akapitu (kolejność: nad prawym barkiem → za głową → nad lewym barkiem do klatki; „switch directions”) — sprawdzić przy rehash.
- fedb-*: parafrazy `instructions[i]`.

## 5. Otwarte

1. **[OTWARTE] Szczebel NFPT** — organizacja certyfikująca trenerów (analogicznie do ACE/NASM w `orgs`), ale przeczytany artykuł jest gościnny („by Guest”).
   Bez uznania: One-Arm Incline Lateral Raise wraca do „jedno źródło”. Rozstrzyga audytor merytoryczny.
2. **[OTWARTE] Kettlebell Halo with Overhead Extension** — nie ma przeczytanego źródła, które opisuje ten wariant (fedb: brak pliku pod tą nazwą; pochodzenie
   nazwy w katalogu: `docs/research/25-biblioteka/L2.json:889`, „L2-S23”). Najpierw ustalić, z którego pliku fedb pochodzi wpis; zdania `halo.*` NIE przenosić
   na ten wariant bez źródła, bo dochodzi prostowanie łokci nad głową.
3. **[OTWARTE] Front Raise to Overhead (×2), Front Incline Dumbbell Raise, Straight Raises on Incline Bench, Incline Shoulder Raise (×3), Car Drivers,
   Y Raise (hantle), Cable Y Raise** — po jednym źródle (fedb albo HSS). ACE/NASM/NSCA/Catalyst nie mają tych ćwiczeń (wyszukiwanie 02.11.2026);
   trafienia z innych serwisów to aplikacje (nie są źródłem), serwis źródłowy fedb (niezależność) albo portale i siłownie sieciowe bez ustalonego szczebla.
   Możliwa droga: decyzja audytora, czy portale specjalistyczne o sile (redakcja z trenerami) i materiały sieci siłowni liczą się jako szczebel 4 — wtedy
   kolejna sesja może dokończyć te ćwiczenia. Bez tej decyzji pozostają bez zestawu wskazówek.
4. **[OTWARTE] One-Arm Cable Rear Lateral Raise, Cable Seated Lateral Raise, Sled Reverse Flye** — nie szukano w tej sesji drugiego źródła (limit kontekstu);
   ACE #354 (wyciąg jednorącz) opisuje wersję stojącą — dla wersji siedzącej to zmiana pozycji, nie sprzętu, więc nie liczy się jako wariant.
5. Z części 1 bez zmian: szczebel free-exercise-db/Catalyst w `orgs`, HSS PDF, upright row, Machine Lateral Raise (Western SRS), liczba mnoga `rear.elbows`.

## Stan (przekazanie)

- Zrobione: wszystkie ćwiczenia „nie badane” z części 1 sprawdzone (fedb przeczytane, drugie źródło szukane w ACE/NASM/NSCA/Catalyst i u producentów);
  3 nowe gotowe (Kettlebell Halo, Band Lateral Raise, One-Arm Incline Lateral Raise — ostatnie warunkowo), 8 nowych zdań, 6 nowych źródeł, 2 nowe organizacje.
- Zostało: otwarte 3 (zależy od decyzji o szczeblu portali), 4 (wyciąg siedząc / jednorącz tył, sanie), 2 (pochodzenie wpisu Halo + Extension).
- Pułapki: ExRx 403; strona producenta kettlebelli z wyników zwraca 402; wiele wyników to strony aplikacji — pomijać i nie zapisywać ich nazw;
  NFPT ma artykuły „How to do…” dla części ćwiczeń (wyszukiwanie `site:nfpt.com`) — warto sprawdzić dla otwartych 4.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `docs/research/szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie, uzupełnienia 2 i 3). Kryterium karty (decyzje 02.11.2026):
zdanie gotowe = ≥ 2 niezależne organizacje szczebla ≤ 4, przeczytane; karta własna = min. 1 zdanie ustawienia + 1 zdanie ruchu; „z błędami” = + min. 1 błąd;
bez ruchu albo bez ustawienia = otwarta. Plik powstał przed rozstrzygnięciem szczebli (nagłówek: „fedb = jedno źródło szczebla 4”) — po rozstrzygnięciu fedb = 5.
Przeliczenie części 1 i blok rodziny do wdrożenia: `delt_raise.md`, sekcja o tym samym tytule.

### Źródła → szczebel

| Źródło | Szczebel | Dowód / powód |
|---|---|---|
| free-exercise-db (fedb-*, 3 strony w bloku + 5 przeczytanych) | 5 | szczeble-organizacji, „Rozstrzygnięcia”, wiersz free-exercise-db |
| ACE (ace-394, Halo) | 4 | precedens ACE (kryterium pkt 1) |
| Bodylastics (bodylastics-lateral-raise) | 4 — tylko ćwiczenia z taśmami | szczeble-organizacji, „Rozstrzygnięcia”, wiersz Bodylastics; Band Lateral Raise jest ćwiczeniem z taśmą — liczy się |
| NFPT (nfpt-incline-side-lateral, „by Guest”, 11.08.2025) | 4 warunkowo — nie rozstrzygane | szczeble-organizacji, wiersz NFPT: liczy się artykuł z autorem, datą i kwalifikacjami w biogramie. Strony nie otwierano ponownie: nawet przy szczeblu 4 to jedyne źródło ≤ 4 dla karty, wynik się nie zmienia |

### Zdania → stan

| Karta | Zdanie | Źródła po przeliczeniu | Stan |
|---|---|---|---|
| Kettlebell Halo | `halo.setup`, `halo.move`, `halo.dir`, `halo.torso` | tylko ace-394 | spada (jedno źródło) |
| Band Lateral Raise | `blat.setup`, `lat.move`, `lat.height`, `mis.jerk` | tylko bodylastics-lateral-raise | spada |
| One-Arm Incline Lateral Raise | `inc1.setup`, `inc1.move`, `inc1.sides` | najwyżej nfpt-incline-side-lateral | spada |

### Karty → stan

| Karta | Stan |
|---|---|
| Kettlebell Halo | otwarta — jedno źródło szczebla 4 (ACE) po odjęciu fedb |
| Band Lateral Raise | otwarta — jedno źródło szczebla 4 (Bodylastics) |
| One-Arm Incline Lateral Raise | otwarta — najwyżej jedno źródło szczebla 4 (NFPT, warunkowo) |
| pozostałe z sekcji 1 (Halo + Extension, Front Raise to Overhead ×2, Front Incline Dumbbell Raise, Straight Raises on Incline Bench, Incline Shoulder Raise ×3, Car Drivers, Y Raise ×2, Machine Lateral Raise, wyciąg/sanie ×3, upright row ×6) | bez zmian: otwarte (fedb był jedynym źródłem albo brak źródła) |

Wszystkie trzy karty z bloku miały zdanie `move` — powodem „otwarta” jest brak drugiego źródła, nie brak ruchu.
Do fali W2: Halo i Band Lateral Raise mają po jednym źródle szczebla 4 — wystarczy drugie niezależne źródło (nie fedb, nie aplikacje).

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

Brak kart spełniających kryterium — nic do wklejenia z tego pliku (blok rodziny: `delt_raise.md`).

```json
{}
```
