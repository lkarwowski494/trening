# Recenzja ruchu 1.1: rodzina kb_ballistic (16 ćwiczeń), 27.10.2026

Metoda jak w `core_hang.md` i `plyo.md` (`origin/integracja-1-1` @ 4e5a7f95, istniejące pozy, PNG w pełnej rozdzielczości, liczby silnikiem v2 na siatce u co 0,0125, położenie i kierunek dzwonu z `keyframeFrame().props`). Uzasadnień generatorów ani opisów commitów nie czytałem.

Walidator: **16/16 OK**. Szczelność reguł automatycznych: **0 z 6 ćwiczeń z błędem (0%)**, w 4 klasach.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| **Kettlebell Swing** | **BŁĄD** | nr 1 |
| **One-Arm Kettlebell Swings** | **BŁĄD** | nr 1 |
| Kettlebell Clean | OK z uwagą | zawias (biodro 86°) → wyprost → kettlebell przy barku (łokieć 132°, dzwon za przedramieniem); A, B |
| Double Kettlebell Clean | OK z uwagą | jak wyżej, dwa kettlebelle; A, B |
| Dumbbell Clean | OK z uwagą | jak wyżej, hantle; A |
| **Bottoms-Up Clean From The Hang Position** | **BŁĄD** | nr 2 |
| Kettlebell Snatch | OK z uwagą | wyprost, łuk w górę blisko ciała (łokieć do 95°), wypchnięcie nad głowę z ugięciem kolan 28° (łokieć 9°); C |
| Double Kettlebell Snatch | OK z uwagą | jak wyżej; C |
| Snatch (hantel) | OK z uwagą | jak wyżej; C |
| **Double Kettlebell Push Press** | **BŁĄD** | nr 3 |
| Double Kettlebell Jerk | OK z uwagą | ugięcie (kolano 35°), wybicie na palce, ponowne ugięcie pod blokadą (kolano 27°, łokieć 9°); C |
| **One-Arm Kettlebell Push Press** | **BŁĄD** | nr 3 |
| One-Arm Kettlebell Jerk | OK z uwagą | jak Double Jerk; C |
| One-Arm Kettlebell Split Jerk | OK z uwagą | C; nożyce na końcu: stopy rozjeżdżają się nisko nad podłogą (podeszwy 0,2–1,4 cm, prawa +4 cm w kontakcie), miednica 68 cm, tylne kolano 96° (jak `olympic.md`, uwaga B) |
| **Kettlebell Sumo High Pull** | **BŁĄD** | nr 4 |
| One-Arm Kettlebell Clean and Jerk | OK z uwagą | zarzut jak Kettlebell Clean, potem podrzut nożycowy jak Split Jerk; A, B, C |

## Znaleziska: BŁĄD

| # | Ćwiczenie | Klatka / staw | Co jest źle (liczby) | Jak powinno być | Pewność | Realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|
| 1 | **Kettlebell Swing, One-Arm Kettlebell Swings** | u = 0 (dół zamachu) | **Nie ma zamachu między nogami.** W najniższej klatce rączka kettlebella jest w (37; 43), czyli 37 cm przed kostkami (x = 0) i przed kolanami (x 10). Ramiona wiszą pionowo pod barkami (barki x 36), a tułów pochylony 62°. Potem kettlebell idzie tylko w przód i w górę do 151 cm. Wskazówka `kb.move`, wyświetlana przy ćwiczeniu, mówi: „Send your hips back as the kettlebell passes between your legs”. Na obrazie ta faza nie występuje, więc ruch wygląda jak unoszenie z wyprostem bioder sprzed stóp. | W dolnej klatce kettlebell za linią kolan, między udami (rączka w x ≈ −10…0, nad wysokością kolan), przedramiona przy wewnętrznej stronie ud, biodra cofnięte. Z tej pozycji wymach w przód do wysokości klatki albo barków. | 75% | realny | nie: reguły rodziny mierzą zawias, plecy i wysokość końcową, a nie położenie ciężaru względem kolan w dole |
| 2 | **Bottoms-Up Clean From The Hang Position** | cały ruch | **To ta sama poza co Kettlebell Clean.** Klatki są identyczne bajt w bajt. Start jest z podłogi (zawias, biodro 86°, rączka 42 cm), a nie z zawieszenia. Na końcu dzwon jest pod rączką i za nią (kierunek (−0,80; −0,60)), czyli w zwykłym „racku”, a nie dnem do góry. Silnik zna tylko tryby dzwonu `dol`, `wzdluz` i `tyl` (`gear.ts`), więc „bottoms-up” nie da się dziś narysować. | Start z zawieszenia (ciężar przy udach, lekki zawias). Na końcu kettlebell dnem do góry: dzwon nad rączką, przedramię pionowo, łokieć pod dłonią. Potrzebny nowy tryb dzwonu („gora”) albo zdjęcie ćwiczenia z rodziny do czasu jego dodania. | 90% | realny | nie |
| 3 | **Double / One-Arm Kettlebell Push Press** | u = 0,67 → 1 | **Push press narysowany jak podrzut.** Klatki są identyczne bajt w bajt z Double / One-Arm Kettlebell Jerk. Po wybiciu na palce (u = 0,67, kolano 0°) kolana ponownie się zginają do 27° (miednica 105 → 87 cm), a łokieć dochodzi do wyprostu (9°) dopiero w tym ugięciu. Ponowne ugięcie pod ciężarem to cecha podrzutu. W wyciskaniu z nóg nogi po wybiciu zostają proste, a ręce dokańczają wyciskanie (wskazówka `pp.legs`: „your arms finish the press”). | Push press: ugięcie, wybicie, potem wyprost rąk przy prostych nogach (kolano ≤ 10° w u = 1). Jerk zostaje z ponownym ugięciem. | 75% | realny | nie: walidator nie porównuje póz różnych ćwiczeń (`wariant_rozny_od_bazy` z partii rec-11 by to złapał) |
| 4 | **Kettlebell Sumo High Pull** | u = 0,56 → 1, ręce | **Kettlebell kończy nad głową i daleko przed ciałem.** W u = 1 rączka jest na 186 cm, ponad głową (miednica 103 cm, barki ok. 150 cm), przy łokciu 99° i ramieniu 102° od tułowia. W drodze w górę kettlebell oddala się do x = 48 (u = 0,67), czyli 55 cm przed miednicą. To raczej unoszenie w przód nad głowę niż „high pull”. | Kettlebell jedzie pionowo blisko ciała do wysokości klatki albo brody (ok. 135–150 cm), łokcie wysoko i na boki, nad dłońmi. | 80% | realny | nie |

## OK z uwagą (backlog, nie blokuje)

- **A. Start sprzed stóp, bez zamachu** (Kettlebell Clean, Double, Dumbbell, Clean and Jerk). Zaczynają w tej samej pozycji co Swing (ciężar 30 cm przed kostkami). W zarzucie kettlebella zamach między nogami jest typowy, ale mniej istotny niż w swingu. Pewność 60%.
- **B. „Rack” 25 cm przed barkami.** W u = 1 rączka jest w (22; 130), a barki w (−3; 139). W pozycji rack dłoń jest przy obojczyku, a łokieć przy żebrach. Tę samą uwagę ma `carry.md` (Front Rack Carry). Pewność 60%.
- **C. Palce nad podłogą przy wspięciu.** Snatch: 3,3 cm (u = 0,78). Jerk i Push Press: 4,3 cm (u = 0,67). Split Jerk: 3–4 cm przez u 0,45–0,80. Ta sama klasa co uwaga A w `olympic.md`.
- **D. Animacja wahadłowa.** Swing w fazie 1 → 0 opada tym samym łukiem, co jest poprawne. Zarzuty i rwania odkładają ciężar torem podnoszenia.

## Proponowane reguły

| Reguła | Warunek | Błędy | Pozostałe |
|---|---|---|---|
| `zamach_miedzy_nogami` | swing: w najniższej klatce rączka w x ≤ x kolan | nr 1 (37 cm przed kostkami) | — |
| `wariant_rozny_od_bazy` (z partii rec-11) | dwa ćwiczenia o różnych nazwach nie mają identycznych klatek, chyba że jest wpis z powodem | nr 2, nr 3 | — |
| `push_press_nogi_proste` | „Push Press”: po wybiciu (kolano ≤ 5°) kolano nie rośnie ponad 10° do u = 1 | nr 3 (27°) | Jerk: dopuszczone |
| `high_pull_wysokosc` | „High Pull”: w u = 1 chwyt ≤ wysokości barków + 10 cm, a x chwytu ≤ 25 cm przed miednicą przez cały ruch | nr 4 (186 cm, 55 cm) | — |

Progi to konwencja rysunku do potwierdzenia przez badacza. Dobrane na tych samych danych, więc to wynik w próbie, a nie dowód szczelności.
