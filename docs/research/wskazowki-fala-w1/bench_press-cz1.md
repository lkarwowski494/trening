# bench_press (cz. 1) — wskazówki techniki, fala W1 (badacz-merytoryczny, 02.11.2026)

Zasady: CLAUDE.md „Merytoryczne podstawy” i „Wyjątek dla wskazówek techniki” (2 niezależne źródła szczebla 4, żadne przeczytane nie przeczy),
brief fali W1 z uzupełnieniem koordynatora 02.11.2026 (bez stron innych aplikacji; ExRx 403 i web.archive.org zablokowane — nie użyte;
krótsza karta zamiast zdań niepotwierdzonych dla wariantu). Wszystkie strony przeczytane narzędziem WebFetch 02.11.2026.
Szczeble źródeł poprawione wg rozstrzygnięcia koordynatora z 02.11.2026 — patrz sekcje „Korekta szczebli (02.11.2026)” i „Korekta szczebli — uzupełnienie 3” na końcu.

## Ćwiczenia

| Ćwiczenie | Stan (gotowe/otwarte) | Uwagi |
|---|---|---|
| Decline Bench Press | gotowe | Major Fitness, Bells of Steel (producenci ławek i sztang), NFPT, BarBend; krótka karta (bez `bp.blades`, `bp.contact`); stan bez zmian po korektach szczebli |
| Decline Bench Press (hantle) | otwarte | ustawienie, ruch, łopatki — po 2 źródła; błąd tylko z 1 źródła (NFPT) |
| Floor Press (sztanga) | otwarte | ustawienie i ruch — 2 źródła szczebla 4 (BarBend, Performance Menu; Barbell Logic → 5 w uzupełnieniu 3); żaden błąd nie ma 2 zgodnych źródeł |
| Floor Press (hantle) | otwarte | po korekcie szczebli ruch ma już tylko 1 źródło szczebla 4 (BarBend); błąd tylko z 1 źródła (szczebla 5) |
| Smith Machine Bench Press | gotowe | po uzupełnieniu 3 (blog Mikolo = 5) każde zdanie bloku ma Major Fitness + RitFit; `bp.elbowsMid` wycofane (zostało 1 źródło) |
| Smith Machine Incline Press | otwarte | po uzupełnieniu 3 (blog Mikolo = 5) ruch `bench.smith.inclineMove` ma tylko Major Fitness; z 2 źródeł zostaje tylko ustawienie |
| Smith Machine Decline Press | otwarte | po korekcie szczebli ruch tylko z 1 źródła szczebla 4 (RitFit; Dynamo = sprzedawca, szczebel 5); brak błędu z 2 źródeł |
| One Arm Dumbbell Bench Press | zob. cz1b | zbadane w `bench_press-cz1b.md` |
| One-Arm Kettlebell Floor Press | zob. cz1b | j.w. |
| Wide-Grip Barbell Bench Press | zob. cz1b | j.w. |
| Reverse Grip Bench Press | zob. cz1b | j.w. |
| Squeeze Press (hantle) | zob. cz1b | j.w. |

## Blok JSON do data/zrodla/cues.json (sekcja exercises)

Tylko ćwiczenia „gotowe”. Bloki częściowe ćwiczeń „otwartych” — w sekcji „Otwarte” (do uzupełnienia, nie do aplikacji).

```json
{
  "Decline Bench Press": {
    "setup": [
      {"c": "bench.decline.setup", "s": [
        ["majorfitness-decline-bench-press", "Setting Up for the Decline Bench Press; Step 1: Position Yourself (feet under the foot pads)"],
        ["barbend-decline-bench-press", "How to Do a Decline Bench Press, krok 1 (feet secured properly)"],
        ["bellsofsteel-decline-bench-press", "Step 1: Setup (head at the lower end, feet secure under the leg supports)"]
      ]},
      {"c": "bp.grip", "s": [
        ["majorfitness-decline-bench-press", "Step 2: Grip the Bar (slightly wider than shoulder-width)"],
        ["bellsofsteel-decline-bench-press", "Step 2: Grip and Stance (slightly wider than shoulder-width)"]
      ]}
    ],
    "move": [
      {"c": "bench.decline.move", "s": [
        ["majorfitness-decline-bench-press", "Step 4: Lower the Bar; Step 5: Press the Bar Up"],
        ["bellsofsteel-decline-bench-press", "Step 3: The Press (towards your lower chest; fully extending your arms)"],
        ["nfpt-decline-bench-straight-bar", "opis wykonania (lower part of your chest; straight up to the starting position)"]
      ]}
    ],
    "tips": [
      {"c": "bench.bladesTogether", "s": [
        ["nfpt-decline-bench-straight-bar", "pozycja wyjściowa (squeeze your shoulder blades together)"],
        ["barbend-decline-bench-press", "How to Do a Decline Bench Press, krok 2 (set your shoulder blades together)"]
      ]},
      {"c": "bp.control", "s": [
        ["majorfitness-decline-bench-press", "Common Mistakes to Avoid (bouncing the bar); Step 4 (slowly lower)"],
        ["nfpt-decline-bench-straight-bar", "wskazówki (stay in control at all times)"]
      ]}
    ],
    "mistakes": [
      {"c": "bp.mis.arch", "s": [
        ["nfpt-decline-bench-straight-bar", "wskazówki (do not excessively arch your back or raise your hips off the bench)"],
        ["bellsofsteel-decline-bench-press", "Step 1: Setup (back should be flat against the bench)"]
      ]}
    ]
  },
  "Smith Machine Bench Press": {
    "setup": [
      {"c": "bench.smith.bench", "s": [
        ["majorfitness-smith-bench-press", "1. Set Up the Bench and Find the Right Bar Path (mid-chest)"],
        ["ritfit-smith-bench-press", "Setup (bar reaches your mid to lower chest)"]
      ]},
      {"c": "bench.smith.catches", "s": [
        ["ritfit-smith-bench-press", "Setup (safety catches just below the bottom of your normal range)"],
        ["majorfitness-smith-bench-press", "Safety Stops"]
      ]},
      {"c": "bp.grip", "s": [
        ["majorfitness-smith-bench-press", "2. Get Into the Right Starting Position (just outside of shoulder-width)"],
        ["ritfit-smith-bench-press", "Setup (slightly wider than shoulder width)"]
      ]}
    ],
    "move": [
      {"c": "bench.smith.unrack", "s": [
        ["majorfitness-smith-bench-press", "3. Unrack the Bar Smoothly; 6. Re-rack the Bar Safely"],
        ["ritfit-smith-bench-press", "Setup (wrist rotation); Re-rack (rotate the bar back into the hooks)"]
      ]},
      {"c": "bench.smith.move", "s": [
        ["majorfitness-smith-bench-press", "4. Lower the Bar With Control; 5. Press the Bar Back Up (stop just short of locking)"],
        ["ritfit-smith-bench-press", "Setup (mid to lower chest at the bottom of the rep)"]
      ]}
    ],
    "tips": [
      {"c": "bp.control", "s": [
        ["majorfitness-smith-bench-press", "4. Lower the Bar With Control; Common Mistakes (no bouncing)"],
        ["ritfit-smith-bench-press", "Common mistakes (bouncing reduces control)"]
      ]}
    ],
    "mistakes": [
      {"c": "bench.smith.mis.position", "s": [
        ["majorfitness-smith-bench-press", "Common Mistakes (too high or too low under the bar)"],
        ["ritfit-smith-bench-press", "Common mistakes (bench too far forward — bar meets the chest too high)"]
      ]}
    ]
  }
}
```

## Nowe zdania (id | PL | EN)

| id | PL | EN |
|---|---|---|
| bench.decline.setup | Połóż się na ławce skośnej w dół, głową niżej, i zablokuj nogi pod wałkami. | Lie on the decline bench, head at the low end, and lock your legs under the pads. |
| bench.decline.move | Opuść sztangę kontrolowanie do dolnej części klatki, potem wypchnij ją w górę do wyprostu rąk. | Lower the bar under control to your lower chest, then press it up until your arms are straight. |
| bench.bladesTogether | Ściągnij łopatki i trzymaj je tak przez cały ruch. | Squeeze your shoulder blades together and keep them there the whole set. |
| bench.smith.bench | Ustaw ławkę pod gryfem tak, żeby opuszczony gryf trafiał mniej więcej na środek klatki. | Set the bench under the bar so it comes down to about the middle of your chest. |
| bench.smith.catches | Ustaw ograniczniki tuż poniżej dolnego punktu ruchu — złapią gryf, gdyby wypadł z rąk. | Set the safety stops just below the bottom of your range — they'll catch the bar if you miss. |
| bench.smith.unrack | Zdejmij gryf z haków, obracając go nadgarstkami; po ostatnim powtórzeniu obróć go z powrotem na haki. | Rotate the bar off the hooks with your wrists; after the last rep, rotate it back onto them. |
| bench.smith.move | Opuść gryf powoli do klatki, potem wypchnij go w górę, prawie do wyprostu rąk. | Lower the bar slowly to your chest, then press it up until your arms are almost straight. |
| bench.smith.mis.position | Ławka za bardzo z przodu albo z tyłu — gryf schodzi za wysoko albo za nisko na klatkę. | Bench too far forward or back, so the bar lands too high or too low on your chest. |
| bench.smith.inclineSetup (nieużyte) | Ustaw ławkę skośną tak, żeby gryf schodził na górną część klatki; stopy płasko na podłodze. | Set the incline bench so the bar comes down to your upper chest; feet flat on the floor. |
| bench.smith.inclineMove (nieużyte) | Opuść gryf powoli w stronę górnej części klatki, potem wypchnij go w górę, prawie do wyprostu rąk. | Lower the bar slowly toward your upper chest, then press it up until your arms are almost straight. |
| bench.mis.flare (nieużyte) | Łokcie rozłożone szeroko na boki, prawie pod kątem prostym do tułowia. | Elbows flared wide, almost at right angles to your body. |

Uwagi:
- `bench.bladesTogether`: istniejące `bp.blades` mówi „do siebie i w dół”; przeczytane źródła wariantów skośnych w dół mówią tylko „ściągnij
  łopatki” (squeeze/set together) — „w dół” nie jest potwierdzone, stąd krótsze zdanie (uzupełnienie koordynatora, pkt 3).
- `bench.smith.move` zamiast `bp.move`: Major Fitness (i blog Mikolo, szczebel 5) mówią „zatrzymaj tuż przed zablokowaniem łokci”, RitFit dopuszcza oba —
  „do wyprostu rąk” z `bp.move` byłoby nieścisłe; `press.noLock` („prostuj ręce do końca”) przeczy Major Fitness.
- `bench.smith.move` po uzupełnieniu 3: RitFit potwierdza tor (do środka/dołu klatki), „prawie do wyprostu” — tylko Major Fitness; RitFit nie przeczy.
  Recenzent może skrócić zdanie do „Opuść gryf powoli do klatki, potem wypchnij go w górę.”, jeśli uzna „prawie do wyprostu” za jedno źródło.

## Nowe źródła (id | adres | organizacja | szczebel | data odczytu)

| id | adres | organizacja | szczebel | data odczytu |
|---|---|---|---|---|
| majorfitness-decline-bench-press | https://www.majorfitness.com/blogs/wiki/how-to-do-decline-bench-press-for-optimal-chest-development | Major Fitness (producent sprzętu: ławki, klatki, maszyny Smitha; nowa org, kind: maker), 17.07.2024, treść firmowana marką (bez autora) | 4 (producent — własny rodzaj sprzętu: ławka) | 02.11.2026 |
| majorfitness-smith-bench-press | https://www.majorfitness.com/blogs/wiki/how-to-properly-bench-press-on-a-smith-machine-a-step-by-step-guide | Major Fitness, 27.11.2025 | 4 (producent — maszyna Smitha) | 02.11.2026 |
| majorfitness-smith-incline-press | https://www.majorfitness.com/blogs/wiki/how-to-do-incline-bench-press-on-smith-machine-a-step-by-step-guide | Major Fitness, 17.04.2025 | 4 (producent — maszyna Smitha) | 02.11.2026 |
| bellsofsteel-decline-bench-press | https://bellsofsteel.us/blogs/content/decline-bench-press | Bells of Steel (producent sprzętu: ławki, sztangi; nowa org, kind: maker), 23.10.2023, treść firmowana marką | 4 (producent — ławka, sztanga) | 02.11.2026 |
| mikolo-smith-bench-press | https://gym-mikolo.com/blogs/home-gym/smith-machine-bench-press-proper-form-benefits-myths-variations | Mikolo Fitness — blog, bez daty | 5 (uzupełnienie 3: blog Mikolo = 5; instrukcje Mikolo dotyczą montażu, nie techniki) | 02.11.2026 (tylko do Otwartych) |
| mikolo-smith-incline-press | https://gym-mikolo.com/blogs/home-gym/incline-smith-machine-press-proper-form-and-technique | Mikolo Fitness — blog, bez daty | 5 (uzupełnienie 3) | 02.11.2026 (tylko do Otwartych) |
| ritfit-smith-bench-press | https://www.ritfitsports.com/blogs/article/how-to-do-smith-machine-bench-press | RitFit (producent sprzętu; nowa org, kind: maker), „RitFit Editorial Team”, aktualizacja 29.10.2026 | 4 (producent — maszyna Smitha; rozstrzygnięcie koordynatora) | 02.11.2026 |
| nfpt-decline-bench-straight-bar | https://nfpt.com/decline-bench-straight-bar/ | NFPT — National Federation of Professional Trainers (nowa org, kind: org); 11.08.2025; byline „by Guest”, w polu „Author” biogram R. Bovee z kwalifikacjami (Certified Master PPT, RTS, ETS, FTS) | 4 (autor w polu autora, data, kwalifikacje) | 02.11.2026 |
| nfpt-decline-db-bench-press | https://nfpt.com/how-to-do-a-decline-bench-press-with-dumbbells/ | NFPT; „Guest Authored by Robert Bovee”, 11.08.2025, kwalifikacje w biogramie | 4 | 02.11.2026 |
| nfpt-floor-db-press-power-hooks | https://nfpt.com/?p=4986 („How to do a Floor Dumbbell Chest Press with Power Hooks”) | NFPT; autor M. Sher, 10.08.2025, bez biogramu z kwalifikacjami | 5 | 02.11.2026 |
| barbend-decline-bench-press | https://barbend.com/decline-bench-press/ | BarBend (org już w rejestrze; artykuł o technice, autor CSCS, aktualizacja 13.03.2025) | 4 | 02.11.2026 |
| barbend-floor-press | https://barbend.com/floor-press/ | BarBend (artykuł o technice, autor CSCS) | 4 | 02.11.2026 |
| performancemenu-floor-press | https://www.performancemenu.com/article/199/The-Floor-Press/ | The Performance Menu Journal (wydawnictwo Catalyst Athletics, „© Catalyst Athletics”), autor S. Shafley, nr 24, 01.2007 (nowa org, kind: site) | 4 (Catalyst Athletics; uwaga: autor bez kwalifikacji trenerskich w biogramie) | 02.11.2026 |
| barbelllogic-floor-press | https://barbell-logic.com/how-to-floor-press/ | Barbell Logic — strona bez autora i bez daty (tylko „©2026 Barbell Logic”; w opisie wideo „Matt Reynolds explain”, bez roli autora i kwalifikacji) | 5 (uzupełnienie 3: warunkowo 4 tylko z autorem z kwalifikacjami i datą) | 02.11.2026 |
| twl-db-floor-press | https://blog.twl.com.au/?p=29445 | TWL (australijska marka odzieży i sprzętu; „Written by TWL”, bez daty) — w treści sekcje „Shop Now”; nie ustalono, że hantle są jej produkcji | 5 | 02.11.2026 |
| dynamo-smith-decline-press | https://blog.dynamofitness.com.au/?p=2934 | Dynamo Fitness (sprzedawca i instalator sprzętu, nie producent) | 5 | 02.11.2026 |

Uwagi o źródłach: strony NFPT to jedna organizacja — liczą się jako jedno niezależne źródło. Bells of Steel jest wewnętrznie niespójne
(Step 1: stopy pod wałkami; Step 2: stopy płasko na podłodze) — dlatego `bench.decline.setup` opiera się też na Major Fitness i BarBend.
Strony producentów (Major Fitness, Bells of Steel, RitFit) mają w treści linki do własnych produktów — wg rozstrzygnięcia koordynatora
producent liczy się jako szczebel 4 dla własnego rodzaju sprzętu; użyte wyłącznie do ławek, sztangi i maszyny Smitha.
Odrzucone: strony aplikacji treningowych (uzupełnienie koordynatora, pkt 1), czasopismo kulturystyczne bez kwalifikacji autora,
strony 403 (Muscle & Strength, Powerlifting Technique, Dick's), The Prehab Guys (przekierowanie do logowania), elitefts (404).

## Otwarte (ćwiczenie/zdanie | powód)

| ćwiczenie/zdanie | powód |
|---|---|
| Decline Bench Press — `bp.blades` (zestaw ogólny) | „łopatki w dół” niepotwierdzone dla wariantu; zastąpione krótszym `bench.bladesTogether` |
| Decline Bench Press — `bp.contact` (zestaw ogólny) | „stopy pewnie na podłodze” nie pasuje do ławki z wałkami na nogi (tylko Bells of Steel Step 2, wewnętrznie sprzeczne) |
| Decline Bench Press — „nie odrywaj barków od ławki na górze” | tylko NFPT |
| Decline Bench Press (hantle) — całe ćwiczenie | brak błędu z 2 źródeł: `bp.mis.arch` tylko NFPT (nfpt-decline-db-bench-press, „Common Mistakes”); BarBend nie ma sekcji błędów. Potwierdzone częściowo: setup `bench.decline.setup` [barbend-decline-bench-press krok 1; majorfitness-decline-bench-press „Setting Up…” — opis ławki, wspólny dla obu wersji]; move — nowe zdanie `bench.decline.dbMove` „Opuść hantle powoli po bokach klatki, łokcie pod hantlami; wypchnij je w górę do wyprostu rąk.” / „Lower the dumbbells slowly beside your chest, elbows under the weights, then press them up until your arms are straight.” [nfpt-decline-db-bench-press Movement (outside your chest; forearms straight up and down); barbend-decline-bench-press kroki 3–4 (elbows positioned under the weights; locked out)]; tip `bench.bladesTogether` [nfpt-decline-db-bench-press Starting Position; barbend-decline-bench-press krok 2]. Uwaga: ustawienie i ruch są z 2 źródeł — wg odpowiedzi koordynatora (karty częściowe się kwalifikują) kandydat na „częściowe”; zostawione jako otwarte do decyzji koordynatora, bo `bench.decline.setup` z Major Fitness to opis ławki dla wersji ze sztangą (przeniesienie na hantle = analogia) |
| Decline Bench Press (hantle) — `bp.control` | tylko NFPT mówi wprost o kontroli opuszczania |
| Floor Press (sztanga) — całe ćwiczenie | żaden błąd nie ma 2 zgodnych źródeł: BarBend — zbytnie wysuwanie łopatek w przód na górze; Performance Menu — znoszenie sztangi w stronę głowy i napęd z nóg; Barbell Logic (5) — uginanie kolan. Źródła różnią się co do nóg: Performance Menu i Barbell Logic — nogi proste, BarBend — proste albo ugięte. Potwierdzone częściowo (2 źródła szczebla 4 po uzupełnieniu 3): setup `bench.floor.setup` „Połóż się na podłodze pod sztangą w stojaku i chwyć ją jak do wyciskania na ławce.” / „Lie on the floor under the racked bar and grip it as you would for a bench press.” [barbend-floor-press krok 1; performancemenu-floor-press (set up similar to the bench press; power rack); dodatkowo szczebla 5: barbelllogic-floor-press]; move `bench.floor.move` „Opuść sztangę, aż łokcie dotkną podłogi, potem wypchnij ją do wyprostu rąk.” / „Lower the bar until your elbows touch the floor, then press it up until your arms are straight.” [barbend-floor-press kroki 5 i 7; performancemenu-floor-press; dodatkowo szczebla 5: barbelllogic-floor-press]; tip `bench.floor.pause` „Na dole zatrzymaj się na moment, potem wyciskaj.” [po uzupełnieniu 3 tylko performancemenu-floor-press (pause for a brief interval); Barbell Logic → 5] — 1 źródło. Ustawienie i ruch z 2 źródeł → kandydat na „częściowe” (decyzja koordynatora; w tej korekcie nie wpisuję, bo przed korektą ćwiczenie nie było częściowe z powodu sporu o nogi) |
| Floor Press — `bp.grip` (zestaw ogólny) | żadne przeczytane źródło nie podaje szerokości chwytu („jak do wyciskania” — tak, „szerzej niż barki” — nie) |
| Floor Press (hantle) — całe ćwiczenie | po korekcie szczebli (02.11.2026): TWL i strona NFPT o power hooks mają szczebel 5, więc ruch `bench.floor.dbMove` „Opuść hantle powoli, aż łokcie dotkną podłogi, potem wypchnij je do wyprostu rąk.” / „Lower the dumbbells slowly until your elbows touch the floor, then press them up until your arms are straight.” ma tylko 1 źródło szczebla 4 [barbend-floor-press „Floor Press Variations — Dumbbell” (nearly identical steps)]; dodatkowo, szczebla 5: twl-db-floor-press (until your elbows hit the floor; arms extended), nfpt-floor-db-press-power-hooks (elbows on the floor start; lower under control). Błąd tylko z 1 źródła, szczebla 5 (TWL — łokcie nie na boki, lekko przy tułowiu). NFPT (power hooks) każe wygiąć plecy — nie użyte jako wskazówka. |
| Smith Machine Bench Press — `bp.elbowsMid` (wycofane w uzupełnieniu 3) | tylko Major Fitness (Common Mistakes: „neither pinned to your ribs or sticking out”); blog Mikolo (40–75°) → 5 |
| Smith Machine Bench Press — `bp.contact` | tylko RitFit wymienia pięć punktów podparcia; Mikolo (5) — tylko stopy |
| Smith Machine Bench Press — `bp.mis.arch` | teksty różnią się: Major Fitness — unikaj nadmiernego wygięcia; Mikolo (5) — utrzymuj lekkie wygięcie |
| Smith Machine Incline Press — całe ćwiczenie (wycofane z bloku w uzupełnieniu 3) | blog Mikolo = 5. Zostaje z 2 źródeł tylko setup `bench.smith.inclineSetup` [majorfitness-smith-incline-press Setup: bar placement; Lowering; Feet; ritfit-smith-bench-press „Incline and decline variations — Incline” (bar meets your upper chest; feet planted)]. Tylko Major Fitness: `bp.grip` (Grip: just outside shoulder width), `bench.smith.inclineMove` (Lowering to upper chest; Press: stop just short of full elbow lockout), `bp.control` (Common mistakes 2), `bench.mis.flare` (Common mistakes 3). Brak ruchu z 2 źródeł → otwarte. Potrzebne drugie źródło szczebla 4 o wersji skośnej (inny producent maszyny Smitha) |
| Smith Machine Incline Press — `bench.smith.unrack`, ograniczniki | dla wersji skośnej obrót gryfu opisuje tylko Major Fitness, ograniczniki tylko ogólnie; źródła Smitha płaskiego opisują tę samą maszynę — dołączenie byłoby analogią |
| Smith Machine Incline Press — `bp.mis.arch` / odrywanie bioder | tylko Mikolo (5) |
| Smith Machine Decline Press — całe ćwiczenie | brak błędu z 2 źródeł; po korekcie szczebli (02.11.2026) Dynamo = sprzedawca, szczebel 5, więc także ruch `bench.smith.declineMove` „Opuść gryf powoli do dolnej części klatki, potem wypchnij go w górę.” / „Lower the bar slowly to your lower chest, then press it back up.” ma tylko 1 źródło szczebla 4 [ritfit-smith-bench-press „Incline and decline variations — Decline” (bar reaches the lower chest)]; dodatkowo, szczebla 5: dynamo-smith-decline-press (until the bar almost touches your lower chest; rotate your wrists) |

## Stan (kończę przed czasem — limit kontekstu)

- Zrobione: Decline Bench Press (gotowe), Decline Bench Press hantle (otwarte), Floor Press sztanga (otwarte), Floor Press hantle (otwarte),
  Smith Machine Bench Press (gotowe), Smith Machine Incline Press (otwarte po uzupełnieniu 3), Smith Machine Decline Press (otwarte).
- Pozostałe 5 ćwiczeń zbadane w `bench_press-cz1b.md`.
- Pułapki: ExRx 403 i web.archive.org zablokowane; wiele wyników wyszukiwania to strony aplikacji (odrzucać); Muscle & Strength, Powerlifting
  Technique, Dick's — 403; The Prehab Guys — logowanie; witryny NFPT czytać po adresie z nazwą (p=… też działa). Dla wariantów „otwartych”
  brakuje zwykle drugiego źródła BŁĘDU — warto szukać drugiego źródła celowo pod błąd (np. „hips off bench”, „flared elbows”).
  Strony NFPT liczą się jako szczebel 4 tylko z autorem, datą i kwalifikacjami w biogramie — sprawdzać każdą stronę osobno.

## Korekta szczebli (02.11.2026)

Podstawa: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (kryteria a–c). Autor/data/charakter każdej strony sprawdzone ponownie WebFetch 02.11.2026.

Źródła:
- nfpt-floor-db-press-power-hooks: 4 → 5 (autor M. Sher bez biogramu z kwalifikacjami).
- twl-db-floor-press: 4 → 5 (wpis firmowany marką bez daty, sekcje „Shop Now” w treści; nie ustalono, że to producent hantli — sprzedawca/blog marketingowy).
- dynamo-smith-decline-press: „4 (do oceny)” → 5 (sprzedawca, nie producent).
- Bez zmiany (4, potwierdzone): majorfitness-* (producent ławek i maszyn Smitha), bellsofsteel-decline-bench-press (producent ławek/sztang), mikolo-smith-* (producent maszyn Smitha), ritfit-smith-bench-press (producent — rozstrzygnięcie), nfpt-decline-bench-straight-bar i nfpt-decline-db-bench-press (autor R. Bovee, data, kwalifikacje), barbend-* (artykuły o technice), performancemenu-floor-press (Catalyst Athletics), barbelllogic-floor-press (organizacja szkoląca trenerów, treść na jej stronie). (Mikolo i Barbell Logic zmienione w uzupełnieniu 3 — niżej.)

Ćwiczenia:
- Żadne ćwiczenie nie zmieniło stanu. Decline Bench Press, Smith Machine Bench Press, Smith Machine Incline Press — gotowe (bez zmian; każde zdanie nadal ma ≥ 2 źródła szczebla 4). Decline Bench Press (hantle), Floor Press (sztanga) — otwarte (bez zmian). Floor Press (hantle) — otwarte (bez zmiany stanu; ruch spadł do 1 źródła szczebla 4). Smith Machine Decline Press — otwarte (bez zmiany stanu; ruch spadł do 1 źródła szczebla 4).
- Blok JSON bez zmian.

## Korekta szczebli — uzupełnienie 3 (02.11.2026)

Podstawa: „Uzupełnienie 3 szczebli” koordynatora linii 1.1 (Mikolo: blog 5; Barbell Logic: warunkowo 4 per strona — autor z kwalifikacjami i data).
Barbell Logic sprawdzone WebFetch 02.11.2026: brak podpisu autora i daty (tylko „©2026 Barbell Logic”).

Źródła:
- mikolo-smith-bench-press, mikolo-smith-incline-press: 4 → 5; usunięte z bloku JSON.
- barbelllogic-floor-press: 4 → 5.

Ćwiczenia:
- Smith Machine Bench Press: gotowe → gotowe (każde zdanie ma Major Fitness + RitFit; `bp.elbowsMid` wycofane — zostało tylko Major Fitness).
- Smith Machine Incline Press: gotowe → otwarte (ruch, chwyt, kontrola i błąd tylko z Major Fitness; z 2 źródeł tylko ustawienie); wpis usunięty z bloku JSON.
- Floor Press (sztanga): otwarte → otwarte (ustawienie i ruch nadal z 2 źródeł szczebla 4 — BarBend + Performance Menu; `bench.floor.pause` spadło do 1 źródła).
- Pozostałe: bez zmian.
