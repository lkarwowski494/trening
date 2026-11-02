# Wskazówki techniki — rodzina sled_throw, część „sanki i pełzanie” (fala W2, G3)

Data: 02.11.2026 · Autor: badacz-merytoryczny (fala W2, G3) · Tylko zbieranie danych — kod, `data/zrodla/*.json`, `lib/**` i testy bez zmian.
Punkt wyjścia: plik W1 tej rodziny (sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026” i blok po przeliczeniu).
Turkish Get Up pominięty (po W1 karta z błędami).

Definicje ruchu sprawdzone w `lib/catalog.generated.ts` (wymagany sprzęt: l. 271, 298, 402, 533, 534, 635, 638) i w opisach zbioru
free-exercise-db (pole `fedb` w `docs/research/equipment/catalog.json`; zbiór = szczebel 5, użyty tylko do identyfikacji ruchu):
- Backward Drag — lina lub pasy w rękach, ruch tyłem, „Leaning back, extend through the legs for short steps”.
- Sled Drag (Harness) — uchwyty, uprząż albo pas; przód lub tył; „lean in the direction of travel”.
- Bear Crawl Sled Drag — uprząż albo pas, łańcuch z tyłu, „facing away from the sled”; nogi napędzają, ręce pomagają.
- Sled Overhead Backward Walk — przodem do sanek, ręce prosto nad głową, chód tyłem.
- Sledgehammer Swings — opona, młot, ustawienie wykroczne, górna ręka zsuwa się po trzonku.
- Spider Crawl — podpór na dłoniach i palcach stóp, ręce ugięte do 90°, kolano do łokcia naprzemiennie (miara: powtórzenia).
- Sled Forward Drag with Press — opis w zbiorze niedostępny (plik `Sled_Forward_Drag_with_Press.json` — 404); w `docs/research/25-biblioteka/L6-zrodla.md` l. 247 tylko odwołanie do L6-S17.

## 1. Ćwiczenia — stan po W2

| Klucz | Stan po W1 (przeliczenie) | Stan po W2 | Co dodano |
|---|---|---|---|
| Sled Push | własna bez błędów | **własna z błędami** | 2 błędy wnioskowane (z `sled.lean`, `hinge.back`), oba potwierdzone też wprost przez producenta sanek |
| Backward Drag | otwarta (tylko ustawienie) | **własna z błędami** (z uproszczeniem — do oceny recenzenta) | ruch `sled.backPedal` (EliteFTS + Torque, uproszczenie: pas zamiast liny), błąd wnioskowany `sled.mis.row` |
| Bear Crawl Sled Drag | otwarta | **własna z błędami** (z uproszczeniem — do oceny recenzenta) | ustawienie `bcsd.setup`, ruch `bcsd.move` (EliteFTS + ACE bear crawl, uproszczenie: ten sam chód na czworakach bez sanek), 2 błędy wnioskowane |
| Sled Drag (Harness) | otwarta | otwarta | bez drugiego źródła (O4) |
| Sledgehammer Swings | otwarta | otwarta | O5 |
| Sled Forward Drag with Press | otwarta | otwarta | O7 |
| Sled Overhead Backward Walk | otwarta | otwarta | O8 |
| Spider Crawl | otwarta | otwarta | jedno źródło szczebla 4 i rozjazd definicji (O9) |

Razem (8 ćwiczeń tej części): przed — własne bez błędów 1, otwarte 7; po — własne z błędami 3 (dwie z oznaczonym uproszczeniem), otwarte 5.

### Uzasadnienia

**Sled Push — błędy.** Karta po W1 ma `sled.lean` (Pochyl się w przód) i `hinge.back` (proste plecy) potwierdzone przez Rep Fitness + BarBend
(+ EliteFTS). Zaprzeczenia tych zdań to dokładnie dwa błędy z sekcji „Avoid These Common Mistakes” producenta sanek Rep Fitness:
„Avoid rounding your lower back or standing too tall to avoid a sore back the next day.” (repfitness.com/blogs/training/sled-push-technique,
sekcja Avoid These Common Mistakes, punkt 2; autorka Rachel MacPherson, recenzja Rosie Borchert NASM-CPT, akt. 23.10.2026).
Oba widać na rysunku (tułów pionowo za sankami; zaokrąglony odcinek lędźwiowy). „Zginanie łokci” — pominięte zgodnie z poleceniem
(sprzeczność na szczeblu 4). „Pchanie rękami”, „za długie kroki” — tylko Rep Fitness wprost i nie wynikają logicznie ze zdań karty
(`sled.legs` mówi o pracy nóg, ale „pchasz rękami” nie da się jednoznacznie narysować bez wejścia w spór o ugięte łokcie) — poza danymi.

**Backward Drag — ruch.** Zdanie `sled.backPedal`: „Stań przodem do sanek i idź tyłem, odpychając się nogami.”
- EliteFTS, Josh Bryant, 13.06.2016 (elitefts.com/blogs/training/backwards-sled-pulls-for-quad-size-and-strength), sekcja techniki:
  „Lean back, away from the sled, the entire movement.” oraz „Use your legs.” — wersja z liną w rękach (ręce jak haki).
- Torque Fitness, Ultimate TANK Training Guide 2024, s. 62 „Harness Backpedal”, Instructions 1–2: „…stand facing TANK.”,
  „Squat low and backpedal legs pulling TANK down runway.” — wersja z pasem na biodrach.
- Uproszczenie: wariant zaczepienia (pas na biodrach zamiast liny w rękach). Ruch nóg i kierunek są te same; producent sanek Rep Fitness
  opisuje „Backwards Walk” jako jedno ćwiczenie z dwiema możliwościami: „You can hold the rope in your hands or, if you have a sling
  available, wrap it around your waist and pull hands-free.” (repfitness.com/blogs/training/sled-pull-workout, sekcja Backwards Walk;
  J. Dickson, 23.01.2026, akt. 03.08.2026, recenzja NASM-CPT). Zdanie celowo pomija ustawienie tułowia: EliteFTS „lean back”,
  Torque „squat low” — różnica, część wspólna = przodem do sanek, chód tyłem, praca nóg.
- Błąd `sled.mis.row` — zaprzeczenie „odpychając się nogami”, a EliteFTS wprost: „Never row the weight; pull it with your body.”
  Na rysunku: łokcie zginają się i przyciągają linę, nogi stoją.
- `sled.backWalk` z W1 („Odchyl się od sanek…”) — nadal tylko EliteFTS dla odchylenia; zastąpione węższym `sled.backPedal`.

**Bear Crawl Sled Drag — ustawienie i ruch.**
- EliteFTS, Marshall Roy, 09.07.2013 (elitefts.com/blogs/training/eight-sled-drag-variations-for-strength-and-athleticism), wariant 8
  „Panther crawl sled drag”: pozycja na czworakach z kolanami ok. cala nad podłogą, krok przeciwną ręką i nogą, „keeping your back flat”,
  kolana nie dotykają podłogi. Druga publikacja tej samej organizacji (Z. Even-Esh, „Endless Sled Dragging Variations”, lista wariantów:
  „Bear crawls done for speed with strap around belt.”) potwierdza zaczepienie do pasa — ta sama organizacja, liczona raz.
- ACE Exercise Library #150 „Bear Crawl” (acefitness.org/resources/everyone/exercise-library/150/bear-crawl/), Starting position i kroki 2–3:
  pozycja jak do pompki z ugiętymi kolanami („keeping the knees bent”), krok lewą ręką i prawą nogą razem, „keeping the back straight”.
- Uproszczenie: ruch bazowy (chód na czworakach bez sanek) — sanki przypięte do pasa dokładają tylko opór z tyłu; kolejność kończyn,
  ugięte kolana nad podłogą i płaskie plecy są w obu opisach te same. Przypięcie sanek do pasa należy do definicji ćwiczenia
  (katalog: wymagane `sled` + `dip_belt`, l. 534; opis zbioru: „Wearing either a harness or a loose weight belt…”), a ze źródeł
  technicznych potwierdza je tylko EliteFTS — zaznaczam przy zdaniu.
- Różnica: wariant EliteFTS („panther”) trzyma kolana ok. cala nad podłogą, ACE mówi tylko „kolana ugięte” — zdanie podaje część wspólną
  („kolana ugięte, nad podłogą”).
- Błędy: `bcsd.mis.knees` — zaprzeczenie ustawienia; EliteFTS wprost („not letting your knees touch the ground”). `bcsd.mis.back` —
  zaprzeczenie „plecy płasko” z `bcsd.move` (ACE „keeping the back straight”, EliteFTS „keeping your back flat”).

## 2. Blok

### Blok do wdrożenia

```json
{
 "orgs": {
  "Rep Fitness": {"name": "Rep Fitness — blog Training (producent sanek i sprzętu; autor z NASM-CPT, weryfikacja NASM-CPT)", "level": 4, "kind": "maker"},
  "EliteFTS": {"name": "EliteFTS — artykuły szkoleniowe (producent sanek do ciągnięcia i pchania, autorzy-trenerzy)", "level": 4, "kind": "maker"},
  "Torque Fitness": {"name": "Torque Fitness — Ultimate TANK Training Guide (producent sanek do pchania i ciągnięcia)", "level": 4, "kind": "maker"}
 },
 "sources": {
  "rep-sled-push": {"org": "Rep Fitness", "title": "Sled Push Technique Guide (R. MacPherson, rec. NASM-CPT, akt. 23.10.2026)", "url": "https://repfitness.com/blogs/training/sled-push-technique", "level": 4},
  "rep-sled-pull": {"org": "Rep Fitness", "title": "3 Techniques to Elevate Your Sled Pull Workouts (J. Dickson, 23.01.2026, akt. 03.08.2026)", "url": "https://repfitness.com/blogs/training/sled-pull-workout", "level": 4},
  "barbend-sled-push": {"org": "BarBend", "title": "How to Do the Sled Push (M. Dewar, CSCS, akt. 28.06.2024)", "url": "https://barbend.com/sled-push/", "level": 4},
  "elitefts-shove": {"org": "EliteFTS", "title": "Shove It! Top Pushing Moves (D. Balzarini, 05.07.2011)", "url": "https://elitefts.com/blogs/training/shove-it-top-pushing-moves", "level": 4},
  "elitefts-drag-variations": {"org": "EliteFTS", "title": "Endless Sled Dragging Variations (Z. Even-Esh, 2011/2020)", "url": "https://elitefts.com/blogs/training/endless-sled-dragging-variations-that-will-dramatically-improve-your-performance", "level": 4},
  "elitefts-backward-pull": {"org": "EliteFTS", "title": "Backwards Sled Pulls for Quad Size and Strength (J. Bryant, 13.06.2016)", "url": "https://elitefts.com/blogs/training/backwards-sled-pulls-for-quad-size-and-strength", "level": 4},
  "elitefts-eight-drag": {"org": "EliteFTS", "title": "Eight Sled Drag Variations for Strength and Athleticism (M. Roy, 09.07.2013)", "url": "https://elitefts.com/blogs/training/eight-sled-drag-variations-for-strength-and-athleticism", "level": 4},
  "torque-utg-2024": {"org": "Torque Fitness", "title": "Ultimate TANK Training Guide (2024, PDF; kopia u dystrybutora)", "url": "https://cdn.fitshop.co.uk/files/torque/functional_training_and_strongman/TOR-TANKMX/Ultimate_TANK_Training_Guide_2024.pdf", "level": 4},
  "ace-150-bear-crawl": {"org": "ACE", "title": "Bear Crawl (#150)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/150/bear-crawl/", "level": 4}
 },
 "exercises": {
  "Sled Push": {
   "setup": [
    {"c": "sled.pushGrip", "s": [["rep-sled-push", "Choose Your Hand Position (wysokie uchwyty na prostych rękach albo niższe; parafraza)"], ["barbend-sled-push", "How to Do the Sled Push, krok 2 („Place the hands about halfway down the sled handles.”)"], ["torque-utg-2024", "s. 40, Push, Instructions 1 („Grasp handles with both hands…”)"], ["elitefts-shove", "Prowler („…grab the handles, get in a proper forward lean position, and get pushing.”)"]]}
   ],
   "move": [
    {"c": "sled.legs", "s": [["rep-sled-push", "Take Short, Quick Steps („Don't push with your arms since they are not nearly as strong as your legs.”)"], ["barbend-sled-push", "krok 3 („…begin aggressively driving forward with your legs.”; odpychanie przodem stopy)"]]}
   ],
   "tips": [
    {"c": "sled.lean", "s": [["rep-sled-push", "Get Low and Lean In (pochylenie ok. 45°; parafraza)"], ["barbend-sled-push", "krok 2 (pochylenie w przód, plecy płasko, blisko równolegle do podłoża; parafraza)"], ["elitefts-shove", "Prowler („get in a proper forward lean position”)"]]},
    {"c": "hinge.back", "s": [["rep-sled-push", "Get Low and Lean In („Keep your back flat”; parafraza) oraz Avoid These Common Mistakes (bez zaokrąglania lędźwi)"], ["barbend-sled-push", "krok 2 („lean forward so that your spine is parallel to the ground and your lower back is flat”)"]]}
   ],
   "mistakes": [
    {"c": "sled.mis.upright", "s": [["wniosek", "sled.lean"], ["rep-sled-push", "Avoid These Common Mistakes, punkt 2 („Avoid rounding your lower back or standing too tall…”)"]]},
    {"c": "sled.mis.roundBack", "s": [["wniosek", "hinge.back"], ["rep-sled-push", "Avoid These Common Mistakes, punkt 2 („Avoid rounding your lower back…”) i punkt 4 („If your back does round or your hips go up, then the sled might be too heavy”)"]]}
   ]
  },
  "Backward Drag": {
   "setup": [
    {"c": "sled.backGrip", "s": [["rep-sled-pull", "Backwards Walk („You can hold the rope in your hands…”)"], ["elitefts-drag-variations", "lista wariantów („Backward drag with split rope…”) i The Belt (lina z dwoma uchwytami)"]]}
   ],
   "move": [
    {"c": "sled.backPedal", "s": [["elitefts-backward-pull", "technika („Lean back, away from the sled, the entire movement.”; „Use your legs.”)"], ["torque-utg-2024", "s. 62, Harness Backpedal, Instructions 1–2 („…stand facing TANK.”; „Squat low and backpedal legs pulling TANK down runway.”) — uproszczenie: wariant zaczepienia (pas zamiast liny w rękach), por. rep-sled-pull Backwards Walk (lina w rękach albo pas na biodrach — to samo ćwiczenie)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "sled.mis.row", "s": [["wniosek", "sled.backPedal"], ["elitefts-backward-pull", "błędy („Never row the weight; pull it with your body.”)"]]}
   ]
  },
  "Bear Crawl Sled Drag": {
   "setup": [
    {"c": "bcsd.setup", "s": [["elitefts-eight-drag", "wariant 8 Panther crawl sled drag (na czworakach, kolana ok. cala nad podłogą; parafraza)"], ["elitefts-drag-variations", "lista wariantów („Bear crawls done for speed with strap around belt.”) — ta sama organizacja: zaczepienie do pasa"], ["ace-150-bear-crawl", "Starting position (pozycja jak do pompki, „keeping the knees bent”) — uproszczenie: chód na czworakach bez sanek"]]}
   ],
   "move": [
    {"c": "bcsd.move", "s": [["elitefts-eight-drag", "wariant 8 (krok przeciwną ręką i nogą; „keeping your back flat”)"], ["ace-150-bear-crawl", "kroki 2–3 (lewa ręka i prawa noga razem, naprzemiennie; „keeping the back straight”) — uproszczenie: chód na czworakach bez sanek"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "bcsd.mis.knees", "s": [["wniosek", "bcsd.setup"], ["elitefts-eight-drag", "wariant 8 (kolana nie dotykają podłogi — „not letting your knees touch the ground”)"]]},
    {"c": "bcsd.mis.back", "s": [["wniosek", "bcsd.move"]]}
   ]
  }
 }
}
```

Uwagi do bloku:
- `hinge.back` przy BarBend — miejsce poprawione na dokładne brzmienie kroku 2 (potwierdzone w przeliczeniu W1, wiersz barbend-sled-push).
- Backward Drag i Bear Crawl Sled Drag mają w źródłach oznaczone **uproszczenie** (wariant zaczepienia / ruch bazowy bez sanek). Jeśli
  recenzent odrzuci uproszczenie, obie karty wracają do „otwarta” (zostaje po jednym źródle szczebla 4: EliteFTS).
- `bcsd.setup` — zaczepienie do pasa ze źródeł technicznych tylko EliteFTS (jedna organizacja); pozycja na czworakach — EliteFTS + ACE.
- Pole `"s": [["wniosek", …]]` dla `bcsd.mis.back` bez dodatkowego źródła — dopuszczalne wg briefu (błąd wnioskowany).

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| sled.mis.upright | Stoisz za prosto za sankami zamiast się pochylić. | Standing too upright behind the sled instead of leaning in. |
| sled.mis.roundBack | Plecy zaokrąglają się przy pchaniu. | Rounding your back as you push. |
| sled.backPedal | Stań przodem do sanek i idź tyłem, odpychając się nogami. | Face the sled and walk backward, driving with your legs. |
| sled.mis.row | Przyciąganie sanek rękami zamiast pracy nóg. | Rowing the sled in with your arms instead of driving with your legs. |
| bcsd.setup | Przypnij sanki do pasa i stań tyłem do nich na dłoniach i stopach, kolana ugięte nad podłogą. | Clip the sled to your belt and get on your hands and feet facing away from it, knees bent and off the floor. |
| bcsd.move | Idź na czworakach, przestawiając naraz przeciwną rękę i nogę; plecy trzymaj płasko. | Crawl forward, moving opposite hand and foot together; keep your back flat. |
| bcsd.mis.knees | Kolana opadają na podłogę. | Knees dropping to the floor. |
| bcsd.mis.back | Plecy się garbią albo zapadają zamiast zostać płaskie. | Back rounding or sagging instead of staying flat. |

Istniejące zdania użyte bez zmian: `sled.pushGrip`, `sled.legs`, `sled.lean`, `hinge.back` (Sled Push), `sled.backGrip` (Backward Drag — zdanie
z W1, dotąd poza blokiem). `mis.roundBack` z zestawu ogólnego nie pasuje („…żeby dociągnąć ciężar” — tu pchanie), stąd `sled.mis.roundBack`.
Przestrzeń `bcsd.` — nowa, bez kolizji w `lib/cues/text/pl.json` (sprawdzone: brak kluczy `bcsd.` i `crawl.`).

## 4. Źródła

| id | adres | organizacja | szczebel | uzasadnienie / co przeczytano (02.11.2026) |
|---|---|---|---|---|
| rep-sled-push | https://repfitness.com/blogs/training/sled-push-technique | Rep Fitness (producent sanek) | 4 | autorka R. MacPherson, recenzja R. Borchert NASM-CPT, data 23.10.2026; sekcje Get Low and Lean In, Avoid These Common Mistakes |
| rep-sled-pull | https://repfitness.com/blogs/training/sled-pull-workout | Rep Fitness | 4 | J. Dickson, 23.01.2026 (akt. 03.08.2026), recenzja NASM-CPT; sekcja Backwards Walk (4 zdania), Hip Drive Pull; brak błędów |
| barbend-sled-push | https://barbend.com/sled-push/ | BarBend | 4 | M. Dewar, CSCS, akt. 28.06.2024 (przeliczenie W1) |
| elitefts-shove | https://elitefts.com/blogs/training/shove-it-top-pushing-moves | EliteFTS (producent sanek) | 4 | z W1, bez zmian |
| elitefts-drag-variations | (adres w bloku) | EliteFTS | 4 | Z. Even-Esh, 18.12.2011 / 07.04.2020; lista wariantów — bez techniki kroków; „Bear crawls done for speed with strap around belt.” |
| elitefts-backward-pull | https://elitefts.com/blogs/training/backwards-sled-pulls-for-quad-size-and-strength | EliteFTS | 4 | J. Bryant, 13.06.2016; technika (odchylenie, ręce jak haki, krótkie szybkie kroki, nogi) i błędy (wiosłowanie, zatrzymanie sanek, długie kroki) |
| elitefts-eight-drag | https://elitefts.com/blogs/training/eight-sled-drag-variations-for-strength-and-athleticism | EliteFTS | 4 (do oceny recenzenta) | M. Roy, 09.07.2013, kwalifikacje autora niepodane; artykuł promuje sanki i uprząż innej firmy. Szczebel 4 wg precedensu W1 (EliteFTS = producent sanek, artykuł z autorem i datą); jeśli recenzent uzna, że promocja cudzego sprzętu wyklucza pkt 3 — karta Bear Crawl Sled Drag wraca do otwartych |
| torque-utg-2024 | (adres w bloku) | Torque Fitness (producent sanek TANK) | 4 | przeczytane dziś strony PDF 30–32 = druk s. 58 Harness Pull, 60 Harness Lateral Pull, 62 Harness Backpedal (PDF ma 41 stron — rozkładówki; druk s. = 2 × nr strony PDF − 2) |
| ace-150-bear-crawl | https://www.acefitness.org/resources/everyone/exercise-library/150/bear-crawl/ | ACE | 4 | pozycja wyjściowa i kroki 1–4 |
| ace-247-spider-walks (nie w bloku) | https://www.acefitness.org/resources/everyone/exercise-library/247/spider-walks/ | ACE | 4 | pozycja jak do pompki, kolano na zewnątrz łokcia, przemieszczanie się do przodu; bez autora i daty (treść firmowana przez ACE) |
| free-exercise-db (tylko identyfikacja) | https://github.com/yuhonas/free-exercise-db (pliki `exercises/*.json`) | — | 5 | definicje ruchów w nagłówku; nie liczone |
| (nie liczone) BarBend „6 Benefits of Sled Pulls” | https://barbend.com/news/benefits-of-sled-pull/ | BarBend | — | M. Dewar, akt. 20.07.2023; brak techniki krok po kroku |
| (nie liczone) EliteFTS „Sledgehammer Conditioning…” | https://elitefts.com/blogs/training/sledgehammer-conditioning-for-athletes-and-weekend-warriors | EliteFTS | 5 | C. Gardner, 11.11.2011, bez biogramu i kwalifikacji; EliteFTS nie jest tu producentem sprzętu (młot) — zsuwanie górnej ręki, mocny chwyt |
| (nie liczone) Rogue „Westside Barbell — Squats and Sleds” | https://www.roguefitness.com/westside-barbell-squats-and-sleds | Rogue (producent) | — | strona produktu (film), brak techniki |

Niedostępne dziś: barbend.com/sled-drag/ (404), STACK (503 — „Overhead Sledgehammer Swing to Tire”, „Sled walk drills”, „Sled Drag
Variations”), EliteFTS „innovative sled dragging technique” (404 pod oboma adresami), EliteFTS „sledgehammer conditioning” pod
`/education/` (404), rosstraining.com (pusta strona). Wyniki aplikacji treningowych i agregatorów pominięte zgodnie z zasadami.

## 5. Otwarte

- **Sled Push** — „pchanie rękami” i „za długie kroki”: tylko Rep Fitness (szczebel 4) wprost; drugiego źródła brak. „Zginanie łokci” — pominięte (sprzeczność).
- **Backward Drag** — wskazówki „odchyl się od sanek”, „ręce proste jak haki”, „krótkie szybkie kroki”, błąd „długie kroki”: tylko EliteFTS
  (+ free-exercise-db, szczebel 5). Szukane: BarBend (404), producenci (Rep — brak techniki kroku), badania (West i in. 2014 — w streszczeniu
  tylko obciążenie i serie, bez opisu techniki).
- **O4 Sled Drag (Harness)** — nadal jedno źródło szczebla 4 (Torque s. 58: pas na biodrach, pochylenie w przód, praca nóg). Szukane:
  EliteFTS (Even-Esh — tylko nazwa wariantu; „Eight variations” — brak; „innovative…” — 404), BarBend (artykuł news bez techniki; /sled-drag/ 404),
  Rogue (brak tekstu), STACK (503). Kandydaci do karty po drugim źródle: `sled.lean`, `sled.legs` + zdanie ustawienia z pasem.
- **O5 Sledgehammer Swings** — jedyne opisy techniki: firma trenerska (5), EliteFTS bez kwalifikacji autora (5), STACK (503 — do ponownej próby),
  blog sklepu z kettlebellami (5). Następna próba: STACK „Exercise of the Week: Overhead Sledgehammer Swing to Tire” (autor i kwalifikacje).
- **O7 Sled Forward Drag with Press** — brak opisu tego ruchu (marsz przodem z wypchnięciem) w źródle ≥ 4; EliteFTS opisuje tylko wyciskanie
  w miejscu albo w wykroku, Torque s. 44 — inny ruch. Definicja w zbiorze niedostępna (404) — najpierw ustalić definicję.
- **O8 Sled Overhead Backward Walk** — brak przeczytanego opisu ≥ 4 (wyniki: agregatory i aplikacje). Możliwe uproszczenie z `sled.backPedal`
  dla nóg nie rozwiązuje ustawienia rąk nad głową.
- **O9 Spider Crawl** — jedno źródło szczebla 4 (ACE #247 Spider Walks: z rękami prostymi, przemieszczanie do przodu), a definicja w katalogu
  (zbiór, miara „powtórzenia”) ma ręce ugięte do 90° i nie mówi o przemieszczaniu. Najpierw decyzja, który ruch jest w katalogu (produktowa /
  koordynator), potem drugie źródło. Inne trafienia opisują pompkę z kolanem do łokcia (inne ćwiczenie) albo są stronami aplikacji.

## 6. Stan

- Zrobione (02.11.2026, W2): Sled Push — 2 błędy; Backward Drag — ruch + błąd; Bear Crawl Sled Drag — ustawienie, ruch, 2 błędy;
  przeczytane Torque s. 58, 60, 62; nowe źródła: elitefts-backward-pull (do bloku), elitefts-eight-drag, ace-150-bear-crawl.
- Zostało: O4, O5, O7, O8, O9; recenzja uproszczeń w Backward Drag i Bear Crawl Sled Drag oraz szczebla elitefts-eight-drag.
- Następny krok: ponowić STACK (503) dla młota i chodów z sankami; definicja Sled Forward Drag with Press (inny plik zbioru albo nazwa).
- Pułapki: PDF Torque — numer strony PDF ≠ numer druku (rozkładówki; druk = 2 × PDF − 2); strony PDF to obrazy (ok. 1,5 tys. tokenów
  na stronę); indeks ćwiczeń EliteFTS i część `/education/` — 404, działają adresy `/blogs/training/...`.
