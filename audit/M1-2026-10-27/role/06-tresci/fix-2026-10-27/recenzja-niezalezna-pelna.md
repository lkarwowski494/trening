# Niezależna recenzja figur v1: pełna lista poprawionych i figury z krokiem (28.10.2026)

Recenzent: audytor (opus), świeży kontekst, tylko odczyt. Stan: commit **df28c66f** (pliki z `git archive df28c66f lib docs/research/figury-recenzja.json`, nie z kopii roboczej, w której trwa scalanie). Uzupełnienie próbki `recenzja-niezalezna-3a.md` (Lunges (hantle), Hip Thrust (sztanga) i Overhead Press (sztanga) już tam ocenione, więc tu ich nie powtarzam).

## Metoda
- Geometria: `lib/figures/geom.ts` z df28c66f przetranspilowany bez zmian (typescript.transpileModule); pozy pośrednie z `poseBetween`, czyli tą samą funkcją, której używa `figureAt` w aplikacji, co 0,05 w każdym przejściu (pętla ping-pong, więc powrót to ta sama droga od końca). Dane: `lib/figures/data.json` (runtime, po filtrze recenzji). Rodziny v2 `ready` w df28c66f: tylko squat, bench_press i hinge, więc wszystkie oceniane tu ćwiczenia rysują figurę v1.
- Pomiary (`recenzja-pelna/skrypty/an.js`): kontakty z podłożem (punkt ≤ 1,5 j. nad podłogą albo blatem przyrządu), przybliżony środek ciężkości ze stałego podziału mas segmentów (uproszczenie) i jego odległość od podpory, wysokość wolnej stopy, ślizg punktów podparcia (tych, które mają kontakt na obu końcach przejścia), przenikanie ciała przez prostokąty przyrządów i pod podłogę. Dla figur wiszących na drążku sprawdzałem rozrzut środka ciężkości względem drążka (`hang.js`). Arkusze PNG (`render.js` + `draw.py` z recenzji 3a, zmienione tylko ścieżki): pozy kluczowe i k = 0,25/0,5/0,75.
- Kryterium podparcia (z polecenia): gdy wolna stopa jest > 2 j. nad podłogą, biodro nie opada, a jego rzut nie odchodzi od podpory o więcej niż ok. 10 j.
- Karta: `lib/cues/data.json` + `lib/cues/text/pl.json`/`en.json`, mięśnie `lib/seed.ts` (MUSCLES) i `lib/figures/v2/muscles.generated.ts`.
- Jednostka „j.” = 1/100 wzrostu (ok. 1,75 cm). Detektor kontaktu nie zna siedzisk ani oparć (biodro na siedzisku, łopatki na ławce), więc przy figurach siedzących i hip thrust jego „środek ciężkości poza podporą” to artefakt. Takie figury oceniałem z rysunku i punktów.

## Werdykty (od najpoważniejszego)

| ćwiczenie | werdykt | poziom | pewność | realność | dowód |
|---|---|---|---|---|---|
| Incline Push Up | **do poprawy, blokuje wyświetlanie** do poprawki albo ukrycia | WYSOKIE | 90% | realny (każde otwarcie karty) | `InclinePushUp.png` (end), `pomiary/incline-push-up-punkty.txt` |
| Step Up | **do poprawy, blokuje wyświetlanie** | WYSOKIE | 85% | realny | `StepUp.png` (mid i start→mid), `pomiary/step-up-punkty.txt`, `pomiary/Step Up.txt` |
| Reverse Lunge (nie było w tabeli poprawek; rola 06: „Ruch i karta zgodne”) | **do poprawy, blokuje wyświetlanie** | WYSOKIE | 90% | realny | `ReverseLunge.png` (mid→end), `pomiary/Reverse Lunge.txt` |
| Walking Lunges | **do poprawy, blokuje wyświetlanie** (te same klatki co Lunges (hantle), czyli ta sama wada co w 3a) + brak cechy odróżniającej | WYSOKIE | 85% | realny | `WalkingLunges.png`, `pomiary/Walking Lunges.txt` |
| Seated Cable Row / Wiosłowanie na linkach (siedząc) | OK z uwagami | NISKIE | — | — | `SeatedCableRow.png` |
| Bulgarian Split Squat (hantle) | OK z uwagą | NISKIE | — | — | `BulgarianSplitSquathantle.png` |
| Triceps Dips (ławka) | OK z uwagą | NISKIE | — | — | `TricepsDipsawka.png`, `pomiary/Triceps Dips (ławka).txt` |
| Hip Thrust (hantel) | OK (uwagi jak dla sztangi w 3a) | NISKIE | — | — | `HipThrusthantel.png` |
| Machine Chest Press | OK z uwagą | NISKIE | — | — | `MachineChestPress.png` |
| Pull Up, Chin Up, Neutral Grip Pull Up | OK | — | — | — | `PullUp.png`, `ChinUp.png`, `NeutralGripPullUp.png`, `pomiary/drazek-com.txt` |
| Lat Pulldown | OK | — | — | — | `LatPulldown.png` |
| Overhead Press (hantle), Seated Shoulder Press (hantle), Wyciskanie nad głowę (linki) | OK | — | — | — | odpowiednie PNG |
| Push Up | OK | — | — | — | `PushUp.png` |
| Leg Press | OK | — | — | — | `LegPress.png` |
| Pistol Squat (jedna noga wysunięta) | OK | — | — | — | `PistolSquat.png` |
| Mountain Climbers, Bird Dog (kończyna uniesiona; podobne) | OK (Bird Dog: kosmetyka już w backlogu) | — | — | — | odpowiednie PNG |

### 1. Incline Push Up: WYSOKIE (pewność 90%)
**Wada:** w pozycji końcowej (dół ruchu) figura leży biodrami na podwyższeniu, dłonie ma przy biodrach, a klatkę wysuniętą daleko za krawędź. Punkty „end” (`pomiary/incline-push-up-punkty.txt`): dłoń (15,8; 33,0), **biodro (16,4; 31,2)** przy blacie y = 30 (x 8–24), **bark (44,0; 43,0)**, czyli 28 j. (ok. 49 cm) przed dłońmi i 20 j. za krawędzią podwyższenia. Ramię w wyproście w tył o 44°, łokieć sterczy nad plecami (trójkąt nad tułowiem na `InclinePushUp.png`, kadry „mid->end 0.5/0.75” i „end”). Tułów schodzi 2,3 j. pod blat (przenikanie przez róg, `an.js`).
**Niezgodność z kartą:** `ipush.move` mówi „Opuść klatkę do krawędzi podwyższenia”, a w figurze to biodra lądują na krawędzi i klatka wisi za nią. Przy `ipush.setup` dłonie są „o krawędź”, ustawienie startowe jest poprawne (ręce pionowo pod barkami, t = 49°).
**Przyczyna w danych:** figura obraca się wokół palców stóp (kotwica toe, stały promień do barku ok. 85 j.), a podwyższenie stoi za blisko stóp. Przy t = 23° bark musi wylądować daleko za dłońmi. Pozycja końcowa jest ta sama co przed poprawką (baza 862f119). Rola 06 dodała tylko „mid” i mierzyła ślizg dłoni (2,2 j., to się zgadza), a nie położenie klatki względem dłoni.
**Kroki w aplikacji:** Biblioteka → Incline Push Up → karta → animacja albo statyczny widok „Pozycja końcowa”.
**Opcje:** (a) ukryć figurę (wskazówki zostają), tanio; (b) odsunąć podwyższenie od stóp albo zwiększyć t końcowe tak, żeby bark był 0–8 j. przed dłonią, a klatka tuż nad krawędzią. Dodatkowo reguła regresji „bark w dolnej pozycji pompek ≤ ok. 10 j. przed dłonią”.

### 2. Step Up: WYSOKIE (pewność 85%)
**Wada:** pozycja „w trakcie” (dodana przez rolę 06) i całe przejście start → mid → end pokazują wchodzenie na skrzynię ze środkiem ciężkości daleko za jedyną podporą. Stopa na skrzyni: pięta x = −2, palce x = 12, y = 26. Tylna stopa odrywa się od razu (k = 0,1: pięta 1,9 j.; k = 0,2: 4,1 j.), a potem:

| klatka | biodro (x, y) | środek ciężkości x | tylna stopa (pięta) nad podłogą | biodro za piętą podpory |
|---|---|---|---|---|
| start→mid 0,5 | (−19,1; 60,7) | −16,9 | 12,6 | 17,1 j. |
| mid | (−21,5; 66,7) | −20,2 | 31,8 | **19,5 j.** |
| mid→end 0,5 | (−12,1; 76,4) | −10,0 | 35,8 | 10,1 j. |
| end | (1,0; 80,0) | 3,1 | — (noga uniesiona) | 0 |

Figura stoi prosto (t = 90) na jednej nodze na skrzyni, biodro ok. 34 cm za piętą, i w tym ułożeniu unosi się o 13 j. (start→mid), a potem jeszcze wyżej. Fizycznie to upadek w tył. Przy wchodzeniu ciężar przenosi się nad przednią stopę (tułów pochyla się, biodro idzie w przód), a dopiero potem noga się prostuje. Kryterium podparcia jest przekroczone dwukrotnie (rzut biodra 19,5 j. > 10 j., wolna stopa do 32 j. w górze). Widać to wprost na statycznym kadrze „W trakcie”: postać „siedzi w powietrzu” z jedną stopą na skrzyni (`StepUp.png`, kadr „mid”).
**Niezgodność z kartą:** `stepup.move` („Postaw całą stopę na podwyższeniu i wejdź, prostując tę nogę”) nie opisuje przeniesienia ciężaru, ale figura pokazuje ruch niewykonalny bez odbicia tylną nogą, a tylna noga od początku jest w powietrzu.
**Uwaga NISKIE:** w pozycji wyjściowej palce tylnej stopy wchodzą 2,3 j. w przednią ścianę skrzyni (toe2 x = 0,3, ściana x = −2).
**Kroki:** Biblioteka → Step Up → karta → animacja albo statyczny widok „W trakcie”.
**Opcje:** (a) ukryć; (b) mid = tułów pochylony ok. 20–30°, biodro nad przednią stopą (rzut ≤ 10 j. od pięty), tylna stopa jeszcze na podłodze albo na palcach, a uniesienie tylnej nogi dopiero w drugim przejściu.

### 3. Reverse Lunge: WYSOKIE (pewność 90%)
Tego ćwiczenia nie było w tabeli poprawek. Rola 06 oceniła je „Ruch i karta zgodne” z kosmetyką 3,1 j. **Wada:** ta sama co w Lunges (3a), w lustrzanym kierunku. Ciało opuszcza się do wykroku, zanim tylna stopa dotknie podłogi, a środek ciężkości jest za jedyną podporą (przednia stopa, x od −14 do 0). Pomiary `pomiary/Reverse Lunge.txt`, przejście mid → end:

| k | biodro y | palce tylnej stopy nad podłogą | środek ciężkości za piętą przedniej stopy |
|---|---|---|---|
| 0,0 | 53,5 | 19,7 | 3,1 j. |
| 0,5 | 45,5 | 13,1 | 8,0 j. |
| 0,75 | 38,4 | 7,1 | 8,7 j. |
| 0,9 | 33,5 | 2,9 | 8,4 j. |
| 1,0 | 30,0 | 0,0 | (dwie podpory) |

Biodro opada o ok. 20 j. (35 cm), kiedy wolna stopa jest > 2 j. nad podłogą, a stopa „ląduje” dopiero w dolnej pozycji. W powrocie (end → mid) tylna stopa odrywa się od razu, przy biodrze na wysokości 33 j. Pozycja „w trakcie” to wymach podudzia w tył (kolano 75°, palce 19,7 j. nad podłogą), a nie krok. Kadry „mid->end 0.25/0.5/0.75” na `ReverseLunge.png`.
**Niezgodność z kartą:** `lunge.back` mówi „Zrób krok w tył i opuść się…; wróć, odpychając się przednią nogą”, czyli krok, postawienie stopy i dopiero opuszczenie.
**Dodatkowo (ŚREDNIE, nie blokuje osobno):** w przejściu start → mid, przy k = 0,1–0,45, przednia (podporowa) stopa unosi się 1,9–3,1 j. nad podłogę, a jedynym kontaktem są palce tylnej stopy, które jadą po podłodze 22 j. w tył (x z −5,9 do −28,0). To efekt `lift`; rola 06 opisała go jako „przesunięcie przedniej stopy 3,1 j.”.
**Kroki:** Biblioteka → Reverse Lunge → karta → animacja. Ten sam rysunek jest też przykładem w teście „Ogranicz ruch” (`tests/figures.test.tsx`, według `wynik.md`).
**Opcje:** jak w 3a: (a) ukryć; (b) mid = tylna stopa postawiona (palce na podłodze), biodro wysoko; (c) 4. pozycja w silniku v1.

### 4. Walking Lunges: WYSOKIE (pewność 85%)
Klatki są identyczne z Lunges (hantle) (`like`, własne `frames` to kopia z innym id zdania), więc ma tę samą wadę co w 3a: mid→end przy k = 0,5 przednia pięta 16,0 j. nad podłogą, a biodro 13,5 j. przed jedyną podporą; przy k = 0,8 odpowiednio 7,4 j. i 24,2 j. (`pomiary/Walking Lunges.txt`, środek ciężkości do 28 j. przed podporą).
**Dodatkowo (ŚREDNIE):** brak cechy odróżniającej od Lunges. Karta `lunge.walk` mówi „wstań na przedniej nodze i od razu zrób krok drugą”, a figura w pętli ping-pong wraca do stania w miejscu startu (cofa krok). Notatka figury („Jeden krok pętli; kolejny krok drugą nogą wygląda tak samo”) tego nie usprawiedliwia, bo powrót nie jest krokiem w przód.
**Kroki:** Biblioteka → Walking Lunges → karta → animacja.

### 5. Uwagi NISKIE (nie blokują, backlog)
- **Seated Cable Row** (i wariant „linki”): całe stopy są po drugiej stronie podnóżka. Podnóżek x = 46, kostka 48,9, pięta 53,7, palce 49,1, czyli stopy „wchodzą” w podnóżek zamiast się o niego opierać. Biodro 5 j. nad blatem siedziska (kreska tułowia ok. 2 j. nad nim, widoczna szczelina). Ruch (tułów pionowo, linka poziomo 1,6°, łokcie w tył) zgodny z kartą.
- **Bulgarian Split Squat:** tylna stopa na ławce przez cały ruch (kostka x −48…−51, ok. 3 j. ruchu), biodro opada pionowo, tylne kolano 5,2 j. nad podłogą na dole, środek ciężkości między stopami. Poprawka roli 06 potwierdzona. Kosmetyka: na dole tylne podudzie przecina przedni róg ławki (do 1,8 j., k ≥ 0,4 w mid→end).
- **Triceps Dips (ławka):** pięty unoszą się do 2,0 j. w połowie przejścia i wracają (ślizg 2,7 j., zgodnie z rolą 06). Dłonie stale na krawędzi, łokieć 90° na dole, biodra przy krawędzi. Karta zgodna.
- **Hip Thrust (hantel):** stopy płasko w miejscu, hantel na biodrach, na górze bark–biodro–kolano w linii. Głowa wchodzi w ławkę na górze (jak dla sztangi w 3a).
- **Machine Chest Press:** w pozycji wyjściowej łokieć 3,9 j. za linią oparcia (x −9,9 przy oparciu −6). Przy łokciach odwiedzonych w bok to rzut, a nie błąd. Tor uchwytu poziomy, łokieć 5° na końcu.

### 6. OK, bez uwag blokujących
- **Pull Up / Chin Up / Neutral Grip Pull Up:** środek ciężkości pod drążkiem w całym ruchu (x od −2,3 do 4,7 względem drążka, rozrzut 7,0 j.; Chin/Neutral 8,6 j.), czyli fizycznie spójny zwis bez bujania. Twarz nie wchodzi w drążek (min. 5,4 j. od obrysu głowy do środka drążka), broda nad drążkiem na końcu. Chin Up i Neutral Grip mają tę samą figurę. Chwyt jest niewidoczny z boku (uproszczenie), a cechę odróżniającą niesie karta.
- **Lat Pulldown:** siedzi stabilnie pod wałkiem, drążek z góry przed twarzą do górnej części klatki, linka niemal pionowo.
- **Overhead Press (hantle), Seated Shoulder Press (hantle), Wyciskanie nad głowę (linki):** łokcie pod nadgarstkami, tor pionowy, stopy (siedzisko) w miejscu. Hantle i uchwyty nachodzą na obrys głowy tylko w rzucie z boku (ciężar obok głowy przy odwiedzionych rękach, `armProj`). Linka z dolnego bloczka przecina sylwetkę, co notatka nazywa uproszczeniem.
- **Push Up:** dłonie w miejscu (≤ 1,0 j.), ciało w linii, na dole bark 8,6 j. przed dłonią i 12 j. nad podłogą.
- **Leg Press:** platforma przy stopach w każdej klatce, kolano 6° → 89°, oparcie równoległe do tułowia.
- **Pistol Squat:** środek ciężkości nad stopą podporową w każdej pozie pośredniej, wolna noga prosto w przód nad podłogą (zgodnie z `pistol.setup`).
- **Mountain Climbers:** dłonie w miejscu, biodra na stałej wysokości. Przy k ≈ 0,5 obie nogi chwilowo w tym samym położeniu, co w dynamicznym ćwiczeniu jest akceptowalne.
- **Bird Dog:** podpora na kolanie i przeciwnej dłoni przez cały ruch, przeciwne kończyny. Kosmetyka już w backlogu.

### Karty (opis, wskazówki, mięśnie)
Zdania kart pl/en dla Step Up, Reverse Lunge, Incline Push Up, BSS, Walking Lunges i Pistol Squat są poprawne i zgodne z ogólnie przyjętą techniką. Błędy są w figurach, nie w zdaniach. Mięśnie (MUSCLES w `lib/seed.ts`: czworogłowe + pośladki dla wykroków, step up i BSS; klatka + triceps dla Incline Push Up) i obciążenia v2 (np. Step Up: glutes 1, quads 1) są wiarygodne. Źródeł nie otwierałem.

## Wniosek dla mechanizmu
Rozbieżności z recenzją roli 06 w tej części: **4 z 20 ocenionych pozycji** (Incline Push Up, Step Up, Reverse Lunge, Walking Lunges; ta ostatnia wynika z Lunges z 3a). Łącznie z 3a: 5 ćwiczeń z wadą WYSOKIE w zbiorze wyświetlanych figur v1. Dwie luki kryteriów:
1. **Podparcie** (już w 3a): dotyczy wszystkich figur z krokiem: Lunges, Walking Lunges, Reverse Lunge i Step Up. BSS i Pistol przechodzą. Reguła z 3a wyłapuje wszystkie trzy nowe przypadki (Step Up: rzut biodra 19,5 j.; Reverse Lunge: biodro opada 20 j. przy wolnej stopie > 2 j.).
2. **Położenie ciała względem przyrządu w pozycji kluczowej**: Incline Push Up przechodzi testy ślizgu i `low shoulder y 30 tol 14` (bark 13 j. nad blatem), ale bark jest 28 j. za dłońmi. Propozycja reguły: w podporach na rękach (pompki) bark w dolnej pozycji nie dalej niż ok. 10 j. od dłoni w poziomie.

## Czego nie sprawdziłem
Wyglądu w aplikacji na symulatorze (Linux; geometria jest ta sama co w `figureAt`), źródeł zdań kart (nie otwierane), tłumaczeń poza pl/en, testów jest (nie uruchamiane, bo oceniałem dane i rysunek). Podział mas do środka ciężkości to uproszczenie: wnioski o wadach opierają się też na samym położeniu biodra i stóp, które od niego nie zależą. Strony techniqueatlas nie sprawdzałem (według `wynik.md` nie eksportuje figur v1).

## Odtworzenie
`recenzja-pelna/skrypty/`: `an.js "<ćwiczenie>" 0.05` (tabela podparcia, ślizgu i przenikania), `pts.js` (punkty i kąty), `hang.js` (zwis), `render.js` + `draw.py` (arkusze). Wymagają zmiennej `S` z katalogiem, w którym są `r/geom.cjs` (transpilacja `lib/figures/geom.ts` z df28c66f) i `src/lib/figures/data.json` (z `git archive df28c66f`).
