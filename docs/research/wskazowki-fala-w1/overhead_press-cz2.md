# overhead_press (część 2) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zakres: Landmine Press, Pike Push Up, Handstand Push Up, Double Kettlebell Press, Kettlebell Seated Press, Kettlebell Arnold Press,
Seated Cable Shoulder Press, Landmine Linear Jammer, Single-Arm Linear Jammer. Wszystkie źródła poniżej przeczytane przez WebFetch 02.11.2026.
ExRx (403) i Wayback (zablokowane) niedostępne, więc zgodnie z uzupełnieniem briefu użyłem innych źródeł szczebla 4. Strony innych aplikacji
treningowych pominąłem (nie są źródłem, nie wpisuję ich nazw). Zdania z zestawów ogólnych wpisuję tylko wtedy, gdy przeczytane źródła wariantu
je potwierdzają. Rozbieżności z zestawami ogólnymi opisuję w „Otwarte”.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Landmine Press | gotowe | 4 źródła (BarBend, OriGym, Human Kinetics, The Prehab Guys). `press.noLock` i `mis.jerk` z zestawu ogólnego niepotwierdzone (Otwarte) |
| Pike Push Up | gotowe | 3 źródła (NASM, Major Fitness – producent sprzętu, weighttraining.guide). `plank.brace` i `push.mis.partial` z zestawu ogólnego niepotwierdzone/sprzeczne (Otwarte) |
| Handstand Push Up | gotowe (tylko technika) | 3 źródła (CrossFit, Fringe Sport – producent sprzętu, fragment książki z serii poradników). Nic o zdrowiu, progresji ani liczbach |
| Double Kettlebell Press | otwarte | ustawienie i ruch potwierdzone (zdania niżej w „Otwarte”), ale błędu nie potwierdzają 2 źródła — brak minimalnego zestawu |
| Kettlebell Seated Press | otwarte | nie znalazłem 2 przeczytanych źródeł spoza aplikacji (strona producenta odmówiła dostępu, HTTP 402) |
| Kettlebell Arnold Press | otwarte | znalezione opisy pochodziły prawie wyłącznie ze stron aplikacji; pozostałe źródła różnią się co do pozycji startowej dłoni |
| Seated Cable Shoulder Press | otwarte | brak 2 źródeł spoza aplikacji dla wersji siedzącej z dolnymi wyciągami; błąd w zestawie ogólnym (Otwarte) |
| Landmine Linear Jammer | otwarte | tylko 1 opis (producent sprzętu), który wygląda na przepisany z cudzego serwisu; opisy różnią się co do pracy nóg |
| Single-Arm Linear Jammer | otwarte | jak wyżej (ten sam jedyny opis jest jednorącz) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

```json
{
  "Landmine Press": {
    "setup": [
      {"c": "lm.setup", "s": [["barbend-landmine-press", "How to (hold the sleeve, clean it to shoulder height)"], ["origym-landmine-press", "Set-up / hand position (hold the bar at chest height)"]]}
    ],
    "move": [
      {"c": "lm.move", "s": [["barbend-landmine-press", "How to (lean forward slightly; press on a slight diagonal; lower under control)"], ["origym-landmine-press", "Movement 1 i 3 (press forward and up; lower under control to the chest)"], ["hk-landmine-one-arm", "kroki (press the bar out in front, lower under control)"]]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [["barbend-landmine-press", "How to (brace your core)"], ["origym-landmine-press", "Hand and bar position (brace your core for stability)"], ["hk-landmine-one-arm", "kroki (brace the core)"]]}
    ],
    "mistakes": [
      {"c": "ohp.mis.arch", "s": [["barbend-landmine-press", "Common mistakes: Rib Flare"], ["prehab-hk-sa-landmine-press", "Compensation (do not arch your back)"]]},
      {"c": "ohp.mis.shrug", "s": [["barbend-landmine-press", "Common mistakes: Incorrect Bar Path (without shrugging)"], ["prehab-hk-sa-landmine-press", "Compensation (do not shrug your shoulders)"]]}
    ]
  },
  "Pike Push Up": {
    "setup": [
      {"c": "pike.setup", "s": [["nasm-pike-push-up", "Step 1 (downward dog, hands slightly wider than shoulder-width, inverted V)"], ["majorfitness-pike-push-up", "Setup 1 (downward dog, hands shoulder-width)"], ["wtg-pike-push-up", "Starting Position 3 (raise your hips)"]]}
    ],
    "move": [
      {"c": "pike.move", "s": [["nasm-pike-push-up", "Step 3 (lower your head toward the floor by bending your elbows)"], ["majorfitness-pike-push-up", "Movement 3 i 5"], ["wtg-pike-push-up", "Execution 1–2"]]}
    ],
    "tips": [],
    "mistakes": [
      {"c": "pike.mis.hips", "s": [["nasm-pike-push-up", "Common Mistakes (allowing hips to sag)"], ["majorfitness-pike-push-up", "Common Mistakes: Incorrect Form (body forms an inverted V)"]]},
      {"c": "pike.mis.shallow", "s": [["majorfitness-pike-push-up", "Common Mistakes: Limited Range of Motion (lowering only halfway)"], ["nasm-pike-push-up", "Step 3 (until your head nearly touches the floor)"]]}
    ]
  },
  "Handstand Push Up": {
    "setup": [
      {"c": "hspu.setup", "s": [["crossfit-hspu-master", "Hand placement (just outside the shoulders)"], ["dummies-paleo-hspu", "kroki 1–2 (hands shoulder-width apart; elbows locked, kick your feet up against the wall)"], ["fringe-hspu-3-things", "pkt o ustawieniu dłoni (as you kick up on to the wall)"]]}
    ],
    "move": [
      {"c": "hspu.move", "s": [["crossfit-hspu-master", "Head position (top of the head taps the floor); press (open the shoulder completely at the top)"], ["dummies-paleo-hspu", "kroki 3–4 (bend your elbows, head to the floor, press back up into full lockout)"]]}
    ],
    "tips": [
      {"c": "hspu.triangle", "s": [["crossfit-hspu-master", "Head position (head and hands create a triangle, or tripod)"], ["fringe-hspu-3-things", "pkt o dłoniach i głowie (creating a triangle on the ground)"]]},
      {"c": "plank.brace", "s": [["crossfit-hspu-master", "Body position (keep the core engaged)"], ["fringe-hspu-3-things", "pkt o przeproście (crunching down your abs)"]]}
    ],
    "mistakes": [
      {"c": "ohp.mis.arch", "s": [["fringe-hspu-3-things", "pkt o przeproście (urge to over extend their back)"], ["crossfit-hspu-master", "Body position (keep the body from bowing)"]]}
    ]
  }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| lm.setup | Trzymaj koniec sztangi przed klatką, na wysokości barku. | Hold the end of the bar in front of your chest, at shoulder height. |
| lm.move | Lekko pochyl się do przodu i wypchnij sztangę w górę i przed siebie, po skosie; opuść ją powoli z powrotem do klatki. | Lean forward slightly and press the bar up and forward on a diagonal; lower it slowly back to your chest. |
| ohp.mis.arch | Wyginanie lędźwi w łuk przy wyciskaniu. | Arching the lower back as you press. |
| ohp.mis.shrug | Podciąganie barków do uszu. | Shrugging the shoulders up to the ears. |
| pike.setup | Dłonie na szerokość barków lub trochę szerzej, biodra wysoko — ciało w kształcie odwróconego V. | Hands shoulder-width or slightly wider, hips high so your body makes an upside-down V. |
| pike.move | Zginając łokcie, opuść głowę w stronę podłogi; wypchnij się z powrotem w górę. | Bend your elbows to lower your head toward the floor, then push back up. |
| pike.mis.hips | Opadające biodra — odwrócone V się spłaszcza. | Hips sagging so the upside-down V flattens out. |
| pike.mis.shallow | Schodzenie tylko do połowy — głowa daleko od podłogi. | Going only halfway down, with your head far from the floor. |
| hspu.setup | Dłonie na szerokość barków lub trochę szerzej; na prostych rękach wejdź do stania na rękach przy ścianie. | Hands shoulder-width or slightly wider; with straight arms, kick up into a handstand against the wall. |
| hspu.move | Zginając łokcie, opuść się, aż czubek głowy dotknie podłogi; wypchnij się do wyprostu rąk. | Bend your elbows and lower until the top of your head touches the floor; press back up until your arms are straight. |
| hspu.triangle | Na dole głowa i dłonie tworzą trójkąt. | At the bottom, your head and hands form a triangle. |

Uwaga: `ohp.mis.arch` i `ohp.mis.shrug` są ogólne dla rodziny (używane w Landmine Press i Handstand Push Up). Istniejące zdania
z łukiem lędźwi (`plank.mis.sag`, `bext.noArch`, `vup.back`) dotyczą innych pozycji, nie pasują.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| barbend-landmine-press | https://barbend.com/landmine-press/ | BarBend | 4 | 02.11.2026 |
| origym-landmine-press | https://www.origym.co.uk/blog/landmine-press/ | OriGym (ośrodek szkolący trenerów, UK) | 4 | 02.11.2026 |
| hk-landmine-one-arm | https://us.humankinetics.com/blogs/excerpt/half-kneeling-landmine-one-arm-press | Human Kinetics (fragment książki A. Wellmana „Complete Conditioning for Football”) | 4 (fragment książki trenera; nie podnoszę do szczebla 3) | 02.11.2026 |
| prehab-hk-sa-landmine-press | https://theprehabguys.com/vimeo-video/half-kneeling-single-arm-shoulder-press-landmine/ | The Prehab Guys | 4 | 02.11.2026 |
| nasm-pike-push-up | https://www.nasm.org/resource-center/exercise-library/pike-push-up | NASM | 4 | 02.11.2026 |
| majorfitness-pike-push-up | https://www.majorfitness.com/blogs/wiki/how-to-do-a-pike-push-up-master-this-essential-upper-body-workout | Major Fitness (producent sprzętu do domowej siłowni) | 4 | 02.11.2026 |
| wtg-pike-push-up | https://weighttraining.guide/exercises/pike-push-up | weighttraining.guide (serwis specjalistyczny, autor podpisany jako „Dr SAL”) | 4 | 02.11.2026 |
| crossfit-hspu-master | https://www.crossfit.com/essentials/hspu-and-you-master-the-movement | CrossFit (organizacja szkoląca trenerów) | 4 | 02.11.2026 |
| fringe-hspu-3-things | https://www.fringesport.com/blogs/news/50736324-3-things-to-improve-hspu-s | Fringe Sport (marka sprzętu) | 4 | 02.11.2026 |
| dummies-paleo-hspu | https://www.dummies.com/article/home-auto-hobbies/food-drink/recipes/paleo-diet-recipes/advanced-push-for-paleo-fitness-the-handstand-push-up-203899/ | Wiley, seria poradników (K. Petrucci, P. Flynn „Paleo Workouts For Dummies”) | 4 | 02.11.2026 |
| dfit-double-kb-press | https://dangerouslyfit.com.au/kettlebell-exercise/double-kettlebell-press | Dangerously Fit (sprzedawca sprzętu i ośrodek szkolący trenerów, AU) | 4 | 02.11.2026 (do zestawu otwartego) |
| strongandfit-double-kb-press | https://strongandfit.com/blogs/news/double-kettlebell-press | Strong And Fit (sprzedawca materiałów szkoleniowych) | 4/5, niepewne | 02.11.2026 (do zestawu otwartego) |
| crossfit-dkb-push-press-jerk | https://www.crossfit.com/essentials/double-kettlebell-push-press-and-jerk | CrossFit | 4 | 02.11.2026 (do zestawu otwartego) |
| dynamo-landmine-jammer | https://blog.dynamofitness.com.au/?p=2718 | Dynamo Fitness (sprzedawca sprzętu, AU) | 4 | 02.11.2026 (jedno źródło, Otwarte) |

Niezależność: dla Pike Push Up i HSPU każde zdanie ma ≥ 2 różne organizacje. Major Fitness i Fringe Sport to marki sprzętu. Nie znalazłem
dowodu, że ich teksty są przepisane z innych źródeł, ale nie mogę tego wykluczyć.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Landmine Press — `press.noLock` (zestaw ogólny) | źródła się różnią: BarBend każe prostować „until your elbow locks out”, OriGym „avoiding elbow lockout”. Nie wpisuję żadnego wariantu |
| Landmine Press — `mis.jerk` (zestaw ogólny) | żadne przeczytane źródło nie wymienia szarpania jako błędu; The Prehab Guys pisze tylko, że wersja z klęku eliminuje rozpęd z nóg |
| Landmine Press — rozstaw stóp / klęk | tylko OriGym podaje rozstaw stóp; pozostałe opisują klęk jednonóż. Zdanie `lm.setup` celowo nie mówi o stopach. Do sprawdzenia, jaką pozycję pokazuje figura |
| Landmine Press — nadgarstek prosty, prasa nie przez linię środka ciała | po 1 źródle (BarBend, Human Kinetics) |
| Pike Push Up — `plank.brace` (zestaw ogólny) | tylko NASM („Engage your core”); dwa pozostałe źródła mówią o plecach, nie o brzuchu |
| Pike Push Up — `push.mis.partial` (zestaw ogólny) | częściowo sprzeczny: NASM zaleca, by na górze nie blokować łokci, a zdanie mówi „bez wyprostu na górze” jako błąd. Zastąpione przez `pike.mis.shallow` |
| Pike Push Up — łokcie | źródła sprzeczne: NASM wymienia rozchodzące się łokcie jako błąd, Major Fitness każe je rozchylać. Nie wpisuję |
| Pike Push Up — plecy neutralne / bez łuku | Major Fitness („avoid arching your back”) i weighttraining.guide („neutral back”). Prawdopodobnie do dodania jako `ohp.mis.arch`, ale sformułowania nie są jednoznacznie te same, więc zostawiam do decyzji recenzenta |
| Handstand Push Up — łokcie idą do tyłu przy opuszczaniu | tylko CrossFit (przeczytane). Inna strona z wyników wyszukiwania była stroną marki odzieżowej, nieprzeczytaną |
| Handstand Push Up — powolne tempo, wersja z wymachem (kip), progresje | poza zakresem (zadanie: tylko technika). Twierdzenia o urazach z wyników wyszukiwania pominięte |
| Double Kettlebell Press — potwierdzone, ale bez minimalnego zestawu | setup „Oba kettlebelle na barkach: łokcie przy tułowiu, nadgarstki proste.” (dfit-double-kb-press: teaching point 1; crossfit-dkb-push-press-jerk: Rack Position; strongandfit: Setup). Ruch `ohp.move` (dfit: pkt 1–4; strongandfit: Steps 2–3). Brakuje błędu z 2 źródeł |
| Double Kettlebell Press — `ohp.mis.lock`, `ohp.tall`, `ohp.elbowsUnder` (zestaw ogólny) | `ohp.mis.lock`: niepotwierdzone, oba źródła każą w pełni wyprostować ręce („so the arm is straight”, „fully extending your arms”). `ohp.elbowsUnder`: tylko Dangerously Fit („keep the forearm vertical”). `ohp.tall`: brak 2 źródeł dla wyciskania ścisłego |
| Kettlebell Seated Press | strona producenta kettlebelli z opisem wyciskania siedząc zwróciła HTTP 402, a Muscle & Strength — 403. Reszta wyników to strony aplikacji. Zestaw ogólny (`ohp.elbowsUnder`, `ohp.fullExt`, `ohp.mis.lock`) niepotwierdzony dla tego wariantu |
| Kettlebell Arnold Press | znalezione opisy to głównie strony aplikacji (wykluczone). Pozostałe nieprzeczytane albo z serwisów o niepewnym szczeblu; według wyników wyszukiwania różnią się co do startu dłoni (rack vs dłoń do twarzy). Zestaw ogólny niepotwierdzony |
| Seated Cable Shoulder Press — błąd w zestawie ogólnym | zestaw używa `ohp.seat` („…hantle przy barkach”), a w tym ćwiczeniu są uchwyty wyciągu, nie hantle. Zdanie nie pasuje do wariantu. Lepiej `cohp.setup` (stoi albo siedzi między dolnymi wyciągami), ale jego źródła (ExRx wersja stojąca + ACE maszyna) nie obejmują wprost wersji siedzącej z wyciągami |
| Seated Cable Shoulder Press — źródła | nie znalazłem 2 źródeł spoza aplikacji. Instrukcja producenta (bramownica z ramionami do wyciskania) dotyczy maszyny, nie dolnych wyciągów |
| Landmine Linear Jammer / Single-Arm Linear Jammer | jedno źródło (Dynamo Fitness: jednorącz, wyciskanie z barku bez pracy nóg, druga dłoń na boku tułowia). Tekst zbieżny z opisem w dużym serwisie, więc prawdopodobnie przepisany, a nie niezależny. Zestaw ogólny `pp.legs` (siła z nóg) jest z nim sprzeczny dla wersji z tej strony. Inne przeczytane strony (NFPT, Performance Herts, Fitness Education AU) jammera nie opisują. Wymaga ustalenia, którą wersję pokazuje figura |
| StrongFirst (HSPU, kettlebell press) | strona zwraca HTTP 307 bez treści w narzędziu, nieprzeczytana |

## Stan

Wszystkie 9 ćwiczeń przejrzane: 3 gotowe, 6 otwartych. Następny krok (gdyby ktoś wracał): zestawy kettlebellowe i jammery wymagają źródeł
spoza stron aplikacji. Pułapki: StrongFirst 307, Kettlebell Kings 402, Muscle & Strength 403, ExRx 403, Wayback zablokowane.
