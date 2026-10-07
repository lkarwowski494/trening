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
| Kalendarz w Historii (miesiąc, dni z treningiem) | | nie |
| Kalkulator talerzy (co nałożyć na stronę) | z talerzy miejsca — mamy dane | nie (arytmetyka) |
| Pomiń ćwiczenie dziś (bez usuwania z szablonu) | dziś tylko „usuń” | nie |
| Foldery / archiwum szablonów | | nie |
| Przyciski w Live Activity: „−15/+15 s”, „Pomiń przerwę” | iOS: przyciski działają po odblokowaniu (Face ID) — https://developer.apple.com/documentation/widgetkit/adding-interactivity-to-widgets-and-live-activities | nie |
| Kontrolka w Centrum sterowania „Start przerwy / treningu” | https://developer.apple.com/documentation/widgetkit/creating-controls-to-perform-actions-across-the-system | nie |
| Widżet na ekran główny (serie w tygodniu / ostatni trening) | rozszerzenie widżetu już jest | nie |

### 4b. Średnie (1–2 tygodnie)
| Funkcja | Uwagi | Twierdzenie dziedzinowe? |
|---|---|---|
| Import CSV ze Strong i Hevy | Strong nie importuje nawet własnego CSV; Hevy importuje ze Strong — https://help.hevyapp.com/hc/en-us/articles/38001424401943 | nie |
| Pole RIR obok RPE | skala: RPE 10 = 0 RIR, RPE 9 = 1 RIR (Zourdos 2016, streszczenie: https://pubmed.ncbi.nlm.nih.gov/26049792/) | tak — B1 |
| Kalkulator rozgrzewki | schemat ustawia użytkownik albo nazwany „przykładem” | **[OTWARTE]** — brak źródła schematu |
| Pomiary ciała + odczyt masy ciała z Apple Health | wymaga aktualizacji `@kingstinct/react-native-healthkit` 8 → 16 (osobne wydanie, nie razem ze zmianą schematu — CLAUDE.md) | siła względna = arytmetyka |
| Raport tygodnia / miesiąca (podsumowanie po treningu i okresowe) | | nie, jeśli tylko liczby użytkownika |
| Mapa mięśni (rysunek z seriami na partię) | dane mamy; potrzebna grafika SVG | nie |
| Pauza treningu | do decyzji: czy pauza odejmuje czas trwania | nie |

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
Research wyglądu w toku — kierunki z makietami w osobnej sekcji po jego zakończeniu.

## 7. Proponowana kolejność (do decyzji właściciela)

1. Wygląd: wybór kierunku i ikony (razem z kierunkiem A — ekran treningu i tak się zmienia).
2. Pakiet 4a (małe) — część od razu, bo bez twierdzeń dziedzinowych.
3. Kierunek A: widok skupiony z przełącznikiem.
4. Import ze Strong/Hevy (argument przy przejściu z konkurencji), RIR, raporty.
5. Przed wersją płatną (docs/15): subskrypcja i blokada po wygaśnięciu.
6. Później: Siri/Skróty, zegarek, dyktowanie.
