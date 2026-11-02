# Wskazówki techniki — rodzina `leg_isolation` (fala W1)

Data: 02.11.2026 · autor: badacz-merytoryczny · Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1

Metoda jak w `docs/research/33-wskazowki-partia2.md`: każde zdanie ma ≥ 2 przeczytane (WebFetch) źródła szczebla 4 z różnych organizacji
(albo szczebel 3 + 4), o tym ćwiczeniu lub jego wariancie (oznaczone „(wariant: …)”). Bez liczb (tempo, obciążenia) i bez twierdzeń o zdrowiu.
Źródła o innym ćwiczeniu (analogia) się nie liczą. Strony innych aplikacji pominięte (polecenie koordynatora 02.11).

## 1. Tabela ćwiczeń

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Sissy Squat | otwarte | ruch + 1 wskazówka mają 2 źródła; brak ustawienia z 2 źródłami (sekcja 6) |
| Reverse Nordic | gotowe | Physitrack, The Prehab Guys, E3 Rehab |
| Glute Ham Raise | gotowe | The Prehab Guys, Bells of Steel (producent GHD), Robertson Training Systems; McAllister i in. 2014 (szczebel 3) do pozycji bioder |
| Standing Leg Curl | otwarte | tylko wariant bez maszyny (obciążnik na kostce / masa ciała); brak źródła o maszynie i ustawienia |
| Standing Cable Leg Curl | otwarte | jak wyżej; brak przeczytanego źródła o wersji z wyciągiem |
| Leg Curl (hantel) | otwarte | znalezione tylko serwisy spoza listy organizacji (sekcja 6) |
| Single-Leg Leg Extension | otwarte | nie zbadano — limit kontekstu (sekcja „Stan”) |
| Stability Ball Hamstring Curl | gotowe | ACE #59, NCSF (wariant: jednonóż) |
| Slider Hamstring Curl | otwarte | brak dostępnego źródła z listy organizacji (sekcja 6, 7) |
| Seated Band Hamstring Curl | otwarte | nie zbadano — limit kontekstu |

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

Zdania częściowe (do ćwiczeń otwartych, nie do aplikacji dopóki ćwiczenie otwarte):

| id | PL | EN (propozycja) | źródła |
|---|---|---|---|
| sissy.move | Uginaj kolana i jednocześnie odchylaj tułów w tył, unosząc pięty; potem wróć do stania. | Bend your knees while leaning your torso back and lifting your heels; then return to standing. | issa-squat-variations (sekcja Sissy Squat), barbend-sissy-squat (Step 1–3) |
| sissy.torso | Plecy proste, tułów napięty przez cały ruch. | Back straight, torso braced throughout. | issa-squat-variations („The back remains straight throughout the exercise”), barbend-sissy-squat (Common Mistakes: Not Bracing Your Torso) |
| scurl.move | Zegnij kolano, przyciągając piętę w stronę pośladka; opuść ją powoli. | Bend your knee, bringing your heel toward your glute; lower it slowly. | (wariant: bez maszyny) physitrack-otago-standing-curl, prehab-standing-hamstring-curl |
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
| physitrack-otago-standing-curl | https://ca.physitrack.com/home-exercise-video/otago-standing-hamstring-curl | Physitrack | 4 | opis (tylko do zdań częściowych) |
| prehab-standing-hamstring-curl | https://theprehabguys.com/vimeo-video/standing-hamstring-curl-2/ | The Prehab Guys | 4 | HOW; COMPENSATION (tylko do zdań częściowych) |

Pomocniczo przeczytane, szczebel 5 (nie liczone): Tony Gentilcore, „Exercises You Should Be Doing: Reverse Nordic Curl”, https://tonygentilcore.com/2019/02/exercises-reverse-nordic-curl/ — „stacked” głowa–tułów–biodra–kolana przez cały ruch (zgodne z `rnordic.line`).

```json
{
  "orgs": {
    "NCSF": {"name": "National Council on Strength and Fitness — blog edukacyjny (ncsf.org)", "level": 4, "kind": "org"},
    "ISSA": {"name": "International Sports Sciences Association — blog edukacyjny (issaonline.com)", "level": 4, "kind": "org"},
    "E3 Rehab": {"name": "E3 Rehab — artykuły edukacyjne (e3rehab.com, fizjoterapeuci)", "level": 4, "kind": "site"},
    "Bells of Steel": {"name": "Bells of Steel — blog producenta sprzętu (GHD)", "level": 4, "kind": "maker"},
    "Robertson Training Systems": {"name": "Robertson Training Systems — blog trenerski (M. Robertson, IFAST)", "level": 4, "kind": "site"},
    "McAllister i in. (University of Memphis)": {"name": "McAllister i in. (University of Memphis) — badanie, J Strength Cond Res 2014", "level": 3, "kind": "study"}
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
    "prehab-standing-hamstring-curl": {"org": "The Prehab Guys", "title": "Standing Hamstring Curl", "url": "https://theprehabguys.com/vimeo-video/standing-hamstring-curl-2/", "level": 4}
  }
}
```

## 6. Otwarte

- **Sissy Squat** — brak ustawienia z 2 źródłami: BarBend (stopy pod biodrami, przytrzymanie framugi/sztangi w stojaku), ISSA o ustawieniu milczy (wspomina tylko maszynę, która blokuje podudzia). Rozstrzygnie: drugie źródło z listy organizacji z pozycją wyjściową (np. NSCA, ACE). Zdania częściowe `sissy.move`, `sissy.torso` gotowe do użycia, gdy dojdzie ustawienie.
- **Standing Leg Curl / Standing Cable Leg Curl** — źródła tylko o wariancie bez maszyny (obciążnik na kostce, masa ciała); brak przeczytanego źródła z ustawieniem maszyny (wałek nad piętą, oś przy kolanie) ani wersji z wyciągiem i opaską. Rozstrzygnie: instrukcja producenta maszyny do stojącego uginania albo biblioteka organizacji szkolącej trenerów.
- **Leg Curl (hantel)** — znalezione opisy tylko w serwisach spoza listy organizacji (agregatory ćwiczeń, sklepy z suplementami); żadnego nie przeczytano jako źródła. Rozstrzygnie: 2 źródła szczebla 4 z listy.
- **Slider Hamstring Curl** — opisy z bibliotek aplikacji pominięte (polecenie koordynatora); strona The Prehab Guys o wersji jednonóż w bibliotece wymaga logowania; protokół UCSF (PDF) i instrukcja producenta ślizgaczy — niedostępne (sekcja 7).
- **Single-Leg Leg Extension, Seated Band Hamstring Curl** — niezbadane (limit kontekstu).
- **Błędy zestawów ogólnych (`lib/figures/v2/cue-sets.json`)** — informacja dla koordynatora:
  - `Stability Ball Hamstring Curl`: `err: ht.mis.arch` — ACE #59 mówi wprost o przeproście lędźwi przy zbyt wysokich biodrach, NCSF tylko o neutralnej miednicy; nie wpisane do karty (jedno źródło wprost). `llc.control` („bez szarpania”) — NCSF każe „forcefully drive” piętę w piłkę; nie wpisane.
  - `Slider Hamstring Curl`: `gb.heels`, `ht.mis.arch` — brak przeczytanego źródła o tym ćwiczeniu.
  - `Glute Ham Raise`: `mis.jerk` — tylko Robertson (rozpęd) wprost; nie wpisane.
  - `Standing Leg Curl`, `Standing Cable Leg Curl`, `Leg Curl (hantel)`, `Seated Band Hamstring Curl`: `lcurl.still`, `llc.control`, `mis.jerk` — bez przeczytanych źródeł o tych wariantach (dla stojącego jest tylko wariant bez maszyny, zgodny z `scurl.knee`).
  - `Single-Leg Leg Extension`: `lext.range`, `llc.control` — niesprawdzone dla wersji jednonóż.
- **Glute Ham Raise — dwie odmiany techniki**: źródła opisują GHR z biodrem wyprostowanym przez cały ruch (Prehab, Bells of Steel, McAllister 2014). Część trenerów opisuje wersję z prostowaniem biodra z pozycji zgiętej; nie przeczytano źródła tej wersji. Karta opisuje tylko wersję z biodrem wyprostowanym.

## 7. Dostęp

- ExRx (403) i web.archive.org (zablokowane) — pominięte zgodnie z poleceniem koordynatora.
- 404: barbend.com/reverse-nordic-curl/, barbend.com/glute-ham-raise/, breakingmuscle.com/sissy-squat/, breakingmuscle.com/glute-ham-raise/, garagegymreviews.com/sissy-squat, theprehabguys.com/vimeo-video/sissy-squat/, theprehabguys.com/vimeo-video/reverse-nordic/, elitefts.com (artykuł o ustawieniu GHR).
- 403: powerliftingtechnique.com, nsca.com i dxpprod.nsca.com (Kinetic Select „Glute Ham Raise”, fragment podręcznika techniki NSCA — warto przeczytać innym kanałem), sportsrehab.ucsf.edu (protokół PDF).
- Inne: muscleandfitness.com (narzędzie nie pobiera), stack.com (503), manualshive.com (instrukcja ślizgaczy — blokada antybotowa), library.theprehabguys.com/?p=… (przekierowanie do logowania), ericcressey.com (treść tylko w filmie).

## Stan

- Zrobione: Reverse Nordic, Glute Ham Raise, Stability Ball Hamstring Curl (gotowe); Sissy Squat, Standing Leg Curl, Standing Cable Leg Curl (częściowe); Leg Curl (hantel), Slider Hamstring Curl (poszukiwania bez wyniku).
- Zostało: Single-Leg Leg Extension, Seated Band Hamstring Curl; ustawienie Sissy Squat; źródło maszyny do stojącego uginania.
- Następny krok: NSCA Kinetic Select (GHR) innym kanałem; ACE/NASM — wyszukać „single leg extension”, „band hamstring curl seated”; Physitrack „hamstring curl seated with band”.
- Pułapki: BarBend i Breaking Muscle mają inne adresy niż /nazwa-ćwiczenia/ (404); biblioteka The Prehab Guys pod `library.` i `?p=` wymaga logowania — działa `theprehabguys.com/vimeo-video/<slug>/`.
