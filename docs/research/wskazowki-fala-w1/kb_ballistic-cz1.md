# Wskazówki techniki — rodzina kb_ballistic (balistyka odważnikiem/hantlem), część 1

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W1, G3).
Zakres: zbieranie danych (polecenie właściciela 02.11.2026) — nic nie trafia do `lib/` ani `data/zrodla/*.json` bez wdrożenia.
Zasady: CLAUDE.md „Merytoryczne podstawy”, „Wyjątek dla wskazówek techniki” (2 niezależne przeczytane źródła szczebla 4).
Teksty zdań bez nazw źródeł i organizacji.

Dostęp do źródeł w tej sesji: exrx.net — 403, web.archive.org — zablokowany; NSCA Kinetic Select „One-Arm Dumbbell Snatch” — 403 (oba adresy);
blog producenta kettlebelli (kettlebellkings.com) — 402; blog RKC (rkcblog.dragondoor.com) — 503; NFPT — 503/404;
IDEA (PDF) — 404; StrongFirst „The Kur…” i `?p=111605` — przekierowanie 307 bez treści. Te strony nie są źródłami w tym pliku.
Strony innych aplikacji treningowych z wyników wyszukiwania pominięto (nie są źródłem, nazwy nie trafiają do repo).

## (1) Ćwiczenia

| Klucz | Status | Uwagi |
|---|---|---|
| Kettlebell Clean | gotowe | move + 2 wskazówki + 2 błędy; setup [OTWARTE] (jedno źródło) |
| Kettlebell Snatch | gotowe | setup, move, 4 wskazówki, 2 błędy |
| One-Arm Kettlebell Swings | otwarte | brak drugiego przeczytanego źródła o wariancie jednorącz (patrz „Otwarte”) |
| Snatch (hantel) | otwarte | jedyne znalezione źródło organizacji (NSCA) — 403 |
| Dumbbell Clean | otwarte | nie znaleziono 2 przeczytanych źródeł |
| Double Kettlebell Clean | otwarte | patrz „Otwarte” |
| Double Kettlebell Snatch | otwarte | patrz „Otwarte” |
| Kettlebell Sumo High Pull | otwarte | patrz „Otwarte” |
| Bottoms-Up Clean From The Hang Position | otwarte | patrz „Otwarte” |
| Kettlebell Pirate Ships | otwarte | patrz „Otwarte” |

## (2) Dane

```json
{
 "sources": {
  "sf-lions-roar-snatch": {"org": "StrongFirst", "title": "Lion's Roar Kettlebell Snatch (P. Macek)", "url": "https://www.strongfirst.com/lions-roar-kettlebell-snatch/", "level": 4},
  "sf-tsar-snatch": {"org": "StrongFirst", "title": "The Snatch: The Tsar of Kettlebell Lifts", "url": "https://www.strongfirst.com/the-snatch-the-tsar-of-kettlebell-lifts/", "level": 4},
  "sf-pak-clean": {"org": "StrongFirst", "title": "An Olympic Weightlifting Approach to Coaching the Kettlebell Clean (J. Pak, 2015)", "url": "https://www.strongfirst.com/an-olympic-weightlifting-approach-to-coaching-the-kettlebell-clean/", "level": 4},
  "onnit-kb-clean": {"org": "Onnit", "title": "One Arm Kettlebell Clean", "url": "https://www.onnit.com/academy/one-arm-kettlebell-clean", "level": 4},
  "onnit-kb-snatch": {"org": "Onnit", "title": "Kettlebell Snatch", "url": "https://onnit.com/academy/kettlebell-snatch", "level": 4},
  "bm-read-clean": {"org": "Breaking Muscle", "title": "How to Do the Perfect Kettlebell Clean (A. Read, Master RKC)", "url": "https://breakingmuscle.com/how-to-do-the-perfect-kettlebell-clean/", "level": 4},
  "bm-read-snatch": {"org": "Breaking Muscle", "title": "How to Do the Perfect Kettlebell Snatch (A. Read, Master RKC)", "url": "https://breakingmuscle.com/how-to-do-the-perfect-kettlebell-snatch/", "level": 4},
  "ace-press-8250-snatch": {"org": "ACE", "title": "How to Do the Kettlebell Snatch… (przedruk artykułu magazynu; trener z certyfikatem ACE)", "url": "https://www.acefitness.org/about-ace/press-room/in-the-news/8250/how-to-do-the-kettlebell-snatch-to-feel-totally-powerful-shape/", "level": 4},
  "weck-one-arm-kb": {"org": "WECKMETHOD", "title": "Functional Strength Training: 8 One-Arm Kettlebell Exercises (C. Manganiello)", "url": "https://www.weckmethod.com/articles/functional-strength-training-8-one-arm-kettlebell-exercises", "level": 4}
 },
 "orgs": {
  "StrongFirst": {"name": "StrongFirst — artykuły instruktorów szkoły kettlebell (strongfirst.com)", "level": 4, "kind": "org"},
  "Onnit": {"name": "Onnit Academy — biblioteka ćwiczeń producenta kettlebelli (onnit.com/academy)", "level": 4, "kind": "maker"},
  "Breaking Muscle": {"name": "Breaking Muscle — serwis specjalistyczny (artykuły trenerów z certyfikatem)", "level": 4, "kind": "site"},
  "WECKMETHOD": {"name": "WECKMETHOD — artykuły producenta sprzętu treningowego (weckmethod.com)", "level": 4, "kind": "maker"}
 },
 "exercises": {
  "Kettlebell Clean": {
   "setup": [],
   "move": [
    {"c": "kbb.cleanMove", "s": [
     ["bm-read-clean", "Core Principle; Reversing the Drop (swing the bell hard as if doing swings and guide the bell into place in the rack)"],
     ["sf-pak-clean", "Low Swing High Pull; core idea (clean = swing redirected vertically into the front rack)"],
     ["onnit-kb-clean", "Step 2 (row elbow back, extend hips and knees, bell wraps around the wrist)"]
    ]}
   ],
   "tips": [
    {"c": "kbb.rack", "s": [
     ["bm-read-clean", "Rack Position (elbow tucked against your side; forearm mostly vertical; wrist straight)"],
     ["onnit-kb-clean", "Step 2–3 (forearm vertical; wrist straight and aligned with your forearm)"],
     ["sf-pak-clean", "Elbow and Hand (elbow attached to the rib cage)"]
    ]},
    {"c": "kb.hips", "s": [
     ["bm-read-clean", "Reversing the Drop (hips do the work, the arm stays loose)"],
     ["sf-pak-clean", "Low Swing High Pull (arms assist the leg drive rather than overpowering it)"]
    ]}
   ],
   "mistakes": [
    {"c": "kbb.mis.bang", "s": [
     ["onnit-kb-clean", "Step 2 (clean WITHOUT banging the weight against your wrist)"],
     ["sf-pak-clean", "Common mistakes: casting the bell → violent jerk into the rack, excessive impact at the top"]
    ]},
    {"c": "kbb.mis.armPull", "s": [
     ["bm-read-clean", "Drill Progression (do not yank the bell with the arm)"],
     ["sf-pak-clean", "Common mistakes: arms overpowering the legs"]
    ]}
   ]
  },
  "Kettlebell Snatch": {
   "setup": [
    {"c": "kbb.snatchSetup", "s": [
     ["ace-press-8250-snatch", "krok A (feet shoulder-width apart; bell about a foot in front of the toes; hinge; grip with one hand)"],
     ["sf-tsar-snatch", "streszczenie na początku (start with a kettlebell on the ground in front of you)"],
     ["onnit-kb-snatch", "Step 1 (feet between hip and shoulder-width) i Common Mistakes (avoid rounding your back to pick up the kettlebell)"]
    ]}
   ],
   "move": [
    {"c": "kbb.snatchMove", "s": [
     ["ace-press-8250-snatch", "kroki B–F (hike between the thighs, drive hips, bell rises, punch, lockout)"],
     ["sf-tsar-snatch", "streszczenie na początku (swing it back between your legs … overhead lockout in one uninterrupted motion)"],
     ["onnit-kb-snatch", "Step 4–5 (hike between the legs, snap hips, punch fist to the ceiling)"]
    ]}
   ],
   "tips": [
    {"c": "kb.hips", "s": [
     ["sf-lions-roar-snatch", "lista „eightfold path”, punkt 2 (Generating the force from your legs and hips)"],
     ["onnit-kb-snatch", "Common Mistakes: Using grip and shoulders to lift (not the primary movers)"],
     ["bm-read-snatch", "Hips (power comes from the hip hinge)"]
    ]},
    {"c": "kbb.close", "s": [
     ["sf-lions-roar-snatch", "lista „eightfold path”, punkt 3 (Keeping the bell close to your body—both on the way up and on the way down)"],
     ["bm-read-snatch", "Bell Close to the Body (tighter arc than the swing)"]
    ]},
    {"c": "kbb.punch", "s": [
     ["sf-lions-roar-snatch", "lista „eightfold path” (Fast spear through the handle at about your eyes level)"],
     ["onnit-kb-snatch", "Step 5 (punch your fist straight to the ceiling)"],
     ["bm-read-snatch", "Hand Punch-Through (punch your hand through the handle of the bell)"],
     ["ace-press-8250-snatch", "krok E (punch the bell upward)"]
    ]},
    {"c": "kbb.lockout", "s": [
     ["ace-press-8250-snatch", "krok F (arm straight overhead)"],
     ["onnit-kb-snatch", "Step 2 (locking out your elbow)"],
     ["bm-read-snatch", "Lockout Overhead (vertical lockout with a straight wrist)"]
    ]}
   ],
   "mistakes": [
    {"c": "kbb.mis.bang", "s": [
     ["onnit-kb-snatch", "Common Mistakes: Letting the bell hit your forearm"],
     ["bm-read-snatch", "Common Mistake: Forearm Strikes (smash into your forearm)"],
     ["sf-lions-roar-snatch", "spear through the handle — to avoid banging the forearm"]
    ]},
    {"c": "kbb.mis.armPull", "s": [
     ["onnit-kb-snatch", "Common Mistakes: Using grip and shoulders to lift"],
     ["sf-lions-roar-snatch", "punkt 2 (force from legs and hips)"]
    ]}
   ]
  }
 }
}
```

Uwaga do wdrożenia: `kb.hips` użyte słowo w słowo z istniejącego `lib/cues/text/pl.json` („Siła idzie z bioder, nie z barków — ręce tylko prowadzą kettlebell.”) — pasuje do clean i snatch.
`kb.setup` i `kb.move` NIE pasują (chwyt oburącz; kettlebell tylko „unosi się przed tobą”) — nie użyte. Zdania `oly.*` (sztanga) nie pasują do kettlebella.

## (3) Nowe zdania

| id | PL | EN (propozycja) |
|---|---|---|
| kbb.cleanMove | Zrób zamach jak przy swingu, ale prowadź kettlebell blisko ciała i zakończ ruch z kettlebellem w pozycji rack przy klatce. | Swing it like a swing, but keep the bell close and finish with it in the rack at your chest. |
| kbb.rack | W pozycji rack łokieć przy tułowiu, przedramię pionowo, nadgarstek prosty. | In the rack: elbow against your side, forearm vertical, wrist straight. |
| kbb.snatchSetup | Postaw kettlebell trochę przed stopami, stopy na szerokość bioder–barków; cofnij biodra z prostymi plecami i chwyć uchwyt jedną ręką. | Set the bell a little in front of your feet, feet hip- to shoulder-width; push your hips back with a flat back and grab the handle with one hand. |
| kbb.snatchMove | Przerzuć kettlebell między nogami, mocno wypchnij biodra i jednym płynnym ruchem doprowadź go nad głowę na prostą rękę. | Hike the bell between your legs, drive your hips hard and take it overhead to a straight arm in one smooth move. |
| kbb.close | Prowadź kettlebell blisko ciała — w górę i w dół. | Keep the bell close to your body, on the way up and on the way down. |
| kbb.punch | Gdy kettlebell mija twarz, wsuń dłoń w uchwyt i wypchnij pięść w sufit. | As the bell passes your face, slide your hand through the handle and punch your fist to the ceiling. |
| kbb.lockout | Na górze zablokuj łokieć — ręka prosta nad głową. | At the top, lock your elbow — arm straight overhead. |
| kbb.mis.bang | Kettlebell z impetem uderza w przedramię. | The bell slams into your forearm. |
| kbb.mis.armPull | Ciągniesz kettlebell ręką zamiast wypchnąć go biodrami. | Pulling the bell with your arm instead of driving it with your hips. |

Uwaga do `kbb.punch`: wysokość („na wysokości oczu”) podaje wprost jedno źródło (StrongFirst); pozostałe mówią o wypchnięciu pięści/dłoni przez uchwyt bez wysokości.
Jeśli recenzja uzna to za za mało — wersja bez wysokości: „Wsuń dłoń w uchwyt i wypchnij pięść w sufit.”

## (4) Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| sf-lions-roar-snatch | https://www.strongfirst.com/lions-roar-kettlebell-snatch/ | StrongFirst | 4 | lista „eightfold path” (hinge, siła z nóg i bioder, blisko ciała, spear at eyes level, uderzenie w przedramię, zejście) |
| sf-tsar-snatch | https://www.strongfirst.com/the-snatch-the-tsar-of-kettlebell-lifts/ | StrongFirst | 4 | streszczenie ruchu na początku artykułu |
| sf-pak-clean | https://www.strongfirst.com/an-olympic-weightlifting-approach-to-coaching-the-kettlebell-clean/ | StrongFirst | 4 | progresja (Tall Muscle Clean, Low Swing, Low Swing High Pull, Spear), błędy (casting, impact, arms overpowering legs) |
| onnit-kb-clean | https://www.onnit.com/academy/one-arm-kettlebell-clean | Onnit (producent) | 4 | kroki 1–4 |
| onnit-kb-snatch | https://onnit.com/academy/kettlebell-snatch | Onnit (producent) | 4 | kroki 1–5, „Common Mistakes” |
| bm-read-clean | https://breakingmuscle.com/how-to-do-the-perfect-kettlebell-clean/ | Breaking Muscle | 4 | rack, drop, reversing the drop, drill progression |
| bm-read-snatch | https://breakingmuscle.com/how-to-do-the-perfect-kettlebell-snatch/ | Breaking Muscle | 4 | hike, hips, bell close, punch-through, lockout, forearm strikes |
| ace-press-8250-snatch | https://www.acefitness.org/about-ace/press-room/in-the-news/8250/how-to-do-the-kettlebell-snatch-to-feel-totally-powerful-shape/ | ACE (przedruk artykułu magazynu) | 4 (PROPOZYCJA) | kroki A–G |
| weck-one-arm-kb | https://www.weckmethod.com/articles/functional-strength-training-8-one-arm-kettlebell-exercises | WECKMETHOD (producent) | 4 | One-Arm Kettlebell Swing; One-Arm Kettlebell Snatch |

Niezależność: StrongFirst (szkoła instruktorów), Onnit (producent), Breaking Muscle (autor — instruktor innej szkoły kettlebell), ACE (przedruk) — różne organizacje.
Dwa źródła StrongFirst przy jednym zdaniu liczone jako jedno.

## (5) Otwarte

- **Kettlebell Clean — setup:** ustawienie startowe (kettlebell na ziemi przed stopami, stopy między szerokością bioder a barków) podaje wprost tylko Onnit (krok 1); StrongFirst (Pak) i Breaking Muscle go nie opisują → jedno źródło, poza danymi.
- **Kettlebell Snatch — „nie zginaj bioder za wcześnie przy opuszczaniu”:** tylko StrongFirst (Lion's Roar) → jedno źródło.
- **ACE „press room” 8250:** przedruk artykułu magazynu (wypowiedź trenera z certyfikatem ACE), nie biblioteka ćwiczeń ACE — do decyzji recenzenta, czy liczy się jako szczebel 4. W snatch każde zdanie ma i tak ≥ 2 inne źródła poza nim (w `kbb.snatchSetup` zostają StrongFirst + Onnit; w `kbb.lockout` — Onnit + Breaking Muscle).
- **`kbb.mis.armPull` w snatch:** Onnit mówi to wprost jako błąd; StrongFirst (Lion's Roar) — jako zasadę „siła z nóg i bioder” (odwrotność błędu). Jeśli recenzja wymaga obu źródeł wprost jako błędu — przenieść tutaj (snatch zostaje „gotowe” dzięki `kbb.mis.bang`).
- **One-Arm Kettlebell Swings:** zestaw ogólny (`kb.move`, `kb.hips`, `hinge.back`, `mis.roundBack`) ma źródła dla swingu oburącz (ACE 391, ExRx) — dla wariantu jednorącz przeczytano tylko WECKMETHOD (start oburącz, wolna ręka naśladuje rękę pracującą, barki równo, bez skrętu tułowia). Drugiego źródła o wariancie jednorącz nie udało się przeczytać (NFPT 503, StrongFirst 307, pozostałe wyniki — strony aplikacji). Zgodnie z uzupełnieniem koordynatora — zdań z zestawu ogólnego nie przenoszę bez źródła dla wariantu.
- **Snatch (hantel):** NSCA Kinetic Select „One-Arm Dumbbell Snatch” (fragment książki NSCA) — 403 pod oboma adresami. Zdań kettlebellowych nie przenoszę na hantel (`kbb.punch`, `kbb.mis.bang` opisują przewinięcie odważnika przez dłoń — nie dotyczy hantla).
- **Dumbbell Clean:** brak przeczytanych źródeł; kandydaci: fragmenty książek NSCA (Kinetic Select, Human Kinetics), Catalyst Athletics (wcześniej 503).
- **Double Kettlebell Clean / Double Kettlebell Snatch:** kandydat StrongFirst „Improve the Double Kettlebell Snatch With Chains” (https://www.strongfirst.com/improve-your-double-kettlebell-snatch/) — nieprzeczytany; Onnit „Kettlebell Snatch” wspomina tylko opuszczanie dwóch odważników do rack (jedno źródło). Zdań z wersji jednorącz nie przenoszę bez źródła o wersji z dwoma odważnikami.
- **Kettlebell Sumo High Pull:** StrongFirst (Pak) opisuje „Low Swing High Pull” (łokcie ok. 90°, ręce tylko pomagają nogom) — inny ruch niż sumo high pull z szerokiego rozstawu; zestaw ogólny (`sumo.kneesOut`, `hinge.back`, `oly.close`, `mis.roundBack`) bez przeczytanego źródła o tym wariancie.
- **Bottoms-Up Clean From The Hang Position, Kettlebell Pirate Ships:** brak przeczytanych źródeł szczebla 4 (wyniki wyszukiwania — strony aplikacji i serwisy bez autora). Pirate Ships ma dziś `b: open`.

## (6) Stan

Zrobione (02.11.2026): Kettlebell Clean, Kettlebell Snatch (źródła przeczytane, zdania, dane w bloku JSON); próby dla One-Arm Kettlebell Swings i Snatch (hantel) opisane w „Otwarte”.

Zostało: One-Arm Kettlebell Swings (drugie źródło o wariancie jednorącz), Snatch (hantel), Dumbbell Clean, Double Kettlebell Clean, Double Kettlebell Snatch,
Kettlebell Sumo High Pull, Bottoms-Up Clean From The Hang Position, Kettlebell Pirate Ships.

Następny krok: przeczytać StrongFirst „Improve the Double Kettlebell Snatch With Chains”; poszukać źródeł o hantlu (fragmenty książek NSCA w Human Kinetics, strony uczelnianych centrów sportu, producenci sprzętu);
dla swingu jednorącz spróbować innego adresu NFPT albo materiałów uczelnianych.

Pułapki: exrx.net 403 i web.archive.org zablokowane; nsca.com/…/kinetic-select 403; kettlebellkings.com 402; rkcblog.dragondoor.com 503; strongfirst.com — adresy `?p=` dają 307 (używać pełnego adresu z nazwą artykułu).
Wyszukiwarka zwraca głównie strony aplikacji treningowych — nie są źródłem.
