# Niezależna recenzja ruchu po poprawce figur v1 (28.10.2026)

Recenzent: audytor (opus), świeży kontekst, tylko odczyt, nie autor poprawki. Stan: `origin/naprawy/M2-po-decyzjach-figury` = **7243bda8** (worktree `/home/user/wt-recenzja-4`, detached). `lib/figures/data.json` zgodny z `data/zrodla/figures.json` dla czterech figur (klatki i przyrządy porównane).

## Metoda
- `lib/figures/geom.ts` z 7243bda8 przetranspilowany bez zmian. Pozy pośrednie z `poseBetween` co 0,05 w każdym przejściu. Ping-pong odtwarza te same pozy w odwrotnej kolejności, więc oceniałem oba kierunki.
- Pomiary: skrypt `an.js` z recenzji pełnej, uruchomiony na nowych danych (styki ≤ 1,5 j., przybliżony środek ciężkości z podziału mas segmentów, ślizg, przenikanie). Do tego własne `su.js` (środek ciężkości Step Up, także z hantlami = 27% masy ciała w dłoniach) i `ip.js` (głębokość pompek w porównaniu z zaakceptowaną figurą Push Up). Arkusze PNG zrobiłem sam (`render.js` + `draw.py` z recenzji 3a), nie z arkuszy autora.
- Pliki: `recenzja-po-poprawce/` (arkusze `*-sheet.png`, `pomiary/*.txt`, `skrypty/`).
- Karta: `lib/cues/data.json`, `lib/cues/text/{pl,en}.json`, mięśnie `lib/seed.ts` i `lib/figures/v2/muscles.generated.ts`.
- Testy: `npx jest tests/figury-podparcie.test.ts tests/figures --maxWorkers=1`: 12 zestawów, 213 testów, wszystkie zielone.
- Jednostka „j.” = 1/100 wzrostu (ok. 1,75 cm).

## Werdykty

| ćwiczenie | werdykt | poziom | pewność | realność |
|---|---|---|---|---|
| Step Up | **do poprawy, blokuje** (poprawić albo ukryć figurę) | WYSOKIE | 85% | realny — każde otwarcie karty, animacja |
| Walking Lunges | wyświetlana z wadą ŚREDNIE (bez cechy odróżniającej, powrót krokiem w tył) → backlog z wersją | ŚREDNIE | 90% | realny |
| Lunges (hantle) | **OK (wyświetlana)**, uwagi NISKIE | NISKIE | — | — |
| Incline Push Up | **OK (wyświetlana)**, uwagi NISKIE | NISKIE | — | — |

### 1. Step Up — WYSOKIE: wejście ze środkiem ciężkości za piętą jedynej podpory
**Ruch.** Tylna stopa odrywa się już przy k = 0,05: pięta 2,8 j., przy k = 0,25 już 14,1 j. Od tej chwili jedyną podporą jest stopa na skrzyni (pięta x = −2, palce x = 12). Tułów pozostaje prawie pionowy (t 87 → 84). Biodro w pierwszej ćwiartce przejścia cofa się (x −10,9 → −11,3) i jednocześnie wznosi o ok. 10 j.:

| k (start→mid) | tylna pięta nad podłogą | biodro x | środek ciężkości x | to samo z hantlami | za piętą podpory |
|---|---|---|---|---|---|
| 0,05 | 2,8 | −11,2 | −8,7 | −9,3 | 6,7 / 7,3 j. |
| 0,15 | 8,4 | −11,2 | −8,8 | −9,4 | 6,8 / 7,4 j. |
| 0,25 | 14,1 | −10,8 | −8,5 | −9,1 | 6,5 / 7,1 j. |
| 0,40 | 22,5 | −9,1 | −7,2 | −7,7 | 5,2 / 5,7 j. |
| 0,50 | 27,8 | −7,4 | −5,8 | −6,3 | 3,8 / 4,3 j. |
| 0,70 | 37,4 | −3,0 | −2,0 | −2,4 | 0,0 / 0,4 j. |

(`pomiary/step-up-srodek-ciezkosci.txt`, `pomiary/gesto-step-up.txt`). Przez ok. 70% przejścia środek ciężkości jest do 7 j. (ok. 12–13 cm) za tylną krawędzią jedynej stopy podporowej i nie ma prędkości w przód (na początku cofa się). Fizycznie to wciąż upadek w tył, tylko mniejszy niż przed poprawką (wtedy 17–20 j.). Przy schodzeniu (ten sam odcinek w odwrotnej kolejności) jest tak samo: przysiad na jednej nodze na skrzyni z ciężarem za piętą, a stopa dotyka podłogi dopiero w pozycji startowej. Wadę widać na arkuszu `StepUp-sheet.png`, kadry „start->mid 0.25” i „0.5”: wyprostowana postać z biodrami za krawędzią skrzyni i tylną nogą w powietrzu.
**Dlaczego walidator tego nie łapie.** Reguła `comTol = 10 j.` liczy rzut samego biodra względem przedziału styków. Przy podporze na jednej stopie (14 j. długości) tolerancja 10 j. dopuszcza biodro 70% długości stopy poza nią. Tu biodro jest 9,3 j. za piętą, więc tuż pod progiem. Recenzja pełna proponowała do tego pochylenie tułowia o 20–30° i uniesienie tylnej nogi dopiero w drugim przejściu. Tego nie wdrożono: pozycja „w trakcie” to już prawie góra (kolano 3,6°, biodro 79,8 przy 80 w pozycji końcowej), więc całe przeniesienie ciężaru odbywa się w jednym przejściu, bez pochylenia.
**Niezgodność z kartą / techniką.** `stepup.move` („wejdź, prostując tę nogę”) zakłada, że ciężar jest na nodze ze skrzyni. Figura prostuje tę nogę, gdy ciężar jest za nią, a tego nie da się zrobić bez odbicia tylną nogą. Tylna noga jest jednak w powietrzu od k = 0,05.
**Kroki w aplikacji:** Biblioteka → Step Up → karta → animacja (przejście start → w trakcie i z powrotem).
**Opcje:** (a) ukryć figurę do poprawki — wskazówki zostają, tanio; (b) „w trakcie” = tułów pochylony ok. 20–30°, biodro/środek ciężkości nad stopą na skrzyni, kolano jeszcze zgięte, tylna stopa na palcach na podłodze; prostowanie i uniesienie tylnej nogi dopiero w przejściu mid → end. Do tego zaostrzyć regułę: środek ciężkości (nie biodro) w obrębie stopy podporowej ± ok. 2–3 j. przy podporze na jednej stopie. Rekomendacja: (b), jeśli mieści się przed wydaniem, inaczej (a).
**Pozostałe w Step Up (bez zastrzeżeń):** brak przenikania (tylna stopa mija blat o ok. 4 j. przy mid→end k = 0,5, palce tylnej stopy na starcie 6,9 j. przed ścianą skrzyni — wada NISKIE z recenzji pełnej usunięta). Brak ślizgu stopy na skrzyni (0,0). Kąty w zakresie. Kolano nogi na skrzyni w pozycji startowej ok. 2 j. przed palcami. Pozycja końcowa: noga uniesiona w zgięciu biodra 60°/kolana 90° — „uproszczenie” opisane w notatce, karta nie mówi, co robi druga noga (NISKIE, nie zgłaszam jako błąd). Mięśnie: czworogłowe + pośladki, obciążenia v2 wiarygodne.

### 2. Walking Lunges — ŚREDNIE (znane, nie blokuje)
Klatki są identyczne z Lunges (hantle); pomiary są takie same (`diff` plików `pomiary/` pusty). Ruch ma więc tę samą ocenę co pkt 3 (wada WYSOKIE z 3a usunięta). Wada ŚREDNIE potwierdzona: karta `lunge.walk` mówi „wstań na przedniej nodze i od razu zrób krok drugą”, a pętla ping-pong wraca do stania na miejscu startu, czyli robi krok w tył. Notatka figury opisuje to uczciwie, ale nie jest widoczna w aplikacji. **Uwaga procesowa:** nie znalazłem wpisu w `docs/21` z wersją. Według zasady progu ŚREDNIE trafia do backlogu z przypisaną wersją, a na razie jest tylko w `docs/research/figury-recenzja.json` (pole „uwagi”).

### 3. Lunges (hantle) — OK
- **Podparcie:** przednia stopa w powietrzu tylko w start→mid (k 0,15–0,90, maks. 5,3 j.). W tym czasie biodro opada z 57,5 do 49,3 (4,7 j. poniżej stania), a środek ciężkości przechodzi z −7,7 na +12,4 j. względem palców tylnej stopy. To przebieg jak w zwykłym kroku: ciało przechodzi nad tylną stopą, przednia stopa ląduje przed nim. Nie jest to opuszczanie się w wykrok. Pozycja „w trakcie”: przednia pięta 0,7 j., palce 0,3 j. nad podłogą, czyli postawiona. Opuszczanie (mid→end, biodro 46,0 → 30,9) odbywa się na obu stopach, środek ciężkości stale między nimi. Powrót: odpychanie przednią nogą przy stopie na podłodze, stopa odrywa się dopiero przy biodrze 46. Zgodne z `lunge.fwd`. Wada WYSOKIE z 3a usunięta.
- **Pozycja dolna:** tylne kolano 5,9 j. nad podłogą, tułów pionowo, przednia stopa płasko — zgodne z kartą.
- **Uwagi NISKIE (backlog, kosmetyka):** (1) w pozycji „w trakcie” tylna stopa jest pionowa, pięta nad palcami (`ft2 = −95`, pięta 13,9 j. nad podłogą, x 1,2 przy palcach 0,0), jak stanie „na czubkach palców”, a tylne udo zgięte w przód o 34° (kolano przed biodrem). Zgięcie podeszwowe stopy −40,5° mieści się w zakresie. Kadr „mid” na `Lungeshantle-sheet.png`. (2) Przednia stopa przy opuszczaniu przesuwa się do 2,1 j. w przód i wraca, palce schodzą 0,4 j. pod podłogę.
- **Karta:** opis i wskazówki zgodne z ruchem. „Kolano w linii palców” dotyczy płaszczyzny czołowej i notatka mówi to wprost. Mięśnie: czworogłowe + pośladki, v2 wiarygodne. Bez porad medycznych.

### 4. Incline Push Up — OK
- **Wada WYSOKIE z recenzji pełnej usunięta:** biodra cały czas przed podwyższeniem (biodro x 6,8–11,4 przy krawędzi 18,8). W dolnej pozycji bark jest 8,0 j. przed dłonią (wcześniej 28 j.). Brak przenikania: maksymalnie 0,07 j. przedramienia przy dłoni, czyli zero.
- **Głębokość:** bark 13,8 j. nad blatem, przybliżona klatka 7,1 j. nad blatem, łokieć zgięty 128°. To ta sama geometria co w zaakceptowanej figurze Push Up (bark 12,1, klatka 7,0, bark–dłoń 8,6 j.) (`pomiary/pompki-glebokosc.txt`). Ciało proste w każdej pozie (`push.rigid`), na starcie ręce pionowo pod barkami (Δx 1,9 j.).
- **Uwagi NISKIE:** (1) dłoń przesuwa się po blacie o 3,2 j. w poziomie i 2,1 j. w pionie (29,1–31,2 przy blacie 30), dla porównania w Push Up 1,8/0,2 j.; (2) dłonie leżą 7 j. od bliższej krawędzi blatu, nie „o krawędź” (`ipush.setup`), a klatka schodzi nad blat, nie do krawędzi — kierunkowo zgodne, szczegół; (3) w dolnej pozycji zgięcie grzbietowe stopy wynosi 37,4° przy granicy zakresu 37° (sztywna stopa obraca się na palcach). Nic z tego nie uczy błędu.
- **Karta:** zgodna z ruchem. Mięśnie: klatka + triceps (seed), w v2 dodatkowo przedni akton barku 0,5 — wiarygodne.

## Podsumowanie dla mechanizmu
Reguła podparcia dobrze złapała wady Lunges, ale przy podporze na jednej stopie tolerancja `comTol = 10 j.` liczona na biodrze jest za luźna. Step Up mieści się pod progiem (9,3 j.), a środek ciężkości jest i tak 7 j. za stopą. Propozycja: przy jednej stopie podporowej mierzyć środek ciężkości (podział mas jak w `an.js`) i dopuszczać ok. 2–3 j. poza stopą.

## Czego nie sprawdziłem
Obrazu na symulatorze (Linux; geometria jest ta sama co `figureAt`), źródeł zdań karty, tłumaczeń poza pl/en, arkuszy autora (oceniałem własne).
