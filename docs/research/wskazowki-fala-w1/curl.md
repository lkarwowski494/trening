**Koordynator linii 1.1, 02.11.2026:** jedno ze źródeł użytych przez badacza to dokumentacja innej aplikacji treningowej — odrzucone (dokumentacja konkurencyjnej aplikacji nie jest przyjmowana jako źródło wskazówek: wpis źródła trafiłby do rejestru `data/zrodla/cues.json`, który obejmuje lista `tests/forbidden-names.json` (pole scope), a materiały konkurencji trzymamy na Dysku — CLAUDE.md „Treści cudze i nazwy innych firm”). Wpisy, w których było drugim źródłem, są **otwarte** do ponownego wyszukania drugiego źródła; bez zmian zostają tylko Concentration Curl (hantle) i Barbell Preacher Curl (wg raportu badacza). Bloku JSON nie wklejać bez ponownej weryfikacji.

# Wskazówki techniki — fala W1, rodzina „curl” (2026-11)

Autor: badacz-merytoryczny (agent), 02.11.2026. Zakres: ćwiczenia z `lib/figures/v2/cue-sets.json` z `"b":"general","f":"curl"`,
bez własnego wpisu w `data/zrodla/cues.json` (pominięte, bo mają wpis: Biceps Curl (hantle), Barbell Curl, EZ Bar Curl, Hammer Curl,
Cable Curl, Preacher Curl). Wpisy z `"f":"raise"`/`"raiseFront"`/`"legCurl"` (np. Cable Y Raise, Leg Curl (hantel)) nie należą do rodziny curl — pominięte.

Reguła: wyjątek dla wskazówek techniki (CLAUDE.md, 25.10.2026) — ustawienie, przebieg ruchu i częste błędy ustalone przy 2 zgodnych,
niezależnych źródłach szczebla 4 (różne organizacje). Liczby i zdrowie — bez zmian (tu nie występują). Każde odwołanie niżej przeczytane
narzędziem WebFetch 02.11.2026; narzędzie zwraca tekst strony z cytatami, miejsca podane wg nagłówków/kroków strony.

Ograniczenie środowiska: ExRx.net (bezpośrednio 403) i web.archive.org (narzędzie blokuje domenę) — niedostępne w tej sesji, więc
drugim źródłem były biblioteki ćwiczeń Catalyst Athletics (szczebel 4, już przyjęta w `docs/research/25-biblioteka/L4-zrodla.md`, L4-S27)
i [źródło odrzucone: dokumentacja innej aplikacji] (dokumentacja aplikacji treningowej — szczebel 4 wg hierarchii: „dokumentacja producentów sprzętu i aplikacji”; nowa organizacja
w rejestrze — patrz „Otwarte” pkt 1).

## 1. Ćwiczenia — wynik

| Klucz | Wynik |
|---|---|
| Barbell Preacher Curl | gotowe (setup + 2 wskazówki) |
| Preacher Curl (EZ) | gotowe (setup + 2 wskazówki) |
| One Arm Dumbbell Preacher Curl | gotowe (setup + 1 wskazówka) |
| Concentration Curl (hantle) | gotowe (setup; 3 organizacje) — wcześniej BRAK w docs/33 (tylko ACE), teraz Catalyst + [źródło odrzucone: dokumentacja innej aplikacji] |
| Incline Curl (hantle) | gotowe (setup) — wcześniej BRAK w docs/33 |
| Spider Curl | gotowe (setup + 1 wskazówka) — wcześniej BRAK w docs/33 |
| Zottman Curl | gotowe (ruch + 1 wskazówka) |
| Reverse Curl | gotowe (setup + 1 wskazówka); uwaga: zestaw ogólny ma błąd `curl.mis.elbows` — patrz Otwarte pkt 3 |
| Spider Curl (sztanga) | otwarte — oba przeczytane źródła opisują hantle; sztanga = analogia |
| Reverse EZ-Bar Preacher Curl | otwarte — jedno źródło szczebla 4 (Catalyst „Reverse Preacher Curl”); drugie (Muscle & Strength) — szczebel niepewny |
| Reverse Cable Curl | otwarte — jedno źródło (Catalyst „Reverse Cable Curl”); drugie (Muscle & Strength) — szczebel niepewny |
| Cable Preacher Curl | otwarte — Nunes 2020 (szczebel 3, pełny zakres i tempo) bez opisu ustawienia; brak drugiego źródła |
| Bayesian Curl | otwarte — jedno źródło szczebla 4 ([źródło odrzucone: dokumentacja innej aplikacji], stojąc); badanie Attarieh i in. 2024 (PMC11906226) robiło wariant siedząc i nie opisuje ustawienia |
| Drag Curl | otwarte — jedno źródło ([źródło odrzucone: dokumentacja innej aplikacji]); Catalyst nie ma strony |
| Zottman Preacher Curl | otwarte — nie szukano (limit kontekstu) |
| Preacher Hammer Dumbbell Curl | otwarte — nie szukano |
| Incline Hammer Curl | otwarte — nie szukano |
| Cross Body Hammer Curl | otwarte — [źródło odrzucone: dokumentacja innej aplikacji]: brak strony (404); dalej nie szukano |
| Hammer Curl (linki) | otwarte — nie szukano |
| Standing One-Arm Cable Curl | otwarte — nie szukano |
| Cable Curl (dwie linki) | otwarte — nie szukano |
| High Cable Curl | otwarte — nie szukano |
| Machine Biceps Curl | otwarte — nie szukano |
| Lying Cable Curl | otwarte — nie szukano |
| Lying Close-Grip Bar Curl On High Pulley | otwarte — nie szukano |
| Lying Supine Dumbbell Curl | otwarte — nie szukano |
| Seated Close-Grip Concentration Barbell Curl | otwarte — nie szukano |
| Standing Concentration Curl | otwarte — nie szukano |
| Standing Dumbbell Reverse Curl | otwarte — nie szukano |
| Standing Inner-Biceps Curl | otwarte — nie szukano |
| Reverse Plate Curls | otwarte — nie szukano |

Gotowe: 8. Otwarte: 23 (w tym 6 sprawdzonych bez wyniku, 17 nie szukanych — sekcja „Stan”).

Uwaga o zakresie: wpisy celowo nie zawierają zdań z zestawu ogólnego, których przeczytane źródła nie potwierdzają dla wariantu
(np. `curl.elbows` przy curlu na ławce skośnej, `curl.dbMove` z obrotem dłoni przy curlu na skosie — Catalyst każe trzymać dłonie do przodu,
`mis.jerk` bez drugiego źródła). Lepiej krótsza karta niż zdanie bez podstaw.

## 2. Blok JSON do `data/zrodla/cues.json`

### 2a. Nowe organizacje (`orgs`)

```json
"Catalyst Athletics": {
 "name": "Catalyst Athletics — Exercise Library (catalystathletics.com; G. Everett)",
 "level": 4,
 "kind": "site"
},
"[źródło odrzucone: dokumentacja innej aplikacji]": {
 "name": "[źródło odrzucone: dokumentacja innej aplikacji] — przewodniki ćwiczeń ([źródło odrzucone: dokumentacja innej aplikacji].com; dokumentacja aplikacji treningowej)",
 "level": 4,
 "kind": "maker"
}
```

### 2b. Nowe źródła (`sources`)

```json
"catalyst-816": {"org": "Catalyst Athletics", "title": "Concentration Curl (#816)", "url": "https://www.catalystathletics.com/exercise/816/Concentration-Curl/", "level": 4},
"catalyst-829": {"org": "Catalyst Athletics", "title": "Dumbbell Preacher Curl (#829)", "url": "https://www.catalystathletics.com/exercise/829/Dumbbell-Preacher-Curl/", "level": 4},
"catalyst-835": {"org": "Catalyst Athletics", "title": "Dumbbell Spider Curl (#835)", "url": "https://www.catalystathletics.com/exercise/835/Dumbbell-Spider-Curl/", "level": 4},
"catalyst-850": {"org": "Catalyst Athletics", "title": "Incline Dumbbell Curl (#850)", "url": "https://www.catalystathletics.com/exercise/850/Incline-Dumbbell-Curl/", "level": 4},
"catalyst-868": {"org": "Catalyst Athletics", "title": "Preacher Curl (#868)", "url": "https://catalystathletics.com/exercise/868/Preacher-Curl", "level": 4},
"catalyst-873": {"org": "Catalyst Athletics", "title": "Reverse EZ Curl (#873)", "url": "https://www.catalystathletics.com/exercise/873/Reverse-EZ-Curl/", "level": 4},
"catalyst-889": {"org": "Catalyst Athletics", "title": "Single-Arm Dumbbell Preacher Curl (#889)", "url": "https://www.catalystathletics.com/exercise/889/Single-Arm-Dumbbell-Preacher-Curl/", "level": 4},
"catalyst-915": {"org": "Catalyst Athletics", "title": "Zottman Curl (#915)", "url": "https://www.catalystathletics.com/exercise/915/Zottman-Curl/", "level": 4},
"sl-concentration-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Concentration Curl", "url": "[adres usunięty]", "level": 4},
"sl-barbell-preacher-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Barbell Preacher Curl", "url": "[adres usunięty]", "level": 4},
"sl-dumbbell-preacher-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Dumbbell Preacher Curl", "url": "[adres usunięty]", "level": 4},
"sl-incline-dumbbell-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Incline Dumbbell Curl", "url": "[adres usunięty]", "level": 4},
"sl-spider-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Spider Curl", "url": "[adres usunięty]", "level": 4},
"sl-zottman-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Zottman Curl", "url": "[adres usunięty]", "level": 4},
"sl-reverse-barbell-curl": {"org": "[źródło odrzucone: dokumentacja innej aplikacji]", "title": "Reverse Barbell Curl", "url": "[adres usunięty]", "level": 4},
"ace-prosource-2014-biceps": {"org": "ACE", "title": "ProSource 08.2014 — ACE Study Reveals Best Biceps Exercises", "url": "https://www.acefitness.org/continuing-education/prosource/august-2014/4933/ace-study-reveals-best-biceps-exercises/", "level": 4}
```

`pmc-7460162` (Nunes i in. 2020) i `pmc-12621570` (Havers i in. 2025) już są w `sources` — użyte jako dodatkowe (szczebel 3).

### 2c. Wpisy ćwiczeń

```json
"Barbell Preacher Curl": {
 "setup": [
  {"c": "preacher.setup", "s": [
   ["catalyst-868", "opis („Brace the upper arms on a preacher bench…”)"],
   ["sl-barbell-preacher-curl", "How to, krok 1; Proper Form — Positioning (górna krawędź podpórki pod pachami)"],
   ["pmc-12621570", "sekcja 2.5 (pacha przy krawędzi; słabsze — ustawienie testowe)"]
  ]}
 ],
 "move": [],
 "tips": [
  {"c": "preacher.range", "s": [
   ["sl-barbell-preacher-curl", "How to, krok 2; Proper Form — Movement (zakres jak najdłuższy)"],
   ["pmc-7460162", "2.5 („in the maximum range of motion”; sztanga)"],
   ["catalyst-868", "opis (do dołu, bez przeprostu)"]
  ]},
  {"c": "curl.control", "s": [
   ["catalyst-868", "opis („return to the bottom under control”)"],
   ["sl-barbell-preacher-curl", "How to, krok 2 („with control”)"],
   ["pmc-7460162", "2.5 (tempo 1:2 s — opuszczanie dłuższe)"]
  ]}
 ],
 "mistakes": []
},
"Preacher Curl (EZ)": {
 "setup": [
  {"c": "preacher.setup", "s": [
   ["catalyst-868", "opis („EZ curl or straight bar”)"],
   ["sl-barbell-preacher-curl", "How to, krok 1; Positioning (sztanga prosta — ta sama ławka)"],
   ["pmc-12621570", "sekcja 2.5 (pacha przy krawędzi; słabsze — ustawienie testowe)"]
  ]}
 ],
 "move": [],
 "tips": [
  {"c": "preacher.range", "s": [
   ["catalyst-868", "opis (do dołu, bez przeprostu)"],
   ["sl-barbell-preacher-curl", "How to, krok 2; Movement (sztanga prosta — ten sam ruch)"]
  ]},
  {"c": "curl.control", "s": [
   ["catalyst-868", "opis („return to the bottom under control”)"],
   ["sl-barbell-preacher-curl", "How to, krok 2 („with control”; sztanga prosta — ten sam ruch)"]
  ]}
 ],
 "mistakes": []
},
"One Arm Dumbbell Preacher Curl": {
 "setup": [
  {"c": "preacher.setup", "s": [
   ["catalyst-889", "opis („Brace the upper arm on a preacher bench…”)"],
   ["sl-dumbbell-preacher-curl", "How to, krok 2 (ramię oparte o oparcie ławki)"],
   ["sl-barbell-preacher-curl", "Positioning (pacha przy górnej krawędzi — ta sama ławka)"]
  ]}
 ],
 "move": [],
 "tips": [
  {"c": "preacher.range", "s": [
   ["sl-dumbbell-preacher-curl", "How to, krok 3 („Lower the dumbbell as far as you can”)"],
   ["catalyst-889", "opis (do dołu, bez przeprostu)"]
  ]}
 ],
 "mistakes": []
},
"Concentration Curl (hantle)": {
 "setup": [
  {"c": "conc.setup", "s": [
   ["catalyst-816", "opis (siad, ręka zwisa wewnątrz uda, tył ramienia o udo)"],
   ["sl-concentration-curl", "How to, krok 1 (łokieć oparty o wewnętrzną stronę nogi)"],
   ["ace-prosource-2014-biceps", "opis koncentracyjnego („the humerus is pressed against the leg”)"]
  ]}
 ],
 "move": [],
 "tips": [],
 "mistakes": []
},
"Incline Curl (hantle)": {
 "setup": [
  {"c": "incline.setup", "s": [
   ["catalyst-850", "opis („Sit on an incline bench… arms hanging vertically”)"],
   ["sl-incline-dumbbell-curl", "How to, krok 1 („Let your arms hang straight down by your sides”)"]
  ]}
 ],
 "move": [],
 "tips": [],
 "mistakes": []
},
"Spider Curl": {
 "setup": [
  {"c": "spider.setup", "s": [
   ["catalyst-835", "opis („Lie prone on an incline bench… hanging at arms' length”)"],
   ["sl-spider-curl", "How to, krok 1 (przodem na ławce 45°)"]
  ]}
 ],
 "move": [],
 "tips": [
  {"c": "spider.arm", "s": [
   ["catalyst-835", "opis („keeping the upper arm approximately vertical”)"],
   ["sl-spider-curl", "How to, kroki 2–3 (ramiona pionowo, ruch tylko w przedramionach)"]
  ]}
 ],
 "mistakes": []
},
"Zottman Curl": {
 "setup": [],
 "move": [
  {"c": "zottman.move", "s": [
   ["catalyst-915", "opis (w górę podchwytem, na górze obrót, w dół nachwytem)"],
   ["sl-zottman-curl", "How to, kroki 2–4"]
  ]}
 ],
 "tips": [
  {"c": "curl.control", "s": [
   ["catalyst-915", "opis („lower under control in this pronated position”)"],
   ["sl-zottman-curl", "How to, krok 4 („Slowly lower”)"]
  ]}
 ],
 "mistakes": []
},
"Reverse Curl": {
 "setup": [
  {"c": "curl.revGrip", "s": [
   ["sl-reverse-barbell-curl", "How to, krok 1 (nachwyt)"],
   ["catalyst-873", "opis (gryf łamany, nachwyt; start z pełnego wyprostu)"]
  ]}
 ],
 "move": [],
 "tips": [
  {"c": "curl.elbows", "s": [
   ["catalyst-873", "opis („keeping the elbows close to the sides”)"],
   ["sl-reverse-barbell-curl", "How to, krok 3 („Keep it at your side…”)"]
  ]}
 ],
 "mistakes": []
}
```

Do dopisania w `cue-sets.json` (koordynator/programista): tryb tych 8 kluczy z `general` na własny (jak dla Barbell Curl) — format
i generator po stronie kodu, poza zakresem tego pliku.

## 3. Nowe zdania (PL + proponowany EN)

| id | PL | EN (propozycja) | Źródła |
|---|---|---|---|
| `conc.setup` | Usiądź i oprzyj tył ramienia o wewnętrzną stronę uda; ręka z hantlem zwisa prosto. | Sit down and brace the back of your upper arm against your inner thigh; let the dumbbell hang with your arm straight. | catalyst-816, sl-concentration-curl, ace-prosource-2014-biceps |
| `incline.setup` | Usiądź na ławce skośnej; ręce z hantlami zwisają prosto w dół. | Sit on an incline bench and let your arms hang straight down with the dumbbells. | catalyst-850, sl-incline-dumbbell-curl |
| `spider.setup` | Połóż się przodem na ławce skośnej; ręce z hantlami zwisają pionowo. | Lie chest-down on an incline bench with the dumbbells hanging straight down. | catalyst-835, sl-spider-curl |
| `spider.arm` | Ramiona pionowo i nieruchomo — pracują tylko przedramiona. | Keep your upper arms vertical and still — only your forearms move. | catalyst-835, sl-spider-curl |
| `zottman.move` | Unieś hantle podchwytem, na górze obróć dłonie w dół i opuszczaj nachwytem. | Curl up with palms up, turn your palms down at the top and lower with an overhand grip. | catalyst-915, sl-zottman-curl |
| `curl.revGrip` | Chwyć gryf nachwytem; ręce wyprostowane w dół. | Grip the bar overhand, arms straight down. | sl-reverse-barbell-curl, catalyst-873 |

Celowo bez szerokości chwytu w `curl.revGrip` („na szerokość barków” podaje tylko [źródło odrzucone: dokumentacja innej aplikacji]). Każde nowe zdanie wymaga: tłumaczenia na 35 języków,
wpisu w `docs/research/rejestr-twierdzen.json` (`node scripts/claims.mjs --stub`, potem `--rehash`) i recenzji lokalizacji.

Krótkie cytaty (najwyżej jedno zdanie na źródło):
- catalyst-816: „Keeping the back of the arm against the inside of the thigh to eliminate any cheating, perform a curl, then lower under control.”
- sl-concentration-curl, krok 1: „Lean your elbow onto the inside of your leg.”
- catalyst-868: „Keeping the arms supported on the bench, curl the bar up, and return to the bottom under control.”
- sl-barbell-preacher-curl, Positioning: „The top of the pad should sit comfortably under your armpits when your arms are fully extended.”
- sl-dumbbell-preacher-curl, krok 3: „Lower the dumbbell as far as you can, and then reverse the motion, returning to the starting position.”
- catalyst-850: „Sit on an incline bench with a dumbbell in each hand with the palms facing forward and the arms hanging vertically.”
- sl-incline-dumbbell-curl, krok 1: „Let your arms hang straight down by your sides.”
- catalyst-835: „…perform a curl, keeping the upper arm approximately vertical.”
- sl-spider-curl, krok 3: „Don't let your upper arms travel back or forwards during the curl.”
- catalyst-915: „…at the top, rotate the palms to face forward, and lower under control in this pronated position.”
- sl-zottman-curl, krok 3: „At the top, rotate your wrists so your palms face downward (pronated grip).”
- catalyst-873: „Hold an EZ curl bar with a pronated grip and curl completely, keeping the elbows close to the sides…”
- sl-reverse-barbell-curl, krok 1: „Grip a bar with an overhand (pronated) grip, hands about shoulder-width apart.”

## 4. Źródła

| id | adres | organizacja | szczebel |
|---|---|---|---|
| catalyst-816 / 829 / 835 / 850 / 868 / 873 / 889 / 915 | adresy w 2b | Catalyst Athletics | 4 |
| sl-* (7 stron) | adresy w 2b | [źródło odrzucone: dokumentacja innej aplikacji] (dokumentacja aplikacji) | 4 |
| ace-prosource-2014-biceps | adres w 2b | ACE | 4 |
| pmc-7460162 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7460162/ | Nunes i in. (Londrina State University) | 3 |
| pmc-12621570 | https://pmc.ncbi.nlm.nih.gov/articles/PMC12621570/ | Havers i in. (IST Düsseldorf) | 3 |

Przeczytane bez użycia w danych: catalyst-829 (Dumbbell Preacher Curl, oburącz), Catalyst Reverse Cable Curl (#872) i Reverse Preacher Curl (#874),
[źródło odrzucone: dokumentacja innej aplikacji] Bayesian Curl i Drag Curl, PMC11906226 (Attarieh i in. 2024, Bayesian vs preacher).

## 5. Otwarte

1. **[OTWARTE] [źródło odrzucone: dokumentacja innej aplikacji] jako szczebel 4** — to dokumentacja aplikacji treningowej (hierarchia: szczebel 4), ale aplikacja jest konkurencyjna.
   Cytaty w repo są krótkie (prawo cytatu); nazwa nie trafia do aplikacji (zasada „źródła anonimowo”). Do potwierdzenia przez audytora; jeśli odrzucone —
   8 wpisów traci drugie źródło (wyjątek: Concentration Curl ma nadal Catalyst + ACE; Barbell Preacher Curl ma Catalyst + Nunes/Havers szczebla 3).
2. **[OTWARTE] Muscle & Strength** (muscleandstrength.com) ma strony dla Reverse EZ Preacher, Reverse Cable Curl i in. — szczebel (serwis specjalistyczny vs sklep z suplementami) nieustalony; nie użyty.
3. **[OTWARTE → zgłoszenie dla koordynatora] Reverse Curl w zestawie ogólnym:** `curl.mis.elbows` („Wysuwanie łokci do przodu…”) jest sprzeczne z [źródło odrzucone: dokumentacja innej aplikacji]
   (krok 3: ramię przy boku „or move it slightly forward”); Catalyst każe trzymać łokcie przy bokach. Część wspólna: łokcie przy bokach (`curl.elbows`) — dlatego w danych
   tylko ona, bez błędu „łokcie do przodu”. Podobnie Incline Curl / Incline Hammer Curl w zestawie ogólnym mają `curl.elbows` + `curl.mis.elbows`, których żadne
   przeczytane źródło dla ławki skośnej nie podaje. Ocena (próg wydania): twierdzenie techniki bez podstaw — do decyzji koordynatora/audytora.
4. **[OTWARTE] Kontrola opuszczania (`curl.control`)** przy Concentration, Incline, One Arm DB Preacher, Reverse Curl: Catalyst mówi „lower under control”,
   [źródło odrzucone: dokumentacja innej aplikacji] tylko „lift … with control” (faza w górę) — brak drugiego źródła dla fazy opuszczania; nie dodane.
5. **[OTWARTE] Dłonie do przodu na ławce skośnej** (Incline Curl) i „plecy przy oparciu” — tylko Catalyst; nie dodane.
6. **[OTWARTE] Spider Curl (sztanga)** — źródła tylko z hantlami (analogia; przy dodaniu oznaczyć „uproszczenie”).
7. **[OTWARTE] Bayesian Curl** — [źródło odrzucone: dokumentacja innej aplikacji] opisuje wariant stojąc tyłem do wyciągu; badanie PMC11906226 — siedząc („BAYE chair”). Brak drugiego źródła dla jednego wariantu.
8. **[OTWARTE] Rozbieżność „pełny wyprost” vs „bez przeprostu” na modlitewniku** — Catalyst: „Avoid hyperextension at the bottom”; [źródło odrzucone: dokumentacja innej aplikacji]: jak najniżej,
   ale można skrócić, jeśli wyprost jest niewygodny. `preacher.range` („od wyprostu”) nie przeczy żadnemu (wyprost ≠ przeprost); zdanie o przeproście dotyczy stawu,
   więc ewentualne dodanie wymaga pełnych zasad (zdrowie), nie wyjątku techniki.

## Stan (limit kontekstu ok. 30%)

- Zrobione (8): Barbell Preacher Curl, Preacher Curl (EZ), One Arm Dumbbell Preacher Curl, Concentration Curl (hantle), Incline Curl (hantle),
  Spider Curl, Zottman Curl, Reverse Curl.
- Sprawdzone bez wyniku (6): Spider Curl (sztanga), Reverse EZ-Bar Preacher Curl, Reverse Cable Curl, Cable Preacher Curl, Bayesian Curl, Drag Curl.
- Zostało (17, nie szukane): Zottman Preacher Curl, Preacher Hammer Dumbbell Curl, Incline Hammer Curl, Cross Body Hammer Curl ([źródło odrzucone: dokumentacja innej aplikacji] 404),
  Hammer Curl (linki), Standing One-Arm Cable Curl, Cable Curl (dwie linki), High Cable Curl, Machine Biceps Curl, Lying Cable Curl,
  Lying Close-Grip Bar Curl On High Pulley, Lying Supine Dumbbell Curl, Seated Close-Grip Concentration Barbell Curl, Standing Concentration Curl,
  Standing Dumbbell Reverse Curl, Standing Inner-Biceps Curl, Reverse Plate Curls.
- Następny krok: Catalyst ma strony m.in. Hammer Curl (#841), Cable Curl (#809), EZ Curl (#838) — szukać przez WebSearch z `allowed_domains: catalystathletics.com`,
  drugie źródło: [źródło odrzucone: dokumentacja innej aplikacji].com (adresy w formie `/nazwa-cwiczenia/`, nie zawsze istnieją) albo ACE/NASM.
- Pułapki: ExRx i web.archive.org niedostępne z tego środowiska; [źródło odrzucone: dokumentacja innej aplikacji] często nie ma sekcji „błędy” — błędów (mistakes) nie da się zwykle potwierdzić dwoma źródłami;
  narzędzie WebFetch potrafi streszczać — cytaty wyżej są dosłowne z odpowiedzi narzędzia, audytor powinien otworzyć 2–3 losowe strony.
