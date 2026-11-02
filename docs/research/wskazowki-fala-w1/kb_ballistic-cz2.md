# Wskazówki techniki — kb_ballistic, cz. 2: wyciskania z wybiciem i podrzuty kettlebellem

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3).
Zakres: One-Arm Kettlebell Push Press, Double Kettlebell Push Press, One-Arm Kettlebell Jerk, Double Kettlebell Jerk,
One-Arm Kettlebell Clean and Jerk, One-Arm Kettlebell Split Jerk (dziś zestaw ogólny „pushPress”/„oly”).
Zarzuty i rwania kettlebellem — osobny plik innego badacza (tu nieruszane).

**Status: PROPOZYCJA — nic nie jest w `data/zrodla/` ani `lib/`.** Tylko zbieranie danych (polecenie właściciela 02.11.2026).

Metoda: wyjątek dla wskazówek techniki z CLAUDE.md — zdanie ustalone, gdy zgadzają się ≥ 2 niezależne, przeczytane źródła szczebla 4
z różnych organizacji; tylko część wspólna; bez liczb, tempa i twierdzeń o zdrowiu. Wariant tego samego ćwiczenia (jedna/dwie ręce,
podrzut zwykły/nożycowy) liczy się z opisem „(wariant: …)”; inne ćwiczenie = analogia, nie liczy się.

Dostęp w tej sesji: ExRx (403) i web.archive.org — niedostępne; blog RKC (rkcblog.dragondoor.com) — 503; blog producenta
kettlebelli (kettlebellkings.com) — 402; strona producenta/sklepu ironedge.com.au — przekierowanie na stronę główną (brak treści);
strona sklepu Rogue — tylko wideo, bez tekstu. Strony aplikacji treningowych z wyników wyszukiwania pominięte (nie są źródłem).

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| One-Arm Kettlebell Push Press | gotowe | setup, move, 2 wskazówki, 1 błąd; źródło o dwóch kettlebellach liczone jako wariant |
| Double Kettlebell Push Press | gotowe | jw.; źródło o jednym kettlebellu (Nuffield) liczone jako wariant |
| One-Arm Kettlebell Jerk | gotowe | setup, move, 3 wskazówki, 2 błędy; większość źródeł opisuje jedną lub dwie ręce łącznie |
| Double Kettlebell Jerk | gotowe | jw. |
| One-Arm Kettlebell Split Jerk | częściowe | setup + move potwierdzone; brak błędów z 2 źródłami (patrz „Otwarte”) |
| One-Arm Kettlebell Clean and Jerk | częściowe | move + część podrzutu; zarzut — zdania z pliku drugiego badacza (zarzuty), do dołączenia przy scalaniu |

## 2. Dane (format `data/zrodla/cues.json`)

```json
{
  "orgs": {
    "CrossFit": { "name": "CrossFit — Essentials (crossfit.com; organizacja szkoląca trenerów)", "level": 4, "kind": "org" },
    "StrongFirst": { "name": "StrongFirst — blog (strongfirst.com; organizacja certyfikująca instruktorów kettlebell)", "level": 4, "kind": "org" },
    "Nuffield Health": { "name": "Nuffield Health — artykuły „How to” (nuffieldhealth.com; sieć zdrowia i klubów, autor: trener personalny)", "level": 4, "kind": "org" }
  },
  "sources": {
    "cf-dkb-pp-jerk": { "org": "CrossFit", "title": "Double-Kettlebell Push Press and Jerk", "url": "https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk", "level": 4 },
    "sf-go-ballistic-jerk": { "org": "StrongFirst", "title": "Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)", "url": "https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/", "level": 4 },
    "nuffield-kb-clean-press": { "org": "Nuffield Health", "title": "How to: Kettlebell clean and press (O. Tyler, akt. 03.08.2026)", "url": "https://nuffieldhealth.com/article/how-to-kettlebell-clean-and-press", "level": 4 },
    "ace-385": { "org": "ACE", "title": "Push-jerk (#385; kettlebells)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/", "level": 4 },
    "barbend-kb-jerk-vs-pp": { "org": "BarBend", "title": "Kettlebell Jerk vs Push Press (M. Dewar, CSCS; akt. 24.08.2023)", "url": "https://barbend.com/kettlebell-jerk-vs-push-press", "level": 4 },
    "breakingmuscle-kb-jerk": { "org": "Breaking Muscle", "title": "How to Master the Kettlebell Jerk (L. Clemente)", "url": "https://breakingmuscle.com/how-to-master-the-kettlebell-jerk/", "level": 4 }
  },
  "exercises": {
    "One-Arm Kettlebell Push Press": {
      "setup": [
        { "c": "kbb.rack", "s": [
          ["nuffield-kb-clean-press", "The clean (kettlebell rests on the outside of the forearm — front rack)"],
          ["cf-dkb-pp-jerk", "Rack Position (elbows over the hips); Common Faults: gaps in the rack (wariant: dwa kettlebelle)"]
        ] }
      ],
      "move": [
        { "c": "kbpp.move", "s": [
          ["nuffield-kb-clean-press", "How to do a kettlebell push press (slightly bend knees; push overhead as you drive up to standing)"],
          ["cf-dkb-pp-jerk", "Dip; Drive; Lockout (wariant: dwa kettlebelle)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (leg and hip strength accelerate the load; upper body then pushes overhead)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.dip", "s": [
          ["cf-dkb-pp-jerk", "Dip (dip slightly, torso upright) (wariant: dwa kettlebelle)"],
          ["nuffield-kb-clean-press", "How to do a kettlebell push press (slightly bend your knees, keeping your chest upright)"]
        ] },
        { "c": "pp.legs", "s": [
          ["cf-dkb-pp-jerk", "Drive (push the floor away, extending legs and hips); Common Faults: shortened hip drive (wariant: dwa kettlebelle)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (leg and hip strength accelerate the load; upper body then extends)"]
        ] }
      ],
      "mistakes": [
        { "c": "kbpp.mis.rebend", "s": [
          ["cf-dkb-pp-jerk", "Push Press vs. Jerk (no rebend, or „double dip”, in the push press) (wariant: dwa kettlebelle)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (knees, ankles and hips are not rebent after the leg drive)"]
        ] }
      ]
    },
    "Double Kettlebell Push Press": {
      "setup": [
        { "c": "kbb.rack", "s": [
          ["cf-dkb-pp-jerk", "Rack Position (elbows over the hips); Common Faults: gaps in the rack"],
          ["nuffield-kb-clean-press", "The clean (rests on the outside of the forearm) (wariant: jeden kettlebell)"]
        ] }
      ],
      "move": [
        { "c": "kbpp.move", "s": [
          ["cf-dkb-pp-jerk", "Dip; Drive; Lockout"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press"],
          ["nuffield-kb-clean-press", "How to do a kettlebell push press (wariant: jeden kettlebell)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.dip", "s": [
          ["cf-dkb-pp-jerk", "Dip (dip slightly, torso upright)"],
          ["nuffield-kb-clean-press", "How to do a kettlebell push press (chest upright) (wariant: jeden kettlebell)"]
        ] },
        { "c": "pp.legs", "s": [
          ["cf-dkb-pp-jerk", "Drive; Common Faults: shortened hip drive"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press"]
        ] }
      ],
      "mistakes": [
        { "c": "kbpp.mis.rebend", "s": [
          ["cf-dkb-pp-jerk", "Push Press vs. Jerk (no rebend / „double dip”)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (not rebent following the initial leg drive)"]
        ] }
      ]
    },
    "One-Arm Kettlebell Jerk": {
      "setup": [
        { "c": "kbb.rack", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (elbow down and close to your ribs)"],
          ["breakingmuscle-kb-jerk", "rack (elbows resting on the iliac crests)"],
          ["cf-dkb-pp-jerk", "Rack Position (wariant: dwa kettlebelle)"]
        ] }
      ],
      "move": [
        { "c": "kbj.move", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 2–5 (dip, drive, lockout + re-bend under, stand up)"],
          ["breakingmuscle-kb-jerk", "first dip; bump; second dip; lockout and fixation"],
          ["cf-dkb-pp-jerk", "Push Press vs. Jerk (drop under the weight; „drop and lock”, then stand) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.wrist", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (vertical forearms and straight wrists)"],
          ["cf-dkb-pp-jerk", "Rack Position (straight or slightly flexed wrist) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbb.dip", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (dip straight down)"],
          ["breakingmuscle-kb-jerk", "first dip (bend the knees slightly in a crisp movement)"],
          ["cf-dkb-pp-jerk", "Dip (torso upright) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbj.lockFirst", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5 (full overhead lock out, re-bend to get under; then stand up)"],
          ["breakingmuscle-kb-jerk", "second dip (extend the elbows while sitting under); lockout (then extend the knees)"],
          ["cf-dkb-pp-jerk", "Push Press vs. Jerk („drop and lock”, then stand up) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "mistakes": [
        { "c": "kbj.mis.hips", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk — uwaga o błędzie (bend at the knees and ankles, not the hips, or risk falling forward)"],
          ["breakingmuscle-kb-jerk", "first dip (hips move forward, not backward; lifter should not squat)"]
        ] },
        { "c": "kbj.mis.arms", "s": [
          ["breakingmuscle-kb-jerk", "bump („arms made of jelly”; muscling the bells up with arms breaks down as weight increases)"],
          ["cf-dkb-pp-jerk", "Common Faults: incomplete hip extension in the jerk; shortened hip drive (wariant: dwa kettlebelle)"]
        ] }
      ]
    },
    "Double Kettlebell Jerk": {
      "setup": [
        { "c": "kbb.rack", "s": [
          ["cf-dkb-pp-jerk", "Rack Position; Common Faults: gaps in the rack"],
          ["breakingmuscle-kb-jerk", "rack (elbows resting on the iliac crests)"],
          ["ace-385", "Step 1 (elbows tucked near the ribs, bells against the forearms) (wariant: podrzut nożycowy)"]
        ] }
      ],
      "move": [
        { "c": "kbj.move", "s": [
          ["cf-dkb-pp-jerk", "Push Press vs. Jerk; Dip; Drive; Lockout"],
          ["breakingmuscle-kb-jerk", "first dip; bump; second dip; lockout and fixation"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 2–5 (one arm or both)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.wrist", "s": [
          ["cf-dkb-pp-jerk", "Rack Position (straight or slightly flexed wrist)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (straight wrists)"]
        ] },
        { "c": "kbb.dip", "s": [
          ["cf-dkb-pp-jerk", "Dip"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2"],
          ["breakingmuscle-kb-jerk", "first dip"]
        ] },
        { "c": "kbj.lockFirst", "s": [
          ["cf-dkb-pp-jerk", "Push Press vs. Jerk („drop and lock”)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5"],
          ["breakingmuscle-kb-jerk", "second dip; lockout"]
        ] }
      ],
      "mistakes": [
        { "c": "kbj.mis.hips", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk — uwaga o błędzie (not the hips, or risk falling forward)"],
          ["breakingmuscle-kb-jerk", "first dip (not squat; hips forward)"]
        ] },
        { "c": "kbj.mis.arms", "s": [
          ["cf-dkb-pp-jerk", "Common Faults: incomplete hip extension in the jerk; shortened hip drive"],
          ["breakingmuscle-kb-jerk", "bump (muscling the bells up)"]
        ] }
      ]
    },
    "One-Arm Kettlebell Split Jerk": {
      "setup": [
        { "c": "kbb.rack", "s": [
          ["nuffield-kb-clean-press", "The clean (rests on the outside of the forearm); split jerk starts „from your kettlebell clean”"],
          ["ace-385", "Step 1 (elbows tucked near the ribs, bells against the forearms) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "move": [
        { "c": "kbsj.move", "s": [
          ["nuffield-kb-clean-press", "How to do a kettlebell split jerk (drive overhead, jump legs into a lunge; bring legs back to the centre)"],
          ["ace-385", "Steps 2–3 (jump into a split-leg lunge while punching arms straight up; step back to feet under the hips) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "tips": [],
      "mistakes": []
    },
    "One-Arm Kettlebell Clean and Jerk": {
      "setup": [],
      "move": [
        { "c": "kbcj.move", "s": [
          ["cf-dkb-pp-jerk", "Setup (hike, clean to the rack); Push Press vs. Jerk (drop under) (wariant: dwa kettlebelle)"],
          ["ace-385", "Starting Position + Step 1 (bells from the floor to the rack); Step 2 (jerk) (wariant: dwa kettlebelle, podrzut nożycowy)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.dip", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (podrzut — ta sama faza)"],
          ["breakingmuscle-kb-jerk", "first dip (podrzut — ta sama faza)"]
        ] },
        { "c": "kbj.lockFirst", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5 (podrzut — ta sama faza)"],
          ["breakingmuscle-kb-jerk", "second dip; lockout (podrzut — ta sama faza)"]
        ] }
      ],
      "mistakes": [
        { "c": "kbj.mis.hips", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk — uwaga o błędzie (podrzut — ta sama faza)"],
          ["breakingmuscle-kb-jerk", "first dip (podrzut — ta sama faza)"]
        ] }
      ]
    }
  }
}
```

Uwaga do Clean and Jerk: faza podrzutu jest tym samym ruchem co One-Arm Kettlebell Jerk, dlatego źródła o podrzucie liczę bez
oznaczenia „analogia”; jeśli audytor uzna inaczej — usunąć tips/mistakes z tego ćwiczenia (zostaje samo `kbcj.move`).

## 3. Nowe zdania

Istniejące zdania użyte bez zmian: `pp.legs` („Siła wybicia idzie z nóg i bioder — ręce kończą ruch.”) — tylko w wyciskaniu z wybiciem.

| id | PL | EN (propozycja) |
|---|---|---|
| kbb.rack | Kettlebell w pozycji przy barku: leży na zewnętrznej stronie przedramienia, łokieć przy tułowiu. | Kettlebell in the rack at the shoulder: resting on the outside of the forearm, elbow tucked in to your body. |
| kbb.wrist | Nadgarstek trzymaj prosto. | Keep your wrist straight. |
| kbb.dip | Ugięcie nóg krótkie, tułów zostaje pionowo. | Keep the dip short and your torso upright. |
| kbpp.move | Krótko ugnij kolana, potem dynamicznie wyprostuj nogi i biodra i wypchnij ciężar nad głowę do pełnego wyprostu rąk. | Dip briefly at the knees, then drive hard through your legs and hips and push the weight overhead to full lockout. |
| kbpp.mis.rebend | Drugie ugięcie nóg pod ciężar — to już podrzut, nie wyciskanie z wybiciem. | Re-bending your knees under the weight — that turns it into a jerk, not a push press. |
| kbj.move | Krótko ugnij nogi i wybij ciężar w górę, od razu zejdź drugim ugięciem pod niego z prostymi rękami i wstań z ciężarem nad głową. | Dip and drive the weight up, drop straight into a second dip under it with locked arms, then stand up with it overhead. |
| kbj.lockFirst | Zablokuj ciężar nad głową już w drugim ugięciu — dopiero potem wstań. | Lock the weight out overhead in the second dip — only then stand up. |
| kbj.mis.hips | Pierwsze ugięcie jak do przysiadu — biodra uciekają w tył, a tułów leci w przód. | Squatting the first dip — hips go back and your torso tips forward. |
| kbj.mis.arms | Wypychanie ciężaru rękami, zanim nogi i biodra skończą wybicie. | Pressing with the arms before the legs and hips finish the drive. |
| kbsj.move | Krótko ugnij nogi, wybij kettlebell w górę i przeskocz do wykroku, prostując rękę nad głową; potem zsuń stopy z powrotem pod biodra. | Dip, drive the kettlebell up and jump into a split, punching your arm straight overhead; then bring your feet back under your hips. |
| kbcj.move | Zarzuć kettlebell z podłogi do pozycji przy barku, a potem podrzuć go nad głowę. | Clean the kettlebell from the floor to the rack, then jerk it overhead. |

Uwaga do `kbpp.move` / `kbj.move` w wersji jednorącz: słowo „rąk” — tłumacz/programista może dać wariant „ręki” dla ćwiczeń
jednorącz (osobne id, np. `kbpp.move1`), treść merytoryczna bez zmian.

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| cf-dkb-pp-jerk | https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk | CrossFit | 4 | Setup, Rack Position, Dip, Drive, Lockout, Push Press vs. Jerk, Common Faults. Cytat: „there is no rebend, or "double dip," in the push press” (Push Press vs. Jerk). |
| sf-go-ballistic-jerk | https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/ | StrongFirst | 4 | sekcja o podrzucie kettlebellem, kroki 1–5 i uwaga o błędzie. Cytat: „Dip straight down bending only at the knees while keeping the heels planted.” |
| nuffield-kb-clean-press | https://nuffieldhealth.com/article/how-to-kettlebell-clean-and-press | Nuffield Health | 4 | zarzut, „How to do a kettlebell push press”, „How to do a kettlebell split jerk”. Cytat: „From your kettlebell clean, slightly bend your knees, keeping your chest upright”. |
| ace-385 | https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/ | ACE | 4 | opis (Starting Position, kroki 1–4; dwa kettlebelle, podrzut nożycowy). Cytat: „Keep the back straight and bend the knees slightly to dip at the hips”. |
| barbend-kb-jerk-vs-pp | https://barbend.com/kettlebell-jerk-vs-push-press | BarBend | 4 | sekcje „Kettlebell Push Press”, „Kettlebell Jerk”. Cytat: „the knees, ankles, and hips are not rebent following the initial leg drive phases”. |
| breakingmuscle-kb-jerk | https://breakingmuscle.com/how-to-master-the-kettlebell-jerk/ | Breaking Muscle | 4 | rack, first dip, bump, second dip, lockout/fixation, opuszczanie (autor: trener kettlebell sport). Treść przez narzędzie częściowo w parafrazie — miejsca podane wg etapów artykułu. |

## 5. Otwarte

- **Istniejące `pp.setup`, `pp.move`** — mówią o sztandze, nie pasują. **`pp.dip`** („tułów napięty”) — źródła kettlebellowe mówią
  „tułów pionowo”, nie „napięty”; zamiast niego `kbb.dip`. Zestawy ogólne „pushPress”/„oly” — nie wpisywać zdań niepotwierdzonych
  dla wariantu kettlebell (krótsza karta).
- **Błąd „odstęp między ramieniem a tułowiem w pozycji przy barku”** — nazwany błędem tylko w CrossFit (Common Faults); pozostałe
  źródła mówią tylko pozytywnie (łokieć przy żebrach/biodrze). Jedno źródło → nie do danych.
- **Przedramię pionowo w pozycji przy barku** — tylko StrongFirst. ACE opisuje nadgarstek jako zgięty, CrossFit „prosty lub lekko
  zgięty” → do `kbb.wrist` wzięta tylko część wspólna „prosto” (StrongFirst + CrossFit); ACE-385 nie liczony przy nadgarstku.
- **`kbb.wrist` w wyciskaniu z wybiciem** — oba źródła o nadgarstku dotyczą (także) podrzutu; CrossFit obejmuje push press, StrongFirst
  tylko podrzut → w push pressie jedno źródło, pominięte.
- **`kbj.mis.hips` w wyciskaniu z wybiciem** — dla push pressu tylko źródła o podrzucie (analogia); CrossFit mówi o ugięciu „kolan i bioder”
  → nie do push pressu.
- **Krótkie zatrzymanie ciężaru na górze (fiksacja)** — Breaking Muscle; drugie źródło (blog sklepu ironedge) niedostępne → otwarte.
- **Opuszczanie z amortyzacją kolan i powrót łokci do tułowia** — Breaking Muscle (podrzut) + ACE-385 (podrzut nożycowy, łokcie do żeber);
  zdanie nie dopisane z braku miejsca w karcie i niepewności, czy ACE wystarcza dla podrzutu zwykłego — do kolejnej fali.
- **Podrzut nożycowy (One-Arm Kettlebell Split Jerk):** wolna ręka w bok dla równowagi — tylko Nuffield; ugięcie „tułów pionowo” —
  Nuffield (chest upright) vs ACE (back straight) to nie to samo → `kbb.dip` nie przypisany; brak błędów z 2 źródłami.
- **Clean and Jerk — zarzut:** zdania o zarzucie z pliku drugiego badacza (zarzuty/rwania kettlebellem); `setup` tu pusty.
- **Oddech (nie wstrzymywać)** — Breaking Muscle (podrzut) i StrongFirst (wydech z wybiciem) mówią o oddechu różnie; brak 2 zgodnych
  prostych wskazówek → nie do danych.
- Niedostępne źródła do ponowienia: blog RKC „The Kettlebell Jerk” (503), blog producenta kettlebelli (402), ExRx (403).

## 6. Stan

Zrobione: 6/6 ćwiczeń przejrzanych; 4 gotowe, 2 częściowe; 11 nowych zdań + 1 istniejące (`pp.legs`); 6 nowych źródeł, 3 nowe organizacje.
Zostało: błędy dla podrzutu nożycowego; fiksacja i opuszczanie (drugie źródło); scalenie Clean and Jerk ze zdaniami zarzutu drugiego badacza.
Pułapki: ExRx/Wayback, RKC, kettlebellkings niedostępne; strony aplikacji w wynikach wyszukiwania nie są źródłem.
