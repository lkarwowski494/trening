# pushup_plank (cz. 1, pompki) — wskazówki techniki, fala W2 (badacz-merytoryczny, 02.11.2026)

Zasada: wyjątek dla wskazówek techniki z CLAUDE.md (2 niezależne źródła szczebla 4 albo jedno szczebla 3, żadne przeczytane nie przeczy).
Szczeble wg `docs/research/szczeble-organizacji-2026-11-02.md` (z uzupełnieniami 1–3) i rozstrzygnięć koordynatora 1.1 w przeliczeniu G5
(szczebel daje konkretna strona: autor z kwalifikacjami i data widoczne na stronie). Źródła W1 użyte ponownie z tym samym id
(`nasm-decline-push-up`, `trx-push-up` — miejsca jak w W1, plik `pushup_plank-cz1.md` gałęzi `badania/g5-pchanie`).
Nowe strony przeczytane przez WebFetch 02.11.2026. Strony aplikacji treningowych pominięte.

## Ćwiczenia

| Ćwiczenie | Rysunek v2 | Stan W2 | Uwagi |
|---|---|---|---|
| Decline Push Up | tak | **gotowe** (ustawienie + ruch + 1 błąd) | nowa karta; drugie źródło szczebla 4: Fitness Volt, autor z certyfikatem ACE i datą |
| Suspended Push-Up | tak (taśmy przy dłoniach, tułów pod skosem) | **gotowe** (ustawienie + ruch + 2 błędy) | nowa karta; drugie źródło szczebla 4: Fitness Volt („Suspension Chest Press”, ten sam autor z certyfikatem ACE); `spush.setup` przeredagowane (bez szerokości dłoni — FV jej nie podaje) |
| Push-Up Wide | tak | otwarte | tylko 1 źródło szczebla 4 (Fitness Volt, P. Dale, PT); Healthline — 5 (W1) |
| Close-Grip Push-Up | tak | otwarte | znaleziony artykuł Fitness Volt ma autora „Dr. Malik” → 5 (jak w W1); brak źródła szczebla 4 |
| Incline Push-Up Close-Grip | tak | otwarte | bez nowych źródeł (jak W1) |
| Single-Arm Push-Up | tak | otwarte | wyszukiwanie dało tylko blogi sprzedawców i strony aplikacji (szczebel 5 / wykluczone) |
| Incline Push-Up Reverse Grip | nie | otwarte | nie badane ponownie (brak rysunku; W1 bez źródeł) |
| Push Up to Side Plank | nie | otwarte | strony The Prehab Guys z biblioteki (bez autora) = 5; brak strony ACE/NASM dla wariantu |
| Push-Ups With Feet On A Stability Ball | nie | otwarte | strona NASM `stability-ball-push-up` — 404 |
| Clock Push-Up | nie | otwarte | dwie interpretacje — niżej |
| Isometric Wipers | nie | otwarte | nie badane ponownie (brak rysunku; W1: oba źródła szczebla 5) |

### Clock Push-Up — dwie interpretacje (do decyzji definicji w katalogu, nie badacza)
1. **Pompka z dotknięciem „tarczy zegara”**: po każdej pompce jedna ręka sięga do podłogi kolejno w punkty 12, 3, 6, 9 (opis z W1: Physitrack „Push-up on clock face”, szczebel 5).
2. **Pompka „w koło”**: między pompkami obie dłonie (albo dłonie i stopy) przestawiają się po okręgu, ciało obraca się wokół osi (opisy ze stron aplikacji — nie są źródłem).
Bez ustalonej definicji ćwiczenia w katalogu nie szukam źródeł techniki — każda karta mogłaby opisać inne ćwiczenie niż nazwa w aplikacji.

## Blok do wdrożenia

### Blok do wdrożenia

```json
{
 "Decline Push Up": {
  "setup": [
   {"c": "dpush.setup", "s": [["nasm-decline-push-up", "Step 1; Step 2"], ["fv-decline-push-up", "How-to: „place your feet up onto your chosen platform”; „With your body in a straight line”"], ["prehab-pushup-variations", "Progressions → Decline Push Up („The biggest focus for this exercise needs to be on body alignment.”)"]]}
  ],
  "move": [
   {"c": "push.move", "s": [["nasm-decline-push-up", "Step 3; Step 4"], ["fv-decline-push-up", "How-to: „Lower yourself as far down as you can and then press yourself back up until arms are extended.”"]]}
  ],
  "tips": [
   {"c": "plank.brace", "s": [["nasm-decline-push-up", "Step 2 (engage your core)"], ["fv-decline-push-up", "How-to: „tense your core to maintain a rigid torso”"]]}
  ],
  "mistakes": [
   {"c": "push.mis.sag", "s": [["nasm-decline-push-up", "Common Mistakes (Allowing hips to sag)"], ["fv-decline-push-up", "zaprzeczenie standardu: „With your body in a straight line and butt lifted”"], ["wniosek", "dpush.setup"]]}
  ]
 },
 "Suspended Push-Up": {
  "setup": [
   {"c": "spush.setup", "s": [["trx-push-up", "Step 3–6"], ["fv-suspension-chest-press", "Step 3 („Keep your arms fully extended and lean your weight forward onto the straps”)"]]}
  ],
  "move": [
   {"c": "spush.move", "s": [["trx-push-up", "Step 7–9"], ["fv-suspension-chest-press", "Step 5; Step 6"]]}
  ],
  "tips": [
   {"c": "plank.brace", "s": [["trx-push-up", "Form Cues"], ["fv-suspension-chest-press", "Step 3 („Tighten your core muscles, glutes, and quadriceps”)"]]}
  ],
  "mistakes": [
   {"c": "push.mis.sag", "s": [["fv-suspension-chest-press", "Common Mistakes („Sinking hips”)"], ["wniosek", "spush.setup"]]},
   {"c": "push.mis.flare", "s": [["fv-suspension-chest-press", "Pro tip („Avoid flaring your elbows too wide”)"], ["trx-push-up", "zaprzeczenie standardu: Form Cues (łokcie ok. 45° do tułowia)"]]}
  ]
 }
}
```

Uwagi do bloku:
- `push.mis.sag` (zamiast istniejącego `plank.mis.sag`): `plank.mis.sag` dokłada „wygięte w łuk lędźwie” — przy Decline wprost tylko FV („Do not arch [or] round your back”), NASM mówi o biodrach; przy Suspended lędźwi nie wymienia żadne źródło. Dlatego zdanie tylko o biodrach.
- `push.rigid` celowo pominięte: część „nie unoszą się” nie ma drugiego źródła w żadnym z dwóch ćwiczeń (FV mówi o sztywnym tułowiu i opadających biodrach).
- `push.elbows45` jako wskazówka — pominięte: 45° podaje tylko NASM (Decline) i tylko TRX (Suspended); FV nie podaje kąta. `push.mis.flare` przy Decline — tylko NASM (Healthline = 5) → otwarte.
- Wnioskowane błędy: 2 (`push.mis.sag` ← `dpush.setup`; `push.mis.sag` ← `spush.setup`), oba mają też źródło wprost; widać je na rysunku (linia ciała).
- Brak kart częściowych z W1 w tej części (W1: wszystkie 11 otwarte) — brak wpisów „tylko mistakes”.

## Nowe zdania (id | PL | EN)

| id | PL | EN | uwaga |
|---|---|---|---|
| dpush.setup | Dłonie na podłodze, stopy na ławce albo stopniu; ciało proste od głowy do pięt. | Hands on the floor, feet on a bench or step; body straight from head to heels. | propozycja W1, bez zmian |
| spush.setup | Chwyć uchwyty taśm, ręce wyprostowane przed sobą; pochyl się do przodu, ciało proste i pod skosem. | Hold the strap handles with straight arms in front of you; lean forward with your body straight and at an angle. | przeredagowane względem W1 (bez „na szerokość barków” — FV nie podaje szerokości) |
| spush.move | Opuść klatkę w stronę uchwytów, zginając łokcie; wypchnij się z powrotem do wyprostu rąk. | Lower your chest toward the handles by bending your elbows; push back up until your arms are straight. | propozycja W1, bez zmian |
| push.mis.sag | Biodra opadają — ciało przestaje być proste. | Hips sagging — the body stops being straight. | propozycja W1, bez zmian |
| push.mis.flare | Łokcie rozjeżdżają się szeroko na boki. | Elbows flaring wide to the sides. | propozycja W1, bez zmian |

Istniejące zdania użyte dosłownie: `push.move`, `plank.brace` (lib/cues/text/pl.json). `push.move` mówi „prawie do podłogi” — przy Decline zgodne z NASM Step 3 i FV („as far down as you can”).

## Źródła (id | adres | organizacja | szczebel z uzasadnieniem | miejsce)

| id | adres | organizacja | szczebel | miejsce |
|---|---|---|---|---|
| nasm-decline-push-up | https://www.nasm.org/resource-center/exercise-library/decline-push-up | NASM (organizacja certyfikująca trenerów; treść firmowana) | 4 (W1) | Step 1–4; Common Mistakes |
| trx-push-up | https://www.trxtraining.com/blogs/news/trx-push-up | TRX — producent taśm, dokumentacja własnego rodzaju sprzętu; autor „Tristan Z.”, 26.11.2023 | 4 (W1) | Step 3–9; Form Cues |
| fv-decline-push-up | https://fitnessvolt.com/?p=75039 („Decline Push-Up: Target Your Chest, Triceps, and Core!”) | Fitness Volt; autor Matthew Magnante, w podpisie „ACE certified fitness professional”; publ. 10.11.2020, akt. 11.08.2024; bez recenzenta | 4 warunkowo — wiersz Fitness Volt w pliku szczebli: autor z kwalifikacjami w podpisie i data (recenzent „najlepiej”, nie wymagany) | How-to (kroki 1–4); „Decline Push-Up Tips” |
| fv-suspension-chest-press | https://fitnessvolt.com/suspension-chest-press/ | Fitness Volt; autor Matthew Magnante (ACE); publ. 14.10.2023, akt. 11.08.2024; bez recenzenta | 4 warunkowo (j.w.) | Steps 1–6; Pro Tips; Common Mistakes |
| prehab-pushup-variations | https://theprehabguys.com/push-up-exercise-variations/ | The Prehab Guys — artykuł z autorem: Ryan Nosak MS, CSCS; publ. 03.10.2022, akt. 24.07.2025 | 4 warunkowo (uzup. 2: liczy się artykuł z autorem z kwalifikacjami) | Progressions → Decline Push Up |
| fv-wide-push-ups | https://fitnessvolt.com/?p=236595 („Wide Push-Ups: …”) | Fitness Volt; autor Patrick Dale, „PT, ex-Marine”, Training Editor; recenzent „Dr. Malik”; publ. 20.01.2024 | 4 warunkowo (autor z kwalifikacją trenera w podpisie, data) | „Wide Push-Ups Correct Form”; Tips — **nieużyte w bloku** (brak drugiego źródła) |
| healthline-decline-push-up | https://www.healthline.com/health/decline-push-up | Healthline; autorka K. Nunez bez podanych kwalifikacji; recenzent G. Minnis, DPT; akt. 13.10.2026 | 5 (spójnie z W1/uzup. 3: autor bez kwalifikacji) | Step 1–3; Tips — nieużyte, tylko wskazówka (łokcie 45°, nie rozkładać łokci) |
| fv-close-grip-push-up | https://fitnessvolt.com/close-grip-push-up-triceps-chest | Fitness Volt; „Dr. Malik”, MD; 22.04.2019 / 11.08.2024 | 5 (jak `fitnessvolt-isometric-wiper` w W1) | How-to; Tips — nieużyte |
| hk-cissik-dawes-suspension | https://us.humankinetics.com/blogs/excerpt/suspension-training | Human Kinetics — fragment książki J. Cissik, J. Dawes „Maximum Interval Training” | [OTWARTE] — strona nie podaje wydania ani kwalifikacji autorów; szczebel 3 wymaga potwierdzenia autora | „Suspension Chest Press” — nieużyte (zgodne z kartą: opuszczanie w stronę uchwytów, powrót do wyprostu) |

Nazwy marek i organizacji tylko w rejestrze źródeł — nie w tekstach aplikacji.

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Decline Push Up — `push.mis.flare`, `push.elbows45` | tylko NASM (Common Mistakes; Step 3); Healthline (5) się zgadza, FV nie mówi o łokciach |
| Decline Push Up — `plank.mis.sag` (z lędźwiami w łuk) | lędźwie wprost tylko FV; wybrano `push.mis.sag` |
| Decline Push Up — szerokość dłoni | NASM „trochę szerzej niż barki”, FV „shoulder-width” i „vary your hand width” — część wspólna „na szerokość barków lub trochę szerzej” (= `push.setup`) możliwa, ale FV wprost dopuszcza dowolną szerokość; nie dodano |
| Suspended Push-Up — `push.rigid`, `push.elbows45`, szerokość dłoni | po jednym źródle (TRX); FV: „straps on the outside or inside of your arms” bez szerokości |
| Suspended Push-Up — zbyt szybkie opuszczanie jako błąd | tylko FV, i uzasadnione twierdzeniem o zdrowiu (zerwanie mięśnia) — poza zakresem |
| Push-Up Wide — `wpush.setup`, `wpush.move` | FV (P. Dale) zgadza się z oboma („1 ½ shoulder-widths apart”; „upper arms … angled out”; „arms are straight but not locked”), ale to jedno źródło szczebla 4; brak strony NASM (404) i ACE dla wariantu |
| Close-Grip Push-Up | jedyne nowe źródło (FV, „Dr. Malik”) = 5; StrengthLog to aplikacja (wykluczone); Men's Health — nie liczy się |
| Single-Arm Push-Up, Push Up to Side Plank, Feet On Stability Ball, Incline Close-Grip, Incline Reverse Grip, Isometric Wipers | bez źródła szczebla 4 (szczegóły W1 + tabela wyżej) |
| Clock Push-Up | najpierw definicja ćwiczenia w katalogu (dwie interpretacje wyżej) |
| Zestaw ogólny `push.mis.partial` przy Decline | NASM Step 4 radzi nie blokować łokci, FV „until arms are extended”; „bez wyprostu na górze” nie stoi w sprzeczności, ale żadne z dwóch źródeł nie podaje skracania ruchu jako błędu — nie wpisane (uwaga W1 aktualna) |

## Zostało (następny krok, pułapki)

- Push-Up Wide: drugie źródło szczebla 4 (próby: BarBend artykuł z autorem, ISSA blog, NFPT) — FV już jest.
- Close-Grip Push-Up: źródło szczebla 4 (FV z autorem z kwalifikacjami innym niż „Dr. Malik”, BarBend, ISSA).
- Human Kinetics (Cissik, Dawes): potwierdzić kwalifikacje autorów i wydanie — dałoby szczebel 3 dla Suspended Push-Up.
- Pułapki: PDF JMU (kinezjologia, „Push ups station cards”) — 503; nasm.org `wide-push-up`, `stability-ball-push-up` — 404; library.theprehabguys.com przekierowuje na theprehabguys.com.

## Podsumowanie

Ćwiczeń: 11 (zbadanych w W2: 8; 3 bez rysunku pominięte jako bez nowych tropów). Nowe karty z błędami: 2 (Decline Push Up, Suspended Push-Up);
bez błędów: 0; częściowe z W1: 0. Błędy wnioskowane: 2 (oba mają też źródło wprost). Otwarte: 9 ćwiczeń. Nowe zdania: 5 (`dpush.setup`, `spush.setup` — przeredagowane, `spush.move`, `push.mis.sag`, `push.mis.flare`; wszystkie z propozycji W1).
Role mięśni: plik `docs/research/role-miesni-fala-w2/pushup_plank-cz1.md`.
