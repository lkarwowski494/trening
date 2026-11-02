# Wskazówki techniki — rodzina `hinge`, część 2 (warianty martwego ciągu)

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Korekta szczebli 02.11.2026

Zastosowano rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = (a) organizacja szkoląca trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor z datą albo treść firmowana; (c) nie recenzja z linkami afiliacyjnymi ani marketing; Breaking Muscle — 5 i nigdy niezależne od BarBend).

- Zmienione szczeble: `Fitness Volt` „4? do akceptacji” → **5** (serwis treningowy bez organizacji szkolącej i bez wskazanej recenzji eksperckiej, odsyła do recenzji produktów — ocena i sprawdzenie strony w `kneeling_hinge.md`); `BoxLife Magazine` „4? do akceptacji” → **5** (magazyn bez recenzji eksperckiej, autor bez podanych kwalifikacji — nie spełnia (a)); `Breaking Muscle` 4 → **5** (lista koordynatora); `Gymreapers` „4?” → **5** (marka akcesoriów, autor bez kwalifikacji; nie wykazano, że gumy to jej własny rodzaj sprzętu — źródło i tak tylko w „Otwarte”).
- Sprawdzone strony (WebFetch 02.11.2026): BarBend `news/chad-vaughn-clean-deadlift` — artykuł o technice, autor Chad Vaughn (olimpijczyk, trener USA Weightlifting), aktualizacja 17.07.2023, bez linków produktowych w treści → **4**. Bells of Steel `how-to-do-the-cable-deadlift` — poradnik producenta z datą 23.10.2023, o wyciągach, które sam produkuje (linki do własnych wież z wyciągiem) → **4** dla martwego ciągu na wyciągu.
- Ćwiczenia, które spadły do otwartych: **Axle Deadlift** (gotowe warunkowo → otwarte; każde zdanie miało BarBend + Fitness Volt), **Cable Deadlift** (gotowe warunkowo → otwarte; `hinge.back` traci BoxLife, zostaje 1 zdanie we wskazówkach i błędach).
- Zdania usunięte z bloku JSON: 5 (Axle: `axle.setup`, `dl.lift`, `dl.close`, `dl.mis.hipsFirst`; Cable: `hinge.back`). Pozostałe zdania Cable Deadlift (`cabledl.setup`, `tb.lift`, `cabledl.close` — Eleiko + Bells of Steel) przeniesione do danych częściowych. Przy One-Arm Side Deadlift usunięto z `hinge.back` źródło `bm-one-hand-deadlift` (zostają 2 inne — zdanie bez zmian).
- Clean Deadlift i One-Arm Side Deadlift — bez zmian, gotowe.
- Oznaczenia „DO AKCEPTACJI” i „4?” usunięte — zastąpione oceną wyżej.

Metoda jak w `docs/research/33-wskazowki-partia2.md` („Metoda”): każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z różnych
organizacji, o tym ćwiczeniu albo jego wariancie („(wariant: …)”); źródło o innym ćwiczeniu = analogia, nie liczy się. Zdania
z zestawu ogólnego (`lib/figures/v2/cue-sets.json`, `hingeFloor`), których przeczytane źródła wariantu nie potwierdzają, pominięto
(lista w „Otwarte”). Bez liczb i uzasadnień zdrowotnych. Role mięśni — poza zakresem (inny agent). Strony innych aplikacji
treningowych z wyników wyszukiwania pominięto i nie zapisano.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Axle Deadlift | otwarte (korekta 02.11) | BarBend (4) + Fitness Volt (5) — tylko 1 źródło szczebla 4. |
| Cable Deadlift | otwarte (korekta 02.11) | Eleiko + Bells of Steel (oba 4): ustawienie, ruch i 1 wskazówka; `hinge.back` miało Bells of Steel + BoxLife (5) → wskazówki + błędy = 1. |
| Leverage Deadlift | otwarte | ExRx (403); znalezione opisy tylko w bazach innych aplikacji (nie źródło). |
| Clean Deadlift | gotowe | Catalyst Athletics + BarBend (artykuł o technice Chada Vaughna). |
| Snatch Deadlift | otwarte | tylko Catalyst Athletics; materiały o „snatch-grip deadlift” to inne ćwiczenie (Catalyst wprost odróżnia) — analogia. |
| One-Arm Side Deadlift | gotowe | (wariant: kettlebell) The Prehab Guys + Onnit (producent kettlebelli, autor CSCS). |
| Deadlift with Bands | otwarte | ustawienie gum: Gymreapers (5) i Barbell Logic — po korekcie 1 źródło szczebla 4; ruch zawodnika — tylko Gymreapers. |
| Deadlift with Chains | otwarte | tylko elitefts (Wendler) — samo zawieszenie łańcuchów; brak drugiego źródła. |
| Rack Pull with Bands | otwarte | nie znaleziono źródła o tym wariancie. |
| Reverse Band Deadlift | otwarte | ustawienie gum: 2 źródła (Barbell Logic; Rusin — wariant: trap bar); ruch — tylko Rusin. |
| Reverse Band Sumo Deadlift | otwarte | żadne przeczytane źródło nie opisuje wersji sumo z odwróconymi gumami. |
| Sumo Deadlift with Bands | otwarte | j.w. — brak źródła o wersji sumo z gumami. |
| Sumo Deadlift with Chains | otwarte | j.w. — brak źródła o wersji sumo z łańcuchami. |
| Rickshaw Deadlift | otwarte | tylko opisy sprzętu (wymiary uchwytów) i baza innej aplikacji; strona ćwiczenia elitefts — 404. |

Wynik po korekcie: gotowe 2 (Clean Deadlift, One-Arm Side Deadlift), otwarte 12 (przed korektą: gotowe 2, gotowe warunkowo 2, otwarte 10).

## 2. Uzasadnienie zdań (źródło — miejsce)

### Clean Deadlift (gotowe)
- `cdl.setup` (nowe) — `catalyst-176` (opis: pozycja startowa zarzutu, chwyt jak do zarzutu, kolana wypchnięte na zewnątrz do wewnętrznej strony rąk; parafraza); `barbend-vaughn-clean-deadlift` (start position — „touching the inside of arm with outside of knee”, chwyt jak do zarzutu).
- `cdl.move` (nowe) — Catalyst (opis: nacisk całą stopą, ten sam kąt pleców, aż sztanga minie kolana; parafraza); BarBend / Vaughn („back is holding position as legs lift”; kąt pleców przy podłodze taki sam jak nad kolanem; parafraza).
- `dl.close` (istniejące) — Catalyst (opis: sztanga blisko nóg; parafraza); BarBend / Vaughn (ustawienie barków nad sztangą, żeby „keep bar close”).
- `hinge.back` (istniejące) — Catalyst (opis: plecy usztywnione i wyprostowane, płaskie; parafraza); BarBend / Vaughn (napięcie pleców i utrzymanie ich pozycji; parafraza).
- `mis.barAway` (istniejące) — BarBend / Vaughn (barki przed sztangą → sztanga ucieka do przodu, ciało za nią; parafraza); Catalyst (opis: sztanga jak najbliżej nóg; parafraza).
- Pominięte z zestawu ogólnego: `dl.lift` (pełny wyprost na górze — tylko Catalyst), `mis.roundBack` (żadne ze źródeł nie opisuje tego błędu wprost).

### One-Arm Side Deadlift (gotowe; wariant: kettlebell)
- `sdl.setup` (nowe) — `prehab-suitcase-deadlift-kb` (HOW) „Stand with a kettlebell on the ground at the outside of one foot.” (stopy na szerokość barków); `onnit-suitcase-deadlift` (Suitcase Deadlift, krok 1: ciężar z boku jednej nogi, stopy na szerokość bioder; parafraza). Część wspólna rozstawu: biodra–barki.
- `sdl.move` (nowe) — The Prehab Guys (HOW: pochylenie w biodrach, ugięcie kolan, chwyt; „push into the ground with your feet and extend your body back up straight”); Onnit (krok 2–3: najpierw biodra, kolana tyle, ile trzeba) „Drive your feet through the floor and extend your hips to stand tall.”
- `hinge.back` (istniejące) — The Prehab Guys (HOW: „back flat”); Onnit (krok 2: długi kręgosłup; parafraza). (`bm-one-hand-deadlift`, wariant: sztanga — szczebel 5, nie liczy się.)
- `sdl.mis.lean` (nowe) — The Prehab Guys (COMPENSATION) „Don't lean to the side picking up the weight, stay strong and upright.”; Onnit (krok 3: barki równo, tułów prosty, „avoid any twisting or bending”).
- Pominięte: `dl.lift` (tekst dla sztangi przed nogami), `mis.roundBack` (żadne źródło wprost).
- Uwaga dla integracji: katalog nie mówi, jakim sprzętem — źródła opisują kettlebell (2) i sztangę (1); zdania nie wymieniają sprzętu.

## 3. Wpisy do `cues.json` → `exercises`

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
      {"c": "mis.barAway", "s": [["barbend-vaughn-clean-deadlift", "shoulders in front → bar drifts forward"], ["catalyst-176", "opis (bar as close as possible)"]]}
    ]
  },
  "One-Arm Side Deadlift": {
    "setup": [
      {"c": "sdl.setup", "s": [["prehab-suitcase-deadlift-kb", "HOW (wariant: kettlebell)"], ["onnit-suitcase-deadlift", "Suitcase Deadlift, krok 1 (wariant: kettlebell)"]]}
    ],
    "move": [
      {"c": "sdl.move", "s": [["prehab-suitcase-deadlift-kb", "HOW"], ["onnit-suitcase-deadlift", "kroki 2–3"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["prehab-suitcase-deadlift-kb", "HOW (back flat)"], ["onnit-suitcase-deadlift", "krok 2 (long spine)"]]}
    ],
    "mistakes": [
      {"c": "sdl.mis.lean", "s": [["prehab-suitcase-deadlift-kb", "COMPENSATION"], ["onnit-suitcase-deadlift", "krok 3 (avoid twisting or bending)"]]}
    ]
  }
}
```

### 3a. Częściowe (ćwiczenia otwarte — nie do `cues.json`)

- **Axle Deadlift** — 1 źródło szczebla 4 (`barbend-axle-deadlift`); `fitnessvolt-axle-vs-barbell` — 5.
  - `axle.setup` — BarBend Step 1: Setup; Fitness Volt Stance; Grip (Fitness Volt: „The only real difference between axle and barbell deadlifts is the bar itself.”).
  - `dl.lift` — BarBend Step 2–3; Fitness Volt Pull; Lockout.
  - `dl.close` — BarBend (gryf „trapped against the body”); Fitness Volt Bar Path; Lowering.
  - `dl.mis.hipsFirst` — BarBend Step 2: Pulling („hips and shoulders should rise at the same rate”); Fitness Volt Common Mistakes.
- **Cable Deadlift** — zdania z 2 źródłami szczebla 4 (Eleiko + Bells of Steel): `cabledl.setup` (Eleiko Setup; BoS kroki 1–3), `tb.lift` (Eleiko Movement; BoS Movement; Lockout), `cabledl.close` (Eleiko Cues; BoS Movement). Brakuje drugiego zdania we wskazówkach/błędach: `hinge.back` — BoS Back („Maintain a neutral spine…”) + `boxlife-cable-deadlift` (5); Eleiko mówi tylko o napiętym tułowiu.

## 4. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `cdl.setup` | Ustaw się jak do zarzutu: chwyt jak do zarzutu, kolana wypchnięte na zewnątrz, aż dotkną rąk. | Set up like for a clean: clean grip, knees pushed out until they touch your arms. | Pozycja startowa inna niż w zwykłym martwym ciągu (kolana do rąk). |
| `cdl.move` | Odrywaj sztangę nogami, trzymając ten sam kąt pleców, aż minie kolana. | Drive the bar up with your legs, holding the same back angle until it passes your knees. | Sedno ćwiczenia według obu źródeł; `dl.lift` mówi o jednoczesnym prostowaniu bioder — tu biodra otwierają się dopiero nad kolanami. |
| `sdl.setup` | Postaw ciężar z boku jednej stopy; stopy na szerokość bioder do barków. | Set the weight beside one foot; feet hip- to shoulder-width apart. | Ustawienie z ciężarem z boku — brak zdania. |
| `sdl.move` | Cofnij biodra i ugnij kolana, chwyć ciężar jedną ręką; wypchnij stopy w podłogę i wstań prosto. | Push your hips back and bend your knees, grab the weight with one hand; drive through the floor and stand tall. | Ruch z ciężarem z boku, jedną ręką — brak zdania. |
| `sdl.mis.lean` | Przechylanie się w bok albo skręcanie tułowia przy podnoszeniu. | Leaning to the side or twisting as you lift. | `carry.noLean` dotyczy marszu („idź wyprostowany”). |

Wstrzymane w korekcie 02.11 (ćwiczenia otwarte): `axle.setup` („Stopy na szerokość bioder; chwyć gruby gryf oburącz nachwytem.” / „Feet hip-width apart; grab the thick bar with both hands, overhand.”), `dl.mis.hipsFirst` („Biodra idą w górę szybciej niż barki.” / „Hips shooting up faster than the shoulders.”), `cabledl.setup` („Stań przodem do wyciągu z drążkiem na dolnym bloczku, stopy na szerokość bioder; chwyć drążek nachwytem, ręce proste.”), `cabledl.close` („Prowadź drążek blisko ciała przez cały ruch.”).

## 5. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `barbend-axle-deadlift` | https://barbend.com/axle-deadlift/ | BarBend (istniejąca) | 4 (artykuł o technice) | Step 1–3 (autor CSCS) |
| `fitnessvolt-axle-vs-barbell` | https://fitnessvolt.com/axle-deadlift-vs-barbell-deadlift/ | Fitness Volt (nowa) | 5 (korekta 02.11) | „The only real difference between axle and barbell deadlifts is the bar itself.” |
| `eleiko-6582f9bc` | https://eleiko.inspire360.com/resource/6582f9bcd6c0e9bcec04fe16 | Eleiko (istniejąca) | 4 | Setup; Movement; Cues |
| `bos-cable-deadlift` | https://bellsofsteel.us/blogs/content/how-to-do-the-cable-deadlift | Bells of Steel (nowa, producent wyciągów) | 4 (własny rodzaj sprzętu) | kroki; Back; Movement (bez autora, firmowane, 23.10.2023) |
| `boxlife-cable-deadlift` | https://boxlifemagazine.com/cable-deadlift/ | BoxLife Magazine (nowa) | 5 (korekta 02.11) | plecy płaskie (autor bez kwalifikacji) |
| `catalyst-176` | https://www.catalystathletics.com/exercise/176/Clean-Deadlift/ | Catalyst Athletics (nowa) | 4 | opis ćwiczenia |
| `catalyst-187` | https://catalystathletics.com/exercise/187/Snatch-Deadlift/ | Catalyst Athletics | 4 | opis (tylko do „Otwarte”) |
| `barbend-vaughn-clean-deadlift` | https://barbend.com/news/chad-vaughn-clean-deadlift/ | BarBend (istniejąca) | 4 (artykuł o technice, autor i data sprawdzone 02.11) | „back is holding position as legs lift” |
| `prehab-suitcase-deadlift-kb` | https://theprehabguys.com/vimeo-video/suitcase-deadlift-kettlebell/ | The Prehab Guys (istniejąca) | 4 | HOW; COMPENSATION |
| `onnit-suitcase-deadlift` | https://www.onnit.com/academy/barbell-exercise-1-arm-suitcase-deadlift | Onnit (nowa, producent kettlebelli; autor CSCS) | 4 (własny rodzaj sprzętu: kettlebell) | adres przekierowuje do „The Best Kettlebell Deadlift Exercises”, sekcja Suitcase Deadlift |
| `bm-one-hand-deadlift` | https://breakingmuscle.com/?p=147467 | Breaking Muscle (istniejąca) | 5 (korekta 02.11) | „How Much Can You Deadlift With One Hand?” — po korekcie nieużyte |
| `gymreapers-banded-deadlift` | https://gymreapers.com/blogs/news/banded-deadlifts | Gymreapers (nowa, marka akcesoriów) | 5 (korekta 02.11) | Step 1–6 (tylko do „Otwarte”) |
| `barbelllogic-bands` | https://barbell-logic.com/?p=5455 | Barbell Logic (nowa, szkoła trenerów) | 4 (a) — autor/data nieodnotowane, sprawdzić przy użyciu | Bands for the Deadlift; Reverse Bands (tylko do „Otwarte”) |
| `rusin-reverse-band` | https://drjohnrusin.com/how-to-use-the-lightening-band-aka-reverse-band-method | Dr John Rusin (nowa, fizjoterapeuta-trener) | nieoceniane wg (a)–(c) — źródło tylko do „Otwarte”, ocenić przy użyciu | The Reverse Band Trap Bar Deadlift |
| `elitefts-wendler-chains` | https://elitefts.com/blogs/training/deadlifting-with-chains | elitefts (nowa, producent gum i łańcuchów) | 4 dla gum i łańcuchów | The Set Up; Important Points (tylko do „Otwarte”) |

```json
{
  "orgs": {
    "Bells of Steel": {"name": "Bells of Steel — blog producenta sprzętu siłowego (bellsofsteel.us; szczebel 4 tylko dla własnego rodzaju sprzętu)", "level": 4, "kind": "maker"},
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; szkoła i klub podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "Onnit": {"name": "Onnit Academy — poradniki producenta kettlebelli i sprzętu (onnit.com; autor CSCS; szczebel 4 tylko dla własnego rodzaju sprzętu)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "catalyst-176": {"org": "Catalyst Athletics", "title": "Clean Deadlift", "url": "https://www.catalystathletics.com/exercise/176/Clean-Deadlift/", "level": 4},
    "barbend-vaughn-clean-deadlift": {"org": "BarBend", "title": "Chad Vaughn — clean deadlift (2023)", "url": "https://barbend.com/news/chad-vaughn-clean-deadlift/", "level": 4},
    "prehab-suitcase-deadlift-kb": {"org": "The Prehab Guys", "title": "Suitcase Deadlift (Kettlebell)", "url": "https://theprehabguys.com/vimeo-video/suitcase-deadlift-kettlebell/", "level": 4},
    "onnit-suitcase-deadlift": {"org": "Onnit", "title": "The Best Kettlebell Deadlift Exercises — Suitcase Deadlift", "url": "https://www.onnit.com/academy/barbell-exercise-1-arm-suitcase-deadlift", "level": 4}
  }
}
```

(Źródła ćwiczeń otwartych — `barbend-axle-deadlift`, `fitnessvolt-axle-vs-barbell`, `eleiko-6582f9bc`, `bos-cable-deadlift`, `boxlife-cable-deadlift`, `bm-one-hand-deadlift`, `catalyst-187`, `gymreapers-banded-deadlift`, `barbelllogic-bands`, `rusin-reverse-band`, `elitefts-wendler-chains` — nie wchodzą do `sources`, dopóki nie zasilą gotowego ćwiczenia. Organizacje `Fitness Volt`, `BoxLife Magazine` — szczebel 5, bez wpisu do `orgs`, dopóki nieużyte.)

## 6. Otwarte

Informacja o zestawach ogólnych (`cue-sets.json`): dla żadnego z 14 wariantów przeczytane źródła nie potwierdziły w całości obecnego
zestawu (`dl.lift`, `hinge.back`, `dl.close`, `mis.roundBack`; Rickshaw: `tb.lift`; sumo: `sumo.kneesOut`). W szczególności
`mis.roundBack` nie ma 2 źródeł przy żadnym wariancie, a zestawy dla wersji z gumami/łańcuchami/sumo i Rickshaw nie mają źródła o tym wariancie.

- **Axle Deadlift** (korekta 02.11) — po korekcie tylko BarBend (4). Rozstrzygnie: drugie źródło szczebla 4 o martwym ciągu z grubym gryfem (np. producent takiego gryfu, organizacja szkoląca trenerów); Breaking Muscle się nie liczy (5, ten sam właściciel co BarBend).
- **Cable Deadlift** (korekta 02.11) — brakuje drugiego zdania we wskazówkach/błędach (`hinge.back` ma po korekcie tylko Bells of Steel). Rozstrzygnie: drugie źródło szczebla 4 o plecach albo o błędzie (np. inny producent wyciągów).
- **Snatch Deadlift** — jedno źródło (Catalyst 187: pięty na szerokość bioder, palce na zewnątrz, kolana wypchnięte do rąk, chwyt rwania, barki nad sztangą, ten sam kąt pleców do minięcia kolan, sztanga blisko nóg). Rozstrzygnie: drugi opis „snatch deadlift” (nie „snatch-grip deadlift”) od innej organizacji, np. federacji podnoszenia ciężarów lub Eleiko.
- **Leverage Deadlift** — brak źródła szczebla 4 (ExRx 403; reszta to bazy innych aplikacji). Rozstrzygnie: instrukcja producenta maszyny.
- **Deadlift with Bands** — ustawienie gum: Barbell Logic „Bands for the Deadlift” (kołki szeroko, gumy prostopadle do gryfu) + Gymreapers Step 1 (szczebel 5 po korekcie) → 1 źródło szczebla 4. Proponowane zdanie (nie do aplikacji): „Zaczep gumy o oba końce gryfu i zakotwicz je nisko, równo po obu stronach.” Ruch zawodnika — tylko Gymreapers. Rozstrzygnie: drugi opis z gumami od organizacji szczebla 4 (np. producent gum).
- **Reverse Band Deadlift** — ustawienie: Barbell Logic „Reverse Bands”; Rusin (wariant: trap bar — gumy zaczepione o górę stojaka, pomagają przy podłodze). Rusin nieoceniony wg (a)–(c). Ruch („przyspieszaj z podłogi aż do wyprostu”) — tylko Rusin. Rozstrzygnie: ocena Rusina i drugi opis ruchu.
- **Deadlift with Chains** — tylko elitefts/Wendler (łańcuchy równo po obu stronach, za zawodnikiem, nie przed gryfem). Rozstrzygnie: drugie źródło (Barbell Logic odsyła do filmu innego serwisu — tekst bez kroków).
- **Rack Pull with Bands, Reverse Band Sumo Deadlift, Sumo Deadlift with Bands, Sumo Deadlift with Chains** — brak jakiegokolwiek przeczytanego źródła o tych wariantach. Bazowe `Sumo Deadlift` ma wskazówki, ale żadne źródło nie mówi, że wersja z dodatkiem ma ten sam ruch.
- **Rickshaw Deadlift** — brak opisu techniki (tylko wymiary sprzętu; elitefts exercise-index 404).
- **`hinge.back` a „arch your lower back”** (Fitness Volt) — po korekcie bez znaczenia dla kart (Fitness Volt się nie liczy); uwaga zostaje dla przeglądu zestawu ogólnego.

## 7. Dostęp

- ExRx.net — 403; web.archive.org i archive.ph — zablokowane przez narzędzie (nie próbowano dalej, zgodnie z koordynatorem).
- powerliftingtechnique.com — 403 (banded deadlift; reverse band deadlift nieczytany).
- elitefts.com/education/… (deadlifting-with-chains, reverse band deadlift, rickshaw deadlift) — 404; wersja w `blogs/training` działała.
- barbend.com/clean-deadlift/ — 404; bodybuilding.com/exercises/deadlift-with-bands → 404 po przekierowaniu; garagegymreviews.com/suitcase-deadlift — 404.
- catalystathletics.com/exercise/120/ — strona ogólna biblioteki (zły numer); poprawne: 176 (clean), 187 (snatch).
