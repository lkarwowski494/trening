# 21. Roadmapa: funkcje offline i odróżnienie od Strong (research 07.10.2026)

Zlecenie właściciela 07.10.2026: „Co jeszcze możemy dodać do aplikacji w wersji offline? Zrób research. Chciałbym też bardziej odróżnić
appkę od Strong, bo teraz trochę ją przypomina.” Ten dokument to **propozycje do decyzji**, nie decyzje. Szacunki pracy są domysłem.

Źródła: spis funkcji z kodu (07.10, stan `main` 5a8bcc5), research webowy 07.10 (Strong i konkurencja, możliwości iOS 26, badania).
Twierdzenia merytoryczne (B1–B8) mają źródła przeczytane przez agenta researchu na poziomie streszczenia w PubMed albo pełnego tekstu
(zaznaczone). Zasada „Merytoryczne podstawy” (CLAUDE.md): **przed wdrożeniem funkcji z twierdzeniem dziedzinowym** cytat i miejsce w źródle
sprawdza się jeszcze raz i zapisuje w rejestrze decyzji. Czego nie przeczytano — oznaczone **[OTWARTE]**.

## 1. Dlaczego przypominamy Strong

Strong w 2026 (https://help.strongapp.io/article/229-my-first-workout, https://apps.apple.com/us/app/id464254577):
- trening = lista kart ćwiczeń z wierszami serii (numer, poprzednio, ciężar, powtórzenia, ✓), timer przerwy po odhaczeniu, „Finish”;
- szablony, historia, ćwiczenia z zakładkami historia/wykresy/rekordy, 1RM wzorem Brzyckiego;
- wymaga konta (Strong Cloud), za darmo 3 szablony; PRO 29,99 $/rok lub 99,99 $ dożywotnio; od 12.08.2026 Live Activity.

My mamy ten sam szkielet: 5 zakładek (Trening, Szablony, Ćwiczenia, Historia, Więcej), karty z wierszami serii i kolumną „Poprzednio”.
Ten układ ma też Hevy i większość rynku — to standard, nie cecha Strong. Różnimy się w szczegółach (miejsca i sprzęt, gumy, zamiana
z rankingiem, brak konta), ale **nie widać tego na pierwszym ekranie**.

## 2. Gdzie jest wolne miejsce (wnioski z przeglądu 13 aplikacji)

| Oś | Zajęte przez | Wolne? |
|---|---|---|
| Plan / mezocykl w centrum | RP Hypertrophy, Boostcamp, Liftosaur, MacroFactor Workouts | nie |
| Podpowiedź na każdą serię, generator, AI | Alpha Progression, Fitbod, SmartGym, MacroFactor | nie |
| Społeczność | Hevy, Caliber | nie (i wymaga serwera) |
| Wykresy w centrum | Setgraph | częściowo |
| **Skupienie na bieżącej serii, duże cyfry, jedna ręka** | początki: Liftosaur (v121, 09.2026), Boostcamp (podświetlenie) | **tak — nikt nie zrobił z tego wyróżnika** |
| **Sprzęt, miejsce, gumy jako oś** | częściowo MacroFactor (profile siłowni) | **w dużej mierze — to już mamy w kodzie** |
| Offline, bez konta | LiftLog, Benchmark, Alpha | coraz tłoczniej; wobec Strong wyraźna różnica |
| Pełny eksport **i import** (także ze Strong) | Hevy importuje CSV ze Strong | częściowo |

## 3. Kierunki odróżnienia — opcje

**A — „Tryb siłowni”: ekran treningu zbudowany wokół bieżącej serii** (rekomendacja)
- Na górze jedna duża karta „teraz”: ćwiczenie, seria 2/4, ciężar i powtórzenia wielkimi cyframi, jeden duży przycisk „Zrobione”, pod spodem
  przerwa. Reszta treningu zwinięta w listę poniżej (do przewinięcia, jak dziś). Czytelne z odległości, obsługa kciukiem.
- Plus: najmocniej zmienia pierwsze wrażenie; wolne miejsce na rynku; nie zmienia danych (zero migracji).
- Minus: duża zmiana nawyku — lekcja z docs/11 (przeprojektowania zbierają 1–2★) → przełącznik „widok: skupiony / lista” na start.
- Koszt (domysł): średni — 1–2 tygodnie z pełnym zakresem testów (docs/20) i nowymi scenariuszami E2E.

**B — „Twój sprzęt, Twoja siłownia”: miejsca i sprzęt na pierwszym planie**
- Ekran startowy pokazuje miejsce (Dom / Siłownia / Hotel) i co dziś da się zrobić; kalkulator talerzy z talerzy miejsca; gumy jako pełny typ obciążenia.
- Plus: wykorzystuje to, co już jest w kodzie i czego Strong nie ma.
- Minus: mniej widoczne dla kogoś, kto trenuje w jednym miejscu.
- Koszt: mały–średni (głównie ekran startowy i kalkulator talerzy).

**C — „Przejrzyste podstawy”: każda liczba z wyjaśnieniem i źródłem**
- Np. „serie w tygodniu na partię” ze znacznikiem i dopiskiem, skąd próg (ACSM 2026); e1RM z informacją, że to szacunek.
- Plus: spójne z zasadą „Merytoryczne podstawy”; wiarygodność. Minus: oś „naukowo” zajmują RP, MacroFactor, Alpha; mało widoczne na zrzutach.
- Koszt: mały na funkcję, ale każda wymaga weryfikacji źródła.

**Rekomendacja:** A jako twarz aplikacji + B jako treść (to, co już mamy, wyciągnięte na wierzch). C jako zasada pisania wszystkich
funkcji z liczbami, nie jako osobny kierunek. Do tego nowy wygląd (pkt 6).

## 4. Funkcje offline — katalog z kosztem

Stan z kodu 07.10: edycja historii, trening wstecz i zamiana ćwiczenia **są**. Brakuje m.in.: kalendarza, kalkulatora talerzy i rozgrzewki,
mapy mięśni, widżetu na ekran główny, pauzy, „pomiń dziś”, importu ze Strong/Hevy, pomiarów ciała, folderów szablonów, notatki ćwiczenia
widocznej w treningu (pole istnieje, ekran treningu go nie pokazuje), pola RIR (jest jedno pole RPE).

### 4a. Małe, wysoka wartość (dni)
| Funkcja | Uwagi | Twierdzenie dziedzinowe? |
|---|---|---|
| Notatka ćwiczenia widoczna w treningu | pole już jest | nie |
| Kalendarz w Historii (miesiąc, dni z treningiem) — **zrobione 07.10.2026** (feature/e2-swap) | | nie |
| Kalkulator talerzy (co nałożyć na stronę) | z talerzy miejsca — mamy dane | nie (arytmetyka) |
| Pomiń ćwiczenie dziś (bez usuwania z szablonu) — **zrobione 07.10.2026** (feature/e2-swap) | dziś tylko „usuń” | nie |
| Foldery / archiwum szablonów — **zrobione 07.10.2026** (feature/e2-swap) | | nie |
| Przyciski w Live Activity: „−15/+15 s”, „Pomiń przerwę” — **odłożone do wydania natywnego (4n)** | iOS: przyciski działają po odblokowaniu (Face ID) — https://developer.apple.com/documentation/widgetkit/adding-interactivity-to-widgets-and-live-activities | nie |
| Kontrolka w Centrum sterowania „Start przerwy / treningu” — **wydanie natywne (4n)** | https://developer.apple.com/documentation/widgetkit/creating-controls-to-perform-actions-across-the-system | nie |
| Widżet na ekran główny (serie w tygodniu / ostatni trening) — **odłożone do wydania natywnego (4n)** | rozszerzenie widżetu już jest | nie |

### Format CSV Stronga (eksport „Export Workouts”, plik właściciela przejrzany 07.10.2026; bez danych w repo)
- Ścieżka w Strong: ustawienia → „Data management” → „Export Workouts” („Export Measurements” — osobno, pomiary).
- UTF-8 bez BOM, przecinki, cudzysłowy przy tekstach. Kolumny: `Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE`.
- Wiersz = seria; trening = ta sama para (Date, Workout Name). Date `RRRR-MM-DD GG:MM:SS` bez strefy (czas lokalny telefonu). Duration: `52m`, `1h 5m`, `1h`.
- Set Order: liczba = seria robocza, `D` = drop, `F` = do upadku (inne pliki mogą mieć `W` — niesprawdzone); `Rest Timer` = osobny wiersz przerwy (Seconds = długość, reszta 0).
- Weight/Reps jako liczby z `.0`; **brak jednostki** w pliku. Ćwiczenia na czas: Seconds > 0, Reps 0. Distance i RPE w tym pliku zawsze puste/0.
- Nazwy ćwiczeń: standardowe Stronga po angielsku z dopiskiem sprzętu „(Barbell)”, „(Dumbbell)”… + własne użytkownika; dopasowanie po nazwie i zamianie
  dopisku (Barbell→sztanga, Dumbbell→hantle) objęło 33 ze 134 nazw (~48% serii).

### Import CSV z popularnych dzienników — zrobione 11.10.2026 (kod: `lib/csvparse.ts`, `lib/csvimport.ts`, ekran `app/more/import.tsx`)
Mapowanie oznaczeń z kodu na nazwy (nazwy tylko tu — wytyczne Apple 2.3.7): **formatA** = eksport Stronga (opis wyżej, plik właściciela 07.10.2026);
**formatB** = CSV zgodny z importem FitNotes; trzeci format (Hevy) — **[OTWARTE]**, nieobsługiwany.
- **formatA** — nagłówek dokładnie `Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE`.
  Źródło: przejrzany plik właściciela (07.10.2026, wyżej) i własny eksport aplikacji (`buildCsv`, ten sam układ — import własnego eksportu działa).
  **[OTWARTE]** oficjalna strona pomocy producenta nie została przeczytana (sam tytuł artykułu Hevy o imporcie CSV ze Strong:
  https://help.hevyapp.com/hc/en-us/articles/38001424401943 — serwer odrzuca pobranie, 403). Brak jednostki ciężaru w pliku → wybór na podglądzie.
  Jednostka dystansu w tym formacie nieznana (w pliku wzorcowym zawsze 0) — przyjęto metry jak w eksporcie aplikacji, podgląd to pokazuje.
  **Eksport własny przy lb (23.10.2026, test na telefonie 1030):** 12 kolumn bez zmian (zgodność), plus na końcu `Weight Unit` (lb) i `Distance Unit` (m) w każdym wierszu; w kg plik jak dotąd.
  Import własnego pliku z tymi kolumnami (jedna jednostka w całym pliku) przelicza ciężary i nie pyta o jednostkę; mieszane/nieznane → wybór na podglądzie.
- **formatB** — źródło: dokumentacja producenta FitNotes iOS, strona „Import Data to FitNotes iOS”, przeczytana 11.10.2026:
  https://www.getfitnotes.com/docs/migrate-from-other-apps.html — nagłówek „musi być dokładnie”: `Date`, `Exercise`, `Category`, `Weight (kg)`,
  `Weight (lbs)`, `Reps`, `Distance`, `Distance Unit`, `Time`, `Notes`, `Kind`; „Date must be in `YYYY-mm-dd` format”; waga w osobnych kolumnach kg / lbs
  (do 2 miejsc po przecinku); jednostki dystansu `m, km, cm, in, ft, yd, mi`; czas `HH:MM:ss` z możliwością pominięcia godzin (`23:59`); `Kind` = litery
  w, r, d, t; „if there is already a workout in the app database for a date in the CSV, it will be skipped” (duplikat po dniu — przyjęte też u nas).
  Strona https://www.getfitnotes.com/docs/migrate-from-android.html (przeczytana 11.10.2026): CSV z wersji Android da się zaimportować w iOS
  („The CSV can be imported the same way as the backup file”), ale **[OTWARTE]**: dokładny nagłówek eksportu z Androida nie jest tam podany —
  obsługujemy tylko nagłówek z opisu importu; inny nagłówek → komunikat „nieobsługiwany plik”, zero zmian.
- **Hevy — [OTWARTE]:** strony pomocy producenta (help.hevyapp.com) zwracają 403 przy pobraniu, a lista kolumn (`title, start_time, end_time, description,
  exercise_title, superset_id, exercise_notes, set_index, set_type, weight_lbs|weight_kg, reps, distance_miles|distance_km, duration_seconds, rpe`; data
  w stylu „5 Jan 2026, 17:00”) pochodzi tylko z opisów osób trzecich — nie jest źródłem wg CLAUDE.md. Do dodania po przeczytaniu dokumentacji
  producenta albo pliku testowego od właściciela.
- **Rozszerzenie 1.0 (25.10.2026, decyzja właściciela; kod: układ `generic` w `lib/csvgeneric.ts`, rdzeń `lib/csvcore.ts`):** każdy plik, który nie jest formatA ani formatB, a ma kolumnę daty i kolumnę ćwiczenia pod jednym z aliasów (`CSV_ALIASES`),
  jest czytany po aliasach nagłówków (separator `,` `;` tab, BOM, cudzysłowy, kg/lb po nagłówku, typy serii, czas z końca − startu, trening = dzień przy braku nazwy, superserie). Układ opisany w sekcji „Hevy — [OTWARTE]” wyżej mieści się w tych aliasach
  (`title, start_time, end_time, exercise_title, superset_id, set_index, set_type, weight_kg|weight_lbs, reps, distance_km|distance_miles, duration_seconds, rpe`; daty „5 Jan 2026, 17:00” obsługuje), ale **[OTWARTE]**: aliasy pochodzą ze specyfikacji właściciela, nie z przeczytanej dokumentacji producenta
  (strona pomocy zwraca 403) — obsługa nie jest „potwierdzona”, dopóki nie sprawdzi jej plik testowy od właściciela. Testy na danych syntetycznych: `tests/monetyzacja-csv.test.ts`.
- **Zasady importu (domyślne propozycje do akceptacji właściciela, każda widoczna/zmienialna na podglądzie):** (1) jednostka formatA — przełącznik kg/lb,
  domyślnie jednostka z Ustawień; formatB podaje jednostkę w kolumnach; (2) nazwy ćwiczeń: dokładne dopasowanie, potem znormalizowane (bez wielkości liter,
  spacji, nawiasów i znaków specjalnych; „(Barbell)” = „(sztanga)”, „(Dumbbell)” = „(hantle)”), reszta → nowe ćwiczenie użytkownika
  (sprzęt „inne”, metryka z danych); lista „Ćwiczenia z pliku” pozwala zmienić dopasowanie (istniejące z wyszukiwarki albo „Nowe ćwiczenie”);
  (3) duplikat = istniejący trening o tej samej minucie startu (plik bez godzin: ten sam dzień) — pomijany, liczba na podglądzie; (4) podgląd obowiązkowy
  (treningi, zakres dat, duplikaty, pominięte wiersze, dopasowane/nowe ćwiczenia) i „Importuj”/„Anuluj”.
- **Bezpieczeństwo danych:** błędny/obcy/pusty/za duży plik → komunikat, zero zmian; kandydat (kopia stanu + nowe wpisy) przechodzi przez `migrate`
  przed zapisem; kopia bezpieczeństwa w Plikach przed zapisem (ta sama pula co import kopii; nieudana → import przerwany); zapis jedną zmianą stanu,
  istniejące dane i trening w toku nietknięte; ten sam plik drugi raz = 0 nowych treningów i 0 nowych ćwiczeń. Limity w jednym miejscu
  (`IMPORT_*` w `lib/csvparse.ts`): 25 mln znaków, 400 tys. wierszy, rok ≥ 1990, ciężar ≤ 2000 kg, powtórzenia ≤ `REPS_MAX`. Bez zmiany schematu danych (18).
- Bez nowych funkcji poza zakresem: pomiary ciała, szablony i plany z plików nie są importowane.

### Priorytet (decyzja właściciela 08.10.2026)
- **Kalendarz z planowaniem treningów** — „sensowna forma kalendarza (może być też z planowaniem treningów)”. Dziś: kalendarz miesiąca w Historii
  (tylko przeszłe sesje). Do decyzji właściciela: miejsce w aplikacji, powtarzalny plan tygodnia vs pojedyncze wpisy, przypomnienia. Powiązania:
  tygodnie deload (już oznaczane), przyszły generator planu tygodnia. Bez twierdzeń dziedzinowych (planowanie = dane użytkownika).
  **Zrobione 08.10.2026:** zakładka Kalendarz, plan tygodnia, dwa tryby przesuwania, „Dziś” na ekranie treningu, propozycje z regeneracją partii
  (docs/research/23). Przypomnienie rano w dniu treningu — **zrobione 08.10.2026** (8:00, potwierdzone).
- **Deload A+B** (08.10.2026) — podpowiedź „zwykle co 4–6 tyg.” (praktyka) i mniej serii przy starcie w tygodniu deload. **Zrobione 08.10.2026.**
- **Generator szablonów i planu** (wariant A) i **kilka planów z aktywnym** (08.10.2026, docs/24). **Zrobione 08.10.2026.**
- **„Co nowego”** (08.10.2026) — „i” na ekranie Trening, kropka po aktualizacji, starsze wersje zwinięte. **Zrobione 08.10.2026.**

### Przed App Store (decyzja właściciela 11.10.2026, wariant A — po analizie raportów rynkowych, docs/research/raporty-rynkowe-2026-10.md)
- **Import historii z CSV popularnych dzienników** (Strong, Hevy; FitNotes z Androida — dodane 11.10.2026, pkt 13) — największa bariera przesiadki to utrata historii. Format Stronga niżej;
  **[OTWARTE]**: format Hevy (plik eksportu do przejrzenia jak przy Strongu), jednostka (CSV bez kg/lb), dopasowanie nazw ćwiczeń, duplikaty,
  podgląd przed zapisem. W aplikacji i w sklepie bez nazw innych aplikacji (Apple 2.3.7) — „z popularnych dzienników treningowych”.
- **Prośba o ocenę w sklepie** — systemowe okno iOS (SKStoreReviewController / expo-store-review), po pozytywnym zdarzeniu (np. nowy rekord
  albo kilka ukończonych treningów), nigdy w zamian za nagrodę (Apple 5.6.1/3.2.2). **[OTWARTE]**: dokładny moment i odstęp między prośbami.

### Figury v2 — uwagi ŚREDNIE/NISKIE z ponownej recenzji (27.10.2026), wersja 1.0.1 (nie blokują 1.0)
Źródło: ponowne recenzje 1.0 (squat/bench, hinge) na gałęzi `przekazanie-konta`, `docs/przekazanie/notatki/recenzje-1-1/ponowne/`. Oceny realności: realne, ale niskiej szkody (obraz, nie dane ani zdrowie).
- **Squat/bench:** Overhead Squat i One-Arm OH Kettlebell Squat — bark 183–198° względem tułowia (A); Board Press i Pin Press bez deski i bolców (A); Band Squat — guma do wyciągniętych rąk (B); wąski chwyt (4 ćwiczenia + Close Grip BP) — przedramię 50° czołowo, chwyt węższy od barków (B); JM Press 152° i Skull Crusher 154° przy limicie kontraktu 149° (C); trzy warianty ławki ujemnej z przedramieniem 12–13° od pionu w płaszczyźnie strzałkowej, decyzja 26.10 mówi ±10° (D); brak polskiego tekstu `bp.elbowsMid` (karty Decline, Smith, Chains, Reverse Band bez wskazówki o łokciach).
- **Hinge:** tor ciężaru w kształcie „S” przy kolanach w 9 pozostałych klasycznych martwych ciągach (sztanga max +7 cm przed środkiem stopy; U1 — poprawiony tylko Deadlift (hantle)); Rack Pull (i with Bands) — start +6,3 cm i „hak” toru (U2); brak stojaka/bolców: Rack Pull, Rack Pull with Bands, Good Morning off Pins (A); trap bar / Leverage / Rickshaw — tułów −6,4° na górze (U4); widok z przodu: tor w osi ciała przy hantlach po bokach (U5); Cable Pull Through — kolano 41,5° i tułów 30° na dole, bliżej półprzysiadu niż zawiasu (U6).

**Stan 28.10.2026 (gałąź `r2/figury-v2`, wymaga recenzji niezależnej bramki 4; statusy „gotowe” bez zmian):** zrobione z testem `tests/figury-1-0-1-uwagi.test.ts` — wąski chwyt (chwyt ±18 przy barkach ±20,5, przedramię pionowo), JM Press 147° i Skull Crusher 148° (≤ 149°), ławka ujemna (przedramię ≤ 10° także strzałkowo; dotyk 26/24 cm), deska (Board Press) i bolce (Pin Press), stojak z bolcami (Rack Pull, with Bands, Good Morning off Pins), Band Squat (dwie gumy do dłoni przy barkach), trap bar / Leverage / Rickshaw (tułów na wyproście 1,4°), Cable Pull Through (kolano 24°, tułów 61°), zaczepy stałe (guma „Reverse” w 5 ćwiczeniach, bloczek Cable Deadlift), ślad toru przy hantlu. Tor „S” w 9 martwych ciągach i start Rack Pull (+5,2 cm, bez „haka”) — naprawione wcześniej w 9883ada. **Otwarte (decyzja z opcjami):** Overhead Squat i One-Arm OH KB (bark 183–198° przy limicie 171°: zostaje wyjątek, albo ręce pochylone w przód kosztem „gryf nad śródstopiem”), sumo tor ukośny 6–8 cm (zostaje, albo start 4 cm przed środkiem stopy), RDL ramiona 23° od pionu (efekt kolan ≤ 27° przy tułowiu 60°), brak polskiego tekstu `bp.elbowsMid` (tłumacz).

**Recenzja niezależna 28.10.2026 (audytor, sesja 1.0.1) — poprawione w tej samej gałęzi:** stojak z bolcami wewnątrz talerzy (F2), dolne zaczepy gum sztangi stałe (F3: Band Bench Press, Deadlift/Sumo/Rack Pull with Bands, przysiady), guma Band Squat między kolanami bez przenikania uda (N5), deska Board Press widoczna z góry (N2). **F1 (JM Press, Decline Close-Grip Bench To Skull Crusher) — poprawione 28.10.2026 wg badacza:** JM Press — łokcie wysoko, ramię ku stopom, odwiedzenie stałe 45°, sztanga ku szyi; Skull Crusher — figura pokazuje tylko fazę prostowania z nieruchomym ramieniem (uproszczenie, recenzja r2 28.10.2026: dwie fazy na jednej osi u dawały w pętli ping-pong 2 wyciskania na 1 prostowanie; wariant z cykliczną osią czasu i nazwami faz — 1.1, wymaga zmian w `anim.ts`, `ExerciseFigureV2.tsx` i nowych podpisów pozycji statycznych we wszystkich językach); zestaw karty bez `skull.upperArm`/`skull.depth` (decyzja 1a z 28.10.2026); JM Press — dłonie stałe na gryfie, ramię na dole ok. 34° ku stopom (badacz: 0–20° przy ślizgających się dłoniach); skrót rodzin v2 obejmuje teraz też draw/scene/skeleton/math/anim/errors/figure (R2-6); nowe wskazówki kart `jm.elbows` i `dcgsk.elbows` we wszystkich językach (do recenzji lokalizacji). Otwarte (badacz): kąt łokcia na dole JM, ramię w fazie prostowania względem podłogi czy tułowia, drugie źródło fazy wyciskania. **Backlog 1.0.1 (NISKIE, wersja 1.0.1 → 1.1 przy zmianie rigu):** N1 wąski chwyt — przedramię strzałkowo do 34° w połowie ruchu (skutek łokci przy tułowiu); N3 Good Morning off Pins — bolce na 128 cm, ruch gryfu 8 cm (płytki zawias „dzień dobry”, zgodny z gm.depth); N6 trap bar / Leverage / Rickshaw — kolano 10,3° na wyproście (inne martwe ciągi ok. 5°); Band Squat — łokcie szeroko (odwiedzenie 34–47°); Overhead Squat / One-Arm OH KB (bark 183–198°, wyjątek uzasadniony), sumo tor ukośny 8 cm i RDL ramiona 23° od pionu (opcje w raporcie programisty: zostaje albo zmiana rigu); chain: dolny koniec łańcucha sztangi nadal jedzie z gryfem (ta sama klasa co F3, nie objęta).

### Backlog 1.0.1 — przekład (recenzja Z-02, 27.10.2026)
- **Stan 28.10.2026 (r2/teksty):** wykonane (część weszła już w starej 1.0.1: lt, cs/sk, id, el NSHealth): de „Apple Account”, el „Με το Pro δεν υπάρχει όριο”, es-419 „Entrenamiento” (słownik + zakaz „entreno(s)”, test `tests/lokalizacja-1-0-1.test.ts`). Scalenie main ↔ stara 1.0.1 sprawdzone: zostaje wersja z main (da/nb „en spotter”, id „Gerakan”, sr „кг/фнт”, el „Θα τη βρείτε”).
- Poprawki nieblokujące z recenzji lokalizacji (`docs/przekazanie/notatki/audyt-1-0/Z02-recenzja-lokalizacji.md` na gałęzi `przekazanie-konta`): de „Apple-Account” → „Apple Account” (do sprawdzenia przez native speakera); el „Το Pro αίρει το όριο” → „Με το Pro δεν υπάρχει όριο” oraz okno zgody Zdrowia (NSHealth*) na „σας”; lt „nepadarysi” → „nepadarysite” i „pakeistum” → „pakeistumėte”; cs/sk „máš” → „máte” (2 klucze w każdym języku); id zgoda Zdrowia zegarka „perangkatmu” → „perangkat Anda”; słownik: es-419 „trening” → „Entrenamiento”, zakazane „entreno” (najpierw sprawdzić 4 wystąpienia; wpis z testem).

### Backlog 1.0.1 — angielskie teksty źródłowe (przegląd tłumaczeń przez API, 28.10.2026)
- **Stan 28.10.2026 (r2/teksty):** wykonane: „Want to train more often?…”, „Awesome, I'll keep training!”, „Clear place” (+ selektory Maestro 13, 56 i testy), „General (for health and fitness)” (Maestro 14), spójnie secondary/compound/isolation. Nie zmienione, wymagają recenzji karty: `calf.edge` (propozycja EN: „Put the balls of your feet on a raised edge (step or plate), heels hanging off.” — PL ma „na podwyższeniu”) i `bike.foot` (propozycja EN: „Pedal with the front part of your foot.” — bez „just behind the toes”, którego nie ma w PL; dopisek do PL tylko po 2 zgodnych źródłach).
- Uwagi ŚREDNIE/NISKIE do en (raport batcha msgbatch_01CVC1PzCUxnhgZPrJQnHzJZ, opis w docs/16 sekcja 28.10.2026): „Want more? Pro removes…” → „Want to train more often?…”; „Awesome, keep training!” → 1. osoba jak w PL; „Remove place” → „Clear place” (myli się z usunięciem miejsca); „General fitness (for health)” bez „i sprawności”; „Supporting muscles” / „multi-joint” / „assisting” → spójnie „secondary”, „compound/isolation”; wskazówki `calf.edge` (bez „na podwyższeniu”) i `bike.foot` (dopisek „just behind the toes”, którego nie ma w PL) — zmiana wskazówek wymaga recenzji karty (zasada 27.10.2026). Dotyka scenariuszy Maestro 13 i 56 oraz testów selektorów — zmiana z przebiegiem E2E.
### Backlog 1.0.1 — figury: czwarta pozycja w silniku v1 (decyzja właściciela 28.10.2026)
- Rysunki ukryte w 1.0 (wskazówki tekstowe zostają), naprawa przez czwartą pozycję w silniku v1 (typ `FrameName`, `FRAME_ORDER` w `scripts/figures/gen.mjs`, podpisy klatek, układ statycznych klatek w `ExerciseFigure.tsx`, testy i selektory Maestro `exercise-figure-frame-*`): **Push Press**, **Reverse Lunge** (zamach tylnej stopy łukiem w powietrzu; reguła podparcia w `tests/figury-podparcie.test.ts` pilnuje, że wraca dopiero po poprawce), **krok drugą nogą w Walking Lunges** (dziś pętla wraca do pozycji wyjściowej). Każda po niezależnej recenzji (bramka 4).

- **Pendlay Row** (ukryty w 1.0 decyzją właściciela 28.10.2026 — inny powód niż czwarta pozycja: figura nie ma cechy rozpoznawczej, `docs/research/28-figury.md`): źródła cech Pendlay Row (start z podłogi w każdym powtórzeniu, tułów równolegle do podłogi) — 2 przeczytane źródła szczebla 4, nowa figura (nie kopia wiosłowania sztangą w opadzie), niezależna recenzja bramki 4; wersja 1.0.1 (M1-audytor-generalny-047).

### Backlog 1.0.1 — katalog ćwiczeń: drugie źródło opisu (decyzja właściciela 28.10.2026, M2-koordynator-napraw-003)
- **Standing Gastrocnemius Calf Stretch** — **Wersja:** 1.0.1 (linia 1.1). **Zakres:** opis w katalogu („pięta na stopniu, kolano proste”, sprzęt: skrzynia, mięśnie dwugłowe uda 0,25) ma jedno źródło, a niezależne źródła pod tą nazwą opisują wariant przy ścianie (duplikat Wall Calf Stretch). Przedefiniować na wariant na stopniu z 2 przeczytanymi źródłami szczebla 4 opisującymi ten sam wariant albo zmienić definicję; bez udziału mięśni dwugłowych uda bez podstawy; tłumaczenia i recenzja niezależna (bramka 4). W 1.0 opis zostaje bez zmian. Decyzja: `docs/18`, wpis z 28.10.2026 „003 → 1.0.1”. **Stan 28.10.2026 (gałąź `r2/gastro`): zrobione** — mięśnie bez dwugłowych uda, źródła L3-S36…S39 („mocne”), 4 zdania karty we wszystkich językach (zestaw ogólny rozciągania; pokaże się po figurze v2 i recenzji niezależnej), poprawka przypisu `calf.step`; sprzęt bez zmian (wariant A, wpis w docs/18). **Otwarte (nowe):** (1) scalenie „Standing Hamstring and Calf Stretch” (skłon z prostą nogą przednią, rozciąga dwugłowe uda i łydkę) w ten wpis przestało pasować — opcje: (a) zostawić scalenie (historia zachowana, ćwiczenie opisuje tylko łydkę), (b) odtworzyć „Standing Hamstring and Calf Stretch” jako osobne ćwiczenie z migracją wpisów historii (rekomendacja po wydaniu 1.0, bo zmienia dane i schemat), (c) usunąć scalenie bez odtwarzania; (2) czas przytrzymania — źródło szczebla 2 do przeczytania (ACSM, tabela 5.6 Guidelines 11. wyd. albo przegląd systematyczny); (3) niezależna recenzja kart (bramka 4) przed pokazaniem zestawu.

### Backlog 1.0.1 — tory ruchu „do oceny” (skan torów 28.10.2026; decyzja właściciela 28.10.2026, wariant A)
- **14 torów z wyjątkiem strażnika** (`tests/tor-wyjatki.json`: Goblet, Dumbbell, Cable, Landmine, Zercher, Sumo (hantel), Barbell Hack Squat, przysiady z pasem, z gumą i bez ciężaru, RDL z hantlami, Single Leg RDL (hantel), Cable Pull Through) — **Wersja:** 1.0.1. **Zakres:** niezależna recenzja ruchu każdego śladu (bramka 4); błąd → poprawka rigu i usunięcie wyjątku (lista tylko maleje, pilnuje `tests/figures-v2-tor.test.ts`), ruch zamierzony po łuku → powód zostaje. W 1.0 bez zmian (poza zakresem naprawy przed 1.0 wybranym przez właściciela).
- **Uwagi NISKIE z recenzji niezależnej po naprawie torów (28.10.2026)** — **Wersja:** 1.0.1. **Zakres:** (1) sumo ×4 i sumo z kettlebellem: tor gładki, ale ukośny w przód o 6–8 cm — sprawdzić położenie nad środkiem stopy na wyproście; (2) zaczepy jadą z ciężarem: górny zaczep gumy w Reverse Band Deadlift i Reverse Band Sumo (3,4 i 8 cm), bloczek przy podłodze w Cable Deadlift (3,7 cm) — zaczep stały jak szyna Smitha, z testem w `tests/figures-v2-tor.test.ts`; (3) RDL i martwy na prostych nogach na dole (u 1): ramiona odchylone w przód od pionu (stan sprzed naprawy). Smith Stiff-Legged: gryf do 6 cm przed goleniami na dole — poprawne dla pionowej szyny, bez zmian.

### Backlog 1.0.1 — karta RDL: błąd „kolana jak w przysiadzie” podpisany zdaniem poprawnej techniki (znalezisko sesji katalogu 1.1, 28.10.2026; ŚREDNIE)
- **Opis błędu dla `kneesBent`** — **Wersja:** 1.0.1. **Zakres:** błąd figury `kneesBent` (`lib/figures/v2/errors.ts`) ma wskazówkę `rdl.knees` („Kolana tylko lekko ugięte — to nie przysiad.”) — zdanie poprawne, ale przy rzędzie błędu stoi korekta zamiast opisu błędu (inne błędy: `mis.*`). Nowy tekst opisu błędu (np. „kolana ugięte jak w przysiadzie”) we wszystkich językach, tłumacz + recenzja lokalizacji, recenzja karty (bramka 4); test: każdy błąd figury wskazuje tekst z rodziny opisów błędów. Ocena: realny, nie błędne twierdzenie — nie blokuje 1.0 (próg wydania, CLAUDE.md).

### Backlog 1.0.1 — Reverse Lunge: ślizg i zakres biodra (recenzja niezależna 29.10.2026, otwarte)
- **Reverse Lunge** zostaje ukryty: palce tylnej stopy suną 2,5 j. (start→mid) i ok. 12–15 j. wg pomiaru recenzenta przed oderwaniem, po lądowaniu dryf ponad 2 j., a wyprost biodra tylnej nogi w „W trakcie 2” ok. −20° przekracza granicę −17°. Przeszukanie kątów (kilkaset tysięcy prób, 4 klatki) nie dało pozy spełniającej wszystkie progi naraz — wymaga innej konstrukcji ruchu (np. piąta pozycja albo inny tor stopy). Testy odtwarzające w `tests/figury-podparcie.test.ts` są `test.failing` — po poprawce zamienić na zwykłe `test`.

### Backlog 1.0.1 — figury v1: uwagi NISKIE z recenzji niezależnej po poprawce (28.10.2026)
- **Step Up:** ręce z hantlami biegną wzdłuż pochylonego tułowia (w „w trakcie” hantla 19 j. za barkiem) — zgięcie barku równe pochyleniu tułowia; palce tylnej stopy mijają krawędź skrzyni o 0,9 j. przy k≈0,24; reguła środka ciężkości w teście ma uwzględniać ciężar w dłoniach. **Lunges (hantle):** tylna stopa pionowo na palcach w „w trakcie”, przednia stopa przesuwa się o 2,1 j. — **odłożone (29.10.2026)**: tylna stopa ≤ 72° i dryf ≤ 1 j. wykluczają się z regresją „ślizg stopy ≤ 2 j.” (przy −72° ślizg ok. 4,6 j.); poza przywrócona, opcja na później: piąta pozycja tylko dla tego ćwiczenia. **Incline Push Up:** dłoń przesuwa się po blacie o 3,2 j., dłonie ok. 7 j. od krawędzi (karta: „o krawędź”). Raporty: katalog audytu M1-2026-10-27, role/06-tresci/fix-2026-10-28-figury/.
  - **Stan 29.10.2026 (linia 1.0.1, recenzja niezależna r1–r2):** Step Up, Lunges (hantle), Walking Lunges (krok drugą nogą), Push Press (czwarta pozycja) — poprawione i zatwierdzone („wyswietlana”). **Incline Push Up** — dane z 1.0 bez zmian (decyzja koordynatora A, do weta właściciela): poprawka dłoni wymusiła ślizg stóp 3,6 j., uwaga NISKA o dłoni (3,2 j. po blacie, ok. 7 j. od krawędzi) zostaje; test w tests/figury-podparcie.test.ts jako `test.failing`. **Reverse Lunge** — dalej ukryty (ślizg i zakres biodra nie do pogodzenia w 4 pozycjach; opcje: piąta pozycja albo prostszy ruch bez łuku — rekomendacja: prostszy ruch). Test siatki 2×2: bez sprawdzenia szerokości komórki (NISKIE).

### Backlog 1.0.1 — wygląd (plan napraw M2, 28.10.2026)
- **Migracja literałów `fontSize`/`borderRadius` na tokeny** (M1-audytor-generalny-030; 08-programista-006, 04-studio-projektowe-008): `components/Dashboard.tsx`, `components/GuardSection.tsx`, `ProgressBars`, `PeriodSummary`, `RecordsCard`, `app/plan.tsx` i stary krój `F.heavy` — w 1.0.1 z porównaniem zrzutów (`docs/design/wzorce-zrzuty/`), nie przed 1.0 (zamrożenie zakresu, ryzyko regresji układu); zapadka `tests/token-baseline.json` / `tests/m3-token-guard.test.ts` pilnuje, żeby liczba nie rosła.

### Backlog 1.0.1 — podatność zależności decode-uri-component (npm audit, 28.10.2026)
- **Znalezisko:** `npm audit` — decode-uri-component <= 0.4.2 (GHSA-vcc3-ghjq-m6fr, DoS: wykładnicze dekodowanie zniekształconego %-kodowania, ważność „moderate”). W aplikacji wersja 0.2.2 wchodzi wyłącznie przez `query-string` 7.1.3 → `expo-router` (parsowanie linku do aplikacji, schemat `trening://`). **Ocena realności: brzegowy** — kroki: ktoś dotyka spreparowanego linku `trening://progress?s=…%E0%A4%A…` (bardzo długiego); skutek: chwilowe zawieszenie aplikacji (pomiar na 0.2.2: 50 tys. powtórzeń = ok. 2 s), bez utraty danych, bez sieci i bez wykonania kodu. Bez wpływu na prywatność ani dane — nie blokuje wydania (próg audytów, pkt 1).
- **Próba naprawy `overrides` na 0.5.1 (28.10.2026) — nieudana, cofnięta.** Wersje poprawione (0.5.x) są modułem ESM (`export default`, `type: module`), a `query-string` 7 jest CommonJS (`require('decode-uri-component')`): `require` zwraca przestrzeń nazw zamiast funkcji (`decodeComponent is not a function` w samym Node), a Jest nie wczytuje pliku („Unexpected token 'export'”) — przy override padłaby cała aplikacja i wszystkie testy ekranowe. Wniosek: wystarczy tylko nowy `query-string` (>= 9, ESM) razem z routerem, czyli **aktualizacja SDK** (`npm audit` wskazuje `expo-router` 58.x). Nie łączymy z aktualizacją zależności w 1.0.1.
- **Zapadka:** `tests/sec-link-z-parametrami.test.tsx` (parser linków i otwarcie ekranu z poprawnym oraz spreparowanym parametrem `%E0%A4%A`); ma przejść po każdej zmianie wersji tej zależności. **Wersja naprawy:** z aktualizacją SDK (1.1+). Ryzyko akceptowane do tego czasu.

### Backlog 1.0.1 — decyzje DEC-01 a i DEC-04 a (audyt M1, właściciel 23.10.2026; M1-audytor-generalny-009, 04-studio-projektowe-003)
Odesłanie z wpisu DEC-07 w `docs/18` („1.0.1: podgląd liczb i krok importu — docs/21”); pilnuje `tests/dec07-odeslanie-docs21.test.ts`.
- **Podgląd liczb po przytrzymaniu** [wdrożone w gałęzi 1.0.1, 28.10.2026 — do E2E po 1.0] (DEC-01 a; wzorzec: `docs/32` nr 32, komponent `components/FullValue.tsx`, test `tests/dec01a-podglad-liczb.test.tsx`, scenariusz `.maestro/58-duzy-tekst.yaml`, przepływ US-22; kontrola na telefonie: przytrzymanie pola przy dużym tekście pokazuje podgląd systemowy — Large Content Viewer, czy jest domyślnie włączony — **[OTWARTE]**); skala tekstu do 200% w DEC-10 wchodzi przed 1.0, kalendarz rośnie do progu 130%) — **Wersja:** 1.0.1. **Zakres:** przy dużej skali tekstu liczba przycięta w ciasnym polu (ciężar, powtórzenia, zestawienia) pokazuje się w całości po przytrzymaniu, bez zmiany układu ekranu; wzorzec interakcji najpierw w `docs/32`, test ekranowy i scenariusz Maestro wg `docs/20`. Decyzja: `docs/18`, sekcja „23.10.2026 — decyzje właściciela po audycie generalnym M1”.
- **Krok „zaimportuj historię” w Pierwszych krokach** [wdrożone w gałęzi 1.0.1, 28.10.2026 — do E2E po 1.0] (DEC-04 a; test `tests/dec04a-import-w-pierwszych-krokach.test.tsx`, scenariusz `.maestro/31-pierwszy-tydzien.yaml`, przepływ NU-15, BRD BR-POM-001; tekst kroku czeka na przekład na 33 języki w `docs/lokalizacja/zestaw-przekladu-2026-10-23.json`) — **Wersja:** 1.0.1. **Zakres:** w Pierwszych krokach dodatkowy krok prowadzący do istniejącego importu CSV (`app/more/import.tsx`, opis wyżej); tylko wejście do importu, bez zmian w samym imporcie ani formatach; nowy ekran lub przepływ wymaga scenariusza w `tests/przeplywy.json`.

### Backlog 1.1 — architektura (plan napraw M2, 28.10.2026)
- **Podział plików źródłowych ponad 20 KB** (M1-audytor-generalny-035; 05-architekt-004): `lib/seed.ts`, `lib/plan.ts`, `lib/generator.ts`, `lib/equipment.ts`, `lib/stats.ts`, `components/ActiveWorkout.tsx`, `lib/edit.ts`, `components/WorkoutBlocks.tsx`, `app/template/[id].tsx`, `components/ui.tsx`, `lib/state/migrate.ts` i inne z listy wyjątków `tests/architecture-limits.test.ts` — dzielone przy najbliższej zmianie danego pliku w 1.1 (nie przed 1.0: zamrożenie zakresu, ryzyko regresji); nowy plik ponad limit już dziś blokuje verify (strażnik z listą wyjątków).

### Backlog z audytu M1 — DEC-07 b (właściciel 27.10.2026: „wybrane przed zgłoszeniem 1.0”, reszta tutaj z wersją)
Zadanie M1-audytor-generalny-037; do 1.0 weszły: wiersz „Pełna wersja”, dokumenty wydania, test pierwszego użycia, zrzuty we wszystkich lokalizacjach (docs/18, wpis DEC-07 b). Wersje i warunki to propozycja roli 03 z rekomendacji znalezisk — do weta właściciela. Punkt kontrolny = 8 tygodni po premierze (docs/48 Z-35, `docs/monetyzacja.md`).
- **Dwa widoki treningu (Skupiony i Lista)** (03-zakres-006) — **Wersja:** 1.1, decyzja w punkcie kontrolnym. **Warunek:** do punktu kontrolnego bez zmian, zbieramy sygnały (wsparcie, recenzje, test pierwszego użycia Z-37); potem właściciel wybiera: usunięcie widoku Lista (migracja ustawienia na Skupiony, dane treningów bez zmian, zdanie w „Co nowego”) albo zostawienie na stałe.
- **Kalkulator talerzy** (03-zakres-007; wycięty decyzją DEC-06) — **Wersja:** 1.1, tylko po spełnieniu warunku. **Powrót:** co najmniej 3 niezależne prośby o kalkulator w wsparciu albo recenzjach w ciągu 8 tygodni od premiery; przegląd w punkcie kontrolnym. Forma przy powrocie: przycisk przy bieżącej serii, poza zrzutami do sklepu (powód cięcia z DEC-06).
- **Kanały startu poza wyszukiwaniem w sklepie** (11-wzrost-002) — **Wersja:** 1.0.x, po premierze, przed punktem kontrolnym. **Kiedy:** agent marketingu szkicuje prośbę o pisemną zgodę administracji forum (jawnie jako autor, forma: wątek autora), właściciel wysyła (ok. 15 min), wynik w dzienniku zgód `docs/wzrost.md` pkt 3; zasady DEC-02 a i DEC-07 K5 bez zmian.
- **Linki kampanii do strony produktu** (11-wzrost-004) — **Wersja:** 1.0.x. **Kiedy:** po pojawieniu się zakładki kampanii w App Analytics właściciel kopiuje `pt`, agent dodaje linki z `ct` na kanał (strona marki, strony Trening, wpis forum po zgodzie) i tabelę linków w `docs/wzrost.md` z testem; do tego czasu źródło „Web Referrer”.
- **Pomiar skarg na limit darmowych dni** (02-monetyzacja-005) — **Wersja:** 1.0.x, punkt kontrolny. **Kiedy:** przed punktem kontrolnym dopisać do sekcji „Punkt kontrolny” w `docs/monetyzacja.md` dwie miary z progiem przeglądu: udział ocen ≤ 3★ wspominających limit lub opłatę oraz odsetek osób wracających w kolejnym miesiącu po pierwszej blokadzie (App Analytics); zmiana limitu tylko decyzją właściciela po danych.
- **Kontrola cen we wszystkich krajach w `asc-kontrola`** (02-monetyzacja-506, opcja b) — **Wersja:** 1.0.x. **Warunek:** po ręcznym sprawdzeniu Z-10b przed 1.0; rozszerzenie narzędzia (repo narzędzi) o wszystkie terytoria i próg 1,51 € po kursie, z przebiegiem dowodowym.

### Backlog bez priorytetu (decyzja właściciela 08.10.2026)
Wrócimy za jakiś czas; w rozmowie wymieniane tylko zbiorczo, dopóki właściciel nie poprosi o listę (CLAUDE.md).
- Wydanie natywne — sekcja 4n niżej (przyciski przerwy na ekranie blokady, widżet, kontrolka w Centrum sterowania).
- Wydanie Health — biblioteka `@kingstinct/react-native-healthkit` 8 → 16: odczyt aktywnych kcal, ocena wysiłku (`workoutEffortScore`; RPE → ocena **[OTWARTE]**),
  prawdziwe zdarzenia pauzy z `Workout.pauses`, masa ciała i pomiary ciała.
- Import CSV ze Strong i Hevy — **przeniesione do „Przed App Store” (11.10.2026)**, sekcja niżej.
- „Skąd to wiemy?” (dodane 13.10.2026, odłożone przez właściciela do backlogu bez priorytetu): przy każdej liczbie i regule merytorycznej
  przycisk ze źródłem, poziomem pewności i krótkim cytatem (25 miejsc w kodzie; jeden rejestr źródeł generowany z kodu). Specyfikacja: scratchpad
  koordynatora `spec-zrodla-i-glos.md` (część A) — do przeniesienia do docs przy wznowieniu. Także sposób pokazania cytatów w 35 językach — **[OTWARTE]**.
- Nagranie siebie podczas ćwiczenia i ocena AI poprawności ruchu (dodane 08.10.2026). Przed pracą **[OTWARTE]**: źródła dla kryteriów techniki
  i dokładności oceny z obrazu (w 4c „liczenie powtórzeń kamerą” odłożone z braku udokumentowanej dokładności); granica porad zdrowotnych
  (ból, kontuzje → specjalista); prywatność nagrań (tylko na telefonie?); koszt modelu (0 zł poza Apple).
- Znajomi i wyzwania w grupie (dodane 08.10.2026, właściciel: „sparowanie z kolegami i rzucanie sobie wyzwań w grupie, jak tablica wyników
  na siłowni”). Przed pracą **[OTWARTE]**: aplikacja jest dziś offline, bez kont i serwera — potrzebny serwer albo synchronizacja (koszt: zasada 0 zł
  poza Apple; darmowe limity do sprawdzenia, np. iCloud/CloudKit w ramach Apple Developer); prywatność (dane treningowe innych osób, zgoda, RODO);
  zasady porównań, które nie nagradzają ryzyka (np. wyzwania na regularność / liczbę treningów zamiast samego ciężaru); moderacja zaproszeń.
  Pomysł właściciela (08.10.2026, **nie decyzja — tylko zapis do odkopania**): grupa jak w Organizerze — stałe ID grupy (9 cyfr, zmienia właściciel), zaproszenie kodem 6 cyfr ważnym 24 h dla wielu
  osób z limitem nieudanych prób, link https (GitHub Pages + Universal Links), role właściciel/admin/członek, usuwanie grupy do kosza na 30 dni —
  wzór: organizer `docs/adr/0020-id-grupy-i-kod.md`, `0007-grupy-i-wydarzenia.md`, `0004-zaproszenia-i-usuwanie-konta.md`. Organizer ma backend Supabase
  (plan Free); **[OTWARTE]**: wspólny projekt Supabase z Organizerem czy osobny (limity planu Free na projekt), konta i logowanie w Treningu (dziś brak),
  co z danych treningowych trafia do grupy (tylko wyniki wyzwań, nie cała historia).
- Układanie treningów według preferencji i celu (dodane 08.10.2026). Przed pracą **[OTWARTE]**: koliduje z decyzją 03.10.2026 („szablony ustawia
  właściciel — aplikacja ich nie tworzy”) — wymaga nowej decyzji właściciela; zasady układania tylko ze źródeł (ACSM 2026, przeglądy) wg hierarchii.
- Generator dokładający ćwiczenia do celu (decyzja właściciela 13.10.2026, 7A) — **wersja: po 0.17**, osobna zmiana (nie wchodzi do paczki „spójność”). Zakres i źródła do ustalenia przy starcie prac (reguły tylko ze źródeł wg hierarchii; wynik do przejrzenia przed zapisem — wyjątek z 08.10.2026).

### 4n. Wydanie natywne — po najbliższej wersji (decyzja właściciela 07.10.2026 wieczór)
Funkcje, których działania agent nie sprawdzi testami automatycznymi (Maestro na symulatorze nie steruje ekranem blokady ani ekranem
głównym iOS): wchodzą osobnym buildem, jak wydanie „Health”, po sprawdzeniu przez właściciela na telefonie.
| Funkcja | Stan | Co sprawdzić na telefonie |
|---|---|---|
| Przyciski przerwy −15 / +15 / Pomiń (Live Activity, iOS 17+) | gotowe w commicie 2e08c84 (`feature/e2-swap`), cofnięte | przyciski zmieniają licznik i powiadomienie; aplikacja po powrocie pokazuje ten sam czas |
| Widżet „Tydzień treningów” | gotowe w commicie df53ab9 (`feature/e2-swap`), cofnięte | dodanie widżetu, liczby po treningu, zera po końcu tygodnia; grupa aplikacji `group.pl.lukasz.trening` musi dać się podpisać (może wymagać kroku w Apple Developer) |
| Kontrolka w Centrum sterowania | niezaczęte | — |

Kompilacja bez podpisu (`ios-unsigned.yml`, 07.10.2026): przyciski — run 37658510716 (2e08c84) OK; widżet z przyciskami — run 37660845798
(df53ab9) OK. Działanie na telefonie i podpis z grupą aplikacji — niesprawdzone.

Przywrócenie: `git revert` commitu odwracającego (zapis w docs/18, 07.10 ok. 19:45), potem `npm run verify` i `ios-unsigned.yml`.

### 4b. Średnie (1–2 tygodnie)
| Funkcja | Uwagi | Twierdzenie dziedzinowe? |
|---|---|---|
| Import CSV ze Strong i Hevy — **odłożony (07.10.2026)**; format Stronga niżej | Strong nie importuje nawet własnego CSV; Hevy importuje ze Strong — https://help.hevyapp.com/hc/en-us/articles/38001424401943 | nie |
| Pole RIR obok RPE — **zrobione 08.10.2026** (skala RPE/RIR w ustawieniach) | skala: RPE 10 = 0 RIR, RPE 9 = 1 RIR (Zourdos 2016, streszczenie: https://pubmed.ncbi.nlm.nih.gov/26049792/) | tak — B1 |
| Kalkulator rozgrzewki | schemat ustawia użytkownik albo nazwany „przykładem” | **[OTWARTE]** — brak źródła schematu |
| Pomiary ciała + odczyt masy ciała z Apple Health | wymaga aktualizacji `@kingstinct/react-native-healthkit` 8 → 16 (osobne wydanie, nie razem ze zmianą schematu — CLAUDE.md) | siła względna = arytmetyka |
| Raport tygodnia / miesiąca (podsumowanie po treningu i okresowe) — **zrobione 08.10.2026** (Postępy → Podsumowanie) | | nie, jeśli tylko liczby użytkownika |
| Mapa mięśni (rysunek z seriami na partię) — **zrobione 08.10.2026** (Postępy → Podsumowanie) | dane mamy; potrzebna grafika SVG | nie |
| Pauza treningu — **zrobione 08.10.2026** (odejmuje się od czasu trwania) | do decyzji: czy pauza odejmuje czas trwania | nie |

### 4c. Duże (tygodnie) — później
| Funkcja | Uwagi |
|---|---|
| Siri / Skróty / Spotlight (App Intents) | intencje w Swift, `@bacons/apple-targets` już w projekcie — https://developer.apple.com/documentation/appintents |
| Apple Watch (niezależna aplikacja) | natywny SwiftUI; u konkurencji największe źródło skarg (synchronizacja) — docs/11 |
| Dyktowanie serii („100 kilo, 5 razy”) | SpeechAnalyzer iOS 26; modele językowe pobierane raz z sieci; polski **[NIEZWERYFIKOWANE]** |
| Lokalny model Apple (Foundation Models): streszczenie tygodnia, notatka → serie | **polskiego nie ma na liście języków Apple Intelligence** (https://www.apple.com/apple-intelligence/); tylko iPhone 15 Pro i nowsze. Nie teraz. Porad treningowych z LLM nie dajemy (zasada merytoryczna). |
| Liczenie powtórzeń kamerą | dokładność przy sztandze nieudokumentowana — nie |

## 5. Funkcje z liczbami — co wolno twierdzić (do ponownej weryfikacji przed wdrożeniem)

- **B1 RIR/RPE:** Zourdos 2016 (JSCR 30(1):267–75, streszczenie) — RPE 10 = 0 RIR, trafniejsza ocena u doświadczonych. Helms 2016
  (https://pmc.ncbi.nlm.nih.gov/articles/PMC4961270/, pełny tekst) — początkujący zapisują RIR, ale nie opierają na nim progresji;
  tabela %1RM↔RIR „nie jest narzędziem przeliczania”. Tabel z artykułu nie odczytano (obrazy) — **liczb z nich nie używać**.
- **B2 e1RM:** liczymy Epleyem do 10 powtórzeń (`lib/stats.ts`) — zgodne z Reynolds 2006 (https://pubmed.ncbi.nlm.nih.gov/16937972/:
  „no more than 10 repetitions … in linear equations”). Publikacje źródłowe Epleya i Brzyckiego nieprzeczytane **[OTWARTE]**.
- **B3 serie na partię:** już liczymy pomocnicze jako 0,5 serii — zgodne z Pelland 2026 (Sports Med 56(2):481–505,
  https://pubmed.ncbi.nlm.nih.gov/41343037/, „fractional” najlepiej). ACSM 2026 (Currier i in., MSSE 58(4),
  https://pmc.ncbi.nlm.nih.gov/articles/PMC12965823/, sekcja „Improving hypertrophy”): „≥10 sets/wk” sprzyja hipertrofii → możliwy
  znacznik przy wykresie serii na partię, z podpisem źródła.
- **B4 częstotliwość:** przy równej objętości bez wpływu na hipertrofię (ACSM 2026; Schoenfeld 2019) → pokazywać liczbę dni, bez oceny.
- **B5 przerwy:** Singer 2024 (https://pubmed.ncbi.nlm.nih.gov/39205815/): mała korzyść >60 s, >90 s bez wyraźnych różnic → domyślna
  przerwa ≥90 s ma podstawy; dłuższe nie szkodzą.
- **B6 progresja:** dzisiejsza podpowiedź „↑” to podwójna progresja; reguła „2–10% przy 1–2 powt. ponad zakres” pochodzi z ACSM 2009
  (zastąpionego przez ACSM 2026, który mówi, że progresja nie jest konieczna do korzyści) → nazwać uproszczeniem.
- **B7 bliskość upadku / B8 deload:** brak podstaw dla „wskaźnika zmęczenia” ani automatycznego deloadu **[OTWARTE]** → co najwyżej ręczne
  oznaczenie tygodnia jako deload i trend e1RM.

## 6. Wygląd i grafiki

Uwagi właściciela 07.10.2026: „Fajnie, gdybyśmy zaprojektowali unikatowe grafiki. Na pewno na ikonę. W środku też coś odróżniającego się.
Motyw kredy jest fajny, ale wygląda trochę jak typowa prezentacja w PowerPoint robiona przez kogoś młodego.”
**Rynek (ikony i zrzuty 12 aplikacji, App Store 07.10.2026):** klisze do omijania — hantel/sztanga (Strong, Alpha, Setgraph, RP),
monogram z litery (Hevy, Fitbod, Boostcamp, Ladder, Future), czerwono-pomarańczowe tło „energii” (StrengthLog, RP, Fitbod, Boostcamp),
czerń z neonem (Setgraph, Ladder), maskotki (Liftosaur, StrengthLog). Nasz pomarańcz #E8590C jest blisko Gentler Streak i Boostcamp.

**Makiety (artefakt „Trening — kierunki wyglądu”, https://claude.ai/artifact/VcG5ESWeNsPEVYiFA1kEru, prywatny):** ten sam ekran
(widok skupiony na bieżącej serii, kierunek A z pkt 3) w trzech stylach, z ikoną w wersji domyślnej, ciemnej i małej:
- **A · Tablica wyników** — ciemne tło, bursztynowy sygnał, matrycowy krój cyfr (Handjet) + Geologica; ikona: strzałka ↑ z kropek tablicy.
  Plus: najczytelniejszy z daleka, wyraźnie inny niż Strong. Minus: ciemny domyślnie (dziś domyślny jest jasny — decyzja 05.10).
- **B · Tuleja** — kolory talerzy zawodniczych jako jedyny kolor, zawsze z liczbą na talerzu; Tektur + IBM Plex Mono; ikona: koniec
  sztangi z talerzami z boku; w aplikacji „co nałożyć na stronę” przy serii (= kalkulator talerzy z pkt 4a).
  Źródła kolorów: IWF TCRR pkt 3.3.3.6 (wyd. 2019, https://pzpc.pl/download/file/3354; wydanie 2025 **[NIEZWERYFIKOWANE]**),
  IPF Technical Rules 2026, rozdz. 2.3(b)6 — tylko 15/20/25 kg. Minus: Strong pokazuje kolorowe talerze w kalkulatorze (PRO);
  czerwony/zielony mylą się przy deuteranomalii → liczba na talerzu obowiązkowa (WCAG 1.4.1).
- **C · Dziennik** — papier w linie, czerwony margines, granatowy atrament, Literata + IBM Plex Mono, rekord jako pieczątka; ikona:
  kartka z kreskami liczenia serii. Plus: ciepły, ludzki, najbliżej Kredy. Minus: ryzyko „staroświecko”, mniej czytelny z daleka.

**Ikona w iOS 26** (HIG App icons, zmiana 08.06.2026): warstwy, warianty domyślny/ciemny/przezroczysty/barwiony; prosta forma z kilku
kształtów. Dziś `app.json` ma jeden płaski PNG — do uzupełnienia o warianty ciemny i barwiony (`ios.icon` w Expo) niezależnie od kierunku.
Kroje: wszystkie proponowane mają polskie znaki i cyrylicę (sprawdzone w plikach fontów); dzisiejszy problem Archivo bez cyrylicy jest
już obsłużony (IBM Plex Sans dla bg/sr/uk, `applyFontsFor`).

**Rekomendacja:** B (Tuleja) — jedyny kierunek, w którym grafika niesie funkcję (talerze = co nałożyć), a ikona jest z dziedziny i nie
jest klišą; z ciemnym wariantem. Alternatywa: A, jeśli ważniejsza jest czytelność z daleka niż charakter.

## 7. Proponowana kolejność (do decyzji właściciela)

1. Wygląd: wybór kierunku i ikony (razem z kierunkiem A — ekran treningu i tak się zmienia).
2. Pakiet 4a (małe) — część od razu, bo bez twierdzeń dziedzinowych.
3. Kierunek A: widok skupiony z przełącznikiem.
4. Import ze Strong/Hevy (argument przy przejściu z konkurencji), RIR, raporty.
5. Przed wersją płatną (docs/15): subskrypcja i blokada po wygaśnięciu.
6. Później: Siri/Skróty, zegarek, dyktowanie.
