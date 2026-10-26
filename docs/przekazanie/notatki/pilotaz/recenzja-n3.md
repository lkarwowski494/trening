# Recenzja kontrolna ruchu nr 3: pilotaż agent-pozy, przebieg n3 (bramka 4), 26.10.2026

Recenzent niezależny. Oceniałem tylko obrazy PNG i manifest.json. Kodu generatora ani uzasadnień nie czytałem.
Obejrzałem wszystkie 29 PNG (17 × pushup_plank, 12 × core_floor). Wątpliwe kadry powiększyłem (kopie w `scratchpad/recenzja-n3-crop/`).
Na pikselach zmierzyłem trzy rzeczy: styk z podłogą (najniższy punkt tułowia w kolumnach, skrypt `scratchpad/low.py`), położenie dłoni na podłodze w rzucie z przodu (Push Up) oraz porównanie z n2 (`compare`: wszystkie 27 wspólnych obrazów się zmieniło).

Pytania: (1) rozpoznawalność, (2) start, koniec i zakres, (3) styk i podparcie, (4) anatomia, (5) poza poprawna bez błędu,
(6) rząd błędu pokazuje dokładnie ten jeden błąd, (7) zgodność przodu z bokiem.

## Podsumowanie

| # | Ćwiczenie | Werdykt n3 | Najważniejsze | Pozycja z n2 |
|---|---|---|---|---|
| 1 | Push Up | OK | z przodu w dole łokcie skośnie (~45°), zgodnie z bokiem; dłonie stoją w miejscu (zmierzone: ±29 px w klatce 1 i 5) | łokcie NAPRAWIONE |
| 2 | Push-Up Wide | OK z uwagą | rząd „sag” różni się od pozy poprawnej bardzo słabo w klatkach 1–3 | bez zmian |
| 3 | Close-Grip Push-Up | OK | z przodu łokcie przy tułowiu, dopiero w dole lekko poza barki; zgodnie z bokiem | NAPRAWIONE |
| 4 | Diamond Push Up | OK | bez zmian (brak rzędu błędu to sprawa katalogu) | — |
| 5 | Decline Push Up | OK | łokcie w dole skośnie, klatki w jednym wierszu | łokcie i układ NAPRAWIONE |
| 6 | Incline Push Up | OK z uwagą | z przodu w dole łokcie nad barkami, co czyta się jak „ręce w górę”; geometrycznie zgadza się z bokiem (łokieć nad plecami) | częściowo |
| 7 | Incline Push-Up Close-Grip | OK z uwagą | klatki 1–4 z przodu wąsko; dopiero ostatnia rozkłada łokcie w „V” nieco poza barki | w większości NAPRAWIONE |
| 8 | Single-Arm Push-Up | OK z uwagą | dłoń podporowa bliżej osi, środek ciężkości nad podparciem; stopy nadal na szerokość bioder; wolna ręka na lędźwiach | podparcie NAPRAWIONE, stopy NIE |
| 9 | Plank | OK | 2 klatki = `klatki_u` [0, 1] | niezgodność manifestu NAPRAWIONA |
| 10 | Mountain Climbers | OK z uwagą | klatki środkowe: kolana tuż nad podłogą (przypomina klęk) | bez zmian |
| 11 | Plank Shoulder Taps | OK | bez zmian | — |
| 12 | Plyo Push-Up | OK z uwagą | z przodu lot nadal wygląda jak stanie | bez zmian |
| 13 | **Clock Push-Up** (nowe) | **DO POPRAWY → zalecam WYJĄTEK** | obraz to pompka z dłońmi przesuniętymi przód/tył; brakuje cechy, która definiuje to ćwiczenie (dłonie wędrują po okręgu, ciało obraca się wokół stóp) | wróciło do zestawu |
| 14 | Inverted Row | **DO POPRAWY** | koniec poprawiony (łokieć przy żebrach); start: drążek nad brzuchem, ręce skośnie ~40°; środek: łokieć po stronie klatki | częściowo |
| 15 | Rollout (sztanga) | OK | jeden wiersz, „sag” czytelny | układ NAPRAWIONY |
| 16 | Barbell Rollout from Bench | OK z uwagą | zakres końcowy nadal krótki | układ NAPRAWIONY, zakres NIE |
| 17 | Standing Barbell Rollout | OK z uwagą | kolana w rzędzie „sag” proste (naprawione), ale w pozie poprawnej łokcie ugięte ~155° w klatkach 1 i 3, a w rzędzie „sag” proste | kolana NAPRAWIONE; nowa drobna różnica |
| 18 | Bird Dog | OK | przeciwna ręka i noga, przód zgodny z bokiem | — |
| 19 | **Crunch - Hands Overhead** | **DO POPRAWY** | w klatce końcowej tułów uniesiony sztywnie od miednicy (~30°), lędźwie 11–22 px nad podłogą, czyli to siad, nie spięcie; obraz przeczy wskazówce „Dolna część pleców zostaje na podłodze” | nowe znalezisko (obraz jak w n2, w n2 przeoczone) |
| 20 | Dead Bug | OK | — | — |
| 21 | **Hollow Hold** | **DO POPRAWY** | ciało w „V” na pośladkach, z punktowym stykiem; lędźwie 9–15 px nad podłogą, wbrew wskazówce „Lędźwie przy podłodze” | nowe znalezisko (w n2 przeoczone) |
| 22 | Lying Leg Raise | OK | — | — |
| 23 | Reverse Crunch | OK | — | — |
| 24 | Tuck Crunch | OK z uwagą | kolana zgięte teraz ~95° (naprawione); tułów uniesiony wysoko, styk na kości krzyżowej, co przy zwijaniu obu końców jest akceptowalne | „tuck” NAPRAWIONY |
| 25 | **Alternate Heel Touchers** (nowe) | **DO POPRAWY** | przechył widać tylko z przodu (głowa wychodzi zza kolana, ręka zjeżdża ku stopie); z boku tułów uniesiony od miednicy jak w siadzie, lędźwie ~11 px nad podłogą | wróciło do zestawu |
| 26 | Cocoons | OK | styk naprawiony: najniższy punkt tułowia w każdej z 9 klatek = y 132 przy podłodze 131–132 | regresja NAPRAWIONA |
| 27 | Leg Pull-In | OK z uwagą | koniec ruchu to nadal „stolik” | bez zmian |
| 28 | Superman | OK (uwaga: manifest) | obraz dobry; `bledy_wskazowki` nadal zawiera `cobra.mis` bez opisu | NIE naprawione (manifest) |
| 29 | V-Up | OK | — | — |

**Wynik n3: OK 24/29 (83%), w tym czyste OK 14/29 (48%) i OK z uwagami 10/29 (34%). DO POPRAWY 5/29 (17%). WYJĄTEK zalecany: 1 (Clock).**
Dla porównania: przebieg 1 — 10/31 (32%), n2 — 18/27 (67%).

**Cel ≥ 90% nie został osiągnięty (83%).** Zastrzeżenie do miary: 2 z 5 przecieków (Crunch, Hollow) to obrazy niezmienione względem n2, które poprzednia recenzja przepuściła.
Licząc tylko kryteria z n2, wynik wynosi 26/29 = 90%. Przy kryteriach tej recenzji wynosi 83%.

Manifest pushup_plank ma teraz 8 wyjątków z powodem (m.in. Suspended Push-Up i Suspended Fallout, Side Plank, Copenhagen), więc luka z n2 („ćwiczenia znikają po cichu”) jest zamknięta.
Manifest core_floor nie ma wyjątków. Wszystkie 29 ćwiczeń przeszło bramki (`raport.json`: `nie` puste).

## Status pozycji z recenzji n2

| Pozycja z n2 | Status w n3 |
|---|---|
| Push Up — łokcie z przodu | TAK |
| Close-Grip — łokcie z przodu / rozjazd widoków | TAK |
| Decline — łokcie / przełamanie wiersza | TAK / TAK |
| Incline — łokcie „skrzydełka” | CZĘŚCIOWO (geometria spójna, odbiór z przodu nadal mylący) |
| Incline CG — łokcie | W WIĘKSZOŚCI (została ostatnia klatka) |
| Single-Arm — podparcie / stopy / wolna ręka | TAK / NIE / TAK (ręka na lędźwiach) |
| Plank — manifest a obraz | TAK |
| Plyo — lot z przodu | NIE (drobne) |
| Inverted Row — łokieć w końcu ruchu | TAK |
| Inverted Row — start i środek, łokcie z przodu szeroko | NIE |
| Inverted Row — układ | TAK |
| Rollouty — układ w jednym wierszu | TAK (×3) |
| Bench Rollout — zakres | NIE (drobne) |
| Standing Rollout — kolana w rzędzie „sag” | TAK |
| Cocoons — miednica nad podłogą | TAK |
| Superman — `cobra.mis` w `bledy_wskazowki` | NIE |
| Clock, Heel Touchers, Suspended ×2 — status | Clock i Heel Touchers wróciły do zestawu; Suspended ×2 są w `wyjatki` z powodem |

Bilans 9 pozycji DO POPRAWY z n2: 7 naprawionych (Push Up, Close-Grip, Decline, Incline CG, Single-Arm, Standing Rollout, Cocoons), z czego część z uwagami.
1 częściowo (Incline, teraz OK z uwagą). 1 nadal DO POPRAWY (Inverted Row, inne fazy niż poprzednio).

## Szczegóły nowych ćwiczeń

### Clock Push-Up — DO POPRAWY, zalecam WYJĄTEK
1. **Nie.** Z boku widać pompkę z jedną dłonią przed barkiem, drugą za nim. Z przodu w dole jeden łokieć idzie wysoko, drugi nisko. To rozpoznawalna pompka z przesuniętymi dłońmi, a nie „zegar”.
Cecha definiująca to dłonie przestawiane po okręgu między powtórzeniami, ciało obracające się wokół stóp, a w wersji plyo skok. Przybliżenie z manifestu ją usuwa, więc obraz uczy innego ćwiczenia pod tą nazwą.
2–5. Sama pompka jest poprawna: zakres, styk i deska bez zastrzeżeń. 6. „partial” czytelny. 7. Zgodne.
Zalecenie: wpis do `wyjatki` (potrzebny widok z góry albo sekwencja kilku powtórzeń z obrotem). Druga możliwość to zmiana nazwy na wariant z dłońmi przesuniętymi, jeśli katalog go potrzebuje.

### Alternate Heel Touchers — DO POPRAWY
1. Częściowo. Z przodu przechył jest czytelny: głowa na przemian wychodzi zza lewego i prawego kolana, a ręka po tej stronie zjeżdża ku stopie, ok. 10 px nad podłogą obok pięty.
Tułów i bok są jednak prawie całe schowane za udami, więc sam przechył widać słabo. Z boku przechyłu nie widać, czego należało się spodziewać.
2. Start (leżenie, ręce na podłodze) i dwa końce są dobre.
4–5. **Z boku w klatkach 2–3 cały tułów jest uniesiony sztywnie od miednicy** (~25°). Styk jest tylko w pośladkach (x ≈ 360, y 122 przy podłodze 121), a odcinek lędźwiowy wisi 11–16 px nad podłogą (x 330–340).
W tym ćwiczeniu z podłogi odrywają się tylko łopatki. Obraz przeczy też wskazówce z manifestu „Dolna część pleców zostaje na podłodze”.
7. Ręce w klatce 1: z przodu odwiedzone na podłodze, z boku wzdłuż tułowia, co jest spójne przy odwiedzeniu ~30–40°.

## Pozostałe szczegóły

- **Inverted Row — DO POPRAWY.** Klatka 1: ręce odchylone ~40° od pionu w stronę stóp, barki daleko za drążkiem, czyli drążek wypada nad dolną częścią klatki lub brzuchem.
W zwisie startowym ręce są prostopadle do podłogi, a drążek jest nad mostkiem. Klatka 3: ramię idzie od barku poziomo ku stopom, łokieć po stronie klatki, a nie pod plecami.
Klatka 5 jest dobra: łokieć przy żebrach, klatka ok. 10–15 cm pod drążkiem. Z przodu w klatce 5 łokcie poziomo na boki na wysokości głowy, wbrew „łokcie blisko tułowia”. Pionowy słupek stojaka przechodzi przez sylwetkę z boku i zaciemnia kadr.
- **Crunch - Hands Overhead — DO POPRAWY.** Patrz tabela. Najniższy punkt tułowia w klatce 3: pośladki na podłodze (x 720), a 20 px i 40 px w stronę głowy odpowiednio 11 i 22 px nad podłogą. To ~30° całego tułowia, czyli siad.
- **Hollow Hold — DO POPRAWY.** Styk w jednym punkcie (x 160–170). Kolumny x 120–140 są 9–15 px nad podłogą. W hollow lędźwie są dociśnięte, a unoszą się barki i nogi; obraz pokazuje „łódkę” na pośladkach.
- **Standing Barbell Rollout — OK z uwagą.** W rollucie ręce są proste. W pozie poprawnej łokieć ugina się do ~155° w klatkach 1 i 3, a rząd „sag” ma ręce proste. Rząd błędu różni się więc od pozy poprawnej także łokciem (pytanie 6, drobne).
- **Push-Up Wide — OK z uwagą.** „sag” jest widoczny tylko w dolnych klatkach. W klatkach 1–3 różnica wobec pozy poprawnej jest ledwie dostrzegalna; dla nauki błędu trzeba wzmocnić.

## Nowe powtarzalne luki — kandydaci na reguły

1. **Lędźwie przy podłodze w spięciach** (Crunch HO, Hollow, Heel Touchers; obrazy Crunch i Hollow bez zmian od n2). Reguła na leżenie na plecach: punkt tułowia w 20–30% długości od miednicy ku barkom ≤ ok. 3 cm nad podłogą, uniesienie tylko w odcinku piersiowym.
Regułę włączać automatycznie, gdy `opis.ruch` ćwiczenia zawiera „Lędźwie przy podłodze” albo „Dolna część pleców zostaje na podłodze”. Dzięki temu tekst wskazówki staje się sprawdzalnym warunkiem obrazu.
Wyjątki jawne: V-Up, Cocoons i Tuck Crunch, gdzie styk na kości krzyżowej jest zamierzony.
2. **Przybliżenie, które usuwa cechę definiującą** (Clock). Każdy wpis w `przyblizenia` musi wskazywać, czy brakuje cechy rozpoznawczej. Jeśli brakuje, ćwiczenie trafia do `wyjatki`, a nie do renderu.
Bramka automatyczna tego nie wykryje, więc potrzebny jest krok listy kontrolnej w bramce 4.
3. **Zwis startowy w przyciąganiu** (Inverted Row): w u = 0 ręce w pionie (±10°), drążek w rzucie bocznym nad linią mostka (±5 cm).
Do tego tor łokcia w fazie środkowej: po stronie pleców albo w linii tułowia, nie po stronie klatki. Reguła z n2 objęła tylko klatkę końcową.
4. **Rząd błędu nie zmienia stawów spoza błędu — rozszerzyć na wszystkie stawy** (Standing Rollout: kolana naprawione, łokieć nie). Reguła z n2 działa wybiórczo.
5. **Proste ręce w rolloutach**: łokieć ≥ 165° we wszystkich klatkach pozy poprawnej.
6. **Minimalna widoczność błędu**: w rzędzie błędu różnica kąta kluczowego stawu wobec pozy poprawnej ≥ ok. 8–10° w każdej klatce (Wide: „sag” prawie niewidoczny w klatkach 1–3).
7. Drobne, z n2: każdy identyfikator w `bledy_wskazowki` ma opis (Superman `cobra.mis`).

## Szablonowość pompek

- **Z przodu jest wyraźnie lepiej niż w n2.** Dolna faza odróżnia warianty: Wide ma łokcie wysoko i szeroko, Push Up skośnie ~45°, Close-Grip i Incline CG wąsko przy tułowiu (do ostatniej klatki), Diamond umiarkowanie. Cecha wariantu nie znika już w dole.
- **Z boku nadal szablon:** Push Up, Close-Grip, Diamond i Clock są niemal identyczne. Diamond różni się dłonią lekko za barkiem, Clock rozsunięciem dłoni przód/tył. Wide różni się tylko pionowym ramieniem w dole.
Z boku wariantu w praktyce nie da się rozpoznać, ale to ograniczenie rzutu, nie błąd.
- **Clock jest najmocniejszym przykładem szablonowości:** to Push Up z jednym zmienionym parametrem (przesunięcie dłoni), a nie odrębne ćwiczenie.
- Wniosek: szablon bazowy jest poprawny, a reguła łokcia przypięta do wariantu zadziałała. Następne ryzyko szablonowości to ćwiczenia, których cechą jest ruch między powtórzeniami (Clock) albo obrót tułowia. Tych drugich kontrakt nie obsługuje, stąd 4 wyjątki „roll”.

## Miara szczelności bramek

- Wszystkie 29 ćwiczeń przeszło bramki automatyczne. Recenzja uznała 24 za OK.
- **Odsetek póz OK za bramkami: 24/29 = 83%** (czyste OK 14/29 = 48%, OK z uwagami 10/29 = 34%). Przeciek bramek: 5/29 = 17%.
- Klasy przecieków: lędźwie w spięciach ×3 (jedna reguła, nr 1), przybliżenie bez cechy definiującej ×1 (krok listy, nr 2), zwis i tor łokcia w przyciąganiu ×1 (nr 3).
Reguły 1 i 2 razem podniosłyby wynik do 28/29 = 97%.
- Miara poza renderem: 8 ćwiczeń pushup_plank jest w `wyjatki` z konkretnym powodem. Licząc je jako niezałatwione, wynik wynosi 24/37 = 65%. Liczba ta mierzy jednak zakres kontraktu (brak obrotu tułowia, sprzęt poza osią), nie szczelność bramek.
