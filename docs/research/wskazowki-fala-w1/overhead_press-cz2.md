# overhead_press (część 2) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zakres: Landmine Press, Pike Push Up, Handstand Push Up, Double Kettlebell Press, Kettlebell Seated Press, Kettlebell Arnold Press,
Seated Cable Shoulder Press, Landmine Linear Jammer, Single-Arm Linear Jammer. Wszystkie źródła poniżej przeczytane przez WebFetch 02.11.2026.
ExRx (403) i Wayback (zablokowane) niedostępne, więc zgodnie z uzupełnieniem briefu użyłem innych źródeł szczebla 4. Strony innych aplikacji
treningowych pominąłem (nie są źródłem, nie wpisuję ich nazw). Zdania z zestawów ogólnych wpisuję tylko wtedy, gdy przeczytane źródła wariantu
je potwierdzają. Rozbieżności z zestawami ogólnymi opisuję w „Otwarte”.
Szczeble źródeł poprawione 02.11.2026 wg rozstrzygnięcia koordynatora linii 1.1 — patrz „Korekta szczebli” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Landmine Press | częściowe (bez błędu) | 3 źródła szczebla 4 (BarBend, OriGym, Human Kinetics): ustawienie, ruch, 1 wskazówka. Błędy `ohp.mis.arch`, `ohp.mis.shrug` — po korekcie tylko BarBend (The Prehab Guys → 5). `press.noLock` i `mis.jerk` z zestawu ogólnego niepotwierdzone (Otwarte) |
| Pike Push Up | otwarte | po korekcie każde zdanie ma tylko NASM (Major Fitness — producent, ale pompka bez sprzętu → 5; weighttraining.guide → 5) |
| Handstand Push Up | otwarte | po korekcie każde zdanie ma tylko CrossFit (Fringe Sport → 5: blog marki sprzętu o ćwiczeniu bez jej sprzętu; fragment poradnika → 5) |
| Double Kettlebell Press | otwarte | ustawienie i ruch po korekcie mają po 1 źródle szczebla 4 (CrossFit); błędu nie potwierdzają 2 źródła — brak minimalnego zestawu |
| Kettlebell Seated Press | otwarte | nie znalazłem 2 przeczytanych źródeł spoza aplikacji (strona producenta odmówiła dostępu, HTTP 402) |
| Kettlebell Arnold Press | otwarte | znalezione opisy pochodziły prawie wyłącznie ze stron aplikacji; pozostałe źródła różnią się co do pozycji startowej dłoni |
| Seated Cable Shoulder Press | otwarte | brak 2 źródeł spoza aplikacji dla wersji siedzącej z dolnymi wyciągami; błąd w zestawie ogólnym (Otwarte) |
| Landmine Linear Jammer | otwarte | tylko 1 opis (sprzedawca sprzętu, szczebel 5), który wygląda na przepisany z cudzego serwisu; opisy różnią się co do pracy nóg |
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
    "mistakes": []
  }
}
```

## Nowe zdania (id | PL | EN)

Zdania oznaczone „(nieużyte)” po korekcie z 02.11.2026 nie występują w bloku JSON — propozycje do czasu znalezienia drugiego źródła szczebla 4.

| id | PL | EN |
|---|---|---|
| lm.setup | Trzymaj koniec sztangi przed klatką, na wysokości barku. | Hold the end of the bar in front of your chest, at shoulder height. |
| lm.move | Lekko pochyl się do przodu i wypchnij sztangę w górę i przed siebie, po skosie; opuść ją powoli z powrotem do klatki. | Lean forward slightly and press the bar up and forward on a diagonal; lower it slowly back to your chest. |
| ohp.mis.arch (nieużyte) | Wyginanie lędźwi w łuk przy wyciskaniu. | Arching the lower back as you press. |
| ohp.mis.shrug (nieużyte) | Podciąganie barków do uszu. | Shrugging the shoulders up to the ears. |
| pike.setup (nieużyte) | Dłonie na szerokość barków lub trochę szerzej, biodra wysoko — ciało w kształcie odwróconego V. | Hands shoulder-width or slightly wider, hips high so your body makes an upside-down V. |
| pike.move (nieużyte) | Zginając łokcie, opuść głowę w stronę podłogi; wypchnij się z powrotem w górę. | Bend your elbows to lower your head toward the floor, then push back up. |
| pike.mis.hips (nieużyte) | Opadające biodra — odwrócone V się spłaszcza. | Hips sagging so the upside-down V flattens out. |
| pike.mis.shallow (nieużyte) | Schodzenie tylko do połowy — głowa daleko od podłogi. | Going only halfway down, with your head far from the floor. |
| hspu.setup (nieużyte) | Dłonie na szerokość barków lub trochę szerzej; na prostych rękach wejdź do stania na rękach przy ścianie. | Hands shoulder-width or slightly wider; with straight arms, kick up into a handstand against the wall. |
| hspu.move (nieużyte) | Zginając łokcie, opuść się, aż czubek głowy dotknie podłogi; wypchnij się do wyprostu rąk. | Bend your elbows and lower until the top of your head touches the floor; press back up until your arms are straight. |
| hspu.triangle (nieużyte) | Na dole głowa i dłonie tworzą trójkąt. | At the bottom, your head and hands form a triangle. |

Uwaga: `ohp.mis.arch` i `ohp.mis.shrug` są ogólne dla rodziny. Istniejące zdania
z łukiem lędźwi (`plank.mis.sag`, `bext.noArch`, `vup.back`) dotyczą innych pozycji, nie pasują.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| barbend-landmine-press | https://barbend.com/landmine-press/ | BarBend (artykuł o technice) | 4 | 02.11.2026 |
| origym-landmine-press | https://www.origym.co.uk/blog/landmine-press/ | OriGym (ośrodek szkolący trenerów, UK; J. Brady, dyplom trenera personalnego; akt. 29.06.2026) | 4 | 02.11.2026 |
| hk-landmine-one-arm | https://us.humankinetics.com/blogs/excerpt/half-kneeling-landmine-one-arm-press | Human Kinetics (fragment książki A. Wellmana „Complete Conditioning for Football”; autor — trener przygotowania, nie NSCA ani naukowiec) | 4 | 02.11.2026 |
| prehab-hk-sa-landmine-press | https://theprehabguys.com/vimeo-video/half-kneeling-single-arm-shoulder-press-landmine/ | The Prehab Guys (firma z płatnymi programami i aplikacją; strony bez autora i kwalifikacji) | 5 | 02.11.2026 |
| nasm-pike-push-up | https://www.nasm.org/resource-center/exercise-library/pike-push-up | NASM | 4 | 02.11.2026 |
| majorfitness-pike-push-up | https://www.majorfitness.com/blogs/wiki/how-to-do-a-pike-push-up-master-this-essential-upper-body-workout | Major Fitness (producent sprzętu do domowej siłowni; pompka bez sprzętu — poza własnym rodzajem sprzętu) | 5 | 02.11.2026 |
| wtg-pike-push-up | https://weighttraining.guide/exercises/pike-push-up | weighttraining.guide (serwis jednego autora, bez redakcji i recenzji eksperckiej) | 5 | 02.11.2026 |
| crossfit-hspu-master | https://www.crossfit.com/essentials/hspu-and-you-master-the-movement | CrossFit (organizacja szkoląca trenerów) | 4 | 02.11.2026 |
| fringe-hspu-3-things | https://www.fringesport.com/blogs/news/50736324-3-things-to-improve-hspu-s | Fringe Sport (marka sprzętu; blog o ćwiczeniu bez jej sprzętu) | 5 | 02.11.2026 |
| dummies-paleo-hspu | https://www.dummies.com/article/home-auto-hobbies/food-drink/recipes/paleo-diet-recipes/advanced-push-for-paleo-fitness-the-handstand-push-up-203899/ | Wiley, seria poradników (K. Petrucci, P. Flynn „Paleo Workouts For Dummies”; wydawca ogólny, autorzy nie są uznanymi ekspertami treningu siłowego, recenzja ekspercka fragmentu niepotwierdzona) | 5 | 02.11.2026 |
| dfit-double-kb-press | https://dangerouslyfit.com.au/kettlebell-exercise/double-kettlebell-press | Dangerously Fit (sprzedawca sprzętu, AU; szkolenia trenerów niepotwierdzone przy korekcie) | 5 | 02.11.2026 (do zestawu otwartego) |
| strongandfit-double-kb-press | https://strongandfit.com/blogs/news/double-kettlebell-press | Strong And Fit (sprzedawca materiałów szkoleniowych) | 5 | 02.11.2026 (do zestawu otwartego) |
| crossfit-dkb-push-press-jerk | https://www.crossfit.com/essentials/double-kettlebell-push-press-and-jerk | CrossFit | 4 | 02.11.2026 (do zestawu otwartego) |
| dynamo-landmine-jammer | https://blog.dynamofitness.com.au/?p=2718 | Dynamo Fitness (sprzedawca sprzętu, AU) | 5 | 02.11.2026 (jedno źródło, Otwarte) |

Niezależność: po korekcie każde zdanie w bloku JSON ma ≥ 2 różne organizacje szczebla 4 (BarBend, OriGym, Human Kinetics).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie / zdanie | powód |
|---|---|
| Landmine Press — `ohp.mis.arch`, `ohp.mis.shrug` (wycofane z bloku 02.11.2026) | po korekcie tylko BarBend (Common mistakes: Rib Flare; Incorrect Bar Path — without shrugging); The Prehab Guys (Compensation) → szczebel 5. Potrzebne drugie źródło szczebla 4 |
| Landmine Press — `press.noLock` (zestaw ogólny) | źródła się różnią: BarBend każe prostować „until your elbow locks out”, OriGym „avoiding elbow lockout”. Nie wpisuję żadnego wariantu |
| Landmine Press — `mis.jerk` (zestaw ogólny) | żadne przeczytane źródło nie wymienia szarpania jako błędu; The Prehab Guys pisze tylko, że wersja z klęku eliminuje rozpęd z nóg |
| Landmine Press — rozstaw stóp / klęk | tylko OriGym podaje rozstaw stóp; pozostałe opisują klęk jednonóż. Zdanie `lm.setup` celowo nie mówi o stopach. Do sprawdzenia, jaką pozycję pokazuje figura |
| Landmine Press — nadgarstek prosty, prasa nie przez linię środka ciała | po 1 źródle (BarBend, Human Kinetics) |
| Pike Push Up — `pike.setup`, `pike.move`, `pike.mis.hips`, `pike.mis.shallow` (wycofane z bloku 02.11.2026) | po korekcie tylko NASM (Step 1; Step 3; Common Mistakes „allowing hips to sag”); Major Fitness i weighttraining.guide → szczebel 5 |
| Pike Push Up — `plank.brace` (zestaw ogólny) | tylko NASM („Engage your core”); dwa pozostałe źródła mówią o plecach, nie o brzuchu |
| Pike Push Up — `push.mis.partial` (zestaw ogólny) | częściowo sprzeczny: NASM zaleca, by na górze nie blokować łokci, a zdanie mówi „bez wyprostu na górze” jako błąd. Zastąpione przez `pike.mis.shallow` (też otwarte) |
| Pike Push Up — łokcie | źródła sprzeczne: NASM wymienia rozchodzące się łokcie jako błąd, Major Fitness każe je rozchylać. Nie wpisuję |
| Pike Push Up — plecy neutralne / bez łuku | Major Fitness („avoid arching your back”) i weighttraining.guide („neutral back”) — oba po korekcie szczebla 5 |
| Handstand Push Up — `hspu.setup`, `hspu.move`, `hspu.triangle`, `plank.brace`, `ohp.mis.arch` (wycofane z bloku 02.11.2026) | po korekcie tylko CrossFit (Hand placement; Head position; Body position); Fringe Sport i fragment poradnika (Wiley) → szczebel 5 |
| Handstand Push Up — łokcie idą do tyłu przy opuszczaniu | tylko CrossFit (przeczytane). Inna strona z wyników wyszukiwania była stroną marki odzieżowej, nieprzeczytaną |
| Handstand Push Up — powolne tempo, wersja z wymachem (kip), progresje | poza zakresem (zadanie: tylko technika). Twierdzenia o urazach z wyników wyszukiwania pominięte |
| Double Kettlebell Press — bez minimalnego zestawu | setup „Oba kettlebelle na barkach: łokcie przy tułowiu, nadgarstki proste.” (crossfit-dkb-push-press-jerk: Rack Position — szczebel 4; dfit-double-kb-press: teaching point 1 i strongandfit: Setup — szczebel 5). Ruch `ohp.move` (dfit: pkt 1–4; strongandfit: Steps 2–3 — oba szczebla 5). Brakuje drugiego źródła szczebla 4 dla ustawienia i ruchu oraz błędu z 2 źródeł |
| Double Kettlebell Press — `ohp.mis.lock`, `ohp.tall`, `ohp.elbowsUnder` (zestaw ogólny) | `ohp.mis.lock`: niepotwierdzone, oba źródła każą w pełni wyprostować ręce („so the arm is straight”, „fully extending your arms”). `ohp.elbowsUnder`: tylko Dangerously Fit („keep the forearm vertical”). `ohp.tall`: brak 2 źródeł dla wyciskania ścisłego |
| Kettlebell Seated Press | strona producenta kettlebelli z opisem wyciskania siedząc zwróciła HTTP 402, a Muscle & Strength — 403 (i szczebel otwarty wg rozstrzygnięcia). Reszta wyników to strony aplikacji. Zestaw ogólny (`ohp.elbowsUnder`, `ohp.fullExt`, `ohp.mis.lock`) niepotwierdzony dla tego wariantu |
| Kettlebell Arnold Press | znalezione opisy to głównie strony aplikacji (wykluczone). Pozostałe nieprzeczytane albo z serwisów o niepewnym szczeblu; według wyników wyszukiwania różnią się co do startu dłoni (rack vs dłoń do twarzy). Zestaw ogólny niepotwierdzony |
| Seated Cable Shoulder Press — błąd w zestawie ogólnym | zestaw używa `ohp.seat` („…hantle przy barkach”), a w tym ćwiczeniu są uchwyty wyciągu, nie hantle. Zdanie nie pasuje do wariantu. Lepiej `cohp.setup` (stoi albo siedzi między dolnymi wyciągami), ale jego źródła (ExRx wersja stojąca + ACE maszyna) nie obejmują wprost wersji siedzącej z wyciągami |
| Seated Cable Shoulder Press — źródła | nie znalazłem 2 źródeł spoza aplikacji. Instrukcja producenta (bramownica z ramionami do wyciskania) dotyczy maszyny, nie dolnych wyciągów |
| Landmine Linear Jammer / Single-Arm Linear Jammer | jedno źródło szczebla 5 (Dynamo Fitness, sprzedawca: jednorącz, wyciskanie z barku bez pracy nóg, druga dłoń na boku tułowia). Tekst zbieżny z opisem w dużym serwisie, więc prawdopodobnie przepisany, a nie niezależny. Zestaw ogólny `pp.legs` (siła z nóg) jest z nim sprzeczny dla wersji z tej strony. Inne przeczytane strony (NFPT, Performance Herts, Fitness Education AU) jammera nie opisują. Wymaga ustalenia, którą wersję pokazuje figura |
| StrongFirst (HSPU, kettlebell press) | strona zwraca HTTP 307 bez treści w narzędziu, nieprzeczytana |

## Stan

Wszystkie 9 ćwiczeń przejrzane: po korekcie 1 częściowe (Landmine Press), 8 otwartych. Następny krok (gdyby ktoś wracał): drugie źródło
szczebla 4 dla Pike Push Up i Handstand Push Up (organizacje szkolące trenerów), błędy Landmine Press; zestawy kettlebellowe i jammery wymagają źródeł
spoza stron aplikacji i sprzedawców. Pułapki: StrongFirst 307, Kettlebell Kings 402, Muscle & Strength 403, ExRx 403, Wayback zablokowane.

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria (a)(b)(c); producent liczy się tylko dla własnego rodzaju sprzętu;
sprzedawcy i blogi marketingowe — 5). Autor, data i charakter stron OriGym i The Prehab Guys sprawdzone przez WebFetch 02.11.2026; bez nowych badań treści.

Źródła:
- prehab-hk-sa-landmine-press (The Prehab Guys): 4 → 5 — firma z płatnymi programami i aplikacją, strony bez autora i kwalifikacji.
- majorfitness-pike-push-up (Major Fitness): 4 → 5 — producent, ale pompka bez sprzętu nie jest jego rodzajem sprzętu.
- wtg-pike-push-up (weighttraining.guide): 4 → 5 — serwis jednego autora, bez redakcji i recenzji eksperckiej.
- fringe-hspu-3-things (Fringe Sport): 4 → 5 — blog marki sprzętu o ćwiczeniu bez jej sprzętu.
- dummies-paleo-hspu (Wiley, poradnik): 4 → 5 — wydawca ogólny, autorzy nie są uznanymi ekspertami treningu siłowego, recenzja ekspercka niepotwierdzona.
- dfit-double-kb-press (Dangerously Fit): 4 → 5 — sprzedawca; szkolenia trenerów niepotwierdzone (źródło tylko w „Otwarte”).
- strongandfit-double-kb-press: 4/5 → 5 — sprzedawca.
- dynamo-landmine-jammer (Dynamo Fitness): 4 → 5 — sprzedawca.
- origym-landmine-press (OriGym): 4 → 4 — ośrodek szkolący trenerów, autor z kwalifikacjami, data aktualizacji.
- hk-landmine-one-arm (Human Kinetics): 4 → 4 — autor nie NSCA ani naukowiec, więc nie szczebel 3; wydawca z redakcją, autor trener.
- barbend-landmine-press: 4 → 4 (artykuł o technice). nasm-pike-push-up, crossfit-hspu-master, crossfit-dkb-push-press-jerk: 4 → 4.

Ćwiczenia:
- Landmine Press: gotowe → częściowe (bez błędu; `ohp.mis.arch`, `ohp.mis.shrug` wycofane).
- Pike Push Up: gotowe → otwarte.
- Handstand Push Up: gotowe (tylko technika) → otwarte.
- Pozostałe 6 ćwiczeń: otwarte → otwarte.
