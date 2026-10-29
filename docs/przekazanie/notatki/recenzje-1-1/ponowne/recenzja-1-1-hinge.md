# Recenzja 1.1: rodzina hinge (32 ćwiczenia, rig), 29.10.2026, recenzent 1.1 hinge (niezależny)

Oceniam `integracja-1-1` @ 15e3ab45 (odłączony worktree, tylko odczyt). Rig: `lib/figures/v2/rigs/hinge.ts`, warianty w `variants.ts`. Skrót treści rodziny (`scripts/zrodla-runtime.mjs --skroty`, v2.hinge): **7c3e31ca00f5**. Opisów poprawek ani README podglądów nie czytałem. Jednolinijkowe tytuły commitów `git log` dla hinge.ts mignęły mi przy listowaniu plików.

## Metoda

- **Render własny: 2772 klatki.** 32 ćwiczenia × 2 widoki (bok, przód) × (poza poprawna i każdy rząd błędu: roundBack, barAway, kneesBent) × 21 klatek (u 0…1 co 0,05). Na każdą klatkę nałożony ślad `trailShapes`, ten sam, który rysuje aplikacja, oraz cienka linia kontrolna i bieżący punkt `info.load`. Linie odniesienia są z wskazówek ćwiczenia (`plumbMidfoot`, `backLine`).
- Do tego kadry powiększone 2,2× (bok, u 0/0,25/0,5/0,75/1), dodatkowe kadry 3–4× i rzędy błędów.
- Arkusze: `slad-1-1-hinge/<ćwiczenie>-slad.png` (wszystkie klatki, każdy widok, poza poprawna i błędy) oraz `<ćwiczenie>-slad-bok-zoom.png`.
- Liczby z `frameAt`: siatka 41 klatek, a dla odstępu od nóg siatka co 0,05.
  - położenie ciężaru względem środka stopy (x 6,5);
  - kąty kolan (R/L), biodra i tułowia (ze znakiem);
  - odstęp ciężaru od **powierzchni** nóg (`contactX`, promienie jak na rysunku);
  - miara toru jak w `tests/figures-v2-tor.test.ts`.
- Reguły sensu: `node scripts/figures/sens-gotowe.mjs --rodzina hinge`. Treść kart: `lib/cues/data.json` (own), `lib/figures/v2/cue-sets.json` (general, wszystkie 25 z recenzją treści), `lib/cues/text/pl.json`, `data/zrodla/cues.json`, mięśnie `muscles.generated.ts`, `scripts/claims.mjs`.

## Podsumowanie

| | liczba |
|---|---|
| OK | 4 |
| OK z uwagą | 10 |
| BŁĄD | 18 (B1: 11 × WYSOKIE; B1s: 4 × ŚREDNIE; B2: 3 × ŚREDNIE) |

**Tor gryfu po naprawie z main (PR #81): „S” usunięte.** Na boku martwe ciągi ze sztangą lub linką mają gładki łuk z jedną zmianą kierunku. Odchylenie od cięciwy wynosi 3,1 cm (Deadlift i 5 odmian o identycznym torze), 3,2 (Cable), 3,5 (Snatch) i 3,6 (Deficit). Start wypada 1,4–2,6 cm przed środkiem stopy, a gryf przez cały ruch mieści się w +5,9 cm od środka stopy. W widoku z przodu tor jest pionowy (0 cm). Rack Pull ma 0,6 cm, RDL / SLDL 0,2–0,4 cm. Smith SLDL: szyna stoi, gryf jest na szynie, ślad pionowy (0 cm).

**Nowy błąd, skutek naprawy (B1):** tor jest wyliczany jako górna obwiednia wypukła styków z nogami. Dzięki temu nie zawraca, ale **nad kolanem gryf odrywa się od ud o 7,5–9,9 cm** (u ≈ 0,55–0,9). Karta pokazuje obok wskazówkę „Prowadź sztangę blisko nóg przez cały ruch” (`dl.close`). Reguła sensu `ciezar_przy_nogach` łapie to poprawnie: 16,5–19,1 cm przy progu 15. W tych ćwiczeniach jest to **błąd rysunku, nie zła reguła**.

**Czy hinge może dostać wpis „wyswietlana”: tylko częściowo, i tylko jeśli właściciel się zgodzi.** 14 ćwiczeń (OK i OK z uwagą) jest gotowych. 11 ćwiczeń z B1 blokuje (WYSOKIE). 7 ćwiczeń z B1s i B2 to ŚREDNIE, więc według progu nie blokują. Mają jednak otwarte wyjątki sensu, które są prawdziwymi błędami rysunku. Opcje są na końcu.

### Stan wcześniejszych znalezisk

| Znalezisko | Teraz | Stan |
|---|---|---|
| hinge.md nr 1 / U1: „S” toru, gryf przed palcami | łuk 3,1–3,6 cm, 1 zmiana kierunku, gryf ≤ +5,9 cm od środka stopy | usunięte; nowy skutek uboczny: B1 |
| hinge.md nr 1b: barAway za mało odstaje | błąd: start +14,4 cm, czyli +12 od pozy poprawnej (2,4) | usunięte |
| nr 2: One-Arm Side, gryf w poprzek przez golenie | gryf wzdłuż x, z 26, nad środkiem stopy; z przodu talerze z profilu | usunięte |
| nr 3 / R1: gumy Reverse Band od podłogi | obie odmiany: gumy od górnej belki (y 150) do końców gryfu, w obu widokach | usunięte |
| nr 4: kolana 40–44° w RDL / GM | RDL 17,4°, RDL hantle 18,4°, Single Arm 25,2°, SLDL 25,7°, Smith SLDL 23,3°, GM 23,9°; kneesBent 53–59° (+35–42°) | usunięte |
| U2: Rack Pull „hak” | tor 0,6 cm | usunięte (zostaje B1: odstęp od ud 7,5 cm) |
| U6: Cable Pull Through półprzysiad | tułów 65° od pionu, kolano ≤ 21° | usunięte |
| U4: trap bar / leverage / rickshaw przeprost na górze | tułów −6,4°, biodro −11° w u = 1 | bez zmian (NISKIE) |
| U5: hantle z przodu, ślad w osi ciała | bez zmian | bez zmian (NISKIE) |
| A: brak stojaka / bolców (Rack Pull ×2, GM off Pins) | bez zmian | bez zmian (NISKIE) |

## Wynik na ćwiczenie

Tor podaję jako „odchylenie / zawrócenia” na boku (z przodu wszędzie 0 / 0). Odstęp liczę do powierzchni ud lub goleni.

| Ćwiczenie | Ruch | Ślad | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|---|
| Deadlift (sztanga) | start +2,4 cm, goleń 8°, tułów 64° → 4°, kolano 73° → 5°, barki 3 cm przed gryfem | 3,1 / 1 | own: dl.feet, dl.grip, dl.lift, dl.lower, hinge.back, dl.close, dl.hipsLow; błędy roundBack, barAway — widoczne, różnią się tylko błędem | **BŁĄD** | B1: odstęp od ud do 8,1 cm (u 0,7); reguła 16,9 cm |
| Deadlift (hantle) | hantle po bokach (z ±30), x stałe −1,8, tułów 58° → 0° | 1,75 / 1 | own: dbdl.setup, dl.lift, hinge.back, dbdl.hips | OK z uwagą | U5: z przodu ślad w osi ciała, hantle ok. 10 cm na zewnątrz ud, ręce lekko odwiedzione (NISKIE) |
| Sumo Deadlift | szeroko, palce na zewnątrz, kolano 100°, tor od −2,0 do +6,0 | 0,8 / 0 | own: sumo.*, hinge.back, dl.close | **BŁĄD** | B1s: odstęp od nóg 3,3 na starcie i do 7,2 cm w ruchu; reguła 16,3 cm |
| Trap Bar Deadlift | uchwyty −1,8, pionowo | 0 / 0 | own: tb.inside, tb.lift, hinge.back, dl.hipsLow | OK z uwagą | U4: na górze tułów −6,4°, biodro −11° (lekki przeprost) przy „aż staniesz prosto”; NISKIE |
| RDL (sztanga) | kolano ≤ 17,4°, tułów 10° → 60°, biodro 74°, gryf +3,4 do +7,3 | 0,4 / 0 | own: rdl.*, dl.close, hinge.back; kneesBent 59° vs 17° | OK | odstęp od ud ≤ 4,2 cm, reguła 14,3 (spełniona) |
| RDL (hantle/linki) | kolano ≤ 18,4°, tułów 60° | 4,25 / 1 („C”) | own: rdl.dbSetup, rdl.dbMove, rdl.depth, hinge.back, rdl.knees | OK z uwagą | tor „C” 4,25 cm (wyjątek w tor-wyjatki.json, 1.0.1); hantel cofa się przy udach i wraca w przód na dole; NISKIE |
| Good Morning | sztanga na plecach nad środkiem stopy; **start: tułów 21°, biodro 21°**; dół: tułów 42°, kolano 24° | 0 / 0 | own: gm.setup, gm.move, gm.depth, gm.light, hinge.back | **BŁĄD** | B2 |
| Rack Pull | start z y 45 (nad kolanem), tułów 53° → 4° | 0,6 / 1 | general hingeFloor (dl.lift, hinge.back, dl.close) | **BŁĄD** | B1: odstęp 7,5 cm (reguła 16,5); A: brak stojaka |
| Single Leg RDL (hantel) | noga podporowa: kolano ≤ 12°; noga wolna w tył, w linii tułowia na dole; tułów 61° | 4,35 / 1 | general rdl (hinge.back, rdl.depth) | OK z uwagą | „C” 4,35 cm (wyjątek, 1.0.1); na stojąco hantel 9 cm przed środkiem stopy; NISKIE |
| Single Leg RDL (linki) | jak wyżej, kolano podporowe ≤ 17° | 0,4 / 0 | general rdl | OK | bloczek pod dłonią przesuwa się z nią o ok. 4 cm (niewidoczne) |
| Cable Pull Through | linka z bloczka z tyłu (x −75) między nogami; tułów 65°, kolano ≤ 21° | 6,2 / 1 | general rdl | OK z uwagą | na dole dłonie 8 cm przed kolanami, nie między udami; powód w tor-wyjatki.json („uchwyt przechodzi między nogami”) nie zgadza się z rysunkiem; NISKIE, pewność 55% |
| Sumo Deadlift (kettlebell) | odważnik między stopami na podłodze, pionowo | 0,6 / 0 | general (sumo.kneesOut, hinge.back) | OK z uwagą | reguła 15,4 cm to **zła reguła**: odważnik jest między nogami, a nie przed nimi (styku z przodu nie ma). Wyjątek z powodem |
| Single Arm RDL (hantel/linka) | kolano ≤ 25°, wolna ręka na biodrze, tułów 59° | 2,2 / 0 | general (hinge.back, rdl.knees, rdl.depth) | OK | |
| Axle Deadlift | tor jak Deadlift (sztanga) | 3,1 / 1 | general hingeFloor (z dl.close) | **BŁĄD** | B1 (8,1 cm; reguła 16,9) |
| Deadlift with Bands | jak wyżej, dwie gumy przy końcach w dół | 3,1 / 1 | general | **BŁĄD** | B1 |
| Deadlift with Chains | jak wyżej, łańcuchy przy końcach | 3,1 / 1 | general | **BŁĄD** | B1 |
| Deficit Deadlift | podest 6 cm, stopy na podeście (pięta y 6) | 3,6 / 1 | general | **BŁĄD** | B1 (7,9 cm; reguła 16,9) |
| Rack Pull with Bands | jak Rack Pull | 0,6 / 1 | general | **BŁĄD** | B1 (7,5 cm); A |
| Reverse Band Deadlift | gumy z góry stojaka (R1 usunięte) | 3,1 / 1 | general | **BŁĄD** | B1 (8,1 cm) |
| Cable Deadlift | linka od podłogi do uchwytu | 3,2 / 1 | general (dl.lift, hinge.back; **bez** dl.close) | **BŁĄD** | B1: odstęp 8,0 cm, wyraźnie widoczny (dłoń przed udem w u 0,75); reguła 17,3 |
| Leverage Deadlift | jak trap bar | 0 / 0 | general | OK z uwagą | U4 |
| One-Arm Side Deadlift | gryf z boku wzdłuż x, z 26, x nad środkiem stopy | 0 / 0 | general | OK | |
| Rickshaw Deadlift | jak trap bar | 0 / 0 | general (tb.lift) | OK z uwagą | U4 |
| Band Good Morning | jak Good Morning, gumy przy końcach gryfu | 0 / 0 | general (gm.move, hinge.back) | **BŁĄD** | B2 |
| Clean Deadlift | jak Deadlift (sztanga) | 3,1 / 1 | general | **BŁĄD** | B1 |
| Good Morning off Pins | jak Good Morning, bez bolców | 0 / 0 | general | **BŁĄD** | B2; A |
| Reverse Band Sumo Deadlift | gumy z góry (R1 usunięte) | 0,8 / 0 | general (z dl.close) | **BŁĄD** | B1s (reguła 16,3) |
| Smith Machine Stiff-Legged Deadlift | szyna stała x 13,8, gryf na szynie, kolano ≤ 23°, tułów 65° | 0 / 0 | general (rdl.knees, hinge.back, rdl.depth) | OK z uwagą | reguła 16,1 cm to **zła reguła**: gryf na pionowej szynie nie może iść po udach (odstęp 6,8 cm wynika z maszyny). Wyjątek z powodem |
| Snatch Deadlift | szeroki chwyt, start +2,6 | 3,5 / 1 | general (z dl.close) | **BŁĄD** | B1: odstęp **9,9 cm**, największy w rodzinie; reguła 19,1 |
| Stiff-Legged Barbell Deadlift | kolano ≤ 25,7°, tułów 64° | 0,2 / 0 | general (rdl.knees, hinge.back, rdl.depth; bez dl.close) | OK z uwagą | odstęp od ud do 6,2 cm w połowie zejścia, reguła 15,6 (ledwo ponad próg) — błąd rysunku tej samej klasy co B1, słabszy; ŚREDNIE/NISKIE |
| Sumo Deadlift with Bands | jak Sumo | 0,8 / 0 | general (z dl.close) | **BŁĄD** | B1s |
| Sumo Deadlift with Chains | jak Sumo | 0,8 / 0 | general (z dl.close) | **BŁĄD** | B1s |

**Treść kart (wszystkie 32):**

- Wskazówki brzmią naturalnie, jak u trenera, i nie podają źródeł ani marek.
- Wszystkie 27 identyfikatorów wskazówek ma źródła w `data/zrodla/cues.json`.
- Teksty wskazówek nie zawierają liczb, twierdzeń zdrowotnych ani oznaczeń wagi, więc nie potrzebują wpisu w `rejestr-twierdzen.json`. `claims.mjs`: „rejestr zgodny”.
- Mięśnie są zgodne z ruchem, a pewność jest podana (Rack Pull „jedno źródło”, odmiany „analogia”, One-Arm Side / Rickshaw / Clean / Snatch „brak źródła — uproszczenie”).
- Wszystkie zestawy general mają recenzję treści (`lib/cues/data.json` → general).
- Jedyne sprzeczności tekst–rysunek to `dl.close` przy B1/B1s oraz `gm.move` / `gm.setup` przy B2 (start bez wyprostu, kolana proste 0° przy „kolana lekko ugięte”).

## BŁĘDY

| # | Ćwiczenia | Klatka / element | Co jest źle (liczby) | Jak powinno być | Waga | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|---|
| B1 | Deadlift (sztanga), Axle, with Bands, with Chains, Reverse Band, Clean, Deficit, Snatch, Cable Deadlift, Rack Pull, Rack Pull with Bands (11) | u 0,55–0,9, bok; gryf / uchwyt względem przodu ud | **Gryf odrywa się od ud o 7,5–9,9 cm.** Deadlift (sztanga): odstęp od powierzchni nóg 0,2–1,4 cm do u 0,5, potem 1,9 (u 0,55) → 4,9 → 7,0 → **8,1** (u 0,7) → 7,3 → 6,3 → 5,1 → 3,5 → 1,5 → 0,2 (u 1). Ręce pochylają się w przód (dłoń przed barkiem), gryf „wisi” przed udami. Snatch 9,9, Cable 8,0, Deficit 7,9, Rack Pull 7,5. Przyczyna w rigu: x gryfu = górna obwiednia wypukła styków (tor bez zawrócenia), a ciało (kolana prostują się monotonicznie, biodra z tyłu) nie podchodzi udami do gryfu. Kadr: `slad-1-1-hinge/Deadlift-sztanga-slad-bok-zoom.png` (u 0,75), `Cable-Deadlift-slad-bok-zoom.png` (u 0,75, najlepiej widać), `Snatch-Deadlift-slad-bok-zoom.png`. | Tor zostaje gładki i prawie pionowy (jak teraz), a uda dochodzą do gryfu: po przejściu kolan biodra idą w przód, a kolana lekko wchodzą pod gryf. Odstęp ≤ ok. 2 cm przez cały ruch, reguła ≤ 15 cm bez wyjątku. | WYSOKIE (rysunek przeczy wskazówce widocznej na tym samym ekranie; to ta sama nauka „blisko nóg”, którą właściciel zgłosił w 1032) | 80% | realny (ekran Technika każdego z 11 ćwiczeń) | **tak**: `ciezar_przy_nogach` (16,5–19,1 > 15), dziś wyłączona wyjątkiem `tests/sens-wyjatki-1-1.json`. Strażnik toru (`figures-v2-tor`) mierzy tylko kształt toru, a nie styk. Propozycja: dołożyć do `figures-v2-tor.test.ts` miarę „odstęp ciężaru od nóg ≤ 3 cm poniżej bioder” dla rigów hinge z ciężarem przed nogami |
| B1s | Sumo Deadlift, Reverse Band Sumo, Sumo with Bands, Sumo with Chains (4) | cały ruch, bok | Odstęp gryfu od nóg 3,3 cm na starcie, do 7,2 cm w ruchu; tor ukośny od −2,0 do +6,0 cm. W szerokim rozstawie jest mniej widoczny niż w klasycznym. | jak B1 | ŚREDNIE | 65% | realny | tak: `ciezar_przy_nogach` 16,3 (wyjątek) |
| B2 | Good Morning, Band Good Morning, Good Morning off Pins (3) | u 0 (start) i u 1 (dół), bok | **Start bez wyprostu:** tułów 21,2° od pionu, biodro 20,9°, kolano 0°. Widać to wyraźnie w `Good-Morning-slad-bok-zoom.png` u 0. **Dół płytki:** tułów najwyżej 42,3°. Cały ruch to więc ok. 21° pochylenia (21 → 42°). Rig dzień dobry dziedziczy po przysiadzie z wysokim gryfem (gryf nad środkiem stopy przy wyprostowanych kolanach wymusza zgięcie w biodrach na starcie). Do tego `gm.setup` „kolana lekko ugięte”, a na starcie kolana są proste (0°). | Start w pełnym wyproście (tułów i biodro ≤ 15°, w razie potrzeby lekkie pochylenie całego ciała w kostkach, a nie w biodrach). Dół 45–90° (część wspólna źródeł z reguły), kolana lekko ugięte od startu. | ŚREDNIE (cecha rozpoznawcza zachowana, tylko zakres za mały i start niepełny; zgodnie z progiem nie blokuje) | 80% | realny | **tak**: `wyprost_na_gorze` i `dzien_dobry_glebokosc` (42,3 < 45), dziś w wyjątku. **Reguły są dobre, błąd jest w rysunku** |

## Wyjątki sensu 1.1 (`tests/sens-wyjatki-1-1.json`): 24 pary w 21 ćwiczeniach hinge

| Ćwiczenia | Reguła | Rozstrzygnięcie |
|---|---|---|
| 11 z B1 | ciezar_przy_nogach | **błąd rysunku**: naprawić rig, potem zdjąć wyjątek |
| 4 sumo (B1s) | ciezar_przy_nogach | błąd rysunku (słabszy) |
| Stiff-Legged Barbell Deadlift | ciezar_przy_nogach (15,6) | błąd rysunku tej samej klasy (6,2 cm), na granicy; naprawi go ta sama poprawka rigu |
| Smith Machine Stiff-Legged Deadlift | ciezar_przy_nogach (16,1) | **zła reguła dla maszyny Smitha**: szyna pionowa. Wyjątek stały z powodem albo w regule `bez_szyny` |
| Sumo Deadlift (kettlebell) | ciezar_przy_nogach (15,4) | **zła reguła**: odważnik między nogami, a nie przed nimi. Wyjątek stały z powodem albo zakres reguły bez kettlebella między nogami |
| 3 × Good Morning (B2) | dzien_dobry_glebokosc, wyprost_na_gorze | **błąd rysunku**: reguły dobre |

## OK z uwagą (backlog, nie blokuje)

- U4: trap bar, leverage i rickshaw mają na górze tułów −6,4° (przeprost). NISKIE.
- U5: Deadlift (hantle) z przodu. Ślad biegnie w osi ciała, choć hantle są po bokach. Hantle są ok. 10 cm na zewnątrz ud, ręce odwiedzione („przy nogach” — raczej obok). NISKIE.
- A: Rack Pull ×2 i GM off Pins nie mają stojaka ani bolców. NISKIE.
- „C” w RDL (hantle) 4,25 i Single Leg RDL (hantel) 4,35 to wyjątki w tor-wyjatki.json (1.0.1). Ocena: kształt łagodny, zgodny z „blisko nóg”. Przy naprawie B1 sprawdzić, czy da się zejść poniżej 4 cm i usunąć wyjątki.
- Cable Pull Through ma na dole dłonie przed kolanami. Powód wyjątku toru opisuje inny ruch, niż rysunek pokazuje. NISKIE.
- Zaczepy gum Reverse Band i bloczek Cable Deadlift / SL RDL (linki) przesuwają się z gryfem o 3–4 cm. Klasa dawnej szyny Smitha, prawie niewidoczna. NISKIE.
- Martwe ciągi: łuk toru 3,1–3,6 cm w przód przy kolanach mieści się w progu 4 cm. Między ocenami właściciela (1,7 „dobrze”, 4,2 „źle”). Akceptuję.

## Do wpisu

- **„wyswietlana” (14):** Deadlift (hantle), Trap Bar Deadlift, RDL (sztanga), RDL (hantle/linki), Single Leg RDL (hantel), Single Leg RDL (linki), Cable Pull Through, Sumo Deadlift (kettlebell), Single Arm RDL (hantel/linka), Leverage Deadlift, One-Arm Side Deadlift, Rickshaw Deadlift, Smith Machine Stiff-Legged Deadlift, Stiff-Legged Barbell Deadlift.
- **„do poprawy” (18):**
  - B1 (blokuje): Deadlift (sztanga), Axle Deadlift, Deadlift with Bands, Deadlift with Chains, Deficit Deadlift, Rack Pull, Rack Pull with Bands, Reverse Band Deadlift, Cable Deadlift, Clean Deadlift, Snatch Deadlift;
  - B1s: Sumo Deadlift, Reverse Band Sumo Deadlift, Sumo Deadlift with Bands, Sumo Deadlift with Chains;
  - B2: Good Morning, Band Good Morning, Good Morning off Pins.

### Opcje dla właściciela (wpis jest na rodzinę; pojedyncze ćwiczenia wstrzymuje `V2_WSTRZYMANE` w `lib/figures/v2/figure.ts`)

1. **(rekomendacja) A: wpis „wyswietlana” dla hinge + 18 ćwiczeń w `V2_WSTRZYMANE`.**
   - Użytkownik od razu zobaczy 14 dobrych rysunków. Przy 18 ćwiczeniach karta zostanie bez rysunku, wskazówki zostają.
   - Poprawka rigu (B1 + B2) w osobnym zadaniu, potem recenzja tylko tych 18.
   - Kosztem jest brak rysunku przy flagowym Deadlift (sztanga) do czasu poprawki.
2. **B: najpierw poprawka rigu, potem jedna recenzja całej rodziny.** Rodzina jest ukryta dłużej (wszystkie 32), ale potrzebny jest jeden wpis i jedna recenzja.
3. **C: jak A, ale bez wstrzymywania B1s i B2 (ŚREDNIE, według progu nie blokują).** Wstrzymane tylko 11 ćwiczeń z B1. Wyjątki sensu B1s/B2 zostają w pliku jako znane błędy w backlogu. Szybciej, ale świadomie pokazujemy płytki dzień dobry z niepełnym startem.

### Proponowane pola wpisu v2 (opcja A)

```json
"hinge": {
  "werdykt": "wyswietlana",
  "data": "2026-10-29",
  "kto": "recenzja niezależna 1.1 ruchu, śladu toru i treści (agent recenzent 1.1 hinge, 29.10.2026)",
  "sha": "7c3e31ca00f5",
  "liczba": 32,
  "stan": "zrecenzowana niezależnie (bramka 4, L-047 A, L-050 krok 11) na integracja-1-1 @ 15e3ab45; 14 ćwiczeń OK, 18 do poprawy (V2_WSTRZYMANE)",
  "autor": "koordynator M2 (naprawa torów, PR #81) / scalenie main → integracja-1-1",
  "recenzent": "agent recenzent 1.1 hinge (sesja niezależna)",
  "slad": "docs/przekazanie/notatki/recenzje-1-1/ponowne/slad-1-1-hinge/ — 32 arkusze <ćwiczenie>-slad.png (u 0–1 co 0,05, bok i przód, poza poprawna i rzędy błędów, ślad toru nałożony na każdą klatkę) + kadry -bok-zoom.png; 2772 klatki",
  "uwagi": "B1 (11, WYSOKIE): gryf 7,5–9,9 cm od ud nad kolanem; B1s (4 sumo) i B2 (3 dzień dobry: start tułów 21°, dół 42°) ŚREDNIE — wstrzymane do poprawki rigu; recenzja: recenzje-1-1/ponowne/recenzja-1-1-hinge.md"
}
```

Uwaga dla koordynatora:

- `sha` zmieni się po poprawce rigu, więc wpis trzeba będzie odnowić przy recenzji 18 ćwiczeń.
- Wpis wymaga usunięcia `hinge` z `tests/recenzja-wyjatki-1-1.json` → `v2`.
- Strażnik `figury-recenzja.test.tsx` porównuje `liczba` z liczbą ćwiczeń rodziny: sprawdzić, czy liczy wstrzymane (dziś 32 z figurą).
