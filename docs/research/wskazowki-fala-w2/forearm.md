# Wskazówki techniki — rodzina `forearm` (fala W2, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Fala W2. Zrobione: (1) błąd wnioskowany `wr.mis.lift` (zdanie istniejące) dla 3 kart W1 z oparciem przedramion; (2) Wrist Roller — 2 błędy
  wnioskowane (nowe zdania); (3) 4 karty, które w przeliczeniu W1 spadły (Reverse Wrist Curl hantle, One-Arm ×2, Cable Wrist Curl) — teraz z zasadą
  „wariant sprzętu” z briefu W2 (ACE + Catalyst przeczytane ponownie 02.11.2026) + błąd wnioskowany; (4) Plate Pinch — karta (open) z 2 źródeł
  szczebla 4 (jedno jako wariant) + błąd; (5) Behind-the-Back Barbell Wrist Curl, Reverse Plate Curls, Lying Pronation/Supination — otwarte.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1. Strony czytane WebFetch 02.11.2026.

## 1. Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Wrist Curl (hantle) | general `wrist` | tylko błędy wnioskowane dopisane (1) | karta W1 + `wr.mis.lift` (wniosek z `wr.setupUp`) |
| Barbell Wrist Curl | general `wrist` | tylko błędy wnioskowane dopisane (1) | jw. |
| Barbell Reverse Wrist Curl | general `wrist` | tylko błędy wnioskowane dopisane (1) | `wr.mis.lift` (wniosek z `wr.setupDown`) |
| Reverse Wrist Curl (hantle) | general `wrist` | gotowe (uproszczenie) | `wr.setupDown`, `wr.revMove`: ace-29 wprost + catalyst-wrist-ext (`uproszczenie: wariant sprzętu sztanga` — ten sam ruch nadgarstka w nachwycie, przedramiona podparte) |
| One-Arm Dumbbell Wrist Curl | general `wrist` | gotowe (uproszczenie) | `wr.setupUp`, `wr.range`: ace-30 (oburącz) + catalyst-wrist-curl (sztanga); `uproszczenie: wariant sprzętu hantle oburącz/sztanga` — jedna ręka nie zmienia ruchu nadgarstka |
| One-Arm Dumbbell Reverse Wrist Curl | general `wrist` | gotowe (uproszczenie) | `wr.setupDown`, `wr.revMove`: ace-29 + catalyst-wrist-ext; jw. |
| Cable Wrist Curl | general `wrist` | gotowe (uproszczenie) | `wr.setupUp`, `wr.range`: catalyst-wrist-curl + ace-30; `uproszczenie: wariant sprzętu sztanga/hantle` — linka dolnego wyciągu ciągnie w dół jak ciężar wolny przy podpartych przedramionach |
| Wrist Roller | open | tylko błędy wnioskowane dopisane (2) | karta W1 + `wroll.mis.drop`, `wroll.mis.arms` (bez rysunku, pose=n) |
| Plate Pinch | open | gotowe (open, uproszczenie) | `pinch.setup` + `pinch.hold` (fv-plate-pinch wprost + ace-5765 — wariant: marsz z talerzem w chwycie szczypcowym) + `pinch.mis.handle`; bez rysunku |
| Behind-the-Back Barbell Wrist Curl | general `wrist` | otwarte | dwa opisy o granicznym szczeblu (IronMind bez daty; Fitness Volt — autor MD bez kwalifikacji trenerskich), trzeci wewnętrznie sprzeczny |
| Reverse Plate Curls | general `curl` | otwarte | tylko serwisy szczebla 5 / aplikacje w wynikach; nie czytano |
| Dumbbell Lying Pronation | open | otwarte | bez nowych badań (W1: sprzeczne ustawienie) |
| Dumbbell Lying Supination | open | otwarte | jw. |

## 2. Blok do wdrożenia

```json
{
  "Wrist Curl (hantle)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupUp"]]}
    ]
  },
  "Barbell Wrist Curl": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupUp"]]}
    ]
  },
  "Barbell Reverse Wrist Curl": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupDown"]]}
    ]
  },
  "Reverse Wrist Curl (hantle)": {
    "setup": [
      {"c": "wr.setupDown", "s": [["ace-29", "Step 1 (pronate your forearms; bottom of the forearms resting on the bench)"], ["catalyst-wrist-ext", "opis, zdanie 1 (uproszczenie: wariant sprzętu sztanga; przedramiona na udach)"]]}
    ],
    "move": [
      {"c": "wr.revMove", "s": [["ace-29", "Step 2–3"], ["catalyst-wrist-ext", "opis, zdanie 2 (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupDown"]]}
    ]
  },
  "One-Arm Dumbbell Wrist Curl": {
    "setup": [
      {"c": "wr.setupUp", "s": [["ace-30", "Step 1 (uproszczenie: wariant sprzętu oburącz)"], ["catalyst-wrist-curl", "opis, zdanie 1 (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "move": [
      {"c": "wr.range", "s": [["ace-30", "Step 2–3 (uproszczenie: wariant sprzętu oburącz)"], ["catalyst-wrist-curl", "opis, zdanie 2 (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupUp"]]}
    ]
  },
  "One-Arm Dumbbell Reverse Wrist Curl": {
    "setup": [
      {"c": "wr.setupDown", "s": [["ace-29", "Step 1 (uproszczenie: wariant sprzętu oburącz)"], ["catalyst-wrist-ext", "opis, zdanie 1 (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "move": [
      {"c": "wr.revMove", "s": [["ace-29", "Step 2–3 (uproszczenie: wariant sprzętu oburącz)"], ["catalyst-wrist-ext", "opis, zdanie 2 (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupDown"]]}
    ]
  },
  "Cable Wrist Curl": {
    "setup": [
      {"c": "wr.setupUp", "s": [["catalyst-wrist-curl", "opis, zdanie 1 (uproszczenie: wariant sprzętu sztanga)"], ["ace-30", "Step 1 (uproszczenie: wariant sprzętu hantle)"]]}
    ],
    "move": [
      {"c": "wr.range", "s": [["catalyst-wrist-curl", "opis, zdanie 2 (uproszczenie: wariant sprzętu sztanga)"], ["ace-30", "Step 2–3 (uproszczenie: wariant sprzętu hantle)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "wr.mis.lift", "s": [["wniosek", "wr.setupUp"]]}
    ]
  },
  "Wrist Roller": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "wroll.mis.drop", "s": [["wniosek", "wroll.move"]]},
      {"c": "wroll.mis.arms", "s": [["wniosek", "wroll.setup"]]}
    ]
  },
  "Plate Pinch": {
    "setup": [
      {"c": "pinch.setup", "s": [["fv-plate-pinch", "How to (squeeze or pinch the plates … using all fingers and your thumbs)"], ["ace-5765", "Farmer's Walk with Weight Plates (grip the edge of a weight plate in a pinch grip; uproszczenie: wariant — marsz)"]]}
    ],
    "move": [
      {"c": "pinch.hold", "s": [["fv-plate-pinch", "How to (stand up; squeeze until your grip feels tired)"], ["ace-5765", "Farmer's Walk with Weight Plates (squeeze the weight as hard as possible; uproszczenie: wariant — marsz)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "pinch.mis.handle", "s": [["wniosek", "pinch.setup"], ["fv-plate-pinch", "Common mistakes (using plates with handles)"]]}
    ]
  }
}
```

## 3. Nowe zdania

Istniejące użyte: `wr.mis.lift`, `wr.range`. Z W1 (jeszcze nie w aplikacji): `wr.setupUp`, `wr.setupDown`, `wr.revMove`, `wroll.setup`, `wroll.move`.

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| wroll.mis.drop | Ciężar opada sam, bez kontroli. | Letting the weight drop on its own. | Wnioskowany: zaprzeczenie `wroll.move` („…potem powoli ją odwiń”). Wsparcie (W1, nieczytane ponownie w W2): bos-wrist-roller, catalyst-wrist-roller, fv-wrist-roller — wszystkie każą opuszczać powoli. |
| wroll.mis.arms | Ręce opadają w trakcie nawijania. | Letting your arms drop while you roll. | Wnioskowany: zaprzeczenie `wroll.setup` („ręce uniesione przed sobą”). Wsparcie: bos-wrist-roller (W1: ręce proste na wysokości barków — jedno źródło). Zastępuje kandydata W1 `wroll.mis.elbows`. |
| pinch.setup | Ściśnij talerze chwytem szczypcowym — kciuk z jednej strony, palce z drugiej. | Pinch the plates together — thumb on one side, fingers on the other. | fv-plate-pinch (wszystkie palce i kciuk, płaskie talerze bez uchwytów) + ace-5765 (chwyt szczypcowy za krawędź talerza; wariant: marsz). Kierunek „gładką stroną na zewnątrz” — tylko serwisy spoza hierarchii, pominięty. |
| pinch.hold | Wstań i ściskaj talerze, aż chwyt się zmęczy. | Stand up and keep squeezing until your grip tires. | fv-plate-pinch (wstań, ściskaj do zmęczenia chwytu) + ace-5765 (ściskaj jak najmocniej; wariant: marsz). Liczby sekund z FV pominięte celowo. |
| pinch.mis.handle | Chwytanie talerza za uchwyt zamiast samymi palcami. | Grabbing the plate by its handle instead of pinching it. | Wnioskowany: zaprzeczenie `pinch.setup`; dodatkowo fv-plate-pinch, Common mistakes (talerze z uchwytami). |

## 4. Źródła

| id | Adres | Organizacja | Szczebel | Co przeczytano (02.11.2026) |
|---|---|---|---|---|
| ace-29 | https://www.acefitness.org/resources/everyone/exercise-library/29/wrist-curl-extension/ | ACE | 4 — organizacja certyfikująca, treść firmowana | Step 1–3: nachwyt, spód przedramion na ławce, hantle poza krawędzią; powolne opuszczenie bez prostowania rąk; uniesienie nadgarstkami |
| ace-30 | https://www.acefitness.org/resources/everyone/exercise-library/30/wrist-curl-flexion/ | ACE | 4 | Step 1–3 + Notes (puszczanie chwytu przy opuszczaniu — sporne, nieużyte) |
| catalyst-wrist-curl | https://catalystathletics.com/exercise/517/Barbell-Wrist-Curl/ | Catalyst Athletics | 4 (rozstrzygnięcie) | opis: podchwyt, przedramiona na udach, nadgarstki przed kolanami; wyprost, potem zgięcie „as far as possible” |
| catalyst-wrist-ext | https://catalystathletics.com/exercise/518/Barbell-Wrist-Extension/ | Catalyst Athletics | 4 | opis: nachwyt, przedramiona na udach; zgięcie, potem wyprost „as far as possible” |
| fv-plate-pinch | https://fitnessvolt.com/plate-pinch-guide/ | Fitness Volt | 4: Matthew Magnante, ACE (podpis i biogram); data tylko w metadanych (15.11.2023 / 15.09.2024) — jak precedens `fv-wrist-roller`; bez recenzenta | How to + Common mistakes (uchwyty, zginanie nadgarstków, ślizganie chwytu, wiercenie się) |
| ace-5765 | https://www.acefitness.org/education-and-resources/professional/expert-articles/5765/how-to-improve-grip-strength/ | ACE | 4: Pete McCall, MS, CSCS; 08.12.2015 | sekcja „Farmer's Walk with Weight Plates”: „Grip the edge of a weight plate in a pinch grip” |
| bos-wrist-roller, catalyst-wrist-roller, fv-wrist-roller | (W1) | — | 4 (W1) | w W2 nieczytane ponownie — tylko wsparcie błędów wnioskowanych |

Sprawdzone i niezaliczone:

| Adres | Szczebel | Powód |
|---|---|---|
| https://ironmind.com/articles/john-brookfields-grip-tips/Behind-the-Back-Wrist-Curls/ | [OTWARTE] 4 lub 5 | John Brookfield — autor książek o sile chwytu (wydawca IronMind), bez kwalifikacji trenerskich na stronie; brak daty. Reguła IronMind: 4 przy autorze o sprawdzalnych kwalifikacjach. Treść: sztanga za plecami, dłonie od ciała, „using only your wrist strength” |
| https://fitnessvolt.com/behind-the-back-barbell-wrist-curl/ | [OTWARTE] 4 lub 5 | „Dr. Malik, MD” — kwalifikacje medyczne, nie trenerskie; data tylko w metadanych (2019 / 2024); kierunek dłoni nie podany |
| https://fitnessvolt.com/barbell-standing-back-wrist-curl-guide/ | odrzucone dla tego ćwiczenia | autor Ash, ACE, MSc (4), ale tytuł „zza pleców”, a opis ustawienia — sztanga przed udami; wewnętrznie sprzeczne |
| wyniki dla Reverse Plate Curls (bodybuilding.com → sklep, weighttraining.guide, jefit, planfit, fitnessai) | 5 / aplikacje | nie źródło; strona Fitness Volt „weight plate reverse curl” nieczytana |

## 5. Otwarte i uwagi dla koordynatora

1. **`wr.mis.lift` jako błąd wnioskowany** — W1 odmówiła „zamiany wskazówki w błąd post factum” przy braku źródła błędu; brief W2 dopuszcza błąd = logiczne zaprzeczenie potwierdzonego zdania ustawienia. Tu: „Oprzyj przedramiona …” ↔ „Przedramiona odrywają się od podparcia”. ACE 29/30 Step 2 („without … extending your arms”) wspiera kierunkowo. Zestaw ogólny `wrist` już ma ten błąd — teraz ma podstawę dla kart z oparciem.
2. **Behind-the-Back Barbell Wrist Curl** — zestaw ogólny `wrist` (ok: `wr.range` — „Opuść ciężar tak nisko, jak pozwala nadgarstek…”) pasuje kierunkowo, ale w tej wersji przedramiona NIE są podparte; `wr.forearms`/`wr.mis.lift` nie wolno tu dopisywać. Kandydat ustawienia: „Stań prosto, sztanga za udami, dłonie skierowane do tyłu.” — po potwierdzeniu szczebla IronMind/FV (Malik). Sprzeczność źródeł co do toczenia sztangi do palców (IronMind, FV Malik — tak; ACE 30 Notes — ryzyko) — jak w W1, ani wskazówka, ani błąd.
3. **Karty z wariantów (4 szt.)** — zgodne z briefem W2 (`uproszczenie: wariant sprzętu`); jeśli koordynator nie przyjmie — wrócą do „otwarte”.
4. **Plate Pinch** — tryb `open`, bez rysunku; drugie źródło (ACE McCall) opisuje marsz z talerzem w chwycie szczypcowym, nie stanie — uproszczenie. Fitness Volt: data tylko w metadanych.
5. **Dumbbell Lying Pronation / Supination, Reverse Plate Curls** — [OTWARTE] bez nowych badań (limit kontekstu); W1 opisuje stan.
6. **Wrist Roller** — błędy bez rysunku (pose=n); `wroll.mis.arms` ma jedno źródło wspierające (Bells of Steel) + wniosek.
