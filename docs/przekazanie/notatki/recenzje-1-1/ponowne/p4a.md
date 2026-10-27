# Ponowna recenzja ruchu i treści kart: poprawki-p4a (olympic 18 + kb_ballistic 6), 27.10.2026

Recenzent niezależny (recenzent p4a). Nie czytałem README podglądów, komunikatów commitów gałęzi, komentarzy w `scripts/figures/agent-pozy/*.mjs` ani opisów poprawek.

Co sprawdziłem:

- Podglądy `podglady-1-1/poprawki-p4a/` (24 PNG) oglądałem w pełnej rozdzielczości, z kadrami rzutu z boku powiększonymi 2×.
- Liczby policzyłem silnikiem v2 we własnym, odłączonym worktree na `origin/poprawki-p4a` @ aa4253fc. Skrypty są w scratchpadzie: `miary` (siatka u co 0,05), `kf` (co 0,025), `el` (łokieć i przedramię) i `tab` (tabela kątów funkcją `tabelaKatow` z repo).
- Dla porównania wziąłem pozy sprzed zmian z `origin/integracja-1-1`.
- Treść karty: `cue-sets.json`, `lib/cues/text/pl.json`, `lib/cues/data.json`, `muscles.generated.ts`, `components/ExerciseCues.tsx` i grep w `docs/research/rejestr-twierdzen.json`.

Walidator: `v2-validate.mjs` na każdej pozie osobno (39 póz obu rodzin) daje **39/39 OK**, kod wyjścia 0. Uruchomiłem go bez `--rodzina`, więc reguły sensu rodziny są tylko w zakresie domyślnym. Gałąź ma też zielone tests.yml.

## Krok 6: ważność podglądu — BRAK

W katalogu `podglady-1-1/poprawki-p4a/` są **tylko PNG**. Brakuje `PODGLAD-WAZNY.txt`, `manifest.json` (`zgodnosc_manifestu`) i `katy-stawow.md`. Według listy kontrolnej (pkt 6) taki podgląd nie trafia do recenzji.

Recenzję i tak przeprowadziłem, bo koordynator zlecił ją wprost. Tabelę kątów wyliczyłem sam tą samą funkcją repo (niżej), więc kontrola liczbowa jest pełna. Kontroli manifestu (`zgodnoscManifestu`) **nie** zastąpiłem.

Akcja dla generatora: podgląd budować przez `run.mjs` z manifestem albo dopisać znacznik. To mechanizm, nie uwaga.

Zakres zmian sprawdziłem porównaniem JSON póz z integracja-1-1. Zmieniło się dokładnie 24 ćwiczeń. Pozostałe 15 (Power/Split Jerk, Jerk Dip Squat, Snatch Balance, Muscle Snatch, kettlebellowe Clean/Snatch/Jerk itd.) są bajt w bajt bez zmian. Silnik z nowym trybem „gora” nie zmienia ich wyglądu, bo nie używają tego trybu.

Wiersze błędów na podglądach: tylko One-Arm Kettlebell Swings i Kettlebell Sumo High Pull mają rząd błędu (`mis.roundBack`). Pozostałe 22 mają `bledy: []`.

## Wynik

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 9 | Power Clean, Hang Clean, Block Clean, Block Power Clean, Power Snatch, Block Power Snatch, Clean Pull, Snatch Pull, Snatch Shrug |
| OK z uwagą | 13 | Clean, Split Clean, Barbell Snatch, Split Snatch, Hang Snatch, Block Snatch, Clean Shrug, Squat Jerk, Clean and Jerk, Kettlebell Swing, One-Arm Kettlebell Swings, Double KB Push Press, One-Arm KB Push Press |
| **BŁĄD** | **2** | **Bottoms-Up Clean From The Hang Position, Kettlebell Sumo High Pull** |

Uwaga F (sztanga w racku na wysokości brody) dotyczy prawie wszystkich zarzutów i podrzutów. Dla czytelności wpisuję ją tylko w tabeli uwag, a nie przy każdym „OK”.

### Stan znalezisk z pierwotnych recenzji

| Pierwotne | Stan w p4a | Dowód (liczby) |
|---|---|---|
| olympic nr 1: przyjęcie w staniu na palcach (14 ćw.) | **usunięte** | Power Clean: po wyproście (u 0,25: kolano 4°) sztanga 91 → 133 cm przy kolanie 4 → 77°. 90% wysokości końcowej osiąga przy kolanie ~50°. Clean: przyjęcie w przysiadzie (kolano 124°). Snatch: zablokowanie nad głową w przysiadzie (u 1: łokieć 19°, kolano 126°). Squat Jerk: blokada w przysiadzie (u 1: łokieć 14°, kolano 126°). Stopy w powietrzu: zarzuty i rwania ok. 10–15% u (było 40–60%) |
| olympic nr 2: Pulls kończą się zarwaniem | **usunięte** | u = 1: łokieć 20–21°, sztanga 94/99 cm, wspięcie (pięta 19 cm, palce 0,7 cm), `shrug` 5 cm |
| olympic nr 3: Shrugs bez wzruszenia | **usunięte** | u = 1: `uniesienieBarkow` 5 cm, ręce proste (łokieć 20–21°) |
| olympic nr 4: Block bez bloków | **usunięte** | skrzynie x −4…42, blat 29,5 cm, po obu stronach. Talerz (dół 52 − 22,5 = 29,5) leży na blacie w u = 0. Słupek usunięty |
| olympic: Clean and Jerk rusza z przysiadu | **usunięte** | po zarzucie wstanie do kolana 24° (u 0,65), krótkie ugięcie 35–39° (u 0,675), wybicie (u 0,75) |
| olympic B: nożyce za głębokie | **nadal** (uwaga) | Split Clean, Split Snatch, C&J: tylne kolano 100,6°, miednica 65 cm, rozstaw kostek 47 cm (30 / −17), jak przed poprawką |
| olympic C: sztanga przed środkiem stopy w przysiadzie | **nadal** (uwaga, waga podniesiona) | Barbell, Hang i Block Snatch u = 1: sztanga x 23,7. Squat Jerk: x 24,8. Palce stopy x 18, śródstopie ok. x 6. Sztanga wisi **przed czubkami palców**, 17–19 cm przed śródstopiem |
| olympic A: palce nad podłogą przy wspięciu | częściowo | klatki końcowe z pauzą naprawione (Pulls i Shrugs: 0,7 cm). Przejściowo nadal 2,5–4 cm (patrz uwagi) |
| kb nr 1: swing bez zamachu między nogami | **usunięte** | u = 0: rączka w x −7,4 (One-Arm −5,3), wysokość 60 cm (nad kolanami), za linią kolan. Dzwon skierowany w tył i w dół |
| kb nr 2: Bottoms-Up = kopia Kettlebell Clean | **częściowo; nowy BŁĄD** | start z zawieszenia jest (rączka 67 cm, biodro 44°), na końcu dzwon nad rączką i przedramię pionowo (odchylenie 4°). Dzwon jest jednak „dnem do góry” przez **cały** ruch, także w zwisie (nr 1 niżej) |
| kb nr 3: Push Press jak podrzut | **usunięte** | po wybiciu (u 0,7: kolano 0°) kolano zostaje 0° do u = 1, a łokieć 94 → 10,6°. Pozy różnią się od Jerk |
| kb nr 4: Sumo High Pull nad głową i daleko | **częściowo; BŁĄD nadal** | wysokość poprawiona: 186 → 160 cm, czyli barki + 7,5. Łokcie nadal nisko i z przodu, pod dłońmi (nr 2 niżej) |
| kb C: palce nad podłogą | nadal | Push Press 4,2 cm (u 0,7), Sumo HP 3,3 cm **w klatce końcowej** u = 1 |

## Znaleziska — BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność, waga | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Bottoms-Up Clean From The Hang Position** | u = 0 … ok. 0,6 (zwis i wymach) | **Kettlebell „dnem do góry” wisi na prostej ręce.** W u = 0 ręka jest prosta (łokieć 7,7°), przedramię skierowane w dół (−179° od pionu), a rączka na 67 cm przy udzie. Dzwon jest jednak **nad** rączką (`dir` (0; 1; 0), tryb `gora`). Kula leży więc na pięści i na biodrze, a uchwyt jest pod nią. Tak samo w u 0,1–0,5, gdy przedramię jest poniżej poziomu (od pionu 161° → 78°). Fizycznie niemożliwe: w zwisie kettlebell wisi dzwonem w dół, a odwraca się dnem do góry dopiero w końcowej fazie, przy pionowym przedramieniu. Widać to na kadrze `crop/bu-zoom.png` (3 pierwsze klatki z boku i z przodu). Ponadto (mniej ważne): rączka odjeżdża do 49 cm przed bark (u 0,4; łuk jak w unoszeniu w przód zamiast zarzutu blisko ciała), a wolna ręka (L) przez cały ruch sterczy w przód w dół (chwyt x 52 cm przed miednicą). | W zwisie i wymachu dzwon pod rączką albo wzdłuż przedramienia (`dol` / `wzdluz`). „Gora” dopiero w klatkach z przedramieniem ≥ ok. 45° nad poziomem. Wymaga zmiany trybu dzwonu w trakcie ruchu: silnik ma tryb „stały w całym ruchu” (opis w `gear.ts`). Druga opcja: płynne przejście jak w `wzdluz` („gdy przedramię uniesione — za przedramię”). Wolna ręka wzdłuż ciała albo lekko w bok. | 95% | realny (każde wyświetlenie); **WYSOKIE** (obraz pokazuje fizycznie niemożliwy chwyt w cesze rozpoznawczej ćwiczenia) | **nie**. Test p4a sprawdza najpewniej stan końcowy (dzwon nad rączką w u = 1), a zgodności kierunku dzwonu z przedramieniem w pozostałych klatkach nie sprawdza żadna reguła. Propozycja: `dzwon_gora_tylko_przy_pionowym_przedramieniu`: dla `dzwon: gora` w każdej klatce przedramię ≤ 45° od pionu i dłoń nad łokciem. Tu łamie ją 60% ruchu |
| 2 | **Kettlebell Sumo High Pull** | u 0,5 → 1, ręce | **Łokcie nisko i z przodu, pod dłońmi; ruch wygląda jak unoszenie w przód z uginaniem.** W u = 1 dłoń jest na 160 cm, a łokieć na 129 cm, czyli **31 cm pod dłonią** i 23 cm pod barkiem. Łokieć wychodzi 20 cm przed bark i tylko 1,8 cm w bok (z 17,2 vs bark 19; odwiedzenie ramienia 12,6°). Przedramię jest pionowe (0,4° od pionu). W u 0,6–0,7 przedramię leży poziomo i wskazuje w przód, a rączka jest 30–33 cm przed barkiem (x 28,8 vs bark −2,4), na wysokości brzucha. Na arkuszu (`crop/m4.png`, 3. rząd) klatki 7–9 wyglądają jak „trzymanie kettlebella przed sobą na wyciągniętych przedramionach”, a ostatnie jak uginanie z ciężarem pod brodą. Do tego klatka końcowa (pauza) na palcach: palce 3,3 cm nad podłogą (pięty 19 cm), czyli lewitacja tej samej klasy co uwaga A. | Kettlebell jedzie pionowo blisko ciała (rączka ≤ ok. 10–15 cm przed tułowiem). Łokcie prowadzą w górę i na boki: w u = 1 łokieć na wysokości barku albo wyżej, **nad** dłonią, z odwiedzeniem ramienia rzędu 60–90°. Dłonie na wysokości klatki albo brody. Stopy na podłodze albo krótkie wspięcie z palcami na podłodze. | 85% | realny; **WYSOKIE** (cecha rozpoznawcza „high pull” — łokcie wysoko — niewidoczna; obraz uczy innego ruchu) | **nie**. Proponowana w kb_ballistic.md reguła `high_pull_wysokosc` (wysokość i odległość od miednicy) jest spełniona albo prawie spełniona, a położenia łokcia nie mierzy. Propozycja: `high_pull_lokcie`: w u = 1 y łokcia ≥ y dłoni − 5 cm i odwiedzenie ramienia ≥ 45°. Tu łokieć jest 31 cm pod dłonią, a odwiedzenie 12,6° |

Szczelność reguł automatycznych w p4a: **0 z 2 błędów (0%)**. Obie pozy przechodzą testy gałęzi (tests.yml zielony według linii stanu).

Oba błędy to ten sam wzorzec co w n6. Reguła z poprzedniej recenzji (wysokość, kierunek dzwonu w u = 1) została spełniona, ale cecha rozpoznawcza dalej jest niewidoczna albo w innych klatkach pojawił się nowy błąd.

## OK z uwagą (backlog; nie blokują)

| Uwaga | Ćwiczenia | Liczby | Pewność, waga |
|---|---|---|---|
| **B. Nożyce za głębokie** (bez zmian od pierwotnej) | Split Clean, Split Snatch, Clean and Jerk (i niezmieniony Split Jerk) | u = 1: tylne kolano 100,6°, przednie 84°, miednica 65 cm, rozstaw kostek 47 cm. Tylne kolano blisko podłogi, obraz bliższy wykrokowi. W nożycach tylna noga jest prawie prosta, pięta w górze | 65%, ŚREDNIE |
| **C. Sztanga nad głową przed czubkami palców w pełnym przysiadzie** (bez zmian; podnoszę wagę) | Barbell Snatch, Hang Snatch, Block Snatch, Squat Jerk (i niezmieniony Snatch Balance) | u = 1: sztanga x 23,7–24,8, palce stopy x 18, śródstopie ~6. Ramiona nad głową pochylone w przód ok. 30° (widać na `crop/m2.png`). Przy dużym ciężarze to utrata równowagi, nie poprawne przyjęcie. W Power Snatch / Block Power Snatch jest dobrze (x 1) | 70%, ŚREDNIE; tania poprawka (przesunięcie chwytu i miednicy w x), proponuję zrobić przy najbliższej rundzie olympic |
| **F (nowa). Sztanga w racku na wysokości brody** | wszystkie zarzuty w u = 1 (Power Clean, Block Power Clean; w przysiadzie Clean, Hang, Block Clean), start Squat Jerk; ten sam rack w niezmienionych Power Jerk, Split Jerk, Jerk Dip Squat | sztanga 15 cm nad stawem barkowym i 11 cm przed nim (Power Clean u 1: sztanga (−5,7; 133,3), bark (−16,9; 118,4), środek głowy (−16,3; 140,4)). Talerz przy rzucie z boku zasłania brodę i szyję (`crop/pc-side.png`, ostatnia klatka). W racku sztanga leży na przednich mięśniach naramiennych, przy obojczykach, ok. 3–6 cm nad stawem | 60%, NISKIE–ŚREDNIE; konwencja całej rodziny, nie regresja p4a |
| **A/C. Stopy w powietrzu, palce nad podłogą** | Squat Jerk, Clean and Jerk, oba Push Press, Clean/Snatch Shrug (przejściowo) | Squat Jerk: palce 2–4 cm nad podłogą przez u 0,22–0,62 (ok. 40% ruchu, „unoszenie się na palcach” w 5 klatkach). C&J u 0,75: obie stopy 9,5–10,7 cm nad podłogą (podskok do nożyc; krótki, dopuszczalny, ale wysoki). Push Press u 0,52–0,8: palce do 4,2 cm. Shrugs u 0,9–0,95: palce 2,5 cm, potem opadają do 0,7 cm | 60%, NISKIE |
| **G. Rząd błędu `mis.roundBack` w One-Arm Kettlebell Swings nie obejmuje dołu zamachu** | One-Arm Kettlebell Swings | Zaokrąglenie (kręgosłup 26°) zaczyna się dopiero w u 0,504 (rączka 68 cm, przed ciałem, w wymachu). W u 0–0,41 (zamach między nogami, najgłębszy skłon, tułów 62°) rząd błędu jest identyczny z poprawnym. Przed zmianą błąd zaczynał się w u 0,32. Klatki błędu nie przesunęły się razem z nowymi klatkami zamachu. Wskazówka „Zaokrąglanie pleców, żeby dociągnąć ciężar” jest więc widoczna tylko w połowie wymachu. Sumo HP: błąd od u 0,122 (blisko startu) — w porządku | 60%, NISKIE |
| **H. Squat Jerk: tekst karty z wyciskania z nóg** | Squat Jerk | karta (zestaw ogólny `pushPress`, z dopiskiem „Ogólne wskazówki dla tego ruchu”) mówi „ręce kończą ruch”. W podrzucie ręce blokują się pod sztangą przy zejściu w przysiad, a dociskanie rękami to błąd podrzutu. Rysunek pokazuje poprawnie podrzut, więc tekst i rysunek się rozjeżdżają | 60%, NISKIE (sprawa przypisania zestawu, nie p4a) |
| Kettlebell Swing / One-Arm | — | Dół zamachu poprawny. U góry rączka 151 / 143 cm (barki 139), ręce proste (łokieć ≤ 18°). `kb.setup` („stań za kettlebellem… chwyć oburącz”) opisuje ustawienie przed ruchem, którego rysunek nie pokazuje — dopuszczalne. Wolna ręka w One-Arm przez cały ruch w przód i w dół, obok kettlebella | OK |
| Push Press (Double i One-Arm) | — | Rack 23 cm przed barkami (pierwotna uwaga B z kb_ballistic, bez zmian). Pozy ok | — |

## Treść kart (B)

- **olympic (18) i Bottoms-Up:** zestaw ogólny `oly.*` (`oly.back`, `oly.close`, `oly.legs`, `oly.mis`) nie ma tekstu w żadnym języku (`meta.newIds`). `ExerciseCues.tsx` odfiltrowuje id bez tekstu, więc karta pokazuje **sam rysunek, bez wskazówek** i bez dopisku. Nie ma rozjazdu treść–rysunek, ale nie ma też treści do oceny. Stan sprzed p4a, poza zakresem tej gałęzi.
- **Squat Jerk:** `pp.dip`, `pp.legs`. Patrz uwaga H.
- **Push Press (2):** `pp.dip` („Ugięcie krótkie, tułów napięty”) i `pp.legs` („…ręce kończą ruch”) **zgadzają się teraz z rysunkiem**: ugięcie do kolana 35°, potem wyprost rąk przy prostych nogach. Rząd błędu `ohp.mis.lock` nie ma tekstu (newIds), więc sekcja „Częste błędy” jest pusta, a pozy też nie mają rzędu błędu. Spójne.
- **Kettlebell Swing (own) i One-Arm:** `kb.move` („przepuszczając kettlebell między nogami”) jest **teraz widoczny na rysunku** (w pierwotnej recenzji to był BŁĄD nr 1). `kb.hips` i `hinge.back` zgadzają się z rysunkiem: plecy proste, siła z bioder, ręce proste. Rząd błędu: uwaga G.
- **Sumo High Pull:** `sumo.kneesOut` zgadza się z rysunkiem (kostki z ±23, rotacja stóp 38°, szeroki rozstaw). `hinge.back` też. Nie zgadza się sam rysunek ruchu ramion (BŁĄD 2).
- **Mięśnie** (`muscles.generated.ts`) bez zmian w p4a. Sumo HP i Bottoms-Up mają oznaczenie „brak źródła — uproszczenie”, a reszta „jedno źródło” / „umiarkowane”, czyli są nazwane.
- **Rejestr twierdzeń:** wyświetlane teksty (`kb.*`, `pp.*`, `hinge.back`, `mis.roundBack`, `sumo.kneesOut`) nie zawierają liczb, twierdzeń zdrowotnych ani odwołań do źródła. Nie wymagają więc wpisu w `rejestr-twierdzen.json` i wpisu nie mają. Brak znalezisk.
- Język naturalny („jak trener”), bez nazw źródeł i marek: OK.

## Rodziny do statusu „zatwierdzona”

- **olympic: tak, warunkowo.** Wszystkie 4 klasy BŁĘDÓW z pierwotnej recenzji usunięte, w 18 zmienionych pozach brak nowych BŁĘDÓW. Uwagi B, C i F (ŚREDNIE) do backlogu z wersją, a C proponuję poprawić przy najbliższej rundzie. Warunek: dołożyć znacznik ważności i manifest podglądu (krok 6).
- **kb_ballistic: nie.** 2 BŁĘDY WYSOKIE: Bottoms-Up (dzwon dnem do góry w zwisie, przy obecnym silniku do naprawy tylko z trybem dzwonu zależnym od klatki) i Sumo High Pull (łokcie). Swing i Push Press są gotowe.

## Tabela kątów (min…max, obie strony; wyliczona przez recenzenta funkcją `tabelaKatow` z repo, bo w podglądzie jej brak)

| ćwiczenie | biodro | kolano | kostka | łokieć | bark zgięcie | bark uniesienie | bark odwiedzenie |
|---|---|---|---|---|---|---|---|
| Power Clean | 7.8…126.5° | 2.6…99.6° | -43.3…21.1° | 17.5…148.4° | -7.2…144.9° | 16.0…105.7° | 9.6…87.6° |
| Clean | 7.8…126.5° | 2.6…123.8° | -43.3…32.6° | 17.5…146.0° | 3.7…133.4° | 16.0…104.0° | 9.6…87.3° |
| Split Clean | 7.8…126.5° | 2.6…100.6° | -43.3…23.7° | 17.5…147.7° | -0.5…153.3° | 16.0…102.6° | 9.6…87.1° |
| Hang Clean | 7.8…94.6° | 2.6…123.8° | -43.3…32.8° | 17.0…146.0° | 1.6…133.0° | 16.0…104.1° | 9.6…86.1° |
| Block Clean | 7.8…94.6° | 2.6…123.8° | -43.3…32.8° | 15.5…146.0° | 0.9…136.5° | 16.0…104.6° | 9.6…86.0° |
| Block Power Clean | 7.8…89.8° | 2.6…77.0° | -43.3…21.1° | 15.9…148.3° | -1.3…139.2° | 16.0…104.6° | 9.6…87.9° |
| Barbell Snatch | 5.6…131.0° | 2.6…126.2° | -43.3…34.1° | 13.1…133.6° | -76.8…261.0° | 14.9…148.2° | 9.7…84.6° |
| Power Snatch | 5.2…131.0° | 2.6…99.6° | -43.3…22.8° | 16.7…133.6° | -76.8…261.7° | 14.9…148.1° | 9.9…84.6° |
| Split Snatch | 5.4…131.0° | 2.6…100.6° | -43.3…23.7° | 14.1…135.2° | -78.4…257.1° | 14.9…147.8° | 9.9…83.8° |
| Hang Snatch | 5.2…105.9° | 2.6…126.2° | -43.3…34.1° | 15.9…134.0° | -78.3…247.1° | 14.8…148.2° | 9.7…84.7° |
| Block Snatch | 5.3…105.9° | 2.6…126.2° | -43.3…34.1° | 14.6…133.9° | -82.7…240.4° | 14.9…148.2° | 9.7…83.5° |
| Block Power Snatch | 5.2…94.4° | 2.6…77.0° | -43.3…21.0° | 16.3…133.8° | -78.3…256.2° | 14.8…148.1° | 9.3…84.8° |
| Clean Pull | 7.1…126.5° | 0.0…99.6° | -44.6…19.3° | 16.7…20.4° | 7.5…49.5° | 16.0…51.0° | 9.6…15.2° |
| Snatch Pull | -7.0…131.0° | 0.0…99.6° | -44.6…19.3° | 16.5…21.3° | 1.2…53.1° | 14.7…53.7° | 9.8…16.3° |
| Clean Shrug | 7.8…62.8° | 2.6…27.0° | -43.3…4.0° | 16.6…20.9° | 7.4…39.9° | 16.0…41.6° | 12.6…15.2° |
| Snatch Shrug | 5.8…69.2° | 2.6…27.0° | -43.3…4.0° | 16.4…22.2° | 0.8…44.6° | 14.3…46.6° | 9.9…15.4° |
| Squat Jerk | 5.7…105.9° | 2.6…126.2° | -40.3…34.1° | 14.1…146.1° | 43.8…164.5° | 64.2…161.5° | 9.8…65.2° |
| Clean and Jerk | 5.7…126.5° | 2.6…100.6° | -43.3…23.7° | 15.8…149.2° | 5.1…165.6° | 16.0…161.1° | 9.6…77.3° |
| Kettlebell Swing | 5.3…86.2° | 0.0…44.9° | -5.3…13.9° | 0.0…17.6° | 14.5…96.4° | 17.7…96.3° | 9.9…11.9° |
| One-Arm Kettlebell Swings | 5.3…83.9° | 0.0…39.7° | -5.3…9.8° | 0.0…23.9° | 20.4…105.3° | 23.9…105.1° | 0.4…14.4° |
| Bottoms-Up Clean From The Hang Position | 5.3…44.5° | 0.0…25.5° | -5.3…7.4° | 7.7…148.0° | 21.3…52.0° | 21.4…52.6° | 0.0…13.0° |
| Double Kettlebell Push Press | 3.1…29.2° | 0.0…35.3° | -42.8…6.9° | 10.6…132.1° | 3.0…166.8° | 12.6…166.7° | 1.4…12.3° |
| One-Arm Kettlebell Push Press | 3.1…29.2° | 0.0…35.3° | -42.8…6.9° | 10.6…132.1° | 3.0…166.8° | 12.6…166.7° | 1.4…12.3° |
| Kettlebell Sumo High Pull | 8.0…91.7° | 0.0…84.5° | -49.9…16.6° | 0.0…132.1° | 6.4…44.5° | 7.2…45.7° | 2.4…12.6° |
