# Wskazówki techniki — rodzina `shrug` (fala W2, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Fala W2. Zrobione: (1) błędy dla obecnych kart „Shrugs (sztanga)” i „Shrugs (hantle)” (E0) — dwa ze źródeł, jeden ze źródeł + standard;
  (2) nowe karty dla „Shrugs (linki)” i „Leverage Shrug” (uproszczenie: wariant sprzętu — dopuszczone w briefie W2);
  (3) nowe zdanie ustawienia dla szrugów zza pleców (2 źródła szczebla 4) → karty „Barbell Shrug Behind The Back” i „Smith Machine Behind the Back Shrug”;
  (4) Calf-Machine i Middle Back Shrug — nadal otwarte (jedyne znalezione opisy szczebla 5).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1. Strony czytane WebFetch 02.11.2026.

## 1. Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Shrugs (sztanga) | own (S1M1T2E0) | tylko błędy dopisane (3) | `shrug.mis.roll`, `shrug.mis.elbows`, `shrug.mis.sway` |
| Shrugs (hantle) | own (S1M1T2E0) | tylko błędy dopisane (3) | jw. |
| Shrugs (linki) | general | gotowe (uproszczenie) | ustawienie/ruch/wskazówki z W1 (ACE + ExRx, wariant: sztanga/hantle); `uproszczenie: wariant sprzętu sztanga/hantle` — ciężar w opuszczonych, prostych rękach, ruch barków ten sam, linka zmienia tylko źródło oporu |
| Leverage Shrug | general | gotowe (uproszczenie) | jw.; uchwyty maszyny przy bokach jak hantle. Opis ustawienia przy tej maszynie znaleziony tylko na stronie bez autora (szczebel 5) — nie liczony. Decyzja koordynatora (W1 też rekomendowała) |
| Barbell Shrug Behind The Back | general | gotowe | nowe `shrug.setupBehind` (BarBend + Fitness Volt, oba wprost); ruch `shrug.move` (FV wprost + ACE wariant) |
| Smith Machine Behind the Back Shrug | general | gotowe (uproszczenie) | `shrug.setupBehind` — `uproszczenie: wariant sprzętu sztanga` (suwnica prowadzi sztangę w pionie, ułożenie ciała i chwyt bez zmian); FV wymienia wprost suwnicę jako sprzęt dla wersji zza pleców |
| Calf-Machine Shoulder Shrug | general | otwarte | jedyny opis (Fitness Volt, strona „alternatives”) bez autora i daty = szczebel 5 |
| Middle Back Shrug | general (row) | otwarte | tylko serwisy szczebla 5 i strony aplikacji |

## 2. Blok do wdrożenia

```json
{
  "Shrugs (sztanga)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "shrug.mis.roll", "s": [["ace-72", "opis, Tip (DO NOT roll the shoulders)"], ["fv-barbell-shrugs", "How to / wskazówki (do not roll your shoulders forward or backward)"]]},
      {"c": "shrug.mis.elbows", "s": [["ace-75", "Step 2 (avoiding … elbow flexion; wariant: hantle)"], ["barbend-db-shrug", "Common Mistakes — Bending Your Elbows (wariant: hantle)"], ["barbend-shrugs", "How to (avoid actively lifting the weight with your elbows)"]]},
      {"c": "shrug.mis.sway", "s": [["barbend-db-shrug", "Common Mistakes — Using Momentum (wariant: hantle)"], ["ace-72", "opis (hips straight, back tall) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Shrugs (hantle)": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "shrug.mis.roll", "s": [["ace-75", "Step 2 (avoiding any shoulder rotation)"], ["fv-barbell-shrugs", "How to (do not roll your shoulders; wariant: sztanga)"]]},
      {"c": "shrug.mis.elbows", "s": [["ace-75", "Step 2 (avoiding … elbow flexion)"], ["barbend-db-shrug", "Common Mistakes — Bending Your Elbows"]]},
      {"c": "shrug.mis.sway", "s": [["barbend-db-shrug", "Common Mistakes — Using Momentum"], ["ace-75", "Step 2 (maintain an erect torso) — błąd = zaprzeczenie standardu"]]}
    ]
  },
  "Shrugs (linki)": {
    "setup": [
      {"c": "shrug.setup", "s": [["ace-72", "opis (uproszczenie: wariant sprzętu sztanga)"], ["exrx-TrapeziusUpper/DBShrug", "Preparation (uproszczenie: wariant sprzętu hantle)"]]}
    ],
    "move": [
      {"c": "shrug.move", "s": [["ace-72", "opis (uproszczenie: wariant sprzętu sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "tips": [
      {"c": "shrug.high", "s": [["ace-72", "opis (as high as possible; wariant: sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (wariant: sztanga)"]]},
      {"c": "shrug.tall", "s": [["ace-72", "opis (back tall; only the shoulders; wariant: sztanga)"], ["exrx-TrapeziusUpper/DBShrug", "Comments (wariant: hantle)"]]}
    ],
    "mistakes": [
      {"c": "shrug.mis.roll", "s": [["ace-72", "Tip (wariant: sztanga)"], ["fv-barbell-shrugs", "How to (wariant: sztanga)"]]},
      {"c": "shrug.mis.elbows", "s": [["ace-75", "Step 2 (wariant: hantle)"], ["barbend-db-shrug", "Common Mistakes — Bending Your Elbows (wariant: hantle)"]]}
    ]
  },
  "Leverage Shrug": {
    "setup": [
      {"c": "shrug.setup", "s": [["ace-75", "Step 1 (uproszczenie: wariant sprzętu hantle — uchwyty przy bokach, łokcie wyprostowane)"], ["exrx-TrapeziusUpper/DBShrug", "Preparation (uproszczenie: wariant sprzętu hantle)"]]}
    ],
    "move": [
      {"c": "shrug.move", "s": [["ace-72", "opis (uproszczenie: wariant sprzętu sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (uproszczenie: wariant sprzętu sztanga)"]]}
    ],
    "tips": [
      {"c": "shrug.high", "s": [["ace-72", "opis (wariant: sztanga)"], ["exrx-TrapeziusUpper/BBShrug", "Execution (wariant: sztanga)"]]}
    ],
    "mistakes": [
      {"c": "shrug.mis.roll", "s": [["ace-75", "Step 2 (wariant: hantle)"], ["fv-barbell-shrugs", "How to (wariant: sztanga)"]]},
      {"c": "shrug.mis.elbows", "s": [["ace-75", "Step 2 (wariant: hantle)"], ["barbend-db-shrug", "Common Mistakes — Bending Your Elbows (wariant: hantle)"]]}
    ]
  },
  "Barbell Shrug Behind The Back": {
    "setup": [
      {"c": "shrug.setupBehind", "s": [["barbend-db-shrug", "Variations — Behind-the-Back Barbell Shrug (facing away; bar against the backs of the legs; close, overhand grip; stand upright)"], ["fv-13180", "behind-the-back shrug — instrukcja (overhand grip, barbell behind your thighs; arms straight)"]]}
    ],
    "move": [
      {"c": "shrug.move", "s": [["fv-13180", "behind-the-back shrug — instrukcja (barki w stronę uszu, przytrzymanie, opuszczenie)"], ["ace-72", "opis (lowering slowly; wariant: sztanga z przodu)"]]}
    ],
    "tips": [
      {"c": "shrug.high", "s": [["ace-72", "opis (wariant: sztanga z przodu)"], ["fv-barbell-shrugs", "How to (shrug as high as you possibly can; wariant: sztanga z przodu)"]]}
    ],
    "mistakes": [
      {"c": "shrug.mis.roll", "s": [["ace-72", "Tip (wariant: sztanga z przodu)"], ["fv-barbell-shrugs", "How to (wariant: sztanga z przodu)"]]},
      {"c": "shrug.mis.elbows", "s": [["wniosek", "shrug.setupBehind"]]}
    ]
  },
  "Smith Machine Behind the Back Shrug": {
    "setup": [
      {"c": "shrug.setupBehind", "s": [["barbend-db-shrug", "Variations — Behind-the-Back Barbell Shrug (uproszczenie: wariant sprzętu sztanga)"], ["fv-13180", "behind-the-back shrug (uproszczenie: wariant sprzętu sztanga)"], ["fv-barbell-shrugs", "Variations — behind-the-back (best done with a barbell or Smith machine)"]]}
    ],
    "move": [
      {"c": "shrug.move", "s": [["fv-13180", "behind-the-back shrug (wariant: sztanga)"], ["ace-72", "opis (wariant: sztanga z przodu)"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "shrug.mis.elbows", "s": [["wniosek", "shrug.setupBehind"]]}
    ]
  }
}
```

Uwaga: w „Smith Machine Behind the Back Shrug” nie wpisuję `shrug.mis.roll` — suwnica prowadzi sztangę po pionowej prowadnicy, więc „krążenie” wymagałoby rysunku innego niż w wersji wolnej; zostawiam tylko błąd wnioskowany. Koordynator może dopisać jak w wersji ze sztangą (wariant sprzętu).

## 3. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie |
|---|---|---|---|
| shrug.setupBehind | Stań prosto, sztanga za udami, chwyt nachwytem, ręce proste. | Stand tall with the bar behind your thighs, overhand grip, arms straight. | barbend-db-shrug (wersja zza pleców: tyłem do sztangi, sztanga przy tyle nóg, wąski nachwyt, wyprost) + fv-13180 (nachwyt, sztanga za udami, ręce proste). Bez liczb. |
| shrug.mis.roll | Krążenie barkami zamiast ruchu prosto w górę i w dół. | Rolling your shoulders instead of moving straight up and down. | Ze źródeł: ace-72 (Tip) + fv-barbell-shrugs; ace-75 Step 2 (bez rotacji barków) — ta sama organizacja co ace-72. Zaprzecza też `shrug.move`. Kandydat z W1 (Otwarte 5) — teraz drugie źródło. Bez twierdzeń o urazach. |
| shrug.mis.elbows | Uginanie łokci — ciężar ciągną ręce zamiast barków. | Bending your elbows so your arms pull instead of your shoulders. | Ze źródeł: ace-75 Step 2 + barbend-db-shrug (Common Mistakes) + barbend-shrugs (ta sama organizacja co poprzednie). Wnioskowany także jako zaprzeczenie `shrug.setup` („prostych rękach”) i `shrug.setupBehind` („ręce proste”). |
| shrug.mis.sway | Bujanie tułowiem, żeby podrzucić ciężar. | Swaying your body to heave the weight up. | barbend-db-shrug (Using Momentum) + ace-72/ace-75 standard (plecy wysoko / tułów wyprostowany) — „błąd = zaprzeczenie standardu”; wnioskowany jako zaprzeczenie `shrug.tall`. |

Zdania istniejące użyte: `shrug.setup`, `shrug.move`, `shrug.high`, `shrug.tall`.

## 4. Źródła

| id | Adres | Organizacja | Szczebel | Co przeczytano |
|---|---|---|---|---|
| ace-72 | https://www.acefitness.org/resources/everyone/exercise-library/72/shrug/ | ACE | 4 — organizacja certyfikująca trenerów, treść firmowana (w rejestrze) | cały opis + Tip: „focus on only raising/lowering the shoulders - DO NOT roll the shoulders.” |
| ace-75 | https://www.acefitness.org/resources/everyone/exercise-library/75/standing-shrug/ | ACE (ta sama org. co ace-72) | 4 (w rejestrze) | Step 1–3; Step 2: „slowly shrug your shoulders upward, avoiding any shoulder rotation or elbow flexion (bending).” |
| barbend-db-shrug | https://barbend.com/dumbbell-shrug/ | BarBend | 4 warunkowo → 4: artykuł techniki, autor Jake Dickson, NASM-CPT, USAW-L2; aktualizacja 19.11.2024; bez recenzenta (nie warunek dla BarBend) | kroki 1–2, Common Mistakes (Bending Your Elbows, Using Momentum), Variations (Behind-the-Back Barbell Shrug, Smith Machine Shrug) |
| barbend-shrugs | https://barbend.com/shrugs/ | BarBend (ta sama org.) | 4: autor Mike Dewar, CSCS; aktualizacja Andrew Barr, MS, CSCS, 22.11.2024 | How to; „Avoid actively lifting the weight with your elbows.” — tylko wsparcie, nie liczy się jako druga organizacja |
| fv-barbell-shrugs | https://fitnessvolt.com/barbell-shrugs-guide/ | Fitness Volt | 4: Matthew Magnante, ACE (certyfikat w podpisie i biogramie); data tylko w metadanych (19.05.2020 / 17.08.2020) — precedens `fv-wrist-roller` (data w metadanych przyjęta przez koordynatora); bez recenzenta | How to, wskazówki („Do not roll your shoulders forward or backward…”), Variations (behind-the-back: barbell or Smith machine; cable; Smith) |
| fv-13180 | https://fitnessvolt.com/13180/front-barbell-shrugs-vs-behind-the-back-shrugs/ | Fitness Volt (ta sama org. co fv-barbell-shrugs) | 4 warunkowo: podpis Andrew Foster, CSCS; w treści „Author: Jim Stoppani, PhD”; data tylko w metadanych (27.07.2017 / 26.10.2017); uzup. 3 ostrzega przed starszymi artykułami FV — tu kwalifikacje są, ale autorstwo podwójne. Do potwierdzenia przez koordynatora | instrukcja wersji zza pleców: nachwyt, sztanga za udami, ręce proste, barki do uszu, przytrzymanie, opuszczenie |
| exrx-TrapeziusUpper/BBShrug, …/DBShrug | (rejestr, partia docs/research/27) | ExRx | 4 (w rejestrze; dziś 403 — nieczytane ponownie) | tylko z miejscami z W1 |

Niezależność: ACE, BarBend, Fitness Volt — trzy różne organizacje (Fitness Volt i BarBend — różni właściciele wg stron „o nas” w rozstrzygnięciu; BarBend = Breaking Muscle, nieużyty).
Odrzucone (szczebel 5): fitnessvolt.com/substitute-exercises/calf-machine-shoulder-shrug-alternatives/ (bez autora i daty; jedyny opis Calf-Machine),
fitnessvolt.com/substitute-exercises/leverage-shrug-alternatives/ (ten sam typ strony; znany tylko z wyszukiwarki — nieczytany), wyniki dla Middle Back Shrug (Generation Iron bez autora z listy ekspertów, strony aplikacji).
origym.co.uk/blog/barbell-shrug/ — strona weryfikacji botów, nieprzeczytana.

## 5. Otwarte i uwagi dla koordynatora

1. **Calf-Machine Shoulder Shrug** — [OTWARTE] brak opisu szczebla ≤ 4 (ExRx 403). Zestaw ogólny `shrug` (ok: `shrug.move`, `shrug.tall`) nie mówi o ciężarze w rękach — nie jest sprzeczny.
2. **Middle Back Shrug** — [OTWARTE] brak źródeł; zestaw ogólny `row` (`csr.chest`, `scr.chest`) — niesprawdzony źródłem.
3. **Leverage Shrug i Shrugs (linki)** — karty wyłącznie z wariantów sprzętu (decyzja 4 z W1 / zasada wariantu z briefu W2). Jeśli koordynator nie przyjmie dla Leverage — usunąć wpis.
4. **fv-13180** — podwójne autorstwo (Foster, CSCS / Stoppani, PhD) i data tylko w metadanych. Jeśli koordynator uzna za 5, to `shrug.setupBehind` ma jedno źródło (BarBend) → karty zza pleców spadają do „otwarte”.
5. **Fitness Volt — data tylko w metadanych** (fv-barbell-shrugs) — jak `fv-wrist-roller`; jeśli wymóg „widoczna data” jest ścisły, `shrug.mis.roll` traci drugie źródło (zostaje ACE) — wtedy błąd tylko jako wnioskowany z `shrug.move`? Nie: „krążenie” nie jest bezpośrednim zaprzeczeniem „unieś barki w górę” — wtedy `shrug.mis.roll` spada.
6. Zestaw ogólny `shrug` ma błąd `mis.jerk` (ogólny) — można go zastąpić `shrug.mis.sway` (konkretny dla rodziny); decyzja koordynatora.
7. Wersja zza pleców: BarBend dodaje „uważaj, żeby nie ciągnąć sztangi po tyle ud” — jedno źródło, nie wpisane.
