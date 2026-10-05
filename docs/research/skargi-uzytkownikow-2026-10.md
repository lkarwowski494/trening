# Na co narzekają użytkownicy aplikacji do logowania treningu siłowego i czego im brakuje

Stan: 05.10.2026. Research na zlecenie (web), bez zmian w repozytorium.
Aplikacje: Strong, Hevy, Fitbod, JEFIT, Boostcamp, Liftosaur, FitNotes, Gymshark Training, Alpha Progression, Setgraph.

## 0. Metoda i ograniczenia (przeczytaj najpierw)

**Źródła pierwotne (recenzje):**
- **Google Play**: 963 recenzje 1–3★ pobrane biblioteką `google-play-scraper` (lang=en, country=us, sortowanie „najnowsze”, do 60 na każdą liczbę gwiazdek na aplikację). Aplikacje: Strong, Hevy, Fitbod, JEFIT, FitNotes, Setgraph, Liftosaur. Daty: Hevy prawie wyłącznie 2026, Fitbod i JEFIT 2025–2026, Strong 2024–2026, Setgraph 2023–2026, FitNotes 2020–2025. Boostcamp, Gymshark Training i Alpha Progression nie zostały znalezione w Google Play pod sprawdzanymi identyfikatorami.
- **App Store**: strony „see-all reviews” dla 10 aplikacji w sklepach US/GB/CA/AU, razem 386 recenzji, z czego 87 to 1–3★. Apple pokazuje tu recenzje „najbardziej pomocne”, więc wiele z nich jest starych (2017–2026). Przy każdym cytacie podaję datę.
- Dodatkowo próbka polskich recenzji z Google Play (lang=pl, country=pl) dla Strong, Hevy i JEFIT.
- Do recenzji z App Store nie ma osobnych linków, więc podaję URL strony recenzji danej aplikacji i kraju oraz datę i tytuł recenzji, żeby dało się ją odnaleźć.

**Reddit był niedostępny.** Narzędzie wyszukiwania zwraca błąd dla domeny reddit.com („not accessible to our user agent”), a bezpośrednie zapytanie zablokowała polityka sesji. **W raporcie nie ma żadnego cytatu z Reddita.** Artykuły porównawcze, które powołują się na Reddit, pisali najczęściej producenci konkurencyjnych aplikacji (Setgraph, LiftHero, RepReturn, sensai.fit i inni). Traktuję je jako źródło o cenach i limitach, a nie jako głos użytkowników.

**Jak liczyłem „częstość”:** to dopasowania słów kluczowych (regex) w 1050 recenzjach 1–3★ (963 z Google Play i 87 z App Store). Każdą liczbę traktuj jako **przybliżony rząd wielkości**. Jedna recenzja może trafić do kilku kategorii, a dopasowanie słowa nie zawsze oznacza skargę na daną rzecz. W tabelach podaję „ok. N / 1050”. Próbka **nie jest losowa** (najnowsze recenzje z Google Play, „pomocne” z App Store), więc liczby pokazują proporcje w tej próbce, a nie w całej populacji użytkowników.

**Cytaty:** przetłumaczone przeze mnie na polski i skrócone (pominięcia oznaczam „…”). Przy każdym podaję język oryginału.

Skróty: GP = Google Play, AS = App Store, ★ = ocena.

Linki do stron recenzji:
- GP Strong: https://play.google.com/store/apps/details?id=io.strongapp.strong
- GP Hevy: https://play.google.com/store/apps/details?id=com.hevy
- GP Fitbod: https://play.google.com/store/apps/details?id=com.fitbod.fitbod
- GP JEFIT: https://play.google.com/store/apps/details?id=je.fit
- GP FitNotes: https://play.google.com/store/apps/details?id=com.github.jamesgay.fitnotes
- GP Setgraph: https://play.google.com/store/apps/details?id=app.setgraph
- GP Liftosaur: https://play.google.com/store/apps/details?id=com.liftosaur.www.twa
- AS (wzór): `https://apps.apple.com/{us|gb|ca|au}/app/id<ID>?see-all=reviews`. Identyfikatory: Strong 464254577, Hevy 1458862350, Fitbod 1041517543, JEFIT 449810000, Boostcamp 1529354455, Liftosaur 1661880849, Gymshark Training 1139151320, Alpha Progression 1462277793, Setgraph 1209781676, FitNotes 1059245195.

---

## 1. Najczęstsze skargi (pogrupowane)

### A. Paywall i subskrypcje: największa grupa skarg

**A1. Subskrypcja za „zwykły dziennik” i za niskie darmowe limity.** Słowa związane z płatnościami (subskrypcja, paywall, premium, pro, cena itp.) pojawiają się w ok. 244 / 1050 recenzji. Węższy wzorzec („paywall”, „only N routines”, „have to pay”) daje ok. 65 / 1050. Najczęściej dotyczy to Fitbod, JEFIT, Strong i Hevy.
- Limity według recenzji: Strong pozwala na 3 własne szablony za darmo. Dwie recenzje (EN z 2026 i PL z 2025) mówią o 2 szablonach, czego nie udało mi się potwierdzić. Hevy pozwala za darmo na 4 rutyny, 7 własnych ćwiczeń i 3 miesiące historii wykresów.
- „3 darmowe szablony? 🤣 Kompletnie bezużyteczna aplikacja. Nie zapłacę za coś, co w innych aplikacjach jest za darmo.” (GP Strong, 1★, 2025-10-27, oryg. EN)
- „Tylko cztery treningi, więc jeśli chcesz mieć choćby tygodniowy cykl, płać.” (GP Hevy, 1★, 2026-07-28, oryg. EN)
- „Nie opłaca mi się płacić drogiego abonamentu tylko po to, żeby mieć 1 Routine więcej. I can pay for one more Routine once.” (GP Strong, 3★, 2018-11-22, oryg. PL/EN)
- „Dlaczego aplikacja DO LOGOWANIA potrzebuje subskrypcji!?” (AS Strong CA, 1★, 2020-08-06, „So much greed for so little app”, oryg. EN)
- Źródła limitów: https://repreturn.com/strong-app-review/ (Strong: 3 rutyny za darmo, $29.99 rocznie) oraz https://www.sensai.fit/blog/hevy-review-2026 (Hevy: 4 rutyny, 7 ćwiczeń, 3 miesiące). Oba artykuły pochodzą od producentów konkurencji. Limity Hevy potwierdzają też recenzje z GP.

**A2. Paywall ujawniony dopiero po onboardingu lub rejestracji.** To fala recenzji Fitbod z 2026 roku. Pod wzorcem „paywall” w tej próbce jest ok. 24 recenzje Fitbod.
- „Utknąłem na paywallu… byłem przekonany, że będzie za darmo, kiedy zobaczyłem reklamę na YouTube.” (GP Fitbod, 1★, 2026-08-03, oryg. EN)
- „Nie możesz usunąć konta, dopóki się nie zalogujesz, a nie zalogujesz się bez podania danych płatniczych.” (GP Fitbod, 2★, 2026-06-22, oryg. EN)
- „Wiesz, że to zły biznes, kiedy nie podają ceny, dopóki nie oddasz im wszystkich danych osobowych.” (GP Setgraph, 1★, 2025-02-23, oryg. EN)
- „Zostałem dwa razy złapany na »14-dniowy okres próbny«… Gdyby był uczciwy sposób na przetestowanie, chętnie zapłaciłbym PO tym, jak zobaczę, czy aplikacja robi, co potrzebuję.” (AS Alpha Progression AU, 2★, 2025-01-21, oryg. EN)

**A3. Odbieranie funkcji, które wcześniej były darmowe.** Ten zarzut wywołuje najostrzejsze oceny.
- „Po miesiącach używania nagle funkcja, dla której z niej korzystałem (aktywne treningi), jest za paywallem.” (AS FitNotes CA, 1★, 2025-11-22, oryg. EN)
- „Kochałem tę aplikację, darmowa wersja miała wszystko… a teraz nie mogę nawet zalogować aktywnego treningu?” (AS FitNotes CA, 3★, 2025-11-02, „Glorified Calendar”, oryg. EN)
- „Kiedyś był świetny darmowy plan… Usunięto go i teraz wymuszana jest subskrypcja… więc odinstalowuję.” (GP Fitbod, 3★, 2026-06-29, oryg. EN)
- JEFIT zablokował tworzenie własnych ćwiczeń za opłatą (AS JEFIT GB, 1★, 2024-10-11). Boostcamp dostał zarzut, że funkcje „już dostępne” trafiły za paywall (AS Boostcamp GB, 1★, 2024-11-08). Recenzent Hevy pisze, że „wiele [funkcji] było wcześniej darmowych” (GP Hevy, 3★, 2026-07-24).

**A4. Natrętne zachęty do zakupu, reklamy i pop-upy, także u płacących.** Reklamy: ok. 21 / 1050. Pop-upy i AI: ok. 68 / 1050, w większości JEFIT.
- „Za każdym razem, gdy otwieram aplikację, muszę czekać na dwa ekrany »subscribe now« i »upgrade now«.” (AS Boostcamp GB, 1★, 2024-11-09, oryg. EN)
- „Albo zablokujcie wszystko za paywallem i przestańcie nazywać to darmowym, albo przestańcie mnie błagać o Pro przy każdym użyciu.” (AS Boostcamp CA, 1★, 2026-01-29, oryg. EN)
- „Kupiłem już wersję pro, więc wg regulaminu nie powinienem dostawać reklam.” (GP JEFIT, 1★, 2026-09-14, oryg. EN)

### B. Dane: utrata, konto, internet

**B1. Utrata historii treningów.** Ok. 51 / 1050. Najwięcej przypadków dotyczy Strong i FitNotes (po ok. 15), dalej JEFIT (9) i Setgraph (5).
- „Zostałem automatycznie wylogowany… Kiedy zalogowałem się ponownie, cała historia treningów zniknęła. Kilka lat zapisów.” (GP Strong, 2★, 2025-03-04, oryg. EN; tego dnia pojawiło się kilka podobnych recenzji Strong)
- „Po 6 miesiącach wpisywania wszystkich treningów… pewnego dnia dane zniknęły… Nie ma sposobu, żeby je odzyskać.” (GP FitNotes, 1★, 2023-10-18, oryg. EN)
- „Postęp z całego roku nagle się wyczyścił. I ten błąd powtarza się co kilka tygodni.” (GP Setgraph, 2★, 2025-02-05, oryg. EN)
- Liftosaur: „Po zmianie UI cała historia treningów została usunięta, ustawienia sprzętu przepadły.” (GP, 1★, 2023-01-12, oryg. EN)

**B2. Wymuszone konto i awarie logowania.** Ok. 30 / 1050, z czego 19 to Strong.
- „Nie da się uruchomić bez zalogowania. Niedługo, aby użyć latarki w telefonie, będzie trzeba się zalogować, podać adres, telefon, PESEL i nazwisko rodowe matki.” (GP Strong, 1★, 2022-02-19, oryg. **PL**)
- „Nie da się używać offline / samodzielnie — wymusza założenie konta, żeby sprzedawać twoje dane. Odinstalowane.” (GP Hevy, 1★, 2026-08-16, oryg. EN)
- „Nigdy nie zrozumiem, dlaczego aplikacje zmuszają do rejestracji, zanim w ogóle można ją ZOBACZYĆ.” (GP Strong, 2★, 2025-07-29, oryg. EN)

**B3. Wymagany internet na siłowni.** Ok. 11 / 1050. Rzadko, ale opisy są dramatyczne.
- „Wpisuję dane, aplikacja je przyjmuje, potem wyrzuca błąd sieci i kasuje to, co wpisałem… godzinny trening zamienił się w półtorej godziny.” (AS Boostcamp US, 3★, 2023-04-18, oryg. EN)
- „PROSZĘ, TRZYMAJCIE HISTORIĘ LOKALNIE, ŻEBY DZIAŁAŁA OFFLINE!” (AS Boostcamp CA, 3★, 2022-11-09, oryg. EN)
- „Bez stabilnego internetu ledwo się otwiera… często nie zapisuje treningów.” (AS JEFIT GB, 1★, 2024-10-11, oryg. EN)

**B4. Brak importu albo kopia, której nie da się odtworzyć.** Ok. 24 / 1050.
- „Zrobiłem kopię… i okazało się, że aplikacja nie ma żadnego sposobu wczytania kopii. To po prostu plik CSV, z którego trzeba ręcznie odtworzyć wszystko krok po kroku.” (AS Setgraph US, 1★, 2026-03-01, oryg. EN)
- „Nie da się zaimportować danych? Te tak zwane aplikacje do śledzenia nie radzą sobie z podstawami.” (GP Strong, 2★, 2026-07-02, oryg. EN)
- Przy zmianie iPhone → Android w FitNotes trzeba było pisać do supportu o konwersję pliku, a support nie odpowiadał (GP FitNotes, 1★, 2023-04-16).

### C. Aktualizacje i stabilność

**C1. Aktualizacja psuje przyzwyczajenia.** Ok. 64 / 1050 („after/since the update”). Najwięcej przypadków to JEFIT (24) i Strong (19).
- Strong, przebudowa timerów w lutym 2025: „Nienawidzę nowych timerów w linii. Bardzo zagracone. Wcześniej 5 gwiazdek.” (GP Strong, 2★, 2025-02-19, oryg. EN). „Dodajcie przynajmniej tryb legacy.” (GP Strong, 3★, 2025-03-06, oryg. EN)
- FitNotes, lipiec 2025: „Zupełnie niepotrzebna aktualizacja dla zmian w UI… wszystko laguje, od logowania serii po wpisywanie wartości.” (AS FitNotes US, 1★, 2025-07-10, oryg. EN)
- Boostcamp 2026: „Możliwość tworzenia i edycji szablonów zniknęła albo jest ukryta.” (AS Boostcamp CA, 3★, 2026-03-29, oryg. EN)
- Liftosaur: „Deweloper aktualizuje aplikację mniej więcej co tydzień, więc często się wysypuje… Aplikacja była idealna trzy lata temu!” (AS Liftosaur US, 3★, 2026-02-16, oryg. EN)

**C2. UI nie reaguje w trakcie treningu (odhaczanie serii, wpisywanie ciężaru).** Ok. 51 / 1050, z czego 24 to Hevy (fala z 2026).
- „Odhaczam serię i nawet po 10 stuknięciach nie przechodzi.” (GP Hevy, 1★, 2026-06-03, oryg. EN)
- „Zmiana ciężaru jest niemożliwa: przewija się samo i skacze w dół po wpisaniu jednej cyfry. Mogę wpisać 7 lbs, ale nie 70.” (GP Hevy, 2★, 2026-08-02, oryg. EN)
- „Zawiesza się i wysypuje przy ręcznym dodawaniu treningu. Przyciski reagują po 3–4 sekundach.” (AS Setgraph GB, 2★, 2025-10-10, oryg. EN)

### D. Szybkość i wygoda logowania

**D1. Za dużo kroków, potwierdzeń i automatycznych przeskoków.**
- „Usuwanie serii przy każdej pojedynczej serii pyta, czy na pewno.” (GP Strong, 2★, 2025-02-25, oryg. EN)
- „Bardzo nie lubię automatycznego przeskoku do następnego ćwiczenia po odhaczeniu ostatniej serii. A jeśli chcę dodać serię albo drop set?” (AS Alpha Progression US, 3★, 2026-01-04, oryg. EN)
- „Zakończenie i zapisanie treningu zajmuje ok. 7 kroków, co jest komiczne.” (GP Hevy, 2★, 2026-07-14, oryg. EN)
- „Irytujące okno, które wyskakuje przy przejściu do następnej serii… kiedy jesteś spocony.” (AS Gymshark Training AU, 3★, 2025-03-16, oryg. EN)

**D2. Aplikacja sama zmienia dane albo narzuca „inteligentne” podpowiedzi (AI).** Głównie JEFIT 2025–2026, Fitbod i FitNotes.
- „Wcześniej aplikacja pokazywała wartości z poprzednich treningów i miałem kontrolę. Teraz daje losowe ciężary i powtórzenia.” (GP JEFIT, 1★, 2026-03-19, oryg. EN)
- „Teraz moje ostatnie ciężary zmieniły się względem zeszłego tygodnia (AI?). Używam aplikacji, żeby wiedzieć, co robiłem w poprzedniej sesji. Jeśli tego nie potrafi, jest bezużyteczna.” (GP JEFIT, 3★, 2025-12-17, oryg. EN)
- FitNotes nadpisał kategorie mięśni użytkownika własnymi, „bez powiadomienia i bez możliwości odmowy” (AS FitNotes US, 1★, 2024-03-08, oryg. EN).
- Fitbod: „Progresja jest chaotyczna, regularnie oczekuje podwojenia ciężaru albo serii względem poprzedniego treningu.” (AS Fitbod GB, 2★, 2026-09-25, oryg. EN)

**D3. Szablony: niewygodna edycja i brak przeniesienia zmian z treningu do szablonu.** Słowa „template” i „routine” pojawiają się w ok. 89 / 1050, ale część z nich to skargi na limity (A1).
- „Szablon nie aktualizuje się, kiedy zmieniam ćwiczenie w trakcie treningu. Muszę potem ręcznie poprawiać wszystko jeszcze raz.” (GP Strong, 1★, 2026-08-24, oryg. EN)
- „Niewygodne dodawanie ćwiczeń do istniejącego treningu — »update workout« nie zmienia bieżącego treningu.” (GP Hevy, 1★, 2024-02-07, oryg. EN, recenzja z polskiego sklepu)
- „Duplikowanie edytowanego dnia na resztę dni nie działa… muszę ręcznie zmieniać każdy dzień 16-tygodniowego programu.” (AS Boostcamp US, 3★, 2025-07-08, oryg. EN)

### E. Timer przerw

**E1. Timer zawodny albo przeszkadza.** Ok. 59 / 1050.
- „Timer blokuje mi przejście do następnej serii w superserii.” (GP Strong, 3★, 2025-02-12, oryg. EN)
- „Timer przerwy ciągle wraca do 1 minuty, chociaż ustawiłem 2–3 minuty.” (GP JEFIT, 2★, 2025-07-11, oryg. EN)
- „Często nie piszczy, kiedy ekran jest wygaszony, a po włączeniu ekranu dźwięk odzywa się od razu.” (GP FitNotes, 3★, 2025-01-25, oryg. EN). Podobnie: „Brak powiadomień push o końcu przerwy.” (AS FitNotes AU, 3★, 2023-04-22)
- „Dlaczego timera nie ma na ekranie blokady albo w tle? Czasem staje, kiedy używam innych aplikacji.” (GP Setgraph, 1★, 2024-08-28, oryg. EN)
- „Brak standardowych powiadomień odliczania, co wyklucza używanie z zegarkiem/opaską.” (GP Hevy, 3★, 2024-12-17, oryg. **PL**)

### F. Zegarek i Zdrowie (Apple Health, Health Connect)

**F1. Synchronizacja zegarka z telefonem.** Ok. 47 / 1050. Większość próbki pochodzi z Androida (Wear OS), ale opisane problemy są takie same jak przy Apple Watch.
- „Zegarek i telefon przestały się poprawnie synchronizować. Teraz można rozpocząć dwie zupełnie niezależne sesje na obu urządzeniach — ogromny krok wstecz.” (AS Strong AU, 1★, 2025-12-10, oryg. EN)
- „Od trzech miesięcy synchronizacja z Apple Watch psuje się prawie przy każdym treningu… muszę mieć otwarte obie aplikacje naraz.” (AS Hevy AU, 3★, 2026-07-01, oryg. EN)
- „Na zegarku według aplikacji zrobiłem 18 serii, a na telefonie zapisało się tylko 15 i brakowało jednego ćwiczenia.” (AS Setgraph US, 3★, 2025-05-09, oryg. EN)

**F2. Zapis do Zdrowia nie działa albo trzeba go uruchamiać ręcznie.** Ok. 32 / 1050.
- „Trzeba RĘCZNIE wybrać synchronizację z Apple Health po każdym treningu… jeśli zapomnisz, masz pecha.” (AS JEFIT US, 1★, 2019-09-10, oryg. EN)
- „Nawet jeśli aplikacja Zdrowie ma dostęp, treningi się w niej nie pojawiają.” (AS Setgraph GB, 3★, 2024-04-07, oryg. EN)

### G. Społeczność

**G1. Wymuszony feed społecznościowy i domyślnie publiczne treningi.** Ok. 16 / 1050, czyli mało, ale skargi są ostre. Trzeba tu uczciwie dodać, że część użytkowników chce funkcji dla znajomych (zob. pkt 2).
- „Domyślna widoczność treningu to »WSZYSCY«. Trzeba to zmieniać przy każdym zakończeniu treningu. Nikt nie prosił o kolejną platformę.” (GP Hevy, 1★, 2026-05-30, oryg. EN)
- „Pełno tu mediów społecznościowych, bo to pierwsza strona, którą widzisz po otwarciu aplikacji.” (GP Hevy, 1★, 2026-07-28, oryg. EN)
- „Kolorowo, pastelowo, z funkcjami społecznościowymi. To już nie jest prosty i czytelny dziennik treningowy.” (GP JEFIT, 2★, 2020-11-14, oryg. EN, recenzja z polskiego sklepu)

### H. Baza ćwiczeń i typy pomiaru

**H1. Brak ćwiczeń, limit własnych ćwiczeń, brak edycji typu ćwiczenia.** Ok. 23 / 1050.
- „Musiałem tworzyć własne ćwiczenia, ale można zrobić tylko siedem, a potem wymusza subskrypcję. Skoro mam robić ćwiczenia dla waszej aplikacji, to wy powinniście płacić mnie.” (GP Hevy, 1★, 2026-08-02, oryg. EN)
- „Nie mogę przekonwertować ćwiczenia z jednego typu na inny… [plank z obciążeniem] nie da się zapisać jako ciężar + czas.” (AS Strong US, 4★, 2023-10-24, „Database flexibility”, oryg. EN)
- „Przypadkiem utworzyłem ćwiczenia z ciężarem, a to są ćwiczenia z masą ciała. Nie mogę tego zmienić bez tworzenia NOWEGO ćwiczenia, a wtedy tracę historię.” (AS Strong AU, 1★, 2018-07-05, oryg. EN)

**H2. Jednostki i dokładność ciężaru.**
- „Dzięki za zabranie miejsc po przecinku… nie wpiszemy dokładnych ciężarów typu 55,5 albo 10,25.” (GP Hevy, 1★, 2026-05-22, oryg. EN)
- „Nowa aktualizacja nie pozwala zmienić kg na funty przy ćwiczeniu, więc mam ćwiczenia z wymieszanymi kg i funtami.” (GP Strong, 2★, 2025-02-15, oryg. EN)
- JEFIT zaczął liczyć ciężar hantli „na rękę”, co rozjechało się z historią użytkowników i z 1RM: „Jeśli podnoszę 60 lbs łącznie, po 30 w każdej ręce, to jak mój 1RM może wynosić 30?” (GP JEFIT, 3★, 2025-12-15, oryg. EN)

### Podsumowanie częstości (przybliżone, ta sama próbka 1050 recenzji 1–3★)

| Grupa | ok. dopasowań | Gdzie najczęściej |
|---|---|---|
| Płatności (szeroko) | 244 | Fitbod, JEFIT, Strong, Hevy |
| Aktualizacja zepsuła („after the update”) | 64 | JEFIT, Strong |
| Paywall na podstawach (wąsko) | 65 | Fitbod, JEFIT, Strong |
| Pop-upy i AI | 68 | JEFIT, Fitbod |
| Timer | 59 | Strong, Hevy, JEFIT |
| Utrata danych | 51 | Strong, FitNotes, JEFIT |
| UI nie reaguje lub się wysypuje | 51 | Hevy |
| Zegarek | 47 | Hevy, JEFIT, Fitbod |
| Zdrowie (Health) | 32 | Hevy, Strong |
| Konto i logowanie | 30 | Strong |
| Import, eksport, kopia | 24 | FitNotes, Hevy |
| Baza ćwiczeń | 23 | Strong, Hevy, JEFIT, FitNotes |
| Reklamy | 21 | Fitbod, JEFIT, Setgraph |
| Społeczność | 16 | JEFIT, Hevy |
| Offline / internet | 11 | Hevy, JEFIT, Boostcamp |

---

## 2. Czego brakuje: najczęstsze życzenia

Źródło: recenzje 1–5★ ze zdaniami typu „wish / would be nice / please add” oraz recenzje niskie z pkt 1. Częstość jest tu niska (zwykle 1–5 recenzji na życzenie), więc kolejność to moja ocena wagi, a nie ranking.

1. **Edycja zakończonego treningu, dodanie treningu wstecz, poprawka czasu po zapomnianym „Zakończ”.**
   „Dodać trening w przeszłości.” (AS Strong US, 3★, 2022-01-04). „Nie ma jak poprawić czasu, jeśli zapomnisz zakończyć trening i aplikacja chodzi dalej.” (GP Strong, 2★, 2025-10-06). „Jedyne, czego chcę, to edycja po treningu — trzęsące się ręce nabijają za dużo serii.” (AS Setgraph AU, 4★, 2021-02-16). Wszystkie oryg. EN.
2. **Pauza treningu.**
   „Pozwólcie mi pauzować treningi.” (AS Strong CA, 3★, 2024-03-09). „Nie ma opcji pauzy, można tylko zakończyć. Przeoczenie, biorąc pod uwagę przerwy w zatłoczonej siłowni.” (AS Gymshark Training GB, 3★, 2024-07-02). Prośba o przycisk pauzy pojawia się też w AS Fitbod US (5★, 2024-10-13). Oryg. EN.
3. **„Pomiń ćwiczenie dziś” bez usuwania go z szablonu.**
   „Możliwość pominięcia ćwiczenia z automatycznym zachowaniem go w treningu na następny raz.” (AS Strong CA, 3★, 2025-09-10). Alpha: „zamiast »usuń« powinien być prosty przycisk »pomiń«” (AS US, 3★, 2026-01-04). Oryg. EN.
4. **Zmiany z treningu trafiają do szablonu.** Zob. D3 (GP Strong 2026-08-24, GP Hevy 2024-02-07).
5. **Notatka, która przechodzi na następny trening i nie znika przy zamianie ćwiczenia.**
   „Notatki z poprzedniej sesji nie przechodzą do nowego treningu.” (GP Hevy, 1★, 2026-08-25, lifetime). „Zamiana ćwiczenia kasuje notatki i sticky notes.” (GP Strong, 3★, 2026-05-13). Oryg. EN.
6. **Maszyny: poziom lub pin, ciężar bazowy maszyny, stos ciężarów w domu.**
   „Brakuje tylko opcji ustawienia poziomu, gdy używasz maszyny zamiast wolnego ciężaru.” (AS Setgraph AU, 4★, 2023-04-16). „Brak opcji ustawienia ciężaru bazowego maszyny przed dodaniem talerzy.” (GP Hevy, 2★, 2026-04-21). Fitbod nie ma w liście sprzętu domowego atlasu ze stosem 150 lb (GP Fitbod, 3★, 2026-03-05). Oryg. EN.
7. **Strona ciała i pola na prawą/lewą, RIR.**
   „Chciałbym ustawić, którą ręką/nogą ćwiczę.” (AS Hevy GB, 5★, 2025-03-24). „Wbudowane pola na stronę ciała, sprzęt, RIR, cel…” (GP Strong, 3★, 2026-05-13). Oryg. EN.
8. **Elastyczna baza ćwiczeń:** zmiana typu ćwiczenia z zachowaniem historii, scalanie ćwiczeń, zdjęcie maszyny przy własnym ćwiczeniu.
   AS Strong US (4★, 2023-10-24). „Możliwość dodania zdjęcia do własnych ćwiczeń, żeby wiedzieć, o którą maszynę chodzi.” (GP Strong, 2★, 2023-11-02). Oryg. EN.
9. **Timer niezawodny w tle**, czyli na ekranie blokady, z dźwiękiem przy zgaszonym ekranie i z powiadomieniem. Zob. E1. Do tego tryby interwałowe Tabata, EMOM i AMRAP (GP FitNotes, 3★, 2021-12-26; AS JEFIT AU, 3★, 2020-12-23).
10. **Kalendarz i widok miesiąca w historii, łączny ciężar w podsumowaniu.**
   „Nie pokazuje w kalendarzu, w które dni ćwiczyłeś które partie.” (AS Gymshark Training AU, 3★, 2019-11-09). „Historia pokazuje tylko tydzień, a nie miesiąc.” (AS Boostcamp CA, 3★, 2026-03-29). „W podsumowaniu przydałby się łączny podniesiony ciężar.” (AS Gymshark Training GB, 4★, 2019-08-28). Oryg. EN.
11. **Lepsze wykresy.**
   „Wykresy historyczne są fatalne.” (GP Strong, 2★, 2025-10-06). Prośba o jeden wykres łączący powtórzenia i ciężar, bo progresja to najpierw powtórzenia, potem ciężar (AS Hevy AU, 5★, 2024-08-18). „Analiza jest bezcelowa, nie daje żadnych wniosków.” (GP Setgraph, 3★, 2024-11-30). Oryg. EN.
12. **Foldery i archiwum szablonów.**
   „Zmieniam plan co 3–5 miesięcy, fajnie byłoby archiwizować stare splity w folderze.” (AS Setgraph US, 5★, 2025-07-14). „Brak folderów na szablony jest fatalny.” (GP Strong, 3★, 2025-01-31). Oryg. EN.
13. **Import danych i kopia, którą da się odtworzyć.** Zob. B4.
14. **Automatyczny i niezawodny zapis do Zdrowia**, także tętno i kalorie. Zob. F2. „Tętno pokazuje się już tylko sporadycznie.” (AS Strong AU, 1★, 2025-12-10). Oryg. EN.
15. **Aplikacja na zegarek z pełną funkcjonalnością.**
   „Jedyne, czego brakuje, to wsparcie Apple Watch.” (AS Liftosaur US, 5★, 2025-09-02; podobnie AS Alpha Progression GB, 5★, 2025-09-19, oraz AS Gymshark Training US, 4★, 2019-11-03). Fitbod: zegarek bez edycji ciężaru i bez timera „nie ma sensu” (GP Fitbod, 2★, 2026-04-07). Oryg. EN. Uwaga: ta sama funkcja jest jednocześnie największym źródłem skarg (F1).
16. **Zdjęcia sylwetki przy pomiarach ciała** (AS Alpha Progression GB, 5★, 2023-01-23, oryg. EN).
17. **Znajomi, czyli udostępnianie i kibicowanie znajomym (a nie publiczny feed).**
   „Proszę, dodajcie zakładkę znajomych, gdzie możemy lajkować i kibicować sobie nawzajem.” (GP Strong, 3★, 2026-06-23). AS Gymshark Training US (5★, 2021-06-15). Oryg. EN. To stoi w napięciu z G1.
18. **Wypróbowanie przed zapłatą i jednorazowy zakup zamiast abonamentu.**
   „Chciałbym zapłacić jednorazowo za kilka usług zamiast subskrypcji.” (AS Strong US, 4★, 2020-06-03). Zob. też A2 (Alpha 2025-01-21). Oryg. EN.

**Tło rynkowe (nie są to głosy użytkowników):** w 2025–2026 pojawiło się wiele małych aplikacji, które promują się dokładnie tym, co wyróżnia nas: offline, bez konta, bez subskrypcji. Przykłady: LiftLog (https://liftlog.online/, https://lagerland-apps.github.io/journal/liftlog-pay-what-you-can/), OwnLift (https://ownlift.app/), Offline Gym (https://play.google.com/store/apps/details?id=com.offlinegym), LiftLedger (https://play.google.com/store/apps/details?id=com.liftledger), Benchmark (jednorazowa płatność, https://apps.apple.com/us/app/-/id6471781855). Jeden recenzent JEFIT przeszedł na open-source'owy LiftLog (GP JEFIT, 3★, 2026-09-09). Sam fakt, że aplikacja jest offline i bez konta, przestaje więc wyróżniać.

Artykuły porównawcze 2026 (od producentów konkurencji, więc stronnicze) wymieniają jako minusy: brak gotowych programów (Strong, Hevy), wykresy w płatnej wersji (Strong), Fitbod płatny po kilku treningach, JEFIT z reklamami i przestarzałym UI, Alpha bez zegarka (https://lifthero.app/best-workout-apps, aktualizacja 07.07.2026); brak programów i coachingu w Strong (https://repreturn.com/strong-app-review/, 10.03.2026).

---

## 3. Co to znaczy dla nas — **moja propozycja, nie decyzja**

Nasz stan wziąłem z `docs/research/kb/trening.json` (wersja 0.8.4 z 02.10) i z `docs/12`, `docs/15` w `integration/0.9.0`. Sprawdzałem tylko dokumenty, nie kod.
Kategorie: **mamy** / **łatwe** (dni) / **duże** (tygodnie albo zmiana architektury) / **poza zakresem**.

| # | Skarga lub życzenie | Ocena | Komentarz |
|---|---|---|---|
| A1 | Niskie darmowe limity, abonament za dziennik | mamy (dziś) / **ryzyko** | Dziś bez limitów. W `docs/15` jest decyzja z 05.10: po 1 miesiącu próby „treningi zablokowane”. To ten sam wzorzec, który w recenzjach Fitbod i FitNotes zbiera 1★ (A2, A3). Do rozważenia przez właściciela: (a) cała aplikacja w subskrypcji po próbie — największy przychód, największe ryzyko złych ocen; (b) darmowy rdzeń (logowanie, historia, szablony) plus płatne dodatki — najmniej skarg w recenzjach; (c) jednorazowy zakup „Pro” — o to proszą użytkownicy (pkt 2.18). Moja rekomendacja: (b) albo (c). |
| A2 | Paywall ukryty do końca onboardingu | łatwe | Pokazać cenę i zasady próby na pierwszym ekranie i w opisie w App Store. |
| A3 | Odbieranie darmowych funkcji | mamy (plan) | `docs/15`: wcześniejsi użytkownicy zostają za darmo. To trafia dokładnie w tę skargę. |
| A4 | Pop-upy i nagabywanie | mamy | Brak reklam i upsellu. Przy wprowadzaniu płatności: bez okien w trakcie treningu. |
| B1 | Utrata historii | mamy (częściowo) | Lokalny SQLite, automatyczna kopia JSON po treningu, odzyskiwanie po uszkodzonym stanie. Brak kopii poza urządzeniem (poza kopią iOS). Atut warty komunikowania w App Store. |
| B2 | Wymuszone konto | mamy | Bez konta. |
| B3 | Wymagany internet | mamy | Pełne offline. |
| B4 | Kopia nie do odtworzenia, brak importu | mamy (własny JSON) / duże (import Strong/Hevy, T-031) | `docs/15`: eksport działa także po próbie. To odpowiada na skargę z Setgraph. |
| C1 | Aktualizacje psują nawyki | proces | Zmiany UI wprowadzać stopniowo albo z możliwością powrotu do starego zachowania („legacy”). To już lekcja 2 w `docs/11`. |
| C2 | UI nie reaguje przy odhaczaniu | mamy (testy) | Warto dodać test wydajności dla długiego treningu (np. 30 ćwiczeń × 5 serii). |
| D1 | Za dużo potwierdzeń, auto-przeskoki | łatwe | Przejrzeć, gdzie pytamy „czy na pewno”. Nie przeskakiwać automatycznie do następnego ćwiczenia. |
| D2 | Aplikacja sama zmienia wpisy | mamy | Podpowiedź progresji jest cicha i nigdy nie zmienia wpisów (A-002). Mocny argument. |
| D3 / 2.4 | Zmiany z treningu do szablonu | łatwe–średnie | W `docs/11` jako „pytanie: zaktualizować szablon?”. Uwaga: zasada z CLAUDE.md mówi, że szablony ustawia właściciel i aplikacja ich sama nie zmienia, więc tylko na wyraźne polecenie użytkownika. |
| E1 | Timer zawodny lub nachalny | mamy | Live Activity, powiadomienia, timer przetrwa zamknięcie aplikacji, −15/+15/Pomiń. Sprawdzić, czy timer nie zasłania przycisków w superserii (skarga na Strong). |
| F1 / 2.15 | Zegarek | duże / poza zakresem teraz | Największe źródło skarg u konkurencji (synchronizacja). Live Activity pokrywa część potrzeb. |
| F2 / 2.14 | Zapis do Zdrowia | mamy (zapis automatyczny po włączeniu) | Odczyt tętna i kalorii: duże, bez zegarka mało sensowne. |
| G1 / 2.17 | Feed vs. znajomi | poza zakresem | Wymaga serwera (ADR-025). Brak feedu to dla części użytkowników zaleta. |
| H1 / 2.8 | Baza ćwiczeń, zmiana typu | mamy (częściowo) | 5 typów metryki, archiwizacja ćwiczeń. Scalanie historii dwóch ćwiczeń: łatwe–średnie (pomysł z `docs/11`). Zdjęcie przy własnym ćwiczeniu: średnie. |
| H2 | Ułamkowe ciężary, kg/lb, hantle na rękę | mamy | Tryby obciążenia (na hantlę, łącznie). Zapis w kg. Sprawdzić, czy da się wpisać 0,25 kg. |
| 2.1 | Edycja zakończonego treningu i trening wstecz | mamy (0.9.0, czeka na test na telefonie) | `docs/12`. |
| 2.2 | Pauza treningu | łatwe (?) | Mamy obsługę porzuconego treningu (2 h / 6 h), ale nie pauzę. Do decyzji, czy pauza ma odejmować czas trwania. |
| 2.3 | Pomiń ćwiczenie dziś | łatwe | Wiąże się z E2 (zamiana „tylko dziś / na stałe”). |
| 2.5 | Notatka przypięta do ćwiczenia | łatwe | Już w `docs/11` jako pomysł. Zamiana ćwiczenia nie może kasować notatek. |
| 2.6 | Maszyny: poziom, pin, ciężar bazowy, stos | mamy (częściowo) / w toku | Miejsca i sprzęt, stacje elektryczne, P-003. Ciężar bazowy maszyny (sanie, Smith) sprawdzić w specyfikacji E2/E3. |
| 2.7 | Strona ciała, RIR | mamy (częściowo) | Tryb „unilateral” (na stronę) i pole RPE/RIR. Brak osobnego logu lewa/prawa. Średnie. |
| 2.9 | Tryby interwałowe (EMOM, Tabata) | duże | Poza rdzeniem loggera siłowego. |
| 2.10 | Kalendarz i widok miesiąca | łatwe | Już w `docs/11`, pkt 5.4. |
| 2.11 | Wykres reps + ciężar razem | łatwe–średnie | Mamy wykresy e1RM i objętości. |
| 2.12 | Foldery i archiwum szablonów | łatwe | Brak (płaska lista). |
| 2.16 | Zdjęcia sylwetki | średnie | Moduł Ciało (H2). |
| 2.18 | Wypróbowanie przed zapłatą, jednorazowy zakup | decyzja właściciela | Zob. A1. |

**Najważniejszy wniosek dla nas (moja interpretacja):** nasze mocne strony (offline, bez konta, brak nagabywania, aplikacja nie zmienia sama wpisów, kopie danych) to dokładnie odpowiedzi na najczęstsze skargi. Zaplanowany model „cała aplikacja zablokowana po próbie” powtarza jednak wzorzec, który w recenzjach Fitbod i FitNotes z lat 2025–2026 daje falę ocen 1★. Warto, żeby właściciel zobaczył ten raport przed ostateczną decyzją o płatnościach.
