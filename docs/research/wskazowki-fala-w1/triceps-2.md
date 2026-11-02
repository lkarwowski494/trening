# Wskazówki techniki — fala W1, rodzina „triceps”, część 2

Data: 02.11.2026. Autor: badacz merytoryczny (agent). Status: **PROPOZYCJA** — nic nie jest w `lib/` ani w `data/`.
Kontynuacja `docs/research/wskazowki-fala-w1/triceps.md` (część 1; ten plik jej nie zastępuje, tylko uzupełnia i w kilku miejscach poprawia).
Wdrożenie (blok JSON do `data/zrodla/cues.json`, zdania w `lib/cues/text/*.json` w 35 językach, rejestr twierdzeń, `b` → `own` w
`lib/figures/v2/cue-sets.json`) robi koordynator / programista / tłumacz. Przed statusem gotowym — niezależna recenzja (L-047).

## Metoda

Jak w części 1, plus rozstrzygnięcia koordynatora z 02.11.2026:
- (a) fragmenty książek uznanych autorów (Human Kinetics: Naternicola, Delavier i Gundill) to **szczebel 3, rodzaj `book`** (dopisanie `book` do
  `CUE_BASIS_KINDS` przy integracji robi programista). Zmiana względem części 1, gdzie były zapisane jako `site`;
- (b) karta własna wymaga co najmniej **ustawienia i ruchu** — dla wpisów „tylko wskazówki” z części 1 szukałem ustawienia i ruchu;
- (c) Skullcrusher (EZ) bez zmian (ACG-006).

Zasady: każde zdanie ≥ 2 niezależne źródła z RÓŻNYCH organizacji, przeczytane w tej sesji (WebFetch, 02.11.2026), z miejscem. Źródło o innym sprzęcie
lub o wersji oburącz / jednorącz liczy się z dopiskiem „(wariant: …)”. Strony sieci siłowni (PureGym, fitness24seven) i sprzedawcy sprzętu (Dynamo
Fitness) traktuję jak serwisy konsumenckie — przeczytane, opisane, ale **nie liczę ich** do wymaganych dwóch źródeł. Strony innych aplikacji
treningowych pominięte i nigdzie nie zapisane. ExRx nadal niedostępny (403), archiwum zablokowane.

Częsty błąd wpisuję tylko wtedy, gdy ≥ 2 źródła **wprost** nazywają go błędem albo ostrzegają przed nim („do not…”, „avoid…”, „misstep”, „mistake”).
Sama wskazówka pozytywna („łokcie przy bokach”) nie liczy się jako źródło błędu.

W ćwiczeniach jednorącz proponuję zdania w liczbie pojedynczej (sufiks `1` w id) zamiast zdań w liczbie mnogiej z części 1.

## (1) Tabela ćwiczeń — zmiany względem części 1

| Klucz | Stan | Zdania |
|---|---|---|
| Skullcrusher (sztanga) | **gotowe** (było: tylko wskazówki) | nowe skullBb.setup; skull.move; skull.upperArm, ote.elbowsIn, press.noLock, llc.control. `skull.setup` i `skull.depth` nadal otwarte |
| Skullcrusher (hantle) | **gotowe**, uzupełnione | + ote.elbowsIn, press.noLock |
| Machine Triceps Extension | **gotowe** (było: tylko wskazówki) | nowe machTri.setup, machTri.move, machTri.pivot; press.noLock, llc.control |
| Standing Low-Pulley One-Arm Triceps Extension | **gotowe** (było: tylko wskazówki) | nowe lpote.setup, lpote.move, ote1.upperArm, press1.noLock; błąd mis.archBack |
| Dumbbell One-Arm Triceps Extension | **gotowe**, przepisane na l. poj. | nowe ote1.setup, ote1.move, ote1.upperArm, press1.noLock; błąd mis.archBack |
| Single Arm Triceps Pushdown | **gotowe**, przepisane na l. poj. | nowe tpd1.setup, tpd1.move, tpd1.elbow, press1.noLock; błędy mis.elbowAway1, mis.torso, mis.jerk |
| Overhead Triceps Extension (EZ) | **gotowe**, + źródło wprost o gryfie EZ (NFPT) | + błąd mis.archBack |
| Standing Overhead Barbell Triceps Extension | gotowe (wariant) | + błąd mis.archBack |
| Kettlebell Overhead Triceps Extension | gotowe (wariant) | + błąd mis.archBack |
| Reverse Grip Triceps Pushdown | **gotowe** (było: otwarte) | nowe rgpd.setup, rgpd.move; tpd.elbows, press.noLock; błędy mis.elbowsAway, mis.jerk |
| Tate Press | **gotowe** (było: otwarte, jedno źródło) | nowe tate.setup, tate.move |
| JM Press | **gotowe** (było: otwarte) | nowe jm.setup, jm.move; błąd mis.jmElbows |
| Triceps Kickback, Triceps Kickback (linki) | bez zmian | częste błędy — nadal po jednym źródle (sekcja 5) |
| Band Overhead Triceps Extension | otwarte | jedno źródło o tej wersji (ACE, plakat z gumą — inne ustawienie) |
| Two-Arm Dumbbell Kickback, Incline Barbell / Cable Incline, Kneeling Cable, Cable Lying, One-Arm Lying Dumbbell, Decline (3 klucze), Lying Close-Grip … Behind The Head, Band Skull Crusher, Chain Handle Extension, Body-Up, Bodyweight, Sled | otwarte | brak dwóch przeczytanych źródeł (sekcja 5) |

Podsumowanie: z części 1 i 2 razem **14 gotowych z ustawieniem i ruchem** (11 z części 1 po uzupełnieniu + Reverse Grip Pushdown, Tate Press,
JM Press); wszystkie trzy wpisy „tylko wskazówki” z części 1 mają teraz ustawienie i ruch. Częste błędy: 9 wpisów ma co najmniej jeden.
Otwarte: 14 kluczy (w tym 3 z trybu `open`).

## (2) Blok JSON do `data/zrodla/cues.json` — NIEAKTUALNY — patrz przeliczenie 02.11.2026

Wpisy z tego bloku **zastępują** wpisy o tych samych kluczach z części 1. Wpisów z części 1 niewymienionych tutaj (Triceps Kickback, Triceps Kickback (linki))
nie zmieniam. Id źródeł z części 1 bez zmian; nowe źródła w sekcji (4).

```json
{
  "Skullcrusher (sztanga)": {
    "setup": [{"c": "skullBb.setup", "s": [["ace-36", "Step 1 (directly above your face; fully extending your elbows)"], ["nfpt-lying", "Starting Position; Movement (bar directly over your forehead)"]]}],
    "move": [{"c": "skull.move", "s": [["ace-36", "Step 2; Step 3 (towards your forehead)"], ["nfpt-lying", "Movement (lower the bar down to your forehead)"], ["issa-tri-top5", "#2, wersja leżąc (barbell instead of dumbbells; to ear level)"]]}],
    "tips": [
      {"c": "skull.upperArm", "s": [["ace-36", "Step 2; wskazówka końcowa"], ["issa-tri-top5", "#2, wersja leżąc (upper arm still; barbell allowed)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-36", "wskazówka końcowa (elbows shoulder-width apart)"], ["nfpt-lying", "Training Tips (keep your elbows in)"]]},
      {"c": "press.noLock", "s": [["nfpt-lying", "Warning Tips (Do not lock out your elbows)"], ["issa-tri-top5", "#2 (not lock the elbows; barbell allowed)"]]},
      {"c": "llc.control", "s": [["ace-36", "Step 2; Step 3 (slowly lower; press back up slowly)"], ["nfpt-lying", "Warning Tips (stay in control at all times; 2–3 s)"]]}
    ],
    "mistakes": []
  },
  "Skullcrusher (hantle)": {
    "setup": [{"c": "skullDb.setup", "s": [["issa-tri-top5", "#2, wersja leżąc"], ["ace-36", "Step 1 (wariant: sztanga)"]]}],
    "move": [{"c": "skullDb.move", "s": [["issa-tri-top5", "#2, wersja leżąc"], ["ace-36", "Step 2; Step 3 (wariant: sztanga)"]]}],
    "tips": [
      {"c": "skull.upperArm", "s": [["ace-36", "Step 2 (wariant: sztanga)"], ["issa-tri-top5", "#2, wersja leżąc"]]},
      {"c": "ote.elbowsIn", "s": [["nfpt-lying", "Training Tips; Options (dumbbells, one in each hand)"], ["ace-36", "wskazówka końcowa (wariant: sztanga)"]]},
      {"c": "press.noLock", "s": [["issa-tri-top5", "#2 (not lock the elbows)"], ["nfpt-lying", "Warning Tips; Options (dumbbells)"]]}
    ],
    "mistakes": []
  },
  "Machine Triceps Extension": {
    "setup": [{"c": "machTri.setup", "s": [["ace-292", "Step 2 (Sitting with a tall back, rest the upper arms on the pad and grasp the handles)"], ["hk-naternicola", "Figure 5.28, przygotowanie, kroki 1–3"]]}],
    "move": [{"c": "machTri.move", "s": [["ace-292", "Step 3; Step 4 (press the hands downward; slowly return)"], ["hk-naternicola", "Figure 5.28, Movement 1 i 3; Misstep (downward phase)"]]}],
    "tips": [
      {"c": "machTri.pivot", "s": [["hk-naternicola", "Figure 5.28, przygotowanie, kroki 2–3 (adjust seat; elbows aligned with the pivot point)"], ["precor-rsl0208", "opis produktu (proper alignment of the exerciser's elbows to the pivot point)"]]},
      {"c": "press.noLock", "s": [["hk-naternicola", "Figure 5.28, Movement 1"], ["hoist-rs2103", "instrukcja"]]},
      {"c": "llc.control", "s": [["hk-naternicola", "Figure 5.28, Movement 1 i 3"], ["hoist-rs2103", "instrukcja"], ["ace-292", "Step 4 (Slowly return)"]]}
    ],
    "mistakes": []
  },
  "Standing Low-Pulley One-Arm Triceps Extension": {
    "setup": [{"c": "lpote.setup", "s": [["catalyst-894", "Description (one hand overhead facing away from the machine; elbow as high as possible)"], ["rep-cable-overhead", "How to do an Overhead Tricep Extension (Cable) — low pulley, face away, elbows close to head (wariant: oburącz)"]]}],
    "move": [{"c": "lpote.move", "s": [["catalyst-894", "Description (bend the arm as far as you can, then extend it completely)"], ["rep-cable-overhead", "jw. (extend upward; lower in a controlled motion; wariant: oburącz)"], ["ace-74", "Step 2; Step 3 (behind the head; wariant: hantel)"]]}],
    "tips": [
      {"c": "ote1.upperArm", "s": [["catalyst-894", "Description (keep the elbow high instead of driving it forward)"], ["rep-cable-overhead", "Form Tips (elbows stationary; wariant: oburącz)"], ["issa-tri-top5", "#2 (one arm at a time; upper arm still; wariant: hantel)"]]},
      {"c": "press1.noLock", "s": [["rep-cable-overhead", "jw. (fully extended but not locked out; wariant: oburącz)"], ["issa-tri-top5", "#2 (one arm; not lock the elbows; wariant: hantel)"]]}
    ],
    "mistakes": [
      {"c": "mis.archBack", "s": [["rep-cable-overhead", "Form Tips (Avoid arching your back; wariant: oburącz)"], ["hk-naternicola", "Figure 5.27, Misstep (Back arches; wariant: hantel)"]]}
    ]
  },
  "Dumbbell One-Arm Triceps Extension": {
    "setup": [{"c": "ote1.setup", "s": [["issa-tri-top5", "#2 (or use one arm at a time)"], ["ace-74", "Step 2 (wariant: oburącz)"], ["hk-naternicola", "Figure 5.27 (elbows pointing upward; wariant: oburącz)"], ["catalyst-894", "Description (one hand overhead; wariant: wyciąg)"]]}],
    "move": [{"c": "ote1.move", "s": [["issa-tri-top5", "#2 (one arm at a time)"], ["ace-74", "Step 2; Step 3 (wariant: oburącz)"], ["nfpt-seated", "Movement (lower the weight behind your head; wariant: oburącz)"]]}],
    "tips": [
      {"c": "ote1.upperArm", "s": [["issa-tri-top5", "#2 (keep your upper arm still)"], ["catalyst-894", "Description (wariant: wyciąg)"], ["ace-74", "Step 3 (wariant: oburącz)"]]},
      {"c": "press1.noLock", "s": [["issa-tri-top5", "#2 (not lock the elbows)"], ["nfpt-seated", "Warning Tips (wariant: oburącz)"], ["ace-74", "Step 2 (wariant: oburącz)"]]}
    ],
    "mistakes": [
      {"c": "mis.archBack", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: oburącz)"], ["rep-cable-overhead", "Form Tips (wariant: wyciąg)"]]}
    ]
  },
  "Single Arm Triceps Pushdown": {
    "setup": [{"c": "tpd1.setup", "s": [["ace-185", "Step 1; Step 3 (wersja jednorącz)"], ["catalyst-898", "Description (one hand; high cable attachment; elbow close to the side)"]]}],
    "move": [{"c": "tpd1.move", "s": [["ace-185", "Step 2; Step 3"], ["catalyst-898", "Description (extend the elbow maximally, then return to the top under control)"]]}],
    "tips": [
      {"c": "tpd1.elbow", "s": [["ace-185", "Step 1; wskazówka końcowa"], ["catalyst-898", "Description (elbow close to the side)"], ["nfpt-rope", "Training Tips (shoulders will come into play; wariant: oburącz)"]]},
      {"c": "press1.noLock", "s": [["ace-185", "Step 3 (do not lock out)"], ["nfpt-rope", "Warning Tips (wariant: oburącz)"]]}
    ],
    "mistakes": [
      {"c": "mis.elbowAway1", "s": [["ace-185", "wskazówka końcowa (forward movement of your elbows)"], ["nfpt-rope", "Training Tips (elbows move away from your body; wariant: oburącz)"], ["rep-cable-best", "Common mistakes: Elbows Flaring Out (wariant: oburącz)"]]},
      {"c": "mis.torso", "s": [["hk-delavier", "Cable Push-Down (avoid any swaying of the torso; wariant: oburącz)"], ["rep-cable-best", "Common mistakes: Leaning Too Far Forward (wariant: oburącz)"]]},
      {"c": "mis.jerk", "s": [["rep-cable-best", "Common mistakes: Using Too Much Weight (momentum; wariant: oburącz)"], ["nfpt-rope", "Warning Tips (stay in control; 2–3 s; wariant: oburącz)"]]}
    ]
  },
  "Overhead Triceps Extension (EZ)": {
    "setup": [{"c": "ote.setupLoad", "s": [["nfpt-seated", "Setup; Options (EZ Curl Bar)"], ["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27 (wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["nfpt-seated", "Movement; Options (EZ Curl Bar)"], ["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["nfpt-seated", "Training Tips (elbows in by your ears; EZ)"], ["ace-74", "Step 3 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["nfpt-seated", "Training Tips (elbows away from your body — lats and shoulders; EZ)"], ["ace-74", "wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27 (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["nfpt-seated", "Warning Tips (Do not lock out your elbows; EZ)"], ["ace-74", "Step 2 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": [
      {"c": "mis.archBack", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["rep-cable-overhead", "Form Tips (wariant: wyciąg)"]]}
    ]
  },
  "Reverse Grip Triceps Pushdown": {
    "setup": [{"c": "rgpd.setup", "s": [["catalyst-878", "Description (straight handle; high cable attachment; palms up; elbows close to the sides)"], ["nfpt-reverse", "Setup (under grip, palms facing up; elbows at your sides)"]]}],
    "move": [{"c": "rgpd.move", "s": [["catalyst-878", "Description (extend the elbows maximally, then return to the top under control)"], ["nfpt-reverse", "Movement (2–3 s up; lower until arms extended)"]]}],
    "tips": [
      {"c": "tpd.elbows", "s": [["catalyst-878", "Description (elbows close to the sides)"], ["nfpt-reverse", "Training Tips (elbows pinned; lats and shoulders take over)"]]},
      {"c": "press.noLock", "s": [["nfpt-reverse", "Warning Tips (Do not lock out your elbows)"], ["ace-185", "Step 3 (do not lock out; wariant: nachwyt)"]]}
    ],
    "mistakes": [
      {"c": "mis.elbowsAway", "s": [["nfpt-reverse", "Training Tips (elbows drift away from your body)"], ["ace-185", "wskazówka końcowa (wariant: nachwyt)"], ["rep-cable-best", "Common mistakes: Elbows Flaring Out (wariant: lina)"]]},
      {"c": "mis.jerk", "s": [["nfpt-reverse", "Warning Tips (moving faster reduces control)"], ["rep-cable-best", "Common mistakes: Using Too Much Weight (wariant: lina)"]]}
    ]
  },
  "Tate Press": {
    "setup": [{"c": "tate.setup", "s": [["issa-tri-top5", "#5 Tate Press (lying on a bench; dumbbells upright as in a bench press)"], ["catalyst-909", "Description (Lie supine on a bench … pressed straight up)"]]}],
    "move": [{"c": "tate.move", "s": [["issa-tri-top5", "#5 Tate Press (lower toward the chest, elbows pointing outward; press back up)"], ["catalyst-909", "Description (elbows out to the sides … lower the dumbbells to the chest; extend again)"]]}],
    "tips": [],
    "mistakes": []
  },
  "JM Press": {
    "setup": [{"c": "jm.setup", "s": [["catalyst-801", "Description (shoulder-width grip; close-grip bench press hybrid)"], ["elitefts-jm", "Setup (lie flat on the bench; grip similar to a close-grip bench, 15–18 in)"]]}],
    "move": [{"c": "jm.move", "s": [["catalyst-801", "Description (lower the bar to the neck or chin … elbows above the shoulders; press back to the top)"], ["elitefts-jm", "Descent; Return (toward the lower chin and throat; elbows high)"]]}],
    "tips": [],
    "mistakes": [
      {"c": "mis.jmElbows", "s": [["catalyst-801", "Description (press back to the top without dropping the elbows)"], ["elitefts-jm", "Common Mistakes: Dropping the elbows"]]}
    ]
  },
  "Standing Overhead Barbell Triceps Extension": {
    "mistakes": [
      {"c": "mis.archBack", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["rep-cable-overhead", "Form Tips (wariant: wyciąg)"]]}
    ]
  },
  "Kettlebell Overhead Triceps Extension": {
    "mistakes": [
      {"c": "mis.archBack", "s": [["hk-naternicola", "Figure 5.27, Misstep (wariant: hantel)"], ["rep-cable-overhead", "Form Tips (wariant: wyciąg)"]]}
    ]
  }
}
```

Uwagi do wdrożenia:
- Dwa ostatnie wpisy (Standing Overhead Barbell, Kettlebell) dopisują tylko `mistakes` — `setup`/`move`/`tips` jak w części 1.
- W ćwiczeniach jednorącz zdania z części 1 w l. mn. (`ote.move`, `ote.upperArm`, `press.noLock`, `tpd.*`) zastąpione wersjami `…1`.
- `mis.elbowsAway`, `mis.torso`, `mis.jerk` mają źródła także dla **Triceps Pushdown** (karta własna, poza zakresem tej partii): ACE #185, NFPT, REP, Delavier.
  Koordynator może zlecić dopisanie — wymaga sprawdzenia, czy to nie zmiana karty z ACG.

## (3) Nowe zdania PL (+ propozycja EN)

| Id | PL | EN (propozycja) | Źródła (min. 2 org.) |
|---|---|---|---|
| skullBb.setup | Połóż się na ławce i trzymaj gryf nad twarzą na prostych rękach. | Lie on a bench and hold the bar above your face with straight arms. | ACE #36; NFPT |
| machTri.setup | Usiądź prosto, oprzyj ramiona na poduszce i chwyć uchwyty. | Sit tall, rest your upper arms on the pad and grab the handles. | ACE #292; Naternicola |
| machTri.move | Prostuj ręce, wypychając uchwyty w dół; powoli wróć do pozycji wyjściowej. | Straighten your arms, pushing the handles down; return slowly to the start. | ACE #292; Naternicola |
| machTri.pivot | Ustaw siedzisko tak, żeby łokcie były na wysokości osi obrotu maszyny. | Set the seat so your elbows line up with the machine's pivot. | Naternicola; Precor |
| lpote.setup | Stań tyłem do wyciągu i trzymaj uchwyt jedną ręką nad głową, łokieć skierowany w górę. | Stand facing away from the cable and hold the handle overhead in one hand, elbow pointing up. | Catalyst #894; REP |
| lpote.move | Zginaj łokieć, opuszczając uchwyt za głowę; wyprostuj rękę nad głową. | Bend your elbow to lower the handle behind your head; straighten your arm overhead. | Catalyst #894; REP; ACE #74 |
| ote1.setup | Unieś hantel jedną ręką nad głowę, łokieć skierowany w górę. | Lift the dumbbell overhead in one hand, elbow pointing up. | ISSA; ACE #74; Naternicola; Catalyst #894 |
| ote1.move | Zginaj łokieć, opuszczając hantel za głowę; wyprostuj rękę nad głową. | Bend your elbow to lower the dumbbell behind your head; straighten your arm overhead. | ISSA; ACE #74; NFPT |
| ote1.upperArm | Ramię nieruchomo, łokieć wysoko nad głową — pracuje przedramię. | Keep your upper arm still, elbow high overhead — only the forearm moves. | Catalyst #894; REP; ISSA; ACE #74 |
| press1.noLock | Prostuj rękę do końca, ale bez gwałtownego blokowania łokcia. | Straighten your arm fully, but don't snap the elbow into lockout. | REP; ISSA; ACE #74 / #185; NFPT |
| tpd1.setup | Stań przodem do wyciągu z górnym bloczkiem, chwyć uchwyt jedną ręką, łokieć przy boku. | Face a high cable, grab the handle with one hand, elbow by your side. | ACE #185; Catalyst #898 |
| tpd1.move | Prostuj łokieć, wypychając uchwyt w dół; powoli wróć do góry. | Straighten your elbow, pushing the handle down; return slowly to the top. | ACE #185; Catalyst #898 |
| tpd1.elbow | Łokieć przy boku — pracuje przedramię, nie bark. | Elbow by your side — the forearm moves, not the shoulder. | ACE #185; Catalyst #898; NFPT |
| rgpd.setup | Chwyć drążek wyciągu podchwytem, dłońmi w górę, łokcie przy bokach. | Grab the cable bar with an underhand grip, palms up, elbows by your sides. | Catalyst #878; NFPT |
| rgpd.move | Prostuj łokcie, wypychając drążek w dół; powoli wróć do góry. | Straighten your elbows, pushing the bar down; return slowly to the top. | Catalyst #878; NFPT |
| tate.setup | Połóż się na ławce i trzymaj hantle nad klatką na prostych rękach. | Lie on a bench and hold the dumbbells over your chest with straight arms. | ISSA #5; Catalyst #909 |
| tate.move | Zginaj łokcie skierowane na boki, opuszczając hantle do klatki; wyprostuj ręce. | Bend your elbows out to the sides to lower the dumbbells to your chest; straighten your arms. | ISSA #5; Catalyst #909 |
| jm.setup | Połóż się na ławce i chwyć sztangę wąsko, mniej więcej na szerokość barków. | Lie on a bench and take a close grip on the bar, about shoulder-width. | Catalyst #801; EliteFTS |
| jm.move | Zginaj łokcie, opuszczając sztangę w stronę brody — łokcie zostają wysoko; wypchnij ją w górę. | Bend your elbows to lower the bar toward your chin — elbows stay high; press it back up. | Catalyst #801; EliteFTS |
| mis.archBack | Wyginanie pleców w łuk. | Arching your back. | Naternicola Fig. 5.27 Misstep; REP Form Tips |
| mis.elbowsAway | Łokcie odjeżdżają od tułowia podczas wypychania. | Elbows drifting away from your body as you push. | ACE #185; NFPT; REP |
| mis.elbowAway1 | Łokieć odjeżdża od tułowia podczas wypychania. | Elbow drifting away from your body as you push. | jw. |
| mis.torso | Pomaganie sobie tułowiem — pochylanie się albo bujanie. | Using your body — leaning or swaying. | Delavier; REP |
| mis.jmElbows | Opuszczanie łokci w stronę tułowia. | Letting your elbows drop toward your body. | Catalyst #801; EliteFTS |

Kontrola sformułowań:
- `skullBb.setup` „nad twarzą” — część wspólna ACE („directly above your face”) i NFPT („directly over your forehead”). Nie użyto `skull.setup`: „wąsko” podaje
  tylko NFPT (ok. 15 cm), „nachwytem” tylko ACE.
- `machTri.move` „w dół” — ACE i Naternicola (faza „downward”). Hoist RS-2103 opisuje wypychanie do przodu — inny typ maszyny (część 1, pkt 4). Jeśli figura
  „Machine Triceps Extension” pokazuje wypychanie do przodu, zdanie trzeba zmienić — **do sprawdzenia przez recenzenta figury**.
- `machTri.pivot` — Precor to opis produktu („support proper alignment of the exerciser's elbows to the pivot point”), nie instrukcja krok po kroku;
  recenzent oceni, czy to wystarczy jako drugie źródło.
- `tpd1.move`/`rgpd.move` „powoli wróć do góry” zamiast „aż przedramiona zbliżą się do ramion” (`tpd.move`): NFPT każe kończyć powrót, gdy przedramiona są
  „just past parallel” — to **sprzeczność** z `tpd.move` co do zakresu powrotu (sekcja 5).
- `mis.elbowsAway` „podczas wypychania” — ogranicza błąd do fazy wypychania, bo Delavier (szczebel 3) dopuszcza uniesienie łokci przy powrocie;
  ACE, NFPT, REP nie przeczą temu ograniczeniu.
- `mis.torso` — część wspólna: Delavier mówi o bujaniu, REP o pochylaniu się do przodu; zdanie podaje oba jako przykłady pomagania sobie tułowiem.
- `jm.move` „w stronę brody” — Catalyst: „neck or chin”, EliteFTS: „between the lower chin and throat”.
- `mis.archBack` — oba źródła mówią o prostowaniu nad głową; zdanie użyte tylko w kartach prostowania nad głową.
- Bez twierdzeń o zdrowiu (ostrzeżenia NFPT o kontuzji łokcia i REP o lędźwiach nie przeniesione).

Krótkie cytaty kontrolne:
- NFPT, „How to do Lying Tricep Extensions”, Warning Tips: „Do not lock out your elbows in the extended position.”
- Catalyst #894: „Hold a cable handle with a one hand overhead facing away from the machine and lean away slightly as needed.”
- REP, Form Tips: „Avoid arching your back — engage your core to maintain stability.”
- EliteFTS (D. Tate), Common Mistakes: dropping the elbows „turns the lift into a narrow-grip bench to the neck” (parafraza za stroną).

## (4) Źródła

### Nowe organizacje

| Skrót | Organizacja | Szczebel | `kind` | Uwagi |
|---|---|---|---|---|
| NFPT | National Federation of Professional Trainers — blog (nfpt.com) | 4 | org | organizacja certyfikująca trenerów, jak ACE i ISSA; strony podpisane „Guest”, 11.08.2025 |
| Catalyst Athletics | Catalyst Athletics — Exercise Library (G. Everett) | 4 | site | uznany serwis szkoleniowy podnoszenia ciężarów |
| REP Fitness | REP Fitness — blog producenta sprzętu (wyciągi, ławki) | 4 | maker | dwa artykuły różnych autorów; w każdym zdaniu liczone jako jedno źródło |
| Precor | Precor — strona produktu RSL0208 Triceps Extension | 4 | maker | opis produktu, nie instrukcja |
| EliteFTS | EliteFTS — blog (D. Tate), producent sprzętu do trójboju | 4 | maker | |
| Human Kinetics — Naternicola; — Delavier, Gundill | (z części 1) | **3** | **book** | zmiana zgodnie z rozstrzygnięciem (a) |

### Źródła (`sources`) — przeczytane 02.11.2026

| Id | Org | Tytuł / miejsce | URL |
|---|---|---|---|
| ace-292 (nowe) | ACE | Tricep Extension (#292), maszyna | https://www.acefitness.org/resources/everyone/exercise-library/292/tricep-extension/ |
| nfpt-lying | NFPT | How to do Lying Tricep Extensions | https://nfpt.com/how-to-do-lying-tricep-extensions/ |
| nfpt-seated | NFPT | How to do Seated Tricep Extension with Dumbbells (Options: EZ Curl Bar) | https://www.nfpt.com/blog/how-to-do-seated-tricep-extension-with-dumbbells |
| nfpt-rope | NFPT | How to do Tricep Pushdowns with the Rope | https://nfpt.com/how-to-do-tricep-pushdowns-with-the-rope/ |
| nfpt-reverse | NFPT | How to do Reverse Tricep Pushdown | https://nfpt.com/how-to-do-reverse-tricep-pushdown/ |
| nfpt-kickback | NFPT | Dumbbell Tricep Kickback (użyte tylko w sekcji 5) | https://www.nfpt.com/blog/dumbbell-tricep-kickback |
| catalyst-801 | Catalyst Athletics | JM Press | https://www.catalystathletics.com/exercise/801/JM-Press/ |
| catalyst-878 | Catalyst Athletics | Reverse-Grip Tricep Pushdown | https://www.catalystathletics.com/exercise/878/Reverse-Grip-Tricep-Pushdown/ |
| catalyst-894 | Catalyst Athletics | Single-Arm Overhead Cable Tricep Extension | https://www.catalystathletics.com/exercise/894/Single-Arm-Overhead-Cable-Tricep-Extension/ |
| catalyst-898 | Catalyst Athletics | Single-Arm Rope Tricep Pushdown | https://www.catalystathletics.com/exercise/898/Single-Arm-Rope-Tricep-Pushdown/ |
| catalyst-909 | Catalyst Athletics | Tate Press | https://www.catalystathletics.com/exercise/909/Tate-Press/ |
| rep-cable-overhead | REP Fitness | A. Heckel, „Cable Tricep Extensions: Mastering Form…” (2024, akt. 2026), sekcja „How to do an Overhead Tricep Extension (Cable)” | https://repfitness.com/blogs/training/cable-tricep-overhead-extensions-mastering-form-benefits-and-variations |
| rep-cable-best | REP Fitness | J. Sanchez, „The Best Triceps Cable Workouts” (2024, akt. 2026), Pushdowns + Common mistakes | https://repfitness.com/blogs/training/best-workout-for-triceps-on-a-cable-machine |
| precor-rsl0208 | Precor | Resolute Triceps Extension RSL0208 | https://www.precor.com/en-US/products/RSL0208 |
| elitefts-jm | EliteFTS | D. Tate, „How to Perform the JM Press…” (28.07.2026) | https://elitefts.com/blogs/training/how-to-perform-the-jm-press-a-step-by-step-guide-from-the-inventor |

Z części 1 bez zmian: ace-36, ace-55, ace-74, ace-185, issa-tri-top5, issa-band-20, hk-naternicola, hk-delavier, hoist-rs2103.
ISSA #2 przeczytane ponownie: wersja leżąc dopuszcza sztangę zamiast hantli — dlatego ISSA liczy się teraz także dla Skullcrusher (sztanga).

Przeczytane, nieliczone albo nieużyte:
- ACE, „6 Exercises for Stronger Triceps” (E. Kovar, 2023) — skull crusher sztangą/hantlem, wyciąg nad głową oburącz; ta sama organizacja co ACE #36/#74 — nie niezależne;
- ACE, plakat „Whole-body Exercise Band Workout” (s. 2, „9. Triceps Extension”) — guma trzymana drugą ręką za plecami; jedno źródło o wersji z gumą;
- PureGym, „Skull crushers” — sieć siłowni (nieliczona); opuszczanie **za głowę**, a opuszczanie w stronę czoła nazywa błędem (sekcja 5);
- fitness24seven, „Triceps Extension” (maszyna) — sieć siłowni (nieliczona); zgodne z machTri.setup („upper arms … flat … across the arm pad”);
- Dynamo Fitness, „Cable Overhead Rope Tricep Extension” — sprzedawca (nieliczony); dolny bloczek, tyłem do maszyny, za głowę;
- Human Kinetics / Stoppani, „Rope Triceps Pressdown exercise” — zgodne z tpd.*, bez błędów, nie wnosi nic nowego;
- Human Kinetics / Contreras, „Arm training ideas” — bez instrukcji;
- Catalyst #817 Cable Overhead Tricep Extension (oburącz) — zastąpione #894 (jednorącz).

## (5) Otwarte

1. **[OTWARTE] Skullcrusher — kierunek opuszczania (sprzeczność).** ACE #36: „towards your forehead or slightly behind your head”; NFPT: do czoła; ISSA: do wysokości
   uszu; PureGym (nieliczony): za głowę, a do czoła to błąd. Liczone źródła zgadzają się z `skull.move` („w stronę czoła”), ale jeśli recenzent uzna PureGym
   za źródło, część wspólna to „w stronę głowy” (jak `skullDb.move`). Dotyczy też ACG-006 (EZ) — tylko do wiadomości, bez zmian.
2. **[OTWARTE] `skull.setup` (wąsko, nachwytem) i `skull.depth` (albo ramiona uciekają w tył)** dla sztangi — po jednym źródle na element (NFPT / ACE).
3. **[OTWARTE] Sprzeczność co do zakresu powrotu w wypychaniu w dół:** `tpd.move` („aż przedramiona zbliżą się do ramion”, ACE #185) a NFPT (rope, reverse:
   powrót tylko „just past parallel”). Dotyczy kart Triceps Pushdown i Single Arm (część 1). W tej części użyto neutralnego „powoli wróć do góry”.
4. **[OTWARTE] Częste błędy z jednym źródłem wprost:**
   - kickback: łokieć odjeżdża od tułowia (NFPT; ACE/ISSA tylko wskazówka pozytywna), jeden bark wyżej (NFPT), skręcanie tułowia (ACE #55);
   - maszyna: łokcie odrywane od poduszki, unoszenie barków (Naternicola; ACE #292 i fitness24seven tylko wskazówka pozytywna);
   - skull crusher: łokcie na boki (NFPT ostrzega, PureGym nieliczony) — zamiast błędu użyto wskazówki `ote.elbowsIn` (2 źródła);
   - JM Press: łokcie za szeroko, ponad 45° (tylko EliteFTS).
5. **[OTWARTE] Band Overhead Triceps Extension** — jedno źródło (plakat ACE, guma trzymana drugą ręką za plecami); ustawienie „stań na gumie” niepotwierdzone.
6. **[OTWARTE] Pozostałe** — brak dwóch przeczytanych źródeł: Two-Arm Dumbbell Kickback (bez podparcia), Incline Barbell i Cable Incline (ławka skośna; `skull.upperArm`
   „pionowo” fałszywe — część 1), Kneeling Cable, Cable Lying, One-Arm Lying Dumbbell, Decline (3 klucze), Lying Close-Grip … Behind The Head, Band Skull Crusher,
   Chain Handle Extension, Body-Up, Bodyweight, Sled. Catalyst ma pokrewne strony („Sidelying Tricep Extension”, „Cable Concentration Tricep Extension”), ale to
   inne ćwiczenia. Kandydat na drugie źródło dla wersji z gumą i na ławce: biblioteki uczelni i NSCA — nie znalezione w tej sesji.
7. **[DO DECYZJI koordynatora] Machine Triceps Extension — kierunek ruchu figury** (w dół czy do przodu) — patrz kontrola sformułowań.
8. **Liczba mnoga** — Single Arm Pushdown, Dumbbell One-Arm, Low-Pulley mają teraz zdania w l. poj.; recenzent lokalizacji sprawdzi, czy `press1.noLock`
   i `mis.elbowAway1` nie dublują niepotrzebnie zdań w l. mn. (alternatywa: jedno neutralne zdanie dla obu).

## Stan

- Zrobione: 3 wpisy „tylko wskazówki” mają ustawienie i ruch (Skullcrusher (sztanga), Machine, Low-Pulley); 3 nowe gotowe (Reverse Grip Pushdown, Tate Press,
  JM Press); zdania jednorącz w l. poj.; częste błędy w 9 wpisach (5 nowych zdań błędów); 24 nowe zdania PL z EN; 15 nowych źródeł, 5 nowych organizacji;
  rodzaj `book` (szczebel 3) dla fragmentów Human Kinetics.
- Zostało: punkty 1–7 z sekcji 5; częste błędy kickbacku i maszyny (drugie źródło wprost); wersje na ławce skośnej/ujemnej, leżąc z wyciągiem, z gumą.
- Pułapki: `skull.upperArm` tylko na płaskiej ławce; `machTri.move` zakłada wypychanie w dół; NFPT i PureGym różnią się co do kierunku opuszczania w skull crusher;
  REP to dwa artykuły jednej organizacji — w jednym zdaniu liczyć raz.

## Korekta szczebli — przeliczenie koordynatora 02.11.2026

Reguły: `docs/research/szczeble-organizacji-2026-11-02.md` (rozstrzygnięcie, uzupełnienia 2 i 3). Kryterium karty (decyzje 02.11.2026): zdanie gotowe = ≥ 2
niezależne organizacje szczebla ≤ 4, przeczytane; karta własna = min. 1 zdanie ustawienia + 1 zdanie ruchu; „z błędami” = + min. 1 błąd; bez ruchu albo bez
ustawienia = otwarta. Kilka stron tej samej organizacji = jedno źródło. Źródło o innym sprzęcie / wersji oburącz liczy się z dopiskiem „wariant” (metoda części 1).
Reguła „błąd = zaprzeczenie standardu” (uzupełnienie 2): źródło ≤ 4 podające wprost przeciwny standard (ta sama część ciała, to samo kryterium) jest drugim
źródłem błędu. Szczeble ACE, ISSA, Human Kinetics (Naternicola, Delavier), Hoist — jak w przeliczeniu w `triceps.md`.

### Źródła → szczebel

| Źródło | Szczebel | Dowód / powód |
|---|---|---|
| ACE (ace-36, ace-74, ace-185, ace-292) | 4 — jedno źródło | precedens ACE |
| ISSA (issa-tri-top5) | 4 | wiersz ISSA; data 05.02.2024 |
| Catalyst Athletics (catalyst-801, -878, -894, -898, -909) | 4 — jedno źródło | szczeble-organizacji, „Rozstrzygnięcia”, wiersz Catalyst Athletics |
| Human Kinetics — Naternicola | 4 | przeliczenie w `triceps.md` (biogram na stronie książki: master trainer ACE, mgr WF; ©2015) |
| Human Kinetics — Delavier, Gundill | 3 | rozstrzygnięcie (a) w sekcji „Metoda”; strona bez kwalifikacji i daty (WebFetch 02.11.2026) |
| NFPT (nfpt-lying, nfpt-seated, nfpt-rope, nfpt-reverse, nfpt-kickback) | **nie liczy się (5)** (było 4) | wiersz NFPT: liczy się artykuł z autorem, datą i kwalifikacjami w biogramie. WebFetch 02.11.2026 (lying, reverse, seated, rope): podpis „by Guest”, „Posted August 11th, 2025”; na stronie biogram R. Bovee („Certified Master PPT, RTS, ETS, FTS”), ale strona nie mówi, że to autor tekstu. Autor nieustalony → nie liczy się (wątpliwość dla koordynatora: jeśli Bovee jest autorem, NFPT = 4). nfpt-kickback nieotwierany ponownie (używany tylko w sekcji 5) |
| REP Fitness (rep-cable-overhead, rep-cable-best) | **5** (było 4) | brief: sprzedawcy = 5; precedens Mikolo (uzupełnienie 3: blog producenta/sprzedawcy — 5, dokumentacja tylko własnej maszyny). Artykuły blogowe o technice na wyciągu ogólnym, nie dokumentacja maszyny REP |
| Precor (precor-rsl0208) | **5** (było 4) | strona produktu (opis handlowy, kryterium pkt 3), nie instrukcja; i tak dotyczy tylko maszyny Precor (kryterium pkt 1) |
| EliteFTS (elitefts-jm) | **5** (było 4) | sklep ze sprzętem do trójboju — brief: sprzedawcy = 5; precedens Mikolo (blog sprzedawcy). Brak osobnego rozstrzygnięcia dla EliteFTS — wątpliwość dla koordynatora (autor D. Tate, data 28.07.2026; analogia IronMind „4 z autorem o sprawdzalnych kwalifikacjach” niesprawdzona) |
| Hoist (hoist-rs2103) | nie liczy się dla tej karty | inny typ maszyny (część 1, sekcja 5 pkt 4); producent = 4 tylko dla własnej maszyny |
| PureGym, fitness24seven, Dynamo Fitness | 5 (bez zmian — już nieliczone) | uzupełnienie 2/3, sieci siłowni i sprzedawcy |

### Zdania → stan

| Karta | Zdanie | Źródła ≤ 4 po przeliczeniu | Stan |
|---|---|---|---|
| Skullcrusher (sztanga) | `skullBb.setup` | ACE #36 (NFPT nie liczy się) | spada |
| Skullcrusher (sztanga) | `skull.move`, `skull.upperArm` | ACE #36 + ISSA #2 (leżąc, sztanga dozwolona) | zostaje |
| Skullcrusher (sztanga) | `ote.elbowsIn`, `llc.control` | ACE #36 (NFPT) | spada |
| Skullcrusher (sztanga) | `press.noLock` | ISSA (NFPT) | spada |
| Skullcrusher (hantle) | `skullDb.setup`, `skullDb.move`, `skull.upperArm` | ISSA + ACE #36 (wariant: sztanga) | zostaje |
| Skullcrusher (hantle) | `ote.elbowsIn` | ACE (NFPT) | spada |
| Skullcrusher (hantle) | `press.noLock` | ISSA (NFPT) | spada |
| Machine Triceps Extension | `machTri.setup`, `machTri.move`, `llc.control` | ACE #292 + Naternicola | zostaje (uwaga: Naternicola — trenerka ACE, patrz triceps.md) |
| Machine Triceps Extension | `machTri.pivot` | Naternicola (Precor = 5) | spada |
| Machine Triceps Extension | `press.noLock` | Naternicola (Hoist — inny typ maszyny) | spada |
| Standing Low-Pulley One-Arm | `lpote.setup` | Catalyst #894 (REP = 5) | spada |
| Standing Low-Pulley One-Arm | `lpote.move` | Catalyst #894 + ACE #74 (wariant: hantel) | zostaje (zdanie gotowe, karta otwarta) |
| Standing Low-Pulley One-Arm | `ote1.upperArm` | Catalyst #894 + ISSA (wariant: hantel) | zostaje |
| Standing Low-Pulley One-Arm | `press1.noLock` | ISSA (REP = 5) | spada |
| Standing Low-Pulley One-Arm, Dumbbell One-Arm, Overhead (EZ), Standing Overhead Barbell, Kettlebell | `mis.archBack` | Naternicola (REP = 5) | spada — kandydat do reguły „błąd = zaprzeczenie standardu” z ACE #74 („bez zmiany pozycji tułowia”, część 1 sekcja 5 pkt 3), ale brzmienia ACE #74 w tej sesji nie czytałem → [OTWARTE] |
| Dumbbell One-Arm | `ote1.setup` | ISSA + ACE #74 + Naternicola + Catalyst #894 (warianty) | zostaje |
| Dumbbell One-Arm | `ote1.move`, `press1.noLock` | ISSA + ACE #74 (wariant: oburącz) | zostaje |
| Dumbbell One-Arm | `ote1.upperArm` | ISSA + Catalyst + ACE | zostaje |
| Single Arm Triceps Pushdown | `tpd1.setup`, `tpd1.move`, `tpd1.elbow` | ACE #185 + Catalyst #898 | zostaje |
| Single Arm Triceps Pushdown | `press1.noLock` | ACE #185 (NFPT) | spada |
| Single Arm Triceps Pushdown | `mis.elbowAway1` | ACE #185 (wprost: „forward movement of your elbows”) + Catalyst #898 („elbow close to the side”) | zostaje — oznaczenie „błąd = zaprzeczenie standardu” (Catalyst) |
| Single Arm Triceps Pushdown | `mis.torso` | Delavier (3; „avoid any swaying of the torso”, wariant: oburącz) + ACE #185 (tułów nieruchomo, część 1 sekcja 5 pkt 3) | zostaje — oznaczenie „błąd = zaprzeczenie standardu” (ACE) |
| Single Arm Triceps Pushdown | `mis.jerk` | (NFPT, REP) | spada |
| Overhead Triceps Extension (EZ) | `ote.setupLoad`, `ote.elbowsIn` | ACE #74 + Naternicola (wariant: hantel; NFPT o gryfie EZ nie liczy się) | zostaje (wariant) |
| Overhead Triceps Extension (EZ) | `ote.moveLoad`, `ote.upperArm`, `press.noLock` | ACE #74 + ISSA (wariant: hantel) | zostaje (wariant) |
| Reverse Grip Triceps Pushdown | `rgpd.setup`, `rgpd.move`, `tpd.elbows` | Catalyst #878 (NFPT) | spada |
| Reverse Grip Triceps Pushdown | `press.noLock` | ACE #185 (nachwyt) (NFPT) | spada |
| Reverse Grip Triceps Pushdown | `mis.elbowsAway` | ACE #185 (nachwyt) + Catalyst #878 (zaprzeczenie standardu „elbows close to the sides”) — ale karta i tak otwarta | zdanie zostaje, nieużyte |
| Reverse Grip Triceps Pushdown | `mis.jerk` | (NFPT, REP) | spada |
| Tate Press | `tate.setup`, `tate.move` | ISSA #5 + Catalyst #909 | zostaje |
| JM Press | `jm.setup`, `jm.move`, `mis.jmElbows` | Catalyst #801 (EliteFTS = 5) | spada |
| Standing Overhead Barbell, Kettlebell | (zdania z części 1) | patrz triceps.md | zostają |

### Karty → stan (cała rodzina, części 1 i 2)

| Karta | Stan |
|---|---|
| Single Arm Triceps Pushdown | **własna z błędami** (`mis.elbowAway1`, `mis.torso`) |
| Skullcrusher (hantle) | **własna bez błędów** |
| Machine Triceps Extension | **własna bez błędów** (kierunek ruchu figury — sekcja 5 pkt 7, bez zmian) |
| Dumbbell One-Arm Triceps Extension | **własna bez błędów** |
| Overhead Triceps Extension (EZ) | **własna bez błędów** (wariant: źródła o hantlu) |
| Tate Press | **własna bez błędów** |
| Triceps Kickback, Standing Overhead Barbell, Kettlebell Overhead | **własne bez błędów** (blok w triceps.md) |
| Skullcrusher (sztanga) | otwarta — brak zdania ustawienia (`skullBb.setup` spada); `skull.move`, `skull.upperArm` gotowe |
| Standing Low-Pulley One-Arm | otwarta — brak zdania ustawienia (`lpote.setup` spada); `lpote.move`, `ote1.upperArm` gotowe |
| Reverse Grip Triceps Pushdown | otwarta — brak ustawienia i ruchu (NFPT nie liczy się) |
| JM Press | otwarta — brak ustawienia i ruchu (EliteFTS = 5) |
| Triceps Kickback (linki) | otwarta — brak zdania ustawienia (triceps.md) |
| 14 kluczy „otwarte” z sekcji 1 tego pliku | otwarta (bez zmian) |

Razem: 28 kluczy; własne z błędami 1, własne bez błędów 8, otwarte 19.

Nowe zdania (sekcja 3 części 1 i 2) po przeliczeniu — gotowe i użyte w kartach (20): `kick.setup`, `kick.move`, `kick.upperArm`, `skullDb.setup`,
`skullDb.move`, `ote.setupLoad`, `ote.moveLoad`, `machTri.setup`, `machTri.move`, `ote1.setup`, `ote1.move`, `ote1.upperArm`, `press1.noLock`, `tpd1.setup`,
`tpd1.move`, `tpd1.elbow`, `tate.setup`, `tate.move`, `mis.elbowAway1`, `mis.torso`. Gotowe, nieużyte (karta otwarta): `lpote.move`, `mis.elbowsAway`.
Spadają: `skullBb.setup`, `machTri.pivot`, `lpote.setup`, `rgpd.setup`, `rgpd.move`, `jm.setup`, `jm.move`, `mis.archBack`, `mis.jmElbows`.

### Blok do wdrożenia (po przeliczeniu 02.11.2026)

Karty z tego pliku spełniające kryterium; uzupełnia blok w `triceps.md` (rozłączne klucze). Źródła potrzebne do wdrożenia: ace-36/74/185/292, issa-tri-top5,
catalyst-894/-898/-909, hk-naternicola, hk-delavier (`kind` = `book`). Nie wdrażać źródeł nfpt-*, rep-*, precor-*, elitefts-*, hoist-* (żadne zdanie bloku na nich nie stoi).

```json
{
  "Skullcrusher (hantle)": {
    "setup": [{"c": "skullDb.setup", "s": [["issa-tri-top5", "#2, wersja leżąc"], ["ace-36", "Step 1 (wariant: sztanga)"]]}],
    "move": [{"c": "skullDb.move", "s": [["issa-tri-top5", "#2, wersja leżąc"], ["ace-36", "Step 2; Step 3 (wariant: sztanga)"]]}],
    "tips": [
      {"c": "skull.upperArm", "s": [["ace-36", "Step 2 (wariant: sztanga)"], ["issa-tri-top5", "#2, wersja leżąc"]]}
    ],
    "mistakes": []
  },
  "Machine Triceps Extension": {
    "setup": [{"c": "machTri.setup", "s": [["ace-292", "Step 2 (Sitting with a tall back, rest the upper arms on the pad and grasp the handles)"], ["hk-naternicola", "Figure 5.28, przygotowanie, kroki 1–3"]]}],
    "move": [{"c": "machTri.move", "s": [["ace-292", "Step 3; Step 4 (press the hands downward; slowly return)"], ["hk-naternicola", "Figure 5.28, Movement 1 i 3; Misstep (downward phase)"]]}],
    "tips": [
      {"c": "llc.control", "s": [["hk-naternicola", "Figure 5.28, Movement 1 i 3"], ["ace-292", "Step 4 (Slowly return)"]]}
    ],
    "mistakes": []
  },
  "Dumbbell One-Arm Triceps Extension": {
    "setup": [{"c": "ote1.setup", "s": [["issa-tri-top5", "#2 (or use one arm at a time)"], ["ace-74", "Step 2 (wariant: oburącz)"], ["hk-naternicola", "Figure 5.27 (elbows pointing upward; wariant: oburącz)"], ["catalyst-894", "Description (one hand overhead; wariant: wyciąg)"]]}],
    "move": [{"c": "ote1.move", "s": [["issa-tri-top5", "#2 (one arm at a time)"], ["ace-74", "Step 2; Step 3 (wariant: oburącz)"]]}],
    "tips": [
      {"c": "ote1.upperArm", "s": [["issa-tri-top5", "#2 (keep your upper arm still)"], ["catalyst-894", "Description (wariant: wyciąg)"], ["ace-74", "Step 3 (wariant: oburącz)"]]},
      {"c": "press1.noLock", "s": [["issa-tri-top5", "#2 (not lock the elbows)"], ["ace-74", "Step 2 (wariant: oburącz)"]]}
    ],
    "mistakes": []
  },
  "Single Arm Triceps Pushdown": {
    "setup": [{"c": "tpd1.setup", "s": [["ace-185", "Step 1; Step 3 (wersja jednorącz)"], ["catalyst-898", "Description (one hand; high cable attachment; elbow close to the side)"]]}],
    "move": [{"c": "tpd1.move", "s": [["ace-185", "Step 2; Step 3"], ["catalyst-898", "Description (extend the elbow maximally, then return to the top under control)"]]}],
    "tips": [
      {"c": "tpd1.elbow", "s": [["ace-185", "Step 1; wskazówka końcowa"], ["catalyst-898", "Description (elbow close to the side)"]]}
    ],
    "mistakes": [
      {"c": "mis.elbowAway1", "s": [["ace-185", "wskazówka końcowa (forward movement of your elbows)"], ["catalyst-898", "Description (elbow close to the side; błąd = zaprzeczenie standardu)"]]},
      {"c": "mis.torso", "s": [["hk-delavier", "Cable Push-Down (avoid any swaying of the torso; wariant: oburącz)"], ["ace-185", "Step 2 (tułów nieruchomo; błąd = zaprzeczenie standardu)"]]}
    ]
  },
  "Overhead Triceps Extension (EZ)": {
    "setup": [{"c": "ote.setupLoad", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["hk-naternicola", "Figure 5.27 (wariant: hantel)"]]}],
    "move": [{"c": "ote.moveLoad", "s": [["ace-74", "Step 2; Step 3 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}],
    "tips": [
      {"c": "ote.upperArm", "s": [["ace-74", "Step 3 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]},
      {"c": "ote.elbowsIn", "s": [["ace-74", "wskazówka końcowa (wariant: hantel)"], ["hk-naternicola", "Figure 5.27 (wariant: hantel)"]]},
      {"c": "press.noLock", "s": [["ace-74", "Step 2 (wariant: hantel)"], ["issa-tri-top5", "#2 (wariant: hantel)"]]}
    ],
    "mistakes": []
  },
  "Tate Press": {
    "setup": [{"c": "tate.setup", "s": [["issa-tri-top5", "#5 Tate Press (lying on a bench; dumbbells upright as in a bench press)"], ["catalyst-909", "Description (Lie supine on a bench … pressed straight up)"]]}],
    "move": [{"c": "tate.move", "s": [["issa-tri-top5", "#5 Tate Press (lower toward the chest, elbows pointing outward; press back up)"], ["catalyst-909", "Description (elbows out to the sides … lower the dumbbells to the chest; extend again)"]]}],
    "tips": [],
    "mistakes": []
  }
}
```

Uwaga do `mis.torso`: miejsce w ACE #185 („Step 2”) przyjęte za częścią 1 (sekcja 5 pkt 3: „ACE #185 tylko »tułów nieruchomo«”) bez ponownego otwarcia strony — przed wpisem
do rejestru sprawdzić dokładny krok (recenzja L-047).
