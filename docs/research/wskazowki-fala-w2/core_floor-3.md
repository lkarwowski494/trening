# Wskazówki techniki — fala W2, core_floor część 3 (9 ćwiczeń otwartych z W1) (02.11.2026)

Autor: badacz merytoryczny (agent). Status: PROPOZYCJA — nic nie jest w `lib/` ani w `data/zrodla/`.
Zakres (brief koordynatora grupy G1, 02.11.2026): Crunch - Legs On Exercise Ball, Frog Sit-Ups, Janda Sit-Up, Butt-Ups, Cross-Body Crunch,
Crunch - Hands Overhead, Decline Oblique Crunch, Kneeling Cable Crunch With Alternating Oblique Twists, Leg Pull-In. W W1 i w W2 część 2 wszystkie były „otwarte”.
Szczeble: `docs/research/szczeble-organizacji-2026-11-02.md` z uzupełnieniami 2–3 (Fitness Volt i WebMD Ignite — „warunkowo 4”; liczy się konkretna strona).
Strony czytane przez WebFetch 02.11.2026. Strony aplikacji treningowych pominięte i nigdzie niezapisane. Cytaty najwyżej 1 zdanie.
Dozwolone uproszczenie (brief): wariant pozycji tego samego ruchu na źródłach bazy (brzuszek, `Crunch` w `data/zrodla/cues.json`: `ace-52` + `exrx-RectusAbdominis/BWCrunch`).

## 1. Tabela ćwiczeń

| Klucz | Stan | Zdania | Uwagi |
|---|---|---|---|
| Cross-Body Crunch | gotowe WARUNKOWO (ruch bez skrętu = uproszczenie; p. 5 pyt. 1) | 3 istn. + 1 nowe | ustawienie: Fitness Volt wprost + ACE #52 (baza); ruch: część wspólna z brzuszkiem (zgięcie tułowia, powolny powrót) — zdanie o skręcie ma 1 źródło → otwarte; błąd `core_floor.mis.headPull`: Fitness Volt wprost + wniosek z `crunch.neck` |
| Crunch - Hands Overhead | gotowe BEZ USTAWIENIA (p. 5 pyt. 2) | 2 istn. + 1 istn. z W2 | `uproszczenie: wariant pozycji ramion, baza Crunch` — ruch tułowia ten sam (żebra do miednicy, łopatki od podłogi), ramiona za głową wydłużają tylko dźwignię; ustawienie z rękami za głową bez źródła szczebla 4; błąd `core_floor.mis.archBack`: wniosek z `crunch.lowBack` + uwaga ACE #52 (przodopochylenie miednicy) |
| Crunch - Legs On Exercise Ball | gotowe BEZ USTAWIENIA (p. 5 pyt. 2) | 2 istn. + 1 istn. z W2 | `uproszczenie: wariant pozycji nóg, baza Crunch` — łydki na piłce zamiast stóp na podłodze, ruch tułowia ten sam; ustawienie ma tylko źródła szczebla 5 (VHI, „For Dummies” — W1) |
| Janda Sit-Up | otwarte | 0 | jedno źródło szczebla 4 (Fitness Volt, M. Magnante, ACE CPT); Breaking Muscle i C. Bass = 5; wariant niejednoznaczny (pełny siad czy brzuszek) |
| Frog Sit-Ups | otwarte | 0 | brak źródła szczebla 4 (Fitness Volt: strona 404; Coach, PureGym = 5 — W1); stopy złączone podeszwami — cecha ćwiczenia, której baza nie pokrywa |
| Decline Oblique Crunch | otwarte | 0 | brak źródła szczebla 4 ze skrętem; Fitness Volt — tylko strona „alternatives” bez autora (5) |
| Kneeling Cable Crunch With Alternating Oblique Twists | otwarte | 0 | baza (Cable Crunch) sama nie ma karty własnej (`cue-sets.json`: `"b":"general"`); źródeł ze skrętem brak |
| Leg Pull-In | otwarte | 0 | brak źródła szczebla 4 (Fitness Volt — strona „alternatives” z wersją w zwisie; Physitrack = 5); ruch (zgięcie bioder i kolan z nóg prostych) to nie wariant brzuszka odwrotnego — `rcrunch.*` byłoby analogią |
| Butt-Ups | otwarte | 0 | w W2 niebadane ponownie (limit kontekstu); powód z W1 aktualny (tylko aplikacje, Physitrack = 5) |

Liczba błędów wnioskowanych: 2 (`core_floor.mis.headPull` ← `crunch.neck`; `core_floor.mis.archBack` ← `crunch.lowBack`, użyty w 2 ćwiczeniach).

### Blok do wdrożenia

```json
{
 "Cross-Body Crunch": {
  "setup": [
   {"c": "crunch.setup", "s": [
    ["fv-cross-body-crunch", "How-to, kroki 1–2 („Lie face-up on the floor with your knees bent so that your feet are flat on the ground.”; palce za uszami, łokcie na boki)"],
    ["ace-52", "Step 1; Step 2 (uproszczenie: wariant baza Crunch — to samo ustawienie)"]
   ]}
  ],
  "move": [
   {"c": "crunch.move", "s": [
    ["fv-cross-body-crunch", "How-to, kroki 3–4 (łokieć i przeciwne kolano spotykają się nad pępkiem; powrót) i wskazówki („…slowly return yourself to the starting position during the negatives”)"],
    ["ace-52", "Step 3; Step 4 (uproszczenie: składowa zgięcia tułowia bez skrętu)"]
   ]}
  ],
  "tips": [
   {"c": "crunch.neck", "s": [
    ["fv-cross-body-crunch", "wskazówki („Never pull on your head while performing any variation of a crunch”)"],
    ["ace-52", "Step 3 (szyja rozluźniona) (uproszczenie: wariant baza Crunch)"]
   ]}
  ],
  "mistakes": [
   {"c": "core_floor.mis.headPull", "s": [
    ["fv-cross-body-crunch", "wskazówki („Never pull on your head…”) — błąd wprost"],
    ["wniosek", "crunch.neck"]
   ]}
  ]
 },
 "Crunch - Hands Overhead": {
  "setup": [],
  "move": [
   {"c": "crunch.move", "s": [
    ["ace-52", "Step 3; Step 4 (uproszczenie: wariant pozycji ramion, baza Crunch)"],
    ["exrx-RectusAbdominis/BWCrunch", "Execution (jak w karcie Crunch; uproszczenie: wariant pozycji ramion)"]
   ]}
  ],
  "tips": [
   {"c": "crunch.lowBack", "s": [
    ["ace-52", "Step 3 („Your feet, tailbone and lower back should remain in contact with the mat at all times.”) (uproszczenie: wariant pozycji ramion)"],
    ["exrx-RectusAbdominis/BWCrunch", "Execution (keep low back on mat) (jak w karcie Crunch)"]
   ]}
  ],
  "mistakes": [
   {"c": "core_floor.mis.archBack", "s": [
    ["wniosek", "crunch.lowBack"],
    ["ace-52", "uwaga po Step 4 (szybkie tempo i zginacze bioder: „This technique tilts the pelvis anteriorly… and should be avoided.”) (uproszczenie: baza Crunch)"]
   ]}
  ]
 },
 "Crunch - Legs On Exercise Ball": {
  "setup": [],
  "move": [
   {"c": "crunch.move", "s": [
    ["ace-52", "Step 3; Step 4 (uproszczenie: wariant pozycji nóg — łydki na piłce, baza Crunch)"],
    ["exrx-RectusAbdominis/BWCrunch", "Execution (jak w karcie Crunch; uproszczenie: wariant pozycji nóg)"]
   ]}
  ],
  "tips": [
   {"c": "crunch.lowBack", "s": [
    ["ace-52", "Step 3 (lędźwie i kość ogonowa w kontakcie z matą) (uproszczenie: wariant pozycji nóg)"],
    ["exrx-RectusAbdominis/BWCrunch", "Execution (keep low back on mat) (jak w karcie Crunch)"]
   ]}
  ],
  "mistakes": [
   {"c": "core_floor.mis.archBack", "s": [
    ["wniosek", "crunch.lowBack"],
    ["ace-52", "uwaga po Step 4 (przodopochylenie miednicy — do unikania) (uproszczenie: baza Crunch)"]
   ]}
  ]
 }
}
```

Uwagi do bloku:
- `exrx-RectusAbdominis/BWCrunch` — istniejące źródło karty `Crunch` w `data/zrodla/cues.json` (miejsca przepisane stamtąd); w tej sesji nieczytane ponownie (ExRx 403). `ace-52` przeczytane ponownie 02.11.2026 (Step 1–4 i uwagi po krokach).
- `core_floor.mis.archBack` (nowe z W2 część 2) zaprzecza `crunch.lowBack` wprost: ta sama część ciała, to samo kryterium (lędźwie przy podłodze). Uwaga ACE #52 o przodopochyleniu miednicy jest w bazie „błędem z przyczyną” (szybkie tempo, zginacze bioder) — liczę ją tylko jako wsparcie kierunkowe, nie jako drugie źródło.
- Zestawy ogólne w `cue-sets.json`: Cross-Body Crunch ma `crunch.lowBack` — Fitness Volt tego nie mówi (kolano się unosi), nie wpisane; `mis.jerk` („ciężarem”) — wszystkie trzy ćwiczenia bez obciążenia, nie wpisane. Crunch - Hands Overhead nie ma w zestawie `crunch.neck` i słusznie (ręce nie przy głowie). Crunch - Legs On Exercise Ball ma `crunch.neck` — przy tej karcie nie wpisane, bo bez ustawienia nie wiadomo, gdzie są ręce (W1: VHI — dłonie przy głowie, szczebel 5).

## 3. Nowe zdania

| id | PL | EN (propozycja) | Ćwiczenia | Stan |
|---|---|---|---|---|
| core_floor.mis.headPull | Ciągnięcie głowy rękami. | Pulling on your head with your hands. | Cross-Body Crunch (pasuje do każdego brzuszka z dłońmi za głową) | do bloku |
| core_floor.crossCrunch.twist | Unosząc barki, skręć tułów i zbliż łokieć do przeciwnego kolana; zmieniaj strony. | As you lift your shoulders, twist and bring your elbow toward the opposite knee; alternate sides. | Cross-Body Crunch | otwarte — jedno źródło (Fitness Volt, kroki 3–5) |

Użyte istniejące zdania: `crunch.setup`, `crunch.move`, `crunch.neck`, `crunch.lowBack` (`lib/cues/text/pl.json`), `core_floor.mis.archBack` (W2 część 2).
Uwaga do `core_floor.mis.neckPull` (W2 część 2, „Ciągnięcie głowy szyją zamiast unoszenia barków”): to inny błąd (praca szyją) niż `headPull` (dłonie ciągną głowę) — przy łączeniu nie scalać.

## 4. Źródła

| id | adres | organizacja | szczebel (uzasadnienie) | miejsce |
|---|---|---|---|---|
| ace-52 (istn.) | https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/ | ACE | 4 (organizacja certyfikująca, treść firmowana przez ACE) | Step 1–4; uwagi po Step 4 |
| exrx-RectusAbdominis/BWCrunch (istn.) | wg `sources` w `data/zrodla/cues.json` | ExRx | 4 (precedens) — w tej sesji 403, miejsca z karty `Crunch` | Preparation / Execution |
| fv-cross-body-crunch (nowe) | https://fitnessvolt.com/cross-body-crunch/ | Fitness Volt | 4 warunkowo spełnione — autor w podpisie: Matthew Magnante, ACE CPT; opubl. 23.11.2020, akt. 11.08.2024; recenzenta brak | How-to kroki 1–5; wskazówki (głowa, tempo, powrót) |
| fv-janda-situp (nowe, tylko do otwartych) | https://fitnessvolt.com/janda-sit-up/ | Fitness Volt | 4 warunkowo spełnione — ten sam autor (ACE CPT); opubl. 22.07.2021, akt. 11.08.2024; recenzenta brak | kroki 1–5 (wersja z partnerem trzymającym łydki); wskazówki („The key here is to not allow your toes to lift up…”) |

Niezależność: Fitness Volt i ACE — różni wydawcy. Autor Fitness Volt ma certyfikat ACE, ale tekst jest jego, nie ACE.
Odrzucone w tej sesji (nie źródła): columbiadoctors.org „curl arms extended”, „diagonal curl”, „diagonal curl-up (arms extended)” (WebMD Ignite, current as of 01.05.2026 — szczebel 4 warunkowo, ale opisują inne ruchy: sięganie rękami do ud / w bok, skręt w siadzie; żaden nie ma rąk za głową ani łokcia do kolana); commonspirit.org (ta sama treść WebMD Ignite — nie niezależne); cisat.jmu.edu „intermediate core training.pdf” (503); fitnessvolt.com/frog-sit-ups/ (404); strony „substitute-exercises” Fitness Volt (bez autora → 5); The Prehab Guys — biblioteka filmów (bez artykułu z autorem); StrongFirst — tylko wpisy forum (społeczność bez redakcji → 5).

## 5. Otwarte i pytania do koordynatora

1. **[DO DECYZJI] Cross-Body Crunch — ruch bez skrętu.** Karta używa `crunch.move` (część wspólna: zgięcie tułowia i powolny powrót), a zdanie o skręcie łokcia do przeciwnego kolana ma jedno źródło szczebla 4 → otwarte. Opcje: (A) karta jak w bloku, skręt pokazuje figura; (B) karta „częściowa” do czasu drugiego źródła skrętu. Rekomendacja badacza: B, jeśli figura nie pokazuje skrętu wyraźnie — inaczej A. Wariant: Fitness Volt opisuje kolano unoszone na spotkanie łokcia; `note` katalogu („elbow to the opposite knee”) tego nie rozstrzyga.
2. **[DO DECYZJI] Crunch - Hands Overhead i Crunch - Legs On Exercise Ball — brak ustawienia.** Ruch, wskazówka i błąd mają źródła (baza Crunch), ustawienie (ręce wyprostowane za głową / łydki na piłce) — tylko szczebel 5 albo nic. Wg briefu „gotowe” wymaga ustawienia; proszę o decyzję, czy karta bez `setup` może wejść (figura pokazuje ustawienie). Kandydaci zdań ustawienia: `core_floor.legsBall.setup` (W1) i nowe „Połóż się na plecach, kolana ugięte, ręce wyprostowane za głową.” — bez źródła.
3. Janda Sit-Up — jedno źródło szczebla 4 (Fitness Volt). Kandydat: `core_floor.janda.move` (W1) potwierdzony też przez Fitness Volt (krok 3: „Pull your heels toward your butt (feet should not move though) and tense your hamstrings, glutes, and core.”) → nadal „jedno źródło”. Rozbieżność wariantu: oryginał to kontrolowany brzuszek, wersja z książki P. Tsatsouline’a — pełny siad (wg wyników wyszukiwania, nieprzeczytane) — przed kartą ustalić, co pokazuje figura. Twierdzenia o „wyłączaniu zginaczy bioder” — o działaniu, nie do aplikacji.
4. Frog Sit-Ups, Decline Oblique Crunch, Kneeling Cable Crunch With Alternating Oblique Twists, Leg Pull-In, Butt-Ups — brak źródeł szczebla 4 (powody w tabeli). Tropy: JMU (503), Healthline (artykuły z recenzentem) dla „cable oblique crunch”, „frog crunch”; dokumentacja producentów wyciągów.
5. `mis.jerk` w zestawach ogólnych wszystkich 9 ćwiczeń mówi o „ciężarze” — 7 z nich jest bez obciążenia; prawdopodobny błąd zestawu ogólnego (jak w W2 część 2, p. 6).

## 6. Role mięśni

Nie dotyczy (sprawdzone): `muscleRoleRows` pokazuje tylko regiony z udziałem ≥ `MUSCLE_MIN_LOAD` = 0,5 (`lib/figures/v2/muscles.ts:15`, filtr w `lib/muscleRoles.ts:57`). Udziały z `MUSCLE_LOAD` (`lib/catalog.generated.ts:1321–1339`): wiersze 0,25 (skośne, naramienny przedni, czworogłowe, kulszowo-goleniowe, pośladkowe) nie są wyświetlane. Wiersze bez roli dziś: tylko `abs` 0,5 w Cross-Body Crunch i Decline Oblique Crunch (reguła `core_flexion` + `abs` ma tylko `main` — `lib/muscleRoles/data.json`) — oba pokrywa propozycja W1 (`role/core_floor.md`, wiersze 46–47, reguła `core_flexion` + `abs` + `aux` → `abs.trunk_flex`, „gotowe”). Nowego pliku ról nie tworzę.

## 7. Stan

- Zrobione (02.11.2026): 9 ćwiczeń przejrzanych; 1 gotowe warunkowo (Cross-Body Crunch), 2 z błędem bez ustawienia (Hands Overhead, Legs On Exercise Ball), 6 otwartych; 2 błędy wnioskowane; 1 nowe zdanie do bloku + 1 kandydat; 2 nowe źródła (Fitness Volt).
- Zostało: drugie źródło skrętu (Cross-Body), ustawienia (pyt. 2), Janda, Frog, Decline Oblique, Kneeling Cable z twistem, Leg Pull-In, Butt-Ups.
- Następny krok: Healthline (strony z nazwanym recenzentem) i BarBend dla „bicycle/cross crunch”, „frog crunch”, „cable oblique crunch”; ponowić JMU.
- Pułapki: Fitness Volt — strony „substitute-exercises” bez autora (5), adresy bez tej części mają autora; columbiadoctors.org i commonspirit.org to ta sama treść WebMD Ignite; ExRx 403.
