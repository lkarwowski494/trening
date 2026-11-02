# Wskazówki techniki — rodzina `leg_machine` (+ Hack Squat, karta „do poprawy”)

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 02.11.2026

Zastosowano rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = (a) organizacja szkoląca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść firmowana; (c) nie marketing ani afiliacja; Breaking Muscle — 5 i nigdy niezależne od BarBend).

- Zmienione szczeble:
  - `Breaking Muscle` 4 → **5** (lista koordynatora).
  - `NFPT` (`nfpt-hack-squat`) 4 → **5**: sprawdzone 02.11 — byline „by Guest”, autor artykułu nie jest wskazany; biogram (Robert Bovee) i data 11.08.2025 są identyczne na innej sprawdzonej stronie NFPT (`?p=4330`, wspięcia „donkey”), więc wyglądają na wspólne dla serwisu, nie na dane autora. Reguła wymaga autora, daty i kwalifikacji w biogramie — autor niespełniony.
  - `Legion Athletics` „4? do akceptacji” → **5**: firma sprzedająca suplementy, artykuł autora-właściciela; nie organizacja szkoląca trenerów, nie producent sprzętu, brak recenzji eksperckiej — nie spełnia (a), (c) wątpliwe.
  - `Fitness Volt` „4? do akceptacji” → **5** (ocena i sprawdzenie strony w `kneeling_hinge.md`).
  - `Dynamo Fitness` 4 → **5** (dostawca/sprzedawca sprzętu, nie producent).
- Sprawdzone i potwierdzone 4: BarBend `hack-squat-machine` — artykuł o technice (Jake Dickson, NASM-CPT, USAW-L2; aktualizacja 03.06.2025; bez linków produktowych w treści); Bells of Steel — producent maszyn (hack squat, belt squat); Major Fitness — marka własnych maszyn Smitha; Barbell Logic — firma szkoląca trenerów (spełnia (a); autor/data nieodnotowane — dotyczy tylko ćwiczenia otwartego); RitFit — producent sprzętu (czy produkuje maszynę do pendulum squat — nieodnotowane; dotyczy tylko ćwiczenia otwartego).
- Ćwiczenia, które spadły do otwartych: **Hack Squat** (gotowe → otwarte). Po korekcie zostają tylko `hack.setup2` i `hack.move` (Bells of Steel + BarBend); `lp.heels` (NFPT + Breaking Muscle), `hack.hips` (BarBend + NFPT + Breaking Muscle → 1), `sq.kneesToes` i `sq.mis.kneesIn` (Bells of Steel + Breaking Muscle) tracą drugie źródło. Karta Hack Squat zostaje ukryta jak dotąd („do poprawy”).
- Zdania usunięte z bloku JSON: 4 (Hack Squat: `lp.heels`, `hack.hips`, `sq.kneesToes`, `sq.mis.kneesIn`); `hack.setup2`, `hack.move` przeniesione do danych częściowych.
- Single Leg Press — bez zmian, gotowe. Belt Squat, Pendulum Squat, Smith Machine Leg Press — były otwarte; Pendulum i Smith Machine Leg Press po korekcie nie mają już żadnego zdania z 2 źródłami szczebla 4.
- Oznaczenia „DO AKCEPTACJI” i „4?” usunięte — zastąpione oceną wyżej.

Metoda: jak w `docs/research/33-wskazowki-partia2.md` (wyjątek dla wskazówek techniki z CLAUDE.md: 2 zgodne, niezależne
źródła szczebla 4 z różnych organizacji, przeczytane; żadne przeczytane nie przeczy; bez liczb i bez uzasadnień zdrowotnych).
ExRx (403) i web.archive.org (zablokowane) w tej sesji niedostępne — zgodnie z uzupełnieniem briefu nie liczone.
Strony innych aplikacji treningowych pominięte (nie są źródłem, nazwy poza plikiem).

## Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Hack Squat | **otwarte (korekta 02.11)** | ustawienie (`hack.setup2`) i ruch (`hack.move`) — Bells of Steel + BarBend; wskazówek/błędów z 2 źródłami szczebla 4 — 0 |
| Single Leg Press | **gotowe** (1 nowe zdanie) | NASM + The Prehab Guys; `lp.heels` z zestawu ogólnego bez 2 źródeł |
| Belt Squat Machine | otwarte | ustawienie i ruch mają 2 źródła (Bells of Steel, Barbell Logic); wskazówek/błędów z 2 źródłami — 0 |
| Pendulum Squat | otwarte | po korekcie tylko RitFit (4); Legion Athletics i Fitness Volt — 5 |
| Smith Machine Leg Press | otwarte | po korekcie tylko Major Fitness (4); Dynamo Fitness — 5 |
| Lying Machine Squat | otwarte | brak przeczytanego źródła (wyniki to strony aplikacji i strony bez treści) |

## A. Hack Squat (karta „do poprawy”, `figury-recenzja.json`)

Problem z recenzji 28.10.2026: każde z 5 zdań miało jedno źródło o hack squat (ExRx, nieczytelne 28.10 i dziś) i drugie o prasie
nóg (analogia). Przeczytano cztery źródła o hack squat na maszynie: NFPT, BarBend, Breaking Muscle, Bells of Steel (producent maszyn
do hack squat). Po korekcie szczebli 02.11 liczą się tylko BarBend i Bells of Steel (NFPT i Breaking Muscle — 5).

### Wynik dla zdań (po korekcie)

| Zdanie | Wynik | Źródła szczebla 4 (przeczytane 02.11.2026) | Uwagi |
|---|---|---|---|
| `hack.setup` (plecy o oparcie, stopy ~ szerokość bioder) | **nie — proponuję `hack.setup2`** | szerokość: Bells of Steel krok 1 — szerokość barków lub trochę szerzej; BarBend „Step 2” — zwykłe ustawienie jak do przysiadu | „Mniej więcej na szerokość bioder” miało tylko Breaking Muscle (5). |
| `hack.setup2` | **2 źródła** | Bells of Steel krok 1; BarBend „Step 2” (plecy o oparcie, głowa między poduszkami) | (NFPT „Setup”, Breaking Muscle „Step 1” — 5, zgodne) |
| `hack.move` | **2 źródła** | Bells of Steel kroki 3–4; BarBend „Step 3” | (NFPT „Movement” — 5, zgodne) |
| `lp.heels` | **1 źródło szczebla 4 — nie** | — (NFPT „Cautions”, Breaking Muscle „Step 1” — oba 5) | — |
| `hack.hips` / `lp.hips` | **1 źródło szczebla 4 — nie** | BarBend „Common Mistakes” | (NFPT „Cautions”, Breaking Muscle „Step 2” — 5). `lp.hips` i tak nie pasuje: żadne źródło nie łączy oderwania bioder z głębokością. |
| `sq.kneesToes`, `sq.mis.kneesIn` | **1 źródło szczebla 4 — nie** | Bells of Steel „Tips” | (Breaking Muscle „Step 3” — 5) |
| `lp.noLock` | **1 źródło szczebla 4 — nie** | Bells of Steel | NFPT (5) zgodne; Breaking Muscle (5) „Lift Strong to Lockout” przeczy, ale ma niższy szczebel. |

**Uwaga tłumacza (EN `lp.hips` „seat”):** `lp.hips` występuje w `cues.json` tylko przy **Leg Press** i **Hack Squat** (2 wystąpienia;
w `cue-sets.json` i `wskazowki-ogolne.json` brak). Przy Leg Press „seat” zgadza się ze źródłem (ACE 154, kroki 3–4: pośladki
odrywają się od siedziska) — **EN `lp.hips` zostaje bez zmian**. Przy Hack Squat maszyna ma oparcie, nie siedzisko: osobne zdanie
`hack.hips` z EN „pad” zamiast zmiany wspólnego zdania — do użycia, gdy dostanie drugie źródło szczebla 4.

Nie dodawać do Hack Squat: `sq.kneesPast` — Bells of Steel (i NFPT): kolana nie przed palce stóp; to stoi w sprzeczności z brzmieniem `sq.kneesPast`.

Dane częściowe (nie do `cues.json`, ćwiczenie otwarte):

```json
{
  "Hack Squat (częściowe)": {
    "setup": [
      {"c": "hack.setup2", "s": [
        ["bellsofsteel-hack-squat", "Step-by-step 1 (feet shoulder-width apart or slightly wider)"],
        ["barbend-hack-squat-machine", "Step 2 Set Your Stance (back against the backrest; head between the shoulder pads)"]
      ]}
    ],
    "move": [
      {"c": "hack.move", "s": [
        ["bellsofsteel-hack-squat", "Step-by-step 3–4 (lower yourself; push back up by extending your legs)"],
        ["barbend-hack-squat-machine", "Step 3 Squat"]
      ]}
    ],
    "tips": [],
    "mistakes": []
  }
}
```

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

Ocena (zamiast „do decyzji recenzenta”): przy `sq.mis.kneesIn` The Prehab Guys mówi o „obracaniu nogi do środka albo na zewnątrz” — to ten sam błąd toru kolana, kierunkowo zgodny z NASM, więc liczę go jako drugie źródło; recenzja niezależna (bramka 4) może to zakwestionować — wtedy ćwiczenie spada do „otwarte”.
Zestaw ogólny (`cue-sets.json`) ma też `lp.heels` — tu tylko The Prehab Guys („nacisk przez palce i pięty”), NASM nie mówi o piętach → nie wpisano.

### Belt Squat Machine — otwarte

Przeczytane: Bells of Steel „How To Use A Belt Squat Machine?” (producent maszyn, 4) i Barbell Logic „How to do the belt squat exercise”
(firma szkoląca trenerów, 4). Gotowe częściowo:
- `belt.setup` (nowe): Bells of Steel — pas na biodrach, nie w talii; stopy na szerokość barków; Barbell Logic „Set Up” — pas wokół bioder, przypięty do maszyny; stopy na szerokość barków.
- `belt.move` (nowe): Bells of Steel — opuszczaj się pod kontrolą, wstań, wypychając nogami; Barbell Logic „Descending”/„Standing” — zejdź pod kontrolą, wstań.
- Wskazówki: `sq.back` — Bells of Steel (klatka uniesiona, tylko omówienie) i Barbell Logic (tułów napięty i w stałej pozycji) — za słabo na „proste plecy”. Uchwyty tylko dla równowagi — tylko Barbell Logic.
- Stopy: Bells of Steel ma sprzeczne zdania o palcach (na zewnątrz / do przodu) → bez wskazówki o palcach.
Zestaw ogólny (rodzina `squat`: `sq.down`, `sq.back`, `sq.kneesToes`) — żadne przeczytane źródło o tej maszynie nie mówi o cofaniu bioder ani o linii kolan.

### Pendulum Squat — otwarte

Przeczytane: RitFit „How to do the pendulum squat” (producent sprzętu, 4), Legion Athletics „Pendulum Squat” (5 po korekcie),
Fitness Volt „Pendulum Squat” (5 po korekcie). Po korekcie każde zdanie ma tylko RitFit jako źródło szczebla 4:
- `hack.setup2`: RitFit (poduszki na górze barków, stopy na szerokość barków); Fitness Volt, Legion — 5.
- `hack.move`: RitFit (ugnij razem kolana i biodra; wyprostuj kolana i biodra); Legion, Fitness Volt — 5.
- `lp.noLock`: RitFit (bez twardego wyprostu kolan); Fitness Volt — 5.
- `lp.heels`, `sq.kneesToes`, `sq.mis.kneesIn` — tylko RitFit; `hack.hips` — Legion, Fitness Volt (oba 5).
Zestaw ogólny (`hack.move`, `sq.kneesToes`, `lp.heels`, `sq.mis.kneesIn`) — po korekcie żadne zdanie nie ma 2 źródeł.

### Smith Machine Leg Press — otwarte

Przeczytane: Major Fitness „How to do leg press on Smith machine” (marka maszyn Smitha, 4; ławka pod sztangą, stopy na sztandze
na szerokość barków) i Dynamo Fitness „Wide Vertical Leg Press” (sprzedawca sprzętu, 5; leżenie na podłodze, nakładka do prasy, szeroko).
- `smlp.setup`, `smlp.move` — po korekcie 1 źródło szczebla 4 (Major Fitness).
- Wskazówki po 1 źródle: nie blokuj kolan, plecy płasko na ławce (Major Fitness). Dynamo każe kolanom iść na zewnątrz (wariant szeroki) — nie przenosić `sq.kneesToes`.
Zestaw ogólny (`lp.move` „platforma”, `lp.heels`, `lp.noLock`, `sq.mis.kneesIn`) — `lp.move` mówi o platformie, a tu jest sztanga; pozostałe — po 1 źródle albo brak.

### Lying Machine Squat — otwarte

Brak przeczytanego źródła o tej maszynie: wyniki wyszukiwania to strony aplikacji treningowych (nie są źródłem) i strona sklepu z
suplementami bez treści instrukcji. Zestaw ogólny (`hack.move`, `sq.kneesToes`, `lp.heels`, `sq.mis.kneesIn`) nie ma tu żadnego źródła.

## Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `slp.setup` | Usiądź w maszynie plecami na oparciu; jedną stopę postaw na platformie, drugą nogę zdejmij i trzymaj spokojnie. | Sit in the machine with your back against the backrest; put one foot on the platform, take the other leg off and keep it still. | `lp.setup` mówi o obu stopach i kącie kolan. |
| `hack.setup2` (otwarte ćwiczenie) | Oprzyj plecy o oparcie, a barki o poduszki; stopy na platformie mniej więcej od szerokości bioder do szerokości barków. | Rest your back against the pad and your shoulders under the shoulder pads; feet on the platform somewhere between hip- and shoulder-width. | `hack.setup` („na szerokość bioder”) nie ma 2 źródeł szczebla 4. |
| `hack.hips` (otwarte ćwiczenie) | Biodra i plecy cały czas przy oparciu. | Keep your hips and back against the pad the whole time. | `lp.hips` łączy oderwanie miednicy z głębokością (prasa); EN „seat” nie pasuje. Po korekcie 1 źródło szczebla 4. |
| `belt.setup` (otwarte ćwiczenie) | Zapnij pas na biodrach, nie w talii; stań na platformie, stopy mniej więcej na szerokość barków. | Put the belt around your hips, not your waist; stand on the platform, feet about shoulder-width apart. | Brak zdania o pasie. |
| `belt.move` (otwarte ćwiczenie) | Zejdź w przysiad pod kontrolą, potem wstań, wypychając się nogami. | Squat down under control, then stand up by driving through your legs. | `sq.down` zawiera cofanie bioder — źródła o maszynie tego nie mówią. |
| `smlp.setup` (otwarte ćwiczenie) | Połóż się na plecach pod sztangą maszyny Smitha i oprzyj o nią stopy. | Lie on your back under the Smith machine bar and put your feet against it. | Brak zdania o tym ustawieniu. Po korekcie 1 źródło szczebla 4. |
| `smlp.move` (otwarte ćwiczenie) | Opuść sztangę, uginając kolana, potem wypchnij ją w górę, prostując nogi. | Lower the bar by bending your knees, then press it back up by straightening your legs. | `lp.move` mówi o platformie. Po korekcie 1 źródło szczebla 4. |

Zdania przy otwartych ćwiczeniach — do użycia dopiero, gdy ćwiczenie dostanie brakujące zdania z 2 źródłami. PL/EN — do przeglądu
recenzenta lokalizacji (naturalność).

## Nowe źródła

| id | adres | organizacja | szczebel | miejsce / krótki cytat |
|---|---|---|---|---|
| `nfpt-hack-squat` | https://nfpt.com/how-to-do-hack-squats/ | NFPT — nowa | 5 (korekta 02.11: byline „Guest”, autor niewskazany) | „Push up against the shoulder pads until you are in a standing position.” (Setup) |
| `barbend-hack-squat-machine` | https://barbend.com/hack-squat-machine/ | BarBend | 4 (artykuł o technice, J. Dickson, 03.06.2025) | „Put your back against the backrest and grab the handles.” (Step 2) |
| `breakingmuscle-hack-squat` | https://breakingmuscle.com/hack-squat/ (L. Boyce) | Breaking Muscle | 5 (korekta 02.11) | „maintain contact between your hips and the pad” (Step 2) |
| `bellsofsteel-hack-squat` | https://bellsofsteel.us/blogs/content/how-to-use-hack-squat-machine | Bells of Steel (producent maszyn) — nowa | 4 | „Do not let your knees cave in or go past your toes.” (Tips) |
| `nasm-single-leg-press` | https://www.nasm.org/resource-center/exercise-library/single-leg-press | NASM | 4 | „Sit on the leg press machine with your back and head firmly against the backrest.” (Setup) |
| `prehab-single-leg-leg-press-machine` | https://theprehabguys.com/vimeo-video/single-leg-leg-press-machine/ | The Prehab Guys | 4 | „Do not lock out the knees at the end of the press motion.” (Compensations) |
| `bellsofsteel-belt-squat` | https://bellsofsteel.us/blogs/content/how-to-use-a-belt-squat-machine | Bells of Steel | 4 | pas na biodrach, nie w talii (Setup) |
| `barbelllogic-belt-squat` | https://barbell-logic.com/how-to-do-the-belt-squat-exercise/ | Barbell Logic (szkolenie trenerów) — nowa | 4 | „Place the belt around your hips and clip it to the machine.” (Set Up) |
| `ritfit-pendulum-squat` | https://www.ritfitsports.com/blogs/article/how-to-do-the-pendulum-squat | RitFit (producent sprzętu) — nowa | 4 | „Bend the knees and hips together while keeping your heels down and knees tracking with the toes.” |
| `legion-pendulum-squat` | https://legionathletics.com/pendulum-squat | Legion Athletics — nowa | 5 (korekta 02.11) | Setup / Descend (plecy i biodra na oparciu) |
| `fitnessvolt-pendulum-squat` | https://fitnessvolt.com/pendulum-squat/ | Fitness Volt — nowa | 5 (korekta 02.11) | „stopping just short of complete lockout” |
| `majorfitness-smith-leg-press` | https://www.majorfitness.com/blogs/wiki/how-to-do-leg-press-on-smith-machine-a-step-by-step-guide | Major Fitness — nowa | 4 (tylko maszyna Smitha) | Positioning, Executing the Press |
| `dynamo-wide-vertical-leg-press` | https://blog.dynamofitness.com.au/?p=3057 | Dynamo Fitness (sprzedawca sprzętu) — nowa | 5 (korekta 02.11) | „Lie on your back with your legs extended towards the ceiling” |

### Nowe źródła — JSON (tylko źródła gotowego ćwiczenia; pozostałe — po zasileniu gotowej karty)

```json
{
  "sources": {
    "nasm-single-leg-press": {"org": "NASM", "title": "Single-Leg Press", "url": "https://www.nasm.org/resource-center/exercise-library/single-leg-press", "level": 4},
    "prehab-single-leg-leg-press-machine": {"org": "The Prehab Guys", "title": "Single Leg Leg Press – Machine", "url": "https://theprehabguys.com/vimeo-video/single-leg-leg-press-machine/", "level": 4}
  }
}
```

Organizacje do `orgs` (gdy zasilą gotowe ćwiczenie): `Bells of Steel` (4, maker — tylko własny rodzaj sprzętu), `Barbell Logic` (4, org szkoląca trenerów), `RitFit` (4, maker — tylko własny rodzaj sprzętu), `Major Fitness` (4, maker — maszyna Smitha), `NFPT` (4 tylko artykuł z autorem, datą i biogramem; `nfpt-hack-squat` — 5), `Legion Athletics` (5), `Fitness Volt` (5), `Dynamo Fitness` (5).

## Otwarte

- **Hack Squat** (korekta 02.11) — po korekcie wskazówek/błędów z 2 źródłami szczebla 4 brak. Kandydaci: `hack.hips` (BarBend; drugie potrzebne), `sq.kneesToes`/`sq.mis.kneesIn` i `lp.noLock` (Bells of Steel; drugie potrzebne), `lp.heels` (brak źródła 4). Rozstrzygnie: drugie źródło szczebla 4 o hack squat (inny producent maszyny, organizacja szkoląca trenerów, artykuł NFPT z wskazanym autorem). `lp.noLock` — Breaking Muscle (5) przeczy, ale przegrywa szczeblem.
- **Hack Squat / `sq.kneesPast`** — Bells of Steel (i NFPT): kolana nie przed palce; nie przenosić tego zdania z przysiadu na hack squat.
- **Hack Squat / `hack.setup`** — szerokość „bioder” bez 2 źródeł szczebla 4; czy zastąpić `hack.setup2` także w zestawach ogólnych — decyzja koordynatora.
- **NFPT „Guest”** — jeśli koordynator ustali autora artykułów NFPT (np. biogram Roberta Bovee to autor), `nfpt-hack-squat` wraca do 4 i Hack Squat dostaje `hack.hips` (BarBend + NFPT) oraz `lp.noLock` (Bells of Steel + NFPT) → gotowe.
- **Single Leg Press / `lp.heels`** (zestaw ogólny) — 1 źródło (The Prehab Guys). Rozstrzygnie: drugie źródło o prasie jednonóż.
- **Belt Squat Machine** — brak wskazówek/błędów z 2 źródłami; zestaw ogólny `squat` (`sq.down`, `sq.kneesToes`) nie ma źródeł o tej maszynie. Rozstrzygnie: dalsze źródło szczebla 4 o maszynie z wskazówkami o kolanach/tułowiu.
- **Pendulum Squat** — po korekcie tylko RitFit (4). Rozstrzygnie: drugie źródło szczebla 4 (producent maszyny, organizacja szkoląca trenerów).
- **Smith Machine Leg Press** — po korekcie tylko Major Fitness (4); warianty różne (ławka/podłoga, nakładka, szeroko). Rozstrzygnie: drugie źródło szczebla 4.
- **Lying Machine Squat** — brak źródła. Rozstrzygnie: biblioteka organizacji szkolącej trenerów albo instrukcja producenta maszyny.
- **Zestawy ogólne (`cue-sets.json`) — informacja o błędach:** dla Hack Squat, Pendulum Squat, Lying Machine Squat, Single Leg Press, Smith Machine Leg Press zestaw zawiera zdania, których przeczytane źródła szczebla 4 o tych wariantach nie potwierdzają (wyżej przy każdym ćwiczeniu); `lp.move` („platforma”) nie pasuje do prasy na maszynie Smitha.

## Dostęp

- ExRx.net — 403; web.archive.org — zablokowane (nie próbowano ponownie, wg uzupełnienia briefu).
- topendsports.com — host niedostępny w sesji (ENOTFOUND).
- muscleandstrength.com — 403. puregym.com (kopia CDN) — 502.
- barbend.com/belt-squat/ i /belt-squat-benefits/ — 404 (nie znaleziono strony BarBend o belt squat).
- Strony aplikacji treningowych w wynikach wyszukiwania — pominięte celowo.
