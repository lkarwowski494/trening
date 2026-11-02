# pushup_plank (cz. 1, pompki) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasada: wyjątek dla wskazówek techniki z CLAUDE.md (2 niezależne źródła szczebla 4, żadne przeczytane nie przeczy).
Wszystkie źródła przeczytane przez WebFetch 02.11.2026. ExRx (403) i web.archive.org (zablokowane) niedostępne.
Strony aplikacji treningowych pominięte (uzupełnienie briefu). Zdania zestawu ogólnego „pushup” wpisane tylko tam,
gdzie przeczytane źródła wariantu je potwierdzają — rozbieżności w „Otwarte”.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Decline Push Up | gotowe | NASM + The Prehab Guys (+ PureGym przy 3 zdaniach) |
| Push-Up Wide | częściowe (bez błędu) | PureGym + Healthline (przegląd NASM-CPT); ustawienie, ruch, 2 wskazówki; błąd — tylko 1 źródło |
| Close-Grip Push-Up | gotowe | weighttraining.guide + Men's Health (E. Samuel, CSCS) |
| Incline Push-Up Close-Grip | otwarte | tylko 1 przeczytane źródło wprost obejmujące wariant |
| Incline Push-Up Reverse Grip | otwarte | brak dostępnego źródła szczebla 4 |
| Single-Arm Push-Up | otwarte | źródła się różnią (dłoń pod barkiem / pod mostkiem), brak 2 źródeł szczebla 4 |
| Push Up to Side Plank | częściowe (bez błędu) | The Prehab Guys + Topend Sports; ustawienie i ruch; biodra/błąd — tylko 1 źródło |
| Suspended Push-Up | częściowe (bez błędu) | TRX (producent) + Eleiko (producent); ustawienie, ruch, 3 wskazówki |
| Push-Ups With Feet On A Stability Ball | otwarte | brak 2 źródeł; strona ACE opisuje inny wariant (dłonie na piłce) |
| Clock Push-Up | otwarte | źródła opisują różne ćwiczenia pod tą nazwą |
| Isometric Wipers | częściowe (bez błędu) | weighttraining.guide + Fitness Volt; ustawienie, ruch, 1 wskazówka |

„Częściowe (bez błędu)” = minimum z briefu (ustawienie + ruch + błąd) niespełnione tylko w części „błąd”; decyzję,
czy wyświetlać kartę bez sekcji błędów (jak istniejący wpis „Incline Push Up” z `mistakes: []`), zostawiam koordynatorowi.

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
 "Decline Push Up": {
  "setup": [
   {"c": "dpush.setup", "s": [
    ["nasm-decline-push-up", "Step 1 (dłonie na podłodze, stopy na ławce lub stopniu); Step 2 (prosta linia od głowy do pięt)"],
    ["prehab-decline-push-up", "HOW (stopy na podwyższeniu, wysoka deska, ciało proste)"]
   ]}
  ],
  "move": [
   {"c": "push.move", "s": [
    ["nasm-decline-push-up", "Step 3 (klatka prawie do podłogi); Step 4 (wyprost łokci)"],
    ["prehab-decline-push-up", "HOW (klatka w dół najniżej, jak się da; powrót do pozycji wyjściowej)"]
   ]}
  ],
  "tips": [
   {"c": "push.rigid", "s": [
    ["nasm-decline-push-up", "Common Mistakes („Allowing hips to sag”)"],
    ["prehab-decline-push-up", "COMPENSATION (nie unoś bioder, nie opuszczaj pośladków)"]
   ]},
   {"c": "plank.brace", "s": [
    ["nasm-decline-push-up", "Step 2 („Engage your core”)"],
    ["puregym-decline-push-ups", "How To, krok 3 (abs braced); Tips (engage your core)"]
   ]},
   {"c": "push.elbows45", "s": [
    ["nasm-decline-push-up", "Step 3 (łokcie ok. 45° od ciała)"],
    ["puregym-decline-push-ups", "Tips (łokcie ok. 45° od ciała)"]
   ]}
  ],
  "mistakes": [
   {"c": "push.mis.sag", "s": [
    ["nasm-decline-push-up", "Common Mistakes („Allowing hips to sag”)"],
    ["prehab-decline-push-up", "COMPENSATION („let your butt sag to the ground”)"]
   ]},
   {"c": "push.mis.flare", "s": [
    ["nasm-decline-push-up", "Common Mistakes („Elbows flaring too wide”)"],
    ["puregym-decline-push-ups", "How To, krok 3 (ręce blisko boków); Tips (łokcie ok. 45°)"]
   ]}
  ]
 },
 "Push-Up Wide": {
  "setup": [
   {"c": "wpush.setup", "s": [
    ["puregym-wide-grip-push-ups", "How To, krok 1–2 (dłonie szerzej niż barki, palce w przód lub lekko na zewnątrz; prosta linia od głowy do pięt)"],
    ["healthline-wide-pushups", "How-to, krok 1–2; Form tips (barki, kręgosłup i biodra w linii)"]
   ]}
  ],
  "move": [
   {"c": "wpush.move", "s": [
    ["puregym-wide-grip-push-ups", "How To, krok 3–4 (łokcie na boki, klatka blisko podłogi, powrót przez wyprost rąk)"],
    ["healthline-wide-pushups", "How-to, krok 3–5 (łokcie na boki w dół, powrót do pozycji wyjściowej)"]
   ]}
  ],
  "tips": [
   {"c": "push.rigid", "s": [
    ["puregym-wide-grip-push-ups", "How To, krok 2 (prosta linia od głowy do pięt)"],
    ["healthline-wide-pushups", "Form tips („Make sure your hips don’t sag down or point upward.”)"]
   ]},
   {"c": "plank.brace", "s": [
    ["puregym-wide-grip-push-ups", "How To, krok 2; Tips (core engaged)"],
    ["healthline-wide-pushups", "Form tips („Engage your core and gluteal muscles”)"]
   ]}
  ],
  "mistakes": []
 },
 "Close-Grip Push-Up": {
  "setup": [
   {"c": "cpush.setup", "s": [
    ["wtg-close-grip-push-up", "Starting position, krok 1–2 (dłonie pod barkami albo bliżej siebie; ciało proste)"],
    ["mh-close-grip-push-up", "hand placement („just narrower than shoulder-width”); body position (prosta linia od barków do stóp)"]
   ]}
  ],
  "move": [
   {"c": "cpush.move", "s": [
    ["wtg-close-grip-push-up", "Execution, krok 1–2 (łokcie przy tułowiu, klatka do dłoni, powrót do pozycji wyjściowej)"],
    ["mh-close-grip-push-up", "„Lower your chest to the floor, keeping your elbows from flaring out from your torso.”; pełny wyprost rąk na górze"]
   ]}
  ],
  "tips": [
   {"c": "push.rigid", "s": [
    ["wtg-close-grip-push-up", "Execution, krok 1 („Keeping your body straight”)"],
    ["mh-close-grip-push-up", "tułów sztywny, prosta linia od barków do stóp („A sagging core…”)"]
   ]}
  ],
  "mistakes": [
   {"c": "push.mis.flare", "s": [
    ["mh-close-grip-push-up", "elbow flaring („you'll avoid flaring your elbows”)"],
    ["wtg-close-grip-push-up", "Execution, krok 1 („your elbows tucked in”)"]
   ]}
  ]
 },
 "Push Up to Side Plank": {
  "setup": [
   {"c": "pspl.setup", "s": [
    ["prehab-push-up-tall-side-plank", "HOW („assume a high plank position”)"],
    ["topend-push-up-rotation", "Technique, krok 1 (pozycja do pompki, ciężar na dłoniach i palcach stóp)"]
   ]}
  ],
  "move": [
   {"c": "pspl.move", "s": [
    ["prehab-push-up-tall-side-plank", "HOW (pompka, ręka w górę do sufitu, obrót klatki o 90° do wysokiej deski bokiem, powrót, druga strona)"],
    ["topend-push-up-rotation", "Technique, krok 2–5 (pompka, przeniesienie ciężaru na jedną stronę, obrót, ręka w górę, powrót, druga strona)"]
   ]}
  ],
  "tips": [],
  "mistakes": []
 },
 "Suspended Push-Up": {
  "setup": [
   {"c": "spush.setup", "s": [
    ["trx-push-up", "Step 3–6 (uchwyty w dłoniach, nadgarstki proste; przejście stopami do pochylenia ciała; dłonie na szerokość barków)"],
    ["eleiko-65942180", "Setup (uchwyty przed klatką na wyprostowanych rękach, przejście stopami w tył, dłonie pod barkami, nogi proste)"]
   ]}
  ],
  "move": [
   {"c": "spush.move", "s": [
    ["trx-push-up", "Step 7–9 (klatka w stronę uchwytów, zgięcie łokci; powrót z wyprostem rąk)"],
    ["eleiko-65942180", "Execution (zgięcie łokci, klatka w dół; odepchnięcie do pozycji wyjściowej)"]
   ]}
  ],
  "tips": [
   {"c": "push.rigid", "s": [
    ["trx-push-up", "Form Cues („prevent your hips from sagging or rising”)"],
    ["eleiko-65942180", "Execution (tułów stabilny); Coaching Points („Keep your body straight”)"]
   ]},
   {"c": "plank.brace", "s": [
    ["trx-push-up", "Form Cues („Engage your core muscles”)"],
    ["eleiko-65942180", "Coaching Points (napięcie pośladków, tułowia i łopatek)"]
   ]},
   {"c": "push.elbows45", "s": [
    ["trx-push-up", "Form Cues („elbows tracking a 45-degree angle”)"],
    ["eleiko-65942180", "Coaching Points („Keep your elbows 45 degrees from the torso”)"]
   ]}
  ],
  "mistakes": []
 },
 "Isometric Wipers": {
  "setup": [
   {"c": "iwip.setup", "s": [
    ["wtg-isometric-wiper", "Starting position, krok 1–2 (dłonie szerzej niż barki; ciało proste, ciężar na dłoniach i palcach stóp)"],
    ["fitnessvolt-isometric-wiper", "krok 1 (wysoka deska, dłonie trochę szerzej niż barki, ciało proste)"]
   ]}
  ],
  "move": [
   {"c": "iwip.move", "s": [
    ["wtg-isometric-wiper", "Execution, krok 1–3 (klatka nisko w stronę jednej ręki, przesunięcie na drugą stronę, klatka blisko podłogi)"],
    ["fitnessvolt-isometric-wiper", "krok 2–3 (opuszczenie jak w pompce, bez wypychania w górę, przenoszenie ciężaru z ręki na rękę)"]
   ]}
  ],
  "tips": [
   {"c": "push.rigid", "s": [
    ["wtg-isometric-wiper", "Execution, krok 1 („Keeping your body straight and rigid”)"],
    ["fitnessvolt-isometric-wiper", "krok 1 (napięty brzuch, ciało proste)"]
   ]}
  ],
  "mistakes": []
 }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| dpush.setup | Dłonie na podłodze, stopy na ławce albo stopniu; ciało proste od głowy do pięt. | Hands on the floor, feet on a bench or step; body straight from head to heels. |
| wpush.setup | Dłonie wyraźnie szerzej niż barki, palce w przód albo lekko na zewnątrz; ciało proste od głowy do pięt. | Hands clearly wider than your shoulders, fingers forward or slightly turned out; body straight from head to heels. |
| wpush.move | Opuść klatkę w stronę podłogi, łokcie idą na boki; wypchnij się z powrotem do wyprostu rąk. | Lower your chest toward the floor, elbows going out to the sides; push back up until your arms are straight. |
| cpush.setup | Dłonie pod barkami albo trochę węziej; ciało proste od głowy do pięt. | Hands under your shoulders or slightly narrower; body straight from head to heels. |
| cpush.move | Opuść klatkę do podłogi, łokcie blisko tułowia; wypchnij się do wyprostu rąk. | Lower your chest to the floor with elbows close to your body; push up until your arms are straight. |
| pspl.setup | Zacznij w pozycji do pompki, ciężar na dłoniach i palcach stóp. | Start in a push-up position, weight on your hands and toes. |
| pspl.move | Zrób pompkę, a przy wypychaniu przenieś ciężar na jedną rękę, obróć tułów bokiem i unieś drugą rękę do sufitu; wróć i powtórz na drugą stronę. | Do a push-up; as you press up, shift onto one hand, turn your body sideways and reach the other arm to the ceiling; come back and repeat to the other side. |
| spush.setup | Chwyć uchwyty taśm, ręce wyprostowane przed klatką, dłonie na szerokość barków; przejdź stopami tak, żeby ciało było pod skosem i proste. | Hold the strap handles with straight arms in front of your chest, hands shoulder-width apart; walk your feet until your body is at an angle and straight. |
| spush.move | Opuść klatkę w stronę uchwytów, zginając łokcie; wypchnij się z powrotem do wyprostu rąk. | Lower your chest toward the handles by bending your elbows; push back up until your arms are straight. |
| iwip.setup | Pozycja do pompki: dłonie szerzej niż barki, ciało proste, ciężar na dłoniach i palcach stóp. | Push-up position: hands wider than your shoulders, body straight, weight on your hands and toes. |
| iwip.move | Opuść się nisko jak w pompce i — bez wypychania w górę — przesuwaj ciało raz do jednej, raz do drugiej ręki, klatka blisko podłogi. | Lower yourself as in a push-up and, without pressing back up, shift your body toward one hand, then the other, chest close to the floor. |
| push.elbows45 | Łokcie mniej więcej pod kątem 45° do tułowia — nie rozkładaj ich na boki. | Elbows at roughly 45° to your body — don't let them go out to the sides. |
| push.mis.sag | Biodra opadają — ciało przestaje być proste. | Hips sagging — the body stops being straight. |
| push.mis.flare | Łokcie rozjeżdżają się szeroko na boki. | Elbows flaring wide to the sides. |

Uwaga do `push.elbows45`: przedział kąta — 4 zgodne źródła szczebla 4 (NASM, PureGym, TRX, Eleiko), żadne przeczytane nie przeczy
(Men's Health dla wąskich pompek każe trzymać łokcie „practically glued” — inny wariant; dlatego zdanie nie jest użyte w „Close-Grip Push-Up”).
`spush.setup` — TRX każe iść stopami „toward the anchor point”, Eleiko „back”; obie strony opisują to samo (odejście stopami tak, by ciało się pochyliło),
dlatego zdanie nie podaje kierunku.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| nasm-decline-push-up | https://www.nasm.org/resource-center/exercise-library/decline-push-up | NASM | 4 | 02.11.2026 |
| prehab-decline-push-up | https://theprehabguys.com/vimeo-video/decline-push-up/ | The Prehab Guys | 4 | 02.11.2026 |
| puregym-decline-push-ups | https://www.puregym.com/exercises/chest/press-up/decline-push-ups/ | PureGym (NOWA org.: sieć siłowni, biblioteka ćwiczeń; bez podanego autora) | 4 | 02.11.2026 |
| puregym-wide-grip-push-ups | https://www.puregym.com/exercises/chest/press-up/wide-grip-push-ups/ | PureGym | 4 | 02.11.2026 |
| healthline-wide-pushups | https://www.healthline.com/health/exercise-fitness/wide-pushups | Healthline (NOWA org.: serwis zdrowotny; przegląd D. Bubnis, M.S., NASM-CPT; 29.07.2019) | 4 | 02.11.2026 |
| wtg-close-grip-push-up | https://weighttraining.guide/exercises/close-grip-push-up | weighttraining.guide (NOWA org.: serwis specjalistyczny, autor E. Lord) | 4 | 02.11.2026 |
| mh-close-grip-push-up | https://www.yahoo.com/news/fix-close-grip-pushups-one-164000134.html | Men's Health (NOWA org.: magazyn; E. Samuel, C.S.C.S.; B. Williams, NASM; przedruk z 11.06.2024 — oryginał na menshealth.com.au zwraca „Access Denied”) | 4 | 02.11.2026 |
| prehab-push-up-tall-side-plank | https://theprehabguys.com/vimeo-video/push-up-to-tall-side-plank/ | The Prehab Guys | 4 | 02.11.2026 |
| topend-push-up-rotation | https://www.topendsports.com/fitness/technique/push-up-with-rotation.htm | Topend Sports (NOWA org.: serwis specjalistyczny, bez podanego autora strony) | 4 | 02.11.2026 |
| trx-push-up | https://www.trxtraining.com/blogs/news/trx-push-up | TRX (NOWA org.: producent sprzętu do treningu w podwieszeniu) | 4 | 02.11.2026 |
| eleiko-65942180 | https://eleiko.inspire360.com/resource/65942180a3414e08d603e3c2 | Eleiko („Push-Ups - Suspension Handles”) | 4 | 02.11.2026 |
| wtg-isometric-wiper | https://weighttraining.guide/exercises/isometric-wiper | weighttraining.guide | 4 | 02.11.2026 |
| fitnessvolt-isometric-wiper | https://fitnessvolt.com/isometric-wiper/ | Fitness Volt (NOWA org.: serwis specjalistyczny; autor „Dr. Malik”, MD) | 4 | 02.11.2026 |

Uwaga dla koordynatora: nowe organizacje (PureGym, Healthline, weighttraining.guide, Men's Health, Topend Sports, TRX,
Fitness Volt) — szczebel 4 przyjęty analogicznie do „Coach” i „BarBend” (serwis/magazyn z ekspertem) oraz Eleiko/Concept2
(producent). Jeśli któreś uznasz za za słabe, zdania oparte na nim spadają do „jedno źródło”. Nazwa „TRX” to marka producenta
— tylko w rejestrze źródeł, nie w tekstach aplikacji.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Decline Push Up — szerokość dłoni (`push.setup` z zestawu ogólnego) | źródła się różnią: NASM „trochę szerzej niż barki”, Prehab Guys „pod barkami”; `dpush.setup` celowo bez szerokości, `push.setup` usunięte z karty. |
| Decline Push Up — wysokość podparcia stóp / „za wysoko = pompka w staniu na rękach” | liczby (6–12 cali) i progresja tylko w FAQ NASM; drugie źródło spoza dopuszczonych — nie wpisano. |
| Decline Push Up — `push.mis.partial` (zestaw ogólny) | żadne przeczytane źródło wariantu nie podaje skracania ruchu jako błędu; NASM (Step 4) radzi nie blokować łokci na górze, co kłóci się z „bez wyprostu na górze” — usunięte z karty. |
| Zestaw ogólny `push.mis.partial` — uwaga ogólna | ten sam konflikt dotyczy też innych wariantów: NASM (decline), TRX („without locking your elbows”) i ACE #63 („fully extended, but not locked”) mówią o pełnym wyproście bez blokowania łokci; zdanie „bez wyprostu na górze” warto przejrzeć (czy „wyprost” nie jest czytany jako „blokada”). |
| Push-Up Wide — błąd | tylko Healthline wprost (biodra nie opadają / nie unoszą się); PureGym nie ma sekcji błędów → `mistakes` puste. Zestaw ogólny miał `push.mis.partial` i `plank.mis.sag` — niepotwierdzone (lędźwie w łuk — brak w źródłach). |
| Close-Grip Push-Up — `plank.brace`, `push.mis.partial` (zestaw ogólny) | `plank.brace`: tylko Men's Health; `push.mis.partial`: brak w obu źródłach → nie wpisane. |
| Close-Grip Push-Up — dłonie stykające się („romb”) jako błąd | tylko Men's Health; weighttraining.guide traktuje romb jako trudniejszy wariant, nie błąd — źródła się różnią. |
| Incline Push-Up Close-Grip | wprost obejmuje go tylko weighttraining.guide (Tips: dłonie na krawędzi podwyższenia jako łatwiejsza wersja); strony NASM/PureGym dla wariantu — 404, bodybuilding.com przekierowuje do sklepu, strony aplikacji wykluczone. Złożenie kart „Incline Push Up” i „Close-Grip Push-Up” byłoby analogią. Zestaw ogólny niepotwierdzony. |
| Incline Push-Up Reverse Grip | jedyne konkretne źródło (muscleandstrength.com) — 403; reszta wyników to aplikacje albo fora. Zestaw ogólny niepotwierdzony. Wyniki wspominają obciążenie nadgarstków — twierdzenie o zdrowiu, poza zakresem wskazówek. |
| Single-Arm Push-Up | dostępne strony to blogi trenerów (szczebel 5) i aplikacje; ustawienie dłoni sporne (pod barkiem / pod środkiem klatki / pod mostkiem), szeroko rozstawione stopy powtarzają się, ale bez 2 źródeł szczebla 4. Zestaw ogólny (`plank.brace`, `push.rigid`, `plank.mis.sag`) niepotwierdzony. |
| Push Up to Side Plank — `splank.noSag`, `push.rigid`, `plank.mis.sag` (zestaw ogólny) | biodra nie opadają — tylko Prehab Guys (COMPENSATION); Topend Sports nie mówi o biodrach; „biodra nie skręcają się w przód ani w tył” — żadne źródło. Nie wpisane. |
| Suspended Push-Up — błąd; `push.mis.partial`, `plank.mis.sag` (zestaw ogólny) | Eleiko nie ma sekcji błędów; TRX tylko jako „avoid” w opisie (nadgarstki, kołysanie) — po jednym źródle. Długość/wysokość taśm i „im dalej stopy, tym trudniej” — tylko TRX. |
| Push-Ups With Feet On A Stability Ball | ACE #63 „Stability Ball Push Up” opisuje inny wariant (brzuch/dłonie przy piłce, stopy na podłodze) — nie pasuje. ISSA wspomina pozycję „feet elevated on the stability ball” tylko przy innym ćwiczeniu. elitefts — 404, arkusz uczelni (PDF) nieczytelny, reszta to aplikacje. Zestaw ogólny niepotwierdzony. |
| Clock Push-Up | pod tą nazwą źródła opisują dwa różne ćwiczenia: Physitrack („Push-up on clock face”: po pompce dotykanie podłogi jedną ręką na 12, 3, 6, 9) vs. strony aplikacji (przestawianie obu dłoni w koło między pompkami). Najpierw ustalić definicję ćwiczenia w katalogu (opis bazy źródłowej katalogu), potem szukać źródeł. |
| Isometric Wipers — błąd; `plank.brace`, `plank.mis.sag` (zestaw ogólny) | „odbijanie się z boku na bok” — tylko Fitness Volt; `plank.brace` — tylko Fitness Volt (napięty brzuch); `plank.mis.sag` — żadne. Uwaga: Fitness Volt nie każe wracać do góry między stronami, weighttraining.guide też nie — zgodne, stąd `iwip.move`. |

## Stan

Zakończone w całości (11/11 ćwiczeń przejrzanych). Nic nie zostało w tej części; pułapki: ExRx 403, web.archive.org zablokowane,
bodybuilding.com przekierowuje do sklepu (404), muscleandstrength.com 403, menshealth.com.au „Access Denied” (użyty przedruk).
