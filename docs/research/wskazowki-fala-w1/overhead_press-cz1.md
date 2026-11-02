# overhead_press (cz. 1) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zakres: Arnold Press; Single Arm Overhead Press (hantel); Seated Barbell Military Press; Kettlebell Press; Band Shoulder Press;
Standing Barbell Press Behind Neck; Push Press - Behind the Neck; Bradford Press; See-Saw Press (Alternating Side Press).
ExRx (403) i Wayback (zablokowane w narzędziu) niedostępne — wszystkie źródła poniżej przeczytane bezpośrednio 02.11.2026.
Strony innych aplikacji treningowych pominięte (uzupełnienie briefu, pkt 1).

Główny wniosek dla zestawów ogólnych: `ohp.mis.lock` („Gwałtowne blokowanie łokci na górze”) i część „bez gwałtownego blokowania”
w `ohp.fullExt` nie mają potwierdzenia w ŻADNYM przeczytanym źródle dla tych wariantów, a kilka źródeł wprost każe zablokować łokcie
(Catalyst Athletics: „Lock the overhead position forcefully”; Physitrack: „ensuring your arm is fully locked out”). Inne mówią
o lekkim ugięciu (Performance Herts, Pfizer, BoxRox/RitFit dla Bradford). Wniosek: przy obecnych źródłach `ohp.mis.lock` nie trafia
na żadną z kart tej części — sprzeczność opisana w „Otwarte”.

## Ćwiczenia
| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Arnold Press | otwarte (częściowe) | ustawienie, ruch, wskazówka — po 2 źródła szczebla 4; błąd bez 2 zgodnych źródeł (sprzeczność co do wyprostu). Zestaw ogólny `ohp.tall`, `ohp.fullExt`, `ohp.mis.lock` — niepotwierdzony |
| Single Arm Overhead Press (hantel) | gotowe | `ohp.tall` potwierdzone (3 źródła); `ohp.elbowsUnder`, `ohp.mis.lock` — nie |
| Seated Barbell Military Press | otwarte (częściowe) | ustawienie, ruch, 2 wskazówki — po 2–3 źródła; błąd bez 2 źródeł. `ohp.seat` (mówi o hantlach) nie pasuje — nowe `ohp.bbSeat` |
| Kettlebell Press | otwarte (częściowe) | ustawienie i ruch — 2 źródła; wskazówka i błąd po 1 źródle. `ohp.tall`, `ohp.elbowsUnder` — niepotwierdzone |
| Band Shoulder Press | otwarte (częściowe) | ustawienie, ruch, `ohp.tall` — 2 źródła (jedno w wersji jednorącz); błąd po 1 źródle |
| Standing Barbell Press Behind Neck | gotowe | `ohp.tall` NIE pasuje (lekkie pochylenie tułowia w przód wg Catalyst) — własne zdanie `ohp.btnStill`; `ohp.fullExt`/`ohp.mis.lock` przeczy źródłu |
| Push Press - Behind the Neck | gotowe | `pp.setup` NIE pasuje (sztanga z przodu) — nowe `pp.btnSetup`; `pp.move`, `pp.dip`, `pp.legs` pasują; `ohp.mis.lock` przeczy obu źródłom |
| Bradford Press | otwarte | brak 2 źródeł dla wariantu ze sztangą wolną; zostaje tryb `open`. UWAGA: `ohp.move`/`ohp.fullExt` byłyby błędne (ruch bez wyprostu rąk) |
| See-Saw Press (Alternating Side Press) | otwarte | nie znaleziono żadnego źródła szczebla 4 poza bazami aplikacji; `ohp.tall`/`ohp.elbowsUnder` nie przenosić (próbna recenzja 02.11.2026) |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)
Wpisy „otwarte (częściowe)” podane jako propozycja — do użycia tylko, jeśli koordynator dopuszcza kartę bez sekcji błędów.
```json
{
 "Arnold Press": {
  "setup": [
   {"c": "arnold.setup", "s": [["barbend-arnold-press", "How to: Set Up (weights at face height, palms facing you)"], ["breakingmuscle-arnold-press", "Step 1 (weights in front of the mouth, palms toward the face)"]]}
  ],
  "move": [
   {"c": "arnold.move", "s": [["barbend-arnold-press", "How to: Rotate and Press; Reverse It"], ["breakingmuscle-arnold-press", "Step 2; Step 3"]]}
  ],
  "tips": [
   {"c": "arnold.together", "s": [["barbend-arnold-press", "Coach's tip (rotate and press at the same time)"], ["breakingmuscle-arnold-press", "Step 2, Form tip (blend the press with the rotation)"]]}
  ],
  "mistakes": []
 },
 "Single Arm Overhead Press (hantel)": {
  "setup": [
   {"c": "ohp.saSetup", "s": [["physitrack-overhead-press-single-arm-db", "instrukcja, zdanie 1 (feet hip width apart, dumbbell in one hand at shoulder level)"], ["generationiron-single-arm-shoulder-press", "How to, kroki 1–2 (feet hip-width, dumbbell to shoulder height)"], ["performanceherts-single-arm-shoulder-press", "How to perform, punkty 1–2"]]}
  ],
  "move": [
   {"c": "ohp.saMove", "s": [["physitrack-overhead-press-single-arm-db", "instrukcja, zdania 2–3"], ["generationiron-single-arm-shoulder-press", "How to, kroki 3–4"], ["performanceherts-single-arm-shoulder-press", "How to perform, punkty 3–4 (straighten your elbow; lower slowly)"]]}
  ],
  "tips": [
   {"c": "ohp.tall", "s": [["physitrack-overhead-press-single-arm-db", "instrukcja, zdanie 1 (stand tall)"], ["generationiron-single-arm-shoulder-press", "How to, krok 4 (keep the back upright)"], ["performanceherts-single-arm-shoulder-press", "Tips (torso steady; press directly overhead)"]]}
  ],
  "mistakes": [
   {"c": "ohp.mis.lean", "s": [["performanceherts-single-arm-shoulder-press", "Tips (don't let the torso lean or sway)"], ["generationiron-single-arm-shoulder-press", "How to, kroki 1 i 4 (no arching of the lower back; back stays straight)"]]}
  ]
 },
 "Seated Barbell Military Press": {
  "setup": [
   {"c": "ohp.bbSeat", "s": [["ace-43", "Step 1 (sit with the back upright)"], ["generationiron-seated-overhead-press", "Setup (upper back against the pad)"], ["legion-seated-overhead-press", "Setup (back against the pad)"]]},
   {"c": "ohp.bbSetup", "s": [["ace-43", "Steps 1–2 (grip slightly wider than shoulders; lift the bar out of the rack, to chin height in front of the shoulders)"], ["generationiron-seated-overhead-press", "Setup (bar racked at about shoulder height; grip just outside shoulder width; bar under the chin)"]]}
  ],
  "move": [
   {"c": "ohp.move", "s": [["ace-43", "Steps 4–5 (push the bar straight up; lower slowly to chin height)"], ["generationiron-seated-overhead-press", "Press; Lockout; Lowering"], ["legion-seated-overhead-press", "Execution (press until the arms lock out; lower to collarbone height)"]]}
  ],
  "tips": [
   {"c": "ohp.feet", "s": [["ace-43", "Step 3 (drive the feet into the floor)"], ["legion-seated-overhead-press", "Setup (plant your feet)"]]},
   {"c": "ohp.barClose", "s": [["generationiron-seated-overhead-press", "Press (bar close to your face)"], ["legion-seated-overhead-press", "Execution (head back as the bar passes, then head and chest forward under it)"], ["ace-43", "Step 4 (straight up)"]]}
  ],
  "mistakes": []
 },
 "Kettlebell Press": {
  "setup": [
   {"c": "kbp.setup", "s": [["ace-395", "opis (kettlebell at chest height on the forearm near the shoulder, elbow close to the ribs)"], ["prehabguys-standing-single-arm-ohp-kb", "Setup (weight resting on the back of the arm; elbow close to the side)"]]}
  ],
  "move": [
   {"c": "kbp.move", "s": [["ace-395", "opis (press straight overhead; bring the elbow back down to the rib cage)"], ["prehabguys-standing-single-arm-ohp-kb", "Setup and movement; mistake „lowering the weight in front”"]]}
  ],
  "tips": [],
  "mistakes": []
 },
 "Band Shoulder Press": {
  "setup": [
   {"c": "band.ohpSetup", "s": [["prehabguys-overhead-press-band", "Setup (band anchored under the feet, one end in each hand)"], ["physitrack-shoulder-press-band", "Setup (band placed under your feet)"]]}
  ],
  "move": [
   {"c": "band.ohpMove", "s": [["prehabguys-overhead-press-band", "Movement, punkty 2–4"], ["physitrack-shoulder-press-band", "Movement (press towards the ceiling; return in a controlled manner)"]]}
  ],
  "tips": [
   {"c": "ohp.tall", "s": [["physitrack-shoulder-press-band", "Setup (stand tall)"], ["prehabguys-overhead-press-band", "Movement, punkt 1 (rest of the body still); punkt 2 (arms in line with the ears)"]]}
  ],
  "mistakes": []
 },
 "Standing Barbell Press Behind Neck": {
  "setup": [
   {"c": "ohp.btnSetup", "s": [["catalyst-press-behind-the-neck", "opis — ustawienie (bar behind the neck as for a back squat, jerk-width grip; squeeze the shoulder blades)"], ["healthline-behind-the-neck-press", "How-to (bar across the traps; grip wider than shoulder-width; squeeze shoulder blades together)"], ["generationiron-behind-the-neck-press", "How-to (wider than shoulder-width; base of the neck; squeeze shoulder blades) — wersja siedząca"]]}
  ],
  "move": [
   {"c": "ohp.btnMove", "s": [["catalyst-press-behind-the-neck", "opis — wykonanie (press straight up, lock out, lower under control to the back)"], ["healthline-behind-the-neck-press", "How-to (press straight up in line with the head; slow, controlled lowering)"]]}
  ],
  "tips": [
   {"c": "ohp.btnStill", "s": [["catalyst-press-behind-the-neck", "Notes (the trunk shouldn't change position; bar moves straight up)"], ["healthline-behind-the-neck-press", "Safety tips / mistakes (avoid moving the head or back forward)"]]}
  ],
  "mistakes": [
   {"c": "ohp.mis.btnDrop", "s": [["healthline-behind-the-neck-press", "Common mistakes (letting the bar fall back; bar striking the neck or the back of the head)"], ["catalyst-press-behind-the-neck", "opis — wykonanie (lower the bar under control; minimal bouncing)"]]}
  ]
 },
 "Push Press - Behind the Neck": {
  "setup": [
   {"c": "pp.btnSetup", "s": [["catalyst-push-press-behind-the-neck", "Setup (bar on the traps behind the neck as for a back squat)"], ["garagestrength-btn-push-press", "Setup (bar on your back, as in a back squat)"]]}
  ],
  "move": [
   {"c": "pp.move", "s": [["catalyst-push-press-behind-the-neck", "Dip; Drive; Lockout"], ["garagestrength-btn-push-press", "Dip; Drive; Lockout (quarter squat, drive with the legs, full extension)"]]}
  ],
  "tips": [
   {"c": "pp.dip", "s": [["catalyst-push-press-behind-the-neck", "Setup (brace the trunk); Dip (about 10% of height)"], ["garagestrength-btn-push-press", "Dip (quarter squat, chest tall); Drive (trunk braced)"]]},
   {"c": "pp.legs", "s": [["catalyst-push-press-behind-the-neck", "Drive; Lockout (legs accelerate the bar, arms finish)"], ["garagestrength-btn-push-press", "Drive (starting with the legs); mistakes (failing to finish with the upper body)"]]}
  ],
  "mistakes": [
   {"c": "pp.mis.hipsBack", "s": [["catalyst-push-press-behind-the-neck", "Notes (common error: sitting the hips back and leaning the chest forward in the dip)"], ["garagestrength-btn-push-press", "Dip (keep the chest tall)"]]}
  ]
 }
}
```

## Nowe zdania (id | PL | EN)
| id | PL | EN |
|---|---|---|
| arnold.setup | Hantle przed twarzą, dłonie zwrócone do ciebie. | Dumbbells in front of your face, palms facing you. |
| arnold.move | Wyciskaj hantle nad głowę, obracając dłonie — na górze patrzą do przodu; opuszczając, obróć je z powrotem do siebie. | Press the dumbbells overhead while turning your palms so they face forward at the top; turn them back toward you on the way down. |
| arnold.together | Obracaj i wyciskaj jednocześnie, a nie najpierw obrót, potem wyciśnięcie. | Rotate and press at the same time — not twist first, then press. |
| ohp.saSetup | Stań stabilnie, hantel w jednej ręce przy barku. | Stand steady with the dumbbell in one hand at your shoulder. |
| ohp.saMove | Wypchnij hantel nad głowę do wyprostu ręki; opuść go spokojnie z powrotem do barku. | Press the dumbbell overhead until your arm is straight; lower it under control back to your shoulder. |
| ohp.mis.lean | Bujanie tułowiem albo wyginanie lędźwi przy wyciskaniu. | Swaying your torso or arching your lower back as you press. |
| ohp.bbSeat | Usiądź prosto na ławce, plecy przy oparciu. | Sit up straight on the bench with your back against the pad. |
| ohp.barClose | Prowadź sztangę prosto w górę, blisko twarzy. | Press the bar straight up, close to your face. |
| kbp.setup | Kettlebell przy barku, oparty o przedramię; łokieć blisko żeber. | Kettlebell at your shoulder, resting on your forearm; elbow close to your ribs. |
| kbp.move | Wypchnij kettlebell prosto nad głowę; opuść go wzdłuż boku z powrotem do barku, łokieć blisko tułowia. | Press the kettlebell straight overhead; lower it along your side back to the shoulder, elbow close to your body. |
| band.ohpSetup | Stań na gumie i chwyć jej końce. | Stand on the band and hold its ends. |
| band.ohpMove | Wypchnij dłonie nad głowę; wracaj powoli do pozycji startowej. | Press your hands overhead; return slowly to the start. |
| ohp.btnSetup | Sztanga na górze pleców, chwyt szerszy niż barki; ściągnij łopatki. | Bar on your upper back, grip wider than your shoulders; squeeze your shoulder blades together. |
| ohp.btnMove | Wypchnij sztangę prosto w górę do wyprostu rąk; opuść ją spokojnie z powrotem na górę pleców. | Press the bar straight up until your arms are straight; lower it under control back to your upper back. |
| ohp.btnStill | Tułów nieruchomo — głowa i plecy nie idą w przód. | Keep your torso still — don't let your head or back drift forward. |
| ohp.mis.btnDrop | Puszczanie sztangi w dół bez kontroli, aż uderza w kark. | Letting the bar drop without control so it hits your neck. |
| pp.btnSetup | Sztanga na górze pleców, tak jak do przysiadu. | Bar on your upper back, as for a back squat. |
| pp.mis.hipsBack | Siadanie biodrami w tył i pochylanie klatki w przód przy ugięciu. | Sitting the hips back and tipping the chest forward in the dip. |

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)
| id | adres | organizacja | szczebel | data |
|---|---|---|---|---|
| barbend-arnold-press | https://barbend.com/arnold-press/ | BarBend (istniejąca) | 4 | 02.11.2026 |
| breakingmuscle-arnold-press | https://breakingmuscle.com/arnold-press/ (czytane pod https://breakingmuscle.com/?p=161424) | Breaking Muscle (istniejąca) | 4 | 02.11.2026 |
| physitrack-overhead-press-single-arm-db | https://us.physitrack.com/home-exercise-video/overhead-press---standing-single-arm-with-dumbbell | Physitrack (istniejąca) | 4 | 02.11.2026 |
| generationiron-single-arm-shoulder-press | https://generationiron.com/single-arm-shoulder-press-exercise-guide/ | NOWA org „Generation Iron” — serwis specjalistyczny; autor T. Ramos (ACSM-CPT, ISSA-CSCS) | 4 | 02.11.2026 |
| performanceherts-single-arm-shoulder-press | https://performanceherts.co.uk/news-exercise-of-the-month-1164 | NOWA org „Performance Herts” — ośrodek sportowy Uniwersytetu Hertfordshire, cytowany trener | 4 | 02.11.2026 |
| ace-43 | (istniejące) | ACE | 4 | ponownie przeczytane 02.11.2026 — sztanga i ławka ze stojakiem |
| generationiron-seated-overhead-press | https://generationiron.com/seated-overhead-press-build-muscle/ | Generation Iron (autor A. Coates, trener, bez wymienionych certyfikatów) | 4 | 02.11.2026 |
| legion-seated-overhead-press | https://legionathletics.com/seated-overhead-press | NOWA org „Legion Athletics” — blog firmy suplementowej; autor CPT, recenzja naukowa DPT, OCS, CSCS (do decyzji koordynatora, czy przyjąć jako serwis szczebla 4) | 4 | 02.11.2026 |
| ace-395 | https://www.acefitness.org/resources/everyone/exercise-library/395/single-arm-overhead-press/ | ACE (Single Arm Overhead Press #395, kettlebell) | 4 | 02.11.2026 |
| prehabguys-standing-single-arm-ohp-kb | https://theprehabguys.com/vimeo-video/standing-single-arm-overhead-press-kettlebell-2/ | The Prehab Guys (istniejąca) | 4 | 02.11.2026 |
| prehabguys-overhead-press-band | https://theprehabguys.com/vimeo-video/overhead-press-band/ | The Prehab Guys (istniejąca) | 4 | 02.11.2026 |
| physitrack-shoulder-press-band | https://us.physitrack.com/home-exercise-video/shoulder-press-with-resistance-band | Physitrack (istniejąca; opis jednorącz) | 4 | 02.11.2026 |
| catalyst-press-behind-the-neck | https://www.catalystathletics.com/exercise/204/Press-Behind-The-Neck/ | NOWA org „Catalyst Athletics” — ośrodek szkolenia podnoszenia ciężarów (G. Everett), biblioteka ćwiczeń | 4 | 02.11.2026 |
| catalyst-push-press-behind-the-neck | https://www.catalystathletics.com/exercise/88/Push-Press-Behind-The-Neck/ | Catalyst Athletics | 4 | 02.11.2026 |
| healthline-behind-the-neck-press | https://www.healthline.com/health/behind-the-neck-press | NOWA org „Healthline” — serwis zdrowotny; recenzent D. Bubnis (M.S., NASM-CPT) | 4 | 02.11.2026 |
| generationiron-behind-the-neck-press | https://generationiron.com/behind-the-neck-press/ | Generation Iron (autor T. Ramos; wersja siedząca) | 4 | 02.11.2026 |
| garagestrength-btn-push-press | https://www.garagestrength.com/blogs/news/how-to-behind-the-neck-push-press | NOWA org „Garage Strength” — ośrodek trenerski podnoszenia ciężarów (D. Miller), bez wymienionych certyfikatów; jeśli koordynator uzna za szczebel 5, Push Press - Behind the Neck ma jedno źródło | 4 | 02.11.2026 |

Przeczytane, nieużyte jako podstawa: Catalyst Athletics „Press” (https://www.catalystathletics.com/exercise/90/Press/ — wersja z przodu),
The Gym Group (sieć siłowni, strona bez autora — szczebel 5), Pfizer Health Answers (bez autora i recenzenta), Advanced Human Performance
(blog trenera dr. J. Seedmana), BoxRox (Bradford; autor bez kwalifikacji), RitFit (producent sprzętu; Bradford tylko na maszynie Smitha),
Iron Edge (strona sklepu bez treści o technice), Dummies (bez autora). Niedostępne: kettlebellkings.com (402), tao.dragondoor.com
(domena poza dozwoloną siecią sesji), elitefts.com (404), muscleandstrength.com (403), barbend.com dla wyciskania zza karku i kettlebell (404).

## Otwarte (ćwiczenie/zdanie | powód)
| ćwiczenie / zdanie | powód |
|---|---|
| `ohp.mis.lock` / `ohp.fullExt` — cała część 1 | źródła się różnią: blokować łokcie (Catalyst „Lock … forcefully”, Physitrack „fully locked out”, Generation Iron „until your elbow locks out”, Legion „until your arms lock out”, Breaking Muscle i BarBend „lockout”) vs lekkie ugięcie (Performance Herts „slight bend in the elbow”, Pfizer, a w Bradford — celowo bez wyprostu: BoxRox, RitFit). Żadne przeczytane źródło nie ostrzega przed „gwałtownym” blokowaniem. Część wspólna: „wyprostuj ręce nad głową” (bez oceny blokowania). Zestaw ogólny `ohp.mis.lock` jest dla tych wariantów niepotwierdzony — zgłoszenie błędu zestawu |
| Arnold Press — błąd `ohp.mis.partial` („Skracanie ruchu — bez wyprostu rąk na górze.”) | Breaking Muscle (Mistake: Using a Short Range of Motion) + Advanced Human Performance (niepełny wyprost jako błąd), ale Pfizer („slight bend … throughout”) przeczy — nie dodano |
| Arnold Press — błąd „obracanie samych dłoni, łokcie w miejscu” | tylko Breaking Muscle (Mistake: Rotating Your Hands, Not Your Arms) — jedno źródło |
| Arnold Press — `ohp.tall` | żadne przeczytane źródło nie mówi o postawie tułowia; Breaking Muscle: „press up and back” — nie „prosto w górę”; nie przenosić |
| Arnold Press — wysokość hantli na dole | BarBend „face height”, Breaking Muscle „in front of your mouth”; The Gym Group i Pfizer „shoulder height”; Advanced Human Performance — częściowe odwrócenie dłoni i ręce w linii barków (wariant autorski). W zdaniu tylko część wspólna dwóch źródeł szczebla 4 |
| Single Arm Overhead Press (hantel) — `ohp.elbowsUnder` | żadne przeczytane źródło dla wariantu nie mówi o łokciu pod nadgarstkiem (Performance Herts: ramię równolegle do podłogi) |
| Single Arm Overhead Press (hantel) — `ohp.saMove` „do wyprostu ręki” | Performance Herts w krokach „straighten your elbow”, a we wskazówkach „slight bend in the elbow” (strona niespójna); Physitrack i Generation Iron — pełny wyprost. Zdanie zostawione, bez słów o blokowaniu |
| Seated Barbell Military Press — błąd | wyginanie lędźwi / odchylanie się — tylko Generation Iron; nadgarstki odgięte, opadanie sztangi — tylko Legion |
| Seated Barbell Military Press — łokcie na dole | ACE (Step 3: „elbows pointing forward”) i Generation Iron (elbows tucked forward) vs Legion (ok. 45° odwiedzenia) — różnica; nie dodano |
| Seated Barbell Military Press — `ohp.seat` | zdanie mówi o hantlach — nie pasuje do sztangi; zastąpione `ohp.bbSeat` |
| Kettlebell Press — `ohp.tall`, `ohp.mis.lean` | tylko The Prehab Guys (keep your back upright, don't arch) — jedno źródło; ACE 395 mówi o przeniesieniu ciężaru ciała w przód (stopa z przodu) |
| Kettlebell Press — `ohp.elbowsUnder` | niepotwierdzone (ACE: łokieć przy żebrach w pozycji startowej) |
| Band Shoulder Press — błąd (wyginanie pleców, bujanie, unoszenie barków) | tylko The Prehab Guys (Compensations) — jedno źródło |
| Band Shoulder Press — drugie źródło jednorącz | Physitrack opisuje wersję jedną ręką; ustawienie i ruch (guma pod stopami, wypchnięcie w górę, powolny powrót) są te same — do decyzji koordynatora, czy to „ten sam wariant” |
| Band Shoulder Press — dłonie przy barkach | tylko Physitrack („hand is at shoulder height”); The Prehab Guys prowadzi gumę za głową — nie dodano do zdania |
| Standing Barbell Press Behind Neck — `ohp.tall` | Catalyst: tułów od początku lekko pochylony w przód i stały; „tułów wysoko” nie jest przez nich potwierdzone — zastąpione `ohp.btnStill` |
| Standing Barbell Press Behind Neck — wersja stojąca vs siedząca | Healthline i Generation Iron opisują głównie wersję siedzącą (Healthline: stojąca dopiero po opanowaniu siedzącej); Catalyst — stojąca. Zdania ustawienia/ruchu nie zależą od pozycji nóg |
| Wyciskanie zza karku (obie pozycje) — kto nie powinien | ostrzeżenia o ruchomości barków i urazach (Catalyst Notes, Healthline Safety tips, Generation Iron) — twierdzenie zdrowotne, nie do wskazówek; ewentualnie ogólne odesłanie do specjalisty przy bólu |
| Push Press - Behind the Neck — stopy | Catalyst: na szerokość bioder; Garage Strength: na szerokość barków — różnica, nie dodano |
| Push Press - Behind the Neck — `pp.setup` | mówi o sztandze z przodu — nie pasuje; zastąpione `pp.btnSetup` |
| Bradford Press | dwa przeczytane opisy (BoxRox — autor bez kwalifikacji; RitFit — producent, tylko maszyna Smitha) zgodne: sztanga tylko nad głowę bez wyprostu, przód → za kark → przód, tułów napięty bez odchylania. Brak 2 źródeł szczebla 4 dla sztangi wolnej. Zostaje `open`. Zdania ogólne `ohp.move`/`ohp.fullExt` byłyby dla Bradford BŁĘDNE |
| See-Saw Press (Alternating Side Press) | znalezione opisy pochodzą z baz aplikacji (pominięte) i artykułu o wersji z kettlebellami (inny sprzęt) — brak źródła szczebla 4. Nie przenosić `ohp.tall` ani `ohp.elbowsUnder` (sprzeczne z pochyleniem bocznym, próbna recenzja 02.11.2026); zestaw `general` dla tego ćwiczenia do wyłączenia albo `open` |
| Oddech (wszystkie) | wydech przy wyciskaniu — tylko w streszczeniach wyszukiwarki i w Generation Iron (BTN, „exhale”) — jedno przeczytane źródło; nie dodano |

## Stan
Zrobione: wszystkie 9 ćwiczeń przejrzane. Zostało: ewentualnie drugie źródła dla błędów (Arnold, Seated Barbell, Kettlebell, Band)
i dla Bradford/See-Saw — próbować stron organizacji kettlebellowych (domeny poza siecią sesji trzeba dopuścić) i producentów sprzętu.
Pułapki: ExRx 403, Wayback zablokowane, tao.dragondoor.com poza siecią sesji, kettlebellkings.com 402, muscleandstrength.com 403.
