# Niezależna recenzja kontrolna figur v1 (decyzja właściciela 3a, 28.10.2026)

Recenzent: audytor (opus), świeży kontekst, tylko odczyt. Stan: checkout `naprawy/M2-scalenie-1-0` = commit **df28c66f** (commit 562798d z poprawkami roli 06 jest jego przodkiem — `git merge-base --is-ancestor` OK). Wzorzec: bramka 4, lista recenzenta z `origin/przekazanie-konta:docs/przekazanie/notatki/53-grafiki-model-pracy.md`.

## Losowanie
Pula: 21 figur oznaczonych w `wynik.md` jako „poprawiona” (kolejność jak w tabeli wyniku, indeksy 0–20). Tasowanie Fishera–Yatesa generatorem Lehmera (48271 mod 2^31−1) z ziarnem `Date.now()` = **1793164365172** (zamiast Math.random — żeby wynik dało się odtworzyć). Pierwsze trzy:
**19 Lunges (hantle) · 13 Hip Thrust (sztanga) · 4 Overhead Press (sztanga)**.

## Metoda
- Geometria: `lib/figures/geom.ts` z df28c66f przetranspilowany (typescript.transpileModule) i wywołany bez zmian; klatki kluczowe i pozy pośrednie z `poseBetween` (ta sama funkcja, której używa `figureAt` w aplikacji), dane z `lib/figures/data.json` (runtime). Rysunek PNG własnym skryptem (PIL) — niezależnie od narzędzi roli 06. Pozy pośrednie k = 0,25/0,5/0,75, pomiary gęsto co 0,05–0,1.
- Pliki: `recenzja-3a/{lunge,ht,ohp}-sheet.png` (arkusze), `recenzja-3a/*.txt` (punkty i kąty każdej pozy), `recenzja-3a/pomiary-gesto.txt`, skrypty `render.js`, `draw.py`, `fine.js` (w tym samym katalogu).
- Karta: `lib/cues/data.json` + `lib/cues/text/pl.json`/`en.json`, mięśnie `lib/seed.ts` i `lib/figures/v2/muscles.generated.ts`.
- Jednostka „j.” = 1/100 wzrostu (ok. 1,75 cm). Nie sprawdzałem: obrazu w aplikacji na symulatorze (Linux), źródeł wskazówek (nie otwierałem stron), innych języków niż pl/en.

## Werdykty

| ćwiczenie | werdykt | poziom | pewność | realność |
|---|---|---|---|---|
| Lunges (hantle) (i dziedziczące Walking Lunges) | **do poprawy** — wg mnie blokuje wyświetlanie do poprawki albo ukrycia | WYSOKIE (błędny ruch w materiale uczącym) | 85% | realny — każdy, kto otworzy kartę |
| Hip Thrust (sztanga) (i Hip Thrust (hantel)) | **OK** z uwagami kosmetycznymi | NISKIE | — | — |
| Overhead Press (sztanga) | **OK** z uwagą | NISKIE | — | — |

### 1. Lunges (hantle) — do poprawy
**Ruch (figura).** Kotwica `toe2` (palce tylnej nogi), 3 pozycje: start (stanie), mid (stanie na tylnej nodze, przednie kolano uniesione), end (wykrok). Pozycje kluczowe są poprawne: end — tułów pionowy (t = 90), tylne kolano 5,1 j. nad podłogą, przednia stopa płasko (heel/toe y = 0), przednie kolano 110° zgięcia, długość kroku ok. 50 j. — zgodne z kartą.
**Wada: ciało opuszcza się do wykroku, zanim przednia stopa dotknie podłogi** (przejście mid → end, i to samo w drodze powrotnej end → mid). Pomiary (`recenzja-3a/pomiary-gesto.txt`, `lunge-sheet.png` kadry „mid->end 0.5/0.75”):

| k | biodro y | pięta przednia y | tylne kolano (zgięcie) | biodro przed jedyną podporą (palce tylnej stopy) |
|---|---|---|---|---|
| 0,5 | 50,4 | 16,0 | 54° | 13,5 j. |
| 0,7 | 43,5 | 10,8 | 73° | 21,4 j. |
| 0,8 | 39,2 | 7,4 | 83° | 24,2 j. |
| 1,0 | 30,0 | 0,0 | 102° | 27,5 j. |

Przez większość przejścia jedyną podporą są palce tylnej stopy, a biodro (środek ciężaru) jest do 24 j. (ok. 42 cm) przed nią, z tylnym kolanem zgiętym do 83° i przednią stopą 7–16 j. (12–28 cm) w powietrzu — fizycznie to upadek w wykrok, stopa „ląduje” dopiero w dolnej pozycji. W powrocie przednia stopa odrywa się od razu, gdy biodro jest jeszcze nisko (k = 0,9: stopa 3,8 j. w górze, biodro 34,7), więc „odepchnięcie się przednią nogą” z karty nie ma podparcia.
**Niezgodność z kartą:** `lunge.fwd` „Zrób krok w przód **i opuść się**…; **odepchnij się przednią nogą** do pozycji wyjściowej” — kolejność krok → postawienie stopy → opuszczenie; figura pokazuje opuszczanie w trakcie kroku i odpychanie bez kontaktu stopy. Rola 06 sama to zapisała jako cechę („stopa ląduje na końcu”, `docs/research/figury-recenzja.json`, wpis Lunges (hantle)) i uznała za poprawne — tu się nie zgadzam. To ten sam rodzaj wady (podpora / fizyka ruchu), który rola 06 przyjęła jako kryterium dla innych figur (ślizg, przenikanie).
**Przyczyna w danych:** `lib/figures/data.json`, „Lunges (hantle)”, klatka `mid` (`hip:[55,10], knee:[94,5]`, stopa ok. 15 j. nad podłogą) → `end`; interpolacja kątów przenosi jednocześnie opuszczenie bioder i opadanie stopy. Przy limicie 3 pozycji silnika v1 (ten sam, który rola 06 podała przy Push Press) nie ma klatki „stopa postawiona, ciało jeszcze wysoko”.
**Kroki w aplikacji:** Biblioteka → Lunges (hantle) (albo Walking Lunges — `like: "Lunges (hantle)"`) → karta → animacja techniki.
**Opcje:** (a) ukryć figurę (wskazówki zostają) jak Push Press — tanio, spójnie z pkt 7a; (b) mid = krok postawiony (przednia stopa na podłodze, biodra wysoko, tylna pięta uniesiona) — wymaga sprawdzenia, czy przejście start → mid nie przeciąga stopy po podłodze (wcześniejsza wada „stopa sunie”); (c) 4. pozycja w silniku v1. Rekomendacja: (a) przed wydaniem, (b)/(c) w backlogu.
Uwaga dla Walking Lunges: w pętli ping-pong figura cofa się do startu, co odpowiada wykrokowi w miejscu, nie marszowemu — nie oceniam jako wady (to nie było losowane), ale warto przy poprawce.
**Karta:** opis i wskazówki poprawne i zgodne z ogólnie przyjętą techniką; „kolano w linii palców” jest w płaszczyźnie czołowej, notatka figury mówi to uczciwie. Mięśnie: czworogłowe + pośladki główne; obciążenia v2 (glutes 1, quads 1, adductors 0,5) — wiarygodne. Bez porad medycznych. Kosmetyka: hantel dalszej ręki rysowany na hantlu bliższej (oba w tym samym punkcie, dalszy na wierzchu — widać tylko szary), bez wpływu na ocenę.

### 2. Hip Thrust (sztanga) — OK
**Ruch:** łopatki na krawędzi ławki przez cały ruch (bark 3,8–4,0 j. nad blatem, x od −22 do −24,7 przy krawędzi −20 — punkt podparcia stały), stopy płasko w miejscu (pięta/palce y = 0 we wszystkich pozach), biodra unoszą się z 12,8 do 27,8 j., na górze bark–biodro–kolano w linii (176°), tułów poziomo, wyprost biodra −4° (bez przeprostu). Poprawka roli 06 potwierdzona: dłonie na gryfie w każdej pozie, także pośrednich (np. k = 0,5: dłoń (3,8; 29,6), gryf (3,7; 29,7)). Cecha odróżniająca od mostu biodrowego (ławka pod łopatkami, sztanga na biodrach) — widoczna.
**Uwagi (NISKIE, nie blokują):**
- Głowa na górze leży w przedłużeniu tułowia i wchodzi w ławkę o 2,7 j. (ok. 5 cm): dół głowy y = 21,3 przy blacie y = 24 (`ht.txt`, „end”; `ht-sheet.png`, ostatni kadr). Kosmetyka rysunku.
- Podudzia na górze 62° od poziomu (kolano 11,7 j. przed kostką, zgięcie 114°) — powszechna wskazówka trenerska to podudzia mniej więcej pionowo na górze; notatka figury oznacza kąt kolan jako ilustracyjny, karta tego nie twierdzi. Pewność, że to błąd, poniżej progu (ok. 75%) — tylko obserwacja.
**Karta:** setup, ruch, „ruch tylko w biodrach”, „przytrzymuj ciężar dłońmi”, błąd „przeprost w lędźwiach” — zgodne z figurą i ogólnie przyjętą techniką. Mięśnie: pośladki (główne), dwugłowe 0,5 — wiarygodne. Bez porad medycznych.

### 3. Overhead Press (sztanga) — OK
**Ruch:** start — gryf na przedniej części barków (dotyk 4,2 j.), przedramiona prawie pionowo (odchylenie 3°), stoi prosto (bark–biodro–kostka 180°); koniec — łokcie wyprostowane (0°), gryf nad barkiem (Δx 2,6 j.) i nad kostką/środkiem stopy, stopy w miejscu. Tor gryfu (x co 0,05): −3,7 → −3,1 (maks. wybieg do przodu 0,6 j.) → wokół twarzy do −11,2 nad czubkiem głowy → −8,6 → −11,0. Twierdzenia roli 06 potwierdzone: min. odległość gryfu od środka głowy 7,50 j., wybieg 0,6 j. Gryf nie wchodzi w twarz (środek gryfu 1,0–1,2 j. poza obrysem głowy; kreska przedramienia dotyka obrysu — kosmetyka).
**Uwaga (NISKIE):** w pozycji „w trakcie” łokieć jest 11 j. (ok. 19 cm) przed gryfem, przedramię odchylone od pionu o 34° (`ohp.txt`, „mid”: łokieć (−0,1; 87,9), dłoń (−11,2; 104,5)), a gryf cofa się ok. 7,5 j. przy nieruchomej głowie zamiast „głowa w tył, gryf prosto”. Ogólnie przyjęta wskazówka to przedramiona możliwie pionowo pod gryfem. To uproszczenie rzutu z boku (`armProj`, szeroki chwyt), krótkotrwałe w animacji; nie uczy błędu wprost. Backlog, nie bloker.
**Karta:** zgodna z figurą i techniką; „ciężar idzie prosto w górę” kierunkowo zgodne (tor zakrzywiony wokół głowy, notatka figury nazywa to uproszczeniem). Pomniejsza niespójność: karta „chwyt na szerokość barków lub trochę szerzej”, notatka „chwyt szerzej niż barki” — bez wpływu. Mięśnie: barki główne, triceps drugorzędny — wiarygodne. Bez porad medycznych.

## Wniosek dla mechanizmu (bramka 4, pomiar szczelności)
Rozbieżność z pierwszą recenzją: 1 z 3 (Lunges). Luka: kryteria roli 06 mierzyły ślizg i przenikanie w pozach pośrednich, ale nie **podparcie**: czy ciało opuszcza się/podnosi, gdy jedyną podporą jest punkt daleko od środka ciężaru, a druga stopa jest w powietrzu. Propozycja reguły (zgodnie z notatką 53, „rozbieżność = luka → nowa reguła”): w pozach pośrednich figur z krokiem — jeżeli stopa nie-kotwicy jest > 2 j. nad podłogą, biodro nie może obniżać się względem pozy startowej o więcej niż kilka jednostek, a jego rzut poziomy nie może odejść od kotwicy o więcej niż ok. 10 j. Uruchomić na wszystkich figurach v1 z krokiem (Lunges, Walking Lunges, Reverse Lunge, Step Up, Bulgarian Split Squat).

## Czego nie sprawdziłem
Wyglądu w aplikacji (Linux; geometria ta sama co `figureAt`), źródeł zdań karty (nie otwierane), tłumaczeń poza pl/en, testów jest (nie uruchamiane — oceniałem dane i rysunek, nie testy autora).
