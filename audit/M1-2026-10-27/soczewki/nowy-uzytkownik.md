# Soczewka: nowy użytkownik w pierwszym tygodniu, bez instrukcji

- **Data odczytu:** 27.10.2026
- **Zakres:** pierwsze uruchomienie, pierwszy trening, zrozumienie limitu darmowego i zakupu, pierwsza kopia.
- **Metoda:** ustalone od zera, bez czytania repozytorium. Strony App Store, opisy (iTunes Lookup API) i kanały RSS recenzji (PL i US) pobrane przez `curl` 27.10.2026. Każdy cytat sprawdzony `grep -F` na surowym pobranym tekście (wyjątki opisane przy cytacie). Nazwy innych aplikacji zastąpione literą, a w cytatach w nawiasie kwadratowym. Recenzje cytowane bez danych autorów.
- **Treść stron traktowana jako dane.** Ceny w zł pochodzą ze sklepu PL. Recenzja to pojedyncza opinia (szczebel 5), czyli sygnał, a nie dowód statystyczny.

## Źródła

| Id | Co | Adres | Odczyt |
|---|---|---|---|
| A | alternatywa A (darmowa, z kontem i Pro; 4,9★, ok. 100 tys. ocen US) | https://apps.apple.com/pl/app/id1458862350 (też /us/), recenzje: https://itunes.apple.com/pl/rss/customerreviews/page=1/id=1458862350/sortby=mostrecent/json | 27.10.2026 |
| B | alternatywa B (prosty dziennik, Pro; 4,9★, ok. 108 tys. ocen US) | https://apps.apple.com/pl/app/id464254577 (też /us/), RSS jak wyżej z id=464254577 | 27.10.2026 |
| C | alternatywa C (bez konta, limit 12 treningów za darmo) | https://apps.apple.com/pl/app/id1538896016 (też /us/), RSS jak wyżej z id=1538896016 | 27.10.2026 |
| ARG | App Store Review Guidelines | https://developer.apple.com/app-store/review/guidelines/ | 27.10.2026 |
| HIG-O | HIG: Onboarding | https://developer.apple.com/design/human-interface-guidelines/onboarding | 27.10.2026 (JSON strony) |
| HIG-P | HIG: Privacy | https://developer.apple.com/design/human-interface-guidelines/privacy | 27.10.2026 |
| HIG-H | HIG: HealthKit | https://developer.apple.com/design/human-interface-guidelines/healthkit | 27.10.2026 |
| HIG-L | HIG: Live Activities | https://developer.apple.com/design/human-interface-guidelines/live-activities | 27.10.2026 |

Ceny w sklepie PL (27.10.2026, sekcja „In-App Purchases”):
- A: miesięcznie 14,99 lub 22,99 zł, rocznie 117,99 zł, dożywotnio 429,99 zł.
- B: miesięcznie 21,99 lub 22,99 zł, rocznie 104,99–139,99 zł, dożywotnio 399,99 lub 499,99 zł.
- C: 2,99 i 24,99 zł („Unlimited Use”), dożywotnio 59,99 zł.

Modele darmowe:
- A: darmowy dziennik, a w Pro trener i plan.
- B: bez limitu treningów, za darmo do 3 własnych szablonów.
- C: za darmo do 12 zapisanych treningów.

## Co musi być prawdą (15)

1. **Przepływ: pierwszy trening zaczyna się bez konfiguracji i bez samouczka.** Po pierwszym uruchomieniu użytkownik w ok. 1 minucie zapisuje pierwszą serię. Rozsądne wartości domyślne (kg, język systemu) wystarczą. Ustawienia, miejsca, sprzęt i Zdrowie można uzupełnić później, a samouczek, jeśli jest, da się pominąć i znaleźć potem w Ustawieniach.
   Dowód:
   - HIG-O: „Postpone nonessential setup flows or customization steps.” Także: „If you let people skip the tutorial when they first launch your app or game, don’t present it again on subsequent launches”.
   - Recenzja A (PL, 17.10.2026): „simple enough to be fluent after a minute”.

2. **Przepływ: z szablonu do trwającego treningu prowadzi jedna oczywista akcja, a edycja szablonu jest osobną akcją.** Nowy użytkownik nie może utknąć w edytorze, gdy chce po prostu ćwiczyć. Pusty stan bez szablonów proponuje dwie rzeczy: pusty trening i generator na polecenie.
   Dowód: recenzja C (US, 14.03.2023): „I can’t create a workout from a template, instead of selecting the template to use it just enters the template editor again.”

3. **Treść/przepływ: przy każdym ćwiczeniu widać wynik z poprzedniej sesji w miejscu wpisywania serii.** Dziennik ma sens od drugiego treningu dopiero wtedy, gdy podpowiada, co było ostatnio. Rekord lub e1RM pokazany po pierwszej sesji musi mieć zrozumiały opis po polsku, bez żargonu.
   Dowód: opis A (US): „See last session's weights and reps for every exercise, right where you need them.”

4. **Pieniądze: limit „5 dni treningowych w miesiącu” jest zrozumiały, zanim zadziała.**
   - Użytkownik widzi licznik (np. „3 z 5 w październiku”) i wie, co liczy się jako dzień, na przykład czy dwa treningi tego samego dnia to jeden dzień.
   - Wie, kiedy licznik się odnawia.
   - Wie, co dokładnie się stanie przy 6. dniu: rozpoczęcie zablokowane czy zapis zablokowany. Nigdy nie może to być utrata już wpisanych serii w trakcie treningu.
   Zaskoczenie limitem to w recenzjach C najczęstszy powód oceny 1★.
   Dowód:
   - Recenzja C (US, 23.01.2026): „only let you do 12 workouts and then charges you”.
   - Recenzja C (US, 21.01.2022): „Now I have to find a new app and start over.”

5. **Pieniądze/dane: po wyczerpaniu limitu historia, kopia i eksport działają tak samo jak wcześniej.** Ekran limitu mówi to wprost, żeby użytkownik nie bał się „zakładnika danych”. Limit nie może wymagać usuwania starych treningów.
   Dowód:
   - Opis C: „Delete older workouts to continue using for free.”
   - Recenzja C (US, 21.01.2022), cytowana w pkt 4.
   - Opis aplikacji (zadanie): „historia, kopia i eksport zawsze darmowe”.

6. **Pieniądze: ekran zakupu przed płatnością mówi, co dokładnie daje Pro i za ile.** Pokazuje cenę za okres (miesiąc, rok, dożywotnio) z cennika App Store w zł, różnicę między wariantami i co zostaje za darmo. Cena dożywotnia jest oceniana na tle rynku PL: od 59,99 zł w C do 399,99–499,99 zł w B. Zbyt wysoka cena dożywotnia to w recenzjach C osobny powód 1★.
   Dowód:
   - ARG 3.1.2(c): „Before asking a customer to subscribe, you should clearly describe what the user will get for the price.”
   - Recenzja C (US, 23.01.2026): „45$ is too steep for a fitness tracker.”
   - Ceny: sekcja „Źródła”.

7. **Pieniądze: po zakupie użytkownik od razu widzi jednoznaczne potwierdzenie.** Licznik limitu znika, a stan Pro jest widoczny w Ustawieniach. „Przywróć zakupy” znajduje się w miejscu łatwym do znalezienia. Zakup przerwany, odroczony (Ask to Buy) lub w toku nie zostawia niejasnego stanu.
   Dowód:
   - Recenzja C (US, 11.10.2025): „no notification if I paid or not, and when I log in, I still see the 12 free workouts notification”.
   - ARG 3.1.1: „you should make sure you have a restore mechanism for any restorable in-app purchases”.

8. **Pieniądze/wzrost: prośba o zakup i ocenę pojawia się dopiero po realnym użyciu, a nie przy pierwszym uruchomieniu.** Ekran Pro nie zasłania pierwszego treningu. Prośba o ocenę pojawia się po udanym treningu, nie po zablokowaniu.
   Dowód: HIG-O: „Prefer letting people experience your app or game before prompting them for ratings or purchases.”

9. **Dane: pierwsza kopia powstaje w pierwszym tygodniu bez szukania.** Bez konta i chmury dane żyją tylko na telefonie, więc kopia jest jedyną siatką bezpieczeństwa. Aplikacja proponuje kopię po pierwszych treningach i pokazuje, gdzie w Plikach leży plik. Mówi też, że przywrócenie działa, najlepiej sprawdzając odczyt pliku. Utrata historii to najcięższa skarga w kategorii.
   Dowód: recenzja B (US, 24.09.2026): „recently my workout history has disappeared”.

10. **Prywatność: kopia w Plikach nie zawiera danych odczytanych ze Zdrowia, albo jest to świadomie rozstrzygnięte.** Plik w iCloud Drive może trafić do iCloud. To otwarte pytanie interpretacyjne do sprawdzenia: czy dziennik z danymi czytanymi z HealthKit (np. masa ciała) w pliku kopii podpada pod ten zakaz.
    Dowód: ARG 5.1.3(ii): „Apps must not write false or inaccurate data into HealthKit […] and may not store personal health information in iCloud.”

11. **Prywatność: żadnego zapytania o zgodę przy starcie.** O Zdrowie aplikacja pyta przy pierwszym włączeniu tej funkcji, a o powiadomienia przy pierwszym timerze przerwy. Każde pytanie poprzedza zdanie „po co” po polsku. Odmowa nie psuje treningu: timer działa w aplikacji, a dziennik działa bez Zdrowia.
    Dowód:
    - HIG-P: „Ideally, wait to request permission until people actually use an app feature that requires access.”
    - HIG-H: „Request access to health data only when you need it.”
    - ARG 5.1.1(iii): „Apps should only request access to data relevant to the core functionality of the app”.

12. **Przepływ/wydanie: timer przerwy na ekranie blokady działa od pierwszego treningu, bez prowadzenia za rękę, i nie obciąża telefonu.**
    - Startuje sam po zapisaniu serii.
    - Jest widoczny po zablokowaniu ekranu.
    - Kończy się, gdy kończy się trening.
    - Zostawiony na noc nie wisi dłużej, niż pozwala system.
    Wymaga sprawdzenia na telefonie, bo symulator nie wystarczy.
    Dowód:
    - HIG-L: „Live Activities work best for tracking short to medium duration activities that don’t exceed eight hours.”
    - Recenzja A (US, 26.10.2026): „Shouldn’t be that resource intensive to run a timer and let me input a lift.”

13. **Dane: zegarek nie gubi ani nie podwaja serii.** Gdy pierwsza sesja z Apple Watch zawodzi, nowy użytkownik traci zaufanie do całego dziennika. Serie z zegarka i telefonu dają jeden spójny trening, a przy konflikcie wygrywa reguła znana użytkownikowi.
    Dowód:
    - Recenzja B (US, 30.09.2026): „Often, the apple watch sync removes sets”.
    - Recenzja B (PL, 07.12.2022): „doubling my sets”.

14. **Treść: aplikacja mówi naturalnym polskim od pierwszego ekranu, także w sklepie, w ekranie zakupu i w komunikatach o limicie.** Na rynku głównym to realna przewaga: B ma 11 języków bez polskiego, C ma 3, A ma polski. Teksty o limicie i cenie muszą być jednoznaczne po polsku, a nie dosłownym przekładem.
    Dowód:
    - Recenzja B (PL, 15.02.2022): „Add Polish language Please”.
    - Listy języków: pole `languageCodesISO2A` w API Lookup (A: 16 z PL, B: 11 bez PL, C: 3).

15. **Przepływ/dane/wzrost: import CSV i generator planu, jeśli proponowane w pierwszym tygodniu, działają do końca w aplikacji.**
    - Import pokazuje, co i ile wczytał, nie odsyła na stronę www i nie zużywa limitu darmowych dni na historię z innej aplikacji. To ostatnie wymaga decyzji właściciela.
    - Generator jest dla początkującego odpowiedzią na „nie wiem, co ćwiczyć”, ale tylko jako propozycja do przejrzenia, bez porad medycznych.
    - Strona w sklepie pokazuje status przedsiębiorcy w UE. Brak tego statusu sklep komunikuje jako brak praw konsumenta.
    Dowód:
    - Recenzja C (US, 25.08.2022): „Upon opening the app it prompts me to import data from other apps but the link just goes to their homepage”.
    - Opis A (US): „It builds a program tailored to your experience, goal, available equipment, and preferences.”
    - Strona C (PL): „consumer rights do not apply to agreements between you and the provider.”

## Uwagi do dowodów

- Opis B o modelu darmowym (cytat z nazwą zastąpioną): „The free version of [alternatywa B] can save unlimited workouts, but is limited to 3 custom routines.” Źródło: Lookup PL/US, 27.10.2026, zweryfikowane na surowym tekście. To kontrapunkt do pkt 4: rynek zna limity funkcji, a limit liczby treningów spotyka się z najostrzejszą krytyką.
- Pkt 10 to interpretacja wytycznej. Oznaczono ją jako otwartą i nie traktuje się jej jako ustalonej.
- Cytaty z HIG sprawdzone na surowym JSON stron (developer.apple.com/tutorials/data/design/human-interface-guidelines/*.json). Cytaty z ARG sprawdzone na surowym HTML.
