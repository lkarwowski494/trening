# pushup_plank (cz. 3, druga runda W2) — wskazówki techniki (badacz-merytoryczny, 02.11.2026)

Zakres: ćwiczenia, których pierwsza runda W2 (`pushup_plank-cz1.md`, `-cz2.md`) nie zbadała. Zasady: wyjątek dla wskazówek techniki z CLAUDE.md
(2 niezależne źródła szczebla ≤ 4 albo jedno przeczytane szczebla 3, gdy żadne przeczytane nie przeczy); szczeble wg
`szczeble-organizacji-2026-11-02.md` (uzup. 1–3) i rozstrzygnięć koordynatora 1.1 w przeliczeniu G5 (szczebel daje konkretna strona).
Strony przeczytane narzędziem 02.11.2026; miejsce podane przy odwołaniu. Liczb (kąty, serie) ani ostrzeżeń zdrowotnych nie przenoszę.

## Ćwiczenia

| Ćwiczenie | Rysunek v2 | Stan po W2 cz3 | Uwagi |
|---|---|---|---|
| Suspended Fallout | tak (`poses/pushup_plank.json`, zawieszenie przy dłoniach, tułów pochylony) | **gotowe** (ustawienie + ruch + 2 błędy) | nowa karta: Cleveland Clinic (4) + Cugliari i Boccia 2017 (3) + GoodLife (4 warunkowo); błędy wnioskowane; kierunek ustawienia względem zaczepu pominięty (sprzeczność źródeł — Otwarte 1) |
| Push-Ups With Feet On A Stability Ball | nie | otwarte | ACE #63 „Stability Ball Push-Up” opisuje INNE ćwiczenie (dłonie na piłce, stopy na podłodze) — nie liczy się; strona EliteFTS — 404 |
| Drop Push | nie | otwarte | bez rysunku, bez nowego tropu (W1: Moore 2012 opisuje odwrotny kierunek) — nie badane ponownie |
| Incline Push-Up Depth Jump | nie | otwarte | bez rysunku, bez nowego tropu (W1: tylko bazy ćwiczeń i aplikacje) |
| Plyo Kettlebell Push-Ups | nie | otwarte | j.w. |
| Incline Push-Up Reverse Grip | nie | otwarte | j.w. (W1 bez źródeł) |
| Isometric Wipers | nie | otwarte | j.w. (W1: oba źródła szczebla 5) |

Role mięśni: luka Suspended Fallout (abs@1 → `abs.antilordosis`, `jedno_zrodlo`) jest już w `role-miesni-fala-w2/pushup_plank-cz2.md`;
pozostałe ćwiczenia tej części nie mają luk w W1 → pliku `role-miesni-fala-w2/pushup_plank-cz3.md` nie tworzę. Sprawdziłem, czy
Cugliari 2017 daje drugie źródło funkcji `abs.antilordosis`: NIE — artykuł podaje aktywność EMG i „core stability”, słowa
„extension/anti-extension” nie padają (pełny tekst, Discussion).

### Blok do wdrożenia

```json
{
 "Suspended Fallout": {
  "setup": [
   {"c": "sfall.setup", "s": [["cleveland-suspension-core", "sekcja o fallout: „stand facing away from the anchor with your arms straight out in front of you”"], ["cugliari-2017", "Materials and Methods, opis ćwiczeń po Fig. 2 — Roll-out („inclined standing position while placing each hand on the strap handles”)"]]}
  ],
  "move": [
   {"c": "sfall.move", "s": [["cleveland-suspension-core", "sekcja o fallout: „Raise your arms overhead as you lean forward, keeping your body in a straight line and tension in the straps.”; powrót: „Lower your arms as you return to the starting position”"], ["cugliari-2017", "Materials and Methods — Roll-out („performed a shoulder flexion moving the hands forward”); „maintain a neutral position of the spine and pelvis in each exercise”"], ["goodlife-trx-full-body", "Standing fallout (pochylanie do przodu, ręce w górę do linii ciała, powrót tą samą drogą)"]]}
  ],
  "mistakes": [
   {"c": "push.mis.sag", "s": [["wniosek", "sfall.move"]]},
   {"c": "rollout.mis.bentArms", "s": [["wniosek", "sfall.move"]]}
  ]
 }
}
```

Uwagi do bloku:
- `sfall.setup` nie mówi, czy stać przodem, czy tyłem do zaczepu: Cleveland Clinic „facing away from the anchor”, GoodLife „Start facing
  the anchor” — sprzeczność na szczeblu 4 → zdanie zawiera tylko część wspólną (stoisz, trzymasz uchwyty, ręce przed sobą). Rysunek
  pokazuje zawieszenie przy dłoniach — recenzent figury niech sprawdzi, czy tor taśm nie przesądza kierunku inaczej niż tekst.
- „Ręce wyprostowane” w ustawieniu: wprost Cleveland; Cugliari opisuje ruch wyłącznie jako zgięcie w barku (łokcie bez ruchu) — to nie
  dosłowne „straight arms”, ale nie przeczy. Do oceny recenzenta; jeśli uzna za za słabe, `sfall.setup` traci „wyprostowane”,
  a błąd `rollout.mis.bentArms` trzeba usunąć z karty (karta zostaje z `push.mis.sag`).
- `push.mis.sag` (nowe zdanie z W2 cz1, jeszcze nie w `lib/cues/text/pl.json`) ← zaprzeczenie „ciało w jednej linii” z `sfall.move`
  (Cleveland wprost; Cugliari: neutralny kręgosłup i miednica). Widoczne na rysunku (linia bark–biodro–kostka).
- `rollout.mis.bentArms` (nowe zdanie z W2 cz2) ← zaprzeczenie „proste ręce” z `sfall.move`. Widoczne na rysunku (kąt w łokciu).
  Brzmienie „Zginanie rąk w łokciach zamiast trzymania ich prosto.” pasuje do fallout dosłownie.
- `plank.mis.sag` NIE użyte: dokłada „wygięte w łuk lędźwie” — wprost żadne z przeczytanych źródeł fallout tego nie wymienia
  (wyszukiwarka przypisuje to stronie szczebla 5, nieprzeczytanej).
- `plank.brace` i wskazówka „taśmy cały czas napięte” — pominięte (Otwarte 2).
- Kart częściowych z W1 w tej części brak → brak wpisów „tylko mistakes”.

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| sfall.setup | Stań, chwyć uchwyty taśm, ręce wyprostowane przed sobą. | Stand holding the strap handles, arms straight out in front of you. |
| sfall.move | Pochylaj się do przodu i unoś proste ręce nad głowę, ciało cały czas w jednej linii; wróć tą samą drogą. | Lean forward as you raise your straight arms overhead, keeping your body in one line; come back the same way. |

Zdania z innych części użyte dosłownie (oba jeszcze nie w `pl.json`): `push.mis.sag` (W2 cz1), `rollout.mis.bentArms` (W2 cz2).
Prefiks `sfall.*` — nowy (w `pl.json` brak zdań dla fallout); nazwa wzorem `spush.*` dla pompki na taśmach.

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| cleveland-suspension-core | https://health.clevelandclinic.org/how-a-suspension-trainer-can-make-your-core-workout-more-challenging (ten sam tekst pod https://health.clevelandclinic.org/try-these-ab-workouts-to-strengthen-your-core/) | Cleveland Clinic (szpital); treść firmowana przez Cleveland Clinic, cytowany ekspert Christopher Travers, MS, fizjolog wysiłku; data 18.09.2026 | 4 — uzupełnienie 2: szpitale (Cleveland Clinic wymieniona wprost, `szczeble-organizacji-2026-11-02.md:71`), firmowanie wystarcza | akapit o fallout: „To do a fallout, stand facing away from the anchor with your arms straight out in front of you.” |
| cugliari-2017 | https://pmc.ncbi.nlm.nih.gov/articles/PMC5384053 — Cugliari G, Boccia G. Core Muscle Activation in Suspension Training Exercises. J Hum Kinet. 2017;56:61–71 | recenzowane czasopismo (badanie EMG, 17 aktywnych mężczyzn) | 3 — pojedyncze recenzowane badanie z opisem wykonania | Materials and Methods, lista ćwiczeń po Fig. 2 (Roll-out): „participants assumed an inclined standing position while placing each hand on the strap handles”; Methods: „maintain a neutral position of the spine and pelvis” |
| goodlife-trx-full-body | https://blog.goodlifefitness.com/article/full-body-trx-workout | GoodLife Fitness (sieć klubów); autorka Kelly Musovic, „Senior Director of Personal Training, Certified Personal Trainer”; 02.09.2019 | 4 warunkowo — autor z certyfikatem trenerskim i data na stronie (reguła ogólna uzup. 3, precedens Major Fitness w rozstrzygnięciu koordynatora 1.1); ryzyko: kryterium 3 (materiały sieci siłowni = 5) — do potwierdzenia recenzenta. Karta nie zależy od tego źródła (Cleveland + Cugliari wystarczają) | „Standing fallout”: „Start facing the anchor with your feet shoulder width apart.” (kierunek sprzeczny z Cleveland — Otwarte 1) |
| ace-63 | https://www.acefitness.org/resources/everyone/exercise-library/63/stability-ball-push-up/ | ACE | 4 | Steps 1–5 — **nieużyte**: dłonie na piłce, stopy na podłodze (inne ćwiczenie niż „Feet On A Stability Ball”) |
| gaiam-suspension-guide | https://cdn.shopify.com/s/files/1/1728/2157/files/05-64490_GAI_Suspension_Trainer_GUIDE.pdf | producent taśm (instrukcja własnego sprzętu) | 4 dla własnego sprzętu | s. 1 — **nieużyte**: brak fallout (tylko przysiad, wykrok, chest press, low row) |

Nieprzeczytane / niedostępne: stack.com (2 artykuły o fallout) — 503; trxtraining.com — strona fallout 404 (brak w wynikach);
elitefts.com (feet-elevated stability ball push-ups) — 404. Strony aplikacji i baz ćwiczeń z wyników pominięte (nie są źródłem).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| 1. Suspended Fallout — kierunek ustawienia (tyłem/przodem do zaczepu) | Cleveland Clinic „facing away”, GoodLife „facing the anchor” — sprzeczność na szczeblu 4; Cugliari nie podaje. Część wspólna w `sfall.setup` bez kierunku. Rozstrzygnie trzecie źródło (np. strona producenta taśm z instrukcją fallout) |
| 2. Suspended Fallout — `plank.brace`, „taśmy cały czas napięte” | napięcie taśm — tylko Cleveland; napięcie brzucha wprost — żadne z przeczytanych (Cugliari: neutralny kręgosłup, nie „napnij brzuch”) |
| 3. Suspended Fallout — `plank.mis.sag` (z łukiem lędźwi), zakres ruchu („tylko tak daleko, jak utrzymasz linię”) | wprost tylko strony szczebla 5 z wyników wyszukiwarki (nieprzeczytane jako źródło) |
| 4. Suspended Fallout — szczebel `goodlife-trx-full-body` | sieć klubów: autor z CPT i data (4 wg reguły ogólnej) vs kryterium 3 (materiały sieci siłowni = 5); decyzja koordynatora; karta od niej nie zależy |
| 5. Push-Ups With Feet On A Stability Ball | brak strony szczebla ≤ 4 dla wersji „stopy na piłce” (ACE #63 — inne ćwiczenie; NASM `stability-ball-push-up` 404 w W2 cz1; EliteFTS 404) |
| 6. Drop Push, Incline Push-Up Depth Jump, Plyo Kettlebell Push-Ups, Incline Push-Up Reverse Grip, Isometric Wipers | bez rysunku v2 i bez nowego tropu (W1 i W2 cz1/cz2) — pominięte zgodnie z briefem |

## Zostało (następny krok, pułapki)

- Suspended Fallout: trzecie źródło dla kierunku ustawienia; stack.com (503) — spróbować ponownie; producent taśm (instrukcja z fallout).
- Feet On A Stability Ball: szukać strony organizacji szkolącej z wersją „stopy na piłce” (ISSA, NASM inny adres).
- Pułapki: ACE #63 to pompka z dłońmi na piłce — nie mylić; dwa adresy Cleveland Clinic dają ten sam tekst (jedno źródło).

## Podsumowanie

Ćwiczeń w zakresie: 7 (zbadane: 2 — Suspended Fallout, Feet On A Stability Ball; 5 bez rysunku pominięte bez nowego tropu).
Nowe karty z błędami: 1 (Suspended Fallout); bez błędów: 0; dopisane do kart W1: 0. Błędy wnioskowane: 2 (`push.mis.sag`,
`rollout.mis.bentArms` ← `sfall.move`). Role gotowe: 0 (brak nowych luk). Otwarte: 6 ćwiczeń + 4 zdania. Nowe zdania: 2 (`sfall.setup`,
`sfall.move`). Nowe źródła: 5 (3 użyte: cleveland-suspension-core, cugliari-2017, goodlife-trx-full-body; 2 nieużyte).
