# Soczewka: recenzent w sklepie (App Review) + użytkownik konkurencji czytający opinie

- **Data odczytu:** 27.10.2026
- **Zakres:** ustalenie od zera, co musi być prawdą, żeby iOS-owy dziennik treningu siłowego (offline, bez konta, rynek główny PL, freemium 5 dni/mies., Pro: miesięczny / roczny auto-odnawialny / dożywotni, Family Sharing, Apple Health, Watch, Live Activity, import CSV, 35 języków) przeszedł App Review bez odrzucenia i nie powtarzał najczęstszych skarg z opinii alternatyw. Repozytorium aplikacji nie było czytane — punkty to wymagania do sprawdzenia, nie ocena kodu.
- **Metoda cytatów:** wszystkie cytaty pobrane `curl` i sprawdzone na surowym tekście (HTML wytycznych po zdjęciu znaczników; dokumentacja Apple z jej źródła JSON; opinie z kanału RSS JSON). Cytaty w oryginale (EN), najwyżej 1–2 zdania.

## Źródła

| ID | Adres | Uwagi |
|---|---|---|
| S1 | https://developer.apple.com/app-store/review/guidelines/ | App Store Review Guidelines, stopka strony: „Last Updated: October 16, 2026”; odczyt 27.10.2026 |
| S2 | https://developer.apple.com/documentation/storekit/product/displayprice | StoreKit `Product.displayPrice` |
| S3 | https://developer.apple.com/documentation/storekit/storefront | StoreKit `Storefront` |
| S4 | https://developer.apple.com/documentation/storekit/appstore/sync() | StoreKit `AppStore.sync()` (przywracanie) |
| S5 | https://developer.apple.com/documentation/storekit/supporting-family-sharing-in-your-app | Family Sharing w StoreKit |
| S6 | https://developer.apple.com/documentation/storekit/product/isfamilyshareable | `isFamilyShareable` |
| S7 | https://developer.apple.com/documentation/storekit/implementing-offer-codes-in-your-app | Kody ofertowe |
| S8 | https://developer.apple.com/design/human-interface-guidelines/in-app-purchase (przekierowanie na …/apple-in-app-purchase) | HIG: Apple In-App Purchase (subskrypcje, ekran zakupu, zwroty, Family Sharing, kody) |
| RA | https://apps.apple.com/us/app/id1458862350 — RSS: https://itunes.apple.com/{pl,us}/rss/customerreviews/page={1..5}/id=1458862350/sortby=mostrecent/json | alternatywa A |
| RB | https://apps.apple.com/us/app/id464254577 — RSS jw. z id=464254577 | alternatywa B |
| RC | https://apps.apple.com/us/app/id449810000 — RSS jw. z id=449810000 | alternatywa C |

Próba opinii (odczyt 27.10.2026): do 5 stron × 50 najnowszych opinii na sklep PL i US, oceny 1–3★, bez duplikatów. Wynik: A — 12, B — 98, C — 122 opinie krytyczne. Zgrubne liczenie słów kluczowych (orientacyjne, nie statystyka): Watch/synchronizacja A 5, B 53, C 13; płatność/paywall A 1, B 20, C 36; utrata danych A 1, B 14, C 21; bateria/przegrzanie A 4; konto/internet/logowanie B 7, C 10; wyskakujące okna/powiadomienia/upsell C 12. Kanał PL dla B i C jest rzadki (pierwsza strona sięga 2020 i 2015) i w większości anglojęzyczny — polski głos użytkowników w tej próbie jest słaby (otwarte: research polskich opinii — zadanie pasujące do zlecenia Gemini wg CLAUDE.md).

## Co musi być prawdą (15 punktów)

### 1. Ekran zakupu pokazuje dla każdej opcji nazwę, okres, zakres i cenę całkowitą z App Store — przed przyciskiem kupna
**Obszar:** pieniądze, wydanie
- Wymóg: przed prośbą o subskrypcję jasno, co użytkownik dostaje za cenę; spełnienie Schedule 2 umowy licencyjnej. S1, 3.1.2(c): „Before asking a customer to subscribe, you should clearly describe what the user will get for the price.” (27.10.2026)
- HIG wymienia elementy obowiązkowe ekranu: nazwa, okres, treść usługi w okresie, kwota „correctly localized”, sposób przywrócenia. S8: „Display the total billing price for each in-app purchase you offer, regardless of type.” (27.10.2026)
- Konsekwencja: miesięczny, roczny (z informacją o automatycznym odnawianiu) i dożywotni (jednorazowo) — każda opcja z kwotą do zapłaty jako najbardziej widocznym elementem; ewentualne „miesięcznie wychodzi…” tylko w pozycji podrzędnej. Linki do regulaminu (EULA) i polityki prywatności na ekranie zakupu i w metadanych (S8: „including links to your Terms of Service and Privacy Policy in your app and App Store metadata”).

### 2. Ceny w aplikacji pochodzą wyłącznie z `Product.displayPrice` dla bieżącego storefrontu — żadnej kwoty w PLN wpisanej na sztywno
**Obszar:** pieniądze, treść
- S2: „The storefront that the user’s device is connected to determines the locale.” (27.10.2026)
- S3: „Get the storefront identifier immediately before you display product information or availability in your app.” oraz zakaz zapisywania storefrontu z danymi klienta (27.10.2026).
- Konsekwencja: przy 35 językach i cenach przeliczanych przez Apple w innych krajach żaden tekst (także w tłumaczeniach i wiadomościach marketingowych w aplikacji) nie zawiera „4,99 zł”, „19,99 zł”, „59,99 zł”. Test: każda kwota w UI pochodzi z StoreKit; sandbox z innym krajem pokazuje walutę tego kraju. Arytmetyka (np. cena roczna/12) na `Product.price`, nie na tekście (S2/`price`: „Use this property to perform arithmetic calculations”).

### 3. Porównanie ceny planu miesięcznego do espresso jest prawdziwe w każdym storefroncie albo znika
**Obszar:** treść, pieniądze, wydanie
- S1, 2.3.1(a): wprowadzanie w błąd, w tym „promoting a false price, whether within or outside of the App Store, is grounds for removal” (27.10.2026).
- S1, 2.3.7: nie pakować metadanych „pricing information, or other irrelevant phrases”; nazwy, podtytuły, zrzuty i podglądy „should not include prices” (27.10.2026). S1, 2.3.14: zasoby kreatywne bez „specific or discounted pricing information”.
- Ryzyko: cena miesięczna w innych krajach jest przeliczana przez Apple (i zmienia się przy korektach kursów), a cena espresso różni się między krajami — porównanie przypięte do jednego kraju (Włochy) w opisie 35 wersji językowych może być w części storefrontów nieprawdziwe. Warunek: porównanie tylko w opisie (nigdy w podtytule, zrzucie, podglądzie, nazwie IAP), z liczbą i źródłem ceny espresso sprawdzonymi dla każdego storefrontu, w którym opis go zawiera; inaczej — wariant bez porównania. Liczba „cena espresso we Włoszech” wymaga przeczytanego źródła i daty (zasada merytoryczna projektu) — **otwarte**.

### 4. Przywracanie zakupów jest widoczne na ekranie zakupu i w ustawieniach; uprawnienia działają automatycznie po reinstalacji, offline i na nowym urządzeniu
**Obszar:** pieniądze, dane, przepływ
- S1, 3.1.1: „you should make sure you have a restore mechanism for any restorable in-app purchases.” (27.10.2026)
- S4: „Include some mechanism in your app, such as a Restore Purchases button, to let users restore their Apple In-App Purchases.” oraz: wywoływać `sync()` tylko „in response to an explicit user action” (27.10.2026).
- S4: po reinstalacji „the app automatically has all transactions available to it upon initial launch” — więc Pro ma się włączyć bez klikania; przycisk „Przywróć” to ratunek, nie jedyna droga.
- Konsekwencja dla aplikacji offline: stan Pro z `Transaction.currentEntitlements` musi działać bez sieci (bez fałszywego „wygasło” na siłowni bez zasięgu). Skarga z opinii (C, US, 04.09.2026, RC): „My gym doesn’t have service in it, meaning I can only use the app in airplane mode.”

### 5. Pro działa na wszystkich urządzeniach użytkownika, w tym na Apple Watch, a zakup dożywotni i subskrypcja nie dublują się
**Obszar:** pieniądze, przepływ
- S1, 3.1.2(a): subskrypcja „must … be available across all of the user’s devices” oraz „Subscriptions must work on all of the user’s devices where the app is available.” (27.10.2026)
- S1, 3.1.2(b): użytkownik „should not be able to inadvertently subscribe to multiple variations of the same thing.” (27.10.2026)
- S8: „Encourage a new subscription only when someone isn’t already a subscriber.” (27.10.2026)
- Konsekwencja: (a) aplikacja na zegarku honoruje Pro z telefonu (iPad, jeśli dostępny, też); (b) posiadacz aktywnej subskrypcji nie widzi zachęt do zakupu; (c) przy zakupie dożywotniego przy aktywnej subskrypcji aplikacja mówi wprost, że subskrypcję trzeba anulować w ustawieniach Apple (wniosek z 3.1.2(b) — StoreKit nie anuluje jej sam; do potwierdzenia w dokumentacji przy implementacji — **otwarte**). Miesięczny ↔ roczny w jednej grupie subskrypcji (upgrade/downgrade bez podwójnej opłaty).

### 6. Zarządzanie i anulowanie subskrypcji oraz prośba o zwrot są łatwo dostępne z ustawień aplikacji
**Obszar:** pieniądze, przepływ
- S8: „Always make it easy for customers to cancel an auto-renewable subscription.” oraz „If the manage subscription action is deep within an app — or hard to recognize — subscribers can feel they’re being discouraged or prevented from canceling.” (27.10.2026)
- S8 (zwroty): „make sure this content doesn’t create a barrier to requesting a refund” i „Avoid characterizing or providing guidance on Apple’s refund policies.” (27.10.2026)
- Konsekwencja: w ustawieniach „Zarządzaj subskrypcją” (systemowy arkusz StoreKit) i „Poproś o zwrot” (systemowy przepływ), bez obietnic co do decyzji Apple. Skarga (C, PL, 01.03.2025, RC): „It’s not possible to buy 1 month membership they force to buy for the 3 year membership.”

### 7. Family Sharing: włączone świadomie (nieodwracalnie), oznaczone przy produktach, a odebranie dostępu obsłużone
**Obszar:** pieniądze, przepływ, treść
- S5: „After you enable Family Sharing for an Apple In-App Purchase, you can’t turn it off.” (27.10.2026) — decyzja produktowa przed włączeniem, osobno dla każdego z trzech produktów.
- S6: „When displaying Apple In-App Purchases in your app, indicate whether the product includes Family Sharing” (27.10.2026). S8: „Prominently mention Family Sharing in places where people learn about the content you offer.”
- S5: obsłużyć sytuację, gdy produkt przestaje być udostępniany („handle conditions in which products are no longer shared”) — w aplikacji bez serwera: odświeżanie uprawnień przy starcie/powrocie z tła; członek rodziny traci Pro, ale nie dane (patrz pkt 9).
- Konsekwencja dla opisu: deklaracja „Family Sharing” w opisie sklepu jest prawdziwa tylko, jeśli flaga jest włączona dla każdego produktu, który opis obejmuje (2.3.1(a)).

### 8. Kody ofertowe: albo realizowane w aplikacji systemowym arkuszem, albo opis i wsparcie nie obiecują tej drogi
**Obszar:** pieniądze, wzrost
- S7: „Offer codes are available for all Apple In-App Purchase types” i realizacja „in the App Store, using offer code redemption URLs, or in your app” (27.10.2026). S8: „the only custom UI you need to create is one that initiates the system-provided flow.”
- S8: przygotować się na osoby, które „subscribe before they open your app for the first time” — Pro aktywne od pierwszego uruchomienia po realizacji kodu w App Store.
- Konsekwencja: przycisk „Zrealizuj kod” w ustawieniach (systemowy arkusz), stan Pro po realizacji poza aplikacją odświeżany listenerem transakcji. Kody to tani kanał wzrostu (trenerzy, kluby) bez zbierania danych.

### 9. Darmowy limit (5 dni treningowych/mies.) nigdy nie zakłada blokady na dane: historia, kopia, eksport i przywracanie kopii zawsze działają, a przekroczenie limitu nie gubi rozpoczętego treningu
**Obszar:** dane, pieniądze, przepływ
- S1, 3.1.2(a): nie odbierać podstawowej funkcji, za którą użytkownik już zapłacił, przy zmianie modelu (27.10.2026). S8 dopuszcza „metered paywall” i zachętę „when they near their monthly limit of free content” (27.10.2026).
- Skargi: (B, US, 16.06.2026, RB) „All of my years of data are gone. My workouts are gone.”; (C, US, 01.09.2026, RC) „Insane work to charge a subscription for features that used to be free.”; (C, US, 04.07.2026, RC) rezygnacja po „snarky — customer service when I was trying to export some data.”
- Konsekwencja: limit liczony jednoznacznie (co jest „dniem treningowym”, strefa czasowa, zmiana miesiąca — reguła w jednym miejscu, z testem); trening rozpoczęty przed przekroczeniem kończy się i zapisuje; komunikat o limicie z wyprzedzeniem, nie w środku serii; po wygaśnięciu Pro lub odebraniu Family Sharing dane zostają i są widoczne/eksportowalne. Opis „historia, kopia i eksport zawsze darmowe” musi być prawdziwy w każdym stanie (darmowy, po limicie, po wygaśnięciu).

### 10. Opis w sklepie odpowiada dokładnie temu, co działa w tej wersji i w tym storefroncie (35 języków, import CSV, Watch, Live Activity)
**Obszar:** treść, wydanie
- S1, 2.3: metadane „accurately reflect the app’s core experience” i mają być aktualizowane z wersjami (27.10.2026).
- S1, 2.3.2: opis, zrzuty i podglądy „clearly indicate whether any featured items, levels, subscriptions, etc. require additional purchases.” (27.10.2026)
- S1, 2.1(b): zakupy „complete, up-to-date, visible to the reviewer and functional” (27.10.2026). S1, 2.3.1(a): nowe funkcje opisane konkretnie w Notes for Review.
- Konsekwencja: przy każdej funkcji z opisu jasne „darmowe / Pro” (np. czy Watch i Live Activity są w darmowej wersji); „35 języków” = 35 pełnych lokalizacji UI, nie tylko opis; „import CSV z popularnych dzienników” — bez nazw innych aplikacji (2.3.7: nie wolno pakować metadanych „popular app names”); notatka dla recenzenta mówi, jak dojść do ekranu zakupu (np. 6. dzień treningowy) i jak przetestować import (plik przykładowy).

### 11. Apple Health: tylko potrzebne typy, zgoda opcjonalna, nic płatnego nie zależy od zgody, zero wykorzystania marketingowego, zapis wyłącznie prawdziwych danych
**Obszar:** prywatność, dane
- S1, 5.1.1(ii): „Paid functionality must not be dependent on or require a user to grant access to this data.” (27.10.2026)
- S1, 5.1.3(ii): „Apps must not write false or inaccurate data into HealthKit … and may not store personal health information in iCloud.” (27.10.2026)
- S1, 5.1.3(i): ujawnić „the specific health data that you are collecting from the device” (27.10.2026). S1, 2.5.1: HealthKit „should be used for health and fitness purposes and integrate with the Health app” oraz integracja wskazana w opisie.
- Skarga o zawyżonych danych zapisywanych do zdrowia (A, PL, 22.09.2026, RA): „Not hard 2h exercise shows over 1000 kcal burned??”
- Konsekwencja: zapis do Zdrowia tylko tego, co aplikacja wie (rodzaj, czas trwania; kalorie wyłącznie z pomiaru systemu/zegarka, nie z własnego szacunku bez źródła); kopia zapasowa zawierająca dane ze Zdrowia nie trafia automatycznie do iCloud (dotyczy też kopii aplikacji, jeśli zawiera dane odczytane z HealthKit — do sprawdzenia przy kopii — **otwarte**); teksty uprawnień (purpose strings) mówią dokładnie, co i po co.

### 12. Etykieta prywatności, polityka prywatności i rzeczywisty ruch sieciowy są zgodne z „bez konta, reklam i śledzenia”
**Obszar:** prywatność, wydanie
- S1, 5.1.1(i): link do polityki prywatności w App Store Connect i w aplikacji; polityka wymienia zbierane dane, retencję i sposób usunięcia (27.10.2026).
- S1, 2.3: „all your app metadata, including privacy information” ma być dokładne (27.10.2026). S1, 5.1.1(v): bez logowania, jeśli brak istotnych funkcji kontowych.
- Skargi: (B, US, 23.10.2026, RB) „Unable to change password. … Can’t log in any longer.”; (C, US, 14.05.2026, RC) „This app was directly tied to a data breach where my information was exposed.”
- Konsekwencja: zero SDK analitycznych/raportowania awarii wysyłających dane bez zgody; etykieta „Data Not Collected” tylko, jeśli to prawda także dla Watch, widżetów i Live Activity; polityka opisuje kopię/eksport i to, że usunięcie aplikacji usuwa dane lokalne. Dowód automatyczny: test braku połączeń sieciowych poza StoreKit (do zaprojektowania).

### 13. Live Activity, Watch i timer przerw są niezawodne i oszczędne — to główny powód skarg i zmian aplikacji u alternatyw
**Obszar:** przepływ, dane, wydanie
- S1, 2.4.2: aplikacje „should not rapidly drain battery, generate excessive heat” (27.10.2026). S1, 2.5.16: widżety i rozszerzenia „related to the content and functionality of your app”.
- Skargi: (A, PL, 17.03.2026, RA) „22% battery after 1 hour and 2 minutes of background use at the gym.”; (A, US, 26.10.2026, RA) „Shouldn’t be that resource intensive to run a timer and let me input a lift.”; (B, US, 03.03.2026, RB) „the outdated watch data overwrote the data on my phone”; (B, US, 24.04.2026, RB) przejście do konkurencji, bo „they never built Dynamic Island and lock screen access.”
- Konsekwencja: synchronizacja telefon↔zegarek nigdy nie nadpisuje nowszych serii starszymi (reguła scalania z testem), brak utraty serii przy zerwaniu połączenia, timer na ekranie blokady zgodny z czasem w aplikacji; pomiar zużycia baterii w typowej 60–90-min sesji jako krok listy „tylko telefon”; regresja po każdej dużej wersji iOS (skarga A, US, 20.10.2026: „Every single major iOS update breaks the sync with my Apple Watch and Apple health.”).

### 14. Szacunek dla uwagi: zakup proponowany w naturalnym momencie, bez serii okien przed treningiem i bez manipulacji
**Obszar:** wzrost, pieniądze
- S1, 3.1.2(a): aplikacje próbujące „trick users into purchasing a subscription under false pretenses or engage in bait-and-switch” są usuwane (27.10.2026).
- S8: własny ekran zakupu musi mieć „a Close or Cancel button that lets people return to your free content”; zachęty „at relevant times, like when they near their monthly limit” (27.10.2026).
- Skargi: (C, US, 05.07.2026, RC) „The app shows way too many pop-ups before you can actually start to work out”; (C, US, 16.07.2026, RC) „designed to make you frustrated with the free version”; (C, US, 12.10.2026, RC) „Tricked me while using free version”.
- Konsekwencja: paywall nigdy nie przerywa trwającej serii; przycisk „Anuluj” zawsze widoczny (zbieżne z zasadą projektu o oknach modalnych); żadnych liczników „oferta wygasa”, jeśli nie są prawdą; powiadomienia tylko funkcjonalne (timer), nigdy sprzedażowe bez zgody.

### 15. Bez porad medycznych i bez monetyzowania funkcji systemu jako takich; aplikacja wnosi wyraźnie więcej niż prosty timer
**Obszar:** treść, wydanie
- S1, 1.4.1: aplikacje mogące podawać nieprecyzyjne informacje zdrowotne „may be reviewed with greater scrutiny” (27.10.2026) — aplikacja ma odsyłać do specjalisty przy bólu/kontuzji i nie diagnozować.
- S1, 4.10: „You may not monetize built-in capabilities provided by the hardware or operating system” (27.10.2026). Ryzyko interpretacyjne: jeśli Pro odblokowuje wyłącznie „dostęp do Zdrowia” albo „powiadomienia/Live Activity” jako takie, recenzent może to odczytać jako monetyzację funkcji systemu. Bezpieczniej: Pro = nieograniczona liczba dni treningowych (wartość aplikacji), a integracje systemowe dostępne w obu wersjach albo wyraźnie jako część szerszej funkcji aplikacji — **decyzja produktowa dla właściciela** (opcje: A — integracje darmowe, Pro tylko limit dni [rekomendacja: najmniejsze ryzyko 4.10 i skarg „paywall”]; B — część integracji w Pro, z uzasadnieniem w Notes for Review).
- S1, 4.3(b) (Spam): kategorie „simple timers” są nasycone; recenzent oczekuje „meaningfully different or improved experience” (27.10.2026). Opis i zrzuty mają pokazywać dziennik (historia, progres, import), nie sam timer.
- Skarga pokazująca oczekiwanie rynku (C, US, 24.06.2026, RC): „I don’t need a plan! I already have my workouts I just wanted to track them.” — prosty dziennik bez wymuszonego kwestionariusza jest przewagą, którą warto pokazać na pierwszym zrzucie.

## Otwarte pytania (do rozstrzygnięcia poza tą soczewką)
1. Źródło i data ceny espresso we Włoszech oraz prawdziwość porównania w każdym storefroncie (pkt 3).
2. Zachowanie StoreKit przy zakupie dożywotnim przy aktywnej subskrypcji — potwierdzenie w dokumentacji Apple (pkt 5).
3. Czy kopia zapasowa aplikacji może zawierać dane odczytane z HealthKit i trafić do iCloud (pkt 11, 5.1.3(ii)).
4. Polskojęzyczne opinie alternatyw — próba RSS PL dla B i C jest stara i nieliczna (research do zlecenia).
5. Treść Schedule 2 umowy licencyjnej (wymagane ujawnienia przy subskrypcji) — nieprzeczytana w tej soczewce; 3.1.2(c) do niej odsyła.
