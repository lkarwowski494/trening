# ZB-047 — ranking ćwiczeń do filmów o technice (propozycja do akceptacji, 08.11.2026)

Zlecenie: wybór właściciela 08.11.2026 „Ranking + rozszerzenie”. Przygotowała rola marketing (08.11.2026), koordynator sprawdził zasady haków i przeniósł cudze treści na Dysk.
Cudze treści (pełne nazwy aplikacji/serwisów A–C, wyciągi z rankingów, D1–D6): Dysk „Trening App/05 Research konkurencji”, dokument „ZB-047 ranking popularności ćwiczeń — źródła cudze (2026-11-08)”. W repo tylko własne wnioski.

**Lista 38 ćwiczeń z błędem na rysunku** — sprawdzona u źródła 08.11.2026 (`integracja-1-1` @9b7bc058, `shownFigureSpec` + błędy rigowe z `CUE_TO_ERROR`/`faultApplicable` + wpisy `bledy[]` wariantów z danymi): 183 ćwiczenia z grafiką po recenzji, 38 z błędem na rysunku = 14 rig (przysiady, martwe ciągi/RDL/Good Morning, wyciskania) + 10 podciągań + 14 uginań; 24 z nich mają na karcie ogólne wskazówki wzorca ruchu (dopisek „Ogólne wskazówki dla tego ruchu”). Przekazanie mówiło 37 — przyczyna różnicy niesprawdzona.
Automat filmów obsługuje wszystkie 38 (gałąź `filmy/automat-zb047`, e2a44198 — błędy z danych pozy `data:N`).

## Źródła popytu (do wyboru właściciela)

### Źródła — A. Przeczytane i użyte w rankingu

### Z1. Dziennik treningowy popularnej aplikacji treningowej A — udział ćwiczeń w zapisanych seriach (2025) — **rekomendowane jako oś rankingu**
- **Co mierzy:** co ludzie naprawdę trenują: udział ćwiczenia we wszystkich zapisanych seriach (%), osobno ogółem, mężczyźni, kobiety (top 25).
- **Zasięg:** cały świat (użytkownicy aplikacji, głównie EN i Skandynawia — kraj nie podany), publikacja 26.11.2025; okres danych niepodany.
- **Dostęp:** darmowa strona, czytelna automatycznie (odczytana przez WebFetch 08.11.2026).
- **Przeczytane:** tak — adres D1 w dokumencie na Dysku (wyżej), sekcja metodologii: „We analyzed millions of workouts from over 700,000 users of our workout tracker”.
- **Odczytane pozycje ćwiczeń z naszej listy (ogółem):** wyciskanie sztangi leżąc 1. (9,7%), przysiad 2. (7,0%), martwy ciąg 3. (5,0%), uginanie ze sztangą 10. (2,1%), wyciskanie hantli na skosie 12. (1,9%), uginanie hantli 13. (1,7%), podciąganie 14. (1,7%; u mężczyzn 12.), RDL 20. (1,3%; u kobiet 11.), uginanie młotkowe 22. (1,1%), wyciskanie hantli (płasko) 24. (1,0%). Pozostałych 28 ćwiczeń z naszej listy nie ma w top 25 — brak danych, nie „zero”.
- **Ograniczenia:** jedno źródło, samoselekcja (sam autor: zapisujący to ćwiczący bardziej zaangażowani); mierzy trening, nie wyszukiwanie ani oglądanie filmów; nazwy ćwiczeń aplikacji A nie są 1:1 z naszymi (np. „Dumbbell Curl” linkuje do strony uginania na skosie); top 25 — warianty niszowe niewidoczne. Wtórne omówienie tych samych danych (D2, 2024) — NIE jest niezależnym drugim źródłem.

### Z2. Podpowiedzi wyszukiwania YouTube (autouzupełnianie) — PL i EN
- **Co mierzy:** jakie dopiski do hasła ludzie najczęściej wpisują na YouTube (kolejność podpowiedzi, bez liczb). Sygnał, które WARIANTY są szukane i czy szukają „techniki” („form”).
- **Zasięg:** YouTube; PL (`hl=pl`) i EN; stan na 08.11.2026.
- **Dostęp:** darmowy, automatyczny (publiczny adres podpowiedzi), np. `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=pl&q=martwy%20ci%C4%85g%20`.
- **Przeczytane:** tak, 08.11.2026. Odczyty: „bicep curl ” → 1. „bicep curl form”, też „cable”, „dumbbell”, „barbell”, „bar”; „deadlift ” → 1. „deadlift form”, też „with dumbbells”; „pull up ” → „pull up form” (2.), reszta to piosenki; PL „martwy ciąg ” → m.in. „rumuński”, „trap bar”, „z hantlami”, „rumuński z hantlami”; „przysiad ” → m.in. „ze sztangą”, „z hantlem”, „goblet”; „podciąganie ” → m.in. „nachwytem”, „podchwytem”, „młotkowe”.
- **Ograniczenia:** brak wolumenów — tylko obecność i kolejność; podpowiedzi zależą od lokalizacji i chwili; hasła EN zaśmiecone innymi znaczeniami („pull up” = piosenki). Dobre do wyboru wariantów i do słów w opisie filmu, słabe do kolejności między rodzinami.

### Z3. Najczęstsze zapytania o technikę („… form”) w wyszukiwarce — RPA, 2025
- **Co mierzy:** ranking zapytań o technikę ćwiczeń (bez liczb).
- **Zasięg:** Republika Południowej Afryki, artykuł z 01.11.2025 (materiał dostarczony przez wyszukiwarkę, okres dla tej listy niepodany).
- **Dostęp:** darmowy, czytelny automatycznie. Adres: https://www.citizen.co.za/network-news/lnn/article/sas-fitness-trends-what-online-search-data-reveals/
- **Przeczytane:** tak, 08.11.2026; lista „form”: 1. uginanie bicepsa, 3. przysiad, 8. wyciskanie leżąc, 9. martwy ciąg (pełna lista — D3).
- **Ograniczenia:** jeden kraj spoza naszych rynków, brak liczb, materiał promocyjny („Supplied content”). Ale mierzy dokładnie to, co nas interesuje: popyt na „jak robić poprawnie”. Argument, by uginanie wcześnie w kolejności.

### Z4. Odsłony artykułów Wikipedii (API Wikimedia) — EN i PL, 10.2025–09.2026
- **Co mierzy:** zainteresowanie hasłem (odsłony artykułu przez ludzi, bez botów).
- **Dostęp:** darmowy, w pełni automatyczny, np. `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/Deadlift/monthly/20251001/20260930`.
- **Odczytane 08.11.2026 (suma 12 mies., liczona przez narzędzie — do przeliczenia skryptem):** EN Deadlift 144 501; Squat_(exercise) 126 426; Bench_press 97 575; Pull-up_(exercise) 11 049; Biceps_curl 11 552 (skok z ok. 350 do ok. 1 800/mies. od 05.2026 — prawdopodobnie zmiana tytułu/przekierowania, nieporównywalne). PL Martwy_ciąg 8 700; Podciąganie_na_drążku 3 028; tytuły PL dla wyciskania i przysiadu nie trafione (404 / 37 odsłon) — otwarte.
- **Ograniczenia:** encyklopedia to nie miejsce, gdzie szuka się techniki; przekierowania i zmiany tytułów zaburzają porównanie; warianty niszowe zwykle nie mają artykułów. Tylko potwierdzenie „wielkiej trójki”, nie podstawa kolejności.

### Z5. Omówienie Google Trends z 10 lat (serwis o treningu B, 07.12.2020)
- **Co mierzy:** względne zainteresowanie w wyszukiwarce (wykresy, bez tabel).
- **Zasięg:** region niepodany, lata ok. 2010–2020.
- **Przeczytane:** tak — adres D4; cytat metody: „all I'm doing is going to Google Trends, looking up how search traffic has evolved over the past ten years”.
- **Wnioski autora:** przysiad ok. 2× wyciskanie; martwy ciąg ok. 10× RDL; podciąganie nachwytem szukane częściej niż podchwytem; przysiad przedni rośnie.
- **Ograniczenia:** stare (2020), wtórne (interpretacja wykresów), region nieznany. Tylko pomocniczo.

### Źródła — B. Nieprzeczytane / niedostępne automatycznie (otwarte)

| ID | Źródło | Co dałoby | Stan |
|---|---|---|---|
| Z6 | **Google Trends** (trends.google.com) — porównanie do 5 haseł, kraj PL / świat, także „wyszukiwanie w YouTube” | względna popularność wyszukiwań PL i EN, aktualna | Darmowe, ale z mojego środowiska odpowiedź 429 (blokada automatów) — **liczby otwarte**. Ręcznie: ok. 15 min właściciela, eksport CSV (instrukcja niżej). |
| Z7 | Planer słów kluczowych wyszukiwarki | bezwzględne miesięczne wolumeny PL/EN | Wymaga konta reklamowego (zakładanie konta = decyzja właściciela; samo narzędzie bez kampanii 0 zł, ale pokazuje przedziały, nie dokładne liczby). Nie sprawdzone. |
| Z8 | Brytyjskie zestawienie wyszukiwań ćwiczeń (sklep z odżywkami C, 2022/2023; omówienie w magazynie) | miesięczne wyszukiwania ok. 40–100 ćwiczeń, UK | Strona magazynu odczytana pusta (tylko tytuł) — **nieprzeczytane**; dwie edycje dają sprzeczne miejsca (martwy ciąg 1. vs wyciskanie 1.) wg wyszukiwarki. Adresy D5. |
| Z9 | Statystyki hashtagów TikTok (centrum twórców reklamowych) | liczba postów/wyświetleń dla #deadlift itd. | Strona odczytana bez danych (przycisk logowania) — **otwarte**; prawdopodobnie wymaga konta. |
| Z10 | Recenzowane badanie ankietowe: niemiecka ankieta online wśród ćwiczących na siłowni (czasopismo „Sports”, 2024, t. 12, nr 1, art. 12) | jakie ćwiczenia wykonują ćwiczący rekreacyjnie | Serwer odmówił (403/503) — **nieprzeczytane**. Do sprawdzenia przez badacza. Innych recenzowanych badań rankingujących popularność ćwiczeń wśród rekreacyjnie ćwiczących NIE znalazłem (badania Delphi o trudności technicznej ćwiczeń dla początkujących mierzą coś innego). |
| Z11 | Własne dane: wyświetlenia i zapisania pierwszych filmów (analityka konta, bez śledzenia użytkowników) | realny popyt naszej widowni | Dostępne dopiero po publikacji. |

### Instrukcja Google Trends dla właściciela (Z6, ok. 15 min, 0 zł)
1. trends.google.com → Eksploruj; ustaw „Ostatnie 5 lat”, kategoria „Wszystkie”, raz „Cały świat”, raz „Polska”; dodatkowo przełącznik „Wyszukiwanie w YouTube”.
2. Zestawy (max 5 haseł; pierwsze hasło to kotwica w każdym zestawie, żeby dało się połączyć):
   - EN-1: bench press, squat, deadlift, pull up, bicep curl
   - EN-2: bench press, romanian deadlift, hammer curl, chin up, goblet squat
   - EN-3: bench press, front squat, trap bar deadlift, incline bench press, dumbbell bench press
   - PL-1: wyciskanie na ławce, przysiad ze sztangą, martwy ciąg, podciąganie na drążku, uginanie ramion
   - PL-2: martwy ciąg, martwy ciąg rumuński, przysiad goblet, uginanie młotkowe, podciąganie podchwytem
3. Każdy zestaw: ikona pobierania przy wykresie „Zainteresowanie w ujęciu czasowym” → CSV → wrzuć do folderu na Dysku; ja przeliczę średnie i poprawię ranking.

### Źródła — C. Rekomendacja (do wyboru)
- **Opcja 1 (rekomendowana): Z1 jako oś + Z2/Z3 jako korekta + Z6 ręcznie (PL) + Z11 po starcie.** 0 zł, ok. 15 min właściciela. Daje: co trenują (Z1), czego szukają o technice (Z3, Z2), jak wygląda Polska (Z6). Kompromis: Z1 to jedno, samoselekcjonujące się źródło; PL bez wolumenów bezwzględnych.
- **Opcja 2: tylko to, co już przeczytane (Z1–Z5).** 0 min właściciela, ranking gotowy teraz. Kompromis: brak danych o Polsce poza podpowiedziami YouTube; kolejność wariantów niszowych to wnioskowanie.
- **Opcja 3: Opcja 1 + Z7 (konto planera słów kluczowych).** Wolumeny bezwzględne PL/EN. Kompromis: nowe konto reklamowe (decyzja i dane właściciela), przedziały zamiast liczb, ryzyko pokusy płatnej kampanii.
- Wykonalność: Z1–Z5 odczytane 08.11.2026 (adresy wyżej / D1–D4); Z6 — wykonalność ręczna niesprawdzona przeze mnie (automat dostał 429), interfejs opisany z pamięci → przed sesją właściciela przeczytać pomoc Trends.

## Propozycja kolejności (haki per ćwiczenie nieaktualne — jeden wspólny hak, właściciel 08.11.2026 ~22:45, docs/18)

### Zasada układania
1. Najpierw po jednym „wielkim” ruchu z każdej rodziny (wyciskanie, przysiad, martwy ciąg, uginanie, podciąganie) — kolejność wg Z1 (udział w zapisanych seriach).
2. Potem warianty z Z1 (top 25), następnie warianty widoczne w podpowiedziach YouTube PL/EN (Z2), na końcu nisza.
3. Nie dwa filmy z tej samej rodziny pod rząd, gdy da się tego uniknąć (świeżość kanału).
4. Uginanie wysoko mimo niższej pozycji w Z1: zapytania o technikę uginania są na 1. miejscu w Z3 i 1. podpowiedzią „bicep curl form” w Z2.

**Oznaczenia podstawy:** **Z1** dziennik treningowy aplikacji A (miejsce ogółem); **Z2** podpowiedź YouTube (PL/EN); **Z3** zapytania „form” (RPA); **Z5** omówienie Trends 2020; **W** — moja ocena (konwencja/wnioskowanie: wariant wielkiego ruchu albo nisza, brak przeczytanych danych). Źródła opisane wyżej.

### Ranking

| # | Ćwiczenie (błąd na rysunku) | Podstawa | Hak PL | Hak EN |
|---|---|---|---|---|
| 1 | Bench Press (sztanga) — nadmierny łuk | Z1 #1; Z3 | Robisz łuk na ławce i nie wiesz, kiedy to już za dużo? | Arching on the bench and not sure how much is too much? |
| 2 | Back Squat — kolana do środka; pięty w górę | Z1 #2; Z3 | Przysiadasz od dawna, ale nigdy nie sprawdziłeś, co robią kolana i pięty? *(forma neutralna: „ale nie wiesz, co wtedy robią kolana i pięty?”)* | Been squatting for ages but never checked what your knees and heels are doing? |
| 3 | Deadlift (sztanga) — okrągłe plecy; gryf daleko od nóg | Z1 #3; Z2 „deadlift form”; Z3 | Ciągniesz martwy i nie masz pewności, czy plecy zostają proste, a gryf blisko nóg? | Pulling deadlifts but not sure your back stays flat and the bar stays close? |
| 4 | Barbell Curl — łokcie do przodu | Z1 #10; Z2 „bicep curl form/barbell”; Z3 #1 (uginanie ogólnie) | Pod koniec serii ze sztangą łokcie zaczynają ci jechać do przodu? | Barbell curls getting messy at the end of the set — elbows creeping forward? |
| 5 | Pull Up — skrócony zakres albo bujanie | Z1 #14 (u mężczyzn #12); Z2 „pull up form” | Liczysz podciągnięcia, ale czy każde jest z pełnego zwisu i bez bujania? | Counting pull-ups, but is every rep from a full hang, without swinging? |
| 6 | Incline Bench Press (hantle) — łuk | Z1 #12 | Na skosie z hantlami plecy same odrywają się od ławki? | Incline dumbbell press — does your lower back lift off the bench? |
| 7 | RDL (sztanga) — okrągłe plecy; kolana jak w przysiadzie | Z1 #20 (u kobiet #11); Z2 PL „martwy ciąg rumuński” | Twój rumuński martwy zaczyna wyglądać jak przysiad? | Does your Romanian deadlift start turning into a squat? |
| 8 | Biceps Curl (hantle) — łokcie do przodu | Z1 #13; Z2 „bicep curl dumbbell” | Uginasz hantle, a łokcie same wędrują do przodu? | Curling dumbbells and your elbows keep drifting forward? |
| 9 | Goblet Squat — kolana do środka | Z2 PL „przysiad goblet”, „z hantlem”; W | Przysiad z hantlem przy klatce — kolana idą za palcami czy schodzą do środka? | Goblet squats — do your knees track out or cave in? |
| 10 | Bench Press (hantle) — łuk | Z1 #24 („wyciskanie hantli na płaskiej”) | Wyciskanie hantli na płaskiej — wiesz, jak ułożyć plecy na ławce? | Dumbbell bench — do you know how your back should sit on the bench? |
| 11 | Hammer Curl — łokcie od tułowia | Z1 #22 | Młotki z hantlami, a łokcie odjeżdżają od tułowia? | Hammer curls — do your elbows wander away from your sides? |
| 12 | Deadlift (hantle) — okrągłe plecy | Z2 EN „deadlift with dumbbells”, PL „z hantlami”; W | Martwy z hantlami w domu — skąd wiesz, że plecy są proste? | Deadlifting dumbbells at home — how do you know your back stays flat? |
| 13 | Chin Up — skrócony zakres albo bujanie | Z2 PL „podchwytem”; Z5 (rzadziej szukane niż nachwyt); W | Podciągasz się podchwytem, ale czy schodzisz na dół do końca? | Chin-ups — are you going all the way down every rep? |
| 14 | Trap Bar Deadlift — okrągłe plecy | Z2 PL „martwy ciąg trap bar”; W | Na trap barze wydaje się łatwiej — ale czy plecy na pewno zostają proste? | The trap bar feels easier — but is your back still staying flat? |
| 15 | Cable Curl (dwie linki) — łokcie do przodu | Z2 EN „bicep curl cable”; W | Uginanie między dwoma wyciągami — łokcie zostają w miejscu? | Curling between two cables — do your elbows stay put? |
| 16 | Front Squat — pięty w górę | Z5 (wzrost zainteresowania, 2020); W | W przysiadzie przednim pięty odrywają ci się od podłogi? | Front squats — do your heels come off the floor? |
| 17 | Incline Bench Press (sztanga) — łuk | W (Z1 pokazuje tylko wersję z hantlami) | Wyciskanie na skosie — plecy leżą na ławce czy wyginasz się w łuk? | Incline barbell press — is your back on the bench, or are you arching off it? |
| 18 | Neutral Grip Pull Up — skrócony zakres albo bujanie | Z2 PL „podciąganie młotkowe”; W | Podciąganie chwytem neutralnym — pełne powtórzenia czy połówki? | Neutral-grip pull-ups — full range or half reps? |
| 19 | RDL (hantle/linki) — okrągłe plecy; kolana jak w przysiadzie | Z2 PL „rumuński z hantlami”; W | Rumuński z hantlami — pracujesz biodrami czy głównie zginasz kolana? | Dumbbell RDLs — hinging at the hips, or mostly bending your knees? |
| 20 | EZ Bar Curl — łokcie do przodu | Z2 EN „bicep curl bar” (niejednoznaczne); W | Łamany gryf w rękach, a łokcie wyjeżdżają do przodu, gdy podnosisz? | EZ bar curls — do your elbows swing forward as the bar comes up? |
| 21 | Good Morning — okrągłe plecy | W | Skłon ze sztangą na karku — wiesz, jak wyglądają wtedy twoje plecy? | Good mornings — do you know what your back actually looks like mid-rep? |
| 22 | Incline Curl (hantle) — łokcie do przodu | W | Uginanie na skosie — łokcie zostają z tyłu czy ciągną do przodu? | Incline curls — do your elbows stay back, or pull forward as you lift? |
| 23 | Dead Hang — bujanie | W | Wisisz na drążku spokojnie czy całe ciało się buja? | Hanging from the bar — staying still, or swinging around? |
| 24 | Przysiad z pasem (linki) — pięty w górę | W | Przysiad z pasem na wyciągu — stopy płasko czy pięty idą w górę? | Belt squats on the cable — feet flat, or heels lifting? |
| 25 | Reverse Curl — łokcie do przodu | W | Uginanie nachwytem — łokcie przy bokach czy uciekają do przodu? | Reverse curls — elbows at your sides, or creeping forward? |
| 26 | Scapular Pull-Up — skrócony zakres albo bujanie | W | Podciąganie łopatkowe — ruszają się łopatki czy buja się całe ciało? | Scapular pull-ups — are your shoulder blades moving, or is your whole body swinging? |
| 27 | Hammer Curl (linki) — łokcie od tułowia | W | Młotki na wyciągu z liną — łokcie zostają przy tułowiu? | Rope hammer curls — are your elbows staying by your sides? |
| 28 | Cross Body Hammer Curl — łokieć od tułowia | W | Młotki w poprzek tułowia — łokieć stoi czy idzie za hantlem? | Cross-body hammer curls — does your elbow stay put or follow the dumbbell? |
| 29 | Mixed Grip Chin — skrócony zakres albo bujanie | W | Podciąganie chwytem mieszanym — pełny zakres w każdym powtórzeniu? | Mixed-grip chin-ups — full range every rep? |
| 30 | Incline Hammer Curl — łokcie do przodu | W | Młotki na ławce skośnej — łokcie z tyłu czy wyjeżdżają do przodu? | Incline hammer curls — elbows staying back, or drifting forward? |
| 31 | Standing One-Arm Cable Curl — łokieć do przodu | W | Uginanie jednorącz na wyciągu — łokieć stoi czy jedzie za linką? | One-arm cable curls — is your elbow fixed, or following the cable? |
| 32 | Gironda Sternum Chins — skrócony zakres albo bujanie | W | Podciąganie do mostka — dociągasz klatkę do drążka czy kończysz wcześniej? | Sternum chin-ups — bringing your chest to the bar, or stopping short? |
| 33 | Standing Dumbbell Reverse Curl — łokcie do przodu | W | Uginanie hantli nachwytem na stojąco — łokcie trzymasz przy bokach? | Standing reverse dumbbell curls — keeping your elbows at your sides? |
| 34 | Side To Side Chins — bujanie | W | Podciąganie na boki — płynnie od strony do strony czy z bujaniem? | Side-to-side chin-ups — smooth across, or swinging to get there? |
| 35 | Reverse Cable Curl — łokcie do przodu | W | Uginanie nachwytem na wyciągu — łokcie nie uciekają ci do przodu? | Reverse cable curls — are your elbows sneaking forward? |
| 36 | Standing Inner-Biceps Curl — łokcie od tułowia | W | Uginanie z hantlami prowadzonymi na zewnątrz — łokcie zostają przy tułowiu? | Inner-biceps curls — do your elbows stay tucked as the dumbbells go out? |
| 37 | Wide-Grip Rear Pull-Up — skrócony zakres albo bujanie | W | Podciąganie szerokim chwytem za kark — schodzisz do końca czy kończysz w połowie? | Wide-grip behind-the-neck pull-ups — all the way down, or stopping halfway? |
| 38 | One Arm Chin-Up — skrócony zakres albo bujanie | W | Ćwiczysz podciąganie na jednej ręce — z pełnego zwisu czy z bujnięcia? | Working toward a one-arm chin-up — from a dead hang, or with a swing? |

Podsumowanie podstawy: pozycje 1–8, 10–11 stoją na przeczytanym Z1 (kolejność między nimi = Z1, z korektą Z2/Z3 dla uginania); 9, 12–16, 18–20 — przeczytany sygnał Z2/Z5 (obecność wariantu, bez wolumenu) + moja ocena kolejności; 17 i 21–38 — wyłącznie moja ocena (konwencja/wnioskowanie). Kolejność 21–38 jest najsłabsza — przy danych Z6/Z11 do przestawienia.

### Kontrola haków (wg zasad briefu)
- Bez cyfr i liczb; „jednej ręce” / „one-arm” to nazwa ćwiczenia, nie liczba — do decyzji właściciela, czy to dopuszczalne (alternatywa #38: „Ćwiczysz podciąganie jednorącz…”).
- Bez zdrowia, kontuzji, bólu; żaden hak nie mówi, co błąd powoduje — tylko opisuje sytuację lub sam błąd.
- Bez obietnic efektu, bez marek, bez „pobierz”, bez nazwy studia.
- Język: forma „ty”, potoczne „martwy”, „młotki”, „łamany gryf”, „na skosie” (słownik siłowni). PL #2: pierwsza wersja ma rodzaj męski („sprawdziłeś”) — w tabeli podana forma neutralna do wyboru.
- Wymaga przeglądu: recenzent-lokalizacji (naturalność PL/EN) i zgodność nazw ćwiczeń ze słownikiem `docs/lokalizacja/slownik-terminow.json` — nie sprawdzałem słownika.

### Uwagi do produkcji (do decyzji właściciela, nie zrobione)
- #37 (podciąganie za kark) i #21 (skłon ze sztangą) w krótkich filmach mogą ściągać komentarze o bezpieczeństwie — rozważyć przesunięcie na sam koniec albo pominięcie; to ocena marketingowa, nie merytoryczna.
- Opis/podpis filmu: wzór DEC-07 K6 („szybki zapis serii, także z zegarka; dane tylko na telefonie; bez konta”) + ujawnienie autorstwa („jestem autorem aplikacji”) w opisie konta/filmu (`docs/wzrost.md` pkt 6) — szkic podpisów nie był w zakresie.
- Każdy błąd i wersja poprawna na rysunku muszą mieć status `ready` po recenzji bramki 4 (CLAUDE.md, „Animacje i karty ćwiczeń”) — przed nagraniem filmu sprawdzić status rodziny w `docs/research/figury-recenzja.json`.
