# Recenzja niezależna treści kart — partia A1 (pchanie), 08.11.2026

Recenzent: badacz-merytoryczny (nie pisał treści). Autor: programista A1 (gałąź `tekst/a1-pchanie`, commity 938aaf4c, 72dd24d0; runda 2: fbc2c450; runda 3: 54bcfd4f).
Materiał: `data/zrodla/cues.json` (karty 18802–19701, źródła 3229–3361), `lib/cues/text/pl.json` i `en.json` (klucze 625–661 oraz wspólne: ohp.move, ohp.tall, plank.brace, push.move, dfly.*, fly.elbows, mcp.blades, mis.jerk), `data/zrodla/role-miesni.json` (`obliques.side_hold`, 566–587; S29, S30).
Uwaga o metodzie: bez powłoki (brak `git diff`) — przegląd plików w worktree; każde źródło z listy A1 otwarte przez WebFetch 08.11.2026 (PDF Echelon odczytany jako obraz strony 1).

Kryteria: (1) każde zdanie ≥ 2 zgodne źródła szczebla 4 z różnych organizacji (albo 1 źródło szczebla 3 dla ustawienia/ruchu), miejsce w danych zgodne ze stroną; (2) tekst nie twierdzi więcej (liczby, zdrowie, kąty); (3) brak nazw źródeł/organizacji w tekstach; (4) PL = EN treściowo.
Wynik (3) i (4): we wszystkich 14 kartach teksty PL i EN nie wymieniają źródeł ani organizacji, nie zawierają liczb, kątów ani twierdzeń o zdrowiu; PL i EN zgodne treściowo.

## Runda 1 — tabela werdyktów (zastąpiona przez rundy 2 i 3 dla kart KB, Band Shoulder Press i Suspended Push-Up)

| Karta | Werdykt | Uzasadnienie (źródło, miejsce, cytat ≤ 2 zdania) |
|---|---|---|
| Arnold Press | wyswietlana | barbend.com/arnold-press/ „How to”: „Press the dumbbells overhead while simultaneously rotating your palms so that they’re facing forward.” ISSA (issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes, Arnold Press): obrót „away from the face about 180 degrees” przy wyciskaniu, start dłońmi do ciała. Błąd łuku: ISSA Common Mistakes „Arching the lower back”; BarBend FAQ „avoid overextending your lower back”. Tekst nie podaje 180°. |
| Seated Barbell Military Press | wyswietlana | ACE 43 (acefitness.org/…/43/seated-shoulder-press/): „gripping the bar with the hands a little wider than shoulder-width apart”; „keep the elbows pointed forward while pressing the bar directly overhead.” ISSA: „just outside shoulder width”, „The elbows should point forward…”, seated „can help minimize a client's lower back arch”. Uwaga niska: ustawienie nie mówi o siadzie (nazwa to mówi) — nie blokuje. |
| Kettlebell Press | POPRAWKI | `kbp.setup` „Kettlebell przy barku, oparty o przedramię; łokieć blisko żeber.” — „oparty o przedramię” ma jedno przeczytane źródło: ACE 395 (bell resting on the forearm, „The elbow close to the ribs”). Catalyst 855 mówi tylko „at the shoulders… and the arms against the ribs”; NSCA (Human Kinetics) odsyła do pozycji z zarzutu (strona zarzutu 404); StrongFirst i Onnit (sprawdzone) nie opisują oparcia. Poprawka: PL „Kettlebell przy barku, łokieć blisko żeber.” / EN „Kettlebell at your shoulder, elbow close to your ribs.” Reszta karty potwierdzona: NSCA Upward Movement „Do not allow the spine to flex laterally during the upward movement.”; StrongFirst „When Things Get Heavy” pkt 5 (side lean); ACE 395 „Pull the right elbow back down to the rib cage to lower the weight.” |
| Kettlebell Seated Press | POPRAWKI | To samo zdanie `kbp.setup` (wspólny klucz) — poprawka jak wyżej. Uproszczenie „siedząco = stojąco dla górnej części ciała” potwierdzam: ISSA Seated Variations wymienia seated kettlebell press i „The upper body form is very similar in the seated overhead press to the standing version of the lift.” |
| Band Shoulder Press | wyswietlana | ColumbiaDoctors (columbiadoctors.org/…/shoulder-press/) pkt 2–6: „If you're standing, pass it under your feet.”; „Hold one side of the band in each hand.”; „Slowly press your arms straight up over your head.” Bodylastics (Start and Finish / Movement): „stand on the bands with your front foot and hold a handle in each hand”; „Lower back to the goal post position under control.” Łuk: ISSA wstęp obejmuje „resistance band variations” + Bodylastics „Keep your back straight”. Uwaga niska (tłumacz): `ohp.tall` „ciężar idzie prosto w górę” przy gumie. |
| Single Arm Overhead Press (hantel) | wyswietlana | ACE 395 (start stojąc, ciężar przy barku, „press the right arm straight overhead”); ColumbiaDoctors (stojąc, dłonie przy barkach, „you can use small weights… dumbbells”); NSCA Downward Movement „Allow the kettlebell to lower slowly and under control back to the starting position”. Uproszczenie „wariant sprzętu kettlebell → hantel” potwierdzam jako recenzent: tor ręki i powrót do barku ten sam, różni się tylko chwyt. Przechył: NSCA + StrongFirst. |
| Ab Wheel | wyswietlana | Echelon Ab Wheel Exercise Guide (PDF s. 1, AB ROLL): START „Kneel on floor, grasp handles and straighten arms slightly in front of shoulders with wheel in front of knees.”; FINISH „Slowly roll wheel forward…”, „Slowly return to start position”. Catalyst 135: „Hold an ab-wheel or barbell with rotating sleeves with straight arms”, kółko blisko kolan. |
| Renegade Row | wyswietlana | ACE 355 Preparation: „one hand directly under each shoulder”, „the legs straight out behind about shoulder-width apart”; BarBend: „Set your feet wider than shoulder-width” — tekst „na szerokość barków lub szerzej” obejmuje oba. Błąd skrętu: BarBend „Twisting Your Body” — „Try your best to minimize any side-to-side movement.”; NASM Best Abs, Renegade Row: „Allowing the hips to shift excessively from side to side.” |
| Rollout (sztanga) | wyswietlana | ACE 309 (Roll Out): „kneel down facing the bar”; „Keep the hips pressed forward and the back straight allowing the barbell to roll away from the body.” Catalyst 135: „avoid hyperextension of the lower back”, wytaczanie „as straight and close to the ground as possible”. |
| Incline Chest Fly (hantle) | wyswietlana | NFPT (nfpt.com/how-to-do-incline-bench-dumbbell-flyes/): „With your elbows slightly bent… lower the dumbbells out to the side”; „Avoid locking out your elbows after you have raised the dumbbells.” BarBend (dumbbell-flye-variations, Incline): „Maintain a slight bend in your elbows.”; „Use a motion like you were hugging a tree rather than pressing them straight up.” `dfly.move` „do rozciągnięcia klatki” — BarBend „until you get a big stretch in your chest”. |
| Chest Dip | wyswietlana | ISSA (chest-dips…): „Position your body so that your feet are off the ground and arms are straight.”; „The most common mistakes during dips are going too low, not going low enough, leaning back, and going too fast.” BarBend (barbend.com/dips/): „nearly vertical, with perhaps a slight lean forward”; Letting Your Chest Sink: „if you lean too far forward…”. |
| Seated Cable Chest Press | wyswietlana | ACE 165 (wyciąg siedząc z oparciem): „Sit with your back firmly supported against the backrest.”; „Continue pressing until your elbows are fully extended, but not locked.” NASM Chest Press Machine: „Locking out elbows at the top…”, „Jerky or uncontrolled movements…”; „position your shoulders back and down”. Uproszczenie maszyna ↔ wyciąg potwierdzam. |
| Decline Push Up | wyswietlana | NASM Decline Push Up: „Place your feet on an elevated surface such as a bench, step, or platform.”; Common Mistakes „Allowing hips to sag…”. Fitness Volt (?p=75039): „With your body in a straight line and butt lifted”; „Lower yourself as far down as you can…”. |
| Suspended Push-Up | wyswietlana | TRX (trxtraining.com/blogs/news/trx-push-up) kroki 4, 7, 9: „Walk your feet back… to create an inclined body angle”; „lower your chest towards the handles”. Fitness Volt (suspension-chest-press) krok 3: „Keep your arms fully extended and lean your weight forward onto the straps”; Pro tip „Avoid flaring your elbows too wide…”. Figura v2: tułów pod skosem („pochylenieTulowia” 50,4). |

Dodatkowo (nie karta): `obliques.side_hold` w `role-miesni.json` — S29 NFPT „The obliques act to resist motion and maintain a proper hip and core position” i S30 NASM Side Plank „training the obliques, transverse abdominis, and other muscles responsible for lateral trunk stability” — potwierdzone.

## Runda 2, 08.11.2026 (commit fbc2c450)

Przejrzane nowe brzmienie (PL/EN) 14 kluczy: press.mis.lock, kbp.move, kbp.setup, band.ohpSetup, band.ohpMove, ohp.mis.flare, arnold.together, rollout.wheel.move, rollout.bar.move, rollout.mis.arch, push.mis.sag, spush.setup, spush.move, cpress.seated.

| Klucz | Ocena |
|---|---|
| kbp.setup „Kettlebell przy barku, łokieć blisko żeber.” | OK — ACE 395 („The elbow close to the ribs”) + Catalyst 855 („at the shoulders… and the arms against the ribs”). Poprawka z rundy 1 wdrożona. |
| kbp.move „…opuść go z powrotem do barku, ściągając łokieć do żeber.” | OK — ACE 395 „Pull the right elbow back down to the rib cage to lower the weight.”; NSCA Downward Movement „lower slowly and under control back to the starting position” (start = przy barku); Catalyst „Lower under control by reversing the motion” (start: ramiona przy żebrach). Nie twierdzi więcej. |
| band.ohpSetup „…unieś dłonie do wysokości barków.” | POPRAWKA — ColumbiaDoctors pkt 4: „Your hands will be near your shoulders”; Bodylastics Start: „raise your arms to a goal post position, upper arms parallel and forearms perpendicular to the floor” — łokcie na wysokości barków, dłonie wyżej. Część wspólna: dłonie w okolicy barków, łokcie ugięte. Miejsce w danych (`cues.json:19049` „handles at shoulder level”) nie oddawało strony. |
| band.ohpMove „…potem powoli wróć do barków.” | POPRAWKA — Bodylastics: „Lower back to the goal post position under control.”; ColumbiaDoctors: „Slowly return to your starting position.” → „wróć do pozycji startowej”. |
| spush.setup „Chwyć uchwyty taśm albo kółka…” | POPRAWKA — „albo kółka / or rings”: żadne z dwóch źródeł (TRX, Fitness Volt) nie mówi o kółkach gimnastycznych; w danych brak pola „uproszczenie”. |
| spush.move „Opuść klatkę w stronę dłoni…” | OK — TRX krok 7 „lower your chest towards the handles”; FV krok 5 „lower your chest down between the straps”. |
| press.mis.lock „Gwałtowne blokowanie łokci na końcu ruchu.” | OK — źródła mówią szerzej (NASM „Locking out elbows at the top”, ACE „fully extended, but not locked”); „gwałtowne” zawęża, nie twierdzi więcej; spójne z ohp.mis.lock. |
| ohp.mis.flare, arnold.together, rollout.wheel.move, rollout.bar.move, rollout.mis.arch, push.mis.sag, cpress.seated | OK — zmiany stylistyczne, treść bez zmian; PL = EN. |

Werdykty rundy 2: Kettlebell Press i Kettlebell Seated Press — wyswietlana; Band Shoulder Press i Suspended Push-Up — POPRAWKI (jak w tabeli); pozostałe 10 — wyswietlana.

### Uwagi niskie — ocena

- `ohp.tall` „ciężar” przy gumie (wspólny klucz): NISKIE → backlog (tłumacz/recenzent lokalizacji). Nie jest błędnym twierdzeniem merytorycznym — kierunek ruchu zgodny ze źródłami; tylko słowo.
- Brak „usiądź” w ustawieniu Seated Barbell Military Press (`ohp.bbGrip` wspólny): NISKIE → backlog. Niekompletność, nie błąd.
- Żadna z nich nie blokuje (próg: blokują tylko błędne liczby/twierdzenia).

## Runda 3, 08.11.2026 (commit 54bcfd4f)

| Klucz / dane | Nowe brzmienie | Ocena |
|---|---|---|
| band.ohpSetup | PL „Stań na gumie, chwyć jej końce i unieś dłonie w okolice barków, łokcie ugięte.” / EN „Stand on the band, grab both ends and raise your hands to about shoulder level, elbows bent.” | OK — część wspólna ColumbiaDoctors („hands near your shoulders”, „elbows bent”) i Bodylastics (pozycja „goal post”). PL = EN. |
| band.ohpMove | PL „Wypchnij dłonie nad głowę, potem powoli wróć do pozycji startowej.” / EN „Press your hands overhead, then slowly return to the start position.” | OK — ColumbiaDoctors „Slowly return to your starting position.”; Bodylastics „Lower back to the goal post position under control.” |
| cues.json:19049, 19064 (Bodylastics) | „goal post position: upper arms parallel, forearms perpendicular to the floor”; „lower back to the goal post position under control” | OK — zgodne z przeczytaną stroną. |
| spush.setup | PL „Chwyć uchwyty taśm, ręce wyprostowane przed sobą; pochyl się do przodu, ciało proste i pod skosem.” / EN „Hold the strap handles with straight arms in front of you; lean forward with your body straight and at an angle.” | OK — „kółka” usunięte; TRX kroki 3–6 + FV krok 3. |

Werdykty rundy 3: **Band Shoulder Press — wyswietlana; Suspended Push-Up — wyswietlana.** Stan końcowy: 14/14 kart „wyswietlana”. Uwagi niskie (ohp.tall, siad w Seated Barbell Military Press) — backlog, nie blokują.

## Otwarte

- [OTWARTE] (opcjonalne) „kettlebell oparty o przedramię” — gdyby wracać do tego zdania, potrzebne drugie przeczytane źródło (strona HK `one-arm-kettlebell-clean` zwraca 404).

## JSON do sekcji „karty” (`docs/research/figury-recenzja.json`) — finalny, po rundzie 3

Pole `sha` pominięte — wpisuje koordynator: `node scripts/zrodla-runtime.mjs --skroty` → `.karty["<ćwiczenie>"]` (funkcja `kartaSkrot`, `scripts/zrodla-runtime.mjs:78–82`; strażnik `tests/karty-recenzja.test.tsx:39, 53, 59, 63`), liczone na drzewie z commitem 54bcfd4f.

```json
{
  "Arnold Press": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Seated Barbell Military Press": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026", "uwagi": "Niska, backlog: ustawienie (ohp.bbGrip, wspólny) bez słowa o siadzie." },
  "Kettlebell Press": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f; kbp.setup poprawione w fbc2c450), 08.11.2026" },
  "Kettlebell Seated Press": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026; uproszczenie siedząco = stojąco potwierdzone" },
  "Band Shoulder Press": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f; band.ohpSetup/ohpMove poprawione), 08.11.2026", "uwagi": "Niska, backlog: ohp.tall (wspólny) — słowo „ciężar” przy gumie." },
  "Single Arm Overhead Press (hantel)": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026; uproszczenie kettlebell → hantel potwierdzone" },
  "Ab Wheel": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Renegade Row": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Rollout (sztanga)": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Incline Chest Fly (hantle)": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Chest Dip": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Seated Cable Chest Press": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026; uproszczenie maszyna ↔ wyciąg potwierdzone" },
  "Decline Push Up": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f), 08.11.2026" },
  "Suspended Push-Up": { "werdykt": "wyswietlana", "data": "2026-11-08", "stan": "zrecenzowana niezależnie — wyświetlana (bramka 4, treść karty)", "autor": "programista A1", "recenzent": "badacz-merytoryczny", "kto": "badacz-merytoryczny — recenzja niezależna treści karty, partia A1, runda 3 (54bcfd4f; spush.setup bez „kółek”), 08.11.2026" }
}
```
