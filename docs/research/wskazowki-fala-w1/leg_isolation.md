# Wskazówki techniki — rodzina `leg_isolation` (fala W1)

Data: 02.11.2026 · autor: badacz-merytoryczny · Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda jak w `docs/research/33-wskazowki-partia2.md`: każde zdanie ma ≥ 2 przeczytane (WebFetch) źródła szczebla 4 z różnych organizacji
(albo szczebel 3 + 4), o tym ćwiczeniu lub jego wariancie (oznaczone „(wariant: …)”). Bez liczb (tempo, obciążenia) i bez twierdzeń o zdrowiu.
Źródła o innym ćwiczeniu (analogia) się nie liczą. Strony innych aplikacji pominięte (polecenie koordynatora 02.11).
Kontynuacja (drugi badacz, 02.11.2026): ocena szczebli wg „ROZSTRZYGNIĘCIA” koordynatora z 02.11 (kryteria a–c); oceny nowych organizacji w sekcji 5.

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Sissy Squat | otwarte | ruch + 1 wskazówka mają 2 źródła; brak ustawienia z 2 źródłami (sekcja 6) — druga tura poszukiwań bez wyniku |
| Reverse Nordic | gotowe | Physitrack, The Prehab Guys, E3 Rehab |
| Glute Ham Raise | gotowe | The Prehab Guys, Bells of Steel (producent GHD), Robertson Training Systems; McAllister i in. 2014 (szczebel 3) do pozycji bioder |
| Standing Leg Curl | gotowe | Body-Solid (instrukcja producenta, stacja z wałkami), Physitrack (wariant: obciążnik na kostce), The Prehab Guys (wariant: masa ciała) |
| Standing Cable Leg Curl | gotowe (warunkowo) | jedyne źródło o wersji z wyciągiem: REP Fitness; pozostałe to warianty stojącego uginania (sekcja 6) |
| Leg Curl (hantel) | otwarte | znalezione opisy (2 serwisy) nie spełniają kryteriów szczebla 4 (sekcja 6) |
| Single-Leg Leg Extension | gotowe | NFPT (wariant: obunóż), Hoist (instrukcja producenta, wariant: obunóż), Physitrack (jednonóż, maszyna) |
| Stability Ball Hamstring Curl | gotowe | ACE #59, NCSF (wariant: jednonóż) |
| Slider Hamstring Curl | gotowe | The Prehab Guys (wariant: jednonóż), NISMAT (wariant: ręcznik), Robertson Training Systems |
| Seated Band Hamstring Curl | gotowe | Physitrack, StayWell / WebMD Ignite (materiał Vanderbilt Health) |

## 2. Wpisy do `cues.json` → `exercises`

```json
{
  "Reverse Nordic": {
    "setup": [
      {"c": "rnordic.setup", "s": [
        ["physitrack-reverse-nordic", "opis ćwiczenia (wysoki klęk na macie, nogi na szerokość bioder; parafraza)"],
        ["e3-reverse-nordics", "How to set up („Kneel on a soft surface, such as a pad, pillow, or towel, with your knees roughly hip width apart or greater”)"],
        ["prehab-reverse-nordic", "HOW („tall kneeling position with something under your knees for comfort”)"]
      ]}
    ],
    "move": [
      {"c": "rnordic.move", "s": [
        ["physitrack-reverse-nordic", "opis ćwiczenia (powoli odchyl całe ciało w tył, wróć pod kontrolą; parafraza)"],
        ["e3-reverse-nordics", "How to perform („slowly lean back as far as you can comfortably control before returning to the starting position”)"],
        ["prehab-reverse-nordic", "HOW (odchylenie w tył i powrót do klęku; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "rnordic.line", "s": [
        ["physitrack-reverse-nordic", "opis ćwiczenia (napnij pośladki i brzuch; biodra w przód w linii z tułowiem i udami; parafraza)"],
        ["e3-reverse-nordics", "How to perform (pośladki i brzuch napięte; „a straight line between your knees, hips, and shoulders”)"]
      ]},
      {"c": "llc.control", "s": [
        ["physitrack-reverse-nordic", "opis ćwiczenia (powolne do umiarkowanego tempo, powrót pod kontrolą; parafraza)"],
        ["e3-reverse-nordics", "How to perform („focus on slow and controlled repetitions”)"]
      ]}
    ],
    "mistakes": [
      {"c": "rnordic.mis.hips", "s": [
        ["physitrack-reverse-nordic", "opis ćwiczenia („Do not allow your hips to drop backwards”)"],
        ["e3-reverse-nordics", "How to perform (linia kolana–biodra–barki przez cały ruch; błąd = jej złamanie w biodrach; parafraza)"]
      ]}
    ]
  },
  "Glute Ham Raise": {
    "setup": [
      {"c": "ghr.setup", "s": [
        ["prehab-raise-ghd", "HOW („feet anchored into a GHD and the pads resting comfortably on your thighs”)"],
        ["bos-ghd-use", "Glute Ham Raise (stopy zaczepione, poduszki o przód ud; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "ghr.move", "s": [
        ["prehab-raise-ghd", "HOW (z pełnego wyprostu powoli w dół, do pozycji równoległej do podłogi; parafraza)"],
        ["bos-ghd-use", "Glute Ham Raise (z wysokiego klęku tułów w przód do równoległej, powrót przez napięcie tyłu ud i pośladków; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "nordic.hips", "s": [
        ["prehab-raise-ghd", "HOW („keeping your body in a plank type of position the whole time”)"],
        ["mcallister-2014", "ryc. 1, podpis (biodro utrzymywane w 0° przez cały zakres; parafraza)"]
      ]},
      {"c": "ghr.heels", "s": [
        ["rts-ghr", "„Find (and keep) your heels” (pięty przy płycie przez całą serię; parafraza)"],
        ["bos-ghd-use", "Glute Ham Raise (powrót z naciskiem piętami; parafraza)"]
      ]}
    ],
    "mistakes": [
      {"c": "ghr.mis.arch", "s": [
        ["prehab-raise-ghd", "COMPENSATION („try not to arch your back by keeping your glutes and hamstrings engaged”)"],
        ["rts-ghr", "błędy (mocno wygięte plecy, pięty oderwane, rozpęd; parafraza)"]
      ]}
    ]
  },
  "Stability Ball Hamstring Curl": {
    "setup": [
      {"c": "ballcurl.setup", "s": [
        ["ace-59", "Step 1–2 (na plecach, łydki i pięty na piłce; unieś biodra do linii z tułowiem; parafraza)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) pozycja wyjściowa (biodra w pełnym wyproście, obie pięty na piłce; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "ballcurl.move", "s": [
        ["ace-59", "Step 3–4 (przyciągnij pięty do bioder, potem powoli wróć; parafraza)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) przyciągnięcie pięty do pośladków przy wyprostowanym biodrze, powolny powrót; parafraza"]
      ]}
    ],
    "tips": [
      {"c": "plank.brace", "s": [
        ["ace-59", "Step 1; Tips („Brace your abs before lifting and keep them engaged”; parafraza)"],
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) wskazówki (aktywny tułów przez całe powtórzenie; parafraza)"]
      ]}
    ],
    "mistakes": [
      {"c": "ballcurl.mis.sag", "s": [
        ["ncsf-single-leg-ball-curl", "(wariant: jednonóż) przestrogi (opadające biodra; parafraza)"],
        ["ace-59", "Step 3 (tułów stabilny, w linii z udami — biodra wyżej, nie niżej; parafraza)"]
      ]}
    ]
  }
}
```

Uwaga do `ballcurl.mis.sag` i `rnordic.mis.hips`: drugie źródło podaje wskazówkę pozytywną (linia ciała), błąd jest jej zaprzeczeniem — tak jak w metodzie docs/33; jeśli koordynator przyjmuje tylko błąd nazwany wprost, oba ćwiczenia i tak zostają „gotowe” (ustawienie, ruch, ≥ 2 wskazówki).

### 2b. Wpisy z kontynuacji (02.11.2026)

```json
{
  "Single-Leg Leg Extension": {
    "setup": [
      {"c": "lext.setup", "s": [
        ["nfpt-leg-extensions", "(wariant: obunóż) Setup („The seat should be adjusted to a position where your knees are even with the pivot point of the leg pad arm”; wałek tuż nad kostkami)"],
        ["hoist-hd3400", "(wariant: obunóż) Leg Extension (staw kolanowy w osi ramienia maszyny; dolna poduszka na kostkach; parafraza)"],
        ["physitrack-knee-extension-machine", "opis (ustaw siedzisko i podparcie nóg; poduszki nisko na goleniach; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "lext.move", "s": [
        ["physitrack-knee-extension-machine", "opis („gently extend and straighten your legs”, potem powolne, kontrolowane opuszczenie)"],
        ["nfpt-leg-extensions", "(wariant: obunóż) Execution (wypchnij do wyprostu nóg, powoli opuść do pozycji wyjściowej; parafraza)"],
        ["hoist-hd3400", "(wariant: obunóż) Leg Extension (unieś do wyprostu, wróć powoli; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "lext.back", "s": [
        ["nfpt-leg-extensions", "(wariant: obunóż) Setup i Common Mistakes (plecy o oparcie, „Do not arch your back during this movement”)"],
        ["hoist-hd3400", "(wariant: obunóż) Leg Extension (plecy płasko na oparciu; parafraza)"]
      ]},
      {"c": "llc.control", "s": [
        ["physitrack-knee-extension-machine", "opis („lower the legs back down in a slow and controlled manner”)"],
        ["nfpt-leg-extensions", "(wariant: obunóż) Common Mistakes (szybszy ruch = mniej kontroli; parafraza)"],
        ["hoist-hd3400", "(wariant: obunóż) Leg Extension (powrót powoli; parafraza)"]
      ]}
    ],
    "mistakes": []
  },
  "Seated Band Hamstring Curl": {
    "setup": [
      {"c": "bandcurl.setup", "s": [
        ["physitrack-seated-resisted-knee-flexion", "opis („Sit in a chair with your leg stretched forwards and the band secured around your ankle”)"],
        ["staywell-seated-hamstring-curl", "kroki 1–2 (guma zaczepiona nisko w drzwiach, siad przodem do drzwi, pętla na pięcie; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "bandcurl.move", "s": [
        ["physitrack-seated-resisted-knee-flexion", "opis (zegnij kolano, stopa w tył, kontrolowany powrót; parafraza)"],
        ["staywell-seated-hamstring-curl", "krok 3 (powoli ciągnij gumę piętą w tył po podłodze, powoli wróć; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "lcurl.full", "s": [
        ["physitrack-seated-resisted-knee-flexion", "opis („bring the foot as far backwards as possible”)"],
        ["staywell-seated-hamstring-curl", "krok 3 („Stop when you can't pull it any farther”)"]
      ]},
      {"c": "llc.control", "s": [
        ["physitrack-seated-resisted-knee-flexion", "opis (powrót „in a controlled manner”)"],
        ["staywell-seated-hamstring-curl", "krok 3; Safety tip („Take it slowly”; parafraza)"]
      ]}
    ],
    "mistakes": []
  },
  "Standing Leg Curl": {
    "setup": [
      {"c": "scurl.setup", "s": [
        ["bodysolid-g6b-standing-curl", "Standing Leg Curl, setup (stań przodem do maszyny; „Grasp back pad or seated press handles for stability”)"],
        ["physitrack-otago-standing-curl", "(wariant: obciążnik na kostce) opis („Stand close to your support and hold on”; ciężar na jednej nodze)"],
        ["prehab-standing-hamstring-curl", "(wariant: masa ciała) HOW (oparcie o krzesło, ciężar ciała na jedną stronę; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "scurl.move", "s": [
        ["bodysolid-g6b-standing-curl", "Standing Leg Curl, movement (zegnij kolano, unosząc stopę; powoli wróć tym samym łukiem; parafraza)"],
        ["physitrack-otago-standing-curl", "(wariant: obciążnik na kostce) opis (pięta w stronę pośladka; parafraza)"],
        ["prehab-standing-hamstring-curl", "(wariant: masa ciała) HOW (pięta w górę, „Slowly lower it down”)"]
      ]}
    ],
    "tips": [
      {"c": "scurl.knee", "s": [
        ["physitrack-otago-standing-curl", "(wariant: obciążnik na kostce) opis („keep your thighs parallel”)"],
        ["prehab-standing-hamstring-curl", "(wariant: masa ciała) COMPENSATION („Keep your knee in tight, don’t let your hip come out”)"]
      ]},
      {"c": "lcurl.full", "s": [
        ["bodysolid-g6b-standing-curl", "Standing Leg Curl, movement („bending your knee as much as possible”)"],
        ["prehab-standing-hamstring-curl", "(wariant: masa ciała) HOW („try to bring your heel up as high as you can”)"]
      ]}
    ],
    "mistakes": []
  },
  "Standing Cable Leg Curl": {
    "setup": [
      {"c": "scurl.setup", "s": [
        ["rep-ankle-strap", "hamstring raises (dolny bloczek, przodem do maszyny — jak przy wykopie; parafraza)"],
        ["bodysolid-g6b-standing-curl", "(wariant: stacja z wałkami) setup (przodem do maszyny, przytrzymanie uchwytów; parafraza)"],
        ["physitrack-otago-standing-curl", "(wariant: obciążnik na kostce) opis (przy podporze, trzymaj się; parafraza)"]
      ]}
    ],
    "move": [
      {"c": "scurl.move", "s": [
        ["rep-ankle-strap", "hamstring raises (unieś obciążoną nogę, pięta do pośladków; parafraza)"],
        ["bodysolid-g6b-standing-curl", "(wariant: stacja z wałkami) movement (zgięcie kolana, powolny powrót; parafraza)"],
        ["prehab-standing-hamstring-curl", "(wariant: masa ciała) HOW (pięta w górę, powolne opuszczenie; parafraza)"]
      ]}
    ],
    "tips": [
      {"c": "scurl.knee", "s": [
        ["physitrack-otago-standing-curl", "(wariant: obciążnik na kostce) opis („keep your thighs parallel”)"],
        ["prehab-standing-hamstring-curl", "(wariant: masa ciała) COMPENSATION („Keep your knee in tight”)"]
      ]},
      {"c": "lcurl.full", "s": [
        ["rep-ankle-strap", "hamstring raises („so your heels touch your glutes”)"],
        ["bodysolid-g6b-standing-curl", "(wariant: stacja z wałkami) movement („bending your knee as much as possible”)"]
      ]}
    ],
    "mistakes": []
  },
  "Slider Hamstring Curl": {
    "setup": [
      {"c": "slcurl.setup", "s": [
        ["prehab-single-leg-hamstring-curl-slider", "(wariant: jednonóż) HOW (na plecach, kolana ugięte, ślizgacz pod stopą; parafraza)"],
        ["nismat-hamstring-sliders", "(wariant: ręcznik) („Lie on your back, bend your knees and place a towel under your feet”)"]
      ]}
    ],
    "move": [
      {"c": "slcurl.move", "s": [
        ["prehab-single-leg-hamstring-curl-slider", "(wariant: jednonóż) HOW (biodra w górę, wyprostuj nogę na ślizgaczu, przyciągnij stopę z biodrami w górze; parafraza)"],
        ["nismat-hamstring-sliders", "(wariant: ręcznik) (mostek, wysunięcie nóg do wyprostu, powrót „without dropping your hips”)"]
      ]}
    ],
    "tips": [
      {"c": "llc.control", "s": [
        ["prehab-single-leg-hamstring-curl-slider", "(wariant: jednonóż) COMPENSATION („Control the slide out and back in, don’t go too fast”)"],
        ["rts-valslide-leg-curl", "wskazówki („Lower slowly and under control!”)"]
      ]}
    ],
    "mistakes": [
      {"c": "ballcurl.mis.sag", "s": [
        ["nismat-hamstring-sliders", "(wariant: ręcznik) powrót „without dropping your hips”"],
        ["prehab-single-leg-hamstring-curl-slider", "(wariant: jednonóż) HOW („while keeping your hips raised”; błąd = zaprzeczenie)"]
      ]}
    ]
  }
}
```

Uwaga: `ballcurl.mis.sag` przy Slider Hamstring Curl — oba źródła mówią pozytywnie („biodra w górze”, „bez opuszczania bioder”); ta sama zasada co wyżej. Bez tego wpisu ćwiczenie ma tylko 1 wskazówkę — wtedy „otwarte”.

## 4. Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie potrzeby |
|---|---|---|---|
| rnordic.setup | Uklęknij prosto na miękkim podłożu, kolana mniej więcej na szerokość bioder. | Kneel tall on a soft surface, knees about hip-width apart. | nordic.setup wymaga trzymania kostek — tu niepotrzebne |
| rnordic.move | Powoli odchylaj się w tył, tak daleko, jak panujesz nad ruchem; potem wróć do klęku. | Lean back slowly, only as far as you can control, then return to tall kneeling. | brak zdania o odchylaniu w tył |
| rnordic.line | Pośladki i brzuch napięte — kolana, biodra i barki w jednej linii. | Squeeze your glutes and brace your abs — knees, hips and shoulders in one line. | nordic.hips mówi o pochylaniu w przód; tu linia od kolan do barków |
| rnordic.mis.hips | Biodra uciekające w tył — zginanie się w biodrach zamiast odchylania całego ciała. | Hips dropping back — bending at the hips instead of leaning back as one piece. | brak błędu dla tego ruchu |
| ghr.setup | Zaprzyj stopy o płytę maszyny, poduszki oprzyj o przód ud. | Lock your feet against the footplate, pads resting on the front of your thighs. | brak ustawienia GHD |
| ghr.move | Z wyprostowanego klęku opuszczaj tułów w przód, aż będzie mniej więcej równolegle do podłogi; wróć, napinając tył ud i pośladki. | From tall kneeling, lower your torso forward until it is roughly parallel to the floor; come back up by squeezing your hamstrings and glutes. | brak ruchu GHR |
| ghr.heels | Pięty cały czas dociśnięte do płyty. | Keep your heels pressed into the plate the whole time. | brak zdania |
| ghr.mis.arch | Wyginanie pleców w łuk zamiast trzymania ciała prosto. | Arching your back instead of keeping your body straight. | ht.mis.arch dotyczy górnej pozycji hip thrustu |
| ballcurl.setup | Połóż się na plecach, pięty na piłce; unieś biodra, aż ciało będzie proste. | Lie on your back with your heels on the ball; lift your hips until your body is straight. | gb.setup — stopy na podłodze |
| ballcurl.move | Przyciągaj pięty do pośladków, tocząc piłkę, biodra w górze; potem powoli wyprostuj nogi. | Pull your heels toward your glutes, rolling the ball in, hips up; then slowly straighten your legs. | brak ruchu z piłką |
| ballcurl.mis.sag | Biodra opadające w trakcie ruchu. | Hips sagging during the movement. | plank.mis.sag łączy biodra z lędźwiami — NCSF i ACE nie mówią tu o łuku lędźwi w ten sposób |
| lext.setup | Ustaw siedzisko tak, by kolano było na wysokości osi maszyny; wałek oprzyj nisko na goleni, tuż nad kostką. | Set the seat so your knee lines up with the machine's pivot; rest the pad low on your shin, just above the ankle. | Leg Extension nie ma ustawienia (`setup: []`) |
| lext.move | Wyprostuj nogę w kolanie, unosząc wałek; potem powoli ją opuść. | Straighten your leg, lifting the pad; then lower it slowly. | `lext.range` mówi o wyproście i zgięciu pod kątem prostym — kąt dolny potwierdza tylko NFPT, a Hoist każe nie blokować kolan; prostsze zdanie bez kątów |
| lext.back | Plecy cały czas oparte o oparcie. | Keep your back against the backrest the whole time. | brak zdania o oparciu przy prostowaniu nóg |
| bandcurl.setup | Usiądź przodem do miejsca, gdzie zaczepiona jest guma; pętlę załóż na kostkę, noga wysunięta w przód. | Sit facing the band's anchor point, loop around your ankle, leg out in front. | brak ustawienia z gumą |
| bandcurl.move | Zegnij kolano, ciągnąc piętą gumę w tył; potem powoli wyprostuj nogę. | Bend your knee, pulling the band back with your heel; then slowly straighten your leg. | `lcurl.move` (liczba mnoga, pięty do pośladków) nie pasuje do siadu z gumą |
| lcurl.full | Zginaj kolano tak daleko, jak dasz radę. | Bend your knee as far as you can. | brak zdania o pełnym zgięciu; wspólne dla uginań jednonóż |
| scurl.setup | Stań przodem do maszyny lub podpory i przytrzymaj się; ciężar ciała na nodze podporowej. | Stand facing the machine or a support and hold on; weight on your standing leg. | brak ustawienia stojącego uginania |
| slcurl.setup | Połóż się na plecach, kolana ugięte, pięty na ślizgaczach. | Lie on your back, knees bent, heels on the sliders. | ballcurl.setup — piłka i biodra od razu w górze |
| slcurl.move | Unieś biodra, wysuń nogi do wyprostu, potem przyciągnij pięty z powrotem — biodra cały czas w górze. | Lift your hips, slide your legs out until straight, then pull your heels back in — hips up the whole time. | brak ruchu ze ślizgaczami |

Zdania z tabeli poprzednika `scurl.move` i `scurl.knee` przechodzą z „częściowych” do użycia (Standing Leg Curl, Standing Cable Leg Curl).

Zdania częściowe (do ćwiczeń otwartych, nie do aplikacji dopóki ćwiczenie otwarte):

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| sissy.move | Uginaj kolana i jednocześnie odchylaj tułów w tył, unosząc pięty; potem wróć do stania. | Bend your knees while leaning your torso back and lifting your heels; then return to standing. | issa-squat-variations (sekcja Sissy Squat), barbend-sissy-squat (Step 1–3) |
| sissy.torso | Plecy proste, tułów napięty przez cały ruch. | Back straight, torso braced throughout. | issa-squat-variations („The back remains straight throughout the exercise”), barbend-sissy-squat (Common Mistakes: Not Bracing Your Torso) |
| scurl.move | Zegnij kolano, przyciągając piętę w stronę pośladka; opuść ją powoli. | Bend your knee, bringing your heel toward your glute; lower it slowly. | (wariant: bez maszyny) physitrack-otago-standing-curl, prehab-standing-hamstring-curl; od kontynuacji też bodysolid-g6b-standing-curl |
| scurl.knee | Udo nogi ćwiczącej przy drugim udzie — kolano nie ucieka w przód ani w bok. | Keep the working thigh next to the other one — don't let the knee drift forward or out. | (wariant: bez maszyny) physitrack-otago-standing-curl („Keep the thighs parallel”, parafraza), prehab-standing-hamstring-curl („Keep your knee in tight, don’t let your hip come out”) |

## 5. Nowe źródła

| id | adres | organizacja | szczebel | cytat / miejsce |
|---|---|---|---|---|
| ace-59 | https://www.acefitness.org/resources/everyone/exercise-library/59/stability-ball-hamstring-curl/ | ACE | 4 | Steps 1–4; Tips |
| ace-301 | https://www.acefitness.org/resources/everyone/exercise-library/301/single-leg-hamstring-curl/ | ACE | 4 | opis (wariant jednonóż; ta sama organizacja co ace-59 — nie liczy się jako drugie źródło) |
| ncsf-single-leg-ball-curl | https://www.ncsf.org/blog/183-single-leg-stability-ball-leg-curl | NCSF | 4 | opis i przestrogi (biodra nie opadają, miednica neutralna) |
| issa-squat-variations | https://www.issaonline.com/blog/post/23-squat-variations-for-a-mind-blowing-lower-body-workout | ISSA | 4 | sekcja Sissy Squat: „a sissy squat involves leaning backward while squatting down.” |
| barbend-sissy-squat | https://barbend.com/sissy-squat/ | BarBend | 4 | How to; Common Mistakes |
| physitrack-reverse-nordic | https://us.physitrack.com/home-exercise-video/nordic-curl---reversed | Physitrack | 4 | „Do not allow your hips to drop backwards” |
| prehab-reverse-nordic | https://theprehabguys.com/vimeo-video/reverse-nordic-hamstring-curl/ | The Prehab Guys | 4 | HOW; COMPENSATION („Do not round or bend your back.”) |
| e3-reverse-nordics | https://e3rehab.com/how-to-set-up-perform-and-program-reverse-nordics/ | E3 Rehab | 4 | How to set up; How to perform |
| prehab-raise-ghd | https://theprehabguys.com/vimeo-video/raise-ghd/ | The Prehab Guys | 4 | HOW; COMPENSATION |
| bos-ghd-use | https://bellsofsteel.us/blogs/content/how-to-use-a-ghd-machine | Bells of Steel | 4 | sekcja Glute Ham Raise |
| rts-ghr | https://robertsontrainingsystems.com/blog/how-to-perform-the-glute-ham-raise/ | Robertson Training Systems | 4 | „Find (and keep) your heels.”; opis błędów |
| mcallister-2014 | https://oliverfinlay.com/assets/pdf/mcallister%20et%20al%20(2014)%20muscle%20activation%20during%20various%20hamstring%20exercises.pdf | McAllister i in. (University of Memphis) | 3 | J Strength Cond Res 2014;28(6):1573–80, ryc. 1 (podpis): „maintain 0° at the hip for the entire range of motion.” (kopia PDF na stronie autora; zaleca się podmienić na adres wydawcy/PubMed przy integracji) |
| physitrack-otago-standing-curl | https://ca.physitrack.com/home-exercise-video/otago-standing-hamstring-curl | Physitrack | 4 | opis („Stand close to your support and hold on.”) |
| prehab-standing-hamstring-curl | https://theprehabguys.com/vimeo-video/standing-hamstring-curl-2/ | The Prehab Guys | 4 | HOW; COMPENSATION |
| nfpt-leg-extensions | https://nfpt.com/how-to-do-leg-extensions/ | NFPT | 4 | autor w ramce: Robert Bovee (kwalifikacje i biogram), 11.08.2025; Setup, Execution, Common Mistakes |
| hoist-hd3400 | https://www.hoistfitness.com/pages/hd-3400-leg-extension-leg-curl | Hoist Fitness | 4 | instrukcja własnej maszyny do prostowania/uginania; „your knee joint is aligned with the pivot point of the exercise arm” |
| physitrack-knee-extension-machine | https://na.physitrack.com/home-exercise-video/knee-extension---machine | Physitrack | 4 | „Knee extension single leg - machine”; opis |
| physitrack-seated-resisted-knee-flexion | https://us.physitrack.com/home-exercise-video/seated-resisted-knee-flexion | Physitrack | 4 | „Bend your knee and bring the foot as far backwards as possible.” |
| staywell-seated-hamstring-curl | https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814 | WebMD Ignite (StayWell) — publikacja Vanderbilt Health | 4 | „Seated Hamstring Curl (Strength)”, kroki 1–3; recenzja: E. Oswald PT DPT i in., 01.02.2025 |
| bodysolid-g6b-standing-curl | https://music.manualsonline.com/manuals/mfg/body_solid/g6b.html?p=74 | Body-Solid | 4 | instrukcja G6B, s. 74 „Standing Leg Curl (Hamstrings)” (kopia instrukcji producenta w serwisie z instrukcjami; przy integracji podmienić na PDF producenta, jeśli dostępny) |
| rep-ankle-strap | https://repfitness.com/blogs/training/creative-ways-to-use-the-ankle-strap-for-a-cable-machine | REP Fitness | 4 | A. Heckel, 11.04.2023 (akt. 03.08.2026); „raise the weighted leg so your heels touch your glutes for hamstring raises” |
| prehab-single-leg-hamstring-curl-slider | https://theprehabguys.com/vimeo-video/single-leg-hamstring-curl-slider/ | The Prehab Guys | 4 | HOW; COMPENSATION |
| nismat-hamstring-sliders | https://nismat.org/2023/12/11/hamstring-sliders/amp/ | NISMAT | 4 | „Hamstring Sliders” (11.12.2023): powrót „without dropping your hips” |
| rts-valslide-leg-curl | https://robertsontrainingsystems.com/blog/crush-your-hamstrings-and-glutes-with-the-valslide-leg-curl/ | Robertson Training Systems | 4 | M. Robertson, 13.03.2019: „Lower slowly and under control!” |

Pomocniczo przeczytane, szczebel 5 (nie liczone): Tony Gentilcore, „Exercises You Should Be Doing: Reverse Nordic Curl”, https://tonygentilcore.com/2019/02/exercises-reverse-nordic-curl/ — „stacked” głowa–tułów–biodra–kolana przez cały ruch (zgodne z `rnordic.line`). Z kontynuacji (szczebel 5 wg kryteriów a–c, nie liczone): Topend Sports „Leg Extension” (brak autora i daty, linki afiliacyjne), Rehab Hero „Seated Hamstring Curl” (link afiliacyjny, autor bez kwalifikacji), rdlfitness.com i weighttraining.guide (hantel, autorzy bez kwalifikacji), PRx Performance „Sissy Squat | Home Gym Hacks” (wersja z gumą — inny wariant).

Ocena nowych organizacji wg kryteriów a–c (kontynuacja):
- **NFPT** — organizacja certyfikująca trenerów; artykuł z autorem, datą i biogramem z kwalifikacjami → 4 (zgodnie z rozstrzygnięciem). Jedyna para z ISSA nie występuje w tej rodzinie.
- **Hoist Fitness** — producent maszyny do prostowania nóg; strona to instrukcja własnej maszyny → 4 (tylko dla tej maszyny / prostowania i uginania nóg).
- **Body-Solid** — producent stacji G6B; instrukcja własnego sprzętu → 4 (kopia w serwisie z instrukcjami).
- **REP Fitness** — producent wyciągów i opasek na kostkę; artykuł z autorem i datą o własnym rodzaju sprzętu → 4; uwaga: blog ma też charakter sprzedażowy — do decyzji koordynatora.
- **WebMD Ignite (StayWell)** — materiał opublikowany przez placówkę medyczną (Vanderbilt Health) z datą recenzji → 4 wg reguły dla WebMD Ignite.
- **NISMAT** (Nicholas Institute of Sports Medicine and Athletic Trauma) — instytut medycyny sportowej przy szpitalu; treść firmowana przez instytut, data w adresie → 4.
- Do weryfikacji przez koordynatora wpisów poprzednika wg nowych kryteriów: **NCSF** (organizacja certyfikująca — a spełnione; autora i daty wpisu nie sprawdzano) i **Robertson Training Systems** (autor i data są; kwalifikacji na stronie brak, firma prowadzi szkolenia dla trenerów). Przy RTS jako 5: Glute Ham Raise traci `ghr.heels` (zostaje Bells of Steel) i drugie źródło `ghr.mis.arch`; Slider Hamstring Curl traci drugie źródło `llc.control` → wtedy oba „otwarte” lub karta krótsza.

```json
{
  "orgs": {
    "NCSF": {"name": "National Council on Strength and Fitness — blog edukacyjny (ncsf.org)", "level": 4, "kind": "org"},
    "ISSA": {"name": "International Sports Sciences Association — blog edukacyjny (issaonline.com)", "level": 4, "kind": "org"},
    "E3 Rehab": {"name": "E3 Rehab — artykuły edukacyjne (e3rehab.com, fizjoterapeuci)", "level": 4, "kind": "site"},
    "Bells of Steel": {"name": "Bells of Steel — blog producenta sprzętu (GHD)", "level": 4, "kind": "maker"},
    "Robertson Training Systems": {"name": "Robertson Training Systems — blog trenerski (M. Robertson, IFAST)", "level": 4, "kind": "site"},
    "McAllister i in. (University of Memphis)": {"name": "McAllister i in. (University of Memphis) — badanie, J Strength Cond Res 2014", "level": 3, "kind": "study"},
    "NFPT": {"name": "National Federation of Professional Trainers — artykuły z autorem i biogramem (nfpt.com)", "level": 4, "kind": "org"},
    "Hoist Fitness": {"name": "Hoist Fitness — instrukcje własnych maszyn (producent)", "level": 4, "kind": "maker"},
    "Body-Solid": {"name": "Body-Solid — instrukcja własnej stacji (producent)", "level": 4, "kind": "maker"},
    "REP Fitness": {"name": "REP Fitness — blog producenta wyciągów i akcesoriów", "level": 4, "kind": "maker"},
    "WebMD Ignite (StayWell)": {"name": "WebMD Ignite (StayWell) — materiały dla pacjentów publikowane przez placówki medyczne, z datą recenzji", "level": 4, "kind": "site"},
    "NISMAT": {"name": "Nicholas Institute of Sports Medicine and Athletic Trauma — materiały ćwiczeń (nismat.org)", "level": 4, "kind": "site"}
  },
  "sources": {
    "ace-59": {"org": "ACE", "title": "Stability Ball Hamstring Curl (#59)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/59/stability-ball-hamstring-curl/", "level": 4},
    "ace-301": {"org": "ACE", "title": "Single Leg Hamstring Curl (#301)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/301/single-leg-hamstring-curl/", "level": 4},
    "ncsf-single-leg-ball-curl": {"org": "NCSF", "title": "Single-Leg Stability Ball Leg Curl", "url": "https://www.ncsf.org/blog/183-single-leg-stability-ball-leg-curl", "level": 4},
    "issa-squat-variations": {"org": "ISSA", "title": "23 Squat Variations (sekcja Sissy Squat)", "url": "https://www.issaonline.com/blog/post/23-squat-variations-for-a-mind-blowing-lower-body-workout", "level": 4},
    "barbend-sissy-squat": {"org": "BarBend", "title": "Sissy Squat", "url": "https://barbend.com/sissy-squat/", "level": 4},
    "physitrack-reverse-nordic": {"org": "Physitrack", "title": "Nordic curl - reversed", "url": "https://us.physitrack.com/home-exercise-video/nordic-curl---reversed", "level": 4},
    "prehab-reverse-nordic": {"org": "The Prehab Guys", "title": "Reverse Nordic Curl", "url": "https://theprehabguys.com/vimeo-video/reverse-nordic-hamstring-curl/", "level": 4},
    "e3-reverse-nordics": {"org": "E3 Rehab", "title": "How to set up, perform, and program reverse Nordics", "url": "https://e3rehab.com/how-to-set-up-perform-and-program-reverse-nordics/", "level": 4},
    "prehab-raise-ghd": {"org": "The Prehab Guys", "title": "Raise - GHD", "url": "https://theprehabguys.com/vimeo-video/raise-ghd/", "level": 4},
    "bos-ghd-use": {"org": "Bells of Steel", "title": "How To Use A GHD Machine?", "url": "https://bellsofsteel.us/blogs/content/how-to-use-a-ghd-machine", "level": 4},
    "rts-ghr": {"org": "Robertson Training Systems", "title": "How to Perform the Glute-Ham Raise", "url": "https://robertsontrainingsystems.com/blog/how-to-perform-the-glute-ham-raise/", "level": 4},
    "mcallister-2014": {"org": "McAllister i in. (University of Memphis)", "title": "Muscle Activation During Various Hamstring Exercises (JSCR 2014)", "url": "https://oliverfinlay.com/assets/pdf/mcallister%20et%20al%20(2014)%20muscle%20activation%20during%20various%20hamstring%20exercises.pdf", "level": 3},
    "physitrack-otago-standing-curl": {"org": "Physitrack", "title": "Otago Standing Hamstring Curl", "url": "https://ca.physitrack.com/home-exercise-video/otago-standing-hamstring-curl", "level": 4},
    "prehab-standing-hamstring-curl": {"org": "The Prehab Guys", "title": "Standing Hamstring Curl", "url": "https://theprehabguys.com/vimeo-video/standing-hamstring-curl-2/", "level": 4},
    "nfpt-leg-extensions": {"org": "NFPT", "title": "How To Do Leg Extensions (R. Bovee, 11.08.2025)", "url": "https://nfpt.com/how-to-do-leg-extensions/", "level": 4},
    "hoist-hd3400": {"org": "Hoist Fitness", "title": "HD-3400 Leg Extension/Leg Curl", "url": "https://www.hoistfitness.com/pages/hd-3400-leg-extension-leg-curl", "level": 4},
    "physitrack-knee-extension-machine": {"org": "Physitrack", "title": "Knee extension single leg - machine", "url": "https://na.physitrack.com/home-exercise-video/knee-extension---machine", "level": 4},
    "physitrack-seated-resisted-knee-flexion": {"org": "Physitrack", "title": "Seated resisted knee flexion", "url": "https://us.physitrack.com/home-exercise-video/seated-resisted-knee-flexion", "level": 4},
    "staywell-seated-hamstring-curl": {"org": "WebMD Ignite (StayWell)", "title": "Seated Hamstring Curl (Strength) — Vanderbilt Health, recenzja 01.02.2025", "url": "https://healthlibrary.vanderbilthealth.com/library/HealthSheets/3,S,90814", "level": 4},
    "bodysolid-g6b-standing-curl": {"org": "Body-Solid", "title": "G6B Owner's Manual, s. 74 — Standing Leg Curl", "url": "https://music.manualsonline.com/manuals/mfg/body_solid/g6b.html?p=74", "level": 4},
    "rep-ankle-strap": {"org": "REP Fitness", "title": "Creative Ways to Use the Ankle Strap for a Cable Machine (A. Heckel, 2023/2026)", "url": "https://repfitness.com/blogs/training/creative-ways-to-use-the-ankle-strap-for-a-cable-machine", "level": 4},
    "prehab-single-leg-hamstring-curl-slider": {"org": "The Prehab Guys", "title": "Single Leg Hamstring Curl - Slider", "url": "https://theprehabguys.com/vimeo-video/single-leg-hamstring-curl-slider/", "level": 4},
    "nismat-hamstring-sliders": {"org": "NISMAT", "title": "Hamstring Sliders (11.12.2023)", "url": "https://nismat.org/2023/12/11/hamstring-sliders/amp/", "level": 4},
    "rts-valslide-leg-curl": {"org": "Robertson Training Systems", "title": "Crush Your Hamstrings and Glutes with the ValSlide Leg Curl (13.03.2019)", "url": "https://robertsontrainingsystems.com/blog/crush-your-hamstrings-and-glutes-with-the-valslide-leg-curl/", "level": 4}
  }
}
```

## 6. Otwarte

- **Sissy Squat** — brak ustawienia z 2 źródłami: BarBend (stopy pod biodrami, przytrzymanie framugi/sztangi w stojaku), ISSA o ustawieniu milczy (wspomina tylko maszynę, która blokuje podudzia). Rozstrzygnie: drugie źródło z listy organizacji z pozycją wyjściową (np. NSCA, ACE). Zdania częściowe `sissy.move`, `sissy.torso` gotowe do użycia, gdy dojdzie ustawienie. Kontynuacja 02.11: brak strony ACE/NASM/NSCA/Coach w wyszukiwarce; mennohenselmans.com — 403; ironmaster.com — 404; PRx Performance opisuje wersję z gumą za kolanami (inny wariant, stopy złączone — sprzeczne z „pod biodrami” u BarBend, więc i tak nie do wspólnego zdania); Physitrack ma tylko „Easier Sissy Squat in Kneeling” (inny wariant, nieprzeczytany). Pozostałe trafienia to strony aplikacji, sklepy i agregatory (szczebel 5 lub zakaz).
- **Standing Cable Leg Curl (warunkowo gotowe)** — o wersji z wyciągiem jest jedno źródło (REP Fitness, ustawienie i ruch); wskazówki opierają się na wariantach stojącego uginania (maszyna z wałkami, obciążnik na kostce, masa ciała). Jeśli koordynator uzna, że wyciąg z opaską to wariant „z dodatkiem” wymagający własnego źródła — ćwiczenie „otwarte”. Rozstrzygnie: drugie źródło szczebla 4 o wersji z wyciągiem (np. instrukcja producenta wyciągu z opaską).
- **Standing Leg Curl** — źródło o maszynie jest jedno (Body-Solid); dlatego zdanie ustawienia jest ogólne („przodem do maszyny lub podpory, przytrzymaj się”), bez wałka i osi kolana. Szczegół maszyny (piętą pod dolny wałek, kolano tuż pod górną poduszką) — jedno źródło, nie wpisane.
- **Leg Curl (hantel)** — dwa przeczytane opisy (rdlfitness.com, weighttraining.guide) zgadzają się: leżenie przodem na płaskiej ławce, hantel ściśnięty między stopami, podeszwy do sufitu, trzymanie ławki — ale autorzy bez podanych kwalifikacji i bez organizacji (kryterium a) → szczebel 5, nie liczone. Rozstrzygnie: 2 źródła szczebla 4 o wersji z hantlem. Uwaga: źródła o leżącym uginaniu na maszynie (ace-153, nasm-lying-leg-curl) to formalnie wariant „inny sprzęt” i potwierdzają `lcurl.move`, `llc.hips`; ustawienia z hantlem nie potwierdzają — jeśli koordynator dopuszcza kartę bez ustawienia, może przenieść te dwa zdania (nie sprawdzałem ich ponownie w tej sesji).
- **Single-Leg Leg Extension** — NFPT pisze, że wersję jednonóż robi się „for rehab purposes only” i że może obciążać dolne plecy; to twierdzenie zdrowotne z jednego źródła, nie wpisane; Topend Sports (szczebel 5) i Physitrack (wersja jednonóż w bibliotece ćwiczeń) podają ją bez zastrzeżeń. Nie przeczy to zdaniom karty, ale koordynator może chcieć to odnotować.
- **Błędy zestawów ogólnych (`lib/figures/v2/cue-sets.json`)** — informacja dla koordynatora:
  - `Stability Ball Hamstring Curl`: `err: ht.mis.arch` — ACE #59 mówi wprost o przeproście lędźwi przy zbyt wysokich biodrach, NCSF tylko o neutralnej miednicy; nie wpisane do karty (jedno źródło wprost). `llc.control` („bez szarpania”) — NCSF każe „forcefully drive” piętę w piłkę; nie wpisane.
  - `Slider Hamstring Curl`: `gb.heels`, `ht.mis.arch` — brak przeczytanego źródła o tym ćwiczeniu (Prehab każe jedynie nie wyginać tułowia na boki: „don’t twist”; jedno źródło, nie wpisane).
  - `Glute Ham Raise`: `mis.jerk` — tylko Robertson (rozpęd) wprost; nie wpisane.
  - `Standing Leg Curl`, `Standing Cable Leg Curl`, `Seated Band Hamstring Curl`: `lcurl.still` i `mis.jerk` — żadne przeczytane źródło o tych wariantach tego nie mówi (dla stojącego jest `scurl.knee`); karty z kontynuacji ich nie zawierają. `Leg Curl (hantel)`: jak wyżej, brak źródeł.
  - `Single-Leg Leg Extension`: `lext.range` — kąt dolny („mniej więcej pod kątem prostym”) potwierdza tylko NFPT (kolana pod 90° w pozycji wyjściowej), a Hoist i Topend radzą nie blokować kolan u góry, co zderza się z „aż do wyprostu kolan” — zastąpione prostszym `lext.move`; `mis.jerk` — wprost tylko Topend (szczebel 5) — nie wpisane.
- **Glute Ham Raise — dwie odmiany techniki**: źródła opisują GHR z biodrem wyprostowanym przez cały ruch (Prehab, Bells of Steel, McAllister 2014). Część trenerów opisuje wersję z prostowaniem biodra z pozycji zgiętej; nie przeczytano źródła tej wersji. Karta opisuje tylko wersję z biodrem wyprostowanym.

## 7. Dostęp

- ExRx (403) i web.archive.org (zablokowane) — pominięte zgodnie z poleceniem koordynatora.
- 404: barbend.com/reverse-nordic-curl/, barbend.com/glute-ham-raise/, breakingmuscle.com/sissy-squat/, breakingmuscle.com/glute-ham-raise/, garagegymreviews.com/sissy-squat, theprehabguys.com/vimeo-video/sissy-squat/, theprehabguys.com/vimeo-video/reverse-nordic/, elitefts.com (artykuł o ustawieniu GHR); z kontynuacji: nasm.org/resource-center/exercise-library/leg-extension i …/single-leg-leg-extension, ironmaster.com (wpis o sissy squat).
- 403: powerliftingtechnique.com, nsca.com i dxpprod.nsca.com (Kinetic Select „Glute Ham Raise”, fragment podręcznika techniki NSCA — warto przeczytać innym kanałem), sportsrehab.ucsf.edu (protokół PDF); z kontynuacji: mennohenselmans.com.
- Inne: muscleandfitness.com (narzędzie nie pobiera), stack.com (503), manualshive.com (instrukcja ślizgaczy — blokada antybotowa), library.theprehabguys.com/?p=… (przekierowanie do logowania), ericcressey.com (treść tylko w filmie); z kontynuacji: bodysolid.com/Exercises/Article/46/Leg-Extension (strona o konserwacji, bez instrukcji ćwiczenia).
