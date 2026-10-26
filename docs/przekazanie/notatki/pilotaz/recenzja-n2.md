# Recenzja kontrolna ruchu — pilotaż agent-pozy, przebieg n2 (bramka 4), 26.10.2026

Recenzent niezależny. Oceniam tylko obrazy PNG i manifest.json, bez kodu generatora i jego uzasadnień.
Obejrzane wszystkie 27 PNG (16 × pushup_plank, 11 × core_floor). Wątpliwe kadry powiększałem (ImageMagick, kopie w `scratchpad/recenzja-n2-crop/`).
Styk z podłogą w Cocoons zmierzyłem na pikselach.

Pytania: (1) rozpoznawalność, (2) start/koniec/zakres, (3) styk i podparcie, (4) anatomia, (5) poza poprawna bez błędu,
(6) rząd błędu pokazuje dokładnie ten jeden błąd, (7) zgodność przód–bok.

## Podsumowanie

| Ćwiczenie | Werdykt n2 | Najważniejsze | Poprzednio |
|---|---|---|---|
| Push Up | DO POPRAWY | przód, dół: łokcie nadal poziomo w bok (litera T), mimo reguły `lokcie_nie_w_bok` | stopy z przodu NAPRAWIONE, łokcie NIE |
| Push-Up Wide | OK | „sag” widoczny już w klatce 1 | NAPRAWIONE |
| Close-Grip Push-Up | DO POPRAWY | przód, dół: łokcie szeroko, a z boku łokieć przy tułowiu (rozjazd widoków) | NIE naprawione |
| Diamond Push Up | OK (uwaga: brak rzędu błędu) | nic pod podłogą, dłonie pod mostkiem, łokcie z przodu umiarkowane | NAPRAWIONE |
| Decline Push Up | DO POPRAWY (drobne) | przód, dół: łokcie poziomo; klatki z przodu dalej przełamane do 2. wiersza | NIE naprawione |
| Incline Push Up | DO POPRAWY (drobne) | przód, dół: łokcie w bok i powyżej barków | zasłanianie przez skrzynię NAPRAWIONE, łokcie NIE |
| Incline Push-Up Close-Grip | DO POPRAWY | przód, dół: łokcie poziomo w bok, wbrew wariantowi wąskiemu | zasłanianie NAPRAWIONE, łokcie NIE |
| Single-Arm Push-Up | DO POPRAWY | stopy wciąż na szerokość bioder, tułów przesunięty poza podparcie; wolna ręka „lata” nad plecami | „sag” NAPRAWIONE, podstawa i ręka NIE |
| Plank | OK | „sag” we wszystkich klatkach, przedramiona równoległe, stopy na podłodze | NAPRAWIONE (zostały 3 identyczne klatki) |
| Mountain Climbers | OK z uwagami | stopy z przodu na podłodze; klatka środkowa przypomina klęk podparty | NAPRAWIONE |
| Plank Shoulder Taps | OK | klatki 2 i 3 to różne ręce, „sag” od klatki 1 | NAPRAWIONE |
| Plyo Push-Up | OK z uwagami | „sag” we wszystkich klatkach; z przodu lot nadal wygląda jak stanie | „sag” NAPRAWIONE |
| Inverted Row | DO POPRAWY | góra: łokieć przed klatką (po stronie drążka), a nie za plecami; przód: łokcie szeroko na wysokości głowy; układ łamany | szyja NAPRAWIONA, łokieć NIE (nowa postać błędu) |
| Rollout (sztanga) | OK (uwaga: układ) | „sag” widoczny od klatki 1 | NAPRAWIONE |
| Barbell Rollout from Bench | OK z uwagami | „sag” wzmocniony; zakres końcowy nadal krótki | częściowo |
| Standing Barbell Rollout | DO POPRAWY | NOWE: rząd „sag” w klatce 1 ma ugięte kolana, czyli drugi błąd w rzędzie | nowa usterka |
| Bird Dog | OK | bez zmian | — |
| Cocoons | DO POPRAWY | NOWE: w klatce końcowej miednica wisi ok. 10 px nad podłogą (w środkowej ok. 4 px), przy czym z przodu ciało stoi | regresja (było OK) |
| Crunch - Hands Overhead | OK | bez zmian | — |
| Dead Bug | OK | bez zmian | — |
| Hollow Hold | OK | 3 identyczne klatki przy `klatki_u` [0, 1] | — |
| Lying Leg Raise | OK | ręce leżą na podłodze wzdłuż ciała | NAPRAWIONE |
| Reverse Crunch | OK | ręce na podłodze; miednica lekko się zwija | NAPRAWIONE |
| Leg Pull-In | OK z uwagą | ręce na podłodze; koniec ruchu to „stolik” (kolana nad biodrami), nie kolana przy klatce | ręce NAPRAWIONE |
| Tuck Crunch | OK z uwagą | ręce sięgają ku kolanom; kolana zgięte tylko ok. 140–150° | ręce NAPRAWIONE |
| Superman | OK (uwaga: manifest) | rząd `cobra.mis` usunięty, ale w `bledy_wskazowki` został identyfikator bez opisu | częściowo |
| V-Up | OK | bez zmian | — |

**Wynik n2: OK 18/27 (67%), w tym 8 z uwagami; DO POPRAWY 9/27 (33%); WYJĄTEK 0.**
Dla porównania przebieg 1: OK 10/31 (32%).

Clock Push-Up, Suspended Push-Up, Suspended Fallout i Alternate Heel Touchers zniknęły z zestawu. Nie ma ich jednak w `wyjatki` manifestu, a nadal są w `przyblizenia`.
Trzeba nadać im status: wyjątek z powodem albo usunięcie z katalogu. Inaczej wypadają z pomiaru po cichu.

## Status pozycji z poprzedniej recenzji

| Pozycja (rec. 1) | Status w n2 |
|---|---|
| Push Up — łokcie w bok z przodu | NIE |
| Push Up — stopy z przodu nad podłogą | TAK |
| Push-Up Wide — „sag” od klatki 1 | TAK |
| Close-Grip — łokcie szeroko | NIE |
| Diamond — przenikanie podłogi, dłonie pod mostkiem | TAK |
| Clock Push-Up (WYJĄTEK) | usunięte z zestawu, brak wpisu w `wyjatki` |
| Decline — łokcie, przełamanie wiersza | NIE |
| Incline — skrzynia zasłania nogi | TAK |
| Incline — łokcie | NIE |
| Incline Close-Grip — łokcie / zasłanianie | NIE / TAK |
| Suspended Push-Up — taśmy | usunięte z zestawu, brak wpisu w `wyjatki` |
| Single-Arm — rozstaw stóp, dłoń bliżej osi, wolna ręka | NIE |
| Single-Arm — „sag” od klatki 1 | TAK |
| Plank — „sag” od klatki 1; przedramiona; stopy | TAK; TAK; TAK |
| Plank — jedna klatka zamiast trzech kopii | NIE (manifest ma `klatki_u` [0, 1], a obraz pokazuje 3 klatki) |
| Mountain Climbers — stopy z przodu | TAK |
| Shoulder Taps — klatki 2 = 3; „sag” | TAK; TAK |
| Plyo — „sag” w każdej klatce | TAK |
| Plyo — lot z przodu wygląda jak stanie | NIE (drobne) |
| Inverted Row — szyja w przeproście | TAK |
| Inverted Row — łokieć za tułowiem / mostek przy drążku | NIE: łokieć jest teraz przed klatką |
| Inverted Row — łokcie w bok z przodu | NIE |
| Rollouty — „sag” od klatki 1 | TAK (×3) |
| Bench Rollout — krótki zakres | NIE (drobne) |
| Suspended Fallout | usunięte z zestawu, brak wpisu w `wyjatki` |
| Heel Touchers (WYJĄTEK) | usunięte z zestawu, brak wpisu w `wyjatki` |
| LLR / Reverse Crunch / Leg Pull-In — ręce nad tułowiem | TAK (×3) |
| Tuck Crunch — dłonie na klatce, łokcie do sufitu | TAK |
| Superman — etykieta cobra.mis | CZĘŚCIOWO (rząd usunięty, identyfikator bez opisu został w opisie) |
| Układ — klatki jednego rzędu w jednym wierszu | NIE (Decline, Inverted Row, 3 rollouty) |

Bilans 16 ćwiczeń, które w rec. 1 były DO POPRAWY: 7 naprawionych w pełni (Wide, Diamond, Shoulder Taps, LLR, Reverse Crunch, Leg Pull-In, Tuck Crunch),
5 częściowo (Push Up, Incline, Incline CG, Single-Arm, Inverted Row), 2 bez zmian (Close-Grip, Decline), 2 usunięte (Suspended ×2).
Nowe usterki: 2 (Cocoons, Standing Rollout).

## Szczegóły — pushup_plank

### Push Up — DO POPRAWY
1. Tak. 2. Zakres dobry: góra z prostymi rękami, dół z klatką tuż nad podłogą. 3. Z przodu stopy stoją już na podłodze (naprawione). 4. W porządku.
5. **Przód, klatka 3: ramiona poziomo na boki (~90° od tułowia).** Z boku łokieć idzie w tył, więc widoki się nie zgadzają (7).
Reguła `lokcie_nie_w_bok` jest w manifeście, a obraz ją łamie, czyli reguła nie mierzy rzutu z przodu. 6. „partial”: płytki dół, czytelny.

### Push-Up Wide — OK
„sag” jest widoczny już w klatce 1 (biodra niżej, załamanie w biodrze) i trzyma się we wszystkich klatkach. „partial” czytelny. Szeroki łokieć w dole jest tu zamierzony.

### Close-Grip Push-Up — DO POPRAWY
Z boku dół wygląda dobrze: łokieć przy tułowiu, przedramię skośnie. **Z przodu, w dole, łokcie wychodzą szeroko poza obrys tułowia, ramiona prawie poziomo.**
Przód przeczy bokowi i cesze wariantu (7). Manifest tego ćwiczenia nie ma reguły o łokciach.

### Diamond Push Up — OK (uwaga)
Dłonie i przedramiona są na podłodze, nic pod linią. Z boku dłoń jest lekko za barkiem (pod mostkiem). Z przodu dłonie złączone, a łokcie w dole odwiedzone umiarkowanie (~45–60°), co jest dopuszczalne.
Brak rzędu błędu i pustej sekcji `ruch` — to sprawa katalogu, nie rysunku.

### Decline Push Up — DO POPRAWY (drobne)
Ruch, styk i ułożenie stóp na skrzyni są dobre. Przód, dół: łokcie poziomo w bok. Klatki z przodu nadal przełamane do drugiego wiersza.

### Incline Push Up — DO POPRAWY (drobne)
Skrzynia z przodu zasłania teraz nogi (naprawione). **Przód, dół: łokcie wyżej niż barki i szeroko** („skrzydełka”), a z boku łokieć sterczy nad barkiem. Brak rzędów błędów (katalog).

### Incline Push-Up Close-Grip — DO POPRAWY
Zasłanianie naprawione. Przód, dół: ramiona poziomo na boki, dłonie blisko siebie. Z boku łokieć wzdłuż tułowia, więc widoki się rozjeżdżają (7). Rząd „partial” czytelny.

### Single-Arm Push-Up — DO POPRAWY
„sag” jest już od klatki 1 (naprawione). **Z przodu stopy wciąż na szerokość bioder, dłoń podporowa pod barkiem, tułów przesunięty na stronę bez podparcia**, przez co środek ciężkości wypada poza podstawę (3).
Wolna ręka: z boku przedramię poziomo nad plecami, z przodu dłoń na wysokości głowy z boku. Nie leży na lędźwiach (4).

### Plank — OK
„sag” we wszystkich klatkach, przedramiona równoległe, stopy z przodu na podłodze. Uwaga: manifest ma `klatki_u` [0, 1], a obraz pokazuje 3 identyczne klatki (niezgodność manifestu z obrazem).

### Mountain Climbers — OK z uwagami
Stopy z przodu stoją na podłodze. Klatka środkowa: obie nogi zgięte pod biodrami, kolana tuż nad podłogą, przez co przypomina klęk podparty. Fizycznie to moment mijania nóg, więc jest akceptowalne.

### Plank Shoulder Taps — OK
Klatka 2: dotyka dalsza ręka, klatka 3: bliższa. Przód to potwierdza (najpierw jedna ręka przez klatkę, potem druga). Ręka podporowa pod barkiem. „sag” od klatki 1. Drobiazg: stopy wąsko.

### Plyo Push-Up — OK z uwagami
„sag” widać w klatkach 1–3 (w klatce lotu słabiej). Lot z boku jest czytelny. Z przodu klatka lotu nadal wygląda jak stojąca postać.

### Inverted Row — DO POPRAWY
Start: ciało pod drążkiem, ręce pionowo, pięty na podłodze, szyja w linii (naprawione).
**Klatka 3 (góra): łokieć jest nad klatką piersiową, po stronie drążka, czyli „przed” tułowiem.** W wiosłowaniu łokieć wychodzi za linię pleców, ku podłodze i ku biodrom, a mostek dochodzi do drążka.
Obecny układ to raczej uniesienie zgiętej ręki w przód (4, 5). **Przód, klatka 3: łokcie szeroko na wysokości głowy**, wbrew „łokcie blisko tułowia” (7). Układ przełamany do 2. wiersza. Brak rzędów błędów.

### Rollout (sztanga) — OK (uwaga: układ)
Ruch z klęku do wyprostu jest dobry. „sag” widoczny od klatki 1, w końcu biodra przy podłodze. Klatki z przodu przełamane do drugiego wiersza.

### Barbell Rollout from Bench — OK z uwagami
Start z kolan na ławce w zgięciu bioder jest realny. Na końcu ręce dalej idą stromo w dół, więc zakres jest krótki. „sag” widoczny od klatki 1.

### Standing Barbell Rollout — DO POPRAWY
Poza poprawna dobra: skłon na prostych nogach, potem na palcach, koniec prawie poziomo.
**Rząd „sag”, klatka 1: kolana wyraźnie ugięte**, a w pozie poprawnej są proste. Rząd pokazuje dodatkowy błąd, którego nie ma w etykiecie (6).

## Szczegóły — core_floor

- **Bird Dog — OK.** Przeciwna ręka i noga, podparcie pod barkami i biodrami, przód zgodny z bokiem.
- **Cocoons — DO POPRAWY (regresja).** Rozpoznawalne, ale **z boku w klatce końcowej najniższy punkt miednicy jest 10 px nad podłogą** (y = 156 przy podłodze y ≈ 166), a w środkowej ok. 4 px nad nią.
  Ciało wisi w powietrzu, choć powinno siedzieć na pośladkach (3). Z przodu ten sam moment stoi na podłodze (7).
- **Crunch - Hands Overhead — OK.**
- **Dead Bug — OK.**
- **Hollow Hold — OK.** 3 identyczne klatki przy `klatki_u` [0, 1].
- **Lying Leg Raise — OK.** Ręce leżą na podłodze, ruch od poziomu do pionu.
- **Reverse Crunch — OK.** Ze „stolika” kolana idą ku klatce, miednica lekko się zwija, ręce na podłodze.
- **Leg Pull-In — OK z uwagą.** Ręce na podłodze. Koniec ruchu: uda tuż za pionem, golenie poziomo („stolik”), a nie kolana przy klatce. Zakres można wydłużyć.
- **Tuck Crunch — OK z uwagą.** Ręce sięgają ku kolanom (naprawione). Kolana zgięte tylko ok. 140–150°, więc „tuck” jest słabo zaznaczony.
- **Superman — OK (uwaga: manifest).** Ruch dobry, miednica na podłodze. Rząd z cudzą etykietą zniknął, ale `bledy_wskazowki` dalej zawiera `cobra.mis` bez opisu.
- **V-Up — OK.**

## Nowe powtarzalne luki — kandydaci na reguły automatyczne

1. **Łokcie w dole pompki, rzut z przodu** (nadal 6 ćwiczeń: Push Up, Close-Grip, Decline, Incline, Incline CG, a w wiosłowaniu Inverted Row).
   Push Up ma regułę `lokcie_nie_w_bok`, a mimo to przechodzi. Reguła nie mierzy rzutu z przodu albo dolnej klatki, a inne warianty jej nie mają.
   Propozycja: kąt ramię–tułów w rzucie z przodu w każdej klatce ≤ 60° (warianty wąskie ≤ 30–45°, szeroka bez limitu). Regułę dołączać z rodziny, nie z listy ćwiczenia.
2. **Styk z podłogą w siadzie i leżeniu** (Cocoons): w każdej klatce ćwiczenia „na podłodze” najniższy punkt tułowia lub miednicy ≤ 2 px od podłogi, chyba że ćwiczenie deklaruje lot.
   Rozszerzenie dawnej reguły „nic pod podłogą” na „nic nie wisi”.
3. **Rząd błędu nie zmienia stawów spoza błędu** (Standing Rollout: „sag” zgina kolana). Dla każdej klatki różnica kątów stawów nieobjętych błędem między rzędem błędu a pozą poprawną ≈ 0.
4. **Tor łokcia w przyciąganiu** (Inverted Row): w fazie końcowej łokieć w rzucie bocznym leży po stronie pleców (za linią tułowia), a nie po stronie drążka.
5. **Stabilność podparcia jednorącz**: rzut środka ciężkości mieści się w wielokącie podparcia (dłoń + stopy) w rzucie z przodu (Single-Arm).
6. **Zgodność manifestu z obrazem**: liczba klatek = długość `klatki_u` (Plank, Hollow). Każde ćwiczenie z `przyblizenia` jest albo w zestawie, albo w `wyjatki` z powodem (4 ćwiczenia „zniknęły”).
   Każdy identyfikator w `bledy_wskazowki` ma opis (Superman).
7. **Układ jednego wiersza** — wciąż niespełniony (Decline, Inverted Row, 3 rollouty); reguła z rec. 1 nie działa albo nie powstała.

## Szablonowość pompek

- **Z boku:** Push Up, Wide, Close-Grip i Diamond są nadal prawie identyczne. Jedyna nowa cecha to dłoń lekko za barkiem w Diamond (pod mostkiem).
  Close-Grip z boku ma poprawny łokieć przy tułowiu, ale nie różni się tym od Push Up, który z boku też tak wygląda.
- **Z przodu:** góra różni się rozstawem dłoni. W dole Push Up, Wide, Close-Grip, Decline i Incline CG mają łokcie poziomo na boki. Tylko Diamond ma łokcie umiarkowanie.
  Cecha odróżniająca pompkę wąską od szerokiej nadal znika w dolnej fazie, więc z przodu w dole Close-Grip ≈ Push Up ≈ Wide.
- **Incline vs Incline CG:** różnią się tylko rozstawem dłoni w górze.
- **Wniosek:** szablon bazowy (deska, zakres, styk) jest teraz poprawny i czysty. Warianty nadal różnią się jednym parametrem (rozstaw dłoni), a nie torem łokcia.
  Bez reguły nr 1 przypiętej do wariantu szablonowość się utrzyma.

## Miara szczelności bramek

- Wszystkie 27 ćwiczeń n2 przeszło bramki automatyczne (`raport.json`: `nie` puste). Recenzja uznała 18 za OK.
- **Odsetek póz OK za bramkami: 18/27 = 67%** (przebieg 1: 10/31 = 32%). Przeciek bramek: 9/27 = 33%.
- Bez ćwiczeń „z uwagami”: czyste OK 10/27 = 37%.
- Z 9 przecieków 6 to jedna klasa (łokcie w rzucie z przodu), więc pojedyncza reguła nr 1 podniosłaby wynik do ok. 85–89%. Pozostałe przecieki to: styk (Cocoons), rząd błędu z dodatkowym błędem (Standing Rollout) i stabilność (Single-Arm).
- Uwaga do miary: 4 trudne ćwiczenia wypadły z zestawu bez wpisu w `wyjatki`. Licząc je jako niezałatwione, wynik to 18/31 = 58%.
