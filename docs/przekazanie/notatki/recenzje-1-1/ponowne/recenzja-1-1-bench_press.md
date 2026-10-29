# Recenzja 1.1: rodzina bench_press (30 ćwiczeń, rig) — bramka 4 + ślad toru (L-050) + treść kart, 29.10.2026

Recenzent niezależny (L-047): nie poprawiam póz, kodu ani tekstów. Oceniany stan: `integracja-1-1` @ 15e3ab45 (worktree `/home/user/wt/rec-1-1`, odłączony).
Nie czytałem opisów commitów, README podglądów, komentarzy generatorów ani linii stanu agentów. Czytałem: CLAUDE.md, docs/53 (lista bramki 4, kroki 1–11, z gałęzi przekazanie-konta), poprzednie recenzje rodziny (`recenzje-1-1/bench_press.md` i `ponowne/1-0-squat-bench.md`), decyzje właściciela w docs/18 z 25–26.10 (przedramiona ±10° na dole), dane katalogu (`docs/research/equipment/catalog.json`).

**Render własny: 13 klatek (u = 0, 1/12 … 1) × 2 widoki (bok, góra) × wiersz poprawny + wiersz błędu `arch` (25 ćwiczeń, gdzie błąd dotyczy) = 1430 klatek, 30 ćwiczeń.** Ślad toru (`trailFor`, punkt `info.load`) jest nałożony na KAŻDĄ klatkę każdego wiersza. Skrypt: `slad-1-1-bench_press/render-recenzenta.mjs` (silnik z `scripts/figures/v2-build.mjs`, bez bramki wyświetlania, bez generowania póz). Arkusze: `docs/przekazanie/notatki/recenzje-1-1/ponowne/slad-1-1-bench_press/<ćwiczenie>.png` (+ `manifest.json`). Liczby z `frameAt`, `jointAngles`, `checkFrame`, `contactsOf` własnymi skryptami.
Współrzędne: x w stronę stóp dodatnie (głowa x ≈ −70), y w górę, z w prawo, cm.

## Podsumowanie

| Werdykt | Liczba | Ćwiczenia |
|---|---|---|
| OK | 7 | Bench Press (sztanga), Incline Bench Press (sztanga), Squeeze Press (hantle), Smith Machine Bench Press, Smith Machine Incline Press, Wide-Grip Barbell Bench Press, Bench Press with Chains |
| OK z uwagą | 16 | Bench Press (hantle), Incline Bench Press (hantle), Decline Bench Press, Decline Bench Press (hantle), Smith Machine Decline Press, Floor Press (hantle), Floor Press (sztanga), Floor Press with Chains, One-Arm Kettlebell Floor Press, One Arm Dumbbell Bench Press, Barbell Guillotine Bench Press, Reverse Band Bench Press, Close-Grip Dumbbell Press, Close-Grip EZ-Bar Press, Smith Machine Close-Grip Bench Press, Reverse Grip Bench Press |
| **BŁĄD** | **5** | **Band Bench Press (WYSOKIE), Chain Press (WYSOKIE), Close Grip Bench Press (WYSOKIE), Board Press (ŚREDNIE, krok 1), Pin Press (ŚREDNIE, krok 1)** |
| wstrzymane już w kodzie | 2 | JM Press, Decline Close-Grip Bench To Skull Crusher (`V2_WSTRZYMANE` w `lib/figures/v2/figure.ts`; rysunek nadal przeczy `cgbp.elbows`: odwiedzenie 155° / 144° na dole — powód wstrzymania potwierdzam) |

**Ślad toru (krok 11): 30/30 OK.** W obu widokach tor gryfu/hantli to prosty odcinek od wyprostu nad barkami do punktu dotyku: odchylenie od prostej 0,0–0,2 cm, 0 zawróceń (próg strażnika: ≤ 4 cm, ≤ 1). Smith (4 ćwiczenia): szyna stoi w miejscu (x = −33 / −21,1 / −33,2 / −30), gryf jedzie pionowo po szynie, w widoku z góry ślad ≈ punkt (1 cm). Prosta zamiast lekkiego łuku to uproszczenie bez „S” i bez ucieczki — bez uwag. `tests/figures-v2-tor.test.ts` i `tests/figures-v2-bench-rules.test.ts`: 14/14 zielone.

**Wiersz błędu `arch` (krok 3): OK we wszystkich 25.** Różnica względem pozy poprawnej w u = 1: miednica +8,0 cm w górę (skos/ujemna 8,5–8,8), barki 2,3 cm, chwyt 1,6–4,3 cm (gryf idzie za klatką), kostki 0, łokieć +2–3°; bez kolizji; widoczny w klatce dołu (waga błędu rośnie z u). W aplikacji pokazywany tylko tam, gdzie karta ma `bp.mis.arch`.

**Styki (krok 2, pomiar):** ławka płaska i skośna — pięty i palce y = 0,0 (podłoga), głowa, plecy, miednica na ławce (`contactsOf`: wszystkie 9 punktów). Podłoga — stopy y = 2,0 na macie 2 cm, łokcie na dole y = 6,6. Ujemna — stopy stoją na siedzisku (pięty y = 59,0 przy wierzchu siedziska 60) — uwaga D.

**Czy rodzina może dostać wpis „wyswietlana”: tak, częściowo — 23 ćwiczenia**, pod warunkiem dopisania 5 ćwiczeń z BŁĘDEM do `V2_WSTRZYMANE` (karta zostaje, rysunku brak; skrót rodziny się nie zmienia, bo `figure.ts` nie wchodzi do `rodzinaSkrot`). Bez tego wpis odsłoniłby wszystkie 28 rysunków, także 3 z błędem WYSOKIM.

## BŁĘDY

| # | Ćwiczenie | Waga | Klatka / element | Co jest źle (liczby) | Jak powinno być | Kroki w aplikacji | Pewność / realność | Reguła łapie? |
|---|---|---|---|---|---|---|---|---|
| B1 | **Band Bench Press** | WYSOKIE | wszystkie klatki, sprzęt | **Rysunek: sztanga z talerzami + dwie gumy od końców gryfu do podłogi** (`impl: 'band'` rysuje `barbell` + `band`). Katalog (`catalog.json`): „Band with handles looped under the bench”, `requires: bands + bench.flat` (bez sztangi), `loadSource: band`, `metric: reps` (ciężaru się nie zapisuje). Aplikacja pokaże to ćwiczenie komuś, kto ma tylko gumy i ławkę, a rysunek pokaże sztangę z obciążeniem. Poprzednie recenzje sprawdzały tylko położenie gumy, nie zgodność sprzętu z danymi (krok 9). | Guma z uchwytami pod ławką (zaczepiona o nogę ławki), dłonie na uchwytach, bez gryfu i talerzy — albo wyjątek (bez rysunku). | Biblioteka → Band Bench Press → Technika → animacja (bok i góra) | 80%; realny (każde wyświetlenie; ćwiczenie dostępne przy samym sprzęcie „gumy”) | **nie** — żadna reguła nie porównuje rekwizytów rysunku z `requires` / `loadSource` katalogu |
| B2 | **Chain Press** | WYSOKIE | wszystkie klatki, sprzęt | **Rysunek identyczny z „Bench Press with Chains”** (te same parametry rigu: sztanga z talerzami, łańcuchy przy końcach gryfu; tabela kątów równa, krok 10). Katalog: „Chains hung from handles, pressed like dumbbells on a flat bench”, `requires: chains + bench.flat`, `loadSource: none`. Ćwiczenie bez sztangi, rysunek ze sztangą. | Dwa uchwyty z łańcuchami w dłoniach jak hantle (łańcuch zwisa do podłogi) — albo wyjątek. | Biblioteka → Chain Press → Technika | 75% (opis katalogu: „jedno źródło”); realny | **nie** (jak B1) |
| B3 | **Close Grip Bench Press** | WYSOKIE (obraz przeczy własnej karcie) | u = 0,5–1, widok z góry; ramiona | **Chwyt z ±12 cm (24 cm między dłońmi) przy stawach barkowych z ±19 — dłonie 7 cm do środka od barku z każdej strony; przedramię 50° od pionu w płaszczyźnie czołowej na dole (55° w połowie); łokcie z ±36,9, czyli tak szeroko jak w zwykłym wyciskaniu (±38,3).** Na arkuszu z góry przedramiona zbiegają się w „V” do środka klatki. Karta własna (`cgbp.grip`): „Chwyć sztangę na szerokość barków lub trochę węziej — nie bardzo wąsko”; źródło karty ACE #311: „hands directly in line with the shoulders”. Odwiedzenie ramienia 37° spełnia jeszcze `lokcie_przy_tulowiu` (≤ 45°), ale różnica od zwykłego wyciskania (42°) jest prawie niewidoczna — cecha „łokcie blisko tułowia” słabo pokazana. Obie poprzednie recenzje dały „uwaga B” (55%); niezależnie oceniam wyżej, bo karta mówi wprost „nie bardzo wąsko”, a rysunek to pokazuje. | Chwyt ±17–19 (na szerokość barków), łokieć pod dłonią (`vert`) — przedramiona ≤ 10° od pionu, łokcie wyraźnie bliżej tułowia niż w zwykłym wyciskaniu (np. ≤ 30°). | Biblioteka → Close Grip Bench Press → Technika → widok z góry, klatka dołu | 70%; realny (popularne ćwiczenie) | **nie** — `lokcie_przy_tulowiu` mierzy tylko odwiedzenie (≤ 45°); brak reguły „chwyt nie węższy niż ok. barki” ani „przedramię pionowo” dla wąskiego chwytu (`przedramie_pod_sztanga` mierzy tylko oś x: 6,7 cm) |
| B4 | **Board Press** | ŚREDNIE (bramka 4, krok 1: przybliżenie bez cechy rozpoznawczej → wyjątek) | u = 1 | Gryf zatrzymuje się 4 cm nad zwykłym punktem dotyku (y 70,7 przy 66,7), na rysunku nie ma deski na klatce. Wygląda jak zwykłe wyciskanie z niepełnym zejściem. Katalog: „Partial bench press to boards on the chest”. Uwaga A z obu poprzednich recenzji — bez zmian. Brak też wpisu w `figury-ograniczenia-silnika.json`. Silnik ma rekwizyt `box` — deskę da się narysować. | Deska (prostopadłościan) na klatce, gryf dotyka deski — albo wyjątek. | Biblioteka → Board Press → Technika | 65%; realny, ćwiczenie niszowe; bez ryzyka zdrowotnego | **nie** |
| B5 | **Pin Press** | ŚREDNIE (krok 1) | u = 1 | Gryf staje 5,5 cm nad punktem dotyku (y 72,2), bez bolców i stojaka. Katalog: „Bench in a power rack, bar pressed from pins/safeties”. | Słupki stojaka z bolcami (rekwizyt `post` z `hook`) na wysokości dołu ruchu — albo wyjątek. | Biblioteka → Pin Press → Technika | 65%; jak B4 | **nie** |

Szkoda dla użytkownika: B1–B3 pokazują inne ćwiczenie albo technikę sprzeczną z kartą (próg CLAUDE.md: „błędne twierdzenie merytoryczne / pokazuje co innego niż nazwa”), bez ryzyka dla danych. B4–B5 nie uczą niczego błędnego, ale łamią zapisaną regułę kroku 1. Dlatego nie wolno ich wyświetlać bez poprawki albo wyjątku.

**Szczelność reguł:** 0 z 5 złapanych automatycznie. Propozycje: (1) `rekwizyty_zgodne_z_katalogiem` — rodzaj rekwizytu obciążenia (sztanga / hantle / uchwyt gumy / uchwyt łańcucha) zgodny z `requires` i `loadSource` (sztanga na rysunku ⇒ `barbell` w `requires`); (2) `chwyt_waski_przedramie` dla `_waski`: chwyt ≥ 0,8 × połowa szerokości barków i przedramię ≤ 15° od pionu w płaszczyźnie czołowej na dole; (3) cecha „przyrząd zatrzymania” (deska / bolce) dla Board/Pin w `figury-cechy.json`.

## Pary reguł sensu z `tests/sens-wyjatki-1-1.json` (14 par w tej rodzinie, wszystkie `przedramie_pod_sztanga`)

Reguła mierzy **największe** |x chwytu − x łokcia| w CAŁYM ruchu (próg 10 cm, „konwencja”). Decyzja właściciela z 26.10 (docs/18) i NSCA s. 53–55 opisują przedramię pionowo **w dolnej pozycji**. Wszystkie przekroczenia są w środku ruchu (u = 0,55–0,70), gdzie rig przesuwa gryf liniowo od barków do klatki, a łokieć zostaje z tyłu. Na dole (u = 1):

| Ćwiczenie | maks. (u) | u = 1 | Ocena |
|---|---|---|---|
| Decline Bench Press | 10,7 (0,65) | 6,8 cm, 12° | zła reguła (zakres pomiaru); na dole 12° strzałkowo = krawędź ±10° (uwaga D) |
| Decline Bench Press (hantle) | 15,0 (0,55) | 7,5 cm, 13° | zła reguła; ta sama klasa co Bench Press (hantle) 15,7, dla którego regułę już zdjęto (`_lawka_hantle`, otwarte dla badacza) |
| Floor Press (hantle) | 14,2 (0,55) | 9,9 cm, 18° | zła reguła w środku ruchu; na dole 18° strzałkowo — uwaga E |
| Floor Press (sztanga) | 10,5 (0,70) | 9,2 cm, 16° | jw., uwaga E |
| Floor Press with Chains | 10,5 (0,70) | 9,2 cm, 16° | jw., uwaga E |
| One-Arm Kettlebell Floor Press | 13,1 (0,70) | **11,4 cm, 20°** | rysunek odbiega też na dole o 1,4 cm ponad próg (uwaga E); nie błąd blokujący |
| One Arm Dumbbell Bench Press | 11,8 (0,60) | 5,1 cm, 9° | zła reguła |
| Band Bench Press | 10,8 (0,60) | 4,4 cm, 8° | zła reguła (rysunek i tak BŁĄD B1 z innego powodu) |
| Chain Press | 10,8 (0,60) | 4,4 cm, 8° | zła reguła (BŁĄD B2 z innego powodu) |
| Bench Press with Chains | 10,8 (0,60) | 4,4 cm, 8° | zła reguła |
| Reverse Band Bench Press | 10,8 (0,60) | 4,4 cm, 8° | zła reguła |
| Board Press | 10,8 (0,65) | 6,7 cm, 12° | zła reguła (BŁĄD B4 z innego powodu) |
| Pin Press | 10,8 (0,65) | 7,4 cm, 13° | zła reguła (BŁĄD B5 z innego powodu) |
| Reverse Grip Bench Press | 13,5 (0,60) | 4,8 cm, 8° | zła reguła |

Dla porównania wzorcowy Bench Press (sztanga) ma 9,0 cm w u = 0,65 i 3,7 cm (6°) na dole, czyli mieści się w progu o 1 cm. Warianty sztangowe przekraczają próg o 0,5–0,8 cm, bo mają domyślny chwyt 33 zamiast 35. Rachunek na wymiarach rigu (ramię 33, przedramię z dłonią ≈ 33, staw barkowy z ±20,5): przedramię pionowo w połowie wysokości wymagałoby gryfu ok. 30 cm za barkami w stronę stóp, a gryf leży tam 9–17 cm. Warunku „przez cały ruch ≤ 10 cm w osi x” nie da się więc spełnić przy torze od barków do klatki, chyba że łokcie w środku ruchu odejdą bardziej na boki. **Wniosek: 14/14 to reguła (zakres pomiaru), nie błąd rysunku.** Propozycja dla badacza: mierzyć `przedramie_pod_sztanga` w u ≥ 0,9 (pozycja dolna, jak w decyzji) z progiem 10 cm. Wtedy z 14 par zostaje tylko KB Floor Press (11,4), do kalibracji. Druga możliwość: próg 12 cm przez cały ruch dla sztangi i osobny dla hantli. Rozstrzyga badacz (liczba to konwencja).

## Wynik: wszystkie ćwiczenia

Liczby w u = 1 (dół): przedramię od pionu czołowo / strzałkowo, odwiedzenie ramienia od osi tułowia (płaszczyzna tułowia), łokieć. Ślad: odchylenie od prostej / zawrócenia (bok; góra).

| Ćwiczenie | Ruch | Ślad | Treść | Werdykt | Szczegóły |
|---|---|---|---|---|---|
| Bench Press (sztanga) | OK | OK (0,0/0; 0,0/0) | OK | **OK** | 6°/6°, 42°, 135°; dotyk 16 cm pod barkami wzdłuż tułowia, 13,5 nad osią (okolice linii sutków); karta własna (bp.contact, bp.grip, bp.move, bp.blades, bp.control, bp.mis.arch) zgodna z obrazem |
| Bench Press (hantle) | OK z uwagą | OK | OK | OK z uwagą | 5°/8°, 33°; uwaga F (środek ruchu: przedramię 30° strzałkowo, reguła zdjęta, otwarte u badacza) |
| Incline Bench Press (sztanga) | OK | OK | OK | **OK** | ławka 30°, 2°/2°, 27°; dotyk górna część klatki (`ibp.move`) |
| Incline Bench Press (hantle) | OK z uwagą | OK | OK | OK z uwagą | 0°/0°, 23°; F (32° w środku ruchu) |
| Decline Bench Press | OK z uwagą | OK | OK (zestaw zmieniony, sprawdzony) | OK z uwagą | 8°/12°, 41°; D; para sensu — reguła |
| Close Grip Bench Press | **BŁĄD** | OK | niezgodna z obrazem (`cgbp.grip`) | **BŁĄD** | B3 |
| Decline Bench Press (hantle) | OK z uwagą | OK | OK (zestaw zmieniony) | OK z uwagą | 9°/13°, 38°; D, F |
| Floor Press (hantle) | OK z uwagą | OK (0,2/0) | uwaga G | OK z uwagą | 12°/18°, 34°; łokieć na podłodze (y 6,6); E, G |
| Floor Press (sztanga) | OK z uwagą | OK | uwaga G | OK z uwagą | 12°/16°, 36°; E, G |
| Squeeze Press (hantle) | OK | OK | OK | **OK** | hantle dociśnięte (±7), łokcie przy tułowiu 23°; skos przedramienia (50°) wynika z ćwiczenia |
| Smith Machine Bench Press | OK | OK, szyna stała | OK (zestaw zmieniony) | **OK** | 6°/8°, 36°; gryf pionowo po szynie, wyprost nad dolną częścią klatki (tak działa suwnica) |
| Smith Machine Incline Press | OK | OK, szyna stała | OK | **OK** | 3°/4°, 22° |
| JM Press | wstrzymane | OK | OK (karta bez rysunku) | wstrzymane | odwiedzenie 155°, łokieć 152° — przeczy `cgbp.elbows`; zostaje w `V2_WSTRZYMANE` |
| One-Arm Kettlebell Floor Press | OK z uwagą | OK | uwaga G | OK z uwagą | 12°/20°, 29°; dzwon odważnika leży na przedramieniu (poprawnie), druga ręka na brzuchu; E, G |
| One Arm Dumbbell Bench Press | OK z uwagą | OK | OK | OK z uwagą | 6°/9°, 34°; F (22° w środku ruchu); para sensu — reguła |
| Barbell Guillotine Bench Press | OK | OK | uwaga G | OK z uwagą | gryf do szyi, łokcie 90° w bok (cecha ćwiczenia), przedramię 6°/0° |
| Wide-Grip Barbell Bench Press | OK | OK | OK | **OK** | 5°/3°, 55°; zestaw bez `bp.elbowsMid` (słusznie) |
| Smith Machine Decline Press | OK z uwagą | OK, szyna stała | OK (zestaw zmieniony) | OK z uwagą | 8°/12°, 41°; D |
| **Band Bench Press** | **BŁĄD** | OK | OK (tekst pasuje też do wersji z gumą z uchwytami) | **BŁĄD** | B1 |
| **Chain Press** | **BŁĄD** | OK | OK (zestaw zmieniony) | **BŁĄD** | B2 |
| Bench Press with Chains | OK | OK | OK (zestaw zmieniony) | **OK** | łańcuchy przy końcach gryfu, 6°/8°, 36° |
| Floor Press with Chains | OK z uwagą | OK | uwaga G | OK z uwagą | 12°/16°, 36°; E, G |
| Reverse Band Bench Press | OK z uwagą | OK | OK (zestaw zmieniony) | OK z uwagą | **naprawione B2 z 1.0**: gumy zwisają z kotwicy 35 cm nad najwyższym położeniem gryfu (y 153,4) do końców gryfu; uwaga H |
| **Board Press** | **BŁĄD** | OK | uwaga G | **BŁĄD** | B4 |
| **Pin Press** | **BŁĄD** | OK | OK (bez `bp.control` — słusznie) | **BŁĄD** | B5 |
| Close-Grip Dumbbell Press | OK z uwagą | OK | OK | OK z uwagą | uwaga I |
| Close-Grip EZ-Bar Press | OK z uwagą | OK | OK | OK z uwagą | geometria jak B3 (±12), ale wąski chwyt to wewnętrzny chwyt gryfu EZ (katalog); gryf narysowany prosty — uwaga J |
| Smith Machine Close-Grip Bench Press | OK z uwagą | OK, szyna stała | OK | OK z uwagą | ta sama geometria co B3 (±12, przedramię 50°), karta bez `cgbp.grip`, więc bez sprzeczności z tekstem; poprawić razem z B3 (ŚREDNIE) |
| Reverse Grip Bench Press | OK z uwagą | OK | OK | OK z uwagą | 4°/8°, 27°; uwaga K |
| Decline Close-Grip Bench To Skull Crusher | wstrzymane | OK | OK (karta bez rysunku) | wstrzymane | odwiedzenie 144°, łokieć 154°; zostaje w `V2_WSTRZYMANE` |

## Uwagi (nie blokują; backlog z wersją 1.1.x)

- **D (NISKIE) — ławka ujemna (3 ćwiczenia):** stopy stoją płasko na poziomym siedzisku, bez wałków. Komentarz rigu mówi „stopy pod wałkami”, a `contactConditions` pomija styki stóp jako „pod wałkami”, ale rekwizyt `bench` nie dostaje `rollers: true`, choć silnik umie je narysować (`draw.ts`). Przedramię na dole 12–13° strzałkowo, czyli 2–3° ponad ±10° z decyzji.
- **E (NISKIE) — wyciskania z podłogi (4):** na dole przedramię 16–20° od pionu strzałkowo (KB: 20°, 11,4 cm), czołowo 12°. Decyzja właściciela: ±10° na dole. Łokieć leży na podłodze, a dotyk jest przesunięty w stronę stóp o 17 cm od barku. Przesunięcie punktu dotyku o ok. 4–5 cm ku głowie dałoby przedramię bliżej pionu.
- **F (NISKIE/otwarte u badacza) — hantle w środku ruchu:** przedramię 22–32° strzałkowo w u ≈ 0,5 (Bench Press / Incline / Decline (hantle), One Arm DB, Reverse Grip 25°). Karty nie twierdzą „przedramiona pionowo”, więc nie ma sprzeczności z tekstem. Patrz wniosek o regule wyżej.
- **G (NISKIE) — treść zestawu ogólnego:** `bp.control` „Opuszczaj ciężar powoli — bez odbijania od klatki” stoi w kartach, w których ciężar nie dotyka klatki: Floor Press (hantle, sztanga, with Chains), One-Arm KB Floor Press (łokcie na podłodze), Board Press (deska) i Guillotine (szyja). Naturalniej i zgodnie z rysunkiem byłoby: „bez odbijania łokci od podłogi” (podłoga) albo pominąć zdanie (Board, Guillotine). W Guillotine (katalog: „light loads; safeties strongly advised”) karta nie ma ostrzeżenia o lekkim ciężarze. To sprawa treści, nie liczby, więc bez wpisu w rejestrze.
- **H (NISKIE) — Reverse Band:** kotwica gumy wisi w powietrzu (brak stojaka; katalog: „Bands hang from the top of a power rack”) i przesuwa się w x razem z gryfem (−48 → −33), zamiast stać w miejscu. Słupek `post` z `hook` jest w silniku.
- **I (ŚREDNIE, do rozstrzygnięcia) — Close-Grip Dumbbell Press:** rysunek ma dwa hantle przy sobie (±10), osoba leży wzdłuż ławki. Katalog: „One dumbbell pressed with both hands, shoulders across a bench” (jeden hantel, ławka w poprzek). Rysunek pokazuje znany wariant (dwa hantle dociśnięte), ale niezgodny z opisem ćwiczenia w danych aplikacji. Rozstrzyga badacz: poprawić katalog albo rysunek.
- **J (NISKIE) — Close-Grip EZ-Bar Press:** gryf rysowany jako prosty. Brak wpisu w `figury-ograniczenia-silnika.json` (krok d listy 28.10).
- **K (NISKIE) — Reverse Grip Bench Press:** podchwytu nie da się pokazać (silnik nie rysuje orientacji dłoni), więc obraz to zwykłe wyciskanie z chwytem ±30. Katalog (fedb „Reverse Triceps Bench Press”): „Supinated close grip”, a ±30 jest szerzej niż barki (±20,5). Brak wpisu ograniczenia silnika. Przy ściśle czytanym kroku 1 to kandydat na wyjątek; oceniam jako uwagę, bo ruch i tor są poprawne, a różnicę widać tylko w dłoni.
- **Para identyczna (krok 10):** Chain Press = Bench Press with Chains (B2). Band, Chain, with Chains i Reverse Band mają tę samą tabelę kątów; różnią się rekwizytem, a cecha (guma / łańcuch / guma z góry) jest widoczna — poza B1/B2.

## Treść kart: zestawienie

- Karty własne (5: Bench Press sztanga/hantle, Incline sztanga/hantle, Close Grip): teksty naturalne, bez nazw źródeł i marek. Źródła w `data/zrodla/cues.json`: 2–4 na wskazówkę. Zgodne z obrazem, poza B3 (`cgbp.grip`).
- 7 zestawów ogólnych ukrytych jako „zmienione” (`tests/recenzja-wyjatki-1-1.json` → `zestawy_zmienione`) sprawdziłem w obecnym brzmieniu. Decline ×3: bp.blades, bp.control, bp.elbowsMid / err bp.mis.arch — bez bp.contact, słusznie, bo stopy nie stoją na podłodze. Smith Bench, Bench Press with Chains, Chain Press, Reverse Band: bp.contact, bp.blades, bp.control, bp.elbowsMid / bp.mis.arch. Wszystkie zgodne z rysunkiem (łokcie 36–41°, „nie rozkładaj szeroko”) i naturalne. Bieżące skróty zestawów: 0d29e66dcd26 (Decline, Decline (hantle), Smith Decline), 55caae2fd14d (Smith Bench, Bench Press with Chains, Chain Press, Reverse Band). Zestaw Chain Press pasuje tekstem także do prawdziwego Chain Press. Sam zestaw można odsłonić niezależnie od rysunku B2.
- Rejestr twierdzeń: teksty kart nie mają liczb, nazw źródeł ani oznaczeń wagi (wzorzec `DOMAIN_RE`), więc nie wymagają wpisu. `npm run check:claims`: „rejestr zgodny”. Rysunek nie podaje liczb jako zaleceń; kąt łokcia na rysunku jest pomiarem z geometrii (decyzja 25.10).

## Lista do wpisu

- **„wyswietlana” (23):** Bench Press (sztanga), Bench Press (hantle), Incline Bench Press (sztanga), Incline Bench Press (hantle), Decline Bench Press, Decline Bench Press (hantle), Floor Press (hantle), Floor Press (sztanga), Squeeze Press (hantle), Smith Machine Bench Press, Smith Machine Incline Press, One-Arm Kettlebell Floor Press, One Arm Dumbbell Bench Press, Barbell Guillotine Bench Press, Wide-Grip Barbell Bench Press, Smith Machine Decline Press, Bench Press with Chains, Floor Press with Chains, Reverse Band Bench Press, Close-Grip Dumbbell Press, Close-Grip EZ-Bar Press, Smith Machine Close-Grip Bench Press, Reverse Grip Bench Press.
- **„do poprawy” (5, do `V2_WSTRZYMANE` przed wpisem albo poprawka rigu i ponowna recenzja tych 5):** Band Bench Press (B1), Chain Press (B2), Close Grip Bench Press (B3; razem z nią warto poprawić Smith Machine Close-Grip Bench Press), Board Press (B4), Pin Press (B5).
- **bez zmian — wstrzymane (2):** JM Press, Decline Close-Grip Bench To Skull Crusher.
- **Zestawy ogólne do wpisu „wyswietlana” (7):** Decline Bench Press, Decline Bench Press (hantle), Smith Machine Decline Press (sha 0d29e66dcd26); Smith Machine Bench Press, Bench Press with Chains, Chain Press, Reverse Band Bench Press (sha 55caae2fd14d). Po wpisie trzeba usunąć je z `zestawy_zmienione` i usunąć `bench_press` z `v2` w `tests/recenzja-wyjatki-1-1.json`.

## Proponowany wpis v2 (`docs/research/figury-recenzja.json` → `v2.bench_press`)

```json
{
  "werdykt": "wyswietlana",
  "data": "2026-10-29",
  "sha": "2bdc728eea65",
  "liczba": 30,
  "stan": "zrecenzowana niezależnie (bramka 4, L-047 A, L-050 A) — 23 ćwiczenia pokazywane, 5 do poprawy (V2_WSTRZYMANE), 2 wstrzymane wcześniej",
  "autor": "koordynator M2 / programista rigu bench_press (zmiany od 27.10: tory, Smith, Reverse Band, kalibracja vert)",
  "recenzent": "recenzent 1.1 bench_press (sesja niezależna, 29.10.2026)",
  "slad": "docs/przekazanie/notatki/recenzje-1-1/ponowne/slad-1-1-bench_press/ — 30 arkuszy PNG, ślad trailFor nałożony na 13 klatek u 0–1 w każdym widoku (bok, góra), poza poprawna + błąd arch; tor: 30/30 prosty (≤ 0,2 cm, 0 zawróceń), Smith: szyna stała",
  "uwagi": "Warunek: Band Bench Press, Chain Press, Close Grip Bench Press, Board Press, Pin Press w V2_WSTRZYMANE (recenzja-1-1-bench_press.md, B1–B5). Pary przedramie_pod_sztanga (14) — reguła mierzy cały ruch, decyzja 26.10 dotyczy dołu; do badacza."
}
```

Uwaga do pola `sha`: `rodzinaSkrot('bench_press')` = 2bdc728eea65 na 15e3ab45 (benchPress.ts + common.ts + variants.ts). Każda zmiana tych plików przed wpisem unieważnia tę recenzję (fail-closed).
