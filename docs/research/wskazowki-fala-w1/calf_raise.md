# Wskazówki techniki — rodzina `calf_raise` (wspięcia na palce)

Data: 02.11.2026 · Autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

Metoda: brief fali W1 (G4) i docs/research/33 („Metoda”). Każde zdanie ma ≥ 2 przeczytane (WebFetch, 02.11.2026) źródła szczebla 4
z różnych organizacji. Wariant tego samego ćwiczenia (inny sprzęt, stojąc/siedząc, jednonóż/obunóż, bez obciążenia) liczy się z opisem
„(wariant: …)”. Wzór: `Standing Calf Raise`, `Łydki na stopniu` w `data/zrodla/cues.json`. Bez liczb (tempo, obciążenia) i bez uzasadnień zdrowotnych.

## 1. Ćwiczenia

| Ćwiczenie (klucz katalogu) | Wynik | Uwagi |
|---|---|---|
| Single Leg Calf Raise | gotowe | 1 ustawienie, 1 ruch, 1 wskazówka, 1 błąd. Bez wskazówek tempa — jedno przeczytane źródło tej wersji zaleca szybkie tempo (pkt 6). |
| Calf Raise (sztanga) | gotowe | Wersja z podłogi (źródło sztangi stoi na podłodze), więc `calf.rise` zamiast `calf.move`/`calf.edge` (pkt 6). |
| Seated Calf Raise (hantle) | gotowe | Nowe zdania na ustawienie siedzące. |
| Smith Machine Calf Raise | gotowe | Dwa źródła wprost o maszynie Smitha (producent sprzętu + NASM). |
| Calf Raise (linki) | otwarte | Brak przeczytanego źródła wariantu z wyciągiem z listy organizacji; znalezione strony to aplikacje albo serwisy spoza listy. |
| Donkey Calf Raise | otwarte | Ustawienie (pochylenie w biodrach, podparcie) tylko z jednej organizacji (NFPT). |
| Barbell Seated Calf Raise | gotowe | Te same zdania co wersja z hantlami (wariant: sztanga na kolanach — źródła mówią o „ciężarze na kolanach”). |
| Dumbbell Seated One-Leg Calf Raise | gotowe | Nowe zdanie ustawienia dla jednej nogi. |
| Band Calf Raise | gotowe | Ustawienie tylko jako część wspólna dwóch producentów (guma pod stopami albo zaczepiona nisko — różnica w pkt 6). |
| Smith Machine Reverse Calf Raise | otwarte | Inny ruch: unoszenie palców przy opartych piętach (mięsień piszczelowy przedni; notatka katalogu `catalog.json`: „Toe raise with heels on a platform”). Zestaw `calf` do niego nie pasuje; nie szukano źródeł w tej fali. |

## 2. Wpisy do `cues.json` → `exercises` (ćwiczenia gotowe)

```json
{
 "Single Leg Calf Raise": {
  "setup": [
   {"c": "calf.stepOne", "s": [
    ["prehab-sl-calf-raise-off-step", "HOW (jedna noga, przednia część stopy na krawędzi, pięta poza nią; podpora do równowagi) i COMPENSATION („hold onto something”)"],
    ["physitrack-sl-heel-raise-step-board", "Instrukcja („Stand on one leg on a step with your heel over the edge.”)"],
    ["ace-73", "Step 1 (dłonie na ścianie); Step 4, Exercise Variation (1) Single-leg Calf Raise (wariant: z podłogi)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["physitrack-sl-heel-raise-step-board", "Instrukcja (pięta w dół, potem wspięcie na palce, kontrolowany powrót)"],
    ["prehab-sl-calf-raise-off-step", "COMPENSATION („Make sure you go through your full range of motion at your ankle.”)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything (pełne rozciągnięcie, pięty poniżej palców na podwyższeniu; wariant: obunóż)"]
   ]}
  ],
  "tips": [
   {"c": "calf.knees", "s": [
    ["prehab-sl-calf-raise-off-step", "HOW (kolano proste) i COMPENSATION („Do not let your knee bend as that is a different exercise.”)"],
    ["ace-73", "Step 2 (knees extended); Step 4, Variation (1) single-leg"],
    ["physitrack-heel-raise-step", "Instrukcja 3 („Keeping your knees straight…”; wariant: obunóż)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["prehab-sl-calf-raise-off-step", "COMPENSATION (pełny zakres w stawie skokowym)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything (szybkie, niepełne powtórzenia jako częsty błąd)"]
   ]}
  ]
 },
 "Calf Raise (sztanga)": {
  "setup": [
   {"c": "calf.feet", "s": [
    ["ace-51", "Step 4 (stopy na szerokość bioder)"],
    ["uthsc-calf-raises", "Akapit 1 („With feet together or, at most, hip-width apart.”; wariant: bez obciążenia)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["ace-51", "Step 5–6 (unoszenie pięt, powolne opuszczanie)"],
    ["uthsc-calf-raises", "Akapity 2–3 (wspięcie na przednią część stóp; „With control, release the heels to the starting position.”)"],
    ["physitrack-heel-raise-step", "Instrukcje 3–4 (wariant: bez obciążenia, na stopniu)"]
   ]}
  ],
  "tips": [
   {"c": "calf.knees", "s": [
    ["ace-51", "Step 5 (slight bend in knees)"],
    ["prehab-heel-raise-off-step", "HOW i COMPENSATION (kolana proste; wariant: bez obciążenia)"],
    ["physitrack-heel-raise-step", "Instrukcja 3 (wariant: bez obciążenia)"]
   ]},
   {"c": "calf.pause", "s": [
    ["ace-51", "Step 6 (pauza na górze, powolne opuszczanie)"],
    ["illinois-seated-calf-raises", "Step 3 (zatrzymanie, powolne opuszczenie; wariant: siedząc)"],
    ["theraband-ankle-calf-raise-standing", "Step Four („Hold and slowly return.”; wariant: guma)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything"],
    ["prehab-heel-raise-off-step", "COMPENSATION (pełny zakres w stawie skokowym; wariant: bez obciążenia)"]
   ]},
   {"c": "calf.mis.bounce", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything (odbijanie się, pauza w rozciągnięciu)"],
    ["nfpt-donkey-calf-raise", "Mistakes („Do not bounce as you reach the point where your calf is in a stretched position.”; wariant: donkey)"]
   ]}
  ]
 },
 "Seated Calf Raise (hantle)": {
  "setup": [
   {"c": "calf.seated", "s": [
    ["physitrack-seated-calf-raises", "Step 1 („Sit with a weighted object on your knees.”); Tips (hantle)"],
    ["prehab-seated-calf-raise-off-step", "HOW (siad, ciężar na kolanie na podkładce)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["physitrack-seated-calf-raises", "Step 2 (wspięcie na palce, kontrolowany powrót)"],
    ["illinois-seated-calf-raises", "Steps 2–3 (wariant: bez obciążenia)"],
    ["prehab-seated-heel-raise", "HOW (wariant: bez obciążenia)"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["illinois-seated-calf-raises", "Step 3 (zatrzymanie, powolne opuszczenie)"],
    ["ace-51", "Step 6 (wariant: stojąc, sztanga)"],
    ["physitrack-seated-calf-raises", "Tips („Move slowly and smoothly…”)"]
   ]},
   {"c": "calf.bigToe", "s": [
    ["prehab-seated-heel-raise", "COMPENSATION (duży palec nie traci kontaktu z podłożem)"],
    ["bodylastics-standing-calf-raise-flat-bands", "Tip („Push through your big toe as you raise your heels.”; wariant: guma, stojąc)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything"],
    ["prehab-heel-raise-off-step", "COMPENSATION (wariant: stojąc)"]
   ]}
  ]
 },
 "Smith Machine Calf Raise": {
  "setup": [
   {"c": "calf.edge", "s": [
    ["majorfitness-smith-calf-raise", "Get positioned (przednia część stóp na podeście, pięty poza tylną krawędzią)"],
    ["nasm-calf-blog", "The Exercise Menu („Standing calf raise (machine, smith, or dumbbell on a step)”); Technique Standards (pięty poniżej palców)"]
   ]}
  ],
  "move": [
   {"c": "calf.move", "s": [
    ["majorfitness-smith-calf-raise", "Unrack and lift („rising up onto your toes as high as you can go”); Lower with control (pięty poniżej krawędzi, pełne rozciągnięcie)"],
    ["nasm-calf-blog", "Technique Standards That Change Everything"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["majorfitness-smith-calf-raise", "Unrack and lift (krótkie zatrzymanie na górze); Lower with control"],
    ["ace-51", "Step 6 (wariant: sztanga)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["majorfitness-smith-calf-raise", "Common Mistakes: Cutting reps short; Skipping the platform"],
    ["nasm-calf-blog", "Technique Standards That Change Everything"]
   ]},
   {"c": "calf.mis.bounce", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything"],
    ["nfpt-donkey-calf-raise", "Mistakes (wariant: donkey)"]
   ]}
  ]
 },
 "Barbell Seated Calf Raise": {
  "setup": [
   {"c": "calf.seated", "s": [
    ["physitrack-seated-calf-raises", "Step 1 (ciężar na kolanach; wariant: dowolny ciężar)"],
    ["prehab-seated-calf-raise-off-step", "HOW (ciężar na kolanie na podkładce)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["physitrack-seated-calf-raises", "Step 2"],
    ["illinois-seated-calf-raises", "Steps 2–3 (wariant: bez obciążenia)"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["illinois-seated-calf-raises", "Step 3"],
    ["ace-51", "Step 6 (wariant: stojąc)"]
   ]},
   {"c": "calf.bigToe", "s": [
    ["prehab-seated-heel-raise", "COMPENSATION"],
    ["bodylastics-standing-calf-raise-flat-bands", "Tip (wariant: guma, stojąc)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything"],
    ["prehab-heel-raise-off-step", "COMPENSATION (wariant: stojąc)"]
   ]}
  ]
 },
 "Dumbbell Seated One-Leg Calf Raise": {
  "setup": [
   {"c": "calf.seatedOne", "s": [
    ["prehab-seated-calf-raise-off-step", "HOW („a weight resting on that padded surface” — na kolanie)"],
    ["physitrack-seated-calf-raises", "Step 1; Tips (hantle; wariant: obunóż)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["physitrack-seated-calf-raises", "Step 2 (wariant: obunóż)"],
    ["illinois-seated-calf-raises", "Steps 2–3 (wariant: obunóż, bez obciążenia)"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["illinois-seated-calf-raises", "Step 3"],
    ["ace-73", "Step 2–3; Variation (1) single-leg (wariant: stojąc)"]
   ]},
   {"c": "calf.bigToe", "s": [
    ["prehab-seated-heel-raise", "COMPENSATION"],
    ["bodylastics-standing-calf-raise-flat-bands", "Tip (wariant: guma, stojąc)"]
   ]}
  ],
  "mistakes": [
   {"c": "calf.mis.partial", "s": [
    ["nasm-calf-blog", "Technique Standards That Change Everything"],
    ["prehab-sl-calf-raise-off-step", "COMPENSATION (wariant: jednonóż, stojąc)"]
   ]}
  ]
 },
 "Band Calf Raise": {
  "setup": [
   {"c": "calf.band", "s": [
    ["bodylastics-standing-calf-raise-flat-bands", "Setup (uchwyt w każdej dłoni, tułów wyprostowany)"],
    ["theraband-ankle-calf-raise-standing", "Step One–Two (guma pod przednią częścią stóp, końce w dłoniach przy biodrach)"]
   ]}
  ],
  "move": [
   {"c": "calf.rise", "s": [
    ["bodylastics-standing-calf-raise-flat-bands", "Movement („as high on your toes as you can go”; „Lower your heels back to the floor under control.”)"],
    ["theraband-ankle-calf-raise-standing", "Step Three–Four"]
   ]}
  ],
  "tips": [
   {"c": "calf.pause", "s": [
    ["theraband-ankle-calf-raise-standing", "Step Four („Hold and slowly return.”)"],
    ["ace-51", "Step 6 (wariant: sztanga)"]
   ]},
   {"c": "calf.bigToe", "s": [
    ["bodylastics-standing-calf-raise-flat-bands", "Tip"],
    ["prehab-seated-heel-raise", "COMPENSATION (wariant: siedząc, bez gumy)"]
   ]}
  ],
  "mistakes": []
 }
}
```

## 3. Nowe zdania

| id | PL | EN (propozycja) | Uzasadnienie potrzeby |
|---|---|---|---|
| `calf.stepOne` | Stań jedną stopą na krawędzi stopnia, pięta poza krawędzią; przytrzymaj się czegoś dla równowagi. | Stand on one foot on the edge of a step, heel hanging off; hold on to something for balance. | `calf.step`/`calf.edge` mówią o obu stopach. |
| `calf.feet` | Stopy rozstaw najwyżej na szerokość bioder. | Feet no wider than hip-width apart. | Ustawienie wersji z podłogi — brak istniejącego zdania. |
| `calf.rise` | Wspinaj się na palce, potem pod kontrolą opuść pięty. | Rise up onto your toes, then lower your heels under control. | `calf.move` zakłada rozciągnięcie poniżej poziomu palców (podest); źródła wersji z podłogi i siedzących tego nie potwierdzają. |
| `calf.seated` | Usiądź i połóż ciężar na kolanach. | Sit and rest the weight on your knees. | Brak zdania ustawienia siedzącego. |
| `calf.seatedOne` | Usiądź i połóż hantel na kolanie ćwiczącej nogi. | Sit and rest the dumbbell on the knee of the working leg. | Wersja jednonóż. |
| `calf.band` | Stań prosto, trzymając w dłoniach końce gumy albo uchwyty. | Stand tall, holding the band ends or handles. | Część wspólna dwóch ustawień z gumą. |
| `calf.bigToe` | Wspinając się, dociskaj duży palec do podłoża. | Press your big toe down as you rise. | Nowa wskazówka z dwóch organizacji. |
| `calf.mis.bounce` | Odbijanie się w najniższym punkcie. | Bouncing at the bottom. | Nowy błąd z dwóch organizacji. |

## 4. Nowe źródła

| id | adres | organizacja | szczebel | miejsce / cytat |
|---|---|---|---|---|
| `uthsc-calf-raises` | https://webprod8.uthsc.edu/studentsuccess/campus-rec/documents/calf-raises.pdf | UTHSC Campus Recreation | 4 | „Raise up to the balls of your feet without leaning forward.” |
| `illinois-seated-calf-raises` | https://eat-move-save.extension.illinois.edu/move/exercise/seated-calf-raises | University of Illinois Extension | 4 | „Hold for 5-10 seconds before lowering your heels back down slowly.” (liczby nie przenoszone) |
| `physitrack-seated-calf-raises` | https://www.physitrack.com/exercise-library/how-to-perform-the-seated-calf-raises-exercise | Physitrack | 4 | „Sit with a weighted object on your knees.” |
| `physitrack-sl-heel-raise-step-board` | https://ca.physitrack.com/home-exercise-video/single-leg-heel-raise-on-a-step-board | Physitrack | 4 | „Stand on one leg on a step with your heel over the edge.” |
| `prehab-sl-calf-raise-off-step` | https://theprehabguys.com/vimeo-video/single-leg-calf-raises-off-step/ | The Prehab Guys | 4 | COMPENSATION: „Do not let your knee bend as that is a different exercise.” |
| `prehab-seated-heel-raise` | https://theprehabguys.com/vimeo-video/seated-heel-raise/ | The Prehab Guys | 4 | COMPENSATION: kontakt dużego palca z podłożem |
| `prehab-seated-calf-raise-off-step` | https://theprehabguys.com/vimeo-video/seated-calf-raise-off-step-quick/ | The Prehab Guys | 4 | HOW (tylko ustawienie; tempo tej wersji — szybkie, nie przenoszone) |
| `majorfitness-smith-calf-raise` | https://www.majorfitness.com/blogs/wiki/how-to-do-calf-raises-on-smith-machine-a-step-by-step-guide | Major Fitness | 4 | „Don't just let gravity take over on the way down” (Lower with control) |
| `nfpt-donkey-calf-raise` | https://nfpt.com/?p=4330 | NFPT | 4 | „Do not bounce as you reach the point where your calf is in a stretched position.” |
| `bodylastics-standing-calf-raise-flat-bands` | https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands | Bodylastics | 4 | „Push through your big toe as you raise your heels.” |
| `theraband-ankle-calf-raise-standing` | https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html | Performance Health | 4 | „Hold and slowly return.” |

Istniejące, przeczytane ponownie 02.11.2026: `ace-51`, `ace-73`, `nasm-calf-blog`, `physitrack-heel-raise-step`, `prehab-heel-raise-off-step`.

```json
{
 "orgs": {
  "UTHSC Campus Recreation": {"name": "University of Tennessee Health Science Center — Campus Recreation (instrukcje ćwiczeń, PDF)", "level": 4, "kind": "org"},
  "University of Illinois Extension": {"name": "University of Illinois Extension — Eat.Move.Save., biblioteka ćwiczeń", "level": 4, "kind": "org"},
  "Major Fitness": {"name": "Major Fitness — wiki producenta sprzętu (maszyny Smitha, stojaki)", "level": 4, "kind": "maker"},
  "NFPT": {"name": "National Federation of Professional Trainers — opisy ćwiczeń (nfpt.com)", "level": 4, "kind": "org"},
  "Bodylastics": {"name": "Bodylastics — biblioteka ćwiczeń producenta gum oporowych", "level": 4, "kind": "maker"},
  "Performance Health": {"name": "Performance Health Academy — instrukcje ćwiczeń producenta gum Thera-Band", "level": 4, "kind": "maker"}
 },
 "sources": {
  "uthsc-calf-raises": {"org": "UTHSC Campus Recreation", "title": "Calf Raises (PDF)", "url": "https://webprod8.uthsc.edu/studentsuccess/campus-rec/documents/calf-raises.pdf", "level": 4},
  "illinois-seated-calf-raises": {"org": "University of Illinois Extension", "title": "Seated Calf Raises", "url": "https://eat-move-save.extension.illinois.edu/move/exercise/seated-calf-raises", "level": 4},
  "physitrack-seated-calf-raises": {"org": "Physitrack", "title": "Seated calf raises", "url": "https://www.physitrack.com/exercise-library/how-to-perform-the-seated-calf-raises-exercise", "level": 4},
  "physitrack-sl-heel-raise-step-board": {"org": "Physitrack", "title": "Single-leg Heel Raise on a Step Board", "url": "https://ca.physitrack.com/home-exercise-video/single-leg-heel-raise-on-a-step-board", "level": 4},
  "prehab-sl-calf-raise-off-step": {"org": "The Prehab Guys", "title": "Single Leg Calf Raises Off Step", "url": "https://theprehabguys.com/vimeo-video/single-leg-calf-raises-off-step/", "level": 4},
  "prehab-seated-heel-raise": {"org": "The Prehab Guys", "title": "Seated Heel Raise", "url": "https://theprehabguys.com/vimeo-video/seated-heel-raise/", "level": 4},
  "prehab-seated-calf-raise-off-step": {"org": "The Prehab Guys", "title": "Seated Calf Raise Off Step (Quick)", "url": "https://theprehabguys.com/vimeo-video/seated-calf-raise-off-step-quick/", "level": 4},
  "majorfitness-smith-calf-raise": {"org": "Major Fitness", "title": "How to Do Calf Raises on Smith Machine (wiki, 16.07.2026)", "url": "https://www.majorfitness.com/blogs/wiki/how-to-do-calf-raises-on-smith-machine-a-step-by-step-guide", "level": 4},
  "nfpt-donkey-calf-raise": {"org": "NFPT", "title": "Donkey Calf Raise", "url": "https://nfpt.com/?p=4330", "level": 4},
  "bodylastics-standing-calf-raise-flat-bands": {"org": "Bodylastics", "title": "Standing Calf Raises With Flat Bands", "url": "https://bodylastics.com/exercise/standing-calf-raises-with-flat-bands", "level": 4},
  "theraband-ankle-calf-raise-standing": {"org": "Performance Health", "title": "Thera-Band Ankle Calf Raise in Standing", "url": "https://www.performancehealthacademy.com/exercises/thera-band-ankle-calf-raise-in-standing.html", "level": 4}
 }
}
```

## 5. Otwarte

- **Calf Raise (linki)** — brak przeczytanego źródła wersji z wyciągiem z organizacji z listy (wyniki: strony aplikacji i serwisy spoza listy). Formalnie wystarczyłyby źródła wariantów (inny sprzęt) — `calf.edge`, `calf.move`, `calf.knees`, `calf.mis.partial` jak dla maszyny Smitha. Nie wpisuję bez decyzji audytora, czy uchwyty z dolnych bloczków to tylko „inny sprzęt”. Rozstrzygnie: 2 źródła szczebla 4 (np. producent stacji z wyciągami, uczelniane centrum sportu) o wspięciach z wyciągiem.
- **Donkey Calf Raise** — ustawienie (pochylenie w biodrach, podparcie rękami) tylko z NFPT. Częściowo gotowe: ruch `calf.move` (NFPT Movement + `nasm-calf-blog`), błąd `calf.mis.bounce` (NFPT + NASM). Rozstrzygnie: drugie źródło szczebla 4 o wersji donkey (strony ACE/NASM go nie mają; NFPT ?p=9313 to ta sama organizacja).
- **Smith Machine Reverse Calf Raise** — inny ruch: unoszenie palców przy opartych piętach, pracuje mięsień piszczelowy przedni. Zestaw `calf` jest błędny; potrzebna osobna rodzina albo osobne zdania i źródła o tym ruchu. Nie badane.
- **Tempo przy jednej nodze** — przeczytana strona `https://us.physitrack.com/home-exercise-video/single-leg-calf-raise` (wersja z podłogi przy ścianie) każe „Continue this movement at a fast pace”. Inne źródła (ACE 73, Prehab SL, Physitrack step board) mówią o powolnym, kontrolowanym opuszczaniu. Sprzeczność na tym samym szczeblu, więc dla Single Leg Calf Raise pominąłem `calf.pause` i `calf.mis.bounce`. Także `prehab-seated-calf-raise-off-step` to wersja szybka („quickly push up”), dlatego użyłem jej tylko do ustawienia, a `calf.mis.bounce` nie trafia do wersji siedzących. Audytor rozstrzyga, czy szybkie wersje (szybkie odbicie, praca sprężysta) to osobne ćwiczenia — wtedy tempo można dodać.
- **Podest a podłoga (sztanga, guma, wersje siedzące)** — ACE 51 (sztanga) i źródła siedzące, a także te z gumą, opisują ćwiczenie z podłogi. NASM, Physitrack i Prehab (wersje stojące) oraz Major Fitness (Smith) — z podestu. Podest wymieniają też jako błąd jego braku („Skipping the platform”). Część wspólna: `calf.rise` bez rozciągnięcia poniżej poziomu palców. Opcjonalna wskazówka „możesz stanąć na podeście” — [OTWARTE] (wymaga zdania i zgody, że to nie przeczy ACE 51).
- **Band Calf Raise — ustawienie** — Bodylastics: guma zaczepiona nisko w drzwiach, uchwyty na wysokości barków. Performance Health: guma pod przednią częścią stóp, końce przy biodrach. Do aplikacji idzie tylko część wspólna `calf.band`. Który wariant opisuje klucz katalogu (`fedb`: „Calf Raises - With Bands”) — [OTWARTE].
- **Błędy w zestawach ogólnych `cue-sets.json` (informacja dla koordynatora)**:
  - zestaw `calf` (`calf.move`, `calf.pause`, `calf.mis.partial`) przy Calf Raise (sztanga), Seated Calf Raise (hantle), Barbell Seated Calf Raise, Dumbbell Seated One-Leg Calf Raise i Band Calf Raise używa `calf.move` („…aż poczujesz rozciągnięcie”). Przeczytane źródła tych wersji (z podłogi) tego nie potwierdzają;
  - przy Single Leg Calf Raise `calf.pause` ma przeczącą stronę (tempo, wyżej);
  - przy Smith Machine Reverse Calf Raise zestaw `open` jest prawidłowy.
- **Kąt stóp (palce do środka/na zewnątrz)** — ACE 51, ACE 73 i NFPT wiążą go z naciskiem na część łydki. To twierdzenie o działaniu mięśni, nie wskazówka techniki, więc go nie wpisuję.

## 6. Dostęp

- ExRx.net (403) i web.archive.org (zablokowane narzędziem) — nie używane (polecenie koordynatora 02.11).
- NSCA Basics manual PDF — 403.
- myhealth.ucsd.edu — domena poza siecią sesji (nie rozwiązuje się).
- library.theprehabguys.com/?p=16280 — przekierowanie do logowania. Użyto publicznego adresu theprehabguys.com/vimeo-video/….
- PDF UTHSC — tekst odczytany z obrazu strony (narzędzie nie rozpakowało strumienia PDF).
- Strony aplikacji treningowych z wyników wyszukiwania pominięte (nie są źródłem, nie zapisano nazw).
