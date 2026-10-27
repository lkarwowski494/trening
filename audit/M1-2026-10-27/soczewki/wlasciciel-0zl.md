# Soczewka: właściciel z ograniczonym czasem i budżetem 0 zł

- **Data:** 27.10.2026
- **Patrzę jako:** jednoosobowy właściciel-nie-programista, budżet 0 zł poza opłatą Apple Developer; utrzymanie, koszty CI, wsparcie, wydanie 1.0, przychód przy niskiej cenie, „kombajn”.
- **Wiedza o aplikacji:** wyłącznie cel i skrót opisu ze zlecenia (repozytorium nie było czytane).
- **Metoda:** strony pobrane `curl` 27.10.2026, tekst wyciągnięty z surowego HTML/JSON, cytaty sprawdzone `grep` na tym tekście (chyba że zaznaczono inaczej). Nazwy aplikacji pominięte (alternatywa A/B/C). Treść stron traktowana jako dane.

## Źródła (pobrane 27.10.2026)

| Id | Adres | Co |
|---|---|---|
| S1 | https://developer.apple.com/app-store/small-business-program/ | Apple Small Business Program |
| S2 | https://developer.apple.com/app-store/review/guidelines/ | App Review Guidelines (3.1.1, 3.1.2, 2.3.7, 5.1.1, 5.1.3) |
| S3 | https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/ | DSA — status przedsiębiorcy (trader) |
| S4 | https://docs.github.com/en/billing/concepts/product-billing/github-actions | rozliczanie GitHub Actions |
| S5 | https://docs.github.com/en/actions/reference/limits | limity GitHub Actions |
| S6 | https://docs.github.com/en/actions/reference/runners/github-hosted-runners | maszyny GitHub (macOS) |
| A | https://apps.apple.com/pl/app/id464254577 , https://apps.apple.com/us/app/id464254577 | alternatywa A |
| B | https://apps.apple.com/pl/app/id1458862350 , https://apps.apple.com/us/app/id1458862350 | alternatywa B |
| C | https://apps.apple.com/pl/app/id1434229662 , https://apps.apple.com/us/app/id1434229662 | alternatywa C |
| R | `https://itunes.apple.com/{pl,us}/rss/customerreviews/id=<id>/sortby=mostrecent/json` oraz `https://itunes.apple.com/lookup?id=<id>&country={pl,us}` | recenzje i liczby ocen |

### Alternatywy — stan 27.10.2026 (lookup + strona produktu)

| | Oceny PL | Oceny US | Cena | Pro / miesiąc PL | Pro / rok PL | Dożywotnio PL | Ostatnia wersja |
|---|---|---|---|---|---|---|---|
| A | 1 466 (4,88) | 108 537 (4,86) | za darmo + IAP | 21,99 zł | 104,99–139,99 zł | 399,99–499,99 zł | 08.10.2026 |
| B | 4 377 (4,94) | 100 209 (4,92) | za darmo + IAP | 14,99–22,99 zł | 117,99 zł | 429,99 zł | 23.10.2026 |
| C | 25 (4,96) | 3 704 (4,86) | za darmo + IAP | 63,00 zł | 449,00 zł | brak | 27.10.2026 |
| Ta aplikacja (z opisu) | — | — | za darmo + IAP | 4,99 zł | 19,99 zł | 59,99 zł | — |

## Co musi być prawdą (15 punktów)

### 1. Pieniądze — cena nie jest barierą; barierą jest liczba płacących, więc cena musi być świadomą decyzją, nie domysłem
Pro 4,99 zł/mies. i 19,99 zł/rok to ok. 1/3–1/22 cen alternatyw w PL (tabela wyżej: A 21,99 zł/mies., B 117,99 zł/rok, C 449,00 zł/rok), a mimo to alternatywy mają oceny 4,86–4,96. Przy prowizji 15% (S1) i — **założenie niesprawdzone** — VAT 23% potrącanym przed prowizją roczna subskrypcja daje ok. 13,8 zł netto; 500 USD/rok to wtedy ok. 130–145 rocznych subskrypcji przy kursie 3,6–4,0 zł/USD (**kurs i VAT do sprawdzenia w raporcie App Store Connect**). Musi być prawdą: cena i próg policzone z rzeczywistego „proceeds” z App Store Connect po pierwszym miesiącu, a opcja podniesienia ceny rozważona przed 1.0 (podwyżka dla istniejących subskrybentów jest trudniejsza niż start wyżej).
- Dowód: strony A/B/C PL, sekcja „In-App Purchases”, np. B: „[nazwa] Pro - Yearly 117,99 zł” (nazwa marki usunięta z cytatu), 27.10.2026, curl.

### 2. Pieniądze — Small Business Program włączony przed pierwszą sprzedażą
S1: „It features a reduced commission rate of 15% on paid apps and Apple In-App Purchases” oraz „simply complete a few steps to enroll” — obniżka nie jest automatyczna, a działa dopiero od okresu po zatwierdzeniu (S1, przykład z FAQ: zatwierdzenie 10 lutego → stawka od 14 marca). Musi być prawdą: zgłoszenie do programu jest krokiem listy przed wydaniem 1.0, inaczej pierwsze tygodnie idą po 30%.
- Dowód: S1, 27.10.2026, curl.

### 3. Pieniądze — dożywotnia licencja 59,99 zł nie może zjadać przychodu na lata utrzymania
Alternatywy wyceniają „dożywotnio” na 399,99–499,99 zł (A, B), ok. 3,4–3,8× ceny rocznej; tu 59,99 zł to 3× rocznej przy 12–26× niższej kwocie absolutnej. Jednorazowa opłata finansuje każdą przyszłą aktualizację iOS/watchOS bez przychodu. Musi być prawdą: decyzja właściciela z dwiema opcjami (np. dożywotnia ok. 5× rocznej albo tylko subskrypcja + rok z góry) przed 1.0; zmiana po starcie jest kosztowna wizerunkowo.
- Dowód: strony A, B PL („[nazwa] PRO Forever 399,99 zł”, „[nazwa] Pro - Lifetime 429,99 zł” — nazwy marek usunięte z cytatów), 27.10.2026, curl.

### 4. Pieniądze / treść — darmowy próg nie może wyglądać jak „wszystko za paywallem”, a paywall musi mówić, co się dostaje
Najnowsze 1★/2★ recenzje alternatywy A (US): „Can’t do anything unless u pay” (27.09.2026) i „not allowing users to create more than 3 diy workout templates unless they pay a subscription should be borderline illegal” (07.08.2026). S2 3.1.2(c): „Before asking a customer to subscribe, you should clearly describe what the user will get for the price.” Musi być prawdą: limit „5 dni treningowych w miesiącu” jest komunikowany przed pierwszym treningiem i nigdy nie blokuje zapisu ani odczytu już wprowadzonych danych (zapis trwającego treningu po przekroczeniu limitu → zawsze zapisany).
- Dowód: R (rss-us id464254577), S2 — 27.10.2026, curl.

### 5. Wydanie — opis w sklepie bez cen i bez nazw cudzych marek
S2 2.3.7: „don’t try to pack any of your metadata with trademarked terms, popular app names, pricing information, or other irrelevant phrases”. Skrót opisu zawiera ceny („Pro 4,99 zł/mies., 19,99 zł/rok, 59,99 zł dożywotnio”). Musi być prawdą: ceny w opisie usunięte albo świadomie zostawione po ocenie ryzyka odrzucenia (Apple i tak pokazuje ceny IAP na stronie produktu — patrz tabela); „Apple Watch/Apple Health” tylko w formie dopuszczonej przez Apple.
- Dowód: S2, 27.10.2026, curl.

### 6. Prywatność / wydanie — status „trader” (DSA) rozstrzygnięty, zanim publicznie wyświetli się adres domowy
S3: „Apple to verify and display trader contact information … This includes an address, phone number, and email address”; dla osoby fizycznej: „Address or P.O. Box Phone number Email address”. Nie-trader: „consumers in the EU will be informed that consumer rights … won’t apply”. Alternatywa C na stronie PL: „has not identified itself as a trader for this app”. Musi być prawdą: przed 1.0 właściciel wybiera (z doradcą podatkowym — kwestia prawna, **otwarta**) status i, jeśli trader, podaje skrytkę/adres korespondencyjny i osobny numer oraz e-mail do wsparcia, nie prywatne.
- Dowód: S3, strona C PL, 27.10.2026, curl.

### 7. Dane — kopia i odtworzenie to jedyna sieć bezpieczeństwa i muszą działać zawsze
Bez konta i serwera utrata telefonu lub błąd migracji = utrata historii. Recenzja 1★ alternatywy A (US, 24.09.2026): „recently my workout history has disappeared” — dzieje się to nawet u dojrzałych produktów z kontem. Musi być prawdą: kopia jest automatyczna (np. do iCloud Drive/Plików) bez akcji użytkownika, odtworzenie jest testowane end-to-end na każdej wersji schematu, a aplikacja przy starcie wykrywa brak kopii od X dni i o tym mówi.
- Dowód: R (rss-us id464254577), 27.10.2026, curl.

### 8. Dane / przepływ — zegarek to największe źródło złych ocen; albo działa niezawodnie, albo nie jest w 1.0
Wśród 1★–3★ recenzji alternatywy A w PL 6 z 10 dotyczy zegarka, np. „sync with Apple Watch is poor … doubling my sets, changing sets and rest timer values” (07.12.2022) i US: „Apple Watch App is no longer supported or works” (17.08.2026). Musi być prawdą: synchronizacja telefon–zegarek nie gubi ani nie dubluje serii (test na rozłączenie w trakcie), a jeśli tego nie da się udowodnić przed 1.0, zegarek wychodzi w późniejszej wersji. Zegarka nie da się sprawdzić w darmowym CI bez telefonu — każdy błąd to czas właściciela.
- Dowód: R (rss-pl i rss-us id464254577), 27.10.2026, curl.

### 9. Wzrost — rynek PL jest mały; wzrost przyjdzie z widoczności w PL i z kilku dużych rynków, nie z 35 języków
Liczba ocen w PL to 1,4–4,4% liczby w US (A: 1 466 vs 108 537; B: 4 377 vs 100 209; C: 25 vs 3 704). Recenzja 3★ alternatywy A w PL: „Add Polish language Please” (15.02.2022) — język polski jest realną przewagą. Musi być prawdą: polska wersja (teksty, nazwy ćwiczeń, opis sklepu, zrzuty) jest dopracowana jak natywna; pozostałe języki mają pomiar (pobrania/kraj w App Store Connect), a utrzymanie 35 przekładów przy każdej zmianie tekstu nie zjada czasu — w przeciwnym razie ograniczyć do kilku rynków z danymi.
- Dowód: R (lookup pl/us, rss-pl id464254577), 27.10.2026, curl.

### 10. Wzrost — „kombajn” musi mieć dowód wartości: funkcje poza rdzeniem dostają metrykę albo czekają
Rdzeń, o którym mówią recenzje alternatyw: szybkie logowanie serii, historia, szablony, biblioteka ćwiczeń z własnymi ćwiczeniami („Please add more exercises … or allow us to create custom ones”, 23.08.2026; „Can't put your own machines in detail”, 04.09.2026). Generator planu, mapa mięśni, gumy oporowe, zapowiedzi głosowe, animacje — nie znalazłem w przeczytanych recenzjach prośby o nie. Musi być prawdą: każda funkcja spoza rdzenia ma albo sygnał (prośby w recenzjach/wsparciu, użycie w lokalnym liczniku bez wysyłania danych pokazywanym przy zgłoszeniu), albo jest wyłączona w 1.0; koszt utrzymania animacji i treści merytorycznych (recenzja każdej karty) jest wliczony.
- Dowód: R (rss-us id464254577), 27.10.2026, curl. Brak prośby w ok. 50 przeczytanych recenzjach to słaby dowód — **otwarte**.

### 11. Wydanie — CI zostaje darmowe tylko przy repo publicznym i standardowych maszynach; limit macOS to 5 równoległych zadań
S4: „GitHub Actions usage is free for self-hosted runners and for public repositories that use standard GitHub-hosted runners.” oraz „Larger runners are always charged for, even when used by public repositories”. S5: plan Free — 20 zadań łącznie, „Maximum concurrent macOS jobs” 5; „Each job in a workflow can run for up to 6 hours”. Musi być prawdą: żaden workflow nie używa większych maszyn, E2E dzielone tak, by mieściło się w 6 h na zadanie i 5 równoległych macOS, a przejście repo na prywatne (np. dla ochrony kodu) jest świadomą decyzją z kosztem.
- Dowód: S4, S5, S6 (macos-26 to standardowy „macOS 3 (M1)”), 27.10.2026, curl.

### 12. Prywatność — publiczne repo i publiczne logi nie mogą zawierać sekretów ani danych osobowych, a polityka prywatności musi istnieć w aplikacji i w sklepie
S2 5.1.1(i): „All apps must include a link to their privacy policy in the App Store Connect metadata field and within the app”. S2 5.1.3(i): dane z HealthKit nie mogą być używane „for advertising, marketing, or other use-based data mining purposes”. Musi być prawdą: polityka prywatności opisuje zapis i odczyt Zdrowia, brak analityki i brak wysyłki danych; skan sekretów działa na każdym pushu, a logi CI nie wypisują identyfikatorów.
- Dowód: S2, 27.10.2026, curl.

### 13. Pieniądze / przepływ — zakupy działają po reinstalacji i na innym urządzeniu, bez konta
S2 3.1.1: „you should make sure you have a restore mechanism for any restorable in-app purchases”; 3.1.2(a): subskrypcja „must provide ongoing value to the customer, and the subscription period must last at least seven days and be available across all of the user’s devices”. Musi być prawdą: przycisk „Przywróć zakupy” widoczny na paywallu, Pro aktywne na iPadzie/zegarku tego samego Apple ID, a „ongoing value” uzasadnione (np. aktualizacje biblioteki), bo aplikacja offline bez serwera jest łatwym celem pytania recenzenta.
- Dowód: S2, 27.10.2026, curl.

### 14. Wydanie — tempo aktualizacji alternatyw wymusza roczny cykl iOS; utrzymanie musi być tanie w czasie właściciela
Ostatnie wersje: A 08.10.2026, B 23.10.2026, C 27.10.2026 (lookup). Recenzja 1★ alternatywy B (US, 26.10.2026): „latest release of iOS 27 causes the phone to use all cpu and overheat”. Musi być prawdą: każda nowa wersja iOS ma przebieg CI na najnowszym obrazie przed premierą systemu, a lista „tylko telefon” na właściciela mieści się w ok. 5–15 min na wydanie; więcej funkcji = dłuższa lista = więcej czasu właściciela.
- Dowód: R (lookup, rss-us id1458862350), 27.10.2026, curl.

### 15. Wzrost / wsparcie — pierwsze tygodnie: oceny i odpowiedzi na recenzje są ważniejsze niż nowe funkcje
Alternatywa C ma w PL 25 ocen przy najwyższej cenie, alternatywy A/B tysiące — mała liczba ocen w PL to norma na starcie, a każda 1★ waży dużo. Musi być prawdą: systemowa prośba o ocenę dopiero po udanym treningu (nie przy pierwszym uruchomieniu), właściciel ma gotowe szablony odpowiedzi na recenzje i e-maile (PL/EN), kanał wsparcia to jeden adres e-mail podany w aplikacji, a zamrożenie funkcji przez pierwsze 2–4 tygodnie poświęcone na poprawki zgłoszeń.
- Dowód: R (lookup pl), 27.10.2026, curl. Czas trwania zamrożenia to propozycja, nie liczba ze źródła — **otwarte**.

## Otwarte pytania
- VAT potrącany przez Apple w PL i kurs USD/PLN do progu 500 USD — sprawdzić w raporcie finansowym App Store Connect.
- Czy sprzedaż subskrypcji przez osobę fizyczną czyni ją „traderem” w rozumieniu DSA i jakie są obowiązki podatkowe w PL — porada prawna/podatkowa.
- Sygnał wartości funkcji spoza rdzenia — przeczytano ok. 50 najnowszych recenzji jednej–dwóch alternatyw; szerszy przegląd recenzji to zadanie pasujące do Gemini (wyniki do sprawdzenia przez badacza).
