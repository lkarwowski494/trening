# overhead_press (cz. 1b) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Kontynuacja `overhead_press-cz1.md` (pliku nie zmieniano; id źródeł i zdań z cz1 użyte bez dublowania).
Zakres: drugie źródło dla błędu w Arnold Press, Seated Barbell Military Press, Kettlebell Press, Band Shoulder Press;
źródła dla Bradford Press i See-Saw Press. Szczeble wg „Rozstrzygnięcia szczebli źródeł” koordynatora (02.11.2026).
Wszystkie źródła poniżej przeczytane przez WebFetch 02.11.2026. Strony innych aplikacji treningowych pominięte.

## Ćwiczenia
| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Arnold Press | gotowe | Po nowych szczeblach Breaking Muscle = 5 i nie jest niezależny od BarBend — cz1 zostałby z jednym źródłem. Drugie niezależne źródło szczebla 4: ISSA (artykuł firmowany, 05.02.2024, sekcja Arnold Press i Common mistakes). Błąd `ohp.mis.arch` (nowe). `arnold.setup` — zmiana tekstu na część wspólną (wysokość hantli różna w źródłach) |
| Seated Barbell Military Press | gotowe | Po nowych szczeblach Generation Iron i Legion = 5 — zostaje ACE 43; drugie źródło: ISSA (sekcja Seated Variations wprost wymienia seated barbell press: „upper-body form … very similar” do wersji stojącej). Nowe `ohp.bbGrip` zamiast `ohp.bbSetup`/`ohp.bbSeat`; błędy `ohp.mis.flare` i `ohp.mis.arch` (ISSA jako błąd + ACE jako wskazówka przeciwna) |
| Kettlebell Press | gotowe | Błąd `ohp.mis.leanBack` (nowe): The Prehab Guys + StrongFirst (organizacja certyfikująca instruktorów kettlebell; autor Master Instructor) |
| Band Shoulder Press | gotowe | Nowe źródło: Bodylastics (producent gum — własny rodzaj sprzętu). Błąd `ohp.mis.arch`: The Prehab Guys (Compensations) jako błąd + Bodylastics jako wskazówka przeciwna („keep your back straight”) — do akceptacji koordynatora (patrz Otwarte) |
| Bradford Press | otwarte | jedno źródło: Fitness Volt (wersja stojąca); pozostałe przeczytane — szczebel 5 albo inny sprzęt/pozycja |
| See-Saw Press (Alternating Side Press) | otwarte | jedno źródło szczebla 4 (Catalyst Athletics #797) i opisuje wersję bez pochylenia bocznego — nie ten sam wariant co „Alternating Side Press” |

### Zmiana stanu ćwiczeń z cz1 po rozstrzygnięciu szczebli (ocena źródeł poprzednika)
| Źródło (id z cz1) | Ocena | Uzasadnienie (kryteria a/b/c) |
|---|---|---|
| healthline-behind-the-neck-press | 4 | (a) serwis z redakcją i recenzją ekspercką (recenzent NASM-CPT), (b) autor i recenzent z datą, (c) artykuł o technice |
| generationiron-* (3 strony) | 5 | (a) brak recenzji eksperckiej/redakcji merytorycznej (strona seated: „may contain affiliate links”, autor bez wymienionych kwalifikacji, bez recenzenta) |
| legion-seated-overhead-press | 5 | (c) blog firmy suplementowej — treść marketingowa |
| garagestrength-btn-push-press | 5 | (a) ośrodek trenujący zawodników i sprzedający programy, nie szkoli ani nie certyfikuje trenerów; bez recenzji |
| performanceherts-single-arm-shoulder-press | 5 | (a) aktualność ośrodka sportowego uczelni („exercise of the month”), nie organizacja szkoląca trenerów ani serwis z recenzją |
| breakingmuscle-arnold-press | 5 | rozstrzygnięcie koordynatora; nie niezależny od BarBend |
| Pfizer (przeczytane, nieużyte) | 5 | brak autora i recenzenta |
| physitrack-* | 4 (istniejąca org) — DO DECYZJI | treść firmowana, biblioteka dla fizjoterapeutów; Physitrack to jednak platforma programowa — sprawdzić, czy nie podpada pod „dokumentacja innych aplikacji” |
| catalyst-*, ace-43, ace-395, barbend-arnold-press, prehabguys-* | 4 | bez zmian |

Skutek dla kart z cz1:
- **Arnold Press**: bez tej części — jedno źródło; z ISSA (niżej) — gotowe.
- **Single Arm Overhead Press (hantel)**: gotowe → **otwarte (jedno źródło)** — zostaje tylko Physitrack (a i ten do decyzji). Generation Iron i Performance Herts = 5. Nie szukano zastępstwa (poza zakresem zadania).
- **Seated Barbell Military Press**: bez tej części — jedno źródło (ACE 43); z ISSA — gotowe (blok niżej zastępuje wpis z cz1).
- **Standing Barbell Press Behind Neck**: bez zmian — gotowe (Catalyst + Healthline, oba 4). Generation Iron wypada jako trzecie źródło.
- **Push Press - Behind the Neck**: gotowe → **otwarte (jedno źródło: Catalyst)** — Garage Strength = 5.
- **Kettlebell Press**, **Band Shoulder Press**: bez zmian w ustawieniu/ruchu; teraz gotowe (blok niżej).

## Blok JSON do data/zrodla/cues.json (sekcja exercises)
Pełne wpisy (zdania z cz1 + nowe). Wpisy z cz1 dla tych ćwiczeń zastępowane w całości; źródła szczebla 5 usunięte z list.
```json
{
 "Arnold Press": {
  "setup": [
   {"c": "arnold.setup", "s": [["barbend-arnold-press", "How to: Set Up (palms facing you)"], ["issa-overhead-press-mistakes", "Arnold Press (dumbbell in each hand, palms facing the body)"]]}
  ],
  "move": [
   {"c": "arnold.move", "s": [["barbend-arnold-press", "How to: Rotate and Press; Reverse It"], ["issa-overhead-press-mistakes", "Arnold Press (rotate the weights about 180 degrees away from the face while pressing; slowly reverse to the start)"]]}
  ],
  "tips": [
   {"c": "arnold.together", "s": [["barbend-arnold-press", "Coach's tip (rotate and press at the same time)"], ["issa-overhead-press-mistakes", "Arnold Press (in one controlled motion)"]]}
  ],
  "mistakes": [
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Common mistakes: Lower back arch"], ["barbend-arnold-press", "FAQ — wersja stojąca (avoid overextending your lower back)"], ["fitnessvolt-arnold-press-mistakes", "Mistakes: Excessive Lower Back Arch"]]}
  ]
 },
 "Seated Barbell Military Press": {
  "setup": [
   {"c": "ohp.bbGrip", "s": [["ace-43", "opis, zdania 1–2 (grip a little wider than shoulder-width; bar lowered to the front of the shoulders, about chin height)"], ["issa-overhead-press-mistakes", "Standing Barbell Overhead Press (grip just outside shoulder width; bar across the front of the shoulders) + Seated Variations (upper-body form very similar)"]]}
  ],
  "move": [
   {"c": "ohp.move", "s": [["ace-43", "opis, zdania 3–4 (press directly overhead; slowly lower to chin height)"], ["issa-overhead-press-mistakes", "Standing Barbell Overhead Press (press straight up until the elbows are extended; return to the start) + Seated Variations"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "ohp.mis.flare", "s": [["issa-overhead-press-mistakes", "Common mistakes: Elbow flare (the elbows should point forward)"], ["ace-43", "opis, zdanie 3 (keep the elbows pointed forward)"]]},
   {"c": "ohp.mis.arch", "s": [["issa-overhead-press-mistakes", "Common mistakes: Lower back arch; Seated Variations (seated helps minimize the arch)"], ["ace-43", "opis, zdanie 1 (keep the back straight)"]]}
  ]
 },
 "Kettlebell Press": {
  "setup": [
   {"c": "kbp.setup", "s": [["ace-395", "opis (kettlebell at chest height on the forearm near the shoulder, elbow close to the ribs)"], ["prehabguys-standing-single-arm-ohp-kb", "Setup (weight resting on the back of the arm; elbow close to the side)"]]}
  ],
  "move": [
   {"c": "kbp.move", "s": [["ace-395", "opis (press straight overhead; bring the elbow back down to the rib cage)"], ["prehabguys-standing-single-arm-ohp-kb", "Setup and movement; mistake „lowering the weight in front”"]]}
  ],
  "tips": [],
  "mistakes": [
   {"c": "ohp.mis.leanBack", "s": [["prehabguys-standing-single-arm-ohp-kb", "Movement/Compensations (keep your back upright; don't arch)"], ["strongfirst-mastering-your-press-1", "Safety, punkt 3 (lean back as a change of shape — stop the attempt); punkt 5 (increasing lean)"]]}
  ]
 },
 "Band Shoulder Press": {
  "setup": [
   {"c": "band.ohpSetup", "s": [["prehabguys-overhead-press-band", "Setup (band anchored under the feet, one end in each hand)"], ["bodylastics-standing-shoulder-press", "Start and Finish Positions (stand on the bands with your front foot; handles at shoulder level)"], ["physitrack-shoulder-press-band", "Setup (band placed under your feet)"]]}
  ],
  "move": [
   {"c": "band.ohpMove", "s": [["prehabguys-overhead-press-band", "Movement, punkty 2–4"], ["bodylastics-standing-shoulder-press", "Movement (press the handles overhead; lower under control)"], ["physitrack-shoulder-press-band", "Movement (press towards the ceiling; return in a controlled manner)"]]}
  ],
  "tips": [
   {"c": "ohp.tall", "s": [["bodylastics-standing-shoulder-press", "Start and Finish Positions (back straight, head straight, chest up)"], ["prehabguys-overhead-press-band", "Movement, punkt 1 (rest of the body still); punkt 2 (arms in line with the ears)"], ["physitrack-shoulder-press-band", "Setup (stand tall)"]]}
  ],
  "mistakes": [
   {"c": "ohp.mis.arch", "s": [["prehabguys-overhead-press-band", "Compensations (arching the back)"], ["bodylastics-standing-shoulder-press", "Start and Finish Positions (keep your back straight) — wskazówka przeciwna, nie lista błędów"]]}
  ]
 }
}
```

## Nowe zdania (id | PL | EN)
| id | PL | EN |
|---|---|---|
| arnold.setup (ZMIANA tekstu z cz1) | Hantle z przodu, dłonie zwrócone do ciebie. | Dumbbells in front of you, palms facing you. |
| ohp.bbGrip | Chwyt trochę szerzej niż barki; sztanga z przodu barków. | Grip a little wider than your shoulders; bar in front of your shoulders. |
| ohp.mis.arch | Wyginanie lędźwi w łuk przy wyciskaniu. | Arching your lower back as you press. |
| ohp.mis.flare | Łokcie uciekają na boki zamiast iść do przodu. | Elbows flaring out to the sides instead of pointing forward. |
| ohp.mis.leanBack | Odchylanie się w tył, żeby wycisnąć ciężar. | Leaning back to get the weight up. |

`arnold.setup`: cz1 miało „Hantle przed twarzą…”; BarBend — „face height”, Fitness Volt — „shoulder height”, ISSA — bez wysokości. Zostaje część wspólna.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)
| id | adres | organizacja | szczebel | data |
|---|---|---|---|---|
| issa-overhead-press-mistakes | https://issaonline.com/blog/post/overhead-press-proper-form-variations-and-common-mistakes | ISSA (treść firmowana, 05.02.2024; sekcje: Standing Barbell Overhead Press, Arnold Press, Seated Variations, Common mistakes) | 4 | 02.11.2026 |
| strongfirst-mastering-your-press-1 | https://www.strongfirst.com/mastering-your-press-part-i/ | NOWA org „StrongFirst” — organizacja certyfikująca instruktorów kettlebell; autor F. Zonin (StrongFirst Certified Master Instructor); bez daty na stronie (komentarze z 12.2021) | 4 | 02.11.2026 |
| bodylastics-standing-shoulder-press | https://bodylastics.com/standing-shoulder-press-with-bands | Bodylastics (istniejąca? sprawdzić w `orgs`) — producent gum, treść firmowana, bez daty | 4 (producent, własny sprzęt) | 02.11.2026 |
| fitnessvolt-arnold-press-mistakes | https://fitnessvolt.com/arnold-press-mistakes/ | NOWA org „Fitness Volt” — serwis specjalistyczny; autor P. Dale (Training Editor, asesor kwalifikacji trenerskich), 24.10.2025; recenzent strony nienazwany, brak informacji o afiliacji na stronie — DO DECYZJI (jak BarBend: tylko artykuły o technice). Użyte tylko jako trzecie źródło | 4? | 02.11.2026 |
| fitnessvolt-bradford-press | https://fitnessvolt.com/bradford-press/ | Fitness Volt (P. Dale, 22.07.2022, zm. 11.08.2024) | 4? | 02.11.2026 |
| catalyst-alternating-db-press | https://catalystathletics.com/exercise/797/Alternating-Dumbbell-Press/ | Catalyst Athletics | 4 | 02.11.2026 |

Przeczytane, nieużyte: StrongFirst „Test Your Kettlebell Military Press” (bez autora i daty; błędy ogólne: tor, napięcie, rytm),
Fitness Volt „Barbell Seated Behind Head Military Press” (wersja zza karku, nie z przodu), Fitness Volt „Barbell Seated Bradford Press”
(strona wewnętrznie sprzeczna: pełny wyprost w krokach, „slight bend” w błędach), Generation Iron „Seated Overhead Press” (ponownie — szczebel 5),
Iron Man Magazine „The Bradford Press” (C. Poliquin, 2012 — bez instrukcji wykonania). Niedostępne: menshealth.com (blokada narzędzia),
ufhealth.org PDF (503), barbend.com i breakingmuscle.com „seated overhead press” (404). Pominięte jako strony aplikacji/sprzedawców:
wyniki z bazami ćwiczeń aplikacji, sklepy z suplementami i sprzętem (nie producenci gum).

## Otwarte (ćwiczenie/zdanie | powód)
| ćwiczenie / zdanie | powód |
|---|---|
| Błąd jako „negacja wskazówki” (Seated Barbell: ACE; Band: Bodylastics) | drugie źródło nie podaje błędu na liście błędów, tylko wskazówkę przeciwną („keep the back straight”, „keep the elbows pointed forward”). Treść zgodna; do akceptacji koordynatora, czy to „2 zgodne źródła” dla błędu. Jeśli nie — Seated Barbell i Band wracają do stanu „bez błędu” |
| Arnold Press — `ohp.elbowsUnder` | ISSA (start: elbows under the wrists) + Fitness Volt (Improper Elbow/Wrist Alignment: łokcie pod nadgarstkami na każdym etapie). Dodać tylko, jeśli Fitness Volt zostanie uznany za szczebel 4 |
| Arnold Press — `ohp.mis.lock` / pełny wyprost | sprzeczność trwa: ISSA („elbows fully extend at the top”) vs Fitness Volt („stop short of locking your elbows”) — nie dodano ani `ohp.fullExt`, ani `ohp.mis.lock` |
| Arnold Press — „za słaby obrót dłoni” | tylko BarBend (Common Mistakes: Not Rotating Enough); Breaking Muscle = 5, nie niezależny |
| Seated Barbell Military Press — `ohp.bbSeat`, `ohp.feet` | tylko ACE 43 (Generation Iron, Legion = 5) — jedno źródło |
| Seated Barbell Military Press — `ohp.barClose` | ACE: „directly overhead”; ISSA: głowa wraca do przodu, gdy sztanga minie twarz — „blisko twarzy” wprost tylko u Generation Iron (5); nie dodano |
| Seated Barbell Military Press — `ohp.bbSetup` (zdjęcie ze stojaka na wysokości barków) | wysokość stojaka przy wersji siedzącej — tylko Generation Iron (5); zastąpione `ohp.bbGrip` |
| Seated Barbell — łokcie (ISSA/ACE „do przodu”) vs Legion (ok. 45°) | Legion = 5 — niższy szczebel, nie blokuje; różnica zapisana |
| Kettlebell Press — pochylenie | ACE 395 mówi o przeniesieniu ciężaru ciała w przód (stopa z przodu); StrongFirst dopuszcza pewne pochylenie przy dużych ciężarach, byle nie rosło w trakcie (punkt 5). `ohp.mis.leanBack` mówi o odchylaniu się w tył „żeby wycisnąć” — zgodne z obiema stronami, ale przy recenzji sprawdzić brzmienie |
| Band Shoulder Press — wyprost | Bodylastics: „almost fully straight”; Physitrack: pełny wyprost — nie dodano zdań o blokowaniu |
| Single Arm Overhead Press (hantel) | po nowych szczeblach jedno źródło (Physitrack, sam do decyzji). Kandydat do uzupełnienia: ISSA (standing dumbbell — nie wprost jednorącz), ACE — poza zakresem tej części |
| Push Press - Behind the Neck | po nowych szczeblach jedno źródło (Catalyst); Garage Strength = 5 |
| Bradford Press | Fitness Volt (stojąca: chwyt trochę szerzej niż barki, sztanga do wysokości czubka głowy, bez blokowania łokci, przód → za kark → przód, bez pomocy nóg) — jedno źródło (i szczebel do decyzji). RitFit — producent, ale tylko maszyna Smitha; BoxRox, Generation Iron = 5; Fitness Volt seated — sprzeczna wewnętrznie. Zostaje `open`. Zdania `ohp.move`/`ohp.fullExt` nadal byłyby błędne |
| See-Saw Press (Alternating Side Press) | jedyne źródło szczebla 4 (Catalyst #797, Alternating Dumbbell Press) opisuje wyciskanie naprzemienne bez pochylenia bocznego, z pełnym zablokowaniem — to inny wariant niż „side press” z pochyleniem. Pozostałe wyniki: bazy aplikacji, sklep z suplementami, serwis konsumencki (wersja z kettlebellami). Nie przenosić `ohp.mis.lock`, `ohp.tall`, `ohp.elbowsUnder`; zostaje `open`. Do decyzji produktowej: czy ćwiczenie ma oznaczać wersję naprzemienną bez pochylenia (wtedy Catalyst + jeszcze jedno źródło) |
| Physitrack jako źródło | platforma programowa dla fizjoterapeutów — do decyzji koordynatora wg punktu „dokumentacja innych aplikacji”. Bez Physitrack: Band nadal gotowe (Prehab Guys + Bodylastics); Single Arm — zero źródeł szczebla 4 |
