# Wskazówki techniki — rodzina olympic, grupa rwania (fala W1)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3). Zakres: TYLKO zebrane dane (polecenie właściciela 02.11.2026) — nic nie jest w `lib/` ani `data/zrodla/`.
Metoda: CLAUDE.md „Wyjątek dla wskazówek techniki” — zdanie ustalone, gdy zgadzają się ≥ 2 niezależne, przeczytane źródła szczebla 4 z różnych organizacji; miejsce w źródle podane. Teksty zdań bez nazw źródeł. Dzisiejszy zestaw ogólny „oly” (`oly.back`, `oly.close`, `oly.legs`, `oly.mis`) sprawdzony zdanie po zdaniu — użyte tylko `oly.close` i `oly.legs` (patrz „Otwarte”).

Dostęp w tej sesji: nsca.com (Kinetic Select „Power Snatch”) → 403; muscleandstrength.com → 403; educ.jmu.edu (strona CSCCa) — host poza dozwoloną siecią sesji (trzeba go dopuścić w ustawieniach sieci); PDF Queensland Weightlifting Association nieczytelny dla narzędzia; ExRx/Wayback — nie próbowano (uzupełnienie briefu). Strony aplikacji treningowych z wyników wyszukiwania pominięto.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Barbell Snatch | gotowe | setup, move, 3 wskazówki, 3 błędy — każde ≥ 2 organizacje |
| Power Snatch | gotowe | błędy z materiałów o rwaniu ogólnie — **uproszczenie** (wariant różni się głębokością odbioru, nie torem ciągu) |
| Hang Snatch | gotowe | ustawienie zwisu z 3 organizacji; ruch/błędy z rwania ogólnie i z rwania ze zwisu — **uproszczenie** (różni się pozycją startu) |
| Snatch Pull | częściowe | brak błędu z 2 źródłami (patrz „Otwarte”) |
| Muscle Snatch | gotowe | |
| Snatch Balance | częściowe | brak błędu z 2 źródłami |
| Block Snatch | gotowe | ustawienie grip/plecy i błędy z rwania ogólnie — **uproszczenie** (różni się pozycją startu) |
| Block Power Snatch | gotowe | jak wyżej — **uproszczenie** |
| Split Snatch | częściowe | brak ruchu (odbiór w nożycach) z 2 źródłami; ustawienie i błąd z rwania ogólnie + jedno źródło o wariancie — **uproszczenie**; organizacja `Torokhtiy` szczebel 4 do akceptacji |
| Snatch Shrug | otwarte | jedno źródło szczebla 4 + blog trenera; źródła różnią się przebiegiem ruchu |

## 2. Dane (propozycja w formacie `data/zrodla/cues.json`)

```json
{
 "orgs": {
  "Catalyst Athletics": {"name": "Catalyst Athletics — Olympic Weightlifting Exercise Library i artykuły (catalystathletics.com; Greg Everett)", "level": 4, "kind": "site"},
  "CrossFit": {"name": "CrossFit — Pro Coach „Ask a Coach” (crossfit.com; trener CF-L4)", "level": 4, "kind": "org"},
  "Rogue Fitness": {"name": "Rogue Fitness — The Index, Movement Library (producent sprzętu)", "level": 4, "kind": "maker"},
  "Torokhtiy": {"name": "Torokhtiy (Warm Body Cold Mind) — przewodniki ćwiczeń producenta sprzętu do podnoszenia ciężarów; autor: olimpijczyk, PhD nauk o sporcie (PROPOZYCJA szczebla 4)", "level": 4, "kind": "maker"}
 },
 "sources": {
  "catalyst-58": {"org": "Catalyst Athletics", "title": "Snatch (#58)", "url": "https://www.catalystathletics.com/exercise/58/Snatch/", "level": 4},
  "catalyst-61": {"org": "Catalyst Athletics", "title": "Power Snatch (#61)", "url": "https://www.catalystathletics.com/exercise/61/", "level": 4},
  "catalyst-62": {"org": "Catalyst Athletics", "title": "Hang Power Snatch (#62)", "url": "https://www.catalystathletics.com/exercise/62/Hang-Power-Snatch/", "level": 4},
  "catalyst-80": {"org": "Catalyst Athletics", "title": "Snatch Balance (#80)", "url": "https://www.catalystathletics.com/exercise/80/Snatch-Balance/", "level": 4},
  "catalyst-92": {"org": "Catalyst Athletics", "title": "Snatch Shrug (#92)", "url": "https://www.catalystathletics.com/exercise/92/Snatch-Shrug/", "level": 4},
  "catalyst-96": {"org": "Catalyst Athletics", "title": "Muscle Snatch (#96)", "url": "https://www.catalystathletics.com/exercise/96/Muscle-Snatch/", "level": 4},
  "catalyst-97": {"org": "Catalyst Athletics", "title": "Snatch Pull (#97)", "url": "https://www.catalystathletics.com/exercise/97/Snatch-Pull/", "level": 4},
  "catalyst-203": {"org": "Catalyst Athletics", "title": "Block Power Snatch (#203)", "url": "https://www.catalystathletics.com/exercise/203/Block-Power-Snatch/", "level": 4},
  "catalyst-207": {"org": "Catalyst Athletics", "title": "Block Snatch (#207)", "url": "https://catalystathletics.com/exercise/207/Block-Snatch/", "level": 4},
  "catalyst-art-2076": {"org": "Catalyst Athletics", "title": "Everett: Keeping the Bar Close — The 3 Biggest Mistakes You're Making (2017)", "url": "https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making", "level": 4},
  "catalyst-art-1904": {"org": "Catalyst Athletics", "title": "Everett: Arm Bend in the Snatch & Clean — It's Still Not the Solution", "url": "https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/", "level": 4},
  "barbend-power-snatch": {"org": "BarBend", "title": "Power Snatch (R. Stefan, USAW-L1)", "url": "https://barbend.com/power-snatch/", "level": 4},
  "barbend-fix-your-snatch": {"org": "BarBend", "title": "Need to Fix Your Snatch? (R. Stefan, USAW-L1)", "url": "https://barbend.com/fix-your-snatch/", "level": 4},
  "barbend-muscle-snatch": {"org": "BarBend", "title": "Muscle Snatch (C. Trieu, 2024)", "url": "https://barbend.com/muscle-snatch/", "level": 4},
  "barbend-snatch-balance": {"org": "BarBend", "title": "Snatch Balance (M. Dewar, CSCS)", "url": "https://barbend.com/snatch-balance/", "level": 4},
  "barbend-hang-lifts": {"org": "BarBend", "title": "What Are Hang Lifts in Weightlifting? (J. Dickson, USAW-L2)", "url": "https://barbend.com/what-are-hang-lifts-in-weightlifting/", "level": 4},
  "barbend-blocks-vs-hang": {"org": "BarBend", "title": "Weightlifting Blocks vs. the Hang (J. Dickson, USAW-L2)", "url": "https://barbend.com/weightlifting-blocks-vs-hang/", "level": 4},
  "bm-snatch-newton": {"org": "Breaking Muscle", "title": "Newton: Learning and Training the Proper Technique for the Barbell Snatch", "url": "https://breakingmuscle.com/learning-and-training-the-proper-technique-for-the-barbell-snatch/", "level": 4},
  "crossfit-snatch-forward": {"org": "CrossFit", "title": "O'Connor (CF-L4): Ask a Coach — Missing the Bar Forward in the Snatch (2025)", "url": "https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch", "level": 4},
  "rogue-snatch-pull": {"org": "Rogue Fitness", "title": "Movement Demo — Snatch Pull (2025)", "url": "https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull", "level": 4},
  "rogue-hang-squat-snatch": {"org": "Rogue Fitness", "title": "Movement Demo — Hang Squat Snatch", "url": "https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch", "level": 4},
  "rogue-hang-power-snatch": {"org": "Rogue Fitness", "title": "Movement Demo — Hang Power Snatch", "url": "https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-snatch", "level": 4},
  "torokhtiy-split-snatch": {"org": "Torokhtiy", "title": "Split Snatch Exercise: How To, Benefits and Variations (O. Torokhtiy)", "url": "https://store.torokhtiy.com/blogs/exercises/split-snatch", "level": 4}
 },
 "exercises": {
  "Barbell Snatch": {
   "setup": [
    {"c": "olympic.setup", "s": [["catalyst-58", "opis wykonania, start (snatch-width grip; back extended; shoulder joint above the bar)"], ["barbend-power-snatch", "Step 1 Set Your Start (wide snatch grip; back tight) i Step 2 (shoulders over the bar) — wariant power"], ["bm-snatch-newton", "Basic Technique (fairly wide, overhand grip; flat back)"]]}
   ],
   "move": [
    {"c": "olympic.snatchMove", "s": [["catalyst-58", "opis wykonania (push with the legs; extend the hips; pull elbows up and out; squat under; stand once secure)"], ["bm-snatch-newton", "Basic Technique (first pull via knee extension; full extension; catch overhead in a full squat) i Learning to Snatch (pulling yourself under)"], ["rogue-hang-squat-snatch", "Extension, Receive (full depth overhead squat, locked out arms) — wariant: ze zwisu"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-58", "opis wykonania (keeping the bar as close to the body as possible)"], ["bm-snatch-newton", "Basic Technique (keep the barbell close to the torso)"]]},
    {"c": "oly.legs", "s": [["catalyst-58", "start (arms relaxed and straight) i ciąg (push with the legs)"], ["bm-snatch-newton", "Basic Technique (legs perform the first pull; arms kept straight)"]]},
    {"c": "olympic.overBar", "s": [["barbend-fix-your-snatch", "pkt 2 Not Staying Over the Bar"], ["rogue-hang-squat-snatch", "Extension (shoulders and chest stay over the bar for as long as possible) — wariant: ze zwisu"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.away", "s": [["crossfit-snatch-forward", "First Pull: The bar separates from the body; Second Pull: Hips are banging into the bar"], ["catalyst-art-2076", "pkt 1 Forward Imbalance in the Pull, pkt 2 Bumping the Bar Off the Hips"]]},
    {"c": "olympic.mis.armsEarly", "s": [["crossfit-snatch-forward", "Second Pull: Early Arm Pull"], ["catalyst-art-1904", "Why It's a Problem"]]},
    {"c": "olympic.mis.softLockout", "s": [["crossfit-snatch-forward", "Third Pull: Lazy lockout"], ["barbend-fix-your-snatch", "pkt 4 A Loose Catch"]]}
   ]
  },
  "Power Snatch": {
   "setup": [
    {"c": "olympic.setup", "s": [["barbend-power-snatch", "Step 1 Set Your Start, Step 2 Pull Into the Hip (shoulders over the bar)"], ["catalyst-58", "start — rwanie ogólnie (uproszczenie: ten sam start)"], ["catalyst-61", "opis wykonania (set the starting position tightly)"]]}
   ],
   "move": [
    {"c": "olympic.powerMove", "s": [["catalyst-61", "opis wykonania (extend the hips; pull elbows up and out; remain above a parallel squat)"], ["barbend-power-snatch", "Steps 2–4 (hip crease above knee in the catch)"], ["rogue-hang-power-snatch", "Receive (hip crease higher than the top of the knees) — wariant: ze zwisu"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-61", "opis wykonania (bar as close to the body as possible)"], ["barbend-power-snatch", "Muscles Worked › Upper & Lower Back (keep the bar tight to your body)"]]},
    {"c": "oly.legs", "s": [["barbend-power-snatch", "Step 2 (arms should remain straight as you pull)"], ["rogue-hang-power-snatch", "Extension (leg drive, arms remaining straight) — wariant: ze zwisu"], ["catalyst-61", "opis wykonania (push with the legs)"]]},
    {"c": "olympic.overBar", "s": [["barbend-power-snatch", "Step 2 (shoulders vertically over the bar)"], ["rogue-hang-power-snatch", "Extension (shoulders and chest over the bar as long as possible) — wariant: ze zwisu"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.away", "s": [["crossfit-snatch-forward", "First/Second Pull — rwanie ogólnie (uproszczenie)"], ["catalyst-art-2076", "pkt 1–2 — rwanie i zarzut ogólnie (uproszczenie)"]]},
    {"c": "olympic.mis.armsEarly", "s": [["crossfit-snatch-forward", "Second Pull: Early Arm Pull — rwanie ogólnie (uproszczenie)"], ["catalyst-art-1904", "Why It's a Problem — rwanie i zarzut ogólnie (uproszczenie)"]]},
    {"c": "olympic.mis.softLockout", "s": [["crossfit-snatch-forward", "Third Pull: Lazy lockout (uproszczenie)"], ["barbend-fix-your-snatch", "pkt 4 A Loose Catch (uproszczenie)"]]}
   ]
  },
  "Hang Snatch": {
   "setup": [
    {"c": "olympic.hangSetup", "s": [["catalyst-62", "opis wykonania (deadlift the bar to standing; lower under control to the hang) — wariant power"], ["rogue-hang-squat-snatch", "Hang Position (hips pushed back; flat back; shoulders on top or just in front of the bar)"], ["barbend-hang-lifts", "What Is the Hang Position (bar suspended; lowered by hinging at the hips)"]]}
   ],
   "move": [
    {"c": "olympic.snatchMove", "s": [["rogue-hang-squat-snatch", "Extension, Pull Under, Receive (full depth overhead squat), Lockout"], ["catalyst-58", "opis wykonania — rwanie ogólnie (uproszczenie: inny start)"], ["bm-snatch-newton", "Basic Technique — rwanie ogólnie (uproszczenie)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["rogue-hang-squat-snatch", "Arms (high elbows to keep the bar close to the body)"], ["catalyst-62", "opis wykonania (bar as close to the body as possible)"]]},
    {"c": "oly.legs", "s": [["rogue-hang-squat-snatch", "Extension (leg drive and the arms remaining straight)"], ["barbend-hang-lifts", "legs extend fully before your arms do any work (hang muscle snatch — wariant)"], ["catalyst-58", "rwanie ogólnie"]]},
    {"c": "olympic.overBar", "s": [["rogue-hang-squat-snatch", "Extension"], ["barbend-fix-your-snatch", "pkt 2 — rwanie ogólnie"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.away", "s": [["crossfit-snatch-forward", "Second Pull: Hips banging into the bar (uproszczenie)"], ["catalyst-art-2076", "pkt 2 Bumping the Bar Off the Hips (uproszczenie)"]]},
    {"c": "olympic.mis.armsEarly", "s": [["crossfit-snatch-forward", "Second Pull: Early Arm Pull (uproszczenie)"], ["catalyst-art-1904", "Why It's a Problem (uproszczenie)"]]},
    {"c": "olympic.mis.softLockout", "s": [["crossfit-snatch-forward", "Third Pull: Lazy lockout (uproszczenie)"], ["barbend-fix-your-snatch", "pkt 4 A Loose Catch (uproszczenie)"]]}
   ]
  },
  "Snatch Pull": {
   "setup": [
    {"c": "olympic.setup", "s": [["catalyst-97", "opis (set the snatch starting position tightly; arms relaxed)"], ["rogue-snatch-pull", "Setup (snatch grip) i Extension (chest and shoulders over the bar); Common cues (flat back)"]]}
   ],
   "move": [
    {"c": "olympic.pullMove", "s": [["catalyst-97", "opis (push with the legs; extend the entire body; shrug up and back)"], ["rogue-snatch-pull", "First Pull, Extension (triple extension), Shrug (finish with a powerful shrug)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-97", "opis (keep the bar as close to the legs as possible; at no point should it move away)"], ["rogue-snatch-pull", "First Pull (keeping the bar close to the legs)"]]},
    {"c": "oly.legs", "s": [["catalyst-97", "opis (arms relaxed and stretched long; push with the legs)"], ["rogue-snatch-pull", "Bar Close and Arms Straight; Do NOT pull with the arms"]]}
   ],
   "mistakes": []
  },
  "Muscle Snatch": {
   "setup": [
    {"c": "olympic.setup", "s": [["catalyst-96", "opis (set your snatch starting position) — uproszczenie: start jak w rwaniu"], ["barbend-muscle-snatch", "Setup (snatch starting position; shoulders over or slightly ahead of the bar)"]]}
   ],
   "move": [
    {"c": "olympic.msMove", "s": [["catalyst-96", "opis (extend close to vertically; pull elbows up and out; turn the bar over; legs tight pushing into the floor)"], ["barbend-muscle-snatch", "Second Pull, Turnover, Lockout (without re-bending your legs)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-96", "opis (bar as close to the body as possible)"], ["barbend-muscle-snatch", "Bar Close"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.leanBack", "s": [["catalyst-96", "opis (extend close to vertically rather than leaning the trunk farther back)"], ["barbend-muscle-snatch", "Common Mistakes: Going Too Heavy (lean back too far)"]]}
   ]
  },
  "Snatch Balance": {
   "setup": [
    {"c": "olympic.sbSetup", "s": [["catalyst-80", "opis (barbell behind your neck with a snatch-width grip)"], ["barbend-snatch-balance", "Step 1 Set Up (on the back, hands in the snatch grip)"]]}
   ],
   "move": [
    {"c": "olympic.sbMove", "s": [["catalyst-80", "opis (bend the knees; drive up; move feet into receiving stance; squat into the bottom of an overhead squat; stand)"], ["barbend-snatch-balance", "Step 2 Press and Dip, Step 3 Receive the Bar, Then Stand"]]}
   ],
   "tips": [
    {"c": "olympic.sbPush", "s": [["catalyst-80", "opis (punch the arms aggressively up into the bar)"], ["barbend-snatch-balance", "Step 3 (reach the arms into the barbell) i wskazówki (pushing up and into it)"]]}
   ],
   "mistakes": []
  },
  "Block Snatch": {
   "setup": [
    {"c": "olympic.blockSetup", "s": [["catalyst-207", "opis (most commonly the bar starting at knee height)"], ["barbend-blocks-vs-hang", "knee-height blocks (stronger position than the floor)"]]},
    {"c": "olympic.setup", "s": [["catalyst-207", "opis (same position as in a snatch with the bar at that height)"], ["catalyst-58", "start — rwanie ogólnie"], ["bm-snatch-newton", "Basic Technique — rwanie ogólnie (uproszczenie: inny start)"]]}
   ],
   "move": [
    {"c": "olympic.snatchMove", "s": [["catalyst-207", "opis (push with the legs; extend; pull elbows up and out; squat under; fix overhead; stand)"], ["bm-snatch-newton", "Basic Technique — rwanie ogólnie (uproszczenie)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-207", "opis (bar as close to the body as possible)"], ["bm-snatch-newton", "Basic Technique — rwanie ogólnie (uproszczenie)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.away", "s": [["crossfit-snatch-forward", "Second Pull (uproszczenie)"], ["catalyst-art-2076", "pkt 2 (uproszczenie)"]]},
    {"c": "olympic.mis.armsEarly", "s": [["crossfit-snatch-forward", "Second Pull: Early Arm Pull (uproszczenie)"], ["catalyst-art-1904", "Why It's a Problem (uproszczenie)"]]}
   ]
  },
  "Block Power Snatch": {
   "setup": [
    {"c": "olympic.blockSetup", "s": [["catalyst-203", "opis (most commonly the bar starting at knee height)"], ["barbend-blocks-vs-hang", "Block Height (knee-height blocks; above knee for high-block power variations)"]]}
   ],
   "move": [
    {"c": "olympic.powerMove", "s": [["catalyst-203", "opis (push with the legs; extend; pull elbows up and out; remain above a parallel squat)"], ["barbend-power-snatch", "Steps 3–4 (uproszczenie: inny start)"]]}
   ],
   "tips": [
    {"c": "oly.close", "s": [["catalyst-203", "opis (bar as close to the body as possible)"], ["barbend-power-snatch", "Muscles Worked › Upper & Lower Back (uproszczenie)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.away", "s": [["crossfit-snatch-forward", "Second Pull (uproszczenie)"], ["catalyst-art-2076", "pkt 2 (uproszczenie)"]]},
    {"c": "olympic.mis.armsEarly", "s": [["crossfit-snatch-forward", "Second Pull: Early Arm Pull (uproszczenie)"], ["catalyst-art-1904", "Why It's a Problem (uproszczenie)"]]}
   ]
  },
  "Split Snatch": {
   "setup": [
    {"c": "olympic.setup", "s": [["catalyst-58", "start — rwanie ogólnie (uproszczenie: ten sam start)"], ["bm-snatch-newton", "Basic Technique — rwanie ogólnie (uproszczenie)"], ["torokhtiy-split-snatch", "Start (back straight)"]]}
   ],
   "move": [],
   "tips": [
    {"c": "oly.close", "s": [["torokhtiy-split-snatch", "Pull (keep it close to your body)"], ["catalyst-58", "rwanie ogólnie (uproszczenie)"]]}
   ],
   "mistakes": [
    {"c": "olympic.mis.armsEarly", "s": [["torokhtiy-split-snatch", "Common Mistakes: Pulling Too Early"], ["crossfit-snatch-forward", "Second Pull: Early Arm Pull — rwanie ogólnie (uproszczenie)"]]}
   ]
  }
 }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| olympic.setup | Szeroki chwyt, plecy proste i napięte, barki nad sztangą. | Wide grip, back flat and tight, shoulders over the bar. |
| olympic.snatchMove | Odepchnij się nogami od podłogi, przy biodrach wyprostuj się dynamicznie i wciągnij się pod sztangę — złap ją na prostych rękach w pełnym przysiadzie, potem wstań. | Drive the floor away with your legs, extend hard at the hips and pull yourself under — catch the bar on straight arms in a full squat, then stand up. |
| olympic.powerMove | Odepchnij się nogami od podłogi, przy biodrach wyprostuj się dynamicznie i wejdź pod sztangę — złap ją na prostych rękach wyżej niż w przysiadzie równoległym, biodra nad kolanami. | Drive with your legs, extend hard at the hips and get under the bar — catch it on straight arms above a parallel squat, hips above knees. |
| olympic.hangSetup | Podnieś sztangę do stania, potem opuść ją do zwisu, cofając biodra — plecy proste, barki nad sztangą. | Stand up with the bar, then lower it to the hang by pushing your hips back — back flat, shoulders over the bar. |
| olympic.blockSetup | Sztanga na blokach, zwykle mniej więcej na wysokości kolan. | Bar on blocks, usually about knee height. |
| olympic.pullMove | Wypchnij sztangę nogami, przy biodrach wyprostuj się dynamicznie i zakończ mocnym wzruszeniem barków — bez wchodzenia pod sztangę. | Drive the bar up with your legs, extend hard at the hips and finish with a strong shrug — don't drop under the bar. |
| olympic.msMove | Wyprostuj się dynamicznie, potem ciągnij łokcie w górę i na boki i przełóż sztangę nad głowę — bez ponownego ugięcia kolan. | Extend hard, then pull your elbows up and out and turn the bar over overhead — without rebending your knees. |
| olympic.sbSetup | Sztanga na górze pleców, za karkiem; chwyt jak do rwania. | Bar on your upper back, behind your neck, with a snatch grip. |
| olympic.sbMove | Krótko ugnij kolana, wybij sztangę z pleców i wejdź pod nią, przestawiając stopy do przysiadu; złap ją na prostych rękach w dole przysiadu i wstań. | Dip a little, drive the bar off your back and drop under it, moving your feet into your squat stance; catch it on straight arms at the bottom and stand up. |
| olympic.sbPush | Schodząc pod sztangę, pchaj rękami w górę w gryf. | As you drop under, punch your arms up into the bar. |
| olympic.overBar | Barki nad sztangą jak najdłużej — nie odchylaj się za wcześnie. | Keep your shoulders over the bar as long as you can — don't lean back too early. |
| olympic.mis.away | Sztanga odjeżdża od ciała — w ciągu albo po uderzeniu biodrami. | The bar drifts away from you — in the pull or after bumping it with your hips. |
| olympic.mis.armsEarly | Ciągnięcie rękami, zanim nogi i biodra skończą wyprost. | Pulling with your arms before your legs and hips finish the extension. |
| olympic.mis.softLockout | Miękkie łokcie nad głową — sztanga spycha cię w dół. | Soft elbows overhead — the bar pushes you down. |
| olympic.mis.leanBack | Mocne odchylanie tułowia w tył na górze ruchu. | Leaning way back at the top. |

Istniejące zdania użyte bez zmian: `oly.close`, `oly.legs`.

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| catalyst-58 | https://www.catalystathletics.com/exercise/58/Snatch/ | Catalyst Athletics | 4 | opis wykonania: „shoulder joint above the bar”, „keeping the bar as close to the body as possible” |
| catalyst-61 | https://www.catalystathletics.com/exercise/61/ | Catalyst Athletics | 4 | opis: „ensure you remain above a parallel squat” |
| catalyst-62 | https://www.catalystathletics.com/exercise/62/Hang-Power-Snatch/ | Catalyst Athletics | 4 | opis: „lower the bar under control to the chosen hang position” |
| catalyst-80 | https://www.catalystathletics.com/exercise/80/Snatch-Balance/ | Catalyst Athletics | 4 | opis: „Punch the arms aggressively up into the bar as you lift” |
| catalyst-92 | https://www.catalystathletics.com/exercise/92/Snatch-Shrug/ | Catalyst Athletics | 4 | opis: ruch „performed primarily with movement at the knees” (użyte tylko w „Otwarte”) |
| catalyst-96 | https://www.catalystathletics.com/exercise/96/Muscle-Snatch/ | Catalyst Athletics | 4 | opis: „Extend the entire body close to vertically rather than leaning the trunk farther back as you would in a snatch.” |
| catalyst-97 | https://www.catalystathletics.com/exercise/97/Snatch-Pull/ | Catalyst Athletics | 4 | opis: „shrug up and back and bend the elbows slightly” |
| catalyst-203 | https://www.catalystathletics.com/exercise/203/Block-Power-Snatch/ | Catalyst Athletics | 4 | opis: „Most commonly the lift is done with the bar starting at knee height.” |
| catalyst-207 | https://catalystathletics.com/exercise/207/Block-Snatch/ | Catalyst Athletics | 4 | opis: start „in the same position you would be in during a snatch with the bar at that height” |
| catalyst-art-2076 | https://catalystathletics.com/article/2076/Keeping-the-Bar-Close-The-3-Biggest-Mistakes-Youre-Making | Catalyst Athletics | 4 | pkt 2: „the lifter pushes the hips too far through the bar” |
| catalyst-art-1904 | https://catalystathletics.com/article/1904/Arm-Bend-in-the-Snatch-Clean-Its-Still-Not-the-Solution-to-/ | Catalyst Athletics | 4 | „Why It's a Problem”: „early bending of the arms can disrupt an optimal pull under the bar” |
| barbend-power-snatch | https://barbend.com/power-snatch/ | BarBend | 4 | Step 4: „your hip crease must stay above your knee when you catch the bar” |
| barbend-fix-your-snatch | https://barbend.com/fix-your-snatch/ | BarBend | 4 | pkt 2 i 4: „Make sure your shoulders are over the bar as you lift it.” |
| barbend-muscle-snatch | https://barbend.com/muscle-snatch/ | BarBend | 4 | Lockout: „without re-bending your legs at any point”; Common Mistakes |
| barbend-snatch-balance | https://barbend.com/snatch-balance/ | BarBend | 4 | Steps 1–3: „quickly move your feet outwards into your overhead squat stance” |
| barbend-hang-lifts | https://barbend.com/what-are-hang-lifts-in-weightlifting/ | BarBend | 4 | pozycja zwisu, opuszczanie przez zgięcie w biodrach |
| barbend-blocks-vs-hang | https://barbend.com/weightlifting-blocks-vs-hang/ | BarBend | 4 | wysokość bloków: kolana / nad kolanami |
| bm-snatch-newton | https://breakingmuscle.com/learning-and-training-the-proper-technique-for-the-barbell-snatch/ | Breaking Muscle (autor: H. Newton, trener kadry USA 1984) | 4 | Basic Technique: „The arms are kept straight during this phase.” |
| crossfit-snatch-forward | https://www.crossfit.com/pro-coach/ask-a-coach-missing-bar-forward-snatch | CrossFit | 4 | First/Second/Third Pull: „If the bar drifts away from the body, it may lead to missing lifts forward.” |
| rogue-snatch-pull | https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-snatch-pull | Rogue Fitness | 4 | Setup, First Pull, Shrug: „Do NOT pull with the arms — this isn't a high pull” |
| rogue-hang-squat-snatch | https://www.roguefitness.com/gb/theindex/movement-library/movement-demo-hang-squat-snatch | Rogue Fitness | 4 | Hang Position: „Hips are pushed back, hamstrings and lower back are working” |
| rogue-hang-power-snatch | https://www.roguefitness.com/theindex/movement-library/movement-demo-hang-power-snatch | Rogue Fitness | 4 | Receive: „is caught with the hip crease higher than the top of the knees” |
| torokhtiy-split-snatch | https://store.torokhtiy.com/blogs/exercises/split-snatch | Torokhtiy (producent sprzętu; autor olimpijczyk) | 4 (PROPOZYCJA) | How-To i Common Mistakes: „As you turn over the bar, split your feet so that one foot goes forward and the other one moves back.” |

Przeczytane, ale nie liczone: cissik.com/blog/?p=95 (J. Cissik, CSCS — blog osobisty, szczebel 5).

## 5. Otwarte

- **`oly.back` („klatka do góry”)** — „klatkę do góry” potwierdza tylko Rogue (snatch pull: „proud chest”); pozostałe źródła mówią o prostych/napiętych plecach. Zastąpione przez `olympic.setup` (plecy proste, barki nad sztangą — 3 organizacje). Nie wpisywać `oly.back` do tych ćwiczeń.
- **`oly.mis` („plecy się zaokrąglają”)** — żadne przeczytane źródło o rwaniu nie wymienia zaokrąglenia pleców jako błędu; część „sztanga odjeżdża” wydzielona jako `olympic.mis.away`. Nie wpisywać `oly.mis`.
- **Snatch Pull — błędy**: „nie ciągnij rękami” jest tylko w Rogue jako zakaz; Catalyst podaje to pozytywnie („arms relaxed”). Materiały o błędach dotyczą rwania, nie ciągu rwaniowego — nie przenoszę (uzupełnienie briefu: krótsza karta).
- **Snatch Balance — błędy**: tylko BarBend (zbyt szerokie łokcie w tył, ciąganie zamiast schodzenia pod sztangę); Catalyst nie podaje błędów. Brak drugiej organizacji.
- **Split Snatch — ruch (odbiór w nożycach, powrót: najpierw przednia noga)**: tylko jedno źródło o rwaniu w nożycach (Torokhtiy); pozostałe znalezione opisy dotyczą podrzutu w nożycach (analogia — nie liczy się). Kąt kolana „90–110°” z tego źródła — liczba, nie wpisuję. Do sprawdzenia: czy organizacja Torokhtiy (sklep ze sprzętem, autor olimpijczyk) ma szczebel 4.
- **Snatch Shrug — całość**: Catalyst (#92: start ze zwisu wysoko na udach, ruch głównie w kolanach, tułów prawie pionowo) i blog Cissika (biodra w tył, sztanga do połowy ud, wspięcie na palce) różnią się przebiegiem; drugie źródło szczebla 4 nie znalezione (muscleandstrength.com → 403).
- **Stopy na szerokość bioder** — tylko Catalyst (i Rogue „między biodrami a barkami”); BarBend nie podaje szerokości — pominięte w `olympic.setup`.
- **Niezależność BarBend i Breaking Muscle** — w `cues.json` są osobnymi organizacjami; jeśli audytor uzna je za jednego wydawcę, w tym pliku żadne zdanie nie opiera się tylko na tej parze (każde ma też Catalyst, Rogue albo CrossFit).
- **Strona NSCA „Power Snatch”** (Kinetic Select) i strona CSCCa (educ.jmu.edu) — niedostępne w tej sesji; mogłyby dać źródło organizacji szkolącej trenerów.
- **Hook grip, odbiór „power” w nożycach, wysokość bloków poniżej kolan** — nie badane.

## 6. Stan

- Zrobione (02.11.2026): wszystkie 10 ćwiczeń przejrzane — 6 gotowe (Barbell Snatch, Power Snatch, Hang Snatch, Muscle Snatch, Block Snatch, Block Power Snatch), 3 częściowe (Snatch Pull, Snatch Balance, Split Snatch), 1 otwarte (Snatch Shrug); 15 nowych zdań, 23 nowe źródła, 4 nowe organizacje.
- Zostało: drugie źródło dla błędów Snatch Pull i Snatch Balance, ruch Split Snatch, cały Snatch Shrug; decyzja o szczeblu organizacji Torokhtiy.
- Pułapki: strona BarBend `/snatch/` opisuje rwanie hantlem (nie sztangą); `barbend.com/patrick-oconnell-snatch-guide` zwraca „Gone”; Catalyst `/exercise/1/` jest pusta — właściwy numer rwania to 58.
