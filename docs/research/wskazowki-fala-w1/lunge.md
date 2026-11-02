# Wskazówki techniki — fala W1, rodzina „lunge” (wykroki, przysiad bułgarski, wejścia na podwyższenie)

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`; wdrożenie robi koordynator/programista
(dane do `data/zrodla/cues.json`, teksty do `lib/cues/text/*.json`, wpisy w `docs/research/rejestr-twierdzen.json`), tłumaczenia — tłumacz, przegląd tekstów — recenzent-lokalizacji.

## Metoda i zakres

- Lista ćwiczeń: `familyOf()` w `lib/figures/v2/families.ts` (reguła `e.pattern === 'lunge_single_leg'` w `lib/catalog.generated.ts` + wyjątek `OVERRIDES['Crossover Reverse Lunge']`) — 25 ćwiczeń.
  Pominięte, bo mają już własną kartę w `data/zrodla/cues.json`: Bulgarian Split Squat (hantle), Lunges (hantle), Walking Lunges, Reverse Lunge, Step Up, Pistol Squat. Zostaje 19.
- Zasada: wyjątek dla wskazówek techniki (CLAUDE.md) — każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z RÓŻNYCH organizacji; miejsce podane.
  Wariant tego samego ćwiczenia z innym sprzętem liczy się, z dopiskiem „(wariant: …)”, jak w docs/33. Inne ćwiczenie = analogia, nie liczy się.
- Zdań zestawu ogólnego (`cue-sets.json`) niepotwierdzonych dla danego wariantu NIE wpisano do kart — opisane w „Otwarte” (polecenie koordynatora 02.11.2026).
- Strony i dokumentacja innych aplikacji treningowych nie są źródłem — żadnej nie użyto.
- Najpierw istniejące zdania z `lib/cues/text/pl.json`; nowe tylko 3 (sekcja 3).
- Pominięte z premedytacją: zdania „kolano nie wychodzi przed palce” (WebMD Ignite, Eleiko RFE, Rady Children’s) — sprzeczne z istniejącym zdaniem `sq.kneesPast` i nie są potrzebne do kart.
- Dostęp w tej sesji: ExRx.net — 403, Wayback Machine — zablokowany w narzędziu; strony ćwiczeń NASM pod zgadywanymi adresami — 404 (lateral-lunge, curtsy-lunge, split-squat, walking-lunge, side-lunge, forward-lunge, reverse-lunge, step-up, lunge);
  Monash (Cossack-Squat.pdf) — 403; NSCA „Basics of Strength and Conditioning Manual” — 403. Nie są źródłami w tej partii.

## 1. Tabela ćwiczeń

| Klucz | Stan | Powód / uwagi |
|---|---|---|
| Lunges (sztanga) | **gotowe** | setup, ruch, plecy, kolano, błąd kolana — ACE #8 (wykrok ze sztangą), Eleiko (Forward Lunge – Barbell), Catalyst (Lunge), WebMD Ignite |
| Split Squat | **gotowe** | nowe zdanie ustawienia `split.setup`; ruch `bss.move` i plecy — Catalyst (Split Squat) + Eleiko (Split Squat – Bodyweight). Kolano (`lunge.knee`, `lunge.mis.kneeIn` z zestawu ogólnego) — niepotwierdzone, nie wpisane (O-1) |
| Barbell Walking Lunge | **gotowe** | setup z wykroku ze sztangą (wariant), ruch `lunge.walk` — ACE #139 + Catalyst (Overhead Walking Lunge — wariant; głębokość z Catalyst Lunge) |
| Bulgarian Split Squat (sztanga) | **gotowe (wariant: hantle)** | `bss.setup`, `bss.move`, `lunge.torso` — ACE #366 + Eleiko (RFE Split Squat – 1 DB). Ułożenie sztangi i kolano — otwarte (O-1, O-3) |
| Smith Machine Bulgarian Split Squat | **gotowe (wariant: hantle)** | jak wyżej; ustawienie stóp względem prowadnic — otwarte (O-3). Jeśli koordynator nie uzna wersji z hantlami za wariant dla maszyny Smitha → przenieść do otwartych |
| Barbell Step Up | **gotowe** | `lunge.bbSetup`, `stepup.move`, `lunge.torso` — Landow i Jarmon (książka, Human Kinetics) + Catalyst (Step-up) + ACE #28 (wariant: hantle). `stepup.knee` i `lunge.mis.kneeIn` — tylko ACE → nie wpisane (O-1) |
| Lateral Lunge | **gotowe (bez ustawienia)** | nowe zdanie ruchu `latl.move` + błąd `sq.mis.heels` — ACE #50 (+ #364) i Eleiko (Lateral Lunge BW, 2 DB). Ustawienie stóp: ACE „na szerokość bioder”, Eleiko „stopy razem” — sprzeczność, brak setupu (O-4); `lunge.knee`, `sq.back` z zestawu ogólnego — nie wpisane (O-1, O-5) |
| Barbell Side Split Squat | otwarte | tylko Catalyst (Lateral Lunge = szeroki rozkrok ze sztangą, przenoszenie ciężaru); drugie źródło nie znalezione |
| Cossack Squat | otwarte | tylko Catalyst (Cossack Squat); ACE/NASM/Eleiko — brak strony; Monash — 403 |
| Curtsy Lunge | otwarte | jedyne znalezione: ACE #82 (wykrok skrzyżny z taśmami podwieszanymi — inny wariant, jedna organizacja); nieprzeczytane |
| Elevated Back Lunge | otwarte | wykrok w tył ma źródła (ACE #319, Eleiko Reverse Lunge – Barbell, nieprzeczytane w tej sesji), ale stanie na podwyższeniu — żadnego źródła |
| Split Squat (linki) | otwarte | Eleiko ma „Split Squat – Single Cable” i „Split Squat, Front – Dual Cable” (nieprzeczytane), drugiej organizacji brak; ustawienie przy wyciągu specyficzne |
| Suspended Split Squat | otwarte | tylko ACE #93 (wykrok z tylną stopą w taśmach podwieszanych, przeczytane) — jedna organizacja |
| Slider Reverse Lunge | otwarte | nie szukano (kolejność wg popularności) |
| Lunge Pass Through | otwarte | nie szukano |
| Single Leg Press | otwarte | `lp.*` mają źródła tylko dla wersji obunóż; wersja jednonóż — nie szukano |
| Single-Leg High Box Squat | otwarte | nie szukano (Eleiko „1-Leg Squat – Assisted” — inne ćwiczenie, nieprzeczytane) |
| Smith Machine Pistol Squat | otwarte | nie szukano |
| Crossover Reverse Lunge | otwarte | nie szukano; uwaga: w `cue-sets.json` ma `f: "mobility"`, a `familyOf` daje `lunge` (wyjątek) — do sprawdzenia przez programistę |

## 2. Blok JSON do `data/zrodla/cues.json` (tylko gotowe)

Ćwiczenia (do obiektu ćwiczeń):

```json
{
  "Lunges (sztanga)": {
    "setup": [
      {"c": "lunge.bbSetup", "s": [["ace-8", "Step 1 (bar behind the neck, across the upper back)"], ["eleiko-65848315", "Starting Position"], ["catalyst-354", "opis (barbell on the back)"]]}
    ],
    "move": [
      {"c": "lunge.fwd", "s": [["ace-8", "Step 2–3 (back knee almost to the floor; push through the front foot)"], ["catalyst-354", "opis (back knee very lightly touches the floor; push off the front leg)"], ["eleiko-65848315", "Procedure"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["ace-8", "Step 2 (back straight through the entire movement)"], ["catalyst-354", "opis (upright trunk)"], ["eleiko-65848315", "Coaching Key (chest tall)"]]},
      {"c": "lunge.knee", "s": [["eleiko-65848315", "Coaching Key (front knee not collapsing inward)"], ["webmd-ignite-lunge", "lista wskazówek (knees in line with the second toe; wariant: bez obciążenia)"]]}
    ],
    "mistakes": [
      {"c": "lunge.mis.kneeIn", "s": [["eleiko-65848315", "Coaching Key"], ["webmd-ignite-lunge", "lista wskazówek (knees in line with the second toe — pośrednio)"]]}
    ]
  },
  "Split Squat": {
    "setup": [
      {"c": "split.setup", "s": [["eleiko-6581e00b", "Starting Position (step back; back toes in contact with the ground)"], ["catalyst-174", "opis (split stance)"], ["webmd-ignite-lunge", "opis (rear heel lifts off the floor; wariant: wykrok)"]]}
    ],
    "move": [
      {"c": "bss.move", "s": [["catalyst-174", "opis (bend both knees until the back knee lightly touches the floor; reverse)"], ["eleiko-6581e00b", "Procedure (lower the hips; push through the front foot)"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["catalyst-174", "opis (trunk upright)"], ["eleiko-6581e00b", "Procedure; Coaching Key (chest tall, braced torso)"]]}
    ],
    "mistakes": []
  },
  "Barbell Walking Lunge": {
    "setup": [
      {"c": "lunge.bbSetup", "s": [["ace-8", "Step 1 (wariant: wykrok w przód ze sztangą)"], ["eleiko-65848315", "Starting Position (wariant: wykrok w przód)"], ["catalyst-354", "opis (barbell on the back; wariant)"]]}
    ],
    "move": [
      {"c": "lunge.walk", "s": [["ace-139", "Step 3–5"], ["catalyst-600", "opis (one continuous step; wariant: ciężar nad głową)"], ["catalyst-354", "opis (głębokość: back knee very lightly touches the floor)"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["catalyst-600", "opis (upright posture)"], ["ace-139", "Step 3 (spine extended)"]]},
      {"c": "lunge.knee", "s": [["eleiko-65848315", "Coaching Key (wariant: wykrok w przód)"], ["webmd-ignite-lunge", "lista wskazówek (wariant: wykrok bez obciążenia)"]]}
    ],
    "mistakes": [
      {"c": "lunge.mis.kneeIn", "s": [["eleiko-65848315", "Coaching Key (wariant)"], ["webmd-ignite-lunge", "lista wskazówek (pośrednio; wariant)"]]}
    ]
  },
  "Bulgarian Split Squat (sztanga)": {
    "setup": [
      {"c": "bss.setup", "s": [["ace-366", "opis (wariant: hantle)"], ["eleiko-6581e6ea", "Starting Position (wariant: 1 hantla)"]]}
    ],
    "move": [
      {"c": "bss.move", "s": [["ace-366", "opis (wariant: hantle)"], ["eleiko-6581e6ea", "Procedure (wariant: 1 hantla)"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["ace-366", "opis (back straight)"], ["eleiko-6581e6ea", "Procedure (torso upright)"]]}
    ],
    "mistakes": []
  },
  "Smith Machine Bulgarian Split Squat": {
    "setup": [
      {"c": "bss.setup", "s": [["ace-366", "opis (wariant: hantle)"], ["eleiko-6581e6ea", "Starting Position (wariant: 1 hantla)"]]}
    ],
    "move": [
      {"c": "bss.move", "s": [["ace-366", "opis (wariant: hantle)"], ["eleiko-6581e6ea", "Procedure (wariant: 1 hantla)"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["ace-366", "opis (back straight)"], ["eleiko-6581e6ea", "Procedure (torso upright)"]]}
    ],
    "mistakes": []
  },
  "Barbell Step Up": {
    "setup": [
      {"c": "lunge.bbSetup", "s": [["hk-landow-stepup", "Bottom-Up Step-Up (barbell back squat position along the upper back)"], ["catalyst-560", "opis (barbell on the back)"]]}
    ],
    "move": [
      {"c": "stepup.move", "s": [["catalyst-560", "opis (foot on a box or bench; lift with the raised leg to standing; control the motion back down)"], ["hk-landow-stepup", "Bottom-Up Step-Up (drive the foot into the box; controls his descent)"], ["ace-28", "Step 2–3 (wariant: hantle)"]]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [["hk-landow-stepup", "Bottom-Up Step-Up (upright posture through trunk and shoulders)"], ["ace-28", "Step 2 (torso upright; wariant: hantle)"]]}
    ],
    "mistakes": []
  },
  "Lateral Lunge": {
    "setup": [],
    "move": [
      {"c": "latl.move", "s": [["ace-50", "Step 2–3"], ["eleiko-6584b6f9", "Procedure"], ["eleiko-658d8baf", "Procedure (wariant: 2 hantle)"], ["ace-364", "kroki 2–4 (wariant: hantle)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "sq.mis.heels", "s": [["ace-50", "Step 2 (both heels flat on the floor)"], ["eleiko-6584b6f9", "Coaching Key (both heels planted)"]]}
    ]
  }
}
```

Uwaga dla wdrażającego: `Lateral Lunge` ma pusty `setup` i `tips` — jeśli generator wymaga ustawienia, zostaw ćwiczenie w zestawie ogólnym, dopóki O-4 nie zostanie rozstrzygnięte (nie dopisuj zdań ogólnych do karty).

Nowe źródła (do obiektu `sources`; format jak `ace-363`, `eleiko-659d665d`):

```json
{
  "ace-8": {"org": "ACE", "title": "Forward Lunge (#8, ze sztangą)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/8/forward-lunge/", "level": 4},
  "ace-50": {"org": "ACE", "title": "Side Lunge (#50)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/50/side-lunge/", "level": 4},
  "ace-364": {"org": "ACE", "title": "Lateral Lunge (#364, hantle)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/364/lateral-lunge/", "level": 4},
  "eleiko-65848315": {"org": "Eleiko", "title": "Forward Lunge – Barbell", "url": "https://eleiko.inspire360.com/resource/65848315a77c608cad0ebaf2", "level": 4},
  "eleiko-6584b6f9": {"org": "Eleiko", "title": "Lateral Lunge – Bodyweight", "url": "https://eleiko.inspire360.com/resource/6584b6f910ea0233f5031828", "level": 4},
  "eleiko-658d8baf": {"org": "Eleiko", "title": "Lateral Lunge – 2 DB", "url": "https://eleiko.inspire360.com/resource/658d8baf7d0fa7edea01e27c", "level": 4},
  "eleiko-6581e00b": {"org": "Eleiko", "title": "Split Squat – Bodyweight", "url": "https://eleiko.inspire360.com/resource/6581e00bf5ddcbc3720a02b3", "level": 4},
  "eleiko-6581e6ea": {"org": "Eleiko", "title": "Split Squat, Rear Foot Elevated – 1 DB", "url": "https://eleiko.inspire360.com/resource/6581e6eafc2fd779b9070f8b", "level": 4},
  "catalyst-354": {"org": "Catalyst Athletics", "title": "Lunge (exercise library #354)", "url": "https://catalystathletics.com/exercise/354/Lunge/", "level": 4},
  "catalyst-174": {"org": "Catalyst Athletics", "title": "Split Squat (exercise library #174)", "url": "https://catalystathletics.com/exercise/174/Split-Squat/", "level": 4},
  "catalyst-560": {"org": "Catalyst Athletics", "title": "Step-up (exercise library #560)", "url": "https://www.catalystathletics.com/exercise/560/Step-up/", "level": 4},
  "catalyst-600": {"org": "Catalyst Athletics", "title": "Overhead Walking Lunge (exercise library #600)", "url": "https://catalystathletics.com/exercise/600/Overhead-Walking-Lunge/", "level": 4},
  "hk-landow-stepup": {"org": "Landow, Jarmon (Human Kinetics)", "title": "Landow L, Jarmon C: All-Pro Performance Training — fragment „Bottom-Up Step-Up” (Human Kinetics, blog z fragmentami książek)", "url": "https://us.humankinetics.com/blogs/excerpt/want-to-boost-your-acceleration-try-this-strength-move", "level": 3},
  "webmd-ignite-lunge": {"org": "WebMD Ignite", "title": "Leg and Knee Exercises: Leg Lunge (UMass Memorial Health; treść WebMD Ignite)", "url": "https://www.ummhealth.org/health-library/leg-and-knee-exercises-leg-lunge", "level": 4}
}
```

Nowe organizacje (do `orgs`, jeśli ich nie ma): „Catalyst Athletics” — serwis specjalistyczny trenerów podnoszenia ciężarów (G. Everett), szczebel 4, `kind: "site"`;
„Landow, Jarmon (Human Kinetics)” — książka trenerów (wydawca Human Kinetics), szczebel 3, czytany fragment na stronie wydawcy;
„WebMD Ignite” — materiał edukacyjny dla pacjentów (już zaproponowany w docs/33), szczebel 4 PROPOZYCJA; użyty tylko do wskazówki o kolanie i tylnej stopie.
„Eleiko” (producent sprzętu; wyjątek w `tests/forbidden-names.json` dla `data/zrodla/cues.json` już jest) i „ACE” już są.

Niezależność: ACE #50 i #364 — ta sama organizacja (liczą się jako jedno); Eleiko BW i 2 DB — jedna organizacja; Catalyst #354/#174/#560/#600 — jedna organizacja. Każde zdanie wyżej ma co najmniej dwie RÓŻNE organizacje.

## 3. Nowe zdania PL (+ proponowane EN)

Każde nowe zdanie = 35 języków (tłumacz) + wpis w rejestrze twierdzeń (`node scripts/claims.mjs --stub`, potem `--rehash <ID>`).

| Id | PL | EN (propozycja) | Źródła (różne organizacje) |
|---|---|---|---|
| `lunge.bbSetup` | Sztanga na górze pleców, stań prosto. | Bar across your upper back, stand tall. | ACE #8 (Step 1), Eleiko Forward Lunge – Barbell (Starting Position), Catalyst #354 i #560 (opis), Landow i Jarmon (Bottom-Up Step-Up) |
| `split.setup` | Stań w wykroku: jedna stopa z przodu, druga z tyłu, oparta na palcach. | Split stance: one foot in front, the other behind you on the ball of the foot. | Eleiko Split Squat – Bodyweight (Starting Position: „The toes of the back foot should be in contact with the ground.”), Catalyst #174 (opis — rozkrok), WebMD Ignite (tylna pięta odrywa się od podłogi; wariant: wykrok) |
| `latl.move` | Zrób krok w bok i cofnij biodra, uginając kolano tej nogi; druga noga zostaje prosta. Wróć, odpychając się ugiętą nogą. | Step out to the side and sit your hips back, bending that knee; keep the other leg straight. Push off the bent leg to come back. | ACE #50 (Step 2–3; #364 kroki 2–4 — ta sama org.), Eleiko Lateral Lunge – Bodyweight / – 2 DB (Procedure: „Step to one side in a lateral direction, keeping the opposite leg straight.”) |

Uwaga: z ACE #50 pominięto „szeroki krok” — ACE wymienia zbyt szeroki krok jako błąd; dlatego zdanie mówi tylko „krok w bok”.

Istniejące zdania użyte bez zmian: `lunge.fwd`, `lunge.walk`, `lunge.torso`, `lunge.knee`, `lunge.mis.kneeIn`, `bss.setup`, `bss.move`, `stepup.move`, `sq.mis.heels`.

## 4. Źródła (przeczytane 02.11.2026, WebFetch)

| Id | Adres | Organizacja | Szczebel | Miejsce / co potwierdza |
|---|---|---|---|---|
| ace-8 | https://www.acefitness.org/resources/everyone/exercise-library/8/forward-lunge/ | American Council on Exercise | 4 | kroki 1–3: sztanga za szyją na górze pleców, chwyt szerzej niż barki, zdjęcie ze stojaka i 2 kroki w tył; tylne kolano „almost to the floor”; plecy proste przez cały ruch |
| ace-50 | https://www.acefitness.org/resources/everyone/exercise-library/50/side-lunge/ | ACE | 4 | Step 1–3: stopy na szerokość bioder; krok w bok, biodra w tył, druga noga prosta, obie pięty na podłodze, kolano nad drugim palcem; błąd: za szeroki krok |
| ace-364 | https://www.acefitness.org/resources/everyone/exercise-library/364/lateral-lunge/ | ACE | 4 | kroki 1–4 (hantle): krok w bok, biodro w tył, powrót odepchnięciem |
| ace-139 | https://www.acefitness.org/resources/everyone/exercise-library/139/walking-lunges-with-twists/ | ACE | 4 | Step 3–5: głębokość, przeniesienie tylnej nogi do kolejnego kroku, kręgosłup wyprostowany (już w danych) |
| ace-366, ace-28 | (już w danych) | ACE | 4 | BSS — opis; Step Up — Step 2–3 (tułów wyprostowany, kolano nad drugim palcem) |
| eleiko-65848315 | https://eleiko.inspire360.com/resource/65848315a77c608cad0ebaf2 | Eleiko (producent sprzętu, platforma szkoleniowa) | 4 | Coaching Key: „Keep your chest tall, weight primarily on your front leg, and prevent your front knee from collapsing inward.” |
| eleiko-6584b6f9 / -658d8baf | (tabela w sekcji 2) | Eleiko | 4 | Procedure, Coaching Keys: „Both heels should be planted into the ground.”; start ze stopami razem |
| eleiko-6581e00b | https://eleiko.inspire360.com/resource/6581e00bf5ddcbc3720a02b3 | Eleiko | 4 | Starting Position, Procedure, Coaching Key (ciężar na przedniej nodze, klatka wysoko, tułów napięty) |
| eleiko-6581e6ea | https://eleiko.inspire360.com/resource/6581e6eafc2fd779b9070f8b | Eleiko | 4 | Starting Position: tylna stopa na skrzyni/ławce; Procedure: tułów wyprostowany, odepchnięcie przednią stopą |
| catalyst-354 | https://catalystathletics.com/exercise/354/Lunge/ | Catalyst Athletics | 4 | opis: tylne kolano „very lightly touches the floor”; „maintain an upright trunk”; sztanga na plecach lub z przodu |
| catalyst-174 | https://catalystathletics.com/exercise/174/Split-Squat/ | Catalyst Athletics | 4 | opis: rozkrok, oba kolana w dół aż tylne lekko dotknie podłogi, tułów wyprostowany |
| catalyst-560 | https://www.catalystathletics.com/exercise/560/Step-up/ | Catalyst Athletics | 4 | opis: stopa na skrzyni lub ławce, wejście nogą na podwyższeniu do stania, kontrolowane zejście („instead of just dropping”) |
| catalyst-600 | https://catalystathletics.com/exercise/600/Overhead-Walking-Lunge/ | Catalyst Athletics | 4 | opis: „Generally it's best to take one continuous step”; postawa wyprostowana |
| hk-landow-stepup | https://us.humankinetics.com/blogs/excerpt/want-to-boost-your-acceleration-try-this-strength-move | Landow, Jarmon — książka (Human Kinetics) | 3 | „Bottom-Up Step-Up”: sztanga w pozycji przysiadu na górze pleców; „he maintains an upright posture through his trunk and shoulders”; kontrolowane zejście |
| webmd-ignite-lunge | https://www.ummhealth.org/health-library/leg-and-knee-exercises-leg-lunge | WebMD Ignite (publikuje UMass Memorial Health) | 4 (PROPOZYCJA) | lista wskazówek: „Keep knees in line with the second toe.”; tylna pięta odrywa się przy kroku |

Przeczytane, nieużyte: ACE #94 (Forward Lunge bez obciążenia — brak wskazówki o kolanie), ACE #93 (wykrok z tylną stopą w taśmach podwieszanych — jedna organizacja), Eleiko Lateral Lunge – Barbell (658d8dd7 — wersji ze sztangą nie ma w katalogu), Catalyst #474 Lateral Lunge i #584 Cossack Squat (jedno źródło), Rady Children’s PT „Proper Form for Squats, Lunges and Hopping” (rchsd.org, PDF — tylko „plecy proste” i „kolano nie przed palce”).

## 5. Otwarte

- **O-1 Kolano w Split Squat, BSS (sztanga/Smith), Barbell Step Up, Lateral Lunge** — zdania z zestawu ogólnego (`lunge.knee`, `stepup.knee`, `lunge.mis.kneeIn`) mają dla tych wariantów po jednym źródle albo tylko analogie (ACE #28, ACE #50, NASM BSS dla hantli) → nie wpisane do kart. Potrzebne drugie źródło dla danego wariantu.
- **O-2 Ćwiczenia otwarte z tabeli 1** — Barbell Side Split Squat i Cossack Squat (tylko Catalyst), Curtsy Lunge, Elevated Back Lunge (podwyższenie), Split Squat (linki), Suspended Split Squat (tylko ACE), Slider Reverse Lunge, Lunge Pass Through, Single Leg Press, Single-Leg High Box Squat, Smith Machine Pistol Squat, Crossover Reverse Lunge — zostają na zestawie ogólnym.
- **O-3 Ułożenie ciężaru w BSS ze sztangą i w maszynie Smitha** — karty używają zdań z wersji z hantlami (wariant); ułożenie sztangi i ustawienie stóp względem prowadnic bez źródła.
- **O-4 Ustawienie w Lateral Lunge** — ACE #50/#364: stopy na szerokość bioder; Eleiko: stopy razem. Część wspólna: „stań prosto” (za mało na osobne zdanie). Decyzja wdrażającego: karta bez ustawienia albo zdanie po trzecim źródle.
- **O-5 `sq.back` w Lateral Lunge** — „plecy proste, klatka uniesiona”: Eleiko wprost; Catalyst #474 tylko „tułów jak najbardziej wyprostowany” (wersja ze sztangą, szeroki rozkrok) → nie wpisane.
- **O-6 Organizacje do akceptacji** — Catalyst Athletics (szczebel 4) i WebMD Ignite (4 PROPOZYCJA, z docs/33); jeśli audytor odrzuci WebMD Ignite, `lunge.knee`/`lunge.mis.kneeIn` w Lunges (sztanga) i Barbell Walking Lunge zostają z jednym źródłem → usunąć z kart; `split.setup` zostaje (Eleiko + Catalyst), ale „oparta na palcach” tylko z Eleiko → skrócić do „jedna stopa z przodu, druga z tyłu”.
- **O-7 Dostęp** — ExRx i strony NASM (nieznane adresy) niedostępne; po odzyskaniu dostępu sprawdzić O-1 i O-2 w pierwszej kolejności.
- **O-8 `Crossover Reverse Lunge`** — w `cue-sets.json` `f: "mobility"`, a `familyOf` przypisuje `lunge` (OVERRIDES) — niespójność do sprawdzenia przez programistę (nie merytoryczna).

## Stan (limit kontekstu)

- Zrobione: 7 ćwiczeń gotowych (sekcja 2), 3 nowe zdania, 14 nowych źródeł.
- Zostało: O-1, O-2 (12 ćwiczeń), O-3, O-4.
- Następny krok: szukać drugiej organizacji dla Cossack Squat i Barbell Side Split Squat (obok Catalyst), Curtsy Lunge, Split Squat (linki) — Eleiko ma dwie strony z wyciągiem.
- Pułapki: WebFetch zwraca parafrazy — sprawdzać, czy cytat jest dosłowny; wiele źródeł przy wykroku mówi „kolano nie przed palce” — nie przenosić (sprzeczne z `sq.kneesPast`); NASM ma inne adresy niż zgadywane (`/resource-center/exercise-library/<slug>` daje 404 dla prostych nazw); w dokumentach nie wpisywać nazw marek sprzętu podwieszanego (opis neutralny).
