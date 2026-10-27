# Soczewka: SCEPTYK RYZYKA — co musi być prawdą w najlepszym w klasie dzienniku treningu (iOS, offline, bez konta)

- Data: 27.10.2026
- Zakres: dane (aktualizacja, migracja, import, przywracanie kopii, „wyczyść wszystko”, awaria w trakcie zapisu), prywatność (Zdrowie, brak sieci, etykieta), pieniądze (cena, waluta, stan po zakupie, przywracanie, wygaśnięcie, Family Sharing), bezpieczeństwo (wskazówki techniki, brak porad medycznych).
- Metoda: patrzenie „od zera” bez otwierania repozytorium; ustalenia to wymagania do sprawdzenia przez audyt, nie stwierdzenia o stanie aplikacji.
- Weryfikacja cytatów: wszystkie cytaty poniżej pobrane 27.10.2026 przez `curl` i sprawdzone na surowym tekście (HTML/JSON po zdjęciu znaczników). W cytatach z dokumentacji Apple nazwy symboli (np. nazwy metod) w oryginale są linkami — zastąpione „[…]”.

## Źródła

Szczebel 1 (dokumentacja źródłowa):
- S1 https://www.sqlite.org/howtocorrupt.html
- S2 https://www.sqlite.org/backup.html
- S3 https://www.sqlite.org/lang_vacuum.html
- S4 https://www.sqlite.org/atomiccommit.html
- S5 https://www.sqlite.org/lang_transaction.html
- S6 https://www.sqlite.org/wal.html
- A1 https://developer.apple.com/documentation/storekit/product/displayprice
- A2 https://developer.apple.com/documentation/storekit/product/price
- A3 https://developer.apple.com/documentation/storekit/storefront
- A4 https://developer.apple.com/documentation/storekit/appstore/sync()
- A5 https://developer.apple.com/documentation/storekit/transaction/currententitlements
- A6 https://developer.apple.com/documentation/storekit/transaction/updates
- A7 https://developer.apple.com/documentation/storekit/supporting-family-sharing-in-your-app
- A8 https://developer.apple.com/documentation/storekit/transaction/revocationdate
- A9 https://developer.apple.com/documentation/healthkit/protecting-user-privacy
- A10 https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data
- A11 https://developer.apple.com/app-store/review/guidelines/ (1.4.1, 3.1.1, 3.1.2(c), 5.1.3)
- A12 https://developer.apple.com/app-store/app-privacy-details/

(Dokumentacja Apple pobrana przez odpowiednik JSON: `https://developer.apple.com/tutorials/data/documentation/<ścieżka>.json`.)

Alternatywy (recenzje z kanału RSS, sortowanie „mostrecent”, strony 1–3, sklepy PL i US):
- Alternatywa A — https://apps.apple.com/pl/app/id464254577
- Alternatywa B — https://apps.apple.com/pl/app/id1458862350
- Alternatywa C — https://apps.apple.com/pl/app/id965383840

Kanał: `https://itunes.apple.com/{pl|us}/rss/customerreviews/page={1..3}/id=<ID>/sortby=mostrecent/json`. Uwaga: polski kanał zwraca głównie recenzje anglojęzyczne; polskojęzycznych skarg na dane/zakupy w próbce nie znaleziono — luka badawcza (próbka 18 stron, nie pełna historia).

## Co musi być prawdą (15 punktów)

### 1. Zapis serii jest atomowy i przeżywa zabicie aplikacji w połowie treningu — obszar: dane
Każdy zapis (seria, zakończenie treningu, import, migracja) w jednej jawnej transakcji; zabicie procesu w dowolnym momencie zostawia stan „przed” albo „po”, nigdy pół.
- S4 (27.10.2026): „SQLite has the important property that transactions appear to be atomic even if the transaction is interrupted by an operating system crash or power failure.”
- S5 (27.10.2026): „No reads or writes occur except within a transaction.” — ale transakcja automatyczna obejmuje jedno polecenie, więc wieloetapowy zapis bez `BEGIN…COMMIT` nie jest atomowy.
- Alternatywa A, US, 2★, wersja 6.4.2, 25.06.2026: „Lost lots of set information after completing a work out.”

### 2. Kopia bazy powstaje mechanizmem SQLite, nie kopiowaniem pliku — obszar: dane
Automatyczna kopia „po każdym treningu” robiona przez Online Backup API albo `VACUUM INTO`, poza otwartą transakcją, z weryfikacją (np. `PRAGMA integrity_check` na kopii) i zapisem atomowym (plik tymczasowy → zmiana nazwy). Surowa kopia pliku w trybie WAL bez pliku `-wal` gubi ostatnie zmiany.
- S1 (27.10.2026): „If the previous write transaction failed, then it is important that any rollback journal (the *-journal file) or write-ahead log (the *-wal file) be copied together with the database file itself.”
- S2 (27.10.2026): „If a power failure or operating system failure occurs while copying the database file the backup database may be corrupted following system recovery.”
- S3 (27.10.2026): „if the VACUUM INTO command is interrupted by an unplanned shutdown or power loss, then the generated output database might be incomplete and corrupt.”

### 3. Przywracanie kopii nigdy nie niszczy bieżących danych bez siatki — obszar: dane / przepływ
Przed przywróceniem: walidacja pliku (format, wersja schematu, integralność), kopia bezpieczeństwa stanu bieżącego, podgląd („X treningów, ostatni z dnia…”), potwierdzenie; przywrócenie w transakcji; kopia z nowszej wersji schematu odrzucona z komunikatem, a nie „naprawiana”.
- S1 (27.10.2026), rozdział „1.2. Backup or restore while a transaction is active” — przywracanie przy aktywnej transakcji jest wymienione jako droga do uszkodzenia bazy.
- Alternatywa C, PL, 2★, wersja 3.47, 24.06.2023: „I changed my phone and I lost all my data” (przeniesienie na nowy telefon = przywrócenie).

### 4. Migracja przy aktualizacji jest transakcyjna, wersjonowana i testowana na prawdziwych starych bazach — obszar: dane / wydanie
Każda wersja schematu ma test „baza z wersji N → N+1 → … → bieżąca” z liczeniem rekordów przed/po; nieudana migracja wycofuje się i zostawia starą bazę (plus kopia przed migracją). Aktualizacja SDK nie łączy się ze zmianą schematu.
- S4 (27.10.2026) jak w p. 1 — atomowość dotyczy pojedynczej transakcji, więc cała migracja musi być jedną.
- Alternatywa A, US, 1★, wersja 6.5.0, 24.09.2026: „recently my workout history has disappeared” (wieloletni użytkownik, po aktualizacji).
- Alternatywa C, US, 1★, wersja 3.37, 15.06.2022: „Was my favorite app for years, until it decided to lose all my data.”

### 5. Import (kopia, CSV z innych dzienników) jest idempotentny i podglądany — obszar: dane / przepływ
Import nie tworzy duplikatów przy powtórzeniu, nie nadpisuje istniejących treningów, mapuje jednostki (kg/lb) i nazwy ćwiczeń jawnie, pokazuje podsumowanie przed zapisem i raport odrzuconych wierszy; całość w jednej transakcji (wszystko albo nic).
- S5 (27.10.2026) — jak w p. 1.
- Alternatywa C, PL, 2★, 24.06.2023: „in deadlift I only have 0 kg x 2 reps” — przykład danych „przeniesionych”, ale zepsutych (wartości zerowe zamiast błędu).

### 6. „Wyczyść wszystko” jest odwracalne albo poprzedzone wymuszoną kopią — obszar: dane / przepływ
Destrukcyjna akcja: osobne potwierdzenie z nazwą skutku, automatyczna kopia tuż przed, informacja gdzie ta kopia leży; nie kasuje kopii w Plikach. Brak konta = brak serwera, z którego da się odzyskać — jedyną siatką są kopie lokalne.
- Wniosek z S2/S1 (27.10.2026) jak w p. 2 — siatka ma sens tylko, jeśli kopia jest spójna.
- Alternatywa C, US, 1★, 30.03.2026 (wątek „deleted my account”) — pokazuje, że użytkownicy mylą usunięcie danych/konta z rezygnacją z subskrypcji; komunikaty muszą to rozdzielać (zob. p. 12).

### 7. Kopia w Plikach nie zawiera danych odczytanych ze Zdrowia — obszar: prywatność
Jeśli kopia/eksport trafia do iCloud Drive (domyślna lokalizacja Plików), nie może zawierać danych zdrowotnych odczytanych z HealthKit (np. masa ciała, tętno) — albo jest to jawnie wyłączone/oddzielone. Eksport ręczny z wyborem miejsca przez użytkownika — z ostrzeżeniem.
- A11, 5.1.3(ii) (27.10.2026): „Apps must not write false or inaccurate data into HealthKit or any other medical research or health management apps, and may not store personal health information in iCloud.”
- Ryzyko otwarte: zakres pojęcia „store … in iCloud” wobec pliku zapisanego przez użytkownika w iCloud Drive — do rozstrzygnięcia (ryzyko odrzucenia przez Apple = próg WYSOKI).

### 8. Zdrowie: brak uprawnienia do odczytu wygląda jak brak danych — UI tego nie myli — obszar: prywatność / przepływ
Aplikacja nie twierdzi „brak danych w Zdrowiu” ani „odmówiłeś dostępu”, bo tego nie wie; pokazuje neutralny stan i drogę do Ustawień. Zapis do Zdrowia tylko danych prawdziwych (bez szacunków jako pomiarów), bez duplikatów po przywróceniu kopii lub reimporcie.
- A10 (27.10.2026): „your app doesn’t know whether someone granted or denied permission to read data.”
- A9 (27.10.2026): „To prevent possible information leaks, an app isn’t aware when the user denies permission to read data. From the app’s point of view, no data of that type exists.”
- A11, 5.1.3(ii) — zakaz zapisu fałszywych lub niedokładnych danych do HealthKit (cytat w p. 7).
- Alternatywa B, US, 3★, wersja 3.2.2, 22.10.2026: „half the time it won’t connect to Apple health or my watch.”

### 9. Etykieta prywatności „Dane nie są zbierane” jest prawdziwa także dla bibliotek — obszar: prywatność / wydanie
Zero wysyłki danych poza urządzenie przez kod własny i zewnętrzne biblioteki (raporty awarii, analityka, czcionki/obrazy z sieci); aplikacja działa w trybie samolotowym w każdym przepływie (poza zakupem). Strażnik: lista uprawnień sieciowych / test w trybie offline / przegląd zależności przed wydaniem.
- A12 (27.10.2026): „“Collect” refers to transmitting data off the device in a way that allows you and/or your third-party partners to access it for a period longer than what is necessary to service the transmitted request in real time.”
- A12 (27.10.2026): „You need to identify all of the data you or your third-party partners collect, unless the data meets all of the criteria for optional disclosure listed below.”
- A11, 5.1.3(i) (27.10.2026): „Apps may not use or disclose to third parties data gathered in the health, fitness, and medical research context […] for advertising, marketing, or other use-based data mining purp[oses]”.

### 10. Cena pokazywana = cena pobierana, w walucie sklepu użytkownika — obszar: pieniądze
Każda cena w UI (ekran Pro, porównanie planów, „oszczędzasz X%”) pochodzi z `displayPrice` bieżącego produktu; brak cen wpisanych na sztywno w tekstach, tłumaczeniach, zrzutach i opisie sklepu; procent oszczędności liczony z `price` (Decimal), nie z tekstu; storefront czytany tuż przed pokazaniem, nie zapamiętywany. Polska: zł; użytkownik z innym storefrontem widzi swoją walutę.
- A1 (27.10.2026): „Use this string to display the price, formatted for the locale. The storefront that the user’s device is connected to determines the locale.”
- A2 (27.10.2026): „Use this property to perform arithmetic calculations with the price of the product.”
- A3 (27.10.2026): „Don’t save the storefront information with your customer information because storefront information can change at any time. Get the storefront identifier immediately before you display product information or availability in your app.”
- A11, 3.1.2(c) (27.10.2026): „Before asking a customer to subscribe, you should clearly describe what the user will get for the price.”

### 11. Stan Pro wynika wyłącznie z bieżących uprawnień StoreKit — także po reinstalacji, zwrocie, wygaśnięciu i offline — obszar: pieniądze
Odblokowanie liczone z `Transaction.currentEntitlements` przy starcie i z nasłuchu `Transaction.updates` od startu; zwrot/odebranie (revocation) i wygaśnięcie odbierają Pro bez utraty danych (dane i eksport zostają, blokuje się tylko nowe dni ponad limit); dożywotni nie znika po reinstalacji; przycisk „Przywróć zakupy” (wywołanie `AppStore.sync()` tylko na żądanie).
- A5 (27.10.2026): „Products that the App Store has refunded or revoked don’t appear in the current entitlements.”
- A6 (27.10.2026): „If your app has unfinished transactions, the listener receives them once, immediately after the app launches. Without the […] to listen for these transactions, your app may miss them.”
- A4 (27.10.2026): „Include some mechanism in your app, such as a Restore Purchases button, to let users restore their Apple In-App Purchases.” oraz „When users reinstall your app or download it on a new device, the app automatically has all transactions available to it upon initial launch.”
- A11, 3.1.1 (27.10.2026): „you should make sure you have a restore mechanism for any restorable in-app purchases.”
- Alternatywa A, US, 1★, 26.06.2026: „I highly regret paying for the lifetime plan years ago and wish I hadn’t wasted that money.”

### 12. Limit darmowy (5 dni treningowych / miesiąc) nigdy nie blokuje dostępu do już zapisanych danych ani kopii — obszar: pieniądze / dane
Po przekroczeniu limitu lub wygaśnięciu Pro: historia, eksport JSON/CSV, kopia i przywracanie działają; trening rozpoczęty przed przekroczeniem da się zapisać do końca (bez utraty serii w połowie). Reguła liczenia „dnia treningowego” (strefa czasowa, trening po północy, trening usunięty, import historii) jest jednoznaczna i przetestowana. Rezygnacja z subskrypcji to akcja w ustawieniach Apple — aplikacja wyjaśnia to wprost.
- A8 (27.10.2026): „The date that the App Store refunded the transaction or revoked it from Family Sharing.” — odebranie uprawnienia jest normalnym stanem, nie błędem.
- Alternatywa C, US, 1★, 30.03.2026: „I didn’t care for the app so I deleted my account and canceled my subscription through Apple yet the app is continuing to charge me.”
- Alternatywa C, US, 1★, 12.11.2023: „Free timer feature is now charged monthly” — przenoszenie wcześniej darmowych funkcji za paywall generuje skargi (ryzyko reputacyjne przy zmianie limitu).

### 13. Family Sharing działa w obie strony: udostępnienie i cofnięcie — obszar: pieniądze
Członek rodziny dostaje Pro bez osobnego zakupu; po cofnięciu udostępnienia (revocation) traci Pro bez utraty danych; ekran Pro informuje, czy dany produkt jest objęty Family Sharing (np. dożywotni vs subskrypcja — zgodnie z ustawieniem w App Store Connect).
- A7 (27.10.2026): „Family Sharing allows a customer to share access to auto-renewable subscriptions or non-consumables with up to five family members on all of their Apple devices.”
- A7 (27.10.2026): „Then inform users when merchandising your subscriptions.” (po sprawdzeniu, czy produkt wspiera Family Sharing) oraz wymóg obsługi sytuacji, „in which products are no longer shared”.

### 14. Wskazówki techniki nie są poradą medyczną i nie obiecują bezpieczeństwa — obszar: treść / bezpieczeństwo
Karty ćwiczeń: ustawienie, przebieg, częste błędy — bez diagnoz, bez „to wyleczy/zapobiegnie kontuzji”; przy bólu i urazie odesłanie do specjalisty; animacja zgodna z tekstem (błędna animacja = błędne twierdzenie). Liczby (tempo, kąty, obciążenia) tylko ze źródłami; każda treść przechodzi recenzję przed pokazaniem.
- A11, 1.4 (27.10.2026): „If your app behaves in a way that risks physical harm, we may reject it.”
- A11, 1.4.1 (27.10.2026): „Apps should remind users to check with a doctor in addition to using the app and before making medical decisions.”
- Wniosek: aplikacja nie jest medyczna, ale 1.4 dotyczy każdej aplikacji — błędna wskazówka techniki to ryzyko fizyczne i ryzyko odrzucenia.

### 15. Wydanie blokuje każda regresja w danych lub zakupach, sprawdzona na produkcie, nie na mockach — obszar: wydanie / wzrost
Przed każdym wydaniem: test „aktualizacja z poprzedniej wersji ze sklepu z prawdziwą bazą” (liczba treningów przed = po), przywrócenie kopii z poprzedniej wersji, zakup/przywrócenie/wygaśnięcie w sandboxie dla storefrontu PL i innego, odczyt/zapis Zdrowia z odmową i zgodą, tryb samolotowy. Skargi „straciłem historię” i „zapłaciłem, nie działa” to w próbce alternatyw najczęstsze 1★ — dla aplikacji bez konta (brak odzyskiwania z serwera) to ryzyko egzystencjalne dla zaufania i poleceń.
- Alternatywa A, US, 1★, 03.06.2026: „I’ll mark a set as done on my phone then my watch won’t see it so I do it there, then I go back to my phone and I’ve lost like 5 sets and have to re-enter them.”
- Alternatywa A, US, 3★, 23.04.2026: „It’s lost lost data numerous times. And after probably 10 years, I’m switching to another app.”
- S6 (27.10.2026): „All processes using a database must be on the same host computer; WAL does not work over a network filesystem.” — bazy nie wolno trzymać bezpośrednio w iCloud Drive/Plikach; kopia tak, baza robocza nie (dotyczy też przyszłego rozszerzenia na zegarek/widżet: jedna baza, jeden właściciel zapisu).

## Otwarte pytania (nie rozstrzygnięte źródłem)
- Czy plik kopii zapisany przez użytkownika w iCloud Drive, zawierający dane odczytane z HealthKit, narusza 5.1.3(ii) — brak wprost wyjaśnienia Apple w przeczytanych źródłach (p. 7).
- Brak polskojęzycznych recenzji o utracie danych/zakupach w próbce RSS — nie wiemy, czy rynek PL zgłasza inne problemy (np. waluta, ceny regionalne).
