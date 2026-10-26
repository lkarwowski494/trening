# Recenzja kontrolna ruchu nr 4: pilotaż agent-pozy, przebieg n4 (bramka 4), 26.10.2026

Recenzent niezależny. Oceniałem obrazy PNG (pełna rozdzielczość, wątpliwe kadry powiększone: `scratchpad/recenzja-n4-crop/`) i manifest.json.
Uzasadnień generatora nie czytałem. Każde podejrzenie z obrazu sprawdziłem liczbami. Pozy z `poze.json` przeliczył silnik v2 z gałęzi `origin/jakosc-r2` (skrypty `scratchpad/rev4/miary.mjs`, `przedramie.mjs`, `reguly.mjs`).
Walidator z `origin/jakosc-r2` (`v2-validate.mjs --rodzina …`) uruchomiłem na obu plikach n4: **wszystkie 29 póz = OK, kod wyjścia 0**.

Pytania: (1) rozpoznawalność, (2) start, koniec i zakres, (3) styk i podparcie, (4) anatomia, (5) poza poprawna bez błędu,
(6) rząd błędu pokazuje dokładnie ten jeden błąd, (7) zgodność przodu z bokiem; lista kontrolna docs/53, kroki 1–4.

Uwaga do kątów: „zgięcie kolana” liczy silnik (`jointAngles`). W tym rigu noga wyprostowana daje ok. 10° (Lying Leg Raise, Superman i V-Up: 9–11°), więc 25° oznacza ok. 15° rzeczywistego ugięcia.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 15 | Push Up, Push-Up Wide, Close-Grip, Diamond, Plank, Plank Shoulder Taps, Suspended Push-Up, Bird Dog, Crunch HO, Dead Bug, Hollow Hold, Lying Leg Raise, Reverse Crunch, Cocoons, V-Up |
| OK z uwagą | 9 | Incline Push Up, Incline CG, Single-Arm, Plyo, Rollout (sztanga), Bench Rollout, Standing Rollout, Leg Pull-In, Superman (manifest) |
| **BŁĄD** | **5** | **Suspended Fallout, Mountain Climbers, Decline Push Up, Tuck Crunch, Alternate Heel Touchers** |

**Pozy OK za bramkami: 24/29 = 83%**, tyle samo co w n3. Czyste OK to 15/29 (52%). Cel ≥ 90% nie został osiągnięty.

**Szczelność bramek w ujęciu z polecenia: reguły automatyczne złapały 0 z 5 błędów, czyli 0%.** Wszystkie 5 póz z błędem przeszło walidator.
Ta liczba nie jest porównywalna z n1–n3 (32/67/83%). Tamte liczby to odsetek póz OK, a ta to odsetek znalezionych błędów, które złapały reguły.

Dla porównania: wszystkie 5 pozycji DO POPRAWY z n3 jest zamkniętych. Crunch HO i Hollow naprawione (reguła `ledzwie_przy_podlodze` działa), lędźwie w Heel Touchers też naprawione. Clock i Inverted Row trafiły do wyjątków z powodem.
Reguły z n3 działają więc w swoich klasach. Tegoroczne błędy to inne klasy, których żadna reguła nie obejmuje.
Sprawdziłem liczbami na `n3/*/poze.json`: Decline, Mountain Climbers, Tuck Crunch i ramiona w Heel Touchers miały w n3 te same wartości. **Cztery z pięciu błędów to przeoczenia recenzji n3**, a nie regresje (krok 4 listy kontrolnej).
Nowe w zestawie jest Suspended Fallout (w n3 był w wyjątkach).

Nowymi regułami (niżej) da się złapać 5 z 5 błędów bez fałszywego alarmu na pozostałych 24 pozach. Progi dobrałem na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.

## Znaleziska — BŁĄD (od najpoważniejszego)

| # | Ćwiczenie | Klatka / staw | Co jest źle | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Suspended Fallout** (nowe) | wszystkie klatki pozy poprawnej, kolano i biodro; u = 0 bark | Kolana zgięte 54° w u = 0, maleje do 25° w u = 1. Biodro zgięte 24° w u = 0. Kolano odchodzi do 17 cm od linii kostka–bark, czyli ciało „siedzi” w półprzysiadzie. W u = 0 ręce zwisają przy biodrach (zgięcie barku 26°, uchwyty na wysokości bioder). **Rząd „sag” ma biodro prostsze niż poza poprawna** (4° wobec 24° w u = 0–0,28), więc w pierwszych klatkach rząd błędu wygląda poprawniej niż poza poprawna. | Ciało proste od pięt do głowy w każdej klatce (kolano ≈ jak w desce, biodro ≈ 0°). Start: pochylenie w przód z prostymi rękami przed klatką na wysokości barków (zgięcie barku ok. 80–90°), potem ręce wędrują nad głowę. | 90% | realny (każde wyświetlenie) | nie: `rollout_linia_kostki` sprawdza tylko klatkę skrajną i tylko miednicę (miednica leży na linii, 0,2 cm, bo zgięte kolano i biodro się znoszą) |
| 2 | **Mountain Climbers** | u = 0,25–0,75, kolana | Kolana uciekają w bok na z = ±25–29 cm (biodra ±8,5, kostki ±10), czyli poza ręce. Z przodu w klatkach 2–4 kolana wystają na zewnątrz rąk. W u = 0,25–0,75 oba kolana są 10 cm (oś) nad podłogą, czyli ok. 5 cm luzu, a sylwetka czyta się jak klęk lub czworaki. | Kolano idzie prosto pod klatkę, między ręce (\|z kolana\| ≤ ok. biodro + kilka cm). Nogi zmieniają się w podporze, kolano nogi z tyłu wysoko nad podłogą. | 85% | realny | nie: jest tylko `miednica_stala_wysokosc` |
| 3 | **Decline Push Up** | u = 1, łokieć i przedramię | W dole łokieć jest 8,4 cm **poniżej** barku (y 12 cm nad podłogą) i 30 cm za nadgarstkiem. Przedramię w rzucie z boku odchyla się 72° od pionu, czyli prawie leży. Zgięcie łokcia 146°. Kadr wygląda jak zejście na przedramiona, nie jak dół pompki. W pozostałych pompkach do podłogi łokieć jest nad barkiem (+2,8 do +20 cm), a przedramię odchyla się od pionu o ≤ 48°. | Nadgarstek pod łokciem lub lekko przed nim (przedramię ≤ ok. 45–50° od pionu w rzucie z boku), łokieć na wysokości barku lub wyżej. | 85% | realny | nie: `lokiec_nad_nadgarstkiem` patrzy tylko w osi z (rzut z przodu), a w rzucie z boku nie sprawdza nic |
| 4 | **Tuck Crunch** | wszystkie klatki, kolano | Zgięcie kolana 29° w u = 0 i najwyżej 69° w u = 1. Nogi są prawie proste i uniesione w pion (kostki 72–87 cm nad podłogą). Obraz pokazuje spięcie z nogami w pionie, czyli inne ćwiczenie. Cechy „tuck” (podkulone kolana) brakuje. Recenzja n3 odczytała tu ~95°, ale dane się nie zmieniły i wynoszą 29–69°. | Kolana zgięte ok. ≥ 90° przez cały ruch (uda pionowo, podudzia poziomo), w końcu kolana przyciągnięte ku klatce. | 85% | realny | nie: brak reguły na minimalne zgięcie kolana |
| 5 | **Alternate Heel Touchers** | u = 0 obie ręce; u = 0,5 i 1 ręka sięgająca, łokieć | W u = 0 ręce leżą zgięte 88° w łokciu i odwiedzone 52°, „skrzydełka” na podłodze. Ręka sięgająca do pięty ma łokieć zgięty 49–58°, wypchnięty w bok (z przodu widać literę „Λ”). Z boku tego nie widać, bo zgięcie leży w płaszczyźnie czołowej. Dłoń dochodzi na 8,6 cm od pięty. Lędźwie są już poprawne. | Ręce proste wzdłuż ciała (zgięcie łokcia ≤ ok. 20–30°), ręka sięga ślizgiem do pięty po swojej stronie. | 85% | realny | nie: `rece_wzdluz_ciala` nie obejmuje tego ćwiczenia, a i tak sprawdza tylko wysokość łokcia i dłoni, nie zgięcie |

## OK z uwagą (backlog, nie blokuje)

- **Kolana „miękkie” we wszystkich deskach i pompkach (systemowe):** zgięcie kolana 25° we wszystkich 13 pozach podporu na stopach, wobec ok. 10° nogi prostej w tym rigu. W rzucie z boku widać lekkie załamanie w kolanie (`recenzja-n4-crop/pu-f1.png`).
Kolana wychodzą też w bok o ok. 7 cm względem linii kostek. Nie zaliczam tego do błędów, bo ugięcie ok. 15° na obrazie jest subtelne. Rząd „sag” ma jednak kolano prostsze (12°) niż poza poprawna.
- **Rollout (sztanga), Bench Rollout, Standing Rollout:** w rzędzie „sag” kąt biodra jest identyczny z pozą poprawną w u = 0–0,55 (6 z 9 klatek; Standing: 5 z 8).
Reguły widoczności (`blad_widoczny_stale` ≥ 4 cm, `widocznosc_bledu_kat` ≥ 8°) przechodzą wyłącznie dzięki wyprostowaniu łokcia o ok. 12°, a łokieć to staw spoza błędu (wyjątek `DOTYCZY_BLEDU_CWICZENIE`). Na obrazie opadanie bioder pojawia się dopiero w 3 ostatnich klatkach.
Z punktu widzenia trenera to akceptowalne, bo „sag” narasta przy wyproście. Formalnie jednak narusza krok 3 listy (błąd postawy widoczny w każdej klatce), a reguła daje się obejść. Bench Rollout ma też nadal krótki zakres końcowy (jak w n3).
- **Incline Push Up / Incline CG:** z przodu w dole łokcie nad barkami. Geometrycznie jest to spójne z bokiem (odwiedzenie 10–19°), ale odbiór bywa mylący (jak w n3).
- **Single-Arm Push-Up:** rozstaw kostek 30 cm (≥ 28, reguła spełniona), kolana 18–25°. Lepiej niż w n3, ale stopy wciąż mało szeroko jak na podpór jednorącz.
- **Plyo Push-Up:** z przodu lot nadal wygląda jak stanie (bez zmian).
- **Leg Pull-In:** koniec ruchu to nadal „stolik” (bez zmian).
- **Superman:** obraz dobry. `bledy_wskazowki` zawiera `cobra.mis` bez opisu (`pl.json` nie ma klucza `cobra.mis`).
Reguła `manifest_opis_bledu` by to złapała, ale manifest n4 nie ma pola `zgodnosc_manifestu`, czyli kontrola manifestu (agent-pozy/run.mjs z r2) nie została uruchomiona przy budowie n4. **Luka procesu: podglądy powstały bez kroku, który już istnieje.**

## Szczegóły dla wybranych OK

- **Crunch HO, Hollow Hold:** naprawione. Kręgosłup zwija się (zgięcie 40° i 35°), lędźwie leżą na podłodze, uniesiony jest odcinek piersiowy (`recenzja-n4-crop/cho3.png`, `hh.png`).
- **Push-Up Wide:** „sag” jest teraz wyraźny w każdej klatce (biodro 8° wobec −10° w u = 0, do −17° w u = 1). Uwaga z n3 zamknięta.
- **Standing Barbell Rollout:** łokcie proste w pozie poprawnej (4–7°). Uwaga z n3 zamknięta.
- **Suspended Push-Up (nowe):** taśmy pionowo nad uchwytami, ciało w linii, rząd „partial” i „sag” czytelne. Przybliżenie (uchwyty nieruchome) nie usuwa cechy rozpoznawczej.
- **Przybliżenia z manifestu (krok 1):** Heel Touchers (sztywny skłon boczny), Superman (stopy), Tuck (kostki), Cocoons (ramiona) i Suspended ×2 zachowują cechę rozpoznawczą.
Wyjątek: Tuck Crunch, ale tam cechę gubi nie przybliżenie, tylko kolano (błąd nr 4).

## Proponowane reguły (z geometrii; progi = konwencja rysunku, do potwierdzenia przez badacza)

Wartości zmierzone na n4 podaję po to, żeby pokazać rozdzielenie: błąd / najgorsza z pozostałych póz.

| # | Reguła | Warunek | Zakres | Błąd n4 | Pozostałe pozy |
|---|---|---|---|---|---|
| R1 | `cialo_w_linii_pelne` | w KAŻDEJ klatce pozy poprawnej kolano i miednica ≤ 8 cm od linii kostka–bark (nie tylko miednica i nie tylko klatka skrajna) | podpór na stopach z ciałem prostym: pompki, deski, Suspended Fallout | Fallout 17,1 cm | pompki/deski ≤ 7,9 cm |
| R2 | `fallout_start_rece_przod` | u = 0: zgięcie barku ≥ 70° (ręce przed klatką), łokieć ≤ 25° | Suspended Fallout (i inne fallouty) | 26,5° | — |
| R3 | `kolana_proste_podpor` | zgięcie kolana ≤ 15° ponad wyprost rigu (≤ ok. 25° silnika; docelowo ≤ 15° po poprawie szablonu) w każdej klatce pozy poprawnej | jak R1 | Fallout 54° | pompki 25° (systemowa uwaga: przy progu 15° flaguje 13 póz) |
| R4 | `kolano_pod_tulowiem` | \|z kolana\| − \|z biodra\| ≤ 13 cm i \|z kolana\| ≤ \|z dłoni\| w każdej klatce | Mountain Climbers (i warianty z kolanem do klatki w podporze, poza wariantami „spiderman”/„cross-body”) | 20,1 cm | ≤ 12,6 cm |
| R5 | `podpor_bez_kleku` | w podporze na dłoniach najniższe kolano ≥ 15 cm (oś) nad podłogą w każdej klatce | Mountain Climbers | 10,2 cm | — |
| R6 | `lokiec_nad_nadgarstkiem_bok` | w klatce największego zgięcia (gdy zgięcie łokcia ≥ 120°) przedramię w rzucie z boku ≤ 55° od pionu i łokieć nie niżej niż bark (y_łokcia ≥ y_barku − 2 cm) | pompki do podłogi i z podwyższeń | Decline 72° / −8,4 cm | ≤ 48,4° (Suspended 56,8°: wyłączyć zawieszenie albo próg 60°) / ≥ +2,8 cm |
| R7 | `kolana_ugiete_min` (parametr per ćwiczenie w figury-sens.json) | zgięcie kolana ≥ 80° w każdej klatce | Tuck Crunch, Reverse Crunch, Dead Bug (nogi startowe) itp. — ćwiczenia z „podkulonymi” kolanami | Tuck 29° | Reverse Crunch ≥ 89,8° |
| R8 | `rece_proste` | zgięcie łokcia ≤ 30° w każdej klatce | ręce „wzdłuż ciała” i „sięgające”: dopisać Alternate Heel Touchers do RECE_WZDLUZ i rozszerzyć regułę o zgięcie łokcia | Heel 87,7° | Lying Leg Raise, Reverse Crunch, Leg Pull-In 27,5–27,7° |
| R9 | `widocznosc_bledu_w_obszarze` | w `widocznosc_bledu_kat` i `blad_widoczny_stale` różnica ma pochodzić ze stawów z bazowego `DOTYCZY_BLEDU[cue]` (dla „sag”: biodro), a nie z wyjątków per ćwiczenie; w rolloutach klatki ze zgięciem biodra > 30° jawnie zwolnione z wymogu „każda klatka” | wszystkie rzędy błędu | Rollouty ×3: 0° w biodrze w 5–6 klatkach | — |
| R10 | `rzad_bledu_nie_lepszy` | w rzędzie błędu postawy staw kluczowy ma być „gorszy” niż w pozie poprawnej w kierunku błędu (sag: biodro_błąd < biodro_poprawne − 8° w każdej klatce), a nie tylko różny | wszystkie błędy postawy | Fallout: błąd 4°, poprawna 24° (rząd błędu prostszy) | — |
| P1 | krok procesu: kontrola manifestu | podgląd do recenzji tylko z polem `zgodnosc_manifestu` (puste lub z wyjątkami); brak pola = podgląd nieważny | agent-pozy/run.mjs → bramka 4 | Superman `cobra.mis` | — |

R1–R8 łapią wszystkie 5 błędów n4 (R1 i R3 łapią błąd nr 1, R4 i R5 nr 2, R6 nr 3, R7 nr 4, R8 nr 5). Na pozostałych 24 pozach nie dają fałszywego alarmu przy progach z tabeli; wyjątek to R3, która przy progu docelowym 15° flaguje celowo wszystkie pompki.
R9 i R10 zamykają obejście reguł widoczności. P1 zamyka lukę procesu.

## Wniosek dla modelu pracy

1. Bramki z n3 zadziałały w swoich klasach (lędźwie, przybliżenia, przyciąganie), ale **reguły są przypięte do znanych przypadków**. Każde nowe ćwiczenie (Fallout) albo staw, którego nikt nie sprawdził (kolano w Tuck i MC, przedramię z boku), przechodzi bez kontroli.
2. **Recenzja wzrokowa przeocza błędy widoczne tylko w jednym rzucie albo w liczbach** (ramię zgięte w płaszczyźnie czołowej, kolano 29° odczytane jako ~95°). Propozycja na listę kontrolną bramki 4, krok 5: recenzent dostaje do każdej pozy tabelę kątów stawów z silnika (min/max per staw, jak `rev4/reguly.mjs`) i porównuje ją z opisem ćwiczenia, nie tylko z obrazem.
3. Reguły „widoczności błędu” trzeba wiązać ze stawem błędu i z kierunkiem (R9, R10). W n4 obie dały się spełnić zmianą niezwiązaną z błędem.
