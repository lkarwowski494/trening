# Wskazówki techniki — rodzina `forearm` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: 13 ćwiczeń rodziny `forearm` (kolejność wg popularności z listy G6). Tylko wskazówki techniki; role mięśni robi inny agent.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

## Korekta szczebli 02.11.2026

Szczeble organizacji przeliczone wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = naraz: (a) organizacja szkoląca
trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor + data albo treść firmowana przez organizację;
(c) nie recenzja z afiliacją ani marketing). Ponownie policzone tylko cytowania już zapisane przy danym ćwiczeniu. Zmiany:

- **PureGym** → 5 (sieć siłowni, rozstrzygnięcie). **GymNation** → 5 (sieć siłowni, ta sama reguła). **NTCC Athletics** → 5: (a) dział sportu
  college'u nie jest organizacją szkolącą trenerów ani serwisem z redakcją i recenzją ekspercką — ta sama kategoria co Western Univ. SRS (= 5 w rozstrzygnięciu).
  **Bells of Steel** → 4 tylko dla własnego sprzętu (wałek do nadgarstków) — nie zmienia wyniku, bo drugie źródło Wrist Roller (GymNation) odpadło.
  Liczą się: ACE (#29, #30) i Coach.
- **Wrist Curl (hantle)**: gotowe → częściowe (zostaje tylko `wr.range`; `wr.setupUp`, `wr.forearms`, `curl.control`, `wr.mis.lift` — 1 źródło).
- **Reverse Wrist Curl (hantle)**: gotowe → częściowe (zostaje tylko `wr.setupDown`).
- **One-Arm Dumbbell Reverse Wrist Curl**: gotowe → częściowe (zostaje tylko `wr.setupDown`, wariant: oburącz).
- **Barbell Wrist Curl, Barbell Reverse Wrist Curl, One-Arm Dumbbell Wrist Curl, Cable Wrist Curl, Wrist Roller**: gotowe → otwarte.
- Nowe zdania `wr.setupUp`, `wr.revMove`, `wroll.*` nie są używane w bloku JSON — przeniesione do „Otwarte” jako kandydaci.

Metoda jak w `docs/research/33-wskazowki-partia2.md`: zdanie wchodzi do karty, gdy potwierdzają je ≥ 2 przeczytane źródła szczebla 4
z różnych organizacji (wyjątek dla wskazówek techniki, CLAUDE.md, 25.10.2026). Źródło o innym wariancie sprzętowym tego samego ruchu
liczy się z opisem „(wariant: …)”. Liczby (kąty, powtórzenia, tempo) z przeczytanych stron pominięte celowo.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Wrist Curl (hantle) | general `wrist` | częściowe (1 zdanie) | `wr.range`: Coach + ACE #30 |
| Reverse Wrist Curl (hantle) | general `wrist` | częściowe (1 zdanie) | `wr.setupDown`: ACE #29 + Coach |
| Barbell Wrist Curl | general `wrist` | otwarte | źródła wprost (GymNation, NTCC) = 5 |
| Barbell Reverse Wrist Curl | general `wrist` | otwarte | jw. |
| One-Arm Dumbbell Wrist Curl | general `wrist` | otwarte | źródło wprost (GymNation) = 5; zostaje po 1 źródle szczebla 4 na zdanie |
| One-Arm Dumbbell Reverse Wrist Curl | general `wrist` | częściowe (1 zdanie) | `wr.setupDown`: ACE #29 + Coach (wariant: oburącz) |
| Cable Wrist Curl | general `wrist` | otwarte | źródło wprost (GymNation) = 5 |
| Behind-the-Back Barbell Wrist Curl | general `wrist` | otwarte | jedno źródło (GymNation, teraz 5), wewnętrznie sprzeczne |
| Wrist Roller | open | otwarte | Bells of Steel (4) + GymNation (5) → 1 źródło |
| Plate Pinch | open | otwarte | tylko PureGym (5) |
| Reverse Plate Curls | general `curl` | otwarte | brak przeczytanego źródła |
| Dumbbell Lying Pronation | open | otwarte | ruch potwierdzony tylko w wariancie klęcząc/siedząc; ustawienie leżąc — brak źródła |
| Dumbbell Lying Supination | open | otwarte | jak wyżej |

Uwaga dla koordynatora: trzy karty „częściowe” mają po jednym zdaniu. Rekomendacja: nie zastępować nimi zestawu ogólnego, dopóki nie zostaną
dopełnione — możliwe, że wystarczy ponowne, dokładne czytanie ACE #29/#30 i stron Coach pod kątem `wr.forearms`, `curl.control`, `wr.revMove`
(tego nie robiłem — zadanie korekty bez nowego researchu). Blok JSON zawiera je, żeby decyzja była po stronie integracji.

## 2. Wpisy do `exercises` (cues.json)

```json
{
  "Wrist Curl (hantle)": {
    "setup": [],
    "move": [
      {"c": "wr.range", "s": [["coach-wrist-curl", "Step 2 (roll the dumb-bells to the ends of your fingers, then curl up your wrists)"], ["ace-30", "Step 2–3"]]}
    ],
    "tips": [],
    "mistakes": []
  },
  "Reverse Wrist Curl (hantle)": {
    "setup": [
      {"c": "wr.setupDown", "s": [["ace-29", "Step 1 (pronate your forearms… palms downward)"], ["coach-reverse-wrist-curl", "Step 1"]]}
    ],
    "move": [],
    "tips": [],
    "mistakes": []
  },
  "One-Arm Dumbbell Reverse Wrist Curl": {
    "setup": [
      {"c": "wr.setupDown", "s": [["ace-29", "Step 1 (wariant: oburącz)"], ["coach-reverse-wrist-curl", "Step 1 (wariant: oburącz)"]]}
    ],
    "move": [],
    "tips": [],
    "mistakes": []
  }
}
```

## 3. Nowe źródła

| id | org | tytuł | url | szczebel (po korekcie 02.11.2026) | czytane |
|---|---|---|---|---|---|
| ace-29 | ACE | Wrist Curl - Extension (#29) | https://www.acefitness.org/resources/everyone/exercise-library/29/wrist-curl-extension/ | 4 | 02.11.2026 |
| ace-30 | ACE | Wrist Curl - Flexion (#30) | https://www.acefitness.org/resources/everyone/exercise-library/30/wrist-curl-flexion/ | 4 | 02.11.2026 |
| ace-31 | ACE | Wrist Supination and Pronation (#31) | https://www.acefitness.org/resources/everyone/exercise-library/31/wrist-supination-and-pronation/ | 4 | 02.11.2026 (tylko „Otwarte”) |
| coach-wrist-curl | Coach | Introduction: Wrist curl | https://www.coachweb.com/exercises/arm-exercises/163/wrist-curl | 4 | 02.11.2026 |
| coach-reverse-wrist-curl | Coach | Variation: Reverse wrist curl | https://coachweb.com/exercises/arm-exercises/2835/variation-reverse-wrist-curl | 4 | 02.11.2026 |
| coach-forearm-rotation | Coach | Variation: Forearm rotation | https://www.coachweb.com/exercises/3123/2-dumb-bell-forearm-rotation | 4 | 02.11.2026 (tylko „Otwarte”) |
| ntcc-forearm | NTCC Athletics | Live Like an Athlete — Forearm Exercises | https://ntcc.edu/athletics/live-athlete/exercises/forearm-exercises | 5 — nie liczy się | 02.11.2026 |
| puregym-wrist-curls | PureGym | Wrist Curls | https://www.puregym.com/exercises/arms-and-shoulders/forearm-and-grip-exercises/wrist-curls/ | 5 — nie liczy się | 02.11.2026 |
| puregym-wrist-extensions | PureGym | Wrist Extensions | https://www.puregym.com/exercises/arms-and-shoulders/forearm-and-grip-exercises/wrist-extensions/ | 5 — nie liczy się | 02.11.2026 |
| puregym-plate-pinch | PureGym | Plate Pinch | https://puregym.com/exercises/arms-and-shoulders/forearm-and-grip-exercises/plate-pinch | 5 — nie liczy się | 02.11.2026 |
| gymnation-bb-wrist-curl | GymNation | Barbell Wrist Curl | https://gymnation.com/en-ae/exercise-library/barbell-wrist-curl/ | 5 — nie liczy się | 02.11.2026 |
| gymnation-bb-reverse-wrist-curl | GymNation | Barbell Reverse Wrist Curl | https://gymnation.com/en-ae/exercise-library/barbell-reverse-wrist-curl/ | 5 — nie liczy się | 02.11.2026 |
| gymnation-db-1arm-wrist-curl | GymNation | Dumbbell One Arm Wrist Curl | https://gymnation.com/en-ae/exercise-library/dumbbell-one-arm-wrist-curl/ | 5 — nie liczy się | 02.11.2026 |
| gymnation-db-reverse-wrist-curl | GymNation | Dumbbell Reverse Wrist Curl (jednorącz) | https://gymnation.com/en-ae/exercise-library/dumbbell-reverse-wrist-curl/ | 5 — nie liczy się | 02.11.2026 |
| gymnation-cable-wrist-curl | GymNation | Cable Wrist Curl | https://gymnation.com/en-ae/exercise-library/cable-wrist-curl/ | 5 — nie liczy się | 02.11.2026 |
| gymnation-bb-behind-back | GymNation | Barbell Standing Back Wrist Curl | https://gymnation.com/en-ae/exercise-library/barbell-standing-back-wrist-curl/ | 5 — nie liczy się | 02.11.2026 |
| gymnation-wrist-roller | GymNation | Wrist Roller | https://gymnation.com/exercise-library/wrist-roller | 5 — nie liczy się | 02.11.2026 |
| bos-wrist-roller | Bells of Steel | How To Use a Wrist Roller (blog, 08.04.2025) | https://bellsofsteel.us/blogs/content/how-to-use-a-wrist-roller | 4 (własny sprzęt) | 02.11.2026 (tylko „Otwarte”) |

### Ocena nowych organizacji wg kryteriów (a)–(c) (02.11.2026)

| Organizacja | Szczebel | Uzasadnienie |
|---|---|---|
| NTCC Athletics | 5 | (a) nie spełnione: dział sportu college'u, nie organizacja szkoląca/certyfikująca trenerów ani serwis z redakcją i recenzją ekspercką; ta sama kategoria co uczelniany ośrodek sportu oceniony w rozstrzygnięciu na 5 (Western Univ. SRS). Do potwierdzenia przez koordynatora, bo brief z 02.11 wymieniał „uczelniane centra sportu” wśród przykładów szczebla 4 — późniejsze rozstrzygnięcie ma pierwszeństwo |
| PureGym | 5 | sieć siłowni (rozstrzygnięcie) |
| GymNation | 5 | sieć siłowni — ta sama reguła co PureGym; dodatkowo strona Behind-the-Back zawiera błąd anatomiczny |
| Bells of Steel | 4 tylko dla własnego sprzętu | producent sprzętu siłowego, w tym wałków do nadgarstków; blog firmowany przez firmę, z datą |

Odrzucone/niedostępne: ExRx (403), web.archive.org (zablokowane dla narzędzia), muscleandstrength.com (403), elitefts.com (404 na dwóch
stronach indeksu), barbend.com/wrist-curl (404), Physitrack „wrist roller” (to inne ćwiczenie — wyprost nadgarstka z gumą; nie liczy się),
strona Motra (aplikacja treningowa — wykluczona briefem). Pozostałe trafienia wyszukiwarki to aplikacje albo serwisy niskiej jakości — nie czytane jako źródła.

## 4. Nowe zdania

Używane w bloku JSON: istniejące `wr.range` oraz jedno nowe zdanie:

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| wr.setupDown | Oprzyj przedramiona dłońmi w dół, tak żeby nadgarstki wystawały poza oparcie. | Rest your forearms palms down, with your wrists hanging off the edge. | ace-29 Step 1; coach-reverse-wrist-curl Step 1. |

Kandydaci bez kompletu źródeł szczebla 4 (treść w „Otwarte”): `wr.setupUp`, `wr.revMove`, `wroll.setup`, `wroll.move`, `wroll.arms`, `wroll.mis.elbows`.
EN propozycje kandydatów — w poprzedniej wersji pliku (historia gałęzi).

## 5. Otwarte

- **Zdania poniżej 2 źródeł — szczebel źródła wg rozstrzygnięcia 02.11.2026** (PureGym, GymNation, NTCC = 5):
  - Wrist Curl (hantle): `wr.setupUp` „Oprzyj przedramiona dłońmi do góry, tak żeby nadgarstki wystawały poza oparcie.” (tylko ACE #30),
    `wr.forearms` (tylko Coach), `curl.control` (tylko ACE #30), `wr.mis.lift` (tylko Coach).
  - Reverse Wrist Curl (hantle): `wr.revMove` „Opuść dłonie, potem unieś je grzbietem w swoją stronę — pracują same nadgarstki.” (tylko ACE #29),
    `wr.forearms`, `wr.mis.lift` (tylko Coach), `curl.control` (tylko ACE #29).
  - One-Arm Dumbbell Reverse Wrist Curl: `wr.revMove`, `wr.forearms`, `curl.control`, `wr.mis.lift` — po 1 źródle (ACE albo Coach, wariant: oburącz).
  - Barbell Wrist Curl, Barbell Reverse Wrist Curl, One-Arm Dumbbell Wrist Curl, Cable Wrist Curl — przy tych ćwiczeniach zapisane cytowania dają
    najwyżej 1 źródło szczebla 4 na zdanie. Możliwe dopełnienie jako wariant: para Coach + ACE #30 potwierdza `wr.range` dla hantli (patrz Wrist Curl),
    a para ACE #29 + Coach — `wr.setupDown`; do decyzji koordynatora, czy karta złożona wyłącznie z wariantów jest akceptowalna.
  - Wrist Roller: `wroll.setup` „Stań prosto i trzymaj wałek oburącz przed sobą na wysokości barków, ręce proste.”, `wroll.move` „Obracając
    nadgarstkami, nawijaj linkę, aż ciężar dojdzie do wałka; potem powoli ją odwijaj.”, `wroll.arms` „Ręce zostają proste — pracują nadgarstki,
    nie barki.”, `wroll.mis.elbows` „Opuszczanie łokci i rąk w trakcie nawijania.” — tylko Bells of Steel (4).
- **Zestaw ogólny `wrist` dla wersji „reverse”:** `wr.range` („Opuść ciężar tak nisko, jak pozwala nadgarstek…”) nie jest potwierdzone dla wersji
  z dłońmi w dół — ACE i Coach nie mówią o zakresie dolnym. Informacja o błędzie zestawu ogólnego.
- **Toczenie ciężaru do końców palców w wrist curl:** Coach (Step 2) to zaleca, ACE #30 (Notes/Tips) opisuje to jako częsty błąd
  zwiększający ryzyko dla nadgarstka. Sprzeczność na tym samym szczeblu, do tego twierdzenie o zdrowiu → ani wskazówka, ani błąd.
  Zdanie `wr.range` celowo nie mówi o rozluźnieniu chwytu.
- **Siła chwytu:** ACE (#30, #31) — ściskać rączkę mocno; GymNation — nie ściskać za mocno. Pominięte.
- **Behind-the-Back Barbell Wrist Curl:** jedyne przeczytane źródło (GymNation, teraz szczebel 5) opisuje ruch jako „extending your wrists”,
  choć to zgięcie nadgarstka; strona wewnętrznie niespójna. Do szukania: rzetelne źródło szczebla 4.
- **Plate Pinch:** tylko PureGym (szczebel 5). Potrzebne 2 źródła szczebla 4.
- **Reverse Plate Curls:** brak przeczytanego źródła; zestaw ogólny `curl` to analogia do uginania ramion — dla tego wariantu niepotwierdzona.
- **Dumbbell Lying Pronation / Dumbbell Lying Supination:** ruch rotacji potwierdzony w wariancie klęcząc/siedząc z przedramieniem
  na ławce: ACE #31 (Step 1–3) i Coach „Forearm rotation”. Kandydaci zdań: `fa.rotWrist` „Nadgarstek prosto — obraca się tylko przedramię.”
  (ACE Step 2–3 + Coach krok 3) i `fa.rotSupport` „Przedramię oparte przez cały ruch.” (ACE Step 1 + Coach krok 1). Brak źródła
  dla ustawienia leżąc — dlatego nie wpisane do JSON.
- **Cable Wrist Curl — ustawienie przy wyciągu**, **Wrist Roller — kierunek nawijania, praca na stojaku, tempo:** jedno źródło albo liczby → pominięte.

## 6. Stan

Po korekcie szczebli 02.11.2026: 3 ćwiczenia częściowe po 1 zdaniu (Wrist Curl hantle, Reverse Wrist Curl hantle, One-Arm Dumbbell Reverse
Wrist Curl), 10 otwartych. Następny krok: dokładne ponowne czytanie ACE #29/#30 i stron Coach (wrist curl, reverse wrist curl) pod kątem
`wr.setupUp`, `wr.forearms`, `curl.control`, `wr.revMove`, `wr.mis.lift`; potem drugie źródło szczebla 4 dla Wrist Roller (obok Bells of Steel),
Plate Pinch i wersji ze sztangą/wyciągiem (organizacje szkolące trenerów, producenci sprzętu). Pułapki: ExRx 403, web.archive.org niedostępne
dla WebFetch, muscleandstrength 403, elitefts 404, wiele trafień to aplikacje (wykluczone) albo sieci siłowni (szczebel 5).
