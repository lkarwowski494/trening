# Wskazówki techniki — fala W2, rodzina `leg_machine`

Data: 02.11.2026 · rodzina: `leg_machine` (+ Hack Squat, karta „do poprawy”) · **Status: PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: stan W1 (gałąź badania/g4-nogi, plik `leg_machine.md`) i przeliczenie szczebli 02.11.2026 (plik
`przeliczenie-szczebli-2026-11-02.md`, sekcja `leg_machine.md`) oraz `szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211,
kryteria pkt 1–4, uzupełnienia 1–3). Wszystkie strony niżej przeczytane WebFetch 02.11.2026. Leg Press ma kartę własną — poza zakresem
(poza luką roli, plik ról).

## Zmiana szczebli względem W1 (do przeniesienia do przeliczenia)

Przeliczenie 02.11 nie sprawdziło dwóch źródeł W1 per strona. Po sprawdzeniu oba spadają do 5 (to samo kryterium co Major Fitness i Mikolo
w uzup. 3: blog producenta = 5, 4 tylko instrukcja własnej maszyny):

- `bellsofsteel-hack-squat` **4 → 5**: brak autora; data 09.01.2024; ogólny wpis blogowy, nie nazywa żadnej maszyny Bells of Steel
  (maszyny tylko w „Related Products” z cenami); banery „ON SALE UP TO 41% OFF”, „SHOP LEG PRESSES” (pkt 1–3).
- `bellsofsteel-belt-squat` **4 → 5**: brak autora; data 08.05.2023; ogólny wpis o maszynach do belt squat, link do produktu, baner
  „SHOP STRENGTH MACHINES”, „Related Products” z cenami.
- `barbelllogic-belt-squat` **warunkowo 4 → 5**: strona bez autora i bez daty (tylko „©2026 Barbell Logic”) — uzup. 3 wymaga autora z
  certyfikatem w biogramie i daty.
- `nfpt-hack-squat` **5 → 4** (reguła koordynatora: „by Guest” = 4, gdy ramka autora podaje kwalifikacje): ramka na stronie — „Robert Bovee,
  Certified Master PPT, RTS, ETS, FTS”, data „Posted August 11th, 2025”. Zastrzeżenie z W1: ta sama ramka i data na innej stronie NFPT
  (`?p=4330`), więc może być domyślna dla wpisów gościnnych — jeśli koordynator uzna to za brak autora, Hack Squat wraca do „otwarte”.

Skutek: Hack Squat — dawna para (Bells of Steel + BarBend) przestaje się liczyć; nowa para BarBend + NFPT. Belt Squat — obie dawne
podstawy spadają (0 źródeł szczebla 4 z W1).

## Tabela ćwiczeń

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Hack Squat (karta „do poprawy”) | tak | **gotowe z błędem** (warunek: NFPT = 4 wg reguły ramki) | ustawienie `hack.setup2` (nowe brzmienie), ruch `hack.move`, błąd `hack.mis.hips` (2 źródła wprost) — BarBend + NFPT | `lp.noLock`, `lp.heels` (tylko NFPT); `hack.setup` i `lp.hips` z karty — usunąć (zastąpione) |
| Single Leg Press | tak | **częściowe — warunkowe (uproszczenie, analogia do Leg Press)**, poza blokiem | `slp.setup`, `lp.move`, błąd `lp.mis.lock`: NASM (wprost) + ACE 154 (Leg Press, analogia) | drugie źródło szczebla 4 wprost o prasie jednonóż; decyzja koordynatora o analogii |
| Pendulum Squat | tak | otwarte | Fitness Volt (4 warunkowo) potwierdzony; nowy kandydat Generation Iron (5 wg reguły — patrz Źródła) | drugie źródło szczebla 4 |
| Belt Squat Machine | tak | otwarte | Torokhtiy (4, autor-trener, daty) — 1 źródło; Generation Iron (5) | drugie źródło szczebla 4; dawne źródła W1 spadły do 5 |
| Lying Machine Squat | tak | otwarte | wyszukiwanie 02.11 — tylko strony aplikacji i serwisy bez autora | jakiekolwiek źródło szczebla 4 |
| Smith Machine Leg Press | nie | otwarte | — (Major Fitness = 5 po przeliczeniu → 0 źródeł) | dwa źródła szczebla 4; `lp.move` mówi o platformie |

### Blok do wdrożenia

Zastępuje cały wpis „Hack Squat” w `cues.json` (dotychczasowe `hack.setup` i `lp.hips` oparte na ExRx + analogii z prasą — usunięte;
recenzja 28.10.2026 odrzuciła analogię prasa → hack squat). Wiersz wchodzi tylko, jeśli koordynator przyjmie NFPT = 4 (ramka autora).

```json
{
  "Hack Squat": {
    "setup": [
      {"c": "hack.setup2", "s": [
        ["barbend-hack-squat-machine", "Step 2: Set Your Stance (back against the backrest; head between the shoulder pads; typical squat stance)"],
        ["nfpt-hack-squat", "Setup (shoulders against the shoulder pads, feet on the platform); Options (medium stance: feet shoulder width apart)"]
      ]}
    ],
    "move": [
      {"c": "hack.move", "s": [
        ["barbend-hack-squat-machine", "Step 3: Squat (slide down into a deep squat; push into the plate to return)"],
        ["nfpt-hack-squat", "Movement (bending at the hips and knees, lower the weight)"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "hack.mis.hips", "s": [
        ["barbend-hack-squat-machine", "Common Mistakes (hips and torso connected with the pad at all times; pelvis or lower-back drift)"],
        ["nfpt-hack-squat", "Cautions (do not let your hips come off the pad or arch your back)"]
      ]}
    ]
  }
}
```

### Blok warunkowy — NIE do wdrożenia bez decyzji koordynatora

Single Leg Press: jedno źródło wprost (NASM) + ACE 154 o prasie obunóż jako analogia — `uproszczenie: analogia Leg Press (ta sama
maszyna i tor platformy, pracuje jedna noga)`. Precedens przeciw: recenzja 28.10.2026 odrzuciła analogię prasa → hack squat (tam inna
maszyna; tu ta sama). Część „jedna stopa na platformie” w `slp.setup` ma tylko NASM.

```json
{
  "Single Leg Press": {
    "setup": [
      {"c": "slp.setup", "s": [
        ["nasm-single-leg-press", "Setup (back and head against the backrest; one foot on the platform)"],
        ["ace-154", "Step 1 (uproszczenie: analogia Leg Press — back flat against the backrest)"]
      ]}
    ],
    "move": [
      {"c": "lp.move", "s": [
        ["nasm-single-leg-press", "Movement (press the platform by extending the leg; lower under control)"],
        ["ace-154", "Step 2; Step 4 (uproszczenie: analogia Leg Press)"]
      ]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "lp.mis.lock", "s": [
        ["nasm-single-leg-press", "Movement; Common Mistakes (locking the knee at full extension)"],
        ["ace-154", "Step 3 (uproszczenie: analogia Leg Press — do not hyperextend/lock-out)"]
      ]}
    ]
  }
}
```

## Nowe zdania

| id | PL | EN | uzasadnienie |
|---|---|---|---|
| `hack.setup2` (brzmienie zmienione względem W1) | Oprzyj plecy o oparcie, a barki o poduszki; stopy na platformie jak do zwykłego przysiadu. | Rest your back against the pad and your shoulders under the shoulder pads; feet on the platform in your usual squat stance. | W1 miało „od szerokości bioder do barków” — „bioder” tylko w źródłach szczebla 5. BarBend: „typical squat stance”; NFPT: średnie ustawienie na szerokość barków — część wspólna: zwykłe ustawienie jak do przysiadu. |
| `hack.mis.hips` | Odrywanie bioder albo dolnej części pleców od oparcia. | Hips or lower back coming off the pad. | Błąd ze źródeł (a): BarBend „Common Mistakes” i NFPT „Cautions” wprost. Da się pokazać na rysunku (miednica odchodzi od oparcia w dole ruchu). `lp.hips` (siedzisko, głębokość) nie pasuje do maszyny z oparciem. |
| `lp.mis.lock` (tylko blok warunkowy) | Blokowanie kolana w pełnym wyproście na górze. | Locking the knee out straight at the top. | Odpowiednik błędu dla `lp.noLock`; NASM (prasa jednonóż) „Common Mistakes” wprost; ACE 154 tylko analogia. |

`hack.hips` (W1, wskazówka) — nie dodano do bloku: treść pokrywa się z błędem `hack.mis.hips`; dwa zdania o tym samym na jednej karcie
byłyby powtórzeniem. Przy recenzji lokalizacji: „jak do zwykłego przysiadu” — sprawdzić naturalność.

## Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| `barbend-hack-squat-machine` | https://barbend.com/hack-squat-machine/ | BarBend | Jake Dickson, NASM-CPT, USAW-L2, B.S. Exercise Science; „Last updated on June 3rd, 2025”; bez etykiety „Expert Verified” | 4 (warunkowo 4 BarBend: artykuł techniki z autorem i datą; bez linków produktowych w krokach). Cytat: „Put your back against the backrest and grab the handles.” (Step 2) |
| `nfpt-hack-squat` | https://nfpt.com/how-to-do-hack-squats/ | NFPT | byline „by Guest”; ramka: Robert Bovee, „Certified Master PPT, RTS, ETS, FTS”; „Posted August 11th, 2025” | 4 wg reguły koordynatora (ramka z kwalifikacjami); zastrzeżenie: ramka wspólna z inną stroną. Cytat: „Do not let your hips come off the pad or arch your back at any time during this movement.” (Cautions) |
| `nasm-single-leg-press` | https://www.nasm.org/resource-center/exercise-library/single-leg-press | NASM | firmowane NASM (przeczytane w W1 02.11.2026; nie otwierane ponownie) | 4 (organizacja certyfikująca; precedens docs/research/27) |
| `ace-154` | istniejące w `cues.json` (Leg Press) | ACE | firmowane ACE | 4 — tu tylko analogia (uproszczenie) |
| `fitnessvolt-pendulum-squat` | https://fitnessvolt.com/pendulum-squat/ | Fitness Volt | Patrick Dale, PT, Training Editor; widoczne: „September 22, 2022”, aktualizacja 06.01.2024, „Fact Checked By Dr. Malik” | 4 warunkowo (uzup. 3: autor z kwalifikacjami, data widoczna, nazwany recenzent). Cytat: „Extend your legs and return to the starting position, stopping just short of complete lockout to keep the tension on your quads.” |
| `generationiron-pendulum-squat` | https://generationiron.com/pendulum-squat-exercise-guide/ | Generation Iron | Terry Ramos — „Staff Writer” (strona „o nas”, lista „Our Team”, nie „Our Experts”); B.S. Kinesiology, ACSM CPT, ISSA CSCS; „Published on Jul 5, 2025”; „Fact checked by Don Saladino” (na liście „Our Experts”: „NSAM, Training Coach”); „This post may contain affiliate links” | **5** wg uzup. 3 (4 tylko artykuł podpisany przez osobę z listy ekspertów). Do decyzji koordynatora: autor ma ACSM-CPT w biogramie i recenzenta z listy ekspertów — gdyby to wystarczyło, Pendulum Squat dostaje parę z Fitness Volt. Cytat: „Don't lock out your knees to protect your knees and to keep the tension on your quads.” |
| `generationiron-belt-squat` | https://generationiron.com/belt-squat-exercise-guide/ | Generation Iron | Terry Ramos (jw.); „Published on Jan 19, 2024”; bez recenzenta | 5 (jw., do tego bez recenzenta) |
| `torokhtiy-belt-squat` | https://torokhtiy.com/?p=53888 | Torokhtiy | Ihor Shymechko, „Pro Olympic Weightlifter, Coach”; daty widoczne: 05.06.2023, aktualizacja 23.11.2024 | 4 (warunkowo 4 Torokhtiy, uzup. 2: artykuł techniki z autorem z kwalifikacjami). Artykuł głównie o pasie z obciążeniem, osobna część o maszynie. Cytat: „It's imperative that you don't fully extend the knees when you're in the upward position.” |
| `fitnessvolt-hack-squat` | https://fitnessvolt.com/hack-squat/ | Fitness Volt | Matthew Magnante, ACE; data tylko w metadanych (2019/2024); bez recenzenta | 5 (data tylko w metadanych) |
| `bellsofsteel-hack-squat`, `bellsofsteel-belt-squat`, `barbelllogic-belt-squat` | jak w W1 | — | patrz „Zmiana szczebli” | 5 |
| `elitefts-belt-squats` | https://www.elitefts.com/education/exercise-index/belt-squats | elitefts | Joseph Sullivan (zawodnik, bez kwalifikacji), 20.12.2019; wpis z pasem i kettlebellem, bez instrukcji | nie źródło techniki (brak treści) |

Strony innych aplikacji treningowych (dwie z instrukcją pendulum squat, wyniki dla belt squat, prasy jednonóż i lying machine squat) —
otwarte albo widziane w wynikach i pominięte celowo (nie są źródłem; nazwy poza repo). SimpliFaster (belt squat) — 403.

## Otwarte

- **Hack Squat / warunek NFPT** — jeśli koordynator uzna ramkę „Robert Bovee” za domyślną dla wpisów gościnnych (W1: ta sama na `?p=4330`),
  karta wraca do „otwarte” (zostaje tylko BarBend). Rozstrzygnie: decyzja koordynatora albo trzecie źródło szczebla 4 o hack squat.
- **Hack Squat / `lp.noLock`, `lp.heels`, `sq.mis.kneesIn`** — tylko NFPT (4); Bells of Steel i Fitness Volt (hack) — 5. `sq.kneesPast` — nie
  dodawać (NFPT: kolana nie przed palce; sprzeczne z brzmieniem). Fitness Volt (hack, 5) w jednym artykule podaje dwie szerokości stóp (biodra / barki).
- **Hack Squat / `hack.setup` w zestawach ogólnych** — czy zastąpić `hack.setup2` także tam — decyzja koordynatora (bez zmian względem W1).
- **Single Leg Press** — blok warunkowy (analogia z Leg Press). Rozstrzygnie: decyzja koordynatora o analogii albo drugie źródło szczebla 4
  wprost (wyszukiwanie 02.11: strony aplikacji, sieć siłowni, artykuły dziennikarskie — żadne szczebla 4).
- **Pendulum Squat** — Fitness Volt (4) mówi: plecy o oparcie, barki pod poduszkami, stopy od bioder do barków; zejście, wyprost bez pełnego
  zablokowania. Generation Iron (5) zgodny (barki pod poduszkami, stopy na szerokość barków, „Don't lock out your knees”). Po przyjęciu
  Generation Iron = 4: setup `hack.setup2` (część wspólna: barki — w brzmieniu „jak do przysiadu” też pasuje), ruch `hack.move`, błąd `lp.mis.lock`
  (oba wprost) → gotowe z błędem.
- **Belt Squat Machine** — Torokhtiy (4): pas na biodrach, stopy na szerokość barków, palce na zewnątrz, zejście i wstanie, bez pełnego
  wyprostu kolan. Generation Iron (5) zgodny co do pasa i stóp; Barbell Logic (5) przeczy co do wyprostu („Lock out at the top”).
  `belt.setup` z W1 („nie w talii”) opierało się na Bells of Steel (5) — przy domknięciu skrócić do „pas na biodrach”.
- **Lying Machine Squat** — brak źródła szczebla 4 (wyniki: strony aplikacji, serwis bez autora, zestawienie alternatyw).
- **Smith Machine Leg Press** — po przeliczeniu 0 źródeł szczebla 4.
- **Przeliczenie szczebli** — zmiany Bells of Steel (×2) i Barbell Logic (belt squat) dotyczą też innych plików W1, jeśli tam występują.
