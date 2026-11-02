# Wskazówki techniki — kb_ballistic, cz. 2: wyciskania z wybiciem i podrzuty kettlebellem

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3). Przegląd po nowych szczeblach (koordynator linii 1.1, 02.11.2026):
badacz-merytoryczny (fala W1, G3), druga sesja, 02.11.2026.
Zakres: One-Arm Kettlebell Push Press, Double Kettlebell Push Press, One-Arm Kettlebell Jerk, Double Kettlebell Jerk,
One-Arm Kettlebell Clean and Jerk, One-Arm Kettlebell Split Jerk (dziś zestaw ogólny „pushPress”/„oly”).
Zarzuty i rwania kettlebellem — `kb_ballistic-cz1.md` (inny badacz; tu tylko odwołania do jego zdań w Clean and Jerk).

**Status: PROPOZYCJA — nic nie jest w `data/zrodla/` ani `lib/`.** Tylko zbieranie danych (polecenie właściciela 02.11.2026).

Metoda: wyjątek dla wskazówek techniki z CLAUDE.md — zdanie ustalone, gdy zgadzają się ≥ 2 niezależne, przeczytane źródła szczebla 4
z różnych organizacji; tylko część wspólna; bez liczb, tempa i twierdzeń o zdrowiu. Wariant tego samego ćwiczenia (jedna/dwie ręce,
podrzut zwykły/nożycowy) liczy się z opisem „(wariant: …)”; inne ćwiczenie = analogia, nie liczy się. Wyjątek: w Clean and Jerk fazy
zarzutu i podrzutu to te same ruchy co Kettlebell Clean i Kettlebell Jerk — źródła tych ćwiczeń liczone z opisem „(ta sama faza)”.

Zmiany po przeglądzie szczebli (02.11.2026, druga sesja):
- Breaking Muscle → szczebel 5 (nigdy niezależne od BarBend) — usunięte ze wszystkich zdań.
- Nuffield Health → szczebel 5: nie spełnia (a) — sieć szpitali i klubów, nie organizacja szkoląca/certyfikująca trenerów, bez recenzji
  eksperckiej (strona: autor „Personal Trainer and Fitness Manager”, data 03.08.2026, brak „reviewed by”; liczne wezwania do zakupu
  usług). Usunięte ze wszystkich zdań.
- CrossFit Essentials → 4: (a) organizacja certyfikująca trenerów, (b) autor J. Martone, styczeń 2008, (c) treść instruktażowa.
  Ponowne czytanie pokazało, że strona NIE ma sekcji „Common Faults” ani „Dip/Drive/Lockout” — nagłówki to „The Rack”, „Push Press”,
  „Jerk”; miejsca poprawione. Cytowane wcześniej „incomplete hip extension / shortened hip drive” jako błąd w podrzucie — na stronie
  jest tylko „The hip drive is the power behind the movement; don't cut it short” (Push Press) i polecenie pełnego wyprostu bioder
  przed drugim ugięciem (Jerk).
- StrongFirst → 4: (a) szkoła certyfikująca instruktorów kettlebell, (b) autorka M. Kwon Gracia (Certified Senior Instructor);
  data na stronie nie podana, komentarze z 18–22.02.2022, (c) artykuł instruktażowy.
- ACE → 4 (biblioteka ćwiczeń organizacji certyfikującej). BarBend „Kettlebell Jerk vs Push Press” → 4 (artykuł o technice,
  M. Dewar, CSCS, akt. 24.08.2023, bez linków zakupowych w treści).
- Nowe: Dangerously Fit Academy → 4 (organizacja prowadząca certyfikację instruktorów kettlebell, poziom 1 i 2; biblioteka ćwiczeń
  firmowana przez organizację, bez autora i daty — kryterium (b) spełnione przez „treść jawnie firmowana”; strona linkuje do kursu,
  ale treść jest instruktażowa, nie reklamą produktu). Przypadek graniczny (c) — do oceny audytora.
- `kbb.rack` z pierwszej wersji tego pliku koliduje z `kbb.rack` z cz1 (inna treść). Tu przemianowane na `kbj.rack` (krótsza treść,
  tylko część potwierdzona); w Clean and Jerk używam `kbb.rack` z cz1.

## 1. Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| One-Arm Kettlebell Push Press | gotowe | setup, move, 2 wskazówki, 1 błąd; wszystkie źródła opisują dwa kettlebelle albo kettlebell ogólnie — liczone jako wariant |
| Double Kettlebell Push Press | gotowe | setup, move, 2 wskazówki, 1 błąd |
| One-Arm Kettlebell Jerk | częściowe | setup, move, 5 wskazówek; brak błędu z 2 źródłami szczebla 4 (patrz „Otwarte”) |
| Double Kettlebell Jerk | częściowe | jw. |
| One-Arm Kettlebell Clean and Jerk | gotowe | zarzut — zdania i źródła z cz1 (Kettlebell Clean, ta sama faza); podrzut — źródła podrzutu; błędy tylko fazy zarzutu |
| One-Arm Kettlebell Split Jerk | otwarte | po wykluczeniu Nuffield Health zostaje jedno źródło szczebla 4 (ACE, dwa kettlebelle) — brak setup/move/błędów |

## 2. Dane (format `data/zrodla/cues.json`)

Organizacje `ACE`, `BarBend` istnieją w `data/zrodla/cues.json`; `StrongFirst` definiuje plik cz1 (ta sama organizacja).

```json
{
  "orgs": {
    "CrossFit": { "name": "CrossFit — Essentials (crossfit.com; organizacja certyfikująca trenerów)", "level": 4, "kind": "org" },
    "Dangerously Fit": { "name": "Dangerously Fit Academy — biblioteka ćwiczeń kettlebell (dangerouslyfit.com.au; organizacja certyfikująca instruktorów kettlebell)", "level": 4, "kind": "org" }
  },
  "sources": {
    "cf-dkb-pp-jerk": { "org": "CrossFit", "title": "Double-Kettlebell Push Press and Jerk (J. Martone, 01.2008)", "url": "https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk", "level": 4 },
    "sf-go-ballistic-jerk": { "org": "StrongFirst", "title": "Go Ballistic—The Jerk for Barbell and Kettlebell (M. Kwon Gracia)", "url": "https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/", "level": 4 },
    "ace-385": { "org": "ACE", "title": "Push-jerk (#385; kettlebells)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/", "level": 4 },
    "barbend-kb-jerk-vs-pp": { "org": "BarBend", "title": "Kettlebell Jerk vs Push Press (M. Dewar, CSCS; akt. 24.08.2023)", "url": "https://barbend.com/kettlebell-jerk-vs-push-press", "level": 4 },
    "df-dkb-pp": { "org": "Dangerously Fit", "title": "Double Kettlebell Push Press (Teaching Points)", "url": "https://dangerouslyfit.com.au/kettlebell-exercise/double-kettlebell-push-press", "level": 4 },
    "df-kb-jerk": { "org": "Dangerously Fit", "title": "Kettlebell Jerk (Teaching Points)", "url": "https://www.dangerouslyfit.com.au/?p=16223", "level": 4 }
  },
  "exercises": {
    "One-Arm Kettlebell Push Press": {
      "setup": [
        { "c": "kbb.rackStart", "s": [
          ["cf-dkb-pp-jerk", "The Rack; Push Press (start with the kettlebells firmly racked) (wariant: dwa kettlebelle)"],
          ["df-dkb-pp", "Teaching Points 1 (start in a strong racked position) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "move": [
        { "c": "kbpp.move", "s": [
          ["cf-dkb-pp-jerk", "Push Press (dip slightly; push the floor away extending legs and hips; knees and elbows straight at the end) (wariant: dwa kettlebelle)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (leg and hip drive accelerates the load; upper body then pushes overhead)"],
          ["df-dkb-pp", "Teaching Points (knees and hips drive the bells overhead; straighten the arms) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "tips": [
        { "c": "pp.legs", "s": [
          ["cf-dkb-pp-jerk", "Push Press (extend legs and hips; the hip drive is the power behind the movement) (wariant: dwa kettlebelle)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (leg and hip strength accelerate the load)"],
          ["df-dkb-pp", "Teaching Points (use the knees and hips to drive) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbb.lower", "s": [
          ["cf-dkb-pp-jerk", "Push Press — lowering (controlled fall and catch; absorb the impact by bending your knees) (wariant: dwa kettlebelle)"],
          ["df-dkb-pp", "Teaching Points (absorb the impact as you lower the bells back into the rack) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "mistakes": [
        { "c": "kbpp.mis.rebend", "s": [
          ["cf-dkb-pp-jerk", "Push Press (no rebend, or „double dip”, in the push press) (wariant: dwa kettlebelle)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (knees, ankles and hips are not rebent after the leg drive)"]
        ] }
      ]
    },
    "Double Kettlebell Push Press": {
      "setup": [
        { "c": "kbb.rackStart", "s": [
          ["cf-dkb-pp-jerk", "The Rack; Push Press (kettlebells firmly racked)"],
          ["df-dkb-pp", "Teaching Points 1 (strong racked position)"]
        ] }
      ],
      "move": [
        { "c": "kbpp.move", "s": [
          ["cf-dkb-pp-jerk", "Push Press (dip, drive, knees and elbows straight at the end)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press"],
          ["df-dkb-pp", "Teaching Points (knees and hips drive; straighten the arms)"]
        ] }
      ],
      "tips": [
        { "c": "pp.legs", "s": [
          ["cf-dkb-pp-jerk", "Push Press (hip drive is the power behind the movement)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press"],
          ["df-dkb-pp", "Teaching Points (knees and hips drive)"]
        ] },
        { "c": "kbb.lower", "s": [
          ["cf-dkb-pp-jerk", "Push Press — lowering (absorb the impact by bending your knees)"],
          ["df-dkb-pp", "Teaching Points (absorb the impact as you lower into the rack)"]
        ] }
      ],
      "mistakes": [
        { "c": "kbpp.mis.rebend", "s": [
          ["cf-dkb-pp-jerk", "Push Press (no rebend / „double dip”)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Push Press (not rebent following the initial leg drive)"]
        ] }
      ]
    },
    "One-Arm Kettlebell Jerk": {
      "setup": [
        { "c": "kbj.rack", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (single kettlebell or pair; elbow down and close to your ribs)"],
          ["cf-dkb-pp-jerk", "The Rack (elbows directly over the hips; no space between arms and torso) (wariant: dwa kettlebelle)"],
          ["ace-385", "opis (bell on the chest near the shoulder, elbows close to the rib cage) (wariant: dwa kettlebelle, podrzut nożycowy)"]
        ] }
      ],
      "move": [
        { "c": "kbj.move", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 2–5 (dip, drive, lockout + re-bend under, stand up)"],
          ["df-kb-jerk", "Teaching Points 3, 6 (dip and drive overhead; dip under to catch, then stand tall)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Jerk (leg and hip drive; bend knees, hips and ankles to receive the load lower overhead)"],
          ["cf-dkb-pp-jerk", "Jerk (drop under the weight as you drive it overhead; then stand) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.wrist", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (vertical forearms and straight wrists)"],
          ["cf-dkb-pp-jerk", "The Rack (wrist straight or just slightly flexed — część wspólna: prosto) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbb.dip", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (dip straight down)"],
          ["cf-dkb-pp-jerk", "Jerk, krok 2 (dip slightly, torso upright) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbj.fullExt", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 3 (bells stay in the rack until hips and knees have fully extended)"],
          ["cf-dkb-pp-jerk", "Jerk (extend the hips completely before the second dip) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbj.lockFirst", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5 (full overhead lock out, re-bend to get under; then stand up)"],
          ["df-kb-jerk", "Teaching Point 6 (dip under to catch before extending the hips and standing tall)"],
          ["cf-dkb-pp-jerk", "Jerk („drop and lock”; then extend the knees) (wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbb.lower", "s": [
          ["df-kb-jerk", "Teaching Point 9 (absorb the impact when catching the kettlebell back into the rack)"],
          ["cf-dkb-pp-jerk", "Jerk, krok 6 → Push Press — lowering (absorb the impact by bending your knees) (wariant: dwa kettlebelle)"]
        ] }
      ],
      "mistakes": []
    },
    "Double Kettlebell Jerk": {
      "setup": [
        { "c": "kbj.rack", "s": [
          ["cf-dkb-pp-jerk", "The Rack (elbows directly over the hips; no space between arms and torso)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (pair of kettlebells; elbow close to the ribs)"],
          ["ace-385", "opis (elbows close to the rib cage) (wariant: podrzut nożycowy)"]
        ] }
      ],
      "move": [
        { "c": "kbj.move", "s": [
          ["cf-dkb-pp-jerk", "Jerk, kroki 1–5"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 2–5 (one arm or both)"],
          ["barbend-kb-jerk-vs-pp", "Kettlebell Jerk"],
          ["df-kb-jerk", "Teaching Points 3, 6 (single jerk, uwaga o double jerk) (wariant: jeden kettlebell)"]
        ] }
      ],
      "tips": [
        { "c": "kbb.wrist", "s": [
          ["cf-dkb-pp-jerk", "The Rack (straight or just slightly flexed)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 1 (straight wrists)"]
        ] },
        { "c": "kbb.dip", "s": [
          ["cf-dkb-pp-jerk", "Jerk, krok 2 (dip slightly, torso upright)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (dip straight down)"]
        ] },
        { "c": "kbj.fullExt", "s": [
          ["cf-dkb-pp-jerk", "Jerk (extend the hips completely before the second dip)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 3 (bells stay in the rack until hips and knees fully extend)"]
        ] },
        { "c": "kbj.lockFirst", "s": [
          ["cf-dkb-pp-jerk", "Jerk („drop and lock”; then extend the knees)"],
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5"],
          ["df-kb-jerk", "Teaching Point 6 (wariant: jeden kettlebell)"]
        ] },
        { "c": "kbb.lower", "s": [
          ["cf-dkb-pp-jerk", "Jerk, krok 6 → Push Press — lowering (absorb the impact by bending your knees)"],
          ["df-kb-jerk", "Teaching Point 9 (wariant: jeden kettlebell)"]
        ] }
      ],
      "mistakes": []
    },
    "One-Arm Kettlebell Clean and Jerk": {
      "setup": [
        { "c": "kbb.cleanSetup", "s": [
          ["onnit-kb-clean", "Step 1 (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["barbend-kb-clean", "Step 1: Get Set, With Square Hips (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"]
        ] }
      ],
      "move": [
        { "c": "kbcj.move", "s": [
          ["cf-dkb-pp-jerk", "Jerk, krok 1 (clean the bells from the floor to the rack), kroki 2–5 (jerk) (wariant: dwa kettlebelle)"],
          ["ace-385", "opis (bells from the floor to the rack; then the jerk) (wariant: dwa kettlebelle, podrzut nożycowy)"]
        ] },
        { "c": "kbb.cleanMove", "s": [
          ["sf-pak-clean", "Low Swing High Pull (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["onnit-kb-clean", "Step 2 (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["barbend-kb-clean", "Steps 2–4 (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"]
        ] }
      ],
      "tips": [
        { "c": "kbb.rack", "s": [
          ["onnit-kb-clean", "Step 2–3 (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["sf-pak-clean", "Elbow and Hand (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["barbend-kb-clean", "Step 4 (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"]
        ] },
        { "c": "kbb.dip", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, krok 2 (ta sama faza: podrzut)"],
          ["cf-dkb-pp-jerk", "Jerk, krok 2 (ta sama faza: podrzut; wariant: dwa kettlebelle)"]
        ] },
        { "c": "kbj.lockFirst", "s": [
          ["sf-go-ballistic-jerk", "kettlebell jerk, kroki 4–5 (ta sama faza: podrzut)"],
          ["df-kb-jerk", "Teaching Point 6 (ta sama faza: podrzut)"],
          ["cf-dkb-pp-jerk", "Jerk („drop and lock”) (ta sama faza: podrzut; wariant: dwa kettlebelle)"]
        ] }
      ],
      "mistakes": [
        { "c": "kbb.mis.cast", "s": [
          ["sf-pak-clean", "Common mistakes: casting the bell (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["barbend-kb-clean", "Common Mistakes: Casting the bell out (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"]
        ] },
        { "c": "kbb.mis.bang", "s": [
          ["onnit-kb-clean", "Step 2 (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["sf-pak-clean", "Common mistakes (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"]
        ] },
        { "c": "kbb.mis.armPull", "s": [
          ["sf-pak-clean", "Common mistakes: arms overpowering the legs (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"],
          ["barbend-kb-clean", "Common Mistakes: Curling the bell (ta sama faza: zarzut) — źródło z kb_ballistic-cz1.md"]
        ] }
      ]
    }
  }
}
```

Źródła `onnit-kb-clean`, `sf-pak-clean`, `barbend-kb-clean` i ich miejsca — z `kb_ballistic-cz1.md` (przeczytał tamten badacz; tu nie
czytane ponownie). Wszystkie trzy opisują zarzut jednorącz. Jeśli audytor nie przyjmie „tej samej fazy”, Clean and Jerk zostaje
z samym `kbcj.move` (status „częściowe”).

## 3. Nowe zdania

Istniejące zdania użyte bez zmian: `pp.legs` („Siła wybicia idzie z nóg i bioder — ręce kończą ruch.”) — tylko w wyciskaniu z
wybiciem. Z cz1 (nowe zdania tamtego badacza): `kbb.cleanSetup`, `kbb.cleanMove`, `kbb.rack`, `kbb.mis.cast`, `kbb.mis.bang`,
`kbb.mis.armPull` — tylko w Clean and Jerk.

| id | PL | EN (propozycja) |
|---|---|---|
| kbb.rackStart | Zacznij z kettlebellem w pozycji przy barku. | Start with the kettlebell racked at your shoulder. |
| kbj.rack | Kettlebell w pozycji przy barku, łokieć przy tułowiu. | Kettlebell racked at your shoulder, elbow tucked in to your body. |
| kbb.wrist | Nadgarstek trzymaj prosto. | Keep your wrist straight. |
| kbb.dip | Ugięcie nóg krótkie, tułów zostaje pionowo. | Keep the dip short and your torso upright. |
| kbpp.move | Krótko ugnij kolana, potem dynamicznie wyprostuj nogi i biodra i wypchnij ciężar nad głowę do pełnego wyprostu rąk. | Dip briefly at the knees, then drive hard through your legs and hips and push the weight overhead to full lockout. |
| kbpp.mis.rebend | Drugie ugięcie nóg pod ciężar — to już podrzut, nie wyciskanie z wybiciem. | Re-bending your knees under the weight — that turns it into a jerk, not a push press. |
| kbj.move | Krótko ugnij nogi i wybij ciężar w górę, od razu zejdź drugim ugięciem pod niego z prostymi rękami i wstań z ciężarem nad głową. | Dip and drive the weight up, drop straight into a second dip under it with locked arms, then stand up with it overhead. |
| kbj.fullExt | Najpierw do końca wyprostuj nogi i biodra, dopiero potem schodź pod ciężar. | Finish extending your legs and hips before you drop under the weight. |
| kbj.lockFirst | Zablokuj ciężar nad głową już w drugim ugięciu — dopiero potem wstań. | Lock the weight out overhead in the second dip — only then stand up. |
| kbb.lower | Opuść kettlebell z powrotem do pozycji przy barku i zamortyzuj go lekkim ugięciem kolan. | Drop the kettlebell back to the rack and absorb it with a slight bend of the knees. |
| kbcj.move | Zarzuć kettlebell z podłogi do pozycji przy barku, a potem podrzuć go nad głowę. | Clean the kettlebell from the floor to the rack, then jerk it overhead. |

Uwaga do `kbpp.move` / `kbj.move` w wersji jednorącz: słowo „rąk” — tłumacz/programista może dać wariant „ręki” dla ćwiczeń
jednorącz (osobne id, np. `kbpp.move1`), treść merytoryczna bez zmian.

Wycofane z pierwszej wersji (do „Otwarte”): `kbj.mis.hips`, `kbj.mis.arms`, `kbsj.move`; `kbb.rack` z tego pliku → `kbj.rack`.

## 4. Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| cf-dkb-pp-jerk | https://crossfit.com/essentials/double-kettlebell-push-press-and-jerk | CrossFit | 4 | The Rack, Push Press (dip, drive, lockout, opuszczanie), Jerk (kroki 1–6). Cytat: „There is no rebend, or "double dip," in the push press” (Push Press). |
| sf-go-ballistic-jerk | https://www.strongfirst.com/go-ballistic-the-jerk-for-barbell-and-kettlebell/ | StrongFirst | 4 | podrzut kettlebellem, kroki 1–5, uwaga o ugięciu. Cytat: „Dip straight down bending only at the knees while keeping the heels planted.” |
| ace-385 | https://www.acefitness.org/resources/everyone/exercise-library/385/push-jerk/ | ACE | 4 | opis (dwa kettlebelle, podrzut nożycowy, opuszczanie). Cytat: „Keep the back straight and bend the knees slightly to dip at the hips”. |
| barbend-kb-jerk-vs-pp | https://barbend.com/kettlebell-jerk-vs-push-press | BarBend | 4 | sekcje „Kettlebell Push Press”, „Kettlebell Jerk”. Cytat: „the knees, ankles, and hips are not rebent following the initial leg drive phases”. |
| df-dkb-pp | https://dangerouslyfit.com.au/kettlebell-exercise/double-kettlebell-push-press | Dangerously Fit Academy | 4 (graniczny (c)) | Teaching Points. Cytat: „Absorb the impact as you lower the kettlebells under control and pull them back into the 'racked' position”. |
| df-kb-jerk | https://www.dangerouslyfit.com.au/?p=16223 | Dangerously Fit Academy | 4 (graniczny (c)) | Teaching Points 1–9 (single jerk). Cytat: „Dip under the kettlebell to catch them before extending the hips and standing tall”. |
| nuffield-kb-clean-press | https://nuffieldhealth.com/article/how-to-kettlebell-clean-and-press | Nuffield Health | 5 — nie liczony | push press, split jerk; nie spełnia (a). |
| breakingmuscle-kb-jerk | https://breakingmuscle.com/how-to-master-the-kettlebell-jerk/ | Breaking Muscle | 5 — nie liczony | etapy podrzutu (z pierwszej sesji). |
| — | https://www.ikmf-world.com/rules/performance-exercises-rules | IKMF (federacja zawodów) | nie liczony | przepisy zawodów: fiksacja, „press-out”, brak drugiego ugięcia jako „no count”; strona nie wspomina o szkoleniu trenerów, bez daty — nie spełnia (a)/(b). Tylko trop. |
| — | https://www.motra.com/exercises/kettlebellPushPress | aplikacja treningowa | nie jest źródłem | pominięte (dokumentacja aplikacji). |
| — | https://ironedge.com.au/blog/kettlebell-jerk-technique-tips-from-the-ice-chamber/ | sklep | 5 | adres przekierowuje na stronę główną sklepu — brak treści. |

## 5. Otwarte

- **Błędy podrzutu (One-Arm / Double Kettlebell Jerk)** — brak zdania z 2 źródłami szczebla 4:
  - `kbj.mis.hips` („Pierwsze ugięcie jak do przysiadu — biodra uciekają w tył, a tułów leci w przód”): wprost jako błąd tylko
    StrongFirst. CrossFit, ACE i Dangerously Fit opisują ugięcie „w kolanach i biodrach” — na tym samym szczeblu częściowo sprzeczne
    z „tylko kolana” StrongFirst; część wspólna („krótko, tułów pionowo”) jest już w `kbb.dip`.
  - `kbj.mis.arms` („wypychanie rękami, zanim nogi i biodra skończą wybicie”): drugie źródło było Breaking Muscle (5). Zostało tylko
    w formie pozytywnej (`kbj.fullExt`).
  - „Dociskanie ciężaru rękami po wstaniu” (press-out) i „brak zatrzymania nad głową” — wprost jako błędy tylko w przepisach zawodów
    IKMF (nie liczone); blog RKC (503) i blog producenta kettlebelli (402) niedostępne. Do ponowienia.
  - „Odstęp między ramieniem a tułowiem w pozycji przy barku” — tylko CrossFit.
- **Krótkie zatrzymanie ciężaru nad głową (fiksacja)** — CrossFit („pause at the top position”); StrongFirst, ACE, Dangerously Fit,
  BarBend nie mówią o zatrzymaniu → jedno źródło.
- **Opuszczanie w podrzucie nożycowym** — ACE: „Slowly lower… by pulling the elbows down to the rib cage” (bez amortyzacji kolanami);
  inne źródła o podrzucie nożycowym kettlebellem brak → `kbb.lower` nie przypisany do Split Jerk.
- **One-Arm Kettlebell Split Jerk — całość:** po wykluczeniu Nuffield Health tylko ACE (dwa kettlebelle). Biblioteki z wyszukiwania
  to bazy aplikacji albo opisy podrzutu nożycowego ze sztangą (analogia). Proponowane wcześniej `kbsj.move` — do ponowienia
  z drugim źródłem szczebla 4. Do czasu potwierdzenia — nie pokazywać zestawu ogólnego „oly” jako wskazówek tego ćwiczenia.
- **`kbb.rack` z cz1 (przedramię pionowo, nadgarstek prosty, łokieć przy tułowiu) dla podrzutu** — w podrzucie przedramię pionowo
  potwierdza tylko StrongFirst; stąd krótsze `kbj.rack` + osobne `kbb.wrist`.
- **`kbb.wrist` — różnica źródeł:** StrongFirst „straight wrists”, CrossFit „straight or just slightly flexed”, ACE „wrists bent”
  (podrzut nożycowy). Wzięta część wspólna StrongFirst + CrossFit („prosto”); ACE odbiega — audytor może zdjąć zdanie.
  W wyciskaniu z wybiciem nadgarstek tylko CrossFit (+ Dangerously Fit o nadgarstku w wyproście nad głową, inna faza) → pominięte.
- **`kbb.dip` w wyciskaniu z wybiciem** — tylko CrossFit (Dangerously Fit nie opisuje ugięcia; Nuffield 5) → pominięte.
- **Pozycja przy barku z łokciem przy tułowiu w wyciskaniu z wybiciem** — tylko CrossFit; stąd ogólne `kbb.rackStart`.
- **Istniejące `pp.setup`, `pp.move`** — o sztandze, nie pasują. **`pp.dip`** („tułów napięty”) — źródła mówią „tułów pionowo”.
  Zestawy ogólne „pushPress”/„oly” — nie wpisywać zdań niepotwierdzonych dla wariantu kettlebell (krótsza karta).
- **Oddech** — StrongFirst (wydech z wybiciem i przy chwycie), Dangerously Fit (wdech przy wypchnięciu, wydech przy chwycie),
  CrossFit (wydech przy amortyzacji) — różne; brak 2 zgodnych prostych wskazówek.
- **Dangerously Fit — kryterium (c):** strona ćwiczenia linkuje do płatnego kursu; treść instruktażowa. Jeśli audytor uzna za
  marketing, odpadają: `kbb.rackStart` (push press → otwarte setup), `kbb.lower` (zostaje tylko CrossFit → otwarte); `pp.legs`,
  `kbpp.move`, `kbj.move`, `kbj.lockFirst` mają i tak ≥ 2 inne źródła.

## 6. Stan

Zrobione (02.11.2026, druga sesja): przegląd szczebli wszystkich źródeł (Breaking Muscle i Nuffield → 5, usunięte z danych; CrossFit
przeczytany ponownie, miejsca poprawione); nowe źródło Dangerously Fit (2 strony); opuszczanie (`kbb.lower`) potwierdzone dla push
pressu i podrzutu; nowa wskazówka `kbj.fullExt`; Clean and Jerk uzupełniony zdaniami zarzutu z cz1. Wynik: 3 gotowe (oba push press,
Clean and Jerk), 2 częściowe (oba podrzuty — brak błędu), 1 otwarte (Split Jerk). 11 zdań nowych tego pliku + `pp.legs` + 6 z cz1.
Zostało: błędy podrzutu (drugie źródło szczebla 4), fiksacja nad głową, cały Split Jerk (drugie źródło), decyzja audytora o
Dangerously Fit (c) i o „tej samej fazie” w Clean and Jerk.
Następny krok: ponowić blog RKC „The Kettlebell Jerk” (503) i blog producenta kettlebelli (402); szukać artykułów technicznych
o podrzucie kettlebellem w NSCA (artykuły/PDF) i u producentów kettlebelli.
Pułapki: ExRx/Wayback, RKC, kettlebellkings niedostępne; strony aplikacji w wynikach wyszukiwania nie są źródłem; ironedge to sklep;
przepisy zawodów (IKMF, IKO) nie są biblioteką trenerską; PDF IKO > 10 MB (narzędzie nie czyta); id `kbb.rack` zajęte przez cz1.
