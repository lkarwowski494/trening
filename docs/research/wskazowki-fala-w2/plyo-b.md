# Wskazówki techniki — plyo, część B (fala W2, G3)

Data: 02.11.2026. Autor: badacz-merytoryczny (fala W2, grupa G3 „moc”). Zakres: tylko zbieranie danych (bez zmian w kodzie, `data/zrodla/*.json`, `lib/**`, testach). Integruje koordynator linii 1.1.

Podstawa: stan W1 po przeliczeniu szczebli 02.11.2026 (plik roboczy plyo-cz2, sekcja „Korekta szczebli — przeliczenie koordynatora 02.11.2026”) — wszystkie 10 ćwiczeń tej części były po W1 **otwarte**. Kryterium karty: ustawienie + ruch (2 źródła szczebla 4 albo 1 źródło szczebla 3 bez sprzeczności), do aplikacji tylko z min. 1 błędem (w rodzinie są pozy figur v2).

Definicje ruchu sprawdzone w `lib/catalog.generated.ts` (wiersze 540–562: tylko sprzęt i wzorzec) i w generatorze póz `scripts/figures/agent-pozy/plyo.mjs` (PRZYBLIZENIA, wiersze 13–21; funkcje `pushOff` w. 64–69, `boxShuffle` w. 130–131, skoki w. 195–219). `docs/research/25-biblioteka` nie opisuje tych ćwiczeń (tylko poziom dowodów w L6).

## 1. Tabela ćwiczeń

| Klucz | Status po W2 | Co dodano / dlaczego |
|---|---|---|
| Single Leg Push-Off | **własna z błędami** | Ustawienie i ruch: ACE #230 + fragment książki T. Howleya u wydawcy Human Kinetics („Single-Leg Power Hop” — ten sam ruch, szczebel 4: trener przygotowania Cornell od 1995, magisterium z fizjologii wysiłku). Błąd wnioskowany z ruchu. |
| Box Skip | otwarta (jedno źródło; warunkowo karta — sekcja 2b) | Jedyne przeczytane źródło: J. Radcliffe, „High-Powered Plyometrics”, wyd. 3 (2025), s. 62 (fragment u wydawcy). Autor ustalony w W2: trener przygotowania University of Oregon 40 lat, magisterium z biomechaniki, certyfikaty NSCA/CSCCa/USAW → szczebel 4 (trener z kwalifikacjami); jeśli koordynator uzna za szczebel 3 (autor publikujący naukowo) — karta z 2b może wejść jako „jedno źródło (szczebel 3)”. |
| Side to Side Box Shuffle | otwarta | Nadal tylko inSPORTline (s. 3, druga „ALTERNATING PUSH-OFF”). Drugiego źródła ≥ 4 nie znalazłem (sekcja 5). |
| Single-Leg Stride Jump | otwarta | Fragment Radcliffe/Farentinos „Stride Jump” u wydawcy przekierowuje na stronę główną (usunięty). Innych źródeł ≥ 3 brak. |
| Alternate Leg Diagonal Bound | otwarta | Opisy tylko na stronach `theprehabguys.com/vimeo-video/…` / `library.…?p=` bez autora (5) i w serwisach z ćwiczeniami innych aplikacji (nie źródło). |
| Double Leg Butt Kick | otwarta | Brak przeczytanego opisu ≥ 3. Badanie Cureus 2023 (plyometria + pilates) wymienia „double butt kick” w tabeli 1 — PDF nieczytelny dla narzędzia, a tabela to zwykle tylko nazwy. |
| Single Leg Butt Kick | otwarta | Jak wyżej — brak źródła. |
| Side Standing Long Jump | otwarta | Brak źródła. Analogia do „Broad Jump” (kierunek w bok zmienia wybicie i lądowanie) — nie stosuję. |
| Side Hop-Sprint | otwarta | Brak źródła dla całego ćwiczenia. Część „skok bokiem obunóż” = ruch `plyo.coneLat.hop` (ACE #120 + NISMAT), ale bez ustawienia i bez części ze sprintem — nie składam karty. |
| Single-Leg Hop Progression | otwarta | Materiał szpitala dziecięcego w Filadelfii (StayWell, „Lower Extremity: Plyometric Phase: Advanced”) — 403. Program SHRED (Uniwersytet w Calgary) ma tylko skoki jednonóż przód–tył nad linią — inny ruch. |

Razem: własne z błędami 1 (Single Leg Push-Off), własne bez błędów 0, otwarte 9 (w tym Box Skip warunkowo).

## 2. Blok do wdrożenia

### Blok do wdrożenia

Klucz katalogu: `Single Leg Push-Off` (`lib/catalog.generated.ts:543`). `plyo.pushoff.setup` — istniejące zdanie z bloku W1 (Alternate Leg Push-Off); start obu ćwiczeń jest ten sam (pozy: `pushOff` w `scripts/figures/agent-pozy/plyo.mjs:64–66` — ta sama pozycja wyjściowa), ale tu ma własne dwa źródła — to nie wariant-uproszczenie.

```json
{
 "sources": {
  "ace-230": {"org": "ACE", "title": "Single Leg Push-off (#230)", "url": "https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/", "level": 4},
  "hk-howley-power-hop": {"org": "Howley (Human Kinetics)", "title": "T. Howley, Complete Conditioning for Lacrosse (Human Kinetics, 2016) — fragment „Power-Development Exercises”: Single-Leg Power Hop", "url": "https://us.humankinetics.com/blogs/excerpt/power-development-exercises", "level": 4}
 },
 "orgs": {
  "Howley (Human Kinetics)": {"name": "Tom Howley — trener przygotowania motorycznego Cornell University (od 1995), magisterium z fizjologii wysiłku; fragment książki u wydawcy Human Kinetics", "level": 4, "kind": "site"}
 },
 "exercises": {
  "Single Leg Push-Off": {
   "setup": [
    {"c": "plyo.pushoff.setup", "s": [["ace-230", "Step 1: Starting position (facing the box, right foot on top, left foot on the ground)"], ["hk-howley-power-hop", "Single-Leg Power Hop, ustawienie (one foot on the edge of the box, the other on the floor)"]]}
   ],
   "move": [
    {"c": "plyo.slPushoff.move", "s": [["ace-230", "Step 2: Upward phase (jump straight up, explosively pushing the foot on the box)"], ["hk-howley-power-hop", "Single-Leg Power Hop, wykonanie (drive off the top foot into the air, fully extending the top knee)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "plyo.mis.pushoffFloorLeg", "s": [["wniosek", "plyo.slPushoff.move"]]}
   ]
  }
 }
}
```

Uwagi do bloku:
- `kind` dla fragmentu książki: w `cues.json` nie ma dziś rodzaju „book” (sprawdzone: `grep '"kind": "book"'` — brak) — wpisałem `site`; integrator może zmienić na rodzaj używany dla książek, jeśli taki dojdzie.
- Ręce: ACE każe zamachnąć rękami w górę i w przód (Step 2), Howley — łokcie zgięte pod kątem prostym, praca rąk jak w biegu. Sprzeczność → bez zdania o rękach.
- Lądowanie: ACE Step 4 (miękko, na śródstopie, bez blokowania kolan) — Howley tylko „wróć do pozycji wyjściowej i złap równowagę”. `jump.land` i `jump.mis.stiff` mają tu jedno źródło → nie wpisane (otwarte).

## 2b. Warunkowo — Box Skip (tylko jeśli koordynator uzna Radcliffe’a za szczebel 3)

Nie wdrażać bez rozstrzygnięcia. Przy szczeblu 4 (moja ocena) to jedno źródło → karta otwarta.

```json
{
 "sources": {
  "hk-radcliffe-box-skip": {"org": "Radcliffe (Human Kinetics)", "title": "J. Radcliffe, High-Powered Plyometrics, wyd. 3 (Human Kinetics, 2025), s. 62 — Box Skip (fragment u wydawcy „Plyometric Bounds and Skips”)", "url": "https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips", "level": 3}
 },
 "orgs": {
  "Radcliffe (Human Kinetics)": {"name": "James Radcliffe — trener przygotowania University of Oregon (40 lat), magisterium z biomechaniki, certyfikaty NSCA, CSCCa, USAW; książka u wydawcy Human Kinetics", "level": 3, "kind": "site"}
 },
 "exercises": {
  "Box Skip": {
   "setup": [
    {"c": "plyo.boxSkip.setup", "s": [["hk-radcliffe-box-skip", "s. 62, Box Skip — start (upright stance, one leg slightly behind the other; a few steps before the first box) — jedno źródło (szczebel 3)"]]}
   ],
   "move": [
    {"c": "plyo.boxSkip.move", "s": [["hk-radcliffe-box-skip", "s. 62, Box Skip — wykonanie (push off the back leg, drive the knee up, land on the box) — jedno źródło (szczebel 3)"]]}
   ],
   "tips": [],
   "mistakes": [
    {"c": "plyo.mis.boxSkipNoKnee", "s": [["wniosek", "plyo.boxSkip.move"]]}
   ]
  }
 }
}
```

Uwaga: pozy (`scripts/figures/agent-pozy/plyo.mjs:18`) pokazują Box Skip jako jeden skok jednonóż na skrzynię z uniesioną wolną nogą — zgodne z częścią ruchu u Radcliffe’a (wybicie z tylnej nogi + wyrzut kolana + lądowanie na skrzyni); zeskok między skrzynie i seria są poza rysunkiem.

## 3. Nowe zdania

| id | PL | EN (propozycja) | Gdzie |
|---|---|---|---|
| `plyo.slPushoff.move` | Wybij się w górę nogą, która stoi na skrzyni — mocno ją prostując. | Drive straight up off the foot on the box, pushing that leg long. | blok |
| `plyo.mis.pushoffFloorLeg` | Wybicie z nogi na podłodze zamiast z nogi na skrzyni. | Pushing off the floor leg instead of the leg on the box. | blok (wniosek) |
| `plyo.boxSkip.setup` | Stań kilka kroków przed skrzynią, jedna noga lekko z tyłu. | Stand a few steps back from the box, one foot slightly behind the other. | 2b (warunkowo) |
| `plyo.boxSkip.move` | Odbij się z tylnej nogi, wyrzuć kolano drugiej w górę i wyląduj na skrzyni. | Push off the back leg, drive the other knee up and land on the box. | 2b (warunkowo) |
| `plyo.mis.boxSkipNoKnee` | Skok bez wyrzutu kolana — wolna noga zostaje w dole. | Jumping without driving the knee — the free leg stays low. | 2b (wniosek, warunkowo) |

Istniejące zdanie użyte bez zmian: `plyo.pushoff.setup` („Stań przodem do skrzyni: jedna stopa na skrzyni, druga na podłodze.”, z bloku W1). Nowe zdania wymagają wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`) i przeglądu tłumacza/recenzenta lokalizacji — poza zakresem.

Uzasadnienie błędów wnioskowanych (nie trywialne, widoczne na rysunku):
- `plyo.mis.pushoffFloorLeg` — zaprzecza `plyo.slPushoff.move`: na rysunku noga na skrzyni zostaje ugięta, a prostuje się noga z podłogi; zmienia, która noga pracuje (sedno ćwiczenia jednonóż).
- `plyo.mis.boxSkipNoKnee` — zaprzecza części „wyrzuć kolano drugiej w górę” z `plyo.boxSkip.move`; na rysunku udo wolnej nogi zostaje pionowo w dole.

## 4. Źródła (przeczytane 02.11.2026)

| id | Adres | Organizacja / autor | Szczebel i uzasadnienie | Co przeczytano |
|---|---|---|---|---|
| ace-230 | https://www.acefitness.org/resources/everyone/exercise-library/230/single-leg-push-off/ | ACE | 4 — organizacja szkoląca trenerów (precedens, `cues.json` org `ACE`) | Steps 1–4 i „Tips”: start przodem do skrzyni, prawa stopa na skrzyni, lewa na podłodze; Step 2: skok prosto w górę „explosively pushing your right foot in to the top of the box”; Step 4: „Avoid locking out your knees or quads” |
| hk-howley-power-hop | https://us.humankinetics.com/blogs/excerpt/power-development-exercises | T. Howley, „Complete Conditioning for Lacrosse” (Human Kinetics, ©2016) | 4 — fragment książki u wydawcy, autor trener z kwalifikacjami (szczeble, uzup. 2, wiersz „Human Kinetics — fragment … (autor trener)”; brief: magisterium z fizjologii wysiłku = kwalifikacja). Biogram: https://us.humankinetics.com/products/complete-conditioning-for-lacrosse — „strength and conditioning coach at Cornell University since 1995”, „master's degree in exercise physiology” | Single-Leg Power Hop: jedna stopa na krawędzi skrzyni 30–45 cm, druga na podłodze, ciężar głównie na przedniej; wybicie z górnej stopy w powietrze z pełnym wyprostem kolana; powrót do pozycji wyjściowej (wysokości skrzyni pominięte — liczby). Także Box Jump (nieużyte). |
| hk-radcliffe-box-skip | https://us.humankinetics.com/blogs/excerpt/plyometric-bounds-and-skips | J. Radcliffe, „High-Powered Plyometrics”, wyd. 3 (2025), s. 62–63 | 4 (moja ocena: trener z kwalifikacjami); 3 do decyzji koordynatora (autor publikuje w czasopismach zawodowych). Biogram: https://us.humankinetics.com/products/high-powered-plyometrics-3rd-edition — „strength and conditioning coach for the University of Oregon for 40 years”; magisterium z biomechaniki; certyfikaty NSCA, CSCCa, USA Weightlifting | Box Skip (s. 62): 2–4 skrzynie, start kilka kroków przed pierwszą, jedna noga lekko z tyłu; wybicie z tylnej nogi, wyrzut kolana, praca rąk; po lądowaniu na skrzyni druga noga w przód i zeskok między skrzynie. Box Bound (s. 63) — nieużyte. Narzędzie zwraca streszczenie — przed wpisem sprawdzić brzmienie ręcznie. |
| (nieużyte) ace-5869 | https://www.acefitness.org/resources/pros/expert-articles/5869/explosive-plyometric-workout/ | ACE, artykuł eksperta: E. Andrews (certyfikaty ACSM, ACE), 15.03.2016, przegląd 22.10.2026 | 4 | Brak ćwiczeń z tej części. **Dla koordynatora:** opis „Lateral Bounds” (skok w bok, lądowanie na jednej nodze, druga za nogą lądującą, zamach rąk) — możliwe źródło szczebla 4 dla „Lateral Bound” (plyo-cz1, otwarte: dotąd tylko strona bez autora). |
| (nieużyte) shred-sl-side-hops | https://ucalgary.ca/shred-injuries/all-sports/basketball/single-leg-hops-over-line-side-side | Uniwersytet w Calgary, SIPRC — program SHRED; autorka strony: C. van den Berg; bez daty | do decyzji koordynatora — ośrodek badawczy prewencji urazów (program oceniony w badaniu 2016–2018), nie centrum rekreacji; z nazwanym autorem → propozycja 4 | Skoki jednonóż bokiem nad linią: miękkie ugięcie bioder i kolan, kolano nad kostką, miękkie lądowanie; błędy: kolano do środka, lądowanie na sztywnym kolanie. **Dla koordynatora:** dotyczy „Single-Leg Lateral Hop” (plyo-cz2, otwarte) — może być jednym z dwóch źródeł ruchu i błędu „kolano do środka”. Do moich ćwiczeń nie pasuje. |
| (nieużyte) shred-basketball | https://www.ucalgary.ca/shred-injuries/all-sports/basketball | jw. | jw. | Lista 23 ćwiczeń: brak skoków jednonóż w przód na odległość, bounding, side hop-sprint. |
| (nieużyte) miller-2006 | https://pmc.ncbi.nlm.nih.gov/articles/PMC3842147/ | Miller i in., J Sports Sci Med 2006 | 3 | Tab. 2 — tylko nazwy ćwiczeń, bez opisów; brak ćwiczeń z tej części. |

Odrzucone / niedostępne: fragment „Stride Jump” (us.humankinetics.com/blogs/excerpt/stride-jump — przekierowanie na stronę główną; wersje uk/canada → przekierowanie/zamknięcie), Body-Solid biblioteka ćwiczeń (strony 404/przekierowanie na serwis), Northeastern University S&C (410), CHOP StayWell (403), Cureus 2023 PDF (tekst skompresowany, nieczytelny), BFS „lateral plyometrics” (G. Shepard 2003 — tylko ćwiczenia na rampie BFS, bez kwalifikacji autora; inne ruchy), The Prehab Guys strony `vimeo-video`/`?p=` (bez autora → 5), materiały do egzaminu trenerskiego w aplikacji edukacyjnej, prace studenckie, serwisy z ćwiczeniami innych aplikacji (nie źródło), Fitness Volt „alternatives” (zestawienia zamienników, nie opis techniki).

## 5. Otwarte

- [OTWARTE] **Szczebel Radcliffe’a (Human Kinetics)** — 3 czy 4. Od tego zależy Box Skip (blok 2b). Plik szczebli: HK = 3 tylko dla organizacji naukowo-szkoleniowej albo uznanego autora naukowego; Radcliffe to trener-praktyk z magisterium i publikacjami zawodowymi.
- [OTWARTE] **Single Leg Push-Off — lądowanie i ręce:** `jump.land`/`jump.mis.stiff` tylko ACE; ręce — sprzeczność ACE (zamach w górę) vs Howley (praca rąk jak w biegu, łokcie zgięte).
- [OTWARTE] **Side to Side Box Shuffle** — drugie źródło ≥ 4. Szukane w W2: fragmenty Human Kinetics (brak fragmentu z „side-to-side push-off”/„box shuffle”), biblioteka Body-Solid (producent skrzyń — strony usunięte), strony S&C uczelni (410), wyszukiwarka (tylko serwisy innych aplikacji). Najbliższe dobre źródło: podręcznik NSCA (Human Kinetics), rozdział o pliometrii — brak dostępnego fragmentu.
- [OTWARTE] **Single-Leg Stride Jump** — jedyny znany fragment (Radcliffe/Farentinos, wyd. 2, „Stride Jump”) usunięty z serwisu wydawcy; archiwum internetowe zablokowane dla narzędzia.
- [OTWARTE] **Alternate Leg Diagonal Bound, Double/Single Leg Butt Kick, Side Standing Long Jump, Side Hop-Sprint, Single-Leg Hop Progression** — brak przeczytanego opisu ≥ 3. Nazwy pochodzą z drilli książek pliometrii (Chu, Radcliffe) — fragmentów u wydawcy nie znalazłem. Rekomendacja jak w W1: bez własnej karty (status nie `ready`) do czasu źródeł — decyzja produktowa koordynatora.
- [OTWARTE] **Side Hop-Sprint jako złożenie:** część skoku = `plyo.coneLat.hop` (ACE #120 + NISMAT, 2 źródła), ale brak ustawienia i części sprintu; rysunek obejmuje tylko skok (`plyo.mjs:15`). Do decyzji, czy karta „tylko skok” ma sens — nie proponuję bez ustawienia.
- [OTWARTE] **Materiał CHOP (StayWell)** — 403; według streszczenia wyszukiwarki (nie źródło) zawiera skoki jednonóż w przód i w bok na odległość — warto otworzyć ręcznie (szpital = szczebel 4) dla Single-Leg Hop Progression i Single-Leg Lateral Hop.

## 6. Stan

- Zrobione: 10/10 ćwiczeń przeszukane w W2; 1 karta własna z błędem (Single Leg Push-Off); Box Skip — karta warunkowa (2b); dwa znaleziska poboczne dla innych ćwiczeń (ACE 5869 → Lateral Bound; SHRED → Single-Leg Lateral Hop).
- Zostało: 9 ćwiczeń otwartych (patrz sekcja 5).
- Następny krok: ręczne otwarcie materiału CHOP (403) i fragmentów podręczników pliometrii (Chu „Jumping Into Plyometrics”, NSCA — rozdział o pliometrii) w środowisku z dostępem; rozstrzygnięcie szczebla Radcliffe’a.
- Pułapki: fragmenty Human Kinetics znikają (przekierowanie na stronę główną) — przed wpisem sprawdzać adres; WebFetch zwraca streszczenia stron HK, a nie dosłowny tekst — brzmienie cytatów do sprawdzenia ręcznie; wersje uk/canada HK przekierowują na us albo na stronę o zamknięciu; biblioteka Body-Solid usunięta; wyniki wyszukiwania dla nazw z tego katalogu to w większości serwisy innych aplikacji — odrzucać.
