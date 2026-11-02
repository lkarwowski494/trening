# Wskazówki techniki — rodzina `hinge`, część 2 (warianty martwego ciągu) — fala W2

Data: 02.11.2026 · rodzina: `hinge` (część 2: ćwiczenia z pliku W1 `hinge-cz2.md`) · **Status: PROPOZYCJA** · autor: badacz-merytoryczny (fala W2)

Podstawa: wyniki W1 (gałąź badania/g4-nogi, plik `hinge-cz2.md`) i przeliczenie szczebli (gałąź badania/g4-nogi, plik
`przeliczenie-szczebli-2026-11-02.md`, sekcja „hinge-cz2.md” — nadrzędne wobec „Korekta szczebli” z W1); szczeble organizacji:
`szczeble-organizacji-2026-11-02.md` (gałąź badania/lokalne-0211). Rodzina `hinge` ma status `ready` → karta własna liczy się tylko z ≥ 1 błędem.
Żadne z 14 ćwiczeń nie ma trybu `own` w `lib/figures/v2/cue-sets.json` (wszystkie `general`, zestaw `hingeFloor`).

Metoda W2:
- **Wariant sprzętu** (brief W2): martwy ciąg z grubym gryfem (axle) i na wyciągu (linka) korzysta ze źródeł karty bazowej
  `Deadlift (sztanga)` w `data/zrodla/cues.json` (ace-6, nasm-barbell-deadlift, exrx-ErectorSpinae/BBDeadlift, sbs-how-to-deadlift) —
  oznaczenie `uproszczenie: wariant sprzętu Deadlift (sztanga)`. Że ruch się nie różni, mówi wprost źródło szczebla 4 o samym wariancie:
  BarBend o axle („the broad technique of the axle pull is identical to a regular deadlift”), Bells of Steel o wyciągu („a variation of
  the traditional barbell deadlift”). Każde zdanie ma też źródło o samym wariancie.
- **Błędy wnioskowane**: `mis.roundBack` = zaprzeczenie potwierdzonego `hinge.back` tego ćwiczenia (uwaga W1 o wariantach `hingeFloor`);
  `dl.mis.hipsFirst` przy Clean Deadlift = zaprzeczenie potwierdzonego `cdl.move` (ten sam kąt pleców, aż sztanga minie kolana —
  biodra uciekające w górę zmieniają ten kąt; widać na rysunku).
- Strony przeczytane WebFetch 02.11.2026. Strony innych aplikacji treningowych z wyników wyszukiwania pominięto i nie zapisano.

## 1. Tabela ćwiczeń

| Ćwiczenie | poza v2 | stan | co dodano w W2 | brak |
|---|---|---|---|---|
| Clean Deadlift | nie (zestaw `hingeFloor`) | gotowe z błędem | błędy wnioskowane `mis.roundBack` (← `hinge.back`), `dl.mis.hipsFirst` (← `cdl.move`) | — |
| Axle Deadlift | nie | gotowe z błędem (uproszczenie: wariant sprzętu) | BarBend (4, autor CSCS, 27.05.2025) + karta bazowa Deadlift (sztanga); błędy `mis.roundBack` (wniosek), `mis.barAway` (źródła bazy + wniosek z `dl.close`) | `dl.mis.hipsFirst` — tylko BarBend |
| Cable Deadlift | nie | gotowe z błędem (uproszczenie: wariant sprzętu) | Bells of Steel (4, firmowane, 23.10.2023) + karta bazowa; błąd `mis.roundBack` (wniosek + źródło bazy) | — |
| One-Arm Side Deadlift | nie | otwarte | znalezione 1 źródło szczebla 4: BarBend, A. Polish (ACE-CPT), 27.11.2024 | drugie niezależne źródło szczebla 4 (Onnit = 5, The Prehab Guys bez autora = 5, elitefts — 404) |
| Snatch Deadlift | nie | otwarte | — (wyszukiwanie bez wyniku szczebla 4) | drugie źródło obok Catalyst 187 |
| Deadlift with Bands | nie | otwarte | Barbell Logic `?p=5455` sprawdzone: bez autora i daty → 5 | 2 źródła o zakładaniu gum i o ruchu |
| Reverse Band Deadlift | nie | otwarte | j.w. (Barbell Logic = 5) | j.w. |
| Leverage Deadlift, Deadlift with Chains, Rack Pull with Bands, Reverse Band Sumo Deadlift, Sumo Deadlift with Bands, Sumo Deadlift with Chains, Rickshaw Deadlift | nie | otwarte | — (nie badano ponownie; stan W1) | jak w W1, sekcja 6 |

Wynik: gotowe z błędem **3** (Clean, Axle, Cable), otwarte 11. Poz v2 — rodzina `hinge` nie ma ćwiczeń z tego pliku w `cwiczenia`
(zestaw `hingeFloor`, tryb `general`).

### Blok do wdrożenia

```json
{
  "Clean Deadlift": {
    "setup": [
      {"c": "cdl.setup", "s": [["catalyst-176", "opis (starting position)"], ["barbend-vaughn-clean-deadlift", "start position (knees out, clean grip)"]]}
    ],
    "move": [
      {"c": "cdl.move", "s": [["catalyst-176", "opis (back angle until bar passes knees)"], ["barbend-vaughn-clean-deadlift", "back holding position as legs lift"]]}
    ],
    "tips": [
      {"c": "dl.close", "s": [["catalyst-176", "opis (bar close to legs)"], ["barbend-vaughn-clean-deadlift", "keep bar close"]]},
      {"c": "hinge.back", "s": [["catalyst-176", "opis (back braced and extended)"], ["barbend-vaughn-clean-deadlift", "back tension and position maintenance"]]}
    ],
    "mistakes": [
      {"c": "mis.barAway", "s": [["barbend-vaughn-clean-deadlift", "shoulders in front → bar drifts forward"], ["catalyst-176", "opis (bar as close as possible) — błąd = zaprzeczenie standardu"]]},
      {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"]]},
      {"c": "dl.mis.hipsFirst", "s": [["wniosek", "cdl.move"]]}
    ]
  },
  "Axle Deadlift": {
    "setup": [
      {"c": "axle.setup", "s": [["barbend-axle-deadlift", "How to Do — Step 1: Get Set Up (feet hip-width, double overhand grip)"], ["ace-6", "opis — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["nasm-barbell-deadlift", "Step 1: Setup — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ],
    "move": [
      {"c": "dl.lift", "s": [["barbend-axle-deadlift", "Step 2: Push Into the Floor; Step 3: Lock and Hold"], ["ace-6", "opis — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["nasm-barbell-deadlift", "Step 3: Execute/Drive — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["barbend-axle-deadlift", "Step 1 (keep your back flat); Step 2 (back flat)"], ["ace-6", "opis (straight/flat back) — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["nasm-barbell-deadlift", "Step 3; Step 4 (neutral spine) — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]},
      {"c": "dl.close", "s": [["barbend-axle-deadlift", "Benefits (bar stays trapped against the body)"], ["nasm-barbell-deadlift", "Common Mistakes (bar drifting away) — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["sbs-how-to-deadlift", "Bar Path — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"]]},
      {"c": "mis.barAway", "s": [["wniosek", "dl.close"], ["nasm-barbell-deadlift", "Common Mistakes — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ]
  },
  "Cable Deadlift": {
    "setup": [
      {"c": "cabledl.setup", "s": [["bos-cable-deadlift", "kroki 1–3 (low pulley, feet hip-width, overhand grip shoulder-width, arms extended)"], ["nasm-barbell-deadlift", "Step 1: Setup (stance, grip) — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["ace-6", "opis — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ],
    "move": [
      {"c": "tb.lift", "s": [["bos-cable-deadlift", "Movement (extend hips and knees at the same time); Lockout"], ["ace-6", "opis — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["nasm-barbell-deadlift", "Step 3: Execute/Drive — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["bos-cable-deadlift", "Back (maintain a neutral spine)"], ["ace-6", "opis (straight/flat back) — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["nasm-barbell-deadlift", "Step 3; Step 4 (neutral spine) — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]},
      {"c": "cabledl.close", "s": [["bos-cable-deadlift", "Bar path (keep the cable close to your body)"], ["exrx-ErectorSpinae/BBDeadlift", "Comments (keep bar close to body) — uproszczenie: wariant sprzętu Deadlift (sztanga)"], ["sbs-how-to-deadlift", "Bar Path — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["wniosek", "hinge.back"], ["nasm-barbell-deadlift", "Common Mistakes (excessive spinal flexion) — uproszczenie: wariant sprzętu Deadlift (sztanga)"]]}
    ]
  }
}
```

Uwagi do bloku:
- Clean Deadlift — bez zmian względem W1 poza dwoma błędami wnioskowanymi. `dl.lift` z zestawu ogólnego celowo pominięte (W1: tylko Catalyst;
  `cdl.move` opisuje inny rozkład ruchu — biodra otwierają się dopiero nad kolanami).
- Axle — `mis.barAway` („Sztanga odjeżdża od ciała”) pasuje, bo axle to gruby gryf sztangi.
- Cable — nie używam `mis.barAway` ani `dl.close` (słowo „sztanga”; na wyciągu jest drążek/uchwyt); stąd `cabledl.close`.
- Uproszczenie (wariant sprzętu) dotyczy ustawienia ciała i ruchu; ustawienie wyciągu (dolny bloczek, przodem do wyciągu) ma tylko
  Bells of Steel — producent wyciągów, szczebel 4 dla własnego rodzaju sprzętu. To elementy ustawienia sprzętu, nie techniki ciała;
  koordynator może uznać je za „jedno źródło” — wtedy wariant: skrócić `cabledl.setup` do „Stopy na szerokość bioder; chwyć drążek
  nachwytem na szerokość barków, ręce proste.” (pełne pokrycie bazą + BoS).

## 2. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| `cdl.setup` (z W1) | Ustaw się jak do zarzutu: chwyt jak do zarzutu, kolana wypchnięte na zewnątrz, aż dotkną rąk. | Set up like for a clean: clean grip, knees pushed out until they touch your arms. | W1 — pozycja startowa inna niż w zwykłym martwym ciągu. |
| `cdl.move` (z W1) | Odrywaj sztangę nogami, trzymając ten sam kąt pleców, aż minie kolana. | Drive the bar up with your legs, holding the same back angle until it passes your knees. | W1 — sedno ćwiczenia. |
| `dl.mis.hipsFirst` | Biodra idą w górę szybciej niż barki. | Hips shooting up faster than your shoulders. | Zaprzeczenie `cdl.move` (Clean); brzmienie z W1 (wstrzymane tam przy Axle). |
| `axle.setup` | Stopy na szerokość bioder; chwyć gruby gryf oburącz nachwytem. | Feet hip-width apart; grab the thick bar with both hands, overhand. | Gruby gryf — chwyt nachwytem oburącz (BarBend Step 1); `dl.grip` mówi o chwycie mieszanym i „sztandze”. |
| `cabledl.setup` | Stań przodem do wyciągu z drążkiem na dolnym bloczku, stopy na szerokość bioder; chwyć drążek nachwytem na szerokość barków, ręce proste. | Face the cable with a bar on the low pulley, feet hip-width apart; grab the bar overhand, shoulder-width, arms straight. | Ustawienie przy wyciągu (BoS kroki 1–3); brzmienie W1 + szerokość chwytu z BoS. |
| `cabledl.close` | Prowadź drążek blisko ciała przez cały ruch. | Keep the bar close to your body the whole way. | `dl.close` mówi o sztandze; na wyciągu drążek (BoS). |

## 3. Źródła

| id | adres | organizacja | autor / kwalifikacje / data | szczebel |
|---|---|---|---|---|
| `catalyst-176` (W1) | https://www.catalystathletics.com/exercise/176/Clean-Deadlift/ | Catalyst Athletics | biblioteka firmowana (G. Everett, trener USA Weightlifting) | 4 (tabela szczebli, wiersz Catalyst) |
| `barbend-vaughn-clean-deadlift` (W1) | https://barbend.com/news/chad-vaughn-clean-deadlift/ | BarBend | Chad Vaughn (olimpijczyk, trener USA Weightlifting), 17.07.2023 | 4 (przeliczenie, hinge-cz2) |
| `barbend-axle-deadlift` | https://barbend.com/axle-deadlift/ | BarBend | Mike Dewar (MS Exercise Physiology, CSCS), „Last updated May 27th, 2025”; sekcje Step 1–3, Benefits | 4 (przeliczenie, wiersz BarBend axle; sprawdzone ponownie 02.11.2026) |
| `bos-cable-deadlift` | https://bellsofsteel.us/blogs/content/how-to-do-the-cable-deadlift | Bells of Steel (producent wyciągów) | bez autora, firmowane, 23.10.2023; linki do własnych wież z wyciągiem | 4 — producent, własny rodzaj sprzętu (kryterium 1 i 2) |
| `ace-6`, `nasm-barbell-deadlift`, `exrx-ErectorSpinae/BBDeadlift`, `sbs-how-to-deadlift` | istniejące w `data/zrodla/cues.json` (karta `Deadlift (sztanga)`) | ACE, NASM, ExRx, Stronger by Science | wg cues.json | 4 — użyte tylko jako `uproszczenie: wariant sprzętu Deadlift (sztanga)` |
| `barbend-best-oblique-exercises` (tylko „Otwarte”) | https://barbend.com/best-oblique-exercises/ | BarBend | Alex Polish (ACE-CPT, NASM-CNC), „Last updated November 27th, 2024”; ćwiczenie nr 4 Suitcase Deadlift | 4 |
| `barbelllogic-bands` (tylko „Otwarte”) | https://barbell-logic.com/?p=5455 | Barbell Logic | bez autora i daty (tylko „©2026”) | 5 (sprawdzone 02.11.2026 — warunek per strona niespełniony) |
| — (tylko „Otwarte”) | https://biolayne.com/articles/training/build-stronger-grip-better-deadlift-healthier-hands/ | Biolayne | Peter Baker, „personal trainer”, bez certyfikatu w biogramie, 16.12.2016 | 5 |
| — (tylko „Otwarte”) | https://strengthshop.eu/blogs/news/strongman-deadlifts-explained-axle-pulls-silver-dollar-deadlifts | Strength Shop (sklep) | bez autora, 10.07.2026; bez techniki | 5 |

Cytaty (po 1 zdaniu): BarBend axle, Step 2: „your hips and shoulders should rise at the same rate”; Bells of Steel, sekcja o plecach:
„Maintain a neutral spine, keeping your chest up and shoulders back.”; BarBend oblique, Suitcase Deadlift: „Hinge at the hips and grasp
the bell without tilting your shoulders, hips, or torso.”

## 4. Otwarte

- **One-Arm Side Deadlift** — jedno źródło szczebla 4 (BarBend, A. Polish: ustawienie obok ciężaru w rozstawie jak do martwego ciągu,
  zgięcie w biodrach bez przechylania barków, bioder i tułowia, „Drive your feet into the ground and stand up”). Zgodne z W1 (Onnit, Prehab — 5).
  Próby drugiego: elitefts exercise-index (404 — oba warianty adresu), T-Nation tip (404), BarBend `?p=51939` (strona główna), ACE (tylko
  „suitcase carry” — inne ćwiczenie). Rozstrzygnie: drugie niezależne źródło szczebla 4 (np. strona The Prehab Guys z autorem-fizjoterapeutą).
- **Axle Deadlift — `dl.mis.hipsFirst`** — standard tylko w BarBend (Step 2); karta bazowa go nie zawiera → bez 2 źródeł standardu.
- **Snatch Deadlift** — jedno źródło (Catalyst 187); wyszukiwanie dało tylko „snatch-grip deadlift” (inne ćwiczenie) i strony innych aplikacji.
- **Deadlift with Bands, Reverse Band Deadlift** — Barbell Logic `?p=5455` bez autora i daty = 5; nie mówi też, czy ruch zawodnika się zmienia.
  Uproszczenie „wariant sprzętu” niezasadne bez źródła szczebla 4, że ruch jest ten sam, i bez źródeł o zakładaniu gum.
- **Leverage Deadlift, Deadlift with Chains, Rack Pull with Bands, warianty sumo z gumami/łańcuchami, Rickshaw Deadlift** — stan W1, nie badane w W2.
- Do rozstrzygnięcia przez koordynatora: czy ustawienie samego sprzętu (wyciąg) z jednego źródła producenta szczebla 4 przy uproszczeniu
  „wariant sprzętu” wystarcza (sekcja „Uwagi do bloku”).
