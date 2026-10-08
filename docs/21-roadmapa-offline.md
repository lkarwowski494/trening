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

### Priorytet (decyzja właściciela 08.10.2026)
- **Kalendarz z planowaniem treningów** — „sensowna forma kalendarza (może być też z planowaniem treningów)”. Dziś: kalendarz miesiąca w Historii
  (tylko przeszłe sesje). Do decyzji właściciela: miejsce w aplikacji, powtarzalny plan tygodnia vs pojedyncze wpisy, przypomnienia. Powiązania:
  tygodnie deload (już oznaczane), przyszły generator planu tygodnia. Bez twierdzeń dziedzinowych (planowanie = dane użytkownika).
  **Zrobione 08.10.2026:** zakładka Kalendarz, plan tygodnia, dwa tryby przesuwania, „Dziś” na ekranie treningu, propozycje z regeneracją partii
  (docs/research/23). Przypomnienie rano w dniu treningu — **zrobione 08.10.2026** (godzina 8:00 do potwierdzenia).
- **Deload A+B** (08.10.2026) — podpowiedź „zwykle co 4–6 tyg.” (praktyka) i mniej serii przy starcie w tygodniu deload. **Zrobione 08.10.2026.**
- **Generator szablonów i planu** (wariant A) i **kilka planów z aktywnym** (08.10.2026, docs/24). **Zrobione 08.10.2026.**
- **„Co nowego”** (08.10.2026) — „i” na ekranie Trening, kropka po aktualizacji, starsze wersje zwinięte. **Zrobione 08.10.2026.**

### Backlog bez priorytetu (decyzja właściciela 08.10.2026)
Wrócimy za jakiś czas; w rozmowie wymieniane tylko zbiorczo, dopóki właściciel nie poprosi o listę (CLAUDE.md).
- Wydanie natywne — sekcja 4n niżej (przyciski przerwy na ekranie blokady, widżet, kontrolka w Centrum sterowania).
- Wydanie Health — biblioteka `@kingstinct/react-native-healthkit` 8 → 16: odczyt aktywnych kcal, ocena wysiłku (`workoutEffortScore`; RPE → ocena **[OTWARTE]**),
  prawdziwe zdarzenia pauzy z `Workout.pauses`, masa ciała i pomiary ciała.
- Import CSV ze Strong i Hevy — format Stronga niżej; otwarte: jednostka (CSV bez kg/lb), dopasowanie ćwiczeń.
- Nagranie siebie podczas ćwiczenia i ocena AI poprawności ruchu (dodane 08.10.2026). Przed pracą **[OTWARTE]**: źródła dla kryteriów techniki
  i dokładności oceny z obrazu (w 4c „liczenie powtórzeń kamerą” odłożone z braku udokumentowanej dokładności); granica porad zdrowotnych
  (ból, kontuzje → specjalista); prywatność nagrań (tylko na telefonie?); koszt modelu (0 zł poza Apple).
- Znajomi i wyzwania w grupie (dodane 08.10.2026, właściciel: „sparowanie z kolegami i rzucanie sobie wyzwań w grupie, jak tablica wyników
  na siłowni”). Przed pracą **[OTWARTE]**: aplikacja jest dziś offline, bez kont i serwera — potrzebny serwer albo synchronizacja (koszt: zasada 0 zł
  poza Apple; darmowe limity do sprawdzenia, np. iCloud/CloudKit w ramach Apple Developer); prywatność (dane treningowe innych osób, zgoda, RODO);
  zasady porównań, które nie nagradzają ryzyka (np. wyzwania na regularność / liczbę treningów zamiast samego ciężaru); moderacja zaproszeń.
- Układanie treningów według preferencji i celu (dodane 08.10.2026). Przed pracą **[OTWARTE]**: koliduje z decyzją 03.10.2026 („szablony ustawia
  właściciel — aplikacja ich nie tworzy”) — wymaga nowej decyzji właściciela; zasady układania tylko ze źródeł (ACSM 2026, przeglądy) wg hierarchii.

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
