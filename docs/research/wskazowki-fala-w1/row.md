# Wskazówki techniki — rodzina `row` (fala W1, G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: ćwiczenia rodziny `row` bez własnych wskazówek — Meadows Row, Seal Row (sztanga), Reverse Grip Bent Over Row,
  Smith Machine Bent Over Row, Bent Over Row (linki), Lying T-Bar Row, Barbell Rear Delt Row.
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1
- **Przeliczenie koordynatora 02.11.2026 — nadrzędne; sekcja na końcu pliku (Lying T-Bar Row spada, Smith bez `row.hinge` i `mis.jerk`).**

## Korekta szczebli 02.11.2026

Szczeble organizacji przeliczone wg rozstrzygnięcia koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = naraz: (a) organizacja szkoląca
trenerów, serwis z redakcją i recenzją ekspercką albo producent własnego rodzaju sprzętu; (b) autor + data albo treść firmowana przez organizację;
(c) nie recenzja z afiliacją ani marketing). Kryteria (b) i (c) sprawdzone na już cytowanych stronach (WebFetch 02.11.2026). Zmiany:

- Ocena organizacji: Fitness Volt — 4 (tylko artykuły o technice); Generation Iron — 4 (tylko artykuły o technice); ATHLEAN-X — 5;
  Sole Fitness — 5 (nie producent tego rodzaju sprzętu); Bells of Steel — 4 dla własnego sprzętu (sztanga, ławka); Kensui — 5 dla Seal Row ze sztangą
  (nie ich rodzaj sprzętu); Major Fitness — 4 dla suwnicy Smitha; RitFit — 4 dla suwnicy Smitha; Dumbbells Direct — 5 (sprzedawca); Eisenhorn — bez zmiany
  wyniku (jedyne źródło ćwiczenia, które i tak jest otwarte). Breaking Muscle — 5 (rozstrzygnięcie). Uzasadnienia w sekcji 3.
- **Meadows Row**: gotowe → otwarte (wszystkie zdania mają ≤ 1 źródło szczebla 4 — zostaje tylko Generation Iron).
- **Reverse Grip Bent Over Row**: gotowe → otwarte (zostaje tylko Fitness Volt; Breaking Muscle = 5).
- **Barbell Rear Delt Row**: gotowe → otwarte (zostaje tylko Generation Iron; Dumbbells Direct = 5).
- **Seal Row (sztanga)**: zostaje gotowe (Fitness Volt + Bells of Steel); Kensui usunięte z `seal.setup`.
- **Smith Machine Bent Over Row**, **Lying T-Bar Row**: bez zmian — każde zdanie ma ≥ 2 źródła szczebla 4 z różnych organizacji.
- Nowe zdania `meadows.*`, `row.revGrip`, `rdrow.*` nie są używane w bloku JSON — przeniesione do „Otwarte” jako kandydaci.

Metoda: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) — zdanie wchodzi, gdy potwierdzają je ≥ 2 przeczytane (WebFetch, 02.11.2026)
źródła szczebla 4 z różnych organizacji, opisujące TO ćwiczenie (albo wprost jego wariant). Opis innego ćwiczenia (np. zwykłego wiosłowania
sztangą dla wersji na suwnicy Smitha) traktuję jako analogię i nie liczę go. Zdania zestawu ogólnego, których przeczytane źródła nie potwierdzają,
nie trafiają do karty (uzupełnienie briefu koordynatora, 02.11.2026). Liczb (kąty tułowia, tempo, serie) nie wprowadzam — źródła się w nich różnią.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Obecny tryb | Wynik | Uwagi |
|---|---|---|---|
| Meadows Row | general (rowBent) | otwarte | po korekcie szczebli tylko Generation Iron (4); Sole i ATHLEAN-X = 5 |
| Seal Row (sztanga) | general (row) | gotowe (krótka karta) | Fitness Volt + Bells of Steel; brak ≥ 2 źródeł na błędy |
| Reverse Grip Bent Over Row | general (rowBent) | otwarte | po korekcie szczebli tylko Fitness Volt (4); Breaking Muscle = 5 |
| Smith Machine Bent Over Row | general (rowBent) | gotowe | Major Fitness, RitFit (producenci suwnic) + Generation Iron; wysokość gryfu: część wspólna „na wysokości ud” |
| Bent Over Row (linki) | general (rowBent) | otwarte | tylko 1 przeczytane źródło (wariant naprzemienny jednorącz); reszta wyników to aplikacje |
| Lying T-Bar Row | general (row) | gotowe | Fitness Volt + Generation Iron, wersja z podparciem klatki na maszynie |
| Barbell Rear Delt Row | general (rowBent) | otwarte | po korekcie szczebli tylko Generation Iron (4); Dumbbells Direct = 5 |

## 2. Blok JSON do `exercises` w `data/zrodla/cues.json` — NIEAKTUALNY — patrz przeliczenie 02.11.2026

```json
{
  "Seal Row (sztanga)": {
    "setup": [
      {"c": "seal.setup", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (bench on boxes/plates, lie face down, overhand grip)"], ["bellsofsteel-seal-row", "wersja z ławką (bench on sturdy objects, lie under it, overhand grip)"]]}
    ],
    "move": [
      {"c": "seal.pull", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (pull toward lower ribs, bar touches the bench; lower slowly)"], ["bellsofsteel-seal-row", "wersja z ławką (pull toward your torso; lower in a controlled way)"]]}
    ],
    "tips": [
      {"c": "row.pauseTop", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (pause at the top)"], ["bellsofsteel-seal-row", "wersja z ławką (pause briefly at the top)"]]}
    ],
    "mistakes": []
  },
  "Smith Machine Bent Over Row": {
    "setup": [
      {"c": "smith.rowSetup", "s": [["majorfitness-smith-row", "How to 1–2 (bar around upper thigh; feet about shoulder-width)"], ["ritfit-smith-row", "How-to Steps 1–2 (bar about mid-thigh; feet hip to shoulder width)"], ["generationiron-smith-row", "Steps 1–2 (just below waist height; feet shoulder-width)"]]},
      {"c": "row.bbGrip", "s": [["majorfitness-smith-row", "How to 3 (overhand, shoulder-width or slightly wider)"], ["ritfit-smith-row", "How-to Steps 3 (pronated, a bit wider than shoulder width)"], ["generationiron-smith-row", "Steps 3 (slightly wider than shoulder width, overhand or underhand)"]]},
      {"c": "row.hinge", "s": [["ritfit-smith-row", "How-to Steps 5 (hips back, soft knee bend, no rounding)"], ["generationiron-smith-row", "Steps 4 (hinge at the hips, slight knee bend, spine neutral)"]]}
    ],
    "move": [
      {"c": "row.bbPullCtrl", "s": [["ritfit-smith-row", "How-to Steps 7–8 (lower ribs or upper waist; lower under control)"], ["generationiron-smith-row", "Steps 6–7 (toward your navel; return slowly with control)"], ["majorfitness-smith-row", "How to 5–6 (toward the torso; lower under control)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["majorfitness-smith-row", "How to 7 (same neutral spine every rep)"], ["ritfit-smith-row", "How-to Steps 5 (without rounding your back)"], ["generationiron-smith-row", "Steps 4 (spine neutral)"]]},
      {"c": "row.elbowsLead", "s": [["majorfitness-smith-row", "How to 5 (lead with your elbows, not your hands); Common Mistakes — Pulling with your arms"], ["ritfit-smith-row", "How-to Steps 7 (drive elbows back rather than curling with your hands)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["majorfitness-smith-row", "Common Mistakes — Rounded lower back"], ["ritfit-smith-row", "Common Mistakes 2 — Rounding the low back"], ["generationiron-smith-row", "form cautions (losing a neutral spine)"]]},
      {"c": "mis.jerk", "s": [["ritfit-smith-row", "Common Mistakes 6 — Using momentum"], ["generationiron-smith-row", "form cautions (jerking the bar, momentum)"]]}
    ]
  },
  "Lying T-Bar Row": {
    "setup": [
      {"c": "ltbar.setup", "s": [["fitnessvolt-cs-tbar-row", "1. Setup; 2. Grip (feet on the platform; overhand grip)"], ["generationiron-cs-tbar-row", "Setup 1; Grip 3 (feet on the platform; pronated grip)"]]},
      {"c": "csr.chest", "s": [["fitnessvolt-cs-tbar-row", "1. Setup (press your chest firmly against the pad)"], ["generationiron-cs-tbar-row", "Setup 2; Common Mistakes — Losing position (chest off the pad)"]]}
    ],
    "move": [
      {"c": "tbar.pull", "s": [["fitnessvolt-cs-tbar-row", "2.–4. (start with arms fully extended; elbows back past torso; lower slowly)"], ["generationiron-cs-tbar-row", "Pull 4; Return 6 (toward the chest; extend elbows to lower)"]]}
    ],
    "tips": [
      {"c": "row.pauseTop", "s": [["fitnessvolt-cs-tbar-row", "3. Pull (hold the top position)"], ["generationiron-cs-tbar-row", "Pull 5 (pause and squeeze)"]]},
      {"c": "row.slowDown", "s": [["fitnessvolt-cs-tbar-row", "4. Return (lower slowly and under control)"], ["generationiron-cs-tbar-row", "Return 6 (lower slowly, don't let it drop)"]]}
    ],
    "mistakes": []
  }
}
```

## 3. Nowe źródła (wszystkie przeczytane WebFetch 02.11.2026)

| id | org | tytuł | url | szczebel (po korekcie 02.11.2026) |
|---|---|---|---|---|
| sole-meadows-row | Sole Fitness | Meadows Row Workout: Ultimate Guide | https://www.soletreadmills.com/blogs/news/meadows-row-workout-ultimate-guide-with-benefits-proper-form-tips-muscles-worked | 5 — nie liczy się |
| athleanx-meadows-row | ATHLEAN-X | How to Do the Meadows Row | https://learn.athleanx.com/articles/back-for-men/how-to-do-the-meadows-row | 5 — nie liczy się |
| generationiron-meadows-row | Generation Iron | Meadows Row Exercise Guide | https://generationiron.com/meadows-row-exercise-guide/ | 4 (tylko w „Otwarte”) |
| fitnessvolt-seal-row | Fitness Volt | Seal Row | https://fitnessvolt.com/seal-row/ | 4 |
| bellsofsteel-seal-row | Bells of Steel | How To Do Seal Rows at Home | https://bellsofsteel.us/blogs/content/how-to-do-seal-rows-at-home | 4 (własny sprzęt: sztanga, ławka) |
| kensui-seal-rows | Kensui Fitness | Seal Rows | https://kensui.com/blogs/news/seal-rows | 5 dla sztangi — nie liczy się |
| breakingmuscle-reverse-grip-row | Breaking Muscle (istnieje) | Reverse-Grip Bent-Over Row | https://breakingmuscle.com/reverse-grip-bent-over-row/ | 5 (rozstrzygnięcie) — nie liczy się |
| fitnessvolt-reverse-grip-row | Fitness Volt | Barbell Reverse-Grip Bent-Over Row | https://fitnessvolt.com/barbell-reverse-grip-bent-over-row-guide/ | 4 (tylko w „Otwarte”) |
| majorfitness-smith-row | Major Fitness | How to Do Bent Over Rows on Smith Machine | https://www.majorfitness.com/blogs/wiki/how-to-do-bent-over-rows-on-smith-machine-a-step-by-step-guide | 4 (własny sprzęt: suwnica Smitha) |
| ritfit-smith-row | RitFit | How to Do the Smith Machine Bent Over Row | https://www.ritfitsports.com/blogs/article/how-to-do-the-smith-machine-bent-over-row | 4 (własny sprzęt: suwnica Smitha) |
| generationiron-smith-row | Generation Iron | Smith Machine Row Exercise Guide | https://generationiron.com/smith-machine-row-exercise-guide/ | 4 |
| fitnessvolt-cs-tbar-row | Fitness Volt | Chest-Supported T-Bar Row | https://fitnessvolt.com/chest-supported-t-bar-row-guide/ | 4 |
| generationiron-cs-tbar-row | Generation Iron | Chest Supported T-Bar Row | https://generationiron.com/chest-supported-t-bar-row/ | 4 |
| dumbbellsdirect-rear-delt-row | Dumbbells Direct | Barbell Rear Delt Row | https://dumbbellsdirect.com/blogs/barbell-exercisesspecific-movements/barbell-rear-delt-row | 5 (sprzedawca) — nie liczy się |
| generationiron-rear-delt-row | Generation Iron | Barbell Rear Delt Row Exercise Guide | https://generationiron.com/barbell-rear-delt-row-exercise-guide/ | 4 (tylko w „Otwarte”) |
| eisenhorn-alt-cable-bent-row | Eisenhorn | 225 Alternating bent-over rowing with cable pull | https://eisenhorn.com/en/eisenhorn-exercises/225-alternating-bent-over-rowing-with-cable-pull | nieoceniane szczegółowo (tylko w „Otwarte”, nie zmienia wyniku) |

### Ocena nowych organizacji wg kryteriów (a)–(c) (02.11.2026)

| org | kind | szczebel | uzasadnienie (a) / (b) / (c) |
|---|---|---|---|
| Fitness Volt | site | 4 — tylko artykuły o technice | (a) serwis z opisanym procesem redakcji: strona „editorial-process” deklaruje sprawdzanie treści treningowych przez certyfikowanego trenera i fakt-checking każdego artykułu; (b) autor i data na stronach (np. seal-row: autor z certyfikatem trenera, publikacja 2022, aktualizacja 2024); (c) cytowane strony to przewodniki techniki, nie recenzje produktów (zestawienia produktów w pasku bocznym — nie liczymy takich stron, analogicznie do BarBend) |
| Generation Iron | site | 4 — tylko artykuły o technice | (a) sieć medialna z zespołem ekspertów; strona Meadows Row ma wiersz „Fact checked by” z ekspertem, strona T-Bar — autor z biogramem i kwalifikacjami; (b) autor i data (sprawdzone na 2 stronach); (c) przewodniki techniki; serwis ma afiliację w recenzjach produktów — tych nie liczymy (jak BarBend) |
| ATHLEAN-X | site | 5 | (b) autor z kwalifikacjami i data są, ale (c) strona sprzedaje — wezwania do zakupu suplementów i programów treningowych w treści; (a) nie organizacja szkoląca trenerów ani redakcja z recenzją |
| Sole Fitness | maker | 5 dla Meadows Row | producent bieżni i sprzętu kardio; wiosłowanie sztangą w uchwycie nie jest jego rodzajem sprzętu (rozstrzygnięcie: producent tylko dla własnego sprzętu) |
| Bells of Steel | maker | 4 dla sztang, ławek, akcesoriów do stojaków | (a) producent sprzętu siłowego (ławki, sztangi, nakładka do seal row); (b) brak autora, data 05.06.2023, treść firmowana przez firmę; (c) linki do własnych produktów, ale strona jest instrukcją ćwiczenia — przyjęte jak u innych producentów z rozstrzygnięcia |
| Kensui Fitness | maker | 5 dla Seal Row ze sztangą | (b) autor i data są; (c)/(a) strona promuje uchwyty firmy (Swissies, SWVL), a cytowana wersja używa sztangi i ławki — nie jej rodzaj sprzętu |
| Major Fitness | maker | 4 dla suwnicy Smitha | (a) producent suwnic Smitha; (b) autor (certyfikowany trener w zespole firmy) i data 10.09.2026; (c) linki do produktów, ale główna treść to przewodnik ćwiczenia |
| RitFit | maker | 4 dla suwnicy Smitha | wymieniony w rozstrzygnięciu jako producent; (b) „RitFit Editorial Team”, aktualizacja 29.10.2026 — treść firmowana; (c) jak wyżej |
| Dumbbells Direct | shop | 5 | sprzedawca, nie producent (rozstrzygnięcie: sprzedawcy — 5) |
| Eisenhorn | maker | nieoceniane | jedyne źródło dla Bent Over Row (linki), które pozostaje otwarte niezależnie od szczebla |

Przeczytane, NIE liczone (bez zmian):
- Set For Set „Meadows Rows” (setforset.com) — marka odzieżowa; tekst kroków niemal identyczny z Generation Iron (brak niezależności).
- REP Fitness „How to do a Landmine Row” — o Meadows Row tylko jedno zdanie w „Landmine Row Variations” (wiosłowanie jednorącz, ciało pod kątem do gryfu); za mało na zdanie.

Niedostępne 02.11.2026 (nie są źródłami): exrx.net (403, także `WeightExercises/BackGeneral/SMBentOverRow`), muscleandstrength.com (403),
powerliftingtechnique.com (403), library.theprehabguys.com (przekierowanie do logowania), t3.com (treść artykułu nie wczytana),
bodybuilding.com/exercises (przekierowanie do sklepu, 404), barbend.com/meadows-row (404), bodysolid.com Exercises/Article/25 (strona o konserwacji, nie ćwiczenie).
Strony innych aplikacji treningowych z wyników wyszukiwania pominięte (uzupełnienie briefu, 02.11.2026).

## 4. Nowe zdania (używane w bloku JSON)

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| seal.setup | Ustaw ławkę wyżej na stabilnych podporach, połóż się na niej przodem i chwyć sztangę pod ławką nachwytem. | Raise the bench on stable supports, lie face down on it and grab the bar below with an overhand grip. | Fitness Volt, Bells of Steel |
| seal.pull | Przyciągnij sztangę w stronę ławki, potem opuść ją powoli. | Pull the bar up toward the bench, then lower it slowly. | Fitness Volt, Bells of Steel |
| row.pauseTop | Na górze zatrzymaj się na chwilę. | Pause briefly at the top. | Seal: FV, BoS; Lying T-Bar: FV, GI |
| row.bbPullCtrl | Przyciągnij sztangę do brzucha, potem opuść ją pod kontrolą. | Pull the bar to your stomach, then lower it under control. | Smith: RitFit, GI, Major |
| smith.rowSetup | Ustaw gryf na wysokości ud i stań przed nim, stopy mniej więcej na szerokość barków. | Set the bar at thigh height and stand in front of it, feet about shoulder-width apart. | Major Fitness, RitFit, Generation Iron (część wspólna wysokości: od połowy uda do tuż pod pasem) |
| row.elbowsLead | Ciągnij łokciami, nie dłońmi. | Lead with your elbows, not your hands. | Major Fitness, RitFit |
| ltbar.setup | Stopy na podeście, chwyć uchwyty nachwytem. | Feet on the platform, grab the handles with an overhand grip. | Fitness Volt, Generation Iron |
| row.slowDown | Opuszczaj ciężar powoli, nie pozwól mu opaść. | Lower the weight slowly — don't let it drop. | Fitness Volt, Generation Iron |

Istniejące zdania użyte: `row.hinge`, `row.bbGrip`, `hinge.back`, `csr.chest`, `tbar.pull`, `mis.roundBack`, `mis.jerk`.
Każde nowe zdanie trzeba dodać do `lib/cues/text/pl.json` i `en.json` oraz do rejestru twierdzeń (`node scripts/claims.mjs --stub`), jeśli `check:claims` je rozpozna.

## 5. Otwarte

- **Meadows Row** — [OTWARTE] szczebel źródła wg rozstrzygnięcia 02.11.2026: Sole (5) i ATHLEAN-X (5) nie liczą się; każde zdanie ma najwyżej 1 źródło
  szczebla 4 (Generation Iron). Kandydaci zdań (gdy znajdzie się drugie źródło szczebla 4):
  `meadows.setup` „Jeden koniec gryfu w uchwycie do wiosłowania albo w rogu. Stań bokiem do gryfu w wykroku, noga bliżej gryfu z przodu.” (GI nie potwierdza nogi z przodu — dziś 0 źródeł szczebla 4);
  `meadows.grip` „Pochyl tułów w biodrach, chwyć gryf za końcówkę przy talerzach, wolną rękę oprzyj o udo z przodu.” (GI);
  `meadows.pull` „Ciągnij łokieć w tył, prowadząc gryf w stronę biodra; opuść powoli do wyprostu ręki.” (GI);
  `meadows.noTwist` „Tułów nieruchomo — nie skręcaj go, żeby pomóc sobie rozpędem.” (0 źródeł szczebla 4); `row.fullStretch`, `mis.jerk` (GI).
  EN propozycje jak w poprzedniej wersji pliku (historia gałęzi). Nazwa „landmine” — do sprawdzenia przez tłumacza.
- **Reverse Grip Bent Over Row** — [OTWARTE] szczebel źródła wg rozstrzygnięcia 02.11.2026: Breaking Muscle = 5; zostaje tylko Fitness Volt
  (`row.hinge`, `row.revGrip` „Chwyć sztangę podchwytem, mniej więcej na szerokość barków.”, `row.bbPullCtrl`, `hinge.back`, `row.pauseTop`, `mis.roundBack`, `mis.jerk`).
- **Barbell Rear Delt Row** — [OTWARTE] szczebel źródła wg rozstrzygnięcia 02.11.2026: Dumbbells Direct = 5 (sprzedawca); zostaje tylko Generation Iron
  (`rdrow.setup` „Chwyć sztangę nachwytem, wyraźnie szerzej niż barki, i pochyl tułów w biodrach.”, `rdrow.pull` „Łokcie szeroko na boki; przyciągnij sztangę do górnej części klatki, potem opuść ją powoli.”).
- **Seal Row — Kensui** usunięte z `seal.setup` (szczebel 5 dla wersji ze sztangą); zdanie ma nadal 2 źródła (FV, BoS).
- **Bent Over Row (linki)** — [OTWARTE]: przeczytane tylko 1 źródło spoza aplikacji (Eisenhorn, wariant naprzemienny jednorącz z linkami:
  pochylenie w biodrach, ciągnięcie w stronę biodra, kontrola bez rozpędu). Drugie wyszukiwanie dało wyłącznie strony aplikacji (wykluczone)
  oraz Body-Solid (strona o konserwacji). Do czasu drugiego źródła zostaje zestaw ogólny albo tryb „open”.
- **Zestaw ogólny `rowBent` / `row` a przeczytane źródła** (informacja o zestawach): zdanie `row.fullStretch` („ręce do końca, barki w dół”)
  nie ma potwierdzenia dla Smitha, Seal Row ani Rear Delt Row (źródła mówią tylko „opuść pod kontrolą/powoli”); `row.bbGrip` („na szerokość barków lub
  szerzej”) nie pasuje do Reverse Grip (podchwyt) ani do Rear Delt Row (wyraźnie szerzej).
- **Kąt pochylenia tułowia** — źródła się różnią (Meadows, Reverse Grip, Rear Delt). Nie wprowadzam liczby; reguła „przedziały kątów: 2 zgodne źródła
  i żadne nie przeczy” nie jest spełniona.
- **Błędy dla Seal Row, Lying T-Bar Row** — przeczytane źródła wymieniają różne błędy; żaden nie ma 2 zgodnych źródeł.
- **Smith — odblokowanie gryfu obrotem nadgarstków** (Major Fitness „twist”, Generation Iron „unlatch”) — zgodne, ale pominięte dla zwięzłości karty; można dodać zdanie `smith.unrack`.
- **Ocena Fitness Volt i Generation Iron** — przyjęte jako 4 wg kryteriów (a)–(c) z zastrzeżeniem „tylko artykuły o technice” (jak BarBend).
  Gdyby koordynator uznał którąś za 5: bez FV odpada Seal Row i Lying T-Bar Row; bez GI odpada Lying T-Bar Row, a w Smith Row zdania `row.hinge` i `mis.jerk`.

## 6. Stan

Rodzina `row` po korekcie szczebli 02.11.2026: 3 gotowe (Seal Row, Smith Machine Bent Over Row, Lying T-Bar Row), 4 otwarte
(Meadows Row, Reverse Grip Bent Over Row, Barbell Rear Delt Row, Bent Over Row (linki)). Następny krok dla otwartych: szukać drugiego źródła
szczebla 4 (organizacje szkolące trenerów, producenci sztang i uchwytów do wiosłowania). Pułapki: ExRx 403, muscleandstrength 403, wiele trafień to aplikacje lub sklepy.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie + uzupełnienia 1–3, zwłaszcza uzup. 3: Fitness Volt i Generation Iron — szczebel daje konkretna strona); kryterium karty z decyzji 02.11.2026. Strony warunkowe sprawdzone WebFetch 02.11.2026.

### Źródła → szczebel

| Źródło | Szczebel | Dowód (strona, autor/data albo powód) |
|---|---|---|
| `fitnessvolt-seal-row` (Fitness Volt) | **4** | podpis „By Vidur Saini”, biogram: „ACE-certified personal trainer, writer, and editor”; daty w metadanych strony: publikacja 08.02.2022, zmiana 11.08.2024; bez nazwanego recenzenta i bez deklaracji afiliacji na stronie (wątpliwość — STAN, decyzja 8) |
| `fitnessvolt-cs-tbar-row` (Fitness Volt) | **5** | podpis „By Vanja Vukas”, biogram: student wydziału sportu i założyciel bloga — brak kwalifikacji trenerskich (uzup. 3: wymagany autor z kwalifikacjami); daty w metadanych 19.04.2024 / 11.08.2024 |
| `generationiron-cs-tbar-row` (Generation Iron) | **5** | „by Terry Ramos”, 13.03.2024; biogram: B.S. Kinesiology, ACSM CPT, ISSA CSCS; „This post may contain affiliate links”. Uzup. 3: GI warunkowo 4 „tylko artykuł podpisany przez osobę z listy ekspertów” — generationiron.com/about/ (02.11.2026): T. Ramos jest w „Our Team” jako Staff Writer, nie w „Our Experts” |
| `generationiron-smith-row` (Generation Iron) | **5** | „by Terry Ramos”, „Published on Aug 1, 2025”; ten sam autor spoza listy ekspertów; deklaracja afiliacji u góry strony |
| `generationiron-meadows-row`, `generationiron-rear-delt-row` | nie sprawdzane per strona | bez wpływu (ćwiczenia otwarte przy każdym szczeblu) |
| `fitnessvolt-reverse-grip-row` | nie sprawdzane per strona | bez wpływu (jedno źródło) |
| `bellsofsteel-seal-row` (Bells of Steel) | 4 | producent — własny sprzęt (sztanga, ławka); treść firmowana, data 05.06.2023 |
| `majorfitness-smith-row` (Major Fitness) | 4 | producent suwnic Smitha; autor (certyfikowany trener w zespole firmy), data 10.09.2026 |
| `ritfit-smith-row` (RitFit) | 4 | producent suwnic Smitha (rozstrzygnięcie); „RitFit Editorial Team”, 29.10.2026 |
| Sole, ATHLEAN-X, Kensui (sztanga), Breaking Muscle, Dumbbells Direct | 5 | bez zmian |

### Zdania → stan

| Zdanie | Ćwiczenie | Źródła po przeliczeniu | Stan |
|---|---|---|---|
| `seal.setup`, `seal.pull`, `row.pauseTop` | Seal Row | Fitness Volt + Bells of Steel | zostają |
| `smith.rowSetup`, `row.bbGrip`, `row.bbPullCtrl`, `hinge.back` | Smith | Major Fitness + RitFit | zostają (GI usunięte z cytowań) |
| `row.elbowsLead` | Smith | Major Fitness + RitFit | zostaje |
| `mis.roundBack` | Smith | Major Fitness + RitFit (błąd wprost w obu) | zostaje |
| `row.hinge` | Smith | tylko RitFit | **spada** |
| `mis.jerk` | Smith | tylko RitFit | **spada** |
| `ltbar.setup`, `csr.chest`, `tbar.pull`, `row.pauseTop`, `row.slowDown` | Lying T-Bar Row | żadne źródło szczebla 4 | **spadają** |

### Karty → stan

| Ćwiczenie | Stan | Powód |
|---|---|---|
| Smith Machine Bent Over Row | **własna z błędami** | ustawienie (`smith.rowSetup`, `row.bbGrip`) + ruch (`row.bbPullCtrl`) + błąd `mis.roundBack` |
| Seal Row (sztanga) | własna bez błędów | ustawienie + ruch (Fitness Volt + Bells of Steel) |
| Lying T-Bar Row | **otwarta** (było: gotowe) | oba źródła = 5 na tych stronach |
| Meadows Row, Reverse Grip Bent Over Row, Barbell Rear Delt Row, Bent Over Row (linki) | otwarte | bez zmian |

Liczby: przed — gotowe 3, otwarte 4; po — własne z błędami 1, własne bez błędów 1, otwarte 5.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

```json
{
  "Seal Row (sztanga)": {
    "setup": [
      {"c": "seal.setup", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (bench on boxes/plates, lie face down, overhand grip)"], ["bellsofsteel-seal-row", "wersja z ławką (bench on sturdy objects, lie under it, overhand grip)"]]}
    ],
    "move": [
      {"c": "seal.pull", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (pull toward lower ribs, bar touches the bench; lower slowly)"], ["bellsofsteel-seal-row", "wersja z ławką (pull toward your torso; lower in a controlled way)"]]}
    ],
    "tips": [
      {"c": "row.pauseTop", "s": [["fitnessvolt-seal-row", "How To Perform Seal Row (pause at the top)"], ["bellsofsteel-seal-row", "wersja z ławką (pause briefly at the top)"]]}
    ],
    "mistakes": []
  },
  "Smith Machine Bent Over Row": {
    "setup": [
      {"c": "smith.rowSetup", "s": [["majorfitness-smith-row", "How to 1–2 (bar around upper thigh; feet about shoulder-width)"], ["ritfit-smith-row", "How-to Steps 1–2 (bar about mid-thigh; feet hip to shoulder width)"]]},
      {"c": "row.bbGrip", "s": [["majorfitness-smith-row", "How to 3 (overhand, shoulder-width or slightly wider)"], ["ritfit-smith-row", "How-to Steps 3 (pronated, a bit wider than shoulder width)"]]}
    ],
    "move": [
      {"c": "row.bbPullCtrl", "s": [["ritfit-smith-row", "How-to Steps 7–8 (lower ribs or upper waist; lower under control)"], ["majorfitness-smith-row", "How to 5–6 (toward the torso; lower under control)"]]}
    ],
    "tips": [
      {"c": "hinge.back", "s": [["majorfitness-smith-row", "How to 7 (same neutral spine every rep)"], ["ritfit-smith-row", "How-to Steps 5 (without rounding your back)"]]},
      {"c": "row.elbowsLead", "s": [["majorfitness-smith-row", "How to 5 (lead with your elbows, not your hands); Common Mistakes — Pulling with your arms"], ["ritfit-smith-row", "How-to Steps 7 (drive elbows back rather than curling with your hands)"]]}
    ],
    "mistakes": [
      {"c": "mis.roundBack", "s": [["majorfitness-smith-row", "Common Mistakes — Rounded lower back"], ["ritfit-smith-row", "Common Mistakes 2 — Rounding the low back"]]}
    ]
  }
}
```

Nowe zdania w bloku: `seal.setup`, `seal.pull`, `row.pauseTop`, `row.bbPullCtrl`, `smith.rowSetup`, `row.elbowsLead` (6). `smith.rowSetup` — część wspólna wysokości gryfu teraz z dwóch producentów: „górna część uda” (Major) i „połowa uda” (RitFit) — brzmienie „na wysokości ud” pozostaje w części wspólnej.
