# Recenzja niezależna treści kart — partia A4a (core), runda 2, 09.11.2026

Recenzent: badacz-merytoryczny (nie pisał treści; L-047). Autor: programista A4. Gałąź `tekst/a4-core-moc` @ 791a0b7b.
Materiał: `a4-klucze.json` @ 791a0b7b (sekcje `karty` — 18 kart, `runda2`, `odrzucone`, `niewdrozone`), wpis docs/18 z 09.11.2026 „po rundzie 1”, `lib/cues/text/pl.json` (klucze `core_floor.ball*`, `mis.momentum`, `mis.ballPos`), runda 1: `docs/research/recenzje/a4-core-karty-badacz-2026-11-09.md` i `a4-core-lokalizacja-2026-11-09.md`.
Metoda — ograniczenia: bez powłoki (brak `git diff`); gałąź czytana przez raw.githubusercontent.com/…/791a0b7b (WebFetch). Zgodność `a4-klucze.json` ↔ `cues.json`/słowniki/fixture nadal do `git diff` koordynatora (jak w rundzie 1). Teksty kluczy `ball*` sprawdzone w `pl.json` @ 791a0b7b — identyczne z kluczami.
Strony otwarte 09.11.2026 w tej rundzie: ACE 68 (stability-ball-sit-ups-crunches), NFPT stability-ball-crunch, NASM best-abs-exercises (sekcja Stability Ball Crunch), ACE 382 (figure-eight), BarBend l-sit, CrossFit essentials/the-l-sit. Pozostałe źródła — odczyty z rundy 1.

## (1) Karty z „POPRAWKI” w rundzie 1

| Karta | Werdykt r2 | Uzasadnienie |
|---|---|---|
| Cable Crunch | **wyswietlana** | Pole `uproszczenie: wariant pozycji (stojąc → klęcząc)` dopisane przy każdym zdaniu z parą ace-331 (`ccSetup`, `ccMove`, `cc.slow`, `mis.ccArms`, `mis.fastReturn`) — zgodnie z rundą 1. Nowe brzmienie `ccSetup` („Załóż linę na górny wyciąg, uklęknij i trzymaj końce liny przy głowie.”) nie dodaje treści (bez kierunku „przodem/tyłem do wyciągu”); ACE 331: wyciąg „at the highest level”, lina przy uchu; BarBend: klęk. `mis.fastReturn` PL „Zbyt szybki powrót — ciężar ciągnie cię do góry.” = EN, oba źródła: powolny powrót. |
| V-Up | **wyswietlana** | `plank.brace` usunięte (opcja A z rundy 1). Karta: `supineReach` + `vupMove` + `mis.vupKnees` — wszystkie Catalyst 313 + WebMD (odczyt r1). `vupMove` PL „…potem wróć do leżenia” / EN „lower yourself back down” — Catalyst: „return to fully extended”; treść bez zmian. |
| Tuck Crunch | **wyswietlana** | `tuckCrunch.move` = część wspólna z rundy 1 („Zwiń tułów w stronę kolan, potem opuść się powoli.” / „Curl your upper body toward your knees, then lower slowly.”) — bez „łopatek”, więc nie przeczy FV („without lifting your upper back”). `mis.neckPull` PL poprawione na „Ciągnięcie szyją zamiast unoszenia barków.” = EN; FV: „do not pull up on your neck”. Niska (dane, nie UI): `miejsce` ace-243 przy `tuckCrunch.move` nadal wymienia „łopatki od podłogi” — do skrócenia przy okazji. |
| Kettlebell Figure 8 | **wyswietlana** | `figure8.setup` = część wspólna z rundy 1 („Stań w rozkroku, ugnij kolana, kettlebell trzymaj w jednej ręce.”). `figure8.move` „między nogami” — FV wprost: „Swing the weight between your legs toward the opposite arm…”; ACE 382: „Reach the right arm behind the right leg and pass the kettlebell under the right leg.” — podanie pod nogą z ręki do ręki od wewnątrz to przejście przez przestrzeń między nogami; zgodne, nic ponad źródła. Karta bez błędu — dopuszczalna (docs/18:137, minimum = ustawienie + ruch). Dla recenzenta figur bez zmian: który wariant (przysiad statyczny / wymach) pokazuje rysunek. |

## (2) Stability Ball Crunch — pełna recenzja (karta przywrócona)

Szczebel NFPT: strona ma autorkę z nazwiska (Erin Nitschke) i datę („Posted August 10, 2025”); kwalifikacje na stronie tej samej organizacji (NFPT Spotlight, NSCA-CPT; runda 1 pkt (a)) — 4, zgodnie z regułą przyjętą w docs/18 09.11 („ACE + NFPT = 4”). ACE 68 — biblioteka ćwiczeń organizacji szkolącej trenerów, 4. NASM (H. Cherry, aktualizacja 23.07.2026), 4.

| Zdanie | Ocena | Źródła (miejsce, cytat) |
|---|---|---|
| `core_floor.ballSetup` „Usiądź na piłce, przejdź stopami do przodu i połóż się na niej środkiem pleców; stopy płasko na podłodze.” | potwierdzone | ACE 68 Step 1: „walking yourself out along the ball”; „Your mid-back should be positioned on the top of the ball”. NFPT Starting Position: „Sit on the ball with feet flat on the floor and hip width apart…”; „Roll down on the ball so that the mid to low back is in contact with the ball.” Część wspólna: środek pleców — dobrze; bez kątów z NFPT (90°) — dobrze. |
| `core_floor.ballMove` „Zwijaj tułów, aż górna część pleców oderwie się od piłki; wracaj powoli.” | potwierdzone | ACE 68 Step 3: „Continue curling up until your upper back is lifted off the ball”; Step 4: „slowly uncurl”. NFPT Upward Phase: „curl the torso so that the upper back is off the ball.”; Downward Phase: „…in a slow and controlled manner.” |
| `core_floor.ballStill` „Stopy i biodra zostają w miejscu — pracuje tylko tułów.” | potwierdzone | ACE 68 Step 3–4: stopy „firmly planted”, kość ogonowa i lędźwie w kontakcie z piłką. NFPT Upward Phase: „Make sure to maintain the lower body position established in the starting phase of the movement.” |
| `crunch.neck` (istniejące) „Szyja rozluźniona — nie ciągnij głowy rękami.” | potwierdzone | ACE 68: „the neck stays relaxed while the chin is tucked towards the neck”. NASM: „Avoid pulling on the neck or using excessive momentum.”; NFPT Common Errors: „Pulling on the neck”. |
| `core_floor.mis.momentum` „Robienie powtórzeń z rozpędu zamiast pod kontrolą.” | potwierdzone (błąd, 2 organizacje wprost) | NFPT Downward Phase: „Do not use momentum to perform the next repetition.”; Common Errors: „Using momentum”. NASM Coaching Tip (cytat wyżej). |
| `core_floor.mis.ballPos` „Leżenie za nisko albo za daleko na piłce — środek pleców nie jest na jej szczycie.” | potwierdzone | NFPT Common Errors: „Sitting too low or too far back on the ball”. ACE 68 Step 1 (standard „mid-back… on the top of the ball”) — zaprzeczenie standardu. Niska (lokalizacja): PL „za daleko” gubi „back” z EN („too far back”) — sens zachowany przez drugą część zdania; ewentualnie „za bardzo z tyłu”. |

Brak liczb, kątów, twierdzeń o zdrowiu i nazw źródeł; PL = EN treściowo. **Werdykt: wyswietlana.**

## (3) Zmiany brzmienia z lokalizacji

- Odrzucone przez autora — słusznie albo neutralnie dla treści:
  - „pępek” (`vacuum.move`): obecne „Wciągnij brzuch w stronę kręgosłupa i przytrzymaj.” mieści się w obu źródłach (Healthline: pępek ku kręgosłupowi; Virginia Mason: „Gently draw in the muscles under your fingers.”). Uzasadnienie autora („VM go nie podaje”) jest trafne: „pępek” miałby jedno źródło.
  - „na prostych rękach” (`hang.setup`): obecne „Zawiśnij na drążku, ciało wyprostowane.” = treść rundy 1 (Catalyst „Hang from a pull-up bar…”, BarBend „completely dead hang”). Wariant zapasowy recenzenta lokalizacji — nie dodaje treści.
  - „zwiń” (`mcMove`): zostaje „Napnij brzuch i pochyl tułów do przodu.” — skrót brzmienia zatwierdzonego w rundzie 1 (usunięte tylko „przeciw oporowi maszyny”); Hoist: „bend at the waist… push upper torso forward”. Bez zmiany treści.
- Przyjęte: „między nogami” (`figure8.move`) — potwierdzone wyżej (FV wprost, ACE geometrycznie); „piłka gimnastyczna / stability ball” (`cabletwist.setup`) — ACE 65 i FV mówią o piłce stabilizacyjnej; doprecyzowanie, nie nowa treść.
- Pozostałe zmienione zdania z `runda2.zdaniaZmienione` (`situpMove`, `vupMove`, `mis.lowBackUp` EN bez „or bench” i PL „podłogi”, `windmill.move` „Cofnij biodra”, `dblMove` „ciężar ciała”, `supermanMove`/`scissor.lift` „lekko”, `supermanSetup` EN „in front of you”, `headNeutral` skrócone, `scissor.move` EN, `mcSetup` EN, `ccSetup`, `hollowMove`, `suspRevCrunch.move` EN „push-up position”, `cabletwist.hips`, `mis.neckPull`, `mis.fastReturn`): treść w granicach źródeł z rundy 1; skrócenia tylko usuwają powtórzenia. Uwaga niska: `windmill.move` zostawia „przeciwnej nogi” — zgodne z Catalyst („inside of the opposite foot”) i ACE (wolna ręka po wewnętrznej stronie nogi po swojej stronie), dwuznaczność językowa zgłoszona przez lokalizację nie jest błędem treści.

## (4) L-Sit — werdykt: [OTWARTE] (nie wyświetlać w tej rundzie)

- Stan danych @ 791a0b7b: L-Sit nie ma wpisu w `karty`; w `odrzucone` jest `lsit.mis.legsDrop` (bez źródeł), w `niewdrozone` — „karta odrzucona” decyzją koordynatora 09.11 (d). Brzmienia `lsit.setup`, `lsit.move`, `lsit.legsTogether` nie ma w kluczach ani w `pl.json` (WebFetch: brak kluczy `lsit*`). Nie mogę zrecenzować zdań, których nie widzę — zasada „czego nie potwierdzisz → otwarte”.
- Co pokazują przeczytane źródła (dla rundy 3):
  - CrossFit, essentials/the-l-sit (G. Glassman, 2003, na stronie organizacji): „The L-sit is performed by supporting the body entirely by the arms and holding the legs straight out in front.” — opisuje pozycję, nie ustawienie dłoni ani sposób unoszenia.
  - BarBend, l-sit (B.-A. Burick, cert. AFAA, aktualizacja 29.06.2024): „Straighten your arms and lock your elbows out.”; „Start to slowly lift your legs in front of you, creating an "L" shape with your body.”; „…engage your core and squeeze your legs together.”
  - FIG A202 (runda 1): podpór na dłoniach przy udach, nogi razem, biodra zgięte, nogi równolegle do podłogi — tylko pozycja, bez prostych nóg.
- Ocena twierdzenia autora: `lsit.move` = CrossFit + BarBend — **tak, dla zdania „unieś proste nogi przed siebie (do pozycji L) i trzymaj”** (CrossFit: nogi proste przed sobą; BarBend: unoszenie nóg przed siebie w „L”); „poziomo/równolegle do podłogi” — BarBend „L” + FIG. `lsit.setup` = BarBend + FIG — **tak, tylko dla „podpór na dłoniach po bokach bioder/ud”**; „proste ręce / zablokowane łokcie” ma tylko BarBend wprost (CrossFit „supporting the body entirely by the arms” — nie mówi o prostych rękach) → bez „prostych rąk” albo z oznaczeniem „jedno źródło” niedopuszczalnym dla szczebla 4. `lsit.legsTogether` = BarBend + FIG — tak. Karta bez błędu — dopuszczalna regułą minimum (docs/18:137), jak Kettlebell Figure 8. Brak póz v2 to sprawa bramki figur (nie treści) — decyzja koordynatora.
- Warunek zamknięcia: autor wpisuje L-Sit do `karty` z tekstem PL/EN, źródłami i miejscami (crossfit-l-sit, barbend-l-sit, fig-a202 tylko pozycja), koordynator cofa „odrzucona” w `niewdrozone` → runda 3 tylko L-Sit.

## Werdykty rundy 2 (18 kart + L-Sit)

| Karta | Werdykt |
|---|---|
| Cable Crunch | wyswietlana |
| Hollow Hold | wyswietlana (r1; zmiana lokalizacji `mis.lowBackUp` bez zmiany treści) |
| Superman | wyswietlana (r1; role nadal nieoceniane) |
| Sit Up | wyswietlana (r1) |
| V-Up | wyswietlana |
| Machine Crunch | wyswietlana (r1) |
| Suspended Reverse Crunch | wyswietlana (r1) |
| Tuck Crunch | wyswietlana |
| Stomach Vacuum | wyswietlana (r1; klucz ustawienia zastąpiony istniejącym `mobility_floor.t.supTwist.setup`) |
| Scissor Kick | wyswietlana (r1) |
| Kettlebell Windmill | wyswietlana (r1) |
| Cable Russian Twists | wyswietlana (r1) |
| Double Kettlebell Windmill | wyswietlana (r1) |
| Kettlebell Figure 8 | wyswietlana |
| Hanging Leg Raise | wyswietlana (r1) |
| Hanging Knee Raise | wyswietlana (r1) |
| Toes to Bar | wyswietlana (r1) |
| Stability Ball Crunch | wyswietlana |
| L-Sit | [OTWARTE] — brak brzmienia zdań w materiale; źródła wystarczą na minimalną kartę po warunkach z pkt (4) |

## Otwarte

- [OTWARTE] L-Sit — runda 3 po wpisaniu karty (pkt 4).
- [OTWARTE] `git diff` `a4-klucze.json` ↔ `cues.json`/słowniki/fixture — koordynator (bez powłoki u recenzenta).
- [OTWARTE] Role Supermana i `abs.antilordosis` (bez przekładów) — poza tą rundą.

## JSON do sekcji „karty” (`docs/research/figury-recenzja.json`) — runda 2, 18 kart „wyswietlana”

Pole `sha` pominięte — wpisuje koordynator na drzewie 791a0b7b.

```json
{
  "Cable Crunch": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; uproszczenie wariantu pozycji (stojąc → klęcząc) przy ace-331 potwierdzone" },
  "Hollow Hold": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; zmiany lokalizacji bez zmiany treści" },
  "Superman": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; Cleveland Clinic (szpital) szczebel 4; role nieoceniane" },
  "Sit Up": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; situpMove — część wspólna źródeł" },
  "V-Up": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; plank.brace usunięte z karty (runda 1, opcja A)" },
  "Machine Crunch": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; uproszczenie instrukcji maszyny producenta przy maszynie ogólnej potwierdzone (ruch się nie różni)" },
  "Suspended Reverse Crunch": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; TRX (instrukcja na własnych taśmach) szczebel 4, liczony raz" },
  "Tuck Crunch": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; tuckCrunch.move — część wspólna FV/ACE 243 (bez łopatek)", "uwagi": "Niska, dane: miejsce ace-243 przy tuckCrunch.move nadal wymienia łopatki." },
  "Stomach Vacuum": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; pozycja leżąca potwierdzona; vacuum.move bez „pępka” (jedno źródło)" },
  "Scissor Kick": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; FV (P. Dale, PT, data) szczebel 4" },
  "Kettlebell Windmill": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; Experience Life szczebel 4 (kwalifikacje autorki na stronie tej samej organizacji)" },
  "Cable Russian Twists": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; FV (M. Magnante, ACE, JSON-LD) szczebel 4" },
  "Double Kettlebell Windmill": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; uproszczenie jeden → dwa kettlebelle (tor ten sam) potwierdzone" },
  "Kettlebell Figure 8": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; figure8.setup — część wspólna ACE/FV; „między nogami” potwierdzone; karta bez błędu (minimum: ustawienie + ruch)" },
  "Hanging Leg Raise": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; hang.legs.move bez wysokości — część wspólna źródeł" },
  "Hanging Knee Raise": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026" },
  "Toes to Bar": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; wersja ścisła zgodna z docs/18 02.11.2026" },
  "Stability Ball Crunch": { "werdykt": "wyswietlana", "data": "2026-11-09", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A4", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A4a, runda 2 (791a0b7b), 09.11.2026; ACE 68 + NFPT (E. Nitschke, kwalifikacje na stronie tej samej organizacji) szczebel 4; 5 nowych zdań potwierdzonych", "uwagi": "Niska, lokalizacja: PL mis.ballPos „za daleko” gubi „back” z EN." }
}
```
