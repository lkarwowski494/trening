# Recenzja niezależna rodziny v2 `kb_ballistic`, runda r3. Audytor, 10.11.2026

**Werdykt rodziny: do poprawy** (2 × WYSOKIE, 2 × ŚREDNIE, 4 × NISKIE). Recenzent: audytor. Nie pisałem tej rodziny ani poprawek (L-047). Autor: programista partii 1.

## Metoda
- SHA `b7cb1dcd` (figury/partia-1, scalenie poprawek; poprawki autora `a01d024b` + `818c31f5`, baza diffu testów `a01d024b^`), N = 3. Czysta kopia `git archive b7cb1dcd` → `/home/user/rev-p1/kb_ballistic-r3` (node_modules jako dowiązanie). Rodzina jest `planned`, więc **w kopii** (nie w repo) ustawiłem `status: 'ready'` w `lib/figures/v2/families.ts:42`. Bez tego `figureSpec` zwraca null i 21 testów p1 jest czerwonych. W kopii uruchomiłem `node scripts/zrodla-runtime.mjs --skroty`.
- Do porównania (skok dzwonu przed poprawką) zrobiłem drugą kopię `c92df2c9` → `/home/user/rev-p1/kb-c92`, też z `ready` tylko w kopii.
- Zakres poprawek: zmieniło się 7 póz (Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel), One-Arm Kettlebell Clean and Jerk). Pozostałe 9 póz jest bajt w bajt jak w `c92df2c9`. `overlay/kb_ballistic.ts` i zestawy rodziny są bez zmian (zmiana w `cue-sets.json` to `ohp.seat` z innej rodziny).
- Arkusze (45 PNG, wszystkie w `/home/user/rev-p1/kb_ballistic-r3/arkusze/`):
  - `slad/`: 16 ćwiczeń, side, motyw jasny;
  - `slad-dark/`: Kettlebell Clean, Kettlebell Snatch, Snatch (hantel);
  - `slad48/`: kadry co 1/48, u = 0,083–0,667, faza przyspieszenia; Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel), Kettlebell Clean;
  - `slad48-dark/`: Kettlebell Snatch, Snatch (hantel), co 1/48;
  - `flip/` i `flip-sn/`: co 1/96–1/200 wokół przewrotu dzwonu (Kettlebell Clean u = 0,74–0,79; Kettlebell Snatch u = 0,68–0,73);
  - `nakladka/`: 18 arkuszy.
- W pełnej rozdzielczości obejrzałem: `slad48/Kettlebell-Snatch-side.png`, `slad/Snatch-hantel-side.png`, `slad48/Snatch-hantel-side.png`, `slad48-dark/Snatch-hantel-side.png`, `slad/Kettlebell-Clean-side.png`, `flip/Kettlebell-Clean-side.png`, `flip-sn/Kettlebell-Snatch-side.png`.
- Liczby policzyłem jednorazowymi skryptami w `/home/user/rev-p1/tools-r3/` (poza repo), na `frameAt`, `jointAngles`, `odstepCiezaru` i `equipColliders`, co 1/48 i 1/96. Skrypty: `m.mjs` (stawy, odstęp, skok), `v.mjs` (prędkość śladu), `bell.mjs` i `bellxy.mjs` (środek dzwonu), `toe.mjs` i `toex.mjs` (poślizg palców), `start.mjs`.
- Testy w kopii: `figures-v2-kb-ballistic-p1` + `figury-recenzja-p4a`: 144/145 (czerwony tylko p4a „wzdluz_gora”, opis niżej); `figures-v2-tor`: 198/198.

## Weryfikacja deklaracji autora (liczone samodzielnie)
| Deklaracja | Pomiar | Stan |
|---|---|---|
| Łokieć przed wyprostem bioder ≤ 20° | Kettlebell Clean maks. 11,8° (u = 0,25, biodro 11°); Kettlebell Snatch 9,4° (biodro 16,3°); Snatch (hantel) 19,6° — dwa razy (u ≈ 0,06 i 0,19), z wyprostem do 0° pomiędzy | spełnione; Snatch (hantel) na granicy, z dwukrotnym „ugięciem i wyprostem” |
| Odstęp ciężaru ≤ 15 cm w ciągu | Kettlebell Clean w ciągu 1,6–3,8 cm, maks. 14,9 cm w u = 0,75 (ugięcie pod rack); rwania 2–7 cm do wysokości barku | spełnione (W1-r2 b naprawione) |
| Snatch (hantel) z podłogi | spód hantla 1,7 cm nad podłogą (u = 0) | spełnione |
| Biodro ≤ 15° przy u 0,15–0,30 | Kettlebell Snatch biodro 7,2° od u = 0,208; Kettlebell Clean 11° w u = 0,25 | spełnione |

## Znaleziska

| # | Poziom | Pewność | Realność | Ćwiczenie, widok, kadr | Miara | Kierunek naprawy |
|---|---|---|---|---|---|---|
| W1-r3 | WYSOKIE | 85% | realny (każde odtworzenie) | Kettlebell Snatch, Double Kettlebell Snatch, Snatch (hantel); ten sam wzór w Kettlebell Clean, Double Kettlebell Clean, Dumbbell Clean, One-Arm Kettlebell Clean and Jerk; side | **Przestój po wyproście bioder i nagłe ponowne przyspieszenie.** Prędkość śladu w cm na 1/48 (rwanie 2500 ms, więc 1/48 ≈ 52 ms). Kettlebell Snatch: 5,6 przy wyproście (u = 0,208), potem **1,7 przez 11 kadrów** (u = 0,23–0,44, ok. 0,57 s, 0,33 m/s). Potem 4,4 → 6,7 (×4 w dwóch kadrach), a na górze 6,2 → **1,2** (×5 w jednym kadrze, u = 0,79) i powolne dociśnięcie łokcia 74° → 9° przez 0,55 s z ugięciem kolan. Snatch (hantel): 7,2 → 2,7 → **2,3 przez 14 kadrów** (u = 0,31–0,58) → 6,8 → 8,1, na górze 8,1 → 1,6. Double Kettlebell Snatch: 6,2 → 2,7 (8 kadrów) → 6,2 → 1,1. Zarzuty: Kettlebell Clean 4,5 → **1,0 przez 12 kadrów** → 3,0; Dumbbell Clean 1,1 → 3,3; Clean and Jerk 7,9 → 2,5 (10 kadrów) → 4,5 → 8,2. Dla porównania przyjęte rwania olympic: stosunek prędkości sąsiednich kadrów ≤ 2,2 (Power Snatch, Muscle Snatch); tu 3–5. Na arkuszu `slad48/Kettlebell-Snatch-side.png` kadry u = 0,229–0,458 są prawie identyczne (dzwon pełznie przy biodrze), a od 0,479 dzwon wystrzeliwuje. W `slad48/Snatch-hantel-side.png` tak samo przy u = 0,292–0,583. Ruch rozpada się na „wyprost bioder → zatrzymanie → szarpnięcie ręką → dociśnięcie nad głową”. To widoczne szarpnięcie (warunek koordynatora). Merytorycznie pokazuje też ciąg ręką zamiast pędu z bioder (karta Swingu „Siła idzie z bioder … ręce tylko prowadzą”; karta Snatch (hantel) „mocno wyprostuj biodra i kolana, a potem poprowadź hantel w górę”). Dociskanie łokcia nad głową to typowy błąd rwania. | Rozłożyć czas klatek kluczowych (`u`) tak, żeby prędkość ciężaru była największa tuż po wyproście bioder i potem malała aż do zablokowania nad głową lub racka. Bez fazy pełzania i bez ponownego przyspieszenia. Łokieć prostuje się w chwili, gdy ciężar dochodzi nad głowę, nie po zatrzymaniu. Test: w ciągu i wyrzucie stosunek prędkości śladu w sąsiednich kadrach 1/48 ≤ ok. 2,2 (jak olympic); po wyproście bioder brak segmentu o prędkości < 50% poprzedniej, po którym prędkość znowu rośnie; przypadek negatywny na danych `b7cb1dcd`. |
| W2-r3 | WYSOKIE | 85% | realny (pierwsza klatka każdego powtórzenia) | Snatch (hantel), side, u = 0 | **Start nie „jak do martwego ciągu”.** Tułów dokładnie poziomo (0° nad poziomem), miednica 24 cm nad kolanami, biodro 131°, kolano 77°, bark 33 cm przed kostką i 15 cm przed hantlem, hantel nad linią palców (17,4 cm przed kostką, palce 18,1). W tej samej aplikacji Deadlift (hantle): tułów 32°, bark 8 cm przed kostką. Karta: „Postaw hantel między stopami; zejdź jak do martwego ciągu — plecy proste, **klatka uniesiona**”. Na rysunku klatka jest skierowana w podłogę (`slad/Snatch-hantel-side.png`, u = 0–0,10). W pierwszym ciągu łokieć dwa razy zgina się do 19,6° i prostuje (u = 0,02–0,21), co daje wynik „równo 20°” bez marginesu (ryzyko autora). | Start jak w Deadlift (hantle): tułów ok. 30–45°, bark nad hantlem lub tuż przed nim, hantel nad środkiem stopy (między stopami), ręka prosta przez cały pierwszy ciąg. Test: kąt tułowia w u = 0 ≥ ok. 25° oraz hantel nie dalej niż ok. 8 cm przed kostką. Liczby do potwierdzenia przez badacza; kierunek wynika z karty. |
| Ś1-r3 | ŚREDNIE | 85% | realny | Kettlebell Clean, Double Kettlebell Clean, One-Arm Kettlebell Clean and Jerk; side; przewrót do racka | **Przeskok dzwonu przy przewrocie.** Środek dzwonu w rzucie z boku przesuwa się o 14,6 cm w 1/96 (Kettlebell Clean u = 0,771, faza 1000 ms, czyli ok. 10 ms — jedna klatka ekranu), 11,7 cm (Double Clean) i 17,0 cm (Clean and Jerk, u = 0,469). Kierunek dzwonu zmienia się o ok. 80–110° skokowo (`flip/Kettlebell-Clean-side.png`, u = 0,760 → 0,771). Ślad (rączka) jest ciągły, więc test toru tego nie widzi. Błąd był już w `c92df2c9` (12,7 / – / 17,3 cm), nie zgłosiły go r1 ani r2. W rwaniach przewrót nad głową trwa ok. 25 ms (6,9 cm na 1/96), do przyjęcia. | Obrót dzwonu wokół dłoni rozłożyć na kilka kadrów (ok. 80–120 ms), np. interpolacja kierunku `dir` po łuku. Test: skok środka ciężaru (nie tylko rączki) ≤ limit ciągłości kontraktu na 1/48. |
| Ś2-r3 | ŚREDNIE | 82% | realny | Bottoms-Up Clean From The Hang Position, side, u = 0,06–0,5 | Ten sam wzór co W1-r2 (poza bez zmian od r1): łokieć 21,6° przy biodrze 65°, 46,5° przy 48°, 61° przy 37°, a odstęp ciężaru od ciała 16–20 cm (u = 0,25–0,6). Ćwiczenie nie ma własnej karty (zestaw `oly`: „Na starcie plecy proste…”), więc nie ma sprzeczności z tekstem. Dlatego ŚREDNIE, nie WYSOKIE. Rodzina jest jednak niespójna: po poprawce W1-r2 inne zarzuty ciągną po wyproście bioder. | Przy poprawce W1-r3 objąć Bottoms-Up tym samym ciągiem (ręka prosta do wyprostu bioder, potem ciężar blisko ciała, dzwon dnem do góry). Albo, jeśli badacz potwierdzi, że wariant z zawisu jest wolniejszy i bardziej ciągnięty, zapisać wyjątek z powodem. Backlog 1.1, jeśli nie razem z W1-r3. |
| N1-r3 | NISKIE | 90% | teoretyczny lub brzegowy | strażnik R6 (`tests/figury-mobilnosc-reguly.test.ts:163`), 9 ćwiczeń | Ocena per ćwiczenie w sekcji „R6” niżej. 6 ćwiczeń to przesuw całej stopy w osi z (pięta i palce razem, pięta płasko), niewidoczny w jedynym widoku side. 3 ćwiczenia mają mały widoczny poślizg. | Poprawka póz (stały rozstaw stóp w generatorze; obrót wspięcia wokół palców; lądowanie stopy bez poślizgu), nie podnoszenie zapadki. |
| N2-r3 | NISKIE | 90% | teoretyczny (test) | `tests/figury-recenzja-p4a.test.ts:117` | Test „wzdluz_gora” porównuje wysokość startu Bottoms-Up (z zawisu, 53,1 cm) ze startem Kettlebell Clean, zakładając, że Clean startuje „przy podłodze”. Od r1 (`4e1a5d7e`) Kettlebell Clean startuje z zamachu za kostkami, 56,1 cm. Rysunek Bottoms-Up jest zgodny z „hang” (chwyt 24 cm przed kostką, na wysokości kolan). **Test jest nieaktualny, to nie wada rysunku.** | Zmienić punkt odniesienia (np. chwyt w u = 0 ≥ wysokość kolana − kilka cm, albo porównanie z Snatch (hantel) z podłogi) z datą i powodem. |
| N3-r3 | NISKIE | 90% | teoretyczny (dane testu) | `tests/tor-wyjatki.json:32-38,45` | Opisy i pomiary 7 ćwiczeń są sprzed W1-r2. Snatch (hantel): „zawis między nogami” (teraz start z podłogi). Wszystkie: „wysunięcie chwytu przed bark ≤ 33 cm, test p1” — tego testu już nie ma. Liczby 29,0 / 40,2 cm są z 09.11. | Przeliczyć pomiary i opisać ruch po poprawce W1-r3. |
| N4-r3 | NISKIE | 85% | realny, mało widoczne | Kettlebell Clean, side, u = 0,583–0,604 | Dzwon wchodzi w tułów: odstęp −0,4 i −1,2 cm (> TOL.pen 0,3) tuż przed rackiem. | Przy W1-r3 lub Ś1-r3 dzwon po zewnętrznej stronie przedramienia. Test styku `stykKlatki` w przedziale racka. |

**Bez zgłoszenia** (pewność < 80%, do badacza):
- Rwania kończą w u = 1 w ugięciu (kolano 28°) i bez wstania. Ryzyko autora; nadal otwarte.
- Wspięcie na palce w rwaniu (kostka do −34° przy u = 0,6–0,7).
- Snatch (hantel) przechodzi łukiem ok. 28 cm przed barkiem na wysokości twarzy (u = 0,70–0,75, odstęp 24–28 cm). Poza oknem testu ciągu.

## Ciągłość rwań (warunek koordynatora, pole `ciaglosc_rwan`)
- **Przeskok położenia: brak.** Największy skok śladu na 1/48: Kettlebell Snatch 6,7 cm, Double Kettlebell Snatch 6,3 cm, Snatch (hantel) 8,1 cm. Limit dynamiczny to 16 cm; przyjęte Power Snatch (olympic) ma 8,0 cm. Przewrót dzwonu nad głową trwa ok. 25 ms (6,9 cm na 1/96 w rzucie z boku) i na `flip-sn/Kettlebell-Snatch-side.png` przebiega przez kadry pośrednie. Wpis rwań do „dynamicznych” (limit 16 cm) jest uzasadniony skalą drogi i nie ukrywa przeskoku.
- **Szarpnięcie: tak, widoczne (W1-r3, WYSOKIE).** Prędkość jest stała w odcinkach i zmienia się skokowo. Wyprost bioder → pełzanie 0,33–0,44 m/s przez 0,4–0,7 s → przyspieszenie ×3–4 w jednym kadrze 1/48 → zatrzymanie ×5 w jednym kadrze → wolne dociśnięcie łokcia. Obejrzane: `slad48/` (oba motywy dla Kettlebell Snatch i Snatch (hantel); Double Kettlebell Snatch w motywie jasnym), kadry co 1/48 w u = 0,083–0,667.

## R6 — poślizg palców (dodatkowy punkt koordynatora)
Pomiar własny (`toe.mjs`, siatka 1/200, palce ≤ 0,3 cm nad podłogą). Dziś trafień jest 9, nie 8: na liście koordynatora jest 9 nazw. Rzut z boku pokazuje tylko x i y (`lib/figures/v2/draw.ts:28`, `side → [p[0], p[1]]`).

| Ćwiczenie | Poślizg (R6) | Składowa x (widoczna) | Co się dzieje | Ocena |
|---|---|---|---|---|
| One-Arm Kettlebell Swings | 7,0 | 0 | pięta płasko; obie stopy przesuwają się w osi z (rozstaw 32,9 → 25,9 cm) przez całe powtórzenie | artefakt danych, niewidoczny |
| Kettlebell Clean | 7,0 | 0 | jak wyżej, u = 0,15–0,30 (rozstaw pięt 25,1 → 18,1) | artefakt, niewidoczny |
| Double Kettlebell Clean | 3,9 | 0 | jak wyżej | artefakt, niewidoczny |
| Kettlebell Snatch | 7,5 | 0,4 | jak wyżej, u = 0–0,33 | artefakt, niewidoczny |
| Double Kettlebell Snatch | 4,0 | 0,4 | jak wyżej | artefakt, niewidoczny |
| Snatch (hantel) | 8,0 | 0,4 | rozstaw 23,9 → 31,1 cm (u = 0–0,25), potem z powrotem 25,9 w 0,05 | artefakt, niewidoczny |
| One-Arm Kettlebell Split Jerk | 6,9 (R) | 6,9 | przednia stopa dotyka podłogi (palce ≤ 0,3 cm) w u ≈ 0,935 i jeszcze sunie 7 cm do przodu, pięta opada | widoczne „ślizgnięcie” przy lądowaniu wykroku, NISKIE |
| Kettlebell Sumo High Pull | 5,2 | 3,8 | przy wspięciu na palce (u = 0,65–0,92) palce cofają się 3,8 cm i wchodzą 0,2 cm pod podłogę; obrót nie wokół palców | mały widoczny poślizg, NISKIE |
| One-Arm Kettlebell Clean and Jerk | 9,1 (z) / 7,3 (x, R) | 7,3 | rozstaw w z (niewidoczny) i lądowanie przedniej stopy jak w Split Jerk | lądowanie NISKIE, reszta artefakt |

Wspięcie na palce samo nie daje trafień: w rwaniach składowa x to 0,4 cm. Trafienia nie są artefaktem reguły przy wspięciu. To prawdziwy przesuw stóp w danych: w 6 ćwiczeniach w osi niewidocznej, w 3 mały, widoczny.

**Rekomendacja: poprawka póz** razem z W1-r3. Generator i tak przelicza te 7 ćwiczeń, a stały rozstaw stóp w całym powtórzeniu jest tani. Do tego obrót wspięcia wokół palców (Sumo) i stopa wykroku stawiana bez poślizgu (Split Jerk, Clean and Jerk). Zapadkę podnieść (4 → 9) tylko jako stan przejściowy, z opisem: „BRZEGOWE: 6 ćwiczeń — przesuw stóp w osi z (zmiana rozstawu między klatkami kluczowymi), niewidoczny w rzucie z boku; 3 — poślizg 3,8–7,3 cm przy wspięciu (Sumo) i lądowaniu wykroku (Split Jerk, Clean and Jerk); do poprawy w rodzinie kb_ballistic (recenzja r3 10.11.2026)”.

## Uwagi do testów (K14, `git diff a01d024b^..b7cb1dcd -- tests/`, pliki rodziny)
| Zmiana | Ocena |
|---|---|
| usunięty próg `wysuniecie ≤ 33 cm` i przypadki negatywne na stałych | uzasadnione (zamyka W1-r2 i N1-r2) |
| nowe miary na danych: łokieć ≤ 20° przed wyprostem bioder (≤ 15°), odstęp ≤ 15 cm (`stykKlatki`) w oknie chwyt < bark i u < 0,8; przypadki negatywne na fixture `kb-ballistic-przed-w1r2.json` (= pozy `c92df2c9`) | uzasadnione, zaostrzenie. Okno u < 0,8 jest arbitralne, ale łuk nad barkiem i tak leży poza miarą „ciągu” |
| start Snatch (hantel): próg chwyt − kostka ≤ `BODY.toeFwd` zamiast ≤ 0 | **poluzowanie, częściowo uzasadnione** (hantel z podłogi nie może leżeć za kostkami jak kettlebell w zamachu). Dopuszcza jednak hantel nad samymi palcami, co składa się na W2-r3. Lepszy próg to środek stopy (ok. ≤ 8 cm) |
| spód hantla ≤ 5 cm w u = 0 (z przypadkiem negatywnym na danych) | uzasadnione |
| rwania w `DYNAMICZNE` (skok ≤ 3 × 16 = 48 cm na 0,05) | uzasadnione przez dane sensu, ale bardzo luźne (pomiar ≤ 8,1 cm na 1/48). Test nie łapie szarpnięcia (W1-r3) ani skoku dzwonu (Ś1-r3). Dodać miarę stosunku prędkości i skoku środka ciężaru |
| p4a: nowe skróty 10 póz kb_ballistic z opisem i datą | uzasadnione (zmiana celowa) |
| zgodność wsteczna: nowe złote odciski 7 póz | uzasadnione |
| p4a „wzdluz_gora” czerwony | nieaktualny test (N2-r3), nie wada rysunku |

## Nakładka (K9)
`overlay/kb_ballistic.ts` bez zmian od r2. Elementy są tylko przy Swing, One-Arm Swings i Sumo, a ich pozy są bajt w bajt jak w r2. 18 arkuszy wygenerowałem (`arkusze/nakladka/`), ocena z r2 bez zmian. Bez znalezisk.

## Zestawy ogólne (K12) i karty (K10, K11)
- Zestaw `oly` („Na starcie plecy proste, klatka do góry.”) przy Kettlebell Clean, Kettlebell Snatch, Double Kettlebell Snatch, Dumbbell Clean i One-Arm Kettlebell Clean and Jerk: tekst zgadza się z rysunkiem startu (tułów 28° nad poziomem, kręgosłup prosty). Ruch tych ćwiczeń jest jednak do poprawy (W1-r3), więc **bez wpisu „zestawy”**. Skrót z `--skroty` dla nich wszystkich: `20c8125fdfa2` (zapisany do kolejnej rundy, nie do JSON).
- Kettlebell Swing (karta własna): ruch bez zmian od r1, karta zgodna. Skrót `aa1b9306d7dd` (`--skroty`). Zlecenie wiąże wpis z czystą oceną, a rodzina ma WYSOKIE, więc **bez nowego wpisu**. Ocena r2 („wyswietlana”) pozostaje ważna.
- Karta Snatch (hantel): sprzeczna z rysunkiem w starcie („klatka uniesiona”, W2-r3) i w przebiegu („mocno wyprostuj biodra… a potem poprowadź”, W1-r3). Karta Double Kettlebell Clean („po wyproście bioder przyciągnij je blisko ciała”): kolejność i odstęp są teraz zgodne, sprzeczność została tylko w tempie (W1-r3).
- K10: v1 Kettlebell Swing (`a7fcbadd5b3f`) **zostaje „wyswietlana”**. Rodzina v2 nie dostaje werdyktu „wyswietlana”, więc nie ma „zastapiona”.
- `sha` rodziny z `--skroty` (kopia z `ready`): `a8ebd557e8c7`. **Nie wpisuję go do JSON**, bo werdykt to „do poprawy”.

## Tabela ćwiczeń
| Ćwiczenie | Werdykt | Uwagi |
|---|---|---|
| Kettlebell Swing | wyswietlana | bez zmian od r1 |
| One-Arm Kettlebell Swings | wyswietlana | bez zmian; R6 — przesuw w osi z, niewidoczny (N1-r3) |
| Kettlebell Clean | do poprawy | W1-r3 (1,0 cm na 1/48 przez 12 kadrów, potem 3,0); Ś1-r3 (dzwon 14,6 cm w 1/96); N4-r3 |
| Double Kettlebell Clean | do poprawy | W1-r3 (słabiej: 4,3 → 1,5 → 2,6); Ś1-r3 (11,7 cm) |
| Dumbbell Clean | do poprawy | W1-r3 (1,1 → 3,3) |
| Bottoms-Up Clean From The Hang Position | wyswietlana | Ś2-r3 (backlog albo razem z W1-r3); test p4a nieaktualny (N2-r3) |
| Kettlebell Snatch | do poprawy | W1-r3 |
| Double Kettlebell Snatch | do poprawy | W1-r3 |
| Snatch (hantel) | do poprawy | W1-r3, W2-r3 |
| Double Kettlebell Push Press | wyswietlana | bez zmian |
| Double Kettlebell Jerk | wyswietlana | bez zmian |
| One-Arm Kettlebell Push Press | wyswietlana | bez zmian |
| One-Arm Kettlebell Jerk | wyswietlana | bez zmian |
| One-Arm Kettlebell Split Jerk | wyswietlana | R6 — lądowanie przedniej stopy z poślizgiem 6,9 cm (N1-r3) |
| Kettlebell Sumo High Pull | wyswietlana | R6 — 3,8 cm przy wspięciu (N1-r3) |
| One-Arm Kettlebell Clean and Jerk | do poprawy | W1-r3, Ś1-r3 (17,0 cm) |
| Kettlebell Pirate Ships | bez rysunku | N4 z r1 otwarte (bez wpisu w figury-wyjatki.json), ocena bez zmian |

## Obszary bez znalezisk
- Ślad w chwycie (test p1, ≤ 3 cm).
- Przeskok położenia śladu (≤ 8,1 cm na 1/48).
- Kolejność łokieć/biodro i odstęp w ciągu (W1-r2 naprawione).
- Start z podłogi w Snatch (hantel) (spód 1,7 cm).
- Motyw ciemny (kontrast figury, hantla i śladu).
- Nakładka.
- Orientacja hantla: oś poprzeczna na starcie i nad głową, obrót w ciągu.
