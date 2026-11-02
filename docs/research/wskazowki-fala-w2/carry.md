# Wskazówki techniki — rodzina `carry` (fala W2, G6)

- Data: 02.11.2026, fala W2, badacz-merytoryczny (agent)
- Zrobione: błędy wnioskowane i ze źródeł do kart bez błędów (Farmer's Walk, Suitcase Carry, Overhead Carry (hantle), Farmer's Walk (Farmers Handles)); propozycja karty Farmer's Walk (trap bar) jako uproszczenie wariantu sprzętu; ponowne przeczytanie ACE #359 i StrongFirst; nowe źródło szczebla 2 (przegląd systematyczny ćwiczeń strongman, obejmuje suitcase carry). Front Rack i Rickshaw — bez nowych źródeł (W1 wyczerpała temat).
- Podstawa: wyniki W1 (`carry.md`, sekcja „Blok do wdrożenia (po przeliczeniu 02.11.2026)”) — zdań W1 nie badano ponownie.

## Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Farmer's Walk | own (S1M1T1E0) | tylko błędy wnioskowane dopisane | `carry.mis.arms` — wniosek z `carry.two` |
| Suitcase Carry | own (S1M1T1E0) | błędy dopisane (ze źródeł + wnioskowany) | `carry.mis.lean` — NASM (błąd wprost) + NSCA (standard) + przegląd szczebla 2; `carry.mis.arms` — wniosek z `carry.one`. Uwaga: `carry.mis.lean` lustrzane do wskazówki `carry.noLean` |
| Overhead Carry (hantle) | general (W1: własna bez błędów) | gotowe (ustawienie + ruch z W1 + 1 błąd) | `ohc.mis.arms` — StrongFirst (błąd wprost) + wniosek z `ohc.setup` |
| Farmer's Walk (Farmers Handles) | general (W1: własna bez błędów) | gotowe (karta W1 + 1 błąd wnioskowany) | `carry.mis.arms` — wniosek z `carry.two`; karta W1 to uproszczenie: wariant sprzętu (hantle → uchwyty) |
| Farmer's Walk (trap bar) | general (W1: otwarta, brak ustawienia) | częściowe — **uproszczenie, do decyzji koordynatora** | ustawienie `tb.inside` ze źródeł martwego ciągu z trap barem (uproszczenie: wariant sprzętu — podniesienie ramy to ten sam ruch); błąd `carry.mis.arms` wnioskowany z `carry.two` (uproszczenie: wariant sprzętu Farmer's Walk) |
| Double Kettlebell Front Rack Carry | general | otwarte | StrongFirst przeczytany ponownie: opisuje tylko łokieć w dół przy żebrach, nie położenie odważnika; NSCA s. 52 — odważniki z przodu barków. Każda połowa zdania ma jedno źródło |
| Rickshaw Carry | general | otwarte | bez nowych źródeł (W1: brak opisu techniki noszenia) |

## Blok do wdrożenia

```json
{
  "Farmer's Walk": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "carry.mis.arms", "s": [["wniosek", "carry.two"]]}
    ]
  },
  "Suitcase Carry": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "carry.mis.lean", "s": [
        ["nasm-best-abs", "Suitcase Carry / Offset Farmer's Carry („…avoid leaning toward or away from the weight.”)"],
        ["nsca-coach-7-3", "s. 52 (standard: bez bocznego zginania kręgosłupa)"],
        ["hindle-2019-strongman", "Discussion › Unilateral Load Carriage („…ability to maintain a vertical spinal posture”; „tendency for an increase in lateral bend”)"]
      ]},
      {"c": "carry.mis.arms", "s": [["wniosek", "carry.one"]]}
    ]
  },
  "Overhead Carry (hantle)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "ohc.mis.arms", "s": [
        ["strongfirst-two-carries", "Carry No. 2: Overhead (błąd: „…shrugged shoulders and a bent elbow”)"],
        ["wniosek", "ohc.setup"]
      ]}
    ]
  },
  "Farmer's Walk (Farmers Handles)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "carry.mis.arms", "s": [["wniosek", "carry.two"]]}
    ]
  },
  "Farmer's Walk (trap bar)": {
    "setup": [
      {"c": "tb.inside", "s": [
        ["exrx-ErectorSpinae/TBDeadlift", "Preparation (uproszczenie: wariant sprzętu — martwy ciąg z trap barem; podniesienie ramy przed marszem to ten sam ruch)"],
        ["pm-21659894", "abstrakt (stanie wewnątrz ramy; uproszczenie jw.)"]
      ]}
    ],
    "move": [
      {"c": "carry.walk", "s": [
        ["ace-359", "opis (wariant: hantle; marsz na ustalony dystans)"],
        ["nsca-coach-7-3", "s. 52 (wariant: kettlebelle; „walk slow and controlled”)"]
      ]}
    ],
    "tips": [
      {"c": "lunge.torso", "s": [
        ["ace-359", "opis (wariant: hantle; „Keep the back straight…”)"],
        ["nsca-coach-7-3", "s. 52 (wariant: kettlebelle; „maintain an upright torso”)"]
      ]}
    ],
    "mistakes": [
      {"c": "carry.mis.arms", "s": [["wniosek", "carry.two (uproszczenie: wariant sprzętu Farmer's Walk — ręce wzdłuż boków, uchwyty ramy przy biodrach)"]]}
    ]
  }
}
```

Uwaga: `exrx-…` i `pm-21659894` to istniejące wpisy `cues.json` przy `tb.inside` (martwy ciąg z trap barem); w W2 nie czytane ponownie (exrx.net daje 403). Jeśli koordynator nie przyjmie uproszczenia dla ustawienia — trap bar zostaje otwarty jak w W1.

## Nowe zdania

| id | PL | EN | Uzasadnienie |
|---|---|---|---|
| carry.mis.arms | Ręce ugięte w łokciach, ciężar podciągnięty zamiast swobodnie wisieć. | Elbows bent, pulling the weight up instead of letting it hang. | Wniosek: zaprzecza `carry.two` / `carry.one` („ręce opuszczone wzdłuż boków, ciężary przy biodrach”). ACE #359 (przeczytany 02.11.2026): ręce „rest along the sides of the body”. Widoczne na rysunku (kąt łokcia). Jedno zdanie dla jednej i dwóch rąk |
| carry.mis.lean | Przechylanie się w bok — w stronę ciężaru albo od niego. | Leaning to the side, toward the weight or away from it. | Ze źródeł: NASM wprost jako błąd, NSCA (standard), przegląd systematyczny (szczebel 2: pionowa postawa kręgosłupa, skłonność do bocznego zgięcia). Nie jest to rozwinięcie liczb ani zdrowia |
| ohc.mis.arms | Ugięte łokcie i barki podciągnięte do uszu. | Bent elbows and shoulders shrugged up to your ears. | StrongFirst (Carry No. 2) opisuje ten błąd wprost; wniosek z `ohc.setup` („trzymaj je na prostych rękach”). Celowo bez „zablokuj łokcie” — zgodnie z `ohp.mis.lock` |

Istniejące zdania użyte: `carry.two`, `carry.one`, `carry.walk`, `lunge.torso`, `tb.inside`, `ohc.setup` (W1).

## Źródła

| id | Adres | Organizacja | Szczebel | Co przeczytano (02.11.2026) |
|---|---|---|---|---|
| hindle-2019-strongman | https://pmc.ncbi.nlm.nih.gov/articles/PMC6901656/ | Hindle, Lorimer, Winwood, Keogh — Bond University / University of the Sunshine Coast; Sports Medicine – Open 5:49 (2019), DOI 10.1186/s40798-019-0222-z | **2** — przegląd systematyczny w recenzowanym czasopiśmie (strona ma odnośnik do sprostowania; treści sprostowania nie czytano) | Discussion › Unilateral Load Carriage (suitcase carry: pionowa postawa kręgosłupa, boczne zgięcie); Discussion › Bilateral Load Carriage |
| ace-359 | https://www.acefitness.org/resources/everyone/exercise-library/359/farmers-carry/ | ACE | 4 — organizacja certyfikująca, treść firmowana (bez autora i daty na stronie; przyjęte w W1) | pełny opis (ręce wzdłuż boków, ciężary przy biodrach, plecy proste); brak sekcji błędów |
| strongfirst-two-carries | https://www.strongfirst.com/two-important-carries-clinician/ | StrongFirst | warunkowo 4 — autor T. Jewett (instruktor organizacji); **data na stronie niewidoczna** (obrazy i komentarze z 2018). Rozstrzygnięcie: „StrongFirst = warunkowo 4 per strona z autorem” — spełnione | Carry No. 1 (łokieć w dół przy żebrach), Carry No. 2 (łokieć wyprostowany, ramię przy uchu, błąd: uniesione barki i zgięty łokieć) |
| nasm-best-abs, nsca-coach-7-3 | istniejące w `cues.json` | NASM, NSCA | 4 | z W1 / istniejących wpisów (nie czytane ponownie) |

## Otwarte i uwagi dla koordynatora

- **Trap bar — ustawienie z uproszczeniem:** W1 uznała `tb.inside` za analogię (inne ćwiczenie). Brief W2 dopuszcza wariant sprzętu tego samego ruchu; podniesienie ramy jest dosłownie martwym ciągiem z trap barem, ale samo ćwiczenie (marsz) to wariant Farmer's Walk. Decyzja koordynatora; bez niej — otwarte.
- **`carry.mis.lean` a `carry.noLean`:** w Suitcase Carry wskazówka i błąd mówią to samo z dwóch stron (W1 dlatego błędu nie dodała). Opcje: zostawić oba albo przenieść `carry.noLean` z „tips” do błędów. Bez tego Suitcase ma tylko `carry.mis.arms`.
- **Front Rack Carry:** brak jednego zdania ustawienia z dwoma źródłami (patrz tabela). Nadal: `carry.noLean` w zestawie ogólnym nie jest potwierdzone dla obciążenia symetrycznego (W1).
- **Overhead Carry — `carry.walk` w zestawie ogólnym:** tempo sporne (W1) — karta własna W1 z `ohc.walk` je zastępuje; teraz z błędem może wejść.
- Role mięśni: bez nowych ustaleń w W2 (pliku `role-miesni-fala-w2/carry.md` nie tworzę). Przegląd szczebla 2 (wyżej) to prawdopodobnie źródło SN-C4 z W1 — nie daje nowej roli.
