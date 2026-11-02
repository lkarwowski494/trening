# Wskazówki techniki — rodzina `leg_machine` (+ Hack Squat, karta „do poprawy”)

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: jak w `docs/research/33-wskazowki-partia2.md` (wyjątek dla wskazówek techniki z CLAUDE.md: 2 zgodne, niezależne
źródła szczebla 4 z różnych organizacji, przeczytane; żadne przeczytane nie przeczy; bez liczb i bez uzasadnień zdrowotnych).
ExRx (403) i web.archive.org (zablokowane) w tej sesji niedostępne — zgodnie z uzupełnieniem briefu nie liczone.
Strony innych aplikacji treningowych pominięte (nie są źródłem, nazwy poza plikiem).

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Hack Squat | **gotowe** (z 2 nowymi zdaniami) | 4 przeczytane źródła o maszynie; `hack.setup` i `lp.hips` w obecnym brzmieniu bez 2 źródeł → `hack.setup2`, `hack.hips` |
| Single Leg Press | **gotowe** (1 nowe zdanie) | NASM + The Prehab Guys; `lp.heels` z zestawu ogólnego bez 2 źródeł |
| Belt Squat Machine | otwarte | ustawienie i ruch mają 2 źródła; wskazówek/błędów z 2 źródłami — 0 |
| Pendulum Squat | otwarte | ustawienie, ruch, `lp.noLock` — 2 źródła; brak drugiej wskazówki/błędu z 2 źródłami |
| Smith Machine Leg Press | otwarte | ustawienie i ruch (nowe zdania) — 2 źródła; wskazówki — po 1 źródle |
| Lying Machine Squat | otwarte | brak przeczytanego źródła (wyniki to strony aplikacji i strony bez treści) |

## A. Hack Squat (karta „do poprawy”, `figury-recenzja.json`)

Problem z recenzji 28.10.2026: każde z 5 zdań miało jedno źródło o hack squat (ExRx, nieczytelne 28.10 i dziś) i drugie o prasie
nóg (analogia). Dziś przeczytane cztery źródła o hack squat na maszynie z czterech organizacji:
NFPT (organizacja certyfikująca trenerów), BarBend, Breaking Muscle (serwisy specjalistyczne, już w `orgs`), Bells of Steel
(producent maszyn do hack squat). ExRx można zostawić jako trzecie źródło do ponownego odczytu, ale nie jest liczone.

### Wynik dla pięciu zdań

| Zdanie | Wynik | Źródła (przeczytane 02.11.2026) | Uwagi |
|---|---|---|---|
| `hack.setup` (plecy o oparcie, stopy ~ szerokość bioder) | **częściowo — proponuję `hack.setup2`** | plecy/barki: NFPT „Setup”, BarBend „Step 2”, Breaking Muscle „Step 1”; szerokość: Breaking Muscle „Step 1” — około szerokości bioder; NFPT — wąsko / na szerokość barków / szerzej; Bells of Steel krok 1 — szerokość barków lub trochę szerzej; BarBend „Step 2” — zwykłe ustawienie jak do przysiadu | Sprzeczność tego samego szczebla co do szerokości: część wspólna „od szerokości bioder do barków”. „Mniej więcej na szerokość bioder” ma tylko jedno źródło (Breaking Muscle), Bells of Steel podaje szerzej → zdanie w obecnym brzmieniu nie ma 2 źródeł. Nowe zdanie `hack.setup2` zamiast zmiany brzmienia `hack.setup` (zdanie jest też w zestawach ogólnych). |
| `hack.move` | **gotowe** | NFPT „Movement” (zginasz biodra i kolana, opuszczasz, wypychasz w górę); Bells of Steel kroki 3–4 (opuść się, wróć, prostując nogi); BarBend „Step 3” (zejdź w przysiad, wypchnij płytę) | — |
| `lp.heels` (pchaj całą stopą, pięty na platformie) | **gotowe** | NFPT „Cautions” (nie pozwól piętom się unosić); Breaking Muscle „Step 1” (pięty płasko na platformie) i „Lifting Your Heels” w „Hack Squat Mistakes to Avoid” (cała stopa naciska na platformę) | — |
| `lp.hips` (nie schodź tak nisko, by miednica odrywała się od oparcia…) | **nie dla Hack Squat — proponuję `hack.hips`** | NFPT „Cautions” (biodra na oparciu, plecy bez wyginania); BarBend „Common Mistakes” (biodra i tułów cały czas przy oparciu); Breaking Muscle „Step 2” (cały czas kontakt bioder z oparciem) | Źródła potwierdzają „miednica zostaje na oparciu”, ale **żadne nie łączy tego z głębokością** (BarBend i Breaking Muscle zalecają głęboki przysiad; BarBend łączy odrywanie bioder ze stopami za wysoko). |
| `sq.kneesToes` | **gotowe** | Bells of Steel „Tips” (kolana nie zapadają się do środka); Breaking Muscle „Step 3” (kolana nie uciekają do środka ani na zewnątrz) | — |
| dodatkowo `sq.mis.kneesIn` (błąd) | **gotowe** | Bells of Steel „Tips”; Breaking Muscle „Step 3” | Jak przy Leg Press. Opcjonalne (błędy były puste). |

**Uwaga tłumacza (EN `lp.hips` „seat”):** `lp.hips` występuje w `cues.json` tylko przy **Leg Press** i **Hack Squat** (2 wystąpienia;
w `cue-sets.json` i `wskazowki-ogolne.json` brak). Przy Leg Press „seat” zgadza się ze źródłem (ACE 154, kroki 3–4: pośladki
odrywają się od siedziska) — **EN `lp.hips` zostaje bez zmian**. Przy Hack Squat maszyna ma oparcie, nie siedzisko: osobne zdanie
`hack.hips` z EN „pad” zamiast zmiany wspólnego zdania (zmiana na „backrest/pad” pogorszyłaby Leg Press).

Nie dodawać do Hack Squat (przeczytane źródła sobie przeczą):
- `lp.noLock` — NFPT i Bells of Steel: nie blokuj kolan na górze; Breaking Muscle „Step 3. Lift Strong to Lockout” — wyprost do końca.
- `sq.kneesPast` — NFPT i Bells of Steel: kolana nie przed palce stóp; to stoi w sprzeczności z brzmieniem `sq.kneesPast`.

```json
{
  "Hack Squat": {
    "setup": [
      {"c": "hack.setup2", "s": [
        ["nfpt-hack-squat", "Setup (shoulders against the shoulder pads; stance options close / medium shoulder-width / wide)"],
        ["breakingmuscle-hack-squat", "Step 1 Get Your Stance Right (back supported; around hip-width, middle of the platform)"],
        ["bellsofsteel-hack-squat", "Step-by-step 1 (feet shoulder-width apart or slightly wider)"],
        ["barbend-hack-squat-machine", "Step 2 Set Your Stance (back against the backrest; head between the shoulder pads)"]
      ]}
    ],
    "move": [
      {"c": "hack.move", "s": [
        ["nfpt-hack-squat", "Movement (bend at the hips and knees and lower; press up)"],
        ["bellsofsteel-hack-squat", "Step-by-step 3–4 (lower yourself; push back up by extending your legs)"],
        ["barbend-hack-squat-machine", "Step 3 Squat"]
      ]}
    ],
    "tips": [
      {"c": "lp.heels", "s": [
        ["nfpt-hack-squat", "Cautions (do not let your heels lift off the platform)"],
        ["breakingmuscle-hack-squat", "Step 1 (heels flat on the platform); Mistakes to Avoid — Lifting Your Heels"]
      ]},
      {"c": "hack.hips", "s": [
        ["nfpt-hack-squat", "Cautions (keep your hips on the pad)"],
        ["barbend-hack-squat-machine", "Common Mistakes (hips and torso connected with the seat at all times)"],
        ["breakingmuscle-hack-squat", "Step 2 Lower Yourself into a Deep Squat (contact between your hips and the pad)"]
      ]},
      {"c": "sq.kneesToes", "s": [
        ["bellsofsteel-hack-squat", "Tips (do not let your knees cave in)"],
        ["breakingmuscle-hack-squat", "Step 3 (don't let your knees cave inward or bow outward)"]
      ]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [
        ["bellsofsteel-hack-squat", "Tips (do not let your knees cave in)"],
        ["breakingmuscle-hack-squat", "Step 3 (don't let your knees cave inward)"]
      ]}
    ]
  }
}
```

Wersja zachowawcza (bez nowych zdań): `hack.setup` ma 1 źródło co do szerokości stóp, ustawienie nie spełnia minimum, więc
karta zostaje ukryta. Rekomenduję nowe zdania `hack.setup2` i `hack.hips`. Po integracji: nowa recenzja niezależna (bramka 4).

## B. Pozostałe ćwiczenia rodziny `leg_machine`

### Single Leg Press — gotowe

Źródła: NASM „Single-Leg Press” (Setup, Movement, Common Mistakes) i The Prehab Guys „Single Leg Leg Press – Machine”
(opis ćwiczenia: ustawienie, ruch, kompensacje). `lp.setup` nie pasuje (mówi o obu stopach i liczbie — kąt prosty), stąd nowe zdanie `slp.setup`.

```json
{
  "Single Leg Press": {
    "setup": [
      {"c": "slp.setup", "s": [
        ["nasm-single-leg-press", "Setup (back and head against the backrest; one foot on the platform, the other off it)"],
        ["prehab-single-leg-leg-press-machine", "Setup (seated position; bring the leg up to the plate; keep the opposite leg down and stable)"]
      ]}
    ],
    "move": [
      {"c": "lp.move", "s": [
        ["prehab-single-leg-leg-press-machine", "Movement (push the plate away by straightening the knees, the hips…; slowly lower the plate)"],
        ["nasm-single-leg-press", "Movement (press the platform forward by extending your leg; lower the platform back with control)"]
      ]}
    ],
    "tips": [
      {"c": "lp.noLock", "s": [
        ["prehab-single-leg-leg-press-machine", "Compensations (do not lock out the knees at the end of the press)"],
        ["nasm-single-leg-press", "Movement; Common Mistakes (locking out the knee at full extension)"]
      ]}
    ],
    "mistakes": [
      {"c": "sq.mis.kneesIn", "s": [
        ["nasm-single-leg-press", "Common Mistakes (allowing the knee to cave inward)"],
        ["prehab-single-leg-leg-press-machine", "Compensations (do not let the legs rotate in or out)"]
      ]}
    ]
  }
}
```

Uwaga dla recenzenta: przy `sq.mis.kneesIn` The Prehab Guys mówi o „obracaniu nogi do środka” (nie dosłownie „kolano do środka”) —
kierunkowo to samo; jeśli recenzent uzna to za za słabe, ćwiczenie spada do „otwarte” (wskazówki + błędy = 1).
Zestaw ogólny (`cue-sets.json`) ma też `lp.heels` — tu tylko The Prehab Guys („nacisk przez palce i pięty”), NASM nie mówi o piętach → nie wpisano.

### Belt Squat Machine — otwarte

Przeczytane: Bells of Steel „How To Use A Belt Squat Machine?” (producent maszyn) i Barbell Logic „How to do the belt squat exercise”
(firma szkoląca trenerów). Gotowe częściowo:
- `belt.setup` (nowe): Bells of Steel — pas na biodrach, nie w talii; stopy na szerokość barków; Barbell Logic „Set Up” — pas wokół bioder, przypięty do maszyny; stopy na szerokość barków.
- `belt.move` (nowe): Bells of Steel — opuszczaj się pod kontrolą, wstań, wypychając nogami; Barbell Logic „Descending”/„Standing” — zejdź pod kontrolą, wstań.
- Wskazówki: `sq.back` — Bells of Steel (klatka uniesiona, w moim odczycie tylko omówienie, bez dosłownego zdania) i Barbell Logic (tułów napięty i w stałej pozycji) — za słabo na „prosty plecy”. Uchwyty tylko dla równowagi — tylko Barbell Logic.
- Stopy: Bells of Steel ma sprzeczne zdania o palcach (na zewnątrz / do przodu) → bez wskazówki o palcach.
Zestaw ogólny (rodzina `squat`: `sq.down`, `sq.back`, `sq.kneesToes`) — żadne przeczytane źródło o tej maszynie nie mówi o cofaniu bioder ani o linii kolan.

### Pendulum Squat — otwarte

Przeczytane: RitFit „How to do the pendulum squat” (producent sprzętu), Legion Athletics „Pendulum Squat” (M. Matthews, trener; serwis),
Fitness Volt „Pendulum Squat” (P. Dale, trener; serwis). Uwaga: Legion Athletics i Fitness Volt nie są w `orgs` — do akceptacji
koordynatora jako szczebel 4 (serwisy specjalistyczne) albo do odrzucenia.
- `hack.setup2`: Fitness Volt (barki pod poduszkami, stopy między szerokością bioder i barków), RitFit (poduszki na górze barków, stopy na szerokość barków), Legion (plecy i biodra na oparciu, barki o poduszki, stopy na szerokość barków) — 3 źródła.
- `hack.move`: RitFit (ugnij razem kolana i biodra; wyprostuj kolana i biodra), Legion (ugnij kolana i opuść się; wyprostuj kolana), Fitness Volt (ugnij nogi, zejdź; wyprostuj nogi) — 3 źródła.
- `lp.noLock`: RitFit (bez twardego wyprostu kolan), Fitness Volt (zatrzymaj tuż przed pełnym wyprostem) — 2 źródła.
- Brak drugiej wskazówki: `lp.heels`, `sq.kneesToes`, `sq.mis.kneesIn` — tylko RitFit; `hack.hips` — Legion (biodra i plecy), Fitness Volt tylko dolne plecy.
Zestaw ogólny (`hack.move`, `sq.kneesToes`, `lp.heels`, `sq.mis.kneesIn`) — trzy z czterech zdań mają tu po jednym źródle.

### Smith Machine Leg Press — otwarte

Przeczytane: Major Fitness „How to do leg press on Smith machine” (producent maszyn Smitha; ławka pod sztangą, stopy na sztandze
na szerokość barków) i Dynamo Fitness „Wide Vertical Leg Press” (dostawca sprzętu; leżenie na podłodze, nakładka do prasy, szeroko).
Wspólne: leżysz na plecach pod sztangą Smitha, stopy na sztandze/nakładce; opuszczasz, uginając kolana; wypychasz w górę.
- Proponowane (2 źródła): `smlp.setup`, `smlp.move` (niżej).
- Wskazówki po 1 źródle: nie blokuj kolan, plecy płasko na ławce (Major Fitness). Dynamo każe kolanom iść na zewnątrz (wariant szeroki) — nie przenosić `sq.kneesToes`.
Zestaw ogólny (`lp.move` „platforma”, `lp.heels`, `lp.noLock`, `sq.mis.kneesIn`) — `lp.move` mówi o platformie, a tu jest sztanga; pozostałe — po 1 źródle albo brak.

### Lying Machine Squat — otwarte

Brak przeczytanego źródła o tej maszynie: wyniki wyszukiwania to strony aplikacji treningowych (nie są źródłem) i strona sklepu z
suplementami bez treści instrukcji. Zestaw ogólny (`hack.move`, `sq.kneesToes`, `lp.heels`, `sq.mis.kneesIn`) nie ma tu żadnego źródła.

## Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `hack.setup2` | Oprzyj plecy o oparcie, a barki o poduszki; stopy na platformie mniej więcej od szerokości bioder do szerokości barków. | Rest your back against the pad and your shoulders under the shoulder pads; feet on the platform somewhere between hip- and shoulder-width. | Hack Squat, Pendulum Squat: źródła różnią się szerokością — część wspólna; `hack.setup` („na szerokość bioder”) ma 1 źródło. |
| `hack.hips` | Biodra i plecy cały czas przy oparciu. | Keep your hips and back against the pad the whole time. | `lp.hips` łączy oderwanie miednicy z głębokością (prasa); przy hack squat żadne źródło tego nie mówi; EN „seat” nie pasuje. |
| `slp.setup` | Usiądź w maszynie plecami na oparciu; jedną stopę postaw na platformie, drugą nogę zdejmij i trzymaj spokojnie. | Sit in the machine with your back against the backrest; put one foot on the platform, take the other leg off and keep it still. | `lp.setup` mówi o obu stopach i kącie kolan. |
| `belt.setup` (otwarte ćwiczenie) | Zapnij pas na biodrach, nie w talii; stań na platformie, stopy mniej więcej na szerokość barków. | Put the belt around your hips, not your waist; stand on the platform, feet about shoulder-width apart. | Brak zdania o pasie. |
| `belt.move` (otwarte ćwiczenie) | Zejdź w przysiad pod kontrolą, potem wstań, wypychając się nogami. | Squat down under control, then stand up by driving through your legs. | `sq.down` zawiera cofanie bioder — źródła o maszynie tego nie mówią. |
| `smlp.setup` (otwarte ćwiczenie) | Połóż się na plecach pod sztangą maszyny Smitha i oprzyj o nią stopy. | Lie on your back under the Smith machine bar and put your feet against it. | Brak zdania o tym ustawieniu. |
| `smlp.move` (otwarte ćwiczenie) | Opuść sztangę, uginając kolana, potem wypchnij ją w górę, prostując nogi. | Lower the bar by bending your knees, then press it back up by straightening your legs. | `lp.move` mówi o platformie. |

Zdania przy otwartych ćwiczeniach — do użycia dopiero, gdy ćwiczenie dostanie wskazówki z 2 źródłami. PL/EN — do przeglądu
recenzenta lokalizacji (naturalność).

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `nfpt-hack-squat` | https://nfpt.com/how-to-do-hack-squats/ | NFPT (National Federation of Professional Trainers) — nowa | 4 | „Push up against the shoulder pads until you are in a standing position.” (Setup) |
| `barbend-hack-squat-machine` | https://barbend.com/hack-squat-machine/ | BarBend | 4 | „Put your back against the backrest and grab the handles.” (Step 2) |
| `breakingmuscle-hack-squat` | https://breakingmuscle.com/hack-squat/ (L. Boyce) | Breaking Muscle | 4 | „maintain contact between your hips and the pad” (Step 2) |
| `bellsofsteel-hack-squat` | https://bellsofsteel.us/blogs/content/how-to-use-hack-squat-machine | Bells of Steel (producent sprzętu) — nowa | 4 | „Do not let your knees cave in or go past your toes.” (Tips) |
| `nasm-single-leg-press` | https://www.nasm.org/resource-center/exercise-library/single-leg-press | NASM | 4 | „Sit on the leg press machine with your back and head firmly against the backrest.” (Setup) |
| `prehab-single-leg-leg-press-machine` | https://theprehabguys.com/vimeo-video/single-leg-leg-press-machine/ | The Prehab Guys | 4 | „Do not lock out the knees at the end of the press motion.” (Compensations) |
| `bellsofsteel-belt-squat` | https://bellsofsteel.us/blogs/content/how-to-use-a-belt-squat-machine | Bells of Steel | 4 | pas na biodrach, nie w talii (Setup) |
| `barbelllogic-belt-squat` | https://barbell-logic.com/how-to-do-the-belt-squat-exercise/ | Barbell Logic (szkolenie trenerów) — nowa | 4 | „Place the belt around your hips and clip it to the machine.” (Set Up) |
| `ritfit-pendulum-squat` | https://www.ritfitsports.com/blogs/article/how-to-do-the-pendulum-squat | RitFit (producent sprzętu) — nowa | 4 | „Bend the knees and hips together while keeping your heels down and knees tracking with the toes.” |
| `legion-pendulum-squat` | https://legionathletics.com/pendulum-squat | Legion Athletics (serwis; do akceptacji) — nowa | 4? | Setup / Descend (plecy i biodra na oparciu) |
| `fitnessvolt-pendulum-squat` | https://fitnessvolt.com/pendulum-squat/ | Fitness Volt (serwis; do akceptacji) — nowa | 4? | „stopping just short of complete lockout” |
| `majorfitness-smith-leg-press` | https://www.majorfitness.com/blogs/wiki/how-to-do-leg-press-on-smith-machine-a-step-by-step-guide | Major Fitness (producent sprzętu) — nowa | 4 | Positioning, Executing the Press |
| `dynamo-wide-vertical-leg-press` | https://blog.dynamofitness.com.au/?p=3057 | Dynamo Fitness (dostawca sprzętu) — nowa | 4 | „Lie on your back with your legs extended towards the ceiling” |

### Nowe źródła — JSON

```json
{
  "orgs": {
    "NFPT": {"name": "National Federation of Professional Trainers — artykuły How To (nfpt.com, organizacja certyfikująca trenerów)", "level": 4, "kind": "org"},
    "Bells of Steel": {"name": "Bells of Steel — blog producenta sprzętu siłowego (bellsofsteel.us)", "level": 4, "kind": "maker"},
    "Barbell Logic": {"name": "Barbell Logic — artykuły firmy szkolącej trenerów (barbell-logic.com)", "level": 4, "kind": "site"},
    "RitFit": {"name": "RitFit — blog producenta sprzętu (ritfitsports.com)", "level": 4, "kind": "maker"},
    "Legion Athletics": {"name": "Legion Athletics — artykuły (legionathletics.com; autor trener) — DO AKCEPTACJI", "level": 4, "kind": "site"},
    "Fitness Volt": {"name": "Fitness Volt — przewodniki ćwiczeń (fitnessvolt.com; autor trener) — DO AKCEPTACJI", "level": 4, "kind": "site"},
    "Major Fitness": {"name": "Major Fitness — blog producenta sprzętu (majorfitness.com)", "level": 4, "kind": "maker"},
    "Dynamo Fitness": {"name": "Dynamo Fitness — blog dostawcy sprzętu (dynamofitness.com.au)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "nfpt-hack-squat": {"org": "NFPT", "title": "How to do Hack Squats", "url": "https://nfpt.com/how-to-do-hack-squats/", "level": 4},
    "barbend-hack-squat-machine": {"org": "BarBend", "title": "Hack Squat Machine", "url": "https://barbend.com/hack-squat-machine/", "level": 4},
    "breakingmuscle-hack-squat": {"org": "Breaking Muscle", "title": "How to Do the Hack Squat", "url": "https://breakingmuscle.com/hack-squat/", "level": 4},
    "bellsofsteel-hack-squat": {"org": "Bells of Steel", "title": "How To Use Hack Squat Machine?", "url": "https://bellsofsteel.us/blogs/content/how-to-use-hack-squat-machine", "level": 4},
    "nasm-single-leg-press": {"org": "NASM", "title": "Single-Leg Press", "url": "https://www.nasm.org/resource-center/exercise-library/single-leg-press", "level": 4},
    "prehab-single-leg-leg-press-machine": {"org": "The Prehab Guys", "title": "Single Leg Leg Press – Machine", "url": "https://theprehabguys.com/vimeo-video/single-leg-leg-press-machine/", "level": 4},
    "bellsofsteel-belt-squat": {"org": "Bells of Steel", "title": "How To Use A Belt Squat Machine?", "url": "https://bellsofsteel.us/blogs/content/how-to-use-a-belt-squat-machine", "level": 4},
    "barbelllogic-belt-squat": {"org": "Barbell Logic", "title": "How to Do the Belt Squat Exercise", "url": "https://barbell-logic.com/how-to-do-the-belt-squat-exercise/", "level": 4},
    "ritfit-pendulum-squat": {"org": "RitFit", "title": "How to Do the Pendulum Squat", "url": "https://www.ritfitsports.com/blogs/article/how-to-do-the-pendulum-squat", "level": 4},
    "legion-pendulum-squat": {"org": "Legion Athletics", "title": "Pendulum Squat", "url": "https://legionathletics.com/pendulum-squat", "level": 4},
    "fitnessvolt-pendulum-squat": {"org": "Fitness Volt", "title": "Pendulum Squat", "url": "https://fitnessvolt.com/pendulum-squat/", "level": 4},
    "majorfitness-smith-leg-press": {"org": "Major Fitness", "title": "How to Do Leg Press on Smith Machine", "url": "https://www.majorfitness.com/blogs/wiki/how-to-do-leg-press-on-smith-machine-a-step-by-step-guide", "level": 4},
    "dynamo-wide-vertical-leg-press": {"org": "Dynamo Fitness", "title": "Wide Vertical Leg Press", "url": "https://blog.dynamofitness.com.au/?p=3057", "level": 4}
  }
}
```

## Otwarte

- **Hack Squat / `lp.noLock`** — źródła sprzeczne (NFPT, Bells of Steel: bez blokowania; Breaking Muscle: „do wyprostu”). Rozstrzygnie: źródło szczebla 2–3 albo dalsze źródła szczebla 4 z jednoznaczną większością — i tak tylko przy zgodzie wszystkich przeczytanych.
- **Hack Squat / `sq.kneesPast`** — NFPT i Bells of Steel: kolana nie przed palce; nie przenosić tego zdania z przysiadu na hack squat.
- **Hack Squat / `hack.setup`** — szerokość „bioder” ma 1 źródło; czy zastąpić `hack.setup2` także w zestawach ogólnych (`cue-sets.json` używa `hack.move`, nie `hack.setup`) — decyzja koordynatora.
- **Single Leg Press / `lp.heels`** (zestaw ogólny) — 1 źródło (The Prehab Guys). Rozstrzygnie: drugie źródło o prasie jednonóż.
- **Belt Squat Machine** — brak wskazówek/błędów z 2 źródłami; zestaw ogólny `squat` (`sq.down`, `sq.kneesToes`) nie ma źródeł o tej maszynie. Rozstrzygnie: dalsze źródło o maszynie (np. BarBend, NSCA, producent maszyny) z wskazówkami o kolanach/tułowiu.
- **Pendulum Squat** — `lp.heels`, `sq.kneesToes`, `sq.mis.kneesIn` po 1 źródle (RitFit); `hack.hips` — Legion pełne, Fitness Volt tylko dolne plecy. Akceptacja Legion Athletics / Fitness Volt jako szczebel 4 — decyzja koordynatora (bez nich Pendulum ma tylko RitFit).
- **Smith Machine Leg Press** — wskazówki po 1 źródle; warianty różne (ławka/podłoga, nakładka, szeroko). Rozstrzygnie: drugie źródło z instrukcją kolan lub blokowania.
- **Lying Machine Squat** — brak źródła. Rozstrzygnie: biblioteka organizacji szkolącej trenerów albo instrukcja producenta maszyny.
- **Zestawy ogólne (`cue-sets.json`) — informacja o błędach:** dla Pendulum Squat, Lying Machine Squat, Single Leg Press, Smith Machine Leg Press zestaw zawiera zdania, których przeczytane źródła o tych wariantach nie potwierdzają (wyżej przy każdym ćwiczeniu); `lp.move` („platforma”) nie pasuje do prasy na maszynie Smitha.

## Dostęp

- ExRx.net — 403; web.archive.org — zablokowane (nie próbowano ponownie, wg uzupełnienia briefu).
- topendsports.com — host niedostępny w sesji (ENOTFOUND).
- muscleandstrength.com — 403. puregym.com (kopia CDN) — 502.
- barbend.com/belt-squat/ i /belt-squat-benefits/ — 404 (nie znaleziono strony BarBend o belt squat).
- Strony aplikacji treningowych w wynikach wyszukiwania — pominięte celowo.
