# 25 — Audyt 0.10.0 (08.10.2026)

Audyt na polecenie właściciela z 08.10.2026 („super głęboki audyt wszystkich możliwych warstw, w tym spójności logik aplikacji”).
Kod: commit **d2a1e85** (`feature/e2-swap`, wersja 0.10.0 przed wydaniem). Audyt niczego nie zmieniał w kodzie — tylko znaleziska.

## Jak był zrobiony

10 niezależnych audytorów (agentów), każdy na osobnej kopii repozytorium i z innym obszarem:

| Prefiks | Obszar | Znaleziska | Raport |
|---|---|---|---|
| UI | spójność interakcji (usuwanie, potwierdzenia, zapis, nawigacja, nazwy, kroje) | 18 | [UI](audyt-0.10/UI.md) |
| LOG | poprawność każdej funkcji `lib/` (472 eksporty, przypadki brzegowe, strefy czasowe) | 17 | [LOG](audyt-0.10/LOG.md) |
| DAT | dane: stan, migracje (fuzz 3000), trwałość, kopia, zgodność z buildem 1004 | 9 | [DAT](audyt-0.10/DAT.md) |
| X | spójność między funkcjami (macierz encja × operacja × zależne, ~95 komórek) | 16 | [X](audyt-0.10/X.md) |
| MER | merytoryka (34 twierdzenia, źródła czytane) i prawdziwość tekstów o działaniu aplikacji | 18 | [MER](audyt-0.10/MER.md) |
| A11 | 26 języków, VoiceOver (4089 elementów), kontrast, kroje, wąski ekran | 20 | [A11](audyt-0.10/A11.md) |
| TST | jakość testów (52 mutanty), macierz, E2E, CI, dryf dokumentacji, nazwy usuniętych mechanik | 15 | [TST](audyt-0.10/TST.md) |
| SEC / NAT / PERF | bezpieczeństwo i prywatność (cała historia git), gotowość App Store, wydajność (2000 treningów) | 22 | [SEC](audyt-0.10/SEC.md) |
| UX | sens produktu: mapa funkcji i wejść, ścieżki użytkownika, zgodność z decyzjami z docs/18 | 16 | [UX](audyt-0.10/UX.md) |
| LIVE | trening na żywo: każda akcja i stan ekranu treningu (fałszywy zegar, restart) | 17 | [LIVE](audyt-0.10/LIVE.md) |

Razem **168 znalezisk surowych**; po złączeniu duplikatów (ten sam problem z kilku stron) — **ok. 95 problemów** w grupach niżej.
Zasady audytu: każde znalezisko z dowodem — **POTWIERDZONE** (odtworzone uruchomieniem kodu: test roboczy, skrypt, zrzut) albo
**Z KODU** (cytat plik:linia z rozumowaniem). Testy robocze audytorów (48 plików) są zachowane poza repo i posłużą jako testy regresji
przy naprawach. Koordynator ponownie uruchomił kluczowe testy dowodowe (wynik w sekcji „Weryfikacja”).
Wagi: **KRYTYCZNA** — utrata danych, błędne zalecenie treningowe, crash; **WYSOKA** — błędne zachowanie w typowym użyciu, wyraźna
niespójność; **ŚREDNIA** — przypadek brzegowy, niespójność drugorzędna; **NISKA** — kosmetyka, porządek.

Liczba znalezisk surowych wg wagi: KRYTYCZNA 2 (MER-01; SEC-01 — ryzyko przyjęte przez właściciela 06.10), WYSOKA 27, reszta ŚREDNIA/NISKA.

## Najważniejsze wnioski

1. **Plan tygodnia i Kalendarz mówią nieprawdę o przeszłości i o zrobionych dniach** — potwierdzone niezależnie przez 5 audytorów
   (UX, X, DAT, LOG, UI). Plan obowiązuje wstecz (fałszywe „opuszczone” od pierwszego dnia i w całej historii), panel dnia nie wie,
   że trening się odbył, a „Propozycje” / „Przenieś na dziś” potrafią zgubić albo zdublować sesję. To nowa funkcja 0.10.0.
2. **Generator** przy celu „Siła” bez obciążenia (dom, masa ciała) daje 3 × 4–6 pompek i przysiadów opisane jako „ciężko, ok. 80%
   maksimum” — błędne zalecenie (KRYTYCZNA wg zasady merytorycznej). Reguła „każda partia ≥ 2× w tygodniu”, którą ekran ogłasza, nie jest
   sprawdzana (plecy 0 serii bez ostrzeżenia w 36 konfiguracjach).
3. **Deload** ma luki: „Powtórz ostatni” omija pytanie o mniej serii, a w tygodniu deload karta podpowiada „↑ spróbuj +2,5 kg” wbrew
   tekstowi „ciężary bez zmian” i źródłom.
4. **Kilka planów**: aktywacja z generatora po cichu kasuje ręczne zmiany dni (ekran Plan o tym uprzedza, generator nie), a powrót do
   starego planu myli nazwy — to dokładnie przypadek użycia właściciela.
5. **Trening na żywo** jest solidny (wpisywanie, przerwy po restarcie, pauza, północ, zmiana czasu), ale **supersety** mają dwa błędy:
   „Pomiń dziś” wyłącza przerwy drugiego ćwiczenia, a rozgrzewka w supersecie psuje kolejność karty „teraz”.
6. **Dane są bezpieczne**: eksport → import → restart → 2× migrate = 0 różnic na pełnym stanie; 3000 losowych przypadków bez wyjątku;
   build 1004 ↔ 0.10.0 w obie strony bez strat danych (poza 2 nowymi ustawieniami przy cofnięciu do 1004 — DAT-05).
7. **Proces testów**: nocne testy i testy stref czasowych nigdy nie objęły gałęzi wydania (biegną z `main`); nocny przebieg z 08.10
   miał 3 porażki bez reakcji. 20 z 46 celowo wprowadzonych błędów przeszło testy (plan tygodnia: wykryte 3 z 10).
8. **Czcionka na karcie „teraz”** (pytanie właściciela) — w 0.10.0 zgodna z decyzją (IBM Plex Sans Bold w nagłówkach i dużych
   liczbach, timery IBM Plex Mono; zmierzone dwoma niezależnymi testami). Na telefonie jest build z `main`, gdzie nagłówek, duża
   liczba i przycisk są jeszcze w Tektur. Wyjątek w 0.10.0: kolumna „Poprzednio” w wierszu serii w kroju systemowym (LIVE-13).

## Grupy problemów (po złączeniu duplikatów)

Format: **[waga]** opis — źródła (ID) — propozycja. „Decyzja” = wybór produktowy właściciela (opcje z kompromisami w raporcie
źródłowym); bez dopisku = oczywisty błąd, naprawa wg rekomendacji.

### A. Plan tygodnia i Kalendarz

- **A1 [WYSOKA] Plan obowiązuje wstecz.** `plannedOn` dla każdej daty bierze bieżący plan, `dayStatus` daje „opuszczony” każdemu
  minionemu dniowi (także sprzed instalacji); zmiana aktywnego planu przepisuje przeszłość; `tidy()` kasuje zmiany dni starsze niż 60 dni,
  więc jawne „wolne” wraca jako „opuszczony”. Istniejący test utrwala opuszczony poniedziałek przy planie ustawionym w czwartek.
  — DAT-01, X-02, UX-02. **Decyzja:** A) `weekPlan.since` (pole opcjonalne, bez podbicia schematu; przed datą brak planu) — tanie,
  rekomendacja trzech audytorów; B) historia odcinków planu — wierna przeszłość, ale zmiana schematu (osobne wydanie); C) „opuszczony”
  tylko dla ostatnich dni. Rekomendacja: **A**, plus `tidy` bez kasowania dni po `since`.
- **A2 [WYSOKA] Panel dnia nie wie, że trening się odbył (ani że trwa).** Liczy stan z planu i „przeszłości”, nie z `dayStatus`:
  dzień zrobiony = „Opuszczony: X” z „Przenieś na dziś”; dziś zrobione = „Zaplanowany” ze Startem i przesuwaniem. — X-01, UX-01.
  Naprawa: jeden stan dnia wszędzie (`dayStatus`), „Zrobione: <sesja> ›” bez akcji przesuwania; przy treningu w toku bez przesuwania.
- **A3 [WYSOKA] „Propozycje” i „Przenieś na dziś” nie widzą zrobionych treningów** — gubią zaplanowaną sesję albo planują zrobioną
  drugi raz. — LOG-01. Naprawa: dzień z zakończonym treningiem jest w symulacji zajęty; „zrobione” liczone w utraconych sesjach.
- **A4 [WYSOKA] „Przenieś na dziś” → „Zamień miejscami” wysyła dzisiejszy trening w przeszłość** (najczęstszy przypadek „wczoraj nie
  dałem rady”); dla dnia minionego brak „Przesuń plan od dziś”, „Wolne” i „trening wstecz z tego dnia”. Istniejący test utrwala to
  zachowanie. — UX-03, X-09. **Decyzja:** A) dla dnia minionego „Przesuń plan od dziś” (jak tryb (a) właściciela), zamiana tylko między
  dniami przyszłymi, plus „Wolne” i „Zapisz trening z tego dnia” (rek.); B) przy konflikcie z przeszłością odesłać do „Propozycji”.
- **A5 [ŚREDNIA] „Zrobione” = dowolna sesja tego dnia** (zaplanowany Upper A, zrobiony Legs → „Dziś: Upper A · zrobione”). — X-04.
  **Decyzja:** A) zrobione tylko z tego szablonu; B) zostaje, ale karta/pasek/panel pokazują nazwę faktycznej sesji, panel proponuje
  przeniesienie niezrobionego (rek.); C) bez zmian.
- **A6 [ŚREDNIA] `hasPlan()` prawdziwe bez żadnego planu** (zostały zmiany dni) → „Dziś wolne” zamiast „Bez planu tygodnia”, kafelek
  „1 / 0”, odhaczony krok 2 „Pierwszych kroków”. — X-05.
- **A7 [ŚREDNIA] Usunięcie lub archiwizacja szablonu z planu — po cichu**; martwe id w planie, zapisanych planach i zmianach dni;
  aktywacja zapisanego planu z usuniętym szablonem. — X-06, UX-07, UI-06. **Decyzja:** A) potwierdzenie z listą dni planu („te dni
  będą wolne”) + sprzątanie martwych id (rek.); B) blokada usunięcia; C) „(usunięty szablon)” w planie.
- **A8 [ŚREDNIA] Pusty szablon w planie**: Start z karty „Dziś” / panelu daje pusty trening, przypomnienie się planuje. — X-10.
- **A9 [ŚREDNIA] Podgląd tygodnia bez nazw treningów, nigdzie „co jutro”**; pasek to pon.–nd., a „Co nowego” obiecuje „podgląd
  7 dni” (tekst nieprawdziwy); `upcoming()` nieużywane. — UX-08. **Decyzja:** A) 2–3 najbliższe treningi z nazwą pod paskiem
  + tapnięcie dnia otwiera ten dzień (rek.); B) skrót w kółku; C) tylko poprawka tekstu.
- **A10 [NISKA]** `suggest()` daje duplikaty (LOG-13); stopka „plan wraca do rutyny w {n} dni” bezwarunkowa, opis rankingu nieścisły
  (MER-16); panel dnia na SE poza widokiem, za dużo przycisków (UX-13); ekran Plan tygodnia źle się skaluje — 35–70 chipów (UX-15).

### B. Kilka planów

- **B1 [WYSOKA] Aktywacja z generatora kasuje zmiany dni bez ostrzeżenia**; obietnica „wrócisz jednym przyciskiem” ich nie przywraca;
  „Obecny plan zostanie w Inne plany” także, gdy pusty plan nie jest zapisywany. Niezgodne z docs/24 pkt 1. — UI-02, X-07, DAT-02,
  LOG-05, UX-04 (5 audytorów). Naprawa: ten sam tekst co na ekranie Plan (liczba zmian). **Decyzja (dodatkowo):** zapisywać zmiany dni
  razem z planem i przywracać je przy powrocie — wtedy obietnica jest prawdziwa.
- **B2 [WYSOKA] Tymczasowy plan i powrót do starego** (przypadek użycia właściciela z docs/18): po „Zapisz kopię” i powrocie oryginał
  jest aktywny jako „Kopia: Mój plan”, tymczasowy leży jako „Poprzedni plan”; kolejne cykle mnożą „Poprzedni plan”; zapisanych planów nie
  da się przemianować (`renamePlan` nieużywane, docs/24 je przewiduje); generator tworzy plany o identycznych nazwach. — UX-04, X-14.
  **Decyzja:** A) „Nowy plan” jako osobny wpis edytowany przed aktywacją, oryginał zachowuje nazwę, zmiany dni zapisują się z planem;
  B) minimum: pytanie o nazwę przy kopii, zmiana nazwy w „Inne plany”, unikalne nazwy (rek. na najbliższą poprawkę, A później).
- **B3 [ŚREDNIA] Limit 50 zapisanych planów tylko w `migrate`** — 51. (najnowszy) plan znika po restarcie. — DAT-03. Naprawa: limit w UI.
- **B4 [ŚREDNIA] Nazwa planu zapisywana tylko przy końcu edycji** — „Zapisz kopię” bierze starą nazwę; `migrate` nieidempotentne dla
  nazw planów (spacja po obcięciu, przecięte emoji). — UI-05, DAT-06.

### C. Generator

- **C1 [KRYTYCZNA] Cel „Siła” w miejscu bez obciążenia**: 3 × 4–6 przysiadów i pompek bez ciężaru, Dead Bug z przerwą 2 min — ekran
  mówi „ciężko, ok. 80% maksimum i więcej” (ACSM 2026: siła ≥ 80% 1RM). Gałąź „siła” ignoruje `home`. — MER-01. **Decyzja:**
  A) ostrzeżenie w podglądzie + zakresy jak „masa w domu” (12–20, blisko upadku) (rek.); B) „Siła” niedostępna bez obciążenia,
  z wyjaśnieniem; C) trudniejsze warianty ćwiczeń (wymagają źródeł).
- **C2 [WYSOKA] „Każda partia co najmniej 2 razy w tygodniu (ACSM, przeglądy badań)” nie jest sprawdzane**: w 102 z 210 konfiguracji
  któraś główna partia < 2×; przy „Siła” w domu / masa ciała / hotel plecy, biceps = 0 serii i brak ostrzeżenia (`below10` puste dla siły).
  Atrybucja: zasada „wszystkie główne grupy ≥ 2 dni” to WHO 2020; ACSM 2026 daje ≥ 2×/tydz. tylko dla siły. docs/research/22 R1 mówi
  o grupach ruchów, nie partiach. — MER-02, LOG-03. **Decyzja:** A) liczyć dni na partię dla każdego celu i pokazywać „Brak ćwiczeń
  na: … — przyda się drążek/guma” oraz „rzadziej niż 2×: …”, poprawić atrybucję (rek.); B) tylko poprawić tekst i dodać ostrzeżenie o 0.
- **C3 [ŚREDNIA] Generator bez miejsca = plan na pełną siłownię** (świeża instalacja nie ma miejsc, brak „+ Dodaj miejsce”); ponowne
  generowanie mnoży szablony „(2)” i plany o tej samej nazwie; opis wysiłku ginie po zapisie; brak potwierdzenia, co zapisano. — UX-10.
  **Decyzja:** A) „+ Dodaj miejsce”, pytanie o zastąpienie nieużywanych wygenerowanych szablonów, nazwa planu z miejscem/datą, jedna
  linijka wysiłku w szablonie, potwierdzenie z linkiem (rek.); B) tylko komunikat i unikalne nazwy.
- **C4 [ŚREDNIA] Teksty podstaw generatora**: „zwykle 1–3 powtórzenia w zapasie” bez źródła wprost (ACSM 2026: 2–3 albo blisko upadku,
  dokładnej liczby nie ustalono — MER-06); przerwy 180/120/90 s, 3 serie i długość cardio bez punktu w „Na czym to oparte” (MER-07);
  „ruch w ciągu dnia… razem zwykle 150–300 min” — WHO mówi o „co najmniej” i umiarkowanym wysiłku (MER-08, poprawić też ADR-041);
  „Liczba ćwiczeń z czasu sesji” — wzór daje liczbę serii (MER-12); 0,5 serii pomocniczej (jedno źródło) bez oznaczenia w podglądzie (MER-17).
- **C5 [NISKA]** Liczby generatora w kilku miejscach (literały w kodzie i w tekstach; `< 10` zamiast `WEEKLY_SETS_MARK`; docs/24
  „2–3×” vs kod 3) — LOG-11, TST-10; pary dzień po dniu z tymi samymi partiami, których dało się uniknąć — LOG-10; wygenerowany
  trening cardio trafia do Apple Health jako siłowy — MER-18.

### D. Deload

- **D1 [WYSOKA] Tydzień deload — luki w propozycji „mniej serii”**: „Powtórz ostatni” startuje pełny trening bez pytania; szablon
  z samymi pojedynczymi seriami też; w trakcie karta podpowiada „↑ spróbuj +2,5 kg” wbrew „ciężary bez zmian” i źródłom (Rogerson 2024,
  Travis 2020 — w deloadzie intensywność się utrzymuje lub obniża). — MER-05, UI-03, UX-06, X-16 (4 audytorów). **Decyzja:**
  A) „Powtórz ostatni” pyta tak samo, w tygodniu deload bez „↑”, dopisek o ćwiczeniach z 1 serią (rek.); B) tylko poprawić teksty.
- **D2 [WYSOKA] „mniej serii (około połowy)” — dla 3 serii zostają 2** (cięcie 33%; szablony z generatora mają zawsze 3 serie). Samo
  cięcie mieści się w źródłach (25–>50%, 30–70%). — MER-04. **Decyzja:** A) tekst „o około 1/3–1/2 mniej serii (np. 2 z 3)” (rek.);
  B) `floor(n/2)` — 3 → 1 to 67%, poza praktyką ze źródeł.
- **D3 [ŚREDNIA] Drop sety: trzy definicje „serii roboczych”** (pytanie deload bez dropów, karta szablonu i Postępy z dropami, rundy
  supersetu jako część serii); brak źródła, jak liczyć drop set do kreski 10 serii. — LOG-07, X-13. **Decyzja:** A) wszędzie drop razem
  z serią, oznaczone „uproszczenie” (rek.); B) wszędzie osobno. Pytanie otwarte do researchu.
- **D4 [ŚREDNIA, UX]** Oznaczanie tygodnia deload rozrzucone (Kalendarz: tylko następny tydzień po ≥ 4 tyg.; Postępy: tylko bieżący
  i miniony); podpowiedź bez „Nie teraz”; ekran Trening i karta „Dziś” nie pokazują, że trwa deload. — UX-06.

### E. Rekordy, statystyki, katalog

- **E1 [WYSOKA] e1RM w ćwiczeniach z masą ciała liczony z samego dociążenia** — to nie jest szacunek Epleya (wzór dotyczy całego
  podnoszonego ciężaru), kolejność rekordów się odwraca (+30 × 3 „bije” +20 × 8). ADR-018 mówiło „nie liczone”, późniejsza decyzja Q-001
  „e1RM z samego dociążenia”; wg CLAUDE.md wzór to kwestia merytoryczna (szczebel 1). — MER-03, LOG-02. **Decyzja (jak pokazać, bo obecny
  rachunek jest błędny):** A) brak e1RM i rekordu e1RM dla ćwiczeń z masą ciała; zostaje max dociążenie i suma powtórzeń (rek. obu
  audytorów, zgodne z celem Q-001); B) opcjonalna masa ciała w Ustawieniach i Epley na (masa + dociążenie); C) inna nazwa liczby, bez odznaki.
- **E2 [WYSOKA] Zmiana nazwy ćwiczenia z biblioteki zmienia wyniki wstecz**: reguły (linki ×2, katalog bazowy w generatorze, zamiany)
  idą po nazwie — po zmianie „Cable Fly” objętość i rekordy dawnych sesji spadają o połowę, generator wybiera inne ćwiczenie. — X-03.
  Naprawa: trwały klucz katalogu (nazwa tylko do wyświetlania). Alternatywa produktowa: blokada zmiany nazwy biblioteki.
- **E3 [ŚREDNIA] Liczba rekordów liczona dwojako** („Nowe rekordy: 2” po treningu, „1 rekord” na karcie „Ostatni trening”). — X-08,
  LOG-06. Naprawa: jedna funkcja; liczyć jak okno po treningu (decyzja T13: rekordy, nie serie).
- **E4 [ŚREDNIA] Przypisanie mięśni w katalogu bez źródeł**; przykład sprzeczny z badaniem (Back Squat → dwugłowe jako pomocnicza;
  Kubo 2019: dwugłowe nie rosną). Napędza kreskę 10 serii, mapę, braki generatora, regenerację. — MER-10. **Decyzja:** B) od razu
  dopisek „przypisanie partii — uproszczenie” na ekranie ćwiczenia (rek.), A) źródła dla 125 ćwiczeń bazowych stopniowo.
- **E5 [NISKA]** Ćwiczenie spoza biblioteki (z importu) — różne liczby serii w liście Historii i w Zdrowiu (X-15); RIR > 9 zapisuje
  RPE 0, skala RPE poniżej 5 to inne opisy (MER-14, LOG-15); opis „↑ więcej {u}” w edytorze nie odpowiada podpowiedzi (MER-13); ekran
  Gumy: „postęp to zejście na niższy poziom” prawdziwe tylko dla asysty (MER-15); CSV „w układzie Stronga” odbiega od formatu (LOG-14).

### F. Trening na żywo

- **F1 [WYSOKA] Superset: „Pomiń dziś” jednego ćwiczenia wyłącza przerwy drugiego do końca** (pominięty blok liczony jako członek
  z zaległymi seriami). — LIVE-01.
- **F2 [WYSOKA] Superset z rozgrzewką: karta „teraz” prowadzi w złej kolejności** (AW → B1 → A1…), przerwy przy złym ćwiczeniu;
  to domyślny widok. — LIVE-02.
- **F3 [ŚREDNIA] „Zakończ” nie ostrzega o nieodhaczonych seriach wstawionych z planu** — przepadają po cichu. — LIVE-05. **Decyzja:**
  A) linia „Nieodhaczone serie: n” zawsze; B) tylko w ćwiczeniach z ≥ 1 odhaczoną serią (rek.); C) bez zmian.
- **F4 [ŚREDNIA] „Pomiń dziś” zatrzymuje trwającą przerwę (z powiadomieniem) i kasuje pomiar stopera bez pytania.** — LIVE-03.
- **F5 [ŚREDNIA] Podpis przerwy („dalej: …”, ekran blokady) liczy następną serię inaczej niż karta**; po ostatniej serii powiadomienie
  „Następna seria.”; po restarcie podpis znika. — LIVE-04, LIVE-15. **Decyzja (koniec treningu):** A) bez przerwy po ostatniej serii;
  B) przerwa zostaje, treść bez „Następna seria” (rek.).
- **F6 [ŚREDNIA] Widok skupiony**: brak startu stopera na karcie (łatwo zapisać czas, którego nikt nie zmierzył) — LIVE-06; przerwa
  niewidoczna po ✓ w wierszu niżej — LIVE-07. **Decyzja:** dla F6a A) duży „▶ Start” + mały „Odhacz bez pomiaru” (rek.), B) osobny ▶;
  dla F6b A) dolny pasek przerwy, gdy karta poza ekranem (rek.), B) zawsze, C) przewinięcie do góry.
- **F7 [ŚREDNIA] Podwójne tapnięcie**: ~20 przycisków nawigacji bez blokady (dwa ekrany wyboru ćwiczenia → podwójne dodanie) — UI-08;
  Start / Pusty / Powtórz / Anuluj bez blokady, a store nie broni się przed nadpisaniem treningu w toku — LIVE-12.
- **F8 [ŚREDNIA] Edytor historii: przy pauzie na końcu treningu wpisany czas trwania jest ignorowany** (wpisane 20 min → zapis 30). — LOG-04.
- **F9 [NISKA]** Karta: jednostka po powtórzeniach („80 × 8 kg”, „20 × 45s kg”), masa ciała bez jednostki, drop liczony jako seria
  (UI-10, LIVE-14 — decyzja: A „80 kg × 8” rek., B tylko VoiceOver); „Wszystkie serie odhaczone”, gdy reszta pominięta (LIVE-08); stoper
  w pauzie liczy się do pauzy (LIVE-09); pauza nie wstrzymuje logiki porzuconego treningu (LIVE-10 — decyzja: B dopisek o pauzie w pytaniu,
  rek.); usunięcie ćwiczenia z odhaczonymi seriami bez informacji (LIVE-11); ciężar nieułożony z talerzy — pusta przestrzeń (LIVE-17);
  „Poprzednio” w kroju systemowym, plakietka przerwy na zakładce bez kroju (LIVE-13, UI-11).

### G. Usuwanie, edycja, potwierdzenia

Usuwanie gestem jest spójne we **wszystkich 16 miejscach** (ten sam komponent, pytanie, „Nie / Usuń”, akcja VoiceOver; brak „− seria”
i „Usuń”) — zgodnie z decyzją 07.10. Wyjątki i różnice:
- **G1 [WYSOKA] Edytor ciężarów w miejscu: „Usuń odznaczone” i „Wypełnij” usuwają bez potwierdzenia; „Wypełnij” zastępuje całą listę**
  (preset → zakres 10–16 = utrata 2,5…25). Test „bez przycisków Usuń” porównuje dokładny tekst i tego nie łapie. — UI-01. **Decyzja:**
  „Wypełnij” A) dopisuje do listy (rek.), B) okno „Znikną ciężary: n”; „Usuń odznaczone” A) usunąć przycisk, B) zostawić z potwierdzeniem (rek.).
- **G2 [ŚREDNIA] Pusta nazwa przy wyjściu gubi nazwę** szablonu i ćwiczenia (po restarcie „Nowy szablon”); dwa edytory koloru gumy
  z różnymi zasadami. — UI-05. Naprawa: wspólne pole nazwy z przywróceniem poprzedniej.
- **G3 [ŚREDNIA] Potwierdzenia nie mówią o skutkach w spójny sposób**: szablon (plan, inne plany, trening w toku), miejsce (trening
  w toku), „Wyczyść wszystkie dane” (kasuje trening w toku), usunięcie sesji z `healthUUID` (kopia w Zdrowiu zostaje). — UI-06, DAT-09.
- **G4 [ŚREDNIA] Ostatnia seria: trzy różne zasady** (trening i szablon — nie da się usunąć, historia — da się); wiersz bez gestu nie mówi
  dlaczego. — UI-07. **Decyzja:** A) wszędzie nie, z wyjaśnieniem (rek.); B) wszędzie tak.
- **G5 [NISKA]** Konwencje okien: „Nie / Wróć / Anuluj”, brak `destructive` przy nieodwracalnych (UI-14); `SwipeRow` — nowy PanResponder
  przy każdym renderze rodzica, kilka wierszy odsłoniętych naraz (UI-17); co blokuje trening w toku — różna informacja (UI-18); limity
  i walidacja wpisów (UI-16); puste stany i archiwum w „Trening wstecz” (UI-15 — decyzja: B pokazać pod „Archiwum”, rek.).

### H. Nawigacja, nazwy, pomoc

- **H1 [ŚREDNIA] „Pokaż” w Przewodniku kładzie drugi zestaw zakładek na stos** (4 z 8 tematów, bez przycisku wstecz); temat „Deload”
  otwiera kalendarz bez elementu deload; przewodnik pomija zamianę ⇄, edycję sesji, trening wstecz, „Pomiń dziś”, supersety. — UI-04, UX-09.
- **H2 [ŚREDNIA] Nazwy**: komunikat autozapisu „Znajdziesz go w Historii” (zakładka to Kalendarz; w 26 językach, test to utrwala);
  ikona wykresu dla Kalendarza; „Miejsca i sprzęt” vs „Miejsca treningu”; „Generator planu” / „Generator szablonów i planu” / „Wygeneruj
  szablony i plan”; „Backup” vs „Kopia zapasowa”; „X (kopia)” vs „Kopia: X”; nazwy z generatora zostają po polsku po zmianie języka;
  „Anuluj trening” vs „Odrzuć trening”. — UI-12, UX-14, TST-08. Naprawa: jedna lista poprawek + słownik terminów w docs.
- **H3 [NISKA]** Formaty czasu trwania, przerw, dat i liczby serii (rozgrzewki liczone w Kolejności i edycji) — UI-13.
- **H4 [NISKA, UX]** „Pierwsze kroki”: ta sama instrukcja 3 razy, odwołanie do przycisku poza ekranem SE, krok 2 bez szablonu otwiera pusty
  plan, kg także dla en-US, nowa osoba widzi „Co nowego” względem wersji, których nie znała (UX-12); drobne przepływy (UX-16).
- **H5 [ŚREDNIA, UX, decyzja] Brak „Zapisz jako szablon” / „Zaktualizuj szablon”** po treningu (skargi użytkowników D3, życzenie nr 4,
  docs/11) — UX-11. A) okno po treningu, B) „Zapisz jako szablon” w szczegółach sesji (rek. — bez okien, zgodne z zasadą „szablony
  ustawia użytkownik”), C) bez zmian. To nowa funkcja — do kolejności prac.

### I. Przypomnienia i powiadomienia

- **I1 [ŚREDNIA] Przypomnienie z planu nigdy nie prosi o zgodę na powiadomienia** (prośba tylko przy pierwszym treningu); przełącznik
  „włączony” mimo odmowy; „Sprawdź zgodę” bez przejścia do Ustawień iOS; horyzont 7 dni (kto nie otworzy aplikacji przez tydzień, przestaje
  dostawać przypomnienia). Atrapy w testach zawsze dają zgodę. — UX-05, X-11, TST-06, NAT-06. **Decyzja:** A) prośba przy pierwszym dniu
  w planie z wyjaśnieniem, stan zgody przy przełączniku, horyzont ~28 dni (rek.); B) tylko informacja w kroku 2 i przy przełączniku.
- **I2 [NISKA]** Po zmianie języka zaplanowane przypomnienia zostają w starym języku (klucz bez języka) — X-12, LOG-12, A11-13;
  synchronizacja o 7:59:30 odwołuje dzisiejsze przypomnienie — LOG-12.

### J. Dane i zgodność

- **J1 [ŚREDNIA] Dane z nowszej wersji w starszym buildzie**: ustawienia spoza białej listy giną (skala RIR → RPE, wyłączone przypomnienie
  wraca), schemat zapisywany w dół, brak bariery. TestFlight pozwala zainstalować starszy build. — DAT-05. Naprawa: A) zachować nieznane
  klucze ustawień, nie obniżać `schemaVersion` + B) ekran „Dane z nowszej wersji” przy wyższym schemacie (rek. A+B). **Przy wydaniu 0.10.0:
  poprosić testerów, by nie instalowali starszych buildów.**
- **J2 [ŚREDNIA] Nieudany zapis do Apple Health jest cichy i nigdy nie jest ponawiany.** — DAT-04, LIVE-16. **Decyzja:** A) ponawiać przy
  starcie treningi bez `healthUUID` od włączenia synchronizacji + B) licznik w Ustawieniach (rek. DAT); C) odłożyć do wydania Health.
- **J3 [NISKA]** Dzień treningu zależy od bieżącej strefy telefonu (podróż: niedziela 23:30 w PL → poniedziałek w Auckland) — DAT-07
  (rek. A: opisać, nie zmieniać); import z powtórzonym id miejsca lub planu gubi drugi wpis — DAT-08; zamiennik w szablonie może wskazywać
  ćwiczenie usunięte w trakcie treningu (znalezione przez nocny test, odtworzone na d2a1e85) — TST-01.

### K. Języki i dostępność

- **K1 [WYSOKA] „Przerwa” (odpoczynek) i „Pauza” (zatrzymanie zegara) tym samym słowem w 8 językach** (cs, sk, ro, et, de, da, nb, fi) —
  na ekranie treningu nie wiadomo, co zatrzymuje zegar; przewodnik mówi wtedy rzecz mylącą. — A11-01. Rek.: ujednolicić termin przerwy
  (słowo, którego tłumacze już używają w dłuższych zdaniach), z recenzją native speakera.
- **K2 [ŚREDNIA]** Wersaliki w nagłówkach: grecki z akcentami, turecki bez „İ” (A11-02); zakładki ucięte „…” na 320 pt w 8 językach
  (A11-03); „Usuń” pod wierszem w ciemnym motywie 2,77:1 (A11-04, UI-09); tydzień deload i „dziś” w kalendarzu tylko kolorem, VoiceOver
  ich nie podaje (A11-05); ramki pól, puste ✓ i przełącznik < 3:1 (A11-06); limity powiększenia tekstu ~140% (A11-07); terminologia
  w it (Scheda/modello) i lt (Serija/Priėjimai) (A11-08); VoiceOver czyta głosem języka systemu (A11-09); testy dostępności i języków
  nie obejmują nowych ekranów ani 320 pt (A11-10, TST-03).
- **K3 [NISKA]** Plex Mono bez greckich liter, a docs/16 twierdzi inaczej (A11-11); Segmented łamie wyraz na 320 pt (A11-12); podwójna
  nazwa w chipie (A11-14); pola dotyku < 44 pt (A11-15); wyszarzone aktywne wiersze za słabe (A11-16); jednostki bez tłumaczenia
  (A11-17); szum VoiceOver i podwójne glify (A11-18); złamania linii (A11-19); bg/uk „Inne” (A11-20).

### L. Medycyna i granice

- **L1 [ŚREDNIA] Brak odesłania do specjalisty**: notatka „np. samopoczucie, ból, sprzęt” bez odesłania, generator tworzy pełne plany
  (z cardio 45–90 min) bez notki zdrowotnej; w 893 tekstach brak słów „lekarz/specjalista/fizjoterapeuta”. — MER-11. **Decyzja:**
  A) jedno zdanie „Aplikacja nie udziela porad medycznych…” w generatorze, przewodniku i Ustawieniach (rek.); B) tylko usunąć „ból”.

### M. Testy, CI, proces

- **M1 [WYSOKA] Nocne testy i testy stref nigdy nie objęły gałęzi wydania** (harmonogram biegnie z `main`, 61 commitów wstecz); nocny
  przebieg 08.10: 3/3 zadania nieudane bez reakcji (losowe sekwencje — prawdziwy błąd J3; mutacje — timeout 5 min; E2E na małym ekranie
  2/11). — TST-01. **Decyzja:** A) w nocnych workflowach lista gałęzi ze zmiennej repo + zgłoszenie porażki (rek.); B) losowe ziarno
  i 2 strefy w testach przy każdym wypchnięciu (+~10 min, darmowe).
- **M2 [WYSOKA] Testy nie łapią zmian granic**: 20 z 46 nierównoważnych mutantów przeżyło; plan tygodnia 3/10, generator 2/5, timer 3/7.
  — TST-02. Naprawa: test graniczny na każdego ocalałego mutanta; Stryker rozszerzony o nowe moduły.
- **M3 [WYSOKA] Definicja ukończenia (docs/20) niespełniona dla funkcji z 07–08.10 i bez zapisanych powodów**: losowe sekwencje,
  migracje i kopia nie znają nowych pól i akcji; dostępność i 26 języków tylko na starych trasach. — TST-03, A11-10. **Decyzja:**
  A) uzupełnić (alfabet akcji, niezmienniki, trasy generowane z `app/`) (rek.); B) dopisać „nie dotyczy” (sprzeczne z celem zasady).
- **M4 [WYSOKA] Sekrety w zasięgu kodu zależności** w `iphone-eas.yml` i `iphone-local.yml` (EXPO_TOKEN i klucz ASC widoczne dla
  `npm ci`, testów i nieprzypiętych zależności eas-cli). — TST-04, SEC-03. **Decyzja:** A) usunąć oba workflowy i sekrety EXPO_TOKEN /
  ASC_API_KEY_P8, skoro instalacja idzie przez TestFlight (rek., jeśli EAS nie wraca po 01.11); B) utwardzić jak `testflight.yml`.
- **M5 [ŚREDNIA]** Macierz testów liczy wzmiankę (także w komentarzu), nie zachowanie; wymiary to ręczna lista 13 pozycji; plik wymiarów
  z docs/20 nie istnieje (TST-05); CLAUDE.md i README kierują na `iphone-local.yml`, który zużywa wyczerpany limit Expo, domyślne
  ustawienia zużywają limit, README nie zna `testflight.yml` (TST-07); 41 martwych kluczy słownika (poranny wpis, waga, „− seria”,
  moduły), README opisuje usunięte funkcje (TST-08); testy, które nie mogą się wywrócić (TST-09); docs/20 „Stan na 07.10” nieaktualny
  (TST-10); Maestro i akcje nieprzypięte (TST-11, SEC-05); niestabilny test pauzy pod obciążeniem (TST-12); Stryker tylko 2 pliki,
  wynik z 01.10 (TST-13); skrypt tłumaczeń poza repo (TST-14); anulowane przebiegi CI (TST-15 — zostawić, opisać).

### N. Bezpieczeństwo, App Store, wydajność

- **N1 [KRYTYCZNA wg skali; ryzyko przyjęte 06.10] Dane osobowe w historii publicznego repo**: jeden wpis poranny (waga, Body Battery)
  i daty dwóch treningów w pliku testowym z 02.10 (zastąpionym fikcyjnymi 06.10, historia nieprzepisana — decyzja z docs/15). — SEC-01.
  Repo ma 0 forków — przepisanie historii jest teraz najtańsze, później może być niemożliwe. **Decyzja:** A) zostawić (rek., zgodnie
  z decyzją 06.10); B) przepisać historię teraz (force-push wszystkich gałęzi, prośba do GitHub Support o czyszczenie pamięci podręcznej).
- **N2 [WYSOKA] Brak strony polityki prywatności** — wymagana przed wysyłką do App Store (szczególnie z HealthKit); nie blokuje TestFlight
  wewnętrznego. Kod potwierdza „Data Not Collected” (0 wywołań sieciowych, HealthKit tylko zapis). — NAT-01. Naprawa: strona PL/EN na
  GitHub Pages (0 zł).
- **N3 [WYSOKA] Zakładka Ćwiczenia bez wirtualizacji (854+ wierszy) i przeliczana przy każdym znaku** w notatce/nazwie ćwiczenia, gdy jest
  zamontowana pod spodem (Jest: 25 ms → 618 ms na znak). — PERF-01. Naprawa: FlatList/SectionList jak w pickerze, `exerciseInHistory`
  dopiero w oknie usuwania, jeden `Intl.Collator`.
- **N4 [ŚREDNIA]** Każda zmiana poza treningiem unieważnia cache historii i przelicza ukryte zakładki (PERF-02); cały stan jako jeden blob
  JSON — przy 2000 treningów 17 MB, start (parse + migrate) 471 ms w Jest (PERF-03 — rek. A: szybka ścieżka migrate i osobne klucze dla
  ustawień/szablonów; wiersze SQLite później, osobno od SDK); `testflight.yml` może wpisać Key ID / Issuer ID do publicznego artefaktu przy
  porażce (SEC-02); sekrety dostępne dla workflow z każdej gałęzi, wyłączone secret scanning i push protection (darmowe), `main` bez ochrony
  (SEC-04 — włączenie to ustawienie po stronie właściciela).
- **N5 [NISKA]** „Co nowego” pokazuje „Wersja testowa 1004”, a `testflight.yml` miał 2 przebiegi (1001, 1002) — numer do sprawdzenia
  w TestFlight (NAT-02); numer buildu zależy od licznika pliku workflow (NAT-03); manifest prywatności powstaje dopiero przy `pod install`
  i nic go nie sprawdza (NAT-04); zakres `verify:native` (NAT-05); ekran startowy bez wariantu ciemnego, martwy moduł natywny po widżecie,
  stara biblioteka HealthKit — do wydania Health (NAT-07); `npm audit`: 0 krytycznych, nieużywana zależność `query-string` (SEC-06);
  luki w `.gitignore` (SEC-07); brak ekranu „Licencje” (SEC-08); pliki eksportu zostają w Caches (SEC-09); kalendarz i dashboard
  przeglądają całą historię dla każdego dnia (PERF-04); drobne koszty stałe, 24 słowniki ładowane na starcie (PERF-05); odświeżanie
  całych zakładek co sekundę w czasie przerwy (PERF-06).

## Sprawdzone i w porządku (wybór)

- **Dane**: pełny stan eksport → import → restart → 2× migrate = 0 różnic; fuzz 3000 bez wyjątku; build 1004 ↔ 0.10.0 w obie strony;
  zapisy po kolei, osobny klucz treningu w toku, nieczytelny zapis odkładany; 14 akcji niszczących z potwierdzeniem; import i reset
  z kopią bezpieczeństwa; zatrucie prototypu pokryte.
- **Rachunek**: kg ↔ lb (dziesiątki tysięcy wartości, 0 błędów); talerze zawsze minimalną liczbą (porównanie z brute-force); daty
  w 4 strefach × 800 dni; zmiana czasu (godziny nieistniejące odrzucane); liczba mnoga 26 języków zgodna z CLDR; Epley z limitem
  10 powtórzeń; wzory generatora zgodne z docs/24; 0 pustych szablonów w 210 konfiguracjach.
- **Spójność**: czas z pauzami jedną funkcją w 9 miejscach; serie na partię = mapa mięśni = kreska 10; treningi w tygodniu w 3 miejscach
  tak samo; edycja i usunięcie historii przeliczają rekordy, kafelki, statusy i serię tygodni deload; przypomnienia odświeżają się po
  każdej zmianie planu i szablonów.
- **Trening na żywo**: wpisy (przecinek, lb z przyciąganiem, RIR), przerwa po zabiciu aplikacji, pauza, północ, zmiana czasu, zmiana
  języka i jednostki w trakcie, usuwanie rzeczy w trakcie, Zdrowie bez duplikatów.
- **Usuwanie gestem**: 16 miejsc spójnie (poza G1).
- **Merytoryka**: kreska 10 serii (ACSM 2026), RIR = 10 − RPE (dwa zespoły), deload co 4–6 tygodni jako praktyka (oznaczone),
  generator na siłowni, objętość, mapa mięśni, talerze IWF — źródła przeczytane i zgodne.
- **Języki i dostępność**: 25 × 1090 kluczy bez braków; parametry zgodne; cytaty przycisków w przewodniku zgodne w 25 językach;
  Plex Sans ma wszystkie litery 26 języków; kontrast całego tekstu ≥ 4,5; 4089 elementów z rolą i nazwą.
- **Bezpieczeństwo**: w całej historii 0 kluczy, tokenów, certyfikatów i prawdziwych UDID (poza N1 brak danych osobowych); workflowy
  tylko do odczytu, bez `pull_request(_target)`; artefakty 1 dzień; aplikacja bez żadnych wywołań sieciowych.
- **Natywne**: `verify:native` OK; wersja 0.10.0 zgodna w 4 miejscach; uprawnienia tylko HealthKit; teksty HealthKit w 26 językach;
  ikony zgodne z wymogami; po wycofaniu widżetu brak pozostałości.

## Weryfikacja koordynatora

Koordynator uruchomił ponownie 10 kluczowych testów dowodowych audytorów na d2a1e85 — wszystkie odtwarzają opisane zachowanie:
generator „Siła” w domu i „Tylko masa ciała” (3 × 4–6 Bodyweight Squat / Push Up, plecy 0, biceps 0, dwugłowe 0 serii, `below10 = []`) — C1, C2;
e1RM masy ciała — E1; supersety i „Pomiń dziś” — F1, F2 (8 testów); panel dnia i kalendarz — A2, A6, A8 (5); `hasPlan`, zmiana nazwy
ćwiczenia, „zrobione” = dowolna sesja — A5, A6, E2 (3); propozycje gubiące/dublujące sesję — A3 (2); edytor ciężarów bez potwierdzenia — G1 (7);
plan wstecz, limit planów, nazwy planów, dane nowszej wersji — A1, B3, B4, J1 (10 sond).

## Wydanie 0.10.0 a audyt

Część problemów z wagą WYSOKA i jeden KRYTYCZNY dotyczą funkcji nowych w 0.10.0 (plan, kalendarz, generator, deload, kilka planów) —
właściciel i testerzy zobaczą je od pierwszego dnia (np. fałszywe „opuszczone” w całym kalendarzu). Decyzja właściciela: wydać 0.10.0
jak jest, czy najpierw krótka partia napraw (A1–A4, B1, C1–C2, D1–D2, G1, H2 „w Historii”) i ponowne E2E. Zapis decyzji: docs/18.

## Plan napraw (po decyzjach właściciela)

Każda naprawa: najpierw test, który odtwarza błąd (testy robocze audytorów jako punkt wyjścia), potem kod, `npm run verify`, wpis w docs/09.
1. **Partia 1 — wysokie w nowych funkcjach**: A1–A4, B1, C1–C2, D1–D2, G1, H2 (tekst „w Historii”).
2. **Partia 2 — pozostałe wysokie**: B2, E1, E2, F1, F2, K1, M1–M4, N2, N3.
3. **Partia 3 — średnie** (A5–A9, B3–B4, C3–C4, D3–D4, E3–E4, F3–F8, G2–G4, H1, I1, J1–J2, K2, L1, M5, N4).
4. **Partia 4 — niskie i porządek** (A10, C5, E5, F9, G5, H3–H4, I2, J3, K3, N5).
Nowa funkcja H5 („Zapisz jako szablon”) i wydanie Health (J2 C, NAT-07) — do kolejności prac właściciela.

## Audyt kontrolny 1 (09.10.2026, commit ffb7163) — wynik i backlog

Zasady: CLAUDE.md „Audyty i wydania” (wariant A, 09.10.2026) — wydanie blokują tylko KRYTYCZNE i WYSOKIE; zakres zamrożony; reszta do backlogu
z wersją. 10 obszarów (LOG, MER, X, LIVE, DAT, UI, UX, A11, TST, SEC); raporty audytorów poza repo (scratchpad koordynatora).

**Weryfikacja znalezisk pierwszego audytu:** zdecydowana większość NAPRAWIONE; pozostałości CZĘŚCIOWO/NIE mają klasę ŚREDNIA lub NISKA (niżej).

**Blokery (0 krytycznych, 7 wysokich) — wszystkie naprawione z testem odtwarzającym, verify 180/180 (3501 testów) na e82c4d3:**

| ID | Problem | Naprawa |
|---|---|---|
| LOG2-01 / LIVE2-01 | zamiana w trakcie ćwiczenia (podział bloku) + „Zaktualizuj szablon” → dwie pozycje o tym samym id | łańcuch podziału = jedna pozycja szablonu (`lib/tplsync.ts`), usuwanie w edytorze po obiekcie |
| MER2-01 | pompki: „e1RM … (masa ciała + X)” przeczy liczbie | opis „{p}% masy ciała ± X” z `BW_SHARE` |
| X2-01 (= DAT2-03) | krok katalogu zmieniał tryb ciężaru Pallof Press z historią (podwójna dawna objętość) | inny mnożnik tylko bez użycia |
| DAT2-01 | krok katalogu gubił 123 poprawki pól (partie, grupy, miary) dla aktualizujących z 1001/1002 | skrypt bierze dawną wartość z kopii katalogu; krok przeliczony; strażnik `bandAssistable` |
| UX2-06 | „Obciążenie partii” przeczyło partiom w 80+ ćwiczeniach (twierdzenie merytoryczne) | poziomy wyliczane z pól ćwiczenia (jedno źródło) |
| UI2-01 | „Edytuj → Zapisz” sprzętu nie przeliczał przyrządu w treningu w toku (objętość 200 zamiast 400) | wspólne `exerciseEdited` |
| (przy naprawie) | „Zaktualizuj szablon” dodawał ćwiczenie usunięte w trakcie treningu (= X2-03) | `liveEx` |

Także SEC2-01 (część): marki producentów w presetach sprzętu → nazwy ogólne (decyzja właściciela 09.10 pkt 3A).
E2E: run 37900617167 (f2bdca8) 14/17 — 3 porażki scenariuszy (nie aplikacji) poprawione w 5c24b0c.

**Backlog — 0.10.1 (następne wydanie TestFlight):**
- Liczby i dane (ŚREDNIE): LIVE2-02 (okno „Zakończyć” liczy drop set jako serię roboczą), DAT2-02 (przemianowane ćwiczenie biblioteki traci klucz
  katalogu — brak techniki/figur), LOG2-02, LOG2-03 (edycja daty przez zmianę czasu przesuwa start o godzinę), X2-02 (Postępy a strefa), X-11
  (zgoda na powiadomienia w 2 z 4 dróg), UX2-03 = DAT2-06 (szkic edycji ginie po zamknięciu aplikacji przez iOS).
- Merytoryka: MER2-02 (siła w hotelu z lekkimi hantlami — wariant A: ostrzeżenie o najcięższych hantlach), MER2-04 (wskazania źródeł
  wskazówek; rozstaw „na szerokość barków lub trochę szerzej”), MER2-05 („jedno źródło” przy deloadzie), MER2-06 (= UI2-04, UX2-04: „Co nowego”),
  MER2-08, MER2-03 (rejestr ADR na Dysku: ADR-043+, ADR-028/041).
- UI/UX: UI2-02 (podwójne tapnięcie), UI2-03 (masa ciała — gest), UI2-05…10, UX2-01 (dawne nazwy jako aliasy w wyszukiwaniu), UX2-02,
  UX2-05, UX2-07 (ostrzeżenia generatora o własnym planie), UX2-08…13.
- Języki i dostępność: A11N-01 (język VoiceOver w podglądzie ćwiczenia), A11N-02 (fr/tr forma grzecznościowa), A11N-03…05.
- Testy/CI: TST2-01 (nocne testy — zadziała po scaleniu do main), TST2-03…09; pozostałe NISKIE: LOG2-05, LOG-16, LIVE2-03 (naprawione
  przy LIVE2-01), LIVE2-04, X2-04, X2-05, DAT2-04 (= DAT-08), DAT2-05 (notatka dla testerów o powrocie do 1002).
- Wydajność: SEC2-07 (leniwe słowniki wskazówek).

**Backlog — przed App Store (pełny audyt wg zasady pkt 4):** SEC2-01 reszta (TRX, BOSU, Assault Bike, SkiErg — nazwy ćwiczeń katalogu),
SEC2-03 (research i długie cytaty → Dysk, przepisanie historii — termin: po wydaniu 1), SEC2-04 (test długości cytatów), SEC2-05 (nazwy w
komentarzach), SEC2-06 (licencje bibliotek natywnych), SEC2-08 (identyfikatory sesji w docs/audyt-0.10), N2 (GitHub Pages), MER2-10.

**Decyzja właściciela otwarta:** MER2-07 = SEC2-02 (nazwy źródeł w podpisie „Na podstawie: …” pod wskazówkami techniki).
