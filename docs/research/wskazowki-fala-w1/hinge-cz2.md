# Wskazówki techniki — rodzina `hinge`, część 2 (warianty martwego ciągu)

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda jak w `docs/research/33-wskazowki-partia2.md` („Metoda”): każde zdanie ma ≥ 2 przeczytane źródła szczebla 4 z różnych
organizacji, o tym ćwiczeniu albo jego wariancie („(wariant: …)”); źródło o innym ćwiczeniu = analogia, nie liczy się. Zdania
z zestawu ogólnego (`lib/figures/v2/cue-sets.json`, `hingeFloor`), których przeczytane źródła wariantu nie potwierdzają, pominięto
(lista w „Otwarte”). Bez liczb i uzasadnień zdrowotnych. Role mięśni — poza zakresem (inny agent). Strony innych aplikacji
treningowych z wyników wyszukiwania pominięto i nie zapisano.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Axle Deadlift | gotowe warunkowo | BarBend + Fitness Volt. Fitness Volt — nowa organizacja do akceptacji (serwis z autorem-trenerem, szczebel 4?). Bez akceptacji → otwarte. |
| Cable Deadlift | gotowe warunkowo | Eleiko + Bells of Steel (producent sprzętu, nowa org.); `hinge.back` wymaga BoxLife (nowa org., autor bez podanych kwalifikacji) — bez niej tylko 1 zdanie we wskazówkach → otwarte. |
| Leverage Deadlift | otwarte | ExRx (403); znalezione opisy tylko w bazach innych aplikacji (nie źródło). |
| Clean Deadlift | gotowe | Catalyst Athletics (nowa org.) + BarBend (artykuł Chada Vaughna). |
| Snatch Deadlift | otwarte | tylko Catalyst Athletics; materiały o „snatch-grip deadlift” to inne ćwiczenie (Catalyst wprost odróżnia) — analogia. |
| One-Arm Side Deadlift | gotowe | (wariant: kettlebell) The Prehab Guys + Onnit (producent sprzętu, nowa org.); Breaking Muscle (wariant: sztanga) do `hinge.back`. |
| Deadlift with Bands | otwarte | ustawienie gum: 2 źródła (Gymreapers, Barbell Logic); ruch zawodnika — tylko Gymreapers. |
| Deadlift with Chains | otwarte | tylko elitefts (Wendler) — samo zawieszenie łańcuchów; brak drugiego źródła. |
| Rack Pull with Bands | otwarte | nie znaleziono źródła o tym wariancie. |
| Reverse Band Deadlift | otwarte | ustawienie gum: 2 źródła (Barbell Logic; Rusin — wariant: trap bar); ruch — tylko Rusin. |
| Reverse Band Sumo Deadlift | otwarte | żadne przeczytane źródło nie opisuje wersji sumo z odwróconymi gumami. |
| Sumo Deadlift with Bands | otwarte | j.w. — brak źródła o wersji sumo z gumami. |
| Sumo Deadlift with Chains | otwarte | j.w. — brak źródła o wersji sumo z łańcuchami. |
| Rickshaw Deadlift | otwarte | tylko opisy sprzętu (wymiary uchwytów) i baza innej aplikacji; strona ćwiczenia elitefts — 404. |

Wynik: gotowe 2 (Clean Deadlift, One-Arm Side Deadlift), gotowe warunkowo 2 (Axle Deadlift, Cable Deadlift), otwarte 10.

## 2. Uzasadnienie zdań (źródło — miejsce)

### Axle Deadlift (gotowe warunkowo)
- `axle.setup` (nowe) — `barbend-axle-deadlift` (Step 1: Setup — stopy na szerokość bioder, gryf oburącz nachwytem, dopuszczalny chwyt mieszany, „exactly how you would during a conventional barbell deadlift”); `fitnessvolt-axle-vs-barbell` (Stance; Grip) „Position your feet so that they are around hip-width apart.” (nachwyt; artykuł: „The only real difference between axle and barbell deadlifts is the bar itself.” — źródło samo mówi, że ruch jest ten sam).
- `dl.lift` (istniejące) — BarBend (Step 2: Pulling; Step 3: Lockout and Hold — wyprost jak w zwykłym martwym ciągu, pośladki napięte; parafraza); Fitness Volt (Pull) „Without bending your arms, press your feet into the floor and extend your knees and hips simultaneously.”
- `dl.close` (istniejące) — BarBend (tekst o różnicy z grubym gryfem: gryf musi zostać „trapped against the body”); Fitness Volt (Bar Path — gryf jedzie prawie pionowo; Lowering — opuszczanie wzdłuż przodu nóg; parafraza).
- `dl.mis.hipsFirst` (nowe) — Fitness Volt (Common Mistakes) „DO NOT let your hips rise faster than your shoulders.”; BarBend (Step 2: Pulling) „Your back should be flat and your hips and shoulders should rise at the same rate.”
- Pominięte z zestawu ogólnego: `hinge.back` (Fitness Volt: „arch your lower back” — dopisek „(neutralne)” nie jest częścią wspólną), `mis.roundBack` (żadne źródło nie opisuje tego błędu wprost).

### Cable Deadlift (gotowe warunkowo)
- `cabledl.setup` (nowe) — `eleiko-6582f9bc` (Setup: „facing the dual cable”, „feet hip-width distance”, „grip the bar with straight arms”); `bos-cable-deadlift` (kroki 1–3: drążek lub uchwyt V na dolnym bloczku, stopy na szerokość bioder, nachwyt, ręce wyprostowane; parafraza).
- `tb.lift` (istniejące; tekst bez wzmianki o sprzęcie) — Eleiko (Movement) „Push your feet through the ground, extending/straightening your hips and knees simultaneously to stand tall”; Bells of Steel (Movement; Lockout — biodra i kolana razem, „Fully extend your hips and stand tall.”).
- `cabledl.close` (nowe) — Eleiko (Cues) „Keep the weight close to your body; hips and shoulders should rise together.”; Bells of Steel (Movement) „Keep the cable close to your body throughout the movement.”
- `hinge.back` (istniejące) — Bells of Steel (Back) „Maintain a neutral spine, keeping your chest up and shoulders back.”; `boxlife-cable-deadlift` (plecy płaskie, przy zaokrąglaniu skróć zakres; parafraza) — **warunkowo** (nowa org., autor bez podanych kwalifikacji). Eleiko mówi tylko o napiętym tułowiu — nie przeczy.
- Pominięte: `dl.lift`/`dl.close`/`dl.lower` (tekst o sztandze), `mis.roundBack` (tylko BoxLife).

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
- `hinge.back` (istniejące) — The Prehab Guys (HOW: „back flat”); Onnit (krok 2: długi kręgosłup; parafraza); `bm-one-hand-deadlift` (wariant: sztanga; plecy „as straight as can be”).
- `sdl.mis.lean` (nowe) — The Prehab Guys (COMPENSATION) „Don't lean to the side picking up the weight, stay strong and upright.”; Onnit (krok 3: barki równo, tułów prosty, „avoid any twisting or bending”).
- Pominięte: `dl.lift` (tekst dla sztangi przed nogami), `mis.roundBack` (żadne źródło wprost).
- Uwaga dla integracji: katalog nie mówi, jakim sprzętem — źródła opisują kettlebell (2) i sztangę (1); zdania nie wymieniają sprzętu.

## 3. Wpisy do `cues.json` → `exercises`

Axle Deadlift i Cable Deadlift — tylko po akceptacji nowych organizacji (Fitness Volt; BoxLife), inaczej pominąć.

```json
{
  "Axle Deadlift": {
    "setup": [
      {"c": "axle.setup", "s": [["barbend-axle-deadlift", "Step 1: Setup"], ["fitnessvolt-axle-vs-barbell", "Stance; Grip"]]}
    ],
    "move": [
      {"c": "dl.lift", "s": [["barbend-axle-deadlift", "Step 2: Pulling; Step 3: Lockout and Hold"], ["fitnessvolt-axle-vs-barbell", "Pull; Lockout"]]}
    ],
    "tips": [
      {"c": "dl.close", "s": [["barbend-axle-deadlift", "tekst o grubym gryfie (bar trapped against the body)"], ["fitnessvolt-axle-vs-barbell", "Bar Path; Lowering"]]}
    ],
    "mistakes": [
      {"c": "dl.mis.hipsFirst", "s": [["fitnessvolt-axle-vs-barbell", "Common Mistakes"], ["barbend-axle-deadlift", "Step 2: Pulling (hips and shoulders rise at the same rate)"]]}
    ]
  },
  "Cable Deadlift": {
    "setup": [
      {"c": "cabledl.setup", "s": [["eleiko-6582f9bc", "Setup"], ["bos-cable-deadlift", "kroki 1–3"]]}
    ],
    "move": [
      {"c": "tb.lift", "s": [["eleiko-6582f9bc", "Movement"], ["bos-cable-deadlift", "Movement; Lockout"]]}
    ],
    "tips": [
      {"c": "cabledl.close", "s": [["eleiko-6582f9bc", "Cues"], ["bos-cable-deadlift", "Movement"]]},
      {"c": "hinge.back", "s": [["bos-cable-deadlift", "Back (neutral spine)"], ["boxlife-cable-deadlift", "how-to (flat back)"]]}
    ],
    "mistakes": []
  },
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
      {"c": "hinge.back", "s": [["prehab-suitcase-deadlift-kb", "HOW (back flat)"], ["onnit-suitcase-deadlift", "krok 2 (long spine)"], ["bm-one-hand-deadlift", "instrukcja (wariant: sztanga; back as straight as can be)"]]}
    ],
    "mistakes": [
      {"c": "sdl.mis.lean", "s": [["prehab-suitcase-deadlift-kb", "COMPENSATION"], ["onnit-suitcase-deadlift", "krok 3 (avoid twisting or bending)"]]}
    ]
  }
}
```

## 4. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `axle.setup` | Stopy na szerokość bioder; chwyć gruby gryf oburącz nachwytem. | Feet hip-width apart; grab the thick bar with both hands, overhand. | `dl.grip` mówi „na szerokość barków lub trochę szerzej” i „chwyt mieszany” — Fitness Volt odradza szerszy chwyt; część wspólna to tylko nachwyt. |
| `dl.mis.hipsFirst` | Biodra idą w górę szybciej niż barki. | Hips shooting up faster than the shoulders. | Brak zdania o tym błędzie; przyda się też innym wariantom martwego ciągu (po sprawdzeniu źródeł każdego). |
| `cabledl.setup` | Stań przodem do wyciągu z drążkiem na dolnym bloczku, stopy na szerokość bioder; chwyć drążek nachwytem, ręce proste. | Face the cable with a bar on the low pulley, feet hip-width apart; grab the bar overhand, arms straight. | Żadne zdanie nie opisuje ustawienia przy wyciągu do martwego ciągu. |
| `cabledl.close` | Prowadź drążek blisko ciała przez cały ruch. | Keep the bar close to your body the whole way. | `dl.close` mówi o sztandze i nogach; tu ciągnie linka. |
| `cdl.setup` | Ustaw się jak do zarzutu: chwyt jak do zarzutu, kolana wypchnięte na zewnątrz, aż dotkną rąk. | Set up like for a clean: clean grip, knees pushed out until they touch your arms. | Pozycja startowa inna niż w zwykłym martwym ciągu (kolana do rąk). |
| `cdl.move` | Odrywaj sztangę nogami, trzymając ten sam kąt pleców, aż minie kolana. | Drive the bar up with your legs, holding the same back angle until it passes your knees. | Sedno ćwiczenia według obu źródeł; `dl.lift` mówi o jednoczesnym prostowaniu bioder — tu biodra otwierają się dopiero nad kolanami. |
| `sdl.setup` | Postaw ciężar z boku jednej stopy; stopy na szerokość bioder do barków. | Set the weight beside one foot; feet hip- to shoulder-width apart. | Ustawienie z ciężarem z boku — brak zdania. |
| `sdl.move` | Cofnij biodra i ugnij kolana, chwyć ciężar jedną ręką; wypchnij stopy w podłogę i wstań prosto. | Push your hips back and bend your knees, grab the weight with one hand; drive through the floor and stand tall. | Ruch z ciężarem z boku, jedną ręką — brak zdania. |
| `sdl.mis.lean` | Przechylanie się w bok albo skręcanie tułowia przy podnoszeniu. | Leaning to the side or twisting as you lift. | `carry.noLean` dotyczy marszu („idź wyprostowany”). |

## 5. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `barbend-axle-deadlift` | https://barbend.com/axle-deadlift/ | BarBend (istniejąca) | 4 | Step 1–3 (autor CSCS) |
| `fitnessvolt-axle-vs-barbell` | https://fitnessvolt.com/axle-deadlift-vs-barbell-deadlift/ | Fitness Volt (NOWA, do akceptacji) | 4? | „The only real difference between axle and barbell deadlifts is the bar itself.” |
| `eleiko-6582f9bc` | https://eleiko.inspire360.com/resource/6582f9bcd6c0e9bcec04fe16 | Eleiko (istniejąca) | 4 | Setup; Movement; Cues |
| `bos-cable-deadlift` | https://bellsofsteel.us/blogs/content/how-to-do-the-cable-deadlift | Bells of Steel (NOWA, producent sprzętu) | 4 | kroki; Back; Movement (bez autora, 23.10.2023) |
| `boxlife-cable-deadlift` | https://boxlifemagazine.com/cable-deadlift/ | BoxLife Magazine (NOWA, do akceptacji) | 4? | plecy płaskie (autor bez kwalifikacji) |
| `catalyst-176` | https://www.catalystathletics.com/exercise/176/Clean-Deadlift/ | Catalyst Athletics (NOWA, serwis trenerski podnoszenia ciężarów) | 4 | opis ćwiczenia |
| `catalyst-187` | https://catalystathletics.com/exercise/187/Snatch-Deadlift/ | Catalyst Athletics | 4 | opis (tylko do „Otwarte”) |
| `barbend-vaughn-clean-deadlift` | https://barbend.com/news/chad-vaughn-clean-deadlift/ | BarBend (istniejąca) | 4 | „back is holding position as legs lift” |
| `prehab-suitcase-deadlift-kb` | https://theprehabguys.com/vimeo-video/suitcase-deadlift-kettlebell/ | The Prehab Guys (istniejąca) | 4 | HOW; COMPENSATION |
| `onnit-suitcase-deadlift` | https://www.onnit.com/academy/barbell-exercise-1-arm-suitcase-deadlift | Onnit (NOWA, producent sprzętu; autor CSCS) | 4 | adres przekierowuje do „The Best Kettlebell Deadlift Exercises”, sekcja Suitcase Deadlift |
| `bm-one-hand-deadlift` | https://breakingmuscle.com/?p=147467 | Breaking Muscle (istniejąca) | 4 | „How Much Can You Deadlift With One Hand?” (adres kanoniczny nieustalony) |
| `gymreapers-banded-deadlift` | https://gymreapers.com/blogs/news/banded-deadlifts | Gymreapers (NOWA, producent akcesoriów) | 4? | Step 1–6 (tylko do „Otwarte”) |
| `barbelllogic-bands` | https://barbell-logic.com/?p=5455 | Barbell Logic (NOWA, szkoła trenerów) | 4 | Bands for the Deadlift; Reverse Bands (tylko do „Otwarte”) |
| `rusin-reverse-band` | https://drjohnrusin.com/how-to-use-the-lightening-band-aka-reverse-band-method | Dr John Rusin (NOWA, fizjoterapeuta-trener) | 4 | The Reverse Band Trap Bar Deadlift (tylko do „Otwarte”) |
| `elitefts-wendler-chains` | https://elitefts.com/blogs/training/deadlifting-with-chains | elitefts (NOWA, producent gum i łańcuchów) | 4 | The Set Up; Important Points (tylko do „Otwarte”) |

```json
{
  "orgs": {
    "Fitness Volt": {"name": "Fitness Volt — poradniki ćwiczeń (fitnessvolt.com; autor PT, były instruktor) — DO AKCEPTACJI", "level": 4, "kind": "site"},
    "Bells of Steel": {"name": "Bells of Steel — blog producenta sprzętu siłowego (bellsofsteel.us)", "level": 4, "kind": "maker"},
    "BoxLife Magazine": {"name": "BoxLife Magazine — poradniki ćwiczeń (boxlifemagazine.com) — DO AKCEPTACJI", "level": 4, "kind": "site"},
    "Catalyst Athletics": {"name": "Catalyst Athletics — Exercise Library (catalystathletics.com; szkoła i klub podnoszenia ciężarów)", "level": 4, "kind": "site"},
    "Onnit": {"name": "Onnit Academy — poradniki producenta sprzętu (onnit.com; autor CSCS)", "level": 4, "kind": "maker"}
  },
  "sources": {
    "barbend-axle-deadlift": {"org": "BarBend", "title": "Axle Deadlift", "url": "https://barbend.com/axle-deadlift/", "level": 4},
    "fitnessvolt-axle-vs-barbell": {"org": "Fitness Volt", "title": "Axle Deadlift vs. Barbell Deadlift", "url": "https://fitnessvolt.com/axle-deadlift-vs-barbell-deadlift/", "level": 4},
    "eleiko-6582f9bc": {"org": "Eleiko", "title": "Deadlift – Dual Cable, Straight Bar", "url": "https://eleiko.inspire360.com/resource/6582f9bcd6c0e9bcec04fe16", "level": 4},
    "bos-cable-deadlift": {"org": "Bells of Steel", "title": "How to Do the Cable Deadlift", "url": "https://bellsofsteel.us/blogs/content/how-to-do-the-cable-deadlift", "level": 4},
    "boxlife-cable-deadlift": {"org": "BoxLife Magazine", "title": "Cable Deadlift Guide", "url": "https://boxlifemagazine.com/cable-deadlift/", "level": 4},
    "catalyst-176": {"org": "Catalyst Athletics", "title": "Clean Deadlift", "url": "https://www.catalystathletics.com/exercise/176/Clean-Deadlift/", "level": 4},
    "barbend-vaughn-clean-deadlift": {"org": "BarBend", "title": "Chad Vaughn — clean deadlift", "url": "https://barbend.com/news/chad-vaughn-clean-deadlift/", "level": 4},
    "prehab-suitcase-deadlift-kb": {"org": "The Prehab Guys", "title": "Suitcase Deadlift (Kettlebell)", "url": "https://theprehabguys.com/vimeo-video/suitcase-deadlift-kettlebell/", "level": 4},
    "onnit-suitcase-deadlift": {"org": "Onnit", "title": "The Best Kettlebell Deadlift Exercises — Suitcase Deadlift", "url": "https://www.onnit.com/academy/barbell-exercise-1-arm-suitcase-deadlift", "level": 4},
    "bm-one-hand-deadlift": {"org": "Breaking Muscle", "title": "How Much Can You Deadlift With One Hand?", "url": "https://breakingmuscle.com/?p=147467", "level": 4}
  }
}
```

(Źródła tylko do „Otwarte” — `catalyst-187`, `gymreapers-banded-deadlift`, `barbelllogic-bands`, `rusin-reverse-band`, `elitefts-wendler-chains` — nie wchodzą do `sources`, dopóki nie zasilą gotowego ćwiczenia.)

## 6. Otwarte

Informacja o zestawach ogólnych (`cue-sets.json`): dla żadnego z 14 wariantów przeczytane źródła nie potwierdziły w całości obecnego
zestawu (`dl.lift`, `hinge.back`, `dl.close`, `mis.roundBack`; Rickshaw: `tb.lift`; sumo: `sumo.kneesOut`). W szczególności
`mis.roundBack` nie ma 2 źródeł przy żadnym wariancie, a zestawy dla wersji z gumami/łańcuchami/sumo i Rickshaw nie mają źródła o tym wariancie.

- **Snatch Deadlift** — jedno źródło (Catalyst 187: pięty na szerokość bioder, palce na zewnątrz, kolana wypchnięte do rąk, chwyt rwania, barki nad sztangą, ten sam kąt pleców do minięcia kolan, sztanga blisko nóg). Rozstrzygnie: drugi opis „snatch deadlift” (nie „snatch-grip deadlift”) od innej organizacji, np. federacji podnoszenia ciężarów lub Eleiko.
- **Leverage Deadlift** — brak źródła szczebla 4 (ExRx 403; reszta to bazy innych aplikacji). Rozstrzygnie: instrukcja producenta maszyny albo ExRx w innej sesji.
- **Deadlift with Bands** — 2 źródła tylko dla ustawienia gum (Gymreapers Step 1: gumy na gryfie, zakotwione nisko, równo po obu stronach; Barbell Logic „Bands for the Deadlift”: kołki szeroko, gumy prostopadle do gryfu). Proponowane zdanie (nie do aplikacji): „Zaczep gumy o oba końce gryfu i zakotwicz je nisko, równo po obu stronach.” Ruch zawodnika (plecy proste, wypchnięcie bioder, sztanga blisko przy opuszczaniu) — tylko Gymreapers (autor bez kwalifikacji). Rozstrzygnie: drugi opis ruchu z gumami (np. strona powerliftingtechnique.com — 403 w tej sesji).
- **Reverse Band Deadlift** — 2 źródła dla ustawienia (Barbell Logic „Reverse Bands”; Rusin, wariant: trap bar — gumy zaczepione o górę stojaka, pomagają przy podłodze, na górze ciężar rośnie). Ruch („przyspieszaj z podłogi aż do wyprostu”) — tylko Rusin. Rozstrzygnie: drugi opis ruchu.
- **Deadlift with Chains** — tylko elitefts/Wendler (łańcuchy równo po obu stronach, za zawodnikiem, nie przed gryfem). Rozstrzygnie: drugie źródło (Barbell Logic odsyła do filmu innego serwisu — tekst bez kroków).
- **Rack Pull with Bands, Reverse Band Sumo Deadlift, Sumo Deadlift with Bands, Sumo Deadlift with Chains** — brak jakiegokolwiek przeczytanego źródła o tych wariantach. Bazowe `Sumo Deadlift` ma wskazówki, ale żadne źródło nie mówi, że wersja z dodatkiem ma ten sam ruch.
- **Rickshaw Deadlift** — brak opisu techniki (tylko wymiary sprzętu; elitefts exercise-index 404).
- **Axle Deadlift / Cable Deadlift** — warunkowe: zależą od akceptacji Fitness Volt i BoxLife jako szczebla 4. Bez nich: Axle → 1 źródło; Cable → `hinge.back` 1 źródło (tips+mistakes = 1).
- **`hinge.back` a „arch your lower back”** (Fitness Volt) — czy „plecy proste (neutralne)” zgadza się z „wygnij lędźwie” — do oceny audytora; tu pominięte.

## 7. Dostęp

- ExRx.net — 403; web.archive.org i archive.ph — zablokowane przez narzędzie (nie próbowano dalej, zgodnie z koordynatorem).
- powerliftingtechnique.com — 403 (banded deadlift; reverse band deadlift nieczytany).
- elitefts.com/education/… (deadlifting-with-chains, reverse band deadlift, rickshaw deadlift) — 404; wersja w `blogs/training` działała.
- barbend.com/clean-deadlift/ — 404; bodybuilding.com/exercises/deadlift-with-bands → 404 po przekierowaniu; garagegymreviews.com/suitcase-deadlift — 404.
- catalystathletics.com/exercise/120/ — strona ogólna biblioteki (zły numer); poprawne: 176 (clean), 187 (snatch).
